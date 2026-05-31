export const profileImages = [
  { img: "icon-generic.png" },
  { img: "icon-running.png" },
  { img: "icon-trail-running.png" },
  { img: "icon-climbing.png" },
  { img: "icon-cycling.png" },
  { img: "icon-gym.png" },
  { img: "icon-hiking.png" },
  { img: "icon-swimming.png" },
];

export const getProfileIcon = (iconId) => {
  const idx = iconId && !(iconId < 0 || iconId >= profileImages.length) ? iconId : 0;
  return new URL(`../assets/images/${profileImages[idx].img}`, import.meta.url).href;
};
