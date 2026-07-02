app.controller('PartsDemandList', function ($scope, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'Parts DemandList';


	$scope.LoadData = function () {
		$('.select2').select2();
		$scope.confirmMSG = GlobalServices.getConfirmMSG();

		$scope.beData =
		{
			TransId: 0,
			JobNo: '',
			EngineNo: '',
			ChassisNo: '',
			RegdNo: '',
			Party: '',
			PartsDemandColl: [],
			Mode: 'Save'
		}			
		$scope.beData.PartsDemandColl.push({});
	}

	$scope.ClearDemandList = function () {
		$scope.beData =
		{
			TransId: 0,
			JobNo: '',
			EngineNo: '',
			ChassisNo: '',
			RegdNo: '',
			Party: '',
			PartsDemandColl: [],
			Mode: 'Save'
		};
		$scope.beData.PartsDemandColl.push({});
	}

	$scope.AddPartsDemandListDet = function (ind) {
		if ($scope.beData.PartsDemandColl) {
			if ($scope.beData.PartsDemandColl.length > ind + 1) {
				$scope.beData.PartsDemandColl.splice(ind + 1, 0, {
					Remarks: ''
				})
			} else {
				$scope.beData.PartsDemandColl.push({
					Remarks: ''
				})
			}
		}
	};

	$scope.delPartsDemandListDet = function (ind) {
		if ($scope.beData.PartsDemandColl) {
			if ($scope.beData.PartsDemandColl.length > 1) {
				$scope.beData.PartsDemandColl.splice(ind, 1);
			}
		}
	};


	$scope.IsValidPartsDemandList = function () {
		if ($scope.beData.JobNo.isEmpty()) {
			Swal.fire("Please ! Enter Job No");
			return false;
		}
		else
			return true;
	}

	$scope.SaveUpdatePartsDemandList = function () {
		if ($scope.IsValidPartsDemandList() == true) {
			if ($scope.confirmMSG.Accept == true) {
				var saveModify = $scope.beData.Mode;
				Swal.fire({
					title: 'Do you want to ' + saveModify + ' the current data?',
					showCancelButton: true,
					confirmButtonText: saveModify,
				}).then((result) => {
					/* Read more about isConfirmed, isDenied below */
					if (result.isConfirmed) {
						$scope.CallSaveUpdatePartsDemandList();
					}
				});
			} else
				$scope.CallSaveUpdatePartsDemandList();
		}
	};

	$scope.CallSaveUpdatePartsDemandList = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		$http({
			method: 'POST',
			url: base_url + "Setup/JobCard/SavePartsDemandList",
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
				$scope.ClearPartsDemandList();
				/* $scope.GetAllPartsDemandList();*/
			}
		}, function (errormessage) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
		});
	}

});