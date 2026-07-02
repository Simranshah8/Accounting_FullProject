

app.controller('AllowCostClassController', function ($scope, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'Allow Godown';

	$scope.LoadData = function () {
		$('.select2').select2({
			allowClear: true,
			openOnEnter: true
		});
		$scope.confirmMSG = GlobalServices.getConfirmMSG();
		$scope.searchData = {
			AllowCostClass: '',
		};

		$scope.newAllowCostClass = {
			AllowCostClassId: null,
			UserId: null,
			GroupId: null,
			UserWise: 1,
			ForTransaction: false,
			ForReporting: false

		};

		$scope.AllowCostClassList = [];
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

		//$scope.GetAllAllowCostClassList();

	}

	$scope.ClearAllowCostClass = function () {
		$scope.newAllowCostClass = {
			AllowCostClassId: null,
			UserId: null,
			GroupId: null,
			UserWise: 1,
			ForTransaction: false,
			ForReporting: false

		};
	}


	//************************* AllowCostClass *********************************


	$scope.CheckAllForTransaction = function () {
		var tmpData = $filter('filter')($scope.AllowCostClassList, $scope.searchData.AllowCostClass);

		angular.forEach(tmpData, function (ent) {
			ent.IsAllow = $scope.newAllowCostClass.IsAllow;
		});
	}

	$scope.CheckAllForTransaction = function () {
		var tmpData = $filter('filter')($scope.AllowCostClassList, $scope.searchData.AllowCostClass);

		angular.forEach(tmpData, function (ent) {
			ent.ForEntry = $scope.newAllowCostClass.ForEntry;
		});
	}
	$scope.GetAllowCostClassList = function () {

		$scope.loadingstatus = "running";
		showPleaseWait();

		$scope.newAllowCostClass.IsAllow = false;

		var para = {
			forUserId: ($scope.newAllowCostClass.UserWise == 2 ? null : $scope.newAllowCostClass.UserId),
			forGroupId: ($scope.newAllowCostClass.UserWise == 1 ? null : $scope.newAllowCostClass.GroupId)
		};

		$http({
			method: 'POST',
			url: base_url + "Setup/Security/GetAllowCostClass",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.AllowCostClassList = res.data.Data;
			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	};
	$scope.IsValidAllowCostClass = function () {

		if (!$scope.AllowCostClassList || $scope.AllowCostClassList.length == 0) {
			Swal.fire('Not Data Found For Save');
			return false;
		}

		return true;
	}
	$scope.SaveUpdateAllowCostClass = function () {
		if ($scope.IsValidAllowCostClass() == true) {
			if ($scope.confirmMSG.Accept == true) {
				var saveModify = $scope.newAllowCostClass.Mode;
				Swal.fire({
					title: 'Do you want to ' + saveModify + ' the current data?',
					showCancelButton: true,
					confirmButtonText: saveModify,
				}).then((result) => {
					/* Read more about isConfirmed, isDenied below */
					if (result.isConfirmed) {
						$scope.CallSaveUpdateAllowCostClass();
					}
				});
			} else
				$scope.CallSaveUpdateAllowCostClass();

		}
	};

	$scope.CallSaveUpdateAllowCostClass = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();

		var forId = 0;
		var forType = $scope.newAllowCostClass.UserWise;

		if (forType == 1)
			forId = $scope.newAllowCostClass.UserId;
		else
			forId = $scope.newAllowCostClass.GroupId;

		$http({
			method: 'POST',
			url: base_url + "Setup/Security/SaveAllowCostClass",
			headers: { 'Content-Type': undefined },

			transformRequest: function (data) {

				var formData = new FormData();
				formData.append("forId", data.id);
				formData.append("forType", data.forT);
				formData.append("jsonData", angular.toJson(data.jsonData));

				return formData;
			},
			data: { jsonData: $scope.AllowCostClassList, id: forId, forT: $scope.newAllowCostClass.UserWise }
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