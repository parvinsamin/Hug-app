export type User = {
    id: number
    fullname: string
    username: string
    language_code: string
    country_code: string
    date_format: "shamsi" | "miladi"
    deviceId: string
}

export type FastRegisterResponse = {
    result: boolean
    message: string
    statusCode: number
    accessToken?: string
    refreshToken?: string
    data: User[]
}

export interface CountryData {
    id: number;
    name: string;
    phone_code: string;
    currency: string;
    lang: string;
    code: string;
    flag: string;
    hug_address: number;
    is_active: number;
    longitude: number;
    latitude: number;
    allow_city_list: number;
    allow_province_list: number;
    allow_district_list: number;
    allow_postal_code: number;
    hug_approval_status: number;
    date_format: string;
    can_change_email: number;
    can_change_mobile: number;
    sms_panel: number;
    country_code: string;

    // language info
    lang_id: number;
    lang_title: string;
    lang_code: string;
    lang_direction: "ltr" | "rtl";
    lang_enable: number;
    lang_default: number;
}

export interface WhereAmIData {
    range: number[];
    country: string;
    region: string;
    eu: string;
    timezone: string;
    city: string;
    ll: [number, number];
    metro: number;
    area: number;
    countryData: CountryData | null;
    isDefaultUsed: boolean;
}

export interface WhereAmIResponse {
    result: boolean;
    message: string;
    statusCode: number;
    data: WhereAmIData;
}





