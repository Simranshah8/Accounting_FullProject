app.controller('Methods', function ($scope, $filter, $http, $timeout, GlobalServices) {
    $scope.Title = 'Methods';
    var glSrv = GlobalServices;


    LoadData();

    function LoadData() {

        $scope.loadingstatus = "stop";

        $scope.confirmMSG = GlobalServices.getConfirmMSG();
        $scope.perPageColl = GlobalServices.getPerPageList();


        $scope.currentPages = {
            Methods: 1

        };

        $scope.searchData = {
            Methods: ''

        };

        $scope.perPage = {
            Methods: GlobalServices.getPerPageRow(),

        };

        $scope.beData =
        {
            MethodId: 0,
            Name: '',
            Code: '',
            Category: '',
            Notes: '',
            Mode: 'Save'

        }
    };

    $scope.ClearFields = function () {
        $scope.beData =
        {
            MethodId: 0,
            Name: '',
            Code: '',
            Category: '',
            Notes: '',
        };
    }

    $scope.GetAllMethods = function () {


        $scope.MethodsColl = []; //declare an empty array

        if ($scope.loadingstatus != 'stop') {
            alert('Already Running Process')
            return;
        }

        $scope.loadingstatus = 'running';
        showPleaseWait();

        $http({
            method: 'POST',
            url: base_url + "Lab/Creation/GetAllMethods",
            dataType: "json"
            //data:JSON.stringify(para)
        }).then(function (res) {

            $scope.loadingstatus = 'stop';
            hidePleaseWait();

            if (res.data.IsSuccess && res.data.Data) {
                $timeout(function () {
                    $scope.MethodsColl = res.data.Data;
                });
            } else
                alert(res.data.ResponseMSG);

        }, function (reason) {
            alert('Failed' + reason);
        });

    }

    $scope.IsValidMethods = function () {
        //if ($scope.newMethods.Name.isEmpty()) {
        //    Swal.fire("Please ! Enter Product Name");
        //    return false;
        //}
        //else
        return true;
    }

    $scope.SaveUpdateMethods = function () {
        if ($scope.IsValidMethods() == true) {
            if ($scope.confirmMSG.Accept == true) {
                var saveModify = $scope.beData.Mode;
                Swal.fire({
                    title: 'Do you want to' + saveModify + 'the current data?',
                    showCancelButton: true,
                    confirmButtonText: saveModify,
                }).then((result) => {
                    if (result.isConfirmed) {
                        $scope.CallSaveUpdateMethods();
                    }

                });
            }
            else
                $scope.CallSaveUpdateMethods();
        }
    };

    $scope.CallSaveUpdateMethods = function () {
        $scope.loadingstatus = 'running';
        showPleaseWait();

        $http({
            method: 'POST',
            url: base_url + "Lab/Creation/SaveMethods",
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
                $scope.GetAllMethods();
            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
        });
    }

    $scope.getMethodsById = function (beData) {

        $scope.loadingstatus = "running";
        var para = {
            MethodId: beData.MethodId
        };

        $scope.newMaster = {
            TranId: beData.MethodId
        };

        $http({
            method: 'POST',
            url: base_url + "Lab/Creation/GetMethodsById",
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

    $scope.deleteMethods = function (refData, ind) {

        Swal.fire({
            title: 'Are you sure to delete selected Method:-' + refData.Name,
            showCancelButton: true,
            confirmButtonText: 'Delete',
        }).then((result) => {
            if (result.isConfirmed) {
                $scope.loadingstatus = "running";
                showPleaseWait();

                var para = {
                    MethodId: refData.MethodId
                };

                $http({
                    method: 'POST',
                    url: base_url + "Lab/Creation/DelMethods",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingstatus = "stop";
                    Swal.fire(res.data.ResponseMSG);
                    if (res.data.IsSuccess) {
                        $scope.MethodsColl.splice(ind, 1);
                    }

                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }
        });

    }
});