const fs = require("fs");
const path = require("path");

const projectName = process.argv[2] || "p5_project";
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
</body>
</html>`
);

// Create sketch.js
fs.writeFileSync(
    path.join(projectPath, "sketch.js"),
    `function setup() {
    createCanvas(400, 400);
}

function draw() {
    background(220);
}`
);

// Create style.css
fs.writeFileSync(
    path.join(projectPath, "style.css"),
    `body {
    margin: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
}`
);

console.log(`✅ p5.js project '${projectName}' created successfully at ${projectPath}`);
