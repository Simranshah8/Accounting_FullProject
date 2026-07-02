"use strict";

agGrid.initialiseAgGridWithAngular1(angular);

app.controller("PendingDispatchSection", function ($scope, $http, $filter, $timeout, GlobalServices, $compile) {

  var PrintPreviewAs = 1;
    const contextMenu = GlobalServices.createElementForMenu();
	
    LoadData();

    $scope.onBtExportCSV = function () {
        var params = {
            fileName: 'PendingDispatchSection.csv',
            sheetName: 'PendingDispatchSection'
        };

        $scope.gridOptions.api.exportDataAsCsv(params);
    }

    function LoadData() {
        $('.select2').select2({
            allowClear: true,
            openOnEnter: true
        });


        //Search Drop DownList
        $scope.VoucherSearchOptions = [{ text: 'Date(A.D)', value: 'VoucherDate', dataType: 'date' },
        { text: 'Date(B.S)', value: 'VoucherDateBS', dataType: 'date' },
        { text: 'Particulars', value: 'Name', dataType: 'text' },
        { text: 'DispatchNo', value: 'DispatchOrderNo', dataType: 'Number' },
        { text: 'DispatchDate', value: 'DispatchOrderDate', dataType: 'date' },
        { text: 'DispatchQty', value: 'DispatchQty', dataType: 'Number' },
        { text: 'DeliveryNo', value: 'DeliveryNoteNo', dataType: 'Number' },
        { text: 'DeliveryDate', value: 'DeliveryNoteDate', dataType: 'date' },
        { text: 'DeliveryQty', value: 'DeliveryQty', dataType: 'Number' },
        { text: 'InvoiceNo', value: 'InvoiceNo', dataType: 'Number' },
        { text: 'SalesDate', value: 'SalesDate', dataType: 'date' },
        { text: 'SalesQty', value: 'SalesQty', dataType: 'Number' },
        { text: 'PendingQty', value: 'PendingQty', dataType: 'Number' },
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
        { text: 'Alias', value: 'Alias', dataType: 'text' },
        { text: 'Code', value: 'Code', dataType: 'number' },
        { text: 'ProductType', value: 'ProductType', dataType: 'text' },
        { text: 'SalesDetails', value: 'SalesInvoiceDetails', dataType: 'text' },
        { text: 'DispatchOrderDetials', value: 'Dispatchdetails', dataType: 'text' },
        { text: 'Flavour', value: 'Flavour', dataType: 'text' },
        { text: 'ProductCategory', value: 'ProductCategory', dataType: 'text' },
        { text: 'Agent1', value: 'Agent1', dataType: 'text' },
        { text: 'Agent2', value: 'Agent2', dataType: 'text' },
        { text: 'Agent3', value: 'Agent3', dataType: 'text' },
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

        //For user list branchList Ledgerlist in filter
        $scope.LedgerList = [];
        $http({
            method: 'GET',
            url: base_url + "Inventory/Reporting/GetAllLedgerList",
            dataType: "json",
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.LedgerList = res.data.Data;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        $scope.VoucherList = [];
        $http({
            method: 'GET',
            url: base_url + "Inventory/Reporting/GetAllVoucherList",
            dataType: "json",
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.VoucherList = res.data.Data;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
        $scope.BranchList = [];
        $http({
            method: 'GET',
            url: base_url + "Setup/Security/GetAllBranchList",
            dataType: "json",
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.BranchList = res.data.Data;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
        $scope.UserList = [];
        $http({
            method: 'GET',
            url: base_url + "Setup/Security/GetAllUserList",
            dataType: "json",
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.UserList = res.data.Data;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });


        ///////----------End of Filter----------/////////////


        $scope.PendingDispatchSection = {
            DateFrom_TMP: new Date(),
            DateTo_TMP: new Date(),
            VoucherId: 0,
            IsPost: true,
            IsPendingOnly: true,
            IsClearOnly: true,
            BranchId: 0
        };


        $scope.loadingstatus = "stop";

        $scope.columnDefs = [

            { headerName: "Date(A.D)", width: 180, dataType: 'DateTime',  pinned: 'left', field: "VoucherDate", cellStyle: { 'text-align': 'center' } },
            { headerName: "Miti", width: 180, dataType: 'DateTime', pinned: 'left', field: "VoucherDateBS", cellStyle: { 'text-align': 'center' } },
            { headerName: "Particulars", dataType: 'Text', pinned: 'left', width: 250, field: "Name", cellStyle: { 'text-align': 'left' } },
            { headerName: "Invoice No.", dataType: 'Number', width: 250, field: "AutoVoucherNo", cellStyle: { 'text-align': 'right' } },
            { headerName: "Sales Date", dataType: 'DateTime', width: 180, field: "SalesDate", cellStyle: { 'text-align': 'center' } },
            { headerName: "Sales Qty", dataType: 'Number', width: 180, field: "SalesQty", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },
            { headerName: "Pending Qty", dataType: 'Number', width: 180, field: "DispatchQty", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },
            { headerName: "Product Category", dataType: 'Text', width: 200, field: "ProductCategory", cellStyle: { 'text-align': 'left' } },
            { headerName: "Agent 1", width: 140, dataType: 'Text', field: "Agent1", cellStyle: { 'text-align': 'left' } },
            { headerName: "Agent 2", width: 140, dataType: 'Text', field: "Agent2", cellStyle: { 'text-align': 'left' } },
            { headerName: "Agent 3", width: 140, dataType: 'Text', field: "Agent3", cellStyle: { 'text-align': 'left' } },


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
                    SalesQty: 0,
                    DispatchQty: 0


                }
                $scope.gridOptions.api.forEachNodeAfterFilterAndSort(function (node) {
                    var fData = node.data;
                    dt.SalesQty += fData.SalesQty;
                    dt.DispatchQty += fData.DispatchQty
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
                SalesQty: 0,
                DispatchQty: 0
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
    $scope.GetPendingDispatchSection = function () {

        $scope.ClearData();
        var dateFrom = new Date(($filter('date')(new Date(), 'yyyy-MM-dd')));
        var dateTo = new Date(($filter('date')(new Date(), 'yyyy-MM-dd')));

        if ($scope.PendingDispatchSection.DateFromDet)
            dateFrom = new Date(($filter('date')($scope.PendingDispatchSection.DateFromDet.dateAD, 'yyyy-MM-dd')));

        if ($scope.PendingDispatchSection.DateToDet)
            dateTo = new Date(($filter('date')($scope.PendingDispatchSection.DateToDet.dateAD, 'yyyy-MM-dd')));

        $scope.loadingstatus = 'running';
        showPleaseWait();

        var beData = {
            DateFrom: dateFrom,
            DateTo: dateTo,
            VoucherType: $scope.PendingDispatchSection.VoucherId,
            isPost: $scope.PendingDispatchSection.IsPost,
            isPendingOnly: $scope.PendingDispatchSection.IsPendingOnly,
            isClearOnly: $scope.PendingDispatchSection.IsClearOnly,
            branchId: $scope.PendingDispatchSection.BranchId
        };

        $scope.loadingstatus = 'running';

        $http({
            method: "POST",
            url: base_url + "Inventory/Reporting/GetPendingDispatchSection",
            data: JSON.stringify(beData),
            dataType: "json"
        }).then(function (res) {


            $scope.loadingstatus = 'stop';
            hidePleaseWait();

            if (res.data.IsSuccess && res.data.Data) {
                var DataColl = mx(res.data.Data);

                var dt = {
                    Name: 'TOTAL =>',
                    SalesQty: DataColl.sum(p1 => p1.SalesQty),
                    DispatchQty: DataColl.sum(p1 => p1.DispatchQty)
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
                down_file(base_url + "//" + res.data.Data.ResponseId, "PendingDispatchSection.xlsx");
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
