

"use strict";

agGrid.initialiseAgGridWithAngular1(angular);



app.controller("RepeatedComplainList", function ($scope, $http, $filter, $timeout, GlobalServices, $compile) {
    $scope.Title = 'RepeatedComplainList';

    LoadData();

    $scope.onBtExportCSV = function () {
        var params = {
            fileName: 'RepeatedComplainList.csv',
            sheetName: 'RepeatedComplainList'
        };

        $scope.gridOptions.api.exportDataAsCsv(params);
    }

    function LoadData() {
        $scope.RepeatedComplainList = {
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


            { headerName: "JobNo", dataType: 'Number', field: "JobNo", filter: 'agTextColumnFilter', width: 140, cellStyle: { 'text-align': 'right' } },
            { headerName: "Vin.No", dataType: 'Number', field: "Vin.No", filter: 'agTextColumnFilter', width: 140, cellStyle: { 'text-align': 'right' } },
            { headerName: "EngineNo", dataType: 'Number', field: "EngineNo", filter: 'agTextColumnFilter', width: 140, cellStyle: { 'text-align': 'right' } },
            { headerName: "ChSrlNo", dataType: 'Number', field: " ChSrlNo", filter: 'agTextColumnFilter', width: 140, cellStyle: { 'text-align': 'right' } },
            { headerName: "Regd.No", dataType: 'Number', field: "Regd.No", filter: 'agNumberColumnFilter', width: 140, cellStyle: { 'text-align': 'right' } },
            { headerName: "ServiceAdvisor", dataType: 'Text', field: "ServiceAdvisor", filter: 'agNumberColumnFilter', width: 140, cellStyle: { 'text-align': 'left' } },
            { headerName: "Mechanic", dataType: 'Text', field: "Mechanic", filter: 'agNumberColumnFilter', width: 180, cellStyle: { 'text-align': 'left' } },
            { headerName: "Running HR", dataType: 'Number', field: "RunningHR", filter: 'agNumberColumnFilter', width: 160, cellStyle: { 'text-align': 'right' } },

            { headerName: "Vehicle Type", dataType: 'Text', field: "VehicleType", filter: 'agNumberColumnFilter', width: 180, cellStyle: { 'text-align': 'left' } },
            { headerName: "Model", dataType: 'Text', field: "Model", filter: 'agNumberColumnFilter', width: 180, cellStyle: { 'text-align': 'left' } },
            { headerName: "Color", dataType: 'Text', field: "Color", filter: 'agNumberColumnFilter', width: 180, cellStyle: { 'text-align': 'left' } },
            { headerName: "Running KM", dataType: 'Number', field: "Running KM", filter: 'agNumberColumnFilter', width: 140, cellStyle: { 'text-align': 'right' } },
            { headerName: "JobTobeAttended", dataType: 'Text', field: "JobTobeAttended", filter: 'agNumberColumnFilter', width: 180, cellStyle: { 'text-align': 'left' } },

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
            { headerName: "Close Remarks", dataType: 'Text', field: "CloseRemarks", filter: 'agNumberColumnFilter', width: 160, cellStyle: { 'text-align': 'left' } },
            { headerName: "Site Location", dataType: 'Text', field: "SiteLocation", filter: 'agNumberColumnFilter', width: 180, cellStyle: { 'text-align': 'left' } },
            { headerName: "Total Days", dataType: 'Number', field: "TotalDays", filter: 'agNumberColumnFilter', width: 160, cellStyle: { 'text-align': 'right' } },


            //{ headerName: "Part Amt", dataType: 'Number', field: "PartAmt", filter: 'agNumberColumnFilter', width: 180, cellStyle: { 'text-align': 'right' } },
            //{ headerName: "OutSitePartsAmount", dataType: 'Number', field: "OutSitePartsAmount", filter: 'agNumberColumnFilter', width: 200, cellStyle: { 'text-align': 'right' } },
            //{ headerName: "Labour Charge", dataType: 'Number', field: "LabourCharge", filter: 'agNumberColumnFilter', width: 160, cellStyle: { 'text-align': 'right' } },
            //{ headerName: "Total Amount", dataType: 'Number', field: "TotalAmount", filter: 'agNumberColumnFilter', width: 190, cellStyle: { 'text-align': 'right' } },



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


    $scope.GetAllRepeatedComplainList = function () {
        var dateFrom = new Date(($filter('date')(new Date(), 'yyyy-MM-dd')));
        var dateTo = new Date(($filter('date')(new Date(), 'yyyy-MM-dd')));

        if ($scope.RepeatedComplainList.DateFromDet)
            dateFrom = new Date(($filter('date')($scope.RepeatedComplainList.DateFromDet.dateAD, 'yyyy-MM-dd')));

        if ($scope.RepeatedComplainList.DateToDet)
            dateTo = new Date(($filter('date')($scope.RepeatedComplainList.DateToDet.dateAD, 'yyyy-MM-dd')));

        $scope.DataColl = []; //declare an empty array
        $scope.gridOptions.api.setRowData($scope.DataColl);

        var beData = {
            DateFrom: dateFrom,
            DateTo: dateTo,
            count: $scope.RepeatedComplainList.count,
            Complaint: $scope.RepeatedComplainList.Complaint
        };

        $scope.loadingstatus = 'running';
        $http({
            method: "post",
            url: base_url + "Service/Reporting/GetRepeatedComplainList",
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