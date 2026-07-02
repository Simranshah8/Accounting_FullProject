

app.controller('AllowUserWiseGroupCTRL', function ($scope, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'Allow BackdateEntry'

	$scope.LoadData = function () {
		$('.select2').select2({
			allowClear: true,
			openOnEnter: true
		});
		$scope.confirmMSG = GlobalServices.getConfirmMSG();
		$scope.searchData = {
			AllowBackDateEntry: '',
		};

		$scope.newAllowBackDateEntry = {
			AllowBackDateEntryId: null,
			UserId: null,
			GroupId: null,
			UserWise: 1,
			AllowAnyDate: false,
			TotalBackDaysAllow: 0,
			PostBackDaysAllow: 0,
			CancelBackDaysAllow: 0
		};

		$scope.UserList = [];
		$http({
			method: 'POST',
			url: base_url + "Setup/Security/GetUserListForSecurity",
			dataType: "json"
		}).then(function (res) {
			if (res.data.IsSuccess && res.data.Data) {
				$scope.UserList = res.data.Data;

			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

	 

	}

	$scope.ClearAllowBackDateEntry = function () {

		$scope.newAllowBackDateEntry = {
			AllowBackDateEntryId: null,
			UserId: null,
			GroupId: null,
			UserWise: 1,
			AllowAnyDate: false,
			TotalBackDaysAllow: 0,
			PostBackDaysAllow: 0,
			CancelBackDaysAllow: 0
		};
	}


	//************************* AllowBackDateEntry *********************************

	$scope.CheckAllForAllowAnyDate = function () {
		var tmpData = $filter('filter')($scope.AllowBackDateEntryList, $scope.searchData.AllowBackDateEntry);

		angular.forEach(tmpData, function (ent) {
			ent.AllowAnyDate = $scope.newAllowBackDateEntry.AllowAnyDate;
		});
	}

	$scope.CheckAllForTotalBackDaysAllow = function () {
		var tmpData = $filter('filter')($scope.AllowBackDateEntryList, $scope.searchData.AllowBackDateEntry);

		angular.forEach(tmpData, function (ent) {
			ent.TotalBackDaysAllow = $scope.newAllowBackDateEntry.TotalBackDaysAllow;
		});
	}

	$scope.CheckAllForPostBackDaysAllow = function () {
		var tmpData = $filter('filter')($scope.AllowBackDateEntryList, $scope.searchData.AllowBackDateEntry);

		angular.forEach(tmpData, function (ent) {
			ent.PostBackDaysAllow = $scope.newAllowBackDateEntry.PostBackDaysAllow;
		});
	}

	$scope.CheckAllForCancelBackDaysAllow = function () {
		var tmpData = $filter('filter')($scope.AllowBackDateEntryList, $scope.searchData.AllowBackDateEntry);

		angular.forEach(tmpData, function (ent) {
			ent.CancelBackDaysAllow = $scope.newAllowBackDateEntry.CancelBackDaysAllow;
		});
	}
	$scope.GetAllowBackDateEntryList = function () {

		if (!$scope.newAllowBackDateEntry.UserId)
			return;

		var para = {
			forUserId: $scope.newAllowBackDateEntry.UserId,			
		};

		if (para.forUserId > 0) {


			$scope.loadingstatus = "running";
			showPleaseWait();

			$http({
				method: 'POST',
				url: base_url + "Setup/Security/GetAllowUserWiseGroup",
				dataType: "json",
				data: JSON.stringify(para)
			}).then(function (res) {
				hidePleaseWait();
				$scope.loadingstatus = "stop";
				if (res.data.IsSuccess && res.data.Data) {
					$scope.AllowBackDateEntryList = res.data.Data;
				} else {
					Swal.fire(res.data.ResponseMSG);
				}

			}, function (reason) {
				Swal.fire('Failed' + reason);
			});
		}


	};

	$scope.IsValidAllowBackDateEntry = function () {

		if (!$scope.AllowBackDateEntryList || $scope.AllowBackDateEntryList.length == 0) {
			Swal.fire('Not Data Found For Save');
			return false;
		}

		return true;
	}

	$scope.SaveUpdateAllowBackDateEntry = function () {
		if ($scope.IsValidAllowBackDateEntry() == true) {
			if ($scope.confirmMSG.Accept == true) {
				var saveModify = $scope.newAllowBackDateEntry.Mode;
				Swal.fire({
					title: 'Do you want to ' + saveModify + ' the current data?',
					showCancelButton: true,
					confirmButtonText: saveModify,
				}).then((result) => {
					/* Read more about isConfirmed, isDenied below */
					if (result.isConfirmed) {
						$scope.CallSaveUpdateAllowBackDateEntry();
					}
				});
			} else
				$scope.CallSaveUpdateAllowBackDateEntry();

		}
	};

	$scope.CallSaveUpdateAllowBackDateEntry = function () {

		if (!$scope.newAllowBackDateEntry.UserId)
			return;

		$scope.loadingstatus = "running";
		showPleaseWait();

		var forId = $scope.newAllowBackDateEntry.UserId;
		var forType = 1;
		

		$http({
			method: 'POST',
			url: base_url + "Setup/Security/SaveAllowUserWiseGroup",
			headers: { 'Content-Type': undefined },

			transformRequest: function (data) {

				var formData = new FormData();
				formData.append("forId", data.id);
				formData.append("forType", data.forT);

				formData.append("jsonData", angular.toJson(data.jsonData));

				return formData;
			},
			data: { jsonData: $scope.AllowBackDateEntryList, id: forId, forT: $scope.newAllowBackDateEntry.UserWise }
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