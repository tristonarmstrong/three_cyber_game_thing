import './style.css'
import Engine from '../src/Engine'
import SciFiScene from './SciFiScene'
import Lights from './Lights'
//import Cube from './Cube'
import AlienCharacter from './alien_char'


window.addEventListener('DOMContentLoaded', () => {
  const engine = new Engine()

  new SciFiScene(engine)
  new Lights(engine)
  //new Cube(engine)
  new AlienCharacter(engine)
  engine.run()
})
