app.controller('Lookups', function ($scope, $filter, $http, $timeout, GlobalServices) {
    $scope.Title = 'LookUps';
    $scope.onBtExportCSV = function () {
        var params = {
            fileName: 'Lookups.csv',
            sheetName: 'Lookups'
        };
        $scope.gridOptions.api.exportDataAsCsv(params);
    }
    $scope.onFilterTextBoxChanged = function () {
        $scope.gridOptions.api.setQuickFilter($scope.search);
    }

    var glSrv = GlobalServices;
    $scope.LoadData = function () {

        $scope.loadingstatus = "stop";

        $scope.confirmMSG = GlobalServices.getConfirmMSG();
        $scope.perPageColl = GlobalServices.getPerPageList();


        $scope.currentPages = {
            Lookups: 1

        };

        $scope.searchData = {
            Lookups: ''

        };

        $scope.perPage = {
            Lookups: GlobalServices.getPerPageRow(),

        };

        $scope.newDet =
        {
            Name: '',
            Purpose: '',
            IsActive: true,
            LookUpsColl: [],
        }

        $scope.newDet.LookUpsColl.push({
            SortOrder: 1
        });

        $scope.DepartmentColl = [
            { id: 1, text: 'Biochemistry' },
            { id: 2, text: 'Hematology' },
            { id: 3, text: 'Microbiology' }
        ];

        $scope.SpecimenColl = [
            { id: 1, text: 'Serum' },
            { id: 2, text: 'Plasma(EDTA)' },
            { id: 3, text: 'Urine(spot)' }
        ];

        $scope.ContainerColl = [
            { id: 1, text: 'SST(Red/Gold)' },
            { id: 2, text: 'Light Blue(3.2% Citrate)' },
            { id: 3, text: 'Lavender(EDTA)' }
        ];

        $scope.MethodColl = [
            { id: 1, text: 'Enzymatic/Colorimetric' },
            { id: 2, text: 'CLIA' },
            { id: 3, text: 'Coagulometry' }
        ];

        $scope.UnitColl = [
            { id: 1, text: 'mg/DL' },
            { id: 2, text: 'mmol/DL' },
            { id: 3, text: 'sec' }
        ];

        $scope.ResultColl = [
            { id: 1, text: 'numeric' },
            { id: 2, text: 'text' },
            { id: 3, text: 'Categorical' },
            { id: 4, text: 'Boolean' },
            { id: 5, text: 'Image' },

        ];

        $scope.RunTypeColl = [
            { id: 1, text: 'normal' },
            { id: 2, text: 'slat' },
            { id: 3, text: 'urgent' }
        ];

        $scope.StatusColl = [
            { id: 1, text: 'active' },
            { id: 2, text: 'retired' },

        ];

        $scope.columnDefs = [

            { headerName: "SNo.", width: 70, valueGetter: "node.rowIndex + 1", cellStyle: { textAlign: "center" }, sortable: false, filter: false },
            { field: "Name", headerName: "Name", filter: 'agTextColumnFilter', flex: 2, cellStyle: { 'textAlign': 'left' } },
            { field: "Purpose", headerName: "Purpose", filter: 'agTextColumnFilter', flex: 1.5, cellStyle: { 'textAlign': 'left' } },
            { field: "IsActive", headerName: "IsActive", filter: 'agTextColumnFilter', flex: 1, cellStyle: { 'textAlign': 'center' } },
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
                        scope.GetLookupById(params.data);
                        scope.$apply();
                    });

                    // DELETE CLICK

                    eDiv.querySelector(".delete-btn").addEventListener("click", function () {
                        scope.DelLookup(params.data);
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



        $scope.GetAllLookups();
    };
    $scope.saveRptListState = function () {
        GlobalServices.saveRptListState(EntityId, $scope.gridOptions);
    };
    $scope.ClearFields = function () {
        $scope.loadingstatus = "stop";

        $scope.newMaster = {
            TranId: 0
        };
        $scope.newDet =
        {
            Name: '',
            Purpose: '',
            IsActive: true,
            LookUpsColl: [],
        }
        $scope.newDet.LookUpsColl.push({
            SortOrder: 1
        });
    }

    $scope.IsValidLookUps = function () {
        //if ($scope.newDet.First_Name.isEmpty()) {
        //	Swal.fire('Please ! Enter First Name');
        //	return false;
        //}
        return true;
    }

    $scope.SaveUpdateLookUps = function () {
        //if ($scope.IsValidLookUps() == true) {
        if ($scope.confirmMSG.Accept == true) {
            var saveModify = $scope.newDet.Mode;
            Swal.fire({
                title: 'Do you want to ' + saveModify + ' the current data?',
                showCancelButton: true,
                confirmButtonText: saveModify,
            }).then((result) => {
                if (result.isConfirmed) {
                    $scope.CallSaveUpdateLookUps();
                }
            });
        } else
            $scope.CallSaveUpdateLookUps();

        //    }
    };

    $scope.CallSaveUpdateLookUps = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();
        $http({
            method: 'Post',
            url: base_url + "Lab/Creation/SaveLabAnswerSetValue",
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
                $scope.GetAllLookups();
            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
        });
    };


    $scope.GetAllLookups = function () {
/*        $scope.LookupData = [];*/
        $scope.loadingstatus = "running";
        showPleaseWait();
        $http({
            method: 'POST',
            url: base_url + "Lab/Creation/GetAllLabAnswerSetValue",
            dataType: "json",
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

    $scope.GetLookupById = function (refData) {
        $scope.loadingstatus = "running";
        showPleaseWait();
        var para = {
            LookupId: refData.LookupId
        };
        $http({
            method: 'POST',
            url: base_url + "Lab/Creation/GetLabAnswerSetValueById",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.newDet = res.data.Data;
                $scope.newDet.Mode = 'Modify';

                //for child table
                if (!$scope.newDet.LookUpsColl || $scope.newDet.LookUpsColl.length == 0) {

                    $scope.newDet.LookUpsColl = [];

                    $scope.newDet.LookUpsColl.push({});

                }
                //end
                $('#custom-tabs-four-profile-tab').tab('show');

            } else {
                Swal.fire(res.data.ResponseMSG);
            }

        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    };


    $scope.DelLookup = function (refData, ind) {
        Swal.fire({
            title: 'Are you sure you want to delete ' + refData.LookupId + '?',
            showCancelButton: true,
            confirmButtonText: 'Delete',
        }).then((result) => {
            if (result.isConfirmed) {
                var para = { LookupId: refData.LookupId };
                $http({
                    method: 'POST',
                    url: base_url + "Lab/Creation/DelLabAnswerSetValue",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingStatus = "stop";

                    Swal.fire(res.data.ResponseMSG);
                    if (res.data.IsSuccess == true) {
                        GetAllLookups();
                    }
                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }

        });

    }
    //for child table
    $scope.AddPHDDetails = function (ind) {
        if ($scope.newDet.LookUpsColl) {
            if ($scope.newDet.LookUpsColl.length > ind + 1) {
                $scope.newDet.LookUpsColl.splice(ind + 1, 0, {
                    SortOrder: 1
                })
            } else {
                $scope.newDet.LookUpsColl.push({
                    SortOrder: 1
                })
            }
        }
    };

    //for child table
    $scope.delPHDDetails = function (ind) {
        if ($scope.newDet.LookUpsColl) {
            if ($scope.newDet.LookUpsColl.length > 1) {
                $scope.newDet.LookUpsColl.splice(ind, 1);
            }
        }
    };

});