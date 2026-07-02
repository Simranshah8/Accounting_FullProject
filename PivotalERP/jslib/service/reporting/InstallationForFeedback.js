

"use strict";

agGrid.initialiseAgGridWithAngular1(angular);



app.controller("InstallationForFeedback", function ($scope, $http, $filter, $timeout, GlobalServices, $compile) {
    $scope.Title = 'InstallationForFeedback';

    LoadData();

    $scope.onBtExportCSV = function () {
        var params = {
            fileName: 'InstallationForFeedback.csv',
            sheetName: 'InstallationForFeedback'
        };

        $scope.gridOptions.api.exportDataAsCsv(params);
    }

    function LoadData() {
        $scope.InstallationForFeedback = {
            DateFrom_TMP: new Date(),
            DateTo_TMP: new Date(),
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
            { headerName: "Vin.No", field: "Vin.No", dataType: 'Number', filter: 'agTextColumnFilter', width: 140, cellStyle: { 'text-align': 'right' } },
            { headerName: "EngineNo", field: "EngineNo", dataType: 'Number', filter: 'agTextColumnFilter', width: 140, cellStyle: { 'text-align': 'right' } },
            { headerName: "ChSrlNo", field: " ChSrlNo", dataType: 'Number', filter: 'agTextColumnFilter', width: 140, cellStyle: { 'text-align': 'right' } },

            { headerName: "Regd.No", field: "Regd.No", dataType: 'Number', filter: 'agNumberColumnFilter', width: 140, cellStyle: { 'text-align': 'right' } },
            { headerName: "ServiceAdvisor", field: "ServiceAdvisor", dataType: 'Text', filter: 'agNumberColumnFilter', width: 140, cellStyle: { 'text-align': 'left' } },
            { headerName: "Mechanic", field: "Mechanic", dataType: 'Text', filter: 'agNumberColumnFilter', width: 180, cellStyle: { 'text-align': 'left' } },
            { headerName: "Running HR", field: "RunningHR", dataType: 'Number', filter: 'agNumberColumnFilter', width: 160, cellStyle: { 'text-align': 'right' } },

            { headerName: "Vehicle Type", field: "VehicleType", dataType: 'Text', filter: 'agNumberColumnFilter', width: 180, cellStyle: { 'text-align': 'left' } },
            { headerName: "Model", field: "Model", dataType: 'Text', filter: 'agNumberColumnFilter', width: 180, cellStyle: { 'text-align': 'left' } },
            { headerName: "Color", field: "Color", dataType: 'Text', filter: 'agNumberColumnFilter', width: 180, cellStyle: { 'text-align': 'left' } },
            { headerName: "Running KM", field: "RunningKM", dataType: 'Number', filter: 'agNumberColumnFilter', width: 140, cellStyle: { 'text-align': 'right' } },
            { headerName: "JobTobeAttended", field: "JobTobeAttended", dataType: 'Text', filter: 'agNumberColumnFilter', width: 180, cellStyle: { 'text-align': 'left' } },

            { headerName: "Complain", field: "Complain", dataType: 'Text', filter: 'agNumberColumnFilter', width: 140, cellStyle: { 'text-align': 'left' } },
            { headerName: "Remarks", field: "Remarks", dataType: 'Text', filter: 'agNumberColumnFilter', width: 180, cellStyle: { 'text-align': 'left' } },
            { headerName: "Is Closed", field: "IsClosed", dataType: 'Text', filter: 'agNumberColumnFilter', width: 160, cellStyle: { 'text-align': 'left' } },
            { headerName: "Branch Name", field: "BranchName", dataType: 'Text', filter: 'agNumberColumnFilter', width: 160, cellStyle: { 'text-align': 'left' } },

            { headerName: "Party Name", field: "PartyName", dataType: 'Text', filter: 'agNumberColumnFilter', width: 160, cellStyle: { 'text-align': 'left' } },
            { headerName: "Address", field: "Address", dataType: 'Text', filter: 'agNumberColumnFilter', width: 190, cellStyle: { 'text-align': 'left' } },
            { headerName: "Mobile No", field: "MobileNo", dataType: 'Number', filter: 'agNumberColumnFilter', width: 160, cellStyle: { 'text-align': 'right' } },

            { headerName: "Job Card For", field: "JobCardFor", dataType: 'Text', filter: 'agNumberColumnFilter', width: 160, cellStyle: { 'text-align': 'left' } },
            { headerName: "Service Type", field: "ServiceType", dataType: 'Text', filter: 'agNumberColumnFilter', width: 160, cellStyle: { 'text-align': 'left' } },

            { headerName: "Job Card Type", field: "JobCardType", dataType: 'Text', filter: 'agNumberColumnFilter', width: 180, cellStyle: { 'text-align': 'left' } },
            { headerName: "ClosedDate", field: "ClosedDate", dataType: 'DateTime', filter: 'agNumberColumnFilter', width: 180, cellStyle: { 'text-align': 'right' } },
            { headerName: "Site Location", field: "SiteLocation", dataType: 'Text', filter: 'agNumberColumnFilter', width: 180, cellStyle: { 'text-align': 'left' } },


            //{ headerName: "Complain", field: "Complain", filter: 'agNumberColumnFilter', width: 180, cellStyle: { 'text-align': 'right' } },


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


    $scope.GetAllInstallationForFeedback = function () {
        var dateFrom = new Date(($filter('date')(new Date(), 'yyyy-MM-dd')));
        var dateTo = new Date(($filter('date')(new Date(), 'yyyy-MM-dd')));

        if ($scope.InstallationForFeedback.DateFromDet)
            dateFrom = new Date(($filter('date')($scope.InstallationForFeedback.DateFromDet.dateAD, 'yyyy-MM-dd')));

        if ($scope.InstallationForFeedback.DateToDet)
            dateTo = new Date(($filter('date')($scope.InstallationForFeedback.DateToDet.dateAD, 'yyyy-MM-dd')));

        $scope.DataColl = []; //declare an empty array
        $scope.gridOptions.api.setRowData($scope.DataColl);

        var beData = {
            DateFrom: dateFrom,
            //DateTo: dateTo,

            //isPost: $scope.InstallationForFeedback.IsPost,

        };

        $scope.loadingstatus = 'running';
        $http({
            method: "post",
            url: base_url + "Service/Reporting/GetInstallationForFeedbackList",
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

    $scope.onBtExport = function () {
        var params = {
            fileName: 'data.csv',
            sheetName: 'data'
        };

        $scope.gridOptions.api.exportDataAsCsv(params);
    }

});