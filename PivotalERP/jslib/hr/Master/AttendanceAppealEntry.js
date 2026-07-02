app.controller('AttendanceAppealEntryController', function ($scope, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'AttendanceAppealEntry Entry';

	$scope.LoadData = function () {
		$('.select2').select2();
		$scope.confirmMSG = GlobalServices.getConfirmMSG();
		$scope.perPageColl = GlobalServices.getPerPageList();
		//$scope.LanguageColl = GlobalServices.getLangList();
		$scope.EmployeeSearchOptions = GlobalServices.getEmployeeSearchOptions();
		

		$scope.currentPages = {
			AttendanceAppealEntry: 1,
		};
		$scope.searchData = {
			AttendanceAppealEntry: '',
		};
		$scope.perPage = {
			AttendanceAppealEntry: GlobalServices.getPerPageRow(),
		};


		$scope.AttendanceModeList = [];
		$http({
			method: 'GET',
			url: base_url + "HR/Master/GetAllAttendanceMode",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.AttendanceModeList = res.data.Data;
			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

		$scope.newFilter = {
			FromDate_TMP: new Date(),
			ToDate_TMP: new Date()
		};

		$scope.newAttendanceAppealEntry = {
			TranId: null,
			EmployeeId: null,
			PunchDateTime_TMP: new Date(),
			PunchDateTime_TMPs: (new Date(), 'HH:mm'),
			Reason: '',
			SelectEmployee: $scope.EmployeeSearchOptions[0].value,
			Mode: 'Save'
		};

	};


	$scope.ClearAttendanceAppealEntry = function () {
		$timeout(function () {
			$scope.newAttendanceAppealEntry = {
				TranId: null,
				EmployeeId: null,
				PunchDateTime_TMP: new Date(),
				PunchDateTime_TMPs: (new Date(), 'HH:mm'),
				Reason: '',
				SelectEmployee: $scope.EmployeeSearchOptions[0].value,
				Mode: 'Save'
			};
		});
	};

	$scope.IsValidAttendanceAppealEntry = function () {
		//if ($scope.newAttendanceAppealEntry.Remarks.isEmpty()) {
		//	Swal.fire('Please ! Enter Reason');
		//	return false;
		//}
		return true;
	};

	$scope.SaveUpdateAttendanceAppealEntry = function () {
		if ($scope.IsValidAttendanceAppealEntry() == true) {
			if ($scope.confirmMSG.Accept == true) {
				var saveModify = $scope.newAttendanceAppealEntry.Mode;
				Swal.fire({
					title: 'Do you want to ' + saveModify + ' the current data?',
					showCancelButton: true,
					confirmButtonText: saveModify,
				}).then((result) => {
					/* Read more about isConfirmed, isDenied below */
					if (result.isConfirmed) {
						$scope.CallSaveUpdateAttendanceAppealEntry();
					}
				});
			} else
				$scope.CallSaveUpdateAttendanceAppealEntry();
		}
	};

	$scope.CallSaveUpdateAttendanceAppealEntry = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();

		if ($scope.newAttendanceAppealEntry.PunchDateTimeDet && $scope.newAttendanceAppealEntry.PunchDateTime_TMPs) {
			// Extract date from PunchDateTimeDet
			const datePart = new Date($scope.newAttendanceAppealEntry.PunchDateTimeDet.dateAD);

			// Extract time from PunchDateTime_TMPs
			const timePart = new Date($scope.newAttendanceAppealEntry.PunchDateTime_TMPs);

			// Combine date and time into a single Date object
			const combinedDateTime = new Date(
				datePart.getFullYear(),
				datePart.getMonth(),
				datePart.getDate(),
				timePart.getHours(),
				timePart.getMinutes(),
				timePart.getSeconds()
			);

			// Format the combined date and time
			$scope.newAttendanceAppealEntry.PunchDateTime = $filter('date')(combinedDateTime, 'yyyy-MM-dd HH:mm:ss');
		} else {
			$scope.newAttendanceAppealEntry.PunchDateTime = null;
		}


		$http({
			method: 'POST',
			url: base_url + "HR/Master/SaveUpdateAttendanceAppeal",
			headers: { 'Content-Type': undefined },
			transformRequest: function (data) {
				var formData = new FormData();
				formData.append("jsonData", angular.toJson(data.jsonData));
				return formData;
			},
			data: { jsonData: $scope.newAttendanceAppealEntry}
		}).then(function (res) {
			$scope.loadingstatus = "stop";
			hidePleaseWait();
			Swal.fire(res.data.ResponseMSG);
			if (res.data.IsSuccess == true) {
				$scope.ClearAttendanceAppealEntry();
				//$scope.GetAllAttendanceAppealEntryList();
			}
		}, function (errormessage) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
		});
	}

	$scope.GetAllAttendanceAppealEntryList = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		$scope.AttendanceAppealEntryList = [];
		var para = {
			dateFrom: ($scope.newFilter.FromDateDet ? $filter('date')(new Date($scope.newFilter.FromDateDet.dateAD), 'yyyy-MM-dd') : null),
			dateTo: ($scope.newFilter.ToDateDet ? $filter('date')(new Date($scope.newFilter.ToDateDet.dateAD), 'yyyy-MM-dd') : null),
		};
		$http({
			method: 'POST',
			url: base_url + "HR/Leave/GetAllLeaveRequest",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.AttendanceAppealEntryList = res.data.Data;
			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	};

	$scope.GetAttendanceAppealEntryById = function (refData) {
		$scope.loadingstatus = "running";
		showPleaseWait();
		var para = {
			LeaveRequestId: refData.LeaveRequestId
		};
		$http({
			method: 'POST',
			url: base_url + "HR/Leave/getAttendanceAppealEntryById",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.newAttendanceAppealEntry = res.data.Data;

				if ($scope.newAttendanceAppealEntry.DateFrom)
					$scope.newAttendanceAppealEntry.DateFrom_TMP = new Date($scope.newAttendanceAppealEntry.DateFrom);

				if ($scope.newAttendanceAppealEntry.DateTo)
					$scope.newAttendanceAppealEntry.DateTo_TMP = new Date($scope.newAttendanceAppealEntry.DateTo);

				$scope.newAttendanceAppealEntry.Mode = 'Modify';
				$scope.open_form_btn();
			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	};

	$scope.DelLeaveRequestById = function (refData, ind) {
		Swal.fire({
			title: 'Are you sure you want to delete ' + refData.Name + '?',
			showCancelButton: true,
			confirmButtonText: 'Delete',
		}).then((result) => {
			if (result.isConfirmed) {
				var para = { LeaveRequestId: refData.LeaveRequestId };
				$http({
					method: 'POST',
					url: base_url + "HR/Leave/DeleteLeaveRequest",
					dataType: "json",
					data: JSON.stringify(para)
				}).then(function (res) {
					hidePleaseWait();
					$scope.loadingStatus = "stop";
					if (res.data.IsSuccess) {
						$scope.GetAllAttendanceAppealEntryList();
					}
					Swal.fire(res.data.ResponseMSG);

				}, function (reason) {
					Swal.fire('Failed' + reason);
				});
			}
		});
	}
});