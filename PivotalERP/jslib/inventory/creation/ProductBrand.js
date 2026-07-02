app.controller('ProductBrand', function ($scope, $filter, $http, $timeout, GlobalServices) {
    $scope.Title = 'Product Brand';
    var glSrv = GlobalServices;


    LoadData();

    function LoadData() {
    
        $scope.loadingstatus = "stop";

        $scope.confirmMSG = GlobalServices.getConfirmMSG();
        $scope.perPageColl = GlobalServices.getPerPageList();


        $scope.currentPages = {
            ProductBrand: 1

        };

        $scope.searchData = {
            ProductBrand: ''

        };

        $scope.perPage = {
            DebtorsCreditorsType: GlobalServices.getPerPageRow(),

        };

        $scope.beData=
        {
            SNo: 0,
            Name: '',
            Alias: '',
            Mode: 'Save',
            ProductBrandId:0,

        }
    };

    $scope.ClearFields = function () {
        $scope.loadingstatus = "stop";

        $scope.newMaster = {
            TranId: 0
        };

        $scope.beData =
        {
            SNo: 0,
            Name: '',
            Alias: '',
            Mode: 'Save',
            ProductBrandId:0

        };
        $('#txtName').focus();
    }

    $scope.GetAllProductBrand= function () {


        $scope.ProductBrandColl= []; //declare an empty array

        if ($scope.loadingstatus != 'stop') {
            alert('Already Running Process')
            return;
        }

        $scope.loadingstatus = 'running';
        showPleaseWait();

        $http({
            method: 'GET',
            url: base_url + "Inventory/Creation/GetAllProductBrand",
            dataType: "json"
            //data:JSON.stringify(para)
        }).then(function (res) {

            $scope.loadingstatus = 'stop';
            hidePleaseWait();

            if (res.data.IsSuccess && res.data.Data) {
                $timeout(function () {
                    $scope.ProductBrandColl = res.data.Data;
                });
            } else
                alert(res.data.ResponseMSG);

        }, function (reason) {
            alert('Failed' + reason);
        });

    }

    $scope.IsValidProductBrand= function () {
        //if ($scope.newProductBrand.Name.isEmpty()) {
        //    Swal.fire("Please ! Enter Product Name");
        //    return false;
        //}
        //else
            return true;
    }

    $scope.SaveUpdateProductBrand= function () {
        if ($scope.IsValidProductBrand() == true) {
            if ($scope.confirmMSG.Accept == true) {
                var saveModify = $scope.beData.Mode;
                Swal.fire({
                    title: 'Do you want to' + saveModify + 'the current data?',
                    showCancelButton: true,
                    confirmButtonText: saveModify,
                }).then((result) => {
                    if (result.isConfirmed) {
                        $scope.CallSaveUpdateProductBrand();
                    }

                });
            }
            else
                $scope.CallSaveUpdateProductBrand();
        }
    };

    $scope.CallSaveUpdateProductBrand= function () {
        $scope.loadingstatus = 'running';
        showPleaseWait();

        $http({
            method: 'POST',
            url: base_url + "Inventory/Creation/SaveProductBrand",
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
                $scope.ClearFields();
                $scope.GetAllProductBrand();
            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
        });
    }

    $scope.getProductBrandById = function (beData) {

        $scope.loadingstatus = "running";
        var para = {
            ProductBrandId: beData.ProductBrandId
        };

        $scope.newMaster = {
            TranId: beData.ProductBrandId
        };

        $http({
            method: 'POST',
            url: base_url + "Inventory/Creation/getProductBrandById",
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

    $scope.deleteProductBrand = function (refData, ind) {

        Swal.fire({
            title: 'Are you sure to delete selected Product Brand:-' + refData.Name,
            showCancelButton: true,
            confirmButtonText: 'Delete',
        }).then((result) => {
            if (result.isConfirmed) {
                $scope.loadingstatus = "running";
                showPleaseWait();

                var para = {
                    ProductBrandId: refData.ProductBrandId
                };

                $http({
                    method: 'POST',
                    url: base_url + "Inventory/Creation/DeleteProductBrand",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingstatus = "stop";
                    Swal.fire(res.data.ResponseMSG);
                    if (res.data.IsSuccess) {
                        $scope.ProductBrandColl.splice(ind, 1);
                    }

                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }
        });

    }

    $scope.AuditLogColl = [];
    $scope.ShowAuditLog = function () {

        $scope.AuditLogColl = {};
        if ($scope.newMaster.TranId > 0) {

            $scope.loadingstatus = "running";
            showPleaseWait();

            GlobalServices.getAuditLog(EntityId, $scope.newMaster.TranId).then(function (res1) {
                $scope.loadingstatus = "stop";
                hidePleaseWait();
                if (res1.data.IsSuccess && res1.data.Data) {
                    $scope.AuditLogColl = res1.data.Data;
                    $('#frmAuditHis').modal('show');
                }
            }, function (reason) {
                Swal.fire('Failed' + reason);
            });

        }
    }
});