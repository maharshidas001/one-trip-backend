import app from "./app.js";
import { envConfig } from "./config/envConfig.js";
import connectDB from "./services/db.js";

const port = envConfig.port || 3000;

const startServer = () => {
  connectDB
    .then(() => {
      app.listen(port, () => {
        console.log(`Server started on http://localhost:${port}\n`);
      });
    });
};