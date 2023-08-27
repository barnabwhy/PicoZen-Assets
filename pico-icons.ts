import { PICO_OPTS, PicoAppRegion } from "./pico-data";
import fs from 'fs/promises';

async function fetchPicoIcons(region: PicoAppRegion) {
    await fs.mkdir(`pico/${region}/assets/icon`, { recursive: true });

    let packageList = (await fs.readdir(`pico/${region}/info`)).map(f => f.replace(/\.json$/, ''));

    console.log(`[PICO ${region.toUpperCase()}] Saving app icons...`)
    for (let i = 0; i < packageList.length; i++) {
        let packageName = packageList[i];

        
    console.log(`[PICO ${region.toUpperCase()}] Saving app icons... (${i+1}/${packageList.length}) | ${packageName}`);

        let res = await fetch(
            `https://appstore-${region}.picovr.com/api/app/v1/item/info`
            + `?manifest_version_code=${PICO_OPTS.manifestVerCode}&app_language=${PICO_OPTS.appLang}&device_name=${PICO_OPTS.deviceName}`
            + `&package_name=${packageName}`,
            {
                method: 'POST',
            });
        let app = (await res.json()).data;
        fs.writeFile(`pico/${region}/assets/icon/${app.package_name}.png`, (await fetch(app.icon)).body as any)
    }
}

async function fetchAllPicoIcons() {
    fetchPicoIcons(PicoAppRegion.GLOBAL);
}

fetchAllPicoIcons();