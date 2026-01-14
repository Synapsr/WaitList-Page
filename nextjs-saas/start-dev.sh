#!/bin/bash

echo "🔍 Diagnostic du projet Next.js..."
echo ""

# Vérifier Node.js
echo "📦 Version Node.js:"
node --version
echo ""

# Vérifier npm
echo "📦 Version npm:"
npm --version
echo ""

# Vérifier les dépendances
echo "📦 Vérification des dépendances..."
if [ ! -d "node_modules" ]; then
  echo "⚠️  node_modules manquant, installation..."
  npm install
else
  echo "✅ node_modules présent"
fi
echo ""

# Vérifier le port
echo "🔌 Vérification du port 3000..."
if lsof -ti:3000 > /dev/null 2>&1; then
  echo "⚠️  Port 3000 occupé, arrêt du processus..."
  lsof -ti:3000 | xargs kill -9 2>/dev/null
  sleep 2
fi
echo "✅ Port 3000 libre"
echo ""

# Vérifier les variables d'environnement
echo "🔐 Vérification des fichiers .env..."
if [ -f ".env.local" ]; then
  echo "✅ .env.local trouvé"
else
  echo "⚠️  .env.local manquant"
fi
if [ -f ".env" ]; then
  echo "✅ .env trouvé"
else
  echo "⚠️  .env manquant"
fi
echo ""

# Démarrer le serveur avec affichage des erreurs
echo "🚀 Démarrage du serveur de développement..."
echo "📍 Le serveur sera accessible sur http://localhost:3000"
echo ""

npm run dev
