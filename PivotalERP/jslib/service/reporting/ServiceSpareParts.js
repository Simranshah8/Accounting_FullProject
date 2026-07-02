

"use strict";

agGrid.initialiseAgGridWithAngular1(angular);



app.controller("ServiceSpareParts", function ($scope, $http, $filter, $timeout, GlobalServices, $compile) {
    $scope.Title = 'ServiceSpareParts';

    LoadData();

    $scope.onBtExportCSV = function () {
        var params = {
            fileName: 'ServiceSpareParts.csv',
            sheetName: 'ServiceSpareParts'
        };

        $scope.gridOptions.api.exportDataAsCsv(params);
    }

    function LoadData() {
        $scope.ServiceSpareParts = {
            DateFrom_TMP: new Date(),
            DateTo_TMP: new Date(),
        };

        $scope.loadingstatus = "stop";
        $scope.columnDefs = [
            {
                headerName: "Date", width: 140, field: "EntryDate", dataType: 'DateTime', pinned: 'left', cellRenderer: 'agGroupCellRenderer',
                valueFormatter: function (params) { return DateFormatAD(params.value); },
                showRowGroup: true,
                cellRendererParams: {
                    suppressCount: false, // turn off the row count                   
                }
            },
            {
                headerName: "Miti", width: 140, field: "EntryDateBS", dataType: 'DateTime', pinned: 'left', cellRenderer: 'agGroupCellRenderer',                
                showRowGroup: true,
                cellRendererParams: {
                    suppressCount: false, // turn off the row count                   
                }
            },

            { headerName: "JobNo", dataType: 'Text', field: "JobCardNo", filter: 'agTextColumnFilter', width: 140, cellStyle: { 'text-align': 'left' } },
            { headerName: "EngineNo", dataType: 'Text', field: "EngineNo", filter: 'agTextColumnFilter', width: 140, cellStyle: { 'text-align': 'left' } },
            { headerName: "ChSrlNo", dataType: 'Text', field: "ChSrlNo", filter: 'agTextColumnFilter', width: 140, cellStyle: { 'text-align': 'left' } },
            { headerName: "Vin.No", dataType: 'Text', field: "VinNo", filter: 'agTextColumnFilter', width: 140, cellStyle: { 'text-align': 'left' } },
            { headerName: "Regd.No", dataType: 'Text', field: "RegdNo", filter: 'agTextColumnFilter', width: 140, cellStyle: { 'text-align': 'left' } },
            { headerName: "ProductName", dataType: 'Text', field: "ProductName", filter: 'agTextColumnFilter', width: 200, cellStyle: { 'text-align': 'left' } },
            { headerName: "Alias", dataType: 'Text', field: "Alias", filter: 'agTextColumnFilter', width: 120, cellStyle: { 'text-align': 'left' } },
            { headerName: "Code", dataType: 'Text', field: "Code", filter: 'agTextColumnFilter', width: 120, cellStyle: { 'text-align': 'left' } },
            { headerName: "Part No", dataType: 'Text', field: "PartNo", filter: 'agTextColumnFilter', width: 140, cellStyle: { 'text-align': 'left' } },
            { headerName: "Demant Qty", dataType: 'Number', field: "DemandQty", filter: 'agNumberColumnFilter', width: 110, cellStyle: { 'text-align': 'right' } },
            { headerName: "Issue Qty", dataType: 'Number', field: "Qty", filter: 'agNumberColumnFilter', width: 110, cellStyle: { 'text-align': 'right' } },
            { headerName: "Rate", dataType: 'Number', field: "Rate", filter: 'agNumberColumnFilter', width: 110, cellStyle: { 'text-align': 'right' } },
            { headerName: "Amount", dataType: 'Number', field: "Amount", filter: 'agNumberColumnFilter', width: 130, cellStyle: { 'text-align': 'right' } },
           /* { headerName: "Under Warrenty", dataType: 'Text', field: "UnderWarrenty", filter: 'agNumberColumnFilter', width: 130, cellStyle: { 'text-align': 'right' } },*/
            { headerName: "Unit", dataType: 'Text', field: "Unit", filter: 'agNumberColumnFilter', width: 110, cellStyle: { 'text-align': 'right' } },
           
            { headerName: "Remarks", dataType: 'Text', field: "Remarks", filter: 'agTextColumnFilter', width: 180, cellStyle: { 'text-align': 'left' } },
            { headerName: "Branch Name", dataType: 'Text', field: "BranchName", filter: 'agTextColumnFilter', width: 160, cellStyle: { 'text-align': 'left' } },
            { headerName: "Party Name", dataType: 'Text', field: "Party", filter: 'agTextColumnFilter', width: 160, cellStyle: { 'text-align': 'left' } },
            { headerName: "Address", dataType: 'Text', field: "Address", filter: 'agTextColumnFilter', width: 190, cellStyle: { 'text-align': 'left' } },
            { headerName: "Mobile No", dataType: 'Text', field: "ContactNo", filter: 'agTextColumnFilter', width: 160, cellStyle: { 'text-align': 'right' } },
            { headerName: "Job Card For", dataType: 'Text', field: "JobCardFor", filter: 'agTextColumnFilter', width: 160, cellStyle: { 'text-align': 'left' } },
            { headerName: "Job Card Type", dataType: 'Text', field: "JobCardType", filter: 'agTextColumnFilter', width: 180, cellStyle: { 'text-align': 'right' } },

            /*{ headerName: "Is Closed", dataType: 'Text', field: "IsClosed", filter: 'agNumberColumnFilter', width: 160, cellStyle: { 'text-align': 'left' } },*/
            /*  { headerName: "Service Type", dataType: 'Text', field: "ServiceType", filter: 'agNumberColumnFilter', width: 160, cellStyle: { 'text-align': 'left' } },*/
             //{ headerName: "TeamLeader", dataType: 'Text', field: "TeamLeader", filter: 'agNumberColumnFilter', width: 140, cellStyle: { 'text-align': 'left' } },
            //{ headerName: "ServiceEngineer", dataType: 'Text', field: "ServiceEngineer", filter: 'agNumberColumnFilter', width: 180, cellStyle: { 'text-align': 'left' } },
            //{ headerName: "Mechanic", dataType: 'Text', field: "Mechanic", filter: 'agNumberColumnFilter', width: 160, cellStyle: { 'text-align': 'left' } },

            //{ headerName: "Running HR", dataType: 'Number', field: "RunningHR", filter: 'agNumberColumnFilter', width: 180, cellStyle: { 'text-align': 'right' } },
            //{ headerName: "Running KM", dataType: 'Number', field: "RunningKM", filter: 'agNumberColumnFilter', width: 180, cellStyle: { 'text-align': 'right' } },
            //{ headerName: "Vehicle Type", dataType: 'Text', field: "VehicleType", filter: 'agNumberColumnFilter', width: 180, cellStyle: { 'text-align': 'left' } },
            //{ headerName: "Model", field: "Model", dataType: 'Text', filter: 'agNumberColumnFilter', width: 140, cellStyle: { 'text-align': 'left' } },
            //{ headerName: "Color", field: "Color", dataType: 'Text', filter: 'agNumberColumnFilter', width: 140, cellStyle: { 'text-align': 'left' } },
            //{ headerName: "Job TobeAttended", dataType: 'Text', field: "JobTobeAttended", filter: 'agNumberColumnFilter', width: 180, cellStyle: { 'text-align': 'left' } },
            /*  { headerName: "Complain", dataType: 'Text', field: "Complain", filter: 'agNumberColumnFilter', width: 180, cellStyle: { 'text-align': 'left' } },*/
            //{ headerName: "ClosedDate", dataType: 'DateTime', field: "ClosedDateTime", filter: 'agNumberColumnFilter', width: 180, cellStyle: { 'text-align': 'right' } },
            //{ headerName: "Site Location", dataType: 'Text', field: "SiteLocation", filter: 'agNumberColumnFilter', width: 180, cellStyle: { 'text-align': 'right' } },

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


    $scope.GetAllServiceSpareParts = function () {
        var dateFrom = new Date(($filter('date')(new Date(), 'yyyy-MM-dd')));
        var dateTo = new Date(($filter('date')(new Date(), 'yyyy-MM-dd')));

        if ($scope.ServiceSpareParts.DateFromDet)
            dateFrom = new Date(($filter('date')($scope.ServiceSpareParts.DateFromDet.dateAD, 'yyyy-MM-dd')));

        if ($scope.ServiceSpareParts.DateToDet)
            dateTo = new Date(($filter('date')($scope.ServiceSpareParts.DateToDet.dateAD, 'yyyy-MM-dd')));

        $scope.DataColl = []; //declare an empty array
        $scope.gridOptions.api.setRowData($scope.DataColl);

        var beData = {
            DateFrom: dateFrom,
            DateTo: dateTo
        };

        $scope.loadingstatus = 'running';
        $http({
            method: "post",
            url: base_url + "Service/Reporting/GetSparePartsList",
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