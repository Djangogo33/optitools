document.addEventListener('DOMContentLoaded', () => {
	console.clear();
	console.log('%c=== TUTOFACILE INIT ===', 'color: blue; font-weight: bold; font-size: 14px;');

	const input = document.getElementById('search-input');
	const resultsBox = document.getElementById('search-results');
	const navToggle = document.getElementById('nav-toggle');
	const mainNav = document.getElementById('main-nav');
	let allTutos = [];
	let dataReady = false;

	// ========== LOAD DATA FROM data.json ==========
	async function loadData() {
		try {
			const response = await fetch('data.json');
			if(!response.ok) throw new Error('Failed to fetch data.json');
			const data = await response.json();
			allTutos = Array.isArray(data) ? data : [];
			dataReady = true;
			console.log('Tutoriels chargés:', allTutos.length);
			displayLatestTutos();
			displayPopularTutos();
		} catch(err) {
			console.error('Erreur de chargement:', err);
			allTutos = [];
		}
	}

	loadData();

	// ========== SEARCH ==========
	function escapeHtml(str){
		return String(str).replace(/[&<>"']/g, (s)=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[s]));
	}

	function performSearch() {
		const query = (input?.value || '').toLowerCase().trim();
		const results = allTutos.filter(tuto => 
			tuto.titre.toLowerCase().includes(query) ||
			tuto.description.toLowerCase().includes(query) ||
			tuto.categorie.toLowerCase().includes(query)
		);

		if(resultsBox) {
			resultsBox.style.display = results.length > 0 ? 'block' : 'none';
			resultsBox.innerHTML = results.slice(0, 8).map(tuto => `
				<div class="result-item" style="padding:12px;border-bottom:1px solid #eee;cursor:pointer;" onclick="window.location.href='/category.html?cat=${encodeURIComponent(tuto.categorie)}'">
					<strong>${escapeHtml(tuto.titre)}</strong>
					<div style="font-size:0.85rem;color:#666;">${escapeHtml(tuto.categorie)} • ${tuto.difficulty}</div>
				</div>
			`).join('');
		}
	}

	if(input) {
		let searchTimeout;
		input.addEventListener('input', () => {
			clearTimeout(searchTimeout);
			searchTimeout = setTimeout(performSearch, 150);
		});
		
		document.addEventListener('click', (e) => {
			if(!resultsBox?.contains(e.target) && e.target !== input) {
				resultsBox && (resultsBox.style.display = 'none');
			}
		});
	}

	// ========== DISPLAY LATEST TUTORIALS ==========
	function displayLatestTutos() {
		const container = document.getElementById('latest-tutos-grid');
		if(!container || allTutos.length === 0) return;

		const latest = [...allTutos].reverse().slice(0, 12);
		container.innerHTML = latest.map(tuto => {
			const url = tuto.url || (`tuto-viewer.html?id=${tuto.id}`);
			const img = tuto.image || 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22200%22%3E%3Crect width=%22400%22 height=%22200%22 fill=%22%23e0e0e0%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 font-family=%22Arial%22 font-size=%2224%22 fill=%22%23999%22%3ETutoriel%3C/text%3E%3C/svg%3E';
			return `
				<a href="${url}" class="card tuto-card" style="cursor:pointer;text-decoration:none;display:flex;flex-direction:column;height:100%;">
					<div class="tuto-card-image" style="width:100%;height:200px;overflow:hidden;position:relative;border-radius:8px 8px 0 0;">
						<img src="${img}" alt="${escapeHtml(tuto.titre)}" width="400" height="200" loading="lazy" style="width:100%;height:100%;object-fit:cover;" />
						<span class="difficulty-badge" style="position:absolute;top:8px;right:8px;background:#0069f6;color:white;padding:4px 8px;border-radius:4px;font-size:0.75rem;font-weight:600;">${tuto.difficulty || 'N/A'}</span>
					</div>
					<div class="card-body" style="padding:16px;flex:1;display:flex;flex-direction:column;">
						<h3 style="margin:0 0 8px;font-size:1rem;text-align:center;color:#333;">${escapeHtml(tuto.titre)}</h3>
						<p style="color:#666;margin:0 0 12px;font-size:0.9rem;flex:1;text-align:center;">${escapeHtml(tuto.description.substring(0, 60))}...</p>
						<div class="tuto-card-meta" style="display:flex;gap:12px;font-size:0.85rem;color:#999;justify-content:center;flex-direction:column;align-items:center;">
							<small>${escapeHtml(tuto.categorie)}</small>
							<small>⏱️ ${tuto.time || '?'} min</small>
						</div>
					</div>
				</a>
			`;
		}).join('');
	}

	// ========== DISPLAY POPULAR TUTORIALS ==========
	function displayPopularTutos() {
		const container = document.getElementById('popular-tutos-grid');
		if(!container || allTutos.length === 0) return;

		const popular = allTutos.filter(t => t.image && t.time && t.description).slice(0, 8);
		container.innerHTML = popular.map(tuto => {
			const url = tuto.url || (`tuto-viewer.html?id=${tuto.id}`);
			const img = tuto.image || 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22200%22%3E%3Crect width=%22400%22 height=%22200%22 fill=%22%23e0e0e0%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 font-family=%22Arial%22 font-size=%2224%22 fill=%22%23999%22%3ETutoriel%3C/text%3E%3C/svg%3E';
			return `
				<a href="${url}" class="card tuto-card" style="cursor:pointer;text-decoration:none;display:flex;flex-direction:column;height:100%;">
					<div class="tuto-card-image" style="width:100%;height:200px;overflow:hidden;position:relative;border-radius:8px 8px 0 0;">
						<img src="${img}" alt="${escapeHtml(tuto.titre)}" width="400" height="200" loading="lazy" style="width:100%;height:100%;object-fit:cover;" />
						<span class="difficulty-badge" style="position:absolute;top:8px;right:8px;background:#0069f6;color:white;padding:4px 8px;border-radius:4px;font-size:0.75rem;font-weight:600;">${tuto.difficulty || 'N/A'}</span>
					</div>
					<div class="card-body" style="padding:16px;flex:1;display:flex;flex-direction:column;">
						<h3 style="margin:0 0 8px;font-size:1rem;text-align:center;color:#333;">${escapeHtml(tuto.titre)}</h3>
						<p style="color:#666;margin:0 0 12px;font-size:0.9rem;flex:1;text-align:center;">${escapeHtml(tuto.description.substring(0, 60))}...</p>
						<div class="tuto-card-meta" style="display:flex;gap:12px;font-size:0.85rem;color:#999;justify-content:center;flex-direction:column;align-items:center;">
							<small>${escapeHtml(tuto.categorie)}</small>
							<small>⏱️ ${tuto.time || '?'} min</small>
						</div>
					</div>
				</a>
			`;
		}).join('');
	}

	// NAV toggle
	if(navToggle && mainNav){
		navToggle.addEventListener('click', () => {
			mainNav.classList.toggle('open');
		});
		document.addEventListener('click', (e) => {
			if(!mainNav.contains(e.target) && e.target !== navToggle){
				mainNav.classList.remove('open');
			}
		});
	}

	// Image error fallback
	document.addEventListener('error', (e) => {
		const tgt = e.target;
		if(tgt && tgt.tagName === 'IMG' && !tgt.dataset.fallbackApplied){
			tgt.dataset.fallbackApplied = '1';
			tgt.src = 'https://via.placeholder.com/400x200?text=Image';
		}
	}, true);

	function displaySearchResults(list){
		if(!resultsBox) return;
		resultsBox.innerHTML = '';
		if(!list || list.length === 0){ 
			resultsBox.style.display = 'none'; 
			return; 
		}
		for(const item of list){
			const a = document.createElement('a');
			a.className = 'result-item';
			a.href = item.url || (item.isCustom ? `tuto-viewer.html?id=${item.id}` : '#');
			a.innerHTML = `<h4>${escapeHtml(item.titre || '')}</h4><p>${escapeHtml(item.description || '')}</p><small style="color:#999;">${escapeHtml(item.categorie || 'Général')}</small>`;
			resultsBox.appendChild(a);
		}
		resultsBox.style.display = 'block';
	}

	function performSearch(term){
		if(!dataReady){
			console.warn('⚠ Data not ready');
			return;
		}
		if(!term || term.trim() === ''){
			if(resultsBox) resultsBox.style.display = 'none';
			return;
		}
		const q = term.trim().toLowerCase();
		console.log(`🔍 Recherche: "${q}" (${allTutos.length} tutos disponibles)`);
		
		const results = allTutos.filter(t => {
			const titre = (t.titre || '').toLowerCase();
			const desc = (t.description || '').toLowerCase();
			const cat = (t.categorie || '').toLowerCase();
			return titre.includes(q) || desc.includes(q) || cat.includes(q);
		});
		
		console.log(`  Résultats: ${results.length}`);
		displaySearchResults(results);
	}

	// Load data.json + modifications + custom
	async function loadData(){
		console.log('📥 Chargement tous les tutos...');
		try {
			const res = await fetch('./data.json?t=' + Date.now(), { cache: 'no-store' });
			if(!res.ok) throw new Error('HTTP ' + res.status);
			const json = await res.json();
			allTutos = Array.isArray(json) ? json : [];
			console.log(`✓ data.json: ${allTutos.length} tutos`);
		} catch(err) {
			console.log(`ℹ Utilisation localStorage uniquement`);
			allTutos = [];
		}

		// Appliquer modifications
		const modifications = JSON.parse(localStorage.getItem('tutofacile_mods') || '{}');
		allTutos = allTutos.map(t => {
			if(modifications[t.id]) return { ...t, ...modifications[t.id] };
			return t;
		});

		// Ajouter contributions
		const contribs = JSON.parse(localStorage.getItem('tutofacile_contributions') || '[]');
		contribs.forEach((t, i) => { 
			t.id = `contrib-${i}`; 
			t.isContribution = true;
		});
		allTutos = contribs.concat(allTutos);

		// Ajouter custom
		const custom = JSON.parse(localStorage.getItem('customTutos') || '[]');
		custom.forEach((t, i) => { 
			t.id = `custom-${i}`; 
			t.isCustom = true;
		});
		allTutos = custom.concat(allTutos);

		dataReady = true;
		console.log(`✓ ${allTutos.length} tutos total (dont ${custom.length} custom, ${contribs.length} contributions)`);
	}

	// Search event listeners
	if(input && resultsBox){
		let debounceTimer;
		input.addEventListener('input', (e) => {
			clearTimeout(debounceTimer);
			debounceTimer = setTimeout(() => performSearch(e.target.value), 150);
		});
		input.addEventListener('focus', () => {
			if(input.value.trim() && dataReady) performSearch(input.value);
		});
		input.addEventListener('keypress', (e) => {
			if(e.key === 'Enter' && input.value.trim()){
				e.preventDefault();
				window.location.href = `search-results.html?q=${encodeURIComponent(input.value.trim())}`;
			}
		});
	}
	if(resultsBox){
		document.addEventListener('click', (e) => {
			if(!resultsBox.contains(e.target) && e.target !== input){
				resultsBox.style.display = 'none';
			}
		});
	}

	// Charger les données au démarrage
	loadData();
});
