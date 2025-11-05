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
