"use strict";

agGrid.initialiseAgGridWithAngular1(angular);

app.controller('RequestStatusController', function ($scope, $http, $timeout, $filter, $rootScope, GlobalServices) {
    $scope.onBtExportCSV = function () {
        var params = {
            fileName: 'RequestStatus.csv',
            sheetName: 'RequestStatus'
        };
        $scope.gridOptions.api.exportDataAsCsv(params);
    }
    $scope.onFilterTextBoxChanged = function () {
        $scope.gridOptions.api.setQuickFilter($scope.search);
    }
    $scope.LoadData = function () {
        $('.select2').select2();
        $('.Dplaceholder').select2({
            placeholder: "Select Report Type", allowClear: true
        });
        $scope.newFilter = {
            ReqStatus:'',
            DateFrom_TMP: new Date(),
            DateTo_TMP: new Date()
        };

        $scope.ReqStatusColl = [
            { id: 1, text: 'Clear' },
            { id: 2, text: 'Pending' }
        ]

        $scope.columnDefs = [
            { headerName: "SNo.", valueGetter: "node.rowIndex + 1", width: 70, minWidth: 60, cellStyle: { textAlign: "center" }, sortable: false, filter: false },
            {
                headerName: "Voucher Date", field: "VoucherDateAD", filter: 'agDateColumnFilter', minWidth: 130, flex: 1, cellStyle: { textAlign: 'left' },
                valueFormatter: (params) => {
                    if (!params.value) return '';
                    const date = new Date(params.value);
                    const year = date.getFullYear();
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    const day = String(date.getDate()).padStart(2, '0');
                    return `${year}-${month}-${day}`;
                }
            },
            { headerName: "Miti", field: "VoucherMitti", filter: 'agDateColumnFilter', minWidth: 150, flex: 1, cellStyle: { textAlign: 'left' } },
            { headerName: "RequestBy", field: "RequestBy", filter: 'agTextColumnFilter', minWidth: 160, flex: 1.5, cellStyle: { textAlign: 'left' } },
            { headerName: "Emp.Code", field: "EmployeeCode", filter: 'agTextColumnFilter', minWidth: 150, flex: 1 },
            { headerName: "Name", field: "RequestByName", filter: 'agTextColumnFilter', minWidth: 150, flex: 1 },
            { headerName: "Department", field: "DepartmentName", filter: 'agTextColumnFilter', minWidth: 160, flex: 1.5 },
            { headerName: "Branch", field: "BranchName", filter: 'agTextColumnFilter', minWidth: 130, flex: 1 },
            { headerName: "Request No.", field: "AssetReqNo", filter: 'agNumberColumnFilter', minWidth: 140, flex: 1, cellStyle: { textAlign: 'center' } },
            { headerName: "Issue No.", field: "IssueNo", filter: 'agNumberColumnFilter', minWidth: 140, flex: 1, cellStyle: { textAlign: 'center' } },
            { headerName: "Asset Category", field: "category", filter: 'agTextColumnFilter', minWidth: 140, flex: 1 },
            { headerName: "Assets Purpose", field: "Purpose", filter: 'agTextColumnFilter', minWidth: 140, flex: 1 },
            { headerName: "Particulars", field: "Particular", filter: 'agTextColumnFilter', minWidth: 150, flex: 1 },
            { headerName: "Alias", field: "AssetAlias", filter: 'agTextColumnFilter', minWidth: 150, flex: 1 },
            { headerName: "Code", field: "AssetsCode", filter: 'agTextColumnFilter', minWidth: 150, flex: 1 },
            { headerName: "Serial Number", field: "SerialNum", filter: 'agNumberColumnFilter', minWidth: 150, flex: 1 },
            { headerName: "Request Qty", field: "RequestQty", filter: 'agNumberColumnFilter', minWidth: 150, flex: 1, cellStyle: { textAlign: 'center' } },
            { headerName: "IssueQty", field: "IssueQty", filter: 'agNumberColumnFilter', minWidth: 150, flex: 1, cellStyle: { textAlign: 'center' } },
            { headerName: "PendingQty", field: "PendingQty", filter: 'agNumberColumnFilter', minWidth: 150, flex: 1, cellStyle: { textAlign: 'center' } },
            { headerName: "Status", field: "ReqStatus", filter: 'agTextColumnFilter', minWidth: 150, flex: 1 },
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
            ReqStatus: $scope.newFilter.ReqStatus || '',
        };
        $http({
            method: 'POST',
            url: base_url + "AssetsManagement/Reporting/GetAllRequestStatus",
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
            ReqStatus: $scope.newFilter.ReqStatus || '',
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
                down_file(base_url + "//" + res.data.Data.ResponseId, "RequestStatus.xlsx");
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
            var RequestStatus = node.data;
            filterData.push(RequestStatus);
        });
        return filterData;
    }
});






