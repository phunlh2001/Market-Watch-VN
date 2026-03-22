import { binance } from "ccxt";
import { formatUSD } from "../utils/index.js";
import { SpinnerResult } from "@clack/prompts";
import color from "picocolors";

export default class Binance {
  private readonly exchange: binance;

  constructor(key: string, secret: string) {
    this.exchange = new binance({
      apiKey: key,
      secret: secret,
    });
  }

  async checkBTC(spin?: SpinnerResult) {
    await this.fetchTicker("BTC/USDT", spin);
  }

  async checkETH(spin?: SpinnerResult) {
    await this.fetchTicker("ETH/USDT", spin);
  }

  private async fetchTicker(type: string, spin?: SpinnerResult) {
    const ticker = await this.exchange.fetchTicker(type);
    const { lastPrice, priceChangePercent } = ticker.info;

    if (spin) {
      spin.stop(color.yellowBright("Bảng giá crypto hôm nay của sếp đây ạ"));
    }
    console.log(
      `- Bảng giá ${type} hôm nay là:\t${formatUSD(lastPrice)}\t(${priceChangePercent}%)`,
    );
  }
}
