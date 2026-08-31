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
          entry.target.classList.toggle("visible", entry.isIntersecting);
        });
      },
      { root: null, threshold: 0.02, rootMargin: "0px 0px -20px 0px" }
    );

    revealElements.forEach((el) => {
      el.classList.add("scroll-reveal");
      revealObserver.observe(el);
    });
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
    const progressFill = document.querySelector("#musicProgressFill");
    const progressTrack = document.querySelector("#musicProgressTrack");
    const currentTimeEl = document.querySelector("#musicCurrentTime");
    const timeLabelEl = document.querySelector("#musicTimeLabel");

    const titleEl = document.querySelector("#musicTitle");
    const artistEl = document.querySelector("#musicArtist");
    const artImg = document.querySelector("#musicArtImg");
    const artFallback = document.querySelector("#musicArtFallback");

    
    const CHOSEN_TRACK_QUERY = "Guy Sebastian Angels Brought Me Here";

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
    };

    const resetProgress = () => {
      if (progressFill) progressFill.style.width = "0%";
      if (currentTimeEl) currentTimeEl.textContent = "0:00";
    };

    const FADE_OUT_SECONDS = 3;

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

    audio.addEventListener("ended", () => {
      stopPreview();
    });

    if (progressTrack) {
      progressTrack.addEventListener("click", (e) => {
        if (audio.paused || !audio.src || clipDuration <= 0) return;
        const rect = progressTrack.getBoundingClientRect();
        const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
        audio.currentTime = ratio * clipDuration;
      });
    }

    const togglePreview = async () => {
      if (!audio.src) {
        showToast("This track isn't available to play right now.", "#dc2626");
        return;
      }

      if (!audio.paused) {
        stopPreview();
        return;
      }

      try {
        await audio.play();
        setPlayingState(true);
      } catch (err) {
        setPlayingState(false);
        showToast("Couldn't play the preview — please try again.", "#dc2626");
      }
    };

    playBtn.addEventListener("click", () => {
      togglePreview();
    });

    
    const upscaleArtwork = (url) =>
      url ? url.replace(/\/\d+x\d+bb\.(jpg|png)/, "/300x300bb.$1") : "";

    const loadTrack = (track) => {
      stopPreview();

      const artwork = upscaleArtwork(track.artworkUrl100);

      if (titleEl) titleEl.textContent = track.trackName || "Angels Brought Me Here";
      if (artistEl) artistEl.textContent = track.artistName || "Guy Sebastian";

      if (artwork && artImg) {
        artImg.src = artwork;
        artImg.alt = `${track.trackName || "Track"} artwork`;
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
    };

    
    playBtn.disabled = true;

    
    const VARIANT_PATTERN = /sped up|speed up|slowed|slow(ed)? reverb|remix|instrumental|karaoke|cover|nightcore|8d\b/i;

    const pickBestMatch = (tracks) => {
      const exact = tracks.find(
        (t) =>
          typeof t.trackName === "string" &&
          t.trackName.trim().toLowerCase() === "angels brought me here" &&
          !VARIANT_PATTERN.test(t.trackName)
      );
      if (exact) return exact;

      const noVariant = tracks.find(
        (t) => typeof t.trackName === "string" && !VARIANT_PATTERN.test(t.trackName)
      );
      if (noVariant) return noVariant;

      return tracks[0];
    };

    (async () => {
      try {
        const url = `https://itunes.apple.com/search?term=${encodeURIComponent(
          CHOSEN_TRACK_QUERY
        )}&media=music&entity=song&limit=15`;
        const response = await fetch(url);
        if (!response.ok) throw new Error("iTunes request failed");
        const data = await response.json();
        if (Array.isArray(data.results) && data.results.length > 0) {
          loadTrack(pickBestMatch(data.results));
        } else {
          playBtn.disabled = true;
        }
      } catch (err) {
        playBtn.disabled = true;
      }
    })();
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