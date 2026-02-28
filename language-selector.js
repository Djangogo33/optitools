/**
 * TUTOFACILE 2.1 - MULTI-LANGUAGE SELECTOR
 * Provides language switching and content localization
 * 
 * Features:
 * - Support for multiple languages (FR, EN, ES, DE, IT)
 * - Persistent language preference
 * - Auto-detection of browser language
 * - Real-time content switching
 * - RTL support ready
 */

class LanguageSelector {
	constructor() {
		this.storageKey = 'tutofacile_language';
		this.currentLang = this.getStoredLanguage() || this.detectBrowserLanguage() || 'fr';
		
		this.translations = {
			fr: {
				language: 'Français',
				search: '🔍 Rechercher un tuto...',
				filters: '🔍 Filtres Avancés',
				recommendations: 'Pour vous',
				darkMode: 'Mode Sombre',
				lightMode: 'Mode Clair',
				share: 'Partager',
				export: 'Exporter',
				settings: 'Paramètres',
				tutorials: 'Tutoriels',
				category: 'Catégorie',
				difficulty: 'Difficulté',
				time: 'Temps',
				easy: 'Facile',
				medium: 'Moyen',
				hard: 'Difficile',
				noResults: 'Aucun résultat trouvé',
				loading: 'Chargement...',
				error: 'Une erreur est survenue',
				success: 'Succès!',
				close: 'Fermer',
				save: 'Enregistrer',
				cancel: 'Annuler',
				delete: 'Supprimer',
				edit: 'Modifier'
			},
			en: {
				language: 'English',
				search: '🔍 Search tutorials...',
				filters: '🔍 Advanced Filters',
				recommendations: 'For You',
				darkMode: 'Dark Mode',
				lightMode: 'Light Mode',
				share: 'Share',
				export: 'Export',
				settings: 'Settings',
				tutorials: 'Tutorials',
				category: 'Category',
				difficulty: 'Difficulty',
				time: 'Time',
				easy: 'Easy',
				medium: 'Medium',
				hard: 'Hard',
				noResults: 'No results found',
				loading: 'Loading...',
				error: 'An error occurred',
				success: 'Success!',
				close: 'Close',
				save: 'Save',
				cancel: 'Cancel',
				delete: 'Delete',
				edit: 'Edit'
			},
			es: {
				language: 'Español',
				search: '🔍 Buscar tutoriales...',
				filters: '🔍 Filtros Avanzados',
				recommendations: 'Para Ti',
				darkMode: 'Modo Oscuro',
				lightMode: 'Modo Claro',
				share: 'Compartir',
				export: 'Exportar',
				settings: 'Configuración',
				tutorials: 'Tutoriales',
				category: 'Categoría',
				difficulty: 'Dificultad',
				time: 'Tiempo',
				easy: 'Fácil',
				medium: 'Medio',
				hard: 'Difícil',
				noResults: 'No se encontraron resultados',
				loading: 'Cargando...',
				error: 'Ocurrió un error',
				success: '¡Éxito!',
				close: 'Cerrar',
				save: 'Guardar',
				cancel: 'Cancelar',
				delete: 'Eliminar',
				edit: 'Editar'
			},
			de: {
				language: 'Deutsch',
				search: '🔍 Tutorials durchsuchen...',
				filters: '🔍 Erweiterte Filter',
				recommendations: 'Für Sie',
				darkMode: 'Dunkler Modus',
				lightMode: 'Heller Modus',
				share: 'Teilen',
				export: 'Exportieren',
				settings: 'Einstellungen',
				tutorials: 'Tutorials',
				category: 'Kategorie',
				difficulty: 'Schwierigkeitsgrad',
				time: 'Zeit',
				easy: 'Einfach',
				medium: 'Mittel',
				hard: 'Schwierig',
				noResults: 'Keine Ergebnisse gefunden',
				loading: 'Wird geladen...',
				error: 'Ein Fehler ist aufgetreten',
				success: 'Erfolg!',
				close: 'Schließen',
				save: 'Speichern',
				cancel: 'Abbrechen',
				delete: 'Löschen',
				edit: 'Bearbeiten'
			},
			it: {
				language: 'Italiano',
				search: '🔍 Cerca tutorial...',
				filters: '🔍 Filtri Avanzati',
				recommendations: 'Per Te',
				darkMode: 'Modalità Scura',
				lightMode: 'Modalità Chiara',
				share: 'Condividi',
				export: 'Esporta',
				settings: 'Impostazioni',
				tutorials: 'Tutorial',
				category: 'Categoria',
				difficulty: 'Difficoltà',
				time: 'Tempo',
				easy: 'Facile',
				medium: 'Medio',
				hard: 'Difficile',
				noResults: 'Nessun risultato trovato',
				loading: 'Caricamento...',
				error: 'Si è verificato un errore',
				success: 'Successo!',
				close: 'Chiudi',
				save: 'Salva',
				cancel: 'Annulla',
				delete: 'Elimina',
				edit: 'Modifica'
			}
		};

		this.init();
	}

