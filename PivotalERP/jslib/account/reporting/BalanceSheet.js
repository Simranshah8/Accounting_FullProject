 
app.controller('BalanceSheetController', function ($scope, $http, $timeout, $filter, GlobalServices) {

    $scope.Title = 'BalanceSheet';
 var PrintPreviewAs = 1;
  const contextMenu = GlobalServices.createElementForMenu();
	getterAndSetter();

	$scope.onBtExportCSV = function () {
		var params = {
			filefield: 'balancesheet.csv',
			sheetfield: 'balancesheet'
		};

		$scope.gridOptions.api.exportDataAsCsv(params);
	}
	$scope.onFilterTextBoxChanged = function () {
		$scope.gridOptions.api.setQuickFilter($scope.search);
	}
    $scope.toggleExpandCollapse = function () {
        if ($scope.newBalanceSheet.ExpandCollapse == true) {
            $scope.gridOptions.api.expandAll();
        } else {
            $scope.gridOptions.api.collapseAll();
        }
    };
	function getterAndSetter() {
		$scope.columnDefs = [
            { headerName: "Particulars", field: "Particulars", cellRenderer: 'group', width: 430, dataType: 'Text', filter: "agNumberColumnFilter", pinned: 'left', },
			{ headerName: "Opening", field: "OpeningAmt", width: 170, filter: "agNumberColumnFilter", dataType: 'Number', valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' }, },
			{ headerName: "Transaction", field: "TransactionAmt", width: 170, filter: 'agTextColumnFilter', dataType: 'Number', valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' }, },
            { headerName: "Closing", field: "ClosingAmt", width: 180, dataType: 'Number', valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' }, },
            {
                headerName: "Action",
                width: 50,
                cellRenderer: function (params) {
                    return '<div class="btn-group" style="position: fixed; ">' +
                        '<button type="button" class="btn btn-default px-1 dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
                        '<span class="caret"></span>' +
                        '</button>' +
                        '<ul class="dropdown-menu dropdown-menu-right p-2" style="position: absolute; left: 0;">' +
                        '<li><a data-toggle="tooltip" data-placement="top" title="Show Voucher" ng-click="ShowLedgerVoucher(this)"><i class="fas fa-info text-infor"></i> Show Voucher</a></li>' +
                        '</ul>' +
                        '</div>';
                },
                pinned: 'right'
            },
		];

		// let the grid know which columns and what data to use
        $scope.gridOptions = {
            angularCompileRows: true,
			onCellContextMenu: onCellContextMenu, // Handle right-click event			
			columnDefs: $scope.columnDefs,
			rowHeight: 31,
			headerHeight: 31,
			overlayLoadingTemplate: "Please Click the Load Bottom to display the data",
			defaultColDef: {
				resizable: true,
				sortable: true,
				filter: true,
				resizable: true,
				cellStyle: { 'line-height': '31px' },
				rowSelection: 'multiple'
			},
			enableColResize: true,
			rowData: null,
			filter: true,
			enableFilter: true,
			rowSelection: 'multiple',
			getNodeChildDetails: function (beData) {

				if (beData.ChieldsCOll && beData.ChieldsCOll.length > 0) {
					return {
						group: true,
						children: beData.ChieldsCOll,
						expanded: beData.open
					};
				} else
					return null;

			}
		};
		
		$timeout(function () {
            GlobalServices.getListState(EntityId, $scope.gridOptions);
        });

	}
	  
	$scope.LoadData = function () {

        $('.select2').select2();

		$scope.filterValue = '';
		$scope.confirmMSG = GlobalServices.getConfirmMSG();

 $scope.GenConfig = {};
        GlobalServices.getGenConfig().then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.GenConfig = res.data.Data;
                PrintPreviewAs = $scope.GenConfig.PrintPreviewAs;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
		
		$scope.newBalanceSheet = {
			DateFrom_TMP: new Date(),
			DateTo_TMP: new Date(),

		};

        $scope.ProjectColl = [];
        GlobalServices.getProject().then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.ProjectColl = res.data.Data;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

		$scope.comDet = {};
		$timeout(function () {
			$http({
				method: "GET",
				url: base_url + "Global/GetCompanyDetail",
				dataType: "json"
			}).then(function (res) {
				$scope.comDet = res.data.Data;
				if ($scope.comDet) {
					$scope.newBalanceSheet.DateFrom_TMP = new Date($scope.comDet.StartDate);
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

	$scope.ClearBalanceSheet = function () {
		$scope.newBalanceSheet = {
			BalanceSheetId: null,
			Mode: 'Save'
		};
	};

	$scope.LoadReport = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		$scope.gridOptions.data = [];
		 
		var dateFrom = $filter('date')(new Date(), 'yyyy-MM-dd');
		var dateTo = $filter('date')(new Date(), 'yyyy-MM-dd');

		if ($scope.newBalanceSheet.DateFromDet)
			dateFrom = $filter('date')($scope.newBalanceSheet.DateFromDet.dateAD, 'yyyy-MM-dd');

		if ($scope.newBalanceSheet.DateToDet)
			dateTo = $filter('date')($scope.newBalanceSheet.DateToDet.dateAD, 'yyyy-MM-dd');

		var para = {
			dateFrom: dateFrom,
            dateTo: dateTo,
            branchIdColl: ($scope.newBalanceSheet.BranchId ? $scope.newBalanceSheet.BranchId.toString() : ''),
            projectIdColl: ($scope.newBalanceSheet.projectIdColl ? $scope.newBalanceSheet.projectIdColl.toString() : ''),
		};
         

		$http({
			method: 'POST',
			url: base_url + "Account/Reporting/GetBS",
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

        document.getElementById("frmRpt").src = '';
        reload_message_frame('frmRpt');

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
                    var selectedRpt = null;
                    if (templatesColl.length == 1) {
                        selectedRpt = templatesColl[0];
                        rptTranId = templatesColl[0].RptTranId;
                    }
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
                                        selectedRpt = templatesColl[value];
                                        if (rptTranId > 0) {
                                            var dataColl = $scope.GetDataForPrint();
                                            print = true;

                                            if (selectedRpt.Rpt_Type == 3) {
                                                var paraData = {
                                                    Period: $scope.newBalanceSheet.DateFromDet.dateBS + " TO " + $scope.newBalanceSheet.DateToDet.dateBS,
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
                                                        formData.append("RptPath", selectedRpt.Path);
                                                        return formData;
                                                    },
                                                    data: { jsonData: dataColl }
                                                }).then(function (res) {

                                                    $scope.loadingstatus = "stop";
                                                    hidePleaseWait();
                                                    if (res.data.IsSuccess && res.data.Data) {
                                                        down_file(base_url + "//" + res.data.Data.ResponseId, "BS.xlsx");
                                                    }

                                                }, function (errormessage) {
                                                    hidePleaseWait();
                                                    $scope.loadingstatus = "stop";
                                                    Swal.fire(errormessage);
                                                });

                                            }
                                            else {
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

                                                        var rptPara = {
                                                            rpttranid: rptTranId,
                                                            istransaction: false,
                                                            entityid: EntityId,
                                                            voucherid: 0,
                                                            tranid: 0,
                                                            vouchertype: 0,
                                                            sessionid: res.data.Data.ResponseId,
                                                            Period: $scope.newBalanceSheet.DateFromDet.dateBS + " TO " + $scope.newBalanceSheet.DateToDet.dateBS,
                                                        };
                                                        var paraQuery = param(rptPara);
                                                        document.body.style.cursor = 'wait';

                                                        if (selectedRpt.Rpt_Type == 3)
                                                            document.getElementById("frmRpt").src = base_url + "web/ShowExcelReport.aspx?" + paraQuery;
                                                        else if (selectedRpt.Rpt_Type == 2)
                                                            document.getElementById("frmRpt").src = base_url + "Home/RdlcViewer?" + paraQuery;
                                                        else
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

                                var rptPara = {
                                    rpttranid: rptTranId,
                                    istransaction: false,
                                    entityid: EntityId,
                                    voucherid: 0,
                                    tranid: 0,
                                    vouchertype: 0,
                                    sessionid: res.data.Data.ResponseId,
                                    Period: $scope.newBalanceSheet.DateFromDet.dateBS + " TO " + $scope.newBalanceSheet.DateToDet.dateBS,
                                };
                                var paraQuery = param(rptPara);
                                document.body.style.cursor = 'wait';
                                if (selectedRpt.IsRDLC == true)
                                    document.getElementById("frmRpt").src = base_url + "Home/RdlcViewer?" + paraQuery;
                                else
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

    $scope.PrintData = {};
	$scope.GetDataForPrint = function () {

        $scope.PrintData = {};
        $scope.PrintData.AssetsColl = [];
        $scope.PrintData.LaibilityColl = [];

		var filterData = [];

		//$scope.gridOptions.api.forEachNodeAfterFilterAndSort(function (node) {
		//	var dayBook = node.data;
		//	filterData.push(dayBook);
		//});

        if ($scope.gridOptions.api.rowModel.rowsToDisplay) {
            if ($scope.gridOptions.api.rowModel.rowsToDisplay.length > 0) {
                $scope.gridOptions.api.rowModel.rowsToDisplay.forEach(function (node) {
                    var fData = node.data;
                    

                    fData.Particulars = padLeft(fData.Particulars, fData.TotalSpace + fData.Particulars.length, ' ');
                    filterData.push(fData);
                     
                })
            }
        }

		return filterData;

    };

    $scope.DownloadAsXls = function () {

        $scope.loadingstatus = 'running';
        showPleaseWait();

        var dataColl = $scope.GetDataForPrint();

        var paraData = {
            Period: $scope.newBalanceSheet.DateFromDet.dateBS + " TO " + $scope.newBalanceSheet.DateToDet.dateBS,            
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
                down_file(base_url + "//" + res.data.Data.ResponseId, "BS.xlsx");
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

    $scope.ShowLedgerVoucher = function (e) {
        var obj = e.data;

        if (obj.IsLedgerGroup == true || obj.LedgerId == 0)
            return;

        $(document).ready(function () {
            $('body').css('cursor', 'wait');
        });

        var para = {
            ledgerId: obj.LedgerId
        };
        var frame = document.getElementById("frmChieldForm");
        var frameDoc = frame.contentDocument || frame.contentWindow.document;
        if (frameDoc)
            frameDoc.removeChild(frameDoc.documentElement);

        frame.src = '';
        frame.src = base_url + "Account/Reporting/LedgerVoucher?" + param(para);
        document.body.style.cursor = 'default';

        $('#frmChieldForm').on('load', function () {
            $('body').css('cursor', 'default');
        });

        $('#frmChield').modal('show');
    }

});
