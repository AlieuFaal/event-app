# 📱 Mobile App - Create Event Flow Implementation Plan

**Project**: VibeSpot Event App  
**Platform**: React Native (Expo)  
**Date Created**: November 11, 2025  
**Status**: Planning Phase

---

## 🎯 Overview

This document outlines the implementation plan for the **Create Event** feature on the mobile app. Unlike the web version (single form with react-hook-form), the mobile experience will be a **multi-step wizard** with enhanced interactivity and visual appeal.

---

## 📋 Flow Structure: 4-Step Wizard

### **Navigation**
- **Type**: Button-based navigation (Back/Next/Finish buttons)
- **Future Enhancement**: Add swipe gestures (optional)
- **Progress Indicator**: Step counter or dots showing "Step X of 4"
- **Layout**: Stack-based navigation within the create-event screen

---

## 🎨 Step-by-Step Breakdown

### **Step 1: Genre Selection 🎵**

**Purpose**: Let users choose the music genre for their event

**Visual Design**:
- **Grid Layout**: 2 columns on mobile (adjustable for tablets)
- **Card Style**: 
  - Square/rounded rectangle pressable cards
  - Genre emoji/icon per genre (🎸 Rock, 🎤 Hip-Hop, 🎹 Jazz, etc.)
  - Genre name label
  - Subtle gradient or solid background
  - **Active State**: Border highlight + scale animation using `react-native-reanimated`
- **Scrollable**: Use `FlashList` or `ScrollView` for performance
- **Search Bar** (Optional): Quick filter at top for finding genres

**Data Source**:
```typescript
// Use existing GENRES array from packages/database/src/schema.ts
const genres = [
  "Hip-Hop", "Rock", "Indie", "Pop", "Jazz", "Classical",
  "Electronic", "Country", "Reggae", "Blues", "Folk", "Metal",
  "R&B", "Soul", "Afrobeat", "Punk", "Disco", "Funk",
  "Gospel", "Techno", "House", "Trance", "Dubstep", "Ambient",
  "Alternative", "Grunge", "New Wave", "Synthpop",
  "Progressive Rock", "Hard Rock", "Soft Rock", "Acoustic", "Instrumental"
];
```

**Color Assignment**:
- Auto-assign color based on genre (no color picker)
- Create genre-to-color mapping (e.g., Rock → Red, Jazz → Purple)

**Validation**: Genre must be selected to proceed

---

### **Step 2: Event Details 📝**

**Purpose**: Capture title, description, and optional venue

**Fields**:
1. **Title** (Required)
   - Large, prominent input field
   - Max 100 characters
   - Live character counter

2. **Description** (Required)
   - Multi-line textarea
   - Max 500 characters (adjust as needed)
   - Live character counter with color change when approaching limit

3. **Venue** (Optional)
   - Single-line input
   - "Skip" or "No Venue" option
   - Examples: "The Blue Note", "Central Park", "Brooklyn Bowl"

**Visual Enhancements**:
- Smooth keyboard-avoiding view (`KeyboardAvoidingView`)
- Animated placeholder text (optional)
- Preview card showing how event will appear (optional)
- Auto-save to `AsyncStorage` to prevent data loss

**Validation**:
- Title: 2-100 characters
- Description: Minimum 10 characters
- Venue: Optional, no validation

---

### **Step 3: Location & Address 📍**

**Purpose**: Set event location with address autocomplete and map visualization

**Implementation Strategy**:

