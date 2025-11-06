import { View } from "react-native";
import { SignUpForm } from "@/components/auth-components/sign-up-form";
import { LinearGradient } from "expo-linear-gradient";

export default function SignUp() {
    return (
        <LinearGradient
            colors={['#8b5cf6', '#a78bfa', '#c4b5fd', '#e9d5ff']}
            start={{ x: -1, y: -1 }}
            end={{ x: 1, y: 1 }}
            className="flex-1"
        >
            <View>
                <SignUpForm />
            </View>
        </LinearGradient>
    );
}