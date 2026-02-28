document.addEventListener('DOMContentLoaded', () => {
	const COOKIE_CONSENT_KEY = 'tutofacile_cookie_consent';
	const COOKIE_EXPIRY = 365 * 24 * 60 * 60 * 1000; // 1 an

	// Vérifier si l'utilisateur a déjà accepté/refusé
	function hasUserMadeChoice() {
		const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
		console.log('Consentement stocké:', consent);
		return consent !== null && consent !== undefined && consent !== '';
	}

	// Récupérer les préférences sauvegardées
	function getConsentPreferences() {
		try {
			const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
			if(consent) {
				return JSON.parse(consent);
			}
		} catch(e) {
			console.error('Erreur parsing consentement:', e);
		}
		return null;
	}

	// Afficher la banneau seulement si pas de choix précédent
	function showCookieBanner() {
		if(!hasUserMadeChoice()) {
			console.log('Affichage banneau cookies');
			const banner = document.getElementById('cookie-banner');
			if(banner) {
				banner.classList.add('active');
			}
		} else {
			console.log('Utilisateur a déjà fait un choix');
		}
	}

	// Accepter les cookies
	window.acceptCookies = () => {
		const consent = {
			accepted: true,
			date: new Date().toISOString(),
			essential: true,
			functional: true,
			analytics: true,
			advertising: true
		};
		console.log('Acceptation des cookies:', consent);
		localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consent));
		closeCookieBanner();
		loadAnalytics(true);
	};

	// Refuser les cookies (sauf essentiels)
	window.refuseCookies = () => {
		const consent = {
			accepted: false,
			date: new Date().toISOString(),
			essential: true,
			functional: false,
			analytics: false,
			advertising: false
		};
		console.log('Refus des cookies:', consent);
		localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consent));
		closeCookieBanner();
	};

	// Ouvrir les paramètres de cookies
	window.openCookieSettings = () => {
		console.log('Ouverture paramètres cookies');
		const modal = document.getElementById('cookie-settings-modal');
		if(modal) {
			// Charger les préférences actuelles
			const prefs = getConsentPreferences();
			if(prefs) {
				document.getElementById('cookie-functional').checked = prefs.functional || false;
				document.getElementById('cookie-analytics').checked = prefs.analytics || false;
				document.getElementById('cookie-advertising').checked = prefs.advertising || false;
			}
			modal.classList.add('active');
		}
	};

	// Fermer la banneau
	function closeCookieBanner() {
		console.log('Fermeture banneau');
		const banner = document.getElementById('cookie-banner');
		if(banner) {
			banner.classList.remove('active');
		}
	}

	// Fermer le modal
	window.closeCookieSettings = () => {
		console.log('Fermeture paramètres');
		const modal = document.getElementById('cookie-settings-modal');
		if(modal) {
			modal.classList.remove('active');
		}
	};

	// Sauvegarder les préférences personnalisées
	window.saveCookiePreferences = () => {
		const preferences = {
			accepted: true,
			date: new Date().toISOString(),
			essential: true,
			functional: document.getElementById('cookie-functional').checked,
			analytics: document.getElementById('cookie-analytics').checked,
			advertising: document.getElementById('cookie-advertising').checked
		};
		console.log('Sauvegarde préférences:', preferences);
		localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(preferences));
		closeCookieSettings();
		closeCookieBanner();
		loadAnalytics(preferences.analytics);
	};

	// Charger les analytiques si accepté
	function loadAnalytics(acceptedAnalytics) {
		const consent = getConsentPreferences();
		const shouldLoad = acceptedAnalytics || (consent && consent.analytics);
		
		if(shouldLoad) {
			console.log('Chargement analytiques');
			// Ajouter Google Analytics ou autre service
			// window.dataLayer = window.dataLayer || [];
			// function gtag(){dataLayer.push(arguments);}
			// gtag('consent', 'update', {'analytics_storage': 'granted'});
		} else {
			console.log('Analytiques refusées');
		}
	}

	// Afficher la banneau au démarrage SEULEMENT si pas de choix
	showCookieBanner();
});
