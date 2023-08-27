import { PICO_OPTS, PicoAppInfo, PicoAppRegion, PicoSectionId } from "./def/pico-data";
import fs from "fs/promises";

export async function getPicoApps(region: PicoAppRegion) {
    let apps: PicoAppInfo[] = [];

    let page = 1;
    let pageSize = 1000; // Get them all at once :)
    let sectionId = region == PicoAppRegion.GLOBAL ? PicoSectionId.ALL_APPS_GLOBAL : PicoSectionId.ALL_APPS_CHINA;

    let hasMore = true;

    while (hasMore) {
        try {
            let res = await fetch(`https://appstore-${region}.picovr.com/api/app/v1/section/info`
                + `?manifest_version_code=${PICO_OPTS.manifestVerCode}&app_language=${PICO_OPTS.appLang}&device_name=${PICO_OPTS.deviceName}`
                + `&section_id=${sectionId}&size=${pageSize}&page=${page}`,
                {
                    method: "POST",
                }
            );

            let { code, msg, data } = await res.json();
            if (code != 0)
                throw new Error(`[PICO ${region.toUpperCase()}] An error occurred on Pico's API: ` + msg || 'Unknown error');

            hasMore = data.has_more;
            page++;

            if(!data.items)
                break;

            for (const item of data.items) {
                if(!apps.includes(item))
                    apps.push(item);
            }
                
            console.log(`[PICO ${region.toUpperCase()}] Fetching apps... ${apps.length} found`);
        } catch(e) {
            hasMore = false;
        }
    }

    return apps;
}

export async function savePicoInfo(apps: PicoAppInfo[], region: PicoAppRegion) {
    await fs.mkdir(`pico/${region}/info`, { recursive: true });

    console.log(`[PICO ${region.toUpperCase()}] Saving app info...`)
    for (const app of apps) {
        await fs.writeFile(`pico/${region}/info/${app.package_name}.json`, JSON.stringify(app));
    }
}
export async function savePicoImages(apps: PicoAppInfo[], region: PicoAppRegion) {
    await fs.mkdir(`pico/assets/${region}/banner`, { recursive: true });
    await fs.mkdir(`pico/assets/${region}/square`, { recursive: true });

    console.log(`[PICO ${region.toUpperCase()}] Saving app covers...`)
    for (let i = 0; i < apps.length; i++) {
        let app = apps[i];

        console.log(`[PICO ${region.toUpperCase()}] Saving app covers... (${i+1}/${apps.length}) | ${app.package_name}`)

        try {
            await fs.writeFile(`pico/assets/${region}/banner/${app.package_name}.png_tmp`, (await fetch(app.cover.landscape)).body as any);
            await fs.rename(`pico/assets/${region}/banner/${app.package_name}.png_tmp`, `pico/assets/${region}/banner/${app.package_name}.png`);
        } catch(e) {
            console.log(`[PICO ${region.toUpperCase()}] Error saving banner image for ${app.package_name}`);
            await fs.rm(`pico/assets/${region}/banner/${app.package_name}.png_tmp`);
        }

        try {
            await fs.writeFile(`pico/assets/${region}/square/${app.package_name}.png_tmp`, (await fetch(app.cover.square)).body as any);
            await fs.rename(`pico/assets/${region}/square/${app.package_name}.png_tmp`, `pico/assets/${region}/square/${app.package_name}.png`);
        } catch(e) {
            console.log(`[PICO ${region.toUpperCase()}] Error saving square image for ${app.package_name}`);
            await fs.rm(`pico/assets/${region}/square/${app.package_name}.png_tmp`);
        }

    }

    console.log(`[PICO ${region.toUpperCase()}] Saved app covers\n`)
}