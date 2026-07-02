app.controller('CategoryController', function ($scope, $http, $timeout, $filter, GlobalServices) {
    $scope.Title = 'Category';

    LoadData();

    function LoadData() {
        $('.select2').select2();
        $scope.confirmMSG = GlobalServices.getConfirmMSG();
        $scope.perPageColl = GlobalServices.getPerPageList();
        $scope.currentPages = {
            Category: 1,
        };

        $scope.searchData = {
            Category: '',

        };

        $scope.perPage = {
            Category: GlobalServices.getPerPageRow()
        };


        $scope.newDet = {
            CategoryId: null,
            Name: '',
            OrderNo: null,
            Code: '',
            Mode: 'Save'
        };

        //$scope.GetAllCategory();

    };

    $scope.ClearCategory = function () {
        $scope.newDet = {
            CategoryId: null,
            Name: '',
            OrderNo: null,
            Code: '',
            Mode: 'Save'
        };
    }




    //************************* Category *********************************
    $scope.IsValidCategory = function () {
        /*if ($scope.newBaliType.GenderName.isEmpty()) {
            Swal.fire('Please ! Enter GenderName Name');
            return false;
        }*/
        return true;
    }

    $scope.SaveCategory = function () {
        if ($scope.IsValidCategory() == true) {
            if ($scope.confirmMSG.Accept == true) {
                var saveModify = $scope.newDet.Mode;
                Swal.fire({
                    title: 'Do you want to ' + saveModify + ' the current data?',
                    showCancelButton: true,
                    confirmButtonText: saveModify,
                }).then((result) => {
                    /* Read more about isConfirmed, isDenied below */
                    if (result.isConfirmed) {
                        $scope.CallSaveUpdateCategory();
                    }
                });
            } else
                $scope.CallSaveUpdateCategory();
        }
    };

    $scope.CallSaveUpdateCategory = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();
        $http({
            method: 'POST',
            url: base_url + "Payroll/Master/SaveCategory",
            headers: { 'Content-Type': undefined },
            transformRequest: function (data) {
                var formData = new FormData();
                formData.append("jsonData", angular.toJson(data.jsonData));
                return formData;
            },
            data: { jsonData: $scope.newDet }
        }).then(function (res) {
            $scope.loadingstatus = "stop";
            hidePleaseWait();
            Swal.fire(res.data.ResponseMSG);
            if (res.data.IsSuccess == true) {
                $scope.ClearCategory();
                $scope.GetAllCategory();
            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
        });
    }



    $scope.GetAllCategory = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();
        $scope.CategoryList = [];
        $http({
            method: 'GET',
            url: base_url + "Payroll/Master/GetAllCategory",
            dataType: "json"
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.CategoryList = res.data.Data;
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    }

    $scope.getCategoryById = function (refData) {
        $scope.loadingstatus = "running";
        showPleaseWait();
        var para = {
            CategoryId: refData.CategoryId
        };
        $http({
            method: 'POST',
            url: base_url + "Payroll/Master/getCategoryById",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.newDet = res.data.Data;
                $scope.newDet.Mode = 'Modify';
                $('#custom-tabs-four-profile-tab').tab('show');


            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    };



    $scope.DelCategoryById = function (refData, ind) {
        Swal.fire({
            title: 'Do you want to delete ' + refData.Name + '?',
            showCancelButton: true,
            confirmButtonText: 'Delete',
            //message: 'Are you sure to delete selected BaliType :-' + beData.Name,
        }).then((result) => {
            if (result.isConfirmed) {
                var para = {
                    CategoryId: refData.CategoryId
                };
                $http({
                    method: 'POST',
                    url: base_url + "Payroll/Master/DeleteCategory",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingStatus = "stop";

                    Swal.fire(res.data.ResponseMSG);
                    if (res.data.IsSuccess == true) {
                        $scope.GetAllCategory();
                    }
                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }

        });
    }





});