"use strict";

agGrid.initialiseAgGridWithAngular1(angular);

app.controller("ProductMonthlySummary", function ($scope, $http, $filter, $timeout, GlobalServices, $compile) {

  var PrintPreviewAs = 1;
    const contextMenu = GlobalServices.createElementForMenu();
    LoadData();

    $scope.onBtExportCSV = function () {
        var params = {
            fileName: 'ProductMonthlySummary.csv',
            sheetName: 'ProductMonthlySummary'
        };

        $scope.gridOptions.api.exportDataAsCsv(params);
    }

    function LoadData() {
        $('.select2').select2({
            allowClear: true,
            openOnEnter: true
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

        //Search Drop DownList
        $scope.VoucherSearchOptions = [{ text: 'ProductName', value: 'ProductName', dataType: 'Text' },
        { text: 'PartNo', value: 'PartNo', dataType: 'Number' },
        { text: 'Code', value: 'Code', dataType: 'Number' },
        { text: 'Group Name', value: 'GroupName', dataType: 'Text' },
        { text: 'CategoriesName', value: 'CategoriesName', dataType: 'text' },
        { text: 'SalesQty', value: 'OutQty', dataType: 'Number' },
        { text: 'SalesQty(AI.Value1)', value: 'OutQty1', dataType: 'Number' },
        { text: 'SalesQty(AI.Value2)', value: 'OutQty2', dataType: 'Number' },
        { text: 'Sales Rate', value: 'OutRate', dataType: 'Number' },
        { text: 'SalesAmt', value: 'OutAmt', dataType: 'Number' },
        { text: 'Return Qty', value: 'InQty', dataType: 'Number' },
        { text: 'Return Qty(AI.Value1)', value: 'InQty1', dataType: 'Number' },
        { text: 'Return Qty(AI.Value2)', value: 'InQty2', dataType: 'Number' },
        { text: 'Return rate', value: 'InRate', dataType: 'Number' },
        { text: 'Return Amt', value: 'InAmt', dataType: 'Number' },
        { text: 'Net Sales Qty', value: 'BalanceQty', dataType: 'Number' },
        { text: 'Unit', value: 'Unit', dataType: 'text' },
        { text: 'Net Qty(AI.Value1)', value: 'NetQty1', dataType: 'Number' },
        { text: 'Net Qty(AI.Value2)', value: 'NetQty2', dataType: 'Number' },
        { text: 'Net Sales Rate', value: 'BalanceRate', dataType: 'Number' },
        { text: 'Net Sales Amt', value: 'BalanceAmt', dataType: 'Number' },
        { text: 'ProductType', value: 'ProductType', dataType: 'text' },
        { text: 'Brand', value: 'Brand', dataType: 'text' },
        { text: 'Division', value: 'Division', dataType: 'text' },
        { text: 'Color', value: 'Color', dataType: 'text' },
        { text: 'Flavour', value: 'Flavour', dataType: 'text' },
        { text: 'Shape', value: 'Shape', dataType: 'text' },
        ];

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

        $scope.ReportFormatColl = [{ id: 1, text: 'Monthly' }, { id: 2, text: 'Daily' }];

        $scope.ProductMonthlySummary = {
            ProductId: 0,
            DateFrom_TMP: new Date(),
            DateTo_TMP: new Date(),
            GodownIdColl:'',
            ShowDetails: false,
            Format:1
        };
        $timeout(function () {
            GlobalServices.getCompanyDet().then(function (res) {
                var comDet = res.data.Data;
                if (comDet) {
                    $scope.ProductMonthlySummary.DateFrom_TMP = new Date(comDet.StartDate);
                }
            }, function (errormessage) {
                alert('Unable to Delete data. pls try again.' + errormessage.responseText);
            });
        });

        $scope.OpeningAmt = 0;
        $scope.CurrentAmt = 0;
        $scope.TotalAmt = 0;
        $scope.ReportName = '';
        $scope.noofdecimal = 2;

        $scope.loadingstatus = "stop";

        var columnDefs = [

            { headerName: "Particulars", width: 180, field: "Particulars", cellStyle: { 'text-align': 'left' }, pinned: 'left'  },
            { headerName: "InQty", width: 120, field: "InQty", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },
            { headerName: "InRate", width: 120, field: "InRate", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "InAmt", width: 150, field: "InAmt", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },

            { headerName: "OutQty", width: 120, field: "OutQty", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },
            { headerName: "OutRate", width: 120, field: "OutRate", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }  },
            { headerName: "OutAmt", width: 180, field: "OutAmt", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },
            { headerName: "BalanceQty", width: 130, field: "BalanceQty", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },
            { headerName: "Unit", width: 100, field: "BaseUnit", cellStyle: { 'text-align': 'left' }  },
            { headerName: "BalanceRate", width: 130, field: "BalanceRate", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }  },
            { headerName: "BalanceAmt", width: 180, field: "BalanceAmt", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },

            { headerName: "Payment_Qty", width: 150, hide: true, colId: 'det10', field: "Payment_Qty", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "Payment_Amt", width: 150, hide: true, colId: 'det11', field: "Payment_Amt", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "Journal_In_Qty", width: 150, hide: true, colId: 'det12', field: "Journal_In_Qty", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "Journal_In_Amt", width: 150, hide: true, colId: 'det13', field: "Journal_In_Amt", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "GRN_Qty", width: 140, hide: true, colId: 'det14', field: "GRN_Qty", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "GRN_Amt", width: 140, hide: true, colId: 'det15', field: "GRN_Amt", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "Purchase_Qty", width: 130, hide: true, colId: 'det16', field: "Purchase_Qty", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "Purchase_Amt", width: 130, hide: true, colId: 'det17', field: "Purchase_Amt", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "PurchaseReturn_Qty", width: 140, hide: true, colId: 'det18', field: "PurchaseReturn_Qty", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "PurchaseReturn_Amt", width: 140, hide: true, colId: 'det19', field: "PurchaseReturn_Amt", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "StockJournal_In_Qty", width: 150, hide: true, colId: 'det20', field: "StockJournal_In_Qty", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "StockJournal_In_Amt", width: 150, hide: true, colId: 'det21', field: "StockJournal_In_Amt", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },

            { headerName: "Receipt_Qty", width: 140, hide: true, colId: 'det22', field: "Receipt_Qty", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "Receipt_Amt", width: 140, hide: true, colId: 'det23', field: "Receipt_Amt", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "Journal_Out_Qty", width: 150, hide: true, colId: 'det24', field: "Journal_Out_Qty", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "Journal_Out_Amt", width: 150, hide: true, colId: 'det25', field: "Journal_Out_Amt", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "DeliveryNote_Qty", width: 150, hide: true, colId: 'det26', field: "DeliveryNote_Qty", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "DeliveryNote_Amt", width: 150, hide: true, colId: 'det27', field: "DeliveryNote_Amt", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "Sales_Qty", width: 130, hide: true, colId: 'det28', field: "Sales_Qty", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "Sales_Amt", width: 130, hide: true, colId: 'det29', field: "Sales_Amt", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "SalesReturn_Qty", width: 140, hide: true, colId: 'det30', field: "SalesReturn_Qty", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "SalesReturn_Amt", width: 140, hide: true, colId: 'det31', field: "SalesReturn_Amt", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "Consumption_Qty", width: 140, hide: true, colId: 'det32', field: "Consumption_Qty", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "Consumption_Amt", width: 140, hide: true, colId: 'det33', field: "Consumption_Amt", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "StockJournal_Out_Qty", width: 150, hide: true, colId: 'det34', field: "StockJournal_Out_Qty", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "StockJournal_Out_Amt", width: 150, hide: true, colId: 'det35', field: "StockJournal_Out_Amt", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },


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
                   
                    InQty: 0,
                    InAmt: 0,
                    OutQty: 0,
                    OutAmt: 0,
                    BalanceQty: 0,
                    BalanceAmt: 0,
                    PurchaseCostAmt: 0,
                    Payment_Qty: 0,
                    Payment_Amt: 0,
                    Journal_In_Qty: 0,
                    Journal_In_Amt: 0,
                    GRN_Qty: 0,
                    GRN_Amt: 0,
                    Purchase_Qty: 0,
                    Purchase_Amt: 0,
                    PurchaseReturn_Qty: 0,
                    PurchaseReturn_Amt: 0,
                    StockJournal_In_Qty: 0,
                    StockJournal_In_Amt: 0,
                    Receipt_Qty: 0,
                    Receipt_Amt: 0,
                    Journal_Out_Qty: 0,
                    Journal_Out_Amt: 0,
                    DeliveryNote_Qty: 0,
                    DeliveryNote_Amt: 0,
                    Sales_Qty: 0,
                    Sales_Amt: 0,
                    SalesReturn_Qty: 0,
                    SalesReturn_Amt: 0,
                    Consumption_Qty: 0,
                    Consumption_Amt: 0,
                    StockJournal_Out_Qty: 0,
                    StockJournal_Out_Amt: 0,
                };

                $scope.gridOptions.api.forEachNodeAfterFilterAndSort(function (node) {
                    var fData = node.data;
                    dt.InQty += fData.InQty;
                    dt.InAmt += fData.InAmt;
                    dt.OutQty += fData.OutQty;
                    dt.OutAmt += fData.OutAmt;                   
                    dt.Payment_Qty += fData.Payment_Qty;
                    dt.Payment_Amt += fData.Payment_Amt;
                    dt.Journal_In_Qty += fData.Journal_In_Qty;
                    dt.Journal_In_Amt += fData.Journal_In_Amt;
                    dt.GRN_Qty += fData.GRN_Qty;
                    dt.GRN_Amt += fData.GRN_Amt;
                    dt.Purchase_Qty += fData.Purchase_Qty;
                    dt.Purchase_Amt += fData.Purchase_Amt;
                    dt.PurchaseReturn_Qty += fData.PurchaseReturn_Qty;
                    dt.PurchaseReturn_Amt += fData.PurchaseReturn_Amt;
                    dt.StockJournal_In_Qty += fData.StockJournal_In_Qty;
                    dt.StockJournal_In_Amt += fData.StockJournal_In_Amt;
                    dt.Receipt_Qty += fData.Receipt_Qty;
                    dt.Receipt_Amt += fData.Receipt_Amt;
                    dt.Journal_Out_Qty += fData.Journal_Out_Qty;
                    dt.Journal_Out_Amt += fData.Journal_Out_Amt;
                    dt.DeliveryNote_Qty += fData.DeliveryNote_Qty;
                    dt.DeliveryNote_Amt += fData.DeliveryNote_Amt;
                    dt.Sales_Qty += fData.Sales_Qty;
                    dt.Sales_Amt += fData.Sales_Amt;
                    dt.SalesReturn_Qty += fData.SalesReturn_Qty;
                    dt.SalesReturn_Amt += fData.SalesReturn_Amt;
                    dt.Consumption_Qty += fData.Consumption_Qty;
                    dt.Consumption_Amt += fData.Consumption_Amt;
                    dt.StockJournal_Out_Qty += fData.StockJournal_Out_Qty;
                    dt.StockJournal_Out_Amt += fData.StockJournal_Out_Amt;
                });

                dt.BalanceQty = dt.InQty - dt.OutQty;
                if (dt.InAmt != 0 && dt.InQty != 0)
                    dt.BalanceAmt = dt.BalanceQty * (dt.InAmt / dt.InQty);

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
                ProductName: 'Total =>',
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
		
		 $timeout(function () {
            GlobalServices.getListState(EntityId, $scope.gridOptions);
        });
    }

    $scope.ClearData = function () {

        $scope.dataForBottomGrid[0].InQty = 0;
        $scope.dataForBottomGrid[0].InAmt = 0;
        $scope.dataForBottomGrid[0].InRate = 0;
        $scope.dataForBottomGrid[0].OutQty = 0;
        $scope.dataForBottomGrid[0].OutRate = 0;
        $scope.dataForBottomGrid[0].OutAmt = 0;
        $scope.dataForBottomGrid[0].BalanceQty = 0;
        $scope.dataForBottomGrid[0].BalanceRate = 0;
        $scope.dataForBottomGrid[0].BalanceAmt = 0;

        if ($scope.gridOptionsBottom.api)
            $scope.gridOptionsBottom.api.setRowData($scope.dataForBottomGrid);

        $scope.DataColl = [];

        if ($scope.gridOptions.api)
            $scope.gridOptions.api.setRowData($scope.DataColl);
    };
    $scope.ShowDetails = function (val) {
        for (var i = 10; i < 36; i++) {
            var colName = 'det' + i.toString();
            $scope.gridOptions.columnApi.setColumnVisible(colName, val);
        }

        if ($scope.ProductMonthlySummary.ShowDetails == true)
            $scope.GetProductMonthlySummary();
    }
   
    $scope.GetProductMonthlySummary = function () {
        $scope.ClearData();
        var dateFrom =$filter('date')(new Date(), 'yyyy-MM-dd');
        var dateTo = $filter('date')(new Date(), 'yyyy-MM-dd');

        if ($scope.ProductMonthlySummary.DateFromDet)
            dateFrom =$filter('date')($scope.ProductMonthlySummary.DateFromDet.dateAD, 'yyyy-MM-dd');

        if ($scope.ProductMonthlySummary.DateToDet)
            dateTo = $filter('date')($scope.ProductMonthlySummary.DateToDet.dateAD, 'yyyy-MM-dd');

        $scope.DataColl = []; //declare an empty array
        $scope.gridOptions.api.setRowData($scope.DataColl);

        var beData = {
            ProductId: $scope.ProductMonthlySummary.ProductId,
            DateFrom: dateFrom,
            DateTo: dateTo,
            GodownIdColl: $scope.ProductMonthlySummary.GodownId > 0 ? $scope.ProductMonthlySummary.GodownId : '',
            ShowDetails:$scope.ProductMonthlySummary.ShowDetails
        };

        if ($scope.ProductMonthlySummary.ProductId > 0) {
            $scope.loadingstatus = 'running';
            showPleaseWait();

            var endpoint = 'GetProductMonthlySummary';

            if ($scope.ProductMonthlySummary.Format == 1)
                endpoint = 'GetProductMonthlySummary';
            else if ($scope.ProductMonthlySummary.Format == 2)
                endpoint = 'GetProductDailySummary';

            $http({
                method: "POST",
                url: base_url + "Inventory/Reporting/"+endpoint,
                data: JSON.stringify(beData),
                dataType: "json"
            }).then(function (res) {

                $scope.loadingstatus = 'stop';
                hidePleaseWait();

                if (res.data.IsSuccess && res.data.Data) {
                    var DataColl = mx(res.data.Data);

                    $scope.dataForBottomGrid[0].InQty = DataColl.sum(p1 => p1.InQty);
                    $scope.dataForBottomGrid[0].InAmt = DataColl.sum(p1 => p1.InAmt);
                    $scope.dataForBottomGrid[0].OutQty = DataColl.sum(p1 => p1.OutQty);
                    $scope.dataForBottomGrid[0].OutAmt = DataColl.sum(p1 => p1.OutAmt); 
                    $scope.dataForBottomGrid[0].BalanceQty = $scope.dataForBottomGrid[0].InQty - $scope.dataForBottomGrid[0].OutQty;
                    if ($scope.dataForBottomGrid[0].InAmt != 0 && $scope.dataForBottomGrid[0].InQty != 0) {
                        $scope.dataForBottomGrid[0].BalanceAmt = $scope.dataForBottomGrid[0].BalanceQty * ($scope.dataForBottomGrid[0].InAmt / $scope.dataForBottomGrid[0].InQty);
                    } 
                    $scope.dataForBottomGrid[0].Payment_Qty = DataColl.sum(p1 => p1.Payment_Qty);
                    $scope.dataForBottomGrid[0].Payment_Amt = DataColl.sum(p1 => p1.Payment_Amt);
                    $scope.dataForBottomGrid[0].Journal_In_Qty = DataColl.sum(p1 => p1.Journal_In_Qty);
                    $scope.dataForBottomGrid[0].Journal_In_Amt = DataColl.sum(p1 => p1.Journal_In_Amt);
                    $scope.dataForBottomGrid[0].GRN_Qty = DataColl.sum(p1 => p1.GRN_Qty);
                    $scope.dataForBottomGrid[0].GRN_Amt = DataColl.sum(p1 => p1.GRN_Amt);
                    $scope.dataForBottomGrid[0].Purchase_Qty = DataColl.sum(p1 => p1.Purchase_Qty);
                    $scope.dataForBottomGrid[0].Purchase_Amt = DataColl.sum(p1 => p1.Purchase_Amt);
                    $scope.dataForBottomGrid[0].PurchaseReturn_Qty = DataColl.sum(p1 => p1.PurchaseReturn_Qty);
                    $scope.dataForBottomGrid[0].PurchaseReturn_Amt = DataColl.sum(p1 => p1.PurchaseReturn_Amt);
                    $scope.dataForBottomGrid[0].StockJournal_In_Qty = DataColl.sum(p1 => p1.StockJournal_In_Qty);
                    $scope.dataForBottomGrid[0].StockJournal_In_Amt = DataColl.sum(p1 => p1.StockJournal_In_Amt);
                    $scope.dataForBottomGrid[0].Receipt_Qty = DataColl.sum(p1 => p1.Receipt_Qty);
                    $scope.dataForBottomGrid[0].Receipt_Amt = DataColl.sum(p1 => p1.Receipt_Amt);
                    $scope.dataForBottomGrid[0].Journal_Out_Qty = DataColl.sum(p1 => p1.Journal_Out_Qty);
                    $scope.dataForBottomGrid[0].Journal_Out_Amt = DataColl.sum(p1 => p1.Journal_Out_Amt);
                    $scope.dataForBottomGrid[0].DeliveryNote_Qty = DataColl.sum(p1 => p1.DeliveryNote_Qty);
                    $scope.dataForBottomGrid[0].DeliveryNote_Amt = DataColl.sum(p1 => p1.DeliveryNote_Amt);
                    $scope.dataForBottomGrid[0].Sales_Qty = DataColl.sum(p1 => p1.Sales_Qty);
                    $scope.dataForBottomGrid[0].Sales_Amt = DataColl.sum(p1 => p1.Sales_Amt);
                    $scope.dataForBottomGrid[0].SalesReturn_Qty = DataColl.sum(p1 => p1.SalesReturn_Qty);
                    $scope.dataForBottomGrid[0].SalesReturn_Amt = DataColl.sum(p1 => p1.SalesReturn_Amt);
                    $scope.dataForBottomGrid[0].Consumption_Qty = DataColl.sum(p1 => p1.Consumption_Qty);
                    $scope.dataForBottomGrid[0].Consumption_Amt = DataColl.sum(p1 => p1.Consumption_Amt);
                    $scope.dataForBottomGrid[0].StockJournal_Out_Qty = DataColl.sum(p1 => p1.StockJournal_Out_Qty);
                    $scope.dataForBottomGrid[0].StockJournal_Out_Amt = DataColl.sum(p1 => p1.StockJournal_Out_Amt);


                    $scope.gridOptionsBottom.api.setRowData($scope.dataForBottomGrid);
                    $scope.gridOptions.api.setRowData(res.data.Data);
                } else
                    Swal.fire(res.data.ResponseMSG);

            }, function (reason) {
                $scope.loadingstatus = "stop";
                alert('Failed' + reason);
            });
        }
       

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
                                                        Period: $scope.ProductMonthlySummary.DateFromDet.dateBS + " TO " + $scope.ProductMonthlySummary.DateToDet.dateBS,                                                
                                                        ProductName: $scope.ProductMonthlySummary.productDetail.Name,
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
                                    Period: $scope.ProductMonthlySummary.DateFromDet.dateBS + " TO " + $scope.ProductMonthlySummary.DateToDet.dateBS,
                                    ProductName: $scope.ProductMonthlySummary.productDetail.Name,
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
                down_file(base_url + "//" + res.data.Data.ResponseId, "ProductMonthlySummary.xlsx");
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
