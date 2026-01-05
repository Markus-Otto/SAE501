# SAE501
SAE501 - Groupe - Timothée Carpentier, Liam Cheurfa, Joris Brusa, Tom Manlay.

Lien du site: https://trainu.alwaysdata.net/

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
admin@test.com

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
 cd SAE501  
 docker push 0roc0/java-trainu:latest
docker build -t 0roc0/java-trainu:latest .

# CB TEST STRIPE :

```
- réussi - 4242 4242 4242 4242
- Paiment 3D secure - 4000 0000 0000 3220
- Refus - fonds insufisant - 4000 0000 0000 9995
- Refus - CB volée - 4000 0000 0000 9979
- Refus - CVC incorrect - 4000 0000 0000 0101 
```
# LIEN UTILES :

Trello - https://trello.com/invite/b/6915a778f2abc31d70ff67cd/ATTI47c412200b19b4ceeaa3b858b2ccd6f6E08B033B/sae-501

Figma - https://www.figma.com/design/Gn8XuYvYqbig8Ghebyyaaa/Sae501-TrainU?node-id=184-2&t=m4etcHph4kvyuxzm-1

