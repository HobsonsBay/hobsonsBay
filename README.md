# Hobsons Bay App
Hobsons Bay Recycling 2.0 App

This is the repository for the Recycling 2.0 App developed for Hobsons Bay City Council through fellowship with Code for Australia

The repository contains two main projects:

- **mobile** - React Native mobile application
- **server** - API for the mobile application


## Setup

Local environment requirements:

- [Node](https://nodejs.org/en/)
- [Yarn](https://yarnpkg.com/en/)

External Services:

- Apple AppStore: (Deploys IOS app)
[store](https://developer.apple.com)
 
- Google PlayStore: (Deploys Android app)
[store](https://play.google.com)
 
- Firebase: (Handles push notifications – Free Plan)
[firebase](https://firebase.google.com/)
 
- Algolia: (Handles search functionality)
[algolia](https://www.algolia.com/)
 
- Vercel: (Handles the App’s API, formely known as Zeit)
[vercel](https://vercel.com)

- Agility: (Knack platform application with data) 
[knack](https://www.knack.com/)


## Server Development:

1. Change into the server folder

`cd hobsonsBay/server`

2. Create a .env environment file with following variables

`ALGOLIA_APP_ID=value` 
*algolia application id found in dashboard api keys*

`ALGOLIA_API_KEY=value`
*algolia Write API Key found in dashboard api keys*

`APPLICATION_ID=value`
*agility application id found in builder dashboard*

`API_KEY=value`
*agility api key found in builder dashboard*

`KNACK_API_URL=value`
*agility knack api url e.g. https://api.knack.com/v1/objects/*

`KNACK_BIN_DAYS_OBJECT_ID=value`
*agility object id for bin days table found in builder dashboard*

`KNACK_PROPERTY_OBJECT_ID=value`
*agility object id for property table found in builder dashboard*

`KNACK_ITEM_OBJECT_ID=value`
*agility object id for items table found in builder dashboard*

`KNACK_USER_CONFIGS_OBJECT_ID=value`
*agility object id for user configs table found in builder dashboard*

`FIREBASE_ADMIN=value`
*firebase service account key found in firebase project settings / Service Accounts*

3. Install now vercel platform.

`yarn global add now`

4. Login in to now vercel platform.

`now login`

5. To logout of now

`now logout`

6. To run server local:

`now dev --listen 8080`


## Server Production:

1. Change into the server folder

`cd hobsonsBay/server`

2. To add a new secret to now

`now secrets add <secret-name> <secret-value>`

3. To rename a secret in now

`now secrets rename <secret-name> <new-name>` 

4. To view current secrets

`now secrets list`

5. To deploy to production (command shows production end point after completion)

`now --prod`


## Git process

Project uses [trunk based development](https://trunkbaseddevelopment.com/). This means:

- Frequent pull requests from short-lived branches
- Only ever release from `master`
