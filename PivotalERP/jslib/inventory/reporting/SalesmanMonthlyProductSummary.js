"use strict";

agGrid.initialiseAgGridWithAngular1(angular);

app.controller("SalesmanMonthlyProductSummary", function ($scope, $http, $filter, $timeout, GlobalServices, $compile) {

  var PrintPreviewAs = 1;
    const contextMenu = GlobalServices.createElementForMenu();
    LoadData();

    $scope.onBtExportCSV = function () {
        var params = {
            fileName: 'SalesmanMonthlyProductSummary.csv',
            sheetName: 'SalesmanMonthlyProductSummary'
        };

        $scope.gridOptions.api.exportDataAsCsv(params);
    }

    function LoadData() {
        $('.select2').select2({
            allowClear: true,
            openOnEnter: true
        });


       



        $scope.SalesmanMonthlyProductSummary = {
            DateFrom_TMP: new Date(),
            DateTo_TMP: new Date(),
            VoucherId: 0,
            IsPost: true,
            BranchId: 0
        };

        $scope.loadingstatus = "stop";

        $scope.columnDefs = [
            { headerName: "Sales Man", width: 250, field: "SalesMan", pinned: 'left', dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "Product", width: 180, field: "Product", pinned: 'left', dataType: 'Text', cellStyle: { 'text-align': 'left' } },

            { headerName: "Group", width: 160, field: "Group", dataType: 'Text', cellStyle: { 'text-align': 'left' } },

            { headerName: "Unit", width: 180, field: "Unit", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "Code", width: 180, field: "Code", dataType: 'Number', cellStyle: { 'text-align': 'left' } },

            { headerName: "Categories", width: 140, field: "Categories", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "Product Type", width: 200, field: "ProductType", dataType: 'Text', cellStyle: { 'text-align': 'left' } },

            { headerName: "Brand", width: 140, field: "Brand", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "Alias", width: 140, field: "Alias", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "Baishakh", width: 140, field: "Baishakh", dataType: 'Number', cellStyle: { 'text-align': 'left' } },
            { headerName: "Jestha", width: 140, field: "Jestha", dataType: 'Number', cellStyle: { 'text-align': 'left' } },
            { headerName: "Ashadh", width: 140, field: "Ashadh", dataType: 'Number', cellStyle: { 'text-align': 'left' } },
            { headerName: "Shrawan", width: 140, field: "Shrawan", dataType: 'Number', cellStyle: { 'text-align': 'left' } },
            { headerName: "Bhadra", width: 140, field: "Bhadra", dataType: 'Number', cellStyle: { 'text-align': 'left' } },
            { headerName: "Ashwin", width: 140, field: "Ashwin", dataType: 'Number', cellStyle: { 'text-align': 'left' } },
            { headerName: "Kartik", width: 140, field: "Kartik", dataType: 'Number', cellStyle: { 'text-align': 'left' } },
            { headerName: "Mangsir", width: 140, field: "Mangsir", dataType: 'Number', cellStyle: { 'text-align': 'left' } },
            { headerName: "Poush", width: 140, field: "Poush", dataType: 'Number', cellStyle: { 'text-align': 'left' } },
            { headerName: "Magh", width: 140, field: "Magh", dataType: 'Number', cellStyle: { 'text-align': 'left' } },


            { headerName: "Falgun", width: 140, field: "Falgun", dataType: 'Number', cellStyle: { 'text-align': 'left' } },
            { headerName: "Chaitra", width: 140, field: "Chaitra", dataType: 'Number', cellStyle: { 'text-align': 'left' } },

            { headerName: "Total", width: 140, field: "Total", dataType: 'Number', cellStyle: { 'text-align': 'left' } },

            //{ headerName: "Product Group", width: 110, field: "ProductGroup", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            //{ headerName: "Product Brand", width: 110, field: "Brand", dataType: 'Text', cellStyle: { 'text-align': 'left' } },


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
                    OutQty: 0,
                    OutQty1: 0,
                    OutQty2: 0,
                    OutAmt: 0,
                    InQty: 0,
                    InQty1: 0,
                    InQty2: 0,
                    InAmt: 0,
                    BalanceQty: 0,
                    NetQty1: 0,
                    NetQty2: 0,
                    BalanceAmt: 0



                }
                $scope.gridOptions.api.forEachNodeAfterFilterAndSort(function (node) {
                    var fData = node.data;
                    dt.OutQty += fData.OutQty;
                    dt.OutQty1 += fData.OutQty1;
                    dt.OutQty2 += fData.OutQty2;
                    dt.OutAmt += fData.OutAmt;
                    dt.InQty += fData.InQty;
                    dt.InQty1 += fData.InQty1;
                    dt.InQty2 += fData.InQty2;
                    dt.InAmt += fData.InAmt;
                    dt.BalanceQty += fData.BalanceQty;
                    dt.NetQty1 += fData.NetQty1;
                    dt.NetQty2 += fData.NetQty2;
                    dt.BalanceAmt += fData.BalanceAmt;
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
                OutQty: 0,
                OutQty1: 0,
                OutQty2: 0,
                OutAmt: 0,
                InQty: 0,
                InQty1: 0,
                InQty2: 0,
                InAmt: 0,
                BalanceQty: 0,
                NetQty1: 0,
                NetQty2: 0,
                BalanceAmt: 0

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
    $scope.GetSalesmanMonthlyProductSummary = function () {
        $scope.ClearData();
        var dateFrom = new Date(($filter('date')(new Date(), 'yyyy-MM-dd')));
        var dateTo = new Date(($filter('date')(new Date(), 'yyyy-MM-dd')));

        if ($scope.SalesmanMonthlyProductSummary.DateFromDet)
            dateFrom = new Date(($filter('date')($scope.SalesmanMonthlyProductSummary.DateFromDet.dateAD, 'yyyy-MM-dd')));

        if ($scope.SalesmanMonthlyProductSummary.DateToDet)
            dateTo = new Date(($filter('date')($scope.SalesmanMonthlyProductSummary.DateToDet.dateAD, 'yyyy-MM-dd')));

        $scope.loadingstatus = 'running';
        showPleaseWait();


        var beData = {
            DateFrom: dateFrom,
            DateTo: dateTo,
            VoucherType: $scope.SalesmanMonthlyProductSummary.VoucherId,
            isPost: $scope.SalesmanMonthlyProductSummary.IsPost,
            branchId: $scope.SalesmanMonthlyProductSummary.BranchId
        };

        $scope.loadingstatus = 'running';

        $http({
            method: "POST",
            url: base_url + "Inventory/Reporting/GetSalesmanMonthlyProductSummary",
            data: JSON.stringify(beData),
            dataType: "json"
        }).then(function (res) {

            $scope.loadingstatus = 'stop';
            hidePleaseWait();

            if (res.data.IsSuccess && res.data.Data) {
                var DataColl = mx(res.data.Data);

                var dt = {
                    ProductName: 'TOTAL =>',
                    OutQty: DataColl.sum(p1 => p1.OutQty),
                    OutQty1: DataColl.sum(p1 => p1.OutQty1),
                    OutQty2: DataColl.sum(p1 => p1.OutQty2),
                    OutAmt: DataColl.sum(p1 => p1.OutAmt),
                    InQty: DataColl.sum(p1 => p1.InQty),
                    InQty1: DataColl.sum(p1 => p1.InQty1),
                    InQty2: DataColl.sum(p1 => p1.InQty2),
                    InAmt: DataColl.sum(p1 => p1.InAmt),
                    BalanceQty: DataColl.sum(p1 => p1.BalanceQty),
                    NetQty1: DataColl.sum(p1 => p1.NetQty1),
                    NetQty2: DataColl.sum(p1 => p1.NetQty2),
                    BalanceAmt: DataColl.sum(p1 => p1.BalanceAmt),
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
                down_file(base_url + "//" + res.data.Data.ResponseId, "SalesmanMonthlyProductSummary.xlsx");
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
