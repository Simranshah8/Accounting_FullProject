app.controller('DisabilitiesController', function ($scope, $http, $timeout, $filter, GlobalServices) {
    $scope.Title = 'Disabilities';

    LoadData();

    function LoadData() {
        $('.select2').select2();
        $scope.confirmMSG = GlobalServices.getConfirmMSG();
        $scope.perPageColl = GlobalServices.getPerPageList();
        $scope.currentPages = {
            Disabilities: 1,
        };

        $scope.searchData = {
            Disabilities: '',

        };

        $scope.perPage = {
            Disabilities: GlobalServices.getPerPageRow()
        };


        $scope.newDet = {
            DisabilitiesId: null,
            Name: '',
            OrderNum: null,
            Code: '',
            Mode: 'Save'
        };

        //$scope.GetAllDisabilities();

    };

    $scope.ClearDisabilities = function () {
        $scope.newDet = {
            DisabilitiesId: null,
            Name: '',
            OrderNum: '',
            Code: '',
            Mode: 'Save'
        };
    }





    //************************* BaliType *********************************
    $scope.IsValidDisabilities = function () {
        /*if ($scope.newBaliType.GenderName.isEmpty()) {
            Swal.fire('Please ! Enter GenderName Name');
            return false;
        }*/
        return true;
    }

    $scope.SaveDisabilities = function () {
        if ($scope.IsValidDisabilities() == true) {
            if ($scope.confirmMSG.Accept == true) {
                var saveModify = $scope.newDet.Mode;
                Swal.fire({
                    title: 'Do you want to ' + saveModify + ' the current data?',
                    showCancelButton: true,
                    confirmButtonText: saveModify,
                }).then((result) => {
                    /* Read more about isConfirmed, isDenied below */
                    if (result.isConfirmed) {
                        $scope.CallSaveUpdateDisabilities();
                    }
                });
            } else
                $scope.CallSaveUpdateDisabilities();
        }
    };

    $scope.CallSaveUpdateDisabilities = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();
        $http({
            method: 'POST',
            url: base_url + "HR/Master/SaveDisabilities",
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
                $scope.ClearDisabilities();
                $scope.GetAllDisabilities();
            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
        });
    }



    $scope.GetAllDisabilities = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();
        $scope.DisabilitiesList = [];
        $http({
            method: 'GET',
            url: base_url + "HR/Master/GetAllDisabilities",
            dataType: "json"
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.DisabilitiesList = res.data.Data;
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    }

    $scope.getDisabilitiesById = function (refData) {
        $scope.loadingstatus = "running";
        showPleaseWait();
        var para = {
            DisabilitiesId: refData.DisabilitiesId
        };
        $http({
            method: 'POST',
            url: base_url + "HR/Master/getDisabilitiesById",
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



    $scope.DelDisabilitiesById = function (refData, ind) {
        Swal.fire({
            title: 'Do you want to delete ' + refData.Name + '?',
            showCancelButton: true,
            confirmButtonText: 'Delete',
            //message: 'Are you sure to delete selected BaliType :-' + beData.Name,
        }).then((result) => {
            if (result.isConfirmed) {
                var para = {
                    DisabilitiesId: refData.DisabilitiesId
                };
                $http({
                    method: 'POST',
                    url: base_url + "HR/Master/DeleteDisabilities",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingStatus = "stop";

                    Swal.fire(res.data.ResponseMSG);
                    if (res.data.IsSuccess == true) {
                        $scope.GetAllDisabilities();
                    }
                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }

        });
    }





});