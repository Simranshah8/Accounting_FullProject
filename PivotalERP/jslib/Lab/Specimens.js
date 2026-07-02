app.controller("specimen", function ($scope, $http, GlobalServices, $timeout) {
    $scope.Title = 'specimen';
    $scope.onBtExportCSV = function () {
        var params = {
            fileName: 'specimen.csv',
            sheetName: 'specimen'
        };
        $scope.gridOptions.api.exportDataAsCsv(params);
    }
    $scope.onFilterTextBoxChanged = function () {
        $scope.gridOptions.api.setQuickFilter($scope.search);
    }

    $scope.LoadData = function () {
        $scope.loadingstatus = "stop";
        $scope.confirmMSG = GlobalServices.getConfirmMSG();
        $scope.newDet =
        {
            Name: '',
            CategoryId: null,
            ContainerHint: '',
            ProcessingInstructions: '',
            IsActive: true,
            Mode: 'Save',

        }
        $scope.CategoryColl = [
            { id: 1, text: 'Blood' },
            { id: 2, text: 'Urine' },
            { id: 3, text: 'Stool' },
            { id: 4, text: 'CSF' },
            { id: 5, text: 'Swab' },
            { id: 6, text: 'Body Fluid' },
            { id: 7, text: 'Other' }
        ];

        $scope.columnDefs = [
            { headerName: "SNo.", width: 70, valueGetter: "node.rowIndex + 1", cellStyle: { textAlign: "center" }, sortable: false, filter: false },
            { field: "Name", headerName: "Name", filter: 'agTextColumnFilter', flex: 2, cellStyle: { 'textAlign': 'left' } },
            { field: "Category", headerName: "Category", filter: 'agTextColumnFilter', flex: 1.5, cellStyle: { 'textAlign': 'left' } },
            { field: "ContainerHint", headerName: "Container Hint", filter: 'agTextColumnFilter', flex: 2, cellStyle: { 'textAlign': 'left' } },
            { field: "ProcessingInstructions", headerName: "Processing Instruction", filter: 'agTextColumnFilter', flex: 2, cellStyle: { 'textAlign': 'left' } },
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
                        scope.GetSpecimenById(params.data);
                        scope.$apply();
                    });

                    // DELETE CLICK

                    eDiv.querySelector(".delete-btn").addEventListener("click", function () {
                        scope.DeleteSpecimen(params.data);
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
        $scope.GetAllSpecimen();

    };

    $scope.saveRptListState = function () {
        GlobalServices.saveRptListState(EntityId, $scope.gridOptions);
    };

    $scope.ClearFields = function () {
        $scope.loadingstatus = "stop";
        $scope.newDet =
        {
            Name: '',
            CategoryId: null,
            ContainerHint: '',
            ProcessingInstructions: '',
            IsActive: true,
            Mode: 'Save',

        }
        $('#txtName').focus();
    }

    $scope.GetAllSpecimen = function () {
        // $scope.SpecimenList = [];
        $scope.loadingstatus = 'running';
        showPleaseWait();

        $http({
            method: 'POST',
            url: base_url + "Lab/Creation/GetAllSpecimenType",
            dataType: "json"
            //data:JSON.stringify(para)
        }).then(function (res) {
            $scope.loadingstatus = 'stop';
            hidePleaseWait();
            if (res.data.IsSuccess && res.data.Data) {
                $scope.DataColl = res.data.Data;
                $scope.gridOptions.api.setRowData($scope.DataColl);
                //$scope.SpecimenList = res.data.Data;
            } else
                Swal.fire(res.data.ResponseMSG);

        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

    }

    $scope.IsValidSpecimen = function () {
        //if ($scope.newProductBrand.Name.isEmpty()) {
        //    Swal.fire("Please ! Enter Product Name");
        //    return false;
        //}
        //else
        return true;
    }

    $scope.SaveUpdateSpecimen = function () {
        //if ($scope.IsValidSpecimen() == true) {
        if ($scope.confirmMSG.Accept == true) {
            var saveModify = $scope.beData.Mode;
            Swal.fire({
                title: 'Do you want to' + saveModify + 'the current data?',
                showCancelButton: true,
                confirmButtonText: saveModify,
            }).then((result) => {
                if (result.isConfirmed) {
                    $scope.CallSaveUpdateProductBrand();
                }

            });
        }
        else
            $scope.CallSaveUpdateSpecimen();
        //    }
    };

    $scope.CallSaveUpdateSpecimen = function () {
        $scope.loadingstatus = 'running';
        showPleaseWait();

        $http({
            method: 'Post',
            url: base_url + "Lab/Creation/SaveSpecimenType",
            headers: { 'content-Type': undefined },

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
                $scope.GetAllSpecimen();
            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
        });
    }

    $scope.GetSpecimenById = function (refData) {
        $scope.loadingstatus = "running";
        showPleaseWait();
        var para = {
            SpecimenTypeId: refData.SpecimenTypeId
        };
        $http({
            method: 'Post',
            url: base_url + "Lab/Creation/GetSpecimenTypeById",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.newDet = res.data.Data;
                $scope.newDet.Mode = 'Modify';
                $('#custom-tabs-four-profile-tab').tab('show');
            } else {
                Swal.fire(res.data.ResponseMSG);
            }

        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    };

    $scope.DeleteSpecimen = function (refData, ind) {

        Swal.fire({
            title: 'Are you sure to delete :-' + refData.Name,
            showCancelButton: true,
            confirmButtonText: 'Delete',
        }).then((result) => {
            if (result.isConfirmed) {
                $scope.loadingstatus = "running";
                showPleaseWait();

                var para = {
                    SpecimenTypeId: refData.SpecimenTypeId
                };

                $http({
                    method: 'POST',
                    url: base_url + "Lab/Creation/DelSpecimenType",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingstatus = "stop";
                    Swal.fire(res.data.ResponseMSG);
                    if (res.data.IsSuccess == true) {
                        $scope.GetAllSpecimen();
                    }

                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }
        });
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
                down_file(base_url + "//" + res.data.Data.ResponseId, "Specimen.xlsx");
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