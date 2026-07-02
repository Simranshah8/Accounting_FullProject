app.controller('WeeklyShiftMappingController', function ($scope, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'Weekly Shift Mapping';

	$scope.LoadData = function () {
		$('.select2').select2();
		$scope.confirmMSG = GlobalServices.getConfirmMSG();
		$scope.perPageColl = GlobalServices.getPerPageList();
		$scope.MonthList = GlobalServices.getMonthList();
		$scope.YearList = GlobalServices.getYearList();
		$scope.EmployeeSearchOptions = GlobalServices.getEmployeeSearchOptions();


		$scope.currentPages = {
			WeeklyShiftMapping: 1,
		};
		$scope.searchData = {
			WeeklyShiftMapping: '',
		};
		$scope.perPage = {
			WeeklyShiftMapping: GlobalServices.getPerPageRow(),
		};



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

		$scope.WorkingShiftList = [];
		$http({
			method: 'POST',
			url: base_url + "HR/Master/GetAllWorkingShift",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.WorkingShiftList = res.data.Data;

			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});


		$scope.newFilter = {
			DateFrom_TMP: new Date(),
			DateTo_TMP: '',
			PeriodId: null,
			BranchId: null,
			DepartmentId: null,
			CategoryId: null,
			WorkingShiftId: null
		};


	}


	$scope.SaveWeeklyShiftMappingColl = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();

		// Prepare data for saving
		var weeklyShiftMappingCollection = [];

		// Iterate through the WeeklyShiftMappingList to construct the save data
		angular.forEach($scope.WeeklyShiftMappingList, function (employee) {
			angular.forEach(employee.WorkShiftColl, function (shift) {
				weeklyShiftMappingCollection.push({
					EmployeeId: employee.EmployeeId,
					WorkingShiftId: shift.WorkingShiftId || null, // Assign null if no shift is selected
					EffectiveDate: $filter('date')(shift.EffectiveDate, 'yyyy-MM-dd'), // Format date
					Remarks: shift.Remarks || '' // Default to an empty string if no remarks provided
				});
			});
		});

		// Send data to the backend API
		$http({
			method: 'POST',
			url: base_url + "HR/Transaction/SaveWeeklyShiftMappingColl",
			headers: { 'Content-Type': undefined },
			transformRequest: function (data) {
				var formData = new FormData();
				formData.append("jsonData", angular.toJson(data.jsonData));
				return formData;
			},
			data: { jsonData: weeklyShiftMappingCollection } // Convert to JSON string
		}).then(function (res) {
			$scope.loadingstatus = "stop";
			hidePleaseWait();

			// Handle success response
			if (res.data.IsSuccess) {
				Swal.fire("Success", res.data.ResponseMSG, "success");
			} else {
				Swal.fire("Error", res.data.ResponseMSG || "Failed to save data.", "error");
			}
		}, function (error) {
			$scope.loadingstatus = "stop";
			hidePleaseWait();

			// Handle error response
			Swal.fire("Error", "Failed to save Weekly Shift Mapping data", "error");
		});
	};



	$scope.GetWeeklyShiftMapping = function (reVal) {
		$scope.loadingstatus = "running";
		showPleaseWait();

		// Preparing parameters for the API call
		var para = {
			DateFrom: $scope.newFilter.DateFromDet ? $filter('date')(new Date($scope.newFilter.DateFromDet.dateAD), 'yyyy-MM-dd') : null,
			DateTo: $scope.newFilter.DateToDet ? $filter('date')(new Date($scope.newFilter.DateToDet.dateAD), 'yyyy-MM-dd') : null,
			BranchIdColl: ($scope.newFilter.BranchId === 0 ? '' : $scope.newFilter.BranchId),
			DepartmentIdColl: ($scope.newFilter.DepartmentId === 0 ? '' : $scope.newFilter.DepartmentId),
			DesignationIdColl: ($scope.newFilter.DesignationId === 0 ? '' : $scope.newFilter.DesignationId),
			CategoryIdColl: ($scope.newFilter.CategoryId === 0 ? '' : $scope.newFilter.CategoryId),
			WorkingShiftId: reVal.WorkingShiftId
		};

		$scope.WeeklyShiftMappingList = [];
		$scope.newFilter.DateList = [];

		$http({
			method: 'POST',
			url: base_url + "HR/Transaction/GetWeeklyShiftMapping",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";

			if (res.data.IsSuccess && res.data.Data) {
				var tmpDataColl = mx(res.data.Data);

				// Prepare the list of dates
				var DateQuery = tmpDataColl.groupBy(t => t.DateBS).toArray();
				angular.forEach(DateQuery, function (dateGroup) {
					var firstDate = dateGroup.elements[0];
					$scope.newFilter.DateList.push({
						id: firstDate.EmployeeId,
						text: dateGroup.key ? dateGroup.key : '',
						shorttext: firstDate.Year + '-' + firstDate.Month,
						forDate: new Date(firstDate.ForDate_AD)
					});
				});

				// Group data by EmployeeId
				var EmployeeQuery = tmpDataColl.groupBy(t => t.EmployeeId).toArray();

				angular.forEach(EmployeeQuery, function (employeeGroup) {
					var firstRecord = employeeGroup.elements[0];
					var subGroup = mx(employeeGroup.elements);

					var employeeData = {
						EmployeeId: firstRecord.EmployeeId,
						EnrollNumber: firstRecord.EnrollNumber,
						EmployeeCode: firstRecord.EmployeeCode,
						Name: firstRecord.Name,
						BranchName: firstRecord.BranchName,
						Department: firstRecord.Department,
						WorkingShiftId: firstRecord.WorkingShiftId,
						WorkShiftColl: []
					};

					// Match shift data for each date
					angular.forEach($scope.newFilter.DateList, function (date) {
						var matchingShift = subGroup.firstOrDefault(p1 => p1.DateBS === date.text);
						employeeData.WorkShiftColl.push({
							EffectiveDateBS: date.forDate,
							EffectiveDate: matchingShift.Date,
							WorkingShiftId: matchingShift.WorkingShiftId,
							WorkingShiftName: matchingShift.WorkingShiftName
						});
					});
					$scope.getNepaliCalendar();
					$scope.WeeklyShiftMappingList.push(employeeData);
				});

			} else {
				Swal.fire(res.data.ResponseMSG || 'No data found!');
			}
		}, function (reason) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			Swal.fire('Failed: ' + reason);
		});
	};

	$scope.DelWeeklyShiftMapping = function () {
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
					EmployeeId: $scope.WeeklyShiftMappingList[0].EmployeeId,
					DateFrom: $scope.newFilter.DateFromDet ? $filter('date')(new Date($scope.newFilter.DateFromDet.dateAD), 'yyyy-MM-dd') : null,
					DateTo: $scope.newFilter.DateToDet ? $filter('date')(new Date($scope.newFilter.DateToDet.dateAD), 'yyyy-MM-dd') : null,
				};

				$http({
					method: 'POST',
					url: base_url + "HR/Transaction/DelWeeklyShiftMapping",
					dataType: "json",
					data: JSON.stringify(para)
				}).then(function (res) {
					hidePleaseWait();
					$scope.loadingstatus = "stop";

					Swal.fire(res.data.ResponseMSG);
					if (res.data.IsSuccess) {
						$scope.GetWeeklyShiftMapping();
					} else {
						Swal.fire(res.data.ResponseMSG);
					}

				}, function (reason) {
					Swal.fire('Failed' + reason);
				});
			}
		});


	};


	$scope.getNepaliCalendar = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		var para = {
			DateFrom: $scope.newFilter.DateFromDet ? $filter('date')(new Date($scope.newFilter.DateFromDet.dateAD), 'yyyy-MM-dd') : null,
			DateTo: $scope.newFilter.DateToDet ? $filter('date')(new Date($scope.newFilter.DateToDet.dateAD), 'yyyy-MM-dd') : null,
		}
		$scope.DaysByDate = [];
		$http({
			method: 'POST',
			url: base_url + "AppCMS/Creation/GetDaysByDate",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";

			if (res.data.IsSuccess && res.data.Data) {
				$scope.DaysByDate = res.data.Data;
			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	};


	$scope.onSelectKeydown = function ($event, shift,colInd)
	{
		// Check for Ctrl + C (or Cmd + C on Mac)
		var isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
		var ctrlKey = isMac ? $event.metaKey : $event.ctrlKey;
		if (ctrlKey && $event.key === 'c') {
			// Prevent default copy behavior if necessary
			$event.preventDefault();
			$scope.copySelectValueToClipboard(shift);
		}	 
	};

	$scope.copySelectValueToClipboard = function (shift) {
		var value = shift.WorkingShiftId;
		if (value == null) {
			return;
		}

		// Try modern API first
		if (navigator.clipboard && navigator.clipboard.writeText)
		{
			navigator.clipboard.writeText(value).then(function () {
				console.log('Copied to clipboard: ' + value);
				// Optionally also copy into all rows
				
			}).catch(function (err) {
				console.error('Clipboard write failed', err);
			 
			});
		}  
	};

	$scope.PasteData = function (ph, sind) {
		var clipText = event.clipboardData.getData('text/plain');

		if (clipText) {
			$scope.loadingstatus = 'running';
			showPleaseWait();
			var value = parseInt(clipText);
			$scope.WeeklyShiftMappingList.forEach(function (emp) {
				if (emp.WorkShiftColl) {
					var ind = 0;
					emp.WorkShiftColl.forEach(function (ws) {
						if (ind == sind) {
							$timeout(function () {
								$scope.$apply(function () {
									ws.WorkingShiftId = value;
								});								
							}); 
						}
						ind++;
					})
				}
			});

			hidePleaseWait();
			$scope.loadingstatus = "stop";
		}
	}

	$scope.pasteSelectValueToClipboard = function (shift, colInd) {
		
		if (navigator.clipboard && navigator.clipboard.readText) {
			navigator.clipboard.readText().then(function (text)
			{
					console.log('Clipboard read:', text);
					
					var value = text;
					if (value == null) {
						return;
					}

					// Paste into all rows
					$scope.WeeklyShiftMappingList.forEach(function (emp) {
						if (emp.WorkShiftColl) {
							var ind = 0;
							emp.WorkShiftColl.forEach(function (ws) {
								if (ind == colInd) {
									emp.WorkingShiftId = value;
								}
							})
						}
					});
					// Angular needs a digest to update UI if this happens outside of ng event
					$timeout(function () { });
				})
				.catch(function (err) {
					console.error('Failed to read clipboard: ', err);
				});
		} else {
			console.warn('Clipboard API not supported for reading');
		}
		
	};

	$scope.pageChangeHandler = function (num) {
		console.log('page changed to ' + num);
	};
});