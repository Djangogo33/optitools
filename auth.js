// ============================================================
// TUTOFACILE - AUTHENTICATION SYSTEM (IMPROVED)
// ============================================================

const AUTH = {
	// Better hash function (simulates bcrypt-like behavior)
	// NOTE: This is client-side only - NOT production-grade security
	hashPassword: function(password, username) {
		// Create a more robust hash using multiple iterations
		let hash = password + username;
		for (let i = 0; i < 1000; i++) {
			let h = 0;
			for (let j = 0; j < hash.length; j++) {
				h = ((h << 5) - h) + hash.charCodeAt(j);
				h = h & h;
			}
			hash = Math.abs(h).toString(16) + i;
		}
		return 'hash_' + hash.substring(0, 64);
	},

	// Register new user
	register: function(username, email, password) {
		if (!username || !email || !password) {
			return { success: false, message: 'Tous les champs sont requis' };
		}

		if (password.length < 6) {
			return { success: false, message: 'Le mot de passe doit avoir au moins 6 caractères' };
		}

		try {
			const users = JSON.parse(localStorage.getItem('tutofacile_users') || '{}');
			
			if (users[username]) {
				return { success: false, message: 'Cet utilisateur existe déjà' };
			}

			const hashedPassword = this.hashPassword(password, username);
			users[username] = {
				email: email,
				password: hashedPassword,
				created_at: new Date().toISOString(),
				tutorials: []
			};

			localStorage.setItem('tutofacile_users', JSON.stringify(users));
			return { success: true, message: 'Inscription réussie!' };
		} catch (e) {
			return { success: false, message: 'Erreur lors de l\'inscription: ' + e.message };
		}
	},

	// Login user
	login: function(username, password, isAdmin = false) {
		if (!username || !password) {
			return { success: false, message: 'Tous les champs sont requis' };
		}

		try {
			if (isAdmin) {
				if (username === 'admin' && password === 'paul1810') {
					const adminUser = {
						username: 'admin',
						email: 'djangogo33.tdac@gmail.com',
						role: 'admin',
						login_time: new Date().toISOString()
					};
					localStorage.setItem('tutofacile_current_user', JSON.stringify(adminUser));
					localStorage.setItem('tutofacile_admin_user', JSON.stringify(adminUser));
					
					// Also set in sessionStorage for cross-tab support
					sessionStorage.setItem('tutofacile_current_user', JSON.stringify(adminUser));
					
					return { success: true, message: 'Connexion admin réussie!' };
				} else {
					return { success: false, message: 'Identifiants admin invalides' };
				}
			}

			const users = JSON.parse(localStorage.getItem('tutofacile_users') || '{}');

			if (!users[username]) {
				return { success: false, message: 'Utilisateur introuvable' };
			}

			const hashedPassword = this.hashPassword(password, username);
			if (users[username].password !== hashedPassword) {
				return { success: false, message: 'Mot de passe incorrect' };
			}

			const currentUser = {
				username: username,
				email: users[username].email,
				role: 'user',
				login_time: new Date().toISOString()
			};

			localStorage.setItem('tutofacile_current_user', JSON.stringify(currentUser));
			// Also set in sessionStorage for cross-tab support
			sessionStorage.setItem('tutofacile_current_user', JSON.stringify(currentUser));
			
			return { success: true, message: 'Connexion réussie!' };
		} catch (e) {
			return { success: false, message: 'Erreur lors de la connexion: ' + e.message };
		}
	},

	// Logout
	logout: function() {
		try {
			localStorage.removeItem('tutofacile_current_user');
			localStorage.removeItem('tutofacile_admin_user');
			sessionStorage.removeItem('tutofacile_current_user');
			sessionStorage.removeItem('tutofacile_admin_user');
		} catch (e) {
			console.log('Erreur logout:', e);
		}
	},

	// Get current user (check localStorage + sessionStorage)
	getCurrentUser: function() {
		try {
			// Try localStorage first
			let user = localStorage.getItem('tutofacile_current_user');
			if (user) return JSON.parse(user);
			
			// Fallback to sessionStorage
			user = sessionStorage.getItem('tutofacile_current_user');
			if (user) return JSON.parse(user);
			
			return null;
		} catch (e) {
			return null;
		}
	},

	// Check if user is logged in
	isLoggedIn: function() {
		return !!this.getCurrentUser();
	},

	// Check if user is admin
	isAdmin: function() {
		const user = this.getCurrentUser();
		return user && user.role === 'admin';
	},

	// Save tutorial for user
	saveTutorial: function(tutorialData) {
		const user = this.getCurrentUser();
		if (!user) return { success: false, message: 'Non connecté' };

		const tutorials = JSON.parse(localStorage.getItem(`tutofacile_user_${user.username}_tutorials`) || '[]');
		
		const tutorial = {
			id: 'tuto_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
			title: tutorialData.title,
			description: tutorialData.description,
			category: tutorialData.category,
			difficulty: tutorialData.difficulty,
			time: tutorialData.time,
			content: tutorialData.content || [],
			images: tutorialData.images || [],
			created_at: new Date().toISOString(),
			updated_at: new Date().toISOString(),
			published: false
		};

		tutorials.push(tutorial);
		localStorage.setItem(`tutofacile_user_${user.username}_tutorials`, JSON.stringify(tutorials));

		return { success: true, message: 'Tutoriel sauvegardé!', tutorial };
	},

	// Get user tutorials
	getUserTutorials: function(username = null) {
		if (!username) {
			const user = this.getCurrentUser();
			if (!user) return [];
			username = user.username;
		}

		const tutorials = localStorage.getItem(`tutofacile_user_${username}_tutorials`);
		return tutorials ? JSON.parse(tutorials) : [];
	},

	// Update tutorial
	updateTutorial: function(tutorialId, updatedData) {
		const user = this.getCurrentUser();
		if (!user) return { success: false, message: 'Non connecté' };

		const tutorials = this.getUserTutorials(user.username);
		const index = tutorials.findIndex(t => t.id === tutorialId);

		if (index === -1) {
			return { success: false, message: 'Tutoriel introuvable' };
		}

		tutorials[index] = {
			...tutorials[index],
			...updatedData,
			updated_at: new Date().toISOString()
		};

		localStorage.setItem(`tutofacile_user_${user.username}_tutorials`, JSON.stringify(tutorials));
		return { success: true, message: 'Tutoriel mis à jour!', tutorial: tutorials[index] };
	},

	// Delete tutorial
	deleteTutorial: function(tutorialId) {
		const user = this.getCurrentUser();
		if (!user) return { success: false, message: 'Non connecté' };

		let tutorials = this.getUserTutorials(user.username);
		tutorials = tutorials.filter(t => t.id !== tutorialId);

		localStorage.setItem(`tutofacile_user_${user.username}_tutorials`, JSON.stringify(tutorials));
		return { success: true, message: 'Tutoriel supprimé!' };
	},

	// Get tutorial by ID
	getTutorialById: function(tutorialId, username = null) {
		if (!username) {
			const user = this.getCurrentUser();
			if (!user) return null;
			username = user.username;
		}

		const tutorials = this.getUserTutorials(username);
		return tutorials.find(t => t.id === tutorialId) || null;
	}
};

// Export for Node.js if needed
if (typeof module !== 'undefined' && module.exports) {
	module.exports = AUTH;
}
