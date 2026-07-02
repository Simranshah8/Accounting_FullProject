"use strict";

agGrid.initialiseAgGridWithAngular1(angular);

app.controller('VendorwiseAssetsController', function ($scope, $http, $timeout, $filter, $rootScope, GlobalServices) {
    $scope.onBtExportCSV = function () {
        var params = {
            fileName: 'VendorwiseAssets.csv',
            sheetName: 'VendorwiseAssets'
        };
        $scope.gridOptions.api.exportDataAsCsv(params);
    }
    $scope.onFilterTextBoxChanged = function () {
        $scope.gridOptions.api.setQuickFilter($scope.search);
    }
    $scope.LoadData = function () {
        $('.select2').select2();

        $scope.newFilter = {
          
            DateFrom_TMP: new Date(),
            DateTo_TMP: new Date()
        };

        $scope.columnDefs = [
            { headerName: "SNo.", valueGetter: "node.rowIndex + 1", width: 70, minWidth: 60, cellStyle: { textAlign: "center" },sortable: false,filter: false },
            {
                headerName: "Voucher Date ", field: "VoucherDateAD", filter: 'agDateColumnFilter', minWidth: 130, flex: 1, cellStyle: { textAlign: 'left' },
                valueFormatter: (params) => {
                    if (!params.value) return '';
                    const date = new Date(params.value);
                    const year = date.getFullYear();
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    const day = String(date.getDate()).padStart(2, '0');
                    return `${year}-${month}-${day}`;
                }
            },
            { headerName: " Miti", field: "VoucherMitti", filter: 'agDateColumnFilter', minWidth: 150, flex: 1, cellStyle: { textAlign: 'left' }},
            { headerName: "Vendor Name", field: "VendorName", filter: 'agTextColumnFilter', minWidth: 160, flex: 1.5, cellStyle: { textAlign: 'left' }},
            { headerName: "Vendor Invoice No.", field: "InVoiceNo", filter: 'agTextColumnFilter', minWidth: 150, flex: 1, cellStyle: { textAlign: 'center' } },
            { headerName: "Asset Name", field: "AssetName", filter: 'agTextColumnFilter', minWidth: 160,flex: 1.5},
            { headerName: "Asset Code", field: "AssetCode", filter: 'agTextColumnFilter', minWidth: 130, flex: 1},
            { headerName: "Asset Alias", field: "AssetAlias", filter: 'agTextColumnFilter', minWidth: 140, flex: 1},
            { headerName: "Asset Group", field: "AssetGroup", filter: 'agTextColumnFilter', minWidth: 140, flex: 1},
            { headerName: "Asset Type", field: "AssetType", filter: 'agTextColumnFilter', minWidth: 140, flex: 1},
            { headerName: "Asset Model", field: "AssetModel", filter: 'agTextColumnFilter', minWidth: 150,flex: 1},
            { headerName: "RAM (Memory)", field: "RAMName", filter: 'agTextColumnFilter', minWidth: 150, flex: 1},
            { headerName: "ROM (SSD/HDD)", field: "ROMName", filter: 'agTextColumnFilter', minWidth: 150, flex: 1},
            { headerName: "Serial Number", field: "SerialNum", filter: 'agTextColumnFilter', minWidth: 160, flex: 1.2},
            { headerName: "Branch", field: "BranchName", filter: 'agTextColumnFilter', minWidth: 150, flex: 1 },
            { headerName: "Status", field: "StatusName", filter: 'agTextColumnFilter', minWidth: 150, flex: 1},
            { headerName: "In Qty", field: "InQTY", filter: 'agNumberColumnFilter', minWidth: 150, flex: 1,cellStyle: { textAlign: 'right' }},
            //{ headerName: "Q. Rate", field: "QtyRate", filter: 'agNumberColumnFilter', minWidth: 150, flex: 1, cellStyle: { textAlign: 'right' }},
            //{ headerName: "Q. Dis Amt", field: "QtyDisAmt", filter: 'agNumberColumnFilter', minWidth: 150, flex: 1, cellStyle: { textAlign: 'right' }},
            { headerName: "Rate", field: "PRate", filter: 'agNumberColumnFilter', minWidth: 150, flex: 1, cellStyle: { textAlign: 'right' }},
            { headerName: "Discount Amount", field: "DisAmt", filter: 'agNumberColumnFilter', minWidth: 150, flex: 1, cellStyle: { textAlign: 'right' }},
            { headerName: "Amount", field: "Amt", filter: 'agNumberColumnFilter', minWidth: 150, flex: 1,cellStyle: { textAlign: 'right' }}
        ];

          //ag-Grid options
        $scope.gridOptions = {
            defaultColDef: {
                filter: true,
                resizable: true,
                sortable: true
            },
            enableSorting: true,
            multiSortKey: 'ctrl',
            enableColResize: true,
            overlayLoadingTemplate: "Please Click the Load Button to display the data",
            overlayNoRowsTemplate: "No Records found",
            rowSelection: 'multiple',
            columnDefs: $scope.columnDefs,
            rowData: null,
            filter: true,
            enableFilter: true
        };

        $timeout(function () {
            var eGridDiv = document.querySelector('#TableData');
            new agGrid.Grid(eGridDiv, $scope.gridOptions);
        });
       

        $timeout(function () {
            GlobalServices.getListState(EntityId, $scope.gridOptions);
        });       
    };

    $scope.GetData = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();
        var para = {
            DateFrom: ($scope.newFilter.DateFromDet ? $filter('date')(new Date($scope.newFilter.DateFromDet.dateAD), 'yyyy-MM-dd') : null),
            DateTo: ($scope.newFilter.DateToDet ? $filter('date')(new Date($scope.newFilter.DateToDet.dateAD), 'yyyy-MM-dd') : null),
        };
        $http({
            method: 'POST',
            url: base_url + "AssetsManagement/Reporting/GetAllVendorWiseAsset",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.DataColl = res.data.Data;
                $scope.gridOptions.api.setRowData($scope.DataColl);

            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            Swal.fire('Failed: ' + reason);
        });
    }

    $scope.DownloadAsXls = function () {
        $scope.loadingstatus = 'running';
        showPleaseWait();
        var dataColl = $scope.GetDataForPrint();
        var paraData = {
            DateFrom: $filter('date')($scope.newFilter.DateFromDet.dateAD, 'yyyy-MM-dd'),
            DateTo: $filter('date')($scope.newFilter.DateToDet.dateAD, 'yyyy-MM-dd'),
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
                down_file(base_url + "//" + res.data.Data.ResponseId, "VendorWiseAsset.xlsx");
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
            var Vendor = node.data;
            filterData.push(Vendor);
        });
        return filterData;
    }   
});






