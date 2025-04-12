import fs from 'fs';
import mongoose from 'mongoose';
import path from 'path';
import { Bounty } from '../models/bounty';
import { Organisation } from '../models/organisation';
import { User } from '../models/user';

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || '');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error: any) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Seed database with all data
const seedDatabase = async () => {
  try {
    // Find or create a test user
    const yourEmail = 'wallawitsch@gmail.com';
    const user = await User.findOne({ email: yourEmail });

    if (!user) {
      throw new Error('user not found');
    }

    const userId = user._id.toString();

    // Create restaurant table and its rows
    const exampleBounties = await createExampleBounties(userId);
    console.log(`Created ${exampleBounties.name}`);

    console.log('Database seeded successfully!');
  } catch (error: any) {
    console.error(`Error seeding database: ${error.message}`);
  } finally {
    // Disconnect from database
    mongoose.disconnect();
    console.log('Disconnected from database');
  }
};

async function createExampleBounties(userId: string) {
  // Read logo files
  const jupiterLogo = fs.readFileSync(path.join(__dirname, 'jupiter.jpg'));
  const tarsLogo = fs.readFileSync(path.join(__dirname, 'tars.png'));
  const vaultLogo = fs.readFileSync(path.join(__dirname, 'vault.jpg'));

  // Create organizations
  const metaWealth = await Organisation.create({
    name: 'MetaWealth',
    logo: {
      data: vaultLogo,
      contentType: 'image/jpeg',
    },
    contactLink: 'https://metawealth.com/contact',
  });

  const jupiter = await Organisation.create({
    name: 'Jupiter',
    logo: {
      data: jupiterLogo,
      contentType: 'image/jpeg',
    },
    contactLink: 'https://jupiter.io/contact',
  });

  const tars = await Organisation.create({
    name: 'Tars',
    logo: {
      data: tarsLogo,
      contentType: 'image/png',
    },
    contactLink: 'https://tars.ai/contact',
  });

  // Create bounties
  const bounties = await Promise.all([
    Bounty.create({
      name: 'C25 - RWA Revolution (Video)',
      organisation: metaWealth._id,
      submitLink: 'https://metawealth.com/submit',
      contactLink: 'https://metawealth.com/contact',
      skills: 'Content Creation, Video Editing',
      prizes: '500,350,150',
      prizeCurrency: 'USDC',
      details: `# About MetaWealth

MetaWealth is the largest tokenizer of institutional-grade real estate in Europe, with over **145+ units tokenized** across Spain, Romania, Greece, and Italy. Over the past **21 months**, MetaWealth has distributed **850K+ USDC** to investors, making real estate investments more accessible via blockchain technology.

## Scope of Work

We're looking for engaging and informative video content that explores the **RWA (Real World Assets) ecosystem on Solana** and **MetaWealth's role in leading the charge**. Your video should be **at least 1 minute long** and cover topics such as:

- What sets MetaWealth apart from other RWA projects
- How MetaWealth consistently tokenizes real estate and brings it on-chain
- Innovations & unique features MetaWealth is introducing to the space
- How MetaWealth is driving Web3 adoption through real estate investing
- Institutional investments in assets 8 & 9, and why the 10th asset is an exciting opportunity

## Submission Requirements

- **Video length**: Between 60-120 seconds
- **Platforms**: Must be posted on both YouTube and Twitter/X
- **Language**: Must be in English
- **Content quality matters** – clear visuals, good audio, and well-structured storytelling are key
- **Bonus points** for discussing institutional investments in assets 8 & 9 and promoting interest in MetaWealth's 10th asset

### Technical Requirements
- Must use motion graphics
- Must use VFX
- Must use dynamic text overlays (e.g., eye-catching subtitles/captions)`,
      openStatus: true,
    }),
    Bounty.create({
      name: 'Create memes using your Jupiter Portfolio v2 Dashboard',
      organisation: jupiter._id,
      submitLink: 'https://jupiter.io/submit',
      contactLink: 'https://jupiter.io/contact',
      skills: 'Meme Creation, Creativity',
      prizes: '250,150,100',
      prizeCurrency: 'JUP',
      details: `# About Jupiter

Jupiter is the premier liquidity aggregator for Solana, providing users with the best swap rates across all major DEXs. With its innovative platform, Jupiter offers seamless access to decentralised finance (DeFi), enhancing trading efficiency and optimising swap outcomes for its users.

## About the Bounty

Jupiter Portfolio V2 has officially launched on **Jupiter Mobile**!

To celebrate, we're hosting a **meme bounty** where bounty hunters can flex their Jupiter portfolio dashboards and show off their meme game at the same time.

## Submission Guidelines

The ideal submission will feature hilarious memes that prominently include your **Jupiter Portfolio screenshot** — ideally with some balance visible — and a creative spin, like a green screen video, meme caption, or something uniquely your own.

Let's make it cool to post portfolio screenshots on Solana — Jupiter style.

### Requirements
- Create any number of meme posts using screenshots of your **Jupiter Portfolio dashboard** (on mobile)
- Please **do not** use screen recordings — only static screenshots
- Must be original content
- Must be family-friendly
- Must include portfolio balance`,
      openStatus: true,
    }),
    Bounty.create({
      name: 'Tars Creator Competition: Grand Prize',
      organisation: tars._id,
      submitLink: 'https://tars.ai/submit',
      contactLink: 'https://tars.ai/contact',
      skills: 'Content Creation, Writing, Design',
      prizes: '10000,3000,2000',
      prizeCurrency: 'USDC',
      details: `# About Tars

Tars is the hub of AI development on Solana. It helps Solana developers build, scale, and monetise AI agents through AI products and developer infrastructure.

Tars offers a suite of products such as:
- Sona (digital assistant for the SAGA phone)
- TGPT (Tars GPT), an AI console
- Dashboard of modular AI products
- AI Agents Marketplace

## About the $30,900 Tars Creator Competition

Tars has recently launched its **AI Token Marketplace**, and is hosting this competition to celebrate and spread the word about this launch. This competition is for crypto creators, educators, and traders to produce high-quality content that highlight the newly launched AI token marketplace.

The competition consists of eight bounties, each with its own rewards. The top submissions across all bounties will be eligible to **win a grand prize of $15,000**. Whether you excel in writing informative threads, creating educational videos, or designing engaging memes, there are multiple ways to participate.

### How to Participate

To qualify for the grand prize, submit your work to at least one of the eight Tars AI Token Marketplace bounties currently live on Superteam Earn:

1. Twitter Thread on Tars' AI Marketplace ($1,500)
2. Create content on the benefits of launching an AI token on Tars ($2,400)
3. Twitter Thread on AI Token Trading Strategies ($1,000)
4. Launch/Hype Video on Tars' AI Marketplace ($5,000)
5. Product Walkthrough Video of Tars' AI Marketplace ($2,000)
6. Memes on Tars' AI Marketplace ($500)
7. Product Feedback Twitter Thread on Tars' AI Marketplace ($1,500)
8. Deep Dive (Blog Post) on Tars' AI Marketplace ($2,000)

**Note**: Spammers or low-quality submissions will be immediately disqualified from the Grand Prize.`,
      openStatus: true,
    }),
  ]);

  return {
    name: 'Example Bounties',
    organisations: [metaWealth, jupiter, tars],
    bounties,
  };
}

// Run the seeder
connectDB().then(() => {
  seedDatabase();
});
