import { requireAuth, validateRequest } from '@faysaltickets/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { Ticket } from '../models/ticket';

const router = express.Router();

const dataValidation = [
  body('title').not().isEmpty().withMessage('title is require'),
  body('price').isFloat({ gt: 0 }),
];

router.post('/api/tickets', requireAuth, dataValidation, validateRequest, async (req: Request, res: Response) => {
  const { title, price } = req.body;

  const ticket = Ticket.build({
    title,
    price,
    userId: req.currentUser!.id,
  });

  await ticket.save();

  res.status(201).send(ticket);
});

export { router as createTicketRouter };
