app.controller("UserGroupController", function ($scope, $http, GlobalServices, $timeout) {
    $scope.Title = 'UserGroup';

    LoadData(); 
    function LoadData() {
        $scope.loadingstatus = "stop";
        $scope.confirmMSG = GlobalServices.getConfirmMSG();
        $scope.UserTypes = GlobalServices.getUserTypes();
        $scope.perPageColl = GlobalServices.getPerPageList();

        $scope.currentPages = {
            UserGroup: 1

        };

        $scope.searchData = {
            UserGroup: ''

        };

        $scope.perPage = {
            UserGroup: GlobalServices.getPerPageRow(),

        }
        $scope.beData =
        {
            GroupId: 0,
            GroupName: '',
            Alias: '',
            Description: '',
            GroupType:1,
        };

    };

    $scope.ClearFields = function () {
        $scope.loadingstatus = "stop";
        $scope.beData =
        {
            GroupId: 0,
            GroupName: '',
            Alias: '',
            Description: '',
            GroupType: 1,
        };
        $('#txtName').focus();
    }

    $scope.GetAllUserGroup = function () {


        $scope.UserGroupColl = []; //declare an empty array

        if ($scope.loadingstatus != 'stop') {
            alert('Already Running Process')
            return;
        }

        $scope.loadingstatus = 'running';
        showPleaseWait();

        $http({
            method: 'POST',
            url: base_url + "Setup/Security/GetAllUserGroup",
            dataType: "json"
            //data:JSON.stringify(para)
        }).then(function (res) {

            $scope.loadingstatus = 'stop';
            hidePleaseWait();

            if (res.data.IsSuccess && res.data.Data) {
                $timeout(function () {
                    $scope.UserGroupColl = res.data.Data;
                });
            } else
                alert(res.data.ResponseMSG);

        }, function (reason) {
            alert('Failed' + reason);
        });

    }


    $scope.IsValidUserGroup = function () {
        if ($scope.beData.GroupName.isEmpty()) {
            Swal.fire("Please ! Enter Valid User Group Name");
            return false;
        }
        else
            return true;
    }

    $scope.AddNewUserGroup = function () {
        if ($scope.IsValidUserGroup() == true) {
            if ($scope.confirmMSG.Accept == true) {
                var saveModify = $scope.beData.Mode;
                Swal.fire({
                    title: 'Do you want to' + saveModify + 'the current data?',
                    showCancelButton: true,
                    confirmButtonText: saveModify,
                }).then((result) => {
                    if (result.isConfirmed) {
                        $scope.CallSaveUserGroup();
                    }

                });
            }
            else
                $scope.CallSaveUserGroup();
        }
    };

    $scope.CallSaveUserGroup = function () {
        $scope.loadingstatus = 'running';
        showPleaseWait();

        $http({
            method: 'POST',
            url: base_url + "Setup/Security/SaveUserGroup",
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
                $scope.GetAllUserGroup();
            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
        });
    }
    $scope.getUserGroupById = function (beData) {

        $scope.loadingstatus = "running";
        var para = {
            GroupId: beData.GroupId
        };
        $http({
            method: 'POST',
            url: base_url + "Setup/Security/GetUserGroupById",
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

    $scope.deleteUserGroup = function (refData, ind) {

        Swal.fire({
            title: 'Are you sure to delete selected UserGroup :-' + refData.GroupName,
            showCancelButton: true,
            confirmButtonText: 'Delete',
        }).then((result) => {
            if (result.isConfirmed) {
                $scope.loadingstatus = "running";
                showPleaseWait();

                var para = {
                    GroupId: refData.GroupId
                };

                $http({
                    method: 'POST',
                    url: base_url + "Setup/Security/DeleteUserGroup",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingstatus = "stop";
                    Swal.fire(res.data.ResponseMSG);
                    if (res.data.IsSuccess) {
                        $scope.UserGroupColl.splice(ind, 1);
                    }

                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }
        });

    }





});