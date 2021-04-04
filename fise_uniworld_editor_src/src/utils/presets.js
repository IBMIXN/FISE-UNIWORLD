export const backgrounds = [
  {
    value: 'Default',
    label: 'Default',
    img: require(`../assets/img/backgrounds/Default.jpg`).default,
  },
  {
    value: 'UclMainQuad',
    label: 'UCL Main Quad',
    img: require(`../assets/img/backgrounds/UclMainQuad.jpg`).default,
  },
  {
    value: 'UclPrintRoomCafe',
    label: 'UCL Print Room Cafe',
    img: require(`../assets/img/backgrounds/UclPrintRoomCafe.jpg`).default,
  },
  {
    value: 'Hall',
    label: 'Hall',
    img: require(`../assets/img/backgrounds/Hall.jpg`).default,
  },
  {
    value: 'TimesSquareNewYork',
    label: 'Times Square New York',
    img: require(`../assets/img/backgrounds/TimesSquareNewYork.jpg`).default,
  },
  {
    value: 'RoyalOperaHouse',
    label: 'Royal Opera House',
    img: require(`../assets/img/backgrounds/RoyalOperaHouse.jpg`).default,
  },
  {
    value: 'SydneyOperaHouseOutside',
    label: 'Sydney Opera House Outside',
    img: require(`../assets/img/backgrounds/SydneyOperaHouseOutside.jpg`)
      .default,
  },
  {
    value: 'BritishLibraryOutside',
    label: 'British Library Outside',
    img: require(`../assets/img/backgrounds/BritishLibraryOutside.jpg`).default,
  },
  {
    value: 'BritishMuseumOutside',
    label: 'British Museum Outside',
    img: require(`../assets/img/backgrounds/BritishMuseumOutside.jpg`).default,
  },
  {
    value: 'EiffelTowerSunset',
    label: 'Eiffel Tower Sunset',
    img: require(`../assets/img/backgrounds/EiffelTowerSunset.jpg`).default,
  },
  {
    value: 'https://uniworldstorage.blob.core.windows.net/videos/Plaza.mp4',
    label: 'Plaza Video',
    img: require(`../assets/img/backgrounds/videos/Plaza.png`).default,
  },
  {
    value: 'https://uniworldstorage.blob.core.windows.net/videos/UclTour.mp4',
    label: 'UCL Tour Video',
    img: require(`../assets/img/backgrounds/videos/UclTour.png`).default,
  },
  {
    value:
      'https://uniworldstorage.blob.core.windows.net/videos/Waterfront.mp4',
    label: 'Waterfront Video',
    img: require(`../assets/img/backgrounds/videos/Waterfront.png`).default,
  },
];

export const scenes = [
  {
    value: 'Default',
    label: 'Default',
    img: require(`../assets/img/scenes/Default.png`).default,
  },
  {
    value: 'ConferenceHall',
    label: 'Conference Hall',
    img: require(`../assets/img/scenes/ConferenceHall.jpg`).default,
  },
  {
    value: 'LaboratoryHall',
    label: 'Laboratory Hall',
    img: require(`../assets/img/scenes/LaboratoryHall.png`).default,
  },
];

export const isBackgroundPreset = (value) => {
  return backgrounds.find((background) => background.value === value)
    ? true
    : false;
};

export const findBackground = (value) => {
  const res = backgrounds.find((background) => background.value === value);
  if (res) {
    return res.label;
  }
  return value;
};

export const findBackgroundThumbnail = (value) => {
  const res = backgrounds.find((background) => background.value === value);
  if (res) {
    return res.img;
  }
  return 'https://via.placeholder.com/150';
};

export const findScene = (value) => {
  const res = scenes.find((scene) => scene.value === value);
  if (res) {
    return res.label;
  }
  return value;
};

export const findSceneThumbnail = (value) => {
  const res = scenes.find((scene) => scene.value === value);
  if (res) {
    return res.img;
  }
  return 'https://via.placeholder.com/150';
};
