/**
 * auth.js — TutoFacile
 * Système d'authentification + tutoriels PRIVÉS par utilisateur
 * Les tutos créés par un utilisateur ne sont visibles que par lui seul
 * (sauf s'il choisit de les publier dans la liste communautaire)
 */

const AUTH = (() => {
  'use strict';

  const USERS_KEY = 'tutofacile_users';
  const SESSION_KEY = 'tutofacile_current_user';

  // ── Hachage simple (SHA-256 via SubtleCrypto) ────────────────────────
  async function hashPassword(password) {
    const enc = new TextEncoder();
    const data = enc.encode(password + 'tutofacile_salt_2025');
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  // ── Clé de stockage des tutos d'un utilisateur ───────────────────────
  function userTutosKey(username) {
    return `tutofacile_user_${username}_tutorials`;
  }

  // ── Lecture des utilisateurs ─────────────────────────────────────────
  function getUsers() {
    try {
      return JSON.parse(localStorage.getItem(USERS_KEY) || '{}');
    } catch {
      return {};
    }
  }

  function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  // ── Session ──────────────────────────────────────────────────────────
  function getCurrentUser() {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  function setCurrentUser(userObj) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(userObj));
  }

  // ── Inscription ──────────────────────────────────────────────────────
  async function register(username, email, password) {
    if (!username || !email || !password) throw new Error('Tous les champs sont requis.');
    if (username.length < 3) throw new Error('Nom d\'utilisateur trop court (min 3 caractères).');
    if (password.length < 6) throw new Error('Mot de passe trop court (min 6 caractères).');

    const users = getUsers();
    const key = username.toLowerCase();

    if (users[key]) throw new Error('Ce nom d\'utilisateur est déjà pris.');

    const hashedPwd = await hashPassword(password);
    users[key] = {
      username,
      email,
      password: hashedPwd,
      createdAt: new Date().toISOString(),
      role: 'user'
    };

    saveUsers(users);
    // Initialise le stockage de tutos vide pour cet utilisateur
    if (!localStorage.getItem(userTutosKey(key))) {
      localStorage.setItem(userTutosKey(key), JSON.stringify([]));
    }

    return { username, email, role: 'user' };
  }

  // ── Connexion ────────────────────────────────────────────────────────
  async function login(username, password) {
    if (!username || !password) throw new Error('Identifiants requis.');

    const users = getUsers();
    const key = username.toLowerCase();
    const user = users[key];

    if (!user) throw new Error('Utilisateur introuvable.');

    const hashedPwd = await hashPassword(password);
    if (hashedPwd !== user.password) throw new Error('Mot de passe incorrect.');

    const session = { username: user.username, email: user.email, role: user.role };
    setCurrentUser(session);
    return session;
  }

  // ── Déconnexion ──────────────────────────────────────────────────────
  function logout() {
    localStorage.removeItem(SESSION_KEY);
  }

  // ── Tutoriels PRIVÉS de l'utilisateur connecté ───────────────────────
  function getMyTutos() {
    const user = getCurrentUser();
    if (!user) return [];
    try {
      return JSON.parse(localStorage.getItem(userTutosKey(user.username.toLowerCase())) || '[]');
    } catch {
      return [];
    }
  }

  function saveMyTutos(tutos) {
    const user = getCurrentUser();
    if (!user) return;
    localStorage.setItem(userTutosKey(user.username.toLowerCase()), JSON.stringify(tutos));
  }

  function createTuto(data) {
    const user = getCurrentUser();
    if (!user) throw new Error('Vous devez être connecté.');

    const tuto = {
      id: 'tuto_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      ...data,
      author: user.username,
      authorKey: user.username.toLowerCase(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      // Par défaut : privé (visible uniquement par le créateur)
      visibility: data.visibility || 'private',
    };

    const tutos = getMyTutos();
    tutos.unshift(tuto);
    saveMyTutos(tutos);
    return tuto;
  }

  function updateTuto(id, data) {
    const user = getCurrentUser();
    if (!user) throw new Error('Vous devez être connecté.');

    const tutos = getMyTutos();
    const idx = tutos.findIndex(t => t.id === id);
    if (idx === -1) throw new Error('Tutoriel introuvable.');
    if (tutos[idx].authorKey !== user.username.toLowerCase()) throw new Error('Non autorisé.');

    tutos[idx] = { ...tutos[idx], ...data, updatedAt: new Date().toISOString() };
    saveMyTutos(tutos);
    return tutos[idx];
  }

  function deleteTuto(id) {
    const user = getCurrentUser();
    if (!user) throw new Error('Vous devez être connecté.');

    const tutos = getMyTutos();
    const idx = tutos.findIndex(t => t.id === id);
    if (idx === -1) throw new Error('Tutoriel introuvable.');
    if (tutos[idx].authorKey !== user.username.toLowerCase() && user.role !== 'admin') {
      throw new Error('Non autorisé.');
    }

    tutos.splice(idx, 1);
    saveMyTutos(tutos);
  }

  // ── Tutos publics (publiés par n'importe quel utilisateur) ───────────
  // Un tuto devient public uniquement si visibility === 'public'
  function getPublicUserTutos() {
    const users = getUsers();
    let all = [];
    for (const key of Object.keys(users)) {
      try {
        const tutos = JSON.parse(localStorage.getItem(userTutosKey(key)) || '[]');
        all = all.concat(tutos.filter(t => t.visibility === 'public'));
      } catch {}
    }
    return all.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  return {
    register,
    login,
    logout,
    getCurrentUser,
    getMyTutos,
    createTuto,
    updateTuto,
    deleteTuto,
    getPublicUserTutos,
    hashPassword,
  };
})();

// Expose globalement
window.AUTH = AUTH;
