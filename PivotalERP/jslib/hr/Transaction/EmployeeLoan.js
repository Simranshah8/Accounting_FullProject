app.controller('EmployeeLoanController', function ($scope, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'Employee Loan';
	LoadData();
	function LoadData() {
		$('.select2').select2();
		$scope.confirmMSG = GlobalServices.getConfirmMSG();
		$scope.perPageColl = GlobalServices.getPerPageList();
		//$scope.MonthList = GlobalServices.getMonthList();

		//$scope.EmployeeSearchOptions = GlobalServices.getEmployeeSearchOptions();

		$scope.currentPages = {
			EmployeeLoan: 1,
		};

		//$scope.PayHeadingList = [];
		//$http({
		//	method: 'GET',
		//	url: base_url + "HR/Transaction/GetAllPayHeading",
		//	dataType: "json"
		//}).then(function (res) {
		//	hidePleaseWait();
		//	$scope.loadingstatus = "stop";
		//	if (res.data.IsSuccess && res.data.Data) {
		//		$scope.PayHeadingList = res.data.Data;

		//	} else {
		//		Swal.fire(res.data.ResponseMSG);
		//	}
		//}, function (reason) {
		//	Swal.fire('Failed' + reason);
		//});
		$scope.LoanTypeList = [];
		$http({
			method: 'GET',
			url: base_url + "HR/Transaction/GetAllLoanType",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.LoanTypeList = res.data.Data;

			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

		$scope.searchData = {
			EmployeeLoan: '',
		};

		$scope.perPage = {
			EmployeeLoan: GlobalServices.getPerPageRow(),
		};

		$scope.newEmployeeLoan = {
			TranId: 0,
			//SelectEmployee: $scope.EmployeeSearchOptions[0].value,
			EmployeeId: null,
			LoanDate: new Date(),
			LoanTypeId: null,
			PrincipleAmount: 0,
			InterestRate: 0,
			Period: '',
			EMIAmount: 0,
			EffDate: new Date(),
			Remarks: '',
			CompanyId: null,
			Mode: 'Save'
		};



	}

	$scope.ClearEmployeeLoan = function () {
		$scope.newEmployeeLoan = {
			TranId: 0,
			//SelectEmployee: $scope.EmployeeSearchOptions[0].value,
			EmployeeId: null,
			LoanDate: new Date(),
			LoanTypeId: null,
			PrincipleAmount: 0,
			InterestRate: 0,
			Period: '',
			EMIAmount: 0,
			EffDate: new Date(),
			Remarks: '',
			CompanyId: null,
			Mode: 'Save'
		};
	}



	//*************************EmployeeLoan*********************************

	$scope.SaveUpdateEmployeeLoan = function () {
		if ($scope.confirmMSG.Accept == true) {
			var saveModify = $scope.newEmployeeLoan.Mode;
			Swal.fire({
				title: 'Do you want to ' + saveModify + ' the current data?',
				showCancelButton: true,
				confirmButtonText: saveModify,
			}).then((result) => {
				if (result.isConfirmed) {
					$scope.CallSaveUpdateEmployeeLoan();
				}
			});
		} else
			$scope.CallSaveUpdateEmployeeLoan();
	};

	$scope.CallSaveUpdateEmployeeLoan = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();

		if ($scope.newEmployeeLoan.LoanDateDet) {
			$scope.newEmployeeLoan.LoanDate = $filter('date')(new Date($scope.newEmployeeLoan.LoanDateDet.dateAD), 'yyyy-MM-dd');
		} else
			$scope.newEmployeeLoan.LoanDate = $filter('date')(new Date(), 'yyyy-MM-dd');

		if ($scope.newEmployeeLoan.EffDateDet) {
			$scope.newEmployeeLoan.EffDate = $filter('date')(new Date($scope.newEmployeeLoan.EffDateDet.dateAD), 'yyyy-MM-dd');
		} else
			$scope.newEmployeeLoan.EffDate = $filter('date')(new Date(), 'yyyy-MM-dd');

		$http({
			method: 'POST',
			url: base_url + "HR/Transaction/SaveEmployeeLoan",
			headers: { 'Content-Type': undefined },
			transformRequest: function (data) {
				var formData = new FormData();
				formData.append("jsonData", angular.toJson(data.jsonData));
				return formData;
			},
			data: { jsonData: $scope.newEmployeeLoan }
		}).then(function (res) {
			$scope.loadingstatus = "stop";
			hidePleaseWait();
			Swal.fire(res.data.ResponseMSG);
			if (res.data.IsSuccess == true) {
				$scope.ClearEmployeeLoan();
				$scope.GetAllEmployeeLoan();
			}
		}, function (errormessage) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
		});
	}

	$scope.GetAllEmployeeLoan = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		$scope.EmployeeLoanList = [];
		$http({
			method: 'GET',
			url: base_url + "HR/Transaction/GetAllEmployeeLoan",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.EmployeeLoanList = res.data.Data;
			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	}

	$scope.GetEmployeeLoanById = function (refData) {
		$scope.loadingstatus = "running";
		showPleaseWait();
		var para = {
			TranId: refData.TranId
		};
		$http({
			method: 'POST',
			url: base_url + "HR/Transaction/getEmployeeLoanById",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.newEmployeeLoan = res.data.Data;

				if ($scope.newEmployeeLoan.LoanDate)
					$scope.newEmployeeLoan.LoanDate_TMP = new Date($scope.newEmployeeLoan.LoanDate);

				if ($scope.newEmployeeLoan.EffDate)
					$scope.newEmployeeLoan.EffDate_TMP = new Date($scope.newEmployeeLoan.EffDate);

				$scope.newEmployeeLoan.Mode = 'Modify';
				$scope.calculateEMI();
				$('#custom-tabs-four-profile-tab').tab('show');

			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

	};

	$scope.deleteEmployeeLoan = function (refData, ind) {
		Swal.fire({
			title: 'Are you sure you want to delete ' + refData.Period + '?',
			showCancelButton: true,
			confirmButtonText: 'Delete',
		}).then((result) => {
			if (result.isConfirmed) {
				var para = { TranId: refData.TranId };
				$http({
					method: 'POST',
					url: base_url + "HR/Transaction/DeleteEmployeeLoan",
					dataType: "json",
					data: JSON.stringify(para)
				}).then(function (res) {
					hidePleaseWait();
					$scope.loadingStatus = "stop";

					Swal.fire(res.data.ResponseMSG);
					if (res.data.IsSuccess == true) {
						$scope.EmployeeLoanList.splice(ind, 1);
					}
				}, function (reason) {
					Swal.fire('Failed' + reason);
				});
			}

		});
	}

	//EMI = P × ( R(1 + R)^N / (1 + R)^N - 1)
	$scope.calculateEMI = function () {
		if ($scope.newEmployeeLoan.PrincipleAmount && $scope.newEmployeeLoan.InterestRate && $scope.newEmployeeLoan.Period) {
			var P = parseFloat($scope.newEmployeeLoan.PrincipleAmount) || 0;
			var R = parseFloat($scope.newEmployeeLoan.InterestRate) || 0;
			var N = parseInt($scope.newEmployeeLoan.Period) || 0;

			if (P > 0 && R > 0 && N > 0) {
				var monthlyRate = R / 12 / 100;
				var EMI = P * monthlyRate * Math.pow(1 + monthlyRate, N) / (Math.pow(1 + monthlyRate, N) - 1);
				$scope.newEmployeeLoan.EMIAmount = EMI.toFixed(2);
			} else {
				$scope.newEmployeeLoan.EMIAmount = 0;
			}
		}
	};

	$scope.SelectEmployeeId = function (empDetails) {
		if (empDetails) {
			$scope.newEmployeeLoan.EmployeeId = empDetails.EmployeeId;
			$scope.newEmployeeLoan.CompanyId = empDetails.CompanyId;
		}
	}


	$scope.pageChangeHandler = function (num) {
		console.log('page changed to ' + num);
	};

});