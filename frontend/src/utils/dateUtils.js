export const formatForDateTimeLocal = (isoString) => {
  const date = new Date(isoString);

  // Adjust for local timezone offset (in minutes)
  const offset = date.getTimezoneOffset() * 60000;
  const localISOTime = new Date(date.getTime() - offset).toISOString();

  // Slice to "YYYY-MM-DDTHH:mm" (16 characters)
  return localISOTime.slice(0, 16);
};

export const getDateAndTime = (localISOString) => {
  return localISOString.split("T");
};

export const getDateLocal = (dateObj) => {
  const offset = dateObj.getTimezoneOffset() * 60000;
  const localISOTime = new Date(dateObj.getTime() - offset).toISOString();
  return localISOTime.slice(0, 10);
};

export const getWeekDays = () => {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Sunday
  const monday = new Date(today);
  monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));

  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    days.push(getDateLocal(d)); // returns "YYYY-MM-DD"
  }
  return days;
};
