

"use strict";

agGrid.initialiseAgGridWithAngular1(angular);



app.controller("CashBankVoucher", function ($scope, $http, $timeout,GlobalServices) {
    $scope.Title = 'CashBankVoucher';
 var PrintPreviewAs = 1;
  const contextMenu = GlobalServices.createElementForMenu();
    LoadData();

    function Numberformat(val) {
        return $filter('number')(val, 2);
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
            { headerName: "Date(AD)", field: "Date(AD)", filter: "agTextColumnFilter", width: 100, pinned: 'left',cellStyle:{'text-align':'center'} },
            { headerName: "Date(BS)", field: "Date(BS)", filter: 'agTextColumnFilter', width: 140,cellStyle:{'text-align':'center'} },
            { headerName: "Particular", field: "Particular", filter: 'agNumberColumnFilter', width: 140, cellStyle: { 'text-align': 'left' }, valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "CostCenter", field: "CostCenter", filter: 'agNumberColumnFilter', width: 110, cellStyle: { 'text-align': 'left' }, valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "ChequeNo", field: "ChequeNo", filter: 'agNumberColumnFilter', width: 110, cellStyle: { 'text-align': 'center' }, valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "ChequeDate", field: "ChequeDate", filter: 'agNumberColumnFilter', width: 110, cellStyle: { 'text-align': 'center' }, valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "ChequeRemarks", field: "ChequeRemarks", filter: 'agNumberColumnFilter', width: 110, cellStyle: { 'text-align': 'left' }, valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "Amount", field: "Amount", filter: 'agNumberColumnFilter', width: 110, cellStyle: { 'text-align': 'right' }, valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "VoucherType", field: "VoucherType", filter: 'agNumberColumnFilter', width: 110, cellStyle: { 'text-align': 'left' }, valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "VoucherNo", field: "VoucherNo", filter: 'agNumberColumnFilter', width: 110, cellStyle: { 'text-align': 'center' }, valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "Ref.No", field: "Ref.No", filter: 'agNumberColumnFilter', width: 110, cellStyle: { 'text-align': 'center' }, valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "Receipt", field: "Receipt", filter: 'agNumberColumnFilter', width: 110, cellStyle: { 'text-align': 'left' }, valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "Payment", field: "Payment", filter: 'agNumberColumnFilter', width: 110, cellStyle: { 'text-align': 'right' }, valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "Balance", field: "Balance", filter: 'agNumberColumnFilter', width: 110, cellStyle: { 'text-align': 'right' }, valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "User", field: "User", filter: 'agNumberColumnFilter', width: 110, cellStyle: { 'text-align': 'left' }, valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "IsLocked", field: "IsLocked", filter: 'agNumberColumnFilter', width: 110, cellStyle: { 'text-align': 'left' }, valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "Branch", field: "Branch", filter: 'agNumberColumnFilter', width: 110, cellStyle: { 'text-align': 'left' }, valueFormatter: function (params) { return Numberformat(params.value); } },

            { headerName: "LogDateTime", field: "LogDateTime", filter: 'agNumberColumnFilter', width: 130, cellStyle: { 'text-align': 'center', valueFormatter: function (params) { return Numberformat(params.value); } } }
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
                down_file(base_url + "//" + res.data.Data.ResponseId, "CashBankVoucher.xlsx");
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