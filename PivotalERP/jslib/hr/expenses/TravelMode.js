app.controller('ExpensesController', function ($scope, $http, $timeout, $filter, GlobalServices) {
    $scope.Title = 'TravelMode';

    LoadData();

    function LoadData() {
        $('.select2').select2();
        $scope.confirmMSG = GlobalServices.getConfirmMSG();
        $scope.perPageColl = GlobalServices.getPerPageList();
        $scope.currentPages = {
            TravelMode: 1,
        };

        $scope.searchData = {
            TravelMode: '',

        };

        $scope.perPage = {
            TravelMode: GlobalServices.getPerPageRow()
        };


        $scope.newDet = {
            TravelModeId: null,
            Name: '',
            Code: '',
            Mode: 'Save'
        };

        //$scope.GetAllTravelMode();

    };

    $scope.ClearTravelMode = function () {
        $scope.newDet = {
            TravelModeId: null,
            Name: '',
            Code: '',
            Mode: 'Save'
        };
    }




    //************************* TravelMode *********************************
    $scope.IsValidTravelMode = function () {
        /*if ($scope.newBaliType.GenderName.isEmpty()) {
            Swal.fire('Please ! Enter GenderName Name');
            return false;
        }*/
        return true;
    }

    $scope.SaveTravelMode = function () {
        if ($scope.IsValidTravelMode() == true) {
            if ($scope.confirmMSG.Accept == true) {
                var saveModify = $scope.newDet.Mode;
                Swal.fire({
                    title: 'Do you want to ' + saveModify + ' the current data?',
                    showCancelButton: true,
                    confirmButtonText: saveModify,
                }).then((result) => {
                    /* Read more about isConfirmed, isDenied below */
                    if (result.isConfirmed) {
                        $scope.CallSaveUpdateTravelMode();
                    }
                });
            } else
                $scope.CallSaveUpdateTravelMode();
        }
    };

    $scope.CallSaveUpdateTravelMode = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();
        $http({
            method: 'POST',
            url: base_url + "HR/Expenses/SaveTravelMode",
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
                $scope.ClearTravelMode();
                $scope.GetAllTravelMode();
            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
        });
    }



    $scope.GetAllTravelMode = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();
        $scope.TravelModeList = [];
        $http({
            method: 'POST',
            url: base_url + "HR/Expenses/GetAllTravelMode",
            dataType: "json"
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.TravelModeList = res.data.Data;
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    }

    $scope.getTravelModeById = function (refData) {
        $scope.loadingstatus = "running";
        showPleaseWait();
        var para = {
            TravelModeId: refData.TravelModeId
        };
        $http({
            method: 'POST',
            url: base_url + "HR/Expenses/GetTravelModeById",
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



    $scope.DelTravelModeById = function (refData, ind) {
        Swal.fire({
            title: 'Do you want to delete ' + refData.Name + '?',
            showCancelButton: true,
            confirmButtonText: 'Delete',
            //message: 'Are you sure to delete selected BaliType :-' + beData.Name,
        }).then((result) => {
            if (result.isConfirmed) {
                var para = {
                    TravelModeId: refData.TravelModeId
                };
                $http({
                    method: 'POST',
                    url: base_url + "HR/Expenses/DelTravelMode",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingStatus = "stop";

                    Swal.fire(res.data.ResponseMSG);
                    if (res.data.IsSuccess == true) {
                        $scope.GetAllTravelMode();
                    }
                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }

        });
    }





});




