#!/bin/bash

echo "🚀 Démarrage du projet NestJS..."

# Vérifier que Node.js est installé
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé"
    exit 1
fi

# Vérifier que MySQL est démarré
if ! pgrep mysql > /dev/null; then
    echo "⚠️  MySQL ne semble pas démarré. Démarrage..."
    sudo service mysql start
fi

# Installer les dépendances si nécessaire
if [ ! -d "node_modules" ]; then
    echo "📦 Installation des dépendances..."
    npm install
fi

# Créer le dossier uploads
mkdir -p uploads/{general,documents,images,avatars}

# Démarrer l'application
echo "🎯 Démarrage de l'API..."
npm run start:dev