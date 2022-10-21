import { PlaneGeometry, TextureLoader, RepeatWrapping, MeshPhongMaterial, Mesh } from 'three';

function createGround() {
    const geometry = new PlaneGeometry(150, 150, 1024, 1024);
    const loader = new TextureLoader();
    const height = loader.load("../../assets/heightmap.png");
    const texture = loader.load("../../assets/textures/grass-sand-texture.jpg");
    // let disMap = new TextureLoader().load("heightmap.png");
    // disMap.wrapS = disMap.wrapT = RepeatWrapping;
    // disMap.repeat.set(1, 1);
    const material = new MeshPhongMaterial({
        color: 'gray',
        map: texture,
        displacementMap: height,
        displacementScale: 10,
        flatShading: true
    });
    const mesh = new Mesh(geometry, material);
    mesh.rotation.x = 181;
    return mesh;
}

export { createGround };