# USER_STORIES.md

## Fonctionnalités principales extraites

1. Gestion des événements (création, modification, suppression, consultation)
2. Réservation de tickets (booking)
3. Authentification et gestion des rôles (admin, organisateur, participant)
4. Tableau de bord utilisateur (suivi des réservations, événements créés)
5. Recherche et filtrage avancé d’événements
6. Notifications temps réel (changements, annulations, recommandations)
7. Gestion des tickets (multi-tarifs, capacité, suivi)
8. Calendrier intégré et planification flexible

---

## Fonctionnalité : Réservation de tickets

### User Story
En tant qu’utilisateur connecté, je veux pouvoir réserver un ticket pour un événement, afin de garantir ma place à cet événement.

### Description fonctionnelle
- Affichage de la liste des événements disponibles
- Sélection d’un événement, affichage du détail et du nombre de places restantes
- Formulaire de réservation (nombre de tickets, informations de paiement si besoin)
- Boutons : Réserver, Annuler
- Confirmation de la réservation et affichage dans l’espace « Mes réservations »

### Description visuelle
- Un écran liste les événements sous forme de cartes avec bouton « Réserver »
- Un clic sur « Réserver » ouvre un formulaire modal avec le nombre de places, un bouton de validation, et un message de confirmation après succès

### Critères d’acceptation
SCÉNARIO : Réservation réussie  
QUAND l’utilisateur sélectionne un événement avec des places disponibles  
ET renseigne le formulaire  
ET clique sur « Réserver »  
ALORS la réservation est enregistrée  
ET le ticket apparaît dans « Mes réservations »

SCÉNARIO : Événement complet  
QUAND l’utilisateur tente de réserver un événement sans places restantes  
ALORS un message d’erreur s’affiche  
ET la réservation est bloquée

SCÉNARIO : Annulation de la réservation  
QUAND l’utilisateur clique sur « Annuler »  
ALORS il revient à la liste des événements sans réserver

### Dépendances
- Authentification utilisateur (connexion requise)
- Création d’événements (il doit exister des événements)

### Priorité
- Haute

### Checklist Dev
- [ ] Route GET /events pour récupérer la liste
- [ ] Route GET /events/:id pour le détail
- [ ] Formulaire de réservation relié à l’API
- [ ] Endpoint POST /bookings pour réserver
- [ ] Gestion des erreurs (places épuisées, validation)
- [ ] Affichage des messages de succès/erreur
- [ ] Redirection ou mise à jour de l’espace « Mes réservations »

---

## Fonctionnalité : Gestion des événements

### User Story
En tant qu’organisateur, je veux pouvoir créer, modifier ou supprimer mes événements, afin de gérer mon offre et d’attirer des participants.

### Description fonctionnelle
- Formulaire de création/édition d’événement (titre, description, date, lieu, capacité, tarifs)
- Liste des événements créés, possibilité de modifier ou supprimer
- Validation des champs obligatoires

### Description visuelle
- Tableau de bord organisateur avec liste d’événements et boutons « Créer », « Modifier », « Supprimer »
- Formulaire modal ou page dédiée pour la création/édition

### Critères d’acceptation
SCÉNARIO : Création d’événement  
QUAND l’organisateur remplit le formulaire  
ET clique sur « Créer »  
ALORS l’événement apparaît dans la liste

SCÉNARIO : Modification  
QUAND l’organisateur édite un événement  
ET valide  
ALORS les changements sont sauvegardés

SCÉNARIO : Suppression  
QUAND l’organisateur clique sur « Supprimer »  
ALORS l’événement disparaît de la liste

### Dépendances
- Authentification organisateur
- Gestion des rôles

### Priorité
- Haute

### Checklist Dev
- [ ] Endpoint POST /events (création)
- [ ] Endpoint PATCH /events/:id (modification)
- [ ] Endpoint DELETE /events/:id (suppression)
- [ ] Validation des droits d’accès
- [ ] Affichage des messages de succès/erreur

---

## Fonctionnalité : Authentification et gestion des rôles

### User Story
En tant qu’utilisateur, je veux pouvoir m’inscrire, me connecter et accéder à des fonctionnalités selon mon rôle, afin d’utiliser la plateforme de façon sécurisée.

### Description fonctionnelle
- Formulaires d’inscription et de connexion
- Attribution de rôles (admin, organisateur, participant)
- Gestion de session et accès conditionnel aux routes

### Description visuelle
- Pages d’inscription/connexion
- Indicateur de rôle dans le tableau de bord
p
### Critères d’acceptation
SCÉNARIO : Inscription réussie  
QUAND l’utilisateur remplit le formulaire  
ET clique sur « S’inscrire »  
ALORS il accède à son espace personnel

SCÉNARIO : Accès refusé  
QUAND un utilisateur tente d’accéder à une page sans le bon rôle  
ALORS un message d’erreur s’affiche

SCÉNARIO : Changement de rôle  
QUAND un admin modifie le rôle d’un utilisateur  
ALORS ses droits changent immédiatement

### Dépendances
- Système d’authentification
- Gestion des rôles

### Priorité
- Haute

### Checklist Dev
- [ ] Endpoints /auth (inscription, connexion)
- [ ] Middleware de gestion des rôles
- [ ] Sécurisation des routes sensibles
- [ ] UI pour affichage du rôle et gestion de session

---

## Fonctionnalité : Tableau de bord utilisateur

### User Story
En tant qu’utilisateur, je veux accéder à un tableau de bord personnalisé, afin de suivre mes réservations, événements créés et informations importantes.

### Description fonctionnelle
- Accès à la liste de mes réservations
- Accès à la liste de mes événements créés (si organisateur)
- Affichage des notifications et messages importants

