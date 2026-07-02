app.controller('AdvanceTypeController', function ($scope, $http, $timeout, $filter, GlobalServices) {
    $scope.Title = 'AdvanceType';

    LoadData();

    function LoadData() {
        $('.select2').select2();
        $scope.confirmMSG = GlobalServices.getConfirmMSG();
        $scope.perPageColl = GlobalServices.getPerPageList();
        $scope.currentPages = {
            AdvanceType: 1,
        };

        $scope.searchData = {
            AdvanceType: '',

        };

        $scope.perPage = {
            AdvanceType: GlobalServices.getPerPageRow()
        };

        $scope.PayHeadingList = [];
        $http({
            method: 'GET',
            url: base_url + "HR/Transaction/GetAllPayHeading",
            dataType: "json"
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.PayHeadingList = res.data.Data;

            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        $scope.newAdvanceType = {
            AdvanceTypeId: null,
            Name: '',
            Code: '',
            SNo: 0,
            Description: '',
            Mode: 'Save'
        };

    };

    $scope.ClearAdvanceType = function () {
        $scope.newAdvanceType = {
            AdvanceTypeId: null,
            Name: '',
            Code: '',
            SNo: 0,
            Description: '',
            Mode: 'Save'
        };
    }



    //************************* AdvanceType  *********************************
    $scope.IsValidAdvanceType = function () {
        if ($scope.newAdvanceType.Name.isEmpty()) {
            Swal.fire('Please ! Enter Name');
            return false;
        }

        return true;
    }

    $scope.SaveUpdateAdvanceType = function () {
        if ($scope.IsValidAdvanceType() == true) {
            if ($scope.confirmMSG.Accept == true) {
                var saveModify = $scope.newAdvanceType.Mode;
                Swal.fire({
                    title: 'Do you want to ' + saveModify + ' the current data?',
                    showCancelButton: true,
                    confirmButtonText: saveModify,
                }).then((result) => {
                    /* Read more about isConfirmed, isDenied below */
                    if (result.isConfirmed) {
                        $scope.CallSaveUpdateAdvanceType();
                    }
                });
            } else
                $scope.CallSaveUpdateAdvanceType();

        }
    };

    $scope.CallSaveUpdateAdvanceType = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();

        $http({
            method: 'POST',
            url: base_url + "HR/Transaction/SaveAdvanceType",
            headers: { 'Content-Type': undefined },

            transformRequest: function (data) {

                var formData = new FormData();
                formData.append("jsonData", angular.toJson(data.jsonData));

                return formData;
            },
            data: { jsonData: $scope.newAdvanceType }
        }).then(function (res) {

            $scope.loadingstatus = "stop";
            hidePleaseWait();

            Swal.fire(res.data.ResponseMSG);

            if (res.data.IsSuccess == true) {
                $scope.ClearAdvanceType();
                $scope.GetAllAdvanceTypeList();
            }

        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";

        });
    }

    $scope.GetAllAdvanceTypeList = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();
        $scope.AdvanceTypeList = [];

        $http({
            method: 'GET',
            url: base_url + "HR/Transaction/GetAllAdvanceType",
            dataType: "json"
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.AdvanceTypeList = res.data.Data;

            } else {
                Swal.fire(res.data.ResponseMSG);
            }

        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

    }

    $scope.GetAdvanceTypeById = function (refData) {
        $scope.loadingstatus = "running";
        showPleaseWait();
        var para = {
            TranId: refData.TranId
        };
        $http({
            method: 'POST',
            url: base_url + "HR/Transaction/getAdvanceTypeById",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.newAdvanceType = res.data.Data;
                $scope.newAdvanceType.Mode = 'Modify';
                $('#custom-tabs-four-profile-tab').tab('show');

            } else {
                Swal.fire(res.data.ResponseMSG);
            }

        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    };


    $scope.DelAdvanceTypeById = function (refData) {
        Swal.fire({
            title: 'Do you want to delete the selected data?',
            showCancelButton: true,
            confirmButtonText: 'Delete',
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                $scope.loadingstatus = "running";
                showPleaseWait();
                var para = {
                    TranId: refData.TranId
                };
                $http({
                    method: 'POST',
                    url: base_url + "HR/Transaction/DeleteAdvanceType",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingstatus = "stop";
                    if (res.data.IsSuccess) {
                        $scope.GetAllAdvanceTypeList();
                    } else {
                        Swal.fire(res.data.ResponseMSG);
                    }

                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }
        });
    };


    $scope.pageChangeHandler = function (num) {
        console.log('page changed to ' + num);
    };


});