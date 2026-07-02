

"use strict";

agGrid.initialiseAgGridWithAngular1(angular);



app.controller("IELedgerOpening", function ($scope, $http, $filter, $timeout,GlobalServices) {
    $scope.Title = 'IELedgerOpening';
var PrintPreviewAs = 1;
 const contextMenu = GlobalServices.createElementForMenu();
    LoadData();

    function LoadData() {
        $scope.columnDefs = [
            { headerName: "BranchName", field: "BranchName", filter: 'agNumberColumnFilter', width: 160, dataType: 'Text', pinned: 'left', cellStyle: { 'text-align': 'left' } },
            { headerName: "Name", field: "Name", filter: "agTextColumnFilter", width: 190, dataType: 'Text', pinned: 'left',cellStyle:{'text-align':'left'} },
            { headerName: "Alias", field: "Alias", filter: "agTextColumnFilter", width: 140, dataType: 'Text', cellStyle:{'text-align':'left'} },
            { headerName: "Code", field: "Code", filter: "agTextColumnFilter", width: 140, dataType: 'Text', cellStyle:{'text-align':'left'} },
            { headerName: "GroupName", field: "GroupName", filter: "agTextColumnFilter", width: 170, dataType: 'Text', cellStyle:{'text-align':'left'} },
            { headerName: "VoucherDate", field: "VoucherDate", filter: "agTextColumnFilter", width: 140, dataType: 'DateTime',cellStyle:{'text-align':'center'} },
            { headerName: "VoucherDateBS", field: "VoucherDateBS", filter: "agTextColumnFilter", width: 150, dataType: 'DateTime',cellStyle:{'text-align':'center'} },
            { headerName: "Amount", field: "Amount", filter: "agTextColumnFilter", width: 130, dataType: 'Number', cellStyle:{'text-align':'right'}},
            { headerName: "DrCr", field: "DrCr", filter: "agTextColumnFilter", width: 100, dataType: 'Number', cellStyle:{'text-align':'right'} },
         
        ];           


 $scope.GenConfig = {};
        GlobalServices.getGenConfig().then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.GenConfig = res.data.Data;
                PrintPreviewAs = $scope.GenConfig.PrintPreviewAs;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });


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
            columnDefs: $scope.columnDefs,
            rowData: null,
            filter: true,
            suppressHorizontalScroll: true,
            alignedGrids: [],
            enableFilter: true,

            onFilterChanged: function () {

                var Opening = 0;
                $scope.gridOptions.api.forEachNodeAfterFilterAndSort(function (node) {
                    if (node.data.DrCr == 1 || node.data.DrCr == 'DR')
                        Opening += node.data.Amount;
                    else
                        Opening -= node.data.Amount;
                });

                var drcr = '';
                if (Opening > 0)
                    drcr = 'DR';
                else if (Opening < 0)
                    drcr = 'CR'

                Opening = Math.abs(Opening);

                $scope.dataForBottomGrid[0].Amount = Opening;
                $scope.dataForBottomGrid[0].DrCr = drcr;
                $scope.gridOptionsBottom.api.setRowData($scope.dataForBottomGrid);
            }

        };

        // lookup the container we want the Grid to use
        $scope.eGridDiv = document.querySelector('#datatable');

        // create the grid passing in the div to use together with the columns & data we want to use
        new agGrid.Grid($scope.eGridDiv, $scope.gridOptions);

        $scope.dataForBottomGrid = [
            {
                AutoNumber: '',
                Name: 'Total =>',
                Amount: 0,
                DrCr: ''
            }];

        $scope.gridOptionsBottom = {
            defaultColDef: {
                resizable: true,
                width: 90
            },
            columnDefs: $scope.columnDefs,
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
        $scope.loadingstatus = "stop";
		
		$timeout(function () {
            GlobalServices.getListState(EntityId, $scope.gridOptions);
        });

    }

    $scope.GetAllIELedgerOpening = function () {

        if ($scope.loadingstatus != 'stop') {
            alert('Already Running Process')
            return;
        }

        $scope.loadingstatus = 'running';
        showPleaseWait();

        $scope.DataColl = []; //declare an empty array
        $scope.gridOptionsBottom.api.setRowData(null);
        $scope.gridOptions.api.setRowData(null); //declare an empty array
        $http({
            method: 'GET',
            url: base_url + "Account/Reporting/GetAllIELedgerOpening",
            dataType: "json"
            //data:JSON.stringify(para)
        }).then(function (res) {

            $scope.loadingstatus = 'stop';
            hidePleaseWait();

            if (res.data.IsSuccess && res.data.Data) {
                $scope.DataColl = res.data.Data;

                var Opening = 0;
                angular.forEach($scope.DataColl, function (dc) {
                    if (dc.DrCr == 1 || dc.DrCr == 'DR')
                        Opening += dc.Amount;
                    else
                        Opening -= dc.Amount;
                });

                var drcr = '';
                if (Opening > 0)
                    drcr = '';
                else if (Opening < 0)
                    drcr = ''

                Opening = Math.abs(Opening);


                $scope.dataForBottomGrid[0].Amount = Opening;
                $scope.dataForBottomGrid[0].DrCr = drcr;
                $scope.gridOptionsBottom.api.setRowData($scope.dataForBottomGrid);

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
                down_file(base_url + "//" + res.data.Data.ResponseId, "LedgerOpening.xlsx");
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