app.controller("TicketForController", function ($scope, $http, GlobalServices, $timeout) {
    $scope.Title = 'Ticket For';
    LoadData();
    function LoadData() {
        $('.select2').select2();
        $scope.loadingstatus = "stop";
        $scope.confirmMSG = GlobalServices.getConfirmMSG();
        $scope.perPageColl = GlobalServices.getPerPageList();

        $scope.perPage = {
            TicketFor: GlobalServices.getPerPageRow(),
        };

        $scope.currentPages = {
            TicketFor: 1
        };

        $scope.searchData = {
            TicketFor: ''
        };

        $scope.beData =
        {
            TicketForId: 0,
            Name: '',
            Code: '',
            SNo: 0,
            StatusId: null,
        };
    };

    $scope.ClearFields = function () {
        $scope.loadingstatus = "stop";
        $scope.beData =
        {
            TicketForId: null,
            Name: '',
            Code: '',
            SNo: 0,
            StatusId: null,
        };
    }

    $scope.GetAllTicketFor = function () {
        $scope.TicketForColl = []; //declare an empty array
        if ($scope.loadingstatus != 'stop') {
            alert('Already Running Process')
            return;
        }
        $scope.loadingstatus = 'running';
        showPleaseWait();
        $http({
            method: 'GET',
            url: base_url + "ComplaintTicket/Creation/GetAllTicketFor",
            dataType: "json"
            //data:JSON.stringify(para)
        }).then(function (res) {
            $scope.loadingstatus = 'stop';
            hidePleaseWait();
            if (res.data.IsSuccess && res.data.Data) {
                $timeout(function () {
                    $scope.TicketForColl = res.data.Data;
                });
            } else
                alert(res.data.ResponseMSG);
        }, function (reason) {
            alert('Failed' + reason);
        });

    }

    $scope.IsValidTicketFor = function () {
        if ($scope.beData.Name.isEmpty()) {
            Swal.fire("Please ! Enter Name for Ticket");
            return false;
        }
        else
            return true;
    }

    $scope.AddTicketFor = function () {
        if ($scope.IsValidTicketFor() == true) {
            if ($scope.confirmMSG.Accept == true) {
                var saveModify = $scope.beData.Mode;
                Swal.fire({
                    title: 'Do you want to' + saveModify + 'the current data?',
                    showCancelButton: true,
                    confirmButtonText: saveModify,
                }).then((result) => {
                    if (result.isConfirmed) {
                        $scope.CallSaveUpdateTicketFor();
                    }
                });
            }
            else
                $scope.CallSaveUpdateTicketFor();
        }
    };

    $scope.CallSaveUpdateTicketFor = function () {
        $scope.loadingstatus = 'running';
        showPleaseWait();
        $http({
            method: 'POST',
            url: base_url + "ComplaintTicket/Creation/SaveTicketFor",
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
                $scope.GetAllTicketFor();
            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
        });
    }


    $scope.getTicketForById = function (beData) {
        $scope.loadingstatus = "running";
        var para = {
            TicketForId: beData.TicketForId
        };
        $http({
            method: 'POST',
            url: base_url + "ComplaintTicket/Creation/getTicketForById",
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


    $scope.deleteTicketFor = function (refData, ind) {
        Swal.fire({
            title: 'Are you sure you want to delete ' + refData.Name + '?',
            showCancelButton: true,
            confirmButtonText: 'Delete',
            //message: 'Are you sure to delete selected Branch :-' + beData.Name,
        }).then((result) => {
            if (result.isConfirmed) {
                var para = { TicketForId: refData.TicketForId };
                $http({
                    method: 'POST',
                    url: base_url + "ComplaintTicket/Creation/deleteTicketFor",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingStatus = "stop";
                    Swal.fire(res.data.ResponseMSG);
                    if (res.data.IsSuccess == true) {
                        $scope.TicketForColl.splice(ind, 1);
                    }
                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }
        });
    }
});