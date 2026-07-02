

"use strict";

agGrid.initialiseAgGridWithAngular1(angular);



app.controller("ServiceFeedbackList", function ($scope, $http, $filter, $timeout, GlobalServices, $compile) {
    $scope.Title = 'ServiceFeedbackList';

    LoadData();

    $scope.onBtExportCSV = function () {
        var params = {
            fileName: 'ServiceFeedbackList.csv',
            sheetName: 'ServiceFeedbackList'
        };

        $scope.gridOptions.api.exportDataAsCsv(params);
    }

    function LoadData() {
        $scope.ServiceFeedbackList = {
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


            { headerName: "JobNo", field: "Particulars", dataType: 'Number', filter: 'agTextColumnFilter', width: 140, cellStyle: { 'text-align': 'right' } },
            { headerName: "EngineNo", field: "EngineNo", dataType: 'Number', filter: 'agTextColumnFilter', width: 140, cellStyle: { 'text-align': 'right' } },
            { headerName: "ChSrlNo", field: " ChSrlNo", dataType: 'Number', filter: 'agTextColumnFilter', width: 140, cellStyle: { 'text-align': 'right' } },
            { headerName: "Vin.No", field: "Vin.No", dataType: 'Number', filter: 'agTextColumnFilter', width: 140, cellStyle: { 'text-align': 'right' } },
            { headerName: "Regd.No", field: "Regd.No", dataType: 'Number', filter: 'agNumberColumnFilter', width: 140, cellStyle: { 'text-align': 'right' } },
            //{ headerName: "TeamLeader", field: "TeamLeader", filter: 'agNumberColumnFilter', width: 140, cellStyle: { 'text-align': 'right' } },
            { headerName: "ServiceAdvisor", dataType: 'Text', field: "ServiceAdvisor", filter: 'agNumberColumnFilter', width: 180, cellStyle: { 'text-align': 'left' } },
            { headerName: "Mechanic", dataType: 'Text', field: "Mechanic", filter: 'agNumberColumnFilter', width: 160, cellStyle: { 'text-align': 'left' } },

            { headerName: "Running HR", field: "RunningHR", dataType: 'Number', filter: 'agNumberColumnFilter', width: 180, cellStyle: { 'text-align': 'right' } },
            { headerName: "Vehicle Type", field: "VehicleType", dataType: 'Text', filter: 'agNumberColumnFilter', width: 180, cellStyle: { 'text-align': 'left' } },
            { headerName: "Model", field: "Model", dataType: 'Text', filter: 'agNumberColumnFilter', width: 140, cellStyle: { 'text-align': 'left' } },
            { headerName: "Color", field: "Color", dataType: 'Text', filter: 'agNumberColumnFilter', width: 140, cellStyle: { 'text-align': 'left' } },
            { headerName: "Running KM", field: "RunningKM", dataType: 'Number', filter: 'agNumberColumnFilter', width: 180, cellStyle: { 'text-align': 'right' } },

            { headerName: "Job TobeAttended", dataType: 'Text', field: "JobTobeAttended", filter: 'agNumberColumnFilter', width: 180, cellStyle: { 'text-align': 'left' } },
            { headerName: "Complain", dataType: 'Text', field: "Complain", filter: 'agNumberColumnFilter', width: 180, cellStyle: { 'text-align': 'left' } },
            { headerName: "Remarks", dataType: 'Text', field: "Remarks", filter: 'agNumberColumnFilter', width: 180, cellStyle: { 'text-align': 'left' } },
            { headerName: "Is Closed", dataType: 'Text', field: "IsClosed", filter: 'agNumberColumnFilter', width: 160, cellStyle: { 'text-align': 'left' } },
            { headerName: "Branch Name", dataType: 'Text', field: "BranchName", filter: 'agNumberColumnFilter', width: 160, cellStyle: { 'text-align': 'left' } },
            { headerName: "Party Name", dataType: 'Text', field: "PartyName", filter: 'agNumberColumnFilter', width: 160, cellStyle: { 'text-align': 'left' } },
            { headerName: "Address", dataType: 'Text', field: "Address", filter: 'agNumberColumnFilter', width: 190, cellStyle: { 'text-align': 'left' } },
            { headerName: "Mobile No", dataType: 'Number', field: "MobileNo", filter: 'agNumberColumnFilter', width: 160, cellStyle: { 'text-align': 'right' } },
            { headerName: "Job Card For", dataType: 'Text', field: "JobCardFor", filter: 'agNumberColumnFilter', width: 160, cellStyle: { 'text-align': 'left' } },
            { headerName: "Service Type", dataType: 'Text', field: "ServiceType", filter: 'agNumberColumnFilter', width: 160, cellStyle: { 'text-align': 'left' } },

            { headerName: "Job Card Type", dataType: 'Text', field: "JobCardType", filter: 'agNumberColumnFilter', width: 180, cellStyle: { 'text-align': 'left' } },
            { headerName: "ClosedDate", dataType: 'DateTime', field: "ClosedDate", filter: 'agNumberColumnFilter', width: 180, cellStyle: { 'text-align': 'center' } },
            { headerName: "FollowUpDate", dataType: 'DateTime', field: "FollowUpDate", filter: 'agNumberColumnFilter', width: 180, cellStyle: { 'text-align': 'center' } },
            { headerName: "FollowUpDate(B.S)", dataType: 'DateTime', field: "FollowUpDate(B.S)", filter: 'agNumberColumnFilter', width: 180, cellStyle: { 'text-align': 'center' } },
            { headerName: "Feedback", dataType: 'Text', field: "Feedback", filter: 'agNumberColumnFilter', width: 180, cellStyle: { 'text-align': 'right' } },
            { headerName: "FeedbackRemarks", dataType: 'Text', field: "FeedbackRemarks", filter: 'agNumberColumnFilter', width: 180, cellStyle: { 'text-align': 'left' } },
            { headerName: "Q.No1", field: "Q.No1", dataType: 'Number', filter: 'agNumberColumnFilter', width: 180, cellStyle: { 'text-align': 'right' } },
            { headerName: "Q.No2", field: "Q.No2", dataType: 'Number', filter: 'agNumberColumnFilter', width: 180, cellStyle: { 'text-align': 'right' } },
            { headerName: "Q.No2", field: "Q.No3", dataType: 'Number', filter: 'agNumberColumnFilter', width: 180, cellStyle: { 'text-align': 'right' } },
            { headerName: "Q.No4", field: "Q.No4", dataType: 'Number', filter: 'agNumberColumnFilter', width: 180, cellStyle: { 'text-align': 'right' } },
            { headerName: "ObtainedMark", field: "Q.No4", dataType: 'Number', filter: 'agNumberColumnFilter', width: 180, cellStyle: { 'text-align': 'right' } },
            { headerName: "UserName", field: "UserName", dataType: 'Text', filter: 'agNumberColumnFilter', width: 180, cellStyle: { 'text-align': 'left' } },
            { headerName: "Site Location", field: "SiteLocation", dataType: 'Text', filter: 'agNumberColumnFilter', width: 180, cellStyle: { 'text-align': 'left' } },


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


    $scope.GetAllServiceFeedbackList = function () {
        var dateFrom = new Date(($filter('date')(new Date(), 'yyyy-MM-dd')));
        var dateTo = new Date(($filter('date')(new Date(), 'yyyy-MM-dd')));

        if ($scope.ServiceFeedbackList.DateFromDet)
            dateFrom = new Date(($filter('date')($scope.ServiceFeedbackList.DateFromDet.dateAD, 'yyyy-MM-dd')));

        if ($scope.ServiceFeedbackList.DateToDet)
            dateTo = new Date(($filter('date')($scope.ServiceFeedbackList.DateToDet.dateAD, 'yyyy-MM-dd')));

        $scope.DataColl = []; //declare an empty array
        $scope.gridOptions.api.setRowData($scope.DataColl);

        var beData = {
            DateFrom: dateFrom,
            //DateTo: dateTo,

            //isPost: $scope.ServiceFeedbackList.IsPost,

        };

        $scope.loadingstatus = 'running';
        $http({
            method: "post",
            url: base_url + "Service/Reporting/GetServiceFeedbackListList",
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