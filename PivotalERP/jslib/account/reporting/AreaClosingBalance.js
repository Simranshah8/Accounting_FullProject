"use strict";

agGrid.initialiseAgGridWithAngular1(angular);

app.controller("AreaClosingBalance", function ($scope, $http, $filter, $timeout, GlobalServices, $compile) {

 var PrintPreviewAs = 1;
  const contextMenu = GlobalServices.createElementForMenu();
    LoadData();

    $scope.onBtExportCSV = function () {
        var params = {
            fileName: 'AreaClosingBalance.csv',
            sheetName: 'AreaClosingBalance'
        };

        $scope.gridOptions.api.exportDataAsCsv(params);
    }

    function LoadData() {
        $scope.ReportTypeColl = [{ text: 'PendingOnly', value: 'PendingOnly', dataType: 'text' }, { text: 'ClearOnly', value: 'ClearOnly', dataType: 'text' }, { text: 'Both', value: 'Both', dataType: 'text' },]

 $scope.GenConfig = {};
        GlobalServices.getGenConfig().then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.GenConfig = res.data.Data;
                PrintPreviewAs = $scope.GenConfig.PrintPreviewAs;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
		
        //agGrid.initialiseAgGridWithAngular1(angular);
        $scope.VoucherTypeList = [];
        $http({
            method: 'GET',
            url: base_url + "Account/Reporting/GetAllVoucherList",
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
        $timeout(function () {
            $http({
                method: "GET",
                url: base_url + "Global/GetCompanyDetail",
                dataType: "json"
            }).then(function (res) {
                var comDet = res.data.Data;
                if (comDet) {
                    $scope.AreaClosingBalance.DateFrom_TMP = new Date(comDet.StartDate);
                }
            }, function (errormessage) {
                alert('Unable to Delete data. pls try again.' + errormessage.responseText);
            });
        });
        $scope.AreaClosingBalance = {
            DateFrom_TMP: new Date(),
            DateTo_TMP: new Date(),
            VoucherId: 0,
            IsPost: true,
            BranchId: 0
        };
      
        $scope.loadingstatus = "stop";

        var columnDefs = [

            { headerName: "AreaName", width: 250, field: "Name",cellStyle: {'text-align':'left'} },

            { headerName: "AreaType", width: 250, field: "AreaType",cellStyle: {'text-align':'left'} },
            { headerName: "OpeningDr", width: 250, field: "OpeningDr", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },
            { headerName: "OpeningCr", width: 250, field: "OpeningCr", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },
            { headerName: "TransactionDr", width: 250, field: "DrAmt", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },
            { headerName: "TransactionCr", width: 250, field: "CrAmt", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },
            { headerName: "ClosingCr", width: 250, field: "ClosingCr", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },
            { headerName: "ClosingDr", width: 250, field: "ClosingDr", cellStyle: { 'text-align': 'right' }, filter: "agNumberColumnFilter", valueFormatter: function (params) { return Numberformat(params.value); }, },
            


           
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
            columnDefs: columnDefs,
            rowData: null,
            filter: true,
            suppressHorizontalScroll: true,
            alignedGrids: [],
            enableFilter: true,

            onFilterChanged: function () {

                var dt = {
                    Name: 'TOTAL =>',
                    OpeningDr: 0,
                    OpeningCr: 0,
                    DrAmt: 0,
                    CrAmt: 0,
                    ClosingCr: 0,
                    ClosingDr:0,
                }
                $scope.gridOptions.api.forEachNodeAfterFilterAndSort(function (node) {
                    var fData = node.data;
                    dt.OpeningDr += fData.OpeningDr;
                    dt.OpeningCr += fData.OpeningCr;
                    dt.ClosingDr += fData.ClosingDr;
                    dt.ClosingCr += fData.ClosingCr;
                    dt.DrAmt += fData.DrAmt;
                    dt.CrAmt += fData.CrAmt;

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
                Name: 'TOTAL =>',
                OpeningDr: 0,
                OpeningCr: 0,
                DrAmt: 0,
                CrAmt: 0,
                ClosingCr: 0,
                ClosingDr: 0,
            }];

        $scope.gridOptionsBottom = {
            defaultColDef: {
                resizable: true,
                width: 90
            },
            columnDefs: columnDefs,
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
    $scope.GetAreaClosingBalance = function () {
        $scope.ClearData();
        var dateFrom = new Date(($filter('date')(new Date(), 'yyyy-MM-dd')));
        var dateTo = new Date(($filter('date')(new Date(), 'yyyy-MM-dd')));

        if ($scope.AreaClosingBalance.DateFromDet)
            dateFrom = new Date(($filter('date')($scope.AreaClosingBalance.DateFromDet.dateAD, 'yyyy-MM-dd')));

        if ($scope.AreaClosingBalance.DateToDet)
            dateTo = new Date(($filter('date')($scope.AreaClosingBalance.DateToDet.dateAD, 'yyyy-MM-dd')));

        $scope.loadingstatus = 'running';
        showPleaseWait();

        var beData = {
            DateFrom: dateFrom,
            DateTo: dateTo,
            VoucherType: $scope.AreaClosingBalance.VoucherId,
            isPost: $scope.AreaClosingBalance.IsPost,
            branchId: $scope.AreaClosingBalance.BranchId
        };

        $scope.loadingstatus = 'running';

        $http({
            method: "post",
            url: base_url + "Account/Reporting/GetAllAreaClosingBalance",
            data: JSON.stringify(beData),
            dataType: "json"
        }).then(function (res) {

            $scope.loadingstatus = 'stop';
            hidePleaseWait();

            if (res.data.IsSuccess && res.data.Data) {
                var DataColl = mx(res.data.Data);

                var dt = {
                    Name: 'TOTAL =>',
                    OpeningCr: DataColl.sum(p1 => p1.OpeningCr),
                    OpeningDr: DataColl.sum(p1 => p1.OpeningDr),
                    ClosingCr: DataColl.sum(p1 => p1.ClosingCr),
                    ClosingDr: DataColl.sum(p1 => p1.ClosingDr),
                    DrAmt: DataColl.sum(p1 => p1.DrAmt),
                    CrAmt: DataColl.sum(p1 => p1.CrAmt),

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
                            title: 'Report Templates For Print',
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
                down_file(base_url + "//" + res.data.Data.ResponseId, "AreaClosingBalance.xlsx");
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
        contextMenu.style.display = 'none';
    });

    $(document).ready(function () {
        $(this).bind("contextmenu", function (e) {
            e.preventDefault();
        });
    });
	
});
