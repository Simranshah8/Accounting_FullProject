app.controller('ProductDivision', function ($scope, $filter, $http, $timeout, GlobalServices) {
    $scope.Title = 'Product Brand';
    var glSrv = GlobalServices;


    LoadData();

    function LoadData() {

        $scope.loadingstatus = "stop";

        $scope.confirmMSG = GlobalServices.getConfirmMSG();
        $scope.perPageColl = GlobalServices.getPerPageList();


        $scope.currentPages = {
            ProductDivision: 1

        };

        $scope.searchData = {
            ProductDivision: ''

        };

        $scope.perPage = {
            ProductDivision: GlobalServices.getPerPageRow(),

        };

        $scope.beData =
        {
            Name: '',
            Alias: '',
            Mode: 'Save',
            ProductDivisionId: 0

        }
    };

    $scope.ClearFields = function () {
        $scope.loadingstatus = "stop";
        $scope.beData =
        {
            Name: '',
            Alias: '',
            Mode: 'Save',
            ProductDivisionId: 0

        };
        /*$('#txtName').focus();*/
    }

    $scope.GetAllProductDivision = function () {


        $scope.ProductDivisionColl = []; //declare an empty array

        if ($scope.loadingstatus != 'stop') {
            alert('Already Running Process')
            return;
        }

        $scope.loadingstatus = 'running';
        showPleaseWait();

        $http({
            method: 'GET',
            url: base_url + "Inventory/Creation/GetAllProductDivision",
            dataType: "json"
            //data:JSON.stringify(para)
        }).then(function (res) {

            $scope.loadingstatus = 'stop';
            hidePleaseWait();

            if (res.data.IsSuccess && res.data.Data) {
                $timeout(function () {
                    $scope.ProductDivisionColl = res.data.Data;
                });
            } else
                alert(res.data.ResponseMSG);

        }, function (reason) {
            alert('Failed' + reason);
        });

    }

    $scope.IsValidProductDivision = function () {
        //if ($scope.newProductDivision.Name.isEmpty()) {
        //    Swal.fire("Please ! Enter Product Name");
        //    return false;
        //}
        //else
        return true;
    }

    $scope.SaveUpdateProductDivision= function () {
        if ($scope.IsValidProductDivision() == true) {
            if ($scope.confirmMSG.Accept == true) {
                var saveModify = $scope.beData.Mode;
                Swal.fire({
                    title: 'Do you want to' + saveModify + 'the current data?',
                    showCancelButton: true,
                    confirmButtonText: saveModify,
                }).then((result) => {
                    if (result.isConfirmed) {
                        $scope.CallSaveUpdateProductDivision();
                    }

                });
            }
            else
                $scope.CallSaveUpdateProductDivision();
        }
    };

    $scope.CallSaveUpdateProductDivision= function () {
        $scope.loadingstatus = 'running';
        showPleaseWait();

        $http({
            method: 'POST',
            url: base_url + "Inventory/Creation/SaveProductDivision",
            headers: { 'content-Type': undefined },

            transformRequest: function (data) {
                var formData = new FormData();
                formData.append("jsonData", angular.toJson(data.jsonData));
                return formData;
            },
            data: { jsonData: $scope.beData}
        }).then(function (res) {

            $scope.loadingstatus = "stop";
            hidePleaseWait();

            Swal.fire(res.data.ResponseMSG);
            if (res.data.IsSuccess == true) {
                $scope.ClearFields();
                $scope.GetAllProductDivision();
            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
        });
    }

    $scope.getProductDivisionById = function (beData) {

        $scope.loadingstatus = "running";
        var para = {
            ProductDivisionId: beData.ProductDivisionId
        };
        $http({
            method: 'POST',
            url: base_url + "Inventory/Creation/getProductDivisionById",
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

    $scope.deleteProductDivision = function (refData, ind) {

        Swal.fire({
            title: 'Are you sure to delete selected Product Division:-' + refData.Name,
            showCancelButton: true,
            confirmButtonText: 'Delete',
        }).then((result) => {
            if (result.isConfirmed) {
                $scope.loadingstatus = "running";
                showPleaseWait();

                var para = {
                    ProductDivisionId: refData.ProductDivisionId
                };

                $http({
                    method: 'POST',
                    url: base_url + "Inventory/Creation/DeleteProductDivision",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingstatus = "stop";
                    Swal.fire(res.data.ResponseMSG);
                    if (res.data.IsSuccess) {
                        $scope.ProductDivisionColl.splice(ind, 1);
                    }

                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }
        });

    }
});