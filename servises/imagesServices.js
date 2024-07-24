const fs = require("fs").promises;
const Jimp = require("jimp");

const isAccessible = (path) =>
  fs
    .access(path)
    .then(() => true)
    .catch(() => false);

const setupFolder = async (path) => {
  const folderExist = await isAccessible(path);
  if (!folderExist) {
    try {
      await fs.mkdir(path);
    } catch (e) {
      console.log("No permissions!");
      process.exit(1);
    }
  }
};
const MAX_AVATAR_WIDTH = 250;
const MAX_AVATAR_HEIGHT = 250;

const isImageAndTransform = async (path) => {
  try {
    const image = await Jimp.read(path);
    const w = image.getWidth();
    const h = image.getHeight();

    if (w > MAX_AVATAR_WIDTH || h > MAX_AVATAR_HEIGHT) {
      const cropWidth = Math.min(w, MAX_AVATAR_WIDTH);
      const cropHeight = Math.min(h, MAX_AVATAR_HEIGHT);

      const centerX = Math.round(w / 2 - cropWidth / 2);
      const centerY = Math.round(h / 2 - cropHeight / 2);

      await image
        .rotate(360)
        .crop(Math.max(centerX, 0), Math.max(centerY, 0), cropWidth, cropHeight)
        .sepia()
        .write(path);
    }
    return true;
  } catch (err) {
    console.error("Error by avatar loading", err);
    return false;
  }
};

module.exports = { setupFolder, isImageAndTransform };
