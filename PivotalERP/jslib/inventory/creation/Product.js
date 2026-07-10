app.controller('Product', function ($scope, $filter, $http, $timeout, GlobalServices) {
    $scope.Title = 'Product ';
     
    var glSrv = GlobalServices;
    $scope.LoadData = function () {
        $scope.confirmMSG = GlobalServices.getConfirmMSG();

        $('.select2').select2({
            allowClear: true,
            placeholder: '**select data**',
           // openOnEnter: true
        });

        $scope.ExciseOnColl = [{ id: 1, text: 'Qty' }, { id: 2, text: 'Amount' }];
        $scope.VoucherSearchOptions = [{ text: 'Name', value: 'P.Name', searchType: 'text' }, { text: 'Code', value: 'P.Code', searchType: 'text' }, { text: 'Part No.', value: 'P.PartNo', searchType: 'text' }, { text: 'H.S. Code', value: 'P.HSCode', searchType: 'text' }, { text: 'Alias', value: 'P.Alias', searchType: 'text' }, { text: 'Group', value: 'PG.Name', searchType: 'text' },];
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

        //Added by Simran
        $scope.HerbsList = [];
        $http({
            method: 'POST',
            url: base_url + "AppCMS/Creation/GetAllHerbs",
            dataType: "json"
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.HerbsList = res.data.Data;

            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        $scope.WelnessGoalsList = [];
        $http({
            method: 'POST',
            url: base_url + "AppCMS/Creation/GetAllWelnessGoals",
            dataType: "json"
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.WelnessGoalsList = res.data.Data;
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            hidePleaseWait();
            Swal.fire('Failed' + reason);
        });
        //End
        $scope.newProduct = {

            SNo: 0,
            Name: '',
            Description: '',
            Alias: '',
            Code: '',
            BaseUnitId: 2,
            ProductCategoriesId: 0,
            ProductTypeId: 0,
            PurchaseLedgerId: 0,
            SalesLedgerId: 0,
            ProductDivision: 0,
            ProductDivisionId: 0,
            ProductBrandId: 0,
            ProductCompanyId: 0,
            ProductColorId: 0,
            ProductFlavourId: 0,
            ProductShapeId: 0,
            CompanyName: 0,
            PurchaseCCRate: 0,
            SalesCCRate: 0,
            WarrantyMonth: 0,
            TSCRate: 0,
            VatRate: 13,
            OpeningQty: 0,
            PurchaseRate: 0,
            OpeningForBranchId: 0,
            EXDutyRate: 0,
            ExDutyUnitId: 0,
            TreatAllSalesAsNewManufacture: false,
            TreatAllPurchaseAsConsumed: false,
            TreatllRejectionInwardAsScraped: false,
            PartNo: '',
            PartNoAlisas: '',
            Remarks: '',
            IsFixedProduct: false,
            ValidateFixedProduct: true,
            AllowManualInputFixedProduct:false,
            IgnoreNegativeBalance: false,
            CanEditRate: true,
            CanEditRatePurchase: true,
            ActiveAlternativeUnit: false,
            SetStandardRate: true,
            SetGodownWiseOpening: false,
            MantainBatchWise: false,
            UseMfgDate: false,
            UseExpDate: false,
            IncludingVat: false,
            Rate: 0,
            IsTaxable: true,
            PhotoPath: '',
            MaintainBatchWise: false,
            TermCondition: '',
            Mode: 'Save',
            AlterNetUnitColl: [],
            CostRateColl: [],
            SellingRateColl: [],
            TradeRateColl: [],
            MRPRateColl: [],
            OpeningColl: [],
            QtyDecimal: 3,
            RateDecimal: 3,
            AmountDecimal: 2,
            RateOf: 0,
            LossRate: 0,
            DealerCommissionRate: 0,
            SankuchanLoss: 0,
            ActivitiesLoss: 0,
            SankuchanCostCenterId: null,
            ActivitiesCostCenterId: null,
            CostCenterDetailsS: null,
            CostCenterDetailsA: null,
            PreferedSupplierColl: [],
            IsActive: true,
            ExciseOn: 2,
            DiscountOn: null,
            AllowSalesPoint:false,
            SalesPointPerQty: null,
            ActiveMultipleBatch: false,
            UDFColl: [],
            WeightConv:null,
            WeightUnitId: null,
            VolumConv: null,
            VolumUnitId: null,
            ActiveSerialNo: false,
            BR_PurchaseLedgerId:null,
            BR_SalesLedgerId: null,
            Pur_MinRate: null,
            Pur_MaxRate: null,
            Sal_MinRate: null,
            Sal_MaxRate: null,
            DefaultRackColl: [],
            //Added by Simran
            VideoLink:'', 
            HerbsId: null,
            WellnessGoalId: null,
            //End
        }

        $scope.newProduct.UDFColl.push({ ColWidth: 3 });
        $scope.comDet = {};
        GlobalServices.getCompanyDet().then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.comDet = res.data.Data;

                if ($scope.comDet.Maintain == 3 || $scope.comDet.Maintain == 4) {
                    $scope.newProduct.MaintainBatchWise = true;
                    $scope.newProduct.UseExpDate = true;
                    $scope.newProduct.IsTaxable = false;
                    $scope.newProduct.VatRate = 0;
                }
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        $scope.RackColl = [];
        $http({
            method: 'GET',
            url: base_url + "Inventory/Creation/GetRackForProductDefault",
            dataType: "json",
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.RackColl = res.data.Data;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        $scope.FixedProductConfig = [];
        $http({
            method: 'GET',
            url: base_url + "Inventory/Creation/GetFixedProductConfig",
            dataType: "json",
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.FixedProductConfig = res.data.Data;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        $scope.UDFFeildsColl = [];
        var para11 = {
            EntityId: ProductEntity
        };
        $http({
            method: 'POST',
            url: base_url + "Setup/Security/getUDFByEntitId",
            dataType: "json",
            data: JSON.stringify(para11)
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.UDFFeildsColl = res.data.Data;

                      //SNo: uc.SNo,
                      //              Name: uc.Name,
                      //              Value: (findAVal ? findAVal.Value : uc.DefaultValue),
                      //              FieldNo: uc.SNo,
                      //              DisplayName: uc.DisplayName,
                      //              FieldType: uc.FieldType,
                      //              IsMandatory: uc.IsMandatory,
                      //              Length: 100,
                      //              SelectOptions: uc.SelectOptions,
                      //              FieldAfter: uc.FieldAfter,
                      //              NameId: uc.NameId,
                      //              Source: uc.Source,
                      //              Formula: uc.Formula,
                      //              UDFValue: (findAVal ? findAVal.Value : uc.DefaultValue),
                angular.forEach($scope.UDFFeildsColl, function (uff) {                    
                    uff.Value = uff.DefaultValue;
                    uff.UDFValue = uff.DefaultValue;
                    if (uff.DataType == 9) {
                        if (uff.DefaultValue == "true")
                            uff.Value = true;
                        else
                            uff.Value = false;
                    }
                     
                });
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        $scope.BranchList = [];
        $http({
            method: 'GET',
            url: base_url + "Setup/Security/GetAllBranchList",
            dataType: "json",
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.BranchList = res.data.Data;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        $scope.ProductShapeList = [];
        $http({
            method: 'GET',
            url: base_url + "Inventory/Creation/GetProductShape",
            dataType: "json"
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.ProductShapeList = res.data.Data;
            }
        }, function (reason) {
            Swal.fire('Failed !' + reason);

        });


        $scope.RackList = [];
        $http({
            method: 'GET',
            url: base_url + "Inventory/Creation/GetAllRack",
            dataType: "json"
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.RackList = res.data.Data;
            }
        }, function (reason) {
            Swal.fire('Failed !' + reason);

        });

        $scope.ProductBrandList = [];
        $http({
            method: 'GET',
            url: base_url + "Inventory/Creation/GetAllProductBrand",
            dataType: "json"
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.ProductBrandList = res.data.Data;
            }
        }, function (reason) {
            Swal.fire('Failed ! ' + reason);
        });

        $scope.ProductTypeList = [];
        $http({
            method: 'GET',
            url: base_url + "Inventory/Creation/GetAllProductType",
            dataType: "json"
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.ProductTypeList = res.data.Data;
            }
        }, function (reason) {
            Swal.fire('Failed ! ' + reason);
        });
        $scope.ProductDivisionList = [];
        $http({
            method: 'GET',
            url: base_url + "Inventory/Creation/GetAllProductDivision",
            dataType: "json"
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.ProductDivisionList = res.data.Data;
            }
        }, function (reason) {
            Swal.fire('Failed ! ' + reason);
        });

        $scope.ProductCompanyList = [];
        $http({
            method: 'GET',
            url: base_url + "Inventory/Creation/GetAllProductCompany",
            dataType: "json",
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.ProductCompanyList = res.data.Data;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        $scope.BaseUnitList = [];
        $http({
            method: 'GET',
            url: base_url + "Inventory/Creation/GetAllUnit",
            dataType: "json",
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {

                if(res.data.Data.length>0)
                    res.data.Data.splice(0, 1);

                $scope.BaseUnitList = res.data.Data;
                $scope.UnitList = res.data.Data;

                $scope.ChangeBaseUnit();
                 
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        $scope.ProductGroupList = [];
        $http({
            method: 'GET',
            url: base_url + "Inventory/Creation/GetProductGroup",
            dataType: "json",
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                var tmpDataCC = res.data.Data;
                $scope.ProductGroupList = [];
                angular.forEach(tmpDataCC, function (d) {
                    if (d.ShowInProductMaster == true) {
                        $scope.ProductGroupList.push(d);
                    }
                });
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        $scope.ProductCategoriesList = [];
        $http({
            method: 'GET',
            url: base_url + "Inventory/Creation/GetProductCategories",
            dataType: "json",
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.ProductCategoriesList = res.data.Data;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
        $scope.GodownList = [];
        $http({
            method: 'GET',
            url: base_url + "Inventory/Creation/GetAllGodown",
            dataType: "json",
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.GodownList = res.data.Data;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        $scope.ProductCostingList = [];
        $http({
            method: 'GET',
            url: base_url + "Global/GetProductCostingMethod",
            dataType: "json",
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.ProductCostingList = res.data.Data;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
        $scope.MarketValuationList = [];
        $http({
            method: 'GET',
            url: base_url + "Global/GetProductMarketValuation",
            dataType: "json",
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.MarketValuationList = res.data.Data;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        $scope.ProductColorList = [];
        $http({
            method: 'GET',
            url: base_url + "Inventory/Creation/GetProductColor",
            dataType: "json"
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.ProductColorList = res.data.Data;
            }
        }, function (reason) {
            Swal.fire('Failed ! ' + reason);
        });

        $scope.ProductFlavourList = [];
        $http({
            method: 'GET',
            url: base_url + "Inventory/Creation/GetProductFlavour",
            dataType: "json"
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.ProductFlavourList = res.data.Data;
            }
        }, function (reason) {
            Swal.fire('Failed ! ' + reason);
        });

        $scope.ProductShapeList = [];
        $http({
            method: 'GET',
            url: base_url + "Inventory/Creation/GetProductShape",
            dataType: "json"
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.ProductShapeList = res.data.Data;
            }
        }, function (reason) {
            Swal.fire('Failed ! ' + reason);
        });

        $timeout(function () {
            $scope.EPDet = {};
            $scope.EPColl = [];
            GlobalServices.getEntityProperties(EntityId).then(function (res) {
                if (res.data.IsSuccess && res.data.Data) {
                    $scope.EPColl = res.data.Data;
                    angular.forEach($scope.EPColl, function (ep) {
                        $scope.EPDet[ep.Name] = ep;
                        $scope.newProduct[ep.Name] = ep.DefaultValue;
                    });
                }
            }, function (reason) {
                Swal.fire('Failed' + reason);
            });
        });
      
        $scope.AddBlankRow();

        $timeout(function () {
            if (TranId && TranId > 0) {
                var newEdit = {
                    ProductId:TranId,
                };
                $scope.GetProductById(newEdit);
            }
        });
    };

    $scope.GetLabel = function (ep) {
        if ($scope.EPDet && $scope.EPDet[ep])
            return $scope.EPDet[ep].Label;
        else
            return "***Label***";
    }
    $scope.GenerateCode = function () {

        if ($scope.newProduct.ProductId > 0 && $scope.newProduct.Code.length > 0)
            return;

        $scope.newProduct.Code = '';
        var para = {
            name: $scope.newProduct.Name,
            productGroupId: $scope.newProduct.ProductGroupId
        };
        $http({
            method: 'POST',
            url: base_url + "Inventory/Creation/GetProductCode",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            $timeout(function () {
                if (res.data.IsSuccess && res.data.Data) {
                    $scope.newProduct.Code = res.data.Data.ResponseId;
                }
            });
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    };

    $scope.ClearProduct = function () {

        $scope.newProduct.BaseUnitId = 0;
        $scope.newMaster = {
            TranId: 0
        };

        angular.forEach($scope.UDFFeildsColl, function (uf) {
            uf.Value = '';
            uf.AlterNetValue = '';
            uf.UDFValue = '';

            if (uf.DataType == 9 || uf.Type == 9) {
                if (uf.DefaultValue == "true")
                    uf.Value = true;
                else
                    uf.Value = false;
            }
            else if (uf.DataType == 2 || uf.Type == 2) {
                uf.Value = null;
                uf.Value_TMP = null;
                uf.UDFValue_TMP = null;
            }
        });

        $timeout(function () {

            $('#imgProductPhoto').attr('src', '');

            $scope.newProduct.BaseUnitId = 0;
            $scope.newProduct = {
                SNo: 0,
                Name: '',
                Description: '',
                Alias: '',
                Code: '',
                BaseUnitId: 2,
                ProductCategoriesId: 0,
                ProductTypeId: 0,
                PurchaseLedgerId: 0,
                SalesLedgerId: 0,
                ProductDivision: 0,
                ProductDivisionId: 0,
                ProductBrandId: 0,
                ProductCompanyId: 0,
                ProductColorId: 0,
                ProductFlavourId: 0,
                ProductShapeId: 0,
                CompanyName: 0,
                PurchaseCCRate: 0,
                SalesCCRate: 0,
                WarrantyMonth: 0,
                TSCRate: 0,
                VatRate: 13,
                OpeningQty: 0,
                PurchaseRate: 0,
                OpeningForBranchId: 0,
                EXDutyRate: 0,
                ExDutyUnitId: 0,
                TreatAllSalesAsNewManufacture: false,
                TreatAllPurchaseAsConsumed: false,
                TreatllRejectionInwardAsScraped: false,
                PartNo: '',
                PartNoAlisas: '',
                Remarks: '',
                IsFixedProduct: false,
                ValidateFixedProduct: true,
                AllowManualInputFixedProduct: false,
                IgnoreNegativeBalance: false,
                CanEditRate: true,
                CanEditRatePurchase: true,
                ActiveAlternativeUnit: false,
                SetStandardRate: true,
                SetGodownWiseOpening: false,
                MantainBatchWise: false,
                UseMfgDate: false,
                UseExpDate: false,
                IncludingVat: false,
                Rate: 0,
                IsTaxable: true,
                PhotoPath: '',
                PhotoData:null,
                MaintainBatchWise:false,
                Mode: 'Save',
                Photo_TMP: null,
                TermCondition: '',
                AlterNetUnitColl:[],
                CostRateColl:[],
                SellingRateColl:[],
                TradeRateColl:[],
                MRPRateColl:[],
                OpeningColl: [],
                QtyDecimal: 3,
                RateDecimal: 3,
                AmountDecimal: 2,
                RateOf: 0,
                LossRate: 0,
                DealerCommissionRate: 0,
                SankuchanLoss: 0,
                ActivitiesLoss: 0,
                SankuchanCostCenterId: null,
                ActivitiesCostCenterId: null,
                CostCenterDetailsS: null,
                CostCenterDetailsA: null,
                IsActive: true,
                ExciseOn: 2,
                DiscountOn: null,
                AllowSalesPoint: false,
                SalesPointPerQty: null,
                ActiveMultipleBatch: false,
                UDFColl: [],
                WeightConv: null,
                WeightUnitId: null,
                VolumConv: null,
                VolumUnitId: null,
                ActiveSerialNo: false,
                BR_PurchaseLedgerId: null,
                BR_SalesLedgerId: null,
                Pur_MinRate: null,
                Pur_MaxRate: null,
                Sal_MinRate: null,
                Sal_MaxRate: null,
                //Added by Simran
                VideoLink: '',
                HerbsId: null,
                WellnessGoalId: null,
                //End
            };

            $scope.newProduct.UDFColl.push({ ColWidth: 3 });

            if ($scope.comDet) {
                if ($scope.comDet.Maintain == 3 || $scope.comDet.Maintain == 4) {
                    $scope.newProduct.MaintainBatchWise = true;
                    $scope.newProduct.UseExpDate = true;
                    $scope.newProduct.IsTaxable = false;
                    $scope.newProduct.VatRate = 0;
                }
            }
            
            $scope.newProduct.TermCondition = '';
             
            $timeout(function () {
                if ($scope.EPColl) {
                    angular.forEach($scope.EPColl, function (ep) {
                        $scope.newProduct[ep.Name] = ep.DefaultValue;
                        console.log(ep);
                    });
                }                 
            });

            $scope.AddBlankRow();
            $scope.ChangeBaseUnit();

           
        });
    }
    $scope.ChangeParticularCostCenter = function (pr) {

    }

    $scope.IsValidProduct = function () {
        if ($scope.newProduct.Name.isEmpty()) {
            Swal.fire("Please ! Enter Product Name");
            return false;
        }
        else
            return true;
    }

    $scope.SaveUpdateProduct = function () {
        if ($scope.IsValidProduct() == true) {
            if ($scope.confirmMSG.Accept == true) {
                var saveModify = $scope.newProduct.Mode;
                Swal.fire({
                    title: 'Do you want to' + saveModify + 'the current data?',
                    showCancelButton: true,
                    confirmButtonText: saveModify,
                }).then((result) => {
                    if (result.isConfirmed) {
                        $scope.CallSaveUpdateProduct();
                    }

                });
            }
            else
                $scope.CallSaveUpdateProduct();
        }
    };

    $scope.CallSaveUpdateProduct = function () {
        $scope.loadingstatus = 'running';
        showPleaseWait();

        var productPhoto = $scope.newProduct.Photo_TMP;

        if (!$scope.newProduct.BDId)
            $scope.newProduct.BDId = 0;

        var AlterNetUnitColl = $scope.newProduct.AlterNetUnitColl;
        var CostRateColl = $scope.newProduct.CostRateColl;
        var SellingRateColl = $scope.newProduct.SellingRateColl;
        var OpeningColl = $scope.newProduct.OpeningColl;
        var TradeRateColl = $scope.newProduct.TradeRateColl;
        var MRPRateColl = $scope.newProduct.MRPRateColl;
        var preSuppColl = $scope.newProduct.PreferedSupplierColl;

        $scope.newProduct.PreferedSupplierIdColl = [];
        angular.forEach(preSuppColl, function (ss) {
            if (ss.PartyLedgerId > 0)
                $scope.newProduct.PreferedSupplierIdColl.push(ss.PartyLedgerId);
        });
        $scope.newProduct.AlterNetUnitColl = [];
        angular.forEach(AlterNetUnitColl, function (au)
        {
            if (au && au.AlterNetUnitId) {
                //if (au.BaseUnitValue > 0 && au.AlterNetUnitValue > 0 && au.AlterNetUnitId > 0)

                if (au.BaseUnitValue > 0 && au.AlterNetUnitId > 0)
                    $scope.newProduct.AlterNetUnitColl.push(au);
            } 
        });

        $scope.newProduct.CostRateColl = [];
        angular.forEach(CostRateColl, function (cr) {
            if (cr.ApplicableFromDet && cr.Rate > 0) {
                cr.ApplicableFrom = new $filter('date')(new Date(cr.ApplicableFromDet.dateAD), 'yyyy-MM-dd');

                if (!cr.RateOf)
                    cr.RateOf = 1;

                $scope.newProduct.CostRateColl.push(cr);
            }
        });
        $scope.newProduct.SellingRateColl = [];
        angular.forEach(SellingRateColl, function (cr) {
            if (cr.ApplicableFromDet && cr.Rate > 0) {
                cr.ApplicableFrom = new $filter('date')(new Date(cr.ApplicableFromDet.dateAD), 'yyyy-MM-dd');

                if (!cr.RateOf)
                    cr.RateOf = 1;

                $scope.newProduct.SellingRateColl.push(cr);
            }
        });


        $scope.newProduct.TradeRateColl = [];
        angular.forEach(TradeRateColl, function (cr) {
            if (cr.ApplicableFromDet && cr.Rate > 0) {
                cr.ApplicableFrom = new $filter('date')(new Date(cr.ApplicableFromDet.dateAD), 'yyyy-MM-dd');

                if (!cr.RateOf)
                    cr.RateOf =1;

                $scope.newProduct.TradeRateColl.push(cr);
            }
        });

        $scope.newProduct.MRPRateColl = [];
        angular.forEach(MRPRateColl, function (cr) {
            if (cr.ApplicableFromDet && cr.Rate > 0) {
                cr.ApplicableFrom = new $filter('date')(new Date(cr.ApplicableFromDet.dateAD), 'yyyy-MM-dd');

                if (!cr.RateOf)
                    cr.RateOf = 1;

                $scope.newProduct.MRPRateColl.push(cr);
            }
        });

        $scope.newProduct.OpeningColl = [];
        angular.forEach(OpeningColl, function (op) {
            if (op.GodownId > 0 && (op.Quantity > 0 || op.Amount > 0)) {
                op.UnitId = $scope.newProduct.BaseUnitId;
 
                op.EXPDate = (op.EXPDateDet ? $filter('date')(new Date(op.EXPDateDet), 'yyyy-MM-dd') : null);
                op.MFGDate = (op.MFGDateDet ? $filter('date')(new Date(op.MFGDateDet), 'yyyy-MM-dd') : null);

                if (op.Rate == null || op.Rate == undefined)
                    op.Rate = 0;

                if (op.Amount == null || op.Amount == undefined)
                    op.Amount = 0;

                $scope.newProduct.OpeningColl.push(op);
            };
        });

        if (!$scope.newProduct.PurchaseLedgerId)
            $scope.newProduct.PurchaseLedgerId = 0;

        if (!$scope.newProduct.SalesLedgerId)
            $scope.newProduct.SalesLedgerId = 0;


        var voucherUDFFields = [];
        var voucherKeyVal = {};
        $scope.newProduct.UserDefineFieldsColl = [];
        angular.forEach($scope.UDFFeildsColl, function (udf) {
             
            if (udf.NameId && udf.NameId.length > 0)
            {
                var uVal = {
                    UDFId: udf.Id,
                    Value: udf.UDFValue,
                    AlterNetValue: '',
                };
                if (udf.FieldType == 2 || udf.FieldType == 22 || udf.FieldType == 23) {
                    var ud = {
                        SNo: (udf.FieldNo ? udf.FieldNo : udf.SNo),
                        Name: udf.Name,
                        Value: udf.UDFValueDet ? $filter('date')(udf.UDFValueDet.dateAD, 'yyyy-MM-dd') : '',
                        AlValue: udf.UDFValueDet ? udf.UDFValueDet.dateBS : '',
                    };
                    uVal.AlterNetValue = ud.AlValue;
                    voucherUDFFields.push(ud);
                    voucherKeyVal[udf.NameId] = udf.UDFValueDet ? udf.UDFValueDet.dateBS : '';
                } else if (udf.FieldType == 3 && udf.Source && udf.Source.length > 0) {
                    var ud = {
                        SNo: (udf.FieldNo ? udf.FieldNo : udf.SNo),
                        Name: udf.Name,
                        Value: udf.UDFValue,
                        AlValue: udf.UDFValueDet ? udf.UDFValueDet.text : '',
                    };
                    uVal.AlterNetValue = ud.AlValue;
                    voucherUDFFields.push(ud);
                    voucherKeyVal[udf.NameId] = udf.UDFValueDet ? udf.UDFValueDet.text : ''
                }
                else {
                    var ud = {
                        SNo: (udf.FieldNo ? udf.FieldNo : udf.SNo),
                        Name: udf.Name,
                        Value: udf.UDFValue
                    };
                    uVal.AlterNetValue = ud.Value;
                    voucherUDFFields.push(ud);
                    voucherKeyVal[udf.NameId] = udf.UDFValue;
                }

                $scope.newProduct.UserDefineFieldsColl.push(uVal);
            }

        });
        if (voucherUDFFields.length > 0) {
            $scope.newProduct.Attributes = JSON.stringify(voucherUDFFields);
            $scope.newProduct.UDFKeyVal = JSON.stringify(voucherKeyVal);
        } else {
            $scope.newProduct.Attributes = "";
            $scope.newProduct.UDFKeyVal = "";
        }

 
        $http({
            method: 'POST',
            url: base_url + "Inventory/Creation/SaveProduct",
            headers: { 'content-Type': undefined },

            transformRequest: function (data) {
                var formData = new FormData();
                formData.append("jsonData", angular.toJson(data.jsonData));

                if (data.productImg && data.productImg.length > 0)
                    formData.append("photo", data.productImg[0]);

                return formData;
            },
            data: { jsonData: $scope.newProduct, productImg: productPhoto, }
        }).then(function (res) {

            $scope.loadingstatus = "stop";
            hidePleaseWait();

            Swal.fire(res.data.ResponseMSG);
            if (res.data.IsSuccess == true) {
                $scope.ClearProduct();
            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
        });
    }

    $scope.ChangeBaseUnit = function () {

        $scope.newProduct.BaseUnitName = '';
        if ($scope.newProduct.BaseUnitId && $scope.newProduct.BaseUnitId > 0) {
            var findUnit = mx($scope.UnitList).firstOrDefault(p1 => p1.UnitId == $scope.newProduct.BaseUnitId);
            if (findUnit)
            {
                $scope.newProduct.BaseUnitName = findUnit.Name;
                $scope.newProduct.QtyDecimal = findUnit.NoOfDecimalPlaces;
                $scope.newProduct.RateDecimal = findUnit.RateNoOfDecimalPlaces;
                $scope.newProduct.AmountDecimal = findUnit.AmountNoOfDecimalPlaces;
            }
        }
    }

    $scope.AddAlterNetUnit = function (det, ind) {
        if (det.BaseUnitValue > 0) {
            if ($scope.newProduct.AlterNetUnitColl) {
                if ($scope.newProduct.AlterNetUnitColl.length > ind + 1) {
                    $scope.newProduct.AlterNetUnitColl.splice(ind + 1, 0, {
                    })
                } else {
                    $scope.newProduct.AlterNetUnitColl.push({
                    });
                }
            }
        }

    };
    $scope.delAlterNetUnit = function (ind) {
        if ($scope.newProduct.AlterNetUnitColl) {
            if ($scope.newProduct.AlterNetUnitColl.length > 1) {
                $scope.newProduct.AlterNetUnitColl.splice(ind, 1);
            }
        }
    };

    $scope.AddCostRate = function (det, ind) {
        if (det.ApplicableFromDet && det.Rate > 0) {
            if ($scope.newProduct.CostRateColl) {
                if ($scope.newProduct.CostRateColl.length > ind + 1) {
                    $scope.newProduct.CostRateColl.splice(ind + 1, 0, {
                        RateOf: 1
                    })
                } else {
                    $scope.newProduct.CostRateColl.push({
                        RateOf: 1
                    });
                }
            }
        }

    };
    $scope.delCostRate = function (ind) {
        if ($scope.newProduct.CostRateColl) {
            if ($scope.newProduct.CostRateColl.length > 1) {
                $scope.newProduct.CostRateColl.splice(ind, 1);
            }
        }
    };



    $scope.AddSellingRate = function (det, ind) {
        if (det.ApplicableFromDet && det.Rate > 0) {
            if ($scope.newProduct.SellingRateColl) {
                if ($scope.newProduct.SellingRateColl.length > ind + 1) {
                    $scope.newProduct.SellingRateColl.splice(ind + 1, 0, {
                        RateOf: 1
                    })
                } else {
                    $scope.newProduct.SellingRateColl.push({
                        RateOf:1
                    });
                }
            }
        }

    };
    $scope.delSellingRate = function (ind) {
        if ($scope.newProduct.SellingRateColl) {
            if ($scope.newProduct.SellingRateColl.length > 1) {
                $scope.newProduct.SellingRateColl.splice(ind, 1);
            }
        }
    };

    $scope.AddTradeRate = function (det, ind) {
        if (det.ApplicableFromDet && det.Rate > 0) {
            if ($scope.newProduct.TradeRateColl) {
                if ($scope.newProduct.TradeRateColl.length > ind + 1) {
                    $scope.newProduct.TradeRateColl.splice(ind + 1, 0, {
                        RateOf: 1
                    })
                } else {
                    $scope.newProduct.TradeRateColl.push({
                        RateOf: 1
                    });
                }
            }
        }

    };
    $scope.delTradeRate = function (ind) {
        if ($scope.newProduct.TradeRateColl) {
            if ($scope.newProduct.TradeRateColl.length > 1) {
                $scope.newProduct.TradeRateColl.splice(ind, 1);
            }
        }
    };

    $scope.AddMRPRate = function (det, ind) {
        if (det.ApplicableFromDet && det.Rate > 0) {
            if ($scope.newProduct.MRPRateColl) {
                if ($scope.newProduct.MRPRateColl.length > ind + 1) {
                    $scope.newProduct.MRPRateColl.splice(ind + 1, 0, {
                        RateOf: 1
                    })
                } else {
                    $scope.newProduct.MRPRateColl.push({
                        RateOf: 1
                    });
                }
            }
        }

    };
    $scope.delMRPRate = function (ind) {
        if ($scope.newProduct.MRPRateColl) {
            if ($scope.newProduct.MRPRateColl.length > 1) {
                $scope.newProduct.MRPRateColl.splice(ind, 1);
            }
        }
    };

    $scope.AddOpening = function (det, ind) {
        if (det.GodownId > 0 && (isEmptyAmt(det.Amount) > 0 || isEmptyAmt(det.Quantity)!=0) ) {
            if ($scope.newProduct.OpeningColl) {
                if ($scope.newProduct.OpeningColl.length > ind + 1) {
                    $scope.newProduct.OpeningColl.splice(ind + 1, 0, {
                    })
                } else {
                    $scope.newProduct.OpeningColl.push({
                    });
                }
            }
        }

    };
    $scope.delOpening = function (ind) {
        if ($scope.newProduct.OpeningColl) {
            if ($scope.newProduct.OpeningColl.length > 1) {
                $scope.newProduct.OpeningColl.splice(ind, 1);
            }
        }
    };

    $scope.AddRack = function (det, ind) {
        if (det.RackId > 0 && det.GodownId>0) {
            if ($scope.newProduct.DefaultRackColl) {
                if ($scope.newProduct.DefaultRackColl.length > ind + 1) {
                    $scope.newProduct.DefaultRackColl.splice(ind + 1, 0, {
                        SNo:1,
                        GodownId:0,
                    })
                } else {
                    $scope.newProduct.DefaultRackColl.push({
                        SNo:1,
                        GodownId: 0,
                    });
                }
            }
        }

    };
    $scope.delRack = function (ind) {
        if ($scope.newProduct.DefaultRackColl) {
            if ($scope.newProduct.DefaultRackColl.length > 1) {
                $scope.newProduct.DefaultRackColl.splice(ind, 1);
            }
        }
    };


    $scope.AddPreferedSupplier = function (det, ind) {
        if (det.PartyLedgerId > 0) {
            if ($scope.newProduct.PreferedSupplierColl) {
                if ($scope.newProduct.PreferedSupplierColl.length > ind + 1) {
                    $scope.newProduct.PreferedSupplierColl.splice(ind + 1, 0, {
                    })
                } else {
                    $scope.newProduct.PreferedSupplierColl.push({
                    });
                }
            }
        }

    };
    $scope.delPreferedSupplier = function (ind) {
        if ($scope.newProduct.PreferedSupplierColl) {
            if ($scope.newProduct.PreferedSupplierColl.length > 1) {
                $scope.newProduct.PreferedSupplierColl.splice(ind, 1);
            }
        }
    };


    $scope.ChangeOpeningQty = function (col, op) {
        if (col == 1 || col == 2) {
            op.Amount = op.Quantity * op.Rate;
        }
    }

    $scope.AddBlankRow = function () {
         

        if (!$scope.newProduct.PreferedSupplierColl || $scope.newProduct.PreferedSupplierColl.length == 0) {
            $scope.newProduct.PreferedSupplierColl = [];
            $scope.newProduct.PreferedSupplierColl.push({});
        }

        if (!$scope.newProduct.AlterNetUnitColl || $scope.newProduct.AlterNetUnitColl.length == 0) {
            $scope.newProduct.AlterNetUnitColl = [];
            $scope.newProduct.AlterNetUnitColl.push({});
        }
            

        if (!$scope.newProduct.CostRateColl || $scope.newProduct.CostRateColl.length == 0) {
            $scope.newProduct.CostRateColl = [];
            $scope.newProduct.CostRateColl.push({
                RateOf: 1
            });
        }
            

        if (!$scope.newProduct.SellingRateColl || $scope.newProduct.SellingRateColl.length == 0) {
            $scope.newProduct.SellingRateColl = [];
            $scope.newProduct.SellingRateColl.push({
                RateOf: 1
            });
        }
            

        if (!$scope.newProduct.OpeningColl || $scope.newProduct.OpeningColl.length == 0) {
            $scope.newProduct.OpeningColl = [];
            $scope.newProduct.OpeningColl.push({ 
            });
        }
            

        if (!$scope.newProduct.TradeRateColl || $scope.newProduct.TradeRateColl.length == 0) {
            $scope.newProduct.TradeRateColl = [];
            $scope.newProduct.TradeRateColl.push({
                RateOf: 1
            });
        }
            

        if (!$scope.newProduct.MRPRateColl || $scope.newProduct.MRPRateColl.length == 0) {
            $scope.newProduct.MRPRateColl = [];
            $scope.newProduct.MRPRateColl.push({
                RateOf: 1
            });
        }

        if (!$scope.newProduct.DefaultRackColl || $scope.newProduct.DefaultRackColl.length == 0) {
            $scope.newProduct.DefaultRackColl = [];
            $scope.newProduct.DefaultRackColl.push({
                SNo: 1,
                GodownId: 0,
            });
        }

    }

    $scope.GetProductById = function (refData) {

        $scope.loadingstatus = "running";
        showPleaseWait();

        $scope.ClearProduct();

        

        $scope.newMaster = {
            TranId: refData.ProductId
        };

        $timeout(function () {

            $scope.newProduct.BaseUnitId = 0;
            var para = {
                ProductId: refData.ProductId
            };

            $http({
                method: 'POST',
                url: base_url + "Inventory/Creation/GetProductById",
                dataType: "json",
                data: JSON.stringify(para)
            }).then(function (res) {
                hidePleaseWait();
                $scope.loadingstatus = "stop";
                if (res.data.IsSuccess && res.data.Data) {

                    $timeout(function () {
                        var resData = res.data.Data;
                       

                        $scope.newProduct = resData;
                        $scope.newProduct.Mode = 'Modify';
                         
                        $timeout(function () {
                            $scope.$apply(function () {
                                $scope.newProduct.SankuchanCostCenterId = resData.SankuchanCostCenterId;
                            })
                        });


                        angular.forEach($scope.newProduct.TradeRateColl, function (tr) {
                            if (tr.ApplicableFrom)
                                tr.ApplicableFrom_TMP = new Date(tr.ApplicableFrom);
                        });

                        angular.forEach($scope.newProduct.MRPRateColl, function (tr) {
                            if (tr.ApplicableFrom)
                                tr.ApplicableFrom_TMP = new Date(tr.ApplicableFrom);
                        });

                        angular.forEach($scope.newProduct.CostRateColl, function (tr) {
                            if (tr.ApplicableFrom)
                                tr.ApplicableFrom_TMP = new Date(tr.ApplicableFrom);
                        });

                        angular.forEach($scope.newProduct.SellingRateColl, function (tr) {
                            if (tr.ApplicableFrom)
                                tr.ApplicableFrom_TMP = new Date(tr.ApplicableFrom);
                        });

                        angular.forEach($scope.newProduct.OpeningColl, function (tr) {
                            if (tr.MFGDate)
                                tr.MFGDate_TMP = new Date(tr.MFGDate);

                            if (tr.EXPDate)
                                tr.EXPDate_TMP = new Date(tr.EXPDate);
                        });
                        $scope.newProduct.PreferedSupplierColl = [];
                        angular.forEach($scope.newProduct.PreferedSupplierIdColl, function (ss) {
                            $scope.newProduct.PreferedSupplierColl.push({
                                PartyLedgerId: ss
                            });
                        });


                        $scope.AddBlankRow();

                        $scope.newProduct.QtyDecimal = 3;
                        $scope.newProduct.RateDecimal = 3;
                        $scope.newProduct.AmountDecimal = 2;

                        if ($scope.newProduct.BaseUnitId && $scope.newProduct.BaseUnitId > 0) {
                            var findUnit = mx($scope.UnitList).firstOrDefault(p1 => p1.UnitId == $scope.newProduct.BaseUnitId);
                            if (findUnit) {
                                $scope.newProduct.BaseUnitName = findUnit.Name;
                                $scope.newProduct.QtyDecimal = findUnit.NoOfDecimalPlaces;
                                $scope.newProduct.RateDecimal = findUnit.RateNoOfDecimalPlaces;
                                $scope.newProduct.AmountDecimal = findUnit.AmountNoOfDecimalPlaces;
                            }
                        }
                        
                        if ($scope.newProduct.Attributes && $scope.newProduct.Attributes.length > 0) {
                            var udfFieldsColl = mx(JSON.parse($scope.newProduct.Attributes));
                            angular.forEach($scope.UDFFeildsColl, function (udd) {
                                var findU = udfFieldsColl.firstOrDefault(p1 => p1.SNo == udd.SNo);
                                if (findU) {
                                    if (udd.FieldType == 2) {
                                        if (findU.Value) {
                                            udd.UDFValue_TMP = new Date(findU.Value);
                                        }
                                    } else if (udd.FieldType == 4) {
                                        if (findU.Value) {
                                            udd.UDFValue = parseInt(findU.Value);
                                        }
                                    }
                                    else
                                        udd.UDFValue = findU.Value;
                                }
                            });
                        }

                         
                        if ($scope.newProduct.UDFColl.length == 0)
                            $scope.newProduct.UDFColl.push({ ColWidth: 3 });

                        $('#searVoucherRightBtn').modal('hide');
                    });
                    

                } else {
                    Swal.fire(res.data.ResponseMSG);
                }

            }, function (reason) {
                Swal.fire('Failed' + reason);
            });
        });
        
     
    };

    $scope.DelProductById = function (refData) {

        Swal.fire({
            title: 'Do you want to delete the selected data?',
            showCancelButton: true,
            confirmButtonText: 'Delete',
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                $scope.loadingstatus = "running";
                showPleaseWait();

                var para = {
                    ProductId: refData.ProductId
                };

                $http({
                    method: 'POST',
                    url: base_url + "Inventory/Creation/DelProduct",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingstatus = "stop";
                    if (res.data.IsSuccess) {
                        $scope.SearchData();
                    } else {
                        Swal.fire(res.data.ResponseMSG);
                    }

                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }
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
            url: base_url + "Inventory/Creation/GetProductLst",
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
                url: base_url + "Inventory/Creation/GetProductLst",
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


    $scope.MulData = null;
    $scope.MulObj = {};
    $scope.ShowMultipleModal = function () {

        if ($scope.MulData == null) {

            $http({
                method: 'GET',
                url: base_url + "Setup/Security/GetEntityProp?EntityId=" + EntityId,
                dataType: "json"
            }).then(function (res1) {
                $scope.loadingstatus = "stop";
                hidePleaseWait();
                if (res1.data.IsSuccess && res1.data.PropertiesColl) {
                    $scope.MulData = {};
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
            $scope.MulData.Title = 'Create Multiple Route';
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
            if (colName == 'batch') {
                var startInd = ind;

                var selectedRow = $scope.newProduct.OpeningColl[ind];
                
                clipText.split("\n").forEach(function (line) {
                    if (line && line.length > 0) {

                        if ($scope.newProduct.OpeningColl.length < (startInd + 1)) {
                            $scope.AddOpening(selectedRow,startInd);
                        }
                        $scope.newProduct.OpeningColl[startInd].GodownId = (selectedRow ? selectedRow.GodownId : null);
                        $scope.newProduct.OpeningColl[startInd].MFGDate_TMP = (selectedRow ? selectedRow.MFGDate_TMP : null);
                        $scope.newProduct.OpeningColl[startInd].EXPDate_TMP = (selectedRow ? selectedRow.EXPDate_TMP : null);
                        $scope.newProduct.OpeningColl[startInd].Quantity = (selectedRow ? selectedRow.Quantity : null);
                        $scope.newProduct.OpeningColl[startInd].Amount = (selectedRow ? selectedRow.Amount : null);
                        $scope.newProduct.OpeningColl[startInd].Rate = (selectedRow ? selectedRow.Rate : null);
                        $scope.newProduct.OpeningColl[startInd].Batch = line.trim();
                        startInd++;
                    }
                });
            }
            if (colName == 'engineNo') {
                var startInd = ind;

                var selectedRow = $scope.newProduct.OpeningColl[ind];

                clipText.split("\n").forEach(function (line) {
                    if (line && line.length > 0) {

                        if ($scope.newProduct.OpeningColl.length < (startInd + 1)) {
                            $scope.AddOpening(selectedRow, startInd);
                        }
                        $scope.newProduct.OpeningColl[startInd].GodownId = (selectedRow ? selectedRow.GodownId : null);
                        $scope.newProduct.OpeningColl[startInd].MFGDate_TMP = (selectedRow ? selectedRow.MFGDate_TMP : null);
                        $scope.newProduct.OpeningColl[startInd].EXPDate_TMP = (selectedRow ? selectedRow.EXPDate_TMP : null);
                        $scope.newProduct.OpeningColl[startInd].Quantity = (selectedRow ? selectedRow.Quantity : null);
                        $scope.newProduct.OpeningColl[startInd].Amount = (selectedRow ? selectedRow.Amount : null);
                        $scope.newProduct.OpeningColl[startInd].Rate = (selectedRow ? selectedRow.Rate : null);
                        $scope.newProduct.OpeningColl[startInd].EngineNo = line.trim();
                        startInd++;
                    }
                });
            }
            else {
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
            }
           
        }

    }
    $scope.ChangeTaxable = function () {
        if ($scope.newProduct.IsTaxable == true)
            $scope.newProduct.VatRate = 13;
        else
            $scope.newProduct.VatRate = 0;
    }
    $scope.addRowInMD = function (ind) {
        var newObj = angular.copy($scope.MulObj);
        $scope.MulData.DataColl.splice(ind + 1, 0, newObj);
    };
    $scope.delRowInMD = function (ind) {
        $scope.MulData.DataColl.splice(ind, 1);
    };
    $scope.SaveMultipleData = function () {
        if ($scope.MulData) {
            if ($scope.MulData.DataColl) {

                $scope.loadingstatus = "running";
                showPleaseWait();

                $http({
                    method: 'POST',
                    url: base_url + "Setup/Security/SaveCopyPaste",
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

    $scope.AddItemUdf = function (ind) {
        if ($scope.newProduct.UDFColl[ind].Label && $scope.newProduct.UDFColl[ind].Label.length > 0) {
            if ($scope.newProduct.UDFColl.length > ind + 1) {
                $scope.newProduct.UDFColl.splice(ind + 1, 0, {
                    ApplicableFromDet: null,
                    PrefixCharacters: '',
                    ColWidth: 3,
                })
            } else {
                $scope.newProduct.UDFColl.push({
                    ApplicableFromDet: null,
                    PrefixCharacters: '',
                    ColWidth: 3,
                });
            }
        }

    };
    $scope.delItemUdf = function (ind) {
        if ($scope.newProduct.UDFColl) {
            if ($scope.newProduct.UDFColl.length > 1) {
                $scope.newProduct.UDFColl.splice(ind, 1);
            }
        }
    };

    $scope.UpdateAsGlobal = function (refData) {

        Swal.fire({
            title: 'Do you want to update  the selected data (' + refData.Name + ') for global use?',
            showCancelButton: true,
            confirmButtonText: 'yes',
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                $scope.loadingstatus = "running";
                showPleaseWait();

                var para = {
                    ProductId: refData.ProductId
                };

                $http({
                    method: 'POST',
                    url: base_url + "Inventory/Creation/UpdateAsGlobal",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingstatus = "stop";
                    if (res.data.IsSuccess) {
                        $scope.SearchData();
                        Swal.fire(res.data.ResponseMSG);
                    } else {
                        Swal.fire(res.data.ResponseMSG);
                    }

                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }
        });


    };

});