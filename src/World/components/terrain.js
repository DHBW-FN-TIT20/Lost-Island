import { PlaneGeometry, TextureLoader, RepeatWrapping, MeshPhongMaterial, Mesh, Vector3 } from 'three';
import { Water } from '../../../lib/three/examples/jsm/objects/Water.js';
import {Sky} from '../../../lib/three/examples/jsm/objects/Sky.js';

function createGround() {
    const geometry = new PlaneGeometry(500, 500, 1024, 1024);
    const loader = new TextureLoader();
    const height = loader.load("../../assets/heightmap.png");
    const texture = loader.load("../../assets/textures/grass-sand-texture.jpg");
    const material = new MeshPhongMaterial({
        color: 'gray',
        map: texture,
        displacementMap: height,
        displacementScale: 10,
        flatShading: true
    });
    const mesh = new Mesh(geometry, material);
    mesh.rotation.x = 181;
    mesh.position.y = -0.5;
    return mesh;
}

function createOcean() {
    const geometry = new PlaneGeometry(1000, 1000);
    const loader = new TextureLoader();
    const texture = loader.load("../../assets/textures/water-texture.jpg");
    texture.wrapS = texture.wrapT = RepeatWrapping;
    const water = new Water(geometry);
    water.textureWidth = 512;
    water.textureHeight = 512;
    water.waterNormals = texture;
    water.alpha = 1.0;
    water.sunDirection = new Vector3();
    water.sunColor = '0xffffff';
    water.waterColor = '0x0000ff';
    water.distortionScale = 4;
    water.rotation.x = 181;
    const waterUniforms = water.material.uniforms;
    water.tick = () =>{
        water.material.uniforms[ 'time' ].value += 1.0 / 60.0;
    };
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