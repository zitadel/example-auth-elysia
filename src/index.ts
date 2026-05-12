import 'dotenv/config';
import { build } from './app.js';

/**
 * Starts the Elysia server and begins listening for incoming connections.
 *
 * @returns Promise that resolves when the server starts successfully
 */
async function startServer(): Promise<void> {
  const app = await build();
  const PORT: number = Number(process.env.PORT) || 3000;

  app.listen(PORT);

  console.log(`Stateless server with Elysia running on port ${PORT}`);
}

startServer().catch(console.error);
