import { PicoAppRegion } from "./def/pico-data";
import { getPicoApps, savePicoInfo } from "./pico";

async function fetchPicoData(region: PicoAppRegion) {
    let apps = await getPicoApps(region);
    await savePicoInfo(apps, region);
}

async function fetchPico() {
    await fetchPicoData(PicoAppRegion.GLOBAL);
    await fetchPicoData(PicoAppRegion.CHINA);
}

fetchPico();