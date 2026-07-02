"use strict";

agGrid.initialiseAgGridWithAngular1(angular);

app.controller("StockTransfer", function ($scope, $http, $filter, $timeout, GlobalServices, $compile) {

  var PrintPreviewAs = 1;
    const contextMenu = GlobalServices.createElementForMenu();
    LoadData();

    $scope.onBtExportCSV = function () {
        var params = {
            fileName: 'StockTransfer.csv',
            sheetName: 'StockTransfer'
        };

        $scope.gridOptions.api.exportDataAsCsv(params);
    }

    function LoadData() {
        $('.select2').select2({
            allowClear: true,
            openOnEnter: true
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

        //agGrid.initialiseAgGridWithAngular1(angular);



        $scope.newStockTransfer = {
            /*PendingType: 1,*/
            DateFrom_TMP: new Date(),
            DateTo_TMP: new Date(),
            ShowDetails: false,
            GodownId: null
        };


        $scope.loadingstatus = "stop";

        $scope.columnDefs = [
 
            { headerName: "Voucher No.", width: 130, field: "VoucherNo", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "Voucher Name", width: 170, field: "VoucherName", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "CostClass Name", width: 180, field: "CostClassName", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "Ref.No", width: 120, field: "RefNo", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "Narration", width: 180, field: "Narration", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "Voucher Date", width: 140, field: "VoucherDate", dataType: 'DateTime', cellStyle: { 'text-align': 'center' }, valueFormatter: function (params) { return DateFormatAD(params.value); } },
            { headerName: "Voucher Miti", width: 140, field: "VoucherMiti", dataType: 'Text', cellStyle: { 'text-align': 'center' } },
            /* { headerName: "Have Document", width: 150, field: "HaveDocument", dataType: 'Text', cellStyle: { 'text-align': 'left' } },*/
            { headerName: "User Name", width: 130, field: "UserName", dataType: 'Text', cellStyle: { 'text-align': 'left' } },

            { headerName: "Source Godown", width: 180, field: "SourceGodown", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "Target Godown", width: 180, field: "TargetGodown", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "Branch", width: 140, field: "Branch", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "Product Name", width: 170, field: "ProductName", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "Unit", width: 100, field: "Unit", dataType: 'Text', cellStyle: { 'text-align': 'center' } },
            { headerName: "Qty", width: 100, field: "ActualQty", dataType: 'Number', cellStyle: { 'text-align': 'center' } },
            /* { headerName: "Billed Qty", width: 140, field: "BilledQty", dataType: 'Number', cellStyle: { 'text-align': 'left' } },*/
            { headerName: "Rate", width: 110, field: "Rate", dataType: 'Number', cellStyle: { 'text-align': 'center' } },
            { headerName: "Amount", width: 120, field: "Amount", dataType: 'Number', cellStyle: { 'text-align': 'right' } },
            //{ headerName: "Discount Per", width: 140, field: "DiscountPer", dataType: 'Number', cellStyle: { 'text-align': 'center' } },
            //{ headerName: "Discount Amt", width: 140, field: "DiscountAmt", dataType: 'Number', cellStyle: { 'text-align': 'right' } },
            //{ headerName: "Regd No.", width: 120, field: "RegdNo", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            //{ headerName: "Chassis No", width: 140, field: "ChassisNo", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            //{ headerName: "Engine No", width: 130, field: "EngineNo", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            //{ headerName: "Model", width: 130, field: "Model", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            //{ headerName: "Type", width: 130, field: "Type", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            //{ headerName: "Color", width: 130, field: "Color", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            //{ headerName: "Key No.", width: 130, field: "KeyNo", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            //{ headerName: "Code No.", width: 130, field: "CodeNo", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            //{ headerName: "MFG Year", width: 130, field: "MFGYear", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "Batch", width: 120, field: "Batch", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "MFG Date", width: 130, field: "MFGDate", dataType: 'DateTime', cellStyle: { 'text-align': 'center' }, valueFormatter: function (params) { return DateFormatAD(params.value); } },
            { headerName: "EXP Date", width: 130, field: "EXPDate", dataType: 'DateTime', cellStyle: { 'text-align': 'center' }, valueFormatter: function (params) { return DateFormatAD(params.value); } },
            { headerName: "Remarks", width: 150, field: "Remarks", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "Lot No.", width: 130, field: "LotNo", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
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
                    ActualQty: 0,
                    Amount: 0,
                }
                $scope.gridOptions.api.forEachNodeAfterFilterAndSort(function (node) {
                    var fData = node.data;
                    dt.ActualQty += fData.ActualQty;
                    dt.Amount += fData.Amount;
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
                VoucherNo: null,
                VoucherName: 'Total =>',
                ActualQty: 0,
                Amount: 0,
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

    $scope.ShowDetails = function (val) {
        for (var i = 1; i < 16; i++) {

            if (i != 2) {

                var colName = 'colBD' + i.toString();
                $scope.gridOptions.columnApi.setColumnVisible(colName, val);
            }
        }
    }

    $scope.ClearData = function () {
        var DataColl = [];
        $scope.gridOptionsBottom.api.setRowData(DataColl);
        $scope.gridOptions.api.setRowData(DataColl);
    };
    $scope.GetStockTransfer = function () {

        $scope.ClearData();
        var dateFrom = $filter('date')(new Date(), 'yyyy-MM-dd');
        var dateTo = $filter('date')(new Date(), 'yyyy-MM-dd');

        if ($scope.newStockTransfer.DateFromDet)
            dateFrom = $filter('date')($scope.newStockTransfer.DateFromDet.dateAD, 'yyyy-MM-dd');

        if ($scope.newStockTransfer.DateToDet)
            dateTo = $filter('date')($scope.newStockTransfer.DateToDet.dateAD, 'yyyy-MM-dd');

        $scope.loadingstatus = 'running';
        showPleaseWait();
         

        var beData = {            
            dateFrom: dateFrom,
            dateTo: dateTo,
            GodownId: $scope.newStockTransfer.GodownId
        };

        $scope.loadingstatus = 'running';

        $http({
            method: "post",
            url: base_url + "Inventory/Reporting/GetStocktransfer",
            data: JSON.stringify(beData),
            dataType: "json"
        }).then(function (res) {

            $scope.loadingstatus = 'stop';
            hidePleaseWait();

            if (res.data.IsSuccess && res.data.Data) {
                var DataColl = mx(res.data.Data);

                var dt = {
                    VoucherName: 'Total =>',
                    ActualQty: 0,
                    Amount: 0,
                }
                DataColl.forEach(function (fData) {                    
                    dt.ActualQty += fData.ActualQty;
                    dt.Amount += fData.Amount;
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
                down_file(base_url + "//" + res.data.Data.ResponseId, "StockTransfer.xlsx");
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