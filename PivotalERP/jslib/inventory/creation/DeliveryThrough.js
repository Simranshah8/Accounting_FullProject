app.controller('DeliveryThroughController', function ($scope, $http, $timeout, $filter, GlobalServices) {
    $scope.Title = 'DeliveryThrough';

    OnClickDefault();

    $scope.LoadData = function () {
        $('.select2').select2();
        $scope.confirmMSG = GlobalServices.getConfirmMSG();
        $scope.perPageColl = GlobalServices.getPerPageList();
        $scope.currentPages = {
            DeliveryThrough: 1,
        };

        $scope.searchData = {
            DeliveryThrough: '',

        };

        $scope.perPage = {
            DeliveryThrough: GlobalServices.getPerPageRow()
        };


        $scope.newDet = {
            DeliveryThroughId: null,
            Name: '',
            OrderNum: null,
            Code: '',
            Mode: 'Save'
        };

        $scope.GetAllDeliveryThrough();

    };

    $scope.ClearDeliveryThrough = function () {
        $scope.newDet = {
            DeliveryThroughId: null,
            Name: '',
            Alias: '',
            Code: '',
            Mode: 'Save'
        };
    }


    //Show hide jf for Employee Profile

    function OnClickDefault() {
        /*  show or hide Employee Profile*/

        document.getElementById('deliveryThrough-form').style.display = "none";

        document.getElementById('add-deliveryThrough-details').onclick = function () {
            document.getElementById('deliveryThrough-section').style.display = "none";
            document.getElementById('deliveryThrough-form').style.display = "block";
        }
        document.getElementById('back-to-deliveryThrough-list').onclick = function () {
            document.getElementById('deliveryThrough-form').style.display = "none";
            document.getElementById('deliveryThrough-section').style.display = "block";
        }


    };



    //************************* BaliType *********************************
    $scope.IsValidDeliveryThrough = function () {
        /*if ($scope.newBaliType.GenderName.isEmpty()) {
            Swal.fire('Please ! Enter GenderName Name');
            return false;
        }*/
        return true;
    }

    $scope.SaveDeliveryThrough = function () {
        if ($scope.IsValidDeliveryThrough() == true) {
            if ($scope.confirmMSG.Accept == true) {
                var saveModify = $scope.newDet.Mode;
                Swal.fire({
                    title: 'Do you want to ' + saveModify + ' the current data?',
                    showCancelButton: true,
                    confirmButtonText: saveModify,
                }).then((result) => {
                    /* Read more about isConfirmed, isDenied below */
                    if (result.isConfirmed) {
                        $scope.CallSaveUpdateDeliveryThrough();
                    }
                });
            } else
                $scope.CallSaveUpdateDeliveryThrough();
        }
    };

    $scope.CallSaveUpdateDeliveryThrough = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();
        $http({
            method: 'POST',
            url: base_url + "inventory/creation/SaveDeliveryThrough",
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
                $scope.ClearDeliveryThrough();
                $scope.GetAllDeliveryThrough();
            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
        });
    }



    $scope.GetAllDeliveryThrough = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();
        $scope.DeliveryThroughList = [];
        $http({
            method: 'GET',
            url: base_url + "inventory/creation/GetAllDeliveryThrough",
            dataType: "json"
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.DeliveryThroughList = res.data.Data;
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    }

    $scope.getDeliveryThroughById = function (refData) {
        $scope.loadingstatus = "running";
        showPleaseWait();
        var para = {
            DeliveryThroughId: refData.DeliveryThroughId
        };
        $http({
            method: 'POST',
            url: base_url + "inventory/creation/getDeliveryThroughById",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.newDet = res.data.Data;
                $scope.newDet.Mode = 'Update';
                document.getElementById('deliveryThrough-section').style.display = "none";
                document.getElementById('deliveryThrough-form').style.display = "block";

            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    };



    $scope.DelDeliveryThroughById = function (refData, ind) {
        Swal.fire({
            title: 'Do you want to delete ' + refData.Name + '?',
            showCancelButton: true,
            confirmButtonText: 'Delete',
            //message: 'Are you sure to delete selected BaliType :-' + beData.Name,
        }).then((result) => {
            if (result.isConfirmed) {
                var para = {
                    DeliveryThroughId: refData.DeliveryThroughId
                };
                $http({
                    method: 'POST',
                    url: base_url + "Inventory/Creation/DeleteDeliveryThrough",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingStatus = "stop";

                    Swal.fire(res.data.ResponseMSG);
                    if (res.data.IsSuccess == true) {
                        $scope.GetAllDeliveryThrough();
                    }
                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }

        });
    }





});