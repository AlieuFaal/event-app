import { Tabs, useRouter, usePathname } from 'expo-router';
import { View, Text, Pressable, useColorScheme } from 'react-native';
import { CircleUser, House, ListMusic, MapPinned, Plus } from 'lucide-react-native';

export default function TabsLayout() {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const router = useRouter();
    const pathname = usePathname();

    const isHome = pathname === '/(protected)/(tabs)' || pathname === '/' || !pathname.includes('/events') && !pathname.includes('/map') && !pathname.includes('/profile') && !pathname.includes('/create-event');

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                sceneStyle: { backgroundColor: 'transparent' },
                animation: 'shift',
                tabBarStyle: {
                    position: 'absolute',
                    backgroundColor: 'transparent',
                    borderTopWidth: 0,
                    elevation: 0,
                    display: 'none',
                    pointerEvents: 'box-none',
                }
            }}
            tabBar={({ state, navigation }) => {

                return (
                    <View className="absolute z-[999] bottom-0 left-0 right-0 bg-transparent">
                        <View className={`flex-row items-center justify-around p-3 rounded-full shadow drop-shadow-xl w-screen mx-auto scale-90 mb-4 border ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-gray-50 border-primary'}`}>
                            {/* Home Tab */}
                            <Pressable
                                onPress={() => router.push('/(protected)/(tabs)')}
                                className='items-center py-2 px-5 active:scale-95'
                            >
                                <House color={isHome ? '#8b5cf6' : (isDark ? '#ffffff' : '#6b7280')} />
                                <Text className={`text-xs mt-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>Home</Text>
                            </Pressable>

                            {/* Events Tab */}
                            <Pressable
                                onPress={() => router.push('/(protected)/(tabs)/events')}
                                className='items-center py-2 px-5 active:scale-95'
                            >
                                <ListMusic color={pathname.includes('/events') ? '#8b5cf6' : (isDark ? '#ffffff' : '#6b7280')} />
                                <Text className={`text-xs mt-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>Events</Text>
                            </Pressable>

                            {/* Create Event Tab */}
                            <Pressable
                                onPress={() => router.push('/(protected)/(tabs)/create-event')}
                                className='items-center bg-white p-4 rounded-full shadow drop-shadow-xl scale-90 active:scale-[0.85]'
                            >
                                <View className='bg-gray-100 rounded-full shadow-lg drop-shadow-xl scale-150 p-2'>
                                    <Plus color={pathname.includes('/create-event') ? '#8b5cf6' : '#000000'} strokeWidth={"2.5"} />
                                </View>
                            </Pressable>

                            {/* Map Tab */}
                            <Pressable
                                onPress={() => router.push('/(protected)/(tabs)/map')}
                                className='items-center py-2 px-5 active:scale-95'
                            >
                                <MapPinned color={pathname.includes('/map') ? '#8b5cf6' : (isDark ? '#ffffff' : '#6b7280')} />
                                <Text className={`text-xs mt-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>Map</Text>
                            </Pressable>

                            {/* Profile Tab */}
                            <Pressable
                                onPress={() => router.push('/(protected)/(tabs)/profile')}
                                className='items-center py-2 px-5 active:scale-95'
                            >
                                <CircleUser color={pathname.includes('/profile') ? '#8b5cf6' : (isDark ? '#ffffff' : '#6b7280')} />
                                <Text className={`text-xs mt-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>Profile</Text>
                            </Pressable>
                        </View>
                    </View>
                );
            }}
        >
            <Tabs.Screen name="index" options={{ href: '/' }} />
            <Tabs.Screen name="events" />
            <Tabs.Screen name="create-event" />
            <Tabs.Screen name="map" />
            <Tabs.Screen name="profile" />
        </Tabs>
    )
}
