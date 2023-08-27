export const PICO_OPTS = {
    manifestVerCode: 300800000,
    appLang: 'en',
    deviceName: 'A8110',
}

export enum PicoSectionId {
    ALL_APPS_GLOBAL = 3,
    ALL_APPS_CHINA = 66
}

export enum PicoAppRegion {
    GLOBAL = 'us',
    CHINA = 'cn',
}

interface PicoAppDetall {
    app_category: string;
    app_control: string;
    app_developer: string;
    app_genres: string;
    app_languages: string;
    app_permissions: string;
    app_play_modes: string;
    app_private_policy: string;
    app_publisher: string;
    app_release_note: string;
    app_size: string;
    app_supported_platforms: string;
    app_supported_player_mode: string;
    app_term_of_service: string;
    app_update_time: string;
    app_version: string;
    app_web_site: string;
}

interface PicoAppRanking {
    navigation_id: number;
    section_id: number;
    type: number;
    name: string;
    sort: number;
    sort_name: string;
    tag_color: string;
}

export interface PicoAppInfo {
    item_id: number;
    name: string;
    abstract: string;
    currency: string;
    original_price: string;
    price: string;
    cover: {
        square: string;
        landscape: string;
    },
    type: number;
    entitlement_status: number;
    level_age: number,
    genres: string;
    is_offer_exist: boolean;
    item_type: number;
    version_code: number;
    discount_pct: number;
    age_rating_url: string;
    package_name: string;
    original_price_show: string;
    price_show: string;
    detail: PicoAppDetall;
    videos: {
        video_url: string;
        image_url: string;
    };
    rankings: PicoAppRanking[];
    sales_status: number;
    booking_status_switch: number;
    score: number;
    can_refund: number;
    refund_agreement: string;
    wish_list: {
        is_show: number;
        status: number;
    };
    server_expand_extra: string;
    safe_item_id: string;
    show_early_access_button: boolean;
    purchase_button_caption: number;
    support_cross_install: boolean;
    version: string;
}