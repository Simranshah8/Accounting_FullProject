"use strict";

agGrid.initialiseAgGridWithAngular1(angular);

app.controller("NewTBController", function ($scope, $http, $filter, $timeout, GlobalServices, $compile) {

    $('.select2').select2({
        allowClear: true,
        openOnEnter: true
    });
    getterAndSetter();
    LoadData();

    $scope.onBtExportCSV = function () {
        var params = {
            fileName: 'NewTB.csv',
            sheetName: 'NewTB'
        };

        $scope.gridOptions.api.exportDataAsCsv(params);
    }

    function getterAndSetter() {

        $scope.columnDefs = [
            { headerName: "Code", field: "Code", width: 90, filter: "agTextColumnFilter", pinned: 'left' },
            { headerName: "Ledger", field: "LedgerName", width: 200, filter: "agTextColumnFilter", pinned: 'left'  },
            { headerName: "Opening", field: "Opening", width: 130, filter: "agTextColumnFilter", cellStyle: { 'textAlign': 'right' }, valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "DrAmount", field: "DrAmount", width: 130, filter: "agTextColumnFilter", cellStyle: { 'textAlign': 'right' },valueFormatter: function (params) { return Numberformat(params.value); }},
            { headerName: "CrAmount", field: "CrAmount", width: 130, filter: "agTextColumnFilter", cellStyle: { 'textAlign': 'right' },valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "Closing", field: "Closing", width: 130, filter: "agTextColumnFilter", cellStyle: { 'textAlign': 'right' }, valueFormatter: function (params) { return Numberformat(params.value); }}
        ];
        
        $scope.gridOptions = {

            defaultColDef: {
                filter: true,
                resizable: true,
                sortable: true,
                width: 100,
            },
            enableSorting: true,
            multiSortKey: 'ctrl',
            enableColResize: true,
            overlayLoadingTemplate: "Loading..",
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
                    LedgerName: 'TOTAL =>',
                    Opening: 0,
                    DrAmount: 0,
                    CrAmount: 0,
                    Closing: 0,
                }
                $scope.gridOptions.api.forEachNodeAfterFilterAndSort(function (node) {
                    var fData = node.data;
                    dt.Opening += fData.Opening;
                    dt.DrAmount += fData.DrAmount;
                    dt.CrAmount += fData.CrAmount;
                    dt.Closing += fData.Closing;
                });


                var filterDataColl = [];
                filterDataColl.push(dt);

                $scope.gridOptionsBottom.api.setRowData(filterDataColl);
            }

        };
        $scope.eGridDiv = document.querySelector('#datatable');

        $scope.dataForBottomGrid = [
            {
                LedgerName: 'Total =>',
            }];

        $scope.gridOptionsBottom = {
            defaultColDef: {
                resizable: true,
                width: 90
            },
            columnDefs: $scope.columnDefs,
            rowData: $scope.dataForBottomGrid,
            debug: true,
            rowClass: 'bold-row',
            headerHeight: 0, // hides the header
            alignedGrids: [],
            statusBar: {
                statusPanels: [
                    {
                        statusPanel: 'agTotalRowCountComponent',
                        align: 'left'
                    },
                    {
                        statusPanel: 'agAggregationComponent',
                        align: 'right'
                    }
                ]
            }
        };


        $scope.gridOptions.alignedGrids.push($scope.gridOptionsBottom);
        $scope.gridOptionsBottom.alignedGrids.push($scope.gridOptions);

        $scope.gridDivBottom = document.querySelector('#myGridBottom');
        new agGrid.Grid($scope.gridDivBottom, $scope.gridOptionsBottom);
        $scope.loadingstatus = "stop";


    }


    function LoadData() {

        $('.select2').select2({
            allowClear: true,
            openOnEnter: true
        });


        $scope.ReportTypeColl = [{ id: 1, text: 'Normal' }, { id: 2, text: 'With Brand' }, {
            id: 3, text: 'With Brand & Department'
        }]

        $scope.LedgerGroupList = [];

        var para = {
            procName: '',
            qry: 'select L.LedgerGroupId,L.Name GroupName from tbl_LedgerGroup(nolock) L where L.LedgerGroupId in (40,41,43,44) order by L.Name',
            asParentChild: false,
            tblNames: 'LedgerGroupColl',
            colRelations: '',
            paraColl: {},
        }

        $http({
            method: "post",
            url: base_url + "Global/GetCustomData",
            data: JSON.stringify(para),
            dataType: "json"
        }).then(function (res) {

            $scope.loadingstatus = 'done';
            hidePleaseWait();
            if (res.data.IsSuccess == true) {
                $scope.LedgerGroupList = res.data.Data;
 
            } else if (res.data.IsSuccess != undefined) {
                Swal.fire(res.data.ResponseMSG);
            }

        }, function (errormessage) {

            $scope.loadingstatus = 'stop';

            alert('Unable to Store data. pls try again.' + errormessage.responseText);
        });

        //$http({
        //    method: 'GET',
        //    url: base_url + "Account/Creation/GetAllLedgerGroup",
        //    dataType: "json"
        //}).then(function (res) {
        //    if (res.data.IsSuccess && res.data.Data) {
        //        $scope.LedgerGroupList = res.data.Data;
        //    }
        //}, function (reason) {
        //    Swal.fire('Failed' + reason);
        //});


        $scope.BranchList = [];
        $http({
            method: 'GET',
            url: base_url + "Setup/Security/GetAllBranchList",
            dataType: "json"
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.BranchList = res.data.Data;

            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        $scope.ProductGroupList = [];
        $http({
            method: 'GET',
            url: base_url + "Inventory/Reporting/GetAllProductGroup",
            dataType: "json",
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.ProductGroupList = res.data.Data;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        $scope.newFilter = {
            DateFrom_TMP: new Date(),
            DateTo_TMP: new Date(),
            ReportTypeId: 1,
            GodownId: 0,
            ShowZeroBalance: false
        };

        $timeout(function () {
            $http({
                method: "GET",
                url: base_url + "Global/GetCompanyDetail",
                dataType: "json"
            }).then(function (res) {
                var comDet = res.data.Data;
                if (comDet) {
                    $scope.newFilter.DateFrom_TMP = new Date(comDet.StartDate);
                }
            }, function (errormessage) {
                alert('Unable to Delete data. pls try again.' + errormessage.responseText);
            });
        });

        $scope.loadingstatus = "stop";
    }

    $scope.GetAllNewTB = function () {

        var dateFrom = new Date(($filter('date')(new Date(), 'yyyy-MM-dd')));
        var dateTo = new Date(($filter('date')(new Date(), 'yyyy-MM-dd')));

        if ($scope.newFilter.DateFromDet)
            dateFrom = $filter('date')($scope.newFilter.DateFromDet.dateAD, 'yyyy-MM-dd');

        if ($scope.newFilter.DateToDet)
            dateTo = $filter('date')($scope.newFilter.DateToDet.dateAD, 'yyyy-MM-dd');

        $scope.DataColl = []; //declare an empty array
        $scope.gridOptions.api.setRowData($scope.DataColl);


        var beData = {
            dateFrom: dateFrom,
            dateTo: dateTo,
            ReportType: $scope.newFilter.ReportTypeId,
            ForBranchId: null,
            LedgerGroupId: $scope.newFilter.LedgerGroupId,
            BranchIdColl:$scope.newFilter.BranchId ? $scope.newFilter.BranchId.toString() : '',
        };

        $scope.loadingstatus = 'running';
        showPleaseWait();

        $http({
            method: "post",
            url: base_url + "Account/Reporting/GetAllNewTB",
            data: JSON.stringify(beData),
            dataType: "json"
        }).then(function (res) {

            $scope.loadingstatus = 'stop';
            hidePleaseWait();

            if (res.data.IsSuccess && res.data.Data) {
                res.data.Data.forEach(row => {
                    if (row.ReportType && Array.isArray(row.ReportType)) {
                        row.ReportType.forEach((val, index) => {
                            row[`ReportType_${index}`] = val;
                        });
                    }
                });

                updateColumnDefs(res.data.Data);
                $scope.gridOptions.api.setRowData(res.data.Data);
                updateBottomGridTotal();
            } else {
                alert(res.data.ResponseMSG);
            }
            //if (res.data.IsSuccess && res.data.Data) {
            //    updateColumnDefs(res.data.Data);
            //    $scope.gridOptions.api.setRowData(res.data.Data);
            //    updateBottomGridTotal();

            //    //var dt = {
            //    //    LedgerName: 'TOTAL =>',
            //    //    Opening: 0,
            //    //    DrAmount: 0,
            //    //    CrAmount: 0,
            //    //    Closing: 0,
            //    //}
            //    //angular.forEach(res.data.Data, function (fData) {
            //    //    dt.Opening += fData.Opening;
            //    //    dt.DrAmount += fData.DrAmount;
            //    //    dt.CrAmount += fData.CrAmount;
            //    //    dt.Closing += fData.Closing;

            //    //});
            //    //var filterDataColl = [];
            //    //filterDataColl.push(dt);

            //    //$scope.gridOptionsBottom.api.setRowData(filterDataColl);

            //    //$scope.gridOptions.api.setRowData(res.data.Data);
            //} else
            //    alert(res.data.ResponseMSG);

        }, function (reason) {
            $scope.loadingstatus = "stop";
            alert('Failed' + reason);
        });

    };
    function updateColumnDefs(data) {
        if (data.length === 0) return;

        var baseColumns = [
            { headerName: "Code", field: "Code", width: 90, filter: "agTextColumnFilter" },
            { headerName: "Ledger", field: "LedgerName", width: 200, filter: "agTextColumnFilter" },
            { headerName: "Opening", field: "Opening", width: 130, filter: "agNumberColumnFilter", cellStyle: { 'textAlign': 'right' }, valueFormatter: formatNumber },
            { headerName: "DrAmount", field: "DrAmount", width: 130, filter: "agNumberColumnFilter", cellStyle: { 'textAlign': 'right' }, valueFormatter: formatNumber },
            { headerName: "CrAmount", field: "CrAmount", width: 130, filter: "agNumberColumnFilter", cellStyle: { 'textAlign': 'right' }, valueFormatter: formatNumber },
            { headerName: "Closing", field: "Closing", width: 130, filter: "agNumberColumnFilter", cellStyle: { 'textAlign': 'right' }, valueFormatter: formatNumber }
        ];

        var dynamicColumns = [];
        var sampleRow = data[0];

        if (sampleRow.ReportTypeName && Array.isArray(sampleRow.ReportTypeName)) {
            let dynamicColumnCount = sampleRow.ReportTypeName.length;

            for (let i = 0; i < dynamicColumnCount; i++) {
                let reportTypeName = sampleRow.ReportTypeName[i];
                dynamicColumns.push({
                    headerName: reportTypeName,
                    field: `ReportType_${i}`,
                    width: 130,
                    filter: "agNumberColumnFilter",
                    cellStyle: { 'textAlign': 'right' },
                    valueFormatter: formatNumber
                });
            }
        }

        $scope.columnDefs = [...baseColumns, ...dynamicColumns];
        $scope.gridOptions.api.setColumnDefs($scope.columnDefs);
        $scope.gridOptionsBottom.api.setColumnDefs($scope.columnDefs);
    }

    function updateBottomGridTotal() {
        var totalRow = { LedgerName: 'TOTAL =>' };
        var firstRow = $scope.gridOptions.api.getDisplayedRowAtIndex(0);
        var dynamicColumnCount = firstRow && firstRow.data.ReportType ? firstRow.data.ReportType.length : 0;

        totalRow.Opening = 0;
        totalRow.DrAmount = 0;
        totalRow.CrAmount = 0;
        totalRow.Closing = 0;

        for (let i = 0; i < dynamicColumnCount; i++) {
            totalRow[`ReportType_${i}`] = 0;
        }

        $scope.gridOptions.api.forEachNodeAfterFilterAndSort(function (node) {
            var row = node.data;
            totalRow.Opening += row.Opening || 0;
            totalRow.DrAmount += row.DrAmount || 0;
            totalRow.CrAmount += row.CrAmount || 0;
            totalRow.Closing += row.Closing || 0;

            for (let i = 0; i < dynamicColumnCount; i++) {
                totalRow[`ReportType_${i}`] += row[`ReportType_${i}`] || 0;
            }
        });

        $scope.gridOptionsBottom.api.refreshCells({ force: true });
        $scope.gridOptionsBottom.api.setRowData([totalRow]);
    }

    function formatNumber(params) {
        return params.value ? Number(params.value).toLocaleString() : "0";
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
                down_file(base_url + "//" + res.data.Data.ResponseId, "NewTB.xlsx");
            }

        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            Swal.fire(errormessage);
        });
    }


});