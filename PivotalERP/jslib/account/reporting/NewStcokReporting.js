"use strict";

agGrid.initialiseAgGridWithAngular1(angular);

app.controller("NewStcokReportingController", function ($scope, $http, $filter, $timeout, GlobalServices, $compile) {

    getterAndSetter();
    LoadData();

    $scope.onBtExportCSV = function () {
        var params = {
            fileName: 'NewStcokReporting.csv',
            sheetName: 'NewStcokReporting'
        };

        $scope.gridOptions.api.exportDataAsCsv(params);
    }


    function getterAndSetter() {

        $scope.columnDefs = [
            { headerName: "Code", field: "Code", width: 130, filter: "agTextColumnFilter", },
            { headerName: "Name", field: "Name",  width: 200, filter: "agTextColumnFilter",  },
            { headerName: "PartNo", field: "PartNo", width: 130,  filter: "agTextColumnFilter", },
            { headerName: "Description", field: "Description", width: 180, filter: "agTextColumnFilter", },
            { headerName: "ProductGroup", field: "ProductGroup", width: 180, filter: "agTextColumnFilter", },
            {
                headerName: "Opening",
                headerClass: 'ag-header-center',
                children: [
                    { field: "Opening_Qty", headerName: "Qty", width: 90, dataType: 'text', filter: 'agNumberColumnFilter', cellStyle: { 'textAlign': 'left' }, valueFormatter: function (params) { return Numberformat(params.value); }},
                    { field: "Opening_Rate", headerName: "Rate", width: 90, dataType: 'text', filter: 'agNumberColumnFilter', cellStyle: { 'textAlign': 'right' }, valueFormatter: function (params) { return Numberformat(params.value); } },
                    { field: "Opening_Amount", headerName: "Amount", width: 140, dataType: 'Number', filter: 'agNumberColumnFilter', cellStyle: { 'textAlign': 'right' }, valueFormatter: function (params) { return Numberformat(params.value); } },
                ]
            },
            {
                headerName: "Purchase Import",
                children: [
                    { field: "PurchaseImport_Qty", headerName: "Qty", width: 90, dataType: 'text', filter: 'agNumberColumnFilter', cellStyle: { 'textAlign': 'left' }, valueFormatter: function (params) { return Numberformat(params.value); }},
                    { field: "PurchaseImport_Amount", headerName: "Amount", width: 140, dataType: 'Number', filter: 'agNumberColumnFilter', cellStyle: { 'textAlign': 'right' }, valueFormatter: function (params) { return Numberformat(params.value); }},
                ]
            },
            {
                headerName: "Purchase Local",
                children: [
                    { field: "PurchaseLocal_Qty", headerName: "Qty", width: 90, dataType: 'text', filter: 'agNumberColumnFilter', cellStyle: { 'textAlign': 'left' }, valueFormatter: function (params) { return Numberformat(params.value); } },
                    { field: "PurchaseLocal_Amount", headerName: "Amount", width: 140, dataType: 'Number', filter: 'agNumberColumnFilter', cellStyle: { 'textAlign': 'right' }, valueFormatter: function (params) { return Numberformat(params.value); } },
                ]
            },
            {
                headerName: "Stock Journal In",
                children: [
                    { field: "StockJournalIn_Qty", headerName: "Qty", width: 90, dataType: 'text', filter: 'agNumberColumnFilter', cellStyle: { 'textAlign': 'left' }, valueFormatter: function (params) { return Numberformat(params.value); } },
                    { field: "StockJournalIn_Amount", headerName: "Amount", width: 140, dataType: 'Number', filter: 'agNumberColumnFilter', cellStyle: { 'textAlign': 'right' }, valueFormatter: function (params) { return Numberformat(params.value); } },
                ]
            },
            {
                headerName: "Stock Journal Out",
                children: [
                    { field: "StockJournalOut_Qty", headerName: "Qty", width: 90, dataType: 'text', filter: 'agNumberColumnFilter', cellStyle: { 'textAlign': 'left' }, valueFormatter: function (params) { return Numberformat(params.value); } },
                    { field: "StockJournalOut_Amount", headerName: "Amount", width: 140, dataType: 'Number', filter: 'agNumberColumnFilter', cellStyle: { 'textAlign': 'right' }, valueFormatter: function (params) { return Numberformat(params.value); } },
                ]
            },
            {
                headerName: "Cannibalized In",
                children: [
                    { field: "CannibalizedIn_Qty", headerName: "Qty", width: 90, dataType: 'text', filter: 'agNumberColumnFilter', cellStyle: { 'textAlign': 'left' }, valueFormatter: function (params) { return Numberformat(params.value); } },
                    { field: "CannibalizedIn_Amount", headerName: "Amount", width: 140, dataType: 'Number', filter: 'agNumberColumnFilter', cellStyle: { 'textAlign': 'right' }, valueFormatter: function (params) { return Numberformat(params.value); } },
                ]
            },
            {
                headerName: "Cannibalized Out",
                children: [
                    { field: "CannibalizedOut_Qty", headerName: "Qty", width: 90, dataType: 'text', filter: 'agNumberColumnFilter', cellStyle: { 'textAlign': 'left' }, valueFormatter: function (params) { return Numberformat(params.value); } },
                    { field: "CannibalizedOut_Amount", headerName: "Amount", width: 140, dataType: 'Number', filter: 'agNumberColumnFilter', cellStyle: { 'textAlign': 'right' }, valueFormatter: function (params) { return Numberformat(params.value); } },
                ]
            },
            {
                headerName: "Sales",
                children: [
                    { field: "Sales_Qty", headerName: "Qty", width: 90, dataType: 'text', filter: 'agNumberColumnFilter', cellStyle: { 'textAlign': 'left' }, valueFormatter: function (params) { return Numberformat(params.value); }},
                    { field: "Sales_Amount", headerName: "Amount", width: 140, dataType: 'Number', filter: 'agNumberColumnFilter', cellStyle: { 'textAlign': 'right' }, valueFormatter: function (params) { return Numberformat(params.value); }},
                ]
            },
            {
                headerName: "Sales Return",
                children: [
                    { field: "SalesReturn_Qty", headerName: "Qty", width: 90, dataType: 'text', filter: 'agNumberColumnFilter', cellStyle: { 'textAlign': 'left' }, valueFormatter: function (params) { return Numberformat(params.value); }},
                    { field: "SalesReturn_Amount", headerName: "Amount", width: 140, dataType: 'Number', filter: 'agNumberColumnFilter', cellStyle: { 'textAlign': 'right' }, valueFormatter: function (params) { return Numberformat(params.value); } },
                ]
            },
            {
                headerName: "Closing",
                children: [
                    { field: "Closing_Qty", headerName: "Qty", width: 90, dataType: 'text', filter: 'agNumberColumnFilter', cellStyle: { 'textAlign': 'left' }, valueFormatter: function (params) { return Numberformat(params.value); } },
                    { field: "Closing_Rate", headerName: "Rate", width: 90, dataType: 'text', filter: 'agNumberColumnFilter', cellStyle: { 'textAlign': 'right' }, valueFormatter: function (params) { return Numberformat(params.value); }},
                    { field: "Closing_Amount", headerName: "Amount", width: 140, dataType: 'Number', filter: 'agNumberColumnFilter', cellStyle: { 'textAlign': 'right' }, valueFormatter: function (params) { return Numberformat(params.value); } },
                ]
            }

        ];

        // Main Grid Options Configuration (unchanged)
        $scope.gridOptions = {

            defaultColDef: {
                filter: true,
                resizable: true,
                sortable: true,
                width: 100,
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
            suppressHorizontalScroll: true,
            alignedGrids: [],
            enableFilter: true,

            onFilterChanged: function () {

                var dt = {
                    ProductGroup: 'TOTAL =>',
                    Opening_Qty: 0,
                    Opening_Rate: 0,
                    Opening_Amount: 0,
                    PurchaseImport_Qty: 0,
                    PurchaseImport_Amount: 0,
                    PurchaseLocal_Qty: 0,
                    PurchaseLocal_Amount: 0,
                    StockJournalIn_Qty: 0,
                    StockJournalIn_Amount: 0,
                    StockJournalOut_Qty: 0,
                    StockJournalOut_Amount: 0,
                    CannibalizedIn_Qty: 0,
                    CannibalizedIn_Amount: 0,
                    CannibalizedOut_Qty: 0,
                    CannibalizedOut_Amount: 0,
                    Sales_Qty: 0,
                    Sales_Amount: 0,
                    SalesReturn_Qty: 0,
                    SalesReturn_Amount: 0,
                    Closing_Qty: 0,
                    Closing_Rate: 0,
                    Closing_Amount: 0,
                }
                $scope.gridOptions.api.forEachNodeAfterFilterAndSort(function (node) {
                    var fData = node.data;
                    dt.Opening_Qty += fData.Opening_Qty;
                    dt.Opening_Rate += fData.Opening_Rate;
                    dt.Opening_Amount += fData.Opening_Amount;
                    dt.PurchaseImport_Qty += fData.PurchaseImport_Qty;
                    dt.PurchaseImport_Amount += fData.PurchaseImport_Amount;
                    dt.PurchaseLocal_Qty += fData.PurchaseLocal_Qty;
                    dt.PurchaseLocal_Amount += fData.PurchaseLocal_Amount;
                    dt.StockJournalIn_Qty += fData.StockJournalIn_Qty;
                    dt.StockJournalIn_Amount += fData.StockJournalIn_Amount;
                    dt.StockJournalOut_Qty += fData.StockJournalOut_Qty;
                    dt.StockJournalOut_Amount += fData.StockJournalOut_Amount;
                    dt.CannibalizedIn_Qty += fData.CannibalizedIn_Qty;
                    dt.CannibalizedIn_Amount += fData.CannibalizedIn_Amount;
                    dt.CannibalizedOut_Qty += fData.CannibalizedOut_Qty;
                    dt.CannibalizedOut_Amount += fData.CannibalizedOut_Amount;
                    dt.Sales_Qty += fData.Sales_Qty;
                    dt.Sales_Amount += fData.Sales_Amount;
                    dt.SalesReturn_Qty += fData.SalesReturn_Qty;
                    dt.SalesReturn_Amount += fData.SalesReturn_Amount;
                    dt.Closing_Qty += fData.Closing_Qty;
                    dt.Closing_Rate += fData.Closing_Rate;
                    dt.Closing_Amount += fData.Closing_Amount;

                });


                var filterDataColl = [];
                filterDataColl.push(dt);

                $scope.gridOptionsBottom.api.setRowData(filterDataColl);
            }

        };
        $scope.eGridDiv = document.querySelector('#datatable');

        $scope.dataForBottomGrid = [
            {
                ProductGroup: 'Total =>',
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
        $scope.loadingstatus = "stop";


    }

    function LoadData() {

        $('.select2').select2({
            allowClear: true,
            openOnEnter: true
        });

        $scope.ProductGroupList = [];
        $http({
            method: 'GET',
            url: base_url + "Inventory/Reporting/GetAllProductGroup",
            dataType: "json",
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.ProductGroupList = res.data.Data;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        $scope.GodownColl = [];
        $http({
            method: 'GET',
            url: base_url + "Inventory/Creation/GetUserWiseGodown",
            dataType: "json"
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.GodownColl = res.data.Data;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        $scope.newFilter = {
            DateFrom_TMP: new Date(),
            DateTo_TMP: new Date(),
            ProductGroupId: 1,
            GodownId: 0,
            ShowZeroBalance: false
        };

        $timeout(function () {
            $http({
                method: "GET",
                url: base_url + "Global/GetCompanyDetail",
                dataType: "json"
            }).then(function (res) {
                var comDet = res.data.Data;
                if (comDet) {
                    $scope.PartyAgeing.DateFrom_TMP = new Date(comDet.StartDate);
                }
            }, function (errormessage) {
                alert('Unable to Delete data. pls try again.' + errormessage.responseText);
            });
        });

        $scope.loadingstatus = "stop";
    }


    $scope.GetAllNewStockReporting = function () {

        var dateFrom = new Date(($filter('date')(new Date(), 'yyyy-MM-dd')));
        var dateTo = new Date(($filter('date')(new Date(), 'yyyy-MM-dd')));

        if ($scope.newFilter.DateFromDet)
            dateFrom = $filter('date')($scope.newFilter.DateFromDet.dateAD, 'yyyy-MM-dd');

        if ($scope.newFilter.DateToDet)
            dateTo = $filter('date')($scope.newFilter.DateToDet.dateAD, 'yyyy-MM-dd');

        $scope.DataColl = []; //declare an empty array
        $scope.gridOptions.api.setRowData($scope.DataColl);


        var beData = {
            dateFrom: dateFrom,
            dateTo: dateTo,
            ProductGroupId: $scope.newFilter.ProductGroupId,
            GodownId: $scope.newFilter.GodownId,
        };

        $scope.loadingstatus = 'running';
        showPleaseWait();

        $http({
            method: "post",
            url: base_url + "Account/Reporting/GetAllNewStockReporting",
            data: JSON.stringify(beData),
            dataType: "json"
        }).then(function (res) {

            $scope.loadingstatus = 'stop';
            hidePleaseWait();

            if (res.data.IsSuccess && res.data.Data) {

                var dt = {
                    ProductGroup: 'TOTAL =>',
                    Opening_Qty: 0,
                    Opening_Rate: 0,
                    Opening_Amount: 0,
                    PurchaseImport_Qty: 0,
                    PurchaseImport_Amount: 0,
                    PurchaseLocal_Qty: 0,
                    PurchaseLocal_Amount: 0,
                    StockJournalIn_Qty: 0,
                    StockJournalIn_Amount: 0,
                    StockJournalOut_Qty: 0,
                    StockJournalOut_Amount: 0,
                    CannibalizedIn_Qty: 0,
                    CannibalizedIn_Amount: 0,
                    CannibalizedOut_Qty: 0,
                    CannibalizedOut_Amount: 0,
                    Sales_Qty: 0,
                    Sales_Amount: 0,
                    SalesReturn_Qty: 0,
                    SalesReturn_Amount: 0,
                    Closing_Qty: 0,
                    Closing_Rate: 0,
                    Closing_Amount: 0,
                }
                angular.forEach(res.data.Data, function (fData) {
                    dt.Opening_Qty += fData.Opening_Qty;
                    dt.Opening_Rate += fData.Opening_Rate;
                    dt.Opening_Amount += fData.Opening_Amount;
                    dt.PurchaseImport_Qty += fData.PurchaseImport_Qty;
                    dt.PurchaseImport_Amount += fData.PurchaseImport_Amount;
                    dt.PurchaseLocal_Qty += fData.PurchaseLocal_Qty;
                    dt.PurchaseLocal_Amount += fData.PurchaseLocal_Amount;
                    dt.StockJournalIn_Qty += fData.StockJournalIn_Qty;
                    dt.StockJournalIn_Amount += fData.StockJournalIn_Amount;
                    dt.StockJournalOut_Qty += fData.StockJournalOut_Qty;
                    dt.StockJournalOut_Amount += fData.StockJournalOut_Amount;
                    dt.CannibalizedIn_Qty += fData.CannibalizedIn_Qty;
                    dt.CannibalizedIn_Amount += fData.CannibalizedIn_Amount;
                    dt.CannibalizedOut_Qty += fData.CannibalizedOut_Qty;
                    dt.CannibalizedOut_Amount += fData.CannibalizedOut_Amount;
                    dt.Sales_Qty += fData.Sales_Qty;
                    dt.Sales_Amount += fData.Sales_Amount;
                    dt.SalesReturn_Qty += fData.SalesReturn_Qty;
                    dt.SalesReturn_Amount += fData.SalesReturn_Amount;
                    dt.Closing_Qty += fData.Closing_Qty;
                    dt.Closing_Rate += fData.Closing_Rate;
                    dt.Closing_Amount += fData.Closing_Amount;

                });
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


    $scope.showAgeDialog = function () {

        var data = [];
        $scope.gridOptions.api.setRowData(data);

        $('#modal-agerange').modal('show');
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
                                                        Period: $scope.PartyAgeing.DateFromDet.dateBS + " TO " + $scope.PartyAgeing.DateToDet.dateBS,
                                                        R1: ($scope.AgeList.length > 0 ? $scope.gridOptions.api.getColumnDef('colR1').headerName : 0),
                                                        R2: ($scope.AgeList.length > 1 ? $scope.gridOptions.api.getColumnDef('colR2').headerName : 0),
                                                        R3: ($scope.AgeList.length > 2 ? $scope.gridOptions.api.getColumnDef('colR3').headerName : 0),
                                                        R4: ($scope.AgeList.length > 3 ? $scope.gridOptions.api.getColumnDef('colR4').headerName : 0),
                                                        R5: ($scope.AgeList.length > 4 ? $scope.gridOptions.api.getColumnDef('colR5').headerName : 0),
                                                        R6: ($scope.AgeList.length > 5 ? $scope.gridOptions.api.getColumnDef('colR6').headerName : 0),
                                                        R7: ($scope.AgeList.length > 6 ? $scope.gridOptions.api.getColumnDef('colR7').headerName : 0),
                                                        R8: ($scope.AgeList.length > 7 ? $scope.gridOptions.api.getColumnDef('colR8').headerName : 0),
                                                        R9: ($scope.AgeList.length > 8 ? $scope.gridOptions.api.getColumnDef('colR9').headerName : 0),
                                                        R10: ($scope.AgeList.length > 9 ? $scope.gridOptions.api.getColumnDef('colR10').headerName : 0),
                                                        R11: ($scope.AgeList.length > 10 ? $scope.gridOptions.api.getColumnDef('colR11').headerName : 0),
                                                        R12: ($scope.AgeList.length > 11 ? $scope.gridOptions.api.getColumnDef('colR12').headerName : 0),
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
                                    Period: $scope.PartyAgeing.DateFromDet.dateBS + " TO " + $scope.PartyAgeing.DateToDet.dateBS,
                                    R1: ($scope.AgeList.length > 0 ? $scope.gridOptions.api.getColumnDef('colR1').headerName : 0),
                                    R2: ($scope.AgeList.length > 1 ? $scope.gridOptions.api.getColumnDef('colR2').headerName : 0),
                                    R3: ($scope.AgeList.length > 2 ? $scope.gridOptions.api.getColumnDef('colR3').headerName : 0),
                                    R4: ($scope.AgeList.length > 3 ? $scope.gridOptions.api.getColumnDef('colR4').headerName : 0),
                                    R5: ($scope.AgeList.length > 4 ? $scope.gridOptions.api.getColumnDef('colR5').headerName : 0),
                                    R6: ($scope.AgeList.length > 5 ? $scope.gridOptions.api.getColumnDef('colR6').headerName : 0),
                                    R7: ($scope.AgeList.length > 6 ? $scope.gridOptions.api.getColumnDef('colR7').headerName : 0),
                                    R8: ($scope.AgeList.length > 7 ? $scope.gridOptions.api.getColumnDef('colR8').headerName : 0),
                                    R9: ($scope.AgeList.length > 8 ? $scope.gridOptions.api.getColumnDef('colR9').headerName : 0),
                                    R10: ($scope.AgeList.length > 9 ? $scope.gridOptions.api.getColumnDef('colR10').headerName : 0),
                                    R11: ($scope.AgeList.length > 10 ? $scope.gridOptions.api.getColumnDef('colR11').headerName : 0),
                                    R12: ($scope.AgeList.length > 11 ? $scope.gridOptions.api.getColumnDef('colR12').headerName : 0),
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
            var fData = node.data;
            filterData.push(fData);

        });

        return filterData;

    };

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
                down_file(base_url + "//" + res.data.Data.ResponseId, "NewStcokReporting.xlsx");
            }

        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            Swal.fire(errormessage);
        });
    }


});