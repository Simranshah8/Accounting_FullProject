"use strict";

agGrid.initialiseAgGridWithAngular1(angular);

app.controller("ProductVoucher", function ($scope, $http, $filter, $timeout, GlobalServices, $compile) {

  var PrintPreviewAs = 1;
    const contextMenu = GlobalServices.createElementForMenu();
	
    LoadData();

    $scope.onBtExportCSV = function () {
        var params = {
            fileName: 'ProductVoucher.csv',
            sheetName: 'ProductVoucher'
        };

        $scope.gridOptions.api.exportDataAsCsv(params);
    }

    function LoadData() {

        $scope.LedgerSearchOptions = [{ text: 'Name', value: 'Led.Name', searchType: 'text' }, { text: 'Group', value: 'LG.Name', searchType: 'text' }, { text: 'Alias', value: 'Led.Alias', searchType: 'text' }, { text: 'Code', value: 'Led.Code', searchType: 'text' }, { text: 'PanVat', value: 'LS.PanVatNo', searchType: 'text' }, { text: 'MobileNo', value: 'Led.CompanyContactNo', searchType: 'text' }];
        $scope.paginationOptions = {
            pageNumber: 1,
            pageSize: GlobalServices.getPerPageRow(),
            sort: null,
            SearchType: 'text',
            SearchCol: '',
            SearchVal: '',
            SearchColDet: $scope.LedgerSearchOptions[0],
            pagearray: [],
            pageOptions: [5, 10, 20, 30, 40, 50]
        };


        $('.select2').select2({
            allowClear: true,
            openOnEnter: true
        });

        $scope.RefTableColColl = GlobalServices.getRptTableColColl();

        GetCustomRptColumns();
 

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

        $scope.GodownList = [];
        $http({
            method: 'GET',
            url: base_url + "Inventory/Creation/GetUserWiseGodown",
            dataType: "json",
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.GodownList = res.data.Data;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
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

        

        $scope.ProductVoucher = {            
            DateFrom_TMP: new Date(),
            DateTo_TMP: new Date(),
            ProductId: 0,
            BatchWise: false,
            IncludeAditionalCost: true,
            SelectedLedgerIdColl: [],
        };

        $scope.DateStyles = GlobalServices.getDateStyle();
        GlobalServices.getDateStyleConfig().then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                var dateStyle = res.data.Data;
                $scope.ProductVoucher.DateStyle = dateStyle;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        $timeout(function ()
        {
            GlobalServices.getCompanyDet().then(function (res)
            {
                var comDet = res.data.Data;
                if (comDet) {
                    $scope.ProductVoucher.DateFrom_TMP = new Date(comDet.StartDate);
                }
            }, function (errormessage) {
                alert('Unable to Delete data. pls try again.' + errormessage.responseText);
            });
        });

        $scope.loadingstatus = "stop";

        $scope.columnDefs = [
            {
                headerName: "Date", width: 130, dataType: 'DateTime', cellRenderer: 'agGroupCellRenderer', field: "VoucherDate",
                valueFormatter: function (params) { return DateFormatAD(params.value); },
                filter: 'agDateColumnFilter', pinned: 'left'
            },
            {
                headerName: "Miti", width: 120, dataType: 'DateTime', valueGetter: function (params) {
                    var beData = params.data;

                    if (beData.VoucherDateNP && beData.VoucherDateNP.length > 0)
                        return beData.VoucherDateNP;

                    return DateFormatBS(beData.NY, beData.NM, beData.ND);
                    //return DateFormatBS(params.data.NY, params.data.NM, params.data.ND);
                },
                filter: 'agTextColumnFilter', pinned: 'left'
            },
            { headerName: "Product", width: 120, colId: 'colProduct', dataType: 'Text', field: "ProductName", filter: 'agTextColumnFilter', pinned: 'left', hide: true, },
            { headerName: "Group", width: 120, colId: 'colGroup', dataType: 'Text', field: "ProductGroup", filter: 'agTextColumnFilter', pinned: 'left', hide: true, },

            { headerName: "Voucher No.", width: 130, dataType: 'Number', field: "AutoManualNo", filter: 'agTextColumnFilter', pinned: 'left', },
            { headerName: "Ref.No.", width: 120, dataType: 'Number', field: "RefNo", filter: 'agTextColumnFilter', pinned: 'left', },
            {
                headerName: "Particular's", dataType: 'Text', width: 190,  pinned: 'left',
                valueGetter: function (params) {
                    var beData = params.data;

                    if (beData.VoucherType == "StockTransfor")
                        return beData.VoucherLedger;
                    else if (beData.VoucherType == "StockJournal")
                        return beData.GodownName;
                    else if (beData.VoucherType == "Consumption") {
                        return beData.PartyLedger + " - " + beData.GodownName;
                    }
                    else
                        return params.data.PartyLedger;
                },
                filter: 'agTextColumnFilter',
            },
            { headerName: "VoucherType", dataType: 'Text', width: 150, field: "VoucherName", filter: 'agTextColumnFilter', },
            
            {
                headerName: "InQty", width: 150, dataType: 'Number', filter: "agNumberColumnFilter", field: "InQty",

                valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' }, footerTemplate: '<div>totaal: #= sum #</div>',
                filter: 'agNumberColumnFilter',
            },
            {
                headerName: "InRate", width: 150, dataType: 'Number', filter: "agNumberColumnFilter", field: "InRate",
                valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' }, footerTemplate: '<div>totaal: #= sum #</div>',
                filter: 'agNumberColumnFilter',
            },
            {
                headerName: "InAmt", width: 150, dataType: 'Number', filter: "agNumberColumnFilter", field: "InAmt",

                valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' }, footerTemplate: '<div>totaal: #= sum #</div>',
                filter: 'agNumberColumnFilter',
            },
            {
                headerName: "OutQty", width: 150, dataType: 'Number', filter: "agNumberColumnFilter", field: "OutQty",
                valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' }, footerTemplate: '<div>totaal: #= sum #</div>',
                filter: 'agNumberColumnFilter',
            },
            {
                headerName: "OutRate", width: 150, dataType: 'Number', filter: "agNumberColumnFilter", field: "OutRate",
                valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' }, footerTemplate: '<div>totaal: #= sum #</div>',
                filter: 'agNumberColumnFilter',
            },
            {
                headerName: "OutAmt", width: 150, dataType: 'Number', filter: "agNumberColumnFilter", field: "OutAmt",
                valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' }, footerTemplate: '<div>totaal: #= sum #</div>',
                filter: 'agNumberColumnFilter',
            },
            {
                headerName: "Balance Qty.", dataType: 'Number', width: 150, filter: "agNumberColumnFilter", field: "BalanceQty",

                valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' }, footerTemplate: '<div>totaal: #= sum #</div>',
                filter: 'agNumberColumnFilter',
            },
            { headerName: "Unit", width: 120, dataType: 'Text', field: "Unit" },
            {
                headerName: "Balance Rate", field:"BalanceRate", width: 150, filter: "agNumberColumnFilter",
                valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' }, footerTemplate: '<div>totaal: #= sum #</div>',
                filter: 'agNumberColumnFilter',
            },
            {
                headerName: "Balance Amt.", dataType: 'Number', width: 150, filter: "agNumberColumnFilter", field: "BalanceAmt",
                valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' }, footerTemplate: '<div>totaal: #= sum #</div>',
                filter: 'agNumberColumnFilter',
            },
            { headerName: "Batch No.", width: 140, colId: 'batDet1', field: "Batch", cellStyle: { 'text-align': 'left' }, hide: true, },
            { headerName: "MFG Date", width: 140, colId: 'batDet2', field: "MFGDate", cellStyle: { 'text-align': 'center' }, hide: true,  },
            { headerName: "EXP Date", width: 140, colId: 'batDet3', field: "EXPDate", cellStyle: { 'text-align': 'center' }, hide: true,  },
            { headerName: "Engine No.", width: 140, colId: 'colEngineNo', field: "EngineNo", cellStyle: { 'text-align': 'left' }, hide: true,  },
            { headerName: "CostClass", dataType: 'Text', width: 120, field: "CostClassName" },
            { headerName: "Narration", dataType: 'Text', width: 120, field: "EachNarration" },
            { headerName: "Godown", dataType: 'Text', width: 150, field: "GodownName" },
            { headerName: "User", dataType: 'Text', width: 120, field: "UserName" },
            {
                headerName: "Action",
                width: 50,
                cellRenderer: function (params) {
                    return '<div class="btn-group" style="position: fixed; ">' +
                        '<button type="button" class="btn btn-default px-1 dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
                        '<span class="caret"></span>' +
                        '</button>' +
                        '<ul class="dropdown-menu dropdown-menu-right p-2" style="position: absolute; left: 0;">' +
                        '<li><a data-toggle="tooltip" data-placement="top" title="Show Document" ng-click="ShowDocument(this.data)"><i class="fas fa-file text-info"></i> Show Document</a>  </li>' +
                        '<li><a data-toggle="tooltip" data-placement="top" title="Print" ng-click="PrintVoucher(this)"><i class="fas fa-print text-info"></i> Print</a></li>' +
                        '<li><a data-toggle="tooltip" data-placement="top" title="Show Voucher" ng-click="ShowVoucher(this)"><i class="fas fa-info text-infor"></i> Show Voucher</a></li>' +
                        '<li><a data-toggle="tooltip" data-placement="top" title="Show Transaction Relation" ng-click="ShowTranRelation(this.data)"><i class="fas fa-info text-infor"></i> Show Relation</a></li>' +
                        '</ul>' +
                        '</div>';
                },
                pinned: 'right'
            },

        ];


        $scope.gridOptions = {
			onCellContextMenu: onCellContextMenu, // Handle right-click event
            defaultColDef: {
                filter: true,
                resizable: true,
                sortable: true,
                width: 100,


            },
            angularCompileRows: true,
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
                    InQty: 0,
                    InAmt: 0,
                    InRate: 0,
                    OutQty: 0,
                    OutRate: 0,
                    OutAmt: 0,
                    BalanceQty: 0,
                    BalanceRate: 0,
                    BalanceAmt:0
                }

                $scope.gridOptions.api.forEachNodeAfterFilterAndSort(function (node) {
                    var fData = node.data;
                    if (fData.RowType != 2) {
                        dt.InQty += fData.InQty;
                        dt.InAmt += fData.InAmt;
                        dt.OutQty += fData.OutQty;
                        dt.OutAmt += fData.OutAmt;
                        dt.BalanceQty += fData.BalanceQty;
                        dt.BalanceAmt += fData.BalanceAmt;
                    }                    
                });
                 
                $scope.dataForBottomGrid[0].InQty = dt.InQty;
                $scope.dataForBottomGrid[0].InAmt = dt.InAmt;
                $scope.dataForBottomGrid[0].InRate = dt.InRate;
                $scope.dataForBottomGrid[0].OutQty = dt.OutQty;
                $scope.dataForBottomGrid[0].OutRate = dt.OutRate;
                $scope.dataForBottomGrid[0].OutAmt = dt.OutAmt;
                $scope.dataForBottomGrid[0].BalanceQty = dt.BalanceQty;
                $scope.dataForBottomGrid[0].BalanceRate = dt.BalanceRate;
                $scope.dataForBottomGrid[0].BalanceAmt = dt.BalanceAmt;
                $scope.gridOptionsBottom.api.setRowData($scope.dataForBottomGrid);
            },
            getNodeChildDetails: function (beData) {

                if (beData.RowType == 0 && $scope.ProductVoucher.BatchWise==true) {
                    if ($scope.OpeningColl && $scope.OpeningColl.length > 0) {
                        var dataColl = $scope.OpeningColl;
                        return {
                            group: true,
                            children: dataColl,
                            expanded: true
                        };
                    }
                    else
                        return null;
                }                 
                else
                    return null;


            },

        };
        //$scope.eGridDiv = document.querySelector('#datatable');

        //// create the grid passing in the div to use together with the columns & data we want to use
        //new agGrid.Grid($scope.eGridDiv, $scope.gridOptions);

        $scope.dataForBottomGrid = [
            {
                AutoNumber: '',
                Name: 'Total =>',
                InAmount: 0,
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
            if (SelectedProductId && SelectedProductId > 0) {
                $scope.ProductVoucher.ProductId = SelectedProductId;
                $scope.GetProductVoucher();
            }
        });
		
		 $timeout(function () {
            GlobalServices.getListState(EntityId, $scope.gridOptions);
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

           
            $scope.gridOptions.api.setRowData($scope.RptDataColl);


        }

    }

    $scope.saveRptListState = function () {
        GlobalServices.saveRptListState(EntityId, $scope.gridOptions);
    };
	 $scope.DelListState = function () {
        GlobalServices.delListStateRpt(EntityId);
    }
    $scope.PrintVoucher = function (e) {
        var obj = e.data;

        var tranId = obj.TranId;
        var voucherType = GlobalServices.getVoucherTypeId(obj.VoucherType);
        var voucherId = obj.VoucherId;
        var para = {
            VoucherType: voucherType
        }
        $http({
            method: 'POST',
            url: base_url + "Global/GetEntityByVoucherType",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (rs) {
            if (rs.data.Data) {
                var entityId = rs.data.Data.RId;
                $timeout(function () {

                    if (tranId && tranId > 0) {

                        $http({
                            method: 'GET',
                            url: base_url + "ReportEngine/GetReportTemplates?entityId=" + entityId + "&voucherId=" + voucherId + "&isTran=true",
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

                                    var printed = false;
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
                                                        printed = true;
                                                        if (rptTranId > 0) {
                                                            document.body.style.cursor = 'wait';
                                                            document.getElementById("frmRpt").src = '';
                                                            document.getElementById("frmRpt").src = base_url + "web/ReportViewer.aspx?rpttranid=" + rptTranId + "&istransaction=true&entityid=" + entityId + "&voucherid=" + voucherId + "&tranid=" + tranId + "&vouchertype=" + voucherType;
                                                            document.body.style.cursor = 'default';
                                                            $('#FrmPrintReport').modal('show');
                                                        }

                                                    } else {
                                                        resolve('You need to select:)')
                                                    }
                                                })
                                            }
                                        })
                                    }

                                    if (rptTranId > 0 && printed == false) {
                                        document.body.style.cursor = 'wait';
                                        document.getElementById("frmRpt").src = '';
                                        document.getElementById("frmRpt").src = base_url + "web/ReportViewer.aspx?rpttranid=" + rptTranId + "&istransaction=true&entityid=" + entityId + "&voucherid=" + voucherId + "&tranid=" + tranId + "&vouchertype=" + voucherType;
                                        document.body.style.cursor = 'default';
                                        $('#FrmPrintReport').modal('show');
                                    }

                                } else
                                    Swal.fire('No Templates found for print');
                            }
                        }, function (reason) {
                            Swal.fire('Failed' + reason);
                        });
                    }

                });
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });


    };


    $scope.SelectedTran = {};
    $scope.ShowDocument = function (beData) {

        if (beData.TranId && beData.VoucherType) {
            $scope.SelectedTran = beData;

            var para = {
                TranId: beData.TranId,
                VoucherType: beData.VoucherType
            };

            $http({
                method: 'POST',
                url: base_url + "Global/GetTranDocAttachment",
                dataType: "json",
                data: JSON.stringify(para)
            }).then(function (res) {
                hidePleaseWait();
                $scope.loadingstatus = "stop";
                if (res.data.IsSuccess) {
                    $scope.SelectedTran.DocumentColl = res.data.Data;


                    $('#modal-showDocument').modal('show');

                } else {
                    Swal.fire(res.data.ResponseMSG);
                }

            }, function (reason) {
                Swal.fire('Failed' + reason);
            });
        }

    }
    $scope.ShowVoucher = function (e) {
        var obj = e.data;

        $(document).ready(function () {
            $('body').css('cursor', 'wait');
        });

        var para = {
            voucherType: obj.VoucherType,
            tranId: obj.TranId,
        };
        var frame = document.getElementById("frmChieldForm");
        var frameDoc = frame.contentDocument || frame.contentWindow.document;
        if (frameDoc)
            frameDoc.removeChild(frameDoc.documentElement);

        frame.src = '';
        frame.src = base_url + "Global/ShowAccInvTransaction?" + param(para);
        document.body.style.cursor = 'default';

        $('#frmChieldForm').on('load', function () {
            $('body').css('cursor', 'default');
        });

        $('#frmChield').modal('show');
    }

    $scope.ShowBatchDetails = function (val)
    {
        for (var i = 1; i < 4; i++) {
            var colName = 'batDet' + i.toString();
            $scope.gridOptions.columnApi.setColumnVisible(colName, val);
        }


        var fixedColumns = GlobalServices.getFixedProductColumns();
        fixedColumns.forEach(function (fcol) {
            var findCol = $scope.gridOptions.columnApi.getColumn(fcol.colName);
            if (findCol) {
                var isVisible = $scope.FixedProductConfig[fcol.show];
                var headerName = $scope.FixedProductConfig[fcol.text];
                findCol.headerName = headerName;
                findCol.colDef.headerName = headerName;
                $scope.gridOptions.columnApi.setColumnVisible(fcol.colName, isVisible);
            }
        });

        $scope.gridOptions.api.refreshHeader();

        $scope.GetProductVoucher();
    }

    $scope.ClearData = function () {
        $scope.dayBook = {};
        $scope.RptDataColl = [];
        $scope.dayBook.InQty = 0;
        $scope.dayBook.InAmt = 0;
        $scope.dayBook.InRate = 0;
        $scope.dayBook.OutQty = 0;
        $scope.dayBook.OutRate = 0;
        $scope.dayBook.OutAmt = 0;
        $scope.dayBook.BalanceQty = 0;
        $scope.dayBook.BalanceRate = 0;
        $scope.dayBook.BalanceAmt = 0;

        $scope.dataForBottomGrid[0].InQty = 0;
        $scope.dataForBottomGrid[0].InAmt = 0;
        $scope.dataForBottomGrid[0].InRate = 0;
        $scope.dataForBottomGrid[0].OutQty = 0;
        $scope.dataForBottomGrid[0].OutRate = 0;
        $scope.dataForBottomGrid[0].OutAmt = 0;
        $scope.dataForBottomGrid[0].BalanceQty = 0;
        $scope.dataForBottomGrid[0].BalanceRate = 0;
        $scope.dataForBottomGrid[0].BalanceAmt = 0;
         
        $scope.gridOptionsBottom.api.setRowData($scope.dataForBottomGrid);

        $scope.DataColl = [];
        $scope.gridOptions.api.setRowData($scope.DataColl);
    };

    $scope.OpeningColl = [];
    $scope.GetProductVoucher = function () {
        $scope.OpeningColl = [];
        $scope.ClearData();

        //if ((!$scope.ProductVoucher.ProductId || $scope.ProductVoucher.ProductId == 0))
          //  return;


        var dateFrom =$filter('date')(new Date(), 'yyyy-MM-dd');
        var dateTo = $filter('date')(new Date(), 'yyyy-MM-dd');

        if ($scope.ProductVoucher.DateFromDet)
            dateFrom =$filter('date')($scope.ProductVoucher.DateFromDet.dateAD, 'yyyy-MM-dd');

        if ($scope.ProductVoucher.DateToDet)
            dateTo = $filter('date')($scope.ProductVoucher.DateToDet.dateAD, 'yyyy-MM-dd');

        $scope.loadingstatus = 'running';
        showPleaseWait();

        if ($scope.ProductVoucher.ProductId > 0) {
            $scope.gridOptions.columnApi.setColumnVisible('colProduct', false);
            $scope.gridOptions.columnApi.setColumnVisible('colGroup', false);
        } else {
            $scope.gridOptions.columnApi.setColumnVisible('colProduct',true);
            $scope.gridOptions.columnApi.setColumnVisible('colGroup', true);
        }
        var val = $scope.ProductVoucher.BatchWise;
        if (val == true) {
            for (var i = 1; i < 4; i++) {
                var colName = 'batDet' + i.toString();
                $scope.gridOptions.columnApi.setColumnVisible(colName, val);
            }


            var fixedColumns = GlobalServices.getFixedProductColumns();
            fixedColumns.forEach(function (fcol) {
                var findCol = $scope.gridOptions.columnApi.getColumn(fcol.colName);
                if (findCol) {
                    var isVisible = $scope.FixedProductConfig[fcol.show];
                    var headerName = $scope.FixedProductConfig[fcol.text];
                    findCol.headerName = headerName;
                    findCol.colDef.headerName = headerName;
                    $scope.gridOptions.columnApi.setColumnVisible(fcol.colName, isVisible);
                }
            });

            $scope.gridOptions.api.refreshHeader();
        }
       


        var beData = {            
            dateFrom: dateFrom,
            dateTo: dateTo,
            productId: $scope.ProductVoucher.ProductId,
            godownIdColl: $scope.ProductVoucher.GodownId,
            BatchColl: $scope.ProductVoucher.BatchColl,
            EngineNoColl: $scope.ProductVoucher.EngineNoColl,
            IncludeAditionalCost: $scope.ProductVoucher.IncludeAditionalCost,
            LedgerIdColl: ($scope.ProductVoucher.SelectedLedgerIdColl && $scope.ProductVoucher.SelectedLedgerIdColl.length > 0 ? $scope.ProductVoucher.SelectedLedgerIdColl.toString() : ''),
        }; 
        $http({
            method: "POST",
            url: base_url + "Inventory/Reporting/GetProductVoucher",
            data: JSON.stringify(beData),
            dataType: "json"
        }).then(function (res) {

            $scope.loadingstatus = 'stop';
            hidePleaseWait();
            if (res.data.Data && res.data.Data.DataColl.length > 0) {
                $scope.RptDataColl = res.data.Data.DataColl;
                $scope.OpeningColl = res.data.Data.OpeningColl;
                $scope.ForCustomColumn = $scope.RptDataColl[0];

                var dt = res.data.Data;
                $scope.dataForBottomGrid[0].InQty = dt.InQty;
                $scope.dataForBottomGrid[0].InAmt = dt.InAmt;
                $scope.dataForBottomGrid[0].InRate = dt.InRate;
                $scope.dataForBottomGrid[0].OutQty = dt.OutQty;
                $scope.dataForBottomGrid[0].OutRate = dt.OutRate;
                $scope.dataForBottomGrid[0].OutAmt = dt.OutAmt;
                $scope.dataForBottomGrid[0].BalanceQty = dt.BalanceQty;
                $scope.dataForBottomGrid[0].BalanceRate = dt.BalanceRate;
                $scope.dataForBottomGrid[0].BalanceAmt = dt.BalanceAmt;

                $scope.gridOptionsBottom.api.setRowData($scope.dataForBottomGrid);
                
                $scope.gridOptions.api.setRowData($scope.RptDataColl);
            }
 

        }, function (reason) {
            $scope.loadingstatus = "stop";
            hidePleaseWait();
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
                                                        Period: GlobalServices.getPeriodDateAsStr($scope.ProductVoucher.DateFromDet, $scope.ProductVoucher.DateToDet, $scope.ProductVoucher.DateStyle) ,
                                                        Product: $scope.ProductVoucher.ProductDetail.Name,
                                                        DateStyle: $scope.ProductVoucher.DateStyle,
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
                                    Period: GlobalServices.getPeriodDateAsStr($scope.ProductVoucher.DateFromDet, $scope.ProductVoucher.DateToDet, $scope.ProductVoucher.DateStyle),
                                    Product: $scope.ProductVoucher.ProductDetail.Name,
                                    DateStyle: $scope.ProductVoucher.DateStyle,
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

            //VoucherDate,VoucherDateNP
            if (fData.VoucherDate) {
                fData.DateAsStr = GlobalServices.getDateAsStr(fData.VoucherDate, fData.VoucherDateNP, $scope.ProductVoucher.DateStyle);
            }

            if (fData.RowType == 1 || fData.RowType == 0) {
                fData.VoucherDateStr = DateFormatAD(fData.VoucherDate);
                fData.VoucherDateNP = DateFormatBS(fData.NY, fData.NM, fData.ND);
                filterData.push(fData);
            }            
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
            Period: GlobalServices.getPeriodDateAsStr($scope.ProductVoucher.DateFromDet, $scope.ProductVoucher.DateToDet, $scope.ProductVoucher.DateStyle),
            Product: $scope.ProductVoucher.ProductDetail.Name,
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
                down_file(base_url + "//" + res.data.Data.ResponseId, "ProductVoucher.xlsx");
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

    $scope.TranRelation = {};
    $scope.ShowTranRelation = function (curRow) {

        $scope.TranRelation = {};
        if (curRow.TranId > 0) {

            $scope.loadingstatus = "running";
            showPleaseWait();
            GlobalServices.ShowTransactionRelation(curRow.VoucherTypeId, curRow.TranId).then(function (res1) {
                $scope.loadingstatus = "stop";
                hidePleaseWait();
                if (res1.data.IsSuccess && res1.data.Data) {
                    var tranData = res1.data.Data;
                    if (tranData.length > 0) {
                        $scope.TranRelation.Parent = res1.data.Data[0];
                        $scope.TranRelation.ChieldColl = [];
                        angular.forEach(tranData, function (td) {
                            if (td.LevelId > 1)
                                $scope.TranRelation.ChieldColl.push(td);
                        });

                        $('#frmMDLTranRelation').modal('show');
                    }
                }
            }, function (reason) {
                Swal.fire('Failed' + reason);
            });
        }
    }

    $scope.ShowTranVoucher = function (voucherType, tranId) {
        GlobalServices.ShowVoucher(voucherType, tranId);
    }

    $scope.SelectLedger = function (curRow) {
        if (curRow.IsSelected == true) {
            var find = $scope.ProductVoucher.SelectedLedgerIdColl.indexOf(curRow.LedgerId);
            if (find == -1) {
                $scope.ProductVoucher.SelectedLedgerIdColl.push(curRow.LedgerId);
            }
        }
        else {
            var find = $scope.ProductVoucher.SelectedLedgerIdColl.indexOf(curRow.LedgerId);
            if (find != -1)
                $scope.ProductVoucher.SelectedLedgerIdColl.splice(find, 1); //
        }
    }

    $scope.SelectAllLedger = function (isSelected) {
        if (isSelected == false) {
            $scope.ProductVoucher.SelectedLedgerIdColl = [];

            $scope.SearchDataColl.forEach(function (curRow) {
                curRow.IsSelected = false;
            });

        } else {
            $scope.SearchDataColl.forEach(function (curRow) {
                curRow.IsSelected = true;
                var find = $scope.ProductVoucher.SelectedLedgerIdColl.indexOf(curRow.LedgerId);
                if (find == -1) {
                    $scope.ProductVoucher.SelectedLedgerIdColl.push(curRow.LedgerId);
                }
            });
        }
    }
    $scope.IsSelectedLed = function (curRow) {
        var find = $scope.ProductVoucher.SelectedLedgerIdColl.indexOf(curRow.LedgerId);
        if (find == -1) {
            return false;
        }
        else
            return true;
    }

    $scope.SearchLedgerDataColl = [];
    $scope.SearchLedgerData = function () {

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
            url: base_url + "Account/Creation/GetLedgerLst",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            $scope.loadingstatus = 'stop';
            hidePleaseWait();

            if (res.data.IsSuccess && res.data.Data) {
                $scope.SearchDataColl = res.data.Data;
                $scope.paginationOptions.TotalRows = res.data.TotalCount;

                $scope.SearchDataColl.forEach(function (sd) {
                    sd.IsSelected = $scope.IsSelectedLed(sd);
                });

                $('#searVoucherRightBtn').modal('show');

            } else
                alert(res.data.ResponseMSG);

        }, function (reason) {
            alert('Failed' + reason);
        });


    };

    $scope.ReSearchLedgerData = function (pageInd) {

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
                url: base_url + "Account/Creation/GetLedgerLst",
                dataType: "json",
                data: JSON.stringify(para)
            }).then(function (res) {
                $scope.loadingstatus = 'stop';
                hidePleaseWait();

                if (res.data.IsSuccess && res.data.Data) {
                    $scope.SearchDataColl = res.data.Data;
                    $scope.SearchDataColl.forEach(function (sd) {
                        sd.IsSelected = $scope.IsSelectedLed(sd);
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
