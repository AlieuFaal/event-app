import { SignInForm } from "@/components/auth-components/sign-in-form";
import { LinearGradient } from 'expo-linear-gradient';

export default function HomeScreen() {
  return (
    <LinearGradient
      colors={['#8b5cf6', '#a78bfa', '#c4b5fd', '#e9d5ff']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className="flex-1"
    >
      <SignInForm />
    </LinearGradient>
  );
}
