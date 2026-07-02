app.controller('TravelFundingController', function ($scope, $http, $timeout, $filter, GlobalServices) {
    $scope.Title = 'TravelFunding';

    LoadData();

    function LoadData() {
        $('.select2').select2();
        $scope.confirmMSG = GlobalServices.getConfirmMSG();
        $scope.perPageColl = GlobalServices.getPerPageList();
        $scope.currentPages = {
            TravelFunding: 1,
        };

        $scope.searchData = {
            TravelFunding: '',

        };

        $scope.perPage = {
            TravelFunding: GlobalServices.getPerPageRow()
        };


        $scope.newDet = {
            TravelFundingId: null,
            Name: '',
            Description: '',
            OrderNo: '',
            Mode: 'Save'
        };

        //$scope.GetAllTravelFunding();

    };

    $scope.ClearTravelFunding = function () {
        $scope.newDet = {
            TravelFundingId: null,
            Name: '',
            Description: '',
            OrderNo: '',
            Mode: 'Save'
        };
    }




    //************************* Department *********************************
    $scope.IsValidTravelFunding = function () {
        /*if ($scope.newBaliType.GenderName.isEmpty()) {
            Swal.fire('Please ! Enter GenderName Name');
            return false;
        }*/
        return true;
    }

    $scope.SaveTravelFunding = function () {
        if ($scope.IsValidTravelFunding() == true) {
            if ($scope.confirmMSG.Accept == true) {
                var saveModify = $scope.newDet.Mode;
                Swal.fire({
                    title: 'Do you want to ' + saveModify + ' the current data?',
                    showCancelButton: true,
                    confirmButtonText: saveModify,
                }).then((result) => {
                    /* Read more about isConfirmed, isDenied below */
                    if (result.isConfirmed) {
                        $scope.CallSaveUpdateTravelFunding();
                    }
                });
            } else
                $scope.CallSaveUpdateTravelFunding();
        }
    };

    $scope.CallSaveUpdateTravelFunding = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();
        $http({
            method: 'POST',
            url: base_url + "HR/Master/SaveUpdateTravelFunding",
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
                $scope.ClearTravelFunding();
                $scope.GetAllTravelFunding();
            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
        });
    }



    $scope.GetAllTravelFunding = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();
        $scope.TravelFundingList = [];
        $http({
            method: 'GET',
            url: base_url + "HR/Master/GetAllTravelFunding",
            dataType: "json"
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.TravelFundingList = res.data.Data;
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    }

    $scope.getTravelFundingById = function (refData) {
        $scope.loadingstatus = "running";
        showPleaseWait();
        var para = {
            TravelFundingId: refData.TravelFundingId
        };
        $http({
            method: 'POST',
            url: base_url + "HR/Master/getTravelFundingById",
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



    $scope.DelTravelFundingById = function (refData, ind) {
        Swal.fire({
            title: 'Do you want to delete ' + refData.Name + '?',
            showCancelButton: true,
            confirmButtonText: 'Delete',
            //message: 'Are you sure to delete selected BaliType :-' + beData.Name,
        }).then((result) => {
            if (result.isConfirmed) {
                var para = {
                    TravelFundingId: refData.TravelFundingId
                };
                $http({
                    method: 'POST',
                    url: base_url + "HR/Master/DeleteTravelFundingById",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingStatus = "stop";

                    Swal.fire(res.data.ResponseMSG);
                    if (res.data.IsSuccess == true) {
                        $scope.GetAllTravelFunding();
                    }
                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }

        });
    }





});