# Uniworld Editor

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### Setup Guide
0. Make sure you have [NodeJS](https://nodejs.org/en/) installed
1. Download or fork this repository
2. Update the `src/config.js` file as follows:
    - Change the `baseURL` value to the URL of the deployed Uniworld API Back-end
    - Change the `platformURL` value to the URL of the deployed application
      (e.g. `"https://<USERNAME>.github.io/<REPOSITORY_NAME>"`)
3. Open the terminal and run `npm install` to install the dependencies

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run deploy`

This command builds the app and deploys it to Github Pages
