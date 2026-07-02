app.controller("NarrationMaster", function ($scope, $http,$timeout,GlobalServices) {
    $scope.Title = 'Narration Master';

    LoadData();

    function LoadData() {
        $scope.loadingstatus = "stop";


        $scope.confirmMSG = GlobalServices.getConfirmMSG();
        $scope.perPageColl = GlobalServices.getPerPageList();

        $scope.perPage = {
            NarrationMaster: GlobalServices.getPerPageRow(),

        };
        $scope.currentPages = {
            NarrationMaster: 1

        };
        $scope.searchData = {
            NarrationMaster: ''

        };

        $scope.beData =
        {
            NarrationMasterId: 0,
            Name: '',
            Alias: '',
            Description: '',
            VoucherTypes: [],
            Mode: 'Save'
        };

        $http({
            method: 'GET',
            url: base_url + "Account/Creation/GetVoucherTypes",
            dataType: "json",
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.VoucherTypeList = res.data.Data;
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        $scope.CheckedAll = false;


    };
    $scope.CheckAllVoucher = function () {
        angular.forEach($scope.VoucherTypeList, function (vt) {
            vt.IsChecked = $scope.CheckedAll;
        });
    }

    $scope.ClearFields = function () {
        $scope.loadingstatus = "stop";
        $scope.newMaster = {
            TranId: 0
        };
        $scope.beData =
        {
            NarrationMasterId: 0,
            Name: '',
            Alias: '',
            Description: '',
            VoucherTypes: [],
            Mode: 'Save'
        };

        $scope.CheckedAll = false;
        angular.forEach($scope.VoucherTypeList, function (vt) {
            vt.IsChecked = false;
        });

    }


    $scope.GetAllNarrationMasterList = function () {
        $scope.noofrows = 10;

        $scope.NarrationMasterColl = []; //declare an empty array

        if ($scope.loadingstatus != 'stop') {
            alert('Already Running Process')
            return;
        }

        $scope.loadingstatus = 'running';
        showPleaseWait();

        $http({
            method: 'GET',
            url: base_url + "Account/Creation/GetAllNarrationMaster",
            dataType: "json"
            //data:JSON.stringify(para)
        }).then(function (res) {

            $scope.loadingstatus = 'stop';
            hidePleaseWait();

            if (res.data.IsSuccess && res.data.Data) {
                $timeout(function () {
                    $scope.NarrationMasterColl = res.data.Data;
                });
            } else
                alert(res.data.ResponseMSG);

        }, function (reason) {
            alert('Failed' + reason);
        });

    }

    $scope.Validate = function () {
        if ($scope.beData.Name.isEmpty()) {
            Swal.fire("Please ! Enter Valid Narration Master Name");
            return false;
        }
        else
            return true;
    }


    $scope.AddNarrationMaster = function () {
        if ($scope.Validate() == true) {
            if ($scope.confirmMSG.Accept == true) {
                var saveModify = $scope.beData.Mode;
                Swal.fire({
                    title: 'Do you want to' + saveModify + 'the current data?',
                    showCancelButton: true,
                    confirmButtonText: saveModify,
                }).then((result) => {
                    if (result.isConfirmed) {
                        $scope.CallSaveUpdateNarrationMaster();
                    }

                });
            }
            else
                $scope.CallSaveUpdateNarrationMaster();
        }
    };

    $scope.CallSaveUpdateNarrationMaster = function () {
        $scope.loadingstatus = 'running';
        showPleaseWait();

        $scope.beData.VoucherTypes = [];
        angular.forEach($scope.VoucherTypeList, function (vt) {
            if (vt.IsChecked && vt.IsChecked == true)
                $scope.beData.VoucherTypes.push(vt.id);
        });

        $http({
            method: 'POST',
            url: base_url + "Account/Creation/SaveNarrationMaster",
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
                $scope.GetAllNarrationMasterList();
            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
        });
    }
    

    $scope.getNarrationMasterById = function (beData) {

        $scope.loadingstatus = "running";
        showPleaseWait();

        var para = {
            NarrationMasterId: beData.NarrationMasterId
        };

        $scope.newMaster = {
            TranId: beData.NarrationMasterId
        };
        $http({
            method: 'POST',
            url: base_url + "Account/Creation/GetNarrationMasterById",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {

                hidePleaseWait();
                $scope.loadingstatus = "stop";

                $timeout(function () {
                    $scope.beData = res.data.Data;

                    var mxVT = mx(res.data.Data.VoucherTypes);
                    angular.forEach($scope.VoucherTypeList, function (vt)
                    {
                        if (mxVT.contains(vt.id)) {
                            vt.IsChecked = true;
                        } else
                            vt.IsChecked = false;
                    });

                    $scope.beData.Mode = 'Modify';
                    $('#custom-tabs-four-profile-tab').tab('show');
                });
            } else
                Swal.fire(res.data.ResponseMSG);

        }, function (reason) {
            alert('Failed' + reason);
        });
    }
    $scope.deleteNarrationMaster = function (refData, ind) {

        Swal.fire({
            //scope: $scope,
            title: 'Are you sure you want to delete ' + refData.Name + '?',
            showCancelButton: true,
            confirmButtonText: 'Delete',
            icon: "info",
            //message: 'Are you sure to delete selected Branch :-' + beData.Name,
        }).then((result) => {
            if (result.isConfirmed) {
                $scope.loadingstatus = "running";
                showPleaseWait();
                var para = { NarrationMasterId: refData.NarrationMasterId };
                $http({
                    method: 'POST',
                    url: base_url + "Account/Creation/DeleteNarrationMaster",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingstatus = "stop";
                    Swal.fire(res.data.ResponseMSG);
                    if (res.data.IsSuccess) {
                        $scope.NarrationMasterColl.splice(ind, 1);
                    }

                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }
        });
    }
    $scope.pageChangeHandler = function (num) {
        console.log('page changed to ' + num);
    };

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