import ejs from 'ejs';
import path from 'path';
import express from 'express';

const isProduction = process.env.NODE_ENV === 'production';

const app = express();

const renderFile = (filename, options = {}) => {
  const filePath = isProduction
    ? filename
    : filename.replace(/\.[0-9a-z]+$/i, match => '.debug' + match);

  const absoluteFilePath = path.join('./dist/statics', filePath);

  return ejs.renderFile(absoluteFilePath, options);
};

app.get('/other', async (req, res) => {
  res.send(await renderFile('other.ejs'));
});

app.get('*', async (req, res) => {
  res.send(
    await renderFile('app.ejs', {
      title: 'Some title',
    }),
  );
});

app.listen(process.env.PORT);
