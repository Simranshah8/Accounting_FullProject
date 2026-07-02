"use strict";

agGrid.initialiseAgGridWithAngular1(angular);

app.controller("costCenterAnalysisCtrl", function ($scope, $http, $filter, $timeout, GlobalServices, $compile) {
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
       
 $scope.GenConfig = {};
        GlobalServices.getGenConfig().then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.GenConfig = res.data.Data;
                PrintPreviewAs = $scope.GenConfig.PrintPreviewAs;
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
            if (res.data.IsSuccess && res.data.Data) {
                $scope.BranchList = res.data.Data;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        $scope.ProductGroupSummary = {
            DateFrom_TMP: new Date(),
            DateTo_TMP: new Date(),
            branchId: null,
            ledgerId: null,
            costCenterId:null
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
         
        var columnDefs = [

            { headerName: "Branch", width: 210, field: "Branch", cellStyle: { 'text-align': 'left' }, pinned: 'left', datatype:'string' },
            { headerName: "Ledger", width: 140, field: "Ledger", cellStyle: { 'text-align': 'left' }, pinned: 'left', datatype: 'string' },
            { headerName: "Cost Center", width: 160, field: "CostCenter", cellStyle: { 'text-align': 'left' }, datatype: 'string', pinned: 'left' },
            
            { headerName: "Debit", width: 160, field: "Debit", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, datatype: 'double' },
            { headerName: "Credit", width: 160, field: "Credit", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, datatype: 'double' },

            { headerName: "Voucher No", width: 120, field: "VoucherNo", cellStyle: { 'text-align': 'left', datatype: 'string' } },
            { headerName: "Brand", width: 110, field: "Brand", cellStyle: { 'text-align': 'left', datatype: 'string' } },
            { headerName: "Area", width: 170, field: "Area", cellStyle: { 'text-align': 'left' }, datatype: 'string' },
            { headerName: "Department", width: 140, field: "Department", cellStyle: { 'text-align': 'left' }, datatype: 'string' },
            { headerName: "LedgerGroup", width: 140, field: "LedgerGroup", cellStyle: { 'text-align': 'left' }, datatype: 'string' },
            { headerName: "Category", width: 120, field: "Category", cellStyle: { 'text-align': 'left' }, datatype: 'string' },
            { headerName: "Date", width: 120, field: "VoucherDate", cellStyle: { 'text-align': 'left' }, datatype: 'date' },
            { headerName: "Miti", width: 120, field: "VoucherMiti", cellStyle: { 'text-align': 'left' }, datatype: 'string' },
            { headerName: "Voucher", width: 120, field: "Voucher", cellStyle: { 'text-align': 'left' }, datatype: 'string' },
            { headerName: "VoucherType", width: 120, field: "VoucherType", cellStyle: { 'text-align': 'left' }, datatype: 'string' },
      
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
            columnDefs: columnDefs,
            rowData: null,
            filter: true,
            suppressHorizontalScroll: true,
            alignedGrids: [],
            enableFilter: true,

            onFilterChanged: function () {
                var dt = {
                    Debit: 0,
                    Credit: 0,                    
                };

                $scope.gridOptions.api.forEachNodeAfterFilterAndSort(function (node) {
                    var fData = node.data;
                    dt.Debit += fData.Debit;
                    dt.Credit += fData.Credit; 
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
            columnDefs: columnDefs,
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
        $scope.AnalysisCollDefs.push({ name: 'Y_BS', caption: 'Y_BS' });
        $scope.AnalysisCollDefs.push({ name: 'M_BS', caption: 'M_BS' });
        $scope.AnalysisCollDefs.push({ name: 'Amt', caption: 'Amt', aggregateFunc: 'sum', formatFunc: function (val) { return $filter('formatNumber')(val); } });

        angular.forEach(columnDefs, function (cln) {
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


        $scope.AnalysisCollDefs.push({ name: 'DrCr', caption: 'DrCr' }); 
$timeout(function () {
            GlobalServices.getListState(EntityId, $scope.gridOptions);
        });
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

        $scope.DataColl = [];

        if ($scope.gridOptions.api)
            $scope.gridOptions.api.setRowData($scope.DataColl);
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
            dataSource: $scope.DataColl,
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
            branchId: $scope.ProductGroupSummary.branchId,
            ledgerId: $scope.ProductGroupSummary.ledgerId,
            costCenterId:$scope.ProductGroupSummary.costCenterId
        };

        $scope.loadingstatus = 'running';
        showPleaseWait();

        $http({
            method: "POST",
            url: base_url + "Account/Reporting/GetCostCenterAnalysis",
            data: JSON.stringify(beData),
            dataType: "json"
        }).then(function (res) {

            $scope.loadingstatus = 'stop';
            hidePleaseWait();

            if (res.data.IsSuccess && res.data.Data) {
                var DataColl = mx(res.data.Data);
                $scope.DataColl = res.data.Data;

                $scope.dataForBottomGrid[0].Debit = DataColl.sum(p1 => p1.Debit);
                $scope.dataForBottomGrid[0].Credit = DataColl.sum(p1 => p1.Credit);
                
                $scope.gridOptionsBottom.api.setRowData($scope.dataForBottomGrid);
                $scope.gridOptions.api.setRowData(res.data.Data);
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
                down_file(base_url + "//" + res.data.Data.ResponseId, "costCenterAnalysis.xlsx");
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
