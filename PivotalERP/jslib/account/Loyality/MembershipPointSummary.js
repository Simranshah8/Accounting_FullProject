"use strict";

agGrid.initialiseAgGridWithAngular1(angular);

app.controller("MemPointSummary", function ($scope, $http, $filter, $timeout, GlobalServices, $compile) {

    var PrintPreviewAs = 1;
    const contextMenu = GlobalServices.createElementForMenu();

    LoadData();

    $scope.onBtExportCSV = function () {
        var params = {
            fileName: 'MemPointSummary.csv',
            sheetName: 'MemPointSummary'
        };

        $scope.gridOptions.api.exportDataAsCsv(params);
    }
    function LoadData() {
        $('.select2').select2({
            allowClear: true,
            openOnEnter: true
        });

        // Default search model
        $scope.MemPointSummary = {
            DateFrom_TMP: new Date(),
            DateTo_TMP: new Date(),           
            IsOpeningCredit: true
        };

        $scope.loadingstatus = "stop";

        // Columns
        $scope.columnDefs = [
            { headerName: "Membership No", width: 150, field: "MembershipNo", pinned: 'left', dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "Customer Name", width: 220, field: "CustomerName", pinned: 'left', dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "ContactNo", width: 120, field: "ContactNo", dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "Opening Point", width: 150, field: "OpeningPoint", dataType: 'Number', cellStyle: { 'text-align': 'center' } },
            { headerName: "Total Sales", width: 150, field: "TotalSales", dataType: 'Number', cellStyle: { 'text-align': 'center' } },
            { headerName: "Points Gained", width: 150, field: "PointsGained", dataType: 'Number', cellStyle: { 'text-align': 'center' } },
            { headerName: "Sales Return", width: 150, field: "SalesReturn", dataType: 'Number', cellStyle: { 'text-align': 'center' } },
            { headerName: "Points Deducted", width: 150, field: "PointsDeducted", dataType: 'Number', cellStyle: { 'text-align': 'center' } },
            { headerName: "Coupon Sales", width: 150, field: "CouponSales", dataType: 'Number', cellStyle: { 'text-align': 'center' } },
            { headerName: "Points Deducted", width: 150, field: "PointsDeducted", dataType: 'Number', cellStyle: { 'text-align': 'center' } },
            { headerName: "Total Point", width: 150, field: "TotalPoint", dataType: 'Number', cellStyle: { 'text-align': 'center' } },
            { headerName: "Active Member", width: 150, field: "ActiveMember", dataType: 'Text', cellStyle: { 'text-align': 'center' } },
            { headerName: "Registration Date", width: 170, field: "RegistrationMiti", dataType: 'Date', cellStyle: { 'text-align': 'left' }, filter: "agDateColumnFilter" },
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
            OpeningPoint: 0,
            TotalSales: 0,
            PointsGained: 0,
            SalesReturn: 0,
            PointsDeducted: 0,
            CouponSales: 0,
            PointsDeducted: 0,
            TotalPoint: 0,
           
        };

        if ($scope.gridOptions.api) {
            $scope.gridOptions.api.forEachNodeAfterFilterAndSort(function (node) {
                var fData = node.data;
                if (!fData) return;
                dt.OpeningPoint += fData.OpeningPoint || 0;
                dt.TotalSales += fData.TotalSales || 0;
                dt.PointsGained += fData.PointsGained || 0;
                dt.SalesReturn += fData.SalesReturn || 0;
                dt.PointsDeducted += fData.PointsDeducted || 0;
                dt.CouponSales += fData.CouponSales || 0;
                dt.PointsDeducted += fData.PointsDeducted || 0;
                dt.TotalPoint += fData.TotalPoint || 0;
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
    $scope.GetMemPointSummary = function () {
        $scope.ClearData();

        var dateFrom = new Date($filter('date')(new Date(), 'yyyy-MM-dd'));
        var dateTo = new Date($filter('date')(new Date(), 'yyyy-MM-dd'));

        if ($scope.MemPointSummary.DateFromDet)
            dateFrom = new Date($filter('date')($scope.MemPointSummary.DateFromDet.dateAD, 'yyyy-MM-dd'));
        if ($scope.MemPointSummary.DateToDet)
            dateTo = new Date($filter('date')($scope.MemPointSummary.DateToDet.dateAD, 'yyyy-MM-dd'));

        $scope.loadingstatus = 'running';
        showPleaseWait();

        var beData = {
            DateFrom: dateFrom,
            DateTo: dateTo,
            IsOpeningCredit: $scope.MemPointSummary.IsOpeningCredit
        };

        $http({
            method: "POST",
            url: base_url + "Account/Loyality/GetAllMemPointSummary",
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
                down_file(base_url + "//" + res.data.Data.ResponseId, "MemPointSummary.xlsx");
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
