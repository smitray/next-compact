import 'reflect-metadata';
import Koa from 'koa';
import Router from '@koa/router';
import path from 'path';
import cors from '@koa/cors';
import nextApp from 'next';
import loggerMain from 'tracer';
import { ApolloServer } from 'apollo-server-koa';
import { buildSchema } from 'type-graphql';

import { GraphQLSchema } from 'graphql';
import {
  UserCrudResolver,
  UserRelationsResolver,
  AccountRelationsResolver,
  AccountCrudResolver,
} from '../generated/type-graphql';
import prisma, { Context } from './utils/prisma';

export const logger = loggerMain.colorConsole();

export default class Server {
  server: Koa;

  async init(): Promise<void> {
    this.server = new Koa();
    await this.setupGraphQl();
    this.serverSetup();
    this.nextSetup();
  }

  serverSetup(): void {
    this.server.use(cors());
  }

  async setupORM(): Promise<GraphQLSchema> {
    // Connect prisma client
    await prisma.$connect();

    // Prepare schema
    const schema = await buildSchema({
      resolvers: [
        UserCrudResolver,
        UserRelationsResolver,
        AccountRelationsResolver,
        AccountCrudResolver,
      ],
      emitSchemaFile: path.resolve(
        __dirname,
        '../generated/generated-schema.graphql',
      ),
      validate: false,
    });
    return schema;
  }

  async setupGraphQl(): Promise<void> {
    try {
      const schema = await this.setupORM();
      const apolloServer = new ApolloServer({
        schema,
        playground: process.env.NODE_ENV !== 'production',
        context: (): Context => ({ prisma }),
      });

      apolloServer.applyMiddleware({
        app: this.server,
        path: '/api/graphql',
      });
    } catch (error) {
      logger.error(error);
    }
  }

  async nextSetup(): Promise<void> {
    const app = nextApp({
      dev: process.env.NODE_ENV !== 'production',
    });

    const router = new Router();
    await app.prepare();
    const handle = app.getRequestHandler();

    router.all('(.*)', async (context: Koa.Context) => {
      await handle(context.req, context.res);
      context.respond = false;
    });

    this.server.use(async (context: Koa.Context, next) => {
      context.res.statusCode = 200;
      await next();
    });

    this.server.use(router.routes());
  }

  startApp(): void {
    this.server
      .listen(process.env.PORT, () => {
        logger.info('Server started on:', {
          port: process.env.PORT,
        });
      })
      .on('error', (error) => {
        logger.error(error);
      });
  }
}
