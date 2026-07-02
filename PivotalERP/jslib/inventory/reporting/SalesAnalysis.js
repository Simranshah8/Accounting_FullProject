"use strict";

agGrid.initialiseAgGridWithAngular1(angular);

app.controller("salesAnalysisController", function ($scope, $http, $filter, $timeout, GlobalServices, $compile) {

  var PrintPreviewAs = 1;
    const contextMenu = GlobalServices.createElementForMenu();
	
    LoadData();

    $scope.onBtExportCSV = function () {
        var params = {
            fileName: 'Sales.csv',
            sheetName: 'Sales'
        };

        $scope.gridOptions.api.exportDataAsCsv(params);
    }

    $scope.onFilterTextBoxChanged = function () {
        $scope.gridOptions.api.setQuickFilter($scope.search);
    }

    function LoadData() {
        $('.select2').select2({
            allowClear: true,
            openOnEnter: true
        });
       
         
        $scope.ProductGroupSummary = {
            DateFrom_TMP: new Date(),
            DateTo_TMP: new Date(),        
        };


        $timeout(function () {
            GlobalServices.getCompanyDet().then(function (res) {
                var comDet = res.data.Data;
                if (comDet) {
                    $scope.ProductGroupSummary.DateFrom_TMP = new Date(comDet.StartDate);
                }
            }, function (errormessage) {
                alert('Unable to Delete data. pls try again.' + errormessage.responseText);
            });
        });

    
        $scope.ReportName = '';
        $scope.noofdecimal = 2;

        $scope.loadingstatus = "stop";
         
        $scope.columnDefs = [

            { headerName: "Branch", width: 210, field: "Branch", cellStyle: { 'text-align': 'left' }, pinned: 'left', datatype:'string' },
            { headerName: "Product", width: 140, field: "PName", cellStyle: { 'text-align': 'left' }, pinned: 'left', datatype: 'string' },            
            { headerName: "Party", width: 160, field: "Party", cellStyle: { 'text-align': 'left' }, datatype: 'string' },
            { headerName: "Pan Vat", width: 120, field: "PanVat", cellStyle: { 'text-align': 'left' }, datatype: 'string' },
            { headerName: "Bank Name", width: 150, field: "BankName", cellStyle: { 'text-align': 'left' }, datatype: 'string' },
            { headerName: "Account No.", width: 160, field: "AccountNo", cellStyle: { 'text-align': 'left' }, datatype: 'string' },
            { headerName: "Transaction Agent", width: 120, field: "TAgent", cellStyle: { 'text-align': 'left' }, datatype: 'string' },            
            { headerName: "Actual Sales Qty.", width: 160, field: "Qty", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, datatype: 'double' },
            { headerName: "Actual Sales Amt.", width: 160, field: "Amt", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, datatype: 'double' },
            { headerName: "Sales Qty.", width: 160, field: "OutQty", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, datatype: 'double' },
            { headerName: "Sales Amt.", width: 160, field: "OutAmt", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, datatype: 'double' },
            { headerName: "Return Qty.", width: 160, field: "InQty", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, datatype: 'double' },
            { headerName: "Return Amt.", width: 160, field: "InAmt", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, datatype: 'double' },
            { headerName: "Product Group", width: 120, field: "PGroup", cellStyle: { 'text-align': 'left', datatype: 'string' } },
            { headerName: "Brand", width: 110, field: "Brand", cellStyle: { 'text-align': 'left', datatype: 'string' } },
            { headerName: "Product Type", width: 170, field: "PType", cellStyle: { 'text-align': 'left' }, datatype: 'string' },
            { headerName: "Party Group", width: 140, field: "PartyGroup", cellStyle: { 'text-align': 'left' }, datatype: 'string' },
            { headerName: "Party Agent", width: 140, field: "PAgent", cellStyle: { 'text-align': 'left' }, datatype: 'string' },
            { headerName: "Sales Ledger", width: 120, field: "SalesLedger", cellStyle: { 'text-align': 'left' }, datatype: 'string' },
            { headerName: "Party CostCenter", width: 120, field: "PC", cellStyle: { 'text-align': 'left' }, datatype: 'string' },
            { headerName: "Tran. CostCenter", width: 120, field: "TC", cellStyle: { 'text-align': 'left' }, datatype: 'string' },
        ];


        $scope.gridOptions = {
			onCellContextMenu: onCellContextMenu, // Handle right-click event
            defaultColDef: {
                filter: true,
                resizable: true,
                sortable: true,
                width: 100,


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
            suppressHorizontalScroll: true,
            alignedGrids: [],
            enableFilter: true,

            onFilterChanged: function () {
                var dt = {
                    InQty: 0,
                    InAmt: 0,
                    OutQty: 0,
                    OutAmt: 0,
                    Qty: 0,
                    Amt: 0,                    
                };

                $scope.gridOptions.api.forEachNodeAfterFilterAndSort(function (node) {
                    var fData = node.data;
                    dt.InQty += fData.InQty;
                    dt.InAmt += fData.InAmt;
                    dt.OutQty += fData.OutQty;
                    dt.OutAmt += fData.OutAmt;
                    dt.Qty += fData.Qty;
                    dt.Amt += fData.Amt; 
                });

                var filerDataColl = [];
                filerDataColl.push(dt);
                $scope.gridOptionsBottom.api.setRowData(filerDataColl);
            }

        };
        $scope.eGridDiv = document.querySelector('#datatable');

        // create the grid passing in the div to use together with the columns & data we want to use
        new agGrid.Grid($scope.eGridDiv, $scope.gridOptions);

        $scope.dataForBottomGrid = [
            {
                AutoNumber: '',
                PName: 'Total =>',
                BalanceAmt: 0,
                Rate: '',
            }];

        $scope.gridOptionsBottom = {
            defaultColDef: {
                resizable: true,
                width: 90
            },
            columnDefs: $scope.columnDefs,
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


        $scope.AnalysisCollDefs = [];        
        angular.forEach($scope.columnDefs, function (cln) {
            if (cln.datatype == "string")
                $scope.AnalysisCollDefs.push({ name: cln.field, caption: cln.headerName });
            else if (cln.datatype == "int32" || cln.datatype == "int64")
                $scope.AnalysisCollDefs.push({ name: cln.field, caption: cln.headerName, aggregateFunc: 'sum', formatFunc: function (val) { return $filter('formatNumber')(val); } });
            else if (cln.datatype == "double" || cln.datatype == "float" || cln.datatype == "decimal")
                $scope.AnalysisCollDefs.push({
                    name: cln.field, caption: cln.headerName,
                    dataSettings: {
                        aggregateFunc: 'sum',
                        formatFunc: function (value) { 
                            return Number(value).toFixed(0);
                        }
                    }
                });
            else if (cln.datatype == "datetime" || cln.datatype == "date")
                $scope.AnalysisCollDefs.push({ name: cln.field, caption: cln.headerName });
            else
                $scope.AnalysisCollDefs.push({ name: cln.field, caption: cln.headerName });
        });
		
		 $timeout(function () {
            GlobalServices.getListState(EntityId, $scope.gridOptions);
        });


        $scope.RefTableColColl = GlobalServices.getRptTableColColl();
        GetCustomRptColumns();
    }
     

    $scope.ClearData = function () {
         
        $scope.dataForBottomGrid[0].InQty = 0;
        $scope.dataForBottomGrid[0].OutQty = 0;
        $scope.dataForBottomGrid[0].OutAmt = 0;
        $scope.dataForBottomGrid[0].OutQty = 0;
        $scope.dataForBottomGrid[0].Qty = 0;
        $scope.dataForBottomGrid[0].Amt = 0;
        $scope.dataForBottomGrid[0].InAmt = 0; 

        if ($scope.gridOptionsBottom.api)
            $scope.gridOptionsBottom.api.setRowData($scope.dataForBottomGrid);

        $scope.RptDataColl = [];

        if ($scope.gridOptions.api)
            $scope.gridOptions.api.setRowData($scope.RptDataColl);
    };

    $scope.ShowAnalysis = function () {


        var oldState = {
            rowFields: [],
            columnFields: [],
            rowSettings: {
                subTotal: {
                    visible: true,
                    collapsed: true,
                    collapsible: true
                }
            },
            columnSettings: {
                subTotal: {
                    visible: true,
                    collapsed: true,
                    collapsible: true
                }
            }
        };

        var config = {
            dataSource: $scope.RptDataColl,
            canMoveFields: true,
            dataHeadersLocation: 'columns',
            width: 1099,
            height: 611,
            theme: 'green',
            toolbar: {
                visible: true
            },
            grandTotal: {
                rowsvisible: true,
                columnsvisible: true
            },
            subTotal: {
                visible: true,
                collapsed: true,
                collapsible: true
            },
            rowFields: oldState.rowFields,
            columnFields: oldState.columnFields,
            rowSettings: oldState.rowSettings,
            columnSettings: oldState.columnSettings,
            fields: $scope.AnalysisCollDefs,
            rows: oldState.rowFields,
            columns: oldState.columnFields,
            data: oldState.dataFields
            //rows: ['Manufacturer'],//, 'Category' ],
            //columns: ['Class', 'Category'],
            //data: ['Quantity', 'Amount']                       
        };

        var elem = document.getElementById('dtAnalysis')

        $scope.pgridwidget = new orb.pgridwidget(config);
        $scope.pgridwidget.render(elem);


        $('#frmRptAnalysis').modal('show');
    }
    $scope.GetProductGroupSummary = function () {

        $scope.ClearData();
         
        var dateFrom = new Date(($filter('date')(new Date(), 'yyyy-MM-dd')));
        var dateTo = new Date(($filter('date')(new Date(), 'yyyy-MM-dd')));

        if ($scope.ProductGroupSummary.DateFromDet)
            dateFrom = new Date(($filter('date')($scope.ProductGroupSummary.DateFromDet.dateAD, 'yyyy-MM-dd')));

        if ($scope.ProductGroupSummary.DateToDet)
            dateTo = new Date(($filter('date')($scope.ProductGroupSummary.DateToDet.dateAD, 'yyyy-MM-dd')));
         

        var beData = {
            dateFrom: dateFrom,
            dateTo: dateTo,          
        };

        $scope.loadingstatus = 'running';
        showPleaseWait();

        $http({
            method: "POST",
            url: base_url + "Inventory/Reporting/GetSalesAnalysis",
            data: JSON.stringify(beData),
            dataType: "json"
        }).then(function (res) {

            $scope.loadingstatus = 'stop';
            hidePleaseWait();

            if (res.data.IsSuccess && res.data.Data) {

                if (res.data.Data.length > 0) {
                    $scope.RptDataColl = res.data.Data;
                    $scope.ForCustomColumn = $scope.RptDataColl[0];
                }

                if ($scope.CustomRptColumn && $scope.CustomRptColumn.TranId > 0) {

                    $timeout(function () {
                        $scope.GetCustomColData();
                    });

                }
                else {

                    var DataColl = mx(res.data.Data);
                    
                    $scope.dataForBottomGrid[0].InQty = DataColl.sum(p1 => p1.InQty);
                    $scope.dataForBottomGrid[0].InAmt = DataColl.sum(p1 => p1.InAmt);
                    $scope.dataForBottomGrid[0].OutQty = DataColl.sum(p1 => p1.OutQty);
                    $scope.dataForBottomGrid[0].OutAmt = DataColl.sum(p1 => p1.OutAmt);
                    $scope.dataForBottomGrid[0].Qty = DataColl.sum(p1 => p1.Qty);
                    $scope.dataForBottomGrid[0].Amt = DataColl.sum(p1 => p1.Amt);


                    $scope.gridOptionsBottom.api.setRowData($scope.dataForBottomGrid);
                    $scope.gridOptions.api.setRowData($scope.RptDataColl);
                }
            } else
                alert(res.data.ResponseMSG);

        }, function (reason) {
            $scope.loadingstatus = "stop";
            alert('Failed' + reason);
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
                                                        Period: $scope.ProductGroupSummary.DateFromDet.dateBS + " TO " + $scope.ProductGroupSummary.DateToDet.dateBS,
                                                        ProductGroup: '',
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
                                    Period: $scope.ProductGroupSummary.DateFromDet.dateBS + " TO " + $scope.ProductGroupSummary.DateToDet.dateBS,
                                    ProductGroup: '',
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
                down_file(base_url + "//" + res.data.Data.ResponseId, "salesAnalysis.xlsx");
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


    function GetCustomRptColumns() {
        $scope.CustomRptColumn = {
            Qry: '',
            ColumnList: '',
            MapColl: [],
        };

        GlobalServices.getCustomRptColumns(EntityId).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.CustomRptColumn = res.data.Data;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

    }
    $scope.RefTableRows = [];
    $scope.SourceColColl = [];
    $scope.ShowCustomColumns = function () {
        if (!$scope.RefTableRows || $scope.RefTableRows.length == 0) {
            $scope.RefTableRows = [];

            if ($scope.CustomRptColumn && $scope.CustomRptColumn.TranId > 0) {
                $scope.CustomRptColumn.MapColl.forEach(function (cc) {
                    $scope.RefTableRows.push(cc);
                });
            } else {
                $scope.RefTableRows.push({});
            }

        }

        if (!$scope.SourceColColl || $scope.SourceColColl.length == 0) {
            $scope.SourceColColl = [];
            for (var v in $scope.ForCustomColumn) {
                $scope.SourceColColl.push({
                    name: v,
                    text: v,
                });
            }
        }

        if ($scope.SourceColColl.length > 0) {
            $('#frmCustomColumns').modal('show');
        }
    }

    $scope.AddRowIntoRefTblRow = function (ind) {
        $scope.RefTableRows.splice(ind + 1, 0, {});
    };
    $scope.delRowIntoRefTblRow = function (ind) {
        $scope.RefTableRows.splice(ind, 1);
    };

    $scope.OkRefTableRows = function () {
        $scope.CustomRptColumn.EntityId = EntityId;
        $scope.CustomRptColumn.ColumnList = '';
        $scope.CustomRptColumn.MapColl = [];

        $scope.RefTableRows.forEach(function (r) {
            if (r.RefColName && r.SourceColName && r.RefColName.length > 0 && r.SourceColName.length > 0) {
                $scope.CustomRptColumn.MapColl.push({
                    SNo: 0,
                    ColName: r.ColName,
                    RefColName: r.RefColName,
                    SourceColName: r.SourceColName,
                    Formula: r.Formula,
                });
            }
            else if (r.ColName && r.Formula && r.ColName.length > 0 && r.Formula.length > 0) {
                $scope.CustomRptColumn.MapColl.push({
                    SNo: 0,
                    ColName: r.ColName,
                    RefColName: r.RefColName,
                    SourceColName: r.SourceColName,
                    Formula: r.Formula,
                });
            }
        });

        var tmpDataColl = [];
        $scope.RptDataColl.forEach(function (rptRow) {
            var newRow = {};
            var hasValue = false;
            $scope.RefTableRows.forEach(function (r) {
                if (r.RefColName && r.SourceColName) {
                    if (r.RefColName.length > 0 && r.SourceColName.length > 0) {
                        newRow[r.RefColName] = rptRow[r.SourceColName];
                        hasValue = true;
                    }
                }
            });

            if (hasValue == true) {
                tmpDataColl.push(newRow);
            }
        });


        $http({
            method: 'POST',
            url: base_url + "Global/GetCustomColForRpt",
            headers: { 'Content-Type': undefined },

            transformRequest: function (data) {
                var formData = new FormData();
                formData.append("customData", angular.toJson(data.jsonData));
                formData.append("qry", $scope.CustomRptColumn.Qry);
                return formData;
            },
            data: { jsonData: tmpDataColl }
        }).then(function (res) {

            $scope.loadingstatus = "stop";
            hidePleaseWait();
            if (res.data.IsSuccess == true) {

                if (res.data.Data && res.data.Data.length > 0) {
                    var fstRow = res.data.Data[0];
                    for (var fr in fstRow) {

                        if (fr != 'RptSNo') {
                            if ($scope.CustomRptColumn.ColumnList.length > 0)
                                $scope.CustomRptColumn.ColumnList = $scope.CustomRptColumn.ColumnList + ',';

                            $scope.CustomRptColumn.ColumnList = $scope.CustomRptColumn.ColumnList + fr;
                        }
                    }

                    $http({
                        method: 'POST',
                        url: base_url + "Global/SaveCustomColForRpt",
                        headers: { 'Content-Type': undefined },

                        transformRequest: function (data) {

                            var formData = new FormData();
                            formData.append("customData", angular.toJson(data.jsonData));

                            return formData;
                        },
                        data: { jsonData: $scope.CustomRptColumn }
                    }).then(function (res1) {

                        $scope.loadingstatus = "stop";
                        hidePleaseWait();
                        if (res1.data.IsSuccess == true) {
                            $('#frmCustomColumns').modal('hide');
                        }
                        else {
                            Swal.fire(res1.data.ResponseMSG);
                        }
                    }, function (errormessage) {
                        hidePleaseWait();
                        $scope.loadingstatus = "stop";

                    });
                }
            }
            else if (res.data.IsSuccess != undefined) {
                Swal.fire(res.data.ResponseMSG);
            }

        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";

        });
    }

    $scope.GetCustomColData = function () {

        var tmpDataColl = [];
        if ($scope.CustomRptColumn.Qry && $scope.CustomRptColumn.Qry.length > 0) {
            var sno = 1;
            $scope.RptDataColl.forEach(function (rptRow) {
                var newRow = {};
                var hasValue = false;
                newRow.RptSNo = sno;
                $scope.CustomRptColumn.MapColl.forEach(function (r) {
                    if (r.RefColName && r.SourceColName) {
                        if (r.RefColName.length > 0 && r.SourceColName.length > 0) {
                            newRow[r.RefColName] = rptRow[r.SourceColName];
                            hasValue = true;
                        }
                    }
                });

                if (hasValue == true) {
                    tmpDataColl.push(newRow);
                }

                sno++;
            });
        }


        var tmpNewColl = [];
        if ($scope.CustomRptColumn.ColumnList) {
            $scope.CustomRptColumn.ColumnList.split(',').forEach(function (col) {
                tmpNewColl.push(col);
            });
        }

        var tmpCustColColl = [];
        if ($scope.CustomRptColumn.MapColl) {
            $scope.CustomRptColumn.MapColl.forEach(function (mc) {
                if (mc.Formula.length > 0) {
                    mc.FormulaColumnColl = extractStringVariables(mc.Formula);
                    tmpCustColColl.push(mc);
                }
            });
        }

        if ($scope.CustomRptColumn.Qry && $scope.CustomRptColumn.Qry.length > 0) {
            $http({
                method: 'POST',
                url: base_url + "Global/GetCustomColForRpt",
                headers: { 'Content-Type': undefined },

                transformRequest: function (data) {
                    var formData = new FormData();
                    formData.append("customData", angular.toJson(data.jsonData));
                    formData.append("qry", $scope.CustomRptColumn.Qry);
                    return formData;
                },
                data: { jsonData: tmpDataColl }
            }).then(function (res) {

                $scope.loadingstatus = "stop";
                hidePleaseWait();
                if (res.data.IsSuccess == true) {
                    if (res.data.Data && res.data.Data.length > 0) {
                        if (tmpNewColl.length > 0) {
                            res.data.Data.forEach(function (nRow) {
                                var findRow = $scope.RptDataColl[nRow.RptSNo - 1];
                                if (findRow) {
                                    tmpNewColl.forEach(function (r) {
                                        findRow[r] = nRow[r];
                                    });
                                }
                            });
                        }


                        if (tmpCustColColl.length > 0) {
                            $scope.RptDataColl.forEach(function (findRow) {
                                tmpCustColColl.forEach(function (cc) {
                                    var formula = cc.Formula;
                                    try {

                                        cc.FormulaColumnColl.forEach(function (fc) {
                                            var pval = isEmptyAmt(findRow[fc]);
                                            formula = formula.replaceAll(fc, pval);
                                        });

                                        var nVal = math.evaluate(formula);
                                        findRow[cc.ColName] = isEmptyAmt(nVal);
                                    } catch { }

                                });

                            });
                        }


                        /**** Start Data Load into List *****/

                        var qryColumnDefs = mx($scope.columnDefs);

                        tmpNewColl.forEach(function (col) {
                            var find = qryColumnDefs.firstOrDefault(p1 => p1.field == col);
                            if (find == null) {
                                var newCol = { headerName: col, width: 140, field: col, cellStyle: { 'text-align': 'left' } };
                                $scope.columnDefs.push(newCol);
                            }

                        });

                        tmpCustColColl.forEach(function (mc) {
                            if (mc.ColName && mc.ColName.length > 0) {

                                var find = qryColumnDefs.firstOrDefault(p1 => p1.field == mc.ColName);
                                if (find == null) {
                                    var newCol = { headerName: mc.ColName, width: 140, field: mc.ColName, cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } };
                                    $scope.columnDefs.push(newCol);
                                }
                            }
                        });

                        $scope.gridOptionsBottom.columnDefs = $scope.columnDefs;
                        $scope.gridOptionsBottom.api.setColumnDefs($scope.columnDefs);

                        $scope.gridOptions.columnDefs = $scope.columnDefs;
                        $scope.gridOptions.api.setColumnDefs($scope.columnDefs);
                         
                        $scope.gridOptions.api.setRowData($scope.RptDataColl);

                    }
                }
                else if (res.data.IsSuccess != undefined) {
                    Swal.fire(res.data.ResponseMSG);
                }

            }, function (errormessage) {
                hidePleaseWait();
                $scope.loadingstatus = "stop";

            });
        }
        else {

            if (tmpCustColColl.length > 0) {
                $scope.RptDataColl.forEach(function (findRow) {
                    tmpCustColColl.forEach(function (cc) {
                        var formula = cc.Formula;
                        try {

                            cc.FormulaColumnColl.forEach(function (fc) {
                                var pval = isEmptyAmt(findRow[fc]);
                                formula = formula.replaceAll(fc, pval);
                            });

                            var nVal = math.evaluate(formula);
                            findRow[cc.ColName] = isEmptyAmt(nVal);
                        } catch { }

                    });

                });
            }

            var qryColumnDefs = mx($scope.columnDefs);
            tmpCustColColl.forEach(function (mc) {
                if (mc.ColName && mc.ColName.length > 0) {

                    var find = qryColumnDefs.firstOrDefault(p1 => p1.field == mc.ColName);
                    if (find == null) {
                        var newCol = { headerName: mc.ColName, width: 140, field: mc.ColName, cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } };
                        $scope.columnDefs.push(newCol);
                    }
                }
            });

            $scope.gridOptionsBottom.columnDefs = $scope.columnDefs;
            $scope.gridOptionsBottom.api.setColumnDefs($scope.columnDefs);

            $scope.gridOptions.columnDefs = $scope.columnDefs;
            $scope.gridOptions.api.setColumnDefs($scope.columnDefs);
             
            $scope.gridOptions.api.setRowData($scope.RptDataColl);
             

        }

    }


    // Hide context menu when clicking outside
    document.addEventListener('click', function () {
        if (contextMenu.contains(event.target)) {
            return;
        }
        contextMenu.style.display = 'none';
    });

    $(document).ready(function () {
        $(this).bind("contextmenu", function (e) {
            e.preventDefault();
        });
    });

});
