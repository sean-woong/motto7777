(() => {
  const TRACKS = [
    { id: "doomsday", title: "DOOMSDAY", src: "assets/audio/doomsday.mp3" },
    { id: "motto", title: "MOTTO", src: "assets/audio/motto.mp3" },
    { id: "drag", title: "DRAG", src: "assets/audio/drag.mp3" },
    { id: "getlo", title: "7777 (GET LO)", src: "assets/audio/7777_getlo.mp3" },
    { id: "dna", title: "DNA FERRARI", src: "assets/audio/dna_ferrari.mp3" },
    { id: "break", title: "BREAK", src: "assets/audio/break.mp3" },
    { id: "close", title: "CLOSE ENCOUNTER", src: "assets/audio/close_encounter.mp3" }
  ];

  const list = document.getElementById("musicList");
  if (!list) return;

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

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

  const createTrack = (track) => {
    const item = document.createElement("li");
    item.className = "track";
    item.tabIndex = 0;
    item.setAttribute("role", "group");

    item.innerHTML = `
      <button type="button" class="track__play" aria-pressed="false" aria-label="Play ${track.title}"></button>
      <div class="track__title">${track.title}</div>
      <div class="track__time">
        <span class="track__time-current">0:00</span> / <span class="track__time-total">--:--</span>
      </div>
      <input class="track__seek" type="range" min="0" value="0" step="1" aria-label="${track.title} playback position" />
      <audio preload="metadata" src="${track.src}"></audio>
    `;

    const audio = item.querySelector("audio");
    const playBtn = item.querySelector(".track__play");
    const seek = item.querySelector(".track__seek");
    const currentEl = item.querySelector(".track__time-current");
    const totalEl = item.querySelector(".track__time-total");

    const updateButton = (playing) => {
      playBtn.setAttribute("aria-pressed", String(playing));
      playBtn.setAttribute("aria-label", `${playing ? "Pause" : "Play"} ${track.title}`);
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
      item.classList.add("is-playing");
      updateButton(true);
      refresh();
    });

    audio.addEventListener("pause", () => {
      item.classList.remove("is-playing");
      updateButton(false);
      if (currentAudio === audio) {
        currentAudio = null;
      }
    });

    audio.addEventListener("ended", () => {
      audio.currentTime = 0;
      refresh();
      item.classList.remove("is-playing");
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

    updateButton(false);
    refresh();
    return item;
  };

  TRACKS.map(createTrack).forEach((trackEl) => list.appendChild(trackEl));
})();
