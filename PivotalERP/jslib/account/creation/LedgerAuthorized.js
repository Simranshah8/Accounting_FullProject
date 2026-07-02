app.controller('LedgerAuthorized', function ($scope, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'Ledger Authorized';
	$scope.LoadData = function () {
		$('.select2').select2({
			//allowClear: true,
			//openOnEnter: true
		});

		$scope.BranchList = [];
		$http({
			method: 'GET',
			url: base_url + "Setup/Security/GetAllBranchList",
			dataType: "json"
		}).then(function (res) {
			if (res.data.IsSuccess && res.data.Data) {
				$scope.BranchList = res.data.Data;
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

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

		
		$scope.beData ={
			LedgerId: null,
			BranchId: null,
			UserId1: null,
			UserId2: null,
			UserId3: null,
			LimitAmt: 0,
			UsedAmt: 0,
			BalanceAmt: 0,
			LimitAmt_Monthly: 0,
			UsedAmt_Monthly: 0,
			BalanceAmt_Monthly: 0,
			LedgerAuthorizedColl: []
		};
		$scope.beData.LedgerAuthorizedColl.push({});
	}


	$scope.resetLedgerAuthorized = function () {
		$scope.beData =
		{
			LedgerId: null,
			BranchId: null,
			UserId1: null,
			UserId2: null,
			UserId3: null,
			LimitAmt: 0,
			UsedAmt: 0,
			BalanceAmt: 0,
			LimitAmt_Monthly: 0,
			UsedAmt_Monthly: 0,
			BalanceAmt_Monthly: 0,
			LedgerAuthorizedColl: []

		};
		$scope.beData.LedgerAuthorizedColl.push({});
	}
	$scope.AddData = function (ind) {
		if ($scope.beData.LedgerAuthorizedColl) {
			if ($scope.beData.LedgerAuthorizedColl.length > ind + 1) {
				$scope.beData.LedgerAuthorizedColl.splice(ind + 1, 0, {
					LimitAmt: 0
				});
			} else {
				$scope.beData.LedgerAuthorizedColl.push({
					LimitAmt: 0
				});
			}
		}
	};

	$scope.DelData = function (ind) {
		if ($scope.beData.LedgerAuthorizedColl) {
			if ($scope.beData.LedgerAuthorizedColl.length > 1) {
				$scope.beData.LedgerAuthorizedColl.splice(ind, 1);
			}
		}
	};



	$scope.SaveUpdateLedgerAuthorized = function () {
		if (!$scope.beData.LedgerId || $scope.beData.LedgerId <= 0) {
			Swal.fire("Please select Ledger first.");
			return;
		}
		$scope.loadingstatus = "running";
		showPleaseWait();
		var ledgerId = $scope.beData.LedgerId;
		var dataToSave = [];
		for (var i = 0; i < $scope.beData.LedgerAuthorizedColl.length; i++) {
			var S = $scope.beData.LedgerAuthorizedColl[i];
			if (!S.BranchId || S.BranchId <= 0) {
				hidePleaseWait();
				$scope.loadingstatus = "stop";
				Swal.fire("Please select Branch in row " + (i + 1));
				return;
			}

			var duplicate = dataToSave.find(function (item) {
				return item.BranchId === S.BranchId && item.LedgerId === ledgerId;
			});

			if (duplicate) {
				hidePleaseWait();
				$scope.loadingstatus = "stop";
				Swal.fire("Duplicate Branch found in row " + (i + 1));
				return;
			}
			var dataItem = {
				TranId: S.TranId,
				BranchId: S.BranchId,
				UserId1: S.UserId1,
				UserId2: S.UserId2,
				UserId3: S.UserId3,
				limitAmt: S.LimitAmt,
				UsedAmt: S.UsedAmt,
				BalanceAmt: S.BalanceAmt,
				LimitAmt_Monthly: S.LimitAmt_Monthly,
				UsedAmt_Monthly: S.UsedAmt_Monthly,
				BalanceAmt_Monthly: S.BalanceAmt_Monthly,
				LedgerId: ledgerId
			};
			dataToSave.push(dataItem);
		}
		$http({
			method: 'POST',
			url: base_url + "Account/Creation/SaveLedgerAuthorized",
			headers: { 'Content-Type': undefined },
			transformRequest: function (data) {
				var formData = new FormData();
				formData.append("jsonData", angular.toJson(data.jsonData));
				return formData;
			},
			data: { jsonData: dataToSave }
		}).then(function (res) {
			$scope.loadingstatus = "stop";
			hidePleaseWait();
			Swal.fire(res.data.ResponseMSG);
			if (res.data.IsSuccess == true) {
				$scope.resetLedgerAuthorized();
			}
		}, function () {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
		});
	};


	$scope.GetLederWiseAuthorized = function (resData) {
		$scope.beData.LedgerAuthorizedColl = [];
		if (resData && resData.LedgerId != null) {
			$scope.loadingstatus = "running";
			showPleaseWait();
			var para = {
				LedgerId: resData.LedgerId
			};
			$http({
				method: 'POST',
				url: base_url + "Account/Creation/GetLedgerAuthorized",
				dataType: "json",
				data: JSON.stringify(para)
			}).then(function (res) {
				hidePleaseWait();
				$scope.loadingstatus = "stop";
				if (res.data.IsSuccess && res.data.Data) {
					$scope.beData.LedgerAuthorizedColl = res.data.Data;
					if (!$scope.beData.LedgerAuthorizedColl || $scope.beData.LedgerAuthorizedColl.length == 0) {
						$scope.beData.LedgerAuthorizedColl = [];
						$scope.beData.LedgerAuthorizedColl.push({});
					}
				} else {
					Swal.fire(res.data.ResponseMSG);
				}
			}, function (reason) {
				Swal.fire('Failed' + reason);
			});
		}
	}
});