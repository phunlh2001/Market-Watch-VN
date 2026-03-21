import { stock } from "vnstock-js";
import { formatVND } from "../utils/index.js";
import { SpinnerResult } from "@clack/prompts";
import color from "picocolors";

export default class VnStock {
  constructor() {}

  async checkVn30(spin: SpinnerResult) {
    await this.checkCurrentPrice("E1VFVN30", spin);
  }

  async checkVnDiamond(spin: SpinnerResult) {
    await this.checkCurrentPrice("FUEVFVND", spin);
  }

  private async checkCurrentPrice(fundCode: string, spin: SpinnerResult) {
    const value = await stock.priceBoard({ ticker: fundCode });
    const price = value[0].listingInfo.refPrice;

    spin.stop(color.yellowBright("Bảng giá ETFs hôm nay của sếp đây ạ"));
    console.log(`- Bảng giá ${fundCode} hôm nay là:\t${formatVND(price)}`);
  }
}
