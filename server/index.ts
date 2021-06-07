import dotenv from 'dotenv';
import Server from './server';

dotenv.config();

const server = new Server();
async function startApp() {
  await server.init();
  server.startApp();
}

startApp();

export default server;
