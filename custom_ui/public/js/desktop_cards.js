frappe.after_ajax(() => {
    initDesktopCards();

    const observer = new MutationObserver(() => {
        initDesktopCards();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });
});

function initDesktopCards() {

    document.querySelectorAll(".desktop-icon").forEach((icon) => {

        // Already processed
        if (icon.dataset.cardReady === "true") {
            return;
        }

        // Skip preview icons inside Accounting folder
        if (
            icon.closest(".folder-icon") &&
            icon.closest(".icons")
        ) {
            return;
        }

        icon.classList.add("desktop-card");

        const appIcon = icon.querySelector(".app-icon, .custom-lucide-icon");
        const title = icon.querySelector(".icon-title");

        // Wrap icon only once
        if (
            appIcon &&
            !appIcon.parentElement.classList.contains("desktop-card-icon")
        ) {
            const wrapper = document.createElement("div");
            wrapper.className = "desktop-card-icon";

            appIcon.parentNode.insertBefore(wrapper, appIcon);
            wrapper.appendChild(appIcon);
        }

        if (title) {
            title.classList.add("desktop-card-title");
        }

        icon.dataset.cardReady = "true";
    });

}