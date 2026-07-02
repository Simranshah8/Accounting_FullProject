app.controller("ControllVehicleModel", function ($scope, $http, GlobalServices, $timeout) {
    $scope.Title = 'DebtorType';

    LoadData();


    function LoadData() {
        $scope.loadingstatus = "stop";
        $('.select2').select2();

        $scope.confirmMSG = GlobalServices.getConfirmMSG();
        $scope.perPageColl = GlobalServices.getPerPageList();
         
        $scope.currentPages = {
            VehicleModel: 1

        };

        $scope.searchData = {
            VehicleModel: ''

        };

        $scope.perPage = {
            VehicleModel: GlobalServices.getPerPageRow(),

        };
        $scope.beData =
        {
            VehicleModelId: 0,
            Name: '',
            Alias: '',
            Code: '',
            IsActive: true,
            ImagePath: '',
            Mode: 'Save',
        };

        $scope.VehicleTypeColl = [];
        $scope.loadingstatus = 'running';
        showPleaseWait();

        $http({
            method: 'GET',
            url: base_url + "Service/Creation/GetAllVehicleType",
            dataType: "json"
            //data:JSON.stringify(para)
        }).then(function (res) {

            $scope.loadingstatus = 'stop';
            hidePleaseWait();

            if (res.data.IsSuccess && res.data.Data) {
                $scope.VehicleTypeColl = res.data.Data;
            } else
                alert(res.data.ResponseMSG);

        }, function (reason) {
            alert('Failed' + reason);
        });

    };

    $scope.ClearFields = function () {
        $scope.loadingstatus = "stop";
        $scope.beData =
        {
            VehicleModelId: 0,
            Name: '',
            Alias: '',
            Code: '',
            ImagePath: '',
            Mode: 'Save'
        };

        $scope.ClearSliderPhoto();

        $('#txtName').focus();
    }

    $scope.GetAllVehicleModel = function () {


        $scope.VehicleModelColl = []; //declare an empty array

        //if ($scope.loadingstatus != 'stop') {
        //    alert('Already Running Process')
        //    return;
        //}

        $scope.loadingstatus = 'running';
        showPleaseWait();

        $http({
            method: 'GET',
            url: base_url + "Service/Creation/GetAllVehicleModel",
            dataType: "json"
            //data:JSON.stringify(para)
        }).then(function (res) {

            $scope.loadingstatus = 'stop';
            hidePleaseWait();

            if (res.data.IsSuccess && res.data.Data) {
                $timeout(function () {
                    $scope.VehicleModelColl = res.data.Data;
                });
            } else
                alert(res.data.ResponseMSG);

        }, function (reason) {
            alert('Failed' + reason);
        });

    }
    $scope.ClearSliderPhoto = function () {
        $timeout(function () {
            $scope.$apply(function () {
                $scope.beData.PhotoData = null;
                $scope.beData.Photo_TMP = [];
                $scope.beData.ImagePath = '';
            });
        });
        $('input[type=file]').val('');
        $('#imgPhoto1').attr('src', '');

    };

    $scope.IsValidDebtorCreditorType = function () {
        if ($scope.beData.Name.isEmpty()) {
            Swal.fire("Please ! Enter Valid Debtor Creditor Name");
            return false;
        }
        else
            return true;
    }

    $scope.AddNewVehicleModel = function () {
        if ($scope.IsValidDebtorCreditorType() == true) {
            if ($scope.confirmMSG.Accept == true) {
                var saveModify = $scope.beData.Mode;
                Swal.fire({
                    title: 'Do you want to' + saveModify + 'the current data?',
                    showCancelButton: true,
                    confirmButtonText: saveModify,
                }).then((result) => {
                    if (result.isConfirmed) {
                        $scope.CallSaveUpdateDebtorCreditorsType();
                    }

                });
            }
            else
                $scope.CallSaveUpdateDebtorCreditorsType();
        }
    };

    $scope.CallSaveUpdateDebtorCreditorsType = function () {
        $scope.loadingstatus = 'running';
        showPleaseWait();

        if (!$scope.beData.ProductId)
            $scope.beData.ProductId = 0;

        $http({
            method: 'POST',
            url: base_url + "Service/Creation/SaveUpdateVehicleModel",
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
                $scope.GetAllVehicleModel();
            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
        });
    }

    $scope.getVehicleModelById = function (beData) {

        $scope.loadingstatus = "running";
        var para = {
            VehicleModelId: beData.VehicleModelId
        };
        $http({
            method: 'POST',
            url: base_url + "Service/Creation/getVehicleModelById",
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
    }

    $scope.deleteVehicleModel = function (refData, ind) {

        Swal.fire({
            title: 'Are you sure to delete selected DebtorCreditor Type :-' + refData.Name,
            showCancelButton: true,
            confirmButtonText: 'Delete',
        }).then((result) => {
            if (result.isConfirmed) {
                $scope.loadingstatus = "running";
                showPleaseWait();

                var para = {
                    VehicleModelId: refData.VehicleModelId
                };

                $http({
                    method: 'POST',
                    url: base_url + "Service/Creation/DeleteVehicleModel",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingstatus = "stop";
                    Swal.fire(res.data.ResponseMSG);
                    if (res.data.IsSuccess) {
                        $scope.VehicleModelColl.splice(ind, 1);
                    }

                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }
        });

    }
    


});