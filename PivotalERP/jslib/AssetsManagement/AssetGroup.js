app.controller("AssetGroupController", function ($scope, $filter, $http, $timeout, GlobalServices) {
    $scope.Title = 'Appointment Type';

    $scope.LoadData = function () {
        $('.select2').select2();

        $scope.perPageColl = GlobalServices.getPerPageList();

        $scope.currentPages = {
            AssetGroup: 1,
        };

        $scope.searchData = {
            AssetGroup: '',
        };

        $scope.perPage = {
            AssetGroup: GlobalServices.getPerPageRow(),
        };
        $scope.newAssetGroup = {
            AssetGroupId: null,
            GroupName: "",
            GroupCode: "",
            GroupParentId: null,
            GroupMode: "Save"
        }
        $scope.GroupParentList = [];
        $scope.confirmMSG = GlobalServices.getConfirmMSG();
        $scope.GetAllAssetGroup();
    }

    $scope.ClearFields = function () {
        $scope.newAssetGroup = {
            AssetGroupId: null,
            GroupName: "",
            GroupCode: "",
            GroupParentId: null,
            Mode: "Save"
        }
    }

    $scope.IsValidAssetGroup = function () {
        if ($scope.newAssetGroup.GroupName.isEmpty()) {
            Swal.fire('Please ! Enter Name');
            return false;
        }
        return true;
    }

    $scope.GetAllAssetGroup = function () {
        $scope.loadingstatus = 'running';
        showPleaseWait();

        $http({
            method: 'POST',
            url: base_url + "AssetsManagement/Creation/GetAllAssetGroup",
            dataType: "json"
        }).then(function (res) {

            $scope.loadingstatus = 'stop';
            hidePleaseWait();

            if (res.data.IsSuccess && res.data.Data) {
                $scope.AssetGroupList = res.data.Data;
                $scope.GroupParentList = res.data.Data;
            } else
                Swal.fire(res.data.ResponseMSG);

        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    }


    $scope.SaveUpdateAssetGroup = function () {
        if ($scope.IsValidAssetGroup() == true) {
            if ($scope.confirmMSG.Accept == true) {
                var saveModify = $scope.newAssetGroup.Mode;
                Swal.fire({
                    title: 'Do you want to' + saveModify + 'the current data?',
                    showCancelButton: true,
                    confirmButtonText: saveModify,
                }).then((result) => {
                    if (result.isConfirmed) {
                        $scope.CallSaveUpdateAssetGroup();
                    }

                });
            }
            else
                $scope.CallSaveUpdateAssetGroup();
        }
    };


    $scope.CallSaveUpdateAssetGroup = function () {
        $scope.loadingstatus = 'running';
        showPleaseWait();

        $http({
            method: 'POST',
            url: base_url + "AssetsManagement/Creation/SaveAssetGroup",
            headers: { 'content-Type': undefined },

            transformRequest: function (data) {
                var formData = new FormData();
                formData.append("jsonData", angular.toJson(data.jsonData));
                return formData;
            },
            data: { jsonData: $scope.newAssetGroup }
        }).then(function (res) {

            $scope.loadingstatus = "stop";
            hidePleaseWait();

            Swal.fire(res.data.ResponseMSG);
            if (res.data.IsSuccess == true) {
                $scope.ClearFields();
                $scope.GetAllAssetGroup();
            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
        });
    }

    $scope.GetAssetGroupById = function (beData) {

        $scope.loadingstatus = "running";
        var para = {
            AssetGroupId: beData.AssetGroupId
        };
        $http({
            method: 'POST',
            url: base_url + "AssetsManagement/Creation/GetAssetGroupById",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $timeout(function () {
                    $scope.newAssetGroup = res.data.Data;
                    $scope.newAssetGroup.Mode = 'Modify';
                    $('#custom-tabs-four-profile-tab').tab('show');
                });
            } else
                Swal.fire(res.data.ResponseMSG);

        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    }


    $scope.deleteAssetGroup = function (refData, ind) {

        Swal.fire({
            title: 'Are you sure to delete AssetGroup:-' + refData.GroupName,
            showCancelButton: true,
            confirmButtonText: 'Delete',
        }).then((result) => {
            if (result.isConfirmed) {
                $scope.loadingstatus = "running";
                showPleaseWait();

                var para = {
                    AssetGroupId: refData.AssetGroupId
                };

                $http({
                    method: 'POST',
                    url: base_url + "AssetsManagement/Creation/DelAssetGroup",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingstatus = "stop";
                    Swal.fire(res.data.ResponseMSG);
                    if (res.data.IsSuccess) {
                        $scope.GetAllAssetGroup();
                    }

                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }
        });

    }
})