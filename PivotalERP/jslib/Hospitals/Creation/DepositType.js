app.controller('DepositeType', function ($scope, $filter, $http, $timeout, GlobalServices) {
    $scope.Title = 'DepositeType';
    var glSrv = GlobalServices;

    $scope.onBtExportCSV = function () {
        var params = {
            fileName: 'DepositeType.csv',
            sheetName: 'DepositeType'
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
            DepositeType: 1
        };

        $scope.searchData = {
            DepositeType: ''
        };

        $scope.perPage = {
            DepositeType: GlobalServices.getPerPageRow(),
        };
        $scope.DepositColl = [
            { id: 1, text: 'New' },
            { id: 2, text: 'Redeposti' },
          
        ];

        $scope.beData =
        {

            Name: '',
            Alias: '',
            Description: '',
            Per: '',
            LedgerId: '',
            Mode: 'Save'
        }


        $scope.columnDefs = [
            { headerName: "SNo.", width: 100, valueGetter: "node.rowIndex + 1", cellStyle: { textAlign: "center" }, sortable: false, filter: false },
            { field: "Name", headerName: "Name", filter: 'agTextColumnFilter', flex: 1.5, cellStyle: { 'textAlign': 'left' } },
            { field: "Alias", headerName: "Alias", filter: 'agTextColumnFilter', flex: 1, cellStyle: { 'textAlign': 'left' } },
            { field: "Description", headerName: "Description", filter: 'agTextColumnFilter', flex: 2, cellStyle: { 'textAlign': 'left' } },
            { field: "TypesName", headerName: "Deposite Types", filter: 'agNumberColumnFilter', flex: 2, cellStyle: { 'textAlign': 'left' } },
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
                        scope.GetDepositeTypeById(params.data);
                        scope.$apply();
                    });
                    // DELETE CLICK
                    eDiv.querySelector(".delete-btn").addEventListener("click", function () {
                        scope.DelDepositeType(params.data);
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
        $scope.GetAllDepositeType();

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
            Per: '',
            LedgerId: '',
            Mode: 'Save'
        };
    }

    $scope.GetAllDepositeType = function () {
        $scope.loadingstatus = 'running';
        showPleaseWait();
        $http({
            method: 'POST',
            url: base_url + "Hospital/Creation/GetAllDepositeType",
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

    $scope.IsValidDepositeType = function () {
        //if ($scope.newMethods.Name.isEmpty()) {
        //    Swal.fire("Please ! Enter Product Name");
        //    return false;
        //}
        //else
        return true;
    }

    $scope.SaveUpdateDepositeType = function () {
        if ($scope.IsValidDepositeType() == true) {
            if ($scope.confirmMSG.Accept == true) {
                var saveModify = $scope.beData.Mode;
                Swal.fire({
                    title: 'Do you want to' + saveModify + 'the current data?',
                    showCancelButton: true,
                    confirmButtonText: saveModify,
                }).then((result) => {
                    if (result.isConfirmed) {
                        $scope.CallSaveUpdateDepositeType();
                    }

                });
            }
            else
                $scope.CallSaveUpdateDepositeType();
        }
    };

    $scope.CallSaveUpdateDepositeType = function () {
        $scope.loadingstatus = 'running';
        showPleaseWait();

        $http({
            method: 'POST',
            url: base_url + "Hospital/Creation/SaveDepositeType",
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
                $scope.GetAllDepositeType();
            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
        });
    }

    $scope.GetDepositeTypeById = function (beData) {

        $scope.loadingstatus = "running";
        var para = {
            DepositeTypeId: beData.DepositeTypeId
        };
        $http({
            method: 'POST',
            url: base_url + "Hospital/Creation/GetDepositeTypeById",
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

    $scope.DelDepositeType = function (refData, ind) {

        Swal.fire({
            title: 'Are you sure to delete selected Deposite Type:-' + refData.Name,
            showCancelButton: true,
            confirmButtonText: 'Delete',
        }).then((result) => {
            if (result.isConfirmed) {
                $scope.loadingstatus = "running";
                showPleaseWait();

                var para = {
                    DepositeTypeId: refData.DepositeTypeId
                };

                $http({
                    method: 'POST',
                    url: base_url + "Hospital/Creation/DelDepositeType",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingstatus = "stop";
                    Swal.fire(res.data.ResponseMSG);
                    if (res.data.IsSuccess) {
                        $scope.GetAllDepositeType();
                    }
                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }
        });

    }
});