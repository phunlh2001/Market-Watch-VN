import { commodity, stock } from "vnstock-js";
import { formatVND } from "../utils/index.js";
import { SpinnerResult } from "@clack/prompts";
import color from "picocolors";
import { Gold } from "../interfaces/index.js";

export default class VnStock {
  private readonly goldPrices: Gold[];

  constructor() {
    this.goldPrices = [];
  }

  async checkVn30(spin?: SpinnerResult): Promise<void> {
    await this.checkETFCurrentPrice("E1VFVN30", spin);
  }

  async checkVnDiamond(spin?: SpinnerResult): Promise<void> {
    await this.checkETFCurrentPrice("FUEVFVND", spin);
  }

  async checkSJC(spin?: SpinnerResult): Promise<void> {
    const prices = await commodity.gold.priceSJC();

    if (this.goldPrices.length === 0) {
      prices.forEach(x => {
        if (x.TypeName.includes("Vàng")) {
          this.goldPrices.push({
            typeName: x.TypeName,
            buy: x.Buy,
            sell: x.Sell
          })
        }
      })
    }

    if (spin) {
      spin.stop(color.yellowBright("Bảng giá vàng hôm nay của sếp đây ạ"));
    }
    
    const data = Object.fromEntries(
      this.goldPrices.map((gold, index) => [
        index + 1,
        {
          "Loại": gold.typeName,
          "Giá bán": formatVND(this.parseNumber(gold.sell)),
          "Giá mua": formatVND(this.parseNumber(gold.buy))
        }
      ])
    )

    console.table(data);
  }

  private async checkETFCurrentPrice(fundCode: string, spin?: SpinnerResult): Promise<void> {
    const value = await stock.priceBoard({ ticker: fundCode });
    const price = value[0].listingInfo.refPrice;

    if (spin) {
      spin.stop(color.yellowBright("Bảng giá ETFs hôm nay của sếp đây ạ"));
    }

    console.log(`- Bảng giá ${fundCode} hôm nay là:\t${formatVND(price)}`);
  }

  private parseNumber(str: string): number {
    return parseInt(str.replace(/,/g, ""), 10);
  }
}
