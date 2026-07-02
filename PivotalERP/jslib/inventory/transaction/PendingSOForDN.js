

app.controller("trnPendingSODNCntrl", function ($scope, $http, $filter, $compile, $timeout, GlobalServices, $compile) {

    LoadData();
     
    function LoadData() {

        $('.select2').select2({
            allowClear: true,
            openOnEnter: true
        });

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

        $scope.HideShow = {
            Godown: true,
            VoucherType: true,
            CostClass: true,
            AutoVoucherNo: true,
            PartyCostCenter: true,
            TranCostCenter: true,
            Agent: true,
            Currency: true,
            RefNo: true,
            SalesLedger: true,
            BilledQty: true,
            Discount: true,
            DiscountAmt: true,
            DiscountPer: true,
            CurrentBalance: true,
            FreeQty: true,
            Scheme: true,
            SchemeAmt: true,
            SchemePer: true,
            ProductDescription: true,
            ProductPoint: true,
            ProductLedger: true,
            ShowProductWiseLedger: true,
            AlternetUnit: true,
            AlternetUnit1: true,
            AlternetUnit2: true,
            AlternetUnitMultiple: true,
            EntryDate: true,
            Batch: true,
            EXPDate: true,
            MFGDate: true,
            EachNarration: true,
            ExciseDuty: true,
            Vat: true,
            Amount: false,
            Rate: false,
            MRP: true,
            SalesRate: true,
            TradeRate: true,
            NotEffectQty: true,
            ActiveBarCode: true,
            ActiveSummaryEntry: true,
            ActiveTender: true,
            ProductCompany: true
        }

        $scope.comDet = {};
        GlobalServices.getCompanyDet().then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.comDet = res.data.Data;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });


        $scope.PaymentTermColl = [];
        $scope.PaymentTermColl_Bank = [];
        $scope.PaymentTermColl_Qry = [];
        GlobalServices.getPaymentTerms().then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                var PaymentTermColl = res.data.Data;                
                if (PaymentTermColl) {
                    angular.forEach(PaymentTermColl, function (pt) {
                        if (pt.IsCash == true && pt.LedgerId > 0) {

                            if (pt.PayType == 6) {
                                $scope.PaymentTermColl_Bank.push({
                                    Name: pt.Name,
                                    PaymentTermsId: pt.PaymentTermsId,
                                    LedgerId: pt.LedgerId,
                                    Amount: 0,
                                    Remarks: '',
                                    BranchId: pt.BranchId,
                                    BdId: pt.BDId,
                                });

                            } else {
                                $scope.PaymentTermColl.push({
                                    Name: pt.Name,
                                    PaymentTermsId: pt.PaymentTermsId,
                                    LedgerId: pt.LedgerId,
                                    Amount: 0,
                                    Remarks: '',
                                    BranchId: pt.BranchId,
                                    BdId: pt.BDId,
                                });
                            }
                            
                        }
                    });

                    $scope.PaymentTermColl_Qry = mx(PaymentTermColl);
                }
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        $scope.PaymentModeColl = [];
        $scope.PaymentModeColl_Qry = [];
        GlobalServices.getPaymentMode().then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.PaymentModeColl = res.data.Data;
                $scope.PaymentModeColl_Qry = mx(res.data.Data);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        $scope.AgentColl = [];
        $http({
            method: 'GET',
            url: base_url + "Account/Creation/GetAllSalesMan",
            dataType: "json",
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.AgentColl = res.data.Data;
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
            url: base_url + "Account/Creation/GetVoucherList?voucherType=" + OVoucherType,
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

                    if ($scope.SelectedVoucher.NumberingMethod == 1)
                        $scope.HideShow.AutoVoucherNo = false;
                    else
                        $scope.HideShow.AutoVoucherNo = true;

                    if ($scope.SelectedVoucher.UsePartyCostCenter == true)
                        $scope.HideShow.PartyCostCenter = false;
                    else
                        $scope.HideShow.PartyCostCenter = true;

                    if ($scope.SelectedVoucher.UseTranCostCenter == true)
                        $scope.HideShow.TranCostCenter = false;
                    else
                        $scope.HideShow.TranCostCenter = true;

                    if ($scope.SelectedVoucher.UseRefNo == true)
                        $scope.HideShow.RefNo = false;
                    else
                        $scope.HideShow.RefNo = true;


                    if ($scope.SelectedVoucher.CanChangeLedgerAndAgent == true)
                        $scope.HideShow.Agent = false;
                    else
                        $scope.HideShow.Agent = true;

                    if ($scope.SelectedVoucher.AllowMultipleCurrency == true)
                        $scope.HideShow.Currency = false;
                    else
                        $scope.HideShow.Currency = true;

                    if ($scope.SelectedVoucher.Product.ProductWiseLedger == true) {
                        $scope.HideShow.SalesLedger = true;

                        if ($scope.SelectedVoucher.Product.ShowProductWiseLedger == true)
                            $scope.HideShow.ProductLedger = false;
                        else
                            $scope.HideShow.ProductLedger = true;
                    }
                    else {
                        $scope.HideShow.SalesLedger = false;
                        $scope.HideShow.ProductLedger = true;
                    }


                    if ($scope.SelectedVoucher.Product.ActiveActualAndBillQty == true)
                        $scope.HideShow.BilledQty = false;
                    else
                        $scope.HideShow.BilledQty = true;

                    if ($scope.SelectedVoucher.Product.AllowDiscount == true) {

                        $scope.HideShow.Discount = false;
                        if ($scope.SelectedVoucher.Product.ShowDiscountAmt)
                            $scope.HideShow.DiscountAmt = false;
                        else
                            $scope.HideShow.DiscountAmt = true;

                        if ($scope.SelectedVoucher.Product.ShowDiscountAmt)
                            $scope.HideShow.DiscountPer = false;
                        else
                            $scope.HideShow.DiscountPer = true;
                    }
                    else {
                        $scope.HideShow.Discount = true;
                        $scope.HideShow.DiscountPer = true;
                        $scope.HideShow.DiscountAmt = true;
                    }


                    if ($scope.SelectedVoucher.Product.ShowCurrentStock == true)
                        $scope.HideShow.CurrentBalance = false;
                    else
                        $scope.HideShow.CurrentBalance = true;

                    if ($scope.SelectedVoucher.Product.AllowFreeQty == true)
                        $scope.HideShow.FreeQty = false;
                    else
                        $scope.HideShow.FreeQty = true;

                    if ($scope.SelectedVoucher.Product.AllowScheme == true) {
                        $scope.HideShow.Scheme = false;

                        if ($scope.SelectedVoucher.Product.ShowSchemeAmt == true)
                            $scope.HideShow.SchemeAmt = false;
                        else
                            $scope.HideShow.SchemeAmt = true;

                        if ($scope.SelectedVoucher.Product.ShowSchemePer == true)
                            $scope.HideShow.SchemePer = false;
                        else
                            $scope.HideShow.SchemePer = true;

                    } else {
                        $scope.HideShow.Scheme = true;
                        $scope.HideShow.SchemeAmt = true;
                        $scope.HideShow.SchemePer = true;
                    }

                    if ($scope.SelectedVoucher.Product.ShowProductDescription == true)
                        $scope.HideShow.ProductDescription = false;
                    else
                        $scope.HideShow.ProductDescription = true;

                    if ($scope.SelectedVoucher.ActiveCompanyWiseProduct == true)
                        $scope.HideShow.ProductCompany = false;
                    else
                        $scope.HideShow.ProductCompany = true;


                    if ($scope.SelectedVoucher.Product.ShowProductQuantityPoint == true)
                        $scope.HideShow.ProductPoint = false;
                    else
                        $scope.HideShow.ProductPoint = true;
 

                    if ($scope.SelectedVoucher.Product.UseMRP == true)
                        $scope.HideShow.MRP = false;
                    else
                        $scope.HideShow.MRP = true;

                    if ($scope.SelectedVoucher.Product.UsePurchaseSalesRate == true)
                        $scope.HideShow.SalesRate = false;
                    else
                        $scope.HideShow.SalesRate = true;

                    if ($scope.SelectedVoucher.Product.UseTradeRate == true)
                        $scope.HideShow.TradeRate = false;
                    else
                        $scope.HideShow.TradeRate = true;


                    if ($scope.SelectedVoucher.Product.ShowAlternateUnit == true) {
                        $scope.HideShow.AlternetUnit = false;

                        if ($scope.SelectedVoucher.Product.ActiveAlternateUnitColumn1 == true)
                            $scope.HideShow.AlternetUnit1 = false;
                        else
                            $scope.HideShow.AlternetUnit1 = true;

                        if ($scope.SelectedVoucher.Product.ActiveAlternateUnitColumn2 == true)
                            $scope.HideShow.AlternetUnit2 = false;
                        else
                            $scope.HideShow.AlternetUnit2 = true;

                        if ($scope.SelectedVoucher.Product.ActiveAlternateUnitMultiple == true) {
                            $scope.HideShow.AlternetUnitMultiple = false;
                            $scope.HideShow.AlternetUnit1 = true;
                            $scope.HideShow.AlternetUnit2 = true;
                        }
                        else
                            $scope.HideShow.AlternetUnitMultiple = true;

                    }
                    else {
                        $scope.HideShow.AlternetUnit = true;
                        $scope.HideShow.AlternetUnit1 = true;
                        $scope.HideShow.AlternetUnit2 = true;
                    }


                    if ($scope.SelectedVoucher.UseEffectiveDate == true)
                        $scope.HideShow.EntryDate = false;
                    else
                        $scope.HideShow.EntryDate = true;

                    if ($scope.SelectedVoucher.Product.BatchNo == true)
                        $scope.HideShow.Batch = false;
                    else
                        $scope.HideShow.Batch = true;

                    if ($scope.SelectedVoucher.Product.UseEXP == true)
                        $scope.HideShow.EXPDate = false;
                    else
                        $scope.HideShow.EXPDate = true;

                    if ($scope.SelectedVoucher.Product.UseMFG == true)
                        $scope.HideShow.MFGDate = false;
                    else
                        $scope.HideShow.MFGDate = true;

                    if ($scope.SelectedVoucher.EachNarrationEntry == true)
                        $scope.HideShow.EachNarration = false;
                    else
                        $scope.HideShow.EachNarration = true;

                    if ($scope.SelectedVoucher.Product.ProductWiseExciseDuty == true)
                        $scope.HideShow.ExciseDuty = false;
                    else
                        $scope.HideShow.ExciseDuty = true;

                    if ($scope.SelectedVoucher.Product.ProductWiseVat == true)
                        $scope.HideShow.Vat = false;
                    else
                        $scope.HideShow.Vat = true;

                    if (!$scope.SelectedVoucher.VoucherDateLabel || $scope.SelectedVoucher.VoucherDateLabel.length == 0)
                        $scope.SelectedVoucher.VoucherDateLabel = "Invoice Date";

                    if (!$scope.SelectedVoucher.EntryDateLabel || $scope.SelectedVoucher.EntryDateLabel.length == 0)
                        $scope.SelectedVoucher.EntryDateLabel = "Entry Date";

                    if (!$scope.SelectedVoucher.RefNoName || $scope.SelectedVoucher.RefNoName.length == 0)
                        $scope.SelectedVoucher.RefNoName = 'Ref. No.';

                    if ($scope.SelectedVoucher.Product.ShowRate == true)
                        $scope.HideShow.Rate = false;
                    else
                        $scope.HideShow.Rate = true;

                    if ($scope.SelectedVoucher.Product.ShowAmount == true)
                        $scope.HideShow.Amount = false;
                    else
                        $scope.HideShow.Amount = true;

                    if ($scope.SelectedVoucher.Product.NotEffectQty == true)
                        $scope.HideShow.NotEffectQty = false;
                    else
                        $scope.HideShow.NotEffectQty = true;

                    if ($scope.SelectedVoucher.ActiveBarCode == true)
                        $scope.HideShow.ActiveBarCode = false;
                    else
                        $scope.HideShow.ActiveBarCode = true;

                    $scope.GetPendingSO();
                }
            }, function (reason) {
                Swal.fire('Failed' + reason);
            });


        }
 
    }
    $scope.ChangeTermsOfPayment = function (curRow) {
        if (curRow.PaymentTermsId) {
            var findPM = $scope.PaymentModeColl_Qry.firstOrDefault(p1 => p1.id == curRow.PaymentTermsId);
            if (findPM) {
                curRow.TypeOfPayment = findPM.TypeOfPayment;
                curRow.TermsOfPayment = findPM.text;
            }
        }
    }
    $scope.CanEditTran = function (rowData, ind) {
        rowData.CanEdit = true;
    }
    $scope.CanEditTranCancel = function (rowData, ind) {
        rowData.CanEdit = false;
        rowData.PaymentTermsId = rowData.Last_PaymentTermsId;
        $scope.ChangeTermsOfPayment(rowData);
    }
    $scope.UpdatePaymentTerms = function (rowData, ind) {
        $scope.loadingstatus = 'running';
        showPleaseWait();
        var para = {
            TranId: rowData.TranId,
            TermsOfPayment: rowData.TermsOfPayment,
            PaymentTermsId:rowData.PaymentTermsId,
        };
        $http({
            method: "post",
            url: base_url + "Inventory/transaction/UpdateSOPaymentTerms",
            data: JSON.stringify(para),
            dataType: "json"
        }).then(function (res) {

            $scope.loadingstatus = 'done';
            hidePleaseWait();
            if (res.data.IsSuccess == true) {
                $scope.GetPendingSO();
            } else if (res.data.IsSuccess != undefined) {
                Swal.fire(res.data.ResponseMSG);
            }

        }, function (errormessage) {

            $scope.loadingstatus = 'stop';

            alert('Unable to Store data. pls try again.' + errormessage.responseText);
        });

    };
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
            BranchId: $scope.dayBook.BranchId,
            AgentId: $scope.dayBook.AgentId,
        };
        
        var para = {
            //procName: 'U_PendingSalesOrder',
            procName: 'U_PendingSOForDN',
            qry: '',
            asParentChild:true,
            tblNames: 'OrderColl,ItemDetailsColl,AditionalChargeColl',
            colRelations:'TranId,TranId,TranId',
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
                    pv.CanEdit = false;

                    //if (!pv.AditionalChargeColl || pv.AditionalChargeColl.length == 0)
                      //  pv.AditionalChargeColl = angular.copy($scope.SelectedVoucher.AditionalChargeColl);

                    if (pv.AditionalChargeColl) {
                        pv.AditionalChargeColl.forEach(function (ads) {
                            ads.Rate = isEmptyAmt(ads.Rate);
                            ads.Amount = isEmptyAmt(ads.Amount);
                            ads.AccessableValue = isEmptyAmt(ads.AccessableValue);
                        });
                    }
                    pv.IsCash = false;
                    if (pv.PaymentTermsId && pv.PaymentTermsId.length > 0) {
                        pv.PaymentTermsId = parseInt(pv.PaymentTermsId);

                        if (pv.PaymentTermsId > 0) {
                            var findPM = $scope.PaymentModeColl_Qry.firstOrDefault(p1 => p1.PaymentModeId == pv.PaymentTermsId);
                            if (findPM) {
                                if (findPM.TypeOfPayment == 1 || findPM.TypeOfPayment == 2)
                                    pv.IsCash = true;
                            }
                        }
                    }

                    pv.Last_PaymentTermsId = pv.PaymentTermsId;

                    if (pv.ItemDetailsColl && pv.ItemDetailsColl.length > 0) {
                        var itemRow = 1;
                        pv.ItemUDFColl = [];
                        pv.ItemDetailsColl.forEach(function (itemDet) {
                            if (itemDet.UDFKeyVal && itemDet.UDFKeyVal.length > 0) {
                                var udfColl = JSON.parse(itemDet.UDFKeyVal);
                                Object.keys(udfColl).map((key) =>
                                {
                                    if (itemRow == 1) {
                                        pv.ItemUDFColl.push(key);
                                    }
                                    itemDet[key] = udfColl[key];
                                });
                            }
                            itemRow++;
                        });
                    }
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
    $scope.delRow = function (curData, ind) {
        curData.ItemDetailsColl.splice(ind, 1);
        $scope.RecalculateAdditioncalCost(curData, null, 'main', -1);
    }
    $scope.CanEditRow = function (curData, rowData, ind) {
        rowData.CanEdit = true;
    }
    
    $scope.ChangeRefTranSelected = function (ind, tran) {
        var i = 0;
        angular.forEach($scope.PendingVoucherColl, function (ra) {

            if (ra.TranId != tran.TranId)
                ra.IsSelected = false;
             
            i++;
        });
    }

     
    $scope.IsValidData = function () {
        return true;
    }

    $scope.CurTran = null;
    $scope.ShowReceiptAs = function (curData, ind) {

        curData.BankAmount = isEmptyAmt(curData.BankAmount);

        $scope.CurTran = curData;

        if (curData.PaymentTermColl && curData.PaymentTermColl.length > 0)
        {
            $('#documentPaymentTerm').modal('show');
            return;
        }

        $scope.RecVoucherTypeColl = [];
        curData.SelectedRecVoucher = null;
        $scope.loadingstatus = "running";
        showPleaseWait(); 

        var vType = 1;

        $http({
            method: 'GET',
            url: base_url + "Account/Creation/GetVoucherList?voucherType=" + vType + "&branchId=" + curData.BranchId,
            dataType: "json"
        }).then(function (res) {
            $scope.loadingstatus = "stop";
            hidePleaseWait();
            if (res.data.IsSuccess && res.data.Data) {
                var VoucherTypeColl = res.data.Data;
                var copyPTColl = angular.copy($scope.PaymentTermColl);
                curData.PaymentTermColl_Bank = angular.copy($scope.PaymentTermColl_Bank);

                $scope.RecVoucherTypeColl = VoucherTypeColl;
                var voucherId = 0;
                if (VoucherTypeColl && VoucherTypeColl.length == 1) {
                    curData.SelectedRecVoucher = VoucherTypeColl[0];
                    curData.PaymentTermColl = [];                    
                    copyPTColl.forEach(function (pt) {
                        if (pt.BranchId == 0 || pt.BranchId == null || pt.BDId == curData.BranchId || pt.BranchId == curData.BranchId) {
                            curData.PaymentTermColl.push(pt);
                        }
                    });
                    
                    $('#documentPaymentTerm').modal('show');
                }
                else {

                    var templatesName = [];
                    var sno = 1;
                    angular.forEach(VoucherTypeColl, function (tc) {
                        templatesName.push(sno + '-' + tc.VoucherName);
                        sno++;
                    });

                    Swal.fire({
                        title: 'Voucher',
                        input: 'select',
                        inputOptions: templatesName,
                        inputPlaceholder: 'Select a voucher',
                        showCancelButton: true,
                        inputValidator: (value) => {
                            return new Promise((resolve) => {
                                if (value >= 0) {
                                    resolve()
                                    voucherId = VoucherTypeColl[value].VoucherId;                                    
                                    if (voucherId > 0) {
                                        curData.SelectedRecVoucher = VoucherTypeColl[value];
                                        curData.PaymentTermColl = [];                                        
                                        copyPTColl.forEach(function (pt) {
                                            if (pt.BDId == 0 || pt.BDId == curData.BranchId || pt.BranchId == curData.BranchId) {
                                                curData.PaymentTermColl.push(pt);
                                            }
                                        });
                                        $('#documentPaymentTerm').modal('show');
                                    }
                                } else {
                                    resolve('You need to voucher:)')
                                }
                            })
                        }
                    });
                } 
            }
            else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        
    }
    $scope.SaveDeliveryNote = function (curData, ind) {
         
        var vType = 13;
        var para = {
            TranId: curData.TranId,
            voucherTypes: vType
        };
        $http({
            method: 'POST',
            url: base_url + "Inventory/Transaction/GetADForRefTran",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res1) {

            $scope.loadingstatus = "stop";
            hidePleaseWait();

            if (res1.data.IsSuccess && res1.data.Data) {
                var tranData = res1.data.Data;
                var tranDet = tranData.SalesInvoiceDetail;

                if (tranDet && tranDet.UDFKeyVal && tranDet.UDFKeyVal.length > 0) {
                    tranDet.UDFKeyVal = JSON.parse(tranDet.UDFKeyVal);
                    angular.forEach($scope.beData.UDFFeildsColl, function (uf) {
                        var fUVal = tranDet.UDFKeyVal[uf.NameId];
                        if (fUVal)
                            uf.UDFValue = fUVal;
                    });
                }

                var newTran = $scope.GetDataForDeliveryNote(curData);
                newTran.PartyCostCenter = tranData.PartyCostCenter;
                newTran.TranCostCenter = tranData.TranCostCenter;
                newTran.AgentId = tranData.AgentId;
                newTran.DeliveryNoteDetail.TermsOfPayment = tranDet.TermsOfPayment;
                newTran.DeliveryNoteDetail.OtherRefereces = tranDet.OtherRefereces;
                newTran.DeliveryNoteDetail.TermsOfDelivery = tranDet.TermsOfDelivery;
                newTran.DeliveryNoteDetail.DeliveryThrough = tranDet.DeliveryThrough;
                newTran.DeliveryNoteDetail.DeliveryDocNo = tranDet.DeliveryDocNo;
                newTran.DeliveryNoteDetail.Destination = tranDet.Destination;
                newTran.DeliveryNoteDetail.SalesQuotationTermsOfPayment = tranDet.SalesQuotationTermsOfPayment;
                newTran.DeliveryNoteDetail.SalesQuotationOtherRefereces = tranDet.SalesQuotationOtherRefereces;
                newTran.DeliveryNoteDetail.SalesQuotationTermsOfDelivery = tranDet.SalesQuotationTermsOfDelivery;
                newTran.DeliveryNoteDetail.Buyes = tranDet.Buyes;
                newTran.DeliveryNoteDetail.Address = tranDet.Address;
                newTran.DeliveryNoteDetail.SalesTaxNo = tranDet.SalesTaxNo;
                newTran.DeliveryNoteDetail.CSTNumber = tranDet.CSTNumber;
                newTran.DeliveryNoteDetail.Notes = tranDet.Notes;
                newTran.DeliveryNoteDetail.PhoneNo = tranDet.PhoneNo;
                newTran.DeliveryNoteDetail.Description = tranDet.Description;
                newTran.DeliveryNoteDetail.OwnerName = tranDet.OwnerName;
                newTran.DeliveryNoteDetail.OwnerContactNo = tranDet.OwnerContactNo;
                newTran.DeliveryNoteDetail.DriverAddress = tranDet.DriverAddress;
                newTran.DeliveryNoteDetail.DriverName = tranDet.DriverName;
                newTran.DeliveryNoteDetail.DriverContactNo = tranDet.DriverContactNo;
                newTran.DeliveryNoteDetail.LicenseNo = tranDet.LicenseNo;
                newTran.DeliveryNoteDetail.Goods = tranDet.Goods;
                newTran.DeliveryNoteDetail.Quantity = tranDet.Quantity;
                newTran.DeliveryNoteDetail.FreightRate = tranDet.FreightRate;
                newTran.DeliveryNoteDetail.AdvancePayment = tranDet.AdvancePayment;
                newTran.DeliveryNoteDetail.TotalWT = tranDet.TotalWT;
                newTran.DeliveryNoteDetail.ContactNo = tranDet.ContactNo;
                newTran.DeliveryNoteDetail.RegdNo = tranDet.RegdNo;
                newTran.DeliveryNoteDetail.EngineNo = tranDet.EngineNo;
                newTran.DeliveryNoteDetail.ChassisNo = tranDet.ChassisNo;
                newTran.DeliveryNoteDetail.Model = tranDet.Model;
                newTran.DeliveryNoteDetail.VinNo = tranDet.VinNo;
                newTran.DeliveryNoteDetail.CreditDays = tranDet.CreditDays;
                newTran.DeliveryNoteDetail.ExportCountry = tranDet.ExportCountry;
                newTran.DeliveryNoteDetail.PPNo = tranDet.PPNo;
                newTran.DeliveryNoteDetail.PPDate = tranDet.PPDate;
                newTran.DeliveryNoteDetail.OtherRefereces1 = tranDet.OtherRefereces1;
                newTran.DeliveryNoteDetail.PaymentTermsId = tranDet.PaymentTermsId;
                newTran.DeliveryNoteDetail.FreightTypeId = tranDet.FreightTypeId;
                newTran.RefNo = tranData.RefNo;
                newTran.DeliveryNoteDetail.BillToId = tranDet.BillToId;
                newTran.DeliveryNoteDetail.ShipToId = tranDet.ShipToId;
                newTran.DeliveryNoteDetail.BillToAddress = tranDet.BillToAddress;
                newTran.DeliveryNoteDetail.ShipToAddress = tranDet.ShipToAddress;

                Swal.fire({
                    title: 'Do you want to make delivery of selected order ?',
                    showCancelButton: true,
                    confirmButtonText: "Make Delivery",
                }).then((result) => {
                    /* Read more about isConfirmed, isDenied below */
                    if (result.isConfirmed) {
                        $scope.loadingstatus = "running";
                        showPleaseWait();


                        $http({
                            method: 'POST',
                            url: base_url + "Inventory/Transaction/SaveUpdateDeliveryNote",
                            headers: { 'Content-Type': undefined },

                            transformRequest: function (data) {

                                var formData = new FormData();
                                formData.append("jsonData", angular.toJson(data.jsonData));

                                return formData;
                            },
                            data: { jsonData: newTran }
                        }).then(function (res) {

                            $scope.loadingstatus = "stop";
                            hidePleaseWait();                            
                            if (res.data.IsSuccess == true)
                            {
                                $scope.PendingVoucherColl.splice(ind, 1);
                                var tranId = res.data.Data.RId;
                                var vid = res.data.Data.VId;
                                var branchId = res.data.Data.VBId;
                                $scope.PrintDelivery(tranId,vid,branchId);
                                
                            }
                            else {
                                Swal.fire(res.data.ResponseMSG);
                            }

                        }, function (errormessage) {
                            hidePleaseWait();
                            //$scope.loadingstatus = "stop";
                            Swal.fire(errormessage);
                        });

                    }
                });

            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    }
    $scope.MakeDeliveryNote = function (curData, ind) {
         
        if ($scope.IsValidData() == true) {

            if (curData.IsCash == true)
            {
                if ((!curData.PaymentTermColl || curData.PaymentTermColl.length == 0) && isEmptyAmt(curData.BankAmount) == 0)
                {
                    Swal.fire('Please ! Enter Receipt Details');
                    return;
                }

                var sum = mx(curData.PaymentTermColl).sum(p1 => p1.Amount) + isEmptyAmt(curData.BankAmount);
                if (isEmptyAmt(sum) == 0) {
                    Swal.fire('Please ! Enter Receipt Details');
                    return;
                }                
            }

            $scope.loadingstatus = "running";
            showPleaseWait();
            $scope.SelectedVoucher = null;

            var vType = 12;             
             
            $http({
                method: 'GET',
                url: base_url + "Account/Creation/GetVoucherList?voucherType=" + vType + "&branchId=" + curData.BranchId +"&activeBranch="+curData.ActiveBranch,
                dataType: "json"
            }).then(function (res) {
                $scope.loadingstatus = "stop";
                hidePleaseWait();
                if (res.data.IsSuccess && res.data.Data) {
                    var VoucherTypeColl = res.data.Data;

                    var voucherId = 0;
                    if (VoucherTypeColl && VoucherTypeColl.length == 1) {
                        $scope.SelectedVoucher = VoucherTypeColl[0];
                        $scope.SaveDeliveryNote(curData, ind);
                    }
                    else {

                        var templatesName = [];
                        var sno = 1;
                        angular.forEach(VoucherTypeColl, function (tc) {
                            templatesName.push(sno + '-' + tc.VoucherName);
                            sno++;
                        });

                        Swal.fire({
                            title: 'Voucher',
                            input: 'select',
                            inputOptions: templatesName,
                            inputPlaceholder: 'Select a voucher',
                            showCancelButton: true,
                            inputValidator: (value) => {
                                return new Promise((resolve) => {
                                    if (value >= 0) {
                                        resolve()
                                        voucherId = VoucherTypeColl[value].VoucherId;
                                        $scope.SelectedVoucher = VoucherTypeColl[value];
                                        if (voucherId > 0) {
                                            $scope.SaveDeliveryNote(curData, ind);
                                        }
                                    } else {
                                        resolve('You need to voucher:)')
                                    }
                                })
                            }
                        });
                    }


                }
                else {
                    Swal.fire(res.data.ResponseMSG);
                }
            }, function (reason) {
                Swal.fire('Failed' + reason);
            });
             

        }


    }
 
    $scope.GetDataForDeliveryNote = function (curData) {

        var vRate = $scope.SelectedVoucher.VatRate;

        var vDate = $filter('date')(new Date(), 'yyyy-MM-dd');
        var eDate = $filter('date')(new Date(), 'yyyy-MM-dd');

        if (!$scope.SelectedVoucher || $scope.SelectedVoucher.VoucherId == 0) {
            Swal.fire('Delivery Voucher Not Found');
            return;
        }

        var uid = curData.CostClassId.toString() + '-' + $scope.SelectedVoucher.VoucherId.toString() + '-' + curData.OrderNo;
        var tmpSales = {
            TranId: 0,
            VoucherId: $scope.SelectedVoucher.VoucherId,
            CostClassId: curData.CostClassId,
            AutoVoucherNo: 0,
            Narration: (curData.Narration ? curData.Narration : '') ,
            VoucherDate: vDate,            
            RefNo: curData.AutoManualNo,
            AutoManualNo: '',
            PartyLedgerId: curData.PartyLedgerId,
            SalesLedgerId: 0,            
            AgentId: (curData.AgentId ? curData.AgentId : 0),
            PartyCostCenter: 0,
            TranCostCenter: 0,
            EntryDate: eDate,
            BranchId: curData.BranchId ? curData.BranchId : 0,
            IsAbbInvoice: false,
            ItemAllocationColl: [],
            AditionalCostColl: [],
            DeliveryNoteDetail: {},
            GodownId: 0,
            Attributes: curData.Attributes,
            UDFKeyVal: curData.UDFKeyVal,
            PaymentTermColl: [],
            Api_ResponseId: '',
            UniqueId: uid,
            TotalAmount: curData.TotalAmount,

        };

        angular.forEach(curData.PaymentTermColl, function (pt) {
            if (pt.Amount > 0) {
                pt.VoucherId=curData.SelectedRecVoucher.VoucherId,
                tmpSales.PaymentTermColl.push(pt);
            }
        });

        if (curData.SelectedBank && curData.BankAmount > 0) {
            curData.SelectedBank.VoucherId = curData.SelectedRecVoucher.VoucherId,
                curData.SelectedBank.Amount = curData.BankAmount;
            tmpSales.PaymentTermColl.push(curData.SelectedBank);
        }
         
        angular.forEach(curData.ItemDetailsColl, function (itemDet) {
            if (itemDet.ProductId && itemDet.ProductId > 0 && itemDet.ActualQty > 0) {
                var itemAllocation = {
                    UDFKeyVal: itemDet.UDFKeyVal,
                    Attributes: itemDet.Attributes,
                    Narration:itemDet.Narration,
                    ProductId: itemDet.ProductId,
                    ActualQty: itemDet.PendingOrderQty,
                    BilledQty: itemDet.PendingOrderQty,
                    UnitId: itemDet.UnitId,
                    Rate: itemDet.Rate,
                    RatePer: isEmptyAmt(itemDet.RatePer),
                    RateUnitId: itemDet.RateUnitId,
                    RateFormula: itemDet.RateFormula,                    
                    Amount: itemDet.Amount,
                    DiscountAmt: isEmptyAmt(itemDet.DiscountAmt),
                    DiscountPer: isEmptyAmt(itemDet.DiscountPer),
                    SchameAmt: 0,
                    SchamePer: 0,
                    ALUnitId1: (itemDet.ALQty1>0 ?  itemDet.ALUnitId1 : 0),
                    ALUnitId2: (itemDet.ALQty2>0 ?  itemDet.ALUnitId2 : 0),
                    ALUnitId3: 0,
                    ALValue1: itemDet.ALQty1,
                    ALValue2: itemDet.ALQty2,
                    ALValue3: 0,                    
                    DeliveryNoteItemAllocationId: 0,
                    OrderItemAllocationId: itemDet.ItemAllocationId,
                    DispatchSectionItemAllocationId: 0,
                    ReceivedNoteItemAllocationId: 0,
                    QuotationItemAllocationId: 0,
                    BundleId: 0,
                    BundleQty: 0,
                    Description: itemDet.Description,
                    LedgerId: 0,
                    ItemDetailsColl: [],
                    GodownId: 0,
                    VatRate: 0,
                    VatAmount: 0,
                    VatAbleAmt: 0,
                    ExDutyRate: 0,
                    ExDutyAmount: 0,
                    Description: '',
                    RefQty: (itemDet.PendingOrderQty > 0 ? itemDet.PendingOrderQty : 0),
                    TranUnit: itemDet.TranUnit,
                    TranUnitQty: itemDet.TranUnitQty,
                    Batch: itemDet.Batch,
                    LotNo:itemDet.LotNo,
                };
                tmpSales.ItemAllocationColl.push(itemAllocation);
            }

        });

        curData.AditionalChargeColl.forEach(function (adc) {
            tmpSales.AditionalCostColl.push({
                LedgerId: adc.LedgerId,
                AccessableValue: (adc.AccessableValue ? adc.AccessableValue : 0),
                Rate: (adc.Rate ? adc.Rate : 0),
                Amount: (adc.Amount ? adc.Amount : 0),
            });
        })



        return tmpSales;


    };


    $scope.ValidLedAllocationColl = [];
    $scope.IsValidTran = function (curData,ind) {
        $scope.ValidLedAllocationColl = [];
        if ($scope.IsValidData() == true) {

            $scope.loadingstatus = "running";
            showPleaseWait();

            $http({
                method: 'POST',
                url: base_url + "Global/IsValidVoucher",
                headers: { 'Content-Type': undefined },

                transformRequest: function (data) {

                    var formData = new FormData();
                    formData.append("EntityId", DEntityId);
                    formData.append("jsonData", angular.toJson(data.jsonData));
                    return formData;
                },
                data: { jsonData: $scope.GetDataForDeliveryNote(curData) }
            }).then(function (res) {

                $scope.loadingstatus = "stop";
                hidePleaseWait();
                if (res.data.IsSuccess == true) {
                    if (res.data.IsSuccess == true)
                    {
                        Swal.fire('Valid Transaction');                        
                    } else {
                        Swal.fire(res.data.ResponseMSG);
                    }
                } else {
                    Swal.fire(res.data.ResponseMSG);
                }
            }, function (errormessage) {
                hidePleaseWait();
                $scope.loadingstatus = "stop";
            });

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
                    CancelRemarks: (obj.CancelRemarks ? obj.CancelRemarks : ''),
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

    $scope.Print = function (TranId, vId,bdId)
    {
        var VoucherType = 13;
        $http({
            method: 'GET',
            url: base_url + "ReportEngine/GetReportTemplates?entityId=" + OEntityId + "&voucherId=" + vId + "&isTran=true",
            dataType: "json"
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                var templatesColl = res.data.Data;
                if (templatesColl && templatesColl.length > 0) {
                    var templatesName = [];
                    var sno = 1;
                    angular.forEach(templatesColl, function (tc) {
                        templatesName.push(sno + '-' + tc.ReportName);
                        sno++;
                    });

                    var printDone = false;

                    var rptTranId = 0;
                    if (templatesColl.length == 1)
                        rptTranId = templatesColl[0].RptTranId;
                    else {
                        Swal.fire({
                            title: 'Report Templates For Print',
                            input: 'select',
                            inputOptions: templatesName,
                            inputPlaceholder: 'Select a template',
                            showCancelButton: true,
                            inputValidator: (value) => {
                                return new Promise((resolve) => {
                                    if (value >= 0) {
                                        resolve()
                                        rptTranId = templatesColl[value].RptTranId;

                                        printDone = true;
                                        if (rptTranId > 0) {

                                            if ($scope.SelectedVoucher.PrintPreviewAs == 2) {
                                                var newURL = base_url + "newpdfviewer.ashx?rpttranid=" + rptTranId + "&istransaction=true&entityid=" + OEntityId + "&voucherid=" + vId + "&tranid=" + TranId + "&vouchertype=" + VoucherType + "&BranchId=" + bdId;
                                                window.open(newURL);
                                            } else if ($scope.SelectedVoucher.PrintPreviewAs == 3) {
                                                var printPara = {
                                                    rpttranid: rptTranId,
                                                    istransaction: true,
                                                    entityid: EntityId,
                                                    voucherid: vId,
                                                    tranid: TranId,
                                                    vouchertype: VoucherType,
                                                    BranchId:bdId,
                                                };
                                                $http({
                                                    method: 'POST',
                                                    url: base_url + "Global/PrintVoucher",
                                                    headers: { 'Content-Type': undefined },

                                                    transformRequest: function (data) {

                                                        var formData = new FormData();
                                                        formData.append("jsonData", angular.toJson(data.jsonData));

                                                        return formData;
                                                    },
                                                    data: { jsonData: printPara }
                                                }).then(function (res) {

                                                    $scope.loadingstatus = "stop";
                                                    hidePleaseWait();

                                                    if (res.data.IsSuccess == true) {
                                                        var filePath = res.data.ResponseMSG;
                                                        $scope.PrintFile(filePath, '');
                                                    }

                                                }, function (errormessage) {
                                                    hidePleaseWait();
                                                    $scope.loadingstatus = "stop";

                                                });

                                            }
                                            else {
                                                document.body.style.cursor = 'wait';
                                                document.getElementById("frmRpt").src = '';
                                                document.getElementById("frmRpt").src = base_url + "web/ReportViewer.aspx?rpttranid=" + rptTranId + "&istransaction=true&entityid=" + OEntityId + "&voucherid=" + vId + "&tranid=" + TranId + "&vouchertype=" + VoucherType + "&BranchId=" + bdId;
                                                document.body.style.cursor = 'default';
                                                $('#FrmPrintReport').modal('show');
                                            }



                                        }
                                    } else {
                                        resolve('You need to select:)')
                                    }
                                })
                            }
                        })
                    }

                    if (rptTranId > 0) {


                        if ($scope.SelectedVoucher.PrintPreviewAs == 2) {
                            var newURL = base_url + "newpdfviewer.ashx?rpttranid=" + rptTranId + "&istransaction=true&entityid=" + OEntityId + "&voucherid=" + vId + "&tranid=" + TranId + "&vouchertype=" + VoucherType + "&BranchId=" + bdId;
                            window.open(newURL);
                        } else if ($scope.SelectedVoucher.PrintPreviewAs == 3) {
                            var printPara = {
                                rpttranid: rptTranId,
                                istransaction: true,
                                entityid: EntityId,
                                voucherid: vId,
                                tranid: TranId,
                                vouchertype: VoucherType,
                                BranchId:bdId
                            };
                            $http({
                                method: 'POST',
                                url: base_url + "Global/PrintVoucher",
                                headers: { 'Content-Type': undefined },

                                transformRequest: function (data) {

                                    var formData = new FormData();
                                    formData.append("jsonData", angular.toJson(data.jsonData));

                                    return formData;
                                },
                                data: { jsonData: printPara }
                            }).then(function (res) {

                                $scope.loadingstatus = "stop";
                                hidePleaseWait();

                                if (res.data.IsSuccess == true) {
                                    var filePath = res.data.ResponseMSG;
                                    $scope.PrintFile(filePath, '');
                                }

                            }, function (errormessage) {
                                hidePleaseWait();
                                $scope.loadingstatus = "stop";

                            });

                        }
                        else {
                            document.body.style.cursor = 'wait';
                            document.getElementById("frmRpt").src = '';
                            document.getElementById("frmRpt").src = base_url + "web/ReportViewer.aspx?rpttranid=" + rptTranId + "&istransaction=true&entityid=" + OEntityId + "&voucherid=" + vId + "&tranid=" + TranId + "&vouchertype=" + VoucherType + "&BranchId=" + bdId;
                            document.body.style.cursor = 'default';
                            $('#FrmPrintReport').modal('show');
                        }

                    }

                } else
                    Swal.fire('No Templates found for print');
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

    };

    $scope.PrintDelivery = function (TranId, vId, bdId) {

        var VoucherType = 12;        
        $http({
            method: 'GET',
            url: base_url + "ReportEngine/GetReportTemplates?entityId=" + DEntityId + "&voucherId=" + vId + "&isTran=true",
            dataType: "json"
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                var templatesColl = res.data.Data;
                if (templatesColl && templatesColl.length > 0) {
                    var templatesName = [];
                    var sno = 1;
                    angular.forEach(templatesColl, function (tc) {
                        templatesName.push(sno + '-' + tc.ReportName);
                        sno++;
                    });

                    var printDone = false;

                    var rptTranId = 0;
                    if (templatesColl.length == 1)
                        rptTranId = templatesColl[0].RptTranId;
                    else {
                        Swal.fire({
                            title: 'Report Templates For Print',
                            input: 'select',
                            inputOptions: templatesName,
                            inputPlaceholder: 'Select a template',
                            showCancelButton: true,
                            inputValidator: (value) => {
                                return new Promise((resolve) => {
                                    if (value >= 0) {
                                        resolve()
                                        rptTranId = templatesColl[value].RptTranId;

                                        printDone = true;
                                        if (rptTranId > 0) {

                                            if ($scope.SelectedVoucher.PrintPreviewAs == 2) {
                                                var newURL = base_url + "newpdfviewer.ashx?rpttranid=" + rptTranId + "&istransaction=true&entityid=" + DEntityId + "&voucherid=" + vId + "&tranid=" + TranId + "&vouchertype=" + VoucherType + "&BranchId=" + bdId;
                                                window.open(newURL);
                                            } else if ($scope.SelectedVoucher.PrintPreviewAs == 3) {
                                                var printPara = {
                                                    rpttranid: rptTranId,
                                                    istransaction: true,
                                                    entityid: DEntityId,
                                                    voucherid: vId,
                                                    tranid: TranId,
                                                    vouchertype: VoucherType,
                                                    BranchId: bdId,
                                                };
                                                $http({
                                                    method: 'POST',
                                                    url: base_url + "Global/PrintVoucher",
                                                    headers: { 'Content-Type': undefined },

                                                    transformRequest: function (data) {

                                                        var formData = new FormData();
                                                        formData.append("jsonData", angular.toJson(data.jsonData));

                                                        return formData;
                                                    },
                                                    data: { jsonData: printPara }
                                                }).then(function (res) {

                                                    $scope.loadingstatus = "stop";
                                                    hidePleaseWait();

                                                    if (res.data.IsSuccess == true) {
                                                        var filePath = res.data.ResponseMSG;
                                                        $scope.PrintFile(filePath, '');
                                                    }

                                                }, function (errormessage) {
                                                    hidePleaseWait();
                                                    $scope.loadingstatus = "stop";

                                                });

                                            }
                                            else {
                                                document.body.style.cursor = 'wait';
                                                document.getElementById("frmRpt").src = '';
                                                document.getElementById("frmRpt").src = base_url + "web/ReportViewer.aspx?rpttranid=" + rptTranId + "&istransaction=true&entityid=" + DEntityId + "&voucherid=" + vId + "&tranid=" + TranId + "&vouchertype=" + VoucherType + "&BranchId=" + bdId;
                                                document.body.style.cursor = 'default';
                                                $('#FrmPrintReport').modal('show');
                                            }



                                        }
                                    } else {
                                        resolve('You need to select:)')
                                    }
                                })
                            }
                        })
                    }

                    if (rptTranId > 0) {


                        if ($scope.SelectedVoucher.PrintPreviewAs == 2) {
                            var newURL = base_url + "newpdfviewer.ashx?rpttranid=" + rptTranId + "&istransaction=true&entityid=" + DEntityId + "&voucherid=" + vId + "&tranid=" + TranId + "&vouchertype=" + VoucherType + "&BranchId=" + bdId;
                            window.open(newURL);
                        } else if ($scope.SelectedVoucher.PrintPreviewAs == 3) {
                            var printPara = {
                                rpttranid: rptTranId,
                                istransaction: true,
                                entityid: DEntityId,
                                voucherid: vId,
                                tranid: TranId,
                                vouchertype: VoucherType,
                                BranchId: bdId
                            };
                            $http({
                                method: 'POST',
                                url: base_url + "Global/PrintVoucher",
                                headers: { 'Content-Type': undefined },

                                transformRequest: function (data) {

                                    var formData = new FormData();
                                    formData.append("jsonData", angular.toJson(data.jsonData));

                                    return formData;
                                },
                                data: { jsonData: printPara }
                            }).then(function (res) {

                                $scope.loadingstatus = "stop";
                                hidePleaseWait();

                                if (res.data.IsSuccess == true) {
                                    var filePath = res.data.ResponseMSG;
                                    $scope.PrintFile(filePath, '');
                                }

                            }, function (errormessage) {
                                hidePleaseWait();
                                $scope.loadingstatus = "stop";

                            });

                        }
                        else {
                            document.body.style.cursor = 'wait';
                            document.getElementById("frmRpt").src = '';
                            document.getElementById("frmRpt").src = base_url + "web/ReportViewer.aspx?rpttranid=" + rptTranId + "&istransaction=true&entityid=" + DEntityId + "&voucherid=" + vId + "&tranid=" + TranId + "&vouchertype=" + VoucherType + "&BranchId=" + bdId;
                            document.body.style.cursor = 'default';
                            $('#FrmPrintReport').modal('show');
                        }

                    }

                } else
                    Swal.fire('No Templates found for print');
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

    };
});
