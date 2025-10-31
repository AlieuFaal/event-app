import { Tabs, TabList, TabTrigger, TabSlot } from 'expo-router/ui';
import { Text, View } from 'react-native';
import { CircleUser, House, ListMusic, MapPinned, Plus } from 'lucide-react-native';

export default function TabsLayout() {

    return (
        <Tabs className='bg-white'>
            <TabSlot className='' />
            <TabList className='items-center bg-gray-50 p-2 rounded-full shadow-lg drop-shadow-xl w-screen mx-auto scale-90' >
                <TabTrigger name="index" href="/">
                    <View className='items-center active:scale-110 transition-transform duration-100'>
                        <House />
                        <Text className=''>Home</Text>
                    </View>
                </TabTrigger>

                <TabTrigger name="events" href="/events">
                    <View className='items-center active:scale-110 transition-transform duration-100'>
                        <ListMusic />
                        <Text className=''>Events</Text>
                    </View>
                </TabTrigger>

                <TabTrigger name="create-event" href="/create-event">
                    <View className='items-center bg-gray-100 p-4 rounded-full shadow-lg drop-shadow-xl scale-90 active:scale-125 transition-transform duration-200'>
                        <View className='bg-gray-100 rounded-full shadow-lg drop-shadow-xl scale-150 p-2'>
                            <Plus strokeWidth={"2.5"} className=''/>
                        </View>
                    </View>
                </TabTrigger>

                <TabTrigger name="map" href="/map">
                    <View className='items-center active:scale-110 transition-transform duration-100'>
                        <MapPinned />
                        <Text className=''>Map</Text>
                    </View>
                </TabTrigger>

                <TabTrigger name="profile" href="/profile">
                    <View className='items-center active:scale-110 transition-transform duration-100'>
                        <CircleUser />
                        <Text className=''>Profile</Text>
                    </View>
                </TabTrigger>
            </TabList>
        </Tabs >
    )
}
