/**
 * TUTOFACILE 2.1 - PDF EXPORT MODULE
 * Allows users to export tutorials as professional PDF documents
 * 
 * Features:
 * - Generate PDF from tutorial content
 * - Custom branding and styling
 * - Print-optimized layout
 * - Metadata preservation
 * - Download management
 */

class PDFExporter {
	constructor() {
		this.config = {
			filename: 'tutofacile-export.pdf',
			pageSize: 'A4',
			orientation: 'portrait',
			margins: { top: 15, left: 15, right: 15, bottom: 15 },
			author: 'TutoFacile',
			title: 'Tutorial Export',
			fontSize: {
				title: 24,
				heading: 16,
				text: 11,
				small: 9
			}
		};
		
		this.loadJsPDF();
	}

	/**
	 * Load jsPDF library (requires internet)
	 */
	loadJsPDF() {
		if (window.jsPDF) return;

		const script = document.createElement('script');
		script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
		script.onload = () => {
			console.log('✅ jsPDF loaded successfully');
		};
		script.onerror = () => {
			console.warn('⚠️ jsPDF not available, PDF export disabled');
		};
		document.head.appendChild(script);
	}

	/**
	 * Export tutorial page as PDF
	 */
	exportTutorial(tutoData = null) {
		// Try to extract from current page if data not provided
		if (!tutoData) {
			tutoData = this.extractCurrentPageData();
		}

		if (!tutoData || !tutoData.title) {
			console.error('❌ No tutorial data to export');
			this.showNotification('error', 'Impossible d\'exporter: données manquantes');
			return;
		}

		// Use html2pdf if available, fallback to browser print
		if (window.html2pdf) {
			this.exportWithHTML2PDF(tutoData);
		} else {
			this.exportWithBrowserPrint(tutoData);
		}
	}

	/**
	 * Extract tutorial data from current page
	 */
	extractCurrentPageData() {
		const title = document.querySelector('h1')?.textContent || 'Tutorial';
		const content = document.querySelector('.tutorial-content')?.innerHTML || document.body.innerHTML;
		const category = document.querySelector('[data-category]')?.getAttribute('data-category') || 'General';
		const difficulty = document.querySelector('[data-difficulty]')?.getAttribute('data-difficulty') || 'Moyen';
		const time = document.querySelector('[data-time]')?.getAttribute('data-time') || '30';

		return {
			title: title.trim(),
			content: content,
			category: category,
			difficulty: difficulty,
			time: time,
			exportDate: new Date().toLocaleDateString('fr-FR'),
			url: window.location.href
		};
	}

	/**
	 * Export using html2pdf library
	 */
	exportWithHTML2PDF(tutoData) {
		const element = this.createPDFTemplate(tutoData);
		
		const options = {
			margin: this.config.margins,
			filename: `${this.sanitizeFilename(tutoData.title)}.pdf`,
			image: { type: 'jpeg', quality: 0.98 },
			html2canvas: { scale: 2 },
			jsPDF: { 
				orientation: this.config.orientation, 
				unit: 'mm', 
				format: this.config.pageSize,
				compress: true
			}
		};

		html2pdf().set(options).from(element).save();
		
		this.showNotification('success', `📄 "${tutoData.title}" exporté en PDF!`);
		this.recordExport(tutoData);
	}

	/**
	 * Fallback: Export using browser print
	 */
	exportWithBrowserPrint(tutoData) {
		const printWindow = window.open('', '', 'height=800,width=1000');
		const html = this.createPDFTemplate(tutoData).innerHTML;

		printWindow.document.write(`
			<!DOCTYPE html>
			<html>
			<head>
				<title>${tutoData.title}</title>
				<style>
					body { font-family: Arial, sans-serif; line-height: 1.6; }
					@media print {
						body { margin: 0; padding: 0; }
						.no-print { display: none; }
					}
					h1 { color: #e74c3c; font-size: 28px; margin-bottom: 10px; }
					h2 { color: #3498db; font-size: 18px; margin-top: 20px; }
					.metadata { background: #ecf0f1; padding: 12px; border-radius: 6px; margin-bottom: 20px; }
					.metadata-item { display: inline-block; margin-right: 20px; font-size: 13px; }
					.content { margin-top: 20px; }
				</style>
			</head>
			<body>
				<h1>${tutoData.title}</h1>
				<div class="metadata">
					<div class="metadata-item">📁 <strong>${tutoData.category}</strong></div>
					<div class="metadata-item">⏱️ ${tutoData.time} min</div>
					<div class="metadata-item">📊 ${tutoData.difficulty}</div>
					<div class="metadata-item">📅 ${tutoData.exportDate}</div>
				</div>
				<div class="content">${tutoData.content}</div>
				<hr style="margin-top: 30px;">
				<p style="font-size: 11px; color: #7f8c8d;">
					Exporté de TutoFacile | ${tutoData.url}
				</p>
			</body>
			</html>
		`);
		
		printWindow.document.close();
		printWindow.print();
		
		this.showNotification('info', 'Impression en cours...');
		this.recordExport(tutoData);
	}

