export const customRepeatEndDate = (
  startDate: Date,
  repeat: string,
  customEndDate?: Date | null
) => {
  if (customEndDate) {
    return customEndDate;
  }

  const endDate = new Date(startDate);
  switch (repeat) {
    case "daily":
      endDate.setFullYear(endDate.getFullYear() + 1);
      break;
    case "weekly":
      endDate.setFullYear(endDate.getFullYear() + 1);
      break;
    case "monthly":
      endDate.setFullYear(endDate.getFullYear() + 2);
      break;
    case "yearly":
      endDate.setFullYear(endDate.getFullYear() + 10);
      break;
  }
  return endDate;
};

export const addInterval = (date: Date, repeat: string) => {
  const newDate = new Date(date);
  switch (repeat) {
    case "daily":
      newDate.setDate(newDate.getDate() + 1);
      break;
    case "weekly":
      newDate.setDate(newDate.getDate() + 7);
      break;
    case "monthly":
      newDate.setMonth(newDate.getMonth() + 1);
      break;
    case "yearly":
      newDate.setFullYear(newDate.getFullYear() + 1);
      break;
  }
  return newDate;
};
