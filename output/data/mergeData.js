import fs from 'fs';
import path from 'path';

// Thay __dirname bằng import.meta.url để lấy thư mục hiện tại
const directoryPath = path.join(new URL('.', import.meta.url).pathname, '');

fs.readdir(directoryPath, (err, files) => {
  if (err) {
    console.error('Error reading directory:', err);
    return;
  }

  let mergedData = [];

  files.forEach((file) => {
    if (file.endsWith('.json')) {
      const filePath = path.join(directoryPath, file);
      const fileData = fs.readFileSync(filePath, 'utf-8');  // Đọc đồng bộ
      const jsonData = JSON.parse(fileData);
      mergedData = mergedData.concat(jsonData);  // Kết hợp dữ liệu
    }
  });
  console.log(mergedData.length);
  fs.writeFileSync('vocabulary.json', JSON.stringify(mergedData, null, 2));
  console.log('Merged data written to vocabulary.json');
});