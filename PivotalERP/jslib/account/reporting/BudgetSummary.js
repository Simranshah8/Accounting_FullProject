"use strict";
agGrid.initialiseAgGridWithAngular1(angular);
app.controller('BudgetSummaryController', function ($scope, $http, $timeout, $filter, $rootScope, GlobalServices) {
	$scope.onBtExportCSV = function () {
		var params = {
			fileName: 'BudgetSummaryReport.csv',
			sheetName: 'BudgetSummaryReport'
		};
		$scope.gridOptions.api.exportDataAsCsv(params);
	}

	$scope.onFilterTextBoxChanged = function () {
		$scope.gridOptions.api.setQuickFilter($scope.search);
	}

	$scope.LoadData = function () {
		$scope.newFilter = {

			DateFrom_TMP: new Date(),
			DateTo_TMP: new Date()
		};

		$scope.columnDefs = [
			{	headerName: "SNo.", width: 80, minWidth: 80, cellStyle: { textAlign: "center" },sortable: false,	filter: false,
				valueGetter: function (params) {
					if (params.node.rowPinned) return '';
					return params.node.rowIndex + 1;
				},
			},

			{	headerName: "Particular", field: "Particular", filter: 'agTextColumnFilter', minWidth: 150, flex: 1, cellStyle: { textAlign: 'left' }},
			{	headerName: "Branch", field: "Branch", filter: 'agTextColumnFilter', minWidth: 150, flex: 1, cellStyle: { textAlign: 'left' }},
			{	headerName: "Expectation Budget 2082",	headerClass: "center-header",
				children: [
					{ headerName: "Qty", field: "EQty", filter: 'agNumberColumnFilter', minWidth: 100, width: 100, cellStyle: { textAlign: 'center' }, headerClass: "header-center"   },
					{ headerName: "Rate", field: "ERate", filter: 'agNumberColumnFilter', minWidth: 100, width: 100,  cellStyle: { textAlign: 'right' }, headerClass: "header-right"  },
					{ headerName: "Amt", field: "EAmt", filter: 'agNumberColumnFilter', minWidth: 110, width: 110, cellStyle: { textAlign: 'right' }, headerClass: "header-right"  }
				]
			},
			{	headerName: "Transaction Amt 2082",	headerClass: "text-center",
				children: [
					{ headerName: "Qty", field: "TQty", filter: 'agNumberColumnFilter', minWidth: 100, width: 100, cellStyle: { textAlign: 'center' }, headerClass: "header-center" },
					{ headerName: "Rate", field: "TRate", filter: 'agNumberColumnFilter', minWidth: 100, width: 100, cellStyle: { textAlign: 'right' }, headerClass: "header-right"  },
					{ headerName: "Amt", field: "TAmt", filter: 'agNumberColumnFilter', minWidth: 110, width: 110, cellStyle: { textAlign: 'right' }, headerClass: "header-right" }
				]
			},
			{ headerName: "Difference Amt (D-E)", field: "DiffAmtET", filter: 'agNumberColumnFilter', minWidth: 150, cellStyle: { textAlign: 'right' }, headerClass: "header-right" },
			{ headerName: "Last Year Budget Transaction Amt", field: "LastYearTranAmt", filter: 'agNumberColumnFilter', minWidth: 200, cellStyle: { textAlign: 'right' }, headerClass: "header-right"  },
			{ headerName: "Difference Amt (E-G)", field: "DiffAmt", filter: 'agNumberColumnFilter', minWidth: 150, cellStyle: { textAlign: 'right' }, headerClass: "header-right"  }
		];

		//ag-Grid options
		$scope.gridOptions = {
			defaultColDef: {
				filter: true,
				resizable: true,
				sortable: true
			},
			onFilterChanged: function () {
				$scope.updateTotal();
			},
			onSortChanged: function () {
				$scope.updateTotal();
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
			url: base_url + "Account/Reporting/GetBudgetSummaryReport",
			dataType: "json",
			data: JSON.stringify(para),
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.DataColl = res.data.Data;
				$scope.gridOptions.api.setRowData($scope.DataColl);
				$scope.updateTotal();

			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			Swal.fire('Failed: ' + reason);
		});
	}


	$scope.updateTotal = function () {
		var dt = {
			Particular: "Total =>",
			EAmt: 0,
			TAmt: 0,
			DiffAmtET: 0,
			LastYearTranAmt: 0,
			DiffAmt: 0
		};
		if (!$scope.gridOptions.api) return;
		$scope.gridOptions.api.forEachNodeAfterFilterAndSort(function (node) {
			var d = node.data;
			dt.EAmt += Number(d.EAmt || 0);
			dt.TAmt += Number(d.TAmt || 0);
			dt.DiffAmtET += Number(d.DiffAmtET || 0);
			dt.LastYearTranAmt += Number(d.LastYearTranAmt || 0);
			dt.DiffAmt += Number(d.DiffAmt || 0);
		});
		$scope.gridOptions.api.setPinnedBottomRowData([dt]);
	};


	$scope.saveRptListState = function () {
		GlobalServices.saveRptListState(EntityId, $scope.gridOptions);
	};

	$scope.GetDataForPrint = function () {
		var filterData = [];
		$scope.gridOptions.api.forEachNodeAfterFilterAndSort(function (node) {
			var budgetSummary = node.data;
			filterData.push(budgetSummary);
		});
		return filterData;
	}

	$scope.DownloadAsXls = function () {
		$scope.loadingstatus = 'running';
		showPleaseWait();
		var dataColl = $scope.GetDataForPrint();
		var paraData = {
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
				down_file(base_url + "//" + res.data.Data.ResponseId, "BudgetsummaryReport.xlsx");
			}
		}, function (errormessage) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			Swal.fire(errormessage);
		});
	}


	$scope.Print = function () {
		$http({
			method: 'GET',
			url: base_url + "ReportEngine/GetReportTemplates?entityId=" + EntityId + "&voucherId=0&isTran=false",
			dataType: "json"
		}).then(function (res) {
			if (res.data.IsSuccess && res.data.Data) {
				var templatesColl = res.data.Data;
				if (templatesColl && templatesColl.length > 0) {
					var templatesName = [];
					var sno = 1;
					angular.forEach(templatesColl, function (tc) {
						templatesName.push(sno + '-' + tc.ReportName);
						sno++;
					});

					var print = false;

					var rptTranId = 0;
					if (templatesColl.length == 1)
						rptTranId = templatesColl[0].RptTranId;
					else {
						Swal.fire({
							title: 'Report  For Print',
							input: 'select',
							inputOptions: templatesName,
							inputPlaceholder: 'Select a template',
							showCancelButton: true,
							inputValidator: (value) => {
								return new Promise((resolve) => {
									if (value >= 0) {
										resolve()
										rptTranId = templatesColl[value].RptTranId;

										if (rptTranId > 0) {
											var dataColl = $scope.GetDataForPrint();
											print = true;
											$http({
												method: 'POST',
												url: base_url + "Global/PrintReportData",
												headers: { 'Content-Type': undefined },

												transformRequest: function (data) {

													var formData = new FormData();
													formData.append("entityId", EntityId);
													formData.append("jsonData", angular.toJson(data.jsonData));

													return formData;
												},
												data: { jsonData: dataColl }
											}).then(function (res) {

												$scope.loadingstatus = "stop";
												hidePleaseWait();
												if (res.data.IsSuccess && res.data.Data) {

													document.body.style.cursor = 'wait';
													document.getElementById("frmRpt").src = '';
													document.getElementById("frmRpt").src = base_url + "web/ReportViewer.aspx?rpttranid=" + rptTranId + "&istransaction=false&entityid=" + EntityId + "&voucherid=0&tranid=0&vouchertype=0&sessionid=" + res.data.Data.ResponseId;
													document.body.style.cursor = 'default';
													$('#FrmPrintReport').modal('show');

												} else
													Swal.fire('No Templates found for print');

											}, function (errormessage) {
												hidePleaseWait();
												$scope.loadingstatus = "stop";
												Swal.fire(errormessage);
											});

										}

									} else {
										resolve('You need to select:)')
									}
								})
							}
						})
					}

					if (rptTranId > 0 && print == false) {
						var dataColl = $scope.GetDataForPrint();
						print = true;

						$http({
							method: 'POST',
							url: base_url + "Global/PrintReportData",
							headers: { 'Content-Type': undefined },
							transformRequest: function (data) {
								var formData = new FormData();
								formData.append("entityId", EntityId);
								formData.append("jsonData", angular.toJson(data.jsonData));
								return formData;
							},
							data: { jsonData: dataColl }
						}).then(function (res) {

							$scope.loadingstatus = "stop";
							hidePleaseWait();
							if (res.data.IsSuccess && res.data.Data) {

								document.body.style.cursor = 'wait';
								document.getElementById("frmRpt").src = '';
								document.getElementById("frmRpt").src = base_url + "web/ReportViewer.aspx?rpttranid=" + rptTranId + "&istransaction=false&entityid=" + EntityId + "&voucherid=0&tranid=0&vouchertype=0&sessionid=" + res.data.Data.ResponseId;
								document.body.style.cursor = 'default';
								$('#FrmPrintReport').modal('show');

							} else
								Swal.fire('No Templates found for print');

						}, function (errormessage) {
							hidePleaseWait();
							$scope.loadingstatus = "stop";
							Swal.fire(errormessage);
						});

					}

				} else
					Swal.fire('No Templates found for print');
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	};



});






