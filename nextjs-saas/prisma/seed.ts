import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Démarrage du seed...')

  // Créer un utilisateur par défaut
  const defaultPassword = await bcrypt.hash('demo123', 10)
  
  const user = await prisma.user.upsert({
    where: { email: 'demo@waitlist.com' },
    update: {},
    create: {
      email: 'demo@waitlist.com',
      password: defaultPassword,
      name: 'Demo User',
    },
  })

  console.log('✅ Utilisateur créé:', user.email)

  // Supprimer toutes les données existantes
  await prisma.subscriber.deleteMany({})
  await prisma.waitlist.deleteMany({})

  // Créer 10 waitlists de démo avec des SaaS réalistes et variés
  // Structure identique à celle proposée lors de la création d'une waitlist :
  // - headline = title (comme dans le formulaire de création)
  // - subheadline = null (comme dans le formulaire de création)
  const waitlists = [
    {
      slug: 'salesforce-next',
      title: 'SalesForce Next',
      description: 'CRM nouvelle génération avec IA intégrée. Gérez vos ventes, automatisez vos processus et boostez votre chiffre d\'affaires.',
      headline: 'SalesForce Next', // Identique au title
      subheadline: null, // Toujours null comme dans le formulaire
      theme: 'dark-modern' as const,
      primaryColor: '#3B82F6',
      backgroundColor: '#111827',
      logoUrl: '1', // Variant de logo SVG
      collectName: true,
      collectCompany: true,
      countdownEnabled: true,
      countdownDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 jours
    },
    {
      slug: 'designflow',
      title: 'DesignFlow',
      description: 'Plateforme collaborative de design UI/UX. Créez, prototypagez et collaborez avec votre équipe en temps réel.',
      headline: 'DesignFlow', // Identique au title
      subheadline: null, // Toujours null comme dans le formulaire
      theme: 'light-minimal' as const,
      primaryColor: '#000000',
      backgroundColor: '#FFFFFF',
      logoUrl: null, // Sans logo
      collectName: true,
      collectCompany: true,
      countdownEnabled: false,
      countdownDate: null,
    },
    {
      slug: 'taskmaster-pro',
      title: 'TaskMaster Pro',
      description: 'Gestion de projet intelligente avec automatisation des workflows. Organisez vos équipes et livrez vos projets à temps.',
      headline: 'TaskMaster Pro', // Identique au title
      subheadline: null, // Toujours null comme dans le formulaire
      theme: 'light-gray' as const,
      primaryColor: '#6366F1',
      backgroundColor: '#F5F5F5',
      logoUrl: '2', // Variant de logo SVG
      collectName: true,
      collectCompany: true,
      countdownEnabled: true,
      countdownDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 jours
    },
    {
      slug: 'financely',
      title: 'Financely',
      description: 'Comptabilité automatisée pour les PME. Générez vos factures, suivez vos dépenses et préparez vos déclarations en quelques clics.',
      headline: 'Financely', // Identique au title
      subheadline: null, // Toujours null comme dans le formulaire
      theme: 'light-minimal' as const,
      primaryColor: '#000000',
      backgroundColor: '#FFFFFF',
      logoUrl: '3', // Variant de logo SVG
      collectName: true,
      collectCompany: true,
      countdownEnabled: false,
      countdownDate: null,
    },
    {
      slug: 'marketo-ai',
      title: 'Marketo AI',
      description: 'Marketing automation alimenté par l\'IA. Personnalisez vos campagnes, optimisez vos conversions et multipliez vos revenus.',
      headline: 'Marketo AI', // Identique au title
      subheadline: null, // Toujours null comme dans le formulaire
      theme: 'vibrant-purple' as const,
      primaryColor: '#A855F7',
      backgroundColor: '#0F0F1E',
      logoUrl: null, // Sans logo
      collectName: true,
      collectCompany: true,
      countdownEnabled: true,
      countdownDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 21 jours
    },
    {
      slug: 'meetflow',
      title: 'MeetFlow',
      description: 'Visioconférence haute qualité avec transcription automatique et notes intelligentes. Réunissez-vous comme jamais.',
      headline: 'MeetFlow', // Identique au title
      subheadline: null, // Toujours null comme dans le formulaire
      theme: 'dark-modern' as const,
      primaryColor: '#3B82F6',
      backgroundColor: '#111827',
      logoUrl: '4', // Variant de logo SVG
      collectName: true,
      collectCompany: false,
      countdownEnabled: false,
      countdownDate: null,
    },
    {
      slug: 'learnwise',
      title: 'LearnWise',
      description: 'Plateforme d\'e-learning avec parcours personnalisés. Créez des formations engageantes et suivez la progression de vos apprenants.',
      headline: 'LearnWise', // Identique au title
      subheadline: null, // Toujours null comme dans le formulaire
      theme: 'light-gray' as const,
      primaryColor: '#6366F1',
      backgroundColor: '#F5F5F5',
      logoUrl: '5', // Variant de logo SVG
      collectName: true,
      collectCompany: true,
      countdownEnabled: true,
      countdownDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 jours
    },
    {
      slug: 'inventory-smart',
      title: 'Inventory Smart',
      description: 'Gestion d\'inventaire intelligente avec prévisions de stock. Optimisez vos stocks, réduisez vos coûts et évitez les ruptures.',
      headline: 'Inventory Smart', // Identique au title
      subheadline: null, // Toujours null comme dans le formulaire
      theme: 'light-minimal' as const,
      primaryColor: '#000000',
      backgroundColor: '#FFFFFF',
      logoUrl: null, // Sans logo
      collectName: true,
      collectCompany: true,
      countdownEnabled: false,
      countdownDate: null,
    },
    {
      slug: 'analytics-pro',
      title: 'Analytics Pro',
      description: 'Analytics avancées avec tableaux de bord personnalisables. Visualisez vos données, découvrez des insights et prenez de meilleures décisions.',
      headline: 'Analytics Pro', // Identique au title
      subheadline: null, // Toujours null comme dans le formulaire
      theme: 'vibrant-purple' as const,
      primaryColor: '#A855F7',
      backgroundColor: '#0F0F1E',
      logoUrl: '6', // Variant de logo SVG
      collectName: true,
      collectCompany: true,
      countdownEnabled: true,
      countdownDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 jours
    },
    {
      slug: 'collab-space',
      title: 'CollabSpace',
      description: 'Espace de collaboration tout-en-un. Chat, documents, calendrier et tâches dans une seule plateforme intuitive.',
      headline: 'CollabSpace', // Identique au title
      subheadline: null, // Toujours null comme dans le formulaire
      theme: 'dark-modern' as const,
      primaryColor: '#3B82F6',
      backgroundColor: '#111827',
      logoUrl: '7', // Variant de logo SVG
      collectName: true,
      collectCompany: false,
      countdownEnabled: false,
      countdownDate: null,
    },
  ]

  const createdWaitlists = []
  for (const waitlistData of waitlists) {
    const waitlist = await prisma.waitlist.create({
      data: {
        ...waitlistData,
        userId: user.id,
      },
    })
    createdWaitlists.push(waitlist)
    console.log(`✅ Waitlist créée: ${waitlist.title} (${waitlist.slug})`)
  }

  // Générer des abonnés réalistes pour chaque waitlist
  const generateSubscribers = (count: number, withCompany: boolean, waitlistIndex: number) => {
    const firstNames = ['Alexandre', 'Sophie', 'Thomas', 'Marie', 'Julien', 'Camille', 'Nicolas', 'Julie', 'Antoine', 'Laura', 'Maxime', 'Claire', 'Pierre', 'Émilie', 'David', 'Sarah', 'Romain', 'Pauline', 'Vincent', 'Marion', 'Emma', 'Lucas', 'Léa', 'Hugo', 'Chloé', 'Louis', 'Manon', 'Nathan', 'Inès', 'Noah']
    const lastNames = ['Martin', 'Bernard', 'Dubois', 'Thomas', 'Robert', 'Richard', 'Petit', 'Durand', 'Leroy', 'Moreau', 'Simon', 'Laurent', 'Lefebvre', 'Michel', 'Garcia', 'David', 'Bertrand', 'Roux', 'Vincent', 'Fournier', 'Girard', 'Bonnet', 'Dupont', 'Lambert', 'Fontaine', 'Rousseau', 'Blanc', 'Garnier', 'Lemoine', 'Fabre']
    const companies = ['TechCorp', 'InnovateLab', 'DigitalAgency', 'CloudTech', 'DataSolutions', 'FutureWorks', 'SmartBiz', 'TechVenture', 'InnovationHub', 'DigitalFirst', 'CloudFirst', 'TechStart', 'FutureTech', 'SmartSolutions', 'StartupXYZ', 'NextGen', 'InnovateNow', 'TechFlow', 'DataDriven', 'CloudScale']
    
    const usedEmails = new Set<string>()
    const subscribers = []
    
    for (let i = 0; i < count; i++) {
      let email: string
      let attempts = 0
      do {
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
        // Ajouter un identifiant unique pour éviter les collisions
        const uniqueId = waitlistIndex * 1000 + i
        email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}.${uniqueId}@example.com`
        attempts++
      } while (usedEmails.has(email) && attempts < 100)
      
      usedEmails.add(email)
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
      
      subscribers.push({
        email,
        name: `${firstName} ${lastName}`,
        company: withCompany ? companies[Math.floor(Math.random() * companies.length)] : undefined,
        position: i + 1,
      })
    }
    return subscribers
  }

  // Créer des abonnés pour chaque waitlist avec des nombres variés
  const subscriberCounts = [23, 15, 31, 18, 27, 12, 35, 19, 29, 16]
  
  for (let i = 0; i < createdWaitlists.length; i++) {
    const waitlist = createdWaitlists[i]
    const subscribers = generateSubscribers(subscriberCounts[i], waitlist.collectCompany, i)
    
    for (const subData of subscribers) {
      await prisma.subscriber.create({
        data: {
          waitlistId: waitlist.id,
          email: subData.email,
          name: subData.name || null,
          company: subData.company || null,
          position: subData.position,
        },
      })
    }
    console.log(`✅ ${subscribers.length} abonnés créés pour ${waitlist.title}`)
  }

  console.log('\n🎉 Seed terminé avec succès!')
  console.log('\n📧 Compte de démo:')
  console.log('   Email: demo@waitlist.com')
  console.log('   Mot de passe: demo123')
  console.log('\n🔗 Waitlists créées:')
  createdWaitlists.forEach(w => {
    console.log(`   - ${w.title}: http://localhost:3000/w/${w.slug}`)
  })
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
