export interface BrowserFingerprint {
    userAgent: string;
    viewport: {
        width: number;
        height: number;
    };
    timezone: string;
    language: string;
    languages: string[];
    platform: string;
    colorDepth: number;
    deviceMemory: number;
    hardwareConcurrency: number;
    screenResolution: {
        width: number;
        height: number;
    };
}

export interface TLSOptions {
    minVersion: 'TLSv1.2' | 'TLSv1.3';
    maxVersion: 'TLSv1.2' | 'TLSv1.3';
    ciphers: string;
    honorCipherOrder: boolean;
}

export interface Cookie {
    name: string;
    value: string;
    domain: string;
    path: string;
    expires?: Date;
    httpOnly: boolean;
    secure: boolean;
    sameSite?: 'Strict' | 'Lax' | 'None';
}

export type RefererSource = 'google' | 'bing' | 'facebook' | 'twitter' | 'linkedin' | 'direct' | 'random';

export type BrowserType = 'chrome' | 'firefox' | 'safari' | 'edge';

export interface GeoLocation {
    status: string;
    continent: string;
    continentCode: string;
    country: string;
    countryCode: string;
    region: string;
    regionName: string;
    city: string;
    district: string;
    zip: string;
    lat: number;
    lon: number;
    timezone: string;
    offset: number;
    currency: string;
    isp: string;
    org: string;
    as: string;
    asname: string;
    mobile: boolean;
    proxy: boolean;
    hosting: boolean;
    query: string;
}

export interface GeoHeaders {
    'Accept-Language': string;
    timezone: string;
    timezoneOffset: number;
    country: string;
    countryCode: string;
    city: string;
    region: string;
    currency: string;
    lat: number;
    lon: number;
}

export interface ClientHints {
    'Sec-CH-UA': string;
    'Sec-CH-UA-Mobile': string;
    'Sec-CH-UA-Platform': string;
    'Sec-CH-UA-Platform-Version': string;
    'Sec-CH-UA-Full-Version-List': string;
}

export type Platform = 'windows' | 'linux' | 'mac';
export type Browser = 'chrome' | 'edge';

export type OriginType = 'same-origin' | 'same-site' | 'cross-site' | 'none';

export interface OriginHeaders {
    Origin: string | null;
    Referer: string | null;
    'Sec-Fetch-Site': OriginType;
    'Sec-Fetch-Mode': 'navigate' | 'cors' | 'no-cors' | 'same-origin';
    'Sec-Fetch-Dest': 'document' | 'script' | 'style' | 'image' | 'font' | 'empty';
    'Sec-Fetch-User'?: '?1';
}