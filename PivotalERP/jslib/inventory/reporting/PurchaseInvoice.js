app.controller('PurchaseInvoiceController', function ($scope, $http, $timeout, $filter, GlobalServices) {
    $scope.Title = 'Purchase Invoice';
	  var PrintPreviewAs = 1;
    const contextMenu = GlobalServices.createElementForMenu();
	
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
        $('.select2').select2()
        $scope.confirmMSG = glSrv.getConfirmMSG();
        $scope.paginationOptions = {
            pageNumber: 1,
            pageSize: glSrv.getPerPageRow(),
            sort: null,
            SearchType: 'text',
            SearchCol: '',
            SearchVal: '',
            SearchColDet: null,
            pagearray: [],
            pageOptions: [5, 10, 20, 30, 40, 50]
        };
        $scope.VoucherSearchOptions = [{ text: 'PartyName', value: 'ADS.Buyes', searchType: 'text' }, { text: 'PanVat', value: 'ADS.PurchaseTaxNo', searchType: 'text' }, { text: 'PartyLedger', value: 'Led.Name', searchType: 'text' }, { text: 'RefNo', value: 'TS.[No]', searchType: 'text' }, { text: 'Invoice No.', value: 'TS.AutoManualNo', searchType: 'text' }, { text: 'Voucher', value: 'V.VoucherName', searchType: 'text' }, { text: 'CostClass', value: 'CC.Name', searchType: 'text' }, { text: 'VoucherDate', value: 'TS.VoucherDate', searchType: 'date' }, { text: 'Amount', value: 'TS.TotalAmount', searchType: 'number' }];

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
        $scope.PurchaseFeatures = {};
        $scope.PurchaseFeatures = {};
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
            PurchaseLedger: false,
            PurchaseLedger: false,
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
            PurchaseMan: null,
            PurchasemanSideBarData: null,
            CurRate: 1,
            ItemDetailsColl: [],
            AditionalCostColl: [],
            AttechFiles: [],
            SubTotal: 0,
            Total: 0,
            Narration: '',
            VoucherDate: new Date(),
            PurchaseInvoiceDetail: {}
        };

        $scope.beData.ItemDetailsColl.push(
            {
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
                ALUnitId2: null
            }
        );
        $('.hideSideBar').on('focus', function (e) {
            $('#sidebarzz').removeClass();
            $('#sidebarzz').addClass('order-last float-right active');
        })


        //if (VoucherType || VoucherMode>0) {

        //    $http({
        //        method: 'GET',
        //        url: base_url + "Setup/Security/GetConfirmationMSG",
        //        dataType: "json"
        //    }).then(function (res) {
        //        if (res.data.IsSuccess && res.data.Data) {
        //            $scope.confirmMSG = res.data.Data;
        //        } else {
        //            Swal.fire(res.data.ResponseMSG);
        //        }

        //    }, function (reason) {
        //        Swal.fire('Failed' + reason);
        //    });


        //    $http({
        //        method: 'GET',
        //        url: base_url + "Inventory/Creation/GetUserWiseGodown",
        //        dataType: "json"
        //    }).then(function (res) {
        //        if (res.data.IsSuccess && res.data.Data) {
        //            $scope.GodownColl = res.data.Data;
        //            if ($scope.GodownColl.length == 1) {
        //                $scope.beData.GodownId = $scope.GodownColl[0].GodownId;
        //                $scope.HideShow.Godown = true;
        //            } else {
        //                $scope.HideShow.Godown = false;
        //                $scope.beData.GodownId = null;
        //            }
        //        } else {
        //            Swal.fire(res.data.ResponseMSG);
        //        }

        //    }, function (reason) {
        //        Swal.fire('Failed' + reason);
        //    });

        //    $http({
        //        method: 'GET',
        //        url: base_url + "Account/Creation/GetVoucherMandetoryFields?voucherType=" + VoucherType,
        //        dataType: "json"
        //    }).then(function (res) {
        //        if (res.data.IsSuccess && res.data.Data) {
        //            $scope.mandetoryFields = res.data.Data;
        //        } else
        //            Swal.fire(res.data.ResponseMSG);
        //    }, function (reason) {
        //        Swal.fire('Failed' + reason);
        //    });

        //    $http({
        //        method: 'GET',
        //        url: base_url + "Account/Creation/GetVoucherWiseNarration?voucherType=" + VoucherType,
        //        dataType: "json"
        //    }).then(function (res) {
        //        if (res.data.IsSuccess && res.data.Data) {
        //            $scope.NarrationList = res.data.Data;
        //        } else
        //            Swal.fire(res.data.ResponseMSG);
        //    }, function (reason) {
        //        Swal.fire('Failed' + reason);
        //    });

        //    $http({
        //        method: 'GET',
        //        url: base_url + "Setup/Security/GetPurchaseFeatures",
        //        dataType: "json"
        //    }).then(function (res1) {
        //        if (res1.data.IsSuccess && res1.data.Data) {
        //            $scope.PurchaseFeatures = res1.data.Data;

        //            $timeout(function () {
        //                $scope.$apply(function () {
        //                    if ($scope.PurchaseFeatures.ProductWisePurchaseLedger == true)
        //                        $scope.HideShow.PurchaseLedger = true;
        //                    else
        //                        $scope.HideShow.PurchaseLedger = false;
        //                });
        //            });
        //        }
        //    }, function (reason) {
        //        Swal.fire('Failed' + reason);
        //    });

        //    $http({
        //        method: 'GET',
        //        url: base_url + "Setup/Security/GetInventoryConfig",
        //        dataType: "json"
        //    }).then(function (res1) {
        //        if (res1.data.IsSuccess && res1.data.Data) {
        //            $scope.Config = res1.data.Data;

        //            $timeout(function () {
        //                $scope.$apply(function () {
        //                    if ($scope.Config.AllowBilledQty == true)
        //                        $scope.HideShow.BilledQty = false;
        //                    else
        //                        $scope.HideShow.BilledQty = true;

        //                    if ($scope.Config.AllowDiscountAmount == true)
        //                        $scope.HideShow.DiscountAmt = false;
        //                    else
        //                        $scope.HideShow.DiscountAmt = true;

        //                    if ($scope.Config.AllowDiscountPer == true)
        //                        $scope.HideShow.DiscountPer = false;
        //                    else
        //                        $scope.HideShow.DiscountPer = true;

        //                    if ($scope.Config.AllowDiscountPer == false && $scope.Config.AllowDiscountAmount == false)  
        //                        $scope.HideShow.Discount = true;
        //                    else
        //                        $scope.HideShow.Discount = false;

        //                    if ($scope.Config.ShowCurrentBalance == true)
        //                        $scope.HideShow.CurrentBalance = false;
        //                    else
        //                        $scope.HideShow.CurrentBalance = true;

        //                    if ($scope.Config.AllowFreeQty == true)
        //                        $scope.HideShow.FreeQty = false;
        //                    else
        //                        $scope.HideShow.FreeQty = true;

        //                    if ($scope.Config.AllowSchameAmount == true)
        //                        $scope.HideShow.SchemeAmt = false;
        //                    else
        //                        $scope.HideShow.SchemeAmt = true;

        //                    if ($scope.Config.AllowSchamePer == true)
        //                        $scope.HideShow.SchemePer = false;
        //                    else
        //                        $scope.HideShow.SchemePer = true;

        //                    if ($scope.Config.AllowSchamePer == false && $scope.Config.AllowSchameAmount == false)
        //                        $scope.HideShow.Scheme = true;
        //                    else
        //                        $scope.HideShow.Scheme = false;


        //                });
        //            });
        //        }
        //    }, function (reason) {
        //        Swal.fire('Failed' + reason);
        //    });

        //    $http({
        //        method: 'GET',
        //        url: base_url + "Account/Creation/GetVoucherList?voucherType=" + VoucherType,
        //        dataType: "json"
        //    }).then(function (res) {
        //        if (res.data.IsSuccess && res.data.Data) {
        //            $scope.VoucherTypeColl = res.data.Data;

        //            $http({
        //                method: 'GET',
        //                url: base_url + "Account/Creation/GetCostClassForEntry",
        //                dataType: "json"
        //            }).then(function (res1) {
        //                if (res1.data.IsSuccess && res1.data.Data) {
        //                    $scope.CostClassColl = res1.data.Data;

        //                    $timeout(function () {
        //                        $scope.$apply(function () {
        //                            if ($scope.VoucherTypeColl.length > 0) {
        //                                $scope.SelectedVoucher = $scope.VoucherTypeColl[0];
        //                                $scope.beData.VoucherId = $scope.SelectedVoucher.VoucherId;
        //                            }

        //                            if ($scope.CostClassColl.length > 0) {
        //                                $scope.SelectedCostClass = $scope.CostClassColl[0];
        //                                $scope.beData.CostClassId = $scope.SelectedCostClass.CostClassId;
        //                            }

        //                            if ($scope.VoucherTypeColl.length <= 1)
        //                                $scope.HideShow.VoucherType = true;
        //                            else
        //                                $scope.HideShow.VoucherType = false;

        //                            if ($scope.CostClassColl.length <= 1)
        //                                $scope.HideShow.CostClass = true;
        //                            else
        //                                $scope.HideShow.CostClass = false;

        //                            $scope.getVoucherNo();
        //                        });
        //                    });


        //                }
        //            }, function (reason) {
        //                Swal.fire('Failed' + reason);
        //            });

        //        }
        //    }, function (reason) {
        //        Swal.fire('Failed' + reason);
        //    });

        //}


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
                url: base_url + "Setup/Security/GetPurchaseFeatures",
                dataType: "json"
            }).then(function (res1) {
                if (res1.data.IsSuccess && res1.data.Data) {
                    $scope.PurchaseFeatures = res1.data.Data;

                    $timeout(function () {
                        $scope.$apply(function () {
                            if ($scope.PurchaseFeatures.ProductWisePurchaseLedger == true)
                                $scope.HideShow.PurchaseLedger = true;
                            else
                                $scope.HideShow.PurchaseLedger = false;
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
            { headerName: "Days", field: "Days", filter: "agTextColumnFilter", width: 8, cellStyle: { 'text-align': 'left' } },
            { headerName: "Bill No.", field: "AutoManualNo", filter: "agTextColumnFilter", width: 180, cellStyle: { 'text-align': 'left' } },
            { headerName: "Ref. No.", field: "RefNo", filter: 'agTextColumnFilter', width: 110, cellStyle: { 'text-align': 'left' } },
            { headerName: "Product", field: "Name", filter: 'agTextColumnFilter', width: 140, cellStyle: { 'text-align': 'left' } },
            { headerName: "Code", field: "Code", filter: 'agTextColumnFilter', width: 140, cellStyle: { 'text-align': 'left' } },
            { headerName: "Alias", field: "Alias", filter: 'agTextColumnFilter', width: 150, cellStyle: { 'text-align': 'left' } },
            { headerName: "Qty.", field: "ActualQty", filter: 'agNumberColumnFilter', width: 80, cellStyle: { 'text-align': 'right' }, valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "Unit", field: "UnitName", filter: 'agTextColumnFilter', width: 90, cellStyle: { 'text-align': 'left' } },
            { headerName: "Rate", field: "Rate", filter: 'agNumberColumnFilter', width: 80, cellStyle: { 'text-align': 'right' }, valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "Amount", field: "Amount", filter: 'agNumberColumnFilter', width: 100, cellStyle: { 'text-align': 'right' }, valueFormatter: function (params) { return Numberformat(params.value); } },
            { headerName: "Purchaseman", field: "PurchaseMan", filter: 'agTextColumnFilter', width: 140, cellStyle: { 'text-align': 'left' } },
        ];

        $scope.gridOptions = {
						onCellContextMenu: onCellContextMenu, // Handle right-click event
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
            overlayLoadingTemplate: "Please Click the Load Bottom to display the data",
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
            GlobalServices.getListState(EntityId, $scope.gridOptions);
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

    $scope.ProductSelectionChange = function (itemDet) {
        $scope.sideBarData = itemDet.sideBarData;

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
            itemDet.Rate = itemDet.productDetail.PurchaseRate;
            itemDet.ClosingQty = $filter('formatNumber')(itemDet.productDetail.ClosingQty) + ' ' + itemDet.productDetail.BaseUnit;
            itemDet.UnitId = itemDet.productDetail.BaseUnitId;
            itemDet.UnitName = itemDet.productDetail.BaseUnit;
            itemDet.ProductLedgerId = itemDet.productDetail.PurchaseLedgerId;
            //itemDet.ActualQty = 0;
            //itemDet.BilledQty = 0;
            //itemDet.DiscountAmt = 0;
            //itemDet.DiscountPer = 0;
            $scope.ChangeItemRowValue(itemDet, 'product');
        }

    }

    $scope.PartySelectionChange = function (partyDet) {

        $scope.sideBarData = partyDet.partySideBarData;

        if (partyDet.PartyLedgerId && partyDet.PartyLedgerId > 0) {
            if (partyDet.PartyLedger) {
                if (partyDet.PurchaseInvoiceDetail) {
                    if (!partyDet.PurchaseInvoiceDetail.Buyes)
                        partyDet.PurchaseInvoiceDetail.Buyes = partyDet.PartyLedger.Name;

                    if (!partyDet.PurchaseInvoiceDetail.Address)
                        partyDet.PurchaseInvoiceDetail.Address = partyDet.PartyLedger.Address;

                    if (!partyDet.PurchaseInvoiceDetail.PurchaseTaxNo)
                        partyDet.PurchaseInvoiceDetail.PurchaseTaxNo = partyDet.PartyLedger.PanVat;

                    if (!partyDet.PurchaseInvoiceDetail.PhoneNo)
                        partyDet.PurchaseInvoiceDetail.PhoneNo = partyDet.PartyLedger.MobileNo1;
                }
            }
            $('#frmPurchaseInvoiceDetailsModel').modal('show');
        } else {

            $scope.search = "";
            $scope.RefVoucherNoColl = [];
            //$('#cboRefVoucherNo').val(null).trigger('change');
            //var arr = [];
            //$('#cboRefVoucherNo').val(arr).trigger('change');

            $scope.gridOptions.api.setRowData($scope.RefItemAllocationColl);
            $scope.RefItemAllocationColl = [];
            partyDet.PurchaseInvoiceDetail = {};
            partyDet.ItemDetailsColl = [];
            $scope.AddRowInItemDetails(0);
            $scope.CalculateTotalAndSubTotal();
            $('#frmPurchaseInvoiceDetailsModel').modal('hide');
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
                funName = "getPurchaseAllotmentPartyDetails";
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

                        $scope.beData.PurchaseInvoiceDetail.Description = tmpdata.RefNo;

                        $scope.beData.PurchaseInvoiceDetail.Goods = tmpdata.DeliveryNoteDetail.RegdNo;

                        $scope.beData.PurchaseInvoiceDetail.Buyes = tmpdata.DeliveryNoteDetail.Buyes;
                        $scope.beData.PurchaseInvoiceDetail.Address = tmpdata.DeliveryNoteDetail.Address;
                        $scope.beData.PurchaseInvoiceDetail.PhoneNo = tmpdata.DeliveryNoteDetail.PhoneNo;
                        $scope.beData.PurchaseInvoiceDetailPurchaseTaxNo = tmpdata.DeliveryNoteDetail.PurchaseTaxNo;

                        $scope.beData.PurchaseInvoiceDetail.DriverName = tmpdata.DeliveryNoteDetail.DriverName;
                        $scope.beData.PurchaseInvoiceDetail.DriverContactNo = tmpdata.DeliveryNoteDetail.DriverContactNo;
                    }
                    else if (refVType == 4) {
                        $scope.beData.PurchaseInvoiceDetail.Buyes = tmpdata.Buyes;
                        $scope.beData.PurchaseInvoiceDetail.Address = tmpdata.Address;
                        $scope.beData.PurchaseInvoiceDetail.PhoneNo = tmpdata.PhoneNo;
                        $scope.beData.PurchaseInvoiceDetail.PurchaseTaxNo = tmpdata.PurchaseTaxNo;
                        $scope.beData.PurchaseInvoiceDetail.CreditDays = tmpdata.CreditDays;
                        $scope.beData.PurchaseInvoiceDetail.Description = tmpdata.Description;

                        $scope.beData.PurchaseInvoiceDetail.OwnerName = tmpdata.OwnerName;
                        $scope.beData.PurchaseInvoiceDetail.OwnerContactNo = tmpdata.OwnerContactNo;
                        $scope.beData.PurchaseInvoiceDetail.DriverName = tmpdata.DriverName;
                        $scope.beData.PurchaseInvoiceDetail.DriverContactNo = tmpdata.DriverContactNo;
                        $scope.beData.PurchaseInvoiceDetail.DriverAddress = tmpdata.DriverAddress;
                        $scope.beData.PurchaseInvoiceDetail.LicenseNo = tmpdata.LicenseNo;

                        $scope.beData.PurchaseInvoiceDetail.Goods = tmpdata.Goods;
                        $scope.beData.PurchaseInvoiceDetail.Quantity = tmpdata.Quantity;

                        $scope.beData.PurchaseInvoiceDetail.TotalWT = tmpdata.TotalWT;
                        $scope.beData.PurchaseInvoiceDetail.FreightRate = tmpdata.FreightRate;
                        $scope.beData.PurchaseInvoiceDetail.AdvancePayment = tmpdata.AdvancePayment;

                        $scope.beData.PurchaseInvoiceDetail.OtherRefereces = tmpdata.OtherRefereces;
                        $scope.beData.PurchaseInvoiceDetail.TermsOfPayment = tmpdata.TermsOfPayment;
                        $scope.beData.PurchaseInvoiceDetail.TermsOfDelivery = tmpdata.TermsOfDelivery;
                        $scope.beData.PurchaseInvoiceDetail.Destination = tmpdata.Destination;
                        $scope.beData.PurchaseInvoiceDetail.DeliveryThrough = tmpdata.DeliveryThrough;
                        $scope.beData.PurchaseInvoiceDetail.DeliveryDocNo = tmpdata.DeliveryDocNo;
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

        $('#frmPurchaseInvoiceDetailsModel').modal('hide');
    };
    $scope.RefVoucherChange = function (refVType) {

        $scope.RefVoucherNoColl = [];
        $scope.RefItemAllocationColl = [];

        var funName = "getPendingReceiptNote";

        if (refVType == 1)
            funName = "getPendingReceiptNote";
        else if (refVType == 2)
            funName = "getPendinPurchaseOrder";
        else if (refVType == 3)
            funName = "getPendingDispatchSection";
        else if (refVType == 4)
            funName = "getPendinPurchaseAllotment";
        else if (refVType == 5)
            funName = "getPendinPurchaseQuotation";
        else
            funName = "getPendingReceiptNote";

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

    $scope.SavePurchaseInvoice = function () {

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
                        url: base_url + "Inventory/Transaction/SaveUpdatePurchaseInvoice",
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
                            $scope.lastTranId = res.data.RId;
                            $scope.lastVoucherId = $scope.SelectedVoucher.VoucherId;

                            if ($scope.SelectedVoucher.PrintVoucherAfterSaving == true)
                                $scope.Print();

                            $scope.Clear();
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


        if ($scope.HideShow.Godown == false) {
            if ($scope.beData.GodownId) {

                if ($scope.beData.GodownId == null || $scope.beData.GodownId == 0) {
                    result = false;
                    Swal.fire('Please ! Select Valid Godown Name');
                }

            } else {
                result = false;
                Swal.fire('Please ! Select Valid Godown Name');
            }
        }

        return result;
    }

    $scope.GetData = function () {

        var vDate = new Date();
        if ($scope.beData.VoucherDateDet) {
            vDate = $filter('date')(new Date($scope.beData.VoucherDateDet.dateAD), 'yyyy-MM-dd');
        }

        var tmpPurchase = {
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
            PurchaseLedgerId: ($scope.beData.PurchaseLedgerId ? $scope.beData.PurchaseLedgerId : 0),
            TotalAmount: $scope.beData.TotalAmount,
            AgentId: $scope.beData.AgentId ? $scope.beData.AgentId : 0,
            PartyCostCenter: $scope.beData.PartyCostCenter ? $scope.beData.PartyCostCenter : 0,
            TranCostCenter: $scope.beData.TranCostCenter ? $scope.beData.TranCostCenter : 0,
            EntryDate: vDate,
            BranchId: ($scope.beData.BranchId ? $scope.beData.BranchId : 0),
            IsAbbInvoice: false,
            ItemAllocationColl: [],
            AditionalCostColl: $scope.beData.AditionalCostColl,
            PurchaseInvoiceDetail: $scope.beData.PurchaseInvoiceDetail,
            GodownId: $scope.beData.GodownId
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
                    GodownId: tmpPurchase.GodownId
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
                        GodownId: tmpPurchase.GodownId,
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
                        BundleId: 0,
                        BundleQty: 0,
                        RegdNo: '',
                        EngineNo: '',
                        ChassisNo: '',
                        Model: '',
                        CodeNo: '',
                        Color: '',
                        KeyNo: '',
                        MFGYear: 0,
                        Type: '',
                    });

                tmpPurchase.ItemAllocationColl.push(itemAllocation);
            }
        });


        return tmpPurchase;
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
                    voucherDate: $scope.beData.VoucherDateDet ? ($filter('date')(new Date($scope.beData.VoucherDateDet.dateAD)), 'yyyy-MM-dd') : new Date()
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
                    PurchaseLedgerId: null,
                    PurchaseledgerDetail: null,
                    TranCostCenter: null,
                    PartyCostCenter: null,
                    PurchasecostcenterDetail: null,
                    PurchaseMan: null,
                    PurchasemanSideBarData: null,
                    CurRate: 1,
                    ItemDetailsColl: [],
                    AditionalCostColl: [],
                    AttechFiles: [],
                    SubTotal: 0,
                    Total: 0,
                    Narration: '',
                    VoucherDate: new Date(),
                    PurchaseInvoiceDetail: {}
                };

                $scope.beData.ItemDetailsColl.push(
                    {
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
                        ALUnitId2: null
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

                $scope.getVoucherNo();
            }
        });
    };
    $scope.Print = function () {
        if ($scope.lastTranId || $scope.lastTranId > 0) {
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
	$scope.DownloadAsXls = function () {

        $scope.loadingstatus = 'running';
        showPleaseWait();

        var dataColl = $scope.GetDataForPrint();
        var paraData = {
             
        };

        $http({
            method: 'POST',
            url: base_url + "Global/PrintXlsReportData",
            headers: { 'Content-Type': undefined },

            transformRequest: function (data) {

                var formData = new FormData();
                formData.append("entityId", EntityId);
                formData.append("jsonData", angular.toJson(data.jsonData));
                formData.append("paraData", angular.toJson(paraData));
                formData.append("RptPath", "");
                return formData;
            },
            data: { jsonData: dataColl }
        }).then(function (res) {

            $scope.loadingstatus = "stop";
            hidePleaseWait();
            if (res.data.IsSuccess && res.data.Data) {
                down_file(base_url + "//" + res.data.Data.ResponseId, "PurchaseInvoice.xlsx");
            }

        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            Swal.fire(errormessage);
        });
    }
	    $scope.saveRptListState = function () {
        GlobalServices.saveRptListState(EntityId, $scope.gridOptions);
    };
	
	 $scope.DelListState = function () {
        GlobalServices.delListStateRpt(EntityId);
    }
	
    function onCellContextMenu(event) {
        GlobalServices.onCellContextMenu(event, $scope.gridOptions, contextMenu);
    }

    // Hide context menu when clicking outside
    document.addEventListener('click', function () {
        if (contextMenu.contains(event.target)) {
            return;
        }
        contextMenu.style.display = 'none';
    });

    $(document).ready(function () {
        $(this).bind("contextmenu", function (e) {
            e.preventDefault();
        });
    });

});