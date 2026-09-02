import { useState } from 'react'
import TextType from '../components/TextType'
import AnimatedContent from '../components/AnimatedContent'
import Nav from '../components/Nav'
import Terminal from '../components/Terminal'
import Signature from '../components/Signature'
import { greeting, introSeen, markIntroSeen } from '../intro'

// The reveal runs one stage at a time, each waiting for the last to settle:
//
//   greeting types → signature draws (~2.4s) → then, from that moment:
//
//   0ms        500ms              1200ms        1700ms         2400ms
//   |-----------|------------------|--------------|--------------|
//   sig. done   [ subtext fades in ]              [ tabs cascade ]
//
const SIGNATURE_MS = 2400
const FADE_MS = 700 // matches AnimatedContent's default duration
const GAP_MS = 500 // breathing room between stages
const SUBTEXT_DELAY = GAP_MS
const NAV_DELAY = SUBTEXT_DELAY + FADE_MS + GAP_MS
// The terminal hint is furniture, not a stage — it drifts in well after.
const HINT_DELAY = NAV_DELAY + FADE_MS + 800

export default function Home() {
  // Read once, at mount: the intro plays on a fresh load, but not when the
  // visitor comes back here from another route.
  const [skip] = useState(introSeen)

  // The chain: greeting typed → signature drawn → everything else.
  const [typed, setTyped] = useState(skip)
  const [revealed, setRevealed] = useState(skip)

  return (
    <main className="hero">
      <h1 className="hero-name">
        <TextType text={greeting} skip={skip} onComplete={() => setTyped(true)} />
      </h1>

      <Signature
        show={typed}
        skip={skip}
        durationMs={SIGNATURE_MS}
        onComplete={() => {
          markIntroSeen()
          setRevealed(true)
        }}
      />

      <AnimatedContent show={revealed} skip={skip} delay={SUBTEXT_DELAY}>
        <p className="hero-subtitle">
          mechatronics engineering @{' '}
          <a className="text-link" href="https://uwaterloo.ca/engineering/about" target="_blank" rel="noreferrer">
            uwaterloo
          </a>
          
          <br />
          prev. electromechanical engineer @{' '}
          <a
            className="text-link"
            href="https://www.spydercontrols.com/"
            target="_blank"
            rel="noreferrer"
          >
            spyder controls
          </a>
        </p>
      </AnimatedContent>

      <Nav show={revealed} skip={skip} baseDelay={NAV_DELAY} />

      <Terminal show={revealed} skip={skip} hintDelay={skip ? 0 : HINT_DELAY} />
    </main>
  )
}
