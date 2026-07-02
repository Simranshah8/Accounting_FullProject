app.controller('LeaveQuotaByEmpController', function ($scope, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'Leave Quota';
	LoadData();

	function LoadData() {
		$('.select2').select2();
		$scope.confirmMSG = GlobalServices.getConfirmMSG();
		$scope.perPageColl = GlobalServices.getPerPageList();
		//$scope.MonthList = GlobalServices.getMonthList();
		$scope.EmployeeSearchOptions = GlobalServices.getEmployeeSearchOptions();

		$scope.currentPages = {
			LeaveQuotaByEmp: 1,
		};

		$scope.searchData = {
			LeaveQuotaByEmp: '',
		};

		$scope.perPage = {
			LeaveQuotaByEmp: GlobalServices.getPerPageRow(),
		};

		$scope.TypeColl = [{ id: 1, text: 'Employee' }, { id: 2, text:'Salesman'}]

		$scope.newLeaveQuotaByEmp = {
			LeaveQuotaByEmpId: null,
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
			//SelectSalesMan: $scope.EmployeeSearchOptions[0].value,
			Mode: 'Save'
		};
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

		//scope.GetAllLeaveQuotaByEmpList();

	}


	$scope.ClearLeaveQuotaByEmp = function () {
		$scope.newLeaveQuotaByEmp = {
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
			//SelectSalesMan: $scope.EmployeeSearchOptions[0].value,
			Mode: 'Save'
		};
	}
	//************************* LeaveQuotaByEmp *********************************
	$scope.IsValidLeaveQuotaByEmp = function () {
		if (!$scope.newLeaveQuotaByEmp.UserId || $scope.newLeaveQuotaByEmp.UserId <= 0) {
			Swal.fire('Please! First Create a UserId');
			return false;
		}
		return true;
	};

	$scope.SaveUpdateLeaveQuotaByEmp = function () {
		if ($scope.IsValidLeaveQuotaByEmp() == true) {
			if ($scope.confirmMSG.Accept == true) {
				var saveModify = $scope.newLeaveQuotaByEmp.Mode;
				Swal.fire({
					title: 'Do you want to ' + saveModify + ' the current data?',
					showCancelButton: true,
					confirmButtonText: saveModify,
				}).then((result) => {
					/* Read more about isConfirmed, isDenied below */
					if (result.isConfirmed) {
						$scope.CallSaveUpdateLeaveQuotaByEmp();
					}
				});
			} else
				$scope.CallSaveUpdateLeaveQuotaByEmp();
		}
	};

	$scope.CallSaveUpdateLeaveQuotaByEmp = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();

		var findP = mx($scope.CostClassList).firstOrDefault(p1 => p1.CostClassId == $scope.newLeaveQuotaByEmp.PeriodId);
		if (findP) {
			$scope.newLeaveQuotaByEmp.DateFrom = $filter('date')(new Date(findP.StartDate), 'yyyy-MM-dd');
			$scope.newLeaveQuotaByEmp.DateTo = $filter('date')(new Date(findP.EndDate), 'yyyy-MM-dd');
		}

		$scope.newLeaveQuotaByEmp.UserId = $scope.newLeaveQuotaByEmp.EmployeeOrSalesman == 1 ? $scope.newLeaveQuotaByEmp.EmployeeDetails.UserId : $scope.newLeaveQuotaByEmp.UserId,

		$http({
			method: 'POST',
			url: base_url + "HR/Leave/SaveLeaveQuotaByEmp",
			headers: { 'Content-Type': undefined },
			transformRequest: function (data) {
				var formData = new FormData();
				formData.append("jsonData", angular.toJson(data.jsonData));
				return formData;
			},
			data: { jsonData: $scope.newLeaveQuotaByEmp }
		}).then(function (res) {
			$scope.loadingstatus = "stop";
			hidePleaseWait();
			Swal.fire(res.data.ResponseMSG);
			if (res.data.IsSuccess == true) {
				$scope.ClearLeaveQuotaByEmp();
				$scope.GetAllLeaveQuotaByEmpList();
			}
		}, function (errormessage) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
		});
	}

	$scope.GetAllLeaveQuotaByEmpList = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		$scope.LeaveQuotaByEmpList = [];
		$http({
			method: 'POST',
			url: base_url + "HR/Leave/getAllLeaveQuotaByEmp",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.LeaveQuotaByEmpList = res.data.Data;
			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	}

	$scope.GetLeaveQuotaByEmpById = function () {

		if ($scope.newLeaveQuotaByEmp.UserId > 0 && $scope.newLeaveQuotaByEmp.PeriodId > 0) {
			$scope.loadingstatus = "running";
			showPleaseWait();
			var para = {
				UsersId: $scope.newLeaveQuotaByEmp.EmployeeOrSalesman == 1
					? $scope.newLeaveQuotaByEmp.EmployeeDetails.UserId
					: $scope.newLeaveQuotaByEmp.UserId,
				PeriodId: $scope.newLeaveQuotaByEmp.PeriodId
			};
			$http({
				method: 'POST',
				url: base_url + "HR/Leave/GetLeaveQuotaByEmpById",
				dataType: "json",
				data: JSON.stringify(para)
			}).then(function (res) {
				hidePleaseWait();
				$scope.loadingstatus = "stop";
				if (res.data.IsSuccess && res.data.Data) {
					$scope.newLeaveQuotaByEmp.IsBalance = res.data.Data.IsBalance;
					$scope.newLeaveQuotaByEmp.LeaveQuotaByEmpDetailsColl = res.data.Data.LeaveQuotaByEmpDetailsColl;

				} else {
					Swal.fire(res.data.ResponseMSG);
				}
			}, function (reason) {
				Swal.fire('Failed' + reason);
			});
		}

	};

	$scope.DelLeaveQuotaByEmpById = function (refData) {
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
					url: base_url + "HR/Leave/DelLeaveQuotaByEmp",
					dataType: "json",
					data: JSON.stringify(para)
				}).then(function (res) {
					hidePleaseWait();
					$scope.loadingstatus = "stop";
					if (res.data.IsSuccess) {
						$scope.GetAllLeaveQuotaByEmpList();
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