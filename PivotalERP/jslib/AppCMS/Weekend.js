app.controller('weekendController', function ($scope, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'Weekend';

	const fullDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

	$scope.LoadData = function () {

		$scope.confirmMSG = GlobalServices.getConfirmMSG();
		$scope.perPageColl = GlobalServices.getPerPageList();

		$scope.WeekendList = [];

		$scope.GetWeekendList();

	}
	$scope.IsValidWeekend = function () {
		angular.forEach($scope.WeekendList, function (w) {
			if (w.ColorCode.isEmpty()) {
				Swal.fire('Please ! Select Color Code');
				return false;
			}
		});

		var colorCode = $scope.WeekendList[0].ColorCode;
		angular.forEach($scope.WeekendList, function (w) {
			w.ColorCode = colorCode;
		});

		return true;
	}

	$scope.SaveUpdateEventType = function () {
		if ($scope.IsValidWeekend() == true) {
			if ($scope.confirmMSG.Accept == true) {
				var saveModify = 'Save';
				Swal.fire({
					title: 'Do you want to ' + saveModify + ' the current data?',
					showCancelButton: true,
					confirmButtonText: saveModify,
				}).then((result) => {
					/* Read more about isConfirmed, isDenied below */
					if (result.isConfirmed) {
						$scope.CallSaveUpdateEventType();
					}
				});
			} else
				$scope.CallSaveUpdateEventType();

		}
	};


	$scope.CallSaveUpdateEventType = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();

		$http({
			method: 'POST',
			url: base_url + "AppCMS/Creation/SaveWeekend",
			headers: { 'Content-Type': undefined },

			transformRequest: function (data) {

				var formData = new FormData();
				formData.append("jsonData", angular.toJson(data.jsonData));

				return formData;
			},
			data: { jsonData: $scope.WeekendList }
		}).then(function (res) {

			$scope.loadingstatus = "stop";
			hidePleaseWait();
			Swal.fire(res.data.ResponseMSG);

		}, function (errormessage) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";

		});
	}

	$scope.GetWeekendList = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		$scope.WeekendList = [];

		$http({
			method: 'POST',
			url: base_url + "AppCMS/Creation/GetWeekendList",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				var wDataColl = mx(res.data.Data);

				var colorCode = res.data.Data.length > 0 ? res.data.Data[0].ColorCode : '';

				var dayId = 1;
				angular.forEach(fullDays, function (d) {
					var fdata = wDataColl.firstOrDefault(p1 => p1.DayId == dayId);
					$scope.WeekendList.push({
						DayId: dayId,
						DayName: d,
						IsChecked: fdata ? true : false,
						ColorCode: colorCode
					});
					dayId++;
				});

			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

	}

});