app.controller('EmployeeAttendanceController', function ($scope, $http, $timeout, $filter,  GlobalServices) {
	$scope.Title = 'Employee Attendance';
	$('.select2').select2();

	//getterAndSetter();


	$scope.DateFormatAD = function (date) {

		if (date) {
			date = new Date(date);
			return $filter('date')(date, 'yyyy-MM-dd');
		}

		return '';
	};

	//$rootScope.ConfigFunction = function () {
	//	var keyColl = $translate.getTranslationTable();

	//	var Labels = {
	//		RegdNo: keyColl['REGDNO_LNG']
	//	};
	//	if ($rootScope.LANG == 'in') {

	//		var findInd = -1;

	//		$scope.gridApi3.grid.getColumn('DateAD').colDef.displayName = 'Date';
	//		$scope.gridApi3.grid.getColumn('DateAD').displayName = 'Date';

	//		findInd = $scope.gridOptions3.columnDefs.findIndex(function (obj) { return obj.name == 'DateBS' });
	//		if (findInd != -1)
	//			$scope.gridOptions3.columnDefs.splice(findInd, 1);

	//	}
	//	$scope.gridApi3.grid.refresh();

	//	 $scope.BranchList = [];
 //       $http({
 //           method: 'GET',
 //           url: base_url + "Setup/Security/GetAllBranchList",
 //           dataType: "json"
 //       }).then(function (res) {
 //           hidePleaseWait();
 //           $scope.loadingstatus = "stop";
 //           if (res.data.IsSuccess && res.data.Data) {
 //               $scope.BranchList = res.data.Data;

 //           } else {
 //               Swal.fire(res.data.ResponseMSG);
 //           }
 //       }, function (reason) {
 //           Swal.fire('Failed' + reason);
 //       });


	//	


	//};
	//$rootScope.ChangeLanguage();

	LoadData();

	function LoadData() {

		$scope.newDaily = {
			ForDate: null,
			ForDate_TMP: new Date(),
		};

		$scope.newMonthly = {
			YearId: 2078,
			MonthId: 0
		};

		$scope.newInOutDet = {
			FromDate_TMP: new Date(),
			ToDate_TMP: new Date(),
		};

		$scope.entity = {
			InOutDetails: 125
		};

		$http({
			method: 'GET',
			url: base_url + "ReportEngine/GetReportTemplates?entityId=" + $scope.entity.InOutDetails + "&voucherId=0&isTran=false",
			dataType: "json"
		}).then(function (res) {
			if (res.data.IsSuccess && res.data.Data)
				$scope.newInOutDet.TemplatesColl = res.data.Data;
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


		$scope.MonthList = GlobalServices.getMonthList();
		//$scope.MonthList = [];
		//GlobalServices.getMonthListFromDB().then(function (res1) {
		//	angular.forEach(res1.data.Data, function (m) {
		//		$scope.MonthList.push({ id: m.NM, text: m.MonthName });
		//	});

		//}, function (reason) {
		//	Swal.fire('Failed' + reason);
		//});

		$scope.YearList = GlobalServices.getYearList();
		$scope.EmployeeSearchOptions = GlobalServices.getEmployeeSearchOptions();
		$scope.newEmp = {
			EmployeeId: 0,
			DateFrom_TMP: new Date(),
			DateTo_TMP: new Date(),
			SelectEmployee: $scope.EmployeeSearchOptions[0].value,
		};

		$scope.newManual = {
			ForDate: null,
			ForDate_TMP: new Date(),
		};

		$scope.newAbsent = {
			ForDate: null,
			ForDate_TMP: new Date(),
		};
		//for color
		$scope.AttendanceColors = {};
		$http({
			method: 'POST',
			url: base_url + "HR/Transaction/GetAllAttendanceColorConfig",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.AttendanceColors = res.data.Data;

			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

		//Daily Biometric Attendance
		$scope.columnDefs = [
			{ field: "EmpCode", headerName: "Emp.Code", pinned: 'left',filter: 'agNumberColumnFilter', width: 115, cellStyle: { 'textAlign': 'left' } },
			{ field: "Name", headerName: "Name", pinned: 'left',filter: 'agTextColumnFilter', width: 200, cellStyle: { 'textAlign': 'left' } },
			{ field: "WorkingShift", headerName: "Shift", pinned: 'left', filter: 'agTextColumnFilter', width: 120, cellStyle: { 'textAlign': 'left' } },
			{
				field: "Attendance", headerName: "Attendance", pinned: 'left', filter: 'agTextColumnFilter', width: 125, cellStyle: function (params) {
					const value = params.value || '';
					const colors = $scope.AttendanceColors || {};
					let cellStyle = {
						color: '#000000',
						backgroundColor: '#ffffff'
					};
					if (colors) {
						if (value === 'P') { // Present
							cellStyle.color = colors.PColor || '#000000';
							cellStyle.backgroundColor = colors.PCellColor || '#ffffff';
						} else if (value === 'A') { // Absent
							cellStyle.color = colors.AColor || '#000000';
							cellStyle.backgroundColor = colors.ACellColor || '#ffffff';
						} else if (value === 'L') { // Leave
							cellStyle.color = colors.LColor || '#000000';
							cellStyle.backgroundColor = colors.LCellColor || '#ffffff';
						} else if (value === 'W') { // Weekend
							cellStyle.color = colors.WColor || '#000000';
							cellStyle.backgroundColor = colors.WCellColor || '#ffffff';
						} else if (value === 'H') { // Holiday
							cellStyle.color = colors.HColor || '#000000';
							cellStyle.backgroundColor = colors.HCellColor || '#ffffff';
						}
					}

					return cellStyle;
				}
			},
			{ field: "EnrollNo", headerName: "Enroll No", filter: 'agNumberColumnFilter', width: 115, cellStyle: { 'textAlign': 'left' } },
			{ field: "Branch", headerName: "BranchName", filter: 'agTextColumnFilter', width: 130, cellStyle: { 'textAlign': 'left' } },
			{ field: "Department", headerName: "Department", filter: 'agTextColumnFilter', width: 130, cellStyle: { 'textAlign': 'left' } },
			{ field: "Designation", headerName: "Designation", filter: 'agTextColumnFilter', width: 130, cellStyle: { 'textAlign': 'left' } },
			{ field: "Category", headerName: "Category", filter: 'agTextColumnFilter', width: 130, cellStyle: { 'textAlign': 'left' } },
			{ field: "InTime", headerName: "In Time", filter: 'agTextColumnFilter', width: 100, cellStyle: { 'textAlign': 'left' } },
			{ field: "OutTime", headerName: "Out Time", filter: 'agTextColumnFilter', width: 110, cellStyle: { 'textAlign': 'left' } },
			{ field: "In1", headerName: "In Time1", filter: 'agTextColumnFilter', width: 110, cellStyle: { 'textAlign': 'left' } },
			{ field: "Out1", headerName: "Out Time1", filter: 'agTextColumnFilter', width: 120, cellStyle: { 'textAlign': 'left' } },
			{ field: "In2", headerName: "In Time2", filter: 'agTextColumnFilter', width: 110, cellStyle: { 'textAlign': 'left' } },
			{ field: "Out2", headerName: "Out Time2", filter: 'agTextColumnFilter', width: 120, cellStyle: { 'textAlign': 'left' } },
			{ field: "In3", headerName: "In Time3", filter: 'agTextColumnFilter', width: 110, cellStyle: { 'textAlign': 'left' } },
			{ field: "Out3", headerName: "Out Time3", filter: 'agTextColumnFilter', width: 120, cellStyle: { 'textAlign': 'left' } },
			{ field: "In4", headerName: "In Time4", filter: 'agTextColumnFilter', width: 110, cellStyle: { 'textAlign': 'left' } },
			{ field: "Out4", headerName: "Out Time4", filter: 'agTextColumnFilter', width: 120, cellStyle: { 'textAlign': 'left' } },
			{ field: "In5", headerName: "In Time5", filter: 'agTextColumnFilter', width: 110, cellStyle: { 'textAlign': 'left' } },
			{ field: "Out5", headerName: "Out Time5", filter: 'agTextColumnFilter', width: 120, cellStyle: { 'textAlign': 'left' } },
			{ field: "LateInStr", headerName: "Late In", filter: 'agTextColumnFilter', width: 100, cellStyle: { 'textAlign': 'left' } },
			{ field: "BeforeOutStr", headerName: "Early Out", filter: 'agTextColumnFilter', width: 110, cellStyle: { 'textAlign': 'left' } },
			{ field: "OTHr", headerName: "OT Hour", filter: 'agTextColumnFilter', width: 105, cellStyle: { 'textAlign': 'left' } },
			{
				field: "WorkingHR", headerName: "Total Working Hours", pinned: 'right', filter: 'agNumberColumnFilter', width: 180, cellStyle: { 'textAlign': 'left' },
				cellRenderer: function (params) {
					return formatWorkingHR(params.value);
				} },
		];
		function formatWorkingHR(workingHR) {
			if (!workingHR) return ''; // Handle empty or null values

			const parts = workingHR.split(':'); // Split the value into hours and minutes
			const hours = parseInt(parts[0], 10); // Convert hours to integer
			const minutes = parseInt(parts[1], 10); // Convert minutes to integer

			// Construct the formatted string
			let formatted = '';
			if (hours > 0) {
				formatted += `${hours}H `;
			}
			if (minutes > 0) {
				formatted += `${minutes}M`;
			}
			return formatted.trim(); // Return the formatted string
		}

		// ag-Grid options
		$scope.gridOptions = {
			defaultColDef: {
				filter: true,
				resizable: true,
				sortable: true
			},
			enableSorting: true,
			multiSortKey: 'ctrl',
			enableColResize: true,
			overlayLoadingTemplate: "Loading..",
			overlayNoRowsTemplate: "No Records found",
			rowSelection: 'multiple',
			columnDefs: $scope.columnDefs,
			rowData: null,
			filter: true,
			enableFilter: true,
		};

		// Initialize grid after DOM is ready
		$timeout(function () {
			var eGridDiv = document.querySelector('#datatable');
			new agGrid.Grid(eGridDiv, $scope.gridOptions);
		});
		//end Daily Biometric Attendance


		//Employee Attendance
		$scope.columnDefs3= [
			{ field: "SNO", headerName: "S.No.", width: 90, pinned: 'left', filter: 'agNumberColumnFilter', cellStyle: { 'textAlign': 'left' }  },
			{
				field: "DateAD", headerName: "Date(A.D.)", width: 140, pinned: 'left', filter: 'agNumberColumnFilter', cellStyle: { 'textAlign': 'left' }, valueFormatter: function (params) {
					var date = new Date(params.value);
					return date.toLocaleDateString(); // Formats date as MM/DD/YYYY
				}  },
			{ field: "DateBS", headerName: "Date(B.S.)", width: 140, pinned: 'left', filter: 'agNumberColumnFilter', cellStyle: { 'textAlign': 'left' }  },
			{ field: "InTime", headerName: "In Time", width: 140, filter: 'agNumberColumnFilter', cellStyle: { 'textAlign': 'left' }  },
			{ field: "OutTime", headerName: "Out Time", width: 140, filter: 'agNumberColumnFilter', cellStyle: { 'textAlign': 'left' }  },
			{ field: "Attendance", headerName: "Attendance", width: 140, filter: 'agNumberColumnFilter', cellStyle: { 'textAlign': 'left' }  },
			{ field: "WorkingHour", headerName: "Working Hour", width: 140, filter: 'agNumberColumnFilter', cellStyle: { 'textAlign': 'left' }  },
			{ field: "WorkingShift", headerName: "Shift", width: 120, filter: 'agNumberColumnFilter', cellStyle: { 'textAlign': 'left' }  },
			{ field: "OTHour", headerName: "OT Hour", width: 120, filter: 'agNumberColumnFilter', cellStyle: { 'textAlign': 'left' }  },
		];


		// ag-Grid options
		$scope.gridOptions3 = {
			defaultColDef: {
				filter: true,
				resizable: true,
				sortable: true
			},
			enableSorting: true,
			multiSortKey: 'ctrl',
			enableColResize: true,
			overlayLoadingTemplate: "Loading..",
			overlayNoRowsTemplate: "No Records found",
			rowSelection: 'multiple',
			columnDefs: $scope.columnDefs3,
			rowData: null,
			filter: true,
			enableFilter: true,
		};

		// Initialize grid after DOM is ready
		$timeout(function () {
			var eGridDiv = document.querySelector('#datatable3');
			new agGrid.Grid(eGridDiv, $scope.gridOptions3);
		});
		//end Employee Attendance


		//Manual Attendance
		$scope.columnDefs4 = [
			{ field: "SNo", headerName: "S.No.", width: 90, pinned: 'left',filter: 'agNumberColumnFilter', cellStyle: { 'textAlign': 'left' } },
			{ field: "EmpCode", headerName: "Emp.Code", width: 140, pinned: 'left',filter: 'agNumberColumnFilter', cellStyle: { 'textAlign': 'left' } },
			{ field: "Name", headerName: "Name", width: 200, pinned: 'left', filter: 'agNumberColumnFilter', cellStyle: { 'textAlign': 'left' } },
			{ field: "Designation", headerName: "Designation", width: 140, filter: 'agNumberColumnFilter', cellStyle: { 'textAlign': 'left' } },
			{ field: "EnrollNo", headerName: "Enroll No", width: 140, filter: 'agNumberColumnFilter', cellStyle: { 'textAlign': 'left' } },
			{ field: "Attendance", headerName: "Attendance", width: 140, filter: 'agNumberColumnFilter', cellStyle: { 'textAlign': 'left' } },
			{ field: "Lateinmin", headerName: "Late in min", width: 140, filter: 'agNumberColumnFilter', cellStyle: { 'textAlign': 'left' } },
			{ field: "Remarks", headerName: "Remarks", width: 140, filter: 'agNumberColumnFilter', cellStyle: { 'textAlign': 'left' } },
			{ field: "Category", headerName: "Category", width: 140, filter: 'agNumberColumnFilter', cellStyle: { 'textAlign': 'left' } },
			{ field: "BranchName", headerName: "Branch", width: 140, filter: 'agNumberColumnFilter', cellStyle: { 'textAlign': 'left' } },
			{ field: "BranchAddress", headerName: "Branch Address", width: 140, filter: 'agNumberColumnFilter', cellStyle: { 'textAlign': 'left' } },
			//{ field: "WorkingShift", headerName: "Shift", width: 120, filter: 'agNumberColumnFilter', cellStyle: { 'textAlign': 'left' } },

		];


		// ag-Grid options
		$scope.gridOptions4 = {
			defaultColDef: {
				filter: true,
				resizable: true,
				sortable: true
			},
			enableSorting: true,
			multiSortKey: 'ctrl',
			enableColResize: true,
			overlayLoadingTemplate: "Loading..",
			overlayNoRowsTemplate: "No Records found",
			rowSelection: 'multiple',
			columnDefs: $scope.columnDefs4,
			rowData: null,
			filter: true,
			enableFilter: true,
		};

		// Initialize grid after DOM is ready
		$timeout(function () {
			var eGridDiv = document.querySelector('#datatable4');
			new agGrid.Grid(eGridDiv, $scope.gridOptions4);
		});
		//end Manual Attendance



		//Absent Only Start
		$scope.columnDefs5 = [
			{ field: "SNo", headerName: "S.No.", width: 90, pinned: 'left', filter: 'agNumberColumnFilter', cellStyle: { 'textAlign': 'left' } },
			{ field: "EmpCode", headerName: "Emp.Code", width: 140, pinned: 'left',filter: 'agNumberColumnFilter', cellStyle: { 'textAlign': 'left' } },
			{ field: "Name", headerName: "Name", width: 200, pinned: 'left', filter: 'agNumberColumnFilter', cellStyle: { 'textAlign': 'left' } },
			{ field: "Designation", headerName: "Designation", width: 140, filter: 'agNumberColumnFilter', cellStyle: { 'textAlign': 'left' } },
			{ field: "EnrollNo", headerName: "Enroll No", width: 140, filter: 'agNumberColumnFilter', cellStyle: { 'textAlign': 'left' } },
			{ field: "Attendance", headerName: "Attendance", width: 140, filter: 'agNumberColumnFilter', cellStyle: { 'textAlign': 'left' } },
			{ field: "Category", headerName: "Category", width: 140, filter: 'agNumberColumnFilter', cellStyle: { 'textAlign': 'left' } },
			{ field: "BranchName", headerName: "Branch", width: 140, filter: 'agNumberColumnFilter', cellStyle: { 'textAlign': 'left' } },
			{ field: "BranchAddress", headerName: "Branch Address", width: 140, filter: 'agNumberColumnFilter', cellStyle: { 'textAlign': 'left' } },
			//{ field: "WorkingShift", headerName: "Shift", width: 120, filter: 'agNumberColumnFilter', cellStyle: { 'textAlign': 'left' } },
		];


		// ag-Grid options
		$scope.gridOptions5 = {
			defaultColDef: {
				filter: true,
				resizable: true,
				sortable: true
			},
			enableSorting: true,
			multiSortKey: 'ctrl',
			enableColResize: true,
			overlayLoadingTemplate: "Loading..",
			overlayNoRowsTemplate: "No Records found",
			rowSelection: 'multiple',
			columnDefs: $scope.columnDefs5,
			rowData: null,
			filter: true,
			enableFilter: true,
		};

		// Initialize grid after DOM is ready
		$timeout(function () {
			var eGridDiv = document.querySelector('#datatable5');
			new agGrid.Grid(eGridDiv, $scope.gridOptions5);
		});
		//end Absent Only Start


        $scope.loadingstatus = 'stop';

	};

	$scope.csvDailyAttendance = function () {
		var params = {
			fileName: 'Daily Attendance.csv',
			sheetName: 'Daily Attendance'
		};

		$scope.gridOptions.api.exportDataAsCsv(params);
	}

	$scope.GetDailyAttendance = function () {
		if ($scope.loadingstatus != 'stop') {
			alert('Already Running Process')
			return;
		}
		$scope.DataColl = []; //declare an empty array

		$scope.newDaily.TotalEmployees = 0;
		$scope.newDaily.TotalPresent = 0;
		$scope.newDaily.TotalAbsent = 0;
		$scope.newDaily.TotalWeekEnd = 0;
		$scope.newDaily.TotalLeave = 0;

		var para = {
			forDate: $filter('date')($scope.newDaily.ForDateDet.dateAD, 'yyyy-MM-dd'),
			branchIdColl: $scope.newDaily.BranchId
		};
		$scope.loadingstatus = "running";
		showPleaseWait();
		$http({
			method: 'POST',
			url: base_url + "HR/Report/GetEmpDailyAttendance",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess) {
				$scope.DataColl = res.data.Data;

				$scope.gridOptions.api.setRowData($scope.DataColl);


				var query = mx($scope.DataColl);

				$scope.newDaily.TotalEmployees = $scope.DataColl.length;

				$scope.newDaily.TotalPresent = query.count(p1 => p1.Attendance == "P");
				$scope.newDaily.TotalAbsent = query.count(p1 => p1.Attendance == "A");
				$scope.newDaily.TotalLeave = query.count(p1 => p1.Attendance == "L");
				$scope.newDaily.TotalWeekEnd = query.count(p1 => p1.Attendance == "W");

			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	}

	$scope.csvMonthAttendance = function () {
		var params = {
			fileName: 'Monthly Attendance.csv',
			sheetName: 'Monthly Attendance'
		};

		$scope.gridOptions1.api.exportDataAsCsv(params);
	}


	$scope.GetMonthAttendance = function () {
		$scope.DataColl = [];
		var para = {
			YearId: $scope.newMonthly.YearId,
			MonthId: $scope.newMonthly.MonthId,
			branchIdColl: $scope.newMonthly.BranchId
		};
		$scope.loadingstatus = "running";
		showPleaseWait();
		$http({
			method: 'POST',
			url: base_url + "HR/Report/GetEmpMonthlyBIOAttendance",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess) {
				$scope.DataColl = res.data.Data;
				 

				if ($scope.DataColl && $scope.DataColl.length > 0) {

					$timeout(function () {
						var totalDays = $scope.DataColl[0].TotalDays;
						$scope.StartDay = new Date($scope.DataColl[0].DateFrom).getDay();
						$scope.generateMonthlyColumns(totalDays);
						$scope.gridOptions1.api.setRowData($scope.DataColl);
					});
				}

			} else {
				alert(res.data.ResponseMSG)
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	}
	$scope.showDayDetails = function (dayField) {
		var dayNumber = dayField.replace('Day', '');
		showPleaseWait();
		var fromDate = $scope.newMonthly.YearId + '-' + ('0' + $scope.newMonthly.MonthId).slice(-2) + '-' + ('0' + dayNumber).slice(-2);

		var para = {
			FromDate: new Date(fromDate.dateAD),  // Ensure the format is correct for the backend (e.g., "YYYY-MM-DD")
			EmployeeId: $scope.DataColl.EmployeeId  // Assuming empCode is the EmployeeId
		};
		$http({
			method: 'POST',
			url: base_url + "HR/Report/GetEmpDetForAttendanceSummary", 
			data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			if (res.data.IsSuccess) {
				$scope.modalDetails = {
					EmpCode: res.data.EmployeeCode,  
					Name: res.data.EmployeeName,  
					Designation: res.data.Designation,
					Day: dayNumber,
					FullDate: fromDate,  
					LateInMinutes: res.data.LateIn || "N/A", 
					OutTime: res.data.EarlyOut || "N/A" 
				};
				$("#EmpDetail").modal('show');  
			} else {
				Swal.fire(res.data.ResponseMSG || "Failed to load details.");
			}
		}, function (error) {
			hidePleaseWait();
			Swal.fire("Error fetching details: " + error);
		});
	};

	$scope.generateMonthlyColumns = function (totalDays) {
		// Start with fixed columns (like SNo, EmpCode, etc.)
		var columnDefs = [
			{
				headerName: "Employee Info",
				children: [
					{ field: "EmpCode", headerName: "Emp. Code", pinned: 'left', width: 140, dataType: 'text', filter: 'agNumberColumnFilter', cellStyle: { 'textAlign': 'left' } },
					{ field: "Name", headerName: "Name", pinned: 'left', width: 200, dataType: 'text', filter: 'agNumberColumnFilter', cellStyle: { 'textAlign': 'left' } },
					{ field: "Designation", headerName: "Designation", width: 140, dataType: 'text', filter: 'agNumberColumnFilter', cellStyle: { 'textAlign': 'left' } },
					{ field: "EnrollNumber", headerName: "Enroll No", width: 140, dataType: 'Number', filter: 'agNumberColumnFilter', cellStyle: { 'textAlign': 'left' } },
					{ field: "Category", headerName: "Category", dataType: 'text', width: 140, filter: 'agNumberColumnFilter', cellStyle: { 'textAlign': 'left' } },
					{ field: "BranchName", headerName: "Branch", dataType: 'text', width: 140, filter: 'agNumberColumnFilter', cellStyle: { 'textAlign': 'left' } },
					{ field: "BranchAddress", headerName: "Branch Address", dataType: 'text', width: 140, filter: 'agNumberColumnFilter', cellStyle: { 'textAlign': 'left' } }
				]
			}
		];
		const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
		for (var i = 1; i <= totalDays; i++) {
			var weekdayName = weekdays[$scope.StartDay];
			var dayName = i;

			columnDefs.push({
				headerName: weekdayName,
				children: [{
					field: "Day" + i,
					headerName: dayName,
					width: 70,
					rowGroup: false,
					cellStyle: function (params) {
						const value = params.value || '';
						const colors = $scope.AttendanceColors || {};
						let cellStyle = {
							color: '#000000',
							backgroundColor: '#ffffff'
						};
						if (colors) {
							if (value === 'P') { // Present
								cellStyle.color = colors.PColor || '#000000';
								cellStyle.backgroundColor = colors.PCellColor || '#ffffff';
							} else if (value === 'A') { // Absent
								cellStyle.color = colors.AColor || '#000000';
								cellStyle.backgroundColor = colors.ACellColor || '#ffffff';
							} else if (value === 'L') { // Leave
								cellStyle.color = colors.LColor || '#000000';
								cellStyle.backgroundColor = colors.LCellColor || '#ffffff';
							} else if (value === 'W') { // Weekend
								cellStyle.color = colors.WColor || '#000000';
								cellStyle.backgroundColor = colors.WCellColor || '#ffffff';
							} else if (value === 'H') { // Holiday
								cellStyle.color = colors.HColor || '#000000';
								cellStyle.backgroundColor = colors.HCellColor || '#ffffff';
							}
						}
						return cellStyle;
					},
					cellRenderer: function (params) {
						// Wrap the content with a clickable span to invoke AngularJS function
						return `<span class="day-cell" style="cursor:pointer;" 
                            ng-click="showDayDetails('Day${params.colDef.headerName}')">
                            ${params.value || ''}
                            </span>`;
					}
				}]
			});
			$scope.StartDay++;
			if ($scope.StartDay == 7)
				$scope.StartDay = 0;

		}
		
		// Add additional fixed columns for totals (e.g., WorkingShift, TotalDays, etc.)
		columnDefs.push(
			{ field: "WorkingShift", headerName: "Shift", dataType: 'Number', width: 120, filter: 'agNumberColumnFilter', cellStyle: { 'textAlign': 'left' } },
			{ field: "TotalDays", headerName: "Total Days", dataType: 'Number', width: 140, filter: 'agNumberColumnFilter', cellStyle: { 'textAlign': 'left' } },
			{ field: "TotalWeekend", headerName: "Weekend", dataType: 'Number', width: 140, filter: 'agNumberColumnFilter', cellStyle: { 'textAlign': 'left' } },
			{ field: "TotalPresent", headerName: "Present", dataType: 'Number', width: 140, filter: 'agNumberColumnFilter', cellStyle: { 'textAlign': 'left' } },
			{ field: "TotalAbsent", headerName: "Leave", dataType: 'Number', width: 140, filter: 'agNumberColumnFilter', cellStyle: { 'textAlign': 'left' } },
			{ field: "TotalHoliday", headerName: "Holiday", dataType: 'Number', width: 140, filter: 'agNumberColumnFilter', cellStyle: { 'textAlign': 'left' } }
		);
		// Update the column definitions of the grid
		$scope.gridOptions1.api.setColumnDefs(columnDefs);
	};

	// ag-Grid options for attendance summary
	$scope.gridOptions1 = {
		defaultColDef: {
			filter: true,
			resizable: true,
			sortable: true
		},
		enableSorting: true,
		multiSortKey: 'ctrl',
		overlayLoadingTemplate: "Loading...",
		overlayNoRowsTemplate: "No Records found",
		rowSelection: 'multiple',
		columnDefs: $scope.columnDefs1,
		rowData: null
		//pagination: true,
		//paginationPageSize: 10
	};

	// Initialize grid after DOM is ready
	$timeout(function () {
		var eGridDiv = document.querySelector('#datatable1');
		new agGrid.Grid(eGridDiv, $scope.gridOptions1);
	});

	$scope.csvEmpBIOAttendance = function () {
		var params = {
			fileName: 'Emp Attendance.csv',
			sheetName: 'Emp Attendance'
		};

		$scope.gridOptions3.api.exportDataAsCsv(params);
	}

	$scope.getEmpBIOAttendance = function () {

		if ($scope.newEmp.EmployeeId && $scope.newEmp.DateFromDet && $scope.newEmp.DateToDet) {

		} else
			return;

		$scope.newEmp.TotalDays = 0;
		$scope.newEmp.TotalPresent = 0;
		$scope.newEmp.TotalAbsent = 0;
		$scope.newEmp.TotalWeekEnd = 0;
		$scope.newEmp.TotalHoliday = 0;

		$scope.gridOptions3.data = [];

		var para = {
			employeeId: $scope.newEmp.EmployeeId,
			fromDate: $filter('date')($scope.newEmp.DateFromDet.dateAD, 'yyyy-MM-dd'),
			toDate: $filter('date')($scope.newEmp.DateToDet.dateAD, 'yyyy-MM-dd')
		};
		$scope.loadingstatus = "running";
		showPleaseWait();
		$http({
			method: 'POST',
			url: base_url + "HR/Report/GetEmpWiseAttendance",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess) {

				var dataColl = res.data.Data;
				$scope.gridOptions3.data = dataColl;
				$scope.gridOptions3.api.setRowData(dataColl);

				var query = mx(dataColl);

				$scope.newEmp.TotalDays = dataColl.length;
				$scope.newEmp.TotalPresent = query.count(p1 => p1.IsPresent == true);
				$scope.newEmp.TotalWeekEnd = query.count(p1 => p1.IsWeekEnd == true);
				$scope.newEmp.TotalHoliday = query.count(p1 => p1.IsHoliday == true);

				if (dataColl && dataColl.length > 0)
					$scope.newEmp.TotalAbsent = dataColl[0].TotalAbsent;
				else
					$scope.newEmp.TotalAbsent = $scope.newEmp.TotalDays - $scope.newEmp.TotalWeekEnd - $scope.newEmp.TotalPresent - $scope.newEmp.TotalHoliday;
			} else {
				//alert(res.data.ResponseMSG)
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	};


	$scope.csvManualDaily = function () {
		var params = {
			fileName: 'Manual Attendance.csv',
			sheetName: 'Manual Attendance'
		};

		$scope.gridOptions4.api.exportDataAsCsv(params);
	}

	$scope.GetManualDailyAttendance = function () {
		$scope.DataColl = [];
		var para = {
			forDate: $filter('date')($scope.newManual.ForDateDet.dateAD, 'yyyy-MM-dd'),
			branchIdColl: $scope.newMonthly.BranchId
		};
		$scope.loadingstatus = "running";
		showPleaseWait();
		$http({
			method: 'POST',
			url: base_url + "HR/Report/GetEmpManualDailyAttendance",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess) {
				$scope.DataColl = res.data.Data;
				$scope.gridOptions4.api.setRowData($scope.DataColl);

			} else {
				//alert(res.data.ResponseMSG)
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	}

	$scope.csvEmpAbsent = function () {
		var params = {
			fileName: 'Absent Emp.csv',
			sheetName: 'Absent Emp'
		};

		$scope.gridOptions5.api.exportDataAsCsv(params);
	}

	$scope.GetEmpAbsentAttendance = function () {
		$scope.DataColl = [];
		var para = {
			forDate: $filter('date')($scope.newAbsent.ForDateDet.dateAD, 'yyyy-MM-dd'),
		};
		$scope.loadingstatus = "running";
		showPleaseWait();
		$http({
			method: 'POST',
			url: base_url + "HR/Report//GetEmpAbsentList",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess) {
				$scope.DataColl = res.data.Data;
				$scope.gridOptions5.api.setRowData($scope.DataColl);

			} else {
				//alert(res.data.ResponseMSG)
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	}

	$scope.PrintInOutDet = function () {
		if ($scope.newInOutDet.FromDateDet && $scope.newInOutDet.ToDateDet) {

			var EntityId = $scope.entity.Tabulation;

			var rptPara = {
				dateFrom: $filter('date')($scope.newInOutDet.FromDateDet.dateAD, 'yyyy-MM-dd'),
				dateTo: $filter('date')($scope.newInOutDet.ToDateDet.dateAD, 'yyyy-MM-dd'),
				dateFromBS: $scope.newInOutDet.FromDateDet.dateBS,
				dateToBS: $scope.newInOutDet.ToDateDet.dateBS,
				period: $scope.newInOutDet.FromDateDet.dateBS + ' TO ' + $scope.newInOutDet.ToDateDet.dateBS,
				rptTranId: $scope.newInOutDet.RptTranId
			};
			var paraQuery = param(rptPara);

			$scope.loadingstatus = 'running';
			document.getElementById("frmRptTabulation").src = '';
			document.getElementById("frmRptTabulation").style.width = '100%';
			document.getElementById("frmRptTabulation").style.height = '1300px';
			document.getElementById("frmRptTabulation").style.visibility = 'visible';
			document.getElementById("frmRptTabulation").src = base_url + "HR/Report/RdlEmpDateWiseInOut?" + paraQuery;

		}

	};

});