app.controller('NewJobCard', function ($scope, $interval, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'NewJob Card';


	$scope.LoadData = function () {
		$('.select2').select2();
		$scope.confirmMSG = GlobalServices.getConfirmMSG();

		$scope.SiteLocationColl = [{ id: 1, text: 'Workshop' }, { id: 2, text: 'Doorstep' }, { id: 3, text: 'CCP' }, { id: 4, text: 'Service Camp' },]
		$scope.HideShow = {
			Branch: true,
			CostClass:true
		};
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
		$scope.TranSearchOptions = [{ text: 'VinNo', value: 'VE.VinNo', searchType: 'text' },{ text: 'EngineNo', value: 'VE.EngineNo', searchType: 'text' }, { text: 'ChSrlNo', value: 'VE.ChSrlNo', searchType: 'text' }, { text: 'JobCardNo', value: 'JC.AutoNumber', searchType: 'text' }, { text: 'VoucherNo', value: 'JC.AutoManualNo', searchType: 'text' },  { text: 'RegdNo', value: 'JC.RegdNo', searchType: 'text' }, { text: 'Branch', value: 'B.Name', searchType: 'text' }, { text: 'EntryDate', value: 'JC.EntryDate', searchType: 'date' }, { text: 'PartyName', value: 'JC.PartyName', searchType: 'text' }];


		$scope.VehicleSearchOptions = [ { text: 'Serial No.', value: 'V.EngineNo' }];

		$scope.WarrantyColl = [{ id: true, text: 'Under Warranty' }, { id: false, text: 'Out Of Warranty' }];
		$scope.AMCColl = [{ id: true, text: 'Under AMC' }, { id: false, text: 'No AMC' }];

		$scope.ActionTakenColl = [{ text: 'Customer Not Interested.' }, { text: 'Customer Agreed.' }];
		$scope.VechicleTypelist = [];
		$http({
			method: 'GET',
			url: base_url + "Service/Transaction/GetAllVehicleType",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.VechicleTypelist_Qry = mx(res.data.Data);
			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

		$scope.beData =
		{
			SearchOption:$scope.VehicleSearchOptions[0].value,
			TranId: 0,
			BranchId: null,
			CostClassId:null,
			AutoNumber: 0,
			EntryDateTime_TMP: new Date(),
			EntryTime_TMP:'',
			JobCardTime: '',
			EngineId: null,
			JobCardForId: null,
			Party: '',
			ServiceType: null,
			JobCardType: null,
			TeamLeaderId: null,
			ServiceEngineerId: null,
			Warranty: null,
			AMC: null,
			RunningHR: 0,
			RunningKM: 0,
			Complain: '',
			JobTobeAttended: '',
			Remarks: '',
			PartyMobileNo: '',
			DriverMobileNo: '',
			EstimatedTime: '',
			EstimatedCost: 0,
			DateOfSale: null,
			Dealer: '',
			SiteLocation: '',
			EngineNo: '',
			EchSrlNo: '',
			RegdNo: '',
			CustomerType: 2,
			LastJobNo: '',
			LastDate: null,
			LastHr: '',
			LastKm: '',
			LastServiceType: '',
			LastComplain: '',
			LastFeedBack: '',
			LastRemarks: '',
			CompalinDetailsColl: [],
			CustomerSerialNo: '',
			JobTypeIdColl:[],
			JobFor: 3,
			ComplainInsColl: [],			
			CloseRemarks: '',
			CloseNotes: '',
		};
		$scope.SelectedBranch = null;
		$scope.SelectedCostClass = null;
		$scope.SelectedVoucher = null;


		$scope.JobCardForList = [];
		$http({
			method: 'GET',
			url: base_url + "Service/Transaction/GetJobCardFor",
			dataType: "json"
		}).then(function (res) {
			if (res.data.IsSuccess && res.data.Data) {
				$scope.JobCardForList = res.data.Data;				 
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

		$scope.JobCardTypeList = [];
		$scope.JobCardTypeList_Qry = [];
		$http({
			method: 'GET',
			url: base_url + "Service/Transaction/GetJobCardType",
			dataType: "json"
		}).then(function (res) {
			if (res.data.IsSuccess && res.data.Data) {
				res.data.Data.forEach(function (jt) {
					if (jt.JobTypeId != 7) {
						$scope.JobCardTypeList.push(jt);
                    }					
                })
				
				$scope.JobCardTypeList_Qry = mx(res.data.Data);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

		$scope.ServiceTypeList = [];
		$scope.ServiceTypeList_Qry = [];
		$http({
			method: 'GET',
			//url: base_url + "Service/Transaction/GetServiceType",
			url: base_url + "Service/Creation/GetAllJobServiceType",
			dataType: "json"
		}).then(function (res) {
			if (res.data.IsSuccess && res.data.Data) {
				$scope.ServiceTypeList = res.data.Data;
				$scope.ServiceTypeList_Qry = mx(res.data.Data);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});


		$scope.TechnicianList = [];
		$scope.TeamLeaderColl = [];
		$scope.ServiceEngineerColl = [];
		$scope.MechanicColl = [];
		$scope.TechnicianList_Qry = [];
		$http({
			method: 'GET',
			url: base_url + "Service/Transaction/GetAllServiceTechniciane",
			dataType: "json"
		}).then(function (res) {
			if (res.data.IsSuccess && res.data.Data) {
				$scope.TechnicianList = res.data.Data;
				$scope.TechnicianList_Qry = mx(res.data.Data);

				angular.forEach($scope.TechnicianList, function (tec)
				{
					if (tec.JobTitleType == 'TEAM_LEADER') {
						$scope.TeamLeaderColl.push(tec);
					} else if (tec.JobTitleType == 'SERVICE_ENGINEER') {
						$scope.ServiceEngineerColl.push(tec);
					} else if (tec.JobTitleType == 'SERVICE_TECHNICIAN' || tec.JobTitleType == 'MECHANIC') {
						$scope.MechanicColl.push(tec);
					}
				});
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

		$scope.ComplainTypeList = [];
		$http({
			method: 'GET',
			url: base_url + "Service/Transaction/GetAllComplainType",
			dataType: "json"
		}).then(function (res) {
			if (res.data.IsSuccess && res.data.Data) {
				$scope.ComplainTypeList = res.data.Data;
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

		$scope.InspectionTypeGroupList = [];
		$http({
			method: 'GET',
			url: base_url + "Service/Creation/GetAllInspectionTypeGroup",
			dataType: "json"
		}).then(function (res) {
			if (res.data.IsSuccess && res.data.Data) {
				$scope.InspectionTypeGroupList = res.data.Data;

			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
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
				else if ($scope.BranchList && $scope.BranchList.length==1)
					$scope.HideShow.Branch = true;
				else
					$scope.HideShow.Branch = false;

				if($scope.BranchList.length>0) { 
					$scope.SelectedBranch = $scope.BranchList[0];
					$scope.beData.BranchId = $scope.SelectedBranch.BranchId;

					$scope.getVoucherNo();
                }
					
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});


		$http({
			method: 'GET',
			url: base_url + "Account/Creation/GetVoucherList?voucherType=" + VoucherType,
			dataType: "json"
		}).then(function (res) {
			if (res.data.IsSuccess && res.data.Data) {
				$scope.VoucherTypeColl = res.data.Data;

				$http({
					method: 'GET',
					url: base_url + "Account/Creation/GetCostClassForEntry",
					dataType: "json"
				}).then(function (res1) {
					if (res1.data.IsSuccess && res1.data.Data) {
						$scope.CostClassColl = res1.data.Data;

						$timeout(function () {
							$scope.$apply(function () {
								if ($scope.VoucherTypeColl.length > 0) {
									$scope.SelectedVoucher = $scope.VoucherTypeColl[0];
									$scope.beData.VoucherId = $scope.SelectedVoucher.VoucherId;
								}

								if ($scope.CostClassColl.length > 0) {
									$scope.SelectedCostClass = $scope.CostClassColl[0];
									$scope.beData.CostClassId = $scope.SelectedCostClass.CostClassId;
								}

								if ($scope.VoucherTypeColl.length <= 1)
									$scope.HideShow.VoucherType = true;
								else
									$scope.HideShow.VoucherType = false;

								if ($scope.CostClassColl.length <= 1)
									$scope.HideShow.CostClass = true;
								else
									$scope.HideShow.CostClass = false;

								$scope.getVoucherNo();
							});
						});


					}
				}, function (reason) {
					Swal.fire('Failed' + reason);
				});

			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
		 
		$scope.beData.CompalinDetailsColl.push({});

		$scope.beData.ComplainInsColl.push({});
		
	}

	$scope.AddNewJobCardDet = function (ind) {
		if ($scope.beData.CompalinDetailsColl) {
			if ($scope.beData.CompalinDetailsColl.length > ind + 1) {
				$scope.beData.CompalinDetailsColl.splice(ind + 1, 0, {
					Complain: ''
				})
			} else {
				$scope.beData.CompalinDetailsColl.push({
					Complain: ''
				})
			}
		}
	};

	$scope.delNewJobCardDet = function (ind) {
		if ($scope.beData.CompalinDetailsColl) {
			if ($scope.beData.CompalinDetailsColl.length > 1) {
				$scope.beData.CompalinDetailsColl.splice(ind, 1);
			}
		}
	};

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
	
	$scope.getVoucherNo = function ()
	{
		if ($scope.beData.VoucherId > 0)
			$scope.SelectedVoucher = mx($scope.VoucherTypeColl).firstOrDefault(p1 => p1.VoucherId == $scope.beData.VoucherId);

		if ($scope.beData.BranchId > 0)
			$scope.SelectedBranch = mx($scope.BranchList).firstOrDefault(p1 => p1.BranchId == $scope.beData.BranchId);

		if ($scope.beData.CostClassId > 0)
			$scope.SelectedCostClass = mx($scope.CostClassColl).firstOrDefault(p1 => p1.CostClassId == $scope.beData.CostClassId);

		if ($scope.SelectedBranch && $scope.SelectedCostClass && $scope.SelectedVoucher)
		{
			$http({
				method: 'GET',
				url: base_url + "Account/Creation/GetVoucherModeById?voucherId=" + $scope.SelectedVoucher.VoucherId,
				dataType: "json"
			}).then(function (res) {

				$scope.loadingstatus = "stop";
				hidePleaseWait();

				if (res.data.IsSuccess && res.data.Data)
				{
					$scope.SelectedVoucher = res.data.Data;
					//$scope.beData.LastBranch=$scope.SelectedVoucher.VoucherName;
				}

			}, function (reason) {
				Swal.fire('Failed' + reason);
			});


			$scope.DealerColl = [];
			$http({
				method: 'GET',
				url: base_url + "Service/Transaction/GetDealer?BranchId=" + $scope.SelectedVoucher.BDId,
				dataType: "json"
			}).then(function (res) {
				$scope.loadingstatus = "stop";
				hidePleaseWait();
				if (res.data.IsSuccess && res.data.Data) {
					$scope.DealerColl = res.data.Data; 
				}

			}, function (reason) {
				Swal.fire('Failed' + reason);
			});
		}

		if ($scope.beData.VoucherId && $scope.beData.VoucherId > 0)
		{
			if ($scope.beData.CostClassId && $scope.beData.CostClassId > 0 && (!$scope.beData.TranId || $scope.beData.TranId==0)) {

				$scope.loadingstatus = "running";
				showPleaseWait();

				var para = {
					voucherId: $scope.beData.VoucherId,
					costClassId: $scope.beData.CostClassId,
					voucherDate: $scope.beData.EntryDateTimeDet ? ($filter('date')(new Date($scope.beData.EntryDateTimeDet.dateAD)), 'yyyy-MM-dd') : new Date()
				};

				$http({
					method: 'POST',
					url: base_url + "Account/Creation/GetVoucherNo",
					dataType: "json",
					data: JSON.stringify(para)
				}).then(function (res) {

					$scope.loadingstatus = "stop";
					hidePleaseWait();

					if (res.data.IsSuccess && res.data.Data) {
						var vDet = res.data.Data;
						$scope.beData.AutoManualNo = vDet.AutoManualNo;
						$scope.beData.AutoNumber = vDet.AutoVoucherNo;
					} else {
						Swal.fire(res.data.ResponseMSG);
					}
				}, function (reason) {
					Swal.fire('Failed' + reason);
				});
			}
		} else {
			$scope.beData.AutoManualNo = '';
			$scope.beData.AutoVoucherNo = 0;
		}
    }
	$scope.ClearNewJobCard = function () {


		var sV = $scope.SelectedVoucher;
		var sC = $scope.SelectedCostClass;
		$scope.SelectedVoucher = null;
		$scope.SelectedCostClass = null;

		$scope.beData =
		{
			SearchOption: $scope.VehicleSearchOptions[0].value,
			TranId: 0,
			BranchId: null,
			CostClassId: null,
			AutoNumber: 0,
			EntryDateTime_TMP: new Date(),
			EntryTime_TMP: '',
			JobCardTime: '',
			EngineId: null,
			JobCardForId: null,
			Party: '',
			ServiceType: null,
			JobCardType: null,
			TeamLeaderId: null,
			ServiceEngineerId: null,
			Warranty: null,
			AMC: null,
			RunningHR: 0,
			RunningKM: 0,
			Complain: '',
			JobTobeAttended: '',
			Remarks: '',
			PartyMobileNo: '',
			DriverMobileNo: '',
			EstimatedTime: '',
			EstimatedCost: 0,
			DateOfSale: null,
			Dealer: '',
			SiteLocation: '',
			EngineNo: '',
			EchSrlNo: '',
			RegdNo: '',
			CustomerType: 2,
			LastJobNo: '',
			LastDate: null,
			LastHr: '',
			LastKm: '',
			LastServiceType: '',
			LastComplain: '',
			LastFeedBack: '',
			LastRemarks: '',
			CompalinDetailsColl: [],
			CustomerSerialNo: '',
			JobTypeIdColl: [],
			JobFor: 3,
			ComplainInsColl: [],			
			CloseRemarks: '',
			CloseNotes: '',
			JobCardTypeId:null,
			
		};
		$scope.beData.CompalinDetailsColl.push({});

		$scope.beData.CompalinDetailsColl.push({});

		$scope.beData.ComplainInsColl.push({});
		 
		//$timeout(function () {
		//	$('#cboJobCardType').val(null).trigger('change');
		//});


		$timeout(function () {
			$("#cboMechanic").val(null).change();
		});

		if ($scope.VoucherTypeColl.length > 0) {
			$scope.SelectedVoucher = $scope.VoucherTypeColl[0];
			$scope.beData.VoucherId = $scope.SelectedVoucher.VoucherId;
		}

		if ($scope.CostClassColl.length > 0) {
			$scope.SelectedCostClass = $scope.CostClassColl[0];
			$scope.beData.CostClassId = $scope.SelectedCostClass.CostClassId;
		}

		if (sV) {
			$scope.SelectedVoucher = sV;
			$scope.beData.VoucherId = sV.VoucherId;
		}

		if (sC) {
			$scope.SelectedCostClass = sC;
			$scope.beData.CostClassId = sC.CostClassId;
		}

		$timeout(function () {
			$scope.getVoucherNo();
		});

		

	}


	$scope.lastPartyLedgerId = null;
	$scope.PartySelectionChange = function (partyDet) {
		var isModify = $scope.beData.TranId > 0 ? true : false;
		$scope.sideBarData = partyDet.partySideBarData;		

		if (partyDet.PartyId && partyDet.PartyId > 0) {
			if (partyDet.PartyLedger) {
				 
				$scope.beData.PartyMobileNo = partyDet.PartyLedger.MobileNo1;
				$scope.beData.PhoneNo = partyDet.PartyLedger.MobileNo1;
				$scope.beData.Party = partyDet.PartyLedger.Name;
				$scope.beData.Address = partyDet.PartyLedger.Address;
			}
			  

		} else {
			$scope.beData.PartyMobileNo = '';
			$scope.beData.PhoneNo = '';
			$scope.beData.Party = '';
			$scope.beData.Address = '';		 
		}
	};

	$scope.DealerSelectionChange = function (partyDet) {
		var isModify = $scope.beData.TranId > 0 ? true : false;
		$scope.sideBarData = partyDet.partySideBarData;

		if (partyDet.PartyId && partyDet.PartyId > 0) {
			if (partyDet.PartyLedger) {

				//$scope.beData.PartyMobileNo = partyDet.PartyLedger.MobileNo1;
				//$scope.beData.PhoneNo = partyDet.PartyLedger.MobileNo1;
				//$scope.beData.Party = partyDet.PartyLedger.Name;
				//$scope.beData.Address = partyDet.PartyLedger.Address;
			}


		} else {
			//$scope.beData.PartyMobileNo = '';
			//$scope.beData.PhoneNo = '';
			//$scope.beData.Party = '';
			//$scope.beData.Address = '';
		}
	};
	$scope.VehicleSelectionChange = function (data, index) {
		//TODO: DealerName at Last Job Details Via Delare Select
		//if (data.DealerId) {
		//	if (data.DealerLedger) {
		//		var D = data.DealerLedger;
		//		$scope.beData.Last_Dealer = D.Name;
		//	} else {
		//		$scope.beData.Last_Dealer = '';
		//	}
  //      }
		if (data.vehicleDetail) {
			var det = data.vehicleDetail;
			data.VehicleTypeName = det.VehicleTypeName;
			data.VehicleModelName = det.VehicleModelName;
			data.VinNo = det.VinNo;
			data.EngineNo = det.EngineNo;
			data.ChSrlNo = det.ChSrlNo;
			data.Warranty = det.Warranty;

			if (data.TranId > 0) {

			} else {
				data.Party = det.Party;
				data.RegdNo = det.RegdNo;
				data.PartyId = det.PartyId;
				data.Address = det.PartyAddress;
				data.PartyMobileNo = det.ContactNo;
				data.CustomerType = det.CustomerType;
				data.CustomerSerialNo = det.CustomerSerialNo;
            }
			

			data.Last_JobNo = det.LastJobNo;
			data.Last_JobAutoManualNo = det.AutoManualNo;
			data.LastDate_TMP = det.LastJobDate;
			data.LastRunningHR = det.LastRunningHR;
			data.LastRunningKM = det.LastRunningKM;
			//For Branch and Dealer
			data.LastBranch = det.BranchName;
			data.Last_Dealer = det.Dealer;

			var findST = $scope.ServiceTypeList_Qry.firstOrDefault(p1 => p1.id == det.LastServiceType);
			if(findST)
				data.LastServiceType = findST.Text;
			else
				data.LastServiceType = det.LastServiceType;

			data.LastComplain = det.LastComplain;
			data.LastFeedBack = det.FeedBack;
			data.Last_Remarks = det.FeedBackRemarks;
			data.TotalDays = det.TotalDays;
			data.VehicleTypeId = det.VehicleTypeId;

			if (det.DateOfSale) {
				data.DateOfSale_TMP = new Date(det.DateOfSale)
				$scope.beData.Warranty = true;
				$scope.beData.AMC = true;
				var findVT = $scope.VechicleTypelist_Qry.firstOrDefault(p1 => p1.VehicleTypeId == det.VehicleTypeId);
				if (findVT) {
					var wDays = isEmptyAmt(findVT.WarrantyDays);
					var tDays = isEmptyAmt(det.TotalDays);
					var wHR = isEmptyAmt(findVT.WarrantyHR);
					var wKM = isEmptyAmt(findVT.WarrantyKM);
					if (wDays > 0 && tDays > wDays) {
						$scope.beData.Warranty = false;
						$scope.beData.AMC = false;
					}
					else if (wHR > 0 && det.LastRunningHR > wHR) {
						$scope.beData.Warranty = false;
						$scope.beData.AMC = false;
					}
					else if (wKM > 0 && det.LastRunningKM > wHR) {
						$scope.beData.Warranty = false;
						$scope.beData.AMC = false;
					}
                }
            }
				
		} else {
			data.VehicleTypeName = '';
			data.VehicleModelName = '';
			data.EngineNo = '';
			data.ChSrlNo = '';
			data.Party = '';
			data.RegdNo = '';
			data.PartyId = 0;
			data.Address = '';
			data.PartyMobileNo = '';
			data.CustomerType = 2;
			data.CustomerSerialNo = '';

			data.Last_JobNo = '';
			data.LastDate_TMP =null;
			data.LastRunningHR = 0;
			data.LastRunningKM = 0;
			data.LastServiceType = '';
			data.LastComplain = '';
			data.LastFeedBack = '';
			data.Last_Remarks = '';
			 
			data.DateOfSale_TMP = null;
        }
	}
	//startLiveClock();

	//function startLiveClock() {
	//	// Keep ticking every second
	//	$interval(function () {
	//		var now = new Date();
	//		$scope.beData.EntryTime_TMP = $filter('date')(now, 'HH:mm:ss');
	//	}, 1000); // every 1000 ms = 1 sec
	//}

	$scope.CheckIsWarranty = function () {
		$scope.beData.Warranty = true;
		$scope.beData.AMC = true;
		var findVT = $scope.VechicleTypelist_Qry.firstOrDefault(p1 => p1.VehicleTypeId == $scope.beData.VehicleTypeId);
		if (findVT) {
			var wDays = isEmptyAmt(findVT.WarrantyDays);
			var tDays = isEmptyAmt(findVT.TotalDays);
			var wHR = isEmptyAmt(findVT.WarrantyHR);
			var wKM = isEmptyAmt(findVT.WarrantyKM);
			if (wDays > 0 && tDays > wDays) {
				$scope.beData.Warranty = false;
				$scope.beData.AMC = false;
			}
			else if (wHR > 0 && $scope.beData.RunningHR > wHR) {
				$scope.beData.Warranty = false;
				$scope.beData.AMC = false;
			}
			else if (wKM > 0 && $scope.beData.RunningKM > wHR) {
				$scope.beData.Warranty = false;
				$scope.beData.AMC = false;
			}
		}
    }
	$scope.IsValidNewJobCard  = function () {
		if (!$scope.SelectedBranch) {
			Swal.fire('Please ! Choose Branch');
			return false;
		}

		if (!$scope.SelectedCostClass) {
			Swal.fire('Please ! Choose Year');
			return false;
		}
		if ($scope.beData.Warranty == null || $scope.beData.Warranty==undefined) {
			Swal.fire('Please ! Select Warranty Status');
			return false;
		}
		if ($scope.beData.AMC == null || $scope.beData.AMC==undefined) {
			Swal.fire('Please ! Select AMC Status');
			return false;
		}

		return true;
	}

	$scope.AddNewJobCard = function () {
		if ($scope.IsValidNewJobCard() == true) {
			if ($scope.confirmMSG.Accept == true) {
				var saveModify = $scope.beData.Mode;
				Swal.fire({
					title: 'Do you want to ' + saveModify + ' the current data?',
					showCancelButton: true,
					confirmButtonText: saveModify,
				}).then((result) => {
					if (result.isConfirmed) {
						$scope.CallSaveUpdateNewJobCard();
					}
				});
			} else
				$scope.CallSaveUpdateNewJobCard();
		}
	};

	$scope.CallSaveUpdateNewJobCard = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();

		var filesColl = $scope.beData.AttechFiles;
		$scope.beData.AttechFiles = [];

		$scope.beData.JobTypeIdColl = [];

		$scope.beData.BranchId=$scope.SelectedVoucher.BDId;

		if ($scope.beData.EntryDateTimeDet) {
			$scope.beData.EntryDate = $filter('date')(new Date($scope.beData.EntryDateTimeDet.dateAD), 'yyyy-MM-dd');
		}

		if ($scope.beData.NextServiceDateDet) {
			$scope.beData.NextServiceDate = $filter('date')(new Date($scope.beData.NextServiceDateDet.dateAD), 'yyyy-MM-dd');
		}

		if ($scope.beData.DateOfSaleDet) {
			$scope.beData.DateOfSale = $filter('date')(new Date($scope.beData.DateOfSaleDet.dateAD), 'yyyy-MM-dd');
		}

		if ($scope.beData.EntryTime_TMP) {
			$scope.beData.EntryDateTime = $filter('date')(new Date($scope.beData.EntryTime_TMP), 'yyyy-MM-dd HH:mm');
		}

		if ($scope.beData.TeamLeaderId > 0) {
			var findD = $scope.TechnicianList_Qry.firstOrDefault(p1 => p1.TranId == $scope.beData.TeamLeaderId);
			if (findD) {
				$scope.beData.ServiceAdvisor = findD.Name;
            }
		}

		if ($scope.beData.MechanicId > 0) {
			var findD = $scope.TechnicianList_Qry.firstOrDefault(p1 => p1.TranId == $scope.beData.MechanicId);
			if (findD) {
				$scope.beData.Mechanic = findD.Name;
			}
		}

		if ($scope.beData.MechanicIdColl && $scope.beData.MechanicIdColl.length > 0) {

			var mechanic = "";
			$scope.beData.MechanicIdColl.forEach(function (mc) {

				if (mechanic.length > 0)
					mechanic = mechanic + ',';

				var findD = $scope.TechnicianList_Qry.firstOrDefault(p1 => p1.TranId == mc);
				if (findD) {
					mechanic = mechanic+ findD.Name;
				}
			});

			$scope.beData.SupportingMechanic = mechanic;
        }

		//if ($scope.beData.ServiceTechnicianId > 0 && !$scope.beData.Mechanic) {
		//	var findD = $scope.TechnicianList_Qry.firstOrDefault(p1 => p1.TranId == $scope.beData.ServiceTechnicianId);
		//	if (findD) {
		//		$scope.beData.Mechanic = findD.Name;
		//	}
		//}

		if ($scope.beData.EstimatedDateTime_TMP) {
			$scope.beData.EstimatedDateTime = $filter('date')(new Date($scope.beData.EstimatedDateTime_TMP), 'yyyy-MM-dd HH:mm');
		}

		if ($scope.beData.EstimatedDateDet) {
			$scope.beData.EstimatedDate = $filter('date')(new Date($scope.beData.EstimatedDateDet.dateAD), 'yyyy-MM-dd');
		}

		if ($scope.beData.JobCardTypeIdColl) {

			if ($scope.beData.JobCardTypeIdColl && $scope.beData.JobCardTypeIdColl > 0) {
				$scope.beData.JobTypeIdColl.push($scope.beData.JobCardTypeIdColl);
            }
			//$scope.beData.JobTypeIdColl = $scope.beData.JobCardTypeIdColl;
			$scope.beData.JobCardType = $scope.beData.JobCardTypeIdColl[0];
        }

		if ($scope.beData.JobCardTypeId && $scope.beData.JobCardTypeId > 0) {
			$scope.beData.JobCardType = $scope.beData.JobCardTypeId;
			$scope.beData.JobTypeIdColl.push($scope.beData.JobCardTypeId);
			var findJT = $scope.JobCardTypeList_Qry.firstOrDefault(p1 => p1.id == $scope.beData.JobCardTypeId);
			if (findJT) {
				$scope.beData.JobCardTypeName = findJT.text;
            }
        }

		if ($scope.beData.DealerLedger) {
			$scope.beData.Dealer = $scope.beData.DealerLedger.Name;
        }

		$scope.beData.VoucherId = $scope.SelectedVoucher.VoucherId;
		$scope.beData.CostClassId = $scope.SelectedCostClass.CostClassId;
		$scope.beData.BranchId = $scope.SelectedVoucher.BDId;
				 
		$scope.beData.IsRepairCenter = true;
		$http({
			method: 'POST',
			url: base_url + "Service/Transaction/SaveJobCard",
			headers: { 'Content-Type': undefined },
			transformRequest: function (data) {
				var formData = new FormData();
				formData.append("jsonData", angular.toJson(data.jsonData));

				if (data.files) {
					for (var i = 0; i < data.files.length; i++) {
						formData.append("file" + i, data.files[i]);
					}
				} 

				return formData;
			},
			data: { jsonData: $scope.beData, files: filesColl }
		}).then(function (res) {
			$scope.loadingstatus = "stop";
			hidePleaseWait();
			
			if (res.data.IsSuccess == true) {

				$scope.lastTranId = res.data.Data.RId;				
				$scope.ClearNewJobCard();
				$scope.Print();
			} else
				Swal.fire(res.data.ResponseMSG);

		}, function (errormessage) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
		});
	}

	$scope.Print = function () {
		if ($scope.lastTranId>0 ) {
			var TranId = $scope.lastTranId;
			  
			$http({
				method: 'GET',
				url: base_url + "ReportEngine/GetReportTemplates?entityId=" + EntityId + "&voucherId=0&isTran=true",
				dataType: "json"
			}).then(function (res) {
				if (res.data.IsSuccess && res.data.Data) {
					var templatesColl = res.data.Data;
					if (templatesColl && templatesColl.length > 0) {
						var templatesName = [];
						var sno = 1;
						angular.forEach(templatesColl, function (tc) {
							templatesName.push(sno + '-' + tc.ReportName);
							sno++;
						});

						var printDone = false;

						var rptTranId = 0;
						if (templatesColl.length == 1)
							rptTranId = templatesColl[0].RptTranId;
						else {
							Swal.fire({
								title: 'Report Templates For Print',
								input: 'select',
								inputOptions: templatesName,
								inputPlaceholder: 'Select a template',
								showCancelButton: true,
								inputValidator: (value) => {
									return new Promise((resolve) => {
										if (value >= 0) {
											resolve()
											rptTranId = templatesColl[value].RptTranId;

											printDone = true;
											if (rptTranId > 0) {
												document.body.style.cursor = 'wait';
												document.getElementById("frmRpt").src = '';
												document.getElementById("frmRpt").src = base_url + "web/ReportViewer.aspx?rpttranid=" + rptTranId + "&istransaction=true&entityid=" + EntityId + "&tranid=" + TranId;
												document.body.style.cursor = 'default';
												$('#FrmPrintReport').modal('show');

											}
										} else {
											resolve('You need to select:)')
										}
									})
								}
							})
						}

						if (rptTranId > 0) {
							 

							document.body.style.cursor = 'wait';
							document.getElementById("frmRpt").src = '';
							document.getElementById("frmRpt").src = base_url + "web/ReportViewer.aspx?rpttranid=" + rptTranId + "&istransaction=true&entityid=" + EntityId  + "&tranid=" + TranId ;
							document.body.style.cursor = 'default';
							$('#FrmPrintReport').modal('show');
 
						}

					} else
						Swal.fire('No Templates found for print');
				}
			}, function (reason) {
				Swal.fire('Failed' + reason);
			});
			 
		}
	};


	$scope.SearchDataColl = [];
	$scope.SearchData = function () {

		$scope.loadingstatus = 'running';
		showPleaseWait();
		$scope.paginationOptions.TotalRows = 0;

		var sCol = $scope.paginationOptions.SearchColDet;

		var para = {
			forClosed:false,
			branchId: ($scope.SelectedVoucher ? $scope.SelectedVoucher.BDId : null),
			costClassId:($scope.SelectedCostClass ? $scope.SelectedCostClass.CostClassId : null),
			filter: {
				DateFrom: null,
				DateTo: null,
				PageNumber: $scope.paginationOptions.pageNumber,
				RowsOfPage: $scope.paginationOptions.pageSize,
				SearchCol: (sCol ? sCol.value : ''),
				SearchVal: $scope.paginationOptions.SearchVal,
				SearchType: (sCol ? sCol.searchType : 'text')
			}
		};

		$http({
			method: 'POST',
			url: base_url + "Service/Transaction/GetJobCardLst",
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
				alert(res.data.ResponseMSG);

		}, function (reason) {
			alert('Failed' + reason);
		});


	};

	$scope.ReSearchData = function (pageInd) {
		if (pageInd && pageInd >= 0)
			$scope.paginationOptions.pageNumber = pageInd;
		else if (pageInd == -1)
			$scope.paginationOptions.pageNumber = 1;

		$scope.loadingstatus = 'running';
		showPleaseWait();
		$scope.paginationOptions.TotalRows = 0;
		var sCol = $scope.paginationOptions.SearchColDet;

		var para = {
			forClosed: false,
			branchId: ($scope.SelectedBranch ? $scope.SelectedBranch.BranchId : null),
			costClassId: ($scope.SelectedCostClass ? $scope.SelectedCostClass.CostClassId : null),
			filter: {
				DateFrom: null,
				DateTo: null,
				PageNumber: $scope.paginationOptions.pageNumber,
				RowsOfPage: $scope.paginationOptions.pageSize,
				SearchCol: (sCol ? sCol.value : ''),
				SearchVal: $scope.paginationOptions.SearchVal,
				SearchType: (sCol ? sCol.searchType : 'text')
			}
		};

		$http({
			method: 'POST',
			url: base_url + "Service/Transaction/GetJobCardLst",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			$scope.loadingstatus = 'stop';
			hidePleaseWait();

			if (res.data.IsSuccess && res.data.Data) {
				$scope.SearchDataColl = res.data.Data;
				$scope.paginationOptions.TotalRows = res.data.TotalCount;

			} else
				alert(res.data.ResponseMSG);

		}, function (reason) {
			alert('Failed' + reason);
		});

	}
	$scope.PrintVoucher = function (tranId) {
		$scope.lastTranId = tranId;
		$scope.Print();
	}


	$scope.GetTransactionById = function (tran) {
		$timeout(function () {

			if (tran.TranId && tran.TranId > 0) {
				var para = {
					tranId: tran.TranId
				};

				$scope.ClearNewJobCard();

				$timeout(function () {
					$http({
						method: 'POST',
						url: base_url + "Service/Transaction/GetJobCardById",
						dataType: "json",
						data: JSON.stringify(para)
					}).then(function (res) {
						$timeout(function () {
							if (res.data.IsSuccess && res.data.Data) {
								$scope.beData = res.data.Data;
								
								if ($scope.beData.EntryDate)
									$scope.beData.EntryDateTime_TMP = new Date($scope.beData.EntryDate);

								if ($scope.beData.NextServiceDate)
									$scope.beData.NextServiceDate_TMP = new Date($scope.beData.NextServiceDate);

								if ($scope.beData.EntryDateTime)
									$scope.beData.EntryTime_TMP = new Date($scope.beData.EntryDateTime);

								if ($scope.beData.EstimatedDateTime) {
									$scope.beData.EstimatedDateTime_TMP = new Date($scope.beData.EstimatedDateTime);
									$scope.beData.EstimatedDate_TMP = new Date($scope.beData.EstimatedDateTime);
                                }
									 
								if ($scope.beData.DateOfSale)
									$scope.beData.DateOfSale_TMP = new Date($scope.beData.DateOfSale);

								var idColl = [];

								if ($scope.beData.JobTypeIdColl) {
									$scope.beData.JobTypeIdColl.forEach(function (jt) {
										$scope.beData.JobCardTypeId = jt;
										idColl.push(jt);
									});
                                }

								//$timeout(function () {									
								//	$("#cboJobCardType").val($scope.beData.JobTypeIdColl).change();
								//});


								$timeout(function () {
									$("#cboMechanic").val($scope.beData.MechanicIdColl).change();
								});

								$('#searVoucherRightBtn').modal('hide');
							} else
								Swal.fire(res.data.ResponseMSG);
						});
					}, function (reason) {
						Swal.fire('Failed' + reason);
					});
				});
				
			}
		});
	}

	$scope.DelTransactionById = function (tran) {
		Swal.fire({
			title: 'Are you sure you want to delete selected transaction ' + tran.VoucherNo + '?',
			showCancelButton: true,
			confirmButtonText: 'Delete',
			//message: 'Are you sure to delete selected Branch :-' + beData.Name,
		}).then((result) => {
			if (result.isConfirmed) {
				$scope.loadingstatus = "running";
				showPleaseWait();
				var para = { 
					tranId: tran.TranId
				};
				$http({
					method: 'POST',
					url: base_url + "Service/Transaction/DelJobCard",
					dataType: "json",
					data: JSON.stringify(para)
				}).then(function (res) {
					hidePleaseWait();
					$scope.loadingstatus = "stop";
					Swal.fire(res.data.ResponseMSG);
					if (res.data.IsSuccess == true) {
						$scope.ClearNewJobCard();
						$scope.ReSearchData(-1);
					}
				}, function (reason) {
					Swal.fire('Failed' + reason);

				});
			}

		});
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

	$scope.BranchFilter = function (curRow) {
		if (!curRow) return true;
		return curRow.BranchId == 1 || curRow.BranchId == 0 || curRow.BranchId == ($scope.SelectedVoucher ? $scope.SelectedVoucher.BDId : 0) ;
		//return curRow.BranchId == 1 || curRow.BranchId == 0 || curRow.BranchId == ($scope.SelectedVoucher ? $scope.SelectedVoucher.BDId : 0) || curRow.BranchId == ($scope.SelectedBranch ? $scope.SelectedBranch.BranchId : 0);
	};
	// Done: Add Hide and unhide 
	//Done: Chidl table function add
	$scope.showLastJobDetails = false;
	$scope.ToggleLastJobDetails = function () {
		$scope.showLastJobDetails = !$scope.showLastJobDetails;
	};
	$scope.showComplain = true;
	$scope.ToggleComplain = function () {
		$scope.showComplain = !$scope.showComplain;
	};
	$scope.showComplainInspectionDetails = true;
	$scope.ToggleComplainInspectionDetails = function () {
		$scope.showComplainInspectionDetails = !$scope.showComplainInspectionDetails;
	};
	$scope.showSparePartsDemand = true;
	$scope.ToggleSparePartsDemand = function () {
		$scope.showSparePartsDemand = !$scope.showSparePartsDemand;
	};
	$scope.showCloseJobCard = true;
	$scope.ToggleCloseJobCard = function () {
		$scope.showCloseJobCard = !$scope.showCloseJobCard;
	};


	$scope.InspectionSelectionChange = function (item, ind) {
		console.log(item);
		if (item.IsModify == true) {
		}
		else {
			if (item.inspectionDetail && item.inspectionDetail.InspectionTypeId > 0) {
				item.LabourCharge = item.inspectionDetail.LabourCharge;
				$timeout(function () {
					$scope.$apply(function () {
						item.GroupId = item.inspectionDetail.GroupId;
					});
				});
			} else
				item.LabourCharge = 0;
			$scope.ChangeItemRow(item, 'qty');
		}

	}


	$scope.AddComplainInspectionDet = function (ind) {
		if ($scope.beData.ComplainInsColl) {
			if ($scope.beData.ComplainInsColl.length > ind + 1) {
				$scope.beData.ComplainInsColl.splice(ind + 1, 0, {
					Description: '',
					JobCardTypeId: $scope.beData.JobCardTypeId,
					Qty: 1,
				})
			} else {
				$scope.beData.ComplainInsColl.push({
					Description: '',
					JobCardTypeId: $scope.beData.JobCardTypeId,
					Qty: 1,
				})
			}
		}
	};

	$scope.ChangeItemRow = function (curRow, col) {

		if (col == 'qty') {
			curRow.Amount = (isEmptyAmt(curRow.Qty) * isEmptyAmt(curRow.LabourCharge)) - isEmptyAmt(curRow.DiscountAmt, 0);
		}
		else if (col == 'rate') {
			curRow.Amount = (isEmptyAmt(curRow.Qty) * isEmptyAmt(curRow.LabourCharge)) - isEmptyAmt(curRow.DiscountAmt, 0);
		}
		else if (col == 'amt') {
			curRow.LabourCharge = (isEmptyAmt(curRow.Amount) - isEmptyAmt(curRow.DiscountAmt, 0)) / isEmptyAmt(curRow.Qty);
		}
		else if (col == 'discountAmt') {
			curRow.Amount = (isEmptyAmt(curRow.Qty) * isEmptyAmt(curRow.LabourCharge)) - isEmptyAmt(curRow.DiscountAmt, 0);
		}

	}
	$scope.delComplainInspectionDet = function (ind) {
		if ($scope.beData.ComplainInsColl) {
			if ($scope.beData.ComplainInsColl.length > 1) {
				$scope.beData.ComplainInsColl.splice(ind, 1);
			}
		}
	};
	 

	$scope.InspectionSelectionChange = function (item, ind) {
		console.log(item);
		if (item.IsModify == true) {
		}
		else {
			if (item.inspectionDetail && item.inspectionDetail.InspectionTypeId > 0) {
				item.LabourCharge = item.inspectionDetail.LabourCharge;
				$timeout(function () {
					$scope.$apply(function () {
						item.GroupId = item.inspectionDetail.GroupId;
					});
				});

			} else
				item.LabourCharge = 0;
			$scope.ChangeItemRow(item, 'qty');
		}
	}


	$scope.AProductSelectionChange = function (itemDet, ind) {
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
		} else if (itemDet.aproductDetail) {
			itemDet.CanEditRate = itemDet.aproductDetail.CanEditRatePurchase;
			itemDet.AClosingQty = $filter('formatNumber')(itemDet.aproductDetail.ClosingQty) + ' ' + itemDet.aproductDetail.BaseUnit;

			itemDet.UnitId = itemDet.aproductDetail.BaseUnitId;
			itemDet.UnitName = itemDet.aproductDetail.BaseUnit;

			var refStockItem = false;
			if (itemDet.DTranId > 0) {
				refStockItem = true;
			}

			itemDet.Rate = itemDet.aproductDetail.SalesRate;
			itemDet.ProductLedgerId = itemDet.aproductDetail.SalesLedgerId;
			itemDet.LedgerId = itemDet.aproductDetail.SalesLedgerId;

			itemDet.Makeing = 0;
			itemDet.Stone = 0;
			itemDet.BatchBalQty = 0;
			itemDet.FineRate = 0;
			itemDet.FineWeight = 0;
			itemDet.ProcessingRate = 0;
			itemDet.ProcessingWeight = 0;


			var findUnit = $scope.UnitColl.firstOrDefault(p1 => p1.UnitId == itemDet.aproductDetail.BaseUnitId);
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

			itemDet.LossRate = itemDet.aproductDetail.LossRate;
			$scope.ChangeItemRowValue(itemDet, 'product');

			//var itemC = mx($scope.beData.ItemDetailsColl).where(p1 => p1.RowType == 'P').count();
			//if (ind == (itemC - 1))
			//	$scope.AddSparePartDet(ind);

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


});