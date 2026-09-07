const energy = document.querySelector(".energy");
const rocket = document.querySelector(".rocket");

let energyAwake = false;

document.addEventListener("click", () => {
    energyAwake = true;
});

document.addEventListener("mousemove", (event) => {
    if (!energyAwake) {
        return;
    }

    const x = event.clientX;
    const y = event.clientY;

    const rocketRect = rocket.getBoundingClientRect();

    const rocketX = rocketRect.left + rocketRect.width / 2;
    const rocketY = rocketRect.top + rocketRect.height / 2;

    const dx = rocketX - x;
    const dy = rocketY - y;

    const distance = Math.sqrt(dx ** 2 + dy ** 2);

    const maxDistance = 500;

    const intensity = Math.max(
        0,
        1 - distance / maxDistance
    );

    energy.style.opacity = intensity;
    rocket.style.opacity = intensity;
    

    energy.style.transform =
        `translate(${x}px, ${y}px) translate(-50%, -50%)`;
});