/**
 * Custom UI - Dynamic Theme Adaptive Premium Grid Icon Mapper for Frappe v16
 * UI Overhaul: Auto-Adaptive Theme Colors, Fixed Aspect Ratios & High-Fidelity Micro-Interactions
 */

(function () {
    const ICON_MAPPING = {
        // Main Workspace Icons
        "Framework": "box",
        "Organization": "building-2",
        "Accounting": "layout-grid",
        "Assets": "package",
        "Buying": "shopping-cart",
        "Manufacturing": "factory",
        "Projects": "folder-kanban",
        "Quality": "shield-check",
        "Selling": "briefcase",
        "Stock": "boxes",
        "Subcontracting": "refresh-cw",
        "ERPNext Settings": "settings",
        "MagnaERP Settings": "settings",
        "Frappe HR": "user-check",
        "MagnaHR": "user-check",

        // Framework Sub-Items
        "Automation": "cpu",
        "Build": "hammer",
        "Data": "database",
        "Email": "mail",
        "Integrations": "blocks",
        "Printing": "printer",
        "System": "terminal",
        "Users": "users-round",
        "Website": "globe",

        // Accounting Sub-Items
        "Invoicing": "file-spreadsheet",
        "Payments": "receipt-text",
        "Financial Reports": "trending-up",
        "Accounts Setup": "sliders",
        "Taxes": "book-open-text",
        "Banking": "dollar-sign",
        "Budget": "wallet",
        "Share Management": "users",
        "Subscription": "monitor-check",

        // MagnaHR Sub-Items
        "Expenses": "credit-card",
        "HR Setup": "sliders-horizontal",
        "Leaves": "calendar-off",
        "Payroll": "coins",
        "Performance": "award",
        "Recruitment": "user-plus",
        "Shift & Attendance": "clock",
        "Tax & Benefits": "percent",
        "Tenure": "hourglass"
    };

    function injectLucideIcon(element, iconName) {
        if (!window.lucide) return;

        try {
            if (element.querySelector('svg.custom-adaptive-icon')) return;
            element.innerHTML = "";

            const iconNode = document.createElement('i');
            iconNode.setAttribute('data-lucide', iconName);
            iconNode.classList.add("custom-adaptive-icon");
            script = iconNode.style;
            script.width = "32px";
            script.height = "32px";
            script.display = "inline-block";

            element.appendChild(iconNode);

            window.lucide.createIcons({
                attrs: {
                    'stroke-width': 1.75,
                    'stroke': 'currentColor',
                    'width': '32',
                    'height': '32'
                }
            });

            const generatedSvg = element.querySelector('svg');
            if (generatedSvg) {
                generatedSvg.classList.add('custom-adaptive-icon');
            }

            element.style.display = "flex";
            element.style.opacity = "1";
            element.style.visibility = "visible";

        } catch (error) {
            console.error(`[MagnaERP UI] Render error for ${iconName}:`, error);
        }
    }

    function executeGlobalIconScan() {
        const targetCards = document.querySelectorAll('.desktop-icon, .workspace-link-item, [data-link-type="workspace"]');
        if (!targetCards.length) return;

        targetCards.forEach(card => {
            let label = card.getAttribute('data-id') || card.getAttribute('data-label');
            if (!label) {
                const textEl = card.querySelector('.link-text, .desktop-icon-label, h3, span');
                if (textEl) label = textEl.textContent.trim();
            }

            if (!label || !ICON_MAPPING[label]) return;

            card.classList.add('custom-premium-card');

            const targetIconContainer = card.querySelector('.icon-container, .link-icon, .icon-wrapper');
            if (targetIconContainer) {
                const nativeImg = targetIconContainer.querySelector('img');
                if (nativeImg) nativeImg.style.display = 'none';

                const nativeSvg = targetIconContainer.querySelector('svg:not(.custom-adaptive-icon)');
                if (nativeSvg) nativeSvg.style.display = 'none';

                injectLucideIcon(targetIconContainer, ICON_MAPPING[label]);
            }
        });

        const modalGrids = document.querySelectorAll('.modal-body .desk-container, .modal-body .grid-modules');
        modalGrids.forEach(grid => {
            grid.style.display = "grid !important";
            grid.style.gridTemplateColumns = "repeat(auto-fill, minmax(130px, 1fr)) !important";
            grid.style.gap = "20px !important";
            grid.style.padding = "20px !important";
        });
    }

    function initializeIconSystem() {
        executeGlobalIconScan();

        if (window.frappe && frappe.router) {
            frappe.router.on('change', () => {
                setTimeout(executeGlobalIconScan, 60);
                setTimeout(executeGlobalIconScan, 350);
            });
        }

        document.body.addEventListener('click', function(e) {
            if (e.target.closest('.desktop-icon') || e.target.closest('.btn') || e.target.closest('.theme-selector')) {
                setTimeout(executeGlobalIconScan, 120);
                setTimeout(executeGlobalIconScan, 450); 
            }
        });

        const observer = new MutationObserver(() => {
            executeGlobalIconScan();
        });

        const appWrapper = document.getElementById('app') || document.body;
        observer.observe(appWrapper, { childList: true, subtree: true });
    }

    if (!window.lucide) {
        const script = document.createElement('script');
        script.src = "https://unpkg.com/lucide@latest";
        script.onload = () => { initializeIconSystem(); };
        document.head.appendChild(script);
    } else {
        $(document).on('app_ready', function() {
            initializeIconSystem();
        });
    }

    // 5. Theme-Agnostic Stylesheet with strict targets for Accounting card
    const style = document.createElement('style');
    style.innerHTML = `
        .standard-dashboard-grid, 
        .modal-body .grid-modules,
        .modal-body .desk-container {
            display: grid !important;
            grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)) !important;
            gap: 20px !important;
            padding: 15px !important;
        }

        .icon-container img, .link-icon img,
        .icon-container svg:not(.custom-adaptive-icon),
        .link-icon svg:not(.custom-adaptive-icon) {
            display: none !important;
        }

        /* Pure Variable Matrix for Flawless Theme Transitions */
        .custom-premium-card, .desktop-icon, .workspace-link-item {
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            justify-content: center !important;
            text-align: center !important;
            
            width: 130px !important;
            height: 125px !important;
            min-height: 125px !important;
            margin: 0 auto !important;
            padding: 16px 12px !important;
            box-sizing: border-box !important;

            border: 1px solid var(--border-color, rgba(128, 128, 128, 0.2)) !important;
            border-radius: 16px !important;
            background: var(--card-bg, var(--background-color, #ffffff)) !important;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.03) !important;
            transition: border-color 0.2s ease, background-color 0.2s ease, transform 0.25s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.25s ease !important;
        }

        /* Specific clean up for the inner wrapper structure of Accounting card to remove hard borders/backgrounds */
        .custom-premium-card .icon-container, 
        .custom-premium-card .link-icon,
        .desktop-icon .icon-container,
        [data-id="Accounting"] .icon-container,
        [data-id="Accounting"] .icon-wrapper {
            background: transparent !important;
            background-color: transparent !important;
            box-shadow: none !important;
            border: none !important;
            outline: none !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            width: 44px !important;
            height: 44px !important;
            margin: 0 0 10px 0 !important;
        }

        /* Micro-Interactions on Card Hover */
        .custom-premium-card:hover, .desktop-icon:hover, .workspace-link-item:hover {
            border-color: var(--primary, var(--primary-color, #0289f7)) !important;
            background: var(--card-bg, var(--background-color, #ffffff)) !important;
            transform: translateY(-4px) !important;
            box-shadow: 0 12px 20px -8px rgba(2, 137, 247, 0.25) !important;
        }

        /* Dynamic Text & Icon Colors Tracker */
        .custom-adaptive-icon {
            color: var(--text-color, #334155) !important;
            transition: color 0.2s ease, transform 0.2s ease;
        }

        .custom-premium-card:hover .custom-adaptive-icon {
            color: var(--primary, var(--primary-color, #0289f7)) !important;
            transform: scale(1.05);
        }

        /* Clean Typography Layout */
        .desktop-icon-label, .link-text, .custom-premium-card h3, .custom-premium-card span {
            font-size: 12.5px !important;
            font-weight: 550 !important;
            color: var(--text-muted, var(--text-color, #475569)) !important;
            margin: 0 !important;
            padding: 0 2px !important;
            display: -webkit-box !important;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
            text-overflow: ellipsis;
            line-height: 1.3 !important;
            max-width: 100% !important;
            transition: color 0.2s ease;
        }

        .custom-premium-card:hover .desktop-icon-label, 
        .custom-premium-card:hover .link-text {
            color: var(--text-color, #0f172a) !important;
        }
        
        .modal-dialog {
            max-width: 680px !important;
        }
        .modal-content {
            border-radius: 24px !important;
            border: 1px solid var(--border-color, transparent) !important;
            background: var(--modal-bg, var(--card-bg, #ffffff)) !important;
        }
    `;
    document.head.appendChild(style);
})();