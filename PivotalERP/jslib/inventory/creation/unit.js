app.controller('Unit', function ($scope, $filter, $http, $timeout, GlobalServices) {
    $scope.Title = 'Unit';

    LoadData();
    function LoadData() {

        $scope.loadingstatus = "stop";
        $scope.confirmMSG = GlobalServices.getConfirmMSG();
        $scope.perPageColl = GlobalServices.getPerPageList();

        $scope.TypeOfUnitColl = [{ id: 1, text: 'Quantity' }, { id: 2, text: 'Weight' }, { id: 3, text: 'Volumn' },];
        $scope.perPage = {
            ProductUnit: GlobalServices.getPerPageRow(),

        };

        $scope.currentPages = {
            ProductUnit: 1

        };
        $scope.searchData = {
            ProductUnit: ''
        };
        $scope.newUnit =
        {
            SNo: 0,
            Name: '',
            Alias: '',
            UnitId: 0,
            NoOfDecimalPlaces: 0,
            RateNoOfDecimalPlaces: 0,
            AmountNoOfDecimalPlaces: 0,
            TypeOfUnit:1,
            Mode: 'Save'
        }
    };
    $scope.ClearFields = function () {
        $scope.newMaster = {
            TranId: 0
        };

        $scope.loadingstatus = "stop";
            $scope.newUnit = {
                SNo: 0,
                Name: '',
                UnitId: 0,
                Alias: '',
                NoOfDecimalPlaces: 0,
                RateNoOfDecimalPlaces: 0,
                AmountNoOfDecimalPlaces: 0,
                TypeOfUnit: 1,
                Mode: 'Save',                 
            };
      }

    $scope.IsValidUnit = function () {
        if ($scope.newUnit.Name.isEmpty()) {
            Swal.fire("Please ! Enter Unit Name");
            return false;
        }
        else
            return true;
    }

    $scope.SaveUpdateUnit = function () {
        if ($scope.IsValidUnit() == true) {
            if ($scope.confirmMSG.Accept == true) {
                var saveModify = $scope.newUnit.Mode;
                Swal.fire({
                    title: 'Do you want to' + saveModify + 'the current data?',
                    showCancelButton: true,
                    confirmButtonText: saveModify,
                }).then((result) => {
                    if (result.isConfirmed) {
                        $scope.CallSaveUpdateUnit();
                    }

                });
            }
            else
                $scope.CallSaveUpdateUnit();
        }
    };

    $scope.CallSaveUpdateUnit = function () {
        $scope.loadingstatus = 'running';
        showPleaseWait();

        
        $http({
            method: 'POST',
            url: base_url + "Inventory/Creation/SaveUnit",
            headers: { 'content-Type': undefined },

            transformRequest: function (data) {
                var formData = new FormData();
                formData.append("jsonData", angular.toJson(data.jsonData));
                return formData;
            },
            data: { jsonData: $scope.newUnit }
        }).then(function (res) {

            $scope.loadingstatus = "stop";
            hidePleaseWait();

            Swal.fire(res.data.ResponseMSG);
            if (res.data.IsSuccess == true) {
                $scope.ClearUnit();
                $scope.GetAllUnit();
            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
        });
    }

    $scope.GetAllUnit = function () {

        $scope.UnitColl = []; //declare an empty array

        if ($scope.loadingstatus != 'stop') {
            alert('Already Running Process')
            return;
        }

        $scope.loadingstatus = 'running';
        showPleaseWait();

        $http({
            method: 'GET',
            url: base_url + "Inventory/Creation/GetAllUnit",
            dataType: "json"
            //data:JSON.stringify(para)
        }).then(function (res) {

            $scope.loadingstatus = 'stop';
            hidePleaseWait();

            if (res.data.IsSuccess && res.data.Data) {
                $timeout(function () {
                    $scope.UnitColl = res.data.Data;
                });
            } else
                alert(res.data.ResponseMSG);

        }, function (reason) {
            alert('Failed' + reason);
        });

    }
    $scope.getUnitByIdd = function (newUnit) {

        $scope.loadingstatus = "running";

        var para = {
            UnitId: newUnit.UnitId
        };

        $scope.newMaster = {
            TranId: newUnit.UnitId
        };

        $http({
            method: 'POST',
            url: base_url + "Inventory/Creation/getUnitById",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $timeout(function () {
                    $scope.newUnit = res.data.Data;
                    $scope.newUnit.Mode = 'Modify';
                    $('#custom-tabs-four-profile-tab').tab('show');
                });


            } else
                Swal.fire(res.data.ResponseMSG);


        }, function (reason) {
            alert('Failed' + reason);
        });
    };
    $scope.deleteUnit = function (refData, ind) {

        Swal.fire({
            title: 'Are you sure you want to delete ' + refData.Name + '?',
            showCancelButton: true,
            confirmButtonText: 'Delete',
            //message: 'Are you sure to delete selected Branch :-' + beData.Name,
        }).then((result) => {
            if (result.isConfirmed) { 
                var para = { UnitId: refData.UnitId };
                $http({
                    method: 'POST',
                    url: base_url + "Inventory/Creation/deleteUnit",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingStatus = "stop";

                    Swal.fire(res.data.ResponseMSG);
                    if (res.data.IsSuccess == true) {
                        $scope.UnitColl.splice(ind, 1);
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