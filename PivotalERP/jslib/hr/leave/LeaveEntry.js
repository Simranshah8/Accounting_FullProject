app.controller('LeaveEntryController', function ($scope, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'LeaveEntry Entry';

	$scope.LoadData = function () {
		$('.select2').select2();
		$scope.confirmMSG = GlobalServices.getConfirmMSG();
		$scope.perPageColl = GlobalServices.getPerPageList();
		//$scope.LanguageColl = GlobalServices.getLangList();
		$scope.EmployeeSearchOptions = GlobalServices.getEmployeeSearchOptions();
		$scope.LeaveDurationList = [
			{ id: 1, text: 'Full Day' },
			{ id: 2, text: 'Half Day' },
			{ id: 3, text: 'Hourly' }
		];
		$scope.LeavePeriodList = [
			{ id: 1, text: 'First Half' },
			{ id: 2, text: 'Second Half' },
			{ id: 3, text: 'Other' }
		];
		$scope.TypeColl = [{ id: 1, text: 'Employee' }, { id: 2, text: 'Salesman' }]

		$scope.currentPages = {
			LeaveEntry: 1,
		};
		$scope.searchData = {
			LeaveEntry: '',
		};
		$scope.perPage = {
			LeaveEntry: GlobalServices.getPerPageRow(),
		};
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
		$scope.SalesManList = [];
		$http({
			method: 'GET',
			url: base_url + "Account/Creation/GetAllSalesMan",
			dataType: "json"
		}).then(function (res) {
			if (res.data.IsSuccess && res.data.Data) {
				$scope.SalesManList = res.data.Data;

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
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.LeaveTypeList = res.data.Data;
			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

		$scope.newFilter = {
			FromDate_TMP: new Date(),
			ToDate_TMP: new Date()
		};

		$scope.newLeaveEntry = {
			LeaveEntryId: null,
			EmployeeOrSalesman: 1,
			LeaveTypeId: null,
			DurationTypeId: null,
			LeavePeriodId: null,
			Remarks: '',
			AttachDocument: '',
			LeaveTo: 1,
			DateFrom_TMP: '',
			DateTo_TMP: '',
			NoOfDays: null,
			RemainLeave: 0,
			AttachmentColl: [],
			SelectEmployee: $scope.EmployeeSearchOptions[0].value,
			Mode: 'Save',
			LeaveQuotaByEmpDetailsColl: []
		};
		$scope.ChangeNoOfDays();
	};


	$scope.ClearLeaveEntry = function () {
		$scope.BalanceLeave = 0;
		$scope.newLeaveEntry.RemainLeave = 0;
        $timeout(function () {
            $scope.newLeaveEntry = {
				LeaveEntryId: null,
				EmployeeOrSalesman: 1,
				LeaveTypeId: null,
				DurationTypeId: null,
				LeavePeriodId: null,
				Remarks: '',
				AttachDocument: '',
				LeaveTo: 1,
				DateFrom_TMP: '',
				DateTo_TMP: '',
				NoOfDays: null,
				RemainLeave: 0,
				AttachmentColl: [],
				SelectEmployee: $scope.EmployeeSearchOptions[0].value,
				Mode: 'Save',
				LeaveQuotaByEmpDetailsColl: []
            };
        });
    };

	$scope.GetLeaveTypeByEmployee = function (refData) {
		$scope.BalanceLeave = 0;
		$scope.newLeaveEntry.RemainLeave = 0;
		if ($scope.newLeaveEntry.UserId) {
			$scope.loadingstatus = "running";
			showPleaseWait();
			var para = {
				UsersId: $scope.newLeaveEntry.EmployeeOrSalesman == 1 ? $scope.newLeaveEntry.EmployeeDetails.UserId : $scope.newLeaveEntry.UserId,
			};
			$scope.LeaveTypeByEmployeeList = [];
			$http({
				method: 'POST',
				url: base_url + "HR/Leave/GetLeaveTypeByEmployee",
				dataType: "json",
				data: JSON.stringify(para)
			}).then(function (res) {
				hidePleaseWait();
				$scope.loadingstatus = "stop";
				if (res.data.IsSuccess && res.data.Data) {
					$scope.LeaveTypeByEmployeeList = res.data.Data;
				} else {
					Swal.fire(res.data.ResponseMSG);
				}
			}, function (reason) {
				Swal.fire('Failed' + reason);
			});
		}
	};


	$scope.GetLeaveBalanceDetail = function (refData) {
		$scope.BalanceLeave = 0;
		$scope.newLeaveEntry.RemainLeave = 0;
		if ($scope.newLeaveEntry.UserId>0) {
			$scope.loadingstatus = "running";
			showPleaseWait();
			var para = {
				ForUserId: $scope.newLeaveEntry.EmployeeOrSalesman == 1 ? $scope.newLeaveEntry.EmployeeDetails.UserId : $scope.newLeaveEntry.UserId,
				EmployeeOrSalesman: $scope.newLeaveEntry.EmployeeOrSalesman,
				LeaveTypeId: $scope.newLeaveEntry.LeaveTypeId,
			};
			$scope.BalanceLeave = {};
			$http({
				method: 'POST',
				url: base_url + "HR/Leave/GetLeaveBalanaceSummary",
				dataType: "json",
				data: JSON.stringify(para)
			}).then(function (res) {
				hidePleaseWait();
				$scope.loadingstatus = "stop";

				if (res.data.IsSuccess && res.data.Data && res.data.Data.length>0) {
					$scope.BalanceLeave = res.data.Data[0].Balance;					
				} else {
					Swal.fire(res.data.ResponseMSG);
				}
				$scope.ChangeNoOfDays();
			}, function (reason) {
				Swal.fire('Failed' + reason);
			});
		}
	};

	$scope.ChangeNoOfDays = function () {
		let dateFrom = null;
		let dateTo = null;
		if ($scope.newLeaveEntry.DateFromDet) {
			$scope.newLeaveEntry.DateFrom = $filter('date')(new Date($scope.newLeaveEntry.DateFromDet.dateAD), 'yyyy-MM-dd');
			dateFrom = new Date($scope.newLeaveEntry.DateFrom);
		}
		if ($scope.newLeaveEntry.DateToDet) {
			$scope.newLeaveEntry.DateTo = $filter('date')(new Date($scope.newLeaveEntry.DateToDet.dateAD), 'yyyy-MM-dd');
			dateTo = new Date($scope.newLeaveEntry.DateTo);
		}

		let dayNo = 0;
		if (dateFrom && dateTo) {
			dayNo = Math.ceil((dateTo - dateFrom) / (1000 * 60 * 60 * 24)) + 1;
		}
		
		if ($scope.newLeaveEntry.LeaveDuration == 2) {
			$scope.newLeaveEntry.NoOfDays = 0.5;
		} else {
			$scope.newLeaveEntry.NoOfDays = dayNo;
		}

		if ($scope.BalanceLeave != null) {
			$scope.newLeaveEntry.RemainLeave =isEmptyAmt($scope.BalanceLeave) - isEmptyAmt($scope.newLeaveEntry.NoOfDays);
		}

	};






	$scope.IsValidLeaveEntry = function () {
		if ($scope.newLeaveEntry.Remarks.isEmpty()) {
			Swal.fire('Please ! Enter Reason');
			return false;
		}
		return true;
	};

	$scope.SaveUpdateLeaveEntry = function () {
		if ($scope.IsValidLeaveEntry() == true) {
			if ($scope.confirmMSG.Accept == true) {
				var saveModify = $scope.newLeaveEntry.Mode;
				Swal.fire({
					title: 'Do you want to ' + saveModify + ' the current data?',
					showCancelButton: true,
					confirmButtonText: saveModify,
				}).then((result) => {
					/* Read more about isConfirmed, isDenied below */
					if (result.isConfirmed) {
						$scope.CallSaveUpdateLeaveEntry();
					}
				});
			} else
				$scope.CallSaveUpdateLeaveEntry();
		}
	};

	$scope.CallSaveUpdateLeaveEntry = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();

		var filesColl = $scope.newLeaveEntry.Photo_TMP;

		if ($scope.newLeaveEntry.DateFromDet) {
			$scope.newLeaveEntry.DateFrom = $filter('date')(new Date($scope.newLeaveEntry.DateFromDet.dateAD), 'yyyy-MM-dd');
		}
		if ($scope.newLeaveEntry.DateToDet) {
			$scope.newLeaveEntry.DateTo = $filter('date')(new Date($scope.newLeaveEntry.DateToDet.dateAD), 'yyyy-MM-dd');
		}
		$scope.newLeaveEntry.UserId = $scope.newLeaveEntry.EmployeeOrSalesman == 1 ? $scope.newLeaveEntry.EmployeeDetails.UserId : $scope.newLeaveEntry.UserId,

		$http({
			method: 'POST',
			url: base_url + "HR/Leave/SaveLeaveRequest",
			headers: { 'Content-Type': undefined },
			transformRequest: function (data) {
				var formData = new FormData();
				formData.append("jsonData", angular.toJson(data.jsonData));

				if (data.files) {
					for (var i = 0; i < data.files.length; i++) {
						if (data.files[i].File)
							formData.append("file" + i, data.files[i].File);
						else
							formData.append("file" + i, data.files[i]);
					}
				}
				return formData;
			},
			data: { jsonData: $scope.newLeaveEntry, files: filesColl }
		}).then(function (res) {
			$scope.loadingstatus = "stop";
			hidePleaseWait();
			Swal.fire(res.data.ResponseMSG);
			if (res.data.IsSuccess == true) {
				$scope.ClearLeaveEntry();
				//$scope.GetAllLeaveEntryList();
			}
		}, function (errormessage) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
		});
	}

	$scope.GetAllLeaveEntryList = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		$scope.LeaveEntryList = [];
		var para = {
			dateFrom: ($scope.newFilter.FromDateDet ? $filter('date')(new Date($scope.newFilter.FromDateDet.dateAD), 'yyyy-MM-dd') : null),
			dateTo: ($scope.newFilter.ToDateDet ? $filter('date')(new Date($scope.newFilter.ToDateDet.dateAD), 'yyyy-MM-dd') : null),
		};
		$http({
			method: 'POST',
			url: base_url + "HR/Leave/GetAllLeaveRequest",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.LeaveEntryList = res.data.Data;
			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	};

	$scope.GetLeaveEntryById = function (refData) {
		$scope.loadingstatus = "running";
		showPleaseWait();
		var para = {
			LeaveRequestId: refData.LeaveRequestId
		};
		$http({
			method: 'POST',
			url: base_url + "HR/Leave/getLeaveEntryById",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.newLeaveEntry = res.data.Data;

				if ($scope.newLeaveEntry.DateFrom)
					$scope.newLeaveEntry.DateFrom_TMP = new Date($scope.newLeaveEntry.DateFrom);

				if ($scope.newLeaveEntry.DateTo)
					$scope.newLeaveEntry.DateTo_TMP = new Date($scope.newLeaveEntry.DateTo);

				$scope.newLeaveEntry.Mode = 'Modify';
				$scope.open_form_btn();
			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	};

	$scope.DelLeaveRequestById = function (refData, ind) {
		Swal.fire({
			title: 'Are you sure you want to delete ' + refData.Name + '?',
			showCancelButton: true,
			confirmButtonText: 'Delete',
		}).then((result) => {
			if (result.isConfirmed) {
				var para = { LeaveRequestId: refData.LeaveRequestId };
				$http({
					method: 'POST',
					url: base_url + "HR/Leave/DeleteLeaveRequest",
					dataType: "json",
					data: JSON.stringify(para)
				}).then(function (res) {
					hidePleaseWait();
					$scope.loadingStatus = "stop";
					if (res.data.IsSuccess) {
						$scope.GetAllLeaveEntryList();
					}
					Swal.fire(res.data.ResponseMSG);

				}, function (reason) {
					Swal.fire('Failed' + reason);
				});
			}
		});
	}
});