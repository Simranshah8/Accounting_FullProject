app.controller("LedgerGroupForPurchaseAccount", function ($scope, $http, GlobalServices, $timeout) {
    $scope.Title = 'LedgerGroupForPurchaseAccount';

    LoadData();


    function LoadData() {
        $scope.loadingstatus = "stop";
        $scope.confirmMSG = GlobalServices.getConfirmMSG();
        $scope.perPageColl = GlobalServices.getPerPageList();

        $scope.currentPages = {
            LedgerGroupForPurchaseAccount: 1

        };

        $scope.searchData = {
            LedgerGroupForPurchaseAccount: ''

        };

        $scope.perPage = {
            LedgerGroupForPurchaseAccount: GlobalServices.getPerPageRow(),

        }
        $scope.beData =
        {
            BranchId: 0,
            Name: '',
            Address: '',
            Code: '',
            ContactPerson: '',
            ContactNo: '',
            FaxNo: '',
            PanNo: '',
            EmailId: '',

        };
        $scope.GodownList = [];
        $http({
            method: 'GET',
            url: base_url + "Inventory/Reporting/GetAllGodownList",
            dataType: "json",
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.GodownList = res.data.Data;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
        $scope.LedgerGroupList = [];
        $http({
            method: 'GET',
            url: base_url + "Account/Creation/GetLedgerGroupList",
            dataType: "json"
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.LedgerGroupList = res.data.Data;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
        $scope.LedgerList = [];
        $http({
            method: 'GET',
            url: base_url + "Account/Creation/GetLedgerList",
            dataType: "json"
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.LedgerList = res.data.Data;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    };

    $scope.ClearFields = function () {
        $scope.loadingstatus = "stop";
        $scope.beData =
        {
            BranchId: 0,
            Name: '',
            Address: '',
            Code: '',
            ContactPerson: '',
            ContactNo: '',
            FaxNo: '',
            PanNo: '',
            EmailId: '',

        };
        $('#txtName').focus();
    }




    $scope.IsValidBranch = function () {
        if ($scope.beData.Name.isEmpty()) {
            Swal.fire("Please ! Enter the Name of Branch");
            return false;
        }
        if ($scope.beData.Code.isEmpty()) {
            Swal.fire("Please ! Enter the Valid Code");
            return false;
        }
        else
            return true;
    }

    $scope.AddNewBranch = function () {
        if ($scope.IsValidBranch() == true) {
            if ($scope.confirmMSG.Accept == true) {
                var saveModify = $scope.beData.Mode;
                Swal.fire({
                    title: 'Do you want to' + saveModify + 'the current data?',
                    showCancelButton: true,
                    confirmButtonText: saveModify,
                }).then((result) => {
                    if (result.isConfirmed) {
                        $scope.CallSaveBranch();
                    }

                });
            }
            else
                $scope.CallSaveBranch();
        }
    };

    $scope.CallSaveBranch = function () {
        $scope.loadingstatus = 'running';
        showPleaseWait();

        $http({
            method: 'POST',
            url: base_url + "Setup/Security/SaveBranch",
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
                $scope.GetAllBranch();
            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
        });
    }
    $scope.GetAllBranch = function () {


        $scope.BranchColl = []; //declare an empty array

        if ($scope.loadingstatus != 'stop') {
            alert('Already Running Process')
            return;
        }

        $scope.loadingstatus = 'running';
        showPleaseWait();

        $http({
            method: 'GET',
            url: base_url + "Setup/Security/GetAllBranchList",
            dataType: "json"
            //data:JSON.stringify(para)
        }).then(function (res) {

            $scope.loadingstatus = 'stop';
            hidePleaseWait();

            if (res.data.IsSuccess && res.data.Data) {
                $timeout(function () {
                    $scope.BranchColl = res.data.Data;
                });
            } else
                alert(res.data.ResponseMSG);

        }, function (reason) {
            alert('Failed' + reason);
        });

    }

    $scope.getBranchById = function (beData) {

        $scope.loadingstatus = "running";
        var para = {
            BranchId: beData.BranchId
        };
        $http({
            method: 'POST',
            url: base_url + "Setup/Security/GetBranchById",
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

    $scope.deleteBranch = function (refData, ind) {

        Swal.fire({
            title: 'Are you sure to delete selected UserGroup :-' + refData.Name,
            showCancelButton: true,
            confirmButtonText: 'Delete',
        }).then((result) => {
            if (result.isConfirmed) {
                $scope.loadingstatus = "running";
                showPleaseWait();

                var para = {
                    BranchId: refData.BranchId
                };

                $http({
                    method: 'POST',
                    url: base_url + "Setup/Security/DelBranch",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingstatus = "stop";
                    Swal.fire(res.data.ResponseMSG);
                    if (res.data.IsSuccess) {
                        $scope.BranchColl.splice(ind, 1);
                    }

                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }
        });

    }

});