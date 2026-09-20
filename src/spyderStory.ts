export type Photo = { label: string; caption: string; src?: string; alt?: string }

// Add public/ image paths and descriptive alt text here when photos are ready.
export const photos: Photo[] = [
  { label: 'Fixture overview', caption: 'A closer look at the PCBA validation setup.' },
  { label: 'Laser-cut components and assembly', caption: 'CorelDraw designs brought into acrylic and acetal.' },
  { label: 'SSP24 fixture improvements', caption: 'Guide rods, shielding, PCB dies, and a more robust top plate.' },
]

export const sections = [
  {
    title: 'Building for validation',
    text: 'As one of three electromechanical engineers at Spyder Controls, I designed, built, and troubleshot test fixtures for PCBA validation.',
  },
  {
    title: 'From drawing to fixture',
    text: 'I designed the test fixtures in CorelDraw and built them primarily from laser-cut acrylic and acetal. The work combined fixture design, hands-on assembly, and troubleshooting.',
  },
  {
    title: 'Improving the SSP24 fixture',
    text: 'Previous fixture iterations for the SSP24 switch product were slow, left room for error, and had a high false-failure rate. I designed guide rods, a copper-plated shield, PCB dies, and a more robust top plate. These changes reduced the false-failure rate by over 70%.',
  },
]

