"use strict";

agGrid.initialiseAgGridWithAngular1(angular);

app.controller('pendingPOSummaryCtrl', function ($scope, $http, $filter, $timeout,GlobalServices, companyDet) {
	
	  var PrintPreviewAs = 1;
    const contextMenu = GlobalServices.createElementForMenu();
	
    LoadData();


    function Numberformat(val) {
        return $filter('number')(val, 2);
    }

    $scope.DataColl = [];
    $scope.DateFrom = null;
    $scope.DateTo = null;

    $scope.unitColl = [];
    function LoadData() {

        $('.select2').select2()
        var columnDefs = [
            { headerName: "S.No.", field: "SNo", filter: 'agNumberColumnFilter', width: 70, pinned: 'left', cellStyle: { 'text-align': 'center' } },
            { headerName: "Name", field: "Name", filter: "agTextColumnFilter", width: 210, cellStyle: { 'text-align': 'left' } },
            { headerName: "Group", field: "ProductGroup", filter: 'agTextColumnFilter', width: 140, cellStyle: { 'text-align': 'left' } },
            { headerName: "Brand", field: "ProductBrand", filter: 'agTextColumnFilter', width: 140, cellStyle: { 'text-align': 'left' } },
            { headerName: "Type", field: "ProductType", filter: 'agTextColumnFilter', width: 140, cellStyle: { 'text-align': 'left' } },
            { headerName: "Pending Qty.", field: "Qty", filter: 'agNumberColumnFilter', width: 150, cellStyle: { 'text-align': 'right' }, valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "Unit", field: "Unit", filter: 'agTextColumnFilter', width: 140,cellStyle: { 'text-align': 'left' } }
        ];

        $scope.gridOptions = {
						onCellContextMenu: onCellContextMenu, // Handle right-click event
            //angularCompileRows: true,
            // a default column definition with properties that get applied to every column
            defaultColDef: {
                filter: true,
                resizable: true,
                sortable: true,
                // set every column width
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
            //suppressHorizontalScroll: true,
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

    $scope.GetData = function () {

        $scope.loadingstatus = 'running';
        showPleaseWait();
        $http({
            method: 'POST',
            url: base_url + "Inventory/Reporting/GetPendingPOSummary?DateFrom=" + $scope.DateFrom + "&DateTo=" + $scope.DateTo,
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
                down_file(base_url + "//" + res.data.Data.ResponseId, "Purchase.xlsx");
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
        if (contextMenu.contains(event.target)) {
            return;
        }
        contextMenu.style.display = 'none';
    });

    $(document).ready(function () {
        $(this).bind("contextmenu", function (e) {
            e.preventDefault();
        });
    });
});