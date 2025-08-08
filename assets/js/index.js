let currentLine = 0;
let currentChar = 0;
let displayText = [];
let isTyping = true;
let projects = [];
let terminalReady = false;

function setup() {
    let canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent(document.body);
    canvas.id('p5-canvas');

    loadProjects().then((data) => {
        projects = data;
        initializeTerminal();
    });

    textFont('monospace');
    textAlign(LEFT, TOP);
}

function initializeTerminal() {
    displayText = [
        '       _                  _           _   _                ',
        '      | |                | |         | | | |               ',
        '  __ _| | __ _  ___  _ __| |__  _   _| |_| |__  _ __ ___   ',
        " / _` | |/ _` |/ _ \\| '__| '_ \\| | | | __| '_ \\| '_ ` _ \\  ",
        '| (_| | | (_| | (_) | |  | | | | |_| | |_| | | | | | | | | ',
        ' \\__,_|_|\\__, |\\___/|_|  |_| |_|\\__, |\\__|_| |_|_| |_| |_| ',
        '          __/ |                  __/ |                     ',
        '         |___/                  |___/                      ',
        '',
        'algorhythm',
        'Copyright (c) 2025 Murat Koptur',
        '',
        'Loading projects...',
        'Ready.',
        '',
        '=== AVAILABLE PROJECTS ===',
        '',
    ];

    if (!projects || projects.length === 0) {
        displayText.push('No projects found.');
        displayText.push('');
        return;
    }

    projects.forEach((project, index) => {
        const formattedDate = new Date(project.date).toLocaleDateString(
            'en-US',
            {
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
            },
        );
        displayText.push(`[${index + 1}] ${project.title} - ${formattedDate}`);
    });

    displayText.push('');
}

function draw() {
    background(0, 0);

    fill(154, 215, 179);

    let fontSize = Math.max(8, Math.min(16, windowWidth / 50));
    textSize(fontSize);

    let lineHeight = fontSize + 4;
    let startY = 20;
    let startX = 20;

    let isHovering = false;
    if (terminalReady) {
        for (let i = 0; i < displayText.length; i++) {
            let y = startY + i * lineHeight;
            let line = displayText[i];

            if (line.match(/^\[\d+\]/)) {
                if (
                    mouseX >= startX &&
                    mouseX <= startX + textWidth(line) &&
                    mouseY >= y &&
                    mouseY <= y + lineHeight
                ) {
                    isHovering = true;
                    break;
                }
            }
        }
    }

    cursor(isHovering ? HAND : ARROW);

    let visibleLines = Math.floor((height - 40) / lineHeight);
    let startLine = Math.max(0, displayText.length - visibleLines);

    for (let i = startLine; i < displayText.length; i++) {
        let y = startY + (i - startLine) * lineHeight;
        let line = displayText[i];

        if (isTyping && i === currentLine) {
            let partialLine = line.substring(0, currentChar);
            text(partialLine, startX, y);

            if (currentChar < line.length) {
                currentChar++;
            } else {
                currentLine++;
                currentChar = 0;
                if (currentLine >= displayText.length) {
                    isTyping = false;
                    terminalReady = true;
                }
            }
        } else if (!isTyping || i < currentLine) {
            if (line.includes('algorhythm')) {
                fill(179, 215, 204);
            } else if (
                line.includes('algorhythm') ||
                line.includes('Copyright') ||
                line.includes('===')
            ) {
                fill(128, 140, 135);
            } else if (line.startsWith('[') && line.includes(']')) {
                fill(154, 215, 179);
            } else {
                fill(154, 215, 179);
            }

            text(line, startX, y);
        }
    }
}

function mousePressed() {
    if (!terminalReady) return;

    let fontSize = Math.max(8, Math.min(16, windowWidth / 50));
    let lineHeight = fontSize + 4;
    let startY = 20;
    let startX = 20;

    for (let i = 0; i < displayText.length; i++) {
        let y = startY + i * lineHeight;
        let line = displayText[i];

        if (line.match(/^\[\d+\]/)) {
            if (
                mouseX >= startX &&
                mouseX <= startX + textWidth(line) &&
                mouseY >= y &&
                mouseY <= y + lineHeight
            ) {
                let projectNum = parseInt(line.match(/\[(\d+)\]/)[1]);
                let projectIndex = projectNum - 1;

                if (projectIndex >= 0 && projectIndex < projects.length) {
                    window.open(projects[projectIndex].link, '_blank');
                }
                break;
            }
        }
    }
}

function drawScanlines() {
    stroke(0, 255, 0, 20);
    strokeWeight(1);
    for (let y = 0; y < height; y += 3) {
        line(0, y, width, y);
    }
    noStroke();

    for (let i = 0; i < 3; i++) {
        stroke(0, 255, 0, 10 - i * 3);
        strokeWeight(1 + i);
        noFill();
        rect(i, i, width - i * 2, height - i * 2);
    }
    noStroke();
}

function updateProjectHighlight() {}

function openProject(index) {
    if (index >= 0 && index < projects.length) {
        const project = projects[index];
        displayText.push(`Opening: ${project.title}...`);
        displayText.push('');

        setTimeout(() => {
            window.open(project.link, '_blank');
        }, 500);
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

async function loadProjects() {
    try {
        const response = await fetch('assets/data/projects.json');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        return data.projects || [];
    } catch (error) {
        console.error('Error loading projects:', error);
        return [];
    }
}
