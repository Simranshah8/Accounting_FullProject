app.controller("EmpPromotionTransferController", function ($scope, $http, $filter, $timeout, GlobalServices, $compile) {

	LoadData();

	$scope.onBtExportCSV = function (isPT) {
		if (isPT == 1) {
			var params = {
				fileName: 'EmployeePromotion.csv',
				sheetName: 'EmployeePromotion'
			};
			$scope.gridOptions.api.exportDataAsCsv(params);
		}
		else{
			var params = {
				fileName: 'EmployeeTransfer.csv',
				sheetName: 'EmployeeTransfer'
			};
			$scope.gridOptions1.api.exportDataAsCsv(params);
		}
	}
	$scope.DownloadAsXls = function (isPT) {
		if (isPT == 1) {
			var params = {
				fileName: 'EmployeePromotion.xlsx',
				sheetName: 'EmployeePromotion'
			};
			$scope.gridOptions.api.exportDataAsExcel(params);
		}
		else{
			var params = {
				fileName: 'EmployeeTransfer.xlsx',
				sheetName: 'EmployeeTransfer'
			};
			$scope.gridOptions1.api.exportDataAsExcel(params);
		}
	}

	$scope.onFilterTextBoxChanged = function (isPT) {
		if (isPT == 1) {
			$scope.gridOptions.api.setQuickFilter($scope.searchP);
		}
		else if (isPT == 2) {
			$scope.gridOptions1.api.setQuickFilter($scope.searchT);
		}
	}

	function LoadData() {
		$('.select2').select2();

		$timeout(function () {
			$scope.columnDefs = [
				{ headerName: "Employee Code", field: "EmployeeCode", dataType: 'Text', filter: "agTextColumnFilter", width: 150, pinned: 'left', cellStyle: { 'text-align': 'left' } },
				{ headerName: "Name", field: "EmployeeName", dataType: 'Text', filter: "agTextColumnFilter", width: 200, pinned: 'left', cellStyle: { 'text-align': 'left' } },
				{ headerName: "EmailId", field: "EmailId", dataType: 'Text', filter: "agTextColumnFilter", width: 140, cellStyle: { 'text-align': 'left' } },
				{ headerName: "Office Contact", field: "ContactNo", dataType: 'Text', filter: "agTextColumnFilter", width: 140, cellStyle: { 'text-align': 'left' } },
				{
					headerName: "Promotion Date", field: "PromotionDate", dataType: 'Text', filter: "agDateColumnFilter", width: 140, cellStyle: { 'text-align': 'left' },
					valueFormatter: function (params) {
						if (!params.value) return '';
						var date = new Date(params.value);
						var day = ("0" + date.getDate()).slice(-2);
						var month = ("0" + (date.getMonth() + 1)).slice(-2);
						var year = date.getFullYear();
						return year + "-" + month + "-" + day;
					}
				},
				{ headerName: "Promotion Miti", field: "PromotionMitti", dataType: 'Text', filter: "agTextColumnFilter", width: 140, cellStyle: { 'text-align': 'left' } },
				{
					headerName: "Effective Date", field: "EffectiveDate", dataType: 'Text', filter: "agDateColumnFilter", width: 140, cellStyle: { 'text-align': 'left' },
					valueFormatter: function (params) {
						if (!params.value) return '';
						var date = new Date(params.value);
						var day = ("0" + date.getDate()).slice(-2);
						var month = ("0" + (date.getMonth() + 1)).slice(-2);
						var year = date.getFullYear();
						return year + "-" + month + "-" + day;
					}
				},
				{ headerName: "Effective Miti", field: "EffectiveMitti", dataType: 'Text', filter: "agTextColumnFilter", width: 140, cellStyle: { 'text-align': 'left' } },
				{ headerName: "From Branch", field: "FromBranch", dataType: 'Text', filter: "agTextColumnFilter", width: 140, cellStyle: { 'text-align': 'left' } },
				{ headerName: "From Department", field: "FromDepartment", dataType: 'Text', filter: "agTextColumnFilter", width: 140, cellStyle: { 'text-align': 'left' } },
				{ headerName: "From Category", field: "FromCategory", dataType: 'Text', filter: "agTextColumnFilter", width: 140, cellStyle: { 'text-align': 'left' } },
				{ headerName: "From Grade", field: "FromGrade", dataType: 'Text', filter: "agTextColumnFilter", width: 140, cellStyle: { 'text-align': 'left' } },
				{ headerName: "From Service Type", field: "FromServiceType", dataType: 'Text', filter: "agTextColumnFilter", width: 140, cellStyle: { 'text-align': 'left' } },
				{ headerName: "From Designation", field: "FromDesignation", dataType: 'Text', filter: "agTextColumnFilter", width: 160, cellStyle: { 'text-align': 'left' } },
				{ headerName: "From JobTitle", field: "FromJobTitle", dataType: 'Text', filter: "agTextColumnFilter", width: 160, cellStyle: { 'text-align': 'left' } },
				{ headerName: "Recommended By", field: "RecommendedBy", dataType: 'Text', filter: "agTextColumnFilter", width: 160, cellStyle: { 'text-align': 'left' } },
				{ headerName: "Recommended Remarks", field: "RecommendedRemarks", dataType: 'Text', filter: "agTextColumnFilter", width: 160, cellStyle: { 'text-align': 'left' } },
				{ headerName: "Verify By", field: "VerifiedBy", dataType: 'Text', filter: "agTextColumnFilter", width: 180, cellStyle: { 'text-align': 'left' } },
				{ headerName: "Verified Remarks", field: "VerifiedRemarks", dataType: 'Text', filter: "agTextColumnFilter", width: 160, cellStyle: { 'text-align': 'left' } },
				{ headerName: "Remarks", field: "Remarks", dataType: 'Text', filter: "agTextColumnFilter", width: 160, cellStyle: { 'text-align': 'left' } },
				{ headerName: "Create By", field: "CreateBy", dataType: 'Text', filter: "agTextColumnFilter", width: 165, cellStyle: { 'text-align': 'left' } },
				{ headerName: "LogDateTime", field: "LogMitti", dataType: 'Text', filter: "agTextColumnFilter", width: 165, cellStyle: { 'text-align': 'left' } },
				{ headerName: "To Branch", field: "ToBranch", dataType: 'Text', filter: "agTextColumnFilter", width: 140, cellStyle: { 'text-align': 'left' } },
				{ headerName: "To Department", field: "ToDepartment", dataType: 'Text', filter: "agTextColumnFilter", width: 140, cellStyle: { 'text-align': 'left' } },
				{ headerName: "To Category", field: "ToCategory", dataType: 'Text', filter: "agTextColumnFilter", width: 140, cellStyle: { 'text-align': 'left' } },
				{ headerName: "To Grade", field: "ToGrade", dataType: 'Text', filter: "agTextColumnFilter", width: 140, cellStyle: { 'text-align': 'left' } },
				{ headerName: "To Service Type", field: "ToServiceType", dataType: 'Text', filter: "agTextColumnFilter", width: 140, cellStyle: { 'text-align': 'left' } },
				{ headerName: "To Designation", field: "ToDesignation", dataType: 'Text', filter: "agTextColumnFilter", width: 160, cellStyle: { 'text-align': 'left' } },
			];

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
			$timeout(function () {
				var eGridDiv = document.querySelector('#EmployeePromotion');
				new agGrid.Grid(eGridDiv, $scope.gridOptions);
			});
		}, 200);

		$timeout(function () {
			$scope.columnDefs1 = [
				{ headerName: "Employee Code", field: "EmployeeCode", dataType: 'Text', filter: "agTextColumnFilter", width: 150, pinned: 'left', cellStyle: { 'text-align': 'left' } },
				{ headerName: "Name", field: "EmployeeName", dataType: 'Text', filter: "agTextColumnFilter", width: 200, pinned: 'left', cellStyle: { 'text-align': 'left' } },
				{ headerName: "EmailId", field: "EmailId", dataType: 'Text', filter: "agTextColumnFilter", width: 140, cellStyle: { 'text-align': 'left' } },
				{ headerName: "Office Contact", field: "ContactNo", dataType: 'Text', filter: "agTextColumnFilter", width: 140, cellStyle: { 'text-align': 'left' } },
				{
					headerName: "Transfer Date", field: "PromotionDate", dataType: 'Text', filter: "agDateColumnFilter", width: 140, cellStyle: { 'text-align': 'left' },
					valueFormatter: function (params) {
						if (!params.value) return '';
						var date = new Date(params.value);
						var day = ("0" + date.getDate()).slice(-2);
						var month = ("0" + (date.getMonth() + 1)).slice(-2);
						var year = date.getFullYear();
						return year + "-" + month + "-" + day;
					}
				},
				{ headerName: "Transfer Miti", field: "PromotionMitti", dataType: 'Text', filter: "agTextColumnFilter", width: 140, cellStyle: { 'text-align': 'left' } },
				{
					headerName: "Effective Date", field: "EffectiveDate", dataType: 'Text', filter: "agDateColumnFilter", width: 140, cellStyle: { 'text-align': 'left' },
					valueFormatter: function (params) {
						if (!params.value) return '';
						var date = new Date(params.value);
						var day = ("0" + date.getDate()).slice(-2);
						var month = ("0" + (date.getMonth() + 1)).slice(-2);
						var year = date.getFullYear();
						return year + "-" + month + "-" + day;
					}
				},
				{ headerName: "Effective Miti", field: "EffectiveMitti", dataType: 'Text', filter: "agTextColumnFilter", width: 140, cellStyle: { 'text-align': 'left' } },
				{ headerName: "From Company", field: "FromGrade", dataType: 'Text', filter: "agTextColumnFilter", width: 200, cellStyle: { 'text-align': 'left' } },
				{ headerName: "From Branch", field: "FromBranch", dataType: 'Text', filter: "agTextColumnFilter", width: 140, cellStyle: { 'text-align': 'left' } },
				{ headerName: "From Department", field: "FromDepartment", dataType: 'Text', filter: "agTextColumnFilter", width: 140, cellStyle: { 'text-align': 'left' } },
				{ headerName: "From Category", field: "FromCategory", dataType: 'Text', filter: "agTextColumnFilter", width: 140, cellStyle: { 'text-align': 'left' } },
				{ headerName: "From Designation", field: "FromDesignation", dataType: 'Text', filter: "agTextColumnFilter", width: 160, cellStyle: { 'text-align': 'left' } },
				{ headerName: "From JobTitle", field: "FromJobTitle", dataType: 'Text', filter: "agTextColumnFilter", width: 160, cellStyle: { 'text-align': 'left' } },
				{ headerName: "Recommended By", field: "RecommendedBy", dataType: 'Text', filter: "agTextColumnFilter", width: 160, cellStyle: { 'text-align': 'left' } },
				{ headerName: "Recommended Remarks", field: "RecommendedRemarks", dataType: 'Text', filter: "agTextColumnFilter", width: 160, cellStyle: { 'text-align': 'left' } },
				{ headerName: "Verify By", field: "VerifiedBy", dataType: 'Text', filter: "agTextColumnFilter", width: 180, cellStyle: { 'text-align': 'left' } },
				{ headerName: "Verified Remarks", field: "VerifiedRemarks", dataType: 'Text', filter: "agTextColumnFilter", width: 160, cellStyle: { 'text-align': 'left' } },
				{ headerName: "Remarks", field: "Remarks", dataType: 'Text', filter: "agTextColumnFilter", width: 160, cellStyle: { 'text-align': 'left' } },
				{ headerName: "Create By", field: "CreateBy", dataType: 'Text', filter: "agTextColumnFilter", width: 165, cellStyle: { 'text-align': 'left' } },
				{ headerName: "LogDateTime", field: "LogMitti", dataType: 'Text', filter: "agTextColumnFilter", width: 165, cellStyle: { 'text-align': 'left' } },
				{ headerName: "To Company", field: "ToGrade", dataType: 'Text', filter: "agTextColumnFilter", width: 200, cellStyle: { 'text-align': 'left' } },
				{ headerName: "To Branch", field: "ToBranch", dataType: 'Text', filter: "agTextColumnFilter", width: 140, cellStyle: { 'text-align': 'left' } },
				{ headerName: "To Department", field: "ToDepartment", dataType: 'Text', filter: "agTextColumnFilter", width: 140, cellStyle: { 'text-align': 'left' } },
				{ headerName: "To Category", field: "ToCategory", dataType: 'Text', filter: "agTextColumnFilter", width: 140, cellStyle: { 'text-align': 'left' } },
				{ headerName: "To Designation", field: "ToDesignation", dataType: 'Text', filter: "agTextColumnFilter", width: 160, cellStyle: { 'text-align': 'left' } },
			];

			$scope.gridOptions1 = {
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
				columnDefs: $scope.columnDefs1,
				rowData: null,
				filter: true,
				enableFilter: true,
			};
			$timeout(function () {
				var eGridDiv = document.querySelector('#EmployeeTransfer');
				new agGrid.Grid(eGridDiv, $scope.gridOptions1);
			});
		}, 200);

	}

	$scope.GetEmployeePromotion = function () {
		$scope.DataColl = [];
		var para = {
			IsEmpPT: 1
		};
		$scope.loadingstatus = "running";
		showPleaseWait();
		$http({
			method: 'POST',
			url: base_url + "HR/Report/GetEmpPromotionTransfer",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.DataColl = res.data.Data;
				$scope.gridOptions.api.setRowData($scope.DataColl);
			} else {
				alert(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	}

	$scope.GetEmployeeTransfer = function () {
		$scope.DataColl = [];
		var para = {
			IsEmpPT: 2
		};
		$scope.loadingstatus = "running";
		showPleaseWait();
		$http({
			method: 'POST',
			url: base_url + "HR/Report/GetEmpPromotionTransfer",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.DataColl = res.data.Data;
				$scope.gridOptions1.api.setRowData($scope.DataColl);
			} else {
				alert(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	}

});