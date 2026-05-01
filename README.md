!!! Please ensure you have the full set up for React Native on Visual Code Studio !!!

====================Project Structure====================

*   `App.tsx`: Main entry point and navigation container.
*   `server.js`: Node.js server handling REST API and WebSockets.
*   `/src/storage/noteStorage.ts`: Logic for handling CRUD operations and AsyncStorage.
*   `notes_server.sqlite`: SQLite database file storing synced notes.

====================Credits & Acknowledgments====================

*   **Tutorial Referenced**: [React Native Tutorial for Beginners](https://www.youtube.com/watch?v=8ejuHsaXiwU&t=602s) by **Programming with Mosh**.
*   **Usage**: This tutorial was used as a reference for establishing the initial project architecture and understanding core React Native components.
*   **Academic Context**: Developed for the Mobile Application Development Assignment (2026).

====================Note-Taking App with Real-Time Cloud Sync====================

A full-stack mobile application developed with **React Native** that allows users to manage personal notes with local persistence and a backend synchronization feature.

====================Features====================
*   **Persistent Storage**: Uses `AsyncStorage` to save notes locally on the device.
*   **Advanced Navigation**: Implements a multi-layered navigation system including **Drawer**, **Tab**, and **Stack** navigators.
*   **Cloud Synchronization**: Integrated with a Node.js backend using **Axios** to sync notes to a centralized database.
*   **Real-time Notifications**: Utilizes **Socket.IO** to provide instant feedback when a synchronization is successful.
*   **Favorites & Filters**: A dedicated screen to view and filter important notes.

====================Tech Stack====================
*   **Frontend**: React Native, React Navigation, Axios.
*   **Backend**: Node.js, Express.js, Socket.IO.
*   **Database**: SQLite (`notes_server.sqlite`) for cloud-side storage.

====================Setup for React Native:====================
Setup and tutorial video (for Windows): [React Native Tutorial for Beginners](https://www.youtube.com/watch?v=8ejuHsaXiwU&t=602s) by **Programming with Mosh**
1.Java Development Kit (JDK): https://download.oracle.com/java/17/archive/jdk-17.0.12_windows-x64_bin.exe
2.Android Studio: Download Android Studio & App Tools - Android Developers 
3.Node.JS: https://nodejs.org/dist/v18.20.8/node-v18.20.8-x64.msi
4.Visual Studio Code: https://code.visualstudio.com/download
5.Python (version 3.11.3) : https://www.python.org/ftp/python/3.11.3/python-3.11.3-amd64.exe

Please ensure Android SDK, Android SDK Platform and Android Emulator is installed with SDK mananger in Android SDK

Please make sure to setup environment manually Java Development Kit (JDK), Android Studio-Android Sdk, Android SDK Platform and Python 3.11

Run "npx @react-native-community/cli init MyApp --version="0.73"" with Command Prompt or terminal inside Visual Studio Code

====================Plugins, Addons and Dependencies:====================
In Command Prompt or terminal inside Visual Studio Code,

1. run "npm install @react-navigation/native@6.1.9" with Command Prompt or terminal inside Visual Studio Code

2. run "npm install react-native-screens@3.29 react-native-safe-area-context@4.8" with Command Prompt or terminal inside Visual Studio Code

	I)After installing react-native-screens, add import android.os.Bundle; at the top of MainActivity.kt that is located under 	android/app/src/main/java/<your package name>/
	
	Example:	import android.os.Bundle;  
			import com.facebook.react.ReactActivity;
			import com.facebook.react.ReactActivityDelegate;
			import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled;
			import com.facebook.react.defaults.DefaultReactActivityDelegate;

3.run "npm install @react-navigation/stack@6.0 npm install @react-navigation/drawer@6.6 @react-navigation/bottom-tabs@6.6"

4.run "npm install react-native-gesture-handler@2.14 react-native-reanimated@3.6 @react-native-masked-view/masked-view@0.3"
	I)For the react-native-reanimated, it is required to add plugins: ['react-native-reanimated/plugin'] in the babel.config.js. Don't remove the existing 	settings in the babel.config.js.
	
	Example:	module.exports = {
  			plugins: ['react-native-reanimated/plugin'],
  			// other settings
			}
	II)For the react-native-gesture-handler, it is required to add the following import statement at the top of index.js.
	Example:	import 'react-native-gesture-handler';

5. run "npm install react-native-vector-icons --save"

	I)Then, edit android/app/build.gradle ( NOT android/build.gradle ) and add the following apply from: "../../node_modules/react-native-vector-	icons/fonts.gradle" on top:
	Example:	apply plugin: "com.android.application"
			apply plugin: "org.jetbrains.kotlin.android"
			apply plugin: "com.facebook.react"
			apply from: "../../node_modules/react-native-vector-icons/fonts.gradle"

6. run "npm i @react-native-picker/picker --save" or "npm i @react-native-picker/picker --force"
	If there is any error in installation, run these in terminal, i.e.,:	npm ERR! code ERESOLVE
										npm ERR! ERESOLVE unable to resolve dependency tree
										npm ERR!

7. run "npm i @react-native-community/slider@4.4.2 --force"

8. run "npm i react-native-pager-view@6.1.2"

9. run "npm install --save react-native-sqlite-storage"

10. run "npm install --save react-native-floating-action"

11. run "npm install @react-native-async-storage/async-storage@1.19.0 --force"

12. run "npm install axios"
