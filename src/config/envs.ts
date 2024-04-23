import * as Joi from 'joi';
import 'dotenv/config';

interface EnvVars {
  PORT: number;
  STRIPE_ENDPOINT_SECRET: string;
  STRIPE_SUCCESS_URL: string;
  STRIPE_CANCEL_URL: string;
  STRIPE_SECRET: string;
}

const envSchema = Joi.object({
  PORT: Joi.number().required(),
  STRIPE_ENDPOINT_SECRET: Joi.string().required(),
  STRIPE_SUCCESS_URL: Joi.string().required(),
  STRIPE_CANCEL_URL: Joi.string().required(),
  STRIPE_SECRET: Joi.string().required(),
}).unknown(true);

const { error, value } = envSchema.validate(process.env);

if (error) throw new Error(`Config calidation error: ${error.message}`);

const envVars: EnvVars = value;

export const envs = {
  port: envVars.PORT,
  stripeEndpointSecret: envVars.STRIPE_ENDPOINT_SECRET,
  stripeSuccessUrl: envVars.STRIPE_SUCCESS_URL,
  stripeCancelUrl: envVars.STRIPE_CANCEL_URL,
  stripeSecret: envVars.STRIPE_SECRET,
};
