

"use strict";

agGrid.initialiseAgGridWithAngular1(angular);

app.controller("ProductRateListCtrl", function ($scope, $http,$filter, $timeout,GlobalServices) {
    $scope.Title = 'ProductRateList';
  var PrintPreviewAs = 1;
    const contextMenu = GlobalServices.createElementForMenu();
	
    LoadData();
  
    function LoadData() {
        $('.select2').select2({
            allowClear: true,
            openOnEnter: true
        });
        //$scope.loadingstatus = 'running';

        var columnDefs = [
           // { headerName: "AutoNumber", field: "AutoNumber", filter: 'agNumberColumnFilter', width: 200, cellStyle: { 'text-align': 'right' }},
            { headerName: "Name", field: "Name", filter: "agTextColumnFilter", width: 200, cellStyle: { 'text-align': 'left' } },
            { headerName: "Alias", field: "Alias", filter: 'agTextColumnFilter', width: 200, cellStyle: { 'text-align': 'left' }},
            { headerName: "Code", field: "Code", filter: 'agNumberColumnFilter', width: 200, cellStyle: { 'text-align': 'left' }},
            { headerName: "ProductGroup", field: "ProductGroup", filter: 'agNumberColumnFilter', width: 200, cellStyle: { 'text-align': 'left' }},
            { headerName: "Category", field: "ProductCategory", filter: 'agNumberColumnFilter', width: 200, cellStyle: { 'text-align': 'left' } },
            { headerName: "PartNo", field: "PartNo", filter: 'agNumberColumnFilter', width: 200, cellStyle: { 'text-align': 'right' } },
            { headerName: "Remarks", field: "Remarks", filter: 'agNumberColumnFilter', width: 200, cellStyle: { 'text-align': 'left' } },
            { headerName: "BaseUnit", field: "BaseUnit", filter: 'agNumberColumnFilter', width: 200, cellStyle: { 'text-align': 'left' } },
            //{ headerName: "OpeningUnit", field: "AlternativeUnit", filter: 'agTextColumnFilter', width: 200, cellStyle: { 'text-align': 'left' } },
            { headerName: "OpeningRate", field: "OpeningRate", filter: 'agNumberColumnFilter', width: 200, cellStyle: { 'text-align': 'right' }, valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "P-Rate", field: "PRate1", filter: 'agNumberColumnFilter', width: 150, cellStyle: { 'text-align': 'right' }, valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "S-Rate", field: "SRate1", filter: 'agNumberColumnFilter', width: 150, cellStyle: { 'text-align': 'right' }, valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "ClosingBalance", field: "ClosingBalance", filter: 'agNumberColumnFilter', width: 200, cellStyle: { 'text-align': 'right' }, valueFormatter: function (params) { return Numberformat(params.value); } },

            { headerName: "Rack", field: "RackName", filter: 'agTextColumnFilter', width: 200, cellStyle: { 'text-align': 'left' } },
            { headerName: "Rack Desc", field: "RackDescription", filter: 'agTextColumnFilter', width: 200, cellStyle: { 'text-align': 'left' } },
            { headerName: "Product Type", field: "ProductType", filter: 'agTextColumnFilter', width: 200, cellStyle: { 'text-align': 'left' } },
            { headerName: "MRP", field: "MRP", filter: 'agNumberColumnFilter', width: 150, cellStyle: { 'text-align': 'right' }, valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "Trade Rate", field: "TradeRate", filter: 'agNumberColumnFilter', width: 150, cellStyle: { 'text-align': 'right' }, valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "Last Purchase Date", field: "LastPurchaseDate", filter: 'agDateColumnFilter', width: 150, cellStyle: { 'text-align': 'center' } },
            { headerName: "Last Sales Date", field: "LastSalesDate", filter: 'agDateColumnFilter', width: 150, cellStyle: { 'text-align': 'center' } },


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
            enableFilter: true,

            onFilterChanged: function () {

                var Opening = 0;
                $scope.gridOptions.api.forEachNodeAfterFilterAndSort(function (node) {
                    if (node.data.ClosingBalance == 1 || node.data.ClosingBalance == 'DR')
                        Opening += node.data.ClosingBalance;
                    else
                        Opening -= node.data.ClosingBalance;
                });

                var drcr = '';
                if (Opening > 0)
                    drcr = 'DR';
                else if (Opening < 0)
                    drcr = 'CR'

                Opening = Math.abs(Opening);

                $scope.dataForBottomGrid[0].ClosingBalance = Opening;
                $scope.dataForBottomGrid[0].OpeningRate = drcr;
                $scope.gridOptionsBottom.api.setRowData($scope.dataForBottomGrid);
            }

        };
        $scope.eGridDiv = document.querySelector('#datatable');

        // create the grid passing in the div to use together with the columns & data we want to use
        new agGrid.Grid($scope.eGridDiv, $scope.gridOptions);

        $scope.dataForBottomGrid = [
            {
                AutoNumber: '',
                Name: 'Total =>',
                ClosingBalance: 0,
                OpeningRate: '',
            }];

        $scope.gridOptionsBottom = {
            defaultColDef: {
                resizable: true,
                width: 90
            },
            columnDefs: columnDefs,
            // we are hard coding the data here, it's just for demo purposes
            rowData: $scope.dataForBottomGrid,
            debug: true,
            rowClass: 'bold-row',
            // hide the header on the bottom grid
            headerHeight: 0,
            alignedGrids: []
        };

        $scope.gridOptions.alignedGrids.push($scope.gridOptionsBottom);
        $scope.gridOptionsBottom.alignedGrids.push($scope.gridOptions);

        $scope.gridDivBottom = document.querySelector('#myGridBottom');
        new agGrid.Grid($scope.gridDivBottom, $scope.gridOptionsBottom);

        $timeout(function ()
        {
            GlobalServices.getListState(EntityId, $scope.gridOptions);
        });

        $scope.loadingstatus = 'stop';
    }

    $scope.GetAllProductRateList = function () {
        if ($scope.loadingstatus != 'stop') {
            alert('Already Running Process')
            return;
        }

        $scope.loadingstatus = "running";
        showPleaseWait();

        $scope.DataColl = []; //declare an empty array
        $http({
            method: 'GET',
            url: base_url + "Inventory/Reporting/GetAllProductRateList",
            dataType: "json"
            //data:JSON.stringify(para)
        }).then(function (res) {
            $scope.loadingstatus = 'stop';
            $scope.loadingstatus = 'stop';
            hidePleaseWait();

            if (res.data.IsSuccess && res.data.Data) {
                $scope.DataColl = res.data.Data;
  
                $scope.gridOptions.api.setRowData($scope.DataColl);
            } else
                alert(res.data.ResponseMSG);

        }, function (reason) {

            $scope.loadingstatus = 'stop';
            hidePleaseWait();

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
                down_file(base_url + "//" + res.data.Data.ResponseId, "ProductRateList.xlsx");
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