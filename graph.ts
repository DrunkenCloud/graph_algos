interface node {
  id: number;
  x: number;
  y: number;
}

interface Edge {
  start: number;
  end: number;
  weight: number;
}

const canvas = document.getElementById("graphCanvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

let nodes: node[] = [];
let edges: Edge[] = [];
let mstEdges: Edge[] = [];
let visited = new Set<number>();
let steps: Edge[] = [];
let currentStep = 0;
const gridSize = 4;
const totalEdges = 20;

// Function to draw the graph
function drawGraph(): void {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw edges with weights
  edges.forEach((edge) => {
    const startnode = nodes.find((n) => n.id === edge.start);
    const endnode = nodes.find((n) => n.id === edge.end);
    if (startnode && endnode) {
      ctx.beginPath();
      ctx.moveTo(startnode.x, startnode.y);
      ctx.lineTo(endnode.x, endnode.y);
      ctx.strokeStyle = mstEdges.includes(edge) ? "#4CAF50" : "#888";
      ctx.lineWidth = mstEdges.includes(edge) ? 2.5 : 1.5;
      ctx.stroke();

      // Draw weights
      const midX = (startnode.x + endnode.x) / 2;
      const midY = (startnode.y + endnode.y) / 2;
      ctx.font = "14px Arial";
      ctx.fillStyle = "#d32f2f";
      ctx.fillText(edge.weight.toString(), midX - 5, midY - 5);
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
function generateRandomGraph(): void {
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

  const possibleEdges: Edge[] = [];
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
function startPrim(): void {
  mstEdges = [];
  visited = new Set<number>();
  steps = [];
  currentStep = 0;

  const startnode = nodes[0].id;
  visited.add(startnode);

  while (visited.size < nodes.length) {
    let minEdge: Edge | null = null;

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
function nextStep(): void {
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
function resetGraph(): void {
  mstEdges = [];
  visited = new Set<number>();
  currentStep = 0;
  drawGraph();
}

// Initial drawing
generateRandomGraph();
drawGraph();

// Expose functions to window
(window as any).generateRandomGraph = generateRandomGraph;
(window as any).startPrim = startPrim;
(window as any).nextStep = nextStep;
(window as any).resetGraph = resetGraph;
