app.controller('LedgerCreditController', function ($scope, $http, $timeout, $filter, GlobalServices) {
    $scope.Title = 'Ledger Credit';
    var glSrv = GlobalServices;
    LoadData();

    $scope.sideBarData = [];

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
            VoucherId: null,
            CostClassId: null,
            TranId: 0,
            AutoManualNo: '',
            AutoVoucherNo: 0,
            CurRate: 1,
            AttechFiles: [],
            SubTotal: 0,
            Total: 0,
            Narration: '',
            VoucherDate: new Date(),
            VoucherDate_TMP: new Date(),
            LedgerAllocationColl: [],
            Mode: 'Save'
        };

        $scope.beData.LedgerAllocationColl.push(
            {
                LedgerId: 0,
                AgentId: 0,
                LFNO: '',
                Narration: '',
                CreditLimitDays: 0,
                CreditLimitAmount: 0,
                OldCreditLimitDays: 0,
                OldCreditLimitAmount: 0,
                ForBranchId: null
            }
        );
        $('.hideSideBar').on('focus', function (e) {
            $('#sidebarzz').removeClass();
            $('#sidebarzz').addClass('order-last float-right active');
        })
 

    }

   
    $scope.AddRowInLedgerAllocation = function (ind, boolAuto) {

        if (boolAuto == true) {
            var len = $scope.beData.LedgerAllocationColl.length;
            if ((ind + 1) != len)
                return;

            var selectItem = $scope.beData.LedgerAllocationColl[ind];
            if (!selectItem.LedgerId || selectItem.LedgerId == null || selectItem.LedgerId == 0 )
                return;

        }

        if ($scope.beData.LedgerAllocationColl) {
            if ($scope.beData.LedgerAllocationColl.length > ind + 1) {
                $scope.beData.LedgerAllocationColl.splice(ind + 1, 0, {
                    LedgerId: 0,
                    AgentId: 0,
                    LFNO: '',
                    Narration: '',
                    CreditLimitDays: 0,
                    CreditLimitAmount: 0,
                    OldCreditLimitDays: 0,
                    OldCreditLimitAmount: 0,
                    ForBranchId: null
                })
            } else {
                $scope.beData.LedgerAllocationColl.push({
                    LedgerId: 0,
                    AgentId: 0,
                    LFNO: '',
                    Narration: '',
                    OldCreditLimitDays: 0,
                    OldCreditLimitAmount: 0,
                    CreditLimitDays: 0,
                    CreditLimitAmount: 0,
                    ForBranchId: null
                })
            }
        }

    }

    $scope.delRowLedgerAllocation = function (ind) {
        if ($scope.beData.LedgerAllocationColl) {
            if ($scope.beData.LedgerAllocationColl.length > 1) {
                $scope.beData.LedgerAllocationColl.splice(ind, 1);
              
            }
        }
    }

    $scope.ShowSideBar = function (paraData) {
      
        if (paraData) {

            $scope.sideBarData = paraData.ledgerSideBarData;
            if (paraData.LedgerId > 0) {
                $scope.loadingstatus = "running";
                showPleaseWait();

                var para = {
                    LedgerId: paraData.LedgerId
                };

                $http({
                    method: 'POST',
                    url: base_url + "Account/Creation/GetLedgerCredit",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    $scope.loadingstatus = 'stop';
                    hidePleaseWait();

                    if (res.data.IsSuccess && res.data.Data) {
                        paraData.LogDataColl = res.data.Data;

                        if (res.data.Data.length > 0) {
                            var lst = res.data.Data[res.data.Data.length - 1];
                            paraData.OldCreditLimitAmount = lst.CreditLimitAmount;
                            paraData.OldCreditLimitDays = lst.CreditLimitDays;
                            paraData.CreditLimitAmount = lst.CreditLimitAmount;
                            paraData.CreditLimitDays = lst.CreditLimitDays;
                        }

                    } else
                        alert(res.data.ResponseMSG);

                }, function (reason) {
                    alert('Failed' + reason);
                });


            }
        }
    };

    

    $scope.SaveLedgerCredit = function () {

        if ($scope.IsValidData() == true) {


            var dataColl = [];
            angular.forEach($scope.beData.LedgerAllocationColl, function (led) {
                if (led.LedgerId > 0) {
                    dataColl.push({
                        LedgerId: led.LedgerId,
                        OldCreditLimitAmount: led.OldCreditLimitAmount,
                        OldCreditLimitDays: led.OldCreditLimitDays,
                        CreditLimitAmount: led.CreditLimitAmount,
                        CreditLimitDays: led.CreditLimitDays,
                    });
                }
            });
            var saveModify = $scope.beData.TranId > 0 ? 'Modify' : 'Save';
            Swal.fire({
                title: 'Do you want to ' + saveModify + ' the current data?',
                showCancelButton: true,
                confirmButtonText: saveModify,
            }).then((result) => {
                /* Read more about isConfirmed, isDenied below */
                if (result.isConfirmed) {
                    $scope.loadingstatus = "running";
                    showPleaseWait();
                     
                    //$scope.beData.AttechFiles = [];

                    $http({
                        method: 'POST',
                        url: base_url + "Account/Creation/SaveUpdateLedgerCredit",
                        headers: { 'Content-Type': undefined },

                        transformRequest: function (data) {

                            var formData = new FormData();
                            formData.append("jsonData", angular.toJson(data.jsonData));

                            if (data.files) {
                                for (var i = 0; i < data.files.length; i++) {
                                    formData.append("file" + i, data.files[i]);
                                }
                            }

                            return formData;
                        },
                        data: { jsonData: dataColl }
                    }).then(function (res) {

                        $scope.loadingstatus = "stop";
                        hidePleaseWait();
                        Swal.fire(res.data.ResponseMSG);

                        if (res.data.IsSuccess == true)
                            $scope.ClearData();

                    }, function (errormessage) {
                        hidePleaseWait();
                        $scope.loadingstatus = "stop";

                    });
                }
            });

        }

    }
 
    
    $scope.IsValidData = function () {
        var result = true;
 
        return result;
    }
      
    $scope.ClearData = function () {
        $scope.SelectedVoucher = null;
        $scope.SelectedCostClass = null;

        $scope.beData =
        {
            VoucherId: null,
            CostClassId: null,
            TranId: 0,
            AutoManualNo: '',
            AutoVoucherNo: 0,
            CurRate: 1,
            AttechFiles: [],
            SubTotal: 0,
            Total: 0,
            Narration: '',
            VoucherDate: new Date(),
            VoucherDate_TMP: new Date(),
            LedgerAllocationColl: [],
            Mode: 'Save'
        };

        $scope.beData.LedgerAllocationColl.push(
            {
                LedgerId: 0,
                AgentId: 0,
                LFNO: '',
                Narration: '',
                CreditLimitDays: 0,
                CreditLimitAmount: 0,
                OldCreditLimitDays: 0,
                OldCreditLimitAmount: 0,
                ForBranchId: null
            }
        );
         
    };
    $scope.Clear = function () {
        Swal.fire({
            title: 'Are you sure?',
            text: " clear current data !",
            icon: 'info',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes !'

        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                $scope.ClearData();
            }
        });
    };

    $scope.CurLog = {};
    $scope.ShowLog = function (ledAllocation) {
        if (ledAllocation.LedgerId > 0)
        {
               $scope.CurLog = ledAllocation;        
            $('#frmCostCentersModel').modal('show');
        }
    }
});