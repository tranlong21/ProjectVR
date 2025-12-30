import React, { useState, useCallback, useEffect, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import * as handsPkg from '@mediapipe/hands';
import * as cameraPkg from '@mediapipe/camera_utils';
import * as drawingPkg from '@mediapipe/drawing_utils';

// --- CONSTANTS ---
const GAME_SPEED_BASE = 4.5;
const LANE_X_OFFSET = 25;
const OBSTACLE_SPAWN_CHANCE = 0.03; // Tăng spawn rate nhưng dùng spacing để kiểm soát
const MAX_SPEED = 12; // Tăng max speed

const COLORS = {
    LANE_LEFT: '#3b82f6',
    LANE_RIGHT: '#ef4444',
    HAND_SKELETON: '#00ffff',
    HAND_JOINTS: '#ffffff'
};

// --- HAND TRACKER COMPONENT (Game Specific) ---
const GameHandTracker = ({ onHandMove, onVisible, onError, hidePreview = false }) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const cameraRef = useRef(null);
    const handsRef = useRef(null);
    const [stream, setStream] = useState(null);


    // Use refs for callbacks to prevent re-triggering useEffect when props change
    const callbacksRef = useRef({ onHandMove, onVisible, onError });
    // Preview video ref
    const previewVideoRef = useRef(null);

    useEffect(() => {
        callbacksRef.current = { onHandMove, onVisible, onError };
    }, [onHandMove, onVisible, onError]);

    // Handle Preview Video separately to avoid "AbortError"
    useEffect(() => {
        const videoEl = previewVideoRef.current;
        if (videoEl && stream) {
            videoEl.srcObject = stream;
            videoEl.play().catch(e => {
                // Ignore AbortError as it is expected when stream changes quickly
                if (e.name !== 'AbortError') console.error("Preview video play error:", e);
            });
        }
    }, [stream, hidePreview]);

    useEffect(() => {
        let isActive = true; // Prevents race conditions
        let currentStream = null;
        let currentCamera = null;
        let currentHands = null;

        const videoElement = videoRef.current;
        const canvasElement = canvasRef.current;

        if (!videoElement || !canvasElement) return;

        const Hands = handsPkg.Hands || handsPkg.default?.Hands || handsPkg.default;
        const Camera = cameraPkg.Camera || cameraPkg.default?.Camera || cameraPkg.default;
        const drawConnectors = drawingPkg.drawConnectors || drawingPkg.default?.drawConnectors;
        const drawLandmarks = drawingPkg.drawLandmarks || drawingPkg.default?.drawLandmarks;
        const HAND_CONNECTIONS = handsPkg.HAND_CONNECTIONS || handsPkg.default?.HAND_CONNECTIONS;

        if (!Hands || !Camera) {
            callbacksRef.current.onError("Lỗi tải thư viện.", false);
            return;
        }

        const initializeCamera = async () => {
            try {
                const newStream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        width: { ideal: 1280 },
                        height: { ideal: 720 },
                        facingMode: 'user'
                    }
                });

                if (!isActive) {
                    // Component unmounted during await
                    newStream.getTracks().forEach(track => track.stop());
                    return;
                }

                currentStream = newStream;
                setStream(newStream);

                if (videoElement) {
                    videoElement.srcObject = newStream;
                    // Wait for video to be ready before playing to reduce errors
                    videoElement.onloadedmetadata = () => {
                        videoElement.play().catch(e => {
                            if (e.name !== 'AbortError') console.error("Hidden video play error:", e);
                        });
                    };
                }

                // Initialize Hands
                const hands = new Hands({
                    locateFile: (file) => {
                        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
                    },
                });

                currentHands = hands;
                handsRef.current = hands; // Update ref for other usages if needed

                hands.setOptions({
                    maxNumHands: 1,
                    modelComplexity: 1,
                    minDetectionConfidence: 0.5,
                    minTrackingConfidence: 0.5,
                    selfieMode: true,
                });

                hands.onResults((results) => {
                    // Check if canvas context is still valid/available
                    if (!isActive || !canvasElement) return;

                    const canvasCtx = canvasElement.getContext('2d');
                    if (!canvasCtx) return;

                    canvasCtx.save();
                    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

                    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
                        callbacksRef.current.onVisible(true);
                        let totalX = 0;

                        results.multiHandLandmarks.forEach((landmarks) => {
                            totalX += landmarks[0].x;

                            if (drawConnectors && HAND_CONNECTIONS) {
                                drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, {
                                    color: COLORS.HAND_SKELETON,
                                    lineWidth: 2,
                                });
                            }

                            if (drawLandmarks) {
                                drawLandmarks(canvasCtx, landmarks, {
                                    color: COLORS.HAND_JOINTS,
                                    fillColor: COLORS.HAND_SKELETON,
                                    lineWidth: 1,
                                    radius: 2
                                });
                            }
                        });

                        const avgX = totalX / results.multiHandLandmarks.length;
                        callbacksRef.current.onHandMove(avgX);
                    } else {
                        callbacksRef.current.onVisible(false);
                    }
                    canvasCtx.restore();
                });

                // Initialize Camera Utils
                const camera = new Camera(videoElement, {
                    onFrame: async () => {
                        if (isActive && hands && videoElement.readyState >= 2) {
                            try {
                                await hands.send({ image: videoElement });
                            } catch (e) { }
                        }
                    },
                    width: 1280,
                    height: 720,
                });

                currentCamera = camera;
                cameraRef.current = camera;

                await camera.start();

            } catch (err) {
                console.error("Camera Init Error:", err);
                if (isActive) {
                    const isPermission = err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError';
                    callbacksRef.current.onError(isPermission ? "Cần quyền Camera." : "Lỗi camera: " + err.message, isPermission);
                }
            }
        };

        if (isActive) {
            initializeCamera();
        }

        return () => {
            isActive = false;

            // Cleanup function
            if (currentStream) {
                currentStream.getTracks().forEach(track => track.stop());
            }
            // Determine if we need to manually stop camera utils (it often loops requestAnimationFrame)
            if (currentCamera) {
                // Try catch in case stop causes issues
                try { currentCamera.stop(); } catch (e) { }
            }
            if (currentHands) {
                try { currentHands.close(); } catch (e) { }
            }

            // Clear refs
            cameraRef.current = null;
            handsRef.current = null;
        };
    }, []);

    return (
        <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
            <video ref={videoRef} className="hidden" muted playsInline />
            <canvas
                ref={canvasRef}
                width={window.innerWidth}
                height={window.innerHeight}
                className={`w-full h-full transition-opacity duration-500 ${hidePreview ? 'opacity-20' : 'opacity-70'}`}
            />
            {!hidePreview && (
                <div className="absolute top-24 right-6 w-32 h-24 rounded-2xl overflow-hidden border-2 border-cyan-400 shadow-[0_0_20px_rgba(0,255,255,0.3)] bg-black/80">
                    <video
                        ref={previewVideoRef}
                        muted
                        playsInline
                        className="w-full h-full object-cover scale-x-[-1]"
                    />
                    <div className="absolute bottom-1 left-0 right-0 text-center">
                        <div className="text-[8px] font-black text-cyan-400 uppercase bg-black/60 py-0.5">Cảm biến tay</div>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- GAME ENGINE COMPONENT ---
const GameEngine = ({ lane, isPlaying, onGameOver, onUpdateScore, onPassObstacle }) => {
    const canvasRef = useRef(null);

    // Sử dụng Refs để lưu trữ trạng thái game mà không trigger re-render
    const laneRef = useRef(lane);
    const obstaclesRef = useRef([]);
    const bikePosRef = useRef(0.5);
    const speedRef = useRef(GAME_SPEED_BASE);
    const spawnCooldownRef = useRef(0);
    const scoreRef = useRef(0);
    const isPlayingRef = useRef(isPlaying);

    // Quan trọng: Lưu callback vào Ref để tránh dependency lặp trong useEffect
    const onGameOverRef = useRef(onGameOver);
    const onUpdateScoreRef = useRef(onUpdateScore);
    const onPassObstacleRef = useRef(onPassObstacle);

    useEffect(() => {
        onGameOverRef.current = onGameOver;
        onUpdateScoreRef.current = onUpdateScore;
        onPassObstacleRef.current = onPassObstacle;
    }, [onGameOver, onUpdateScore, onPassObstacle]);

    useEffect(() => {
        laneRef.current = lane;
    }, [lane]);

    useEffect(() => {
        isPlayingRef.current = isPlaying;
        if (isPlaying) {
            scoreRef.current = 0;
            obstaclesRef.current = [];
            speedRef.current = GAME_SPEED_BASE;
            // Khởi tạo vị trí xe về giữa khi bắt đầu chơi
            bikePosRef.current = 0.5;
        }
    }, [isPlaying]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Fix canvas size
        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        let animationFrameId;

        const updatePhysics = () => {
            if (!isPlayingRef.current) return;

            // Tăng tốc độ theo thời gian (chậm hơn để dễ thở)
            if (speedRef.current < MAX_SPEED) {
                speedRef.current += 0.0001;
            }

            // --- Spawn obstacle with controlled spacing ---
            if (spawnCooldownRef.current > 0) {
                spawnCooldownRef.current -= speedRef.current;
            } else {
                // Độ khó tăng dần theo score (0 → 1)
                const difficulty = Math.min(scoreRef.current / 800, 1);

                // Xác suất spawn (tăng nhẹ theo độ khó)
                const spawnChance = 0.012 + difficulty * 0.01; // ~1.2% → ~2.2%

                if (Math.random() < spawnChance) {
                    obstaclesRef.current.push({
                        id: Date.now() + Math.random(),
                        lane: Math.random() > 0.5 ? 1 : 0,
                        y: -120,
                        // 70% ổ gà – 30% ổ vịt (đá)
                        type: Math.random() < 0.7 ? 'pothole' : 'rock',
                    });

                    // Cooldown tạo nhịp thở (tốc độ cao → ít nghỉ hơn)
                    spawnCooldownRef.current = 260 - speedRef.current * 10;
                }
            }

            // Vị trí player (bike) trong không gian canvas
            const bikeX = bikePosRef.current * canvas.width;
            const bikeY = canvas.height * 0.85;

            // Cập nhật và kiểm tra va chạm
            obstaclesRef.current = obstaclesRef.current.filter((obs) => {
                obs.y += speedRef.current;

                const obsX = (obs.lane === 0 ? 0.35 : 0.65) * canvas.width;

                // Kiểm tra va chạm
                const dx = bikeX - obsX;
                const dy = bikeY - obs.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 50) { // Hitbox
                    isPlayingRef.current = false;
                    onGameOverRef.current(scoreRef.current);
                    return false;
                }

                // Check passed (nếu chưa pass và đã đi qua xe)
                if (!obs.passed && obs.y > bikeY + 20) {
                    obs.passed = true;
                    if (onPassObstacleRef.current) onPassObstacleRef.current();
                }

                return obs.y < canvas.height + 200;
            });

            // Cập nhật điểm
            scoreRef.current += 1;
            if (scoreRef.current % 5 === 0) {
                onUpdateScoreRef.current(scoreRef.current);
            }
        };

        const draw = () => {
            const w = canvas.width;
            const h = canvas.height;
            ctx.clearRect(0, 0, w, h);

            // Vẽ đường (Road)
            ctx.fillStyle = '#1e293b';
            ctx.fillRect(w * 0.25, 0, w * 0.5, h);

            // Vẽ vạch kẻ đường (Lanes)
            [0.35, 0.65].forEach((lx, idx) => {
                ctx.beginPath();
                ctx.setLineDash([40, 40]);
                ctx.lineDashOffset = -(speedRef.current * scoreRef.current * 0.5) % 80;
                ctx.moveTo(lx * w, 0);
                ctx.lineTo(lx * w, h);
                ctx.strokeStyle = idx === 0 ? COLORS.LANE_LEFT : COLORS.LANE_RIGHT;
                ctx.lineWidth = 6;
                ctx.stroke();
            });
            ctx.setLineDash([]);

            // Vẽ vật cản (Obstacles)
            obstaclesRef.current.forEach(obs => {
                const ox = (obs.lane === 0 ? 0.35 : 0.65) * w;

                ctx.save();
                ctx.translate(ox, obs.y);

                if (obs.type === 'rock') {
                    // Hòn đá
                    ctx.fillStyle = '#475569';
                    ctx.beginPath();
                    ctx.moveTo(-25, 10);
                    ctx.lineTo(0, -25);
                    ctx.lineTo(25, 15);
                    ctx.closePath();
                    ctx.fill();
                    ctx.strokeStyle = '#94a3b8';
                    ctx.lineWidth = 2;
                    ctx.stroke();
                } else {
                    // Ổ gà
                    ctx.fillStyle = '#0f172a';
                    ctx.beginPath();
                    ctx.ellipse(0, 0, 35, 20, 0, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.strokeStyle = '#ef444455';
                    ctx.lineWidth = 3;
                    ctx.stroke();
                }
                ctx.restore();
            });

            // Cập nhật vị trí xe (Smooth movement)
            const targetPos = laneRef.current === 0 ? 0.35 : 0.65;
            bikePosRef.current += (targetPos - bikePosRef.current) * 0.12;

            // Vẽ Xe đạp (Player)
            const px = bikePosRef.current * w;
            const py = h * 0.85;

            ctx.save();
            ctx.translate(px, py);

            // Bóng xe
            ctx.fillStyle = 'rgba(0,0,0,0.3)';
            ctx.beginPath();
            ctx.ellipse(0, 40, 25, 10, 0, 0, Math.PI * 2);
            ctx.fill();

            // Thân xe
            ctx.strokeStyle = '#f59e0b';
            ctx.lineWidth = 5;
            ctx.beginPath();
            ctx.moveTo(0, 30); ctx.lineTo(0, -30); // Khung dọc
            ctx.moveTo(-25, -15); ctx.lineTo(25, -15); // Tay lái
            ctx.stroke();

            // Bánh xe (trước/sau nhìn từ trên xuống)
            ctx.fillStyle = '#111';
            ctx.fillRect(-6, -40, 12, 20);
            ctx.fillRect(-6, 20, 12, 20);

            // Yên xe
            ctx.fillStyle = '#333';
            ctx.beginPath();
            ctx.ellipse(0, 10, 10, 18, 0, 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();
        };

        const gameLoop = () => {
            updatePhysics();
            draw();
            animationFrameId = requestAnimationFrame(gameLoop);
        };

        animationFrameId = requestAnimationFrame(gameLoop);

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', resize);
        };
    }, []); // Empty dependency array ensures this runs once and uses Refs

    return (
        <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full"
        />
    );
};

// --- MAIN PAGE COMPONENT ---
const ThaiBikeGame = ({ onExit }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isGameOver, setIsGameOver] = useState(false);
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const [lane, setLane] = useState(0); // 0: Left, 1: Right
    const [handVisible, setHandVisible] = useState(false);
    const [taunt, setTaunt] = useState("");
    const [cameraError, setCameraError] = useState(null);
    const [countdown, setCountdown] = useState(0);
    const [inGameMessage, setInGameMessage] = useState(""); // Tin nhắn châm chọc khi đua

    const ai = useRef(null);

    const TAUNTS_LOCAL = [
        "Ổ gà: 1 - Bạn: 0. Gà quá em ơi!",
        "Lái 1 tay cho oai rồi xòe!",
        "Trình này thì về lái xe cút kít đi.",
        "Bốc đầu hụt à dân chơi?",
        "Yếu thì đừng ra gió, gà thì đừng đua xe!",
        "Xe đạp không phanh, chủ xe không não!",
        "Sắp tới đích rồi... à mà làm gì có đích.",
        "Tay lái lụa thế này thì chỉ có đi bán muối.",
        "Hết nước chấm, xòe rách cả bỉm!",
        "Cái ổ gà nó cười vào mặt kìa.",
        "Non và xanh lắm!",
        "Chạy xe kiểu này thì nằm đất sớm!",
        "Múa cho cố vô rồi té sấp mặt.",
        "Đua xe không nón, nằm hòm cho gọn.",
        "Vấp cục đá, ngã sấp mặt.",
        "Chưa đỗ ông nghè đã đe hàng tổng.",
        "Định lạng lách đánh võng à? Quên đi cưng.",
        "Xe thì xịn mà nài thì rơm.",
        "Tay lái yếu thì đừng có ra gió.",
        "Xòe đẹp đấy, 10 điểm cho tư thế.",
        "Đường quang không đi đâm quàng bụi rậm.",
        "Khét đấy... khét mùi đất!",
        "Phanh bằng mặt à?",
        "Ảo tưởng sức mạnh ít thôi.",
        "Về vườn chăn vịt đi em ơi.",
        "Lái xe bằng niềm tin à?",
        "Xòe như này thì ai độ nổi.",
        "Tưởng thế nào, hóa ra cũng chỉ thế thôi.",
        "Thua cả bà hàng xóm đi chợ.",
        "Gà vẫn hoàn gà."
    ];

    const PASS_TAUNTS = [
        "Hên đấy!",
        "Non!",
        "Tí thì toang!",
        "Múa lửa à?",
        "Ghê chưa ghê chưa!",
        "Lạng lách đánh võng!",
        "Ảo ma Canada!",
        "Tay lái lụa!",
        "Suýt thì đắp chiếu!",
        "Cẩn thận cái mồm!"
    ];

    const handlePassObstacle = useCallback(() => {
        // 30% cơ hội hiện taunt khi vượt qua chướng ngại vật
        if (Math.random() > 0.3) return;

        const msg = PASS_TAUNTS[Math.floor(Math.random() * PASS_TAUNTS.length)];
        setInGameMessage(msg);

        // Clear message sau 2s
        setTimeout(() => setInGameMessage(""), 2000);
    }, []);

    const fetchTaunt = useCallback(async (isLose) => {
        if (!isLose) {
            setTaunt("Cháy quá dân chơi!");
            return;
        }
        // Randomly select a taunt from the local list
        setTaunt(TAUNTS_LOCAL[Math.floor(Math.random() * TAUNTS_LOCAL.length)]);

    }, []);

    const handleHandMove = useCallback((avgX) => {
        if (avgX < 0.42) {
            setLane(0);
        } else if (avgX > 0.58) {
            setLane(1);
        }
    }, []);

    const startGame = () => {
        if (cameraError) return;
        setIsPlaying(true);
        setIsGameOver(false);
        setScore(0);
        setTaunt("");
        setInGameMessage("");
        setCountdown(3);
    };

    const handleCameraError = useCallback((err) => {
        setCameraError(err);
    }, []);

    useEffect(() => {
        if (isPlaying && countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [isPlaying, countdown]);

    const handleGameOver = useCallback((finalScore) => {
        setIsPlaying(false);
        setIsGameOver(true);
        setScore(finalScore);
        if (finalScore > highScore) setHighScore(finalScore);
        fetchTaunt(true);
    }, [highScore, fetchTaunt]);

    const requestCameraPermission = async () => {
        try {
            await navigator.mediaDevices.getUserMedia({ video: true });
            setCameraError(null);
        } catch (err) {
            setCameraError("Cần quyền Camera.");
        }
    };

    return (
        <div className="fixed inset-0 z-[50] bg-slate-950 flex flex-col items-center justify-center overflow-hidden font-sans select-none">

            {/* EXIT BUTTON (Top Right) */}
            <button
                onClick={onExit}
                className="absolute top-6 right-6 z-[100] p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white transition-all hover:scale-110 active:scale-95 group border border-white/10 hover:border-red-500/50"
                title="Thoát Game"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="group-hover:rotate-90 transition-transform group-hover:text-red-500">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-slate-950 to-black pointer-events-none" />

            <div className="absolute inset-0 z-10">
                <GameEngine
                    lane={lane}
                    isPlaying={isPlaying && countdown === 0}
                    onGameOver={handleGameOver}
                    onUpdateScore={setScore}
                    onPassObstacle={handlePassObstacle}
                />
            </div>

            {!cameraError && (
                <GameHandTracker
                    onHandMove={handleHandMove}
                    onVisible={setHandVisible}
                    onError={handleCameraError}
                    hidePreview={false} // Luôn hiện camera
                />
            )}

            {isPlaying && countdown > 0 && (
                <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
                    <div className="text-[8rem] font-black text-white/10 italic animate-pulse">
                        {countdown}
                    </div>
                    <div className="absolute bottom-1/4 text-center">
                        <div className="text-cyan-400 font-black text-2xl animate-bounce italic uppercase tracking-tighter">
                            Chuẩn bị vít ga!
                        </div>
                        <div className="text-white/30 text-xs font-bold uppercase mt-2 tracking-[0.3em]">Cân chỉnh tay lái 1 tay</div>
                    </div>
                </div>
            )}

            {cameraError && (
                <div className="z-[100] fixed inset-0 bg-black/95 flex items-center justify-center p-6 text-center">
                    <div className="max-w-md bg-slate-900 p-8 rounded-[2rem] border-2 border-red-500 shadow-2xl">
                        <div className="text-5xl mb-4">🚫</div>
                        <h2 className="text-2xl font-black text-white mb-4 italic uppercase">LỖI CAMERA</h2>
                        <p className="text-gray-400 mb-6 text-sm">Game cần camera để biến tay bro thành tay lái. Đừng sợ, không ai xem đâu!</p>
                        <button onClick={requestCameraPermission} className="w-full py-3 bg-cyan-500 text-black font-black rounded-xl hover:scale-105 transition-transform text-sm">CHO PHÉP TRUY CẬP</button>
                    </div>
                </div>
            )}

            {!isPlaying && !isGameOver && !cameraError && (
                <div className="z-50 text-center flex flex-col items-center animate-in fade-in zoom-in duration-700">
                    <h1 className="text-5xl md:text-6xl font-black bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-orange-500 to-red-600 italic mb-2 tracking-tighter leading-none">
                        ĐUA XE ĐẠP THÁI
                    </h1>
                    <p className="text-lg text-white italic mb-8 font-serif opacity-80 drop-shadow-lg">"Xe đạp không thắng, lái 1 tay mới chất"</p>
                    <p className="text-lg text-white italic mb-8 font-serif opacity-80 drop-shadow-lg">"Hãy trổ tài tay lái lụa để né vật cản và chạy về đích."</p>

                    <button
                        onClick={startGame}
                        className="group relative px-12 py-6 bg-white rounded-full transition-all hover:scale-110 active:scale-95 shadow-[0_0_50px_rgba(255,255,255,0.2)] mb-6"
                    >
                        <span className="relative z-10 text-black font-black text-3xl italic tracking-tighter">VÍT GA!</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity blur-xl"></div>
                    </button>

                    <button
                        onClick={onExit}
                        className="px-6 py-2 bg-white/5 hover:bg-white/10 text-white/50 hover:text-white rounded-full font-bold uppercase tracking-widest transition-all text-[10px] border border-transparent hover:border-white/20"
                    >
                        ⬅ Quay lại Showroom
                    </button>

                    <div className="mt-8 flex gap-3">
                        <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] font-black uppercase text-gray-500">No Brakes</div>
                        <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] font-black uppercase text-gray-500">1-Hand Only</div>
                        <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] font-black uppercase text-gray-500">Thai Style</div>
                    </div>
                </div>
            )}

            {isPlaying && (
                <div className="absolute top-6 left-6 z-50 bg-slate-950/50 p-4 rounded-2xl border border-white/10 backdrop-blur-md shadow-lg">
                    <p className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.3em] mb-1">SCORE</p>
                    <p className="text-white text-4xl font-black italic tabular-nums leading-none">{score.toLocaleString()}</p>
                </div>
            )}

            {
                isPlaying && inGameMessage && (
                    <div className="absolute top-1/4 left-1/2 -translate-x-1/2 z-50 animate-in zoom-in duration-300 pointer-events-none">
                        <div className="bg-yellow-400 text-black px-6 py-2 rounded-full font-black text-xl italic transform -rotate-3 shadow-[0_0_20px_rgba(250,204,21,0.6)] whitespace-nowrap">
                            {inGameMessage}
                        </div>
                    </div>
                )
            }

            {
                isGameOver && (
                    <div className="z-50 text-center animate-in zoom-in duration-500 px-6">
                        <div className="bg-slate-950/90 backdrop-blur-3xl p-8 md:p-12 rounded-[3rem] border-4 border-red-600 shadow-[0_0_100px_rgba(239,68,68,0.3)] max-w-lg">
                            <h2 className="text-6xl md:text-7xl font-black text-white italic mb-4 tracking-tighter drop-shadow-[0_5px_15px_rgba(255,255,255,0.3)]">XOÈ!</h2>

                            <div className="bg-red-600 text-white px-6 py-3 rounded-xl text-lg md:text-xl font-black italic mb-8 transform -rotate-2 shadow-xl inline-block">
                                "{taunt}"
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                                    <p className="text-gray-500 text-[10px] font-black uppercase mb-2">QUÃNG ĐƯỜNG</p>
                                    <p className="text-3xl font-black text-white italic">{score}</p>
                                </div>
                                <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                                    <p className="text-gray-500 text-[10px] font-black uppercase mb-2">KỈ LỤC</p>
                                    <p className="text-3xl font-black text-yellow-400 italic">{highScore}</p>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={startGame}
                                    className="w-full py-4 bg-white text-black font-black text-2xl rounded-[1.5rem] hover:bg-yellow-400 transition-colors transform hover:scale-105 active:scale-95 shadow-xl italic tracking-tighter"
                                >
                                    THỬ LẠI PHÁT NỮA
                                </button>
                                <button
                                    onClick={onExit}
                                    className="w-full py-3 bg-transparent border-2 border-white/10 hover:bg-white/5 text-white/50 hover:text-white font-bold text-sm rounded-[1.5rem] transition-colors uppercase tracking-widest"
                                >
                                    THÔI, NGHỈ!
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }

            {
                isPlaying && countdown === 0 && !handVisible && (
                    <div className="absolute inset-0 z-40 bg-red-600/10 backdrop-blur-sm flex items-center justify-center">
                        <div className="bg-black/80 px-8 py-4 rounded-3xl border-2 border-red-500 animate-pulse">
                            <p className="text-white text-xl font-black italic">👋 MẤT TAY LÁI RỒI!</p>
                        </div>
                    </div>
                )
            }
        </div >
    );
};
export default ThaiBikeGame;
