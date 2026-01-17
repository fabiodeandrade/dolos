# Dolos

Uma biblioteca TypeScript avançada para manipulação de requisições HTTP com geração inteligente de headers, user agents e fingerprints de navegador.

## Propósito

O Dolos foi desenvolvido para ajudar desenvolvedores a criar requisições HTTP que se comportam como navegadores reais, evitando detecções e bloqueios. A biblioteca gera headers realistas, user agents atualizados e fingerprints geográficos baseados em dados em tempo real.

## Instalação

```bash
# Usando npm
npm install dolos

# Usando yarn
yarn add dolos

# Usando pnpm
pnpm add dolos
```

## Configuração

```typescript
import { RequestDolos } from 'dolos';

const dolos = new RequestDolos();
```

## API

#### `randomUserAgent(browser?: BrowserType): string`

Retorna um user agent aleatório baseado no navegador especificado.

**Parâmetros:**
- `browser` (opcional): Tipo do navegador - `'chrome' | 'firefox' | 'safari' | 'edge'`

**Retorno:** String com user agent formatado

**Exemplo:**
```typescript
const ua = dolos.randomUserAgent('chrome');
console.log(ua);
// "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36..."
```

---

#### `generateUserAgent(os?: 'windows' | 'linux' | 'mac'): Promise<string>`

Gera um user agent dinâmico baseado na versão mais recente do Chrome.

**Parâmetros:**
- `os` (opcional): Sistema operacional - `'windows' | 'linux' | 'mac'`

**Retorno:** Promise<string> com user agent atualizado

**Exemplo:**
```typescript
const ua = await dolos.generateUserAgent('windows');
console.log(ua);
// "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
```

---

#### `googleReferer(url: string): string`

Gera um referer que simula tráfego vindo do Google Search.

**Parâmetros:**
- `url`: URL de destino

**Retorno:** String com URL do Google Search

**Exemplo:**
```typescript
const referer = dolos.googleReferer('https://example.com/page');
console.log(referer);
// "https://www.google.com/search?q=example"
```

---

#### `socialReferer(url: string, source?: 'facebook' | 'twitter' | 'linkedin'): string`

Gera um referer que simula tráfego vindo de redes sociais.

**Parâmetros:**
- `url`: URL de destino
- `source` (opcional): Rede social - `'facebook' | 'twitter' | 'linkedin'` (padrão: `'facebook'`)

**Retorno:** String com URL da rede social

**Exemplo:**
```typescript
const referer = dolos.socialReferer('https://example.com', 'twitter');
console.log(referer);
// "https://t.co/redirect?url=https%3A%2F%2Fexample.com"
```

---

#### `getGeoHeadersByIp(ip: string): Promise<GeoHeaders>`

Busca informações geográficas baseadas em um IP e gera headers correspondentes.

**Parâmetros:**
- `ip`: Endereço IP para consulta

**Retorno:** Promise<GeoHeaders> com headers geográficos

**Exemplo:**
```typescript
const geoHeaders = await dolos.getGeoHeadersByIp('8.8.8.8');
console.log(geoHeaders);
// {
//   'Accept-Language': 'en-US,en;q=0.9',
//   timezone: 'America/Chicago',
//   timezoneOffset: -21600,
//   country: 'United States',
//   countryCode: 'US',
//   city: 'Mountain View',
//   region: 'California',
//   currency: 'USD',
//   lat: 37.4056,
//   lon: -122.0775
// }
```

---

#### `getClientHints(options?: ClientHintsOptions): Promise<ClientHints>`

Gera headers de Client Hints do navegador baseados em plataforma e navegador.

**Parâmetros:**
- `options` (opcional):
  - `platform`: `'windows' | 'linux' | 'mac'`
  - `browser`: `'chrome' | 'edge'`
  - `mobile`: boolean

**Retorno:** Promise<ClientHints> com headers de Client Hints

