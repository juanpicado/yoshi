import express from 'express';
import { renderFile } from './utils';

const app = express();

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
