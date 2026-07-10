import "./switcher/theme_manager";
import "./switcher/theme_switcher";

frappe.after_ajax(() => {
    console.log("Custom Desk Theme Loaded");
});
