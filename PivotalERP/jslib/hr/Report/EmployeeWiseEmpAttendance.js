
app.controller("EmployeeWiseEmpAttendanceController", function ($scope, $http, $filter, $timeout, GlobalServices, $compile) {

	LoadData();
	$scope.onBtExportCSV = function () {
		var params = {
			fileName: 'EmployeeWiseEmpAttendance.csv',
			sheetName: 'EmployeeWiseEmpAttendance'
		};

		$scope.gridOptions3.api.exportDataAsCsv(params);
	}
	$scope.onFilterTextBoxChanged = function () {
		$scope.gridOptions3.api.setQuickFilter($scope.search);
	}

	function LoadData() {

		$scope.EmployeeSearchOptions = GlobalServices.getEmployeeSearchOptions();
		$scope.newEmp = {
			EmployeeId: 0,
			DateFrom_TMP: new Date(new Date().setDate(new Date().getDate() - 7)),
			DateTo_TMP: new Date(),
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

		$scope.columnDefs3 = [
			{
				field: "DateAD", headerName: "Date(A.D.)", width: 120, pinned: 'left', filter: 'agNumberColumnFilter', cellStyle: { 'textAlign': 'left' }, valueFormatter: function (params) {
					var date = new Date(params.value);
					return date.toLocaleDateString(); // Formats date as MM/DD/YYYY
				}
			},
			{ field: "DateBS", headerName: "Date(B.S.)", width: 120, pinned: 'left', filter: 'agNumberColumnFilter', cellStyle: { 'textAlign': 'left' } },
			{
				field: "Attendance", headerName: "Attendance", pinned: 'left', filter: 'agTextColumnFilter', width: 125, cellStyle: function (params) {
					const value = params.data || '';
					const colors = $scope.AttendanceColors || {};
					let cellStyle = {
						color: '#000000',
						backgroundColor: '#ffffff'
					};
					if (value.IsPresent == false && value.IsLeave == false && value.IsWeekEnd == false && value.IsHoliday == false) {
						var IsAbsent = true
					} else {
						IsAbsent = false
					}
					if (colors) {
						if (value.IsPresent == true) { // Present
							cellStyle.color = colors.PColor || '#000000';
							cellStyle.backgroundColor = colors.PCellColor;
						} else if (IsAbsent == true) { // Absent
							cellStyle.color = colors.AColor || '#000000';
							cellStyle.backgroundColor = colors.ACellColor;
						} else if (value.IsLeave == true) { // Leave
							cellStyle.color = colors.LColor || '#000000';
							cellStyle.backgroundColor = colors.LCellColor;
						} else if (value.IsWeekEnd == true) { // Weekend
							cellStyle.color = colors.WColor || '#000000';
							cellStyle.backgroundColor = colors.WCellColor;
						} else if (value.IsHoliday == true) { // Holiday
							cellStyle.color = colors.HColor || '#000000';
							cellStyle.backgroundColor = colors.HCellColor;
						}
					}
					return cellStyle;
				}
			},
			{
				field: "InTime",
				headerName: "In Time",
				width: 100,
				filter: 'agTextColumnFilter',
				cellStyle: { textAlign: 'left' },
				valueFormatter: function (params) {
					if (!params.value) return "";
					const date = new Date(params.value);
					if (isNaN(date)) return params.value;
					let timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
					return timeStr.toUpperCase();
				}
			},
			{ field: "InLocation", headerName: "In Location", width: 170, filter: 'agNumberColumnFilter', cellStyle: { 'textAlign': 'left' } },
			{
				field: "OutTime",
				headerName: "Out Time",
				width: 110,
				filter: 'agTextColumnFilter',
				cellStyle: { textAlign: 'left' },
				valueFormatter: function (params) {
					if (!params.value) return "";
					const date = new Date(params.value);
					if (isNaN(date)) return params.value;
					let timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
					return timeStr.toUpperCase();
				}
			},
			{ field: "OutLocation", headerName: "Out Location", width: 170, filter: 'agNumberColumnFilter', cellStyle: { 'textAlign': 'left' } },
			{ field: "LateInMinutes", headerName: "Late In Min", width: 120, filter: 'agNumberColumnFilter', cellStyle: { 'textAlign': 'left' } },
			{ field: "EarlyOutMinutes", headerName: "Early Out Min", width: 120, filter: 'agNumberColumnFilter', cellStyle: { 'textAlign': 'left' } },
			{ field: "WorkingHour", headerName: "Working Hour", width: 140, filter: 'agNumberColumnFilter', cellStyle: { 'textAlign': 'left' } },
			{ field: "EarlyInMinutes", headerName: "Early In Min", width: 120, filter: 'agNumberColumnFilter', cellStyle: { 'textAlign': 'left' } },
			{ field: "DelayOutMinutes", headerName: "Delay Out Min", width: 120, filter: 'agNumberColumnFilter', cellStyle: { 'textAlign': 'left' } },
			{ field: "OTHour", headerName: "OT Hour", width: 120, filter: 'agNumberColumnFilter', cellStyle: { 'textAlign': 'left' } },
			{ field: "LeaveOT", headerName: "Leave OT", width: 120, filter: 'agNumberColumnFilter', cellStyle: { textAlign: "left" } },
			{ field: "WorkingDuration", headerName: "Working Duration", width: 120, filter: 'agNumberColumnFilter', cellStyle: { 'textAlign': 'left' } },
			{ field: "WorkingShift", headerName: "Shift", width: 120, filter: 'agNumberColumnFilter', cellStyle: { 'textAlign': 'left' } },
			{ field: "EnrollNumber", headerName: "Enroll No", filter: 'agTextColumnFilter', width: 130, cellStyle: { 'textAlign': 'left' } },
			{ field: "Branch", headerName: "Branch", filter: 'agTextColumnFilter', width: 130, cellStyle: { 'textAlign': 'left' } },
			{ field: "Department", headerName: "Department", filter: 'agTextColumnFilter', width: 130, cellStyle: { 'textAlign': 'left' } },
			{ field: "Designation", headerName: "Designation", filter: 'agTextColumnFilter', width: 130, cellStyle: { 'textAlign': 'left' } },
			{ field: "GroupName", headerName: "Emp Group", filter: 'agTextColumnFilter', width: 130, cellStyle: { 'textAlign': 'left' } },
			{ field: "LevelName", headerName: "Level", filter: 'agTextColumnFilter', width: 130, cellStyle: { 'textAlign': 'left' } },
			{ field: "ServiceType", headerName: "Service Type", filter: 'agTextColumnFilter', width: 130, cellStyle: { 'textAlign': 'left' } },
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
	}



	$scope.ClearData = function () {

		var DataColl = [];
		$scope.gridOptionsBottom.api.setRowData(DataColl);

		$scope.gridOptions.api.setRowData(DataColl);
	};


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
			employeeId: $scope.newEmp.EmployeeDetails.EmployeeId,
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
				var totalOTMins = 0, totalWorkMins = 0;

				dataColl.forEach(x => {
					if (x.OTHour) {
						var [h, m] = x.OTHour.split(':').map(Number);
						totalOTMins += (h * 60) + m;
					}
					if (x.WorkingHour) {
						var [h, m] = x.WorkingHour.split(':').map(Number);
						totalWorkMins += (h * 60) + m;
					}
				});
				$scope.newEmp.TotalOTHours = $scope.formatTime(totalOTMins);

				$scope.newEmp.TotalWP = query.count(p1 => p1.WeekendPresent);
				$scope.newEmp.TotalHP = query.count(p1 => p1.HolidayPresent);
				$scope.newEmp.TotalLP = query.count(p1 => p1.LeavePresent);
				$scope.newEmp.TotalLeave = query.count(p1 => p1.IsLeave == true);
				$scope.newEmp.TotalWorkingHrs = $scope.formatTime(totalWorkMins);
				$scope.newEmp.TotalLateIn = query.count(p1 => p1.LateInMinutes);
				$scope.newEmp.TotalEarlyOut = query.count(p1 => p1.EarlyOutMinutes);


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


	$scope.formatTime = function(totalMins) {
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
				down_file(base_url + "//" + res.data.Data.ResponseId, "EmployeeWiseEmpAttendance.xlsx");
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
