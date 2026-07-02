"use strict";

agGrid.initialiseAgGridWithAngular1(angular);

app.controller("OutStockBillWise", function ($scope, $http, $filter, $timeout, GlobalServices, $compile) {

  var PrintPreviewAs = 1;
    const contextMenu = GlobalServices.createElementForMenu();
	
    LoadData();

    $scope.onBtExportCSV = function () {
        var params = {
            fileName: 'OutStockBillWise.csv',
            sheetName: 'OutStockBillWise'
        };

        $scope.gridOptions.api.exportDataAsCsv(params);
    }

    function LoadData() {
        $('.select2').select2({
            allowClear: true,
            openOnEnter: true
        });
        //agGrid.initialiseAgGridWithAngular1(angular);
        $scope.VoucherTypeList = [];
        $http({
            method: 'GET',
            url: base_url + "Account/Reporting/GetAllVoucher",
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
        
        $scope.VoucherTypeColl = [];
        $http({
            method: 'GET',
            //url: base_url + "Account/Creation/GetVoucherTypes",
            url: base_url + "Account/Creation/GetUserWiseVoucherTypes",
            dataType: "json",
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.VoucherTypeColl = res.data.Data;
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

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


        $scope.OutStockBillWise = {            
            DateFrom_TMP: new Date(),
            DateTo_TMP: new Date(),
            branchIdColl: '',
            voucherIdColl: '',
            ProductIdColl: '',
        };
        $scope.OpeningAmt = 0;
        $scope.CurrentAmt = 0;
        $scope.TotalAmt = 0;
        $scope.ReportName = '';
        $scope.noofdecimal = 2;

        $scope.loadingstatus = "stop";

        $scope.columnDefs = [
            {
                headerName: "Date(A.D.)", pinned: 'left', width: 140, field: "VoucherDate", cellRenderer: 'agGroupCellRenderer',
                valueFormatter: function (params) { return DateFormatAD(params.value); },
                showRowGroup: true, cellStyle: { 'text-align': 'center' },
                cellRendererParams: {
                    suppressCount: false, // turn off the row count                   
                }
            },
            {
                headerName: "Miti", width: 140, pinned: 'left', field: "Miti", cellRenderer: 'agGroupCellRenderer',
                //valueFormatter: function (params) { return DateFormatBS(params.value); },
                showRowGroup: true, cellStyle: { 'text-align': 'center' },
                cellRendererParams: {
                    suppressCount: false, // turn off the row count                   
                }
            },
            { headerName: "BillNo", width: 180, pinned: 'left', field: "BillNo", dataType: 'Text', cellStyle: { 'text-align': 'center' }  },
            { headerName: "ProductName", width: 180, field: "ProductName", dataType: 'Text', cellStyle: { 'text-align': 'left' }  },
            { headerName: "Code", width: 180, field: "ProductCode", dataType: 'Text', cellStyle: { 'text-align': 'left' }  },
            { headerName: "Alias", width: 180, field: "ProductAlias", dataType: 'Text', cellStyle: { 'text-align': 'left' }  },
            { headerName: "ProductGroup", width: 180, field: "ProductGroupName", dataType: 'Text', cellStyle: { 'text-align': 'left' }  },
            { headerName: "SalesLedger", width: 180, field: "SalesLedger", dataType: 'Text', cellStyle: { 'text-align': 'left' }  },
            { headerName: "Party", width: 180, field: "Party", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "Party Code", width: 120, field: "PartyCode", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "Voucher", width: 180, field: "VoucherName", dataType: 'Text', cellStyle: { 'text-align': 'left' }  },
            { headerName: "VoucherType", width: 180, field: "VoucherType", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "Batch No.", width: 140, colId: 'clBatch', field: "Batch", cellStyle: { 'text-align': 'left' }, hide: true,   },
            { headerName: "Qty", width: 140, field: "Qty", dataType: 'Number', cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },
            { headerName: "Unit", width: 110, field: "Unit", dataType: 'Text', cellStyle: { 'text-align': 'right' } },
            { headerName: "Qty1", colId: 'Qty1', width: 140, hide: true, field: "FXQty1", dataType: 'Number', cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },
            { headerName: "Qty2", colId: 'Qty2', width: 140, hide: true, field: "FXQty2", dataType: 'Number', cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },
            { headerName: "Qty3", colId: 'Qty3', width: 140, hide: true, field: "FXQty3", dataType: 'Number', cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },
            { headerName: "Qty4", colId: 'Qty4', width: 140, hide: true, field: "FXQty4", dataType: 'Number', cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },
            { headerName: "Qty5", colId: 'Qty5', width: 140, hide: true, field: "FXQty5", dataType: 'Number', cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },
            
            { headerName: "Rate", width: 140, field: "Rate", dataType: 'Number', cellStyle: { 'text-align': 'right' }, valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "Amount", width: 140, field: "Amount", dataType: 'Number', cellStyle: { 'text-align': 'right' }, valueFormatter: function (params) { return Numberformat(params.value); } },
            
            
            { headerName: "DiscountAmt", width: 180, field: "DiscountAmt", dataType: 'Number', cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },
            { headerName: "DiscountPer", width: 180, field: "DiscountPer", dataType: 'Number', cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },
            { headerName: "T.CostCenter", width: 180, field: "TranCostCenter", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "P.CostCenter", width: 180, field: "PartyCostCenter", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "Godown", width: 180, field: "GodownName", dataType: 'Text', cellStyle: { 'text-align': 'left' }  },
            { headerName: "VehicleNo", width: 180, field: "VehicleNo", dataType: 'Text', cellStyle: { 'text-align': 'right' }  },
            { headerName: "Brand", width: 180, field: "Brand", dataType: 'Text', cellStyle: { 'text-align': 'left' }  },
            { headerName: "ProductType", width: 180, field: "ProductType", dataType: 'Text', cellStyle: { 'text-align': 'left' }  },
            { headerName: "PanVat", width: 180, field: "PanVat", dataType: 'Text', cellStyle: { 'text-align': 'left' }  },
            { headerName: "RefNo", width: 180, field: "RefNo", dataType: 'Text', cellStyle: { 'text-align': 'center' }  },
            { headerName: "RegdNo", width: 180, field: "RegdNo", dataType: 'Text', cellStyle: { 'text-align': 'center' }  },
            { headerName: "EngineNo", width: 180, field: "EngineNo", dataType: 'Text', cellStyle: { 'text-align': 'right' }  },
            { headerName: "ChassisNo", width: 180, field: "ChassisNo", dataType: 'Text', cellStyle: { 'text-align': 'right' } },
            //Added by suresh for MVDuggar
            { headerName: "Model", width: 150, field: "Model", dataType: 'Text', cellStyle: { 'text-align': 'right' } },
            { headerName: "Color", width: 130, field: "Color", dataType: 'Text', cellStyle: { 'text-align': 'right' } },
            { headerName: "MFYear", width: 180, field: "Mfyear", dataType: 'DateTime', cellStyle: { 'text-align': 'right' } },
            //Ends
            { headerName: "VinNo", width: 180, field: "VinNo", dataType: 'Text', cellStyle: { 'text-align': 'right' }  },
            { headerName: "FreightRate", width: 180, field: "FreightRate", dataType: 'Number', cellStyle: { 'text-align': 'right' }  },
            { headerName: "AdvancePayment", width: 180, field: "AdvancePayment", dataType: 'Number', cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },


            { headerName: "Buyes", width: 180, field: "Buyes", dataType: 'Text', },
            { headerName: "Credit Days", width: 150, field: "Credit Days", dataType: 'Text', cellStyle: { 'text-align': 'center' }  },
            { headerName: "B RegdNo", width: 180, field: "B_RegdNo", dataType: 'Text', },
            { headerName: "B_EngineNo", width: 180, field: "B_EngineNo", dataType: 'Text', },
            { headerName: "B_ChassisNo", width: 180, field: "B_ChassisNo", dataType: 'Text', },
            { headerName: "B_Model", width: 180, field: "B_Model", dataType: 'Text', },
            { headerName: "JobCardNo", width: 180, field: "JobCardNo", dataType: 'Text', },
            { headerName: "TermsOfPayment", width: 180, field: "TermsOfPayment", dataType: 'Text', },
            { headerName: "Salesman", width: 150, field: "Agent", dataType: 'Text', },
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
                    ProductName: 'TOTAL =>',
                    Qty: 0,
                    STDQty1: 0,
                    Amount: 0,
                    DiscountAmt: 0,
                    AdvancePayment: 0,
                    
                }
                $scope.gridOptions.api.forEachNodeAfterFilterAndSort(function (node) {
                    var fData = node.data;
                    dt.Qty += fData.Qty;
                    dt.STDQty1 += fData.STDQty1;
                    dt.Amount += fData.Amount;
                    dt.DiscountAmt += fData.DiscountAmt;
                    dt.AdvancePayment += fData.AdvancePayment;


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
                ProductName: 'Total =>',
                Amount: 0,
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
		
		 $timeout(function () {
            GlobalServices.getListState(EntityId, $scope.gridOptions);
        });
    }

    $scope.ShowBatchWise = function (val) {
         
        $scope.gridOptions.columnApi.setColumnVisible('clBatch', val);
    

         
    }

    $scope.ClearData = function () {

        var DataColl = [];
        $scope.gridOptionsBottom.api.setRowData(DataColl);
        $scope.gridOptions.api.setRowData(DataColl);
    };

    $scope.ShowAUnit = function (uval) {

        var val = false;

        if ($scope.OutStockBillWise.UnitId1 > 0 && uval==1)
            val = true;
        else if ($scope.OutStockBillWise.UnitId2 > 0 && uval == 2)
            val = true;
        else if ($scope.OutStockBillWise.UnitId3 > 0 && uval == 3)
            val = true;

        if (val == true) {
            var findUnit = null;

            if (uval == 1)
                findUnit = mx($scope.UnitColl).firstOrDefault(p1 => p1.UnitId == $scope.OutStockBillWise.UnitId1);
            else if (uval == 2)
                findUnit = mx($scope.UnitColl).firstOrDefault(p1 => p1.UnitId == $scope.OutStockBillWise.UnitId2);
            else if (uval == 3)
                findUnit = mx($scope.UnitColl).firstOrDefault(p1 => p1.UnitId == $scope.OutStockBillWise.UnitId3);
            else if (uval == 4)
                findUnit = mx($scope.UnitColl).firstOrDefault(p1 => p1.UnitId == $scope.OutStockBillWise.UnitId4);
            else if (uval == 5)
                findUnit = mx($scope.UnitColl).firstOrDefault(p1 => p1.UnitId == $scope.OutStockBillWise.UnitId5);

            if (findUnit) {
                $scope.gridOptions.columnApi.getColumn("Qty" + uval).colDef.headerName =  findUnit.Name;
            }
        }

        $scope.gridOptions.columnApi.setColumnVisible('Qty' + uval, val);
          
        if (val == true)
            $scope.GetOutStockBillWise();
    }
    $scope.GetOutStockBillWise = function () {
        $scope.ClearData();

        var dateFrom = $filter('date')(new Date(), 'yyyy-MM-dd');
        var dateTo = $filter('date')(new Date(), 'yyyy-MM-dd');

        if ($scope.OutStockBillWise.DateFromDet)
            dateFrom = $filter('date')($scope.OutStockBillWise.DateFromDet.dateAD, 'yyyy-MM-dd');

        if ($scope.OutStockBillWise.DateToDet)
            dateTo = $filter('date')($scope.OutStockBillWise.DateToDet.dateAD, 'yyyy-MM-dd');

        $scope.DataColl = []; //declare an empty array
        $scope.gridOptions.api.setRowData($scope.DataColl);

        var beData = {
          
            dateFrom: dateFrom,
            dateTo: dateTo,
            branchIdColl: ($scope.OutStockBillWise.branchIdColl ? $scope.OutStockBillWise.branchIdColl.toString() : ''),
            voucherIdColl: ($scope.OutStockBillWise.voucherIdColl ? $scope.OutStockBillWise.voucherIdColl.toString(): ''),
            ProductIdColl: ($scope.OutStockBillWise.ProductIdColl ? $scope.OutStockBillWise.ProductIdColl.toString() : ''),
            AUnitId1: $scope.OutStockBillWise.UnitId1,
            AUnitId2: $scope.OutStockBillWise.UnitId2,
            AUnitId3: $scope.OutStockBillWise.UnitId3,
            AUnitId4: $scope.OutStockBillWise.UnitId4,
            AUnitId5: $scope.OutStockBillWise.UnitId5,
            VoucherType:$scope.OutStockBillWise.VoucherType
        };

        $scope.loadingstatus = 'running';
        showPleaseWait();

        $http({
            method: "POST",
            url: base_url + "Inventory/Reporting/GetOutStockBillWise",
            data: JSON.stringify(beData),
            dataType: "json"
        }).then(function (res) {

            $scope.loadingstatus = 'stop';
            hidePleaseWait();

            if (res.data.IsSuccess && res.data.Data) {
                $scope.DataColl = res.data.Data;

                var dt = {
                    ProductName: 'TOTAL =>',
                    Qty: 0,
                    STDQty1: 0,
                    Amount: 0,
                    DiscountAmt: 0,
                    AdvancePayment: 0,
                }
                angular.forEach($scope.DataColl, function (fData) {
                    dt.Qty += fData.Qty;
                    dt.STDQty1 += fData.STDQty1;
                    dt.Amount += fData.Amount;
                    dt.DiscountAmt += fData.DiscountAmt;
                    dt.AdvancePayment += fData.AdvancePayment;
                });
                var filterDataColl = [];
                filterDataColl.push(dt);

                $scope.gridOptionsBottom.api.setRowData(filterDataColl);

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
                down_file(base_url + "//" + res.data.Data.ResponseId, "OutStockBillWise.xlsx");
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
