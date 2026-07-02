

app.controller('AllowCategoryController', function ($scope, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'Allow Category';

	$scope.LoadData = function () {
		$('.select2').select2({
			allowClear: true,
			openOnEnter: true
		});
		$scope.confirmMSG = GlobalServices.getConfirmMSG();
		$scope.searchData = {
			AllowCategory: '',
		};

		$scope.newAllowCategory = {
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

	$scope.ClearAllowCategory = function () {
		$scope.newAllowCategory = {
			AllowGodownId: null,
			UserId: null,
			GroupId: null,
			UserWise: 1,
			ForTransaction: false,
			ForReporting: false

		};
	}


	//************************* AllowGodown *********************************


	$scope.CheckAllForTransaction = function () {
		var tmpData = $filter('filter')($scope.AllowCategoryList, $scope.searchData.AllowCategory);

		angular.forEach(tmpData, function (ent) {
			ent.ForTransaction = $scope.newAllowCategory.ForTransaction;
		});
	}
	$scope.CheckAllForReporting = function () {
		var tmpData = $filter('filter')($scope.AllowCategoryList, $scope.searchData.AllowCategory);

		angular.forEach(tmpData, function (ent) {
			ent.ForReporting = $scope.newAllowCategory.ForReporting;
		});
	}
	$scope.GetAllowCategoryList = function () {

		$scope.loadingstatus = "running";
		showPleaseWait();

		var para = {
			forUserId: ($scope.newAllowCategory.UserWise == 2 ? null : $scope.newAllowCategory.UserId),
			forGroupId: ($scope.newAllowCategory.UserWise == 1 ? null : $scope.newAllowCategory.GroupId)
		};

		$http({
			method: 'POST',
			url: base_url + "Setup/Security/GetAllowCategory",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.AllowCategoryList = res.data.Data;
			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	};
	$scope.IsValidAllowGodown = function () {

		if (!$scope.AllowCategoryList || $scope.AllowCategoryList.length == 0) {
			Swal.fire('Not Data Found For Save');
			return false;
		}

		return true;
	}
	$scope.SaveUpdateAllowGodown = function () {
		if ($scope.IsValidAllowGodown() == true) {
			if ($scope.confirmMSG.Accept == true) {
				var saveModify = $scope.newAllowCategory.Mode;
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
		var forType = $scope.newAllowCategory.UserWise;

		if (forType == 1)
			forId = $scope.newAllowCategory.UserId;
		else
			forId = $scope.newAllowCategory.GroupId;

		$http({
			method: 'POST',
			url: base_url + "Setup/Security/SaveAllowCategory",
			headers: { 'Content-Type': undefined },

			transformRequest: function (data) {

				var formData = new FormData();
				formData.append("forId", data.id);
				formData.append("forType", data.forT);
				formData.append("jsonData", angular.toJson(data.jsonData));

				return formData;
			},
			data: { jsonData: $scope.AllowCategoryList, id: forId, forT: $scope.newAllowCategory.UserWise }
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