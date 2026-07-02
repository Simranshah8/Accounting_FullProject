app.controller('LoanTypeController', function ($scope, $http, $timeout, $filter, GlobalServices) {
    $scope.Title = 'LoanType';

    LoadData();

    function LoadData() {
        $('.select2').select2();
        $scope.confirmMSG = GlobalServices.getConfirmMSG();
        $scope.perPageColl = GlobalServices.getPerPageList();
        $scope.currentPages = {
            LoanType: 1,
        };

        $scope.searchData = {
            LoanType: '',

        };

        $scope.perPage = {
            LoanType: GlobalServices.getPerPageRow()
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

        $scope.newLoanType = {
            LoanTypeId: null,
            Name: '',
            Code: '',
            SerialNo: 0,
            PayHeadingId: null,
            Description: '',
            Mode: 'Save'
        };

    };

    $scope.ClearLoanType = function () {
        $scope.newLoanType = {
            LoanTypeId: null,
            Name: '',
            Code: '',
            SerialNo: 0,
            PayHeadingId: null,
            Description: '',
            Mode: 'Save'
        };
    }



    //************************* LoanType  *********************************

    $scope.IsValidLoanType = function () {
        if ($scope.newLoanType.Name.isEmpty()) {
            Swal.fire('Please ! Enter Name');
            return false;
        }

        return true;
    }

    $scope.SaveUpdateLoanType = function () {
        if ($scope.IsValidLoanType() == true) {
            if ($scope.confirmMSG.Accept == true) {
                var saveModify = $scope.newLoanType.Mode;
                Swal.fire({
                    title: 'Do you want to ' + saveModify + ' the current data?',
                    showCancelButton: true,
                    confirmButtonText: saveModify,
                }).then((result) => {
                    if (result.isConfirmed) {
                        $scope.CallSaveUpdateLoanType();
                    }
                });
            } else
                $scope.CallSaveUpdateLoanType();

        }
    };

    $scope.CallSaveUpdateLoanType = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();

        $http({
            method: 'POST',
            url: base_url + "HR/Transaction/SaveLoanType",
            headers: { 'Content-Type': undefined },

            transformRequest: function (data) {

                var formData = new FormData();
                formData.append("jsonData", angular.toJson(data.jsonData));

                return formData;
            },
            data: { jsonData: $scope.newLoanType }
        }).then(function (res) {

            $scope.loadingstatus = "stop";
            hidePleaseWait();

            Swal.fire(res.data.ResponseMSG);

            if (res.data.IsSuccess == true) {
                $scope.ClearLoanType();
                $scope.GetAllLoanType();
            }

        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";

        });
    }

    $scope.GetAllLoanType = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();
        $scope.LoanTypeList = [];
        $http({
            method: 'GET',
            url: base_url + "HR/Transaction/GetAllLoanType",
            dataType: "json"
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.LoanTypeList = res.data.Data;

            } else {
                Swal.fire(res.data.ResponseMSG);
            }

        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

    }

    $scope.GetLoanTypeById = function (refData) {
        $scope.loadingstatus = "running";
        showPleaseWait();
        var para = {
            TranId: refData.TranId
        };
        $http({
            method: 'POST',
            url: base_url + "HR/Transaction/getLoanTypeById",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.newLoanType = res.data.Data;
                $scope.newLoanType.Mode = 'Modify';
                $('#custom-tabs-four-profile-tab').tab('show');

            } else {
                Swal.fire(res.data.ResponseMSG);
            }

        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    };

    $scope.DelLoanType = function (refData, ind) {
        Swal.fire({
            title: 'Are you sure you want to delete ' + refData.Name + '?',
            showCancelButton: true,
            confirmButtonText: 'Delete',
        }).then((result) => {
            if (result.isConfirmed) {
                var para = { TranId: refData.TranId };
                $http({
                    method: 'POST',
                    url: base_url + "HR/Transaction/DeleteLoanType",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingStatus = "stop";

                    Swal.fire(res.data.ResponseMSG);
                    if (res.data.IsSuccess == true) {
                        $scope.LoanTypeList.splice(ind, 1);
                    }
                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }

        });
    }


    $scope.pageChangeHandler = function (num) {
        console.log('page changed to ' + num);
    };



});