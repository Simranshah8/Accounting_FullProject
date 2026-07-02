app.controller('LeaveRequestController', function ($scope, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'Leave Request';

	var gSrv = GlobalServices;
	$scope.onBtExportCSV = function () {
		var params = {
			fileName: 'ManualAttendance.csv',
			sheetName: 'ManualAttendance'
		};

		$scope.gridOptions.api.exportDataAsCsv(params);
	}
	$scope.onFilterTextBoxChanged = function () {
		$scope.gridOptions.api.setQuickFilter($scope.search);
	}

	$scope.LoadData = function () {
		$('.select2').select2();
		$scope.confirmMSG = GlobalServices.getConfirmMSG();
		$scope.perPageColl = GlobalServices.getPerPageList();

		$scope.LeaveStatusColl = [{ id: 0, text: 'ALL' }, { id: 1, text: 'NOT_APPROVED' }, { id: 2, text: 'APPROVED' }, { id: 3, text: 'CANCEL' }, { id: 4, text: 'REJECTED' },]

		$scope.ApprovedStatusColl = [{ id: 2, text: 'Approve' }, { id: 3, text: 'Cancel' }, { id: 4, text: 'Deny' },]
		$scope.TypeColl = [{ id: 1, text: 'Employee' }, { id: 2, text: 'Salesman' }]

		// for CompanyRelationshipList
		$scope.CompanyRelationshipList = [];
		$http({
			method: 'POST',
			url: base_url + "HR/Master/GetAllCompanyRelationship",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.CompanyRelationshipList = res.data.Data;
			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

		$scope.currentPages = {
			StudentLeaveRequest: 1,
			EmployeeLeaveRequest: 1,
		};

		$scope.searchData = {
			StudentLeaveRequest: '',
			EmployeeLeaveRequest: '',
		};

		$scope.perPage = {
			StudentLeaveRequest: GlobalServices.getPerPageRow(),
			EmployeeLeaveRequest: GlobalServices.getPerPageRow(),
		};


		$scope.newEmployeeLeaveRequest = {
			LeaveStatus: 1,
			EmployeeOrSalesman: 1,
			DateFrom_TMP: new Date(),
			DateTo_TMP: new Date(),
		};

	}


    $scope.GetEmpLeaveReqList = function () {
        showPleaseWait();
        $scope.EmpLeaveRequestColl = [];

        var para = {
			EmployeeOrSalesman: $scope.newEmployeeLeaveRequest.EmployeeOrSalesman,
            LeaveStatus: $scope.newEmployeeLeaveRequest.LeaveStatus,
            dateFrom: $scope.newEmployeeLeaveRequest.DateFromDet ? $filter('date')(new Date($scope.newEmployeeLeaveRequest.DateFromDet.dateAD), 'yyyy-MM-dd') : null,
            dateTo: $scope.newEmployeeLeaveRequest.DateToDet ? $filter('date')(new Date($scope.newEmployeeLeaveRequest.DateToDet.dateAD), 'yyyy-MM-dd') : null,
            ForUserId: null,
        }
        $http({
            method: 'POST',
            url: base_url + "HR/Leave/GetEmpLeaveReq",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.EmpLeaveRequestColl = res.data.Data.LeaveColl;
                $scope.EmpLeaveRequestColl = res.data.Data.LeaveColl.map(item => {
                    if (item.Remarks) {
						let words = item.Remarks.split(' ');
						let fullWords = item.Remarks;
						item.fullWord = fullWords;
						if (words.length > 4) {
							item.TruncatedRemarks = words.slice(0, 4).join(' ') + '';
						} else {
							item.TruncatedRemarks =  item.Remarks; // No truncation needed
						}
                        item.showFull = false; // Initially set to show truncated remarks
                    }
                    return item;
                });
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    }

    $scope.toggleFullRemarks = function (item) {
        item.showFull = !item.showFull;
    };


	$scope.CurLeave = {};
	$scope.ShowApprovedDialog = function (beData) {
		$scope.CurLeave = beData;

		showPleaseWait();
		$scope.EmpWiseRequestColl = [];

		var para = {
			EmployeeOrSalesman: $scope.newEmployeeLeaveRequest.EmployeeOrSalesman,
			LeaveStatus: 0,
			dateFrom: null,
			dateTo: null,
			ForUserId: beData.UserId
		};
		$http({
			method: 'POST',
			url: base_url + "HR/Leave/GetEmpLeaveReq",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.EmpWiseRequestColl = res.data.Data.LeaveColl;
				$scope.BalanceColl = res.data.Data.BalanceColl;


				$('#modal-xl').modal('show');
			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});



	};

	$scope.LeaveApproved = function () {
		showPleaseWait();
		$scope.EmpWiseRequestColl = [];

		var para = {
			LeaveRequestId: $scope.CurLeave.LeaveRequestId,
			ApprovedRemarks: $scope.CurLeave.ApprovedRemarks,
			ApprovedType: $scope.CurLeave.LeaveStatus
		};
		$http({
			method: 'POST',
			url: base_url + "HR/Leave/LeaveApprove",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess) {
				$('#modal-xl').modal('hide');
				Swal.fire(res.data.ResponseMSG);
				//$scope.GetEmpLeaveReqList();

			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

	}

	$scope.ShowDocImg = function (item) {
		if (item.DocumentColl && item.DocumentColl.length > 0) {
			$scope.viewImg = {
				ContentPath: ''
			};
			$scope.viewImg.ContentPath = item.DocumentColl[0].DocPath;
			$('#PersonalImg').modal('show');
		} else {
			Swal.fire('No Image Found');
		}
	};

	$scope.DownloadAsXls = function () {
		$scope.loadingstatus = 'running';
		showPleaseWait();
		var dataColl = $scope.GetDataForPrint();

		var paraData = {
			LeaveStatus: $scope.newEmployeeLeaveRequest.LeaveStatus,
			dateFrom: $scope.newEmployeeLeaveRequest.DateFromDet ? $filter('date')(new Date($scope.newEmployeeLeaveRequest.DateFromDet.dateAD), 'yyyy-MM-dd') : null,
			dateTo: $scope.newEmployeeLeaveRequest.DateToDet ? $filter('date')(new Date($scope.newEmployeeLeaveRequest.DateToDet.dateAD), 'yyyy-MM-dd') : null,
			EmployeeId: null,
		};

		$http({
			method: 'POST',
			url: base_url + "Global/PrintXlsReportData",
			headers: { 'Content-Type': undefined },

			transformRequest: function (data) {

				var formData = new FormData();
				formData.append("entityId", EntityId);
				formData.append("jsonData", angular.toJson(data.jsonData));
				formData.append("paraData", angular.toJson(paraData));
				formData.append("RptPath", "");
				return formData;
			},
			data: { jsonData: dataColl }
		}).then(function (res) {

			$scope.loadingstatus = "stop";
			hidePleaseWait();
			if (res.data.IsSuccess && res.data.Data) {
				down_file(base_url + "//" + res.data.Data.ResponseId, "LeaveRequest.xlsx");
			}

		}, function (errormessage) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			Swal.fire(errormessage);
		});
	}

	$scope.GetDataForPrint = function () {
		var filterData = [];
		$scope.gridOptions.api.forEachNodeAfterFilterAndSort(function (node) {
			var dayBook = node.data;
			filterData.push(dayBook);
		});
		return filterData;
	}

	$scope.pageChangeHandler = function (num) {
		console.log('page changed to ' + num);
	};


});