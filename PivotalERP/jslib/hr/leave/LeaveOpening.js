app.controller('LeaveOpeningController', function ($scope, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'Leave Opening';
	LoadData();

	function LoadData() {
		$('.select2').select2();
		$scope.confirmMSG = GlobalServices.getConfirmMSG();
		$scope.perPageColl = GlobalServices.getPerPageList();
		//$scope.MonthList = GlobalServices.getMonthList();
		 $scope.EmployeeSearchOptions = GlobalServices.getEmployeeSearchOptions();

		$scope.currentPages = {
			LeaveOpening: 1,
		};

		$scope.searchData = {
			LeaveOpening: '',
		};

		$scope.perPage = {
			LeaveOpening: GlobalServices.getPerPageRow(),
		};
		$scope.TypeColl = [{ id: 1, text: 'Employee' }, { id: 2, text: 'Salesman' }]

		$scope.newLeaveOpening = {
			LeaveOpeningId: null,
			EmployeeOrSalesman: 1,
			Name: '',
			Code: '',
			ApplicableForId: '',
			SNo: '',
			PeriodId: null,
			IncludeWeeklyOff: false,
			IncludeHoliday: false,
			PaidLeave: false,
			CarriedForward: false,
			Remarks: '',
			SelectEmployee: $scope.EmployeeSearchOptions[0].value,
			Mode: 'Save'
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

		$scope.EmployeeList = [];
		$http({
			method: 'GET',
			url: base_url + "HR/Master/GetAllEmployee",
			dataType: "json"
		}).then(function (res) {
			if (res.data.IsSuccess && res.data.Data) {
				$scope.EmployeeList = res.data.Data;

			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

		$scope.CostClassList = [];
		$http({
			method: 'GET',
			url: base_url + "Account/Creation/GetAllCostClasss",
			dataType: "json"
		}).then(function (res) {
			if (res.data.IsSuccess && res.data.Data) {
				$scope.CostClassList = res.data.Data;
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

		//scope.GetAllLeaveOpeningList();

	}


	$scope.ClearLeaveOpening = function () {
		$scope.newLeaveOpening = {
			EmployeeOrSalesman: 1,
			Name: '',
			Code: '',
			ApplicableForId: '',
			SNo: '',
			PeriodId: null,
			IncludeWeeklyOff: false,
			IncludeHoliday: false,
			PaidLeave: false,
			CarriedForward: false,
			Remarks: '',
			SelectEmployee: $scope.EmployeeSearchOptions[0].value,
			Mode: 'Save'
		};
	}
	//************************* LeaveOpening *********************************
	$scope.IsValidLeaveOpening = function () {
		if (!$scope.newLeaveOpening.UserId || $scope.newLeaveOpening.UserId < 0) {
			Swal.fire('Please ! Select Employee');
			return false;
		}
		return true;
	}

	$scope.SaveUpdateLeaveOpening = function () {
		if ($scope.IsValidLeaveOpening() == true) {
			if ($scope.confirmMSG.Accept == true) {
				var saveModify = $scope.newLeaveOpening.Mode;
				Swal.fire({
					title: 'Do you want to ' + saveModify + ' the current data?',
					showCancelButton: true,
					confirmButtonText: saveModify,
				}).then((result) => {
					/* Read more about isConfirmed, isDenied below */
					if (result.isConfirmed) {
						$scope.CallSaveUpdateLeaveOpening();
					}
				});
			} else
				$scope.CallSaveUpdateLeaveOpening();
		}
	};

	$scope.CallSaveUpdateLeaveOpening = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();

		var findP = mx($scope.CostClassList).firstOrDefault(p1 => p1.CostClassId == $scope.newLeaveOpening.PeriodId);
		if (findP) {
			$scope.newLeaveOpening.DateFrom = $filter('date')(new Date(findP.StartDate), 'yyyy-MM-dd');
			$scope.newLeaveOpening.DateTo = $filter('date')(new Date(findP.EndDate), 'yyyy-MM-dd');
		}
		$scope.newLeaveOpening.UserId = $scope.newLeaveOpening.EmployeeOrSalesman == 1 ? $scope.newLeaveOpening.EmployeeDetails.UserId : $scope.newLeaveOpening.UserId;

		$http({
			method: 'POST',
			url: base_url + "HR/Leave/SaveLeaveOpening",
			headers: { 'Content-Type': undefined },
			transformRequest: function (data) {
				var formData = new FormData();
				formData.append("jsonData", angular.toJson(data.jsonData));
				return formData;
			},
			data: { jsonData: $scope.newLeaveOpening }
		}).then(function (res) {
			$scope.loadingstatus = "stop";
			hidePleaseWait();
			Swal.fire(res.data.ResponseMSG);
			if (res.data.IsSuccess == true) {
				$scope.ClearLeaveOpening();
				$scope.GetAllLeaveOpeningList();
			}
		}, function (errormessage) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
		});
	}

	$scope.GetAllLeaveOpeningList = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		$scope.LeaveOpeningList = [];
		$http({
			method: 'POST',
			url: base_url + "HR/Leave/GetAllLeaveOpeningList",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.LeaveOpeningList = res.data.Data;
			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	}

	$scope.GetLeaveOpeningById = function () {
		if ($scope.newLeaveOpening.UserId > 0 && $scope.newLeaveOpening.PeriodId > 0) {
			$scope.loadingstatus = "running";
			showPleaseWait();
			var para = {
				UsersId: $scope.newLeaveOpening.EmployeeOrSalesman == 1
					? $scope.newLeaveOpening.EmployeeDetails.UserId
					: $scope.newLeaveOpening.UserId,
				PeriodId: $scope.newLeaveOpening.PeriodId
			};
			$http({
				method: 'POST',
				url: base_url + "HR/Leave/GetLeaveOpeningById",
				dataType: "json",
				data: JSON.stringify(para)
			}).then(function (res) {
				hidePleaseWait();
				$scope.loadingstatus = "stop";
				if (res.data.IsSuccess && res.data.Data) {
					$scope.newLeaveOpening.IsBalance = res.data.Data.IsBalance;
					$scope.newLeaveOpening.LeaveQuotaDetail = res.data.Data.LeaveQuotaDetail;
				} else {
					Swal.fire(res.data.ResponseMSG);
				}
			}, function (reason) {
				Swal.fire('Failed' + reason);
			});
		}

	};

	$scope.DelLeaveOpeningById = function (refData) {
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
					TranId: refData.TranId
				};
				$http({
					method: 'POST',
					url: base_url + "HR/Leave/DelLeaveOpening",
					dataType: "json",
					data: JSON.stringify(para)
				}).then(function (res) {
					hidePleaseWait();
					$scope.loadingstatus = "stop";
					if (res.data.IsSuccess) {
						$scope.GetAllLeaveOpeningList();
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