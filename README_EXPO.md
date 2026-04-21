# Sky Dash: Urdu Adventure (Expo App)

This is a complete Flappy Bird style mobile game built with **React Native**, **Expo**, and **Expo Router**.

## Features
- **Expo Router**: File-based navigation.
- **Reanimated 3**: High-performance 60FPS physics and animations.
- **Zustand + AsyncStorage**: Persistent score and level saving.
- **Urdu Language Support**: Localized titles and UI.
- **20 Levels**: Progressively harder gameplay.

## How to run locally (VS Code)

1.  **Download and Unzip** this project to your computer.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the Expo development server:
    ```bash
    npx expo start
    ```
4.  **Open on Mobile**:
    - Download the **Expo Go** app on your Android (from Play Store) or iOS (from App Store).
    - Scan the QR code shown in your terminal from the Expo Go app.

## How to build for Android (APK)

To build a standalone APK that you can share or upload to Play Store:

1.  **Login to Expo**:
    ```bash
    npx expo login
    ```
2.  **Configure Project**:
    Ensure the `package` name in `app.json` is unique (e.g., `com.yourname.skydash`).
3.  **Run Build**:
    ```bash
    npx eas build -p android --profile preview
    ```
    (This requires [EAS CLI](https://docs.expo.dev/build/setup/))
4.  Once the build finishes, it will give you a link to download the `.apk` file.

## Project Structure
- `app/`: Expo Router screens (Navigation).
- `src/store/`: Game state management.
- `src/components/`: Reanimated Game entities (Bird, Pipes).
- `src/utils/`: Physics and collision logic.
