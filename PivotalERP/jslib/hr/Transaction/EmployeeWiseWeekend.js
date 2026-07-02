app.controller('EmployeeWiseWeekendController', function ($scope, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'Employee Wise Weekend';

	$scope.LoadData = function () {
		$('.select2').select2();
		$scope.confirmMSG = GlobalServices.getConfirmMSG();
		$scope.perPageColl = GlobalServices.getPerPageList();
		$scope.MonthList = GlobalServices.getMonthList();
		$scope.YearList = GlobalServices.getYearList();
		$scope.EmployeeSearchOptions = GlobalServices.getEmployeeSearchOptions();
		$scope.currentPages = {
			EmployeeWiseWeekend: 1,
		};
		$scope.searchData = {
			EmployeeWiseWeekend: '',
		};
		$scope.perPage = {
			EmployeeWiseWeekend: GlobalServices.getPerPageRow(),
		};


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

		$scope.newFilter = {
			BranchId: null,
			DepartmentId: null,
			YearId: null,
			W_Date_TMP: new Date(),
			MonthId: null
		};
		
	}

	$scope.CheckUnCheckAll = function (DayIndex) {
		// Check the current state of all checkboxes for this column
		let allChecked = true;
		// Check if all checkboxes for this column are already checked
		$scope.EmployeeWiseWeekendList.forEach(function (employee) {
			if (!employee['Day' + DayIndex]) {
				allChecked = false;
			}
		});
		// Set the new state for all checkboxes in this column
		$scope.EmployeeWiseWeekendList.forEach(function (employee) {
			employee['Day' + DayIndex] = !allChecked;  // Toggle the checkbox state
		});
		// Optional: Update any other logic like PDay and ADay based on the state
		$scope.EmployeeWiseWeekendList.forEach(function (employee) {
			$scope.updateDayCounts(employee);
		});
	};

	$scope.updateDayCounts = function (cl) {
		let totalDays = $scope.EmployeeWiseWeekendList[0].TotalDays; // Total days in a month (can be dynamic based on month)
		let checkedDays = 0;
		// Iterate through the 32 days to calculate checked and unchecked days
		for (let i = 1; i <= totalDays; i++) {
			if (cl['Day' + i]) {
				checkedDays++;
			}
		}
		// Update the PDay and ADay counts
		cl.PDay = checkedDays;                 // Checked days
		cl.ADay = totalDays - checkedDays;     // Unchecked days
	};

	//Validation for YearID and MonthId
	$scope.IsValidEmployeeWiseWeekEnd = function () {
		if ($scope.newFilter.YearId==null) {
			Swal.fire('Please ! Select Year');
			return false;
		}
		if ($scope.newFilter.MonthId==null) {
			Swal.fire('Please ! Select Month');
			return false;
		}
		return true;
	}


	$scope.GetEmployeeWiseWeekend = function () {
		if ($scope.IsValidEmployeeWiseWeekEnd() == true) {
			$scope.loadingstatus = "running";
			showPleaseWait();
			$scope.EmployeeWiseWeekendList = [];

			var para = {
				YearId: $scope.newFilter.YearId,
				MonthId: $scope.newFilter.MonthId,
				BranchId: $scope.newFilter.BranchId,
				DepartmentId: $scope.newFilter.DepartmentId
			}

			$scope.EmployeeWiseWeekendList.forEach(cl => {
				cl.PDay = 0; // Checked days
				cl.ADay = $scope.EmployeeWiseWeekendList[0].TotalDays || 32; // Set dynamic TotalDays
				for (let i = 1; i <= $scope.EmployeeWiseWeekendList[0].TotalDays; i++) {
					cl['Day' + i] = false; // Initialize all days as unchecked
				}
			});
			$http({
				method: 'POST',
				url: base_url + "HR/Transaction/GetEmployeeWiseWeekend",
				dataType: "json",
				data: JSON.stringify(para)
			}).then(function (res) {
				hidePleaseWait();
				$scope.loadingstatus = "stop";

				if (res.data.IsSuccess && res.data.Data) {
					$scope.EmployeeWiseWeekendList = res.data.Data;
					$scope.EmployeeWiseWeekendList.forEach(cl => {
						cl.PDay = 0; // Checked days
						cl.ADay = $scope.EmployeeWiseWeekendList[0].TotalDays; // Total days set dynamically
						for (let i = 1; i <= $scope.EmployeeWiseWeekendList[0].TotalDays; i++) {
							// If a value exists for Dayi (e.g., Day1, Day2, etc.), check the day
							if (cl['Day' + i] !== null && cl['Day' + i] !== 0) {
								cl['Day' + i] = true; // Mark the day as checked
								cl.PDay++; // Increment checked days count
							}
						}
					});
					//$scope.getNepaliCalendar();
				} else {
					Swal.fire(res.data.ResponseMSG);
				}
			}, function (reason) {
				Swal.fire('Failed' + reason);
			});
        }
	};
		
	$scope.getNepaliCalendar = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		var para = {
			YearId: $scope.newFilter.YearId,
			MonthId: $scope.newFilter.MonthId
		};
		$scope.DaysByMonthYr = [];
		$http({
			method: 'POST',
			url: base_url + "AppCMS/Creation/GetDaysByYrMonth",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";

			if (res.data.IsSuccess && res.data.Data) {
				$scope.DaysByMonthYr = res.data.Data;
			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	};


	$scope.SaveEmployeeWiseWeekend = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		var weekendData = [];


		$scope.EmployeeWiseWeekendList.forEach(function (emp) {
			// Get the employee's weekend data for each day (1-32)
			for (let day = 1; day <= 32; day++) {
				if (emp['Day' + day] !== undefined && emp['Day' + day] !== null) {
					const combinedDate = new Date(
						$scope.newFilter.YearId,  
						$scope.newFilter.MonthId,
						day
					);

					// Format the combined date
					const formattedDate = $filter('date')(combinedDate, 'yyyy-MM-dd');

					// Prepare data to be inserted into tbl_EmployeeWiseWeekend
					weekendData.push({
						EmployeeId: emp.EmployeeId,
						W_Date: formattedDate ,
						NY: $scope.newFilter.YearId,  
						NM: $scope.newFilter.MonthId, 
						ND: day,
						IsWeekEnd: emp['Day' + day]
					});
				}
			}
		});


		$http({
			method: 'POST',
			url: base_url + "HR/Transaction/SaveEmpWiseWeekend",
			headers: { 'Content-Type': undefined },
			transformRequest: function (data) {
				var formData = new FormData();
				formData.append("jsonData", angular.toJson(data.jsonData));
				return formData;
			},
			data: { jsonData: weekendData }
		}).then(function (res) {
			$scope.loadingstatus = "stop";
			hidePleaseWait();
			Swal.fire(res.data.ResponseMSG);
			if (res.data.IsSuccess == true) {
				$scope.GetEmployeeWiseWeekend();
			}
		}, function (errormessage) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
		});
	}



	//Validation for YearID and MonthId
	$scope.IsValidtoDel = function () {
		if ($scope.newFilter.BranchId == null) {
			Swal.fire('Please ! Select Branch');
			return false;
		}
		if ($scope.newFilter.DepartmentId == null) {
			Swal.fire('Please ! Select Department');
			return false;
		}
		if ($scope.newFilter.YearId == null) {
			Swal.fire('Please ! Select Year');
			return false;
		}
		if ($scope.newFilter.MonthId == null) {
			Swal.fire('Please ! Select Month');
			return false;
		}
		return true;
	}

	$scope.DeleteEmployeeWiseWeekend = function () {
		if ($scope.IsValidtoDel() == true) {

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
						BranchId: $scope.newFilter.BranchId,
						DepartmentId: $scope.newFilter.DepartmentId,
						YearId: $scope.newFilter.YearId,
						MonthId: $scope.newFilter.MonthId,
					};

					$http({
						method: 'POST',
						url: base_url + "HR/Transaction/DelEmployeeWiseWeekend",
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
        }


	};

	$scope.pageChangeHandler = function (num) {
		console.log('page changed to ' + num);
	};
});