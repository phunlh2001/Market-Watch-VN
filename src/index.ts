import {
  autocompleteMultiselect,
  confirm,
  intro,
  isCancel,
  cancel,
  outro,
} from "@clack/prompts";
import color from "picocolors";
import { setTimeout as sleep } from "node:timers/promises";
import Binance from "./services/binance.js";
import {
  BINANCE_APIKEY,
  BINANCE_SECRETKEY,
  PVOIL_ENDPOINT,
} from "./constants/env.js";
import PvOil from "./services/pvoil.js";

async function main(): Promise<void> {
  let shouldContinue: boolean | symbol;

  const _pvOilEndpoint = PVOIL_ENDPOINT;
  if (!_pvOilEndpoint) {
    throw new Error("Thiếu pvoil endpoint rồi sếp ơi!!!");
  }

  const _apiKey = BINANCE_APIKEY;
  const _secret = BINANCE_SECRETKEY;
  if (!_apiKey || !_secret) {
    throw new Error("Thiếu key từ Binance rồi sếp ơi!!!");
  }

  const pvOil = new PvOil(_pvOilEndpoint);
  const binance = new Binance(_apiKey, _secret);

  do {
    console.log();
    intro(color.cyan("=========== Nay sếp muốn kiểm tra món gì? ==========="));

    const selected = await autocompleteMultiselect({
      message: "Hãy chọn danh mục muốn kiểm tra:",
      options: [
        { value: "all", label: "Tất cả" },
        { value: "gasoline", label: "Giá xăng hôm nay" },
        { value: "btc", label: "Bitcoin" },
        { value: "eth", label: "Ethereum" },
        { value: "usdt", label: "Tether USD (USDT)" },
        { value: "vn30", label: "ETF VN30" },
        { value: "vnd", label: "ETF VN Diamond" },
      ],
    });

    if (isCancel(selected)) {
      cancel("Sếp đã dừng chương trình rồi :(");
      return;
    }

    selected.forEach(async (v) => {
      switch (v) {
        case "gasoline":
          await pvOil.checkCurrentPrices();
          await sleep(500);
          break;
        case "btc":
          await binance.checkBTC();
          await sleep(500);
          break;
        case "eth":
          await binance.checkETH();
          await sleep(500);
          break;
        case "usdt":
          await binance.checkUSDT();
          await sleep(500);
          break;
        case "vn30":
          console.log("Check ETF VND30 prices");
          break;
        case "vnd":
          console.log("Check ETF Diamond prices");
          break;
        case "all":
          console.log("Check all things");
          break;
      }
    });

    await sleep(1000);

    shouldContinue = await confirm({
      message: "Sếp có muốn coi tiếp các danh mục khác hong?",
      active: "OK Luôn",
      inactive: "Thôi đủ rồi",
    });

    console.log();
  } while (!isCancel(shouldContinue) && shouldContinue);

  outro(color.green("Hẹn gặp lại sếp!"));
}

main().catch(console.error);
