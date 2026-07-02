app.controller('Consumption', function ($scope, $http, $timeout, $filter, $compile, GlobalServices, $document) {
    $scope.Title = 'Consumption';
    var glSrv = GlobalServices;
    LoadData();

    $scope.sideBarData = [];
  
    $scope.lastTranId = 0;
    function LoadData() {

 $scope.DefaultKeyValues_JSON = null;
        if (DefaultKeyValues && DefaultKeyValues.length > 0) {
            $scope.DefaultKeyValues_JSON = JSON.parse(decodeURIComponent(DefaultKeyValues));           
        }
		
        $('.select2bs4').select2();
        $('.select2').select2();

        $scope.confirmMSG = glSrv.getConfirmMSG();

        $scope.ProjectColl = [];
        GlobalServices.getProject().then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.ProjectColl = res.data.Data;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        $scope.RefVoucherTypeColl = [{ id: 1, text: 'DeliveryNote' }];
        $scope.comDet = {};
        GlobalServices.getCompanyDet().then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.comDet = res.data.Data;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        $scope.VoucherSearchOptions = [{ text: 'VoucherNo', value: 'TS.AutoManualNo', searchType: 'text' }, { text: 'RefNo', value: 'TS.[No]', searchType: 'text' }, { text: 'VoucherDate', value: 'TS.VoucherDate', searchType: 'date' }, { text: 'Voucher', value: 'V.VoucherName', searchType: 'text' }, { text: 'CostClass', value: 'CC.Name', searchType: 'text' }, { text: 'IsOpening', value: 'TS.IsOpening', searchType: 'Bool' }];
        $scope.paginationOptions = {
            pageNumber: 1,
            pageSize: glSrv.getPerPageRow(),
            sort: null,
            SearchType: 'text',
            SearchCol: '',
            SearchVal: '',
            SearchColDet: $scope.VoucherSearchOptions[0],
            pagearray: [],
            pageOptions: [5, 10, 20, 30, 40, 50]
        };
        

        $scope.mandetoryFields = {};
        $scope.PaymentTermList = [];
        $scope.PaymentTermList.push('CASH');
        $scope.PaymentTermList.push('BANK');
        $scope.PaymentTermList.push('CREDIT');
        $scope.VoucherTypeColl = [];
        $scope.CostClassColl = [];
        $scope.NarrationList = [];
        $scope.SelectedVoucher = null;
        $scope.SelectedCostClass = null;
        $scope.SalesFeatures = {};
        $scope.Config = {};
        $scope.RefItemAllocationColl = [];
        $scope.GodownColl = [];

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
            ProductDescript: true,
            ProductPoint: true,
            ProductLedger: true,
            ShowProductWiseLedger: true,
            AlternetUnit: true,
            AlternetUnit1: true,
            AlternetUnit2: true,
            EntryDate: true,
            Batch: true,
            EachNarration: true,
            ExciseDuty: true,
            Vat: true,
            Amount: false,
            Rate: false

        }

        $scope.beData =
        {
            VoucherId: 0,
            TranId: 0,
            AutoManualNo: '',
            AutoVoucherNo: 0,
            VoucherDate: new Date(),
            partySideBarData: null,
            SalesMan: null,
            salesmanSideBarData: null,
            CurRate: 1,
            SourceItemDetailsColl: [],
            TargetItemDetailsColl: [],
            SourceItemColl: [],
            TargetItemColl: [],
            AttechFiles: [],
            SubTotal: 0,
            Total: 0,
            SourceGodownId: 0,
            TargetGodownId: 0,
            Narration: '',
            RefVoucherType: 1,
            VoucherDate: new Date(),
			DocumentColl: [],
        };

        $scope.beData.SourceItemDetailsColl.push(
            {
                RowType: 'P',
                ProductId: 0,
                productDetail: null,
                ActualQty: 0,
                BilledQty: 0,
                FreeQty: 0,
                Rate: 0,
                DiscountPer: 0,
                DiscountAmt: 0,
                SchameAmt: 0,
                SchamePer: 0,
                Amount: 0,
                Description: '',
                QtyPoint: 0,
                UnitId: null,
                CanEditRate: false,
                ALValue1: 0,
                ALValue2: 0,
                ALUnitId1: null,
                ALUnitId2: null,
                SchemeAmt: 0,
                SchemeAmt: 0,
                QtyDecimal: 2,
                RateDecimal: 2,
                AmountDecimal: 2
            });


        $('.hideSideBar').on('focus', function (e) {
            $('#sidebarzz').removeClass();
            $('#sidebarzz').addClass('order-last float-right active');
        })


        $scope.UnitColl = [];
        $http({
            method: 'GET',
            url: base_url + "Inventory/Creation/GetAllUnit",
            dataType: "json"
            //data:JSON.stringify(para)
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.UnitColl = mx(res.data.Data);
            }
        }, function (reason) {
            alert('Failed' + reason);
        });

        $scope.ProductBrandColl = []; //declare an empty array 
        $http({
            method: 'GET',
            url: base_url + "Inventory/Creation/GetAllProductBrand",
            dataType: "json"
            //data:JSON.stringify(para)
        }).then(function (res) {
            $scope.ProductBrandColl = res.data.Data;
        }, function (reason) {
            alert('Failed' + reason);
        });

        $scope.DepartmentColl = [];
        $http({
            method: 'GET',
            url: base_url + "Account/Creation/GetAllCostCenterDepartment",
            dataType: "json" 
        }).then(function (res) {             
            if (res.data.IsSuccess && res.data.Data) {
                $scope.DepartmentColl = res.data.Data;
                $scope.DepartmentQry = mx($scope.DepartmentColl);
            }  
        }, function (reason) {
            alert('Failed' + reason);
        });


 $scope.EPDet = {};
        $scope.EPColl = [];
        $scope.ItemFormula = {};
        GlobalServices.getEntityProperties(EntityId).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.EPColl = res.data.Data;
                angular.forEach($scope.EPColl, function (ep) {
                    $scope.EPDet[ep.Name] = ep;
                    //$scope.newProduct[ep.Name] = ep.DefaultValue;
                });

                if ($scope.EPDet) {
                    for (key in $scope.EPDet) {
                        if (key.startsWith("ItemAllocationColl") == true) {
                            var proName = key.replace("ItemAllocationColl.", "");

                            if ($scope.EPDet[key].Formula && $scope.EPDet[key].Formula.length>0)
                                $scope.ItemFormula[proName] = $scope.EPDet[key].Formula;
                        }
                    }
                }
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
		
		
        if (VoucherType) {

            $http({
                method: 'GET',
                url: base_url + "Setup/Security/GetConfirmationMSG",
                dataType: "json"
            }).then(function (res) {
                if (res.data.IsSuccess && res.data.Data) {
                    $scope.confirmMSG = res.data.Data;
                } else {
                    Swal.fire(res.data.ResponseMSG);
                }

            }, function (reason) {
                Swal.fire('Failed' + reason);
            });

            $scope.GodownColl = [];
            $http({
                method: 'GET',
                url: base_url + "Inventory/Creation/GetUserWiseGodown",
                dataType: "json"
            }).then(function (res) {
                if (res.data.IsSuccess && res.data.Data) {
                    $scope.GodownColl = res.data.Data;
                    if ($scope.GodownColl.length == 1) {
                        $scope.beData.GodownId = $scope.GodownColl[0].GodownId;
                        $scope.HideShow.Godown = true;
                    } else {
                        $scope.HideShow.Godown = false;
                        $scope.beData.GodownId = null;
                    }
                } else {
                    Swal.fire(res.data.ResponseMSG);
                }

            }, function (reason) {
                Swal.fire('Failed' + reason);
            });


          

            $http({
                method: 'GET',
                url: base_url + "Account/Creation/GetVoucherMandetoryFields?voucherType=" + VoucherType,
                dataType: "json"
            }).then(function (res) {
                if (res.data.IsSuccess && res.data.Data) {
                    $scope.mandetoryFields = res.data.Data;
                } else
                    Swal.fire(res.data.ResponseMSG);
            }, function (reason) {
                Swal.fire('Failed' + reason);
            });

            $http({
                method: 'GET',
                url: base_url + "Account/Creation/GetVoucherWiseNarration?voucherType=" + VoucherType,
                dataType: "json"
            }).then(function (res) {
                if (res.data.IsSuccess && res.data.Data) {
                    $scope.NarrationList = res.data.Data;
                } else
                    Swal.fire(res.data.ResponseMSG);
            }, function (reason) {
                Swal.fire('Failed' + reason);
            });


             var filterObjs_VoucherId = null;
            if ($scope.DefaultKeyValues_JSON) {
                try {
                    var findVoucherFilter = $scope.DefaultKeyValues_JSON["VoucherId"];
                    if (findVoucherFilter) {
                        filterObjs_VoucherId = JSON.parse(findVoucherFilter);
                    }
                } catch { }
            }

            $scope.DefaultBranch = null;
            GlobalServices.getDefaultBranch().then(function (dbres) {
                if (dbres.data.IsSuccess && dbres.data.Data) {
                    $scope.DefaultBranch = dbres.data.Data;
                }

                if ($scope.DefaultBranch) {
                    if (filterObjs_VoucherId == null) {
                        filterObjs_VoucherId = {};
                    }

                    filterObjs_VoucherId['BDId'] = $scope.DefaultBranch.BranchId;
                }

                var vt_Para = {
                    voucherType: VoucherType,
                    filterPara: filterObjs_VoucherId,
                };

                $http({
                    method: 'POST',
                    url: base_url + "Account/Creation/GetVoucherList",
                    dataType: "json",
                    data: JSON.stringify(vt_Para)
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

                                        if ($scope.VoucherTypeColl.length <= 1)
                                            $scope.HideShow.VoucherType = true;
                                        else
                                            $scope.HideShow.VoucherType = false;

                                        if ($scope.CostClassColl.length <= 1)
                                            $scope.HideShow.CostClass = true;
                                        else
                                            $scope.HideShow.CostClass = false;

                                        $scope.getVoucherNo();

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


            }, function (reason) {
                Swal.fire('Failed to get default branch' + reason);
            });

        }

        $timeout(function () {
            GlobalServices.getCurrentDateTime().then(function (res) {
                var curDate = res.data.Data;
                if (curDate) {
                    $scope.beData.VoucherDate_TMP = new Date(curDate);
                }
            }, function (errormessage) {
                alert('Unable to Delete data. pls try again.' + errormessage.responseText);
            });
        });

         

        var columnDefs = [
            {
                headerName: "Date", field: "NY", filter: 'agNumberColumnFilter', width: 140, cellStyle: { 'text-align': 'center' }, checkboxSelection: true,
                valueGetter: function (params) {
                    return GetDateStr(params.data.NY, params.data.NM, params.data.ND);
                },
                headerCheckboxSelection: true,
                headerCheckboxSelectionFilteredOnly: true
            },
            { headerName: "Days", field: "Days", filter: "agTextColumnFilter", width: 80 },
            { headerName: "Bill No.", field: "AutoManualNo", filter: "agTextColumnFilter", width: 180 },
            { headerName: "Ref. No.", field: "RefNo", filter: 'agTextColumnFilter', width: 110 },
            { headerName: "Product", field: "Name", filter: 'agTextColumnFilter', width: 140 },
            { headerName: "Code", field: "Code", filter: 'agTextColumnFilter', width: 140 },
            { headerName: "Alias", field: "Alias", filter: 'agTextColumnFilter', width: 150 },
            { headerName: "Qty.", field: "ActualQty", filter: 'agNumberColumnFilter', width: 80, cellStyle: { 'text-align': 'right' }, valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "Unit", field: "UnitName", filter: 'agTextColumnFilter', width: 90 },
            { headerName: "Rate", field: "Rate", filter: 'agNumberColumnFilter', width: 80, cellStyle: { 'text-align': 'right' }, valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "Amount", field: "Amount", filter: 'agNumberColumnFilter', width: 100, cellStyle: { 'text-align': 'right' }, valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "Salesman", field: "SalesMan", filter: 'agTextColumnFilter', width: 140 },
        ];

     

        $scope.RefVoucherNoColl = [];
        $('#cboRefVoucherNo').select2();
        $('#cboRefVoucherNo').on("change", function (e) {
            var selectedData = $('#cboRefVoucherNo').select2('data');
            if (selectedData && selectedData.length > 0) {
                $scope.beData.RefTranIdColl = [];
                $scope.beData.RefAllotationIdColl = [];

                angular.forEach(selectedData, function (sd) {
                    $scope.beData.RefTranIdColl.push(parseInt(sd.id));
                });
                var refTranIdColl = mx($scope.beData.RefTranIdColl);
                var lstSelectedItem = null;
                angular.forEach($scope.RefItemAllocationColl, function (ri) {
                    if (refTranIdColl.contains(ri.TranId)) {
                        ri.IsSelected = true;
                        lstSelectedItem = ri;
                        $scope.beData.RefAllotationIdColl.push(ri.ItemAllocationId);
                    } else
                        ri.IsSelected = false;
                });

                if (lstSelectedItem)
                    $scope.getRefVoucherPartyDetails(lstSelectedItem);

            }

        });
    }
    

    $scope.AddRowInSourceItemDetails = function (ind, boolAuto) {

        if (boolAuto == true) {
            var len = $scope.beData.SourceItemDetailsColl.length;
            if ((ind + 1) != len)
                return;

            var selectItem = $scope.beData.SourceItemDetailsColl[ind];
            if (!selectItem.ProductId || selectItem.ProductId == null || selectItem.ProductId == 0)
                return;

        }

        if ($scope.beData.SourceItemDetailsColl) {
            if ($scope.beData.SourceItemDetailsColl.length > ind + 1) {
                $scope.beData.SourceItemDetailsColl.splice(ind + 1, 0, {
                    RowType: 'P',
                    ProductId: 0,
                    productDetail: null,
                    ActualQty: 0,
                    BilledQty: 0,
                    FreeQty: 0,
                    Rate: 0,
                    SourceGodownId: 0,
                    TargetGodownId: 0,
                    DiscountPer: 0,
                    DiscountAmt: 0,
                    SchameAmt: 0,
                    SchamePer: 0,
                    Amount: 0,
                    Description: '',
                    QtyPoint: 0,
                    UnitId: null,
                    CanEditRate: false,
                    ALValue1: 0,
                    ALValue2: 0,
                    ALUnitId1: null,
                    ALUnitId2: null
                })
            } else {
                $scope.beData.SourceItemDetailsColl.push({
                    RowType: 'P',
                    ProductId: 0,
                    productDetail: null,
                    ActualQty: 0,
                    BilledQty: 0,
                    FreeQty: 0,
                    Rate: 0,
                    DiscountPer: 0,
                    DiscountAmt: 0,
                    SchameAmt: 0,
                    SchamePer: 0,
                    Amount: 0,
                    SourceGodownId: 0,
                    TargetGodownId: 0,
                    Description: '',
                    QtyPoint: 0,
                    UnitId: null,
                    CanEditRate: false,
                    ALValue1: 0,
                    ALValue2: 0,
                    ALUnitId1: null,
                    ALUnitId2: null
                })
            }
        }

        $scope.CalculateTotalAndSubTotal();

    }
    $scope.delRowFromSourceItemDetails = function (ind) {
        if ($scope.beData.SourceItemDetailsColl) {
            if ($scope.beData.SourceItemDetailsColl.length > 1) {
                $scope.beData.SourceItemDetailsColl.splice(ind, 1);
            }
        }
        $scope.CalculateTotalAndSubTotal();
    }
      
    $scope.ShowSideBar = function (paraData) {
        $scope.sideBarData = paraData;

        if (paraData) {
            if (paraData.length > 0) {
                if (paraData[0].text == "Currency") {

                }
            }
        }

        //  Swal.fire('On Product Load');
        // $scope.loadingstatus = 'running';
    };

    $scope.CurItemAllocation = null;
    $scope.ProductSelectionChange = function (itemDet, ind) {
        $scope.sideBarData = itemDet.sideBarData;

        $scope.sideBarData = itemDet.sideBarData;
        $scope.CurItemAllocation = itemDet;
        var isModify = $scope.beData.TranId > 0 ? true : false;

        if (itemDet.ProductId > 0 && (itemDet.productDetail == null || itemDet.productDetail === undefined)) {

            $scope.loadingstatus = 'running';
            showPleaseWait();
            $http({
                method: 'GET',
                url: base_url + "Global/GetProductDetail?ProductId=" + itemDet.ProductId + " & VoucherType=" + $scope.SelectedVoucher.VoucherType + "&VoucherId=" + $scope.SelectedVoucher.VoucherId,
                dataType: "json"
            }).then(function (resLD) {

                $scope.loadingstatus = 'stop';
                hidePleaseWait();
                if (resLD.data.IsSuccess && resLD.data.Data) {
                    itemDet.productDetail = resLD.data.Data;
                    $scope.ProductSelectionChange(itemDet, ind);
                }
            }, function (reason) {
                alert('Failed' + reason);
            });

        }


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
            $scope.ChangeItemRowValue(itemDet, 'product');
        } else if (itemDet.productDetail) {
            itemDet.CanEditRate = itemDet.productDetail.CanEditRate;
             
            
            var refStockItem = false;
            if (itemDet.DeliveryNoteItemAllocationId > 0 || itemDet.OrderItemAllocationId > 0 || itemDet.DispatchSectionItemAllocationId > 0
                || itemDet.ReceivedNoteItemAllocationId > 0 || itemDet.ItemAllocationId > 0 || itemDet.DispatchSectionItemAllocationId > 0 || itemDet.ReceivedNoteItemAllocationId > 0 || itemDet.QuotationItemAllocationId > 0) {
                refStockItem = true;
            }

            if (refStockItem == false && itemDet.IsRefItem == true) {
                refStockItem = true;
            }
             
            if ((isModify == false || isEmptyNum(itemDet.ItemAllocationId) == 0) && refStockItem == false ) {
                itemDet.PurchaseRate = itemDet.productDetail.PurchaseRate;
                itemDet.SalesRate = itemDet.productDetail.SalesRate;
                itemDet.Rate = itemDet.productDetail.SalesRate;
                itemDet.ProductLedgerId = itemDet.productDetail.ExpensesLedgerId;
                itemDet.LedgerId = itemDet.productDetail.ExpensesLedgerId;
            } else {

                if (!itemDet.ProductLedgerId || itemDet.ProductLedgerId == 0)
                    itemDet.ProductLedgerId = itemDet.productDetail.ExpensesLedgerId;

                if (!itemDet.LedgerId || itemDet.LedgerId == 0)
                    itemDet.LedgerId = itemDet.productDetail.ExpensesLedgerId;
            }

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


            var clQty = ($filter('number')(itemDet.productDetail.ClosingQty, itemDet.QtyDecimal)).parseDBL();
            itemDet.productDetail.ClosingQty = clQty;
            itemDet.ClosingQty = clQty + ' ' + itemDet.productDetail.BaseUnit;
            itemDet.BalanceQty = itemDet.productDetail.ClosingQty;

            itemDet.UnitId = itemDet.productDetail.BaseUnitId;
            itemDet.UnitName = itemDet.productDetail.BaseUnit; 
            //itemDet.ActualQty = 0;
            //itemDet.BilledQty = 0;
            //itemDet.DiscountAmt = 0;
            //itemDet.DiscountPer = 0;

            if (itemDet.productDetail.IsFixedProduct == true) {
                if (!itemDet.FixedProductColl || itemDet.FixedProductColl.length == 0 || !itemDet.productDetail.FixedProductColl) {
                    $http({
                        method: 'GET',
                        url: base_url + "Inventory/Transaction/getDueFixedProductList?productId=" + itemDet.productDetail.ProductId,
                        dataType: "json"
                    }).then(function (res) {
                        if (res.data.IsSuccess && res.data.Data) {
                            itemDet.productDetail.FixedProductColl = res.data.Data;
                            itemDet.FixedProductColl = res.data.Data;
 
                            if (isModify || itemDet.RefQty > 0) {
                                itemDet.productDetail.FixedProductColl.push({
                                    EngineNo: itemDet.EngineNo,
                                    ChassissNo: itemDet.ChassissNo,
                                    RegdNo: itemDet.RegdNo,
                                    Model: itemDet.Model,
                                    Type: itemDet.Type,
                                    Color: itemDet.Color,
                                    KeyNo: itemDet.KeyNo,
                                    CodeNo: itemDet.CodeNo,
                                    MFGYear: itemDet.MFGYear,
                                    IsSelected: true,
                                });
                            }

                            angular.forEach(itemDet.FixedProductColl, function (fp) {
                                fp.Amount = itemDet.Rate;
                            });

                             
                        }
                    }, function (reason) {
                        Swal.fire('Failed' + reason);
                    });
                }  
            }

            $scope.ChangeItemRowValue(itemDet, 'product');


            $timeout(function () {
                if ($scope.SelectedVoucher.Product.BatchNo == true) {

                    if (itemDet.ModifyDetailsColl && itemDet.ModifyDetailsColl.length > 0 && (!itemDet.SelectedBatchColl || itemDet.SelectedBatchColl.length == 0)) {
                        itemDet.SelectedBatchColl = [];
                        itemDet.ModifyDetailsColl.forEach(function (idet) {
                            var findB = mx(itemDet.productDetail.BatchWiseColl).firstOrDefault(p1 => p1.BatchNo == idet.Batch && p1.EngineNo == idet.EngineNo);
                            if (findB) {
                                findB.BalQty = findB ? findB.BalQty + idet.ActualQty : idet.ActualQty;
                                findB.SalesQty = idet.ActualQty;
                                findB.IsSelected = true;
                                itemDet.SelectedBatchColl.push(findB);
                            } else {
                                var newBatch = {
                                    BSNo: idet.SNo,
                                    Batch: idet.Batch,
                                    BatchNo: idet.Batch,
                                    EXPDate: idet.EXPDate,
                                    MFGDate: idet.MFGDate,
                                    BatchBalQty: idet.ActualQty,
                                    EngineNo: idet.EngineNo,
                                    SalesRate: idet.SalesRate,
                                    TradeRate: idet.TradeRate,
                                    MRP: idet.MRP,
                                    BalQty: findB ? findB.BalQty + idet.ActualQty : idet.ActualQty,
                                    SalesQty: idet.ActualQty,
                                    IsSelected: true
                                };
                                itemDet.SelectedBatchColl.push(newBatch);

                                itemDet.productDetail.BatchWiseColl.push(newBatch);
                            }

                        });
                    }
                    else if (itemDet.Batch && itemDet.Batch.length > 0) {
                        var findB = mx(itemDet.productDetail.BatchWiseColl).firstOrDefault(p1 => p1.BatchNo == itemDet.Batch && p1.EngineNo == itemDet.EngineNo);
                        if (findB) {
                            if (refStockItem == false && isModify == true) {
                                findB.BalQty = findB.BalQty + itemDet.ActualQty;
                            }
                        } else {
                            var newBatch = {
                                BSNo: itemDet.SNo,
                                Batch: itemDet.Batch,
                                BatchNo: itemDet.Batch,
                                EXPDate: itemDet.EXPDate,
                                MFGDate: itemDet.MFGDate,
                                BatchBalQty: itemDet.ActualQty,
                                EngineNo: itemDet.EngineNo,
                                SalesRate: itemDet.SalesRate,
                                TradeRate: itemDet.TradeRate,
                                MRP: itemDet.MRP,
                            };
                            itemDet.productDetail.BatchWiseColl.push(newBatch);
                        }
                    }

                    if (itemDet.productDetail.MultipleBatch == true && itemDet.productDetail.MaintainBatchWise == true) {
                        if (itemDet.productDetail.Init != true) {
                            $('#mdlMultipleBatch').modal('show');
                        }

                    }
                    else {
                        if (itemDet.productDetail.BatchWiseColl && itemDet.productDetail.BatchWiseColl.length > 0) {

                            if (isModify == true || refStockItem == true) {
                                var findB = mx(itemDet.productDetail.BatchWiseColl).firstOrDefault(p1 => p1.BatchNo == itemDet.Batch && p1.EngineNo == itemDet.EngineNo);
                                if (findB) {
                                    itemDet.SelectedBatch = findB;
                                    $scope.ChangeBatch(itemDet, findB, (itemDet.SNo - 1));
                                }


                            } else {

                                if (itemDet.CanEditRow == false) {
                                    if (!itemDet.SelectedBatch) {
                                        var findB = mx(itemDet.productDetail.BatchWiseColl).firstOrDefault(p1 => p1.BatchNo == itemDet.Batch && p1.EngineNo == itemDet.EngineNo);
                                        if (findB) {
                                            itemDet.SelectedBatch = findB;
                                            $scope.ChangeBatch(itemDet, findB, (itemDet.SNo - 1));
                                        }
                                        else {
                                            $scope.ChangeBatch(itemDet, itemDet.productDetail.BatchWiseColl[0], 0);
                                        }
                                    } else {
                                        $scope.ChangeBatch(itemDet, itemDet.productDetail.BatchWiseColl[0], 0);
                                    }
                                } else {
                                    $scope.ChangeBatch(itemDet, itemDet.productDetail.BatchWiseColl[0], 0);
                                }

                            }

                        }
                    }

                }
            });

            var itemC = mx($scope.beData.SourceItemDetailsColl).count();
            if (ind == (itemC - 1))
                $scope.AddRowInSourceItemDetails(ind);

        }

    }
    $scope.getBatchStyle = function (item) {
        if (item.IsExpired == true) {
            return { 'background-color': 'red', 'color': 'white' };
        }
        return {};
    };
    $scope.ChangeBatch = function (itemDet, batDet, ind) {
        if (itemDet && batDet) {
            itemDet.BSNo = batDet.BSNo;
            itemDet.Batch = batDet.BatchNo;
            itemDet.EXPDate = batDet.EXPDate;
            itemDet.MFGDate = batDet.MFGDate;
            itemDet.BatchBalQty = batDet.BalQty;
            itemDet.EngineNo = batDet.EngineNo;

            itemDet.SalesRate = batDet.SalesRate;
            itemDet.TradeRate = batDet.TradeRate;
            itemDet.MRP = batDet.MRP;

            itemDet.IsExpired = batDet.IsExpired;

            if (batDet.SalesRate > 0) {
                if ($scope.beData.TranId > 0) {

                }
                else
                    itemDet.Rate = batDet.SalesRate;
            }


            if (batDet.Attributes && batDet.Attributes.length > 0) {
                var uValColl = JSON.parse(batDet.Attributes);
                angular.forEach(itemDet.UDFFeildsColl, function (iuc) {
                    var uVal = uValColl[iuc.NameId];
                    iuc.UDFValue = (uVal ? uVal : iuc.UDFValue);
                });
            }

            if (itemDet.ItemAllocationId > 0) {

            } else {
                $timeout(function () {
                    var cboName = 'cboBatch' + ind;
                    $('#' + cboName).select2({
                        allowClear: true,
                        openOnEnter: true,
                        placeholder: '*select batch*',
                        width: '100%',
                    });
                }, 100);
            }

            $scope.ChangeItemRowValue(itemDet, 'aQty');


        } else {
            itemDet.EXPDate = null;
            itemDet.MFGDate = null;
            itemDet.BatchBalQty = 0;
            itemDet.EngineNo = '';
            itemDet.BSNo = 0;

            itemDet.SalesRate = 0;
            itemDet.TradeRate = 0;
            itemDet.MRP = 0;
            itemDet.IsExpired = null;
        }

        $scope.RecalculateAdditioncalCost();
        $scope.CalculateTotalAndSubTotal();
    }

    $scope.lastPartyLedgerId = null;
    $scope.PartySelectionChange = function (partyDet) {

        $scope.sideBarData = partyDet.partySideBarData;

        if (partyDet.PartyLedgerId && partyDet.PartyLedgerId > 0) {
            if (partyDet.PartyLedger) {

                $scope.lastPartyLedgerId = partyDet.PartyLedgerId;

                $scope.beData.PartyLedgerName = partyDet.PartyLedger.Name;
                $scope.beData.Address = partyDet.PartyLedger.Address;
                $scope.beData.SalesTaxNo = partyDet.PartyLedger.SalesTaxNo;
            }

            if ($scope.SelectedVoucher.ActivePartyDetails == true) {
                $scope.RefVoucherChange($scope.beData.RefVoucherType);
            }
            //$('#frmSalesQuotationDetailsModel').modal('show');
        } else {

            $scope.search = "";
            $scope.RefVoucherNoColl = [];
            //$('#cboRefVoucherNo').val(null).trigger('change');
            //var arr = [];
            //$('#cboRefVoucherNo').val(arr).trigger('change');

            $scope.RefItemAllocationColl = [];
            partyDet.SalesQuotationDetail = {};
            partyDet.SourceItemDetailsColl = [];
            $scope.AddBlankRow();
            //$scope.AddRowInItemDetails(0);
            
           // $('#frmSalesQuotationDetailsModel').modal('hide');
        }



    };

    $scope.IsRefPartyDet = false;
    $scope.getRefVoucherPartyDetails = function (refItem) {

        if ($scope.beData.RefVoucherType && refItem && refItem.IsSelected == true) {

            $scope.RefAditionalCostColl = [];

            //$scope.RefVoucherTypeColl = [{ id: 2, text: 'SalesOrder' }, { id: 1, text: 'DeliveryNote' }, { id: 3, text: 'SalesQuotation' },];
            var vType = 12;
             
            var para = {
                TranId: refItem.TranId,
                voucherTypes: vType
            };

            $http({
                method: 'POST',
                url: base_url + "Inventory/Transaction/GetADForRefTran",
                dataType: "json",
                data: JSON.stringify(para)
            }).then(function (res1) {
                if (res1.data.IsSuccess && res1.data.Data) {
                    var tranData = res1.data.Data;
                    var tranDet = tranData.SalesInvoiceDetail;

                    $timeout(function () {

                        $scope.IsRefPartyDet = true;

                        $scope.beData.PartyCostCenter = tranData.PartyCostCenter;
                        $scope.beData.TranCostCenter = tranData.TranCostCenter;
                        $scope.beData.AgentId = tranData.AgentId;

                        $scope.beData.TermsOfPayment = tranDet.TermsOfPayment;
                        $scope.beData.OtherRefereces = tranDet.OtherRefereces;
                        $scope.beData.TermsOfDelivery = tranDet.TermsOfDelivery;
                        $scope.beData.DeliveryThrough = tranDet.DeliveryThrough;
                        $scope.beData.DeliveryDocNo = tranDet.DeliveryDocNo;
                        $scope.beData.Destination = tranDet.Destination;
                        $scope.beData.SalesQuotationTermsOfPayment = tranDet.SalesQuotationTermsOfPayment;
                        $scope.beData.SalesQuotationOtherRefereces = tranDet.SalesQuotationOtherRefereces;
                        $scope.beData.SalesQuotationTermsOfDelivery = tranDet.SalesQuotationTermsOfDelivery;
                        $scope.beData.Buyes = tranDet.Buyes;
                        $scope.beData.Address = tranDet.Address;
                        $scope.beData.SalesTaxNo = tranDet.SalesTaxNo;
                        $scope.beData.CSTNumber = tranDet.CSTNumber;
                        $scope.beData.Notes = tranDet.Notes;
                        $scope.beData.PhoneNo = tranDet.PhoneNo;
                        $scope.beData.Description = tranDet.Description;
                        $scope.beData.OwnerName = tranDet.OwnerName;
                        $scope.beData.OwnerContactNo = tranDet.OwnerContactNo;
                        $scope.beData.DriverAddress = tranDet.DriverAddress;
                        $scope.beData.DriverName = tranDet.DriverName;
                        $scope.beData.DriverContactNo = tranDet.DriverContactNo;
                        $scope.beData.LicenseNo = tranDet.LicenseNo;
                        $scope.beData.VehicleNo = tranDet.Goods;
                        $scope.beData.Quantity = tranDet.Quantity;
                        $scope.beData.FreightRate = tranDet.FreightRate;
                        $scope.beData.AdvancePayment = tranDet.AdvancePayment;
                        $scope.beData.TotalWT = tranDet.TotalWT;
                        $scope.beData.ContactNo = tranDet.ContactNo;
                        $scope.beData.RegdNo = tranDet.RegdNo;
                        $scope.beData.EngineNo = tranDet.EngineNo;
                        $scope.beData.ChassisNo = tranDet.ChassisNo;
                        $scope.beData.Model = tranDet.Model;
                        $scope.beData.VinNo = tranDet.VinNo;

                        if (tranDet.CreditDays > 0)
                            $scope.beData.CreditDays = tranDet.CreditDays;

                        $scope.beData.ExportCountry = tranDet.ExportCountry;
                        $scope.beData.PPNo = tranDet.PPNo;
                        $scope.beData.PPDate = tranDet.PPDate;
                        $scope.beData.OtherRefereces1 = tranDet.OtherRefereces1;
                        $scope.beData.PaymentTermsId = tranDet.PaymentTermsId;
                        $scope.beData.FreightTypeId = tranDet.FreightTypeId;
                        $scope.beData.Narration = tranData.Narration;
                        $scope.beData.No = tranData.RefNo;
                        $scope.beData.RefNo = tranData.RefNo;

                        $scope.beData.BillToId = tranDet.BillToId;
                        $scope.beData.ShipToId = tranDet.ShipToId;
                        $scope.beData.BillToAddress = tranDet.BillToAddress;
                        $scope.beData.ShipToAddress = tranDet.ShipToAddress;

                        $scope.RefAditionalCostColl = tranData.AditionalCostColl;

                    });


                }
            }, function (reason) {
                Swal.fire('Failed' + reason);
            });

        }


    };

    $scope.LoadRefProduct = function () {

        var filterData = [];

        $scope.beData.RefAllotationIdColl = [];
        var filterData = [];
        angular.forEach($scope.RefItemAllocationColl, function (node) {
            if (node.IsSelected == true) {
                $scope.beData.RefAllotationIdColl.push(node.ItemAllocationId);
                filterData.push(node);
            }
        });


        var refVType = $scope.beData.RefVoucherType;

        if (filterData.length > 0) {
            $scope.beData.SourceItemDetailsColl = [];
            var tmpItemAllocationColl = [];
            angular.forEach(filterData, function (fd) {
                var refItem = {
                    RowType: 'P',
                    ProductId: fd.ProductId,
                    productDetail: null,
                    ActualQty: fd.ActualQty,
                    BilledQty: fd.BilledQty,
                    FreeQty: (fd.ActualQty - fd.BilledQty),
                    Rate: fd.Rate,
                    DiscountPer: fd.DiscountPer,
                    DiscountAmt: 0,
                    SchameAmt: 0,
                    SchamePer: 0,
                    Amount: fd.Amount,
                    Description: fd.Description,
                    QtyPoint: 0,
                    UnitId: fd.UnitId,
                    CanEditRate: false,
                    ALValue1: fd.AUQty1,
                    ALValue2: fd.AUQty2,
                    ALUnitId1: fd.AUId1,
                    ALUnitId2: fd.AUId2,
                    SchemeAmt: 0,
                    SchemeRate: 0,
                    ExciseAbleQty: 0,
                    ExciseAbtAmt: 0,
                    VatAbleAmt: 0,
                    VatRate: 0,
                    VatAmount: 0,
                    ExDutyRate: 0,
                    ExDutyAmount: 0,
                    QtyDecimal: 2,
                    RateDecimal: 2,
                    AmountDecimal: 2,
                    GodownId: (fd.GodownId && fd.GodownId > 0 ? fd.GodownId : $scope.beData.GodownId),
                    Narration: fd.Narration,
                    RefQty: fd.ActualQty,
                    DeliveryNoteItemAllocationId: refVType == 1 ? fd.ItemAllocationId : null,
                    OrderItemAllocationId: refVType == 2 ? fd.ItemAllocationId : null,
                    RefVType: refVType
                };
                tmpItemAllocationColl.push(refItem);
            });

            $timeout(function () {

                $scope.loadingstatus = 'running';
                showPleaseWait();

                var newSales = {
                    ItemAllocationColl: tmpItemAllocationColl
                };

                var fnName = 'GetDeliveryNoteDetailsByItemAllocationId';
                 

                //refVType == 2 ? 'GetSalesOrderDetailsByItemAllocationId' : 'GetDeliveryNoteDetailsByItemAllocationId';
                $http({
                    method: 'POST',
                    url: base_url + "Inventory/Transaction/" + fnName,
                    dataType: "json",
                    data: JSON.stringify(newSales)
                }).then(function (res1) {

                    $scope.loadingstatus = 'stop';
                    hidePleaseWait();

                    if (res1.data.IsSuccess == true) {

                        angular.forEach(res1.data.Data.ItemAllocationColl, function (ias) {
                            ias.RowType = 'P';
                            ias.Narration = ias.Narration;
                            ias.RefQty = ias.ActualQty;
                            ias.ReadOnlyQty = $scope.SelectedVoucher.Product.RefQtyAs == 2 ? true : false;

                            if (ias.ItemDetailsColl && ias.ItemDetailsColl.length > 0) {
                                angular.forEach(ias.ItemDetailsColl, function (iad) {
                                    iad.DeliveryNoteItemAllocationId = ias.DeliveryNoteItemAllocationId;
                                    iad.OrderItemAllocationId = ias.OrderItemAllocationId;
                                    iad.RowType = 'P';
                                    iad.Narration = ias.Narration;
                                    iad.ReadOnlyQty = $scope.SelectedVoucher.Product.RefQtyAs == 2 ? true : false;
                                    iad.ProductLedgerId = ias.LedgerId;
                                    iad.LedgerId = ias.LedgerId;
                                    $scope.beData.SourceItemDetailsColl.push(iad);
                                });
                            } else
                                $scope.beData.SourceItemDetailsColl.push(ias);

                            
                        });
  
                        $scope.CalculateTotalAndSubTotal();
                    }


                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });

            });
        }

        $('#frmSalesQuotationDetailsModel').modal('hide');
    };
    $scope.RefVoucherChange = function (refVType) {

        $scope.CheckedAll = false;
        $scope.RefAditionalCostColl = [];

        $scope.RefVoucherNoColl = [];
        $scope.RefItemAllocationColl = [];

        var funName = "getPendingDeliveryNote";
 

        var agentId = 0;
        if ($scope.beData.AgentId)
            agentId = $scope.beData.AgentId;

        var vDate = null;

        if ($scope.beData.VoucherDateDet) {
            vDate = $filter('date')(new Date($scope.beData.VoucherDateDet.dateAD), 'yyyy-MM-dd');
        } else
            vDate = $filter('date')(new Date(), 'yyyy-MM-dd');

        var para = "ledgerId=" + $scope.beData.PartyLedgerId + "&agentId=" + agentId + "&voucherDate=" + vDate + "&orderTranId=0";
        $http({
            method: 'GET',
            url: base_url + "Inventory/Transaction/" + funName + "?" + para,
            dataType: "json"
        }).then(function (res1) {
            if (res1.data.IsSuccess && res1.data.Data) {
                $scope.RefItemAllocationColl = res1.data.Data;

                var refTranIdColl = mx($scope.beData.RefTranIdColl);
                var refAllocationIdCol = mx($scope.beData.RefAllotationIdColl);

                angular.forEach($scope.RefItemAllocationColl, function (ri) {
                    if (refTranIdColl.contains(ri.TranId)) {
                        ri.IsSelected = true;
                    } else {

                        ri.IsSelected = false;

                        if (refAllocationIdCol.contains(ri.ItemAllocationId)) {
                            ri.IsSelected = true;
                        } else
                            ri.IsSelected = false;
                    }

                });

                var grp = mx($scope.RefItemAllocationColl)
                    .groupBy(t => ({ id: t.TranId, text: t.AutoManualNo }))   // group `key`
                    .select(t => t.key)
                    .toArray();

                angular.forEach(grp, function (v) {
                    $scope.RefVoucherNoColl.push({
                        id: v.id,
                        text: v.text.toString().trim()
                    });
                });

                $('#frmSalesQuotationDetailsModel').modal('show');

            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

    };

    $scope.CheckedAllRefItem = function () {
        angular.forEach($scope.RefItemAllocationColl, function (ri) {
            ri.IsSelected = $scope.beData.CheckedAll;
        });
    }
     

    $scope.ChangeItemRowValue = function (itemDet, col) {

        var amt = 0, qty = 0, rate = 0, disAmt = 0, disPer = 0, schAmt = 0, schPer = 0;

        var aQty = 0;

        var rateOf = 1;
        if (itemDet.productDetail) {
            rateOf = itemDet.productDetail ? itemDet.productDetail.RateOf : 1;
            if (rateOf == 0)
                rateOf = 1;
        }

        var nw = 0, lw = 0, mk = 0, st = 0;
        if ($scope.comDet.Maintain == 2) {

            if (itemDet.productDetail) {
                if (col == "netWeight") {
                    if (itemDet.NetWeight && itemDet.NetWeight > 0)
                        itemDet.LossWeight = itemDet.NetWeight * itemDet.LossRate / 100;
                }
                else if (col == "lossRate") {
                    if (itemDet.NetWeight && itemDet.NetWeight > 0)
                        itemDet.LossWeight = itemDet.NetWeight * itemDet.LossRate / 100;
                }
                else if (col == "fineRate") {
                    if (itemDet.NetWeight && itemDet.NetWeight > 0)
                        itemDet.FineWeight = itemDet.NetWeight * itemDet.FineRate / 100;
                }
                else if (col == "processingRate") {
                    if (itemDet.NetWeight && itemDet.NetWeight > 0)
                        itemDet.ProcessingWeight = itemDet.NetWeight * itemDet.ProcessingRate / 100;
                }
            }

            if ($scope.SelectedVoucher.Jewellery.Loss == true)
                itemDet.ActualQty = itemDet.NetWeight + itemDet.LossWeight;
            else
                itemDet.ActualQty = itemDet.FineWeight + itemDet.ProcessingWeight;
        }

        if (col == 'aQty') {
            itemDet.BilledQty = itemDet.ActualQty;


        } else if (col == 'bQty') {
            if (itemDet.ActualQty == 0 || itemDet.ActualQty < itemDet.BilledQty)
                itemDet.ActualQty = itemDet.BilledQty;
        }

        if (itemDet.productDetail) {
            if (itemDet.Batch && itemDet.Batch.length > 0) {
                var bBal = (itemDet.BatchBalQty || itemDet.BatchBalQty > 0 ? itemDet.BatchBalQty : 0) + (itemDet.RefQty > 0 ? itemDet.RefQty : 0);

                if (itemDet.QtyDecimal == undefined || itemDet.QtyDecimal == null)
                    itemDet.QtyDecimal = 2;

                bBal = ($filter('number')(bBal, itemDet.QtyDecimal)).parseDBL();

                var outQty = mx($scope.beData.ItemDetailsColl).where(p1 => p1.ProductId == itemDet.ProductId && p1.Batch == itemDet.Batch && p1.EngineNo == itemDet.EngineNo).sum(p1 => p1.ActualQty);

                if (isEmptyNum(outQty) == 0)
                    outQty = itemDet.ActualQty;

                if (outQty > bBal) {

                    if (itemDet.productDetail.IgnoreNegativeBalance == false) {
                        itemDet.ActualQty = 0;
                        itemDet.BilledQty = 0;
                        Swal.fire('Please ! Enter Qty Less Then Equal ' + bBal);
                    }
                } else {
                    bBal = (itemDet.productDetail.ClosingQty + (itemDet.RefQty > 0 ? itemDet.RefQty : 0));
                    bBal = ($filter('number')(bBal, itemDet.QtyDecimal)).parseDBL();
                    outQty = mx($scope.beData.ItemDetailsColl).where(p1 => p1.ProductId == itemDet.ProductId).sum(p1 => p1.ActualQty);

                    if (bBal < outQty) {

                        if (itemDet.productDetail.IgnoreNegativeBalance == false) {
                            itemDet.ActualQty = 0;
                            itemDet.BilledQty = 0;
                            Swal.fire('Please ! Enter Qty Less Then Equal ' + itemDet.productDetail.ClosingQty);
                        }
                    }
                }
            }
            else {
                //if ((itemDet.productDetail.ClosingQty + (itemDet.RefQty > 0 ? itemDet.RefQty : 0)) < itemDet.ActualQty) {
                var bBal = (itemDet.productDetail.ClosingQty + (itemDet.RefQty > 0 ? itemDet.RefQty : 0));
                if (itemDet.QtyDecimal == undefined || itemDet.QtyDecimal == null)
                    itemDet.QtyDecimal = 2;

                bBal = ($filter('number')(bBal, itemDet.QtyDecimal)).parseDBL();
                var outQty = mx($scope.beData.SourceItemDetailsColl).where(p1 => p1.ProductId == itemDet.ProductId).sum(p1 => p1.ActualQty);

                if (bBal < outQty) {

                    if (itemDet.productDetail.IgnoreNegativeBalance == false) {
                        itemDet.ActualQty = 0;
                        itemDet.BilledQty = 0;
                        Swal.fire('Please ! Enter Qty Less Then Equal ' + itemDet.productDetail.ClosingQty);
                    }

                }
            }
        }

        if (itemDet.ActualQty)
            aQty = itemDet.ActualQty;

        if ($scope.HideShow.BilledQty == true) {
            if (itemDet.ActualQty)
                qty = itemDet.ActualQty;
        } else {
            if (itemDet.BilledQty)
                qty = itemDet.BilledQty;
        }


        if (isEmptyObj(itemDet.Rate) == false)
            rate = itemDet.Rate;

        rate = ($filter('number')(rate / rateOf, itemDet.RateDecimal)).parseDBL();


        if (itemDet.productDetail) {
            if (itemDet.productDetail.ClosingQty < qty)
                itemDet.IsNegativeQty = true;
            else if (itemDet.RefQty && itemDet.RefQty < qty)
                itemDet.IsNegativeQty = true;
            else
                itemDet.IsNegativeQty = false;
        }

        if (itemDet.Amount && col == "amt" && itemDet.Amount > 0) {
            if ($scope.SelectedVoucher.Product.ChangeAmtReflectToRateQty == 2) {
                rate = itemDet.Amount / itemDet.BilledQty;
                itemDet.Rate = rate;
            } else {
                itemDet.BilledQty = itemDet.Amount / itemDet.Rate;
                itemDet.ActualQty = itemDet.BilledQty;

                qty = itemDet.ActualQty;
            }
            amt = itemDet.Amount;
        } else
            amt = qty * rate;

        if (itemDet.DiscountAmt)
            disAmt = itemDet.DiscountAmt;

        if (itemDet.DiscountPer)
            disPer = itemDet.DiscountPer;

        if (col == "disAmt") {

            if (disAmt > 0) {
                disPer = (disAmt / amt) * 100;
            } else
                disPer = 0;

        }
        else if (col == "disPer" || col == "product") {

            if (disPer > 0) {
                disAmt = amt * disPer / 100;
            } else
                disAmt = 0;
        } else if (disPer > 0) {
            disAmt = amt * disPer / 100;
        } else if (disAmt > 0) {
            disPer = (disAmt / amt) * 100;
        }



        itemDet.Amount = ($filter('number')((amt - disAmt), itemDet.AmountDecimal)).parseDBL();

        if (col == "disAmt")
            itemDet.DiscountPer = disPer;
        else if (col == "disPer" || col == "product")
            itemDet.DiscountAmt = disAmt;
        else {
            itemDet.DiscountPer = disPer;
            itemDet.DiscountAmt = disAmt;
        }

        itemDet.TotalAmount = itemDet.Amount + itemDet.Makeing + itemDet.Stone;

        if ($scope.HideShow.BilledQty == true) {
            itemDet.BilledQty = aQty;
        }

        if (itemDet.productDetail) {
            if (itemDet.productDetail.AlternetUnitColl) {
                if (col == 'aQty' || col == 'bQty' || col == 'product') {
                    var alterUnit_Qry = mx(itemDet.productDetail.AlternetUnitColl);

                    var alternetUnit1 = null, alternetUnit2 = null;

                    if (itemDet.productDetail.AlternetUnitColl.length > 0) {

                        alternetUnit1 = alterUnit_Qry.firstOrDefault(p1 => p1.SNo == 1);
                        if (alternetUnit1) {
                            itemDet.ALValue1 = parseFloat(parseFloat((alternetUnit1.AlternetUnitValue * aQty) / alternetUnit1.BaseUnitValue).toFixed(alternetUnit1.NoOfDecimalPlaces));
                            itemDet.ALUnitId1 = alternetUnit1.UnitId;
                            itemDet.UnitName1 = alternetUnit1.UnitName;
                        }
                    }

                    if (itemDet.productDetail.AlternetUnitColl.length > 1) {
                        alternetUnit2 = alterUnit_Qry.firstOrDefault(p1 => p1.SNo == 2);
                        if (alternetUnit2) {
                            itemDet.ALValue2 = parseFloat(parseFloat((alternetUnit2.AlternetUnitValue * aQty) / alternetUnit2.BaseUnitValue).toFixed(alternetUnit2.NoOfDecimalPlaces));
                            itemDet.ALUnitId2 = alternetUnit2.UnitId;
                            itemDet.UnitName2 = alternetUnit2.UnitName;
                        }
                    }
                }
            }

            var exciseAbleQty = 0;
            var excisAbleAmt = itemDet.ActualQty * itemDet.Rate;

            if (itemDet.ExDutyUnitId && itemDet.ExDutyUnitId > 0) {
                if (itemDet.UnitId == itemDet.ExDutyUnitId)
                    exciseAbleQty = itemDet.ActualQty;
                else if (itemDet.ALUnitId1 && itemDet.ALUnitId1 == itemDet.ExDutyUnitId)
                    exciseAbleQty = itemDet.ALValue1;
                else if (itemDet.ALUnitId2 && itemDet.ALUnitId2 == itemDet.ExDutyUnitId)
                    exciseAbleQty = itemDet.ALValue1;
            }
            else
                exciseAbleQty += itemDet.ActualQty;

            itemDet.ExciseAbleQty = exciseAbleQty;
            itemDet.ExciseAbtAmt = excisAbleAmt;
            itemDet.VatAbleAmt = 0;

            if (itemDet.productDetail.IsTaxable == true) {
                itemDet.VatAbleAmt = itemDet.Amount;
                itemDet.TaxableAmt = itemDet.Amount;

                if ($scope.SelectedVoucher.Product.ProductWiseVat == false) {
                    itemDet.VatRate = 0;
                    itemDet.VatAmount = 0;
                }
                else if ($scope.SelectedVoucher.Product.ProductWiseVat == true) {
                    itemDet.VatRate = itemDet.productDetail.VatRate;
                    itemDet.VatAmount = itemDet.Amount * itemDet.productDetail.VatRate / 100;
                }
            }

            if ($scope.SelectedVoucher.Product.ProductWiseExciseDuty == false) {
                itemDet.ExDutyRate = 0;
                itemDet.ExDutyAmount = 0;
            }
            else if ($scope.SelectedVoucher.Product.ProductWiseVat == true) {
                itemDet.ExDutyRate = itemDet.productDetail.EXDutyRate;
                itemDet.ExDutyAmount = exciseAbleQty * itemDet.productDetail.EXDutyRate / 100;
            }

        }

        itemDet.TotalAmount = itemDet.Amount + itemDet.Makeing + itemDet.Stone;
         
        $scope.CalculateTotalAndSubTotal();
    }


    $scope.CalculateTotalAndSubTotal = function () {

        if ($scope.SelectedVoucher) {
            var subTotal = 0;
            var totalQty = 0;
            angular.forEach($scope.beData.SourceItemDetailsColl, function (item) {
                subTotal += item.Amount ? item.Amount : 0;
                totalQty += item.ActualQty ? item.ActualQty : 0;
            });

            $scope.beData.SubTotal = ($filter('number')(subTotal, $scope.SelectedVoucher.NoOfDecimalPlaces)).parseDBL();
            $scope.beData.TotalAmount = ($filter('number')(subTotal, $scope.SelectedVoucher.NoOfDecimalPlaces)).parseDBL();
        }

    };

    $scope.SaveConsumption = function () {

        if ($scope.IsValidData() == true) {

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

                    var filesColl = $scope.beData.AttechFiles;
                    $scope.beData.AttechFiles = [];
                     

                    $http({
                        method: 'POST',
                        url: base_url + "Inventory/Transaction/SaveUpdateConsumption",
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
                        data: { jsonData: $scope.GetData(), files: filesColl }
                    }).then(function (res) {

                        $scope.loadingstatus = "stop";
                        hidePleaseWait();

                        Swal.fire(res.data.ResponseMSG);

                        if (res.data.IsSuccess == true) {
                            $scope.lastTranId = res.data.Data.RId;
                            $scope.lastVoucherId = $scope.SelectedVoucher.VoucherId;


                            $scope.ClearData();
                        }

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

    $scope.GetData = function () {

        var vDate = new Date();
        if ($scope.beData.VoucherDateDet) {
            vDate = $filter('date')(new Date($scope.beData.VoucherDateDet.dateAD), 'yyyy-MM-dd');
        }

        var eDate = new Date();
        if ($scope.beData.EntryDateDet) {
            eDate = $filter('date')(new Date($scope.beData.EntryDateDet.dateAD), 'yyyy-MM-dd');
        } else
            eDate = $filter('date')(new Date(), 'yyyy-MM-dd');

        var tmpSales = {
            TranId: $scope.beData.TranId,
            VoucherId: $scope.beData.VoucherId,
            CostClassId: $scope.beData.CostClassId,
            AutoVoucherNo: $scope.beData.AutoVoucherNo,
            CurRate: $scope.beData.CurRate,
            CurrencyId: $scope.beData.CurrencyId,
            ManualVoucherNO: $scope.beData.ManualVoucherNO,
            Narration: $scope.beData.Narration,
            VoucherDate: vDate,
            RefNo: $scope.beData.RefNo,
            AutoManualNo: $scope.beData.AutoManualNo,
            PartyLedgerId: ($scope.beData.PartyLedgerId ? $scope.beData.PartyLedgerId : 0),
            TotalAmount: $scope.beData.TotalAmount,
            AgentId: $scope.beData.AgentId ? $scope.beData.AgentId : 0,
            PartyCostCenter: $scope.beData.PartyCostCenter ? $scope.beData.PartyCostCenter : 0,
            TranCostCenter: $scope.beData.TranCostCenter ? $scope.beData.TranCostCenter : 0,
            EntryDate: eDate,
            BranchId: ($scope.beData.BranchId ? $scope.beData.BranchId : 0),
            ItemDetailsColl: [], 
            GodownId: $scope.beData.GodownId ? $scope.beData.GodownId : 0,
            SourceGodownId: $scope.beData.GodownId ? $scope.beData.GodownId : 0,
            ProductBrandId: ($scope.beData.ProductBrandId ? $scope.beData.ProductBrandId : 0),
            DocumentColl: $scope.beData.DocumentColl,
            PartyLedgerName: $scope.beData.PartyLedgerName,
            Address: $scope.beData.Address,
            SalesTaxNo: $scope.beData.SalesTaxNo,
            VehicleNo: $scope.beData.VehicleNo,
            EngineNo: $scope.beData.EngineNo,
            ChassisNo: $scope.beData.ChassisNo,
            VinNo: $scope.beData.VinNo,
            Model: $scope.beData.Model,
            ProjectId: $scope.beData.ProjectId,
        };

        angular.forEach($scope.beData.SourceItemDetailsColl, function (itemDet) {
            if (itemDet.ProductId && itemDet.ProductId > 0) {

                var udfValues = '';
                var udfFields = [];
                var itemKeyVal = {};
                angular.forEach(itemDet.UDFFeildsColl, function (udf) {

                    if (udf.NameId && udf.NameId.length > 0) {
                        var ud = {};
                        ud.SNo = (udf.FieldNo ? udf.FieldNo : udf.SNo);
                        ud.Name = udf.Name;
                        if (udf.FieldType == 2 || udf.FieldType == 22 || udf.FieldType == 23) {
                            ud.Value = udf.UDFValueDet ? $filter('date')(udf.UDFValueDet.dateAD, 'yyyy-MM-dd') : '';
                            ud.AlValue = udf.UDFValueDet ? udf.UDFValueDet.dateBS : '';
                            itemKeyVal[udf.NameId] = udf.UDFValueDet ? udf.UDFValueDet.dateBS : '';
                        }
                        else if (udf.FieldType == 3 && udf.Source && udf.Source.length > 0) {
                            ud.Value = udf.UDFValue;
                            ud.AlValue = udf.UDFValueDet ? udf.UDFValueDet.text : '';
                            itemKeyVal[udf.NameId] = udf.UDFValueDet ? udf.UDFValueDet.text : ''
                        }
                        else {
                            ud.Value = udf.UDFValue;
                            itemKeyVal[udf.NameId] = udf.UDFValue;
                        }

                        if (udf.IsManual == true)
                            ud.IsManual = true;

                        udfFields.push(ud);
                    }

                });
                if (udfFields.length > 0) {
                    udfValues = JSON.stringify(udfFields);
                    itemKeyVal = JSON.stringify(itemKeyVal);
                } else {
                    udfValues = "";
                    itemKeyVal = "";
                }

                var itemAllocation = {
                    UDFKeyVal: itemKeyVal,
                    Attributes: udfValues,
                    ProductId: itemDet.ProductId,
                    ActualQty: itemDet.ActualQty,
                    BilledQty: itemDet.BilledQty,
                    UnitId: itemDet.UnitId,
                    Rate: itemDet.Rate,
                    Amount: itemDet.Amount,
                    DiscountAmt: itemDet.DiscountAmt,
                    DiscountPer: itemDet.DiscountPer,
                    SchameAmt: itemDet.SchameAmt,
                    SchamePer: itemDet.SchamePer,
                    ALUnitId1: itemDet.ALUnitId1 ? itemDet.ALUnitId1 : 0,
                    ALUnitId2: itemDet.ALUnitId2 ? itemDet.ALUnitId2 : 0,
                    ALUnitId3: itemDet.ALUnitId3 ? itemDet.ALUnitId3 : 0,
                    ALValue1: itemDet.ALValue1 ? itemDet.ALValue1 : 0,
                    ALValue2: itemDet.ALValue2 ? itemDet.ALValue2 : 0,
                    ALValue3: itemDet.ALValue3 ? itemDet.ALValue3 : 0,
                    Narration: itemDet.Narration,
                    Batch: itemDet.Batch,
                    EXPDate: (itemDet.EXPDate && itemDet.EXPDateDet ? $filter('date')(new Date(itemDet.EXPDateDet), 'yyyy-MM-dd') : null),
                    MFGDate: (itemDet.MFGDate && itemDet.MFGDateDet ? $filter('date')(new Date(itemDet.MFGDateDet), 'yyyy-MM-dd') : null),
                    BundleId: 0,
                    BundleQty: 0,
                    RegdNo: itemDet.RegdNo ? itemDet.RegdNo : '',
                    EngineNo: itemDet.EngineNo ? itemDet.EngineNo : '',
                    ChassisNo: itemDet.ChassisNo ? itemDet.ChassisNo : '',
                    Model: itemDet.Model ? itemDet.Model : '',
                    CodeNo: itemDet.CodeNo ? itemDet.CodeNo : '',
                    Color: itemDet.Color ? itemDet.Color : '',
                    KeyNo: itemDet.KeyNo ? itemDet.KeyNo : '',
                    MFGYear: itemDet.MFGYear ? itemDet.MFGYear : 0,
                    Type: itemDet.Type ? itemDet.Type : '',
                    CostCenterId: itemDet.CostCenterId,
                    Description: itemDet.Description ? itemDet.Description : '',
                    LedgerId: itemDet.ProductLedgerId ? itemDet.ProductLedgerId : 0,
                    GodownId: (itemDet.GodownId && itemDet.GodownId > 0 ? itemDet.GodownId : (tmpSales.GodownId ? tmpSales.GodownId : 0)),
                    VatRate: itemDet.VatRate,
                    VatAmount: itemDet.VatAmount,
                    VatAbleAmt: itemDet.VatAbleAmt,
                    ExDutyRate: itemDet.ExDutyRate,
                    ExDutyAmount: itemDet.ExDutyAmount,
                    Description: itemDet.Description,
                    AbbRate: itemDet.Rate,
                    AbbAmount: itemDet.Amount,
                    IsTaxable: itemDet.productDetail.IsTaxable,
                    RateOf: (itemDet.RateOf ? itemDet.RateOf : 1),
                    NetWeight: (itemDet.NetWeight ? itemDet.NetWeight : 0),
                    LossWeight: (itemDet.LossWeight ? itemDet.LossWeight : 0),
                    Makeing: (itemDet.Makeing ? itemDet.Makeing : 0),
                    Stone: (itemDet.Stone ? itemDet.Stone : 0),
                    DeliveryNoteItemAllocationId: itemDet.DeliveryNoteItemAllocationId ? itemDet.DeliveryNoteItemAllocationId : 0,
                    OrderItemAllocationId: itemDet.OrderItemAllocationId ? itemDet.OrderItemAllocationId : 0,
                    DispatchSectionItemAllocationId: itemDet.DispatchSectionItemAllocationId ? itemDet.DispatchSectionItemAllocationId : 0,
                    ReceivedNoteItemAllocationId: itemDet.ReceivedNoteItemAllocationId ? itemDet.ReceivedNoteItemAllocationId : 0,
                    QuotationItemAllocationId: itemDet.QuotationItemAllocationId ? itemDet.QuotationItemAllocationId : 0,
                    DepartmentId: itemDet.DepartmentId,
                    RefQty:isEmptyAmt(itemDet.RefQty),
                };

                itemAllocation.SourceGodownId = itemAllocation.GodownId;
                tmpSales.SourceGodownId = itemAllocation.GodownId;

                if (itemAllocation.DepartmentId > 0) {
                    itemAllocation.DepartmentLedgerId = $scope.DepartmentQry.firstOrDefault(p1 => p1.CostCenterDepartmentId == itemAllocation.DepartmentId).LedgerId;
                }

                tmpSales.ItemDetailsColl.push(itemAllocation);
            }
        });
         
        return tmpSales;
    };

    $scope.SetData = function (tran) {

        $scope.loadingstatus = 'stop';
        hidePleaseWait();

        $scope.beData.VoucherDateDet = null;
        $scope.beData.VoucherDate = new Date(tran.VoucherDate);
        $scope.beData.VoucherDate_TMP = new Date(tran.VoucherDate);
        $scope.beData.VoucherDateAD_TMP = new Date(tran.VoucherDate);
        $scope.beData.VoucherDateDet = GlobalServices.getDateDet(tran.VoucherDate);
        setTimeout(1000);
		
		 //$timeout(function () {
   //         if ($scope.SelectedVoucher.DateStyle == 3 || $scope.SelectedVoucher.DateStyle == 4) {
   //             if ($scope.beData.VoucherDateDet) {
   //                 $scope.beData.VoucherDateAD_TMP = new Date($scope.beData.VoucherDateDet.dateAD);
   //             }
   //             else if ($scope.beData.VoucherDate_TMP) {
   //                 $scope.beData.VoucherDateAD_TMP = new Date($scope.beData.VoucherDate_TMP);
   //             }
   //         }
   //     });
		
		
        $scope.lastPartyLedgerId = tran.PartyLedgerId;
        $scope.beData.PartyLedgerName = tran.PartyLedgerName;
        $scope.beData.Address = tran.Address;
        $scope.beData.SalesTaxNo = tran.SalesTaxNo;
        $scope.beData.VehicleNo = tran.VehicleNo;
        $scope.beData.EngineNo = tran.EngineNo;
        $scope.beData.ChassisNo = tran.ChassisNo;
        $scope.beData.VinNo = tran.VinNo;
        $scope.beData.Model = tran.Model;
        $scope.beData.PartyLedgerId = tran.PartyLedgerId;
        $scope.beData.SourceGodownId = tran.SourceGodownId;
        $scope.beData.ProductBrandId = tran.ProductBrandId;
        $scope.beData.JobCardNo = tran.JobCardNo;

        $scope.beData.ProjectId = tran.ProjectId;
        $scope.beData.TranId = tran.TranId;
        $scope.beData.VoucherId = tran.VoucherId;
        $scope.beData.CostClassId = tran.CostClassId;
        $scope.beData.AutoVoucherNo = tran.AutoVoucherNo;
        $scope.beData.CurRate = tran.CurRate;
        $scope.beData.CurrencyId = tran.CurrencyId;
        $scope.beData.ManualVoucherNO = tran.ManualVoucherNO;
        $scope.beData.Narration = tran.Narration;
        $scope.beData.VoucherDate = new Date(tran.VoucherDate);
        $scope.beData.VoucherDate_TMP = new Date(tran.VoucherDate);
        $scope.beData.RefNo = tran.RefNo;
        $scope.beData.AutoManualNo = tran.AutoManualNo;

        $scope.beData.TotalAmount = tran.TotalAmount;
        $scope.beData.EntryDate = new Date(tran.EntryDate);
        $scope.beData.BranchId = (tran.BranchId ? tran.BranchId : 0);
        $scope.beData.DocumentColl = tran.DocumentColl;

        $scope.beData.SourceItemDetailsColl = [];
        $scope.beData.TargetItemDetailsColl = [];
        angular.forEach(tran.ItemDetailsColl, function (itemA) {
            itemA.RowType = 'P';
            itemA.RefQty = itemA.ActualQty;
            itemA.LastGodownId = itemA.GodownId;

            if ($scope.SelectedVoucher.Product && $scope.SelectedVoucher.Product.VoucherWiseDecimalPlaces == true) {
                itemA.QtyDecimal = $scope.SelectedVoucher.Product.QtyNoOfDecimalPlaces;
                itemA.RateDecimal = $scope.SelectedVoucher.Product.RateNoOfDecimalPlaces;
                itemA.AmountDecimal = $scope.SelectedVoucher.Product.AmountNoOfDecimalPlaces;
            } else {
                var findUnit = $scope.UnitColl.firstOrDefault(p1 => p1.UnitId == itemA.UnitId);
                if (findUnit) {
                    itemA.QtyDecimal = findUnit.NoOfDecimalPlaces;
                    itemA.RateDecimal = findUnit.RateNoOfDecimalPlaces;
                    itemA.AmountDecimal = findUnit.AmountNoOfDecimalPlaces;
                }
            }
             
            $scope.beData.SourceItemDetailsColl.push(itemA);
        }); 

        $scope.AddBlankRow();

    };

    $scope.Print = function () {
        if ($scope.lastTranId || $scope.lastVoucherId > 0) {
            var TranId = $scope.lastTranId;

            var vId = $scope.lastVoucherId;

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
                                                document.body.style.cursor = 'wait';
                                                document.getElementById("frmRpt").src = '';
                                                document.getElementById("frmRpt").src = base_url + "web/ReportViewer.aspx?rpttranid=" + rptTranId + "&istransaction=true&entityid=" + EntityId + "&voucherid=" + $scope.SelectedVoucher.VoucherId + "&tranid=" + TranId + "&vouchertype=" + VoucherType;
                                                document.body.style.cursor = 'default';
                                                $('#FrmPrintReport').modal('show');
                                            }
                                        } else {
                                            resolve('You need to select:)')
                                        }
                                    })
                                }
                            })
                        }

                        if (rptTranId > 0) {
                            document.body.style.cursor = 'wait';
                            document.getElementById("frmRpt").src = '';
                            document.getElementById("frmRpt").src = base_url + "web/ReportViewer.aspx?rpttranid=" + rptTranId + "&istransaction=true&entityid=" + EntityId + "&voucherid=" + $scope.SelectedVoucher.VoucherId + "&tranid=" + TranId + "&vouchertype=" + VoucherType;
                            document.body.style.cursor = 'default';
                            $('#FrmPrintReport').modal('show');
                        }

                    } else
                        Swal.fire('No Templates found for print');
                }
            }, function (reason) {
                Swal.fire('Failed' + reason);
            });



        }
    };

    $scope.getVoucherNoOnly = function (dateStyle) {

        $timeout(function () {
            if ($scope.SelectedVoucher.DateStyle == 3 || $scope.SelectedVoucher.DateStyle == 4) {
                if (dateStyle == 1) //AD
                {
                    if ($scope.beData.VoucherDateADDet && $scope.beData.VoucherDateADDet.dateAD != $scope.beData.VoucherDate_TMP) {
                        $scope.beData.VoucherDate_TMP = new Date($scope.beData.VoucherDateADDet.dateAD);
                    }
                }
                else if (dateStyle == 2) //BS
                {
                    if ($scope.beData.VoucherDateDet && $scope.beData.VoucherDateAD_TMP != $scope.beData.VoucherDateDet.dateAD) {
                        $scope.beData.VoucherDateAD_TMP = new Date($scope.beData.VoucherDateDet.dateAD);
                    }
                }
            }
        });

        var isModify = ($scope.beData.TranId > 0 ? true : false);

        if ($scope.SelectedVoucher && isModify == false) {

            if ($scope.beData.VoucherId && $scope.beData.VoucherId > 0) {
                if ($scope.beData.CostClassId && $scope.beData.CostClassId > 0) {
                    var para = {
                        voucherId: $scope.beData.VoucherId,
                        costClassId: $scope.beData.CostClassId,
                        voucherDate: $scope.beData.VoucherDateDet ? ($filter('date')(new Date($scope.beData.VoucherDateDet.dateAD), 'yyyy-MM-dd')) : ($filter('date')(new Date(), 'yyyy-MM-dd'))
                    };

                    $http({
                        method: 'POST',
                        url: base_url + "Account/Creation/GetVoucherNo",
                        dataType: "json",
                        data: JSON.stringify(para)
                    }).then(function (res) {
                        if (res.data.IsSuccess && res.data.Data) {
                            var vDet = res.data.Data;
                            $scope.beData.AutoManualNo = vDet.AutoManualNo;
                            $scope.beData.AutoVoucherNo = vDet.AutoVoucherNo;

                        } else {
                            Swal.fire(res.data.ResponseMSG);
                        }
                    }, function (reason) {
                        Swal.fire('Failed' + reason);
                    });
                }
            } else {
                $scope.beData.AutoManualNo = '';
                $scope.beData.AutoVoucherNo = 0;
            }

        }
    }
	
      $scope.reloadVoucherDate = function () {

        const container = angular.element(document.getElementById('dvDTVoucher'));
        container.empty(); // Clear the container


        if ($scope.SelectedVoucher.VoucherDate) {
            var forDate = new Date($scope.SelectedVoucher.VoucherDate);

            if (forDate != $scope.beData.VoucherDateAD_TMP)
                $scope.beData.VoucherDateAD_TMP = new Date(forDate);

            if (forDate != $scope.beData.VoucherDate_TMP)
                $scope.beData.VoucherDate_TMP = new Date(forDate);
        }
        else {
            if ($scope.beData.VoucherDateDet && $scope.beData.VoucherDateDet.dateAD && $scope.beData.VoucherDateDet.dateAD != $scope.beData.VoucherDateAD_TMP)
                $scope.beData.VoucherDateAD_TMP = new Date($scope.beData.VoucherDateDet.dateAD);
            else if ($scope.beData.VoucherDate && $scope.beData.VoucherDateAD_TMP != $scope.beData.VoucherDate)
                $scope.beData.VoucherDateAD_TMP = new Date($scope.beData.VoucherDate);
        }

        $timeout(function () {
                var dtPicker = `<label for="inputEmail3" style="min-width: 100px;">{{SelectedVoucher.VoucherDateLabel ? SelectedVoucher.VoucherDateLabel : ' Date'}}<span style="color:red">*</span></label>`;
            if ($scope.SelectedVoucher.DateStyle == 2) //BS
            {
                dtPicker = dtPicker + '<div class="nepalidate-wrapper-uiux"><input type="text"  class="form-control form-control-sm nepalidate-uiux" date-picker ng-model="beData.VoucherDate_TMP" date-detail="beData.VoucherDateDet" confirm-action="getVoucherNoOnly(2)" title ="{{beData.VoucherDateDet.dateAD |dateFormat}}" date-style="2" id ="dtVoucherDateBS" voucherid ="SelectedVoucher.VoucherId"  model-name="beData.VoucherDate"></div>';
            }
            else if ($scope.SelectedVoucher.DateStyle == 1) //AD
            {
                dtPicker = dtPicker + '<input type="text"  class="form-control form-control-sm" date-picker ng-model="beData.VoucherDate_TMP" date-detail="beData.VoucherDateDet" confirm-action="getVoucherNoOnly(1)" title ="{{ beData.VoucherDateDet.dateBS }}" date-style="1" id ="dtVoucherDateAD" voucherid ="SelectedVoucher.VoucherId"  model-name="beData.VoucherDate">';
            }
            else if ($scope.SelectedVoucher.DateStyle == 3) //BS & AD
            {
            
                dtPicker = dtPicker + `<div class="d-inline-block">
                    <div class="input-group input-group-sm">
                        <div class="input-group-prepend">
                            <span class="input-group-text">BS:</span>
                        </div>                        
                        <div class="nepalidate-wrapper-uiux"><input type="text"  class="form-control form-control-sm nepalidate-uiux" date-picker ng-model="beData.VoucherDate_TMP" date-detail="beData.VoucherDateDet" confirm-action="getVoucherNoOnly(2)" title ="{{beData.VoucherDateDet.dateAD |dateFormat}}" date-style="2" id ="dtVoucherDateBS" voucherid ="SelectedVoucher.VoucherId"  model-name="beData.VoucherDate" ></div>
                        <div class="input-group-prepend">
                            <span class="input-group-text">AD:</span>
                        </div>                        
                        <input type="text"  class="form-control form-control-sm" date-picker ng-model="beData.VoucherDateAD_TMP" date-detail="beData.VoucherDateADDet" confirm-action="getVoucherNoOnly(1)" title ="{{ beData.VoucherDateADDet.dateBS }}" date-style="1" id ="dtVoucherDateAD" voucherid ="SelectedVoucher.VoucherId"  model-name="beData.VoucherDate" >
                    </div>
                </div>`;
            }
            else if ($scope.SelectedVoucher.DateStyle == 4) //AD & BS
            {               
                dtPicker = dtPicker + `<div class="d-inline-block">
                    <div class="input-group input-group-sm">                       
                        <div class="input-group-prepend">
                            <span class="input-group-text">AD:</span>
                        </div>                        
                        <input type="text"  class="form-control form-control-sm" date-picker ng-model="beData.VoucherDateAD_TMP" date-detail="beData.VoucherDateADDet" confirm-action="getVoucherNoOnly(1)" title ="{{ beData.VoucherDateADDet.dateBS }}" date-style="1" id ="dtVoucherDateAD" voucherid ="SelectedVoucher.VoucherId"  model-name="beData.VoucherDate" >
 <div class="input-group-prepend">
                            <span class="input-group-text">BS:</span>
                        </div>
                       <div class="nepalidate-wrapper-uiux"> <input type="text"  class="form-control form-control-sm nepalidate-uiux" date-picker ng-model="beData.VoucherDate_TMP" date-detail="beData.VoucherDateDet" confirm-action="getVoucherNoOnly(2)" title ="{{beData.VoucherDateDet.dateAD |dateFormat}}" date-style="2" id ="dtVoucherDateBS" voucherid ="SelectedVoucher.VoucherId"  model-name="beData.VoucherDate" ></div>
                    </div>
                </div>`;
            }
            else  //BOTH
            {
                dtPicker = dtPicker +'<input type="text"  class="form-control form-control-sm" date-picker ng-model="beData.VoucherDate_TMP" date-detail="beData.VoucherDateDet" confirm-action="getVoucherNoOnly(2)" title ="{{beData.VoucherDateDet.dateAD |dateFormat}}" date-style="2" id ="dtVoucherDateBS" voucherid ="SelectedVoucher.VoucherId"  model-name="beData.VoucherDate" >';
            }
            const newElement = angular.element(dtPicker);
            //container.append($compile(newElement)($scope));

            container.append(newElement);
            $compile(newElement)($scope);
            //Added  by UIUX
            //$timeout(function () {
            //    container.find('.nepalidate-uiux').nepaliDatePicker({
            //        container: '.nepalidate-wrapper-uiux'
            //    });
            //}, 0);
          //Ends
        });
    };
	
    $scope.getVoucherNo = function () {
        $scope.beData.AditionalCostColl = [];

        if ($scope.beData.VoucherId > 0)
            $scope.SelectedVoucher = mx($scope.VoucherTypeColl).firstOrDefault(p1 => p1.VoucherId == $scope.beData.VoucherId);

        if ($scope.beData.CostClassId > 0)
            $scope.SelectedCostClass = mx($scope.CostClassColl).firstOrDefault(p1 => p1.CostClassId == $scope.beData.CostClassId);

        if ($scope.SelectedVoucher) {
            $http({
                method: 'GET',
                url: base_url + "Account/Creation/GetVoucherModeById?voucherId=" + $scope.SelectedVoucher.VoucherId,
                dataType: "json"
            }).then(function (res) {
                if (res.data.IsSuccess && res.data.Data) {
                    $scope.SelectedVoucher = res.data.Data;

                    if ($scope.SelectedVoucher.VoucherDate) {
                        $scope.beData.VoucherDateDet = null;
                        var forDate = new Date($scope.SelectedVoucher.VoucherDate);
                        $scope.beData.VoucherDate = forDate;
                        $scope.beData.VoucherDate_TMP = forDate;
                        $scope.beData.VoucherDateAD_TMP = forDate;
                    }

 $timeout(function () {                      
                        //$scope.$broadcast('date.refresh');
                        $scope.reloadVoucherDate();
                    });
					
                    $timeout(function () {
                        $scope.$apply(function () {
                            if ($scope.SelectedVoucher) {
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

                                if ($scope.SelectedVoucher.Product.ShowProductQuantityPoint == true)
                                    $scope.HideShow.ProductPoint = false;
                                else
                                    $scope.HideShow.ProductPoint = true;

                                //if ($scope.SelectedVoucher.Product.ProductWiseLedger == true) {
                                //    $scope.HideShow.ProductLedger = false;

                                //    if ($scope.SelectedVoucher.Product.ShowProductWiseLedger == true)
                                //        $scope.HideShow.ShowProductWiseLedger = false;
                                //    else
                                //        $scope.HideShow.ShowProductWiseLedger = true;
                                //}
                                //else {
                                //    $scope.HideShow.ProductLedger = true;
                                //    $scope.HideShow.ShowProductWiseLedger = true;
                                //}


                                if ($scope.SelectedVoucher.Product.ShowAlternateUnit == true) {
                                    $scope.HideShow.AlternetUnit = false;

                                    if ($scope.SelectedVoucher.Product.ActiveAlternateUnitColumn1 == true)
                                        $scope.HideShow.AlternetUnit1 = false;
                                    else
                                        $scope.HideShow.AlternetUnit1 = true;

                                    if ($scope.SelectedVoucher.Product.ActiveAlternateUnitColumn1 == true)
                                        $scope.HideShow.AlternetUnit2 = false;
                                    else
                                        $scope.HideShow.AlternetUnit2 = true;

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

                                $scope.SelectedVoucher.VoucherWiseGodownColl = $scope.GodownColl;

                                if ($scope.SelectedVoucher.GodownColl && $scope.SelectedVoucher.GodownColl.length > 0) {
                                    var tmpGodownColl = [];
                                    var godown_Qry = mx($scope.SelectedVoucher.GodownColl);
                                    angular.forEach($scope.GodownColl, function (gd) {
                                        if (godown_Qry.contains(gd.GodownId)) {
                                            tmpGodownColl.push(gd);
                                        }
                                    });

                                    if (tmpGodownColl.length > 0) {
                                        $scope.SelectedVoucher.VoucherWiseGodownColl = tmpGodownColl;
                                    } else {
                                        $scope.SelectedVoucher.VoucherWiseGodownColl = $scope.GodownColl;
                                    }


                                    if (tmpGodownColl.length == 1) {
                                        $scope.beData.GodownId = tmpGodownColl[0].GodownId;
                                        $scope.HideShow.Godown = true;
                                    }
                                    else if (tmpGodownColl.length > 1) {
                                        $scope.HideShow.Godown = false;
                                        $scope.beData.GodownId = tmpGodownColl[0].GodownId;
                                    }
                                    else {
                                        $scope.HideShow.Godown = false;
                                        $scope.beData.GodownId = null;
                                    }

                                    if ($scope.beData.GodownId && $scope.beData.GodownId > 0) {
                                        if (angular.forEach($scope.beData.SourceItemDetailsColl, function (idet) {
                                            //if (!idet.GodownId || idet.GodownId == 0)
                                                idet.GodownId = $scope.beData.GodownId;
                                        }));
                                    }
                                }
                                else
                                    $scope.SelectedVoucher.VoucherWiseGodownColl = $scope.GodownColl;

                                if ($scope.SelectedVoucher.VoucherWiseGodownColl && $scope.SelectedVoucher.VoucherWiseGodownColl.length > 1)
                                    $scope.HideShow.Godown = false;

								$timeout(function () {
                                    if (TranId && TranId > 0) {
                                        var newEdit = {
                                            TranId: TranId,
                                        };
                                        $scope.GetTransactionById(newEdit);
                                        TranId = null;
                                    }
                                });

                            }


                        });
                    });

                }
            }, function (reason) {
                Swal.fire('Failed' + reason);
            });
        }

        if ($scope.beData.VoucherId && $scope.beData.VoucherId > 0) {
            if ($scope.beData.CostClassId && $scope.beData.CostClassId > 0) {
                var para = {
                    voucherId: $scope.beData.VoucherId,
                    costClassId: $scope.beData.CostClassId,
                    voucherDate: $scope.beData.VoucherDateDet ? ($filter('date')(new Date($scope.beData.VoucherDateDet.dateAD), 'yyyy-MM-dd')) : ($filter('date')(new Date(), 'yyyy-MM-dd'))
                };

                $http({
                    method: 'POST',
                    url: base_url + "Account/Creation/GetVoucherNo",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    if (res.data.IsSuccess && res.data.Data) {
                        var vDet = res.data.Data;
                        $scope.beData.AutoManualNo = vDet.AutoManualNo;
                        $scope.beData.AutoVoucherNo = vDet.AutoVoucherNo;
                    } else {
                        Swal.fire(res.data.ResponseMSG);
                    }
                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }
        } else {
            $scope.beData.AutoManualNo = '';
            $scope.beData.AutoVoucherNo = 0;
        }

    }

    $scope.AddBlankRow = function () {

        if ($scope.beData.SourceItemDetailsColl && $scope.beData.SourceItemDetailsColl.length == 0) {
            $scope.beData.SourceItemDetailsColl.push(
                {
                    RowType: 'P',
                    ProductId: 0,
                    productDetail: null,
                    ActualQty: 0,
                    BilledQty: 0,
                    FreeQty: 0,
                    Rate: 0,
                    DiscountPer: 0,
                    DiscountAmt: 0,
                    SchameAmt: 0,
                    SchamePer: 0,
                    Amount: 0,
                    Description: '',
                    QtyPoint: 0,
                    UnitId: null,
                    CanEditRate: false,
                    ALValue1: 0,
                    ALValue2: 0,
                    ALUnitId1: null,
                    ALUnitId2: null,
                    SchemeAmt: 0,
                    SchemeAmt: 0,
                    QtyDecimal: 2,
                    RateDecimal: 2,
                    AmountDecimal: 2
                }); 
        }         
    };

    $scope.ClearData = function () {
        $timeout(function () {


            var sV = $scope.SelectedVoucher;
            var sC = $scope.SelectedCostClass;
             
            $scope.RefItemAllocationColl = [];
            $scope.SelectedVoucher = null;
            $scope.SelectedCostClass = null;

            $scope.beData =
            {
                VoucherId: null,
                CostClassId: null,
                TranId: 0,
                AutoManualNo: '',
                AutoVoucherNo: 0,
                PartyLedgerId: null,
                PartyLedger: null,
                partySideBarData: null,
                SalesLedgerId: null,
                salesledgerDetail: null,
                TranCostCenter: null,
                PartyCostCenter: null,
                salescostcenterDetail: null,
                SalesMan: null,
                salesmanSideBarData: null,
                CurRate: 1,
                AttechFiles: [],
                SubTotal: 0,
                Total: 0,
                Narration: '',
                VoucherDate: new Date(),
                VoucherDate_TMP: new Date(),
                EntryDate_TMP: new Date(),
                SourceItemColl: [],
                TargetItemColl: [],
                SourceItemDetailsColl: [],
                TargetItemDetailsColl: [],
                RefVoucherType: 1,
				DocumentColl: [],

            };

            $scope.AddBlankRow();

            if ($scope.GodownColl.length > 0) {
                $scope.beData.GodownId = $scope.GodownColl[0].GodownId;
                $scope.HideShow.Godown = true;
            } else {
                $scope.HideShow.Godown = false;
                $scope.beData.GodownId = null;
            }



            if ($scope.VoucherTypeColl.length > 0) {
                $scope.SelectedVoucher = $scope.VoucherTypeColl[0];
                $scope.beData.VoucherId = $scope.SelectedVoucher.VoucherId;
            }

            if ($scope.CostClassColl.length > 0) {
                $scope.SelectedCostClass = $scope.CostClassColl[0];
                $scope.beData.CostClassId = $scope.SelectedCostClass.CostClassId;
            }

            if (sV) {
                $scope.SelectedVoucher = sV;
                $scope.beData.VoucherId = sV.VoucherId;
            }

            if (sC) {
                $scope.SelectedCostClass = sC;
                $scope.beData.CostClassId = sC.CostClassId;
            }
             

            $scope.getVoucherNo();
        });


        //$timeout(function () {
        //    GlobalServices.getCurrentDateTime().then(function (res) {
        //        var curDate = res.data.Data;
        //        if (curDate) {
        //            $scope.beData.VoucherDate_TMP = new Date(curDate);
        //        }
        //    }, function (errormessage) {
        //        alert('Unable to Delete data. pls try again.' + errormessage.responseText);
        //    });
        //});
    }
    $scope.ClearItemDetails = function () {

        $scope.beData.SourceItemDetailsColl = [];
        $scope.beData.SourceItemDetailsColl.push(
            {
                RowType: 'P',
                ProductId: 0,
                productDetail: null,
                ActualQty: 0,
                BilledQty: 0,
                FreeQty: 0,
                Rate: 0,
                DiscountPer: 0,
                DiscountAmt: 0,
                SchameAmt: 0,
                SchamePer: 0,
                Amount: 0,
                Description: '',
                QtyPoint: 0,
                UnitId: null,
                CanEditRate: false,
                ALValue1: 0,
                ALValue2: 0,
                ALUnitId1: null,
                ALUnitId2: null,
                SchemeAmt: 0,
                SchemeAmt: 0,
                QtyDecimal: 2,
                RateDecimal: 2,
                AmountDecimal: 2
            });

        
    }
    $scope.Clear = function () {
        if (!$scope.beData.SaveClear || $scope.beData.SaveClear == false) {

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

        } else {
            $scope.ClearData();
        }

        //if (isValidForClear == true) {

        //}
    };

    $scope.SearchDataColl = [];
    $scope.SearchData = function () {

        $scope.loadingstatus = 'running';
        showPleaseWait();
        $scope.paginationOptions.TotalRows = 0;

        var sCol = $scope.paginationOptions.SearchColDet;

        var para = {
            voucherId: ($scope.SelectedVoucher ? $scope.SelectedVoucher.VoucherId : null),
            costClassId: ($scope.SelectedCostClass ? $scope.SelectedCostClass.CostClassId : null),
            voucherType: VoucherType,
            filter: {
                DateFrom: null,
                DateTo: null,
                PageNumber: $scope.paginationOptions.pageNumber,
                RowsOfPage: $scope.paginationOptions.pageSize,
                SearchCol: (sCol ? sCol.value : ''),
                SearchVal: $scope.paginationOptions.SearchVal,
                SearchType: (sCol ? sCol.searchType : 'text')
            }
        };

        $http({
            method: 'POST',
            url: base_url + "Inventory/Transaction/GetTransactionLst",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            $scope.loadingstatus = 'stop';
            hidePleaseWait();

            if (res.data.IsSuccess && res.data.Data) {
                $scope.SearchDataColl = res.data.Data;
                $scope.paginationOptions.TotalRows = res.data.TotalCount;
                $('#searVoucherRightBtn').modal('show');

            } else
                alert(res.data.ResponseMSG);

        }, function (reason) {
            alert('Failed' + reason);
        });


    };
    $scope.ReSearchData = function (pageInd) {
        if (pageInd && pageInd >= 0)
            $scope.paginationOptions.pageNumber = pageInd;
        else if (pageInd == -1)
            $scope.paginationOptions.pageNumber = 1;

        $scope.loadingstatus = 'running';
        showPleaseWait();
        $scope.paginationOptions.TotalRows = 0;
        var sCol = $scope.paginationOptions.SearchColDet;

        var para = {
            voucherId: ($scope.SelectedVoucher ? $scope.SelectedVoucher.VoucherId : null),
            costClassId: ($scope.SelectedCostClass ? $scope.SelectedCostClass.CostClassId : null),
            voucherType: VoucherType,
            filter: {
                DateFrom: null,
                DateTo: null,
                PageNumber: $scope.paginationOptions.pageNumber,
                RowsOfPage: $scope.paginationOptions.pageSize,
                SearchCol: (sCol ? sCol.value : ''),
                SearchVal: $scope.paginationOptions.SearchVal,
                SearchType: (sCol ? sCol.searchType : 'text')
            }
        };

        $http({
            method: 'POST',
            url: base_url + "Inventory/Transaction/GetTransactionLst",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            $scope.loadingstatus = 'stop';
            hidePleaseWait();

            if (res.data.IsSuccess && res.data.Data) {
                $scope.SearchDataColl = res.data.Data;
                $scope.paginationOptions.TotalRows = res.data.TotalCount;

            } else
                alert(res.data.ResponseMSG);

        }, function (reason) {
            alert('Failed' + reason);
        });

    }
    $scope.PrintVoucher = function (tranId, vid) {
        $scope.lastTranId = tranId;
        $scope.lastVoucherId = vid;
        $scope.Print();
    }

    $scope.GetTransactionById = function (tran) {
        $timeout(function () {

            if (tran.TranId && tran.TranId > 0) {
                var para = {
                    tranId: tran.TranId
                };
                $http({
                    method: 'POST',
                    url: base_url + "Inventory/Transaction/GetConsumptionById",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    $timeout(function () {
                        if (res.data.IsSuccess && res.data.Data) {
                            var tran = res.data.Data;
                            $scope.SetData(tran);
                            $('#searVoucherRightBtn').modal('hide');
                        } else
                            {
                                hidePleaseWait();
                                $scope.loadingstatus = "stop";
                                Swal.fire(res.data.ResponseMSG);
                            }
                    });
                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }
        });
    }

    $scope.DelTransactionById = function (tran) {
        Swal.fire({
            title: 'Are you sure you want to delete selected transaction ' + tran.VoucherNo + '?',
            showCancelButton: true,
            confirmButtonText: 'Delete',
            //message: 'Are you sure to delete selected Branch :-' + beData.Name,
        }).then((result) => {
            if (result.isConfirmed) {
                $scope.loadingstatus = "running";
                showPleaseWait();
                var para = {
                    voucherType: VoucherType,
                    voucherId: tran.VoucherId,
                    tranId: tran.TranId,
                    voucherDate: tran.VoucherDate,
                    CostClassId: tran.CostClassId,
                };
                $http({
                    method: 'POST',
                    url: base_url + "Global/DelAccInvTransaction",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingstatus = "stop";
                    Swal.fire(res.data.ResponseMSG);
                    if (res.data.IsSuccess == true) {
                        $scope.ClearData();
                        $scope.ReSearchData(-1);
                    }
                }, function (reason) {
                    Swal.fire('Failed' + reason);

                });
            }

        });
    }

    $scope.ValidLedAllocationColl = [];
    $scope.IsValidTran = function () {
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
                    formData.append("EntityId", EntityId);
                    formData.append("jsonData", angular.toJson(data.jsonData));
                    return formData;
                },
                data: { jsonData: $scope.GetData() }
            }).then(function (res) {

                $scope.loadingstatus = "stop";
                hidePleaseWait();
                if (res.data.IsSuccess == true) {
                    if (res.data.Data && res.data.Data.length > 0) {
                        $scope.ValidLedAllocationColl = JSON.parse(res.data.Data);
                        $('#frmMDLLedAllocation').modal('show');
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

    $scope.TranRelation = {};
    $scope.ShowTransactionRelation = function () {

        $scope.TranRelation = {};
        if ($scope.beData.TranId > 0) {

            $scope.loadingstatus = "running";
            showPleaseWait();

            var para = {
                TranId: $scope.beData.TranId,
                VoucherType: VoucherType,
            };

            $http({
                method: 'POST',
                url: base_url + "Global/GetTranRelation",
                dataType: "json",
                data: JSON.stringify(para)
            }).then(function (res1) {
                $scope.loadingstatus = "stop";
                hidePleaseWait();
                if (res1.data.IsSuccess && res1.data.Data) {
                    var tranData = res1.data.Data;
                    if (tranData.length > 0) {
                        $scope.TranRelation.Parent = res1.data.Data[0];
                        $scope.TranRelation.ChieldColl = [];
                        angular.forEach(tranData, function (td) {
                            if (td.LevelId > 1)
                                $scope.TranRelation.ChieldColl.push(td);
                        });

                        $('#frmMDLTranRelation').modal('show');
                    }

                }
            }, function (reason) {
                Swal.fire('Failed' + reason);
            });


        }
    }
    $scope.AuditLogColl = [];
    $scope.ShowAuditLog = function () {

        $scope.AuditLogColl = {};
        if ($scope.beData.TranId > 0) {

            $scope.loadingstatus = "running";
            showPleaseWait();

            GlobalServices.getAuditLog(EntityId, $scope.beData.TranId).then(function (res1) {
                $scope.loadingstatus = "stop";
                hidePleaseWait();
                if (res1.data.IsSuccess && res1.data.Data) {
                    $scope.AuditLogColl = res1.data.Data;
                    $('#frmAuditHis').modal('show');
                }
            }, function (reason) {
                Swal.fire('Failed' + reason);
            });

        }
    }
	
	
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



    $scope.MulData = null;
    $scope.MulObj = {};
    $scope.ShowMultipleModal = function () {

        if ($scope.MulData == null) {

            $http({
                method: 'GET',
                url: base_url + "Setup/Security/GetEntityPropCopyPaste?EntityId=" + EntityId,
                dataType: "json"
            }).then(function (res1) {
                $scope.loadingstatus = "stop";
                hidePleaseWait();
                if (res1.data.IsSuccess && res1.data.PropertiesColl) {
                    $scope.MulData = {};
                    $scope.MulData.Title = 'Item Details';
                    $scope.MulData.ColColl = [];
                    $scope.MulData.DataColl = [];
                    $scope.MulObj = res1.data.Obj;
                    angular.forEach(res1.data.PropertiesColl, function (pc) {
                        $scope.MulData.ColColl.push({
                            id: pc.Id,
                            label: pc.Name,
                            name: pc.PropertyName,
                            dataType: pc.DataType,
                        });
                    });
                    var newObj = angular.copy($scope.MulObj);
                    $scope.MulData.DataColl.push(newObj);
                    $('#frmImportMultipleCopy').modal('show');
                }
                else {
                    Swal.fire(res1.data.ResponseMSG);
                }

            }, function (reason) {
                Swal.fire('Failed' + reason);
            });
        }
        else {
            $scope.MulData.DataColl = [];
            $scope.MulData.Title = 'Import Product Lines';
            //$scope.MulData.ColColl = [{ id: 1, label: 'Name', name: 'Name' }, { id: 2, label: 'Alias', name: 'Alias' }, { id: 3, label: 'Code', name: 'Code' }, { id: 4, label: 'Salesman Code', name: 'AgentCode' }];
            $scope.MulData.DataColl.push({});
            $('#frmImportMultipleCopy').modal('show');
        }

    }

    $(document).ready(function () {
        $('input.disablecopypaste').bind('paste', function (e) {
            e.preventDefault();
        });
    });

    $scope.PasteData = function (colName, ind) {
        var clipText = event.clipboardData.getData('text/plain');

        if (clipText) {
            var startInd = ind;
            clipText.split("\n").forEach(function (line) {
                if (line && line.length > 0) {

                    if ($scope.MulData.DataColl.length < (startInd + 1)) {
                        var newObj = angular.copy($scope.MulObj);
                        $scope.MulData.DataColl.push(newObj);
                    }

                    $scope.MulData.DataColl[startInd][colName] = line.trim();
                    startInd++;
                }
            });

            $scope.CalculateCopyPasteData();
        }

    }

    $scope.CalculateCopyPasteData = function () {
        if ($scope.MulData) {
            if ($scope.MulData.ColColl && $scope.MulData.DataColl) {

                $scope.MulData.ColColl.forEach(function (col) {
                    if (col.dataType == 'Double' || col.dataType == 'double' || col.dataType == 'Int32') {
                        col.Total = 0;
                        $scope.MulData.DataColl.forEach(function (dc) {
                            var val = dc[col.name];
                            if (val) {
                                col.Total = col.Total + isEmptyAmt(dc[col.name]);
                            }
                            else {
                                dc[col.name] = 0;
                            }
                        });
                    }
                });
            }
        }

    }

    $scope.addRowInMD = function (ind) {
        var newObj = angular.copy($scope.MulObj);
        $scope.MulData.DataColl.splice(ind + 1, 0, newObj);
        $scope.CalculateCopyPasteData();
    };
    $scope.delRowInMD = function (ind) {
        $scope.MulData.DataColl.splice(ind, 1);
        $scope.CalculateCopyPasteData();
    };
    $scope.SaveMultipleData = function () {
        if ($scope.MulData) {
            if ($scope.MulData.DataColl) {

                $scope.loadingstatus = "running";
                showPleaseWait();

                $http({
                    method: 'POST',
                    url: base_url + "Setup/Security/SaveCopyPasteTran",
                    headers: { 'content-Type': undefined },

                    transformRequest: function (data) {
                        var formData = new FormData();
                        formData.append("entityId", EntityId);
                        formData.append("jsonData", angular.toJson(data.jsonData));
                        return formData;
                    },
                    data: { jsonData: $scope.MulData.DataColl }
                }).then(function (res1) {

                    $scope.loadingstatus = "stop";
                    hidePleaseWait();

                    if (res1.data.IsSuccess == true && res1.data.Data) {
                        $('#frmImportMultipleCopy').modal('hide');
                        var dataColl = res1.data.Data.DataColl;
                        if (dataColl.length > 0) {
                            $scope.beData.ItemDetailsColl = [];
                            var ind = 0;
                            dataColl.forEach(function (dc) {
                                $scope.AddRowInItemDetails(ind);
                                var itemD = $scope.beData.ItemDetailsColl[ind];
                                itemD.ShowItemDetails = false;
                                itemD.ProductId = dc.ProductId;
                                itemD.Description = dc.Description;
                                itemD.ActualQty = dc.ActualQty;
                                itemD.BilledQty = dc.BilledQty;
                                dc++;
                            });
                        }
                    }
                    else {
                        Swal.fire(res1.data.ResponseMSG);
                    }

                }, function (errormessage) {
                    hidePleaseWait();
                    $scope.loadingstatus = "stop";
                });


            }
        }
    }
	
		$scope.ShowVoucher = function (voucherType, tranId) {
        GlobalServices.ShowVoucher(voucherType, tranId);       
    }

    $(document).on("keydown", ".serial", function (event) {
        if (event.key === "Enter") {
            event.preventDefault(); // Prevent default action

            var inputs = $(".serial:visible:not(:disabled):not([readonly])"); // Get all visible focusable elements
            var index = inputs.index(this);

            if (index < inputs.length - 1) {
                inputs.eq(index + 1).focus(); // Move to next input
            } else {
                // If last input, go to the first input of the next row
                var nextRow = $(this).closest("tr").next();
                if (nextRow.length) {
                    nextRow.find(".serial:visible:not(:disabled):not([readonly])").first().focus();
                }
            }
        }
        else if (event.key === "Tab" && event.shiftKey) {
            event.preventDefault(); // Prevent default action

            var inputs = $(".serial:visible:not(:disabled):not([readonly])");
            var index = inputs.index(this);

            if (index > 0) {
                inputs.eq(index - 1).focus(); // Move backward
            } else {
                // If first input, move to the last input of the previous row
                var prevRow = $(this).closest("tr").prev();
                if (prevRow.length) {
                    prevRow.find(".serial:visible:not(:disabled):not([readonly])").last().focus();
                }
            }
        }
    });
    $document.bind('keydown', function (event) {
        if (event.ctrlKey && event.key === 's') { // Ctrl + S
            event.preventDefault(); // Prevent browser save action
            $scope.$apply($scope.SaveConsumption);
        }
        if (event.key === 'F3') { // F3
            event.preventDefault(); // Prevent browser save action
            $scope.$apply($scope.SearchData);

        }
        if (event.key === 'F5') { // F5
            event.preventDefault(); // Prevent browser save action
            $scope.$apply($scope.ClearData);
        }

    });

    $scope.AddMoreFiles = function (files, des) {
        if (files) {
            if (files != null) {
                angular.forEach(files, function (file) {
                    $scope.beData.DocumentColl.push({
                        File: file,
                        Name: file.name,
                        Type: file.type,
                        Size: file.size,
                        Description: des,
                        Path: null
                    });
                })
                $scope.attachFile = null;
                $scope.docDescription = '';
                $('#flMoreFiles').val('');
            }
        }
    };

    $scope.delAttachmentFiles = function (ind) {
        if ($scope.beData.DocumentColl) {
            if ($scope.beData.DocumentColl.length > 0) {
                $scope.beData.DocumentColl.splice(ind, 1);
            }
        }
    }
    $scope.ShowPersonalImg = function (item) {
        $scope.viewImg = {
            ContentPath: '',
            FileType: null
        };

        if (item.DocPath && item.DocPath.length > 0) {
            $scope.viewImg.ContentPath = item.DocPath;
            $scope.viewImg.FileType = 'pdf';  // Assuming DocPath is for PDFs
            document.getElementById('pdfViewer').src = item.DocPath;
            $('#PersonalImg').modal('show');
        } else if (item.PhotoPath && item.PhotoPath.length > 0) {
            $scope.viewImg.ContentPath = item.PhotoPath;
            $scope.viewImg.FileType = 'image';  // Assuming PhotoPath is for images
            $('#PersonalImg').modal('show');
        } else if (item.File) {
            var blob = new Blob([item.File], { type: item.File?.type });
            $scope.viewImg.ContentPath = URL.createObjectURL(blob);
            $scope.viewImg.FileType = item.File.type.startsWith('image/') ? 'image' : 'pdf';

            if ($scope.viewImg.FileType === 'pdf') {
                document.getElementById('pdfViewer').src = $scope.viewImg.ContentPath;
            }

            $('#PersonalImg').modal('show');
        } else {
            Swal.fire('No Image Found');
        }
    };
    $scope.CurProductDet = {}
    $scope.ShowCurProductDetail = function (curRow, ind) {
        $scope.CurProductDet = curRow.productDetail;
        if ($scope.CurProductDet.AlternetUnitColl && $scope.CurProductDet.BaseUnit) {
            $scope.CurProductDet.AlternetUnitColl.forEach(function (item) {
                item.BaseUnitName = $scope.CurProductDet.BaseUnit;
            });
        }
        $('#ProductDetail').modal('show');

    }

});