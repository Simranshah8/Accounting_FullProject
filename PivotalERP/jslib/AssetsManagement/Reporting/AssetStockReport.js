"use strict";

agGrid.initialiseAgGridWithAngular1(angular);

app.controller('AssetStockReportController', function ($scope, $http, $timeout, $filter, $rootScope, GlobalServices) {
	$scope.onBtExportCSV = function () {
		var params = {
			fileName: 'AssetStockReport.csv',
			sheetName: 'AssetStockReport'
		};
		$scope.gridOptions.api.exportDataAsCsv(params);
	}
	$scope.onFilterTextBoxChanged = function () {
		$scope.gridOptions.api.setQuickFilter($scope.search);
	}
	$scope.LoadData = function () {
		$('.select2').select2();
		$('.Gplaceholder').select2({
			placeholder: "Select Group", allowClear: true
		});
		$('.Bplaceholder').select2({
			placeholder: "Select Branch", allowClear: true
		});

		$scope.newFilter = {
			DateFrom_TMP: new Date(),
			DateTo_TMP: new Date(),
			ShowDetails: false,
			AssetGroupId: null,
		}

		$scope.BranchList = [];
		$http({
			method: 'GET',
			url: base_url + "Setup/Security/GetAllBranchList",
			dataType: "json"
		}).then(function (res) {
			if (res.data.IsSuccess && res.data.Data) {
				$scope.BranchList = res.data.Data;
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});


		$scope.GroupList = [];
		$http({
			method: 'POST',
			url: base_url + "AssetsManagement/Creation/GetAllAssetGroup",
			dataType: "json"
		}).then(function (res) {
			$scope.loadingstatus = 'stop';
			hidePleaseWait();
			if (res.data.IsSuccess && res.data.Data) {
				$scope.GroupList = res.data.Data;
			} else
				Swal.fire(res.data.ResponseMSG);

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
		$scope.columnDefs = [
			{
				headerName: "SNo.",	minWidth: 70,	pinned: 'left',cellStyle: { textAlign: "center" },	sortable: false,	filter: false,
				valueGetter: function (params) {
					if (params.node.rowPinned) {
						return '';
					}
					return params.node.rowIndex + 1;
				}
			},
			{ headerName: "Asset Name", field: "Particular", pinned: 'left', filter: 'agTextColumnFilter', minWidth: 160, flex: 1.5, cellStyle: { textAlign: 'left' } },
			{ headerName: "Asset Code", field: "AssetCode", pinned: 'left', filter: 'agTextColumnFilter', minWidth: 150, flex: 1 },
			{ headerName: "Asset Alias", field: "AssetAlias", filter: 'agTextColumnFilter', minWidth: 160, flex: 1.5 },
			{ headerName: "Asset Group", field: "GroupName", filter: 'agTextColumnFilter', minWidth: 130, flex: 1 },
			{ headerName: "Asset Type", field: "TypeName", filter: 'agTextColumnFilter', minWidth: 140, flex: 1 },
			{ headerName: "Asset Model", field: "ModelName", filter: 'agTextColumnFilter', minWidth: 140, flex: 1 },
			{ headerName: "RAM (Memory)", field: "RAMName", filter: 'agTextColumnFilter', colId: "RAMName", minWidth: 140, flex: 1 },
			{ headerName: "ROM (SSD/HDD)", field: "ROMName", filter: 'agTextColumnFilter', colId: "ROMName", minWidth: 150, flex: 1 },
			{ headerName: "Serial Number", field: "SerialNum", filter: 'agNumberColumnFilter', minWidth: 150, flex: 1 },
			{ headerName: "Branch", field: "BranchName", filter: 'agNumberColumnFilter', minWidth: 150, flex: 1 },
			{ headerName: "Opening QTY", field: "OpeningQTY", filter: 'agNumberColumnFilter', minWidth: 120, flex: 1, cellStyle: { textAlign: 'center' } },
			{ headerName: "Opening Rate", field: "OpeningRate", filter: 'agNumberColumnFilter', minWidth: 120, flex: 1, cellStyle: { textAlign: 'right' }, valueFormatter: params => params.value != null ? Number(params.value).toFixed(2) : '' },
			{ headerName: "Opening Amt.", field: "OpeningAmt", filter: 'agNumberColumnFilter', minWidth: 120, flex: 1, cellStyle: { textAlign: 'right' }, valueFormatter: params => params.value != null ? Number(params.value).toFixed(2) : ''  },
			{ headerName: "In Qty", field: "InWardQty", filter: 'agNumberColumnFilter', minWidth: 150, flex: 1, cellStyle: { textAlign: 'center' } },
			{ headerName: "Out Qty", field: "OutWardQty", filter: 'agNumberColumnFilter', minWidth: 150, flex: 1, cellStyle: { textAlign: 'center' } },
			{ headerName: "Balance Qty", field: "BalanceQty", filter: 'agNumberColumnFilter', minWidth: 110, flex: 1.2, cellStyle: { textAlign: 'center' } },

			{ headerName: "Balance Rate", field: "BalanceRate", filter: 'agNumberColumnFilter', colId: "BalanceRate", minWidth: 120, flex: 1, cellStyle: { textAlign: 'right' }, valueFormatter: params => params.value != null ? Number(params.value).toFixed(2) : ''  },
			{ headerName: "Balance Amt", field: "BalanceAmt", filter: 'agNumberColumnFilter', colId: "BalanceAmt", minWidth: 120, flex: 1, cellStyle: { textAlign: 'right' }, valueFormatter: params => params.value != null ? Number(params.value).toFixed(2) : '' },

			{ headerName: "Inward Rate", field: "InwardRate", filter: 'agNumberColumnFilter', colId: "InwardRate", minWidth: 120, flex: 1, cellStyle: { textAlign: 'right' }, valueFormatter: params => params.value != null ? Number(params.value).toFixed(2) : ''  },
			{ headerName: "InWard Amt", field: "InWardAmt", filter: 'agNumberColumnFilter', colId: "InWardAmt", minWidth: 120, flex: 1, cellStyle: { textAlign: 'right' }, valueFormatter: params => params.value != null ? Number(params.value).toFixed(2) : ''  },
			{ headerName: "OutWard Rate", field: "OutWardRate", filter: 'agNumberColumnFilter', colId: "OutWardRate", minWidth: 120, flex: 1, cellStyle: { textAlign: 'right' }, valueFormatter: params => params.value != null ? Number(params.value).toFixed(2) : ''  },
			{ headerName: "OutWard Amt", field: "OutWardAmt", filter: 'agNumberColumnFilter', colId: "OutWardAmt", minWidth: 120, flex: 1, cellStyle: { textAlign: 'right' }, valueFormatter: params => params.value != null ? Number(params.value).toFixed(2) : '' },

		];

		//ag-Grid options
		$scope.gridOptions = {
			defaultColDef: {
				filter: true,
				resizable: true,
				sortable: true
			},
			onFilterChanged: function () {
				$scope.updateAssetStockTotal();
			},

			onSortChanged: function () {
				$scope.updateAssetStockTotal();
			},
			getRowStyle: function (params) {
				if (params.node.rowPinned) {
					return {
						fontWeight: 'bold',
						background: '#f2f2f2'
					};
				}
			},

			onGridReady: function (params) {
				$scope.gridApi = params.api;
				$scope.gridColumnApi = params.columnApi;

				// hide by default
				$scope.gridColumnApi.setColumnVisible('RAMName', false);
				$scope.gridColumnApi.setColumnVisible('ROMName', false);
				$scope.gridColumnApi.setColumnVisible('BalanceRate', false);
				$scope.gridColumnApi.setColumnVisible('BalanceAmt', false);
				$scope.gridColumnApi.setColumnVisible('InwardRate', false);
				$scope.gridColumnApi.setColumnVisible('InWardAmt', false);
				$scope.gridColumnApi.setColumnVisible('OutWardRate', false);
				$scope.gridColumnApi.setColumnVisible('OutWardAmt', false);
				// 🔥 Load data here
        	},
			enableSorting: true,
			multiSortKey: 'ctrl',
			enableColResize: true,
			overlayLoadingTemplate: "Please Click the Load Button to display the data",
			overlayNoRowsTemplate: "No Records found",
			rowSelection: 'multiple',
			columnDefs: $scope.columnDefs,
			rowData: null,
			filter: true,
			enableFilter: true
		};

		$timeout(function () {
			var eGridDiv = document.querySelector('#TableData');
			new agGrid.Grid(eGridDiv, $scope.gridOptions);
		});


		$timeout(function () {
			GlobalServices.getListState(EntityId, $scope.gridOptions);
		});

        $scope.$watch('newFilter.ShowDetails', function (val) {
			if (!$scope.gridColumnApi) return;
			$scope.gridColumnApi.setColumnVisible('RAMName', !!val);
			$scope.gridColumnApi.setColumnVisible('ROMName', !!val);
			$scope.gridColumnApi.setColumnVisible('BalanceRate', !!val);
			$scope.gridColumnApi.setColumnVisible('BalanceAmt', !!val);
			$scope.gridColumnApi.setColumnVisible('InwardRate', !!val);
			$scope.gridColumnApi.setColumnVisible('InWardAmt', !!val);
			$scope.gridColumnApi.setColumnVisible('OutWardRate', !!val);
			$scope.gridColumnApi.setColumnVisible('OutWardAmt', !!val);

			// optional: refresh to apply immediately
			if ($scope.gridApi) $scope.gridApi.refreshHeader();
		});

	};

	$scope.GetData = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		var para = {
			DateFrom: ($scope.newFilter.DateFromDet ? $filter('date')(new Date($scope.newFilter.DateFromDet.dateAD), 'yyyy-MM-dd') : null),
			DateTo: ($scope.newFilter.DateToDet ? $filter('date')(new Date($scope.newFilter.DateToDet.dateAD), 'yyyy-MM-dd') : null),
			AssetGroupId: $scope.newFilter.AssetGroupId || null,
			BranchId: $scope.newFilter.BranchId || null
		};
		$http({
			method: 'POST',
			url: base_url + "AssetsManagement/Reporting/GetAllAssetStockReport",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.DataColl = res.data.Data;
				$scope.gridOptions.api.setRowData($scope.DataColl);
				$scope.updateAssetStockTotal();
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
			DateFrom: $filter('date')($scope.newFilter.DateFromDet.dateAD, 'yyyy-MM-dd'),
			DateTo: $filter('date')($scope.newFilter.DateToDet.dateAD, 'yyyy-MM-dd'),
			AssetGroupId: $scope.newFilter.AssetGroupId
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
				down_file(base_url + "//" + res.data.Data.ResponseId, "AssetStockReport.xlsx");
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
			var AssetStockReport = node.data;
			filterData.push(AssetStockReport);
		});
		return filterData;
	}

	$scope.updateAssetStockTotal = function () {
		var dt = {
			Particular: "TOTAL =>",
			InWardQty: 0,
			OutWardQty: 0,
			BalanceQty: 0,
			OpeningQTY:0
		};
		if (!$scope.gridOptions.api) return;
		$scope.gridOptions.api.forEachNodeAfterFilterAndSort(function (node) {
			var d = node.data;
			dt.InWardQty += d.InWardQty || 0;
			dt.OutWardQty += d.OutWardQty || 0;
			//dt.BalanceQty += d.BalanceQty || 0;
			dt.OpeningQTY += d.OpeningQTY || 0;
		});
		dt.BalanceQty = dt.OpeningQTY + (dt.InWardQty - dt.OutWardQty);
		$scope.gridOptions.api.setPinnedBottomRowData([dt]);
	};

});






