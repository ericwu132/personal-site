import { useState } from 'react'
import { Link } from 'react-router-dom'
import TextType from '../components/TextType'
import AnimatedContent from '../components/AnimatedContent'
import Nav from '../components/Nav'
import Terminal from '../components/Terminal'
import Signature from '../components/Signature'
import { greeting, introSeen, markIntroSeen } from '../intro'

// Everything below the name arrives at once, on a short stagger from page
// load — so the page reads as finished while the signature is still drawing,
// rather than the old chain where nothing existed for the first three seconds.
//
//   0ms   120ms  220ms      400ms                            ~3.7s
//   |------|------|----------|-------------------------------|
//   load   subtext tabs      hint          signature finishes drawing
//
const SIGNATURE_MS = 2400
const SUBTEXT_DELAY = 120
const NAV_DELAY = 220
const HINT_DELAY = 400

export default function Home() {
  // Read once, at mount: the intro plays on a fresh load, but not when the
  // visitor comes back here from another route.
  const [skip] = useState(introSeen)

  // Only the signature still waits on the greeting; everything else is
  // independent and animates on mount.
  const [typed, setTyped] = useState(skip)

  return (
    <main className="hero">
      <div className="hero-intro">
        <h1 className="hero-name">
          <TextType text={greeting} skip={skip} onComplete={() => setTyped(true)} />
        </h1>

        <Signature
          show={typed}
          skip={skip}
          durationMs={SIGNATURE_MS}
          onComplete={markIntroSeen}
        />

        <AnimatedContent show skip={skip} delay={SUBTEXT_DELAY}>
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

        <Nav show skip={skip} baseDelay={NAV_DELAY} />

        <Terminal show skip={skip} hintDelay={skip ? 0 : HINT_DELAY} />
      </div>

      <AnimatedContent
        className="hero-photos"
        show
        skip={skip}
        delay={120}
        duration={700}
      >
        <img
          className="hero-portrait"
          src="/headshot.png"
          alt="Eric smiling"
          width={480}
          height={480}
        />
        <Link className="hero-project" to="/projects/omni-assist">
          <img
            src="/omniassist.jpg"
            alt="Omni-assist motorized wheelchair attachment with exposed electronics and an aluminum frame"
            width={1024}
            height={778}
          />
          <span className="hero-project-caption">omni-assist <span aria-hidden="true">↗</span></span>
        </Link>
      </AnimatedContent>
    </main>
  )
}
