# Messaging App w/ Node, React, and MongoDB

### About the Project:
This is a practice project to demonstrate websockets, react, node js, and mongodb.

The app has basic authentication, a global chat function, and direct messaging.  Currently, users can create new conversations with other users and send only text messages.  When a user gets a new message, they receive a toast notification that when clicked will take them to that conversation.  I decided to use socket.io because it offers fast, bi-directional communication which makes implementing real time transactions much simpler.

### Future Goals:
* Clean up codebase
* Improve UI
* Add support for other types of media
* Add support for finding users and adding friends
## Two Configurations:

### Node Serves React

To run this way, run `npm run build` and then `npm start`, this will run the node \
app which serves the compiled react App.

#### To set App to this configuration:
Include `const HOST = window.location.origin.replace(/^http/, 'ws');` in App.js \
This will ensure that the react app connects to the same url it is being hosted from, but over ws instead of http.

### Development: Node and React run in parallel
To run this way, run `npm run lol` and in another terminal window `npm start`
remember that `npm start` is just  `node server.js`, this is also acceptable.

`npm run lol` runs the react app in development mode so that any changes are recompiled automatically.
Also suggest using `nodemon server.js`, which does the same but for the node file.

#### To set App to this configuration:
include `const HOST = "ws://localhost:8000/";` so that the client connects to the right server.


## Available Scripts

In the project directory, you can run:
### `npm start`
Starts the node process, open [http://localhost:8000](http://localhost:8000) to view in browser.
### `npm run lol`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
