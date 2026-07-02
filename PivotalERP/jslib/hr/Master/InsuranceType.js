app.controller('InsuranceTypeController', function ($scope, $http, $timeout, $filter, GlobalServices) {
    $scope.Title = 'InsuranceType';

    LoadData();

    function LoadData() {
        $('.select2').select2();
        $scope.confirmMSG = GlobalServices.getConfirmMSG();
        $scope.perPageColl = GlobalServices.getPerPageList();
        $scope.currentPages = {
            InsuranceType: 1,
        };

        $scope.searchData = {
            InsuranceType: '',

        };

        $scope.perPage = {
            InsuranceType: GlobalServices.getPerPageRow()
        };


        $scope.newDet = {
            InsuranceTypeId: null,
            Name: '',
            DisplayName: '',
            Code: '',
            OrderNo: '',
            Mode: 'Save'
        };

        //$scope.GetAllInsuranceType();

    };

    $scope.ClearInsuranceType = function () {
        $scope.newDet = {
            InsuranceTypeId: null,
            Name: '',
            DisplayName: '',
            Code: '',
            OrderNo: '',
            Mode: 'Save'
        };
    }




    //************************* Department *********************************
    $scope.IsValidInsuranceType = function () {
        /*if ($scope.newBaliType.GenderName.isEmpty()) {
            Swal.fire('Please ! Enter GenderName Name');
            return false;
        }*/
        return true;
    }

    $scope.SaveInsuranceType = function () {
        if ($scope.IsValidInsuranceType() == true) {
            if ($scope.confirmMSG.Accept == true) {
                var saveModify = $scope.newDet.Mode;
                Swal.fire({
                    title: 'Do you want to ' + saveModify + ' the current data?',
                    showCancelButton: true,
                    confirmButtonText: saveModify,
                }).then((result) => {
                    /* Read more about isConfirmed, isDenied below */
                    if (result.isConfirmed) {
                        $scope.CallSaveUpdateInsuranceType();
                    }
                });
            } else
                $scope.CallSaveUpdateInsuranceType();
        }
    };

    $scope.CallSaveUpdateInsuranceType = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();
        $http({
            method: 'POST',
            url: base_url + "HR/Master/SaveUpdateInsuranceType",
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
                $scope.ClearInsuranceType();
                $scope.GetAllInsuranceType();
            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
        });
    }



    $scope.GetAllInsuranceType = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();
        $scope.InsuranceTypeList = [];
        $http({
            method: 'GET',
            url: base_url + "HR/Master/GetAllInsuranceType",
            dataType: "json"
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.InsuranceTypeList = res.data.Data;
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    }

    $scope.getInsuranceTypeById = function (refData) {
        $scope.loadingstatus = "running";
        showPleaseWait();
        var para = {
            InsuranceId: refData.InsuranceId
        };
        $http({
            method: 'POST',
            url: base_url + "HR/Master/getInsuranceTypeById",
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



    $scope.DelInsuranceTypeById = function (refData, ind) {
        Swal.fire({
            title: 'Do you want to delete ' + refData.Name + '?',
            showCancelButton: true,
            confirmButtonText: 'Delete',
            //message: 'Are you sure to delete selected BaliType :-' + beData.Name,
        }).then((result) => {
            if (result.isConfirmed) {
                var para = {
                    InsuranceId: refData.InsuranceId
                };
                $http({
                    method: 'POST',
                    url: base_url + "HR/Master/DeleteInsuranceTypeById",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingStatus = "stop";

                    Swal.fire(res.data.ResponseMSG);
                    if (res.data.IsSuccess == true) {
                        $scope.GetAllInsuranceType();
                    }
                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }

        });
    }





});