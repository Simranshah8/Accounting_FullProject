app.controller("VoucherModeController", function ($scope, $http, $filter, $timeout, GlobalServices) {
    $scope.Title = 'Voucner Mode';
    var glSrv = GlobalServices;
    LoadData();

    function LoadData() {

        $scope.LedgerGroupList = [];

        $('.select2').select2({
            allowClear: true, 
        });

        $scope.RefFieldAsColl = GlobalServices.getRefFieldAs();
        
        $scope.ItemUDFFiledAfterColl = [{ id: 1, text: 'Particulars' }, { id: 2, text: 'Description' }, { id: 3, text: 'ItemLedger' }, { id: 4, text: 'Godown' }, { id: 5, text: 'ClosingStock' }, { id: 6, text: 'Batch' },
            { id: 7, text: 'Qty' }, { id: 8, text: 'Rate' }, { id: 9, text: 'Discount' }, { id: 10, text: 'Narration' }, { id: 11, text: 'Amount' }, { id: 12, text: 'Excise' }, { id: 13, text: 'Vat' }, { id: 14, text: 'On Action' }];

        $scope.VoucherUDFFiledAfterColl = [{ id: 1, text: 'Invoice Details' }, { id: 2, text: 'Buyer Details' }, { id: 3, text: 'Vehicle Details' }, { id: 4, text: 'Main Page' }, { id: 5, text: 'General' }];

        $scope.ForTypeColl = [{ id: 1, text: 'Ledger Group' }, { id: 2, text: 'Salesman' }, { id: 3, text: 'Tran CostCenter' }, { id: 4, text: 'Party CostCenter' }];
        $scope.VoucherRelation = [{ id: 1, text: 'One To One' }, { id: 2, text: 'Many To One' }, { id: 3, text: 'Optional' }];

        $scope.PkTablesColl = [];
        $scope.PkTablesColl_Qry = [];
        $http.get(base_url + "Setup/ReportWriter/GetPKTables").then(function (res) {
            $scope.PkTablesColl = res.data.Data;
            $scope.PkTablesColl_Qry = mx(res.data.Data);
        }, function (reason) { alert('Failed: ' + reason); });

        $scope.comDet = {};
        GlobalServices.getCompanyDet().then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.comDet = res.data.Data;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        $scope.VoucherDateAsColl = glSrv.getVoucherDataAs();
        $scope.DateStyles = glSrv.getDateStyle();
        $scope.DateFormats = glSrv.getDateFormat();
        $scope.RefQtyAsColl = glSrv.getRefQtyAs();
        $scope.PrintPreviewAsColl = [{ id: 1, text: 'Modal Dialog' }, { id: 2, text: 'New Tab' }, { id: 3, text: 'Direct Print' }];
        $scope.VoucherSearchOptions = [{ text: 'Name', value: 'V.VoucherName', searchType: 'text' }, { text: 'Abbreviation', value: 'V.Abbreviation', searchType: 'text' }, { text: 'Branch', value: 'B.Name', searchType: 'text' }];

        $scope.AditionalCostAsColl = [{ id: 1, text: 'Ref. Voucher' }, { id: 2, text: 'Base Voucher' }];
        $scope.DiscountOnColl = [{ id: 2, text: 'Amount' }, { id: 1, text: 'Qty' }];

        $scope.VoucherWiseRefVoucherColl = [
            { voucherType: 6, id: 1, text: 'Purchase Order' },
            { voucherType: 7, id: 1, text: 'Quotation' }, { voucherType: 7, id: 3, text: 'Material Request' },
            { voucherType: 8, id: 1, text: 'Receipt Note' }, { voucherType: 8, id: 2, text: 'Purchase Order' },
            { voucherType: 10, id: 1, text: 'Purchase Invoice' },
            { voucherType: 12, id: 1, text: 'Sales Order' }, { voucherType: 12, id: 2, text: 'Sales Quotation' },
            { voucherType: 14, id: 2, text: 'Sales Order' }, { voucherType: 14, id: 1, text: 'Delivery Note' },  { voucherType: 14, id: 3, text: 'Sales Quotation' },
            { voucherType: 16, id: 1, text: 'Sales Invoice' },
        ];

        $scope.ProductRateAsColl = [{ id: 1, text: 'COST' }, { id: 2, text: 'SALE' }, { id: 3, text: 'TRADE' }, { id: 4, text: 'MRP' }, { id: 5, text: 'PRODUCT COSTING ' },]
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

        $scope.AddDeSignColl = glSrv.getAdditionDeducationSign();
        $scope.confirmMSG = glSrv.getConfirmMSG();
        //$scope.numberingMethods = GlobalServices.getNumberingMethod();
        //$scope.DateStyleColl = GlobalServices.getDateStyle();
        //$scope.DateFormatColl = GlobalServices.getDateFormat();

        // $scope.NumberingMethodList = GlobalServices.getNumberingMethod();

        $scope.numberingMethods = glSrv.getNumberingMethod();

        $scope.NumberingMethodList = glSrv.getNumberingMethod();

        $scope.newVoucherMode = {
            TranId: 0,
            VoucherModeId: 0,
            VoucherSNo:0,
            VoucherName: '',
            VoucherType: '',
            NumberingMethod: 1,
            Abbreviation: '',
            StartNumber: 1,
            NumbericalPartWidth: 4,
            LedgerId: 0,
            AgentId: 0,
            ActivePaymentUnder:false,
            ShowWarringForBackDate:true,
            AllowAutoPrintOnDefaultPrinter:false,
            PrintVoucherAfterSaving:true,
            PreventDuplicateVoucherNo: false,
            PrefilZero: true,
            UseRefNo: false,
            RefNoName:'Ref No.',
            ShowTime: false,
            UseEffectiveDate:false,
            AllowMultipleCurrency:false,
            IsMandatoryRefNo: false,
            UseCommonNarration: true,
            EachNarrationEntry: false,
            ShowDocumentDetails: true,
            IsAbbInvoice: false,
            IsActive:true,
            CanChangeLedgerAndAgent: true,
            UsePartyCostCenter: false,
            UseTranCostCenter: false,
            PrefixColl: [],
            SuffixColl: [],
            StartingNumberColl: [],
            AditionalChargeColl:[],
            LedgerColl: [],
            LedgerPurchaseColl: [],
            LedgerSalesColl: [], 
            BOId: 1,
            PrintVoucerAfterSaving: true,
            PrintVoucherAfterModify: true,
            AllwAutoPrintOnDefaultPrinter: false,
            ShowPrintPreview: true,
            ActiveConfirmationMSG:false,
            NoOfCopies: 1,
            NoOfTemplates: 1,
            Mode: 'Save',
            AutoProductRate: true,
            ActiveForBranch: true,
            ActivePartyDetails: true,
            ActiveAdditionalCost:true,
            EntryDateLabel: 'Entry Date',
            VoucherDateLabel: 'Date',
            VoucherDateAs:1,
            LedgerGroupPurchasePartyColl: [],
            LedgerGroupSalesPartyColl: [],
            LedgerGroupPurchaseAccountColl: [],
            LedgerGroupSalesAccountColl: [],
            LedgerGroupAdditionalPurchaseColl: [],
            LedgerGroupAdditionalSalesColl: [],
            GodownColl: [],
            GodownColl_TMP:[],
            ProductGroupColl: [],
            ProductGroupColl_TMP: [],
            DebtorTypeForTran_TMP: [],
            CostCategoryPurchaseColl: [],
            CostCategorySalesColl: [],
            CostCategoryInventoryColl: [],
            SalesManColl: [],
            LedgerGroupForParty:[],
            LedgerGroupForTran: [],
            LedgerGroupForAdditionalCost: [],
            CostCategoryForParty: [],
            CostCategoryForTran: [],            
            AgentColl: [],
            Product: {},
            FixedProduct: {},
            ShowVatRegisterDialog: false,
            BatchWiseClosingList: false,
            VatRate: 13,
            NoOfDecimalPlaces: 2,
            NumericalPartWidth: 0,
            IsJewellery: false,
            Jewellery: {},
            NotEffectQty:false,
            ActiveBarCode: false,
            ActiveSummaryEntry: false,
            ActiveTender: false,
            MandatoryCreditDays: false,
            VoucherProductUDFColl: [],
            VoucherUDFColl: [],
            PrintPreviewAs: 1,
            ActiveCompanyWiseProduct: false,
            ShowPendingVoucher:true,
            NotEffectInVatRegister: false,
            AutoPost: true,
            AllowCashPurchaseSale: false,
            AditionalChargeRule: [],
            ActiveBranch: false,
            ActiveBillingShipingAddress: false,
            AditionalCostAs: 1,
            EditablePartyDetail: true,
            NeedPostRemarks: false,
            ProfitCenter1: false,
            ProfitCenter2: false,
            ProfitCenter3: false,
            ProfitCenter4: false,
            ProfitCenter5: false,
            MultipleBatch: false,
            MultipleFixedProduct: false,
            AutoCreateParty: false,
            UseSubLedger: false,
            JournalVoucherId:null,
            LedgerAllocationColl: [],
            RefFieldAs: 2,
            DateStyle:2,
            DateFormat: 3,
            RefVoucherRelation: 3,
            MaxCreditDays: 0,
            ActiveMultipleReceiptNo: false,
            ActiveProject: false,
            ActiveTwoFactor: false,
            ActiveAditionalCostOnTheBasis:false,
            
        };
        $scope.newVoucherMode.VoucherProductUDFColl.push({ ColWidth:120});
        $scope.newVoucherMode.VoucherUDFColl.push({ DefaultValue:'',ColWidth:3});

        $scope.newVoucherMode.Product = {
            AllowDiscount:false,
            ShowDiscountAmt: false,
            ShowDiscountPer: false,
            ShowDiscountAfterAmt: false,
            AllowScheme: false,
            ShowSchemeAmt: false,
            ShowSchemePer: false,
            AllowFreeQty: false,
            ShowRate: true,
            ShowAmount: true,
            CanEditProductAmount: false,
            CanEditRate: true,            
            ChangeAmtReflectToRateQty:2,
            RefQtyAs: 1,
            ShowAlternateUnit: false,
            PartyWiseProduct: false,
            BatchNo: false,
            UseMFG: false,
            UseEXP: false,
            MFGDateStyle: 1,
            EXPDateStyle: 1,
            MFGDateFormat: 1,
            EXPDateFormat: 1,
            ProductWiseLedger: false,
            ProductWiseExciseDuty: false,
            ProductWiseVat: false,
            ProductWiseTaxable:false,
            ProductWiseAdditionalCost: false,
            ShowProdctRateDetails: false,
            ShowProductQuantityPoint: false,
            ShowCurrentStock: false,
            ActiveAlternateUnitColumn1: false,
            ActiveAlternateUnitColumn1: false,
            ActiveActualAndBillQty: false,
            ShowProductWiseLedger: false,
            ShowProductDescription: false,
              VoucherWiseDecimalPlaces:false,
                QtyNoOfDecimalPlaces:0,
                RateNoOfDecimalPlaces:2,
            AmountNoOfDecimalPlaces: 2,
            UseMRP: false,
            UsePurchaseSalesRate: false,
            UseTradeRate: false,
            NotEffectQty: false,
            AllowDuplicateProduct: false,
            IsScrap: false,
            DiscountOn: 2,
            DualTaxMode:true,
        };
        $scope.newVoucherMode.FixedProduct = {
            ShowRegdNo: false,
            ShowChassisNo: false,
            ShowEngineNo: false,
            ShowModel: false,
            ShowType: false,
            ShowColor: false,
            ShowKeyNo: false,
            ShowCodeNo: false,
            ShowMFGYear: false
        };
        $scope.newVoucherMode.Jewellery = {
            Loss: true,
            Fine: false,
            Processing: false
        };

        $scope.DataTypeColl = [];
        $http({
            method: 'GET',
            url: base_url + "Global/GetDataType",
            dataType: "json",
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.DataTypeColl = res.data.Data;
            }
            else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

         
        $http({
            method: 'GET',
            url: base_url + "Account/Creation/GetAllDebtorTypeList",
            dataType: "json"        
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.DebtorsTypeColl = res.data.Data;
            }
        }, function (reason) {
            alert('Failed' + reason);
        });


        $scope.VoucherTypeList = [];
        $http({
            method: 'GET',
            url: base_url + "Account/Creation/GetVoucherTypes",
            dataType: "json",
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.VoucherTypeList = res.data.Data;
            }
            else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        $scope.SalesManList = [];
        $http({
            method: 'GET',
            url: base_url + "Account/Creation/GetAllSalesMan",
            dataType: "json"
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.SalesManList = res.data.Data;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        $scope.BranchList = [];
        $http({
            method: 'GET',
            url: base_url + "Setup/Security/GetAllBranchList",
            datatype: "json",
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.BranchList = res.data.Data;
            }
        }, function (reason) {
            swal.fire('failed' + reason);
        });
        $scope.LedgerGroupList = [];
        $http({
            method: 'GET',
            url: base_url + "Account/Creation/GetAllLedgerGroupList",
            datatype: "json",
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.LedgerGroupList = res.data.Data;
            }
        }, function (reason) {
            swal.fire('failed' + reason);
        });
        $scope.CostCategoryList = [];
        $http({
            method: 'GET',
            url: base_url + "Account/Creation/GetAllParentCategoryList",
            datatype: "json",
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.CostCategoryList = res.data.Data;
            }
        }, function (reason) {
            swal.fire('failed' + reason);
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
        $scope.ProductGroupList = [];
        $http({
            method: 'GET',
            url: base_url + "Inventory/Creation/GetProductGroup",
            datatype: "json",
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.ProductGroupList = res.data.Data;
            }
        }, function (reason) {
            swal.fire('failed' + reason);
        });


        $scope.JournalVoucherColl = [];
        $http({
            method: 'GET',
            url: base_url + "Account/Creation/GetVoucherList?voucherType=3",
            dataType: "json"
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.JournalVoucherColl = res.data.Data;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

    }

    $scope.LoadDefaultData = function () {

        $scope.AddBlankRow();


      
    };

    $scope.AddBlankRow = function ()
    {

        if (!$scope.newVoucherMode.LedgerAllocationColl || $scope.newVoucherMode.LedgerAllocationColl.length == 0) {
            $scope.newVoucherMode.LedgerAllocationColl = [];
            $scope.newVoucherMode.LedgerAllocationColl.push({});
        }
        if (!$scope.newVoucherMode.VoucherProductUDFColl || $scope.newVoucherMode.VoucherProductUDFColl.length == 0) {
            $scope.newVoucherMode.VoucherProductUDFColl = [];
            $scope.newVoucherMode.VoucherProductUDFColl.push({ColWidth:120});
        }

        if (!$scope.newVoucherMode.VoucherUDFColl || $scope.newVoucherMode.VoucherUDFColl.length == 0) {
            $scope.newVoucherMode.VoucherUDFColl = [];
            $scope.newVoucherMode.VoucherUDFColl.push({ DefaultValue:'',ColWidth:3});
        }

        if (!$scope.newVoucherMode.PrefixColl || $scope.newVoucherMode.PrefixColl.length == 0) {
            $scope.newVoucherMode.PrefixColl = [];
            $scope.newVoucherMode.PrefixColl.push({
                ApplicableFromDet: null,
                PrefixCharacters: ''
            });
        }
            
        if (!$scope.newVoucherMode.SuffixColl || $scope.newVoucherMode.SuffixColl.length == 0) {
            $scope.newVoucherMode.SuffixColl = [];
            $scope.newVoucherMode.SuffixColl.push({
                ApplicableFromDet: null,
                SuffixCharacters: ''
            });
        }
            

        if (!$scope.newVoucherMode.StartingNumberColl || $scope.newVoucherMode.StartingNumberColl.length == 0) {
            $scope.newVoucherMode.StartingNumberColl = [];
            $scope.newVoucherMode.StartingNumberColl.push({
                ApplicableFromDet: null,
                NumberingMethod: 1,
                StartingNumber: 0,
            });
        }

        if (!$scope.newVoucherMode.AditionalChargeColl || $scope.newVoucherMode.AditionalChargeColl.length == 0) {
            $scope.newVoucherMode.AditionalChargeColl = [];
            $scope.newVoucherMode.AditionalChargeColl.push({
                LedgerId: null,
                SNo:0,
            });
        }

        
         
        if (!$scope.newVoucherMode.LedgerPurchaseColl || $scope.newVoucherMode.LedgerPurchaseColl.length == 0) {
            $scope.newVoucherMode.LedgerPurchaseColl = [];
            $scope.newVoucherMode.LedgerPurchaseColl.push({});
        }
         
        if (!$scope.newVoucherMode.LedgerSalesColl || $scope.newVoucherMode.LedgerSalesColl.length == 0) {
            $scope.newVoucherMode.LedgerSalesColl = [];
            $scope.newVoucherMode.LedgerSalesColl.push({});
        }
         
        if (!$scope.newVoucherMode.LedgerGroupPurchasePartyColl || $scope.newVoucherMode.LedgerGroupPurchasePartyColl.length == 0) {
            $scope.newVoucherMode.LedgerGroupPurchasePartyColl = [];
            $scope.newVoucherMode.LedgerGroupPurchasePartyColl.push({});
        }
         
        if (!$scope.newVoucherMode.LedgerGroupSalesPartyColl || $scope.newVoucherMode.LedgerGroupSalesPartyColl.length == 0) {
            $scope.newVoucherMode.LedgerGroupSalesPartyColl = [];
            $scope.newVoucherMode.LedgerGroupSalesPartyColl.push({});
        }
         
        if (!$scope.newVoucherMode.LedgerGroupPurchaseAccountColl || $scope.newVoucherMode.LedgerGroupPurchaseAccountColl.length == 0) {
            $scope.newVoucherMode.LedgerGroupPurchaseAccountColl = [];
            $scope.newVoucherMode.LedgerGroupPurchaseAccountColl.push({});
        }
         
        if (!$scope.newVoucherMode.LedgerGroupSalesAccountColl || $scope.newVoucherMode.LedgerGroupSalesAccountColl.length == 0) {
            $scope.newVoucherMode.LedgerGroupSalesAccountColl = [];
            $scope.newVoucherMode.LedgerGroupSalesAccountColl.push({});
        }
         
        if (!$scope.newVoucherMode.LedgerGroupAdditionalSalesColl || $scope.newVoucherMode.LedgerGroupAdditionalSalesColl.length == 0) {
            $scope.newVoucherMode.LedgerGroupAdditionalSalesColl = [];
            $scope.newVoucherMode.LedgerGroupAdditionalSalesColl.push({});
        }
         
        if (!$scope.newVoucherMode.LedgerGroupAdditionalPurchaseColl || $scope.newVoucherMode.LedgerGroupAdditionalPurchaseColl.length == 0) {
            $scope.newVoucherMode.LedgerGroupAdditionalPurchaseColl = [];
            $scope.newVoucherMode.LedgerGroupAdditionalPurchaseColl.push({});
        }
         
        if (!$scope.newVoucherMode.GodownColl_TMP || $scope.newVoucherMode.GodownColl_TMP.length == 0) {
            $scope.newVoucherMode.GodownColl_TMP = [];
            $scope.newVoucherMode.GodownColl_TMP.push({});
        }
         
        if (!$scope.newVoucherMode.ProductGroupColl_TMP || $scope.newVoucherMode.ProductGroupColl_TMP.length == 0) {
            $scope.newVoucherMode.ProductGroupColl_TMP = [];
            $scope.newVoucherMode.ProductGroupColl_TMP.push({});
        }

        if (!$scope.newVoucherMode.DebtorTypeForTran_TMP || $scope.newVoucherMode.DebtorTypeForTran_TMP.length == 0) {
            $scope.newVoucherMode.DebtorTypeForTran_TMP = [];
            $scope.newVoucherMode.DebtorTypeForTran_TMP.push({});
        }

        
        if (!$scope.newVoucherMode.CostCategoryPurchaseColl || $scope.newVoucherMode.CostCategoryPurchaseColl.length == 0) {
            $scope.newVoucherMode.CostCategoryPurchaseColl = [];
            $scope.newVoucherMode.CostCategoryPurchaseColl.push({});
        }
         
        if (!$scope.newVoucherMode.CostCategorySalesColl || $scope.newVoucherMode.CostCategorySalesColl.length == 0) {
            $scope.newVoucherMode.CostCategorySalesColl = [];
            $scope.newVoucherMode.CostCategorySalesColl.push({});
        }
         
        if (!$scope.newVoucherMode.CostCategoryInventoryColl || $scope.newVoucherMode.CostCategoryInventoryColl.length == 0) {
            $scope.newVoucherMode.CostCategoryInventoryColl = [];
            $scope.newVoucherMode.CostCategoryInventoryColl.push({});
        }

        if (!$scope.newVoucherMode.SalesManColl || $scope.newVoucherMode.SalesManColl.length == 0) {
            $scope.newVoucherMode.SalesManColl = [];
            $scope.newVoucherMode.SalesManColl.push({});
        }
    }


    $scope.AddItemUdf = function (ind) {
        if ($scope.newVoucherMode.VoucherProductUDFColl[ind].Label && $scope.newVoucherMode.VoucherProductUDFColl[ind].Label.length > 0) {
            if ($scope.newVoucherMode.VoucherProductUDFColl.length > ind + 1) {
                $scope.newVoucherMode.VoucherProductUDFColl.splice(ind + 1, 0, {
                    ApplicableFromDet: null,
                    PrefixCharacters: '',
                    ColWidth:120,    
                })
            } else {
                $scope.newVoucherMode.VoucherProductUDFColl.push({
                    ApplicableFromDet: null,
                    PrefixCharacters: '',
                    ColWidth: 120,
                });
            }
        }

    };
    $scope.delItemUdf = function (ind) {
        if ($scope.newVoucherMode.VoucherProductUDFColl) {
            if ($scope.newVoucherMode.VoucherProductUDFColl.length > 1) {
                $scope.newVoucherMode.VoucherProductUDFColl.splice(ind, 1);
            }
        }
    };


    $scope.AddVoucherUdf = function (ind) {
        if ($scope.newVoucherMode.VoucherUDFColl[ind].Label && $scope.newVoucherMode.VoucherUDFColl[ind].Label.length > 0) {
            if ($scope.newVoucherMode.VoucherUDFColl.length > ind + 1) {
                $scope.newVoucherMode.VoucherUDFColl.splice(ind + 1, 0, {
                    ApplicableFromDet: null,
                    DefaultValue: '',
                    ColWidth:3,
                })
            } else {
                $scope.newVoucherMode.VoucherUDFColl.push({
                    ApplicableFromDet: null,
                    DefaultValue: '',
                    ColWidth: 3,
                });
            }
        }

    };
    $scope.delVoucherUdf = function (ind) {
        if ($scope.newVoucherMode.VoucherUDFColl) {
            if ($scope.newVoucherMode.VoucherUDFColl.length > 1) {
                $scope.newVoucherMode.VoucherUDFColl.splice(ind, 1);
            }
        }
    };


    $scope.AddVoucherLA = function (ind) {
        if ($scope.newVoucherMode.LedgerAllocationColl[ind].Particular && $scope.newVoucherMode.LedgerAllocationColl[ind].Particular.length > 0) {
            if ($scope.newVoucherMode.LedgerAllocationColl.length > ind + 1) {
                $scope.newVoucherMode.LedgerAllocationColl.splice(ind + 1, 0, {
                   
                })
            } else {
                $scope.newVoucherMode.LedgerAllocationColl.push({                  
                });
            }
        }

    };
    $scope.delVoucherLA = function (ind) {
        if ($scope.newVoucherMode.LedgerAllocationColl) {
            if ($scope.newVoucherMode.LedgerAllocationColl.length > 1) {
                $scope.newVoucherMode.LedgerAllocationColl.splice(ind, 1);
            }
        }
    };


    $scope.AddPrefix = function (ind)
    {
        if ($scope.newVoucherMode.PrefixColl[ind].ApplicableFromDet && $scope.newVoucherMode.PrefixColl[ind].PrefixCharacters.length > 0) {
            if ($scope.newVoucherMode.PrefixColl.length > ind + 1) {
                $scope.newVoucherMode.PrefixColl.splice(ind + 1, 0, {
                    ApplicableFromDet: null,
                    PrefixCharacters: ''
                })
            } else {
                $scope.newVoucherMode.PrefixColl.push({
                    ApplicableFromDet: null,
                    PrefixCharacters: ''
                });
            }
        }
        
    };
    $scope.delPrefix = function (ind) {
        if ($scope.newVoucherMode.PrefixColl) {
            if ($scope.newVoucherMode.PrefixColl.length > 1) {
                $scope.newVoucherMode.PrefixColl.splice(ind, 1);
            }
        }
    };
    $scope.AddLedger = function (ind) {
        if ($scope.newVoucherMode.AditionalChargeColl) {
            if ($scope.newVoucherMode.AditionalChargeColl.length > ind + 1) {
                $scope.newVoucherMode.AditionalChargeColl.splice(ind + 1, 0, {

                })
            } else {
                $scope.newVoucherMode.AditionalChargeColl.push({
                    SNo:0,
                });
            }
        }
    };
    $scope.delLedger = function (ind) {
        if ($scope.newVoucherMode.AditionalChargeColl) {
            if ($scope.newVoucherMode.AditionalChargeColl.length > 1) {
                $scope.newVoucherMode.AditionalChargeColl.splice(ind, 1);
            }
        }
    };
    $scope.AddLedgerPurchase = function (ind) {
        if ($scope.newVoucherMode.LedgerPurchaseColl) {
            if ($scope.newVoucherMode.LedgerPurchaseColl.length > ind + 1) {
                $scope.newVoucherMode.LedgerPurchaseColl.splice(ind + 1, 0, {

                })
            } else {
                $scope.newVoucherMode.LedgerPurchaseColl.push({

                });
            }
        }
    };
    $scope.delLedgerPurchase = function (ind) {
        if ($scope.newVoucherMode.LedgerPurchaseColl) {
            if ($scope.newVoucherMode.LedgerPurchaseColl.length > 1) {
                $scope.newVoucherMode.LedgerPurchaseColl.splice(ind, 1);
            }
        }
    };
    $scope.AddLedgerSales = function (ind) {
        if ($scope.newVoucherMode.LedgerSalesColl) {
            if ($scope.newVoucherMode.LedgerSalesColl.length > ind + 1) {
                $scope.newVoucherMode.LedgerSalesColl.splice(ind + 1, 0, {

                })
            } else {
                $scope.newVoucherMode.LedgerSalesColl.push({

                });
            }
        }
    };
    $scope.delLedgerSales = function (ind) {
        if ($scope.newVoucherMode.LedgerSalesColl) {
            if ($scope.newVoucherMode.LedgerSalesColl.length > 1) {
                $scope.newVoucherMode.LedgerSalesColl.splice(ind, 1);
            }
        }
    };
    $scope.AddLedgerGroupAdditionalPurchase = function (ind) {
        if ($scope.newVoucherMode.LedgerGroupAdditionalPurchaseColl) {
            if ($scope.newVoucherMode.LedgerGroupAdditionalPurchaseColl.length > ind + 1) {
                $scope.newVoucherMode.LedgerGroupAdditionalPurchaseColl.splice(ind + 1, 0, {

                })
            } else {
                $scope.newVoucherMode.LedgerGroupAdditionalPurchaseColl.push({

                });
            }
        }
    };
    $scope.delLedgerGroupAdditionalPurchase = function (ind) {
        if ($scope.newVoucherMode.LedgerGroupAdditionalPurchaseColl) {
            if ($scope.newVoucherMode.LedgerGroupAdditionalPurchaseColl.length > 1) {
                $scope.newVoucherMode.LedgerGroupAdditionalPurchaseColl.splice(ind, 1);
            }
        }
    };
    $scope.AddLedgerGroupAdditionalSales = function (ind) {
        if ($scope.newVoucherMode.LedgerGroupAdditionalSalesColl) {
            if ($scope.newVoucherMode.LedgerGroupAdditionalSalesColl.length > ind + 1) {
                $scope.newVoucherMode.LedgerGroupAdditionalSalesColl.splice(ind + 1, 0, {

                })
            } else {
                $scope.newVoucherMode.LedgerGroupAdditionalSalesColl.push({

                });
            }
        }
    };
    $scope.delLedgerGroupAdditionalSales = function (ind) {
        if ($scope.newVoucherMode.LedgerGroupAdditionalSalesColl) {
            if ($scope.newVoucherMode.LedgerGroupAdditionalSalesColl.length > 1) {
                $scope.newVoucherMode.LedgerGroupAdditionalSalesColl.splice(ind, 1);
            }
        }
    };
    $scope.AddLedgerGroupPurchaseAccount = function (ind) {
        if ($scope.newVoucherMode.LedgerGroupPurchaseAccountColl) {
            if ($scope.newVoucherMode.LedgerGroupPurchaseAccountColl.length > ind + 1) {
                $scope.newVoucherMode.LedgerGroupPurchaseAccountColl.splice(ind + 1, 0, {

                })
            } else {
                $scope.newVoucherMode.LedgerGroupPurchaseAccountColl.push({

                });
            }
        }
    };
    $scope.delLedgerGroupPurchaseAccount = function (ind) {
        if ($scope.newVoucherMode.LedgerGroupPurchaseAccountColl) {
            if ($scope.newVoucherMode.LedgerGroupPurchaseAccountColl.length > 1) {
                $scope.newVoucherMode.LedgerGroupPurchaseAccountColl.splice(ind, 1);
            }
        }
    };
    $scope.AddLedgerGroupSalesAccount = function (ind) {
        if ($scope.newVoucherMode.LedgerGroupSalesAccountColl) {
            if ($scope.newVoucherMode.LedgerGroupSalesAccountColl.length > ind + 1) {
                $scope.newVoucherMode.LedgerGroupSalesAccountColl.splice(ind + 1, 0, {

                })
            } else {
                $scope.newVoucherMode.LedgerGroupSalesAccountColl.push({

                });
            }
        }
    };
    $scope.delLedgerGroupSalesAccount = function (ind) {
        if ($scope.newVoucherMode.LedgerGroupSalesAccountColl) {
            if ($scope.newVoucherMode.LedgerGroupSalesAccountColl.length > 1) {
                $scope.newVoucherMode.LedgerGroupSalesAccountColl.splice(ind, 1);
            }
        }
    };
    $scope.AddLedgerGroupPurchaseParty = function (ind) {
        if ($scope.newVoucherMode.LedgerGroupPurchasePartyColl) {
            if ($scope.newVoucherMode.LedgerGroupPurchasePartyColl.length > ind + 1) {
                $scope.newVoucherMode.LedgerGroupPurchasePartyColl.splice(ind + 1, 0, {

                })
            } else {
                $scope.newVoucherMode.LedgerGroupPurchasePartyColl.push({

                });
            }
        }
    };
    $scope.delLedgerGroupPurchaseParty = function (ind) {
        if ($scope.newVoucherMode.LedgerGroupPurchasePartyColl) {
            if ($scope.newVoucherMode.LedgerGroupPurchasePartyColl.length > 1) {
                $scope.newVoucherMode.LedgerGroupPurchasePartyColl.splice(ind, 1);
            }
        }
    };
    $scope.AddLedgerGroupSalesParty = function (ind) {
        if ($scope.newVoucherMode.LedgerGroupSalesPartyColl) {
            if ($scope.newVoucherMode.LedgerGroupSalesPartyColl.length > ind + 1) {
                $scope.newVoucherMode.LedgerGroupSalesPartyColl.splice(ind + 1, 0, {

                })
            } else {
                $scope.newVoucherMode.LedgerGroupSalesPartyColl.push({

                });
            }
        }
    };
    $scope.delLedgerGroupSalesParty = function (ind) {
        if ($scope.newVoucherMode.LedgerGroupSalesPartyColl) {
            if ($scope.newVoucherMode.LedgerGroupSalesPartyColl.length > 1) {
                $scope.newVoucherMode.LedgerGroupSalesPartyColl.splice(ind, 1);
            }
        }
    };
    $scope.AddCostCategoryPurchase = function (ind) {
        if ($scope.newVoucherMode.CostCategoryPurchaseColl) {
            if ($scope.newVoucherMode.CostCategoryPurchaseColl.length > ind + 1) {
                $scope.newVoucherMode.CostCategoryPurchaseColl.splice(ind + 1, 0, {

                })
            } else {
                $scope.newVoucherMode.CostCategoryPurchaseColl.push({

                });
            }
        }
    };
    $scope.delCostCategoryPurchase = function (ind) {
        if ($scope.newVoucherMode.CostCategoryPurchaseColl) {
            if ($scope.newVoucherMode.CostCategoryPurchaseColl.length > 1) {
                $scope.newVoucherMode.CostCategoryPurchaseColl.splice(ind, 1);
            }
        }
    };
    $scope.AddCostCategorySales = function (ind) {
        if ($scope.newVoucherMode.CostCategorySalesColl) {
            if ($scope.newVoucherMode.CostCategorySalesColl.length > ind + 1) {
                $scope.newVoucherMode.CostCategorySalesColl.splice(ind + 1, 0, {

                })
            } else {
                $scope.newVoucherMode.CostCategorySalesColl.push({

                });
            }
        }
    };
    $scope.delCostCategorySales = function (ind) {
        if ($scope.newVoucherMode.CostCategorySalesColl) {
            if ($scope.newVoucherMode.CostCategorySalesColl.length > 1) {
                $scope.newVoucherMode.CostCategorySalesColl.splice(ind, 1);
            }
        }
    };
    $scope.AddCostCategoryInventory = function (ind) {
        if ($scope.newVoucherMode.CostCategoryInventoryColl) {
            if ($scope.newVoucherMode.CostCategoryInventoryColl.length > ind + 1) {
                $scope.newVoucherMode.CostCategoryInventoryColl.splice(ind + 1, 0, {

                })
            } else {
                $scope.newVoucherMode.CostCategoryInventoryColl.push({

                });
            }
        }
    };
    $scope.delCostCategoryInventory = function (ind) {
        if ($scope.newVoucherMode.CostCategoryInventoryColl) {
            if ($scope.newVoucherMode.CostCategoryInventoryColl.length > 1) {
                $scope.newVoucherMode.CostCategoryInventoryColl.splice(ind, 1);
            }
        }
    };
    $scope.AddProductGroup = function (ind) {
        if ($scope.newVoucherMode.ProductGroupColl_TMP) {
            if ($scope.newVoucherMode.ProductGroupColl_TMP.length > ind + 1) {
                $scope.newVoucherMode.ProductGroupColl_TMP.splice(ind + 1, 0, {

                })
            } else {
                $scope.newVoucherMode.ProductGroupColl_TMP.push({

                });
            }
        }
    };
    $scope.delProductGroup = function (ind) {
        if ($scope.newVoucherMode.ProductGroupColl_TMP) {
            if ($scope.newVoucherMode.ProductGroupColl_TMP.length > 1) {
                $scope.newVoucherMode.ProductGroupColl_TMP.splice(ind, 1);
            }
        }
    };

    $scope.AddDebtorType = function (ind) {
        if ($scope.newVoucherMode.DebtorTypeForTran_TMP) {
            if ($scope.newVoucherMode.DebtorTypeForTran_TMP.length > ind + 1) {
                $scope.newVoucherMode.DebtorTypeForTran_TMP.splice(ind + 1, 0, {

                })
            } else {
                $scope.newVoucherMode.DebtorTypeForTran_TMP.push({

                });
            }
        }
    };
    $scope.delDebtorType = function (ind) {
        if ($scope.newVoucherMode.DebtorTypeForTran_TMP) {
            if ($scope.newVoucherMode.DebtorTypeForTran_TMP.length > 1) {
                $scope.newVoucherMode.DebtorTypeForTran_TMP.splice(ind, 1);
            }
        }
    };
    $scope.AddGodown = function (ind) {
        if ($scope.newVoucherMode.GodownColl_TMP) {
            if ($scope.newVoucherMode.GodownColl_TMP.length > ind + 1) {
                $scope.newVoucherMode.GodownColl_TMP.splice(ind + 1, 0, {

                })
            } else {
                $scope.newVoucherMode.GodownColl_TMP.push({

                });
            }
        }
    };
    $scope.delGodown = function (ind) {
        if ($scope.newVoucherMode.GodownColl_TMP) {
            if ($scope.newVoucherMode.GodownColl_TMP.length > 1) {
                $scope.newVoucherMode.GodownColl_TMP.splice(ind, 1);
            }
        }
    };
    $scope.AddSalesMan = function (ind) {
        if ($scope.newVoucherMode.SalesManColl) {
            if ($scope.newVoucherMode.SalesManColl.length > ind + 1) {
                $scope.newVoucherMode.SalesManColl.splice(ind + 1, 0, {

                })
            } else {
                $scope.newVoucherMode.SalesManColl.push({

                });
            }
        }
    };
    $scope.delSalesMan = function (ind) {
        if ($scope.newVoucherMode.SalesManColl) {
            if ($scope.newVoucherMode.SalesManColl.length > 1) {
                $scope.newVoucherMode.SalesManColl.splice(ind, 1);
            }
        }
    };
    $scope.AddSuffix = function (ind) {

        if ($scope.newVoucherMode.SuffixColl[ind].ApplicableFromDet && $scope.newVoucherMode.SuffixColl[ind].SuffixCharacters.length > 0) {
            if ($scope.newVoucherMode.SuffixColl.length > ind + 1) {
                $scope.newVoucherMode.SuffixColl.splice(ind + 1, 0, {
                    ApplicableFromDet: null,
                    SuffixCharacters: ''
                })
            } else {
                $scope.newVoucherMode.SuffixColl.push({
                    ApplicableFromDet: null,
                    SuffixCharacters: ''
                });
            }
        } 
    
    };
    $scope.delSuffix = function (ind) {
        if ($scope.newVoucherMode.SuffixColl) {
            if ($scope.newVoucherMode.SuffixColl.length > 1) {
                $scope.newVoucherMode.SuffixColl.splice(ind, 1);
            }
        }
    };

    $scope.AddStartingNumber = function (ind) {
        if ($scope.newVoucherMode.StartingNumberColl && $scope.newVoucherMode.StartingNumberColl[ind].ApplicableFromDet)
        {
            if ($scope.newVoucherMode.StartingNumberColl.length > ind + 1) {
                $scope.newVoucherMode.StartingNumberColl.splice(ind + 1, 0, {

                })
            } else {
                $scope.newVoucherMode.StartingNumberColl.push({

                });
            }
        }
    };
    $scope.delStartingNumber = function (ind) {
        if ($scope.newVoucherMode.StartingNumberColl) {
            if ($scope.newVoucherMode.StartingNumberColl.length > 1) {
                $scope.newVoucherMode.StartingNumberColl.splice(ind, 1);
            }
        }
    };

    $scope.ClearVoucherMode = function () {

        $scope.newMaster = {
            TranId: 0
        };

        $timeout(function () {

            $scope.CurACharge = {};
            $scope.CurACharge.AditionalChargeColl = [];
            $scope.CurACharge.AditionalChargeColl.push({ SNo:0});

            $scope.newVoucherMode = {
                TranId: 0,
                VoucherModeId: 0,
                VoucherSNo:0,
                VoucherName: '',
                VoucherType: '',
                NumberingMethod: 1,
                Abbreviation: '',
                StartNumber: 1,
                NumbericalPartWidth: 4,
                LedgerId: 0,
                AgentId: 0,
                ActivePaymentUnder: false,
                ShowWarringForBackDate: true,
                AllowAutoPrintOnDefaultPrinter: false,
                PrintVoucherAfterSaving: true,
                PreventDuplicateVoucherNo: false,
                PrefilZero: true,
                UseRefNo: false,
                RefNoName: 'Ref No.',
                ShowTime: false,
                UseEffectiveDate: false,
                AllowMultipleCurrency: false,
                IsMandatoryRefNo: false,
                UseCommonNarration: true,
                EachNarrationEntry: false,
                ShowDocumentDetails: true,
                IsAbbInvoice: false,
                IsActive:true,
                CanChangeLedgerAndAgent: true,
                UsePartyCostCenter: false,
                UseTranCostCenter: false,
                PrefixColl: [],
                SuffixColl: [],
                StartingNumberColl: [],
                AditionalChargeColl: [],
                LedgerColl: [],
                LedgerPurchaseColl: [],
                LedgerSalesColl: [],
                BOId: 1,
                PrintVoucerAfterSaving: true,
                PrintVoucherAfterModify: true,
                AllwAutoPrintOnDefaultPrinter: false,
                ShowPrintPreview: true,
                ActiveConfirmationMSG: false,
                NoOfCopies: 1,
                NoOfTemplates: 1,
                Mode: 'Save',
                AutoProductRate: true,
                ActiveForBranch: true,
                ActivePartyDetails: true,
                ActiveAdditionalCost: true,
                EntryDateLabel: 'Entry Date',
                VoucherDateLabel: 'Date',
                VoucherDateAs:1,
                LedgerGroupPurchasePartyColl: [],
                LedgerGroupSalesPartyColl: [],
                LedgerGroupPurchaseAccountColl: [],
                LedgerGroupSalesAccountColl: [],
                LedgerGroupAdditionalPurchaseColl: [],
                LedgerGroupAdditionalSalesColl: [],
                GodownColl: [],
                GodownColl_TMP: [],
                ProductGroupColl: [],
                ProductGroupColl_TMP: [],
                DebtorTypeForTran_TMP:[],
                CostCategoryPurchaseColl: [],
                CostCategorySalesColl: [],
                CostCategoryInventoryColl: [],
                SalesManColl: [],
                LedgerGroupForParty: [],
                LedgerGroupForTran: [],
                LedgerGroupForAdditionalCost: [],
                CostCategoryForParty: [],
                CostCategoryForTran: [],
                AgentColl: [],
                Product: {},
                FixedProduct: {},
                ShowVatRegisterDialog: false,
                BatchWiseClosingList: false,
                VatRate: 13,
                NoOfDecimalPlaces: 2,
                IsJewellery: false,
                Jewellery: {},
                NotEffectQty: false,
                ActiveBarCode: false,
                ActiveSummaryEntry: false,
                ActiveTender: false,
                MandatoryCreditDays: false,
                AllowDuplicateProduct: false,
                VoucherProductUDFColl: [],
                VoucherUDFColl: [],
                PrintPreviewAs: 1,
                ActiveCompanyWiseProduct: false,
                ShowPendingVoucher: true,
                NotEffectInVatRegister: false,
                AutoPost: true,
                AllowCashPurchaseSale: false,
                AditionalChargeRule: [],
                ActiveBranch: false,
                ActiveBillingShipingAddress: false,
                AditionalCostAs: 1,
                EditablePartyDetail: true,
                NeedPostRemarks: false,
                ProfitCenter1: false,
                ProfitCenter2: false,
                ProfitCenter3: false,
                ProfitCenter4: false,
                ProfitCenter5: false,
                MultipleBatch: false,
                MultipleFixedProduct: false,
                AutoCreateParty: false,
                UseSubLedger: false,
                JournalVoucherId: null,
                LedgerAllocationColl: [],
                RefFieldAs: 2,
                DateStyle: 2,
                DateFormat: 3,
                RefVoucherRelation: 3,
                MaxCreditDays: 0,
                ActiveMultipleReceiptNo: false,
                ActiveProject: false,
                ActiveTwoFactor: false,
                ActiveAditionalCostOnTheBasis:false,
            };
            $scope.newVoucherMode.Product = {
                AllowDiscount: false,
                ShowDiscountAmt: false,
                ShowDiscountPer: false,
                ShowDiscountAfterAmt: false,
                AllowScheme: false,
                ShowSchemeAmt: false,
                ShowSchemePer: false,
                AllowFreeQty: false,
                ShowRate: true,
                ShowAmount: true,
                CanEditProductAmount: false,
                CanEditRate: true,
                ChangeAmtReflectToRateQty: 2,
                RefQtyAs: 1,
                ShowAlternateUnit: false,
                PartyWiseProduct: false,
                BatchNo: false,
                UseMFG: false,
                UseEXP: false,
                MFGDateStyle: 1,
                EXPDateStyle: 1,
                MFGDateFormat: 1,
                EXPDateFormat: 1,
                ProductWiseLedger: false,
                ProductWiseExciseDuty: false,
                ProductWiseVat: false,
                ProductWiseTaxable:false,
                ProductWiseAdditionalCost: false,
                ShowProdctRateDetails: false,
                ShowProductQuantityPoint: false,
                ShowCurrentStock: false,
                ActiveAlternateUnitColumn1: false,
                ActiveAlternateUnitColumn1: false,
                ActiveActualAndBillQty: false,
                ShowProductWiseLedger: false,
                ShowProductDescription: false,
                VoucherWiseDecimalPlaces:false,
                QtyNoOfDecimalPlaces:0,
                RateNoOfDecimalPlaces:2,
                AmountNoOfDecimalPlaces: 2,
                UseMRP: false,
                UsePurchaseSalesRate: false,
                UseTradeRate: false,
                NotEffectQty: false,
                AllowDuplicateProduct: false,
                IsScrap: false,
                DiscountOn: 2,
                DualTaxMode:true,
            };
            $scope.newVoucherMode.FixedProduct = {
                ShowRegdNo: false,
                ShowChassisNo: false,
                ShowEngineNo: false,
                ShowModel: false,
                ShowType: false,
                ShowColor: false,
                ShowKeyNo: false,
                ShowCodeNo: false,
                ShowMFGYear:false
            };

            $scope.newVoucherMode.Jewellery = {
                Loss: true,
                Fine: false,
                Processing: false
            };
            $scope.newVoucherMode.VoucherProductUDFColl.push({});
            $scope.newVoucherMode.VoucherUDFColl.push({ DefaultValue:''});
            $scope.AddBlankRow();

            //$('.select2').select2({
            //    allowClear: true,
            //    // openOnEnter: true
            //});

        });
    }

    $scope.IsValidVoucherMode = function () {
        if ($scope.newVoucherMode.VoucherName.isEmpty()) {
            Swal.fire('Please ! Enter VoucherName');
            return false;
        }
        //if ($scope.newVoucherMode.VoucherType > 0) {

        //} else {
        //    Swal.fire('Please ! Enter Voucher Type');
        //    return false;
        //}
        //if ($scope.newVoucherMode.Abbreviation.isEmpty()) {
        //    Swal.fire('Please ! Enter Abbreviation');
        //    return false;
        //}
        //if ($scope.newVoucherMode.NumberingMethod > 0) {

        //} else{
        //    Swal.fire('Please ! Enter Numbering Method');
        //    return false;
        //}
        //if ($scope.newVoucherMode.VoucherDateLabel.isEmpty()) {
        //    Swal.fire('Please ! Enter Voucher Daite Label');
        //    return false;
        //}
        //if ($scope.newVoucherMode.EntryDateLabel.isEmpty()) {
        //    Swal.fire('Please ! Enter Entry Date Label');
        //    return false;
        //}   

        return true;
    }

    $scope.SaveVoucherModee = function () {
        if ($scope.IsValidVoucherMode() == true) {
            if ($scope.confirmMSG.Accept == true) {
                var saveModify = $scope.newVoucherMode.Mode;
                Swal.fire({
                    title: 'Do you want to' + saveModify + 'the current data?',
                    showCancelButton: true,
                    confirmButtonText: saveModify,
                }).then((result) => {
                    if (result.isConfirmed) {
                        $scope.CallSaveUpdateVoucherMode();
                    }
                });
            } else
                $scope.CallSaveUpdateVoucherMode();
        }
    };

    $scope.CallSaveUpdateVoucherMode = function () {
        $scope.loadingstatus = 'running';
        showPleaseWait();

        var PrefixColl = $scope.newVoucherMode.PrefixColl;
        var SuffixColl = $scope.newVoucherMode.SuffixColl;
        var StartingNumberColl = $scope.newVoucherMode.StartingNumberColl;

        $scope.newVoucherMode.PrefixColl = [];
        angular.forEach(PrefixColl, function (au) {
            if (au.ApplicableFromDet && au.PrefixCharacters.length > 0) {
                au.ApplicableFrom = new $filter('date')(new Date(au.ApplicableFromDet.dateAD), 'yyyy-MM-dd');
                $scope.newVoucherMode.PrefixColl.push(au);
            }
        });

        $scope.newVoucherMode.SuffixColl = [];
        angular.forEach(SuffixColl, function (cr) {
            if (cr.ApplicableFromDet && cr.SuffixCharacters && cr.SuffixCharacters.length > 0) {
                cr.ApplicableFrom = new $filter('date')(new Date(cr.ApplicableFromDet.dateAD), 'yyyy-MM-dd');
                $scope.newVoucherMode.SuffixColl.push(cr);
            }
        });
        $scope.newVoucherMode.StartingNumberColl = [];
        angular.forEach(StartingNumberColl, function (cr) {
            if (cr.ApplicableFromDet && cr.StartingNumber > 0) {
                cr.ApplicableFrom = new $filter('date')(new Date(cr.ApplicableFromDet.dateAD), 'yyyy-MM-dd');
                $scope.newVoucherMode.StartingNumberColl.push(cr);
            }
        });

        var chargeColl = $scope.newVoucherMode.AditionalChargeColl;
        $scope.newVoucherMode.AditionalChargeColl = [];
        angular.forEach(chargeColl, function (cr) {
            if (cr.LedgerId || cr.LedgerId>0) {                
                $scope.newVoucherMode.AditionalChargeColl.push(cr);
            }
        });
        

        $scope.newVoucherMode.LedgerGroupForParty = [];
        if ($scope.newVoucherMode.LedgerGroupPurchasePartyColl) {
            angular.forEach($scope.newVoucherMode.LedgerGroupPurchasePartyColl, function (lg) {
                if (lg.LedgerGroupId || lg.LedgerGroupId > 0) {
                    $scope.newVoucherMode.LedgerGroupForParty.push(lg.LedgerGroupId);
                }
            });
        }

        $scope.newVoucherMode.LedgerGroupForTran = [];
        if ($scope.newVoucherMode.LedgerGroupSalesPartyColl) {
            angular.forEach($scope.newVoucherMode.LedgerGroupSalesPartyColl, function (lg) {
                if (lg.LedgerGroupId || lg.LedgerGroupId > 0) {
                    $scope.newVoucherMode.LedgerGroupForTran.push(lg.LedgerGroupId);
                }
            });
        }

        $scope.newVoucherMode.LedgerGroupForAdditionalCost = [];
        if ($scope.newVoucherMode.LedgerGroupAdditionalPurchaseColl) {
            angular.forEach($scope.newVoucherMode.LedgerGroupAdditionalPurchaseColl, function (lg) {
                if (lg.LedgerGroupId || lg.LedgerGroupId > 0) {
                    $scope.newVoucherMode.LedgerGroupForAdditionalCost.push(lg.LedgerGroupId);
                }
            });
        }


        $scope.newVoucherMode.GodownColl = [];
        if ($scope.newVoucherMode.GodownColl_TMP) {
            angular.forEach($scope.newVoucherMode.GodownColl_TMP, function (lg) {
                if (lg.GodownId || lg.GodownId > 0) {
                    $scope.newVoucherMode.GodownColl.push(lg.GodownId);
                }
            });
        }


        $scope.newVoucherMode.ProductGroupColl = [];
        if ($scope.newVoucherMode.ProductGroupColl_TMP) {
            angular.forEach($scope.newVoucherMode.ProductGroupColl_TMP, function (lg) {
                if (lg.ProductGroupId || lg.ProductGroupId > 0) {
                    $scope.newVoucherMode.ProductGroupColl.push(lg.ProductGroupId);
                }
            });
        }

        $scope.newVoucherMode.DebtorTypeForTran = [];
        if ($scope.newVoucherMode.DebtorTypeForTran_TMP) {
            angular.forEach($scope.newVoucherMode.DebtorTypeForTran_TMP, function (lg) {
                if (lg.DebtorTypeId || lg.DebtorTypeId > 0) {
                    $scope.newVoucherMode.DebtorTypeForTran.push(lg.DebtorTypeId);
                }
            });
        }

        $scope.newVoucherMode.AgentColl = [];
        if ($scope.newVoucherMode.SalesManColl) {
            angular.forEach($scope.newVoucherMode.SalesManColl, function (lg) {
                if (lg.AgentId || lg.AgentId > 0) {
                    $scope.newVoucherMode.AgentColl.push(lg.AgentId);
                }
            });
        }


        $scope.newVoucherMode.CostCategoryForParty = [];
        if ($scope.newVoucherMode.CostCategoryPurchaseColl) {
            angular.forEach($scope.newVoucherMode.CostCategoryPurchaseColl, function (lg) {
                if (lg.CostCategoryId || lg.CostCategoryId > 0) {
                    $scope.newVoucherMode.CostCategoryForParty.push(lg.CostCategoryId);
                }
            });
        }

        $scope.newVoucherMode.CostCategoryForTran = [];
        if ($scope.newVoucherMode.CostCategorySalesColl) {
            angular.forEach($scope.newVoucherMode.CostCategorySalesColl, function (lg) {
                if (lg.CostCategoryId || lg.CostCategoryId > 0) {
                    $scope.newVoucherMode.CostCategoryForTran.push(lg.CostCategoryId);
                }
            });
        }

        if (!$scope.newVoucherMode.LedgerId)
            $scope.newVoucherMode.LedgerId = 0;

        if (!$scope.newVoucherMode.AgentId)
            $scope.newVoucherMode.AgentId = 0;

        if ($scope.newVoucherMode.VoucherUDFColl && $scope.newVoucherMode.VoucherUDFColl.length > 0) {
            $scope.newVoucherMode.VoucherUDFColl.forEach(function (f) {
                if (f.SelectedRefTable) {
                    f.RefTable = f.SelectedRefTable.Table;
                    f.RefColumn = f.SelectedRefTable.ColumnName;
                } else {
                    f.RefColumn = '';
                    f.RefTable = '';
                }                 
            });
        }

        if ($scope.newVoucherMode.VoucherProductUDFColl && $scope.newVoucherMode.VoucherProductUDFColl.length > 0) {
            $scope.newVoucherMode.VoucherProductUDFColl.forEach(function (f) {
                if (f.SelectedRefTable) {
                    f.RefTable = f.SelectedRefTable.Table;
                    f.RefColumn = f.SelectedRefTable.ColumnName;
                } else {
                    f.RefColumn = '';
                    f.RefTable = '';
                }
            });
        }



        $http({
            method: 'POST',
            url: base_url + "Account/Creation/SaveVoucherMode",
            headers: { 'content-Type': undefined },

            transformRequest: function (data) {

                var formData = new FormData();
                formData.append("jsonData", angular.toJson(data.jsonData));

                return formData;
            },
            data: { jsonData: $scope.newVoucherMode }
        }).then(function (res) {

            $scope.loadingstatus = "stop";
            hidePleaseWait();

            Swal.fire(res.data.ResponseMSG);

            if (res.data.IsSuccess == true) {
                $scope.ClearVoucherMode();
            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
        });
    }

    $scope.GetVoucherModeById = function (refData) {
        $scope.loadingstatus = "running";
        showPleaseWait();
        var para = {
            voucherId: refData.VoucherId
        };

        $scope.newMaster = {
            TranId: refData.VoucherId
        };
        $http({
            method: 'POST',
            url: base_url + "Account/Creation/GetVoucherModeById",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingStatus = "stop";
            if (res.data.IsSuccess && res.data.Data)
            {
                $scope.newVoucherMode = res.data.Data;
                $scope.newVoucherMode.Mode = 'Modify';
                $scope.newVoucherMode.LedgerId = res.data.Data.LedgerId;

                angular.forEach($scope.newVoucherMode.PrefixColl, function (au)
                {
                    if (au.ApplicableFrom) {
                        au.ApplicableFrom_TMP = new $filter('date')(new Date(au.ApplicableFrom), 'yyyy-MM-dd'); 
                    }
                });

                angular.forEach($scope.newVoucherMode.SuffixColl, function (au) {
                    if (au.ApplicableFrom) {
                        au.ApplicableFrom_TMP = new $filter('date')(new Date(au.ApplicableFrom), 'yyyy-MM-dd');
                    }
                });

                angular.forEach($scope.newVoucherMode.StartingNumberColl, function (au) {
                    if (au.ApplicableFrom) {
                        au.ApplicableFrom_TMP = new $filter('date')(new Date(au.ApplicableFrom), 'yyyy-MM-dd');
                    }
                });
 


                $scope.newVoucherMode.LedgerGroupPurchasePartyColl = [];
                if ($scope.newVoucherMode.LedgerGroupForParty) {
                    angular.forEach($scope.newVoucherMode.LedgerGroupForParty, function (lg) {
                        $scope.newVoucherMode.LedgerGroupPurchasePartyColl.push({
                            LedgerGroupId: lg
                        });
                    });
                }

                $scope.newVoucherMode.LedgerGroupSalesPartyColl = [];
                if ($scope.newVoucherMode.LedgerGroupForTran) {
                    angular.forEach($scope.newVoucherMode.LedgerGroupForTran, function (lg) {
                        $scope.newVoucherMode.LedgerGroupSalesPartyColl.push({
                            LedgerGroupId: lg
                        });
                    });
                }

                $scope.newVoucherMode.LedgerGroupAdditionalPurchaseColl = [];
                if ($scope.newVoucherMode.LedgerGroupForAdditionalCost) {
                    angular.forEach($scope.newVoucherMode.LedgerGroupForAdditionalCost, function (lg) {
                        $scope.newVoucherMode.LedgerGroupAdditionalPurchaseColl.push({
                            LedgerGroupId: lg
                        });
                    });
                }


                $scope.newVoucherMode.GodownColl_TMP = [];
                if ($scope.newVoucherMode.GodownColl) {
                    angular.forEach($scope.newVoucherMode.GodownColl, function (lg) {
                        $scope.newVoucherMode.GodownColl_TMP.push({
                            GodownId: lg
                        });
                    });
                }


                $scope.newVoucherMode.ProductGroupColl_TMP = [];
                if ($scope.newVoucherMode.ProductGroupColl) {
                    angular.forEach($scope.newVoucherMode.ProductGroupColl, function (lg) {
                        $scope.newVoucherMode.ProductGroupColl_TMP.push({
                            ProductGroupId: lg
                        });
                    });
                }


                $scope.newVoucherMode.DebtorTypeForTran_TMP = [];
                if ($scope.newVoucherMode.DebtorTypeForTran) {
                    angular.forEach($scope.newVoucherMode.DebtorTypeForTran, function (lg) {
                        $scope.newVoucherMode.DebtorTypeForTran_TMP.push({
                            DebtorTypeId: lg
                        });
                    });
                }

                $scope.newVoucherMode.SalesManColl = [];
                if ($scope.newVoucherMode.AgentColl) {
                    angular.forEach($scope.newVoucherMode.AgentColl, function (lg) {
                        $scope.newVoucherMode.SalesManColl.push({
                            AgentId: lg
                        });
                    });
                }


                $scope.newVoucherMode.CostCategoryPurchaseColl = [];
                if ($scope.newVoucherMode.CostCategoryForParty) {
                    angular.forEach($scope.newVoucherMode.CostCategoryForParty, function (lg) {
                        $scope.newVoucherMode.CostCategoryPurchaseColl.push({
                            CostCategoryId: lg
                        });
                    });
                }

                $scope.newVoucherMode.CostCategorySalesColl = [];
                if ($scope.newVoucherMode.CostCategoryForTran) {
                    angular.forEach($scope.newVoucherMode.CostCategoryForTran, function (lg) {
                        $scope.newVoucherMode.CostCategorySalesColl.push({
                            CostCategoryId: lg
                        });
                    });
                }

                $scope.newVoucherMode.AditionalChargeRuleColl = [];
                if ($scope.newVoucherMode.AditionalChargeRule && $scope.newVoucherMode.AditionalChargeRule.length > 0) {
                    var qry = mx($scope.newVoucherMode.AditionalChargeRule).groupBy(p1 => ({ ForTypeName: p1.ForTypeName, ForName: p1.ForName }));
                    angular.forEach(qry, function (q) {
                        $scope.newVoucherMode.AditionalChargeRuleColl.push({
                            ForTypeName: q.ForTypeName,
                            ForName: q.ForName,
                            SNo:0,
                        });
                    });
                }


                if ($scope.newVoucherMode.VoucherUDFColl && $scope.newVoucherMode.VoucherUDFColl.length > 0) {
                    $scope.newVoucherMode.VoucherUDFColl.forEach(function (fl) {
                        if (fl.RefTable && fl.RefTable.length > 0) {
                            var findTbl = $scope.PkTablesColl_Qry.firstOrDefault(p1 => p1.Table == fl.RefTable);
                            if (findTbl)
                                fl.SelectedRefTable = findTbl;
                        }
                    });
                }

                if ($scope.newVoucherMode.VoucherProductUDFColl && $scope.newVoucherMode.VoucherProductUDFColl.length > 0) {
                    $scope.newVoucherMode.VoucherProductUDFColl.forEach(function (fl) {
                        if (fl.RefTable && fl.RefTable.length > 0) {
                            var findTbl = $scope.PkTablesColl_Qry.firstOrDefault(p1 => p1.Table == fl.RefTable);
                            if (findTbl)
                                fl.SelectedRefTable = findTbl;
                        }
                    });
                }

                $scope.AddBlankRow();
                $('#searVoucherRightBtn').modal('hide');

            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    };



    $scope.SearchDataColl = [];
    $scope.SearchData = function () {

        $scope.loadingstatus = 'running';
        showPleaseWait();
        $scope.paginationOptions.TotalRows = 0;

        var sCol = $scope.paginationOptions.SearchColDet;

        var para = {
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
            url: base_url + "Account/Creation/GetVoucherLst",
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


        $timeout(function () {
            if (pageInd && pageInd >= 0)
                $scope.paginationOptions.pageNumber = pageInd;
            else if (pageInd == -1)
                $scope.paginationOptions.pageNumber = 1;

            $scope.loadingstatus = 'running';
            showPleaseWait();
            $scope.paginationOptions.TotalRows = 0;
            var sCol = $scope.paginationOptions.SearchColDet;

            var para = {
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
                url: base_url + "Account/Creation/GetVoucherLst",
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
        });
         
    }

    $scope.CurACharge = {};
    $scope.ChangeACType = function () {
        $scope.CurACharge.AditionalChargeColl = [];
        $scope.CurACharge.AditionalChargeColl.push({});

        if ($scope.CurACharge.ForType == 1) {
           // $scope.CurACharge.LedgerGroupId = null;
            $scope.CurACharge.AgentId = null;
            $scope.CurACharge.TranCostCenterId = null;
            $scope.CurACharge.PartyCostCenterId = null;
        }
        else if ($scope.CurACharge.ForType == 2) {
            $scope.CurACharge.LedgerGroupId = null;
           // $scope.CurACharge.AgentId = null;
            $scope.CurACharge.TranCostCenterId = null;
            $scope.CurACharge.PartyCostCenterId = null;
        }
        else if ($scope.CurACharge.ForType == 3) {
            $scope.CurACharge.LedgerGroupId = null;
            $scope.CurACharge.AgentId = null;
           // $scope.CurACharge.TranCostCenterId = null;
            $scope.CurACharge.PartyCostCenterId = null;
        }
        else  if ($scope.CurACharge.ForType == 4) {
            $scope.CurACharge.LedgerGroupId = null;
            $scope.CurACharge.AgentId = null;
            $scope.CurACharge.TranCostCenterId = null;
           // $scope.CurACharge.PartyCostCenterId = null;
        }
    }

    $scope.addNewACRule = function () {

        if (!$scope.newVoucherMode.AditionalChargeRule)
            $scope.newVoucherMode.AditionalChargeRule = [];

        if ($scope.CurACharge.AditionalChargeColl && $scope.CurACharge.AditionalChargeColl.length > 0) {
            angular.forEach($scope.CurACharge.AditionalChargeColl, function (ac) {
                $scope.newVoucherMode.AditionalChargeRule.push({
                    ForType: $scope.CurACharge.ForType,
                    SNo: $scope.CurACharge.SNo,
                    LedgerGroupId: $scope.CurACharge.LedgerGroupId,
                    AgentId: $scope.CurACharge.AgentId,
                    TranCostCenterId: $scope.CurACharge.TranCostCenterId,
                    PartyCostCenterId: $scope.CurACharge.PartyCostCenterId,
                    LedgerId: ac.LedgerId,
                    Rate: ac.Rate,
                    Sign: ac.Sign,
                    Amount: ac.Amount,
                    CanEdit: ac.CanEdit,
                    IsMandatory: ac.IsMandatory,
                });
            });

            $scope.CurACharge = {};
            $scope.CurACharge.AditionalChargeColl.push({});
        }
    };
    $scope.AddALedger = function (ind) {
        if ($scope.CurACharge.AditionalChargeColl) {
            if ($scope.CurACharge.AditionalChargeColl.length > ind + 1) {
                $scope.CurACharge.AditionalChargeColl.splice(ind + 1, 0, {

                })
            } else {
                $scope.CurACharge.AditionalChargeColl.push({

                });
            }
        }
    };
    $scope.delALedger = function (ind) {
        if ($scope.CurACharge.AditionalChargeColl) {
            if ($scope.CurACharge.AditionalChargeColl.length > 1) {
                $scope.CurACharge.AditionalChargeColl.splice(ind, 1);
            }
        }
    };

    $scope.AuditLogColl = [];
    $scope.ShowAuditLog = function () {

        $scope.AuditLogColl = {};
        if ($scope.newMaster.TranId > 0) {

            $scope.loadingstatus = "running";
            showPleaseWait();

            GlobalServices.getAuditLog(EntityId, $scope.newMaster.TranId).then(function (res1) {
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

});