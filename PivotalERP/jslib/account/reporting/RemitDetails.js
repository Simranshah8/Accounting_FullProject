

"use strict";

agGrid.initialiseAgGridWithAngular1(angular);

app.controller("RemitDetails", function ($scope, $http, $filter, $timeout, uiGridConstants, uiGridTreeViewConstants, GlobalServices) {
    $scope.Title = 'RemitDetails';
var PrintPreviewAs = 1;
 const contextMenu = GlobalServices.createElementForMenu();
    LoadData();
    var glSrv = GlobalServices;

    $scope.onFilterTextBoxChanged = function () {
        $scope.gridOptions.api.setQuickFilter($scope.search);
    }

    function Numberformat(val) {

        if (!val || val == 0)
            return '';
        return $filter('number')(val, 2);
    }

    function NumberformatAC(val) {
        if (val > 0)
            return $filter('number')(val, 2) + ' DR';
        else if (val < 0)
            return $filter('number')(val, 2) + ' CR';
        else
            return '';

    }
    $scope.DateFormatAD = function (date) {

        if (date) {
            date = new Date(date);
            return $filter('date')(date, 'yyyy-MM-dd');
        }

        return '';
    };
    $scope.padLeft = function (nr, n, str) {

        if (nr && n)
            return Array(n - String(nr).length + 1).join(str || '0') + nr;
        return '';
    };
    $scope.DateFormatBS = function (ny, nm, nd) {
        if (ny && nm && nd)
            return ny + '-' + $scope.padLeft(nm, 2) + '-' + $scope.padLeft(nd, 2);
        return '';
    };

    $scope.DataColl = [];

    function LoadData() {

 $scope.GenConfig = {};
        GlobalServices.getGenConfig().then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.GenConfig = res.data.Data;
                PrintPreviewAs = $scope.GenConfig.PrintPreviewAs;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });


        //Number,Amount,Date,Text
        $scope.BranchTypeColl = [];
        $scope.VoucherTypeColl = [];
        $scope.LedgerGroupTypeColl = [];
        $scope.ExpressionColl = GlobalServices.getExpression();
        $scope.ConditionColl = GlobalServices.getLogicCondition();
        $scope.FilterColumnColl = [{ text: 'AutoVoucherNo', value: 'AutoVoucherNo', dataType: 'Number' }, { text: 'VoucherDate', value: 'VoucherDate', dataType: 'Date' }, { text: 'SourceGodown', value: 'SourceGodown', dataType: 'text' }, { text: 'VoucherName', value: 'VoucherName', dataType: 'text' }, { text: 'ProductLedger', value: 'ProductLedger', dataType: 'text' }, { text: 'ProductName', value: 'ProductName', dataType: 'text' }, { text: 'Code', value: 'Code', dataType: 'text' }, { text: 'Rate', value: 'Rate', dataType: 'Number' }, { text: 'Qty', value: 'Qty', dataType: 'Number' }, { text: 'Amount', value: 'Amount', dataType: 'Number' }, { text: 'ProductGroup', value: 'ProductGroup', dataType: 'text' }, { text: 'TargetGodown', value: 'TargetGodown', dataType: 'text' }, { text: 'TargetLedger', value: 'TargetLedger', dataType: 'text' },];

        $scope.para = {
            dateFrom: new Date(),
            dateTo: new Date(),
            BranchType: 0,
            VoucherType: 0,
            LedgerType: 0,
            LedgerId: 0,
            LedgerName: '',
            ItemDetailsColl: [],
            BranchId: 0,
            VoucherId: 0,
            VoucherName: '',
            Ledger: '',
            LedgerGroup: '',
            LedgerGroupId: 0,
            LedgerId: 0

        };

        $http({
            method: 'GET',
            url: base_url + "Setup/Security/GetAllBranchList",
            dataType: "json"
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.BranchTypeColl = res.data.Data;
                $('#cboVoucherType').select2({
                    placeholder: '*** Select Branch Type ***',
                    allowClear: true,
                    openOnEnter: true,
                    width: '100%',
                    multiple: false,
                    data: $scope.BranchTypeColl
                });

                $('#cboVoucherType').on("change", function (e) {
                    //$scope.gridOptions.columnApi.getColumnState();
                    //$scope.gridOptions.columnApi.applyColumnState({
                    //    state: window.colState,
                    //    applyOrder: true,
                    //});

                    var selectedData = $('#cboVoucherType').select2('data');
                    if (selectedData && selectedData.length > 0) {
                        $scope.para.BranchType = selectedData[0].id;
                        $scope.LoadReport();
                    } else {
                        $scope.para.BranchType = 0;
                    }

                });
            } else {
                Swal.fire(res.data.ResponseMSG);
            }

        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        getterAndSetter();

    }
    $http({
        method: 'GET',
        url: base_url + "Account/Reporting/GetAllVoucherList",
        dataType: "json"
    }).then(function (res) {
        if (res.data.IsSuccess && res.data.Data) {
            $scope.VoucherTypeColl = res.data.Data;
            $('#cboVoucher').select2({
                placeholder: '*** Select Voucher Type ***',
                allowClear: true,
                openOnEnter: true,
                width: '100%',
                multiple: false,
                data: $scope.VoucherTypeColl
            });

            $('#cboVoucher').on("change", function (e) {
                //$scope.gridOptions.columnApi.getColumnState();
                //$scope.gridOptions.columnApi.applyColumnState({
                //    state: window.colState,
                //    applyOrder: true,
                //});

                var selectedData = $('#cboVoucher').select2('data');
                if (selectedData && selectedData.length > 0) {
                    $scope.para.VoucherType = selectedData[0].id;
                    $scope.LoadReport();
                } else {
                    $scope.para.VoucherType = 0;
                }

            });
        } else {
            Swal.fire(res.data.ResponseMSG);
        }

    }, function (reason) {
        Swal.fire('Failed' + reason);
    });

    function getterAndSetter() {


        $scope.gridOptions = [];

        $scope.gridOptions = {
            showGridFooter: true,
            showColumnFooter: true,
            useExternalPagination: false,
            useExternalSorting: false,
            enableFiltering: true,
            enableSorting: true,
            enableRowSelection: true,
            enableSelectAll: true,
            enableGridMenu: true,
            showTreeExpandNoChildren: true,

            columnDefs: [
                {
                    name: "VoucherDate", displayName: "VoucherDate", width: 150, aggregationType: uiGridConstants.aggregationTypes.count,
                    headerCellClass: $scope.highlightFilteredHeader, headerCellClass: 'headerAligment', footerCellTemplate: '<div class="ui-grid-cell-contents" >ROWS: {{col.getAggregationValue() | number:0 }}</div>'
                },

                { name: "VoucherDateNP", field: "VoucherDateNP", filter: 'agNumberColumnFilter', width: 160, cellStyle: { 'text-align': 'center' }, valueFormatter: function (params) { return Numberformat(params.value); } },
                { name: "VoucherType", field: "VoucherType", filter: 'agNumberColumnFilter', width: 160, cellStyle: { 'text-align': 'left' }, valueFormatter: function (params) { return Numberformat(params.value); } },
                { name: "VoucherNo", field: "VoucherNo", filter: 'agNumberColumnFilter', width: 200, cellStyle: { 'text-align': 'center' }, valueFormatter: function (params) { return Numberformat(params.value); } },
                { name: "CrAmt", field: "CrAmt", filter: 'agNumberColumnFilter', width: 200, cellStyle: { 'text-align': 'right' }, valueFormatter: function (params) { return Numberformat(params.value); } },
                { name: "DrAmt", field: "DrAmt", filter: 'agNumberColumnFilter', width: 200, cellStyle: { 'text-align': 'right' }, valueFormatter: function (params) { return Numberformat(params.value); } },
                { name: "LedgerName", field: "LedgerName", filter: 'agNumberColumnFilter', width: 200, cellStyle: { 'text-align': 'left' }, valueFormatter: function (params) { return Numberformat(params.value); } },
                { name: "SenderName", field: "SenderName", filter: 'agNumberColumnFilter', width: 160, cellStyle: { 'text-align': 'left' }, valueFormatter: function (params) { return Numberformat(params.value); } },
                { name: "SenderMobileNo", field: "SenderMobileNo", filter: 'agNumberColumnFilter', width: 160, cellStyle: { 'text-align': 'center' }, valueFormatter: function (params) { return Numberformat(params.value); } },
                { name: "TransactionNo", field: "TransactionNo", filter: 'agNumberColumnFilter', width: 160, cellStyle: { 'text-align': 'center' }, valueFormatter: function (params) { return Numberformat(params.value); } },
                { name: "SenderId", field: "SenderId", filter: 'agNumberColumnFilter', width: 200, cellStyle: { 'text-align': 'left' }, valueFormatter: function (params) { return Numberformat(params.value); } },
                { name: "ReceiverName", field: "ReceiverName", filter: 'agNumberColumnFilter', width: 200, cellStyle: { 'text-align': 'left' }, valueFormatter: function (params) { return Numberformat(params.value); } },
                { name: "ReceiverId", field: "ReceiverId", filter: 'agNumberColumnFilter', width: 200, cellStyle: { 'text-align': 'left' }, valueFormatter: function (params) { return Numberformat(params.value); } },

            ],
            //   rowTemplate: rowTemplate(),
            exporterCsvFilename: 'Ledgerwise.csv',
            exporterPdfDefaultStyle: { fontSize: 9 },
            exporterPdfTableStyle: { margin: [30, 30, 30, 30] },
            exporterPdfTableHeaderStyle: { fontSize: 10, bold: true, italics: true, color: 'blue' },
            exporterPdfHeader: { text: "Dynamic Technosoft Pvt. Ltd. <br> Birgunj Nepal", style: 'headerStyle' },
            exporterPdfFooter: function (currentPage, pageCount) {
                return { text: currentPage.toString() + ' of ' + pageCount.toString(), style: 'footerStyle' };
            },
            exporterPdfCustomFormatter: function (docDefinition) {
                docDefinition.styles.headerStyle = { fontSize: 22, bold: true };
                docDefinition.styles.footerStyle = { fontSize: 10, bold: true };
                return docDefinition;
            },
            exporterPdfOrientation: 'portrait',
            exporterPdfPageSize: 'LETTER',
            exporterPdfMaxGridWidth: 500,
            exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
            exporterExcelFilename: 'daybook.xlsx',
            exporterExcelSheetName: 'DayBook',
            onRegisterApi: function (gridApi) {
                $scope.gridApi = gridApi;

                //$scope.gridApi.grid.registerRowsProcessor($scope.singleFilter, 200);

                // Setup events so we're notified when grid state changes.
                //$scope.gridApi.colMovable.on.columnPositionChanged($scope, saveState);
                //$scope.gridApi.colResizable.on.columnSizeChanged($scope, saveState);
                //  $scope.gridApi.grouping.on.aggregationChanged($scope, saveState);
                // $scope.gridApi.grouping.on.groupingChanged($scope, saveState);
                //$scope.gridApi.core.on.columnVisibilityChanged($scope, saveState);
                //$scope.gridApi.core.on.filterChanged($scope, saveState);
                //$scope.gridApi.core.on.sortChanged($scope, saveState);

            }
        };


        //$http({
        //    method: 'GET',
        //    url: base_url + "Global/GetListState?entityId=" + EntityId + "&isReport=true",
        //    dataType: "json"
        //}).then(function(res) {
        //    if (res.data.IsSuccess && res.data.Data) {
        //        if ($scope.gridApi) {
        //            if ($scope.gridApi.saveState) {
        //                var state = JSON.parse(res.data.Data);

        //                $scope.gridApi.saveState.restore($scope, state);
        //            }
        //        }
        //    } else {
        //        Swal.fire(res.data.ResponseMSG);
        //    }

        //}, function(reason) {
        //    Swal.fire('Failed' + reason);
        //});

$timeout(function () {
            GlobalServices.getListState(EntityId, $scope.gridOptions);
        });
		
    };

    //function saveState() {
    //    var state = $scope.gridApi.saveState.save();
    //  //  localStorageService.set('gridState', state);
    //}

    function rowTemplate() {    //custom rowtemplate to enable double click and right click menu options

        return '<div ng-dblclick="grid.appScope.rowDblClick(row)"  ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader }"  ui-grid-cell context-menu="grid.appScope.contextmenuOptions(row)"  data-target="myMenu" ></div>'

    }

    $scope.rowDblClick = function (row) {
        alert('Row double-clicked!\n' + 'Full Name  --> ' + row.entity.VoucherType + ' ' + row.entity.VoucherName)
        //add code here 

    };


    $scope.contextmenuOptions = function (row) {
        console.log("contextmenuOptions called");
        console.log(row);

        var contextMenuData = [];

        $scope.rightClickedRow = row;

        contextMenuData.push(['Show Document Of Selected Voucher', function () {
            alert('Menu Option1 clicked!\n' + 'Full Name -->' + row.entity.VoucherType + ' ' + row.entity.VoucherName)
        }]);

        contextMenuData.push(['Cancel Selected Voucher', function () {
            alert('Menu Option2 clicked!\n' + 'Full Name -->' + row.entity.VoucherType + ' ' + row.entity.VoucherName)

        }]);


        return contextMenuData
    }


    $scope.LoadReport = function () {

        // $scope.gridOptions.api.setRowData(null);
        $scope.gridOptions.data = [];
        $scope.loadingstatus = "running";
        showPleaseWait();

        $http({
            method: 'POST',
            url: base_url + "Account/Reporting/GetAllRemitDetails",
            dataType: "json",
            data: JSON.stringify($scope.para)
        }).then(function (res) {
            $scope.loadingstatus = "stop";
            hidePleaseWait();

            if (res.data.IsSuccess == true) {
                $scope.DataColl = res.data.Data;

                angular.forEach($scope.DataColl, function (dc) {
                    if (dc.IsParent)
                        dc.$$treeLevel = 0;
                });

                $timeout(function () {
                    $scope.$apply(function () {
                        //$scope.gridOptions.api.setRowData($scope.DataColl);
                        $scope.gridOptions.data = $scope.DataColl;
                    });
                });


            } else
                Swal.fire(res.data.ResponseMSG);


        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";

        });
    };

    $scope.saveRptListState = function () {
        var state = $scope.gridApi.saveState.save();

        $http({
            method: 'POST',
            url: base_url + "Global/SaveListState",
            headers: { 'Content-Type': undefined },

            transformRequest: function (data) {

                var formData = new FormData();
                formData.append("jsonData", JSON.stringify(data.jsonData));
                formData.append("entityId", EntityId);
                formData.append("isReport", true);

                return formData;
            },
            data: { jsonData: state }
        }).then(function (res) {

            $scope.loadingstatus = "stop";
            Swal.fire(res.data.ResponseMSG);

        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";

        });

    };
    $scope.DelListState = function () {
        GlobalServices.delListStateRpt(EntityId);
    }
    $scope.filter = function () {
        $scope.gridApi.grid.refresh();
    };

    $scope.singleFilter = function (renderableRows) {
        var matcher = new RegExp($scope.filterValue);
        renderableRows.forEach(function (row) {
            var match = false;
            row.grid.columns.forEach(function (field) {
                if (field.displayName.length > 0) {
                    if (row.entity[field.name].match(matcher)) {
                        match = true;
                    }
                }

            });
            if (!match) {
                row.visible = false;
            }
        });
        return renderableRows;
    };

    $scope.LedgerList = [];
    $http({
        method: 'GET',
        url: base_url + "Account/Reporting/GetAllLedgerList",
        dataType: "json",
    }).then(function (res) {
        if (res.data.IsSuccess && res.data.Data) {
            $scope.LedgerList = res.data.Data;
        }
    }, function (reason) {
        Swal.fire('Failed' + reason);
    });

    $scope.VoucherList = [];
    $http({
        method: 'GET',
        url: base_url + "Account/Reporting/GetAllVoucherList",
        dataType: "json",
    }).then(function (res) {
        if (res.data.IsSuccess && res.data.Data) {
            $scope.VoucherList = res.data.Data;
        }
    }, function (reason) {
        Swal.fire('Failed' + reason);
    });
    $scope.BranchList = [];
    $http({
        method: 'GET',
        url: base_url + "Setup/Security/GetAllBranchList",
        dataType: "json",
    }).then(function (res) {
        if (res.data.IsSuccess && res.data.Data) {
            $scope.BranchList = res.data.Data;
        }
    }, function (reason) {
        Swal.fire('Failed' + reason);
    });
    $scope.UserList = [];
    $http({
        method: 'GET',
        url: base_url + "Setup/Security/GetAllUserList",
        dataType: "json",
    }).then(function (res) {
        if (res.data.IsSuccess && res.data.Data) {
            $scope.UserList = res.data.Data;
        }
    }, function (reason) {
        Swal.fire('Failed' + reason);
    });
    $scope.LedgerGroupList = [];
    $http({
        method: 'GET',
        url: base_url + "Account/Reporting/GetAllLedgerGroup",
        dataType: "json",
    }).then(function (res) {
        if (res.data.IsSuccess && res.data.Data) {
            $scope.LedgerGroupList = res.data.Data;
        }
    }, function (reason) {
        Swal.fire('Failed' + reason);
    });
    $scope.GodownList = [];
    $http({
        method: 'GET',
        url: base_url + "Inventory/Reporting/GetAllGodownList",
        dataType: "json",
    }).then(function (res) {
        if (res.data.IsSuccess && res.data.Data) {
            $scope.GodownList = res.data.Data;
        }
    }, function (reason) {
        Swal.fire('Failed' + reason);
    });
    $scope.ProductList = [];
    $http({
        method: 'GET',
        url: base_url + "Inventory/Reporting/GetAllProduct",
        dataType: "json",
    }).then(function (res) {
        if (res.data.IsSuccess && res.data.Data) {
            $scope.ProductList = res.data.Data;
        }
    }, function (reason) {
        Swal.fire('Failed' + reason);
    });
    $scope.ProductTypeList = [];
    $http({
        method: 'GET',
        url: base_url + "Inventory/Reporting/GetAllProductType",
        dataType: "json",
    }).then(function (res) {
        if (res.data.IsSuccess && res.data.Data) {
            $scope.ProductTypeList = res.data.Data;
        }
    }, function (reason) {
        Swal.fire('Failed' + reason);
    });

    $scope.AddRowInItemDetails = function (ind, boolAuto) {

        if (boolAuto == true) {
            var len = $scope.para.ItemDetailsColl.length;
            if ((ind + 1) != len)
                return;

            var selectItem = $scope.para.ItemDetailsColl[ind];
            if (!selectItem.VoucherId || selectItem.VoucherId == null || selectItem.VoucherId == 0)
                return;

        }

        if ($scope.para.ItemDetailsColl) {
            if ($scope.para.ItemDetailsColl.length > ind + 1) {
                $scope.para.ItemDetailsColl.splice(ind + 1, 0, {
                    dateFrom: new Date(),
                    dateTo: new Date(),
                    voucherType: 0,
                    LedgerId: 0,
                    LedgerName: '',
                    ItemDetailsColl: [],
                    BranchId: 0,
                    VoucherId: 0,
                    VoucherName: '',
                })
            } else {
                $scope.para.ItemDetailsColl.push({
                    dateFrom: new Date(),
                    dateTo: new Date(),
                    voucherType: 0,
                    LedgerId: 0,
                    LedgerName: '',
                    ItemDetailsColl: [],
                    BranchId: 0,
                    VoucherId: 0,
                    VoucherName: '',
                })
            }
        }

    }

    $scope.delRowFromItemDetails = function (ind) {
        if ($scope.para.ItemDetailsColl) {
            if ($scope.para.ItemDetailsColl.length > 1) {
                $scope.para.ItemDetailsColl.splice(ind, 1);
            }
        }
    }
    $scope.PrintVoucher = function (tranId, vid) {
        $scope.lastTranId = tranId;
        $scope.lastVoucherId = vid;
        $scope.Print();
    }
    $scope.Print = function () {
        if ($scope.lastTranId || $scope.lastVoucherId > 0) {
            var TranId = $scope.lastTranId;

            var vId = $scope.lastVoucherId;

            $http({
                method: 'GET',
                url: base_url + "ReportEngine/GetReportTemplates?entityId=" + EntityId + "&voucherId=" + vId + "&isTran=true",
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
                        var printDone = false;
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
                                            printDone = true;

                                            if (rptTranId > 0) {
                                                document.body.style.cursor = 'wait';
                                                document.getElementById("frmRpt").src = '';
                                                document.getElementById("frmRpt").src = base_url + "web/ReportViewer.aspx?rpttranid=" + rptTranId + "&istransaction=true&entityid=" + EntityId + "&voucherid=" + $scope.SelectedVoucher.VoucherId + "&tranid=" + TranId + "&vouchertype=" + VoucherType;
                                                document.body.style.cursor = 'default';
                                                $('#FrmPrintReport').modal('show');
                                            }
                                        } else {
                                            resolve('You need to select:)')
                                        }
                                    })
                                }
                            })
                        }

                        if (rptTranId > 0) {
                            document.body.style.cursor = 'wait';
                            document.getElementById("frmRpt").src = '';
                            document.getElementById("frmRpt").src = base_url + "web/ReportViewer.aspx?rpttranid=" + rptTranId + "&istransaction=true&entityid=" + EntityId + "&voucherid=" + $scope.SelectedVoucher.VoucherId + "&tranid=" + TranId + "&vouchertype=" + VoucherType;
                            document.body.style.cursor = 'default';
                            $('#FrmPrintReport').modal('show');
                        }

                    } else
                        Swal.fire('No Templates found for print');
                }
            }, function (reason) {
                Swal.fire('Failed' + reason);
            });



        }
    };
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
                down_file(base_url + "//" + res.data.Data.ResponseId, "SalesReturnRegister.xlsx");
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