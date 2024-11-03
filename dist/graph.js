var canvas = document.getElementById("graphCanvas");
var ctx = canvas.getContext("2d");
var nodes = [];
var edges = [];
var mstEdges = [];
var visited = new Set();
var steps = [];
var currentStep = 0;
var gridSize = 4;
var totalEdges = 20;

function drawGraph() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    edges.forEach(function (edge) {
        var startnode = nodes.find(function (n) { return n.id === edge.start; });
        var endnode = nodes.find(function (n) { return n.id === edge.end; });
        if (startnode && endnode) {
            ctx.beginPath();
            ctx.moveTo(startnode.x, startnode.y);
            ctx.lineTo(endnode.x, endnode.y);
            ctx.strokeStyle = mstEdges.includes(edge) ? "#4CAF50" : "#888";
            ctx.lineWidth = mstEdges.includes(edge) ? 2.5 : 1.5;
            ctx.stroke();
            var midX = (startnode.x + endnode.x) / 2;
            var midY = (startnode.y + endnode.y) / 2;
            ctx.font = "14px Arial";
            ctx.fillStyle = "#d32f2f";
            ctx.fillText(edge.weight.toString(), midX - 5, midY - 5);
        }
    });
    
    nodes.forEach(function (node) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, 18, 0, 2 * Math.PI);
        ctx.fillStyle = visited.has(node.id) ? "#a5d6a7" : "#f0f0f0";
        ctx.fill();
        ctx.strokeStyle = "#333";
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.font = "14px Arial";
        ctx.fillStyle = "#333";
        ctx.fillText(node.id.toString(), node.x - 5, node.y + 5);
    });
}
function generateRandomGraph() {
    nodes = [];
    edges = [];
    var spacing = 100;
    for (var i = 0; i < gridSize; i++) {
        for (var j = 0; j < gridSize; j++) {
            nodes.push({
                id: i * gridSize + j + 1,
                x: j * spacing + 50,
                y: i * spacing + 50,
            });
        }
    }
    var possibleEdges = [];
    for (var i = 0; i < nodes.length; i++) {
        for (var j = i + 1; j < nodes.length; j++) {
            possibleEdges.push({
                start: nodes[i].id,
                end: nodes[j].id,
                weight: Math.floor(Math.random() * 10) + 1,
            });
        }
    }
    while (edges.length < totalEdges && possibleEdges.length > 0) {
        var randomIndex = Math.floor(Math.random() * possibleEdges.length);
        var randomEdge = possibleEdges.splice(randomIndex, 1)[0];
        edges.push(randomEdge);
    }
    resetGraph();
}
function startPrim() {
    mstEdges = [];
    visited = new Set();
    steps = [];
    currentStep = 0;
    var startnode = nodes[0].id;
    visited.add(startnode);
    var _loop_1 = function () {
        var minEdge = null;
        edges.forEach(function (edge) {
            if ((visited.has(edge.start) && !visited.has(edge.end)) ||
                (visited.has(edge.end) && !visited.has(edge.start))) {
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
        }
        else {
            return "break";
        }
    };
    while (visited.size < nodes.length) {
        var state_1 = _loop_1();
        if (state_1 === "break")
            break;
    }
    drawGraph();
}

function nextStep() {
    if (currentStep < steps.length) {
        var edge = steps[currentStep];
        mstEdges.push(edge);
        visited.add(edge.start);
        visited.add(edge.end);
        currentStep++;
        drawGraph();
    }
}

function resetGraph() {
    mstEdges = [];
    visited = new Set();
    currentStep = 0;
    drawGraph();
}

generateRandomGraph();
drawGraph();

window.generateRandomGraph = generateRandomGraph;
window.startPrim = startPrim;
window.nextStep = nextStep;
window.resetGraph = resetGraph;
