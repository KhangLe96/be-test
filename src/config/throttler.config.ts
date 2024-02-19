import { ThrottlerModule } from '@nestjs/throttler';
import { env } from '~config/env.config';

export const throttlerConfig = ThrottlerModule.forRoot([
    {
        ttl: env.THROTTLE.TTL,
        limit: env.THROTTLE.LIMIT
    }
]);
