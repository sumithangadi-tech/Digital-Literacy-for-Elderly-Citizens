"use strict";

const pages = [
    "home",
    "lesson1",
    "lesson2",
    "lesson3",
    "lesson4",
    "lesson5",
    "lesson6"
];

let currentLesson = 0;

const sidebar = document.getElementById("sidebar");
const menuButton = document.querySelector(".menu-btn");
const actions = document.getElementById("actions");
const previousButton = document.querySelector('[data-action="previous"]');
const nextButton = document.querySelector('[data-action="next"]');
const navigationButtons = Array.from(document.querySelectorAll(".sidebar [data-page]"));

/** Display one page and keep navigation controls synchronized. */
function showPage(pageId, options = {}) {
    const pageIndex = pages.indexOf(pageId);

    // Ignore unknown page names instead of leaving the interface in a broken state.
    if (pageIndex === -1) {
        console.warn(`Unknown page: ${pageId}`);
        return;
    }

    currentLesson = pageIndex;

    pages.forEach((id) => {
        const section = document.getElementById(id);
        if (section) {
            section.hidden = id !== pageId;
        }
    });

    navigationButtons.forEach((button) => {
        const isActive = button.dataset.page === pageId;
        button.classList.toggle("active", isActive);

        if (isActive) {
            button.setAttribute("aria-current", "page");
        } else {
            button.removeAttribute("aria-current");
        }
    });

    if (actions) {
        actions.hidden = pageId === "home";
    }

    closeMenu();
    updateButtons();

    if (options.scroll !== false) {
        window.scrollTo({
            top: 0,
            behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
                ? "auto"
                : "smooth"
        });
    }
}

function updateButtons() {
    if (previousButton) {
        // The first lesson goes back to Welcome; disable Previous there to match the original flow.
        previousButton.disabled = currentLesson === 1;
    }

    if (nextButton) {
        nextButton.textContent = currentLesson === pages.length - 1
            ? "Back to Welcome"
            : "Next Lesson →";
    }
}

function previousLesson() {
    if (currentLesson > 1) {
        showPage(pages[currentLesson - 1]);
    } else {
        showPage("home");
    }
}

function nextLesson() {
    if (currentLesson < pages.length - 1) {
        showPage(pages[currentLesson + 1]);
    } else {
        showPage("home");
    }
}

function openMenu() {
    if (!sidebar || !menuButton) return;
    sidebar.classList.add("open");
    menuButton.setAttribute("aria-expanded", "true");
    menuButton.setAttribute("aria-label", "Close lesson menu");
}

function closeMenu() {
    if (!sidebar || !menuButton) return;
    sidebar.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open lesson menu");
}

function toggleMenu() {
    if (!sidebar) return;
    if (sidebar.classList.contains("open")) {
        closeMenu();
    } else {
        openMenu();
    }
}

// One delegated click handler covers sidebar links and the Start Lesson button.
document.addEventListener("click", (event) => {
    const pageButton = event.target.closest("[data-page]");
    if (pageButton) {
        showPage(pageButton.dataset.page);
        return;
    }

    const actionButton = event.target.closest("[data-action]");
    if (actionButton) {
        if (actionButton.dataset.action === "previous") {
            previousLesson();
        } else if (actionButton.dataset.action === "next") {
            nextLesson();
        }
    }
});

if (menuButton) {
    menuButton.addEventListener("click", toggleMenu);
}

// Close the mobile menu when Escape is pressed.
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeMenu();
    }
});

// Restore the expected initial state: Welcome visible, lesson navigation inactive except Welcome.
showPage("home", { scroll: false });
