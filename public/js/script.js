const energy = document.querySelector(".energy");
const rocket = document.querySelector(".rocket");

let energyAwake = false;
let rocketActivated = false;

let mouseX = 0;
let mouseY = 0;

let energyX = 0;
let energyY = 0;

document.addEventListener("click", (event) => {
    if (!energyAwake) {
        mouseX = event.clientX;
        mouseY = event.clientY;

        energyX = mouseX;
        energyY = mouseY;
    }

    energyAwake = true;
});

document.addEventListener("mousemove", (event) => {
    if (!energyAwake || rocketActivated) {
        return;
    }

    mouseX = event.clientX;
    mouseY = event.clientY;

    const rocketRect = rocket.getBoundingClientRect();

    const rocketX = rocketRect.left + rocketRect.width / 2;
    const rocketY = rocketRect.top + rocketRect.height / 2;

    const dx = rocketX - energyX;
    const dy = rocketY - energyY;

    const distance = Math.sqrt(dx ** 2 + dy ** 2);

    const maxDistance = 500;

    const intensity = Math.max(
        0,
        1 - distance / maxDistance
    );

    energy.style.opacity = intensity;
    rocket.style.opacity = intensity;
});

rocket.addEventListener("click", () => {
    rocketActivated = true;

    rocket.classList.add("active");

    const rocketRect = rocket.getBoundingClientRect();

    const rocketX = rocketRect.left + rocketRect.width / 2;
    const rocketY = rocketRect.top + rocketRect.height / 2;

    energyX = rocketX;
    energyY = rocketY;

    energy.style.transform =
        `translate(${rocketX}px, ${rocketY}px) translate(-50%, -50%)`;

    energy.classList.add("transferring");
});
function animateEnergy() {
    if (energyAwake && !rocketActivated) {
        energyX += (mouseX - energyX) * 0.12;
        energyY += (mouseY - energyY) * 0.12;

        energy.style.transform =
            `translate(${energyX}px, ${energyY}px) translate(-50%, -50%)`;
    }

    requestAnimationFrame(animateEnergy);
}

animateEnergy();