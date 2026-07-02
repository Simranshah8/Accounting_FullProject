app.controller("GateMasterController", function ($scope, $filter, $http, $timeout, GlobalServices) {
    $scope.Title = 'Gate Master';

    $scope.LoadData = function () {
        $('.select2').select2();

        $scope.perPageColl = GlobalServices.getPerPageList();

        $scope.currentPages = {
            GateMaster: 1,
        };

        $scope.searchData = {
            GateMaster: '',
        };

        $scope.perPage = {
            GateMaster: GlobalServices.getPerPageRow(),
        };


        $scope.GateTypeColl = [
            { id: 1, text: 'INWARD' },
            { id: 2, text: 'OUTWARD' },
            { id: 3, text: 'BOTH' }
        ];

        //$scope.VoucherColl = [
        //    { id: 1, text: 'Voucher A' },
        //    { id: 2, text: 'Voucher B' },
        //    { id: 3, text: 'Voucher C' }
        //];

        $scope.BranchList = [];
        $http({
            method: 'GET',
            url: base_url + "Setup/Security/GetAllBranchList",
            dataType: "json"
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.BranchList = res.data.Data;

            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        $scope.VoucherTypeList = [];
        $http({
            method: 'GET',
            url: base_url + "Account/Reporting/GetAllVoucherList",
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

        $scope.newDet = {
            BranchId: null,
            Code: '',
            Name: '',
            GateType: '',
            VoucherId: null,
            IsActive: true,

            Mode: "Save"
        }
        $scope.confirmMSG = GlobalServices.getConfirmMSG();
        $scope.GetAllGateMaster();
    }
    $scope.ClearFields = function () {
        $scope.newDet = {
            BranchId: null,
            Code: '',
            Name: '',
            GateType: '',
            VoucherId: null,
            IsActive: true,

            Mode: "Save"
        }
    }
    $scope.IsValidGateMaster = function () {
        return true;
    }



    $scope.SaveUpdateGateMaster = function () {
        if ($scope.IsValidGateMaster() == true) {
            if ($scope.confirmMSG.Accept == true) {
                var saveModify = $scope.newDet.Mode;
                Swal.fire({
                    title: 'Do you want to' + saveModify + 'the current data?',
                    showCancelButton: true,
                    confirmButtonText: saveModify,
                }).then((result) => {
                    if (result.isConfirmed) {
                        $scope.CallSaveUpdateGateMaster();
                    }

                });
            }
            else
                $scope.CallSaveUpdateGateMaster();
        }
    };

    $scope.CallSaveUpdateGateMaster = function () {
        $scope.loadingstatus = 'running';
        showPleaseWait();

        $http({
            method: 'POST',
            url: base_url + "GateMaster/Creation/SaveGateMaster",
            headers: { 'content-Type': undefined },

            transformRequest: function (data) {
                var formData = new FormData();
                formData.append("jsonData", angular.toJson(data.jsonData));
                return formData;
            },
            data: { jsonData: $scope.newDet }
        }).then(function (res) {

            $scope.loadingstatus = "stop";
            hidePleaseWait();

            Swal.fire(res.data.ResponseMSG);
            if (res.data.IsSuccess == true) {
                $scope.ClearFields();
                $scope.GetAllGateMaster();
            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
        });
    }

    $scope.GetAllGateMaster = function () {
        $scope.loadingstatus = 'running';
        showPleaseWait();
        $scope.GateMasterList = [];
        $http({
            method: 'POST',
            url: base_url + "GateMaster/Creation/GetAllGateMaster",
            dataType: "json"
        }).then(function (res) {

            $scope.loadingstatus = 'stop';
            hidePleaseWait();

            if (res.data.IsSuccess && res.data.Data) {
                $scope.GateMasterList = res.data.Data;
                $scope.GateMasterList = res.data.Data;
            } else
                Swal.fire(res.data.ResponseMSG);

        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    }

    $scope.GetGateMasterById = function (beData) {

        $scope.loadingstatus = "running";
        var para = {
            GateId: beData.GateId
        };
        $http({
            method: 'POST',
            url: base_url + "GateMaster/Creation/GetGateMasterById",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $timeout(function () {
                    $scope.newDet = res.data.Data;
                    $scope.newDet.Mode = 'Modify';

                    $('#custom-tabs-four-profile-tab').tab('show');
                });
            } else
                Swal.fire(res.data.ResponseMSG);

        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    }

    $scope.deleteGateMaster = function (refData, ind) {
        Swal.fire({
            title: 'Are you sure to delete Gate Master:-' + refData.Name,
            showCancelButton: true,
            confirmButtonText: 'Delete',
        }).then((result) => {
            if (result.isConfirmed) {
                $scope.loadingstatus = "running";
                showPleaseWait();

                var para = {
                    GateId: refData.GateId
                };

                $http({
                    method: 'POST',
                    url: base_url + "GateMaster/Creation/DelGateMaster",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingstatus = "stop";
                    Swal.fire(res.data.ResponseMSG);
                    if (res.data.IsSuccess) {
                        $scope.GetAllGateMaster();
                    }

                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }
        });

    }


})