const activityImages = [
  { type: "Generic", img: "icon-generic.png" },
  { type: "Running", img: "icon-running.png" },
  { type: "Trail Running", img: "icon-trail-running.png" },
  { type: "Climbing", img: "icon-climbing.png" },
  { type: "Cycling", img: "icon-cycling.png" },
  { type: "Gym", img: "icon-gym.png" },
  { type: "Hiking", img: "icon-hiking.png" },
  { type: "Swimming", img: "icon-swimming.png" },
];

const intensityStringValues = ["Low", "Medium", "High"];

export const getActivityIcon = (activityType) => {
  const activityFound = activityImages.find((activity) => activity.type === activityType);
  return new URL(`../assets/images/${activityFound ? activityFound.img : activityImages[0].img}`, import.meta.url).href;
};

export const getIntensityString = (value) => {
  const idx = value - 1;
  return idx < 0 || idx >= intensityStringValues.length ? "-" : intensityStringValues[idx];
};

export const getDurationString = (durationMs) => {
  const seconds = Math.floor((durationMs / 1000) % 60);
  const minutes = Math.floor((durationMs / (1000 * 60)) % 60);
  const hours = Math.floor((durationMs / (1000 * 60 * 60)) % 24);
  const days = Math.floor(durationMs / (1000 * 60 * 60 * 24));

  const result = [];
  if (days > 0) result.push(days + (days > 1 ? "days" : "day") + " ");
  if (hours > 0) result.push(hours + "h ");
  if (minutes > 0) result.push(minutes + "m ");
  if (seconds > 0) result.push(seconds + "m ");

  return result;
};

export const getDurationStringInHours = (durationMs) => {
  const hours = durationMs / (1000 * 60 * 60);
  const correctedToNearestHalves = Math.round(hours * 2) / 2;
  return correctedToNearestHalves + (correctedToNearestHalves > 1 ? " hours" : " hour");
};

export const getDurationInMs = (hours, minutes, seconds) => {
  const hoursToMs = hours * 1000 * 60 * 60;
  const minutesToMs = minutes * 1000 * 60;
  const secondsToMs = seconds * 1000;
  return hoursToMs + minutesToMs + secondsToMs;
};

export const getDurationArray = (durationMs) => {
  const seconds = Math.floor((durationMs / 1000) % 60);
  const minutes = Math.floor((durationMs / (1000 * 60)) % 60);
  const hours = Math.floor(durationMs / (1000 * 60 * 60));
  return [hours, minutes, seconds];
};
