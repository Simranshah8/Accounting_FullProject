app.controller("AssetModelController", function ($scope, $filter, $http, $timeout, GlobalServices) {
    $scope.Title = 'Appointment Type';

    $scope.LoadData = function () {
        $('.select2').select2();

        $scope.perPageColl = GlobalServices.getPerPageList();

        $scope.currentPages = {
            AssetModel: 1,
        };

        $scope.searchData = {
            AssetModel: '',
        };

        $scope.perPage = {
            AssetModel: GlobalServices.getPerPageRow(),
        };
        $scope.newAssetModel = {
            AssetModelId: null,
            ModelName: "",
            ModelCode: "",
            ModelParentId: null,
            Mode: "Save"
        }
        $scope.ModelParentList = [];
        $scope.confirmMSG = GlobalServices.getConfirmMSG();
        $scope.GetAllAssetModel();
    }
    $scope.ClearFields = function () {
        $scope.newAssetModel = {
            AssetModelId: null,
            ModelName: "",
            ModelCode: "",
            ModelParentId: null,
            Mode: "Save"
        }
    }

    $scope.IsValidAssetModel = function () {
        if ($scope.newAssetModel.ModelName.isEmpty()) {
            Swal.fire('Please ! Enter Name');
            return false;
        }
        return true;
    }
    $scope.GetAllAssetModel = function () {
        $scope.loadingstatus = 'running';
        showPleaseWait();

        $http({
            method: 'POST',
            url: base_url + "AssetsManagement/Creation/GetAllAssetModel",
            dataType: "json"
        }).then(function (res) {

            $scope.loadingstatus = 'stop';
            hidePleaseWait();

            if (res.data.IsSuccess && res.data.Data) {
                $scope.AssetModelList = res.data.Data;
                $scope.ModelParentList = res.data.Data;
            } else
                Swal.fire(res.data.ResponseMSG);

        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    }


    $scope.SaveUpdateAssetModel = function () {
        if ($scope.IsValidAssetModel() == true) {
            if ($scope.confirmMSG.Accept == true) {
                var saveModify = $scope.newAssetModel.Mode;
                Swal.fire({
                    title: 'Do you want to' + saveModify + 'the current data?',
                    showCancelButton: true,
                    confirmButtonText: saveModify,
                }).then((result) => {
                    if (result.isConfirmed) {
                        $scope.CallSaveUpdateAssetModel();
                    }

                });
            }
            else
                $scope.CallSaveUpdateAssetModel();
        }
    };


    $scope.CallSaveUpdateAssetModel = function () {
        $scope.loadingstatus = 'running';
        showPleaseWait();

        $http({
            method: 'POST',
            url: base_url + "AssetsManagement/Creation/SaveAssetModel",
            headers: { 'content-Type': undefined },

            transformRequest: function (data) {
                var formData = new FormData();
                formData.append("jsonData", angular.toJson(data.jsonData));
                return formData;
            },
            data: { jsonData: $scope.newAssetModel }
        }).then(function (res) {

            $scope.loadingstatus = "stop";
            hidePleaseWait();

            Swal.fire(res.data.ResponseMSG);
            if (res.data.IsSuccess == true) {
                $scope.ClearFields();
                $scope.GetAllAssetModel();
            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
        });
    }

    $scope.GetAssetModelById = function (beData) {

        $scope.loadingstatus = "running";
        var para = {
            AssetModelId: beData.AssetModelId
        };
        $http({
            method: 'POST',
            url: base_url + "AssetsManagement/Creation/GetAssetModelById",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $timeout(function () {
                    $scope.newAssetModel = res.data.Data;
                    $scope.newAssetModel.Mode = 'Modify';
                    $('#custom-tabs-four-profile-tab').tab('show');
                });
            } else
                Swal.fire(res.data.ResponseMSG);

        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    }


    $scope.deleteAssetModel = function (refData, ind) {

        Swal.fire({
            title: 'Are you sure to delete AssetModel:-' + refData.ModelName,
            showCancelButton: true,
            confirmButtonText: 'Delete',
        }).then((result) => {
            if (result.isConfirmed) {
                $scope.loadingstatus = "running";
                showPleaseWait();

                var para = {
                    AssetModelId: refData.AssetModelId
                };

                $http({
                    method: 'POST',
                    url: base_url + "AssetsManagement/Creation/DelAssetModel",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingstatus = "stop";
                    Swal.fire(res.data.ResponseMSG);
                    if (res.data.IsSuccess) {
                        $scope.GetAllAssetModel();
                    }

                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }
        });

    }
})