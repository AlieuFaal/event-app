import { authClient } from "@/lib/auth-client";
import { useRouter } from "expo-router";
import {
  ArrowLeft,
  Camera,
  Check,
  ListMinus,
  LucideImagePlus,
  MapPin,
  Phone,
  User,
  X,
} from "lucide-react-native";
import {
  View,
  Text,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  RefreshControl,
  useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { Button } from "@/components/ui/button";
import * as Haptics from "expo-haptics";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { UserForm, userFormSchema } from "@vibespot/database/schema";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { apiClient } from "@/lib/api-client";
import { queryClient } from "@/lib/query-client";
import { useCallback, useState } from "react";
import { Pressable } from "react-native-gesture-handler";
import { useTabBarScrollVisibility } from "@/hooks/useTabBarScrollVisibility";

export default function EditProfile() {
  const { data, isPending, error, refetch } = authClient.useSession();
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();
  const currentUser = data?.user;
  const colorScheme = useColorScheme();
  const { handleScroll } = useTabBarScrollVisibility();

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await queryClient.invalidateQueries();
    setRefreshing(false);
  }, []);

  const form = useForm<UserForm>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      id: currentUser?.id ?? "",
      name: currentUser?.name ?? "",
      phone: currentUser?.phone ?? "",
      location: currentUser?.location ?? "",
      bio: currentUser?.bio ?? "",
      role: currentUser?.role === "user" ? "user" : "artist",
    },
  });

  const goBack = () => {
    Haptics.impactAsync();
    router.back();
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [16, 9],
      quality: 1,
    });
    Haptics.selectionAsync();

    if (!result.canceled) {
      const selectedUri = result.assets[0].uri;
      authClient.updateUser({ image: selectedUri });
      console.log("Image has been selected");
      refetch();
    }
  };

  const removeImage = () => {
    Haptics.impactAsync();
    authClient.updateUser({ image: null });
    console.log("Image has been removed");
    refetch();
  };

  const handleSubmit = async () => {
    const id = data?.user?.id || "";
    const values = form.getValues();

    Haptics.impactAsync();

    try {
      const result = await apiClient.users.updateprofile[":id"].$put({
        param: { id: id },
        json: {
          id: id,
          name: values.name || "",
          phone: values.phone || "",
          location: values.location || "",
          bio: values.bio || "",
        },
      });

      if (result.status === 200) {
        refetch();
        alert("Profile updated successfully");
      } else {
        alert("Failed to update profile");
      }
    } catch (error) {
      alert("Error updating profile");
      console.error("Failed to update profile:", error);
    }
  };

  if (isPending) {
    return (
      <SafeAreaView className="flex-1" edges={["top"]}>
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#8b5cf6" />
          <Text className="text-gray-600 dark:text-gray-300 mt-4">
            Loading user...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!data?.user) {
    return (
      <SafeAreaView className="flex-1" edges={["top"]}>
        <View className="flex-1 justify-center items-center">
          <Text className="text-gray-600 dark:text-gray-300">
            User not found
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1" edges={["top"]}>
        <View className="flex-1 justify-center items-center">
          <Text className="text-red-500 dark:text-red-400">
            Error loading user: {(error as Error).message}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1" edges={["top"]}>
      <View className="flex-row items-center px-4 py-3 border-b border-gray-200 dark:border-gray-800">
        <Button
          hitSlop={8}
          onPress={goBack}
          pressRetentionOffset={{ top: 16, right: 16, bottom: 16, left: 16 }}
          className="mr-2 h-12 w-12 bg-transparent p-0 active:opacity-50 dark:bg-transparent dark:active:opacity-50"
        >
          <ArrowLeft size={24} color="#8b5cf6" />
        </Button>
        <Text className="text-xl font-semibold flex-1 text-gray-900 dark:text-white">
          Edit Profile
        </Text>
        <Button onPress={handleSubmit}>
          <Check color="white" />
          <Text className="text-white font-semibold">Save</Text>
        </Button>
      </View>
      <KeyboardAwareScrollView
        keyboardDismissMode="interactive"
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 32 }}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        <View className="flex flex-row items-center bg-transparent border-none mt-8">
          <Button
            className="w-32 h-32 bg-secondary-foreground/20 dark:bg-secondary-foreground/80 rounded-2xl ml-5 flex active:opacity-10"
            onPress={pickImage}
          >
            {!data.user?.image && <LucideImagePlus size={34} />}
            {data.user?.image && (
              <View>
                <Image
                  source={{ uri: data.user?.image || undefined }}
                  className="w-32 h-32 rounded-2xl aspect-square"
                />
                <TouchableOpacity
                  onPress={removeImage}
                  className="absolute -top-3.5 -right-3.5 bg-black/50 rounded-full p-3"
                >
                  <X size={20} color="white" />
                </TouchableOpacity>
              </View>
            )}
          </Button>
          <View className="flex-1">
            <View className="mx-8">
              <Text className="text-3xl font-extrabold text-gray-900 dark:text-white">
                {data.user?.name}
              </Text>
              <Text className="text-md text- text-gray-600 dark:text-gray-400 mt-2">
                {data.user?.email}
              </Text>
              <Pressable onPress={pickImage}>
                <View className="flex flex-row items-center gap-3 mt-6 h-10">
                  <Camera
                    size={16}
                    color={colorScheme === "dark" ? "white" : "black"}
                    className=""
                  />
                  <Text className="text-gray-600 dark:text-gray-400 font-semibold active:opacity-50 active:scale-95">
                    Change photo
                  </Text>
                </View>
              </Pressable>
            </View>
          </View>
        </View>
        <Text className="text-gray-600 dark:text-gray-500 px-8 mt-6 mb-2 font-semibold">
          Personal Info
        </Text>
        <View className="flex flex-col px-8">
          <View>
            <Label nativeID="name-label" className=" p-2 dark:text-gray-400">
              Name
            </Label>
            <Controller
              control={form.control}
              name="name"
              render={({ field }) => (
                <View className="flex flex-row items-center gap-1">
                  <User
                    color={colorScheme === "dark" ? "white" : "black"}
                    className=""
                    size={16}
                  />
                  <Input
                    id="name"
                    placeholder="Ludvig Skoeld"
                    className="rounded-sm p-6 h-fit bg-gray-200 dark:bg-gray-900/40 dark:border-secondary-foreground dark:text-white text-black -mx-7"
                    placeholderTextColor="#00000"
                    value={field.value}
                    onChangeText={field.onChange}
                  />
                </View>
              )}
            />
          </View>
          <View>
            <Label nativeID="phone-label" className=" p-2 dark:text-gray-400">
              Phone
            </Label>
            <Controller
              control={form.control}
              name="phone"
              render={({ field }) => (
                <View className="flex flex-row items-center gap-1">
                  <Phone
                    color={colorScheme === "dark" ? "white" : "black"}
                    className=""
                    size={16}
                  />
                  <Input
                    id="phone"
                    placeholder="0701234567"
                    className="rounded-sm p-6 h-fit bg-gray-200 dark:bg-gray-900/40 dark:border-secondary-foreground dark:text-white text-black -mx-7"
                    placeholderTextColor="#00000"
                    value={field.value || ""}
                    onChangeText={field.onChange}
                  />
                </View>
              )}
            />
          </View>
          <View>
            <Label
              nativeID="location-label"
              className=" p-2 dark:text-gray-400"
            >
              Location
            </Label>
            <Controller
              control={form.control}
              name="location"
              render={({ field }) => (
                <View className="flex flex-row items-center gap-1">
                  <MapPin
                    color={colorScheme === "dark" ? "white" : "black"}
                    className=""
                    size={16}
                  />
                  <Input
                    id="location"
                    placeholder="Varberg, Halland"
                    className="rounded-sm p-6 h-fit bg-gray-200 dark:bg-gray-900/40 dark:border-secondary-foreground dark:text-white text-black -mx-7"
                    placeholderTextColor="#00000"
                    value={field.value || ""}
                    onChangeText={field.onChange}
                  />
                </View>
              )}
            />
          </View>
          <View>
            <Label nativeID="bio-label" className=" p-2 dark:text-gray-400">
              Bio
            </Label>
            <Controller
              control={form.control}
              name="bio"
              render={({ field }) => (
                <View className="flex flex-row items-center gap-1">
                  <ListMinus
                    color={colorScheme === "dark" ? "white" : "black"}
                    className=""
                    size={16}
                  />
                  <Input
                    id="bio"
                    placeholder="Tell people about yourself..."
                    className="rounded-sm p-6 h-32 bg-gray-200 dark:bg-gray-900/40 dark:border-secondary-foreground dark:text-white text-black -mx-7 right"
                    placeholderTextColor="#00000"
                    value={field.value || ""}
                    onChangeText={field.onChange}
                  />
                </View>
              )}
            />
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}
