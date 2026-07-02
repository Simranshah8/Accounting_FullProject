app.controller("EmpUserCtrl", function ($scope, $http, $filter, $timeout, GlobalServices) {

    
    $scope.LoadData=function() {
        $('.select2').select2();
        $scope.UserNameAsList = [{ id: 1, text: 'Mobile No' }, { id: 2, text: 'Email Id' }, { id: 3, text: 'Code' }, { id: 4, text: 'PanId' }];
        $scope.loadingstatus = "stop";
        
        $scope.confirmMSG = GlobalServices.getConfirmMSG();
        $scope.perPageColl = GlobalServices.getPerPageList();
        
        $scope.currentPages = {
            UserName: 1
        };

        $scope.searchData = {
            UserName: ''
        };

        $scope.perPage = {
            UserName: GlobalServices.getPerPageRow(),
        }

        $scope.newDealerUser = {
            Prefix: '',
            Suffix: '',
            GroupId: null,
            AsPer: 1,
        };

        $scope.UserGroupList = [];
        $http({
            method: 'POST',
            url: base_url + "Setup/Security/GetAllUserGroupList",
            dataType: "json"
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                var dataColl = res.data.Data;
                angular.forEach(dataColl, function (dc) {
                    if (dc.GroupType == 4) {
                        $scope.UserGroupList.push(dc);
                    }
                });
                if ($scope.UserGroupList.length > 0) {
                    $scope.newDealerUser.GroupId = $scope.UserGroupList[0].GroupId;
                }
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });


        $scope.GetAllDealerUser();
        $scope.newDet = {
            ActiveSelfie: false,
            ActiveRemarksOnAttendance: false,
            ActiveAppAttendance: false
        }
    };

    $scope.ClearDet = function () {
        $scope.newDet = {
            ActiveSelfie: false,
            ActiveRemarksOnAttendance: false,
            ActiveAppAttendance: false
        }

    }

    $scope.GetAllDealerUser = function () {

        $scope.loadingstatus = 'running';
        showPleaseWait();
        $scope.AllUserColl = [];
        $http({
            method: 'POST',
            url: base_url + "Setup/Security/GetAllEmployeeUser",
            dataType: "json",            
        }).then(function (res) {
            $scope.loadingstatus = "stop";
            hidePleaseWait();
            if (res.data.IsSuccess && res.data.Data) {
                $scope.AllUserColl = res.data.Data;
               
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

    }

    $scope.GenerateUser = function () {

        $scope.loadingstatus = 'running';
        showPleaseWait();   
        $http({
            method: 'POST',
            url: base_url + "Setup/Security/GenEmployeeUser",
            dataType: "json",
            data: JSON.stringify($scope.newDealerUser)
        }).then(function (res) {
            $scope.loadingstatus = "stop";
            hidePleaseWait();
            Swal.fire(res.data.ResponseMSG);
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

    }
    $scope.CurAgentUser = {};
    $scope.ShowPwdReset = function (rowData) {
        $scope.CurAgentUser = rowData;
        $scope.CurAgentUser.UserId = rowData.DealerUserId;
        $('#frmPwdReset').modal('show');
    };

    $scope.IsValidResetPassword = function () {
        if ($scope.CurAgentUser.NewPassword.isEmpty()) {
            Swal.fire('Please ! Enter New Password');
            return false;
        }
        if ($scope.CurAgentUser.ConfirmPassword.isEmpty()) {
            Swal.fire('Please !  Confirm Password');
            return false;
        }

        if ($scope.CurAgentUser.NewPassword != $scope.CurAgentUser.ConfirmPassword) {
            Swal.fire('New Password and Confirm Password Does Not Match');
            return false;
        }

        return true;
    };

    $scope.SaveUpdateResetPassword = function () {

        if ($scope.IsValidResetPassword() == true) {

            Swal.fire({
                title: 'Do you want to update password of selected User?',
                showCancelButton: true,
                confirmButtonText: 'Update',
            }).then((result) => {
                /* Read more about isConfirmed, isDenied below */
                if (result.isConfirmed) {
                    $scope.loadingstatus = "running";
                    showPleaseWait();

                    var para = {
                        uId: $scope.CurAgentUser.UserId,
                        newPwd: $scope.CurAgentUser.NewPassword
                    };
                    $http({
                        method: 'POST',
                        url: base_url + "Setup/Security/UpdateUserPwd",
                        dataType: "json",
                        data: JSON.stringify(para)
                    }).then(function (res) {
                        hidePleaseWait();
                        $scope.loadingstatus = "stop";
                        Swal.fire(res.data.ResponseMSG);

                        if (res.data.IsSuccess == true)
                            $('#frmPwdReset').modal('hide');

                    }, function (reason) {
                        Swal.fire('Failed' + reason);
                    });
                }
            });

        }

    };

    $scope.UpdateUser = function (rowData) {
        $scope.loadingstatus = 'running';
        showPleaseWait();
        //$scope.ClearDet();

        $scope.CurAgentUser = rowData;
        var para = {
            UserId : rowData.DealerUserId
        }
        $http({
            method: 'POST',
            url: base_url + "Setup/Security/GetUserById",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            $scope.loadingstatus = "stop";
            hidePleaseWait();
            if (res.data.IsSuccess && res.data.Data) {
                $scope.newDet = res.data.Data;
                $('#userUpdate').modal('show');
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    }
    $scope.AutoRemarksOnAttendance = function () {
        if ($scope.newDet.AllowAppAttendance === true) {
            $scope.newDet.ActiveRemarksOnAttendance = true;
        } else {
            $scope.newDet.ActiveRemarksOnAttendance = false;
            $scope.newDet.TakeSelfie = false;
        }
    };


    $scope.UpdateUserWiseActive = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();

        $http({
            method: 'POST',
            url: base_url + "Setup/Security/UpdateUserWiseActive",
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

            $('#userUpdate').modal('hide');
            Swal.fire(res.data.ResponseMSG);


        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";

        });


    }


});