

app.controller("OutLetMapController", function ($scope, $http, $filter, $timeout, $compile, GlobalServices) {
var PrintPreviewAs = 1;
 const contextMenu = GlobalServices.createElementForMenu();
    LoadData();

    function LoadData() {


        $('.select2').select2({
            allowClear: true,
            // openOnEnter: true
        });


        $scope.GenConfig = {};
        GlobalServices.getGenConfig().then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.GenConfig = res.data.Data;
                PrintPreviewAs = $scope.GenConfig.PrintPreviewAs;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });


        $scope.newFilter = {
            DateFrom_TMP: new Date(),
            DateTo_TMP: new Date(),
            AgentId:0
        };
         
          
        $scope.SalesManList = [];
        $http({
            method: 'GET',
            url: base_url + "Account/Creation/GetAllSalesMan",
            dataType: "json"
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.SalesManList = res.data.Data;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
   

    }


    let map; // declare map outside $timeou

    $scope.MarkerColl = [];
    $scope.GetOutLet = function () {

        if ($scope.newFilter.AgentId > 0) {

        } else {
            return;
        }

        $scope.newFilter.Distance = 0;
        $scope.loadingstatus = 'running';
        showPleaseWait();

        var para = {
            AgentId: $scope.newFilter.AgentId,
            DateFrom: $filter('date')($scope.newFilter.DateFromDet.dateAD, 'yyyy-MM-dd'),
            DateTo: $filter('date')($scope.newFilter.DateToDet.dateAD, 'yyyy-MM-dd'),            
        };
        $scope.DataColl = []; //declare an empty array        
        $http({
            method: 'POST',
            url: base_url + "Account/Reporting/GetGPSForPolyMap",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {

            $scope.loadingstatus = 'stop';
            hidePleaseWait();
            if (res.data.IsSuccess && res.data.Data) {


                if (map && map.remove) {
                    map.remove();  // completely removes map and listeners
                    map = null;
                }
                document.getElementById('map').innerHTML = '';
 
                // 💥 Forcefully remove Leaflet container reference
                const container = document.getElementById('map');
                if (container && container._leaflet_id) {
                    container._leaflet_id = null; // ← This breaks Leaflet's internal reference
                }

                $timeout(function () {
                    $scope.DataColl = res.data.Data;

                    var visitPoints = [];
                    angular.forEach($scope.DataColl, function (dc) {
                        var newArra = [];
                        newArra.push(dc.Lat);
                        newArra.push(dc.Lng);
                        visitPoints.push(newArra);
                    });

                    var totalDistance = totalDistanceHaversine(visitPoints);
                    $scope.newFilter.Distance = totalDistance;

                    var stopPoints = [];
                    angular.forEach($scope.DataColl, function (dc) {
                        if (dc.IsOutlet == true) {                
                            stopPoints.push(dc);
                        }
                    });



                    // Initialize new map
                    map = L.map('map').setView(visitPoints[0], 11);

                    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                        attribution: '&copy; OpenStreetMap contributors'
                    }).addTo(map);

                    // Custom stop point icon
                    const stopIcon = L.icon({
                        iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
                        iconSize: [30, 30],
                        iconAnchor: [15, 30],
                        popupAnchor: [0, -30]
                    });

                    const stopIcon1 = L.icon({
                        iconUrl: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
                        iconSize: [30, 30],
                        iconAnchor: [15, 30],
                        popupAnchor: [0, -30]
                    });

                    const latlngs = [];

                    // Add markers with details
                    stopPoints.forEach((point, index) => {
                        if (point.HasOrder == false) {
                            const marker = L.marker([point.Lat, point.Lng], { icon: stopIcon }).addTo(map);
                            marker.bindPopup(`<b>${point.Remarks}</b>`);
                        } else
                        {
                            const marker = L.marker([point.Lat, point.Lng], { icon: stopIcon1 }).addTo(map);
                            marker.bindPopup(`<b>${point.Remarks}</b>`);
                        }
                        
                    });

                    // Connect visit points with a line
                    const polyline = L.polyline(visitPoints, {
                        color: 'blue',
                        weight: 4
                    }).addTo(map);

                    // Fit map to route bounds
                    map.fitBounds(polyline.getBounds());


                    // Add arrow direction from start ➝ end
                    if (L.Symbol && L.polylineDecorator) {
                        const decorator = L.polylineDecorator(visitPoints, {
                            patterns: [
                                {
                                    offset: '5%',
                                    repeat: '10%',
                                    symbol: L.Symbol.arrowHead({
                                        pixelSize: 12,
                                        pathOptions: { fillOpacity: 1, weight: 0, color: 'red' }
                                    })
                                }
                            ]
                        }).addTo(map);
                    } else {
                        //alert("PolylineDecorator plugin not loaded!");
                        console.log("L.Symbol:", L.Symbol);
                    }

                });

                 
            } else
                alert(res.data.ResponseMSG);

        }, function (reason) {
            $scope.loadingstatus = "stop";
            alert('Failed' + reason);
        });
    }
     
    function haversineDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Radius of Earth in KM
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;

        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // Distance in KM
    }

    function totalDistanceHaversine(points) {
        let total = 0;

        for (let i = 0; i < points.length - 1; i++) {
            total += haversineDistance(
                points[i][0], points[i][1],
                points[i + 1][0], points[i + 1][1]
            );
        }

        return total.toFixed(2);
    }


});