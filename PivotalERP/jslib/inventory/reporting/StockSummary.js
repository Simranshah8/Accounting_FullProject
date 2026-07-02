"use strict";

agGrid.initialiseAgGridWithAngular1(angular);


app.controller("stockSummaryController", function ($scope, $http, $filter, $timeout, GlobalServices, $compile) {

    

  var PrintPreviewAs = 1;
    const contextMenu = GlobalServices.createElementForMenu();
    LoadData();

    $scope.toggleExpandCollapse = function () {
        if ($scope.ProductGroupSummary.ExpandCollapse == true) {
            $scope.gridOptions.api.expandAll();
        } else {
            $scope.gridOptions.api.collapseAll();
        }
    };

    $scope.onBtExportCSV = function () {
        var params = {
            fileName: 'ProductGroupSummary.csv',
            sheetName: 'ProductGroupSummary'
        };

        $scope.gridOptions.api.exportDataAsCsv(params);
    }

    $scope.onFilterTextBoxChanged = function () {
        $scope.gridOptions.api.setQuickFilter($scope.search);
    }

    function LoadData()
    {

        $scope.ProductSearchOptions = [{ text: 'Name', value: 'P.Name', searchType: 'text' }, { text: 'Code', value: 'P.Code', searchType: 'text' }, { text: 'Part No.', value: 'P.PartNo', searchType: 'text' }, { text: 'H.S. Code', value: 'P.HSCode', searchType: 'text' }, { text: 'Alias', value: 'P.Alias', searchType: 'text' }, { text: 'Group', value: 'PG.Name', searchType: 'text' },];
        $scope.paginationOptions = {
            pageNumber: 1,
            pageSize: GlobalServices.getPerPageRow(),
            sort: null,
            SearchType: 'text',
            SearchCol: '',
            SearchVal: '',
            SearchColDet: $scope.ProductSearchOptions[0],
            pagearray: [],
            pageOptions: [5, 10, 20, 30, 40, 50]
        };

        $scope.VoucherAsColl = [{ id: 0, text: 'None' }, { id: 1, text: 'Summary' }, { id: 2, text: 'Details' }];
        $scope.RefTableColColl = GlobalServices.getRptTableColColl();
             
        GetCustomRptColumns();

        $('.select2').select2({
            allowClear: true,
            openOnEnter: true
        });

        $scope.FixedProductConfig = [];
        $http({
            method: 'GET',
            url: base_url + "Inventory/Creation/GetFixedProductConfig",
            dataType: "json",
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.FixedProductConfig = res.data.Data;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        $scope.AllGodownColl = []; //declare an empty array
        $http({
            method: 'GET',
            url: base_url + "Inventory/Reporting/GetAllGodown",
            dataType: "json"            
        }).then(function (res) {            
            if (res.data.IsSuccess && res.data.Data) {
                $scope.AllGodownColl = res.data.Data; 
            }  
        }, function (reason) {
            $scope.loadingstatus = "stop";
            alert('Failed' + reason);
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

        $scope.ProductCompanyColl = [];
        $http({
            method: 'GET',
            url: base_url + "Inventory/Creation/GetAllProductCompany",
            dataType: "json"            
        }).then(function (res) {

            if (res.data.IsSuccess && res.data.Data) {
                $scope.ProductCompanyColl = res.data.Data;
            } 
        }, function (reason) {
            alert('Failed' + reason);
        });

        $scope.ProductTypeColl = [];
        $http({
            method: 'GET',
            url: base_url + "Inventory/Creation/GetAllProductType",
            dataType: "json"
            //data:JSON.stringify(para)
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.ProductTypeColl = res.data.Data;
            } 
        }, function (reason) {
            alert('Failed' + reason);
        });

        $scope.CategoriesColl = [];
        $http({
            method: 'GET',
            url: base_url + "Inventory/Creation/GetProductCategories",
            dataType: "json"
            //data:JSON.stringify(para)
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.CategoriesColl = res.data.Data;
            } 
        }, function (reason) {
            alert('Failed' + reason);
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


        $scope.ProductGroupSummary = {
            DateFrom_TMP: new Date(),
            DateTo_TMP: new Date(),
            VoucherId: 0,
            IsPost: true,
            ProductGroupId: 1,
            IsClearOnly: true,
            GodownWise: true,
            BranchId: 0,
            BatchWise: false,
            ShowStandardRate: false,
            RackWise: false,
            SelectedProductIdColl:[],
        };
         
        $scope.DateStyles = GlobalServices.getDateStyle();
        GlobalServices.getDateStyleConfig().then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                var dateStyle = res.data.Data;
                $scope.ProductGroupSummary.DateStyle = dateStyle;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        $timeout(function () {
            GlobalServices.getCompanyDet().then(function (res) {
                var comDet = res.data.Data;
                if (comDet) {
                    $scope.ProductGroupSummary.DateFrom_TMP = new Date(comDet.StartDate);
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

        //{
        //    headerName: ' Opening ',
        //        children: [
        //            { headerName: "Qty.", width: 180, field: "O_Qty", cellStyle: { 'text-align': 'right' } },
        //            { headerName: "Rate", width: 180, field: "O_Rate", cellStyle: { 'text-align': 'right' } },
        //            { headerName: "Amt.", width: 180, field: "O_Amt", cellStyle: { 'text-align': 'right' } },
        //        ]
        //}

        $scope.columnDefs = [
            {
                headerName: "Name", width: 210, field: "Name", dataType: 'Text', cellRenderer: 'agGroupCellRenderer', pinned: 'left',
                
                filter: 'agTextColumnFilter', pinned: 'left'
            },
            //{
            //    headerName: "Name", width: 210, field: "Name", cellStyle: { 'text-align': 'left' }, pinned: 'left',
               
            //    cellRenderer: function (params) {

            //        if (params.data.IsFixedProduct == true)
            //            return '<a class="btn btn-default btn-xs" data-toggle="tooltip" data-placement="top" title="Show Fixed Product Details" ng-click="ShowFixedProductDetails(this.data)">' + params.data.Name+'</a> ';
            //        else
            //            return '<a class="clickcursor" data-toggle="tooltip" data-placement="top" title="View Product" ng-click="ShowProduct(this.data)">' + params.data.Name + '</a> ';
            //            //return params.data.Name;
            //    },

            //},
            { headerName: "Miti", colId: 'sv1', width: 110, field: "VoucherMiti", cellStyle: { 'text-align': 'center' } },
            { headerName: "Date", colId: 'sv2', width: 110, field: "VoucherDate", cellStyle: { 'text-align': 'center' } },
            { headerName: "Voucher No", colId: 'sv3', width: 130, field: "VoucherNo", cellStyle: { 'text-align': 'center' } },
            { headerName: "Party", colId: 'sv4', width: 210, field: "PartyName", cellStyle: { 'text-align': 'left' } },
            { headerName: "Batch No.", width: 140, colId: 'clBatch', field: "BatchNo", cellStyle: { 'text-align': 'left' }, hide: true, pinned: 'left'},
            { headerName: "Alias", hide: true, colId:'det1', width: 120, field: "Alias", cellStyle: { 'text-align': 'left' } },
            { headerName: "Code", colId: 'det2', width: 110, field: "Code", cellStyle: { 'text-align': 'left' } },
            { headerName: "HS Code", colId: 'det2', width: 110, field: "HSCode", cellStyle: { 'text-align': 'left' } },

            { headerName: "RegdNo", width: 160, colId: 'colRegdNo', field: "RegdNo", cellStyle: { 'text-align': 'left' }, hide: true, },
            { headerName: "EngineNo", width: 190, colId: 'colEngineNo', field: "EngineNo", cellStyle: { 'text-align': 'left' }, hide: true,   },
            { headerName: "ChassisNo", width: 190, colId: 'colChassisNo', field: "ChassisNo",   cellStyle: { 'text-align': 'left' }, hide: true, },
            { headerName: "Model", width: 190, colId: 'colModel', field: "Model", cellStyle: { 'text-align': 'left' }, hide: true,  },

            { headerName: "MFG. Date", width: 120, colId: 'clMFGDate', field: "MFGDate", cellStyle: { 'text-align': 'left' }, hide: true, valueFormatter: function (params) { return DateFormatAD(params.value); },},
            { headerName: "EXP. Date", width: 120, colId: 'clEXPDate', field: "EXPDate", cellStyle: { 'text-align': 'left' }, hide: true, valueFormatter: function (params) { return DateFormatAD(params.value); },},
            { headerName: "Group", width: 170, field: "Group", cellStyle: { 'text-align': 'left' } },
            { headerName: "Category", hide: true, colId: 'det3', width: 160, field: "Categories", cellStyle: { 'text-align': 'left' } },
            { headerName: "Product Type", hide: true, colId: 'det4', width: 140, field: "ProductType", cellStyle: { 'text-align': 'left' } },
            { headerName: "Brand", width: 140, hide: true, colId: 'det5', field: "Brand", cellStyle: { 'text-align': 'left' } },
            { headerName: "Godown", hide: false, colId: 'colGodown', width: 120, field: "Godown", cellStyle: { 'text-align': 'left' } },
            { headerName: "Rack", width: 140, colId: 'clRack', field: "RackName", cellStyle: { 'text-align': 'left' }, hide: true, },
            { headerName: "Opening Qty", width: 160, field: "O_Qty", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },

            { headerName: "OpeningQty1", hide: true, colId: 'OpeningQty1',width: 160, field: "OpeningQty1", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "OpeningQty2", hide: true, colId: 'OpeningQty2',width: 160, field: "OpeningQty2", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "OpeningQty3", hide: true, colId: 'OpeningQty3',width: 160, field: "OpeningQty3", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },

            { headerName: "Opening Rate", width: 160, field: "O_Rate", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value,3); } },
            { headerName: "Opening Amt", width: 160, field: "O_Amt", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "In Qty", width: 120, field: "In_Qty", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },

            { headerName: "InQty1", hide: true,colId:'InQty1', width: 120, field: "InQty1", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "InQty2", hide: true,colId: 'InQty2', width: 120, field: "InQty2", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "InQty3", hide: true,colId: 'InQty3', width: 120, field: "InQty3", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },

            { headerName: "In Rate", width: 120, field: "InRate", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value,3); } },
            { headerName: "In Amt", width: 120, field: "In_Amt", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "Out Qty", width: 120, field: "Out_Qty", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },

            { headerName: "OutQty1", hide: true, colId: 'OutQty1', width: 120, field: "OutQty1", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "OutQty2", hide: true, colId: 'OutQty2', width: 120, field: "OutQty2", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "OutQty3", hide: true, colId: 'OutQty3', width: 120, field: "OutQty3", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },

            { headerName: "Out Rate", width: 120, field: "OutRate", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value,3); } },
            { headerName: "Out Amt", width: 120, field: "Out_Amt", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },

            { headerName: "Sales CostRate", width: 140, hide: true, colId: 'det6', field: "SalesCostRate", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "Sales CostAmt", width: 140, hide: true, colId: 'det7', field: "SalesCostAmt", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "Sales Margin", width: 140, hide: true, colId: 'det8', field: "SalesMargin", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "Margin %", width: 140, hide: true, colId: 'det8', field: "MarginPer", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },

            { headerName: "Balance Qty", width: 140, field: "B_Qty", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "Unit", width: 120, field: "Unit", cellStyle: { 'text-align': 'left' } },

            { headerName: "BalQty1", hide: true, colId: 'BalQty1', width: 140, field: "BalQty1", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "BalQty2", hide: true, colId: 'BalQty2', width: 140, field: "BalQty2", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "BalQty3", hide: true, colId: 'BalQty3', width: 140, field: "BalQty3", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "BVal", hide: true, colId: 'BVal', width: 140, field: "BVal", cellStyle: { 'text-align': 'right' }, filter: "agTextColumnFilter"},

            
            { headerName: "Balance Rate", width: 140, field: "B_Rate", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value,3); } },
            { headerName: "Balance Amt", width: 140, field: "B_Amt", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },

            { headerName: "PurchaseCostAmt", width: 180, hide: true, colId: 'det9', field: "PurchaseCostAmt", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },

            { headerName: "Payment_Qty", width: 150, hide: true, colId: 'det10', field: "Payment_Qty", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "Payment_Amt", width: 150, hide: true, colId: 'det11', field: "Payment_Amt", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "Journal_In_Qty", width: 150, hide: true, colId: 'det12', field: "Journal_In_Qty", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "Journal_In_Amt", width: 150, hide: true, colId: 'det13', field: "Journal_In_Amt", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "GRN_Qty", width: 140, hide: true, colId: 'det14', field: "GRN_Qty", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "GRN_Amt", width: 140, hide: true, colId: 'det15', field: "GRN_Amt", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "Purchase_Qty", width: 130, hide: true, colId: 'det16', field: "Purchase_Qty", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "Purchase_Amt", width: 130, hide: true, colId: 'det17', field: "Purchase_Amt", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },

            { headerName: "B_Purchase_Qty", width: 130, hide: true, colId: 'det41', field: "Purchase_Qty_B", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "B_Purchase_Amt", width: 130, hide: true, colId: 'det42', field: "Purchase_Amt_B", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },

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

            { headerName: "B_Sales_Qty", width: 130, hide: true, colId: 'det43', field: "Sales_Qty_B", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "B_Sales_Amt", width: 130, hide: true, colId: 'det44', field: "Sales_Amt_B", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },

            { headerName: "SalesReturn_Qty", width: 140, hide: true, colId: 'det30', field: "SalesReturn_Qty", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "SalesReturn_Amt", width: 140, hide: true, colId: 'det31', field: "SalesReturn_Amt", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "Consumption_Qty", width: 140, hide: true, colId: 'det32', field: "Consumption_Qty", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "Consumption_Amt", width: 140, hide: true, colId: 'det33', field: "Consumption_Amt", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "StockJournal_Out_Qty", width: 150, hide: true, colId: 'det34', field: "StockJournal_Out_Qty", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "StockJournal_Out_Amt", width: 150, hide: true, colId: 'det35', field: "StockJournal_Out_Amt", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },

            { headerName: "Purchase Rate", width: 150, hide: true, colId: 'det36', field: "PurchaseRate", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "Sale Rate", width: 150, hide: true, colId: 'det37', field: "SaleRate", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "Trade Rate", width: 150, hide: true, colId: 'det38', field: "TradeRate", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "MRP", width: 150, hide: true, colId: 'det39', field: "MRPRate", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "Is Taxable", width: 150, colId: 'det40', field: "IsTaxable", cellStyle: { 'text-align': 'right' }, filter: "agTextColumnFilter", },

            { headerName: "Part No.", width: 150, hide: true,  colId: 'det45', field: "PartNo", cellStyle: { 'text-align': 'left' }, filter: "agTextColumnFilter", },
            { headerName: "Remarks", width: 150, hide: true,  colId: 'det46', field: "PartRemarks", cellStyle: { 'text-align': 'left' }, filter: "agTextColumnFilter", },
            { headerName: "Description", width: 150, hide: true, colId: 'det47', field: "PartDescription", cellStyle: { 'text-align': 'left' }, filter: "agTextColumnFilter", },
            { headerName: "Group1", width: 170, field: "Group1", cellStyle: { 'text-align': 'left' } },
            { headerName: "Group2", width: 170, field: "Group2", cellStyle: { 'text-align': 'left' } },
            { headerName: "Group3", width: 170, field: "Group3", cellStyle: { 'text-align': 'left' } },

            {
                headerName: "Action",
                width: 50,
                cellRenderer: function (params) {
                    return '<div class="btn-group" style="position: fixed; ">' +
                        '<button type="button" class="btn btn-default px-1 dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
                        '<span class="caret"></span>' +
                        '</button>' +
                        '<ul class="dropdown-menu dropdown-menu-right p-2" style="position: absolute; left: 0;">' +
                        '<li><a data-toggle="tooltip" data-placement="top" title="Show Voucher" ng-click="ShowProductVoucher(this)"><i class="fas fa-info text-infor"></i> Show Voucher</a></li>' +
                        '</ul>' +
                        '</div>';
                },
                pinned: 'right'
            },
             
        ];
         

        $scope.gridOptions = {
			onCellContextMenu: onCellContextMenu, // Handle right-click event			
            angularCompileRows: true,
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
            getRowStyle: function (params) {
                return params.data.TranId >= 0 ? null: { "font-weight": "bold" }  ;
            },
          /*  masterDetail: true,*/
            getDetailRowData: function (params) {
                var beData = params.data;
                   var dateFrom = new Date(($filter('date')(new Date(), 'yyyy-MM-dd')));
                        var dateTo = new Date(($filter('date')(new Date(), 'yyyy-MM-dd')));

                        if ($scope.ProductGroupSummary.DateFromDet)
                            dateFrom = new Date(($filter('date')($scope.ProductGroupSummary.DateFromDet.dateAD, 'yyyy-MM-dd')));

                        if ($scope.ProductGroupSummary.DateToDet)
                            dateTo = new Date(($filter('date')($scope.ProductGroupSummary.DateToDet.dateAD, 'yyyy-MM-dd')));

                        var godownId = 0;
                        var godownIdColl = '';
                        if ($scope.ProductGroupSummary.GodownId && $scope.ProductGroupSummary.GodownId.length > 0) {
                            if ($scope.ProductGroupSummary.GodownId.length == 1)
                                godownId = $scope.ProductGroupSummary.GodownId[0];
                            else
                                godownIdColl = $scope.ProductGroupSummary.GodownId.toString();
                        } else if ($scope.ProductGroupSummary.ForBranchId > 0) {
                            angular.forEach($scope.AllGodownColl, function (g) {
                                if (g.BDId == $scope.ProductGroupSummary.ForBranchId) {

                                    if (godownIdColl.length > 0)
                                        godownIdColl = godownIdColl + ",";

                                    godownIdColl = godownIdColl + g.GodownId.toString();
                                }
                            });
                        }

                        var para11 = {
                            ProductId: beData.ProductId,
                            dateFrom: dateFrom,
                            dateTo: dateTo,
                            GodownId: ($scope.GodownColl.length == 1 ? $scope.GodownColl[0].GodownId : godownId),
                            GodownIdColl: godownIdColl,
                        };

                        $scope.loadingstatus = 'running';
                        showPleaseWait();

                        $http({
                            method: "POST",
                            url: base_url + "Inventory/Reporting/GetGodownWiseFixedProductDetails",
                            data: JSON.stringify(para11),
                            dataType: "json"
                        }).then(function (res) {

                            $scope.loadingstatus = 'stop';
                            hidePleaseWait();

                            if (res.data.IsSuccess && res.data.Data) {

                                beData.FixedProductColl = [];
                                res.data.Data.forEach(function (dd) {
                                    beData.FixedProductColl.push({
                                        RegdNo: dd.RegdNo,
                                        EngineNo: dd.EngineNo,
                                        ChassisNo: dd.ChassisNo,
                                        Model: dd.Model,
                                        In_Qty: dd.InQty,
                                        Out_Qty: dd.OutQty,
                                        BalanceQty: dd.BalQty,

                                    });
                                });
                                params.successCallback(beData.FixedProductColl);
                                 
                            }
                        }, function (reason) {
                            $scope.loadingstatus = "stop";
                            alert('Failed' + reason);
                        });

                 
            },
            getNodeChildDetails: function (beData) {

                if (beData.ItemDetailColl && beData.ItemDetailColl.length > 0) {
                    var dataColl = beData.ItemDetailColl;
                    return {
                        group: true,
                        children: dataColl,
                        expanded: true
                    };
                }
                else
                    return null;


            },
            onFilterChanged: function () {
                var dt = {
                    O_Qty: 0,
                    O_Amt: 0,
                    In_Qty: 0,
                    In_Amt: 0,
                    Out_Qty: 0,
                    Out_Amt: 0,
                    SalesCostAmt:0,
                    SalesMargin: 0,
                    B_Qty: 0,
                    B_Amt: 0,
                    PurchaseCostAmt: 0,
                    Payment_Qty: 0,
                    Payment_Amt: 0,
                    Journal_In_Qty: 0,
                    Journal_In_Amt: 0,
                    GRN_Qty: 0,
                    GRN_Amt: 0,
                    Purchase_Qty: 0,
                    Purchase_Amt: 0,
                    Purchase_Qty_B: 0,
                    Purchase_Amt_B: 0,
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
                    Sales_Qty_B: 0,
                    Sales_Amt_B: 0,
                    SalesReturn_Qty: 0,
                    SalesReturn_Amt: 0,
                    Consumption_Qty: 0,
                    Consumption_Amt: 0,
                    StockJournal_Out_Qty: 0,
                    StockJournal_Out_Amt: 0,
                };

                $scope.gridOptions.api.forEachNodeAfterFilterAndSort(function (node) {
                    var fData = node.data;
                    if (fData.RowType == 1) {
                        dt.O_Qty += fData.O_Qty;
                        dt.O_Amt += fData.O_Amt;
                        dt.In_Qty += fData.In_Qty;
                        dt.In_Amt += fData.In_Amt;
                        dt.Out_Qty += fData.Out_Qty;
                        dt.Out_Amt += fData.Out_Amt;
                        dt.SalesCostAmt += fData.SalesCostAmt;
                        dt.SalesMargin += fData.SalesMargin;
                        dt.B_Qty += fData.B_Qty;
                        dt.B_Amt += fData.B_Amt;
                        dt.PurchaseCostAmt += fData.PurchaseCostAmt;
                        dt.Payment_Qty += fData.Payment_Qty;
                        dt.Payment_Amt += fData.Payment_Amt;
                        dt.Journal_In_Qty += fData.Journal_In_Qty;
                        dt.Journal_In_Amt += fData.Journal_In_Amt;
                        dt.GRN_Qty += fData.GRN_Qty;
                        dt.GRN_Amt += fData.GRN_Amt;
                        dt.Purchase_Qty += fData.Purchase_Qty;
                        dt.Purchase_Amt += fData.Purchase_Amt;
                        dt.Purchase_Qty_B += fData.Purchase_Qty_B;
                        dt.Purchase_Amt_B += fData.Purchase_Amt_B;

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

                        dt.Sales_Qty_B += fData.Sales_Qty_B;
                        dt.Sales_Amt_B += fData.Sales_Amt_B;

                        dt.SalesReturn_Qty += fData.SalesReturn_Qty;
                        dt.SalesReturn_Amt += fData.SalesReturn_Amt;
                        dt.Consumption_Qty += fData.Consumption_Qty;
                        dt.Consumption_Amt += fData.Consumption_Amt;
                        dt.StockJournal_Out_Qty += fData.StockJournal_Out_Qty;
                        dt.StockJournal_Out_Amt += fData.StockJournal_Out_Amt;
                    }
                    
                });

                var filerDataColl = [];
                filerDataColl.push(dt);
                $scope.gridOptionsBottom.api.setRowData(filerDataColl);
            }

        };

      

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

        $scope.UnitColl = [];
        $http({
            method: 'GET',
            url: base_url + "Inventory/Creation/GetAllUnit",
            dataType: "json"            
        }).then(function (res) {             
            if (res.data.IsSuccess && res.data.Data) {
                $scope.UnitColl = res.data.Data;
            }  
        }, function (reason) {
            alert('Failed' + reason);
        });



        var columnDefsFP = [

            { headerName: "RegdNo", width: 160, field: "RegdNo", cellStyle: { 'text-align': 'left' }, pinned: 'left', },
            { headerName: "EngineNo", width: 190, field: "EngineNo", cellStyle: { 'text-align': 'left' }, pinned: 'left', },
            { headerName: "ChassisNo", width: 190, field: "ChassisNo", cellStyle: { 'text-align': 'left' } },
            { headerName: "Model", width: 190, field: "Model", cellStyle: { 'text-align': 'left' } }, 
              
            { headerName: "Opening Qty", width: 160, field: "OpeningQty", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },

            { headerName: "Opening Rate", width: 160, field: "OpeningRate", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value, 3); } },
            { headerName: "Opening Amt", width: 160, field: "OpeningAmt", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "In Qty", width: 120, field: "InQty", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },


            { headerName: "In Rate", width: 120, field: "InRate", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value, 3); } },
            { headerName: "In Amt", width: 120, field: "InAmt", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "Out Qty", width: 120, field: "OutQty", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "Out Rate", width: 120, field: "OutRate", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value, 3); } },
            { headerName: "Out Amt", width: 120, field: "OutAmt", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },

            { headerName: "Balance Qty", width: 140, field: "BalQty", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },
            
            //{ headerName: "Balance Rate", width: 140, field: "BalRate", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value, 3); } },
            //{ headerName: "Balance Amt", width: 140, field: "BalAmt", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); } },


        ];

        $scope.gridOptionsFP = {
            angularCompileRows: true,
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
            columnDefs: columnDefsFP,
            rowData: null,
            filter: true,
            suppressHorizontalScroll: true,
            alignedGrids: [],
            enableFilter: true,

            onFilterChanged: function () {
                var dt = {
                    OpeningQty: 0,
                    OpeningAmt: 0,
                    InQty: 0,
                    InAmt: 0,
                    OutQty: 0,
                    OutAmt: 0,
                    BalQty: 0,
                    BalAmt:0,
                };

                $scope.gridOptionsFP.api.forEachNodeAfterFilterAndSort(function (node) {
                    var fData = node.data;
                    dt.OpeningQty += fData.OpeningQty;
                    dt.OpeningAmt += fData.OpeningAmt;
                    dt.InQty += fData.InQty;
                    dt.InAmt += fData.InAmt;
                    dt.OutQty += fData.OutQty;
                    dt.OutAmt += fData.OutAmt;
                    dt.BalQty += fData.BalQty;
                    dt.BalAmt += fData.BalAmt;
                });

                var filerDataColl = [];
                filerDataColl.push(dt);
                $scope.gridOptionsBottomFP.api.setRowData(filerDataColl);
            }

        };



        $scope.dataForBottomGridFP = [
            {
                AutoNumber: '',
                ProductName: 'Total =>',
                BalanceAmt: 0,
                Rate: '',
            }];

        $scope.gridOptionsBottomFP = {
            defaultColDef: {
                resizable: true,
                width: 90
            },
            columnDefs: columnDefsFP,
            // we are hard coding the data here, it's just for demo purposes
            rowData: $scope.dataForBottomGridFP,
            debug: true,
            rowClass: 'bold-row',
            // hide the header on the bottom grid
            headerHeight: 0,
            alignedGrids: []
        };

        $scope.gridOptionsFP.alignedGrids.push($scope.gridOptionsBottomFP);
        $scope.gridOptionsBottomFP.alignedGrids.push($scope.gridOptionsFP);

        $scope.gridDivBottomFP = document.querySelector('#myGridBottomFP');
        new agGrid.Grid($scope.gridDivBottomFP, $scope.gridOptionsBottomFP);

        $timeout(function () {
            GlobalServices.getListState(EntityId, $scope.gridOptions);
        });
		
    }
    $scope.ShowProduct = function (obj) {
    

        $(document).ready(function () {
            $('body').css('cursor', 'wait');
        });

        var para = {
            tranId: obj.ProductId
        };
        var frame = document.getElementById("frmChieldForm");
        var frameDoc = frame.contentDocument || frame.contentWindow.document;
        if (frameDoc)
            frameDoc.removeChild(frameDoc.documentElement);

        frame.src = '';
        frame.src = base_url + "Inventory/Creation/Product?" + param(para);
        document.body.style.cursor = 'default';

        $('#frmChieldForm').on('load', function () {
            $('body').css('cursor', 'default');
        });

        $('#frmChield').modal('show');
    }
    $scope.ShowProductVoucher = function (e) {
        var obj = e.data;

        $(document).ready(function () {
            $('body').css('cursor', 'wait');
        });

        var para = {
            productId: obj.ProductId
        };
        var frame = document.getElementById("frmChieldForm");
        var frameDoc = frame.contentDocument || frame.contentWindow.document;
        if (frameDoc)
            frameDoc.removeChild(frameDoc.documentElement);

        frame.src = '';
        frame.src = base_url + "Inventory/Reporting/ProductVoucher?" + param(para);
        document.body.style.cursor = 'default';

        $('#frmChieldForm').on('load', function () {
            $('body').css('cursor', 'default');
        });

        $('#frmChield').modal('show');
    }

    $scope.ShowDetails=function(val){
        for (var i = 1; i < 36; i++) {

            if (i != 2) {

                var colName = 'det' + i.toString();
                $scope.gridOptions.columnApi.setColumnVisible(colName, val);
            }
        }

        for (var i = 41; i < 48; i++) {
            var colName = 'det' + i.toString();
            $scope.gridOptions.columnApi.setColumnVisible(colName, val);
        }
    }
    $scope.ShowGodown = function (val)
    {
        var colName = 'colGodown';
        $scope.gridOptions.columnApi.setColumnVisible(colName, val);

        $scope.GetProductGroupSummary();
    }


    $scope.ShowBatchWise = function (val) {

        if(val==true)
            $scope.gridOptions.columnApi.setColumnVisible('colGodown', val);

        $scope.gridOptions.columnApi.setColumnVisible('clBatch', val);
        $scope.gridOptions.columnApi.setColumnVisible('clMFGDate', val);
        $scope.gridOptions.columnApi.setColumnVisible('clEXPDate', val);

        $scope.GetProductGroupSummary();
    }

    $scope.ShowRackWise = function (val) {

        if (val == true)
            $scope.gridOptions.columnApi.setColumnVisible('colGodown', val);

        $scope.gridOptions.columnApi.setColumnVisible('clRack', val);
        
        $scope.GetProductGroupSummary();
    }

    $scope.ShowFixedProductDet = function (val) {

        if (val == true)
            $scope.gridOptions.columnApi.setColumnVisible('colGodown', val);
         
        $scope.FixedProductConfig = [];
        $http({
            method: 'GET',
            url: base_url + "Inventory/Creation/GetFixedProductConfig",
            dataType: "json",
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.FixedProductConfig = res.data.Data;

                var fixedColumns = GlobalServices.getFixedProductColumns();
                fixedColumns.forEach(function (fcol) {
                    var findCol = $scope.gridOptions.columnApi.getColumn(fcol.colName);
                    if (findCol) {
                        var isVisible = $scope.FixedProductConfig[fcol.show];
                        var headerName = $scope.FixedProductConfig[fcol.text];
                        findCol.headerName = headerName;
                        findCol.colDef.headerName = headerName;
                        if (isVisible == false) {
                            $scope.gridOptions.columnApi.setColumnVisible(fcol.colName, false);
                        }
                        else {
                            $scope.gridOptions.columnApi.setColumnVisible(fcol.colName, val);
                        }
                        
                    }
                });

                $scope.gridOptions.api.refreshHeader();

                 
                $scope.GetProductGroupSummary();

            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

    }

    

    $scope.ShowAUnit1 = function () {

        var val = false;

        if ($scope.ProductGroupSummary.UnitId1 > 0)
            val = true;

        if (val == true) {
            var findUnit = mx($scope.UnitColl).firstOrDefault(p1 => p1.UnitId == $scope.ProductGroupSummary.UnitId1);
            if (findUnit) {
                $scope.gridOptions.columnApi.getColumn("InQty1").colDef.headerName = "IN-" + findUnit.Name;
                $scope.gridOptions.columnApi.getColumn("OutQty1").colDef.headerName = "OUT-" + findUnit.Name;
                $scope.gridOptions.columnApi.getColumn("BalQty1").colDef.headerName = "BAL-" + findUnit.Name;
            }
        }
       
        $scope.gridOptions.columnApi.setColumnVisible('InQty1', val);
        $scope.gridOptions.columnApi.setColumnVisible('OutQty1', val);
        $scope.gridOptions.columnApi.setColumnVisible('BalQty1', val);

        if ($scope.ProductGroupSummary.UnitId1 > 0 || $scope.ProductGroupSummary.UnitId2 > 0 || $scope.ProductGroupSummary.UnitId2 > 0) {
            $scope.gridOptions.columnApi.setColumnVisible('BVal', true);
        }
        else
            $scope.gridOptions.columnApi.setColumnVisible('BVal', false);

       

        if(val==true)
            $scope.GetProductGroupSummary();
    }

    $scope.ShowAUnit = function (uval) {
         
        var val = false;

        if ($scope.ProductGroupSummary.UnitId1 > 0)
            val = true;

        if (val == true) {
            var findUnit = null;

            if(uval==1)
                findUnit = mx($scope.UnitColl).firstOrDefault(p1 => p1.UnitId == $scope.ProductGroupSummary.UnitId1);
            else if (uval == 2)
                findUnit = mx($scope.UnitColl).firstOrDefault(p1 => p1.UnitId == $scope.ProductGroupSummary.UnitId2);
            else if (uval == 3)
                findUnit = mx($scope.UnitColl).firstOrDefault(p1 => p1.UnitId == $scope.ProductGroupSummary.UnitId3);

            if (findUnit) {
                $scope.gridOptions.columnApi.getColumn("InQty"+uval).colDef.headerName = "IN-" + findUnit.Name;
                $scope.gridOptions.columnApi.getColumn("OutQty" + uval).colDef.headerName = "OUT-" + findUnit.Name;
                $scope.gridOptions.columnApi.getColumn("BalQty" + uval).colDef.headerName = "BAL-" + findUnit.Name;
            }
        }

        $scope.gridOptions.columnApi.setColumnVisible('InQty' + uval, val);
        $scope.gridOptions.columnApi.setColumnVisible('OutQty' + uval, val);
        $scope.gridOptions.columnApi.setColumnVisible('BalQty' + uval, val);

        if ($scope.ProductGroupSummary.UnitId1 > 0 || $scope.ProductGroupSummary.UnitId2 > 0 || $scope.ProductGroupSummary.UnitId2 > 0) {
            $scope.gridOptions.columnApi.setColumnVisible('BVal', true);
        }
        else
            $scope.gridOptions.columnApi.setColumnVisible('BVal', false);



        if (val == true)
            $scope.GetProductGroupSummary();
    }

    $scope.ShowStandardRate = function (uval) {
         
        $scope.gridOptions.columnApi.setColumnVisible('det36', uval);
        $scope.gridOptions.columnApi.setColumnVisible('det37', uval);
        $scope.gridOptions.columnApi.setColumnVisible('det38', uval);
        $scope.gridOptions.columnApi.setColumnVisible('det39', uval);
          
        if (uval == true)
            $scope.GetProductGroupSummary();
    }


    $scope.ClearData = function ()
    {

        $scope.RptDataColl = [];
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

    $scope.ForCustomColumn = {};
    $scope.GetProductGroupSummary = function () {

        $scope.ClearData();

        if (!$scope.ProductGroupSummary.ProductGroupId || $scope.ProductGroupSummary.ProductGroupId == 0)
            return;

        

        var dateFrom = new Date(($filter('date')(new Date(), 'yyyy-MM-dd')));
        var dateTo = new Date(($filter('date')(new Date(), 'yyyy-MM-dd')));

        if ($scope.ProductGroupSummary.DateFromDet)
            dateFrom = new Date(($filter('date')($scope.ProductGroupSummary.DateFromDet.dateAD, 'yyyy-MM-dd')));

        if ($scope.ProductGroupSummary.DateToDet)
            dateTo = new Date(($filter('date')($scope.ProductGroupSummary.DateToDet.dateAD, 'yyyy-MM-dd')));

        var godownId = 0;
        var godownIdColl = '';
        if ($scope.ProductGroupSummary.GodownId && $scope.ProductGroupSummary.GodownId.length > 0) {
            if ($scope.ProductGroupSummary.GodownId.length == 1)
                godownId = $scope.ProductGroupSummary.GodownId[0];
            else
                godownIdColl = $scope.ProductGroupSummary.GodownId.toString();
        } else if ($scope.ProductGroupSummary.ForBranchId > 0) {
            angular.forEach($scope.AllGodownColl, function (g) {
                if (g.BDId == $scope.ProductGroupSummary.ForBranchId) {

                    if (godownIdColl.length > 0)
                        godownIdColl = godownIdColl + ",";

                    godownIdColl = godownIdColl + g.GodownId.toString();
                }
            });
        }

        var beData = {
            ProductGroupId: $scope.ProductGroupSummary.ProductGroupId,
            dateFrom: dateFrom,
            dateTo: dateTo,
            //GodownId: ($scope.GodownColl.length == 1 ? $scope.GodownColl[0].GodownId : $scope.ProductGroupSummary.GodownId),
            GodownId: ($scope.GodownColl.length == 1 ? $scope.GodownColl[0].GodownId : godownId),
            GodownWise: $scope.ProductGroupSummary.GodownWise,
            AUnitId1: $scope.ProductGroupSummary.UnitId1,
            AUnitId2: $scope.ProductGroupSummary.UnitId2,
            AUnitId3: $scope.ProductGroupSummary.UnitId3,
            BatchWise: ($scope.ProductGroupSummary.FixedProductDet==true || $scope.ProductGroupSummary.BatchWise==true ) ? true : false,
            GodownIdColl: godownIdColl,
            ShowStandardRate: $scope.ProductGroupSummary.ShowStandardRate,
            ProductCompanyId: $scope.ProductGroupSummary.ProductCompanyId,
            ProductCategoryId: $scope.ProductGroupSummary.ProductCategoryId,
            ProductTypeId: $scope.ProductGroupSummary.ProductTypeId,
            ForAudit: ($scope.ProductGroupSummary.ForAudit == true ? true : false),
            RackWise: ($scope.ProductGroupSummary.RackWise == true ? true : false),
            ShowVoucherAs: $scope.ProductGroupSummary.ShowVoucherAs,
            ProductIdColl: ($scope.ProductGroupSummary.SelectedProductIdColl && $scope.ProductGroupSummary.SelectedProductIdColl.length > 0 ? $scope.ProductGroupSummary.SelectedProductIdColl.toString() : ''),
        };

        var sv = $scope.ProductGroupSummary.ShowVoucherAs;
        var showSV = false;
        if (sv == 1 || sv == 2) {
            showSV = true;
        }
        $scope.gridOptions.columnApi.setColumnVisible('sv1', showSV);
        $scope.gridOptions.columnApi.setColumnVisible('sv2', showSV);
        $scope.gridOptions.columnApi.setColumnVisible('sv3', showSV);
        $scope.gridOptions.columnApi.setColumnVisible('sv4', showSV);

        $scope.loadingstatus = 'running';
        showPleaseWait();

        $http({
            method: "POST",
            url: base_url + "Inventory/Reporting/GetStockSummary",
            data: JSON.stringify(beData),
            dataType: "json"
        }).then(function (res) {

            $scope.loadingstatus = 'stop';
            hidePleaseWait();

            if (res.data.IsSuccess && res.data.Data)
            {
                if (res.data.Data.length > 0) {
                    $scope.RptDataColl = res.data.Data;
                    $scope.ForCustomColumn = $scope.RptDataColl[0];
                }

                if ($scope.CustomRptColumn && $scope.CustomRptColumn.TranId > 0)
                {
                    $scope.GetCustomColData();
                }
                else
                {

                    var O_Qty = 0, O_Amt = 0, In_Qty = 0, In_Amt = 0, Out_Qty = 0, Out_Amt = 0, SalesCostAmt=0,
                        SalesMargin = 0,B_Qty = 0,B_Amt = 0,PurchaseCostAmt = 0,Payment_Qty = 0,Payment_Amt = 0,Journal_In_Qty = 0,Journal_In_Amt = 0,GRN_Qty = 0,GRN_Amt = 0,
                        Purchase_Qty = 0, Purchase_Amt = 0, Purchase_Qty_B = 0, Purchase_Amt_B = 0,PurchaseReturn_Qty = 0,PurchaseReturn_Amt = 0,StockJournal_In_Qty = 0,StockJournal_In_Amt = 0,Receipt_Qty = 0,Receipt_Amt = 0,Journal_Out_Qty = 0,
                        Journal_Out_Amt = 0, DeliveryNote_Qty = 0, DeliveryNote_Amt = 0, Sales_Qty = 0, Sales_Amt = 0, Sales_Qty_B = 0, Sales_Amt_B = 0,SalesReturn_Qty = 0,SalesReturn_Amt = 0,Consumption_Qty = 0,Consumption_Amt = 0,
                        StockJournal_Out_Qty = 0,StockJournal_Out_Amt = 0;

                    $scope.RptDataColl.forEach(function (dt) {
                        O_Qty += dt.O_Qty;
                        O_Amt += dt.O_Amt;
                        In_Qty += dt.In_Qty;
                        In_Amt += dt.In_Amt;
                        Out_Qty += dt.Out_Qty;
                        Out_Amt += dt.Out_Amt;
                        SalesMargin += dt.SalesMargin;
                        SalesCostAmt += dt.SalesCostAmt;
                        B_Qty += dt.B_Qty;
                        B_Amt += dt.B_Amt;
                        PurchaseCostAmt += dt.PurchaseCostAmt;
                        Payment_Qty += dt.Payment_Qty;
                        Payment_Amt += dt.Payment_Amt;
                        Journal_In_Qty += dt.Journal_In_Qty;
                        Journal_In_Amt += dt.Journal_In_Amt;
                        GRN_Qty += dt.GRN_Qty;
                        GRN_Amt += dt.GRN_Amt;
                        Purchase_Qty += dt.Purchase_Qty;
                        Purchase_Amt += dt.Purchase_Amt;
                        Purchase_Qty_B += dt.Purchase_Qty_B;
                        Purchase_Amt_B += dt.Purchase_Amt_B;
                        PurchaseReturn_Qty += dt.PurchaseReturn_Qty;
                        PurchaseReturn_Amt += dt.PurchaseReturn_Amt;
                        StockJournal_In_Qty += dt.StockJournal_In_Qty;
                        StockJournal_In_Amt += dt.StockJournal_In_Amt;
                        Receipt_Qty += dt.Receipt_Qty;
                        Receipt_Amt += dt.Receipt_Amt;
                        Journal_Out_Qty += dt.Journal_Out_Qty;
                        Journal_Out_Amt += dt.Journal_Out_Amt;
                        DeliveryNote_Qty += dt.DeliveryNote_Qty;
                        DeliveryNote_Amt += dt.DeliveryNote_Amt;
                        Sales_Qty += dt.Sales_Qty;
                        Sales_Amt += dt.Sales_Amt;
                        Sales_Qty_B += dt.Sales_Qty_B;
                        Sales_Amt_B += dt.Sales_Amt_B;
                        SalesReturn_Qty += dt.SalesReturn_Qty;
                        SalesReturn_Amt += dt.SalesReturn_Amt;
                        Consumption_Qty += dt.Consumption_Qty;
                        Consumption_Amt += dt.Consumption_Amt;
                        StockJournal_Out_Qty += dt.StockJournal_Out_Qty;
                        StockJournal_Out_Amt += dt.StockJournal_Out_Amt;
                    });
                     
                    $scope.dataForBottomGrid[0].O_Qty = O_Qty;
                    $scope.dataForBottomGrid[0].O_Amt = O_Amt;
                    $scope.dataForBottomGrid[0].In_Qty = In_Qty;
                    $scope.dataForBottomGrid[0].In_Amt = In_Amt;
                    $scope.dataForBottomGrid[0].Out_Qty = Out_Qty;
                    $scope.dataForBottomGrid[0].Out_Amt = Out_Amt;
                    $scope.dataForBottomGrid[0].SalesMargin = SalesMargin;
                    $scope.dataForBottomGrid[0].SalesCostAmt = SalesCostAmt;
                    $scope.dataForBottomGrid[0].B_Qty = B_Qty;
                    $scope.dataForBottomGrid[0].B_Amt = B_Amt;
                    $scope.dataForBottomGrid[0].PurchaseCostAmt = PurchaseCostAmt;
                    $scope.dataForBottomGrid[0].Payment_Qty = Payment_Qty;
                    $scope.dataForBottomGrid[0].Payment_Amt = Payment_Amt;
                    $scope.dataForBottomGrid[0].Journal_In_Qty = Journal_In_Qty;
                    $scope.dataForBottomGrid[0].Journal_In_Amt = Journal_In_Amt;
                    $scope.dataForBottomGrid[0].GRN_Qty = GRN_Qty;
                    $scope.dataForBottomGrid[0].GRN_Amt = GRN_Amt;
                    $scope.dataForBottomGrid[0].Purchase_Qty = Purchase_Qty;
                    $scope.dataForBottomGrid[0].Purchase_Amt = Purchase_Amt;
                    $scope.dataForBottomGrid[0].Purchase_Qty_B = Purchase_Qty_B;
                    $scope.dataForBottomGrid[0].Purchase_Amt_B = Purchase_Amt_B;
                    $scope.dataForBottomGrid[0].PurchaseReturn_Qty = PurchaseReturn_Qty;
                    $scope.dataForBottomGrid[0].PurchaseReturn_Amt = PurchaseReturn_Amt;
                    $scope.dataForBottomGrid[0].StockJournal_In_Qty = StockJournal_In_Qty;
                    $scope.dataForBottomGrid[0].StockJournal_In_Amt = StockJournal_In_Amt;
                    $scope.dataForBottomGrid[0].Receipt_Qty = Receipt_Qty;
                    $scope.dataForBottomGrid[0].Receipt_Amt = Receipt_Amt;
                    $scope.dataForBottomGrid[0].Journal_Out_Qty = Journal_Out_Qty;
                    $scope.dataForBottomGrid[0].Journal_Out_Amt = Journal_Out_Amt;
                    $scope.dataForBottomGrid[0].DeliveryNote_Qty = DeliveryNote_Qty;
                    $scope.dataForBottomGrid[0].DeliveryNote_Amt = DeliveryNote_Amt;
                    $scope.dataForBottomGrid[0].Sales_Qty = Sales_Qty;
                    $scope.dataForBottomGrid[0].Sales_Amt = Sales_Amt;
                    $scope.dataForBottomGrid[0].Sales_Qty_B = Sales_Qty_B;
                    $scope.dataForBottomGrid[0].Sales_Amt_B = Sales_Amt_B;
                    $scope.dataForBottomGrid[0].SalesReturn_Qty = SalesReturn_Qty;
                    $scope.dataForBottomGrid[0].SalesReturn_Amt = SalesReturn_Amt;
                    $scope.dataForBottomGrid[0].Consumption_Qty = Consumption_Qty;
                    $scope.dataForBottomGrid[0].Consumption_Amt = Consumption_Amt;
                    $scope.dataForBottomGrid[0].StockJournal_Out_Qty = StockJournal_Out_Qty;
                    $scope.dataForBottomGrid[0].StockJournal_Out_Amt = StockJournal_Out_Amt;


                    $scope.gridOptionsBottom.api.setRowData($scope.dataForBottomGrid);
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
                                                        Period: $scope.ProductGroupSummary.DateFromDet.dateBS + " TO " + $scope.ProductGroupSummary.DateToDet.dateBS,
                                                        ProductGroup: '',
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
                                    Period: $scope.ProductGroupSummary.DateFromDet.dateBS + " TO " + $scope.ProductGroupSummary.DateToDet.dateBS,
                                    ProductGroup: '',
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
            var rowData = node.data;
            if (rowData.RowType == 1) {

                if (rowData.ItemDetailColl && rowData.ItemDetailColl.length > 0 && node.expanded == true)
                {
                    var count = 0;
                    rowData.ItemDetailColl.forEach(function (itemDet)
                    {
                        itemDet.Name = rowData.Name;
                        itemDet.Alias = rowData.Alias;
                        itemDet.Code = rowData.Code;
                        itemDet.Group = rowData.Group;
                        itemDet.Categories = rowData.Categories;
                        itemDet.ProductType = rowData.ProductType;
                        itemDet.Brand = rowData.Brand;
                        itemDet.Unit = rowData.Unit;

                        if (count == 0) {
                            itemDet.O_Qty = rowData.O_Qty;
                            itemDet.O_Amt = rowData.O_Amt;

                            itemDet.InQty = rowData.In_Qty;
                            itemDet.OutQty = rowData.Out_Qty;
                            itemDet.BalQty = rowData.B_Qty;

                        }

                        itemDet.SaleRate = rowData.SaleRate;
                        itemDet.TradeRate = rowData.TradeRate;
                        itemDet.MRPRate = rowData.MRPRate;

                        itemDet.HSCode = rowData.HSCode;
                        itemDet.PartNo = rowData.PartNo;
                        itemDet.PartRemarks = rowData.PartRemarks;
                        itemDet.PartDescription = rowData.PartDescription;
                        itemDet.Color = rowData.Color;
                        itemDet.RackName = rowData.RackName;
                        itemDet.RackDescription = rowData.RackDescription;

                        filterData.push(itemDet);

                        count++;
                    });
                    
                }
                else
                {
                    rowData.InQty = rowData.In_Qty;
                    rowData.OutQty = rowData.Out_Qty;
                    rowData.BalQty = rowData.B_Qty;
                    filterData.push(rowData);
                }                
            }            
        });

        return filterData;

    };
     
    $scope.DownloadAsXls = function () {

        $scope.loadingstatus = 'running';
        showPleaseWait();

        var dataColl = $scope.GetDataForPrint();

        var paraData = {
            Period: $scope.ProductGroupSummary.DateFromDet.dateBS + " TO " + $scope.ProductGroupSummary.DateToDet.dateBS,
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
                down_file(base_url + "//" + res.data.Data.ResponseId, "StockSummary.xlsx");
            }

        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            Swal.fire(errormessage);
        });
    }

    $scope.SelectedProduct = {};
    $scope.ShowFixedProductDetails = function (rowData) {
        $scope.SelectedProduct = rowData;


        var dateFrom = new Date(($filter('date')(new Date(), 'yyyy-MM-dd')));
        var dateTo = new Date(($filter('date')(new Date(), 'yyyy-MM-dd')));

        if ($scope.ProductGroupSummary.DateFromDet)
            dateFrom = new Date(($filter('date')($scope.ProductGroupSummary.DateFromDet.dateAD, 'yyyy-MM-dd')));

        if ($scope.ProductGroupSummary.DateToDet)
            dateTo = new Date(($filter('date')($scope.ProductGroupSummary.DateToDet.dateAD, 'yyyy-MM-dd')));

        var godownId = 0;
        var godownIdColl = '';
        if ($scope.ProductGroupSummary.GodownId && $scope.ProductGroupSummary.GodownId.length > 0) {
            if ($scope.ProductGroupSummary.GodownId.length == 1)
                godownId = $scope.ProductGroupSummary.GodownId[0];
            else
                godownIdColl = $scope.ProductGroupSummary.GodownId.toString();
        } else if ($scope.ProductGroupSummary.ForBranchId > 0) {
            angular.forEach($scope.AllGodownColl, function (g) {
                if (g.BDId == $scope.ProductGroupSummary.ForBranchId) {

                    if (godownIdColl.length > 0)
                        godownIdColl = godownIdColl + ",";

                    godownIdColl = godownIdColl + g.GodownId.toString();
                }
            });
        }

        var beData = {
            ProductId: rowData.ProductId,
            dateFrom: dateFrom,
            dateTo: dateTo,            
            GodownId: ($scope.GodownColl.length == 1 ? $scope.GodownColl[0].GodownId : godownId),
            GodownIdColl: godownIdColl,      
        };

        $scope.loadingstatus = 'running';
        showPleaseWait();

        $http({
            method: "POST",
            url: base_url + "Inventory/Reporting/GetGodownWiseFixedProductDetails",
            data: JSON.stringify(beData),
            dataType: "json"
        }).then(function (res) {

            $scope.loadingstatus = 'stop';
            hidePleaseWait();

            if (res.data.IsSuccess && res.data.Data) {
                 
                rowData.FixedProductColl = [];
                res.data.Data.forEach(function (dd) {
                    rowData.FixedProductColl.push({
                        RegdNo: dd.RegdNo,
                        EngineNo: dd.EngineNo,
                        ChassisNo: dd.ChassisNo,
                        Model: dd.Model,
                        In_Qty: dd.InQty,
                        Out_Qty: dd.OutQty,
                        BalanceQty: dd.BalQty,

                    });
                });

                var dt = {
                    OpeningQty: 0,
                    OpeningAmt: 0,
                    InQty: 0,
                    InAmt: 0,
                    OutQty: 0,
                    OutAmt: 0,
                    BalQty: 0,
                    BalAmt: 0,
                };

                res.data.Data.forEach(function (fData){
                    dt.OpeningQty += fData.OpeningQty;
                    dt.OpeningAmt += fData.OpeningAmt;
                    dt.InQty += fData.InQty;
                    dt.InAmt += fData.InAmt;
                    dt.OutQty += fData.OutQty;
                    dt.OutAmt += fData.OutAmt;
                    dt.BalQty += fData.BalQty;
                    dt.BalAmt += fData.BalAmt;
                });
                var filerDataColl = [];
                filerDataColl.push(dt);
                $scope.gridOptionsBottomFP.api.setRowData(filerDataColl);

                $scope.gridOptionsFP.api.setRowData(res.data.Data);

                $('#frmFixedProduct').modal('show');
            } else
                alert(res.data.ResponseMSG);

        }, function (reason) {
            $scope.loadingstatus = "stop";
            alert('Failed' + reason);
        });

        //Swal.fire(rowData.Name);
    }
     
    function GetCustomRptColumns()
    {
        $scope.CustomRptColumn = {
            Qry: '',
            ColumnList: '',
            MapColl: [],
        };

        GlobalServices.getCustomRptColumns(EntityId).then(function (res)
        {
            if (res.data.IsSuccess && res.data.Data)
            {
                $scope.CustomRptColumn = res.data.Data;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

    }
    $scope.RefTableRows = [];
    $scope.SourceColColl = [];
    $scope.ShowCustomColumns = function ()
    {
        if (!$scope.RefTableRows || $scope.RefTableRows.length == 0)
        {
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
                    text:v,
                });
            }
        }

        if ($scope.SourceColColl.length > 0)
        {
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

            if (hasValue == true)
            {
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
                formData.append("qry", $scope.CustomRptColumn.Qry );
                return formData;
            },
            data: { jsonData: tmpDataColl  }
        }).then(function (res) {

            $scope.loadingstatus = "stop";
            hidePleaseWait();
            if (res.data.IsSuccess == true) {

                if (res.data.Data && res.data.Data.length>0) {
                    var fstRow = res.data.Data[0];
                    for (var fr in fstRow) {

                        if (fr != 'RptSNo') {
                            if ($scope.CustomRptColumn.ColumnList.length > 0)
                                $scope.CustomRptColumn.ColumnList = $scope.CustomRptColumn.ColumnList + ',';

                            $scope.CustomRptColumn.ColumnList = $scope.CustomRptColumn.ColumnList + fr;
                        }                        
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
            else if (res.data.IsSuccess != undefined)
            {
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
                            var rval = rptRow[r.SourceColName];
                            if (r.RefColName.startsWith('N_') == true || r.RefColName.startsWith('A_') == true)
                            {
                                var isNum = isNumeric(rval);
                                if (rval == null || rval == undefined || isNum==false)
                                    newRow[r.RefColName] = null;
                                else if (rval.toString().length == 0)
                                    newRow[r.RefColName] = null;
                                else
                                    newRow[r.RefColName] = rval;
                            }
                            else
                                newRow[r.RefColName] = rval;

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

        if ($scope.CustomRptColumn.Qry && $scope.CustomRptColumn.Qry.length > 0)
        {
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

                        var O_Qty = 0, O_Amt = 0, In_Qty = 0, In_Amt = 0, Out_Qty = 0, Out_Amt = 0,
                            SalesMargin = 0, B_Qty = 0, B_Amt = 0, PurchaseCostAmt = 0, Payment_Qty = 0, Payment_Amt = 0, Journal_In_Qty = 0, Journal_In_Amt = 0, GRN_Qty = 0, GRN_Amt = 0,
                            Purchase_Qty = 0, Purchase_Amt = 0, PurchaseReturn_Qty = 0, PurchaseReturn_Amt = 0, StockJournal_In_Qty = 0, StockJournal_In_Amt = 0, Receipt_Qty = 0, Receipt_Amt = 0, Journal_Out_Qty = 0,
                            Journal_Out_Amt = 0, DeliveryNote_Qty = 0, DeliveryNote_Amt = 0, Sales_Qty = 0, Sales_Amt = 0, SalesReturn_Qty = 0, SalesReturn_Amt = 0, Consumption_Qty = 0, Consumption_Amt = 0,
                            StockJournal_Out_Qty = 0, StockJournal_Out_Amt = 0;

                        $scope.RptDataColl.forEach(function (dt) {
                            O_Qty += dt.O_Qty;
                            O_Amt += dt.O_Amt;
                            In_Qty += dt.In_Qty;
                            In_Amt += dt.In_Amt;
                            Out_Qty += dt.Out_Qty;
                            Out_Amt += dt.Out_Amt;
                            SalesMargin += dt.SalesMargin;
                            B_Qty += dt.B_Qty;
                            B_Amt += dt.B_Amt;
                            PurchaseCostAmt += dt.PurchaseCostAmt;
                            Payment_Qty += dt.Payment_Qty;
                            Payment_Amt += dt.Payment_Amt;
                            Journal_In_Qty += dt.Journal_In_Qty;
                            Journal_In_Amt += dt.Journal_In_Amt;
                            GRN_Qty += dt.GRN_Qty;
                            GRN_Amt += dt.GRN_Amt;
                            Purchase_Qty += dt.Purchase_Qty;
                            Purchase_Amt += dt.Purchase_Amt;
                            PurchaseReturn_Qty += dt.PurchaseReturn_Qty;
                            PurchaseReturn_Amt += dt.PurchaseReturn_Amt;
                            StockJournal_In_Qty += dt.StockJournal_In_Qty;
                            StockJournal_In_Amt += dt.StockJournal_In_Amt;
                            Receipt_Qty += dt.Receipt_Qty;
                            Receipt_Amt += dt.Receipt_Amt;
                            Journal_Out_Qty += dt.Journal_Out_Qty;
                            Journal_Out_Amt += dt.Journal_Out_Amt;
                            DeliveryNote_Qty += dt.DeliveryNote_Qty;
                            DeliveryNote_Amt += dt.DeliveryNote_Amt;
                            Sales_Qty += dt.Sales_Qty;
                            Sales_Amt += dt.Sales_Amt;
                            SalesReturn_Qty += dt.SalesReturn_Qty;
                            SalesReturn_Amt += dt.SalesReturn_Amt;
                            Consumption_Qty += dt.Consumption_Qty;
                            Consumption_Amt += dt.Consumption_Amt;
                            StockJournal_Out_Qty += dt.StockJournal_Out_Qty;
                            StockJournal_Out_Amt += dt.StockJournal_Out_Amt;
                        });

                        $scope.dataForBottomGrid[0].O_Qty = O_Qty;
                        $scope.dataForBottomGrid[0].O_Amt = O_Amt;
                        $scope.dataForBottomGrid[0].In_Qty = In_Qty;
                        $scope.dataForBottomGrid[0].In_Amt = In_Amt;
                        $scope.dataForBottomGrid[0].Out_Qty = Out_Qty;
                        $scope.dataForBottomGrid[0].Out_Amt = Out_Amt;
                        $scope.dataForBottomGrid[0].SalesMargin = SalesMargin;
                        $scope.dataForBottomGrid[0].B_Qty = B_Qty;
                        $scope.dataForBottomGrid[0].B_Amt = B_Amt;
                        $scope.dataForBottomGrid[0].PurchaseCostAmt = PurchaseCostAmt;
                        $scope.dataForBottomGrid[0].Payment_Qty = Payment_Qty;
                        $scope.dataForBottomGrid[0].Payment_Amt = Payment_Amt;
                        $scope.dataForBottomGrid[0].Journal_In_Qty = Journal_In_Qty;
                        $scope.dataForBottomGrid[0].Journal_In_Amt = Journal_In_Amt;
                        $scope.dataForBottomGrid[0].GRN_Qty = GRN_Qty;
                        $scope.dataForBottomGrid[0].GRN_Amt = GRN_Amt;
                        $scope.dataForBottomGrid[0].Purchase_Qty = Purchase_Qty;
                        $scope.dataForBottomGrid[0].Purchase_Amt = Purchase_Amt;
                        $scope.dataForBottomGrid[0].PurchaseReturn_Qty = PurchaseReturn_Qty;
                        $scope.dataForBottomGrid[0].PurchaseReturn_Amt = PurchaseReturn_Amt;
                        $scope.dataForBottomGrid[0].StockJournal_In_Qty = StockJournal_In_Qty;
                        $scope.dataForBottomGrid[0].StockJournal_In_Amt = StockJournal_In_Amt;
                        $scope.dataForBottomGrid[0].Receipt_Qty = Receipt_Qty;
                        $scope.dataForBottomGrid[0].Receipt_Amt = Receipt_Amt;
                        $scope.dataForBottomGrid[0].Journal_Out_Qty = Journal_Out_Qty;
                        $scope.dataForBottomGrid[0].Journal_Out_Amt = Journal_Out_Amt;
                        $scope.dataForBottomGrid[0].DeliveryNote_Qty = DeliveryNote_Qty;
                        $scope.dataForBottomGrid[0].DeliveryNote_Amt = DeliveryNote_Amt;
                        $scope.dataForBottomGrid[0].Sales_Qty = Sales_Qty;
                        $scope.dataForBottomGrid[0].Sales_Amt = Sales_Amt;
                        $scope.dataForBottomGrid[0].SalesReturn_Qty = SalesReturn_Qty;
                        $scope.dataForBottomGrid[0].SalesReturn_Amt = SalesReturn_Amt;
                        $scope.dataForBottomGrid[0].Consumption_Qty = Consumption_Qty;
                        $scope.dataForBottomGrid[0].Consumption_Amt = Consumption_Amt;
                        $scope.dataForBottomGrid[0].StockJournal_Out_Qty = StockJournal_Out_Qty;
                        $scope.dataForBottomGrid[0].StockJournal_Out_Amt = StockJournal_Out_Amt;


                        $scope.gridOptionsBottom.api.setRowData($scope.dataForBottomGrid);
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

            var O_Qty = 0, O_Amt = 0, In_Qty = 0, In_Amt = 0, Out_Qty = 0, Out_Amt = 0,
                SalesMargin = 0, B_Qty = 0, B_Amt = 0, PurchaseCostAmt = 0, Payment_Qty = 0, Payment_Amt = 0, Journal_In_Qty = 0, Journal_In_Amt = 0, GRN_Qty = 0, GRN_Amt = 0,
                Purchase_Qty = 0, Purchase_Amt = 0, PurchaseReturn_Qty = 0, PurchaseReturn_Amt = 0, StockJournal_In_Qty = 0, StockJournal_In_Amt = 0, Receipt_Qty = 0, Receipt_Amt = 0, Journal_Out_Qty = 0,
                Journal_Out_Amt = 0, DeliveryNote_Qty = 0, DeliveryNote_Amt = 0, Sales_Qty = 0, Sales_Amt = 0, SalesReturn_Qty = 0, SalesReturn_Amt = 0, Consumption_Qty = 0, Consumption_Amt = 0,
                StockJournal_Out_Qty = 0, StockJournal_Out_Amt = 0;

            $scope.RptDataColl.forEach(function (dt) {
                O_Qty += dt.O_Qty;
                O_Amt += dt.O_Amt;
                In_Qty += dt.In_Qty;
                In_Amt += dt.In_Amt;
                Out_Qty += dt.Out_Qty;
                Out_Amt += dt.Out_Amt;
                SalesMargin += dt.SalesMargin;
                B_Qty += dt.B_Qty;
                B_Amt += dt.B_Amt;
                PurchaseCostAmt += dt.PurchaseCostAmt;
                Payment_Qty += dt.Payment_Qty;
                Payment_Amt += dt.Payment_Amt;
                Journal_In_Qty += dt.Journal_In_Qty;
                Journal_In_Amt += dt.Journal_In_Amt;
                GRN_Qty += dt.GRN_Qty;
                GRN_Amt += dt.GRN_Amt;
                Purchase_Qty += dt.Purchase_Qty;
                Purchase_Amt += dt.Purchase_Amt;
                PurchaseReturn_Qty += dt.PurchaseReturn_Qty;
                PurchaseReturn_Amt += dt.PurchaseReturn_Amt;
                StockJournal_In_Qty += dt.StockJournal_In_Qty;
                StockJournal_In_Amt += dt.StockJournal_In_Amt;
                Receipt_Qty += dt.Receipt_Qty;
                Receipt_Amt += dt.Receipt_Amt;
                Journal_Out_Qty += dt.Journal_Out_Qty;
                Journal_Out_Amt += dt.Journal_Out_Amt;
                DeliveryNote_Qty += dt.DeliveryNote_Qty;
                DeliveryNote_Amt += dt.DeliveryNote_Amt;
                Sales_Qty += dt.Sales_Qty;
                Sales_Amt += dt.Sales_Amt;
                SalesReturn_Qty += dt.SalesReturn_Qty;
                SalesReturn_Amt += dt.SalesReturn_Amt;
                Consumption_Qty += dt.Consumption_Qty;
                Consumption_Amt += dt.Consumption_Amt;
                StockJournal_Out_Qty += dt.StockJournal_Out_Qty;
                StockJournal_Out_Amt += dt.StockJournal_Out_Amt;
            });

            $scope.dataForBottomGrid[0].O_Qty = O_Qty;
            $scope.dataForBottomGrid[0].O_Amt = O_Amt;
            $scope.dataForBottomGrid[0].In_Qty = In_Qty;
            $scope.dataForBottomGrid[0].In_Amt = In_Amt;
            $scope.dataForBottomGrid[0].Out_Qty = Out_Qty;
            $scope.dataForBottomGrid[0].Out_Amt = Out_Amt;
            $scope.dataForBottomGrid[0].SalesMargin = SalesMargin;
            $scope.dataForBottomGrid[0].B_Qty = B_Qty;
            $scope.dataForBottomGrid[0].B_Amt = B_Amt;
            $scope.dataForBottomGrid[0].PurchaseCostAmt = PurchaseCostAmt;
            $scope.dataForBottomGrid[0].Payment_Qty = Payment_Qty;
            $scope.dataForBottomGrid[0].Payment_Amt = Payment_Amt;
            $scope.dataForBottomGrid[0].Journal_In_Qty = Journal_In_Qty;
            $scope.dataForBottomGrid[0].Journal_In_Amt = Journal_In_Amt;
            $scope.dataForBottomGrid[0].GRN_Qty = GRN_Qty;
            $scope.dataForBottomGrid[0].GRN_Amt = GRN_Amt;
            $scope.dataForBottomGrid[0].Purchase_Qty = Purchase_Qty;
            $scope.dataForBottomGrid[0].Purchase_Amt = Purchase_Amt;
            $scope.dataForBottomGrid[0].PurchaseReturn_Qty = PurchaseReturn_Qty;
            $scope.dataForBottomGrid[0].PurchaseReturn_Amt = PurchaseReturn_Amt;
            $scope.dataForBottomGrid[0].StockJournal_In_Qty = StockJournal_In_Qty;
            $scope.dataForBottomGrid[0].StockJournal_In_Amt = StockJournal_In_Amt;
            $scope.dataForBottomGrid[0].Receipt_Qty = Receipt_Qty;
            $scope.dataForBottomGrid[0].Receipt_Amt = Receipt_Amt;
            $scope.dataForBottomGrid[0].Journal_Out_Qty = Journal_Out_Qty;
            $scope.dataForBottomGrid[0].Journal_Out_Amt = Journal_Out_Amt;
            $scope.dataForBottomGrid[0].DeliveryNote_Qty = DeliveryNote_Qty;
            $scope.dataForBottomGrid[0].DeliveryNote_Amt = DeliveryNote_Amt;
            $scope.dataForBottomGrid[0].Sales_Qty = Sales_Qty;
            $scope.dataForBottomGrid[0].Sales_Amt = Sales_Amt;
            $scope.dataForBottomGrid[0].SalesReturn_Qty = SalesReturn_Qty;
            $scope.dataForBottomGrid[0].SalesReturn_Amt = SalesReturn_Amt;
            $scope.dataForBottomGrid[0].Consumption_Qty = Consumption_Qty;
            $scope.dataForBottomGrid[0].Consumption_Amt = Consumption_Amt;
            $scope.dataForBottomGrid[0].StockJournal_Out_Qty = StockJournal_Out_Qty;
            $scope.dataForBottomGrid[0].StockJournal_Out_Amt = StockJournal_Out_Amt;


            $scope.gridOptionsBottom.api.setRowData($scope.dataForBottomGrid);
            $scope.gridOptions.api.setRowData($scope.RptDataColl);


        }
    
    }
	
    $scope.saveRptListState = function ()
    {
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

    $scope.SelectProduct = function (curRow) {
        if (curRow.IsSelected == true) {
            var find = $scope.ProductGroupSummary.SelectedProductIdColl.indexOf(curRow.ProductId);
            if (find == -1) {
                $scope.ProductGroupSummary.SelectedProductIdColl.push(curRow.ProductId);
            }
        }
        else {
            var find = $scope.ProductGroupSummary.SelectedProductIdColl.indexOf(curRow.ProductId);
            if (find != -1)
                $scope.ProductGroupSummary.SelectedProductIdColl.splice(find, 1); //
        }
    }
    $scope.SelectAllProduct= function (isSelected) {
        if (isSelected == false) {
            $scope.ProductGroupSummary.SelectedProductIdColl = [];

            $scope.SearchDataColl.forEach(function (curRow) {
                curRow.IsSelected = false;
            });

        } else {
            $scope.SearchDataColl.forEach(function (curRow) {
                curRow.IsSelected = true;
                var find = $scope.ProductGroupSummary.SelectedProductIdColl.indexOf(curRow.ProductId);
                if (find == -1) {
                    $scope.ProductGroupSummary.SelectedProductIdColl.push(curRow.ProductId);
                }
            });
        }
    }
    $scope.IsSelectedProduct = function (curRow) {
        var find = $scope.ProductGroupSummary.SelectedProductIdColl.indexOf(curRow.ProductId);
        if (find == -1) {
            return false;
        }
        else
            return true;
    }
    $scope.SearchProductDataColl = [];
    $scope.SearchProductData = function () {

        $scope.loadingstatus = 'running';
        showPleaseWait();
        $scope.paginationOptions.TotalRows = 0;

        var sCol = $scope.paginationOptions.SearchColDet;

        var para = {
            filter: {
                DateFrom: null,
                DateTo: null,
                PageNumber: $scope.paginationOptions.pageNumber,
                RowsOfPage: $scope.paginationOptions.pageSize,
                SearchCol: (sCol ? sCol.value : ''),
                SearchVal: $scope.paginationOptions.SearchVal,
                SearchType: (sCol ? sCol.searchType : 'text')
            }
        };

        $http({
            method: 'POST',
            url: base_url + "Inventory/Creation/GetProductLst",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            $scope.loadingstatus = 'stop';
            hidePleaseWait();

            if (res.data.IsSuccess && res.data.Data) {
                $scope.SearchDataColl = res.data.Data;
                $scope.paginationOptions.TotalRows = res.data.TotalCount;

                $scope.SearchDataColl.forEach(function (sd) {
                    sd.IsSelected = $scope.IsSelectedProduct(sd);
                });

                $('#searVoucherRightBtn').modal('show');

            } else
                alert(res.data.ResponseMSG);

        }, function (reason) {
            alert('Failed' + reason);
        });


    };

    $scope.ReSearchProductData = function (pageInd) {

        $timeout(function () {
            if (pageInd && pageInd >= 0)
                $scope.paginationOptions.pageNumber = pageInd;
            else if (pageInd == -1)
                $scope.paginationOptions.pageNumber = 1;

            $scope.loadingstatus = 'running';
            showPleaseWait();
            $scope.paginationOptions.TotalRows = 0;
            var sCol = $scope.paginationOptions.SearchColDet;

            var para = {
                filter: {
                    DateFrom: null,
                    DateTo: null,
                    PageNumber: $scope.paginationOptions.pageNumber,
                    RowsOfPage: $scope.paginationOptions.pageSize,
                    SearchCol: (sCol ? sCol.value : ''),
                    SearchVal: $scope.paginationOptions.SearchVal,
                    SearchType: (sCol ? sCol.searchType : 'text')
                }
            };

            $http({
                method: 'POST',
                url: base_url + "Inventory/Creation/GetProductLst",
                dataType: "json",
                data: JSON.stringify(para)
            }).then(function (res) {
                $scope.loadingstatus = 'stop';
                hidePleaseWait();

                if (res.data.IsSuccess && res.data.Data) {
                    $scope.SearchDataColl = res.data.Data;
                    $scope.SearchDataColl.forEach(function (sd) {
                        sd.IsSelected = $scope.IsSelectedProduct(sd);
                    });

                    $scope.paginationOptions.TotalRows = res.data.TotalCount;

                } else
                    alert(res.data.ResponseMSG);

            }, function (reason) {
                alert('Failed' + reason);
            });
        });
    }


});
