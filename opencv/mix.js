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
  const lena = await loadImage('../lena.png');
  const oldsrc = cv.imread(lena);
  const now = await loadImage('../now.jpg');
  const newsrc = cv.imread(now);
  let dst = new cv.Mat(oldsrc.rows, oldsrc.cols, oldsrc.type());
  
  const r = 0.3

  for (let i = 0; i < oldsrc.rows; i++) {
    for (let j = 0; j < oldsrc.cols; j++) {
      dst.ucharPtr(i, j)[0] = parseInt(oldsrc.ucharPtr(i, j)[0] * r + newsrc.ucharPtr(i, j)[0] * (1 - r) ); // R
      dst.ucharPtr(i, j)[1] = parseInt(oldsrc.ucharPtr(i, j)[1] * r + newsrc.ucharPtr(i, j)[1] * (1 - r) ); // G
      dst.ucharPtr(i, j)[2] = parseInt(oldsrc.ucharPtr(i, j)[2] * r + newsrc.ucharPtr(i, j)[2] * (1 - r) ); // B
      dst.ucharPtr(i, j)[3] = parseInt(oldsrc.ucharPtr(i, j)[3] * r + newsrc.ucharPtr(i, j)[3] * (1 - r) ); // 明るさ
    }
  }
  const canvas = createCanvas(512, 512);
  cv.imshow(canvas, dst);
  writeFileSync('result/mix.jpg', canvas.toBuffer('image/jpeg'));
  oldsrc.delete();
  newsrc.delete();
  dst.delete();
})();

