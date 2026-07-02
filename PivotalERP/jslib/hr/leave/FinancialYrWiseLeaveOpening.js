app.controller('FinancialYrWiseLeaveOpeningController', function ($scope, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'FinancialYrWiseLeaveOpening';

	$scope.LoadData = function () {
		$('.select2').select2();
		var gSrv = GlobalServices;
		$scope.confirmMSG = gSrv.getConfirmMSG();
		$scope.perPageColl = gSrv.getPerPageList();
		$scope.currentPages = {
			LeaveOpening: 1,
		};

		$scope.searchData = {
			LeaveOpening: '',
		};

		$scope.perPage = {
			LeaveOpening: gSrv.getPerPageRow(),
		};
		$scope.TypeColl = [{ id: 1, text: 'Employee' }, { id: 2, text: 'Salesman' }]


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
                if ($scope.CategoryList.length > 0)
                    $scope.CategoryList.insert(0, { CategoryId: 0, Name: 'All' });
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

		$scope.PayHeadingList = [];
		$http({
			method: 'GET',
			url: base_url + "HR/Transaction/GetAllPayHeadingForTran",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.PayHeadingList = res.data.Data;
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
			BranchId: 0,
			DepartmentId: 0,
			CategoryId: 0,
			PeriodId: 0
		};


		$http({
			method: 'GET',
			url: base_url + "HR/Transaction/GetAllTaxRule",
			dataType: "json"
		}).then(function (res) {
			$scope.TaxRuleColl = mx(res.data.Data);
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});


		/*$scope.GetPayHeadingForAllow();*/
		//$scope.GetAllAllowExpenseCategoryList();
		//$scope.GetAllExpenseCategoryList();
	}


	$scope.sortEmpData = function (keyname) {
		$scope.sortKeySS = keyname;   //set the sortKey to the param passed
		$scope.reverseSS = !$scope.reverseSS; //if true make it false and vice versa
	}

	$scope.SaveLeaveOpeningColl = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();

		var leaveOpeningCollection = [];
		var missingUserNames = [];

		angular.forEach($scope.EmployeeListForLeaveOpening, function (emp) {
			// Skip employees with missing UserId and collect names
			if (!emp.UserId || emp.UserId === 0) {
				missingUserNames.push(emp.EmployeeName);
				return;
			}

			var findP = mx($scope.CostClassList).firstOrDefault(p1 => p1.CostClassId == $scope.newFilter.PeriodId);
			var dateFrom = null;
			var dateTo = null;

			if (findP) {
				dateFrom = $filter('date')(new Date(findP.StartDate), 'yyyy-MM-dd');
				dateTo = $filter('date')(new Date(findP.EndDate), 'yyyy-MM-dd');
			}

			var leaveOpening = {
				PeriodId: $scope.newFilter.PeriodId,
				EmployeeOrSalesman: $scope.newFilter.EmployeeOrSalesman,
				UserId: emp.UserId,
				DateFrom: dateFrom,
				DateTo: dateTo,
				LeaveQuotaDetail: []
			};

			angular.forEach(emp.LeaveQuotaDetail, function (lc) {
				leaveOpening.LeaveQuotaDetail.push({
					Name: lc.Name,
					LeaveTypeId: lc.LeaveTypeId,
					NoOfLeave: lc.NoOfLeave
				});
			});

			leaveOpeningCollection.push(leaveOpening);
		});

		// Notify about skipped employees
		if (missingUserNames.length > 0) {
			var nameList = missingUserNames.join(", ");
			Swal.fire("Note", "Skipped saving for these employees due to missing UserId: " + nameList, "warning");
		}

		// Prevent API call if no valid data
		if (leaveOpeningCollection.length === 0) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			Swal.fire("Error", "No valid data to save", "error");
			return;
		}

		$http({
			method: 'POST',
			url: base_url + "HR/Leave/SaveLeaveOpeningColl",
			headers: { 'Content-Type': undefined },
			transformRequest: function (data) {
				var formData = new FormData();
				formData.append("jsonData", angular.toJson(data.jsonData));
				return formData;
			},
			data: { jsonData: leaveOpeningCollection }
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



	$scope.GetEmployeeForLeaveOpening = function () {

		if ( $scope.newFilter.PeriodId > 0) {

		} else {
			return;
		}

		$scope.loadingstatus = "running";
		showPleaseWait();
		$scope.EmployeeListForLeaveOpening = [];

		var para = {
			BranchId: $scope.newFilter.BranchId,
			DepartmentId: $scope.newFilter.DepartmentId,
			CategoryId: $scope.newFilter.CategoryId,
			PeriodId: $scope.newFilter.PeriodId,
			EmployeeOrSalesman: $scope.newFilter.EmployeeOrSalesman,
		};
		$http({
			method: 'POST',
			url: base_url + "HR/Leave/GetAllEmpLeaveOpening",
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
						LeaveQuotaDetail: [],
					};

					$scope.LeaveTypeList.forEach(function (pa) {
						var find = subQry.firstOrDefault(p1 => p1.LeaveTypeId == pa.LeaveTypeId);
						beData.LeaveQuotaDetail.push({
							Name: pa.Name,
							LeaveTypeId: pa.LeaveTypeId,
							NoOfLeave: find ? find.NoOfLeave : 0

						});

					});

					$scope.EmployeeListForLeaveOpening.push(beData);

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

	$scope.SaveEmpWiseLeaveOpening = function (refData) {
		$scope.loadingstatus = "running";
		showPleaseWait();

		// save date
		var findP = mx($scope.CostClassList).firstOrDefault(p1 => p1.CostClassId == $scope.newFilter.PeriodId);
		if (findP) {
			$scope.EmployeeListForLeaveOpening.DateFrom = $filter('date')(new Date(findP.StartDate), 'yyyy-MM-dd');
			$scope.EmployeeListForLeaveOpening.DateTo = $filter('date')(new Date(findP.EndDate), 'yyyy-MM-dd');
		}
		//save data in Parent ttable and collect the childTaBLE data
		$scope.EmployeeListForLeaveOpening = {
			EmployeeOrSalesman: $scope.newFilter.EmployeeOrSalesman,
			PeriodId: $scope.newFilter.PeriodId,
			UserId: refData.UserId,
			DateFrom: $scope.EmployeeListForLeaveOpening.DateFrom,
			DateTo: $scope.EmployeeListForLeaveOpening.DateTo,
			LeaveQuotaDetail: []
		};
		//Collection of data For child table
		angular.forEach(refData.LeaveQuotaDetail, function (lc) {
			$scope.EmployeeListForLeaveOpening.LeaveQuotaDetail.push({
				Name: lc.Name,
				LeaveTypeId: lc.LeaveTypeId,
				NoOfLeave: lc.NoOfLeave
			});
		});


		$http({
			method: 'POST',
			url: base_url + "HR/Leave/SaveLeaveOpening",  
			headers: { 'Content-Type': undefined },
			transformRequest: function (data) {
				var formData = new FormData();
				formData.append("jsonData", angular.toJson(data.jsonData));
				return formData;
			},
			data: { jsonData: $scope.EmployeeListForLeaveOpening }
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



	$scope.DelLeaveOpening = function () {
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
					url: base_url + "HR/Leave/DelLeaveOpening",
					dataType: "json",
					data: JSON.stringify(para)
				}).then(function (res) {
					hidePleaseWait();
					$scope.loadingstatus = "stop";

					Swal.fire(res.data.ResponseMSG);
					if (res.data.IsSuccess) {
						$scope.GetEmployeeForLeaveOpening();
					} else {
						Swal.fire(res.data.ResponseMSG);
					}

				}, function (reason) {
					Swal.fire('Failed' + reason);
				});
			}
		});


	};

	$scope.DelLeaveOpeningById = function (refData) {
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
					url: base_url + "HR/Leave/DelLeaveOpening",
					dataType: "json",
					data: JSON.stringify(para)
				}).then(function (res) {
					hidePleaseWait();
					$scope.loadingstatus = "stop";
					if (res.data.IsSuccess) {
						$scope.GetEmployeeForLeaveOpening();
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
					if (ind < $scope.EmployeeListForLeaveOpening.length) {
						var emp = $scope.EmployeeListForLeaveOpening[ind];
						for (var ii = 0; ii < emp.LeaveQuotaDetail.length; ii++) {
							var findPH = emp.LeaveQuotaDetail[ii];
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