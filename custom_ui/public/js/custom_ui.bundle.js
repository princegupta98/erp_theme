import "./switcher/theme_manager";
import "./switcher/theme_switcher";
import "./desktop_cards";
import "./desktop_icons";
import "./branding";

frappe.after_ajax(() => {
    console.log("Custom Desk Theme Loaded");
});
