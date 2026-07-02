app.controller('AttendanceTypeController', function ($scope, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'Attendance Type';

	LoadData();

	function LoadData() {
		$('.select2').select2();
		var gSrv = GlobalServices;
		$scope.confirmMSG = gSrv.getConfirmMSG();
		$scope.perPageColl = gSrv.getPerPageList();
		$scope.TypeList = [{ id: 1, text: 'AttendancePayable' }, { id: 2, text: 'Attendance Without Pay' }, { id: 3, text: 'Attendance Or Leave With Pay' }, { id: 4, text: 'Leave Without Pay' }];
		$scope.PeriodTypeList = [{ id: 1, text: 'Days' }, { id: 2, text: 'Month' }, { id: 3, text: 'Others' }];


		//$scope.RouteList = [{ id: 1, Name: 'AttendancePayable' }, { id: 2, Name: 'Attendance Without Pay' }, { id: 3, Name: 'Attendance Or Leave With Pay' }, { id: 4, Name: 'Leave Without Pay' }, { id: 1, Name: 'AttendancePayable' }, { id: 2, Name: 'Attendance Without Pay' }, { id: 3, Name: 'Attendance Or Leave With Pay' }, { id: 4, Name: 'Leave Without Pay' }];
		//$scope.DistributorColl = [{ id: 1, Name: 'Days' }, { id: 2, Name: 'Month' }, { id: 3, Name: 'Others' }];

		$scope.currentPages = {
			AttendanceType: 1,
		};

		$scope.searchData = {
			AttendanceType: '',
		};

		$scope.perPage = {
			AttendanceType: gSrv.getPerPageRow(),
		};

		//$scope.DepartmentList = [];
		//gSrv.getDepartmentList().then(function (res) {
		//	$scope.DepartmentList = res.data.Data;
		//}, function (reason) {
		//	Swal.fire('Failed' + reason);
		//});


		$scope.DepartmentList = [];
		$http({
			method: 'GET',
			url: base_url + "Payroll/Master/GetAllDepartment",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.DepartmentList = res.data.Data;
			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});


		$scope.BranchList = [];
		$http({
			method: 'GET',
			url: base_url + "Payroll/Transaction/GetBranchListforPayhead",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.BranchList = res.data.Data;

			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

		$scope.CategoryList = [];
		$http({
			method: 'GET',
			url: base_url + "Payroll/Transaction/GetCategoryListforPayhead",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.CategoryList = res.data.Data;

			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});



		$scope.PayHeadingList = [];
		$http({
			method: 'GET',
			url: base_url + "Payroll/Transaction/GetAllPayHeading",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.PayHeadingList = res.data.Data;
			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});


		$scope.UnitOfWorkList = [];
		$http({
			method: 'Get',
			url: base_url + "Payroll/Master/GetAllUnitsOfWork",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.UnitOfWorkList = res.data.Data;
			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});


		$scope.EmployeeGroupList = [];
		$http({
			method: 'Get',
			url: base_url + "Payroll/Master/GetAllEmployeeGroup",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.EmployeeGroupList = res.data.Data;
			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});


		$scope.newAttendanceType = {
			AttendanceTypeId: null,
			Name: '',
			Code: '',
			Types: null,
			SNO: 0,
			CalculationValue: 0,
			PeriodType: null,
			PayHeadingId: null,
			IsActive: false,
			CanEditable: false,
			Description: '',
			AttendanceTypeDetailsColl: [],
			Mode: 'Save'
		};
		$scope.newAttendanceType.AttendanceTypeDetailsColl.push({});
		//$scope.GetAllAttendanceTypeList();
	}


	$scope.ClearAttendanceType = function () {

		$timeout(function () {
			$scope.newAttendanceType = {
				AttendanceTypeId: null,
				Name: '',
				Code: '',
				Types: null,
				SNo: 0,
				CalculationValue: 0,
				PeriodType: null,
				PayHeadingId: null,
				IsActive: false,
				CanEditable: false,
				Description: '',
				AttendanceTypeDetailsColl: [],
				Mode: 'Save'
			};
			$scope.newAttendanceType.AttendanceTypeDetailsColl.push({});
		});

	}
	//************************* AttendanceType *********************************
	$scope.AddDetails = function (ind) {
		if ($scope.newAttendanceType.AttendanceTypeDetailsColl) {
			if ($scope.newAttendanceType.AttendanceTypeDetailsColl.length > ind + 1) {
				$scope.newAttendanceType.AttendanceTypeDetailsColl.splice(ind + 1, 0, {
					Formula: ''
				})
			} else {
				$scope.newAttendanceType.AttendanceTypeDetailsColl.push({
					Formula: ''
				})
			}
		}
	};
	$scope.delDetails = function (ind) {
		if ($scope.newAttendanceType.AttendanceTypeDetailsColl) {
			if ($scope.newAttendanceType.AttendanceTypeDetailsColl.length > 1) {
				$scope.newAttendanceType.AttendanceTypeDetailsColl.splice(ind, 1);
			}
		}
	};

	$scope.IsValidAttendanceType = function () {
		if ($scope.newAttendanceType.Name.isEmpty()) {
			Swal.fire('Please ! Enter Name');
			return false;
		}
		return true;
	}

	$scope.SaveUpdateAttendanceType = function () {
		if ($scope.IsValidAttendanceType() == true) {
			if ($scope.confirmMSG.Accept == true) {
				var saveModify = $scope.newAttendanceType.Mode;
				Swal.fire({
					title: 'Do you want to ' + saveModify + ' the current data?',
					showCancelButton: true,
					confirmButtonText: saveModify,
				}).then((result) => {
					/* Read more about isConfirmed, isDenied below */
					if (result.isConfirmed) {
						$scope.CallSaveUpdateAttendanceType();
					}
				});
			} else
				$scope.CallSaveUpdateAttendanceType();
		}
	};

	$scope.CallSaveUpdateAttendanceType = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		$http({
			method: 'POST',
			url: base_url + "Payroll/Master/SaveAttendanceType",
			headers: { 'Content-Type': undefined },
			transformRequest: function (data) {
				var formData = new FormData();
				formData.append("jsonData", angular.toJson(data.jsonData));
				return formData;
			},
			data: { jsonData: $scope.newAttendanceType }
		}).then(function (res) {
			$scope.loadingstatus = "stop";
			hidePleaseWait();
			Swal.fire(res.data.ResponseMSG);
			if (res.data.IsSuccess == true) {
				$scope.ClearAttendanceType();
				$scope.GetAllAttendanceTypeList();
			}
		}, function (errormessage) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
		});
	}

	$scope.GetAllAttendanceTypeList = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		$scope.AttendanceTypeList = [];
		$http({
			method: 'Get',
			url: base_url + "Payroll/Master/GetAllAttendanceType",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.AttendanceTypeList = res.data.Data;
			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	}

	$scope.GetAttendanceTypeById = function (refData) {
		$scope.loadingstatus = "running";
		showPleaseWait();
		var para = {
			AttendanceTypeId: refData.AttendanceTypeId
		};
		$http({
			method: 'POST',
			url: base_url + "Payroll/Master/GetAttendanceTypeById",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.newAttendanceType = res.data.Data;
				$scope.newAttendanceType.Mode = 'Modify';
				if (!$scope.newAttendanceType.AttendanceTypeDetailsColl || $scope.newAttendanceType.AttendanceTypeDetailsColl.length == 0) {
					$scope.newAttendanceType.AttendanceTypeDetailsColl = [];
					$scope.newAttendanceType.AttendanceTypeDetailsColl.push({});
				}


				$('#custom-tabs-four-profile-tab').tab('show');

			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	};

	$scope.DelAttendanceTypeById = function (refData) {
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
					AttendanceTypeId: refData.AttendanceTypeId
				};
				$http({
					method: 'POST',
					url: base_url + "Payroll/Master/DeleteAttendanceType",
					dataType: "json",
					data: JSON.stringify(para)
				}).then(function (res) {
					hidePleaseWait();
					$scope.loadingstatus = "stop";
					if (res.data.IsSuccess) {
						$scope.GetAllAttendanceTypeList();
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