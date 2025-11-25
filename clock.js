const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const dates = Array.from({ length: 31 }, (_, i) => i + 1);

function createRingItems(containerId, items, radius) {
    const container = document.getElementById(containerId);
    const angleStep = 360 / items.length;

    items.forEach((item, index) => {
        const span = document.createElement('span');
        span.className = 'ring-item';
        span.textContent = item;
        // Rotate the item to its position on the circle
        // Translate outwards by radius
        // Rotate back 90deg so text is perpendicular to radius (optional, depends on design)
        // For this design, we want text to follow the curve.
        span.style.transform = `rotate(${index * angleStep}deg) translate(${radius}px) rotate(90deg)`;
        container.appendChild(span);
    });
}

// Initialize Rings
createRingItems('month-ring', months, 240);
createRingItems('day-ring', days, 190);
createRingItems('date-ring', dates, 140);

function updateClock() {
    const now = new Date();
    const month = now.getMonth();
    const day = now.getDay();
    const date = now.getDate() - 1; // 0-indexed for array
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    // Rotate Rings
    // We want the current item to be at the top (-90 degrees visual, but 0 degrees in our logic starts at right)
    // Actually, CSS rotation starts at 3 o'clock (0deg). Top is -90deg.
    // So we need to rotate the RING so that the item at `index * angleStep` ends up at -90deg.
    // Target Angle = -90
    // Item Angle = index * angleStep
    // Ring Rotation = Target Angle - Item Angle

    const rotateRing = (id, index, count) => {
        const ring = document.getElementById(id);
        const angleStep = 360 / count;
        const itemAngle = index * angleStep;
        const rotation = -90 - itemAngle;
        ring.style.transform = `rotate(${rotation}deg)`;

        // Highlight active item
        const items = ring.getElementsByClassName('ring-item');
        for (let i = 0; i < items.length; i++) {
            items[i].classList.remove('active');
        }
        items[index].classList.add('active');
    };

    rotateRing('month-ring', month, 12);
    rotateRing('day-ring', day, 7);
    rotateRing('date-ring', date, 31);

    // Update Hands
    const hourHand = document.getElementById('hour');
    const minuteHand = document.getElementById('minute');
    const secondHand = document.getElementById('second');

    const secondsRotation = seconds * 6;
    const minutesRotation = minutes * 6 + seconds / 10;
    const hoursRotation = (hours % 12) * 30 + minutes / 2;

    secondHand.style.transform = `translateX(-50%) rotate(${secondsRotation}deg)`;
    minuteHand.style.transform = `translateX(-50%) rotate(${minutesRotation}deg)`;
    hourHand.style.transform = `translateX(-50%) rotate(${hoursRotation}deg)`;
}

setInterval(updateClock, 1000);
updateClock();