app.controller('Disability', function ($scope, $filter, $http, $timeout, GlobalServices) {
    $scope.Title = 'Disability';
    var glSrv = GlobalServices;

    $scope.onBtExportCSV = function () {
        var params = {
            fileName: 'Disability.csv',
            sheetName: 'Disability'
        };
        $scope.gridOptions.api.exportDataAsCsv(params);
    }
    $scope.onFilterTextBoxChanged = function () {
        $scope.gridOptions.api.setQuickFilter($scope.search);
    }

    $scope.LoadData = function () {
        $('.select2').select2();
        $scope.loadingstatus = "stop";

        $scope.confirmMSG = GlobalServices.getConfirmMSG();
        $scope.perPageColl = GlobalServices.getPerPageList();


        $scope.currentPages = {
            Disability: 1

        };

        $scope.searchData = {
            Disability: ''

        };

        $scope.perPage = {
            Disability: GlobalServices.getPerPageRow(),

        };

        $scope.newDet = {
            Name: '',
            Alias: '',
            Description: '',
            Mode: 'Save'
        };

        $scope.columnDefs = [
            { headerName: "SNo.", width: 100, valueGetter: "node.rowIndex + 1", cellStyle: { textAlign: "center" }, sortable: false, filter: false },
            { field: "Name", headerName: "Name", filter: 'agTextColumnFilter', cellStyle: { 'textAlign': 'left' }, width: 100 },
            { field: "Alias", headerName: "Alias", filter: 'agTextColumnFilter', cellStyle: { 'textAlign': 'left' }, width: 100 },
            { field: "Description", headerName: "Description", filter: 'agTextColumnFilter', cellStyle: { 'textAlign': 'left' }, width: 100 },

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
                        $scope.GetDisabilityById(params.data);
                        $scope.$apply();
                    });
                    // DELETE CLICK
                    eDiv.querySelector(".delete-btn").addEventListener("click", function () {
                        $scope.DelDisability(params.data);
                        $scope.$apply();
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
        $scope.GetAllDisability();
    }

    $scope.ClearFields = function () {
        $scope.newDet = {
            Name: '',
            Alias: '',
            Description: '',
            Mode: 'Save'
        };
    };

    $scope.IsValidDisability = function () {

        return true;
    }

    $scope.SaveUpdateDisability = function () {
        if ($scope.IsValidDisability() == true) {
            if ($scope.confirmMSG.Accept == true) {
                var saveModify = $scope.newDet.Mode;
                Swal.fire({
                    title: 'Do you want to ' + saveModify + ' the current data?',
                    showCancelButton: true,
                    confirmButtonText: saveModify,
                }).then((result) => {
                    if (result.isConfirmed) {
                        $scope.CallSaveUpdateDisability();
                    }
                });
            } else
                $scope.CallSaveUpdateDisability();

        }
    };

    $scope.CallSaveUpdateDisability = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();
        $http({
            method: 'POST',
            url: base_url + "Hospital/Creation/SaveDisability",
            headers: { 'Content-Type': undefined },
            transformRequest: function (data) {
                var formData = new FormData();
                formData.append("jsonData", angular.toJson(data.jsonData));

                return formData;
            },
            data: { jsonData: $scope.newDet }
        }).then(function (res) {

            $scope.loadingstatus = "stop";
            hidePleaseWait();

            Swal.fire(res.data.ResponseMSG);

            if (res.data.IsSuccess == true) {
                $scope.ClearFields();
                $scope.GetAllDisability();
            }

        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";

        });
    }
    $scope.GetAllDisability = function () {
        $scope.DisabilityList = [];
        $scope.loadingstatus = 'running';
        showPleaseWait();

        $http({
            method: 'POST',
            url: base_url + "Hospital/Creation/GetAllDisability",
            dataType: "json"
        }).then(function (res) {

            $scope.loadingstatus = 'stop';
            hidePleaseWait();

            if (res.data.IsSuccess && res.data.Data) {
                $scope.DisabilityList = res.data.Data;
                $scope.gridOptions.api.setRowData($scope.DisabilityList);

            } else
                alert(res.data.ResponseMSG);

        }, function (reason) {
            alert('Failed' + reason);
        });

    }


    $scope.GetDisabilityById = function (resData) {
        $scope.loadingstatus = "running";
        showPleaseWait();
        var para = {
            DisabilityId: resData.DisabilityId
        };
        $http({
            method: 'POST',
            url: base_url + "Hospital/Creation/GetDisabilityById",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.newDet = res.data.Data;
                $scope.newDet.Mode = 'Modify';
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
            $('#custom-tabs-four-profile-tab').tab('show');
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    };

    $scope.DelDisability = function (refData, ind) {
        Swal.fire({
            title: 'Are you sure you want to delete ' + refData.Name + '?',
            showCancelButton: true,
            confirmButtonText: 'Delete',
        }).then((result) => {
            if (result.isConfirmed) {
                var para = { DisabilityId: refData.DisabilityId };
                $http({
                    method: 'POST',
                    url: base_url + "Hospital/Creation/DelDisability",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingStatus = "stop";

                    Swal.fire(res.data.ResponseMSG);
                    if (res.data.IsSuccess == true) {
                        $scope.GetAllDisability();
                    }
                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }

        });

    }
});
