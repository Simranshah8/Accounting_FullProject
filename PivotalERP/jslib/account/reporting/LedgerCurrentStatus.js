"use strict";

agGrid.initialiseAgGridWithAngular1(angular);

app.controller("LedgerCurrentStatus", function ($scope, $http, $filter, $timeout, GlobalServices, $compile) {

 const contextMenu = GlobalServices.createElementForMenu();
    LoadData();

    $scope.onBtExportCSV = function () {
        var params = {
            fileName: 'LedgerCurrentStatus.csv',
            sheetName: 'LedgerCurrentStatus'
        };
        $scope.gridOptions.api.exportDataAsCsv(params);
    }
    $scope.onFilterTextBoxChanged = function () {
        $scope.gridOptions.api.setQuickFilter($scope.search);
    }
    function LoadData() {
        $('.select2').select2();
        $scope.ReportTypeColl = [{ text: 'PendingOnly', value: 'PendingOnly', dataType: 'text' }, { text: 'ClearOnly', value: 'ClearOnly', dataType: 'text' }, { text: 'Both', value: 'Both', dataType: 'text' },]

        //agGrid.initialiseAgGridWithAngular1(angular);
        

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
                    $scope.LedgerCurrentStatus.DateFrom_TMP = new Date(comDet.StartDate);
                }
            }, function (errormessage) {
                alert('Unable to Delete data. pls try again.' + errormessage.responseText);
            });
        });
        $scope.LedgerCurrentStatus = {
            
            DateFrom_TMP: new Date(),
            DateTo_TMP: new Date(),
            LedgerId: 0,
        };
        $scope.OpeningAmt = 0;
        $scope.CurrentAmt = 0;
        $scope.TotalAmt = 0;
        $scope.ReportName = '';
        $scope.noofdecimal = 2;

        $scope.loadingstatus = "stop";

        var columnDefs = [
           
            { headerName: "Particulars", width: 180, field: "LedgerName",cellStyle: { 'text-align': 'left' } },
            { headerName: "Opening", width: 180, field: "Opening", cellStyle: { 'text-align': 'right' }, valueFormatter: function (params) { return Numberformat(params.value); }, },
            { headerName: "TransactionCr", width: 180, field: "TransactionCr", cellStyle: { 'text-align': 'right' }, valueFormatter: function (params) { return Numberformat(params.value); }, },
            { headerName: "TransactionDr", width: 180, field: "TransactionDr", cellStyle: { 'text-align': 'right' }, valueFormatter: function (params) { return Numberformat(params.value); }, },
            { headerName: "Closing", width: 180, field: "Closing", cellStyle: { 'text-align': 'right' },valueFormatter: function (params) { return Numberformat(params.value); }, },
            

            //{
            //    headerName: "Action", width: 150, cellRenderer:
            //        function (params) {

            //            var voucherName = params.data.VoucherName;

            //            if (voucherName) {

            //                if (params.data.VoucherType < 5) {
            //                    return '<a class="btn btn-default btn-xs" href="' + base_url + 'Account/Transaction/' + voucherName + '?TranId={{' + params.data.TranId + '}}"><i class="fas fa-edit text-info"></i></a>' +
            //                        '<a class="btn btn-default btn-xs" ng-click="PrintVoucher(' + params.data.TranId + ',' + params.data.VoucherType + ',' + params.data.VoucherId + ')"><i class="fas fa-print text-info"></i></a>' +
            //                        '<a class="btn btn-default btn-xs" ng-click="deleteVoucher(' + params.data.TranId + ',' + params.data.VoucherType + ',' + params.data.VoucherId + ',\'' + voucherName + '\'' + ', \'' + params.data.AutoManualNo + '\')"><i class="fas fa-trash-alt text-danger"></i></a>';

            //                } else {
            //                    return '<a class="btn btn-default btn-xs" href="' + base_url + 'Inventory/Transaction/' + voucherName + '?TranId={{' + params.data.TranId + '}}"><i class="fas fa-edit text-info"></i></a>' +
            //                        '<a class="btn btn-default btn-xs" ng-click="PrintVoucher(' + params.data.TranId + ',' + params.data.VoucherType + ',' + params.data.VoucherId + ')"><i class="fas fa-print text-info"></i></a>' +
            //                        '<a class="btn btn-default btn-xs" ng-click="deleteVoucher(' + params.data.TranId + ',' + params.data.VoucherType + ',' + params.data.VoucherId + ',\'' + voucherName + '\'' + ', \'' + params.data.AutoManualNo + '\')"><i class="fas fa-trash-alt text-danger"></i></a>';
            //                }

            //            } else {
            //                return '';
            //            }
            //        }
            //}
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
                    Particulars: 'Total =>',
                    Opening: 0,
                    TransactionCr: 0,
                    TransactionDr: 0,
                    Closing: 0,
                };
                $scope.gridOptions.api.forEachNodeAfterFilterAndSort(function (node) {
                    var fData = node.data;
                    dt.Opening += fData.Opening;
                    dt.TransactionCr += fData.TransactionCr;
                    dt.TransactionDr += fData.TransactionDr;
                    dt.Closing += fData.Closing;
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
                Particulars: 'Total =>',
                Opening : 0,
                TransactionCr : 0,
                TransactionDr : 0,
                Closing : 0,
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
        $scope.loadingstatus = "stop";
$timeout(function () {
            GlobalServices.getListState(EntityId, $scope.gridOptions);
        });

    }
   
    $scope.GetLedgerCurrentStatus = function () {

        var dateFrom = new Date(($filter('date')(new Date(), 'yyyy-MM-dd')));
        var dateTo = new Date(($filter('date')(new Date(), 'yyyy-MM-dd')));

        if ($scope.LedgerCurrentStatus.DateFromDet)
            dateFrom = new Date(($filter('date')($scope.LedgerCurrentStatus.DateFromDet.dateAD, 'yyyy-MM-dd')));

        if ($scope.LedgerCurrentStatus.DateToDet)
            dateTo = new Date(($filter('date')($scope.LedgerCurrentStatus.DateToDet.dateAD, 'yyyy-MM-dd')));

        $scope.DataColl = []; //declare an empty array
        $scope.gridOptions.api.setRowData($scope.DataColl);

        var beData = {

            DateFrom: dateFrom,
            DateTo: dateTo,
            LedgerId: $scope.LedgerCurrentStatus.LedgerId,
        };

        $scope.loadingstatus = 'running';

        $http({
            method: "post",
            url: base_url + "Account/Reporting/getBranchWiseLedgerStatus",
            data: JSON.stringify(beData),
            dataType: "json"
        }).then(function (res) {

            $scope.loadingstatus = 'stop';
            hidePleaseWait();

            if (res.data.IsSuccess && res.data.Data) {
                $scope.DataColl = res.data.Data;
                var dt = {
                    BranchName: 'TOTAL =>',
                    Opening: 0,
                    TransactionCr: 0,
                    TransactionDr: 0,
                    Closing: 0,
                   
                }
                res.data.Data.forEach(function (fData) {

                    dt.Opening += fData.Opening;
                    dt.TransactionCr += fData.TransactionCr;
                    dt.TransactionDr += fData.TransactionDr;
                    dt.Closing += fData.Closing;
                });

                var filterDataColl = [];
                filterDataColl.push(dt);

                $scope.gridOptionsBottom.api.setRowData(filterDataColl);


                $scope.gridOptions.api.setRowData($scope.DataColl);
            } else
                Swal.fire(res.data.ResponseMSG);

        }, function (reason) {
            $scope.loadingstatus = "stop";
            alert('Failed' + reason);
        });
    };

    
    $scope.onFilterTextBoxChanged = function () {
        $scope.gridOptions.api.setQuickFilter($scope.search);
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
