app.controller('ConfigurationController', function ($scope, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'Configuration';

	$scope.LoadData = function () {
		$('.select2').select2();

		$scope.numberingMethods = GlobalServices.getNumberingMethod();

		$scope.LeftStudentConfigColl = [{ id: 1, text: 'Disable Account Login' }, { id: 2, text: 'Show the Data before Left Date' }];

		$scope.newConfig = {
			RegdNumberingMethod: 1,
			CodePrefix: '',
			CodeSuffix: '',
			StartNo: 0,
			LeftStudentConfig: null,
			AllowReGenerateUserPwd: false,
			RetirementAge: 60,
			Mode: 'Save'
		};

		$scope.GetEmployeeConfiguration();

	}


	$scope.ClearConfig = function () {
		$scope.newConfig = {
			RegdNumberingMethod: 1,
			CodePrefix: '',
			CodeSuffix: '',
			StartNo: 0,
			LeftStudentConfig: null,
			AllowReGenerateUserPwd: false,
			RetirementAge: 60,
			Mode: 'Save'
		};
	}

	//*************************Config *********************************

	$scope.SaveEmployeeConfiguration = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		$http({
			method: 'POST',
			url: base_url + "HR/SetUp/SaveEmployeeConfiguration",
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
				$scope.GetEmployeeConfiguration();
			}
		}, function (errormessage) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";

		});
	}


	$scope.GetEmployeeConfiguration = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		$scope.newConfig = {};
		$http({
			method: 'POST',
			url: base_url + "HR/SetUp/GetEmployeeConfiguration",
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