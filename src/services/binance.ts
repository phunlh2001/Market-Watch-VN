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

  async checkBTC() {
    await this.fetchTicker('BTC/USDT');
  }

  async checkETH() {
    await this.fetchTicker('ETH/USDT');
  }

  async checkUSDT() {
    await this.fetchTicker('USDT/USD');
  }

  private async fetchTicker(type: string): Promise<void> {
    const ticker = this.exchange.fetchTicker(type);
    console.log(ticker);
    await sleep(500);
  }
}
