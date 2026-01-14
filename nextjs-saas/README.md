# Waitlist SaaS - Générateur de pages d'attente

Un mini SaaS permettant de créer et personnaliser des pages de waitlist pour votre produit.

## 🚀 Fonctionnalités

- ✅ **Authentification complète** : Inscription et connexion sécurisées
- ✅ **Dashboard intuitif** : Gérez toutes vos waitlists depuis un seul endroit
- ✅ **Personnalisation complète** : Couleurs, logo, contenu personnalisables
- ✅ **Gestion des abonnés** : Visualisez et exportez vos inscriptions en CSV
- ✅ **Pages publiques** : URLs personnalisables pour chaque waitlist (`/w/[slug]`)
- ✅ **Champs personnalisables** : Collectez nom, email, entreprise selon vos besoins

## 🛠️ Technologies

- **Next.js 16** avec App Router
- **TypeScript** pour la sécurité de type
- **Prisma** avec SQLite (facilement migrable vers PostgreSQL)
- **NextAuth.js** pour l'authentification
- **Tailwind CSS** pour le styling
- **bcryptjs** pour le hachage des mots de passe

## 📦 Installation

1. Clonez le projet et installez les dépendances :

```bash
npm install
```

2. Configurez la base de données :

```bash
npx prisma migrate dev
npx prisma generate
```

3. Configurez les variables d'environnement dans `.env.local` :

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="votre-secret-key-changez-en-production"
NEXTAUTH_URL="http://localhost:3000"
```

4. Lancez le serveur de développement :

```bash
npm run dev
```

5. Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## 📁 Structure du projet

```
saas-app/
├── app/
│   ├── api/              # Routes API
│   │   ├── auth/         # Authentification
│   │   ├── waitlists/    # Gestion des waitlists
│   │   └── subscribe/    # Inscription publique
│   ├── dashboard/        # Dashboard utilisateur
│   ├── login/            # Page de connexion
│   ├── register/         # Page d'inscription
│   └── w/[slug]/         # Page publique de waitlist
├── lib/
│   ├── auth.ts           # Configuration NextAuth
│   └── prisma.ts         # Client Prisma
├── prisma/
│   └── schema.prisma     # Schéma de base de données
└── types/
    └── next-auth.d.ts    # Types TypeScript pour NextAuth
```

## 🎯 Utilisation

### Créer un compte

1. Allez sur `/register` pour créer un compte
2. Connectez-vous sur `/login`

### Créer une waitlist

1. Dans le dashboard, cliquez sur "Créer une waitlist"
2. Remplissez les informations :
   - **Slug** : L'URL de votre page (ex: `ma-super-app`)
   - **Titre** : Le nom de votre produit
   - **Headline** : Le titre principal affiché sur la page
   - **Couleurs** : Personnalisez l'apparence
   - **Logo** : Ajoutez votre logo (URL)
   - **Champs** : Choisissez quelles informations collecter

3. Votre page sera accessible sur `/w/[votre-slug]`

### Gérer les abonnés

1. Dans le dashboard, cliquez sur "Abonnés" pour une waitlist
2. Visualisez tous les inscrits avec leur position
3. Exportez la liste en CSV

## 🔐 Sécurité

- Les mots de passe sont hashés avec bcrypt
- Les routes API sont protégées par authentification
- Validation des données côté serveur
- Protection CSRF avec NextAuth

## 🚀 Déploiement

### Variables d'environnement à configurer

```env
DATABASE_URL="votre-url-de-base-de-donnees"
NEXTAUTH_SECRET="générez-une-clé-secrète-aléatoire"
NEXTAUTH_URL="https://votre-domaine.com"
```

### Migration vers PostgreSQL

Pour utiliser PostgreSQL en production, modifiez `prisma/schema.prisma` :

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

Puis exécutez :

```bash
npx prisma migrate deploy
```

## 📝 Prochaines améliorations possibles

- [ ] Intégration avec des services d'email (SendGrid, Mailchimp)
- [ ] Analytics et statistiques détaillées
- [ ] Templates de design prédéfinis
- [ ] Intégration avec Stripe pour les paiements
- [ ] API publique pour intégrations tierces
- [ ] Multi-langues
- [ ] Notifications par email aux abonnés

## 📄 Licence

MIT

---

**Développé avec ❤️ en Next.js 16**
