const Jimp = require('jimp');

const onRuntimeInitialized = async () => {
  var jimpSrc = await Jimp.read('../lena.png');

  var src = cv.matFromImageData(jimpSrc.bitmap);

  let dst = new cv.Mat();
  let M = cv.Mat.ones(5, 5, cv.CV_8U);
  let anchor = new cv.Point(-1, -1);
  cv.dilate(src, dst, M, anchor, 1, cv.BORDER_CONSTANT, cv.morphologyDefaultBorderValue());

  new Jimp({
    width: dst.cols,
    height: dst.rows,
    data: Buffer.from(dst.data)
  })
  .write('output.png');
  src.delete();
  dst.delete();
};

Module = {
  onRuntimeInitialized
};

cv = require('./opencv.js');
