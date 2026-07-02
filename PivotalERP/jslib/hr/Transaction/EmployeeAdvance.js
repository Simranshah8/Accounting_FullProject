app.controller('EmployeeAdvanceController', function ($scope, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'Employee Loan';
	LoadData();
	function LoadData() {
		$('.select2').select2();
		$scope.confirmMSG = GlobalServices.getConfirmMSG();
		$scope.perPageColl = GlobalServices.getPerPageList();
		//$scope.MonthList = GlobalServices.getMonthList();
		//$scope.EmployeeSearchOptions = GlobalServices.getEmployeeSearchOptions();
		$scope.currentPages = {
			EmployeeAdvance: 1,
		};

		$scope.searchData = {
			EmployeeAdvance: '',
		};

		$scope.perPage = {
			EmployeeAdvance: GlobalServices.getPerPageRow(),
		};

		$scope.AdvanceTypeList = [];
		$http({
			method: 'GET',
			url: base_url + "HR/Transaction/GetAllAdvanceType",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.AdvanceTypeList = res.data.Data;
			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

		$scope.newEmployeeAdvance = {
			EmployeeAdvanceId: null,
			AdvanceDate_TMP: new Date(),
			Date_TMP: new Date(),
			AdvanceTypeId: null,
			AdvanceAmount: '',
			Installment: '',
			DeductionAmount: '',
			EffDate_TMP: new Date(),
			Remarks: '',
			CompanyId:null,
			//SelectEmployee: $scope.EmployeeSearchOptions[0].value,
			Mode: 'Save'
		};

	}

	$scope.SelectEmployeeId = function (empDetails) {
		if (empDetails) {
			$scope.newEmployeeAdvance.EmployeeId = empDetails.EmployeeId;
			$scope.newEmployeeAdvance.CompanyId = empDetails.CompanyId;
		}
	}

	$scope.ClearEmployeeAdvance = function () {
		$scope.newEmployeeAdvance = {
			EmployeeAdvanceId: null,
			EmployeeId: null,
			AdvanceDate_TMP: new Date(),
			Date_TMP: new Date(),
			AdvanceTypeId: null,
			AdvanceAmount: '',
			Installment: '',
			DeductionAmount: '',
			EffDate_TMP: new Date(),
			Remarks: '',
			CompanyId: null,
			//SelectEmployee: $scope.EmployeeSearchOptions[0].value,
			Mode: 'Save'
		};
	}

	//*************************EmployeeAdvance*********************************
	$scope.SaveUpdateEmployeeAdvance = function () {
		if ($scope.confirmMSG.Accept == true) {
			var saveModify = $scope.newEmployeeAdvance.Mode;
			Swal.fire({
				title: 'Do you want to ' + saveModify + ' the current data?',
				showCancelButton: true,
				confirmButtonText: saveModify,
			}).then((result) => {
				if (result.isConfirmed) {
					$scope.CallSaveUpdateEmployeeAdvance();
				}
			});
		} else
			$scope.CallSaveUpdateEmployeeAdvance();
	};

	$scope.CallSaveUpdateEmployeeAdvance = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();

		if ($scope.newEmployeeAdvance.AdvanceDateDet) {
			$scope.newEmployeeAdvance.AdvanceDate = $filter('date')(new Date($scope.newEmployeeAdvance.AdvanceDateDet.dateAD), 'yyyy-MM-dd');
		} else
			$scope.newEmployeeAdvance.AdvanceDate = $filter('date')(new Date(), 'yyyy-MM-dd');

		if ($scope.newEmployeeAdvance.EffDateDet) {
			$scope.newEmployeeAdvance.EffDate = $filter('date')(new Date($scope.newEmployeeAdvance.EffDateDet.dateAD), 'yyyy-MM-dd');
		} else
			$scope.newEmployeeAdvance.EffDate = $filter('date')(new Date(), 'yyyy-MM-dd');


		$http({
			method: 'POST',
			url: base_url + "HR/Transaction/SaveEmployeeAdvance",
			headers: { 'Content-Type': undefined },
			transformRequest: function (data) {
				var formData = new FormData();
				formData.append("jsonData", angular.toJson(data.jsonData));
				return formData;
			},
			data: { jsonData: $scope.newEmployeeAdvance }
		}).then(function (res) {
			$scope.loadingstatus = "stop";
			hidePleaseWait();
			Swal.fire(res.data.ResponseMSG);
			if (res.data.IsSuccess == true) {
				$scope.ClearEmployeeAdvance();
				$scope.GetAllEmployeeAdvanceList();
			}
		}, function (errormessage) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
		});
	}

	$scope.GetAllEmployeeAdvanceList = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		$scope.EmployeeAdvanceList = [];
		$http({
			method: 'GET',
			url: base_url + "HR/Transaction/GetAllEmployeeAdvance",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.EmployeeAdvanceList = res.data.Data;
			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

	}

	$scope.GetEmployeeAdvanceById = function (refData) {
		$scope.loadingstatus = "running";
		showPleaseWait();
		var para = {
			TranId: refData.TranId
		};

		$http({
			method: 'POST',
			url: base_url + "HR/Transaction/getEmployeeAdvanceById",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.newEmployeeAdvance = res.data.Data;

				if ($scope.newEmployeeAdvance.AdvanceDate)
					$scope.newEmployeeAdvance.AdvanceDate_TMP = new Date($scope.newEmployeeAdvance.AdvanceDate);

				if ($scope.newEmployeeAdvance.EffDate)
					$scope.newEmployeeAdvance.EffDate_TMP = new Date($scope.newEmployeeAdvance.EffDate);

				$scope.newEmployeeAdvance.Mode = 'Modify';
				$('#custom-tabs-four-profile-tab').tab('show');

			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	};

	$scope.DelEmployeeAdvance = function (refData, ind) {
		Swal.fire({
			title: 'Are you sure you want to delete ' + refData.EmployeeName + '?',
			showCancelButton: true,
			confirmButtonText: 'Delete',
		}).then((result) => {
			if (result.isConfirmed) {
				var para = { TranId: refData.TranId };
				$http({
					method: 'POST',
					url: base_url + "HR/Transaction/DeleteEmployeeAdvance",
					dataType: "json",
					data: JSON.stringify(para)
				}).then(function (res) {
					hidePleaseWait();
					$scope.loadingStatus = "stop";
					Swal.fire(res.data.ResponseMSG);
					if (res.data.IsSuccess == true) {
						$scope.EmployeeAdvanceList.splice(ind, 1);
					}
				}, function (reason) {
					Swal.fire('Failed' + reason);
				});
			}

		});
	}

	$scope.calculateDeduction = function () {
		if ($scope.newEmployeeAdvance.AdvanceAmount && $scope.newEmployeeAdvance.Installment) {
			var amount = parseFloat($scope.newEmployeeAdvance.AdvanceAmount) || 0;
			var installments = parseInt($scope.newEmployeeAdvance.Installment) || 0;

			if (amount > 0 && installments > 0) {
				$scope.newEmployeeAdvance.DeductionAmount = (amount / installments).toFixed(2);
			} else {
				$scope.newEmployeeAdvance.DeductionAmount = 0;
			}
		}
	};

	$scope.pageChangeHandler = function (num) {
		console.log('page changed to ' + num);
	};

});