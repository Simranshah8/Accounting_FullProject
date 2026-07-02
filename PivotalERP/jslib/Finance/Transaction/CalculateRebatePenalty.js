app.controller('RebatePenaltyController', function ($scope, GlobalServices, $http, $filter, $timeout) {
    $scope.Title = 'RebatePenalty';

    var glSrv = GlobalServices;
    $scope.LoadData = function () {
        $('.select2').select2();

        $scope.confirmMSG = GlobalServices.getConfirmMSG();
        $scope.perPageColl = GlobalServices.getPerPageList();

    }

    $scope.ClearDate = function () {
        $scope.beData = {
            FromDate_TMP: '',
            ToDate_TMP: '',
            Mode: 'Save'
        };

    }

    $scope.DelRebatePenalty = function () {
        // Check that beData exists
        if (!$scope.beData) {
            Swal.fire('Select Date');
            return;
        }
        // Validate From Date
        if (!$scope.beData.FromDateDet || !$scope.beData.FromDateDet.dateAD) {
            Swal.fire('Please select From Date');
            return;
        }

        // Validate To Date
        if (!$scope.beData.ToDateDet || !$scope.beData.ToDateDet.dateAD) {
            Swal.fire('Please select To Date');
            return;
        }

        var DateFrom = new Date(($filter('date')(new Date(), 'yyyy-MM-dd')));
        var DateTo = new Date(($filter('date')(new Date(), 'yyyy-MM-dd')));

        if ($scope.beData.FromDateDet)
            DateFrom = new Date(($filter('date')($scope.beData.FromDateDet.dateAD, 'yyyy-MM-dd')));

        if ($scope.beData.ToDateDet)
            DateTo = new Date(($filter('date')($scope.beData.ToDateDet.dateAD, 'yyyy-MM-dd')));

        // Check From Date <= To Date
        if (DateFrom > DateTo) {
            Swal.fire('From Date cannot be greater than To Date');
            return;
        }
        Swal.fire({
            title: 'Are you sure you want to delete Rebate/Penalty?',
            showCancelButton: true,
            confirmButtonText: 'Delete',
        }).then((result) => {
            if (result.isConfirmed) {
                var para = {
                    dateFrom: DateFrom,
                    dateTo: DateTo
                };
                $http({
                    method: 'POST',
                    url: base_url + "Finance/Transaction/DelRebatePenalty",
                    headers: { 'Content-Type': 'application/json' },
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingStatus = "stop";

                    Swal.fire(res.data.ResponseMSG);

                    if (res.data.IsSuccess === true) {
                        $scope.ClearDate();
                    }
                }, function (reason) {
                    Swal.fire('Failed: ' + reason);
                });
            }
        });
    };

    
    $scope.CalculatePenalty = function () {
        if (!$scope.beData || !$scope.beData.FromDateDet || !$scope.beData.FromDateDet.dateAD) {
            Swal.fire('Please select From Date');
            return;
        }
        // Format the date as yyyy-MM-dd
        var dateFrom = $filter('date')(new Date($scope.beData.FromDateDet.dateAD), 'yyyy-MM-dd');

        // Send as FormData
        var formData = new FormData();
        formData.append("dateFrom", dateFrom);

        $http({
            method: 'POST',
            url: base_url + "Finance/Transaction/CalculatePenalty",
            headers: { 'Content-Type': undefined }, // allows FormData
            data: formData
        }).then(function (res) {
            $scope.loadingstatus = "stop";
            hidePleaseWait();
            Swal.fire(res.data.ResponseMSG);
            if (res.data.IsSuccess) {
                $scope.ClearDate();
            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            Swal.fire('Failed: ' + (errormessage.data || errormessage));
        });
    };

  
   
    $scope.CalculateRebate = function () {
        if (!$scope.beData || !$scope.beData.FromDateDet || !$scope.beData.FromDateDet.dateAD) {
            Swal.fire('Please select From Date');
            return;
        }
        // Format the date as yyyy-MM-dd
        var dateFrom = $filter('date')(new Date($scope.beData.FromDateDet.dateAD), 'yyyy-MM-dd');

        // Send as FormData
        var formData = new FormData();
        formData.append("dateFrom", dateFrom);

        $http({
            method: 'POST',
            url: base_url + "Finance/Transaction/CalculateRebate",
            headers: { 'Content-Type': undefined }, // allows FormData
            data: formData
        }).then(function (res) {
            $scope.loadingstatus = "stop";
            hidePleaseWait();
            Swal.fire(res.data.ResponseMSG);
            if (res.data.IsSuccess) {
                $scope.ClearDate();
            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            Swal.fire('Failed: ' + (errormessage.data || errormessage));
        });
    };




});