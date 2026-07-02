app.controller("AppointmentTypeController", function ($scope, $filter, $http, $timeout, GlobalServices) {
    $scope.Title = 'Appointment Type';

    $scope.LoadData = function () {
        $('.select2').select2();

        $scope.perPageColl = GlobalServices.getPerPageList();

        $scope.currentPages = {
            AppointmentType: 1,
        };

        $scope.searchData = {
            AppointmentType: '',
        };

        $scope.perPage = {
            AppointmentType: GlobalServices.getPerPageRow(),
        };

        $scope.AppointmentTypeColl = [
            { id: 1, name: "New" },
            { id: 2, name: "Follow-Up" },
            { id: 3, name: "Review" },
            {id:4, name: "Teleconsult"}
        ]
        $scope.newAppointmentType = {
            AppointmentId: null,
            AppointmentTypeId: null,
            OrderNo: "",
            IsActive: false,
            Remarks: "",
            Mode: "Save"
        }
        $scope.confirmMSG = GlobalServices.getConfirmMSG();
    //    $scope.GetAllAppointmentType();
    }



    $scope.ClearFields = function () {
        $scope.newAppointmentType = {
            AppointmentTypeId: null,
            OrderNo: "",
            IsActive: false,
            Remarks: "",
            Mode: "Save"
        }
    }
    $scope.IsValidAppointmentType = function () {
        return true;
    }
    $scope.GetAllAppointmentType = function () {
        $scope.loadingstatus = 'running';
        showPleaseWait();

        $http({
            method: 'POST',
            url: base_url + "Appointment/Creation/GetAllAppointmentType",
            dataType: "json"
        }).then(function (res) {

            $scope.loadingstatus = 'stop';
            hidePleaseWait();

            if (res.data.IsSuccess && res.data.Data) {
                $scope.AppointmentTypeList = res.data.Data;
            } else
                Swal.fire(res.data.ResponseMSG);

        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    }


    $scope.SaveUpdateAppointmentType = function () {
        if ($scope.IsValidAppointmentType() == true) {
            if ($scope.confirmMSG.Accept == true) {
                var saveModify = $scope.newAppointmentType.Mode;
                Swal.fire({
                    title: 'Do you want to' + saveModify + 'the current data?',
                    showCancelButton: true,
                    confirmButtonText: saveModify,
                }).then((result) => {
                    if (result.isConfirmed) {
                        $scope.CallSaveUpdateAppointmentType();
                    }

                });
            }
            else
                $scope.CallSaveUpdateAppointmentType();
        }
    };


    $scope.CallSaveUpdateAppointmentType = function () {
        $scope.loadingstatus = 'running';
        showPleaseWait();

        $http({
            method: 'POST',
            url: base_url + "Appointment/Creation/SaveAppointmentType",
            headers: { 'content-Type': undefined },

            transformRequest: function (data) {
                var formData = new FormData();
                formData.append("jsonData", angular.toJson(data.jsonData));
                return formData;
            },
            data: { jsonData: $scope.newAppointmentType }
        }).then(function (res) {

            $scope.loadingstatus = "stop";
            hidePleaseWait();

            Swal.fire(res.data.ResponseMSG);
            if (res.data.IsSuccess == true) {
                $scope.ClearFields();
                $scope.GetAllAppointmentType();
            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
        });
    }

    $scope.GetAppointmentTypeById = function (beData) {

        $scope.loadingstatus = "running";
        var para = {
            AppointmentId: beData.AppointmentId
        };
        $http({
            method: 'POST',
            url: base_url + "Appointment/Creation/GetAppointmentTypeById",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $timeout(function () {
                    $scope.newAppointmentType = res.data.Data;
                    $scope.newAppointmentType.Mode = 'Modify';
                    $('#custom-tabs-four-profile-tab').tab('show');
                });
            } else
                Swal.fire(res.data.ResponseMSG);

        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    }


    $scope.deleteAppointmentType = function (refData, ind) {

        Swal.fire({
            title: 'Are you sure to delete AppointmentType:-' + refData.AppointmentTypeName,
            showCancelButton: true,
            confirmButtonText: 'Delete',
        }).then((result) => {
            if (result.isConfirmed) {
                $scope.loadingstatus = "running";
                showPleaseWait();

                var para = {
                    AppointmentId: refData.AppointmentId
                };

                $http({
                    method: 'POST',
                    url: base_url + "Appointment/Creation/DelAppointmentType",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingstatus = "stop";
                    Swal.fire(res.data.ResponseMSG);
                    if (res.data.IsSuccess) {
                        $scope.GetAllAppointmentType();
                    }

                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }
        });

    }
})