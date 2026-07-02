app.controller('EmployeeWiseGPSLogController', function ($scope, $compile, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'EmployeeWise GPS Log';

	$scope.onBtExportCSV = function () {
		var params = {
			fileName: 'EmployeeWiseGPSLog.csv',
			sheetName: 'EmployeeWise GPS Log'
		};

		$scope.gridOptions.api.exportDataAsCsv(params);
	}
	$scope.onFilterTextBoxChanged = function () {
		$scope.gridOptions.api.setQuickFilter($scope.search);
	}
	$scope.LoadData = function () {
		$('.select2').select2();
		$scope.EmployeeSearchOptions = GlobalServices.getEmployeeSearchOptions();

		$scope.beData = {
			SelectEmployee: $scope.EmployeeSearchOptions[0].value,
			ForDate_TMP: new Date(),
			IsMapOrList: true,
		};

		$scope.columnDefs = [
			{ headerName: "Date", field: "LogMiti", dataType: 'Text', filter: "agTextColumnFilter", width: 160, cellStyle: { 'text-align': 'left' } },
			{
				headerName: "Time",
				field: "LogDateTime",
				filter: "agTextColumnFilter",
				width: 140,
				cellStyle: { 'text-align': 'left' },
				valueFormatter: function (params) {
					if (!params.value) return '';
					const date = new Date(params.value);
					let hours = date.getHours();
					const minutes = date.getMinutes().toString().padStart(2, '0');
					const ampm = hours >= 12 ? 'PM' : 'AM';
					hours = hours % 12;
					hours = hours ? hours : 12;
					return `${hours}:${minutes} ${ampm}`;
				}
			},
			{ headerName: "LocationName", field: "LocationName", dataType: 'Text', filter: "agTextColumnFilter", width: 280, cellStyle: { 'text-align': 'left' } },
			{
				headerName: "Location",
				field: "LocationName",
				width: 120, cellStyle: {
					display: 'flex',
					'justify-content': 'center',   // horizontal center
					'align-items': 'center'       // vertical center
				},
				cellRenderer: function (params) {
					if (!params.data || !params.data.Lat || !params.data.Lng) return '';
					var html = `<a href="javascript:void(0)" ng-click="openMapModal(${params.data.Lat}, ${params.data.Lng})"><i class="fas fa-map-marker-alt text-info"></i></a>`;
					var eDiv = document.createElement('div');
					eDiv.innerHTML = html;
					$compile(eDiv)($scope);
					return eDiv;
				}
			},
			{ headerName: "Latitude", field: "Lat", dataType: 'Text', filter: "agTextColumnFilter", width: 160, cellStyle: { 'text-align': 'left' } },
			{ headerName: "Longitude", field: "Lng", dataType: 'Text', filter: "agTextColumnFilter", width: 160, cellStyle: { 'text-align': 'left' } },
		];

		$scope.gridOptions = {
			defaultColDef: {
				filter: true,
				resizable: true,
				sortable: true
			},
			enableSorting: true,
			multiSortKey: 'ctrl',
			enableColResize: true,
			overlayLoadingTemplate: "Loading..",
			overlayNoRowsTemplate: "No Records found",
			rowSelection: 'multiple',
			columnDefs: $scope.columnDefs,
			rowData: null,
			filter: true,
			enableFilter: true,
		};

		// Initialize grid after DOM is ready
		$timeout(function () {
			var eGridDiv = document.querySelector('#datatable');
			new agGrid.Grid(eGridDiv, $scope.gridOptions);
		});

	}

	$scope.$watch('beData.IsMapOrList', function (newVal) {
		if (newVal && $scope.DataColl) {
			$timeout(function () {
				var eGridDiv = document.querySelector('#datatable');
				new agGrid.Grid(eGridDiv, $scope.gridOptions);
				$scope.gridOptions.api.setRowData($scope.DataColl);
			});
		}
	});

	$scope.openMapModal = function (lat, lng) {
		if (!lat || !lng) {
			Swal.fire('Coordinates not available!');
			return;
		}
		var url = `https://maps.google.com/maps?q=${lat},${lng}&hl=es;z=14&output=embed`;
		document.getElementById('mapFrame').src = url;
		$('#googleMapModal').modal('show');
	};

	var map;
	$scope.GetEmployeeWiseGPSLog = function () {
		if ($scope.beData.UserId) {
			$scope.loadingstatus = 'running';
			showPleaseWait();

			var para = {
				forUserId: $scope.beData.UserId,
				dateFrom: $filter('date')(new Date($scope.beData.ForDateDet.dateAD), 'yyyy-MM-dd') + ' 00:00',
				dateTo: $filter('date')(new Date($scope.beData.ForDateDet.dateAD), 'yyyy-MM-dd') + ' 23:59'
			};
			$http({
				method: 'POST',
				url: base_url + "Global/GetGPSLog",
				data: JSON.stringify(para)
			}).then(function (res) {
				hidePleaseWait();
				$scope.loadingstatus = "stop";

				if (res.data.IsSuccess && res.data.Data && res.data.Data.length > 0) {
					$scope.DataColl = res.data.Data;
					if ($scope.beData.IsMapOrList == false) {
						setTimeout(function () {
							drawLeafletPath($scope.DataColl);
						}, 300);
					} else {
						let uniqueData = $scope.DataColl.reduce((acc, item) => {
							const key = new Date(item.PushLogDateTime).getTime();
							if (!acc.map[key]) {
								acc.map[key] = true;
								acc.result.push(item);
							}
							return acc;
						}, { map: {}, result: [] }).result;

						$scope.gridOptions.api.setRowData(uniqueData);
					}
				} else {
					Swal.fire(res.data.ResponseMSG || "No GPS data found");
				}
			}, function (reason) {
				hidePleaseWait();
				$scope.loadingstatus = "stop";
				Swal.fire('Failed: ' + reason);
			});
		}
	};

	function drawLeafletPath(data) {
		if (!data || data.length === 0) return;
		data = data.filter((v, i, a) =>
			i === a.findIndex(t => t.Lat === v.Lat && t.Lng === v.Lng)
		);
		data.sort((a, b) => new Date(a.PushLogDateTime) - new Date(b.PushLogDateTime));
		const latlngs = data.map(item => [parseFloat(item.Lat), parseFloat(item.Lng)]);
		if (map) map.remove();
		map = L.map('map').setView(latlngs[0], 15);

		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);

		// Draw polyline
		const polyline = L.polyline(latlngs, { color: 'red', weight: 4, opacity: 0.7, dashArray: '10, 5' }).addTo(map);
		map.fitBounds(polyline.getBounds());
		// Custom icons
		const startIcon = L.divIcon({
			html: '<i class="fas fa-sign-in-alt" style="font-size:24px;color:green;"></i>',
			className: '', iconSize: [24, 24], iconAnchor: [12, 24], popupAnchor: [0, -24]
		});
		const endIcon = L.divIcon({
			html: '<i class="fas fa-sign-out-alt" style="font-size:24px;color:red;"></i>',
			className: '', iconSize: [24, 24], iconAnchor: [12, 24], popupAnchor: [0, -24]
		});
		const pointIcon = L.divIcon({
			html: '<i class="fas fa-map-marker-alt text-danger" style="font-size:20px;"></i>',
			className: '', iconSize: [20, 20], iconAnchor: [10, 20], popupAnchor: [0, -20]
		});
		// Add markers
		data.forEach((item, index) => {
			let icon = pointIcon;
			if (index === 0) {
				icon = startIcon; // Start marker
			} else if (index === data.length - 1) {
				icon = endIcon; // Last item = End marker
			}
			const marker = L.marker([item.Lat, item.Lng], { icon }).addTo(map);
			const formattedTime = $filter('date')(new Date(item.PushLogDateTime), 'hh:mm a');
			const popupContent = `<b>Name:</b> ${item.Name} <br/>
            <b>Address:</b> ${item.Address} <br/>
            <b>Mobile:</b> ${item.MobileNo} <br/>
            <b>Location:</b> ${item.LocationName} <br/>
            <b>Time:</b> ${item.LogMiti} ${formattedTime}`;
			marker.bindPopup(popupContent);
			marker.bindTooltip(popupContent, { direction: 'top', permanent: false });
		});

		for (let i = 0; i < latlngs.length - 1; i++) {
			const [lat1, lng1] = latlngs[i];
			const [lat2, lng2] = latlngs[i + 1];
			const midLat = (lat1 + lat2) / 2;
			const midLng = (lng1 + lng2) / 2;
			// Bearing in degrees
			const bearing = Math.atan2(lng2 - lng1, lat2 - lat1) * (180 / Math.PI);
			// Arrow icon
			const arrowIcon = L.divIcon({
				html: `<div style=" border: 1px solid #ff0000; border-radius: 50%; background-color: #fff;">
					<i class="fas fa-arrow-up" style="color: #007bff9c;font-size:16px;"></i>
					</div>`,
				className: '', iconSize: [16, 16], iconAnchor: [8, 8]
			});
			L.marker([midLat, midLng], {
				icon: arrowIcon,
				rotationAngle: bearing,
				rotationOrigin: 'center center',
				interactive: false,
				zIndexOffset: 1000
			}).addTo(map);
		}
		map.attributionControl.remove();
	}

});