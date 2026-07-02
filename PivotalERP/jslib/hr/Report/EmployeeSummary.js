
app.controller("EmployeeSummaryController", function ($scope, $http, $filter, $timeout, GlobalServices, $compile) {

	LoadData();
	$scope.onBtExportCSV = function () {
		var params = {
			fileName: 'EmployeeSummary.csv',
			sheetName: 'EmployeeSummary'
		};

		$scope.gridOptions.api.exportDataAsCsv(params);
	}
	$scope.onFilterTextBoxChanged = function () {
		$scope.gridOptions.api.setQuickFilter($scope.search);
	}

	 

	function LoadData() {


		$scope.newEmpSummary = {
			BranchId: null,
			DepartmentId: null,
			DesignationId: null,
			DesignationId: null,
			EmployeeGroupId: null,
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

		//for Level
		$scope.LevelList = [];
		$http({
			method: 'Get',
			url: base_url + "HR/Master/GetAllLevel",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.LevelList = res.data.Data;
			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
		
		//for DesignationList
		$scope.DesignationList = [];
		$http({
			method: 'Get',
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


		$scope.columnDefs = [
			{ field: "EmployeeCode", headerName: "Emp.Code", width: 110, pinned: 'left', filter: 'agTextColumnFilter', cellStyle: { 'textAlign': 'left' } },
			{ field: "EnrollNo", headerName: "Enroll No", width: 120, pinned: 'left', filter: 'agNumberColumnFilter', cellStyle: { 'textAlign': 'left' } },
			{ field: "EmployeeName", headerName: "Employee Name", width: 200, pinned: 'left', filter: 'agTextColumnFilter', cellStyle: { 'textAlign': 'left' } },
			{ field: "Gender", headerName: "Gender", width: 100, filter: 'agTextColumnFilter', cellStyle: { 'textAlign': 'left' } },
			{ field: "DOB_BS", headerName: "Date of Birth", width: 140, filter: 'agTextColumnFilter', cellStyle: { 'textAlign': 'left' } },
			{ field: "Nationality", headerName: "Nationality", width: 140, filter: 'agTextColumnFilter', cellStyle: { 'textAlign': 'left' } },
			{ field: "MaritalStatus", headerName: "Marital Status", filter: 'agTextColumnFilter', width: 130, cellStyle: { 'textAlign': 'left' } },
			{ field: "Branch", headerName: "Branch", width: 140, filter: 'agTextColumnFilter', cellStyle: { 'textAlign': 'left' } },
			{ field: "Department", headerName: "Department", filter: 'agTextColumnFilter', width: 130, cellStyle: { 'textAlign': 'left' } },
			{ field: "Designation", headerName: "Designation", filter: 'agTextColumnFilter', width: 130, cellStyle: { 'textAlign': 'left' } },
			{ field: "Level", headerName: "Level", filter: 'agTextColumnFilter', width: 130, cellStyle: { 'textAlign': 'left' } },
			{ field: "ServiceType", headerName: "Service Type", filter: 'agTextColumnFilter', width: 130, cellStyle: { 'textAlign': 'left' } },
			{ field: "EmployeeGroup", headerName: "Emp Group", filter: 'agTextColumnFilter', width: 130, cellStyle: { 'textAlign': 'left' } },
			{ field: "EmailId", headerName: "Email", filter: 'agTextColumnFilter', width: 130, cellStyle: { 'textAlign': 'left' } },
			{ field: "ContactNo", headerName: "Contact No", width: 140, filter: 'agTextColumnFilter', cellStyle: { 'textAlign': 'left' } },
			{ field: "PersnalContactNo", headerName: "Personal Contact No", width: 140, filter: 'agTextColumnFilter', cellStyle: { 'textAlign': 'left' } },
			{ field: "EmergencyContactNo", headerName: "Emergency Contact No", width: 140, filter: 'agTextColumnFilter', cellStyle: { 'textAlign': 'left' } },
			{ field: "PermanentAddress", headerName: "Permanent Address", width: 140, filter: 'agTextColumnFilter', cellStyle: { 'textAlign': 'left' } },
			{ field: "TemporaryAddress", headerName: "Temporary Address", width: 140, filter: 'agTextColumnFilter', cellStyle: { 'textAlign': 'left' } },
			{ field: "DateofJoiningMiti", headerName: "Joining Date", width: 140, filter: 'agTextColumnFilter', cellStyle: { 'textAlign': 'left' } },
			{ field: "PermanentDateMiti", headerName: "Permanent Date", width: 160, filter: 'agTextColumnFilter', cellStyle: { 'textAlign': 'left' } },
			{ field: "DateofRetirementMiti", headerName: "Retirement Date", width: 160, filter: 'agTextColumnFilter', cellStyle: { 'textAlign': 'left' } },
			{ field: "ServicePeriod", headerName: "Service Period", width: 140, filter: 'agTextColumnFilter', cellStyle: { 'textAlign': 'left' } },

			{ field: "PanId", headerName: "Pan No", width: 140, filter: 'agTextColumnFilter', cellStyle: { 'textAlign': 'left' } },
			{ field: "PFAccountNo", headerName: "PF Account No", width: 140, filter: 'agTextColumnFilter', cellStyle: { 'textAlign': 'left' } },
			{ field: "AccessionNo", headerName: "Accession No", width: 140, filter: 'agTextColumnFilter', cellStyle: { 'textAlign': 'left' } },
			{ field: "SSFNo", headerName: "SSF No", width: 140, filter: 'agTextColumnFilter', cellStyle: { 'textAlign': 'left' } },
			{ field: "CitCode", headerName: "CIT Code", width: 140, filter: 'agTextColumnFilter', cellStyle: { 'textAlign': 'left' } },
			{ field: "CITAcNo", headerName: "CIT Account No", width: 140, filter: 'agTextColumnFilter', cellStyle: { 'textAlign': 'left' } },
			{ field: "GratIdNum", headerName: "Gratuity Code", width: 140, filter: 'agTextColumnFilter', cellStyle: { 'textAlign': 'left' } },
			{ field: "GratAccNum", headerName: "Gratuity Account No", width: 140, filter: 'agTextColumnFilter', cellStyle: { 'textAlign': 'left' } },
			{ field: "Company", headerName: "Company", width: 140, filter: 'agTextColumnFilter', cellStyle: { 'textAlign': 'left' } },

		];


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
			overlayLoadingTemplate: "Please Click the Load Button to display the data.",
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

	}



	$scope.ClearData = function () {

		var DataColl = [];
		$scope.gridOptionsBottom.api.setRowData(DataColl);

		$scope.gridOptions.api.setRowData(DataColl);
	};




	$scope.GetEmployeeSummary = function () {
		$scope.DataColl = [];
		//var para = {
		//	BranchId: ($scope.newEmpSummary.BranchId && $scope.newEmpSummary.BranchId.length > 0 ? $scope.newEmpSummary.BranchId.toString() : null),
		//	DepartmentId: ($scope.newEmpSummary.DepartmentId && $scope.newEmpSummary.DepartmentId.length > 0 ? $scope.newEmpSummary.DepartmentId.toString() : null),
		//	DesignationId: ($scope.newEmpSummary.DesignationId && $scope.newEmpSummary.DesignationId.length > 0 ? $scope.newEmpSummary.DesignationId.toString() : null),
		//	LevelId: ($scope.newEmpSummary.LevelId && $scope.newEmpSummary.LevelId.length > 0 ? $scope.newEmpSummary.LevelId.toString() : null),
		//	EmployeeGroupId: ($scope.newEmpSummary.EmployeeGroupId && $scope.newEmpSummary.EmployeeGroupId.length > 0 ? $scope.newEmpSummary.EmployeeGroupId.toString() : null),
		//};
		var para = {
			BranchId: $scope.newEmpSummary.BranchId?.length > 0 ? $scope.newEmpSummary.BranchId.toString() : null,
			DepartmentId: $scope.newEmpSummary.DepartmentId?.length > 0 ? $scope.newEmpSummary.DepartmentId.toString() : null,
			DesignationId: $scope.newEmpSummary.DesignationId?.length > 0 ? $scope.newEmpSummary.DesignationId.toString() : null,
			LevelId: $scope.newEmpSummary.LevelId?.length > 0 ? $scope.newEmpSummary.LevelId.toString() : null,
			EmployeeGroupId: $scope.newEmpSummary.EmployeeGroupId?.length > 0 ? $scope.newEmpSummary.EmployeeGroupId.toString() : null,
			CompanyId: $scope.newEmpSummary.CompanyId?.length > 0 ? $scope.newEmpSummary.CompanyId.toString() : null,
		};
		$scope.loadingstatus = "running";
		showPleaseWait();
		$http({
			method: 'POST',
			url: base_url + "HR/Report/GetEmployeeSummary",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess) {
				$scope.DataColl = res.data.Data;
				$scope.gridOptions.api.setRowData($scope.DataColl);

				//if ($scope.DataColl && $scope.DataColl.length > 0) {

				//	$timeout(function () {
				//		var totalDays = $scope.DataColl[0].TotalDays;
				//		$scope.StartDay = new Date($scope.DataColl[0].DateFrom).getDay();
				//		$scope.generateMonthlyColumns(totalDays);
				//		$scope.gridOptions1.api.setRowData($scope.DataColl);
				//	});
				//}

			} else {
				Swal.fire(res.data.ResponseMSG)
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
				down_file(base_url + "//" + res.data.Data.ResponseId, "EmployeeSummary.xlsx");
			}

		}, function (errormessage) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			Swal.fire(errormessage);
		});
	}


	$scope.GetDataForPrint = function () {
		var filterData = [];
		$scope.gridOptions.api.forEachNodeAfterFilterAndSort(function (node) {
			var dayBook = node.data;
			filterData.push(dayBook);
		});
		return filterData;
	}

	$scope.onFilterTextBoxChanged = function () {
		$scope.gridOptions.api.setQuickFilter($scope.search);
	}


});
