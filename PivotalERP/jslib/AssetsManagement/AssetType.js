app.controller("AssetTypeController", function ($scope, $filter, $http, $timeout, GlobalServices) {
    $scope.Title = 'Appointment Type';

    $scope.LoadData = function () {
        $('.select2').select2();

        $scope.perPageColl = GlobalServices.getPerPageList();

        $scope.currentPages = {
            AssetType: 1,
        };

        $scope.searchData = {
            AssetType: '',
        };

        $scope.perPage = {
            AssetType: GlobalServices.getPerPageRow(),
        };
        $scope.DataTypeColl = [];
        $http({
            method: 'GET',
            url: base_url + "Setup/ReportWriter/GetDataTypeList",
            dataType: "json",
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.DataTypeColl = res.data.Data;
            }
            else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });


        //$scope.PkTablesColl = [];
        //$http({
        //    method: 'GET',
        //    url: base_url + "Setup/ReportWriter/GetPKTables",
        //    dataType: "json",
        //}).then(function (res) {
        //    if (res.data.IsSuccess && res.data.Data) {
        //        $scope.PkTablesColl = res.data.Data;
        //    }
        //    else {
        //        Swal.fire(res.data.ResponseMSG);
        //    }
        //}, function (reason) {
        //    Swal.fire('Failed' + reason);
        //});


        $scope.PkTablesColl = [];
        $scope.PkTablesColl_Qry = [];
        $http.get(base_url + "Setup/ReportWriter/GetPKTables").then(function (res) {
            $scope.PkTablesColl = res.data.Data;
            $scope.PkTablesColl_Qry = mx(res.data.Data);
        }, function (reason) { Swal.fire('Failed: ' + reason); });


        $scope.newAssetType = {
            AssetTypeId: null,
            TypeName: "",
            TypeCode: "",
            TypeParentId: null,
            VoucherUDFCol: [],
            Mode: "Save"
        }

        $scope.TypeParentList = [];
        $scope.confirmMSG = GlobalServices.getConfirmMSG();
        $scope.newAssetType.VoucherUDFCol.push({});
        $scope.GetAllAssetType();
    }
    $scope.ClearFields = function () {
        $scope.newAssetType = {
            AssetTypeId: null,
            TypeName: "",
            TypeCode: "",
            TypeParentId: null,
            VoucherUDFCol: [],
            Mode: "Save"
        }
        $scope.newAssetType.VoucherUDFCol.push({});
    }


    $scope.AddCurItemUdf = function (ind) {
        if ($scope.newAssetType.VoucherUDFCol) {
            if ($scope.newAssetType.VoucherUDFCol.length > ind + 1) {
                $scope.newAssetType.VoucherUDFCol.splice(ind + 1, 0, {
                    SortOrder: 1
                })
            } else {
                $scope.newAssetType.VoucherUDFCol.push({
                    SortOrder: 1
                })
            }
        }
    };

    //for child table
    $scope.delCurItemUdf = function (ind) {
        if ($scope.newAssetType.VoucherUDFCol) {
            if ($scope.newAssetType.VoucherUDFCol.length > 1) {
                $scope.newAssetType.VoucherUDFCol.splice(ind, 1);
            }
        }
    };
    $scope.IsValidAssetType = function () {
        if ($scope.newAssetType.TypeName.isEmpty()) {
            Swal.fire('Please ! Enter Name');
            return false;
        }
        return true;
    }
    $scope.GetAllAssetType = function () {
        $scope.loadingstatus = 'running';
        showPleaseWait();

        $http({
            method: 'POST',
            url: base_url + "AssetsManagement/Creation/GetAllAssetType",
            dataType: "json"
        }).then(function (res) {

            $scope.loadingstatus = 'stop';
            hidePleaseWait();

            if (res.data.IsSuccess && res.data.Data) {
                $scope.AssetTypeList = res.data.Data;
                $scope.TypeParentList = res.data.Data;
            } else
                Swal.fire(res.data.ResponseMSG);

        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    }


    $scope.SaveUpdateAssetType = function () {
        if ($scope.IsValidAssetType() == true) {
            if ($scope.confirmMSG.Accept == true) {
                var saveModify = $scope.newAssetType.Mode;
                Swal.fire({
                    title: 'Do you want to' + saveModify + 'the current data?',
                    showCancelButton: true,
                    confirmButtonText: saveModify,
                }).then((result) => {
                    if (result.isConfirmed) {
                        $scope.CallSaveUpdateAssetType();
                    }

                });
            }
            else
                $scope.CallSaveUpdateAssetType();
        }
    };


    $scope.CallSaveUpdateAssetType = function () {
        $scope.loadingstatus = 'running';
        showPleaseWait();

        $http({
            method: 'POST',
            url: base_url + "AssetsManagement/Creation/SaveAssetType",
            headers: { 'content-Type': undefined },

            transformRequest: function (data) {
                var formData = new FormData();
                formData.append("jsonData", angular.toJson(data.jsonData));
                return formData;
            },
            data: { jsonData: $scope.newAssetType }
        }).then(function (res) {

            $scope.loadingstatus = "stop";
            hidePleaseWait();

            Swal.fire(res.data.ResponseMSG);
            if (res.data.IsSuccess == true) {
                $scope.ClearFields();
                $scope.GetAllAssetType();
            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
        });
    }

    $scope.GetAssetTypeById = function (beData) {

        $scope.loadingstatus = "running";
        var para = {
            AssetTypeId: beData.AssetTypeId
        };
        $http({
            method: 'POST',
            url: base_url + "AssetsManagement/Creation/GetAssetTypeById",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $timeout(function () {
                    $scope.newAssetType = res.data.Data;
                    $scope.newAssetType.Mode = 'Modify';


                    if (!$scope.newAssetType.VoucherUDFCol || $scope.newAssetType.VoucherUDFCol.length == 0) {

                        $scope.newAssetType.VoucherUDFCol = [];

                        $scope.newAssetType.VoucherUDFCol.push({});

                    }

                    $('#custom-tabs-four-profile-tab').tab('show');
                });
            } else
                Swal.fire(res.data.ResponseMSG);

        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    }


    $scope.deleteAssetType = function (refData, ind) {

        Swal.fire({
            title: 'Are you sure to delete AssetType:-' + refData.TypeName,
            showCancelButton: true,
            confirmButtonText: 'Delete',
        }).then((result) => {
            if (result.isConfirmed) {
                $scope.loadingstatus = "running";
                showPleaseWait();

                var para = {
                    AssetTypeId: refData.AssetTypeId
                };

                $http({
                    method: 'POST',
                    url: base_url + "AssetsManagement/Creation/DelAssetType",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingstatus = "stop";
                    Swal.fire(res.data.ResponseMSG);
                    if (res.data.IsSuccess) {
                        $scope.GetAllAssetType();
                    }

                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }
        });

    }
})