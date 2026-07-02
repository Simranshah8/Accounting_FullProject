app.controller('SalaryAddDeductController', function ($scope, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'Salary Add Deduct';
	OnClickDefault();
	$scope.LoadData = function () {
		$('.select2').select2();
		var gSrv = GlobalServices;
		$scope.confirmMSG = gSrv.getConfirmMSG();
		$scope.perPageColl = gSrv.getPerPageList();
		$scope.GenderColl = gSrv.getGenderList();
		$scope.MonthList = GlobalServices.getMonthList();
		$scope.AcademicYearColl = gSrv.getYearList();
		//$scope.EmployeeSearchOptions = GlobalServices.getEmployeeSearchOptions();
		$scope.TypeList = [{ id: 1, text: 'Addition' }, { id: 2, text: 'Deduction' }]
		$scope.currentPages = {
			SalaryAD: 1,
		};

		$scope.searchData = {
			SalaryAD: '',
		};

		$scope.perPage = {
			SalaryAD: gSrv.getPerPageRow(),
		};


		$scope.newSalaryAD = {
			TranId: null,
			SalaryADId: null,
			BranchId: null,
			DepartmentId: null,
			DesignationId: null,
			ServiceTypeId: null,
			GenderId: null,
			Title: '',
			TypeId: null,
			Amount: 0,
			YearId: null,
			MonthId: null,
			PayHeadingId: null,
			ForDate_TMP: new Date(),
			Remarks: '',
			//SelectEmployee: $scope.EmployeeSearchOptions[0].value,
			Mode: 'Save'
		};

		$scope.GetAllSalaryADList();


		//$scope.DepartmentList = [];
		//gSrv.getDepartmentList().then(function (res) {
		//	$scope.DepartmentList = res.data.Data;
		//}, function (reason) {
		//	Swal.fire('Failed' + reason);
		//});

		//$scope.DesignationList = [];
		//gSrv.getDesignationList().then(function (res) {
		//	$scope.DesignationList = res.data.Data;
		//}, function (reason) {
		//	Swal.fire('Failed' + reason);
		//});


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
			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

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
			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});


		//$scope.ServiceTypeList = [];
		//gSrv.getServiceTypeList().then(function (res) {
		//	$scope.ServiceTypeList = res.data.Data;
		//}, function (reason) {
		//	Swal.fire('Failed' + reason);
		//});


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
			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

		//$scope.AcademicYearColl = [];
		//gSrv.getAcademicYearList().then(function (res) {
		//	$scope.AcademicYearColl = res.data.Data;
		//}, function (reason) {
		//	Swal.fire('Failed' + reason);
		//});


		$scope.PayHeadingList = [];
		$http({
			method: 'GET',
			url: base_url + "HR/Transaction/GetAllPayHeading",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";

			if (res.data.IsSuccess && res.data.Data) {
				var dtColl = res.data.Data;
				dtColl.forEach(function (dt) {
					if (dt.IsActive == true) {
						$scope.PayHeadingList.push(dt);
					}
				});
			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});



		$scope.BranchList = [];
		$http({
			method: 'GET',
			url: base_url + "HR/Transaction/GetBranchListforPayhead",
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

	}

	$scope.ClearSalaryAD = function () {
		$scope.newSalaryAD = {
			SalaryADId: null,
			BranchId: null,
			DepartmentId: null,
			DesignationId: null,
			ServiceTypeId: null,
			GenderId: null,
			Title: '',
			TypeId: null,
			Amount: 0,
			YearId: null,
			MonthId: null,
			PayHeadingId: null,
			ForDate_TMP: new Date(),
			Remarks: '',
			SelectEmployee: $scope.EmployeeSearchOptions[0].value,
			Mode: 'Save'
		};
	}



	$scope.isFieldsDisabled = false;

	$scope.toggleFields = function () {
		if ($scope.newSalaryAD.EmployeeId) {
			$scope.isFieldsDisabled = true;
		} else {
			$scope.isFieldsDisabled = false;
		}
	};


	function OnClickDefault() {
		document.getElementById('SalaryAD-form').style.display = "none";

		document.getElementById('add-SalaryAD').onclick = function () {
			document.getElementById('SalaryADlist').style.display = "none";
			document.getElementById('SalaryAD-form').style.display = "block";
		}

		document.getElementById('SalaryADback-btn').onclick = function () {
			document.getElementById('SalaryAD-form').style.display = "none";
			document.getElementById('SalaryADlist').style.display = "block";
		}
	};

	//*************************SalaryAD*********************************
	$scope.IsValidSalaryAD = function () {
		if ($scope.newSalaryAD.Title.isEmpty()) {
			Swal.fire('Please ! Enter Title');
			return false;
		}
		return true;
	}

	$scope.SaveUpdateSalaryAD = function () {
		if ($scope.IsValidSalaryAD() == true) {
			if ($scope.confirmMSG.Accept == true) {
				var saveModify = $scope.newSalaryAD.Mode;
				Swal.fire({
					title: 'Do you want to ' + saveModify + ' the current data?',
					showCancelButton: true,
					confirmButtonText: saveModify,
				}).then((result) => {
					/* Read more about isConfirmed, isDenied below */
					if (result.isConfirmed) {
						$scope.CallSaveUpdateSalaryAD();
					}
				});
			} else
				$scope.CallSaveUpdateSalaryAD();
		}
	};

	$scope.CallSaveUpdateSalaryAD = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();

		if ($scope.newSalaryAD.ForDateDet) {
			$scope.newSalaryAD.ForDate = $filter('date')(new Date($scope.newSalaryAD.ForDateDet.dateAD), 'yyyy-MM-dd');
		} else
			$scope.newSalaryAD.ForDate = $filter('date')(new Date(), 'yyyy-MM-dd');


		$http({
			method: 'POST',
			url: base_url + "HR/Transaction/SaveSalaryAddDeduct",
			headers: { 'Content-Type': undefined },
			transformRequest: function (data) {
				var formData = new FormData();
				formData.append("jsonData", angular.toJson(data.jsonData));
				return formData;
			},
			data: { jsonData: $scope.newSalaryAD }
		}).then(function (res) {
			$scope.loadingstatus = "stop";
			hidePleaseWait();
			Swal.fire(res.data.ResponseMSG);
			if (res.data.IsSuccess == true) {
				$scope.ClearSalaryAD();
				$scope.GetAllSalaryADList();
			}
		}, function (errormessage) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
		});
	}

	$scope.GetAllSalaryADList = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		$scope.SalaryADList = [];

		$http({
			method: 'Get',
			url: base_url + "HR/Transaction/GetAllSalaryAddDeduct",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.SalaryADList = res.data.Data;

			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

	}

	$scope.GetSalaryADById = function (refData) {
		$scope.loadingstatus = "running";
		showPleaseWait();
		var para = {
			TranId: refData.TranId
		};

		$http({
			method: 'POST',
			url: base_url + "HR/Transaction/getSalaryAddDeductById",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.newSalaryAD = res.data.Data;

				if ($scope.newSalaryAD.ForDate)
					$scope.newSalaryAD.ForDate_TMP = new Date($scope.newSalaryAD.ForDate);

				$scope.newSalaryAD.Mode = 'Modify';
				document.getElementById('SalaryADlist').style.display = "none";
				document.getElementById('SalaryAD-form').style.display = "block";

			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	};

	$scope.DelSalaryADById = function (refData) {
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
					url: base_url + "HR/Transaction/DeleteSalaryAddDeduct",
					dataType: "json",
					data: JSON.stringify(para)
				}).then(function (res) {
					hidePleaseWait();
					$scope.loadingstatus = "stop";
					if (res.data.IsSuccess) {
						$scope.GetAllSalaryADList();
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