app.controller('TaxCalculatorController', function ($scope, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'Tax Calculator';

	$scope.LoadData = function () {
		$('.select2').select2();
		var gSrv = GlobalServices;
		$scope.confirmMSG = gSrv.getConfirmMSG();

		$scope.MaritalCol = [{ id: 1, text: 'Single' }, { id: 2, text: 'Married' }, { id: 3, text: 'Divorced' }];
		$scope.ResidentCol = [{ id: 1, text: 'Resident' }, { id: 2, text: 'Non Resident' }];


		$scope.PayHeadingList = [];
		$http({
			method: 'GET',
			url: base_url + "HR/Transaction/GetAllPayHeading",
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

		//$scope.DepartmentList = [];
		//gSrv.getDepartmentList().then(function (res) {
		//	$scope.DepartmentList = res.data.Data;
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


		$scope.CategoryList = [];
		$http({
			method: 'GET',
			url: base_url + "HR/Master/GetAllCategory",
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
		//$scope.CategoryList = [];
		//gSrv.getCategoryList().then(function (res) {
		//	$scope.CategoryList = res.data.Data;
		//}, function (reason) {
		//	Swal.fire('Failed' + reason);
		//});


		$scope.searchData = {
			TaxCalculator: '',

		};

		$scope.newTaxCalculator = {
			TaxCalculatorId: null,
			BranchId: null,
			DepartmentId: null,
			Mode: 'Save'
		};

	}


	$scope.SaveUpdateTaxCalculator = function () {
		if ($scope.IsValidTaxCalculator() == true) {
			if ($scope.confirmMSG.Accept == true) {
				var saveModify = $scope.newTaxCalculator.Mode;
				Swal.fire({
					title: 'Do you want to ' + saveModify + ' the current data?',
					showCancelButton: true,
					confirmButtonText: saveModify,
				}).then((result) => {
					/* Read more about isConfirmed, isDenied below */
					if (result.isConfirmed) {
						$scope.CallSaveUpdateTaxCalculator();
					}
				});
			} else
				$scope.CallSaveUpdateTaxCalculator();
		}
	};

	$scope.CallSaveUpdateTaxCalculator = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		$http({
			method: 'POST',
			url: base_url + "HR/Transaction/SaveTaxCalculator",
			headers: { 'Content-Type': undefined },
			transformRequest: function (data) {
				var formData = new FormData();
				formData.append("jsonData", angular.toJson(data.jsonData));
				return formData;
			},
			data: { jsonData: $scope.newSetup }
		}).then(function (res) {
			$scope.loadingstatus = "stop";
			hidePleaseWait();
			Swal.fire(res.data.ResponseMSG);
			if (res.data.IsSuccess == true) {
				$scope.ClearSetup();
				$scope.GetAllTaxCalculatorList();
			}
		}, function (errormessage) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
		});
	}

	$scope.GetAllTaxCalculatorList = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		$scope.TaxCalculatorList = [];

		$http({
			method: 'POST',
			url: base_url + "HRM/Creation/GetAllTaxCalculatorList",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.TaxCalculatorList = res.data.Data;

			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

	}




	$scope.pageChangeHandler = function (num) {
		console.log('page changed to ' + num);
	};

});