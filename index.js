/** @type {import('./index').parse} */
export function parse(str) {
  /** @type {import('./index').RedirectEntry[]} */
  const entries = []

  for (let line of str.split(/[\r\n]+/)) {
    line = line.trim()
    if (line.startsWith('#')) continue

    let [from, to, status] = line.split(/\s+/, 3)
    if (!from || !to || to.startsWith('#')) continue

    if (status?.startsWith('#')) {
      status = undefined
    } else {
      status = +status || undefined
    }

    entries.push({ from, to, status })
  }

  return entries
}

const validStatuses = new Set([301, 302, 303, 307, 308])

/** @type {import('./index').createRedirect} */
export function createRedirect(str) {
  let entries = typeof str === 'string' ? parse(str) : str
  entries = entries.filter(
    (entry) => !entry.status || validStatuses.has(entry.status)
  )

  for (const entry of entries) {
    const matchers = []
    let regexStr = entry.from.replace(/:\w+/g, (match) => {
      matchers.push(match)
      return '([^/]+)'
    })
    if (regexStr.endsWith('*')) {
      matchers.push(':splat')
      regexStr = regexStr.replace(/\*$/, '(.*)')
    }
    entry._re = new RegExp(`^${regexStr}$`)
    entry._to = (match) => {
      let to = entry.to
      for (let i = 1; i < match.length; i++) {
        to = to.replace(matchers[i - 1], match[i])
      }
      return to
    }
  }

  return (url) => {
    for (const entry of entries) {
      const match = entry._re.exec(url)
      if (match) {
        return {
          status: entry.status || 302,
          to: entry._to(match)
        }
      }
    }
  }
}
