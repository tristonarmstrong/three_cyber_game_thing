// PyrimidSpread.ts
import * as THREE from 'three'
import Engine from '../src/Engine'
import CustomMesh from '../src/CustomMesh'

export default class PyrimidSpread extends CustomMesh {
  engine: Engine
  constructor(engine: Engine) {
    super()
    this.engine = engine
    this.engine.addUpdateableItem(this)
    const geometry = new THREE.CylinderGeometry(0, 10, 30, 4, 1);
    const material = new THREE.MeshPhongMaterial({ color: 0xffffff, flatShading: true });

    for (let i = 0; i < 500; i++) {

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.x = Math.random() * 1600 - 800;
      mesh.position.y = 0;
      mesh.position.z = Math.random() * 1600 - 800;
      mesh.updateMatrix();
      mesh.matrixAutoUpdate = false;
      engine.scene.add(mesh);

    }
  }
}