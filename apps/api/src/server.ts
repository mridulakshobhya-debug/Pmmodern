import { app } from "./app.js";
import { env } from "./config/env.js";

const server = app.listen(env.port, () => {
  // eslint-disable-next-line no-console
  console.log(`API server running on http://localhost:${env.port}`);
});

server.on("error", (error) => {
  // eslint-disable-next-line no-console
  console.error("API server failed to start:", error);
});
