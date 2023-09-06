import { defineStore } from 'pinia'

export const useMarkerStore = defineStore('marker',  {
    state: () => ({
        markers: [],
        polygonMarkers: [],
        polygonArea: null,
        diameter: null,
        maxCount: 3
    }),

    getters: {
    
        all(state) {
            return state.markers
        },
        polygon (state) {
            return state.polygonMarkers
        },
        polygonAreaDiameter (state) {
            return state.diameter
        },
        circleArea (state) {
            let radius = state.diameter / 2
            return Math.round(radius * radius * Math.PI)
        }
    },

    actions: {

        reset() {
            this.markers = []
            this.polygonMarkers = []
            this.polygonArea = null
            this.diameter = null
        }, 

        addMarker( position ) {
            if (this.markers.length < this.maxCount) {  
                this.markers.push(position)
            } else {
                this.resetPolygonMarker()
                this.markers.shift()
                this.markers.push(position)
            }

            if(this.markers.length == this.maxCount) {
                this.markers.forEach(marker => this.addPolygonMarker(marker))
                this.addTheFourthMarker()
            }
        },

        addPolygonMarker (position) {
            this.polygonMarkers.push(position)
        },
        
        resetPolygonMarker (position) {
            this.polygonMarkers = []
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
        },

        clearMarkers() {
            this.markers = []
        }

    }
})
