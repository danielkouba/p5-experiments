let midiAccess, midiOutput;
let padX = 50, padY = 50, padSize = 300;
let lastCCX = -1, lastCCY = -1; // Stores last sent values to avoid redundant messages

function setup() {
    createCanvas(400, 400);
    textAlign(CENTER, CENTER);
    textSize(16);

    // Request MIDI Access
    navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);
}

function draw() {
    background(220);

    // Draw XY pad
    fill(180);
    rect(padX, padY, padSize, padSize, 10);

    // Draw cursor if inside pad
    if (mouseIsPressed && mouseInsidePad()) {
        fill(255, 0, 0);
        ellipse(mouseX, mouseY, 20, 20);
    }

    // Labels
    fill(0);
    text("XY Controller", width / 2, 20);
    text("X → CC40 (Sample Start), Y → CC41 (Sample End)", width / 2, height - 20);
}

// Check if the mouse is inside the pad
function mouseInsidePad() {
    return mouseX > padX && mouseX < padX + padSize &&
           mouseY > padY && mouseY < padY + padSize;
}

// Send MIDI messages when dragging
function mouseDragged() {
    if (midiOutput && mouseInsidePad()) {
        let ccXValue = floor(map(mouseX, padX, padX + padSize, 0, 127));
        let ccYValue = floor(map(mouseY, padY, padY + padSize, 127, 0)); // Invert Y-axis

        // Only send values if they change
        if (ccXValue !== lastCCX) {
            midiOutput.send([0xB0, 40, ccXValue]); // Send CCX
            lastCCX = ccXValue;
        }

        if (ccYValue !== lastCCY) {
            midiOutput.send([0xB0, 41, ccYValue]); // Send CCY
            lastCCY = ccYValue;
        }
    }
}

// MIDI Setup
function onMIDISuccess(midi) {
    midiAccess = midi;
    updateMIDIOutputs();
}

function onMIDIFailure() {
    console.error("Could not access MIDI devices.");
}

function updateMIDIOutputs() {
    let outputs = Array.from(midiAccess.outputs.values());
    if (outputs.length > 0) {
        midiOutput = outputs[0]; // Auto-select first MIDI output
        console.log("MIDI Output Selected:", midiOutput.name);
    } else {
        console.warn("No MIDI outputs found.");
    }
}
