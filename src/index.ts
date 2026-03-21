import {
  autocompleteMultiselect,
  confirm,
  intro,
  isCancel,
  cancel,
  outro,
  spinner,
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
import VnStock from "./services/vnstock.js";

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
  const vnStock = new VnStock();

  const spin = spinner();
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
          await pvOil.checkCurrentPrices(spin);
          break;
        case "btc":
          await binance.checkBTC(spin);
          break;
        case "eth":
          await binance.checkETH(spin);
          break;
        case "usdt":
          await binance.checkUSDT(spin);
          break;
        case "vn30":
          await vnStock.checkVn30();
          break;
        case "vnd":
          await vnStock.checkVnDiamond();
          break;
        case "all":
          console.log("Check all things");
          break;
      }
    });

    await sleep(1000);

    shouldContinue = await confirm({
      message: color.magenta("Sếp có muốn coi tiếp các danh mục khác hong?"),
      active: "OK Luôn",
      inactive: "Thôi đủ rồi",
    });

    console.log();
  } while (!isCancel(shouldContinue) && shouldContinue);

  outro(color.green("Hẹn gặp lại sếp!"));
}

main().catch(console.error);
