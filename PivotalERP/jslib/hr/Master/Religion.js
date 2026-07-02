app.controller('MasterController', function ($scope, $http, $timeout, $filter, GlobalServices) {
    $scope.Title = 'Religion';

    LoadData();

    function LoadData() {
        $('.select2').select2();
        $scope.confirmMSG = GlobalServices.getConfirmMSG();
        $scope.perPageColl = GlobalServices.getPerPageList();
        $scope.currentPages = {
            Religion: 1,
        };

        $scope.searchData = {
            Religion: '',

        };

        $scope.perPage = {
            Religion: GlobalServices.getPerPageRow()
        };


        $scope.newDet = {
           ReligionId: null,
            Name: '',
            OrderNo: 0,
            Mode: 'Save'
        };

        //$scope.GetAllReligion();

    };

    $scope.ClearReligion = function () {
        $scope.newDet = {
            ReligionId: null,
            Name: '',
            OrderNo: 0,
            Mode: 'Save'
        };
    }
    //************************* Religionl *********************************
    $scope.IsValidReligion = function () {
        /*if ($scope.newBaliType.GenderName.isEmpty()) {
            Swal.fire('Please ! Enter GenderName Name');
            return false;
        }*/
        return true;
    }

    $scope.SaveReligion = function () {
        if ($scope.IsValidReligion() == true) {
            if ($scope.confirmMSG.Accept == true) {
                var saveModify = $scope.newDet.Mode;
                Swal.fire({
                    title: 'Do you want to ' + saveModify + ' the current data?',
                    showCancelButton: true,
                    confirmButtonText: saveModify,
                }).then((result) => {
                    /* Read more about isConfirmed, isDenied below */
                    if (result.isConfirmed) {
                        $scope.CallSaveUpdateReligion();
                    }
                });
            } else
                $scope.CallSaveUpdateReligion();
        }
    };

    $scope.CallSaveUpdateReligion = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();
        $http({
            method: 'POST',
            url: base_url + "HR/Master/SaveReligion",
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
                $scope.ClearReligion();
                $scope.GetAllReligion();
            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
        });
    }



    $scope.GetAllReligion = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();
        $scope.ReligionList = [];
        $http({
            method: 'GET',
            url: base_url + "HR/Master/GetAllReligion",
            dataType: "json"
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.ReligionList = res.data.Data;
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    }

    $scope.getReligionById = function (refData) {
        $scope.loadingstatus = "running";
        showPleaseWait();
        var para = {
            ReligionId: refData.ReligionId
        };
        $http({
            method: 'POST',
            url: base_url + "HR/Master/GetReligionById",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.newDet = res.data.Data;
                $scope.newDet.Mode = 'Modify';
                $('#custom-tabs-four-profile-tab').tab('show');


            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    };



    $scope.DelReligionById = function (refData, ind) {
        Swal.fire({
            title: 'Do you want to delete ' + refData.Name + '?',
            showCancelButton: true,
            confirmButtonText: 'Delete',
            //message: 'Are you sure to delete selected BaliType :-' + beData.Name,
        }).then((result) => {
            if (result.isConfirmed) {
                var para = {
                    ReligionId: refData.ReligionId
                };
                $http({
                    method: 'POST',
                    url: base_url + "HR/Master/DelReligion",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingStatus = "stop";

                    Swal.fire(res.data.ResponseMSG);
                    if (res.data.IsSuccess == true) {
                        $scope.GetAllReligion();
                    }
                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }

        });
    }





});




