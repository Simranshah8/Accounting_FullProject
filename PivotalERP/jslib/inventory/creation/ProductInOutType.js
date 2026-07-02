app.controller("ProductInOutTypeController", function ($scope, $filter, $http, $timeout, GlobalServices) {
    $scope.Title = 'ProductInOutType';
    $scope.LoadData = function () {
        $('.select2').select2();
        $scope.confirmMSG = GlobalServices.getConfirmMSG();
        $scope.perPageColl = GlobalServices.getPerPageList();

        $scope.currentPages = {
            ProductInOutType: 1,
        };

        $scope.searchData = {
            ProductInOutType: '',
        };

        $scope.perPage = {
            ProductInOutType: GlobalServices.getPerPageRow(),
        };
        $scope.loadingstatus = "stop";
      
        $scope.formData = {
            TranId: null,
            Name: "",
            Code: "",
            IsActive: false,
            BDId: null,
            Mode: "Save"
        }
        $scope.GetAllProductInOutType();
    }
    $scope.ClearFields = function () {
        $scope.formData = {
            TranId: null,
            Name: "",
            Code: "",
            IsActive: false,
            BDId: null
        }
    }
    $scope.IsValidProductInOutType = function () {
        return true;
    }
    $scope.SaveUpdateProductInOutType = function () {
        if ($scope.IsValidProductInOutType() == true) {
            if ($scope.confirmMSG.Accept == true) {
                var saveModify = $scope.formData.Mode;
                Swal.fire({
                    title: 'Do you want to' + saveModify + 'the current data?',
                    showCancelButton: true,
                    confirmButtonText: saveModify,
                }).then((result) => {
                    if (result.isConfirmed) {
                        $scope.CallSaveUpdateProductInOutType();
                    }

                });
            }
            else
                $scope.CallSaveUpdateProductInOutType();
        }
    };
    $scope.CallSaveUpdateProductInOutType = function () {
        $scope.loadingstatus = 'running';
        showPleaseWait();

        $http({
            method: 'POST',
            url: base_url + "Inventory/Creation/SaveUpdateProductInOutType",
            headers: { 'content-Type': undefined },

            transformRequest: function (data) {
                var formData = new FormData();
                formData.append("jsonData", angular.toJson(data.jsonData));
                return formData;
            },
            data: { jsonData: $scope.formData }
        }).then(function (res) {

            $scope.loadingstatus = "stop";
            hidePleaseWait();

            Swal.fire(res.data.ResponseMSG);
            if (res.data.IsSuccess == true) {
                $scope.ClearFields();
                $scope.GetAllProductInOutType();
            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
        });
    }

    $scope.GetAllProductInOutType = function () {
        $scope.loadingstatus = 'running';
        showPleaseWait();
        $http({
            method: 'POST',
            url: base_url + "Inventory/Creation/GetAllProductInOutType",
            dataType: "json"
        }).then(function (res) {
            $scope.loadingstatus = 'stop';
            hidePleaseWait();
            if (res.data.IsSuccess && res.data.Data) {
                $scope.ProductInOutTypeColl = res.data.Data;
            } else
                Swal.fire(res.data.ResponseMSG);

        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    }

    $scope.GetProductInOutTypeById = function (beData) {

        $scope.loadingstatus = "running";
        var para = {
            TranId: beData.TranId
        };
        $http({
            method: 'POST',
            url: base_url + "Inventory/Creation/GetProductInOutTypeById",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $timeout(function () {
                    $scope.formData = res.data.Data;
                    $scope.formData.Mode = 'Modify';
                    $('#custom-tabs-four-profile-tab').tab('show');
                });
            } else
                Swal.fire(res.data.ResponseMSG);

        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    }
    $scope.deleteProductInOutType = function (refData, ind) {

        Swal.fire({
            title: 'Are you sure to delete selected ProductInOutType:-' + refData.Name,
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
                    url: base_url + "Inventory/Creation/DeleteProductInOutType",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingstatus = "stop";
                    Swal.fire(res.data.ResponseMSG);
                    if (res.data.IsSuccess) {
                        $scope.GetAllProductInOutType();
                    }

                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }
        });

    }
})