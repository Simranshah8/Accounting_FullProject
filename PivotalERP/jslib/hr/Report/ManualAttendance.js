
app.controller("ManualAttendanceController", function ($scope, $http, $filter, $timeout, GlobalServices, $compile) {

	LoadData();
	$scope.onBtExportCSV = function () {
		var params = {
			fileName: 'ManualAttendance.csv',
			sheetName: 'ManualAttendance'
		};

		$scope.gridOptions4.api.exportDataAsCsv(params);
	}
	$scope.onFilterTextBoxChanged = function () {
		$scope.gridOptions4.api.setQuickFilter($scope.search);
	}

	function LoadData() {
		$('.select2').select2();

		$scope.newManual = {
			BranchId: null,
			ForDate_TMP: new Date(),
		};


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

		$scope.columnDefs4 = [
			{ field: "SNo", headerName: "S.No.", width: 90, pinned: 'left', filter: 'agNumberColumnFilter', cellStyle: { 'textAlign': 'left' } },
			{ field: "EmpCode", headerName: "Emp.Code", width: 140, pinned: 'left', filter: 'agTextColumnFilter', cellStyle: { 'textAlign': 'left' } },
			{ field: "Name", headerName: "Name", width: 200, pinned: 'left', filter: 'agTextColumnFilter', cellStyle: { 'textAlign': 'left' } },
			{ field: "EnrollNo", headerName: "Enroll No", width: 140, filter: 'agNumberColumnFilter', cellStyle: { 'textAlign': 'left' } },
			{ field: "Attendance", headerName: "Attendance", width: 140, filter: 'agTextColumnFilter', cellStyle: { 'textAlign': 'left' } },
			{ field: "InTime", headerName: "In Time", width: 120, filter: 'agTextColumnFilter', cellStyle: { 'textAlign': 'left' } },
			{ field: "OutTime", headerName: "Out Time", width: 120, filter: 'agTextColumnFilter', cellStyle: { 'textAlign': 'left' } },
			{ field: "BranchName", headerName: "Branch", filter: 'agTextColumnFilter', width: 130, cellStyle: { 'textAlign': 'left' } },
			{ field: "BranchAddress", headerName: "Branch Address", width: 140, filter: 'agTextColumnFilter', cellStyle: { 'textAlign': 'left' } },
			{ field: "Department", headerName: "Department", filter: 'agTextColumnFilter', width: 130, cellStyle: { 'textAlign': 'left' } },
			{ field: "Designation", headerName: "Designation", filter: 'agTextColumnFilter', width: 130, cellStyle: { 'textAlign': 'left' } },
			{ field: "Category", headerName: "Category", filter: 'agTextColumnFilter', width: 130, cellStyle: { 'textAlign': 'left' } },
			{ field: "GroupName", headerName: "Emp Group", filter: 'agTextColumnFilter', width: 130, cellStyle: { 'textAlign': 'left' } },
			{ field: "LevelName", headerName: "Level", filter: 'agTextColumnFilter', width: 130, cellStyle: { 'textAlign': 'left' } },
			{ field: "ServiceType", headerName: "Service Type", filter: 'agTextColumnFilter', width: 130, cellStyle: { 'textAlign': 'left' } },
			{ field: "Remarks", headerName: "Remarks", width: 140, filter: 'agTextColumnFilter', cellStyle: { 'textAlign': 'left' } },
			{ field: "Company", headerName: "Company", width: 140, filter: 'agTextColumnFilter', cellStyle: { 'textAlign': 'left' } },
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


	}



	$scope.ClearData = function () {

		var DataColl = [];
		$scope.gridOptionsBottom.api.setRowData($scope.DataColl);

		$scope.gridOptions4.api.setRowData($scope.DataColl);
	};


	$scope.GetManualDailyAttendance = function () {
		$scope.DataColl = [];
		var para = {
			forDate: $filter('date')($scope.newManual.ForDateDet.dateAD, 'yyyy-MM-dd'),
			branchIdColl: $scope.newManual.BranchId,
			companyId: $scope.newManual.CompanyRelationshipId
			//DepartmentIdColl: $scope.newDaily.DepartmentId,
			//GroupIdColl: $scope.newDaily.GroupId,
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


	$scope.DownloadAsXls = function () {
		$scope.loadingstatus = 'running';
		showPleaseWait();
		var dataColl = $scope.GetDataForPrint();
		
		var paraData = {
			forDate: $filter('date')($scope.newDaily.ForDateDet.dateAD, 'yyyy-MM-dd'),
			branchIdColl: $scope.newManual.BranchId
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
				down_file(base_url + "//" + res.data.Data.ResponseId, "ManualAttendance.xlsx");
			}

		}, function (errormessage) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			Swal.fire(errormessage);
		});
	}

	$scope.GetDataForPrint = function () {
		var filterData = [];
		$scope.gridOptions4.api.forEachNodeAfterFilterAndSort(function (node) {
			var dayBook = node.data;
			filterData.push(dayBook);
		});
		return filterData;
	}


	$scope.onFilterTextBoxChanged = function () {
		$scope.gridOptions.api.setQuickFilter($scope.search);
	}


});
