import { SpinnerResult } from "@clack/prompts";
import { binance } from "ccxt";
import { setTimeout as sleep } from "node:timers/promises";

export default class Binance {
  private readonly exchange: binance;

  constructor(key: string, secret: string) {
    this.exchange = new binance({
      apiKey: key,
      secret: secret
    })
  }

  async checkBTC(spin: SpinnerResult) {
    await this.fetchTicker('BTC/USDT', spin);
  }

  async checkETH(spin: SpinnerResult) {
    await this.fetchTicker('ETH/USDT', spin);
  }

  async checkUSDT(spin: SpinnerResult) {
    await this.fetchTicker('USDT/USD', spin);
  }

  private async fetchTicker(type: string, spin: SpinnerResult): Promise<void> {
    const ticker = await this.exchange.fetchTicker(type);
    console.log(ticker.info.openPrice);
    await sleep(500);
  }
}
