import { Tabs } from 'expo-router';
import { View, Text, Pressable, useColorScheme } from 'react-native';
import { CircleUser, House, ListMusic, MapPinned, Plus } from 'lucide-react-native';

export default function TabsLayout() {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    
    return (
        <Tabs screenOptions={{ 
            headerShown: false,
            sceneStyle: { backgroundColor: 'transparent' },
            tabBarStyle: { 
                position: 'absolute',
                backgroundColor: 'transparent',
                borderTopWidth: 0,
                elevation: 0,
            }
        }} tabBar={({ state, navigation }) => (
            <View style={{ 
                position: 'absolute', 
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
            <Tabs.Screen name="index" />
            <Tabs.Screen name="events" />
            <Tabs.Screen name="create-event" />
            <Tabs.Screen name="map" />
            <Tabs.Screen name="profile" />
        </Tabs>
    )
}
