"use strict";

agGrid.initialiseAgGridWithAngular1(angular);

app.controller("PurchaseAnalysisProductWise", function ($scope, $http, $filter, $timeout, GlobalServices, $compile) {

    var PrintPreviewAs = 1;
    const contextMenu = GlobalServices.createElementForMenu();
    LoadData();

    $scope.onBtExportCSV = function () {
        var params = {
            fileName: 'PurchaseAnalysisProductWise.csv',
            sheetName: 'PurchaseAnalysisProductWise'
        };

        $scope.gridOptions.api.exportDataAsCsv(params);
    }

    function LoadData() {
        $('.select2').select2({
            allowClear: true,
            openOnEnter: true
        });


        //Search Drop DownList
        $scope.VoucherSearchOptions = [{ text: 'ProductName', value: 'ProductName', dataType: 'Text' },
        { text: 'PartNo', value: 'PartNo', dataType: 'Number' },
        { text: 'Code', value: 'Code', dataType: 'Number' },
        { text: 'Group Name', value: 'ProductGroupName', dataType: 'Text' },
        { text: 'CategoriesName', value: 'ProductCategories', dataType: 'text' },
        { text: 'Return Qty', value: 'InQty', dataType: 'Number' },
        { text: 'Purchase Qty', value: 'OutQty', dataType: 'Number' },
        { text: 'Purchase Qty(AI.Value1)', value: 'OutQty1', dataType: 'Number' },
        { text: 'Purchase Qty(AI.Value2)', value: 'OutQty2', dataType: 'Number' },
        { text: 'Return Qty(AI.Value2)', value: 'InQty2', dataType: 'Number' },
        { text: 'Return Qty(AI.Value2)', value: 'InQty2', dataType: 'Number' },
        { text: 'Purchase rate', value: 'OutRate', dataType: 'Number' },
        { text: 'Purchase Amt', value: 'OutAmt', dataType: 'Number' },
        { text: 'Net Purchase Qty', value: 'BalanceQty', dataType: 'Number' },
        { text: 'Unit', value: 'Unit', dataType: 'text' },
        { text: 'Net Qty(AI.Value1)', value: 'AuName1', dataType: 'Number' },
        { text: 'Net Qty(AI.Value2)', value: 'AuName2', dataType: 'Number' },
        { text: 'Net Purchase Rate', value: 'BalanceRate', dataType: 'Number' },
        { text: 'Net Purchase Amt', value: 'BalanceAmt', dataType: 'Number' },
        ];

        //Filter Dialog Box Details 
        $scope.BranchTypeColl = [];
        $scope.VoucherTypeColl = [];
        $scope.LedgerGroupTypeColl = [];
        $scope.ExpressionColl = GlobalServices.getExpression();
        $scope.ConditionColl = GlobalServices.getLogicCondition();
        $scope.FilterColumnColl = [{ text: 'InAmt', value: 'InAmt', dataType: 'Number' },
        { text: 'InQty ', value: 'InQty', dataType: 'Number' },
        { text: 'OutAmt', value: 'OutAmt', dataType: 'Number' },
        { text: 'OutQty', value: 'OutQty', dataType: 'Number' },
        { text: 'BalanceAmt', value: 'BalanceAmt', dataType: 'Number' },
        { text: 'BalanceQty', value: 'BalanceQty', dataType: 'Number' },
        { text: 'Unit ', value: 'Unit', dataType: 'text' },
        { text: 'ProductName ', value: 'ProductName', dataType: 'text' },
        { text: 'PartNo', value: 'PartNo', dataType: 'Number' },
        { text: 'Product GroupName', value: 'ProductGroupName', dataType: 'text' },
        { text: 'Product Categories', value: 'ProductCategories', dataType: 'text' },];




        $scope.PurchaseAnalysisProductWise = {
            DateFrom_TMP: new Date(),
            DateTo_TMP: new Date(),
            VoucherId: 0,
            IsPost: true,

            BranchId: 0
        };


        $scope.loadingstatus = "stop";

        $scope.columnDefs = [

            { headerName: "ProductName", width: 180, dataType: 'Text', pinned: 'left', field: "ProductName", cellStyle: { 'text-align': 'left' } },
            { headerName: "PartNo", width: 130, field: "PartNo", dataType: 'Number', pinned: 'left', cellStyle: { 'text-align': 'right' } },
            { headerName: "Code", width: 130, field: "Code", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "GroupName", width: 200, field: "ProductGroupName", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "Categories Name", width: 250, field: "ProductCategories", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "Return Qty", width: 130, field: "InQty", cellStyle: { 'text-align': 'left' }, dataType: 'Number', filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },
            { headerName: "Purchase Qty(AI.Value 1)", width: 250, field: "OutQty1", dataType: 'Number', cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },
            { headerName: "Purchase Qty(AI.Value 2)", width: 250, field: "OutQty2", dataType: 'Number', cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },
            { headerName: "Return Rate", width: 200, field: "InRate", dataType: 'Number', cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },
            { headerName: "Return Amt", width: 200, field: "InAmt", dataType: 'Number', cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },
            { headerName: "Purchase Qty", width: 200, field: "OutQty", dataType: 'Number', cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },
            { headerName: "Return Qty(AI.Value1)", width: 250, field: "InQty1", dataType: 'Number', cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },
            { headerName: "Return Qty(AI.Value2)", width: 250, field: "InQty2", dataType: 'Number', cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },
            { headerName: "Purchase Rate", width: 200, field: "OutRate", dataType: 'Number', cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },
            { headerName: "Purchase Amt", width: 200, field: "OutAmt", dataType: 'Number', cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },

            { headerName: "Net Purchase Qty", width: 200, field: "BalanceQty", dataType: 'Number', cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },

            { headerName: "Unit", width: 130, field: "Unit", dataType: 'Number', cellStyle: { 'text-align': 'left' } },
            { headerName: "Net Qty(AI.Value1)", width: 200, dataType: 'Number', field: "BalanceQty", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },
            { headerName: "Net Qty(AI.Value2)", width: 200, dataType: 'Number', field: "BalanceQty", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },
            { headerName: "Net Purchase Rate", width: 200, dataType: 'Number', field: "BalanceRate", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },
            { headerName: "Net Purchase Amt", width: 200, dataType: 'Number', field: "BalanceAmt", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },

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
                    ProductName: 'Total =>',
                    InQty: 0,
                    OutQty1: 0,
                    OutQty2: 0,
                    InAmt: 0,
                    OutQty: 0,
                    InQty1: 0,
                    InQty2: 0,
                    OutAmt: 0,
                    BalanceQty: 0,
                    BalanceAmt: 0


                }
                $scope.gridOptions.api.forEachNodeAfterFilterAndSort(function (node) {
                    var fData = node.data;
                    dt.InQty += fData.InQty;
                    dt.OutQty1 += fData.OutQty1;
                    dt.InQty1 += fData.InQt1;
                    dt.OutQty2 += fData.OutQty2;
                    dt.InAmt += fData.InAmt;
                    dt.OutQty += fData.OutQty;
                    dt.OutAmt += fData.OutAmt;
                    dt.BalanceQty += fData.BalanceQty;
                    dt.BalanceAmt += fData.BalanceAmt;
                    dt.InQty2 += fData.InQty2;
                });


                var filterDataColl = [];
                filterDataColl.push(dt);

                $scope.gridOptionsBottom.api.setRowData(filterDataColl);
            }

        };
        $scope.eGridDiv = document.querySelector('#datatable');

        // create the grid passing in the div to use together with the columns & data we want to use
        new agGrid.Grid($scope.eGridDiv, $scope.gridOptions);

        $scope.dataForBottomGrid = [
            {
                ProductName: 'Total =>',
                InQty: 0,
                OutQty1: 0,
                OutQty2: 0,
                InAmt: 0,
                OutQty: 0,
                InQty1: 0,
                InQty2: 0,
                OutAmt: 0,
                BalanceQty: 0,
                BalanceAmt: 0
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


        $timeout(function () {
            GlobalServices.getListState(EntityId, $scope.gridOptions);
        });


    }
    $scope.ClearData = function () {

        var DataColl = [];
        $scope.gridOptionsBottom.api.setRowData(DataColl);

        $scope.gridOptions.api.setRowData(DataColl);
    };
    $scope.GetPurchaseAnalysisProductWise = function () {
        $scope.ClearData();
        var dateFrom = new Date(($filter('date')(new Date(), 'yyyy-MM-dd')));
        var dateTo = new Date(($filter('date')(new Date(), 'yyyy-MM-dd')));

        if ($scope.PurchaseAnalysisProductWise.DateFromDet)
            dateFrom = new Date(($filter('date')($scope.PurchaseAnalysisProductWise.DateFromDet.dateAD, 'yyyy-MM-dd')));

        if ($scope.PurchaseAnalysisProductWise.DateToDet)
            dateTo = new Date(($filter('date')($scope.PurchaseAnalysisProductWise.DateToDet.dateAD, 'yyyy-MM-dd')));

        $scope.loadingstatus = 'running';
        showPleaseWait();

        var beData = {
            DateFrom: dateFrom,
            DateTo: dateTo,
            VoucherType: $scope.PurchaseAnalysisProductWise.VoucherId,
            isPost: $scope.PurchaseAnalysisProductWise.IsPost,
            branchId: $scope.PurchaseAnalysisProductWise.BranchId
        };

        $scope.loadingstatus = 'running';

        $http({
            method: "POST",
            url: base_url + "Inventory/Reporting/GetAllPurchaseAnalysisProductWise",
            data: JSON.stringify(beData),
            dataType: "json"
        }).then(function (res) {

            $scope.loadingstatus = 'stop';
            hidePleaseWait();

            if (res.data.IsSuccess && res.data.Data) {
                var DataColl = mx(res.data.Data);

                var dt = {
                    ProductName: 'TOTAL =>',
                    InQty: DataColl.sum(p1 => p1.InQty),
                    InQty1: DataColl.sum(p1 => p1.InQty1),
                    InQty2: DataColl.sum(p1 => p1.InQty2),
                    OutQty: DataColl.sum(p1 => p1.OutQty),
                    OutQty1: DataColl.sum(p1 => p1.OutQty1),
                    OutQty2: DataColl.sum(p1 => p1.OutQty2),
                    InAmt: DataColl.sum(p1 => p1.InAmt),
                    OutAmt: DataColl.sum(p1 => p1.OutAmt),
                    BalanceAmt: DataColl.sum(p1 => p1.BalanceAmt),
                    BalanceQty: DataColl.sum(p1 => p1.BalanceQty)
                }

                var filterDataColl = [];
                filterDataColl.push(dt);

                $scope.gridOptionsBottom.api.setRowData(filterDataColl);

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

    $scope.GetDataForPrint = function () {

        var filterData = [];

        $scope.gridOptions.api.forEachNodeAfterFilterAndSort(function (node) {
            var dayBook = node.data;
            filterData.push(dayBook);
        });

        return filterData;
    }
    $scope.onFilterTextBoxChanged = function () {
        $scope.gridOptions.api.setQuickFilter($scope.search);
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
                down_file(base_url + "//" + res.data.Data.ResponseId, "PurchaseAnalysisProductWise.xlsx");
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
