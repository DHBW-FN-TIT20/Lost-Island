import { PlaneGeometry, TextureLoader, RepeatWrapping, MeshPhongMaterial, MeshToonMaterial, MeshStandardMaterial, Mesh, Vector3 } from 'three';
import { Water } from '../../../lib/three/examples/jsm/objects/Water.js';
import {Sky} from '../../../lib/three/examples/jsm/objects/Sky.js';

function createGround() {
    const geometry = new PlaneGeometry(400, 400, 1024, 1024);
    const loader = new TextureLoader();
    const height = loader.load("../../assets/heightmap2.png");
    const normal = loader.load("../../assets/NormalMap.png");
    const texture = loader.load("../../assets/color2.png");
    texture.wrapS = RepeatWrapping;
    texture.wrapT = RepeatWrapping;

    const material = new MeshStandardMaterial({
        map: texture,
        normalMap: normal,
        displacementMap: height,
        displacementScale: 10
    });
    const mesh = new Mesh(geometry, material);
    mesh.rotation.x = -Math.PI/2;
    mesh.position.y = -1;
    return mesh;
}

function createOcean() {
    const geometry = new PlaneGeometry(1000, 1000);
    const loader = new TextureLoader();
    const texture = loader.load("../../assets/textures/water-bump-map.png");
    texture.wrapS = texture.wrapT = RepeatWrapping;
    const water = new Water(geometry);
    water.textureWidth = 512;
    water.textureHeight = 512;
    // water.waterNormals = texture;
    water.alpha = 1.0;
    water.sunDirection = new Vector3();
    // water.sunColor = 0xffffff;
    water.waterColor = 0xff0000;
    water.rotation.x = -Math.PI/2;
    water.position.y = 1;
    return water;
}

function createSky() {
    const sky = new Sky();
    sky.scale.setScalar(1000);
    return sky;
}

function createSun(sky) {
   
    const sun = new Vector3();
    const theta = Math.PI * (0.49 - 0.5);
    const phi = 2 * Math.PI * (0.205 - 0.5);
    sun.x = Math.cos(phi);
    sun.y = Math.sin(phi) * Math.sin(theta);
    sun.z = Math.sin(phi) * Math.cos(theta);

    sky.material.uniforms['sunPosition'].value.copy(sun);
    
    return sun;
}

export { createGround, createOcean, createSky, createSun };