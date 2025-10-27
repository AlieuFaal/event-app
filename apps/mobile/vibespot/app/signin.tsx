import { useState } from "react"; 
import { View, TextInput, Button } from "react-native";
import { authClient } from "@/lib/auth-client";

export default function SignIn() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        await authClient.signIn.email({
            email,
            password,
        })
        .then((response) => {
            console.log("Login successful:", response);
        })
        .catch((error) => {
            console.error("Login failed:", error);
        }); 
    };

    return (
        <View>
            <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
            />
            <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
            />
            <Button title="Login" onPress={handleLogin} />
        </View>
    );
}