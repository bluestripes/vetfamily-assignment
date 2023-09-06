import { defineStore } from 'pinia'

export const useMarkerStore = defineStore('marker',  {
    state: () => ({
        //markers: [],
        polygonMarkers: [],
        polygonArea: null,
        diameter: null,
        maxCount: 3,
        circle: {x: 0, y: 0, radius: 0, isDragging: false},
        circles: []
    }),

    getters: {
    
        /*all(state) {
            return state.markers
        },*/
        polygon (state) {
            return state.polygonMarkers
        },
        polygonAreaDiameter (state) {
            return state.diameter
        },
        circleArea (state) {
            let radius = state.diameter / 2
            return Math.round(radius * radius * Math.PI)
        },
        allCircles( state ) {
            return state.circles
        }
    },

    actions: {

        reset() {
            this.circles = []
            this.polygonMarkers = []
            this.polygonArea = null
            this.diameter = null
        },
        
        addCircle(position){
            if (this.circles.length < this.maxCount) {  
                this.circles.push({x: position.x, y: position.y, radius: 5.5, isDragging: false})
            } 
        },

        addPolygonMarker (position) {
            this.polygonMarkers.push(position)
        },
        
        resetPolygonMarker (position) {
            this.polygonMarkers = []
        },

        createPolygonMarkers() {
            this.polygonMarkers = []
            this.circles.forEach (marker => this.addPolygonMarker(marker))
            this.addTheFourthMarker()
        },

        addTheFourthMarker() {
            let x = Math.round(
                this.polygonMarkers[0].x - Math.round(
                    this.polygonMarkers[1].x - this.polygonMarkers[2].x))
            let y = Math.round(
                this.polygonMarkers[2].y - Math.round(
                    this.polygonMarkers[1].y - this.polygonMarkers[0].y))
            this.addPolygonMarker({x: x, y: y})
            this.calculatePolygonArea();
        },

        calculatePolygonArea() {
            this.polygonArea = this.parallelogramArea(this.polygonMarkers)
            this.diameter = this.diameterFromArea(this.polygonArea)
        },

        distanceBetween(point1, point2) {
            let a = point1.x - point2.x
            let b = point1.y - point2.y
            return Math.sqrt(a*a + b*b)
        },

        parallelogramArea(points) {
            if (points.length !== 4) {
              return "Invalid input. You need exactly four points.";
            }
          
            const x = [];
            const y = [];
          
            // Separate x and y coordinates into separate arrays
            for (let i = 0; i < 4; i++) {
              x.push(points[i].x);
              y.push(points[i].y);
            }
          
            // Calculate the area using the shoelace formula
            const area = 0.5 * Math.abs(
              x[0] * y[1] + x[1] * y[2] + x[2] * y[3] + x[3] * y[0] -
              y[0] * x[1] - y[1] * x[2] - y[2] * x[3] - y[3] * x[0]
            );
          
            return area;
        },

        diameterFromArea(area) {
            const radius = Math.sqrt(area / Math.PI);
            const diameter = 2 * radius;
            return diameter;
        }

    }
})
