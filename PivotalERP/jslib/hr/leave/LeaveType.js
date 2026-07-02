app.controller('LeaveTypeController', function ($scope, $http, $timeout, $filter, GlobalServices) {
    $scope.Title = 'LeaveType';

    LoadData();

    function LoadData() {
        $('.select2').select2();
        $scope.confirmMSG = GlobalServices.getConfirmMSG();
        $scope.perPageColl = GlobalServices.getPerPageList();
        $scope.currentPages = {
            LeaveType: 1,
        };

        $scope.searchData = {
            LeaveType: '',

        };
        $scope.perPage = {
            LeaveType: GlobalServices.getPerPageRow()
        };
        $scope.newLeaveType = {
            LeaveTypeId: null,
            Name: '',
            Code: '',
            ApplicableForId: 1,
            SNo: 0,
            IncludeWeeklyOff: false,
            IncludeHoliday: false,
            PaidLeave: false,
            CarriedForward: false,
            Remarks: '',
            Mode: 'Save'
        };

        //$scope.GetAllLeaveType();

    };

    $scope.ClearLeaveType = function () {

        $timeout(function () {
            $scope.newLeaveType = {
                Name: '',
                Code: '',
                ApplicableForId: 1,
                SNo: 0,
                IncludeWeeklyOff: false,
                IncludeHoliday: false,
                PaidLeave: false,
                CarriedForward: false,
                Remarks: '',
                Mode: 'Save'
            };
        });

    }




    //************************* LeaveType *********************************
    $scope.IsValidLeaveType = function () {
        if ($scope.newLeaveType.Name.isEmpty()) {
            Swal.fire('Please ! Enter Name');
            return false;
        }
        return true;
    }

    $scope.SaveUpdateLeaveType = function () {
        if ($scope.IsValidLeaveType() == true) {
            if ($scope.confirmMSG.Accept == true) {
                var saveModify = $scope.newLeaveType.Mode;
                Swal.fire({
                    title: 'Do you want to ' + saveModify + ' the current data?',
                    showCancelButton: true,
                    confirmButtonText: saveModify,
                }).then((result) => {
                    /* Read more about isConfirmed, isDenied below */
                    if (result.isConfirmed) {
                        $scope.CallSaveUpdateLeaveType();
                    }
                });
            } else
                $scope.CallSaveUpdateLeaveType();
        }
    };

    $scope.CallSaveUpdateLeaveType = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();
        $http({
            method: 'POST',
            url: base_url + "HR/Leave/SaveLeaveType",
            headers: { 'Content-Type': undefined },
            transformRequest: function (data) {
                var formData = new FormData();
                formData.append("jsonData", angular.toJson(data.jsonData));
                return formData;
            },
            data: { jsonData: $scope.newLeaveType }
        }).then(function (res) {
            $scope.loadingstatus = "stop";
            hidePleaseWait();
            Swal.fire(res.data.ResponseMSG);
            if (res.data.IsSuccess == true) {
                $scope.ClearLeaveType();
                $scope.GetAllLeaveTypeList();
            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
        });
    }

    $scope.GetAllLeaveTypeList = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();
        $scope.LeaveTypeList = [];
        $http({
            method: 'POST',
            url: base_url + "HR/Leave/GetAllLeaveTypeList",
            dataType: "json"
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.LeaveTypeList = res.data.Data;
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    }
    $scope.GetLeaveTypeById = function (refData) {
        $scope.loadingstatus = "running";
        showPleaseWait();
        var para = {
            LeaveTypeId: refData.LeaveTypeId
        };
        $http({
            method: 'POST',
            url: base_url + "HR/Leave/GetLeaveTypeById",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.newLeaveType = res.data.Data;
                $scope.newLeaveType.Mode = 'Modify';
                $('#custom-tabs-four-profile-tab').tab('show');

            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    };

    $scope.DelLeaveTypeById = function (refData) {
        Swal.fire({
            title: 'Do you want to delete the selected data?',
            showCancelButton: true,
            confirmButtonText: 'Delete',
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                $scope.loadingstatus = "running";
                showPleaseWait();
                var para = {
                    LeaveTypeId: refData.LeaveTypeId
                };
                $http({
                    method: 'POST',
                    url: base_url + "HR/Leave/DelLeaveType",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingstatus = "stop";
                    if (res.data.IsSuccess) {
                        $scope.GetAllLeaveTypeList();
                    } else {
                        Swal.fire(res.data.ResponseMSG);
                    }
                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }
        });
    };


    $scope.pageChangeHandler = function (num) {
        console.log('page changed to ' + num);
    };



});