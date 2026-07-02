app.controller("YearClosing", function ($scope, $http, $timeout, GlobalServices) {
    $scope.Title = 'Year Closing';
    LoadData();

    function LoadData() {
        $('.select2').select2();
        $scope.loadingstatus = "stop";
        $scope.confirmMSG = GlobalServices.getConfirmMSG();

        $scope.beData =
        {
            YearClosingId: null,
            CompanyStartDate_TMP: new Date(),
            CompanyEndDate_TMP: new Date(),
            BaseUrl: '',
            Name: '',
            IsDefault: '',
            CostClassStartDate_TMP: new Date(),
            CostClassEndDate_TMP: new Date(),
            PeriodStartDate_TMP: new Date(),
            PeriodEndDate_TMP: new Date(),
            FiscalYear: '',
            IsForwardLedgerOpening: 0,
            IsForwardStockOpening: 0,
            MakeIncomeExpenseZero: 0,
            Mode: 'Save'
        };
        $scope.loadingstatus = "stop";

    };

    $scope.ClearFields = function () {
        $scope.loadingstatus = "stop";
        $scope.beData =
        {
            YearClosingId: null,
            CompanyStartDate_TMP: new Date(),
            CompanyEndDate_TMP: new Date(),
            BaseUrl: '',
            Name: '',
            IsDefault: '',
            CostClassStartDate_TMP: new Date(),
            CostClassEndDate_TMP: new Date(),
            PeriodStartDate_TMP: new Date(),
            PeriodEndDate_TMP: new Date(),
            FiscalYear: '',
            IsForwardLedgerOpening: 0,
            IsForwardStockOpening: 0,
            MakeIncomeExpenseZero: 0,
            Mode: 'Save'
        };
    }

    $scope.IsValidYearClosing = function () {
        if ($scope.beData.Name.isEmpty()) {
            Swal.fire("Please ! Enter Company Name");
            return false;
        }
        else
            return true;
    }

    $scope.AddYearClosing = function () {
        if ($scope.IsValidYearClosing() == true) {
            if ($scope.confirmMSG.Accept == true) {
                var saveModify = $scope.beData.Mode;
                Swal.fire({
                    title: 'Do you want to' + saveModify + 'the current data?',
                    showCancelButton: true,
                    confirmButtonText: saveModify,
                }).then((result) => {
                    if (result.isConfirmed) {
                        $scope.CallSaveUpdateYearClosing();
                    }

                });
            }
            else
                $scope.CallSaveUpdateYearClosing();
        }
    };

    $scope.CallSaveUpdateYearClosing = function () {
        $scope.loadingstatus = 'running';
        showPleaseWait();

        $http({
            method: 'POST',
            url: base_url + "Setup/Security/SaveYearClosing",
            headers: { 'content-Type': undefined },

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
                $scope.ClearFields();
                /*$scope.GetAllYearClosing();*/
            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
        });
    }

    $scope.getYearClosingById = function (beData) {
        $scope.loadingstatus = "running";
        var para = {
            YearClosingId: beData.YearClosingId
        };
        $http({
            method: 'POST',
            url: base_url + "Setup/Security/getYearClosingByIdd",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $timeout(function () {
                    $scope.beData = res.data.Data;
                    $scope.beData.Mode = 'Modify';
                    $('#custom-tabs-four-profile-tab').tab('show');
                });
            } else
                Swal.fire(res.data.ResponseMSG);

        }, function (reason) {
            alert('Failed' + reason);
        });
    };
});