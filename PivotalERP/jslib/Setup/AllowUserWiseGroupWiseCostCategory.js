app.controller("AllowUserGroupWiseCostCategory", function ($scope, $http, GlobalServices, $timeout) {
    $scope.Title = 'AllowUserGroupWiseCostCategory';

    LoadData();


    function LoadData() {
        $scope.loadingstatus = "stop";
        $scope.confirmMSG = GlobalServices.getConfirmMSG();
        $scope.perPageColl = GlobalServices.getPerPageList();

        $scope.currentPages = {
            AllowUserGroupWiseCostCategory: 1

        };

        $scope.searchData = {
            AllowUserGroupWiseCostCategory: ''

        };

        $scope.perPage = {
            AllowUserGroupWiseCostCategory: GlobalServices.getPerPageRow(),

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
        $scope.VoucherList = [];
        $http({
            method: 'GET',
            url: base_url + "Account/Creation/GetAllVoucherData",
            dataType: "json",
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.VoucherList = res.data.Data;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
        $scope.ProductGroupList = [];
        $http({
            method: 'GET',
            url: base_url + "Inventory/Creation/GetProductGroup",
            dataType: "json",
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.ProductGroupList = res.data.Data;
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
        $scope.UserGroupList = [];
        $http({
            method: 'GET',
            url: base_url + "Setup/Security/GetAllUserGroupList",
            dataType: "json"
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.UserGroupList = res.data.Data;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
        $scope.UserList = [];
        $http({
            method: 'GET',
            url: base_url + "Setup/Security/GetAllUserList",
            dataType: "json"
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.UserList = res.data.Data;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
        $scope.CostCategoryList = [];
        $http({
            method: 'GET',
            url: base_url + "Account/Creation/GetCostCategories",
            dataType: "json"
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.CostCategoryList = res.data.Data;
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