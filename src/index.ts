import express, { Express, Request, Response } from "express";
import startBot from "./bot";

const server = async () => {
  const app: Express = express();
  const port = process.env.PORT || 80;

  app.use(express.urlencoded({ extended: true }));
  app.use(express.static(__dirname));

  app.get("/", (req: Request, res: Response) => {
    console.log("Get request to /");
    res.sendFile(`${__dirname}/index.html`);
  });

  app.listen(port, () => {
    console.log("\nWeb-server running!\n");
  });

  // TODO: CONNECT TO DB FIRST
  await startBot();
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
server();
