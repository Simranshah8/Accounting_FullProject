"use strict";

agGrid.initialiseAgGridWithAngular1(angular);

app.controller('EmployeeWiseAssetsDetController', function ($scope, $http, $timeout, $filter, $rootScope, GlobalServices) {
    $scope.onBtExportCSV = function () {
        var params = {
            fileName: 'EmployeeWiseAssetsDetails.csv',
            sheetName: 'EmployeeWiseAssetsDetails'
        };
        $scope.gridOptions.api.exportDataAsCsv(params);
    }

    $scope.onFilterTextBoxChanged = function () {
        $scope.gridOptions.api.setQuickFilter($scope.search);
    }

    $scope.LoadData = function () {
        $('.select2').select2();
        $('.Dplaceholder').select2({
            placeholder: "Select Department", allowClear: true
        });
        $('.HODplaceholder').select2({
            placeholder: "Select Head Of Department", allowClear: true
        });

        $scope.EmployeeSearchOptions = GlobalServices.getEmployeeSearchOptions();
      
        $scope.EmpSearchOptions = [
            { id: 1, text: 'Self' },
            { id: 2, text: 'HOD' },
        ]


        $scope.DepartmentList = [];
        $http({
            method: 'GET',
            url: base_url + "HR/Master/GetAllDepartment",
            dataType: "json"
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.DepartmentList = res.data.Data;

            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });



       

        $scope.newFilter = {
            EmployeeId: null,
            SearchType: 1,
            SelectEmployee: $scope.EmployeeSearchOptions[0].value,
            IssueById:1

        };

        $scope.columnDefs = [
            { headerName: "SNo.", valueGetter: "node.rowIndex + 1", width: 70, minWidth: 60, cellStyle: { textAlign: "center" }, sortable: false, filter: false },
            { headerName: "Assets Name", field: "AssetsName", filter: 'agTextColumnFilter', minWidth: 150, flex: 1, cellStyle: { textAlign: 'left' } },
            { headerName: "Serial Number", field: "SerialNum", filter: 'agTextColumnFilter', minWidth: 160, flex: 1.5, cellStyle: { textAlign: 'left' } },
            { headerName: "Asset Group", field: "AssetGroup", filter: 'agTextColumnFilter', minWidth: 150, flex: 1 },
            { headerName: "Asset Type", field: "AssetType", filter: 'agTextColumnFilter', minWidth: 160, flex: 1.5 },
            { headerName: "Asset Alias", field: "AssetAlias", filter: 'agTextColumnFilter', minWidth: 130, flex: 1 },
            { headerName: "Asset Code", field: "AssetCode", filter: 'agTextColumnFilter', minWidth: 140, flex: 1 },
            { headerName: "Model", field: "AssetModels", filter: 'agTextColumnFilter', minWidth: 140, flex: 1 },
            { headerName: "Issue No", field: "IssueNo", filter: 'agNumberColumnFilter', minWidth: 140, flex: 1, cellStyle: { textAlign: 'center' } },
            { headerName: "Issue QTY", field: "QTY", filter: 'agNumberColumnFilter', minWidth: 150, flex: 1, cellStyle: { textAlign: 'center' } },
            { headerName: "Received No", field: "ReceivedNo", filter: 'agNumberColumnFilter', minWidth: 150, flex: 1, cellStyle: { textAlign: 'center' } },
            { headerName: "Received QTY", field: "ReceivedQTY", filter: 'agNumberColumnFilter', minWidth: 150, flex: 1, cellStyle: { textAlign: 'center' } },
            { headerName: "Issue Date", field: "IssueMitti", filter: 'agDateColumnFilter', minWidth: 160, flex: 1.2 },
            { headerName: "Received Date", field: "ReceivedMitti", filter: 'agDateColumnFilter', minWidth: 150, flex: 1 },
            { headerName: "Received Status", field: "ReceivedStatus", filter: 'agDateColumnFilter', minWidth: 150, flex: 1 }
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


        //$timeout(function () {
        //    GlobalServices.getListState(EntityId, $scope.gridOptions);
        //});
    };

    $scope.GetData = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();
        if ($scope.newFilter.UserId) {
            var para = {
                UsersId: $scope.newFilter.UserId
            };
            $http({
                method: 'POST',

                url: base_url + "AssetsManagement/Reporting/GetEmployeeWiseAssetsDet",
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
        hidePleaseWait();
        $scope.loadingstatus = "stop";
    }

    $scope.DownloadAsXls = function () {
        $scope.loadingstatus = 'running';
        showPleaseWait();
        var dataColl = $scope.GetDataForPrint();
        var paraData = {
            EmployeeId: $scope.newFilter.EmployeeId || null
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
                down_file(base_url + "//" + res.data.Data.ResponseId, "EmployeeWiseAssetsDet.xlsx");
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
            var EmployeeWiseAssetsDet = node.data;
            filterData.push(EmployeeWiseAssetsDet);
        });
        return filterData;
    }


    $scope.GetHodListDepartmentWise = function () {
        $scope.HODList = [];
        var para = {
            DepartmentId: $scope.newFilter.DepartmentId
        };

        if (!$scope.newFilter.DepartmentId) {
            return
        }

        $http({
            method: 'POST',
            url: base_url + "AssetsManagement/Creation/GetHodListDepartmentWise",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.HODList = res.data.Data;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    }


    //$scope.getEmployeeUserId = function (details) {
    //    if (!details.EmployeeDetails.UserId) {
    //        Swal.fire("There is no UserId for this employee!");
    //        $scope.newFilter.UserId = null;
    //        return;
    //    }
    //    $scope.newFilter.UserId = details.EmployeeDetails.UserId;
    //    if ($scope.newFilter.UserId) {
    //        $scope.GetData();
    //    }
    //};

});






