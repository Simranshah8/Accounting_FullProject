app.controller('fromUserToUserController', function ($scope, $http, $timeout, $filter, GlobalServices) {
    $scope.Title = 'Copy User Security';
    var glSrv = GlobalServices;
    LoadData();
     

    $scope.lastTranId = 0;
    function LoadData() {
        $('.select2').select2({
            allowClear: true,
            openOnEnter: true
        });

        $scope.UserList = [];
        $http({
            method: 'POST',
            url: base_url + "Setup/Security/GetUserListForSecurity",
            dataType: "json"
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.UserList = res.data.Data;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
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
            fromUserId: null,
            toUserId: null,             
            Mode: 'Save'
        };

  
    }
  
     

    $scope.IsValidData = function () {
        var result = true;

        if (!$scope.beData.fromUserId) {
            result = false;
            Swal.fire('Please ! Select Valid From User');
        }  

        if (!$scope.beData.toUserId) {
            result = false;
            Swal.fire('Please ! Select Valid To User');
        }

        return result;
    }

    $scope.CopySecurity = function () {

        if ($scope.IsValidData()) {
            Swal.fire({
                title: 'Are you sure to copy security ? ',
                text: " Copy Security !",
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
                        fromUserId: $scope.beData.fromUserId,
                        toUserId:$scope.beData.toUserId
                    }
                    $http({
                        method: 'POST',
                        url: base_url + "Setup/Security/SaveFromUserToUser",
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