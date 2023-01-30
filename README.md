# WIP: Github Folders 
The vision of this project is a simple, clean web app to improve the github repository UI. Users will have access to a clean list of their repos, including:
- repos they own
- repos they have committed to 
- repos they have starred
- repos they have added manually

This project is born out of frusturation with the limited UI for github, with different repos listed in different places. Additionally, the user will be able to group repos as they see fit into folders.

Originally, this project was envisioned as a chrome extension, but I have since decided to make it a web app. The chrome extension will be developed once a MVP is reached.

## Usage
### To Run Locally as a Website
Like any react project, simply install the dependencies and use `npm start` to open the live server and see that app in action.

### To Build as a Chrome Extension
Run `npm run build`. Next, navigate to [chrome extensions](chrome://extensions/) and click the button that says "load unpacked." Navigate to the build directory of the project and select the build folder. This will load the extension locally, and you can demo it as you would with any other Chrome extension (opening it by clicking the icon in the top right)

### To view Online as a standalone app
Visit the website at [https://github-folders.web.app/](https://github-folders.web.app/). Please note that the website is not yet functional, and is still in development.

### To Install from the Chrome Extension Store
Coming soon! :)

## References and Credits
[Icons - heroicons](https://heroicons.com/) 
<br>
[cyrb53 hash - bryc](https://github.com/bryc/code/blob/master/jshash/experimental/cyrb53.js)
<br>
[Github icon - Github](https://github.com/logos)
<br>
[Github OAuth - TomDoesTech](https://www.youtube.com/watch?v=qUE4-kSlPIk)

## Useful links
oauth with github - http://thecodebarbarian.com/github-oauth-login-with-node-js.html 
<br>
more oauth - https://authjs.dev/
<br>
react chrome extension - https://medium.com/litslink/how-to-create-google-chrome-extension-using-react-js-5c9e343323ff