### Description visuelle
- Page « Mon espace » avec sections réservations, événements, notifications
- Tableaux ou cartes pour chaque section

### Critères d’acceptation
SCÉNARIO : Accès au tableau de bord  
QUAND l’utilisateur se connecte  
ALORS il accède à son espace personnalisé

SCÉNARIO : Affichage des réservations  
QUAND l’utilisateur consulte son espace  
ALORS il voit la liste de ses réservations à jour

SCÉNARIO : Affichage des événements créés  
QUAND un organisateur consulte son espace  
ALORS il voit la liste de ses événements

### Dépendances
- Authentification utilisateur
- Réservation de tickets
- Gestion des événements

### Priorité
- Moyenne

### Checklist Dev
- [ ] Route GET /bookings/me pour les réservations
- [ ] Route GET /events?organizerId= pour les événements créés
- [ ] UI pour affichage des sections et notifications

---

## Fonctionnalité : Recherche et filtrage avancé d’événements

### User Story
En tant qu’utilisateur, je veux pouvoir rechercher et filtrer les événements par lieu, genre, date, disponibilité, afin de trouver facilement ceux qui m’intéressent.

### Description fonctionnelle
- Barre de recherche et filtres (lieu, genre, date, disponibilité)
- Affichage dynamique des résultats

### Description visuelle
- Page ou section avec barre de recherche, filtres, et liste d’événements mise à jour en temps réel

### Critères d’acceptation
SCÉNARIO : Recherche par lieu  
QUAND l’utilisateur saisit un lieu  
ALORS seuls les événements correspondants s’affichent

SCÉNARIO : Filtrage par disponibilité  
QUAND l’utilisateur active le filtre « places disponibles »  
ALORS seuls les événements non complets sont affichés

SCÉNARIO : Recherche combinée  
QUAND l’utilisateur combine plusieurs filtres  
ALORS la liste s’actualise en conséquence

### Dépendances
- Gestion des événements

### Priorité
- Moyenne

### Checklist Dev
- [ ] Endpoint GET /events avec paramètres de recherche
- [ ] UI pour barre de recherche et filtres
- [ ] Affichage dynamique des résultats

---

## Fonctionnalité : Notifications temps réel

### User Story
En tant qu’utilisateur, je veux recevoir des notifications en temps réel sur les changements d’événements, annulations ou recommandations, afin de rester informé.

### Description fonctionnelle
- Système de notifications push ou in-app
- Alertes sur changements, annulations, recommandations personnalisées

### Description visuelle
- Icône de notification dans la barre de navigation
- Pop-up ou liste de notifications récentes

### Critères d’acceptation
SCÉNARIO : Notification de changement  
QUAND un événement réservé est modifié  
ALORS l’utilisateur reçoit une notification

SCÉNARIO : Notification d’annulation  
QUAND un événement est annulé  
ALORS tous les participants sont notifiés

SCÉNARIO : Recommandation personnalisée  
QUAND un événement correspond au profil de l’utilisateur  
ALORS il reçoit une suggestion

### Dépendances
- Authentification utilisateur
- Réservation de tickets

### Priorité
- Moyenne

### Checklist Dev
- [ ] Système de notifications (WebSocket, push, etc.)
- [ ] UI pour affichage et gestion des notifications

---

## Fonctionnalité : Gestion des tickets

### User Story
En tant qu’organisateur, je veux pouvoir créer différents types de tickets (tarifs, quantités), afin de mieux gérer la capacité et la tarification de mes événements.

### Description fonctionnelle
- Création de tickets avec nom, prix, quantité, type
- Association des tickets à un événement
- Suivi des ventes et disponibilités

### Description visuelle
- Interface de gestion des tickets dans la page d’édition d’événement
- Tableaux ou listes des tickets créés

### Critères d’acceptation
SCÉNARIO : Création de ticket  
QUAND l’organisateur ajoute un ticket  
ALORS il apparaît dans la liste des tickets de l’événement

SCÉNARIO : Suivi des ventes  
QUAND des réservations sont faites  
ALORS la quantité disponible diminue

SCÉNARIO : Épuisement des tickets  
QUAND la quantité atteint zéro  
ALORS le ticket n’est plus réservable

### Dépendances
- Gestion des événements

### Priorité
- Moyenne

### Checklist Dev
- [ ] Endpoint POST /tickets
- [ ] UI pour création et gestion des tickets
- [ ] Suivi des quantités et affichage dynamique

---

## Fonctionnalité : Calendrier intégré et planification flexible

### User Story
En tant qu’utilisateur, je veux pouvoir ajouter des événements à mon calendrier et choisir des dates flexibles, afin de mieux organiser ma participation.

### Description fonctionnelle
- Bouton « Ajouter au calendrier » sur chaque événement
- Gestion des événements multi-dates ou récurrents

### Description visuelle
- Bouton ou lien « Ajouter au calendrier »
- Sélecteur de dates pour les événements flexibles

### Critères d’acceptation
SCÉNARIO : Ajout au calendrier  
QUAND l’utilisateur clique sur le bouton  
ALORS l’événement est ajouté à son calendrier personnel

SCÉNARIO : Sélection de date flexible  
QUAND l’utilisateur choisit une date parmi plusieurs  
ALORS sa réservation est enregistrée pour cette date

SCÉNARIO : Affichage des événements à venir  
QUAND l’utilisateur consulte son calendrier  
ALORS il voit tous ses événements réservés

### Dépendances
- Réservation de tickets
- Gestion des événements

### Priorité
- Basse

### Checklist Dev
- [ ] Intégration bouton « Ajouter au calendrier  » (Google, iCal, etc.)
- [ ] UI pour sélection de dates
- [ ] Affichage des événements à venir dans le dashboard

---
