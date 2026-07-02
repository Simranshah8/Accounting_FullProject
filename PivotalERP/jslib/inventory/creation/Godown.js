app.controller('Godown', function ($scope, $filter, $http, $timeout, GlobalServices) {
    $scope.Title = 'Godown';


    LoadData();
    function LoadData() {
        $('.select2').select2();
        $scope.loadingstatus = "stop";
        $scope.confirmMSG = GlobalServices.getConfirmMSG();
        $scope.perPageColl = GlobalServices.getPerPageList();


        $scope.perPage = {
            Godown: GlobalServices.getPerPageRow(),

        };
        $scope.currentPages = {
            Godown: 1

        };
        $scope.searchData = {
            Godown: ''
        };

        $scope.newGodown =
        {

            Address: '',
            AutoNumber: 0,
            ContactPerson: '',
            GodownId: 0,
            PhoneNo: '',
            LedgerId: 0,
            ParentGodownId: 0,
            ParentGodownName: '',
            IsActive: true,
            Name: '',
            BDId:0,
        }

        $scope.BranchList = [];
        $http({
            method: 'GET',
            url: base_url + "Setup/Security/GetAllBranchList",
            dataType: "json",
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.BranchList = res.data.Data;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    };
    $scope.ClearGodown = function () {

        $scope.newMaster = {
            TranId: 0
        };

        $scope.newGodown = {

            Address: '',
            AutoNumber: 0,
            ContactPerson: '',
            GodownId: 0,
            PhoneNo: '',
            LedgerId: 0,
            ParentGodownId: 0,
            ParentGodownName: '',
            IsActive: true,
            Mode: 'Save',
            Name: ''
        };
    }

    $scope.GodownList = [];
    $http({
        method: 'GET',
        url: base_url + "Inventory/Creation/GetAllGodown",
        dataType: "json",
    }).then(function (res) {
        if (res.data.IsSuccess && res.data.Data) {
            $scope.GodownList = res.data.Data;
        }
    }, function (reason) {
        Swal.fire('Failed' + reason);
    });
    $scope.LedgerList = [];
    $http({
        method: 'GET',
        url: base_url + "Account/Creation/GetLedgerList",
        dataType: "json",
    }).then(function (res) {
        if (res.data.IsSuccess && res.data.Data) {
            $scope.LedgerList = res.data.Data;
        }
    }, function (reason) {
        Swal.fire('Failed' + reason);
    });

    $scope.IsValidGodown = function () {
        if ($scope.newGodown.Name.isEmpty()) {
            Swal.fire("Please ! Enter Name");
            return false;
        }


        else
            return true;
    }

    $scope.SaveGodown = function () {
        if ($scope.IsValidGodown() == true) {
            if ($scope.confirmMSG.Accept == true) {
                var saveModify = $scope.beData.Mode;
                Swal.fire({
                    title: 'Do you want to' + saveModify + 'the current data?',
                    showCancelButton: true,
                    confirmButtonText: saveModify,
                }).then((result) => {
                    if (result.isConfirmed) {
                        $scope.CallSaveGodown();
                    }

                });
            }
            else
                $scope.CallSaveGodown();
        }
    };

    $scope.CallSaveGodown = function () {
        $scope.loadingstatus = 'running';
        showPleaseWait();

        if (!$scope.newGodown.LedgerId)
            $scope.newGodown.LedgerId = 0;

        $http({
            method: 'POST',
            url: base_url + "Inventory/Creation/SaveGodown",
            headers: { 'content-Type': undefined },

            transformRequest: function (data) {
                var formData = new FormData();
                formData.append("jsonData", angular.toJson(data.jsonData));
                return formData;
            },
            data: { jsonData: $scope.newGodown }
        }).then(function (res) {

            $scope.loadingstatus = "stop";
            hidePleaseWait();

            Swal.fire(res.data.ResponseMSG);
            if (res.data.IsSuccess == true) {
                $scope.ClearGodown();
                $scope.GetGodown();
            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
        });
    }
    $scope.GetGodown = function () {

        $scope.GodownColl = []; //declare an empty array

        if ($scope.loadingstatus != 'stop') {
            alert('Already Running Process')
            return;
        }

        $scope.loadingstatus = 'running';
        showPleaseWait();

        $http({
            method: 'GET',
            url: base_url + "Inventory/Creation/GetAllGodown",
            dataType: "json"
            //data:JSON.stringify(para)
        }).then(function (res) {

            $scope.loadingstatus = 'stop';
            hidePleaseWait();

            if (res.data.IsSuccess && res.data.Data) {
                $timeout(function () {
                    $scope.GodownColl = res.data.Data;
                });
            } else
                alert(res.data.ResponseMSG);

        }, function (reason) {
            alert('Failed' + reason);
        });

    }
    $scope.getGodownById = function (newGodown) {

        $scope.loadingstatus = "running";

        var para = {
            GodownId: newGodown.GodownId
        };

        $scope.newMaster = {
            TranId: newGodown.GodownId
        };
        $http({
            method: 'POST',
            url: base_url + "Inventory/Creation/getGodownById",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $timeout(function () {
                    $scope.newGodown = res.data.Data;
                    $scope.newGodown.Mode = 'Modify';
                    $('#custom-tabs-four-profile-tab').tab('show');
                });


            } else
                Swal.fire(res.data.ResponseMSG);


        }, function (reason) {
            alert('Failed' + reason);
        });
    };
    $scope.deleteGodown = function (refData, ind) {

        Swal.fire({
            title: 'Are you sure you want to delete ' + refData.Name + '?',
            showCancelButton: true,
            confirmButtonText: 'Delete',
            //message: 'Are you sure to delete selected Branch :-' + beData.Name,
        }).then((result) => {
            if (result.isConfirmed) {
                var para = { GodownId: refData.GodownId };
                $http({
                    method: 'POST',
                    url: base_url + "Inventory/Creation/DeleteGodown",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingStatus = "stop";

                    Swal.fire(res.data.ResponseMSG);
                    if (res.data.IsSuccess == true) {
                        $scope.GodownColl.splice(ind, 1);
                    }
                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }

        });
    }

    $scope.AuditLogColl = [];
    $scope.ShowAuditLog = function () {

        $scope.AuditLogColl = {};
        if ($scope.newMaster.TranId > 0) {

            $scope.loadingstatus = "running";
            showPleaseWait();

            GlobalServices.getAuditLog(EntityId, $scope.newMaster.TranId).then(function (res1) {
                $scope.loadingstatus = "stop";
                hidePleaseWait();
                if (res1.data.IsSuccess && res1.data.Data) {
                    $scope.AuditLogColl = res1.data.Data;
                    $('#frmAuditHis').modal('show');
                }
            }, function (reason) {
                Swal.fire('Failed' + reason);
            });

        }
    }
});