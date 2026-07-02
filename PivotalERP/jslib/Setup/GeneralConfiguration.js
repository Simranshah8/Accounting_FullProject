
app.controller('generalConfigurationController', function ($scope, $http, $timeout, $filter, GlobalServices) {

	$scope.Title = 'General Configuration';

	var glSrv = GlobalServices;
	$scope.LoadData = function () {

		$scope.DuesBillAsColl = [{ id: 1, text: 'Bill Wise and Fifo' }, { id: 2, text: 'Fifo' }];

		$scope.LossAsList = [{ id: 1, text: 'Sales' }, { id: 2, text: 'Purchase' }];
		$scope.PrintPreviewAsColl = [{ id: 1, text: 'Modal Dialog' }, { id: 2, text: 'New Tab' }, { id: 3, text: 'Direct Print' }];
		$scope.confirmMSG = glSrv.getConfirmMSG();
		$scope.DateStyles = glSrv.getDateStyle();
		$scope.DateFormats = glSrv.getDateFormat();

		$scope.comDet = {};
		glSrv.getCompanyDet().then(function (res) {
			if (res.data.IsSuccess && res.data.Data) {
				$scope.comDet = res.data.Data;
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

	 
		$scope.newConfig = {
			 
			Mode: 'Save'
		};

		$scope.GetConfig();

	}

	$scope.IsValidConfig = function () {
	 

		return true;
	}

	$scope.SaveUpdateConfiguration = function () {
		if ($scope.IsValidConfig() == true) {
			if ($scope.confirmMSG.Accept == true) {
				var saveModify = $scope.newCompanyDetails.Mode;
				Swal.fire({
					title: 'Do you want to ' + saveModify + ' the current data?',
					showCancelButton: true,
					confirmButtonText: saveModify,
				}).then((result) => {
					/* Read more about isConfirmed, isDenied below */
					if (result.isConfirmed) {
						$scope.CallSaveUpdateConfig();
					}
				});
			} else
				$scope.CallSaveUpdateConfig();

		}
	};

	$scope.CallSaveUpdateConfig = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		 

		$http({
			method: 'POST',
			url: base_url + "Setup/Security/SaveUpdateGeneralConfiguration",
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

		}, function (errormessage) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";

		});


	}

	$scope.GetConfig = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		$scope.newConfig = {};

		$http({
			method: 'POST',
			url: base_url + "Setup/Security/GetGeneralConfiguration",
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


});