	/**
	 * Initialize language selector
	 */
	init() {
		this.applyLanguage(this.currentLang);
		this.createLanguageSelector();
		this.setupEventListeners();
	}

	/**
	 * Get stored language preference
	 */
	getStoredLanguage() {
		return localStorage.getItem(this.storageKey);
	}

	/**
	 * Detect browser language
	 */
	detectBrowserLanguage() {
		const browserLang = (navigator.language || navigator.userLanguage).split('-')[0].toLowerCase();
		const supportedLanguages = Object.keys(this.translations);
		return supportedLanguages.includes(browserLang) ? browserLang : 'fr';
	}

	/**
	 * Apply language globally
	 */
	applyLanguage(lang) {
		if (!this.translations[lang]) {
			console.warn(`❌ Language ${lang} not supported, falling back to French`);
			lang = 'fr';
		}

		this.currentLang = lang;
		localStorage.setItem(this.storageKey, lang);

		// Update document language
		document.documentElement.lang = lang;

		// Update all translated elements
		this.updateTranslatedElements(lang);

		// Set text direction for RTL languages
		if (lang === 'ar') {
			document.documentElement.dir = 'rtl';
		} else {
			document.documentElement.dir = 'ltr';
		}

		// Dispatch event for other modules
		window.dispatchEvent(new CustomEvent('language-changed', { 
			detail: { lang, translations: this.translations[lang] } 
		}));

		console.log(`🌐 Language changed to: ${lang}`);
	}

