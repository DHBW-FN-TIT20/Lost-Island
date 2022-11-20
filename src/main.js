import { World } from './World/World.js';

const controllHelpDiv = document.getElementById("controllHelp");
const controllShowDiv = document.getElementById("controllShow");

document.body.addEventListener("keydown", (e) => {
    if (e.key === "h" || e.key === "H") {
        controllHelpDiv.style.display = controllHelpDiv.style.display === "none" ? "block" : "none";
        controllShowDiv.style.display = controllShowDiv.style.display === "none" ? "block" : "none";
    }
});

async function main() {
    const spinner = document.getElementById("spinner");
    const container = document.getElementById("scene-container");
    let world = new World(container);
    await world.init(spinner);
    world.start();

    document.body.addEventListener("keydown", (e) => {
        if (e.key === "i") {
            world.toggleStats();
        }
    });
}

main().catch((err) => {
    console.error(err);
});