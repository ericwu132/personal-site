import PageHeader from '../components/PageHeader'
import { Link } from 'react-router-dom'

export default function About() {
  return (
    <main className="page">
      <PageHeader />
      <h1 className="page-title">about</h1>
      <div className="prose">
        <p>i'm eric wu, a second-year mechatronics engineering student at the university of waterloo. i chose mechatronics because i'm passionate about both mechanical and electrical engineering, and wanted to study both.</p>
        <p>i love working on electromechanical systems. that was part of high school robotics for me, and it's still a big part of my <Link className="text-link" to="/work">work</Link> and <Link className="text-link" to="/projects">projects</Link>. at spyder controls, i designed, built, and troubleshot test fixtures for circuit boards.</p>
        <p>since starting university, i've competed in three hackathons and won awards at all three. at yhack at yale, i worked on <Link className="text-link" to="/projects/omni-assist">omni-assist</Link>, an autonomous navigation attachment for wheelchairs. i designed the mounts, wheel hubs, and clamps, and worked on the wiring and motor drivers. our team won first in hardware and best use of viam.</p>
        <p>i'm also on the mechanical subteam for watonomous's humanoid robot, contributing to the six-degree-of-freedom leg and researching components for the design.</p>
        <p>outside school, i play piano. i bought a digital piano for my room so i can keep playing as a hobby. i also used to play competitive table tennis and was ranked in alberta's top 10 for u15.</p>
        <p>i like reading novels, and i'm currently reading <a className="text-link" href="https://www.goodreads.com/book/show/18712215-the-count-of-monte-cristo" target="_blank" rel="noreferrer"><i>the count of monte cristo</i></a> by alexandre dumas.</p>
      </div>
      <div className="about-collage" role="group" aria-label="personal photos">
        <img src="/IMG_4578.jpg" alt="Mountains and a bridge reflected in turquoise water" width={3024} height={4032} loading="lazy" decoding="async" />
        <img src="/IMG_4683.jpg" alt="A quiet lake framed by evergreen trees at dusk" width={3024} height={4032} loading="lazy" decoding="async" />
        <img src="/IMG_4690.jpg" alt="Sunset over distant mountains above a wooded stream" width={3024} height={4032} loading="lazy" decoding="async" />
      </div>
    </main>
  )
}
