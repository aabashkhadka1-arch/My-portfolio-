
// ========================================
// Aabash Khadka - Portfolio JavaScript
// ========================================

document.addEventListener("DOMContentLoaded", function () {
    // Mobile navigation
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

        // Close the mobile menu after selecting a section
        navBar.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", function () {
                navBar.classList.remove("open");
                menuToggle.setAttribute("aria-expanded", "false");
                menuToggle.setAttribute("aria-label", "Open navigation menu");
                menuToggle.textContent = "☰";
            });
        });
    }

    // Image slider
    const sliderTrack = document.getElementById("slider-track");
    const slides = document.querySelectorAll(".slide");
    const previousButton = document.getElementById("previous-slide");
    const nextButton = document.getElementById("next-slide");
    const slideCounter = document.getElementById("slide-counter");

    let currentSlide = 0;
    let sliderTimer;

    function showSlide(index) {
        if (!sliderTrack || slides.length === 0) {
            return;
        }

        currentSlide = (index + slides.length) % slides.length;

        sliderTrack.style.transform =
            `translateX(-${currentSlide * 100}%)`;

        if (slideCounter) {
            slideCounter.textContent =
                `${currentSlide + 1} / ${slides.length}`;
        }
    }

    function startSlider() {
        clearInterval(sliderTimer);

        if (slides.length > 1) {
            sliderTimer = setInterval(function () {
                showSlide(currentSlide + 1);
            }, 4000);
        }
    }

    function restartSlider() {
        startSlider();
    }

    if (sliderTrack && slides.length > 0) {
        showSlide(0);
        startSlider();

        if (previousButton) {
            previousButton.addEventListener("click", function () {
                showSlide(currentSlide - 1);
                restartSlider();
            });
        }

        if (nextButton) {
            nextButton.addEventListener("click", function () {
                showSlide(currentSlide + 1);
                restartSlider();
            });
        }

        // Pause automatic sliding when the page is hidden
        document.addEventListener("visibilitychange", function () {
            if (document.hidden) {
                clearInterval(sliderTimer);
            } else {
                startSlider();
            }
        });
    }

    // Portfolio section search
    const searchForm = document.getElementById("search-form");
    const searchInput = document.getElementById("search");

    if (searchForm && searchInput) {
        searchForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const query = searchInput.value.trim().toLowerCase();

            // Remove the previous highlight
            document.querySelectorAll(".search-highlight").forEach(
                function (element) {
                    element.classList.remove("search-highlight");
                }
            );

            if (!query) {
                searchInput.focus();
                return;
            }

            const searchableSections = document.querySelectorAll(
                "main section"
            );

            let match = null;

            for (const section of searchableSections) {
                if (section.textContent.toLowerCase().includes(query)) {
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
                alert("No matching section found. Please try another keyword.");
            }
        });
    }
});
