import React, { useState } from 'react';

export default function GestureHelpPanel({ i18n }) {
  const [open, setOpen] = useState(true);

  const isVi = i18n?.language === 'vi';

  const t = isVi
    ? {
      title: "ĐIỀU KHIỂN CỬ CHỈ",
      cursor: "1 ngón: Di chuyển con trỏ",
      click: "2 ngón: Click chọn",
      rotate: "Bàn tay mở: Xoay ảnh",
      zoomIn: "Chụm ngón: Phóng to",
      zoomOut: "2 tay: Thu nhỏ",
    }
    : {
      title: "HAND CONTROLS",
      cursor: "1 finger: Move cursor",
      click: "2 fingers: Click",
      rotate: "Open palm: Rotate view",
      zoomIn: "Pinch: Zoom in",
      zoomOut: "2 hands: Zoom out",
    };

  return (
    <div className="absolute top-2 left-2 z-[30] select-none">
      {/* 🔹 ICON MODE */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
                className="
                            w-11 h-11 rounded-2xl
                            bg-white
                            flex items-center justify-center
                            shadow-xl
                            hover:scale-110 active:scale-95
                            transition-all
                            "
          style={{
            border: '3px solid var(--primary)',
          }}
        >
          <img
            src="/assets/icons/help.png"
            alt="Help"
            className="w-5 h-5"
          />
        </button>
      )}

      {/* 🔹 PANEL MODE */}
      {open && (
        <div className="bg-black/70 border border-white/10 backdrop-blur-lg rounded-2xl p-2 w-[190px] shadow-2xl pointer-events-auto">
          {/* HEADER */}
          <div className="flex items-center justify-between mb-3 border-b border-x-white pb-2">
            <div className="text-blue-400 font-black text-[10px] tracking-[0.2em] uppercase">
              {t.title}
            </div>

            <button
              onClick={() => setOpen(false)}
              className="text-white/60 hover:text-white text-xs px-1"
              title="Close"
            >
              ✕
            </button>
          </div>

          <div className="space-y-2">
            <Item icon="☝️" text={t.cursor} />
            <Item icon="✌️" text={t.click} />
            <Item icon="🖐️" text={t.rotate} />
            <Item icon="🤏" text={t.zoomIn} />
            <Item icon="👐" text={t.zoomOut} />
          </div>
        </div>
      )}
    </div>
  );
}

function Item({ icon, text }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-lg w-6 text-center">{icon}</span>
      <span className="text-[10px] font-bold text-white/90 uppercase">
        {text}
      </span>
    </div>
  );
}
