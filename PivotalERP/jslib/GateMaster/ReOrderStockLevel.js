app.controller("ReOrderStockLevelController", function ($scope, $filter, $http, $timeout, GlobalServices) {
    $scope.Title = 'ReOrderStockLevel';

    $scope.LoadData = function () {
        $('.select2').select2();

        $scope.perPageColl = GlobalServices.getPerPageList();

        $scope.currentPages = {
            ReOrderStockLevel: 1,
        };

        $scope.searchData = {
            ReOrderStockLevel: '',
        };

        $scope.perPage = {
            ReOrderStockLevel: GlobalServices.getPerPageRow(),
        };


        $scope.GodownColl = [
            { id: 1, text: 'INWARD' },
            { id: 2, text: 'OUTWARD' },
            { id: 3, text: 'BOTH' }
        ];

        $scope.ProductList = [];
        $http({
            method: 'GET',
            url: base_url + "Inventory/Reporting/GetAllProduct",
            dataType: "json",
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.ProductList = res.data.Data;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        $scope.GodownList = [];
        $http({
            method: 'GET',
            url: base_url + "Inventory/Creation/GetAllGodown",
            datatype: "json",
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.GodownList = res.data.Data;
            }
        }, function (reason) {
            swal.fire('failed' + reason);
        });

        $scope.newDet = {
            GodownId: null,

            ReOrderStockLevelColl: [],

            Mode: "Save"
        }
        $scope.confirmMSG = GlobalServices.getConfirmMSG();

        $scope.$watch('newDet.GodownId', function (newVal, oldVal) {
            if (newVal && newVal !== oldVal) {
                $scope.LoadReOrderStockLevelByGodown();
            }
        });
    }
    $scope.ClearFields = function () {
        $scope.newDet = {
            GodownId: null,
            ReOrderStockLevelColl: [],

            Mode: "Save"
        }
        $scope.AddBlankRow();

    }
    $scope.IsValidReOrderStockLevel = function () {
        return true;
    }

    $scope.LoadDefaultData = function () {
        $scope.AddBlankRow();
    };

    $scope.AddBlankRow = function () {

        if (!$scope.newDet.ReOrderStockLevelColl || $scope.newDet.ReOrderStockLevelColl.length == 0) {
            $scope.newDet.ReOrderStockLevelColl = [];
            $scope.newDet.ReOrderStockLevelColl.push({});
        }
    }

    $scope.AddPHDDet = function (ind) {
        if ($scope.newDet.ReOrderStockLevelColl[ind].ProductId > 0) {
            if ($scope.newDet.ReOrderStockLevelColl.length > ind + 1) {
                $scope.newDet.ReOrderStockLevelColl.splice(ind + 1, 0, {});
            } else {
                $scope.newDet.ReOrderStockLevelColl.push({});
            }
        }
    };
    $scope.delPHDDet = function (ind) {
        if ($scope.newDet.ReOrderStockLevelColl) {
            if ($scope.newDet.ReOrderStockLevelColl.length > 1) {
                $scope.newDet.ReOrderStockLevelColl.splice(ind, 1);
            }
        }
    };


    $scope.LoadReOrderStockLevelByGodown = function () {
        var para = $scope.newDet.GodownId;
        $http({
            method: 'POST',
            url: base_url + "GateMaster/Creation/GetGodownData",
            data: { GodownId: para }

        }).then(function (res) {

            if (res.data.IsSuccess && res.data.Data) {
                $scope.newDet.ReOrderStockLevelColl = res.data.Data;
                console.log($scope.newDet.ReOrderStockLevelColl);
                if ($scope.newDet.ReOrderStockLevelColl.length === 0) {
                    //console.log("Inside else");
                    $scope.AddBlankRow();
                }
            }

        }, function (error) {

            console.log(error);

        });
    };

    $scope.SaveUpdateReOrderStockLevel = function () {
        if ($scope.IsValidReOrderStockLevel()) {
            if ($scope.confirmMSG.Accept == true) {
                var saveModify = $scope.newDet.Mode;
                Swal.fire({
                    title: 'Do you want to ' + saveModify + ' the current data?',
                    showCancelButton: true,
                    confirmButtonText: saveModify,
                }).then((result) => {
                    /* Read more about isConfirmed, isDenied below */
                    if (result.isConfirmed) {
                        $scope.CallSaveUpdateReOrderStockLevel();
                    }
                });
            } else
                $scope.CallSaveUpdateReOrderStockLevel();
        }
    };

    $scope.CallSaveUpdateReOrderStockLevel = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();
        var ProductId = $scope.newDet.ProductId;
        var dataToSave = [];
        for (var i = 0; i < $scope.newDet.ReOrderStockLevelColl.length; i++) {

            var S = $scope.newDet.ReOrderStockLevelColl[i];
            var dataItem = {
                GodownId: $scope.newDet.GodownId,
                ProductId: S.ProductId,
                LeadTimeDays: S.LeadTimeDays,
                MinStock: S.MinStock,
                MaxStock: S.MaxStock,
                IsActive: S.IsActive
            };
            dataToSave.push(dataItem);
        }

        $http({
            method: 'POST',
            url: base_url + "GateMaster/Creation/SaveReOrderStockLevel",
            headers: { 'Content-Type': undefined },
            transformRequest: function (data) {
                var formData = new FormData();
                formData.append("jsonData", angular.toJson(data.jsonData));
                return formData;
            },
            data: { jsonData: dataToSave }
        }).then(function (res) {
            $scope.loadingstatus = "stop";
            hidePleaseWait();
            Swal.fire(res.data.ResponseMSG);
            if (res.data.IsSuccess == true) {
                $scope.ClearFields();
            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
        });
    }

    $scope.ProductSelectionChange = function (itemDet, ind) {

        if (itemDet.ProductId > 0) {
            $http({
                method: 'GET',
                url: base_url + "Global/GetProductDetail?ProductId=" + itemDet.ProductId + "&VoucherType=" + VoucherType + "&VoucherId=" + $scope.SelectedVoucher.VoucherId,
                dataType: "json"
            }).then(function (res1) {
                if (res1.data.IsSuccess && res1.data.Data) {
                    var tmpdata = res1.data.Data;
                    itemDet.productDetail = tmpdata;


                    $scope.sideBarData = itemDet.sideBarData;

                    var isModify = $scope.beData.TranId > 0 ? true : false;

                    if (itemDet.ProductId == null) {
                        itemDet.ActualQty = 0;
                        itemDet.BilledQty = 0;
                        itemDet.Rate = 0;
                        itemDet.ClosingQty = '';
                        itemDet.UnitId = null;
                        itemDet.UnitName = '';
                        itemDet.DiscountAmt = 0;
                        itemDet.DiscountPer = 0;
                        itemDet.SchameAmt = 0;
                        itemDet.SchamePer = 0;
                        itemDet.ProductLedgerId = null;
                        itemDet.LossRate = 0;
                        itemDet.Makeing = 0;
                        itemDet.Stone = 0;
                        itemDet.NetWeight = 0;
                        itemDet.LossWeight = 0;
                        itemDet.BatchBalQty = 0;
                        itemDet.TranUnitId = null;

                        itemDet.FineRate = 0;
                        itemDet.FineWeight = 0;
                        itemDet.ProcessingRate = 0;
                        itemDet.ProcessingWeight = 0;

                        $scope.ChangeItemRowValue(itemDet, 'product');
                    } else if (itemDet.productDetail) {
                        itemDet.CanEditRate = itemDet.productDetail.CanEditRatePurchase;
                        itemDet.ClosingQty = $filter('formatNumber')(itemDet.productDetail.ClosingQty) + ' ' + itemDet.productDetail.BaseUnit;
                        itemDet.UnitId = itemDet.productDetail.BaseUnitId;
                        itemDet.UnitName = itemDet.productDetail.BaseUnit;

                        if (isModify == false) {
                            itemDet.Rate = itemDet.productDetail.PurchaseRate;
                            itemDet.ProductLedgerId = itemDet.productDetail.PurchaseLedgerId;
                            itemDet.LedgerId = itemDet.productDetail.PurchaseLedgerId;
                        } else {

                            if (!itemDet.ProductLedgerId || itemDet.ProductLedgerId == 0)
                                itemDet.ProductLedgerId = itemDet.productDetail.PurchaseLedgerId;

                            if (!itemDet.LedgerId || itemDet.LedgerId == 0)
                                itemDet.LedgerId = itemDet.productDetail.PurchaseLedgerId;
                        }



                        itemDet.Makeing = 0;
                        itemDet.Stone = 0;
                        itemDet.BatchBalQty = 0;
                        itemDet.FineRate = 0;
                        itemDet.FineWeight = 0;
                        itemDet.ProcessingRate = 0;
                        itemDet.ProcessingWeight = 0;
                        //itemDet.ActualQty = 0;
                        //itemDet.BilledQty = 0;
                        //itemDet.DiscountAmt = 0;
                        //itemDet.DiscountPer = 0;

                        if ($scope.SelectedVoucher.Product && $scope.SelectedVoucher.Product.VoucherWiseDecimalPlaces == true) {
                            itemDet.QtyDecimal = $scope.SelectedVoucher.Product.QtyNoOfDecimalPlaces;
                            itemDet.RateDecimal = $scope.SelectedVoucher.Product.RateNoOfDecimalPlaces;
                            itemDet.AmountDecimal = $scope.SelectedVoucher.Product.AmountNoOfDecimalPlaces;
                        } else {
                            var findUnit = $scope.UnitColl.firstOrDefault(p1 => p1.UnitId == itemDet.productDetail.BaseUnitId);
                            if (findUnit) {
                                itemDet.QtyDecimal = findUnit.NoOfDecimalPlaces;
                                itemDet.RateDecimal = findUnit.RateNoOfDecimalPlaces;
                                itemDet.AmountDecimal = findUnit.AmountNoOfDecimalPlaces;
                            }
                        }

                        if (isEmptyObj(itemDet.QtyDecimal))
                            itemDet.QtyDecimal = 0;

                        if (isEmptyObj(itemDet.RateDecimal))
                            itemDet.RateDecimal = 2;

                        if (isEmptyObj(itemDet.AmountDecimal))
                            itemDet.AmountDecimal = 2;

                        itemDet.LossRate = itemDet.productDetail.LossRate;
                        $scope.ChangeItemRowValue(itemDet, 'product');

                        var itemC = mx($scope.beData.ItemDetailsColl).where(p1 => p1.RowType == 'P').count();
                        if (ind == (itemC - 1))
                            $scope.AddRowInTable(ind);

                        $scope.GetPurchaseSetup(itemDet);
                    }

                }
            }, function (reason) {
                Swal.fire('Failed' + reason);
            });
        }



    }

    //$scope.ProductSelectionChange = function (itemDet, ind) {
    //    var isModify = $scope.beData.TranId > 0 ? true : false;

    //    if (itemDet.ProductId == null) {
    //        itemDet.ActualQty = 0;
    //        itemDet.BilledQty = 0;
    //        itemDet.Rate = 0;
    //        itemDet.ClosingQty = '';
    //        itemDet.UnitId = null;
    //        itemDet.UnitName = '';
    //        itemDet.DiscountAmt = 0;
    //        itemDet.DiscountPer = 0;
    //        itemDet.SchameAmt = 0;
    //        itemDet.SchamePer = 0;
    //        itemDet.ProductLedgerId = null;
    //        itemDet.Weight = 0;
    //        itemDet.WeightUnitId = null;
    //        itemDet.WeightUnit = '';
    //        itemDet.Volum = 0;
    //        itemDet.VolumUnit = '';
    //        itemDet.VolumUnitId = null;

    //        $scope.ChangeItemRowValue(itemDet, 'product');
    //    } else if (itemDet.productDetail) {


    //        itemDet.ClosingQty = $filter('formatNumber')(itemDet.productDetail.ClosingQty) + ' ' + itemDet.productDetail.BaseUnit;
    //        itemDet.UnitId = itemDet.productDetail.BaseUnitId;
    //        itemDet.UnitName = itemDet.productDetail.BaseUnit;


    //        if ($scope.SelectedVoucher.Product && $scope.SelectedVoucher.Product.VoucherWiseDecimalPlaces == true) {
    //            itemDet.QtyDecimal = $scope.SelectedVoucher.Product.QtyNoOfDecimalPlaces;
    //            itemDet.RateDecimal = $scope.SelectedVoucher.Product.RateNoOfDecimalPlaces;
    //            itemDet.AmountDecimal = $scope.SelectedVoucher.Product.AmountNoOfDecimalPlaces;
    //        } else {
    //            var findUnit = $scope.UnitColl.firstOrDefault(p1 => p1.UnitId == itemDet.productDetail.BaseUnitId);
    //            if (findUnit) {
    //                itemDet.QtyDecimal = findUnit.NoOfDecimalPlaces;
    //                itemDet.RateDecimal = findUnit.RateNoOfDecimalPlaces;
    //                itemDet.AmountDecimal = findUnit.AmountNoOfDecimalPlaces;
    //            }
    //        }

    //        if (isEmptyObj(itemDet.QtyDecimal))
    //            itemDet.QtyDecimal = 0;

    //        if (isEmptyObj(itemDet.RateDecimal))
    //            itemDet.RateDecimal = 2;

    //        if (isEmptyObj(itemDet.AmountDecimal))
    //            itemDet.AmountDecimal = 2
    //    }

    //}

})