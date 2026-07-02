

"use strict";

agGrid.initialiseAgGridWithAngular1(angular);



app.controller("JobCardDuesList", function ($scope, $http, $filter, $timeout, GlobalServices, $compile) {
    $scope.Title = 'JobCardDuesList';

    LoadData();

    $scope.onBtExportCSV = function () {
        var params = {
            fileName: 'JobCardDuesList.csv',
            sheetName: 'JobCardDuesList'
        };

        $scope.gridOptions.api.exportDataAsCsv(params);
    }

    function LoadData() {
        $scope.JobCardDuesList = {
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
            { headerName: "ServiceAdvisor", dataType: 'Text', field: "ServiceAdvisor", filter: 'agNumberColumnFilter', width: 140, cellStyle: { 'text-align': 'left' } },
            { headerName: "Mechanic", dataType: 'Text', field: "Mechanic", filter: 'agNumberColumnFilter', width: 180, cellStyle: { 'text-align': 'left' } },
            { headerName: "Running HR", dataType: 'Number', field: "RunningHR", filter: 'agNumberColumnFilter', width: 160, cellStyle: { 'text-align': 'right' } },

            { headerName: "Vehicle Type", dataType: 'Text', field: "VehicleType", filter: 'agNumberColumnFilter', width: 180, cellStyle: { 'text-align': 'left' } },
            { headerName: "Model", dataType: 'Text', field: "Model", filter: 'agNumberColumnFilter', width: 180, cellStyle: { 'text-align': 'left' } },
            { headerName: "Color", dataType: 'Text', field: "Color", filter: 'agNumberColumnFilter', width: 180, cellStyle: { 'text-align': 'left' } },
            { headerName: "Running KM", ataType: 'Text', field: "Running KM", filter: 'agNumberColumnFilter', width: 140, cellStyle: { 'text-align': 'left' } },
            { headerName: "JobTobeAttended", ataType: 'Text', field: "JobTobeAttended", filter: 'agNumberColumnFilter', width: 180, cellStyle: { 'text-align': 'left' } },

            { headerName: "Complain", dataType: 'Text', field: "Complain", filter: 'agNumberColumnFilter', width: 140, cellStyle: { 'text-align': 'left' } },
            { headerName: "Remarks", dataType: 'Text', field: "Remarks", filter: 'agNumberColumnFilter', width: 180, cellStyle: { 'text-align': 'left' } },
            { headerName: "Is Closed", dataType: 'Text', field: "IsClosed", filter: 'agNumberColumnFilter', width: 160, cellStyle: { 'text-align': 'left' } },
            { headerName: "Branch Name", dataType: 'Text', field: "BranchName", filter: 'agNumberColumnFilter', width: 160, cellStyle: { 'text-align': 'left' } },

            { headerName: "Party Name", dataType: 'Text', field: "PartyName", filter: 'agNumberColumnFilter', width: 160, cellStyle: { 'text-align': 'left' } },
            { headerName: "Address", dataType: 'Text', field: "Address", filter: 'agNumberColumnFilter', width: 190, cellStyle: { 'text-align': 'left' } },
            { headerName: "Mobile No", dataType: 'Number', field: "MobileNo", filter: 'agNumberColumnFilter', width: 160, cellStyle: { 'text-align': 'right' } },

            { headerName: "Job Card For", dataType: 'Text', field: "JobCardFor", filter: 'agNumberColumnFilter', width: 160, cellStyle: { 'text-align': 'left' } },
            { headerName: "Service Type", dataType: 'Text', field: "ServiceType", filter: 'agNumberColumnFilter', width: 160, cellStyle: { 'text-align': 'left' } },

            { headerName: "Job Card Type", dataType: 'Text', field: "JobCardType", filter: 'agNumberColumnFilter', width: 180, cellStyle: { 'text-align': 'left' } },
            { headerName: "ClosedDate", dataType: 'DateTime', field: "ClosedDateTime", filter: 'agNumberColumnFilter', width: 180, cellStyle: { 'text-align': 'center' } },

            { headerName: "Part Amt", dataType: 'Number', field: "PartAmt", filter: 'agNumberColumnFilter', width: 180, cellStyle: { 'text-align': 'right' } },
            { headerName: "OutSitePartsAmount", dataType: 'Number', field: "OutSitePartsAmount", filter: 'agNumberColumnFilter', width: 200, cellStyle: { 'text-align': 'right' } },
            { headerName: "Labour Charge", dataType: 'Number', field: "LabourCharge", filter: 'agNumberColumnFilter', width: 160, cellStyle: { 'text-align': 'right' } },
            { headerName: "Total Amount", dataType: 'Number', field: "TotalAmount", filter: 'agNumberColumnFilter', width: 190, cellStyle: { 'text-align': 'right' } },
            { headerName: "Close Remarks", dataType: 'Text', field: "CloseRemarks", filter: 'agNumberColumnFilter', width: 160, cellStyle: { 'text-align': 'left' } },
            { headerName: "Site Location", dataType: 'Text', field: "SiteLocation", filter: 'agNumberColumnFilter', width: 180, cellStyle: { 'text-align': 'right' } },
            { headerName: "Total Days", dataType: 'Number', field: "TotalDays", filter: 'agNumberColumnFilter', width: 160, cellStyle: { 'text-align': 'right' } },


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


    $scope.GetAllJobCardDuesList = function () {
        var dateFrom = new Date(($filter('date')(new Date(), 'yyyy-MM-dd')));
        var dateTo = new Date(($filter('date')(new Date(), 'yyyy-MM-dd')));

        if ($scope.JobCardDuesList.DateFromDet)
            dateFrom = new Date(($filter('date')($scope.JobCardDuesList.DateFromDet.dateAD, 'yyyy-MM-dd')));

        if ($scope.JobCardDuesList.DateToDet)
            dateTo = new Date(($filter('date')($scope.JobCardDuesList.DateToDet.dateAD, 'yyyy-MM-dd')));

        $scope.DataColl = []; //declare an empty array
        $scope.gridOptions.api.setRowData($scope.DataColl);

        var beData = {            
            DateTo: forDate,
            Complaint: $scope.JobCardDuesList.Complaint,
            FromDays: $scope.JobCardDuesList.FromDays,
            ToDays: $scope.JobCardDuesList.ToDays
            //isPost: $scope.JobCardDuesList.IsPost,

        };

        $scope.loadingstatus = 'running';
        $http({
            method: "post",
            url: base_url + "Service/Reporting/GetJobCardDuesList",
            data: JSON.stringify(beData),
            dataType: "json"
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