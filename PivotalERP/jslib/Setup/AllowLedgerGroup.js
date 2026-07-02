

app.controller('AllowLedgerGroupController', function ($scope, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'Allow Godown';

	$scope.LoadData = function () {
		$('.select2').select2({
			allowClear: true,
			openOnEnter: true
		});
		$scope.confirmMSG = GlobalServices.getConfirmMSG();
		$scope.searchData = {
			AllowLedgerGroup: '',
		};

		$scope.newAllowLedgerGroup = {
			AllowLedgerGroupId: null,
			UserId: null,
			GroupId: null,
			UserWise: 1,
			ForTransaction: false,
			ForReporting: false

		};

		$scope.AllowLedgerGroupList = [];
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

		//$scope.GetAllAllowLedgerGroupList();

	}

	$scope.ClearAllowLedgerGroup = function () {
		$scope.newAllowLedgerGroup = {
			AllowLedgerGroupId: null,
			UserId: null,
			GroupId: null,
			UserWise: 1,
			ForTransaction: false,
			ForReporting: false

		};
	}


	//************************* AllowLedgerGroup *********************************


	$scope.CheckAllForTransaction = function () {
		var tmpData = $filter('filter')($scope.AllowLedgerGroupList, $scope.searchData.AllowLedgerGroup);

		angular.forEach(tmpData, function (ent) {
			ent.ForTransaction = $scope.newAllowLedgerGroup.ForTransaction;
		});
	}
	$scope.CheckAllForReporting = function () {
		var tmpData = $filter('filter')($scope.AllowLedgerGroupList, $scope.searchData.AllowLedgerGroup);

		angular.forEach(tmpData, function (ent) {
			ent.ForReporting = $scope.newAllowLedgerGroup.ForReporting;
		});
	}
	$scope.GetAllowLedgerGroupList = function () {

		$scope.loadingstatus = "running";
		showPleaseWait();

		var para = {
			forUserId: ($scope.newAllowLedgerGroup.UserWise == 2 ? null : $scope.newAllowLedgerGroup.UserId),
			forGroupId: ($scope.newAllowLedgerGroup.UserWise == 1 ? null : $scope.newAllowLedgerGroup.GroupId)
		};

		$http({
			method: 'POST',
			url: base_url + "Setup/Security/GetAllowLedgerGroup",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.AllowLedgerGroupList = res.data.Data;
			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	};
	$scope.IsValidAllowLedgerGroup = function () {

		if (!$scope.AllowLedgerGroupList || $scope.AllowLedgerGroupList.length == 0) {
			Swal.fire('Not Data Found For Save');
			return false;
		}

		return true;
	}
	$scope.SaveUpdateAllowLedgerGroup = function () {
		if ($scope.IsValidAllowLedgerGroup() == true) {
			if ($scope.confirmMSG.Accept == true) {
				var saveModify = $scope.newAllowLedgerGroup.Mode;
				Swal.fire({
					title: 'Do you want to ' + saveModify + ' the current data?',
					showCancelButton: true,
					confirmButtonText: saveModify,
				}).then((result) => {
					/* Read more about isConfirmed, isDenied below */
					if (result.isConfirmed) {
						$scope.CallSaveUpdateAllowLedgerGroup();
					}
				});
			} else
				$scope.CallSaveUpdateAllowLedgerGroup();

		}
	};

	$scope.CallSaveUpdateAllowLedgerGroup = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();

		var forId = 0;
		var forType = $scope.newAllowLedgerGroup.UserWise;

		if (forType == 1)
			forId = $scope.newAllowLedgerGroup.UserId;
		else
			forId = $scope.newAllowLedgerGroup.GroupId;

		$http({
			method: 'POST',
			url: base_url + "Setup/Security/SaveAllowLedgerGroup",
			headers: { 'Content-Type': undefined },

			transformRequest: function (data) {

				var formData = new FormData();
				formData.append("forId", data.id);
				formData.append("forType", data.forT);
				formData.append("jsonData", angular.toJson(data.jsonData));

				return formData;
			},
			data: { jsonData: $scope.AllowLedgerGroupList, id: forId, forT: $scope.newAllowLedgerGroup.UserWise }
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