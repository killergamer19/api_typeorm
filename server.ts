import 'rootpath';
import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import usersController from './users/users.controller';
import errorHandler from './_middleware/error-handler';

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// API routes
app.use('/users', usersController);

// Global error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    errorHandler(err, req, res, next);
});

// Start server
const port: number = process.env.NODE_ENV === 'production' ? Number(process.env.PORT) || 80 : 4000;
app.listen(port, () => console.log(`Server listening on port ${port}`));

