"use strict";

agGrid.initialiseAgGridWithAngular1(angular);

app.controller("GroupwiseTBController", function ($scope, $http, $filter, $timeout, GlobalServices, $compile) {
var PrintPreviewAs = 1;
 const contextMenu = GlobalServices.createElementForMenu();
    getterAndSetter();
    LoadData();

    $scope.onBtExportCSV = function () {
        var params = {
            fileName: 'Groupwise.csv',
            sheetName: 'Groupwise'
        };

        $scope.gridOptions.api.exportDataAsCsv(params);
    }
    $scope.toggleExpandCollapse = function () {
        if ($scope.Groupwise.ExpandCollapse == true) {
            $scope.gridOptions.api.expandAll();
        } else {
            $scope.gridOptions.api.collapseAll();
        }
    };
    function getterAndSetter() {

        $scope.columnDefs = [
            {
                headerName: "Particulars", field: "Particulars", cellRenderer: 'agGroupCellRenderer', width: 320, dataType: 'Text', filter: "agTextColumnFilter", pinned: 'left', showRowGroup: true,
                cellRendererParams: {
                    suppressCount: false, // turn off the row count                   
                },
                //cellRenderer: function (params) {
                //    var beData = params.data;

                //    if (beData.IsLedgerGroup == true) {
                //        return beData.LedgerGroupName;
                //    }
                //    else
                //        return '<a class="clickcursor" data-toggle="tooltip" data-placement="top" title="View Product" ng-click="ShowLedger(this.data)">' + params.data.LedgerName + '</a> ';                     
                //}
                valueGetter: function (params) {
                    var beData = params.data;

                    if (beData.IsLedgerGroup == true) {
                        return beData.LedgerGroupName;
                    }
                    else
                        return beData.LedgerName;
                },
                cellStyle: function (params) {
                    if (!params.data) return null;

                    const status = params.data.IsLedgerGroup;

                    if (status ===true) {
                        return { fontWeight: 'bold' };
                    }

                    return null;
                }


            },
            {
                headerName: "Group", field: "GroupingName", width: 150, filter: "agTextColumnFilter", hide: true, colId: 'colGroup',
            },            
            {
                headerName: "Opening", colId: 'colOpening', field: "Opening", width: 150, filter: "agNumberColumnFilter", dataType: 'Number', valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' }, headerClass: 'headtext-center',
                cellStyle: function (params) {
                    if (!params.data) return null;

                    const status = params.data.IsLedgerGroup;

                    if (status === true) {
                        return { fontWeight: 'bold' };
                    }

                    return null;
                }

            },
            {
                headerName: "Opening Dr", colId: 'colOpeningDr', hide: true, field: "TotalOpeningDr", width: 150, dataType: 'Number', filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' },
                cellStyle: function (params) {
                    if (!params.data) return null;

                    const status = params.data.IsLedgerGroup;

                    if (status === true) {
                        return { fontWeight: 'bold' };
                    }

                    return null;
                }

            },
            {
                headerName: "Opening Cr", colId: 'colOpeningCr', hide: true, field: "TotalOpeningCr", width: 150, dataType: 'Number', filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' },
                cellStyle: function (params) {
                    if (!params.data) return null;

                    const status = params.data.IsLedgerGroup;

                    if (status === true) {
                        return { fontWeight: 'bold' };
                    }

                    return null;
                }

            },

            {
                headerName: "Transaction Dr", field: "TransactionDr", width: 150, filter: "agNumberColumnFilter", dataType: 'Number', valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' }, headerClass: 'headtext-center',
                cellStyle: function (params) {
                    if (!params.data) return null;

                    const status = params.data.IsLedgerGroup;

                    if (status === true) {
                        return { fontWeight: 'bold' };
                    }

                    return null;
                }

            },
            {
                headerName: "Transaction Cr", field: "TransactionCr", width: 150, filter: "agNumberColumnFilter", dataType: 'Number', valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' }, headerClass: 'headtext-center',
                cellStyle: function (params) {
                    if (!params.data) return null;

                    const status = params.data.IsLedgerGroup;

                    if (status === true) {
                        return { fontWeight: 'bold' };
                    }

                    return null;
                }

            },
            {
                headerName: "Closing", colId: 'colClosing', field: "Closing", width: 150, filter: "agNumberColumnFilter", dataType: 'Number', valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' }, headerClass: 'headtext-center',
                cellStyle: function (params) {
                    if (!params.data) return null;

                    const status = params.data.IsLedgerGroup;

                    if (status === true) {
                        return { fontWeight: 'bold' };
                    }

                    return null;
                }

            },
            {
                headerName: "Closing Dr", colId: 'colClosingDr', hide: true, field: "ClosingDr", width: 150, dataType: 'Number', filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' },
                cellStyle: function (params) {
                    if (!params.data) return null;

                    const status = params.data.IsLedgerGroup;

                    if (status === true) {
                        return { fontWeight: 'bold' };
                    }

                    return null;
                }

            },
            {
                headerName: "Closing Cr", colId: 'colClosingCr', hide: true, field: "ClosingCr", width: 150, dataType: 'Number', filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' },
                cellStyle: function (params) {
                    if (!params.data) return null;

                    const status = params.data.IsLedgerGroup;

                    if (status === true) {
                        return { fontWeight: 'bold' };
                    }

                    return null;
                }

            },

            
            {
                headerName: "Alias", field: "Alias", width: 150, dataType: 'Text', filter: "agTextColumnFilter",
                cellStyle: function (params) {
                    if (!params.data) return null;

                    const status = params.data.IsLedgerGroup;

                    if (status === true) {
                        return { fontWeight: 'bold' };
                    }

                    return null;
                }


            },
            {
                headerName: "Code", field: "Code", width: 150, dataType: 'Text', filter: "agTextColumnFilter",
                cellStyle: function (params) {
                    if (!params.data) return null;

                    const status = params.data.IsLedgerGroup;

                    if (status === true) {
                        return { fontWeight: 'bold' };
                    }

                    return null;
                }

            },

            {
                headerName: "PDC", colId: 'colPDC', hide: true, field: "PDCAmt", width: 150, filter: "agNumberColumnFilter", dataType: 'Number', valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' }, headerClass: 'headtext-center',
                cellStyle: function (params) {
                    if (!params.data) return null;

                    const status = params.data.IsLedgerGroup;

                    if (status === true) {
                        return { fontWeight: 'bold' };
                    }

                    return null;
                }

            },
            {
                headerName: "PDC Closing", colId: 'colPDCClosing', hide: true, field: "PDCClosing", width: 150, filter: "agNumberColumnFilter", dataType: 'Number', valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' }, headerClass: 'headtext-center',
                cellStyle: function (params) {
                    if (!params.data) return null;

                    const status = params.data.IsLedgerGroup;

                    if (status === true) {
                        return { fontWeight: 'bold' };
                    }

                    return null;
                }

            },
            {
                headerName: "BG", colId: 'colBGAmt', hide: true, field: "BGAmt", width: 150, filter: "agNumberColumnFilter", dataType: 'Number', valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' }, headerClass: 'headtext-center',
                cellStyle: function (params) {
                    if (!params.data) return null;

                    const status = params.data.IsLedgerGroup;

                    if (status === true) {
                        return { fontWeight: 'bold' };
                    }

                    return null;
                }

            },
            {
                headerName: "ODC", colId: 'colODCAmt', hide: true, field: "ODCAmt", width: 150, filter: "agNumberColumnFilter", dataType: 'Number', valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' }, headerClass: 'headtext-center',
                cellStyle: function (params) {
                    if (!params.data) return null;

                    const status = params.data.IsLedgerGroup;

                    if (status === true) {
                        return { fontWeight: 'bold' };
                    }

                    return null;
                }

            },
           
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
            { headerName: "DeliveryNote_Cr", width: 150, hide: true, colId: 'det18', field: "DeliveryNote_Cr", cellStyle: { 'text-align': 'right' }, headerClass: 'headtext-center',filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
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
            { headerName: "SalesAllotmentReturn_Cr", width: 150, hide: true, colId: 'det40', field: "SalesAllotmentReturn_Cr", cellStyle: { 'text-align': 'right' }, headerClass: 'headtext-center',filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "ProductionAditionalCost_Dr", width: 150, hide: true, colId: 'det41', field: "ProductionAditionalCost_Dr", cellStyle: { 'text-align': 'right' }, headerClass: 'headtext-center', filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "ProductionAditionalCost_Cr", width: 150, hide: true, colId: 'det42', field: "ProductionAditionalCost_Cr", cellStyle: { 'text-align': 'right' }, headerClass: 'headtext-center', filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },

            //{
            //    headerName: 'Name & Country',
            //    colId:'mp1',
            //    children: [

            //    ]
            //},
            { headerName: "DR_M1", width: 200, hide: true, colId: 'm1', field: "DR_M1", cellStyle: { 'text-align': 'right' }, headerClass: 'headtext-center', filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "CR_M1", width: 200, hide: true, colId: 'm2', field: "CR_M1", cellStyle: { 'text-align': 'right' }, headerClass: 'headtext-center', filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "DR_M2", width: 200, hide: true, colId: 'm3', field: "DR_M2", cellStyle: { 'text-align': 'right' }, headerClass: 'headtext-center', filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "CR_M2", width: 200, hide: true, colId: 'm4', field: "CR_M2", cellStyle: { 'text-align': 'right' }, headerClass: 'headtext-center', filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "DR_M3", width: 200, hide: true, colId: 'm5', field: "DR_M3", cellStyle: { 'text-align': 'right' }, headerClass: 'headtext-center', filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "CR_M3", width: 200, hide: true, colId: 'm6', field: "CR_M3", cellStyle: { 'text-align': 'right' }, headerClass: 'headtext-center', filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "DR_M4", width: 200, hide: true, colId: 'm7', field: "DR_M4", cellStyle: { 'text-align': 'right' }, headerClass: 'headtext-center', filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "CR_M4", width: 200, hide: true, colId: 'm8', field: "CR_M4", cellStyle: { 'text-align': 'right' }, headerClass: 'headtext-center', filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "DR_M5", width: 200, hide: true, colId: 'm9', field: "DR_M5", cellStyle: { 'text-align': 'right' }, headerClass: 'headtext-center', filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "CR_M5", width: 200, hide: true, colId: 'm10', field: "CR_M5", cellStyle: { 'text-align': 'right' }, headerClass: 'headtext-center', filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "DR_M6", width: 200, hide: true, colId: 'm11', field: "DR_M6", cellStyle: { 'text-align': 'right' }, headerClass: 'headtext-center', filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "CR_M6", width: 200, hide: true, colId: 'm12', field: "CR_M6", cellStyle: { 'text-align': 'right' }, headerClass: 'headtext-center', filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "DR_M7", width: 200, hide: true, colId: 'm13', field: "DR_M7", cellStyle: { 'text-align': 'right' }, headerClass: 'headtext-center', filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "CR_M7", width: 200, hide: true, colId: 'm14', field: "CR_M7", cellStyle: { 'text-align': 'right' }, headerClass: 'headtext-center', filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "DR_M8", width: 200, hide: true, colId: 'm15', field: "DR_M8", cellStyle: { 'text-align': 'right' }, headerClass: 'headtext-center', filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "CR_M8", width: 200, hide: true, colId: 'm16', field: "CR_M8", cellStyle: { 'text-align': 'right' }, headerClass: 'headtext-center', filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "DR_M9", width: 200, hide: true, colId: 'm17', field: "DR_M9", cellStyle: { 'text-align': 'right' }, headerClass: 'headtext-center', filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "CR_M9", width: 200, hide: true, colId: 'm18', field: "CR_M9", cellStyle: { 'text-align': 'right' }, headerClass: 'headtext-center', filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "DR_M10", width: 200, hide: true, colId: 'm19', field: "DR_M10", cellStyle: { 'text-align': 'right' }, headerClass: 'headtext-center', filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "CR_M10", width: 200, hide: true, colId: 'm20', field: "CR_M10", cellStyle: { 'text-align': 'right' }, headerClass: 'headtext-center', filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "DR_M11", width: 200, hide: true, colId: 'm21', field: "DR_M11", cellStyle: { 'text-align': 'right' }, headerClass: 'headtext-center', filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "CR_M11", width: 200, hide: true, colId: 'm22', field: "CR_M11", cellStyle: { 'text-align': 'right' }, headerClass: 'headtext-center', filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "DR_M12", width: 200, hide: true, colId: 'm23', field: "DR_M12", cellStyle: { 'text-align': 'right' }, headerClass: 'headtext-center', filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "CR_M12", width: 200, hide: true, colId: 'm24', field: "CR_M12", cellStyle: { 'text-align': 'right' }, headerClass: 'headtext-center', filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "DR_M13", width: 200, hide: true, colId: 'm25', field: "DR_M13", cellStyle: { 'text-align': 'right' }, headerClass: 'headtext-center', filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "CR_M13", width: 200, hide: true, colId: 'm26', field: "CR_M13", cellStyle: { 'text-align': 'right' }, headerClass: 'headtext-center', filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "DR_M14", width: 200, hide: true, colId: 'm27', field: "DR_M14", cellStyle: { 'text-align': 'right' }, headerClass: 'headtext-center', filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "CR_M14", width: 200, hide: true, colId: 'm28', field: "CR_M14", cellStyle: { 'text-align': 'right' }, headerClass: 'headtext-center', filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "DR_M15", width: 200, hide: true, colId: 'm29', field: "DR_M15", cellStyle: { 'text-align': 'right' }, headerClass: 'headtext-center', filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "CR_M15", width: 200, hide: true, colId: 'm30', field: "CR_M15", cellStyle: { 'text-align': 'right' }, headerClass: 'headtext-center', filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },

            {
                headerName: "Action",
                width: 50,
                cellRenderer: function (params) {
                    if (params.data.LedgerId > 0) {
                        return '<div class="btn-group" style="position: fixed; ">' +
                            '<button type="button" class="btn btn-default px-1 dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
                            '<span class="caret"></span>' +
                            '</button>' +
                            '<ul class="dropdown-menu dropdown-menu-right p-2" style="position: absolute; left: 0;">' +
                            '<li ng-show="this.data.LedgerId>0"><a data-toggle="tooltip" data-placement="top" title="Show Voucher" ng-click="ShowLedgerVoucher(this)"><i class="fas fa-info text-infor"></i> Show Voucher</a></li>' +
                            '<li ng-show="this.data.LedgerId>0"><a data-toggle="tooltip" data-placement="top" title="Show Ledger" ng-click="ShowLedger(this.data)"><i class="fas fa-info text-infor"></i> Show Ledger</a></li>' +
                            '</ul>' +
                            '</div>';
                    } else
                    {
                        return '';
                    }
                    
                },
                pinned: 'right'
            },

        ];

        // let the grid know which columns and what data to use
        $scope.gridOptions = {
			onCellContextMenu: onCellContextMenu, // Handle right-click event			
            angularCompileRows: true,
            columnDefs: $scope.columnDefs,
           // treeData: true,
            defaultColDef: {
                resizable: true,
                sortable: true,
                filter: true,
                resizable: true,
                cellStyle: { 'line-height': '31px' },
                rowSelection: 'multiple'
            },
            enableColResize: true,
			overlayLoadingTemplate: "Please Click the Load Bottom to display the data",
            rowData: null,
            filter: true,
            enableFilter: true,
            rowSelection: 'multiple',
            enableCellTextSelection:true,
            getNodeChildDetails: function (beData) {

                if (($scope.Groupwise.BranchId > 0 || $scope.BranchList.length==1) && $scope.Groupwise.ShowAsList == true)
                    return null;

                if ($scope.Groupwise.ShowZeroBalance == false) {
                    if (beData.Opening == 0 && beData.TransactionDr == 0 && beData.TransactionCr == 0) {
                        return null;
                    }
                }

                if (beData.ChieldColl && beData.ChieldColl.length > 0) {

                    var chColl = [];
                    angular.forEach(beData.ChieldColl, function (ch) {
                        if ($scope.Groupwise.ShowZeroBalance == false) {
                            if (ch.Opening == 0 && ch.TransactionDr == 0 && ch.TransactionCr == 0) {
                                
                            } else
                                chColl.push(ch);
                        } else {
                            chColl.push(ch);
                        }

                    });

                    return {
                        group: true,
                        children: chColl,
                        expanded: beData.open
                    };
                }
                else if (beData.IsLedgerGroup==undefined || beData.IsLedgerGroup == false) {

                    if (beData.NatureOfGroup == 2 || beData.NatureOfGroup == 3) {
                         
                        if ($scope.Groupwise.ReportType == 1) {

                            if (beData.RowType == 1 || beData.RowType == 3) {

                                if (beData.ChieldColl && beData.ChieldColl.length > 0) {
                                    return {
                                        group: true,
                                        children: beData.ChieldColl,
                                        expanded: beData.open
                                    };
                                } else {
                                    return null;
                                }

                            } else if (beData.RowType == 2) {

                                //if (beData.BranchWiseColl && beData.BranchWiseColl.length > 0) {
                                //    return {
                                //        group: true,
                                //        children: beData.BranchWiseColl,
                                //        expanded: beData.open
                                //    };
                                //} else {
                                //    return null;
                                //}


                            }
                            else if (beData.RowType == 4) {

                                if (beData.CostCenterColl && beData.CostCenterColl.length > 0) {

                                    var chColl = [];
                                    angular.forEach(beData.CostCenterColl, function (cc) {
                                        cc.LedgerName = cc.LedgerName + ' ' + cc.Brand;
                                        chColl.push(cc);
                                    });
                                    return {
                                        group: true,
                                        children: chColl,
                                        expanded: beData.open
                                    };
                                } else {
                                    return null;
                                }


                            } else {
                                return null;
                            }

                        }
                        else if ($scope.Groupwise.ReportType == 2)
                        {

                            if (beData.RowType == 1 || beData.RowType == 3) {

                                if (beData.ChieldColl && beData.ChieldColl.length > 0) {
                                    return {
                                        group: true,
                                        children: beData.ChieldColl,
                                        expanded: beData.open
                                    };
                                } else {
                                    return null;
                                }

                            } else if (beData.RowType == 2) {

                                if (beData.BranchWiseColl && beData.BranchWiseColl.length > 0) {
                                    return {
                                        group: true,
                                        children: beData.BranchWiseColl,
                                        expanded: beData.open
                                    };
                                } else {
                                    return null;
                                }


                            }
                            else if (beData.RowType == 4) {

                                if (beData.CostCenterColl && beData.CostCenterColl.length > 0) {

                                    var parentArrayColl = [];
                                    var groupBrand = mx(beData.CostCenterColl).groupBy(p1 => p1.Brand);
                                    angular.forEach(groupBrand, function (gb) {
                                        var sumQ = mx(gb.elements);
                                        var brand = {
                                            IsLedgerGroup: false,
                                            LedgerName: gb.key,
                                            Opening: sumQ.sum(p1 => p1.Opening),
                                            TransactionDr: sumQ.sum(p1 => p1.TransactionDr),
                                            TransactionCr: sumQ.sum(p1 => p1.TransactionCr),
                                            Closing: sumQ.sum(p1 => p1.Closing),
                                            ChieldColl: [],
                                        };

                                        var groupDepart = sumQ.groupBy(p1 => p1.Department);
                                        angular.forEach(groupDepart, function (dp) {
                                            var sumD = mx(dp.elements);
                                            var department = {
                                                IsLedgerGroup: false,
                                                LedgerName: dp.key,
                                                Opening: sumD.sum(p1 => p1.Opening),
                                                TransactionDr: sumD.sum(p1 => p1.TransactionDr),
                                                TransactionCr: sumD.sum(p1 => p1.TransactionCr),
                                                Closing: sumD.sum(p1 => p1.Closing),
                                                ChieldColl: [],
                                            };

                                            var groupCostCenter = sumD.groupBy(p1 => p1.LedgerName);
                                            angular.forEach(groupCostCenter, function (cc) {

                                                var sumCC = mx(cc.elements);
                                                var costCenter = {
                                                    IsLedgerGroup: false,
                                                    LedgerName: cc.key,
                                                    Opening: sumCC.sum(p1 => p1.Opening),
                                                    TransactionDr: sumCC.sum(p1 => p1.TransactionDr),
                                                    TransactionCr: sumCC.sum(p1 => p1.TransactionCr),
                                                    Closing: sumCC.sum(p1 => p1.Closing),
                                                    ChieldColl: [],
                                                };
                                                department.ChieldColl.push(costCenter);
                                            });

                                            brand.ChieldColl.push(department);
                                        });

                                        parentArrayColl.push(brand);
                                    });

                                    return {
                                        group: true,
                                        children: parentArrayColl,
                                        expanded: beData.open
                                    };
                                } else {
                                    return null;
                                }


                            } else {
                                return null;
                            }

                            
                        }
                        else if ($scope.Groupwise.ReportType == 3)
                        {

                            if (beData.RowType == 1 || beData.RowType == 3) {

                                if (beData.ChieldColl && beData.ChieldColl.length > 0) {
                                    return {
                                        group: true,
                                        children: beData.ChieldColl,
                                        expanded: beData.open
                                    };
                                } else {
                                    return null;
                                }

                            } else if (beData.RowType == 2) {

                                if (beData.BranchWiseColl && beData.BranchWiseColl.length > 0) {

                                    var chColl = [];
                                    angular.forEach(beData.BranchWiseColl, function (br) {
                                        if (br.CostCenterColl) {
                                            angular.forEach(br.CostCenterColl, function (cc) {
                                                cc.BranchName = br.LedgerName;
                                                chColl.push(cc);
                                            });
                                        }
                                    });

                                    var parentArrayColl = [];
                                    var groupBrand = mx(chColl).groupBy(p1 => p1.Brand);
                                    angular.forEach(groupBrand, function (gb) {
                                        var sumQ = mx(gb.elements);
                                        var brand = {
                                            IsLedgerGroup: false,
                                            LedgerName: gb.key,
                                            Opening: sumQ.sum(p1 => p1.Opening),
                                            TransactionDr: sumQ.sum(p1 => p1.TransactionDr),
                                            TransactionCr: sumQ.sum(p1 => p1.TransactionCr),
                                            Closing: sumQ.sum(p1 => p1.Closing),
                                            ChieldColl: [],
                                        };

                                        var groupDepart = sumQ.groupBy(p1 => p1.Department);
                                        angular.forEach(groupDepart, function (dp) {
                                            var sumD = mx(dp.elements);
                                            var department = {
                                                IsLedgerGroup: false,
                                                LedgerName: dp.key,
                                                Opening: sumD.sum(p1 => p1.Opening),
                                                TransactionDr: sumD.sum(p1 => p1.TransactionDr),
                                                TransactionCr: sumD.sum(p1 => p1.TransactionCr),
                                                Closing: sumD.sum(p1 => p1.Closing),
                                                ChieldColl: [],
                                            };

                                            var sumBB = mx(dp.elements);
                                            var groupBranch = sumBB.groupBy(p1 => p1.BranchName);
                                            angular.forEach(groupBranch, function (gb) {
                                                var subB = mx(gb.elements);
                                                var newBranch = {
                                                    IsLedgerGroup: false,
                                                    LedgerName: gb.key,
                                                    Opening: subB.sum(p1 => p1.Opening),
                                                    TransactionDr: subB.sum(p1 => p1.TransactionDr),
                                                    TransactionCr: subB.sum(p1 => p1.TransactionCr),
                                                    Closing: subB.sum(p1 => p1.Closing),
                                                    ChieldColl: [],
                                                };
                                                department.ChieldColl.push(newBranch);

                                            });


                                            brand.ChieldColl.push(department);
                                        });

                                        parentArrayColl.push(brand);
                                    });

                                    return {
                                        group: true,
                                        children: parentArrayColl,
                                        expanded: beData.open
                                    };

                                } else {
                                    return null;
                                }


                            }
                             else {
                                return null;
                            }

                        } else {
                            return {
                                group: true,
                                children: beData.CostCenterColl,
                                expanded: beData.open
                            };
                        }

                    } else {

                        if (beData.RowType == 1 || beData.RowType == 3) {

                            if (beData.ChieldColl && beData.ChieldColl.length > 0) {
                                return {
                                    group: true,
                                    children: beData.ChieldColl,
                                    expanded: beData.open
                                };
                            } else {
                                return null;
                            }
                            
                        } else if (beData.RowType == 2) {

                            if (beData.BranchWiseColl && beData.BranchWiseColl.length > 0 && ($scope.Groupwise.ReportType == 2 || $scope.Groupwise.ShowCostCenter == true))
                            {
                                if (beData.BranchWiseColl[0].CostCenterColl && beData.BranchWiseColl[0].CostCenterColl.length == 0) {
                                    return null;
                                }
                                else {
                                    return {
                                        group: true,
                                        children: beData.BranchWiseColl[0].CostCenterColl,
                                        expanded: beData.open
                                    };
                                }

                            }
                            else if (beData.BranchWiseColl && beData.BranchWiseColl.length > 1) {
                                return {
                                    group: true,
                                    children: beData.BranchWiseColl,
                                    expanded: beData.open
                                };
                            }
                            else {
                                return null;
                            }

                        }
                        else if (beData.RowType == 4) {

                            if (beData.CostCenterColl && beData.CostCenterColl.length > 0) {
                                var chColl = [];
                                angular.forEach(beData.CostCenterColl, function (cc) {
                                    cc.LedgerName = cc.LedgerName + ' ' + cc.Brand;
                                    chColl.push(cc);
                                });
                                return {
                                    group: true,
                                    children: chColl,
                                    expanded: beData.open
                                };
                            } else {
                                return null;
                            }

                          
                        } else {
                            return null;
                        }
                    }
                  
                  
                }else
                    return null;


            }
        };

        // lookup the container we want the Grid to use
        //var eGridDiv = document.querySelector('#myGrid1');

        // create the grid passing in the div to use together with the columns & data we want to use
        //new agGrid.Grid(eGridDiv, $scope.gridOptions);
		
		$timeout(function () {
            GlobalServices.getListState(EntityId, $scope.gridOptions);
        });
    }

    $scope.ShowLedger = function (obj) {
         
        $(document).ready(function () {
            $('body').css('cursor', 'wait');
        });

        var para = {
            tranId: obj.LedgerId
        };
        var frame = document.getElementById("frmChieldForm");
        var frameDoc = frame.contentDocument || frame.contentWindow.document;
        if (frameDoc)
            frameDoc.removeChild(frameDoc.documentElement);

        frame.src = '';
        frame.src = base_url + "Account/Creation/Ledger?" + param(para);
        document.body.style.cursor = 'default';

        $('#frmChieldForm').on('load', function () {
            $('body').css('cursor', 'default');
        });

        $('#frmChield').modal('show');
    }

    $scope.ShowLedgerVoucher = function (e) {
        var obj = e.data;

        if (obj.IsLedgerGroup == true || obj.LedgerId==0)
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

    $scope.ShowDetails = function (val) {
        for (var i = 1; i < 43; i++) {

            var colName = 'det' + i.toString();
            $scope.gridOptions.columnApi.setColumnVisible(colName, val);
        }
    }

    $scope.ShowPDC = function (val) {
        $scope.gridOptions.columnApi.setColumnVisible('colPDC', val);
        $scope.gridOptions.columnApi.setColumnVisible('colPDCClosing', val);
        $scope.gridOptions.columnApi.setColumnVisible('colBGAmt', val);
        $scope.gridOptions.columnApi.setColumnVisible('colODCAmt', val);
    }

    $scope.ShowMonthWise = function (val, monthList)
    {
        for (var i = 1; i < 31; i++) {
            var colName = 'm' + i.toString();
            $scope.gridOptions.columnApi.setColumnVisible(colName, false);
        }

        if (val == true) {
            var tm = monthList.length * 2;

            var mind = 0;
            for (var i = 1; i <= tm; i++) {
                var colName = 'm' + i.toString();
                var headerName = (i % 2 == 0 ? 'CR' : 'DR') + ' ' + monthList[mind].MonthName;
                var col = $scope.gridOptions.columnApi.getColumn(colName);
                if (col) {
                    col.headerName = headerName;
                    col.colDef.headerName = headerName;
                    $scope.gridOptions.columnApi.setColumnVisible(colName, true);
                }
                
                if (i % 2 == 0)
                    mind++;
            }

            $scope.gridOptions.api.refreshHeader();
        }
        

    }

    $scope.ShowDetailsDrCr = function (val) {

        if (val == true) {
            $scope.gridOptions.columnApi.setColumnVisible('colOpening', false);
            $scope.gridOptions.columnApi.setColumnVisible('colOpeningDr', true);
            $scope.gridOptions.columnApi.setColumnVisible('colOpeningCr', true);

            $scope.gridOptions.columnApi.setColumnVisible('colClosing', false);
            $scope.gridOptions.columnApi.setColumnVisible('colClosingDr', true);
            $scope.gridOptions.columnApi.setColumnVisible('colClosingCr', true);
        }
        else {

            $scope.gridOptions.columnApi.setColumnVisible('colOpening', true);
            $scope.gridOptions.columnApi.setColumnVisible('colOpeningDr', false);
            $scope.gridOptions.columnApi.setColumnVisible('colOpeningCr', false);

            $scope.gridOptions.columnApi.setColumnVisible('colClosing', true);
            $scope.gridOptions.columnApi.setColumnVisible('colClosingDr', false);
            $scope.gridOptions.columnApi.setColumnVisible('colClosingCr', false);
        }
        
    }
    function LoadData() {

        $('.select2').select2({
            allowClear: true,
            openOnEnter: true
        });

        $scope.RefTableColColl = GlobalServices.getRptTableColColl();

        $scope.ProjectColl = [];
        GlobalServices.getProject().then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.ProjectColl = res.data.Data;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        GetCustomRptColumns();

        $scope.ReportTypes = [{ id: 1, text: 'Normal' }, { id: 2, text: 'Branch Wise' }, { id: 3, text: 'Brand Wise' },]

 $scope.GenConfig = {};
        GlobalServices.getGenConfig().then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.GenConfig = res.data.Data;
                PrintPreviewAs = $scope.GenConfig.PrintPreviewAs;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });


        //agGrid.initialiseAgGridWithAngular1(angular);
        $scope.VoucherTypeList = [];
        $http({
            method: 'GET',
            url: base_url + "Account/Creation/GetAllVoucherData",
            dataType: "json",
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.VoucherTypeList = res.data.Data;
            } else {
                Swal.fire(res.data.ResponseMSG);
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

        $scope.ProductBrandList = [];
        $http({
            method: 'GET',
            url: base_url + "Inventory/Creation/GetAllProductBrand",
            dataType: "json"
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.ProductBrandList = res.data.Data;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });



        $scope.LedgerGroupList = [];
        $http({
            method: 'GET',
            url: base_url + "Account/Creation/GetAllLedgerGroup",
            dataType: "json"
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.LedgerGroupList = res.data.Data;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        $scope.Groupwise = {
            DateFrom_TMP: new Date(),
            DateTo_TMP: new Date(),
            LedgerGroupId: 1,
            BranchId: 0,
            ShowZeroBalance: false,
            ShowDetails: false,
            ShowCostCenter:false,
            ReportType: 1,
            ShowAsList: false,
            BrandId: null,
            MonthWise: false,
            ShowDebtorCreditor: true,
            ProjectIdColl:'',
        };

        $scope.EPDet = {};
        $scope.EPColl = [];
        GlobalServices.getRptEntityProperties(EntityId).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.EPColl = res.data.Data;
                angular.forEach($scope.EPColl, function (ep) {
                    $scope.EPDet[ep.Name] = ep;
                    if (ep.DataType == 'DateTime') {
                        if (ep.DefaultValue) {
                            $scope.Groupwise[ep.Name] = new Date(ep.DefaultValue);
                        }
                    } else {
                        $scope.Groupwise[ep.Name] = ep.DefaultValue;
                    }
                    
                });
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
                    $scope.Groupwise.DateFrom_TMP = new Date(comDet.StartDate);
                }
            }, function (errormessage) {
                alert('Unable to Delete data. pls try again.' + errormessage.responseText);
            });
        });
       
       
        $scope.loadingstatus = "stop";
       
      

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
             

            $scope.gridOptions.columnDefs = $scope.columnDefs;
            $scope.gridOptions.api.setColumnDefs($scope.columnDefs);
             
            $scope.gridOptions.api.setRowData($scope.RptDataColl);


        }

    }

    $scope.saveRptListState = function () {
        GlobalServices.saveRptListState(EntityId, $scope.gridOptions);
    };
    $scope.DelListState = function () {
        GlobalServices.delListStateRpt(EntityId);
    }
    $scope.GetGroupwise = function () {

        $scope.MonthNameList = [];
        $scope.ShowMonthWise(false, 0);

        $scope.RptDataColl = [];
        $scope.gridOptions.data = [];
        
        var para = {
            dateFrom: $scope.Groupwise.DateFromDet ? $filter('date')($scope.Groupwise.DateFromDet.dateAD, 'yyyy-MM-dd')  : null,
            dateTo: $scope.Groupwise.DateToDet ? $filter('date')($scope.Groupwise.DateToDet.dateAD, 'yyyy-MM-dd') : null,
            branchId: 0,
            branchIdColl:($scope.Groupwise.BranchId ? $scope.Groupwise.BranchId.toString() : ''),
            groupId: $scope.Groupwise.LedgerGroupId,
            showZeroBalance: $scope.Groupwise.ShowZeroBalance,
            showCostCenter: $scope.Groupwise.ShowCostCenter,
            showAsList: $scope.Groupwise.ShowAsList,
            brandId: $scope.Groupwise.BrandId,
            MonthWise: $scope.Groupwise.MonthWise,
            ShowDebtorCreditor: $scope.Groupwise.ShowDebtorCreditor,
            projectIdColl: ($scope.Groupwise.ProjectIdColl ? $scope.Groupwise.ProjectIdColl.toString() : ''),
        };

        $scope.gridOptions.columnApi.setColumnVisible('colGroup', $scope.Groupwise.ShowAsList);

        $scope.loadingstatus = 'running';
        showPleaseWait();

        $http({
            method: 'POST',
            url: base_url + "Account/Reporting/GetTBGroupWise",
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

                if (res.data.Data.length > 0) {
                    $scope.RptDataColl = res.data.Data;
                    $scope.ForCustomColumn = $scope.RptDataColl[0];

                    var monthList = $scope.RptDataColl.length > 0 ? $scope.RptDataColl[0].MonthList : [];
                    $scope.MonthNameList = monthList;
                    if ($scope.Groupwise.MonthWise == true && monthList.length>0) {
                        $scope.ShowMonthWise(true, monthList);
                    }

                    $scope.gridOptions.api.setRowData($scope.RptDataColl);
                     
                }


            } else {
                Swal.fire(res.data.ResponseMSG);
            }

        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";

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

                                        if (rptTranId > 0)
                                        {
                                            var dataColl = $scope.GetDataForPrint();
                                            print = true;

                                            if (selectedRpt.Rpt_Type == 3) {
                                                var paraData = {
                                                    Period: $scope.Groupwise.DateFromDet.dateBS + " TO " + $scope.Groupwise.DateToDet.dateBS,
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
                                                        down_file(base_url + "//" + res.data.Data.ResponseId, "TrailBalance.xlsx");
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

                                                        var rptPara = {
                                                            rpttranid: rptTranId,
                                                            istransaction: false,
                                                            entityid: EntityId,
                                                            voucherid: 0,
                                                            tranid: 0,
                                                            vouchertype: 0,
                                                            sessionid: res.data.Data.ResponseId,
                                                            Period: $scope.Groupwise.DateFromDet.dateBS + " TO " + $scope.Groupwise.DateToDet.dateBS,
                                                            TotalMonth:$scope.MonthNameList ? $scope.MonthNameList.length : 0,
                                                        };

                                                        if ($scope.MonthNameList) {
                                                            var msno = 1;
                                                            $scope.MonthNameList.forEach(function (mn) {
                                                                var mnName = 'MN' + msno;
                                                                rptPara[mnName] = mn.MonthName;
                                                                msno++;
                                                            });
                                                        }
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
                                    Period: $scope.Groupwise.DateFromDet.dateBS + " TO " + $scope.Groupwise.DateToDet.dateBS,
                                    TotalMonth: $scope.MonthNameList ? $scope.MonthNameList.length : 0,
                                };
                                if ($scope.MonthNameList) {
                                    var msno = 1;
                                    $scope.MonthNameList.forEach(function (mn) {
                                        var mnName = 'MN' + msno;
                                        rptPara[mnName] = mn.MonthName;
                                        msno++;
                                    });
                                }
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
        if ($scope.gridOptions.api.rowModel.rowsToDisplay) {
            if ($scope.gridOptions.api.rowModel.rowsToDisplay.length > 0) {
                $scope.gridOptions.api.rowModel.rowsToDisplay.forEach(function (node){
                    var fData = node.data;
                    if (fData.IsLedgerGroup == true) {
                        fData.Particulars = fData.LedgerGroupName;                        
                    }
                    else {
                        if (!fData.Particulars || fData.Particulars.length == 0)
                            fData.Particulars = fData.LedgerName;

                        if(node.parent && node.parent.data)
                            fData.TotalSpace = node.parent.data.TotalSpace+5;
                    }

                    fData.Particulars = padLeft(fData.Particulars, fData.TotalSpace+fData.Particulars.length,' ');
                    filterData.push(fData);

                })
            }
        }
        //$scope.gridOptions.api.forEachNodeAfterFilterAndSort(function (node) {
            
        //});

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
            Period: $scope.Groupwise.DateFromDet.dateBS + " TO " + $scope.Groupwise.DateToDet.dateBS,
            TotalMonth: $scope.MonthNameList ? $scope.MonthNameList.length : 0,
        };

        if ($scope.MonthNameList) {
            var msno = 1;
            $scope.MonthNameList.forEach(function (mn) {
                var mnName = 'MN' + msno;
                paraData[mnName] = mn.MonthName;
                msno++;
            });
        }

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
                down_file(base_url + "//" + res.data.Data.ResponseId, "GroupSummary.xlsx");
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
