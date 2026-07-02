"use strict";

agGrid.initialiseAgGridWithAngular1(angular);

app.controller("PendingSalesProjection", function ($scope, $http, $filter, $timeout, GlobalServices, $compile) {

  var PrintPreviewAs = 1;
    const contextMenu = GlobalServices.createElementForMenu();
	
    LoadData();

    $scope.onBtExportCSV = function () {
        var params = {
            fileName: 'PendingSalesProjection.csv',
            sheetName: 'PendingSalesProjection'
        };

        $scope.gridOptions.api.exportDataAsCsv(params);
    }

    function LoadData() {
        $('.select2').select2({
            allowClear: true,
            openOnEnter: true
        });
        
        //Search Drop DownList
        $scope.VoucherSearchOptions = [{ text: 'Date(A.D)', value: 'VoucherDate', dataType: 'Text' },
            { text: 'Date(B.S)', value: 'VoucherDateBS', dataType: 'Number' },
        { text: 'Particulars', value: 'Name', dataType: 'Number' },
        { text: 'ProjectionNo', value: 'VoucherNo', dataType: 'Text' },
        { text: 'Projection Date', value: 'EntryDate', dataType: 'Text' },
        { text: 'OrderNo', value: 'OrderNo', dataType: 'text' },
            { text: 'ProjectionQty', value: 'ProjectionQty', dataType: 'Number' },
        { text: 'OrderQty', value: 'OrderQty', dataType: 'Number' },
        { text: 'PendingQty', value: 'PendingQty', dataType: 'Number' },
        { text: 'Unit', value: 'Unit', dataType: 'Number' },
        { text: 'VoucherName', value: 'VoucherName', dataType: 'Number' },
        { text: 'CostClass', value: 'CostClass', dataType: 'Number' },
        { text: 'Branch', value: 'Branch', dataType: 'Number' },
        { text: 'Party', value: 'Party', dataType: 'Number' },
        { text: 'Address', value: 'Address', dataType: 'Number' },
        { text: 'SalesMan', value: 'Agent', dataType: 'Number' },
        { text: 'NGroup', value: 'ProductGroup', dataType: 'Number' },
        { text: 'Unit', value: 'Unit', dataType: 'text' },
        { text: 'ProductType', value: 'ProductType', dataType: 'text' },
        { text: 'Brand', value: 'Brand', dataType: 'text' },
        { text: 'Division', value: 'Division', dataType: 'text' },
        { text: 'Color', value: 'Color', dataType: 'text' },
        { text: 'Flavour', value: 'Flavour', dataType: 'text' },
        { text: 'Shape', value: 'Shape', dataType: 'text' },
        { text: 'Alias', value: 'Alias', dataType: 'text' },
        { text: 'Code', value: 'Code', dataType: 'text' },
        { text: 'OrderDetails', value: 'OrderStatus', dataType: 'text' },
        { text: 'ProductCategories', value: 'ProductCategory', dataType: 'text' },
        { text: 'SalesMan1', value: 'Agent1', dataType: 'text' },
        { text: 'SalesMan2', value: 'Agent2', dataType: 'text' },
        { text: 'SalesMan3', value: 'Agent3', dataType: 'text' },
        { text: 'ColumnHeader', value: 'ColumnHeader', dataType: 'text' },
        { text: 'ColumnHeader', value: 'ColumnHeader', dataType: 'text' },
        { text: 'ColumnHeader', value: 'ColumnHeader', dataType: 'text' },
        { text: 'ColumnHeader', value: 'ColumnHeader', dataType: 'text' },
        { text: 'Division', value: 'Division', dataType: 'text' },
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

       

        $scope.PendingSalesProjection = {
            DateFrom_TMP: new Date(),
            DateTo_TMP: new Date(),
            VoucherId: 0,
            IsPost: true,
            IsPendingOnly: true,
            IsClearOnly:true,
            BranchId: 0
        };
      

        $scope.loadingstatus = "stop";

        $scope.columnDefs = [

            { headerName: "Particulars", width: 300, field: "VoucherName", pinned:'left', dataType: 'Text', cellStyle: { 'text-align': 'left' }  },
            { headerName: "Projection No.", width: 180, field: "AutoVoucherNo", pinned: 'left', dataType: 'Number', cellStyle: { 'text-align': 'right' }  },
            { headerName: "Projection Date", width: 180, field: "VoucherDate", dataType: 'DateTime', cellStyle: { 'text-align': 'center' }  },
            { headerName: "Order No.", width: 180, field: "OrderNo", dataType: 'Number', cellStyle: { 'text-align': 'right' }  },
            { headerName: "Projection Qty", width: 180, field: "Projection Qty", dataType: 'Number', cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); },   },
            { headerName: "OrderQty", width: 180, field: "OrderQty", dataType: 'Number', cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); },   },
            { headerName: "Pending Qty", width: 180, field: "BalanceQty", dataType: 'Number', cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); },  },
            { headerName: "Unit", width: 120, field: "Unit", dataType: 'Text', cellStyle: { 'text-align': 'left' }  },
            { headerName: "Product Category", width: 180, dataType: 'Text', field: "ProductCategory", cellStyle: { 'text-align': 'left' }  },
            { headerName: "SalesMan 1", width: 180, dataType: 'Text', field: "Agent1", cellStyle: { 'text-align': 'left' }  },
            { headerName: "SalesMan 2", width: 180, dataType: 'Text', field: "Agent2", cellStyle: { 'text-align': 'left' }  },
            { headerName: "SalesMan 3", width: 180, dataType: 'Text', field: "Agent3", cellStyle: { 'text-align': 'left' }  },
            { headerName: "Column Header", width: 180, dataType: 'Text', field: "ColumnHeader", cellStyle: { 'text-align': 'left' }  },
            { headerName: "Column Header", width: 180, dataType: 'Text', field: "ColumnHeader", cellStyle: { 'text-align': 'left' }  },
            { headerName: "Column Header", width: 180, dataType: 'Text', field: "ColumnHeader", cellStyle: { 'text-align': 'left' }  },
            { headerName: "Division", width: 180,  dataType: 'Text', field: "Division", cellStyle: { 'text-align': 'left' }  },


            
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
                    VoucherName: 'Total =>',
                    ProjectionQty: 0,
                    OrderQty: 0,
                    BalanceQty: 0


                }
                $scope.gridOptions.api.forEachNodeAfterFilterAndSort(function (node) {
                    var fData = node.data;
                    dt.ProjectionQty += fData.ProjectionQty;
                    dt.OrderQty += fData.OrderQty;
                    dt.BalanceQty += fData.BalanceQty;
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
                VoucherName: 'Total =>',
                ProjectionQty: 0,
                OrderQty: 0,
                BalanceQty: 0

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
    $scope.ClearData = function () {

        var DataColl = [];
        $scope.gridOptionsBottom.api.setRowData(DataColl);

        $scope.gridOptions.api.setRowData(DataColl);
    };
    $scope.GetPendingSalesProjection = function () {

        $scope.ClearData();
        var dateFrom = new Date(($filter('date')(new Date(), 'yyyy-MM-dd')));
        var dateTo = new Date(($filter('date')(new Date(), 'yyyy-MM-dd')));

        if ($scope.PendingSalesProjection.DateFromDet)
            dateFrom = new Date(($filter('date')($scope.PendingSalesProjection.DateFromDet.dateAD, 'yyyy-MM-dd')));

        if ($scope.PendingSalesProjection.DateToDet)
            dateTo = new Date(($filter('date')($scope.PendingSalesProjection.DateToDet.dateAD, 'yyyy-MM-dd')));

        $scope.loadingstatus = 'running';
        showPleaseWait();

        var beData = {
            DateFrom: dateFrom,
            DateTo: dateTo,
            VoucherType: $scope.PendingSalesProjection.VoucherId,
            isPost: $scope.PendingSalesProjection.IsPost,
            isPendingOnly: $scope.PendingSalesProjection.IsPendingOnly,
            isClearOnly: $scope.PendingSalesProjection.IsClearOnly,
            branchId: $scope.PendingSalesProjection.BranchId
        };

        $scope.loadingstatus = 'running';

        $http({
            method: "POST",
            url: base_url + "Inventory/Reporting/GetPendingSalesProjection",
            data: JSON.stringify(beData),
            dataType: "json"
        }).then(function (res) {

            $scope.loadingstatus = 'stop';
            hidePleaseWait();

            if (res.data.IsSuccess && res.data.Data) {
                var DataColl = mx(res.data.Data);

                var dt = {
                    VoucherName: 'TOTAL =>',
                    ProjectionQty: DataColl.sum(p1 => p1.ProjectionQty),
                    OrderQty: DataColl.sum(p1 => p1.OrderQty),
                    BalanceQty: DataColl.sum(p1 => p1.BalanceQty),
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
                down_file(base_url + "//" + res.data.Data.ResponseId, "PendingSalesProjection.xlsx");
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
