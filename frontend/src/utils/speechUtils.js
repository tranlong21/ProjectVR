let currentUtter = null;

export const speakDescription = (text, lang, onFinish) => {
    window.speechSynthesis.cancel();
    if (!text) return;

    currentUtter = new SpeechSynthesisUtterance(text);
    currentUtter.lang = lang === "vi" ? "vi-VN" : "en-US";
    currentUtter.rate = 1;

    currentUtter.onend = () => {
        currentUtter = null;
        if (onFinish) onFinish();   // 🔥 báo cho UI biết đọc xong
    };

    // Mobile browsers require user interaction.
    // Ensure this function is called from a click event handler.
    window.speechSynthesis.speak(currentUtter);
};

export const stopSpeaking = () => {
    if (currentUtter) {
        window.speechSynthesis.cancel();
        currentUtter = null;
    }
};
