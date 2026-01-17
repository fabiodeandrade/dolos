import {
    BrowserType,
    GeoLocation,
    GeoHeaders,
    ClientHints,
    Platform,
    Browser,
    OriginHeaders,
    OriginType,
} from './types.js';
import https from 'node:https';

export class RequestDolos {

    private static readonly COUNTRY_LANGUAGES: Record<string, string> = {
        US: 'en-US,en;q=0.9',
        GB: 'en-GB,en;q=0.9',
        BR: 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
        PT: 'pt-PT,pt;q=0.9,en;q=0.8',
        ES: 'es-ES,es;q=0.9,en;q=0.8',
        MX: 'es-MX,es;q=0.9,en;q=0.8',
        AR: 'es-AR,es;q=0.9,en;q=0.8',
        CO: 'es-CO,es;q=0.9,en;q=0.8',
        CL: 'es-CL,es;q=0.9,en;q=0.8',
        PE: 'es-PE,es;q=0.9,en;q=0.8',
        DE: 'de-DE,de;q=0.9,en;q=0.8',
        FR: 'fr-FR,fr;q=0.9,en;q=0.8',
        IT: 'it-IT,it;q=0.9,en;q=0.8',
        JP: 'ja-JP,ja;q=0.9,en;q=0.8',
        KR: 'ko-KR,ko;q=0.9,en;q=0.8',
        CN: 'zh-CN,zh;q=0.9,en;q=0.8',
        RU: 'ru-RU,ru;q=0.9,en;q=0.8',
        IN: 'hi-IN,hi;q=0.9,en-IN;q=0.8,en;q=0.7',
        CA: 'en-CA,en;q=0.9,fr-CA;q=0.8',
        AU: 'en-AU,en;q=0.9',
        NL: 'nl-NL,nl;q=0.9,en;q=0.8',
        BE: 'nl-BE,nl;q=0.9,fr-BE;q=0.8,en;q=0.7',
        PL: 'pl-PL,pl;q=0.9,en;q=0.8',
        SE: 'sv-SE,sv;q=0.9,en;q=0.8',
        NO: 'nb-NO,nb;q=0.9,en;q=0.8',
        DK: 'da-DK,da;q=0.9,en;q=0.8',
        FI: 'fi-FI,fi;q=0.9,en;q=0.8',
        TR: 'tr-TR,tr;q=0.9,en;q=0.8',
        SA: 'ar-SA,ar;q=0.9,en;q=0.8',
        AE: 'ar-AE,ar;q=0.9,en;q=0.8',
        IL: 'he-IL,he;q=0.9,en;q=0.8',
        TH: 'th-TH,th;q=0.9,en;q=0.8',
        VN: 'vi-VN,vi;q=0.9,en;q=0.8',
        ID: 'id-ID,id;q=0.9,en;q=0.8',
        MY: 'ms-MY,ms;q=0.9,en;q=0.8',
        PH: 'fil-PH,fil;q=0.9,en-PH;q=0.8,en;q=0.7',
        SG: 'en-SG,en;q=0.9,zh-SG;q=0.8',
        HK: 'zh-HK,zh;q=0.9,en-HK;q=0.8,en;q=0.7',
        TW: 'zh-TW,zh;q=0.9,en;q=0.8',
        ZA: 'en-ZA,en;q=0.9,af;q=0.8',
        NG: 'en-NG,en;q=0.9',
        EG: 'ar-EG,ar;q=0.9,en;q=0.8',
        UA: 'uk-UA,uk;q=0.9,ru;q=0.8,en;q=0.7',
        CZ: 'cs-CZ,cs;q=0.9,en;q=0.8',
        RO: 'ro-RO,ro;q=0.9,en;q=0.8',
        HU: 'hu-HU,hu;q=0.9,en;q=0.8',
        GR: 'el-GR,el;q=0.9,en;q=0.8',
        AT: 'de-AT,de;q=0.9,en;q=0.8',
        CH: 'de-CH,de;q=0.9,fr-CH;q=0.8,en;q=0.7',
        IE: 'en-IE,en;q=0.9,ga;q=0.8',
        NZ: 'en-NZ,en;q=0.9',
    };

