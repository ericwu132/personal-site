/** Small display copies; source paths stay unchanged for enlargement. */
const photographs: Record<string, string> = {
  '/spyder-ssp24-overhead.jpg': '/photos/spyder-ssp24-overhead.webp',
  '/spyder-ssp24-pcb-nest.jpg': '/photos/spyder-ssp24-pcb-nest.webp',
  '/spyder-marine-override-jig.jpg': '/photos/spyder-marine-override-jig.webp',
  '/vex-worlds-robot.webp': '/photos/vex-worlds-robot.webp',
  '/IMG_4578.jpg': '/photos/IMG_4578.webp',
  '/IMG_4683.jpg': '/photos/IMG_4683.webp',
  '/IMG_4690.jpg': '/photos/IMG_4690.webp',
  '/headshot.png': '/photos/headshot.webp',
  '/omniassist.jpg': '/photos/omniassist.webp',
}

export const displayImage = (src: string) => photographs[src] ?? src
