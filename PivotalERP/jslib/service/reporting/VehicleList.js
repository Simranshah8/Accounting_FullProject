

"use strict";

agGrid.initialiseAgGridWithAngular1(angular);



app.controller("VehicleList", function ($scope, $http, $filter, $timeout, GlobalServices, $compile) {
    $scope.Title = 'VehicleList';

    LoadData();

    $scope.onBtExportCSV = function () {
        var params = {
            fileName: 'VehicleList.csv',
            sheetName: 'VehicleList'
        };

        $scope.gridOptions.api.exportDataAsCsv(params);
    }

    function LoadData() {
        $scope.VehicleList = {
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
                headerName: "Miti", width: 140, field: "EntryDateBS", dataType: 'Text', pinned: 'left', cellRenderer: 'agGroupCellRenderer',
                showRowGroup: true,
                cellRendererParams: {
                    suppressCount: false, // turn off the row count                   
                }
            },
            { headerName: "Entry No", dataType: 'Number', field: "VehicleEntryNo", filter: 'agTextColumnFilter', width: 140, cellStyle: { 'text-align': 'center' } },
            { headerName: "Vin No", dataType: 'Text', field: "VinNo", filter: 'agTextColumnFilter', width: 140, cellStyle: { 'text-align': 'left' } },
            { headerName: "Engine No", dataType: 'Text', field: "EngineNo", filter: 'agTextColumnFilter', width: 140, cellStyle: { 'text-align': 'left' } },
            { headerName: "ChSrlNo", dataType: 'Text', field: "CHSrlNo", filter: 'agTextColumnFilter', width: 140, cellStyle: { 'text-align': 'left' } },

            { headerName: "Regd.No", dataType: 'Text', field: "RegdNo", filter: 'agNumberColumnFilter', width: 140, cellStyle: { 'text-align': 'left' } },
            { headerName: "ReceivedBy", dataType: 'Text', field: "ReceivedByName", filter: 'agNumberColumnFilter', width: 140, cellStyle: { 'text-align': 'left' } },
            { headerName: "Key No", dataType: 'Text', field: "KeyNo", filter: 'agNumberColumnFilter', width: 140, cellStyle: { 'text-align': 'left' } },
            
            { headerName: "Running HR", dataType: 'Number', field: "ReceivedHR", filter: 'agNumberColumnFilter', width: 180, cellStyle: { 'text-align': 'left' } },
            { headerName: "Running KM", dataType: 'Number', field: "ReceivedKM", filter: 'agNumberColumnFilter', width: 180, cellStyle: { 'text-align': 'left' } },

            { headerName: "Vehicle Type", dataType: 'Text', field: "VehicleType", filter: 'agNumberColumnFilter', width: 180, cellStyle: { 'text-align': 'left' } },
            { headerName: "Model", field: "VehicleModel", dataType: 'Text', filter: 'agNumberColumnFilter', width: 140, cellStyle: { 'text-align': 'left' } },
            { headerName: "Color", field: "VehicleColor", dataType: 'Text', filter: 'agNumberColumnFilter', width: 140, cellStyle: { 'text-align': 'left' } },
            
            { headerName: "Code No", field: "CodeNo", dataType: 'Text', filter: 'agNumberColumnFilter', width: 180, cellStyle: { 'text-align': 'left' } },
            { headerName: "MFG Year", field: "MFGYear", dataType: 'Text', filter: 'agNumberColumnFilter', width: 180, cellStyle: { 'text-align': 'left' } },
            { headerName: "Transporter", field: "Transporter", dataType: 'Text', filter: 'agNumberColumnFilter', width: 180, cellStyle: { 'text-align': 'left' } },
            
            { headerName: "Branch Name", field: "Branch", dataType: 'Text', filter: 'agNumberColumnFilter', width: 160, cellStyle: { 'text-align': 'left' } },

            { headerName: "Shipment No", field: "ShipmentNo", dataType: 'Text', filter: 'agNumberColumnFilter', width: 180, cellStyle: { 'text-align': 'left' } },
            { headerName: "Delivery No", field: "DeliveryNo", dataType: 'Text', filter: 'agNumberColumnFilter', width: 180, cellStyle: { 'text-align': 'left' } },
            { headerName: "LR No", field: "LRNo", dataType: 'Text', filter: 'agNumberColumnFilter', width: 160, cellStyle: { 'text-align': 'left' } },
            { headerName: "LR Date", field: "LRDate", dataType: 'DateTime', filter: 'agNumberColumnFilter', width: 160, cellStyle: { 'text-align': 'left' } },
            { headerName: "LR Driver", field: "LRDriver", dataType: 'Text', filter: 'agNumberColumnFilter', width: 190, cellStyle: { 'text-align': 'left' } },
            { headerName: "LRDriverLicNo", field: "LRDriverLicNo", dataType: 'Number', filter: 'agNumberColumnFilter', width: 160, cellStyle: { 'text-align': 'left' } },
            
            { headerName: "Party", field: "PartyName", dataType: 'Text', filter: 'agNumberColumnFilter', width: 180, cellStyle: { 'text-align': 'left' } },
            { headerName: "Address", field: "Address", dataType: 'Text', filter: 'agNumberColumnFilter', width: 180, cellStyle: { 'text-align': 'left' } },

            { headerName: "Mobile No", field: "MobileNo", dataType: 'Text', filter: 'agNumberColumnFilter', width: 180, cellStyle: { 'text-align': 'left' } },

            { headerName: "Email Id", field: "EmailId", dataType: 'Text', filter: 'agNumberColumnFilter', width: 180, cellStyle: { 'text-align': 'left' } },
            


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


    $scope.GetAllVehicleList = function () {
        var dateFrom = new Date(($filter('date')(new Date(), 'yyyy-MM-dd')));
        var dateTo = new Date(($filter('date')(new Date(), 'yyyy-MM-dd')));

        if ($scope.VehicleList.DateFromDet)
            dateFrom = new Date(($filter('date')($scope.VehicleList.DateFromDet.dateAD, 'yyyy-MM-dd')));

        if ($scope.VehicleList.DateToDet)
            dateTo = new Date(($filter('date')($scope.VehicleList.DateToDet.dateAD, 'yyyy-MM-dd')));

        $scope.DataColl = []; //declare an empty array
        $scope.gridOptions.api.setRowData($scope.DataColl);

        var beData = {
            DateFrom: dateFrom,
            DateTo: dateTo
            //isPost: $scope.VehicleList.IsPost,

        };

        $scope.loadingstatus = 'running';
        $http({
            method: "post",
            url: base_url + "Service/Reporting/GetVehicleList",
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