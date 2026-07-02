app.controller("SourceController", function ($scope, $http, GlobalServices, $timeout) {
    $scope.Title = 'Source';
    LoadData();
    function LoadData() {
        $('.select2').select2();
        $scope.loadingstatus = "stop";
        $scope.confirmMSG = GlobalServices.getConfirmMSG();
        $scope.perPageColl = GlobalServices.getPerPageList();

        $scope.perPage = {
            Source: GlobalServices.getPerPageRow()
        };

        $scope.currentPages = {
            Source: 1

        };

        $scope.searchData = {
            Source: ''
        };

        $scope.beData =
        {
            SourceId: null,
            Name: '',
            Code: '',
            SNo: 0,
            StatusId: null
        };
    };
    $scope.ClearFields = function () {
        $scope.loadingstatus = "stop";
        $scope.beData =
        {
            SourceId: null,
            Name: '',
            Code: '',
            SNo: 0,
            StatusId: null
        };
    }
    
    $scope.GetAllSource = function () {
        $scope.SourceColl = []; //declare an empty array
        if ($scope.loadingstatus != 'stop') {
            alert('Already Running Process')
            return;
        }
        $scope.loadingstatus = 'running';
        showPleaseWait();
        $http({
            method: 'GET',
            url: base_url + "ComplaintTicket/Creation/GetAllSource",
            dataType: "json"
            //data:JSON.stringify(para)
        }).then(function (res) {
            $scope.loadingstatus = 'stop';
            hidePleaseWait();
            if (res.data.IsSuccess && res.data.Data) {
                $timeout(function () {
                    $scope.SourceColl = res.data.Data;
                });
            } else
                alert(res.data.ResponseMSG);
        }, function (reason) {
            alert('Failed' + reason);
        });

    }

    $scope.IsValidSource = function () {
        if ($scope.beData.Name.isEmpty()) {
            Swal.fire("Please ! Enter Name");
            return false;
        }
        else
            return true;
    }

    $scope.AddSource = function () {
        if ($scope.IsValidSource() == true) {
            if ($scope.confirmMSG.Accept == true) {
                var saveModify = $scope.beData.Mode;
                Swal.fire({
                    title: 'Do you want to' + saveModify + 'the current data?',
                    showCancelButton: true,
                    confirmButtonText: saveModify,
                }).then((result) => {
                    if (result.isConfirmed) {
                        $scope.CallSaveUpdateSource();
                    }
                });
            }
            else
                $scope.CallSaveUpdateSource();
        }
    };

    $scope.CallSaveUpdateSource = function () {
        $scope.loadingstatus = 'running';
        showPleaseWait();
        $http({
            method: 'POST',
            url: base_url + "ComplaintTicket/Creation/SaveSource",
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
                $scope.GetAllSource();
            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
        });
    }

    $scope.getSourceById = function (beData) {
        $scope.loadingstatus = "running";
        var para = {
            SourceId: beData.SourceId
        };
        $http({
            method: 'POST',
            url: base_url + "ComplaintTicket/Creation/getSourceById",
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

    $scope.deleteSource = function (refData, ind) {
        Swal.fire({
            title: 'Are you sure you want to delete ' + refData.Name + '?',
            showCancelButton: true,
            confirmButtonText: 'Delete',
            //message: 'Are you sure to delete selected Branch :-' + beData.Name,
        }).then((result) => {
            if (result.isConfirmed) {
                var para = { SourceId: refData.SourceId };
                $http({
                    method: 'POST',
                    url: base_url + "ComplaintTicket/Creation/deleteSource",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingStatus = "stop";

                    Swal.fire(res.data.ResponseMSG);
                    if (res.data.IsSuccess == true) {
                        $scope.SourceColl.splice(ind, 1);
                    }
                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }
        });
    }
});