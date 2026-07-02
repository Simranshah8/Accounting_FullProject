app.controller('TravelTypeController', function ($scope, $http, $timeout, $filter, GlobalServices) {
    $scope.Title = 'TravelType';

    LoadData();

    function LoadData() {
        $('.select2').select2();
        $scope.confirmMSG = GlobalServices.getConfirmMSG();
        $scope.perPageColl = GlobalServices.getPerPageList();
        $scope.currentPages = {
            TravelType: 1,
        };

        $scope.searchData = {
            TravelType: '',

        };

        $scope.perPage = {
            TravelType: GlobalServices.getPerPageRow()
        };


        $scope.newDet = {
            TravelTypeId: null,
            Name: '',
            Description: '',
            OrderNo: '',
            Mode: 'Save'
        };

        //$scope.GetAllTravelType();

    };

    $scope.ClearTravelType = function () {
        $scope.newDet = {
            TravelTypeId: null,
            Name: '',
            Description: '',
            OrderNo: '',
            Mode: 'Save'
        };
    }




    //************************* Department *********************************
    $scope.IsValidTravelType = function () {
        /*if ($scope.newBaliType.GenderName.isEmpty()) {
            Swal.fire('Please ! Enter GenderName Name');
            return false;
        }*/
        return true;
    }

    $scope.SaveTravelType = function () {
        if ($scope.IsValidTravelType() == true) {
            if ($scope.confirmMSG.Accept == true) {
                var saveModify = $scope.newDet.Mode;
                Swal.fire({
                    title: 'Do you want to ' + saveModify + ' the current data?',
                    showCancelButton: true,
                    confirmButtonText: saveModify,
                }).then((result) => {
                    /* Read more about isConfirmed, isDenied below */
                    if (result.isConfirmed) {
                        $scope.CallSaveUpdateTravelType();
                    }
                });
            } else
                $scope.CallSaveUpdateTravelType();
        }
    };

    $scope.CallSaveUpdateTravelType = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();
        $http({
            method: 'POST',
            url: base_url + "HR/Master/SaveUpdateTravelType",
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
                $scope.ClearTravelType();
                $scope.GetAllTravelType();
            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
        });
    }



    $scope.GetAllTravelType = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();
        $scope.TravelTypeList = [];
        $http({
            method: 'GET',
            url: base_url + "HR/Master/GetAllTravelType",
            dataType: "json"
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.TravelTypeList = res.data.Data;
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    }

    $scope.getTravelTypeById = function (refData) {
        $scope.loadingstatus = "running";
        showPleaseWait();
        var para = {
            TravelTypeId: refData.TravelTypeId
        };
        $http({
            method: 'POST',
            url: base_url + "HR/Master/getTravelTypeById",
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



    $scope.DelTravelTypeById = function (refData, ind) {
        Swal.fire({
            title: 'Do you want to delete ' + refData.Name + '?',
            showCancelButton: true,
            confirmButtonText: 'Delete',
            //message: 'Are you sure to delete selected BaliType :-' + beData.Name,
        }).then((result) => {
            if (result.isConfirmed) {
                var para = {
                    TravelTypeId: refData.TravelTypeId
                };
                $http({
                    method: 'POST',
                    url: base_url + "HR/Master/DeleteTravelTypeById",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingStatus = "stop";

                    Swal.fire(res.data.ResponseMSG);
                    if (res.data.IsSuccess == true) {
                        $scope.GetAllTravelType();
                    }
                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }

        });
    }





});