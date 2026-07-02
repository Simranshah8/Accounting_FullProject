"use strict";

//const { data } = require("jquery");

agGrid.initialiseAgGridWithAngular1(angular);

app.controller("PurchaseCostingVoucherWise", function ($scope, $http, $filter, $timeout, GlobalServices, $compile) {
   var PrintPreviewAs = 1;
    const contextMenu = GlobalServices.createElementForMenu();

    $scope.onBtExportCSV = function () {
        var params = {
            fileName: 'PurchaseCostingVoucherWise.csv',
            sheetName: 'PurchaseCostingVoucherWise'
        };

        $scope.gridOptions.api.exportDataAsCsv(params);
    }

    $scope.LoadData=function()
    {
        $('.select2').select2({
            allowClear: true,
            openOnEnter: true
        });
        $scope.ReportTypeColl = [{ text: 'PendingOnly', value: 'PendingOnly', dataType: 'text' }, { text: 'ClearOnly', value: 'ClearOnly', dataType: 'text' }, { text: 'Both', value: 'Both', dataType: 'text' },]

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


        $scope.PurchaseCostingVoucherWise = {
            DateFrom_TMP: new Date(),
            DateTo_TMP: new Date(),
            VoucherId: 0,
            IsPost: true,
            BranchId: 0,
            LedgerWise: false,
            ColumnarView:true,
        };
       
        $scope.loadingstatus = "stop";

        $scope.preColumnDefs = [
            {
                headerName: "Date", width: 130, pinned: 'left', dataType: 'DateTime', field: "VoucherDate", cellRenderer: 'agGroupCellRenderer',
                valueFormatter: function (params) { return DateFormatAD(params.value); },
                showRowGroup: true, cellStyle: { 'text-align': 'center' },
                cellRendererParams: {
                    suppressCount: false, // turn off the row count                   
                }
            },
            {
                headerName: "Miti", width: 130, pinned: 'left', dataType: 'DateTime',  field: "VoucherDateBS", cellRenderer: 'agGroupCellRenderer',
                valueFormatter: function (params) { return DateFormatBS(params.value); },
                showRowGroup: true, cellStyle: { 'text-align': 'center' },
                cellRendererParams: {
                    suppressCount: false, // turn off the row count                   
                }
            },
            { headerName: "RefNo", width: 150, pinned: 'left', field: "RefNo", dataType: 'Number', cellStyle: { 'text-align': 'center' } },

            { headerName: "VoucherNo", width: 180, field: "VoucherNo", dataType: 'Number', cellStyle: { 'text-align': 'center' } },
            { headerName: "PartyName", width: 250, field: "PartyName", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "Party Code", width: 250, field: "PartyCode", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "Address", width: 180, field: "Address", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "InvoiceAmt", width: 180, field: "InvoiceAmt", dataType: 'Number', cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },
            { headerName: "Product", width: 180, field: "ProductName", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "Code", width: 100, field: "Code", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "Group", width: 180, field: "ProductGroup", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "Qty", width: 140, field: "Qty", dataType: 'Number', cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); },  },
            { headerName: "Rate", width: 150, field: "Rate", dataType: 'Number', cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },
            { headerName: "Amount", width: 180, field: "Amount", dataType: 'Number', cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); },  },
            { headerName: "Sub Ledger", width: 180, field: "CostLedger", dataType: 'Number', cellStyle: { 'text-align': 'left' } },
            { headerName: "AdditionalCost", width: 180, field: "CostAmt", dataType: 'Number', cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },
            
            { headerName: "Total", width: 180, field: "TotalAmount", dataType: 'Number', cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },
            { headerName: "Cost Rate", width: 180, field: "CostRate", dataType: 'Number', cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },
             

        ];

        $scope.postColumnDefs = [{ headerName: "ProductGroup", width: 180, dataType: 'Text', field: "ProductGroup", cellStyle: { 'text-align': 'left' } },
        { headerName: "PartyGroup", width: 180, field: "PartyGroup", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
        { headerName: "Narration", width: 180, field: "Narration", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
        { headerName: "JournalVoucherNo", width: 180, field: "JVVoucherNo", dataType: 'Number', cellStyle: { 'text-align': 'right' } },
        { headerName: "CurrencyName", width: 180, field: "CurrencyName", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
        { headerName: "CurrencyRate", width: 180, field: "CurrencyRate", dataType: 'Number', cellStyle: { 'text-align': 'right' } },
        { headerName: "ProductModel", width: 150, field: "ProductModel", dataType: 'Text', cellStyle: { 'text-align': 'left' }, hide: true, },
        { headerName: "EngineNo", width: 150, field: "EngineNo", dataType: 'Text', cellStyle: { 'text-align': 'left' }, hide: true, },
        { headerName: "ChassisNo", width: 150, field: "ChassisNo", dataType: 'Text', cellStyle: { 'text-align': 'left' }, hide: true, }];

        $scope.columnDefs = [...$scope.preColumnDefs, ...$scope.postColumnDefs];

        $scope.ReGenerateGrid();
       // $scope.eGridDiv = document.querySelector('#datatable');

        // create the grid passing in the div to use together with the columns & data we want to use
       // new agGrid.Grid($scope.eGridDiv, $scope.gridOptions);

        $scope.AnalysisCollDefs = [];
        angular.forEach($scope.columnDefs, function (cln) {
            if (cln.datatype == "string" || cln.dataType == 'Text')
                $scope.AnalysisCollDefs.push({ name: cln.field, caption: cln.headerName });
            else if (cln.datatype == "int32" || cln.datatype == "int64")
                $scope.AnalysisCollDefs.push({ name: cln.field, caption: cln.headerName, aggregateFunc: 'sum', formatFunc: function (val) { return $filter('formatNumber')(val); } });
            else if (cln.datatype == "Number" || cln.datatype == "double" || cln.datatype == "float" || cln.datatype == "decimal")
                $scope.AnalysisCollDefs.push({
                    name: cln.field, caption: cln.headerName,
                    dataSettings: {
                        aggregateFunc: 'sum',
                        formatFunc: function (value) {
                            return Number(value).toFixed(0);
                        }
                    }
                });
            else if (cln.datatype == "datetime" || cln.datatype == "DateTime" || cln.datatype == "date")
                $scope.AnalysisCollDefs.push({ name: cln.field, caption: cln.headerName });
            else
                $scope.AnalysisCollDefs.push({ name: cln.field, caption: cln.headerName });
        });

        $scope.dataForBottomGrid = [
            {
                PartyName: 'Total =>',
                Qty: 0,
                Amount: 0,
                InvoiceAmt:0
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
         
    }
    $scope.ReGenerateGrid = function () {
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
                    PartyName: 'Total =>',
                    Qty: 0,
                    Amount: 0,
                    InvoiceAmt: 0,
                    TotalAmount: 0,
                    CostAmt: 0,                    
                }

                for (var cSNo = 1; cSNo <= $scope.CostColumns.length; cSNo++) {
                    var colName = 'costCol' + cSNo;
                    dt[colName] = 0;
                }
                $scope.gridOptions.api.forEachNodeAfterFilterAndSort(function (node) {
                    var fData = node.data;
                    dt.Qty += fData.Qty;
                    dt.Amount += fData.Amount;
                    dt.InvoiceAmt += fData.InvoiceAmt;
                    dt.TotalAmount += fData.TotalAmount;
                    dt.CostAmt += fData.CostAmt;
                    dt.costCol1 += isEmptyNum(fData.costCol1);
                    for (var cSNo = 1; cSNo <= $scope.CostColumns.length; cSNo++) {
                        var colName = 'costCol' + cSNo;
                        dt[colName] += isEmptyNum(fData[colName]);
                    }
                });
                var filterDataColl = [];
                filterDataColl.push(dt);
                $scope.gridOptionsBottom.api.setRowData(filterDataColl);
            }

        };
		
		 $timeout(function () {
            GlobalServices.getListState(EntityId, $scope.gridOptions);
        });
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
            dataSource: $scope.DataColl,
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
    $scope.ClearData = function () {

        //for (var c = 1; c <=30; c++) {
        //    var colName = 'costCol' + c;
        //    $scope.gridOptions.columnApi.setColumnVisible(colName, false);
        //}

        if ($scope.FixedProductConfig.ShowEngineNo==true) {
            $scope.gridOptions.columnApi.setColumnVisible('EngineNo', true);
            $scope.gridOptions.api.getColumnDef('EngineNo').headerName = $scope.FixedProductConfig.EngineNo;
            $scope.gridOptions.columnApi.getColumn('EngineNo').colDef.headerName = $scope.FixedProductConfig.EngineNo;
        } else
            $scope.gridOptions.columnApi.setColumnVisible('EngineNo', false);


        if ($scope.FixedProductConfig.ShowChassisNo == true) {
            $scope.gridOptions.columnApi.setColumnVisible('ChassisNo', true);
            $scope.gridOptions.api.getColumnDef('ChassisNo').headerName = $scope.FixedProductConfig.ChassisNo;
            $scope.gridOptions.columnApi.getColumn('ChassisNo').colDef.headerName = $scope.FixedProductConfig.ChassisNo;
        } else
            $scope.gridOptions.columnApi.setColumnVisible('ChassisNo', false);

        if ($scope.FixedProductConfig.ShowModel == true) {
            $scope.gridOptions.columnApi.setColumnVisible('ProductModel', true);
            $scope.gridOptions.api.getColumnDef('ProductModel').headerName = $scope.FixedProductConfig.Model;
            $scope.gridOptions.columnApi.getColumn('ProductModel').colDef.headerName = $scope.FixedProductConfig.Model;
        } else
            $scope.gridOptions.columnApi.setColumnVisible('ProductModel', false);



        var DataColl = [];
        $scope.gridOptionsBottom.api.setRowData(DataColl);

        $scope.gridOptions.api.setRowData(DataColl);
    };

    $scope.CostColumns = [];
    $scope.GetPurchaseCostingVoucherWise = function () {

        $scope.columnDefs = [];
        $scope.columnDefs = angular.copy($scope.preColumnDefs);
        $scope.CostColumns = [];
        $scope.ClearData();
        $scope.DataColl = [];
        var dateFrom =$filter('date')(new Date(), 'yyyy-MM-dd');
        var dateTo =$filter('date')(new Date(), 'yyyy-MM-dd');

        if ($scope.PurchaseCostingVoucherWise.DateFromDet)
            dateFrom =$filter('date')($scope.PurchaseCostingVoucherWise.DateFromDet.dateAD, 'yyyy-MM-dd');

        if ($scope.PurchaseCostingVoucherWise.DateToDet)
            dateTo = $filter('date')($scope.PurchaseCostingVoucherWise.DateToDet.dateAD, 'yyyy-MM-dd');

        $scope.loadingstatus = 'running';
        showPleaseWait();

        var beData = {
            DateFrom: dateFrom,
            DateTo: dateTo,
            ledgerWise:$scope.PurchaseCostingVoucherWise.LedgerWise,
            VoucherType: $scope.PurchaseCostingVoucherWise.VoucherId,
            isPost: $scope.PurchaseCostingVoucherWise.IsPost,
            branchId: $scope.PurchaseCostingVoucherWise.BranchId
        };

        $scope.loadingstatus = 'running';

        $http({
            method: "post",
            url: base_url + "Inventory/Reporting/GetPurchaseCostingVoucherWise",
            data: JSON.stringify(beData),
            dataType: "json"
        }).then(function (res) {

            $scope.loadingstatus = 'stop';
            hidePleaseWait();

            if (res.data.IsSuccess && res.data.Data) {
                var DataColl = mx(res.data.Data);
                $scope.DataColl = res.data.Data;
               // var query = DataColl.groupBy(p1 => p1.CostLedger);

                
                var totalInvoiceAmt = 0;
                var totalQty = 0;
                var totalAmt = 0;
                var totalCostAmt = 0;
                var totalAmtSum = 0;
                
                 
                if ($scope.PurchaseCostingVoucherWise.ColumnarView == true) {
                    var costLedQry = DataColl.groupBy(p1 => p1.CostLedger);
                    var colValPro = {};
                    var colSno = 1;
                    angular.forEach(costLedQry, function (cq) {
                        if (cq.key != null) {
                            var colName = 'costCol' + colSno;
                            var newCol = {
                                headerName: cq.key, width: 140, field: colName, dataType: 'Number', filter: "agNumberColumnFilter", colId: colName,  
                                valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' }, footerTemplate: '<div>totaal: #= sum #</div>',
                            };
                            $scope.CostColumns.push(cq.key);
                            colValPro[colName] = cq.key;
                            $scope.columnDefs.push(newCol);

                            colSno++;                        
                        }
                        
                    });

                    $scope.columnDefs = [...$scope.columnDefs, ...$scope.postColumnDefs];                    
                    $scope.gridOptions.columnDefs = $scope.columnDefs;
                    $scope.gridOptions.api.setColumnDefs($scope.columnDefs);

                    $scope.gridOptionsBottom.columnDefs = $scope.columnDefs;
                    $scope.gridOptionsBottom.api.setColumnDefs($scope.columnDefs);

                    colSno--;

                    var tmpDCColl = [];
                    var groupTran = DataColl.groupBy(p1 => ({ TranId: p1.TranId, AllocationId: p1.ItemAllocationId,EngineNo:p1.EngineNo }));
                    angular.forEach(groupTran, function (q)
                    {                        
                        var fst = q.elements[0];

                        if (fst.TranId == 444)
                        {
                            var a = a + 1;
                            console.log('test');
                        }
                        var cQry = mx(q.elements);
                        //var curQty = cQry.sum(p1 => p1.Qty);
                        //var curAmt = cQry.sum(p1 => p1.Amount);
                        var curQty = fst.Qty;
                        var curAmt = fst.Amount;
                        var curRate = 0;

                        if (curQty != 0 && curAmt != 0)
                            curRate = curAmt / curQty;

                        totalQty += curQty;
                        totalAmt += curAmt;

                        var voucherNo = '';
                        var jvVoucherQry = cQry.groupBy(p1 => p1.JVVoucherNo);
                        if (jvVoucherQry) {
                            angular.forEach(jvVoucherQry, function (jv) {

                                if (voucherNo.length > 0)
                                    voucherNo = voucherNo + ',';

                                voucherNo = voucherNo + jv.key;

                            });
                        }
                        var newR = {
                            TranId: fst.TranId,
                            VoucherNo: fst.VoucherNo,
                            VoucherDate: fst.VoucherDate,
                            VoucherDateBS: fst.VoucherDateBS,
                            RefNo: fst.RefNo,
                            PartyName: fst.PartyName,
                            PartyCode: fst.PartyCode,
                            Address: fst.Address,
                            Narration: fst.Narration,
                            ProductName: fst.ProductName,
                            Alias: fst.Alias,
                            Code: fst.Code,
                            ProductGroup: fst.ProductGroup,
                            Qty: curQty,
                            Rate: curRate,
                            Amount: curAmt,
                            CostAmt: cQry.sum(p1 => p1.CostAmt),
                            InvoiceAmt: fst.InvoiceAmt,
                            VoucherName: fst.VoucherName,
                            Branch: fst.Branch,
                            PartyGroup: fst.PartyGroup,
                            VoucherId: fst.VoucherId,
                            CostClassId: fst.CostClassId,
                            JVTranId: fst.JVTranId,
                            //JVVoucherNo: fst.JVVoucherNo,
                            JVVoucherNo: voucherNo,
                            CurrencyName: fst.CurrencyName,
                            CurrencyRate: fst.CurrencyRate,
                            TotalAmount: cQry.sum(p1 => p1.CostAmt)+curAmt,
                            CostRate: 0,
                            ProductModel: fst.ProductModel,
                            EngineNo: fst.EngineNo,
                            ChassisNo: fst.ChassisNo,
                            CostCenter: '',
                            ItemAllocationId: fst.ItemAllocationId,
                        };
                        newR.CostRate = (newR.Amount + newR.CostAmt)/newR.Qty;

                        
                        cQry.forEach(function (cq) {
                            if (cq.CostLedger != null) {
                                for (var col = 1; col <= colSno; col++) {
                                    var colName = 'costCol' + col;
                                    if (colValPro[colName] == cq.CostLedger) {
                                        newR[colName] = isEmptyAmt(newR[colName])+isEmptyAmt(cq.CostAmt);
                                        break;
                                    }
                                }
                            }                                             
                        });
                        totalCostAmt += newR.CostAmt;
                        totalAmtSum += newR.TotalAmount;

                        tmpDCColl.push(newR);

                    })

                    var dt = {
                        PartyName: 'Total =>',
                        Qty: 0,
                        Amount: 0,
                        InvoiceAmt: 0,
                        TotalAmount: 0,
                        CostAmt: 0,
                        costCol1: 0,                       
                    }
                    for (var cSNo = 1; cSNo <= $scope.CostColumns.length; cSNo++) {
                        var colName = 'costCol' + cSNo;
                        dt[colName] = 0;
                    }
                    
                    tmpDCColl.forEach(function (fData) {                        
                        dt.Qty += fData.Qty;
                        dt.Amount += fData.Amount;
                        dt.InvoiceAmt += fData.InvoiceAmt;
                        dt.TotalAmount += fData.TotalAmount;
                        dt.CostAmt += fData.CostAmt;                        
                        for (var cSNo = 1; cSNo <= $scope.CostColumns.length; cSNo++) {
                            var colName = 'costCol' + cSNo;
                            dt[colName] += isEmptyNum(fData[colName]);
                        }

                    });
                    var filterDataColl = [];
                    filterDataColl.push(dt);
                    $scope.gridOptionsBottom.api.setRowData(filterDataColl);

                    $scope.gridOptions.api.setRowData(tmpDCColl);
                               
                    
                } else {
                    var dt = {
                        PartyName: 'TOTAL =>',
                        Qty: DataColl.sum(p1 => p1.Qty),
                        Amount: DataColl.sum(p1 => p1.Amount),
                        InvoiceAmt: totalInvoiceAmt,
                        CostAmt: DataColl.sum(p1 => p1.CostAmt),
                        TotalAmount: DataColl.sum(p1 => p1.TotalAmount),
                    }

                    var filterDataColl = [];
                    filterDataColl.push(dt);

                    $scope.gridOptionsBottom.api.setRowData(filterDataColl);

                    $scope.gridOptions.api.setRowData(res.data.Data);
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

    $scope.UpdateCosting = function () {

        $scope.ClearData();
        var dateFrom = $filter('date')(new Date(), 'yyyy-MM-dd');
        var dateTo = $filter('date')(new Date(), 'yyyy-MM-dd');

        if ($scope.PurchaseCostingVoucherWise.DateFromDet)
            dateFrom = $filter('date')($scope.PurchaseCostingVoucherWise.DateFromDet.dateAD, 'yyyy-MM-dd');

        if ($scope.PurchaseCostingVoucherWise.DateToDet)
            dateTo = $filter('date')($scope.PurchaseCostingVoucherWise.DateToDet.dateAD, 'yyyy-MM-dd');

        $scope.loadingstatus = 'running';
        showPleaseWait();

        var beData = {
            datefrom: dateFrom,
            dateTo: dateTo,      
        };

        $scope.loadingstatus = 'running';

        $http({
            method: "post",
            url: base_url + "Inventory/Reporting/UpdateCostInProductVoucher",
            data: JSON.stringify(beData),
            dataType: "json"
        }).then(function (res) {

            $scope.loadingstatus = 'stop';
            hidePleaseWait();
            Swal.fire(res.data.ResponseMSG);
             

        }, function (reason) {
            $scope.loadingstatus = "stop";
            alert('Failed' + reason);
        });

    };

    $scope.GetDataForPrint = function () {

        var filterData = [];

        $scope.gridOptions.api.forEachNodeAfterFilterAndSort(function (node) {
            var dayBook = node.data;
            filterData.push(dayBook);
        });

        return filterData;
    }
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
                down_file(base_url + "//" + res.data.Data.ResponseId, "PurchaseCostingVoucherWise.xlsx");
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
