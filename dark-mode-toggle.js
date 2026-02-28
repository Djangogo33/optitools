/**
 * TUTOFACILE 2.1 - DARK MODE TOGGLE MODULE
 * Provides dark/light theme switching with persistent storage
 * 
 * Features:
 * - System preference detection
 * - Persistent storage (localStorage)
 * - Smooth CSS transitions
 * - Global CSS variable system
 * - Mobile-friendly toggle button
 */

class DarkModeToggle {
	constructor() {
		this.storageKey = 'tutofacile_theme_preference';
		this.htmlElement = document.documentElement;
		this.toggleButton = null;
		this.isDarkMode = this.getStoredPreference() || this.prefersDarkMode();
		this.init();
	}

	/**
	 * Initialize dark mode system
	 */
	init() {
		this.applyTheme(this.isDarkMode);
		this.createToggleButton();
		this.setupEventListeners();
		this.setupSystemPreferenceListener();
	}

	/**
	 * Check if system prefers dark mode
	 */
	prefersDarkMode() {
		return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
	}

	/**
	 * Get stored theme preference from localStorage
	 */
	getStoredPreference() {
		const stored = localStorage.getItem(this.storageKey);
		return stored === 'dark' ? true : stored === 'light' ? false : null;
	}

	/**
	 * Apply theme (dark or light)
	 */
	applyTheme(isDark) {
		this.isDarkMode = isDark;
		
		if (isDark) {
			this.htmlElement.classList.add('dark-mode');
			this.htmlElement.style.setProperty('--bg-primary', '#1a1a2e');
			this.htmlElement.style.setProperty('--bg-secondary', '#0f3460');
			this.htmlElement.style.setProperty('--text-primary', '#eaeaea');
			this.htmlElement.style.setProperty('--text-light', '#b0b0b0');
			this.htmlElement.style.setProperty('--border-color', '#404040');
			document.body.style.backgroundColor = '#1a1a2e';
			document.body.style.color = '#eaeaea';
		} else {
			this.htmlElement.classList.remove('dark-mode');
			this.htmlElement.style.setProperty('--bg-primary', '#ffffff');
			this.htmlElement.style.setProperty('--bg-secondary', '#f5f5f5');
			this.htmlElement.style.setProperty('--text-primary', '#333333');
			this.htmlElement.style.setProperty('--text-light', '#666666');
			this.htmlElement.style.setProperty('--border-color', '#e0e0e0');
			document.body.style.backgroundColor = '#ffffff';
			document.body.style.color = '#333333';
		}

		// Save preference
		localStorage.setItem(this.storageKey, isDark ? 'dark' : 'light');

		// Dispatch event for other modules
		window.dispatchEvent(new CustomEvent('theme-changed', { 
			detail: { isDark, theme: isDark ? 'dark' : 'light' } 
		}));

		// Record analytics event
		if (window.recordSearch) {
			window.recordSearch('theme_toggle', isDark ? 'dark' : 'light', {});
		}
	}

	/**
	 * Create and inject toggle button in header
	 */
	createToggleButton() {
		const header = document.querySelector('header') || document.querySelector('nav');
		if (!header) return;

		// Check if button already exists
		if (document.getElementById('theme-toggle-btn')) return;

		this.toggleButton = document.createElement('button');
		this.toggleButton.id = 'theme-toggle-btn';
		this.toggleButton.className = 'theme-toggle-btn';
		this.toggleButton.innerHTML = this.isDarkMode ? '☀️' : '🌙';
		this.toggleButton.title = this.isDarkMode ? 'Light Mode' : 'Dark Mode';
		this.toggleButton.style.cssText = `
			background: linear-gradient(135deg, var(--primary), var(--accent));
			color: white;
			border: none;
			width: 44px;
			height: 44px;
			border-radius: 50%;
			cursor: pointer;
			font-size: 1.2rem;
			display: flex;
			align-items: center;
			justify-content: center;
			transition: transform 0.3s, box-shadow 0.3s;
			box-shadow: 0 4px 12px rgba(0,0,0,0.15);
			margin-left: 12px;
			z-index: 1000;
		`;

		this.toggleButton.addEventListener('mouseenter', () => {
			this.toggleButton.style.transform = 'scale(1.1)';
			this.toggleButton.style.boxShadow = '0 6px 16px rgba(0,0,0,0.25)';
		});

		this.toggleButton.addEventListener('mouseleave', () => {
			this.toggleButton.style.transform = 'scale(1)';
			this.toggleButton.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
		});

		// Add to header (find appropriate container)
		const headerRight = header.querySelector('.nav-right') || header.querySelector('nav > div:last-child');
		if (headerRight) {
			headerRight.appendChild(this.toggleButton);
		} else {
			header.appendChild(this.toggleButton);
		}

		this.setupToggleListener();
	}

