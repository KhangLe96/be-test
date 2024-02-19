import dotenv from 'dotenv';

dotenv.config();

export const env = {
    WHITELIST_DOMAINS: (process.env.WHITELIST_DOMAINS || 'localhost:*').split(','),
    THROTTLE: {
        TTL: Number(process.env.THROTTLE_TTL || 60),
        LIMIT: Number(process.env.THROTTLE_LIMIT || 60)
    }
};
