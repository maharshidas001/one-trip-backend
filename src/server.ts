import app from "./app";
import connectDB from "./services/db";
import { envConfig } from "./config/envConfig";

const port = envConfig.port || 3000;

const startServer = async () => {
  connectDB()
    .then(() => {
      app.listen(port, () => {
        console.log(`Server started on http://localhost:${port}\n`);
      });
    });
};

startServer();