

app.controller('HolidayController', function ($scope, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'Holiday';
	var gSrv = GlobalServices;

	$scope.LoadData = function () {
		$scope.confirmMSG = gSrv.getConfirmMSG();
		$scope.perPageColl = gSrv.getPerPageList();
		//$scope.MonthList = GlobalServices.getMonthList();

		$scope.currentPages = {
			Holiday: 1,
		};

		$scope.searchData = {
			Holiday: '',
		};

		$scope.perPage = {
			Holiday: gSrv.getPerPageRow(),
		};


		$scope.GenderList = [
			{ id: 1, text: 'Male' },
			{ id: 2, text: 'Female' },
			{ id: 3, text: 'Others' }
		];


		$scope.CompanyList = [];
		$http({
			method: 'GET',
			url: base_url + "HR/Master/GetAllCompanyList",
			dataType: "json"
		}).then(function (res) {
			if (res.data.IsSuccess && res.data.Data) {
				$scope.CompanyList = res.data.Data;
				if ($scope.CompanyList.length > 0) {
					$scope.newHoliday.CompanyId = [$scope.CompanyList[0].CompanyId];
				}
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

		$scope.BranchList = [];
		$http({
			method: 'GET',
			url: base_url + "Setup/Security/GetAllBranchList",
			dataType: "json"
		}).then(function (res) {
			if (res.data.IsSuccess && res.data.Data) {
				$scope.BranchList = res.data.Data;

				//if ($scope.BranchList.length > 0)
				//	$scope.BranchList.insert(0, { BranchId: 0, Name: 'All' });
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

		//for department
		$scope.DepartmentList = [];
		$http({
			method: 'GET',
			url: base_url + "HR/Master/GetAllDepartment",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.DepartmentList = res.data.Data;
				//if ($scope.DepartmentList.length > 0)
				//	$scope.DepartmentList.insert(0, { CostCenterDepartmentId: 0, Name: 'All' });
			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

		//designation
		$scope.DesignationList = [];
		$http({
			method: 'GET',
			url: base_url + "HR/Master/GetAllDesignation",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.DesignationList = res.data.Data;

				//if ($scope.DesignationList.length > 0)
				//	$scope.DesignationList.insert(0, { DesignationId: 0, Name: 'All' });
			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

		//ServiceType

		$scope.ServiceTypeList = [];
		$http({
			method: 'GET',
			url: base_url + "HR/Master/GetAllServiceType",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.ServiceTypeList = res.data.Data;
				//if ($scope.ServiceTypeList.length > 0)
				//	$scope.ServiceTypeList.insert(0, { ServiceTypeId: 0, Name: 'All' });
			} else {
				Swal.fire(res.data.ResponseMSG);
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

        $scope.newHoliday = {
            HolidayId: '',
            Name: '',
            Code: '',
			DateFrom_TMP: '',
			DateTo_TMP: '',
			CompanyId:[0],
			Mode: 'Save'
		}
		$scope.GetAllHolidayList();

    }

	$scope.ClearHoliday = function () {
		$scope.newHoliday = {
			HolidayId: '',
			Name: '',
			Code: '',
			DateFrom_TMP:'',
			DateTo_TMP: '',
			CompanyId:[0],
			Mode:'Save'
		};
	}

	$scope.calculateTotalDays = function () {
		if ($scope.newHoliday.DateFromDet && $scope.newHoliday.DateToDet) {
			const dateFrom = new Date($scope.newHoliday.DateFromDet.dateAD);
			const dateTo = new Date($scope.newHoliday.DateToDet.dateAD);

			if (dateFrom <= dateTo) {
				const timeDiff = dateTo - dateFrom;
				$scope.newHoliday.TotalDays = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); // Convert ms to days
			} else {
				$scope.newHoliday.TotalDays = 0;
			}
		} else {
			$scope.newHoliday.TotalDays = 0;
		}
	};


	//************************* Holiday *********************************
	$scope.IsValidHoliday = function () {
		//if ($scope.newHoliday.Name.isEmpty()) {
		//	Swal.fire('Please ! Enter Name');
		//	return false;
		//}
		return true;
	}

	$scope.SaveUpdateHoliday = function () {
		if ($scope.IsValidHoliday() == true) {
			if ($scope.confirmMSG.Accept == true) {
				var saveModify = $scope.newHoliday.Mode;
				Swal.fire({
					title: 'Do you want to ' + saveModify + ' the current data?',
					showCancelButton: true,
					confirmButtonText: saveModify,
				}).then((result) => {
					/* Read more about isConfirmed, isDenied below */
					if (result.isConfirmed) {
						$scope.CallSaveUpdateHoliday();
					}
				});
			} else
				$scope.CallSaveUpdateHoliday();
		}
	};

	$scope.CallSaveUpdateHoliday = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();


		if ($scope.newHoliday.DateFromDet) {
			$scope.newHoliday.DateFrom = $filter('date')(new Date($scope.newHoliday.DateFromDet.dateAD), 'yyyy-MM-dd');
		} else
			$scope.newHoliday.DateFrom = null;

		if ($scope.newHoliday.DateToDet) {
			$scope.newHoliday.DateTo = $filter('date')(new Date($scope.newHoliday.DateToDet.dateAD), 'yyyy-MM-dd');
		} else

			$scope.newHoliday.DateFrom = null;
		$http({
			method: 'POST',
			url: base_url + "HR/Master/SaveHoliday",
			headers: { 'Content-Type': undefined },
			transformRequest: function (data) {
				var formData = new FormData();
				formData.append("jsonData", angular.toJson(data.jsonData));
				return formData;
			},
			data: { jsonData: $scope.newHoliday }
		}).then(function (res) {
			$scope.loadingstatus = "stop";
			hidePleaseWait();
			Swal.fire(res.data.ResponseMSG);
			if (res.data.IsSuccess == true) {
				$scope.ClearHoliday();
				$scope.GetAllHolidayList();
			}
		}, function (errormessage) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
		});
	}

	$scope.GetAllHolidayList = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		$scope.HolidayList = [];
		$http({
			method: 'POST',
			url: base_url + "HR/Master/GetAllHolidayList",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.HolidayList = res.data.Data;
			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	}

	$scope.GetHolidayById = function (refData) {
		$scope.loadingstatus = "running";
		showPleaseWait();
		var para = {
			HolidayId: refData.HolidayId
		};
		$http({
			method: 'POST',
			url: base_url + "HR/Master/GetHolidayById",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.newHoliday = res.data.Data;


				$scope.newHoliday.Mode = 'Modify';
				$('#custom-tabs-four-profile-tab').tab('show');

				if ($scope.newHoliday.DateFrom)
					$scope.newHoliday.DateFrom_TMP = new Date($scope.newHoliday.DateFrom);

				if ($scope.newHoliday.DateTo)
					$scope.newHoliday.DateTo_TMP = new Date($scope.newHoliday.DateTo);
				$scope.calculateTotalDays();
			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	};

	$scope.DelHolidayById = function (refData) {
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
					HolidayId: refData.HolidayId
				};
				$http({
					method: 'POST',
					url: base_url + "HR/Master/DelHoliday",
					dataType: "json",
					data: JSON.stringify(para)
				}).then(function (res) {
					hidePleaseWait();
					$scope.loadingstatus = "stop";
					if (res.data.IsSuccess) {
						$scope.GetAllHolidayList();
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