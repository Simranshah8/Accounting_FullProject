agGrid.initialiseAgGridWithAngular1(angular);

app.controller("PendingSalesOrder", function ($scope, $http, $filter, $timeout, GlobalServices, $compile) {

  var PrintPreviewAs = 1;
    const contextMenu = GlobalServices.createElementForMenu();
	
    LoadData();

    $scope.onBtExportCSV = function () {
        var params = {
            fileName: 'PendingSalesOrder.csv',
            sheetName: 'PendingSalesOrder'
        };

        $scope.gridOptions.api.exportDataAsCsv(params);
    }

    function LoadData() {
        $('.select2').select2()
       
        //Search Drop DownList
        $scope.VoucherSearchOptions = [{ text: 'Date(A.D)', value: 'VoucherDate', dataType: 'date' },
        { text: 'Date(B.S)', value: 'VoucherDateBS', dataType: 'date' },
        { text: 'Particulars', value: 'Name', dataType: 'text' },
        { text: 'OrderNo', value: 'VoucherNo', dataType: 'number' },
        { text: 'OrderQty', value: 'OrderQty', dataType: 'number' },
        { text: 'CancelNo', value: 'OrderCancelNo', dataType: 'Number' },
        { text: 'CancelDate', value: 'OrderCancelDate', dataType: 'date' },
        { text: 'CancelQty', value: 'OrderCancelQty1', dataType: 'Number' },
        { text: 'DispatchNo', value: 'DispatchOrderNo', dataType: 'Number' },
        { text: 'DispatchDate', value: 'DispatchOrderDate', dataType: 'date' },
        { text: 'DispatchQty', value: 'DispatchQty', dataType: 'Number' },
        { text: 'InvoiceNo', value: 'InvoiceNo', dataType: 'Number' },
        { text: 'Sales Date', value: 'SalesDate', dataType: 'date' },
        { text: 'Sales Qty', value: 'SalesQty', dataType: 'Number' },
        { text: 'Pending Qty', value: 'PendingQty', dataType: 'Number' },
        { text: 'VoucherName', value: 'VoucherName', dataType: 'text' },
        { text: 'CostClass', value: 'CostClass', dataType: 'text' },
        { text: 'Branch', value: 'Branch', dataType: 'text' },
        { text: 'PArty', value: 'Party', dataType: 'text' },
        { text: 'Address', value: 'Address', dataType: 'text' },
        { text: 'SalesMan', value: 'Agent', dataType: 'text' },
        { text: 'Group', value: 'ProductGroup', dataType: 'text' },
        { text: 'Brand', value: 'Brand', dataType: 'text' },
        { text: 'Color', value: 'Color', dataType: 'text' },
        { text: 'Shape', value: 'Shape', dataType: 'text' },

        { text: 'Unit', value: 'Unit', dataType: 'text' },
        { text: 'Alias', value: 'Alias', dataType: 'text' },
        { text: 'Code', value: 'Code', dataType: 'number' },
        { text: 'ProductType', value: 'ProductType', dataType: 'Number' },
        { text: 'OrderReturnDetails', value: 'OrderStatus', dataType: 'text' },
        { text: 'Sales Details', value: 'SalesInvoiceDetails', dataType: 'text' },
        { text: 'DispatchOrderDetials', value: 'Dispatchdetails', dataType: 'text' },
        { text: 'Flavour', value: 'Flavour', dataType: 'text' },
        { text: 'ProductCategory', value: 'ProductCategory', dataType: 'text' },
        { text: 'SalesMan1', value: 'Agent1', dataType: 'text' },
        { text: 'SalesMan2', value: 'Agent2', dataType: 'text' },
        { text: 'SalesMAn3', value: 'Agent3', dataType: 'text' },
        { text: 'ColumnHeader', value: 'ColumnHeader', dataType: 'text' },
        { text: 'Division', value: 'Division', dataType: 'text' },

        ];

        //Filter Dialog Box Details 
        $scope.BranchTypeColl = [];
        $scope.VoucherTypeColl = [];
        $scope.LedgerGroupTypeColl = [];
        $scope.ExpressionColl = GlobalServices.getExpression();
        $scope.ConditionColl = GlobalServices.getLogicCondition();
        $scope.FilterColumnColl = [{ text: 'VoucherDate', value: 'VoucherDate', dataType: 'date' },
        { text: 'VoucherName', value: 'VoucherName', dataType: 'text' },
        { text: 'VoucherNo', value: 'VoucherNo', dataType: 'Number' },
        { text: 'AutoVoucherNo', value: 'AutoVoucherNo', dataType: 'Number' },
        { text: 'CostClassName', value: 'CostClass', dataType: 'text' },
        { text: 'Narration', value: 'Narration', dataType: 'text' },
        { text: 'NDay', value: 'NDay', dataType: 'Number' },
        { text: 'NMonth', value: 'NMonth', dataType: 'Number' },
        { text: 'NYear', value: 'NYear', dataType: 'Number' },
        { text: 'Particulars', value: 'Name', dataType: 'text' },
        { text: 'RefNo', value: 'RegdNo', dataType: 'Number' },
        { text: 'UserName', value: 'Name', dataType: 'text' },
        { text: 'VoucherName', value: 'VoucherName', dataType: 'text' },
        { text: 'DrAmount', value: 'DrAmt', dataType: 'number' },
        { text: 'CrAmount', value: 'CrAmt', dataType: 'number' },];

        


        $scope.PendingSalesOrder = {
            DateFrom_TMP: new Date(),
            DateTo_TMP: new Date(),
            VoucherId: 0,
            IsPost: true,
            IsPendingOnly: true,
            IsClearOnly: true,
            BranchId: 0,
            ReportType:1,
        };
       
        $scope.loadingstatus = "stop";

        $scope.columnDefs = [

            { headerName: "Date", width: 120, field: "VoucherDate", cellStyle: { 'text-align': 'center' },dataType: 'DateTime', valueFormatter: function (params) { return DateFormatAD(params.value); }, pinned: 'left' },
            { headerName: "Miti", width: 120, field: "VoucherDateBS", cellStyle: { 'text-align': 'center' }, dataType: 'DateTime', pinned: 'left'  },
            { headerName: "Product", width: 200, field: "Name", cellStyle: { 'text-align': 'left' }, dataType: 'Text', pinned: 'left' },
            { headerName: "Party", width: 200, field: "Party", cellStyle: { 'text-align': 'left' }, dataType: 'Text' },
            { headerName: "Address", width: 200, field: "Address", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "Order No.", width: 120, field: "VoucherNo", dataType: 'Number', cellStyle: { 'text-align': 'right' }  },
            { headerName: "Order Qty", width: 130, field: "OrderQty", dataType: 'Number', cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },
            { headerName: "Rate", width: 130, field: "OrderRate", dataType: 'Number', cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },
            { headerName: "Amount", width: 130, field: "OrderAmt", dataType: 'Number', cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },
            //Added
            { headerName: "Ref. No", width: 120, field: "OrderRefNo", dataType: 'Number', cellStyle: { 'text-align': 'right' } },

            { headerName: "Cancel No", width: 120, field: "OrderCancelNo", dataType: 'Text', cellStyle: { 'text-align': 'right' } },
            { headerName: "Cancel Date", width: 130, field: "OrderCancelDate", dataType: 'DateTime', cellStyle: { 'text-align': 'center' }  },
            { headerName: "Cancel Qty", width: 120, field: "OrderCancelQtyCH", dataType: 'Number', cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); },    },
            { headerName: "Invoice No", width: 130, field: "SalesNo", dataType: 'Text', cellStyle: { 'text-align': 'right' }  },
            { headerName: "Sales Date", width: 130, field: "SalesDate", dataType: 'DateTime', cellStyle: { 'text-align': 'center' } },
            { headerName: "Delivery Qty", width: 120, field: "DeliveryQty", dataType: 'Number', cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },
            { headerName: "Sales Qty", width: 120, field: "SalesQtyCH", dataType: 'Number', cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); },    },
            { headerName: "Pending Qty", width: 130, field: "BalanceQty", dataType: 'Number', cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); },    },
            { headerName: "Unit", width: 120, field: "Unit", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "Pending Amt.", width: 130, field: "BalAmount", dataType: 'Number', cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },

            { headerName: "Alias", width: 160, field: "Alias", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "Code", width: 160, field: "Code", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "VoucherName", width: 200, field: "VoucherName", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "CostClass", width: 200, field: "CostClass", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "Branch", width: 200, field: "Branch", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "ProductGroup", width: 200, field: "ProductGroup", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "ProductType", width: 200, field: "ProductType", dataType: 'Text', cellStyle: { 'text-align': 'left' } },

            { headerName: "Brand", width: 150, field: "Brand", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "Color", width: 130, field: "Color", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "Shape", width: 130, field: "Shape", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "Flavour", width: 150, field: "Flavour", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
           
            { headerName: "Product Category", width: 200, field: "ProductCategory", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "DSE", field: "DI_Name", width: 130, dataType: 'Text', filter: "agTextColumnFilter", },
            { headerName: "SO", field: "SO_Name", width: 130, dataType: 'Text', filter: "agTextColumnFilter", },
            { headerName: "ASM", field: "ASM_Name", width: 130, dataType: 'Text', filter: "agTextColumnFilter", },
            { headerName: "RSM", field: "RSM_Name", width: 130, dataType: 'Text', filter: "agTextColumnFilter", },
            { headerName: "NSM", field: "NSM_Name", width: 130, dataType: 'Text', filter: "agTextColumnFilter", },
            { headerName: "SD", field: "SD_Name", width: 130, dataType: 'Text', filter: "agTextColumnFilter", },
            { headerName: "MD", field: "MD_Name", width: 130, dataType: 'Text', filter: "agTextColumnFilter", },

            
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
                    SalesQtyCH: 0,
                    OrderQty: 0,
                    BalanceQty: 0,
                    OrderCancelQtyCH:0,
                }
                $scope.gridOptions.api.forEachNodeAfterFilterAndSort(function (node) {
                    var fData = node.data;
                    dt.SalesQtyCH += fData.SalesQtyCH;
                    dt.OrderQty += fData.OrderQty;
                    dt.BalanceQty += fData.BalanceQty;
                    dt.OrderCancelQtyCH += fData.OrderCancelQtyCH;
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
                SalesQty: 0,
                OrderQty: 0,
                BalanceQty: 0,
                OrderCancelQty1: 0,
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
    $scope.GetPendingSalesOrder = function () {
        $scope.ClearData();
        var dateFrom = new Date(($filter('date')(new Date(), 'yyyy-MM-dd')));
        var dateTo = new Date(($filter('date')(new Date(), 'yyyy-MM-dd')));

        if ($scope.PendingSalesOrder.DateFromDet)
            dateFrom =$filter('date')($scope.PendingSalesOrder.DateFromDet.dateAD, 'yyyy-MM-dd');

        if ($scope.PendingSalesOrder.DateToDet)
            dateTo = $filter('date')($scope.PendingSalesOrder.DateToDet.dateAD, 'yyyy-MM-dd');

        $scope.loadingstatus = 'running';
        showPleaseWait();

        if ($scope.PendingSalesOrder.ReportType == 1) {
            $scope.PendingSalesOrder.isPendingOnly = true;
            $scope.PendingSalesOrder.isClearOnly = false;

        } else if ($scope.PendingSalesOrder.ReportType == 2) {

            $scope.PendingSalesOrder.isPendingOnly = false;
            $scope.PendingSalesOrder.isClearOnly = true;
        }
        else if ($scope.PendingSalesOrder.ReportType == 3) {

            $scope.PendingSalesOrder.isPendingOnly = true;
            $scope.PendingSalesOrder.isClearOnly = true;
        } else {
            $scope.PendingSalesOrder.isPendingOnly = true;
        }

        var beData = {
            DateFrom: dateFrom,
            DateTo: dateTo,            
            isPost: $scope.PendingSalesOrder.IsPost,
            isPendingOnly: $scope.PendingSalesOrder.isPendingOnly,
            isClearOnly: $scope.PendingSalesOrder.isClearOnly,
            branchId: $scope.PendingSalesOrder.BranchId
        };

        $scope.loadingstatus = 'running';

        $http({
            method: "POST",
            url: base_url + "Inventory/Reporting/GetPendingSalesOrder",
            data: JSON.stringify(beData),
            dataType: "json"
        }).then(function (res) {

            $scope.loadingstatus = 'stop';
            hidePleaseWait();

            if (res.data.IsSuccess && res.data.Data) {
                var DataColl = res.data.Data;

                var dt = {
                    VoucherName: 'Total =>',
                    SalesQtyCH: 0,
                    OrderQty: 0,
                    BalanceQty: 0,
                    OrderCancelQtyCH: 0,
                }

                angular.forEach(DataColl, function (fData) {
                    dt.SalesQtyCH += fData.SalesQtyCH;
                    dt.OrderQty += fData.OrderQty;
                    dt.BalanceQty += fData.BalanceQty;
                    dt.OrderCancelQtyCH += fData.OrderCancelQtyCH;
                });
                  
                var filterDataColl = [];
                filterDataColl.push(dt);

                $scope.gridOptionsBottom.api.setRowData(filterDataColl);

                $scope.gridOptions.api.setRowData(DataColl);
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
                down_file(base_url + "//" + res.data.Data.ResponseId, "PendingSalesOrder.xlsx");
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
