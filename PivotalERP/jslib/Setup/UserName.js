app.controller("UserName", function ($scope, $http, GlobalServices, $timeout) {
    $scope.Title = 'UserName';

    LoadData();


    function LoadData() {
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
        $scope.beData =
        {
            UserId: 0,
            UserName: '',
            FirstName: '',
            LastName: '',
            Designation: '',
            Address: '',
            MobileNO: '',
            EMailID: '',
            FirstName: '',
            LastName: '',
            GroupName: '',
            GroupId: 0,
            forUserId: 0
        };
        $scope.GodownList = [];
        $http({
            method: 'GET',
            url: base_url + "Inventory/Reporting/GetAllGodownList",
            dataType: "json",
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.GodownList = res.data.Data;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
      
        $scope.UserList = [];
        $http({
            method: 'GET',
            url: base_url + "Setup/Security/GetAllUserList",
            dataType: "json"
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.UserList = res.data.Data;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
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
            method: 'GET',
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
            UserName: '',
            FirstName: '',
            LastName: '',
            Designation: '',
            Address: '',
            MobileNO: '',
            EMailID: '',
            GroupName: '',
            GroupId: 0,
            forUserId: 0
        };
        $('#txtName').focus();
    }




    $scope.IsValidUserName = function () {
        if ($scope.beData.UserName.isEmpty()) {
            Swal.fire("Please ! Enter the Valid UserName");
            return false;
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

        $http({
            method: 'POST',
            url: base_url + "Setup/Security/SaveUserName",
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
            method: 'GET',
            url: base_url + "Setup/Security/GetAllUserNameList",
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
            forUserId: beData.forUserId
        };
        $http({
            method: 'POST',
            url: base_url + "Setup/Security/GetUserNameById",
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
                   
                    forUserId: refData.forUserId
                };

                $http({
                    method: 'POST',
                    url: base_url + "Setup/Security/DeleteUserName",
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
});