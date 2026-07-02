"use strict";
agGrid.initialiseAgGridWithAngular1(angular);
app.controller('AssetWiseReportController', function ($scope, $http, $timeout, $filter, $rootScope, GlobalServices) {
	$scope.onBtExportCSV = function () {
		var params = {
			fileName: 'AssetWiseReport.csv',
			sheetName: 'AssetWiseReport'
		};
		$scope.gridOptions.api.exportDataAsCsv(params);
	}
	$scope.onFilterTextBoxChanged = function () {
		$scope.gridOptions.api.setQuickFilter($scope.search);
	}


	$scope.LoadData = function () {
		$('.select2').select2();
		$('.Aplaceholder').select2({
			placeholder: "Select Assets", allowClear: true
		});

		$('.Bplaceholder').select2({
			placeholder: "Select Branch", allowClear: true
		});

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

		$scope.ParticularList = [];
		$http({
			method: 'POST',
			url: base_url + "AssetsManagement/Creation/GetAllAssetsmaster",
			dataType: "json",
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				//$scope.ParticularList = res.data.Data;
				$scope.ParticularList = res.data.Data.filter(function (item) {
					return item.StatusId === 1;
				});

			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			Swal.fire('Failed: ' + reason);
		});


		$scope.newFilter = {
			DateFrom_TMP: new Date(),
			DateTo_TMP: new Date(),
			ShowDetails: false,
			ParticularId: null,
		}
		
		$scope.columnDefs = [
			{
				headerName: "SNo.", width: 70,	minWidth: 60,	cellStyle: { textAlign: "center" },	sortable: false,	filter: false,
				valueGetter: function (params) {
					if (params.node.rowPinned) {
						return '';
					}
					return params.node.rowIndex + 1;
				}
			},
			{
				headerName: "Voucher Date (AD)", field: "VoucherDateAD", filter: 'agDateColumnFilter', minWidth: 130, flex: 1, cellStyle: { textAlign: 'left' },
				valueFormatter: (params) => {
					if (!params.value) return '';
					const date = new Date(params.value);
					const year = date.getFullYear();
					const month = String(date.getMonth() + 1).padStart(2, '0');
					const day = String(date.getDate()).padStart(2, '0');
					return `${year}-${month}-${day}`;
				}
			},
			{ headerName: "Voucher Date (BS)", field: "VoucherDateBS", filter: 'agDateColumnFilter', minWidth: 150, flex: 1, cellStyle: { textAlign: 'left' } },
			{ headerName: "Voucher Number", field: "VoucherNo", filter: 'agTextColumnFilter', minWidth: 160, flex: 1.5, cellStyle: { textAlign: 'left' } },
			{ headerName: "Voucher Name", field: "VoucherName", filter: 'agTextColumnFilter', minWidth: 150, flex: 1 },
			{ headerName: "Name", field: "Name", filter: 'agTextColumnFilter', minWidth: 160, flex: 1.5 },
			{ headerName: "Branch", field: "Branch", filter: 'agTextColumnFilter', minWidth: 130, flex: 1 },
			{
				headerName: "OpeningQty",
				field: "OpeningQty",
				filter: 'agTextColumnFilter',
				minWidth: 130,
				flex: 1,
				valueFormatter: function (params) {
					return (params.value === null || params.value === undefined) ? '-' : params.value;
				}
			},
			{ headerName: "InQty", field: "InQty", filter: 'agNumberColumnFilter', minWidth: 150, flex: 1 },
			{ headerName: "OutQty", field: "OutQty", filter: 'agNumberColumnFilter', minWidth: 160, flex: 1.2 },
			{ headerName: "BalanceQty", field: "BalanceQty", filter: 'agNumberColumnFilter', minWidth: 160, flex: 1.2 },
		];

		//ag-Grid options
		$scope.gridOptions = {
			defaultColDef: {
				filter: true,
				resizable: true,
				sortable: true
			},
			onFilterChanged: function () {
				$scope.updateAssetWiseTotal();
			},
			onSortChanged: function () {
				$scope.updateAssetWiseTotal();
			},
			onGridReady: function (params) {
				$scope.gridApi = params.api;
				$scope.gridColumnApi = params.columnApi;
			},
			getRowStyle: function (params) {
				if (params.node.rowPinned === 'bottom') {
					return {
						fontWeight: 'bold',
						background: '#f2f2f2'
					};
				}
			},
			enableSorting: true,
			multiSortKey: 'ctrl',
			enableColResize: true,
			overlayLoadingTemplate: "Please Click the Load Bottom to display the data",
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
			if ($scope.gridApi) $scope.gridApi.refreshHeader();
		});

	};




	$scope.GetData = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		var para = {
			DateFrom: ($scope.newFilter.DateFromDet ? $filter('date')(new Date($scope.newFilter.DateFromDet.dateAD), 'yyyy-MM-dd') : null),
			DateTo: ($scope.newFilter.DateToDet ? $filter('date')(new Date($scope.newFilter.DateToDet.dateAD), 'yyyy-MM-dd') : null),
			TranId: $scope.newFilter.ParticularId || null,
			BranchId: $scope.newFilter.BranchId || null
		};
		$http({
			method: 'POST',
			url: base_url + "AssetsManagement/Reporting/GetAllAssetWiseReport",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.DataColl = res.data.Data;
				$scope.gridOptions.api.setRowData($scope.DataColl);
				$scope.updateAssetWiseTotal();

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
			//branchIdColl: $scope.newDaily.BranchId
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
				down_file(base_url + "//" + res.data.Data.ResponseId, "VendorWiseAsset.xlsx");
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

	$scope.updateAssetWiseTotal = function () {
		var dt = {
			Name: "TOTAL =>", 
			OpeningQty: 0,
			InQty: 0,
			OutQty: 0,
			BalanceQty: 0
		};
		if (!$scope.gridOptions.api) return;
		$scope.gridOptions.api.forEachNodeAfterFilterAndSort(function (node) {
			var d = node.data;
			dt.OpeningQty += Number(d.OpeningQty || 0);
			dt.InQty += Number(d.InQty || 0);
			dt.OutQty += Number(d.OutQty || 0);
		});
		dt.BalanceQty = dt.OpeningQty + (dt.InQty - dt.OutQty);
		$scope.gridOptions.api.setPinnedBottomRowData([dt]);
	};


});






