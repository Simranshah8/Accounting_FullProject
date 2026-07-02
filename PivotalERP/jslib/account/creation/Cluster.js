app.controller("Cluster", function ($scope, $http, $timeout, $filter, $compile, GlobalServices, $document) {
    $scope.Title = 'Cluster';

    $scope.LoadData = function () {
        $('.select2').select2();
        var glSrv = GlobalServices;
        $scope.perPageColl = GlobalServices.getPerPageList();

        $scope.currentPages = {
            Cluster: 1,
        };

        $scope.searchData = {
            Cluster: '',
        };

        $scope.perPage = {
            Cluster: GlobalServices.getPerPageRow(),
        };
        $scope.confirmMSG = GlobalServices.getConfirmMSG();

        $scope.beData = {
            ClusterName: '',
            Description: '',
            CircleID:null,
            Mode: "Save"
        }

        $scope.CircleList = [];
        $http({
            method: 'Post',
            url: base_url + "Account/Creation/GetAllCircle",
            dataType: "json"
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.CircleList = res.data.Data;

            } else {
                Swal.fire(res.data.ResponseMSG);
            }

        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        $scope.GetAllCluster();
    }

    $scope.ClearFields = function () {
        $scope.beData = {
            ClusterName: '',
            Description: '',
            CircleID: null,
            Mode: "Save"
        }
    }

    $scope.IsValidCluster = function () {
        if ($scope.beData.ClusterName.isEmpty()) {
            Swal.fire('Please ! Enter ClusterName');
            return false;
        }
        return true;
    };


    $scope.SaveUpdateCluster = function () {
        if ($scope.IsValidCluster() == true) {
            if ($scope.confirmMSG.Accept == true) {
                var saveModify = $scope.beData.Mode;
                Swal.fire({
                    title: 'Do you want to ' + saveModify + ' the current data?',
                    showCancelButton: true,
                    confirmButtonText: saveModify,
                }).then((result) => {
                    if (result.isConfirmed) {
                        $scope.CallSaveUpdateCluster();
                    }
                });
            } else
                $scope.CallSaveUpdateCluster();

        }
    };

    $scope.CallSaveUpdateCluster = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();

        $http({
            method: 'POST',
            url: base_url + "Account/Creation/SaveCluster",
            headers: { 'Content-Type': undefined },
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
                $scope.GetAllCluster();
                $scope.ClearFields();
            }


        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";

        });
    }


    $scope.GetClusterById = function (refData) {
        $scope.loadingstatus = "running";
        showPleaseWait();
        var para = {
            ClusterID: refData.ClusterID
        };
        $http({
            method: 'POST',
            url: base_url + "Account/Creation/GetClusterById",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.beData = res.data.Data;
                $scope.beData.Mode = 'Modify';
                $('#custom-tabs-four-profile-tab').tab('show');
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    };

    $scope.GetAllCluster = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();
        $http({
            method: 'POST',
            url: base_url + "Account/Creation/GetAllCluster",
            dataType: "json",
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.ClusterList = res.data.Data;
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            Swal.fire('Failed: ' + reason);
        });
    }

    $scope.DelCluster = function (refData, ind) {
        Swal.fire({
            title: 'Are you sure you want to delete ' + refData.ClusterName + '?',
            showCancelButton: true,
            confirmButtonText: 'Delete',
        }).then((result) => {
            if (result.isConfirmed) {
                var para = { ClusterID: refData.ClusterID };
                $http({
                    method: 'POST',
                    url: base_url + "Account/Creation/DeleteCluster",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingStatus = "stop";
                    Swal.fire(res.data.ResponseMSG);
                    if (res.data.IsSuccess == true) {
                        $scope.GetAllCluster();
                    }
                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }
        });
    }



})