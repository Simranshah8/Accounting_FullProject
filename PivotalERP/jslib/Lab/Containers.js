app.controller('Containers', function ($scope, $filter, $http, $timeout, GlobalServices) {
    $scope.Title = 'Containers';
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

        $('.select2').select2({
            allowClear: true,
            openOnEnter: true,
            placeholder: '**select data**',
        });

        $scope.loadingstatus = "stop";

        $scope.confirmMSG = GlobalServices.getConfirmMSG();
        $scope.perPageColl = GlobalServices.getPerPageList();


        $scope.currentPages = {
            Containers: 1
        };

        $scope.searchData = {
            Containers: ''
        };

        $scope.perPage = {
            Containers: GlobalServices.getPerPageRow(),
        };

        $scope.beData =
        {
            ContainerTypeId: 0,
            ContainerName: '',
            Color: '',
            Additive: '',
            VolumeMl: '',
            DefaultSpecimen: [],
            IsActive: true,
            Mode: 'Save',
        }

        $scope.columnDefs = [
            { headerName: "SNo.", width: 70, valueGetter: "node.rowIndex + 1", cellStyle: { textAlign: "center" }, sortable: false, filter: false },
            { field: "ContainerName", headerName: "ContainerName", filter: 'agTextColumnFilter', flex: 2, cellStyle: { 'textAlign': 'left' } },
            { field: "Color", headerName: "Color", filter: 'agTextColumnFilter', flex: 1.5, cellStyle: { 'textAlign': 'left' } },
            { field: "Additive", headerName: "Additive", filter: 'agTextColumnFilter', flex: 1.5, cellStyle: { 'textAlign': 'left' } },
            { field: "VolumeMl", headerName: "Volume", filter: 'agNumberColumnFilter', flex: 1.2, cellStyle: { 'textAlign': 'left' } },
            { field: "DefaultSpecimen", headerName: "DefaultSpecimen", filter: 'agTextColumnFilter', flex: 2, cellStyle: { 'textAlign': 'left' } },
            { field: "IsActive", headerName: "IsActive", filter: 'agTextColumnFilter', width: 100, cellStyle: { 'textAlign': 'center' } },
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
                        scope.getContainersById(params.data);
                        scope.$apply();
                    });
                    // DELETE CLICK
                    eDiv.querySelector(".delete-btn").addEventListener("click", function () {
                        scope.deleteContainers(params.data);
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

        $scope.GetAllContainers();

        //$scope.CategoryColl = [
        //    { id: 1, text: 'Blood' },
        //    { id: 2, text: 'Urine' },
        //    { id: 4, text: 'Stool' },
        //    { id: 5, text: 'CSF' },
        //    { id: 6, text: 'Swab' },
        //    { id: 7, text: 'Body Fluid' },
        //    { id: 8, text: 'Other' },
        //];
        $scope.SpecimenList = [];
        $http({
            method: 'Post',
            url: base_url + "Lab/Creation/GetAllSpecimenType",
            dataType: "json"
            //data:JSON.stringify(para)
        }).then(function (res) {

            $scope.loadingstatus = 'stop';
            hidePleaseWait();

            if (res.data.IsSuccess && res.data.Data) {
                $scope.CategoryColl = res.data.Data;
            } else
                Swal.fire(res.data.ResponseMSG);

        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    };

    $scope.saveRptListState = function () {
        GlobalServices.saveRptListState(EntityId, $scope.gridOptions);
    };

    $scope.ClearFields = function () {
        $scope.loadingstatus = "stop";
        $scope.beData =
        {
            ContainerTypeId: 0,
            ContainerName: '',
            Color: '',
            Additive: '',
            VolumeMl: '',
            DefaultSpecimen: [],
            DefaultSpecimenColl:[],
            IsActive: true,
            Mode: 'Save',
        };
        setTimeout(function () {
            $('.select2').val(null).trigger('change');
        }, 50);
    }

    $scope.GetAllContainers = function () {
        //$scope.ContainersList = [];
        $scope.loadingstatus = 'running';
        showPleaseWait();

        $http({
            method: 'POST',
            url: base_url + "Lab/Creation/GetAlllab_ContainerType",
            dataType: "json",
          /*  data: JSON.stringify(para)*/
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

    $scope.IsValidContainers = function () {
        return true;
    }

    $scope.SaveUpdateContainers = function () {

        if ($scope.confirmMSG.Accept == true) {
            var saveModify = $scope.beData.Mode;
            Swal.fire({
                title: 'Do you want to ' + saveModify + ' the current data?', 
                showCancelButton: true,
                confirmButtonText: saveModify,
            }).then((result) => {
                if (result.isConfirmed) {
                    $scope.CallSaveUpdateContainers();
                }

            });
        }
        else
            $scope.CallSaveUpdateContainers();
    };

    $scope.CallSaveUpdateContainers = function () {
        $scope.loadingstatus = 'running';
        showPleaseWait();

        if ($scope.beData.DefaultSpecimenColl) {
            $scope.beData.DefaultSpecimen = $scope.beData.DefaultSpecimenColl.toString();
        } else
            $scope.beData.DefaultSpecimen = "";


        $http({
            method: 'POST',
            url: base_url + "Lab/Creation/Savelab_ContainerType",
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
                $scope.GetAllContainers();
            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
        });
    }
    $scope.getContainersById = function (beData) {

        $scope.loadingstatus = "running";
        var para = {
            ContainerTypeId: beData.ContainerTypeId
        };

        $http({
            method: 'POST',
            url: base_url + "Lab/Creation/Getlab_ContainerTypeById",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $timeout(function () {
                    $scope.beData = res.data.Data;
                    $scope.beData.Mode = 'Modify';
                    if ($scope.beData.DefaultSpecimen) {
                        $scope.beData.DefaultSpecimenColl = $scope.beData.DefaultSpecimen.split(',').map(Number);
                        setTimeout(function () {
                            $('.select2').trigger('change');
                        }, 100);
                    }
                    $('#custom-tabs-four-profile-tab').tab('show');
                });
            } else
                Swal.fire(res.data.ResponseMSG);

        }, function (reason) {
            alert('Failed' + reason);
        });
    }

    $scope.deleteContainers = function (refData, ind) {

        Swal.fire({
            title: 'Are you sure to delete selected Container :- ' + refData.ContainerName,
            showCancelButton: true,
            confirmButtonText: 'Delete',
        }).then((result) => {
            if (result.isConfirmed) {
                $scope.loadingstatus = "running";
                showPleaseWait();

                var para = {
                    ContainerTypeId: refData.ContainerTypeId
                };

                $http({
                    method: 'POST',
                    url: base_url + "Lab/Creation/Dellab_ContainerType",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingstatus = "stop";
                    Swal.fire(res.data.ResponseMSG);
                    if (res.data.IsSuccess) {
                        $scope.GetAllContainers();
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