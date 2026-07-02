app.controller('RouteMergeController', function ($scope, $http, $timeout, $filter, GlobalServices) {
    $scope.Title = 'Ledger Merge';
    var glSrv = GlobalServices;
    LoadData();
     

    $scope.lastTranId = 0;
    function LoadData() {

        $('.select2').select2({
            allowClear: true,
            openOnEnter: true
        });
        $scope.confirmMSG = {
            Accept: false,
            Decline: false,
            Delete: false,
            Modify: false,
            Print: false,
            Reset: false
        };
       

        $scope.beData =
        {
            FromRouteId: null,
            ToRouteId: null,             
            Mode: 'Save'
        };


        $scope.loadingstatus = 'running';
        showPleaseWait();

        $http({
            method: 'GET',
            url: base_url + "Account/Creation/GetAllDebtorsCreditorsRoute",
            dataType: "json"
        }).then(function (res) {

            $scope.loadingstatus = 'stop';
            hidePleaseWait();
             
            if (res.data.IsSuccess && res.data.Data) {
                $scope.DebtorsCreditorsRouteColl = res.data.Data;
            } else
                alert(res.data.ResponseMSG);

        }, function (reason) {
            alert('Failed' + reason);
        });

    }
  
     

    $scope.IsValidData = function () {
        var result = true;

        if (!$scope.beData.FromRouteId) {
            result = false;
            Swal.fire('Please ! Select Valid From Route Name');
        }  

        if (!$scope.beData.ToRouteId) {
            result = false;
            Swal.fire('Please ! Select Valid To Route Name');
        }

        return result;
    }

    $scope.RouteMerge = function () {

        if ($scope.IsValidData()) {
            Swal.fire({
                title: 'Are you sure to merge Route ? After merge you will not revert back ',
                text: " Merge Route !",
                icon: 'info',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes !'

            }).then((result) => {
                /* Read more about isConfirmed, isDenied below */
                if (result.isConfirmed)
                {
                    $scope.loadingstatus = "running";
                    showPleaseWait();

                    var para = {
                        fromRouteId: $scope.beData.FromRouteId,
                        toRouteId:$scope.beData.ToRouteId
                    }
                    $http({
                        method: 'POST',
                        url: base_url + "Account/Transaction/RouteMerge",
                        dataType: "json",
                        data: JSON.stringify(para)
                    }).then(function (res) {

                        $scope.loadingstatus = "stop";
                        hidePleaseWait();

                        Swal.fire(res.data.ResponseMSG);
                    }, function (reason) {
                        Swal.fire('Failed' + reason);
                    });


                }
            });
        }
      
    }
    
 
});