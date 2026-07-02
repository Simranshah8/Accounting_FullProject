app.controller('VehicleEntry', function ($scope, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'Vehicle Entry';


	$scope.LoadData = function () {
		$('.select2').select2();
		$scope.confirmMSG = GlobalServices.getConfirmMSG();

		$scope.beData =
		{
			TranId: 0,
			EntryNo: '',
			VinNo: '',
			DateOfSale: new Date(),
			VechicleTypeId: null,
			VechicleColorId: null,
			VechicleModelId: null,
			RegdNo: '',
			EngineNo: '',
			ChSrlNo: '',
			CodeNo: '',
			KeyNo: '',
			MFGYear: '',
			Transporter: '',
			ShipmentNo: '',
			DeliveryNo: '',
			LRNo: '',
			LRDate: new Date(),
			LRDriver: '',
			LRDriverLicNo: '',
			ReceivedByName: '',
			LastRunningKM: '',
			LastRunningHR: '',
			Remarks: '',
			VechicleEntryColl: [],
		};

		$scope.AddVehicleEntryDet = function (ind) {
			if ($scope.beData.VechicleEntryColl) {
				if ($scope.beData.VechicleEntryColl.length > ind + 1) {
					$scope.beData.VechicleEntryColl.splice(ind + 1, 0, {
						FieldName: ''
					})
				} else {
					$scope.beData.VechicleEntryColl.push({
						FieldName: ''
					})
				}
			}
		};

		$scope.delVehicleEntryDet = function (ind) {
			if ($scope.beData.VechicleEntryColl) {
				if ($scope.beData.VechicleEntryColl.length > 1) {
					$scope.beData.VechicleEntryColl.splice(ind, 1);
				}
			}
		};

		$scope.beData.VechicleEntryColl.push({});
	}

	$scope.ClearVehicleEntry = function () {
		$scope.beData =
		{
			TranId: 0,
			EntryNo: '',
			VinNo: '',
			DateOfSale: new Date(),
			VechicleTypeId: null,
			VechicleColorId: null,
			VechicleModelId: null,
			RegdNo: '',
			EngineNo: '',
			ChSrlNo: '',
			CodeNo: '',
			KeyNo: '',
			MFGYear: '',
			Transporter: '',
			ShipmentNo: '',
			DeliveryNo: '',
			LRNo: '',
			LRDate: new Date(),
			LRDriver: '',
			LRDriverLicNo: '',
			ReceivedByName: '',
			LastRunningKM: '',
			LastRunningHR: '',
			Remarks: '',
			VechicleEntryColl: [],
		};
		$scope.beData.VechicleEntryColl.push({});
	}


	/*----------------------CRUD star-----------------*/
	$scope.IsValidVehicleEntry = function () {
		if ($scope.beData.VinNo.isEmpty()) {
			Swal.fire('Please ! Enter VinNo');
			return false;
		}
		return true;
	}

	$scope.AddVehicleEntry = function () {
		if ($scope.IsValidVehicleEntry() == true) {
			if ($scope.confirmMSG.Accept == true) {
				var saveModify = $scope.beData.Mode;
				Swal.fire({
					title: 'Do you want to ' + saveModify + ' the current data?',
					showCancelButton: true,
					confirmButtonText: saveModify,
				}).then((result) => {
					if (result.isConfirmed) {
						$scope.CallSaveUpdateVehicleEntry();
					}
				});
			} else
				$scope.CallSaveUpdateVehicleEntry();
		}
	};

	$scope.CallSaveUpdateVehicleEntry = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		$http({
			method: 'POST',
			url: base_url + "Setup/JobCard/SaveVechicleEntry",
			headers: { 'Content-Type': undefined },
			transformRequest: function (data) {
				var formData = new FormData();
				formData.append("jsonData", angular.toJson(data.jsonData));
				return formData;
			},
			data: { jsonData: $scope.beData }
		}).then(function (res) {
			$scope.loadingstatus = "stop";
			hidePleaseWait();
			Swal.fire(res.data.ResponseMSG);
			if (res.data.IsSuccess == true) {
				$scope.ClearVehicleEntry();
			}
		}, function (errormessage) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
		});
	}
});