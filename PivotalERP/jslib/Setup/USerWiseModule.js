

app.controller('AllowModuleController', function ($scope, $http, $timeout, $filter, GlobalServices) {

	$scope.Title = 'Allow Godown';

	$scope.LoadData = function () {
		$('.select2').select2({
			allowClear: true,
			openOnEnter: true
		});
		$scope.confirmMSG = GlobalServices.getConfirmMSG();
		$scope.searchData = {
			AllowModule: '',
		};

		$scope.newAllowModule = {
			AllowModuleId: null,
			UserId: null,
			GroupId: null,
			UserWise: 1,
			ForTransaction: false,
			ForReporting: false

		};

		$scope.AllowModuleList = [];
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

		//$scope.GetAllAllowModuleList();

	}

	$scope.ClearAllowModule = function () {
		$scope.newAllowModule = {
			AllowModuleId: null,
			UserId: null,
			GroupId: null,
			UserWise: 1,
			ForTransaction: false,
			ForReporting: false

		};
	}


	//************************* AllowModule *********************************


	$scope.CheckAllForTransaction = function () {
		var tmpData = $filter('filter')($scope.AllowModuleList, $scope.searchData.AllowModule);

		angular.forEach(tmpData, function (ent) {
			ent.IsAllow = $scope.newAllowModule.IsAllow;
		});
	}
	$scope.CheckAllForReporting = function () {
		var tmpData = $filter('filter')($scope.AllowModuleList, $scope.searchData.AllowModule);

		angular.forEach(tmpData, function (ent) {
			ent.IsAllow = $scope.newAllowModule.IsAllow;
		});
	}
	$scope.GetAllowModuleList = function () {

		$scope.loadingstatus = "running";
		showPleaseWait();

		var para = {
			forUserId: ($scope.newAllowModule.UserWise == 2 ? null : $scope.newAllowModule.UserId),
			forGroupId: ($scope.newAllowModule.UserWise == 1 ? null : $scope.newAllowModule.GroupId)
		};

		$http({
			method: 'POST',
			url: base_url + "Setup/Security/GetAllowModule",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.AllowModuleList = res.data.Data;
			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	};
	$scope.IsValidAllowModule = function () {

		if (!$scope.AllowModuleList || $scope.AllowModuleList.length == 0) {
			Swal.fire('Not Data Found For Save');
			return false;
		}

		return true;
	}
	$scope.SaveUpdateAllowModule = function () {
		if ($scope.IsValidAllowModule() == true) {
			if ($scope.confirmMSG.Accept == true) {
				var saveModify = $scope.newAllowModule.Mode;
				Swal.fire({
					title: 'Do you want to ' + saveModify + ' the current data?',
					showCancelButton: true,
					confirmButtonText: saveModify,
				}).then((result) => {
					/* Read more about isConfirmed, isDenied below */
					if (result.isConfirmed) {
						$scope.CallSaveUpdateAllowModule();
					}
				});
			} else
				$scope.CallSaveUpdateAllowModule();

		}
	};

	$scope.CallSaveUpdateAllowModule = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();

		var forId = 0;
		var forType = $scope.newAllowModule.UserWise;

		if (forType == 1)
			forId = $scope.newAllowModule.UserId;
		else
			forId = $scope.newAllowModule.GroupId;

		$http({
			method: 'POST',
			url: base_url + "Setup/Security/SaveAllowModules",
			headers: { 'Content-Type': undefined },

			transformRequest: function (data) {

				var formData = new FormData();
				formData.append("forId", data.id);
				formData.append("forType", data.forT);
				formData.append("jsonData", angular.toJson(data.jsonData));

				return formData;
			},
			data: { jsonData: $scope.AllowModuleList, id: forId, forT: $scope.newAllowModule.UserWise }
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