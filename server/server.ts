import 'reflect-metadata';
import Koa from 'koa';
import Router from '@koa/router';
import cors from '@koa/cors';
import nextApp from 'next';
import loggerMain from 'tracer';
import { ApolloServer, gql } from 'apollo-server-koa';

export const logger = loggerMain.colorConsole();

const Query = gql`
  type Query {
    _empty: String
  }

  schema {
    query: Query
  }
`;

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

  async setupGraphQl(): Promise<void> {
    try {
      const apolloServer = new ApolloServer({
        typeDefs: [Query],
        playground: process.env.NODE_ENV !== 'production',
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
