"use strict";

agGrid.initialiseAgGridWithAngular1(angular);

app.controller("PendingDeliveryNote", function ($scope, $http, $filter, $timeout, GlobalServices, $compile) {

  var PrintPreviewAs = 1;
    const contextMenu = GlobalServices.createElementForMenu();
	
    LoadData();

    $scope.onBtExportCSV = function () {
        var params = {
            fileName: 'PendingDeliveryNote.csv',
            sheetName: 'PendingDeliveryNote'
        };

        $scope.gridOptions.api.exportDataAsCsv(params);
    }

    function LoadData() {
        $('.select2').select2({
            allowClear: true,
            openOnEnter: true
        });
        $scope.ReportTypeColl = [{ id: 0, text: 'PendingOnly', value: 'PendingOnly', dataType: 'text' }, { id: 1, text: 'ClearOnly', value: 'ClearOnly', dataType: 'text' }, { id: 2,text: 'Both', value: 'Both', dataType: 'text' },]

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

        $scope.PendingDeliveryNote = {
            DateFrom_TMP: new Date(),
            DateTo_TMP: new Date(),
            VoucherId: 0,
            IsPost: true,
            BranchId: 0,
            ReportType: 0,
            BatchWise:false,
        };


        GlobalServices.getCompanyDet().then(function (res) {
            var comDet = res.data.Data;
            if (comDet) {
                $scope.PendingDeliveryNote.DateFrom_TMP = new Date(comDet.StartDate);
            }
        }, function (errormessage) {
            alert('Unable to Delete data. pls try again.' + errormessage.responseText);
        });

        $scope.loadingstatus = "stop";

        $scope.columnDefs = [
            {
                headerName: "Date(A.D.)", width: 140, pinned: 'left', field: "VoucherDate", dataType: 'DateTime', cellRenderer: 'agGroupCellRenderer',
                valueFormatter: function (params) { return DateFormatAD(params.value); },
                showRowGroup: true, cellStyle: { 'text-align': 'center' },
                cellRendererParams: {
                    suppressCount: false, // turn off the row count                   
                }
            },
            {
                headerName: "Miti", width: 140, pinned: 'left', field: "VoucherDateBS", dataType: 'DateTime', cellRenderer: 'agGroupCellRenderer',
                valueFormatter: function (params) { return DateFormatBS(params.value); },
                showRowGroup: true, cellStyle: { 'text-align': 'center' },
                cellRendererParams: {
                    suppressCount: false, // turn off the row count                   
                }
            },
            { headerName: "Product", width: 160, pinned: 'left', field: "Name", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "Party", width: 150, field: "Party", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "Address", width: 150, field: "Address", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "Age", width: 120, field: "Days", dataType: 'Number', cellStyle: { 'text-align': 'left' } },
            //Added
            { headerName: "Alias", width: 120, field: "Alias", dataType: 'Text', cellStyle: { 'text-align': 'left' } },

            { headerName: "IssuesNo", width: 150, field: "VoucherNo", dataType: 'Text', cellStyle: { 'text-align': 'right' } },
            { headerName: "IssuesQty", width: 150, field: "IssuesQty", dataType: 'Number', cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },
            { headerName: "ReturnNo", width: 150, field: "IssuesReturnNo", dataType: 'Number', cellStyle: { 'text-align': 'right' }, },
            { headerName: "ReturnDate", width: 150, field: "IssuesReturnDate", dataType: 'DateTime', cellStyle: { 'text-align': 'center' } },
            { headerName: "ReturnQty", width: 150, field: "IssuesReturnQty", dataType: 'Number', cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },
            { headerName: "SalesDate", width: 120, field: "SalesDate", dataType: 'DateTime', cellStyle: { 'text-align': 'center' } },
            { headerName: "InvoiceNo", width: 120, field: "SalesNo", dataType: 'Text', cellStyle: { 'text-align': 'right' } },
            { headerName: "SalesQty", width: 150, field: "SalesQty", dataType: 'Number', cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },
            { headerName: "PendingQty", width: 150, field: "BalanceQty", dataType: 'Number', cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },
            { headerName: "ConsumptionNo", width: 150, field: "ConsumptionNo", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "ConsumptionQty", width: 150, field: "ConsumptionQty", dataType: 'Number', cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },
            { headerName: "ConsumptionDetails", width: 180, field: "ConsumptionDetails", dataType: 'Text', cellStyle: { 'text-align': 'left' } },

            { headerName: "Voucher Name", width: 150, field: "VoucherName", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "CostClass", width: 150, field: "CostClass", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "Branch", width: 150, field: "Branch", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "Agent", width: 150, field: "Agent", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
             
            
            { headerName: "Product Group", width: 150, field: "ProductGroup", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "Product Type", width: 150, field: "ProductType", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "Brand", width: 150, field: "Brand", dataType: 'Text', cellStyle: { 'text-align': 'left' } },

            { headerName: "Batch No.", width: 140, colId: 'batDet1', field: "Batch", cellStyle: { 'text-align': 'left' }, hide: true, },
            { headerName: "Engine No.", width: 140, colId: 'colEngineNo', field: "EngineNo", cellStyle: { 'text-align': 'left' }, hide: true, },

            ////Added cols for MVDugar
            //{ headerName: "VoucherName", width: 180, field: "VoucherName", dataType: 'Text', cellStyle: { 'text-align': 'right' } },
            //{ headerName: "Branch", width: 180, field: "Branch", dataType: 'Text', cellStyle: { 'text-align': 'right' } },
            //{ headerName: "Rate", width: 180, field: "Rate", dataType: 'Text', cellStyle: { 'text-align': 'right' } },
            //{ headerName: "Party", width: 180, field: "Party", dataType: 'Text', cellStyle: { 'text-align': 'right' } },
            //{ headerName: "Age", width: 180, field: "Age", dataType: 'Text', cellStyle: { 'text-align': 'right' } },
            //{ headerName: "Chassis No", width: 180, field: "ChassisNo", dataType: 'Text', cellStyle: { 'text-align': 'right' } },
            //{ headerName: "Code", width: 180, field: "Code", dataType: 'Text', cellStyle: { 'text-align': 'right' } },
            //{ headerName: "EngineNo", width: 180, field: "EngineNo", dataType: 'Text', cellStyle: { 'text-align': 'right' } },
            //{ headerName: "Issues ReturnDetails", width: 180, field: "IssuesReturnDetails", dataType: 'Text', cellStyle: { 'text-align': 'right' } },
            //{ headerName: "Ref. No.", width: 180, field: "RefNo", dataType: 'Text', cellStyle: { 'text-align': 'right' } },
            //{ headerName: "Regd No", width: 180, field: "RegdNo", dataType: 'Text', cellStyle: { 'text-align': 'right' } },
            //{ headerName: "Sales Detail", width: 180, field: "SalesDetail", dataType: 'Text', cellStyle: { 'text-align': 'right' } },
            //{ headerName: "Sales Return Detail", width: 180, field: "SalesReturnDetail", dataType: 'Text', cellStyle: { 'text-align': 'right' } },
            //{ headerName: "Vin No", width: 180, field: "VinNo", dataType: 'Text', cellStyle: { 'text-align': 'right' } },
            //{ headerName: "Cost Class", width: 180, field: "CostClass", dataType: 'Text', cellStyle: { 'text-align': 'right' } },
            //{ headerName: "Address", width: 180, field: "Address", dataType: 'Text', cellStyle: { 'text-align': 'right' } },
            //{ headerName: "Salesman", width: 180, field: "Salesman", dataType: 'Text', cellStyle: { 'text-align': 'right' } },
            //{ headerName: "Group", width: 180, field: "Group", dataType: 'Text', cellStyle: { 'text-align': 'right' } },

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
                    Name: 'Total =>',
                    IssuesQty: 0,
                    IssuesReturnQty: 0,
                    SalesQty: 0,
                    BalanceQty: 0,
                    ConsumptionQty: 0



                }
                $scope.gridOptions.api.forEachNodeAfterFilterAndSort(function (node) {
                    var fData = node.data;
                    dt.IssuesQty += fData.IssuesQty;
                    dt.IssuesReturnQty += fData.IssuesReturnQty;
                    dt.SalesQty += fData.SalesQty;
                    dt.BalanceQty += fData.BalanceQty;
                    dt.ConsumptionQty += fData.ConsumptionQty;
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
                Name: 'Total =>',
                IssuesQty: 0,
                IssuesReturnQty: 0,
                SalesQty: 0,
                BalanceQty: 0,
                ConsumptionQty: 0
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
    $scope.GetPendingDeliveryNote = function () {


        $scope.ClearData();
        var dateFrom = $filter('date')(new Date(), 'yyyy-MM-dd');
        var dateTo = $filter('date')(new Date(), 'yyyy-MM-dd');

        if ($scope.PendingDeliveryNote.DateFromDet)
            dateFrom =($filter('date')($scope.PendingDeliveryNote.DateFromDet.dateAD, 'yyyy-MM-dd'));

        if ($scope.PendingDeliveryNote.DateToDet)
            dateTo = ($filter('date')($scope.PendingDeliveryNote.DateToDet.dateAD, 'yyyy-MM-dd'));

        $scope.loadingstatus = 'running';
        showPleaseWait();

        var val = $scope.PendingDeliveryNote.BatchWise;
        for (var i = 1; i < 2; i++) {
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


        var beData = {
            dateFrom: dateFrom,
            dateTo: dateTo,
            reportType: $scope.PendingDeliveryNote.ReportType,
            branchIdColl: ($scope.PendingDeliveryNote.BranchId ? $scope.PendingDeliveryNote.BranchId : ''),
            ShowBatchWise:$scope.PendingDeliveryNote.BatchWise,
        };

        $scope.loadingstatus = 'running';

        $http({
            method: "post",
            url: base_url + "Inventory/Reporting/GetPendingDeliveryNote",
            data: JSON.stringify(beData),
            dataType: "json"
        }).then(function (res) {

            $scope.loadingstatus = 'stop';
            hidePleaseWait();

            if (res.data.IsSuccess && res.data.Data) {
                var DataColl = mx(res.data.Data);

                var dt = {
                    Name: 'TOTAL =>',
                    IssuesQty: DataColl.sum(p1 => p1.IssuesQty),
                    IssuesReturnQty: DataColl.sum(p1 => p1.IssuesReturnQty),
                    SalesQty: DataColl.sum(p1 => p1.SalesQty),
                    ConsumptionQty: DataColl.sum(p1 => p1.ConsumptionQty),
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
                down_file(base_url + "//" + res.data.Data.ResponseId, "PendingDeliveryNote.xlsx");
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
