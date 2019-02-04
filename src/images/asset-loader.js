import healerMWalk from './healer-m-walk1.png';
import monkMBattler from './monk-m-battler1.png';
import spider from './monster_bael_fangs.png';

const IMAGES = {
  'healer-m-walk1': healerMWalk,
  'monk-m-battler': monkMBattler,
  'spider': spider
}

const LOADED_ASSETS = {};
var allImagesLoaded = false;

export function loadAssets() {
  Object.keys(IMAGES).forEach((imageName) => {
    const image = new Image();
    image.name = imageName;
    image.onload = registerImage.bind(image);
    image.src = IMAGES[imageName];
  });
}

function registerImage(event) {
  LOADED_ASSETS[this.name] = this;
  if (Object.keys(LOADED_ASSETS).length === Object.keys(IMAGES).length) {
    allImagesLoaded = true;
  }
}


export function getLoadedAsset(assetName) {
  if (LOADED_ASSETS[assetName]) {
    return LOADED_ASSETS[assetName];
  } else {
    console.warn(`Loaded assets does not contain asset name: ${assetName}. LoadedAssets: ${LOADED_ASSETS}.`);
  }
}

export function getAllImagesLoaded() {
  return allImagesLoaded;
}