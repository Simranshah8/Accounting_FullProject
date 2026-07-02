app.controller('JobAssign', function ($scope, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'Job Assign';


	$scope.LoadData = function () {
		$('.select2').select2();
		$scope.confirmMSG = GlobalServices.getConfirmMSG();

		$scope.beData =
		{
			TranId: 0,
			JobNo: '',
			Mechanic: '',
			AssignDate: new Date(),
			AssignTime: '',
			EngineNo: '',
			ChSrlNo: '',
			RegdNo: '',
			Party: '',
			ServiceEngineerId: null,
			ArrivalDate: new Date(),
			ArrivalTime: '',
			Remarks: '',
            Mode: 'Save'
		};

	}

	$scope.ClearjobAssign = function () {
		$scope.beData =
		{
			TranId: 0,
			JobNo: '',
			Mechanic: '',
			AssignDate: new Date(),
			AssignTime: '',
			EngineNo: '',
			ChSrlNo: '',
			RegdNo: '',
			Party: '',
			ServiceEngineerId: null,
			ArrivalDate: new Date(),
			ArrivalTime: '',
			Remarks: '',
			Mode: 'Save'
		};
	}

	/*******************CRUD starts ------------------*/
	$scope.IsValidJobAssign  = function () {
		if ($scope.beData.JobNo.isEmpty()) {
		Swal.fire('Please ! Enter Job No');
			return false;
		}
		return true;
	}

	$scope.AddJobAssign = function () {
		if ($scope.IsValidJobAssign() == true) {
			if ($scope.confirmMSG.Accept == true) {
				var saveModify = $scope.beData.Mode;
				Swal.fire({
					title: 'Do you want to ' + saveModify + ' the current data?',
					showCancelButton: true,
					confirmButtonText: saveModify,
				}).then((result) => {
					if (result.isConfirmed) {
						$scope.CallSaveUpdateJobAssign();
					}
				});
			} else
				$scope.CallSaveUpdateJobAssign();
		}
	};

	$scope.CallSaveUpdateJobAssign = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		$http({
			method: 'POST',
			url: base_url + "Setup/JobCard/SaveJobAssign",
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
				$scope.ClearjobAssign();
			}
		}, function (errormessage) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
		});
	}



});