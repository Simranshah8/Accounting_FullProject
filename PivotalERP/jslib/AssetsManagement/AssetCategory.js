app.controller("AssetCategoryController", function ($scope, $filter, $http, $timeout, GlobalServices) {
    $scope.Title = 'Asset  Category';

    $scope.LoadData = function () {
        $('.select2').select2();

        $scope.perPageColl = GlobalServices.getPerPageList();

        $scope.currentPages = {
            AssetCategory: 1,
        };

        $scope.searchData = {
            AssetCategory: '',
        };

        $scope.perPage = {
            AssetCategory: GlobalServices.getPerPageRow(),
        };
        $scope.newDet = {
            AssetCategoryId: null,
            Name: "",
            Code : "",
            OrderNo: null,
            CategoryParentId: null,
            Mode: "Save"
        }
        $scope.CategoryList = [];
        $scope.confirmMSG = GlobalServices.getConfirmMSG();
        $scope.GetAllAssetCategory();
    }

    $scope.ClearFields = function () {
        $scope.newDet = {
            AssetCategoryId: null,
            Name: "",
            Code: "",
            OrderNo: null,
            CategoryParentId: null,
            Mode: "Save"
        }
    }

    $scope.IsValidAssetCategory = function () {
        if ($scope.newDet.Name.isEmpty()) {
            Swal.fire('Please ! Enter Name');
            return false;
        }
        return true;
    }

    $scope.GetAllAssetCategory = function () {
        $scope.loadingstatus = 'running';
        showPleaseWait();

        $http({
            method: 'POST',
            url: base_url + "AssetsManagement/Creation/GetAllAssetCategory",
            dataType: "json"
        }).then(function (res) {

            $scope.loadingstatus = 'stop';
            hidePleaseWait();

            if (res.data.IsSuccess && res.data.Data) {
                $scope.AssetCategoryList = res.data.Data;
                $scope.CategoryList = res.data.Data;
            } else
                Swal.fire(res.data.ResponseMSG);

        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    }


    $scope.SaveUpdateAssetCategory = function () {
        if ($scope.IsValidAssetCategory() == true) {
            if ($scope.confirmMSG.Accept == true) {
                var saveModify = $scope.newDet.Mode;
                Swal.fire({
                    title: 'Do you want to' + saveModify + 'the current data?',
                    showCancelButton: true,
                    confirmButtonText: saveModify,
                }).then((result) => {
                    if (result.isConfirmed) {
                        $scope.CallSaveUpdateAssetCategory();
                    }

                });
            }
            else
                $scope.CallSaveUpdateAssetCategory();
        }
    };


    $scope.CallSaveUpdateAssetCategory = function () {
        $scope.loadingstatus = 'running';
        showPleaseWait();

        $http({
            method: 'POST',
            url: base_url + "AssetsManagement/Creation/SaveAssetCategory",
            headers: { 'content-Type': undefined },

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
                $scope.ClearFields();
                $scope.GetAllAssetCategory();
            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
        });
    }

    $scope.GetAssetCategoryById = function (beData) {

        $scope.loadingstatus = "running";
        var para = {
            AssetCategoryId: beData.AssetCategoryId
        };
        $http({
            method: 'POST',
            url: base_url + "AssetsManagement/Creation/GetAssetCategoryById",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $timeout(function () {
                    $scope.newDet = res.data.Data;
                    $scope.newDet.Mode = 'Modify';
                    $('#custom-tabs-four-profile-tab').tab('show');
                });
            } else
                Swal.fire(res.data.ResponseMSG);

        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    }


    $scope.deleteAssetCategory = function (refData, ind) {

        Swal.fire({
            title: 'Are you sure to delete AssetCategory:-' + refData.Name,
            showCancelButton: true,
            confirmButtonText: 'Delete',
        }).then((result) => {
            if (result.isConfirmed) {
                $scope.loadingstatus = "running";
                showPleaseWait();

                var para = {
                    AssetCategoryId: refData.AssetCategoryId
                };

                $http({
                    method: 'POST',
                    url: base_url + "AssetsManagement/Creation/DelAssetCategory",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingstatus = "stop";
                    Swal.fire(res.data.ResponseMSG);
                    if (res.data.IsSuccess) {
                        $scope.GetAllAssetCategory();
                    }

                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }
        });

    }
})