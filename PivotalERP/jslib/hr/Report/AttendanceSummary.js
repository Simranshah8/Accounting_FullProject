
app.controller("AttendanceSummaryController", function ($scope, $http, $filter, $timeout, GlobalServices, $compile) {

	LoadData();
	$scope.onBtExportCSV = function () {
		var params = {
			fileName: 'AttendanceSummary.csv',
			sheetName: 'AttendanceSummary'
		};

		$scope.gridOptions1.api.exportDataAsCsv(params);
	}
	$scope.onFilterTextBoxChanged = function () {
		$scope.gridOptions1.api.setQuickFilter($scope.search);
	}

	function LoadData() {
		$('.select2').select2();

		$scope.newMonthly = {
			CompanyRelationshipId: null,
			YearId: null,
			MonthIds: null,
			BranchId: null,
		};

		$scope.MonthList = GlobalServices.getMonthList();
		$scope.YearList = GlobalServices.getYearList();

		$scope.CurDate = {};
		$http({
			method: 'POST',
			url: base_url + "Global/GetDate",
			dataType: "json"
		}).then(function (res) {
			$scope.CurDate = res.data.Data;

			$scope.newMonthly.YearId = $scope.CurDate.NY;
			$scope.newMonthly.MonthId = $scope.CurDate.NM;

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});


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

		//for group
		$scope.GroupList = [];
		$http({
			method: 'Get',
			url: base_url + "HR/Master/GetAllEmployeeGroup",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.GroupList = res.data.Data;
			} else {
				Swal.fire(res.data.ResponseMSG);
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

		
	}
	 
	$scope.ClearData = function () {

		var DataColl = [];
		$scope.gridOptionsBottom.api.setRowData(DataColl);

		$scope.gridOptions.api.setRowData(DataColl);
	};

	  
	$scope.GetMonthAttendance = function () {
		$scope.DataColl = [];
		var para = {
			YearId: $scope.newMonthly.YearId,
			MonthId: $scope.newMonthly.MonthId,
			BranchIdColl: $scope.newMonthly.BranchIds?.length > 0 ? $scope.newMonthly.BranchIds.toString() : null,
			DepartmentIdColl: $scope.newMonthly.DepartmentIds?.length > 0 ? $scope.newMonthly.DepartmentIds.toString() : null,
			CompanyRelationshipId: $scope.newMonthly.CompanyRelationshipId || null,
			//DepartmentIdColl: $scope.newDaily.DepartmentId,
			//GroupIdColl: $scope.newDaily.GroupId,
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
						//$scope.gridOptions1.api.exportDataAsCsv($scope.DataColl);
					});
				}

			} else {
				Swal.fire(res.data.ResponseMSG)
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
					{ field: "EmpCode", headerName: "Emp. Code", pinned: 'left', width: 140, dataType: 'text', filter: 'agTextColumnFilter', cellStyle: { 'textAlign': 'left' } },
					{ field: "Name", headerName: "Name", pinned: 'left', width: 200, dataType: 'text', filter: 'agTextColumnFilter', cellStyle: { 'textAlign': 'left' } },
					{ field: "EnrollNumber", headerName: "Enroll No", width: 140, dataType: 'Number', filter: 'agTextColumnFilter', cellStyle: { 'textAlign': 'left' } },
					{ field: "BranchName", headerName: "Branch", dataType: 'text', width: 140, filter: 'agTextColumnFilter', cellStyle: { 'textAlign': 'left' } },
					{ field: "BranchAddress", headerName: "Branch Address", dataType: 'text', width: 140, filter: 'agTextColumnFilter', cellStyle: { 'textAlign': 'left' } },
					{ field: "Department", headerName: "Department", width: 140, dataType: 'text', filter: 'agTextColumnFilter', cellStyle: { 'textAlign': 'left' } },
					{ field: "Designation", headerName: "Designation", width: 140, dataType: 'text', filter: 'agTextColumnFilter', cellStyle: { 'textAlign': 'left' } },
					{ field: "Category", headerName: "Category", dataType: 'text', width: 140, filter: 'agTextColumnFilter', cellStyle: { 'textAlign': 'left' } },
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
			{ field: "GroupName", headerName: "Emp Group", filter: 'agTextColumnFilter', width: 130, cellStyle: { 'textAlign': 'left' } },
			{ field: "LevelName", headerName: "Level", filter: 'agTextColumnFilter', width: 130, cellStyle: { 'textAlign': 'left' } },
			{ field: "ServiceType", headerName: "Service Type", filter: 'agTextColumnFilter', width: 130, cellStyle: { 'textAlign': 'left' } },
			{ field: "WorkingShift", headerName: "Shift", dataType: 'Number', width: 120, filter: 'agNumberColumnFilter', cellStyle: { 'textAlign': 'left' } },
			{ field: "TotalPresent", headerName: "Present", dataType: 'Number', width: 140, filter: 'agNumberColumnFilter', cellStyle: { 'textAlign': 'left' } },
			{ field: "TotalWeekend", headerName: "Weekend", dataType: 'Number', width: 140, filter: 'agNumberColumnFilter', cellStyle: { 'textAlign': 'left' } },
			{ field: "TotalHoliday", headerName: "Holiday", dataType: 'Number', width: 140, filter: 'agNumberColumnFilter', cellStyle: { 'textAlign': 'left' } },
			{ field: "TotalLeave", headerName: "Leave", dataType: 'Number', width: 140, filter: 'agNumberColumnFilter', cellStyle: { 'textAlign': 'left' } },
			{ field: "TotalPayableDays", headerName: "Total Payable Days", dataType: 'Number', width: 140, filter: 'agNumberColumnFilter', cellStyle: { 'textAlign': 'left' } },
			{ field: "TotalAbsent", headerName: "Absent", dataType: 'Number', width: 140, filter: 'agNumberColumnFilter', cellStyle: { 'textAlign': 'left' } },
			{ field: "TotalDays", headerName: "Total Days", dataType: 'Number', width: 140, filter: 'agNumberColumnFilter', cellStyle: { 'textAlign': 'left' } },
			{ field: "OTHour", headerName: "Total O.T.", dataType: 'Number', width: 140, filter: 'agNumberColumnFilter', cellStyle: { 'textAlign': 'left' } },
			{ field: "LeaveOT", headerName: "Total L.O.T.", dataType: 'Number', width: 140, filter: 'agNumberColumnFilter', cellStyle: { 'textAlign': 'left' } },
			{ field: "Company", headerName: "Company", filter: 'agTextColumnFilter', width: 130, cellStyle: { 'textAlign': 'left' } },
			
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




	$scope.DownloadAsXls = function () {
		$scope.loadingstatus = 'running';
		showPleaseWait();
		var dataColl = $scope.GetDataForPrint();
		var paraData = {
			YearId: $scope.newMonthly.YearId,
			MonthId: $scope.newMonthly.MonthId,
			branchIdColl: $scope.newMonthly.BranchId
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
				down_file(base_url + "//" + res.data.Data.ResponseId, "AttendanceSummary.xlsx");
			}

		}, function (errormessage) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			Swal.fire(errormessage);
		});
	}


	$scope.GetDataForPrint = function () {
		var filterData = [];
		$scope.gridOptions1.api.forEachNodeAfterFilterAndSort(function (node) {
			var dayBook = node.data;
			filterData.push(dayBook);
		});
		return filterData;
	}

	$scope.onFilterTextBoxChanged = function () {
		$scope.gridOptions1.api.setQuickFilter($scope.search);
	}

	$scope.DownloadDetAsXls = function ()
	{
		$scope.loadingstatus = 'running';
		showPleaseWait();

		var filterData = [];
		$scope.gridOptions1.api.forEachNodeAfterFilterAndSort(function (node) {
			var dayBook = node.data;
			var newRow = {
				EmployeeId: dayBook.EmployeeId,
				Name: dayBook.Name,
				EnrollNumber: dayBook.EnrollNumber,
				Branch: dayBook.Branch,
				TotalDays: dayBook.TotalDays,
				TotalHoliday: dayBook.TotalHoliday,
				TotalWeekend: dayBook.TotalWeekend,
				EmpCode: dayBook.EmpCode,
				DateFrom: dayBook.DateFrom,
				DateTo: dayBook.DateTo,
				NM: dayBook.NM,
				NY: dayBook.NY,
				TotalAbsent: dayBook.TotalAbsent,
				WorkingDuration: dayBook.WorkingDuration,
				OTDuration: dayBook.OTDuration,
				DelayOutCount: dayBook.DelayOutCount,
				EarlyOutCount: dayBook.EarlyOutCount,
				LateInCount: dayBook.LateInCount,
				EarlyInCount: dayBook.EarlyInCount,
				SinglePunchCount: dayBook.SinglePunchCount,
				DelayOutMinutes: dayBook.DelayOutMinutes,
				EarlyOutMinutes: dayBook.EarlyOutMinutes,
				LateInMinutes: dayBook.LateInMinutes,
				EarlyInMinutes: dayBook.EarlyInMinutes,
				SinglePunchDeduction: dayBook.SinglePunchDeduction,
				Designation: dayBook.Designation,
				TotalLeave: dayBook.TotalLeave,
			};
			filterData.push(newRow);
		}); 

 

		$http({
			method: 'POST',
			url: base_url + "HR/Report/DownloadXlsAttDet",
			headers: { 'Content-Type': undefined },

			transformRequest: function (data) {
				var formData = new FormData();				
				formData.append("jsonData", angular.toJson(data.jsonData));
				formData.append("RptPath", "");
				return formData;
			},
			data: { jsonData: filterData }
		}).then(function (res) {

			$scope.loadingstatus = "stop";
			hidePleaseWait();
			if (res.data.IsSuccess && res.data.Data) {
				var fname = "Monthly Attendance Report " + $scope.newMonthly.YearId + "-" + $scope.newMonthly.MonthId+".xlsx";
				down_file(base_url + "//" + res.data.Data.ResponseId, fname);
			}

		}, function (errormessage) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			Swal.fire(errormessage);
		});
	}


});
