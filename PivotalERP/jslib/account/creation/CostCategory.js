app.controller("CostCategory", function ($scope, $http, GlobalServices, $timeout) {
    $scope.Title = 'Cost Category';


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
            CostCategory: GlobalServices.getPerPageRow(), 
        };

        $scope.currentPages = {
            CostCategory: 1 
        };
        $scope.searchData = {
            CostCategory: ''
        };
        $scope.beData =
        {
            CostCategoryId: 0,
            Name: '',
            Alias: '',
            Code: '',
            ParentCostCategoryId: 0,
            ParentCostCategory: '', 
        };
    };
    $scope.ClearFields = function () {
        $scope.loadingstatus = "stop";
        $scope.beData =
        {
            CostCategoryId: 0,
            Name: '',
            Alias: '',
            Code: '',
            ParentCostCategoryId: 0,
            ParentCostCategory: '',
        };

    }
      
    $scope.GetAllCostCategory = function () {

        $scope.CostCategoryColl = []; //declare an empty array

        if ($scope.loadingstatus != 'stop') {
            alert('Already Running Process')
            return;
        }

        $scope.loadingstatus = 'running';
        showPleaseWait();

        $http({
            method: 'GET',
            url: base_url + "Account/Creation/GetAllCostCategoryList",
            dataType: "json"
            //data:JSON.stringify(para)
        }).then(function (res) {

            $scope.loadingstatus = 'stop';
            hidePleaseWait();

            if (res.data.IsSuccess && res.data.Data) {
                $timeout(function () {
                    $scope.CostCategoryColl = res.data.Data;
                });
            } else
                alert(res.data.ResponseMSG);

        }, function (reason) {
            alert('Failed' + reason);
        });

    }

    $scope.IsValidCostCategory = function () {
        if ($scope.beData.Name.isEmpty()) {
            Swal.fire("Please ! Enter Valid Cost Category Name");
            return false;
        }
        else
            return true;
    }

    $scope.AddCostCategory = function () {
        if ($scope.IsValidCostCategory() == true) {
            if ($scope.confirmMSG.Accept == true) {
                var saveModify = $scope.beData.Mode;
                Swal.fire({
                    title: 'Do you want to' + saveModify + 'the current data?',
                    showCancelButton: true,
                    confirmButtonText: saveModify,
                }).then((result) => {
                    if (result.isConfirmed) {
                        $scope.CallSaveUpdateCostCategory();
                    }

                });
            }
            else
                $scope.CallSaveUpdateCostCategory();
        }
    };

    $scope.CallSaveUpdateCostCategory = function () {
        $scope.loadingstatus = 'running';
        showPleaseWait();

        $http({
            method: 'POST',
            url: base_url + "Account/Creation/SaveCostCategory",
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
                $scope.GetAllCostCategory();
            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
        });
    }
    

    $scope.getCostCategoryByIdd = function (beData) {

        $scope.loadingstatus = "running";

        var para = {
            CostCategoryId: beData.CostCategoryId
        };

        $http({
            method: 'POST',
            url: base_url + "Account/Creation/getCostCategoryById",
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
    };
    $scope.deleteCostCategory = function (refData, ind) {

        Swal.fire({
            title: 'Are you sure you want to delete ' + refData.Name + '?',
            showCancelButton: true,
            confirmButtonText: 'Delete',
            //message: 'Are you sure to delete selected Branch :-' + beData.Name,
        }).then((result) => {
            if (result.isConfirmed) {
                var para = { CostCategoryId: refData.CostCategoryId };
                $http({
                    method: 'POST',
                    url: base_url + "Account/Creation/deleteCostCategory",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingStatus = "stop";

                    Swal.fire(res.data.ResponseMSG);
                    if (res.data.IsSuccess == true) {
                        $scope.CostCategoryColl.splice(ind, 1);
                    }
                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }

        });
    }


});