import {
  BadRequestError,
  NotFoundError,
  requireAuth,
  validateRequest,
} from '@faysaltickets/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { OrderCreatedPublisher } from '../events/publishers/order-created-publisher';
import { Order, OrderStatus } from '../models/order';
import { Ticket } from '../models/ticket';
import { natsWrapper } from '../nats-wrapper';

const dataValidation = [
  body('ticketId').not().isEmpty().withMessage('ticketId is require'),
];
const EXPIRATION_WINDOW_SECONDS = 15 * 60;
const router = express.Router();

router.post(
  '/api/orders',
  requireAuth,
  dataValidation,
  validateRequest,
  async (req: Request, res: Response) => {
    const { ticketId } = req.body;

    //find the ticket user is trying to order
    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      throw new NotFoundError();
    }

    //check if ticket is not reserved and order status is not cancelled
    const ticketReserved = await ticket.isReserved();
    if (ticketReserved) {
      throw new BadRequestError('ticket is already reserved.');
    }

    //calculate order expiration time
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    //build the order and save into database
    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
      ticket,
    });

    await order.save();

    //publish an event that order has been created
    new OrderCreatedPublisher(natsWrapper.client).publish({
      id: order.id,
      status: order.status,
      userId: order.userId,
      expiresAt: order.expiresAt.toISOString(),
      ticket: {
        id: ticket.id,
        price: ticket.price,
      },
    });

    res.status(201).send(order);
  }
);

export { router as newOrderRouter };
