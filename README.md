# Getting Started with VirtuMart Dashboard

## Setup Instructions

Before running the project, you need to set up Firebase for authentication, Firestore, and storage.

1. **Create a Firebase Project:**
   - Go to [Firebase Console](https://console.firebase.google.com/), sign in, and create a new project.
   - Register your app with Firebase and get the Firebase configuration details (apiKey, authDomain, projectId, etc.).

2. **Configure Firebase in your Project:**
   - In the `src` folder of your project, create a file called `firebase.js`.
   - Add the following code to it and replace the placeholders with your Firebase configuration details:

```markdown
   ```javascript
   // Import the functions you need from the SDKs
   import { initializeApp } from 'firebase/app';
   import { getAuth } from 'firebase/auth';
   import { getFirestore } from 'firebase/firestore';
   import { getStorage } from 'firebase/storage';

   const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "YOUR_AUTH_DOMAIN",
     projectId: "YOUR_PROJECT_ID",
     storageBucket: "YOUR_STORAGE_BUCKET",
     messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
     appId: "YOUR_APP_ID",
     measurementId: "YOUR_MEASUREMENT_ID"
   };

   // Initialize Firebase
   const app = initializeApp(firebaseConfig);

   export const auth = getAuth(app);
   export const firestore = getFirestore(app);
   export const storage = getStorage(app);
   ```

3. **Install Firebase:**
   - Run `npm install firebase` to install the Firebase SDK.


## Available Scripts

In the project directory, you can run:

### `npm start`
Runs the app in development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes. You may also see any lint errors in the console.

### `npm test`
Launches the test runner in interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`
Builds the app for production in the `build` folder.\
It bundles React in production mode and optimizes the build for best performance.

Your app is now ready to be deployed!