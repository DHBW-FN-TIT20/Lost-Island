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
    mesh.position.y = -0.6;
    return mesh;
}

function createOcean() {
    const geometry = new PlaneGeometry(1000, 1000);
    const loader = new TextureLoader();
    let water = new Water(
        geometry,
        {
            textureWidth: 512,
            textureHeight: 512,
            waterNormals: loader.load( './assets/textures/water-normals.jpg', function ( texture ) {

                texture.wrapS = texture.wrapT = RepeatWrapping;

            } ),
            sunDirection: new Vector3(),
            sunColor: 0xffffff,
            waterColor: 0x001e0f,
            distortionScale: 3.7
        }
    );
    water.rotation.x = -Math.PI/2;
    water.position.y = 0;
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