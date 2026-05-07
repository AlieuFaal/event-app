import { Pressable, Text } from "react-native";

interface FilterPillProps {
  label: string;
  active: boolean;
  onPress: () => void;
}

export function FilterPill({ label, active, onPress }: FilterPillProps) {
  return (
    <Pressable
      onPress={onPress}
      className={`rounded-full border px-3.5 py-1.5 ${active ? "border-transparent bg-[#7c3fdb]" : "border-white/10 bg-[#231529]"}`}
    >
      <Text
        className={`text-xs font-semibold ${active ? "text-white" : "text-[#7c6a8e]"}`}
      >
        {label}
      </Text>
    </Pressable>
  );
}
