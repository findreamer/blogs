## 目录介绍

- main.ts ：入口文件
- app.module.ts ：根模块，入口文件中会以此模块为入口解析依赖关系启动程序
- dtos ：用来接收请求参数，传输给 service
- entities ：实体文件，一个entity对应一张数据库的表，属性与数据库字段一一对应
- filters ：异常过滤器，用来自定义异常
- guards ：守卫，用来判断是否有权限进入某个控制器或者某个路由
- interceptors ：拦截器，用来转换路由的返回值
- middilewares ：中间件，处理请求前后的信息
- services ：一些公共的业务方法
- decorators ：自定义装饰器
- pipes ：数据验证和转换
- utils ：一些公共的通用方法
- modules ：业务模块
  - xx.controller ：控制器，用于接收前端请求
  - xx.service ：用于处理业务逻辑
  - xx.module ：管理当前模块的依赖
 
- .env ：配置文件，数据库配置、 Redis 配置等

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ pnpm install
```

## Running the app

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Test

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
