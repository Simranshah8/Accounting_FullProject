

app.controller('AllowGodownController', function ($scope, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'Allow Godown';

	$scope.LoadData = function () {
		$('.select2').select2({
			allowClear: true,
			openOnEnter: true
		});
		$scope.confirmMSG = GlobalServices.getConfirmMSG();
		$scope.searchData = {
			AllowGodown: '', 
		};

		$scope.newAllowGodown = {
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

	$scope.ClearAllowGodown = function () {
		$scope.newAllowGodown = {
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
		var tmpData = $filter('filter')($scope.AllowGodownList, $scope.searchData.AllowGodown);

		angular.forEach(tmpData, function (ent) {
			ent.ForTransaction = $scope.newAllowGodown.ForTransaction;
		});
	}
	$scope.CheckAllForReporting = function () {
		var tmpData = $filter('filter')($scope.AllowGodownList, $scope.searchData.AllowGodown);

		angular.forEach(tmpData, function (ent) {
			ent.ForReporting = $scope.newAllowGodown.ForReporting;
		});
	}
	$scope.GetAllowGodownList = function () {

		$scope.loadingstatus = "running";
		showPleaseWait();

		var para = {
			forUserId: ($scope.newAllowGodown.UserWise == 2 ? null : $scope.newAllowGodown.UserId),
			forGroupId: ($scope.newAllowGodown.UserWise == 1 ? null : $scope.newAllowGodown.GroupId)
		};

		$http({
			method: 'POST',
			url: base_url + "Setup/Security/GetAllowGodown",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.AllowGodownList = res.data.Data;
			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	};
	$scope.IsValidAllowGodown = function () {

		if (!$scope.AllowGodownList || $scope.AllowGodownList.length == 0) {
			Swal.fire('Not Data Found For Save');
			return false;
		}

		return true;
	}
	$scope.SaveUpdateAllowGodown = function () {
		if ($scope.IsValidAllowGodown() == true) {
			if ($scope.confirmMSG.Accept == true) {
				var saveModify = $scope.newAllowGodown.Mode;
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
		var forType = $scope.newAllowGodown.UserWise;

		if (forType == 1)
			forId = $scope.newAllowGodown.UserId;
		else
			forId = $scope.newAllowGodown.GroupId;

		$http({
			method: 'POST',
			url: base_url + "Setup/Security/SaveAllowGodown",
			headers: { 'Content-Type': undefined },

			transformRequest: function (data) {

				var formData = new FormData();
				formData.append("forId", data.id);
				formData.append("forType", data.forT);
				formData.append("jsonData", angular.toJson(data.jsonData));

				return formData;
			},
			data: { jsonData: $scope.AllowGodownList, id: forId, forT: $scope.newAllowGodown.UserWise }
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