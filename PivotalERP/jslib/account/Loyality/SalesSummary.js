"use strict";

agGrid.initialiseAgGridWithAngular1(angular);

app.controller("SalesSummary", function ($scope, $http, $filter, $timeout, GlobalServices, $compile) {

    var PrintPreviewAs = 1;
    const contextMenu = GlobalServices.createElementForMenu();

    LoadData();

    $scope.onBtExportCSV = function () {
        var params = {
            fileName: 'SalesSummary.csv',
            sheetName: 'SalesSummary'
        };

        $scope.gridOptions.api.exportDataAsCsv(params);
    }
    function LoadData() {
        $('.select2').select2({
            allowClear: true,
            openOnEnter: true
        });

        // Default search model
        $scope.SalesSummary = {
            DateFrom_TMP: new Date(),
            DateTo_TMP: new Date(),
            VoucherId: 0,
            IsPost: true,
            BranchId: 0
        };

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
        $scope.loadingstatus = "stop";

        // Columns
        $scope.columnDefs = [
            { headerName: "MembershipNo", width: 150, field: "MembershipNo", pinned: 'left', dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "CustomerName", width: 220, field: "CustomerName", pinned: 'left', dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "ContactNo", width: 120, field: "ContactNo", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "OpeningPoints", width: 150, field: "OpeningPoints", dataType: 'Number', cellStyle: { 'text-align': 'center' } },
            { headerName: "TotalSales", width: 130, field: "TotalSales", dataType: 'Number', cellStyle: { 'text-align': 'center' } },
            { headerName: "DiscountTotal", width: 150, field: "DiscountTotal", dataType: 'Number', cellStyle: { 'text-align': 'center' }, filter: "agNumberColumnFilter", valueFormatter: p => Numberformat(p.value) },
            { headerName: "NetSales", width: 130, field: "NetSales", dataType: 'Number', cellStyle: { 'text-align': 'center' }, filter: "agNumberColumnFilter", valueFormatter: p => Numberformat(p.value) },
            { headerName: "NoOfInvoice", width: 130, field: "NoOfInvoice", dataType: 'Number', cellStyle: { 'text-align': 'center' }, filter: "agNumberColumnFilter", valueFormatter: p => Numberformat(p.value) },
            { headerName: "CreditedPoints", width: 150, field: "CreditedPoints", dataType: 'Number', cellStyle: { 'text-align': 'center' } },
            { headerName: "TotalPoints", width: 130, field: "TotalPoints", dataType: 'Number', cellStyle: { 'text-align': 'center' }, filter: "agNumberColumnFilter", valueFormatter: p => Numberformat(p.value) },
            { headerName: "ActiveMember", width: 140, field: "ActiveMember", dataType: 'Number', cellStyle: { 'text-align': 'center' }, filter: "agNumberColumnFilter", valueFormatter: p => Numberformat(p.value) },
            { headerName: "RegistrationDate", width: 170, field: "RegistrationMiti", dataType: 'Date', cellStyle: { 'text-align': 'left' }, filter: "agDateColumnFilter" }
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
            OpeningPoints: 0,
            TotalSales: 0,
            DiscountTotal: 0,
            NetSales: 0,
            NoOfInvoice: 0,
            CreditedPoints: 0,
            TotalPoints: 0,
            ActiveMember: 0
        };

        if ($scope.gridOptions.api) {
            $scope.gridOptions.api.forEachNodeAfterFilterAndSort(function (node) {
                var fData = node.data;
                if (!fData) return;
                dt.OpeningPoints += fData.OpeningPoints || 0;
                dt.TotalSales += fData.TotalSales || 0;
                dt.DiscountTotal += fData.DiscountTotal || 0;
                dt.NetSales += fData.NetSales || 0;
                dt.NoOfInvoice += fData.NoOfInvoice || 0;
                dt.CreditedPoints += fData.CreditedPoints || 0;
                dt.TotalPoints += fData.TotalPoints || 0;
                dt.ActiveMember += fData.ActiveMember || 0;
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
    $scope.GetSalesSummary = function () {
        $scope.ClearData();

        var dateFrom = new Date($filter('date')(new Date(), 'yyyy-MM-dd'));
        var dateTo = new Date($filter('date')(new Date(), 'yyyy-MM-dd'));

        if ($scope.SalesSummary.DateFromDet)
            dateFrom = new Date($filter('date')($scope.SalesSummary.DateFromDet.dateAD, 'yyyy-MM-dd'));
        if ($scope.SalesSummary.DateToDet)
            dateTo = new Date($filter('date')($scope.SalesSummary.DateToDet.dateAD, 'yyyy-MM-dd'));

        $scope.loadingstatus = 'running';
        showPleaseWait();

        var beData = {
            DateFrom: dateFrom,
            DateTo: dateTo,
            BillingTypeId: $scope.SalesSummary.BillingTypeId,
            IsOpenPoint: $scope.SalesSummary.IsOpenPoint
        };

        $http({
            method: "POST",
            url: base_url + "Account/Loyality/GetAllMemSalesSummary",
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
                down_file(base_url + "//" + res.data.Data.ResponseId, "SalesSummary.xlsx");
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
