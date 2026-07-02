

"use strict";

agGrid.initialiseAgGridWithAngular1(angular);



app.controller("ShowBillWiseOpening", function ($scope, $http, $timeout,GlobalServices) {
    $scope.Title = 'ShowBillWiseOpening';
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
            { headerName: "BranchName", field: "BranchName", filter: "agTextColumnFilter", width: 100, cellStyle: { 'text-align': 'left' } },
            { headerName: "Name", field: "Name", filter: 'agTextColumnFilter', width: 140, cellStyle: { 'text-align': 'left' } },
            { headerName: "Code", field: "Code", filter: 'agNumberColumnFilter', width: 140, cellStyle: { 'text-align': 'left' }, valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "GroupName", field: "GroupName", filter: 'agNumberColumnFilter', width: 110, cellStyle: { 'text-align': 'left' }, valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "VoucherName", field: "VoucherName", filter: 'agNumberColumnFilter', width: 110, cellStyle: { 'text-align': 'left' }, valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "Date", field: "Date", filter: 'agNumberColumnFilter', width: 110, cellStyle: { 'text-align': 'center' }, valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "BillNo", field: "BillNo", filter: 'agNumberColumnFilter', width: 110, cellStyle: { 'text-align': 'right' }, valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "Amount", field: "Amount", filter: 'agNumberColumnFilter', width: 110, cellStyle: { 'text-align': 'right' }, valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "TotalOpeningAmt", field: "TotalOpeningAmt", filter: 'agNumberColumnFilter', width: 130, cellStyle: { 'text-align': 'right', valueFormatter: function (params) { return Numberformat(params.value); } } }
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

        // lookup the container we want the Grid to use
        $scope.eGridDiv = document.querySelector('#datatable');

        // create the grid passing in the div to use together with the columns & data we want to use
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
                down_file(base_url + "//" + res.data.Data.ResponseId, "BillWiseOpening.xlsx");
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