app.controller('TDSLedgerOpeningController', function ($scope, $http, $timeout, $filter, GlobalServices) {
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
				if (!selectItem.VoucherId || selectItem.VoucherId == null || selectItem.VoucherId == 0 || selectItem.CrAmount == 0)
					return;

				$scope.newBillWiseLedgerOpening.OpeningColl.splice(ind + 1, 0, {
					DrCr: 1,
					PartyLedgerId: 0, 
				});
			}
			else if ($scope.newBillWiseLedgerOpening.OpeningColl.length == (ind + 1)) {
				var selectItem = $scope.newBillWiseLedgerOpening.OpeningColl[ind];
				if (!selectItem.VoucherId || selectItem.VoucherId == null || selectItem.VoucherId == 0 || selectItem.CrAmount == 0)
					return;

				$scope.newBillWiseLedgerOpening.OpeningColl.push({
					CrAmount: 0
				});
			}
			else {
				$scope.newBillWiseLedgerOpening.OpeningColl.push({
					CrAmount: 0
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
		if (led.LedgerDetails && led.TDSLedgerId) {
			$scope.newBillWiseLedgerOpening.OpeningColl = [];

			var para = {
				BranchId: $scope.newBillWiseLedgerOpening.BranchId,
				TDSLedgerId: led.TDSLedgerId,
				CostClassId: $scope.newBillWiseLedgerOpening.CostClassId
			};
			$http({
				method: 'POST',
				url: base_url + "Account/Creation/GetTDSDues",
				dataType: "json",
				data: JSON.stringify(para)
			}).then(function (res) {
				if (res.data.IsSuccess && res.data.Data) {
					$timeout(function () {
						var bDetColl = res.data.Data.BillColl;
						$scope.newBillWiseLedgerOpening.OpeningAmt = res.data.Data.OpeningAmt;
						  
						if (bDetColl && bDetColl.length > 0) {
							angular.forEach(bDetColl, function (bDet) {
								var det = {						 
									TDSLedgerId: bDet.TDSLedgerId,
									BranchId: bDet.BranchId,
									CostClassId: bDet.CostClassId,
									VoucherId: bDet.VoucherId,
									VoucherDate_TMP: new Date(bDet.VoucherDate),
									VoucherNo: bDet.VoucherNo,
									InvoiceAmt: bDet.InvoiceAmt,
									AccessableAmt: bDet.AccessableAmt,
									DrAmount: bDet.DrAmount,
									CrAmount: bDet.CrAmount,
									Closing: bDet.Closing,
									PartyLedgerId:bDet.PartyLedgerId,
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

		if (!$scope.newBillWiseLedgerOpening.TDSLedgerId) {
			Swal.fire('Please ! Select valid TDS Ledger Name');
			return false;
		}

	 

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
			if (op.VoucherDateDet && op.VoucherId > 0 && op.CrAmount != 0) {

				var findV = $scope.VoucherTypeList_Qry.firstOrDefault(p1 => p1.VoucherId == op.VoucherId);

				var beData = {
					TDSLedgerId: $scope.newBillWiseLedgerOpening.TDSLedgerId,
					BranchId: $scope.newBillWiseLedgerOpening.BranchId,
					CostClassId: $scope.newBillWiseLedgerOpening.CostClassId,
					VoucherId: op.VoucherId,
					VoucherDate: $filter('date')(new Date(op.VoucherDateDet.dateAD), 'yyyy-MM-dd'),
					VoucherNo: op.VoucherNo,
					InvoiceAmt: op.InvoiceAmt,
					AccessableAmt: op.AccessableAmt,
					DrAmount: op.DrAmount,
					CrAmount: op.CrAmount,
					Closing: op.Closing,
					PartyLedgerId:op.PartyLedgerId
				};
				totalAmt += op.CrAmount;
				dataColl.push(beData);
			}
		});

		var opening = {};
		opening.LedgerId = $scope.newBillWiseLedgerOpening.TDSLedgerId;
		opening.BranchId = $scope.newBillWiseLedgerOpening.BranchId;
		opening.CostClassId = $scope.newBillWiseLedgerOpening.CostClassId;

		$scope.loadingstatus = "running";
		showPleaseWait();

		$http({
			method: 'POST',
			url: base_url + "Account/Creation/SaveTDSOpening",
			headers: { 'Content-Type': undefined },

			transformRequest: function (data) {

				var formData = new FormData();
				formData.append("jsonData", angular.toJson(data.jsonData));
				formData.append("openingData", angular.toJson(data.openingData));

				return formData;
			},
			data: { jsonData: opening, openingData: dataColl }
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
			total += op.CrAmount;
		});
		$scope.newBillWiseLedgerOpening.GrandTotal = total;
	};


	$scope.pageChangeHandler = function (num) {
		console.log('page changed to ' + num);
	};

});