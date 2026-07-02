

app.controller('ctrlAccountConfiguration', function ($scope, $http, $timeout, $filter, GlobalServices) {
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

		$scope.AccConfig = {};
		$http({
			method: 'GET',
			url: base_url + "Setup/Security/GetAccountConfig",
			dataType: "json"
		}).then(function (res) {
			if (res.data.IsSuccess && res.data.Data) {
				$scope.AccConfig = res.data.Data;
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
			url: base_url + "Setup/Security/SaveAccountConfig",
			headers: { 'content-Type': undefined },

			transformRequest: function (data) {
				var formData = new FormData();
				formData.append("jsonData", angular.toJson(data.jsonData));
				return formData;
			},
			data: { jsonData: $scope.AccConfig }
		}).then(function (res) {

			$scope.loadingstatus = "stop";
			hidePleaseWait();
			Swal.fire(res.data.ResponseMSG);

		}, function (errormessage) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
		});

	}

});