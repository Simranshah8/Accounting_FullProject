

app.controller('activeSecurityController', function ($scope, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'Active Security'

	$scope.LoadData = function () {
	 
		$scope.confirmMSG = GlobalServices.getConfirmMSG();
		 
		$scope.ActiveSec = {};
		$http({
			method: 'POST',
			url: base_url + "Setup/Security/GetActiveSecurity",
			dataType: "json"
		}).then(function (res) {
			if (res.data.IsSuccess && res.data.Data) {
				$scope.ActiveSec = res.data.Data;
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
 
	}
	 
	$scope.CallSave = function () {
		$scope.loadingstatus = 'running';
		showPleaseWait();

		$http({
			method: 'POST',
			url: base_url + "Setup/Security/SaveActiveSecurity",
			headers: { 'content-Type': undefined },

			transformRequest: function (data) {
				var formData = new FormData();
				formData.append("jsonData", angular.toJson(data.jsonData));
				return formData;
			},
			data: { jsonData: $scope.ActiveSec }
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