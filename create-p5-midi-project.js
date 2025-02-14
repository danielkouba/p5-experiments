const fs = require("fs");
const path = require("path");

const projectName = process.argv[2] || "p5_midi_project";
const projectPath = path.join(process.cwd(), projectName);

// Ensure directory exists
if (!fs.existsSync(projectPath)) {
    fs.mkdirSync(projectPath);
}

// Create index.html
fs.writeFileSync(
    path.join(projectPath, "index.html"),
    `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${projectName}</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.9.0/p5.min.js"></script>
    <script src="sketch.js" defer></script>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div id="controls">
        <label for="midiOutputs">Select MIDI Output:</label>
        <select id="midiOutputs"></select>
    </div>
</body>
</html>`
);

// Create sketch.js
fs.writeFileSync(
    path.join(projectPath, "sketch.js"),
    `let midiAccess, midiOutput;
let buttons = [];

function setup() {
    createCanvas(400, 200);
    textAlign(CENTER, CENTER);
    textSize(16);

    // Request MIDI Access
    navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);

    // Buttons for MIDI Messages
    buttons.push(new Button(100, 70, 80, 40, "Send Note", sendTestNote));
    buttons.push(new Button(220, 70, 80, 40, "Send CC", sendTestCC));
}

function draw() {
    background(220);
    text("WebMIDI Interface", width / 2, 20);
    buttons.forEach(btn => btn.display());
}

function mousePressed() {
    buttons.forEach(btn => btn.checkClick(mouseX, mouseY));
}

// MIDI Setup Functions
function onMIDISuccess(midi) {
    midiAccess = midi;
    updateMIDIOutputs();
}

function onMIDIFailure() {
    console.error("Could not access MIDI devices.");
}

function updateMIDIOutputs() {
    let dropdown = document.getElementById("midiOutputs");

    if (!dropdown) {
        console.error("Dropdown not found");
        return;
    }

    dropdown.innerHTML = ""; // Clear existing options

    midiAccess.outputs.forEach((output, id) => {
        let option = document.createElement("option");
        option.value = id;
        option.textContent = output.name;
        dropdown.appendChild(option);
    });

    if (midiAccess.outputs.size > 0) {
        let firstOutputId = Array.from(midiAccess.outputs.keys())[0];
        dropdown.value = firstOutputId;
        midiOutput = midiAccess.outputs.get(firstOutputId);
    }

    dropdown.onchange = () => {
        midiOutput = midiAccess.outputs.get(dropdown.value);
        console.log("MIDI Output Selected:", midiOutput ? midiOutput.name : "None");
    };
}

// MIDI Message Functions
function sendTestNote() {
    if (midiOutput) {
        midiOutput.send([0x90, 60, 127]); // Note On (C4, velocity 127)
        setTimeout(() => midiOutput.send([0x80, 60, 0]), 500); // Note Off after 500ms
    } else {
        console.warn("No MIDI output selected.");
    }
}

function sendTestCC() {
    if (midiOutput) {
        midiOutput.send([0xB0, 1, 64]); // CC1 (Mod Wheel) at value 64
    } else {
        console.warn("No MIDI output selected.");
    }
}

// Button Class
class Button {
    constructor(x, y, w, h, label, action) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.label = label;
        this.action = action;
    }

    display() {
        fill(180);
        rect(this.x, this.y, this.w, this.h, 5);
        fill(0);
        text(this.label, this.x + this.w / 2, this.y + this.h / 2);
    }

    checkClick(mx, my) {
        if (mx > this.x && mx < this.x + this.w && my > this.y && my < this.y + this.h) {
            this.action();
        }
    }
}`
);

// Create style.css
fs.writeFileSync(
    path.join(projectPath, "style.css"),
    `body {
    font-family: Arial, sans-serif;
    text-align: center;
    margin: 20px;
}

#controls {
    margin-bottom: 10px;
}`
);

console.log(`✅ p5.js WebMIDI project '${projectName}' created successfully at ${projectPath}`);
