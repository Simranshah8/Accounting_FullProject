app.controller('Department', function ($scope, $filter, $http, $timeout, GlobalServices) {
    $scope.Title = 'Department';
    var glSrv = GlobalServices;

    $scope.onBtExportCSV = function () {
        var params = {
            fileName: 'LabCategory.csv',
            sheetName: 'LabCategory'
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
            Department: 1
        };

        $scope.searchData = {
            Department: ''
        };

        $scope.perPage = {
            Department: GlobalServices.getPerPageRow(),
        };

        $scope.newDet =
        {
            Name: '',
            Alias: '',
            RoomNo: '',
            Description: '',
            CanChangeOPDCharge: false,
            CanChangeDepositeAmount: false,
            CanChageInCharge: false,
            OutPatientCharge: '',
            DepositeAmount: '',
            InPatientCharge: '',
            LedgerId: null,
            BranchId: null,
            CostCenterId: null,
            ActiveAccount: false,
            IsActive: false,
            ApplyTax: false,
            IncludeTax: false,

            LabDoctor: '',
            DoctorDesignation: '',
            DoctorLicNo: '',
            DoctorNotes: '',
            DoctorSign: '',

            OPDTicketTypeId: null,
            DoctorId: null,
            OutPatientCharge: '',
            InPatientCharge: '',
            DepositeAmount:'',
            ValidDays:'',
            ReOutPatientCharge: '',

            DepartmentDetailsColl: [],
            DepartmentDoctorRateColl: [],
            Mode: 'Save'
        }
        $scope.newDet.DepartmentDetailsColl.push({});
        $scope.newDet.DepartmentDoctorRateColl.push({});

        $scope.BranchColl = [
            {id:1,text:'Archita Diagnosis'},
            {id:2,text:'Prabhu Hospital'}
        ]
        

        $scope.OpDTicketTypeColl = [];
        $http({
            method: 'POST',
            url: base_url + "Hospital/Creation/GetAllOPDTicketType",
            dataType: "json"
        }).then(function (res) {

            $scope.loadingstatus = 'stop';
            hidePleaseWait();

            if (res.data.IsSuccess && res.data.Data) {
                $scope.OpDTicketTypeColl = res.data.Data;
            } else
                Swal.fire(res.data.ResponseMSG);

        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        $scope.DoctorColl = [];
        $http({
            method: 'POST',
            url: base_url + "Hospital/Creation/GetAllDoctor",
            dataType: "json"
        }).then(function (res) {

            $scope.loadingstatus = 'stop';
            hidePleaseWait();

            if (res.data.IsSuccess && res.data.Data) {
                $scope.DoctorColl = res.data.Data;
            } else
                Swal.fire(res.data.ResponseMSG);

        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        $scope.CostCenterColl = [];
        $http({
            method: 'Get',
            url: base_url + "Hospital/Creation/GetAllCostCenter",
            dataType: "json"
        }).then(function (res) {
            $scope.loadingstatus = 'stop';
            hidePleaseWait();
            if (res.data.IsSuccess && res.data.Data) {
                $scope.CostCenterColl = res.data.Data;
            } else
                Swal.fire(res.data.ResponseMSG);

        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        $scope.ClearSign = function () {
            $timeout(function () {
                $scope.$apply(function () {
                    $scope.newDet.DoctorSignData = null;
                    $scope.newDet.DoctorSign_TMP = [];
                });
            });
            $('#Photo').attr('src', '');
        };

        $scope.columnDefs = [
            { headerName: "SNo.", width: 70, valueGetter: "node.rowIndex + 1", cellStyle: { textAlign: "center" }, sortable: false, filter: false },
            { field: "Name", headerName: "Name", filter: 'agTextColumnFilter', flex: 2, cellStyle: { 'textAlign': 'left' } },
            { field: "Alias", headerName: "Alias", filter: 'agTextColumnFilter', flex: 1, cellStyle: { 'textAlign': 'left' } },
            { field: "Description", headerName: "Description", filter: 'agNumberColumnFilter', flex: 1.2, cellStyle: { 'textAlign': 'left' } },
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
                        scope.GetDepartmentById(params.data);
                        scope.$apply();
                    });
                    // DELETE CLICK
                    eDiv.querySelector(".delete-btn").addEventListener("click", function () {
                        scope.DeleteDepartment(params.data);
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

        $scope.GetAllDepartment();

    };

    $scope.ClearFields = function () {
        $scope.ClearSign();
        $scope.newDet =
        {
            Name: '',
            Alias: '',
            RoomNo: '',
            Description: '',
            CanChangeOPDCharge: false,
            CanChangeDepositeAmount: false,
            CanChageInCharge: false,
            OutPatientCharge: '',
            DepositeAmount: '',
            InPatientCharge: '',
            LedgerId: null,
            BranchId: null,
            CostCenterId: null,
            EffectAccount: false,
            IsActive: false,
            ApplyTax: false,
            IncludeTax: false,

            LabDoctor: '',
            DoctorDesignation: '',
            DoctorLicNo: '',
            DoctorNotes: '',
            DoctorSign: '',

            OPDTicketTypeId: null,
            DoctorId: null,
            OutPatientCharge: '',
            InPatientCharge: '',
            DepositeAmount: '',
            ValidDays: '',
            ReOutPatientCharge: '',

            DepartmentDetailsColl: [],
            DepartmentDoctorRateColl: [],
            Mode: 'Save'
        }
        $scope.newDet.DepartmentDetailsColl.push({});
        $scope.newDet.DepartmentDoctorRateColl.push({});
    }


    //for child table
    $scope.AddPHDDetails = function (ind) {
        if ($scope.newDet.DepartmentDetailsColl) {
            if ($scope.newDet.DepartmentDetailsColl.length > ind + 1) {
                $scope.newDet.DepartmentDetailsColl.splice(ind + 1, 0, {
                    ClassName: ''
                })
            } else {
                $scope.newDet.DepartmentDetailsColl.push({
                    ClassName: ''
                })
            }
        }
    };

    //for child table
    $scope.delPHDDetails = function (ind) {
        if ($scope.newDet.DepartmentDetailsColl) {
            if ($scope.newDet.DepartmentDetailsColl.length > 1) {
                $scope.newDet.DepartmentDetailsColl.splice(ind, 1);
            }
        }
    };
    
    //for child table
    $scope.AddPHDDoctorWise = function (ind) {
        if ($scope.newDet.DepartmentDoctorRateColl) {
            if ($scope.newDet.DepartmentDoctorRateColl.length > ind + 1) {
                $scope.newDet.DepartmentDoctorRateColl.splice(ind + 1, 0, {
                    ClassName: ''
                })
            } else {
                $scope.newDet.DepartmentDoctorRateColl.push({
                    ClassName: ''
                })
            }
        }
    };

    //for child table
    $scope.delPHDDoctorWise = function (ind) {
        if ($scope.newDet.DepartmentDoctorRateColl) {
            if ($scope.newDet.DepartmentDoctorRateColl.length > 1) {
                $scope.newDet.DepartmentDoctorRateColl.splice(ind, 1);
            }
        }
    };


    $scope.IsValidDepartment = function () {
        return true;
    }

    $scope.SaveUpdateDepartment = function () {
        if ($scope.IsValidDepartment() == true) {
            if ($scope.confirmMSG.Accept == true) {
                var saveModify = $scope.newDet.Mode;
                Swal.fire({
                    title: 'Do you want to' + saveModify + 'the current data?',
                    showCancelButton: true,
                    confirmButtonText: saveModify,
                }).then((result) => {
                    if (result.isConfirmed) {
                        $scope.CallSaveUpdateDepartment();
                    }

                });
            }
            else
                $scope.CallSaveUpdateDepartment();
        }
    };

    $scope.CallSaveUpdateDepartment = function () {
        $scope.loadingstatus = 'running';
        showPleaseWait();

        var DoctorSignature = $scope.newDet.DoctorSign_Tmp;

        $http({
            method: 'POST',
            url: base_url + "Hospital/Creation/SaveDepartment",
            headers: { 'content-Type': undefined },

            transformRequest: function (data) {
                var formData = new FormData();
                formData.append("jsonData", angular.toJson(data.jsonData));

                if (data.Sign && data.Sign.length > 0)
                    formData.append("DoctorSignature", data.Sign[0]);

                return formData;
            },
            data: { jsonData: $scope.newDet, Sign: DoctorSignature }
        }).then(function (res) {

            $scope.loadingstatus = "stop";
            hidePleaseWait();

            Swal.fire(res.data.ResponseMSG);
            if (res.data.IsSuccess == true) {
                $scope.ClearFields();
            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
        });
    }

    $scope.GetAllDepartment = function () {
        $scope.loadingstatus = 'running';
        showPleaseWait();

        $http({
            method: 'POST',
            url: base_url + "Hospital/Creation/GetAllDepartment",
            dataType: "json"
            //data:JSON.stringify(para)
        }).then(function (res) {

            $scope.loadingstatus = 'stop';
            hidePleaseWait();

            if (res.data.IsSuccess && res.data.Data) {
                $scope.DepartmentList = res.data.Data;
                $scope.gridOptions.api.setRowData($scope.DepartmentList);
            } else
                Swal.fire(res.data.ResponseMSG);

        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    }

    $scope.GetDepartmentById = function (refData) {

        $scope.loadingstatus = "running";
        var para = {
            DepartmentId: refData.DepartmentId
        };
        $http({
            method: 'POST',
            url: base_url + "Hospital/Creation/GetDepartmentById",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $timeout(function () {
                    $scope.newDet = res.data.Data;

                    if (!$scope.newDet.DepartmentDetailsColl || $scope.newDet.DepartmentDetailsColl.length == 0) {
                        $scope.newDet.DepartmentDetailsColl = [];
                        $scope.newDet.DepartmentDetailsColl.push({});
                    }
                    if (!$scope.newDet.DepartmentDoctorRateColl || $scope.newDet.DepartmentDoctorRateColl.length == 0) {
                        $scope.newDet.DepartmentDoctorRateColl = [];
                        $scope.newDet.DepartmentDoctorRateColl.push({});
                    }
                    $scope.newDet.Mode = 'Modify';
                    $('#custom-tabs-four-profile-tab').tab('show');
                });
            } else
                Swal.fire(res.data.ResponseMSG);

        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    }

    $scope.DeleteDepartment = function (refData, ind) {
        Swal.fire({
            title: 'Are you sure to delete selected Lab Category:-' + refData.Name,
            showCancelButton: true,
            confirmButtonText: 'Delete',
        }).then((result) => {
            if (result.isConfirmed) {
                $scope.loadingstatus = "running";
                showPleaseWait();

                var para = {
                    DepartmentId: refData.DepartmentId
                };

                $http({
                    method: 'POST',
                    url: base_url + "Hospital/Creation/DelDepartment",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingstatus = "stop";
                    Swal.fire(res.data.ResponseMSG);
                    if (res.data.IsSuccess) {
                        $scope.GetAllDepartment();
                    }

                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }
        });
    }

    $scope.PartySelectionChange = function (refData) {
        var det = refData.LedgerDetails;
        $scope.newDet.LedgerId = det.LedgerId;
    }

});