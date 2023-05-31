import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import cors from 'cors';

const serverConfig = {
  // Your server configurations
};

const createServerConfig = () => {
  const config = defineConfig({
    plugins: [react()],
    server: serverConfig,
  });

  // Apply CORS middleware to the server
  if (config.server && config.server.middlewares) {
    config.server.middlewares.use(cors());
  }

  return config;
};

export default createServerConfig();
