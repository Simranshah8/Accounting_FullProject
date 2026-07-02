app.controller('ProductColor', function ($scope, $filter, $http, $timeout, GlobalServices) {
    $scope.Title = 'Product Color';
    var glSrv = GlobalServices;
    $scope.confirmMSG = GlobalServices.getConfirmMSG();
    LoadData();

    function LoadData() {
        $scope.loadingstatus = "stop";

        $scope.confirmMSG = GlobalServices.getConfirmMSG();
        $scope.perPageColl = GlobalServices.getPerPageList();

        $scope.currentPages = {
            ProductColor: 1

        };

        $scope.searchData = {
            ProductColor: ''

        };

        $scope.perPage = {
            ProductColor: GlobalServices.getPerPageRow(),

        };

        $scope.beData =
        {
            ProductColorId:0,
            Name: '',
            Alias: '',
            Mode: 'Save',




        }
    };
        $scope.ClearProductColor = function () {
            $timeout(function () {
                $scope.beData = {
                    ProductColorId:0,
                    Name: '',
                    Alias: '',

                    Mode: 'Save',

                };
            });
        }
    
    $scope.IsValidProductColor = function () {
        if ($scope.beData.Name.isEmpty()) {
            Swal.fire("Please Enter Name");
            return false;
        }
        if ($scope.beData.Alias.isEmpty()) {
            Swal.fire("Please Enter Alias");
            return false;
        }
        return true;
    }
    $scope.SaveUpdateProductColor = function () {
        if ($scope.IsValidProductColor() == true) {
            if ($scope.confirmMSG.Accept == true) {
                var saveModify = $scope.beData.Mode;
                Swal.fire({
                    title: 'Do you want to' + saveModify + 'the current data?',
                    showCancelButton: true,
                    confirmButtonText: saveModify,
                }).then((result) => {
                    if (result.isConfirmed) {
                        $scope.CallSaveUpdateProductColor();
                    }

                });
            }
            else
                $scope.CallSaveUpdateProductColor();
        }
    };

    $scope.CallSaveUpdateProductColor = function () {
        $scope.loadingstatus = 'running';
        showPleaseWait();

        $http({
            method: 'POST',
            url: base_url + "Inventory/Creation/SaveProductColor",
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
                $scope.ClearProductColor();
                $scope.GetAllProductColor();
            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
        });
    }

    $scope.GetAllProductColor = function () {


        $scope.ProductColorColl = []; //declare an empty array

        if ($scope.loadingstatus != 'stop') {
            alert('Already Running Process')
            return;
        }

        $scope.loadingstatus = 'running';
        showPleaseWait();

        $http({
            method: 'GET',
            url: base_url + "Inventory/Creation/GetProductColor",
            dataType: "json"
            //data:JSON.stringify(para)
        }).then(function (res) {

            $scope.loadingstatus = 'stop';
            hidePleaseWait();

            if (res.data.IsSuccess && res.data.Data) {
                $timeout(function () {
                    $scope.ProductColorColl = res.data.Data;
                });
            } else
                alert(res.data.ResponseMSG);

        }, function (reason) {
            alert('Failed' + reason);
        });

    }

    $scope.getProductColorById = function (beData) {

        $scope.loadingstatus = "running";
        var para = {
            ProductColorId: beData.ProductColorId
        };
        $http({
            method: 'POST',
            url: base_url + "Inventory/Creation/getProductColorById",
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

    $scope.deleteProductColor = function (refData, ind) {

        Swal.fire({
            title: 'Are you sure to delete selected ProductColor :-' + refData.Name,
            showCancelButton: true,
            confirmButtonText: 'Delete',
        }).then((result) => {
            if (result.isConfirmed) {
                $scope.loadingstatus = "running";
                showPleaseWait();

                var para = {
                    ProductColorId: refData.ProductColorId
                };

                $http({
                    method: 'POST',
                    url: base_url + "Inventory/Creation/DeleteProductColor",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingstatus = "stop";
                    Swal.fire(res.data.ResponseMSG);
                    if (res.data.IsSuccess) {
                        $scope.ProductColorColl.splice(ind, 1);
                    }

                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }
        });

    }
});