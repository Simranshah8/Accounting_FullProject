app.controller('LevelController', function ($scope, $http, $timeout, $filter, GlobalServices) {
    $scope.Title = 'Level';

    LoadData();

    function LoadData() {
        $('.select2').select2();
        $scope.confirmMSG = GlobalServices.getConfirmMSG();
        $scope.perPageColl = GlobalServices.getPerPageList();
        $scope.currentPages = {
            Level: 1,
        };

        $scope.searchData = {
            Level: '',

        };

        $scope.perPage = {
            Level: GlobalServices.getPerPageRow()
        };


        $scope.newDet = {
            LevelId: null,
            Name: '',
            OrderNum: null,
            Code: '',
            Description: '',
            Mode: 'Save'
        };

        //$scope.GetAllLevel();

    };

    $scope.ClearLevel = function () {
        $scope.newDet = {
            LevelId: null,
            Name: '',
            OrderNum: '',
            Code: '',
            Description: '',
            Mode: 'Save'
        };
    }




    //************************* Level *********************************
    $scope.IsValidLevel = function () {
        /*if ($scope.newBaliType.GenderName.isEmpty()) {
            Swal.fire('Please ! Enter GenderName Name');
            return false;
        }*/
        return true;
    }

    $scope.SaveLevel = function () {
        if ($scope.IsValidLevel() == true) {
            if ($scope.confirmMSG.Accept == true) {
                var saveModify = $scope.newDet.Mode;
                Swal.fire({
                    title: 'Do you want to ' + saveModify + ' the current data?',
                    showCancelButton: true,
                    confirmButtonText: saveModify,
                }).then((result) => {
                    /* Read more about isConfirmed, isDenied below */
                    if (result.isConfirmed) {
                        $scope.CallSaveUpdateLevel();
                    }
                });
            } else
                $scope.CallSaveUpdateLevel();
        }
    };

    $scope.CallSaveUpdateLevel = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();
        $http({
            method: 'POST',
            url: base_url + "Payroll/Master/SaveLevel",
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
                $scope.ClearLevel();
                $scope.GetAllLevel();
            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
        });
    }



    $scope.GetAllLevel = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();
        $scope.LevelList = [];
        $http({
            method: 'GET',
            url: base_url + "Payroll/Master/GetAllLevel",
            dataType: "json"
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.LevelList = res.data.Data;
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    }

    $scope.getLevelById = function (refData) {
        $scope.loadingstatus = "running";
        showPleaseWait();
        var para = {
            LevelId: refData.LevelId
        };
        $http({
            method: 'POST',
            url: base_url + "Payroll/Master/getLevelById",
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



    $scope.DelLevelById = function (refData, ind) {
        Swal.fire({
            title: 'Do you want to delete ' + refData.Name + '?',
            showCancelButton: true,
            confirmButtonText: 'Delete',
            //message: 'Are you sure to delete selected BaliType :-' + beData.Name,
        }).then((result) => {
            if (result.isConfirmed) {
                var para = {
                    LevelId: refData.LevelId
                };
                $http({
                    method: 'POST',
                    url: base_url + "Payroll/Master/DeleteLevel",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingStatus = "stop";

                    Swal.fire(res.data.ResponseMSG);
                    if (res.data.IsSuccess == true) {
                        $scope.GetAllLevel();
                    }
                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }

        });
    }





});