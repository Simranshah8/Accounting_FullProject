app.controller("AssetCodeMethodController", function ($scope, $http, $timeout, $filter, $compile, GlobalServices, $document) {
    $scope.Title = 'Asset  Code Method';

    $scope.LoadData = function () {
        $('.select2').select2();
        $('.Dplaceholder').select2({
            placeholder: "Select Branch", allowClear: true
        });
        $('.ATplaceholder').select2({
            placeholder: "Select Asset Type", allowClear: true
        });
        $('.ACplaceholder').select2({
            placeholder: "Select Asset Category", allowClear: true
        });
        $scope.perPageColl = GlobalServices.getPerPageList();

        $scope.currentPages = {
            AssetCodeMethod: 1,
        };

        $scope.searchData = {
            AssetCodeMethod: '',
        };

        $scope.perPage = {
            AssetCodeMethod: GlobalServices.getPerPageRow(),
        };

        $scope.NumberingMethodColl = [
            { id: 1, text: "Auto" },
            { id: 2, text: "Manual" },
        ]

        $scope.GenConfig = {};
        GlobalServices.getGenConfig().then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.GenConfig.DateFormat = res.data.Data.DateFormat;
            }
        }, function (reason) {
            alert('Failed' + reason);
        });

        $scope.BranchList = [];
        $http({
            method: 'POST',
            url: base_url + "Setup/Security/GetAllBranchList",
            dataType: "json"
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.BranchList = res.data.Data;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });


        $scope.AssetTypeList = [];
        $http({
            method: 'POST',
            url: base_url + "AssetsManagement/Creation/GetAllAssetType",
            dataType: "json"
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.AssetTypeList = res.data.Data;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        $scope.AssetCategoryList = [];
        $http({
            method: 'POST',
            url: base_url + "AssetsManagement/Creation/GetAllAssetCategory",
            dataType: "json"
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.AssetCategoryList = res.data.Data;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        // for CompanyRelationshipList
        $scope.CompanyRelationshipList = [];
        $http({
            method: 'POST',
            url: base_url + "HR/Master/GetAllCompanyRelationship",
            dataType: "json"
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.CompanyRelationshipList = res.data.Data;
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });


        $scope.CostClassColl = [];
        $timeout(function () {
            $http({
                method: "GET",
                url: base_url + "Account/Creation/GetCostClassForEntry",
                dataType: "json"
            }).then(function (res) {
                $scope.CostClassColl = res.data.Data;
                if ($scope.CostClassColl.length > 0) {
                    $scope.SelectedCostClass = $scope.CostClassColl[0];
                    $scope.newDet.CostClassId = $scope.SelectedCostClass.CostClassId;
                }

            }, function (errormessage) {
                alert('Unable to Delete data. pls try again.' + errormessage.responseText);
            });
        });

        $scope.newDet = {
            TranId: null,
            NumberingMethod:1,
            CompanyId: null,
            BranchId: null,
            AssetTypeId: null,
            AssetCategoryId: null,
            Prefix: '',
            Suffix: '',
            StartNo: null,
            PadWidth: null,
            Mode: "Save"
        }
        $scope.CategoryList = [];
        $scope.confirmMSG = GlobalServices.getConfirmMSG();
        $scope.GetAllAssetCodeMethod();
    }

    $scope.ClearFields = function () {
        $scope.newDet = {
            TranId: null,
            NumberingMethod: 1,
            CompanyId: null,
            BranchId: null,
            AssetTypeId: null,
            AssetCategoryId: null,
            CostClassId: $scope.SelectedCostClass.CostClassId,
            Prefix: '',
            Suffix: '',
            StartNo: null,
            PadWidth: null,
            Mode: "Save"
        }
    }

    $scope.IsValidAssetCodeMethod = function () {
        return true;
    }

    $scope.GetAllAssetCodeMethod = function () {
        $scope.loadingstatus = 'running';
        showPleaseWait();

        $http({
            method: 'POST',
            url: base_url + "AssetsManagement/Creation/GetAllAssetCodeMethod",
            dataType: "json"
        }).then(function (res) {

            $scope.loadingstatus = 'stop';
            hidePleaseWait();
            if (res.data.IsSuccess && res.data.Data) {
                $scope.AssetCodeMethodList = res.data.Data;
                $scope.CategoryList = res.data.Data;
            } else
                Swal.fire(res.data.ResponseMSG);

        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    }


    $scope.SaveUpdateAssetCodeMethod = function () {
        if ($scope.IsValidAssetCodeMethod() == true) {
            if ($scope.confirmMSG.Accept == true) {
                var saveModify = $scope.newDet.Mode;
                Swal.fire({
                    title: 'Do you want to' + saveModify + 'the current data?',
                    showCancelButton: true,
                    confirmButtonText: saveModify,
                }).then((result) => {
                    if (result.isConfirmed) {
                        $scope.CallSaveUpdateAssetCodeMethod();
                    }

                });
            }
            else
                $scope.CallSaveUpdateAssetCodeMethod();
        }
    };


    $scope.CallSaveUpdateAssetCodeMethod = function () {
        $scope.loadingstatus = 'running';
        showPleaseWait();
        $http({
            method: 'POST',
            url: base_url + "AssetsManagement/Creation/SaveAssetCodeMethod",
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
                $scope.GetAllAssetCodeMethod();
            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
        });
    }

    $scope.GetAssetCodeMethodById = function (beData) {
        $scope.loadingstatus = "running";
        var para = {
            TranId: beData.TranId
        };
        $http({
            method: 'POST',
            url: base_url + "AssetsManagement/Creation/GetAssetCodeMethodById",
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


    $scope.deleteAssetCodeMethod = function (refData, ind) {
        Swal.fire({
            title: 'Are you sure to delete AssetCodeMethod:-' + refData.Name,
            showCancelButton: true,
            confirmButtonText: 'Delete',
        }).then((result) => {
            if (result.isConfirmed) {
                $scope.loadingstatus = "running";
                showPleaseWait();
                var para = {
                    TranId: refData.TranId
                };
                $http({
                    method: 'POST',
                    url: base_url + "AssetsManagement/Creation/DelAssetCodeMethod",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingstatus = "stop";
                    Swal.fire(res.data.ResponseMSG);
                    if (res.data.IsSuccess) {
                        $scope.GetAllAssetCodeMethod();
                    }
                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }
        });
    }
})