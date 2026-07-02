

app.controller('LeaveQuoteController', function ($scope, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'Leave Quote';
	var gSrv = GlobalServices;
	
	$scope.LoadData = function () {
		$scope.confirmMSG = gSrv.getConfirmMSG();
		$scope.perPageColl = gSrv.getPerPageList();
		//$scope.MonthList = GlobalServices.getMonthList();

		$scope.currentPages = {
			LeaveQuote: 1,
		};

		$scope.searchData = {
			LeaveQuote: '',
		};

		$scope.perPage = {
			LeaveQuote: gSrv.getPerPageRow(),
		};

		$scope.newLeaveQuote = {
			LeaveQuoteId: null,
			Mode: 'Save'
		};



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

		$scope.LeaveTypeList = [];
		$http({
			method: 'POST',
			url: base_url + "HR/Leave/GetAllLeaveTypeList",
			dataType: "json"
		}).then(function (res) {
			if (res.data.IsSuccess && res.data.Data) {
				$scope.LeaveTypeList = res.data.Data;
				$scope.newLeaveQuote.LeaveQuotaDetail = [];
				angular.forEach($scope.LeaveTypeList, function (lc) {
					$scope.newLeaveQuote.LeaveQuotaDetail.push(
						{
							Name: lc.Name,
							LeaveTypeId: lc.LeaveTypeId,
							NoOfLeave: 0
						})
				});
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

				if ($scope.BranchList.length > 0)
					$scope.BranchList.insert(0, { BranchId: 0, Name: 'All' });
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

		//for department
		$scope.DepartmentList = [];
		$http({
			method: 'GET',
			url: base_url + "HR/Master/GetAllDepartment",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.DepartmentList = res.data.Data;
				if ($scope.DepartmentList.length > 0)
					$scope.DepartmentList.insert(0, { CostCenterDepartmentId: 0, Name: 'All' });
			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

		//designation
		$scope.DesignationList = [];
		$http({
			method: 'GET',
			url: base_url + "HR/Master/GetAllDesignation",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.DesignationList = res.data.Data;

				if ($scope.DesignationList.length > 0)
					$scope.DesignationList.insert(0, { DesignationId: 0, Name: 'All' });
			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

		//ServiceType

		$scope.ServiceTypeList = [];
		$http({
			method: 'GET',
			url: base_url + "HR/Master/GetAllServiceType",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.ServiceTypeList = res.data.Data;
				if ($scope.ServiceTypeList.length > 0)
					$scope.ServiceTypeList.insert(0, { ServiceTypeId: 0, Name: 'All' });
			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
		
		$scope.EmployeeList = [];
		$http({
			method: 'GET',
			url: base_url + "HR/Master/GetAllEmployee",
			dataType: "json"
		}).then(function (res) {
			if (res.data.IsSuccess && res.data.Data) {
				$scope.EmployeeList = res.data.Data;
				
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});


		$scope.GetAllLeaveQuoteList();
	}

	$scope.ClearLeaveQuote = function () {
		$scope.newLeaveQuote = {
			Mode: 'Save'
		};
	}
	//************************* LeaveQuote *********************************
	$scope.IsValidLeaveQuote = function () {
		if ($scope.newLeaveQuote.Name.isEmpty()) {
			Swal.fire('Please ! Enter Name');
			return false;
		}
		return true;
	}

	$scope.SaveUpdateLeaveQuote = function () {
		if ($scope.IsValidLeaveQuote() == true) {
			if ($scope.confirmMSG.Accept == true) {
				var saveModify = $scope.newLeaveQuote.Mode;
				Swal.fire({
					title: 'Do you want to ' + saveModify + ' the current data?',
					showCancelButton: true,
					confirmButtonText: saveModify,
				}).then((result) => {
					/* Read more about isConfirmed, isDenied below */
					if (result.isConfirmed) {
						$scope.CallSaveUpdateLeaveQuote();
					}
				});
			} else
				$scope.CallSaveUpdateLeaveQuote();
		}
	};

	$scope.CallSaveUpdateLeaveQuote = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		var findP = mx($scope.CostClassList).firstOrDefault(p1 => p1.CostClassId == $scope.newLeaveQuote.PeriodId);
		if (findP) {
			$scope.newLeaveQuote.DateFrom = $filter('date')(new Date(findP.StartDate), 'yyyy-MM-dd');
			$scope.newLeaveQuote.DateTo = $filter('date')(new Date(findP.EndDate), 'yyyy-MM-dd');
		}

		$http({
			method: 'POST',
			url: base_url + "HR/Leave/SaveLeaveQuota",
			headers: { 'Content-Type': undefined },
			transformRequest: function (data) {
				var formData = new FormData();
				formData.append("jsonData", angular.toJson(data.jsonData));
				return formData;
			},
			data: { jsonData: $scope.newLeaveQuote }
		}).then(function (res) {
			$scope.loadingstatus = "stop";
			hidePleaseWait();
			Swal.fire(res.data.ResponseMSG);
			if (res.data.IsSuccess == true) {
				$scope.ClearLeaveQuote();
				$scope.GetAllLeaveQuoteList();
			}
		}, function (errormessage) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
		});
	}

	$scope.GetAllLeaveQuoteList = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		$scope.LeaveQuoteList = [];
		$http({
			method: 'POST',
			url: base_url + "HR/Leave/GetAllLeaveQuotaList",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.LeaveQuoteList = res.data.Data;
			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	}

	$scope.GetLeaveQuoteById = function (refData) {
		$scope.loadingstatus = "running";
		showPleaseWait();
		var para = {
			LeaveQuotaId: refData.LeaveQuotaId
		};
		$http({
			method: 'POST',
			url: base_url + "HR/Leave/GetLeaveQuotaById",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.newLeaveQuote = res.data.Data;
				$scope.newLeaveQuote.Mode = 'Modify';
				$('#custom-tabs-four-profile').tab('show');


			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	};

	$scope.DelLeaveQuoteById = function (refData) {
		Swal.fire({
			title: 'Do you want to delete the selected data?',
			showCancelButton: true,
			confirmButtonText: 'Delete',
		}).then((result) => {
			/* Read more about isConfirmed, isDenied below */
			if (result.isConfirmed) {
				$scope.loadingstatus = "running";
				showPleaseWait();
				var para = {
					LeaveQuotaId: refData.LeaveQuotaId
				};
				$http({
					method: 'POST',
					url: base_url + "HR/Leave/DelLeaveQuota",
					dataType: "json",
					data: JSON.stringify(para)
				}).then(function (res) {
					hidePleaseWait();
					$scope.loadingstatus = "stop";
					if (res.data.IsSuccess) {
						$scope.GetAllLeaveQuoteList();
					} else {
						Swal.fire(res.data.ResponseMSG);
					}
				}, function (reason) {
					Swal.fire('Failed' + reason);
				});
			}
		});
	};
	$scope.PasteData = function (ph, sind) {
		var clipText = event.clipboardData.getData('text/plain');

		if (clipText) {
			$scope.loadingstatus = 'running';
			showPleaseWait();
			var ind = 0;
			clipText.split("\n").forEach(function (line) {
				if (line && line.length > 0) {
					if (ind < $scope.EmployeeListForSalaryDetail.length) {
						var emp = $scope.EmployeeListForSalaryDetail[ind];
						for (var ii = 0; ii < emp.PayHeadColl.length; ii++) {
							var findPH = emp.PayHeadColl[ii];
							if (findPH.PayHeadingId == ph.PayHeadingId) {
								findPH.Amount = isEmptyAmt(line);
								$scope.ChangeRate(emp, findPH);
								break;
							}
						}
					}
					ind++;
				}
			});

			hidePleaseWait();
			$scope.loadingstatus = "stop";
		}
	}
	$scope.pageChangeHandler = function (num) {
		console.log('page changed to ' + num);
	};

});