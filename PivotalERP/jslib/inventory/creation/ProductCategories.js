app.controller('ProductCategories', function ($scope, $filter, $http, $timeout, GlobalServices) {
    $scope.Title = 'ProductCategories';
     
    LoadData();
    function LoadData() {
        $('.select2').select2({
            allowClear: true,
            openOnEnter: true
        });
        $scope.loadingstatus = "stop";
        $scope.confirmMSG = GlobalServices.getConfirmMSG();
        $scope.perPageColl = GlobalServices.getPerPageList();


        $scope.perPage = {
            ProductCategories: GlobalServices.getPerPageRow(),

        };
        $scope.currentPages = {
            ProductCategories: 1

        };
        $scope.searchData = {
            ProductCategories: ''
        };

        $scope.newProductCategories =
        {
           
            Name: '',
            Alias: '',
            Code: '',
            ProductCategoriesId: 0,
            ParentCategoriesId: 0,
            ParentCategoriesName: ''
        }
    };
    $scope.ClearProductCategories = function () {
        $scope.newProductCategories = {
            
            Name: '',
            Alias: '',
            Code: '',
            ProductCategoriesId: 0,
            ParentCategoriesId: 0,
            ParentCategoriesName: '',
            Mode: 'Save'

        };
    }

      
        $scope.IsValidProductCategories = function () {
            if ($scope.newProductCategories.Name.isEmpty()) {
                Swal.fire("Please ! Enter Name");
                return false;
            }
            

            else
                return true;
        }

        $scope.SaveProductCategories = function () {
            if ($scope.IsValidProductCategories() == true) {
                if ($scope.confirmMSG.Accept == true) {
                    Swal.fire({
                        title: 'Do you want to' + saveModify + 'the current data?',
                        showCancelButton: true,
                        confirmButtonText: saveModify,
                    }).then((result) => {
                        if (result.isConfirmed) {
                            $scope.CallSaveUpdateProductCategories();
                        }

                    });
                }
                else
                    $scope.CallSaveUpdateProductCategories();
            }
        };

        $scope.CallSaveUpdateProductCategories = function () {
            $scope.loadingstatus = 'running';
            showPleaseWait();

            if (!$scope.newProductCategories.ParentCategoriesId)
                $scope.newProductCategories.ParentCategoriesId = 0;

            $http({
                method: 'POST',
                url: base_url + "Inventory/Creation/SaveProductCategory",
                headers: { 'content-Type': undefined },

                transformRequest: function (data) {
                    var formData = new FormData();
                    formData.append("jsonData", angular.toJson(data.jsonData));
                    return formData;
                },
                data: { jsonData: $scope.newProductCategories }
            }).then(function (res) {

                $scope.loadingstatus = "stop";
                hidePleaseWait();

                Swal.fire(res.data.ResponseMSG);
                if (res.data.IsSuccess == true) {
                    $scope.ClearProductCategories();
                    $scope.GetProductCategories();
                }
            }, function (errormessage) {
                hidePleaseWait();
                $scope.loadingstatus = "stop";
            });
    }
    $scope.GetProductCategories= function () {

        $scope.CategoriesColl = []; //declare an empty array

        if ($scope.loadingstatus != 'stop') {
            alert('Already Running Process')
            return;
        }

        $scope.loadingstatus = 'running';
        showPleaseWait();

        $http({
            method: 'GET',
            url: base_url + "Inventory/Creation/GetProductCategories",
            dataType: "json"
            //data:JSON.stringify(para)
        }).then(function (res) {

            $scope.loadingstatus = 'stop';
            hidePleaseWait();

            if (res.data.IsSuccess && res.data.Data) {
                $timeout(function () {
                    $scope.CategoriesColl = res.data.Data;
                });
            } else
                alert(res.data.ResponseMSG);

        }, function (reason) {
            alert('Failed' + reason);
        });

    }
    $scope.getProductCategoriesById = function (newProductCategories) {

        $scope.loadingstatus = "running";

        var para = {
            ProductCategoriesId: newProductCategories.ProductCategoriesId
        };

        $http({
            method: 'POST',
            url: base_url + "Inventory/Creation/getProductCategoriesById",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $timeout(function () {
                    $scope.newProductCategories = res.data.Data;
                    $scope.newProductCategories.Mode = 'Modify';
                    $('#custom-tabs-four-profile-tab').tab('show');
                });


            } else
                Swal.fire(res.data.ResponseMSG);


        }, function (reason) {
            alert('Failed' + reason);
        });
    };
    $scope.deleteProductCategories= function (refData, ind) {

        Swal.fire({
            title: 'Are you sure you want to delete ' + refData.Name + '?',
            showCancelButton: true,
            confirmButtonText: 'Delete',
            //message: 'Are you sure to delete selected Branch :-' + beData.Name,
        }).then((result) => {
            if (result.isConfirmed) {
                var para = { ProductCategoriesId: refData.ProductCategoriesId };
                $http({
                    method: 'POST',
                    url: base_url + "Inventory/Creation/deleteProductCategories",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingStatus = "stop";

                    Swal.fire(res.data.ResponseMSG);
                    if (res.data.IsSuccess == true) {
                        $scope.CategoriesColl.splice(ind, 1);
                    }
                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }

        });
    }
});