#### **Libraries to Use**:
1. **`react-native-maps`** - Map display (Google Maps on Android, Apple Maps on iOS)
2. **`react-native-google-places-autocomplete`** - Address search with autocomplete
3. **`expo-location`** - Device GPS location (separate, for user's current position)

#### **Flow**:
1. **Address Input**: 
   - User types address → Google Places autocomplete suggestions appear
   - User selects address from suggestions

2. **Map Preview**:
   - Map displays with marker at selected address
   - Half-screen map view below autocomplete input
   - Marker is draggable (user can fine-tune position)
   - Bounce animation when marker is placed

3. **Coordinate Extraction**:
   - Extract `latitude` & `longitude` from selected place or marker position
   - Store for database submission

**Visual Design**:
- Address autocomplete input at top
- Map preview occupying lower half of screen
- Draggable red marker (or custom icon)
- "Confirm Location" button at bottom
- Show selected address text below map

**API Requirements**:
- Google Maps API Key (for both platforms)
- Enable APIs: Maps SDK for Android, Maps SDK for iOS, Places API

**Validation**: 
- Address must be selected
- Latitude/Longitude must exist

**Future Enhancement**: 
- Use `expo-location` to center map on user's current location initially
- "Use My Location" quick button

---

### **Step 4: Date, Time & Recurrence ⏰**

**Purpose**: Set event start/end times and optional repeat settings

**Fields**:

1. **Start Date & Time**
   - Two pressable cards that open native pickers
   - Use `@react-native-community/datetimepicker` or Expo's `DateTimePicker`
   - Default: Tomorrow at 6:00 PM

2. **End Date & Time**
   - Same as above
   - Default: Tomorrow at 10:30 PM
   - Validation: Must be after start date/time

3. **Duration Display**
   - Auto-calculated and displayed (e.g., "Duration: 4h 30m")

4. **Repeat Settings**
   - Toggle switch: "Repeat Event" (On/Off)
   - **If ON**:
     - Dropdown/Picker: Frequency (None, Daily, Weekly, Monthly, Yearly)
     - Optional: "End Repeat Date" picker
     - Toggle: "Never End" option

**Visual Design**:
- Card-based layout for each field
- Native picker modals (iOS wheel, Android dropdown)
- Clear visual feedback when dates are set
- Duration badge with icon

**Validation**:
- Start date cannot be in the past
- End date must be after start date
- If repeat is enabled, validate repeat end date (if set)

**Calendar Integration** (Post-Creation):
- After successful event creation, show modal:
  - "✅ Event Created Successfully!"
  - "Add to your device calendar?"
  - Buttons: [Add to Calendar] [Skip]
- **Library**: `expo-calendar`
- **Permissions**: Request calendar permission if not granted

---

### **Step 5: Event Image (Optional) 📸**

**Purpose**: Allow users to upload a custom event image

**Options**:
1. **Camera**: Take a photo with device camera
2. **Gallery**: Select from photo library
3. **Skip**: Use default genre-based placeholder image

**Implementation**:
- **Library**: `expo-image-picker`
- **Permissions**: Camera & media library permissions
- **Image Preview**: Show selected image with option to re-select
- **Upload**: Upload to cloud storage (consider Cloudinary, AWS S3, or Vercel Blob)

**Visual Design**:
- Large image preview area
- Three buttons: [📷 Camera] [🖼️ Gallery] [Skip]
- If image selected, show with "Change Image" option

**Validation**: Optional, no validation required

---

## 🗂️ File Structure

```
apps/mobile/vibespot/app/(protected)/(tabs)/create-event/
├── index.tsx                       # Main wizard container with RHF setup
├── _layout.tsx                     # Navigation wrapper (if needed)
├── steps/
│   ├── GenreSelection.tsx          # Step 1: Genre grid
│   ├── EventDetails.tsx            # Step 2: Title, description, venue
│   ├── LocationPicker.tsx          # Step 3: Address + Map
│   ├── DateTimePicker.tsx          # Step 4: Dates, times, recurrence
│   └── ImageUpload.tsx             # Step 5: Event image
├── components/
│   ├── StepIndicator.tsx           # Progress dots/bar component
│   ├── GenreCard.tsx               # Individual genre card
│   ├── LocationMap.tsx             # Map view wrapper
│   ├── NavigationButtons.tsx       # Back/Next/Finish buttons
│   └── CalendarPrompt.tsx          # Post-creation calendar modal
└── utils/
    ├── genreIconMap.ts             # Genre → Emoji/Icon mapping
    ├── genreColorMap.ts            # Genre → Color mapping
    └── defaultValues.ts            # Default form values (dates, etc.)
```

---

## 📦 Required Dependencies

### **Core Libraries**
```json
{
  "react-native-maps": "^1.18.0",
  "react-native-google-places-autocomplete": "^2.5.6",
  "expo-location": "^17.0.0",
  "expo-calendar": "^13.0.0",
  "expo-image-picker": "^15.0.0",
  "@react-native-community/datetimepicker": "^8.2.0"
}
```

### **UI & State Management**
```json
{
  "react-native-pager-view": "^6.5.1",
  "react-native-step-indicator": "^1.0.3",
  "@gorhom/bottom-sheet": "^4.6.4",
  "lottie-react-native": "^6.7.2",
  "@react-native-async-storage/async-storage": "^1.23.1"
}
```

### **Already Installed**
- `react-native-reanimated` ✅ (for animations)
- `react-hook-form` ✅ (for form state management)
- `@hookform/resolvers` ✅ (for Zod integration)
- `zod` ✅ (for validation schemas)

---

## 🔄 State Management Strategy

**Approach**: Use **React Hook Form** for form state management across steps

**Why React Hook Form?**
- ✅ Already used in web app (consistency)
- ✅ Built-in validation with Zod resolver
- ✅ Excellent performance (minimal re-renders)
- ✅ No additional dependencies needed
- ✅ Easy to share state across step components
- ✅ `watch()` for real-time field updates
- ✅ `getValues()`, `setValue()` for programmatic control

**Implementation Pattern**:

```typescript
// index.tsx (Main Container)
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { eventInsertSchema } from 'drizzle/db/schema';

export default function CreateEvent() {
  const [currentStep, setCurrentStep] = useState(1);
  
  const form = useForm({
    resolver: zodResolver(eventInsertSchema),
    mode: 'onBlur',
    defaultValues: {
      genre: "Indie",
      color: "Blue",
      title: "",
      description: "",
      venue: "",
      address: "",
      latitude: "",
      longitude: "",
      startDate: getDefaultStartDate(),
      endDate: getDefaultEndDate(),
      repeat: "none",
      repeatEndDate: null,
      imageUri: null,
    }
  });

  const onSubmit = async (data) => {
    // Handle event creation
  };

  return (
    <Form {...form}>
      {currentStep === 1 && <GenreSelection form={form} />}
      {currentStep === 2 && <EventDetails form={form} />}
      {currentStep === 3 && <LocationPicker form={form} />}
      {currentStep === 4 && <DateTimePicker form={form} />}
      {currentStep === 5 && <ImageUpload form={form} />}
      
      <NavigationButtons
        currentStep={currentStep}
        totalSteps={5}
        onNext={() => {
          // Validate current step before proceeding
          form.trigger().then(isValid => {
            if (isValid) setCurrentStep(s => s + 1);
          });
        }}
        onBack={() => setCurrentStep(s => s - 1)}
        onSubmit={form.handleSubmit(onSubmit)}
      />
    </Form>
  );
}
```

**Step Component Pattern**:

```typescript
// steps/GenreSelection.tsx
import { UseFormReturn } from 'react-hook-form';
import { EventFormData } from '../types';

interface Props {
  form: UseFormReturn<EventFormData>;
}

export function GenreSelection({ form }: Props) {
  const selectedGenre = form.watch('genre');
  
  return (
    <FormField
      control={form.control}
      name="genre"
      render={({ field }) => (
        <View>
          {GENRES.map(genre => (
            <GenreCard
              key={genre}
              genre={genre}
              selected={field.value === genre}
              onPress={() => {
                field.onChange(genre);
                // Auto-assign color based on genre
                form.setValue('color', getColorForGenre(genre));
              }}
            />
          ))}
        </View>
      )}
    />
  );
}
```

**Auto-Save with AsyncStorage**:

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

const DRAFT_KEY = 'event-draft';

// Auto-save on every form change
useEffect(() => {
  const subscription = form.watch((values) => {
    AsyncStorage.setItem(DRAFT_KEY, JSON.stringify(values));
  });
  return () => subscription.unsubscribe();
}, [form.watch]);

// Load draft on mount
useEffect(() => {
  AsyncStorage.getItem(DRAFT_KEY).then(draft => {
    if (draft) {
      const parsedDraft = JSON.parse(draft);
      // Show prompt: "Resume previous draft?"
      form.reset(parsedDraft);
    }
  });
}, []);

// Clear draft after successful submission
const clearDraft = () => AsyncStorage.removeItem(DRAFT_KEY);
```

---

## ✅ Validation Strategy

**Approach**: Reuse Zod schemas from web app for consistency

**Schema Location**: `packages/database/src/schema.ts`

**Per-Step Validation**:
- Validate each step before allowing "Next"
- Use `form.trigger()` to validate current fields
- Disable "Next" button if current step is invalid
- Show inline error messages (red text + shake animation)

**Final Validation**:
- Before submission, validate entire form with `form.handleSubmit()`
- Show error toast if validation fails

**Example**:
```typescript
// In NavigationButtons component
const handleNext = async () => {
  // Validate only fields for current step
  const fieldsToValidate = getFieldsForStep(currentStep);
  const isValid = await form.trigger(fieldsToValidate);
  
  if (isValid) {
    onNext();
  } else {
    // Show error toast or shake animation
    toast.error("Please fill in all required fields");
  }
};

// Helper function
const getFieldsForStep = (step: number) => {
  switch (step) {
    case 1: return ['genre'];
    case 2: return ['title', 'description'];
    case 3: return ['address', 'latitude', 'longitude'];
    case 4: return ['startDate', 'endDate'];
    case 5: return []; // Image is optional
    default: return [];
  }
};
```

---

## 🎨 UI/UX Enhancements

### **Animations** (using `react-native-reanimated`)
- **Page Transitions**: Slide in/out when navigating steps
- **Button Feedback**: Scale down on press
- **Card Selection**: Scale + border highlight animation
- **Success Animation**: Lottie confetti on event creation success
- **Error Shake**: Shake animation for validation errors

### **Visual Design**
- **Consistent Gradient Background**: Like forgotpassword.tsx
  ```tsx
  <LinearGradient
    colors={['#8b5cf6', '#a78bfa', '#c4b5fd', '#e9d5ff']}
    start={{ x: -1, y: -1 }}
    end={{ x: 1, y: 1 }}
    style={{ flex: 1 }}
  />
  ```
- **Card-based Layout**: Use cards for inputs (consistent with existing design)
- **Dark Mode Support**: Respect system theme (already using NativeWind)

### **Accessibility**
- Proper labels for screen readers
- Keyboard navigation support
- High contrast for text/buttons

---

## 🚀 Implementation Phases

### **Phase 1: Setup & Structure** (Week 1)
- [ ] Install all required dependencies
- [ ] Set up Google Maps API keys (Android & iOS)
- [ ] Create file structure
- [ ] Set up React Hook Form in main container
- [ ] Create StepIndicator component
- [ ] Create NavigationButtons component
- [ ] Implement auto-save with AsyncStorage

### **Phase 2: Step 1 - Genre Selection** (Week 1-2)
- [ ] Create genre-icon mapping
- [ ] Create genre-color mapping
- [ ] Build GenreCard component
- [ ] Build GenreSelection screen with grid layout
- [ ] Add selection animation
- [ ] Add validation

### **Phase 3: Step 2 - Event Details** (Week 2)
- [ ] Build EventDetails form
- [ ] Add character counters
- [ ] Implement KeyboardAvoidingView
- [ ] Add validation (title, description)
- [ ] Add auto-save to AsyncStorage

### **Phase 4: Step 3 - Location** (Week 2-3)
- [ ] Integrate Google Places Autocomplete
- [ ] Set up react-native-maps
- [ ] Add draggable marker
- [ ] Extract coordinates on address selection
- [ ] Add "Confirm Location" button
- [ ] Test on both iOS and Android

### **Phase 5: Step 4 - Date/Time** (Week 3)
- [ ] Add DateTimePicker for start/end dates
- [ ] Calculate and display duration
- [ ] Add repeat toggle and frequency picker
- [ ] Add optional repeat end date
- [ ] Validate date logic (end after start, etc.)

### **Phase 6: Step 5 - Image Upload** (Week 3-4)
- [ ] Integrate expo-image-picker
- [ ] Request camera/gallery permissions
- [ ] Add image preview
- [ ] Set up image upload to cloud storage
- [ ] Implement fallback to placeholder images

### **Phase 7: Submission & Calendar** (Week 4)
- [ ] Create event submission logic
- [ ] Connect to backend API
- [ ] Add success/error handling
- [ ] Implement calendar prompt modal
- [ ] Integrate expo-calendar
- [ ] Test end-to-end flow

### **Phase 8: Polish & Testing** (Week 4-5)
- [ ] Add all animations
- [ ] Add success Lottie animation
- [ ] Test on various screen sizes
- [ ] Test on iOS and Android
- [ ] Handle edge cases (no internet, permissions denied, etc.)
- [ ] Add loading states
- [ ] Performance optimization

---

## 🔐 Permissions Required

### **Android** (`app.json`)
```json
{
  "permissions": [
    "ACCESS_FINE_LOCATION",
    "ACCESS_COARSE_LOCATION",
    "CAMERA",
    "READ_CALENDAR",
    "WRITE_CALENDAR",
    "READ_MEDIA_IMAGES"
  ]
}
```

### **iOS** (`app.json`)
```json
{
  "infoPlist": {
    "NSLocationWhenInUseUsageDescription": "We need your location to show nearby events and help you create events.",
    "NSCameraUsageDescription": "We need access to your camera to take event photos.",
    "NSPhotoLibraryUsageDescription": "We need access to your photo library to select event images.",
    "NSCalendarsUsageDescription": "We need access to your calendar to add events."
  }
}
```

---

## 🌍 Google Maps API Setup

### **Required APIs** (Enable in Google Cloud Console)
1. Maps SDK for Android
2. Maps SDK for iOS
3. Places API
4. Geocoding API (for address → coordinates)

### **API Key Configuration**
- **Android**: Add to `android/app/src/main/AndroidManifest.xml`
- **iOS**: Add to `ios/YourApp/AppDelegate.mm` or via Expo config
- **Environment Variables**: Store keys in `.env` file
  ```
  EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=your_key_here
  ```

### **Free Tier Limits**
- Maps: 28,500 map loads/month free
- Places Autocomplete: $2.83 per 1,000 requests (after free tier)
- Budget alerts recommended

---

## 🐛 Edge Cases & Error Handling

### **Common Scenarios**:
1. **No Internet Connection**:
   - Show error toast
   - Disable map/autocomplete features
   - Allow form filling, queue submission for later

2. **Location Permissions Denied**:
   - Show explanation modal
   - Provide "Open Settings" button
   - Allow manual address entry fallback

3. **Calendar Permissions Denied**:
   - Still create event successfully
   - Skip calendar integration
   - Show informational toast

4. **Image Upload Fails**:
   - Retry mechanism (3 attempts)
   - Fallback to no image
   - Don't block event creation

5. **User Exits Mid-Flow**:
   - Auto-save progress to AsyncStorage
   - Prompt to resume on return
   - "Clear Draft" option

6. **Invalid Address** (no coordinates):
   - Show error: "Please select an address from the suggestions"
   - Don't allow proceeding without valid coordinates

---

## 📊 Data Flow

```
User Input (Step 1-5)
    ↓
React Hook Form State (auto-saved to AsyncStorage)
    ↓
Per-Step Validation (form.trigger)
    ↓
Final Validation (form.handleSubmit with Zod schema)
    ↓
Image Upload (if selected) → Get image URL
    ↓
API Call to Backend (POST /api/events)
    ↓
Success Response
    ↓
Clear Draft from AsyncStorage
    ↓
Calendar Prompt Modal
    ↓
Navigate to Events List / Event Detail
```

---

## 🔗 API Integration

**Endpoint**: `POST /api/events` (or similar from web app)

**Payload**:
```typescript
{
  id: string;           // UUID generated client-side
  title: string;
  description: string;
  venue: string | null;
  address: string;
  latitude: string;
  longitude: string;
  color: string;        // Auto-assigned based on genre
  genre: string;
  startDate: Date;
  endDate: Date;
  repeat: 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';
  repeatGroupId: string | null;
  repeatEndDate: Date | null;
  userId: string;       // From auth session
  imageUrl: string | null;  // If image uploaded
  createdAt: Date;
}
```

**Response Handling**:
- Success (201): Show success modal, prompt calendar, navigate away
- Error (4xx/5xx): Show error toast with retry option
- Network Error: Queue for later with offline indicator

---

## 🎯 Success Metrics

**User Experience**:
- [ ] Wizard completes in < 2 minutes
- [ ] All steps have smooth animations
- [ ] No crashes during testing
- [ ] Works on iOS and Android
- [ ] Accessible to screen readers

**Technical**:
- [ ] Form validation catches all invalid inputs
- [ ] Auto-save prevents data loss
- [ ] Calendar integration works on both platforms
- [ ] Map loads in < 3 seconds
- [ ] Image upload completes in < 5 seconds

---

## 📝 Future Enhancements (Post-MVP)

1. **Swipe Navigation**: Add swipe gestures between steps
2. **AI Image Generation**: Generate event poster based on details
3. **Social Sharing**: Share event to social media after creation
4. **Collaborative Events**: Invite co-hosts during creation
5. **Recurring Event Templates**: Save and reuse event templates
6. **Advanced Location**: 
   - Multi-location events
   - Virtual event option (no physical location)
7. **Ticketing Integration**: Add ticket pricing during creation
8. **Preview Mode**: Full preview of event before submission

---

## ❓ Open Questions / Decisions Needed

- [ ] **Image Storage**: Which cloud provider? (Cloudinary, AWS S3, Vercel Blob)
- [ ] **Max Image Size**: What's the file size limit? (e.g., 5MB)
- [ ] **Offline Mode**: Should events be created offline and synced later?
- [ ] **Draft Events**: Allow saving as draft before publishing?
- [ ] **Step Skipping**: Can users skip steps or must complete in order?

---

## 📞 Resources & Documentation

- [React Hook Form](https://react-hook-form.com/get-started)
- [React Hook Form with Zod](https://react-hook-form.com/get-started#SchemaValidation)
- [React Native Maps Docs](https://github.com/react-native-maps/react-native-maps)
- [Google Places Autocomplete](https://github.com/FaridSafi/react-native-google-places-autocomplete)
- [Expo Location](https://docs.expo.dev/versions/latest/sdk/location/)
- [Expo Calendar](https://docs.expo.dev/versions/latest/sdk/calendar/)
- [Expo Image Picker](https://docs.expo.dev/versions/latest/sdk/imagepicker/)
- [AsyncStorage](https://react-native-async-storage.github.io/async-storage/)
- [Reanimated](https://docs.swmansion.com/react-native-reanimated/)

---

## 📸 Image Storage Strategy

**Don't store images in PostgreSQL** - Store image **URLs** in your DB, actual images in blob storage.

**Recommended Solution for Your Stack**: **Vercel Blob Storage**
- ✅ Vercel-native (you're deploying web to Vercel)
- ✅ Simple SDK (`@vercel/blob`)
- ✅ Free tier: 1GB storage, 100GB bandwidth/month
- ✅ Works from both web (server actions) and mobile (API endpoint)
- ✅ Automatic CDN distribution
- ✅ No AWS complexity

## 🗄️ Schema Updates

````typescript
import { pgTable, text, timestamp, uuid, real } from "drizzle-orm/pg-core";

export const events = pgTable("events", {
  // ...existing code...
  venue: text("venue"),
  address: text("address").notNull(),
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  
  // Add this field (nullable - won't break existing web app)
  imageUrl: text("image_url"), // Stores Vercel Blob URL
  
  createdAt: timestamp("created_at").notNull().defaultNow(),
  // ...existing code...
});
````

````typescript
import { z } from "zod";

// ...existing code...

export const eventInsertSchema = z.object({
  // ...existing code...
  longitude: z.number(),
  
  // Add optional image URL field
  imageUrl: z.string().url().optional().nullable(),
  
  createdAt: z.date().default(() => new Date()),
  // ...existing code...
});
````

## 🚀 Implementation Plan

### **Step 1: Install Dependencies**

```bash
# In mobile app
cd apps/mobile/vibespot
bun add expo-image-picker @vercel/blob

# In web app (for future use)
cd apps/web
bun add @vercel/blob
```

### **Step 2: Update ImageUpload Component**

````typescript
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { eventInsertSchema } from "@vibespot/validation";
import { LucideImagePlus, X } from "lucide-react-native";
import * as ImagePicker from 'expo-image-picker';
import type { UseFormReturn } from "react-hook-form";
import { View, Text, TouchableOpacity, Image, Alert, ActivityIndicator } from "react-native";
import type z from "zod";
import { useState } from "react";

interface Props {
    form: UseFormReturn<z.infer<typeof eventInsertSchema>>;
}

export function ImageUpload({ form }: Props) {
    const [isUploading, setIsUploading] = useState(false);
    const imageUrl = form.watch("imageUrl");

    const pickImage = async (source: 'camera' | 'library') => {
        try {
            // Request permissions
            const permissionResult = source === 'camera' 
                ? await ImagePicker.requestCameraPermissionsAsync()
                : await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (!permissionResult.granted) {
                Alert.alert(
                    "Permission Required",
                    `We need ${source} access to upload an event image.`,
                    [{ text: "OK" }]
                );
                return;
            }

            // Launch picker
            const result = source === 'camera'
                ? await ImagePicker.launchCameraAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    allowsEditing: true,
                    aspect: [16, 9], // Event card aspect ratio
                    quality: 0.8, // Compress to reduce file size
                })
                : await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    allowsEditing: true,
                    aspect: [16, 9],
                    quality: 0.8,
                });

            if (!result.canceled && result.assets[0]) {
                await uploadImage(result.assets[0].uri);
            }
        } catch (error) {
            console.error("Error picking image:", error);
            Alert.alert("Error", "Failed to select image. Please try again.");
        }
    };

    const uploadImage = async (localUri: string) => {
        setIsUploading(true);
        try {
            // Create FormData for upload
            const formData = new FormData();
            const filename = localUri.split('/').pop() || 'event-image.jpg';
            const match = /\.(\w+)$/.exec(filename);
            const type = match ? `image/${match[1]}` : 'image/jpeg';

            formData.append('file', {
                uri: localUri,
                name: filename,
                type,
            } as any);

            // Upload to your API endpoint (which uses Vercel Blob)
            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/upload/event-image`, {
                method: 'POST',
                body: formData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (!response.ok) throw new Error('Upload failed');

            const { url } = await response.json();
            form.setValue("imageUrl", url);
            
        } catch (error) {
            console.error("Upload error:", error);
            Alert.alert("Upload Failed", "Could not upload image. Please try again.");
        } finally {
            setIsUploading(false);
        }
    };

    const removeImage = () => {
        form.setValue("imageUrl", null);
    };

    return (
        <View className="flex-1">
            <CardHeader className="flex flex-col items-center mt-5 gap-2">
                <CardTitle className="text-5xl text-secondary-foreground dark:text-white text-center">
                    Add Event Image
                </CardTitle>
                <CardDescription className="text-secondary-foreground dark:text-white text-base text-center mt-2">
                    Select an image that fits the vibe of your event.
                </CardDescription>
            </CardHeader>

            <View className="w-10/12 mx-auto mt-10">
                {imageUrl ? (
                    // Show selected image
                    <View className="relative">
                        <Image 
                            source={{ uri: imageUrl }}
                            className="w-full h-72 rounded-2xl"
                            resizeMode="cover"
                        />
                        <TouchableOpacity
                            onPress={removeImage}
                            className="absolute top-2 right-2 bg-black/50 rounded-full p-2"
                        >
                            <X size={24} color="white" />
                        </TouchableOpacity>
                    </View>
                ) : (
                    // Show upload options
                    <View className="bg-secondary-foreground/20 dark:bg-secondary-foreground/80 rounded-2xl h-72 flex items-center justify-center">
                        {isUploading ? (
                            <ActivityIndicator size="large" color="#8b5cf6" />
                        ) : (
                            <View className="items-center gap-4">
                                <LucideImagePlus size={48} color="#9ca3af" />
                                <View className="flex-row gap-3">
                                    <TouchableOpacity
                                        onPress={() => pickImage('camera')}
                                        className="bg-primary px-6 py-3 rounded-full"
                                    >
                                        <Text className="text-primary-foreground font-semibold">
                                            📷 Camera
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => pickImage('library')}
                                        className="bg-primary px-6 py-3 rounded-full"
                                    >
                                        <Text className="text-primary-foreground font-semibold">
                                            🖼️ Gallery
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                                <Text className="text-muted-foreground text-sm">
                                    or skip to use default
                                </Text>
                            </View>
                        )}
                    </View>
                )}
            </View>
        </View>
    );
}
````

