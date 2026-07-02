"use strict";
agGrid.initialiseAgGridWithAngular1(angular);
app.controller('AssetsOpeningListController', function ($scope, $http, $timeout, $filter, $rootScope, GlobalServices) {
	$scope.onBtExportCSV = function () {
		var params = {
			fileName: 'AssetsOpeningList.csv',
			sheetName: 'AssetsOpeningList'
		};
		$scope.gridOptions.api.exportDataAsCsv(params);
	}
	$scope.onFilterTextBoxChanged = function () {
		$scope.gridOptions.api.setQuickFilter($scope.search);
	}

	$scope.LoadData = function () {
		$('.select2').select2();
		$scope.newFilter = {
			DateFrom_TMP: new Date(),
			DateTo_TMP: new Date(),
		}

		$scope.columnDefs = [
			{ headerName: "SNo.", valueGetter: "node.rowIndex + 1", width: 70, minWidth: 60, cellStyle: { textAlign: "center" }, sortable: false, filter: false },
			{ headerName: "Date", field: "OpeningMiti", filter: 'agDateColumnFilter', minWidth: 150, flex: 1, cellStyle: { textAlign: 'left' } },
			{ headerName: "Branch", field: "BranchName", filter: 'agTextColumnFilter', minWidth: 160, flex: 1.5, cellStyle: { textAlign: 'left' } },
			{ headerName: "Particulars ", field: "ParticularName", filter: 'agTextColumnFilter', minWidth: 150, flex: 1 },
			{ headerName: "Code", field: "Code", filter: 'agTextColumnFilter', minWidth: 160, flex: 1.5 },
			{ headerName: "Alias", field: "Alias", filter: 'agTextColumnFilter', minWidth: 130, flex: 1 },
			{ headerName: "Serial Number ", field: "SerialNum", filter: 'agTextColumnFilter', minWidth: 130, flex: 1 },
			{ headerName: "Asset Group  ", field: "GroupName", filter: 'agTextColumnFilter', minWidth: 130, flex: 1 },
			{ headerName: "Asset Type  ", field: "TypeName", filter: 'agTextColumnFilter', minWidth: 130, flex: 1 },
			{ headerName: "Asset Model  ", field: "ModelName", filter: 'agTextColumnFilter', minWidth: 130, flex: 1 },
			{
				headerName: "Qty",
				field: "Qty",
				filter: 'agNumberColumnFilter',
				minWidth: 130,
				flex: 1,
				valueFormatter: function (params) {
					return (params.value === null || params.value === undefined) ? '-' : params.value;
				}
			},
			{ headerName: "Rate", field: "Rate", filter: 'agNumberColumnFilter', minWidth: 150, flex: 1 },
			{ headerName: "Amount", field: "Amt", filter: 'agNumberColumnFilter', minWidth: 160, flex: 1.2 },
			{ headerName: "FYears", field: "FiscalYear", filter: 'agTextColumnFilter', minWidth: 160, flex: 1.2 },
			{ headerName: "CreatedBy", field: "CreatedBy", filter: 'agTextColumnFilter', minWidth: 160, flex: 1.2 },
		];

		//ag-Grid options
		$scope.gridOptions = {
			defaultColDef: {
				filter: true,
				resizable: true,
				sortable: true
			},
			onGridReady: function (params) {
				$scope.gridApi = params.api;
				$scope.gridColumnApi = params.columnApi;
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
			var eGridDiv = document.querySelector('#TableData');
			new agGrid.Grid(eGridDiv, $scope.gridOptions);
		});


		//$timeout(function () {
		//	GlobalServices.getListState(EntityId, $scope.gridOptions);
		//});

		$scope.$watch('newFilter.ShowDetails', function (val) {
			if (!$scope.gridColumnApi) return;
			if ($scope.gridApi) $scope.gridApi.refreshHeader();
		});

	};


	$scope.GetData = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		var para = {
			DateFrom: ($scope.newFilter.DateFromDet ? $filter('date')(new Date($scope.newFilter.DateFromDet.dateAD), 'yyyy-MM-dd') : null),
			DateTo: ($scope.newFilter.DateToDet ? $filter('date')(new Date($scope.newFilter.DateToDet.dateAD), 'yyyy-MM-dd') : null),
		};
		$http({
			method: 'POST',
			url: base_url + "AssetsManagement/Reporting/GetAssetsOpeningList",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.DataColl = res.data.Data;
				$scope.gridOptions.api.setRowData($scope.DataColl);
			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			Swal.fire('Failed: ' + reason);
		});
	}


	$scope.DownloadAsXls = function () {
		$scope.loadingstatus = 'running';
		showPleaseWait();
		var dataColl = $scope.GetDataForPrint();
		var paraData = {
			//forDate: $filter('date')($scope.newDaily.ForDateDet.dateAD, 'yyyy-MM-dd'),
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
				down_file(base_url + "//" + res.data.Data.ResponseId, "AssetsOpeningList.xlsx");
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

});






