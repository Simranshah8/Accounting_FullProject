

"use strict";

agGrid.initialiseAgGridWithAngular1(angular);



app.controller("ProductAlternetUnitListCtrl", function ($scope, $http, $filter, $timeout,GlobalServices) {
    $scope.Title = 'ProductAlternetUnit';
  var PrintPreviewAs = 1;
    const contextMenu = GlobalServices.createElementForMenu();
	
    LoadData();

    function Numberformat(val) {
        return $filter('number')(val, 2);
    }

    function LoadData() {
        $('.select2').select2()
        $scope.loadingstatus = 'running';
        var columnDefs = [
            { headerName: "S.No", field: "ProductId", filter: 'agNumberColumnFilter', width: 100, pinned: 'left', cellStyle: { 'text-align': 'center' } },
            { headerName: "Name", field: "Name", filter: "agTextColumnFilter", width: 200, cellStyle: { 'text-align': 'left' }  },
            { headerName: "Alias", field: "Alias", filter: 'agTextColumnFilter', width: 140, cellStyle: { 'text-align': 'left' }  },
            { headerName: "Code", field: "Code", filter: 'agNumberColumnFilter', width: 140, cellStyle: { 'text-align': 'left' }  },
            { headerName: "ProductGroup", field: "ProductGroup", filter: 'agNumberColumnFilter', width: 200, cellStyle: { 'text-align': 'left' }  },
            { headerName: "BaseValue1", field: "BaseUnitValue1", filter: 'agNumberColumnFilter', width: 200, cellStyle: { 'text-align': 'right' }  },
            { headerName: "BaseUnit1", field: "BaseUnit1", filter: 'agNumberColumnFilter', width: 200, cellStyle: { 'text-align': 'right' }  },
            { headerName: "AlternetValue1", field: "AlternetUnitValue1", filter: 'agNumberColumnFilter', width: 200, cellStyle: { 'text-align': 'right' }  },
            { headerName: "AlternetUnit1", field: "AUName1", filter: 'agNumberColumnFilter', width: 200, cellStyle: { 'text-align': 'right' }  },
            { headerName: "BaseValue2", field: "BaseUnitValue2", filter: 'agNumberColumnFilter', width: 200, cellStyle: { 'text-align': 'right' }  },
            { headerName: "BaseUnit2", field: "BaseUnit2", filter: 'agNumberColumnFilter', width: 200, cellStyle: { 'text-align': 'right' }  },
            { headerName: "AlternetValue2", field: "AlternetUnitValue2", filter: 'agNumberColumnFilter', width: 200, cellStyle: { 'text-align': 'right' }  },
            { headerName: "AlternetUnit2", field: "AUName2", filter: 'agNumberColumnFilter', width: 200, cellStyle: { 'text-align': 'right' }  },
            { headerName: "BaseValue3", field: "BaseUnitValue3", filter: 'agNumberColumnFilter', width: 200, cellStyle: { 'text-align': 'right' }  },
            { headerName: "BaseUnit3", field: "BaseUnit3", filter: 'agNumberColumnFilter', width: 200, cellStyle: { 'text-align': 'right' }  },
            { headerName: "AlternetValue3", field: "AlternetUnitValue3", filter: 'agNumberColumnFilter', width: 200, cellStyle: { 'text-align': 'right' }  },
            { headerName: "AlternetUnit3", field: "AUName3", filter: 'agNumberColumnFilter', width: 200, cellStyle: { 'text-align': 'right' }  },
            { headerName: "SalesLedgerName", field: "SalesLedgerName", filter: 'agNumberColumnFilter', width: 200, cellStyle: { 'text-align': 'left' }  },
            { headerName: "SalesLedgerCode", field: "SalesLedgerCode", filter: 'agNumberColumnFilter', width: 200, cellStyle: { 'text-align': 'left' }  },
            { headerName: "PurchaseLedgerName", field: "PurchaseLedgerName", filter: 'agNumberColumnFilter', width: 200, cellStyle: { 'text-align': 'left' }  },
            { headerName: "PurchaseLedgerCode", field: "PurchaseLedgerCode", filter: 'agNumberColumnFilter', width: 200, cellStyle: { 'text-align': 'left' }  }
        ];


        $scope.gridOptions = {
			onCellContextMenu: onCellContextMenu, // Handle right-click event			
            showGridFooter: true,
            showColumnFooter: true,
            useExternalPagination: false,
            useExternalSorting: false,
            enableFiltering: true,
            enableSorting: true,
            enableRowSelection: true,
            enableSelectAll: true,
            enableGridMenu: true,
            showTreeExpandNoChildren: true,
            multiSortKey: 'ctrl',
            enableColResize: true,
            overlayLoadingTemplate: "Please Click the Load Bottom to display the data",
            overlayNoRowsTemplate: "No Records found",
            rowSelection: 'multiple',
            columnDefs: columnDefs,
            rowData: null,
            filter: true,        

        };

        // lookup the container we want the Grid to use
        $scope.eGridDiv = document.querySelector('#datatable');

        // create the grid passing in the div to use together with the columns & data we want to use
        new agGrid.Grid($scope.eGridDiv, $scope.gridOptions);
        $scope.loadingstatus = "stop";
		
		 $timeout(function () {
            GlobalServices.getListState(EntityId, $scope.gridOptions);
        });
    }

    $scope.GetAllProductAlternetUnitList = function () {
        if ($scope.loadingstatus != 'stop') {
            alert('Already Running Process')
            return;
        }

        $scope.loadingstatus = 'running';
        showPleaseWait();

        $scope.DataColl = []; //declare an empty array
        $http({
            method: 'GET',
            url: base_url + "Inventory/Reporting/GetAllProductAlternetUnitList",
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
                down_file(base_url + "//" + res.data.Data.ResponseId, "ProductAU.xlsx");
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