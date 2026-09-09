(() => {
  "use strict";

  const content = window.PORTFOLIO_CONTENT;
  if (!content) {
    console.error("未找到 PORTFOLIO_CONTENT，请检查 content.js 是否正确加载。");
    return;
  }

  const root = document.documentElement;
  const body = document.body;
  const projectHost = document.querySelector("[data-projects]");
  const filterHost = document.querySelector("[data-filters]");
  const dialog = document.querySelector("[data-case-dialog]");
  const cursor = document.querySelector(".cursor");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let activeFilter = "全部";
  let lastTrigger = null;
  let caseMotionObserver = null;
  let caseMotionFrame = 0;
  let caseMotionScrollHandler = null;
  let casePageNavigationCleanup = null;

  const escapeHtml = (value = "") =>
    String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");

  const setText = (selector, value) => {
    document.querySelectorAll(selector).forEach((node) => {
      node.textContent = value;
    });
  };

  function hydrateProfile() {
    const profile = content.profile;
    setText("[data-profile-name]", profile.name);
    setText("[data-profile-intro]", profile.intro);
    setText("[data-profile-bio]", profile.bio);
    setText("[data-profile-role]", profile.role || "视觉设计师 / 创意工作者");
    setText("[data-profile-location]", profile.location);
    setText("[data-profile-focus]", profile.focus);
    setText("[data-profile-availability]", profile.availability);
    setText("[data-profile-email]", profile.email);
    setText("[data-year]", new Date().getFullYear());
    document.querySelectorAll("[data-profile-email-link]").forEach((node) => {
      node.href = `mailto:${profile.email}`;
    });

    const timelineMarkup = (items = []) => items
      .map((item) => `
        <article class="resume-entry">
          <time>${escapeHtml(item.period)}</time>
          <h5>${escapeHtml(item.title)}</h5>
          <strong>${escapeHtml(item.organization)}</strong>
          <p>${escapeHtml(item.description)}</p>
        </article>`)
      .join("");

    const experienceHost = document.querySelector("[data-resume-experience]");
    const educationHost = document.querySelector("[data-resume-education]");
    const skillsHost = document.querySelector("[data-resume-skills]");
    if (experienceHost) experienceHost.innerHTML = timelineMarkup(profile.experience);
    if (educationHost) educationHost.innerHTML = timelineMarkup(profile.education);
    if (skillsHost) {
      skillsHost.innerHTML = (profile.skills || [])
        .map((skill) => `<span>${escapeHtml(skill)}</span>`)
        .join("");
    }
  }

  function renderFilters() {
    const categories = ["全部", ...new Set(content.projects.map((project) => project.category))];
    filterHost.innerHTML = categories
      .map(
        (category) => `
          <button
            class="filter-button ${category === activeFilter ? "is-active" : ""}"
            type="button"
            data-filter="${escapeHtml(category)}"
            aria-pressed="${category === activeFilter}"
          >${escapeHtml(category)}</button>`
      )
      .join("");
  }

  function projectMarkup(project, index) {
    const initials = project.title.replace(/[\s/]/g, "").slice(0, 2);
    const imageStyle = project.cover
      ? `background-image:url('${encodeURI(project.cover)}')`
      : "";
    return `
      <article class="project-card reveal" style="--project-accent:${project.accent};--project-surface:${project.surface}">
        <button class="project-button" type="button" data-project-id="${escapeHtml(project.id)}" aria-label="查看项目：${escapeHtml(project.title)}">
          <div class="project-visual ${project.cover ? "has-image" : ""}" style="${imageStyle}">
            <span class="project-code">Project / ${escapeHtml(project.number)}</span>
            <span class="project-view">View case ↗</span>
            <strong class="project-type" aria-hidden="true">${escapeHtml(initials)}</strong>
          </div>
          <div class="project-info">
            <div>
              <h3>${escapeHtml(project.title)}</h3>
              <p>${escapeHtml(project.category)} · ${escapeHtml(project.year)}</p>
            </div>
            <span class="project-arrow" aria-hidden="true">↗</span>
          </div>
        </button>
      </article>
    `;
  }

  function renderProjects() {
    const visibleProjects = activeFilter === "全部"
      ? content.projects
      : content.projects.filter((project) => project.category === activeFilter);
    projectHost.innerHTML = visibleProjects.map(projectMarkup).join("");
    observeReveals(projectHost);
    attachProjectInteractions();
  }

  function selectFilter(category) {
    activeFilter = category;
    renderFilters();
    renderProjects();
    filterHost.querySelector(`[data-filter="${CSS.escape(category)}"]`)?.focus();
  }

  function caseFacts(project) {
    return [
      ["Year", project.year],
      ["Category", project.category],
      ["Role", project.role],
      ["Highlight", project.metric]
    ]
      .map(([label, value]) => `<div><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd></div>`)
      .join("");
  }

  function caseNarrative(project) {
    const chapters = [
      ["01", "挑战", project.challenge],
      ["02", "方法", project.approach],
      ["03", "结果", project.outcome]
    ];
    return chapters
      .map(
        ([number, title, text]) => `
          <article>
            <span>${number}</span>
            <h3>${title}</h3>
            <p>${escapeHtml(text)}</p>
          </article>`
      )
      .join("");
  }

  function caseGallery(project) {
    return project.frames
      .map((frame, index) => {
        if (frame && typeof frame === "object" && frame.type === "video" && frame.src) {
          const slideNumber = String(index + 1).padStart(2, "0");
          const alt = frame.alt || `${project.title} 视频`;
          const poster = frame.poster ? ` poster="${escapeHtml(frame.poster)}"` : "";
          return `
            <figure class="case-frame case-frame--video case-motion-frame reveal" data-no-page-turn>
              <div class="case-video-shell">
                <video
                  class="case-video"
                  controls
                  playsinline
                  preload="metadata"
                  aria-label="${escapeHtml(alt)}"${poster}
                >
                  <source src="${escapeHtml(frame.src)}" type="video/mp4" />
                  您的浏览器不支持视频播放。
                </video>
                <p class="case-video-hint">点击播放完整视频</p>
              </div>
              <figcaption>${slideNumber} / ${escapeHtml(alt)}</figcaption>
            </figure>`;
        }

        if (frame && typeof frame === "object" && frame.src) {
          const slideNumber = String(index + 1).padStart(2, "0");
          const alt = frame.alt || `${project.title} 第 ${slideNumber} 页`;
          const overlays = Array.isArray(frame.overlays)
            ? frame.overlays
                .map((overlay) => {
                  const left = Number(overlay.left) || 0;
                  const top = Number(overlay.top) || 0;
                  const width = Number(overlay.width) || 0;
                  const height = Number(overlay.height) || 0;
                  return `
                    <img
                      class="case-frame-overlay"
                      src="${escapeHtml(overlay.src)}"
                      alt="${escapeHtml(overlay.alt || "动态展示")}" 
                      loading="lazy"
                      decoding="async"
                      style="--overlay-left:${left}%;--overlay-top:${top}%;--overlay-width:${width}%;--overlay-height:${height}%"
                    />`;
                })
                .join("")
            : "";
          return `
            <figure class="case-frame case-frame--image case-motion-frame reveal">
              <div class="case-frame-media">
                <img
                  class="case-frame-base"
                  src="${escapeHtml(frame.src)}"
                  alt="${escapeHtml(alt)}"
                  width="1920"
                  height="1080"
                  loading="${index < 2 ? "eager" : "lazy"}"
                  decoding="async"
                />
                ${overlays}
              </div>
              <figcaption>${slideNumber} / ${escapeHtml(alt)}</figcaption>
            </figure>`;
        }

        return `<div class="case-frame"><span>${escapeHtml(frame)} / Visual placeholder</span></div>`;
      })
      .join("");
  }

  function openCase(project, trigger) {
    lastTrigger = trigger;
    const hasVisualFrames = project.frames.some((frame) => frame && typeof frame === "object" && frame.src);
    const hero = dialog.querySelector("[data-case-hero]");
    dialog.classList.toggle("is-visual-case", hasVisualFrames);
    hero.style.setProperty("--case-accent", project.accent);
    hero.style.setProperty("--case-surface", project.surface);
    dialog.style.setProperty("--case-accent", project.accent);
    dialog.style.setProperty("--case-surface", project.surface);
    dialog.querySelector("[data-case-kicker]").textContent = `${project.category} / ${project.year}`;
    dialog.querySelector("[data-case-title]").textContent = project.title;
    dialog.querySelector("[data-case-summary]").textContent = project.summary;
    dialog.querySelector("[data-case-facts]").innerHTML = caseFacts(project);
    dialog.querySelector("[data-case-narrative]").innerHTML = caseNarrative(project);
    dialog.querySelector("[data-case-gallery]").innerHTML = caseGallery(project);
    dialog.showModal();
    dialog.scrollTop = 0;
    body.classList.add("dialog-open");
    requestAnimationFrame(() => {
      observeReveals(dialog);
      setupCaseFrameMotion();
      setupCasePageNavigation();
    });
  }

  function setupCaseFrameMotion() {
    const frames = Array.from(dialog.querySelectorAll(".case-motion-frame"));
    caseMotionObserver?.disconnect();
    cancelAnimationFrame(caseMotionFrame);
    caseMotionFrame = 0;
    if (caseMotionScrollHandler) {
      dialog.removeEventListener("scroll", caseMotionScrollHandler);
      caseMotionScrollHandler = null;
    }

    if (!frames.length) return;
    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      frames.forEach((frame) => frame.classList.add("is-motion-visible"));
      return;
    }

    caseMotionObserver = new IntersectionObserver(
      (entries, currentObserver) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-motion-visible");
            currentObserver.unobserve(entry.target);
          }
        });
      },
      {
        root: dialog,
        threshold: 0.16,
        rootMargin: "0px 0px -8% 0px"
      }
    );

    frames.forEach((frame) => caseMotionObserver.observe(frame));

    const updateParallax = () => {
      caseMotionFrame = 0;
      const viewportHeight = dialog.clientHeight || window.innerHeight;
      const viewportCenter = viewportHeight / 2;

      frames.forEach((frame) => {
        const rect = frame.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > viewportHeight) return;
        const frameCenter = rect.top + rect.height / 2;
        const distance = (frameCenter - viewportCenter) / (viewportHeight + rect.height);
        const progress = Math.max(-1, Math.min(1, distance));
        frame.style.setProperty("--case-parallax", `${progress * -32}px`);
      });
    };

    const requestParallax = () => {
      if (caseMotionFrame) return;
      caseMotionFrame = requestAnimationFrame(updateParallax);
    };

    frames.forEach((frame) => frame.style.setProperty("--case-parallax", "0px"));
    requestParallax();
    caseMotionScrollHandler = requestParallax;
    dialog.addEventListener("scroll", caseMotionScrollHandler, { passive: true });
  }

  function setupCasePageNavigation() {
    casePageNavigationCleanup?.();
    casePageNavigationCleanup = null;

    const frames = Array.from(dialog.querySelectorAll(".case-motion-frame"));
    if (!frames.length) return;

    let activeIndex = 0;
    let wheelLocked = false;
    let wheelUnlockTimer = 0;
    let scrollSettleTimer = 0;

    const getFrameTop = (frame) => {
      const dialogRect = dialog.getBoundingClientRect();
      const gallery = frame.parentElement;
      const galleryTop = dialog.scrollTop + gallery.getBoundingClientRect().top - dialogRect.top;
      return galleryTop + frame.offsetTop;
    };

    const getNearestIndex = () => {
      let nearestIndex = 0;
      let nearestDistance = Number.POSITIVE_INFINITY;

      frames.forEach((frame, index) => {
        const distance = Math.abs(getFrameTop(frame) - dialog.scrollTop);
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestIndex = index;
        }
      });

      return nearestIndex;
    };

    const goToPage = (index) => {
      const nextIndex = Math.max(0, Math.min(frames.length - 1, index));
      if (nextIndex === activeIndex && Math.abs(dialog.scrollTop - getFrameTop(frames[nextIndex])) < 2) return;

      activeIndex = nextIndex;
      wheelLocked = true;
      window.clearTimeout(wheelUnlockTimer);
      dialog.scrollTo({
        top: getFrameTop(frames[nextIndex]),
        behavior: prefersReducedMotion ? "auto" : "smooth"
      });
      wheelUnlockTimer = window.setTimeout(() => {
        wheelLocked = false;
      }, prefersReducedMotion ? 80 : 620);
    };

    const onWheel = (event) => {
      const deltaScale = event.deltaMode === 1 ? 24 : event.deltaMode === 2 ? dialog.clientHeight : 1;
      const deltaY = event.deltaY * deltaScale;
      if (event.ctrlKey || Math.abs(event.deltaY) < Math.abs(event.deltaX) || Math.abs(deltaY) < 4) return;
      event.preventDefault();
      if (wheelLocked) return;

      activeIndex = getNearestIndex();
      goToPage(activeIndex + (deltaY > 0 ? 1 : -1));
    };

    const onClick = (event) => {
      if (event.button !== 0) return;
      const target = event.target instanceof Element ? event.target : null;
      if (!target || target.closest("button, a, input, textarea, select, video, audio, [contenteditable], [data-no-page-turn]")) return;
      if (String(window.getSelection?.() || "").trim()) return;

      const clickedFrame = target.closest(".case-motion-frame");
      const clickedIndex = frames.indexOf(clickedFrame);
      if (clickedIndex < 0 || clickedIndex >= frames.length - 1) return;

      event.preventDefault();
      goToPage(clickedIndex + 1);
    };

    const onScroll = () => {
      window.clearTimeout(scrollSettleTimer);
      scrollSettleTimer = window.setTimeout(() => {
        if (!wheelLocked) activeIndex = getNearestIndex();
      }, 90);
    };

    dialog.addEventListener("wheel", onWheel, { passive: false });
    dialog.addEventListener("click", onClick);
    dialog.addEventListener("scroll", onScroll, { passive: true });

    casePageNavigationCleanup = () => {
      dialog.removeEventListener("wheel", onWheel);
      dialog.removeEventListener("click", onClick);
      dialog.removeEventListener("scroll", onScroll);
      window.clearTimeout(wheelUnlockTimer);
      window.clearTimeout(scrollSettleTimer);
    };
  }

  function stopCaseMedia() {
    dialog.querySelectorAll("video, audio").forEach((media) => {
      media.muted = true;
      media.volume = 0;
      media.pause();
      try {
        media.currentTime = 0;
      } catch (error) {
        // The media metadata may not be loaded yet; pausing still stops its audio.
      }
      media.removeAttribute("src");
      media.querySelectorAll("source").forEach((source) => source.removeAttribute("src"));
      media.load();
    });
  }

  function closeCase() {
    stopCaseMedia();
    if (!dialog.open) return;
    casePageNavigationCleanup?.();
    casePageNavigationCleanup = null;
    dialog.close();
    body.classList.remove("dialog-open");
    lastTrigger?.focus();
  }

  function attachProjectInteractions() {
    projectHost.querySelectorAll("[data-project-id]").forEach((button) => {
      const project = content.projects.find((item) => item.id === button.dataset.projectId);
      button.addEventListener("click", () => openCase(project, button));

      if (!prefersReducedMotion && window.matchMedia("(hover: hover)").matches) {
        const visual = button.querySelector(".project-visual");
        button.addEventListener("pointermove", (event) => {
          const rect = visual.getBoundingClientRect();
          const x = (event.clientX - rect.left) / rect.width - 0.5;
          const y = (event.clientY - rect.top) / rect.height - 0.5;
          visual.style.transform = `perspective(900px) rotateX(${y * -3}deg) rotateY(${x * 4}deg) scale(1.045)`;
        });
        button.addEventListener("pointerleave", () => {
          visual.style.transform = "";
        });
        button.addEventListener("pointerenter", () => cursor.classList.add("is-visible"));
        button.addEventListener("pointerleave", () => cursor.classList.remove("is-visible"));
      }
    });
  }

  function observeReveals(scope = document) {
    const nodes = scope.querySelectorAll(".reveal:not([data-observed])");
    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      nodes.forEach((node) => node.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries, currentObserver) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            currentObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.13, rootMargin: "0px 0px -5%" }
    );

    nodes.forEach((node) => {
      node.dataset.observed = "true";
      observer.observe(node);
    });
  }

  function setupTheme() {
    root.dataset.theme = "dark";
    document.querySelector('meta[name="theme-color"]').content = "#0a0a0a";
  }

  function setupMenu() {
    const menuButton = document.querySelector(".menu-toggle");
    const nav = document.querySelector(".site-nav");
    const closeMenu = () => {
      nav.classList.remove("is-open");
      menuButton.setAttribute("aria-expanded", "false");
      body.classList.remove("dialog-open");
    };

    menuButton.addEventListener("click", () => {
      const willOpen = !nav.classList.contains("is-open");
      nav.classList.toggle("is-open", willOpen);
      menuButton.setAttribute("aria-expanded", String(willOpen));
      body.classList.toggle("dialog-open", willOpen);
    });
    nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
  }

  function setupScrollEffects() {
    const progress = document.querySelector(".scroll-progress span");
    const header = document.querySelector("[data-header]");
    const stage = document.querySelector(".hero-stage");

    const update = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = maxScroll > 0 ? window.scrollY / maxScroll : 0;
      progress.style.transform = `scaleX(${ratio})`;
      header.classList.toggle("is-scrolled", window.scrollY > 20);
      if (!prefersReducedMotion && stage && window.scrollY < window.innerHeight) {
        stage.style.transform = `translate3d(0, ${window.scrollY * 0.08}px, 0) rotate(${window.scrollY * 0.004}deg)`;
      }
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
  }

  function setupPageRail() {
    const sections = document.querySelectorAll("[data-page]");
    const links = document.querySelectorAll("[data-page-link]");
    const hashPage = window.location.hash.replace("#", "");
    const initialPage = Array.from(sections).some((section) => section.dataset.page === hashPage) ? hashPage : "cover";
    body.dataset.currentPage = initialPage;
    links.forEach((link) => {
      const isCurrent = link.dataset.pageLink === initialPage;
      link.classList.toggle("is-active", isCurrent);
      if (isCurrent) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
    if (!("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        const currentPage = visible.target.dataset.page;
        body.dataset.currentPage = currentPage;
        links.forEach((link) => {
          const isCurrent = link.dataset.pageLink === currentPage;
          link.classList.toggle("is-active", isCurrent);
          if (isCurrent) link.setAttribute("aria-current", "page");
          else link.removeAttribute("aria-current");
        });
      },
      { threshold: [0.18, 0.45, 0.7], rootMargin: "-12% 0px -12%" }
    );

    sections.forEach((section) => observer.observe(section));
  }

  function setupCoverVideo() {
    const video = document.querySelector(".cover-motion");
    const cover = document.querySelector("#cover");
    if (!video || !cover) return;

    if (prefersReducedMotion) {
      video.pause();
      return;
    }

    let coverIsVisible = true;
    const syncPlayback = () => {
      if (coverIsVisible && !document.hidden) video.play().catch(() => {});
      else video.pause();
    };

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          coverIsVisible = entry.isIntersecting;
          syncPlayback();
        },
        { threshold: 0.12 }
      );
      observer.observe(cover);
    }

    document.addEventListener("visibilitychange", syncPlayback);
    video.addEventListener("canplay", syncPlayback, { once: true });
  }

  function setupCursor() {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    window.addEventListener("pointermove", (event) => {
      cursor.style.left = `${event.clientX}px`;
      cursor.style.top = `${event.clientY}px`;
    });
  }

  filterHost.addEventListener("click", (event) => {
    const button = event.target.closest("[data-filter]");
    if (button) selectFilter(button.dataset.filter);
  });

  dialog.querySelectorAll("[data-case-close]").forEach((button) => {
    button.addEventListener("click", closeCase);
  });
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) closeCase();
  });
  dialog.addEventListener("cancel", (event) => {
    event.preventDefault();
    closeCase();
  });
  dialog.addEventListener("close", stopCaseMedia);

  hydrateProfile();
  renderFilters();
  renderProjects();
  observeReveals();
  setupTheme();
  setupMenu();
  setupScrollEffects();
  setupPageRail();
  setupCoverVideo();
  setupCursor();
})();
