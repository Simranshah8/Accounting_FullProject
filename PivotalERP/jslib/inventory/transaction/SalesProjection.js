app.controller('SalesInvoiceController', function ($scope, $http, $timeout, $filter, $compile, GlobalServices, $document) {
    $scope.Title = 'Sales Invoice';
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
		$scope.VoucherSearchOptions = [{ text: 'PartyName', value: 'ADS.Buyes', searchType: 'text' }, { text: 'PanVat', value: 'ADS.SalesTaxNo', searchType: 'text' }, { text: 'PartyLedger', value: 'Led.Name', searchType: 'text' }, { text: 'RefNo', value: 'TS.[No]', searchType: 'text' }, { text: 'Invoice No.', value: 'TS.AutoManualNo', searchType: 'text' }, { text: 'Voucher', value: 'V.VoucherName', searchType: 'text' }, { text: 'CostClass', value: 'CC.Name', searchType: 'text' }, { text: 'VoucherDate', value: 'TS.VoucherDate', searchType: 'date' }, { text: 'Amount', value: 'TS.TotalAmount', searchType: 'number' }];
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
        $scope.PaymentTypeColl = glSrv.getPaymentTypeColl();
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
            VoucherId: null,
            CostClassId: null,
            TranId: 0,
            AutoManualNo: '',
            AutoVoucherNo: 0,
            PartyLedgerId: null,
            PartyLedger: null,
            partySideBarData: null,
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
            SaveClear: false,
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
                SchemeAmt: 0
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

        $scope.CurrencyColl = [];
        $http({
            method: 'GET',
            url: base_url + "Account/Creation/GetAllCurrency",
            dataType: "json"
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.CurrencyColl = res.data.Data;
            }
        }, function (reason) {
            alert('Failed' + reason);
        });

        $scope.SalesLedgerColl = [];
        glSrv.getSalesLedger().then(function (res1) {
            $scope.SalesLedgerColl = res1.data.Data;
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
                            //if ($scope.Config.AllowBilledQty == true)
                            //    $scope.HideShow.BilledQty = false;
                            //else
                            //    $scope.HideShow.BilledQty = true;

                            //if ($scope.Config.AllowDiscountAmount == true)
                            //    $scope.HideShow.DiscountAmt = false;
                            //else
                            //    $scope.HideShow.DiscountAmt = true;

                            //if ($scope.Config.AllowDiscountPer == true)
                            //    $scope.HideShow.DiscountPer = false;
                            //else
                            //    $scope.HideShow.DiscountPer = true;

                            //if ($scope.Config.AllowDiscountPer == false && $scope.Config.AllowDiscountAmount == false)
                            //    $scope.HideShow.Discount = true;
                            //else
                            //    $scope.HideShow.Discount = false;

                            //if ($scope.Config.ShowCurrentBalance == true)
                            //    $scope.HideShow.CurrentBalance = false;
                            //else
                            //    $scope.HideShow.CurrentBalance = true;

                            //if ($scope.Config.AllowFreeQty == true)
                            //    $scope.HideShow.FreeQty = false;
                            //else
                            //    $scope.HideShow.FreeQty = true;

                            //if ($scope.Config.AllowSchameAmount == true)
                            //    $scope.HideShow.SchemeAmt = false;
                            //else
                            //    $scope.HideShow.SchemeAmt = true;

                            //if ($scope.Config.AllowSchamePer == true)
                            //    $scope.HideShow.SchemePer = false;
                            //else
                            //    $scope.HideShow.SchemePer = true;

                            //if ($scope.Config.AllowSchamePer == false && $scope.Config.AllowSchameAmount == false)
                            //    $scope.HideShow.Scheme = true;
                            //else
                            //    $scope.HideShow.Scheme = false;


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
        $scope.TableIdColl = [{ id: 'main-table', text: 'Table', visible: false }];
    }

    $scope.CopyTableData = function (id) {
        GlobalServices.copyTableData(id);
    }
    $scope.onFilterTextBoxChanged = function () {
        $scope.gridOptions.api.setQuickFilter($scope.search);
    }
    $scope.AddRowInTable = function (ind) {
        if ($scope.beData.ItemDetailsColl) {
            var blankItemRowCount = 0, blankLedRowCount = 0;
            angular.forEach($scope.beData.ItemDetailsColl, function (idet) {
                if (!idet.productDetail && idet.RowType == 'P')
                    blankItemRowCount++;
                else if (!idet.costLedgerDetail && idet.RowType == 'L')
                    blankLedRowCount++;
            });

            var selectRowObj = $scope.beData.ItemDetailsColl[ind];
            if (selectRowObj.RowType == 'P' && (!selectRowObj.ProductId || selectRowObj.ProductId == 0) && blankItemRowCount <= 1 && blankLedRowCount < 1) {
                $scope.AddRowInLedgerDetails(ind);
            } else if (selectRowObj.RowType == 'L' && selectRowObj.costLedgerDetail) {
                $scope.AddRowInLedgerDetails(ind);
            } else if (blankItemRowCount < 1 && selectRowObj.RowType == 'P')
                $scope.AddRowInItemDetails(ind);

        }
    };

    $scope.AddRowInItemDetails = function (ind) {

        if ($scope.beData.ItemDetailsColl) {
            if ($scope.beData.ItemDetailsColl.length > ind + 1) {
                $scope.beData.ItemDetailsColl.splice(ind + 1, 0, {
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
                    SchemeRate: 0,
                    ExciseAbleQty: 0,
                    ExciseAbtAmt: 0,
                    VatAbleAmt: 0,
                    VatRate: 0,
                    VatAmount: 0,
                    ExDutyRate: 0,
                    ExDutyAmount: 0,
                    GodownId: $scope.beData.GodownId
                })
            } else {
                $scope.beData.ItemDetailsColl.push({
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
                    SchemeRate: 0,
                    ExciseAbleQty: 0,
                    ExciseAbtAmt: 0,
                    VatAbleAmt: 0,
                    VatRate: 0,
                    VatAmount: 0,
                    ExDutyRate: 0,
                    ExDutyAmount: 0,
                    GodownId: $scope.beData.GodownId
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

    $scope.AddRowInLedgerDetails = function (ind) {
        if ($scope.SelectedVoucher.ActiveAdditionalCost == false)
            return;

        if ($scope.beData.ItemDetailsColl) {
            if ($scope.beData.ItemDetailsColl.length > ind + 1) {
                $scope.beData.ItemDetailsColl.splice(ind + 1, 0, {
                    RowType: 'L',
                    LedgerId: 0,
                    ledgerDetail: null,
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
                    CanEditRate: true,
                    ALValue1: 0,
                    ALValue2: 0,
                    ALUnitId1: null,
                    ALUnitId2: null,
                    SchemeAmt: 0,
                    SchemeAmt: 0
                })
            } else {
                $scope.beData.ItemDetailsColl.push({
                    RowType: 'L',
                    LedgerId: 0,
                    ledgerDetail: null,
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
                    CanEditRate: true,
                    ALValue1: 0,
                    ALValue2: 0,
                    ALUnitId1: null,
                    ALUnitId2: null,
                    SchemeAmt: 0,
                    SchemeAmt: 0
                })
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

    $scope.ProductSelectionChange = function (itemDet) {
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
            itemDet.Weight = 0;
            itemDet.WeightUnitId = null;
            itemDet.WeightUnit = '';
            itemDet.Volum = 0;
            itemDet.VolumUnit = '';
            itemDet.VolumUnitId = null;
			itemDet.OnActionUDF = false;
            $scope.ChangeItemRowValue(itemDet, 'product');
        } else if (itemDet.productDetail) {
			
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
			
            itemDet.CanEditRate = itemDet.productDetail.CanEditRate;
            if (isModify == false && refStockItem == false) {
                itemDet.Rate = itemDet.productDetail.SalesRate;
                itemDet.ProductLedgerId = itemDet.productDetail.SalesLedgerId;
                itemDet.LedgerId = itemDet.productDetail.SalesLedgerId;
            }
            itemDet.ClosingQty = $filter('formatNumber')(itemDet.productDetail.ClosingQty) + ' ' + itemDet.productDetail.BaseUnit;
            itemDet.UnitId = itemDet.productDetail.BaseUnitId;
            itemDet.UnitName = itemDet.productDetail.BaseUnit;
           // itemDet.ProductLedgerId = itemDet.productDetail.SalesLedgerId;
            //itemDet.ActualQty = 0;
            //itemDet.BilledQty = 0;
            //itemDet.DiscountAmt = 0;
            //itemDet.DiscountPer = 0;
            $scope.ChangeItemRowValue(itemDet, 'product');
        }

    }

    $scope.AditionalCostSelectionChange = function (itemDet, ind) {

        $timeout(function () {
            $scope.sideBarData = itemDet.costSideBarData;

            if (itemDet.LedgerId == null || itemDet.LedgerId == 0) {
                itemDet.Rate = 0;
                itemDet.Amount = 0;
                itemDet.AccessableValue = 0;
            } else if (itemDet.costLedgerDetail) {
                itemDet.Rate = (itemDet.costLedgerDetail.Rate ? itemDet.costLedgerDetail.Rate : 0);
                itemDet.AccessableValue = 0;
                itemDet.Amount = 0;

            }

            var i = 0
            angular.forEach($scope.beData.ItemDetailsColl, function (idet) {
                if (idet.RowType == 'L') {
                    $scope.ChangeAdditionalRate(idet, 'rate', i);
                }
                i++;
            });
        });


    }

    $scope.PartySelectionChange = function (partyDet) {

        $scope.sideBarData = partyDet.partySideBarData;

        if (partyDet.PartyLedgerId && partyDet.PartyLedgerId > 0) {
            if (partyDet.PartyLedger) {
                if (partyDet.SalesInvoiceDetail) {

                    partyDet.SalesInvoiceDetail.TermsOfPayment = partyDet.PartyLedger.PaymentType;

                    if (!partyDet.SalesInvoiceDetail.Buyes)
                        partyDet.SalesInvoiceDetail.Buyes = partyDet.PartyLedger.Name;

                    if (!partyDet.SalesInvoiceDetail.Address)
                        partyDet.SalesInvoiceDetail.Address = partyDet.PartyLedger.Address;

                    if (!partyDet.SalesInvoiceDetail.SalesTaxNo)
                        partyDet.SalesInvoiceDetail.SalesTaxNo = partyDet.PartyLedger.PanVat;

                    if (!partyDet.SalesInvoiceDetail.PhoneNo)
                        partyDet.SalesInvoiceDetail.PhoneNo = partyDet.PartyLedger.MobileNo1;
                }
            }

            if ($scope.SelectedVoucher.ActivePartyDetails == true)
                $('#frmSalesInvoiceDetailsModel').modal('show');

        } else {

            $scope.search = "";
            $scope.RefVoucherNoColl = [];
            //$('#cboRefVoucherNo').val(null).trigger('change');
            //var arr = [];
            //$('#cboRefVoucherNo').val(arr).trigger('change');

            $scope.gridOptions.api.setRowData($scope.RefItemAllocationColl);
            $scope.RefItemAllocationColl = [];
            partyDet.SalesInvoiceDetail = {};
            //partyDet.ItemDetailsColl = [];
            //$scope.AddRowInItemDetails(0);
            $scope.RecalculateAdditioncalCost();
            $scope.CalculateTotalAndSubTotal();
            $('#frmSalesInvoiceDetailsModel').modal('hide');
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

                        $scope.beData.SalesInvoiceDetail.Description = tmpdata.RefNo;

                        $scope.beData.SalesInvoiceDetail.Goods = tmpdata.DeliveryNoteDetail.RegdNo;

                        $scope.beData.SalesInvoiceDetail.Buyes = tmpdata.DeliveryNoteDetail.Buyes;
                        $scope.beData.SalesInvoiceDetail.Address = tmpdata.DeliveryNoteDetail.Address;
                        $scope.beData.SalesInvoiceDetail.PhoneNo = tmpdata.DeliveryNoteDetail.PhoneNo;
                        $scope.beData.SalesInvoiceDetailSalesTaxNo = tmpdata.DeliveryNoteDetail.SalesTaxNo;

                        $scope.beData.SalesInvoiceDetail.DriverName = tmpdata.DeliveryNoteDetail.DriverName;
                        $scope.beData.SalesInvoiceDetail.DriverContactNo = tmpdata.DeliveryNoteDetail.DriverContactNo;
                    }
                    else if (refVType == 4) {
                        $scope.beData.SalesInvoiceDetail.Buyes = tmpdata.Buyes;
                        $scope.beData.SalesInvoiceDetail.Address = tmpdata.Address;
                        $scope.beData.SalesInvoiceDetail.PhoneNo = tmpdata.PhoneNo;
                        $scope.beData.SalesInvoiceDetail.SalesTaxNo = tmpdata.SalesTaxNo;
                        $scope.beData.SalesInvoiceDetail.CreditDays = tmpdata.CreditDays;
                        $scope.beData.SalesInvoiceDetail.Description = tmpdata.Description;

                        $scope.beData.SalesInvoiceDetail.OwnerName = tmpdata.OwnerName;
                        $scope.beData.SalesInvoiceDetail.OwnerContactNo = tmpdata.OwnerContactNo;
                        $scope.beData.SalesInvoiceDetail.DriverName = tmpdata.DriverName;
                        $scope.beData.SalesInvoiceDetail.DriverContactNo = tmpdata.DriverContactNo;
                        $scope.beData.SalesInvoiceDetail.DriverAddress = tmpdata.DriverAddress;
                        $scope.beData.SalesInvoiceDetail.LicenseNo = tmpdata.LicenseNo;

                        $scope.beData.SalesInvoiceDetail.Goods = tmpdata.Goods;
                        $scope.beData.SalesInvoiceDetail.Quantity = tmpdata.Quantity;

                        $scope.beData.SalesInvoiceDetail.TotalWT = tmpdata.TotalWT;
                        $scope.beData.SalesInvoiceDetail.FreightRate = tmpdata.FreightRate;
                        $scope.beData.SalesInvoiceDetail.AdvancePayment = tmpdata.AdvancePayment;

                        $scope.beData.SalesInvoiceDetail.OtherRefereces = tmpdata.OtherRefereces;
                        $scope.beData.SalesInvoiceDetail.TermsOfPayment = tmpdata.TermsOfPayment;
                        $scope.beData.SalesInvoiceDetail.TermsOfDelivery = tmpdata.TermsOfDelivery;
                        $scope.beData.SalesInvoiceDetail.Destination = tmpdata.Destination;
                        $scope.beData.SalesInvoiceDetail.DeliveryThrough = tmpdata.DeliveryThrough;
                        $scope.beData.SalesInvoiceDetail.DeliveryDocNo = tmpdata.DeliveryDocNo;
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

        $('#frmSalesInvoiceDetailsModel').modal('hide');
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

    $scope.CalculateTotalAndSubTotal = function () {

        var subTotal = 0;
        var totalQty = 0;
        angular.forEach($scope.beData.ItemDetailsColl, function (item) {
            subTotal += item.Amount;
            totalQty += item.ActualQty;
        });

        $scope.beData.SubTotal = ($filter('number')(subTotal, $scope.SelectedVoucher.NoOfDecimalPlaces)).parseDBL();
        $scope.beData.TotalAmount = ($filter('number')(subTotal, $scope.SelectedVoucher.NoOfDecimalPlaces)).parseDBL();
    };

    $scope.ChangeItemRowValue = function (itemDet, col) {

        if (col == 'rate' || col == 'amt') {
            if (mx(itemDet.Rate).contains('=') == true || mx(itemDet.Amount).contains('=') == true) {
                return;
            }
        }

        var amt = 0, qty = 0, rate = 0, disAmt = 0, disPer = 0, schAmt = 0, schPer = 0;

        var aQty = 0;

        var rateOf = 1;
        if (itemDet.productDetail) {
            rateOf = itemDet.productDetail ? itemDet.productDetail.RateOf : 1;
            if (rateOf == 0)
                rateOf = 1;
        }

        if (col == 'aQty') {
            itemDet.BilledQty = itemDet.ActualQty;
        } else if (col == 'bQty') {
            if (itemDet.ActualQty == 0 || itemDet.ActualQty < itemDet.BilledQty)
                itemDet.ActualQty = itemDet.BilledQty;
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
        itemDet.Rate = rate;

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

                if ($scope.SelectedVoucher.Product.ActiveRateUOM == true && itemDet.RateUnitId > 0) {
                    var rateQty = 0;
                    var isbaseUOM = false;
                    if (itemDet.RateUnitId == itemDet.UnitId) {
                        rateQty = itemDet.BilledQty;
                        isbaseUOM = true;
                    }
                    else if (itemDet.RateUnitId == itemDet.ALUnitId1) {
                        rateQty = isEmptyAmt(itemDet.ALValue1);
                    }
                    else if (itemDet.RateUnitId == itemDet.ALUnitId2) {
                        rateQty = isEmptyAmt(itemDet.ALValue2);
                    }
                    else
                        rateQty = 0;
                    itemDet.RatePer = itemDet.Amount / rateQty;
                }

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


        if ($scope.HideShow.BilledQty == true) {
            itemDet.BilledQty = aQty;
        }

        if (itemDet.productDetail) {
            if (itemDet.productDetail.AlternetUnitColl) {
                if (col == 'aQty' || col == 'bQty') {
                    var alterUnit_Qry = mx(itemDet.productDetail.AlternetUnitColl);

                    var alternetUnit1 = null, alternetUnit2 = null;

                    alternetUnit1 = alterUnit_Qry.firstOrDefault(p1 => p1.UnitId == itemDet.ALUnitId1);
                    alternetUnit2 = alterUnit_Qry.firstOrDefault(p1 => p1.UnitId == itemDet.ALUnitId2);

                    if (!alternetUnit1)
                        alternetUnit1 = alterUnit_Qry.firstOrDefault(p1 => p1.SNo == 1);

                    if (!alternetUnit2)
                        alternetUnit2 = alterUnit_Qry.firstOrDefault(p1 => p1.SNo == 2);

                    if (itemDet.productDetail.AlternetUnitColl.length > 0) {

                        //alternetUnit1 = alterUnit_Qry.firstOrDefault(p1 => p1.SNo == 1);
                        if (alternetUnit1) {
                            itemDet.ALValue1 = parseFloat(parseFloat((alternetUnit1.AlternetUnitValue * aQty) / alternetUnit1.BaseUnitValue).toFixed(alternetUnit1.NoOfDecimalPlaces));
                            itemDet.ALUnitId1 = alternetUnit1.UnitId;
                            itemDet.UnitName1 = alternetUnit1.UnitName;
                        }
                    }

                    if (itemDet.productDetail.AlternetUnitColl.length > 1) {
                        //alternetUnit2 = alterUnit_Qry.firstOrDefault(p1 => p1.SNo == 2);
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

        $scope.RecalculateAdditioncalCost();
        $scope.CalculateTotalAndSubTotal();
    }

    $scope.ChangeItemAlternetQty = function (itemDet, col) {

        var aQty = 0;

        if (col == 'aQty') {
            itemDet.BilledQty = itemDet.ActualQty;
        } else if (col == 'bQty') {
            if (itemDet.ActualQty == 0 || itemDet.ActualQty < itemDet.BilledQty)
                itemDet.ActualQty = itemDet.BilledQty;
        }

        if (itemDet.ActualQty)
            aQty = itemDet.ActualQty;


        if (itemDet.productDetail) {
            if (itemDet.productDetail.AlternetUnitColl) {
                var alterUnit_Qry = mx(itemDet.productDetail.AlternetUnitColl);

                var alternetUnit1 = null, alternetUnit2 = null;

                alternetUnit1 = alterUnit_Qry.firstOrDefault(p1 => p1.UnitId == itemDet.ALUnitId1);
                alternetUnit2 = alterUnit_Qry.firstOrDefault(p1 => p1.UnitId == itemDet.ALUnitId2);

                if (!alternetUnit1)
                    alternetUnit1 = alterUnit_Qry.firstOrDefault(p1 => p1.SNo == 1);

                if (!alternetUnit2)
                    alternetUnit2 = alterUnit_Qry.firstOrDefault(p1 => p1.SNo == 2);

                var baseQty = 0;
                var findUnit = $scope.UnitColl.firstOrDefault(p1 => p1.UnitId == itemDet.productDetail.BaseUnitId);
                if (alternetUnit1 && col == 'unit1') {

                    if (findUnit) {
                        //baseQty = parseFloat(parseFloat((alternetUnit1.BaseUnitValue * itemDet.ALValue1) / alternetUnit1.AlternetUnitValue).toFixed(alternetUnit1.NoOfDecimalPlaces));
                        baseQty = parseFloat(parseFloat((alternetUnit1.BaseUnitValue * itemDet.ALValue1) / alternetUnit1.AlternetUnitValue));//.toFixed(itemDet.QtyDecimal));
                        if ($scope.SelectedVoucher.Product.NotEffectInBaseUnit == false)
                            itemDet.ActualQty = baseQty;

                        if (alternetUnit2)
                            itemDet.ALValue2 = parseFloat(parseFloat((alternetUnit2.AlternetUnitValue * baseQty) / alternetUnit2.BaseUnitValue));//.toFixed(alternetUnit2.NoOfDecimalPlaces));
                    }

                } else if (alternetUnit2 && col == "unit2") {

                    if (findUnit) {
                        //  baseQty = parseFloat(parseFloat(itemDet.ALValue2 * alternetUnit2.AlternetUnitValue).toFixed(findUnit.NoOfDecimalPlaces));
                        baseQty = parseFloat(parseFloat((alternetUnit2.BaseUnitValue * itemDet.ALValue2) / alternetUnit2.AlternetUnitValue));//.toFixed(itemDet.QtyDecimal));

                        if ($scope.SelectedVoucher.Product.NotEffectInBaseUnit == false)
                            itemDet.ActualQty = baseQty;

                        if (alternetUnit1)
                            itemDet.ALValue1 = parseFloat(parseFloat((alternetUnit1.AlternetUnitValue * baseQty) / alternetUnit1.BaseUnitValue));//.toFixed(alternetUnit1.NoOfDecimalPlaces));
                    }

                }
            }
        }

        $scope.ChangeItemRowValue(itemDet, 'rate');

    }

    $scope.ChangeAdditionalRate = function (itemDet, col, ind) {

        $scope.RecalculateAdditioncalCost();
        $scope.CalculateTotalAndSubTotal();
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
    $scope.RecalculateAdditioncalCost = function () {
        var newInd = 0;

        var productAmt = 0;
        var schemeAmt = 0;
        var productVatAmt = 0;
        var productVatAbleAmt = 0;
        var productExciduteAmt = 0;
        var productExciduteAbleAmt = 0;
        var productExciduteAbleQty = 0;
        var totalQty1 = 0;
        angular.forEach($scope.beData.ItemDetailsColl, function (idet) {

            if (idet.RowType == 'P') {
                totalQty1 += idet.ActualQty;

                productAmt += idet.Amount;

                schemeAmt += idet.SchameAmt;

                productVatAmt += (idet.VatAmount ? idet.VatAmount : 0);
                productVatAbleAmt += (idet.VatAbleAmt ? idet.VatAbleAmt : 0);

                productExciduteAmt += (idet.ExDutyAmount ? idet.ExDutyAmount : 0);
                productExciduteAbleAmt += (idet.ExciseAbtAmt ? idet.ExciseAbtAmt : 0);
                productExciduteAbleQty += (idet.ExciseAbtQty ? idet.ExciseAbtQty : 0);
            }
            else if (idet.RowType == 'L') {
                var ledAllotionAmt = 0;
                for (var i = 0; i < newInd; i++) {
                    var det = $scope.beData.ItemDetailsColl[i];
                    if (det.RowType == 'L') {
                        ledAllotionAmt += det.Amount;
                    }
                }

                var totalAmt1 = productAmt + ledAllotionAmt;
                var amt1 = 0;

                if (idet.costLedgerDetail) {
                    if (idet.costLedgerDetail.LedgerType == 9) // Auto Rounde off
                    {
                        amt1 = Number((Math.round(totalAmt1) - totalAmt1).toFixed(3));
                    }
                    else if (idet.costLedgerDetail.LedgerType == 6)  // Scheme
                    {
                        amt1 = schemeAmt;
                    }
                    else
                        amt1 = idet.Amount;
                } else
                    amt1 = idet.Amount;


                if (idet.Rate != 0) {

                    if (idet.costLedgerDetail) {
                        if (idet.costLedgerDetail.AditionCostOnBasisOf == 0) {
                            if (idet.costLedgerDetail.LedgerType == 3) {
                                amt1 = productExciduteAbleQty * idet.Rate / 100;
                                idet.AccessableValue = productExciduteAbleAmt;
                            }
                            else {
                                amt1 = totalQty1 * idet.Rate;
                                idet.AccessableValue = totalQty1;
                            }

                        }
                        else {
                            if (idet.costLedgerDetail.LedgerType == 3) // Excise Duty
                            {
                                amt1 = productExciduteAbleAmt * idet.Rate / 100;
                                idet.AccessableValue = productExciduteAbleAmt;
                            }
                            else if (idet.costLedgerDetail.LedgerType == 1) // Vat
                            {
                                if ($scope.SelectedVoucher.Product.ProductWiseVat == true) {
                                    amt1 = productVatAmt + (ledAllotionAmt * idet.Rate / 100);
                                    idet.AccessableValue = productVatAbleAmt + ledAllotionAmt;
                                }
                                else {
                                    amt1 = (productVatAbleAmt + ledAllotionAmt) * idet.Rate / 100;
                                    idet.AccessableValue = (productVatAbleAmt + ledAllotionAmt);
                                }

                            }
                            else {
                                amt1 = totalAmt1 * idet.Rate / 100;
                                idet.AccessableValue = totalAmt1;
                            }
                        }
                    }
                    else {
                        amt1 = totalAmt1 * idet.Rate / 100;
                        idet.AccessableValue = totalAmt1;
                    }

                }

                idet.Amount = amt1;

                if (idet.costLedgerDetail) {
                    if ((idet.costLedgerDetail.LedgerType == 10 || idet.costLedgerDetail.LedgerType == 6) && amt1 > 0) {
                        idet.Rate = idet.Rate * -1;
                        idet.Amount = idet.Amount * -1;
                    } else if ((idet.costLedgerDetail.LedgerType == 1 || idet.costLedgerDetail.LedgerType == 3 || idet.costLedgerDetail.LedgerType == 7 || idet.costLedgerDetail.LedgerType == 8) && amt1 < 0) {
                        idet.Rate = math.abs(idet.Rate);
                        idet.Amount = math.abs(idet.Amount);
                    }
                }

            }
            newInd++;
        });

        var totalAmt = 0;
        angular.forEach($scope.beData.ItemDetailsColl, function (idet) {
            totalAmt += idet.Amount;
        });
        $scope.beData.TotalAmount = totalAmt;
    };


    $scope.SaveSalesInvoice = function () {

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
                        url: base_url + "Inventory/Transaction/SaveUpdateSalesInvoice",
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

                        if (res.data.IsSuccess == true) {
                            $scope.beData.SaveClear = true;
                            $scope.lastTranId = res.data.Data.RId;
                            $scope.lastVoucherId = $scope.SelectedVoucher.VoucherId;

                            if ($scope.SelectedVoucher.PrintVoucherAfterSaving == true) {
                                $scope.Print();
                            }
                            $scope.Clear();
                        }
                        else {
                            Swal.fire(res.data.ResponseMSG);
                        }

                    }, function (errormessage) {
                        hidePleaseWait();
                        $scope.loadingstatus = "stop";

                    });
                }
            });



        }


    }

    $scope.GetTransactionById = function (tran) {
        $timeout(function () {

            if (tran.TranId && tran.TranId > 0) {
                var para = {
                    tranId: tran.TranId
                };
                $http({
                    method: 'POST',
                    url: base_url + "Inventory/Transaction/GetSalesProjectionById",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    $timeout(function () {
                        if (res.data.IsSuccess && res.data.Data) {
                            var tran = res.data.Data;
                            $scope.SetData(tran);
                            $('#searVoucherRightBtn').modal('hide');
                        } else
                            Swal.fire(res.data.ResponseMSG);
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


        if ($scope.HideShow.TranCostCenter == false) {
            if ($scope.beData.TranCostCenter) {

                if ($scope.beData.TranCostCenter == null || $scope.beData.TranCostCenter == 0) {
                    result = false;
                    Swal.fire('Please ! Select Valid Cost Center');
                }

            } else {
                result = false;
                Swal.fire('Please ! Select Valid Cost Center');
            }
        }

        if ($scope.beData.PartyLedgerId) {
            if ($scope.beData.PartyLedgerId == null || $scope.beData.PartyLedgerId == 0) {
                result = false;
                Swal.fire('Please ! Select Valid Party Name');
            }
        } else {
            result = false;
            Swal.fire('Please ! Select Valid Party Name');
        }


        //if ($scope.HideShow.Godown == false) {
        //    if ($scope.beData.GodownId) {

        //        if ($scope.beData.GodownId == null || $scope.beData.GodownId == 0) {
        //            result = false;
        //            Swal.fire('Please ! Select Valid Godown Name');
        //        }

        //    } else {
        //        result = false;
        //        Swal.fire('Please ! Select Valid Godown Name');
        //    }
        //}

        if ($scope.SelectedVoucher.ShowWarringForBackDate == true) {
            if (!$scope.beData.VoucherDateDet) {
                var today = new Date();
                var vDate = $scope.beData.VoucherDateDet.dateAD;

                if (vDate < today) {
                    Swal.fire('Please ! Invoice Date is less then today');
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
            ItemAllocationColl: [],
            // AditionalCostColl: $scope.beData.AditionalCostColl,
            AditionalCostColl: [],
            SalesInvoiceDetail: $scope.beData.SalesInvoiceDetail,
            GodownId: $scope.beData.GodownId
        };

        if (tmpSales.SalesInvoiceDetail) {
            if (tmpSales.SalesInvoiceDetail.FreightRate == undefined || tmpSales.SalesInvoiceDetail.FreightRate == null || tmpSales.SalesInvoiceDetail.FreightRate === undefined)
                tmpSales.SalesInvoiceDetail.FreightRate = 0;

            if (tmpSales.SalesInvoiceDetail.AdvancePayment == undefined || tmpSales.SalesInvoiceDetail.AdvancePayment == null || tmpSales.SalesInvoiceDetail.AdvancePayment === undefined)
                tmpSales.SalesInvoiceDetail.AdvancePayment = 0;

            if (tmpSales.SalesInvoiceDetail.CreditDays == undefined || tmpSales.SalesInvoiceDetail.CreditDays == null || tmpSales.SalesInvoiceDetail.CreditDays === undefined)
                tmpSales.SalesInvoiceDetail.CreditDays = 0;
        }

        angular.forEach($scope.beData.ItemDetailsColl, function (itemDet) {
            if (itemDet.ProductId && itemDet.ProductId > 0 && itemDet.RowType == 'P') {
                var itemAllocation = {
                    ProductId: itemDet.ProductId,
                    ActualQty: itemDet.ActualQty + (itemDet.FreeQty ? itemDet.FreeQty : 0),
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
                    GodownId: (itemDet.GodownId && itemDet.GodownId > 0 ? itemDet.GodownId : (tmpSales.GodownId ? tmpSales.GodownId : 0)),
                    VatRate: itemDet.VatRate,
                    VatAmount: itemDet.VatAmount,
                    VatAbleAmt: itemDet.VatAbleAmt,
                    ExDutyRate: itemDet.ExDutyRate,
                    ExDutyAmount: itemDet.ExDutyAmount,
                    Description: itemDet.Description,
                    RegdNo: itemDet.RegdNo ? itemDet.RegdNo : '',
                    EngineNo: itemDet.EngineNo ? itemDet.EngineNo : '',
                    ChassisNo: itemDet.ChassisNo ? itemDet.ChassisNo : '',
                    Model: itemDet.Model ? itemDet.Model : '',
                    CodeNo: itemDet.CodeNo ? itemDet.CodeNo : '',
                    Color: itemDet.Color ? itemDet.Color : '',
                    KeyNo: itemDet.KeyNo ? itemDet.KeyNo : '',
                    MFGYear: itemDet.MFGYear ? itemDet.MFGYear : 0,
                    Type: itemDet.Type ? itemDet.Type : '',

                };

                itemAllocation.ItemDetailsColl.push(
                    {
                        ProductId: itemAllocation.ProductId,
                        ActualQty: itemAllocation.ActualQty,
                        BilledQty: itemAllocation.BilledQty,
                        UnitId: itemAllocation.UnitId,
                        Rate: itemAllocation.Rate,
                        Amount: itemAllocation.Amount,
                        Batch: '',
                        EXPDate: null,
                        MFGDate: null,
                        GodownId: itemAllocation.GodownId,
                        DiscountAmt: itemAllocation.DiscountAmt,
                        DiscountPer: itemAllocation.DiscountPer,
                        SchameAmt: itemAllocation.SchameAmt,
                        SchamePer: itemAllocation.SchamePer,
                        ALUnitId1: itemAllocation.ALUnitId1,
                        ALUnitId2: itemAllocation.ALUnitId2,
                        ALUnitId3: itemAllocation.ALUnitId3,
                        ALValue1: itemAllocation.ALValue1,
                        ALValue2: itemAllocation.ALValue2,
                        ALValue3: itemAllocation.ALValue3,
                        Narration: itemAllocation.Narration,
                        VatRate: itemAllocation.VatRate,
                        VatAmount: itemAllocation.VatAmount,
                        VatAbleAmt: itemAllocation.VatAbleAmt,
                        ExDutyRate: itemAllocation.ExDutyRate,
                        ExDutyAmount: itemAllocation.ExDutyAmount,
                        BundleId: 0,
                        BundleQty: 0,
                        RegdNo: itemAllocation.RegdNo,
                        EngineNo: itemAllocation.EngineNo,
                        ChassisNo: itemAllocation.ChassisNo,
                        Model: itemAllocation.Model,
                        CodeNo: itemAllocation.CodeNo,
                        Color: itemAllocation.Color,
                        KeyNo: itemAllocation.KeyNo,
                        MFGYear: itemAllocation.MFGYear,
                        Type: itemAllocation.Type,
                        Description: itemAllocation.Description
                    });

                tmpSales.ItemAllocationColl.push(itemAllocation);
            }
            else if (itemDet.LedgerId && itemDet.LedgerId > 0 && itemDet.RowType == 'L') {
                tmpSales.AditionalCostColl.push({
                    LedgerId: itemDet.LedgerId,
                    AccessableValue: (itemDet.AccessableValue ? itemDet.AccessableValue : 0),
                    Rate: (itemDet.Rate ? itemDet.Rate : 0),
                    Amount: (itemDet.Amount ? itemDet.Amount : 0),
                });
            }
        });


        return tmpSales;
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
                dtPicker = dtPicker+ '<input type="text"  class="form-control form-control-sm" date-picker ng-model="beData.VoucherDate_TMP" date-detail="beData.VoucherDateDet" confirm-action="getVoucherNoOnly(2)" title ="{{beData.VoucherDateDet.dateAD |dateFormat}}" date-style="2" id ="dtVoucherDateBS" voucherid ="SelectedVoucher.VoucherId" >';
            }
            else if ($scope.SelectedVoucher.DateStyle == 1) //AD
            {
                dtPicker = dtPicker + '<input type="text"  class="form-control form-control-sm" date-picker ng-model="beData.VoucherDate_TMP" date-detail="beData.VoucherDateDet" confirm-action="getVoucherNoOnly(1)" title ="{{ beData.VoucherDateDet.dateBS }}" date-style="1" id ="dtVoucherDateAD" voucherid ="SelectedVoucher.VoucherId" >';
            }
            else if ($scope.SelectedVoucher.DateStyle == 3) //BS & AD
            {
            
                dtPicker = dtPicker + `<div class="d-inline-block">
                    <div class="input-group input-group-sm">
                        <div class="input-group-prepend">
                            <span class="input-group-text">BS:</span>
                        </div>                        
                        <input type="text"  class="form-control form-control-sm" date-picker ng-model="beData.VoucherDate_TMP" date-detail="beData.VoucherDateDet" confirm-action="getVoucherNoOnly(2)" title ="{{beData.VoucherDateDet.dateAD |dateFormat}}" date-style="2" id ="dtVoucherDateBS" voucherid ="SelectedVoucher.VoucherId" >
                        <div class="input-group-prepend">
                            <span class="input-group-text">AD:</span>
                        </div>                        
                        <input type="text"  class="form-control form-control-sm" date-picker ng-model="beData.VoucherDateAD_TMP" date-detail="beData.VoucherDateADDet" confirm-action="getVoucherNoOnly(1)" title ="{{ beData.VoucherDateADDet.dateBS }}" date-style="1" id ="dtVoucherDateAD" voucherid ="SelectedVoucher.VoucherId" >
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
                        <input type="text"  class="form-control form-control-sm" date-picker ng-model="beData.VoucherDateAD_TMP" date-detail="beData.VoucherDateADDet" confirm-action="getVoucherNoOnly(1)" title ="{{ beData.VoucherDateADDet.dateBS }}" date-style="1" id ="dtVoucherDateAD" voucherid ="SelectedVoucher.VoucherId" >
 <div class="input-group-prepend">
                            <span class="input-group-text">BS:</span>
                        </div>
                        <input type="text"  class="form-control form-control-sm" date-picker ng-model="beData.VoucherDate_TMP" date-detail="beData.VoucherDateDet" confirm-action="getVoucherNoOnly(2)" title ="{{beData.VoucherDateDet.dateAD |dateFormat}}" date-style="2" id ="dtVoucherDateBS" voucherid ="SelectedVoucher.VoucherId" >
                    </div>
                </div>`;
            }
            else  //BOTH
            {
                dtPicker = dtPicker +'<input type="text"  class="form-control form-control-sm" date-picker ng-model="beData.VoucherDate_TMP" date-detail="beData.VoucherDateDet" confirm-action="getVoucherNoOnly(2)" title ="{{beData.VoucherDateDet.dateAD |dateFormat}}" date-style="2" id ="dtVoucherDateBS" voucherid ="SelectedVoucher.VoucherId" >';
            }
            const newElement = angular.element(dtPicker);
            //container.append($compile(newElement)($scope));

            container.append(newElement);
            $compile(newElement)($scope);
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

                                if ($scope.SelectedVoucher.Product.ProductWiseLedger == true) {
                                    $scope.HideShow.ProductLedger = false;

                                    if ($scope.SelectedVoucher.Product.ShowProductWiseLedger == true)
                                        $scope.HideShow.ShowProductWiseLedger = false;
                                    else
                                        $scope.HideShow.ShowProductWiseLedger = true;
                                }
                                else {
                                    $scope.HideShow.ProductLedger = true;
                                    $scope.HideShow.ShowProductWiseLedger = true;
                                }


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
                                    $scope.HideShow.AlternetUnitMultiple = true;
                                }


                                if ($scope.SelectedVoucher.UseEffectiveDate == true)
                                    $scope.HideShow.EntryDate = false;
                                else
                                    $scope.HideShow.EntryDate = true;

                                if ($scope.SelectedVoucher.Product.BatchNo == true)
                                    $scope.HideShow.Batch = false;
                                else
                                    $scope.HideShow.Batch = true;

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



                                $scope.beData.ItemDetailsColl = $scope.beData.ItemDetailsColl.filter(function (el) { return el.AutoCharge != true; });

                                if ($scope.SelectedVoucher.AditionalChargeColl) {
                                    var itemInd = $scope.beData.ItemDetailsColl.length;
                                    for (var lInd = 0; lInd < $scope.SelectedVoucher.AditionalChargeColl.length; lInd++) {
                                        var ac = $scope.SelectedVoucher.AditionalChargeColl[lInd];
                                        $scope.AddRowInLedgerDetails(itemInd);

                                        var mul = ac.Sign == true ? 1 : -1;

                                        var ledAllocation = $scope.beData.ItemDetailsColl[itemInd];
                                        ledAllocation.Formula = ac.Formula;
                                        ledAllocation.CanEditRate = ac.CanEdit;
                                        ledAllocation.LedgerId = ac.LedgerId;
                                        ledAllocation.Rate = ac.Rate * mul;
                                        ledAllocation.Amount = ac.Amount * mul;
                                        ledAllocation.AutoCharge = true;
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
        $scope.SelectedVoucher = null;
        $scope.SelectedCostClass = null;
        $scope.RefItemAllocationColl = [];

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
                SchemeAmt: 0
            });

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

        $scope.getVoucherNo();

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
    $scope.Print = function () {
        if ($scope.lastTranId || $scope.lastVoucherId > 0) {
            var TranId = $scope.lastTranId;

            var vId = $scope.lastVoucherId;

            $http({
                method: 'GET',
                url: base_url + "ReportEngine/GetReportTemplates?entityId=" + EntityId + "&voucherId=" + vId + "&isTran=true&vtranId=" + TranId,
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
                        var selectedRpt = null;

                        if (templatesColl.length == 1) {
                            rptTranId = templatesColl[0].RptTranId;
                            selectedRpt = templatesColl[0];
                        }
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
                                            selectedRpt = templatesColl[value];
                                            printDone = true;
                                            if (rptTranId > 0) {
                                                document.body.style.cursor = 'wait';
                                                document.getElementById("frmRpt").src = '';
                                                document.getElementById("frmRpt").src = base_url + "web/ReportViewer.aspx?rpttranid=" + rptTranId + "&istransaction=true&entityid=" + EntityId + "&voucherid=" + $scope.SelectedVoucher.VoucherId + "&tranid=" + TranId + "&vouchertype=" + VoucherType + '&FileName=' + selectedRpt.PDFFileName;
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
                            document.getElementById("frmRpt").src = base_url + "web/ReportViewer.aspx?rpttranid=" + rptTranId + "&istransaction=true&entityid=" + EntityId + "&voucherid=" + $scope.SelectedVoucher.VoucherId + "&tranid=" + TranId + "&vouchertype=" + VoucherType + '&FileName=' + selectedRpt.PDFFileName;
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

    $scope.SearchDataColl = [];
    $scope.SearchData = function () {

        $scope.loadingstatus = 'running';
        showPleaseWait();
        $scope.paginationOptions.TotalRows = 0;

        var sCol = $scope.paginationOptions.SearchColDet;

        var para = {
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
            $scope.$apply($scope.SaveSalesInvoice);
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
	
	 $scope.ShowProductOnActionUDF = function (curRow, ind) {
        $scope.CurItemAllocation = curRow;
        $('#productWiseUDF').modal('show');
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