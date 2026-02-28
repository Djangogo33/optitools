# 🚀 GUIDE COMPLET: GitHub + Netlify GRATUIT

## ✅ POURQUOI PASSER À NETLIFY GRATUIT?

| Item | Netlify Payant | Netlify GRATUIT | GitHub Pages |
|------|---|---|---|
| **Coût** | 19$/mois | **GRATUIT** | **GRATUIT** |
| **Limite API/mois** | Illimité | Illimité | N/A |
| **Déploiements** | Illimité | Illimité | Illimité |
| **Crédits/déploiement** | 0 | 0 | 0 |
| **Bande passante** | Illimité | Illimité | 100GB/mois |

**Ta solution actuelle coûte 300 crédits = $30+ par mois**
**Netlify gratuit = $0**

---

## 📋 ÉTAPE 1: CRÉER UN COMPTE GITHUB (2 MIN)

### A. Créer le compte
1. Aller à https://github.com/join
2. Email: `marie@example.com` (ou ton email)
3. Username: `marie-tutofacile` (ou ce que tu veux)
4. Password: Quelque chose de sûr
5. Cliquer "Create account"
6. Vérifier l'email
7. Done ✓

### B. Installer Git (Si tu l'as pas)

**Windows:**
```
Télécharge: https://git-scm.com/download/win
Installe normalement (Next > Next > Finish)
```

### C. Vérifier Git
```powershell
git --version
# Devrait afficher: git version 2.x.x
```

---

## 📂 ÉTAPE 2: METTRE TON SITE SUR GITHUB

### A. Créer un "Repository"
1. Va à https://github.com/new
2. **Repository name:** `tutofacile` (IMPORTANT)
3. **Description:** "Site de tutoriels gratuits"
4. **Public** (important pour le gratuit)
5. **Initialize with:** Skip pour maintenant
6. Click "Create repository"

### B. Télécharger Git Bash
```
# Windows: https://git-scm.com/download/win
# Mac: brew install git
# Linux: sudo apt-get install git
```

### C. Configurer Git (UNE SEULE FOIS)
```powershell
git config --global user.name "Marie Dupont"
git config --global user.email "marie@example.com"
```

### D. Initialiser ton site

**Ouvre PowerShell et fais ça:**

```powershell
# Va dans ton dossier
cd "c:\Users\marie\Desktop\PAUL\Site\tutofacile"

# Initialize git
git init

# Ajoute tous les fichiers
git add .

# Crée ton premier commit
git commit -m "Premier upload de TutoFacile"

# Ajoute le repo GitHub comme "remote"
git remote add origin https://github.com/TON_USERNAME/tutofacile.git

# Upload tout (remplace TON_USERNAME)
git branch -M main
git push -u origin main
```

**Si ça demande ton password:**
```
Username: marie (ou ton username GitHub)
Password: TON_TOKEN (voir plus bas)
```

### E. Créer un Personal Access Token (pour ça marche)

1. Va à https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Name: `git-upload`
4. Expire: 90 days
5. Cocher:
   - ✓ `repo` (tous les sous-items)
   - ✓ `workflow`
6. Click "Generate token"
7. **COPY le token** (tu le verras qu'une fois!)
8. Utilise ce token comme password dans PowerShell

---

## 🌐 ÉTAPE 3: DEPLOYER SUR NETLIFY GRATUIT

### A. Créer compte Netlify
1. Va à https://netlify.com
2. Click "Sign up"
3. Choisis "Sign up with GitHub"
4. Authorize Netlify
5. Done ✓

### B. Connecter ton repository
1. Va à https://app.netlify.com
2. Click "Add new site"
3. "Import an existing project"
4. Choisis "GitHub"
5. Cherche `tutofacile`
6. Click dessus
7. Settings:
   - **Branch to deploy:** main
   - **Build command:** (leave empty)
   - **Publish directory:** . (ou laisse vide)
8. Click "Deploy site"
9. **ATTENDS 2-3 MIN** ✓

### C. Ton site est EN LIGNE! 🎉
- URL: `https://RANDOM-NAME.netlify.app`
- Tu peux la renommer dans Settings → Domain management

---

## 🔄 COMMENT METTRE À JOUR TON SITE

**Chaque fois que tu changes quelque chose:**

```powershell
cd "c:\Users\marie\Desktop\PAUL\Site\tutofacile"

# Ajoute les changements
git add .

# Commit avec un message
git commit -m "Fixé les tutoriels + ajouté dashboard"

# Upload
git push origin main
```

**Netlify va automatiquement redéployer** en ~30 secondes! 🚀

---

## 💰 COMPARAISON FINANCIÈRE

### Ta situation actuelle
```
300 crédits Netlify = ~$30/mois
+ 10 000 requêtes = -3 crédits = -$0.30
= CHER pour rien
```

### Avec Netlify GRATUIT
```
= $0/mois
= Illimité
= 100x mieux
```

---

## ⚠️ POINTS IMPORTANTS

✅ **Netlify Gratuit te donne:**
- Déploiement automatique depuis GitHub
- SSL GRATUIT (https)
- 100GB bande passante/mois (plus que suffisant)
- Build gratuit
- Support gratuit

❌ **Limitations (qui te touchent pas):**
- Pas de form server (tu as localStorage, c'est bon)
- Pas de DB (tu as localStorage, c'est bon)
- Max 300k requests/mois avant limite (tu es FAR d'ici)

---

## 🎯 WHAT YOU DO NOW

1. **Crée GitHub account** → 5 min
2. **Upload ton site** → 10 min
3. **Crée Netlify account** → 5 min
4. **Deploy** → 5 min
5. **DONE** - Plus jamais payer! 🎉

Total: **25 minutes max** et tu économises **$30/mois**

---

## 📌 RACCOURCIS UTILES

**Vérifier status:**
```powershell
git status
```

**Voir l'historique:**
```powershell
git log
```

**Annuler un changement:**
```powershell
git reset --hard
```

---

## 🔧 SI QUELQUE CHOSE CASSE

**Erreur "remote origin already exists":**
```powershell
git remote remove origin
git remote add origin https://github.com/USERNAME/tutofacile.git
```

**Erreur "permission denied":**
- Utilise un Personal Access Token (voir ÉTAPE 2.E)

**Netlify ne met pas à jour:**
- Va à https://app.netlify.com
- Click ton site
- Clique "Trigger deploy"

---

## 💬 RÉSUMÉ RAPIDE

| Avant | Après |
|------|-------|
| **Coût:** $30/mois | **$0/mois** |
| **Mise à jour:** Manuelle sur Netlify | Automatique (1 command) |
| **Domaine:** netlify.app | netlify.app (gratuit) |
| **SSL:** Inclus | Inclus |

**TU ÉCONOMISES 30 x 12 = $360 PAR AN!** 💸

---

## ✅ PRÊT?

1. Fais GITHUB
2. Fais NETLIFY
3. Dis-moi quand c'est fait
4. On va supprimer ton vieux hosting

**Questions? Demande-moi!**
