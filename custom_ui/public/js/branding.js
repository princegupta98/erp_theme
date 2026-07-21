console.log("BRANDING.JS LOADED");

function removeUnwantedProfileItems() {
    const removeTexts = [
        "About",
        "Frappe Support",
        "Reset Desktop Layout"
    ];

    document.querySelectorAll("a, button, .dropdown-item").forEach((element) => {
        const text = element.textContent.trim();

        if (removeTexts.includes(text)) {
            element.style.setProperty("display", "none", "important");

            // जर actual clickable element parent असेल
            const parent = element.closest("li");
            if (parent) {
                parent.style.setProperty("display", "none", "important");
            }
        }
    });
}

// Page load
document.addEventListener("DOMContentLoaded", () => {
    removeUnwantedProfileItems();
});

// Dynamic dropdown open झाल्यावर
const observer = new MutationObserver(() => {
    removeUnwantedProfileItems();
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});

// Profile icon click झाल्यानंतर पुन्हा run
document.addEventListener("click", () => {
    setTimeout(removeUnwantedProfileItems, 100);
});
// Hide Desktop right-click context menu
function removeDesktopContextMenu() {
    document.querySelectorAll("a, button, .dropdown-item").forEach((element) => {
        const text = element.textContent.trim();

        if (text === "Edit Layout" || text === "Reset Layout") {
            const menu =
                element.closest(".dropdown-menu") ||
                element.closest(".context-menu");

            if (menu) {
                menu.style.setProperty("display", "none", "important");
            }
        }
    });
}

document.addEventListener("contextmenu", () => {
    setTimeout(removeDesktopContextMenu, 10);
});

const desktopContextObserver = new MutationObserver(() => {
    removeDesktopContextMenu();
});

desktopContextObserver.observe(document.body, {
    childList: true,
    subtree: true
});
function replaceFrameworkBranding() {
    document.querySelectorAll("*").forEach((element) => {
        // फक्त leaf elements check करायचे
        if (element.children.length === 0) {
            const text = element.textContent.trim();

            if (text === "ERPNext") {
                element.textContent = "MagnaERP";
            }

            if (text === "Frappe Framework") {
                element.textContent = "MagnaERP";
            }
        }
    });
}

// Initial load
replaceFrameworkBranding();

// Route/page change नंतर
$(document).on("app_ready", () => {
    replaceFrameworkBranding();
});

// Dynamic sidebar render झाल्यावर
const brandingTextObserver = new MutationObserver(() => {
    replaceFrameworkBranding();
});

brandingTextObserver.observe(document.body, {
    childList: true,
    subtree: true
});
function removeHelpMenu() {
    document.querySelectorAll(".menu-item-title").forEach((title) => {
        if (title.textContent.trim() === "Help") {
            const menuItem = title.closest("a");
            if (menuItem) {
                menuItem.style.display = "none";
            }
        }
    });
}

removeHelpMenu();

const helpMenuObserver = new MutationObserver(() => {
    removeHelpMenu();
});

helpMenuObserver.observe(document.body, {
    childList: true,
    subtree: true
});