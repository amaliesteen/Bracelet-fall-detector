# Fall Detection App

An app that connects to a fall detection bracelet via BLE and alerts caregivers in case of a fall.

## What is the purpose of this project?

There are two main purposes of the app. The first is to communicate with a medical device and store the received data in a cloud server. The second is to retrieve the data from the cloud and issue alerts when necessary.

## Prerequisites

1. You need all the standard tools required for developing a React Native app, so NodeJS and a JAVA SDK.

2. The app was tested on a physical Android device, as emulators typically do not support BLE. The app runs directly from the development machine (via USB debugging) using tools like React Native CLI. Android Studio is required for setting up the Android environment and device drivers.

## Features

- Connects to wearable bracelet via Bluetooth Low Energy (BLE)
- Automatic reconnection to app
- Displays fall alerts
- Uses Firebase to store data
- Fetch the wearer's phone's location
- Sends notifications to caregivers

## Installation

1. Place the contents of the repository somewhere on your system (manualy or with git) and open the folder in VSCode

2. Run the following command to install all needed libraries

`npm install --save`

3. Update the Android Studio SDK location in ./android/local.properties

4. Run the following command to launch the app on your connected android phone (make sure it has debugging enabled)

`npx react-native run-android`

## Download via QR Code

Scan the QR code below to download the APK file:
![QR Code] (https://github.com/amaliesteen/Bracelet-fall-detector/blob/main/QR.png)

## Dependencies

- react-native-ble-plx
- @react-navigation/native
- react-native-firebase
- react-native-geolocation-service
- react-native-push-notification
- react-native-background-actions
- react-native-quick-base64

## Technologies Used

- React Native
- JavaScript (ES6+)
- Firebase (Realtime Database / Firestore)
- Bluetooth Low Energy (BLE)
- Android SDK

## Project Structure Explanation

The project consists of multiple files. All the screens that are displayed in the app can be found in the `screens` folder. The rest of the project includes configuration files and functional components that support the app’s logic but are not directly visible in the user interface.

## Future Improvements

- Add iOS support
- Implement login system
- Improve BLE stability
