import dotenv from 'dotenv';

dotenv.config();

export const config = {
  redisPort: Number(process.env.REDIS_PORT ?? 6379),
  redisHost: process.env.REDIS_HOST ?? 'localhost',
  redisDb: Number(process.env.REDIS_DB ?? 0),
  redisPassword: process.env.REDIS_PASSWORD,
  twitterEnabled: process.env.TWITTER_ENABLED === 'true',
  twitterAppKey: process.env.TWITTER_APP_KEY ?? '',
  twitterAppSecret: process.env.TWITTER_APP_SECRET ?? '',
  twitterAccessToken: process.env.TWITTER_ACCESS_TOKEN ?? '',
  twitterAccessSecret: process.env.TWITTER_ACCESS_SECRET ?? '',
  gnarsTokenAddress:
    process.env.GNARS_TOKEN_ADDRESS ?? '0x558bfff0d583416f7c4e380625c7865821b8e95c',
  chainID: 1,
  jsonRpcUrl: "https://mainnet.infura.io/v3/91f26e7fbe3f41f29b3e73ed99b128d6",
  SkateContract: {
    1: "0x558bfff0d583416f7c4e380625c7865821b8e95c", // old 0x494715B2a3C75DaDd24929835B658a1c19bd4552
  },
  SkateProxyContract: {
    1: "0xc28e0d3c00296dd8c5c3f2e9707361920f92a209",
  },
  RpcURL: {
    wss: {
      1: "wss://mainnet.infura.io/ws/v3/91f26e7fbe3f41f29b3e73ed99b128d6",
    },
    https: {
      1: "https://mainnet.infura.io/v3/91f26e7fbe3f41f29b3e73ed99b128d6",
      56: "https://bsc-dataseed1.defibit.io/",
      97: "https://speedy-nodes-nyc.moralis.io/03eb35954a0b7ed092444a8e/bsc/testnet",
    },
  },
  discordEnabled: process.env.DISCORD_ENABLED === 'true',
  discordWebhookToken: process.env.DISCORD_WEBHOOK_TOKEN ?? '',
  discordWebhookId: process.env.DISCORD_WEBHOOK_ID ?? '',
  discordPublicWebhookToken: process.env.DISCORD_PUBLIC_WEBHOOK_TOKEN ?? '',
  discordPublicWebhookId: process.env.DISCORD_PUBLIC_WEBHOOK_ID ?? '',
  pinataEnabled: process.env.PINATA_ENABLED === 'true',
  pinataApiKey: process.env.PINATA_API_KEY ?? '',
  pinataApiSecretKey: process.env.PINATA_API_SECRET_KEY ?? '',
};
