export interface RedirectEntry {
  from: string
  to: string
  status?: number
}

export interface Redirect {
  (url: string): RedirectResult | undefined
}

export interface RedirectResult {
  to: string
  status: number
}

/**
 * Parse as an array of redirect entries
 * @param str The raw _redirects content
 */
export declare function parse(str: string): RedirectEntry[]

/**
 * Parse and create a redirect function that returns the redirected
 * url for a given request
 * @param str The raw _redirects content
 */
export declare function createRedirect(str: string | RedirectEntry[]): Redirect
