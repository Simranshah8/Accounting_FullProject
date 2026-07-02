

app.controller('AllowCostCategoryController', function ($scope, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'Allow Godown';

	$scope.LoadData = function () {
		$('.select2').select2({
			allowClear: true,
			openOnEnter: true
		});
		$scope.confirmMSG = GlobalServices.getConfirmMSG();
		$scope.searchData = {
			AllowCostCategory: '',
		};

		$scope.newAllowCostCategory = {
			AllowCostCategoryId: null,
			UserId: null,
			GroupId: null,
			UserWise: 1,
			ForTransaction: false,
			ForReporting: false

		};

		$scope.AllowCostCategoryList = [];
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

		//$scope.GetAllAllowCostCategoryList();

	}

	$scope.ClearAllowCostCategory = function () {
		$scope.newAllowCostCategory = {
			AllowCostCategoryId: null,
			UserId: null,
			GroupId: null,
			UserWise: 1,
			ForTransaction: false,
			ForReporting: false

		};
	}


	//************************* AllowCostCategory *********************************


	$scope.CheckAllForTransaction = function () {
		var tmpData = $filter('filter')($scope.AllowCostCategoryList, $scope.searchData.AllowCostCategory);

		angular.forEach(tmpData, function (ent) {
			ent.ForTransaction = $scope.newAllowCostCategory.ForTransaction;
		});
	}
	$scope.CheckAllForReporting = function () {
		var tmpData = $filter('filter')($scope.AllowCostCategoryList, $scope.searchData.AllowCostCategory);

		angular.forEach(tmpData, function (ent) {
			ent.ForReporting = $scope.newAllowCostCategory.ForReporting;
		});
	}
	$scope.GetAllowCostCategoryList = function () {

		$scope.loadingstatus = "running";
		showPleaseWait();

		var para = {
			forUserId: ($scope.newAllowCostCategory.UserWise == 2 ? null : $scope.newAllowCostCategory.UserId),
			forGroupId: ($scope.newAllowCostCategory.UserWise == 1 ? null : $scope.newAllowCostCategory.GroupId)
		};

		$http({
			method: 'POST',
			url: base_url + "Setup/Security/GetAllowCostCategory",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.AllowCostCategoryList = res.data.Data;
			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	};
	$scope.IsValidAllowCostCategory = function () {

		if (!$scope.AllowCostCategoryList || $scope.AllowCostCategoryList.length == 0) {
			Swal.fire('Not Data Found For Save');
			return false;
		}

		return true;
	}
	$scope.SaveUpdateAllowCostCategory = function () {
		if ($scope.IsValidAllowCostCategory() == true) {
			if ($scope.confirmMSG.Accept == true) {
				var saveModify = $scope.newAllowCostCategory.Mode;
				Swal.fire({
					title: 'Do you want to ' + saveModify + ' the current data?',
					showCancelButton: true,
					confirmButtonText: saveModify,
				}).then((result) => {
					/* Read more about isConfirmed, isDenied below */
					if (result.isConfirmed) {
						$scope.CallSaveUpdateAllowCostCategory();
					}
				});
			} else
				$scope.CallSaveUpdateAllowCostCategory();

		}
	};

	$scope.CallSaveUpdateAllowCostCategory = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();

		var forId = 0;
		var forType = $scope.newAllowCostCategory.UserWise;

		if (forType == 1)
			forId = $scope.newAllowCostCategory.UserId;
		else
			forId = $scope.newAllowCostCategory.GroupId;

		$http({
			method: 'POST',
			url: base_url + "Setup/Security/SaveAllowCostCategory",
			headers: { 'Content-Type': undefined },

			transformRequest: function (data) {

				var formData = new FormData();
				formData.append("forId", data.id);
				formData.append("forType", data.forT);
				formData.append("jsonData", angular.toJson(data.jsonData));

				return formData;
			},
			data: { jsonData: $scope.AllowCostCategoryList, id: forId, forT: $scope.newAllowCostCategory.UserWise }
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