app.controller("PetrolPump", function ($scope, $http, $timeout, GlobalServices) {
    $scope.Title = 'Petrol Pump';

    LoadData();



    function LoadData() {
        $('.select2').select2();
        $scope.loadingstatus = "stop";
        $scope.confirmMSG = GlobalServices.getConfirmMSG();

     
        $scope.beData =
        {
            PetrolPumpId: 0,
            CouponNo: '',
            BuyerName: '',
            Address: '',
            SalesMiti_TMP: '',
            ContactNo: '',
            PanVat: '',
            VehicleNo: '',
        };
        $scope.loadingstatus = "stop";

    };

    $scope.ClearFields = function () {
        $scope.loadingstatus = "stop";
        $scope.beData =
        {
            PetrolPumpId: 0,
            CouponNo: '',
            BuyerName: '',
            Address: '',
            SalesMiti_TMP: '',
            ContactNo: '',
            PanVat: '',
            VehicleNo: '',

        };

    }
    $scope.AreaTypeList = [];
    $http({
        method: 'GET',
        url: base_url + "Account/Creation/GetAreaTypes",
        dataType: "json",
    }).then(function (res) {
        if (res.data.IsSuccess && res.data.Data) {
            $scope.AreaTypeList = res.data.Data;
        }
    }, function (reason) {
        Swal.fire('Failed' + reason);
    });


   

    $scope.IsValidPetrolPump = function () {
        if ($scope.beData.BuyerName.isEmpty()) {
            Swal.fire("Please ! Enter Buyer Name");
            return false;
        }
        else
            return true;
    }

    $scope.AddPetrolPump = function () {
        if ($scope.IsValidPetrolPump() == true) {
            if ($scope.confirmMSG.Accept == true) {
                var saveModify = $scope.beData.Mode;
                Swal.fire({
                    title: 'Do you want to' + saveModify + 'the current data?',
                    showCancelButton: true,
                    confirmButtonText: saveModify,
                }).then((result) => {
                    if (result.isConfirmed) {
                        $scope.CallSaveUpdatePetrolPump();
                    }

                });
            }
            else
                $scope.CallSaveUpdatePetrolPump();
        }
    };

    $scope.CallSaveUpdatePetrolPump = function () {
        $scope.loadingstatus = 'running';
        showPleaseWait();

        $http({
            method: 'POST',
            url: base_url + "Account/Creation/SavePetrolPump",
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
                $scope.GetAllPetrolPump();
            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
        });
    }

    $scope.getPetrolPumpById = function (beData) {

        $scope.loadingstatus = "running";

        var para = {
            AreaId: beData.AreaId
        };

        $http({
            method: 'POST',
            url: base_url + "Account/Creation/getPetrolPumpByIdd",
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
            } else
                Swal.fire(res.data.ResponseMSG);


        }, function (reason) {
            alert('Failed' + reason);
        });
    };

   

});