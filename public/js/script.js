const energy = document.querySelector(".energy");
const rocket = document.querySelector(".rocket");
const space = document.querySelector(".space");

const modeSelection =
    document.querySelector(".mode-selection");

const journeyButton =
    document.querySelector(".journey-button");

const fastButton =
    document.querySelector(".fast-button");

const arrivalTransition =
    document.querySelector(".arrival-transition");

const safeRadius = 150;
const INTRO_DURATION = 3500;

let launchStartTime = 0;
let energyAwake = false;
let rocketActivated = false;
let transitionStarted = false;
let speed = 0;
let journeyStarted = false;

let mouseX = 0;
let mouseY = 0;

let energyX = 0;
let energyY = 0;

journeyButton.addEventListener("click", (event) => {
    event.stopPropagation();

    journeyStarted = true;

    modeSelection.classList.remove("visible");
});

fastButton.addEventListener("click", () => {
    beginFastTravel();
});

requestAnimationFrame(() => {
    modeSelection.classList.add("visible");
});

document.addEventListener("click", (event) => {
    if (!journeyStarted) {
        return;
    }

    if (!energyAwake) {
        mouseX = event.clientX;
        mouseY = event.clientY;

        energyX = mouseX;
        energyY = mouseY;
    }

    energyAwake = true;
});


document.addEventListener("mousemove", (event) => {
    if (!journeyStarted || !energyAwake || rocketActivated) {
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

    setTimeout(() => {
        rocket.classList.add("charging");
    }, 800);

    setTimeout(() => {
        rocket.classList.add("launching");

        prepareStars();

        launchStartTime = performance.now();

        accelerateRocket();
    }, 2000);
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

function accelerateRocket() {
    if (!rocketActivated) {
        return;
    }

    const elapsed =
        (performance.now() - launchStartTime) / INTRO_DURATION;

    // Keep acceleration between 0 and 1
    const progress = Math.min(elapsed, 1);

    speed = progress * progress * progress;

    if (elapsed >= 1 && !transitionStarted) {
        transitionStarted = true;

        rocket.classList.add("departing");

        energy.style.opacity = "0";

        beginZoomOut();

        return;
    }

    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    stars.forEach((star) => {
        let distance = Number(star.dataset.distance);

        const angle = Number(star.dataset.angle);
        const starSpeed = Number(star.dataset.speed);

        // Stars continue moving even after the title appears
        distance += speed * starSpeed * 6;

        star.dataset.distance = distance;

        const x =
            centerX + Math.cos(angle) * distance;

        const y =
            centerY + Math.sin(angle) * distance;

        const availableLength =
            distance - safeRadius;

        const length = Math.max(
            2,
            Math.min(
                speed * starSpeed * 180,
                availableLength
            )
        );

        const angleDegrees =
            angle * (180 / Math.PI);

        star.style.left = `${x}px`;
        star.style.top = `${y}px`;

        star.style.width = `${2 + length}px`;

        star.style.transform =
            `translateX(-100%) rotate(${angleDegrees}deg)`;

        if (
            x < -200 ||
            x > window.innerWidth + 200 ||
            y < -200 ||
            y > window.innerHeight + 200
        ) {
            resetStar(star);
        }
    });

    requestAnimationFrame(accelerateRocket);
}

function prepareStars() {
    stars.forEach((star) => {
        resetStar(star, true);
    });
}

function resetStar(star, initial = false) {
    const angle = Math.random() * Math.PI * 2;

    const startDistance = initial
        ? safeRadius + 80 + Math.random() * 350
        : safeRadius + 20 + Math.random() * 80;

    const starSpeed = 0.6 + Math.random() * 0.8;

    star.dataset.angle = angle;
    star.dataset.distance = startDistance;
    star.dataset.speed = starSpeed;

    star.style.opacity = "0.8";
    star.style.height = `${1 + Math.random() * 1.5}px`;
}

function createStars(count) {
    for (let i = 0; i < count; i++) {
        const star = document.createElement("div");

        star.classList.add("star");

        space.appendChild(star);
    }
}

createStars(30);

const stars = document.querySelectorAll(".star");

function beginZoomOut() {
    space.classList.add("fading");

    rocket.style.opacity = "0";
    energy.style.opacity = "0";

    arrivalTransition.classList.add("active");

    setTimeout(() => {
        window.location.href = "/portfolio.html";
    }, 1800);
}

function beginFastTravel() {
    window.location.href = "/portfolio.html";
}