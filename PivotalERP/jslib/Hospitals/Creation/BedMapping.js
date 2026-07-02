app.controller('BedMapping', function ($scope, $filter, $http, $timeout, GlobalServices) {
    $scope.Title = 'BedMapping';
    $scope.onBtExportCSV = function () {
        var params = {
            fileName: 'BedMapping.csv',
            sheetName: 'BedMapping'
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
        $scope.perPageList = GlobalServices.getPerPageList();
        $scope.currentPages = {
            BedMapping: 1
        };

        $scope.searchData = {
            BedMapping: ''
        };

        $scope.perPage = {
            BedMapping: GlobalServices.getPerPageRow(),
        };

        $scope.BuildingTypeList = []
        $http({
            method: 'POST',
            url: base_url + "Hospital/Creation/GetAllBuildingType",
            dataType: "json"
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.BuildingTypeList = res.data.Data;
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        $scope.FloorList = []
        $http({
            method: 'POST',
            url: base_url + "Hospital/Creation/GetAllFloor",
            dataType: "json"
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.FloorList = res.data.Data;
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
        $scope.WardList = []
        $http({
            method: 'POST',
            url: base_url + "Hospital/Creation/GetAllWard",
            dataType: "json"
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.WardList = res.data.Data;
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
        $scope.RoomList = []
        $http({
            method: 'POST',
            url: base_url + "Hospital/Creation/GetAllRoom",
            dataType: "json"
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.RoomList = res.data.Data;
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        $scope.beData =
        {
            TranId: null,
            BuildingTypeId: null,
            FloorId: null,
            WardId: null,
            RoomId: null,
            NoOfBed: null,
            StartNo: 0,
            EndNo: null,
            Mode: 'Save',
        }

        $scope.columnDefs = [
            { headerName: "SNo.", width: 80, valueGetter: "node.rowIndex + 1", cellStyle: { textAlign: "center" }, sortable: false, filter: false },
            { field: "BuildingType", headerName: "Building", filter: 'agTextColumnFilter', flex: 1.5, cellStyle: { 'textAlign': 'left' } },
            { field: "Floor", headerName: "Floor", filter: 'agTextColumnFilter', flex: 3, cellStyle: { 'textAlign': 'left' } },
            { field: "Ward", headerName: "Ward", filter: 'agTextColumnFilter', flex: 3, cellStyle: { 'textAlign': 'left' } },
            { field: "Room", headerName: "Room", filter: 'agTextColumnFilter', flex: 1.3, cellStyle: { 'textAlign': 'left' } },
            { field: "NoOfBed", headerName: "No. Of Bed", filter: 'agNumberColumnFilter', flex: 1.2, cellStyle: { 'textAlign': 'left' } },
            { field: "StartNo", headerName: "Start No", filter: 'agNumberColumnFilter', flex: 1, cellStyle: { 'textAlign': 'left' } },
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
                        scope.getBedMappingById(params.data);
                        scope.$apply();
                    });
                    // DELETE CLICK
                    eDiv.querySelector(".delete-btn").addEventListener("click", function () {
                        scope.deleteBedMapping(params.data);
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
        $scope.GetAllBedMapping();

    };

    $scope.saveRptListState = function () {
        GlobalServices.saveRptListState(EntityId, $scope.gridOptions);
    };

    $scope.ClearFields = function () {
        $scope.loadingstatus = "stop";
        $scope.beData =
        {
            TranId: null,
            BuildingTypeId: null,
            FloorId: null,
            WardId: null,
            RoomId: null,
            NoOfBed: null,
            StartNo: 0,
            EndNo: null,
            Mode: 'Save',
        }
        $('#txtName').focus();
    }

    $scope.GetAllBedMapping = function () {
        /* $scope.BedMappingList = [];*/ //declare an empty array
        $scope.loadingstatus = 'running';
        showPleaseWait();
        $http({
            method: 'POST',
            url: base_url + "Hospital/Creation/GetAllBedMapping",
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

    $scope.IsValidBedMapping = function () {
        return true;
    }

    $scope.SaveUpdateBedMapping = function () {
        if ($scope.IsValidBedMapping() == true) {
            if ($scope.confirmMSG.Accept == true) {
                var saveModify = $scope.beData.Mode;
                Swal.fire({
                    title: 'Do you want to' + saveModify + 'the current data?',
                    showCancelButton: true,
                    confirmButtonText: saveModify,
                }).then((result) => {
                    if (result.isConfirmed) {
                        $scope.CallSaveUpdateBedMapping();
                    }

                });
            }
            else
                $scope.CallSaveUpdateBedMapping();
        }
    };

    $scope.CallSaveUpdateBedMapping = function () {
        $scope.loadingstatus = 'running';
        showPleaseWait();
        $http({
            method: 'POST',
            url: base_url + "Hospital/Creation/SaveBedMapping",
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
                $scope.GetAllBedMapping();
            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
        });
    }

    $scope.getBedMappingById = function (beData) {
        $scope.loadingstatus = "running";
        var para = {
            TranId: beData.TranId
        };
        $http({
            method: 'POST',
            url: base_url + "Hospital/Creation/GetBedMappingById",
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
                $timeout(function () {
                    $('.select2').each(function () {
                        if ($(this).hasClass('select2-hidden-accessible')) {
                            $(this).select2('destroy');
                        }
                        $(this).select2({ width: '100%' });
                    });
                }, 0);
            } else
                Swal.fire(res.data.ResponseMSG);

        }, function (reason) {
            alert('Failed' + reason);
        });
    }

    $scope.deleteBedMapping = function (refData, ind) {
        Swal.fire({
            title: 'Are you sure to delete selected Bed Mapping :-' + refData.BuildingType,
            showCancelButton: true,
            confirmButtonText: 'Delete',
        }).then((result) => {
            if (result.isConfirmed) {
                $scope.loadingstatus = "running";
                showPleaseWait();

                var para = {
                    TranId: refData.TranId
                };

                $http({
                    method: 'POST',
                    url: base_url + "Hospital/Creation/DelBedMapping",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingstatus = "stop";
                    Swal.fire(res.data.ResponseMSG);
                    if (res.data.IsSuccess) {
                        $scope.GetAllBedMapping();
                    }
                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }
        });
    }

    $scope.calculateBedRange = function () {
        if ($scope.beData.NoOfBed > 0) {
            $scope.beData.StartNo = 1;
            $scope.beData.EndNo = $scope.beData.NoOfBed;
        }
    };

    $scope.updateEndNo = function () {
        if ($scope.beData.StartNo > 0 && $scope.beData.NoOfBed > 0) {
            $scope.beData.EndNo = parseInt($scope.beData.StartNo) +
                parseInt($scope.beData.NoOfBed) - 1;
        }
    };



});