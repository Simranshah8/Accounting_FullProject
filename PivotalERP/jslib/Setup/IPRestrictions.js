

app.controller('allowIPController', function ($scope, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'Allow IP'

	$scope.LoadData = function () {
	 
		$scope.confirmMSG = GlobalServices.getConfirmMSG();
		 
		$scope.IPDataColl = {};
		$http({
			method: 'POST',
			url: base_url + "Setup/Security/GetIPDetails",
			dataType: "json"
		}).then(function (res) {
			if (res.data.IsSuccess && res.data.Data) {
				$scope.IPDataColl = res.data.Data;
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
 
	}
	 
	$scope.CallSave = function () {
		$scope.loadingstatus = "running";
		showPleaseWait(); 
		$http({
			method: 'POST',
			url: base_url + "Setup/Security/SaveIPDetails",
			dataType: "json",
			data:JSON.stringify($scope.IPDataColl)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			Swal.fire(res.data.ResponseMSG);
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});


	}

});