**Exemplo:**
```typescript
const clientHints = await dolos.getClientHints({
  platform: 'windows',
  browser: 'chrome',
  mobile: false
});
console.log(clientHints);
// {
//   'Sec-CH-UA': '"Google Chrome";v="120", "Chromium";v="120", "Not_A Brand";v="24"',
//   'Sec-CH-UA-Mobile': '?0',
//   'Sec-CH-UA-Platform': '"Windows"',
//   'Sec-CH-UA-Platform-Version': '"15.0.0"',
//   'Sec-CH-UA-Full-Version-List': '"Google Chrome";v="120.0.0.0", "Chromium";v="120.0.0.0", "Not_A Brand";v="24.0.0.0"'
// }
```

---

#### `getOriginHeaders(targetUrl: string, options?: OriginOptions): OriginHeaders`

Gera headers de Origin, Referer e Sec-Fetch para simular diferentes fontes de tráfego.

**Parâmetros:**
- `targetUrl`: URL de destino
- `options` (opcional):
  - `source`: Fonte do tráfego - `'direct' | 'google' | 'bing' | 'facebook' | 'twitter' | 'linkedin' | 'same-origin' | 'same-site'`
  - `dest`: Tipo de destino - `'document' | 'script' | 'style' | 'image' | 'font' | 'empty'`
  - `mode`: Modo da requisição - `'navigate' | 'cors' | 'no-cors' | 'same-origin'`

**Retorno:** OriginHeaders com headers de origem

**Exemplo:**
```typescript
const originHeaders = dolos.getOriginHeaders('https://example.com', {
  source: 'google',
  dest: 'document',
  mode: 'navigate'
});
console.log(originHeaders);
// {
//   Origin: 'https://www.google.com',
//   Referer: 'https://www.google.com/search?q=example',
//   'Sec-Fetch-Site': 'cross-site',
//   'Sec-Fetch-Mode': 'navigate',
//   'Sec-Fetch-Dest': 'document',
//   'Sec-Fetch-User': '?1'
// }
```

## Exemplos de Uso

### Requisição HTTP Completa

```typescript
import { RequestDolos } from 'dolos';

const dolos = new RequestDolos();

async function makeRequest() {
  // Gerar headers realistas
  const userAgent = await dolos.generateUserAgent('windows');
  const clientHints = await dolos.getClientHints({ platform: 'windows', browser: 'chrome' });
  const originHeaders = dolos.getOriginHeaders('https://example.com', { source: 'google' });
  const geoHeaders = await dolos.getGeoHeadersByIp('8.8.8.8');

  // Combinar todos os headers
  const headers = {
    'User-Agent': userAgent,
    ...clientHints,
    ...originHeaders,
    ...geoHeaders,
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Encoding': 'gzip, deflate, br',
    'Connection': 'keep-alive',
    'Upgrade-Insecure-Requests': '1',
  };

  // Fazer requisição
  const response = await fetch('https://example.com', { headers });
  console.log(await response.text());
}

makeRequest();
```

### Variação de User Agents

```typescript
// User agent aleatório de qualquer navegador
const randomUA = dolos.randomUserAgent();

// User agent específico do Firefox
const firefoxUA = dolos.randomUserAgent('firefox');

// User agent dinâmico do Chrome
const chromeUA = await dolos.generateUserAgent('mac');
```

## Suporte Geográfico

A biblioteca suporta mais de 60 países com configurações de idioma e fuso horário automáticos:

- Estados Unidos (en-US)
- Brasil (pt-BR)
- Reino Unido (en-GB)
- Alemanha (de-DE)
- França (fr-FR)
- Japão (ja-JP)
- E muitos mais...

## Segurança e Privacidade

- User agents são gerados usando dados públicos do Chromium
- Dados geográficos são obtidos através de API pública
- Nenhuma informação pessoal é armazenada
- Todos os dados são gerados dinamicamente


## Contribuição

Contribuições são bem-vindas! Por favor:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/amazing-feature`)
3. Commit suas mudanças (`git commit -m 'Add amazing feature'`)
4. Push para a branch (`git push origin feature/amazing-feature`)
5. Abra um Pull Request

## Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## Issues

Encontrou um bug? Tem uma sugestão? [Abra uma issue](https://github.com/fabioandrade/dolos/issues) no GitHub.

## Status do Projeto

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![TypeScript](https://img.shields.io/badge/typescript-%5E5.9.3-blue)
