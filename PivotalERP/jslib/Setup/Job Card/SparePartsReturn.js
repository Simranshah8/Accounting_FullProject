app.controller('SparePartsReturn', function ($scope, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'SpareParts Return';


	$scope.LoadData = function () {
		$('.select2').select2();
		$scope.confirmMSG = GlobalServices.getConfirmMSG();

		$scope.beData =
		{
			TransId: 0,
			EngineId: null,
			JobNo: '',
			EntryDate: new Date(),
			EngineNo: '',
			ChassisNo: '',
			RegdNo: '',
			Party: '',
			SparePartsColl: [],
			Mode: 'Save'
		}


		$scope.AddSparePartsReturnDet = function (ind) {
			if ($scope.beData.SparePartsColl) {
				if ($scope.beData.SparePartsColl.length > ind + 1) {
					$scope.beData.SparePartsColl.splice(ind + 1, 0, {
						DemandRate: ''
					})
				} else {
					$scope.beData.SparePartsColl.push({
						DemandRate: ''
					})
				}
			}
		};

		$scope.delSparePartsReturnDet = function (ind) {
			if ($scope.beData.SparePartsColl) {
				if ($scope.beData.SparePartsColl.length > 1) {
					$scope.beData.SparePartsColl.splice(ind, 1);
				}
			}
		};

		$scope.beData.SparePartsColl.push({});
	}

	$scope.ClearSpareParts = function () {
		$scope.beData =
		{
			TransId: 0,
			EngineId: null,
			JobNo: '',
			EntryDate: new Date(),
			EngineNo: '',
			ChassisNo: '',
			RegdNo: '',
			Party: '',
			SparePartsColl: [],
			Mode: 'Save'
		}
		$scope.beData.SparePartsColl.push({});
	}


	$scope.IsValidSparePartsReturn = function () {
		if ($scope.beData.JobNo.isEmpty()) {
			Swal.fire("Please ! Enter JobNo");
			return false;
		}
		else
			return true;
	}


	$scope.SaveUpdateSparePartsReturn = function () {
		if ($scope.IsValidSparePartsReturn() == true) {
			if ($scope.confirmMSG.Accept == true) {
				var saveModify = $scope.beData.Mode;
				Swal.fire({
					title: 'Do you want to ' + saveModify + ' the current data?',
					showCancelButton: true,
					confirmButtonText: saveModify,
				}).then((result) => {
					/* Read more about isConfirmed, isDenied below */
					if (result.isConfirmed) {
						$scope.CallSaveUpdateSparePartsReturn();
					}
				});
			} else
				$scope.CallSaveUpdateSparePartsReturn();
		}
	};

	$scope.CallSaveUpdateSparePartsReturn = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		$http({
			method: 'POST',
			url: base_url + "Setup/JobCard/SaveSparePartsReturn",
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
				$scope.ClearSparePartsReturn();
				/* $scope.GetAllSparePartsReturn();*/
			}
		}, function (errormessage) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
		});
	}
});