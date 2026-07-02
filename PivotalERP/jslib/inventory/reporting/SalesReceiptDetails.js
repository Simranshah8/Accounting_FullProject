"use strict";

agGrid.initialiseAgGridWithAngular1(angular);

app.controller("SalesReceiptDetails", function ($scope, $http, $filter, $timeout, GlobalServices, $compile) {

  var PrintPreviewAs = 1;
    const contextMenu = GlobalServices.createElementForMenu();
    LoadData();

    $scope.onBtExportCSV = function () {
        var params = {
            fileName: 'SalesReceiptDetails.csv',
            sheetName: 'SalesReceiptDetails'
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

        //Search Drop DownList
        $scope.VoucherSearchOptions = [{ text: 'Date', value: 'VoucherDate', dataType: 'date' },
        { text: 'VoucherNo', value: 'VoucherNo', dataType: 'Number' },
        { text: 'Party', value: 'PartyName', dataType: 'text' },
        { text: 'LedgerGroup', value: 'GroupName', dataType: 'Text' },
        { text: 'Opening', value: 'OpeningAmt', dataType: 'text' },
        { text: 'Transaction Dr', value: 'DrAmt', dataType: 'Number' },
        { text: 'Transaction Cr', value: 'CrAmt', dataType: 'Number' },
        { text: 'Closing', value: 'ClosingAmt', dataType: 'Number' },
        { text: 'NetAmount', value: 'NetAmount', dataType: 'Number' },
        { text: 'Discount%', value: 'DiscountRate', dataType: 'Number' },
        { text: 'DiscountAmt', value: 'DiscountAmt', dataType: 'Number' },
        { text: 'Rec.Date', value: 'RecDate', dataType: 'Number' },
        { text: 'AfterDays', value: 'AfterDays', dataType: 'Number' },
        { text: 'Rec.Details', value: 'RecDetails', dataType: 'Number' },
        { text: 'Credit LimitDays', value: 'CreditLimitDays', dataType: 'text' },
        { text: 'Intrest active After Days', value: 'InterestActiveAfterDays', dataType: 'Number' },
        { text: 'Intrest Rate', value: 'InterestRate', dataType: 'Number' },
        { text: 'Intrest Amt', value: 'InterestAmt', dataType: 'Number' },
        { text: 'Intrest Details', value: 'InterestDetails', dataType: 'Number' },
        { text: 'Rec.Amt.Details', value: 'RecAmtDetails', dataType: 'Number' },
        { text: 'VoucherName', value: 'VoucherName', dataType: 'text' },

        ];

        //Filter Dialog Box Details 
        $scope.BranchTypeColl = [];
        $scope.VoucherTypeColl = [];
        $scope.LedgerGroupTypeColl = [];
        $scope.ExpressionColl = GlobalServices.getExpression();
        $scope.ConditionColl = GlobalServices.getLogicCondition();
        $scope.FilterColumnColl = [{ text: 'OpeningAmt', value: 'Opening', dataType: 'Number' },
        { text: 'DrAmt', value: 'DrAmt', dataType: 'Number' },
        { text: 'CrAmt', value: 'CrAmt', dataType: 'Number' },
        { text: 'ClosingAmt', value: 'ClosingAmt', dataType: 'Number' },
        { text: 'NetAmount', value: 'NetAmount', dataType: 'Number' },
        { text: 'DiscountAmt', value: 'DiscountAmt', dataType: 'Number' },
        { text: 'DiscountRate', value: 'DiscountRate', dataType: 'Number' },
        { text: 'PartyName', value: 'PartyName', dataType: 'text' },
        { text: 'LedgerName', value: 'LedgerName', dataType: 'text' },];

        $scope.LedgerGroupList = [];
        $http({
            method: 'GET',
            url: base_url + "Inventory/Reporting/GetAllLedgerGroupList",
            dataType: "json",
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.LedgerGroupList = res.data.Data;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        ///////----------End of Filter----------/////////////


        $scope.SalesReceiptDetails = {
            DateFrom_TMP: new Date(),
            DateTo_TMP: new Date(),
            VoucherId: 0,
            IsPost: true,
            LedgerGroupId: 0,
            IsClearOnly: true,
            BranchId: 0
        };
      

        $scope.loadingstatus = "stop";

        $scope.columnDefs = [

            { headerName: "Date", width: 150, field: "VoucherDate", dataType: 'DateTIme', pinned: 'left', cellStyle: { 'text-align': 'center' } },
            { headerName: "Voucher No", width: 180, field: "VoucherNo", pinned: 'left', dataType: 'Number', cellStyle: { 'text-align': 'right' } },
            { headerName: "Party", width: 120, field: "PartyName",  dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "Ledger Group", width: 250, field: "GroupName", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "Opening", width: 160, field: "OpeningAmt", dataType: 'Number', cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); },   },
            { headerName: "Transaction Dr", width: 180, field: "DrAmt", dataType: 'Text', cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); },   },
            { headerName: "Transaction Cr", width: 180, field: "CrAmt", dataType: 'Text', cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); },   },
            { headerName: "Closing", width: 120, field: "ClosingAmt", dataType: 'Text', cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); },   },
            { headerName: "Net Amount", width: 150, field: "NetAmount", dataType: 'Number', cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); },   },
            { headerName: "Discount", width: 120, field: "DiscountRate", dataType: 'Number', cellStyle: { 'text-align': 'right' } },
            { headerName: "Discount Amt", width: 180, field: "DiscountAmt", dataType: 'Number', cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); },   },
            { headerName: "Rec Date", width: 180, field: "RecDate", dataType: 'Number', cellStyle: { 'text-align': 'center' } },
            { headerName: "Rec Details", width: 180, field: "RecDetails", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "After Days", width: 180, field: "AfterDays", dataType: 'Number', cellStyle: { 'text-align': 'right' } },
            { headerName: "Credit Limit Days", width: 180, dataType: 'Number', field: "CreditLimitDays", cellStyle: { 'text-align': 'right' } },
            { headerName: "Intrest Active AfterDays", width: 250, dataType: 'Number', field: "InterestActiveAfterDays", cellStyle: { 'text-align': 'right' } },
            { headerName: "Intrest Rate", width: 180, dataType: 'Number', field: "InterestRate", cellStyle: { 'text-align': 'right' } },
            { headerName: "Intrest Amount", width: 250, dataType: 'Number', field: "InterestAmt", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); },   },
            { headerName: "Intrest Details", width: 250, dataType: 'Text', field: "InterestDetails", cellStyle: { 'text-align': 'left' } },
            { headerName: "Rec Amt Details", width: 250, dataType: 'Text', field: "RecDetails", cellStyle: { 'text-align': 'left' } },
            { headerName: "VoucherName 1", width: 200, dataType: 'Text', field: "VoucherName", cellStyle: { 'text-align': 'left' } },

            
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
                    PartyName: 'Total =>',
                    OpeningAmt: 0,
                    DrAmt: 0,
                    CrAmt: 0,
                    ClosingAmt: 0,
                    NetAmount:0,
                    DiscountAmt: 0,
                    InterestAmt:0

                }
                $scope.gridOptions.api.forEachNodeAfterFilterAndSort(function (node) {
                    var fData = node.data;
                    dt.OpeningAmt += fData.OpeningAmt;
                    dt.DrAmt += fData.DrAmt;
                    dt.CrAmt += fData.CrAmt;
                    dt.ClosingAmt += fData.ClosingAmt;
                    dt.NetAmount += fData.NetAmount;
                    dt.DiscountAmt += fData.DiscountAmt;
                    dt.InterestAmt += fData.InterestAmt;
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
                PartyName: 'Total =>',
                OpeningAmt: 0,
                DrAmt: 0,
                CrAmt: 0,
                ClosingAmt: 0,
                NetAmount: 0,
                DiscountAmt: 0,
                InterestAmt: 0
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
    $scope.GetSalesReceiptDetails = function () {

        $scope.ClearData();
        var dateFrom = new Date(($filter('date')(new Date(), 'yyyy-MM-dd')));
        var dateTo = new Date(($filter('date')(new Date(), 'yyyy-MM-dd')));

        if ($scope.SalesReceiptDetails.DateFromDet)
            dateFrom = new Date(($filter('date')($scope.SalesReceiptDetails.DateFromDet.dateAD, 'yyyy-MM-dd')));

        if ($scope.SalesReceiptDetails.DateToDet)
            dateTo = new Date(($filter('date')($scope.SalesReceiptDetails.DateToDet.dateAD, 'yyyy-MM-dd')));

        $scope.loadingstatus = 'running';
        showPleaseWait();

        var beData = {
            DateFrom: dateFrom,
            DateTo: dateTo,
            VoucherType: $scope.SalesReceiptDetails.VoucherId,
            isPost: $scope.SalesReceiptDetails.IsPost,
            ledgergroupid: $scope.SalesReceiptDetails.LedgerGroupId,
            isClearOnly: $scope.SalesReceiptDetails.IsClearOnly,
            branchId: $scope.SalesReceiptDetails.BranchId
        };

        $scope.loadingstatus = 'running';

        $http({
            method: "POST",
            url: base_url + "Inventory/Reporting/GetSalesReceiptDetails",
            data: JSON.stringify(beData),
            dataType: "json"
        }).then(function (res) {




            $scope.loadingstatus = 'stop';
            hidePleaseWait();

            if (res.data.IsSuccess && res.data.Data) {
                var DataColl = mx(res.data.Data);

                var dt = {
                    PartyName: 'TOTAL =>',
                    OpeningAmt: DataColl.sum(p1 => p1.OpeningAmt),
                    DrAmt: DataColl.sum(p1 => p1.DrAmt),
                    CrAmt: DataColl.sum(p1 => p1.CrAmt),
                    ClosingAmt: DataColl.sum(p1 => p1.ClosingAmt),
                    NetAmount: DataColl.sum(p1 => p1.NetAmount),
                    DiscountAmt: DataColl.sum(p1 => p1.DiscountAmt),
                    InterestAmt: DataColl.sum(p1 => p1.InterestAmt),
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
                down_file(base_url + "//" + res.data.Data.ResponseId, "SalesReceiptDetails.xlsx");
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
