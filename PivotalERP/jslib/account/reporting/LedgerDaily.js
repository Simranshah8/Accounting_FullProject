"use strict";

agGrid.initialiseAgGridWithAngular1(angular);

app.controller("LedgerDailySummary", function ($scope, $http, $filter, $timeout, GlobalServices, $compile) {
var PrintPreviewAs = 1;
 const contextMenu = GlobalServices.createElementForMenu();
    LoadData();

    $scope.onBtExportCSV = function () {
        var params = {
            fileName: 'LedgerDailySummary.csv',
            sheetName: 'LedgerDailySummary'
        };

        $scope.gridOptions.api.exportDataAsCsv(params);
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



        $scope.ReportFormatColl = [{ id: 1, text: 'Monthly' }, { id: 2, text: 'Daily' }];
         

        //Search Drop DownList
        $scope.VoucherSearchOptions = [ ];

        //Filter Dialog Box Details 
        $scope.BranchTypeColl = [];
        $scope.VoucherTypeColl = [];
        $scope.LedgerGroupTypeColl = [];
        $scope.ExpressionColl = GlobalServices.getExpression();
        $scope.ConditionColl = GlobalServices.getLogicCondition();
        $scope.FilterColumnColl = [{ text: 'Opening', value: 'Opening', dataType: 'Number' },
        { text: 'Opening Dr', value: 'OpeningDr', dataType: 'Number' },
        { text: 'Opening Cr', value: 'OpeningCr', dataType: 'Number' },
        { text: 'Total Opening Dr', value: 'TotalOpeningDr', dataType: 'Number' },
        { text: 'TotalOpening Cr', value: 'TotalOpeningCr', dataType: 'Number' },
        { text: 'Transaction', value: 'Transaction', dataType: 'Number' },
        { text: 'Transaction Dr', value: 'TransactionDr', dataType: 'Number' },
        { text: 'Transaction Cr', value: 'TransactionCr', dataType: 'Number' },
        { text: 'Closing', value: 'Closing', dataType: 'Number' },
        { text: 'Closing Dr', value: 'ClosingDr', dataType: 'Number' },
        { text: 'Closing Cr', value: 'ClosingCr', dataType: 'Number' },
        { text: 'LedgerName', value: 'LedgerName', dataType: 'text' },];

        //For user list branchList Ledgerlist in filter

        ///////----------End of Filter----------/////////////

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



        $scope.LedgerDailySummary = {
            LedgerId: 0,
            DateFrom_TMP: new Date(),
            DateTo_TMP: new Date(),
            Format:2,

        };
        $scope.OpeningAmt = 0;
        $scope.CurrentAmt = 0;
        $scope.TotalAmt = 0;
        $scope.ReportName = '';
        $scope.noofdecimal = 2;

        $scope.loadingstatus = "stop";

        var columnDefs = [

            {
                headerName: "Particulars", width: 210, field: "MonthName", cellStyle: { 'text-align': 'left' }, pinned: 'left',
                cellRenderer:
                    function (params) {
                        var d = params.data;

                        if (d.Year)
                            return d.Year + ' ' + d.MonthName + (d.Day ?  ' ' + d.Day : '');
                        else
                            return d.MonthName;
                    },

            },
            { headerName: "Opening", width: 120, field: "Opening", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "Debit", width: 120, field: "DrAmount", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "Credit", width: 120, field: "CrAmount", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "Closing", width: 120, field: "Closing", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },

            { headerName: "Receipt_Dr", width: 150, hide: true, colId: 'det1', field: "Receipt_Dr", cellStyle: { 'text-align': 'right' }, headerClass: 'headtext-center', filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "Receipt_Cr", width: 150, hide: true, colId: 'det2', field: "Receipt_Cr", cellStyle: { 'text-align': 'right' }, headerClass: 'headtext-center', filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "Payment_Dr", width: 150, hide: true, colId: 'det3', field: "Payment_Dr", cellStyle: { 'text-align': 'right' }, headerClass: 'headtext-center', filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "Payment_Cr", width: 150, hide: true, colId: 'det4', field: "Payment_Cr", cellStyle: { 'text-align': 'right' }, headerClass: 'headtext-center', filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "Journal_Dr", width: 150, hide: true, colId: 'det5', field: "Journal_Dr", cellStyle: { 'text-align': 'right' }, headerClass: 'headtext-center', filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "Journal_Cr", width: 150, hide: true, colId: 'det6', field: "Journal_Cr", cellStyle: { 'text-align': 'right' }, headerClass: 'headtext-center', filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "Contra_Dr", width: 150, hide: true, colId: 'det7', field: "Contra_Dr", cellStyle: { 'text-align': 'right' }, headerClass: 'headtext-center', filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "Contra_Cr", width: 150, hide: true, colId: 'det8', field: "Contra_Cr", cellStyle: { 'text-align': 'right' }, headerClass: 'headtext-center', filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "ReceiptNote_Dr", width: 150, hide: true, colId: 'det9', field: "ReceiptNote_Dr", cellStyle: { 'text-align': 'right' }, headerClass: 'headtext-center', filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "ReceiptNote_Cr", width: 150, hide: true, colId: 'det10', field: "ReceiptNote_Cr", cellStyle: { 'text-align': 'right' }, headerClass: 'headtext-center', filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "PurchaseInvoice_Dr", width: 150, hide: true, colId: 'det11', field: "PurchaseInvoice_Dr", cellStyle: { 'text-align': 'right' }, headerClass: 'headtext-center', filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "PurchaseInvoice_Cr", width: 150, hide: true, colId: 'det12', field: "PurchaseInvoice_Cr", cellStyle: { 'text-align': 'right' }, headerClass: 'headtext-center', filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "PurchaseAdditionalInvoice_Dr", width: 150, hide: true, colId: 'det13', field: "PurchaseAdditionalInvoice_Dr", cellStyle: { 'text-align': 'right' }, headerClass: 'headtext-center', filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "PurchaseAdditionalInvoice_Cr", width: 150, hide: true, colId: 'det14', field: "PurchaseAdditionalInvoice_Cr", cellStyle: { 'text-align': 'right' }, headerClass: 'headtext-center', filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "PurchaseReturn_Dr", width: 150, hide: true, colId: 'det15', field: "PurchaseReturn_Dr", cellStyle: { 'text-align': 'right' }, headerClass: 'headtext-center', filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "PurchaseReturn_Cr", width: 150, hide: true, colId: 'det16', field: "PurchaseReturn_Cr", cellStyle: { 'text-align': 'right' }, headerClass: 'headtext-center', filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "DeliveryNote_Dr", width: 150, hide: true, colId: 'det17', field: "DeliveryNote_Dr", cellStyle: { 'text-align': 'right' }, headerClass: 'headtext-center', filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "DeliveryNote_Cr", width: 150, hide: true, colId: 'det18', field: "DeliveryNote_Cr", cellStyle: { 'text-align': 'right' }, headerClass: 'headtext-center', filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "SalesInvoice_Dr", width: 150, hide: true, colId: 'det19', field: "SalesInvoice_Dr", cellStyle: { 'text-align': 'right' }, headerClass: 'headtext-center', filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "SalesInvoice_Cr", width: 150, hide: true, colId: 'det20', field: "SalesInvoice_Cr", cellStyle: { 'text-align': 'right' }, headerClass: 'headtext-center', filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "SalesReturn_Dr", width: 150, hide: true, colId: 'det21', field: "SalesReturn_Dr", cellStyle: { 'text-align': 'right' }, headerClass: 'headtext-center', filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "SalesReturn_Cr", width: 150, hide: true, colId: 'det22', field: "SalesReturn_Cr", cellStyle: { 'text-align': 'right' }, headerClass: 'headtext-center', filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "ReceivedChallan_Dr", width: 150, hide: true, colId: 'det23', field: "ReceivedChallan_Dr", cellStyle: { 'text-align': 'right' }, headerClass: 'headtext-center', filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "ReceivedChallan_Cr", width: 150, hide: true, colId: 'det24', field: "ReceivedChallan_Cr", cellStyle: { 'text-align': 'right' }, headerClass: 'headtext-center', filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "ReceiptNoteReturn_Dr", width: 150, hide: true, colId: 'det25', field: "ReceiptNoteReturn_Dr", cellStyle: { 'text-align': 'right' }, headerClass: 'headtext-center', filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "ReceiptNoteReturn_Cr", width: 150, hide: true, colId: 'det26', field: "ReceiptNoteReturn_Cr", cellStyle: { 'text-align': 'right' }, headerClass: 'headtext-center', filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "SalesAllotment_Dr", width: 150, hide: true, colId: 'det27', field: "SalesAllotment_Dr", cellStyle: { 'text-align': 'right' }, headerClass: 'headtext-center', filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "SalesAllotment_Cr", width: 150, hide: true, colId: 'det28', field: "SalesAllotment_Cr", cellStyle: { 'text-align': 'right' }, headerClass: 'headtext-center', filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "SalesAllotmentCancel_Dr", width: 150, hide: true, colId: 'det29', field: "SalesAllotmentCancel_Dr", cellStyle: { 'text-align': 'right' }, headerClass: 'headtext-center', filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "SalesAllotmentCancel_Cr", width: 150, hide: true, colId: 'det30', field: "SalesAllotmentCancel_Cr", cellStyle: { 'text-align': 'right' }, headerClass: 'headtext-center', filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "PurchaseDebitNote_Dr", width: 150, hide: true, colId: 'det31', field: "PurchaseDebitNote_Dr", cellStyle: { 'text-align': 'right' }, headerClass: 'headtext-center', filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "PurchaseDebitNote_Cr", width: 150, hide: true, colId: 'det32', field: "PurchaseDebitNote_Cr", cellStyle: { 'text-align': 'right' }, headerClass: 'headtext-center', filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "PurchaseCreditNote_Dr", width: 150, hide: true, colId: 'det33', field: "PurchaseCreditNote_Dr", cellStyle: { 'text-align': 'right' }, headerClass: 'headtext-center', filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "PurchaseCreditNote_Cr", width: 150, hide: true, colId: 'det34', field: "PurchaseCreditNote_Cr", cellStyle: { 'text-align': 'right' }, headerClass: 'headtext-center', filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "SalesDebitNote_Dr", width: 150, hide: true, colId: 'det35', field: "SalesDebitNote_Dr", cellStyle: { 'text-align': 'right' }, headerClass: 'headtext-center', filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "SalesDebitNote_Cr", width: 150, hide: true, colId: 'det36', field: "SalesDebitNote_Cr", cellStyle: { 'text-align': 'right' }, headerClass: 'headtext-center', filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "SalesCreditNote_Dr", width: 150, hide: true, colId: 'det37', field: "SalesCreditNote_Dr", cellStyle: { 'text-align': 'right' }, headerClass: 'headtext-center', filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "SalesCreditNote_Cr", width: 150, hide: true, colId: 'det38', field: "SalesCreditNote_Cr", cellStyle: { 'text-align': 'right' }, headerClass: 'headtext-center', filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "SalesAllotmentReturn_Dr", width: 150, hide: true, colId: 'det39', field: "SalesAllotmentReturn_Dr", cellStyle: { 'text-align': 'right' }, headerClass: 'headtext-center', filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "SalesAllotmentReturn_Cr", width: 150, hide: true, colId: 'det40', field: "SalesAllotmentReturn_Cr", cellStyle: { 'text-align': 'right' }, headerClass: 'headtext-center', filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "ProductionAditionalCost_Dr", width: 150, hide: true, colId: 'det41', field: "ProductionAditionalCost_Dr", cellStyle: { 'text-align': 'right' }, headerClass: 'headtext-center', filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "ProductionAditionalCost_Cr", width: 150, hide: true, colId: 'det42', field: "ProductionAditionalCost_Cr", cellStyle: { 'text-align': 'right' }, headerClass: 'headtext-center', filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },

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

                //var dt = {
                //    MonthName: 'TOTAL =>',
                //    DrAmount: 0,
                //    CrAmount: 0,
                //    Opening: 0,
                //    Closing: 0,                    

                //}
                //$scope.gridOptions.api.forEachNodeAfterFilterAndSort(function (node) {
                //    var fData = node.data;
                //    dt.DrAmount += fData.DrAmount;
                //    dt.CrAmount += fData.CrAmount;               
                //});


                //var filterDataColl = [];
                //filterDataColl.push(dt);

                //$scope.gridOptionsBottom.api.setRowData(filterDataColl);
            }

        };
        $scope.eGridDiv = document.querySelector('#datatable');

        // create the grid passing in the div to use together with the columns & data we want to use
        new agGrid.Grid($scope.eGridDiv, $scope.gridOptions);

        $scope.gridOptionsBottom = {
            defaultColDef: {
                resizable: true,
                width: 90
            },
            columnDefs: columnDefs,
            // we are hard coding the data here, it's just for demo purposes
            rowData: [],
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
            GlobalServices.getCompanyDet().then(function (res) {
                var comDet = res.data.Data;
                if (comDet) {
                    $scope.LedgerDailySummary.DateFrom_TMP = new Date(comDet.StartDate);
                }
            }, function (errormessage) {
                alert('Unable to Delete data. pls try again.' + errormessage.responseText);
            });
        });

$timeout(function () {
            GlobalServices.getListState(EntityId, $scope.gridOptions);
        });

    }


    $scope.ShowDetails = function (val) {
        for (var i = 1; i < 43; i++) {

            var colName = 'det' + i.toString();
            $scope.gridOptions.columnApi.setColumnVisible(colName, val);
        }
    }

    $scope.ClearData = function () {
        var DataColl = [];
        $scope.gridOptionsBottom.api.setRowData(DataColl);
        $scope.gridOptions.api.setRowData(DataColl);
    };

    $scope.GetLedgerDailySummary = function () {
        $scope.ClearData();

        if (!$scope.LedgerDailySummary.LedgerId)
            return;

        var dateFrom = new Date(($filter('date')(new Date(), 'yyyy-MM-dd')));
        var dateTo = new Date(($filter('date')(new Date(), 'yyyy-MM-dd')));

        if ($scope.LedgerDailySummary.DateFromDet)
            dateFrom = new Date(($filter('date')($scope.LedgerDailySummary.DateFromDet.dateAD, 'yyyy-MM-dd')));

        if ($scope.LedgerDailySummary.DateToDet)
            dateTo = new Date(($filter('date')($scope.LedgerDailySummary.DateToDet.dateAD, 'yyyy-MM-dd')));

        var beData = {
            LedgerId: $scope.LedgerDailySummary.LedgerId,
            BranchIdColl: ($scope.LedgerDailySummary.GodownId ? $scope.LedgerDailySummary.GodownId : ''),
            dateFrom: dateFrom,
            dateTo: dateTo,
            Format: $scope.LedgerDailySummary.Format,
            dateStyle: $scope.GenConfig.DateStyle==1 ? 0 :1,
        };

        $scope.loadingstatus = 'running';
        showPleaseWait();

        $http({
            method: "POST",
            url: base_url + "Account/Reporting/GetLedgerDailySummary",
            data: JSON.stringify(beData),
            dataType: "json"
        }).then(function (res) {

            $scope.loadingstatus = 'stop';
            hidePleaseWait();

            if (res.data.IsSuccess && res.data.Data) {
                var tmpData = res.data.Data;
                var DataColl = mx(tmpData.DataColl);

                var totalRow = {
                    MonthName: 'TOTAL => ',
                    DrAmount: tmpData.DrAmount,
                    CrAmount: tmpData.CrAmount,  
                    Opening: tmpData.Opening,
                    Closing: tmpData.Closing
                };
 

                var footerDataColl = [];
                footerDataColl.push(totalRow);
                $scope.gridOptionsBottom.api.setRowData(footerDataColl);

                $scope.gridOptions.api.setRowData(DataColl);
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
                                                        Period: $scope.LedgerDailySummary.DateFromDet.dateBS + " TO " + $scope.LedgerDailySummary.DateToDet.dateBS,
                                                        Product: $scope.LedgerDailySummary.productDetail.Name,
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
                                    Period: $scope.LedgerDailySummary.DateFromDet.dateBS + " TO " + $scope.LedgerDailySummary.DateToDet.dateBS,
                                    Product: $scope.LedgerDailySummary.productDetail.Name,
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
                down_file(base_url + "//" + res.data.Data.ResponseId, "LedgerDailySummary.xlsx");
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
