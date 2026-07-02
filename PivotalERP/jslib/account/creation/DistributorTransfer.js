app.controller('DTransferController', function ($scope, $http, $timeout, $filter, GlobalServices) {
    $scope.Title = 'Distributor Transfer';

    LoadData();

    function LoadData() {
        $('.select2').select2();
        $scope.confirmMSG = GlobalServices.getConfirmMSG();
        $scope.perPageColl = GlobalServices.getPerPageList();

        $scope.beData = {
            FromLedgerId: null,
            ToLedgerId: '',
            Code: '',
            Mode: 'Transfer'
        };
    };

    $scope.ClearDtransfer = function () {
        $scope.beData = {
            FromLedgerId: null,
            ToLedgerId: '',
            Code: '',
            Mode: 'Transfer'
        };
    }

    $scope.IsValidDTransfer = function () {
        //if ($scope.beData.Code.isEmpty()) {
        //    Swal.fire('Please ! Enter Code');
        //    return false;
        //}
        return true;
    }

    $scope.AddDistributorTransfer = function () {
        if ($scope.IsValidDTransfer() == true) {
            Swal.fire({
                title: 'Are you sure?',
                text: 'The data will not be reversed once transferred.',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, proceed!',
                cancelButtonText: 'Cancel'
            }).then((result) => {
                if (result.isConfirmed) {
                    if ($scope.confirmMSG.Accept == true) {
                        var saveModify = $scope.beData.Mode;
                        Swal.fire({
                            title: 'Do you want to ' + saveModify + ' the current data?',
                            showCancelButton: true,
                            confirmButtonText: saveModify,
                        }).then((result) => {
                            if (result.isConfirmed) {
                                $scope.CallSaveUpdateDTransfer();
                            }
                        });
                    } else {
                        $scope.CallSaveUpdateDTransfer();
                    }
                }
            });
        }
    };


    $scope.CallSaveUpdateDTransfer = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();
        $http({
            method: 'POST',
            url: base_url + "Account/Creation/SaveUpdateDistributorTransfer",
            headers: { 'Content-Type': undefined },
            transformRequest: function (data) {
                var formData = new FormData();
                formData.append("jsonData", angular.toJson(data.jsonData));
                return formData;
            },
            data: { jsonData: $scope.beData }
        }).then(function (res) {
            $scope.loadingstatus = "stop";
            hidePleaseWait();
            Swal.fire(res.data.ResponseMSG);
            if (res.data.IsSuccess == true) {
                $scope.ClearDtransfer();
            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
        });
    }



});