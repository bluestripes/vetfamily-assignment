<script setup>
import { onMounted, watch, ref } from 'vue';
import { useMarkerStore } from '../stores/marker'
import { storeToRefs } from 'pinia';
const markerStore = useMarkerStore();
const { polygonArea, polygonAreaDiameter, polygon, circleArea, allCircles }  = storeToRefs(markerStore)
const { reset, addCircle, createPolygonMarkers } = markerStore;

/*canvas */
let canvas, ctx;
let red = '#ff0000'
let blue = '#0000ff'
let yellow = '#ffc300'

// For visual update on dragging
const dragging = ref(false);

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
    initCanvas();

    // Event listeners for mouse events
    canvas.addEventListener("mousedown", (e) => {
        const mouseX = e.clientX - canvas.getBoundingClientRect().left;
        const mouseY = e.clientY - canvas.getBoundingClientRect().top;

        // Add point to array
        addPoint(mouseX, mouseY)

        // Check if the mouse is inside any of the circles
        for (const circle of allCircles.value) {
            if (isPointInsideCircle(circle, mouseX, mouseY)) {
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
                dragging.value = true; 

            }   
        }
    });
    
    canvas.addEventListener("mouseup", () => {
        // Reset the dragging flag for all circles
        dragging.value = false; 

        for (const circle of allCircles.value) {
            circle.isDragging = false;
        }
    });

    // Event listeners for touch events
    canvas.addEventListener("touchstart", (e) => {
        e.preventDefault();
    
        const touch = e.touches[0];
        const touchX = touch.clientX - canvas.getBoundingClientRect().left;
        const touchY = touch.clientY - canvas.getBoundingClientRect().top;

        // Add point to array
        addPoint(touchX, touchY)    

        // Check if a touch is inside any of the circles
        for (const circle of allCircles.value) {
            if (isPointInsideCircle(circle, touchX, touchY)) {
                circle.isDragging = true;
            }
        }
    },{ passive: false });

    canvas.addEventListener("touchmove", (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        const touchX = touch.clientX - canvas.getBoundingClientRect().left;
        const touchY = touch.clientY - canvas.getBoundingClientRect().top;

        

        // Update the position of the dragged circles
        for (const circle of allCircles.value) {
            if (circle.isDragging) {
                circle.x = touchX;
                circle.y = touchY;
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                dragging.value = true;
            }
        }
    },{ passive: false });

    canvas.addEventListener("touchend", () => {
        // Reset the dragging flag for all circles

        dragging.value = false; 
        for (const circle of allCircles.value) {
            circle.isDragging = false;
        }
    }); 
    
})

function isPointInsideCircle(circle, x, y) {
    const dx = x - circle.x;
    const dy = y - circle.y;
    return dx * dx + dy * dy <= circle.radius * circle.radius;
}

function addPoint( x, y ) {
    if(allCircles.value.length < 3) {
        let position = {x: x, y: y}
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
        drawCircle(circle, red)
    }
}

function drawCircle(circle, color) {
    ctx.beginPath();
    ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
    ctx.strokeStyle = color;
    ctx.stroke();
}

function fitCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight; 
}

function initCanvas() {
    window.addEventListener('resize', fitCanvas, false);
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
    ctx.strokeStyle = blue;
    ctx.stroke();

    // Get center for yellow circle
    let x = (polygon.value[0].x + polygon.value[2].x) /2;
    let y = (polygon.value[1].y + polygon.value[3].y) /2;
    let diameter = polygonAreaDiameter.value
    let radius = diameter / 2
    drawCircle({x: x,y: y, radius: radius}, yellow) 
    
}

</script>

<template>
    <section>
        <canvas id="canvas">Joakim Lundell was here</canvas>
        
        <div class="canvas-info" ref="info" :class="{'dragging': dragging}">
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
    transition: all 1.5s ease;
}
.canvas-info div {
    padding-bottom: 12px;
}

.reset-button-position {
    position: absolute;
    top: calc(var(--header-height) + var(--padding));
    right: var(--padding);
}

/* Vue transition */
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

/* fade otu text on dragging */
.dragging {
    color: silver;
    transition: all 0.3s ease;
}
</style>