import { Request, Response } from 'express';
import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

import { envs } from '@server/config';

import { PaymentSessionDto, PaymentSessionItemDto } from './dto';

@Injectable()
export class PaymentsService {
  private stripe = new Stripe(envs.stripeSecret);

  async createPaymentSession(paymentSessionDto: PaymentSessionDto) {
    const { currency, items, orderId } = paymentSessionDto;

    const lineItems = items.map((item: PaymentSessionItemDto) => ({
      price_data: {
        currency,
        product_data: {
          name: item.name,
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    const session = await this.stripe.checkout.sessions.create({
      payment_intent_data: {
        metadata: {
          orderId,
        },
      },
      line_items: lineItems,
      mode: 'payment',
      success_url: envs.stripeSuccessUrl,
      cancel_url: envs.stripeCancelUrl,
    });

    return session;
  }

  async stripeWebhook(req: Request, res: Response) {
    const sig = req.headers['stripe-signature'];
    let event: Stripe.Event;
    //Testing
    // const endpointSecret = 'whsec_755d77ae545ce20ceee8f6a6c94053ae6d73b42236c00a575e1b36689d9d7c10'

    //Real
    const endpointSecret = envs.stripeEndpointSecret;

    try {
      event = this.stripe.webhooks.constructEvent(
        req['rawBody'],
        sig,
        endpointSecret,
      );
    } catch (err) {
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    switch (event.type) {
      //TODO: Llamar nuestro ms
      case 'charge.succeeded':
        const chargeSuccededed = event.data.object;
        console.log('🚀 ~', {
          metadata: chargeSuccededed.metadata,
          orderId: chargeSuccededed.metadata.orderId,
        });
        break;

      default:
        console.log(`Evento ${event.type} not handled`);
        break;
    }

    return res.status(200).json({ sig });
  }
}
