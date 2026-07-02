app.controller('LedgerCategory', function ($scope, $filter, $http, $timeout, GlobalServices) {
    $scope.Title = 'Ledger Category';
    var glSrv = GlobalServices;
    LoadData();
    function LoadData() {
        $scope.loadingstatus = "stop";
        $scope.confirmMSG = GlobalServices.getConfirmMSG();
        $scope.perPageColl = GlobalServices.getPerPageList();
        $scope.currentPages = {
            LedgerCategory: 1
        };
        $scope.searchData = {
            LedgerCategory: ''
        };
        $scope.perPage = {
            LedgerCategory: GlobalServices.getPerPageRow()
        };

        $scope.beData = {
            CategoryId: 0,
            Name: '',
            Code: '',
            Mode: 'Save'
        };
    };

    $scope.ClearFields = function () {        
        $scope.beData = {
            CategoryId: 0,
            Name: '',
            Code: '',
            Mode: 'Save'
        };
    }

    $scope.GetAllLedgerCategory = function () {


        $scope.LedgerCategoryColl = []; //declare an empty array

        if ($scope.loadingstatus != 'stop') {
            alert('Already Running Process')
            return;
        }

        $scope.loadingstatus = 'running';
        showPleaseWait();

        $http({
            method: 'POST',
            url: base_url + "Account/Creation/GetAllLedgerCategory",
            dataType: "json"
            //data:JSON.stringify(para)
        }).then(function (res) {

            $scope.loadingstatus = 'stop';
            hidePleaseWait();

            if (res.data.IsSuccess && res.data.Data) {
                $timeout(function () {
                    $scope.LedgerCategoryColl = res.data.Data;
                });
            } else
                alert(res.data.ResponseMSG);

        }, function (reason) {
            alert('Failed' + reason);
        });

    }

    $scope.IsValidLedgerCategory = function () {
        //if ($scope.newLedgerCategory.Name.isEmpty()) {
        //    Swal.fire("Please ! Enter Product Name");
        //    return false;
        //}
        return true;
    }

    $scope.SaveUpdateLedgerCategory = function () {
        if ($scope.IsValidLedgerCategory() == true) {
            if ($scope.confirmMSG.Accept == true) {
                var saveModify = $scope.beData.Mode;
                Swal.fire({
                    title: 'Do you want to' + saveModify + 'the current data?',
                    showCancelButton: true,
                    confirmButtonText: saveModify,
                }).then((result) => {
                    if (result.isConfirmed) {
                        $scope.CallSaveUpdateLedgerCategory();
                    }

                });
            }
            else
                $scope.CallSaveUpdateLedgerCategory();
        }
    };

    $scope.CallSaveUpdateLedgerCategory = function () {
        $scope.loadingstatus = 'running';
        showPleaseWait();

        $http({
            method: 'POST',
            url: base_url + "Account/Creation/SaveLedgerCategory",
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
                $scope.GetAllLedgerCategory();
            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop"
     });
    }

    $scope.getLedgerCategoryById = function (beData) {

        $scope.loadingstatus = "running";
        var para = {
            CategoryId: beData.CategoryId
        };


        $http({
            method: 'POST',
            url: base_url + "Account/Creation/GetLedgerCategoryById",
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

    $scope.deleteLedgerCategory = function (refData, ind) {
        Swal.fire({
            title: 'Are you sure to delete:-' + refData.Name,
            showCancelButton: true,
            confirmButtonText: 'Delete',
        }).then((result) => {
            if (result.isConfirmed) {
                $scope.loadiDelLedgerCategoryng
                showPleaseWait();
                var para = {
                    CategoryId: refData.CategoryId
                };
                $http({
                    method: 'POST',
                    url: base_url + "Account/Creation/DelLedgerCategory",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingstatus = "stop";
                    Swal.fire(res.data.ResponseMSG);
                    if (res.data.IsSuccess) {
                        $scope.LedgerCategoryColl.splice(ind, 1);
                    }

                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }
        });

    }

});