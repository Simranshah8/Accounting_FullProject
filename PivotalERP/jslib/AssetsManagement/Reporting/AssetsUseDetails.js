"use strict";

agGrid.initialiseAgGridWithAngular1(angular);

app.controller('AssetsUseDetailsController', function ($scope, $http, $timeout, $filter, $rootScope, GlobalServices) {
    $scope.onBtExportCSV = function () {
        var params = {
            fileName: 'container.csv',
            sheetName: 'container'
        };
        $scope.gridOptions.api.exportDataAsCsv(params);
    }
    $scope.onFilterTextBoxChanged = function () {
        $scope.gridOptions.api.setQuickFilter($scope.search);
    }
    $scope.LoadData = function () {
        $('.select2').select2();
        $('.Aplaceholder').select2({
            placeholder: "Asset Name", allowClear: true
        });


        $scope.newFilter = {
            TranId: null,
            DateFrom_TMP: new Date(),
            DateTo_TMP: new Date()
        };

        $scope.AssestsList = [];
        $http({
            method: 'POST',
            url: base_url + "AssetsManagement/Creation/GetAllAssetsmaster",
            dataType: "json",
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.AssestsList = res.data.Data;
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            Swal.fire('Failed: ' + reason);
        });
      
        $scope.columnDefs = [
            { headerName: "SNo.", valueGetter: "node.rowIndex + 1", width: 70, minWidth: 100, cellStyle: { textAlign: "center" }, sortable: false, filter: false },
            { headerName: "Emp.Code", field: "EmployeeCode", filter: 'agTextColumnFilter', minWidth: 150, flex: 1 },
            { headerName: "Name", field: "IssueByName", filter: 'agTextColumnFilter', minWidth: 150, flex: 1 },
            { headerName: "Department", field: "DepartmentName", filter: 'agTextColumnFilter', minWidth: 160, flex: 1.5 },
            { headerName: "Designation", field: "Designation", filter: 'agTextColumnFilter', minWidth: 160, flex: 1 },
            { headerName: "Company", field: "CompanyName", filter: 'agTextColumnFilter', minWidth: 160, flex: 1 },
            { headerName: "Branch", field: "Branch", filter: 'agTextColumnFilter', minWidth: 160, flex: 1 },
            { headerName: "From Date", field: "FromMitti", filter: 'agDateColumnFilter', minWidth: 160, flex: 1 },
            { headerName: "Recived Date", field: "TOMitti", filter: 'agDateColumnFilter', minWidth: 160, flex: 1 },
            { headerName: "Received Status", field: "ReceivedStatus", filter: 'agDateColumnFilter', minWidth: 160, flex: 1 },
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
        if ($scope.newFilter.TranId) {
            var para = {
                DateFrom: ($scope.newFilter.DateFromDet ? $filter('date')(new Date($scope.newFilter.DateFromDet.dateAD), 'yyyy-MM-dd') : null),
                DateTo: ($scope.newFilter.DateToDet ? $filter('date')(new Date($scope.newFilter.DateToDet.dateAD), 'yyyy-MM-dd') : null),
                TranId: $scope.newFilter.TranId,
            };
            $http({
                method: 'POST',
                url: base_url + "AssetsManagement/Reporting/GetAllAssetsUseDetails",
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
            //forDate: $filter('date')($scope.newDaily.ForDateDet.dateAD, 'yyyy-MM-dd'),
            //branchIdColl: $scope.newDaily.BranchId
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
            var dayBook = node.data;
            filterData.push(dayBook);
        });
        return filterData;
    }
});






