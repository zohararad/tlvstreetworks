// For an introduction to the Fixed Layout template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232508
(function () {
    "use strict";

    var app = WinJS.Application;

    app.onactivated = function (eventObject) {
        if (eventObject.detail.kind === Windows.ApplicationModel.Activation.ActivationKind.launch) {
            if (eventObject.detail.previousExecutionState !== Windows.ApplicationModel.Activation.ApplicationExecutionState.terminated) {
                // TODO: This application has been newly launched. Initialize 
                // your application here.
            } else {
                // TODO: This application has been reactivated from suspension. 
                // Restore application state here.
            }
            WinJS.UI.processAll();
        }
    };

    app.oncheckpoint = function (eventObject) {
        // TODO: This application is about to be suspended. Save any state
        // that needs to persist across suspensions here. You might use the 
        // WinJS.Application.sessionState object, which is automatically
        // saved and restored across suspension. If you need to complete an
        // asynchronous operation before your application is suspended, call
        // eventObject.setPromise(). 
    };

    app.start();

    var StreetData = [
                    {
                        street: 'דרך קיבוץ גלויות',
                        section: 'משדרות גורי ישראל עד רחוב אסירי ציון',
                        restriction: 'מ- 21:00 עד 05:00, סגירה חלקית',
                        from: '05/02/2012',
                        to: '31/07/2012'
                    },
                    {
                        street: 'דרך קיבוץ גלויות',
                        section: 'מדרך שלמה עד רחוב שלבים',
                        restriction: 'מ- 07:00 עד 07:00, מסלול צפוני סגור התנועה כסדרה',
                        from: '26/06/2011',
                        to: '26/06/2012'
                    }
    ];

    var RouteFinder = {
        routes: [],
        restAPIURL: 'http://maps.googleapis.com/maps/api/directions/json?region=il&sensor=false&mode=walking',
        init: function () {
            this.mapIframe = document.getElementById('mapContainer');
            this.routesList = document.getElementById('routesList');
            this.parseRoutes();
        },
        parseRoutes: function () {
            for (var i = 0, l = StreetData.length; i < l; i++) {
                var o = StreetData[i];
                var route = this.parseAddress(o.street, o.section);
                var request = {
                    origin: route.origin,
                    destination: route.destination
                };
                var index = i;
                var url = this.restAPIURL + '&origin=' + encodeURIComponent(route.origin) + '&destination=' + encodeURIComponent(route.destination);
                WinJS.xhr({ url: url }).done(
                    function complete(result) {
                        var d = JSON.parse(result.responseText);
                        if (d.status === 'OK') {
                            o.points = d.routes[0].overview_polyline.points; 
                            this.routes.push(o);
                            this.updateRouteOnMap(o, index);
                            this.addRouteToList(o, index);
                        }
                    }.bind(this),
                    function error(result) {
                        console.log(result.statusText);
                    }.bind(this)
                );
            }
        },
        /**
         * Send route data to map
         */
        updateRouteOnMap: function (route, index) {
            this.mapIframe.contentWindow.postMessage(JSON.stringify({ route: route, index: index, action: 'placeRouteOnMap' }), "*");
        },
        /**
         * Adds route to the sidebar display
         */
        addRouteToList: function (route, index) {
            var li = document.createElement('li');
            li.innerHTML = [route.street, ' - ', route.section].join('');
            li.addEventListener('click', function () {
                this.mapIframe.contentWindow.postMessage(JSON.stringify({ index: index, action: 'centerOnRoute' }), "*");
            }.bind(this), false);
            this.routesList.appendChild(li);
        },
        /**
         * Parse a street address into an origin and destination strings that are used to create a route
         * on the map.
         * returns {Object} with origin and destination address strings
         */
        parseAddress: function (street, section) {
            var bounds = section.split('עד'),
                tlv = 'תל-אביב',
                from = bounds[0].trim().substr(1, bounds[0].length).replace(/\s+/g, '+'),
                to = bounds[1].trim().replace(/\s+/g, '+'),
                strt = street.trim().replace(/\s+/g, '+');
            return {
                origin: [strt, 'פינת', from, tlv].join('+'),
                destination: [strt, 'פינת', to, tlv].join('+')
            }
        }
    }

    RouteFinder.init();
    // trim string whitespaces
    String.prototype.trim = function () {
        return this.replace(/^\s+|\s+$/g, "");
    }

})();
