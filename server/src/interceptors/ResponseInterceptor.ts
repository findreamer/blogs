import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

@Injectable()
export class ResponseInterceptor implements NestInterceptor {

    intercept(ctx: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(map(data => ({
            status: 200,
            data,
            message: 'success'
        })))

    }
}