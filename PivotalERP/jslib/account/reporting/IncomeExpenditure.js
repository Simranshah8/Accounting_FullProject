
app.controller('incomeExpenditureController', function ($scope, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'Income Expenditure Summary';
	var PrintPreviewAs = 1;
	const contextMenu = GlobalServices.createElementForMenu();

	getterAndSetter();

	$scope.onBtExportCSV = function () {
		var params = {
			filefield: 'incomeExpenditure.csv',
			sheetfield: 'incomeExpenditure'
		};

		$scope.gridOptions.api.exportDataAsCsv(params);
	}
	$scope.onFilterTextBoxChanged = function () {
		$scope.gridOptions.api.setQuickFilter($scope.search);
	}

	$scope.onColumnWiseFilter = function (colDef) {
		var valColl = [];
		valColl.push($scope.FilterByColumn);
		const instance = $scope.gridOptions.api.getFilterInstance(colDef.field);
		instance.setModel({ values: valColl });
		$scope.gridOptions.api.onFilterChanged();
	}

	function getterAndSetter() {


		$scope.gridOptions = [];
		$scope.ColumnColl = [

			{ field: "ESNo", headerName: "S.No.", width: 80, filter: 'agTextColumnFilter' },
			{ field: "ExpensesHeading", headerName: "Expenses", width: 200, filter: 'agTextColumnFilter' },
			{
				field: "ExpensesAmt", headerName: "Amount", width: 130, filter: 'agNumberColumnFilter',
				valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' }
			},

			{ field: "Address", headerName: " ", width: 200, filter: 'agTextColumnFilter' },

			{ field: "ISNo", headerName: "S.No.", width: 80, filter: 'agTextColumnFilter' },
			{ field: "IncomeHeading", headerName: "Income", width: 200, filter: 'agTextColumnFilter' },
			{
				field: "IncomeAmt", headerName: "Amount", width: 130, filter: 'agNumberColumnFilter',
				valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' }
			},

		];

		$scope.gridOptions = {
			onCellContextMenu: onCellContextMenu, // Handle right-click event			
			//angularCompileRows: true,
			// a default column definition with properties that get applied to every column
			defaultColDef: {
				filter: true,
				resizable: true,
				sortable: true,

				// set every column width
				width: 90
			},
			columnDefs: $scope.ColumnColl,
			overlayLoadingTemplate: "Please Click the Load Bottom to display the data",
			enableColResize: true,
			rowData: null,
			filter: true,
			enableFilter: true,
			rowSelection: 'multiple',
			suppressHorizontalScroll: true,
			alignedGrids: [],
			onFilterChanged: function (e) {
				//console.log('onFilterChanged', e);
				var income = 0, expenses = 0;
				$scope.gridOptions.api.forEachNodeAfterFilterAndSort(function (node) {
					var tb = node.data;
					income += tb.IncomeAmt;
					expenses += tb.ExpensesAmt;
				});

				var diffAmt = income - expenses;

				$scope.dataForBottomGrid[0].ExpensesAmt = expenses;
				$scope.dataForBottomGrid[0].IncomeAmt = income;

				if (diffAmt > 0) {
					$scope.dataForBottomGrid[1].ExpensesAmt = 0;
					$scope.dataForBottomGrid[1].IncomeAmt = diffAmt;
				} else {
					$scope.dataForBottomGrid[2].ExpensesAmt = Math.abs(diffAmt);
					$scope.dataForBottomGrid[2].IncomeAmt = 0;
				}

				$scope.gridOptionsBottom.api.setRowData($scope.dataForBottomGrid);
				//console.log('gridApi.getFilterModel() =>', e.api.getFilterModel());
			},

		};


		$scope.dataForBottomGrid = [
			{
				ESNo: null,
				ExpensesHeading: 'Total =>',
				ExpensesAmt: 0,
				Address: '',
				ISNo: null,
				IncomeHeading: '',
				IncomeAmt: 0,
			},

			{
				ESNo: null,
				ExpensesHeading: 'Net Amount =>',
				ExpensesAmt: 0,
				Address: '',
				ISNo: null,
				IncomeHeading: '',
				IncomeAmt: 0,
			},
		];

		$scope.gridOptionsBottom = {
			defaultColDef: {
				resizable: true,
				width: 90
			},
			columnDefs: $scope.ColumnColl,
			// we are hard coding the data here, it's just for demo purposes
			rowData: $scope.dataForBottomGrid,
			debug: true,
			rowClass: 'bold-row',
			// hide the header on the bottom grid
			headerHeight: 0,
			alignedGrids: []
		};

		$scope.gridOptions.alignedGrids.push($scope.gridOptionsBottom);
		$scope.gridOptionsBottom.alignedGrids.push($scope.gridOptions);

		$scope.gridDivBottom = document.querySelector('#myGridBottom');
		new agGrid.Grid($scope.gridDivBottom, $scope.gridOptionsBottom);

		$timeout(function () {
			GlobalServices.getListState(EntityId, $scope.gridOptions);
		});
	};

	$scope.LoadData = function () {
		$('.select2').select2();
		$scope.confirmMSG = GlobalServices.getConfirmMSG();
		$scope.filterValue = '';

		$scope.GenConfig = {};
		GlobalServices.getGenConfig().then(function (res) {
			if (res.data.IsSuccess && res.data.Data) {
				$scope.GenConfig = res.data.Data;
				PrintPreviewAs = $scope.GenConfig.PrintPreviewAs;
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});


		$scope.newLedgerwise = {
			DateFrom_TMP: new Date(),
			DateTo_TMP: new Date(),
			branchId: 0,
			branchIdColl: ''
		};

		$timeout(function () {
			$http({
				method: "GET",
				url: base_url + "Global/GetCompanyDetail",
				dataType: "json"
			}).then(function (res) {
				var comDet = res.data.Data;
				if (comDet) {
					$scope.newLedgerwise.DateFrom_TMP = new Date(comDet.StartDate);
					$scope.newLedgerwise.DateTo_TMP = new Date();
				}
			}, function (errormessage) {
				alert('Unable to Delete data. pls try again.' + errormessage.responseText);
			});
		});

		$scope.BranchList = [];
		$http({
			method: 'POST',
			url: base_url + "Setup/Security/GetAllBranchList",
			dataType: "json"
		}).then(function (res) {
			if (res.data.IsSuccess && res.data.Data) {
				$scope.BranchList = res.data.Data;
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	};

	$scope.ClearLedgerwise = function () {
		$scope.newLedgerwise = {
			LedgerwiseId: null,

			Mode: 'Save'
		};

	};

	$scope.LoadReport = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		$scope.gridOptions.data = [];

		var dateFrom = $filter('date')(new Date(), 'yyyy-MM-dd');
		var dateTo = $filter('date')(new Date(), 'yyyy-MM-dd');

		if ($scope.newLedgerwise.DateFromDet)
			dateFrom = $filter('date')($scope.newLedgerwise.DateFromDet.dateAD, 'yyyy-MM-dd');

		if ($scope.newLedgerwise.DateToDet)
			dateTo = $filter('date')($scope.newLedgerwise.DateToDet.dateAD, 'yyyy-MM-dd');


		var para = {
			dateFrom: dateFrom,
			dateTo: dateTo,
			branchId: $scope.newLedgerwise.branchId,
			branchIdColl: $scope.newLedgerwise.branchIdColl
		};

		$http({
			method: 'POST',
			url: base_url + "Account/Reporting/GetIncomeExpenditure",
			headers: { 'Content-Type': undefined },

			transformRequest: function (data) {

				var formData = new FormData();
				formData.append("jsonData", angular.toJson(data.jsonData));

				return formData;
			},
			data: { jsonData: para }
		}).then(function (res) {

			$scope.loadingstatus = "stop";
			hidePleaseWait();
			if (res.data.IsSuccess && res.data.Data) {
				var DataColl = mx(res.data.Data);

				var income = DataColl.sum(p1 => p1.IncomeAmt), expenses = DataColl.sum(p1 => p1.ExpensesAmt);

				var diffAmt = income - expenses;

				$scope.dataForBottomGrid[0].ExpensesAmt = expenses;
				$scope.dataForBottomGrid[0].IncomeAmt = income;

				if (diffAmt > 0) {
					$scope.dataForBottomGrid[1].ExpensesAmt = 0;
					$scope.dataForBottomGrid[1].IncomeAmt = diffAmt;
				} else {
					$scope.dataForBottomGrid[1].ExpensesAmt = Math.abs(diffAmt);
					$scope.dataForBottomGrid[1].IncomeAmt = 0;
				}

				$scope.gridOptionsBottom.api.setRowData($scope.dataForBottomGrid);
				$scope.gridOptions.api.setRowData(res.data.Data);
			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (errormessage) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";

		});

	};

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
							title: 'Report Templates For Print',
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
											var dataColl = [];
											$scope.gridOptions.api.forEachNodeAfterFilterAndSort(function (node) {
												dataColl.push(node.data);
											});
											print = true;
											$http({
												method: 'POST',
												url: base_url + "Account/Reporting/PrintIncomeExpenditure",
												headers: { 'Content-Type': undefined },

												transformRequest: function (data) {

													var formData = new FormData();
													formData.append("jsonData", angular.toJson(data.jsonData));

													return formData;
												},
												data: { jsonData: dataColl }
											}).then(function (res) {

												$scope.loadingstatus = "stop";
												hidePleaseWait();
												if (res.data.IsSuccess && res.data.Data) {

													var rptPara = {
														rpttranid: rptTranId,
														istransaction: false,
														entityid: EntityId,
														voucherid: 0,
														tranid: 0,
														vouchertype: 0,
														sessionid: res.data.Data.ResponseId,
														Period: $scope.newLedgerwise.DateFromDet.dateBS + ' TO ' + $scope.newLedgerwise.DateToDet.dateBS
													};
													var paraQuery = param(rptPara);

													document.body.style.cursor = 'wait';
													document.getElementById("frmRpt").src = '';
													document.getElementById("frmRpt").src = base_url + "web/ReportViewer.aspx?" + paraQuery;
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
						var dataColl = [];
						$scope.gridOptions.api.forEachNodeAfterFilterAndSort(function (node) {
							dataColl.push(node.data);
						});
						print = true;

						$http({
							method: 'POST',
							url: base_url + "Account/Reporting/PrintIncomeExpenditure",
							headers: { 'Content-Type': undefined },

							transformRequest: function (data) {

								var formData = new FormData();
								formData.append("jsonData", angular.toJson(data.jsonData));

								return formData;
							},
							data: { jsonData: dataColl }
						}).then(function (res) {

							$scope.loadingstatus = "stop";
							hidePleaseWait();
							if (res.data.IsSuccess && res.data.Data) {

								var rptPara = {
									rpttranid: rptTranId,
									istransaction: false,
									entityid: EntityId,
									voucherid: 0,
									tranid: 0,
									vouchertype: 0,
									sessionid: res.data.Data.ResponseId,
									Period: $scope.newLedgerwise.DateFromDet.dateBS + ' TO ' + $scope.newLedgerwise.DateToDet.dateBS
								};
								var paraQuery = param(rptPara);

								document.body.style.cursor = 'wait';
								document.getElementById("frmRpt").src = '';
								document.getElementById("frmRpt").src = base_url + "web/ReportViewer.aspx?" + paraQuery;
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



	$scope.GetDataForPrint = function () {

		var filterData = [];

		$scope.gridOptions.api.forEachNodeAfterFilterAndSort(function (node) {
			var dayBook = node.data;
			filterData.push(dayBook);
		});

		return filterData;
	}
	$scope.DownloadAsXls = function () {

		$scope.loadingstatus = 'running';
		showPleaseWait();

		var dataColl = $scope.GetDataForPrint();

		var paraData = {
			Period: $scope.newLedgerwise.DateFromDet.dateBS + ' TO ' + $scope.newLedgerwise.DateToDet.dateBS
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
				down_file(base_url + "//" + res.data.Data.ResponseId, "IncomeExpenditure.xlsx");
			}

		}, function (errormessage) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			Swal.fire(errormessage);
		});
	}
	$scope.saveRptListState = function () {
		GlobalServices.saveRptListState(EntityId, $scope.gridOptions);
	};
	$scope.DelListState = function () {
		GlobalServices.delListStateRpt(EntityId);
	}
	function onCellContextMenu(event) {
		GlobalServices.onCellContextMenu(event, $scope.gridOptions, contextMenu);
	}

	// Hide context menu when clicking outside
	document.addEventListener('click', function () {
		contextMenu.style.display = 'none';
	});

	$(document).ready(function () {
		$(this).bind("contextmenu", function (e) {
			e.preventDefault();
		});
	});


});