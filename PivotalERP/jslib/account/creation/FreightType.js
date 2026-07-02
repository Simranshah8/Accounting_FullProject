app.controller("ControllFreightType", function ($scope, $http, GlobalServices, $timeout) {
    $scope.Title = 'DebtorType';

    LoadData();


    function LoadData() {
        $scope.loadingstatus = "stop";

        $scope.confirmMSG = GlobalServices.getConfirmMSG();
        $scope.perPageColl = GlobalServices.getPerPageList();

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

        $scope.currentPages = {
            FreightType: 1

        };

        $scope.searchData = {
            FreightType: ''

        };

        $scope.perPage = {
            FreightType: GlobalServices.getPerPageRow(),

        };
        $scope.beData =
        {
            FreightTypeId: 0,
            Name: '',
            Alias: '',
            Code: '',
            IsActive: true,
            ImagePath: '',
            Mode: 'Save',
        };

    };

    $scope.ClearFields = function () {
        $scope.loadingstatus = "stop";
        $scope.beData =
        {
            FreightTypeId: 0,
            Name: '',
            Alias: '',
            Code: '',
            ImagePath: '',
            Mode: 'Save'
        };

        $scope.ClearSliderPhoto();

        $('#txtName').focus();
    }

    $scope.GetAllFreightType = function () {


        $scope.FreightTypeColl = []; //declare an empty array

        if ($scope.loadingstatus != 'stop') {
            alert('Already Running Process')
            return;
        }

        $scope.loadingstatus = 'running';
        showPleaseWait();

        $http({
            method: 'GET',
            url: base_url + "Account/Creation/GetAllFreightType",
            dataType: "json"
            //data:JSON.stringify(para)
        }).then(function (res) {

            $scope.loadingstatus = 'stop';
            hidePleaseWait();

            if (res.data.IsSuccess && res.data.Data) {
                $timeout(function () {
                    $scope.FreightTypeColl = res.data.Data;
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

    $scope.AddNewFreightType = function () {
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
         

        $http({
            method: 'POST',
            url: base_url + "Account/Creation/SaveUpdateFreightType",
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
                $scope.GetAllFreightType();
            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
        });
    }

    $scope.getFreightTypeById = function (beData) {

        $scope.loadingstatus = "running";
        var para = {
            FreightTypeId: beData.FreightTypeId
        };
        $http({
            method: 'POST',
            url: base_url + "Account/Creation/getFreightTypeById",
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

    $scope.deleteFreightType = function (refData, ind) {

        Swal.fire({
            title: 'Are you sure to delete selected DebtorCreditor Type :-' + refData.Name,
            showCancelButton: true,
            confirmButtonText: 'Delete',
        }).then((result) => {
            if (result.isConfirmed) {
                $scope.loadingstatus = "running";
                showPleaseWait();

                var para = {
                    FreightTypeId: refData.FreightTypeId
                };

                $http({
                    method: 'POST',
                    url: base_url + "Account/Creation/DeleteFreightType",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingstatus = "stop";
                    Swal.fire(res.data.ResponseMSG);
                    if (res.data.IsSuccess) {
                        $scope.FreightTypeColl.splice(ind, 1);
                    }

                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }
        });

    }
    


});