export type Photo = { label: string; caption: string; src?: string; alt?: string; rotateCCW?: boolean }

export const photos: Photo[] = [
  {
    label: 'SSP24 test jig',
    caption: 'the full ssp24 test jig, with the fixture, wiring, and touchscreen.',
    src: '/spyder-ssp24-jig.jpg',
    alt: 'SSP24 test jig on a workbench, showing the top plate, internal wiring, and touchscreen mount.',
  },
  {
    label: 'SSP24 PCB nest',
    caption: 'the pcb nest that holds the ssp24 board in place for testing.',
    src: '/spyder-ssp24-pcb-nest.jpg',
    alt: 'SSP24 circuit board seated in the fitted black PCB nest.',
    rotateCCW: true,
  },
  {
    label: 'Marine override panel test jig',
    caption: 'the marine override panel test jig, used to verify operation of its three circuit breakers.',
    src: '/spyder-marine-override-jig.jpg',
    alt: 'Marine override panel test jig with three breakers, a connector fixture, and a touchscreen showing test results.',
    rotateCCW: true,
  },
]

export const sections = [
  {
    title: 'The SSP24 test jig',
    text: 'As one of three electromechanical engineers at Spyder Controls, I designed, built, and troubleshot test fixtures for PCBA validation, including the SSP24 switch fixture shown here. I designed the fixtures in CorelDraw and assembled them from laser-cut acrylic and acetal.',
  },
  {
    title: 'Holding the board in place',
    text: 'The PCB nest locates and supports the board during testing. Earlier versions of the SSP24 fixture were slow to operate and had a high false-failure rate. I designed guide rods, copper shielding, PCB dies, and a more rigid top plate. These changes reduced false failures by over 70%.',
  },
  {
    title: 'Marine override panel',
    text: 'I also built a test jig for the marine override panel, which contains three circuit breakers. The jig verified that the breakers operated as expected and displayed the test results on a touchscreen.',
  },
]
