<script setup>
import { onMounted, watch } from 'vue';
import { useMarkerStore } from '../stores/marker'
import { storeToRefs } from 'pinia';
const markerStore = useMarkerStore();
const { polygonArea, polygonAreaDiameter,all, polygon }  = storeToRefs(markerStore)
const { addMarker, reset } = markerStore;

/*canvas */
let canvas;
let ctx;

watch(() => all.value, (before, after) => {
    updateMarkerCircles();
},{ deep: true })

onMounted(() => {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    startCanvas();
})


function add( event ) {
    cleanCanvas();
    const {clientX, clientY} = event
    let position = {x: clientX, y: clientY}
    addMarker(position)
}

function restart() {
    reset();
    cleanCanvas();
}

function updateMarkerCircles() {
    all.value.forEach((marker) => {
        drawCircle(marker, 'red', 11); 
    })
    if(all.value.length > 2) {
        createPolygon();
    }
}

function drawCircle( marker, color, diameter) {
    ctx.beginPath();
    ctx.arc(marker.x, marker.y, diameter/2, 0,2*Math.PI);
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
    updateMarkerCircles();
}

function startCanvas() {
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
    ctx.strokeStyle = "blue";
    ctx.stroke();

    // Get center for yellow circle
    let x = (polygon.value[0].x + polygon.value[2].x) /2;
    let y = (polygon.value[1].y + polygon.value[3].y) /2;
    let diameter = polygonAreaDiameter.value
    drawCircle({x:x,y:y}, '#FFC300', diameter) 
}
</script>

<template>
    <section>
        <canvas id="canvas" @click="add">Joakim Lundell</canvas>
        <div class="canvas-info">
            <div>Click on the canvas to add three points.</div> 
            <Transition>
                <div v-if="all.length > 0">Your have clicked at: {{ all }}</div>
            </Transition>
            <Transition>
                <div v-if="polygon.length > 0">All four points creating the parallelogram: <br />{{ polygon }}</div>
            </Transition>
            <Transition>
                <div v-if="polygonArea">The area of the parallelogram is {{ polygonArea }} square units.</div>
            </Transition>
            <Transition>
                <div v-if="polygonAreaDiameter">The diameter of the yellow circle is {{ polygonAreaDiameter }} units.</div>
            </Transition>
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
    background: var(--color-background);
}
.canvas-info {
    position: absolute;
    top: calc(var(--header-height) + var(--padding));
    left: var(--padding);
    z-index: 10;
    font-size: 0.75rem;
    letter-spacing: .5px;
}
.canvas-info div {
    padding-bottom: 12px;
}
.canvas-info button {
    margin-top: 12px;
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