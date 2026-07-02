app.controller("ExpenseHeading", function ($scope, $http, $timeout, GlobalServices) {

    LoadData();

    function LoadData() {
        $scope.loadingstatus = "stop";
        $scope.confirmMSG = GlobalServices.getConfirmMSG();
        $scope.perPageColl = GlobalServices.getPerPageList();


        $scope.perPage = {
            ExpenseHeading: GlobalServices.getPerPageRow(),

        };
        $scope.searchData = {
            ExpenseHeading: ''
        };
        $scope.currentPages = {
            ExpenseHeading: 1

        };

        $scope.beData =
        {
            ExpenseHeadingId: 0,
            Name: '',
            Description: '',
            Code: '',
            OrderNo:0
        };
        $scope.ClearFields = function () {
            $scope.loadingstatus = "stop";
            $scope.beData =
            {
                ExpenseHeadingId: 0,
                Name: '',
                Description: '',
                Code: '',
                OrderNo: 0
            };

        }

    };

    $scope.Validate = function () {
        if ($scope.beData.Name.isEmpty()) {
            Swal.fire("Please ! Enter Valid ExpenseHeading Name");
            return false;
        }
        else
            return true;
    }


    $scope.GetAllExpenseHeading = function () {
        $scope.noofrows = 10;

        $scope.ExpenseHeadingColl = []; //declare an empty array

        if ($scope.loadingstatus != 'stop') {
            alert('Already Running Process')
            return;
        }

        $scope.loadingstatus = 'running';
        showPleaseWait();

        $http({
            method: 'GET',
            url: base_url + "Expense/Creation/GetAllExpenseHeadings",
            dataType: "json"
            //data:JSON.stringify(para)
        }).then(function (res) {

            $scope.loadingstatus = 'stop';
            hidePleaseWait();

            if (res.data.IsSuccess && res.data.Data) {
                $timeout(function () {
                    $scope.ExpenseHeadingColl = res.data.Data;
                });
            } else
                alert(res.data.ResponseMSG);

        }, function (reason) {
            alert('Failed' + reason);
        });

    }



    $scope.AddExpenseHeading = function () {
        if ($scope.Validate() == true) {
            if ($scope.confirmMSG.Accept == true) {
                var saveModify = $scope.beData.Mode;
                Swal.fire({
                    title: 'Do you want to' + saveModify + 'the current data?',
                    showCancelButton: true,
                    confirmButtonText: saveModify,
                }).then((result) => {
                    if (result.isConfirmed) {
                        $scope.CallSaveUpdateExpenseHeading();
                    }

                });
            }
            else
                $scope.CallSaveUpdateExpenseHeading();
        }
    };

    $scope.CallSaveUpdateExpenseHeading = function () {
        $scope.loadingstatus = 'running';
        showPleaseWait();

        $http({
            method: 'POST',
            url: base_url + "Expense/Creation/SaveExpenseHeading",
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
            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
        });
    }
    $scope.UpdateExpenseHeading = function () {

        $scope.loadingstatus = "running";

        var isValid = $scope.Validate();

        if (!isValid)
            return;
        $http({
            method: 'GET',
            url: "Expense/Creation/UpdateExpenseHeading",
            dataType: "json"
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                scope.ledgerDetail = res.data.Data;
                scope.currentLedDet = res.data.Data;
                //$scope.ShowLedgerDetails(res.data.Data);
                $timeout(function () {
                    scope.confirmAction();
                });

            } else
                alert(res.data.ResponseMSG);

        }, function (reason) {
            alert('Failed' + reason);
        });
    }

    $scope.getExpenseHeadingById = function (beData) {

        $scope.loadingstatus = "running";
        $http({
            method: 'GET',
            url: base_url + "Expense/Creation/getExpenseHeadingById",
            dataType: "json"
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                scope.ledgerDetail = res.data.Data;
                scope.currentLedDet = res.data.Data;
                //$scope.ShowLedgerDetails(res.data.Data);
                $timeout(function () {
                    scope.confirmAction();
                });

            } else
                alert(res.data.ResponseMSG);

        }, function (reason) {
            alert('Failed' + reason);
        });
    }

    $scope.deleteExpenseHeading = function (beData) {
        exDialog.openConfirm({
            scope: $scope,
            title: $scope.Title,
            icon: "info",
            message: 'Are you sure to delete selected Branch :-' + beData.Name
        }).then(function (value) {

            var getData = $http({
                method: 'GET',
                url: base_url + "Expense/Creation/DeleteExpenseHeading",
                dataType: "json"
            }).then(function (res) {
                if (res.data.IsSuccess && res.data.Data) {
                    scope.ledgerDetail = res.data.Data;
                    scope.currentLedDet = res.data.Data;
                    //$scope.ShowLedgerDetails(res.data.Data);
                    $timeout(function () {
                        scope.confirmAction();
                    });

                } else
                    alert(res.data.ResponseMSG);

            }, function (reason) {
                alert('Failed' + reason);
            });

        });
    }
});