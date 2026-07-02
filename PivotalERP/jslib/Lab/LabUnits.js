app.controller('LabUnits', function ($scope, $filter, $http, $timeout, GlobalServices) {
    $scope.Title = 'LabUnits';
    var glSrv = GlobalServices;

    $scope.onBtExportCSV = function () {
        var params = {
            fileName: 'Labunit.csv',
            sheetName: 'Labunit'
        };
        $scope.gridOptions.api.exportDataAsCsv(params);
    }
    $scope.onFilterTextBoxChanged = function () {
        $scope.gridOptions.api.setQuickFilter($scope.search);
    }   

    $scope.LoadData= function () {
        $scope.loadingstatus = "stop";
        $scope.confirmMSG = GlobalServices.getConfirmMSG();
        $scope.perPageList = GlobalServices.getPerPageList();
        $scope.currentPages = {
            LabUnits: 1
        };

        $scope.searchData = {
            LabUnits: ''
        };

        $scope.perPage = {
            LabUnits: GlobalServices.getPerPageRow(),
        };

        $scope.beData =
        {
            UnitId: 0,
            Symbol:'',
            Description:'',
            Category: '',
            isActive:true,
            Mode: 'Save',
        }

        $scope.columnDefs = [
            { headerName: "SNo.", width: 70, valueGetter: "node.rowIndex + 1", cellStyle: { textAlign: "center" }, sortable: false, filter: false },
            { field: "Symbol", headerName: "Unit Symbol", filter: 'agTextColumnFilter', flex: 1.5, cellStyle: { 'textAlign': 'left' } },
            { field: "Description", headerName: "Description", filter: 'agTextColumnFilter', flex: 3, cellStyle: { 'textAlign': 'left' } },
            { field: "Category", headerName: "Unit Category", filter: 'agTextColumnFilter', flex: 1.2, cellStyle: { 'textAlign': 'left' } },
            { field: "isActive", headerName: "IsActive", filter: 'agTextColumnFilter', flex: 0.8, cellStyle: { 'textAlign': 'center' } },
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
                        scope.getLabUnitsById(params.data);
                        scope.$apply();
                    });
                    // DELETE CLICK
                    eDiv.querySelector(".delete-btn").addEventListener("click", function () {
                        scope.deleteLabUnits(params.data);
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
        //end Daily Biometric Attendance
        $timeout(function () {
            GlobalServices.getListState(EntityId, $scope.gridOptions);
        });
        $scope.GetAllLabUnits();

    };

    $scope.saveRptListState = function () {
        GlobalServices.saveRptListState(EntityId, $scope.gridOptions);
    };

    $scope.ClearFields = function () {
        $scope.loadingstatus = "stop";
        $scope.beData =
        {
            UnitId: 0,
            Symbol: '',
            Description: '',
            Category: '',
            isActive: true,
            Mode: 'Save',
        };
        $('#txtName').focus();
    }

    $scope.GetAllLabUnits = function () {
       /* $scope.LabUnitsList = [];*/ //declare an empty array
        $scope.loadingstatus = 'running';
        showPleaseWait();
        $http({
            method: 'POST',
            url: base_url + "Lab/Creation/GetAlllab_Unit",
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

    $scope.IsValidLabUnits = function () {
        return true;
    }

    $scope.SaveUpdateLabUnits = function () {
        if ($scope.IsValidLabUnits() == true) {
            if ($scope.confirmMSG.Accept == true) {
                var saveModify = $scope.beData.Mode;
                Swal.fire({
                    title: 'Do you want to' + saveModify + 'the current data?',
                    showCancelButton: true,
                    confirmButtonText: saveModify,
                }).then((result) => {
                    if (result.isConfirmed) {
                        $scope.CallSaveUpdateLabUnits();
                    }

                });
            }
            else
                $scope.CallSaveUpdateLabUnits();
        }
    };

    $scope.CallSaveUpdateLabUnits = function () {
        $scope.loadingstatus = 'running';
        showPleaseWait();
        $http({
            method: 'POST',
            url: base_url + "Lab/Creation/Savelab_Unit",
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
                $scope.GetAllLabUnits();
            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
        });
    }

    $scope.getLabUnitsById = function (beData) {
        $scope.loadingstatus = "running";
        var para = {
            UnitId: beData.UnitId
        };
        $http({
            method: 'POST',
            url: base_url + "Lab/Creation/Getlab_UnitById",
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

    $scope.deleteLabUnits = function (refData, ind) {
        Swal.fire({
            title: 'Are you sure to delete selected Unit :-' + refData.Symbol,
            showCancelButton: true,
            confirmButtonText: 'Delete',
        }).then((result) => {
            if (result.isConfirmed) {
                $scope.loadingstatus = "running";
                showPleaseWait();

                var para = {
                    UnitId: refData.UnitId
                };

                $http({
                    method: 'POST',
                    url: base_url + "Lab/Creation/Dellab_Unit",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingstatus = "stop";
                    Swal.fire(res.data.ResponseMSG);
                    if (res.data.IsSuccess) {
                        $scope.GetAllLabUnits();
                    }
                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }
        });

    }



});