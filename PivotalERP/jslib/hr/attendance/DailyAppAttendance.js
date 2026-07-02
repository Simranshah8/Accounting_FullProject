app.controller('dailyAppAttendanceController', function ($scope, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'Daily App Attendance';

	var gSrv = GlobalServices;

	$scope.LoadData = function () {
		$('.select2').select2();
		$scope.confirmMSG = GlobalServices.getConfirmMSG();
		$scope.perPageColl = GlobalServices.getPerPageList();
 
		$scope.currentPages = {
			Attendance: 1,			
		};

		$scope.searchData = {
			Attendance: '', 
		};

		$scope.perPage = {
			Attendance: GlobalServices.getPerPageRow(), 
		};

		$scope.newDailyAttendance = {			 
			ForDate_TMP: new Date(),
		};
		$scope.AttendanceColl = [];

		$scope.CompanyRelationshipList = [];
		$http({
			method: 'POST',
			url: base_url + "HR/Master/GetAllCompanyRelationship",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.CompanyRelationshipList = res.data.Data;
			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});


		$scope.BranchList = [];
		$http({
			method: 'GET',
			url: base_url + "Setup/Security/GetAllBranchList",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.BranchList = res.data.Data;

			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

		$scope.GetDailyAttendance();
	}
	$scope.GetDailyAttendance = function () {
		$scope.loadingstatus = 'running';
		showPleaseWait();
		$scope.AttendanceColl = [];
		$scope.AllAttendanceColl = [];
		$scope.newDailyAttendance.Status = null;
		var para = {			
			ForDate: $scope.newDailyAttendance.ForDateDet ? $filter('date')(new Date($scope.newDailyAttendance.ForDateDet.dateAD), 'yyyy-MM-dd') : null,
			CompanyId: $scope.newDailyAttendance.CompanyId,
			BranchId:$scope.newDailyAttendance.BranchId,
		}
		$http({
			method: 'POST',
			url: base_url + "HR/Report/GetDailyAppAttendance",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.AttendanceColl = res.data.Data;
				$scope.AllAttendanceColl = res.data.Data;

				$scope.Summary = {
					Total:$scope.AttendanceColl.length,
					TotalIn: 0,
					TotalOut: 0,
					TotalS: 0,
					TotalE:0
				};
				angular.forEach($scope.AttendanceColl, function (att) {
					if (att.InDateTime) {
						$scope.Summary.TotalIn += 1;
					}

					if (att.OutDateTime) {
						$scope.Summary.TotalOut += 1;
					}

					if (att.StartDateTime) {
						$scope.Summary.TotalS += 1;
					}

					if (att.EndDateTime) {
						$scope.Summary.TotalE += 1;
					}

				});

			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	}

	$scope.ShowPersonalImg = function (path) {
		$scope.viewImg = {};
		if (path) {
			$scope.viewImg = {
				ContentPath : path
			}
			$('#PersonalImg').modal('show');
		} else
			Swal.fire('No Image Found');

	};

	$scope.FilterActiveDeActive = function (val) {
		$scope.AttendanceColl = $filter('filter')($scope.AllAttendanceColl, { IsActive: val });
	}

	$scope.openMapModal = function (lat, lng,For) {
		if (!lat || !lng) {
			Swal.fire('Coordinates not available!');
			return;
		}
		$scope.LocationFor = For;
		var url = `https://maps.google.com/maps?q=${lat},${lng}&hl=es;z=14&output=embed`;
		document.getElementById('mapFrame').src = url;
		$('#googleMapModal').modal('show');
	};

	var map;
	$scope.GetGPSLog = function (beData) {
		$scope.loadingstatus = 'running';
		showPleaseWait();

		var para = {
			forUserId: beData.UserId,
			dateFrom: $filter('date')(new Date($scope.newDailyAttendance.ForDateDet.dateAD), 'yyyy-MM-dd') + ' 00:00',
			dateTo: $filter('date')(new Date($scope.newDailyAttendance.ForDateDet.dateAD), 'yyyy-MM-dd') + ' 23:59'
		};
		$http({
			method: 'POST',
			url: base_url + "Global/GetGPSLog",
			data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";

			if (res.data.IsSuccess && res.data.Data && res.data.Data.length > 0) {
				$scope.GPSLogList = res.data.Data;
				// Open modal
				$('#gpsMapModal').modal('show');
				// Draw map after modal opens
				setTimeout(function () {
					drawLeafletPath($scope.GPSLogList,beData);
				}, 300);
			} else {
				Swal.fire(res.data.ResponseMSG || "No GPS data found");
			}
		}, function (reason) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			Swal.fire('Failed: ' + reason);
		});
	};

	function drawLeafletPath(data, beData) {
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
		const polyline = L.polyline(latlngs, { color: 'red', weight: 4, opacity: 0.7, dashArray:'10, 5' }).addTo(map);
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
            } else if (index > 0 && parseFloat(item.Lat) === parseFloat(beData.Out_Lat) && parseFloat(item.Lng) === parseFloat(beData.Out_Lng)
				&& new Date(item.PushLogDateTime).getTime() === new Date(beData.OutDateTime).getTime())
			{
				icon = endIcon; // End marker only if matches Out data
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