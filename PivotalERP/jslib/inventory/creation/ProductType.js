app.controller('ProductType', function ($scope, $filter, $http, $timeout, GlobalServices) {
    $scope.Title = 'Product Type';
    var glSrv = GlobalServices;


    LoadData();

    function LoadData() {

        $scope.loadingstatus = "stop";

        $scope.confirmMSG = GlobalServices.getConfirmMSG();
        $scope.perPageColl = GlobalServices.getPerPageList();


        $scope.currentPages = {
            ProductType: 1

        };

        $scope.searchData = {
            ProductType: ''

        };

        $scope.perPage = {
            ProductType: GlobalServices.getPerPageRow(),

        };

        $scope.beData =
        {
            Alias: '',
            AutoNumber: 0,
            Name: '',
            Alias: '',
            IsServiceType: false,
            AgeDays: 0,
            Mode: 'Save',
            ProductTypeId: 0,
            TypeOfProduct:1
        }

        $scope.TypeOfProductColl = [];
        $http({
            method: 'GET',
            url: base_url + "Global/GetProductTypes",
            dataType: "json",
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.TypeOfProductColl = res.data.Data;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

    };

    $scope.ClearFields = function () {
        $scope.loadingstatus = "stop";

        $scope.newMaster = {
            TranId: 0
        };
        $scope.beData =
        { 
            Alias: '',
            AutoNumber: 0,
            Name: '',
            Alias: '',
            IsServiceType: false,
            AgeDays: 0,
            Mode: 'Save',
            ProductTypeId:0,
            TypeOfProduct:1
        };
        $('#txtName').focus();
    }

    $scope.GetAllProductType = function () {


        $scope.ProductTypeColl = []; //declare an empty array

        if ($scope.loadingstatus != 'stop') {
            alert('Already Running Process')
            return;
        }

        $scope.loadingstatus = 'running';
        showPleaseWait();

        $http({
            method: 'GET',
            url: base_url + "Inventory/Creation/GetAllProductType",
            dataType: "json"
            //data:JSON.stringify(para)
        }).then(function (res) {

            $scope.loadingstatus = 'stop';
            hidePleaseWait();

            if (res.data.IsSuccess && res.data.Data) {
                $timeout(function () {
                    $scope.ProductTypeColl = res.data.Data;
                });
            } else
                alert(res.data.ResponseMSG);

        }, function (reason) {
            alert('Failed' + reason);
        });

    }

    $scope.IsValidProductType = function () {
        if ($scope.beData.Name.isEmpty()) {
            Swal.fire("Please ! Enter  Name");
            return false;
        }
        //else
        return true;
    }

    $scope.SaveUpdateProductType = function () {
        if ($scope.IsValidProductType() == true) {
            if ($scope.confirmMSG.Accept == true) {
                var saveModify = $scope.beData.Mode;
                Swal.fire({
                    title: 'Do you want to' + saveModify + 'the current data?',
                    showCancelButton: true,
                    confirmButtonText: saveModify,
                }).then((result) => {
                    if (result.isConfirmed) {
                        $scope.CallSaveUpdateProductType();
                    }

                });
            }
            else
                $scope.CallSaveUpdateProductType();
        }
    };

    $scope.CallSaveUpdateProductType = function () {
        $scope.loadingstatus = 'running';
        showPleaseWait();

        $http({
            method: 'POST',
            url: base_url + "Inventory/Creation/SaveProductType",
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
                $scope.GetAllProductType();
            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
        });
    }

    $scope.getProductTypeById = function (beData) {

        $scope.loadingstatus = "running";
        var para = {
            ProductTypeId: beData.ProductTypeId
        };

        $scope.newMaster = {
            TranId: beData.ProductTypeId
        };
        $http({
            method: 'POST',
            url: base_url + "Inventory/Creation/getProductTypeById",
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

    $scope.deleteProductType= function (refData, ind) {

        Swal.fire({
            title: 'Are you sure to delete selected Product Type:-' + refData.Name,
            showCancelButton: true,
            confirmButtonText: 'Delete',
        }).then((result) => {
            if (result.isConfirmed) {
                $scope.loadingstatus = "running";
                showPleaseWait();

                var para = {
                    ProductTypeId: refData.ProductTypeId
                };

                $http({
                    method: 'POST',
                    url: base_url + "Inventory/Creation/DeleteProductType",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingstatus = "stop";
                    Swal.fire(res.data.ResponseMSG);
                    if (res.data.IsSuccess) {
                        $scope.ProductTypeColl.splice(ind, 1);
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