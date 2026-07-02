app.controller('ProductMergeController', function ($scope, $http, $timeout, $filter, GlobalServices) {
    $scope.Title = 'Product Merge';
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
            FromProductId: null,
            ToProductId: null,             
            Mode: 'Save'
        };

  
    }
  
     

    $scope.IsValidData = function () {
        var result = true;

        if (!$scope.beData.FromProductId) {
            result = false;
            Swal.fire('Please ! Select Valid From Product Name');
        }  

        if (!$scope.beData.ToProductId) {
            result = false;
            Swal.fire('Please ! Select Valid To Product Name');
        }

        return result;
    }

    $scope.ProductMerge = function () {

        if ($scope.IsValidData()) {
            Swal.fire({
                title: 'Are you sure to merge Product ? After merge you will not revert back ',
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
                        FromProductId: $scope.beData.FromProductId,
                        ToProductId:$scope.beData.ToProductId
                    }
                    $http({
                        method: 'POST',
                        url: base_url + "Inventory/Transaction/ProductMerge",
                        dataType: "json",
                        data: JSON.stringify(para)
                    }).then(function (res) {

                        $scope.loadingstatus = "stop";
                        hidePleaseWait();

                        Swal.fire(res.data.ResponseMSG);

                        if (res.data.IsSuccess == true) {
                            $scope.beData =
                            {
                                FromProductId: null,
                                ToProductId: null,
                                Mode: 'Save'
                            };
                        }
                    }, function (reason) {
                        Swal.fire('Failed' + reason);
                    });


                }
            });
        }
      
    }
    
 
});