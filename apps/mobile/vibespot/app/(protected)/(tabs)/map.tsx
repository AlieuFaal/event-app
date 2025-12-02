import { useGetEvent } from "@/hooks/useGetEvent";
import type { Event } from "@vibespot/validation/event";
import { Text, View, StyleSheet, ActivityIndicator } from "react-native";
import MapView, { Marker } from 'react-native-maps';
import { SafeAreaView } from "react-native-safe-area-context";

export default function Map() {
  const { isPending, error, data } = useGetEvent();

  if (isPending) {
    return (
      <SafeAreaView className="flex-1 bg-transparent" edges={['top']}>
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="fuchsia" />
          <Text className="text-gray-600 dark:text-gray-300">Loading events...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!data) {
    return (
      <SafeAreaView className="flex-1 bg-transparent" edges={['top']}>
        <View className="flex-1 justify-center items-center">
          <Text className="text-gray-600 dark:text-gray-300">No events available.</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-transparent" edges={['top']}>
        <View className="flex-1 justify-center items-center">
          <Text className="text-red-500 dark:text-red-400">Error fetching events: {(error as Error).message}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View className="flex-1 w-full h-64 mx-auto border rounded-2xl shadow overflow-hidden -mt-3">
      <MapView
        style={styles.map}
      // region={{
      //   latitude: selectedLocation.lat,
      //   longitude: selectedLocation.lng,
      //   latitudeDelta: 0.01,
      //   longitudeDelta: 0.01,
      // }}
      >
        {data?.map((event: Event) => (
          <Marker
            key={event.id}
            title={event.title}
            description={event.description}
            titleVisibility="adaptive"
            coordinate={{
              latitude: parseFloat(event.latitude),
              longitude: parseFloat(event.longitude),
            }}
            pinColor="purple"
          />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});