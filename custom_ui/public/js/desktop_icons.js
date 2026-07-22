// ==========================================================
// DESKTOP CUSTOM ICONS
// Custom icons only for Peach and Purple themes
// ==========================================================


// Store original icon paths so other themes can restore them
const originalIcons = new WeakMap();


// ==========================================================
// GET CURRENT THEME
// ==========================================================

function getCurrentTheme() {
    return document.documentElement.dataset.themeMode || "";
}


// ==========================================================
// RESTORE ORIGINAL ICONS
// Used when switching away from Peach / Purple
// ==========================================================

function restoreOriginalDesktopIcons() {

    document.querySelectorAll(".desktop-icon").forEach((desktopIcon) => {
        // Do not replace icons inside folder popup/modal
        if (desktopIcon.closest(".desktop-modal-body")) {
            return;
        }

        const iconContainer =
            desktopIcon.querySelector(".icon-container");

        if (!iconContainer) {
            return;
        }

        // --------------------------------------------------
        // Restore normal Frappe icons
        // --------------------------------------------------

        const normalImg =
            iconContainer.querySelector(
                ".desktop-card-icon .app-icon"
            );

        if (normalImg && originalIcons.has(normalImg)) {

            const original =
                originalIcons.get(normalImg);

            if (original) {

                normalImg.onerror = null;
                normalImg.src = original;

            }

        }


        // --------------------------------------------------
        // Remove custom folder icon
        // --------------------------------------------------

        const customFolderImg =
            iconContainer.querySelector(
                ".custom-folder-app-icon"
            );

        if (customFolderImg) {
            customFolderImg.remove();
        }


        // --------------------------------------------------
        // Restore original Frappe folder/grid icon
        // --------------------------------------------------

        const frappeFolderIcons =
            iconContainer.querySelector(".icons");

        if (frappeFolderIcons) {
            frappeFolderIcons.style.display = "";
        }


        // Reset loaded state
        delete desktopIcon.dataset.iconLoaded;

    });

}


// ==========================================================
// UPDATE DESKTOP ICONS
// ==========================================================

