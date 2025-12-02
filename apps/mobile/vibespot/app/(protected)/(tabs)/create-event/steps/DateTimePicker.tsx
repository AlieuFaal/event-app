import { set, z } from "zod";
import { eventInsertSchema } from "@vibespot/validation";
import type { UseFormReturn } from "react-hook-form";
import { View, Text, useColorScheme, Modal, Pressable, TouchableOpacity } from "react-native";
import RNDateTimePicker from '@react-native-community/datetimepicker';
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, CalendarSync, CalendarX, Clock, LucideRepeat2 } from "lucide-react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { Picker } from '@react-native-picker/picker';

interface Props {
    form: UseFormReturn<z.infer<typeof eventInsertSchema>>;
}

type ModalType = 'start' | 'end' | null;
type RepeatOption = 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';

export function DateTimePicker({ form }: Props) {
    const [modalVisible, setModalVisible] = useState<ModalType>(null);
    const [repeatModalVisible, setRepeatModalVisible] = useState<boolean>(false);
    const [tempDate, setTempDate] = useState<Date>(new Date());
    const [repeatEndDate, setRepeatEndDate] = useState<Date>(new Date());
    const [repeatOption, setRepeatOption] = useState<RepeatOption>('none');

    const startDate = form.watch("startDate");
    const endDate = form.watch("endDate");
    const theme = useColorScheme();
    const isDarkMode = theme === "dark";

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

    const handleOpenRepeatModal = () => {
        setRepeatModalVisible(true);
        setRepeatOption(form.getValues("repeat") || 'none');
    };

    const handleConfirmDate = () => {
        if (modalVisible === 'start') {
            form.setValue("startDate", tempDate);
            console.log("Updated start date:", tempDate);
        } else if (modalVisible === 'end') {
            form.setValue("endDate", tempDate);
            console.log("Updated end date:", tempDate);
        }
        setModalVisible(null);
    };

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
                        <CalendarX size={24} color="purple" />
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
                    onPress={() => handleOpenRepeatModal()}
                    className="bg-secondary-foreground dark:bg-secondary-foreground/40 rounded-full p-6 flex-row items-center justify-between active:opacity-70"
                >
                    <View className="flex-row items-center gap-3">
                        <CalendarSync size={24} color="purple" />
                        <View>
                            <Text className="text-secondary font-semibold text-sm">Repeat Event</Text>
                            <Text className="text-white text-lg font-medium mt-1">
                                {repeatOption === 'none' ? 'Never' : repeatOption.charAt(0).toUpperCase() + repeatOption.slice(1)}
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
                                    <Text className="text-black dark:text-white text-xl font-bold">
                                        {modalVisible === 'start' ? 'Select Start Date' : 'Select End Date'}
                                    </Text>
                                    <TouchableOpacity onPress={() => setModalVisible(null)}>
                                        <Text className="text-black dark:text-secondary text-lg">Cancel</Text>
                                    </TouchableOpacity>
                                </View>

                                <Text className="text-black dark:text-white/70 text-center mb-4">
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
                                    className="mt-6 "
                                    onPress={handleConfirmDate}
                                >
                                    <Text className="text-white dark:text-black">Confirm {modalVisible === 'start' ? 'Start' : 'End'} Date</Text>
                                </Button>
                            </View>
                        </LinearGradient>
                    </Pressable>
                </Pressable>
            </Modal>

            <Modal
                animationType="fade"
                transparent={true}
                visible={repeatModalVisible !== false}
                onRequestClose={() => setRepeatModalVisible(false)}>
                <Pressable
                    className="flex-1 justify-end"
                    style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
                    onPress={() => setRepeatModalVisible(false)}
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
                                    <Text className="text-black dark:text-white text-xl font-bold">
                                        {"Select Repeat Option"}
                                    </Text>
                                    <TouchableOpacity onPress={() => setRepeatModalVisible(false)}>
                                        <Text className="text-black dark:text-secondary text-lg">Cancel</Text>
                                    </TouchableOpacity>
                                </View>

                                <Text className="text-black dark:text-white text-center mb-4">
                                    How often should this event repeat?
                                </Text>

                                <View className="bg-secondary-foreground/20 rounded-2xl overflow-hidden" style={{ height: 150 }}>
                                    <Picker
                                        selectedValue={repeatOption}
                                        onValueChange={(value) => {
                                            setRepeatOption(value as RepeatOption);
                                            form.setValue("repeat", value as RepeatOption);
                                            console.log("Form values:", form.getValues());
                                        }}
                                        style={{ color: isDarkMode ? '#ffffff' : '#000000', height: 150 }}
                                        dropdownIconColor={isDarkMode ? '#a855f7' : '#7c3aed'}
                                        itemStyle={{ height: 150 }}
                                    >
                                        <Picker.Item label="Never" value="none" />
                                        <Picker.Item label="Daily" value="daily" />
                                        <Picker.Item label="Weekly" value="weekly" />
                                        <Picker.Item label="Monthly" value="monthly" />
                                        <Picker.Item label="Yearly" value="yearly" />
                                    </Picker>
                                </View>

                                {repeatOption !== 'none' && (
                                    <View className="mt-6">
                                        <Text className="text-black dark:text-white/70 text-center mb-4">
                                            When should the repetition end?
                                        </Text>
                                        <RNDateTimePicker
                                            value={repeatEndDate}
                                            mode="datetime"
                                            locale="sv"
                                            themeVariant={isDarkMode ? "dark" : "light"}
                                            display="inline"
                                            minimumDate={endDate ? new Date(endDate) : new Date()}
                                            maximumDate={new Date(new Date().setFullYear(new Date().getFullYear() + 10))}
                                            onChange={(event, selectedDate) => {
                                                if (selectedDate) {
                                                    setRepeatEndDate(selectedDate);
                                                }
                                            }}
                                        />
                                    </View>
                                )}

                                <Button
                                    className="mt-6"
                                    onPress={() => {
                                        setRepeatModalVisible(false)
                                        if (form.getValues('repeat') === 'none') {
                                            form.setValue("repeatEndDate", null);
                                            console.log(form.getValues());
                                        }
                                        else {
                                            form.setValue("repeatEndDate", repeatEndDate);
                                        }
                                        console.log("Selected repeat end date:", repeatEndDate);
                                        console.log("Form values:", form.getValues());
                                    }}
                                >
                                    <Text className="text-white dark:text-black">Confirm Repeat Option</Text>
                                </Button>

                            </View>
                        </LinearGradient>
                    </Pressable>
                </Pressable>
            </Modal>
        </View>
    );
}