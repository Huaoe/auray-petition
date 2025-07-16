const sharp = require('sharp');
sharp('../public/images/inpaint/inpaint1.jpg')
  .threshold(128)
  .toFile('../public/images/inpaint/inpaint1-binarized.jpg');