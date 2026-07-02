"use strict";

agGrid.initialiseAgGridWithAngular1(angular);

app.controller("SalesDetail", function ($scope, $http, $filter, $timeout, GlobalServices, $compile) {

    var PrintPreviewAs = 1;
    const contextMenu = GlobalServices.createElementForMenu();

    LoadData();

    $scope.onBtExportCSV = function () {
        var params = {
            fileName: 'SalesDetail.csv',
            sheetName: 'SalesDetail'
        };

        $scope.gridOptions.api.exportDataAsCsv(params);
    }
    function LoadData() {
        $('.select2').select2({
            allowClear: true,
            openOnEnter: true
        });

        $scope.PaymentModeList = [];
        $http({
            method: 'POST',
            url: base_url + "Account/Loyality/GetAllPaymentMode",
            dataType: "json",
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.PaymentModeList = res.data.Data;
            }
            else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
        // Default search model
        $scope.SalesDetail = {
            DateFrom_TMP: new Date(),
            DateTo_TMP: new Date(),
            VoucherId: 0,
            IsPost: true,
            BranchId: 0
        };

        $scope.loadingstatus = "stop";

        // Columns
        $scope.columnDefs = [
            { headerName: "Membership No", width: 150, field: "MembershipNo", pinned: 'left', dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "Customer Name", width: 220, field: "CustomerName", pinned: 'left', dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "ContactNo", width: 120, field: "ContactNo", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "Vch Date", width: 170, field: "VchDate", dataType: 'Date', cellStyle: { 'text-align': 'left' }, filter: "agDateColumnFilter" },
            { headerName: "InvoiceNo", width: 150, field: "InvoiceNo", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "Billing Type", width: 220, field: "BillingType", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "Product Group", width: 220, field: "ProductGroup", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "Product Code", width: 220, field: "ProductCode",  dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "Product Name", width: 220, field: "ProductName",  dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "Qty", width: 150, field: "Qty", dataType: 'Number', cellStyle: { 'text-align': 'center' } },
            { headerName: "Rate", width: 130, field: "Rate", dataType: 'Number', cellStyle: { 'text-align': 'center' } },
            { headerName: "Amount", width: 150, field: "Amount", dataType: 'Number', cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: p => Numberformat(p.value) },
            { headerName: "Product Discount", width: 130, field: "ProductDiscount", dataType: 'Number', cellStyle: { 'text-align': 'center' }, filter: "agNumberColumnFilter", valueFormatter: p => Numberformat(p.value) },
            { headerName: "Product Scheme", width: 130, field: "ProductScheme", dataType: 'Text', cellStyle: { 'text-align': 'center' }, filter: "agNumberColumnFilter", valueFormatter: p => Numberformat(p.value) },
            { headerName: "Discount", width: 120, field: "Discount", dataType: 'Number', cellStyle: { 'text-align': 'center' } },
            { headerName: "VAT", width: 100, field: "Vat", dataType: 'Number', cellStyle: { 'text-align': 'center' }, filter: "agNumberColumnFilter", valueFormatter: p => Numberformat(p.value) },
            { headerName: "Product Total", width: 100, field: "ProductTotal", dataType: 'Number', cellStyle: { 'text-align': 'center' }, filter: "agNumberColumnFilter", valueFormatter: p => Numberformat(p.value) },
            { headerName: "Point Value", width: 100, field: "PointValue", dataType: 'Number', cellStyle: { 'text-align': 'center' }, filter: "agNumberColumnFilter", valueFormatter: p => Numberformat(p.value) },
            { headerName: "Invoice Total", width: 140, field: "InvoiceTotal", dataType: 'Number', cellStyle: { 'text-align': 'center' }, filter: "agNumberColumnFilter", valueFormatter: p => Numberformat(p.value) },
            { headerName: "Total Credited Points", width: 170, field: "TotalCreditedPoints", dataType: 'Number', cellStyle: { 'text-align': 'left' }, filter: "agNumberColumnFilter" }
        ];

        $scope.gridOptions = {
            onCellContextMenu: onCellContextMenu,
            defaultColDef: { filter: true, resizable: true, sortable: true, width: 100 },
            enableSorting: true,
            multiSortKey: 'ctrl',
            overlayLoadingTemplate: "Please Click the Load Bottom to display the data",
            overlayNoRowsTemplate: "No Records found",
            rowSelection: 'multiple',
            columnDefs: $scope.columnDefs,
            rowData: [],
            suppressHorizontalScroll: true,
            alignedGrids: [],
            onFilterChanged: calculateBottomGridTotals
        };


        $scope.gridOptionsBottom = {
            defaultColDef: { resizable: true, width: 90 },
            columnDefs: $scope.columnDefs,
            rowData: [{ CustomerName: 'TOTAL =>' }],
            rowClass: 'bold-row',
            headerHeight: 0,
            alignedGrids: []
        };

        // Link grids
        $scope.gridOptions.alignedGrids.push($scope.gridOptionsBottom);
        $scope.gridOptionsBottom.alignedGrids.push($scope.gridOptions);

        // Initialize grids
        $scope.eGridDiv = document.querySelector('#datatable');
        new agGrid.Grid($scope.eGridDiv, $scope.gridOptions);

        $scope.gridDivBottom = document.querySelector('#myGridBottom');
        new agGrid.Grid($scope.gridDivBottom, $scope.gridOptionsBottom);

        // Restore state
        $timeout(() => {
            GlobalServices.getListState(EntityId, $scope.gridOptions);
        });
    }


    function calculateBottomGridTotals() {
        var dt = {
            CustomerName: 'TOTAL =>',
            Qty: 0,
            Rate: 0,
            Amount: 0,
            ProductDiscount: 0,
            Discount: 0,
            VAT: 0,
            ProductTotal: 0,
            PointValue: 0,
            InvoiceTotal: 0,
            TotalCreditedPoints:0
        };

        if ($scope.gridOptions.api) {
            $scope.gridOptions.api.forEachNodeAfterFilterAndSort(function (node) {
                var fData = node.data;
                if (!fData) return;
                dt.Qty += fData.Qty || 0;
                dt.Rate += fData.Rate || 0;
                dt.Amount += fData.Amount || 0;
                dt.ProductDiscount += fData.ProductDiscount || 0;
                dt.Discount += fData.Discount || 0;
                dt.VAT += fData.VAT || 0;
                dt.ProductTotal += fData.ProductTotal || 0;
                dt.PointValue += fData.PointValue || 0;
                dt.InvoiceTotal += fData.InvoiceTotal || 0;
                dt.TotalCreditedPoints += fData.TotalCreditedPoints || 0;
            });
            $scope.gridOptionsBottom.api.setRowData([dt]);
        }
    }

    // Clear both grids
    $scope.ClearData = function () {
        $scope.gridOptions.api.setRowData([]);
        $scope.gridOptionsBottom.api.setRowData([]);
    };

    // Get sales summary from server
    $scope.GetSalesDetail = function () {
        $scope.ClearData();

        var dateFrom = new Date($filter('date')(new Date(), 'yyyy-MM-dd'));
        var dateTo = new Date($filter('date')(new Date(), 'yyyy-MM-dd'));

        if ($scope.SalesDetail.DateFromDet)
            dateFrom = new Date($filter('date')($scope.SalesDetail.DateFromDet.dateAD, 'yyyy-MM-dd'));
        if ($scope.SalesDetail.DateToDet)
            dateTo = new Date($filter('date')($scope.SalesDetail.DateToDet.dateAD, 'yyyy-MM-dd'));

        $scope.loadingstatus = 'running';
        showPleaseWait();

        var beData = {
            DateFrom: dateFrom,
            DateTo: dateTo,
            BillingTypeId: $scope.SalesDetail.BillingTypeId
        };

        $http({
            method: "POST",
            url: base_url + "Account/Loyality/GetAllMemSalesDetail",
            data: JSON.stringify(beData),
            dataType: "json"
        }).then(function (res) {
            $scope.loadingstatus = 'stop';
            hidePleaseWait();

            if (res.data.IsSuccess && res.data.Data) {
                $timeout(function () {
                    $scope.gridOptions.api.setRowData(res.data.Data);
                    calculateBottomGridTotals();
                });
            } else {
                alert(res.data.ResponseMSG);
            }
        }, function (reason) {
            $scope.loadingstatus = "stop";
            alert('Failed: ' + reason);
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
                down_file(base_url + "//" + res.data.Data.ResponseId, "SalesDetail.xlsx");
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
        contextMenu.style.display = 'none';
    });

    $(document).ready(function () {
        $(this).bind("contextmenu", function (e) {
            e.preventDefault();
        });
    });
});
