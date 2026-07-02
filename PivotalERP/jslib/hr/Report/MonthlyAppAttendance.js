
app.controller("MonthlyAppSummaryController", function ($scope, $http, $filter, $timeout, GlobalServices, $compile) {

	LoadData();
	$scope.onBtExportCSV = function () {
		var params = {
			fileName: 'AttendanceSummary.csv',
			sheetName: 'AttendanceSummary'
		};

		$scope.gridOptions1.api.exportDataAsCsv(params);
	}
	$scope.onFilterTextBoxChanged = function () {
		$scope.gridOptions.api.setQuickFilter($scope.search);
	}

	function LoadData() {
		$('.select2').select2();

		$scope.DateStyleColl = [
			{ id: 1, text: 'A.D.' },
			{ id: 2, text: 'B.S.' }, 
		];

		$scope.newMonthly = {
			DateStyle:1,
			CompanyRelationshipIds:null,
			BranchIds:null,
			DepartmentIds:null,
		};

		$scope.MonthList = GlobalServices.getMonthList();
		$scope.YearList = GlobalServices.getYearList();
		 
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
			ShowInOutDetails: true,
			startDate: ($scope.newMonthly.DateFromDet ? $scope.newMonthly.DateFromDet.dateAD : null),
			endDate: ($scope.newMonthly.DateFromDet ? $scope.newMonthly.DateToDet.dateAD : null),
			DateStyle: $scope.newMonthly.DateStyle,

			BranchIdColl: $scope.newMonthly.BranchIds?.length > 0 ? $scope.newMonthly.BranchIds.toString() : null,
			DepartmentIdColl: $scope.newMonthly.DepartmentIds?.length > 0 ? $scope.newMonthly.DepartmentIds.toString() : null,
			CompanyRelationshipIdColl: $scope.newMonthly.CompanyRelationshipIds?.length > 0 ? $scope.newMonthly.CompanyRelationshipIds.toString() : null,
		};

		if ($scope.newMonthly.DateStyle == 2) {
			para.startDate = null;
			para.endDate = null;
		} else {
			para.YearId = 0;
			para.MonthId = 0;
        }

		$scope.loadingstatus = "running";
		showPleaseWait();
		$http({
			method: 'POST',
			url: base_url + "HR/Report/GetMonthlyAppAttendance",
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
		var columnDefs = [
			{
				headerName: "Employee Info",
				children: [
					{ field: "Code", headerName: "Code", pinned: 'left', width: 140, dataType: 'text', filter: 'agTextColumnFilter', cellStyle: { 'textAlign': 'left' } },
					{ field: "Name", headerName: "Name", pinned: 'left', width: 200, dataType: 'text', filter: 'agTextColumnFilter', cellStyle: { 'textAlign': 'left' } },
					{ field: "MobileNo", headerName: "Mobile No", width: 140, dataType: 'Number', filter: 'agTextColumnFilter', cellStyle: { 'textAlign': 'left' } },
					{ field: "Designation", headerName: "Designation", dataType: 'text', width: 140, filter: 'agTextColumnFilter', cellStyle: { 'textAlign': 'left' } },
					{ field: "ParentName", headerName: "Parent Name", dataType: 'text', width: 140, filter: 'agTextColumnFilter', cellStyle: { 'textAlign': 'left' } },
					{ field: "IsActive", headerName: "IsActive", width: 140, filter: 'agSetColumnFilter', cellStyle: { 'textAlign': 'left' } },
				]
			}
		];

		const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
		var startDay = $scope.StartDay; // Store initial value

		for (var i = 1; i <= totalDays; i++) {
			var weekdayName = weekdays[startDay];
			var dayName = i;

			columnDefs.push({
				headerName: weekdayName,
				children: [{
					field: "Day" + i,
					headerName: dayName.toString(),
					width: 70,
					rowGroup: false,
					filter: 'agTextColumnFilter',
					sortable: true,
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
						return `<span class="day-cell" style="cursor:pointer;" 
                        ng-click="showDayDetails('Day${params.colDef.headerName}')">
                        ${params.value || ''}
                        </span>`;
					}
				}]
			});
			startDay++;
			if (startDay == 7)
				startDay = 0;
		}

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
			{ field: "TotalWorkingHour", headerName: "Total Working Hour", dataType: 'Text', width: 140, filter: 'agTextColumnFilter', cellStyle: { 'textAlign': 'left' } },
		);

		$scope.gridOptions1.api.setColumnDefs(columnDefs);
		$scope.gridOptions1.api.refreshHeader();
	};

	// ag-Grid options for attendance summary
	$scope.gridOptions1 = {
		defaultColDef: {
			filter: true, 
			sortable: true,
			resizable: true,
			menuTabs: ['filterMenuTab']
		},
		enableSorting: true,
		multiSortKey: 'ctrl',
		overlayLoadingTemplate: "Loading...",
		overlayNoRowsTemplate: "No Records found",
		rowSelection: 'multiple',
		columnDefs: [],
		rowData: null,
		enableFilter: true,
	};

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


});
