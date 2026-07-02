
app.controller("salesmanAppAttController", function ($scope, $http, $filter, $timeout, GlobalServices, $compile) {

	LoadData();
	$scope.onBtExportCSV = function () {
		var params = {
			fileName: 'SalesmanAttendance.csv',
			sheetName: 'SalesmanAttendance'
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
			DateFrom_TMP: new Date(),
			DateTo_TMP: new Date(),
			SelectEmployee: $scope.EmployeeSearchOptions[0].value,
		};

		$scope.AgentColl = [];
		$http({
			method: 'GET',
			url: base_url + "Account/Creation/GetAllSalesMan",
			dataType: "json",
		}).then(function (res) {
			if (res.data.IsSuccess && res.data.Data) {
				$scope.AgentColl = res.data.Data;
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

		$scope.columnDefs3 = [
						
			{
				field: "ForDate", headerName: "Date(A.D.)", width: 140, pinned: 'left', filter: 'agNumberColumnFilter', cellStyle: { 'textAlign': 'left' }, valueFormatter: function (params) {
					var date = new Date(params.value);
					return date.toLocaleDateString(); // Formats date as MM/DD/YYYY
				}
			},
			{ field: "ForMiti", headerName: "Date(B.S.)", width: 140, pinned: 'left', filter: 'agNumberColumnFilter', cellStyle: { 'textAlign': 'left' } },
			{ field: "WeekdayName", headerName: "Day", width: 140, pinned: 'left', filter: 'agNumberColumnFilter', cellStyle: { 'textAlign': 'left' } },
			{ field: "InTime", headerName: "In Time", width: 140, filter: 'agNumberColumnFilter', cellStyle: { 'textAlign': 'left' } },
			{ field: "InLocation", headerName: "In Location", width: 140, filter: 'agNumberColumnFilter', cellStyle: { 'textAlign': 'left' } },
			{ field: "InRemark", headerName: "In Remark", width: 140, filter: 'agNumberColumnFilter', cellStyle: { 'textAlign': 'left' } },
			{ field: "OutTime", headerName: "Out Time", width: 140, filter: 'agNumberColumnFilter', cellStyle: { 'textAlign': 'left' } },
			{ field: "OutLocation", headerName: "Out Location", width: 140, filter: 'agNumberColumnFilter', cellStyle: { 'textAlign': 'left' } },
			{ field: "OutRemark", headerName: "Out Remark", width: 140, filter: 'agNumberColumnFilter', cellStyle: { 'textAlign': 'left' } },
			{ field: "Attendance", headerName: "Attendance", width: 140, filter: 'agNumberColumnFilter', cellStyle: { 'textAlign': 'left' } },
			{ field: "WorkingHour", headerName: "Working Hour", width: 140, filter: 'agNumberColumnFilter', cellStyle: { 'textAlign': 'left' } },			
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

		if ($scope.newEmp.AgentId && $scope.newEmp.DateFromDet && $scope.newEmp.DateToDet) {

		} else
			return;

		$scope.newEmp.TotalDays = 0;
		$scope.newEmp.TotalPresent = 0;
		$scope.newEmp.TotalAbsent = 0;
		$scope.newEmp.TotalWeekEnd = 0;
		$scope.newEmp.TotalHoliday = 0;

		$scope.gridOptions3.data = [];

		var para = {
			AgentId: $scope.newEmp.AgentId,
			DateFrom: $filter('date')($scope.newEmp.DateFromDet.dateAD, 'yyyy-MM-dd'),
			DateTo: $filter('date')($scope.newEmp.DateToDet.dateAD, 'yyyy-MM-dd')
		};
		$scope.loadingstatus = "running";
		showPleaseWait();
		$http({
			method: 'POST',
			url: base_url + "HR/Report/GetAppAttendance",
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
