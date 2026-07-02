

"use strict";

agGrid.initialiseAgGridWithAngular1(angular);



app.controller("JobForFeedback", function ($scope, $http, $filter, $timeout, GlobalServices, $compile) {
    $scope.Title = 'JobForFeedback';

    LoadData();

    $scope.onBtExportCSV = function () {
        var params = {
            fileName: 'JobForFeedback.csv',
            sheetName: 'JobForFeedback'
        };

        $scope.gridOptions.api.exportDataAsCsv(params);
    }

    function LoadData() {
        $scope.JobForFeedback = {
            DateFrom_TMP: new Date(),
            DateTo_TMP: new Date(),
            isCancel: true
        };

        $scope.loadingstatus = "stop";
        $scope.columnDefs = [
            {
                headerName: "Date(A.D.)", width: 140, field: "VoucherDate", dataType: 'DateTime', pinned: 'left', cellRenderer: 'agGroupCellRenderer',
                valueFormatter: function (params) { return DateFormatAD(params.value); },
                showRowGroup: true,
                cellRendererParams: {
                    suppressCount: false, // turn off the row count                   
                }
            },
            {
                headerName: "Miti", width: 140, field: "VoucherDate_BS", dataType: 'DateTime', pinned: 'left', cellRenderer: 'agGroupCellRenderer',
                valueFormatter: function (params) { return DateFormatBS(params.value); },
                showRowGroup: true,
                cellRendererParams: {
                    suppressCount: false, // turn off the row count                   
                }
            },
           
            { headerName: "JobNo", field: "JobNo", dataType: 'Number', filter: 'agTextColumnFilter', width: 140, cellStyle: { 'text-align': 'right' } },
            { headerName: "EngineNo", field: "EngineNo", dataType: 'Number', width: 120, filter: 'agTextColumnFilter', width: 140, cellStyle: { 'text-align': 'right' } },
            { headerName: "ChSrlNo", field: " ChSrlNo", dataType: 'Number', width: 140, filter: 'agTextColumnFilter', width: 140, cellStyle: { 'text-align': 'right' } },
            //{ headerName: "Vin.No", field: "Vin.No", filter: 'agTextColumnFilter', width: 140 },
            { headerName: "Regd.No", field: "Regd.No", dataType: 'Number', filter: 'agNumberColumnFilter', width: 140, cellStyle: { 'text-align': 'right' } },
            { headerName: "ProductName", field: "ProductName", dataType: 'Text', filter: 'agNumberColumnFilter', width: 140, cellStyle: { 'text-align': 'left' } },
            { headerName: "Alias", field: "Alias", dataType: 'Text', filter: 'agNumberColumnFilter', width: 180, cellStyle: { 'text-align': 'left' } },
            { headerName: "Code", field: "Code", dataType: 'Text', filter: 'agNumberColumnFilter', width: 160, cellStyle: { 'text-align': 'right' } },

            { headerName: "Part No", field: "PartNo", dataType: 'Number', filter: 'agNumberColumnFilter', width: 180, cellStyle: { 'text-align': 'right' } },
            { headerName: "Qty.", field: "Qty", dataType: 'Number', filter: 'agNumberColumnFilter', width: 180, cellStyle: { 'text-align': 'right' } },
            { headerName: "Rate", field: "Rate", dataType: 'Number', filter: 'agNumberColumnFilter', width: 180, cellStyle: { 'text-align': 'right' } },
            { headerName: "Unit", field: "Unit", dataType: 'Number', filter: 'agNumberColumnFilter', width: 140, cellStyle: { 'text-align': 'right' } },
            { headerName: "Amount", field: "Amount", dataType: 'Text', filter: 'agNumberColumnFilter', width: 140, cellStyle: { 'text-align': 'right' } },
            { headerName: "Remarks", field: "Remarks", dataType: 'Text', filter: 'agNumberColumnFilter', width: 180, cellStyle: { 'text-align': 'left' } },

            { headerName: "UnderWarrenty", dataType: 'Number', field: "UnderWarrenty", filter: 'agNumberColumnFilter', width: 180, cellStyle: { 'text-align': 'right' } },
            { headerName: "Branch Name", dataType: 'Text', field: "BranchName", filter: 'agNumberColumnFilter', width: 160, cellStyle: { 'text-align': 'left' } },
            { headerName: "Party Name", dataType: 'Text', field: "PartyName", filter: 'agNumberColumnFilter', width: 160, cellStyle: { 'text-align': 'left' } },
            { headerName: "Address", dataType: 'Text', field: "Address", filter: 'agNumberColumnFilter', width: 190, cellStyle: { 'text-align': 'left' } },
            { headerName: "Mobile No", dataType: 'Number', field: "MobileNo", filter: 'agNumberColumnFilter', width: 160, cellStyle: { 'text-align': 'right' } },
            { headerName: "Job Card For", dataType: 'Text', field: "JobCardFor", filter: 'agNumberColumnFilter', width: 160, cellStyle: { 'text-align': 'left' } },
            { headerName: "Service Type", dataType: 'Text', field: "ServiceType", filter: 'agNumberColumnFilter', width: 160, cellStyle: { 'text-align': 'left' } },

            { headerName: "Job Card Type", dataType: 'Text', field: "JobCardType", filter: 'agNumberColumnFilter', width: 180, cellStyle: { 'text-align': 'left' } },
            { headerName: "ClosedDate", dataType: 'DateTime', field: "ClosedDateTime", filter: 'agNumberColumnFilter', width: 180, cellStyle: { 'text-align': 'right' } },
            { headerName: "Site Location", dataType: 'Text', field: "SiteLocation", filter: 'agNumberColumnFilter', width: 180, cellStyle: { 'text-align': 'left' } },

            //{ headerName: "Complain", field: "Complain", filter: 'agNumberColumnFilter', width: 180, cellStyle: { 'text-align': 'right' } },
            //{ headerName: "Is Closed", field: "IsClosed", filter: 'agNumberColumnFilter', width: 160, cellStyle: { 'text-align': 'right' } },

          
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


    $scope.GetAllJobForFeedback = function () {
        var dateFrom = new Date(($filter('date')(new Date(), 'yyyy-MM-dd')));
        var dateTo = new Date(($filter('date')(new Date(), 'yyyy-MM-dd')));

        if ($scope.JobForFeedback.DateFromDet)
            dateFrom = new Date(($filter('date')($scope.JobForFeedback.DateFromDet.dateAD, 'yyyy-MM-dd')));

        if ($scope.JobForFeedback.DateToDet)
            dateTo = new Date(($filter('date')($scope.JobForFeedback.DateToDet.dateAD, 'yyyy-MM-dd')));

        $scope.DataColl = []; //declare an empty array
        $scope.gridOptions.api.setRowData($scope.DataColl);

        var beData = {
            DateFrom: dateFrom,
            DateTo: dateTo,
            isCancel: true
        };

        $scope.loadingstatus = 'running';
        $http({
            method: "post",
            url: base_url + "Service/Reporting/GetJobforFeedbackList",
            data: JSON.stringify(beData),
            dataType: "json"
            //data:JSON.stringify(para)
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

   

});