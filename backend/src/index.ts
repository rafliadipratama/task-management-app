import { app } from './app.js';
import { env } from './config/env.js';

const server = app.listen(env.PORT, () => {
  console.log(`🚀 Task Management API server listening on http://localhost:${env.PORT}`);
  console.log(`📡 Health check available at http://localhost:${env.PORT}/api/health`);
});

const gracefulShutdown = () => {
  console.log('Stopping server gracefully...');
  server.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

export default server;
