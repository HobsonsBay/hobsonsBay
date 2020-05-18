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


## Server Development (server directory)

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

3. Install **now** vercel platform.

`yarn global add now`

4. Login in to now.

`now login`

5. To logout of now.

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


## Android Development (mobile directory)

You need to follow the [react native docs](https://reactnative.dev/docs/environment-setup) to setup your machine with the necessary dependencies 
react native development.


1. Change into the android app folder

`cd /android/app`

2. Add the following config files

`/android/app/google-services.json` *Created in firebase settings console*

`/android/app/recycle-upload-key.keystore` *Created during react native setup*

3. Change into the src folder

`cd /src`

4. Add the following config files

`/src/config/algolia.json` *json file with attributes (appId and apiKey)*

`/src/config/api.json` *json file with attributes (API_URL)*

5. Run android dev

`yarn react-native run-android`


## Android Production

1. Change into the android app folder

`cd /android/app`

2. Update the two lines in build.gradle to bump the version up

`versionCode 106`

`versionName "1.0.6"`

3. Change into the android folder

`cd android`

4. Run the build script

`./gradlew bundleRelease`

5. Build artifact is generated

`android/app/build/outputs/bundle/release/app.aab`

6. Upload this artifact in Android PlayStore Releases

`Follow the creation prompts in the dashboard Release Management / App releases`


## IOS Development

You need to follow the [react native docs](https://reactnative.dev/docs/environment-setup) to setup your machine with the necessary dependencies 
react native development.


1. Change into the ios app folder

`cd /ios`

2. Add the following config files

`/ios/GoogleService-Info.plist` *Created in firebase settings console*

3. Add mobile provision profile to xcode (drag and drop into xcode)

`hbcc.mobileprovision`

4. Install the distribution certificate (double click cert file)

`ios_distribution.cer`

5. Run ios dev

`yarn react-native run-ios`


## IOS Production

1. Open the xcworkspace in Xcode.

`ios/HobsonsBay.xcworkspace`

2. Select HobsonsBay release scheme in top bar

3. Change version 1.0.x to 1.0.n in General tab

4. Click Product then Archive

5. Click Window then Organizer

6. Select your Archive

7. Click Validate App

8. Click Distribute App

9. Select back HobsonsBay scheme

10. Create new App version in Appstore

`Follow the creation prompts in the App Store / (+) version or platform`


## Git process

Project uses [trunk based development](https://trunkbaseddevelopment.com/). This means:

- Frequent pull requests from short-lived branches
- Only ever release from `master`

Issues are tracked on github if required.
