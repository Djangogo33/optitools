/**
 * TUTOFACILE 2.1 - SOCIAL SHARING MODULE
 * Enables users to share tutorials on social media platforms
 * 
 * Features:
 * - Twitter, Facebook, LinkedIn sharing
 * - Share counters and analytics
 * - Custom share messages
 * - Mobile-optimized sharing
 * - Deep linking support
 */

class SocialSharing {
	constructor() {
		this.baseUrl = window.location.origin;
		this.config = {
			twitter: {
				url: 'https://twitter.com/intent/tweet',
				color: '#1DA1F2',
				icon: '𝕏'
			},
			facebook: {
				url: 'https://www.facebook.com/sharer/sharer.php',
				color: '#1877F2',
				icon: 'f'
			},
			linkedin: {
				url: 'https://www.linkedin.com/sharing/share-offsite/',
				color: '#0A66C2',
				icon: 'in'
			},
			whatsapp: {
				url: 'https://wa.me/?text=',
				color: '#25D366',
				icon: '💬'
			},
			telegram: {
				url: 'https://t.me/share/url',
				color: '#0088cc',
				icon: '✈️'
			},
			email: {
				url: 'mailto:',
				color: '#666666',
				icon: '✉️'
			}
		};

		this.shares = this.loadShareCounts();
		this.init();
	}

	/**
	 * Initialize social sharing
	 */
	init() {
		this.loadShareCounts();
		this.createShareButtons();
		this.setupEventListeners();
	}

	/**
	 * Load share counts from localStorage
	 */
	loadShareCounts() {
		const stored = localStorage.getItem('tutofacile_share_counts');
		return stored ? JSON.parse(stored) : {};
	}

	/**
	 * Save share counts to localStorage
	 */
	saveShareCounts() {
		localStorage.setItem('tutofacile_share_counts', JSON.stringify(this.shares));
	}

	/**
	 * Share on Twitter
	 */
	shareOnTwitter(title, url = null) {
		url = url || window.location.href;
		const text = `📚 Découvrez "${title}" sur TutoFacile - Des tutoriels gratuits et faciles! #TutoFacile`;
		const twitterUrl = `${this.config.twitter.url}?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
		
		window.open(twitterUrl, 'twitter-share', 'width=550,height=420');
		this.recordShare('twitter', title);
	}

	/**
	 * Share on Facebook
	 */
	shareOnFacebook(title, url = null) {
		url = url || window.location.href;
		const facebookUrl = `${this.config.facebook.url}?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(title)}`;
		
		window.open(facebookUrl, 'facebook-share', 'width=550,height=420');
		this.recordShare('facebook', title);
	}

	/**
	 * Share on LinkedIn
	 */
	shareOnLinkedIn(title, url = null) {
		url = url || window.location.href;
		const linkedinUrl = `${this.config.linkedin.url}?url=${encodeURIComponent(url)}`;
		
		window.open(linkedinUrl, 'linkedin-share', 'width=550,height=420');
		this.recordShare('linkedin', title);
	}

	/**
	 * Share on WhatsApp
	 */
	shareOnWhatsApp(title, url = null) {
		url = url || window.location.href;
		const message = `📚 ${title}\n\n${url}\n\nDécouvrez TutoFacile - Des tutoriels gratuits!`;
		const whatsappUrl = `${this.config.whatsapp.url}${encodeURIComponent(message)}`;
		
		window.open(whatsappUrl, 'whatsapp-share', 'width=550,height=420');
		this.recordShare('whatsapp', title);
	}

	/**
	 * Share on Telegram
	 */
	shareOnTelegram(title, url = null) {
		url = url || window.location.href;
		const telegramUrl = `${this.config.telegram.url}?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
		
