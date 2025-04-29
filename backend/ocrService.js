const Tesseract = require('tesseract.js');
const fs = require('fs');
const path = require('path');
const { fromPath } = require('pdf2pic');

// Mock registered user information
const registeredUserInfo = {
  name: "Deekshithaa",
  aadharNumber: "1234 5678 9101",
  dob: "01/01/2000"
};

async function performOcrOnImage(imagePath) {
  const { data: { text } } = await Tesseract.recognize(
    imagePath,
    'eng',
    { logger: m => console.log(m) }
  );
  return text;
}

async function performOcrAndMatch(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  let ocrText = "";

  try {
    if (ext === '.pdf') {
      console.log('PDF detected, converting to image...');
      const options = {
        density: 300,
        saveFilename: 'converted',
        savePath: './uploads',
        format: 'jpeg',
        width: 1200,
        height: 1600,
      };

      const storeAsImage = fromPath(filePath, options);
      const pageToConvertAsImage = 1; // Only first page for Aadhar

      const result = await storeAsImage(pageToConvertAsImage);
      console.log('PDF converted to image at:', result.path);

      ocrText = await performOcrOnImage(result.path);

      // Delete the converted image also
      fs.unlinkSync(result.path);
    } else {
      console.log('Image detected, doing OCR...');
      ocrText = await performOcrOnImage(filePath);
    }

    console.log('Extracted OCR Text:', ocrText);

    const match =
      ocrText.includes(registeredUserInfo.name) &&
      ocrText.includes(registeredUserInfo.aadharNumber);

    // Delete the uploaded file after OCR
    fs.unlinkSync(filePath);

    return { ocrText, match };
  } catch (error) {
    console.error('Error during OCR:', error);
    throw new Error('OCR processing failed.');
  }
}

module.exports = { performOcrAndMatch };
