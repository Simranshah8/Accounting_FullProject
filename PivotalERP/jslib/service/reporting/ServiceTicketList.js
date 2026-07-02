 
app.controller("ticketListCntrl", function ($scope, $http, $filter, $timeout, GlobalServices, $compile) {

    LoadData();
     
    function LoadData() {

        $('.select2').select2({
            allowClear: true,
            openOnEnter: true
        });

        $scope.confirmMSG = GlobalServices.getConfirmMSG();
        $scope.perPageColl = GlobalServices.getPerPageList();

        $scope.comDet = {};
        GlobalServices.getCompanyDet().then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.comDet = res.data.Data;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });


        $scope.BranchList = [];
        $http({
            method: 'POST',
            url: base_url + "Setup/Security/GetAllBranchList",
            dataType: "json"
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.BranchList = res.data.Data;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });


        $scope.dayBook = {
            DateFrom_TMP: new Date(),
            DateTo_TMP: new Date(),
            VoucherId: 0,
            IsPost: true,
            BranchId: 0,
            For: 1,
            IsCancel: false,
            OpenColl: [],
            ClosedColl:[]
        };

        $scope.searchData = {
            UserColl: '',
            DayBook: ''
        };
         
    }
      
    $scope.GetDayBook = function () {
         
        var dateFrom = new Date(($filter('date')(new Date(), 'yyyy-MM-dd')));
        var dateTo = new Date(($filter('date')(new Date(), 'yyyy-MM-dd')));

        if ($scope.dayBook.DateFromDet)
            dateFrom = new Date(($filter('date')($scope.dayBook.DateFromDet.dateAD, 'yyyy-MM-dd')));

        if ($scope.dayBook.DateToDet)
            dateTo = new Date(($filter('date')($scope.dayBook.DateToDet.dateAD, 'yyyy-MM-dd')));

        $scope.dayBook.OpenColl = [];
        $scope.dayBook.ClosedColl = [];

        $scope.loadingstatus = 'running';
        showPleaseWait();

        var beData = {
            dateFrom: dateFrom,
            dateTo: dateTo
        };

        $scope.loadingstatus = 'running';

        $http({
            method: "post",
            url: base_url + "Service/Reporting/GetTicketList",
            data: JSON.stringify(beData),
            dataType: "json"
        }).then(function (res) {

            $scope.loadingstatus = "stop";
            hidePleaseWait();

            if (res.data.IsSuccess == true) {
                $scope.dayBook.OpenColl = res.data.Data.OpenColl;
                $scope.dayBook.ClosedColl = res.data.Data.ClosedColl;
            } else
                Swal.fire(res.data.ResponseMSG);
             

        }, function (errormessage) {

            $scope.loadingstatus = 'stop';

            alert('Unable to Store data. pls try again.' + errormessage.responseText);
        });

    };

    $scope.CurTicket = {};
    $scope.ShowCurTicket = function (tic) {
        $scope.CurTicket = tic;
        $scope.CurTicket.Show = true;
        $scope.CurTicket.ClosedDateTime_TMP = new Date();

    }


    $scope.IsValidTicketClosed = function () {
        if (!$scope.CurTicket || !$scope.CurTicket.TranId) {
            Swal.fire("Please ! Select Valid Open Ticket ");
            return false;
        }
         
        return true;
    }

    $scope.AddTicketClosed = function () {
        if ($scope.IsValidTicketClosed() == true) {
            if ($scope.confirmMSG.Accept == true) {
                var saveModify = $scope.beData.Mode;
                Swal.fire({
                    title: 'Do you want to' + saveModify + 'the current data?',
                    showCancelButton: true,
                    confirmButtonText: saveModify,
                }).then((result) => {
                    if (result.isConfirmed) {
                        $scope.CallSaveTicketClosed();
                    }

                });
            }
            else
                $scope.CallSaveTicketClosed();
        }
    };

    $scope.CallSaveTicketClosed = function () {
        $scope.loadingstatus = 'running';
        showPleaseWait();

        if ($scope.CurTicket.ClosedDateTimeDet) {
            $scope.CurTicket.ClosedDateTime = $filter('date')(new Date($scope.CurTicket.ClosedDateTimeDet.dateAD), 'yyyy-MM-dd');
        }

        $http({
            method: 'POST',
            url: base_url + "Service/Reporting/SaveClosedTicket",
            headers: { 'content-Type': undefined },

            transformRequest: function (data) {
                var formData = new FormData();
                formData.append("jsonData", angular.toJson(data.jsonData));
                return formData;
            },
            data: { jsonData: $scope.CurTicket }
        }).then(function (res) {

            $scope.loadingstatus = "stop";
            hidePleaseWait();
            Swal.fire(res.data.ResponseMSG);
            if (res.data.IsSuccess == true) {
                $scope.CurTicket.Show=false
                $scope.CurTicket = null;
                $scope.GetDayBook();
            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
        });
    }
});