// CSS and JavaScript optimization for better performance

/**
 * Defer loading of non-critical stylesheets
 * Improves FCP (First Contentful Paint)
 */
function deferNonCriticalCSS() {
  const links = document.querySelectorAll('link[rel="stylesheet"]');
  
  links.forEach(link => {
    // Keep critical CSS (main style.css) in default loading
    if (!link.href.includes('critical') && !link.href.includes('style.css')) {
      // Load non-critical CSS with media query trick to avoid render-blocking
      const media = link.media || 'all';
      link.media = 'print';
      link.onload = function() {
        this.media = media;
      };
      if (link.sheet) {
        link.onload();
      }
    }
  });
}

/**
 * Optimize Web Fonts loading
 * Prevents FOUT (Flash of Unstyled Text)
 */
function optimizeFontLoading() {
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
      document.documentElement.classList.add('fonts-loaded');
    });
  }
}

/**
 * Reduce JavaScript execution time
 * Break long tasks into smaller chunks
 */
function optimizeJSExecution() {
  // If scheduler.yield is available (recent browsers), use it
  if ('scheduler' in window && 'yield' in scheduler) {
    const runNextTask = async (tasks) => {
      for (const task of tasks) {
        await scheduler.yield();
        task();
      }
    };
    
    // Expose for use by other scripts
    window.runOptimizedTasks = runNextTask;
  } else {
    // Fallback for older browsers using requestIdleCallback
    window.runOptimizedTasks = (tasks) => {
      let taskIndex = 0;
      const runNext = () => {
        if (taskIndex < tasks.length) {
          const remaining = tasks.length - taskIndex;
          const timeout = remaining > 3 ? 0 : 1000; // Give more time to remaining tasks
          
          requestIdleCallback(() => {
            tasks[taskIndex]();
            taskIndex++;
            runNext();
          }, { timeout });
        }
      };
      runNext();
    };
  }
}

/**
 * Improve interaction responsiveness
 * Reduce main thread blocking
 */
function improveResponsiveness() {
  // Monitor for long tasks
  if ('PerformanceObserver' in window) {
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > 50) {
            console.warn('Long task detected:', entry.duration + 'ms');
          }
        }
      });
      observer.observe({ entryTypes: ['longtask'] });
    } catch (e) {
      console.log('Long task monitoring not available');
    }
  }
}

/**
 * Monitor Core Web Vitals in real-time
 */
function monitorWebVitals() {
  // Largest Contentful Paint (LCP)
  if ('PerformanceObserver' in window) {
    try {
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        console.log('LCP:', lastEntry.renderTime || lastEntry.loadTime);
      }).observe({ entryTypes: ['largest-contentful-paint'] });
    } catch (e) {}
  }
  
  // Cumulative Layout Shift (CLS)
  if ('PerformanceObserver' in window) {
    try {
      let cls = 0;
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            cls += entry.value;
            console.log('CLS Update:', cls);
          }
        }
      }).observe({ entryTypes: ['layout-shift'] });
    } catch (e) {}
  }
}

/**
 * Initialize all optimizations when DOM is ready
 */
document.addEventListener('DOMContentLoaded', () => {
  deferNonCriticalCSS();
  optimizeFontLoading();
  optimizeJSExecution();
  improveResponsiveness();
  monitorWebVitals();
});

// Also run when document is already interactive
if (document.readyState === 'loading') {
  // Already fired or will fire
} else {
  deferNonCriticalCSS();
  optimizeFontLoading();
  optimizeJSExecution();
  improveResponsiveness();
  monitorWebVitals();
}
