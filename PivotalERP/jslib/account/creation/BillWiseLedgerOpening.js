app.controller('BillWiseLedgerOpeningController', function ($scope, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'BillWise Ledger Opening';


	$scope.LoadData = function () {

		$('.select2').select2({
			allowClear: true,
			openOnEnter: true
		});
		$scope.confirmMSG = GlobalServices.getConfirmMSG();
		$scope.perPageColl = GlobalServices.getPerPageList();

		$timeout(function () {
			$http({
				method: "GET",
				url: base_url + "Global/GetCompanyDetail",
				dataType: "json"
			}).then(function (res) {
				$scope.CompDet = res.data.Data;
				$scope.newBillWiseLedgerOpening.VoucherDate_TMP = $scope.CompDet.StartDate;

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
			$scope.CostClassList = [];
			$http({
				method: 'GET',
				url: base_url + "Account/Creation/GetAllCostClasss",
				dataType: "json"
			}).then(function (res) {
				if (res.data.IsSuccess && res.data.Data) {
					$scope.CostClassList = res.data.Data;
				}
			}, function (reason) {
				Swal.fire('Failed' + reason);
			});
		});

		$timeout(function () {
			$scope.VoucherTypeList = [];
			$scope.VoucherTypeList_Qry = [];
			$http({
				method: 'GET',
				url: base_url + "Account/Creation/GetVoucherListByType?voucherTypeColl=" + voucherTypeColls,
				dataType: "json",
				//data: voucherTypeColls
			}).then(function (res) {
				if (res.data.IsSuccess && res.data.Data) {
					$scope.VoucherTypeList = res.data.Data;
					$scope.VoucherTypeList_Qry = mx(res.data.Data);
				}
			}, function (reason) {
				Swal.fire('Failed' + reason);
			});
		});

		$scope.newBillWiseLedgerOpening = {
			BillWiseLedgerOpeningId: null,
			BranchId: 1,
			CostClassId: 1,
			OpeningColl: [],
			VoucherDate_TMP: new Date(),
			Mode: 'Save'
		};

	}


	$scope.AddRowInOpening = function (ind) {

		if ($scope.newBillWiseLedgerOpening.OpeningColl) {
			if ($scope.newBillWiseLedgerOpening.OpeningColl.length > ind + 1) {

				var selectItem = $scope.newBillWiseLedgerOpening.OpeningColl[ind + 1];
				if (!selectItem.VoucherId || selectItem.VoucherId == null || selectItem.VoucherId == 0 || selectItem.TotalAmount == 0)
					return;

				$scope.newBillWiseLedgerOpening.OpeningColl.splice(ind + 1, 0, {
					DrCr: 1,
					LedgerId: 0,
					AgentId: 0,
				});
			}
			else if ($scope.newBillWiseLedgerOpening.OpeningColl.length == (ind + 1)) {
				var selectItem = $scope.newBillWiseLedgerOpening.OpeningColl[ind];
				if (!selectItem.VoucherId || selectItem.VoucherId == null || selectItem.VoucherId == 0 || selectItem.TotalAmount == 0)
					return;

				$scope.newBillWiseLedgerOpening.OpeningColl.push({
					TotalAmount: 0
				});
			}
			else {
				$scope.newBillWiseLedgerOpening.OpeningColl.push({
					TotalAmount: 0
				});
			}

		}
		$scope.ChangeAmount();

	}

	$scope.delRowOpening = function (ind) {
		if ($scope.newBillWiseLedgerOpening.OpeningColl) {
			if ($scope.newBillWiseLedgerOpening.OpeningColl.length > 1) {
				$scope.newBillWiseLedgerOpening.OpeningColl.splice(ind, 1);
				$scope.ChangeAmount();
			}
		}
	}

	$scope.ChangeParticularLedger = function (led) {
		if (led.LedgerDetails && led.LedgerId) {
			$scope.newBillWiseLedgerOpening.OpeningColl = [];

			var para = {
				BranchId: $scope.newBillWiseLedgerOpening.BranchId,
				LedgerId: led.LedgerId,
				CostClassId: $scope.newBillWiseLedgerOpening.CostClassId
			};
			$http({
				method: 'POST',
				url: base_url + "Account/Creation/GetBillWiseDues",
				dataType: "json",
				data: JSON.stringify(para)
			}).then(function (res) {
				if (res.data.IsSuccess && res.data.Data) {
					$timeout(function () {
						var bDetColl = res.data.Data.BillColl;
						$scope.newBillWiseLedgerOpening.OpeningAmt = res.data.Data.OpeningAmt;
						$scope.newBillWiseLedgerOpening.VoucherDate_TMP = $scope.CompDet.StartDate;

						if (bDetColl && bDetColl.length > 0) {
							angular.forEach(bDetColl, function (bDet) {
								var det = {
									LedgerId: bDet.LedgerId,
									BranchId: bDet.BranchId,
									CostClassId: bDet.CostClassId,
									VoucherId: bDet.VoucherId,
									VoucherDate: new Date(bDet.VoucherDate),
									VoucherDate_TMP: new Date(bDet.VoucherDate),
									TotalAmount: bDet.TotalAmount,
									BillNo: bDet.BillNo,
									Remarks: (bDet.Remarks ? bDet.Remarks : ''),
								};
								$scope.newBillWiseLedgerOpening.OpeningColl.push(det);
							});
						} else {
							$scope.newBillWiseLedgerOpening.OpeningColl.push({});
						}

						$scope.ChangeAmount();
					});
				}
			}, function (reason) {
				Swal.fire('Failed' + reason);
			});

		}
	};


	$scope.ClearBillWiseLedgerOpening = function () {
		$scope.newBillWiseLedgerOpening = {
			BillWiseLedgerOpeningId: null,

			Mode: 'Save'
		};
	}


	//************************* BillWiseLedgerOpening *********************************

	$scope.IsValidBillWiseLedgerOpening = function () {
		if (!$scope.newBillWiseLedgerOpening.BranchId) {
			Swal.fire('Please ! Select valid Branch Name');
			return false;
		}

		if (!$scope.newBillWiseLedgerOpening.CostClassId) {
			Swal.fire('Please ! Select valid CostClass Name');
			return false;
		}

		if (!$scope.newBillWiseLedgerOpening.LedgerId) {
			Swal.fire('Please ! Select valid Ledger(Party) Name');
			return false;
		}

		//if (!$scope.newBillWiseLedgerOpening.OpeningAmt || $scope.newBillWiseLedgerOpening.OpeningAmt == 0) {
		//	Swal.fire('Please ! Enter Ledger Opening Balance 1st');
		//	return false;
		//}

		  
		//if (total != $scope.newBillWiseLedgerOpening.OpeningAmt) {
		//	Swal.fire('Please ! Opening Amt And Bill Wise Amt Does Not Match');
		//	return false;
		//}

		return true;
	}

	$scope.SaveUpdateBillWiseLedgerOpening = function () {
		if ($scope.IsValidBillWiseLedgerOpening() == true) {
			if ($scope.confirmMSG.Accept == true) {
				var saveModify = $scope.newBillWiseLedgerOpening.Mode;
				Swal.fire({
					title: 'Do you want to ' + saveModify + ' the current data?',
					showCancelButton: true,
					confirmButtonText: saveModify,
				}).then((result) => {
					/* Read more about isConfirmed, isDenied below */
					if (result.isConfirmed) {
						$scope.CallSaveUpdateBillWiseLedgerOpening();
					}
				});
			} else
				$scope.CallSaveUpdateBillWiseLedgerOpening();

		}
	};

	$scope.CallSaveUpdateBillWiseLedgerOpening = function () {


		var totalAmt = 0;
		var dataColl = [];
		angular.forEach($scope.newBillWiseLedgerOpening.OpeningColl, function (op) {
			if (op.VoucherDateDet && op.VoucherId > 0 && op.TotalAmount != 0) {

				var findV = $scope.VoucherTypeList_Qry.firstOrDefault(p1 => p1.VoucherId == op.VoucherId);

				var beData = {
					LedgerId: $scope.newBillWiseLedgerOpening.LedgerId,
					BranchId: $scope.newBillWiseLedgerOpening.BranchId,
					CostClassId: $scope.newBillWiseLedgerOpening.CostClassId,
					VoucherId: op.VoucherId,
					VoucherDate: $filter('date')(new Date(op.VoucherDateDet.dateAD), 'yyyy-MM-dd'),
					NY: op.VoucherDateDet.NY,
					NM: op.VoucherDateDet.NM,
					ND: op.VoucherDateDet.ND,
					TotalAmount: op.TotalAmount,
					BillNo: op.BillNo,
					Remarks: op.Remarks ? op.Remarks : '',
					DrAmount: findV && findV.VoucherType == 8 ? 0 : op.TotalAmount,
					CrAmount: findV && findV.VoucherType == 14 ? 0 : op.TotalAmount,
				};
				totalAmt += op.TotalAmount;
				dataColl.push(beData);
			}
		});

		var opening = {};
		if (dataColl.length > 0) {
			var fst = dataColl[0];
			opening.LedgerId = fst.LedgerId;
			opening.BranchId = fst.BranchId;
			opening.CurRate = 1;
			opening.CurrencyId = 1;
			opening.VoucherDate = $scope.CompDet.StartDate;
			opening.Amount = totalAmt;
			opening.NY = ($scope.newBillWiseLedgerOpening.VoucherDateDet ?  $scope.newBillWiseLedgerOpening.VoucherDateDet.NY : 0);
			opening.NM = ($scope.newBillWiseLedgerOpening.VoucherDateDet ? $scope.newBillWiseLedgerOpening.VoucherDateDet.NM : 0);
			opening.ND = ($scope.newBillWiseLedgerOpening.VoucherDateDet ? $scope.newBillWiseLedgerOpening.VoucherDateDet.ND : 0);
		}
		$scope.loadingstatus = "running";
		showPleaseWait();

		$http({
			method: 'POST',
			url: base_url + "Account/Creation/SaveBillWiseOpening",
			headers: { 'Content-Type': undefined },

			transformRequest: function (data) {

				var formData = new FormData();
				formData.append("jsonData", angular.toJson(data.jsonData));
				formData.append("openingData", angular.toJson(data.openingData));

				return formData;
			},
			data: { jsonData: dataColl, openingData: opening }
		}).then(function (res) {

			$scope.loadingstatus = "stop";
			hidePleaseWait();

			Swal.fire(res.data.ResponseMSG);

			if (res.data.IsSuccess==true)
				$scope.ClearBillWiseLedgerOpening();


		}, function (errormessage) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";

		});
	}

	$scope.ChangeAmount = function () {

		var total = 0;
		angular.forEach($scope.newBillWiseLedgerOpening.OpeningColl, function (op) {
			var findV = $scope.VoucherTypeList_Qry.firstOrDefault(p1 => p1.VoucherId == op.VoucherId);

			if (findV && findV.VoucherType == 14)
				total += op.TotalAmount;
			else
				total -= op.TotalAmount;
		});
		$scope.newBillWiseLedgerOpening.GrandTotal = total;
	};


	$scope.pageChangeHandler = function (num) {
		console.log('page changed to ' + num);
	};

});