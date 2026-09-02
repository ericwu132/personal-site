/**
 * Intro line variants. Add or reword freely — one is picked per page load.
 *
 * These are prefixes: the name itself is the drawn signature underneath, so
 * each line should read as leading into it rather than standing alone.
 */
const GREETINGS = [
  'hi! my name is',
  'hi! i’m',
  'hello! i’m',
  'hey! i’m',
  'hi there! i’m',
  'hello, i’m',
  'hey there! i’m',
  // Times New Roman has no CJK glyphs; index.css falls through to a CJK
  // serif so this renders in keeping with the rest rather than in a
  // mismatched system sans.
  '你好! i’m',
]

const LAST_KEY = 'intro:last'

/**
 * Picks a greeting, excluding whichever one this tab showed last — a repeat
 * two loads running reads as a bug rather than as randomness. sessionStorage
 * is per-tab and cleared when it closes, and every access is guarded: private
 * browsing and blocked site data both make it throw.
 */
function pick(): string {
  let last: string | null = null
  try {
    last = sessionStorage.getItem(LAST_KEY)
  } catch {
    // Storage unavailable; fall through to an unfiltered pick.
  }

  const pool = GREETINGS.filter((g) => g !== last)
  const choices = pool.length > 0 ? pool : GREETINGS
  const chosen = choices[Math.floor(Math.random() * choices.length)]

  try {
    sessionStorage.setItem(LAST_KEY, chosen)
  } catch {
    // Nothing to remember by; the next load just picks freely.
  }

  return chosen
}

/**
 * The greeting for this page load. Module scope, deliberately: it is chosen
 * once on import, so it stays put across client-side navigation and only
 * rerolls on a real reload.
 */
export const greeting = pick()

/**
 * Whether the intro has already played this page load. Same reasoning as
 * above — coming back from /projects shouldn't replay the typing, but a
 * reload should.
 */
let seen = false

export const introSeen = () => seen

export const markIntroSeen = () => {
  seen = true
}