	/**
	 * Update all elements with data-i18n attribute
	 */
	updateTranslatedElements(lang) {
		document.querySelectorAll('[data-i18n]').forEach(el => {
			const key = el.getAttribute('data-i18n');
			const translation = this.t(key, lang);
			
			if (el.placeholder !== undefined) {
				el.placeholder = translation;
			} else if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
				el.value = translation;
			} else {
				el.textContent = translation;
			}
		});
	}

	/**
	 * Translate key
	 */
	t(key, lang = null) {
		lang = lang || this.currentLang;
		return (this.translations[lang] && this.translations[lang][key]) || key;
	}

	/**
	 * Create language selector button
	 */
	createLanguageSelector() {
		const header = document.querySelector('header') || document.querySelector('nav');
		if (!header) return;

		// Check if already exists
		if (document.getElementById('language-selector-btn')) return;

		const btn = document.createElement('button');
		btn.id = 'language-selector-btn';
		btn.className = 'language-selector-btn';
		btn.innerHTML = '🌐 ' + this.currentLang.toUpperCase();
		btn.style.cssText = `
			background: linear-gradient(135deg, var(--primary), var(--accent));
			color: white;
			border: none;
			padding: 10px 16px;
			border-radius: 8px;
			cursor: pointer;
			font-weight: 600;
			transition: all 0.3s;
			margin-left: 12px;
			box-shadow: 0 4px 12px rgba(0,0,0,0.15);
		`;

		btn.addEventListener('mouseenter', () => {
			btn.style.transform = 'scale(1.05)';
			btn.style.boxShadow = '0 6px 16px rgba(0,0,0,0.25)';
		});

		btn.addEventListener('mouseleave', () => {
			btn.style.transform = 'scale(1)';
			btn.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
		});

		btn.addEventListener('click', () => this.showLanguageModal());

		const headerRight = header.querySelector('.nav-right') || header.querySelector('nav > div:last-child');
		if (headerRight) {
			headerRight.appendChild(btn);
		} else {
			header.appendChild(btn);
		}
	}

	/**
	 * Show language selection modal
	 */
	showLanguageModal() {
		// Remove existing modal if any
		const existing = document.getElementById('language-modal');
		if (existing) existing.remove();

		const modal = document.createElement('div');
		modal.id = 'language-modal';
		modal.style.cssText = `
			position: fixed;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			background: var(--bg-secondary);
			border-radius: 12px;
			padding: 28px;
			box-shadow: 0 10px 40px rgba(0,0,0,0.3);
			z-index: 10001;
			border: 1px solid var(--border-color);
			color: var(--text-primary);
			max-width: 400px;
			width: 90%;
		`;

		let html = '<h3 style="margin-top: 0; color: var(--primary); text-align: center;">🌐 Sélectionner la Langue</h3>';
		html += '<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px;">';

		Object.keys(this.translations).forEach(lang => {
			const isActive = lang === this.currentLang;
			html += `
				<button class="lang-option" data-lang="${lang}" style="
					padding: 14px;
					border: 2px solid ${isActive ? 'var(--primary)' : 'var(--border-color)'};
					background: ${isActive ? 'rgba(52, 152, 219, 0.1)' : 'transparent'};
					color: var(--text-primary);
					border-radius: 8px;
					cursor: pointer;
					font-weight: 600;
					transition: all 0.3s;
				">${this.translations[lang].language}</button>
			`;
		});

		html += '</div>';
		html += `
			<button onclick="this.closest('div').remove()" style="
				width: 100%;
				padding: 12px;
				background: var(--primary);
				color: white;
				border: none;
				border-radius: 6px;
				cursor: pointer;
				font-weight: 600;
				transition: all 0.3s;
			" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">
				Fermer
			</button>
		`;

		modal.innerHTML = html;
		document.body.appendChild(modal);

		// Setup language option listeners
		modal.querySelectorAll('.lang-option').forEach(btn => {
			btn.addEventListener('click', () => {
				const lang = btn.getAttribute('data-lang');
				this.applyLanguage(lang);
				document.getElementById('language-selector-btn').innerHTML = '🌐 ' + lang.toUpperCase();
				
				// Update modal appearance
				modal.querySelectorAll('.lang-option').forEach(b => {
					b.style.borderColor = b.getAttribute('data-lang') === lang ? 'var(--primary)' : 'var(--border-color)';
					b.style.background = b.getAttribute('data-lang') === lang ? 'rgba(52, 152, 219, 0.1)' : 'transparent';
				});
			});
		});

		// Close on outside click
		document.addEventListener('click', (e) => {
			if (!modal.contains(e.target) && e.target.id !== 'language-selector-btn') {
				modal.remove();
			}
		});
	}

	/**
	 * Get all available languages
	 */
	getAvailableLanguages() {
		return Object.keys(this.translations).map(lang => ({
			code: lang,
			name: this.translations[lang].language
		}));
	}

	/**
	 * Set language programmatically
	 */
	setLanguage(lang) {
		if (this.translations[lang]) {
			this.applyLanguage(lang);
			return true;
		}
		console.error(`❌ Language ${lang} not supported`);
		return false;
	}

	/**
	 * Get current language code
	 */
	getCurrentLanguage() {
		return this.currentLang;
	}

	/**
	 * Get all translations for current language
	 */
	getAllTranslations() {
		return this.translations[this.currentLang];
	}

	/**
	 * Add new language
	 */
	addLanguage(code, translations) {
		this.translations[code] = translations;
		console.log(`✅ Language ${code} added`);
	}

	/**
	 * Auto-detect and apply language
	 */
	autoDetectLanguage() {
		const detectedLang = this.detectBrowserLanguage();
		this.applyLanguage(detectedLang);
		return detectedLang;
	}
}

// Auto-initialize on page load
document.addEventListener('DOMContentLoaded', () => {
	window.languageSelector = new LanguageSelector();
	
	// Record language selection in analytics
	if (window.analyticsEngine) {
		window.analyticsEngine.trackEvent('language_selected', { 
			language: window.languageSelector.currentLang 
		});
	}
});

// Export for module system
if (typeof module !== 'undefined' && module.exports) {
	module.exports = LanguageSelector;
}
