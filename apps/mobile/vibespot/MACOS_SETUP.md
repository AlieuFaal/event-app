# 🍎 MacBook Setup Guide for iOS Development

## ✅ What You've Already Done (on Windows)
- [x] Added `expo-dev-client` to package.json
- [x] Fixed workspace linking
- [x] Updated LocationPicker to use real MapView
- [x] Ran `expo prebuild --clean`

## 📦 Prerequisites on Mac

### 1. Install Homebrew (if not already installed)
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### 2. Install Bun
```bash
curl -fsSL https://bun.sh/install | bash
```

### 3. Install Watchman (recommended for React Native)
```bash
brew install watchman
```

### 4. Install Xcode from App Store
- Download Xcode from the Mac App Store (it's free but large ~15GB)
- Open Xcode once to accept license agreements
- Install Command Line Tools:
```bash
xcode-select --install
```

### 5. Install CocoaPods
```bash
sudo gem install cocoapods
```

---

## 🚀 Running Your Project on Mac

### Step 1: Sync Your Code
Push your changes from Windows and pull on Mac:
```bash
# On Windows (commit and push your changes)
git add .
git commit -m "feat: switch to development build with expo-dev-client"
git push

# On Mac (pull the changes)
cd ~/path/to/your/project
git pull
```

### Step 2: Install Dependencies
```bash
cd apps/mobile/vibespot

# Install JavaScript dependencies
bun install

# Install iOS native dependencies (CocoaPods)
cd ios
pod install
cd ..
```

### Step 3: Run Prebuild (if needed)
If you didn't push the `ios/` folder from Windows:
```bash
bunx expo prebuild --clean
cd ios
pod install
cd ..
```

### Step 4: Build & Run on iOS Simulator
```bash
bunx expo run:ios
```

This will:
- ✅ Build the iOS app with all native modules
- ✅ Launch iOS Simulator automatically
- ✅ Install the development build
- ✅ Start Metro bundler
- ✅ You'll see your app with working MapView! 🎉

**⏱️ First build**: 5-10 minutes
**Subsequent builds**: 2-3 minutes

---

## 🎯 Development Workflow (After First Build)

### For Daily Development
```bash
# Just start the dev server (code changes reload instantly)
bunx expo start --dev-client
```

### Only Rebuild When You:
- Add a NEW native package
- Modify `app.json` plugins
- Change native code

```bash
bunx expo run:ios
```

---

## 📱 Testing on Physical iPhone (FREE - No Paid Account Needed!)

### 1. Connect iPhone via USB

### 2. Run with your device as target
```bash
bunx expo run:ios --device
```

### 3. Trust Developer Certificate
- First time: iPhone will show "Untrusted Developer"
- Go to: **Settings → General → VPN & Device Management**
- Tap your email → Trust

That's it! Your app will run on your iPhone with full native features!

---

## 🐛 Troubleshooting

### "Pod install failed"
```bash
cd ios
pod deintegrate
pod install
cd ..
```

### "Build failed" / "Signing error"
In Xcode:
1. Open `ios/vibespot.xcworkspace`
2. Select project → Signing & Capabilities
3. Check "Automatically manage signing"
4. Select your Apple ID (free account is fine!)

### "Metro bundler error"
```bash
bunx expo start --clear
```

### "No simulators found"
1. Open Xcode
2. Window → Devices and Simulators
3. Click "+" to add a simulator (iPhone 15 recommended)

---

## 🎉 What You'll Have After Setup

✅ **Interactive MapView** with pan, zoom, markers
✅ **All native modules** working perfectly
✅ **Fast Refresh** - code changes reload instantly
✅ **iOS Simulator** for quick testing
✅ **Physical device testing** for real-world testing
✅ **No limitations** - add any native feature you want!

---

## 💡 Pro Tips

1. **Use Simulator for quick testing** - much faster than physical device
2. **Test on physical device occasionally** - for camera, GPS, performance
3. **Keep Metro running** - don't restart unless adding new native packages
4. **Commit often** - easy to sync between Windows and Mac

---

## 🔄 Syncing Between Windows & Mac

### Recommended Workflow:
1. **Code on either machine** (both work fine for JavaScript changes)
2. **Build iOS only on Mac** (Windows can't build iOS)
3. **Use Git to sync** - push from one, pull on the other
4. **Keep node_modules in .gitignore** - reinstall on each machine

---

## ⚡ Quick Reference Commands

```bash
# Install dependencies
bun install && cd ios && pod install && cd ..

# Run on simulator
bunx expo run:ios

# Run on physical device
bunx expo run:ios --device

# Start dev server only (after first build)
bunx expo start --dev-client

# Clear cache and restart
bunx expo start --clear

# Rebuild everything
bunx expo prebuild --clean && cd ios && pod install && cd .. && bunx expo run:ios
```

---

Ready to go! 🚀 Just follow the steps on your MacBook and you'll have everything working!
