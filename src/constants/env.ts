import dotenv from "dotenv";
import { homedir } from "os";
import { join } from "path";

const localEnv = dotenv.config();
if (localEnv.error) {
  dotenv.config({ path: join(homedir(), ".market-watch.env") });
}

export const PVOIL_ENDPOINT = process.env.PVOIL_ENDPOINT;
export const BINANCE_APIKEY = process.env.BINANCE_APIKEY;
export const BINANCE_SECRETKEY = process.env.BINANCE_SECRETKEY;
