"use strict";

agGrid.initialiseAgGridWithAngular1(angular);

app.controller("PendingSalesQuotation", function ($scope, $http, $filter, $timeout, GlobalServices, $compile) {

  var PrintPreviewAs = 1;
    const contextMenu = GlobalServices.createElementForMenu();
	
    LoadData();

    $scope.onBtExportCSV = function () {
        var params = {
            fileName: 'PendingSalesQuotation.csv',
            sheetName: 'PendingSalesQuotation'
        };

        $scope.gridOptions.api.exportDataAsCsv(params);
    }

    function LoadData() {
        $('.select2').select2({
            allowClear: true,
            openOnEnter: true
        });
       
        //Search Drop DownList
        $scope.VoucherSearchOptions = [{ text: 'Particulars', value: 'Name', dataType: 'Number' },
            { text: 'ProductName', value: 'ProductName', dataType: 'Number' },
            { text: 'ProjectionQty', value: 'ProjectionQty', dataType: 'Text' },
            { text: 'OrderQty', value: 'OrderQty', dataType: 'text' },
            { text: 'SalesQty', value: 'SalesQty', dataType: 'Number' },
            { text: 'TotalSalesQty', value: 'TotalSales', dataType: 'Number' },
            { text: 'PendingTargetQty', value: 'PendingTarget', dataType: 'Number' },
            { text: 'Unit', value: 'Unit', dataType: 'Number' },
            { text: 'Address', value: 'Address', dataType: 'Number' },
            { text: 'SalesMan', value: 'SalesMan', dataType: 'Number' },
            { text: 'Group', value: 'Group', dataType: 'Number' },
            { text: 'Brand', value: 'Brand', dataType: 'Number' },
            { text: 'Color', value: 'Color', dataType: 'Number' },
            { text: 'Shape', value: 'Shape', dataType: 'Number' },
            { text: 'Alias', value: 'Alias', dataType: 'text' },
            { text: 'Code', value: 'Code', dataType: 'text' },
            { text: 'Flavour', value: 'Flavour', dataType: 'text' },
            { text: 'ProductCategory', value: 'ProductCategory', dataType: 'text' },
            { text: 'SalesMan1', value: 'Agent1', dataType: 'text' },
            { text: 'SalesMan2', value: 'Agent2', dataType: 'text' },
            { text: 'SalesMAn3', value: 'Agent3', dataType: 'text' },
            { text: 'ColumnHeader', value: 'ColumnHeader', dataType: 'text' },

        ];

        //Filter Dialog Box Details 
        $scope.BranchTypeColl = [];
        $scope.VoucherTypeColl = [];
        $scope.LedgerGroupTypeColl = [];
        $scope.ExpressionColl = GlobalServices.getExpression();
        $scope.ConditionColl = GlobalServices.getLogicCondition();
        $scope.FilterColumnColl = [{ text: 'VoucherDate', value: 'VoucherDate', dataType: 'Number' },
        { text: 'VoucherName', value: 'VoucherName', dataType: 'Number' },
        { text: 'VoucherNo', value: 'VoucherNo', dataType: 'Number' },
        { text: 'AutoVoucherNo', value: 'AutoVoucherNo', dataType: 'Number' },
        { text: 'CostClassName', value: 'CostClass', dataType: 'Number' },
        { text: 'Narration', value: 'Narration', dataType: 'Number' },
        { text: 'NDay', value: 'NDay', dataType: 'Number' },
        { text: 'NMonth', value: 'NMonth', dataType: 'Number' },
        { text: 'NYear', value: 'NYear', dataType: 'Number' },
        { text: 'Particulars', value: 'Name', dataType: 'Number' },
        { text: 'RefNo', value: 'RegdNo', dataType: 'Number' },
        { text: 'UserName', value: 'Name', dataType: 'Number' },
        { text: 'VoucherName', value: 'VoucherName', dataType: 'text' },
        { text: 'DrAmount', value: 'DrAmt', dataType: 'text' },
        { text: 'CrAmount', value: 'CrAmt', dataType: 'text' },];

       


        $scope.PendingSalesQuotation = {
            DateFrom_TMP: new Date(),
            DateTo_TMP: new Date(),
            VoucherId: 0,
            IsPost: true,
            IsPendingOnly: true,
            IsClearOnly: true,
            BranchId: 0,
            ReportType: 1,
        };
        $scope.OpeningAmt = 0;
        $scope.CurrentAmt = 0;
        $scope.TotalAmt = 0;
        $scope.ReportName = '';
        $scope.noofdecimal = 2;

        $scope.loadingstatus = "stop";

        $scope.columnDefs = [
            //Added
            { headerName: "Date(A.D)", width: 130, field: "VoucherDate", dataType: 'DateTime', pinned: 'left', cellStyle: { 'text-align': 'center' } },
            { headerName: "Miti", width: 130, field: "VoucherDateBS", dataType: 'DateTime', pinned: 'left', cellStyle: { 'text-align': 'center' } },

            { headerName: "Particulars", width: 250, field: "PartyName", dataType: 'Text', pinned: 'left', cellStyle: { 'text-align': 'left' } },

            //Added
            { headerName: "Alias", width: 140, field: "Alias",dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "Quotation", width: 140, field: "Quotation", dataType: 'Text', cellStyle: { 'text-align': 'left' } },

            { headerName: "Order Qty", width: 120, field: "OrderQty", dataType: 'Number', cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },
            { headerName: "Sales Qty", width: 120, field: "SalesQty", dataType: 'Number', cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },
            { headerName: "Pending  Qty", width: 150, field: "PendingQty", dataType: 'Number', cellStyle: { 'text-align': 'right' } },
            { headerName: "Unit", width: 120, field: "Unit", dataType: 'Text', cellStyle: { 'text-align': 'left' } },

            //Added
            { headerName: "Party Name", width: 200, field: "PartyName", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "Address", width: 200, field: "Address", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "SalesMan", width: 200, field: "Agent", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "Group", width: 200, field: "Group", dataType: 'Text', cellStyle: { 'text-align': 'left' } },

            { headerName: "Product Category", width: 200, field: "ProductCategory", dataType: 'Text', cellStyle: { 'text-align': 'left' } },

            //Added
            { headerName: "Brand", width: 150, field: "Brand", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "Color", width: 150, field: "Color", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "Shape", width: 150, field: "Shape", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "Product Type", width: 150, field: "ProductType", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "Code", width: 150, field: "Code", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "Flavour", width: 150, field: "Flavour", dataType: 'Text', cellStyle: { 'text-align': 'left' } },

            //{ headerName: "Product Name", width: 250, field: "ProductName",dataType: 'Text', cellStyle: { 'text-align': 'left' }  },
            //{ headerName: "Projection Qty", width: 250, field: "QuotationQty",dataType: 'Number', cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); },   },
            //{ headerName: "Total Sales Qty", width: 250, field: "TotalSales",dataType: 'Number', cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); },    },
            //{ headerName: "SalesMan 2", width: 250, field: "Agent2",dataType: 'Text', cellStyle: { 'text-align': 'left' }  },
            //{ headerName: "SalesMan 3", width: 250, field: "Agent3",dataType: 'Text', cellStyle: { 'text-align': 'left' }  },

            
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
                    ProductName: 'Total =>',
                    SalesQty: 0,
                    QuotationQty:0,
                    OrderQty: 0,
                    TotalSales:0,


                }
                $scope.gridOptions.api.forEachNodeAfterFilterAndSort(function (node) {
                    var fData = node.data;
                    dt.SalesQty += fData.SalesQty;
                    dt.QuotationQty += fData.QuotationQty;
                    dt.OrderQty += fData.OrderQty;
                    dt.TotalSales += fData.TotalSales;
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
                QuotationQty: 0,
                OrderQty: 0,
                TotalSales: 0,
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
    $scope.GetPendingSalesQuotation = function () {

        $scope.ClearData();
        var dateFrom = new Date(($filter('date')(new Date(), 'yyyy-MM-dd')));
        var dateTo = new Date(($filter('date')(new Date(), 'yyyy-MM-dd')));

        if ($scope.PendingSalesQuotation.DateFromDet)
            dateFrom = $filter('date')($scope.PendingSalesQuotation.DateFromDet.dateAD, 'yyyy-MM-dd');

        if ($scope.PendingSalesQuotation.DateToDet)
            dateTo = $filter('date')($scope.PendingSalesQuotation.DateToDet.dateAD, 'yyyy-MM-dd');

        $scope.loadingstatus = 'running';
        showPleaseWait();

        if ($scope.PendingSalesQuotation.ReportType == 1) {
            $scope.PendingSalesQuotation.isPendingOnly = true;
            $scope.PendingSalesQuotation.isClearOnly = false;

        } else if ($scope.PendingSalesQuotation.ReportType == 2) {

            $scope.PendingSalesQuotation.isPendingOnly = false;
            $scope.PendingSalesQuotation.isClearOnly = true;
        }
        else if ($scope.PendingSalesQuotation.ReportType == 3) {

            $scope.PendingSalesQuotation.isPendingOnly = true;
            $scope.PendingSalesQuotation.isClearOnly = true;
        } else {
            $scope.PendingSalesQuotation.isPendingOnly = true;
        }

        var beData = {
            DateFrom: dateFrom,
            DateTo: dateTo,
            isPost: $scope.PendingSalesQuotation.IsPost,
            isPendingOnly: $scope.PendingSalesQuotation.isPendingOnly,
            isClearOnly: $scope.PendingSalesQuotation.isClearOnly,
            branchId: $scope.PendingSalesQuotation.BranchId
        };

        $scope.loadingstatus = 'running';

        $http({
            method: "POST",
            url: base_url + "Inventory/Reporting/GetPendingSalesQuotation",
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
                    OrderQty: DataColl.sum(p1 => p1.OrderQty),
                    QuotationQty: DataColl.sum(p1 => p1.QuotationQty),
                    TotalSales: DataColl.sum(p1 => p1.TotalSales)
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
                down_file(base_url + "//" + res.data.Data.ResponseId, "PendingSalesQuotation.xlsx");
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
