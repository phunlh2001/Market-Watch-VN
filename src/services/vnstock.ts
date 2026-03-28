import { commodity, stock } from "vnstock-js";
import { formatVND } from "../utils/index.js";
import { SpinnerResult } from "@clack/prompts";
import color from "picocolors";
import { GoldMap, GoldPrice } from "../interfaces/index.js";

export default class VnStock {
  private readonly goldMap: GoldMap;

  constructor() {
    this.goldMap = {};
  }

  async checkVn30(spin?: SpinnerResult): Promise<void> {
    await this.checkETFCurrentPrice("E1VFVN30", spin);
  }

  async checkVnDiamond(spin?: SpinnerResult): Promise<void> {
    await this.checkETFCurrentPrice("FUEVFVND", spin);
  }

  async checkSJC(spin?: SpinnerResult): Promise<void> {
    const prices = await commodity.gold.priceSJC();

    if (Object.entries(this.goldMap).length === 0) {
      prices.forEach((p) => {
        if (p.TypeName.includes('Vàng SJC')) {
          const price: GoldPrice = { buy: p.Buy, sell: p.Sell };
          this.goldMap[p.TypeName] = price;
        }
      });
    }

    if (spin) {
      let todayTime = new Date().toLocaleTimeString()
      spin.stop(color.yellowBright(`Bảng giá vàng hôm nay (${todayTime}) của sếp đây ạ`));
    }

    const data = Object.fromEntries(
      Object.entries(this.goldMap).map(([name, price], index) => [
        index + 1,
        {
          "Loại": name,
          "Giá bán": formatVND(this.parseNumber(price.sell)),
          "Giá mua": formatVND(this.parseNumber(price.buy))
        }
      ])
    );

    console.table(data);
  }

  private async checkETFCurrentPrice(
    fundCode: string,
    spin?: SpinnerResult,
  ): Promise<void> {
    const value = await stock.priceBoard({ ticker: fundCode });
    const price = value[0].listingInfo.refPrice;

    if (spin) {
      spin.stop(
        color.yellowBright("Bảng giá các thông tin sếp quan tâm đây ạ"),
      );
    }

    if (price <= 29_000) {
      console.log(
        `- ${fundCode}:\t\t\t${color.bold(color.red(formatVND(price)))}`,
      );
    } else {
      console.log(
        `- ${fundCode}:\t\t\t${color.bold(color.green(formatVND(price)))}`,
      );
    }
  }

  private parseNumber(str: string): number {
    return parseInt(str.replace(/,/g, ""), 10);
  }
}
