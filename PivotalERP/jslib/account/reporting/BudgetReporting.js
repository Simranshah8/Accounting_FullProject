"use strict";
agGrid.initialiseAgGridWithAngular1(angular);
app.controller("BudgetReportingController", function ($scope, $http, $filter, $timeout, GlobalServices, $compile) {
    LoadData();
    $scope.onBtExportCSV = function () {
        var params = {
            fileName: 'BudgetReporting.csv',
            sheetName: 'BudgetReporting'
        };
        $scope.gridOptions.api.exportDataAsCsv(params);
    }

    function LoadData() {
        $('.select2').select2();
        var gSrv = GlobalServices;

        $scope.ReportTypeColl = [{ id: 1, text: 'Monthly' }, { id: 2, text: 'Yearly' }];
        $scope.MonthList = gSrv.getMonthList();

        $scope.BudgetReporting = {
            ReportType: 1,
            MonthId: null,
            PeriodId: null,
            BranchId: null,
        };

        $scope.CostClassList = [];
        $http({
            method: 'GET',
            url: base_url + "Account/Creation/GetAllCostClasss",
            dataType: "json"
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.CostClassList = res.data.Data;
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

        $scope.columnDefs = [

            { headerName: "Group", width: 130, field: "LedgerGroup", dataType: 'Text', cellStyle: { 'text-align': 'center' } },
            { headerName: "Code", width: 130, field: "Code", dataType: 'Text', cellStyle: { 'text-align': 'center' } },
            { headerName: "Particulars", width: 150, field: "Name", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "Budget Amount", width: 160, field: "BudgetAmt", dataType: 'Number', cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "Expenses Amount", width: 170, field: "ExpensesAmt", dataType: 'Number', cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "Remaining Amount", width: 170, field: "RemainingAmt", dataType: 'Number', cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },

            { headerName: "Shrawan", width: 140, field: "Month4", dataType: 'Number', cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "Bhadra", width: 140, field: "Month5", dataType: 'Number', cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "Ashwin", width: 140, field: "Month6", dataType: 'Number', cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "Kartik", width: 140, field: "Month7", dataType: 'Number', cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "Mansir", width: 140, field: "Month8", dataType: 'Number', cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "Push", width: 140, field: "Month9", dataType: 'Number', cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "Magh", width: 140, field: "Month10", dataType: 'Number', cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "Falgun", width: 140, field: "Month11", dataType: 'Number', cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "Chaitra", width: 140, field: "Month12", dataType: 'Number', cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "Baisakh", width: 140, field: "Month1", dataType: 'Number', cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "Jestha", width: 140, field: "Month2", dataType: 'Number', cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "Ashadh", width: 140, field: "Month3", dataType: 'Number', cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } }
        ];

        // Function to update columns based on ReportType
        function updateColumns() {
            if ($scope.BudgetReporting.ReportType === 1) { // Monthly
                $scope.gridOptions.api.setColumnDefs($scope.columnDefs);
            } else if ($scope.BudgetReporting.ReportType === 2) { // Yearly
                const filteredColumns = $scope.columnDefs.filter(col =>
                    col.field !== "PreviousExpenses" && col.field !== "CurrentExpenses"
                );
                $scope.gridOptions.api.setColumnDefs(filteredColumns);
            }
        }

        // Define grid options
        $scope.gridOptions = {
            defaultColDef: {
                filter: true,
                resizable: true,
                sortable: true,
                width: 100
            },
            enableSorting: true,
            multiSortKey: 'ctrl',
            enableColResize: true,
            overlayLoadingTemplate: "Please Click the Load Bottom to display the data",
            rowSelection: 'multiple',
            columnDefs: $scope.columnDefs,
            rowData: null,
            suppressHorizontalScroll: true,
            filter: true,
            enableFilter: true,
            alignedGrids: [], // Initialize as an empty array
            onFilterChanged: function () {

                var dt = {
                    Name: 'TOTAL =>',
                    BudgetAmt: 0,
                    ExpensesAmt: 0,
                    Month4: 0,
                    Month5: 0,
                    Month6: 0,
                    Month7: 0,
                    Month8: 0,
                    Month9: 0,
                    Month10: 0,
                    Month11: 0,
                    Month12: 0,
                    Month1: 0,
                    Month2: 0,
                    Month3: 0,
                }
                $scope.gridOptions.api.forEachNodeAfterFilterAndSort(function (node) {
                    var fData = node.data;
                    dt.BudgetAmt += fData.BudgetAmt;
                    dt.ExpensesAmt += fData.ExpensesAmt;
                    dt.Month4 += fData.Month4;
                    dt.Month5 += fData.Month5;
                    dt.Month6 += fData.Month6;
                    dt.Month7 += fData.Month7;
                    dt.Month8 += fData.Month8;
                    dt.Month9 += fData.Month9;
                    dt.Month10 += fData.Month10;
                    dt.Month11 += fData.Month11;
                    dt.Month12 += fData.Month12;
                    dt.Month1 += fData.Month1;
                    dt.Month2 += fData.Month2;
                    dt.Month3 += fData.Month3;
                });
                var filterDataColl = [];
                filterDataColl.push(dt);

                $scope.gridOptionsBottom.api.setRowData(filterDataColl);
            }
        };

        $scope.gridOptionsBottom = {
            defaultColDef: { resizable: true, width: 90 },
            columnDefs: $scope.columnDefs,
            rowData: [
                {
                    Name: 'TOTAL =>',
                    BudgetAmt: 0,
                    ExpensesAmt: 0,
                    Month4: 0,
                    Month5: 0,
                    Month6: 0,
                    Month7: 0,
                    Month8: 0,
                    Month9: 0,
                    Month10: 0,
                    Month11: 0,
                    Month12: 0,
                    Month1: 0,
                    Month2: 0,
                    Month3: 0,
                }
            ],
            rowClass: 'bold-row',
            headerHeight: 0,
            alignedGrids: [] // Initialize as an empty array
        };

        // Align grids
        $scope.gridOptions.alignedGrids.push($scope.gridOptionsBottom);
        $scope.gridOptionsBottom.alignedGrids.push($scope.gridOptions);

        // Watch for changes in ReportType to update columns
        $scope.$watch('BudgetReporting.ReportType', function (newVal, oldVal) {
            if (newVal !== oldVal) {
                updateColumns();
            }
        });

        // Initialize grids
        $scope.eGridDiv = document.querySelector('#datatable');
        new agGrid.Grid($scope.eGridDiv, $scope.gridOptions);

        $scope.gridDivBottom = document.querySelector('#myGridBottom');
        new agGrid.Grid($scope.gridDivBottom, $scope.gridOptionsBottom);
    }

    $scope.GetBudgetReporting = function () {


        $scope.DataColl = []; //declare an empty array
        $scope.gridOptions.api.setRowData($scope.DataColl);


        var beData = {
            CostClassId: $scope.BudgetReporting.CostClassId,
            BranchIdColl: ($scope.BudgetReporting.BranchId ? $scope.BudgetReporting.BranchId.toString() : '')
        };

        $scope.loadingstatus = 'running';
        showPleaseWait();

        $http({
            method: "post",
            url: base_url + "Account/Reporting/GetBudgetSummary",
            data: JSON.stringify(beData),
            dataType: "json"
        }).then(function (res) {

            $scope.loadingstatus = 'stop';
            hidePleaseWait();

            if (res.data.IsSuccess && res.data.Data) {

                var dt = {
                    Name: 'TOTAL =>',
                    BudgetAmt: 0,
                    ExpensesAmt: 0,
                    Month4: 0,
                    Month5: 0,
                    Month6: 0,
                    Month7: 0,
                    Month8: 0,
                    Month9: 0,
                    Month10: 0,
                    Month11: 0,
                    Month12: 0,
                    Month1: 0,
                    Month2: 0,
                    Month3: 0,
                }
                angular.forEach(res.data.Data, function (fData) {
                    dt.BudgetAmt += fData.BudgetAmt;
                    dt.ExpensesAmt += fData.ExpensesAmt;
                    dt.Month4 += fData.Month4;
                    dt.Month5 += fData.Month5;
                    dt.Month6 += fData.Month6;
                    dt.Month7 += fData.Month7;
                    dt.Month8 += fData.Month8;
                    dt.Month9 += fData.Month9;
                    dt.Month10 += fData.Month10;
                    dt.Month11 += fData.Month11;
                    dt.Month12 += fData.Month12;
                    dt.Month1 += fData.Month1;
                    dt.Month2 += fData.Month2;
                    dt.Month3 += fData.Month3;
                });

                var filterDataColl = [];
                filterDataColl.push(dt);

                $scope.gridOptionsBottom.api.setRowData(filterDataColl);

                $scope.gridOptions.api.setRowData(res.data.Data);
            } else
                Swal.fire(res.data.ResponseMSG);

        }, function (reason) {
            $scope.loadingstatus = "stop";
            Swal.fire('Failed' + reason);
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
        $scope.gridOptionsBottom.api.setRowData([dt]);
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
                down_file(base_url + "//" + res.data.Data.ResponseId, "BudgetReporting.xlsx");
            }

        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            Swal.fire(errormessage);
        });
    }

});