	/**
	 * Create PDF template HTML
	 */
	createPDFTemplate(tutoData) {
		const container = document.createElement('div');
		container.style.cssText = 'padding: 20px; font-family: Arial, sans-serif;';
		container.innerHTML = `
			<div style="text-align: center; margin-bottom: 30px; border-bottom: 3px solid #3498db; padding-bottom: 20px;">
				<h1 style="margin: 0; color: #2c3e50; font-size: 28px;">${tutoData.title}</h1>
				<p style="color: #7f8c8d; font-size: 12px; margin-top: 10px;">
					TutoFacile - Plateforme de tutoriels gratuits
				</p>
			</div>

			<div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-bottom: 30px;">
				<div style="background: #ecf0f1; padding: 12px; border-radius: 6px; text-align: center;">
					<div style="color: #3498db; font-weight: bold; font-size: 12px;">CATÉGORIE</div>
					<div style="font-size: 14px; margin-top: 5px;">${tutoData.category}</div>
				</div>
				<div style="background: #ecf0f1; padding: 12px; border-radius: 6px; text-align: center;">
					<div style="color: #e74c3c; font-weight: bold; font-size: 12px;">TEMPS</div>
					<div style="font-size: 14px; margin-top: 5px;">${tutoData.time} min</div>
				</div>
				<div style="background: #ecf0f1; padding: 12px; border-radius: 6px; text-align: center;">
					<div style="color: #f39c12; font-weight: bold; font-size: 12px;">DIFFICULTÉ</div>
					<div style="font-size: 14px; margin-top: 5px;">${tutoData.difficulty}</div>
				</div>
				<div style="background: #ecf0f1; padding: 12px; border-radius: 6px; text-align: center;">
					<div style="color: #27ae60; font-weight: bold; font-size: 12px;">DATE</div>
					<div style="font-size: 14px; margin-top: 5px;">${tutoData.exportDate}</div>
				</div>
			</div>

			<div style="page-break-inside: avoid;">
				<h2 style="color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px;">Contenu</h2>
				<div style="margin-top: 15px; line-height: 1.8; color: #34495e;">
					${tutoData.content}
				</div>
			</div>

			<div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #bdc3c7; text-align: center; font-size: 10px; color: #7f8c8d;">
				<p style="margin: 5px 0;">
					📄 Exporté de TutoFacile | ${tutoData.url}
				</p>
				<p style="margin: 5px 0;">
					© TutoFacile 2024 | Plateforme gratuite de tutoriels collaboratifs
				</p>
			</div>
		`;

		return container;
	}

	/**
	 * Sanitize filename for export
	 */
	sanitizeFilename(filename) {
		return filename
			.toLowerCase()
			.replace(/[^a-z0-9]/g, '-')
			.replace(/-+/g, '-')
			.replace(/^-|-$/g, '')
			.substring(0, 50) || 'tutofacile-export';
	}

	/**
	 * Add export button to tutorial page
	 */
	addExportButton() {
		const button = document.createElement('button');
		button.id = 'pdf-export-btn';
		button.className = 'pdf-export-btn';
		button.innerHTML = '📥 Exporter en PDF';
		button.style.cssText = `
			background: linear-gradient(135deg, #e74c3c, #c0392b);
			color: white;
			border: none;
			padding: 12px 24px;
			border-radius: 8px;
			font-weight: 600;
			cursor: pointer;
			margin: 12px;
			transition: all 0.3s;
			box-shadow: 0 4px 12px rgba(231, 76, 60, 0.3);
		`;

		button.addEventListener('mouseenter', () => {
			button.style.transform = 'translateY(-2px)';
			button.style.boxShadow = '0 6px 16px rgba(231, 76, 60, 0.4)';
		});

		button.addEventListener('mouseleave', () => {
			button.style.transform = 'translateY(0)';
			button.style.boxShadow = '0 4px 12px rgba(231, 76, 60, 0.3)';
		});

		button.addEventListener('click', () => this.exportTutorial());

		// Find appropriate location (tutorial header or toolbar)
		const container = document.querySelector('.tutorial-actions') || 
		                 document.querySelector('h1')?.parentElement || 
		                 document.body;
		container.appendChild(button);
	}

	/**
	 * Show notification
	 */
	showNotification(type, message) {
		if (window.notificationManager) {
			window.notificationManager[type](message);
		} else {
			alert(message);
		}
	}

	/**
	 * Record export for analytics
	 */
	recordExport(tutoData) {
		try {
			if (window.analyticsEngine) {
				window.analyticsEngine.trackEvent('pdf_export', {
					title: tutoData.title,
					category: tutoData.category,
					timestamp: new Date().toISOString()
				});
			}
			
			if (window.gamificationEngine) {
				window.gamificationEngine.recordAction('pdf_export', { title: tutoData.title });
			}
		} catch(e) {
			console.warn('Error recording export:', e);
		}
	}

	/**
	 * Batch export multiple tutorials
	 */
	async exportMultiple(tutorialIds) {
		for (const id of tutorialIds) {
			const tutoData = this.getTutorialDataById(id);
			if (tutoData) {
				this.exportTutorial(tutoData);
				// Stagger exports to avoid overwhelming browser
				await new Promise(resolve => setTimeout(resolve, 1000));
			}
		}
		this.showNotification('success', `✅ ${tutorialIds.length} tutoriels exportés!`);
	}

	/**
	 * Get tutorial data by ID
	 */
	getTutorialDataById(id) {
		const tutos = JSON.parse(localStorage.getItem('tutofacile_all_tutos') || '[]');
		return tutos.find(t => t.id === id);
	}
}

// Auto-initialize on page load
document.addEventListener('DOMContentLoaded', () => {
	window.pdfExporter = new PDFExporter();
	
	// Add export button if on tutorial page
	if (document.querySelector('.tutorial-content') || window.location.pathname.includes('/pages/')) {
		setTimeout(() => {
			window.pdfExporter.addExportButton();
		}, 1000);
	}
});

// Export for module system
if (typeof module !== 'undefined' && module.exports) {
	module.exports = PDFExporter;
}
