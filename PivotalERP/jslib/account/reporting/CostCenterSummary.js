"use strict";

agGrid.initialiseAgGridWithAngular1(angular);

app.controller("CostCenterSummary", function ($scope, $http, $filter, $timeout, GlobalServices, $compile) {
    var PrintPreviewAs = 1;
    const contextMenu = GlobalServices.createElementForMenu();
    LoadData();

    $scope.onBtExportCSV = function () {
        var params = {
            fileName: 'CostCenterSummary.csv',


            sheetName: 'CostCenterSummary'
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
        //agGrid.initialiseAgGridWithAngular1(angular);

        $scope.GenConfig = {};
        GlobalServices.getGenConfig().then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.GenConfig = res.data.Data;
                PrintPreviewAs = $scope.GenConfig.PrintPreviewAs;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });


        //Search Drop DownList
        $scope.VoucherSearchOptions = [
            { text: 'CostCenterName', value: 'Particulars', dataType: 'Text' },
            { text: 'Alias', value: 'Alias', dataType: 'Text' },
            { text: 'Code', value: 'Code', dataType: 'Text' },
            { text: 'Cost Categories Name', value: 'CostCategoriesName', dataType: 'Text' },
            { text: 'Opening Dr', value: 'OpeningDr', dataType: 'Number' },
            { text: 'Opening Cr', value: 'OpeningCr', dataType: 'Number' },
            { text: 'Transaction Dr', value: 'TransactionDr', dataType: 'Number' },
            { text: 'Transaction Cr', value: 'TransactionCr', dataType: 'Number' },
            { text: 'Closing Dr', value: 'ClosingDr', dataType: 'Number' },
            { text: 'Closing Cr', value: 'ClosingCr', dataType: 'Number' },];


        //Filter Dialog Box Details 
        $scope.BranchTypeColl = [];
        $scope.VoucherTypeColl = [];
        $scope.LedgerGroupTypeColl = [];
        $scope.ExpressionColl = GlobalServices.getExpression();
        $scope.ConditionColl = GlobalServices.getLogicCondition();
        $scope.FilterColumnColl = [{ text: 'Opening', value: 'Opening', dataType: 'Number' },
        { text: 'OpeningDr', value: 'OpeningDr', dataType: 'Number' },
        { text: 'OpeningCr', value: 'OpeningCr', dataType: 'Number' },
        { text: 'Total OpeningDr', value: 'TotalOpeningDr', dataType: 'Number' },
        { text: 'Total OpeningCr', value: 'TotalOpeningCr', dataType: 'Number' },
        { text: 'Transaction', value: 'Transaction', dataType: 'Number' },
        { text: 'TransactionDr', value: 'TransactionDr', dataType: 'Number' },
        { text: 'TransactionCr', value: 'TransactionCr', dataType: 'Number' },
        { text: 'Closing', value: 'Closing', dataType: 'Number' },
        { text: 'ClosingDr', value: 'ClosingDr', dataType: 'Number' },
        { text: 'ClosingCr', value: 'ClosingCr', dataType: 'Number' },
        { text: 'CostCenterName', value: 'CostCenterName', dataType: 'text' },
        { text: 'CostCategoriesName', value: 'CostCategoriesName', dataType: 'text' },
        ];


        $scope.CostCenterSummary = {

            fromDate_TMP: new Date(),
            toDate_TMP: new Date(),
            LedgerId: 0,
            LedgerCode: '',
            CostCategoryIdColl: '',

        };
        $scope.OpeningAmt = 0;
        $scope.CurrentAmt = 0;
        $scope.TotalAmt = 0;
        $scope.ReportName = '';
        $scope.noofdecimal = 2;

        $scope.loadingstatus = "stop";

        $scope.CostCategoryList = []; //declare an empty array

        $http({
            method: 'GET',
            url: base_url + "Account/Creation/GetAllCostCategoryList",
            dataType: "json"
            //data:JSON.stringify(para)
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.CostCategoryList = res.data.Data;
            }
        }, function (reason) {
            alert('Failed' + reason);
        });

        $scope.columnDefs = [

            { headerName: "Cost Center", width: 220, field: "LedgerName", pinned: 'left', dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "Code", width: 150, field: "Code", dataType: 'Text', cellStyle: { 'text-align': 'left' } },

            { headerName: "Categories", width: 180, field: "LedgerGroupName", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            {
                headerName: "Opening", field: "Opening", width: 150, dataType: 'Number', filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' },
            },
            { headerName: "Transaction Dr", field: "TransactionDr", width: 150, dataType: 'Number', filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' }, },
            { headerName: "Transaction Cr", field: "TransactionCr", width: 150, dataType: 'Number', filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' }, },
            { headerName: "Closing", field: "Closing", width: 150, dataType: 'Number', filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' }, },
            { headerName: "Alias", field: "Alias", width: 140, dataType: 'Text', filter: "agTextColumnFilter" },
            { headerName: "Opening Dr", field: "TotalOpeningDr", dataType: 'Number', width: 150, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' }, },
            { headerName: "Opening Cr", field: "TotalOpeningCr", dataType: 'Number', width: 150, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' }, },
            { headerName: "Closing Dr", field: "ClosingDr", width: 150, dataType: 'Number', filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' }, },
            { headerName: "Closing Cr", field: "ClosingCr", width: 150, dataType: 'Number', filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' }, },
            //{ headerName: "Area", width: 110, field: "AreaName", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            //{ headerName: "Mobile 1", width: 120, field: "MobileNo1", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            //{ headerName: "Mobile 2", width: 120, field: "MobileNo2", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            //{ headerName: "Address", width: 120, field: "Address", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            //{ headerName: "Email", width: 120, field: "EmailId", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            //{ headerName: "Tel 1", width: 120, field: "TelNo1", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
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
			overlayLoadingTemplate: "Please Click the Load Bottom to display the data",
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
                    LedgerName: 'TOTAL =>',
                    Opening: 0,
                    TransactionDr: 0,
                    TransactionCr: 0,
                    Closing: 0,
                    ClosingDr: 0,
                    ClosingCr: 0,
                    TotalOpeningDr: 0,
                    TotalOpeningCr: 0
                }

                $scope.gridOptions.api.forEachNodeAfterFilterAndSort(function (node) {
                    var fData = node.data;
                    dt.Opening += fData.Opening;
                    dt.TransactionDr += fData.TransactionDr;
                    dt.TransactionCr += fData.TransactionCr;
                    dt.Closing += fData.Closing;
                    dt.ClosingDr += fData.ClosingDr;
                    dt.ClosingCr += fData.ClosingCr;
                    dt.TotalOpeningDr += fData.TotalOpeningDr;
                    dt.TotalOpeningDr += fData.TotalOpeningDr;
                });

                var totalColl = [];
                totalColl.push(dt);
                $scope.gridOptionsBottom.api.setRowData(totalColl);
            }


        };
        $scope.eGridDiv = document.querySelector('#datatable');

        // create the grid passing in the div to use together with the columns & data we want to use
        new agGrid.Grid($scope.eGridDiv, $scope.gridOptions);

        $scope.dataForBottomGrid = [
            {
                AutoNumber: '',
                LedgerName: 'Total =>',
                TransactionDr: 0,
                TransactionCr: '',
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

    $scope.GetCostCenterSummary = function () {
        $scope.ClearData();
        var fromDate = new Date(($filter('date')(new Date(), 'yyyy-MM-dd')));
        var toDate = new Date(($filter('date')(new Date(), 'yyyy-MM-dd')));

        if ($scope.CostCenterSummary.DateFromDet)
            fromDate = $filter('date')($scope.CostCenterSummary.DateFromDet.dateAD, 'yyyy-MM-dd');

        if ($scope.CostCenterSummary.DateToDet)
            toDate = $filter('date')($scope.CostCenterSummary.DateToDet.dateAD, 'yyyy-MM-dd');

        $scope.DataColl = []; //declare an empty array
        $scope.gridOptions.api.setRowData($scope.DataColl);

        var beData = {
            fromDate: fromDate,
            toDate: toDate,
            LedgerId: ($scope.CostCenterSummary.LedgerId ? $scope.CostCenterSummary.LedgerId : 0),
            LedgerCode: '',
            CostCategoryIdColl: $scope.CostCenterSummary.CostCategoryIdColl ? $scope.CostCenterSummary.CostCategoryIdColl.toString() : '',
            CostCategory: '',
        };

        if ($scope.CostCenterSummary.CostCategoryIdColl && $scope.CostCenterSummary.CostCategoryIdColl.length > 0) {
            var qry = mx($scope.CostCategoryList);
            $scope.CostCenterSummary.CostCategoryIdColl.forEach(function (ccid) {
                var findCC = qry.firstOrDefault(p1 => p1.CostCategoryId == ccid);
                if (findCC) {

                    if (beData.CostCategory.length > 0) {
                        beData.CostCategory = beData.CostCategory + ',';
                    }

                    beData.CostCategory = beData.CostCategory + findCC.Name;
                }
            });
        }

        $scope.loadingstatus = 'running';
        showPleaseWait();

        $http({
            method: "POST",
            url: base_url + "Account/Reporting/GetAllCostCenterClosing",
            data: JSON.stringify(beData),
            dataType: "json"
        }).then(function (res) {

            $scope.loadingstatus = 'stop';
            hidePleaseWait();

            if (res.data.IsSuccess && res.data.Data) {
                $scope.DataColl = res.data.Data;

                var dt = {
                    LedgerName: 'TOTAL =>',
                    Opening: 0,
                    TransactionDr: 0,
                    TransactionCr: 0,
                    Closing: 0,
                    ClosingDr: 0,
                    ClosingCr: 0,
                    TotalOpeningDr: 0,
                    TotalOpeningCr: 0
                }

                angular.forEach(res.data.Data, function (fData) {
                    dt.Opening += fData.Opening;
                    dt.TransactionDr += fData.TransactionDr;
                    dt.TransactionCr += fData.TransactionCr;
                    dt.Closing += fData.Closing;
                    dt.ClosingDr += fData.ClosingDr;
                    dt.ClosingCr += fData.ClosingCr;
                    dt.TotalOpeningDr += fData.TotalOpeningDr;
                    dt.TotalOpeningDr += fData.TotalOpeningDr;
                })
                var totalColl = [];
                totalColl.push(dt);
                $scope.gridOptionsBottom.api.setRowData(totalColl);

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

                                                    var rptPara = {
                                                        rpttranid: rptTranId,
                                                        istransaction: false,
                                                        entityid: EntityId,
                                                        voucherid: 0,
                                                        tranid: 0,
                                                        vouchertype: 0,
                                                        sessionid: res.data.Data.ResponseId,
                                                        Period: $scope.CostCenterSummary.DateFromDet.dateBS + " TO " + $scope.CostCenterSummary.DateToDet.dateBS,
                                                        LedgerName: $scope.CostCenterSummary.LedgerDetails ? $scope.CostCenterSummary.LedgerDetails.Name : '',
                                                        LedgerCode: $scope.CostCenterSummary.LedgerDetails ? $scope.CostCenterSummary.LedgerDetails.Code : '',
                                                        CostCategory: $scope.CostCenterSummary.CostCategory ? $scope.CostCenterSummary.CostCategory : '',
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
                                    Period: $scope.CostCenterSummary.DateFromDet.dateBS + " TO " + $scope.CostCenterSummary.DateToDet.dateBS,
                                    LedgerName: $scope.CostCenterSummary.LedgerDetails ? $scope.CostCenterSummary.LedgerDetails.Name : '',
                                    LedgerCode: $scope.CostCenterSummary.LedgerDetails ? $scope.CostCenterSummary.LedgerDetails.Code : '',
                                    CostCategory: $scope.CostCenterSummary.CostCategory ? $scope.CostCenterSummary.CostCategory : '',
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
                down_file(base_url + "//" + res.data.Data.ResponseId, "CostCenterSummary.xlsx");
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
