app.controller('ProductCompany', function ($scope, $filter, $http, $timeout, GlobalServices) {
    $scope.Title = 'ProductCompany';
   
    LoadData();
    function LoadData() {

        $scope.loadingstatus = "stop";
        $scope.confirmMSG = GlobalServices.getConfirmMSG();
        $scope.perPageColl = GlobalServices.getPerPageList();

        $scope.perPage = {
            ProductCompany: GlobalServices.getPerPageRow(),

        };
        $scope.currentPages = {
            ProductCompany: 1

        };
        $scope.searchData = {
            ProductCompany: ''
        };

        $scope.newProductCompany =
        {
            SNo: 0,
            Name: '',
            Code: '',
            Address: '',
            ProductCompanyId: 0,
            ContactPerson: '',
            PhoneNo: '',
            Email: '',
            Website: '',
        }
    };
    $scope.ClearProductCompany = function () {
        $scope.loadingstatus = "stop";
            $scope.newProductCompany = {
                SNo: null,
                Name: '',
                Code: '',
                Address: '',
                ContactPerson: '',
                ProductCompanyId: 0,
                PhoneNo: '',
                Email: '',
                Website: '',
                Mode: 'Save' 
            };
    }

    $scope.IsValidProductCompany = function () {
        if ($scope.newProductCompany.Name.isEmpty()) {
            Swal.fire("Please ! Enter the Name of Company");
            return false;
        }
        if ($scope.newProductCompany.Address.isEmpty()) {
            Swal.fire("Please ! Enter Address of Company");
            return false;
        }

        else
            return true;
    }

    $scope.SaveProductCompany = function () {
        if ($scope.IsValidProductCompany() == true) {
            if ($scope.confirmMSG.Accept == true) {
                Swal.fire({
                    title: 'Do you want to' + saveModify + 'the current data?',
                    showCancelButton: true,
                    confirmButtonText: saveModify,
                }).then((result) => {
                    if (result.isConfirmed) {
                        $scope.CallSaveUpdateProductCompany();
                    }

                });
            }
            else
                $scope.CallSaveUpdateProductCompany();
        }
    };

    $scope.CallSaveUpdateProductCompany = function () {
        $scope.loadingstatus = 'running';
        showPleaseWait();

        $http({
            method: 'POST',
            url: base_url + "Inventory/Creation/SaveProductCompany",
            headers: { 'content-Type': undefined },

            transformRequest: function (data) {
                var formData = new FormData();
                formData.append("jsonData", angular.toJson(data.jsonData));
                return formData;
            },
            data: { jsonData: $scope.newProductCompany }
        }).then(function (res) {

            $scope.loadingstatus = "stop";
            hidePleaseWait();

            Swal.fire(res.data.ResponseMSG);
            if (res.data.IsSuccess == true) {
                $scope.ClearProductCompany();
                $scope.GetProductCompany();
            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
        });
    }

    $scope.GetProductCompany = function () {

        $scope.CompanyColl = []; //declare an empty array

        if ($scope.loadingstatus != 'stop') {
            alert('Already Running Process')
            return;
        }

        $scope.loadingstatus = 'running';
        showPleaseWait();

        $http({
            method: 'GET',
            url: base_url + "Inventory/Creation/GetAllProductCompany",
            dataType: "json"
            //data:JSON.stringify(para)
        }).then(function (res) {

            $scope.loadingstatus = 'stop';
            hidePleaseWait();

            if (res.data.IsSuccess && res.data.Data) {
                $timeout(function () {
                    $scope.CompanyColl = res.data.Data;
                });
            } else
                alert(res.data.ResponseMSG);

        }, function (reason) {
            alert('Failed' + reason);
        });

    }
    $scope.getProductCompanyById = function (newProductCompany) {

        $scope.loadingstatus = "running";

        var para = {
            ProductCompanyId: newProductCompany.ProductCompanyId
        };

        $http({
            method: 'POST',
            url: base_url + "Inventory/Creation/getProductCompanyById",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $timeout(function () {
                    $scope.newProductCompany = res.data.Data;
                    $scope.newProductCompany.Mode = 'Modify';
                    $('#custom-tabs-four-profile-tab').tab('show');
                });


            } else
                Swal.fire(res.data.ResponseMSG);


        }, function (reason) {
            alert('Failed' + reason);
        });
    };
    $scope.deleteProductCompany = function (refData, ind) {

        Swal.fire({
            title: 'Are you sure you want to delete ' + refData.Name + '?',
            showCancelButton: true,
            confirmButtonText: 'Delete',
            //message: 'Are you sure to delete selected Branch :-' + beData.Name,
        }).then((result) => {
            if (result.isConfirmed) {
                var para = { ProductCompanyId: refData.ProductCompanyId };
                $http({
                    method: 'POST',
                    url: base_url + "Inventory/Creation/deleteProductCompany",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingStatus = "stop";

                    Swal.fire(res.data.ResponseMSG);
                    if (res.data.IsSuccess == true) {
                        $scope.CompanyColl.splice(ind, 1);
                    }
                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }

        });
    }
});