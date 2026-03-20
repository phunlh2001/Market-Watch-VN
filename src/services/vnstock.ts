import { stock } from "vnstock-js";
import { setTimeout as sleep } from "node:timers/promises";

export default class VnStock {
  constructor() {}

  async checkVn30() {
    await this.checkCurrentPrice("E1VFVN30");
  }

  async checkVnDiamond() {
    await this.checkCurrentPrice("FUEVFVND");
  }

  private async checkCurrentPrice(fundCode: string) {
    const value = await stock.priceBoard({ ticker: fundCode });
    console.log(value);
    await sleep(500);
  }
}
