app.controller('SparePartsReturn', function ($scope, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'SpareParts Return';


	$scope.LoadData = function () {
		$('.select2').select2();
		$scope.confirmMSG = GlobalServices.getConfirmMSG();

		$scope.RemarkColl = [{ text: 'Parts In Fitting' }, { text: 'Excess Parts' }, { text: 'Customer Not interested' }];
		$scope.HideShow = {
			Branch: true,
			CostClass: true
		};


		$scope.beData =
		{
			TransId: 0,
			EngineId: null,
			JobNo: '',
			EntryDateTime_TMP: new Date(),
			EntryTime_TMP: new Date(),
			EngineNo: '',
			ChassisNo: '',
			RegdNo: '',
			Party: '',
			SparePartsColl: [],
			Mode: 'Save'
		}

		$scope.SelectedBranch = null;
		$scope.SelectedCostClass = null;

		$scope.UnitColl = [];
		$http({
			method: 'GET',
			url: base_url + "Inventory/Creation/GetAllUnit",
			dataType: "json"
			//data:JSON.stringify(para)
		}).then(function (res) {
			if (res.data.IsSuccess && res.data.Data) {
				$scope.UnitColl = mx(res.data.Data);
			}
		}, function (reason) {
			alert('Failed' + reason);
		});

		$scope.BranchList = [];
		$http({
			method: 'GET',
			url: base_url + "Setup/Security/GetAllBranchList",
			dataType: "json"
		}).then(function (res) {
			if (res.data.IsSuccess && res.data.Data) {
				$scope.BranchList = res.data.Data;

				if ($scope.BranchList && $scope.BranchList.length > 1)
					$scope.HideShow.Branch = false;
				else if ($scope.BranchList && $scope.BranchList.length == 1)
					$scope.HideShow.Branch = true;
				else
					$scope.HideShow.Branch = false;

				if ($scope.BranchList.length > 0) {
					$scope.SelectedBranch = $scope.BranchList[0];
					$scope.beData.BranchId = $scope.SelectedBranch.BranchId;
				}

			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});


		$http({
			method: 'GET',
			url: base_url + "Account/Creation/GetCostClassForEntry",
			dataType: "json"
		}).then(function (res1) {
			if (res1.data.IsSuccess && res1.data.Data) {
				$scope.CostClassColl = res1.data.Data;
				if ($scope.CostClassColl.length > 0) {
					$scope.SelectedCostClass = $scope.CostClassColl[0];
					$scope.beData.CostClassId = $scope.SelectedCostClass.CostClassId;
				}

				if ($scope.CostClassColl && $scope.CostClassColl.length > 1)
					$scope.HideShow.CostClass = false;
				else if ($scope.CostClassColl && $scope.CostClassColl.length == 1)
					$scope.HideShow.CostClass = true;
				else
					$scope.HideShow.CostClass = false;

			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});


		

		$scope.beData.SparePartsColl.push({});
	}
	
	 $scope.reloadVoucherDate = function () {

        const container = angular.element(document.getElementById('dvDTVoucher'));
        container.empty(); // Clear the container

        $timeout(function () {
            const newElement = angular.element('<input type="text"  class="form-control form-control-sm" date-picker ng-model="beData.VoucherDate_TMP" date-detail="beData.VoucherDateDet" confirm-action="getVoucherNoOnly()" title ="{{(SelectedVoucher.DateStyle==1 ? beData.VoucherDateDet.dateBS : (beData.VoucherDateDet.dateAD |dateFormat))}}" date-style="SelectedVoucher.DateStyle" id ="dtVoucherDate" voucherid ="SelectedVoucher.VoucherId" >');
            //container.append($compile(newElement)($scope));

            container.append(newElement);
            $compile(newElement)($scope);
        });
    };

	$scope.getVoucherNo = function () {
		if ($scope.beData.BranchId > 0)
			$scope.SelectedBranch = mx($scope.BranchList).firstOrDefault(p1 => p1.BranchId == $scope.beData.BranchId);

		if ($scope.beData.CostClassId > 0)
			$scope.SelectedCostClass = mx($scope.CostClassColl).firstOrDefault(p1 => p1.CostClassId == $scope.beData.CostClassId);

	}

	$scope.getJobCardDetails = function () {
		$scope.beData.SparePartsColl = [];

		if ($scope.SelectedBranch && $scope.SelectedCostClass && $scope.beData.JobNo) {

			$scope.loadingstatus = "running";
			showPleaseWait();

			var para = {
				jobNo: $scope.beData.JobNo,
				costClassId: $scope.SelectedCostClass.CostClassId,
				branchId: $scope.SelectedBranch.BranchId,
				ignoreClosed: false
			}

			$http({
				method: 'POST',
				url: base_url + "Service/Transaction/GetJobCardDetailsByJobNo",
				dataType: "json",
				data: JSON.stringify(para)
			}).then(function (resLD) {

				$scope.loadingstatus = 'stop';
				hidePleaseWait();

				if (resLD.data.Data && resLD.data.IsSuccess == true) {
					var dt = resLD.data.Data;
					$scope.beData.VehicleEntryId = dt.VehicleEntryId;
					$scope.beData.ChSrlNo = dt.ChassisNo;
					$scope.beData.ChassisNo = dt.ChassisNo;
					$scope.beData.EngineNo = dt.EngineNo;
					$scope.beData.RegdNo = dt.RegdNo;
					$scope.beData.Party = dt.Party;
					$scope.beData.Mechanic = dt.Mechanic;
					$scope.beData.ChassisNo = dt.ChassisNo;
					$scope.beData.Tag = dt;
					$scope.beData.JobCardId = dt.TranId;
					$scope.beData.JobCardNo = $scope.beData.JobNo;
					$scope.beData.EntryDateTime_TMP = new Date();
					$scope.beData.EntryTime_TMP = new Date();
					$scope.beData.VinNo = dt.VinNo;
					$scope.beData.VehicleTypeName = dt.VehicleTypeName;
					$scope.beData.VehicleModelName = dt.VehicleModelName;

					var para1 = {
						BranchId: para.branchId,
						CostClassId: para.costClassId,
						JobCardId: dt.TranId,
						ForReturn:true,
					}
					$http({
						method: 'POST',
						url: base_url + "Service/Transaction/getPartsDemandByJobCardId",
						dataType: "json",
						data: JSON.stringify(para1)
					}).then(function (resDC) {

						$scope.loadingstatus = 'stop';
						hidePleaseWait();

						if (resDC.data.Data && resDC.data.IsSuccess == true) {
							var partsColl = resDC.data.Data;

							angular.forEach(partsColl, function (pc) {

								pc.TotalIssueQty = pc.IssueQty1 + pc.IssueQty2 + pc.IssueQty3;
								if (pc.TotalIssueQty> 0)
									$scope.beData.SparePartsColl.push(pc);
							});

						} else {

							Swal.fire('No Demand Found');
						}

					}, function (reason) {
						alert('Failed' + reason);
					});


				} else {

					$scope.beData.VehicleEntryId = 0;
					$scope.beData.ChSrlNo = '';
					$scope.beData.ChassisNo = '';
					$scope.beData.EngineNo = '';
					$scope.beData.RegdNo = '';
					$scope.beData.Party = '';
					$scope.beData.Mechanic = '';
					$scope.beData.ChassisNo = '';
					$scope.beData.Tag = null;
					$scope.beData.JobCardId = null;
					$scope.beData.JobCardNo = $scope.beData.JobNo;
					$scope.beData.EntryDateTime_TMP = new Date();
					$scope.beData.EntryTime_TMP = new Date();
					$scope.beData.VinNo = '';
					$scope.beData.VehicleTypeName = '';
					$scope.beData.VehicleModelName = '';
					Swal.fire(resLD.data.ResponseMSG);
				}

			}, function (reason) {
				alert('Failed' + reason);
			});

		}
	}

	$scope.ProductSelectionChange = function (itemDet, ind) {
		$scope.sideBarData = itemDet.sideBarData;

		var isModify = $scope.beData.TranId > 0 ? true : false;

		if (itemDet.ProductId == null) {
			itemDet.ActualQty = 0;
			itemDet.BilledQty = 0;
			itemDet.Rate = 0;
			itemDet.ClosingQty = '';
			itemDet.UnitId = null;
			itemDet.UnitName = '';
			itemDet.DiscountAmt = 0;
			itemDet.DiscountPer = 0;
			itemDet.SchameAmt = 0;
			itemDet.SchamePer = 0;
			itemDet.ProductLedgerId = null;
			itemDet.LossRate = 0;
			itemDet.Makeing = 0;
			itemDet.Stone = 0;
			itemDet.NetWeight = 0;
			itemDet.LossWeight = 0;
			itemDet.BatchBalQty = 0;
			itemDet.TranUnitId = null;

			itemDet.FineRate = 0;
			itemDet.FineWeight = 0;
			itemDet.ProcessingRate = 0;
			itemDet.ProcessingWeight = 0;

			$scope.ChangeItemRowValue(itemDet, 'product');
		} else if (itemDet.productDetail) {
			itemDet.CanEditRate = itemDet.productDetail.CanEditRatePurchase;
			itemDet.ClosingQty = $filter('formatNumber')(itemDet.productDetail.ClosingQty) + ' ' + itemDet.productDetail.BaseUnit;
			itemDet.UnitId = itemDet.productDetail.BaseUnitId;
			itemDet.UnitName = itemDet.productDetail.BaseUnit;

			var refStockItem = false;
			if (itemDet.DTranId > 0) {
				refStockItem = true;
			}

			if (isModify == false && refStockItem == false) {
				itemDet.Rate = itemDet.productDetail.SalesRate;
				itemDet.ProductLedgerId = itemDet.productDetail.SalesLedgerId;
				itemDet.LedgerId = itemDet.productDetail.SalesLedgerId;
			} else {

				if (!itemDet.ProductLedgerId || itemDet.ProductLedgerId == 0)
					itemDet.ProductLedgerId = itemDet.productDetail.SalesLedgerId;

				if (!itemDet.LedgerId || itemDet.LedgerId == 0)
					itemDet.LedgerId = itemDet.productDetail.SalesLedgerId;
			}



			itemDet.Makeing = 0;
			itemDet.Stone = 0;
			itemDet.BatchBalQty = 0;
			itemDet.FineRate = 0;
			itemDet.FineWeight = 0;
			itemDet.ProcessingRate = 0;
			itemDet.ProcessingWeight = 0;


			var findUnit = $scope.UnitColl.firstOrDefault(p1 => p1.UnitId == itemDet.productDetail.BaseUnitId);
			if (findUnit) {
				itemDet.QtyDecimal = findUnit.NoOfDecimalPlaces;
				itemDet.RateDecimal = findUnit.RateNoOfDecimalPlaces;
				itemDet.AmountDecimal = findUnit.AmountNoOfDecimalPlaces;
			}


			if (isEmptyObj(itemDet.QtyDecimal))
				itemDet.QtyDecimal = 0;

			if (isEmptyObj(itemDet.RateDecimal))
				itemDet.RateDecimal = 2;

			if (isEmptyObj(itemDet.AmountDecimal))
				itemDet.AmountDecimal = 2;

			itemDet.LossRate = itemDet.productDetail.LossRate;
			$scope.ChangeItemRowValue(itemDet, 'product');

			//var itemC = mx($scope.beData.ItemDetailsColl).where(p1 => p1.RowType == 'P').count();
			//if (ind == (itemC - 1))
			//	$scope.AddSparePartDet(ind);

		}

	}

	$scope.ChangeItemRowValue = function (itemDet, col) {

		var amt = 0, qty = 0, rate = 0, disAmt = 0, disPer = 0, schAmt = 0, schPer = 0;

		var aQty = 0;

		var rateOf = 1;
		if (itemDet.productDetail) {
			rateOf = itemDet.productDetail ? itemDet.productDetail.RateOf : 1;
			if (rateOf == 0)
				rateOf = 1;
		}

		aQty = itemDet.DemandQty;

		qty = itemDet.DemandQty;

		if (isEmptyObj(itemDet.Rate) == false)
			rate = itemDet.Rate;

		rate = ($filter('number')(rate / rateOf, itemDet.RateDecimal)).parseDBL();


		if (itemDet.Amount && col == "amt" && itemDet.Amount > 0) {
			if ($scope.SelectedVoucher.Product.ChangeAmtReflectToRateQty == 2) {
				rate = itemDet.Amount / itemDet.BilledQty;
				itemDet.Rate = rate;
			} else {
				itemDet.BilledQty = itemDet.Amount / itemDet.Rate;
				itemDet.ActualQty = itemDet.BilledQty;

				qty = itemDet.ActualQty;
			}
			amt = itemDet.Amount;
		} else
			amt = qty * rate;


		itemDet.Amount = ($filter('number')((amt - disAmt), itemDet.AmountDecimal)).parseDBL();


		$scope.CalculateTotalAndSubTotal();
	}
	$scope.CalculateTotalAndSubTotal = function () {

		if ($scope.SelectedVoucher) {
			var subTotal = 0;
			var totalQty = 0;
			angular.forEach($scope.beData.ItemDetailsColl, function (item) {
				subTotal += item.Amount ? item.Amount : 0;
				totalQty += item.ActualQty ? item.ActualQty : 0;
			});

			$scope.beData.SubTotal = ($filter('number')(subTotal, $scope.SelectedVoucher.NoOfDecimalPlaces)).parseDBL();
			$scope.beData.TotalAmount = ($filter('number')(subTotal, $scope.SelectedVoucher.NoOfDecimalPlaces)).parseDBL();
		}
	};

	$scope.AddSparePartsReturnDet = function (ind) {
		if ($scope.beData.SparePartsColl) {
			if ($scope.beData.SparePartsColl.length > ind + 1) {
				$scope.beData.SparePartsColl.splice(ind + 1, 0, {
					DemandRate: ''
				})
			} else {
				$scope.beData.SparePartsColl.push({
					DemandRate: ''
				})
			}
		}
	};

	$scope.delSparePartsReturnDet = function (ind) {
		if ($scope.beData.SparePartsColl) {
			if ($scope.beData.SparePartsColl.length > 1) {
				$scope.beData.SparePartsColl.splice(ind, 1);
			}
		}
	};

	$scope.ClearSpareParts = function () {
		$scope.beData =
		{
			TransId: 0,
			EngineId: null,
			JobNo: '',
			EntryDateTime_TMP: new Date(),
			EntryTime_TMP: new Date(),
			EngineNo: '',
			ChassisNo: '',
			RegdNo: '',
			Party: '',
			SparePartsColl: [],
			Mode: 'Save'
		} 
	}


	$scope.IsValidSparePartsReturn = function () {
		//if ($scope.beData.JobNo.isEmpty()) {
		//	Swal.fire("Please ! Enter JobNo");
		//	return false;
		//}
		//else
			return true;
	}


	$scope.SaveUpdateSparePartsReturn = function () {
		if ($scope.IsValidSparePartsReturn() == true) {
			if ($scope.confirmMSG.Accept == true) {
				var saveModify = $scope.beData.Mode;
				Swal.fire({
					title: 'Do you want to ' + saveModify + ' the current data?',
					showCancelButton: true,
					confirmButtonText: saveModify,
				}).then((result) => {
					/* Read more about isConfirmed, isDenied below */
					if (result.isConfirmed) {
						$scope.CallSaveUpdateSparePartsReturn();
					}
				});
			} else
				$scope.CallSaveUpdateSparePartsReturn();
		}
	};

	$scope.CallSaveUpdateSparePartsReturn = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();

		$scope.beData.DetailsColl = [];

		if ($scope.beData.EntryDateTimeDet) {
			$scope.beData.EntryDate = $filter('date')(new Date($scope.beData.EntryDateTimeDet.dateAD), 'yyyy-MM-dd');
		}
		else
			$scope.beData.EntryDate = $filter('date')(new Date(), 'yyyy-MM-dd');

		angular.forEach($scope.beData.SparePartsColl, function (det) {

			if (det.ProductId && det.ProductId > 0 && det.ReturnQty > 0) {
				 
					det.ReturnDate = $scope.beData.EntryDate; 
				$scope.beData.DetailsColl.push(det);
			}

		});

		$http({
			method: 'POST',
			url: base_url + "Service/Transaction/SaveJobCardSparePartsReturn",
			headers: { 'Content-Type': undefined },
			transformRequest: function (data) {
				var formData = new FormData();
				formData.append("jsonData", angular.toJson(data.jsonData));
				return formData;
			},
			data: { jsonData: $scope.beData }
		}).then(function (res) {
			$scope.loadingstatus = "stop";
			hidePleaseWait();
			Swal.fire(res.data.ResponseMSG);
			if (res.data.IsSuccess == true) {
				$scope.ClearFields();
				
			}
		}, function (errormessage) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
		});
	}

	$scope.ClearFields = function () {
		$scope.beData =
		{
			SparePartIssueId: 0,
			EngineId: null,
			JobNo: '',
			EntryDate: new Date(),
			EngineNo: '',
			ChSrlNo: '',
			RegdNo: '',
			Party: '',
			SparePartIssColl: [],
			Mode: 'Save'
		};
		$scope.beData.SparePartIssColl.push({});
	}

	$scope.ShowVehicleHistory = function (vtranid) {

		if (vtranid > 0) {

			$(document).ready(function () {
				$('body').css('cursor', 'wait');
			});

			var para = {
				vtranId: vtranid,
			};
			var frame = document.getElementById("frmChieldForm");
			var frameDoc = frame.contentDocument || frame.contentWindow.document;
			if (frameDoc)
				frameDoc.removeChild(frameDoc.documentElement);

			frame.src = '';
			frame.src = base_url + "Service/Reporting/VehicleHistory?" + param(para);
			document.body.style.cursor = 'default';

			$('#frmChieldForm').on('load', function () {
				$('body').css('cursor', 'default');
			});

			$('#frmChield').modal('show');

		} else {
			Swal.fire('Please ! Select Vehicle');
		}
	}

});