<!--
  AITools Pricing Configuration
  Page: https://tutofacile.com/aitools-pricing
  Intégration: TutoFacile + AITools (Croissance mutuelle)
-->

<meta name="aitools:integration" content="tutofacile-pricing-v3.3.0">
<meta name="aitools:purpose" content="subscription, donations, upsell">
<meta name="aitools:features" content="stripe-integration, plan-selection, donation-buttons">

<!-- Configuration -->
<script>
  // Stripe Configuration
  const STRIPE_CONFIG = {
    publicKey: 'pk_live_YOUR_KEY_HERE', // À obtenir depuis Stripe
    priceIds: {
      pro_monthly: 'price_1ABC123XYZ', // À créer dans Stripe
      pro_yearly: 'price_1ABC124XYZ'   // À créer dans Stripe
    }
  };

  // Plan Configuration
  const PLANS = {
    free: {
      name: 'Gratuit',
      price: 0,
      period: 'Pour toujours',
      currency: 'EUR',
      features: {
        dailyAnalyses: '5',
        aiDetection: 'Basique',
        adBlocking: '✓',
        anonymization: '✗',
        weaver: '✗',
        tabscanner: '✗',
        support: 'Communauté'
      }
    },
    pro: {
      name: 'Pro',
      price: 4.99,
      period: 'Par mois',
      currency: 'EUR',
      stripePriceId: 'price_1ABC123XYZ',
      features: {
        dailyAnalyses: '∞',
        aiDetection: 'Avancée',
        adBlocking: '✓ Premium',
        anonymization: '✓',
        weaver: '✓',
        tabscanner: '✓',
        support: 'Prioritaire'
      }
    },
    enterprise: {
      name: 'Entreprise',
      price: null,
      period: 'Devis personnalisé',
      currency: 'EUR',
      features: {
        dailyAnalyses: '∞',
        aiDetection: 'Personnalisée',
        adBlocking: '✓ Premium',
        anonymization: '✓',
        weaver: '✓',
        tabscanner: '✓',
        api: '✓',
        support: '24/7 Dédié',
        sla: '✓'
      }
    }
  };

  // Donation Options
  const DONATIONS = [
    { amount: 5, label: 'Donner 5€' },
    { amount: 10, label: 'Donner 10€' },
    { amount: 25, label: 'Donner 25€' },
    { amount: 50, label: 'Donner 50€' },
    { amount: null, label: 'Montant personnalisé' }
  ];

  // Analytics Tracking
  const ANALYTICS = {
    trackPlanView: (planName) => {
      console.log(`[AITools Analytics] Plan viewed: ${planName}`);
      if (window.gtag) {
        gtag('event', 'view_plan', { plan: planName });
      }
    },
    trackUpgrade: (planName) => {
      console.log(`[AITools Analytics] Upgrade clicked: ${planName}`);
      if (window.gtag) {
        gtag('event', 'upgrade_plan', { plan: planName });
      }
    },
    trackDonation: (amount) => {
      console.log(`[AITools Analytics] Donation: ${amount}€`);
      if (window.gtag) {
        gtag('event', 'donation', { amount: amount });
      }
    }
  };

  // Redirect Configuration
  const REDIRECTS = {
    backToTutoFacile: () => window.location.href = 'https://tutofacile.com',
    aiToolsExtension: () => window.location.href = 'chrome://extensions',
    contactSupport: () => window.location.href = 'mailto:djangogo33.tdac@gmail.com',
    gumroad: () => window.location.href = 'https://gumroad.com/aitools',
    patreon: () => window.location.href = 'https://patreon.com/aitools'
  };

  // Feature Comparison
  const FEATURE_COMPARISON = {
    'Analyses par jour': { free: '5', pro: '∞', enterprise: '∞' },
    'Détection IA': { free: 'Basique', pro: 'Avancée', enterprise: 'Personnalisée' },
    'Blocage d\'annonces': { free: 'Simple', pro: 'Premium', enterprise: 'Premium' },
    'Anonymisation': { free: '✗', pro: '✓', enterprise: '✓' },
    'Weaver (Prompts)': { free: '✗', pro: '✓', enterprise: '✓' },
    'TabScanner': { free: '✗', pro: '✓', enterprise: '✓' },
    'API REST': { free: '✗', pro: '✗', enterprise: '✓' },
    'Support': { free: 'Communauté', pro: 'Prioritaire', enterprise: '24/7 Dédié' }
  };

  // Initialize on page load
  document.addEventListener('DOMContentLoaded', () => {
    console.log('[AITools Pricing] Page initialized');
    console.log('[AITools Pricing] Stripe Key:', STRIPE_CONFIG.publicKey);
    console.log('[AITools Pricing] Plans:', PLANS);
    
    // Load Stripe.js
    loadStripeJs();
  });

  // Load Stripe
  async function loadStripeJs() {
    const script = document.createElement('script');
    script.src = 'https://js.stripe.com/v3/';
    script.onload = () => {
      window.stripe = Stripe(STRIPE_CONFIG.publicKey);
      console.log('[AITools Pricing] Stripe.js loaded');
    };
    document.head.appendChild(script);
  }

  // Upgrade Handler
  async function upgradePro() {
    ANALYTICS.trackUpgrade('pro');
    
    if (!window.stripe) {
      alert('Chargement en cours... Réessayez dans quelques secondes.');
      return;
    }

    const response = await fetch('/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        priceId: PLANS.pro.stripePriceId,
        successUrl: `${window.location.origin}/aitools-pricing?success=true`,
        cancelUrl: `${window.location.origin}/aitools-pricing`
      })
    });

    const { sessionId } = await response.json();
    await window.stripe.redirectToCheckout({ sessionId });
  }

  // Donation Handler
  async function processDonation(amount) {
    ANALYTICS.trackDonation(amount);
    alert(`Donation de ${amount}€ - À intégrer avec Stripe`);
    // Intégration Stripe à faire
  }
</script>

<!-- Meta for sharing -->
<meta property="og:title" content="AITools - Plans & Dons | TutoFacile">
<meta property="og:description" content="Détectez et nettoyez le contenu généré par IA. Plans gratuit et Pro à partir de 4.99€/mois.">
<meta property="og:image" content="https://tutofacile.com/aitools-og-image.png">
<meta property="og:url" content="https://tutofacile.com/aitools-pricing">

<!-- SEO -->
<meta name="description" content="AITools - Détection IA, blocage pubs, anonymisation. Plan gratuit (5/jour) ou Pro illimité (4.99€).">
<meta name="keywords" content="AITools, détection IA, antipub, anonymisation, blocage publicités, extension Chrome">
<meta name="author" content="TutoFacile">

<!-- JSON-LD Schema for rich snippets -->
<script type="application/ld+json">
{
  "@context": "https://schema.org/",
  "@type": "SoftwareApplication",
  "name": "AITools",
  "applicationCategory": "ProductionApplication",
  "offers": {
    "@type": "AggregateOffer",
    "priceCurrency": "EUR",
    "offers": [
      {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "EUR",
        "name": "Gratuit",
        "description": "5 analyses par jour"
      },
      {
        "@type": "Offer",
        "price": "4.99",
        "priceCurrency": "EUR",
        "name": "Pro",
        "description": "Analyses illimitées"
      }
    ]
  }
}
</script>

<!-- Feedback -->
<script>
  // Collect pricing feedback
  window.logPricingFeedback = (feedback) => {
    console.log('[AITools Pricing] Feedback:', feedback);
    fetch('/api/aitools/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(feedback)
    }).catch(err => console.error('Feedback error:', err));
  };
</script>
