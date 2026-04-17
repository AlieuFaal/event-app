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
import { LocationPicker } from "./steps/LocationPicker";
import { DateTimePicker } from "./steps/DateTimePicker";
import { ImageUpload } from "./steps/ImageUpload";
import { apiClient } from "@/lib/api-client";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/app/_layout";
import { EventCreationsSuccessful } from "./steps/EventCreationSuccessful";
import * as Crypto from 'expo-crypto';

export default function CreateEvents() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const { data: session } = authClient.useSession();

  const getDefaultStartDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(18, 0, 0, 0);
    return tomorrow.toISOString();
  }

  const getDefaultEndDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(22, 30, 0, 0);
    return tomorrow.toISOString();
  }

  const form = useForm<z.infer<typeof eventInsertSchema>>({
    mode: "onBlur",
    resolver: zodResolver(eventInsertSchema),
    defaultValues: {
      id: undefined,
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
      imageUrl: null,
    }
  })

  const postEvent = useMutation({
    mutationFn: async (data: z.infer<typeof eventInsertSchema>) => {
      setIsLoading(true);
      const response = await apiClient.events["events"].$post({ json: data });
      console.log("API response status:", response.status);

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Failed to create event: ${errorBody}`);
      }

      const result = await response.json();
      console.log("API success response:", result);
      return result;
    },
    onSuccess: (data) => {
      console.log("Mutation succeeded:", data);
      queryClient.invalidateQueries();
      setIsLoading(false);
    },
    onError: (error) => {
      console.error('Error creating event:', error);
    }
  })

  const onSubmit = async (values: z.infer<typeof eventInsertSchema>) => {
    try {
      const dataToSend = {
        ...values,
        userId: session?.user.id,
        id: Crypto.randomUUID(),
        startDate: values.startDate,
        endDate: values.endDate,
      };

      if (dataToSend.latitude === "" || dataToSend.longitude === "") {
        console.error("Please select a valid address from the suggestions.");
        return;
      }
      console.log("Submitting event with data:", dataToSend);

      await postEvent.mutateAsync(dataToSend);

      console.log("Event created successfully:", dataToSend);
      setCurrentStep(6);
    } catch (error) {
      console.error("Error submitting event:", error);
      if (!session) {
        console.error("User is not authenticated.");
        return;
      }
      console.error("Failed to create event for user:", session.user.name);
    }
  }

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return "Select Genre";
      case 2: return "Event Details";
      case 3: return "Location";
      case 4: return "Date & Time";
      case 5: return "Event Image";
      case 6: return "Success";
      default: return "";
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-transparent" edges={['top']}>
      <View className="flex-1 p-4 bg-transparent">
        {currentStep !== 6 && (
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
                  onSubmit={form.handleSubmit(onSubmit, (errors) => {
                    console.log("Form validation errors:", errors);
                  })}
                />
              </>
            ) : (
              <NavigationButtons
                currentStep={currentStep}
                isLoading={isLoading}
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
                  }
                  else if (currentStep === 3) {
                    form.trigger(['address', 'latitude', 'longitude']).then(isValid => {
                      if (isValid) {
                        setCurrentStep(s => s + 1);
                        console.log("Current form values:", form.getValues());
                        console.log("Step:", currentStep + 1);
                      } else {
                        console.log("Validation failed. Cannot proceed to next step.");
                      }
                    });
                  }
                  else if (currentStep === 4) {
                    form.trigger(['startDate', 'endDate']).then(isValid => {
                      if (isValid) {
                        setCurrentStep(s => s + 1);
                        console.log("Current form values:", form.getValues());
                        console.log("Step:", currentStep + 1);
                      } else {
                        console.log("Validation failed. Cannot proceed to next step.");
                      }
                    });
                  }
                  else {
                    setCurrentStep(s => s + 1);
                  }
                }}
                onBack={() => {
                  setCurrentStep(s => s - 1);
                  console.log("Step:", currentStep - 1);
                }}
                onSubmit={form.handleSubmit(onSubmit, (errors) => {
                  console.log("Form validation errors:", errors);
                })}
                stepTitle={getStepTitle()}
              />
            )}
          </View>
        )}

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, backgroundColor: 'transparent' }} keyboardDismissMode="interactive">
          {currentStep === 1 && <GenreSelection form={form} />}
          {currentStep === 2 && <EventDetails form={form} />}
          {currentStep === 3 && <LocationPicker form={form} />}
          {currentStep === 4 && <DateTimePicker form={form} />}
          {currentStep === 5 && <ImageUpload form={form} />}
          {currentStep === 6 && <EventCreationsSuccessful />}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
