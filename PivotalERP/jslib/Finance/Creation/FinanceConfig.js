app.controller('FinanceConfigController', function ($scope, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'Finance Config';

	$scope.LoadData = function () {
		$('.select2').select2();		

		$scope.VoucherList = [];
		$http({
			method: 'GET',
			url: base_url + "Inventory/Reporting/GetAllVoucherList",
			dataType: "json",
		}).then(function (res) {
			if (res.data.IsSuccess && res.data.Data) {
				$scope.VoucherList = res.data.Data;
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

		//$scope.VoucherList = [
		//	{ VoucherId: 1, VoucherName: 'Voucher1' },
		//	{ VoucherId: 2, VoucherName: 'Voucher2' }
		//];

		$scope.CostClassColl = [];
		$http({
			method: 'GET',
			url: base_url + "Account/Creation/GetAllCostClasss",
			dataType: "json"
		}).then(function (res) {
			if (res.data.IsSuccess && res.data.Data) {
				$scope.CostClassColl = res.data.Data;
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

		$scope.newConfig = {			
			FinanceLedgerId: null,
			PrincipalLedgerId: null,
			InterestLedgerId: null,
			RebateLedgerId: null,
			PenaltyLedgerId: null,
			VoucherId: null,
			CostClassId:null,
			Mode: 'Save'
		};

		$scope.GetFinanceConfiguration();

	}


	$scope.ClearConfig = function () {
		$scope.newConfig = {
			FinanceLedgerId: null,
			PrincipalLedgerId: null,
			InterestLedgerId: null,
			RebateLedgerId: null,
			PenaltyLedgerId: null,
			VoucherId: null,
			CostClassId: null,
			Mode: 'Save'
		};
	}

	//*************************Config *********************************

	$scope.SaveFinanceConfiguration = function () {
		if (!$scope.newConfig.FinanceLedgerId) {
			Swal.fire("Please select Finance Ledger");
			return;
		}
		if (!$scope.newConfig.PrincipalLedgerId) {
			Swal.fire("Please select Principal Ledger");
			return;
		}
		if (!$scope.newConfig.InterestLedgerId) {
			Swal.fire("Please select Interest Ledger");
			return;
		}
		if (!$scope.newConfig.RebateLedgerId) {
			Swal.fire("Please select Rebate Ledger");
			return;
		}
		if (!$scope.newConfig.PenaltyLedgerId) {
			Swal.fire("Please select Penalty Ledger");
			return;
		}
		if (!$scope.newConfig.VoucherId) {
			Swal.fire("Please select Voucher");
			return;
		}
		if (!$scope.newConfig.CostClassId) {
			Swal.fire("Please select Cost Class");
			return;
		}
		$scope.loadingstatus = "running";
		showPleaseWait();
		$http({
			method: 'POST',
			url: base_url + "Finance/Creation/SaveFinanceConfig",
			headers: { 'Content-Type': undefined },
			transformRequest: function (data) {
				var formData = new FormData();
				formData.append("jsonData", angular.toJson(data.jsonData));
				return formData;
			},
			data: { jsonData: $scope.newConfig }
		}).then(function (res) {
			$scope.loadingstatus = "stop";
			hidePleaseWait();
			Swal.fire(res.data.ResponseMSG);
			if (res.data.IsSuccess == true) {
				$scope.GetFinanceConfiguration();
			}
		}, function (errormessage) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";

		});
	}


	$scope.GetFinanceConfiguration = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		$scope.newConfig = {};
		$http({
			method: 'POST',
			url: base_url + "Finance/Creation/GetFinanceConfig",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.newConfig = res.data.Data;
			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

	};


	$scope.pageChangeHandler = function (num) {
		console.log('page changed to ' + num);
	};

});