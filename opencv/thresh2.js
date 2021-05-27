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

  const thval = 123;
  let thresh = new cv.Mat(src.rows, src.cols, src.type());
  for (let i = 0; i < gray.rows; i++) {
    for (let j = 0; j < gray.cols; j++) {
      thresh.ucharPtr(i, j)[0] = gray.ucharPtr(i, j)[0] > thval ? 255 : 0 ; // R
      thresh.ucharPtr(i, j)[1] = gray.ucharPtr(i, j)[0] > thval ? 255 : 0 ; // G
      thresh.ucharPtr(i, j)[2] = gray.ucharPtr(i, j)[0] > thval ? 255 : 0 ; // B
      thresh.ucharPtr(i, j)[3] = 255 ; // 明るさ
    }
  }

  const canvas = createCanvas(512, 512);
  cv.imshow(canvas, thresh);
  writeFileSync('result/thresh2.jpg', canvas.toBuffer('image/jpeg'));
  src.delete();
  gray.delete();
  thresh.delete();
})();

