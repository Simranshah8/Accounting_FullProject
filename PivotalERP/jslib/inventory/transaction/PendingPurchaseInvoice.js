

app.controller("trnPendingPurchaseInvoiceCntrl", function ($scope, $http, $filter, $timeout, GlobalServices, $compile) {

    LoadData();
     
    function LoadData() {
         
        $scope.confirmMSG = GlobalServices.getConfirmMSG();
        $scope.perPageColl = GlobalServices.getPerPageList();
        $scope.currentPages = {
            PendingOrder: 1,
        };

        $scope.searchData = {
            PendingOrder: '',
        };

        $scope.perPage = {
            PendingOrder: 20,
        };


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

                if ($scope.BranchList.length == 1) {
                    $scope.dayBook.BranchId = $scope.BranchList[0].BranchId;
                }
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
        $scope.beData = {};
         
        $http({
            method: 'GET',
            url: base_url + "Account/Creation/GetVoucherList?voucherType=" + VoucherType,
            dataType: "json"
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.VoucherTypeColl = res.data.Data;
                 
                $http({
                    method: 'GET',
                    url: base_url + "Account/Creation/GetCostClassForEntry",
                    dataType: "json"
                }).then(function (res1) {
                    if (res1.data.IsSuccess && res1.data.Data) {
                        $scope.CostClassColl = res1.data.Data;

                        $timeout(function () {
                            $scope.$apply(function () {
                                if ($scope.VoucherTypeColl.length > 0) {
                                    $scope.SelectedVoucher = $scope.VoucherTypeColl[0];
                                    $scope.beData.VoucherId = $scope.SelectedVoucher.VoucherId;
                                }

                                if ($scope.CostClassColl.length > 0) {
                                    $scope.SelectedCostClass = $scope.CostClassColl[0];
                                    $scope.beData.CostClassId = $scope.SelectedCostClass.CostClassId;
                                }

                                if ($scope.VoucherTypeColl.length > 0 && $scope.CostClassColl.length > 0) {
                                    $scope.getVoucherDetails();
                                }
                            });
                        });


                    }
                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });

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
            IsSummary: true,
            For: 1
        };
         
     
    }

    $scope.getVoucherDetails = function () {
         
        $scope.beData.SalesInvoiceDetail = {};
        $scope.beData.PartyLedgerId = null;
        $scope.beData.AditionalCostColl = [];

        if ($scope.beData.VoucherId > 0)
            $scope.SelectedVoucher = mx($scope.VoucherTypeColl).firstOrDefault(p1 => p1.VoucherId == $scope.beData.VoucherId);

        if ($scope.beData.CostClassId > 0)
            $scope.SelectedCostClass = mx($scope.CostClassColl).firstOrDefault(p1 => p1.CostClassId == $scope.beData.CostClassId);

        if ($scope.SelectedVoucher) {
            $scope.loadingstatus = "running";
            showPleaseWait();

            $timeout(function () {
                $scope.$apply(function () {
                    $scope.SelectedVoucher.VoucherId = $scope.SelectedVoucher.VoucherId;
                });
            });
              

            $http({
                method: 'GET',
                url: base_url + "Account/Creation/GetVoucherModeById?voucherId=" + $scope.SelectedVoucher.VoucherId,
                dataType: "json"
            }).then(function (res) {

                $scope.loadingstatus = "stop";
                hidePleaseWait();

                if (res.data.IsSuccess && res.data.Data) {
                    $scope.SelectedVoucher = res.data.Data;
                    //$scope.SelectedVoucher.AditionalChargeColl      

                    $scope.GetPendingSO();
                }
            }, function (reason) {
                Swal.fire('Failed' + reason);
            });


        }
 
    }

    $scope.GetPendingSO = function () {

        $scope.PendingVoucherColl = [];
        var dateFrom = $filter('date')(new Date(), 'yyyy-MM-dd');
        var dateTo = $filter('date')(new Date(), 'yyyy-MM-dd');

        if ($scope.dayBook.DateFromDet)
            dateFrom = $filter('date')($scope.dayBook.DateFromDet.dateAD, 'yyyy-MM-dd');

        if ($scope.dayBook.DateToDet)
            dateTo = $filter('date')($scope.dayBook.DateToDet.dateAD, 'yyyy-MM-dd');
          

        $scope.loadingstatus = 'running';
        showPleaseWait();

        var beData = {
            DateFrom: dateFrom,
            DateTo: dateTo,
            ShowClosing:true,
        };
        
        var para = {
            procName: 'U_PendingPurchaseInvoice',
            qry: '',
            asParentChild:true,
            tblNames: 'OrderColl,ItemDetailsColl',
            colRelations:'TranId,TranId',
            paraColl: beData,
        }

        $http({
            method: "post",
            url: base_url + "Global/GetCustomData",
            data: JSON.stringify(para),
            dataType: "json"
        }).then(function (res) {

            $scope.loadingstatus = 'done';
            hidePleaseWait();
            if (res.data.IsSuccess == true) {
                $scope.PendingVoucherColl = res.data.Data.OrderColl;

                $scope.PendingVoucherColl.forEach(function (pv) {
                    pv.BranchId = parseInt(pv.BranchId);
                    pv.AditionalChargeColl = angular.copy($scope.SelectedVoucher.AditionalChargeColl);
                });
            } else if (res.data.IsSuccess != undefined)
            {
                Swal.fire(res.data.ResponseMSG);
            }
            
        }, function (errormessage) {

            $scope.loadingstatus = 'stop';

            alert('Unable to Store data. pls try again.' + errormessage.responseText);
        });

    };

    $scope.ChangeRefTranSelected = function (ind, tran) {
        var i = 0;
        angular.forEach($scope.PendingVoucherColl, function (ra) {

            if (ra.TranId != tran.TranId)
                ra.IsSelected = false;
             
            i++;
        });
    }


    //TypeOfDutyTaxs {
    //    OTHERS=0,
    //    VAT=1,
    //    TSC=2,
    //    EXCISE=3,
    //    CST=4,
    //    TDS=5,
    //    SCHEME=6,
    //    FREIGHT=7,
    //    INSURANCE=8,
    //    ROUNDOFF=9,
    //    DISCOUNT=10
    //}
    $scope.RecalculateAdditioncalCost = function (curData,rowData,colName,ind) {
        
        
        var productAmt = 0;      
        var totalQty = 0;

        angular.forEach(curData.ItemDetailsColl, function (idet) {
            idet.PendingOrderQty = isEmptyAmt(idet.PendingOrderQty);
            idet.Rate = isEmptyAmt(idet.Rate);
            idet.Amount = isEmptyAmt(idet.Amount);

            totalQty += idet.PendingOrderQty;

            if (colName == 'qty') {
                idet.Amount = idet.PendingOrderQty * idet.Rate;
            }
            productAmt += idet.Amount;
        });

        var newInd = 0;
        angular.forEach(curData.AditionalChargeColl, function (idet) {

            var ledAllotionAmt = 0;
            for (var i = 0; i < newInd; i++) {
                var det = curData.AditionalChargeColl[i];
                ledAllotionAmt += det.Amount;
            }

            var totalAmt1 = productAmt + ledAllotionAmt;
            var amt1 = idet.Amount;

            if (ind == newInd) {

                if (colName == 'rate') {

                    if (idet.AditionCostOnBasisOf == 0) {
                        amt1 = totalQty * idet.Rate / 100;
                        idet.AccessableValue = totalQty;
                    }
                    else {
                        amt1 = totalAmt1 * idet.Rate / 100;
                        idet.AccessableValue = totalAmt1;
                    }
                }
                else if (colName == 'amt') {
                    amt1 = idet.Amount;

                    if (idet.TypeOfDutyTax == 10) {
                        idet.Rate = (amt1 / totalAmt1) * 100;
                    }
                }

            } else {

                if (idet.Rate != 0) {
                    amt1 = totalAmt1 * idet.Rate / 100;
                    idet.AccessableValue = totalAmt1;
                }else
                    amt1 = idet.Amount;
            }
          

            //idet.Amount = amt1;
            idet.Amount = ($filter('number')(amt1, $scope.SelectedVoucher.NoOfDecimalPlaces)).parseDBL();
            if ((idet.TypeOfDutyTax == 10 || idet.TypeOfDutyTax == 6) && amt1 > 0) {
                idet.Rate = idet.Rate * -1;
                idet.Amount = idet.Amount * -1;
            } else if ((idet.TypeOfDutyTax == 1 || idet.TypeOfDutyTax == 3 || idet.TypeOfDutyTax == 7 || idet.TypeOfDutyTax == 8) && amt1 < 0) {
                idet.Rate = idet.Rate * -1;
                idet.Amount = idet.Amount * -1;
            }
             
            newInd++;
        });

         
        var totalAmt = 0;
        angular.forEach(curData.ItemDetailsColl, function (idet) {
            totalAmt += idet.Amount;
        });
        angular.forEach(curData.AditionalChargeColl, function (idet) {
            totalAmt += idet.Amount;
        });
        curData.InvoiceAmount = totalAmt;
    };
    $scope.IsValidData = function () {
        return true;
    }
    $scope.MakeSalesInvoice = function (curData,ind) {

       
        if ($scope.IsValidData() == true) {

            
            $timeout(function () {

                Swal.fire({
                    title: 'Do you want to make post selected invoice ?',
                    showCancelButton: true,
                    confirmButtonText: "Post Invoice",
                }).then((result) => {
                    /* Read more about isConfirmed, isDenied below */
                    if (result.isConfirmed) {
                        $scope.loadingstatus = "running";
                        showPleaseWait();
                         

                        var tranColl = [];
                        tranColl.push({
                            TranId: curData.TranId,
                            VoucherType: 8,
                            VoucherId: curData.VoucherId,
                            CostClassId: curData.CostClassId,
                            BranchId:curData.BranchId,
                            VoucherDate: curData.InvoiceDate,
                        });
                        $http({
                            method: 'POST',
                            url: base_url + "Global/PostAccInvTransaction",
                            headers: { 'Content-Type': undefined },

                            transformRequest: function (data) {
                                var formData = new FormData();
                                formData.append("jsonData", angular.toJson(data.jsonData));
                                return formData;
                            },
                            data: { jsonData: tranColl }
                        }).then(function (res1) {

                            hidePleaseWait();
                            $scope.loadingstatus = "stop";
                            if (res1.data.IsSuccess) {
                                //$scope.PendingVoucherColl.splice(ind, 1);
                                $scope.GetPendingSO();
                            } else {
                                Swal.fire(res1.data.ResponseMSG);
                            }

                        }, function (errormessage) {
                            hidePleaseWait();
                            //$scope.loadingstatus = "stop";
                            Swal.fire(errormessage);
                        });
                         
                    }
                });

            }, 300);

        }


    }

   
    $scope.SelectedVoucher = null;
    $scope.CancelModal = function (obj,ind) {

        $scope.SelectedVoucher.Ind = ind;
        $scope.SelectedVoucher = obj;

        $('#modal-cancel').modal('show');

    }
    $scope.CancelVoucher = function () {
        $('#modal-cancel').modal('hide');

        var obj = $scope.SelectedVoucher;

        Swal.fire({
            title: 'Do you want to cancel the selected Party(' + obj.PartyName + ') :- ' + obj.OrderNo + ' ? ',
            showCancelButton: true,
            confirmButtonText: 'Yes',
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                $scope.loadingstatus = "running";
                showPleaseWait();

                var tranColl1 = [];
                tranColl1.push({
                    TranId: obj.TranId,
                    VoucherId: obj.VoucherId,
                    VoucherType: 13,
                    CostClassId: obj.CostClassId,
                    IsCancel: true,                    
                    CancelRemarks: obj.CancelRemarks,
                    AutoManualNo:obj.OrderNo
                });

                var para = {
                    tranColl: tranColl1,
                    reason: obj.CancelRemarks
                }

                $http({
                    method: 'POST',
                    url: base_url + "Global/CancelAccInvTransaction",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingstatus = "stop";
                    if (res.data.IsSuccess) {
                        $scope.PendingVoucherColl.splice($scope.SelectedVoucher.Ind, 1);
                    } else {
                        Swal.fire(res.data.ResponseMSG);
                    }

                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }
        });

    };
	
    $scope.CopyData = null;
    $scope.CopyTran = function () {
        $scope.CopyData = null;
        if ($scope.beData) {
            if ($scope.beData.TranId > 0)
            {
                $scope.CopyData = $scope.GetData();
                $scope.CopyData.TranId = 0;
            }
        }
    }
    $scope.PasteTran = function () {
        if ($scope.CopyData) {
            $scope.ClearData();
            $timeout(function () {
                $scope.SetData($scope.CopyData);
                $scope.CopyData = null;
                //$scope.getVoucherNo();
            });            
        }        
    }
});
