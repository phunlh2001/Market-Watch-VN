import { SpinnerResult } from "@clack/prompts";
import color from "picocolors";
import * as cheerio from "cheerio";
import { setTimeout as sleep } from "node:timers/promises";

export default class PvOil {
  private readonly endpoint: string;
  
  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  async checkCurrentPrices(spin: SpinnerResult): Promise<void> {
    spin.start(color.bold("Đang lấy bảng giá"));

    const res = await fetch(this.endpoint);
    const html = await res.text();

    const result: Record<string, string> = {};

    const $ = cheerio.load(html);
    $("tbody tr").each((_, el) => {
      const name = $(el).find("td:nth-child(2)").text().trim();
      const price = $(el).find("td:nth-child(3)").text().trim();

      if (
        name === "Xăng RON 95-III" ||
        name === "Xăng E10 RON 95-III" ||
        name === "Xăng E5 RON 92-II"
      ) {
        result[name] = price;
      }
    });

    spin.stop(color.yellowBright("Bảng giá xăng hôm nay của sếp đây ạ"));

    Object.entries(result).forEach(([key, value]) => {
      console.log(`- ${key}:\t${value}`);
    })

    await sleep(500);
  }
}
