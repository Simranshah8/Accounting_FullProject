

app.controller('UserBranchCTRL', function ($scope, $http, $timeout, $filter, GlobalServices) {
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

	$scope.CheckAllForMaster = function () {
		var tmpData = $filter('filter')($scope.AllowLedgerGroupList, $scope.searchData.AllowLedgerGroup);

		angular.forEach(tmpData, function (ent) {
			ent.ForMaster = $scope.newAllowLedgerGroup.ForMaster;
		});
	}
	$scope.CheckAllForTransaction = function () {
		var tmpData = $filter('filter')($scope.AllowLedgerGroupList, $scope.searchData.AllowLedgerGroup);

		angular.forEach(tmpData, function (ent) {
			ent.ForTran = $scope.newAllowLedgerGroup.ForTran;
		});
	}
	$scope.CheckAllForReporting = function () {
		var tmpData = $filter('filter')($scope.AllowLedgerGroupList, $scope.searchData.AllowLedgerGroup);

		angular.forEach(tmpData, function (ent) {
			ent.ForReport = $scope.newAllowLedgerGroup.ForReport;
		});
	}
	$scope.GetAllowLedgerGroupList = function () {

		$scope.loadingstatus = "running";
		showPleaseWait();

		var para = {
			forUserId:  $scope.newAllowLedgerGroup.UserId
		};

		$http({
			method: 'POST',
			url: base_url + "Setup/Security/GetUserBranch",
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

		var forId =  $scope.newAllowLedgerGroup.UserId;
	 

		$http({
			method: 'POST',
			url: base_url + "Setup/Security/SaveUserBranch",
			headers: { 'Content-Type': undefined },

			transformRequest: function (data) {

				var formData = new FormData();
				formData.append("forId", data.id);				
				formData.append("jsonData", angular.toJson(data.jsonData));

				return formData;
			},
			data: { jsonData: $scope.AllowLedgerGroupList, id: forId }
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