import express from "express";
import App from "./services/ExpressApp";
import { PORT } from "./config";

const StartServer = async () => {
  const app = express();

  await App(app);

  app.listen(PORT, () => {
    console.log(`Listening to port 4000 ${PORT}`);
  });
};

StartServer();
