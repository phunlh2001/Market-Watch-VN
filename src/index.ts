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
import Binance from "./services/binance.js";
import {
  BINANCE_APIKEY,
  BINANCE_SECRETKEY,
  PVOIL_ENDPOINT,
} from "./constants/env.js";
import PvOil from "./services/pvoil.js";
import VnStock from "./services/vnstock.js";

async function main(): Promise<void> {
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

  let shouldContinue: boolean | symbol;
  const spin = spinner();
  do {
    console.clear();
    intro(color.cyan("=========== Nay sếp muốn kiểm tra món gì? ==========="));

    const selected = await autocompleteMultiselect({
      message: "Hãy chọn danh mục muốn kiểm tra:",
      options: [
        { value: "all", label: "Tất cả" },
        { value: "gasoline", label: "Giá xăng hôm nay" },
        { value: "gold", label: "Giá vàng hôm nay" },
        { value: "btc", label: "Bitcoin" },
        { value: "eth", label: "Ethereum" },
        { value: "vn30", label: "ETF VN30" },
        { value: "vnd", label: "ETF VN Diamond" },
      ],
    });

    if (isCancel(selected)) {
      cancel("Sếp đã dừng chương trình rồi :(");
      return;
    }

    if (selected.length > 0) {
      spin.start(color.yellow("Đang lấy thông tin"));
    }

    for (let v of selected) {
      switch (v) {
        case "gasoline":
          await pvOil.checkGasolineCurrentPrices(spin);
          break;
        case "gold":
          await vnStock.checkSJC(spin);
          break;
        case "btc":
          await binance.checkBTC(spin);
          break;
        case "eth":
          await binance.checkETH(spin);
          break;
        case "vn30":
          await vnStock.checkVn30(spin);
          break;
        case "vnd":
          await vnStock.checkVnDiamond(spin);
          break;
        case "all":
          spin.stop(color.yellowBright("Bảng giá các thông tin sếp quan tâm đây ạ"));
          await pvOil.checkGasolineCurrentPrices();
          await vnStock.checkVn30();
          await vnStock.checkVnDiamond();
          await binance.checkBTC();
          await binance.checkETH();
          await vnStock.checkSJC();
          break;
      }
    }

    shouldContinue = await confirm({
      message: color.magenta("Sếp có muốn coi tiếp các danh mục khác hong?"),
      active: "Ok luôn",
      inactive: "Thôi đủ rồi",
    });
  } while (!isCancel(shouldContinue) && shouldContinue);

  outro(color.green("Hẹn gặp lại sếp!"));
}

main().catch(console.error);
