

app.controller('AllowDepartmentController', function ($scope, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'Allow Department';

	$scope.LoadData = function () {
		$('.select2').select2({
			allowClear: true,
			openOnEnter: true
		});
		$scope.confirmMSG = GlobalServices.getConfirmMSG();
		$scope.searchData = {
			AllowDepartment: '',
		};

		$scope.newAllowDepartment = {
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

	$scope.ClearAllowDepartment = function () {
		$scope.newAllowDepartment = {
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
		var tmpData = $filter('filter')($scope.AllowDepartmentList, $scope.searchData.AllowDepartment);

		angular.forEach(tmpData, function (ent) {
			ent.ForTransaction = $scope.newAllowDepartment.ForTransaction;
		});
	}
	$scope.CheckAllForReporting = function () {
		var tmpData = $filter('filter')($scope.AllowDepartmentList, $scope.searchData.AllowDepartment);

		angular.forEach(tmpData, function (ent) {
			ent.ForReporting = $scope.newAllowDepartment.ForReporting;
		});
	}
	$scope.GetAllowDepartmentList = function () {

		$scope.loadingstatus = "running";
		showPleaseWait();

		var para = {
			forUserId: ($scope.newAllowDepartment.UserWise == 2 ? null : $scope.newAllowDepartment.UserId),
			forGroupId: ($scope.newAllowDepartment.UserWise == 1 ? null : $scope.newAllowDepartment.GroupId)
		};

		$http({
			method: 'POST',
			url: base_url + "Setup/Security/GetAllowDepartment",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.AllowDepartmentList = res.data.Data;
			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	};
	$scope.IsValidAllowGodown = function () {

		if (!$scope.AllowDepartmentList || $scope.AllowDepartmentList.length == 0) {
			Swal.fire('Not Data Found For Save');
			return false;
		}

		return true;
	}
	$scope.SaveUpdateAllowGodown = function () {
		if ($scope.IsValidAllowGodown() == true) {
			if ($scope.confirmMSG.Accept == true) {
				var saveModify = $scope.newAllowDepartment.Mode;
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
		var forType = $scope.newAllowDepartment.UserWise;

		if (forType == 1)
			forId = $scope.newAllowDepartment.UserId;
		else
			forId = $scope.newAllowDepartment.GroupId;

		$http({
			method: 'POST',
			url: base_url + "Setup/Security/SaveAllowDepartment",
			headers: { 'Content-Type': undefined },

			transformRequest: function (data) {

				var formData = new FormData();
				formData.append("forId", data.id);
				formData.append("forType", data.forT);
				formData.append("jsonData", angular.toJson(data.jsonData));

				return formData;
			},
			data: { jsonData: $scope.AllowDepartmentList, id: forId, forT: $scope.newAllowDepartment.UserWise }
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