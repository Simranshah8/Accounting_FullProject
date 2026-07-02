"use strict";

agGrid.initialiseAgGridWithAngular1(angular);

app.controller("ProductGroupDetails", function ($scope, $http, $filter, $timeout, GlobalServices, $compile) {

  var PrintPreviewAs = 1;
    const contextMenu = GlobalServices.createElementForMenu();
	
    LoadData();

    $scope.onBtExportCSV = function () {
        var params = {
            fileName: 'ProductGroupDetails.csv',
            sheetName: 'ProductGroupDetails'
        };

        $scope.gridOptions.api.exportDataAsCsv(params);
    }

    function LoadData() {
        $('.select2').select2({
            allowClear: true,
            openOnEnter: true
        });
        
        $scope.GodownList = [];
        $http({
            method: 'GET',
            url: base_url + "Inventory/Reporting/GetAllGodownList",
            dataType: "json",
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.GodownList = res.data.Data;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
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


        $scope.ProductGroupDetails = {
            DateFrom_TMP: new Date(),
            DateTo_TMP: new Date(),
            VoucherId: 0,
            IsPost: true,
            LedgerGroupId: 0,
            IsClearOnly: true,
            BranchId: 0
        };
       

        $scope.loadingstatus = "stop";

        var columnDefs = [

            { headerName: "Particulars", width: 180, field: "Name", cellStyle: { 'text-align': 'left' }  },
            { headerName: "ProductCode", width: 180, field: "Code", cellStyle: { 'text-align': 'left' }  },
            { headerName: "Alias", width: 180, field: "Alias", cellStyle: { 'text-align': 'left' }  },
            { headerName: "Remarks", width: 180, field: "Remarks", cellStyle: { 'text-align': 'left' }  },
            { headerName: "ProductPartNo", width: 180, field: "ProductPartNo", cellStyle: { 'text-align': 'left' }  },
            { headerName: "OpeningQty", width: 180, field: "OpeningQty", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },
            { headerName: "OpeningRate", width: 180, field: "OpeningRate", cellStyle: { 'text-align': 'left' }  },
            { headerName: "OpeningAmt", width: 180, field: "OpeningAmt", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },
            { headerName: "InRate", width: 180, field: "InRate", cellStyle: { 'text-align': 'left' }  },
            { headerName: "InAmt", width: 180, field: "InAmt", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },
            { headerName: "InQty", width: 180, field: "InQty", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },
            { headerName: "OutRate", width: 180, field: "OutRate", cellStyle: { 'text-align': 'left' }  },
            { headerName: "OutQty", width: 180, field: "OutQty", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },
            { headerName: "OutAmt", width: 180, field: "OutAmt", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },
            { headerName: "BalanceQty", width: 180, field: "BalanceQty", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },
            { headerName: "BalanceAmt", width: 180, field: "BalanceAmt", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },
            { headerName: "BaseUnit", width: 180, field: "BaseUnit", cellStyle: { 'text-align': 'left' }  },
            { headerName: "BalanceRate", width: 180, field: "BalanceRate", cellStyle: { 'text-align': 'left' }  },
            { headerName: "RegdNo", width: 180, field: "RegdNo", cellStyle: { 'text-align': 'right' }  },
            { headerName: "Unit", width: 180, field: "Unit", cellStyle: { 'text-align': 'right' }  },
            { headerName: "EngineNo", width: 180, field: "EngineNo", cellStyle: { 'text-align': 'right' }  },
            { headerName: "Model", width: 180, field: "Model", cellStyle: { 'text-align': 'right' }  },
            { headerName: "JournalInAmt", width: 180, field: "JournalInAmt", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },
            { headerName: "JournalInQty", width: 180, field: "JournalInQty", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },
            { headerName: "JournalOutQty", width: 180, field: "JournalOutQty", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },
            { headerName: "JournalOutAmt", width: 180, field: "JournalOutAmt", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },
            { headerName: "PaymentQty", width: 180, field: "PaymentQty", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },
            { headerName: "PaymentAmt", width: 180, field: "PaymentAmt", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },
            { headerName: "PurchaseQty", width: 180, field: "PurchaseQty", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },
            { headerName: "PurchaseAmt", width: 180, field: "PurchaseAmt", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },
            { headerName: "PurchaseRate", width: 180, field: "PurchaseRate", cellStyle: { 'text-align': 'right' }  },
            { headerName: "StockJournalInAmt", width: 180, field: "StockJournalInAmt", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },
            { headerName: "StockJournalInQty", width: 180, field: "StockJournalInQty", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },
            { headerName: "StockJournalOutQty", width: 180, field: "StockJournalOutQty", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },
            { headerName: "StockJournalOutAmt", width: 180, field: "StockJournalOutAmt", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },
            { headerName: "StockTransferOutAmt", width: 180, field: "StockTransferOutAmt", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },
            { headerName: "StockTransferOutQty", width: 180, field: "StockTransferOutQty", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },
            { headerName: "StockTransferInQty", width: 180, field: "StockTransferInQty", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },
            { headerName: "StockTransferInQty", width: 180, field: "StockTransferInQty", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },
            { headerName: "SalesReturnAmt", width: 180, field: "SalesReturnAmt", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },
            { headerName: "SalesReturnQty", width: 180, field: "SalesReturnQty", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },
            { headerName: "SalesAllotmentAmt", width: 180, field: "SalesAllotmentAmt", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },
            { headerName: "SalesAllotmentQty", width: 180, field: "SalesAllotmentQty", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },
            { headerName: "SalesAllotmentCancelAmt", width: 180, field: "SalesAllotmentCancelAmt", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },
            { headerName: "SalesAllotmentCancelQty", width: 180, field: "SalesAllotmentCancelQty", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },
            { headerName: "ReceiptAmt", width: 180, field: "ReceiptAmt", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },
            { headerName: "ReceiptQty", width: 180, field: "ReceiptQty", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },
            { headerName: "ReceiptNoteQty", width: 180, field: "ReceiptNoteQty", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },
            { headerName: "ReceiptNoteAmt", width: 180, field: "ReceiptNoteAmt", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },
            { headerName: "ReceiptNoteReturnAmt", width: 180, field: "ReceiptNoteReturnAmt", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },
            { headerName: "ReceiptNoteReturnQty", width: 180, field: "ReceiptNoteReturnQty", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },
            { headerName: "CannibalizeInAmt", width: 180, field: "CannibalizeInAmt", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },
            { headerName: "CannibalizeInQty", width: 180, field: "CannibalizeInQty", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },
            { headerName: "CannibalizeOutQty", width: 180, field: "CannibalizeOutQty", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },
            { headerName: "CannibalizeOutAmt", width: 180, field: "CannibalizeOutAmt", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },
            { headerName: "ConsumptionAmt", width: 180, field: "ConsumptionAmt", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },
            { headerName: "ConsumptionQty", width: 180, field: "ConsumptionQty", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },
            { headerName: "DeliveryNoteAmt", width: 180, field: "DeliveryNoteAmt", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },
            { headerName: "DeliveryNoteQty", width: 180, field: "DeliveryNoteQty", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },
            { headerName: "DeliveryNoteReturnQty", width: 180, field: "DeliveryNoteReturnQty", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },
            { headerName: "DeliveryNoteReturnAmt", width: 180, field: "DeliveryNoteReturnAmt", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },
            { headerName: "MStockJournalInAmt", width: 180, field: "MStockJournalInAmt", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },
            { headerName: "MStockJournalInQty", width: 180, field: "MStockJournalInQty", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },
            { headerName: "MStockJournalOutQty", width: 180, field: "MStockJournalOutQty", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },
            { headerName: "MStockJournalOutAmt", width: 180, field: "MStockJournalOutAmt", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },
            { headerName: "PurchaseQty", width: 180, field: "PurchaseQty", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },
            { headerName: "PurchaseAmt", width: 180, field: "PurchaseAmt", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },
            { headerName: "PurchaseRate", width: 180, field: "PurchaseRate", cellStyle: { 'text-align': 'right' }  },
            { headerName: "PurchaseReturnAmt", width: 180, field: "PurchaseReturnAmt", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },
            { headerName: "PurchaseReturnQty", width: 180, field: "PurchaseReturnQty", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },
            
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
                    Name: 'TOTAL =>',
                    OpeningQty: 0,
                    OpeningAmt: 0,
                    InAmt: 0,
                    InQty: 0,
                    OutQty: 0,
                    OutAmt: 0,
                    BalanceQty: 0,
                    BalanceAmt: 0,
                    JournalInAmt: 0,
                    JournalInQty: 0,
                    JournalOutQty: 0,
                    JournalOutAmt: 0,
                    PaymentQty: 0,
                    PaymentAmt: 0,
                    PurchaseQty: 0,
                    PurchaseAmt: 0,
                    StockJournalInAmt: 0,
                    StockJournalInQty:0,
                    StockJournalOutQty:0,
                    StockJournalOutAmt: 0,
                    StockTransferOutAmt: 0,
                    StockTransferOutQty: 0,
                    StockTransferInQty: 0,
                    StockTransferInAmt: 0,
                    SalesReturnAmt: 0,
                    SalesReturnQty: 0,
                    SalesAllotmentAmt:0,
                    SalesAllotmentQty: 0,
                    SalesAllotmentCancelAmt: 0,
                    SalesAllotmentCancelQty: 0,
                    ReceiptAmt: 0,
                    ReceiptQty: 0,
                    ReceiptNoteQty: 0,
                    ReceiptNoteAmt: 0,
                    ReceiptNoteReturnAmt: 0,
                    ReceiptNoteReturnQty: 0,
                    CannibalizeInAmt: 0,
                    CannibalizeInQty: 0,
                    CannibalizeOutQty: 0,
                    CannibalizeOutAmt: 0,
                    ConsumptionAmt: 0,
                    ConsumptionQty: 0,
                    DeliveryNoteAmt: 0,
                    DeliveryNoteQty: 0,
                    DeliveryNoteReturnQty: 0,
                    DeliveryNoteReturnAmt: 0,
                    DeliveryNoteReturnQty: 0,
                    DeliveryNoteReturnAmt: 0,
                    MStockJournalInAmt: 0,
                    MStockJournalInQty: 0,
                    MStockJournalOutQty: 0,
                    MStockJournalOutAmt: 0,
                    PurchaseQty: 0,
                    PurchaseAmt: 0,
                    PurchaseReturnAmt: 0,
                    PurchaseReturnQty: 0,
                }
                $scope.gridOptions.api.forEachNodeAfterFilterAndSort(function (node) {
                    var fData = node.data;
                    OpeningQty += fData.OpeningQty;
                    OpeningAmt += fData.OpeningAmt;
                    InAmt += fData.InAmt;
                    InQty += fData.InQty;
                    OutQty += fData.OutQty;
                    OutAmt += fData.OutAmt;
                    BalanceQty += fData.BalanceQty;
                    BalanceAmt += fData.BalanceAmt;
                    JournalInAmt += fData.JournalInAmt;
                    JournalInQty += fData.JournalInQty;
                    JournalOutQty += fData.JournalOutQty;
                    JournalOutAmt += fData.JournalOutAmt;
                    PaymentQty += fData.PaymentQty;
                    PaymentAmt += fData.PaymentAmt;
                    PurchaseQty += fData.PurchaseQty;
                    PurchaseAmt += fData.PurchaseAmt;
                    StockJournalInAmt += fData.StockJournalInAmt;
                    StockJournalInQty += fData.StockJournalInQty;
                    StockJournalOutQty += fData.StockJournalOutQty;
                    StockJournalOutAmt += fData.StockJournalOutAmt;
                    StockTransferOutAmt += fData.StockTransferOutAmt;
                    StockTransferOutQty += fData.StockTransferOutQty;
                    StockTransferInQty += fData.StockTransferInQty;
                    StockTransferInAmt += fData.StockTransferInAmt;
                    SalesReturnAmt += fData.SalesReturnAmt;
                    SalesReturnQty += fData.SalesReturnQty;
                    SalesAllotmentAmt += fData.SalesAllotmentAmt;
                    SalesAllotmentQty += fData.SalesAllotmentQty;
                    SalesAllotmentCancelAmt += fData.SalesAllotmentCancelAmt;
                    SalesAllotmentCancelQty += fData.SalesAllotmentCancelQty;
                    ReceiptAmt += fData.ReceiptAmt;
                    ReceiptQty += fData.ReceiptQty;
                    ReceiptNoteQty += fData.ReceiptNoteQty;
                    ReceiptNoteAmt += fData.ReceiptNoteAmt;
                    ReceiptNoteReturnAmt += fData.ReceiptNoteReturnAmt;
                    ReceiptNoteReturnQty += fData.ReceiptNoteReturnQty;
                    CannibalizeInAmt += fData.CannibalizeInAmt;
                    CannibalizeInQty += fData.CannibalizeInQty;
                    CannibalizeOutQty += fData.CannibalizeOutQty;
                    CannibalizeOutAmt += fData.CannibalizeOutAmt;
                    ConsumptionAmt += fData.ConsumptionAmt;
                    ConsumptionQty += fData.ConsumptionQty;
                    DeliveryNoteAmt += fData.DeliveryNoteAmt;
                    DeliveryNoteQty += fData.DeliveryNoteQty;
                    DeliveryNoteReturnQty += fData.DeliveryNoteReturnQty;
                    DeliveryNoteReturnAmt += fData.DeliveryNoteReturnAmt;
                    DeliveryNoteReturnQty += fData.DeliveryNoteReturnQty;
                    DeliveryNoteReturnAmt += fData.DeliveryNoteReturnAmt;
                    MStockJournalInAmt += fData.MStockJournalInAmt;
                    MStockJournalInQty += fData.MStockJournalInQty;
                    MStockJournalOutQty += fData.MStockJournalOutQty;
                    MStockJournalOutAmt += fData.MStockJournalOutAmt;
                    PurchaseQty += fData.PurchaseQty;
                    PurchaseAmt += fData.PurchaseAmt;
                    PurchaseReturnAmt += fData.PurchaseReturnAmt;
                    PurchaseReturnQty += fData.PurchaseReturnQty;

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
        var DataColl = [];
        $scope.gridOptionsBottom.api.setRowData(DataColl);
        $scope.gridOptions.api.setRowData(DataColl);
    };

    $scope.GetProductGroupDetails = function () {
        $scope.ClearData();
        var dateFrom = new Date(($filter('date')(new Date(), 'yyyy-MM-dd')));
        var dateTo = new Date(($filter('date')(new Date(), 'yyyy-MM-dd')));

        if ($scope.ProductGroupDetails.DateFromDet)
            dateFrom = new Date(($filter('date')($scope.ProductGroupDetails.DateFromDet.dateAD, 'yyyy-MM-dd')));

        if ($scope.ProductGroupDetails.DateToDet)
            dateTo = new Date(($filter('date')($scope.ProductGroupDetails.DateToDet.dateAD, 'yyyy-MM-dd')));

        $scope.DataColl = []; //declare an empty array
        $scope.gridOptions.api.setRowData($scope.DataColl);

        var beData = {
            DateFrom: dateFrom,
            DateTo: dateTo,
            VoucherType: $scope.ProductGroupDetails.VoucherId,
            isPost: $scope.ProductGroupDetails.IsPost,
            ledgergroupid: $scope.ProductGroupDetails.LedgerGroupId,
            isClearOnly: $scope.ProductGroupDetails.IsClearOnly,
            branchId: $scope.ProductGroupDetails.BranchId,
            ProductGroupId: 0,
            GodownId: 0,
        };

        $scope.loadingstatus = 'running';
        showPleaseWait();

        $http({
            method: "POST",
            url: base_url + "Inventory/Reporting/GetProductGroupDetails",
            data: JSON.stringify(beData),
            dataType: "json"
        }).then(function (res) {

            $scope.loadingstatus = 'stop';
            hidePleaseWait();

            if (res.data.IsSuccess && res.data.Data) {
                $scope.DataColl = res.data.Data;

                var Opening = 0;
                angular.forEach($scope.DataColl, function (dc) {
                    if (dc.BalanceAmt == 1 || dc.BalanceAmt == 'DR')
                        Opening += dc.BalanceAmt;
                    else
                        Opening -= dc.BalanceAmt;
                });

                var drcr = '';
                if (Opening > 0)
                    drcr = '';
                else if (Opening < 0)
                    drcr = ''

                Opening = Math.abs(Opening);


                $scope.dataForBottomGrid[0].BalanceAmt = Opening;
                $scope.dataForBottomGrid[0].CrAmount = drcr;
                $scope.gridOptionsBottom.api.setRowData($scope.dataForBottomGrid);

                $scope.gridOptions.api.setRowData($scope.DataColl);
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
                down_file(base_url + "//" + res.data.Data.ResponseId, "ProductGroupDetails.xlsx");
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
