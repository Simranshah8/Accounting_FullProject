
app.controller("MachineLogController", function ($scope, $http, $filter, $timeout, GlobalServices, $compile) {

    LoadData();
    $scope.onBtExportCSV = function () {
        var params = {
            fileName: 'MachineLog.csv',
            sheetName: 'MachineLog'
        };

        $scope.gridOptions.api.exportDataAsCsv(params);
    }
    $scope.onFilterTextBoxChanged = function () {
        $scope.gridOptions.api.setQuickFilter($scope.search);
    }

    function LoadData() {

        $scope.filterMachineLog = {
            DateFrom_TMP: new Date(),
            DateTo_TMP: new Date()
        };


        $scope.columnDefs = [
            { headerName: "MachineSerialNo", width: 150, field: "MachineSerialNo", filter: 'agTextColumnFilter', pinned: 'left', dataType: 'Text', cellStyle: { 'text-align': 'text' } },
            { headerName: "MachineName", width: 150, field: "MachineName", filter: 'agTextColumnFilter', pinned: 'left', dataType: 'Text', cellStyle: { 'text-align': 'text' } },            
            { headerName: "EnrollNumber", width: 150, field: "EnrollNumber", dataType: 'Number', cellStyle: { 'text-align': 'left' }, filter: "agNumberColumnFilter", },
            { headerName: "PunchDateTime", width: 150, field: "PunchDateTime", dataType: 'Date', cellStyle: { 'text-align': 'left' }, filter: "agDateColumnFilter" },
            { headerName: "Location", width: 150, field: "MachineLocation", filter: 'agTextColumnFilter',   dataType: 'Text', },
            { headerName: "IPAddress", width: 150, field: "IPAddress", filter: 'agTextColumnFilter',   dataType: 'Text', },
            { headerName: "Employee Name", width: 200, field: "Name", dataType: 'Text', cellStyle: { 'text-align': 'left' }, filter: "agTextColumnFilter", },
            { headerName: "EmployeeCode", width: 200, field: "EmployeeCode", dataType: 'Text', cellStyle: { 'text-align': 'left' }, filter: "agTextColumnFilter",},
            { headerName: "Department", width: 200, field: "Department", dataType: 'Text', cellStyle: { 'text-align': 'left' }, filter: "agTextColumnFilter", },
            { headerName: "Designation", width: 200, field: "Designation", dataType: 'Text', cellStyle: { 'text-align': 'left' }, filter: "agTextColumnFilter", },
            { headerName: "Group", width: 200, field: "GroupName", dataType: 'Text', cellStyle: { 'text-align': 'left' }, filter: "agTextColumnFilter", },
            { headerName: "PunchMiti", width: 150, field: "PunchMiti", dataType: 'Date', cellStyle: { 'text-align': 'left' }, filter: "agTextColumnFilter" },
            { headerName: "LogDateTime", width: 150, field: "LogDateTime", dataType: 'Date', cellStyle: { 'text-align': 'left' }, filter: "agDateColumnFilter" }
           
        ];

        $scope.gridOptions = {
            defaultColDef: {
                filter: true,
                resizable: true,
                sortable: true
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
            enableFilter: true,
        };

        // Initialize grid after DOM is ready
        $timeout(function () {
            var eGridDiv = document.querySelector('#datatable');
            new agGrid.Grid(eGridDiv, $scope.gridOptions);
        });
    }



    $scope.ClearData = function () {

        var DataColl = [];
        $scope.gridOptionsBottom.api.setRowData(DataColl);

        $scope.gridOptions.api.setRowData(DataColl);
    };


    $scope.GetMachineLog = function () {
       
        $scope.DataColl = []; //declare an empty array

        var dateFrom = new Date(($filter('date')(new Date(), 'yyyy-MM-dd')));
        var dateTo = new Date(($filter('date')(new Date(), 'yyyy-MM-dd')));

        if ($scope.filterMachineLog.DateFromDet)
            dateFrom = new Date(($filter('date')($scope.filterMachineLog.DateFromDet.dateAD, 'yyyy-MM-dd')));

        if ($scope.filterMachineLog.DateToDet)
            dateTo = new Date(($filter('date')($scope.filterMachineLog.DateToDet.dateAD, 'yyyy-MM-dd')));

        var beData = {
            DateFrom: dateFrom,
            DateTo: dateTo
        };

        $scope.loadingstatus = 'running';

        $http({
            method: "post",
            url: base_url + "HR/Report/GetMachineLog",
            data: JSON.stringify(beData),
            dataType: "json"
        }).then(function (res) {
            $scope.loadingstatus = 'Stop';
            if (res.data.IsSuccess) {
                $scope.DataColl = res.data.Data;
                $scope.gridOptions.api.setRowData($scope.DataColl);
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        },function (reason) {
            Swal.fire('Failed' + reason);
        });

    };


    $scope.DownloadAsXls = function () {
        $scope.loadingstatus = 'running';
        showPleaseWait();
        var dataColl = $scope.GetDataForPrint();

        var paraData = {
            DateFrom: $filter('date')($scope.newDaily.DateFromDet.dateAD, 'yyyy-MM-dd'),
            DateTo: $filter('date')($scope.newDaily.DateToDet.dateAD, 'yyyy-MM-dd'),
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
                down_file(base_url + "//" + res.data.Data.ResponseId, "MachineLog.xlsx");
            }

        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            Swal.fire(errormessage);
        });
    }

    $scope.GetDataForPrint = function () {
        var filterData = [];
        $scope.gridOptions.api.forEachNodeAfterFilterAndSort(function (node) {
            var dayBook = node.data;
            filterData.push(dayBook);
        });
        return filterData;
    }

    $scope.onFilterTextBoxChanged = function () {
        $scope.gridOptions.api.setQuickFilter($scope.search);
    }


});
