

app.controller("LastVisitMapController", function ($scope, $http, $filter, $timeout, $compile, GlobalServices) {
var PrintPreviewAs = 1;
 const contextMenu = GlobalServices.createElementForMenu();
    LoadData();

    function LoadData() {

        $scope.searchData = {
            Salesman: '',
            Route: '',
            Distributor: ''
        };

        $scope.SelectedData = {            
            AgentId: null,
            ForDate:null,
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


        $scope.mapIconColl = ['https://maps.gstatic.com/mapfiles/ms2/micons/blue-dot.png',
            'https://maps.gstatic.com/mapfiles/ms2/micons/red-dot.png',
            'https://maps.gstatic.com/mapfiles/ms2/micons/green-dot.png',
            'https://maps.gstatic.com/mapfiles/ms2/micons/ltblue-dot.png',
            'https://maps.gstatic.com/mapfiles/ms2/micons/yellow-dot.png',
            'https://maps.gstatic.com/mapfiles/ms2/micons/purple-dot.png',
            'https://maps.gstatic.com/mapfiles/ms2/micons/pink-dot.png'];
         

    }

    let map; // declare map outside $timeou
  
     
    $scope.MarkerColl = [];
    $scope.GetOutLet = function () {
        var PhotoURL = base_url;

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


        $scope.loadingstatus = 'running';
        showPleaseWait();

        var para = {
            forDate: null,
            AgentId: $scope.SelectedData.AgentId,
        };
        $scope.DataColl = []; //declare an empty array        
        $http({
            method: 'POST',
            url: base_url + "Account/Reporting/GetLastVisitLog",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {

            $scope.loadingstatus = 'stop';
            hidePleaseWait();
            if (res.data.IsSuccess && res.data.Data) {
                $scope.DataColl = res.data.Data;
 
                $timeout(function () {
                    $scope.selectedMarker = {}; // For modal binding

                    // Initialize map
                    map = L.map('map').setView([$scope.DataColl[0].Lat, $scope.DataColl[0].Lng], 10);

                    // Add tile layer
                    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                        attribution: '&copy; OpenStreetMap contributors'
                    }).addTo(map);

                    // Plot markers and polyline
                    var latlngs = [];

                    $scope.DataColl.forEach(function (item) {
                        var latlng = [item.Lat, item.Lng];
                        latlngs.push(latlng);

                        var marker = L.marker(latlng).addTo(map);
                        marker.on('click', function () {
                            $scope.selectedMarker = item;
                            getAddressFromLatLng(item.Lat, item.Lng, function (err, address) {
                                if (address && address.length > 0) {

                                    $timeout(function () {
                                        $scope.$apply(function () {
                                            $scope.selectedMarker.CurAddress = address;
                                        });
                                    });
                                    
                                }
                            });
                            $scope.$apply(); // Required to update AngularJS scope
                            $('#infoModal').modal('show');
                        });
                    });

                    // Draw polyline
                    L.polyline(latlngs, { color: 'blue' }).addTo(map);
                    map.fitBounds(latlngs);
                });
               

            } else
                alert(res.data.ResponseMSG);

        }, function (reason) {
            $scope.loadingstatus = "stop";
            alert('Failed' + reason);
        });
    }

    function getAddressFromLatLng(lat, lng, callback) {
        const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`;

        fetch(url, {
            headers: {
                'User-Agent': 'Salesapp', // Important to avoid being blocked
            }
        })
            .then(response => response.json())
            .then(data => {
                if (data && data.display_name) {
                    callback(null, data.display_name);
                } else {
                    callback("No address found");
                }
            })
            .catch(error => {
                callback(error);
            });
    }

   


});