		window.open(telegramUrl, 'telegram-share', 'width=550,height=420');
		this.recordShare('telegram', title);
	}

	/**
	 * Share via Email
	 */
	shareViaEmail(title, description = '', url = null) {
		url = url || window.location.href;
		const subject = `📚 ${title} - TutoFacile`;
		const body = `Bonjour,\n\nVous devriez voir ce super tutoriel!\n\n${title}\n${description}\n\n${url}\n\nTutoFacile - Des tutoriels gratuits`;
		const emailUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
		
		window.location.href = emailUrl;
		this.recordShare('email', title);
	}

	/**
	 * Create share buttons UI
	 */
	createShareButtons(containerId = 'share-buttons-container') {
		let container = document.getElementById(containerId);
		
		if (!container) {
			container = document.createElement('div');
			container.id = containerId;
			container.style.cssText = `
				display: flex;
				gap: 12px;
				flex-wrap: wrap;
				align-items: center;
				justify-content: center;
				margin: 24px 0;
				padding: 16px;
				background: linear-gradient(135deg, rgba(52, 152, 219, 0.1), rgba(46, 204, 113, 0.1));
				border-radius: 12px;
				border: 1px solid rgba(52, 152, 219, 0.2);
			`;

			// Add label
			const label = document.createElement('span');
			label.textContent = '📤 Partager:';
			label.style.cssText = 'font-weight: 600; color: var(--primary);';
			container.appendChild(label);

			// Add buttons
			const platforms = ['twitter', 'facebook', 'linkedin', 'whatsapp', 'telegram', 'email'];
			platforms.forEach(platform => {
				const btn = this.createShareButton(platform);
				container.appendChild(btn);
			});

			return container;
		}

		return container;
	}

	/**
	 * Create individual share button
	 */
	createShareButton(platform) {
		const btn = document.createElement('button');
		const config = this.config[platform];
		
		btn.className = `share-btn share-${platform}`;
		btn.innerHTML = config.icon;
		btn.title = `Partager sur ${platform.charAt(0).toUpperCase() + platform.slice(1)}`;
		btn.style.cssText = `
			background: ${config.color};
			color: white;
			border: none;
			width: 40px;
			height: 40px;
			border-radius: 50%;
			cursor: pointer;
			font-size: 1.2rem;
			display: flex;
			align-items: center;
			justify-content: center;
			transition: all 0.3s;
			box-shadow: 0 4px 12px rgba(0,0,0,0.15);
		`;

		btn.addEventListener('mouseenter', () => {
			btn.style.transform = 'scale(1.15) translateY(-2px)';
			btn.style.boxShadow = `0 6px 16px ${config.color}66`;
		});

		btn.addEventListener('mouseleave', () => {
			btn.style.transform = 'scale(1) translateY(0)';
			btn.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
		});

		btn.addEventListener('click', () => {
			this.handleShare(platform);
		});

		return btn;
	}

	/**
	 * Handle share button click
	 */
	handleShare(platform) {
		const title = document.querySelector('h1')?.textContent || 'Tutorial';
		const description = document.querySelector('meta[property="og:description"]')?.getAttribute('content') || '';
		const url = window.location.href;

		switch(platform) {
			case 'twitter':
				this.shareOnTwitter(title, url);
				break;
			case 'facebook':
				this.shareOnFacebook(title, url);
				break;
			case 'linkedin':
				this.shareOnLinkedIn(title, url);
				break;
			case 'whatsapp':
				this.shareOnWhatsApp(title, url);
				break;
			case 'telegram':
				this.shareOnTelegram(title, url);
				break;
			case 'email':
				this.shareViaEmail(title, description, url);
				break;
		}
	}

	/**
	 * Record share for analytics
	 */
	recordShare(platform, title) {
		try {
			// Update local counts
			const key = `${title}_${platform}`;
			this.shares[key] = (this.shares[key] || 0) + 1;
			this.saveShareCounts();

			// Record analytics
			if (window.analyticsEngine) {
				window.analyticsEngine.trackEvent('social_share', {
					platform,
					title,
					timestamp: new Date().toISOString()
				});
			}

			// Gamification
			if (window.gamificationEngine) {
				window.gamificationEngine.recordAction('share_tutorial', { platform, title });
			}

			// Notification
			if (window.notificationManager) {
				window.notificationManager.success(`✅ Partagé sur ${platform}!`);
			}

			console.log(`📤 Shared "${title}" on ${platform}`);
		} catch(e) {
			console.warn('Error recording share:', e);
		}
	}

	/**
	 * Get share count for content
	 */
	getShareCount(title, platform = null) {
		if (platform) {
			return this.shares[`${title}_${platform}`] || 0;
		}
		
		let total = 0;
		Object.keys(this.shares).forEach(key => {
			if (key.startsWith(title)) {
				total += this.shares[key];
			}
		});
		return total;
	}

	/**
	 * Display share statistics
	 */
	displayShareStats(title) {
		const stats = document.createElement('div');
		stats.style.cssText = `
			background: #f8f9fa;
			padding: 16px;
			border-radius: 8px;
			margin: 12px 0;
			border-left: 4px solid var(--primary);
		`;

		let content = `<h4 style="margin-top: 0;">📊 Partages de "${title}"</h4>`;
		
		Object.keys(this.config).forEach(platform => {
			const count = this.getShareCount(title, platform);
			if (count > 0) {
				content += `<p style="margin: 8px 0;"><strong>${platform}:</strong> ${count} partage(s)</p>`;
			}
		});

		const total = this.getShareCount(title);
		content += `<p style="margin: 8px 0; border-top: 1px solid #ddd; padding-top: 8px; font-weight: bold;">Total: ${total} partage(s)</p>`;

		stats.innerHTML = content;
		return stats;
	}

	/**
	 * Get most shared tutorials
	 */
	getMostSharedTutorials(limit = 5) {
		const tutorialShares = {};
		
		Object.keys(this.shares).forEach(key => {
			const title = key.replace(/_\w+$/, '');
			tutorialShares[title] = (tutorialShares[title] || 0) + this.shares[key];
		});

		return Object.entries(tutorialShares)
			.sort(([,a], [,b]) => b - a)
			.slice(0, limit)
			.map(([title, count]) => ({ title, count }));
	}

	/**
	 * Generate share widget for website
	 */
	generateShareWidget() {
		const widget = document.createElement('div');
		widget.className = 'tutofacile-share-widget';
		widget.style.cssText = `
			position: fixed;
			right: 20px;
			bottom: 80px;
			z-index: 999;
			background: white;
			border-radius: 12px;
			box-shadow: 0 8px 24px rgba(0,0,0,0.2);
			padding: 16px;
			border: 2px solid var(--primary);
		`;

		widget.innerHTML = `
			<h4 style="margin: 0 0 12px 0; font-size: 14px;">Partager ce contenu</h4>
			<div id="widget-share-buttons" style="display: flex; gap: 8px; flex-wrap: wrap;"></div>
		`;

		document.body.appendChild(widget);

		// Populate with buttons
		const buttonsContainer = widget.querySelector('#widget-share-buttons');
		['twitter', 'facebook', 'linkedin', 'whatsapp', 'email'].forEach(platform => {
			const btn = this.createShareButton(platform);
			btn.style.width = '32px';
			btn.style.height = '32px';
			btn.style.fontSize = '0.9rem';
			btn.style.margin = '0';
			buttonsContainer.appendChild(btn);
		});

		return widget;
	}
}

// Auto-initialize on page load
document.addEventListener('DOMContentLoaded', () => {
	window.socialSharing = new SocialSharing();
	
	// Add share buttons to tutorial pages
	if (document.querySelector('.tutorial-content') || window.location.pathname.includes('/pages/')) {
		setTimeout(() => {
			const container = document.querySelector('.tutorial-actions') || 
			                 document.querySelector('h1')?.parentElement;
			if (container) {
				container.appendChild(window.socialSharing.createShareButtons());
			}
		}, 500);
	}
});

// Export for module system
if (typeof module !== 'undefined' && module.exports) {
	module.exports = SocialSharing;
}
