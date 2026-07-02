

app.controller('AllowServiceTypeController', function ($scope, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'Allow ServiceType';

	$scope.LoadData = function () {
		$('.select2').select2({
			allowClear: true,
			openOnEnter: true
		});
		$scope.confirmMSG = GlobalServices.getConfirmMSG();
		$scope.searchData = {
			AllowServiceType: '',
		};

		$scope.newAllowServiceType = {
			AllowGodownId: null,
			UserId: null,
			GroupId: null,
			UserWise: 1,
			ForTransaction: false,
			ForReporting: false

		};

		$scope.AllowGodownList = [];
		$scope.UserList = [];
		$http({
			method: 'POST',
			url: base_url + "Setup/Security/GetAllUserList",
			dataType: "json"
		}).then(function (res) {
			if (res.data.IsSuccess && res.data.Data) {
				$scope.UserList = res.data.Data;

			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

		$scope.UserGroupList = [];
		$http({
			method: 'POST',
			url: base_url + "Setup/Security/GetAllUserGroupList",
			dataType: "json"
		}).then(function (res) {
			if (res.data.IsSuccess && res.data.Data) {
				$scope.UserGroupList = res.data.Data;
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

		//$scope.GetAllAllowGodownList();

	}

	$scope.ClearAllowServiceType = function () {
		$scope.newAllowServiceType = {
			AllowGodownId: null,
			UserId: null,
			ServiceTypeId: null,
			UserWise: 1,
			ForTransaction: false,
			ForReporting: false

		};
	}


	//************************* AllowGodown *********************************


	$scope.CheckAllForTransaction = function () {
		var tmpData = $filter('filter')($scope.AllowServiceTypeList, $scope.searchData.AllowServiceType);

		angular.forEach(tmpData, function (ent) {
			ent.ForTransaction = $scope.newAllowServiceType.ForTransaction;
		});
	}
	$scope.CheckAllForReporting = function () {
		var tmpData = $filter('filter')($scope.AllowServiceTypeList, $scope.searchData.AllowServiceType);

		angular.forEach(tmpData, function (ent) {
			ent.ForReporting = $scope.newAllowServiceType.ForReporting;
		});
	}
	$scope.GetAllowServiceTypeList = function () {

		$scope.loadingstatus = "running";
		showPleaseWait();

		var para = {
			forUserId: ($scope.newAllowServiceType.UserWise == 2 ? null : $scope.newAllowServiceType.UserId),
			forGroupId: ($scope.newAllowServiceType.UserWise == 1 ? null : $scope.newAllowServiceType.GroupId)
		};

		$http({
			method: 'POST',
			url: base_url + "Setup/Security/GetAllowServiceType",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.AllowServiceTypeList = res.data.Data;
			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	};
	$scope.IsValidAllowGodown = function () {

		if (!$scope.AllowServiceTypeList || $scope.AllowServiceTypeList.length == 0) {
			Swal.fire('Not Data Found For Save');
			return false;
		}

		return true;
	}
	$scope.SaveUpdateAllowGodown = function () {
		if ($scope.IsValidAllowGodown() == true) {
			if ($scope.confirmMSG.Accept == true) {
				var saveModify = $scope.newAllowServiceType.Mode;
				Swal.fire({
					title: 'Do you want to ' + saveModify + ' the current data?',
					showCancelButton: true,
					confirmButtonText: saveModify,
				}).then((result) => {
					/* Read more about isConfirmed, isDenied below */
					if (result.isConfirmed) {
						$scope.CallSaveUpdateAllowGodown();
					}
				});
			} else
				$scope.CallSaveUpdateAllowGodown();

		}
	};

	$scope.CallSaveUpdateAllowGodown = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();

		var forId = 0;
		var forType = $scope.newAllowServiceType.UserWise;

		if (forType == 1)
			forId = $scope.newAllowServiceType.UserId;
		else
			forId = $scope.newAllowServiceType.GroupId;

		$http({
			method: 'POST',
			url: base_url + "Setup/Security/SaveAllowServiceType",
			headers: { 'Content-Type': undefined },

			transformRequest: function (data) {

				var formData = new FormData();
				formData.append("forId", data.id);
				formData.append("forType", data.forT);
				formData.append("jsonData", angular.toJson(data.jsonData));

				return formData;
			},
			data: { jsonData: $scope.AllowServiceTypeList, id: forId, forT: $scope.newAllowServiceType.UserWise }
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