import { Text, View } from "react-native";

type GenreChipProps = {
  genre: string;
  isDark: boolean;
};

export function GenreChip({ genre, isDark }: GenreChipProps) {
  return (
    <View
      className={`flex-row items-center gap-2 rounded-full border px-4 py-2.5 ${
        isDark ? "border-white/10 bg-[#21152e]" : "border-violet-100 bg-white"
      }`}
    >
      <View className="h-2.5 w-2.5 rounded-full bg-[#8b5cf6]" />
      <Text
        className={`text-[15px] font-bold ${isDark ? "text-[#ddcff1]" : "text-gray-700"}`}
      >
        {genre}
      </Text>
    </View>
  );
}
