app.controller("Circle", function ($scope, $http, $timeout, $filter, $compile, GlobalServices, $document) {
    $scope.Title = 'Circle';

    $scope.LoadData = function () {
        $('.select2').select2();
     /*   var glSrv = GlobalServices;*/
        $scope.perPageColl = GlobalServices.getPerPageList();

        $scope.currentPages = {
            Circle: 1,
        };

        $scope.searchData = {
            Circle: '',
        };

        $scope.perPage = {
            Circle: GlobalServices.getPerPageRow(),
        };
        $scope.confirmMSG = GlobalServices.getConfirmMSG();

        $scope.beData = {
            CircleName: '',
            Description: '',
            Mode: "Save"
        }
        $scope.GetAllCircle();
    }

    $scope.ClearFields = function () {
        $scope.beData = {
            CircleName: '',
            Description: '',
            Mode: "Save"
        }
    }

    $scope.IsValidCircle = function () {
        if ($scope.beData.CircleName.isEmpty()) {
            Swal.fire('Please ! Enter Circle Name');
            return false;
        }
        return true;
    };


    $scope.SaveUpdateCircle = function () {
        if ($scope.IsValidCircle() == true) {
            if ($scope.confirmMSG.Accept == true) {
                var saveModify = $scope.beData.Mode;
                Swal.fire({
                    title: 'Do you want to ' + saveModify + ' the current data?',
                    showCancelButton: true,
                    confirmButtonText: saveModify,
                }).then((result) => {
                    if (result.isConfirmed) {
                        $scope.CallSaveUpdateCircle();
                    }
                });
            } else
                $scope.CallSaveUpdateCircle();

        }
    };

    $scope.CallSaveUpdateCircle = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();
   
        $http({
            method: 'POST',
            url: base_url + "Account/Creation/SaveCircle",
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
                $scope.GetAllCircle();
                $scope.ClearFields();
            }


        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";

        });
    }




    $scope.GetCircleById = function (refData) {
        $scope.loadingstatus = "running";
        showPleaseWait();
        var para = {
            CircleID: refData.CircleID
        };
        $http({
            method: 'POST',
            url: base_url + "Account/Creation/GetCircleById",
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

    $scope.GetAllCircle = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();
        $http({
            method: 'POST',
            url: base_url + "Account/Creation/GetAllCircle",
            dataType: "json",
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.CircleList = res.data.Data;
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            Swal.fire('Failed: ' + reason);
        });
    }


    $scope.DelCircle = function (refData, ind) {
        Swal.fire({
            title: 'Are you sure you want to delete ' + refData.CircleName + '?',
            showCancelButton: true,
            confirmButtonText: 'Delete',
        }).then((result) => {
            if (result.isConfirmed) {
                var para = { CircleID: refData.CircleID };
                $http({
                    method: 'POST',
                    url: base_url + "Account/Creation/DeleteCircle",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingStatus = "stop";
                    Swal.fire(res.data.ResponseMSG);
                    if (res.data.IsSuccess == true) {
                        $scope.GetAllCircle();
                    }
                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }
        });
    }



})