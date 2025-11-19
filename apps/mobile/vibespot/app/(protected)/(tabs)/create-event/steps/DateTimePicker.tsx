import { z } from "zod";
import { eventInsertSchema } from "@vibespot/validation";
import type { UseFormReturn } from "react-hook-form";
import { View, Text, useColorScheme, Modal, Pressable, TouchableOpacity } from "react-native";
import RNDateTimePicker from '@react-native-community/datetimepicker';
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "expo-router";
import { Calendar, Clock } from "lucide-react-native";
import { LinearGradient } from 'expo-linear-gradient';

interface Props {
    form: UseFormReturn<z.infer<typeof eventInsertSchema>>;
}

type ModalType = 'start' | 'end' | 'repeat' | null;

export function DateTimePicker({ form }: Props) {
    const [modalVisible, setModalVisible] = useState<ModalType>(null);
    const [tempDate, setTempDate] = useState<Date>(new Date());
    const startDate = form.watch("startDate");
    const endDate = form.watch("endDate");
    const theme = useColorScheme();
    const isDarkMode = theme === "dark";
    const router = useRouter();

    const formatDateTime = (date: Date | null) => {
        if (!date) return "Select date & time";
        return new Date(date).toLocaleString('sv-SE', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const handleOpenModal = (type: ModalType) => {
        if (type === 'start') {
            setTempDate(startDate ? new Date(startDate) : new Date());
        } else if (type === 'end') {
            setTempDate(endDate ? new Date(endDate) : (startDate ? new Date(startDate) : new Date()));
        }
        setModalVisible(type);
    };

    const handleConfirmDate = () => {
        if (modalVisible === 'start') {
            form.setValue("startDate", tempDate);
        } else if (modalVisible === 'end') {
            form.setValue("endDate", tempDate);
        }
        setModalVisible(null);
    };

    const canProceed = startDate && endDate;

    const lightModeColors: [string, string, string] = ['#f9f8fc', '#f5f3ff', '#faf8ff'];
    const darkModeColors: [string, string, string] = ['#1a1525', '#1e1829', '#221b2e'];

    return (
        <View className="flex-1">
            <View className="">
                <CardHeader className="flex flex-col items-center mt-5 gap-2">
                    <CardTitle className="text-5xl text-secondary-foreground dark:text-white text-center">When&apos;s the event?</CardTitle>
                    <CardDescription className="text-secondary-foreground dark:text-white text-xl text-center mt-2">
                        Pick a time & date for your event.
                    </CardDescription>
                </CardHeader>
            </View>

            <View className=" mt-10 gap-4">
                <TouchableOpacity
                    onPress={() => handleOpenModal('start')}
                    className="bg-secondary-foreground dark:bg-secondary-foreground/40 rounded-full p-6 flex-row items-center justify-between active:opacity-70"
                >
                    <View className="flex-row items-center gap-3">
                        <Calendar size={24} color="purple" />
                        <View>
                            <Text className="text-secondary font-semibold text-sm">Start Date</Text>
                            <Text className="text-white text-lg font-medium mt-1">
                                {formatDateTime(startDate)}
                            </Text>
                        </View>
                    </View>
                    <Clock size={20} color="#9ca3af" />
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => handleOpenModal('end')}
                    className="bg-secondary-foreground dark:bg-secondary-foreground/40 rounded-full p-6 flex-row items-center justify-between active:opacity-70"
                >
                    <View className="flex-row items-center gap-3">
                        <Calendar size={24} color="purple" />
                        <View>
                            <Text className="text-secondary font-semibold text-sm">End Date</Text>
                            <Text className="text-white text-lg font-medium mt-1">
                                {formatDateTime(endDate)}
                            </Text>
                        </View>
                    </View>
                    <Clock size={20} color="#9ca3af" />
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => handleOpenModal('end')}
                    className="bg-secondary-foreground dark:bg-secondary-foreground/40 rounded-full p-6 flex-row items-center justify-between active:opacity-70"
                >
                    <View className="flex-row items-center gap-3">
                        <Calendar size={24} color="purple" />
                        <View>
                            <Text className="text-secondary font-semibold text-sm">Repeat Event</Text>
                            <Text className="text-white text-lg font-medium mt-1">
                                {formatDateTime(endDate)}
                            </Text>
                        </View>
                    </View>
                    <Clock size={20} color="#9ca3af" />
                </TouchableOpacity>
            </View>

            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible !== null}
                onRequestClose={() => setModalVisible(null)}
            >
                <Pressable
                    className="flex-1 justify-end"
                    style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
                    onPress={() => setModalVisible(null)}
                >
                    <Pressable onPress={(e) => e.stopPropagation()}>
                        <LinearGradient
                            colors={isDarkMode ? darkModeColors : lightModeColors}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={{ borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingBottom: 40 }}
                        >
                            <View className="p-6">
                                <View className="flex-row justify-between items-center mb-4">
                                    <Text className="text-white text-xl font-bold">
                                        {modalVisible === 'start' ? 'Select Start Date' : 'Select End Date'}
                                    </Text>
                                    <TouchableOpacity onPress={() => setModalVisible(null)}>
                                        <Text className="text-secondary text-lg">Cancel</Text>
                                    </TouchableOpacity>
                                </View>

                                <Text className="text-white/70 text-center mb-4">
                                    {modalVisible === 'start'
                                        ? 'Please pick a start date for your event:'
                                        : 'Please pick an end date for your event:'}
                                </Text>

                                <RNDateTimePicker
                                    value={tempDate}
                                    mode="datetime"
                                    locale="sv"
                                    is24Hour={true}
                                    themeVariant={isDarkMode ? "dark" : "light"}
                                    display="spinner"
                                    minimumDate={modalVisible === 'end' && startDate ? new Date(startDate) : new Date()}
                                    onChange={(event, selectedDate) => {
                                        if (selectedDate) {
                                            setTempDate(selectedDate);
                                        }
                                    }}
                                />

                                <Button
                                    className="mt-6"
                                    onPress={handleConfirmDate}
                                >
                                    <Text>Confirm {modalVisible === 'start' ? 'Start' : 'End'} Date</Text>
                                </Button>
                            </View>
                        </LinearGradient>
                    </Pressable>
                </Pressable>
            </Modal>

            <Button
                className="mt-auto mx-5 mb-5"
                onPress={() => {
                    if (canProceed) {
                        router.navigate("/(protected)/(tabs)/create-event/steps/ImageUpload");
                    }
                }}
                disabled={!canProceed}
            >
                <Text>Continue to Image Upload</Text>
            </Button>
        </View>
    );
}