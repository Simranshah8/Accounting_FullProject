app.controller('ProductFlavour', function ($scope, $filter, $http, $timeout, GlobalServices) {
    $scope.Title = 'ProductFlavour ';
    var glSrv = GlobalServices;
    $scope.confirmMSG = GlobalServices.getConfirmMSG();
    LoadData();

    function LoadData() {
        $scope.loadingstatus = "stop";

        $scope.confirmMSG = GlobalServices.getConfirmMSG();
        $scope.perPageColl = GlobalServices.getPerPageList();

        $scope.currentPages = {
            ProductFlavour: 1

        };

        $scope.searchData = {
            ProductFlavour: ''

        };

        $scope.perPage = {
            ProductFlavour: GlobalServices.getPerPageRow(),

        };

        $scope.beData =
        {
            ProductFlavourId: 0,
            Name: '',
            Alias: '',
            Mode: 'Save',




        }
    };
    $scope.ClearProductFlavour = function () {
        $timeout(function () {
            $scope.beData = {
                ProductFlavourId: 0,
                Name: '',
                Alias: '',

                Mode: 'Save',

            };
        });
    }

    $scope.IsValidProductFlavour = function () {
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
    $scope.SaveUpdateProductFlavour = function () {
        if ($scope.IsValidProductFlavour() == true) {
            if ($scope.confirmMSG.Accept == true) {
                var saveModify = $scope.beData.Mode;
                Swal.fire({
                    title: 'Do you want to' + saveModify + 'the current data?',
                    showCancelButton: true,
                    confirmButtonText: saveModify,
                }).then((result) => {
                    if (result.isConfirmed) {
                        $scope.CallSaveUpdateProductFlavour();
                    }

                });
            }
            else
                $scope.CallSaveUpdateProductFlavour();
        }
    };

    $scope.CallSaveUpdateProductFlavour = function () {
        $scope.loadingstatus = 'running';
        showPleaseWait();

        $http({
            method: 'POST',
            url: base_url + "Inventory/Creation/SaveProductFlavour",
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
                $scope.ClearProductFlavour();
                $scope.GetAlProductFlavour();
            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
        });
    }

    $scope.GetAlProductFlavour = function () {


        $scope.ProductFlavourColl = []; //declare an empty array

        if ($scope.loadingstatus != 'stop') {
            alert('Already Running Process')
            return;
        }

        $scope.loadingstatus = 'running';
        showPleaseWait();

        $http({
            method: 'GET',
            url: base_url + "Inventory/Creation/GetProductFlavour",
            dataType: "json"
            //data:JSON.stringify(para)
        }).then(function (res) {

            $scope.loadingstatus = 'stop';
            hidePleaseWait();

            if (res.data.IsSuccess && res.data.Data) {
                $timeout(function () {
                    $scope.ProductFlavourColl = res.data.Data;
                });
            } else
                alert(res.data.ResponseMSG);

        }, function (reason) {
            alert('Failed' + reason);
        });

    }

    $scope.getProductFlavourById = function (beData) {

        $scope.loadingstatus = "running";
        var para = {
            ProductFlavourId: beData.ProductFlavourId
        };
        $http({
            method: 'POST',
            url: base_url + "Inventory/Creation/getProductFlavourById",
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

    $scope.deleteProductFlavour = function (refData, ind) {

        Swal.fire({
            title: 'Are you sure to delete selected ProductFlavour :-' + refData.Name,
            showCancelButton: true,
            confirmButtonText: 'Delete',
        }).then((result) => {
            if (result.isConfirmed) {
                $scope.loadingstatus = "running";
                showPleaseWait();

                var para = {
                    ProductFlavourId: refData.ProductFlavourId
                };

                $http({
                    method: 'POST',
                    url: base_url + "Inventory/Creation/DeleteProductFlavour",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingstatus = "stop";
                    Swal.fire(res.data.ResponseMSG);
                    if (res.data.IsSuccess) {
                        $scope.ProductFlavourColl.splice(ind, 1);
                    }

                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }
        });

    }
});