function updateDesktopIcons() {

    const theme = getCurrentTheme();


    // ======================================================
    // CUSTOM ICONS ONLY FOR PEACH AND PURPLE
    // ======================================================

    // if (!["peach", "purple"].includes(theme)) {

    //     restoreOriginalDesktopIcons();

    //     return;

    // }


    // ======================================================
    // LOOP THROUGH ALL DESKTOP CARDS
    // ======================================================

    document
        .querySelectorAll(".desktop-icon")
        .forEach((desktopIcon) => {


            // ------------------------------------------------
            // Get original desktop app ID
            // ------------------------------------------------

            const appId =
                desktopIcon.dataset.id || "";

            if (!appId) {
                return;
            }
            // Keep original Frappe Accounting icon
            // ==========================================================
            // KEEP ORIGINAL FRAPPE ACCOUNTING ICON
            // ==========================================================

            if (appId === "Accounting") {

                const iconContainer =
                    desktopIcon.querySelector(".icon-container");

                if (!iconContainer) {
                    return;
                }

                // Original Frappe Accounting icons container
                const frappeFolderIcons =
                    iconContainer.querySelector(".icons");

                if (frappeFolderIcons) {

                    // Restore main wrapper
                    frappeFolderIcons.style.removeProperty("display");
                    frappeFolderIcons.style.display = "grid";

                    // Restore all original child icons
                    frappeFolderIcons
                        .querySelectorAll("*")
                        .forEach((el) => {
                            el.style.removeProperty("display");
                            el.style.removeProperty("visibility");
                            el.style.removeProperty("opacity");
                        });
                }

                // Remove ONLY custom image previously inserted by our JS
                const customImg =
                    iconContainer.querySelector(".custom-folder-app-icon");

                if (customImg) {
                    customImg.remove();
                }

                delete desktopIcon.dataset.iconLoaded;

                return;
            }
            // ==========================================================
            // ACCOUNTS SETUP - ORIGINAL FRAPPE STYLE ICON
            // ==========================================================

            if (appId === "Accounts Setup") {

                const iconContainer =
                    desktopIcon.querySelector(".icon-container");

                if (!iconContainer) {
                    return;
                }

                // Hide fallback alphabet "A"
                const fallbackSvg =
                    iconContainer.querySelector(".desktop-alphabet");

                if (fallbackSvg) {
                    fallbackSvg.style.setProperty(
                        "display",
                        "none",
                        "important"
                    );
                }

                // Avoid adding icon multiple times
                let setupIcon =
                    iconContainer.querySelector(".accounts-setup-icon");

                if (!setupIcon) {

                    setupIcon =
                        document.createElementNS(
                            "http://www.w3.org/2000/svg",
                            "svg"
                        );

                    setupIcon.setAttribute(
                        "class",
                        "icon icon-md accounts-setup-icon"
                    );

                    setupIcon.setAttribute(
                        "aria-hidden",
                        "true"
                    );

                    setupIcon.style.color = "white";

                    const use =
                        document.createElementNS(
                            "http://www.w3.org/2000/svg",
                            "use"
                        );

                    use.setAttribute(
                        "href",
                        "#icon-setting-gear"
                    );

                    setupIcon.appendChild(use);

                    iconContainer.appendChild(setupIcon);
                }

                iconContainer.style.backgroundColor =
                    "#0289f7";

                desktopIcon.dataset.iconLoaded =
                    "true";

                return;
            }


            // ------------------------------------------------
            // Generate SVG filename
            // ------------------------------------------------

            let fileName = appId;

            // ERPNext Settings / MagnaERP Settings -> MagnaERPSettings.svg
            if (
                appId === "ERPNext Settings" ||
                appId === "MagnaERP Settings"
            ) {
                fileName = "MagnaERPSettings";

            } else if (
                appId === "Frappe HR" ||
                appId === "Magna HR"
            ) {
                fileName = "MagnaHR";

            } else {
                fileName = fileName.replace(/\s+/g, "");
            }


            // ------------------------------------------------
            // Custom SVG path
            // ------------------------------------------------

            const customIcon =
                `/assets/custom_ui/icons/peach/${fileName}.svg?v=4`;


            // ------------------------------------------------
            // Find main icon container
            // ------------------------------------------------

            const iconContainer =
                desktopIcon.querySelector(
                    ".icon-container"
                );

            if (!iconContainer) {
                return;
            }


            // ==================================================
            // CASE 1:
            // NORMAL DESKTOP ICON
            //
            // Framework
            // Organization
            // Assets
            // Buying
            // CRM
            // Manufacturing
            // Projects
            // Quality
            // Selling
            // Stock
            // Subcontracting
            // Frappe HR / Magna HR
            // ==================================================

            const normalImg =
                iconContainer.querySelector(
                    ".desktop-card-icon .app-icon"
                );


            if (normalImg) {


                // ----------------------------------------------
                // Save original Frappe icon once
                // ----------------------------------------------

                if (!originalIcons.has(normalImg)) {

                    originalIcons.set(
                        normalImg,
                        normalImg.getAttribute("src")
                    );

                }


                // ----------------------------------------------
                // Remove previous error handler
                // ----------------------------------------------

                normalImg.onerror = null;


                // ----------------------------------------------
                // Set custom SVG
                // ----------------------------------------------

                normalImg.src = customIcon;


                // ----------------------------------------------
                // If custom SVG doesn't exist,
                // restore original Frappe icon
                // ----------------------------------------------

                normalImg.onerror = function () {

                    const original =
                        originalIcons.get(normalImg);


                    if (original) {

                        this.onerror = null;

                        this.src = original;

                    }

                };


                desktopIcon.dataset.iconLoaded =
                    "true";


                return;

            }


            // ==================================================
            // CASE 2:
            // FRAPPE FOLDER ICON
            //
            // Accounting is rendered as:
            //
            // .icon-container.folder-icon
            //      .icons
            //
            // Instead of:
            //
            // .desktop-card-icon
            //      img.app-icon
            //
            // ==================================================

            if (
                iconContainer.classList.contains(
                    "folder-icon"
                )
            ) {


                // ----------------------------------------------
                // Find original Frappe folder/grid icons
                // ----------------------------------------------

                const frappeFolderIcons =
                    iconContainer.querySelector(
                        ".icons"
                    );


                // ----------------------------------------------
                // Find existing custom image
                // ----------------------------------------------

                let customImg =
                    iconContainer.querySelector(
                        ".custom-folder-app-icon"
                    );


                // ----------------------------------------------
                // Create custom image if not already created
                // ----------------------------------------------

                if (!customImg) {

                    customImg =
                        document.createElement(
                            "img"
                        );


                    customImg.className =
                        "app-icon custom-folder-app-icon";


                    customImg.alt =
                        appId;


                    // Important:
                    // Do NOT delete Frappe's original DOM
                    //
                    // Just append our custom SVG.

                    iconContainer.appendChild(
                        customImg
                    );

                }


                // ----------------------------------------------
                // Clear old handlers
                // ----------------------------------------------

                customImg.onload = null;
                customImg.onerror = null;


                // ----------------------------------------------
                // When custom SVG loads successfully
                // ----------------------------------------------

                customImg.onload = function () {

                    // Hide original Frappe folder/grid icon

                    if (frappeFolderIcons) {

                        frappeFolderIcons.style.display =
                            "none";

                    }


                    // Show custom SVG

                    this.style.display =
                        "block";

                };


                // ----------------------------------------------
                // If SVG does not exist
                // ----------------------------------------------

                customImg.onerror = function () {

                    console.warn(
                        `Custom desktop icon not found: ${customIcon}`
                    );


                    // Restore original folder icon

                    if (frappeFolderIcons) {

                        frappeFolderIcons.style.display =
                            "";

                    }


                    // Remove broken custom image

                    this.remove();

                };


                // ----------------------------------------------
                // Set custom SVG
                //
                // Accounting:
                //
                // /assets/custom_ui/icons/
                // peach/Accounting.svg
                //
                // OR
                //
                // purple/Accounting.svg
                // ----------------------------------------------

                customImg.src =
                    customIcon;


                desktopIcon.dataset.iconLoaded =
                    "true";


                return;

            }

        });

}


// ==========================================================
// INITIAL DESKTOP LOAD
// ==========================================================

frappe.after_ajax(() => {

    updateDesktopIcons();

});


// ==========================================================
// HANDLE DYNAMIC DESKTOP CARDS
//
// Frappe can re-render desktop cards after route changes.
// MutationObserver ensures custom icons are applied again.
// ==========================================================

const desktopObserver =
    new MutationObserver(() => {

        updateDesktopIcons();

    });


desktopObserver.observe(
    document.body,
    {
        childList: true,
        subtree: true
    }
);


// ==========================================================
// HANDLE THEME CHANGE
//
// Example:
//
// peach -> purple
// purple -> light
// light -> peach
//
// Icons update automatically.
// ==========================================================

const themeObserver =
    new MutationObserver(() => {

        updateDesktopIcons();

    });


themeObserver.observe(
    document.documentElement,
    {
        attributes: true,

        attributeFilter: [
            "data-theme-mode"
        ]
    }
);


// ==========================================================
// RUN ONCE AS FALLBACK
// ==========================================================

if (document.readyState === "loading") {

    document.addEventListener(
        "DOMContentLoaded",
        () => {

            updateDesktopIcons();

        }
    );

} else {

    updateDesktopIcons();

}
