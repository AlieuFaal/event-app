# 🚀 Switching to Expo Development Build

## Current Status
✅ Added `expo-dev-client` to package.json
✅ Fixed workspace linking
✅ Updated `LocationPicker.tsx` to use real MapView
⏳ Installing dependencies...

## Next Steps (Run these commands after installation)

### 1. Clean Prebuild (Regenerate Native Folders)
```cmd
cd "e:\Hackermanz\GitHub Repositoriez\Projectz\Personal Projectz\event-app\apps\mobile\vibespot"
bunx expo prebuild --clean
```

This will:
- Remove old `android/` and `ios/` folders
- Generate new ones with `react-native-maps` properly configured
- Apply all plugins from `app.json`

### 2. Build & Run on Android
```cmd
bunx expo run:android
```

This will:
- Compile the native Android app with all native modules
- Install the development build on your device/emulator
- Start Metro bundler

**⏱️ Expected time**: 5-15 minutes for first build

---

## After First Build

### For Daily Development
```cmd
# Just start the dev server (fast!)
bunx expo start --dev-client
```

### Only Rebuild When:
- You add a NEW native package
- You modify `app.json` plugins
- You change native code

```cmd
bunx expo run:android
```

---

## What You'll Get

✅ **Interactive MapView** with markers
✅ **All native modules** working
✅ **Same development speed** as Expo Go
✅ **Production-ready** builds
✅ **No more limitations!**

---

## Troubleshooting

### If build fails:
1. Make sure Android Studio is installed
2. Check that Java/Gradle is set up
3. Try: `cd android && .\gradlew clean` then rebuild

### If Metro bundler errors:
```cmd
bunx expo start --clear
```

### If you see "Failed to connect to dev server":
- Make sure your device/emulator is on the same network
- Try restarting the Metro bundler
