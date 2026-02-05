# AI Accessibility Assistant - Mobile App

A React Native mobile application designed to assist visually impaired users by providing AI-powered object identification, text reading, money detection, and medicine label reading through camera analysis.

## 📱 Features

- **Camera Assistant**: Identify objects, read text, detect money, and analyze medicine labels
- **Object Finder**: Continuously search for specific items (phone, keys, wallet, etc.)
- **Text-to-Speech**: All responses are spoken aloud for accessibility
- **Screen Reader Compatible**: Works with device accessibility features

## 🏗️ Project Structure

```
aiaccessibiltyfinal/
├── App.js                 # Main app entry point with navigation
├── screens/
│   ├── HomeScreen.js      # Main home screen with navigation
│   ├── CameraScreen.js    # Camera assistant functionality
│   └── ObjectFinderScreen.js  # Object finder functionality
├── backend/               # Backend API (Vercel serverless functions)
│   ├── api/
│   │   ├── analyze.js     # Image analysis endpoint
│   │   └── find-object.js # Object finding endpoint
│   └── README.md          # Backend setup instructions
└── package.json           # Dependencies

```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- Expo Go app on your phone (for testing)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/ai-accessibility-app.git
   cd ai-accessibility-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Update Backend URL**
   - Open `screens/CameraScreen.js` and update line 16
   - Open `screens/ObjectFinderScreen.js` and update line 18
   - Replace `https://your-vercel-url.vercel.app` with your actual Vercel backend URL

4. **Start the app**
   ```bash
   npx expo start --clear
   ```

5. **Run on your device**
   - Scan the QR code with Expo Go app (iOS/Android)
   - Or press `a` for Android emulator
   - Or press `i` for iOS simulator

## 🔧 Backend Setup

The backend is deployed on Vercel as serverless functions. See `backend/README.md` for detailed setup instructions.

### Quick Deploy:

1. Navigate to `backend` folder
2. Deploy to Vercel:
   ```bash
   cd backend
   vercel
   ```
3. Copy the deployment URL
4. Update `BACKEND_URL` in both screen files

## 📦 Dependencies

- `react-native`: ^0.72.6
- `expo`: Latest
- `@react-navigation/native`: ^6.1.9
- `@react-navigation/native-stack`: ^6.9.17
- `expo-camera`: ~14.0.1
- `expo-speech`: ~11.3.0
- `axios`: ^1.6.0

## 🎯 Usage

1. **Home Screen**: Choose between Camera Assistant or Object Finder
2. **Camera Assistant**: 
   - Tap any button to ask questions about what the camera sees
   - Options: Object identification, text reading, money detection, medicine analysis
3. **Object Finder**:
   - Enter what you're looking for (e.g., "phone", "keys")
   - Tap "Start Search" to begin scanning
   - Follow spoken guidance to locate the item

## 🔐 Permissions

The app requires:
- **Camera Permission**: To capture images for analysis
- **Microphone Permission**: For text-to-speech (if needed)

## 🛠️ Development

### Running on Different Platforms

```bash
# Android
npm run android

# iOS
npm run ios

# Web
npm run web
```

### Building for Production

```bash
# Install EAS CLI
npm install -g eas-cli

# Configure
eas build:configure

# Build APK
eas build --profile preview --platform android
```

## 📝 API Endpoints

### `/api/analyze`
Analyzes images and answers questions.

**Request:**
```json
{
  "image": "base64-encoded-image",
  "question": "What is this object?"
}
```

**Response:**
```json
{
  "success": true,
  "answer": "This is a description..."
}
```

### `/api/find-object`
Searches for specific objects.

**Request:**
```json
{
  "image": "base64-encoded-image",
  "objectName": "phone"
}
```

**Response:**
```json
{
  "success": true,
  "found": false,
  "guidance": "Move camera left..."
}
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👤 Author

Your Name

## 🙏 Acknowledgments

- Built with React Native and Expo
- Backend deployed on Vercel
- AI powered by OpenAI Vision API (or your preferred AI service)
