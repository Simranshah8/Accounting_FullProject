

"use strict";

agGrid.initialiseAgGridWithAngular1(angular);
 
app.controller("ServiceAppointmentCtrl", function ($scope, $http, $filter, GlobalServices) {
    $scope.Title = 'Area';

    LoadData();

    function LoadData() {
         
        $('.select2').select2({
            allowClear: true,
            openOnEnter: true,
            placeholder: '**select**'
        });

        $scope.confirmMSG = GlobalServices.getConfirmMSG();
        $scope.perPageColl = GlobalServices.getPerPageList();
        $scope.currentPages = {
            Appointment: 1
        };

        $scope.searchData = {
            Appointment: ''
        };

        $scope.perPage = {
            Appointment: GlobalServices.getPerPageRow(),
        };

        $scope.BranchList = [];
        $http({
            method: 'GET',
            url: base_url + "Setup/Security/GetAllBranchList",
            dataType: "json"
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.BranchList = res.data.Data;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        $scope.AppointTypeList = [];
        $http({
            method: 'GET',
            url: base_url + "Service/Creation/GetAppointType",
            dataType: "json"
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.AppointTypeList = res.data.Data;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        $scope.VehicleList = [];
        $http({
            method: 'GET',
            url: base_url + "Service/Creation/GetVehicleForAppointment",
            dataType: "json"
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.VehicleList = res.data.Data;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
       
    }

    $scope.ChooseVehicle = function (refData) {
        $scope.beData = {};
        $scope.beData = {
            TranId: 0,
            LedgerId:null,
            OtherLedger: refData.Party,
            Address: refData.Address,
            MobileNo: refData.MobileNo,
            RegdNo: refData.RegdNo,
            EngineNo: refData.EngineNo,
            ChassisNo: refData.ChSrlNo,
            VehicleEntryId: refData.VehicleEntryId,
            JobCardId: refData.JobCardId,
            JobCardNo: refData.JobCardNo,
            DateOfSale: refData.SalesDate,
            VinNo: refData.VinNo,
            Model: refData.Model
             
        };
        $('#searVoucherRightBtn').modal('hide');
    }
    $scope.SearchData = function () {
        $('#searVoucherRightBtn').modal('show');
    }

    $scope.ClearFields = function () {
        $scope.beData = {};
    }
    $scope.IsValidAppointment = function () {
        if (!$scope.beData.BranchId || $scope.beData.BranchId<1) {
            Swal.fire("Please ! Enter Valid Branch Name");
            return false;
        }

        if (!$scope.beData.VehicleEntryId || $scope.beData.VehicleEntryId<0) {
            Swal.fire("Please ! Select Valid Vehicle Name");
            return false;
        }

        if (!$scope.beData.AppointmentDateDet) {
            Swal.fire("Please ! Enter Appointment Date");
            return false;
        }

        return true;
    }

    $scope.AddServiceAppointment = function () {
        if ($scope.IsValidAppointment() == true) {
            if ($scope.confirmMSG.Accept == true) {
                var saveModify = $scope.beData.Mode;
                Swal.fire({
                    title: 'Do you want to' + saveModify + 'the current data?',
                    showCancelButton: true,
                    confirmButtonText: saveModify,
                }).then((result) => {
                    if (result.isConfirmed) {
                        $scope.CallSaveUpdateServiceAppointment();
                    }

                });
            }
            else
                $scope.CallSaveUpdateServiceAppointment();
        }
    };

    $scope.CallSaveUpdateServiceAppointment = function () {
        $scope.loadingstatus = 'running';
        showPleaseWait();
         
        if ($scope.beData.AppointmentDateDet) {
            $scope.beData.AppointmentDate = $filter('date')(new Date($scope.beData.AppointmentDateDet.dateAD), 'yyyy-MM-dd');
        }

        if ($scope.beData.AppointmentDateTime_TMP) {
            $scope.beData.AppointmentDateTime = $scope.beData.AppointmentDateTime_TMP.toLocaleString();
        }

        $http({
            method: 'POST',
            url: base_url + "Service/Creation/SaveAppointment",
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
            }   
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
        });
    }
     
});