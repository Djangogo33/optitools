// Optimisations de performance et Core Web Vitals

// PERFORMANCE: Lazy load non-critical features
document.addEventListener('DOMContentLoaded', () => {
	// Load social sharing only on demand
	let socialLoaded = false;
	window.addEventListener('scroll', () => {
		if (!socialLoaded && window.scrollY > 1000) {
			const script = document.createElement('script');
			script.src = 'social-sharing.js';
			script.defer = true;
			document.body.appendChild(script);
			socialLoaded = true;
		}
	}, { once: true });

	// Lazy loading des images
	const imageObserver = new IntersectionObserver((entries, observer) => {
		entries.forEach(entry => {
			if(entry.isIntersecting) {
				const img = entry.target;
				if(img.dataset.src) {
					img.src = img.dataset.src;
					img.removeAttribute('data-src');
					observer.unobserve(img);
				}
			}
		});
	}, {
		rootMargin: '50px 0px',
		threshold: 0.01
	});

	document.querySelectorAll('img[data-src]').forEach(img => {
		imageObserver.observe(img);
	});

	// Preload images critiques
	const criticalImages = document.querySelectorAll('img[data-critical]');
	criticalImages.forEach(img => {
		if(img.dataset.src) img.src = img.dataset.src;
	});

	// Web Vitals tracking (si vous avez Google Analytics)
	if(window.gtag) {
		// LCP - Largest Contentful Paint
		new PerformanceObserver((list) => {
			for(const entry of list.getEntries()) {
				console.log('LCP:', entry.startTime);
			}
		}).observe({entryTypes: ['largest-contentful-paint']});

		// FID - First Input Delay
		new PerformanceObserver((list) => {
			for(const entry of list.getEntries()) {
				console.log('FID:', entry.processingDuration);
			}
		}).observe({entryTypes: ['first-input']});

		// CLS - Cumulative Layout Shift
		new PerformanceObserver((list) => {
			for(const entry of list.getEntries()) {
				if(!entry.hadRecentInput) {
					console.log('CLS:', entry.value);
				}
			}
		}).observe({entryTypes: ['layout-shift']});
	}
});
		}).observe({entryTypes: ['layout-shift']});
	}
});

// Désactiver render-blocking CSS optionnel
document.addEventListener('load', () => {
	const nonCriticalCSS = document.querySelector('link[data-non-critical]');
	if(nonCriticalCSS) {
		nonCriticalCSS.media = 'all';
	}
});
