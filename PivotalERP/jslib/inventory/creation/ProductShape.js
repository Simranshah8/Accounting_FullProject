app.controller('ProductShape', function ($scope, $filter, $http, $timeout, GlobalServices) {
    $scope.Title = 'ProductShape';
    var glSrv = GlobalServices;
    $scope.confirmMSG = GlobalServices.getConfirmMSG();
    LoadData();

    function LoadData() {
        $scope.loadingstatus = "stop";

        $scope.confirmMSG = GlobalServices.getConfirmMSG();
        $scope.perPageColl = GlobalServices.getPerPageList();

        $scope.currentPages = {
            ProductShape: 1

        };

        $scope.searchData = {
            ProductShape: ''
        };

        $scope.perPage = {
            ProductShape: GlobalServices.getPerPageRow(),

        };

        $scope.beData =
        {
            ProductShapeTypeId: 0,
            Name: '',
            Alias: '',
            Mode: 'Save'




        }
    };
    $scope.ClearProductShape = function () {
        $timeout(function () {
            $scope.beData = {
               ProductShapeTypeId: 0,
                Name: '',
                Alias: '',

                Mode: 'Save'

            };
        });
    }

    $scope.IsValidProductShape = function () {
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
    $scope.SaveUpdateProductShape = function () {
        if ($scope.IsValidProductShape() == true) {
            if ($scope.confirmMSG.Accept == true) {
                var saveModify = $scope.beData.Mode;
                Swal.fire({
                    title: 'Do you want to' + saveModify + 'the current data?',
                    showCancelButton: true,
                    confirmButtonText: saveModify,
                }).then((result) => {
                    if (result.isConfirmed) {
                        $scope.CallSaveUpdateProductShape();
                    }

                });
            }
            else
                $scope.CallSaveUpdateProductShape();
        }
    };

    $scope.CallSaveUpdateProductShape = function () {
        $scope.loadingstatus = 'running';
        showPleaseWait();

        $http({
            method: 'POST',
            url: base_url + "Inventory/Creation/SaveProductShape",
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
                $scope.ClearProductShape();
                $scope.GetAlProductShape();
            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
        });
    }

    $scope.GetAlProductShape = function () {


        $scope.ProductShapeColl = []; //declare an empty array

        if ($scope.loadingstatus != 'stop') {
            alert('Already Running Process')
            return;
        }

        $scope.loadingstatus = 'running';
        showPleaseWait();

        $http({
            method: 'GET',
            url: base_url + "Inventory/Creation/GetProductShape",
            dataType: "json"
            //data:JSON.stringify(para)
        }).then(function (res) {

            $scope.loadingstatus = 'stop';
            hidePleaseWait();

            if (res.data.IsSuccess && res.data.Data) {
                $timeout(function () {
                    $scope.ProductShapeColl = res.data.Data;
                });
            } else
                alert(res.data.ResponseMSG);

        }, function (reason) {
            alert('Failed' + reason);
        });

    }

    $scope.getProductShapeById = function (beData) {

        $scope.loadingstatus = "running";
        var para = {
            ProductShapeId: beData.ProductShapeId
        };
        $http({
            method: 'POST',
            url: base_url + "Inventory/Creation/getProductShapeById",
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

    $scope.deleteProductShape = function (refData, ind) {

        Swal.fire({
            title: 'Are you sure to delete selected ProductShape :-' + refData.Name,
            showCancelButton: true,
            confirmButtonText: 'Delete',
        }).then((result) => {
            if (result.isConfirmed) {
                $scope.loadingstatus = "running";
                showPleaseWait();

                var para = {
                    ProductShapeId: refData.ProductShapeId
                };

                $http({
                    method: 'POST',
                    url: base_url + "Inventory/Creation/DeleteProductShape",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingstatus = "stop";
                    Swal.fire(res.data.ResponseMSG);
                    if (res.data.IsSuccess) {
                        $scope.ProductShapeColl.splice(ind, 1);
                    }

                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }
        });

    }
});