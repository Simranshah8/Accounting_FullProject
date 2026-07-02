
app.controller('MStockController', function ($scope, $http, $timeout, $filter, GlobalServices) {
    $scope.Title = 'Medicine Stock';
	  var PrintPreviewAs = 1;
    const contextMenu = GlobalServices.createElementForMenu();
	
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
            MStock: 25,

        };

        $scope.newNearExpiry = {
            days: 90,
            GodownIdColl:''
        }

        $scope.GodownColl = [];
        $http({
            method: 'GET',
            url: base_url + "Inventory/Creation/GetUserWiseGodown",
            dataType: "json"
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.GodownColl = res.data.Data;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        $scope.GetAllMedicineStock();
    };
   
    $scope.GetAllMedicineStock = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();
        $scope.MStockColl = [];

        var para = {
            days: $scope.newNearExpiry.days,
            GodownIdColl: ($scope.newNearExpiry.GodownIdColl ? $scope.newNearExpiry.GodownIdColl.toString() : ''),
        };
        $http({
            method: 'POST',
            url: base_url + "Inventory/Reporting/GetNearExpiry",
            dataType: "json",
            data:JSON.stringify(para)
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
              
                // Process each item in the response data
                $scope.MStockColl = res.data.Data.map(item => {
                    
                    let daysToExpiry = item.Days;
                    // Set background color and text color based on the number of days to expiry
                    if (daysToExpiry < 0) {
                        item.bgColor = '#8B0000'; // Already expired
                        item.textColor = 'white';
                        item.Title = 'Already expired';
                    } else if (daysToExpiry === 0) {
                        item.bgColor = '#8B0000'; // Expiring today
                        item.textColor = 'white';
                        item.Title = 'Expiring today';
                    } else if (daysToExpiry <= 15) {
                        item.bgColor = '#FF0000'; // 15 days or less
                        item.textColor = 'white';
                        item.Title = '15 days or less';
                    } else if (daysToExpiry <= 30) {
                        item.bgColor = '#FFA500'; // 16 to 30 days
                        item.textColor = 'white';
                        item.Title = '16 to 30 days';
                    } else if (daysToExpiry <= 60) {
                        item.bgColor = '#FFFF00'; // 31 to 60 days
                        item.textColor = 'black'; // Text color is black when background is yellow
                        item.Title = '31 to 60 days';
                    } else if (daysToExpiry <= 90) {
                        item.bgColor = '#9ACD32'; // 61 to 90 days
                        item.textColor = 'white';
                        item.Title = '61 to 90 days';
                    } else {
                        item.bgColor = '#32cd32'; // More than 90 days
                        item.textColor = 'white';
                        item.Title = 'More than 90 days';
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

    $scope.saveRptListState = function () {
        GlobalServices.saveRptListState(EntityId, $scope.gridOptions);
    };

    function onCellContextMenu(event) {
        GlobalServices.onCellContextMenu(event, $scope.gridOptions, contextMenu);
    }

    // Hide context menu when clicking outside
    document.addEventListener('click', function () {
        contextMenu.style.display = 'none';
    });

    $(document).ready(function () {
        $(this).bind("contextmenu", function (e) {
            e.preventDefault();
        });
    });


});

