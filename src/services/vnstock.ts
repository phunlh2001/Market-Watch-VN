import { commodity, stock } from "vnstock-js";
import { formatVND } from "../utils/index.js";
import { SpinnerResult } from "@clack/prompts";
import color from "picocolors";

interface Gold {
  typeName: string
  buy: string
  sell: string
}

export default class VnStock {
  private readonly goldPrices: Gold[];

  constructor() {
    this.goldPrices = [];
  }

  async checkVn30(spin?: SpinnerResult) {
    await this.checkETFCurrentPrice("E1VFVN30", spin);
  }

  async checkVnDiamond(spin?: SpinnerResult) {
    await this.checkETFCurrentPrice("FUEVFVND", spin);
  }

  async checkSJC(spin?: SpinnerResult) {
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
    
    for (const gold of this.goldPrices) {
      console.log(`
      - Loại:\t${color.underline(gold.typeName)}
        + Giá bán:\t${formatVND(this.parseNumber(gold.buy))}
        + Giá mua:\t${formatVND(this.parseNumber(gold.sell))}
      ---------------------------`);
    }
  }

  private async checkETFCurrentPrice(fundCode: string, spin?: SpinnerResult) {
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
