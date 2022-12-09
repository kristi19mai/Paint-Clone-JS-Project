const activeTool = document.getElementById("active-tool");
const brushEl = document.getElementById("brush");
const brushColorEl = document.getElementById("brush-color");
const brushSize = document.getElementById("brush-size");
const brushSlider = document.getElementById("brush-slider");
const bucketColor = document.getElementById("bucket-color");
const eraserEl = document.getElementById("eraser");
const clearCanvasEl = document.getElementById("clear-canvas");
const saveStorage = document.getElementById("save-storage");
const loadStorage = document.getElementById("load-storage");
const clearStorage = document.getElementById("clear-storage");
const downloadEl = document.getElementById("download");

const canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

let lineWidth = 10;
let currentBrushColor = "#18ab1b";
let currentBackgroundColor = "#ffffff";

let mouseDown = 0;
let isBrushOn = true;
let isEraserOn = false;
let drownObject = {};
let parametersArray = [];
let drownObjectsArray = [];

function setupCanvas() {
  brushEl.style.color = currentBrushColor;
  ctx.lineWidth = lineWidth;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight - 50;
}

// Event Listeners

// Switch on Brush
brushEl.addEventListener("click", () => {
  if (isBrushOn) {
    return;
  } else {
    isEraserOn = false;
    isBrushOn = true;
    activeTool.textContent = "Brush";
    brushEl.style.color = currentBrushColor;
    eraserEl.style.color = "#ffffff";
  }
});

// Switch On Eraser
eraserEl.addEventListener("click", () => {
  if (isEraserOn) {
    return;
  } else {
    isBrushOn = false;
    isEraserOn = true;
    activeTool.textContent = "Eraser";
    eraserEl.style.color = currentBackgroundColor;
    brushEl.style.color = "#ffffff";
  }
});

// Setting Brush Color
brushColorEl.addEventListener("change", (e) => {
  currentBrushColor = `#${e.target.value}`;
  if (isBrushOn) {
    brushEl.style.color = currentBrushColor;
  }
});

// Setting Line Width
brushSlider.addEventListener("change", (e) => {
  lineWidth = e.target.value;
  ctx.lineWidth = lineWidth;
  if (lineWidth >= 10) {
    brushSize.textContent = lineWidth;
  } else {
    brushSize.textContent = `0${lineWidth}`;
  }
});

// Setting Background Color
bucketColor.addEventListener("change", (e) => {
  currentBackgroundColor = `#${e.target.value}`;
  canvas.style.backgroundColor = currentBackgroundColor;
  if (isEraserOn) {
    eraserEl.style.color = currentBackgroundColor;
  }
});

// Clear Canvas
clearCanvasEl.addEventListener("click", () => {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight - 50);
});

// Store Data
function storeStartCoordinate(x, y) {
  drownObject.startPosition = { x: 0, y: 0 };
  drownObject.startPosition.x = x;
  drownObject.startPosition.y = y;
  console.log(drownObject);
}

function storeParameters(x, y, color, lineWidth, isEraserOn) {
  parametersArray.push({
    x: x,
    y: y,
    color: color,
    lineWidth: lineWidth,
    isEraserOn: isEraserOn,
  });
}

function createDrownObject() {
  drownObject.backgroundColor = currentBackgroundColor;
  drownObject.parametersArray = parametersArray;
  parametersArray = [];
  drownObjectsArray.push(drownObject);
  drownObject = {};
}

// Save in Local Storage
saveStorage.onclick = () => {
  localStorage.setItem("picture", JSON.stringify(drownObjectsArray));
  activeTool.textContent = " Canvas Saved";
  setTimeout(() => {
    activeTool.textContent = "Brush";
  }, 1500);
};

// Load Local Storage
loadStorage.onclick = () => {
  if (localStorage.getItem("picture")) {
    drownObjectsArray = JSON.parse(localStorage.getItem("picture"));
    activeTool.textContent = "Canvas Loaded";
    setTimeout(() => {
      activeTool.textContent = "Brush";
    }, 1500);
    storageToCanvas(drownObjectsArray);
  } else {
    activeTool.textContent = "No Canvas Found";
    setTimeout(() => {
      activeTool.textContent = "Brush";
    }, 1500);
  }
};

// Local Storage to Canvas
function storageToCanvas(arr) {
  canvas.style.backgroundColor = arr[0].backgroundColor;
  arr.forEach((element) => {
    let x = element.startPosition.x;
    let y = element.startPosition.y;
    ctx.beginPath();
    lineCap = "round";
    ctx.moveTo(x, y);
    element.parametersArray.forEach((point) => {
      if (point.isEraserOn) {
        ctx.strokeStyle = arr[0].backgroundColor;
      } else {
        ctx.strokeStyle = point.color;
      }
      ctx.lineWidth = point.lineWidth;
      ctx.lineTo(point.x, point.y);
    });
    ctx.stroke();
  });
}

// Clear Local Storage
clearStorage.onclick = () => {
  localStorage.removeItem("picture");
  activeTool.textContent = "Local Storage Cleared";
  setTimeout(() => {
    activeTool.textContent = "Brush";
  }, 1500);
};

// Download Image
downloadEl.addEventListener("click", () => {
  downloadEl.href = canvas.toDataURL("image/jpeg", 1);
  downloadEl.download = "paint-example.jpeg";
  // Active Tool
  activeTool.textContent = "Image File Saved";
  setTimeout(() => {
    activeTool.textContent = "Brush";
  }, 1500);
});

// Drowing
canvas.addEventListener("mousedown", (e) => {
  ++mouseDown;
  let x = e.offsetX;
  let y = e.offsetY;
  ctx.beginPath();
  ctx.lineWidth = lineWidth;
  lineCap = "round";
  if (isBrushOn) {
    ctx.strokeStyle = currentBrushColor;
  } else if (isEraserOn) {
    ctx.strokeStyle = currentBackgroundColor;
  }
  storeStartCoordinate(x, y);
  ctx.moveTo(x, y);
  canvas.onmousemove = (e) => {
    if (mouseDown) {
      let x = e.offsetX;
      let y = e.offsetY;
      storeParameters(x, y, currentBrushColor, lineWidth, isEraserOn);
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };
});
canvas.addEventListener("mouseup", () => {
  --mouseDown;
  createDrownObject();
});
