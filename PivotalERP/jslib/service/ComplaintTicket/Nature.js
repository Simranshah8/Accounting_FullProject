app.controller("NatureController", function ($scope, $http, GlobalServices, $timeout) {
    $scope.Title = 'Nature';
    LoadData();
    function LoadData() {
        $('.select2').select2();
        $scope.loadingstatus = "stop";
        $scope.confirmMSG = GlobalServices.getConfirmMSG();
        $scope.perPageColl = GlobalServices.getPerPageList();

        $scope.perPage = {
            Nature: GlobalServices.getPerPageRow(),
        };

        $scope.currentPages = {
            Nature: 1
        };

        $scope.searchData = {
            Nature: ''
        };

        $scope.beData =
        {
            NatureId: 0,
            Name: '',
            Code: '',
            SNo: 0,
            Status:true,
            StatusId: null
        };
    };

    $scope.ClearFields = function () {
        $scope.loadingstatus = "stop";
        $scope.beData =
        {
            NatureId: 0,
            Name: '',
            Code: '',
            SNo: 0,
            Status: true,
            StatusId: null
        };
    }

    $scope.GetAllNature = function () {
        $scope.NatureColl = []; //declare an empty array
        if ($scope.loadingstatus != 'stop') {
            alert('Already Running Process')
            return;
        }
        $scope.loadingstatus = 'running';
        showPleaseWait();
        $http({
            method: 'GET',
            url: base_url + "Service/Creation/GetAllNature",
            dataType: "json"
            //data:JSON.stringify(para)
        }).then(function (res) {
            $scope.loadingstatus = 'stop';
            hidePleaseWait();
            if (res.data.IsSuccess && res.data.Data) {
                $timeout(function () {
                    $scope.NatureColl = res.data.Data;
                });
            } else
                alert(res.data.ResponseMSG);
        }, function (reason) {
            alert('Failed' + reason);
        });

    }


    $scope.IsValidNature = function () {
        if ($scope.beData.Name.isEmpty()) {
            Swal.fire("Please ! Enter Nature Name");
            return false;
        }
        else
            return true;
    }

    $scope.AddNature = function () {
        if ($scope.IsValidNature() == true) {
            if ($scope.confirmMSG.Accept == true) {
                var saveModify = $scope.beData.Mode;
                Swal.fire({
                    title: 'Do you want to' + saveModify + 'the current data?',
                    showCancelButton: true,
                    confirmButtonText: saveModify,
                }).then((result) => {
                    if (result.isConfirmed) {
                        $scope.CallSaveUpdateNature();
                    }
                });
            }
            else
                $scope.CallSaveUpdateNature();
        }
    };

    $scope.CallSaveUpdateNature = function () {
        $scope.loadingstatus = 'running';
        showPleaseWait();
        $http({
            method: 'POST',
            url: base_url + "Service/Creation/SaveNature",
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
                $scope.GetAllNature();
            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
        });
    }


    $scope.getNatureById = function (beData) {
        $scope.loadingstatus = "running";
        var para = {
            NatureId: beData.NatureId
        };
        $http({
            method: 'POST',
            url: base_url + "Service/Creation/getNatureById",
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
    };

    $scope.deleteNature = function (refData, ind) {
        Swal.fire({
            title: 'Are you sure you want to delete ' + refData.Name + '?',
            showCancelButton: true,
            confirmButtonText: 'Delete',
            //message: 'Are you sure to delete selected Branch :-' + beData.Name,
        }).then((result) => {
            if (result.isConfirmed) {
                var para = { NatureId: refData.NatureId };
                $http({
                    method: 'POST',
                    url: base_url + "Service/Creation/deleteNature",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingStatus = "stop";
                    Swal.fire(res.data.ResponseMSG);
                    if (res.data.IsSuccess == true) {
                        $scope.NatureColl.splice(ind, 1);
                    }
                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }
        });
    }

});