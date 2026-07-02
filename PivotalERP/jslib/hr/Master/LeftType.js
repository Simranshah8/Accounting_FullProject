app.controller('LeftTypeController', function ($scope, $http, $timeout, $filter, GlobalServices) {
    $scope.Title = 'LeftType';

    LoadData();

    function LoadData() {
        $('.select2').select2();
        $scope.confirmMSG = GlobalServices.getConfirmMSG();
        $scope.perPageColl = GlobalServices.getPerPageList();
        $scope.currentPages = {
            LeftType: 1,
        };

        $scope.searchData = {
            LeftType: '',

        };

        $scope.perPage = {
            LeftType: GlobalServices.getPerPageRow()
        };


        $scope.newDet = {
            LeftTypeId: null,
            Name: '',
            OrderNum: 0,
            Code: '',
            Mode: 'Save'
        };

        //$scope.GetAllLeftType();

    };

    $scope.ClearLeftType = function () {
        $scope.newDet = {
            LeftTypeId: null,
            Name: '',
            OrderNum: 0,
            Code: '',
            Mode: 'Save'
        };
    }




    //************************* Left Type *********************************
    $scope.IsValidLeftType = function () {
        /*if ($scope.newBaliType.GenderName.isEmpty()) {
            Swal.fire('Please ! Enter GenderName Name');
            return false;
        }*/
        return true;
    }

    $scope.SaveLeftType = function () {
        if ($scope.IsValidLeftType() == true) {
            if ($scope.confirmMSG.Accept == true) {
                var saveModify = $scope.newDet.Mode;
                Swal.fire({
                    title: 'Do you want to ' + saveModify + ' the current data?',
                    showCancelButton: true,
                    confirmButtonText: saveModify,
                }).then((result) => {
                    /* Read more about isConfirmed, isDenied below */
                    if (result.isConfirmed) {
                        $scope.CallSaveUpdateLeftType();
                    }
                });
            } else
                $scope.CallSaveUpdateLeftType();
        }
    };

    $scope.CallSaveUpdateLeftType = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();
        $http({
            method: 'POST',
            url: base_url + "HR/Master/SaveUpdateLeftType",
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
                $scope.ClearLeftType();
                $scope.GetAllLeftType();
            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
        });
    }



    $scope.GetAllLeftType = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();
        $scope.LeftTypeList = [];
        $http({
            method: 'GET',
            url: base_url + "HR/Master/GetAllLeftType",
            dataType: "json"
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.LeftTypeList = res.data.Data;
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    }

    $scope.getLeftTypeById = function (refData) {
        $scope.loadingstatus = "running";
        showPleaseWait();
        var para = {
            LeftTypeId: refData.LeftTypeId
        };
        $http({
            method: 'POST',
            url: base_url + "HR/Master/getLeftTypeById",
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



    $scope.DelLeftTypeById = function (refData, ind) {
        Swal.fire({
            title: 'Do you want to delete ' + refData.Name + '?',
            showCancelButton: true,
            confirmButtonText: 'Delete',
            //message: 'Are you sure to delete selected BaliType :-' + beData.Name,
        }).then((result) => {
            if (result.isConfirmed) {
                var para = {
                    LeftTypeId: refData.LeftTypeId
                };
                $http({
                    method: 'POST',
                    url: base_url + "HR/Master/DeleteLeftTypeById",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingStatus = "stop";

                    Swal.fire(res.data.ResponseMSG);
                    if (res.data.IsSuccess == true) {
                        $scope.GetAllLeftType();
                    }
                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }

        });
    }





});