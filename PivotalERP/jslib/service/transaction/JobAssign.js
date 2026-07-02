app.controller('JobAssign', function ($scope, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'Job Assign';


	$scope.LoadData = function () {
		$('.select2').select2();
		$scope.confirmMSG = GlobalServices.getConfirmMSG();

		$scope.HideShow = {
			Branch: true,
			CostClass: true
		};


		$scope.beData =
		{
			TranId: 0,
			JobNo: '',
			Mechanic: '',
			EntryDateTime_TMP: new Date(),
			EntryTime_TMP: new Date(),
			AssignTime: '',
			EngineNo: '',
			ChSrlNo: '',
			RegdNo: '',
			Party: '',
			ServiceEngineerId: null,
			ArrivalDate: new Date(),
			ArrivalTime: '',
			Remarks: '',
            Mode: 'Save'
		};

		$scope.SelectedBranch = null;
		$scope.SelectedCostClass = null;

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


		$scope.TechnicianList = [];	 
		$http({
			method: 'GET',
			url: base_url + "Service/Transaction/GetAllServiceTechniciane",
			dataType: "json"
		}).then(function (res) {
			if (res.data.IsSuccess && res.data.Data) {
				var dtColl = res.data.Data;
				angular.forEach(dtColl, function (tec) {
				   if (tec.JobTitleType == 'SERVICE_TECHNICIAN' || tec.JobTitleType == 'MECHANIC') {
					   $scope.TechnicianList.push(tec);
					}
				});
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

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
					$scope.beData.ServiceTechnician = dt.ServiceTechnician;
					$scope.beData.TeamLeader = dt.TeamLeader;
					$scope.beData.ServiceTechnicianId = dt.ServiceTechnicianId;
					$scope.beData.TeamLeaderId = dt.TeamLeaderId;

					$scope.beData.VinNo = dt.VinNo;
					$scope.beData.VehicleTypeName = dt.VehicleTypeName;
					$scope.beData.VehicleModelName = dt.VehicleModelName;
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
					$scope.beData.ServiceTechnician = '';
					$scope.beData.TeamLeader = '';
					$scope.beData.ServiceTechnicianId = null;
					$scope.beData.TeamLeaderId = null;
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

	$scope.ClearjobAssign = function () {
		$scope.beData =
		{
			TranId: 0,
			JobNo: '',
			Mechanic: '',
			AssignDate: new Date(),
			AssignTime: '',
			EngineNo: '',
			ChSrlNo: '',
			RegdNo: '',
			Party: '',
			ServiceEngineerId: null,
			ArrivalDate: new Date(),
			ArrivalTime: '',
			Remarks: '',
			Mode: 'Save'
		};
	}

	/*******************CRUD starts ------------------*/
	$scope.IsValidJobAssign  = function () {
		if ($scope.beData.JobNo.isEmpty()) {
		Swal.fire('Please ! Enter Job No');
			return false;
		}
		return true;
	}

	$scope.AddJobAssign = function () {
		if ($scope.IsValidJobAssign() == true) {
			if ($scope.confirmMSG.Accept == true) {
				var saveModify = $scope.beData.Mode;
				Swal.fire({
					title: 'Do you want to ' + saveModify + ' the current data?',
					showCancelButton: true,
					confirmButtonText: saveModify,
				}).then((result) => {
					if (result.isConfirmed) {
						$scope.CallSaveUpdateJobAssign();
					}
				});
			} else
				$scope.CallSaveUpdateJobAssign();
		}
	};

	$scope.CallSaveUpdateJobAssign = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();

		if ($scope.beData.EntryDateTimeDet) {
			$scope.beData.AsignDateTime = $filter('date')(new Date($scope.beData.EntryDateTimeDet.dateAD), 'yyyy-MM-dd');
		}
		 
		if ($scope.beData.EntryTime_TMP) {
			$scope.beData.AsignTime = $filter('date')(new Date($scope.beData.EntryTime_TMP), 'yyyy-MM-dd HH:mm');
		}

		if ($scope.beData.ArrivalDateDet) {
			$scope.beData.ArrivalDateTime = $filter('date')(new Date($scope.beData.ArrivalDateDet.dateAD), 'yyyy-MM-dd');
		}

		if ($scope.beData.ArrivalTime_TMP) {
			$scope.beData.ArrivalTime = $filter('date')(new Date($scope.beData.ArrivalTime_TMP), 'yyyy-MM-dd HH:mm');
		}


		$http({
			method: 'POST',
			url: base_url + "Service/Transaction/SaveJobAsign",
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
				$scope.ClearjobAssign();
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