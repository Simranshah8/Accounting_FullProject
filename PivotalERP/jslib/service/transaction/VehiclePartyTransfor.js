app.controller("VehiclePartyTransfor", function ($scope, $http, GlobalServices, $timeout) {
    $scope.Title = 'Vehicle Party Transfor';

    LoadData();
    function LoadData() {
        $('.select2').select2();
        $scope.loadingstatus = "stop";
        $scope.confirmMSG = GlobalServices.getConfirmMSG();
        $scope.perPageColl = GlobalServices.getPerPageList();

        $scope.perPage = {
            VehiclePartyTransfor: GlobalServices.getPerPageRow(),
        };

        $scope.currentPages = {
            VehiclePartyTransfor: 1
        };


        $scope.searchData = {
            VehiclePartyTransfor: ''
        };

        $scope.newDet =
        {
            TranId: 0,
            EntryDate: new Date(),
            EngineNo: '',
            ChassisNo: '',
            FromParty: '',
            FromAddress: '',
            FromCitizenshipNo:'',
            FromMobileNo: '',
            FromEmailId: '',
            FromDriverMobNo: '',
            FromCustomerType: '',
            FromWarrenty: false,
            FromAMC: false,
            FromCustomerId: '',
            ToParty: '',
            ToAddress: '',
            ToCitizenshipNo: '',
            ToMobileNo: '',
            ToEmailId: '',
            ToDriverMobileNo: '',
            ToCustomerType: '',
            ToWarrenty: false,
            ToAMC: false,
            ToCustomerId: '',
            FromRegdNO: '',
            ToRegdNO:''
        };
    };
    $scope.ClearFields = function () {
        $scope.loadingstatus = "stop";
        $scope.newDet =
        {
            TranId: 0,
            EntryDate: new Date(),
            EngineNo: '',
            ChassisNo: '',
            FromParty: '',
            FromAddress: '',
            FromCitizenshipNo: '',
            FromMobileNo: '',
            FromEmailId: '',
            FromDriverMobNo: '',
            FromCustomerType: '',
            FromWarrenty: false,
            FromAMC: false,
            FromCustomerId: '',
            ToParty: '',
            ToAddress: '',
            ToCitizenshipNo: '',
            ToMobileNo: '',
            ToEmailId: '',
            ToDriverMobileNo: '',
            ToCustomerType: '',
            ToWarrenty: false,
            ToAMC: false,
            ToCustomerId: '',
            FromRegdNO: '',
            ToRegdNO: ''
        };

    }
     
     

    $scope.IsValidVehiclePartyTransfor = function () {
        if ($scope.newDet.EngineNo.isEmpty()) {
            Swal.fire("Please ! Enter From Engine No");
            return false;
        }
        else
            return true;
    }

    $scope.SaveUpdateVehiclePartyTransfor = function () {
        if ($scope.IsValidVehiclePartyTransfor() == true) {
            if ($scope.confirmMSG.Accept == true) {
                var saveModify = $scope.newDet.Mode;
                Swal.fire({
                    title: 'Do you want to ' + saveModify + ' the current data?',
                    showCancelButton: true,
                    confirmButtonText: saveModify,
                }).then((result) => {
                    /* Read more about isConfirmed, isDenied below */
                    if (result.isConfirmed) {
                        $scope.CallSaveUpdateVehiclePartyTransfor();
                    }
                });
            } else
                $scope.CallSaveUpdateVehiclePartyTransfor();
        }
    };

    $scope.CallSaveUpdateVehiclePartyTransfor = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();
        $http({
            method: 'POST',
            url: base_url + "Setup/JobCard/SaveVehiclePartyTransfor",
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
                $scope.ClearVehiclePartyTransfor();
               /* $scope.GetAllVehiclePartyTransfor();*/
            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
        });
    }
});