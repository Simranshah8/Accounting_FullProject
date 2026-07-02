app.controller("NewUserController", function ($scope, $http, $filter, GlobalServices, $timeout) {
    $scope.Title = 'UserName';

    LoadData();
     
    function LoadData() {
        $scope.loadingstatus = "stop";
        $scope.DefaultPhoto = '/wwwroot/dynamic/images/avatar-img.jpg';

        $('.select2').select2({
            allowClear: true,
            openOnEnter: true
        });

        $scope.confirmMSG = GlobalServices.getConfirmMSG();
        $scope.perPageColl = GlobalServices.getPerPageList();
        $scope.UserTypes = GlobalServices.getUserTypes();
        $scope.currentPages = {
            UserName: 1

        };

        $scope.searchData = {
            UserName: ''

        };

        $scope.perPage = {
            UserName: GlobalServices.getPerPageRow(),

        }
        $scope.beData =
        {
            UserId: 0,
            GroupId: null,
            FirstName: '',
            LastName: '',
            Designation: '',
            UserName: '',
            Password: '',
            RePassword: '',
            Address: '',
            MobileNO: '',
            BranchId: 1,
            EMailID: '',
            Active: true,
            UserNeverExpire: true,
            UserCannotChangePassword: false,
            ChangePasswordFirstTime: false,
            StartDate_TMP: null,
            EndDate_TMP: null,
            LogonHours: 1,
            UserWiseSecurity: false,
            UserWiseAutoPost: false,
            Photo: null,
            PhotoPath: null,
            MacAddress: '',
            PublicIP: '',
            UserType: 1,
            AllowSelftPost:false,
            Mode: 'Save',
            AllowMultipleDevice:true,
        };
          
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

        $scope.UserGroupList = [];
        $http({
            method: 'POST',
            url: base_url + "Setup/Security/GetAllUserGroupList",
            dataType: "json"
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.UserGroupList = res.data.Data;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
         
    };

    $scope.ClearFields = function () {
        $scope.loadingstatus = "stop";
        $scope.beData =
        {
            UserId: 0,
            GroupId: null,
            FirstName: '',
            LastName: '',
            Designation: '',
            UserName: '',
            Password: '',
            RePassword: '',
            Address: '',
            MobileNO: '',
            BranchId: 1,
            EMailID: '',
            Active: true,
            UserNeverExpire: true,
            UserCannotChangePassword: false,
            ChangePasswordFirstTime: false,
            StartDate_TMP: null,
            EndDate_TMP: null,
            LogonHours: 1,
            UserWiseSecurity: false,
            UserWiseAutoPost: false,
            Photo: null,
            PhotoPath: null,
            MacAddress: '',
            PublicIP: '',
            UserType: 1,
            AllowSelftPost:false,
            Mode: 'Save',
            AllowMultipleDevice:true,
        };
         
    }

     
    $scope.IsValidUserName = function () {
        if ($scope.beData.UserName.isEmpty()) {
            Swal.fire("Please ! Enter the Valid UserName");
            return false;
        }

        if ($scope.beData.FirstName.isEmpty()) {
            Swal.fire('Please ! Enter First Name');
            return false;
        }

        if ($scope.beData.LastName.isEmpty()) {
            Swal.fire('Please ! Enter Last Name');
            return false;
        }

        if ($scope.beData.UserName.isEmpty()) {
            Swal.fire('Please ! Enter UserName');
            return false;
        }

        if ($scope.beData.BranchId == 0) {
            Swal.fire('Please ! Select Valid Branch Name');
            return false;
        }

        if ($scope.beData.UserId == 0) {
            if ($scope.beData.Password.isEmpty()) {
                Swal.fire('Please ! Enter User Password');
                return false;
            }

            if ($scope.beData.RePassword.isEmpty()) {
                Swal.fire('Please ! Enter User Re-Password');
                return false;
            }

            if ($scope.beData.RePassword != $scope.beData.Password) {
                Swal.fire('User Password Re-Password does not matched');
                return false;
            }
        }
         

        return true;
    }

    $scope.AddNewUserName = function () {
        if ($scope.IsValidUserName() == true) {
            if ($scope.confirmMSG.Accept == true) {
                var saveModify = $scope.beData.Mode;
                Swal.fire({
                    title: 'Do you want to' + saveModify + 'the current data?',
                    showCancelButton: true,
                    confirmButtonText: saveModify,
                }).then((result) => {
                    if (result.isConfirmed) {
                        $scope.CallSaveUserName();
                    }

                });
            }
            else
                $scope.CallSaveUserName();
        }
    };

    $scope.CallSaveUserName = function () {
        $scope.loadingstatus = 'running';
        showPleaseWait();

        if ($scope.beData.StartDateDet) {
            $scope.beData.StartDate = $filter('date')(new Date($scope.beData.StartDateDet.dateAD), 'yyyy-MM-dd');
        } else
            $scope.beData.StartDate = null;

        if ($scope.beData.EndDateDet) {
            $scope.beData.EndDate = $filter('date')(new Date($scope.beData.EndDateDet.dateAD), 'yyyy-MM-dd');
        } else
            $scope.beData.EndDate = null;

        var photo = $scope.beData.Photo_TMP;

        $http({
            method: 'POST',
            url: base_url + "Setup/Security/SaveUser",
            headers: { 'content-Type': undefined },

            transformRequest: function (data) {
                var formData = new FormData();
                formData.append("jsonData", angular.toJson(data.jsonData));

                if (data.stPhoto && data.stPhoto.length > 0)
                    formData.append("photo", data.stPhoto[0]);

                return formData;
            },
            data: { jsonData: $scope.beData, stPhoto: photo}
        }).then(function (res) {

            $scope.loadingstatus = "stop";
            hidePleaseWait();

            Swal.fire(res.data.ResponseMSG);
            if (res.data.IsSuccess == true) {
                $scope.ClearFields();
                $scope.GetAllUserName();
            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
        });
    }
    $scope.GetAllUserName = function () {


        $scope.UserNameColl = []; //declare an empty array

        if ($scope.loadingstatus != 'stop') {
            alert('Already Running Process')
            return;
        }

        $scope.loadingstatus = 'running';
        showPleaseWait();

        $http({
            method: 'POST',
            url: base_url + "Setup/Security/GetAllUserList",
            dataType: "json"
            //data:JSON.stringify(para)
        }).then(function (res) {

            $scope.loadingstatus = 'stop';
            hidePleaseWait();

            if (res.data.IsSuccess && res.data.Data) {
                $timeout(function () {
                    $scope.UserNameColl = res.data.Data;
                });
            } else
                alert(res.data.ResponseMSG);

        }, function (reason) {
            alert('Failed' + reason);
        });

    }
    $scope.getUserNameById = function (beData) {

        $scope.loadingstatus = "running";
        var para = {
            UserId: beData.UserId
        };
        $http({
            method: 'POST',
            url: base_url + "Setup/Security/GetUserById",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $('#custom-tabs-four-profile-tab').tab('show');

                $scope.beData = res.data.Data;
                $scope.beData.Mode = 'Modify';

                if ($scope.beData.StartDate)
                    $scope.beData.StartDate_TMP = new Date($scope.beData.StartDate);

                if ($scope.beData.EndDate)
                    $scope.beData.EndDate_TMP = new Date($scope.beData.EndDate);
            } else
                Swal.fire(res.data.ResponseMSG);

        }, function (reason) {
            alert('Failed' + reason);
        });
    }

    $scope.deleteUserName = function (refData, ind) {

        Swal.fire({
            title: 'Are you sure to delete selected UserGroup :-' + refData.UserName,
            showCancelButton: true,
            confirmButtonText: 'Delete',
        }).then((result) => {
            if (result.isConfirmed) {
                $scope.loadingstatus = "running";
                showPleaseWait();

                var para = {
                    UserId: refData.UserId
                };

                $http({
                    method: 'POST',
                    url: base_url + "Setup/Security/DelUser",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingstatus = "stop";
                    Swal.fire(res.data.ResponseMSG);
                    if (res.data.IsSuccess) {
                        $scope.UserNameColl.splice(ind, 1);
                    }

                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }
        });

    }

    $scope.ClearDeviceRegLog = function (refData) {

        Swal.fire({
            title: 'Are you sure to cleare device reg. log for :-' + refData.UserName,
            showCancelButton: true,
            confirmButtonText: 'Clear',
        }).then((result) => {
            if (result.isConfirmed) {
                $scope.loadingstatus = "running";
                showPleaseWait();

                var para = {
                    UserId: refData.UserId
                };

                $http({
                    method: 'POST',
                    url: base_url + "Setup/Security/ClearDeviceRegLog",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingstatus = "stop";
                    Swal.fire(res.data.ResponseMSG);                  

                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }
        });

    }

    $scope.ForceLogOut = function (usr) {
        var tmpUserColl = [];
        $scope.loadingstatus = "running";
        showPleaseWait();
        tmpUserColl.push(usr)
        $http({
            method: 'POST',
            url: base_url + "Setup/Security/ForceLogOutFromApp",
            dataType: "json",
            data:JSON.stringify(tmpUserColl)
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";

            Swal.fire(res.data.ResponseMSG);
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    }
    $scope.ForceLogOutWeb = function (usr) {
        var tmpUserColl = [];
        $scope.loadingstatus = "running";
        showPleaseWait();
        var para = {
            UserId: usr.UserId,
            UserName:usr.UserName
        };
        $http({
            method: 'POST',
            url: base_url + "Setup/Security/ForLogOut",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";

            Swal.fire(res.data.ResponseMSG);
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    }

    $scope.GenToken = function () {

        Swal.fire({
            title: 'Are you sure to generate authentication key ? after reset existing google authenication will not work .',
            showCancelButton: true,
            confirmButtonText: 'Generate',
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                $scope.loadingstatus = "running";
                showPleaseWait();


                $http({
                    method: 'POST',
                    url: base_url + "Setup/Security/GetGoogleAuthKey",
                    dataType: "json",
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingstatus = "stop";
                    Swal.fire(res.data.ResponseMSG);

                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }
        });


    };

    $scope.GoogleDet = {};
    $scope.GenGoogleQR = function (usr) {
        $scope.GoogleDet = usr;

        $scope.loadingstatus = "running";
        showPleaseWait();

        var para = {
            UserName: usr.UserName
        }
        $http({
            method: 'POST',
            url: base_url + "Setup/Security/GetGoogleQR",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {

            $scope.loadingstatus = "stop";
            hidePleaseWait();

            if (res.data.IsSuccess == true) {
                var qrDet = res.data.Data;
                $scope.GoogleDet.QRImage = qrDet.ResponseMSG;
                $('#frmGoogleQry').modal('show');

            }
            else {
                Swal.fire(res.data.ResponseMSG);
            }

        }, function (errormessage) {
            hidePleaseWait();
            //$scope.loadingstatus = "stop";
            Swal.fire(errormessage);
        });
    }

});