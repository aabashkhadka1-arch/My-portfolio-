
"use strict";

// ========================================
// Aabash Khadka - Portfolio JavaScript
// ========================================

document.addEventListener("DOMContentLoaded", function () {

    // ----------------------------------------
    // 1. Mobile navigation
    // ----------------------------------------
    const menuToggle = document.getElementById("menu-toggle");
    const navBar = document.getElementById("nav-bar");

    if (menuToggle && navBar) {
        menuToggle.addEventListener("click", function () {
            const isOpen = navBar.classList.toggle("open");

            menuToggle.setAttribute("aria-expanded", String(isOpen));
            menuToggle.setAttribute(
                "aria-label",
                isOpen ? "Close navigation menu" : "Open navigation menu"
            );

            menuToggle.textContent = isOpen ? "✕" : "☰";
        });

        navBar.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", function () {
                navBar.classList.remove("open");
                menuToggle.setAttribute("aria-expanded", "false");
                menuToggle.setAttribute(
                    "aria-label",
                    "Open navigation menu"
                );
                menuToggle.textContent = "☰";
            });
        });
    }

    // ----------------------------------------
    // 2. Image slider
    // ----------------------------------------
    const imageSlider = document.getElementById("image-slider");
    const sliderTrack = document.getElementById("slider-track");
    const slides = Array.from(
        document.querySelectorAll("#slider-track .slide")
    );

    const previousButton = document.getElementById("previous-slide");
    const nextButton = document.getElementById("next-slide");
    const slideCounter = document.getElementById("slide-counter");
    const dotsContainer = document.getElementById("slider-dots");

    let currentSlide = 0;
    let sliderTimer = null;

    const SLIDE_INTERVAL = 5000;

    // Show the selected slide and update related interface elements.
    function showSlide(index) {
        if (!sliderTrack || slides.length === 0) {
            return;
        }

        // Wrap the index in both directions.
        currentSlide =
            ((index % slides.length) + slides.length) % slides.length;

        // Move the track horizontally.
        sliderTrack.style.transform =
            `translateX(-${currentSlide * 100}%)`;

        // Update the slide counter.
        if (slideCounter) {
            slideCounter.textContent =
                `${currentSlide + 1} / ${slides.length}`;
        }

        // Update the active indicator dot.
        if (dotsContainer) {
            const dots =
                dotsContainer.querySelectorAll(".slider-dot");

            dots.forEach(function (dot, dotIndex) {
                const isActive = dotIndex === currentSlide;

                dot.classList.toggle("active", isActive);

                if (isActive) {
                    dot.setAttribute("aria-current", "true");
                } else {
                    dot.removeAttribute("aria-current");
                }
            });
        }
    }

    // Check whether the pointer is hovering over the slider.
    function isSliderHovered() {
        return Boolean(
            imageSlider && imageSlider.matches(":hover")
        );
    }

    // Start the automatic five-second slideshow.
    function startSlider() {
        window.clearInterval(sliderTimer);
        sliderTimer = null;

        if (
            slides.length > 1 &&
            !document.hidden &&
            !isSliderHovered()
        ) {
            sliderTimer = window.setInterval(function () {
                showSlide(currentSlide + 1);
            }, SLIDE_INTERVAL);
        }
    }

    // Restart the interval after manual navigation.
    function restartSlider() {
        startSlider();
    }

    // Generate a clickable dot for every slide.
    function createSliderDots() {
        if (!dotsContainer) {
            return;
        }

        dotsContainer.replaceChildren();

        slides.forEach(function (_, index) {
            const dot = document.createElement("button");

            dot.type = "button";
            dot.className = "slider-dot";
            dot.setAttribute(
                "aria-label",
                `Go to image ${index + 1}`
            );
            dot.setAttribute(
                "title",
                `Go to image ${index + 1}`
            );

            dot.addEventListener("click", function () {
                showSlide(index);
                restartSlider();
            });

            dotsContainer.appendChild(dot);
        });
    }

    // Initialize the slider only if its required elements exist.
    if (sliderTrack && slides.length > 0) {
        createSliderDots();
        showSlide(0);
        startSlider();

        // Previous button.
        if (previousButton) {
            previousButton.addEventListener("click", function () {
                showSlide(currentSlide - 1);
                restartSlider();
            });
        }

        // Next button.
        if (nextButton) {
            nextButton.addEventListener("click", function () {
                showSlide(currentSlide + 1);
                restartSlider();
            });
        }

        // Pause automatic sliding while hovering over the viewport.
        if (imageSlider) {
            imageSlider.addEventListener("mouseenter", function () {
                window.clearInterval(sliderTimer);
                sliderTimer = null;
            });

            imageSlider.addEventListener("mouseleave", function () {
                startSlider();
            });

            // Allow keyboard users to move between slides.
            imageSlider.addEventListener("keydown", function (event) {
                if (event.key === "ArrowLeft") {
                    event.preventDefault();
                    showSlide(currentSlide - 1);
                    restartSlider();
                } else if (event.key === "ArrowRight") {
                    event.preventDefault();
                    showSlide(currentSlide + 1);
                    restartSlider();
                }
            });
        }

        // Pause the timer when the browser tab is hidden.
        document.addEventListener("visibilitychange", function () {
            if (document.hidden) {
                window.clearInterval(sliderTimer);
                sliderTimer = null;
            } else {
                startSlider();
            }
        });

        // Restart appropriately when the page is restored.
        window.addEventListener("pageshow", startSlider);
    }

    // ----------------------------------------
    // 3. Portfolio section search
    // ----------------------------------------
    const searchForm = document.getElementById("search-form");
    const searchInput = document.getElementById("search");

    if (searchForm && searchInput) {
        searchForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const query = searchInput.value.trim().toLowerCase();

            // Remove the previous search highlight.
            document.querySelectorAll(".search-highlight")
                .forEach(function (element) {
                    element.classList.remove("search-highlight");
                });

            if (!query) {
                searchInput.focus();
                return;
            }

            const searchableSections =
                document.querySelectorAll("main section");

            let match = null;

            for (const section of searchableSections) {
                if (
                    section.textContent.toLowerCase().includes(query)
                ) {
                    match = section;
                    break;
                }
            }

            if (match) {
                match.classList.add("search-highlight");

                match.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            } else {
                window.alert(
                    "No matching section found. Please try another keyword."
                );
            }
        });
    }
});
