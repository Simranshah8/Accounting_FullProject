

app.controller('AllowVoucherController', function ($scope, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'Allow Voucher';

	$scope.LoadData = function () {
		$('.select2').select2({
			allowClear: true,
			openOnEnter: true
		});
		$scope.confirmMSG = GlobalServices.getConfirmMSG();
		$scope.searchData = {
			AllowVoucher: '',

		};
		 
		$scope.perPageColl = GlobalServices.getPerPageList();

		$scope.currentPages = {
			AllowVoucher: 1
		};
		$scope.perPage = {
			AllowVoucher: 40,
		};
		$scope.newAllowVoucher = {
			AllowVoucherId: null,
			UserId: null,
			GroupId: null,
			UserWise: 1,
			ForTransaction: false,
			ForReporting:false,
			ForAutoPost:false,
		};

		$scope.AllowVoucherList = [];
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

		//$scope.GetAllAllowVoucherList();

	}

	$scope.ClearAllowVoucher = function () {
		$scope.newAllowVoucher = {
			AllowVoucherId: null,
			UserId: null,
			GroupId: null,
			UserWise: 1,
			ForTransaction: false,
			ForReporting: false

		};
	}


	//************************* AllowVoucher *********************************

	
	$scope.CheckAllForTransaction = function () {
		var tmpData = $filter('filter')($scope.AllowVoucherList, $scope.searchData.AllowVoucher);

		angular.forEach(tmpData, function (ent) {
			ent.ForTransaction = $scope.newAllowVoucher.ForTransaction;
		});
	}
	$scope.CheckAllForReporting = function () {
		var tmpData = $filter('filter')($scope.AllowVoucherList, $scope.searchData.AllowVoucher);

		angular.forEach(tmpData, function (ent) {
			ent.ForReporting = $scope.newAllowVoucher.ForReporting;
		});
	}
	$scope.CheckAllForAutoPost = function () {
		var tmpData = $filter('filter')($scope.AllowVoucherList, $scope.searchData.AllowVoucher);

		angular.forEach(tmpData, function (ent) {
			ent.ForAutoPost = $scope.newAllowVoucher.ForAutoPost;
		});
	}
	$scope.GetAllowVoucherList = function () {

		$scope.loadingstatus = "running";
		showPleaseWait();

		var para = {
			forUserId: ($scope.newAllowVoucher.UserWise == 2 ? null : $scope.newAllowVoucher.UserId),
			forGroupId: ($scope.newAllowVoucher.UserWise == 1 ? null : $scope.newAllowVoucher.GroupId)
		};

		$http({
			method: 'POST',
			url: base_url + "Setup/Security/GetAllowVoucher",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.AllowVoucherList = res.data.Data;
			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	};
	$scope.IsValidAllowVoucher = function () {

		if (!$scope.AllowVoucherList || $scope.AllowVoucherList.length == 0) {
			Swal.fire('Not Data Found For Save');
			return false;
		}

		return true;
	}
	$scope.SaveUpdateAllowVoucher = function () {
		if ($scope.IsValidAllowVoucher() == true) {
			if ($scope.confirmMSG.Accept == true) {
				var saveModify = $scope.newAllowVoucher.Mode;
				Swal.fire({
					title: 'Do you want to ' + saveModify + ' the current data?',
					showCancelButton: true,
					confirmButtonText: saveModify,
				}).then((result) => {
					/* Read more about isConfirmed, isDenied below */
					if (result.isConfirmed) {
						$scope.CallSaveUpdateAllowVoucher();
					}
				});
			} else
				$scope.CallSaveUpdateAllowVoucher();

		}
	};

	$scope.CallSaveUpdateAllowVoucher = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();

		var forId = 0;
		var forType = $scope.newAllowVoucher.UserWise;

		if (forType == 1)
			forId = $scope.newAllowVoucher.UserId;
		else
			forId = $scope.newAllowVoucher.GroupId;

		$http({
			method: 'POST',
			url: base_url + "Setup/Security/SaveAllowVoucher",
			headers: { 'Content-Type': undefined },

			transformRequest: function (data) {

				var formData = new FormData();
				formData.append("forId", data.id);
				formData.append("forType", data.forT);
				formData.append("jsonData", angular.toJson(data.jsonData));

				return formData;
			},
			data: { jsonData: $scope.AllowVoucherList, id: forId, forT: $scope.newAllowVoucher.UserWise }
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