### **Step 3: Create API Upload Endpoint**

````typescript
import { put } from '@vercel/blob';
import { Hono } from 'hono';

const upload = new Hono();

upload.post('/event-image', async (c) => {
  try {
    const body = await c.req.parseBody();
    const file = body.file as File;

    if (!file) {
      return c.json({ error: 'No file provided' }, 400);
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return c.json({ error: 'File must be an image' }, 400);
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      return c.json({ error: 'File too large (max 5MB)' }, 400);
    }

    // Upload to Vercel Blob
    const blob = await put(file.name, file, {
      access: 'public',
      addRandomSuffix: true, // Prevents filename collisions
    });

    return c.json({ url: blob.url });
  } catch (error) {
    console.error('Upload error:', error);
    return c.json({ error: 'Upload failed' }, 500);
  }
});

export default upload;
````

### **Step 4: Add Permissions to app.json**

````json
{
  "expo": {
    "plugins": [
      [
        "expo-image-picker",
        {
          "photosPermission": "Allow VibeSpot to access your photos to select event images.",
          "cameraPermission": "Allow VibeSpot to use your camera to take event photos."
        }
      ]
    ]
  }
}
````

### **Step 5: Migration**

```bash
cd packages/database
bun run generate  # Creates migration for imageUrl column
bun run migrate   # Applies migration
```

## 🔄 After Implementation

1. **Rebuild native app** (since expo-image-picker needs native code):
   ```bash
   cd apps/mobile/vibespot
   npx expo prebuild --clean
   bun run ios  # or bun run android
   ```

2. **Set Vercel Blob token** in your API environment:
   ```bash
   BLOB_READ_WRITE_TOKEN=your_token_here
   ```

3. **Web app remains unaffected** - `imageUrl` is optional, so existing events without images work fine.

This approach keeps your database lean, images optimized via CDN, and maintains compatibility across both platforms! 🎉

**Last Updated**: November 11, 2025  
**Document Owner**: Development Team  
**Status**: ✅ Ready for Implementation
