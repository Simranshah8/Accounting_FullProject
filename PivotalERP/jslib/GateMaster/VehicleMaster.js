app.controller('VehicleController', function ($scope, $http, $timeout, $filter, GlobalServices) {
    $scope.Title = 'Vehicle Master';

    LoadData();

    function LoadData() {
        $('.select2').select2({
            allowClear: true,
            openOnEnter: true,
            placeholder: 'Select data'
        });
        $scope.confirmMSG = GlobalServices.getConfirmMSG();
        $scope.perPageColl = GlobalServices.getPerPageList();
        $scope.EmployeeSearchOptions = GlobalServices.getEmployeeSearchOptions();

        $scope.currentPages = {
            Vehicle: 1,
        };

        $scope.searchData = {
            Vehicle: '',

        };

        $scope.perPage = {
            Vehicle: GlobalServices.getPerPageRow()
        };


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

        $scope.VehicleTypeColl = [
            { id: 1, text:'TRUCK'},
            { id: 2, text:'CONTAINER'},
            { id: 3, text:'BIKE'},
            { id: 4, text:'CAR'},
            { id: 5, text:'TEMPO'},
            { id: 6, text:'Other'}
        ]

        $scope.beData = {
            TranId: null,
            BranchId: null,
            VehicleType: '',
            TransporterName: '',
            RFIDTag: '',
            InsuranceNo: '',
            PollutionNo: '',
            EngineNo: '',
            VinNo: '',
            RegNo: '',
            IsBlackListed: false,
            IsActive: true,
            Mode: 'Save'
        };
        //$scope.GetAllVehicle();

    };

    $scope.ClearFields = function () {
        $scope.beData = {
            TranId: null,
            BranchId: null,
            VehicleType: '',
            TransporterName: '',
            RFIDTag: '',
            InsuranceNo: '',
            PollutionNo: '',
            EngineNo: '',
            VinNo: '',
            RegNo: '',
            IsBlackListed: false,
            IsActive: true,
            Mode: 'Save'
        };
    }

   
    //************************* Vehicle *********************************
    $scope.IsValidVehicle = function () {
        if (!$scope.beData.BranchId) {
            Swal.fire('Please ! Select Branch');
            return false;
        }
        if ($scope.beData.VehicleType.isEmpty()) {
            Swal.fire('Please ! Enter Vehicle Type Name');
            return false;
        }
        if ($scope.beData.RegNo.isEmpty()) {
            Swal.fire('Please ! Enter Registration No.');
            return false;
        }
        return true;
    }

    $scope.SaveUpdateVehicle = function () {
        if ($scope.IsValidVehicle() == true) {
            if ($scope.confirmMSG.Accept == true) {
                var saveModify = $scope.beData.Mode;
                Swal.fire({
                    title: 'Do you want to ' + saveModify + ' the current data?',
                    showCancelButton: true,
                    confirmButtonText: saveModify,
                }).then((result) => {
                    /* Read more about isConfirmed, isDenied below */
                    if (result.isConfirmed) {
                        $scope.CallSaveUpdateVehicle();
                    }
                });
            } else
                $scope.CallSaveUpdateVehicle();
        }
    };

    $scope.CallSaveUpdateVehicle = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();
        $http({
            method: 'POST',
            url: base_url + "GateMaster/Creation/SaveVehicle",
            headers: { 'Content-Type': undefined },
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
                $scope.GetAllVehicle();
            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
        });
    }



    $scope.GetAllVehicle = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();
        $scope.VehicleList = [];
        $http({
            method: 'POST',
            url: base_url + "GateMaster/Creation/GetAllVehicle",
            dataType: "json"
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.VehicleList = res.data.Data;
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    }

    $scope.GetVehicleById = function (refData) {
        $scope.loadingstatus = "running";
        showPleaseWait();
        var para = {
            VehicleId: refData.VehicleId
        };
        $http({
            method: 'POST',
            url: base_url + "GateMaster/Creation/GetVehicleById",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.beData = res.data.Data;
                $scope.beData.Mode = 'Modify';
               
                $('#custom-tabs-four-profile-tab').tab('show');


            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    };



    $scope.DelVehicleById = function (refData, ind) {
        Swal.fire({
            title: 'Do you want to delete ' + refData.VehicleType + '?',
            showCancelButton: true,
            confirmButtonText: 'Delete',
        }).then((result) => {
            if (result.isConfirmed) {
                var para = {
                    VehicleId: refData.VehicleId
                };
                $http({
                    method: 'POST',
                    url: base_url + "GateMaster/Creation/DelVehicle",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingStatus = "stop";

                    Swal.fire(res.data.ResponseMSG);
                    if (res.data.IsSuccess == true) {
                        $scope.GetAllVehicle();
                    }
                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }

        });
    }


});