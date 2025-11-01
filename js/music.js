(() => {
  const DEFAULT_ACCENT = "#ff3bd4";
  const TRACKS = [
    {
      id: "doomsday",
      title: "DOOMSDAY",
      src: "assets/audio/doomsday.mp3",
      accent: "#ff4de1",
      tagline: "Vault Tape 01 — fallout overture",
      meta: "Produced by MOTTO"
    },
    {
      id: "motto",
      title: "MOTTO",
      src: "assets/audio/motto.mp3",
      accent: "#47d8ff",
      tagline: "Signature theme from the neon vault",
      meta: "Mix & Master: HAZ HAUS"
    },
    {
      id: "drag",
      title: "DRAG",
      src: "assets/audio/drag.mp3",
      accent: "#ffa94d",
      tagline: "Turbo pop with midnight teeth",
      meta: "BPM 132 — Key F♯m"
    },
    {
      id: "getlo",
      title: "7777 (GET LO)",
      src: "assets/audio/7777_getlo.mp3",
      accent: "#5cff9c",
      tagline: "Basement rave transmission",
      meta: "Featuring: MOTTO collective"
    },
    {
      id: "dna",
      title: "DNA FERRARI",
      src: "assets/audio/dna_ferrari.mp3",
      accent: "#ff5b69",
      tagline: "Chromed-out hyperdrive anthem",
      meta: "BPM 118 — Key Dm"
    },
    {
      id: "break",
      title: "BREAK",
      src: "assets/audio/break.mp3",
      accent: "#9f6bff",
      tagline: "Vocal chop frenzy with attitude",
      meta: "MOTTO Vault Exclusive Cut"
    },
    {
      id: "close",
      title: "CLOSE ENCOUNTER",
      src: "assets/audio/close_encounter.mp3",
      accent: "#00f7ff",
      tagline: "After-hours visitation sequence",
      meta: "BPM 126 — Key Bm"
    }
  ];

  const list = document.getElementById("musicList");
  if (!list) return;

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  const hexToRgba = (hex, alpha) => {
    if (!hex) return `rgba(255, 59, 212, ${alpha})`;
    let value = hex.replace("#", "").trim();
    if (value.length === 3) {
      value = value.split("").map((ch) => ch + ch).join("");
    }
    if (value.length !== 6) return `rgba(255, 59, 212, ${alpha})`;
    const r = parseInt(value.slice(0, 2), 16);
    const g = parseInt(value.slice(2, 4), 16);
    const b = parseInt(value.slice(4, 6), 16);
    if ([r, g, b].some((n) => Number.isNaN(n))) {
      return `rgba(255, 59, 212, ${alpha})`;
    }
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const formatTime = (seconds) => {
    if (!Number.isFinite(seconds) || seconds < 0) return "--:--";
    const total = Math.floor(seconds);
    const m = Math.floor(total / 60);
    const s = String(total % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  const setFill = (rangeEl, value, duration) => {
    const pct = duration > 0 ? clamp((value / duration) * 100, 0, 100) : 0;
    rangeEl.style.setProperty("--p", `${pct.toFixed(2)}%`);
  };

  let currentAudio = null;
  const shareTimers = new WeakMap();

  const createTrack = (track, index) => {
    const item = document.createElement("li");
    item.className = "track";
    item.tabIndex = 0;
    item.setAttribute("role", "group");
    item.id = `track-${track.id}`;
    item.dataset.track = track.id;
    const accent = track.accent || DEFAULT_ACCENT;
    item.style.setProperty("--track-accent", accent);
    item.style.setProperty("--track-accent-soft", track.accentSoft || hexToRgba(accent, 0.18));
    item.style.setProperty("--track-accent-strong", track.accentStrong || hexToRgba(accent, 0.38));

    const trackNumber = String(index + 1).padStart(2, "0");

    item.innerHTML = `
      <div class="track__visual" aria-hidden="true">
        <div class="track__pulse">
          <span></span><span></span><span></span><span></span>
        </div>
        <button type="button" class="track__play" aria-pressed="false" aria-label="Play ${track.title}"></button>
        <span class="track__index">${trackNumber}</span>
      </div>
      <div class="track__body">
        <div class="track__header">
          <div class="track__titles">
            <div class="track__title">${track.title}</div>
            ${track.tagline ? `<p class="track__tagline">${track.tagline}</p>` : ""}
          </div>
          <div class="track__time" aria-live="polite">
            <span class="track__time-current">0:00</span>
            <span class="track__time-divider" aria-hidden="true">/</span>
            <span class="track__time-total">--:--</span>
          </div>
        </div>
        <input class="track__seek" type="range" min="0" value="0" step="1" aria-label="${track.title} playback position" />
        <div class="track__footer">
          ${track.meta ? `<span class="track__meta">${track.meta}</span>` : ""}
          <div class="track__actions">
            <button type="button" class="track__action track__action--share" aria-label="Copy link to ${track.title}">
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M12 3a1 1 0 0 1 1 1v7.59l2.3-2.3a1 1 0 0 1 1.4 1.42l-4.01 4a1 1 0 0 1-1.4 0l-3.99-4a1 1 0 1 1 1.4-1.42l2.3 2.3V4a1 1 0 0 1 1-1Zm0 18a1 1 0 0 1-1-1v-4a1 1 0 1 1 2 0v4a1 1 0 0 1-1 1Z" fill="currentColor"/>
              </svg>
            </button>
            <a class="track__action track__action--download" href="${track.src}" download aria-label="Download ${track.title}">
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M12 3a1 1 0 0 1 1 1v9.59l2.3-2.3a1 1 0 0 1 1.4 1.42l-4.01 4a1 1 0 0 1-1.4 0l-3.99-4a1 1 0 0 1 1.4-1.42l2.3 2.3V4a1 1 0 0 1 1-1Zm-7 12a1 1 0 0 1 1 1v2h12v-2a1 1 0 1 1 2 0v3a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1Z" fill="currentColor"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
      <audio preload="metadata" src="${track.src}"></audio>
    `;

    const audio = item.querySelector("audio");
    const playBtn = item.querySelector(".track__play");
    const seek = item.querySelector(".track__seek");
    const currentEl = item.querySelector(".track__time-current");
    const totalEl = item.querySelector(".track__time-total");
    const shareBtn = item.querySelector(".track__action--share");

    const updateButton = (playing) => {
      playBtn.setAttribute("aria-pressed", String(playing));
      playBtn.setAttribute("aria-label", `${playing ? "Pause" : "Play"} ${track.title}`);
      item.classList.toggle("is-playing", playing);
    };

    const refresh = () => {
      const duration = audio.duration || Number(seek.max) || 0;
      const now = audio.currentTime || 0;
      currentEl.textContent = formatTime(now);
      if (!seek.matches(":active")) {
        seek.value = String(Math.floor(now));
      }
      setFill(seek, now, duration);
    };

    const togglePlay = () => {
      if (audio.paused) {
        if (currentAudio && currentAudio !== audio) {
          currentAudio.pause();
          currentAudio.currentTime = 0;
        }
        currentAudio = audio;
        audio.play().catch(() => {});
      } else {
        audio.pause();
        currentAudio = null;
      }
    };

    const handleKey = (event) => {
      const { key } = event;
      if (key === " " || key === "Spacebar" || key === "Enter") {
        event.preventDefault();
        togglePlay();
        return;
      }
      if (key === "ArrowLeft" || key === "ArrowRight") {
        event.preventDefault();
        const duration = audio.duration || Number(seek.max) || 0;
        if (duration <= 0) return;
        const delta = key === "ArrowLeft" ? -5 : 5;
        audio.currentTime = clamp((audio.currentTime || 0) + delta, 0, duration);
        refresh();
      }
    };

    seek.value = "0";
    seek.min = "0";
    seek.max = "0";
    setFill(seek, 0, 0);

    playBtn.addEventListener("click", (e) => {
      e.preventDefault();
      togglePlay();
    });
    item.addEventListener("keydown", (e) => {
      if (e.target === item) handleKey(e);
    });
    playBtn.addEventListener("keydown", handleKey);

    audio.addEventListener("loadedmetadata", () => {
      const duration = audio.duration || 0;
      totalEl.textContent = formatTime(duration);
      seek.max = String(Math.max(0, Math.floor(duration)));
      refresh();
    });

    audio.addEventListener("timeupdate", refresh);

    audio.addEventListener("play", () => {
      currentAudio = audio;
      updateButton(true);
      refresh();
    });

    audio.addEventListener("pause", () => {
      updateButton(false);
      if (currentAudio === audio) {
        currentAudio = null;
      }
    });

    audio.addEventListener("ended", () => {
      audio.currentTime = 0;
      refresh();
      updateButton(false);
      if (currentAudio === audio) {
        currentAudio = null;
      }
    });

    seek.addEventListener("input", () => {
      const duration = audio.duration || Number(seek.max) || 0;
      const value = clamp(seek.valueAsNumber || Number(seek.value) || 0, 0, duration);
      audio.currentTime = value;
      currentEl.textContent = formatTime(value);
      setFill(seek, value, duration);
    });

    if (shareBtn) {
      shareBtn.addEventListener("click", async () => {
        const baseHref = window.location.href.split("#")[0];
        const shareUrl = `${baseHref}#${track.id}`;
        const existingTimer = shareTimers.get(shareBtn);
        if (existingTimer) {
          clearTimeout(existingTimer);
          shareTimers.delete(shareBtn);
        }
        shareBtn.dataset.feedback = "";

        const setFeedback = (state) => {
          shareBtn.dataset.feedback = state;
          const timerId = window.setTimeout(() => {
            shareBtn.dataset.feedback = "";
            shareTimers.delete(shareBtn);
          }, 1800);
          shareTimers.set(shareBtn, timerId);
        };

        try {
          if (navigator.share) {
            await navigator.share({ title: track.title, url: shareUrl });
            setFeedback("shared");
            return;
          }
          if (navigator.clipboard?.writeText) {
            await navigator.clipboard.writeText(shareUrl);
            setFeedback("copied");
            return;
          }
        } catch (error) {
          if (error && error.name === "AbortError") {
            return;
          }
          console.info("Share failed", error);
          setFeedback("cancelled");
          return;
        }

        const fallback = window.prompt("Copy link to this track:", shareUrl);
        if (fallback !== null) {
          setFeedback("copied");
        }
      });
    }

    updateButton(false);
    refresh();
    return item;
  };

  TRACKS.map((track, index) => createTrack(track, index)).forEach((trackEl) => list.appendChild(trackEl));
})();
