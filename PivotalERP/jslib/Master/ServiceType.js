app.controller('ServiceTypeController', function ($scope, $http, $timeout, $filter, GlobalServices) {
    $scope.Title = 'ServiceType';

    LoadData();

    function LoadData() {
        $('.select2').select2();
        $scope.confirmMSG = GlobalServices.getConfirmMSG();
        $scope.perPageColl = GlobalServices.getPerPageList();
        $scope.currentPages = {
            ServiceType: 1,
        };

        $scope.searchData = {
            ServiceType: '',

        };

        $scope.perPage = {
            ServiceType: GlobalServices.getPerPageRow()
        };


        $scope.newDet = {
            ServiceTypeId: null,
            Name: '',
            OrderNum: null,
            Code: '',
            Mode: 'Save'
        };

        //$scope.GetAllServiceType();

    };

    $scope.ClearServiceType = function () {
        $scope.newDet = {
            ServiceTypeId: null,
            Name: '',
            OrderNum: '',
            Code: '',
            Mode: 'Save'
        };
    }





    //************************* Service type *********************************
    $scope.IsValidServiceType = function () {
        /*if ($scope.newBaliType.GenderName.isEmpty()) {
            Swal.fire('Please ! Enter GenderName Name');
            return false;
        }*/
        return true;
    }

    $scope.SaveServiceType = function () {
        if ($scope.IsValidServiceType() == true) {
            if ($scope.confirmMSG.Accept == true) {
                var saveModify = $scope.newDet.Mode;
                Swal.fire({
                    title: 'Do you want to ' + saveModify + ' the current data?',
                    showCancelButton: true,
                    confirmButtonText: saveModify,
                }).then((result) => {
                    /* Read more about isConfirmed, isDenied below */
                    if (result.isConfirmed) {
                        $scope.CallSaveUpdateServiceType();
                    }
                });
            } else
                $scope.CallSaveUpdateServiceType();
        }
    };

    $scope.CallSaveUpdateServiceType = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();
        $http({
            method: 'POST',
            url: base_url + "Payroll/Master/SaveServiceType",
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
                $scope.ClearServiceType();
                $scope.GetAllServiceType();
            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
        });
    }



    $scope.GetAllServiceType = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();
        $scope.ServiceTypeList = [];
        $http({
            method: 'GET',
            url: base_url + "Payroll/Master/GetAllServiceType",
            dataType: "json"
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.ServiceTypeList = res.data.Data;
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    }

    $scope.getServiceTypeById = function (refData) {
        $scope.loadingstatus = "running";
        showPleaseWait();
        var para = {
            ServiceTypeId: refData.ServiceTypeId
        };
        $http({
            method: 'POST',
            url: base_url + "Payroll/Master/getServiceTypeById",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.newDet = res.data.Data;
                $scope.newDet.Mode = 'Update';
                $('#custom-tabs-four-profile-tab').tab('show');


            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    };



    $scope.DelServiceTypeById = function (refData, ind) {
        Swal.fire({
            title: 'Do you want to delete ' + refData.Name + '?',
            showCancelButton: true,
            confirmButtonText: 'Delete',
            //message: 'Are you sure to delete selected BaliType :-' + beData.Name,
        }).then((result) => {
            if (result.isConfirmed) {
                var para = {
                    ServiceTypeId: refData.ServiceTypeId
                };
                $http({
                    method: 'POST',
                    url: base_url + "Payroll/Master/DeleteServiceType",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingStatus = "stop";

                    Swal.fire(res.data.ResponseMSG);
                    if (res.data.IsSuccess == true) {
                        $scope.GetAllServiceType();
                    }
                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }

        });
    }





});