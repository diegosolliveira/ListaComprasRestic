import { join } from 'path';
import express from 'express';
import { renderModule } from '@angular/platform-server';
import { AppServerModule } from './src/app/app.server.module';
import { APP_BASE_HREF } from '@angular/common';

export function app(): express.Express {
  const server = express();
  const browserDistFolder = join(__dirname, '../browser');
  const indexHtml = join(browserDistFolder, 'index.html');

  server.set('view engine', 'html');
  server.set('views', browserDistFolder);

  server.get('*.*', express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
  }));

  server.get('*', (req, res) => {
    const url = req.originalUrl;

    renderModule(AppServerModule, {
      document: indexHtml,
      url: url,
      extraProviders: [
        { provide: APP_BASE_HREF, useValue: req.baseUrl }
      ]
    })
      .then((html: string) => {
        res.send(html);
      })
      .catch((err: Error) => {
        res.status(500).send(err);
      });
  });

  return server;
}

function run(): void {
  const port = process.env['PORT'] || 4000;
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

run();
