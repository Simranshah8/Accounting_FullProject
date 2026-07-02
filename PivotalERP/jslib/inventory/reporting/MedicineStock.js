
app.controller('MStockController', function ($scope, $http, $timeout, $filter, GlobalServices) {
    $scope.Title = 'Medicine Stock';
    var glSrv = GlobalServices;
    $scope.LoadData = function () {
        $('.select2').select2();

        $scope.confirmMSG = GlobalServices.getConfirmMSG();
        $scope.perPageColl = GlobalServices.getPerPageList();
       
       
        $scope.currentPages = {
            MStock: 1

        };

        $scope.searchData = {
            MStock: ''

        };

        $scope.perPage = {
            MStock: GlobalServices.getPerPageRow(),

        };

        $scope.GetAllMedicineStock();
    };
  

    $scope.GetAllMedicineStock = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();
        $scope.MStockColl = [];
        $http({
            method: 'GET',
            url: base_url + "Inventory/Reporting/GetAllMStock",
            dataType: "json"
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                let today = new Date(); // Get today's date
                today.setHours(0, 0, 0, 0); // Set to midnight to ignore time differences

                // Process each item in the response data
                $scope.MStockColl = res.data.Data.map(item => {
                    let expDate = new Date(item.EXPDate);
                    expDate.setHours(0, 0, 0, 0);

                    let timeDiff = expDate - today;
                    let daysToExpiry = timeDiff / (1000 * 3600 * 24); 
                    // Set background color and text color based on the number of days to expiry
                    if (daysToExpiry < 0) {
                        item.bgColor = '#8B0000'; // Already expired
                        item.textColor = 'white';
                    } else if (daysToExpiry === 0) {
                        item.bgColor = '#8B0000'; // Expiring today
                        item.textColor = 'white';
                    } else if (daysToExpiry <= 15) {
                        item.bgColor = '#FF0000'; // 15 days or less
                        item.textColor = 'white';
                    } else if (daysToExpiry <= 30) {
                        item.bgColor = '#FFA500'; // 16 to 30 days
                        item.textColor = 'white';
                    } else if (daysToExpiry <= 60) {
                        item.bgColor = '#FFFF00'; // 31 to 60 days
                        item.textColor = 'black'; // Text color is black when background is yellow
                    } else if (daysToExpiry <= 90) {
                        item.bgColor = '#9ACD32'; // 61 to 90 days
                        item.textColor = 'white';
                    } else {
                        item.bgColor = '#32cd32'; // More than 90 days
                        item.textColor = 'white';
                    }

                    return item; 
                });
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed: ' + reason);
        });
    };




});