    private static readonly USER_AGENTS: Record<BrowserType, string[]> = {
        chrome: [
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
            'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        ],
        firefox: [
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:120.0) Gecko/20100101 Firefox/120.0',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 14.2; rv:121.0) Gecko/20100101 Firefox/121.0',
            'Mozilla/5.0 (X11; Linux x86_64; rv:121.0) Gecko/20100101 Firefox/121.0',
            'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:121.0) Gecko/20100101 Firefox/121.0',
        ],
        safari: [
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_2) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_1) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 13_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15',
            'Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1',
        ],
        edge: [
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36 Edg/119.0.0.0',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0',
        ],
    };

    randomUserAgent(browser?: BrowserType): string {
        if (browser) {
            const agents = RequestDolos.USER_AGENTS[browser];
            return agents[Math.floor(Math.random() * agents.length)];
        }

        const allAgents = Object.values(RequestDolos.USER_AGENTS).flat();
        return allAgents[Math.floor(Math.random() * allAgents.length)];
    }


    async generateUserAgent(os?: 'windows' | 'linux' | 'mac'): Promise<string> {
        try {
            const milestone = await this.fetchChromeMilestone();
            const platform = os ?? this.randomOs();
            return this.buildUserAgent(milestone, platform);
        } catch {
            return this.randomUserAgent('chrome');
        }
    }

    googleReferer(url: string): string {
        const newReferer = new URL(url);
        const newDomain = newReferer.hostname.replace('www.', '').split('.')[0];
        return `https://www.google.com/search?q=${encodeURIComponent(newDomain)}`;
    }

    socialReferer(url: string, source: 'facebook' | 'twitter' | 'linkedin' = 'facebook'): string {
        const encodedUrl = encodeURIComponent(url);
        const sources: Record<string, string> = {
            facebook: `https://l.facebook.com/l.php?u=${encodedUrl}`,
            twitter: `https://t.co/redirect?url=${encodedUrl}`,
            linkedin: `https://www.linkedin.com/redir/redirect?url=${encodedUrl}`,
        };
        return sources[source];
    }

    async getGeoHeadersByIp(ip: string): Promise<GeoHeaders> {
        const geo = await this.fetchGeoLocationData(ip);
        return this.buildGeoHeaders(geo);
    }

    async getClientHints(options?: { platform?: Platform; browser?: Browser; mobile?: boolean }): Promise<ClientHints> {
        const milestone = await this.fetchChromeMilestone();
        const platform = options?.platform ?? this.randomOs();
        const browser = options?.browser ?? 'chrome';
        const mobile = options?.mobile ?? false;

        return this.buildClientHints(milestone, platform, browser, mobile);
    }

    getOriginHeaders(targetUrl: string, options?: {
        source?: 'direct' | 'google' | 'bing' | 'facebook' | 'twitter' | 'linkedin' | 'same-origin' | 'same-site';
        dest?: 'document' | 'script' | 'style' | 'image' | 'font' | 'empty';
        mode?: 'navigate' | 'cors' | 'no-cors' | 'same-origin';
    }): OriginHeaders {
        const target = new URL(targetUrl);
        const source = options?.source ?? 'direct';
        const dest = options?.dest ?? 'document';
        const mode = options?.mode ?? 'navigate';

        const { origin, referer, siteType } = this.buildOriginReferer(target, source);

        const headers: OriginHeaders = {
            Origin: origin,
            Referer: referer,
            'Sec-Fetch-Site': siteType,
            'Sec-Fetch-Mode': mode,
            'Sec-Fetch-Dest': dest,
        };

        if (mode === 'navigate' && dest === 'document') {
            headers['Sec-Fetch-User'] = '?1';
        }

        return headers;
    }

    private buildOriginReferer(target: URL, source: string): { origin: string | null; referer: string | null; siteType: OriginType } {
        const targetOrigin = target.origin;
        const targetDomain = this.extractRootDomain(target.hostname);

        switch (source) {
            case 'direct':
                return {
                    origin: null,
                    referer: null,
                    siteType: 'none',
                };

            case 'same-origin':
                return {
                    origin: targetOrigin,
                    referer: targetOrigin + '/',
                    siteType: 'same-origin',
                };

            case 'same-site': {
                const subdomain = `app.${targetDomain}`;
                const sameSiteOrigin = `${target.protocol}//${subdomain}`;
                return {
                    origin: sameSiteOrigin,
                    referer: sameSiteOrigin + '/',
                    siteType: 'same-site',
                };
            }

            case 'google':
                return {
                    origin: 'https://www.google.com',
                    referer: this.googleReferer(target.href),
                    siteType: 'cross-site',
                };

            case 'bing':
                return {
                    origin: 'https://www.bing.com',
                    referer: `https://www.bing.com/search?q=${encodeURIComponent(targetDomain)}`,
                    siteType: 'cross-site',
                };

            case 'facebook':
                return {
                    origin: 'https://www.facebook.com',
                    referer: this.socialReferer(target.href, 'facebook'),
                    siteType: 'cross-site',
                };

            case 'twitter':
                return {
                    origin: 'https://twitter.com',
                    referer: this.socialReferer(target.href, 'twitter'),
                    siteType: 'cross-site',
                };

            case 'linkedin':
                return {
                    origin: 'https://www.linkedin.com',
                    referer: this.socialReferer(target.href, 'linkedin'),
                    siteType: 'cross-site',
                };

            default:
                return {
                    origin: null,
                    referer: null,
                    siteType: 'none',
                };
        }
    }

    private extractRootDomain(hostname: string): string {
        const parts = hostname.replace('www.', '').split('.');
        if (parts.length >= 2) {
            return parts.slice(-2).join('.');
        }
        return hostname;
    }

    private buildClientHints(milestone: number, platform: Platform, browser: Browser, mobile: boolean): ClientHints {
        const platformNames: Record<Platform, string> = {
            windows: '"Windows"',
            linux: '"Linux"',
            mac: '"macOS"',
        };

        const platformVersions: Record<Platform, string> = {
            windows: '"15.0.0"',
            linux: '"6.5.0"',
            mac: '"14.2.0"',
        };

        const browserName = browser === 'edge' ? 'Microsoft Edge' : 'Google Chrome';
        const notABrandVersion = '24';

        const secChUa = browser === 'edge'
            ? `"${browserName}";v="${milestone}", "Chromium";v="${milestone}", "Not_A Brand";v="${notABrandVersion}"`
            : `"${browserName}";v="${milestone}", "Chromium";v="${milestone}", "Not_A Brand";v="${notABrandVersion}"`;

        const fullVersionList = browser === 'edge'
            ? `"${browserName}";v="${milestone}.0.0.0", "Chromium";v="${milestone}.0.0.0", "Not_A Brand";v="${notABrandVersion}.0.0.0"`
            : `"${browserName}";v="${milestone}.0.0.0", "Chromium";v="${milestone}.0.0.0", "Not_A Brand";v="${notABrandVersion}.0.0.0"`;

        return {
            'Sec-CH-UA': secChUa,
            'Sec-CH-UA-Mobile': mobile ? '?1' : '?0',
            'Sec-CH-UA-Platform': platformNames[platform],
            'Sec-CH-UA-Platform-Version': platformVersions[platform],
            'Sec-CH-UA-Full-Version-List': fullVersionList,
        };
    }

    private buildGeoHeaders(geo: GeoLocation): GeoHeaders {
        const language = RequestDolos.COUNTRY_LANGUAGES[geo.countryCode] ?? 'en-US,en;q=0.9';

        return {
            'Accept-Language': language,
            timezone: geo.timezone,
            timezoneOffset: geo.offset,
            country: geo.country,
            countryCode: geo.countryCode,
            city: geo.city,
            region: geo.regionName,
            currency: geo.currency,
            lat: geo.lat,
            lon: geo.lon,
        };
    }

    private randomOs(): 'windows' | 'linux' | 'mac' {
        const options: Array<'windows' | 'linux' | 'mac'> = ['windows', 'linux', 'mac'];
        return options[Math.floor(Math.random() * options.length)];
    }

    private buildUserAgent(milestone: number, os: 'windows' | 'linux' | 'mac'): string {
        const platforms: Record<'windows' | 'linux' | 'mac', string> = {
            windows: 'Windows NT 10.0; Win64; x64',
            linux: 'X11; Linux x86_64',
            mac: 'Macintosh; Intel Mac OS X 10_15_7',
        };

        return `Mozilla/5.0 (${platforms[os]}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${milestone}.0.0.0 Safari/537.36`;
    }

    private fetchChromeMilestone(): Promise<number> {
        return new Promise((resolve, reject) => {
            const url = 'https://chromiumdash.appspot.com/fetch_releases?channel=Stable&platform=Windows&num=1';

            const req = https.get(url, (res) => {
                if (res.statusCode !== 200) {
                    reject(new Error(`API returned ${res.statusCode}`));
                    return;
                }

                let data = '';
                res.on('data', (chunk) => { data += chunk; });
                res.on('end', () => {
                    try {
                        const releases = JSON.parse(data);
                        if (releases.length > 0 && releases[0].milestone) {
                            resolve(releases[0].milestone);
                        } else {
                            reject(new Error('No milestone found'));
                        }
                    } catch (e) {
                        reject(e);
                    }
                });
            });

            req.on('error', reject);
            req.setTimeout(5000, () => {
                req.destroy();
                reject(new Error('Request timeout'));
            });
        });
    }

    private fetchGeoLocationData(ip: string): Promise<GeoLocation> {
        return new Promise((resolve, reject) => {
            const url = `https://demo.ip-api.com/json/${ip}?fields=66842623&lang=en`;

            const options = {
                headers: {
                    'Accept': '*/*',
                    'Origin': 'https://ip-api.com',
                    'Referer': 'https://ip-api.com/',
                },
            };

            const req = https.get(url, options, (res) => {
                if (res.statusCode !== 200) {
                    reject(new Error(`GeoLocation API returned ${res.statusCode}`));
                    return;
                }

                let data = '';
                res.on('data', (chunk) => { data += chunk; });
                res.on('end', () => {
                    try {
                        const geo: GeoLocation = JSON.parse(data);
                        if (geo.status === 'success') {
                            resolve(geo);
                        } else {
                            reject(new Error(`GeoLocation failed: ${geo.status}`));
                        }
                    } catch (e) {
                        reject(e);
                    }
                });
            });

            req.on('error', reject);
            req.setTimeout(5000, () => {
                req.destroy();
                reject(new Error('GeoLocation API timeout'));
            });
        });
    }
}