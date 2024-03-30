import {Injectable} from '@nestjs/common'
import {InjectRedis} from '@nestjs-modules/ioredis'
import Redis from 'ioredis'


@Injectable()
export class RedisService {
    constructor(@InjectRedis() private readonly redis: Redis) {
        this.redis = redis
        this.redis.select(2)
    }

    set(key: string, value: any, seconds?: number) {
        if (seconds > 0) {
            return this.redis.setex(key, seconds, value)
        } else {
            return this.redis.set(key, value)
        }
    }

    get(key: string) {
        return this.redis.get(key)
    }
}