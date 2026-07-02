"use strict";

agGrid.initialiseAgGridWithAngular1(angular);

app.controller("SalesAnalysisPartyWise", function ($scope, $http, $filter, $timeout, GlobalServices, $compile) {

  var PrintPreviewAs = 1;
    const contextMenu = GlobalServices.createElementForMenu();
	
    LoadData();

    $scope.onBtExportCSV = function () {
        var params = {
            fileName: 'SalesAnalysisPartyWise.csv',
            sheetName: 'SalesAnalysisPartyWise'
        };

        $scope.gridOptions.api.exportDataAsCsv(params);
    }

    function LoadData() {
        $('.select2').select2({
            allowClear: true,
            openOnEnter: true
        });
       
        //Search Drop DownList
        $scope.VoucherSearchOptions = [{ text: 'Particulars', value: 'ProductName', dataType: 'Text' },
        { text: 'Address', value: 'Address', dataType: 'Number' },
       // { text: 'Code', value: 'Code', dataType: 'Number' },
        { text: 'Group Name', value: 'GroupName', dataType: 'Text' },
       // { text: 'CategoriesName', value: 'CategoriesName', dataType: 'text' },
        { text: 'SalesQty', value: 'SalesQty', dataType: 'Number' },
        { text: 'SalesRate', value: 'SalesRate', dataType: 'Number' },
        { text: 'SalesAmt', value: 'SalesAmt', dataType: 'Number' },
       
        { text: 'Return Qty', value: 'ReturnQty', dataType: 'Number' },
       
        { text: 'Return rate', value: 'ReturnRate', dataType: 'Number' },
        { text: 'Return Amt', value: 'ReturnAmt', dataType: 'Number' },
        { text: 'Net Sales Qty', value: 'NetSalesQty', dataType: 'Number' },
       
        { text: 'Net Sales Rate', value: 'NetSalesRate', dataType: 'Number' },
        { text: 'Net Sales Amt', value: 'NetSalesAmt', dataType: 'Number' },
        { text: 'Balance rate', value: 'BalanceRate', dataType: 'text' },
        { text: 'SalesQty1', value: 'SalesQty', dataType: 'Number' },
        { text: 'ReturnQty1', value: 'ReturnQty', dataType: 'Number' },
        { text: 'NetSalesQty', value: 'NetSalesQty', dataType: 'Number' },
            { text: 'olvFixedUnit1', value: 'FXQty1', dataType: 'Number' },
            { text: 'olvFixedUnit2', value: 'FXQty2', dataType: 'Number' },
            { text: 'olvFixedUnit1R', value: 'FXQty1_R', dataType: 'Number' },
            { text: 'olvFixedUnit2R', value: 'FXQty2_R', dataType: 'Number' },
            { text: 'olvFixedUnit1N', value: 'FXQty1_N', dataType: 'Number' },
            { text: 'olvFixedUnit2N', value: 'FXQty2_N', dataType: 'Number' },
            
        ];

        //Filter Dialog Box Details 
        $scope.BranchTypeColl = [];
        $scope.VoucherTypeColl = [];
        $scope.LedgerGroupTypeColl = [];
        $scope.ExpressionColl = GlobalServices.getExpression();
        $scope.ConditionColl = GlobalServices.getLogicCondition();
        $scope.FilterColumnColl = [{ text: 'SalesQty', value: 'SalesQty', dataType: 'Number' },
        { text: 'SalesAmt', value: 'SalesAmt', dataType: 'Number' },
        { text: 'Return Qty', value: 'ReturnQty', dataType: 'Number' },
        { text: 'OutQty', value: 'OutQty', dataType: 'Number' },
        { text: 'ReturnAmt', value: 'ReturnAmt', dataType: 'Number' },
        { text: 'NetSalesQty', value: 'NetSalesQty', dataType: 'Number' },
        { text: 'NetSalesAmt', value: 'NetSalesAmt', dataType: 'Number' },
        { text: 'Party Name', value: 'PartyName', dataType: 'Number' },
        { text: 'ProductName', value: 'ProductName', dataType: 'Number' },
        { text: 'LedgerGroupName', value: 'LedgerGroupName', dataType: 'text' },];

        

        $scope.SalesAnalysisPartyWise = {
            DateFrom_TMP: new Date(),
            DateTo_TMP: new Date(),
            procName: '',
            
        };
       

        $scope.loadingstatus = "stop";

        var columnDefs = [
           
            { headerName: "Particular's", width: 250, field: "ProductName", cellStyle: { 'text-align': 'left' }  },
            { headerName: "Address", width: 250, field: "Address", cellStyle: { 'text-align': 'left' }  },
            { headerName: "Group Name", width: 250, field: "LedgerGroupName", cellStyle: { 'text-align': 'left' }  },
            { headerName: "Sales Qty", width: 250, field: "SalesQty", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); },  },
            { headerName: "Sales Rate", width: 250, field: "SalesRate", cellStyle: { 'text-align': 'right' }  },
            { headerName: "Sales Amt", width: 250, field: "SalesAmt", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); },  },
            { headerName: "Return Qty", width: 250, field: "ReturnQty", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); },  },
            { headerName: "Return Rate", width: 250, field: "ReturnRate", cellStyle: { 'text-align': 'right' }  },
            { headerName: "Return Amt", width: 250, field: "ReturnAmt", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); },  },
            { headerName: "Net Sales Qty", width: 250, field: "NetSalesQty", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); },  },
            { headerName: "Net Sales Amt", width: 250, field: "NetSalesAmt", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); },  },
            { headerName: "Balance Rate", width: 250, field: "BalanceRate", cellStyle: { 'text-align': 'right' }  },
            { headerName: "Sales Qty1", width: 250, field: "SalesQty", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },
            { headerName: "Return Qty1", width: 250, field: "ReturnQty", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); },  },
            { headerName: "Net Sales Qty", width: 250, field: "NetSalesQty", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); },  },
            { headerName: "olvFixedUnit1", width: 250, field: "FXQty1", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); },  },
            { headerName: "olvFixedUnit2", width: 250, field: "FXQty2", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); },  },
            { headerName: "olvFixedUnit1R", width: 250, field: "FXQty1_R", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); },  },
            { headerName: "olvFixedUnit2R", width: 250, field: "FXQty2_R", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); },  },
            { headerName: "olvFixedUnit1N", width: 250, field: "FXQty1_N", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); },  },
            { headerName: "olvFixedUnit2N", width: 250, field: "FXQty2_N", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); },  },

          
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
                    ProductName: 'Total =>',
                    SalesQty: 0,
                    SalesAmt: 0,
                    ReturnQty: 0,
                    ReturnAmt: 0,
                    NetSalesQty: 0,
                    NetSalesAmt: 0,
                    FXQty1: 0,
                    FXQty2: 0,
                  


                }
                $scope.gridOptions.api.forEachNodeAfterFilterAndSort(function (node) {
                    var fData = node.data;
                    dt.SalesQty += fData.SalesQty;
                    dt.SalesAmt += fData.SalesAmt;
                    dt.ReturnQty += fData.ReturnQty;
                    dt.ReturnAmt += fData.ReturnAmt;
                    dt.NetSalesQty += fData.NetSalesQty;
                    dt.NetSalesAmt += fData.NetSalesAmt;
                    dt.FXQty1 += fData.FXQty1;
                    dt.FXQty2 += fData.FXQty2;
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
                ProductName: 'Total =>',
                SalesQty: 0,
                SalesAmt: 0,
                ReturnQty: 0,
                ReturnAmt: 0,
                NetSalesQty: 0,
                NetSalesAmt: 0,
                FXQty1: 0,
                FXQty2: 0,
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
    $scope.GetSalesAnalysisPartyWise = function () {
        $scope.ClearData();
        var dateFrom = new Date(($filter('date')(new Date(), 'yyyy-MM-dd')));
        var dateTo = new Date(($filter('date')(new Date(), 'yyyy-MM-dd')));

        if ($scope.SalesAnalysisPartyWise.DateFromDet)
            dateFrom = new Date(($filter('date')($scope.SalesAnalysisPartyWise.DateFromDet.dateAD, 'yyyy-MM-dd')));

        if ($scope.SalesAnalysisPartyWise.DateToDet)
            dateTo = new Date(($filter('date')($scope.SalesAnalysisPartyWise.DateToDet.dateAD, 'yyyy-MM-dd')));

        $scope.loadingstatus = 'running';
        showPleaseWait();

        var beData = {
            DateFrom: dateFrom,
            DateTo: dateTo,
            procName: $scope.SalesAnalysisPartyWise.procName,
           
        };

        $scope.loadingstatus = 'running';

        $http({
            method: "POST",
            url: base_url + "Inventory/Reporting/GetSalesAnalysisPartyWise",
            data: JSON.stringify(beData),
            dataType: "json"
        }).then(function (res) {


            $scope.loadingstatus = 'stop';
            hidePleaseWait();

            if (res.data.IsSuccess && res.data.Data) {
                var DataColl = mx(res.data.Data);

                var dt = {
                    ProductName: 'TOTAL =>',
                    SalesQty: DataColl.sum(p1 => p1.SalesQty),
                    SalesAmt: DataColl.sum(p1 => p1.SalesAmt),
                    ReturnQty: DataColl.sum(p1 => p1.ReturnQty),
                    NetSalesQty: DataColl.sum(p1 => p1.NetSalesQty),
                    NetSalesAmt: DataColl.sum(p1 => p1.NetSalesAmt),
                    FXQty1: DataColl.sum(p1 => p1.FXQty1),
                    FXQty2: DataColl.sum(p1 => p1.FXQty2),
                }

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
                down_file(base_url + "//" + res.data.Data.ResponseId, "SalesAnalysisPartyWise.xlsx");
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
