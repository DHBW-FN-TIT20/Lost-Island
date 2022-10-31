import { World } from './World/World.js';

let world;
document.getElementById("coconut").onclick = animateCoconut;

async function main() {
    const container = document.getElementById("scene-container");
    world = new World(container);
    await world.init();
    world.start();
}

function animateCoconut(){
    world.palm1.startAnimation();
}

main().catch((err) => {
    console.error(err);
});