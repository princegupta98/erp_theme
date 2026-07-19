$(document).on('app_ready', function() {
    // MutationObserver setup jo HTML me badlao par nazar rakhega
    const observer = new MutationObserver((mutations) => {
        // Jab bhi naye elements screen par aayenge
        $('.frappe-menu.context-menu .dropdown-menu-item').each(function() {
            let itemText = $(this).find('.menu-item-title').text().trim();
            
            if (itemText === "About" || itemText === "Frappe Support") {
                $(this).remove();
            }
        });
    });

    // Poore HTML body ko observe karna shuru karega
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
});