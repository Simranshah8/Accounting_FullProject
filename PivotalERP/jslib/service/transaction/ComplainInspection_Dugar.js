app.controller('ComplainInspection', function ($scope, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'Complain Inspection';


	$scope.LoadData = function () {
		$('.select2').select2();
		$scope.confirmMSG = GlobalServices.getConfirmMSG();

		$scope.HideShow = {
			Branch: true,
			CostClass: true
		};

		$scope.beData =
		{
			ComplainInspectionId: 0,
			InspectionNo: '',
			EngineId: null,
			JobNo: '',
			EntryDateTime_TMP: new Date(),
			EntryTime_TMP: new Date(),
			Remarks: '',
			EngineNo: '',
			chsrlNo: '',
			RegdNo: '',
			Party: '',
			ComplainInsColl: [],
			JobCardTypeId: null,
			Mode: 'Save'
        }

		$scope.SelectedBranch = null;
		$scope.SelectedCostClass = null;

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

		$scope.JobCardTypeList = [];
		$http({
			method: 'GET',
			url: base_url + "Service/Transaction/GetBillJobCardType",
			dataType: "json"
		}).then(function (res) {
			if (res.data.IsSuccess && res.data.Data) {
				$scope.JobCardTypeList = res.data.Data;
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


		$scope.InspectionTypeList = [];
		$scope.InspectionTypeList_Qry = [];
		$http({
			method: 'GET',
			url: base_url + "Service/Creation/GetInspectionType",
			dataType: "json"
		}).then(function (res) {
			if (res.data.IsSuccess && res.data.Data) {
				$scope.InspectionTypeList = res.data.Data;
				$scope.InspectionTypeList_Qry = mx(res.data.Data);
				 
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

		$scope.beData.ComplainInsColl.push({ Qty:1});
	}

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
					$scope.beData.TranId = 0;
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
					$scope.beData.VehicleTypeId = dt.VehicleTypeId;
					$scope.beData.VehicleModelId = dt.VehicleModelId;
					$scope.beData.JobCardOpenDateTime = dt.EntryDateTime;
					$scope.beData.ClosedDateTime = dt.ClosedDateTime;
					$scope.beData.JobCardTypeId = dt.JobCardType;

					$scope.beData.VinNo = dt.VinNo;
					$scope.beData.VehicleTypeName = dt.VehicleTypeName;
					$scope.beData.VehicleModelName = dt.VehicleModelName;

					if ($scope.beData.ComplainInsColl) {
						$scope.beData.ComplainInsColl.forEach(function (spd) {
							spd.JobCardTypeId = dt.JobCardType;							
						});
					}

					var para1 = {
						JobCardTranId: dt.TranId
					};
					$http({
						method: 'POST',
						url: base_url + "Service/Transaction/getComplainInspectionByJobCard",
						dataType: "json",
						data: JSON.stringify(para1)
					}).then(function (resCI) {

						$scope.loadingstatus = 'stop';
						hidePleaseWait();

						if (resCI.data.Data) {
							var inspection = resCI.data.Data;
							if (inspection.TranId > 0) {
								$scope.beData.TranId = inspection.TranId;
								$scope.beData.Remarks = inspection.Remarks;
								$scope.beData.EntryDateTime_TMP = new Date(inspection.EntryDate);

								$scope.beData.ComplainInsColl = [];
								inspection.DetailsColl.forEach(function (det) {
									det.IsModify = true;
									if (det.StartDateTime) {
										det.StartTime_TMP = new Date(det.StartDateTime);
										det.StartDate_TMP = new Date(det.StartDateTime);
									}
									
									if (det.EndDateTime) {
										det.EndTime_TMP = new Date(det.EndDateTime);
										det.EndDate_TMP = new Date(det.EndDateTime);
                                    }
										


									$scope.beData.ComplainInsColl.push(det);
								});

								if ($scope.beData.ComplainInsColl.length == 0) {
									$scope.beData.ComplainInsColl.push({});
								}
                            }
                        }
			 
					}, function (reason) {
						alert('Failed' + reason);
					});

				} else {
					$scope.beData.VehicleEntryId = 0;
					$scope.beData.ChassisNo = '';
					$scope.beData.EngineNo = '';
					$scope.beData.RegdNo = '';
					$scope.beData.Party = '';
					$scope.beData.Mechanic = '';
					$scope.beData.ChassisNo = '';
					$scope.beData.Tag = null;
					$scope.beData.JobCardId = null;
					$scope.beData.JobCardOpenDateTime = null;
					$scope.beData.ClosedDateTime = null;
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
	$scope.ClearComplainInspection = function () {

		var bid =$scope.beData.BranchId;
		var cid = $scope.beData.CostClassId;
		$scope.beData =
		{
			ComplainInspectionId: 0,
			InspectionNo: '',
			EngineId: null,
			JobNo: '',
			EntryDate: new Date(),
			Remarks: '',
			EngineNo: '',
			ChassisNo: '',
			RegdNo: '',
			Party: '',
			Mechanic: '',
			JobCardId: null,
			Tag:null,
			ComplainInsColl: [],
			JobCardTypeId: null,
			BranchId: bid,
			CostClassId: cid,
			Mode: 'Save'
		};
		$scope.beData.ComplainInsColl.push({ Qty:1 });
	}


	$scope.AddComplainInspectionDet = function (ind) {
		if ($scope.beData.ComplainInsColl) {
			if ($scope.beData.ComplainInsColl.length > ind + 1) {
				$scope.beData.ComplainInsColl.splice(ind + 1, 0, {
					Description: '',
					JobCardTypeId: $scope.beData.JobCardTypeId,
					Qty:1,
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
			curRow.Amount = (isEmptyAmt(curRow.Qty) * isEmptyAmt(curRow.LabourCharge))-isEmptyAmt(curRow.DiscountAmt,0);
		}
		else if (col == 'rate') {
			curRow.Amount = (isEmptyAmt(curRow.Qty) * isEmptyAmt(curRow.LabourCharge)) - isEmptyAmt(curRow.DiscountAmt, 0);
		}
		else if (col == 'amt') {
			curRow.LabourCharge = (isEmptyAmt(curRow.Amount) - isEmptyAmt(curRow.DiscountAmt, 0)) / isEmptyAmt(curRow.Qty) ;
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

	$scope.IsValidComplainInspection = function () {
		//if ($scope.beData.InspectionNo.isEmpty()) {
		//	Swal.fire('Please ! Enter InspectionNo');
		//	return false;
		//}
		return true;
	}

	$scope.ChangeInspectionType = function (curObj) {

		if (curObj.InspectionTypeId && curObj.InspectionTypeId > 0) {
			var findIns = $scope.InspectionTypeList_Qry.firstOrDefault(p1 => p1.InspectionTypeId == curObj.InspectionTypeId);
			if (findIns) {
				curObj.LabourCharge = findIns.LabourCharge;
            }
        }
		

    }
	$scope.AddComplainInspection = function () {
		if ($scope.IsValidComplainInspection() == true) {
			if ($scope.confirmMSG.Accept == true) {
				var saveModify = $scope.beData.Mode;
				Swal.fire({
					title: 'Do you want to ' + saveModify + ' the current data?',
					showCancelButton: true,
					confirmButtonText: saveModify,
				}).then((result) => {
					if (result.isConfirmed) {
						$scope.CallSaveUpdateComplainInspection();
					}
				});
			} else
				$scope.CallSaveUpdateComplainInspection();
		}
	};

	$scope.CallSaveUpdateComplainInspection = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();

		$scope.beData.DetailsColl = [];

		if ($scope.beData.EntryDateTimeDet) {
			$scope.beData.EntryDate = $filter('date')(new Date($scope.beData.EntryDateTimeDet.dateAD), 'yyyy-MM-dd');
		}
		else
			$scope.beData.EntryDate = $filter('date')(new Date(), 'yyyy-MM-dd');

		if($scope.beData.JobCardOpenDateTime)
			$scope.beData.JobCardOpenDateTime = $filter('date')(new Date($scope.beData.JobCardOpenDateTime), 'yyyy-MM-dd HH:mm');

		if ($scope.beData.ClosedDateTime)
			$scope.beData.ClosedDateTime = $filter('date')(new Date($scope.beData.ClosedDateTime), 'yyyy-MM-dd HH:mm');
		  
		angular.forEach($scope.beData.ComplainInsColl, function (det) {

			if (det.MechanicId > 0) {
				var findD = $scope.TechnicianList_Qry.firstOrDefault(p1 => p1.TranId == det.MechanicId);
				if (findD) {
					det.Mechanic = findD.Name;
				}
			}

			if (det.InspectionTypeId && det.InspectionTypeId > 0) {
				if (det.StartDateDet)
					det.StartDateTime = $filter('date')(new Date(det.StartDateDet.dateAD), 'yyyy-MM-dd');
				else
					det.StartDateTime = $filter('date')(new Date(), 'yyyy-MM-dd');

				if (det.EndDateDet)
					det.EndDateTime = $filter('date')(new Date(det.EndDateDet.dateAD), 'yyyy-MM-dd');
				else
					det.EndDateTime = $filter('date')(new Date(), 'yyyy-MM-dd');

				//yyyy-MM-dd HH:mm:ss
				if (det.StartTime_TMP)
					det.StartTime = $filter('date')(new Date(det.StartTime_TMP), 'HH:mm');
				else
					det.StartTime = "";

				if (det.EndTime_TMP)
					det.EndTime = $filter('date')(new Date(det.EndTime_TMP), 'HH:mm');
				else
					det.EndTime = "";

				if (det.StartTime && det.StartTime.length > 0)
					det.StartDateTime = det.StartDateTime + " " + det.StartTime;

				if (det.EndTime && det.EndTime.length > 0)
					det.EndDateTime = det.EndDateTime + " " + det.EndTime;

				//var find = $scope.InspectionTypeList_Qry.firstOrDefault(p1 => p1.InspectionTypeId == det.InspectionTypeId);

				det.InspectionTypeName = det.inspectionDetail ? det.inspectionDetail.Name : '';

				$scope.beData.DetailsColl.push(det);
            }
			
		});
		$http({
			method: 'POST',
			url: base_url + "Service/Transaction/SaveJobCardComplainInspection",
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
				$scope.ClearComplainInspection();
			}
		}, function (errormessage) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
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
});