const { Canvas, createCanvas, Image, ImageData, loadImage } = require('canvas');
const { JSDOM } = require('jsdom');
const { writeFileSync } = require('fs');

const loadOpenCV = () => {
  return new Promise(resolve => {
    global.Module = {
      onRuntimeInitialized: resolve
    };
    global.cv = require('./opencv.js');
  });
};

const installDOM = () => {
  const dom = new JSDOM();
  global.document = dom.window.document;
  // The rest enables DOM image and canvas and is provided by node-canvas
  global.Image = Image;
  global.HTMLCanvasElement = Canvas;
  global.ImageData = ImageData;
  global.HTMLImageElement = Image;
}

(async () => {
  installDOM();
  await loadOpenCV();
  const image = await loadImage('../lena.png');
  const src = cv.imread(image);
  let gray = new cv.Mat();
  cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY, 0);
  const canvas = createCanvas(300, 300);
  cv.imshow(canvas, gray);
  writeFileSync('./result/mono.jpg', canvas.toBuffer('image/jpeg'));
  src.delete();
  gray.delete();
})();

