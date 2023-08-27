import { PICO_OPTS, PicoAppRegion } from "./def/pico-data";
import fs from 'fs/promises';
import { getPicoApps } from "./pico";

async function fetchPicoIcons(region: PicoAppRegion) {
    await fs.mkdir(`pico/assets/${region}/icon`, { recursive: true });

    let packageList = (await getPicoApps(region)).map(a => a.package_name);

    console.log(`[PICO ${region.toUpperCase()}] Saving app icons...`);
    for (let i = 0; i < packageList.length; i++) {
        let packageName = packageList[i];
        console.log(`[PICO ${region.toUpperCase()}] Saving app icons... (${i + 1}/${packageList.length}) | ${packageName}`);

        try {
            let res = await fetch(
                `https://appstore-${region}.picovr.com/api/app/v1/item/info`
                + `?manifest_version_code=${PICO_OPTS.manifestVerCode}&app_language=${PICO_OPTS.appLang}&device_name=${PICO_OPTS.deviceName}`
                + `&package_name=${packageName}`,
                {
                    method: 'POST',
                });

            let app = (await res.json()).data;

            await fs.writeFile(`pico/assets/${region}/icon/${app.package_name}.png_tmp`, (await fetch(app.icon)).body as any);
            await fs.rename(`pico/assets/${region}/icon/${app.package_name}.png_tmp`, `pico/assets/${region}/icon/${app.package_name}.png`);
        } catch (e) {
            console.log(`[PICO ${region.toUpperCase()}] Error saving icon for ${packageName}`);
            try {
                await fs.rm(`pico/assets/${region}/icon/${packageName}.png_tmp`);
            } catch {}
        }
    }
}

async function fetchAllPicoIcons() {
    fetchPicoIcons(PicoAppRegion.GLOBAL);
    fetchPicoIcons(PicoAppRegion.CHINA);
}

fetchAllPicoIcons();