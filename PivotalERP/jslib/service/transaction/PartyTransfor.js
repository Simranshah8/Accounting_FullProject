app.controller('PartyTransforCTRL', function ($scope, $interval, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'NewJob Card';


	$scope.LoadData = function () {
		$('.select2').select2();
		$scope.confirmMSG = GlobalServices.getConfirmMSG();
		$scope.perPageColl = GlobalServices.getPerPageList();

		
		$scope.HideShow = {
			Branch: true,
			CostClass: true
		};
		$scope.currentPages = {
			PartyTransfor: 1,
		}
		$scope.searchData = {
			PartyTransfor: '',
		}
		$scope.perPage = {
			PartyTransfor: GlobalServices.getPerPageRow(),
		}
		$scope.paginationOptions = {
			pageNumber: 1,
			pageSize: GlobalServices.getPerPageRow(),
			sort: null,
			SearchType: 'text',
			SearchCol: '',
			SearchVal: '',
			SearchColDet: null,
			pagearray: [],
			pageOptions: [5, 10, 20, 30, 40, 50]
		};

		$scope.VehicleSearchOptions = [{ text: 'Vin No.', value: 'V.VinNo' }, { text: 'Engine No.', value: 'V.EngineNo' }, { text: 'Regd . No.', value: 'V.RegdNo' }, { text: 'Chassis/Serial No.', value: 'V.ChSrlNo' }];
		$scope.beData =
		{
			SearchOption: $scope.VehicleSearchOptions[1].value,
			TranId: 0,
			VehicleEntryId: 0,
			BranchId: 0,
			EntryDate_TMP: new Date(),
			EngineNo: '',
			ChassisNo: '',
			ToParty: '',
			ToAddress: '',
			ToContactNo: '',
			ToMobileNo: '',
			ToCitizenshipNo: '',
			ToCustomerType: null,
			ToRegdNO: '',
			ToAMC: false,
			ToWarranty: false,
			ToCustomerSerialNo: '',
			ToEmailId: '',
			ToLedgerId: 0,
			FromLedgerId: 0,
			FromParty: '',
			FromAddress: '',
			FromContactNo: '',
			FromMobileNo: '',
			FromCitizenshipNo: '',
			FromCustomerType: null,
			FromRegdNO: '',
			FromAMC: false,
			FromWarranty: false,
			FromCustomerSerialNo: '',
			FromEmailId: '',
		};

		$scope.SelectedBranch = null;
		$scope.SelectedCostClass = null;
		$scope.SelectedVoucher = null;

		$scope.EPDet = {};
		$scope.EPColl = [];
		GlobalServices.getEntityProperties(EntityId).then(function (res) {
			if (res.data.IsSuccess && res.data.Data) {
				$scope.EPColl = res.data.Data;
				angular.forEach($scope.EPColl, function (ep) {
					$scope.EPDet[ep.Name] = ep;
					$scope.beData[ep.Name] = ep.DefaultValue;
				});
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});



		$scope.CustomerTypeColl = [{ id: 1, text: 'KA' }, { id: 2, text: 'NON_KA' }]

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

					//$scope.getVoucherNo();
				}

			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

	}

	$scope.ClearData = function () {
		$scope.beData =
		{
			SearchOption: $scope.VehicleSearchOptions[1].value,
			TranId: 0,
			VehicleEntryId: 0,
			BranchId : 0,
			EntryDate_TMP: new Date(),
			EngineNo: '',
			ChassisNo: '',
			ToParty: '',
			ToAddress: '',
			ToContactNo: '',
			ToMobileNo: '',
			ToCitizenshipNo: '',
			ToCustomerType: null,
			ToRegdNO: '',
			ToAMC: false,
			ToWarranty: false,
			ToCustomerSerialNo: '',
			ToEmailId: '',
			ToLedgerId:0,
			FromLedgerId:0,
			FromParty: '',
			FromAddress: '',
			FromContactNo: '',
			FromMobileNo: '',
			FromCitizenshipNo: '',
			FromCustomerType: null,
			FromRegdNO: '',
			FromAMC: false,
			FromWarranty: false,
			FromCustomerSerialNo: '',
			FromEmailId: '',
		};

		angular.forEach($scope.EPColl, function (ep) {
			$scope.beData[ep.Name] = ep.DefaultValue;
		});
    }
	$scope.GetLabel = function (ep) {
		if ($scope.EPDet && $scope.EPDet[ep])
			return $scope.EPDet[ep].Label;
		else
			return "***Label***";
	}
	$scope.IsMandatory = function (ep) {
		if ($scope.EPDet && $scope.EPDet[ep])
			return $scope.EPDet[ep].IsMandatory;
		else
			return false;
	}

	$scope.VehicleSelectionChange = function (beData, index) {
		if (beData.vehicleDetail) {
			var det = beData.vehicleDetail;
			beData.VehicleTypeId = det.VehicleTypeId;
			beData.VehicleTypeName = det.VehicleTypeName;
			beData.ChassisNo = det.ChSrlNo;
			beData.VinNo = det.VinNo;
			beData.EngineNo = det.EngineNo;
			beData.ToRegdNO = det.RegdNo;
			beData.FromRegdNO = det.RegdNo;
			beData.FromLedgerId = det.PartyId;
		}
		$scope.FromPartySelectionChange(beData);
	}

	$scope.FromPartySelectionChange = function (partyDet) {
		var isModify = $scope.beData.TranId > 0 ? true : false;
		$scope.sideBarData = partyDet.partySideBarData;

		if (partyDet.FromLedgerId && partyDet.FromLedgerId > 0) {
			if (partyDet.PartyLedgerFrom) {
				$scope.beData.FromParty = partyDet.PartyLedgerFrom.Name;
			}
		} else {
			$scope.beData.FromParty = '';
		}
	};

	$scope.ToPartySelectionChange = function (partyDet) {
		var isModify = $scope.beData.TranId > 0 ? true : false;
		$scope.sideBarData = partyDet.partySideBarData;

		if (partyDet.ToLedgerId && partyDet.ToLedgerId > 0) {
			if (partyDet.PartyLedgerTo) {
				$scope.beData.ToParty = partyDet.PartyLedgerTo.Name;
			}
		} else {
			$scope.beData.ToParty = '';
		}
	};

	$scope.IsValidNewJobCard = function () {
		//if (!$scope.beData.Warranty) {
		//	Swal.fire('Please ! Select Warranty Status');
		//	return false;
		//}
		//if (!$scope.beData.AMC) {
		//	Swal.fire('Please ! Select AMC Status');
		//	return false;
		//}

		return true;
	}

	$scope.SavePartyTransfor = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();

		if ($scope.beData.EntryDateDet) {
			$scope.beData.EntryDate = $filter('date')(new Date($scope.beData.EntryDateDet.dateAD), 'yyyy-MM-dd');
			$scope.beData.NY = $scope.beData.EntryDateDet.NY;
			$scope.beData.NM = $scope.beData.EntryDateDet.NM;
			$scope.beData.ND = $scope.beData.EntryDateDet.ND;
		}
		//$scope.beData.BranchId = 1;
		/*$scope.beData.VehicleEntryId = 2;*/
		$http({
			method: 'POST',
			url: base_url + "Service/Transaction/SavePartyTransfor",
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

			if (res.data.IsSuccess == true) {
				$scope.ClearData();
				Swal.fire(res.data.ResponseMSG);
			} else
				Swal.fire(res.data.ResponseMSG);

		}, function (errormessage) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
		});
	}

	$scope.SearchDataColl = [];
	$scope.SearchData = function () {
		$scope.loadingstatus = 'running';
		showPleaseWait();
		var para = {
			
		};

		$http({
			method: 'POST',
			url: base_url + "Service/Transaction/GetAllPartyTransfor",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			$scope.loadingstatus = 'stop';
			hidePleaseWait();

			if (res.data.IsSuccess && res.data.Data) {
				$scope.SearchDataColl = res.data.Data;
				$scope.paginationOptions.TotalRows = res.data.TotalCount;
				$('#searVoucherRightBtn').modal('show');

			} else
				Swal.fire(res.data.ResponseMSG);

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	};

	$scope.GetTransactionById = function (beData) {
		$scope.loadingstatus = 'running';
		showPleaseWait();
		var para = {
			//TranId: beData.TranId,
			TranId: beData.VehicleEntryId,
			EngineNo: beData.EngineNo
		};

		$http({
			method: 'POST',
			url: base_url + "Service/Transaction/GetPartyTransforById",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			$scope.loadingstatus = 'stop';
			hidePleaseWait();

			if (res.data.IsSuccess && res.data.Data) {
				$scope.beData = res.data.Data;
				$('#searVoucherRightBtn').modal('hide');

			} else
				Swal.fire(res.data.ResponseMSG);

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	};

	$scope.GetVehiclePartyTransforById = function (beData) {
		$scope.loadingstatus = 'running';
		showPleaseWait();
		var para = {
			TranId: beData.TranId
		};

		$http({
			method: 'POST',
			url: base_url + "Service/Transaction/getVehiclePartyTransforById",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			$scope.loadingstatus = 'stop';
			hidePleaseWait();

			if (res.data.IsSuccess && res.data.Data) {
				$scope.beData = res.data.Data;
				$scope.beData.SearchOption = $scope.VehicleSearchOptions[1].value;
				if ($scope.beData.EntryDate) {
					$scope.beData.EntryDate_TMP = new Date($scope.beData.EntryDate);
				}
				$('#searVoucherRightBtn').modal('hide');

			} else
				Swal.fire(res.data.ResponseMSG);

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	};

	$scope.DelVehiclePartyTransforById = function (refData) {
		Swal.fire({
			title: 'Are you sure you want to delete ' + refData.EngineNo + '?',
			showCancelButton: true,
			confirmButtonText: 'Delete',
		}).then((result) => {
			if (result.isConfirmed) {
				var para = { TranId: refData.TranId };
				$http({
					method: 'POST',
					url: base_url + "Service/Transaction/DelVehiclePartyTransforById",
					dataType: "json",
					data: JSON.stringify(para)
				}).then(function (res) {
					hidePleaseWait();
					$scope.loadingStatus = "stop";
					if (res.data.IsSuccess) {
						$scope.SearchData();
						$scope.ClearData();
					}
					Swal.fire(res.data.ResponseMSG);

				}, function (reason) {
					Swal.fire('Failed' + reason);
				});
			}
		});
	}

});