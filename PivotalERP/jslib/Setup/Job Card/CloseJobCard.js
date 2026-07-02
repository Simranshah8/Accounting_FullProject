app.controller('CloseJobCard', function ($scope, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'Parts DemandList';


	$scope.LoadData = function () {
		$('.select2').select2();
		$scope.confirmMSG = GlobalServices.getConfirmMSG();

		$scope.beData =
		{
			TransId: 0,
			JobNo: '',
			Mechanic: '',
			AssignDate: '',
			AssignTime: '',
			EngineNo: '',
			ChassisNo: '',
			RegdNo: '',
			Party: '',
			Remarks: '',
			Notes:'',
			Mode: 'Save'
		}
		$scope.beData.PartsDemandColl.push({});
	}

	$scope.ClearDemandList = function () {
		$scope.beData =
		{
			TransId: 0,
			JobNo: '',
			Mechanic: '',
			AssignDate: '',
			AssignTime: '',
			EngineNo: '',
			ChassisNo: '',
			RegdNo: '',
			Party: '',
			Remarks: '',
			Notes: '',
			Mode: 'Save'
		};
		$scope.beData.PartsDemandColl.push({});
	}

	$scope.AddCloseJobCardDet = function (ind) {
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

	$scope.delCloseJobCardDet = function (ind) {
		if ($scope.beData.PartsDemandColl) {
			if ($scope.beData.PartsDemandColl.length > 1) {
				$scope.beData.PartsDemandColl.splice(ind, 1);
			}
		}
	};


	$scope.IsValidCloseJobCard = function () {
		if ($scope.beData.JobNo.isEmpty()) {
			Swal.fire("Please ! Enter Job No");
			return false;
		}
		else
			return true;
	}

	$scope.SaveUpdateCloseJobCard = function () {
		if ($scope.IsValidCloseJobCard() == true) {
			if ($scope.confirmMSG.Accept == true) {
				var saveModify = $scope.beData.Mode;
				Swal.fire({
					title: 'Do you want to ' + saveModify + ' the current data?',
					showCancelButton: true,
					confirmButtonText: saveModify,
				}).then((result) => {
					/* Read more about isConfirmed, isDenied below */
					if (result.isConfirmed) {
						$scope.CallSaveUpdateCloseJobCard();
					}
				});
			} else
				$scope.CallSaveUpdateCloseJobCard();
		}
	};

	$scope.CallSaveUpdateCloseJobCard = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		$http({
			method: 'POST',
			url: base_url + "Setup/JobCard/SaveCloseJobCard",
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
				$scope.ClearCloseJobCard();
				/* $scope.GetAllCloseJobCard();*/
			}
		}, function (errormessage) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
		});
	}

});