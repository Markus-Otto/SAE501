# SAE501
SAE501 - Groupe - Timothée Carpentier, Liam Cheurfa, Joris Brusa, Tom Manlay.

POUR MES CAMARADES : 
COMMANDE A UTILISER POUR L'IMPORT DE TAILWIND 3.4 SI TAILWINDCSS ne s'affiche pas une fois l'import du GIT REALISER.

- npm i -D tailwindcss@3.4 postcss autoprefixer
- npm install react-router-dom
- npx tailwindcss init -p

Dans TAILWIND.CONFIG.JS
remplacer par :
```
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

puis remplacer dans le fichier index.css le css pas 

```
@tailwind base;
@tailwind components;
@tailwind utilities;
```

et c'est bon.


Postman si vous avez des problèmes avec clés étrangères : 

(ex postman)
{
  "prixCent": 25000,
  "statut": "EN_ATTENTE",
  "dateInscription": "2025-01-05T15:30:00",
  "apprenant": {
    "id": 1
  },
  "session": {
    "id": 1
  }
}

(apprenant et session considéré comme des "join table (ou column jsp)"






# LISTE DES COMPTES DE TEST AJOUTÉS
### ADMINISTRATEURS
```
Login: admin
Mot de passe: admin123

TEST SAE :
Login: superadmin 
Mot de passe: SuperPass2024!
```
```
- INTERVENANTS
Email: intervenant1@test.com à intervenant5@test.com
Mot de passe: intervenant123

TEST SAE :
Email: marie.dupont@test.com 
Mot de passe: MarieSecure2024!
```
```
- APPRENANTS
Email: apprenant1@test.com à apprenant20@test.com
Mot de passe: apprenant123

TEST SAE :
Email: lucas.martin@test.com
Mot de passe: LucasPass2024!
```
