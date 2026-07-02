app.controller("AgentUserCtrl", function ($scope, $http, $filter, $timeout, GlobalServices) {

    
    $scope.LoadData=function() {
        $('.select2').select2();
        $scope.UserNameAsList = [{ id: 1, text: 'Mobile No' }, { id: 2, text: 'Email Id' }, { id: 3, text: 'Customer Code' }, { id: 4, text: 'PanNo' }];
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

        $scope.UserGroupList = [];
        $http({
            method: 'POST',
            url: base_url + "Setup/Security/GetAllUserGroupList",
            dataType: "json"
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                var dataColl = res.data.Data;
                angular.forEach(dataColl, function (dc) {
                    if (dc.GroupType == 3) {
                        $scope.UserGroupList.push(dc);
                    }
                });
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        $scope.newDealerUser = {
            Prefix: '',
            Suffix: '',
            GroupId: 0,
            AsPer: 1,          
        };

        $scope.GetAllDealerUser();
    };


    $scope.GetAllDealerUser = function () {

        $scope.loadingstatus = 'running';
        showPleaseWait();
        $scope.AllUserColl = [];
        $http({
            method: 'POST',
            url: base_url + "Setup/Security/GetAllAgentUser",
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
            url: base_url + "Setup/Security/GenAgentUser",
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


});