	/**
	 * Setup toggle button click listener
	 */
	setupToggleListener() {
		if (this.toggleButton) {
			this.toggleButton.addEventListener('click', () => this.toggle());
		}
	}

	/**
	 * Toggle between dark and light mode
	 */
	toggle() {
		this.applyTheme(!this.isDarkMode);
		if (this.toggleButton) {
			this.toggleButton.innerHTML = this.isDarkMode ? '☀️' : '🌙';
			this.toggleButton.title = this.isDarkMode ? 'Light Mode' : 'Dark Mode';
			this.toggleButton.style.animation = 'spin-button 0.6s ease-in-out';
		}
	}

	/**
	 * Listen for system preference changes
	 */
	setupSystemPreferenceListener() {
		if (!window.matchMedia) return;

		const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
		darkModeQuery.addEventListener('change', (e) => {
			// Only auto-apply if user hasn't set preference
			if (localStorage.getItem(this.storageKey) === null) {
				this.applyTheme(e.matches);
			}
		});
	}

	/**
	 * Get current theme
	 */
	getTheme() {
		return this.isDarkMode ? 'dark' : 'light';
	}

	/**
	 * Show theme selector modal
	 */
	showThemeSelector() {
		const modal = document.createElement('div');
		modal.innerHTML = `
			<div style="
				position: fixed;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
				background: var(--bg-secondary);
				border-radius: 12px;
				padding: 24px;
				box-shadow: 0 10px 40px rgba(0,0,0,0.3);
				z-index: 10000;
				border: 1px solid var(--border-color);
				color: var(--text-primary);
			">
				<h3 style="margin-top: 0; color: var(--primary);">Theme Préféré</h3>
				<div style="display: flex; gap: 12px; margin-bottom: 16px;">
					<button class="theme-option" data-theme="light" style="
						padding: 12px 20px;
						border: 2px solid ${!this.isDarkMode ? 'var(--primary)' : 'var(--border-color)'};
						background: white;
						color: #333;
						border-radius: 8px;
						cursor: pointer;
						transition: all 0.3s;
					">☀️ Light</button>
					<button class="theme-option" data-theme="dark" style="
						padding: 12px 20px;
						border: 2px solid ${this.isDarkMode ? 'var(--primary)' : 'var(--border-color)'};
						background: #1a1a2e;
						color: #eaeaea;
						border-radius: 8px;
						cursor: pointer;
						transition: all 0.3s;
					">🌙 Dark</button>
					<button class="theme-option" data-theme="system" style="
						padding: 12px 20px;
						border: 2px solid var(--border-color);
						background: var(--bg-secondary);
						color: var(--text-primary);
						border-radius: 8px;
						cursor: pointer;
						transition: all 0.3s;
					">🔄 System</button>
				</div>
				<button onclick="this.closest('div').remove()" style="
					width: 100%;
					padding: 10px;
					background: var(--primary);
					color: white;
					border: none;
					border-radius: 6px;
					cursor: pointer;
					font-weight: 600;
				">Fermer</button>
			</div>
		`;

		document.body.appendChild(modal);

		modal.querySelectorAll('.theme-option').forEach(btn => {
			btn.addEventListener('click', () => {
				const theme = btn.dataset.theme;
				if (theme === 'system') {
					localStorage.removeItem(this.storageKey);
					this.applyTheme(this.prefersDarkMode());
				} else {
					this.applyTheme(theme === 'dark');
				}
				modal.remove();
			});
		});

		// Close on outside click
		document.addEventListener('click', (e) => {
			if (!modal.contains(e.target) && e.target !== this.toggleButton) {
				modal.remove();
			}
		});
	}
}

// Auto-initialize on page load
document.addEventListener('DOMContentLoaded', () => {
	window.darkModeToggle = new DarkModeToggle();
	
	// Add CSS for animation
	const style = document.createElement('style');
	style.textContent = `
		@keyframes spin-button {
			0% { transform: rotate(0deg); }
			50% { transform: rotate(180deg); }
			100% { transform: rotate(360deg); }
		}
		
		.theme-toggle-btn {
			animation: none !important;
		}
		
		.dark-mode * {
			background-color: adjust-color(var(--bg-primary), 5%);
			color: var(--text-primary) !important;
		}
		
		.dark-mode .card {
			background-color: #263849 !important;
			border-color: #404040 !important;
		}
		
		.dark-mode input, 
		.dark-mode textarea, 
		.dark-mode select {
			background-color: #0f3460 !important;
			color: #eaeaea !important;
			border-color: #404040 !important;
		}
	`;
	document.head.appendChild(style);
});

// Export for module system
if (typeof module !== 'undefined' && module.exports) {
	module.exports = DarkModeToggle;
}
