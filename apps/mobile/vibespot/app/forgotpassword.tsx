import { ForgotPasswordForm } from "@/components/auth-components/forgot-password-form";
import { LinearGradient } from "expo-linear-gradient";
import { View } from "react-native";

export default function ForgotPassword() {
    return (
        <LinearGradient
            colors={['#8b5cf6', '#a78bfa', '#c4b5fd', '#e9d5ff']}
            start={{ x: -1, y: -1 }}
            end={{ x: 1, y: 1 }}
            className="flex-1"
        >
            <View>
                <ForgotPasswordForm />
            </View>
        </LinearGradient>
    )
}   