app.controller('AttendanceRuleController', function ($scope, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'Attendance Rule';
	LoadData();
	function LoadData() {
        $('.select2').select2();
		$scope.confirmMSG = GlobalServices.getConfirmMSG();
		$scope.perPageColl = GlobalServices.getPerPageList();
		//$scope.MonthList = GlobalServices.getMonthList();
		$scope.currentPages = {
			AttendanceRule: 1,
		};

		$scope.searchData = {
			AttendanceRule: '',
		};

		$scope.perPage = {
			AttendanceRule: GlobalServices.getPerPageRow(),
		};

		$scope.ArrivalCutColl = [
			{ id: 1, text: 'None' },
			{ id: 2, text: 'Cut Half Day' },
			{ id: 3, text: 'Cut Full Day' }

		]
		$scope.newAttendanceRule = {
			TranId: null,
			PermittedLateArrival: null,
			PermittedEarlyDeparture: null,
			HalfDayLessThanHr: null,
			AbsentiLessThanHr: null,
			LateArrival: null,
			LateArrivalCut: null,
			EarlyDeparture: null,
			EarlyDepartureCut: null,
			LateIncoming: false,
			NoOfLateInAMonth: null,
			CutDays: null,
			IgnoreOTDLessthan: null,
			Mode: 'Save'
		};
		//$scope.GetAttendanceRuleById();
		//$scope.GetAllAttendanceRuleList();
	}

	$scope.ClearAttendanceRule = function () {
		$scope.newAttendanceRule = {
			TranId: null,
			PermittedLateArrival: null,
			PermittedEarlyDeparture: null,
			HalfDayLessThanHr: null,
			AbsentiLessThanHr: null,
			LateArrival: null,
			LateArrivalCut: null,
			EarlyDeparture: null,
			EarlyDepartureCut: null,
			LateIncoming: false,
			NoOfLateInAMonth: null,
			CutDays: null,
			IgnoreOTDLessthan: null,
			Mode: 'Save'
		};
	}
	//************************* AttendanceRule *********************************
	$scope.IsValidAttendanceRule = function () {
		//if ($scope.newAttendanceRule.PermittedLateArrival.isEmpty()) {
		//	Swal.fire('Please ! Enter Permitted Late Arrival');
		//	return false;
		//}
		return true;
	}

	$scope.SaveUpdateAttendanceRule = function () {
		if ($scope.IsValidAttendanceRule() == true) {
			if ($scope.confirmMSG.Accept == true) {
				var saveModify = $scope.newAttendanceRule.Mode;
				Swal.fire({
					title: 'Do you want to ' + saveModify + ' the current data?',
					showCancelButton: true,
					confirmButtonText: saveModify,
				}).then((result) => {
					/* Read more about isConfirmed, isDenied below */
					if (result.isConfirmed) {
						$scope.CallSaveUpdateAttendanceRule();
					}
				});
			} else
				$scope.CallSaveUpdateAttendanceRule();
		}
	};

	$scope.CallSaveUpdateAttendanceRule = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		$http({
			method: 'POST',
			url: base_url + "HR/Master/SaveAttendanceRule",
			headers: { 'Content-Type': undefined },
			transformRequest: function (data) {
				var formData = new FormData();
				formData.append("jsonData", angular.toJson(data.jsonData));
				return formData;
			},
			data: { jsonData: $scope.newAttendanceRule }
		}).then(function (res) {
			$scope.loadingstatus = "stop";
			hidePleaseWait();

			Swal.fire(res.data.ResponseMSG);
			if (res.data.IsSuccess == true) {
				//$scope.ClearAttendanceRule();
				$scope.GetAttendanceRuleById();
			}

		}, function (reason) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			Swal.fire('Failed' + reason);
		});
	}



	$scope.GetAttendanceRuleById = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		$scope.newAttendanceRule = {};
		$http({
			method: 'POST',
			url: base_url + "HR/Master/GetAttendanceRuleById",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.newAttendanceRule = res.data.Data;
				$scope.newAttendanceRule.Mode = 'Modify';
			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	};

	$scope.GetAllAttendanceRuleList = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		$scope.AttendanceRuleList = [];
		$http({
			method: 'POST',
			url: base_url + "HR/Master/GetAllAttendanRule",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.newAttendanceRule = res.data.Data;

			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	}

	$scope.DelAttendanceRuleById = function (refData) {
		Swal.fire({
			title: 'Do you want to delete the selected data?',
			showCancelButton: true,
			confirmButtonText: 'Delete',
		}).then((result) => {
			/* Read more about isConfirmed, isDenied below */
			if (result.isConfirmed) {
				$scope.loadingstatus = "running";
				showPleaseWait();

				var para = {
					AttendanceRuleId: refData.AttendanceRuleId
				};

				$http({
					method: 'POST',
					url: base_url + "HR/Master/DeleteAttendanceRuleById",
					dataType: "json",
					data: JSON.stringify(para)
				}).then(function (res) {
					hidePleaseWait();
					$scope.loadingstatus = "stop";
					if (res.data.IsSuccess) {
						$scope.GetAllAttendanceRuleList();
					} else {
						Swal.fire(res.data.ResponseMSG);
					}

				}, function (reason) {
					Swal.fire('Failed' + reason);
				});
			}
		});
	};

	$scope.pageChangeHandler = function (num) {
		console.log('page changed to ' + num);
	};
});