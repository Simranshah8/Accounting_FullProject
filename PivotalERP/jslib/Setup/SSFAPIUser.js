app.controller('SSFAPIUserController', function ($scope, $http, $timeout, $filter, GlobalServices) {
    $scope.Title = 'SSFAPIUser';

    LoadData();

    function LoadData() {
        $('.select2').select2();
        $scope.confirmMSG = GlobalServices.getConfirmMSG();
        $scope.perPageColl = GlobalServices.getPerPageList();

        $scope.newDet = {
            BaseUrl: '',
            UserName: '',
            Pwd: '',
            RePwd: '',
            RemoteUser: '',
            Practitioner: '',
            PractitionerRole: '',
            ServiceProvider: '',
            Mode: 'Save'
        };

        //$scope.GetAllSSFAPIUser();

    };

    $scope.ClearSSFAPIUser = function () {
        $scope.newDet = {
            BaseUrl: '',
            UserName: '',
            Pwd: '',
            RePwd: '',
            RemoteUser: '',
            Practitioner: '',
            PractitionerRole: '',
            ServiceProvider: '',
            Mode: 'Save'
        };
    }




    //************************* SSFAPIUser *********************************
    $scope.IsValidSSFAPIUser = function () {
        if ($scope.newDet.Pwd !== $scope.newDet.RePwd) {
            Swal.fire('Passwords do not match.');
            return false;
        }
        return true;
    };

    $scope.SaveSSFAPIUser = function () {
        if ($scope.IsValidSSFAPIUser() == true) {
            if ($scope.confirmMSG.Accept == true) {
                var saveModify = $scope.newDet.Mode;
                Swal.fire({
                    title: 'Do you want to ' + saveModify + ' the current data?',
                    showCancelButton: true,
                    confirmButtonText: saveModify,
                }).then((result) => {
                    /* Read more about isConfirmed, isDenied below */
                    if (result.isConfirmed) {
                        $scope.CallSaveUpdateSSFAPIUser();
                    }
                });
            } else
                $scope.CallSaveUpdateSSFAPIUser();
        }
    };

    $scope.CallSaveUpdateSSFAPIUser = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();
        $http({
            method: 'POST',
            url: base_url + "SetUp/Security/SaveSSFAPIUser",
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
                $scope.GetAllSSFAPIUser();
            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
        });
    }



    $scope.getSSFAPIUserById = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();
        $http({
            method: 'POST',
            url: base_url + "Setup/Security/GetSSFAPIUser",
            dataType: "json"
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.newDet = res.data.Data;
                $scope.newDet.RePwd = $scope.newDet.Pwd;
                $scope.newDet.Mode = 'Modify';

            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    };







});