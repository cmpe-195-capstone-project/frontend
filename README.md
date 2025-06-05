
## Setup Instructions

### 1. Clone the repo

```bash
git clone https://github.com/yourname/AmberAlert.git
cd AmberAlert
```

---

### 2. Install dependencies

```bash
npm install
```

---

### 3. Add Android SDK path

Create the following file:

```
android/local.properties
```

Then paste this into it:

```properties
sdk.dir=C:\Users\YourUsername\AppData\Local\Android\Sdk
```

> Replace `YourUsername` with your actual Windows username.

---

## ▶️ Running the App

### 1. Start Metro bundler

```bash
npx react-native start --reset-cache
```

> Keep this terminal running.

---

### 2. In a separate terminal, build and launch the app

```bash
npx react-native run-android
```

> This will install the app on your emulator or connected device.

---

## Debugging Commands

| Task                           | Command                                                                 |
|--------------------------------|-------------------------------------------------------------------------|
| Kill Metro + Gradle stuck      | `taskkill /F /IM node.exe && taskkill /F /IM java.exe`                  |
| Clear build cache              | `cd android && gradlew.bat clean && cd ..`                              |
| Delete & reinstall modules     | `rd /s /q node_modules && del package-lock.json && npm install`         |
| Restart everything fresh       | `npx react-native start --reset-cache && npx react-native run-android` |

---

## Tech Stack

- React Native 0.73
- Metro bundler
- Android SDK
- FastAPI or Firebase for backend alerts

---
