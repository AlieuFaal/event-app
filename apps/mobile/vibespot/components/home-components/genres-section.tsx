import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { GenreChip } from "./genre-chip";

type GenresSectionProps = {
  genres: string[];
  isDark: boolean;
};

export function GenresSection({ genres, isDark }: GenresSectionProps) {
  const router = useRouter();

  if (genres.length === 0) return null;

  return (
    <View className="gap-4 px-5">
      <Text
        className={`text-[26px] font-bold ${isDark ? "text-white" : "text-gray-950"}`}
      >
        Explore genres
      </Text>
      <View className="flex-row flex-wrap gap-3">
        {genres.map((genre) => (
          <Pressable
            accessibilityLabel={`Show ${genre} events`}
            accessibilityRole="button"
            key={genre}
            onPress={() =>
              router.navigate({
                pathname: "/(protected)/(tabs)/events",
                params: { filter: `genre:${genre}` },
              })
            }
          >
            <GenreChip genre={genre} isDark={isDark} />
          </Pressable>
        ))}
      </View>
    </View>
  );
}
