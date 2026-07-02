app.controller('LedgerMergeController', function ($scope, $http, $timeout, $filter, GlobalServices) {
    $scope.Title = 'Ledger Merge';
    var glSrv = GlobalServices;
    LoadData();
     

    $scope.lastTranId = 0;
    function LoadData() {
       
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
            FromLedgerId: null,
            ToLedgerId: null,             
            Mode: 'Save'
        };

  
    }
  
     

    $scope.IsValidData = function () {
        var result = true;

        if (!$scope.beData.FromLedgerId) {
            result = false;
            Swal.fire('Please ! Select Valid From Ledger Name');
        }  

        if (!$scope.beData.ToLedgerId) {
            result = false;
            Swal.fire('Please ! Select Valid To Ledger Name');
        }

        return result;
    }

    $scope.LedgerMerge = function () {

        if ($scope.IsValidData()) {
            Swal.fire({
                title: 'Are you sure to merge ledger ? After merge you will not revert back ',
                text: " Merge Ledger !",
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
                        fromLedgerId: $scope.beData.FromLedgerId,
                        toLedgerId:$scope.beData.ToLedgerId
                    }
                    $http({
                        method: 'POST',
                        url: base_url + "Account/Transaction/LedgerMerge",
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