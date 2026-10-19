
/* =========================================================
   01. PORTFOLIO INTERACTIONS
   ========================================================= */

(() => {
  "use strict";

  const root = document.documentElement;
  const motionPreference = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  const revealElements = Array.from(
    document.querySelectorAll("[data-reveal]")
  );

  let revealObserver = null;

  /* -------------------------------------------------------
     SCROLL REVEALS AND MOTION PREFERENCE
     ------------------------------------------------------- */

  function showAllRevealElements() {
    revealElements.forEach((element) => {
      element.classList.add("visible");
    });
  }

  function stopRevealObserver() {
    if (revealObserver) {
      revealObserver.disconnect();
      revealObserver = null;
    }
  }

  function initializeRevealObserver() {
    stopRevealObserver();

    if (
      motionPreference.matches ||
      !("IntersectionObserver" in window)
    ) {
      root.classList.remove("motion-ready");
      showAllRevealElements();
      return;
    }

    root.classList.add("motion-ready");

    revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        });
      },
      {
        root: null,
        rootMargin: "0px 0px -40px 0px",
        threshold: 0.12
      }
    );

    revealElements.forEach((element) => {
      if (element.classList.contains("visible")) {
        return;
      }

      revealObserver.observe(element);
    });
  }

  function handleMotionPreferenceChange() {
    if (motionPreference.matches) {
      stopRevealObserver();
      root.classList.remove("motion-ready");
      showAllRevealElements();
      return;
    }

    initializeRevealObserver();
  }

  initializeRevealObserver();

  if (typeof motionPreference.addEventListener === "function") {
    motionPreference.addEventListener(
      "change",
      handleMotionPreferenceChange
    );
  } else {
    // Compatibility with older Safari versions.
    motionPreference.addListener(handleMotionPreferenceChange);
  }


  /* -------------------------------------------------------
     MOBILE NAVIGATION
     ------------------------------------------------------- */

  const menuToggle = document.querySelector(".menu-toggle");
  const navigation = document.querySelector(".primary-navigation");

  if (menuToggle && navigation) {
    function setMenuOpen(isOpen) {
      menuToggle.setAttribute("aria-expanded", String(isOpen));

      menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Close navigation" : "Open navigation"
      );

      navigation.classList.toggle("is-open", isOpen);
    }

    menuToggle.addEventListener("click", () => {
      const isOpen =
        menuToggle.getAttribute("aria-expanded") === "true";

      setMenuOpen(!isOpen);
    });

    navigation.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        setMenuOpen(false);
      });
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuToggle.focus();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 640) {
        setMenuOpen(false);
      }
    });
  }


  /* -------------------------------------------------------
     CURRENT YEAR
     ------------------------------------------------------- */

  const yearElement = document.querySelector("#current-year");

  if (yearElement) {
    yearElement.textContent = String(new Date().getFullYear());
  }
})();
