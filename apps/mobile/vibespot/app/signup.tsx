import { useState } from "react";
import { View, TextInput, Button } from "react-native";
import { authClient } from "@/lib/auth-client";
import { SignUpForm } from "@/components/auth-components/sign-up-form";

export default function SignUp() {

    return (
        <View>
            <SignUpForm />
        </View>
    );
}