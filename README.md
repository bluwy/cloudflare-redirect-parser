# cloudflare-redirect-parser

Parse Cloudflare's \_redirects file following https://developers.cloudflare.com/pages/platform/redirects/.

## Usage

```js
import { parse, createRedirect } from 'cloudflare-redirect-parser'

const redirectsString = '<string read from _redirects>'

const parsed = parse(redirectsString)
// output: RedirectEntry[]

const redirect = createRedirect(redirectsString) // or pass `parsed`
// output: (url: string) => RedirectResult | undefined
```

See [index.d.ts](./index.d.ts) for types.

## Sponsors

<p align="center">
  <a href="https://bjornlu.com/sponsor">
    <img src="https://bjornlu.com/sponsors.svg" alt="Sponsors" />
  </a>
</p>

## License

MIT
