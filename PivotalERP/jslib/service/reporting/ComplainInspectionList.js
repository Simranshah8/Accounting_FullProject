

"use strict";

agGrid.initialiseAgGridWithAngular1(angular);



app.controller("ComplainInspectionList", function ($scope, $http, $filter, $timeout, GlobalServices, $compile) {
    $scope.Title = 'ComplainInspectionList';

    LoadData();

    $scope.onBtExportCSV = function () {
        var params = {
            fileName: 'ComplainInspectionList.csv',
            sheetName: 'ComplainInspectionList'
        };

        $scope.gridOptions.api.exportDataAsCsv(params);
    }

    function LoadData() {
        $scope.ComplainInspectionList = {
            DateFrom_TMP: new Date(),
            DateTo_TMP: new Date(),
        };

        $scope.loadingstatus = "stop";
        $scope.columnDefs = [
            {
                headerName: "Date(A.D.)", width: 140, field: "EntryDate", dataType: 'DateTime', pinned: 'left', cellRenderer: 'agGroupCellRenderer',
                valueFormatter: function (params) { return DateFormatAD(params.value); },
                showRowGroup: true,
                cellRendererParams: {
                    suppressCount: false, // turn off the row count                   
                }
            },
            {
                headerName: "Miti", width: 140, field: "EntryMiti", dataType: 'DateTime', pinned: 'left', cellRenderer: 'agGroupCellRenderer',                
                showRowGroup: true,
                cellRendererParams: {
                    suppressCount: false, // turn off the row count                   
                }
            },
            { headerName: "Job No", field: "JobCardNo", dataType: 'Text', filter: 'agTextColumnFilter', width: 150, cellStyle: { 'text-align': 'right' } },            

            { headerName: "Branch", field: "BranchName", dataType: 'Text', width: 140, filter: 'agTextColumnFilter', width: 140, cellStyle: { 'text-align': 'left' } },
            { headerName: "Branch Code", field: "BranchCode", dataType: 'Text', width: 140, filter: 'agTextColumnFilter', width: 140, cellStyle: { 'text-align': 'left' } },
            { headerName: "Engineno", field: "EngineNo", dataType: 'Text', filter: 'agTextColumnFilter', width: 140, cellStyle: { 'text-align': 'left' } },
            { headerName: "ChasisNo", field: "ChSrlNo", dataType: 'Text', filter: 'agTextColumnFilter', width: 180, cellStyle: { 'text-align': 'left' } },
            { headerName: "Regd.No", field: "RegdNo", dataType: 'Text', filter: 'agTextColumnFilter', width: 140, cellStyle: { 'text-align': 'left' } },
            { headerName: "Remarks", field: "Description", dataType: 'Text', filter: 'agTextColumnFilter', width: 180, cellStyle: { 'text-align': 'left' } },
            { headerName: "Inspection Group", field: "InspectionGroup", dataType: 'Text', filter: 'agTextColumnFilter', width: 180, cellStyle: { 'text-align': 'left' } },
            { headerName: "Inspection Type", field: "InspectionType", dataType: 'Text', filter: 'agTextColumnFilter', width: 180, cellStyle: { 'text-align': 'left' } },
            { headerName: "JobCard Type", field: "JobCardType", dataType: 'Text', filter: 'agTextColumnFilter', width: 180, cellStyle: { 'text-align': 'left' } },
            { headerName: "Description", field: "Description", dataType: 'Text', filter: 'agTextColumnFilter', width: 180, cellStyle: { 'text-align': 'left' } },
            { headerName: "Start Date", field: "StartDateTime", dataType: 'DateTime',   width: 140, cellStyle: { 'text-align': 'center' } },
            { headerName: "End date", field: "EndDateTime", dataType: 'DateTime',   width: 140, cellStyle: { 'text-align': 'center' } },

            { headerName: "Mechanic", dataType: 'Text', field: "Mechanic", filter: 'agTextColumnFilter', width: 180, cellStyle: { 'text-align': 'left' } },
            { headerName: "Qty.", dataType: 'Number', field: "Qty", filter: 'agNumberColumnFilter', width: 160, cellStyle: { 'text-align': 'center' } },
            { headerName: "Rate", dataType: 'Number', field: "Rate", filter: 'agNumberColumnFilter', width: 160, cellStyle: { 'text-align': 'right' } },
            { headerName: "Amount", dataType: 'Number', field: "Amount", filter: 'agNumberColumnFilter', width: 160, cellStyle: { 'text-align': 'right' } },
             


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
            enableFilter: true

        };

        // lookup the container we want the Grid to use
        $scope.eGridDiv = document.querySelector('#datatable');

        // create the grid passing in the div to use together with the columns & data we want to use
        new agGrid.Grid($scope.eGridDiv, $scope.gridOptions);
        $scope.loadingstatus = "stop";

    }


    $scope.GetAllComplainInspectionList = function () {
        var dateFrom = new Date(($filter('date')(new Date(), 'yyyy-MM-dd')));
        var dateTo = new Date(($filter('date')(new Date(), 'yyyy-MM-dd')));

        if ($scope.ComplainInspectionList.DateFromDet)
            dateFrom = new Date(($filter('date')($scope.ComplainInspectionList.DateFromDet.dateAD, 'yyyy-MM-dd')));

        if ($scope.ComplainInspectionList.DateToDet)
            dateTo = new Date(($filter('date')($scope.ComplainInspectionList.DateToDet.dateAD, 'yyyy-MM-dd')));

        $scope.DataColl = []; //declare an empty array
        $scope.gridOptions.api.setRowData($scope.DataColl);

        var para = {
            DateFrom: dateFrom,
            DateTo: dateTo
        };

        $scope.loadingstatus = 'running';
        $http({
            method: "post",
            url: base_url + "Service/Reporting/GetComplainInspectionList",
            dataType: "json",
            data:JSON.stringify(para)
        }).then(function (res) {
            $scope.loadingstatus = 'stop';
            hidePleaseWait();
            if (res.data.IsSuccess && res.data.Data) {
                $scope.DataColl = res.data.Data;

                $scope.gridOptions.api.setRowData($scope.DataColl);
            } else
                alert(res.data.ResponseMSG);

        }, function (reason) {
            $scope.loadingstatus = "stop";
            alert('Failed' + reason);
        });

    }


    $scope.onFilterTextBoxChanged = function () {
        $scope.gridOptions.api.setQuickFilter($scope.search);
    }

    $scope.onBtExport = function () {
        var params = {
            fileName: 'data.csv',
            sheetName: 'data'
        };

        $scope.gridOptions.api.exportDataAsCsv(params);
    }

});