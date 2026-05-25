import { useTheme } from "../context/ThemeContext";
import { useRef, useState, useEffect } from "react";

export default function ThemePanel({ open, onClose }) {
  const {
    accent,
    bgKey,
    accentKey,
    setAccentKey,
    setBgKey,
    ACCENTS,
    BACKGROUNDS,
  } = useTheme();
  const fileInputRef = useRef(null);
  const [customImage, setCustomImage] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("zeroclock_custom_bg");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Date.now() < parsed.expiry) {
          setCustomImage(parsed.data);
        } else {
          localStorage.removeItem("zeroclock_custom_bg");
          localStorage.setItem("zeroclock_use_custom", "false");
          if (bgKey === "custom") setBgKey("void");
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, [bgKey, setBgKey]);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_W = 1920;
        const MAX_H = 1080;
        let w = img.width;
        let h = img.height;

        if (w > h) {
          if (w > MAX_W) {
            h *= MAX_W / w;
            w = MAX_W;
          }
        } else {
          if (h > MAX_H) {
            w *= MAX_H / h;
            h = MAX_H;
          }
        }

        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, w, h);

        const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
        setCustomImage(dataUrl);

        const expiry = Date.now() + 30 * 24 * 60 * 60 * 1000;
        try {
          localStorage.setItem(
            "zeroclock_custom_bg",
            JSON.stringify({ data: dataUrl, expiry }),
          );
          localStorage.setItem("zeroclock_use_custom", "true");
        } catch (err) {
          console.error(err);
        }

        if (BACKGROUNDS && !BACKGROUNDS.custom) {
          BACKGROUNDS.custom = {
            name: "Custom Image",
            bg: "#000",
            border: "#222",
            card: "#111",
            light: false,
          };
        }
        setBgKey("custom");
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const removeCustomImage = (e) => {
    e.stopPropagation();
    setCustomImage(null);
    localStorage.removeItem("zeroclock_custom_bg");
    localStorage.setItem("zeroclock_use_custom", "false");
    if (bgKey === "custom") setBgKey("void");
  };

  const handleBgSelect = (key) => {
    setBgKey(key);
    if (key === "custom") {
      localStorage.setItem("zeroclock_use_custom", "true");
    } else {
      localStorage.setItem("zeroclock_use_custom", "false");
    }
  };

  const renderBackgrounds = () => {
    const bgList = Object.entries(BACKGROUNDS);

    if (customImage && !BACKGROUNDS.custom) {
      BACKGROUNDS.custom = {
        name: "Custom Image",
        bg: "#000",
        border: "#222",
        card: "#111",
        light: false,
      };
    }

    const voidIndex = bgList.findIndex(([key]) => key === "void");

    const renderedBgs = bgList.map(([key, val]) => (
      <button
        key={key}
        onClick={() => handleBgSelect(key)}
        className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left group relative"
        style={{
          background: bgKey === key ? accent.primary + "14" : "transparent",
          border: `1px solid ${bgKey === key ? accent.primary + "55" : "var(--border)"}`,
          cursor: "pointer",
        }}
      >
        <div
          className="w-7 h-7 rounded-lg flex-shrink-0 relative overflow-hidden flex items-center justify-center"
          style={{
            background:
              key === "custom" && customImage
                ? `url(${customImage}) center/cover`
                : val.bg,
            border: `2px solid ${val.border}`,
            boxShadow: `inset 0 0 0 2px ${val.card}`,
          }}
        >
          {key === "custom" && !customImage && (
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          )}
        </div>
        <div className="flex-1">
          <p
            style={{
              fontFamily: "'Space Mono',monospace",
              fontSize: 11,
              color: bgKey === key ? accent.primary : "var(--text-primary)",
            }}
          >
            {val.name}
          </p>
          <p
            style={{
              fontFamily: "'Space Mono',monospace",
              fontSize: 9,
              color: "var(--text-muted)",
              marginTop: 1,
            }}
          >
            {key === "custom" ? "Local" : val.light ? "Light" : "Dark"}
          </p>
        </div>
        {key === "custom" && customImage && (
          <div
            onClick={removeCustomImage}
            className="w-6 h-6 flex items-center justify-center rounded-full bg-red-500/20 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity mr-1"
            title="Remove image"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </div>
        )}
        {bgKey === key && (
          <div className="ml-auto">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke={accent.primary}
              strokeWidth="3"
            >
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
        )}
      </button>
    ));

    const customButton = (
      <div key="custom-upload">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageUpload}
          accept="image/*"
          className="hidden"
        />
        <button
          onClick={() =>
            customImage
              ? handleBgSelect("custom")
              : fileInputRef.current?.click()
          }
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left group relative"
          style={{
            background:
              bgKey === "custom" ? accent.primary + "14" : "transparent",
            border: `1px dashed ${bgKey === "custom" ? accent.primary + "55" : "var(--border)"}`,
            cursor: "pointer",
          }}
        >
          <div
            className="w-7 h-7 rounded-lg flex-shrink-0 relative overflow-hidden flex items-center justify-center"
            style={{
              background: customImage
                ? `url(${customImage}) center/cover`
                : "transparent",
              border: `2px solid var(--border)`,
            }}
          >
            {!customImage && (
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--text-muted)"
                strokeWidth="2"
              >
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            )}
          </div>
          <div className="flex-1">
            <p
              style={{
                fontFamily: "'Space Mono',monospace",
                fontSize: 11,
                color:
                  bgKey === "custom" ? accent.primary : "var(--text-primary)",
              }}
            >
              {customImage ? "Custom Image" : "Upload Image"}
            </p>
            <p
              style={{
                fontFamily: "'Space Mono',monospace",
                fontSize: 9,
                color: "var(--text-muted)",
                marginTop: 1,
              }}
            >
              Local Storage (30d)
            </p>
          </div>
          {customImage && (
            <div
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              className="w-6 h-6 flex items-center justify-center rounded-full bg-[var(--card)] text-[var(--text-muted)] opacity-0 group-hover:opacity-100 transition-opacity mr-1 border border-[var(--border)]"
              title="Change image"
            >
              <svg
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 20h9"></path>
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
              </svg>
            </div>
          )}
          {customImage && (
            <div
              onClick={removeCustomImage}
              className="w-6 h-6 flex items-center justify-center rounded-full bg-red-500/10 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity border border-red-500/20"
              title="Remove image"
            >
              <svg
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </div>
          )}
          {bgKey === "custom" && (
            <div className="ml-auto pl-2">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke={accent.primary}
                strokeWidth="3"
              >
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
          )}
        </button>
      </div>
    );

    if (voidIndex !== -1) {
      renderedBgs.splice(voidIndex, 0, customButton);
    } else {
      renderedBgs.push(customButton);
    }

    return renderedBgs.filter((item) => item.key !== "custom");
  };

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40"
          onClick={onClose}
          style={{ background: "rgba(0,0,0,0.4)" }}
        />
      )}
      <div
        className="fixed top-0 right-0 h-full z-50 flex flex-col"
        style={{
          width: 280,
          background: "var(--card)",
          borderLeft: "1px solid var(--border)",
          transform: open ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          <div>
            <p
              className="font-display text-xl tracking-widest"
              style={{ color: "var(--text-primary)" }}
            >
              THEMES
            </p>
            <p
              className="font-mono text-xs mt-0.5"
              style={{ color: "var(--text-muted)", fontSize: 10 }}
            >
              Personalize your clock
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full transition-all"
            style={{
              border: "1px solid var(--border)",
              background: "transparent",
              cursor: "pointer",
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--text-muted)"
              strokeWidth="2"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-7">
          <div>
            <p
              className="font-mono text-xs tracking-[0.3em] uppercase mb-3"
              style={{ color: "var(--text-muted)", fontSize: 10 }}
            >
              Accent Color
            </p>
            <div className="grid grid-cols-4 gap-2">
              {Object.entries(ACCENTS).map(([key, val]) => (
                <button
                  key={key}
                  onClick={() => setAccentKey(key)}
                  className="flex flex-col items-center gap-1.5"
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-full transition-all"
                    style={{
                      background: val.primary,
                      boxShadow:
                        accentKey === key
                          ? `0 0 0 3px var(--card), 0 0 0 5px ${val.primary}`
                          : "none",
                      transform: accentKey === key ? "scale(1.1)" : "scale(1)",
                    }}
                  />
                  <span
                    style={{
                      fontFamily: "'Space Mono',monospace",
                      fontSize: 9,
                      color:
                        accentKey === key ? val.primary : "var(--text-muted)",
                    }}
                  >
                    {val.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <p
              className="font-mono text-xs tracking-[0.3em] uppercase mb-3"
              style={{ color: "var(--text-muted)", fontSize: 10 }}
            >
              Background
            </p>
            <div className="flex flex-col gap-2">{renderBackgrounds()}</div>
          </div>

          <div>
            <p
              className="font-mono text-xs tracking-[0.3em] uppercase mb-3"
              style={{ color: "var(--text-muted)", fontSize: 10 }}
            >
              Preview
            </p>
            <div
              className="rounded-2xl p-4 flex flex-col items-center gap-2 relative overflow-hidden"
              style={{
                background:
                  bgKey === "custom" && customImage
                    ? `url(${customImage}) center/cover`
                    : "var(--bg)",
                border: "1px solid var(--border)",
              }}
            >
              {bgKey === "custom" && customImage && (
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
              )}
              <div className="relative z-10 flex flex-col items-center">
                <span
                  className="font-display text-4xl"
                  style={{ color: "var(--text-primary)" }}
                >
                  12<span style={{ color: accent.primary }}>:</span>00
                </span>
                <span
                  style={{
                    fontFamily: "'Space Mono',monospace",
                    fontSize: 11,
                    color: accent.primary,
                  }}
                >
                  AM
                </span>
                <div
                  className="w-full h-px mt-1"
                  style={{ background: "var(--border)" }}
                />
                <div className="flex gap-2 mt-1">
                  {[1, 0.4, 0.2].map((o, i) => (
                    <div
                      key={i}
                      className="w-2 h-2 rounded-full"
                      style={{ background: accent.primary, opacity: o }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
