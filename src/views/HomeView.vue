<script setup>
import { onMounted, watch, ref } from 'vue';
import { useMarkerStore } from '../stores/marker'
import { storeToRefs } from 'pinia';
const markerStore = useMarkerStore();
const { polygonArea, polygonAreaDiameter, all, polygon, circleArea, allCircles }  = storeToRefs(markerStore)
const { addMarker, reset, addCircle, createPolygonMarkers } = markerStore;

/*canvas */
let canvas;
let ctx;

watch(() => allCircles.value, (before, after) => {
    cleanCanvas();
    drawCircles();
    if(allCircles.value.length > 2) {
        createPolygonMarkers();
        createPolygon();
    }
},{deep: true})

onMounted(() => {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    startCanvas();

    // Three Event listeners for mouse events

    canvas.addEventListener("mousedown", (e) => {
        const mouseX = e.clientX - canvas.getBoundingClientRect().left;
        const mouseY = e.clientY - canvas.getBoundingClientRect().top;

        // Check if the mouse is inside any of the circles
        for (const circle of allCircles.value) {
            if (isMouseInsideCircle(circle, mouseX, mouseY)) {
                circle.isDragging = true;
            }
        }
    });

    canvas.addEventListener("touchstart", (e) => {
        const mouseX = e.clientX - canvas.getBoundingClientRect().left;
        const mouseY = e.clientY - canvas.getBoundingClientRect().top;

        // Check if the mouse is inside any of the circles
        for (const circle of allCircles.value) {
            if (isMouseInsideCircle(circle, mouseX, mouseY)) {
                circle.isDragging = true;
            }
        }
    });

    canvas.addEventListener("mousemove", (e) => {
        const mouseX = e.clientX - canvas.getBoundingClientRect().left;
        const mouseY = e.clientY - canvas.getBoundingClientRect().top;

        // Update the position of the dragged circles
        for (const circle of allCircles.value) {
            if (circle.isDragging) {
                
                circle.x = mouseX;
                circle.y = mouseY;
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }   
        }
    });
    canvas.addEventListener("touchmove", (e) => {
        const mouseX = e.clientX - canvas.getBoundingClientRect().left;
        const mouseY = e.clientY - canvas.getBoundingClientRect().top;

        // Update the position of the dragged circles
        for (const circle of allCircles.value) {
            if (circle.isDragging) {
                
                circle.x = mouseX;
                circle.y = mouseY;
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }   
        }
    });

    canvas.addEventListener("mouseup", () => {
        // Reset the dragging flag for all circles
        for (const circle of allCircles.value) {
            circle.isDragging = false;
        }
    });
    canvas.addEventListener("touchend", () => {
        // Reset the dragging flag for all circles
        for (const circle of allCircles.value) {
            circle.isDragging = false;
        }
    });

})

function isMouseInsideCircle(circle, mouseX, mouseY) {
    const dx = mouseX - circle.x;
    const dy = mouseY - circle.y;
    return dx * dx + dy * dy <= circle.radius * circle.radius;
}

function add( event ) {
    if(allCircles.value.length < 3) {
        const {clientX, clientY} = event
        let position = {x: clientX, y: clientY}
        addCircle(position)
    } else {
        createPolygonMarkers()
    }
}

function restart() {
    reset();
    cleanCanvas();
}

function drawCircles() {
    for (const circle of allCircles.value) {
        drawRedCircle(circle)
    }
}

function drawRedCircle(circle) {
    ctx.beginPath();
    ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
    ctx.strokeStyle = '#ff0000';
    ctx.stroke();
}

function drawCircle(circle, color) {
    ctx.beginPath();
    ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
    ctx.strokeStyle = color;
    ctx.stroke();
}

function resize() {
    content.strokeStyle = 'red';
    content.lineWidth = '10';
}

function fitCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight; 
}

function startCanvas() {
    //window.addEventListener('resize', fitCanvas, false);
    fitCanvas();
}

function cleanCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function createPolygon() {
    ctx.beginPath();
    ctx.moveTo(polygon.value[0].x, polygon.value[0].y);
    for(let i = 1; i < polygon.value.length; i += 1 ){
        ctx.lineTo( polygon.value[i].x , polygon.value[i].y )
    }
    ctx.closePath();
    ctx.strokeStyle = "blue";
    ctx.stroke();

    // Get center for yellow circle
    let x = (polygon.value[0].x + polygon.value[2].x) /2;
    let y = (polygon.value[1].y + polygon.value[3].y) /2;
    let diameter = polygonAreaDiameter.value
    let radius = diameter / 2
    drawCircle({x: x,y: y, radius: radius}, '#FFC300') 
    
}

</script>

<template>
    <section>
        <canvas id="canvas" @click="add">Joakim Lundell</canvas>
        
        <div class="canvas-info">
            <div>Click on the canvas to add three points.</div> 
            <Transition>
                <div v-if="allCircles.length > 0">Your have clicked at: {{ allCircles }}</div>
            </Transition>
            <Transition>
                <div v-if="polygon.length > 0">All four points creating the parallelogram: <br />{{ polygon }}</div>
            </Transition>
            <Transition>
                <div v-if="polygonArea">The area of the parallelogram is {{ polygonArea }} square units.</div>
            </Transition>
            <Transition>
                <div v-if="polygonAreaDiameter">The diameter of the yellow circle is {{ polygonAreaDiameter.toFixed(2) }} units.</div>
            </Transition>
            <Transition>
                <div v-if="polygonArea">The area of the yellow circle is {{ circleArea }} square units.</div>
            </Transition>       
        </div>
        <div class="reset-button-position">
            <Transition>
                <button v-if="polygonAreaDiameter" @click="restart">Restart</button>
            </Transition>
        </div>
    </section>
</template>

<style scoped>

#canvas {
    margin: 0; 
    padding: 0;
    background: transparent;
    z-index: 10;

}
.canvas-info {
    position: absolute;
    top: calc(var(--header-height) + var(--padding));
    left: var(--padding);
    font-size: .8rem;
    z-index: -1;
    padding-right: 200px;
}
.canvas-info div {
    padding-bottom: 12px;
}

.reset-button-position {
    position: absolute;
    top: calc(var(--header-height) + var(--padding));
    right: var(--padding);
}

.reset-button-position button {
    padding: 6px 18px;
    letter-spacing: 1px;
}

.v-enter-active,
.v-leave-active {
    transition: opacity 1s ease;
}

.v-enter-from,
.v-leave-to {
    opacity: 0;
}
</style>