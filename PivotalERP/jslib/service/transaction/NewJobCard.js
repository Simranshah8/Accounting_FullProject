app.controller('NewJobCard', function ($scope, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'NewJob Card';


	$scope.LoadData = function () {
		$('.select2').select2();
		$scope.confirmMSG = GlobalServices.getConfirmMSG();

		$scope.SiteLocationColl = [{ id: 1, text: 'Workshop' }, { id: 2, text: 'Doorstep' }, { id: 3, text: 'CCP' }, { id: 4, text: 'Service Camp' },]
		$scope.HideShow = {
			Branch: true,
			CostClass: true
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
		$scope.TranSearchOptions = [{ text: 'VinNo', value: 'VE.VinNo', searchType: 'text' }, { text: 'EngineNo', value: 'VE.EngineNo', searchType: 'text' }, { text: 'ChSrlNo', value: 'VE.ChSrlNo', searchType: 'text' }, { text: 'JobCardNo', value: 'JC.AutoNumber', searchType: 'text' }, { text: 'VoucherNo', value: 'JC.AutoManualNo', searchType: 'text' }, { text: 'RegdNo', value: 'JC.RegdNo', searchType: 'text' }, { text: 'Branch', value: 'B.Name', searchType: 'text' }, { text: 'EntryDate', value: 'JC.EntryDate', searchType: 'date' }, { text: 'PartyName', value: 'JC.PartyName', searchType: 'text' }];


		$scope.VehicleSearchOptions = [{ text: 'Vin No.', value: 'V.VinNo' }, { text: 'Engine No.', value: 'V.EngineNo' }, { text: 'Regd . No.', value: 'V.RegdNo' }, { text: 'Chassis/Serial No.', value: 'V.ChSrlNo' }];

		$scope.WarrantyColl = [{ id: true, text: 'Under Warranty' }, { id: false, text: 'Out Of Warranty' }];
		$scope.AMCColl = [{ id: true, text: 'Under AMC' }, { id: false, text: 'No AMC' }];

		$scope.beData =
		{
			SearchOption: $scope.VehicleSearchOptions[2].value,
			TranId: 0,
			BranchId: null,
			CostClassId: null,
			AutoNumber: 0,
			EntryDateTime_TMP: new Date(),
			EntryTime_TMP: new Date(),
			JobCardTime: '',
			EngineId: null,
			JobCardForId: null,
			Party: '',
			ServiceType: 1,
			JobCardType: null,
			TeamLeaderId: null,
			ServiceEngineerId: null,
			Warranty: false,
			AMC: false,
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
			DocumentColl: []
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
		$http({
			method: 'GET',
			url: base_url + "Service/Transaction/GetJobCardType",
			dataType: "json"
		}).then(function (res) {
			if (res.data.IsSuccess && res.data.Data) {
				$scope.JobCardTypeList = res.data.Data;
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

		$scope.ServiceTypeList = [];
		$scope.ServiceTypeList_Qry = [];
		$http({
			method: 'GET',
			url: base_url + "Service/Transaction/GetServiceType",
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

				angular.forEach($scope.TechnicianList, function (tec) {
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

	$scope.getVoucherNo = function () {
		if ($scope.beData.VoucherId > 0)
			$scope.SelectedVoucher = mx($scope.VoucherTypeColl).firstOrDefault(p1 => p1.VoucherId == $scope.beData.VoucherId);

		if ($scope.beData.BranchId > 0)
			$scope.SelectedBranch = mx($scope.BranchList).firstOrDefault(p1 => p1.BranchId == $scope.beData.BranchId);

		if ($scope.beData.CostClassId > 0)
			$scope.SelectedCostClass = mx($scope.CostClassColl).firstOrDefault(p1 => p1.CostClassId == $scope.beData.CostClassId);

		if ($scope.SelectedBranch && $scope.SelectedCostClass && $scope.SelectedVoucher) {
			$http({
				method: 'GET',
				url: base_url + "Account/Creation/GetVoucherModeById?voucherId=" + $scope.SelectedVoucher.VoucherId,
				dataType: "json"
			}).then(function (res) {

				$scope.loadingstatus = "stop";
				hidePleaseWait();

				if (res.data.IsSuccess && res.data.Data) {
					$scope.SelectedVoucher = res.data.Data;
				}

			}, function (reason) {
				Swal.fire('Failed' + reason);
			});
		}

		if ($scope.beData.VoucherId && $scope.beData.VoucherId > 0) {
			if ($scope.beData.CostClassId && $scope.beData.CostClassId > 0 && (!$scope.beData.TranId || $scope.beData.TranId == 0)) {

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
			EntryTime_TMP: new Date(),
			JobCardTime: '',
			EngineId: null,
			JobCardForId: null,
			Party: '',
			ServiceType: 1,
			JobCardType: null,
			TeamLeaderId: null,
			ServiceEngineerId: null,
			Warranty: false,
			AMC: false,
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
			JobTypeIdColl: [],
			CustomerSerialNo: '',
			JobFor: 3,
		};
		$scope.beData.CompalinDetailsColl.push({});

		$timeout(function () {
			$('#cboJobCardType').val(null).trigger('change');
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
	$scope.VehicleSelectionChange = function (data, index) {

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

			var findST = $scope.ServiceTypeList_Qry.firstOrDefault(p1 => p1.id == det.LastServiceType);
			if (findST)
				data.LastServiceType = findST.Text;
			else
				data.LastServiceType = det.LastServiceType;

			data.LastComplain = det.LastComplain;
			data.LastFeedBack = det.FeedBack;
			data.Last_Remarks = det.FeedBackRemarks;

			if (det.DateOfSale)
				data.DateOfSale_TMP = new Date(det.DateOfSale)
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
			data.LastDate_TMP = null;
			data.LastRunningHR = 0;
			data.LastRunningKM = 0;
			data.LastServiceType = '';
			data.LastComplain = '';
			data.LastFeedBack = '';
			data.Last_Remarks = '';

			data.DateOfSale_TMP = null;
		}
	}

	$scope.IsValidNewJobCard = function () {
		if (!$scope.SelectedBranch) {
			Swal.fire('Please ! Choose Branch');
			return false;
		}

		if (!$scope.SelectedCostClass) {
			Swal.fire('Please ! Choose Year');
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

		$scope.beData.BranchId = $scope.SelectedVoucher.BDId;

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
					mechanic = mechanic + findD.Name;
				}
			});

			$scope.beData.Mechanic = mechanic;
		}

		if ($scope.beData.ServiceTechnicianId > 0 && !$scope.beData.Mechanic) {
			var findD = $scope.TechnicianList_Qry.firstOrDefault(p1 => p1.TranId == $scope.beData.ServiceTechnicianId);
			if (findD) {
				$scope.beData.Mechanic = findD.Name;
			}
		}

		if ($scope.beData.EstimatedDateTime_TMP && $scope.beData.EstimatedDateDet) {
			var etime = $filter('date')(new Date($scope.beData.EstimatedDateTime_TMP), 'HH:mm');
			var edate = $filter('date')(new Date($scope.beData.EstimatedDateDet.dateAD), 'yyyy-MM-dd');;
			$scope.beData.EstimatedDateTime = edate + " " + etime;
		}


		if ($scope.beData.JobCardTypeIdColl) {
			$scope.beData.JobTypeIdColl = $scope.beData.JobCardTypeIdColl;
			$scope.beData.JobCardType = $scope.beData.JobCardTypeIdColl[0];
		}

		if ($scope.beData.DealerLedger) {
			$scope.beData.Dealer = $scope.beData.DealerLedger.Name;
		}

		$scope.beData.VoucherId = $scope.SelectedVoucher.VoucherId;
		$scope.beData.CostClassId = $scope.SelectedCostClass.CostClassId;
		$scope.beData.BranchId = $scope.SelectedVoucher.BDId;

		$http({
			method: 'POST',
			url: base_url + "Service/Transaction/SaveJobCard",
			headers: { 'Content-Type': undefined },
			transformRequest: function (data) {
				var formData = new FormData();
				formData.append("jsonData", angular.toJson(data.jsonData));

				//if (data.files) {
				//	for (var i = 0; i < data.files.length; i++) {
				//		formData.append("file" + i, data.files[i]);
				//	}
				//} 

				var find = 0;
				angular.forEach($scope.beData.DocumentColl, function (dc) {
					if (dc.File) {
						formData.append("file" + find, dc.File);
					}
					find++;
				});

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
		if ($scope.lastTranId > 0) {
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
							document.getElementById("frmRpt").src = base_url + "web/ReportViewer.aspx?rpttranid=" + rptTranId + "&istransaction=true&entityid=" + EntityId + "&tranid=" + TranId;
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
			forClosed: false,
			branchId: ($scope.SelectedVoucher ? $scope.SelectedVoucher.BDId : null),
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

								if ($scope.beData.EntryDateTime)
									$scope.beData.EntryTime_TMP = new Date($scope.beData.EntryDateTime);

								if ($scope.beData.DateOfSale)
									$scope.beData.DateOfSale_TMP = new Date($scope.beData.DateOfSale);

								if ($scope.beData.EstimatedDateTime) {
									$scope.beData.EstimatedDate_TMP = new Date($scope.beData.EstimatedDateTime);
									$scope.beData.EstimatedDateTime_TMP = new Date($scope.beData.EstimatedDateTime);
								}

								var idColl = [];

								if ($scope.beData.JobTypeIdColl) {
									$scope.beData.JobTypeIdColl.forEach(function (jt) {
										idColl.push(jt);
									});
								}

								$timeout(function () {
									$("#cboJobCardType").val($scope.beData.JobTypeIdColl).change();
								});


								//$timeout(function () {
								//	$("#cboMechanic").val($scope.beData.MechanicIdColl).change();
								//});

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
						$scope.ClearData();
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
		return curRow.BranchId == 0 || curRow.BranchId == $scope.SelectedVoucher.BDId || curRow.BranchId == $scope.SelectedBranch.BranchId;
	};


	$scope.AddMoreFiles = function (files, des) {
		if (files) {
			if (files != null) {
				angular.forEach(files, function (file) {
					$scope.beData.DocumentColl.push({
						File: file,
						Name: file.name,
						Type: file.type,
						Size: file.size,
						Description: des,
						Path: null
					});
				})
				$scope.attachFile = null;
				$scope.docDescription = '';
				$('#flMoreFiles').val('');
			}
		}
	};

	$scope.delAttachmentFiles = function (ind) {
		if ($scope.beData.DocumentColl) {
			if ($scope.beData.DocumentColl.length > 0) {
				$scope.beData.DocumentColl.splice(ind, 1);
			}
		}
	}

	$scope.ShowPersonalImg = function (item) {
		$scope.viewImg = {
			ContentPath: '',
			FileType: null
		};

		if (item.DocPath && item.DocPath.length > 0) {
			$scope.viewImg.ContentPath = item.DocPath;
			$scope.viewImg.FileType = 'pdf';  // Assuming DocPath is for PDFs
			document.getElementById('pdfViewer').src = item.DocPath;
			$('#PersonalImg').modal('show');
		} else if (item.PhotoPath && item.PhotoPath.length > 0) {
			$scope.viewImg.ContentPath = item.PhotoPath;
			$scope.viewImg.FileType = 'image';  // Assuming PhotoPath is for images
			$('#PersonalImg').modal('show');
		} else if (item.File) {
			var blob = new Blob([item.File], { type: item.File?.type });
			$scope.viewImg.ContentPath = URL.createObjectURL(blob);
			$scope.viewImg.FileType = item.File.type.startsWith('image/') ? 'image' : 'pdf';

			if ($scope.viewImg.FileType === 'pdf') {
				document.getElementById('pdfViewer').src = $scope.viewImg.ContentPath;
			}

			$('#PersonalImg').modal('show');
		} else {
			Swal.fire('No Image Found');
		}
	};

});