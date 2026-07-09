const OriginalThemeSwitcher = frappe.ui.ThemeSwitcher;

frappe.ui.ThemeSwitcher = class extends OriginalThemeSwitcher {
	async fetch_themes() {
		await super.fetch_themes();

		this.themes.splice(
			2,
			0,
			{
				name: "blue",
				label: __("Ocean Blue"),
				info: __("Blue Theme"),
			},
			{
				name: "orange",
				label: __("Sunset Orange"),
				info: __("Orange Theme"),
			},
			{
				name: "brown",
				label: __("Coffee Brown"),
				info: __("Brown Theme"),
			},
		);
	}

	get_preview_html(theme) {
		const custom_themes = {
			blue: "dark",
			orange: "light",
			brown: "dark",
		};

		const is_auto_theme = theme.name === "automatic";
		let base_theme = theme.name;
		let theme_mode = theme.name;

		if (theme.name in custom_themes) {
			base_theme = custom_themes[theme.name];
		} else if (is_auto_theme) {
			base_theme = "light";
		}

		const preview = $(`<div class="${this.current_theme == theme.name ? "selected" : ""}">
			<div data-theme="${base_theme}"
				data-theme-mode="${theme_mode}"
				data-is-auto-theme="${is_auto_theme}" title="${theme.info}">
				<div class="background">
					<div>
						<div class="preview-check" data-theme="${base_theme}">
							${frappe.utils.icon("tick", "xs")}
						</div>
					</div>
					<div class="navbar"></div>
					<div class="p-2">
						<div class="toolbar">
							<span class="text"></span>
							<span class="primary"></span>
						</div>
						<div class="foreground"></div>
						<div class="foreground"></div>
					</div>
				</div>
			</div>
			<div class="mt-3 text-center">
				<h5 class="theme-title">${theme.label}</h5>
			</div>
		</div>`);

		preview.on("click", () => {
			if (this.current_theme === theme.name) return;

			this.themes.forEach((th) => {
				th.$html.removeClass("selected");
			});

			preview.addClass("selected");
			this.toggle_theme(theme.name);
		});

		return preview;
	}

	toggle_theme(theme) {
		const custom_themes = {
			blue: "dark",
			orange: "light",
			brown: "dark",
		};

		if (theme in custom_themes) {
			const parent = custom_themes[theme];

			// Persist the parent theme to the database
			super.toggle_theme(parent);

			// Overwrite attributes and switcher state with the custom theme
			custom_ui.theme.set(theme);
			this.current_theme = theme;
			return;
		}

		// Standard theme selected
		custom_ui.theme.clear();
		super.toggle_theme(theme);
	}
};
