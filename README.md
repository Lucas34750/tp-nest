# Mini Réseau Social - Backend

API backend pour un mini réseau social développé avec **NestJS** et **Prisma**.  
Permet la gestion des utilisateurs, posts, likes et relations de suivi.  

---

## 📦 Installation

Cloner le projet et installer les dépendances :

```bash
git clone https://github.com/Lucas34750/tp-nest.git
cd tp-nest
npm install
````

---

## ⚙️ Variables d’environnement

Copie le fichier `.env.exemple` en `.env` et renseigne les variables :

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
JWT_SECRET="ton_secret_jwt"
PORT=3000
```

---

## 🗄️ Commandes Prisma / Base de données

* Générer le client Prisma :

```bash
npx prisma generate
```

* Appliquer les migrations à la base :

```bash
npx prisma migrate dev
```

* Ouvrir Prisma Studio pour explorer la base :

```bash
npx prisma studio
```

---

## ▶️ Lancement de l’API

```bash
npm run start:dev
```

L’API sera disponible sur `http://localhost:3000/`. (ou sur le port que vous avez renseigné dans le .env)

---

## 🔒 Authentification

* Toutes les routes principales nécessitent un **JWT** dans le header :

```
Authorization: Bearer <token>
```

* Les routes d’authentification (`/auth/signup`, `/auth/login`) sont **publiques**.

---

## 📝 Routes principales

### 1. Auth

#### `POST /auth/signup`

* **Description** : créer un compte utilisateur
* **Body** :

```json
{
  "email": "user@example.com",
  "username": "lucas",
  "password": "motdepasse123"
}
```

* **Accès** : public
* **Réponse** : l’utilisateur créé (sans le mot de passe)

#### `POST /auth/login`

* **Description** : se connecter
* **Body** :

```json
{
  "email": "user@example.com",
  "password": "motdepasse123"
}
```

* **Accès** : public
* **Réponse** :

```json
{
  "access_token": "<JWT_TOKEN>"
}
```
* ***Token à mettre dans le Authorization: Bearer <token>***
---

### 2. Users

#### `GET /users/profile`

* **Description** : récupérer son profil
* **Accès** : authentifié
* **Réponse** :

```json
{
  "id": 1,
  "email": "user@example.com",
  "username": "lucas",
  "dateCreate": "2025-09-05T14:00:00.000Z"
}
```

#### `POST /users/follow`

* **Description** : suivre un ou plusieurs utilisateurs
* **Body** (DTO `FollowDto`) :

```json
{
  "usernames": ["paul", "marie"]
}
```

* **Accès** : authentifié
* **Réponse** : liste des relations follow créées

#### `DELETE /users/unfollow`

* **Description** : ne plus suivre un utilisateur
* **Body** (DTO `FollowDto`) :

```json
{
  "usernames": ["paul"]
}
```

* **Accès** : authentifié
* **Réponse** : liste des relations supprimées

---

### 3. Posts

#### `POST /post`

* **Description** : créer un post
* **Body** (DTO `CreatePostDto`) :

```json
{
  "text": "Mon premier post",
  "image": "http://image.url"
}
```

* **Accès** : authentifié
* **Réponse** : post créé

#### `DELETE /post/:id`

* **Description** : supprimer son post
* **Accès** : authentifié
* **Règle** : un utilisateur **ne peut supprimer que ses propres posts**
* **Réponse** : post supprimé

#### `POST /post/like`

* **Description** : liker un post
* **Body** :

```json
{
  "id": 1
}
```

* **Accès** : authentifié
* **Règle** : un utilisateur **ne peut liker qu’une seule fois un post**
* **Réponse** : like créé

#### `DELETE /post/unlike`

* **Description** : retirer un like
* **Body** :

```json
{
  "id": 1
}
```

* **Accès** : authentifié
* **Règle** : un utilisateur **ne peut retirer que ses propres likes**
* **Réponse** : like supprimé

---

## 📂 Journalisation

Toutes les requêtes sont enregistrées dans le fichier `requests.log` à la racine du projet :

```
[2025-09-05T14:45:12.345Z] GET /posts
[2025-09-05T14:45:15.678Z] POST /users/follow
```

## ✅ Règles importantes

1. Toutes les routes **hors auth** nécessitent un JWT valide.
2. Un utilisateur **ne peut modifier ou supprimer que ses propres données** (posts, likes, follows).
3. L’architecture est **modulaire**, permettant d’ajouter facilement de nouvelles fonctionnalités (ex: commentaires, tags).

---

## 📖 Notes supplémentaires

* Les mots de passe sont **hachés avec bcrypt** avant stockage.
* La base de données utilisée est **PostgreSQL**.
* Pour tester facilement, vous pouvez utiliser **Postman** ou **curl** avec le JWT reçu après login.

```
