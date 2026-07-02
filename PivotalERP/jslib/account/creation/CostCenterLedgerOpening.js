app.controller('CostCenterLedgerOpeningController', function ($scope, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'BranchWise Ledger Opening';


	$scope.LoadData = function () {

		$('.select2').select2({
			allowClear: true,
			openOnEnter: true
		});
		$scope.confirmMSG = GlobalServices.getConfirmMSG();
		$scope.perPageColl = GlobalServices.getPerPageList();
		$scope.DrCrList = GlobalServices.getDrCr();

		$timeout(function () {
			$http({
				method: "GET",
				url: base_url + "Global/GetCompanyDetail",
				dataType: "json"
			}).then(function (res) {
				$scope.CompDet = res.data.Data;
				$scope.newBranchWiseLedgerOpening.VoucherDate_TMP = new Date($scope.CompDet.StartDate);
			}, function (errormessage) {
				alert('Unable to Delete data. pls try again.' + errormessage.responseText);
			});
		});

		$timeout(function () {
			$scope.BranchList = [];
			$http({
				method: 'POST',
				url: base_url + "Setup/Security/GetAllBranchList",
				dataType: "json"
			}).then(function (res) {
				if (res.data.IsSuccess && res.data.Data) {
					$scope.BranchList = res.data.Data;
				}
			}, function (reason) {
				Swal.fire('Failed' + reason);
			});
		});

		$timeout(function () {
			$scope.CurrencyList = [];
			$http({
				method: 'GET',
				url: base_url + "Account/Creation/GetAllCurrencyList",
				dataType: "json"
			}).then(function (res) {
				if (res.data.IsSuccess && res.data.Data) {
					$scope.CurrencyList = res.data.Data;
				}
			}, function (reason) {
				Swal.fire('Failed' + reason);
			});
		});
		$timeout(function () {
			$scope.LedgerGroupList = [];
			$http({
				method: 'GET',
				url: base_url + "Account/Creation/GetAllLedgerGroupList",
				dataType: "json"
			}).then(function (res) {
				hidePleaseWait();
				$scope.loadingstatus = "stop";
				if (res.data.IsSuccess && res.data.Data) {
					$scope.LedgerGroupList = res.data.Data;
				}
			}, function (reason) {
				Swal.fire('Failed' + reason);
			});
		});


		$scope.CostClassColl = [];
		$timeout(function () {
			$http({
				method: "GET",
				url: base_url + "Account/Creation/GetCostClassForEntry",
				dataType: "json"
			}).then(function (res) {
				$scope.CostClassColl = res.data.Data;
			}, function (errormessage) {
				alert('Unable to Delete data. pls try again.' + errormessage.responseText);
			});
		});

		$timeout(function () {
			$scope.newBranchWiseLedgerOpening = {
				BranchWiseLedgerOpeningId: null,
				BranchId: 1,
				LedgerGroupId: null,
				CurrencyId: 1,
				CurRate: 1,
				SelectedCurrency: null,
				NY: 0,
				NM: 0,
				ND: 0,
				VoucherDate: null,
				VoucherDate_TMP: null,
				OpeningColl: [],
				Mode: 'Save'
			};
			$scope.newBranchWiseLedgerOpening.OpeningColl.push({
				DrCr: 1
			});
		});


		//$scope.GetAllBranchWiseLedgerOpeningList();

	}

	$scope.ChangeCostClass = function () {
		var costClassId = $scope.newBranchWiseLedgerOpening.CostClassId;
		var findCC = mx($scope.CostClassColl).firstOrDefault(p1 => p1.CostClassId == costClassId);
		if (findCC) {

			if (findCC.StartDate) {
				$scope.newBranchWiseLedgerOpening.VoucherDate = new Date(findCC.StartDate);
				$scope.newBranchWiseLedgerOpening.VoucherDate_TMP = new Date(findCC.StartDate);
			} else {
				$scope.newBranchWiseLedgerOpening.VoucherDate = null;
				$scope.newBranchWiseLedgerOpening.VoucherDate_TMP = null;
				Swal.fire('Please ! Update Year Start Date and EndDate')
			}
		}
	};

	$scope.ChangeParticularLedger = function (led) {

		var costClassId = $scope.newBranchWiseLedgerOpening.CostClassId;
		var findCC = mx($scope.CostClassColl).firstOrDefault(p1 => p1.CostClassId == costClassId);
		if (findCC) {

			if (findCC.StartDate) {
				$scope.newBranchWiseLedgerOpening.VoucherDate = new Date(findCC.StartDate);
				$scope.newBranchWiseLedgerOpening.VoucherDate_TMP = new Date(findCC.StartDate);
			} else {
				$scope.newBranchWiseLedgerOpening.VoucherDate = null;
				$scope.newBranchWiseLedgerOpening.VoucherDate_TMP = null;
				Swal.fire('Please ! Update Year Start Date and EndDate');
				return;
			}
		} else {
			Swal.fire('Please ! Select Year');
			return;
		}

		if (led.CostCenterDetails && led.CostCenterId && $scope.newBranchWiseLedgerOpening.LedgerDetails) {
			var voucherDate = new Date();
			if ($scope.newBranchWiseLedgerOpening.VoucherDateDet)
				voucherDate = $filter('date')(new Date($scope.newBranchWiseLedgerOpening.VoucherDateDet.dateAD), 'yyyy-MM-dd');

			var para = {
				BranchId: $scope.newBranchWiseLedgerOpening.BranchId,
				LedgerId: $scope.newBranchWiseLedgerOpening.LedgerId,
				CostCenterId:led.CostCenterId,
				voucherDate: voucherDate
			};
			$http({
				method: 'POST',
				url: base_url + "Account/Creation/GetCostCenterLedgerOpening",
				dataType: "json",
				data: JSON.stringify(para)
			}).then(function (res) {
				if (res.data.IsSuccess && res.data.Data) {
					$timeout(function () {
						var openingDet = res.data.Data;
						led.OpeningId = openingDet.OpeningId;
						led.OpeningAmount = openingDet.OpeningAmount;
						led.DrCr = openingDet.DrCr;
						led.CostClassId = costClassId;
						$scope.ChangeDrCrAmount();
					});

				}
			}, function (reason) {
				Swal.fire('Failed' + reason);
			});


		} else {
			led.OpeningId = 0;
			led.OpeningAmount = 0;
			led.DrCr = 1;

			$scope.ChangeDrCrAmount();
		}
	};
	$scope.ChangeDrCrAmount = function () {

		var totalDr = 0, totalCr = 0;
		angular.forEach($scope.newBranchWiseLedgerOpening.OpeningColl, function (op) {
			if (op.CostCenterId || op.CostCenterId > 0) {
				if (op.OpeningAmount && op.DrCr == 1) {
					totalDr += parseFloat(op.OpeningAmount);
				}
				else if (op.OpeningAmount && op.DrCr == 2) {
					totalCr += parseFloat(op.OpeningAmount);
				}
			}
		});

		$scope.newBranchWiseLedgerOpening.TotalDr = totalDr;
		$scope.newBranchWiseLedgerOpening.TotalCr = totalCr;

	};

	$scope.AddRowInOpening = function (ind) {

		if ($scope.newBranchWiseLedgerOpening.OpeningColl) {
			if ($scope.newBranchWiseLedgerOpening.OpeningColl.length > ind + 1) {

				var selectItem = $scope.newBranchWiseLedgerOpening.OpeningColl[ind + 1];
				if (!selectItem.CostCenterId || selectItem.CostCenterId == null || selectItem.CostCenterId == 0 || selectItem.OpeningAmount == 0)
					return;

				$scope.newBranchWiseLedgerOpening.OpeningColl.splice(ind + 1, 0, {
					DrCr: 1,
					LedgerId: 0,
					CostCenterId:0,
					AgentId: 0,
					OpeningAmount:0,
				});
			}
			else if ($scope.newBranchWiseLedgerOpening.OpeningColl.length == (ind + 1)) {
				var selectItem = $scope.newBranchWiseLedgerOpening.OpeningColl[ind];
				if (!selectItem.CostCenterId || selectItem.CostCenterId == null || selectItem.CostCenterId == 0 || selectItem.OpeningAmount == 0)
					return;

				$scope.newBranchWiseLedgerOpening.OpeningColl.push({
					DrCr: 1,
					LedgerId: 0,
					AgentId: 0,
					CostCenterId: 0,
					OpeningAmount:0,
				});
			}
			else {
				$scope.newBranchWiseLedgerOpening.OpeningColl.push({
					DrCr: 1,
					LedgerId: 0,
					CostCenterId: 0,
					AgentId: 0,
					OpeningAmount:0
				});
			}

		}
		$scope.ChangeDrCrAmount();

	}

	$scope.delRowOpening = function (ind) {
		if ($scope.newBranchWiseLedgerOpening.OpeningColl) {
			if ($scope.newBranchWiseLedgerOpening.OpeningColl.length > 1) {
				$scope.newBranchWiseLedgerOpening.OpeningColl.splice(ind, 1);
				$scope.ChangeDrCrAmount();
			}
		}
	}

	$scope.ClearBranchWiseLedgerOpening = function () {
		$timeout(function () {
			$scope.newBranchWiseLedgerOpening = {
				BranchWiseLedgerOpeningId: null,
				BranchId: 1,
				LedgerGroupId: null,
				CurrencyId: 1,
				CurRate: 1,
				SelectedCurrency: null,
				NY: 0,
				NM: 0,
				ND: 0,
				VoucherDate: null,
				VoucherDate_TMP: null,
				OpeningColl: [],
				Mode: 'Save'
			};
			$scope.newBranchWiseLedgerOpening.OpeningColl.push({
				DrCr: 1
			});
			$scope.newBranchWiseLedgerOpening.VoucherDate_TMP = new Date($scope.CompDet.StartDate);
			$scope.ChangeDrCrAmount();
		});
	}


	//************************* BranchWiseLedgerOpening *********************************

	$scope.IsValidBranchWiseLedgerOpening = function () {
		if (!$scope.newBranchWiseLedgerOpening.BranchId) {
			Swal.fire('Please ! Select Branch Name');
			return false;
		}

		if (!$scope.newBranchWiseLedgerOpening.SelectedCurrency) {
			Swal.fire('Please ! Select Currency Name');
			return false;
		}

		if (!$scope.newBranchWiseLedgerOpening.VoucherDateDet) {
			Swal.fire('Please ! Select Opening Date');
			return false;
		}

		return true;
	}

	$scope.SaveUpdateBranchWiseLedgerOpening = function () {
		if ($scope.IsValidBranchWiseLedgerOpening() == true) {
			if ($scope.confirmMSG.Accept == true) {
				var saveModify = $scope.newBranchWiseLedgerOpening.Mode;
				Swal.fire({
					title: 'Do you want to ' + saveModify + ' the current data?',
					showCancelButton: true,
					confirmButtonText: saveModify,
				}).then((result) => {
					/* Read more about isConfirmed, isDenied below */
					if (result.isConfirmed) {
						$scope.CallSaveUpdateBranchWiseLedgerOpening();
					}
				});
			} else
				$scope.CallSaveUpdateBranchWiseLedgerOpening();

		}
	};

	$scope.CallSaveUpdateBranchWiseLedgerOpening = function () {

		var costClassId = $scope.newBranchWiseLedgerOpening.CostClassId;
		var findCC = mx($scope.CostClassColl).firstOrDefault(p1 => p1.CostClassId == costClassId);
		if (findCC) {

			if (findCC.StartDate) {
				$scope.newBranchWiseLedgerOpening.VoucherDate = new Date(findCC.StartDate);
				$scope.newBranchWiseLedgerOpening.VoucherDate_TMP = new Date(findCC.StartDate);
			} else {
				$scope.newBranchWiseLedgerOpening.VoucherDate = null;
				$scope.newBranchWiseLedgerOpening.VoucherDate_TMP = null;
				Swal.fire('Please ! Update Year Start Date and EndDate')
				return;
			}
		} else {
			return;
		}


		var voucherDate = $filter('date')(new Date($scope.newBranchWiseLedgerOpening.VoucherDateDet.dateAD), 'yyyy-MM-dd');

		var dataColl = [];
		angular.forEach($scope.newBranchWiseLedgerOpening.OpeningColl, function (op) {
			if (op.CostCenterId || op.CostCenterId > 0) {
				var beData = {
					CostCenterId:op.CostCenterId,
					LedgerId: $scope.newBranchWiseLedgerOpening.LedgerId,
					OpeningAmount: op.OpeningAmount,
					Amount: op.DrCr == 1 ? op.OpeningAmount : -op.OpeningAmount,
					DrCr: op.DrCr,
					BranchId: $scope.newBranchWiseLedgerOpening.BranchId,
					CurrencyId: $scope.newBranchWiseLedgerOpening.SelectedCurrency.CurrencyId,
					VoucherDate: voucherDate,
					NY: $scope.newBranchWiseLedgerOpening.VoucherDateDet.NY,
					NM: $scope.newBranchWiseLedgerOpening.VoucherDateDet.NM,
					ND: $scope.newBranchWiseLedgerOpening.VoucherDateDet.ND,
					OpeningId: op.OpeningId ? op.OpeningId : 0,
					CurrencyId: $scope.newBranchWiseLedgerOpening.SelectedCurrency.CurrencyId,
					CurRate: $scope.newBranchWiseLedgerOpening.CurRate,
					DrAmt: op.DrCr == 1 ? op.OpeningAmount : 0,
					CrAmt: op.DrCr == 2 ? op.OpeningAmount : 0,
					CostClassId: costClassId,
				};
				dataColl.push(beData);
			}
		});
		$http({
			method: 'POST',
			url: base_url + "Account/Creation/SaveUpdateCostCenterLedgerOpening",
			dataType: "json",
			data: JSON.stringify(dataColl)
		}).then(function (res) {
			if (res.data.IsSuccess && res.data.Data) {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	}


	$scope.pageChangeHandler = function (num) {
		console.log('page changed to ' + num);
	};

});