import express, { Request, Response, NextFunction } from 'express';

const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes

// 404 error handler
app.use((req: Request, res: Response) => {
  return res.status(404).send('Page not found.');
});

// global error handler 500
interface Error {
    err: any;
}

app.use((err: Error, req: Request, res:Response) => {
    return res.json(err);
})

// Initialization
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});
