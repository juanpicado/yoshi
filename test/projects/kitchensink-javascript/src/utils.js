import ejs from 'ejs';
import path from 'path';

const isProduction = process.env.NODE_ENV === 'production';

export const renderFile = (filename, ...args) => {
  const filePath = isProduction
    ? filename
    : filename.replace(/\.[0-9a-z]+$/i, match => '.debug' + match);

  const absoluteFilePath = path.join('./dist/statics', filePath);

  return ejs.renderFile(absoluteFilePath, ...args);
};
