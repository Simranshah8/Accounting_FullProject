

app.controller('ctrlInventoryConfiguration', function ($scope, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'Active Security'

	$scope.LoadData = function () {

		$scope.confirmMSG = GlobalServices.getConfirmMSG();


		$scope.AppearancesTypeColl = [];
		$http({
			method: 'GET',
			url: base_url + "V1/StaticValues/GetAppearancesType",
			dataType: "json"
		}).then(function (res) {
			if (res.data) {
				$scope.AppearancesTypeColl = res.data;
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});


		$scope.VoucherDateColl = [];
		$http({
			method: 'GET',
			url: base_url + "V1/StaticValues/GetVoucherDate",
			dataType: "json"
		}).then(function (res) {
			if (res.data) {
				$scope.VoucherDateColl = res.data;
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

		$scope.InvConfig = {};
		$http({
			method: 'GET',
			url: base_url + "Setup/Security/GetInvConfig",
			dataType: "json"
		}).then(function (res) {
			if (res.data.IsSuccess && res.data.Data) {
				$scope.InvConfig = res.data.Data;
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

		$scope.LedgerGroupColl = [];
		$http({
			method: 'GET',
			url: base_url + "Account/Creation/GetAllLedgerGroup",
			dataType: "json"
		}).then(function (res) {
			if (res.data.IsSuccess && res.data.Data) {
				$scope.LedgerGroupColl = res.data.Data;
			}
		}, function (reason) {
			alert('Failed' + reason);
		});

	}

	$scope.CallSave = function () {
		$scope.loadingstatus = 'running';
		showPleaseWait();

		$http({
			method: 'POST',
			url: base_url + "Setup/Security/SaveInvConfig",
			headers: { 'content-Type': undefined },

			transformRequest: function (data) {
				var formData = new FormData();
				formData.append("jsonData", angular.toJson(data.jsonData));
				return formData;
			},
			data: { jsonData: $scope.InvConfig }
		}).then(function (res) {

			$scope.loadingstatus = "stop";
			hidePleaseWait();
			Swal.fire(res.data.ResponseMSG);

		}, function (errormessage) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
		});

	}

	$scope.DelTransactionCon = function () {
		Swal.fire({
			title: 'Are you sure you want to delete all consumption transaction (after delete not recover) ?',
			showCancelButton: true,
			confirmButtonText: 'Delete',
			//message: 'Are you sure to delete selected Branch :-' + beData.Name,
		}).then((result) => {
			if (result.isConfirmed) {
				$scope.loadingstatus = "running";
				showPleaseWait();

				$http({
					method: 'POST',
					url: base_url + "Inventory/Transaction/DelShrinkageWorkingLoss",
					dataType: "json",
					//data: JSON.stringify(para)
				}).then(function (res) {
					hidePleaseWait();
					$scope.loadingstatus = "stop";
					Swal.fire(res.data.ResponseMSG);

				}, function (reason) {
					Swal.fire('Failed' + reason);

				});
			}

		});
	}


	$scope.CalculateShrinkage = function (re) {

		$scope.loadingstatus = 'running';
		showPleaseWait();

		var para = {
			ReCalculate: re
		};

		$http({
			method: 'POST',
			url: base_url + "Inventory/Transaction/PendingSalesForConsumption",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			$scope.loadingstatus = 'stop';
			hidePleaseWait();
			Swal.fire(res.data.ResponseMSG);
		}, function (reason) {
			alert('Failed' + reason);
		});

	}

});