app.controller('LeaveQuotaByEmployeeCollController', function ($scope, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'Leave Quota By Employee';

	$scope.LoadData = function () {
		$('.select2').select2();
		var gSrv = GlobalServices;
		$scope.confirmMSG = gSrv.getConfirmMSG();
		$scope.perPageColl = gSrv.getPerPageList();
		$scope.currentPages = {
			LeaveQuota: 1,
		};

		$scope.searchData = {
			LeaveQuota: '',
		};

		$scope.perPage = {
			LeaveQuota: gSrv.getPerPageRow(),
		};


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

		$scope.BranchList = [];
		$http({
			method: 'GET',
			url: base_url + "Setup/Security/GetAllBranchList",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.BranchList = res.data.Data;

			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

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
			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});


		//CategoryList
		$scope.CategoryList = [];
		$http({
			method: 'GET',
			url: base_url + "HR/Master/GetAllCategory",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.CategoryList = res.data.Data;
			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

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
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

		$scope.newFilter = {
			EmployeeOrSalesman: 1,
			BranchId: null,
			DepartmentId: null,
			CategoryId: null,
			PeriodId: null
		};

    }
    $scope.ClearFilter = function () {
        $scope.newFilter = {
			BranchId: null,
			DepartmentId: null,
			CategoryId: null,
			PeriodId: null
        };
    }


	$scope.sortEmpData = function (keyname) {
		$scope.sortKeySS = keyname;   //set the sortKey to the param passed
		$scope.reverseSS = !$scope.reverseSS; //if true make it false and vice versa
	}

	$scope.SaveLeaveQuotaColl = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		var LeaveQuotaCollection = [];
		var missingUserNames = [];

		angular.forEach($scope.EmployeeListForLeaveQuota, function (emp) {
			// Skip adding if UserId is missing, but collect name for message
			if (!emp.UserId || emp.UserId === 0) {
				missingUserNames.push(emp.EmployeeName);
				return; // do not add this one to collection
			}
			var findP = mx($scope.CostClassList).firstOrDefault(p1 => p1.CostClassId == $scope.newFilter.PeriodId);
			var dateFrom = null;
			var dateTo = null;
			if (findP) {
				dateFrom = $filter('date')(new Date(findP.StartDate), 'yyyy-MM-dd');
				dateTo = $filter('date')(new Date(findP.EndDate), 'yyyy-MM-dd');
			}
			var LeaveQuota = {
				EmployeeOrSalesman: $scope.newFilter.EmployeeOrSalesman,
				PeriodId: $scope.newFilter.PeriodId,
				UserId: emp.UserId,
				DateFrom: dateFrom,
				DateTo: dateTo,
				LeaveQuotaByEmpDetailsColl: []
			};
			angular.forEach(emp.LeaveQuotaByEmpDetailsColl, function (lc) {
				LeaveQuota.LeaveQuotaByEmpDetailsColl.push({
					Name: lc.Name,
					LeaveTypeId: lc.LeaveTypeId,
					NoOfLeave: lc.NoOfLeave
				});
			});

			LeaveQuotaCollection.push(LeaveQuota);
		});
		if (missingUserNames.length > 0) {
			var nameList = missingUserNames.join(", ");
			Swal.fire("Note", "Skipped saving for these employees due to missing UserId: " + nameList, "warning");
		}
		if (LeaveQuotaCollection.length === 0) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			Swal.fire("Error", "No valid data to save", "error");
			return;
		}
		$http({
			method: 'POST',
			url: base_url + "HR/Leave/SaveLeaveQuotaColl",
			headers: { 'Content-Type': undefined },
			transformRequest: function (data) {
				var formData = new FormData();
				formData.append("jsonData", angular.toJson(data.jsonData));
				return formData;
			},
			data: { jsonData: LeaveQuotaCollection }
		}).then(function (res) {
			$scope.loadingstatus = "stop";
			hidePleaseWait();
			Swal.fire(res.data.ResponseMSG);
		}, function (errormessage) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			Swal.fire("Error", "Failed to save leave opening data", "error");
		});
	};




	$scope.GetEmployeeForLeaveQuota = function () {

		if ($scope.newFilter.PeriodId > 0) {

		} else {
			return;
		}

		$scope.loadingstatus = "running";
		showPleaseWait();
		$scope.EmployeeListForLeaveQuota = [];

		var para = {
			BranchId: $scope.newFilter.BranchId,
			DepartmentId: $scope.newFilter.DepartmentId,
			CategoryId: $scope.newFilter.CategoryId,
			PeriodId: $scope.newFilter.PeriodId,
			EmployeeOrSalesman: $scope.newFilter.EmployeeOrSalesman,
		};
		$http({
			method: 'POST',
			url: base_url + "HR/Leave/GetAllEmpLeaveQuota",
			dataType: "json",
			data: JSON.stringify(para),
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				var dataColl = mx(res.data.Data);

				var query = dataColl.groupBy(t => ({ EmployeeId: t.EmployeeId }));

				angular.forEach(query, function (q) {
					var fst = q.elements[0];
					var subQry = mx(q.elements);

					var beData = {
						EmployeeId: fst.EmployeeId,
						UserId: fst.UserId,
						TranId: fst.TranId,
						BranchId: fst.BranchId,
						CategoryId: fst.CategoryId,
						EmployeeCode: fst.EmployeeCode,
						EmployeeName: fst.EmployeeName,
						EnrollNumber: fst.EnrollNumber,
						Department: fst.Department,
						Designation: fst.Designation,
						PayHeading: fst.PayHeading,
						LeaveQuotaByEmpDetailsColl: [],
					};

					$scope.LeaveTypeList.forEach(function (pa) {
						var find = subQry.firstOrDefault(p1 => p1.LeaveTypeId == pa.LeaveTypeId);
						beData.LeaveQuotaByEmpDetailsColl.push({
							Name: pa.Name,
							LeaveTypeId: pa.LeaveTypeId,
							NoOfLeave: find ? find.NoOfLeave : 0

						});

					});

					$scope.EmployeeListForLeaveQuota.push(beData);

					if (beData.PeriodId)
						$scope.newFilter.PeriodId = beData.PeriodId;

				});

			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

	}

	$scope.SaveEmpWiseLeaveQuota = function (refData) {
		$scope.loadingstatus = "running";
		showPleaseWait();

		// save date
		var findP = mx($scope.CostClassList).firstOrDefault(p1 => p1.CostClassId == $scope.newFilter.PeriodId);
		if (findP) {
			$scope.EmployeeListForLeaveQuota.DateFrom = $filter('date')(new Date(findP.StartDate), 'yyyy-MM-dd');
			$scope.EmployeeListForLeaveQuota.DateTo = $filter('date')(new Date(findP.EndDate), 'yyyy-MM-dd');
		}
        //save data in Parent ttable and collect the childTaBLE data
        $scope.EmployeeListForLeaveQuota = {
            EmployeeOrSalesman: $scope.newFilter.EmployeeOrSalesman,
            PeriodId: $scope.newFilter.PeriodId,
            UserId: refData.UserId,
            DateFrom: $scope.EmployeeListForLeaveQuota.DateFrom,
            DateTo: $scope.EmployeeListForLeaveQuota.DateTo,
            LeaveQuotaByEmpDetailsColl: []
        };
        //Collection of data For child table
        angular.forEach(refData.LeaveQuotaByEmpDetailsColl, function (lc) {
            $scope.EmployeeListForLeaveQuota.LeaveQuotaByEmpDetailsColl.push({
                Name: lc.Name,
				LeaveTypeId: lc.LeaveTypeId,
				NoOfLeave: lc.NoOfLeave
			});
		});


		$http({
			method: 'POST',
			url: base_url + "HR/Leave/SaveLeaveQuotaByEmp",
			headers: { 'Content-Type': undefined },
			transformRequest: function (data) {
				var formData = new FormData();
				formData.append("jsonData", angular.toJson(data.jsonData));
				return formData;
			},
			data: { jsonData: $scope.EmployeeListForLeaveQuota }
		}).then(function (res) {
			$scope.loadingstatus = "stop";
			hidePleaseWait();
			Swal.fire(res.data.ResponseMSG);
			if (res.data.IsSuccess == true) {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (errormessage) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			Swal.fire("Error", "Failed to save Leave Opening", "error");
		});
	};



	$scope.DelLeaveQuota = function () {
		Swal.fire({
			title: 'Do you want to delete the selected data?',
			showCancelButton: true,
			confirmButtonText: 'Delete',
		}).then((result) => {
			/* Read more about isConfirmed, isDenied below */
			if (result.isConfirmed) {
				//$scope.loadingstatus = "running";
				//showPleaseWait();

				var para = {
					PeriodId: $scope.newFilter.PeriodId
				};

				$http({
					method: 'POST',
					url: base_url + "HR/Leave/DelLeaveQuotaByEmp",
					dataType: "json",
					data: JSON.stringify(para)
				}).then(function (res) {
					hidePleaseWait();
					$scope.loadingstatus = "stop";

					Swal.fire(res.data.ResponseMSG);
					if (res.data.IsSuccess) {
						$scope.GetEmployeeForLeaveQuota();
					} else {
						Swal.fire(res.data.ResponseMSG);
					}

				}, function (reason) {
					Swal.fire('Failed' + reason);
				});
			}
		});


	};

	$scope.DelLeaveQuotaById = function (refData) {
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
					TranId: refData.TranId
				};
				$http({
					method: 'POST',
					url: base_url + "HR/Leave/DelLeaveQuotaByEmp",
					dataType: "json",
					data: JSON.stringify(para)
				}).then(function (res) {
					hidePleaseWait();
					$scope.loadingstatus = "stop";
					if (res.data.IsSuccess) {
						$scope.GetEmployeeForLeaveQuota();
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
					if (ind < $scope.EmployeeListForLeaveQuota.length) {
						var emp = $scope.EmployeeListForLeaveQuota[ind];
						for (var ii = 0; ii < emp.LeaveQuotaByEmpDetailsColl.length; ii++) {
							var findPH = emp.LeaveQuotaByEmpDetailsColl[ii];
							if (findPH.LeaveTypeId == ph.LeaveTypeId) {
								findPH.NoOfLeave = isEmptyAmt(line);
								//$scope.ChangeRate(emp, findPH);
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