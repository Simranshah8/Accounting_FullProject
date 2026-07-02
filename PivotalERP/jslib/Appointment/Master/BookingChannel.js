app.controller("BookingChannelController", function ($scope, $filter, $http, $timeout, GlobalServices) {
    $scope.Title = 'BookingChannel';

    $scope.LoadData = function () {
        $('.select2').select2();

        $scope.perPageColl = GlobalServices.getPerPageList();

        $scope.currentPages = {
            BookingChannel: 1,
        };

        $scope.searchData = {
            BookingChannel: '',
        };

        $scope.perPage = {
            BookingChannel: GlobalServices.getPerPageRow(),
        };

        $scope.loadingstatus = "stop";

        $scope.BookingChannelColl = [
            { id: 1, name: "Call" },
            { id: 2, name: "App" },
            { id: 3, name: "Web" },
            {id: 4, name: "Walk-In"}
        ]
        $scope.newBookingChannel = {
            BookingId: null,
            BookingChannelId: null,
            OrderNo: "",
            IsActive: false,
            Remarks: "",
            Mode: "Save"
        }
        $scope.confirmMSG = GlobalServices.getConfirmMSG();
    //    $scope.GetAllBookingChannel();
    }
    $scope.ClearFields = function () {
        $scope.newBookingChannel = {
            BookingId: null,
            BookingChannelId: null,
            OrderNo: "",
            IsActive: false,
            Remarks: "",
            Mode: "Save"
        }
    }
    $scope.IsValidBookingChannel = function () {
        return true;
    }
    $scope.GetAllBookingChannel = function () {
        $scope.loadingstatus = 'running';
        showPleaseWait();

        $http({
            method: 'POST',
            url: base_url + "Appointment/Creation/GetAllBookingChannel",
            dataType: "json"
        }).then(function (res) {

            $scope.loadingstatus = 'stop';
            hidePleaseWait();

            if (res.data.IsSuccess && res.data.Data) {
                $scope.BookingChannelList = res.data.Data;
            } else
                Swal.fire(res.data.ResponseMSG);

        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    }
    $scope.SaveUpdateBookingChannel = function () {
        if ($scope.IsValidBookingChannel() == true) {
            if ($scope.confirmMSG.Accept == true) {
                var saveModify = $scope.newBookingChannel.Mode;
                Swal.fire({
                    title: 'Do you want to' + saveModify + 'the current data?',
                    showCancelButton: true,
                    confirmButtonText: saveModify,
                }).then((result) => {
                    if (result.isConfirmed) {
                        $scope.CallSaveUpdateBookingChannel();
                    }

                });
            }
            else
                $scope.CallSaveUpdateBookingChannel();
        }
    };

    $scope.CallSaveUpdateBookingChannel = function () {
        $scope.loadingstatus = 'running';
        showPleaseWait();

        $http({
            method: 'POST',
            url: base_url + "Appointment/Creation/SaveBookingChannel",
            headers: { 'content-Type': undefined },

            transformRequest: function (data) {
                var formData = new FormData();
                formData.append("jsonData", angular.toJson(data.jsonData));
                return formData;
            },
            data: { jsonData: $scope.newBookingChannel }
        }).then(function (res) {

            $scope.loadingstatus = "stop";
            hidePleaseWait();

            Swal.fire(res.data.ResponseMSG);
            if (res.data.IsSuccess == true) {
                $scope.ClearFields();
                $scope.GetAllBookingChannel();
            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
        });
    }
    $scope.GetBookingChannelById = function (beData) {

        $scope.loadingstatus = "running";
        var para = {
            BookingId: beData.BookingId
        };
        $http({
            method: 'POST',
            url: base_url + "Appointment/Creation/GetBookingChannelById",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $timeout(function () {
                    $scope.newBookingChannel = res.data.Data;
                    $scope.newBookingChannel.Mode = 'Modify';
                    $('#custom-tabs-four-profile-tab').tab('show');
                });
            } else
                Swal.fire(res.data.ResponseMSG);

        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    }

    $scope.deleteBookingChannel = function (refData, ind) {

        Swal.fire({
            title: 'Are you sure to delete BookingChannel:-' + refData.BookingChannelName,
            showCancelButton: true,
            confirmButtonText: 'Delete',
        }).then((result) => {
            if (result.isConfirmed) {
                $scope.loadingstatus = "running";
                showPleaseWait();

                var para = {
                    BookingId: refData.BookingId
                };

                $http({
                    method: 'POST',
                    url: base_url + "Appointment/Creation/DelBookingChannel",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingstatus = "stop";
                    Swal.fire(res.data.ResponseMSG);
                    if (res.data.IsSuccess) {
                        $scope.GetAllBookingChannel();
                    }

                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }
        });

    }
})