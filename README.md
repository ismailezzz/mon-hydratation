# Mon Hydratation 💧

Application web mobile-first pour compter les verres d'eau sur iPhone.

## Fonctionnalités
- Compteur de verres avec choix de 200, 250, 300 ou 500 ml.
- Ajout rapide d'un verre ou d'une bouteille de 500 ml.
- Objectifs quotidiens de 3 L, 3,5 L ou 4 L.
- Progression visuelle, quantité restante et liste des verres.
- Annulation du dernier ajout et réinitialisation manuelle.
- Sauvegarde locale dans le navigateur (`localStorage`), sans compte ni envoi de données.
- Remise à zéro automatique du journal quotidien à la date locale du téléphone.
- Manifest, icônes, service worker et cache pour une expérience installable et utilisable hors ligne après le premier chargement.

## Tester en local
Les service workers ne fonctionnent pas depuis `file://`. Lance un petit serveur local depuis ce dossier :
```bash
python3 -m http.server 8000
```
Puis ouvre `http://localhost:8000` dans le navigateur de l'ordinateur. Pour tester sur iPhone, le site doit être hébergé en HTTPS ou servi depuis un environnement de développement sécurisé.

## Publier gratuitement avec GitHub Pages
1. Crée/connecte-toi à un compte GitHub.
2. Crée un dépôt public, par exemple `mon-hydratation`.
3. Envoie tous les fichiers et le dossier `icons/` à la racine du dépôt.
4. Dans le dépôt, ouvre **Settings → Pages**.
5. Sous **Build and deployment**, sélectionne **Deploy from a branch**, puis la branche `main` et le dossier `/ (root)`, puis **Save**.
6. Attends la publication. GitHub affiche une adresse HTTPS ressemblant à `https://TON-PSEUDO.github.io/mon-hydratation/`.
7. Ouvre cette adresse dans **Safari sur l'iPhone**.

## Ajouter à l'écran d'accueil iPhone
1. Ouvre le lien publié dans **Safari** (pas dans un navigateur intégré à une autre application).
2. Appuie sur le bouton **Partager** (carré avec flèche vers le haut).
3. Fais défiler et choisis **Sur l’écran d’accueil**. Selon la version d'iOS, l'option peut se trouver dans **Modifier les actions**.
4. Vérifie le nom « Hydratation », puis appuie sur **Ajouter**.
5. Lance l'app depuis la nouvelle icône. Ouvre-la une fois avec Internet pour charger les fichiers ; le service worker permet ensuite de mettre en cache les ressources.

## Notes importantes
- Les données restent dans le stockage du navigateur sur cet appareil. Elles ne se synchronisent pas entre appareils et peuvent être effacées si les données du site sont supprimées.
- Pour une sauvegarde plus fiable, ne supprime pas les données du site. L'installation sur l'écran d'accueil et le navigateur doivent utiliser le même stockage associé au site.
- Le journal est réinitialisé au changement de date locale du téléphone. L'objectif et la taille du verre sont conservés.
- Ce projet est un outil de suivi, pas un avis médical. Les besoins d'eau varient d'une personne à l'autre ; ne te force pas à boire de grandes quantités rapidement.
