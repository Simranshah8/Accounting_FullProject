app.controller('Rack', function ($scope, $filter, $http, $timeout, GlobalServices) {
    $scope.Title = 'Rack';

    LoadData();
    function LoadData() {
        $('.select2').select2();
        $scope.loadingstatus = "stop";
        $scope.confirmMSG = GlobalServices.getConfirmMSG();
        $scope.perPageColl = GlobalServices.getPerPageList();

        $scope.perPage = {
            Rack: GlobalServices.getPerPageRow(),

        };

        $scope.currentPages = {
            Rack: 1

        };
        $scope.searchData = {
            Rack: ''
        };
        $scope.newRack =
        {
            
            Name: '',
            Alias: '',
            Alias: '',
            Code:'',
            RackId: 0,
            GodownId:null,
            Mode: 'Save'
        }
        $scope.GodownList = [];
        $http({
            method: 'GET',
            url: base_url + "Inventory/Creation/GetUserWiseGodown",
            dataType: "json",
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.GodownList = res.data.Data;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    };
    $scope.ClearRack = function () {
        $scope.loadingstatus = "stop";

        $scope.newMaster = {
            TranId: 0
        };

        $scope.newRack = {

            Name: '',
            Alias: '',
           
            Code: '',
            RackId: 0,
            Mode: 'Save'

        };
    }

    $scope.IsValidRack = function () {
        if ($scope.newRack.Name.isEmpty()) {
            Swal.fire("Please ! Enter the Name of Rack");
            return false;
        }
        else
            return true;
    }

    $scope.SaveRack = function () {
        if ($scope.IsValidRack() == true) {
            if ($scope.confirmMSG.Accept == true) {
                var saveModify = $scope.newRack.Mode;
                Swal.fire({
                    title: 'Do you want to' + saveModify + 'the current data?',
                    showCancelButton: true,
                    confirmButtonText: saveModify,
                }).then((result) => {
                    if (result.isConfirmed) {
                        $scope.CallSaveUpdateRack();
                    }

                });
            }
            else
                $scope.CallSaveUpdateRack();
        }
    };

    $scope.CallSaveUpdateRack = function () {
        $scope.loadingstatus = 'running';
        showPleaseWait();

        $http({
            method: 'POST',
            url: base_url + "Inventory/Creation/SaveRack",
            headers: { 'content-Type': undefined },

            transformRequest: function (data) {
                var formData = new FormData();
                formData.append("jsonData", angular.toJson(data.jsonData));
                return formData;
            },
            data: { jsonData: $scope.newRack }
        }).then(function (res) {

            $scope.loadingstatus = "stop";
            hidePleaseWait();

            Swal.fire(res.data.ResponseMSG);
            if (res.data.IsSuccess == true) {
                $scope.ClearRack();
                $scope.GetAllRack();
            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
        });
    }

    $scope.GetAllRack = function () {

        $scope.RackColl = []; //declare an empty array

        if ($scope.loadingstatus != 'stop') {
            alert('Already Running Process')
            return;
        }

        $scope.loadingstatus = 'running';
        showPleaseWait();

        $http({
            method: 'GET',
            url: base_url + "Inventory/Creation/GetAllRack",
            dataType: "json"
            //data:JSON.stringify(para)
        }).then(function (res) {

            $scope.loadingstatus = 'stop';
            hidePleaseWait();

            if (res.data.IsSuccess && res.data.Data) {
                $timeout(function () {
                    $scope.RackColl = res.data.Data;
                });
            } else
                alert(res.data.ResponseMSG);

        }, function (reason) {
            alert('Failed' + reason);
        });

    }
    $scope.getRackById = function (newRack) {

        $scope.loadingstatus = "running";

        var para = {
            RackId: newRack.RackId
        };

        $scope.newMaster = {
            TranId: newRack.RackId
        };

        $http({
            method: 'POST',
            url: base_url + "Inventory/Creation/getRackById",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $timeout(function () {
                    $scope.newRack = res.data.Data;
                    $scope.newRack.Mode = 'Modify';
                    $('#custom-tabs-four-profile-tab').tab('show');
                });


            } else
                Swal.fire(res.data.ResponseMSG);


        }, function (reason) {
            alert('Failed' + reason);
        });
    };
    $scope.deleteRack = function (refData, ind) {

        Swal.fire({
            title: 'Are you sure you want to delete ' + refData.Name + '?',
            showCancelButton: true,
            confirmButtonText: 'Delete',
            //message: 'Are you sure to delete selected Branch :-' + beData.Name,
        }).then((result) => {
            if (result.isConfirmed) {
                var para = { RackId: refData.RackId };
                $http({
                    method: 'POST',
                    url: base_url + "Inventory/Creation/DeleteRack",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingStatus = "stop";

                    Swal.fire(res.data.ResponseMSG);
                    if (res.data.IsSuccess == true) {
                        $scope.RackColl.splice(ind, 1);
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