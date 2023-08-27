import { PicoAppRegion } from "./def/pico-data";
import { getPicoApps, savePicoImages, savePicoInfo } from "./pico";

async function fetchPicoData(region: PicoAppRegion) {
    let apps = await getPicoApps(region);
    await savePicoImages(apps, region);
}

async function fetchPico() {
    await fetchPicoData(PicoAppRegion.GLOBAL);
    await fetchPicoData(PicoAppRegion.CHINA);
}

fetchPico();