# 🎓 TutoFacile — Plateforme de tutoriels gratuits

Site : https://djangogo33.github.io/optitools  
Admin : https://djangogo33.github.io/optitools/admin.html

---

## 📁 Structure des fichiers

```
optitools/
├── index.html          ← Page d'accueil
├── login.html          ← Connexion utilisateur
├── register.html       ← Inscription
├── dashboard.html      ← Espace utilisateur (créer/éditer/supprimer ses tutos)
├── admin.html          ← Panel admin (auth SHA-256)
├── tuto.html           ← Visionneuse d'un tutoriel
├── category.html       ← Parcourir par catégorie
├── contribute.html     ← Formulaire de contribution public
├── css/
│   ├── variables.css   ← Design tokens (couleurs, fonts, espacements)
│   ├── base.css        ← Reset + composants réutilisables (boutons, cards, forms)
│   ├── nav.css         ← Barre de navigation
│   └── pages.css       ← Styles spécifiques par page
├── js/
│   ├── auth.js         ← Auth SHA-256 (utilisateurs + admin)
│   ├── data.js         ← Gestion tutoriels (localStorage + JSON)
│   └── nav.js          ← Navigation, dark mode, langue, toasts
├── data/
│   └── tutorials.json  ← Les tutoriels de base (20+ inclus)
├── assets/
│   └── favicon.svg
└── .github/workflows/
    └── deploy.yml      ← Déploiement automatique GitHub Pages
```

---

## 🔐 Authentification

### Utilisateurs publics (register/login)
- Mot de passe hashé en **SHA-256** via Web Crypto API (même système que about-me)
- Session signée stockée en **localStorage** (7 jours)
- Inscription/connexion sur `register.html` / `login.html`

### Admin
- Identifiant : `admin`
- Mot de passe par défaut : `TutoAdmin2026!`
- Hash SHA-256 configuré dans `js/auth.js` → `ADMIN_PASS_HASH`
- Session admin en **sessionStorage** (disparaît à la fermeture)

**Changer le mot de passe admin :**
1. Aller sur https://emn178.github.io/online-tools/sha256.html
2. Taper le nouveau mot de passe → copier le hash
3. Remplacer `ADMIN_PASS_HASH` dans `js/auth.js`

---

## ✏️ Ajouter des tutoriels

**Via l'interface web (recommandé) :**
- Connectez-vous sur votre compte → Dashboard → Créer un tuto
- Ou directement sur `contribute.html` (nécessite d'être connecté)

**Via le fichier JSON (tutoriels de base) :**
- Éditez `data/tutorials.json`
- Respectez la structure existante
- Push sur GitHub → déploiement automatique

---

## 🚀 Déploiement GitHub Pages

1. Push tous les fichiers dans le repo `optitools` (branche `main`)
2. GitHub Actions se déclenche automatiquement
3. Le site est disponible sur `https://djangogo33.github.io/optitools`

Le workflow `.github/workflows/deploy.yml` est déjà configuré.

---

## 🔧 Personnalisation

### Ajouter une catégorie
1. `js/nav.js` → objet `i18n` → ajouter `cat_nouvcat`
2. `category.html` → objet `CAT_META` → ajouter la métadonnée
3. `index.html` → section catégories → ajouter la card
4. `js/data.js` → `create()` → ajouter dans la liste des options

### Modifier les couleurs
Tout est dans `css/variables.css` — changez `--primary` et `--accent`.
