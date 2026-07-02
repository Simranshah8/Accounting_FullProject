app.controller('reVoucherNumController', function ($scope, $http, $timeout, $filter, GlobalServices) {
    $scope.Title = 'Ledger Merge';
    var glSrv = GlobalServices;
    LoadData();
     

    $scope.lastTranId = 0;
    function LoadData() {

        $scope.VoucherColl = [];
        $http({
            method: 'GET',
            url: base_url + "Account/Creation/GetAllVoucherList",
            dataType: "json",
        }).then(function (res) {
            $scope.VoucherColl = res.data.Data;
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        $scope.CostClassColl = [];
        $http({
            method: 'GET',
            url: base_url + "Account/Creation/GetAllCostClasss",
            dataType: "json",
        }).then(function (res) {
            $scope.CostClassColl = res.data.Data;
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
            VoucherId: null,
            CostClassId: null,
            VoucherDate: null,
            ReStartNo:null,
            Mode: 'Save'
        };

  
    } 
     

    $scope.IsValidData = function () {
        var result = true;

        if (!$scope.beData.VoucherId) {
            result = false;
            Swal.fire('Please ! Select Valid Voucher');
        }  

        if (!$scope.beData.CostClassId) {
            result = false;
            Swal.fire('Please ! Select Valid CostClass');
        }

        return result;
    }

    $scope.ReVoucherNum = function () {

        if ($scope.IsValidData()) {
            Swal.fire({
                title: 'Are you sure to re-numbering of select voucher ? After re-numbering you will not revert back ',
                text: " Re-Voucher Numbering !",
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
                        VoucherId: $scope.beData.VoucherId,
                        CostClassId: $scope.beData.CostClassId,
                        VoucherDate: ($scope.beData.VoucherDateDet ? $filter('date')(new Date($scope.beData.VoucherDateDet.dateAD), 'yyyy-MM-dd') : null),
                        ReStartNo: $scope.beData.ReStartNo
                    }
                    $http({
                        method: 'POST',
                        url: base_url + "Account/Transaction/ReVoucherNumbering",
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