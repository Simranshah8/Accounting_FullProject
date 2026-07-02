"use strict";

agGrid.initialiseAgGridWithAngular1(angular);

app.controller("MembershipLedger", function ($scope, $http, $filter, $timeout, GlobalServices, $compile) {

    var PrintPreviewAs = 1;
    const contextMenu = GlobalServices.createElementForMenu();

    LoadData();

    $scope.onBtExportCSV = function () {
        var params = {
            fileName: 'MembershipLedger.csv',
            sheetName: 'MembershipLedger'
        };

        $scope.gridOptions.api.exportDataAsCsv(params);
    }
    function LoadData() {
        $('.select2').select2({
            allowClear: true,
            openOnEnter: true
        });

        // Default search model
        $scope.MembershipLedger = {
            DateFrom_TMP: new Date(),
            DateTo_TMP: new Date(),
            MembershipLedgerId: null
           
        };

        $scope.loadingstatus = "stop";

        // Columns
        $scope.columnDefs = [
            { headerName: "Date", width: 110, field: "VoucherDate", pinned: 'left', dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "Miti", width: 110, field: "VoucherMiti", pinned: 'left', dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "Particulars", width: 170, field: "Particulars", pinned: 'left', dataType: 'Text', cellStyle: { 'text-align': 'left' } },
            { headerName: "Voucher Type", width: 140, field: "VoucherType", dataType: 'Text', cellStyle: { 'text-align': 'center' } },
            { headerName: "Voucher No", width: 130, field: "VoucherNo", dataType: 'Text', cellStyle: { 'text-align': 'center' } },
            { headerName: "RefNo", width: 120, field: "RefNo", dataType: 'Text', cellStyle: { 'text-align': 'center' }, filter: "agNumberColumnFilter", valueFormatter: p => Numberformat(p.value) },
            { headerName: "Debit", width: 120, field: "Debit", dataType: 'Number', cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: p => Numberformat(p.value) },
            { headerName: "Credit", width: 120, field: "Credit", dataType: 'Number', cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: p => Numberformat(p.value) },
            { headerName: "Points Gained", width: 150, field: "PointsGained", dataType: 'Number', cellStyle: { 'text-align': 'center' } },
            { headerName: "Points Deducted", width: 170, field: "PointsDeducted", dataType: 'Number', cellStyle: { 'text-align': 'center' }, filter: "agNumberColumnFilter", valueFormatter: p => Numberformat(p.value) },
            { headerName: "Cumulative Points", width: 180, field: "CumulativePoints", dataType: 'Number', cellStyle: { 'text-align': 'center' }, filter: "agNumberColumnFilter", valueFormatter: p => Numberformat(p.value) },
            { headerName: "Age", width: 90, field: "Age", dataType: 'Number', cellStyle: { 'text-align': 'center' }, filter: "agDateColumnFilter" }
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
            rowData: [{ Particulars: 'TOTAL =>' }],
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
            Particulars: 'TOTAL =>',
            Debit: 0,
            Credit: 0,
            PointsGained: 0,
            PointsDeducted: 0,
            CumulativePoints: 0            
        };

        if ($scope.gridOptions.api) {
            $scope.gridOptions.api.forEachNodeAfterFilterAndSort(function (node) {
                var fData = node.data;
                if (!fData) return;
                dt.Debit += fData.Debit || 0;
                dt.Credit += fData.Credit || 0;
                dt.PointsGained += fData.PointsGained || 0;
                dt.PointsDeducted += fData.PointsDeducted || 0;
                dt.CumulativePoints += fData.CumulativePoints || 0;               
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
    $scope.GetMembershipLedger = function () {
        $scope.ClearData();

        var dateFrom = new Date($filter('date')(new Date(), 'yyyy-MM-dd'));
        var dateTo = new Date($filter('date')(new Date(), 'yyyy-MM-dd'));

        if ($scope.MembershipLedger.DateFromDet)
            dateFrom = new Date($filter('date')($scope.MembershipLedger.DateFromDet.dateAD, 'yyyy-MM-dd'));
        if ($scope.MembershipLedger.DateToDet)
            dateTo = new Date($filter('date')($scope.MembershipLedger.DateToDet.dateAD, 'yyyy-MM-dd'));

        $scope.loadingstatus = 'running';
        showPleaseWait();

        var beData = {
            DateFrom: dateFrom,
            DateTo: dateTo,
            MembershipLedgerId: $scope.MembershipLedger.PartyLedgerId
        };

        $http({
            method: "POST",
            url: base_url + "Account/Loyality/GetAllMembershipLedger",
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
                down_file(base_url + "//" + res.data.Data.ResponseId, "MembershipLedger.xlsx");
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
