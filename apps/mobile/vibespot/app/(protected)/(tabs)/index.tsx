import { useState } from "react";
import { TextInput, View, Text } from "react-native";
import { SignInForm } from "@/components/auth-components/sign-in-form";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

export default function Home() {

  return (
    <View className="h-screen bg-white">
      <Text className="text-3xl text-center">Home</Text>
    </View>
  );
}
