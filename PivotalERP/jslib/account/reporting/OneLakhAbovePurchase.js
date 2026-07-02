"use strict";

agGrid.initialiseAgGridWithAngular1(angular);

app.controller("OneLakhAbovePurchaseCTRL", function ($scope, $http, $filter, $timeout, GlobalServices, $compile) {
var PrintPreviewAs = 1;
 const contextMenu = GlobalServices.createElementForMenu();
    LoadData();

    $scope.onBtExportCSV = function () {
        var params = {
            fileName: 'OneLakhAbove.csv',
            sheetName: 'OneLakhAbove'
        };

        $scope.gridOptions.api.exportDataAsCsv(params);
    }

    $scope.GetPeriodMonths = function (costClassId) {
        if (costClassId > 0) {
            GlobalServices.getCompanyPeriodMonth(costClassId).then(function (res) {
                if (res.data.IsSuccess && res.data.Data) {
                    $scope.PeriodMonthColl = res.data.Data;

                    if ($scope.PeriodMonthColl) {
                        $scope.PeriodMonthColl.forEach(function (pm) {
                            if (pm.IsRunning == true) {
                                $scope.AccountConfirmationLetter.SelectedMonth = pm;
                                $scope.AccountConfirmationLetter.RptMonthSNo = pm.SNo;

                                $scope.AccountConfirmationLetter.DateFrom_TMP = new Date(pm.FromDate);
                                $scope.AccountConfirmationLetter.DateTo_TMP = new Date(pm.ToDate);
                            }
                        });
                    }
                }
            }, function (reason) {
                Swal.fire('Failed' + reason);
            });
        }
    }
    $scope.ChangePeriodMonth = function (sm) {
        if (sm) {
            $scope.AccountConfirmationLetter.DateFrom_TMP = new Date(sm.FromDate);
            $scope.AccountConfirmationLetter.DateTo_TMP = new Date(sm.ToDate);

        }
    }
    $scope.ChangePeriodOption = function () {
        if ($scope.AccountConfirmationLetter.PeriodOPT == 2) {
            $scope.ChangePeriodMonth($scope.AccountConfirmationLetter.SelectedMonth);
        }
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


        $scope.ForColl = [{ id: 0, text: 'Debtor' }, { id: 1, text: 'Creditor' }];
        $scope.GroupByColl = [{ id: 1, text: 'Ledger Wise' }, { id: 2, text: 'Party Wise' }, {id:3,text:'Pan/Vat Wise'}];
        $scope.AccountConfirmationLetter = {
            DateFrom_TMP: new Date(),
            DateTo_TMP: new Date(),
            ReportType: 1,
            LedgerGroupId: 26,
            PeriodOPT: 2,
            RptCostClassId: null,
            RptMonthSNo: 0
        };

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

        $scope.PeriodOptColl = GlobalServices.getPeriodOptions();
        $scope.RptCostClassColl = [];
        GlobalServices.getCostClassForRpt().then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.RptCostClassColl = res.data.Data;
                if ($scope.RptCostClassColl && $scope.RptCostClassColl.length > 0) {
                    $scope.AccountConfirmationLetter.RptCostClassId = $scope.RptCostClassColl[0].CostClassId;
                    $scope.GetPeriodMonths($scope.RptCostClassColl[0].CostClassId);
                }
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });


        $scope.LedgerGroupList = [];
        $scope.LedgerGroupList_Qry = [];
        $http({
            method: 'GET',
            url: base_url + "Account/Creation/GetCreditorGroup",
            dataType: "json"
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.LedgerGroupList = res.data.Data;
                $scope.LedgerGroupList_Qry = mx(res.data.Data);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        $timeout(function () {
            $http({
                method: "GET",
                url: base_url + "Global/GetCompanyDetail",
                dataType: "json"
            }).then(function (res) {
                var comDet = res.data.Data;
                if (comDet) {
                    $scope.AccountConfirmationLetter.DateFrom_TMP = new Date(comDet.StartDate);
                }
            }, function (errormessage) {
                alert('Unable to Delete data. pls try again.' + errormessage.responseText);
            });
        });
      
       
        $scope.loadingstatus = "stop";

        $scope.columnDefs = [
            { headerName: "Name", width: 220, field: "Name", dataType: 'Text', cellStyle: { 'text-align': 'left' }, pinned: 'left' },
            { headerName: "PanVatNo", width: 120, dataType: 'Text', field: "PanVatNo", cellStyle: { 'text-align': 'center' }, pinned: 'left' },
            { headerName: "Address", width: 120, dataType: 'Text', field: "Address", cellStyle: { 'text-align': 'left' }, pinned: 'left' },

            { headerName: "Non Taxable Purchase", colId: 'colR2', width: 180, dataType: 'Text', field: "P_NonTaxable", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },
            { headerName: "Taxable Purchase", colId: 'colR2', width: 180, dataType: 'Text', field: "P_VatAV", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },
            { headerName: "Purchase Vat", colId: 'colR4', width: 150, field: "P_Vat", dataType: 'Number', cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },

            { headerName: "Non Taxable Return", colId: 'colR2', width: 180, dataType: 'Text', field: "PR_NonTaxable", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },
            { headerName: "Taxable Return", colId: 'colR3', width: 180, dataType: 'Text', field: "PR_VatAV", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); },},            
            { headerName: "Return Vat", colId: 'colR4', width: 150, field: "PR_Vat", dataType: 'Number', cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },

            
            { headerName: "Opening", width: 150, dataType: 'Number', field: "Opening", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },
            { headerName: "DrAmount", width: 150, dataType: 'Number', field: "DrAmt", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },
            { headerName: "CrAmount", width: 150, dataType: 'Number', field: "CrAmt", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },            
            { headerName: "Closing", width: 150, dataType: 'Number', field: "Closing", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },

            { headerName: "Alias", width: 120, dataType: 'Text', field: "Alias", cellStyle: { 'text-align': 'left' } },
            { headerName: "Code", width: 120, dataType: 'Text', field: "Code", cellStyle: { 'text-align': 'left' } },

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
                    Name: 'TOTAL =>',
                    Opening:0,
                    DrAmt: 0,
                    CrAmt: 0,
                    Closing: 0,
                    S_InvoiceAmount: 0,
                    S_Discount: 0,
                    S_ExDuty: 0,
                    S_Vat: 0,
                    S_Schame: 0,
                    S_Freight: 0,
                    S_RoundOffAmt: 0,
                    S_VatAV: 0,
                    S_ExciseAV: 0,
                    S_NonTaxable: 0,
                    P_InvoiceAmount: 0,
                    P_Discount: 0,
                    P_ExDuty: 0,
                    P_Vat: 0,
                    P_Schame: 0,
                    P_Freight: 0,
                    P_RoundOffAmt: 0,
                    P_VatAV: 0,
                    P_ExciseAV: 0,
                    P_NonTaxable: 0,
                    SR_InvoiceAmount: 0,
                    SR_Discount: 0,
                    SR_ExDuty: 0,
                    SR_Vat: 0,
                    SR_Schame: 0,
                    SR_Freight: 0,
                    SR_RoundOffAmt: 0,
                    SR_VatAV: 0,
                    SR_ExciseAV: 0,
                    SR_NonTaxable: 0,
                    PR_InvoiceAmount: 0,
                    PR_Discount: 0,
                    PR_ExDuty: 0,
                    PR_Vat: 0,
                    PR_Schame: 0,
                    PR_Freight: 0,
                    PR_RoundOffAmt: 0,
                    PR_VatAV: 0,
                    PR_ExciseAV: 0,
                    PR_NonTaxable: 0,
                }
                $scope.gridOptions.api.forEachNodeAfterFilterAndSort(function (node) {
                    var fData = node.data;
                    dt.Opening += fData.Opening;
                    dt.DrAmt += fData.DrAmt;
                    dt.CrAmt += fData.CrAmt;
                    dt.Closing += fData.Closing;
                    dt.S_InvoiceAmount += fData.S_InvoiceAmount;
                    dt.S_Discount += fData.S_Discount;
                    dt.S_ExDuty += fData.S_ExDuty;
                    dt.S_Vat += fData.S_Vat;
                    dt.S_Schame += fData.S_Schame;
                    dt.S_Freight += fData.S_Freight;
                    dt.S_RoundOffAmt += fData.S_RoundOffAmt;
                    dt.S_VatAV += fData.S_VatAV;
                    dt.S_ExciseAV += fData.S_ExciseAV;
                    dt.S_NonTaxable += fData.S_NonTaxable;
                    dt.P_InvoiceAmount += fData.P_InvoiceAmount;
                    dt.P_Discount += fData.P_Discount;
                    dt.P_ExDuty += fData.P_ExDuty;
                    dt.P_Vat += fData.P_Vat;
                    dt.P_Schame += fData.P_Schame;
                    dt.P_Freight += fData.P_Freight;
                    dt.P_RoundOffAmt += fData.P_RoundOffAmt;
                    dt.P_VatAV += fData.P_VatAV;
                    dt.P_ExciseAV += fData.P_ExciseAV;
                    dt.P_NonTaxable += fData.P_NonTaxable;
                    dt.SR_InvoiceAmount += fData.SR_InvoiceAmount;
                    dt.SR_Discount += fData.SR_Discount;
                    dt.SR_ExDuty += fData.SR_ExDuty;
                    dt.SR_Vat += fData.SR_Vat;
                    dt.SR_Schame += fData.SR_Schame;
                    dt.SR_Freight += fData.SR_Freight;
                    dt.SR_RoundOffAmt += fData.SR_RoundOffAmt;
                    dt.SR_VatAV += fData.SR_VatAV;
                    dt.SR_ExciseAV += fData.SR_ExciseAV;
                    dt.SR_NonTaxable += fData.SR_NonTaxable;
                    dt.PR_InvoiceAmount += fData.PR_InvoiceAmount;
                    dt.PR_Discount += fData.PR_Discount;
                    dt.PR_ExDuty += fData.PR_ExDuty;
                    dt.PR_Vat += fData.PR_Vat;
                    dt.PR_Schame += fData.PR_Schame;
                    dt.PR_Freight += fData.PR_Freight;
                    dt.PR_RoundOffAmt += fData.PR_RoundOffAmt;
                    dt.PR_VatAV += fData.PR_VatAV;
                    dt.PR_ExciseAV += fData.PR_ExciseAV;
                    dt.PR_NonTaxable += fData.PR_NonTaxable;
                    
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
                AutoNumber: '',
                Name: 'Total =>',
                
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
$timeout(function () {
            GlobalServices.getListState(EntityId, $scope.gridOptions);
        });

    }
     
    $scope.GetAccountConfirmationLetter = function () {

        var dateFrom = new Date(($filter('date')(new Date(), 'yyyy-MM-dd')));
        var dateTo = new Date(($filter('date')(new Date(), 'yyyy-MM-dd')));

        if ($scope.AccountConfirmationLetter.DateFromDet)
            dateFrom = $filter('date')($scope.AccountConfirmationLetter.DateFromDet.dateAD, 'yyyy-MM-dd');

        if ($scope.AccountConfirmationLetter.DateToDet)
            dateTo = $filter('date')($scope.AccountConfirmationLetter.DateToDet.dateAD, 'yyyy-MM-dd');

        $scope.DataColl = []; //declare an empty array
        $scope.gridOptions.api.setRowData($scope.DataColl);
         

        var beData = {
            dateFrom: dateFrom,
            dateTo: dateTo,
            LedgerGroupId: $scope.AccountConfirmationLetter.LedgerGroupId,
            ReportType: $scope.AccountConfirmationLetter.ReportType,
            BranchId: $scope.AccountConfirmationLetter.BranchId,
        };

        $scope.loadingstatus = 'running';
        showPleaseWait();

        $http({
            method: "post",
            url: base_url + "Account/Reporting/GetOneLakhAbovePurchase",
            data: JSON.stringify(beData),
            dataType: "json"
        }).then(function (res) {

            $scope.loadingstatus = 'stop';
            hidePleaseWait();

            if (res.data.IsSuccess && res.data.Data) {
                
                var dt = {
                    Name: 'TOTAL =>',
                    Opening: 0,
                    DrAmt: 0,
                    CrAmt: 0,
                    Closing: 0,
                    S_InvoiceAmount: 0,
                    S_Discount: 0,
                    S_ExDuty: 0,
                    S_Vat: 0,
                    S_Schame: 0,
                    S_Freight: 0,
                    S_RoundOffAmt: 0,
                    S_VatAV: 0,
                    S_ExciseAV: 0,
                    S_NonTaxable: 0,
                    P_InvoiceAmount: 0,
                    P_Discount: 0,
                    P_ExDuty: 0,
                    P_Vat: 0,
                    P_Schame: 0,
                    P_Freight: 0,
                    P_RoundOffAmt: 0,
                    P_VatAV: 0,
                    P_ExciseAV: 0,
                    P_NonTaxable: 0,
                    SR_InvoiceAmount: 0,
                    SR_Discount: 0,
                    SR_ExDuty: 0,
                    SR_Vat: 0,
                    SR_Schame: 0,
                    SR_Freight: 0,
                    SR_RoundOffAmt: 0,
                    SR_VatAV: 0,
                    SR_ExciseAV: 0,
                    SR_NonTaxable: 0,
                    PR_InvoiceAmount: 0,
                    PR_Discount: 0,
                    PR_ExDuty: 0,
                    PR_Vat: 0,
                    PR_Schame: 0,
                    PR_Freight: 0,
                    PR_RoundOffAmt: 0,
                    PR_VatAV: 0,
                    PR_ExciseAV: 0,
                    PR_NonTaxable: 0,
                }
                angular.forEach(res.data.Data, function (fData) {
                    dt.Opening += fData.Opening;
                    dt.DrAmt += fData.DrAmt;
                    dt.CrAmt += fData.CrAmt;
                    dt.Closing += fData.Closing;
                    dt.S_InvoiceAmount += fData.S_InvoiceAmount;
                    dt.S_Discount += fData.S_Discount;
                    dt.S_ExDuty += fData.S_ExDuty;
                    dt.S_Vat += fData.S_Vat;
                    dt.S_Schame += fData.S_Schame;
                    dt.S_Freight += fData.S_Freight;
                    dt.S_RoundOffAmt += fData.S_RoundOffAmt;
                    dt.S_VatAV += fData.S_VatAV;
                    dt.S_ExciseAV += fData.S_ExciseAV;
                    dt.S_NonTaxable += fData.S_NonTaxable;
                    dt.P_InvoiceAmount += fData.P_InvoiceAmount;
                    dt.P_Discount += fData.P_Discount;
                    dt.P_ExDuty += fData.P_ExDuty;
                    dt.P_Vat += fData.P_Vat;
                    dt.P_Schame += fData.P_Schame;
                    dt.P_Freight += fData.P_Freight;
                    dt.P_RoundOffAmt += fData.P_RoundOffAmt;
                    dt.P_VatAV += fData.P_VatAV;
                    dt.P_ExciseAV += fData.P_ExciseAV;
                    dt.P_NonTaxable += fData.P_NonTaxable;
                    dt.SR_InvoiceAmount += fData.SR_InvoiceAmount;
                    dt.SR_Discount += fData.SR_Discount;
                    dt.SR_ExDuty += fData.SR_ExDuty;
                    dt.SR_Vat += fData.SR_Vat;
                    dt.SR_Schame += fData.SR_Schame;
                    dt.SR_Freight += fData.SR_Freight;
                    dt.SR_RoundOffAmt += fData.SR_RoundOffAmt;
                    dt.SR_VatAV += fData.SR_VatAV;
                    dt.SR_ExciseAV += fData.SR_ExciseAV;
                    dt.SR_NonTaxable += fData.SR_NonTaxable;
                    dt.PR_InvoiceAmount += fData.PR_InvoiceAmount;
                    dt.PR_Discount += fData.PR_Discount;
                    dt.PR_ExDuty += fData.PR_ExDuty;
                    dt.PR_Vat += fData.PR_Vat;
                    dt.PR_Schame += fData.PR_Schame;
                    dt.PR_Freight += fData.PR_Freight;
                    dt.PR_RoundOffAmt += fData.PR_RoundOffAmt;
                    dt.PR_VatAV += fData.PR_VatAV;
                    dt.PR_ExciseAV += fData.PR_ExciseAV;
                    dt.PR_NonTaxable += fData.PR_NonTaxable;

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

                                                    var sm = ($scope.AccountConfirmationLetter.PeriodOPT == 2 ? $scope.AccountConfirmationLetter.SelectedMonth : null);
                                                    var rptPara = {
                                                        rpttranid: rptTranId,
                                                        istransaction: false,
                                                        entityid: EntityId,
                                                        voucherid: 0,
                                                        tranid: 0,
                                                        vouchertype: 0,
                                                        sessionid: res.data.Data.ResponseId,
                                                        Period: $scope.AccountConfirmationLetter.DateFromDet.dateBS + " TO " + $scope.AccountConfirmationLetter.DateToDet.dateBS,
                                                        FYear: (dataColl && dataColl.length > 0 ? dataColl[0].ForYear : ''),
                                                        NY: sm ? sm.NY : 0,
                                                        NM: sm ? sm.NM : 0,
                                                        MonthName: sm ? sm.MonthName : '',
                                                        ForMonth: sm ? sm.MonthName : '',
                                                        FiscalYear: (dataColl && dataColl.length > 0 ? dataColl[0].ForYear : ''),
                                                        BranchId: $scope.AccountConfirmationLetter.BranchId,

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

                                var sm = ($scope.AccountConfirmationLetter.PeriodOPT == 2 ? $scope.AccountConfirmationLetter.SelectedMonth : null);
                                var rptPara = {
                                    rpttranid: rptTranId,
                                    istransaction: false,
                                    entityid: EntityId,
                                    voucherid: 0,
                                    tranid: 0,
                                    vouchertype: 0,
                                    sessionid: res.data.Data.ResponseId,
                                    Period: $scope.AccountConfirmationLetter.DateFromDet.dateBS + " TO " + $scope.AccountConfirmationLetter.DateToDet.dateBS,
                                    FYear: (dataColl && dataColl.length > 0 ? dataColl[0].ForYear : ''),
                                    NY: sm ? sm.NY : 0,
                                    NM: sm ? sm.NM : 0,
                                    MonthName: sm ? sm.MonthName : '',
                                    ForMonth: sm ? sm.MonthName : '',
                                    FiscalYear: (dataColl && dataColl.length > 0 ? dataColl[0].ForYear : ''),
                                    BranchId: $scope.AccountConfirmationLetter.BranchId,
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

                } else
                    Swal.fire('No Templates found for print');
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    };

    $scope.GetDataForPrint = function () {

        var finalFilterData = [];
        var filterData = [];
        $scope.gridOptions.api.forEachNodeAfterFilterAndSort(function (node) {
            var dayBook = node.data;
            filterData.push(dayBook);
        });

        if ($scope.AccountConfirmationLetter.GroupBy == 1) {

            var query = mx(filterData).groupBy(t => t.PanVatNo);            
            angular.forEach(query, function (q)
            {
                var mxEL = mx(q.elements);
                var beData = {
                    Address: q.elements[0].Address,
                    Agent: q.elements[0].Agent,
                    Opening: mxEL.sum(p1 => p1.Opening),
                    CrAmount: mxEL.sum(p1 => p1.CrAmount),
                    DrAmount: mxEL.sum(p1 => p1.DrAmount),
                    Closing: mxEL.sum(p1 => p1.Closing),                    
                    SalesInvoiceAmount: mxEL.sum(p1 => p1.SalesInvoiceAmount),
                    SalesDiscount: mxEL.sum(p1 => p1.SalesDiscount),
                    SalesExDuty: mxEL.sum(p1 => p1.SalesExDuty),                    
                    SalesVat: mxEL.sum(p1 => p1.SalesVat),
                    SalesSchame: mxEL.sum(p1 => p1.SalesSchame),
                    SalesFreight: mxEL.sum(p1 => p1.SalesFreight),

                    PurchaseInvoiceAmount: mxEL.sum(p1 => p1.PurchaseInvoiceAmount),
                    PurchaseDiscount: mxEL.sum(p1 => p1.PurchaseDiscount),
                    PurchaseExDuty: mxEL.sum(p1 => p1.PurchaseExDuty),
                    PurchaseVat: mxEL.sum(p1 => p1.PurchaseVat),
                    PurchaseSchame: mxEL.sum(p1 => p1.PurchaseSchame),
                    PurchaseFreight: mxEL.sum(p1 => p1.PurchaseFreight),

                    ActualSales: mxEL.sum(p1 => p1.ActualSales),
                    ActualVat: mxEL.sum(p1 => p1.ActualVat),
                    TaxAbleSales: mxEL.sum(p1 => p1.TaxAbleSales),
                    NonTaxAbleSales: mxEL.sum(p1 => p1.NonTaxAbleSales),
                    RoundOffAmt: mxEL.sum(p1 => p1.RoundOffAmt),
                    SalesVatAV: mxEL.sum(p1 => p1.SalesVatAV),
                    SalesExciseAV: mxEL.sum(p1 => p1.SalesExciseAV),
                    PurchaseVatAV: mxEL.sum(p1 => p1.PurchaseVatAV),
                    PurchaseExciseAV: mxEL.sum(p1 => p1.PurchaseExciseAV),
                    NonTaxAblePurchase: mxEL.sum(p1 => p1.NonTaxAblePurchase),

                    GroupName: q.elements[0].GroupName,
                    LedgerId: q.elements[0].LedgerId,
                    Name:q.elements[0].Name,
                    
                    PanVatNo: q.elements[0].PanVatNo,
                     
                }; 
               finalFilterData.push(beData);
            })

        } else if ($scope.AccountConfirmationLetter.GroupBy == 2) {
            var query = mx(filterData).groupBy(t => t.Name);
            angular.forEach(query, function (q) {
                var mxEL = mx(q.elements);
                var beData = {
                    Address: q.elements[0].Address,
                    Agent: q.elements[0].Agent,
                    Closing: mxEL.sum(p1 => p1.Closing),
                    CrAmount: mxEL.sum(p1 => p1.CrAmount),
                    DrAmount: mxEL.sum(p1 => p1.DrAmount),
                    GroupName: q.elements[0].GroupName,
                    LedgerId: q.elements[0].LedgerId,
                    Name: q.elements[0].Name,
                    Opening: mxEL.sum(p1 => p1.Opening),
                    PanVatNo: q.elements[0].PanVatNo,
                    PurchaseDiscount: mxEL.sum(p1 => p1.PurchaseDiscount),
                    PurchaseExDuty: mxEL.sum(p1 => p1.PurchaseExDuty),
                    PurchaseFreight: mxEL.sum(p1 => p1.PurchaseFreight),
                    PurchaseInvoiceAmount: mxEL.sum(p1 => p1.PurchaseInvoiceAmount),
                    PurchaseSchame: mxEL.sum(p1 => p1.PurchaseSchame),
                    PurchaseVat: mxEL.sum(p1 => p1.PurchaseVat),
                    SalesDiscount: mxEL.sum(p1 => p1.SalesDiscount),
                    SalesExDuty: mxEL.sum(p1 => p1.SalesExDuty),
                    SalesFreight: mxEL.sum(p1 => p1.SalesFreight),
                    SalesInvoiceAmount: mxEL.sum(p1 => p1.SalesInvoiceAmount),
                    SalesSchame: mxEL.sum(p1 => p1.SalesSchame),
                    SalesVat: mxEL.sum(p1 => p1.SalesVat),
                    ActualSales: mxEL.sum(p1 => p1.ActualSales),
                    ActualVat: mxEL.sum(p1 => p1.ActualVat),
                    TaxAbleSales: mxEL.sum(p1 => p1.TaxAbleSales),
                    NonTaxAbleSales: mxEL.sum(p1 => p1.NonTaxAbleSales),
                    RoundOffAmt: mxEL.sum(p1 => p1.RoundOffAmt),
                    SalesVatAV: mxEL.sum(p1 => p1.SalesVatAV),
                    SalesExciseAV: mxEL.sum(p1 => p1.SalesExciseAV),
                    PurchaseVatAV: mxEL.sum(p1 => p1.PurchaseVatAV),
                    PurchaseExciseAV: mxEL.sum(p1 => p1.PurchaseExciseAV),
                    NonTaxAblePurchase: mxEL.sum(p1 => p1.NonTaxAblePurchase),
                };
                finalFilterData.push(beData);
            })
        }
        else {
            finalFilterData = filterData;
        }
       

        return finalFilterData;

    };

    $scope.onFilterTextBoxChanged = function () {
        $scope.gridOptions.api.setQuickFilter($scope.search);
    }


    $scope.DownloadAsXls = function () {

        $scope.loadingstatus = 'running';
        showPleaseWait();

        var dataColl = $scope.GetDataForPrint();

        var sm = ($scope.AccountConfirmationLetter.PeriodOPT == 2 ? $scope.AccountConfirmationLetter.SelectedMonth : null);
        var paraData = {
            Period: $scope.AccountConfirmationLetter.DateFromDet.dateBS + " TO " + $scope.AccountConfirmationLetter.DateToDet.dateBS,
            FYear: (dataColl && dataColl.length > 0 ? dataColl[0].ForYear : ''),
            NY: sm ? sm.NY : 0,
            NM: sm ? sm.NM : 0,
            MonthName: sm ? sm.MonthName : '',
            ForMonth: sm ? sm.MonthName : '',
            FiscalYear: (dataColl && dataColl.length > 0 ? dataColl[0].ForYear : ''),
            BranchId: $scope.AccountConfirmationLetter.BranchId,
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
                down_file(base_url + "//" + res.data.Data.ResponseId, "OneLakhAbovePurchase.xlsx");
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
