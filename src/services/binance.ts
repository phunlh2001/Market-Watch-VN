import { binance, Ticker } from "ccxt";

export default class Binance {
  private readonly exchange: binance;

  constructor(key: string, secret: string) {
    this.exchange = new binance({
      apiKey: key,
      secret: secret
    })
  }

  async checkBTC() {
    const ticker = await this.fetchTicker('BTC/USDT');
    console.log(ticker);
  }

  async checkETH() {
    const ticker = await this.fetchTicker('ETH/USDT');
    console.log(ticker);
  }

  async checkUSDT() {
    const ticker = await this.fetchTicker('USDT/USD');
    console.log(ticker);
  }

  private async fetchTicker(type: string): Promise<Ticker> {
    return this.exchange.fetchTicker(type);
  }
}
