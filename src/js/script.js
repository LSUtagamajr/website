document.addEventListener("DOMContentLoaded", () => {
  const renderIcons = () => {
    if (typeof lucide !== "undefined") {
      lucide.createIcons();
    }
  };
  renderIcons();

  
  const supportsFinePointer =
    window.matchMedia && window.matchMedia("(pointer: fine)").matches;

  if (supportsFinePointer) {
    const ambientBg = document.querySelector(".portfolio-ambient-bg");
    const cursorDot = document.querySelector(".cursor-dot");
    const cursorRing = document.querySelector(".cursor-ring");
    const hoverTargets = "a, button, .btn, .tech-pill, .cert-note, input, textarea";

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let ringX = targetX;
    let ringY = targetY;
    let spotX = targetX;
    let spotY = targetY;
    let rafId = null;
    let idleTimer = null;

    const animateRing = () => {
      ringX += (targetX - ringX) * 0.18;
      ringY += (targetY - ringY) * 0.18;
      spotX += (targetX - spotX) * 0.09;
      spotY += (targetY - spotY) * 0.09;

      if (cursorRing) {
        cursorRing.style.left = `${ringX}px`;
        cursorRing.style.top = `${ringY}px`;
      }

      if (ambientBg) {
        ambientBg.style.setProperty("--spot-x", `${spotX}px`);
        ambientBg.style.setProperty("--spot-y", `${spotY}px`);
      }

      rafId = requestAnimationFrame(animateRing);
    };

    document.addEventListener("mousemove", (e) => {
      targetX = e.clientX;
      targetY = e.clientY;

      if (ambientBg) {
        ambientBg.classList.add("spot-active");
      }

      if (cursorDot) {
        cursorDot.style.left = `${e.clientX}px`;
        cursorDot.style.top = `${e.clientY}px`;
        cursorDot.classList.add("is-active");
      }
      if (cursorRing) cursorRing.classList.add("is-active");

      document.body.classList.add("custom-cursor-on");

      if (rafId === null) animateRing();

      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        if (ambientBg) ambientBg.classList.remove("spot-active");
      }, 650);
    });

    document.addEventListener("mouseleave", () => {
      if (ambientBg) ambientBg.classList.remove("spot-active");
      if (cursorDot) cursorDot.classList.remove("is-active");
      if (cursorRing) cursorRing.classList.remove("is-active");
    });

    document.querySelectorAll(hoverTargets).forEach((el) => {
      el.addEventListener("mouseenter", () => {
        if (cursorRing) cursorRing.classList.add("is-hovering");
      });
      el.addEventListener("mouseleave", () => {
        if (cursorRing) cursorRing.classList.remove("is-hovering");
      });
    });
  }

  
  const themeToggleBtn = document.querySelector(".theme-btn");

  if (themeToggleBtn) {
    const savedTheme = localStorage.getItem("theme");
    const isDark = savedTheme === "dark";

    document.body.classList.toggle("dark", isDark);
    themeToggleBtn.innerHTML = `<i class="mode-icon" data-lucide="${isDark ? "sun" : "moon"}"></i>`;
    renderIcons();

    themeToggleBtn.addEventListener("click", () => {
      const isDarkNow = document.body.classList.toggle("dark");
      localStorage.setItem("theme", isDarkNow ? "dark" : "light");

      const iconEl = themeToggleBtn.querySelector(".mode-icon");
      if (iconEl) {
        iconEl.setAttribute("data-lucide", isDarkNow ? "sun" : "moon");
      } else {
        themeToggleBtn.innerHTML = `<i class="mode-icon" data-lucide="${isDarkNow ? "sun" : "moon"}"></i>`;
      }
      renderIcons();
    });
  }

  
  const revealElements = document.querySelectorAll(
    ".hero-content, .about-cards-stack, .tech-marquee, .about-grid, .edu-timeline, .projects-grid, .pricing-wrap, .cert-grid, .contact-grid"
  );

  if (revealElements.length > 0 && "IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Reveal once and leave it revealed — don't hide content again
          // just because it scrolled out of view (that was making whole
          // sections go blank when scrolling back up, especially on mobile).
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { root: null, threshold: 0.02, rootMargin: "0px 0px -20px 0px" }
    );

    revealElements.forEach((el) => {
      el.classList.add("scroll-reveal");
      revealObserver.observe(el);
    });
  } else {
    // No IntersectionObserver support — show content immediately rather
    // than leaving it permanently at opacity: 0.
    revealElements.forEach((el) => el.classList.add("visible"));
  }

  
  const certCards = document.querySelectorAll(".cert-note[data-cert]");

  const openModal = (modal) => {
    modal.classList.add("is-active");
    document.documentElement.classList.add("modal-open");
    document.body.classList.add("modal-open");
  };

  const closeModal = (modal) => {
    modal.classList.remove("is-active");
    document.documentElement.classList.remove("modal-open");
    document.body.classList.remove("modal-open");
  };

  certCards.forEach((card) => {
    const targetModal = document.getElementById(card.getAttribute("data-cert"));
    if (!targetModal) return;

    card.addEventListener("click", () => openModal(targetModal));
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openModal(targetModal);
      }
    });
  });

  const modals = document.querySelectorAll(".cert-modal-overlay");

  modals.forEach((modal) => {
    const closeBtn = modal.querySelector(".cert-modal-close");
    if (closeBtn) closeBtn.addEventListener("click", () => closeModal(modal));

    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal(modal);
    });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    const activeModal = document.querySelector(".cert-modal-overlay.is-active");
    if (activeModal) closeModal(activeModal);
  });

  
  const scrollProgressFill = document.querySelector("#scrollProgressFill");

  if (scrollProgressFill) {
    let ticking = false;

    const updateScrollProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? Math.min(100, Math.max(0, (scrollTop / docHeight) * 100)) : 0;
      scrollProgressFill.style.width = `${pct}%`;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateScrollProgress);
        ticking = true;
      }
    };

    updateScrollProgress();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", updateScrollProgress);
  }

  
  const rippleButtons = document.querySelectorAll(".pricing-card .btn");

  rippleButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 1.4;
      const ripple = document.createElement("span");

      ripple.className = "btn-ripple";
      ripple.style.width = `${size}px`;
      ripple.style.height = `${size}px`;
      ripple.style.left = `${(e.clientX ?? rect.left + rect.width / 2) - rect.left - size / 2}px`;
      ripple.style.top = `${(e.clientY ?? rect.top + rect.height / 2) - rect.top - size / 2}px`;

      btn.appendChild(ripple);
      ripple.addEventListener("animationend", () => ripple.remove());
    });
  });

  
  const backToTopBtn = document.querySelector(".back-to-top");
  const siteFooter = document.querySelector("footer");

  if (backToTopBtn) {
    const restBottom = 28; 

    const positionBackToTop = () => {
      if (siteFooter) {
        const footerRect = siteFooter.getBoundingClientRect();
        const overlap = window.innerHeight - footerRect.top;
        backToTopBtn.style.bottom = overlap > 0 ? `${overlap + restBottom}px` : `${restBottom}px`;
      }
      backToTopBtn.classList.toggle("is-visible", window.scrollY > window.innerHeight * 0.6);
    };

    positionBackToTop();
    window.addEventListener("scroll", positionBackToTop, { passive: true });
    window.addEventListener("resize", positionBackToTop);

    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  
  const musicCard = document.querySelector("#musicCard");

  if (musicCard) {
    const audio = document.querySelector("#musicAudio");
    const playBtn = document.querySelector("#musicPlayBtn");
    const prevBtn = document.querySelector("#musicPrevBtn");
    const nextBtn = document.querySelector("#musicNextBtn");
    const progressFill = document.querySelector("#musicProgressFill");
    const progressTrack = document.querySelector("#musicProgressTrack");
    const currentTimeEl = document.querySelector("#musicCurrentTime");
    const timeLabelEl = document.querySelector("#musicTimeLabel");

    const titleEl = document.querySelector("#musicTitle");
    const artistEl = document.querySelector("#musicArtist");
    const artImg = document.querySelector("#musicArtImg");
    const artFallback = document.querySelector("#musicArtFallback");
    const playlistEl = document.querySelector("#musicPlaylist");

    // Playlist — add real tracks here as you get the audio files + cover art.
    // previewUrl / artworkUrl left empty = shown as "coming soon" (not playable) placeholders.
    const TRACKS = [
      {
        trackName: "Linger",
        artistName: "Social Repose",
        previewUrl: "src/assets/audio/Linger.mp3",
        artworkUrl: "src/assets/images/linger.jpg",
      },
      {
        trackName: "Last Night on Earth",
        artistName: "Green Day",
        previewUrl: "src/assets/audio/Last Night on Earth.mp3",
        artworkUrl: "src/assets/images/last-night-on-earth.jpg",
      },
      {
        trackName: "End of Beginning",
        artistName: "AMH",
        previewUrl: "src/assets/audio/End of Beginning.mp3",
        artworkUrl: "src/assets/images/end of beginning.jpg",
      },
      {
        trackName: "Invisible String",
        artistName: "Taylor Swift",
        previewUrl: "src/assets/audio/invisible string (the long pond studio sessions).mp3",
        artworkUrl: "src/assets/images/invisible string.webp",
      },
      {
        trackName: "Lifetime (Reimagined)",
        artistName: "Ben and Ben",
        previewUrl: "src/assets/audio/Lifetime (Reimagined).mp3",
        artworkUrl: "src/assets/images/lifetime.png",
      },
      {
        trackName: "Your Universe",
        artistName: "Rico Blanco",
        previewUrl: "src/assets/audio/Your Universe (Acoustic).mp3",
        artworkUrl: "src/assets/images/your universe.png",
      },
      {
        trackName: "Dream Girl (Acoustic Version)",
        artistName: "Kolohe Kai",
        previewUrl: "src/assets/audio/Dream Girl (Acoustic Version).mp3",
        artworkUrl: "src/assets/images/dream girl.jpg",
      },
    ];

    let currentIndex = 0;
    let clipDuration = 0;

    const showToast = (text, background) => {
      if (typeof Toastify === "undefined") return;
      Toastify({
        text,
        duration: 4000,
        gravity: "top",
        position: "right",
        close: true,
        style: { background },
      }).showToast();
    };

    const formatTime = (secs) => {
      const s = Math.max(0, Math.floor(secs));
      const m = Math.floor(s / 60);
      const rem = s % 60;
      return `${m}:${rem.toString().padStart(2, "0")}`;
    };

    const setPlayingState = (isPlaying) => {
      musicCard.classList.toggle("is-playing", isPlaying);
      playBtn.setAttribute("aria-pressed", String(isPlaying));
      playBtn.setAttribute(
        "aria-label",
        `${isPlaying ? "Pause" : "Play"} ${TRACKS[currentIndex].trackName}`
      );
    };

    const setLoadingState = (isLoading) => {
      musicCard.classList.toggle("is-loading", isLoading);
    };

    // Surface buffering as a spinner instead of a silent, unresponsive button.
    audio.addEventListener("waiting", () => setLoadingState(true));
    audio.addEventListener("playing", () => setLoadingState(false));
    audio.addEventListener("canplay", () => setLoadingState(false));
    audio.addEventListener("pause", () => setLoadingState(false));

    const resetProgress = () => {
      if (progressFill) progressFill.style.width = "0%";
      if (currentTimeEl) currentTimeEl.textContent = "0:00";
    };

    const FADE_OUT_SECONDS = 3;

    // Pauses playback but keeps the current position (used by the play/pause button).
    const pausePreview = () => {
      audio.pause();
      audio.volume = 1;
      setPlayingState(false);
    };

    // Fully stops playback and rewinds to the start (used on track end / track change).
    const stopPreview = () => {
      audio.pause();
      audio.currentTime = 0;
      audio.volume = 1;
      setPlayingState(false);
      resetProgress();
    };

    audio.addEventListener("loadedmetadata", () => {
      if (isFinite(audio.duration) && audio.duration > 0) {
        clipDuration = audio.duration;
      }
      if (timeLabelEl) timeLabelEl.textContent = `${formatTime(clipDuration)} playback`;
    });

    audio.addEventListener("timeupdate", () => {
      const elapsed = audio.currentTime;
      const pct = clipDuration > 0 ? Math.min(100, (elapsed / clipDuration) * 100) : 0;
      if (progressFill) progressFill.style.width = `${pct}%`;
      if (currentTimeEl) currentTimeEl.textContent = formatTime(elapsed);

      if (clipDuration > 0) {
        const remaining = clipDuration - elapsed;
        if (remaining <= FADE_OUT_SECONDS) {
          audio.volume = Math.max(0, Math.min(1, remaining / FADE_OUT_SECONDS));
        } else if (audio.volume < 1) {
          audio.volume = 1;
        }
      }
    });

    // Track finished on its own — advance to the next available track and keep playing.
    audio.addEventListener("ended", () => {
      stopPreview();
      goToTrack(currentIndex + 1, { autoplay: true, wrap: true });
    });

    if (progressTrack) {
      progressTrack.addEventListener("click", (e) => {
        if (audio.paused || !audio.src || clipDuration <= 0) return;
        const rect = progressTrack.getBoundingClientRect();
        const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
        audio.currentTime = ratio * clipDuration;
      });
    }

    let isTogglingPreview = false;

    const togglePreview = async () => {
      if (!audio.src) {
        showToast("This track isn't available to play right now.", "#dc2626");
        return;
      }

      if (!audio.paused) {
        pausePreview();
        return;
      }

      if (isTogglingPreview) return;
      isTogglingPreview = true;

      // readyState < 3 (HAVE_FUTURE_DATA) means playback will need to buffer first —
      // show the spinner right away instead of waiting for the "waiting" event to fire.
      if (audio.readyState < 3) setLoadingState(true);

      try {
        await audio.play();
        setPlayingState(true);
      } catch (err) {
        setPlayingState(false);
        showToast("Couldn't play the preview — please try again.", "#dc2626");
      } finally {
        setLoadingState(false);
        isTogglingPreview = false;
      }
    };

    // Only the dedicated play/pause button controls playback now.
    playBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      togglePreview();
    });

    const upscaleArtwork = (url) =>
      url ? url.replace(/\/\d+x\d+bb\.(jpg|png)/, "/300x300bb.$1") : "";

    const renderPlaylist = () => {
      if (!playlistEl) return;
      playlistEl.innerHTML = "";
      TRACKS.forEach((track, index) => {
        const item = document.createElement("button");
        item.type = "button";
        item.className = "music-playlist-item";
        item.classList.toggle("is-active", index === currentIndex);
        item.classList.toggle("is-unavailable", !track.previewUrl);
        item.setAttribute(
          "aria-label",
          `${track.trackName} by ${track.artistName}${
            track.previewUrl ? "" : " (not available yet)"
          }`
        );

        const artwork = upscaleArtwork(track.artworkUrl);
        if (artwork) {
          const img = document.createElement("img");
          img.src = artwork;
          img.alt = "";
          item.appendChild(img);
        } else {
          const icon = document.createElement("i");
          icon.className = "fa-solid fa-music";
          item.appendChild(icon);
        }

        item.addEventListener("click", (e) => {
          e.stopPropagation();
          if (!track.previewUrl) {
            showToast("This track isn't available to play right now.", "#dc2626");
            return;
          }
          goToTrack(index, { autoplay: true });
        });

        playlistEl.appendChild(item);
      });
    };

    const loadTrack = (index, { autoplay = false } = {}) => {
      currentIndex = ((index % TRACKS.length) + TRACKS.length) % TRACKS.length;
      const track = TRACKS[currentIndex];

      stopPreview();

      const artwork = upscaleArtwork(track.artworkUrl);

      if (titleEl) titleEl.textContent = track.trackName;
      if (artistEl) artistEl.textContent = track.artistName;

      if (artwork && artImg) {
        artImg.src = artwork;
        artImg.alt = `${track.trackName} artwork`;
        artImg.hidden = false;
        if (artFallback) artFallback.style.display = "none";
      } else if (artImg && artFallback) {
        artImg.hidden = true;
        artFallback.style.display = "";
      }

      clipDuration = 0;
      if (timeLabelEl) timeLabelEl.textContent = "Preview";

      if (track.previewUrl) {
        audio.src = track.previewUrl;
        audio.load();
        playBtn.disabled = false;
      } else {
        audio.removeAttribute("src");
        playBtn.disabled = true;
      }

      renderPlaylist();

      if (autoplay && track.previewUrl) {
        togglePreview();
      }
    };

    function goToTrack(index, { autoplay = false, wrap = false } = {}) {
      if (!wrap && (index < 0 || index >= TRACKS.length)) return;
      loadTrack(index, { autoplay });
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        goToTrack(currentIndex - 1, { autoplay: !audio.paused, wrap: true });
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        goToTrack(currentIndex + 1, { autoplay: !audio.paused, wrap: true });
      });
    }

    // Card loads with the first track ready (paused) — playback only starts once you hit play.
    loadTrack(0);
  }

  
  const contactForm = document.querySelector(".contact-form-card form");

  if (contactForm && typeof Toastify !== "undefined") {
    const submitBtn = contactForm.querySelector("button[type='submit']");
    const defaultLabel = submitBtn ? submitBtn.innerHTML : "";

    const showToast = (text, background) => {
      Toastify({
        text,
        duration: 4500,
        gravity: "top",
        position: "right",
        close: true,
        style: { background },
      }).showToast();
    };

    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Sending...";
      }

      try {
        const response = await fetch(contactForm.action, {
          method: "POST",
          body: new FormData(contactForm),
          headers: { Accept: "application/json" },
        });

        if (!response.ok) throw new Error("Formspree request failed");

        showToast("Message sent! I'll get back to you soon.", "#0f172a");
        contactForm.reset();
      } catch (err) {
        showToast("Something went wrong. Please email me directly instead.", "#dc2626");
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = defaultLabel;
        }
      }
    });
  }
});