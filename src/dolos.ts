import { RequestDolos } from './request/request.dolos.js';

export * from './request/types.js';

const dolos = new RequestDolos();

console.log(await dolos.generateUserAgent('mac'));
console.log(await dolos.getGeoHeadersByIp('186.214.59.224'));
console.log(dolos.randomUserAgent());
console.log(dolos.socialReferer('https://www.frota162.com.br/', 'twitter'));
console.log(dolos.googleReferer('https://www.frota162.com.br/'));
console.log(await dolos.getClientHints());
console.log(await dolos.getClientHints({ platform: 'mac', browser: 'chrome', mobile: true }));
console.log(dolos.getOriginHeaders('https://www.frota162.com.br/', { source: 'facebook' }))

