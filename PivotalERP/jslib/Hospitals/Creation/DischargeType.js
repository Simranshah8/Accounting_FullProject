app.controller('DischargeType', function ($scope, $filter, $http, $timeout, GlobalServices) {
    $scope.Title = 'DischargeType';
    var glSrv = GlobalServices;

    $scope.onBtExportCSV = function () {
        var params = {
            fileName: 'DischargeType.csv',
            sheetName: 'DischargeType'
        };
        $scope.gridOptions.api.exportDataAsCsv(params);
    }
    $scope.onFilterTextBoxChanged = function () {
        $scope.gridOptions.api.setQuickFilter($scope.search);
    }


    $scope.LoadData = function () {

        $scope.loadingstatus = "stop";

        $scope.confirmMSG = GlobalServices.getConfirmMSG();
        $scope.perPageColl = GlobalServices.getPerPageList();

        $scope.currentPages = {
            DischargeType: 1
        };

        $scope.searchData = {
            DischargeType: ''
        };

        $scope.perPage = {
            DischargeType: GlobalServices.getPerPageRow(),
        };

        $scope.beData =
        {
            Name: '',
            Alias: '',
            Description: '',
            Discount: '',
            Ledger: '',
            Mode: 'Save'
        }


        $scope.columnDefs = [
            { headerName: "SNo.", width: 100, valueGetter: "node.rowIndex + 1", cellStyle: { textAlign: "center" }, sortable: false, filter: false },
            { field: "Name", headerName: "Name", filter: 'agTextColumnFilter', flex: 1.5, cellStyle: { 'textAlign': 'left' } },
            { field: "Alias", headerName: "Alias", filter: 'agTextColumnFilter', flex: 1, cellStyle: { 'textAlign': 'left' } },
            { field: "Description", headerName: "Description", filter: 'agTextColumnFilter', flex: 2, cellStyle: { 'textAlign': 'left' } },
            {
                headerName: "Action", pinned: 'right',
                width: 100,
                cellRenderer: function (params) {
                    let eDiv = document.createElement('div');
                    eDiv.innerHTML = `
                    <button class="btn btn-info btn-sm edit-btn" title="Edit">
                    <i class='fas fa-pencil-alt'></i>
                    </button>
                    <button class="btn btn-danger btn-sm delete-btn" title="Delete">
                    <i class='fas fa-trash'></i>
                    </button>`;

                    let scope = angular.element(document.getElementById('ActionDiv')).scope();
                    // EDIT CLICK
                    eDiv.querySelector(".edit-btn").addEventListener("click", function () {
                        scope.GetDischargeTypeById(params.data);
                        scope.$apply();
                    });
                    // DELETE CLICK
                    eDiv.querySelector(".delete-btn").addEventListener("click", function () {
                        scope.DelDischargeType(params.data);
                        scope.$apply();
                    });
                    return eDiv;
                }
            }
        ];

        // ag-Grid options
        $scope.gridOptions = {
            defaultColDef: {
                filter: true,
                resizable: true,
                sortable: true
            },
            enableSorting: true,
            multiSortKey: 'ctrl',
            enableColResize: true,
            overlayLoadingTemplate: "Loading..",
            overlayNoRowsTemplate: "No Records found",
            rowSelection: 'multiple',
            columnDefs: $scope.columnDefs,
            rowData: null,
            filter: true,
            enableFilter: true,
            //pagination: true,
            //paginationPageSize: 2,//$scope.perPage,
            //paginationPageSizeSelector: $scope.perPageColl
        };

        // Initialize grid after DOM is ready
        $timeout(function () {
            var eGridDiv = document.querySelector('#datatable');
            new agGrid.Grid(eGridDiv, $scope.gridOptions);
        });
        $timeout(function () {
            GlobalServices.getListState(EntityId, $scope.gridOptions);
        });
        //end Daily Biometric Attendance
        $scope.GetAllDischargeType();

    };

    $scope.saveRptListState = function () {
        GlobalServices.saveRptListState(EntityId, $scope.gridOptions);
    };




    $scope.ClearFields = function () {
        $scope.beData =
        {

            Name: '',
            Alias: '',
            Description: '',
            Discount: '',
            Ledger: '',
            Mode: 'Save'
        };
    }

    $scope.GetAllDischargeType = function () {
        /*  $scope.MethodsColl = []; *///declare an empty array
        $scope.loadingstatus = 'running';
        showPleaseWait();

        $http({
            method: 'POST',
            url: base_url + "Hospital/Creation/GetAllDischargeType",
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

    $scope.IsValidDischargeType = function () {
        //if ($scope.newMethods.Name.isEmpty()) {
        //    Swal.fire("Please ! Enter Product Name");
        //    return false;
        //}
        //else
        return true;
    }

    $scope.SaveUpdateDischargeType = function () {
        if ($scope.IsValidDischargeType() == true) {
            if ($scope.confirmMSG.Accept == true) {
                var saveModify = $scope.beData.Mode;
                Swal.fire({
                    title: 'Do you want to' + saveModify + 'the current data?',
                    showCancelButton: true,
                    confirmButtonText: saveModify,
                }).then((result) => {
                    if (result.isConfirmed) {
                        $scope.CallSaveUpdateDischargeType();
                    }

                });
            }
            else
                $scope.CallSaveUpdateDischargeType();
        }
    };

    $scope.CallSaveUpdateDischargeType = function () {
        $scope.loadingstatus = 'running';
        showPleaseWait();

        $http({
            method: 'POST',
            url: base_url + "Hospital/Creation/SaveDischargeType",
            headers: { 'content-Type': undefined },

            transformRequest: function (data) {
                var formData = new FormData();
                formData.append("jsonData", angular.toJson(data.jsonData));
                return formData;
            },
            data: { jsonData: $scope.beData }
        }).then(function (res) {

            $scope.loadingstatus = "stop";
            hidePleaseWait();

            Swal.fire(res.data.ResponseMSG);
            if (res.data.IsSuccess == true) {
                $scope.ClearFields();
                $scope.GetAllDischargeType();
            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
        });
    }

    $scope.GetDischargeTypeById = function (beData) {

        $scope.loadingstatus = "running";
        var para = {
            DischargeTypeId: beData.DischargeTypeId
        };
        $http({
            method: 'POST',
            url: base_url + "Hospital/Creation/GetDischargeTypeById",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $timeout(function () {
                    $scope.beData = res.data.Data;
                    $scope.beData.Mode = 'Modify';
                    $('#custom-tabs-four-profile-tab').tab('show');
                });
            } else
                Swal.fire(res.data.ResponseMSG);

        }, function (reason) {
            alert('Failed' + reason);
        });
    }

    $scope.DelDischargeType = function (refData, ind) {

        Swal.fire({
            title: 'Are you sure to delete selected Discharge Type:-' + refData.Name,
            showCancelButton: true,
            confirmButtonText: 'Delete',
        }).then((result) => {
            if (result.isConfirmed) {
                $scope.loadingstatus = "running";
                showPleaseWait();

                var para = {
                    DischargeTypeId: refData.DischargeTypeId
                };

                $http({
                    method: 'POST',
                    url: base_url + "Hospital/Creation/DelDischargeType",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingstatus = "stop";
                    Swal.fire(res.data.ResponseMSG);
                    if (res.data.IsSuccess) {
                        $scope.GetAllDischargeType();
                    }
                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }
        });

    }
});