 
agGrid.initialiseAgGridWithAngular1(angular);

app.controller("SalesInvoiceDetails", function ($scope, $http, $filter, $timeout, GlobalServices, $compile) {

  var PrintPreviewAs = 1;
    const contextMenu = GlobalServices.createElementForMenu();
	
    LoadData();

    $scope.onBtExportCSV = function () {
        var params = {
            fileName: 'SalesInvoiceDetails.csv',
            sheetName: 'SalesInvoiceDetails'
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
                                $scope.SalesInvoiceDetails.SelectedMonth = pm;
                                $scope.SalesInvoiceDetails.RptMonthSNo = pm.SNo;

                                $scope.SalesInvoiceDetails.DateFrom_TMP = new Date(pm.FromDate);
                                $scope.SalesInvoiceDetails.DateTo_TMP = new Date(pm.ToDate);
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
            $scope.SalesInvoiceDetails.DateFrom_TMP = new Date(sm.FromDate);
            $scope.SalesInvoiceDetails.DateTo_TMP = new Date(sm.ToDate);

        }
    }
    $scope.ChangePeriodOption = function () {
        if ($scope.SalesInvoiceDetails.PeriodOPT == 2) {
            $scope.ChangePeriodMonth($scope.SalesInvoiceDetails.SelectedMonth);
        }
    }

    function LoadData() {
        $('.select2').select2({
            allowClear: true,
            openOnEnter: true
        });

        $scope.IncludeVouchers = [{ id: 1, text: 'Return', IsSelected: false }, { id: 2, text: 'Debit Note', IsSelected: false }, { id: 3, text: 'Credit Note', IsSelected: false }];

        $scope.RefTableColColl = GlobalServices.getRptTableColColl();
        GetCustomRptColumns();

        //Search Drop DownList
        $scope.VoucherSearchOptions = [{ text: 'VoucherDate', value: 'VoucherDate', dataType: 'date' },
        { text: 'Date(B.S)', value: 'VoucherDateStr', dataType: 'date' },
        { text: 'Voucher No', value: 'Voucher No', dataType: 'Number' },
        { text: 'Voucher', value: 'Voucher', dataType: 'Text' },
        { text: 'Party Name', value: 'PartyName', dataType: 'text' },
        { text: 'Party Group', value: 'PartyGroup', dataType: 'text' },
        { text: 'Party Cost Center', value: 'PartyCostCenter', dataType: 'text' },
        { text: 'Ref.No.', value: 'RefNo', dataType: 'Number' },
        { text: 'Ref.V.No.', value: 'OtherReferences', dataType: 'Number' },
        { text: 'Address', value: 'Address', dataType: 'text' },
        { text: 'PanVatNo', value: 'PanVatNo', dataType: 'Number' },
        { text: 'Sales Ledger', value: 'SalesLedger', dataType: 'text' },
        { text: 'Sales Cost Center', value: 'SalesLedgerGroup', dataType: 'text' },
        { text: 'Total Sales', value: 'TotalSales', dataType: 'Number' },
        { text: 'Discount Amt', value: 'InAmt', dataType: 'Number' },
        { text: 'Net Sales Qty', value: 'Discount', dataType: 'Number' },
        { text: 'TaxableValue', value: 'TaxableValue', dataType: 'number' },
        { text: 'Vat', value: 'Vat', dataType: 'Number' },
        { text: 'Additional Amt', value: 'AdditionalCharge', dataType: 'Number' },
        { text: 'TotalValue', value: 'TotalValue', dataType: 'Number' },
        { text: 'Entry Date', value: 'EntryDateStr', dataType: 'date' },
        { text: 'Current Total', value: 'CurrentClosing', dataType: 'number' },
        { text: 'SalesMan', value: 'SalesMan', dataType: 'text' },
        { text: 'Qty.', value: 'Qty', dataType: 'number' },
        { text: 'LineValue', value: 'LineValue', dataType: 'number' },
        { text: 'No. of Line', value: 'NoOfline', dataType: 'number' },
        { text: 'FReight', value: 'Freight', dataType: 'number' },
        { text: 'Excise Duty', value: 'ExDuty', dataType: 'number' },
        { text: 'Insurance', value: 'Insurance', dataType: 'number' },
        { text: 'Scheme', value: 'Schame', dataType: 'number' },
        { text: 'Contact No.', value: 'ContactNo', dataType: 'text' },
        ];

        //Filter Dialog Box Details 
        $scope.BranchTypeColl = [];
        $scope.VoucherTypeColl = [];
        $scope.LedgerGroupTypeColl = [];
        $scope.ExpressionColl = GlobalServices.getExpression();
        $scope.ConditionColl = GlobalServices.getLogicCondition();
        $scope.FilterColumnColl = [{ text: 'Discount', value: 'Discount', dataType: 'Number' },
        { text: 'ExDuty', value: 'ExDuty', dataType: 'Number' },
        { text: 'Frieght', value: 'Freight', dataType: 'Number' },
        { text: 'Import Tax', value: 'ImportTax', dataType: 'Number' },
        { text: 'Import Value', value: 'ImportValue', dataType: 'Number' },
        { text: 'Vat', value: 'Vat', dataType: 'Number' },
        { text: 'TotalValue', value: 'TotalValue', dataType: 'Number' },
        { text: 'TotalSales', value: 'TotalSales', dataType: 'Number' },
        { text: 'TaxableValue', value: 'TaxableValue', dataType: 'Number' },
        { text: 'Schame', value: 'Schame', dataType: 'Number' },
        { text: 'AdditionalCharge', value: 'AdditionalCharge', dataType: 'Number' },
        { text: 'Address', value: 'Address', dataType: 'text' },
        { text: 'Buyer', value: 'Buyer', dataType: 'text' },
        { text: 'InvoiceNo', value: 'InvoiceNo', dataType: 'number' },
        { text: 'PanVAtNo', value: 'PanVatNo', dataType: 'number' },
        { text: 'PartyName', value: 'PartyName', dataType: 'text' },
        { text: 'VoucherName', value: 'VoucherName', dataType: 'text' },
        { text: 'Branch', value: 'Branch', dataType: 'text' },
        ];

        $scope.SalesInvoiceDetails = {
            DateFrom_TMP: new Date(),
            DateTo_TMP: new Date(),
            VoucherId: 0,
            IsPost: true,
            BranchId: 0,
            PeriodOPT: 2,
            RptCostClassId: null,
            RptMonthSNo: 0
        };
        $scope.OpeningAmt = 0;
        $scope.CurrentAmt = 0;
        $scope.TotalAmt = 0;
        $scope.ReportName = '';
        $scope.noofdecimal = 2;

        $scope.loadingstatus = "stop";

        $scope.PeriodOptColl = GlobalServices.getPeriodOptions();
        $scope.RptCostClassColl = [];
        GlobalServices.getCostClassForRpt().then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.RptCostClassColl = res.data.Data;
                if ($scope.RptCostClassColl && $scope.RptCostClassColl.length > 0) {
                    $scope.SalesInvoiceDetails.RptCostClassId = $scope.RptCostClassColl[0].CostClassId;
                    $scope.GetPeriodMonths($scope.RptCostClassColl[0].CostClassId);
                }
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        $scope.columnDefs = [

            { headerName: "Date", width: 120, field: "VoucherDate", dataType: 'DateTime', cellStyle: { 'text-align': 'center' }, valueFormatter: function (params) { return DateFormatAD(params.value); }, pinned: 'left' },
            { headerName: "Miti", width: 120, field: "VoucherDateBS", dataType: 'DateTime', cellStyle: { 'text-align': 'center' }, pinned: 'left' },
            { headerName: "VoucherNo", width: 130, field: "InvoiceNo", dataType: 'Number', cellStyle: { 'text-align': 'center' }, pinned: 'left' },
            { headerName: "Voucher", width: 180, field: "VoucherName", dataType: 'Text', cellStyle: { 'text-align': 'left' }, pinned: 'left' },

            { headerName: "Ref No.", width: 120, field: "RefNo", dataType: 'Text', cellStyle: { 'text-align': 'center' } },
            { headerName: "PartyCode", width: 120, field: "PartyCode", dataType: 'Number', cellStyle: { 'text-align': 'left' } },
            { headerName: "PartyName", width: 250, field: "PartyLedger", dataType: 'Text', cellStyle: { 'text-align': 'left' } },

            { headerName: "Address", width: 160, field: "PartyAddress", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "Pan Vat", width: 120, field: "SalesTaxNo", dataType: 'Number', cellStyle: { 'text-align': 'left' } },
            { headerName: "Sales Ledger", width: 180, field: "SalesLedger", dataType: 'Number', cellStyle: { 'text-align': 'left' } },
            { headerName: "Product Group", width: 150, field: "ProductGroup", cellStyle: { 'text-align': 'left' } },
            { headerName: "Product Code", width: 150, field: "ProductCode", dataType: 'Number', cellStyle: { 'text-align': 'left' } },
            { headerName: "Product Name", width: 210, field: "ProductName", dataType: 'Text', cellStyle: { 'text-align': 'left' } },


            { headerName: "Qty", width: 140, field: "Qty", dataType: 'Number', cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },
            { headerName: "Unit", width: 110, field: "Unit", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "Rate", width: 150, field: "Rate", dataType: 'Number', cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },
            { headerName: "Amount", width: 150, field: "Amount", dataType: 'Number', cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },
            { headerName: "Product Discount", width: 180, field: "Discount", dataType: 'Number', cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },
            { headerName: "Product Scheme", width: 170, field: "SchameAmount", dataType: 'Number', cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },

            { headerName: "Discount", width: 150, field: "DISCOUNT", dataType: 'Number', cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },
            { headerName: "Excise", width: 150, field: "EXCISE", dataType: 'Number', cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },
            { headerName: "Vat", width: 150, field: "VAT", dataType: 'Number', cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },
            { headerName: "Labour Charge", width: 150, field: "LABOURCHARGE", dataType: 'Number', cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },
            { headerName: "Freight Charge", width: 150, field: "FREIGHT", dataType: 'Number', cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },
            { headerName: "Loading UnLoading", width: 150, field: "LoadingUnLoading", dataType: 'Number', cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },
            { headerName: "INSURANCE", width: 150, field: "INSURANCE", dataType: 'Number', cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },
             
            { headerName: "Round Off", width: 150, field: "ROUNDOFF", dataType: 'Number', cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },
            { headerName: "Other Charges", width: 150, field: "OTHERS", dataType: 'Number', cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },
            { headerName: "Product Total", width: 150, field: "LineTotal", dataType: 'Number', cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },
            { headerName: "Invoice Amount", width: 150, field: "InvoiceAmount", dataType: 'Number', cellStyle: { 'text-align': 'right' } },

            //New Field Added By Suresh on 24 Baishakh starts
            { headerName: "Alt. Qty1", width: 140, field: "Qty1", dataType: 'Number', cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },
            { headerName: "Alt. Unit1", width: 140, field: "Unit1", dataType: 'Text', cellStyle: { 'text-align': 'right' }, filter: "agTextColumnFilter",  },
            { headerName: "Alt. Qty2", width: 140, field: "Qty2", dataType: 'Number', cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },
            { headerName: "Alt. Unit2", width: 140, field: "Unit2", dataType: 'Text', cellStyle: { 'text-align': 'right' }, filter: "agTextColumnFilter",   },
            { headerName: "Is Taxable(VAT)", width: 150, field: "IsTaxable", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "Is Allowed Sales Point", width: 200, field: "IsAllowSalesPoint", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "Godown", width: 140, field: "Godown", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "Batch No", width: 140, field: "BatchNo", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "Mfg. Date", width: 140, field: "MfgDate", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "Exp. Date", width: 140, field: "ExpDate", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            //Ends

            { headerName: "Product Alias", width: 140, field: "ProductAlias", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "Product Description", width: 190, dataType: 'Text', field: "ProductDescription", cellStyle: { 'text-align': 'left' } },
            { headerName: "Product Category", width: 180, field: "ProductCategory", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "Product Type", width: 140, field: "ProductType", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "Product Company", width: 180, field: "ProductCompany", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "Product Division", width: 160, field: "ProductDivision", dataType: 'Text', cellStyle: { 'text-align': 'left' } },

            //New Field Added By Suresh on 24 Baishakh starts
            { headerName: "Product Brand", width: 150, field: "ProductBrand", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "Product Colour", width: 150, field: "ProductColour", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "Product Shape", width: 150, field: "ProductShape", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "Product Flavour", width: 150, field: "ProductFlavour", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            //Ends

            { headerName: "TranType", width: 130, field: "CashBank", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "For", width: 150, field: "ForParty", dataType: 'Text', cellStyle: { 'text-align': 'left' } },

            //New Field added by suresh on 27 baishakh
            { headerName: "Salesman", width: 150, field: "Salesman", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            //Ends
            { headerName: "Area", width: 150, field: "PartyArea", dataType: 'Text', cellStyle: { 'text-align': 'left' } },

            { headerName: "Party CostCenter", width: 160, field: "PartyCostCenter", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "Sales CostCenter", width: 180, dataType: 'Text', field: "TranCostCenter", cellStyle: { 'text-align': 'left' } },
            { headerName: "Party CostCategory", width: 180, dataType: 'Text', field: "PartyCostCategory", cellStyle: { 'text-align': 'left' } },
            { headerName: "Sales CostCategory", width: 180, dataType: 'Text', field: "TranCostCategory", cellStyle: { 'text-align': 'left' } },

            { headerName: "DSE", width: 150, field: "DI_Name", dataType: 'Text', cellStyle: { 'text-align': 'left' } },

            { headerName: "SO", width: 150, field: "SO_Name", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "ASM", width: 150, field: "ASM_Name", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "RSM", width: 150, field: "RSM_Name", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "NSM", width: 150, field: "NSM_Name", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "SD", width: 150, field: "SD_Name", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "MD", width: 150, field: "MD_Name", dataType: 'Text', cellStyle: { 'text-align': 'left' } },

            //{ headerName: "Vat", width: 150, field: "Vat", dataType: 'Number',  cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); },  },
            //{ headerName: "Agent Code", width: 150, dataType: 'Text', field: "AgentCode", cellStyle: { 'text-align': 'right' } },

            //{ headerName: "Agent Area", width: 150, field: "Area", dataType: 'Text', cellStyle: { 'text-align': 'left' } }, 
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
                    VoucherName: 'TOTAL =>',
                    Qty: 0,
                    Amount: 0,
                    VAT: 0,
                    Discount: 0,
                    Schame: 0,
                    InvoiceAmount: 0,
                    DISCOUNT: 0,
                    EXCISE: 0,
                    LABOURCHARGE: 0,
                    FREIGHT: 0,
                    ROUNDOFF: 0,
                    OTHERS: 0,
                    LineTotal: 0,
                    LoadingUnLoading: 0,
                    INSURANCE:0,
                }
                $scope.gridOptions.api.forEachNodeAfterFilterAndSort(function (node) {
                    var fData = node.data;
                    dt.Qty += fData.Qty;
                    dt.Amount += fData.Amount;
                    dt.VAT += fData.VAT;
                    dt.Discount += fData.Discount;
                    dt.Schame += fData.Schame;
                    dt.InvoiceAmount += fData.InvoiceAmount;

                    dt.DISCOUNT += fData.DISCOUNT;
                    dt.EXCISE += fData.EXCISE;
                    dt.LABOURCHARGE += fData.LABOURCHARGE;
                    dt.FREIGHT += fData.FREIGHT;
                    dt.ROUNDOFF += fData.ROUNDOFF;
                    dt.OTHERS += fData.OTHERS;
                    dt.LineTotal += fData.LineTotal;

                    dt.LoadingUnLoading += fData.LoadingUnLoading;
                    dt.INSURANCE += fData.INSURANCE;
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
                VoucherName: 'Total =>',
                Amount: 0,
                Rate: '',
                InvoiceAmount: 0,
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


    }

    $scope.SelectedInclude = function () {
        var val = $scope.SalesInvoiceDetails.IncludeVouchers;
        $scope.IncludeVouchers.forEach(function (v) {
            v.IsSelected = val;
        });
    }

    $scope.ClearData = function () {

        var DataColl = [];
        $scope.gridOptionsBottom.api.setRowData(DataColl);

        $scope.gridOptions.api.setRowData(DataColl);
    };

    $scope.GetSalesInvoiceDetails = function () {

        $scope.ClearData();

        var dateFrom = new Date(($filter('date')(new Date(), 'yyyy-MM-dd')));
        var dateTo = new Date(($filter('date')(new Date(), 'yyyy-MM-dd')));

        if ($scope.SalesInvoiceDetails.DateFromDet)
            dateFrom = $filter('date')($scope.SalesInvoiceDetails.DateFromDet.dateAD, 'yyyy-MM-dd');

        if ($scope.SalesInvoiceDetails.DateToDet)
            dateTo = $filter('date')($scope.SalesInvoiceDetails.DateToDet.dateAD, 'yyyy-MM-dd');

        var voucherQry = mx($scope.IncludeVouchers);

        var beData = {
            dateFrom: dateFrom,
            dateTo: dateTo,
            ShowReturn: voucherQry.firstOrDefault(p1 => p1.id == 1).IsSelected,
            ShowDebitNote: voucherQry.firstOrDefault(p1 => p1.id == 2).IsSelected,
            ShowCreditNote: voucherQry.firstOrDefault(p1 => p1.id == 3).IsSelected,
            //VoucherType: $scope.SalesInvoiceDetails.VoucherId,
            //isPost: $scope.SalesInvoiceDetails.IsPost,
            //branchId: $scope.SalesInvoiceDetails.BranchId
        };

        $scope.loadingstatus = 'running';
        showPleaseWait();

        $http({
            method: "POST",
            url: base_url + "Inventory/Reporting/GetSalesInvoiceDetails",
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
                    var dt = {
                        VoucherName: 'TOTAL =>',
                        Qty: 0,
                        Amount: 0,
                        VAT: 0,
                        Discount: 0,
                        Schame: 0,
                        InvoiceAmount: 0,
                        DISCOUNT: 0,
                        EXCISE: 0,
                        LABOURCHARGE: 0,
                        FREIGHT: 0,
                        ROUNDOFF: 0,
                        OTHERS: 0,
                        LineTotal: 0,
                        LoadingUnLoading: 0,
                        INSURANCE:0,
                    }
                    $scope.RptDataColl.forEach(function (fData) {

                        dt.Qty += fData.Qty;
                        dt.Amount += fData.Amount;
                        dt.VAT += fData.VAT;
                        dt.Discount += fData.Discount;
                        dt.Schame += fData.Schame;
                        dt.InvoiceAmount += fData.InvoiceAmount;

                        dt.DISCOUNT += fData.DISCOUNT;
                        dt.EXCISE += fData.EXCISE;
                        dt.LABOURCHARGE += fData.LABOURCHARGE;
                        dt.FREIGHT += fData.FREIGHT;
                        dt.ROUNDOFF += fData.ROUNDOFF;
                        dt.OTHERS += fData.OTHERS;
                        dt.LineTotal += fData.LineTotal;

                        dt.LoadingUnLoading += fData.LoadingUnLoading;
                        dt.INSURANCE += fData.INSURANCE;
                    });

                    var filterDataColl = [];
                    filterDataColl.push(dt);

                    $scope.gridOptionsBottom.api.setRowData(filterDataColl);

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
                                                    var sm = ($scope.SalesInvoiceDetails.PeriodOPT == 2 ? $scope.SalesInvoiceDetails.SelectedMonth : null);
                                                    var rptPara = {
                                                        rpttranid: rptTranId,
                                                        istransaction: false,
                                                        entityid: EntityId,
                                                        voucherid: 0,
                                                        tranid: 0,
                                                        vouchertype: 0,
                                                        sessionid: res.data.Data.ResponseId,
                                                        Period: $scope.SalesInvoiceDetails.DateFromDet.dateBS + " TO " + $scope.SalesInvoiceDetails.DateToDet.dateBS,
                                                        FYear: (dataColl && dataColl.length > 0 ? dataColl[0].ForYear : ''),
                                                        NY: sm ? sm.NY : 0,
                                                        NM: sm ? sm.NM : 0,
                                                        MonthName: sm ? sm.MonthName : '',
                                                        ForMonth: sm ? sm.MonthName : '',
                                                        FiscalYear: (dataColl && dataColl.length > 0 ? dataColl[0].ForYear : ''),
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
                                var sm = ($scope.SalesInvoiceDetails.PeriodOPT == 2 ? $scope.SalesInvoiceDetails.SelectedMonth : null);
                                var rptPara = {
                                    rpttranid: rptTranId,
                                    istransaction: false,
                                    entityid: EntityId,
                                    voucherid: 0,
                                    tranid: 0,
                                    vouchertype: 0,
                                    sessionid: res.data.Data.ResponseId,
                                    Period: $scope.SalesInvoiceDetails.DateFromDet.dateBS + " TO " + $scope.SalesInvoiceDetails.DateToDet.dateBS,
                                    FYear: (dataColl && dataColl.length > 0 ? dataColl[0].ForYear : ''),
                                    NY: sm ? sm.NY : 0,
                                    NM: sm ? sm.NM : 0,
                                    MonthName: sm ? sm.MonthName : '',
                                    ForMonth: sm ? sm.MonthName : '',
                                    FiscalYear: (dataColl && dataColl.length > 0 ? dataColl[0].ForYear : ''),
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
        var sm = ($scope.SalesInvoiceDetails.PeriodOPT == 2 ? $scope.SalesInvoiceDetails.SelectedMonth : null);
        var paraData = {
            Period: $scope.SalesInvoiceDetails.DateFromDet.dateBS + " TO " + $scope.SalesInvoiceDetails.DateToDet.dateBS,
            FYear: (dataColl && dataColl.length > 0 ? dataColl[0].ForYear : ''),
            NY: sm ? sm.NY : 0,
            NM: sm ? sm.NM : 0,
            MonthName: sm ? sm.MonthName : '',
            ForMonth: sm ? sm.MonthName : '',
            FiscalYear: (dataColl && dataColl.length > 0 ? dataColl[0].ForYear : ''),
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
                down_file(base_url + "//" + res.data.Data.ResponseId, "SalesInvoiceDetails.xlsx");
            }

        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            Swal.fire(errormessage);
        });
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

                        var dt = {
                            VoucherName: 'TOTAL =>',
                            Qty: 0,
                            Amount: 0,
                            VAT: 0,
                            Discount: 0,
                            Schame: 0,
                            InvoiceAmount: 0,
                            DISCOUNT: 0,
                            EXCISE: 0,
                            LABOURCHARGE: 0,
                            FREIGHT: 0,
                            ROUNDOFF: 0,
                            OTHERS: 0,
                            LineTotal: 0,
                            LoadingUnLoading: 0,
                            INSURANCE: 0,
                        }
                        $scope.RptDataColl.forEach(function (fData) {

                            dt.Qty += fData.Qty;
                            dt.Amount += fData.Amount;
                            dt.VAT += fData.VAT;
                            dt.Discount += fData.Discount;
                            dt.Schame += fData.Schame;
                            dt.InvoiceAmount += fData.InvoiceAmount;

                            dt.DISCOUNT += fData.DISCOUNT;
                            dt.EXCISE += fData.EXCISE;
                            dt.LABOURCHARGE += fData.LABOURCHARGE;
                            dt.FREIGHT += fData.FREIGHT;
                            dt.ROUNDOFF += fData.ROUNDOFF;
                            dt.OTHERS += fData.OTHERS;
                            dt.LineTotal += fData.LineTotal;
                            dt.LoadingUnLoading += fData.LoadingUnLoading;
                            dt.INSURANCE += fData.INSURANCE;
                        });

                        var filterDataColl = [];
                        filterDataColl.push(dt);

                        $scope.gridOptionsBottom.api.setRowData(filterDataColl);

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

            var dt = {
                VoucherName: 'TOTAL =>',
                Qty: 0,
                Amount: 0,
                VAT: 0,
                Discount: 0,
                Schame: 0,
                InvoiceAmount: 0,
                DISCOUNT: 0,
                EXCISE: 0,
                LABOURCHARGE: 0,
                FREIGHT: 0,
                ROUNDOFF: 0,
                OTHERS: 0,
                LineTotal: 0,
                LoadingUnLoading: 0,
                INSURANCE: 0,
            }
            $scope.RptDataColl.forEach(function (fData) {

                dt.Qty += fData.Qty;
                dt.Amount += fData.Amount;
                dt.VAT += fData.VAT;
                dt.Discount += fData.Discount;
                dt.Schame += fData.Schame;
                dt.InvoiceAmount += fData.InvoiceAmount;

                dt.DISCOUNT += fData.DISCOUNT;
                dt.EXCISE += fData.EXCISE;
                dt.LABOURCHARGE += fData.LABOURCHARGE;
                dt.FREIGHT += fData.FREIGHT;
                dt.ROUNDOFF += fData.ROUNDOFF;
                dt.OTHERS += fData.OTHERS;
                dt.LineTotal += fData.LineTotal;
                dt.LoadingUnLoading += fData.LoadingUnLoading;
                dt.INSURANCE += fData.INSURANCE;
            });

            var filterDataColl = [];
            filterDataColl.push(dt);

            $scope.gridOptionsBottom.api.setRowData(filterDataColl);

            $scope.gridOptions.api.setRowData($scope.RptDataColl);
           


        }

    }
	
	$scope.saveRptListState = function () {
        GlobalServices.saveRptListState(EntityId, $scope.gridOptions);
    };
	 $scope.DelListState = function () {
        GlobalServices.delListStateRpt(EntityId);
    }

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
