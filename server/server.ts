import express, { Request, Response, NextFunction } from 'express';
import path from 'path';

const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.get('/', (req: Request, res: Response) => {
  return res
    .status(200)
    .sendFile(path.resolve(import.meta.dirname, 'index.html'));
});

// 404 error handler
app.use((req: Request, res: Response) => {
  return res.sendStatus(404).send('Page not found.');
});

// global error handler 500
interface Error {
  err: any;
}

app.use((err: Error, req: Request, res: Response) => {
  return res.json(err);
});

// Initialization
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});
