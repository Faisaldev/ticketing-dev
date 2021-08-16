import { NotAuthorizedError, NotFoundError, requireAuth, validateRequest } from '@faysaltickets/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { Ticket } from '../models/ticket';

const router = express.Router();

const dataValidation = [
  body('title').not().isEmpty().withMessage('title is require'),
  body('price').isFloat({ gt: 0 }).withMessage('Price should be greater than zero'),
];

router.put('/api/tickets/:id', requireAuth, dataValidation, validateRequest, async (req: Request, res: Response) => {
  const ticket = await Ticket.findById(req.params.id);

  if (!ticket) {
    throw new NotFoundError();
  }

  if (ticket.userId !== req.currentUser!.id) {
    throw new NotAuthorizedError();
  }

  ticket.set({
    title: req.body.title,
    price: req.body.price,
  });

  await ticket.save();

  res.send(ticket);
});

export { router as updateRouter };
