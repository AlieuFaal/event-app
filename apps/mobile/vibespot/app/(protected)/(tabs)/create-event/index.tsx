import * as React from "react"
import { z } from "zod";
import { useState } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { eventInsertSchema } from "@vibespot/validation";
import { GenreSelection } from "./steps/GenreSelection";
import { EventDetails } from "./steps/EventDetails";
import { ScrollView } from "react-native-gesture-handler";
import { NavigationButtons } from "@/components/event-creation-components/NavigationButtons";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "expo-router";
import { LocationPicker } from "./steps/LocationPicker";

export default function CreateEvents() {
  const [currentStep, setCurrentStep] = useState(4);

  const router = useRouter();

  const { data: session } = authClient.useSession();

  const getDefaultStartDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(18, 0, 0, 0);
    return tomorrow;
  }

  const getDefaultEndDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(22, 30, 0, 0);
    return tomorrow;
  }

  const form = useForm<z.infer<typeof eventInsertSchema>>({
    mode: "onBlur",
    resolver: zodResolver(eventInsertSchema),
    defaultValues: {
      id: "",
      title: "",
      description: "",
      address: "",
      venue: "",
      latitude: "",
      longitude: "",
      color: "Blue",
      genre: "Indie",
      startDate: getDefaultStartDate(),
      endDate: getDefaultEndDate(),
    }
  })

  const onSubmit = async (values: z.infer<typeof eventInsertSchema>) => {
    try {
      const dataToSend = {
        ...values,
        userId: session?.user.id,
        id: crypto.randomUUID()
      };

      if (dataToSend.latitude === "" || dataToSend.longitude === "") {
        console.error("Please select a valid address from the suggestions.");
        return;
      }

      // await repeatEventsFn({
      //   data: dataToSend
      // });

      console.log("Event created successfully:", dataToSend);
      router.navigate({ pathname: '/(protected)/(tabs)/events' });
    } catch (error) {
      console.error("Error submitting event:", error);
      if (!session) {
        console.error("User is not authenticated.");
        return;
      }
      console.error("Failed to create event for user:", session.user.id);
    }
  }

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return "Select Genre";
      case 2: return "Event Details";
      case 3: return "Location";
      case 4: return "Date & Time";
      case 5: return "Event Image";
      default: return "";
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-transparent" edges={['top']}>
      <View className="flex-1 p-4 bg-transparent">
        <View className="flex-row items-center justify-between mb-6">
          {currentStep === 1 ? (
            <>
              <Text className="text-3xl font-bold text-gray-900 dark:text-white">
                Create Event
              </Text>
              <NavigationButtons
                currentStep={currentStep}
                totalSteps={5}
                onNext={() => {
                  form.trigger('genre').then(isValid => {
                    if (isValid) {
                      setCurrentStep(s => s + 1);
                      console.log("Current form values:", form.getValues());
                      console.log("Step:", currentStep + 1);
                    } else {
                      console.log("Validation failed. Cannot proceed to next step.");
                    }
                  });
                }}
                onBack={() => setCurrentStep(s => s - 1)}
                onSubmit={form.handleSubmit(onSubmit)}
              />
            </>
          ) : (
            <NavigationButtons
              currentStep={currentStep}
              totalSteps={5}
              onNext={() => {
                if (currentStep === 2) {
                  form.trigger(['title', 'description', 'venue']).then(isValid => {
                    if (isValid) {
                      setCurrentStep(s => s + 1);
                      console.log("Current form values:", form.getValues());
                      console.log("Step:", currentStep + 1);
                    } else {
                      console.log("Validation failed. Cannot proceed to next step.");
                    }
                  });
                } else {
                  setCurrentStep(s => s + 1);
                }
              }}
              onBack={() => {
                setCurrentStep(s => s - 1);
                console.log("Step:", currentStep - 1);
              }}
              onSubmit={form.handleSubmit(onSubmit)}
              stepTitle={getStepTitle()}
            />
          )}
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, backgroundColor: 'transparent' }} keyboardDismissMode="interactive">
          {currentStep === 1 && <GenreSelection form={form} />}
          {currentStep === 2 && <EventDetails form={form} />}
          {currentStep === 3 && <LocationPicker form={form} />}
          {/* {currentStep === 4 && <DateTimePicker form={form} />}
        {currentStep === 5 && <ImageUpload form={form} />} */}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}