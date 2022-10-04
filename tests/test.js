import fs from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { suite } from 'uvu'
import * as assert from 'uvu/assert'
import { parse, createRedirect } from '../index.js'

const redirects = await fs.readFile(
  fileURLToPath(new URL('./_redirects', import.meta.url)),
  'utf-8'
)

const parsed = parse(redirects)
const redirect = createRedirect(redirects)

// static expectations from _redirects
// thanks GitHub Copilot for boilerplate
const expected = [
  {
    from: '/simple',
    to: '/simple-redirect',
    status: undefined,
    tests: {
      '/simple': '/simple-redirect'
    }
  },
  {
    from: '/simple/path',
    to: '/simple/path/redirect',
    status: undefined,
    tests: {
      '/simple/path': '/simple/path/redirect'
    }
  },
  {
    from: '/query-string',
    to: '/?query=string&redirect=true',
    status: undefined,
    tests: {
      '/query-string': '/?query=string&redirect=true'
    }
  },
  {
    from: '/trailing',
    to: '/trailing/',
    status: undefined,
    tests: {
      '/trailing': '/trailing/'
    }
  },
  {
    from: '/no-trailing/',
    to: '/no-trailing',
    status: undefined,
    tests: {
      '/no-trailing/': '/no-trailing'
    }
  },
  {
    from: '/placeholder/:is/:fun',
    to: '/placeholder/redirect/:is/:fun',
    status: undefined,
    tests: {
      '/placeholder/is/fun': '/placeholder/redirect/is/fun'
    }
  },
  {
    from: '/placeholder/:query',
    to: '/placeholder/redirect?query=:query',
    status: undefined,
    tests: {
      '/placeholder/query': '/placeholder/redirect?query=query'
    }
  },
  {
    from: '/catch-all/*',
    to: '/catch-all/redirect/:splat',
    status: undefined,
    tests: {
      '/catch-all': undefined,
      '/catch-all/': '/catch-all/redirect/',
      '/catch-all/path': '/catch-all/redirect/path',
      '/catch-all/path/': '/catch-all/redirect/path/'
    }
  },
  {
    from: '/placeholder/and/catch-all/:is/*',
    to: '/placeholder/and/catch-all/redirect/:is/:splat',
    status: undefined,
    tests: {
      '/placeholder/and/catch-all/is/fun':
        '/placeholder/and/catch-all/redirect/is/fun',
      '/placeholder/and/catch-all/is/fun/':
        '/placeholder/and/catch-all/redirect/is/fun/',
      '/placeholder/and/catch-all/is/fun/path':
        '/placeholder/and/catch-all/redirect/is/fun/path',
      '/placeholder/and/catch-all/is/fun/path/':
        '/placeholder/and/catch-all/redirect/is/fun/path/'
    }
  },
  {
    from: '/external-url',
    to: 'https://example.com',
    status: undefined,
    tests: {
      '/external-url': 'https://example.com'
    }
  },
  {
    from: '/external-url/placeholder/:is/:fun',
    to: 'https://example.com/:is/:fun',
    status: undefined,
    tests: {
      '/external-url/placeholder/is/fun': 'https://example.com/is/fun'
    }
  },
  {
    from: '/external-url/catch-all/*',
    to: 'https://example.com/:splat',
    status: undefined,
    tests: {
      '/external-url/catch-all': undefined,
      '/external-url/catch-all/': 'https://example.com/',
      '/external-url/catch-all/path': 'https://example.com/path',
      '/external-url/catch-all/path/': 'https://example.com/path/'
    }
  },
  {
    from: '/external-url/placeholder/and/catch-all/:is/*',
    to: 'https://example.com/:is/:splat',
    status: undefined,
    tests: {
      '/external-url/placeholder/and/catch-all/is/fun':
        'https://example.com/is/fun',
      '/external-url/placeholder/and/catch-all/is/fun/':
        'https://example.com/is/fun/',
      '/external-url/placeholder/and/catch-all/is/fun/path':
        'https://example.com/is/fun/path',
      '/external-url/placeholder/and/catch-all/is/fun/path/':
        'https://example.com/is/fun/path/'
    }
  },
  {
    from: '/status-code',
    to: '/status-code-redirect',
    status: 301,
    tests: {
      '/status-code': '/status-code-redirect'
    }
  },
  {
    from: '/status-code/query-string',
    to: '/status-code-redirect?query=string&redirect=true',
    status: 302,
    tests: {
      '/status-code/query-string':
        '/status-code-redirect?query=string&redirect=true'
    }
  },
  {
    from: '/status-code/trailing',
    to: '/status-code-trailing/',
    status: 303,
    tests: {
      '/status-code/trailing': '/status-code-trailing/'
    }
  },
  {
    from: '/status-code/no-trailing/',
    to: '/status-code-no-trailing',
    status: 307,
    tests: {
      '/status-code/no-trailing/': '/status-code-no-trailing'
    }
  },
  {
    from: '/status-code/placeholder/:is/:fun',
    to: '/status-code-redirect/:is/:fun',
    status: 308,
    tests: {
      '/status-code/placeholder/is/fun': '/status-code-redirect/is/fun'
    }
  },
  {
    from: '/status-code/catch-all/*',
    to: '/status-code-redirect/:splat',
    status: 301,
    tests: {
      '/status-code/catch-all': undefined,
      '/status-code/catch-all/': '/status-code-redirect/',
      '/status-code/catch-all/path': '/status-code-redirect/path',
      '/status-code/catch-all/path/': '/status-code-redirect/path/'
    }
  },
  {
    from: '/status-code/placeholder/and/catch-all/:is/*',
    to: '/status-code-redirect/:is/:splat',
    status: 302,
    tests: {
      '/status-code/placeholder/and/catch-all/is/fun':
        '/status-code-redirect/is/fun',
      '/status-code/placeholder/and/catch-all/is/fun/':
        '/status-code-redirect/is/fun/',
      '/status-code/placeholder/and/catch-all/is/fun/path':
        '/status-code-redirect/is/fun/path',
      '/status-code/placeholder/and/catch-all/is/fun/path/':
        '/status-code-redirect/is/fun/path/'
    }
  },
  {
    from: '/valid-to',
    to: '/valid-to-redirect',
    status: undefined,
    tests: {
      '/valid-to': '/valid-to-redirect'
    }
  },
  {
    from: '/valid-status',
    to: '/valid-status-redirect',
    status: 301,
    tests: {
      '/valid-status': '/valid-status-redirect'
    }
  },
  {
    from: '/invalid-status',
    to: '/invalid-status-redirect',
    status: 999,
    tests: {
      '/invalid-status': undefined
    }
  },
  {
    from: '/unsupported-status',
    to: '/unsupported-status-redirect',
    status: 200,
    tests: {
      '/unsupported-status': undefined
    }
  }
]

const _parse = suite('parse _redirects file')
_parse('length', () => {
  assert.equal(parsed.length, expected.length)
})
for (let i = 0; i < expected.length; i++) {
  const e = expected[i]
  const p = parsed[i]
  _parse(e.from, () => {
    assert.equal(e.from, p.from)
    assert.equal(e.to, p.to)
    assert.equal(e.status, p.status)
  })
}
_parse.run()

const _redirect = suite('redirect function')
for (const e of expected) {
  for (const [k, v] of Object.entries(e.tests)) {
    _redirect(`${e.from} - ${k}`, () => {
      const r = redirect(k)
      if (v === undefined) {
        assert.equal(r, undefined)
      } else {
        assert.equal(r?.to, v)
        assert.equal(r?.status, e.status || 302)
      }
    })
  }
}
_redirect.run()
