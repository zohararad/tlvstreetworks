(function () {

    "use strict";

    /**
     * Map manager
     */
    var Map = {
        routes: [],
        markers: [],
        infoWindows: [],
        currentInfoWindow:null,
        /**
         * Initialize the map manager
         */
        init: function () {
            window.addEventListener("message", this.onMessage.bind(this), false);
            var mapOptions = {
                center: new google.maps.LatLng(32.0779701, 34.788462),
                zoom: 14,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            this.map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
            this.directionsService = new google.maps.DirectionsService();
        },
        placeRouteOnMap: function (d) {
            var route = d.route,
                index = d.index;
            var path = google.maps.geometry.encoding.decodePath(route.points);

            var closedRoute = new google.maps.Polyline({
                path: path,
                strokeColor: "#e43710",
                strokeOpacity: 1.0,
                strokeWeight: 6
            });

            closedRoute.setMap(this.map);

            var marker = new google.maps.Marker({
                position: path[0],
                map: this.map
            });

            var s = [
                                '<div class="routeInfo"><p class="section">', route.street, ' ', route.section, '</p>',
                                '<p class="period">בתאריכים: ', route.from, ' עד ', route.to, '</p>',
                                '<p class="restrictions">', route.restriction, '</p></div>'
            ];

            var infowindow = new google.maps.InfoWindow({
                content: s.join('')
            });

            google.maps.event.addListener(marker, 'click', function () {
                if (this.currentInfoWindow !== null) {
                    this.currentInfoWindow.close();
                }
                infowindow.open(this.map, marker);
                this.currentInfoWindow = infowindow;
            }.bind(this));

            this.routes[index] = path[0];
            this.markers[index] = marker;
            this.infoWindows[index] = infowindow;
            if (index === 0) {
                this.map.panTo(path[0]);
            }
        },
        /**
         * Handle postMessage call from app main window
         */
        onMessage: function (e) {
            // origin = ms-appx://3ff5e5e9-544a-4096-9b4d-731f3b8c70f2-75vnc02054zme
            var d = JSON.parse(e.data);
            this[d.action](d);
        },
        /**
         * Center map on a given point / route
         */
        centerOnRoute: function (d) {
            var point = this.routes[d.index];
            this.map.panTo(point);
            var marker = this.markers[d.index];
            if (this.currentInfoWindow !== null) {
                this.currentInfoWindow.close();
            }
            var infowindow = this.infoWindows[d.index];
            infowindow.open(this.map, marker);
            this.currentInfoWindow = infowindow;
        }
    }

    // trim string whitespaces
    String.prototype.trim = function () {
        return this.replace(/^\s+|\s+$/g, "");
    }

    Map.init();
})();