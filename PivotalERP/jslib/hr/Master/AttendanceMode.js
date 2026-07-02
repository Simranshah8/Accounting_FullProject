app.controller('AttendanceModeController', function ($scope, $http, $timeout, $filter, GlobalServices) {
    $scope.Title = 'AttendanceMode';

    LoadData();

    function LoadData() {
        $('.select2').select2();
        $scope.confirmMSG = GlobalServices.getConfirmMSG();
        $scope.perPageColl = GlobalServices.getPerPageList();
        $scope.currentPages = {
            AttendanceMode: 1,
        };

        $scope.searchData = {
            AttendanceMode: '',

        };

        $scope.perPage = {
            AttendanceMode: GlobalServices.getPerPageRow()
        };


        $scope.newDet = {
            AttendanceModeId: null,
            Name: '',
            NameNP: '',
            SNO: null,
            PerDay: null,
            Duration: null,
            Mode: 'Save'
        };

        //$scope.GetAllAttendanceMode();

    };

    $scope.ClearAttendanceMode = function () {
        $scope.newDet = {
            AttendanceModeId: null,
            Name: '',
            NameNP: '',
            SNO: null,
            PerDay: null,
            Duration: null,
            Mode: 'Save'
        };

    }




    //************************* Department *********************************
    $scope.IsValidAttendanceMode = function () {
        /*if ($scope.newBaliType.GenderName.isEmpty()) {
            Swal.fire('Please ! Enter GenderName Name');
            return false;
        }*/
        return true;
    }

    $scope.SaveAttendanceMode = function () {
        if ($scope.IsValidAttendanceMode() == true) {
            if ($scope.confirmMSG.Accept == true) {
                var saveModify = $scope.newDet.Mode;
                Swal.fire({
                    title: 'Do you want to ' + saveModify + ' the current data?',
                    showCancelButton: true,
                    confirmButtonText: saveModify,
                }).then((result) => {
                    /* Read more about isConfirmed, isDenied below */
                    if (result.isConfirmed) {
                        $scope.CallSaveUpdateAttendanceMode();
                    }
                });
            } else
                $scope.CallSaveUpdateAttendanceMode();
        }
    };

    $scope.CallSaveUpdateAttendanceMode = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();
        $http({
            method: 'POST',
            url: base_url + "HR/Master/SaveUpdateAttendanceMode",
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
                $scope.ClearAttendanceMode();
                $scope.GetAllAttendanceMode();
            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
        });
    }



    $scope.GetAllAttendanceMode = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();
        $scope.AttendanceModeList = [];
        $http({
            method: 'GET',
            url: base_url + "HR/Master/GetAllAttendanceMode",
            dataType: "json"
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.AttendanceModeList = res.data.Data;
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    }

    $scope.getAttendanceModeById = function (refData) {
        $scope.loadingstatus = "running";
        showPleaseWait();
        var para = {
            TranId: refData.TranId
        };
        $http({
            method: 'POST',
            url: base_url + "HR/Master/getAttendanceModeById",
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



    $scope.DelAttendanceModeById = function (refData, ind) {
        Swal.fire({
            title: 'Do you want to delete ' + refData.Name + '?',
            showCancelButton: true,
            confirmButtonText: 'Delete',
            //message: 'Are you sure to delete selected BaliType :-' + beData.Name,
        }).then((result) => {
            if (result.isConfirmed) {
                var para = {
                    TranId: refData.TranId
                };
                $http({
                    method: 'POST',
                    url: base_url + "HR/Master/DeleteAttendanceModeById",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingStatus = "stop";

                    Swal.fire(res.data.ResponseMSG);
                    if (res.data.IsSuccess == true) {
                        $scope.GetAllAttendanceMode();
                    }
                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }

        });
    }





});