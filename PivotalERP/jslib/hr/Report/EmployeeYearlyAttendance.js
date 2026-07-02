
app.controller("EmployeeYearlyAttendanceController", function ($scope, $http, $filter, $timeout, GlobalServices, $compile) {

	LoadData();
	$scope.onBtExportCSV = function () {
		var params = {
			fileName: 'EmployeeYearlyAttendance.csv',
			sheetName: 'EmployeeYearlyAttendance'
		};

		$scope.gridOptions3.api.exportDataAsCsv(params);
	}
	$scope.onFilterTextBoxChanged = function () {
		$scope.gridOptions3.api.setQuickFilter($scope.search);
	}

	function LoadData() {
		$('.select2').select2();
		$scope.EmployeeSearchOptions = GlobalServices.getEmployeeSearchOptions();
		$scope.YearList = GlobalServices.getYearList();

		$scope.newFilter = {
			CostClassId:null,
			YearId:null,
			EmployeeId: 0,
			SelectEmployee: $scope.EmployeeSearchOptions[0].value,
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

		$scope.columnDefs3 = [
			{ field: "SNo", headerName: "S.No", pinned: 'left',  width: 60, valueGetter: params => params.node.rowIndex + 1, cellStyle: { textAlign: "left" } },
			{ field: "MonthName", headerName: "Month", pinned: 'left',  width: 100, cellStyle: { textAlign: "left" } },
			{ field: "TotalDays", headerName: "Total Days", filter: false, width: 90, cellStyle: { textAlign: "left" } },
			{ field: "TotalPresent", headerName: "Present", filter: false, width: 90, cellStyle: { textAlign: "left" } },
			{ field: "TotalAbsent", headerName: "Absent", filter: false, width: 90, cellStyle: { textAlign: "left" } },
			{ field: "TotalLeave", headerName: "Leave", width: 90, cellStyle: { textAlign: "left" } },
			{ field: "TotalWeekend", headerName: "Weekend", width: 90, cellStyle: { textAlign: "left" } },
			{ field: "TotalHoliday", headerName: "Holiday", width: 90, cellStyle: { textAlign: "left" } },
			{ field: "OTDuration", headerName: "OT Hour", width: 90, cellStyle: { textAlign: "left" } },
			{ field: "LeaveOT", headerName: "Leave OT", width: 90, cellStyle: { textAlign: "left" } },
			// Dynamically generate Day1 to Day31 (or Day32 if needed)
			...Array.from({ length: 31 }, (_, i) => ({
				field: `Day${i + 1}`,
				headerName: `${i + 1}`, 
				width: 55,
				cellStyle: function (params) {
					const value = params.value || '';
					const colors = $scope.AttendanceColors || {};
					let cellStyle = {
						color: '#000000',
						backgroundColor: '#ffffff'
					};

					// Assign colors dynamically based on the value
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
			})),
		
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
			overlayLoadingTemplate: "Please Click the load button to load the data..",
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


	}



	$scope.ClearData = function () {

		var DataColl = [];
		$scope.gridOptionsBottom.api.setRowData(DataColl);

		$scope.gridOptions.api.setRowData(DataColl);
	};


	$scope.getEmpYearAttendanceLog = function (beData) {

		if (beData.EmployeeDetails) {
			$scope.newFilter.EmployeeId = beData.EmployeeDetails.EmployeeId;
		} else
			return;

		$scope.SumTotalDays = 0;
		$scope.SumTotalPresent = 0;
		$scope.SumTotalAbsent = 0;
		$scope.SumTotalWeekEnd = 0;
		$scope.SumTotalLeave = 0;
		$scope.SumTotalHoliday = 0;
		$scope.TotalOTDuration = 0;

		$scope.gridOptions3.data = [];

        var para = {
            CostClassId: $scope.newFilter.CostClassId,
            EmployeeId: $scope.newFilter.EmployeeId,
			YearId: 0//$scope.newFilter.YearId
        };
        $scope.loadingstatus = "running";
        showPleaseWait();
		$http({
			method: 'POST',
			url: base_url + "HR/Report/getEmpYearAttendanceLog",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess) {

				var dataColl = res.data.Data;
				$scope.gridOptions3.data = dataColl;
				$scope.gridOptions3.api.setRowData(dataColl);
				$scope.newEmp = res.data.Data[0];

				$scope.SumTotalDays = dataColl.reduce((sum, item) => sum + (item.TotalDays || 0), 0);
				$scope.SumTotalPresent = dataColl.reduce((sum, item) => sum + (item.TotalPresent || 0), 0);
				$scope.SumTotalAbsent = dataColl.reduce((sum, item) => sum + (item.TotalAbsent || 0), 0);
				$scope.SumTotalLeave = dataColl.reduce((sum, item) => sum + (item.TotalLeave || 0), 0);
				$scope.SumTotalWeekEnd = dataColl.reduce((sum, item) => sum + (item.TotalWeekend || 0), 0);
				$scope.SumTotalHoliday = dataColl.reduce((sum, item) => sum + (item.TotalHoliday || 0), 0);
				$scope.TotalOTDuration = $scope.formatTime(dataColl.reduce((sum, item) => sum + (item.OTDuration || 0), 0));

			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	};

	$scope.formatTime = function (totalMins) {
		let days = Math.floor(totalMins / (24 * 60));
		let hours = Math.floor((totalMins % (24 * 60)) / 60);
		let minutes = totalMins % 60;
		let timeStr = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
		return days > 0 ? `${days}D ${timeStr}` : timeStr;
	}



	$scope.DownloadAsXls = function () {
		$scope.loadingstatus = 'running';
		showPleaseWait();
		var dataColl = $scope.GetDataForPrint();

		var paraData = {
			employeeId: $scope.newEmp.EmployeeId,
			fromDate: $filter('date')($scope.newEmp.DateFromDet.dateAD, 'yyyy-MM-dd'),
			toDate: $filter('date')($scope.newEmp.DateToDet.dateAD, 'yyyy-MM-dd')
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
				down_file(base_url + "//" + res.data.Data.ResponseId, "EmployeeYearlyAttendance.xlsx");
			}

		}, function (errormessage) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			Swal.fire(errormessage);
		});
	}


	$scope.GetDataForPrint = function () {
		var filterData = [];
		$scope.gridOptions3.api.forEachNodeAfterFilterAndSort(function (node) {
			var dayBook = node.data;
			filterData.push(dayBook);
		});
		return filterData;
	}

	$scope.onFilterTextBoxChanged = function () {
		$scope.gridOptions.api.setQuickFilter($scope.search);
	}


});
