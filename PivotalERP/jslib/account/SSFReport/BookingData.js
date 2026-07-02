app.controller("BookingDataController", function ($scope, $http, GlobalServices, $timeout) {
    $scope.Title = 'BookingData';


    $scope.loadingstatus = "stop";

    LoadData();

    function LoadData() {
        $('.select2').select2();
        $scope.loadingstatus = "stop";
        $scope.confirmMSG = GlobalServices.getConfirmMSG();
        $scope.perPageColl = GlobalServices.getPerPageList();


        $scope.perPage = {
            BookingData: GlobalServices.getPerPageRow(),

        };
        $scope.searchData = {
            BookingData: ''
        };
        $scope.currentPages = {
            BookingData: 1

        };

    };
  


    $scope.GetOnlyBookingDataAsync = function () {

        $scope.BookingDataList = []; //declare an empty array

        $scope.loadingstatus = 'running';
        showPleaseWait();

        $http({
            method: 'POST',
            url: base_url + "Account/SSFReport/GetOnlyBookingDataAsync",
            dataType: "json"
            //data:JSON.stringify(para)
        }).then(function (res) {

            $scope.loadingstatus = 'stop';
            hidePleaseWait();

            if (res.data.IsSuccess && res.data.Data) {
                $timeout(function () {
                    var Data = res.data.Data;
                    $scope.BookingDataList = Data.ResVals.data;
                });
            } else
                Swal.fire(res.data.Data.ResponseMSG);

        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

    }



});