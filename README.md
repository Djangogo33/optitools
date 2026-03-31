# 🎓 TutoFacile — Plateforme de Tutoriels Gratuits

> Plateforme collaborative open source pour partager et découvrir des tutoriels pratiques en bricolage, cuisine, programmation et jardinage.

**🌐 Site live :** https://tutofacile.netlify.app  
**📦 Repo :** https://github.com/Djangogo33/optitools  
**👤 Créateur :** [Djangogo33](https://djangogo33.github.io/about-me)

---

## 🚀 Fonctionnalités

### Pour les Utilisateurs
- 📝 **Créer des tutoriels** avec éditeur enrichi (HTML, étapes guidées, aperçu)
- 🔒 **Tutoriels privés** — vos tutos ne sont visibles que par vous par défaut
- 🌍 **Publication publique** — choisissez quand partager avec la communauté
- ✏️ **Modifier / Supprimer** — contrôle total sur vos contenus
- 📊 **Dashboard** — vue d'ensemble de tous vos tutoriels
- 🌙 **Dark Mode** — persistant, appliqué avant le rendu (no flash)
- 🌐 **Multilingue** — Français et Anglais avec détection automatique

### Pour la Communauté
- 🔍 **Découvrir** 50+ tutoriels organisés par catégorie
- 📁 **6 Catégories** — Bricolage, Cuisine, Code, Jardinage, Bien-être, Électronique
- ⭐ **Populaires & Tendances** — les meilleurs tutoriels mis en avant
- 💬 **Discord & WhatsApp** — communauté active

### Système Technique
- 🔐 **Auth sécurisée** — mots de passe hashés SHA-256, sessions persistantes
- 🎯 **Admin Panel** — gestion CRUD complète
- 📱 **100% Responsive** — mobile-first
- ⚡ **Performance** — CSS critique inline, scripts différés, lazy loading

---

## 📁 Structure des Fichiers

```
optitools/
├── index.html                  # Page d'accueil
├── contribute.html             # Formulaire de création (enrichi)
├── my-dashboard.html           # Dashboard utilisateur
├── admin.html                  # Panel admin
├── category.html               # Parcourir par catégorie
├── login.html                  # Connexion
├── register.html               # Inscription
├── tuto-viewer.html            # Visionneuse tutoriels
├── about.html                  # À propos
├── aitools-help.html           # Aide extension AITools
├── aitools-pricing.html        # Tarifs AITools
├── legal.html                  # Mentions légales
├── privacy.html                # Politique de confidentialité
├── cookies.html                # Politique de cookies
├── happy-birthday.html         # Carte anniversaire
│
├── auth.js                     # Auth + gestion tutos privés/publics
├── dark-mode-toggle.js         # Dark mode (no-flash, persistant)
├── language-selector.js        # Sélecteur de langue (i18n)
├── promo-banner.js             # Bandeau promo communauté
├── script.js                   # Script principal
├── config.js / config-system.js # Configuration
├── data.json                   # 50+ tutoriels de base
│
├── style.css                   # Styles principaux
├── style-modern.css            # Styles modernes
├── critical.css                # CSS critique (performance)
│
├── sitemap.xml                 # Sitemap SEO
├── robots.txt                  # Directives robots
├── netlify.toml                # Config Netlify
├── _headers                    # En-têtes HTTP
├── _redirects                  # Redirections
└── README.md                   # Ce fichier
```

---

## 🔐 Système d'Authentification

### Inscription
```
URL: /register.html
Stockage: localStorage['tutofacile_users']
Sécurité: SHA-256 avec salt
```

### Connexion
```
URL: /login.html
Session: localStorage['tutofacile_current_user']
Persist: Oui (survit fermeture navigateur)
```

### Tutoriels Privés vs Publics
```
Stockage privé: localStorage['tutofacile_user_<username>_tutorials']
Visibilité: 'private' (défaut) ou 'public'
Isolation: chaque utilisateur a son propre espace — les tutos privés
           ne sont JAMAIS accessibles par d'autres utilisateurs
```

---

## 🌐 Déploiement

### Netlify (Recommandé — Gratuit)
```bash
1. Fork ce repo sur GitHub
2. Va sur netlify.com → "New site from Git"
3. Sélectionne ton repo
4. Deploy ! (aucune configuration requise)
```

### GitHub Pages
```bash
git push origin main
# Le site se déploie automatiquement
```

---

## 💬 Communauté

| Plateforme | Lien |
|------------|------|
| 💬 Discord | https://discord.gg/J2ssa2Wkjr |
| 📱 WhatsApp | https://whatsapp.com/channel/0029VbCJCg06GcG7aLZPGu1f |
| 🧩 Extension AITools | https://github.com/Djangogo33/AITools |
| 👤 About Me | https://djangogo33.github.io/about-me |

---

## 🐛 Bugs Corrigés (v2.2)

- ✅ **Dark mode** — appliqué avant le rendu pour éviter le flash blanc
- ✅ **Traductions** — correction du binding des boutons de langue (double-bind)
- ✅ **Tutoriels privés** — isolation complète par utilisateur
- ✅ **Dashboard** — gestion visibilité inline (toggle privé/public)
- ✅ **Contribute** — éditeur enrichi avec prévisualisation et étapes guidées

---

## 📊 Stack Technique

- **Frontend :** HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Storage :** localStorage (client-side, pas de serveur requis)
- **Auth :** SHA-256 via SubtleCrypto API
- **Deploy :** Netlify (CI/CD depuis GitHub)
- **Ads :** Google AdSense (ca-pub-8577889750610248)
- **Analytics :** Google Analytics 4

---

*Créé avec ❤️ par [Djangogo33](https://djangogo33.github.io/about-me)*
