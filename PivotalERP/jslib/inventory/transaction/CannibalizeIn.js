app.controller('CannibalizeIn', function ($scope, $http, $timeout, $filter, $compile, GlobalServices, $document) {
    $scope.Title = 'CannibalizeIn';
    var glSrv = GlobalServices;
    LoadData();

    $scope.sideBarData = [];

    function Numberformat(val) {
        return $filter('number')(val, 2);
    }


    function GetDateStr(ny, nm, nd) {

        return ny.toString() + '-' + nm.toString().padStart(2, '0') + '-' + nd.toString().padStart(2, '0')
    }

    $scope.lastTranId = 0;
    function LoadData() {
		
		 $scope.DefaultKeyValues_JSON = null;
        if (DefaultKeyValues && DefaultKeyValues.length > 0) {
            $scope.DefaultKeyValues_JSON = JSON.parse(decodeURIComponent(DefaultKeyValues));           
        }
		
        $('.select2').select2();
        $scope.confirmMSG = glSrv.getConfirmMSG();
		$scope.VoucherSearchOptions = [{ text: 'Godown', value: 'ADS.Godown', searchType: 'text' }, { text: 'VoucherNo', value: 'ADS.VoucherNo', searchType: 'Number' }, { text: 'RefNo', value: 'TS.[No]', searchType: 'text' }, { text: 'Remarks', value: 'TS.Remarks', searchType: 'text' }, { text: 'ServiceEngineer', value: 'TS.ServiceEngineer', searchType: 'text' }, { text: 'VoucherDate', value: 'TS.VoucherDate', searchType: 'date' },{ text: 'Voucher', value: 'V.VoucherName', searchType: 'text' }, { text: 'CostClass', value: 'CC.Name', searchType: 'text' }, ];
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

        }

        $scope.beData =
        {
            VoucherId: 0,
            TranId: 0,
            AutoManualNo: '',
            AutoVoucherNo: 0,
            GodownId: 0,
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
            SalesQuotationDetail: {},
            ServiceEnginer: '',
            Remarks: '',

            From_ChassisNo: '',
            From_EngineNo: '',
            From_Model: '',
            From_RegdNo: '',
            From_VinNo: '',

            To_ChassisNo: '',
            To_EngineNo: '',
            To_Model: '',
            To_RegdNo: '',
            To_VinNo: '',
			DocumentColl: [],
        };


        $scope.beData.ItemDetailsColl.push(
            {
                RowType: 'P',
                ProductId: 0,
                productDetail: null,
                AmountCalc: '',
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
                AmountDecimal: 2,
                BatchColl: [],
                FixedProductColl: [],
                EXPDate: new Date(),
            });
        $('.hideSideBar').on('focus', function (e) {
            $('#sidebarzz').removeClass();
            $('#sidebarzz').addClass('order-last float-right active');
        })

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

        if (VoucherType || VoucherType>0) {

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

            //$http({
            //    method: 'GET',
            //    url: base_url + "Setup/Security/GetSalesFeatures",
            //    dataType: "json"
            //}).then(function (res1) {
            //    if (res1.data.IsSuccess && res1.data.Data) {
            //        $scope.SalesFeatures = res1.data.Data;

            //        $timeout(function () {
            //            $scope.$apply(function () {
            //                if ($scope.SalesFeatures.ProductWiseSalesLedger == true)
            //                    $scope.HideShow.SalesLedger = true;
            //                else
            //                    $scope.HideShow.SalesLedger = false;
            //            });
            //        });
            //    }
            //}, function (reason) {
            //    Swal.fire('Failed' + reason);
            //});

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

        $scope.gridOptions = {
            //angularCompileRows: true,
            // a default column definition with properties that get applied to every column
            defaultColDef: {
                filter: true,
                resizable: true,
                sortable: true,
                // set every column width
                width: 100,

            },
            enableSorting: true,
            multiSortKey: 'ctrl',
            enableColResize: true,
            overlayLoadingTemplate: "Loading..",
            overlayNoRowsTemplate: "No Records found",
            rowSelection: 'multiple',
            columnDefs: columnDefs,
            rowData: null,
            filter: true,
            //suppressHorizontalScroll: true,
            alignedGrids: [],
            enableFilter: true

        };

        // lookup the container we want the Grid to use
        $scope.eGridDiv = document.querySelector('#datatable');

        // create the grid passing in the div to use together with the columns & data we want to use
        new agGrid.Grid($scope.eGridDiv, $scope.gridOptions);

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
                $scope.beData.ItemDetailsColl.push({
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

    }

    $scope.delRowFromItemDetails = function (ind) {
        if ($scope.beData.ItemDetailsColl) {
            if ($scope.beData.ItemDetailsColl.length > 1) {
                $scope.beData.ItemDetailsColl.splice(ind, 1);
            }
        }
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

    $scope.ProductSelectionChange = function (itemDet, ind) {
        $scope.sideBarData = itemDet.sideBarData;

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
            itemDet.TranUnitId = itemDet.productDetail.SalesUnitId;
            itemDet.CanEditRate = itemDet.productDetail.CanEditRate;
  itemDet.ProductName = itemDet.productDetail.Name;
            itemDet.ProductCode = itemDet.productDetail.Code;
			
		itemDet.OnActionUDF = false;
            if (itemDet.UDFFeildsColl) {
                itemDet.UDFFeildsColl.forEach(function (id) {
                    if (id.FieldAfter == 14) {
                        itemDet.OnActionUDF = true;
                    }
                });
            }
			
            var refStockItem = false;
            if (itemDet.DeliveryNoteItemAllocationId > 0 || itemDet.OrderItemAllocationId > 0 || itemDet.DispatchSectionItemAllocationId > 0
                || itemDet.ReceivedNoteItemAllocationId > 0 || itemDet.ItemAllocationId > 0 || itemDet.DispatchSectionItemAllocationId > 0 || itemDet.ReceivedNoteItemAllocationId > 0 || itemDet.QuotationItemAllocationId > 0) {
                refStockItem = true;
            }

            if (isModify == false && refStockItem == false) {
                itemDet.Rate = itemDet.productDetail.SalesRate;
                itemDet.ProductLedgerId = itemDet.productDetail.SalesLedgerId;
                itemDet.LedgerId = itemDet.productDetail.SalesLedgerId;
            } else {

                if (!itemDet.ProductLedgerId || itemDet.ProductLedgerId == 0)
                    itemDet.ProductLedgerId = itemDet.productDetail.SalesLedgerId;

                if (!itemDet.LedgerId || itemDet.LedgerId == 0)
                    itemDet.LedgerId = itemDet.productDetail.SalesLedgerId;
            }

            var rQty = 0;
            if ($scope.beData.RefVoucherType == 1 || $scope.beData.RefVoucherType == 4)
                rQty = (itemDet.RefQty > 0 ? itemDet.RefQty : 0);

            itemDet.ClosingQty = $filter('formatNumber')((itemDet.productDetail.ClosingQty + rQty)) + ' ' + itemDet.productDetail.BaseUnit;
            itemDet.UnitId = itemDet.productDetail.BaseUnitId;
            itemDet.UnitName = itemDet.productDetail.BaseUnit;
            itemDet.RateOf = itemDet.productDetail.RateOf;
            itemDet.LossRate = itemDet.productDetail.LossRate;
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

            if ($scope.SelectedVoucher.IsAbbInvoice == true && itemDet.productDetail.IsTaxable == true) {
                itemDet.Rate = itemDet.Rate + (itemDet.Rate * 13 / 100);
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

            $timeout(function () {
                if (itemDet.productDetail.BatchWiseColl && itemDet.productDetail.BatchWiseColl.length > 0) {
                    itemDet.Batch = itemDet.productDetail.BatchWiseColl[0].BatchNo;
                    $scope.ChangeBatch(itemDet);
                }
            });

            var itemC = mx($scope.beData.ItemDetailsColl).count();
            if (ind == (itemC - 1))
                $scope.AddRowInItemDetails(ind);

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

        $scope.CalculateTotalAndSubTotal();
    }

    $scope.SaveCannibalizeIn = function () {

        if ($scope.IsValidData() == true) {
            
            $scope.CalculateTotalAndSubTotal();

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

                    $timeout(function () {

                        var filesColl = $scope.beData.AttechFiles;
                        $scope.beData.AttechFiles = [];

                        $http({
                            method: 'POST',
                            url: base_url + "Inventory/Transaction/SaveUpdateCannibalizeIn",
                            headers: { 'Content-Type': undefined },

                            transformRequest: function (data) {

                                var formData = new FormData();
                                formData.append("jsonData", angular.toJson(data.jsonData));

                                //if (data.files) {
                                //    for (var i = 0; i < data.files.length; i++) {
                                //        formData.append("file" + i, data.files[i]);
                                //    }
                                //}

                                var find = 0;
                                angular.forEach($scope.beData.DocumentColl, function (dc) {
                                    if (dc.File) {
                                        formData.append("file" + find, dc.File);
                                    }
                                    find++;
                                });

                                return formData;
                            },
                            data: { jsonData: $scope.GetData(), files: filesColl }
                        }).then(function (res) {

                            $scope.loadingstatus = "stop";
                            hidePleaseWait();

                            if (res.data.IsSuccess == true) {
                                $scope.beData.SaveClear = true;
                                $scope.lastTranId = res.data.Data.RId;
                                $scope.lastVoucherId = $scope.SelectedVoucher.VoucherId;

                                if ($scope.SelectedVoucher.PrintVoucherAfterSaving == true) {
                                    $scope.Print();
                                }
                                $scope.ClearData();
                            }
                            else {
                                Swal.fire(res.data.ResponseMSG);
                            }

                        }, function (errormessage) {
                            hidePleaseWait();
                            //$scope.loadingstatus = "stop";
                            Swal.fire(errormessage);
                        });
                    });

                }
            });

        }


    }

    $scope.GetTransactionById = function (tran) {
        $timeout(function () {

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
                        url: base_url + "Inventory/Transaction/GetCannibalizeInById",
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

    $scope.IsValidData = function () {
        var result = true;

        if ($scope.beData.VoucherId) {
            if ($scope.beData.VoucherId == null || $scope.beData.VoucherId == 0) {
                result = false;
                Swal.fire('Please ! Select Valid Voucher Name');
            }
        } else {
            result = false;
            Swal.fire('Please ! Select Valid Voucher Name');
        }

        if ($scope.beData.CostClassId) {
            if ($scope.beData.CostClassId == null || $scope.beData.CostClassId == 0) {
                result = false;
                Swal.fire('Please ! Select Valid CostClass Name');
            }
        } else {
            result = false;
            Swal.fire('Please ! Select Valid CostClass Name');
        }

        if ($scope.SelectedVoucher.Product.AllowDuplicateProduct == false) {
            var tmpIdColl = [];
            for (var i = 0; i < $scope.beData.ItemDetailsColl.length; i++) {
                var itemDet = $scope.beData.ItemDetailsColl[i];
                if (itemDet && itemDet.ProductId > 0) {
                    if (mx(tmpIdColl).contains(itemDet.ProductId) == true) {
                        result = false;
                        Swal.fire('Duplicate Product Not Allow. (' + itemDet.productDetail.Name + ')');
                        break;
                    } else
                        tmpIdColl.push(itemDet.ProductId);
                }
            }
        }


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
            PartyLedgerId: $scope.beData.PartyLedgerId,
            SalesLedgerId: ($scope.beData.SalesLedgerId ? $scope.beData.SalesLedgerId : 0),
            TotalAmount: $scope.beData.TotalAmount,
            AgentId: $scope.beData.AgentId ? $scope.beData.AgentId : 0,
            PartyCostCenter: $scope.beData.PartyCostCenter ? $scope.beData.PartyCostCenter : 0,
            TranCostCenter: $scope.beData.TranCostCenter ? $scope.beData.TranCostCenter : 0,
            EntryDate: eDate,
            BranchId: ($scope.beData.BranchId ? $scope.beData.BranchId : 0),
            IsAbbInvoice: false,
            ItemDetailsColl: [],
            GodownId: $scope.beData.GodownId,
            SourceGodownId: $scope.beData.SourceGodownId,
            TargetGodownId: $scope.beData.TargetGodownId,
            ServiceEnginer : $scope.beData.ServiceEnginer,
            Remarks : $scope.beData.Remarks,

            From_ChassisNo: $scope.beData.From_ChassisNo,
            From_EngineNo: $scope.beData.From_EngineNo,
            From_Model: $scope.beData.From_Model,
            From_RegdNo: $scope.beData.From_RegdNo,
            From_VinNo: $scope.beData.From_VinNo,

            To_ChassisNo: $scope.beData.To_ChassisNo,
            To_EngineNo: $scope.beData.To_EngineNo,
            To_Model: $scope.beData.To_Model,
            To_RegdNo: $scope.beData.To_RegdNo,
            To_VinNo: $scope.beData.To_VinNo,
            DocumentColl: $scope.beData.DocumentColl,
        };
      

        angular.forEach($scope.beData.ItemDetailsColl, function (itemDet) {
            if (itemDet.ProductId && itemDet.ProductId > 0) {
                var itemAllocation = {
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
                    DeliveryNoteItemAllocationId: itemDet.DeliveryNoteItemAllocationId ? itemDet.DeliveryNoteItemAllocationId : 0,
                    OrderItemAllocationId: itemDet.OrderItemAllocationId ? itemDet.OrderItemAllocationId : 0,
                    DispatchSectionItemAllocationId: itemDet.DispatchSectionItemAllocationId ? itemDet.DispatchSectionItemAllocationId : 0,
                    ReceivedNoteItemAllocationId: itemDet.ReceivedNoteItemAllocationId ? itemDet.ReceivedNoteItemAllocationId : 0,
                    QuotationItemAllocationId: itemDet.QuotationItemAllocationId ? itemDet.QuotationItemAllocationId : 0,
                    BundleId: 0,
                    BundleQty: 0,
                    Description: itemDet.Description ? itemDet.Description : '',
                    LedgerId: itemDet.ProductLedgerId ? itemDet.ProductLedgerId : 0,
                    ItemDetailsColl: [],
                    GodownId: 0,
                    SourceGodownId: tmpSales.SourceGodownId,
                    TargetGodownId: tmpSales.TargetGodownId,
                };

                tmpSales.ItemDetailsColl.push(itemAllocation);
            }
        });


        return tmpSales;
    };

    $scope.SetData = function (tran) {


        $scope.loadingstatus = 'stop';
        hidePleaseWait();

        if ($scope.GodownColl.length > 0 && (!$scope.beData.GodownId || $scope.beData.GodownId == 0)) {
            $scope.beData.GodownId = $scope.GodownColl[0].GodownId;
        }
        tran.GodownId = $scope.beData.GodownId;
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
		
		
        $scope.beData.TranId = tran.TranId;
        $scope.beData.VoucherId = tran.VoucherId;
        $scope.beData.CostClassId = tran.CostClassId;
        $scope.beData.AutoVoucherNo = tran.AutoVoucherNo;
        $scope.beData.CurRate = tran.CurRate;
        $scope.beData.CurrencyId = tran.CurrencyId;
        $scope.beData.ManualVoucherNO = tran.ManualVoucherNO;
        $scope.beData.Narration = tran.Narration;
        $scope.beData.VoucherDate_TMP = new Date(tran.VoucherDate);
        $scope.beData.RefNo = tran.RefNo;
        $scope.beData.AutoManualNo = tran.AutoManualNo;
        $scope.beData.PartyLedgerId = tran.PartyLedgerId;
        $scope.beData.PurchaseLedgerId = (tran.PurchaseLedgerId ? tran.PurchaseLedgerId : 0);
        $scope.beData.TotalAmount = tran.TotalAmount;
        $scope.beData.AgentId = tran.AgentId ? tran.AgentId : 0;
        $scope.beData.PartyCostCenter = tran.PartyCostCenter ? tran.PartyCostCenter : 0;
        $scope.beData.TranCostCenter = tran.TranCostCenter ? tran.TranCostCenter : 0;
        $scope.beData.EntryDate_TMP = new Date(tran.EntryDate);
        $scope.beData.BranchId = (tran.BranchId ? tran.BranchId : 0);
        $scope.beData.IsAbbInvoice = tran.IsAbbInvoice;
        $scope.beData.ItemAllocationColl = tran.ItemAllocationColl;
        $scope.beData.AditionalCostColl = [];
        $scope.beData.PurchaseInvoiceDetail = tran.PurchaseInvoiceDetail;
        $scope.beData.DocumentColl = tran.DocumentColl;
        $scope.beData.GodownId = tran.GodownId;
        $scope.beData.SourceGodownId = tran.SourceGodownId;
        $scope.beData.TargetGodownId = tran.TargetGodownId;

        $scope.beData.ServiceEnginer = tran.ServiceEnginer;
        $scope.beData.Remarks = tran.Remarks;

        $scope.beData.From_ChassisNo = tran.From_ChassisNo;
        $scope.beData.From_EngineNo = tran.From_EngineNo;
        $scope.beData.From_Model = tran.From_Model;
        $scope.beData.From_RegdNo = tran.From_RegdNo;
        $scope.beData.From_VinNo = tran.From_VinNo;

        $scope.beData.To_ChassisNo = tran.To_ChassisNo;
        $scope.beData.To_EngineNo = tran.To_EngineNo;
        $scope.beData.To_Model = tran.To_Model;
        $scope.beData.To_RegdNo = tran.To_RegdNo;
        $scope.beData.To_VinNo = tran.To_VinNo;

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
                    SelectOptions: udf.DropDownList,
                    FieldAfter: udf.FieldAfter,
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
                    SelectOptions: udf.DropDownList,
                    FieldAfter: udf.FieldAfter,
                };
                udfColl.push(ud);
            });
        }


        angular.forEach(tran.ItemDetailsColl, function (itemAD) {

            itemAD.LedgerId = itemAD.LedgerId;
            itemAD.ProductLedgerId = itemAD.LedgerId;
            itemAD.RowType = 'P';
            itemAD.Description = itemAD.Description;
            itemAD.UDFFeildsColl = udfColl;
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
            itemAD.Narration = itemAD.Narration;
            itemAD.SalesProjectionItemAllocationId = itemAD.SalesProjectionItemAllocationId;
            itemAD.IndentItemAllocationId = itemAD.IndentItemAllocationId;
            itemAD.QuotationItemAllocationId = itemAD.QuotationItemAllocationId;
            itemAD.OrderItemAllocationId = itemAD.OrderItemAllocationId;
            itemAD.ReceivedNoteItemAllocationId = itemAD.ReceivedNoteItemAllocationId;
            itemAD.DeliveryNoteItemAllocationId = itemAD.DeliveryNoteItemAllocationId;
            itemAD.InvoiceItemAllocationId = itemAD.InvoiceItemAllocationId;
            itemAD.ReturnItemAllocationId = itemAD.ReturnItemAllocationId;
            itemAD.DispatchOrderItemAllocationId = itemAD.DispatchOrderItemAllocationId;
            itemAD.DispatchSectionItemAllocationId = itemAD.DispatchSectionItemAllocationId;
            $scope.beData.ItemDetailsColl.push(itemAD);
        });

        $scope.AddRowInItemDetails($scope.beData.ItemDetailsColl.length);
         
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

            $scope.beData.GodownId = null;

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


                                $scope.beData.ItemDetailsColl = $scope.beData.ItemDetailsColl.filter(function (el) { return el.AutoCharge != true; });

                                if ($scope.SelectedVoucher.AditionalChargeColl) {
                                    var itemInd = $scope.beData.ItemDetailsColl.length;
                                    for (var lInd = 0; lInd < $scope.SelectedVoucher.AditionalChargeColl.length; lInd++) {
                                        var ac = $scope.SelectedVoucher.AditionalChargeColl[lInd];
                                        $scope.AddRowInLedgerDetails(itemInd);

                                        var mul = 1;
                                        if (ac.Sign != undefined)
                                            mul = (ac.Sign == true ? 1 : -1);

                                        var ledAllocation = $scope.beData.ItemDetailsColl[itemInd];
                                        ledAllocation.CanEditRate = ac.CanEdit;
                                        ledAllocation.LedgerId = ac.LedgerId;
                                        ledAllocation.Rate = ac.Rate * mul;
                                        ledAllocation.Amount = ac.Amount * mul;
                                        ledAllocation.AutoCharge = true;
                                        $scope.loadingstatus = 'running';
                                        showPleaseWait();
                                        $http({
                                            method: 'GET',
                                            url: base_url + "Global/GetLedgerDetail?LedgerId=" + ac.LedgerId + " & VoucherType=" + $scope.SelectedVoucher.VoucherType,
                                            dataType: "json"
                                        }).then(function (resLD) {


                                            $scope.loadingstatus = 'stop';
                                            hidePleaseWait();

                                            if (resLD.data.IsSuccess && resLD.data.Data) {
                                                //ledAllocation.costLedgerDetail = resLD.data.Data

                                                var llId = resLD.data.Data.LedgerId;
                                                angular.forEach($scope.beData.ItemDetailsColl, function (idLed) {
                                                    if (idLed.RowType == 'L') {
                                                        if (llId == idLed.LedgerId) {
                                                            idLed.costLedgerDetail = resLD.data.Data;
                                                        }
                                                    }
                                                });

                                            }
                                        }, function (reason) {
                                            alert('Failed' + reason);
                                        });

                                        itemInd++;
                                    }

                                }

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
                                        if (angular.forEach($scope.beData.ItemDetailsColl, function (idet) {
                                            if (idet.RowType == 'P') {
                                                if (!idet.GodownId || idet.GodownId == 0)
                                                    idet.GodownId = $scope.beData.GodownId;
                                            }
                                        }));
                                    }
                                } else
                                    $scope.SelectedVoucher.VoucherWiseGodownColl = $scope.GodownColl;

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

    $scope.ClearData = function () {
        $scope.IsRefPartyDet = false;
        $scope.CheckedAll = false;
        $scope.RefAditionalCostColl = [];

        $timeout(function () {

            var sV = $scope.SelectedVoucher;
            var sC = $scope.SelectedCostClass;

            $scope.SelectedVoucher = null;
            $scope.SelectedCostClass = null;
            $scope.RefItemAllocationColl = [];
            $scope.beData.GodownId = null;
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
                VoucherDate_TMP: new Date(),
                EntryDate_TMP: new Date(),
                SalesInvoiceDetail: {},
                ReceivedAmount: 0,
                ChangeAmt: 0,
                RefVoucherType: 1,
                ProductCompanyId: null,
                Attributes: '',
                UDFFeildsColl: [],
                ServiceEnginer: '',
                Remarks: '',

                From_ChassisNo: '',
                From_EngineNo: '',
                From_Model: '',
                From_RegdNo: '',
                From_VinNo: '',

                To_ChassisNo: '',
                To_EngineNo: '',
                To_Model: '',
                To_RegdNo: '',
                To_VinNo: '',
				DocumentColl: [],
            };

            $scope.beData.ItemDetailsColl.push(
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

            if ($scope.SelectedVoucher) {
                if ($scope.SelectedVoucher.ActiveSummaryEntry == true) {
                    $scope.HideShow.ActiveSummaryEntry = false;
                    if (!$scope.beData.SalesInvoiceDetail)
                        $scope.beData.SalesInvoiceDetail = {};

                    $scope.beData.SalesInvoiceDetail.Buyes = 'CASH';
                    $scope.beData.SalesInvoiceDetail.Address = 'N/A';

                    var findBT = mx($scope.PaymentTermColl).firstOrDefault(p1 => p1.Name == 'CASH');
                    if (findBT) {
                        $scope.beData.SalesInvoiceDetail.PaymentTermsId = findBT.id;
                        $scope.ChangePaymentType(findBT.id);
                    }
                }
                else
                    $scope.HideShow.ActiveSummaryEntry = true;
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

        $scope.beData.ItemDetailsColl = [];
        $scope.beData.ItemDetailsColl.push(
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

        if ($scope.SelectedVoucher.AditionalChargeColl && $scope.SelectedVoucher.IsAbbInvoice == false) {
            var itemInd = $scope.beData.ItemDetailsColl.length;
            for (var lInd = 0; lInd < $scope.SelectedVoucher.AditionalChargeColl.length; lInd++) {
                var ac = $scope.SelectedVoucher.AditionalChargeColl[lInd];
                $scope.AddRowInLedgerDetails(itemInd);

                var mul = 1;
                if (ac.Sign != undefined)
                    mul = (ac.Sign == true ? 1 : -1);

                var ledAllocation = $scope.beData.ItemDetailsColl[itemInd];
                ledAllocation.CanEditRate = ac.CanEdit;
                ledAllocation.LedgerId = ac.LedgerId;
                ledAllocation.Rate = ac.Rate * mul;
                ledAllocation.Amount = ac.Amount * mul;
                ledAllocation.AutoCharge = true;
                $scope.loadingstatus = 'running';
                showPleaseWait();
                $http({
                    method: 'GET',
                    url: base_url + "Global/GetLedgerDetail?LedgerId=" + ac.LedgerId + " & VoucherType=" + $scope.SelectedVoucher.VoucherType,
                    dataType: "json"
                }).then(function (resLD) {


                    $scope.loadingstatus = 'stop';
                    hidePleaseWait();

                    if (resLD.data.IsSuccess && resLD.data.Data) {
                        //ledAllocation.costLedgerDetail = resLD.data.Data

                        var llId = resLD.data.Data.LedgerId;
                        angular.forEach($scope.beData.ItemDetailsColl, function (idLed) {
                            if (idLed.RowType == 'L') {
                                if (llId == idLed.LedgerId) {
                                    idLed.costLedgerDetail = resLD.data.Data;
                                }
                            }
                        });

                    }
                }, function (reason) {
                    alert('Failed' + reason);
                });

                itemInd++;
            }

        }
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

    $scope.GodownColl = [];
    $http({
        method: 'GET',
        url: base_url + "Inventory/Transaction/GetUserWiseGodown",
        dataType: "json"
    }).then(function (res) {
        if (res.data.IsSuccess && res.data.Data) {
            $scope.GodownColl = res.data.Data;
        }

    }, function (reason) {
        Swal.fire('Failed' + reason);
    });

    $scope.ProductColl = [];
    $http({
        method: 'GET',
        url: base_url + "Inventory/Transaction/GetProductDetails",
        dataType: "json"
    }).then(function (res) {
        if (res.data.IsSuccess && res.data.Data) {
            $scope.ProductColl = res.data.Data;
        }

    }, function (reason) {
        Swal.fire('Failed' + reason);


    });

    $scope.CostCenterColl = [];
    $http({
        method: 'GET',
        url: base_url + "Inventory/Transaction/GetCostCenter",
        dataType: "json"
    }).then(function (res) {
        if (res.data.IsSuccess && res.data.Data) {
            $scope.CostCenterColl = res.data.Data;
        }

    }, function (reason) {
        Swal.fire('Failed' + reason);


    });

    $scope.PrintVoucher = function (tranId, vid) {
        $scope.lastTranId = tranId;
        $scope.lastVoucherId = vid;
        $scope.Print();
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
            $scope.$apply($scope.SaveCannibalizeIn);
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