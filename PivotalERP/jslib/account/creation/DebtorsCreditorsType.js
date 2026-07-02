app.controller("DebtorsCreditorsType", function ($scope, $http, GlobalServices, $timeout) {
    $scope.Title = 'DebtorType';

    LoadData();


    function LoadData() {
        $scope.loadingstatus = "stop";

        $scope.confirmMSG = GlobalServices.getConfirmMSG();
        $scope.perPageColl = GlobalServices.getPerPageList();
        $scope.NumberingMethodList = GlobalServices.getNumberingMethod();

        $scope.currentPages = {
            DebtorsCreditorsType: 1

        };

        $scope.searchData = {
            DebtorsCreditorsType: ''

        };

        $scope.perPage = {
            DebtorsCreditorsType: GlobalServices.getPerPageRow(),
        };

        $scope.DTypeColl = [];
        $http({
            method: 'GET',
            url: base_url + "V1/StaticValues/GetDebtorTypes",
            dataType: "json"
            //data:JSON.stringify(para)
        }).then(function (res) {
            $scope.DTypeColl = res.data; 

        }, function (reason) {
            alert('Failed' + reason);
        });

        $scope.beData =
        {
            DebtorsCreditorsTypeId: 0,
            Name: '',
            Alias: '',
            Code: '',
            IsActive: true,
            Mode: 'Save',
            DType: 4,
            NumberingMethod:null,
            StartNumber:null,
            Prefix: null,
            Suffix: null,
            NumericalPartWidth: null,
        };

    };

    $scope.ClearFields = function () {
        $scope.loadingstatus = "stop";
        $scope.beData =
        {
            DebtorsCreditorsTypeId: 0,
            Name: '',
            Alias: '',
            Code: '',
            Mode: 'Save',
            DType: 4,
            NumberingMethod: null,
            StartNumber: null,
            Prefix: null,
            Suffix: null,
            NumericalPartWidth: null,
        };
        $('#txtName').focus();
    }

    $scope.ChangeDebtorType = function () {
        //if ($scope.beData.DType != 5) {            
        //    $scope.beData.StartNumber = null;
        //    $scope.beData.Prefix = null;
        //    $scope.beData.Suffix = null;
        //    $scope.beData.NumericalPartWidth = 0;
        //}
    }
    $scope.GetAllDebtorsCreditorsTypes = function () {


        $scope.DebtorsCreditorsTypeColl = []; //declare an empty array

        if ($scope.loadingstatus != 'stop') {
            alert('Already Running Process')
            return;
        }

        $scope.loadingstatus = 'running';
        showPleaseWait();

        $http({
            method: 'GET',
            url: base_url + "Account/Creation/GetAllDebtorsCreditorsType",
            dataType: "json"
            //data:JSON.stringify(para)
        }).then(function (res) {

            $scope.loadingstatus = 'stop';
            hidePleaseWait();

            if (res.data.IsSuccess && res.data.Data) {
                $timeout(function () {
                    $scope.DebtorsCreditorsTypeColl = res.data.Data;
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

    $scope.AddNewDebtorsCreditorsType = function () {
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
            url: base_url + "Account/Creation/SaveUpdateDebtorsCreditorsType",
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
                $scope.GetAllDebtorsCreditorsTypes();
            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
        });
    }

    $scope.getDebtorsCreditorsTypeById = function (beData) {

        $scope.loadingstatus = "running";
        var para = {
            DebtorTypeId: beData.DebtorTypeId
        };
        $http({
            method: 'POST',
            url: base_url + "Account/Creation/getDebtorsCreditorsTypeById",
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

    $scope.deleteDebtorsCreditorsType = function (refData, ind) {

        Swal.fire({
            title: 'Are you sure to delete selected DebtorCreditor Type :-' + refData.Name,
            showCancelButton: true,
            confirmButtonText: 'Delete',
        }).then((result) => {
            if (result.isConfirmed) {
                $scope.loadingstatus = "running";
                showPleaseWait();

                var para = {
                    DebtorTypeId: refData.DebtorTypeId
                };

                $http({
                    method: 'POST',
                    url: base_url + "Account/Creation/DeleteDebtorsCreditorsType",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingstatus = "stop";
                    Swal.fire(res.data.ResponseMSG);
                    if (res.data.IsSuccess) {
                        $scope.DebtorsCreditorsTypeColl.splice(ind, 1);
                    }

                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }
        });

    }



});