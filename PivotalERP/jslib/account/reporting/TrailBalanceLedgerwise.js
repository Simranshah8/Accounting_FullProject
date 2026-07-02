

"use strict";

agGrid.initialiseAgGridWithAngular1(angular);



app.controller("TrailBalanceLedgerwise", function ($scope, $http, $timeout,GlobalServices) {
    $scope.Title = 'TrailBalanceLedgerwise';
var PrintPreviewAs = 1;
 const contextMenu = GlobalServices.createElementForMenu();
    LoadData();

    function Numberformat(val) {
        return $filter('number')(val, 2);
    }
    $scope.onFilterTextBoxChanged = function () {
        $scope.gridOptions.api.setQuickFilter($scope.search);
    }

    $scope.DataColl = [];

    function LoadData() {

 $scope.GenConfig = {};
        GlobalServices.getGenConfig().then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.GenConfig = res.data.Data;
                PrintPreviewAs = $scope.GenConfig.PrintPreviewAs;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });


        var columnDefs = [
            { headerName: "S.No", field: "S.No", filter: 'agNumberColumnFilter', width: 100, pinned: 'left', cellStyle: { 'text-align': 'center' } },
            { headerName: "Code", field: "Code", filter: "agTextColumnFilter", width: 100, pinned: 'left',cellStyle:{'text-align':'left'} },
            { headerName: "LedgerGroup", field: "LedgerGroup", filter: 'agTextColumnFilter', width: 140,cellStyle:{'text-align':'left'} },
            {
                headerName: "Opening", cellStyle: { 'text-align': 'right' },
                children: [
                    { headerName: "DR", field: "DR", filter: 'agNumberColumnFilter', width: 110, valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' } },
                    { headerName: "CR", field: "CR", filter: 'agNumberColumnFilter', cellStyle: { 'text-align': 'right' } }
                ]
            },    

            { headerName: "Opening", field: "Opening", filter: 'agNumberColumnFilter', width: 110, cellStyle: { 'text-align': 'right' }, valueFormatter: function (params) { return Numberformat(params.value); } },
            {
                headerName: "Transaction", cellStyle: { 'text-align': 'right' },
                children: [
                    { headerName: "DR", field: "DR", filter: 'agNumberColumnFilter', width: 110, valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' } },
                    { headerName: "CR", field: "CR", filter: 'agNumberColumnFilter', cellStyle: { 'text-align': 'right' } }
                ]
            },    

            {
                headerName: "Closing", cellStyle: { 'text-align': 'right' },
                children: [
                    { headerName: "DR", field: "DR", filter: 'agNumberColumnFilter', width: 110, valueFormatter: function (params) { return Numberformat(params.value); }, cellStyle: { 'text-align': 'right' } },
                    { headerName: "CR", field: "CR", filter: 'agNumberColumnFilter', cellStyle: { 'text-align': 'right' } }
                ]
            },    

            { headerName: "Closing", field: "Closing", filter: 'agNumberColumnFilter', width: 110, cellStyle: { 'text-align': 'right' }, valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "Area", field: "Area", filter: 'agNumberColumnFilter', width: 110, cellStyle: { 'text-align': 'left' }, valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "Salesman", field: "Salesman", filter: 'agNumberColumnFilter', width: 110, cellStyle: { 'text-align': 'left' }, valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "MobileNo1", field: "MobileNo1", filter: 'agNumberColumnFilter', width: 110, cellStyle: { 'text-align': 'center' }, valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "MobileNo2", field: "MobileNo2", filter: 'agNumberColumnFilter', width: 110, cellStyle: { 'text-align': 'center' }, valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "EmailId", field: "EmailId", filter: 'agNumberColumnFilter', width: 110, cellStyle: { 'text-align': 'left' }, valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "Address", field: "Address", filter: 'agNumberColumnFilter', width: 130, cellStyle: { 'text-align': 'left', valueFormatter: function (params) { return Numberformat(params.value); } } }
        ];


        $scope.gridOptions = {
			onCellContextMenu: onCellContextMenu, // Handle right-click event
            defaultColDef: {
                filter: true,
                resizable: true,
                sortable: true,
                width: 100,

            },
            enableSorting: true,
            multiSortKey: 'ctrl',
            enableColResize: true,
            overlayLoadingTemplate: "Please Click the Load Bottom to display the data",
            overlayNoRowsTemplate: "No Records found",
            rowSelection: 'multiple',
            columnDefs: columnDefs,
            rowData: null,
            filter: true,
            suppressHorizontalScroll: true,
            alignedGrids: [],
            enableFilter: true

        };

        $scope.eGridDiv = document.querySelector('#datatable');

        new agGrid.Grid($scope.eGridDiv, $scope.gridOptions);
		
		$timeout(function () {
            GlobalServices.getListState(EntityId, $scope.gridOptions);
        });
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
                down_file(base_url + "//" + res.data.Data.ResponseId, "TBLedgerWise.xlsx");
            }

        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            Swal.fire(errormessage);
        });
    }
	
	 $scope.saveRptListState = function () {
        GlobalServices.saveRptListState(EntityId, $scope.gridOptions);
    };
    $scope.DelListState = function () {
        GlobalServices.delListStateRpt(EntityId);
    }
    function onCellContextMenu(event) {
        GlobalServices.onCellContextMenu(event, $scope.gridOptions, contextMenu);
    }

    // Hide context menu when clicking outside
    document.addEventListener('click', function () {
        contextMenu.style.display = 'none';
    });

    $(document).ready(function () {
        $(this).bind("contextmenu", function (e) {
            e.preventDefault();
        });
    });
	
});