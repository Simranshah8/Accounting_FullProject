app.controller('LabTechnician', function ($scope, $filter, $http, $timeout, GlobalServices) {
    $scope.Title = 'Lab Technician';
    var glSrv = GlobalServices;

    $scope.onBtExportCSV = function () {
        var params = {
            fileName: 'LabTechnician.csv',
            sheetName: 'LabTechnician'
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
            LabTechnician: 1

        };

        $scope.searchData = {
            LabTechnician: ''

        };

        $scope.perPage = {
            LabTechnician: GlobalServices.getPerPageRow(),

        };

        $scope.newDet = {
            Name: '',
            Address: '',
            MobileNo: '',
            CitizenshipNo: '',
            NMCNo: '',
            Designation: '',
            Signature: '',
            Mode: 'Save'
        };

        $scope.columnDefs = [
            { headerName: "SNo.", width: 80, valueGetter: "node.rowIndex + 1", cellStyle: { textAlign: "center" }, sortable: false, filter: false },
            { field: "Name", headerName: "Name", filter: 'agTextColumnFilter', flex: 1.5, cellStyle: { 'textAlign': 'left' } },
            { field: "Designation", headerName: "Designation", filter: 'agTextColumnFilter', flex: 2, cellStyle: { 'textAlign': 'left' } },
            { field: "MobileNo", headerName: "Mobile No.", filter: 'agTextColumnFilter', flex: 1.5, cellStyle: { 'textAlign': 'left' } },
            { field: "Address", headerName: "Address", filter: 'agTextColumnFilter', flex: 2, cellStyle: { 'textAlign': 'left' } },
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
                        $scope.GetLabTechnicianById(params.data);
                        $scope.$apply();
                    });
                    // DELETE CLICK
                    eDiv.querySelector(".delete-btn").addEventListener("click", function () {
                        $scope.DelLabTechnician(params.data);
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
        $scope.GetAllLabTechnician();
    }

    $scope.ClearSignature = function () {
        $timeout(function () {
            $scope.$apply(function () {
                $scope.newDet.SignatureData = null;
                $scope.newDet.Signature_TMP = [];
            });
        });
        $('#Signature').attr('src', '');
    };

    $scope.ClearFields = function () {
        $scope.ClearSignature();
        $scope.newDet = {
            Name: '',
            Address: '',
            MobileNo: '',
            CitizenshipNo: '',
            NMCNo: '',
            Designation: '',
            Signature: '',
            Mode: 'Save'
        };
    };

    $scope.IsValidLabTechnician = function () {

        return true;
    }

    $scope.SaveUpdateLabTechnician = function () {
        if ($scope.IsValidLabTechnician() == true) {
            if ($scope.confirmMSG.Accept == true) {
                var saveModify = $scope.newDet.Mode;
                Swal.fire({
                    title: 'Do you want to ' + saveModify + ' the current data?',
                    showCancelButton: true,
                    confirmButtonText: saveModify,
                }).then((result) => {
                    if (result.isConfirmed) {
                        $scope.CallSaveUpdateLabTechnician();
                    }
                });
            } else
                $scope.CallSaveUpdateLabTechnician();

        }
    };

    $scope.CallSaveUpdateLabTechnician = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();

        var Sign = $scope.newDet.Signature_Tmp;

        $http({
            method: 'POST',
            url: base_url + "Lab/Creation/SaveLabTechnician",
            headers: { 'Content-Type': undefined },
            transformRequest: function (data) {
                var formData = new FormData();
                formData.append("jsonData", angular.toJson(data.jsonData));

                if (data.SImg && data.SImg.length > 0)
                    formData.append("Sign", data.SImg[0]);


                return formData;
            },
            data: { jsonData: $scope.newDet, SImg: Sign }
        }).then(function (res) {

            $scope.loadingstatus = "stop";
            hidePleaseWait();

            Swal.fire(res.data.ResponseMSG);

            if (res.data.IsSuccess == true) {
                $scope.ClearFields();
                $scope.GetAllLabTechnician();
            }

        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";

        });
    }
    $scope.GetAllLabTechnician = function () {
        $scope.LabTechnicianList = [];
        $scope.loadingstatus = 'running';
        showPleaseWait();

        $http({
            method: 'POST',
            url: base_url + "Lab/Creation/GetAllLabTechnician",
            dataType: "json"
        }).then(function (res) {

            $scope.loadingstatus = 'stop';
            hidePleaseWait();

            if (res.data.IsSuccess && res.data.Data) {
                $scope.LabTechnicianList = res.data.Data;
                $scope.gridOptions.api.setRowData($scope.LabTechnicianList);

            } else
                alert(res.data.ResponseMSG);

        }, function (reason) {
            alert('Failed' + reason);
        });

    }


    $scope.GetLabTechnicianById = function (resData) {
        $scope.loadingstatus = "running";
        showPleaseWait();
        var para = {
            LabTechnicianId: resData.LabTechnicianId
        };
        $http({
            method: 'POST',
            url: base_url + "Lab/Creation/GetLabTechnicianById",
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

    $scope.DelLabTechnician = function (refData, ind) {
        Swal.fire({
            title: 'Are you sure you want to delete ' + refData.Name + '?',
            showCancelButton: true,
            confirmButtonText: 'Delete',
        }).then((result) => {
            if (result.isConfirmed) {
                var para = { LabTechnicianId: refData.LabTechnicianId };
                $http({
                    method: 'POST',
                    url: base_url + "Lab/Creation/DelLabTechnician",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingStatus = "stop";

                    Swal.fire(res.data.ResponseMSG);
                    if (res.data.IsSuccess == true) {
                        $scope.GetAllLabTechnician();
                    }
                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }

        });

    }
});
