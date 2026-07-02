

app.controller('AllowProductGroupController', function ($scope, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'Allow Godown';

	$scope.LoadData = function () {
		$('.select2').select2({
			allowClear: true,
			openOnEnter: true
		});
		$scope.confirmMSG = GlobalServices.getConfirmMSG();
		$scope.searchData = {
			AllowProductGroup: '',
		};

		$scope.newAllowProductGroup = {
			AllowProductGroupId: null,
			UserId: null,
			GroupId: null,
			UserWise: 1,
			ForTransaction: false,
			ForReporting: false

		};

		$scope.AllowProductGroupList = [];
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

		//$scope.GetAllAllowProductGroupList();

	}

	$scope.ClearAllowProductGroup = function () {
		$scope.newAllowProductGroup = {
			AllowProductGroupId: null,
			UserId: null,
			GroupId: null,
			UserWise: 1,
			ForTransaction: false,
			ForReporting: false

		};
	}


	//************************* AllowProductGroup *********************************


	$scope.CheckAllForTransaction = function () {
		var tmpData = $filter('filter')($scope.AllowProductGroupList, $scope.searchData.AllowProductGroup);

		angular.forEach(tmpData, function (ent) {
			ent.ForTransaction = $scope.newAllowProductGroup.ForTransaction;
		});
	}
	$scope.CheckAllForReporting = function () {
		var tmpData = $filter('filter')($scope.AllowProductGroupList, $scope.searchData.AllowProductGroup);

		angular.forEach(tmpData, function (ent) {
			ent.ForReporting = $scope.newAllowProductGroup.ForReporting;
		});
	}
	$scope.GetAllowProductGroupList = function () {

		$scope.loadingstatus = "running";
		showPleaseWait();

		var para = {
			forUserId: ($scope.newAllowProductGroup.UserWise == 2 ? null : $scope.newAllowProductGroup.UserId),
			forGroupId: ($scope.newAllowProductGroup.UserWise == 1 ? null : $scope.newAllowProductGroup.GroupId)
		};

		$http({
			method: 'POST',
			url: base_url + "Setup/Security/GetAllowProductGroup",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.AllowProductGroupList = res.data.Data;
			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	};
	$scope.IsValidAllowProductGroup = function () {

		if (!$scope.AllowProductGroupList || $scope.AllowProductGroupList.length == 0) {
			Swal.fire('Not Data Found For Save');
			return false;
		}

		return true;
	}
	$scope.SaveUpdateAllowProductGroup = function () {
		if ($scope.IsValidAllowProductGroup() == true) {
			if ($scope.confirmMSG.Accept == true) {
				var saveModify = $scope.newAllowProductGroup.Mode;
				Swal.fire({
					title: 'Do you want to ' + saveModify + ' the current data?',
					showCancelButton: true,
					confirmButtonText: saveModify,
				}).then((result) => {
					/* Read more about isConfirmed, isDenied below */
					if (result.isConfirmed) {
						$scope.CallSaveUpdateAllowProductGroup();
					}
				});
			} else
				$scope.CallSaveUpdateAllowProductGroup();

		}
	};

	$scope.CallSaveUpdateAllowProductGroup = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();

		var forId = 0;
		var forType = $scope.newAllowProductGroup.UserWise;

		if (forType == 1)
			forId = $scope.newAllowProductGroup.UserId;
		else
			forId = $scope.newAllowProductGroup.GroupId;

		$http({
			method: 'POST',
			url: base_url + "Setup/Security/SaveAllowProductGroup",
			headers: { 'Content-Type': undefined },

			transformRequest: function (data) {

				var formData = new FormData();
				formData.append("forId", data.id);
				formData.append("forType", data.forT);
				formData.append("jsonData", angular.toJson(data.jsonData));

				return formData;
			},
			data: { jsonData: $scope.AllowProductGroupList, id: forId, forT: $scope.newAllowProductGroup.UserWise }
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