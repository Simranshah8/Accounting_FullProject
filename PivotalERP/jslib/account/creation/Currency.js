app.controller("currencyController", function ($scope, $http, GlobalServices, $timeout) {
    $scope.Title = 'Currency';

    LoadData();


    function LoadData() {
        $scope.loadingstatus = "stop";

        $scope.confirmMSG = GlobalServices.getConfirmMSG();
        $scope.perPageColl = GlobalServices.getPerPageList();


        $scope.currentPages = {
            Currency: 1

        };

        $scope.searchData = {
            Currency: ''

        };

        $scope.perPage = {
            Currency: GlobalServices.getPerPageRow(),

        };
        $scope.beData =
        {
            CurrencyId: 0,
            Name: '',
            Unit: '',
            Code: '',
            IsActive: true,
            NoOfDecimal: 0,
            CanEditRate:true,
            Mode: 'Save',
        };

    };

    $scope.ClearFields = function () {
        $scope.loadingstatus = "stop";
        $scope.beData =
        {
            CurrencyId: 0,
            Name: '',
            Unit: '',
            Code: '',
            NoOfDecimal: 0,
            CanEditRate:true,
            Mode: 'Save'
        };
        $('#txtName').focus();
    }

    $scope.GetAllCurrencys = function () {


        $scope.CurrencyColl = []; //declare an empty array

        if ($scope.loadingstatus != 'stop') {
            alert('Already Running Process')
            return;
        }

        $scope.loadingstatus = 'running';
        showPleaseWait();

        $http({
            method: 'GET',
            url: base_url + "Account/Creation/GetAllCurrency",
            dataType: "json"
            //data:JSON.stringify(para)
        }).then(function (res) {

            $scope.loadingstatus = 'stop';
            hidePleaseWait();

            if (res.data.IsSuccess && res.data.Data) {
                $timeout(function () {
                    $scope.CurrencyColl = res.data.Data;
                });
            } else
                alert(res.data.ResponseMSG);

        }, function (reason) {
            alert('Failed' + reason);
        });

    }


    $scope.IsValidDebtorCreditorType = function () {
        if ($scope.beData.Name.isEmpty()) {
            Swal.fire("Please ! Enter Valid Debtor Creditor Name");
            return false;
        }
        else
            return true;
    }

    $scope.AddNewCurrency = function () {
        if ($scope.IsValidDebtorCreditorType() == true) {
            if ($scope.confirmMSG.Accept == true) {
                var saveModify = $scope.beData.Mode;
                Swal.fire({
                    title: 'Do you want to' + saveModify + 'the current data?',
                    showCancelButton: true,
                    confirmButtonText: saveModify,
                }).then((result) => {
                    if (result.isConfirmed) {
                        $scope.CallSaveUpdateDebtorCreditorsType();
                    }

                });
            }
            else
                $scope.CallSaveUpdateDebtorCreditorsType();
        }
    };

    $scope.CallSaveUpdateDebtorCreditorsType = function () {
        $scope.loadingstatus = 'running';
        showPleaseWait();

        $http({
            method: 'POST',
            url: base_url + "Account/Creation/SaveUpdateCurrency",
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
                $scope.GetAllCurrencys();
            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
        });
    }

    $scope.getCurrencyById = function (beData) {

        $scope.loadingstatus = "running";
        var para = {
            CurrencyId: beData.CurrencyId
        };
        $http({
            method: 'POST',
            url: base_url + "Account/Creation/getCurrencyById",
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
    }

    $scope.deleteCurrency = function (refData, ind) {

        Swal.fire({
            title: 'Are you sure to delete selected DebtorCreditor Type :-' + refData.Name,
            showCancelButton: true,
            confirmButtonText: 'Delete',
        }).then((result) => {
            if (result.isConfirmed) {
                $scope.loadingstatus = "running";
                showPleaseWait();

                var para = {
                    CurrencyId: refData.CurrencyId
                };

                $http({
                    method: 'POST',
                    url: base_url + "Account/Creation/DeleteCurrency",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingstatus = "stop";
                    Swal.fire(res.data.ResponseMSG);
                    if (res.data.IsSuccess) {
                        $scope.CurrencyColl.splice(ind, 1);
                    }

                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }
        });

    }



});