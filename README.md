note this is outdated...

# Unstoppable Private Money

A secure and private payment processing system built with Node.js, Express, tRPC, and Stripe integration.

## Features

- Secure payment processing with Stripe
- User authentication and authorization
- Subscription management
- Webhook handling for payment events

## Setup

1. Clone the repository
2. Install dependencies: `npm install` or `bun install`
3. Create a `.env` file with required environment variables
4. Run the development server: `npm run dev` or `bun dev`

## Environment Variables

Required environment variables:

- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `MONGODB_URI`
- `PORT` (optional, defaults to 3001)

## License

MIT
