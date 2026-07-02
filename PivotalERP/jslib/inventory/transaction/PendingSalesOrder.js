

app.controller("trnPendingSalesOrderCntrl", function ($scope, $http, $filter, $compile, $timeout, GlobalServices, $compile) {

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
            ShowClosing: true,
            ForAgentId: $scope.dayBook.AgentId
        };

        var para = {
            procName: 'U_PendingSalesOrder',
            qry: '',
            asParentChild: true,
            tblNames: 'OrderColl,ItemDetailsColl',
            colRelations: 'TranId,TranId',
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
            } else if (res.data.IsSuccess != undefined) {
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
    $scope.ChangeItemRowValue = function (curData, rowData, col, ind) {

        if (col == undefined || col == null)
            col = 'qty';

        $scope.RecalculateAdditioncalCost(curData, rowData, col, ind);
    }
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
    $scope.RecalculateAdditioncalCost = function (curData, rowData, colName, ind) {


        var productAmt = 0;
        var totalQty = 0;

        angular.forEach(curData.ItemDetailsColl, function (idet) {
            idet.ActualQty = isEmptyAmt(idet.ActualQty);
            idet.Rate = isEmptyAmt(idet.Rate);
            idet.Amount = isEmptyAmt(idet.Amount);
            idet.DiscountAmt = isEmptyAmt(idet.DiscountAmt);
            idet.DiscountPer = isEmptyAmt(idet.DiscountPer);

            totalQty += idet.ActualQty;

            if (colName == 'qty') {
                idet.Amount = (idet.ActualQty * idet.Rate) - idet.DiscountAmt;
            }
            else if (colName == 'rate') {
                idet.Amount = (idet.ActualQty * idet.Rate) - idet.DiscountAmt;
            }
            else if (colName == 'disPer') {

                if (idet.DiscountPer > 0)
                    idet.DiscountAmt = (idet.ActualQty * idet.Rate) * idet.DiscountPer / 100;
                else
                    idet.DiscountAmt = 0;

                idet.Amount = (idet.ActualQty * idet.Rate) - idet.DiscountAmt;
            }
            else if (colName == 'disAmt') {

                if (idet.DiscountAmt > 0)
                    idet.DiscountPer = (idet.DiscountAmt / (idet.ActualQty * idet.Rate)) * 100;

                idet.Amount = (idet.ActualQty * idet.Rate) - idet.DiscountAmt;
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
                } else
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
    $scope.MakeSalesInvoice = function (curData, ind) {


        if ($scope.IsValidData() == true) {


            $timeout(function () {

                Swal.fire({
                    title: 'Do you want to make invoice selected order ?',
                    showCancelButton: true,
                    confirmButtonText: "Make Invoice",
                }).then((result) => {
                    /* Read more about isConfirmed, isDenied below */
                    if (result.isConfirmed) {
                        $scope.loadingstatus = "running";
                        showPleaseWait();


                        $http({
                            method: 'POST',
                            url: base_url + "Inventory/Transaction/SaveUpdateSalesInvoice",
                            headers: { 'Content-Type': undefined },

                            transformRequest: function (data) {

                                var formData = new FormData();
                                formData.append("jsonData", angular.toJson(data.jsonData));

                                return formData;
                            },
                            data: { jsonData: $scope.GetDataForInvoice(curData) }
                        }).then(function (res) {

                            $scope.loadingstatus = "stop";
                            hidePleaseWait();

                            if (res.data.IsSuccess == true) {
                                $scope.PendingVoucherColl.splice(ind, 1);
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

            }, 300);

        }


    }

    $scope.GetDataForInvoice = function (curData) {

        var vRate = $scope.SelectedVoucher.VatRate;

        var vDate = $filter('date')(new Date(), 'yyyy-MM-dd');
        var eDate = $filter('date')(new Date(), 'yyyy-MM-dd');

        if ($scope.VoucherTypeColl.length > 1) {
            var findV = mx($scope.VoucherTypeColl).firstOrDefault(p1 => p1.BDId == curData.BranchId);
            if (findV) {
                $scope.SelectedVoucher.VoucherId = findV.VoucherId;

            } else {
                Swal.fire('SalesInvoice Voucher Not Found');
                return;
            }

        }

        var tmpSales = {
            TranId: 0,
            VoucherId: $scope.SelectedVoucher.VoucherId,
            CostClassId: $scope.SelectedVoucher.CostClassId,
            AutoVoucherNo: 0,
            Narration: (curData.Narration ? curData.Narration : '') + ' ' + (curData.OrderNo ? curData.OrderNo : ''),
            VoucherDate: vDate,
            //RefNo: curData.OrderNo,
            RefNo: '',
            AutoManualNo: '',
            PartyLedgerId: curData.PartyLedgerId,
            SalesLedgerId: 0,
            TotalAmount: 0,
            AgentId: (curData.AgentId ? curData.AgentId : 0),
            PartyCostCenter: 0,
            TranCostCenter: 0,
            EntryDate: eDate,
            BranchId: curData.BranchId ? curData.BranchId : 0,
            IsAbbInvoice: false,
            ItemAllocationColl: [],
            AditionalCostColl: [],
            SalesInvoiceDetail: {
                Buyes: curData.PartyName,
                Address: curData.Address,
                SalesTaxNo: '',
                PhoneNo: ''
            },
            GodownId: 0,
            Attributes: '',
            PaymentTermColl: [],
            Api_ResponseId: '',
        };


        angular.forEach(curData.ItemDetailsColl, function (itemDet) {
            if (itemDet.ProductId && itemDet.ProductId > 0 && itemDet.ActualQty > 0) {
                var itemAllocation = {
                    UDFKeyVal: '',
                    Attributes: '',
                    ProductId: itemDet.ProductId,
                    ActualQty: itemDet.ActualQty,
                    BilledQty: itemDet.ActualQty,
                    UnitId: itemDet.UnitId,
                    Rate: itemDet.Rate,
                    Amount: itemDet.Amount,
                    DiscountAmt: isEmptyAmt(itemDet.DiscountAmt),
                    DiscountPer: isEmptyAmt(itemDet.DiscountPer),
                    SchameAmt: 0,
                    SchamePer: 0,
                    ALUnitId1: 0,
                    ALUnitId2: 0,
                    ALUnitId3: 0,
                    ALValue1: 0,
                    ALValue2: 0,
                    ALValue3: 0,
                    Narration: '',
                    DeliveryNoteItemAllocationId: 0,
                    OrderItemAllocationId: itemDet.ItemAllocationId,
                    DispatchSectionItemAllocationId: 0,
                    ReceivedNoteItemAllocationId: 0,
                    QuotationItemAllocationId: 0,
                    BundleId: 0,
                    BundleQty: 0,
                    Description: '',
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

    $scope.SelectedVoucher = null;
    $scope.CancelModal = function (obj, ind) {

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
                    AutoManualNo: obj.OrderNo
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

    $scope.Print = function (TranId, vId, bdId) {
        var VoucherType = 12;
        $http({
            method: 'GET',
            url: base_url + "ReportEngine/GetReportTemplates?entityId=" + EntityId + "&voucherId=" + vId + "&isTran=true",
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
                                                var newURL = base_url + "newpdfviewer.ashx?rpttranid=" + rptTranId + "&istransaction=true&entityid=" + EntityId + "&voucherid=" + vId + "&tranid=" + TranId + "&vouchertype=" + VoucherType + "&BranchId=" + bdId;
                                                window.open(newURL);
                                            } else if ($scope.SelectedVoucher.PrintPreviewAs == 3) {
                                                var printPara = {
                                                    rpttranid: rptTranId,
                                                    istransaction: true,
                                                    entityid: EntityId,
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
                                                document.getElementById("frmRpt").src = base_url + "web/ReportViewer.aspx?rpttranid=" + rptTranId + "&istransaction=true&entityid=" + EntityId + "&voucherid=" + vId + "&tranid=" + TranId + "&vouchertype=" + VoucherType + "&BranchId=" + bdId;
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
                            var newURL = base_url + "newpdfviewer.ashx?rpttranid=" + rptTranId + "&istransaction=true&entityid=" + EntityId + "&voucherid=" + vId + "&tranid=" + TranId + "&vouchertype=" + VoucherType + "&BranchId=" + bdId;
                            window.open(newURL);
                        } else if ($scope.SelectedVoucher.PrintPreviewAs == 3) {
                            var printPara = {
                                rpttranid: rptTranId,
                                istransaction: true,
                                entityid: EntityId,
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
                            document.getElementById("frmRpt").src = base_url + "web/ReportViewer.aspx?rpttranid=" + rptTranId + "&istransaction=true&entityid=" + EntityId + "&voucherid=" + vId + "&tranid=" + TranId + "&vouchertype=" + VoucherType + "&BranchId=" + bdId;
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


    $scope.CopyData = null;
    $scope.CopyTran = function () {
        $scope.CopyData = null;
        if ($scope.beData) {
            if ($scope.beData.TranId > 0) {
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
