import { SpinnerResult } from "@clack/prompts";
import color from "picocolors";
import * as cheerio from "cheerio";
import { OilRecord } from "../interfaces/index.js";

export default class PvOil {
  private readonly endpoint: string;
  private readonly oilResults: OilRecord;
  
  constructor(endpoint: string) {
    this.endpoint = endpoint;
    this.oilResults = {};
  }

  async checkGasolineCurrentPrices(spin?: SpinnerResult): Promise<void> {
    if (Object.entries(this.oilResults).length === 0) {
      const res = await fetch(this.endpoint);
      const html = await res.text();
    
      const $ = cheerio.load(html);
      $("tbody tr").each((_, el) => {
        const name = $(el).find("td:nth-child(2)").text().trim();
        const price = $(el).find("td:nth-child(3)").text().trim();
  
        if (
          name === "Xăng RON 95-III" ||
          name === "Xăng E10 RON 95-III" ||
          name === "Xăng E5 RON 92-II"
        ) {
          this.oilResults[name] = price;
        }
      });
    }

    if (spin) {
      let todayTime = new Date().toLocaleTimeString()
      spin.stop(color.yellowBright(`Bảng giá xăng hôm nay (${todayTime}) của sếp đây ạ`));
    }

    Object.entries(this.oilResults).forEach(([key, value]) => {
      const price = Number(value.replace(" đ", ""));

      if (price >= 28.5) {
        console.log(`- ${key}:\t\t${color.bold(color.red(value))}`);
      } else {
        console.log(`- ${key}:\t\t${color.bold(color.green(value))}`);
      }
    })
  }
}
