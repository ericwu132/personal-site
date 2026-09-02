/** Project copy carried over from ericwu.work. Notes are still placeholder. */

export type Link = {
  label: string
  href: string
}

export type Project = {
  slug: string
  title: string
  blurb: string
  year: string
  /** Path under public/, e.g. '/boxbots.jpg'. */
  image?: string
  /** YouTube *embed* URL. Takes the place of `image` on the detail page. */
  video?: string
  /** Collaborators, write-ups, repos — anything worth linking beside the prose. */
  links?: Link[]
  body: string[]
}

/**
 * A dated entry. Shared shape behind both /notes and /work — `title` is the
 * role for work and the headline for notes, and `org` is where it happened,
 * which notes simply leave off.
 */
export type Entry = {
  slug: string
  title: string
  date: string
  /** Employer, team or publication. Rendered beside the date. */
  org?: string
  /** Optional link for `org`; only followed on the detail page. */
  orgUrl?: string
  /** Org logo, a path under public/ — shown at the right of the list row. */
  logo?: string
  body: string[]
}

export const projects: Project[] = [
  {
    slug: 'omni-assist',
    title: 'omni-assist',
    year: 'mar 2026',
    image: '/omniassist.jpg',
    blurb: 'a device that makes any chair autonomous. 1st in hardware & best use of viam @ YHack',
    body: [
      'built an autonomous navigation attachment that locks onto any standard wheelchair and drives it to spoken destinations like "take me to the door." The system ran three concurrent loops: a voice loop parsing speech into goal coordinates through ElevenLabs and an Anthropic LLM, a 10–20 Hz planning loop combining A* global planning with DWA + potential-field local control over a 4-layer spatial memory (LiDAR occupancy, ORB-feature landmarks, dynamic obstacle priors, learned traversal cost), and a 50–100 Hz motor loop on an Arduino Mega. The attachment clamps onto the wheelchair frame via a friction-drive mechanism, so the chair still works manually at any time.',
      'i was responsible for the electromechanical portion of this project. i used SolidWorks to design and 3d print wheel hubs, motor mounts, and the ratcheting clamp design that allows it to attach to almost any chair. two lipo batteries were wired in series to four VNH5019 motor drivers, all controlled by an arduino mega. the frame was built with scrap aluminium extrusions with holes drilled into them to attach the wheels and ratcheting systems.',
    ],
  },
  
  {
    slug: 'autonomous-self-driving-robot',
    title: 'autonomous self driving robot',
    year: 'jan 2026',
    // Still for the list view; the detail page shows the video instead.
    image: '/autonomous-robot.jpg',
    video: 'https://www.youtube.com/embed/ch-srK1s9WU',
    blurb:
      'a ros2 assignment for a self-navigating vehicle',
    body: [
      'I built a modular autonomy stack for a small-scale autonomous vehicle, focused on real-time environment mapping and path planning. This included a custom costmap that fused simulated LiDAR data with obstacle inflation to create a reliable navigable map of the surroundings.',
      'I then implemented a graph-based planner to generate efficient, collision-free routes, tuning parameters like map resolution and safety margins to balance smooth motion and performance.',
      'Containerized in Docker and visualized in Foxglove.',
    ],
  },
  {
    slug: 'waterloowash',
    title: 'waterloowash',
    year: 'dec 2025',
    image: '/waterloowash.png',
    blurb: 'a free website that makes doing the laundry at waterloo easier. 1st place @ figma hackathon',
    links: [{ label: 'ryan', href: 'https://wangdynasty.ca' }],
    body: [
      "We (Eric and Ryan) have had some crazy issues using laundry spaces in Waterloo. From flooded washers to waiting for over an hour for a free dryer at 3 AM, we've experienced it all. Because of this trauma, we really wanted to make an app that solves our issues. Doing laundry is such a mundane, boring, and oftentimes a time-wasting task, especially for first years. With our app, we gamified the chore of laundry, turning it into an interactive, community-based platform to improve communication, and most importantly save time.",
      'This app, WaterlooWash, was created using Figma and Figma Make. Full app implementation coming soon.',
    ],
  },
  {
    slug: 'arduino-arcade-machine',
    title: 'arduino arcade machine',
    year: 'nov 2025',
    image: '/boxbots.jpg',
    blurb: 'a skee-ball machine made with scrap cardboard and 3d printed parts. 1st in game track @ boxbots hackathon',
    body: [
      'Won the Best Game award at the BoxBots hackathon, which was actually my very first hackathon! My team and I built Skee-bidi, an arcade-style skee-ball machine created purely out of cardboard. Our fully automated design featured three Arduino microcontrollers communicating over I²C, enabling synchronized data transfer between the sensors, the timer, and the scorekeeping displays. For ball detection, we integrated both infrared and ultrasonic sensors.',
      'I was responsible for developing the CAD models in SolidWorks for this project, which included designing custom mounts for the IR and ultrasonic sensors, as well as a dedicated DC motor mount and the dispensing door assembly. Beyond the mechanical design, I also handled the wiring and programming of the motor controller for the dispensing door, integrating it seamlessly into our I²C communication network.',
    ],
  },
  {
    slug: 'star-wars-droid',
    title: 'star wars droid',
    year: 'tbd',
    image: '/robotphoto.jpg',
    blurb: 'Coming soon.',
    body: [],
  },
]

/** Nothing published yet — /notes shows its work-in-progress note while
    this is empty. See `work` below for the shape of an entry. */
export const notes: Entry[] = []

/** Placeholder — real roles and case studies to come. */
export const work: Entry[] = [
  {
    slug: 'spyder-controls',
    title: 'electromechanical engineer intern',
    org: 'spyder controls',
    orgUrl: 'https://www.spydercontrols.com/',
    logo: '/spyder-controls.png',
    date: 'summer 2026',
    body: [
      'as one of three electromechanical engineers at spyder controls, i was responsible for designing, building, and troubleshooting test fixtures for PCBA validation. ',
      'the test fixtures were designed in CorelDraw, and were made primarily of laser cut acrylic/acetal. ',
      "a great example of a test fixture that i worked extensively on was for spyder's  SSP24 switch product. previous fixture iterations were slow, with lots of room for error and a high false-failure rate. By designing guider rods, a copper plated shield, pcb dies, and building a more robust top plate, i was able to cut down the false-failure rate by over 70%.",
      '(wip)'
    ],
  },
  {
    slug: 'watonomous',
    title: 'humanoid team member',
    org: 'watonomous',
    orgUrl: 'https://www.watonomous.ca/projects/humanoid',
    logo: '/watonomous.png',
    date: 'summer 2026 - present',
    body: [
      'currently on the mechanical subteam for the humanoid. made contributions to the 6 DOF leg and was responsible for sourcing, researching and evaluating parts for design decisions',
      
    ],
  },
]

export const findProject = (slug?: string) => projects.find((p) => p.slug === slug)
