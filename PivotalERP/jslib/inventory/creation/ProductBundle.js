app.controller('Bundle', function ($scope, $filter, $http, $timeout, GlobalServices) {
    $scope.Title = 'Product Bundle';

    LoadData();
    function LoadData() {

        $scope.loadingstatus = "stop";
        $scope.confirmMSG = GlobalServices.getConfirmMSG();
        $scope.perPageColl = GlobalServices.getPerPageList();

        $scope.perPage = {
            ProductBundle: GlobalServices.getPerPageRow(),

        };

        $scope.currentPages = {
            ProductBundle: 1

        };
        $scope.searchData = {
            ProductBundle: ''
        };
        $scope.newBundle =
        {
            SNo: 0,
            Name: '',
            Description: '',
            BundleId: 0,           
            Mode: 'Save'
        }
    };
    $scope.ClearBundle = function () {
        $scope.loadingstatus = "stop";
        $scope.newBundle = {
            SNo: 0,
            Name: '',
            Description: '',
            BundleId: 0,
            Mode: 'Save'

        };
    }

    $scope.IsValidBundle = function () {
        if ($scope.newBundle.Name.isEmpty()) {
            Swal.fire("Please ! Enter Bundle Name");
            return false;
        }
        else
            return true;
    }

    $scope.SaveUpdateBundle = function () {
        if ($scope.IsValidBundle() == true) {
            if ($scope.confirmMSG.Accept == true) {
                var saveModify = $scope.newBundle.Mode;
                Swal.fire({
                    title: 'Do you want to' + saveModify + 'the current data?',
                    showCancelButton: true,
                    confirmButtonText: saveModify,
                }).then((result) => {
                    if (result.isConfirmed) {
                        $scope.CallSaveUpdateBundle();
                    }

                });
            }
            else
                $scope.CallSaveUpdateBundle();
        }
    };

    $scope.CallSaveUpdateBundle = function () {
        $scope.loadingstatus = 'running';
        showPleaseWait();

        $http({
            method: 'POST',
            url: base_url + "Inventory/Creation/SaveBundle",
            headers: { 'content-Type': undefined },

            transformRequest: function (data) {
                var formData = new FormData();
                formData.append("jsonData", angular.toJson(data.jsonData));
                return formData;
            },
            data: { jsonData: $scope.newBundle }
        }).then(function (res) {

            $scope.loadingstatus = "stop";
            hidePleaseWait();

            Swal.fire(res.data.ResponseMSG);
            if (res.data.IsSuccess == true) {
                $scope.ClearBundle();
                $scope.GetAllBundle();
            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
        });
    }

    $scope.GetAllBundle = function () {

        $scope.BundleColl = []; //declare an empty array

        if ($scope.loadingstatus != 'stop') {
            alert('Already Running Process')
            return;
        }

        $scope.loadingstatus = 'running';
        showPleaseWait();

        $http({
            method: 'GET',
            url: base_url + "Inventory/Creation/GetAllBundle",
            dataType: "json"
            //data:JSON.stringify(para)
        }).then(function (res) {

            $scope.loadingstatus = 'stop';
            hidePleaseWait();

            if (res.data.IsSuccess && res.data.Data) {
                $timeout(function () {
                    $scope.BundleColl = res.data.Data;
                });
            } else
                alert(res.data.ResponseMSG);

        }, function (reason) {
            alert('Failed' + reason);
        });

    }
    $scope.getBundleByIdd = function (newBundle) {

        $scope.loadingstatus = "running";

        var para = {
            BundleId: newBundle.BundleId
        };

        $http({
            method: 'POST',
            url: base_url + "Inventory/Creation/getBundleById",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $timeout(function () {
                    $scope.newBundle = res.data.Data;
                    $scope.newBundle.Mode = 'Modify';
                    $('#custom-tabs-four-profile-tab').tab('show');
                });


            } else
                Swal.fire(res.data.ResponseMSG);


        }, function (reason) {
            alert('Failed' + reason);
        });
    };
    $scope.deleteBundle = function (refData, ind) {

        Swal.fire({
            title: 'Are you sure you want to delete ' + refData.Name + '?',
            showCancelButton: true,
            confirmButtonText: 'Delete',
            //message: 'Are you sure to delete selected Branch :-' + beData.Name,
        }).then((result) => {
            if (result.isConfirmed) {
                var para = { BundleId: refData.BundleId };
                $http({
                    method: 'POST',
                    url: base_url + "Inventory/Creation/deleteBundle",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingStatus = "stop";

                    Swal.fire(res.data.ResponseMSG);
                    if (res.data.IsSuccess == true) {
                        $scope.BundleColl.splice(ind, 1);
                    }
                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }

        });
    }

});