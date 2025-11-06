import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';
import { View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

export function ForgotPasswordForm() {
  function onSubmit() {

  }

  return (
    <View className="gap-6">
      <Card className="border-border/0 bg-white/90 dark:bg-gray-900/95 backdrop-blur-xl sm:border-border shadow-none sm:shadow-sm sm:shadow-black/5 h-screen rounded-none">
        <KeyboardAwareScrollView disableScrollOnKeyboardHide={true} keyboardDismissMode='interactive' contentContainerStyle={{ flexGrow: 1 }}>
          <CardHeader className='mt-56'>
            <CardTitle className="text-center text-xl sm:text-left text-gray-900 dark:text-white">Forgot password?</CardTitle>
            <CardDescription className="text-center sm:text-left">
              Enter your email to reset your password
            </CardDescription>
          </CardHeader>
          <CardContent className="gap-6">
            <View className="gap-6">
              <View className="gap-1.5">
                <Input
                  id="email"
                  placeholder="E-mail"
                  keyboardType="email-address"
                  autoComplete="email"
                  autoCapitalize="none"
                  returnKeyType="send"
                  onSubmitEditing={onSubmit}
                  className='bg-white dark:bg-white text-gray-900 dark:text-gray-900'
                  placeholderTextColor="#6b7280"
                />
              </View>
              <Button className="w-full" onPress={onSubmit}>
                <Text>Reset your password</Text>
              </Button>
            </View>
          </CardContent>
        </KeyboardAwareScrollView>
      </Card>
    </View>
  );
}