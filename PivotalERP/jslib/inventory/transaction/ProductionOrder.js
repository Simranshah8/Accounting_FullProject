app.controller('CtrlProductionOrder', function ($scope, $http, $timeout, $filter, $compile, GlobalServices, $document) {
    $scope.Title = 'ProductionOrder';
    var glSrv = GlobalServices;
    LoadData();

    $scope.sideBarData = [];
    $scope.lastTranId = 0;

    $scope.lastTranId = 0;
    function LoadData() {
		
		 $scope.DefaultKeyValues_JSON = null;
        if (DefaultKeyValues && DefaultKeyValues.length > 0) {
            $scope.DefaultKeyValues_JSON = JSON.parse(decodeURIComponent(DefaultKeyValues));           
        }
		
        $scope.confirmMSG = glSrv.getConfirmMSG();
		$scope.VoucherSearchOptions = [{ text: 'FromGodown', value: 'G.Name', searchType: 'text' }, { text: 'ToGodown', value: 'G1.Name', searchType: 'text' }, { text: 'VoucherNo', value: 'TS.AutoManualNo', searchType: 'text' }, { text: 'RefNo', value: 'TS.[No]', searchType: 'text' }, { text: 'Voucher', value: 'V.VoucherName', searchType: 'text' },  { text: 'VoucherDate', value: 'TS.VoucherDate', searchType: 'date' }, { text: 'Amount', value: 'TS.TotalAmount', searchType: 'number' }];
        $scope.paginationOptions = {
            pageNumber: 1,
            pageSize: glSrv.getPerPageRow(),
            sort: null,
            SearchType: 'text',
            SearchCol: '',
            SearchVal: '',
            SearchColDet: $scope.VoucherSearchOptions[4],
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
            VoucherType: false,
            CostClass: false,
            AutoVoucherNo: false,
            PartyCostCenter: true,
            TranCostCenter: true,
            Agent: true,
            Currency: true,
            RefNo: true,
            SalesLedger: false,
            BilledQty: true,
            Discount: true,
            DiscountAmt: true,
            DiscountPer: true,
            CurrentBalance: false,
            FreeQty: true,
            Scheme: true,
            SchemeAmt: true,
            SchemePer: true,
            ProductDescript: true,
            ProductPoint: true,
            ProductLedger: true,
            AlternetUnit: true,

        }

        $scope.BOMRowTypes = [];
        $http({
            method: 'GET',
            url: base_url + "/V1/StaticValues/GetBOMRowType",
            dataType: "json"
        }).then(function (res) {
            $scope.BOMRowTypes = res.data;
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        $scope.UnitColl = [];
        $scope.AllUnitColl = [];
        $http({
            method: 'GET',
            url: base_url + "Inventory/Creation/GetAllUnit",
            dataType: "json"
            //data:JSON.stringify(para)
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.AllUnitColl = res.data.Data;
                $scope.UnitColl = mx(res.data.Data);
            }
        }, function (reason) {
            alert('Failed' + reason);
        });

        $scope.beData =
        {
            VoucherId: 0,
            TranId: 0,
            CostCenterId: 0,
            AutoManualNo: '',
            AutoVoucherNo: 0,
            ProductBrandId: 0,
            partySideBarData: null,
            SalesMan: null,
            salesmanSideBarData: null,
            CurRate: 1,
            ItemDetailsColl: [],
            AditionalCostColl: [],
            AttechFiles: [],
            SubTotal: 0,
            Total: 0,
            SourceGodownId: 0,
            TargetGodownId: 0,
            Narration: '',
            VoucherDate: new Date(),
            VoucherDate_TMP: new Date(),
            EntryDate_TMP: new Date(),
            SalesQuotationDetail: {},
            TargetGodownName: '',
            SourceGodownName: '',
            UDFFeildsColl: [],
			DocumentColl: [],
        };

        $scope.beData.ItemDetailsColl.push(
            {
                ProductId: 0,
                ProductBrandId: 0,
                CostCenterId: 0,
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
                ALUnitId2: null,
                TargetGodownName: '',
                SourceGodownName: '',
            }
        );
        $('.hideSideBar').on('focus', function (e) {
            $('#sidebarzz').removeClass();
            $('#sidebarzz').addClass('order-last float-right active');
        })

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
		
		
        $scope.BOMColl = [];
        if (VoucherType || VoucherType > 0) {

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

            $http({
                method: 'GET',
                url: base_url + "Setup/Security/GetSalesFeatures",
                dataType: "json"
            }).then(function (res1) {
                if (res1.data.IsSuccess && res1.data.Data) {
                    $scope.SalesFeatures = res1.data.Data;

                    $timeout(function () {
                        $scope.$apply(function () {
                            if ($scope.SalesFeatures.ProductWiseSalesLedger == true)
                                $scope.HideShow.SalesLedger = true;
                            else
                                $scope.HideShow.SalesLedger = false;
                        });
                    });
                }
            }, function (reason) {
                Swal.fire('Failed' + reason);
            });

            $http({
                method: 'GET',
                url: base_url + "Setup/Security/GetInventoryConfig",
                dataType: "json"
            }).then(function (res1) {
                if (res1.data.IsSuccess && res1.data.Data) {
                    $scope.Config = res1.data.Data;

                    $timeout(function () {
                        $scope.$apply(function () {
                            if ($scope.Config.AllowBilledQty == true)
                                $scope.HideShow.BilledQty = false;
                            else
                                $scope.HideShow.BilledQty = true;

                            if ($scope.Config.AllowDiscountAmount == true)
                                $scope.HideShow.DiscountAmt = false;
                            else
                                $scope.HideShow.DiscountAmt = true;

                            if ($scope.Config.AllowDiscountPer == true)
                                $scope.HideShow.DiscountPer = false;
                            else
                                $scope.HideShow.DiscountPer = true;

                            if ($scope.Config.AllowDiscountPer == false && $scope.Config.AllowDiscountAmount == false)
                                $scope.HideShow.Discount = true;
                            else
                                $scope.HideShow.Discount = false;

                            if ($scope.Config.ShowCurrentBalance == true)
                                $scope.HideShow.CurrentBalance = false;
                            else
                                $scope.HideShow.CurrentBalance = true;

                            if ($scope.Config.AllowFreeQty == true)
                                $scope.HideShow.FreeQty = false;
                            else
                                $scope.HideShow.FreeQty = true;

                            if ($scope.Config.AllowSchameAmount == true)
                                $scope.HideShow.SchemeAmt = false;
                            else
                                $scope.HideShow.SchemeAmt = true;

                            if ($scope.Config.AllowSchamePer == true)
                                $scope.HideShow.SchemePer = false;
                            else
                                $scope.HideShow.SchemePer = true;

                            if ($scope.Config.AllowSchamePer == false && $scope.Config.AllowSchameAmount == false)
                                $scope.HideShow.Scheme = true;
                            else
                                $scope.HideShow.Scheme = false;


                        });
                    });
                }
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

 
         
        $scope.ProductBrandColl = [];
        $http({
            method: 'GET',
            url: base_url + "Inventory/Transaction/GetProductBrand",
            dataType: "json"
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.ProductBrandColl = res.data.Data;
            }

        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        

        $scope.RefVoucherNoColl = [];
        $('#cboRefVoucherNo').select2();
        $('#cboRefVoucherNo').on("change", function (e) {
            var selectedData = $('#cboRefVoucherNo').select2('data');
            if (selectedData && selectedData.length > 0) {
                var tranId = selectedData[0].id;
                $scope.search = selectedData[selectedData.length - 1].text.toString().trim();
                $scope.onFilterTextBoxChanged();
                $scope.getRefVoucherPartyDetails(tranId);
            }

        });
    }
    $scope.onFilterTextBoxChanged = function () {
        $scope.gridOptions.api.setQuickFilter($scope.search);
    }

    $scope.AddRowInItemDetails = function (ind, boolAuto) {

        var udfColl = [];
        if ($scope.SelectedVoucher.VoucherProductUDFColl && $scope.SelectedVoucher.VoucherProductUDFColl.length > 0) {
            angular.forEach($scope.SelectedVoucher.VoucherProductUDFColl, function (udf) {
                var ud = {
                    SNo: udf.SNo,
                    Name: udf.Label,
                    Value: udf.DefaultValue,
                    FieldNo: udf.SNo,
                    DisplayName: udf.Label,
                    FieldType: udf.FieldType,
                    IsMandatory: udf.IsMandatory,
                    Length: 100,
                    SelectOptions: udf.DropDownList,
                    FieldAfter: udf.FieldAfter,
                    NameId: udf.Name,
                    Source: udf.Source,
                    Formula: udf.Formula,
                    UDFValue: udf.DefaultValue,
					RefTable: udf.RefTable,
                    RefColumn: udf.RefColumn,
                    TextColumn: udf.TextColumn,
                };
                udfColl.push(ud);
            });
        }

        if (boolAuto == true) {
            var len = $scope.beData.ItemDetailsColl.length;
            if ((ind + 1) != len)
                return;

            var selectItem = $scope.beData.ItemDetailsColl[ind];
            if (!selectItem.ProductId || selectItem.ProductId == null || selectItem.ProductId == 0)
                return;

        }

        if ($scope.beData.ItemDetailsColl) {
            if ($scope.beData.ItemDetailsColl.length > ind + 1) {
                $scope.beData.ItemDetailsColl.splice(ind + 1, 0, {
                    RowType:1,
                    ProductId: 0,
                    ProductBrandId: 0,
                    productDetail: null,
                    ActualQty: 0,
                    BilledQty: 0,
                    AvailableQty: 0,
                    BaseRatio:0,
                    PlanQty: 0,
                    RequiredQty:0,
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
                    ALUnitId2: null,
                    TargetGodownName: '',
                    SourceGodownName: '',
                    UDFFeildsColl: udfColl,
                })
            } else {
                $scope.beData.ItemDetailsColl.push({
                    RowType:1,
                    ProductId: 0,
                    productDetail: null,
                    ActualQty: 0,
                    BilledQty: 0,
                    AvailableQty: 0,
                    BaseRatio:0,
                    PlanQty: 0,
                    RequiredQty: 0,
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
                    ALUnitId2: null,
                    TargetGodownName: '',
                    SourceGodownName: '',
                    UDFFeildsColl: udfColl,
                })
            }
        }

    }

    $scope.delRowFromItemDetails = function (ind) {
        if ($scope.beData.ItemDetailsColl) {
            if ($scope.beData.ItemDetailsColl.length > 1) {
                $scope.beData.ItemDetailsColl.splice(ind, 1);
            }
        }

        $scope.CalculateTotalAndSubTotal();
    }

    $scope.ChangeCurrency = function () {
        if ($scope.beData.CurrencyDet) {
            $scope.beData.CurRate = $scope.beData.CurrencyDet.SellingRate;
        }
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

    $scope.ProductSelectionChange = function (itemDet) {
        $scope.sideBarData = itemDet.sideBarData;

        var isModify = $scope.beData.TranId > 0 ? true : false;

        if (itemDet.ProductId == null) {
            itemDet.AvailableQty = 0;
            itemDet.BaseRatio = 0;
            itemDet.PlanQtyv= 0;
            itemDet.RequiredQty = 0;
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
           // itemDet.Rate = itemDet.productDetail.SalesRate;

            if (isModify == false) {
                itemDet.Rate = itemDet.productDetail.SalesRate;
                itemDet.ProductLedgerId = itemDet.productDetail.SalesLedgerId;
                itemDet.LedgerId = itemDet.productDetail.SalesLedgerId;
            }
            else {
                if (itemDet.LedgerId == 0)
                    itemDet.LedgerId = itemDet.productDetail.SalesLedgerId;

                if (itemDet.ProductLedgerId == 0)
                    itemDet.LedgerId = itemDet.productDetail.SalesLedgerId;
            }
            


            itemDet.ClosingQty = $filter('formatNumber')(itemDet.productDetail.ClosingQty) + ' ' + itemDet.productDetail.BaseUnit;
            itemDet.AvailableQty = isEmptyAmt(itemDet.productDetail.ClosingQty);
            itemDet.UnitId = itemDet.productDetail.BaseUnitId;
            itemDet.UnitName = itemDet.productDetail.BaseUnit;
            //itemDet.ProductLedgerId = itemDet.productDetail.SalesLedgerId;
            //itemDet.ActualQty = 0;
            //itemDet.BilledQty = 0;
            //itemDet.DiscountAmt = 0;
            //itemDet.DiscountPer = 0;

            if (itemDet.AvailableQty < 0)
                itemDet.AvailableQty = 0;

            var reqQty = isEmptyAmt(itemDet.PlanQty) - isEmptyAmt(itemDet.AvailableQty);
            if (reqQty < 0)
                reqQty = 0;

            itemDet.RequiredQty = reqQty;

            $scope.ChangeItemRowValue(itemDet, 'product');
        }

    }

    $scope.PartySelectionChange = function (partyDet) {

        $scope.sideBarData = partyDet.partySideBarData;

        if (partyDet.PartyLedgerId && partyDet.PartyLedgerId > 0) {
            if (partyDet.PartyLedger) {
                if (partyDet.SalesQuotationDetail) {
                    if (!partyDet.SalesQuotationDetail.Buyes)
                        partyDet.SalesQuotationDetail.Buyes = partyDet.PartyLedger.Buyer;

                    if (!partyDet.SalesQuotationDetail.Address)
                        partyDet.SalesQuotationDetail.Address = partyDet.PartyLedger.Address;

                    if (!partyDet.SalesQuotationDetail.SalesTaxNo)
                        partyDet.SalesQuotationDetail.SalesTaxNo = partyDet.PartyLedger.SalesTaxNo;

                    if (!partyDet.SalesQuotationDetail.ContactNo)
                        partyDet.SalesQuotationDetail.ContactNo = partyDet.PartyLedger.ContactNo;
                }
            }
            $('#frmSalesQuotationDetailsModel').modal('show');
        } else {

            $scope.search = "";
            $scope.RefVoucherNoColl = [];
            //$('#cboRefVoucherNo').val(null).trigger('change');
            //var arr = [];
            //$('#cboRefVoucherNo').val(arr).trigger('change');

            $scope.gridOptions.api.setRowData($scope.RefItemAllocationColl);
            $scope.RefItemAllocationColl = [];
            partyDet.SalesQuotationDetail = {};
            partyDet.ItemDetailsColl = [];
            $scope.AddRowInItemDetails(0);
            $scope.CalculateTotalAndSubTotal();
            $('#frmSalesQuotationDetailsModel').modal('hide');
        }



    };

    $scope.getRefVoucherPartyDetails = function (tranId) {

        if ($scope.beData.RefVoucherType && tranId > 0) {

            var funName = "";

            var refVType = $scope.beData.RefVoucherType;

            if (refVType == 1)
                funName = "getDeliveryNotePartyDetails";
            else if (refVType == 2)
                funName = "";
            else if (refVType == 3)
                funName = "";
            else if (refVType == 4)
                funName = "getSalesAllotmentPartyDetails";
            else if (refVType == 5)
                funName = "";

            var para = "tranId=" + tranId;


            $http({
                method: 'GET',
                url: base_url + "Inventory/Transaction/" + funName + "?" + para,
                dataType: "json"
            }).then(function (res1) {
                if (res1.data.IsSuccess && res1.data.Data) {
                    var tmpdata = res1.data.Data;

                    if (refVType == 1) {

                        $scope.beData.SalesQuotationDetail.Description = tmpdata.RefNo;

                        $scope.beData.SalesQuotationDetail.Goods = tmpdata.DeliveryNoteDetail.RegdNo;

                        $scope.beData.SalesQuotationDetail.Buyes = tmpdata.DeliveryNoteDetail.Buyes;
                        $scope.beData.SalesQuotationDetail.Address = tmpdata.DeliveryNoteDetail.Address;
                        $scope.beData.SalesQuotationDetail.PhoneNo = tmpdata.DeliveryNoteDetail.PhoneNo;
                        $scope.beData.SalesQuotationDetail.SalesTaxNo = tmpdata.DeliveryNoteDetail.SalesTaxNo;

                        $scope.beData.SalesQuotationDetail.DriverName = tmpdata.DeliveryNoteDetail.DriverName;
                        $scope.beData.SalesQuotationDetail.DriverContactNo = tmpdata.DeliveryNoteDetail.DriverContactNo;
                    }
                    else if (refVType == 4) {
                        $scope.beData.SalesQuotationDetail.Buyes = tmpdata.Buyes;
                        $scope.beData.SalesQuotationDetail.Address = tmpdata.Address;
                        $scope.beData.SalesQuotationDetail.PhoneNo = tmpdata.PhoneNo;
                        $scope.beData.SalesQuotationDetail.SalesTaxNo = tmpdata.SalesTaxNo;
                        $scope.beData.SalesQuotationDetail.CreditDays = tmpdata.CreditDays;
                        $scope.beData.SalesQuotationDetail.Description = tmpdata.Description;

                        $scope.beData.SalesQuotationDetail.OwnerName = tmpdata.OwnerName;
                        $scope.beData.SalesQuotationDetail.OwnerContactNo = tmpdata.OwnerContactNo;
                        $scope.beData.SalesQuotationDetail.DriverName = tmpdata.DriverName;
                        $scope.beData.SalesQuotationDetail.DriverContactNo = tmpdata.DriverContactNo;
                        $scope.beData.SalesQuotationDetail.DriverAddress = tmpdata.DriverAddress;
                        $scope.beData.SalesQuotationDetail.LicenseNo = tmpdata.LicenseNo;

                        $scope.beData.SalesQuotationDetail.Goods = tmpdata.Goods;
                        $scope.beData.SalesQuotationDetail.Quantity = tmpdata.Quantity;

                        $scope.beData.SalesQuotationDetail.TotalWT = tmpdata.TotalWT;
                        $scope.beData.SalesQuotationDetail.FreightRate = tmpdata.FreightRate;
                        $scope.beData.SalesQuotationDetail.AdvancePayment = tmpdata.AdvancePayment;

                        $scope.beData.SalesQuotationDetail.OtherRefereces = tmpdata.OtherRefereces;
                        $scope.beData.SalesQuotationDetail.TermsOfPayment = tmpdata.TermsOfPayment;
                        $scope.beData.SalesQuotationDetail.TermsOfDelivery = tmpdata.TermsOfDelivery;
                        $scope.beData.SalesQuotationDetail.Destination = tmpdata.Destination;
                        $scope.beData.SalesQuotationDetail.DeliveryThrough = tmpdata.DeliveryThrough;
                        $scope.beData.SalesQuotationDetail.DeliveryDocNo = tmpdata.DeliveryDocNo;
                    }

                }
            }, function (reason) {
                Swal.fire('Failed' + reason);
            });

        }


    };

    $scope.LoadRefProduct = function () {

        var filterData = [];
        angular.forEach($scope.gridOptions.api.getSelectedNodes(), function (node) {
            filterData.push(node.data);
        })

        var refVType = $scope.beData.RefVoucherType;

        if (filterData.length > 0) {
            $scope.beData.ItemDetailsColl = [];

            angular.forEach(filterData, function (fd) {


                $timeout(function () {
                    $scope.$apply(function () {

                        $scope.beData.ItemDetailsColl.push({
                            ProductId: fd.ProductId,
                            ActualQty: fd.ActualQty,
                            BilledQty: fd.ActualQty,
                            Rate: fd.Rate,
                            Amount: fd.Amount,
                            DiscountPer: fd.DiscountPer,
                            Narration: fd.Narration,
                            Description: fd.Description,
                            RefQty: fd.ActualQty,
                            DeliveryNoteItemAllocationId: refVType == 1 ? fd.ItemAllocationId : null,
                            OrderItemAllocationId: refVType == 2 ? fd.ItemAllocationId : null,
                            DispatchSectionItemAllocationId: refVType == 3 ? fd.ItemAllocationId : null,
                            ReceivedNoteItemAllocationId: refVType == 4 ? fd.ItemAllocationId : null,
                            QuotationItemAllocationId: refVType == 5 ? fd.ItemAllocationId : null
                        });
                    });
                });

            });
        }

        $('#frmSalesQuotationDetailsModel').modal('hide');
    };
    $scope.RefVoucherChange = function (refVType) {

        $scope.RefVoucherNoColl = [];
        $scope.RefItemAllocationColl = [];

        var funName = "getPendingDeliveryNote";

        if (refVType == 1)
            funName = "getPendingDeliveryNote";
        else if (refVType == 2)
            funName = "getPendinSalesOrder";
        else if (refVType == 3)
            funName = "getPendingDispatchSection";
        else if (refVType == 4)
            funName = "getPendinSalesAllotment";
        else if (refVType == 5)
            funName = "getPendinSalesQuotation";
        else
            funName = "getPendingDeliveryNote";

        var agentId = 0;
        if ($scope.beData.AgentId)
            agentId = $scope.beData.AgentId;

        var vDate = null;

        if ($scope.beData.VoucherDateDet) {
            vDate = $filter('date')(new Date($scope.beData.VoucherDateDet.dateAD), 'yyyy-MM-dd');
        } else
            vDate = new Date();

        var para = "ledgerId=" + $scope.beData.PartyLedgerId + "&agentId=" + agentId + "&voucherDate=" + vDate;
        $http({
            method: 'GET',
            url: base_url + "Inventory/Transaction/" + funName + "?" + para,
            dataType: "json"
        }).then(function (res1) {
            if (res1.data.IsSuccess && res1.data.Data) {
                $scope.RefItemAllocationColl = res1.data.Data;
                $scope.gridOptions.api.setRowData($scope.RefItemAllocationColl);

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

                //$('#cboRefVoucherNo').select2({
                //    placeholder: 'select ref voucher',
                //    allowClear: true,
                //    openOnEnter: true,
                //    width: '100%',
                //    multiple: true,
                //    data: $scope.RefVoucherNoColl
                //});
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

    };

    //AditionalCostOnTheBasisOf {
    //    Quantity=0,
    //    Amount=1
    //}

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

    $scope.CalculateTotalAndSubTotal = function () {

        var subTotal = 0;
        var totalQty = 0;
        angular.forEach($scope.beData.ItemDetailsColl, function (item) {
            subTotal += item.Amount;
            totalQty += item.ActualQty;
        });

        var runningTotal = subTotal;
        var aditionalCostAmt = 0;
        if ($scope.beData.AditionalCostColl) {
            angular.forEach($scope.beData.AditionalCostColl, function (acc) {
                if (acc.Rate != 0) {
                    if (acc.AditionCostOnBasisOf == 0) {
                        var exciseAbleQty = 0;
                        if (acc.TypeOfDutyTax == 3) {
                            angular.forEach($scope.beData.ItemDetailsColl, function (item) {
                                if (item.productDetail) {
                                    if (item.ExDutyUnitId && item.ExDutyUnitId > 0) {
                                        if (item.UnitId == item.ExDutyUnitId)
                                            exciseAbleQty += item.ActualQty;
                                        else if (item.ALUnitId1 && item.ALUnitId1 == item.ExDutyUnitId)
                                            exciseAbleQty += item.ALValue1;
                                        else if (item.ALUnitId2 && item.ALUnitId2 == item.ExDutyUnitId)
                                            exciseAbleQty += item.ALValue1;
                                    } else
                                        exciseAbleQty += item.ActualQty;

                                } else
                                    exciseAbleQty += item.ActualQty;
                            });
                            acc.AccessableValue = exciseAbleQty;
                            acc.Amount = exciseAbleQty * acc.Rate / 100;

                        } else {
                            acc.AccessableValue = totalQty;
                            acc.Amount = totalQty * acc.Rate / 100;
                        }

                    }
                    else {
                        acc.runningTotal = totalQty;
                        acc.Amount = runningTotal * acc.Rate / 100;
                    }
                }

                if (acc.Sign == '+') {
                    aditionalCostAmt += acc.Amount;
                    runningTotal += acc.Amount;
                } else {
                    aditionalCostAmt += acc.Amount;
                    runningTotal += acc.Amount;
                }
            });
        }
        $scope.beData.SubTotal = subTotal;
        $scope.beData.TotalAmount = runningTotal;
    };

    $scope.ChangeItemRowValue = function (itemDet, col) {

        var amt = 0, qty = 0, rate = 0, disAmt = 0, disPer = 0, schAmt = 0, schPer = 0;

        var aQty = 0;
        if (itemDet.ActualQty)
            aQty = itemDet.ActualQty;

        if ($scope.HideShow.BilledQty == true) {
            if (itemDet.ActualQty)
                qty = itemDet.ActualQty;
        } else {
            if (itemDet.BilledQty)
                qty = itemDet.BilledQty;
        }

        if (itemDet.Rate)
            rate = itemDet.Rate;

        if (itemDet.productDetail) {
            if (itemDet.productDetail.ClosingQty < qty)
                itemDet.IsNegativeQty = true;
            else if (itemDet.RefQty && itemDet.RefQty < qty)
                itemDet.IsNegativeQty = true;
            else
                itemDet.IsNegativeQty = false;


        }
        if (itemDet.Amount && col == "amt") {

        }

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
        }


        itemDet.Amount = amt - disAmt;

        if (col == "disAmt")
            itemDet.DiscountPer = disPer;
        else if (col == "disPer" || col == "product")
            itemDet.DiscountAmt = disAmt;


        if ($scope.HideShow.BilledQty == true) {
            itemDet.BilledQty = aQty;
        }

        if (itemDet.productDetail) {
            if (itemDet.productDetail.AlternetUnitColl) {
                var alternetUnit1 = null, alternetUnit2 = null;

                if (itemDet.productDetail.AlternetUnitColl.length > 0) {
                    alternetUnit1 = itemDet.productDetail.AlternetUnitColl[0];
                    itemDet.ALValue1 = (alternetUnit1.AlterNetUnitValue * aQty) / alternetUnit1.BaseUnitValue;
                    itemDet.ALUnitId1 = alternetUnit1.AlterNetUnitId;
                }

                if (itemDet.productDetail.AlternetUnitColl.length > 1) {
                    alternetUnit2 = itemDet.productDetail.AlternetUnitColl[1];
                    itemDet.ALValue2 = (alternetUnit2.AlterNetUnitValue * aQty) / alternetUnit2.BaseUnitValue;
                    itemDet.ALUnitId2 = alternetUnit2.AlterNetUnitId;
                }
            }
        }

        itemDet.Formula = ($scope.ItemFormula ? angular.copy($scope.ItemFormula) : null);
          
        GlobalServices.getItemUDFFormula(itemDet, $scope.beData.ItemDetailsColl, $scope.beData,col);
        GlobalServices.getItemUDFFormulaQry(itemDet, $scope.beData.ItemDetailsColl, $scope.beData, col);

        $scope.CalculateTotalAndSubTotal();
    }

    $scope.SaveSalesQuotation = function () {

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
                        url: base_url + "Inventory/Transaction/SaveUpdateProductionOrder",
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
    $scope.SetData = function (tran) {

        $scope.loadingstatus = 'stop';
        hidePleaseWait();

        $scope.lastPartyLedgerId = tran.PartyLedgerId;

        if ($scope.GodownColl.length > 0 && (!$scope.beData.GodownId || $scope.beData.GodownId == 0)) {
            $scope.beData.GodownId = $scope.GodownColl[0].GodownId;
        }
        tran.GodownId = $scope.beData.GodownId;

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
        $scope.beData.VoucherDateAD_TMP = new Date(tran.VoucherDate);
        $scope.beData.RefNo = tran.RefNo;
        $scope.beData.AutoManualNo = tran.AutoManualNo;

        $scope.beData.CostCenterId = tran.CostCenterId;
        $scope.beData.ProductBrandId = tran.ProductBrandId;
        $scope.beData.SourceGodownId = tran.SourceGodownId;
        $scope.beData.TargetGodownId = tran.TargetGodownId;
        $scope.beData.DocumentColl = tran.DocumentColl;
        $scope.beData.Model = tran.Model;
        $scope.beData.ChassisNo = tran.ChassisNo;
        $scope.beData.HoursRun = tran.HoursRun;
        $scope.beData.KMRun = tran.KMRun;
        $scope.beData.DateOfSale_TMP = (tran.DateOfSale ? new Date(tran.DateOfSale) : null);
        $scope.beData.FailureDate_TMP = (tran.FailureDate ? new Date(tran.FailureDate_TMP) : null);
        $scope.beData.FailureDetails = tran.FailureDetails;
        $scope.beData.Remarks = tran.Remarks;
        $scope.beData.JobCardNo = tran.JobCardNo;
        $scope.beData.IsBreakDownParts = tran.IsBreakDownParts;

        $scope.beData.BOMTranId = tran.BOMTranId;
        $scope.beData.ProductId = tran.ProductId;
        $scope.beData.GodownId = tran.GodownId;
        $scope.beData.Quantity = tran.Quantity;
        $scope.beData.UnitId = tran.UnitId;
        $scope.beData.FQty = tran.FQty;
        $scope.beData.PQty = tran.PQty;

        $scope.beData.ItemDetailsColl = [];

        var voucherUdfColl = [];
        if ($scope.SelectedVoucher.VoucherUDFColl && $scope.SelectedVoucher.VoucherUDFColl.length > 0) {
            angular.forEach($scope.SelectedVoucher.VoucherUDFColl, function (udf) {
                var ud = {
                    SNo: udf.SNo,
                    Name: udf.Label,
                    Value: udf.DefaultValue,
                    FieldNo: udf.SNo,
                    DisplayName: udf.Label,
                    FieldType: udf.FieldType,
                    IsMandatory: udf.IsMandatory,
                    Length: 100,
                    SelectOptions: udf.DropDownList
                };
                voucherUdfColl.push(ud);
            });
        }
        $scope.beData.UDFFeildsColl = voucherUdfColl;
        if (tran.Attributes && tran.Attributes.length > 0) {
            var udfFieldsColl = mx(JSON.parse(tran.Attributes));
            angular.forEach($scope.beData.UDFFeildsColl, function (udd) {
                var findU = udfFieldsColl.firstOrDefault(p1 => p1.SNo == udd.SNo);
                if (findU)
                    udd.UDFValue = findU.Value;
            });
        }


        var udfColl = [];
        if ($scope.SelectedVoucher.VoucherProductUDFColl && $scope.SelectedVoucher.VoucherProductUDFColl.length > 0) {
            angular.forEach($scope.SelectedVoucher.VoucherProductUDFColl, function (udf) {
                var ud = {
                    SNo: udf.SNo,
                    Name: udf.Label,
                    Value: udf.DefaultValue,
                    FieldNo: udf.SNo,
                    DisplayName: udf.Label,
                    FieldType: udf.FieldType,
                    IsMandatory: udf.IsMandatory,
                    Length: 100,
                    SelectOptions: udf.DropDownList
                };
                udfColl.push(ud);
            });
        }

        angular.forEach(tran.ItemDetailsColl, function (itemAD) {

            itemAD.RowType = itemAD.RowTypes;
           // itemAD.RowType = 'P';
            itemAD.UDFFeildsColl = udfColl;
            itemAD.RefQty = itemAD.ActualQty;
            if (itemAD.Attributes && itemAD.Attributes.length > 0) {

                var udfFieldsColl = mx(JSON.parse(itemAD.Attributes));
                angular.forEach(itemAD.UDFFeildsColl, function (udd) {
                    var findU = udfFieldsColl.firstOrDefault(p1 => p1.SNo == udd.SNo);
                    if (findU)
                        udd.UDFValue = findU.Value;
                });
            }

            if ($scope.SelectedVoucher.Product && $scope.SelectedVoucher.Product.VoucherWiseDecimalPlaces == true) {
                itemAD.QtyDecimal = $scope.SelectedVoucher.Product.QtyNoOfDecimalPlaces;
                itemAD.RateDecimal = $scope.SelectedVoucher.Product.RateNoOfDecimalPlaces;
                itemAD.AmountDecimal = $scope.SelectedVoucher.Product.AmountNoOfDecimalPlaces;
            } else {
                var findUnit = $scope.UnitColl.firstOrDefault(p1 => p1.UnitId == itemAD.UnitId);
                if (findUnit) {
                    itemAD.QtyDecimal = findUnit.NoOfDecimalPlaces;
                    itemAD.RateDecimal = findUnit.RateNoOfDecimalPlaces;
                    itemAD.AmountDecimal = findUnit.AmountNoOfDecimalPlaces;
                }
            }

            itemAD.TranUnitId = itemAD.UnitId;
            itemAD.TranUnitQty = itemAD.ActualQty;
              
            $scope.beData.ItemDetailsColl.push(itemAD);
        });

     

    };
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
            //PartyLedgerId: $scope.beData.PartyLedgerId,
            //SalesLedgerId: ($scope.beData.SalesLedgerId ? $scope.beData.SalesLedgerId : 0),
            PartyLedgerId: 0,
            SalesLedgerId: 0,
            TotalAmount: $scope.beData.TotalAmount,
            AgentId: $scope.beData.AgentId ? $scope.beData.AgentId : 0,
            PartyCostCenter: $scope.beData.PartyCostCenter ? $scope.beData.PartyCostCenter : 0,
            TranCostCenter: $scope.beData.TranCostCenter ? $scope.beData.TranCostCenter : 0,
            EntryDate: eDate,
            BranchId: ($scope.beData.BranchId ? $scope.beData.BranchId : 0),
            IsAbbInvoice: false,
            ItemDetailsColl: [],
            GodownId: $scope.beData.GodownId,
            CostCenterId: $scope.beData.CostCenterId,
            ProductBrandId: $scope.beData.ProductBrandId,
            GodownId: $scope.beData.GodownId,
            ProductId: $scope.beData.ProductId,
            Quantity: $scope.beData.Quantity,
            UnitId:$scope.beData.UnitId,
            DocumentColl: $scope.beData.DocumentColl,
            Model: $scope.beData.Model,
            ChassisNo: $scope.beData.ChassisNo,
            HoursRun: $scope.beData.HoursRun,
            KMRun: $scope.beData.KMRun,            
            Remarks: $scope.beData.Remarks,
            JobCardNo: $scope.beData.JobCardNo,
            IsBreakDownParts: $scope.beData.IsBreakDownParts,
            BOMTranId: $scope.beData.BOMTranId,
        };

        angular.forEach($scope.beData.ItemDetailsColl, function (itemDet) {
            if (itemDet.ProductId && itemDet.ProductId > 0) {
                var itemAllocation = {
                    RowTypes:itemDet.RowType,
                    LedgerId:itemDet.LedgerId,
                    ProductId: itemDet.ProductId,
                    ActualQty: itemDet.ActualQty,
                    BilledQty: itemDet.BilledQty,
                    BaseRatio: itemDet.BaseRatio,
                    PlanQty: itemDet.PlanQty,
                    AvailableQty: itemDet.AvailableQty,
                    RequiredQty:itemDet.RequiredQty,
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
                    DeliveryNoteItemAllocationId: itemDet.DeliveryNoteItemAllocationId ? itemDet.DeliveryNoteItemAllocationId : 0,
                    OrderItemAllocationId: itemDet.OrderItemAllocationId ? itemDet.OrderItemAllocationId : 0,
                    DispatchSectionItemAllocationId: itemDet.DispatchSectionItemAllocationId ? itemDet.DispatchSectionItemAllocationId : 0,
                    ReceivedNoteItemAllocationId: itemDet.ReceivedNoteItemAllocationId ? itemDet.ReceivedNoteItemAllocationId : 0,
                    QuotationItemAllocationId: itemDet.QuotationItemAllocationId ? itemDet.QuotationItemAllocationId : 0,
                    BundleId: 0,
                    BundleQty: 0,
                    Description: itemDet.Description ? itemDet.Description : '',
                    LedgerId: itemDet.ProductLedgerId ? itemDet.ProductLedgerId : null,
                    ItemDetailsColl: [],                    
                    CostCenterId: $scope.beData.CostCenterId,
                    ProductBrandId: $scope.beData.ProductBrandId,
                    GodownId: tmpSales.GodownId                    
                };

                tmpSales.ItemDetailsColl.push(itemAllocation);
            }
        });


        return tmpSales;
    };

    $scope.getVoucherNoOnly = function () {

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


                                $scope.SelectedVoucher.ActiveUDF = false;

                                if ($scope.SelectedVoucher.VoucherUDFColl && $scope.SelectedVoucher.VoucherUDFColl.length > 0) {
                                    $scope.beData.UDFFeildsColl = [];
                                    $scope.SelectedVoucher.ActiveUDF = true;
                                    angular.forEach($scope.SelectedVoucher.VoucherUDFColl, function (udf) {
                                        var ud = {
                                            SNo: udf.SNo,
                                            Name: udf.Label,
                                            Value: udf.DefaultValue,
                                            FieldNo: udf.SNo,
                                            DisplayName: udf.Label,
                                            FieldType: udf.FieldType,
                                            IsMandatory: udf.IsMandatory,
                                            Length: 100,
                                            SelectOptions: udf.DropDownList,
                                            FieldAfter: udf.FieldAfter,
                                            NameId: udf.Name,
                                            Source: udf.Source,
                                            Formula: udf.Formula,
                                            ColWidth: udf.ColWidth,
                                            UDFValue: udf.DefaultValue,
											RefTable: udf.RefTable,
                    RefColumn: udf.RefColumn,
                    TextColumn: udf.TextColumn,
                                        };
                                        $scope.beData.UDFFeildsColl.push(ud);
                                    });
                                }


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

                                if ($scope.SelectedVoucher.VoucherProductUDFColl && $scope.SelectedVoucher.VoucherProductUDFColl.length > 0) {
                                    angular.forEach($scope.beData.ItemDetailsColl, function (det) {
                                        det.UDFFeildsColl = [];
                                        angular.forEach($scope.SelectedVoucher.VoucherProductUDFColl, function (udf) {

                                            var ud = {
                                                SNo: udf.SNo,
                                                Name: udf.Label,
                                                Value: udf.DefaultValue,
                                                FieldNo: udf.SNo,
                                                DisplayName: udf.Label,
                                                FieldType: udf.FieldType,
                                                IsMandatory: udf.IsMandatory,
                                                Length: 100,
                                                SelectOptions: udf.DropDownList,
                                                FieldAfter: udf.FieldAfter,
                                                NameId: udf.Name,
                                                Source: udf.Source,
                                                Formula: udf.Formula,
                                                ColWidth: udf.ColWidth,
                                                UDFValue: udf.DefaultValue,
												RefTable: udf.RefTable,
                    RefColumn: udf.RefColumn,
                    TextColumn: udf.TextColumn,
                                            };

                                            det.UDFFeildsColl.push(ud);
                                        });
                                    });
                                } else {
                                    angular.forEach($scope.beData.ItemDetailsColl, function (det) {
                                        det.UDFFeildsColl = [];
                                    });
                                }

                                if ($scope.SelectedVoucher.AditionalChargeColl) {
                                    angular.forEach($scope.SelectedVoucher.AditionalChargeColl, function (acc) {
                                        $scope.beData.AditionalCostColl.push({
                                            LedgerId: acc.LedgerId,
                                            Name: acc.LedgerName + (acc.Rate != 0 ? ' @ ' + acc.Rate : ''),
                                            Sign: acc.Sign == true ? '+' : '-',
                                            Amount: acc.Amount,
                                            Rate: acc.Rate,
                                            CanEditAmount: acc.Rate != 0 ? false : true,
                                            AditionCostOnBasisOf: acc.AditionCostOnBasisOf,
                                            TypeOfDutyTax: acc.TypeOfDutyTax
                                        })
                                    })
                                }


                                $scope.loadingstatus = 'running';
                                showPleaseWait();
                                var schemePara = {
                                    VoucherId: $scope.SelectedVoucher.VoucherId,
                                    VoucherDate: ($scope.beData.VoucherDateDet ? $filter('date')($scope.beData.VoucherDateDet.dateAD, 'yyyy-MM-dd') : new Date()),
                                };
                                $http({
                                    method: 'POST',
                                    url: base_url + "Inventory/Transaction/getBOMForProduction",
                                    dataType: "json",
                                    data: JSON.stringify(schemePara)
                                }).then(function (resLD) {

                                    $scope.loadingstatus = 'stop';
                                    hidePleaseWait();
                                    if (resLD.data.IsSuccess && resLD.data.Data) {
                                        $scope.BOMColl = resLD.data.Data;
                                    }
                                }, function (reason) {
                                    alert('Failed' + reason);
                                });


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
    $("#txtBarcode").keyup(function (event) {
        if (event.keyCode === 13) {
            // $scope.barcodeScanned($scope.beData.ProductBarCode);
        }
    });
    $("#txtBarcode").keydown(function (event) {
        if (event.keyCode === 13 && event.ctrlKey == true) {
            $scope.barcodeScanned($scope.beData.ProductBarCode);
        }
    });
    $scope.CurBOM = {};
    $scope.BOMChange = function () {
        $scope.CurBOM = {};
        if ($scope.beData.BOMTranId > 0) {
            var para = {
                tranId: $scope.beData.BOMTranId
            };
            $http({
                method: 'POST',
                url: base_url + "Inventory/Creation/GetBomById",
                dataType: "json",
                data: JSON.stringify(para)
            }).then(function (res) {
                $timeout(function () {
                    if (res.data.IsSuccess && res.data.Data) {
                        $scope.CurBOM = res.data.Data;

                        if ($scope.beData.TranId > 0) {

                        } else {
                            $scope.beData.ProductId = res.data.Data.ProductId;
                            $scope.beData.UnitId = res.data.Data.UnitId;
                            $scope.beData.Quantity = res.data.Data.Qty;
                            var findUnit = mx($scope.UnitColl).firstOrDefault(p1 => p1.UnitId == res.data.Data.UnitId);
                            if (findUnit)
                                $scope.beData.BaseUnit = findUnit.Name;
                            else
                                $scope.beData.BaseUnit = '';

                            var bomDataColl = res.data.Data.ItemDetailsColl;

                            if (bomDataColl && bomDataColl.length > 0) {

                                var ind = -1;
                                var len = $scope.beData.ItemDetailsColl.length;

                                var lastItemInd = -1;
                                bomDataColl.forEach(function (bom) {
                                    if (bom.RowType == 1) {
                                        $scope.beData.ItemDetailsColl.splice(lastItemInd + 1, 0, {
                                            RowType: bom.RowType,
                                            IsRefItem: true,
                                            ProductId: bom.ProductId,
                                            productDetail: null,
                                            ActualQty: bom.Qty,
                                            BilledQty: bom.Qty,
                                            PlanQty: bom.Qty,
                                            BaseRatio: bom.Qty / $scope.beData.Quantity,
                                            AvailableQty: 0,
                                            RequiredQty: 0,
                                            FreeQty: 0,
                                            Rate: bom.Rate,
                                            DiscountPer: 0,
                                            DiscountAmt: 0,
                                            SchameAmt: 0,
                                            SchamePer: 0,
                                            Amount: bom.Amount,
                                            Description: bom.Description,
                                            QtyPoint: 0,
                                            UnitId: null,
                                            CanEditRate: false,
                                            ALValue1: 0,
                                            ALValue2: 0,
                                            ALUnitId1: null,
                                            ALUnitId2: null,
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
                                            GodownId: $scope.beData.GodownId
                                        });
                                        lastItemInd++;
                                    }
                                });

                                var ledColl = mx(bomDataColl).where(p1 => p1.RowType == 2);
                                if (ledColl) {
                                    angular.forEach(ledColl, function (ledC) {
                                        if (ledC) {
                                            if (ledC.LedgerId > 0) {

                                                angular.forEach($scope.beData.ItemDetailsColl, function (itemDet) {
                                                    if (itemDet) {
                                                        if (itemDet.RowType == 'L') {
                                                            if (itemDet.LedgerId == ledC.LedgerId) {
                                                                itemDet.Rate = ledC.Rate;
                                                                itemDet.Amount = ledC.Amount;
                                                            }
                                                        }
                                                    }
                                                });
                                            }
                                        }
                                    });
                                }
                            }
                        }
                        
                    } else
                        Swal.fire(res.data.ResponseMSG);
                });
            }, function (reason) {
                Swal.fire('Failed' + reason);
            });
        }
    };

    $scope.ChangeOrderQty = function () {
        if (!$scope.CurBOM || !$scope.CurBOM.ProductId) {
            Swal.fire('1st select b.o.m.')
            return;
        }

        var qty = $scope.beData.Quantity;
        var bom =angular.copy($scope.CurBOM);
        var bomDataColl = bom.ItemDetailsColl;
        if (bomDataColl) {
            bomDataColl.forEach(function (item) {
                if (item.RowType == 1) {
                    item.BaseRatio = (item.Qty / bom.Qty);
                    item.Qty = (item.Qty / bom.Qty) * qty;
                }                
            });
        }

        var itemQry = mx(bomDataColl);
        angular.forEach($scope.beData.ItemDetailsColl, function (itemDet) {
            var findItem = itemQry.firstOrDefault(p1 => p1.ProductId == itemDet.ProductId);
            if (findItem) {
                itemDet.PlanQty = findItem.Qty;
                itemDet.BaseRatio = findItem.BaseRatio;
            } else {
                itemDet.PlanQty = 0;
                itemDet.BaseRatio = 0;
            }

            var reqQty = isEmptyAmt(itemDet.PlanQty) - isEmptyAmt(itemDet.AvailableQty);
            itemDet.RequiredQty = reqQty;
        });
    }

    $scope.barcodeScanned = function (barcode) {

        if (!barcode || barcode.length == 0)
            return;

        $scope.loadingstatus = 'running';
        showPleaseWait();
        var vid = $scope.SelectedVoucher.VoucherId;
        var queryParameters =
        {
            Top: 1,
            ColName: "P.Code",
            Operator: "like",
            OrderByCol: "P.Code",
            ColValue: barcode,
            VoucherId: vid
        };
        $http({
            method: 'GET',
            url: base_url + "Global/GetAllProduct?" + param(queryParameters),
            dataType: "json"
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data && res.data.Data.length > 0) {

                $scope.beData.ProductBarCode = '';

                var findItem = res.data.Data[0];
                var alreadyExists = false;
                var indP = -1;
                var totalPLine = 0;
                angular.forEach($scope.beData.ItemDetailsColl, function (idet) {
                    indP++;

                    if (idet.RowType == 'P' && idet.ProductId > 0) {
                        if (idet.ProductId == findItem.ProductId) {
                            idet.ActualQty = idet.ActualQty + 1;
                            idet.BilledQty = idet.BilledQty + 1;
                            alreadyExists = true;
                            $scope.ChangeItemRowValue(idet, 'aQty');
                        }
                    } else if (idet.RowType == 'P') {
                        $scope.beData.ItemDetailsColl.splice(indP, 1);
                    }
                });

                angular.forEach($scope.beData.ItemDetailsColl, function (idet) {
                    if (idet.RowType == 'P')
                        totalPLine++;
                });

                if (alreadyExists == false) {

                    $timeout(function () {
                        var refItem = {
                            RowType: 'P',
                            ProductId: findItem.ProductId,
                            productDetail: null,
                            ActualQty: 1,
                            BilledQty: 1,
                            FreeQty: 0,
                            Rate: 0,
                            DiscountPer: 0,
                            DiscountAmt: 0,
                            SchameAmt: 0,
                            SchamePer: 0,
                            Amount: 0,
                            Description: '',
                            QtyPoint: 0,
                            UnitId: findItem.UnitId,
                            CanEditRate: false,
                            ALValue1: 0,
                            ALValue2: 0,
                            ALUnitId1: null,
                            ALUnitId2: null,
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
                            GodownId: $scope.beData.GodownId,
                            Narration: '',
                            RefQty: 0,
                            InvoiceItemAllocationId: null
                        };

                        $scope.beData.ItemDetailsColl.insert(totalPLine, refItem);
                    });
                }
            } else
                Swal.fire('Product Not Found');

        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

    };
    $scope.ClearData = function () {
        var sV = $scope.SelectedVoucher;
        var sC = $scope.SelectedCostClass;

        $scope.SelectedVoucher = null;
        $scope.SelectedCostClass = null;
        $scope.RefItemAllocationColl = [];
        $scope.CurBOM = {};
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
            ItemDetailsColl: [],
            AditionalCostColl: [],
            AttechFiles: [],
            SubTotal: 0,
            Total: 0,
            Narration: '',
            VoucherDate: new Date(),
            SalesQuotationDetail: {},
            SourceGodownId: 0,
            TargetGodownId: 0,
            UDFFeildsColl: [],
			DocumentColl: [],
        };

        $scope.beData.ItemDetailsColl.push(
            {
                RowType:1,
                ProductId: 0,
                productDetail: null,
                ActualQty: 0,
                BilledQty: 0,
                FreeQty: 0,
                PlanQty: 0,
                AvailableQty: 0,
                RequiredQty:0,
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
                SourceGodownId: 0,
                TargetGodownId: 0,
                UDFFeildsColl: [],

            }
        );


        if ($scope.GodownColl.length == 1) {
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

        $timeout(function () {
            $scope.getVoucherNo();
        });
        
    };

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
    $scope.PrintVoucher = function (tranId, vid) {
        $scope.lastTranId = tranId;
        $scope.lastVoucherId = vid;
        $scope.Print();
    }
    $scope.GetTransactionById = function (tran) {
        if (tran.TranId && tran.TranId > 0) {

            $scope.loadingstatus = "running";
            showPleaseWait();

            var para = {
                tranId: tran.TranId
            };
            $scope.ClearData();
            $timeout(function () {
                $http({
                    method: 'POST',
                    url: base_url + "Inventory/Transaction/GetProductionOrderById",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    $timeout(function () {
                        if (res.data.IsSuccess && res.data.Data) {
                            var tran = res.data.Data;

                            $scope.SetData(tran);
                            hidePleaseWait();
                            $scope.loadingstatus = "stop";
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
            });

        }
    }
    $scope.RemoveAttachment = function (fId, ind) {

        if (fId == 1) {
            $scope.beData.DocumentColl.splice(ind, 1);
        }
        else if (fId == 2) {
            $scope.beData.AttechFiles.splice(ind, 1);
        }

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
            $scope.$apply($scope.SaveSalesQuotation);
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