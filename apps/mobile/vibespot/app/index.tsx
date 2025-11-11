import { SignInForm } from "@/components/auth-components/sign-in-form";
import { LinearGradient } from 'expo-linear-gradient';

export default function HomeScreen() {
  return (
    <LinearGradient
      colors={[ 'blue', 'fuchsia']}
      start={{ x: 0, y: 0.5 }}
      end={{ x: 1.2, y: 0.5 }}
      style={{ flex: 1 }}
    >
      <SignInForm />
    </LinearGradient>
  );
}
