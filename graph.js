const canvas = document.getElementById("graphCanvas");
const ctx = canvas.getContext("2d");

let nodes = [];
let edges = [];
let mstEdges = [];
let visited = new Set();
let steps = [];
let currentStep = 0;
const gridSize = 4;
const totalEdges = 20;

// Function to draw the graph
function drawGraph() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw edges with weights
    edges.forEach((edge, index) => {
        const startNode = nodes.find((n) => n.id === edge.start);
        const endNode = nodes.find((n) => n.id === edge.end);
        if (startNode && endNode) {
            ctx.beginPath();
            ctx.moveTo(startNode.x, startNode.y);
            ctx.lineTo(endNode.x, endNode.y);
            ctx.strokeStyle = mstEdges.includes(edge) ? "#4CAF50" : "#888";
            ctx.lineWidth = mstEdges.includes(edge) ? 2.5 : 1.5;
            ctx.stroke();

            // Draw weights, offset alternately to avoid overlap
            const midX = (startNode.x + endNode.x) / 2;
            const midY = (startNode.y + endNode.y) / 2;
            const offset = (index % 2 === 0) ? 20 : -20; // Alternate offset
            ctx.font = "14px Arial";
            ctx.fillStyle = "#d32f2f";
            ctx.fillText(edge.weight.toString(), midX + offset, midY + offset);
        }
    });

    // Draw nodes
    nodes.forEach((node) => {
        ctx.beginPath();
        ctx.arc(node.x, node.y, 18, 0, 2 * Math.PI);
        ctx.fillStyle = visited.has(node.id) ? "#a5d6a7" : "#f0f0f0";
        ctx.fill();
        ctx.strokeStyle = "#333";
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Draw node labels
        ctx.font = "14px Arial";
        ctx.fillStyle = "#333";
        ctx.fillText(node.id.toString(), node.x - 5, node.y + 5);
    });
}

// Function to generate a random graph
function generateRandomGraph() {
    nodes = [];
    edges = [];

    const spacing = 100;
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            nodes.push({
                id: i * gridSize + j + 1,
                x: j * spacing + 50,
                y: i * spacing + 50,
            });
        }
    }

    const possibleEdges = [];
    for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
            possibleEdges.push({
                start: nodes[i].id,
                end: nodes[j].id,
                weight: Math.floor(Math.random() * 10) + 1,
            });
        }
    }

    while (edges.length < totalEdges && possibleEdges.length > 0) {
        const randomIndex = Math.floor(Math.random() * possibleEdges.length);
        const randomEdge = possibleEdges.splice(randomIndex, 1)[0];
        edges.push(randomEdge);
    }

    resetGraph();
}

// Prim's Algorithm initialization
function startPrim() {
    mstEdges = [];
    visited = new Set();
    steps = [];
    currentStep = 0;

    const startNode = nodes[0].id;
    visited.add(startNode);

    while (visited.size < nodes.length) {
        let minEdge = null;

        edges.forEach((edge) => {
            if (
                (visited.has(edge.start) && !visited.has(edge.end)) ||
                (visited.has(edge.end) && !visited.has(edge.start))
            ) {
                if (!minEdge || edge.weight < minEdge.weight) {
                    minEdge = edge;
                }
            }
        });

        if (minEdge !== null) {
            steps.push(minEdge);
            mstEdges.push(minEdge);
            visited.add(minEdge.start);
            visited.add(minEdge.end);
        } else {
            break;
        }
    }

    drawGraph();
}

// Advance one step in Prim's algorithm
function nextStep() {
    if (currentStep < steps.length) {
        const edge = steps[currentStep];
        mstEdges.push(edge);
        visited.add(edge.start);
        visited.add(edge.end);
        currentStep++;
        drawGraph();
    }
}

// Reset the graph view
function resetGraph() {
    mstEdges = [];
    visited = new Set();
    currentStep = 0;
    drawGraph();
}

// Initial drawing
generateRandomGraph();
drawGraph();

// Expose functions to window
window.generateRandomGraph = generateRandomGraph;
window.startPrim = startPrim;
window.nextStep = nextStep;
window.resetGraph = resetGraph;
