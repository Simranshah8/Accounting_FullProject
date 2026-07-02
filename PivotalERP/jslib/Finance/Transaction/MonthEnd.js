app.controller('MonthEndController', function ($scope, GlobalServices, $http, $filter, $timeout) {
    $scope.Title = 'MonthEnd';

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

    $scope.IsValidMonthEnd = function () {
        // Check that beData exists
        if (!$scope.beData) {
            Swal.fire('Select the date.');
            return false;
        }

        // Validate From Date
        if (!$scope.beData.FromDateDet || !$scope.beData.FromDateDet.dateAD) {
            Swal.fire('Please select From Date');
            return false;
        }

        // Validate To Date
        if (!$scope.beData.ToDateDet || !$scope.beData.ToDateDet.dateAD) {
            Swal.fire('Please select To Date');
            return false;
        }

        // Convert to JS dates for comparison
        var fromDate = new Date($scope.beData.FromDateDet.dateAD);
        var toDate = new Date($scope.beData.ToDateDet.dateAD);

        // Check From Date <= To Date
        if (fromDate > toDate) {
            Swal.fire('From Date cannot be greater than To Date');
            return false;
        }

        return true;
    };

    $scope.SaveUpdateMonthEnd = function () {
        if ($scope.IsValidMonthEnd() == true) {
            if ($scope.confirmMSG.Accept == true) {
                var saveModify = $scope.beData.Mode;
                Swal.fire({
                    title: 'Do you want to ' + saveModify + ' the current data?',
                    showCancelButton: true,
                    confirmButtonText: saveModify,
                }).then((result) => {
                    if (result.isConfirmed) {
                        $scope.CallSaveUpdateMonthEnd();
                    }
                });
            } else {
                $scope.CallSaveUpdateMonthEnd();
            }
        }
    };

    $scope.CallSaveUpdateMonthEnd = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();

        // Format FromDate
        if ($scope.beData.FromDateDet) {
            $scope.beData.dateFrom = $filter('date')(new Date($scope.beData.FromDateDet.dateAD), 'yyyy-MM-dd');
        } else {
            $scope.beData.dateFrom = new Date();
        }

        // Format ToDate
        if ($scope.beData.ToDateDet) {
            $scope.beData.dateTo = $filter('date')(new Date($scope.beData.ToDateDet.dateAD), 'yyyy-MM-dd');
        } else {
            $scope.beData.dateTo = new Date();
        }

        $http({
            method: 'POST',
            url: base_url + "Finance/Transaction/SaveMonthEnd?dateFrom=" + $scope.beData.dateFrom + "&dateTo=" + $scope.beData.dateTo,
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
                $scope.ClearDate();
            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
        });
    };

   

    $scope.DelMonthEnd = function () {

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

        // Confirmation dialog
        Swal.fire({
            title: 'Are you sure you want to delete the Month End record?',
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
                    url: base_url + "Finance/Transaction/DelMonthEnd",
                    headers: { 'Content-Type': 'application/json' },
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingStatus = "stop";

                    Swal.fire(res.data.ResponseMSG);

                    if (res.data.IsSuccess === true) {
                        $scope.ClearDate(); // Clear form after delete
                    }
                }, function (reason) {
                    Swal.fire('Failed: ' + reason);
                });
            }
        });
    };

    $scope.ClearMonthEnd = function () {

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

        // Format dates
        var dateFrom = $scope.beData.FromDateDet
            ? $filter('date')(new Date($scope.beData.FromDateDet.dateAD), 'yyyy-MM-dd')
            : new Date();

        var dateTo = $scope.beData.ToDateDet
            ? $filter('date')(new Date($scope.beData.ToDateDet.dateAD), 'yyyy-MM-dd')
            : new Date();

        var para = {
            dateFrom: dateFrom,
            dateTo: dateTo
        };

        // POST to server
        $http({
            method: 'POST',
            url: base_url + "Finance/Transaction/ClearMonthEnd",
            headers: { 'Content-Type': 'application/json' },
            data: JSON.stringify(para)
        }).then(function (res) {
            $scope.loadingstatus = "stop";
            hidePleaseWait();
            Swal.fire(res.data.ResponseMSG);

            if (res.data.IsSuccess === true) {
                $scope.ClearDate();
            }

        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            Swal.fire('Failed: ' + errormessage);
        });
    };


});