import { Tabs } from 'expo-router';
import { View, Text, Pressable, useColorScheme } from 'react-native';
import { CircleUser, House, ListMusic, MapPinned, Plus } from 'lucide-react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { SignInForm } from '@/components/auth-components/sign-in-form';
import { EventCard1 } from '@/components/event-components/event-card-1';
import EventCard2 from '@/components/event-components/event-card-2';
import UpcomingEventCard from '@/components/event-components/upcoming-event-card';
import { ForgotPasswordForm } from '@/components/auth-components/forgot-password-form';
import { SignUpForm } from '@/components/auth-components/sign-up-form';
import OnboardingScreenComponent1 from '@/components/onboarding-components/onboardingScreen1';
import { OnboardingScreenComponent2 } from '@/components/onboarding-components/onboardingScreen2';
import Home from '.';
import Events from './events';
import CreateEvents from './create-event';
import Map from './map';
import Profile from './profile';

export default function TabsLayout() {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const swipeTab = createMaterialTopTabNavigator();

    return (
        <>
            {/* <swipeTab.Navigator>
                <swipeTab.Screen name="index" options={{ tabBarLabel: 'Home' }} component={SignInForm}/>
                <swipeTab.Screen name="events" options={{ tabBarLabel: 'Events' }} component={OnboardingScreenComponent2}/>
                <swipeTab.Screen name="create-event" options={{ tabBarLabel: 'Create Event' }} component={ForgotPasswordForm}/>
                <swipeTab.Screen name="map" options={{ tabBarLabel: 'Map' }} component={SignUpForm} />
                <swipeTab.Screen name="profile" options={{ tabBarLabel: 'Profile' }} component={OnboardingScreenComponent1}/>
            </swipeTab.Navigator> */}

            <swipeTab.Navigator screenOptions={{
                // headerShown: false,
                sceneStyle: { backgroundColor: 'transparent' },
                tabBarStyle: {
                    position: 'absolute',
                    backgroundColor: 'transparent',
                    borderTopWidth: 0,
                    elevation: 0,
                    display: 'none',
                }
            }} tabBar={({ state, navigation }) => (
                <View style={{
                    position: 'absolute',
                    zIndex: 10,
                    bottom: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: 'transparent',
                }}>
                    <View className={`flex-row items-center justify-around p-2 rounded-full shadow drop-shadow-xl w-screen mx-auto scale-90 mb-4 border ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-gray-50 border-primary'}`}>
                        {state.routes.map((route, index) => {
                            const isFocused = state.index === index;

                            const onPress = () => {
                                const event = navigation.emit({
                                    type: 'tabPress',
                                    target: route.key,
                                    canPreventDefault: true,
                                });

                                if (!isFocused && !event.defaultPrevented) {
                                    navigation.navigate(route.name);
                                }
                            };

                            if (route.name === 'index') {
                                return (
                                    <Pressable
                                        key={route.key}
                                        onPress={onPress}
                                        className='items-center active:scale-110'
                                    >
                                        <House color={isFocused ? '#8b5cf6' : (isDark ? '#ffffff' : '#6b7280')} />
                                        <Text className={`text-xs mt-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>Home</Text>
                                    </Pressable>
                                );
                            }

                            if (route.name === 'events') {
                                return (
                                    <Pressable
                                        key={route.key}
                                        onPress={onPress}
                                        className='items-center active:scale-110'
                                    >
                                        <ListMusic color={isFocused ? '#8b5cf6' : (isDark ? '#ffffff' : '#6b7280')} />
                                        <Text className={`text-xs mt-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>Events</Text>
                                    </Pressable>
                                );
                            }

                            if (route.name === 'create-event') {
                                return (
                                    <Pressable
                                        key={route.key}
                                        onPress={onPress}
                                        className='items-center bg-white p-4 rounded-full shadow drop-shadow-xl scale-90 active:scale-110 transition-transform duration-200'
                                    >
                                        <View className='bg-gray-100 rounded-full shadow-lg drop-shadow-xl scale-150 p-2'>
                                            <Plus color={isFocused ? '#8b5cf6' : '#000000'} strokeWidth={"2.5"} />
                                        </View>
                                    </Pressable>
                                );
                            }

                            if (route.name === 'map') {
                                return (
                                    <Pressable
                                        key={route.key}
                                        onPress={onPress}
                                        className='items-center active:scale-110'
                                    >
                                        <MapPinned color={isFocused ? '#8b5cf6' : (isDark ? '#ffffff' : '#6b7280')} />
                                        <Text className={`text-xs mt-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>Map</Text>
                                    </Pressable>
                                );
                            }

                            if (route.name === 'profile') {
                                return (
                                    <Pressable
                                        key={route.key}
                                        onPress={onPress}
                                        className='items-center active:scale-110'
                                    >
                                        <CircleUser color={isFocused ? '#8b5cf6' : (isDark ? '#ffffff' : '#6b7280')} />
                                        <Text className={`text-xs mt-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>Profile</Text>
                                    </Pressable>
                                );
                            }

                            return null;
                        })}
                    </View>
                </View>
            )}>
                <swipeTab.Screen name="index" component={Home} />
                <swipeTab.Screen name="events" component={Events} />
                <swipeTab.Screen name="create-event" component={CreateEvents} />
                <swipeTab.Screen name="map" component={Map} />
                <swipeTab.Screen name="profile" component={Profile} />
            </swipeTab.Navigator>
        </>
    )
}
