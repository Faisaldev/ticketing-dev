import { currentUser, errorHandler, NotFoundError } from '@faysaltickets/common';
import cookieSession from 'cookie-session';
import express from 'express';
import 'express-async-errors';
import { indexTicketRouter } from './routes';
import { createTicketRouter } from './routes/new';
import { showTicketRouter } from './routes/show';
import { updateRouter } from './routes/update';

const app = express();
app.set('trust proxy', true);
app.use(express.json());
//jest set NODE_ENV to 'test' when executing test
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  })
);
app.use(currentUser);

app.use(createTicketRouter);
app.use(showTicketRouter);
app.use(indexTicketRouter);
app.use(updateRouter);

app.all('*', async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
