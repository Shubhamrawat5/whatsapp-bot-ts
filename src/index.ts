import express, { Express, Request, Response } from "express";
import qrcode from "qrcode";
import path from "path";
// eslint-disable-next-line import/no-cycle
import startBot from "./bot";

let qr: string | undefined;
const updateQr = (newQr: string | undefined) => {
  qr = newQr;
};

const server = async () => {
  const app: Express = express();
  const port = process.env.PORT || 80;
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static(path.join(__dirname, "..")));

  app.get("/", (req: Request, res: Response) => {
    console.log("Get request to /");
    const indexFilePath = path.join(__dirname, "..", "index.html");
    res.sendFile(indexFilePath);
  });

  app.get("/connect", async (req: Request, res: Response) => {
    console.log("Get request to /connect");

    if (qr) {
      res.setHeader("content-type", "image/png");
      res.end(await qrcode.toBuffer(qr));
    } else {
      res.end(
        "An issue has been encountered while generating the QR code. Please keep refreshing the page to display a new QR code."
      );
    }
  });

  app.listen(port, () => {
    console.log("\nWeb-server running! Scan QR code in /connect");
  });

  // TODO: CONNECT TO DB FIRST
  await startBot();
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
server();
export default updateQr;
