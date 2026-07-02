app.controller('HeadOfDepartmentController', function ($scope, $http, $timeout, $filter, GlobalServices) {
    $scope.Title = 'HeadOfDepartment';

    LoadData();

    function LoadData() {
        $('.select2').select2();
        $scope.confirmMSG = GlobalServices.getConfirmMSG();
        $scope.perPageColl = GlobalServices.getPerPageList();
        $scope.EmployeeSearchOptions = GlobalServices.getEmployeeSearchOptions();

        $scope.currentPages = {
            HeadOfDepartment: 1,
        };

        $scope.searchData = {
            HeadOfDepartment: '',

        };

        $scope.perPage = {
            HeadOfDepartment: GlobalServices.getPerPageRow()
        };

        // for Company
        $scope.CompanyList = [];
        $http({
            method: 'GET',
            url: base_url + "HR/Master/GetAllCompanyList",
            dataType: "json"
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.CompanyList = res.data.Data;
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        $scope.CompanyRelationshipList = [];
        $http({
            method: 'POST',
            url: base_url + "HR/Master/GetAllCompanyRelationship",
            dataType: "json"
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.CompanyRelationshipList = res.data.Data;
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        $scope.BranchList = [];
        $http({
            method: 'GET',
            url: base_url + "Setup/Security/GetAllBranchList",
            dataType: "json"
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.BranchList = res.data.Data;

            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        //for department
        $scope.DepartmentList = [];
        $http({
            method: 'GET',
            url: base_url + "HR/Master/GetAllDepartment",
            dataType: "json"
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.DepartmentList = res.data.Data;
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
        //ServiceType

        $scope.ServiceTypeList = [];
        $http({
            method: 'GET',
            url: base_url + "HR/Master/GetAllServiceType",
            dataType: "json"
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.ServiceTypeList = res.data.Data;
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });


        $scope.EmployeeList = [];
        $http({
            method: 'GET',
            url: base_url + "HR/Master/GetAllEmployee",
            dataType: "json"
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.EmployeeList = res.data.Data;
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });


        $scope.newDet = {
            TranId: null,
            CompanyId: null,
            BranchId: null,
            DepartmentId: null,
            ServiceTypeId: null,
            EmployeeId: null,
            CoEmployeeId: null,
            StartDate_TMP: new Date(),
            Note: '',
            SelectEmployee: $scope.EmployeeSearchOptions[0].value,
            SelectCoEmployee: $scope.EmployeeSearchOptions[0].value,
            Mode: 'Save'
        };
        //$scope.GetAllHeadOfDepartment();

    };

    $scope.ClearHeadOfDepartment = function () {
        $scope.newDet = {
            TranId: null,
            CompanyId: null,
            BranchId: null,
            DepartmentId: null,
            ServiceTypeId: null,
            EmployeeId: null,
            CoEmployeeId: null,
            StartDate_TMP: new Date(),
            Note: '',
            SelectEmployee: $scope.EmployeeSearchOptions[0].value,
            SelectCoEmployee: $scope.EmployeeSearchOptions[0].value,
            Mode: 'Save'
        };
    }

    $scope.getEmployeeId = function (beData, pr) {
        var empDetails = beData.EmployeeDetails;
        if (pr == 1) {
            $scope.newDet.EmployeeId = empDetails.EmployeeId;
        } else {
            $scope.newDet.CoEmployeeId = empDetails.EmployeeId;
        }
    }


    //************************* HeadOfDepartment *********************************
    $scope.IsValidHeadOfDepartment = function () {
        /*if ($scope.newBaliType.GenderName.isEmpty()) {
            Swal.fire('Please ! Enter GenderName Name');
            return false;
        }*/
        return true;
    }

    $scope.SaveHeadOfDepartment = function () {
        if ($scope.IsValidHeadOfDepartment() == true) {
            if ($scope.confirmMSG.Accept == true) {
                var saveModify = $scope.newDet.Mode;
                Swal.fire({
                    title: 'Do you want to ' + saveModify + ' the current data?',
                    showCancelButton: true,
                    confirmButtonText: saveModify,
                }).then((result) => {
                    /* Read more about isConfirmed, isDenied below */
                    if (result.isConfirmed) {
                        $scope.CallSaveUpdateHeadOfDepartment();
                    }
                });
            } else
                $scope.CallSaveUpdateHeadOfDepartment();
        }
    };

    $scope.CallSaveUpdateHeadOfDepartment = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();

        if ($scope.newDet.StartDateDet) {
            $scope.newDet.StartDate = $filter('date')(new Date($scope.newDet.StartDateDet.dateAD), 'yyyy-MM-dd');
        } else
            $scope.newDet.StartDate = null;

        if ($scope.newDet.CompanyRelationshipIdColl)
            $scope.newDet.CompanyRelationshipIds = $scope.newDet.CompanyRelationshipIdColl.toString();
        else
            $scope.newDet.CompanyRelationshipIds = '';

        if ($scope.newDet.BranchColl)
            $scope.newDet.BranchIds = $scope.newDet.BranchColl.toString();
        else
            $scope.newDet.BranchIds = '';

        $http({
            method: 'POST',
            url: base_url + "HR/Master/SaveHeadOfDepartment",
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
                $scope.ClearHeadOfDepartment();
                $scope.GetAllHeadOfDepartment();
            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
        });
    }



    $scope.GetAllHeadOfDepartment = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();
        $scope.HeadOfDepartmentList = [];
        $http({
            method: 'GET',
            url: base_url + "HR/Master/GetAllHeadOfDepartment",
            dataType: "json"
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.HeadOfDepartmentList = res.data.Data;
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    }

    $scope.getHeadOfDepartmentById = function (refData) {
        $scope.loadingstatus = "running";
        showPleaseWait();
        var para = {
            TranId: refData.TranId
        };
        $http({
            method: 'POST',
            url: base_url + "HR/Master/GetHeadOfDepartmentById",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.newDet = res.data.Data;
                $scope.newDet.Mode = 'Modify';
                $scope.newDet.SelectEmployee = $scope.EmployeeSearchOptions[0].value;
                $scope.newDet.SelectCoEmployee = $scope.EmployeeSearchOptions[0].value;
                if ($scope.newDet.StartDate)
                    $scope.newDet.StartDate_TMP = new Date($scope.newDet.StartDate);

                $scope.newDet.CompanyRelationshipIdColl = $scope.newDet.CompanyRelationshipIds
                $scope.newDet.BranchColl = $scope.newDet.BranchIds

                $('#custom-tabs-four-profile-tab').tab('show');


            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    };



    $scope.DelHeadOfDepartmentById = function (refData, ind) {
        Swal.fire({
            title: 'Do you want to delete ' + refData.Name + '?',
            showCancelButton: true,
            confirmButtonText: 'Delete',
            //message: 'Are you sure to delete selected BaliType :-' + beData.Name,
        }).then((result) => {
            if (result.isConfirmed) {
                var para = {
                    TranId: refData.TranId
                };
                $http({
                    method: 'POST',
                    url: base_url + "HR/Master/DeleteHeadOfDepartment",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingStatus = "stop";

                    Swal.fire(res.data.ResponseMSG);
                    if (res.data.IsSuccess == true) {
                        $scope.GetAllHeadOfDepartment();
                    }
                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }

        });
    }





});