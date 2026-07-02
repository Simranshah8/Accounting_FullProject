app.controller('SalesReturnController', function ($scope, $http, $timeout, $filter, $compile, GlobalServices, $document) {
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

        $scope.RefFieldAsColl = mx(GlobalServices.getRefFieldAs());

        $scope.confirmMSG = GlobalServices.getConfirmMSG();
        $scope.perPageColl = GlobalServices.getPerPageList();
        $scope.currentPages = {
            FixedProduct: 1,
            PendingOrder: 1,
            MultipleBatch: 1,
            TranHistory: 1,
        };

        $scope.searchData = {
            FixedProduct: '',
            PendingOrder: '',
            MultipleBatch: '',
            TranHistory:'',
        };

        $scope.perPage = {
            FixedProduct: GlobalServices.getPerPageRow(),
            PendingOrder: GlobalServices.getPerPageRow(),
            MultipleBatch: GlobalServices.getPerPageRow(),
        };

        $scope.searchData = {
            RefProduct: ''
        };

        $scope.ButtonED = {};
        GlobalServices.getButtonDisabled(EntityId).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.ButtonED = res.data.Data;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        $scope.AditionalCostTypeList = [];
        GlobalServices.getAditionalCostTypes().then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.AditionalCostTypeList = res.data.Data;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

      
        $scope.CostClassColl_Return = [];
        $http({
            method: 'GET',
            url: base_url + "Account/Creation/GetAllCostClasss",
            dataType: "json"            
        }).then(function (res) {
            $scope.CostClassColl_Return = res.data.Data;
        }, function (reason) {
            alert('Failed' + reason);
        });


        $scope.ProjectColl = [];
        GlobalServices.getProject().then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.ProjectColl = res.data.Data;
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

        $scope.comDet = {};
        GlobalServices.getCompanyDet().then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.comDet = res.data.Data;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        $scope.PaymentTermColl = [];
        $scope.PaymentTermColl_Qry = [];
        GlobalServices.getPaymentTerms().then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.PaymentTermColl = res.data.Data;
                $scope.PaymentTermColl_Qry = mx(res.data.Data);
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

        $scope.RefVoucherTypeColl = [{ id: 1, text: 'SalesInvoice' }];
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
        $scope.FreightTypeColl = [];
        glSrv.getFreightTypes().then(function (res1) {
            $scope.FreightTypeColl = res1.data.Data;
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
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
            PaymentUnder: true,
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
            IsScrap: true,             
            ActiveSummaryEntry: true,
            ActiveTender: true,
            ProductCompany: true
           
        }

        $scope.beData =
        {
            UniqueId: GlobalServices.getUniqueId(),
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
            SalesReturnDetail: {},
            SaveClear: false,
            RefVoucherType: 1,
            RefTranIdColl: [],            
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
        //glSrv.getSalesLedger().then(function (res1) {
        //    $scope.SalesLedgerColl = res1.data.Data;
        //}, function (reason) {
        //    Swal.fire('Failed' + reason);
        //});


        $scope.EPDet = {};
        $scope.EPColl = [];
        $scope.ItemFormula = {};
        GlobalServices.getEntityProperties(EntityId).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.EPColl = res.data.Data;
                var onChangeColl = [];
                $scope.OnChangeEPColl = [];
                $scope.OnChangeEPItemColl = [];
                angular.forEach($scope.EPColl, function (ep) {
                    $scope.EPDet[ep.Name] = ep;

                    if (ep.OnChange && ep.OnChange.length > 0) {
                        var pp = 'beData.' + ep.Name;
                        onChangeColl.push(pp);
                        $scope.OnChangeEPColl.push(ep);
                    }
                    //$scope.newProduct[ep.Name] = ep.DefaultValue;
                });

                if (onChangeColl.length > 0) {

                    $scope.$watchGroup(onChangeColl, function (newValues, oldValues) {
                        for (let i = 0; i < newValues.length; i++) {
                            if (newValues[i] !== oldValues[i]) {
                                $timeout(function () {
                                    var findEP = $scope.OnChangeEPColl[i];
                                    if (findEP) {
                                        try {
                                            const dynamicFunction = new Function('tran', `${findEP.OnChange}`);
                                            dynamicFunction($scope.beData);
                                        } catch (error) {
                                            // Handle errors gracefully
                                            console.log('Error executing code: ' + error.message);
                                        }
                                        // console.log(`Change detected in ${findEP.Name} ${i + 1}`);
                                        // console.log(`New Value: ${newValues[i]}, Old Value: ${oldValues[i]}`);
                                    }
                                }, 100);

                            }
                        }
                    });
                }

                if ($scope.EPDet) {

                    for (key in $scope.EPDet) {
                        if (key.startsWith("ItemAllocationColl") == true) {
                            var proName = key.replace("ItemAllocationColl.", "");

                            var findEP = $scope.EPDet[key];
                            if (findEP && findEP.Formula && findEP.Formula.length > 0)
                                $scope.ItemFormula[proName] = findEP.Formula;

                            if (findEP) {
                                if (findEP.OnChange && findEP.OnChange.length > 0) {
                                    $scope.OnChangeEPItemColl.push(findEP);
                                }
                            }
                        }
                        else if (key.startsWith("SalesReturnDetail") == true) {
                            var proName = key.replace("SalesReturnDetail.", "");

                            var findEP = $scope.EPDet[key];
                            if (findEP && findEP.DefaultValue) {
                                $scope.beData.SalesReturnDetail[proName] = findEP.DefaultValue;
                            }
                        }
                        else if (key.indexOf('.') == -1) {
                            var findEP = $scope.EPDet[key];
                            if (findEP && findEP.DefaultValue) {
                                $scope.beData[key] = findEP.DefaultValue;
                            }
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

    
        $scope.RefVoucherNoColl = [];
        $('#cboRefVoucherNo').select2();
        $('#cboRefVoucherNo').on("change", function (e) {
            var selectedData = $('#cboRefVoucherNo').select2('data');
            if (selectedData && selectedData.length > 0) {
                $scope.beData.RefTranIdColl = [];
                angular.forEach(selectedData, function (sd) {
                    $scope.beData.RefTranIdColl.push(parseInt(sd.id));
                });
                var refTranIdColl = mx($scope.beData.RefTranIdColl);
                var lstSelectedItem = null;
                angular.forEach($scope.RefItemAllocationColl, function (ri) {
                    if (refTranIdColl.contains(ri.TranId)) {
                        ri.IsSelected = true;
                        lstSelectedItem = ri;
                    } else
                        ri.IsSelected = false;
                });

                if (lstSelectedItem)
                    $scope.getRefVoucherPartyDetails(lstSelectedItem);

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
    $scope.ChangePaymentType = function (id) {
        var findCB = $scope.PaymentTermColl_Qry.firstOrDefault(p1 => p1.id == id);
        if (findCB) {
            if (findCB.LedgerId || findCB.LedgerId > 0) {
                $scope.beData.PartyLedgerId = findCB.LedgerId;
            }
        }
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
                    Label: udf.Label,
                };
                udfColl.push(ud);
            });
        }

        if ($scope.beData.ItemDetailsColl) {
            var gid = null;
            var count = $scope.beData.ItemDetailsColl.length;
            if (count > 0) {
                gid = $scope.beData.ItemDetailsColl[count - 1].GodownId;
                if (gid > 0) {

                } else
                    gid = $scope.beData.GodownId;
            }
                

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
                    QtyDecimal: 2,
                    RateDecimal: 2,
                    AmountDecimal: 2,
                    GodownId: gid,
                    UDFFeildsColl: udfColl,
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
                    QtyDecimal: 2,
                    RateDecimal: 2,
                    AmountDecimal: 2,
                    GodownId: gid,
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

        $scope.RecalculateAdditioncalCost();
        $scope.CalculateTotalAndSubTotal();
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
                    SchemeAmt: 0,
                    QtyDecimal: 2,
                    RateDecimal: 2,
                    AmountDecimal: 2
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
                    SchemeAmt: 0,
                    QtyDecimal: 2,
                    RateDecimal: 2,
                    AmountDecimal: 2
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

    $scope.RefreshRowData = function (itemDet, ind) {
        if (itemDet.RowType == 'P') {

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
        else if (itemDet.RowType == 'L') {
            $scope.loadingstatus = 'running';
            showPleaseWait();
            $http({
                method: 'GET',
                url: base_url + "Global/GetLedgerDetail?LedgerId=" + itemDet.LedgerId + " & VoucherType=" + $scope.SelectedVoucher.VoucherType + "&ShowClosing=false",
                dataType: "json"
            }).then(function (resLD) {

                $scope.loadingstatus = 'stop';
                hidePleaseWait();
                if (resLD.data.IsSuccess && resLD.data.Data) {
                    //itemDet.costLedgerDetail = resLD.data.Data
                    var llId = resLD.data.Data.LedgerId;
                    angular.forEach($scope.beData.ItemDetailsColl, function (idLed) {
                        if (idLed.RowType == 'L') {
                            if (llId == idLed.LedgerId) {
                                idLed.costLedgerDetail = resLD.data.Data;
                            }
                        }
                    });

                    $scope.RecalculateAdditioncalCost();
                }
            }, function (reason) {
                alert('Failed' + reason);
            });
        }
    }
    $scope.CurItemAllocation = null;
    $scope.ProductSelectionChange = function (itemDet, ind) {
        $scope.sideBarData = itemDet.sideBarData;
        $scope.CurItemAllocation = itemDet;

        var isModify = $scope.beData.TranId > 0 ? true : false;

        if (itemDet.ProductId > 0 && itemDet.ProductId != itemDet.LastProductId && itemDet.AddFrom != 'barcode' && itemDet.IsImport != true) {
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
            itemDet.LossRate = 0;
            itemDet.Makeing = 0;
            itemDet.Stone = 0;
            itemDet.NetWeight = 0;
            itemDet.LossWeight = 0;
            itemDet.ProductLedgerId = null;
            itemDet.Weight = 0;
            itemDet.WeightUnitId = null;
            itemDet.WeightUnit = '';
            itemDet.Volum = 0;
            itemDet.VolumUnit = '';
            itemDet.VolumUnitId = null;
            itemDet.OnActionUDF = false;
            itemDet.AlUnitId1 = 0;
            itemDet.AlUnitId2 = 0;
            itemDet.AlUnitId3 = 0;
            itemDet.ALValue1 = 0;
            itemDet.ALValue2 = 0;
            itemDet.ALValue3 = 0;
            itemDet.UnitName1 = '';
            itemDet.UnitName2 = '';
            itemDet.UnitName3 = '';
            itemDet.RateUnitId = itemDet.UnitId;
			  if (itemDet.UDFFeildsColl && itemDet.UDFFeildsColl.length > 0) {
                itemDet.UDFFeildsColl.forEach(function (udf) {
                    udf.Value = '';
                    udf.UDFValue = null;
                    udf.UDFValueDet = null;
                });
            }
        }

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
            itemDet.TranUnitId = null;
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
			
            if ($scope.SelectedVoucher.VoucherWiseGodownColl.length == 1) {
                $scope.GodownSelectionChange(itemDet);
            }
			
			itemDet.OnActionUDF = false;
            if (itemDet.UDFFeildsColl) {
                itemDet.UDFFeildsColl.forEach(function (id) {
                    if (id.FieldAfter == 14) {
                        itemDet.OnActionUDF = true;
                    }
                });
            }
			
            itemDet.TranUnitId = itemDet.productDetail.SalesUnitId;
            itemDet.CanEditRate = itemDet.productDetail.CanEditRate;

            var refStockItem = false;
            if (itemDet.DeliveryNoteItemAllocationId > 0 || itemDet.OrderItemAllocationId > 0 || itemDet.InvoiceItemAllocationId > 0
                || itemDet.ReceivedNoteItemAllocationId > 0) {
                refStockItem = true;
            }

            if ((isModify == false || isEmptyNum(itemDet.ItemAllocationId) == 0) && refStockItem == false) {

                itemDet.PurchaseRate = itemDet.productDetail.PurchaseRate;
                itemDet.SalesRate = itemDet.productDetail.SalesRate;
                itemDet.Rate = itemDet.productDetail.SalesRate;

                if ($scope.HideShow.SalesLedger == false && $scope.beData.SalesLedgerId > 0) {
                    itemDet.ProductLedgerId = $scope.beData.SalesLedgerId;
                    itemDet.LedgerId = $scope.beData.SalesLedgerId;
                }
                else {
                    itemDet.ProductLedgerId = itemDet.productDetail.SalesLedgerId;
                    itemDet.LedgerId = itemDet.productDetail.SalesLedgerId;
                }

                var weightUnit = $scope.UnitColl.firstOrDefault(p1 => p1.UnitId == itemDet.productDetail.WeightUnitId);
                if (weightUnit) {
                    itemDet.WeightUnitId = weightUnit.UnitId;
                    itemDet.WeightUnit = weightUnit.Name;
                }

                var volumUnit = $scope.UnitColl.firstOrDefault(p1 => p1.UnitId == itemDet.productDetail.VolumUnitId);
                if (volumUnit) {
                    itemDet.VolumUnitId = volumUnit.UnitId;
                    itemDet.VolumUnit = volumUnit.Name;
                }
                 
            } else {

                if (!itemDet.ProductLedgerId || itemDet.ProductLedgerId == 0)
                    itemDet.ProductLedgerId = itemDet.productDetail.SalesLedgerId;

                if (!itemDet.LedgerId || itemDet.LedgerId == 0)
                    itemDet.LedgerId = itemDet.productDetail.SalesLedgerId;

                var weightUnit = (itemDet.WeightUnitId ? $scope.UnitColl.firstOrDefault(p1 => p1.UnitId == itemDet.WeightUnitId) : $scope.UnitColl.firstOrDefault(p1 => p1.UnitId == itemDet.productDetail.WeightUnitId));
                if (weightUnit) {
                    itemDet.WeightUnitId = weightUnit.UnitId;
                    itemDet.WeightUnit = weightUnit.Name;
                }

                var volumUnit = (itemDet.VolumUnitId ? $scope.UnitColl.firstOrDefault(p1 => p1.UnitId == itemDet.VolumUnitId) : $scope.UnitColl.firstOrDefault(p1 => p1.UnitId == itemDet.productDetail.VolumUnitId));
                if (volumUnit) {
                    itemDet.VolumUnitId = volumUnit.UnitId;
                    itemDet.VolumUnit = volumUnit.Name;
                }
            }

            itemDet.ClosingQty = $filter('formatNumber')(itemDet.productDetail.ClosingQty) + ' ' + itemDet.productDetail.BaseUnit;
            itemDet.UnitId = itemDet.productDetail.BaseUnitId;
            itemDet.UnitName = itemDet.productDetail.BaseUnit;

            if ($scope.SelectedVoucher.Product.ProductWiseTaxable == true && isModify == false)
                itemDet.ProductWiseTaxable = itemDet.productDetail.IsTaxable;

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

            var clQty = ($filter('number')(itemDet.productDetail.ClosingQty, itemDet.QtyDecimal)).parseDBL();
            itemDet.productDetail.ClosingQty = clQty;
            itemDet.ClosingQty = clQty + ' ' + itemDet.productDetail.BaseUnit;

            if (itemDet.productDetail.ActiveSerialNo == true && $scope.SelectedVoucher.Product.ActiveSerialNo==true) {
                if (!itemDet.SerialDetailColl || itemDet.SerialDetailColl.length == 0) {
                    itemDet.SerialDetailColl = [];
                    itemDet.SerialDetailColl.push({});
                }

                if (itemDet.productDetail.Init != true) {
                    $('#mdlSerialNo').modal('show');
                }
            }

            $scope.ChangeItemRowValue(itemDet, 'product');

            if (itemDet.productDetail) {
                if ($scope.SelectedVoucher.MultipleFixedProduct == true && itemDet.productDetail.IsFixedProduct == true) {

                    if (!itemDet.FixedProductColl || itemDet.FixedProductColl.length == 0) {
                        itemDet.FixedProductColl = [];
                        itemDet.FixedProductColl.push({});
                    }
                    if (itemDet.productDetail.Init != true) {
                        $('#mdlFixedProduct').modal('show');
                    }
                }
            }

            $timeout(function () {
                if (itemDet.ModifyDetailsColl && itemDet.ModifyDetailsColl.length > 0) {

                    if ($scope.SelectedVoucher.Product.BatchNo == true && itemDet.ModifyDetailsColl.length > 1) {

                        if ((!itemDet.SelectedBatchColl || itemDet.SelectedBatchColl.length == 0)) {
                            itemDet.SelectedBatchColl = [];
                            itemDet.productDetail.BatchWiseColl = [];
                            itemDet.ModifyDetailsColl.forEach(function (idet) {
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
                                    BalQty: idet.ActualQty,
                                    SalesQty: idet.ActualQty,
                                    IsSelected: true
                                };
                                itemDet.SelectedBatchColl.push(newBatch);
                                itemDet.productDetail.BatchWiseColl.push(newBatch);
                            });
                        }

                        if (itemDet.productDetail.MultipleBatch == true && itemDet.productDetail.MaintainBatchWise == true) {

                            if (itemDet.productDetail.Init != true) {
                                $('#mdlMultipleBatch').modal('show');
                            }
                        }
                        else {
                            if (itemDet.productDetail.ReturnBatchWiseColl && itemDet.productDetail.ReturnBatchWiseColl.length > 0) {
                                var bDet = itemDet.productDetail.ReturnBatchWiseColl[0];
                                if (bDet) {
                                    itemDet.Batch = bDet.BatchNo;
                                    itemDet.ActualQty = bDet.BalQty;
                                    itemDet.Rate = bDet.SalesRate;
                                    itemDet.MFGDate = bDet.MFGDate;
                                    itemDet.EXPDate = bDet.EXPDate;
                                }
                            }                                                    
                        }

                    }
                    else {
                        if (itemDet.productDetail.ReturnBatchWiseColl && itemDet.productDetail.ReturnBatchWiseColl.length > 0) {
                            var bDet = itemDet.productDetail.ReturnBatchWiseColl[0];
                            if (bDet) {
                                itemDet.Batch = bDet.BatchNo;
                                itemDet.ActualQty = bDet.BalQty;
                                itemDet.Rate = bDet.SalesRate;
                                itemDet.MFGDate = bDet.MFGDate;
                                itemDet.EXPDate = bDet.EXPDate;
                            }                            
                        }                        
                    }

                    //$scope.ChangeBatch(itemDet);
                }
                else if (itemDet.productDetail.ReturnBatchWiseColl && itemDet.productDetail.ReturnBatchWiseColl.length>0)
                {
                    if (itemDet.productDetail.ReturnBatchWiseColl && itemDet.productDetail.ReturnBatchWiseColl.length > 0) {
                        var bDet = itemDet.productDetail.ReturnBatchWiseColl[0];
                        if (bDet) {
                            itemDet.Batch = bDet.BatchNo;
                            itemDet.ActualQty = bDet.BalQty;
                            itemDet.Rate = bDet.SalesRate;
                            itemDet.MFGDate = bDet.MFGDate;
                            itemDet.EXPDate = bDet.EXPDate;
                        }                        
                    }
                    
                }
            });

            if ($scope.SelectedVoucher.Product.ShowTranHistory == true) {

                if (itemDet.productDetail.Init != true) {
                    $('#frmTranHistory').modal('show');
                }
            }

            if ($scope.SelectedVoucher.Product.ActiveRateUOM == true && itemDet.productDetail.AlternetUnitColl) {
                var alColl = mx(itemDet.productDetail.AlternetUnitColl);
                itemDet.RateUOMColl = [];
                itemDet.RateUOMColl.push({
                    UnitId: itemDet.UnitId,
                    Name: itemDet.UnitName
                });
                if (itemDet.ALUnitId1 > 0 && ($scope.HideShow.AlternetUnit1 == false || $scope.HideShow.AlternetUnitMultiple == false)) {
                    if (itemDet.ALUnitId1 != itemDet.UnitId) {
                        var findU = alColl.firstOrDefault(p1 => p1.UnitId == itemDet.ALUnitId1);
                        if (findU) {
                            itemDet.RateUOMColl.push({
                                UnitId: findU.UnitId,
                                Name: findU.UnitName
                            });
                        }
                    }
                }
                if (itemDet.ALUnitId2 > 0 && $scope.HideShow.AlternetUnit2 == false) {
                    if (itemDet.ALUnitId2 != itemDet.UnitId && itemDet.ALUnitId2 != itemDet.ALUnitId1) {
                        var findU = alColl.firstOrDefault(p1 => p1.UnitId == itemDet.ALUnitId2);
                        if (findU) {
                            itemDet.RateUOMColl.push({
                                UnitId: findU.UnitId,
                                Name: findU.UnitName
                            });
                        }
                    }
                }
                if (itemDet.RateUnitId > 0) {

                } else {
                    itemDet.RateUnitId = itemDet.UnitId;
                    if (isModify == false) {
                        itemDet.RatePer = itemDet.Rate;
                    }
                }
            }

            var itemC = mx($scope.beData.ItemDetailsColl).where(p1 => p1.RowType == 'P').count();
            if (ind == (itemC - 1))
                $scope.AddRowInTable(ind);
        }

    }

    $scope.AditionalCostSelectionChange = function (itemDet, ind) {

        $timeout(function () {
            $scope.sideBarData = itemDet.costSideBarData;

            if (itemDet.LedgerId == null || itemDet.LedgerId == 0) {
                itemDet.Rate = 0;
                itemDet.Amount = 0;
                itemDet.AccessableValue = 0;
                itemDet.AditionalCostOnTheBasis = null;
                itemDet.IsTaxable = null;
            }
            else if (itemDet.LedgerId > 0 && (itemDet.costLedgerDetail == null || itemDet.costLedgerDetail === undefined)) {
                $scope.RefreshRowData(itemDet, ind);
            }
            else if (itemDet.costLedgerDetail) {
                itemDet.Rate = (itemDet.costLedgerDetail.Rate ? itemDet.costLedgerDetail.Rate : 0);
                itemDet.AccessableValue = 0;
                itemDet.Amount = 0;
				itemDet.AditionalCostOnTheBasis = itemDet.costLedgerDetail.AditionCostOnBasisOf;
                itemDet.IsTaxable = itemDet.costLedgerDetail.IsTaxable;
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

    $scope.lastPartyLedgerId = null;
    $scope.PartySelectionChange = function (partyDet) {
        var isModify = $scope.beData.TranId > 0 ? true : false;
        $scope.sideBarData = partyDet.partySideBarData;

        if (partyDet.PartyLedgerId && partyDet.PartyLedgerId > 0) {
            if ($scope.comDet.Maintain == 3 && $scope.beData.SalesReturnDetail && $scope.beData.SalesReturnDetail.PatientId > 0) {

            } else {
                if (partyDet.PartyLedger) {
                    var isNew = false;
                    if ($scope.lastPartyLedgerId != partyDet.PartyLedgerId && isModify == false) {

                        isNew = true;
                        $scope.beData.RefVoucherType = 0;
                        $scope.ClearItemDetails();
                        partyDet.SalesReturnDetail = {};
                        $scope.lastPartyLedgerId = partyDet.PartyLedgerId;

                        var assignTP = false;
                        if (isModify == false) {
                            if ($scope.EPDet) {
                                var findPE = $scope.EPDet['SalesReturnDetail.TermsOfPayment'];
                                if (findPE && findPE.DefaultValue) {
                                    partyDet.SalesReturnDetail.TermsOfPayment = findPE.DefaultValue;
                                    assignTP = true;
                                }
                            }
                        }

                        if(isModify==false && assignTP==false)
                            partyDet.SalesReturnDetail.TermsOfPayment = partyDet.PartyLedger.PaymentType;

                        if (partyDet.PartyLedger.BillToColl && partyDet.PartyLedger.BillToColl.length > 0)
                            partyDet.SalesReturnDetail.BillToId = partyDet.PartyLedger.BillToColl[0].Id;

                        if (partyDet.PartyLedger.ShipToColl && partyDet.PartyLedger.ShipToColl.length > 0)
                            partyDet.SalesReturnDetail.ShipToId = partyDet.PartyLedger.ShipToColl[0].Id;

                        $scope.ChangeBillAddress();
                        $scope.ChangeShipAddress();

                        if ($scope.comDet.Maintain == 3) {


                            if (!partyDet.SalesReturnDetail.Buyes)
                                partyDet.SalesReturnDetail.Buyes = partyDet.PartyLedger.Name;

                            if (!partyDet.SalesReturnDetail.Address)
                                partyDet.SalesReturnDetail.Address = partyDet.PartyLedger.Address;

                            if (!partyDet.SalesReturnDetail.SalesTaxNo)
                                partyDet.SalesReturnDetail.SalesTaxNo = partyDet.PartyLedger.PanVat;

                            if (!partyDet.SalesReturnDetail.PhoneNo)
                                partyDet.SalesReturnDetail.PhoneNo = partyDet.PartyLedger.MobileNo1;

                        } else {

                            if (partyDet.SalesReturnDetail.SalesInvoiceTranId > 0) {

                            }
                            else {
                                partyDet.SalesReturnDetail.Buyes = partyDet.PartyLedger.Name;
                                partyDet.SalesReturnDetail.Address = partyDet.PartyLedger.Address;
                                partyDet.SalesReturnDetail.SalesTaxNo = partyDet.PartyLedger.PanVat;
                                partyDet.SalesReturnDetail.PhoneNo = partyDet.PartyLedger.MobileNo1;
                            }
                        }
                        partyDet.SalesReturnDetail.BuyesId = null;

                    }
                    else if (isModify == true && $scope.lastPartyLedgerId != partyDet.PartyLedgerId) {
                        partyDet.SalesReturnDetail.Buyes = partyDet.PartyLedger.Name;
                        partyDet.SalesReturnDetail.Address = partyDet.PartyLedger.Address;
                        partyDet.SalesReturnDetail.SalesTaxNo = partyDet.PartyLedger.PanVat;
                        partyDet.SalesReturnDetail.PhoneNo = partyDet.PartyLedger.MobileNo1;

                        $scope.lastPartyLedgerId = partyDet.PartyLedgerId;
                    }


                }

            }
          
            if ($scope.SelectedVoucher.ActivePartyDetails == true)
            {
                if ($scope.lastPartyLedgerId != partyDet.PartyLedgerId)
                    $scope.RefVoucherChange($scope.beData.RefVoucherType);

                $('#frmSalesReturnDetailsModel').modal('show');
            }
                

        } else {

            $scope.lastPartyLedgerId = null;
            $scope.search = "";
            $scope.RefVoucherNoColl = [];           
            $scope.RefItemAllocationColl = [];
            
            if ($scope.comDet.Maintain != 3)
                partyDet.SalesReturnDetail = {};

            $scope.RecalculateAdditioncalCost();
            $scope.CalculateTotalAndSubTotal();
            $('#frmSalesReturnDetailsModel').modal('hide');
        }



    };

    $scope.ChangeBillAddress = function () {

        if ($scope.beData.PartyLedger.BillToColl) {
            var find = mx($scope.beData.PartyLedger.BillToColl).firstOrDefault(p1 => p1.Id == $scope.beData.SalesReturnDetail.BillToId);
            if (find) {
                $scope.beData.SalesReturnDetail.BillToAddress = find.ConcatAddress;
            }
        }
    }
    $scope.ChangeShipAddress = function () {
        if ($scope.beData.PartyLedger.ShipToColl) {
            var find = mx($scope.beData.PartyLedger.ShipToColl).firstOrDefault(p1 => p1.Id == $scope.beData.SalesReturnDetail.ShipToId);
            if (find) {
                $scope.beData.SalesReturnDetail.ShipToAddress = find.ConcatAddress;
            }
        }
    }

    $scope.CheckedAll = false;
    $scope.RefAditionalCostColl = [];
    $scope.CheckedAllRefItem = function () {
        var lstSelected = null;
        angular.forEach($scope.RefItemAllocationColl, function (ri) {
            ri.IsSelected = $scope.CheckedAll;

            if (ri.IsSelected == true)
                lstSelected = ri;
        });

        if (lstSelected)
            $scope.getRefVoucherPartyDetails(lstSelected);
    }

    $scope.getRefVoucherPartyDetails = function (refItem) {
      
        //$scope.beData.SalesReturnDetail.Goods = tmpdata.SalesInvoiceDetail.Goods;

        if ($scope.beData.RefVoucherType && refItem && refItem.IsSelected == true) {

            $scope.loadingstatus = "running";
            showPleaseWait();

            $scope.RefAditionalCostColl = [];
            var vType = 14;
             

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
                $scope.loadingstatus = "stop";
                hidePleaseWait();
                if (res1.data.IsSuccess && res1.data.Data) {
                    var tranData = res1.data.Data;
                    var tranDet = tranData.SalesInvoiceDetail;

                    var Attributes = [];
                    if (tranDet.Attributes) {
                        Attributes = JSON.parse(tranDet.Attributes);
                    }
                    Attributes = mx(Attributes);

                    if (tranDet && tranDet.UDFKeyVal && tranDet.UDFKeyVal.length > 0) {
                        tranDet.UDFKeyVal = JSON.parse(tranDet.UDFKeyVal);
                        angular.forEach($scope.beData.UDFFeildsColl, function (uf) {

                            var findAtt = Attributes.firstOrDefault(p1 => p1.Name == uf.Name && p1.SNo == uf.SNo);
                            var fUVal = tranDet.UDFKeyVal[uf.NameId];
                            if (fUVal) {
                                if (findAtt) {
                                    if (findAtt.Value != fUVal) {
                                        uf.UDFValue = findAtt.Value;
                                    }
                                    else {
                                        uf.UDFValue = fUVal;
                                    }
                                }
                                else {
                                    uf.UDFValue = fUVal;
                                }
                            }

                        });
                    }

                    $scope.beData.PartyCostCenter = tranData.PartyCostCenter;
                    $scope.beData.TranCostCenter = tranData.TranCostCenter;
                    $scope.beData.AgentId = tranData.AgentId;

                    

                    if ($scope.beData.PartyLedgerId == null || $scope.beData.PartyLedgerId == 0) {
                        $scope.lastPartyLedgerId = tranDet.PartyLedgerId;
                        $scope.beData.PartyLedgerId = tranDet.PartyLedgerId;
                    } else {
                        $scope.lastPartyLedgerId = $scope.beData.PartyLedgerId;
                    }
                        

                    $scope.beData.SalesReturnDetail.LCTranId = tranDet.LCTranId;
                    $scope.beData.SalesReturnDetail.TermsOfPayment = tranDet.TermsOfPayment;
                    $scope.beData.SalesReturnDetail.OtherRefereces = tranDet.OtherRefereces;
                    $scope.beData.SalesReturnDetail.TermsOfDelivery = tranDet.TermsOfDelivery;
                    $scope.beData.SalesReturnDetail.DeliveryThrough = tranDet.DeliveryThrough;
                    $scope.beData.SalesReturnDetail.DeliveryDocNo = tranDet.DeliveryDocNo;
                    $scope.beData.SalesReturnDetail.Destination = tranDet.Destination;
                    $scope.beData.SalesReturnDetail.SalesQuotationTermsOfPayment = tranDet.SalesQuotationTermsOfPayment;
                    $scope.beData.SalesReturnDetail.SalesQuotationOtherRefereces = tranDet.SalesQuotationOtherRefereces;
                    $scope.beData.SalesReturnDetail.SalesQuotationTermsOfDelivery = tranDet.SalesQuotationTermsOfDelivery;
                    $scope.beData.SalesReturnDetail.Buyes = tranDet.Buyes;
                    $scope.beData.SalesReturnDetail.Address = tranDet.Address;
                    $scope.beData.SalesReturnDetail.SalesTaxNo = tranDet.SalesTaxNo;
                    $scope.beData.SalesReturnDetail.CSTNumber = tranDet.CSTNumber;
                    $scope.beData.SalesReturnDetail.Notes = tranDet.Notes;
                    $scope.beData.SalesReturnDetail.PhoneNo = tranDet.PhoneNo;
                    $scope.beData.SalesReturnDetail.Description = tranDet.Description;
                    $scope.beData.SalesReturnDetail.OwnerName = tranDet.OwnerName;
                    $scope.beData.SalesReturnDetail.OwnerContactNo = tranDet.OwnerContactNo;
                    $scope.beData.SalesReturnDetail.DriverAddress = tranDet.DriverAddress;
                    $scope.beData.SalesReturnDetail.DriverName = tranDet.DriverName;
                    $scope.beData.SalesReturnDetail.DriverContactNo = tranDet.DriverContactNo;
                    $scope.beData.SalesReturnDetail.LicenseNo = tranDet.LicenseNo;
                    $scope.beData.SalesReturnDetail.Goods = tranDet.Goods;
                    $scope.beData.SalesReturnDetail.Quantity = tranDet.Quantity;
                    $scope.beData.SalesReturnDetail.FreightRate = tranDet.FreightRate;
                    $scope.beData.SalesReturnDetail.AdvancePayment = tranDet.AdvancePayment;
                    $scope.beData.SalesReturnDetail.TotalWT = tranDet.TotalWT;
                    $scope.beData.SalesReturnDetail.ContactNo = tranDet.ContactNo;
                    $scope.beData.SalesReturnDetail.RegdNo = tranDet.RegdNo;
                    $scope.beData.SalesReturnDetail.EngineNo = tranDet.EngineNo;
                    $scope.beData.SalesReturnDetail.ChassisNo = tranDet.ChassisNo;
                    $scope.beData.SalesReturnDetail.Model = tranDet.Model;
                    $scope.beData.SalesReturnDetail.VinNo = tranDet.VinNo;
                    $scope.beData.SalesReturnDetail.CreditDays = tranDet.CreditDays;
                    $scope.beData.SalesReturnDetail.ExportCountry = tranDet.ExportCountry;
                    $scope.beData.SalesReturnDetail.PPNo = tranDet.PPNo;
                    $scope.beData.SalesReturnDetail.PPDate = tranDet.PPDate;
                    $scope.beData.SalesReturnDetail.OtherRefereces1 = tranDet.OtherRefereces1;
                    $scope.beData.SalesReturnDetail.PaymentTermsId = tranDet.PaymentTermsId;
                    $scope.beData.SalesReturnDetail.FreightTypeId = tranDet.FreightTypeId;
                    $scope.beData.Narration = tranData.Narration;
                    $scope.beData.No = tranData.RefNo;
                    $scope.beData.RefNo = tranData.RefNo;
                    $scope.beData.SalesReturnDetail.BillToId = tranDet.BillToId;
                    $scope.beData.SalesReturnDetail.ShipToId = tranDet.ShipToId;
                    $scope.beData.SalesReturnDetail.BillToAddress = tranDet.BillToAddress;
                    $scope.beData.SalesReturnDetail.ShipToAddress = tranDet.ShipToAddress;

                    

                    $scope.RefAditionalCostColl = tranData.AditionalCostColl;
                    $scope.ChangeTermsOfPayment();

                }
            }, function (reason) {
                Swal.fire('Failed' + reason);
            });

        }



    };

    $scope.LoadRefVoucherNo = function () {

        if ($scope.beData.RefNo && $scope.beData.RefNo.length > 0 && $scope.SelectedVoucher.RefFieldAs==2) {
            if ($scope.beData.CostClassId && $scope.beData.CostClassId > 0) {
                var para = {
                    voucherNo: $scope.beData.RefNo,
                    ForReturn: true,
                    CostClassId: ($scope.beData.ReturnCostClassId > 0 ? $scope.beData.ReturnCostClassId : $scope.SelectedCostClass.CostClassId),
                    BranchId: $scope.SelectedVoucher.BDId,
                };

                $http({
                    method: 'POST',
                    url: base_url + "Inventory/Transaction/GetSalesInvoiceByVoucherNo",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    if (res.data.IsSuccess && res.data.Data) {
                        var tran = res.data.Data;
                        $scope.lastPartyLedgerId = tran.PartyLedgerId;

                        var patientId = tran.SalesInvoiceDetail.PatientId;

                        $scope.beData.TicketTypeId = tran.TicketTypeId;
                        $scope.beData.ServiceTypeId = tran.ServiceTypeId;
                        $scope.beData.ClaimId = tran.ClaimId;

                        $scope.beData.CurRate = tran.CurRate;
                        $scope.beData.CurrencyId = tran.CurrencyId; 
                        $scope.beData.Narration = tran.Narration;   
                        $scope.beData.PartyLedgerId = tran.PartyLedgerId;
                        $scope.beData.SalesLedgerId = (tran.SalesLedgerId ? tran.SalesLedgerId : 0);
                        $scope.beData.TotalAmount = tran.TotalAmount;
                        $scope.beData.AgentId = tran.AgentId ? tran.AgentId : 0;
                        $scope.beData.PartyCostCenter = tran.PartyCostCenter ? tran.PartyCostCenter : 0;
                        $scope.beData.TranCostCenter = tran.TranCostCenter ? tran.TranCostCenter : 0;   
                        $scope.beData.ItemAllocationColl = tran.ItemAllocationColl;
                        $scope.beData.AditionalCostColl = [];
                        $scope.beData.SalesReturnDetail = tran.SalesInvoiceDetail;
                        $scope.beData.SalesReturnDetail.PatientId = patientId;
                        $scope.beData.SalesReturnDetail.SalesInvoiceTranId = tran.TranId;
                        $scope.beData.SalesReturnDetail.PatientNo = tran.SalesInvoiceDetail.PatientNo;
                        //$scope.beData.GodownId = tran.GodownId

                         
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
                                    Label: udf.Label,
                                };
                                udfColl.push(ud);
                            });
                        }

                        $scope.beData.ItemDetailsColl = [];
                        angular.forEach(tran.ItemAllocationColl, function (itemA)
                        {
                            itemA.LastGodownId = itemA.GodownId;
                            angular.forEach(itemA.ItemDetailsColl, function (itemAD) {
                                itemAD.RowType = 'P';
                                itemAD.LastProductId = itemAD.ProductId;
                                itemAD.LastGodownId = itemAD.GodownId;

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
                                itemAD.InvoiceItemAllocationId = itemA.ItemAllocationId;


                                var uValColl = itemA.UDFKeyVal ? JSON.parse(itemA.UDFKeyVal) : null;
                                itemAD.UDFFeildsColl = [];
                                angular.forEach(udfColl, function (uc) {
                                    itemAD.UDFFeildsColl.push({
                                        SNo: uc.SNo,
                                        Name: uc.Name,
                                        Value: uc.Value,
                                        FieldNo: uc.SNo,
                                        DisplayName: uc.DisplayName,
                                        FieldType: uc.FieldType,
                                        IsMandatory: uc.IsMandatory,
                                        Length: 100,
                                        SelectOptions: uc.SelectOptions,
                                        FieldAfter: uc.FieldAfter,
                                        NameId: uc.NameId,
                                        Source: uc.Source,
                                        Formula: uc.Formula,
                                        UDFValue: (uValColl ? uValColl[uc.NameId] : uc.DefaultValue)
                                    });
                                });
                                $scope.beData.ItemDetailsColl.push(itemAD);
                            });
                        });

                        angular.forEach(tran.AditionalCostColl, function (adc) {
                            adc.RowType = 'L';
                            adc.ActualQty = 0;
                            adc.BilledQty = 0;
                            adc.FreeQty = 0;
                            adc.Rate = adc.Rate;
                            adc.DiscountPer = 0;
                            adc.DiscountAmt = 0;
                            adc.SchameAmt = 0;
                            adc.SchamePer = 0;
                            adc.QtyPoint = 0;
                            adc.UnitId = null;
                            adc.CanEditRate = true;
                            adc.ALValue1 = 0;
                            adc.ALValue2 = 0;
                            adc.ALUnitId1 = null;
                            adc.ALUnitId2 = null;
                            adc.SchemeAmt = 0;
                            adc.SchemeAmt = 0;
                            adc.QtyDecimal = 2;
                            adc.RateDecimal = 2;
                            adc.AmountDecimal = 2;

                            $scope.beData.ItemDetailsColl.push(adc);
                        });

                        if ($scope.beData.SalesReturnDetail.PatientNo && $scope.beData.SalesReturnDetail.PatientNo.length>0)
                            $scope.GetPatientById();


                    } else {
                        Swal.fire(res.data.ResponseMSG);
                    }
                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }
        } else {

            if($scope.beData.RefNo && $scope.beData.RefNo.length>0)
                $scope.RefVoucherChange($scope.beData.RefVoucherType);

            //$scope.beData.AutoManualNo = '';
            //$scope.beData.AutoVoucherNo = 0;
        }

    };

    $scope.LoadRefProduct = function () {

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
                    Label: udf.Label,
                };
                udfColl.push(ud);
            });
        }

        var filterData = [];
        angular.forEach($scope.RefItemAllocationColl, function (node) {
            if (node.IsSelected == true)
                filterData.push(node);
        });

        var refVType = $scope.beData.RefVoucherType;

        if (filterData.length > 0) {
             
            $scope.beData.ItemDetailsColl = [];
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
                    InvoiceItemAllocationId: refVType == 1 ? fd.ItemAllocationId : null,
                    ProductLedgerId: fd.ProductLedgerId,
                    LedgerId: fd.ProductLedgerId, 
                }; 
                tmpItemAllocationColl.push(refItem); 
            });

            $timeout(function () {

                $scope.loadingstatus = 'running';
                showPleaseWait();

                var newSales = {
                    ItemAllocationColl: tmpItemAllocationColl
                };


                $http({
                    method: 'POST',
                    url: base_url + "Inventory/Transaction/GetSalesDetailsByItemAllocationId",
                    headers: { 'Content-Type': undefined },

                    transformRequest: function (data) {
                        var formData = new FormData();
                        formData.append("jsonData", angular.toJson(data.jsonData));
                        return formData;
                    },
                    data: { jsonData: newSales }
                }).then(function (res1) {
                     
                    $scope.loadingstatus = 'stop';
                    hidePleaseWait();

                    if (res1.data.IsSuccess == true) {
                         
                        angular.forEach(res1.data.Data.ItemAllocationColl, function (ias) {
                            ias.LastProductId = ias.ProductId;
                            var uValColl = ias.Attributes ? JSON.parse(ias.Attributes) : [];
                            ias.UDFFeildsColl = [];
                            angular.forEach(udfColl, function (uc) {
                                var findAVal = mx(uValColl).firstOrDefault(p1 => p1.SNo == uc.SNo);
                                ias.UDFFeildsColl.push({
                                    SNo: uc.SNo,
                                    Name: uc.Name,
                                    Value: (findAVal ? findAVal.Value : uc.DefaultValue),
                                    FieldNo: uc.SNo,
                                    DisplayName: uc.DisplayName,
                                    FieldType: uc.FieldType,
                                    IsMandatory: uc.IsMandatory,
                                    Length: 100,
                                    SelectOptions: uc.SelectOptions,
                                    FieldAfter: uc.FieldAfter,
                                    NameId: uc.NameId,
                                    Source: uc.Source,
                                    Formula: uc.Formula,
                                    UDFValue: (findAVal ? findAVal.Value : uc.DefaultValue),

                                });
                            });

                            ias.RowType = 'P';
                            ias.Narration = ias.Narration;
                            ias.ReadOnlyQty = $scope.SelectedVoucher.Product.RefQtyAs == 2 ? true : false;
                             
                            ias.FixedProductColl = [];
                            if (ias.MultipleFixedProduct == true || $scope.SelectedVoucher.MultipleFixedProduct==true)
                            {
                                if (ias.ItemDetailsColl && ias.ItemDetailsColl.length > 0) {

                                    angular.forEach(ias.ItemDetailsColl, function (det) {
                                        ias.FixedProductColl.push({
                                            Batch : det.Batch,
                                            MFGDate:det.MFGDate,
                                            EXPDate : det.EXPDate,
                                            RegdNo :det.RegdNo,
                                            EngineNo: det.EngineNo,
                                            ChassisNo: det.ChassisNo,
                                            Model :det.Model,
                                            CodeNo : det.CodeNo,
                                            Color : det.Color,
                                            KeyNo : det.KeyNo,
                                            MFGYear: det.MFGYear,
                                            Type: det.Type,
                                            ActualQty: 1,
                                            Rate: det.Rate,
                                            Amount: det.Amount,
                                            DiscountAmt: det.DiscountAmt,
                                            DiscountPer: det.DiscountPer,
                                        });
                                    });

                                    if (ias.ItemDetailsColl.length == 1) {
                                        var det = ias.ItemDetailsColl[0];
                                        ias.Batch=det.Batch;
                                        ias.MFGDate = det.MFGDate;
                                        ias.EXPDate = det.EXPDate;
                                        ias.RegdNo = det.RegdNo;
                                        ias.EngineNo = det.EngineNo;
                                        ias.ChassisNo = det.ChassisNo;
                                        ias.Model = det.Model;
                                        ias.CodeNo = det.CodeNo;
                                        ias.Color = det.Color;
                                        ias.KeyNo = det.KeyNo;
                                        ias.MFGYear = det.MFGYear;
                                        ias.Type = det.Type;                                                                                     
                                    }
                                }
                            }
                            else if ($scope.SelectedVoucher.Product.BatchNo == true && ias.ItemDetailsColl && ias.ItemDetailsColl.length > 0) {

                                ias.FixedProductColl = [];
                                ias.ModifyDetailsColl = [];
                                angular.forEach(ias.ItemDetailsColl, function (det) {
                                    ias.ModifyDetailsColl.push({
                                        Batch: det.Batch,
                                        MFGDate: det.MFGDate,
                                        EXPDate: det.EXPDate,
                                        RegdNo: det.RegdNo,
                                        EngineNo: det.EngineNo,
                                        ChassisNo: det.ChassisNo,
                                        Model: det.Model,
                                        CodeNo: det.CodeNo,
                                        Color: det.Color,
                                        KeyNo: det.KeyNo,
                                        MFGYear: det.MFGYear,
                                        Type: det.Type,
                                        ActualQty: det.ActualQty,
                                        Rate: det.Rate,
                                        Amount: det.Amount,
                                        DiscountAmt: det.DiscountAmt,
                                        DiscountPer: det.DiscountPer,
                                    });
                                });

                                if (ias.ItemDetailsColl && ias.ItemDetailsColl.length == 1) {
                                    var det = ias.ItemDetailsColl[0];
                                    ias.Batch = det.Batch;
                                    ias.MFGDate = det.MFGDate;
                                    ias.EXPDate = det.EXPDate;
                                    ias.RegdNo = det.RegdNo;
                                    ias.EngineNo = det.EngineNo;
                                    ias.ChassisNo = det.ChassisNo;
                                    ias.Model = det.Model;
                                    ias.CodeNo = det.CodeNo;
                                    ias.Color = det.Color;
                                    ias.KeyNo = det.KeyNo;
                                    ias.MFGYear = det.MFGYear;
                                    ias.Type = det.Type;
                                }
                                
                            }
                            else if (ias.ItemDetailsColl && ias.ItemDetailsColl.length > 0) {

                                ias.FixedProductColl = [];

                                var det = ias.ItemDetailsColl[0];
                                ias.Batch = det.Batch;
                                ias.MFGDate = det.MFGDate;
                                ias.EXPDate = det.EXPDate;
                                ias.RegdNo = det.RegdNo;
                                ias.EngineNo = det.EngineNo;
                                ias.ChassisNo = det.ChassisNo;
                                ias.Model = det.Model;
                                ias.CodeNo = det.CodeNo;
                                ias.Color = det.Color;
                                ias.KeyNo = det.KeyNo;
                                ias.MFGYear = det.MFGYear;
                                ias.Type = det.Type;
                            }

                            $scope.beData.ItemDetailsColl.push(ias);
                        });


                        var adCostColl = $scope.SelectedVoucher.AditionalCostAs == 1 ? $scope.RefAditionalCostColl : $scope.SelectedVoucher.AditionalChargeColl;
                        angular.forEach(adCostColl, function (ads) {
                            $scope.beData.ItemDetailsColl.push({
                                LedgerType: ads.LedgerType,
                                RowType: 'L',
                                LedgerId: ads.LedgerId,
                                ledgerDetail: null,
                                ActualQty: 0,
                                BilledQty: 0,
                                FreeQty: 0,
                                Rate: ads.Rate,
                                DiscountPer: 0,
                                DiscountAmt: 0,
                                SchameAmt: 0,
                                SchamePer: 0,
                                Amount: ads.Amount,
                                Description: '',
                                QtyPoint: 0,
                                UnitId: null,
                                AutoCharge: true,
                                //CanEditRate: $scope.SelectedVoucher.Product.RefQtyAs == 2 ? false : true,
                                CanEditRate: ads.CanEdit,
                                ALValue1: 0,
                                ALValue2: 0,
                                ALUnitId1: null,
                                ALUnitId2: null,
                                SchemeAmt: 0,
                                SchemeAmt: 0,
                                QtyDecimal: 2,
                                RateDecimal: 2,
                                AmountDecimal: 2,
                                Narration: ads.Narration,
                                ReadOnlyQty: $scope.SelectedVoucher.Product.RefQtyAs == 2 ? true : false,
                                UDFFeildsColl: udfColl,
                                DrCrLedgerId: ads.DrCrLedgerId,
                                DrCrCostCenterId: ads.DrCrCostCenterId,
                                CanChangeDrCrLedger: ads.CanChangeDrCrLedger,
                            });
                        })
                        //$timeout(function () {
                        //   // angular.forEach(res1.Data.)
                        //});

                        $scope.RecalculateAdditioncalCost();
                        $scope.CalculateTotalAndSubTotal();
                    }


                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });

            });
        }

        $('#frmSalesReturnDetailsModel').modal('hide');
    };
    $scope.RefVoucherChange = function (refVType) {

        $scope.CheckedAll = false;
        $scope.RefAditionalCostColl = [];

        $scope.RefVoucherNoColl = [];
        $scope.RefItemAllocationColl = [];

        var funName = "getPendinSalesInvoice";
        var where = 'TS.BranchId=' + $scope.SelectedVoucher.BDId;
        //if (refVType == 1)
        //    funName = "getPendingDeliveryNote";
        //else if (refVType == 2)
        //    funName = "getPendinSalesOrder";
       

        var agentId = 0;
        if ($scope.beData.AgentId)
            agentId = $scope.beData.AgentId;

        var vDate = null;

        if ($scope.beData.VoucherDateDet) {
            vDate = $filter('date')(new Date($scope.beData.VoucherDateDet.dateAD), 'yyyy-MM-dd');
        } else
            vDate = $filter('date')(new Date(), 'yyyy-MM-dd');

        var where = "";
        if ($scope.SelectedVoucher.RefFieldAs == 2) {

        } else {
            var findRFA = $scope.RefFieldAsColl.firstOrDefault(p1 => p1.id == $scope.SelectedVoucher.RefFieldAs);
            if (findRFA) {
                where = findRFA.value + "='" + $scope.beData.RefNo + "'";
            }
        }

        if ($scope.beData.SalesReturnDetail.PatientId > 0)
            where = where + "ADS.PatientId=" + $scope.beData.SalesReturnDetail.PatientId;
        else
            where = 'TS.BranchId=' + $scope.SelectedVoucher.BDId;

        var para = "ledgerId=" + ($scope.beData.PartyLedgerId == null ? 0 : $scope.beData.PartyLedgerId) + "&agentId=" + agentId + "&voucherDate=" + vDate+"&whereQry="+where;
        $http({
            method: 'GET',
            url: base_url + "Inventory/Transaction/" + funName + "?" + para,
            dataType: "json"
        }).then(function (res1) {
            if (res1.data.IsSuccess && res1.data.Data) {
                $scope.RefItemAllocationColl = res1.data.Data;

                var refTranIdColl = mx($scope.beData.RefTranIdColl);

                angular.forEach($scope.RefItemAllocationColl, function (ri) {
                    if (refTranIdColl.contains(ri.TranId)) {
                        ri.IsSelected = true;
                    } else
                        ri.IsSelected = false;
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

                $('#frmSalesReturnDetailsModel').modal('show');
              
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
    //AditionalCostOnTheBasisOf {
    //    Quantity=0,
    //    Amount=1
    //} 

    $scope.CalculateTotalAndSubTotal = function () {
        if ($scope.SelectedVoucher) {
            var subTotal = 0;
            var totalQty = 0;
            angular.forEach($scope.beData.ItemDetailsColl, function (item) {
                subTotal += item.Amount;
                totalQty += item.ActualQty;
            });

            $scope.beData.SubTotal = ($filter('number')(subTotal, $scope.SelectedVoucher.NoOfDecimalPlaces)).parseDBL();
            $scope.beData.TotalAmount = ($filter('number')(subTotal, $scope.SelectedVoucher.NoOfDecimalPlaces)).parseDBL();

            $scope.beData.CoPayment = 0;
            if ($scope.beData.SalesReturnDetail && $scope.beData.SalesReturnDetail.SSF) {
                var per = isEmptyAmt($scope.beData.SalesReturnDetail.SSF.SchemePer);
                var coAmt = $scope.beData.TotalAmount * (100-per) / 100;
                $scope.beData.CoPayment = ($filter('number')(coAmt, $scope.SelectedVoucher.NoOfDecimalPlaces)).parseDBL();
            }
        }
    };

    $scope.ChangeTranQtyItemRowValue = function (itemDet, col) {

        if (!itemDet.TranUnitId || itemDet.TranUnitId == 0 || !itemDet.productDetail)
            return;

        if (itemDet.productDetail.BaseUnitId == itemDet.TranUnitId) {
            itemDet.ActualQty = itemDet.TranUnitQty;
            $scope.ChangeItemRowValue(itemDet, 'rate');
            return;
        }

        if (itemDet.productDetail.AlternetUnitColl) {
            var alterUnit_Qry = mx(itemDet.productDetail.AlternetUnitColl);

            var alternetUnit1 = null;

            alternetUnit1 = alterUnit_Qry.firstOrDefault(p1 => p1.UnitId == itemDet.TranUnitId);
            var baseQty = 0;
            var findUnit = $scope.UnitColl.firstOrDefault(p1 => p1.UnitId == itemDet.productDetail.BaseUnitId);
            if (alternetUnit1 && findUnit) {
                baseQty = parseFloat(parseFloat(itemDet.TranUnitQty * alternetUnit1.BaseUnitValue).toFixed(findUnit.NoOfDecimalPlaces));
                itemDet.ActualQty = baseQty;
                itemDet.ALValue1 = itemDet.TranUnitQty;
                itemDet.ALUnitId1 = itemDet.TranUnitId;
            }
        }

        $scope.ChangeItemRowValue(itemDet, 'rate');
    }
    $scope.ChangeItemOnSem = function (itemDet, col, fromSch, targetName) {

        if (itemDet.productDetail) {
            var exciseAbleQty = 0;
            var excisAbleAmt = itemDet.ActualQty * itemDet.Rate;

            if (itemDet.productDetail.ExDutyUnitId && itemDet.productDetail.ExDutyUnitId > 0) {
                if (itemDet.UnitId == itemDet.productDetail.ExDutyUnitId)
                    exciseAbleQty = itemDet.ActualQty;
                else if (itemDet.ALUnitId1 && itemDet.ALUnitId1 == itemDet.productDetail.ExDutyUnitId)
                    exciseAbleQty = itemDet.ALValue1;
                else if (itemDet.ALUnitId2 && itemDet.ALUnitId2 == itemDet.productDetail.ExDutyUnitId)
                    exciseAbleQty = itemDet.ALValue1;
            }
            else if (itemDet.productDetail.EXDutyRate > 0)
                exciseAbleQty += itemDet.ActualQty;


            if ($scope.beData.PartyLedger && $scope.beData.PartyLedger.IsImportExportLedger == true) {
                itemDet.ExciseAbleQty = 0;
                itemDet.ExciseAbtAmt = 0;
                itemDet.VatAbleAmt = 0;
                itemDet.TaxableAmt = 0;
                itemDet.VatAmount = 0;
            }
            else {
                itemDet.ExciseAbleQty = exciseAbleQty;
                itemDet.ExciseAbtAmt = (exciseAbleQty > 0 ? excisAbleAmt : 0);
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
                else if ($scope.SelectedVoucher.Product.ProductWiseExciseDuty == true) {

                    if (itemDet.productDetail.ExciseOn == 1) {
                        itemDet.ExDutyRate = itemDet.productDetail.EXDutyRate;
                        itemDet.ExDutyAmount = exciseAbleQty * itemDet.productDetail.EXDutyRate;
                    } else {
                        itemDet.ExDutyRate = itemDet.productDetail.EXDutyRate;
                        itemDet.ExDutyAmount = excisAbleAmt * itemDet.productDetail.EXDutyRate / 100;
                    }
                }
            }
        }

        $scope.RecalculateAdditioncalCost();
        $scope.CalculateTotalAndSubTotal();
    }
    $scope.ChangeItemRowValue = function (itemDet, col) {

        if (itemDet.ProductId == itemDet.LastProductId && col == 'product') {
            $scope.ChangeItemOnSem(itemDet, col, null, null);
            return;
        }

        if (col == 'rate' || col == 'amt' || col == 'RatePer') {
            if (mx(itemDet.Rate).contains('=') == true || mx(itemDet.Amount).contains('=') == true) {
                return;
            }
        }

        if (col == 'RatePer' || (col == 'rate' && $scope.SelectedVoucher.Product.ActiveRateUOM == true)) {

            if ($scope.SelectedVoucher.Product && $scope.SelectedVoucher.Product.VoucherWiseDecimalPlaces == true) {

            } else {
                var findUnit = $scope.UnitColl.firstOrDefault(p1 => p1.UnitId == itemDet.RateUnitId);
                if (findUnit) {
                    itemDet.QtyDecimal = findUnit.NoOfDecimalPlaces;
                    itemDet.RateDecimal = findUnit.RateNoOfDecimalPlaces;
                    itemDet.AmountDecimal = findUnit.AmountNoOfDecimalPlaces;
                }
            }

            var tmpAQty = isEmptyAmt(itemDet.ActualQty), tmpBQty = isEmptyAmt(itemDet.BilledQty);
            var ratePer = isEmptyAmt(itemDet.RatePer);
            if ($scope.HideShow.BilledQty == true)
                tmpBQty = tmpAQty;

            var rateQty = 0;
            var isbaseUOM = false;
            if (itemDet.RateUnitId == itemDet.UnitId) {
                itemDet.Rate = itemDet.RatePer;
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

            if (isbaseUOM == false) {
                var tmpPAmt = (rateQty * ratePer) / tmpBQty;
                var tmpPRate = ($filter('number')(tmpPAmt, itemDet.RateDecimal)).parseDBL();
                itemDet.Rate = tmpPRate;
            }

            col = 'rate';
        }

        if (col == 'rate') {
            if (itemDet.FixedProductColl && itemDet.FixedProductColl.length > 0) {
                for (var ind = 0; ind < itemDet.FixedProductColl.length; ind++) {
                    var fp = $scope.CurItemAllocation.FixedProductColl[ind];
                    fp.Rate = itemDet.Rate;
                    fp.Amount = itemDet.Rate;
                }
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


        var nw = 0, lw = 0, mk = 0, st = 0;
        if ($scope.comDet.Maintain == 2) {

            if (col == 'tolaRate') {
                var tola_rate = isEmptyAmt(itemDet.TolaRate);
                itemDet.PerGramRate = 0

                if (tola_rate > 0) {
                    itemDet.PerGramRate = ($filter('number')((tola_rate / 11.6638), 4)).parseDBL();
                }
            }
            else if (col == 'quality') {
                var per_gram_rate = isEmptyAmt(itemDet.PerGramRate);
                var quality_per = isEmptyAmt(itemDet.Quality);
                itemDet.QualityRate = 0;
                if (quality_per > 0 && per_gram_rate > 0) {
                    if (quality_per > 97) {
                        itemDet.QualityRate = per_gram_rate;
                    } else {
                        var q_rate = per_gram_rate * quality_per / 100;
                        itemDet.QualityRate = ($filter('number')(q_rate, itemDet.AmountDecimal)).parseDBL();
                    }
                }

                itemDet.Rate = itemDet.QualityRate;
            }
            else if (col == 'given') {
                var totalW = isEmptyAmt(itemDet.NetWeight) + isEmptyAmt(itemDet.LossWeight);
                var givenW = isEmptyAmt(itemDet.Given);
                itemDet.Added = totalW - givenW;
            }
            else if (col == 'added') {
                var totalW = isEmptyAmt(itemDet.NetWeight) + isEmptyAmt(itemDet.LossWeight);
                var addedW = isEmptyAmt(itemDet.Added);
                itemDet.Given = totalW - addedW;
            }


            if (itemDet.productDetail) {



                if (col == "netWeight") {
                    if (itemDet.NetWeight && itemDet.NetWeight > 0)
                        itemDet.LossWeight = isEmptyAmt(itemDet.NetWeight) * isEmptyAmt(itemDet.LossRate) / 100;

                    var totalW = isEmptyAmt(itemDet.NetWeight) + isEmptyAmt(itemDet.LossWeight);
                    var givenW = isEmptyAmt(itemDet.Given);
                    itemDet.Added = totalW - givenW;
                }
                else if (col == "lossRate") {
                    if (itemDet.NetWeight && itemDet.NetWeight > 0)
                        itemDet.LossWeight = isEmptyAmt(itemDet.NetWeight) * isEmptyAmt(itemDet.LossRate) / 100;

                    var totalW = isEmptyAmt(itemDet.NetWeight) + isEmptyAmt(itemDet.LossWeight);
                    var givenW = isEmptyAmt(itemDet.Given);
                    itemDet.Added = totalW - givenW;
                }
                else if (col == "fineRate") {
                    if (itemDet.NetWeight && itemDet.NetWeight > 0)
                        itemDet.FineWeight = isEmptyAmt(itemDet.NetWeight) * isEmptyAmt(itemDet.FineRate) / 100;

                    var totalW = isEmptyAmt(itemDet.NetWeight) + isEmptyAmt(itemDet.LossWeight);
                    var givenW = isEmptyAmt(itemDet.Given);
                    itemDet.Added = totalW - givenW;
                }
                else if (col == "processingRate") {
                    if (itemDet.NetWeight && itemDet.NetWeight > 0)
                        itemDet.ProcessingWeight = isEmptyAmt(itemDet.NetWeight) * isEmptyAmt(itemDet.ProcessingRate) / 100;

                    var totalW = isEmptyAmt(itemDet.NetWeight) + isEmptyAmt(itemDet.LossWeight);
                    var givenW = isEmptyAmt(itemDet.Given);
                    itemDet.Added = totalW - givenW;
                }
                else {
                    var totalW = isEmptyAmt(itemDet.NetWeight) + isEmptyAmt(itemDet.LossWeight);
                    var givenW = isEmptyAmt(itemDet.Given);
                    itemDet.Added = totalW - givenW;
                }
            }

            if ($scope.SelectedVoucher.Jewellery.Loss == true)
                itemDet.ActualQty = itemDet.NetWeight + itemDet.LossWeight;
            else
                itemDet.ActualQty = itemDet.FineWeight + itemDet.ProcessingWeight;

            if ($scope.comDet.Maintain == 2 && $scope.SelectedVoucher.Jewellery.ShowAddGiven == true) {
                var addedQty = isEmptyAmt(itemDet.Added);
                if (addedQty == 0) {
                    itemDet.BilledQty = itemDet.ActualQty;
                } else {
                    itemDet.BilledQty = itemDet.Added;
                }

            }
        }

        if (col == 'aQty') {
            itemDet.BilledQty = itemDet.ActualQty;

            if (itemDet.WeightUnitId > 0) {
                itemDet.Weight = isEmptyAmt(itemDet.ActualQty) * isEmptyAmt(itemDet.productDetail.WeightConv);
            }
            if (itemDet.VolumUnitId > 0) {
                itemDet.Volum = isEmptyAmt(itemDet.ActualQty) * isEmptyAmt(itemDet.productDetail.VolumConv);
            }

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

        var discountAbleAmt = 0;
        var qtyWiseDis = false;
        if (itemDet.productDetail) {
            if (itemDet.productDetail.DiscountOn != null) {

                if (itemDet.productDetail.DiscountOn == 1) // On Qty
                {
                    qtyWiseDis = true;
                    discountAbleAmt = qty;
                } else {
                    discountAbleAmt = amt;
                }
            } else {
                if ($scope.SelectedVoucher.Product.DiscountOn == 1) {
                    qtyWiseDis = true;
                    discountAbleAmt = qty;
                }
                else
                    discountAbleAmt = amt;
            }
        }
        else {
            discountAbleAmt = amt;
        }


        if (col == "disAmt") {

            if (disAmt > 0) {
                disPer = (disAmt / discountAbleAmt) * (qtyWiseDis == true ? 1 : 100);
            } else
                disPer = 0;

        }
        else if (col == "disPer" || col == "product") {

            if (disPer > 0) {
                disAmt = discountAbleAmt * disPer / (qtyWiseDis == true ? 1 : 100);
            } else
                disAmt = 0;
        } else if (disPer > 0) {
            disAmt = discountAbleAmt * disPer / (qtyWiseDis == true ? 1 : 100);
        } else if (disAmt > 0) {
            disPer = (disAmt / discountAbleAmt) * (qtyWiseDis == true ? 1 : 100);
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
                if (col == 'aQty' || col == 'bQty' || (col == 'product' && itemDet.ProductId != itemDet.LastProductId)) {
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

            if (itemDet.productDetail.ExDutyUnitId && itemDet.productDetail.ExDutyUnitId > 0) {
                if (itemDet.UnitId == itemDet.productDetail.ExDutyUnitId)
                    exciseAbleQty = itemDet.ActualQty;
                else if (itemDet.ALUnitId1 && itemDet.ALUnitId1 == itemDet.productDetail.ExDutyUnitId)
                    exciseAbleQty = itemDet.ALValue1;
                else if (itemDet.ALUnitId2 && itemDet.ALUnitId2 == itemDet.productDetail.ExDutyUnitId)
                    exciseAbleQty = itemDet.ALValue1;
            }
            else if (itemDet.productDetail.EXDutyRate > 0)
                exciseAbleQty += itemDet.ActualQty;

            if ($scope.beData.PartyLedger && $scope.beData.PartyLedger.IsImportExportLedger == true) {
                itemDet.ExciseAbleQty = 0;
                itemDet.ExciseAbtAmt = 0;
                itemDet.VatAbleAmt = 0;
                itemDet.TaxableAmt = 0;
                itemDet.VatAmount = 0;
            }
            else
            {
                itemDet.ExciseAbleQty = exciseAbleQty;
                itemDet.ExciseAbtAmt = (exciseAbleQty > 0 ? excisAbleAmt : 0);
                itemDet.VatAbleAmt = 0;

                if (itemDet.ProductWiseTaxable == null || itemDet.ProductWiseTaxable == undefined) {
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
                }
                else {
                    if (itemDet.ProductWiseTaxable == true) {
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
                }

                if ($scope.SelectedVoucher.Product.ProductWiseExciseDuty == false) {
                    itemDet.ExDutyRate = 0;
                    itemDet.ExDutyAmount = 0;
                }
                else if ($scope.SelectedVoucher.Product.ProductWiseExciseDuty == true) {

                    if (col != 'exdutyamt') {
                        if (itemDet.productDetail.ExciseOn == 1) {
                            itemDet.ExDutyRate = itemDet.productDetail.EXDutyRate;
                            itemDet.ExDutyAmount = exciseAbleQty * itemDet.productDetail.EXDutyRate;
                        } else {
                            itemDet.ExDutyRate = itemDet.productDetail.EXDutyRate;
                            itemDet.ExDutyAmount = excisAbleAmt * itemDet.productDetail.EXDutyRate / 100;
                        }
                    }
                }
            }
         

        }

       itemDet.Formula = ($scope.ItemFormula ? angular.copy($scope.ItemFormula) : null);
          
        GlobalServices.getItemUDFFormula(itemDet, $scope.beData.ItemDetailsColl, $scope.beData,col);
        GlobalServices.getItemUDFFormulaQry(itemDet, $scope.beData.ItemDetailsColl, $scope.beData, col);

        $scope.RecalculateAdditioncalCost(col);
        $scope.CalculateTotalAndSubTotal();

        itemDet.LastProductId = itemDet.ProductId;
    }

    $scope.ChangeItemAlternetQty = function (itemDet, col) {

        if (col == 'unit1') {
            if ($scope.SelectedVoucher.Product.ActiveRateUOM == true && itemDet.productDetail.AlternetUnitColl) {
                var alColl = mx(itemDet.productDetail.AlternetUnitColl);
                itemDet.RateUOMColl = [];
                itemDet.RateUOMColl.push({
                    UnitId: itemDet.UnitId,
                    Name: itemDet.UnitName
                });
                if (itemDet.ALUnitId1 > 0 && ($scope.HideShow.AlternetUnit1 == false || $scope.HideShow.AlternetUnitMultiple == false)) {
                    if (itemDet.ALUnitId1 != itemDet.UnitId) {
                        var findU = alColl.firstOrDefault(p1 => p1.UnitId == itemDet.ALUnitId1);
                        if (findU) {
                            itemDet.RateUOMColl.push({
                                UnitId: findU.UnitId,
                                Name: findU.UnitName
                            });
                        }
                    }
                }
                if (itemDet.ALUnitId2 > 0 && $scope.HideShow.AlternetUnit2 == false) {
                    if (itemDet.ALUnitId2 != itemDet.UnitId && itemDet.ALUnitId2 != itemDet.ALUnitId1) {
                        var findU = alColl.firstOrDefault(p1 => p1.UnitId == itemDet.ALUnitId2);
                        if (findU) {
                            itemDet.RateUOMColl.push({
                                UnitId: findU.UnitId,
                                Name: findU.UnitName
                            });
                        }
                    }
                }
                if (itemDet.RateUnitId > 0) {

                } else {
                    itemDet.RateUnitId = itemDet.UnitId;
                }
            }
        }
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
    $scope.RecalculateAdditioncalCost = function (col) {
        var newInd = 0;

        var productAmt = 0;
        var schemeAmt = 0;
        var productVatAmt = 0;
        var productVatAbleAmt = 0;
        var productExciduteAmt = 0;
        var productExciduteAbleAmt = 0;
        var productExciduteAbleQty = 0;
        var totalQty1 = 0;
		 var totalWeight1 = 0;
        var totalVolum1 = 0;
        var makingAmt = 0;
        var stoneAmt = 0;
        var tscAmt = 0;
        var tscAccessableVal = 0;

        var isRefVoucher = false;
        angular.forEach($scope.beData.ItemDetailsColl, function (idet) {

            if (idet.RowType == 'P') {
                if (idet.ProductId > 0) {
                    if (idet.productDetail) {
                        if (idet.productDetail.TSCRate > 0) {
                            tscAmt += (idet.Amount * idet.productDetail.TSCRate / 100);
                            tscAccessableVal += idet.Amount;
                        }
                    }

                    totalQty1 += idet.ActualQty;
					 totalWeight1 += isEmptyAmt(idet.Weight);
                totalVolum1 += isEmptyAmt(idet.Volum);
                    productAmt += idet.Amount;

                    schemeAmt += idet.SchameAmt;

                    productVatAmt += (idet.VatAmount ? idet.VatAmount : 0);
                    productVatAbleAmt += (idet.VatAbleAmt ? idet.VatAbleAmt : 0);

                    productExciduteAmt += (idet.ExDutyAmount ? idet.ExDutyAmount : 0);
                    productExciduteAbleAmt += (idet.ExciseAbtAmt ? idet.ExciseAbtAmt : 0);
                    productExciduteAbleQty += (idet.ExciseAbleQty ? idet.ExciseAbleQty : 0);

                    makingAmt += idet.Makeing;
                    stoneAmt += idet.Stone;

                    if (idet.InvoiceItemAllocationId > 0)
                        isRefVoucher = true;
                }
       
            }
            else if (idet.RowType == 'L') {
                var ledAllotionAmt = 0;
                var ledAllotionAmtTaxable = 0;
                for (var i = 0; i < newInd; i++) {
                    var det = $scope.beData.ItemDetailsColl[i];
                    if (det.RowType == 'L' && det.LedgerId>0) {
                        ledAllotionAmt += det.Amount;

                        if (det.IsTaxable == null || det.IsTaxable == undefined) {
                            if ((det.costLedgerDetail && det.costLedgerDetail.IsTaxable == true)) {
                                ledAllotionAmtTaxable += isEmptyAmt(det.Amount);
                            }
                        } else {
                            if (det.IsTaxable == true) {
                                ledAllotionAmtTaxable += isEmptyAmt(det.Amount);
                            }
                        }

                    }
                }

                var totalAmt1 = productAmt + ledAllotionAmt;
                var amt1 = 0;

                if (!idet.costLedgerDetail && idet.LedgerId > 0) {
                    $scope.loadingstatus = 'running';
                    showPleaseWait();
                    $http({
                        method: 'GET',
                        url: base_url + "Global/GetLedgerDetail?LedgerId=" + idet.LedgerId + " & VoucherType=" + $scope.SelectedVoucher.VoucherType + "&ShowClosing=false",
                        dataType: "json"
                    }).then(function (resLD) {

                        $scope.loadingstatus = 'stop';
                        hidePleaseWait();
                        if (resLD.data.IsSuccess && resLD.data.Data) {
                            //  idet.costLedgerDetail = resLD.data.Data

                            var llId = resLD.data.Data.LedgerId;
                            angular.forEach($scope.beData.ItemDetailsColl, function (idLed) {
                                if (idLed.RowType == 'L') {
                                    if (llId == idLed.LedgerId) {
                                        idLed.costLedgerDetail = resLD.data.Data;
                                        $timeout(function () {
                                            $scope.$apply(() => {
                                                idLed.costLedgerDetail = resLD.data.Data;
                                            });
                                        });
                                    }
                                }
                            });

                            $scope.RecalculateAdditioncalCost(col);
                        }
                    }, function (reason) {
                        alert('Failed' + reason);
                    });
                }


                if (idet.costLedgerDetail) {
					
					if (idet.AditionalCostOnTheBasis == null || idet.AditionalCostOnTheBasis == undefined)
                        idet.AditionalCostOnTheBasis = idet.costLedgerDetail.AditionCostOnBasisOf;
					
                    if (idet.costLedgerDetail.LedgerType == 9) // Auto Rounde off
                    {
                        amt1 = Number((Math.round(totalAmt1) - totalAmt1).toFixed(3));
                    }
                    else if (idet.costLedgerDetail.LedgerType == 6)  // Scheme
                    {
                        amt1 = schemeAmt;
                    }
                    else if (idet.costLedgerDetail.LedgerType == 2)  // TSC
                    {
                        amt1 = tscAmt;
                        idet.AccessableValue = tscAccessableVal;
                    }
                    else if (idet.costLedgerDetail.LedgerType == 12)  // making
                    {
                        amt1 = makingAmt;
                    }
                    else if (idet.costLedgerDetail.LedgerType == 20)  // stone
                    {
                        amt1 = stoneAmt;
                    }
                    else if (idet.costLedgerDetail.LedgerType == 3)  // Excise Duty
                    {
                        if ($scope.beData.PartyLedger && $scope.beData.PartyLedger.IsImportExportLedger == true) {
                            amt1 = 0;
                        }
                        else {
                            if (col == 'amt')
                                idet.IsManual = true;

                            if (idet.Formula && idet.Formula.length > 0) {
                                amt1 = idet.Amount;
                            } else {
                                if (idet.IsManual == undefined && idet.Amount > 0 && ($scope.beData.TranId > 0 || isRefVoucher == true)) {
                                    amt1 = idet.Amount;

                                    if (productExciduteAmt == 0)
                                        idet.IsManual = true;
                                    else
                                        idet.IsManual = false;
                                }
                                else {
                                    if (idet.IsManual != true)
                                        amt1 = productExciduteAmt;
                                    else
                                        amt1 = idet.Amount;
                                }
                            }
                        }
                    }
                    else
                        amt1 = idet.Amount;
                }
                else if (idet.LedgerType) {
                    if (idet.LedgerType == 9) // Auto Rounde off
                    {
                        amt1 = Number((Math.round(totalAmt1) - totalAmt1).toFixed(3));
                    }
                    else if (idet.LedgerType == 6)  // Scheme
                    {
                        amt1 = schemeAmt;
                    }
                    else if (idet.LedgerType == 2)  // TSC
                    {
                        amt1 = tscAmt;
                        idet.AccessableValue = tscAccessableVal;
                    }
                    else if (idet.LedgerType == 12)  // making
                    {
                        amt1 = makingAmt;
                    }
                    else if (idet.LedgerType == 20)  // stone
                    {
                        amt1 = stoneAmt;
                    }
                    else if (idet.LedgerType == 3)  // Excise Duty
                    {
                        //if (col == 'amt')
                        //  idet.IsManual = true;

                        if (idet.Formula && idet.Formula.length > 0) {
                            amt1 = idet.Amount;
                        } else {
                            if (idet.IsManual != true)
                                amt1 = productExciduteAmt;
                            else
                                amt1 = idet.Amount;
                        }

                    }
                    else
                        amt1 = idet.Amount;
                }
                else 
                    amt1 = idet.Amount;


                if (idet.Rate != 0) {

                    if (idet.costLedgerDetail) {
                        if (idet.AditionalCostOnTheBasis == 0) {


                            if (idet.costLedgerDetail.LedgerType == 3) {

                                if ($scope.beData.PartyLedger && $scope.beData.PartyLedger.IsImportExportLedger == true) {
                                    amt1 = 0;
                                    idet.AccessableValue = 0;
                                }
                                else {
                                    if ($scope.SelectedVoucher.Product.ProductWiseExciseDuty == true) {
                                        idet.Rate = 0;
                                        amt1 = productExciduteAmt;
                                        idet.AccessableValue = productExciduteAbleAmt;
                                    } else {
                                        amt1 = productExciduteAbleQty * idet.Rate;
                                        idet.AccessableValue = productExciduteAbleAmt;
                                    }
                                }
                            }
                            else {
                                amt1 = totalQty1 * idet.Rate ;
                                idet.AccessableValue = totalQty1;
                            }

                        }
						 else if (idet.AditionalCostOnTheBasis == 2)
                        {
                            amt1 = totalWeight1 * idet.Rate;
                            idet.AccessableValue = totalWeight1;
                        }
                        else if (idet.AditionalCostOnTheBasis == 3) {
                            amt1 = totalVolum1 * idet.Rate;
                            idet.AccessableValue = totalVolum1;
                        }
                        else {
                            if (idet.costLedgerDetail.LedgerType == 3) // Excise Duty
                            {
                                if ($scope.beData.PartyLedger && $scope.beData.PartyLedger.IsImportExportLedger == true) {
                                    amt1 = 0;
                                    idet.AccessableValue = 0;
                                }
                                else {
                                    if ($scope.SelectedVoucher.Product.ProductWiseExciseDuty == true) {
                                        idet.Rate = 0;
                                        amt1 = productExciduteAmt;
                                        idet.AccessableValue = productExciduteAbleAmt;
                                    } else {
                                        amt1 = productExciduteAbleAmt * idet.Rate / 100;
                                        idet.AccessableValue = productExciduteAbleAmt;
                                    }
                                }

                            }
                            else if (idet.costLedgerDetail.LedgerType == 1) // Vat
                            {
                                if ($scope.beData.PartyLedger && $scope.beData.PartyLedger.IsImportExportLedger == true) {
                                    amt1 = 0;
                                    idet.AccessableValue = 0;
                                }
                                else {
                                    if ($scope.SelectedVoucher.Product.ProductWiseVat == true) {
                                        amt1 = productVatAmt + (ledAllotionAmt * idet.Rate / 100);
                                        idet.AccessableValue = productVatAbleAmt + ledAllotionAmt;
                                    }
                                    else {
                                        amt1 = (productVatAbleAmt + ledAllotionAmt) * idet.Rate / 100;
                                        idet.AccessableValue = (productVatAbleAmt + ledAllotionAmt);
                                    }
                                }

                            }
                            else {
                                if (idet.costLedgerDetail.AppropriateTo == 1) {
                                    amt1 = productAmt * idet.Rate / 100;
                                    idet.AccessableValue = productAmt;
                                }
                                else if (idet.costLedgerDetail.AppropriateTo == 2) {
                                    amt1 = ledAllotionAmt * idet.Rate / 100;
                                    idet.AccessableValue = ledAllotionAmt;
                                }
                                else {
                                    amt1 = totalAmt1 * idet.Rate / 100;
                                    idet.AccessableValue = totalAmt1;
                                }
                            }
                        }
                    }
                    else {
                        amt1 = totalAmt1 * idet.Rate / 100;
                        idet.AccessableValue = totalAmt1;
                    }

                }

                //idet.Amount = amt1;
                idet.Amount = ($filter('number')(amt1, $scope.SelectedVoucher.NoOfDecimalPlaces)).parseDBL();

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


    $scope.SaveSalesReturn = function () {

        if ($scope.IsValidData() == true) {

            var reCheck = false;
            do {
                $scope.loadingstatus = "running";
                showPleaseWait();

                $scope.RecalculateAdditioncalCost();
                $scope.CalculateTotalAndSubTotal();

                var isDetPending = false;
                angular.forEach($scope.beData.ItemDetailsColl, function (itemDet) {
                    if (itemDet.RowType == 'P') {
                        if (itemDet.ProductId > 0 && !itemDet.productDetail) {
                            isDetPending = true;
                        }
                    } else if (itemDet.RowType == 'L') {
                        if (itemDet.LedgerId > 0 && !itemDet.costLedgerDetail) {
                            isDetPending = true;
                        }
                    }
                });

                if (isDetPending == false) {
                    $scope.loadingstatus = "stop";
                    hidePleaseWait();
                    reCheck = true;
                    break;
                }

            } while (reCheck == false);

            $scope.RecalculateAdditioncalCost();
            $scope.CalculateTotalAndSubTotal();

            var saveModify = $scope.beData.TranId > 0 ? 'Modify' : 'Save';
            Swal.fire({
                title: 'Do you want to ' + saveModify + ' the current data?',
                showCancelButton: true,
                confirmButtonText: saveModify,
            }).then((result) => {
                /* Read more about isConfirmed, isDenied below */
                if (result.isConfirmed) {

                    if ($scope.SelectedVoucher.ActiveTwoFactor == true) {

                        var para = {
                            EmailId: $scope.beData.SalesReturnDetail.Email,
                            MobileNo: $scope.beData.SalesReturnDetail.DriverContactNo,
                            EntityId: EntityId,
                            OTPFor: 'SalesReturn',
                            RefId: $scope.beData.UniqueId
                        };
                        $http({
                            method: 'POST',
                            url: base_url + "Global/GenerateOTP",
                            dataType: "json",
                            data: JSON.stringify(para)
                        }).then(function (res1) {
                            if (res1.data.IsSuccess == true) {
                                Swal.fire({
                                    title: 'OTP ',
                                    input: 'text',
                                    inputLabel: 'Enter OTP',
                                    inputPlaceholder: 'Type your otp here...',
                                    showCancelButton: true
                                }).then((result1) => {
                                    if (result1.isConfirmed) {
                                        if (result1.value && result1.value.length > 0) {
                                            $scope.beData.OTP = result1.value;
                                            $scope.SaveMethod();
                                        }
                                    }
                                });
                            }
                        }, function (reason) {
                            Swal.fire('Failed' + reason);
                        });

                    }
                    else {
                        $scope.SaveMethod();
                    }



                    
                }
            });



        }


    }

    $scope.SaveMethod = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();

        $timeout(function () {

            var filesColl = $scope.beData.AttechFiles;
            $scope.beData.AttechFiles = [];

            $http({
                method: 'POST',
                url: base_url + "Inventory/Transaction/SaveUpdateSalesReturn",
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

                    $timeout(function () {
                        $scope.ClearData();
                    });
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

    $scope.GetTransactionById = function (tran) {
        if (tran.TranId && tran.TranId > 0) {

             
            var para = {
                tranId: tran.TranId
            };
            //$scope.ClearData();
            $scope.ClearDataForEdit();
            $scope.loadingstatus = "running";
            showPleaseWait();
            $timeout(function () {
                $http({
                    method: 'POST',
                    url: base_url + "Inventory/Transaction/GetSalesReturnById",
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
                        }else
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


        if ($scope.comDet.Maintain == 3) {
            if ($scope.beData.SalesReturnDetail) {
                if (!$scope.beData.SalesReturnDetail.PaymentTermsId || $scope.beData.SalesReturnDetail.PaymentTermsId == 0) {
                    result = false;
                    Swal.fire('Please ! Select Billing Type');
                }
            } 
        }


        var rowAt = 1;
        var lRowAt = 1;
        for (var i = 0; i < $scope.beData.ItemDetailsColl.length; i++) {
            var itemDet = $scope.beData.ItemDetailsColl[i];
            if (itemDet && itemDet.RowType == 'P') {
                if (itemDet.ProductId > 0 && (itemDet.productDetail == null || itemDet.productDetail === undefined)) {
                    result = false;
                    $timeout(function () {
                        $scope.RefreshRowData(itemDet, i);
                    });

                    //Swal.fire("Product Detail was not load at row " + rowAt);

                    //break;
                }

                rowAt++;
            }
            else if (itemDet && itemDet.RowType == 'L') {
                if (itemDet.LedgerId > 0 && (itemDet.costLedgerDetail == null || itemDet.costLedgerDetail === undefined)) {

                    result = false;
                    $timeout(function () {
                        $scope.RefreshRowData(itemDet, i);
                    });

                    //Swal.fire("Ledger Detail was not load at row " + lRowAt);

                    //break;
                }
                lRowAt++;
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
            UniqueId: $scope.beData.UniqueId,
            ForVehicle: $scope.beData.ForVehicle,
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
            PaymentAgentId:$scope.beData.PaymentAgentId,
            PartyCostCenter: $scope.beData.PartyCostCenter ? $scope.beData.PartyCostCenter : 0,
            TranCostCenter: $scope.beData.TranCostCenter ? $scope.beData.TranCostCenter : 0,
            EntryDate: eDate,
            BranchId: ($scope.beData.BranchId ? $scope.beData.BranchId : 0),
            IsAbbInvoice: false,
            ItemAllocationColl: [],
            // AditionalCostColl: $scope.beData.AditionalCostColl,
            AditionalCostColl: [],
            SalesReturnDetail: $scope.beData.SalesReturnDetail,
            GodownId: $scope.beData.GodownId,
            DocumentColl: $scope.beData.DocumentColl,            
            TicketTypeId: $scope.beData.TicketTypeId,
            ServiceTypeId: $scope.beData.ServiceTypeId,
            ClaimId: $scope.beData.ClaimId,
            CoPayment: $scope.beData.CoPayment,
            ProjectId: $scope.beData.ProjectId,
        };

        tmpSales.SalesReturnDetail.PatientId = $scope.CurPatient ? $scope.CurPatient.PatientId : null;


        if (tmpSales.SalesReturnDetail) {
            if (tmpSales.SalesReturnDetail.FreightRate == undefined || tmpSales.SalesReturnDetail.FreightRate == null || tmpSales.SalesReturnDetail.FreightRate === undefined)
                tmpSales.SalesReturnDetail.FreightRate = 0;

            if (tmpSales.SalesReturnDetail.AdvancePayment == undefined || tmpSales.SalesReturnDetail.AdvancePayment == null || tmpSales.SalesReturnDetail.AdvancePayment === undefined)
                tmpSales.SalesReturnDetail.AdvancePayment = 0;

            if (tmpSales.SalesReturnDetail.CreditDays == undefined || tmpSales.SalesReturnDetail.CreditDays == null || tmpSales.SalesReturnDetail.CreditDays === undefined)
                tmpSales.SalesReturnDetail.CreditDays = 0;

            if (tmpSales.SalesReturnDetail.PatientNo == '0')
                tmpSales.SalesReturnDetail.PatientNo = '';
        }

        var ssfPer = 0;
        if ($scope.beData.SalesReturnDetail.SSF) {
            if ($scope.beData.SalesReturnDetail.SSF.SchamePer > 0) {
                ssfPer = $scope.beData.SalesReturnDetail.SSF.SchamePer;
            }
        }

        var voucherUDFFields = [];
        var voucherKeyVal = {};
        angular.forEach($scope.beData.UDFFeildsColl, function (udf) {
            if (udf.NameId && udf.NameId.length > 0) {
                if (udf.FieldType == 2 || udf.FieldType == 22 || udf.FieldType == 23) {
                    var ud = {
                        SNo: (udf.FieldNo ? udf.FieldNo : udf.SNo),
                        Name: udf.Name,
                        Value: udf.UDFValueDet ? $filter('date')(udf.UDFValueDet.dateAD, 'yyyy-MM-dd') : '',
                        AlValue: udf.UDFValueDet ? udf.UDFValueDet.dateBS : '',
                    };
                    voucherUDFFields.push(ud);
                    voucherKeyVal[udf.NameId] = udf.UDFValueDet ? udf.UDFValueDet.dateBS : '';
                } else if (udf.FieldType == 3 && udf.Source && udf.Source.length > 0) {
                    var ud = {
                        SNo: (udf.FieldNo ? udf.FieldNo : udf.SNo),
                        Name: udf.Name,
                        Value: udf.UDFValue,
                        AlValue: udf.UDFValueDet ? udf.UDFValueDet.text : '',
                    };
                    voucherUDFFields.push(ud);
                    voucherKeyVal[udf.NameId] = udf.UDFValueDet ? udf.UDFValueDet.text : ''
                }
                else {
                    var ud = {
                        SNo: (udf.FieldNo ? udf.FieldNo : udf.SNo),
                        Name: udf.Name,
                        Value: udf.UDFValue
                    };
                    voucherUDFFields.push(ud);
                    voucherKeyVal[udf.NameId] = udf.UDFValue;
                }
            }
        });
        if (voucherUDFFields.length > 0) {
            tmpSales.Attributes = JSON.stringify(voucherUDFFields);
            tmpSales.UDFKeyVal = JSON.stringify(voucherKeyVal);
        } else {
            tmpSales.Attributes = "";
            tmpSales.UDFKeyVal = "";
        }

        angular.forEach($scope.beData.ItemDetailsColl, function (itemDet) {
            if (itemDet.ProductId && itemDet.ProductId > 0 && itemDet.RowType == 'P') {

                var udfValues = '';
                var udfFields = [];
                var itemKeyVal = {};
                angular.forEach(itemDet.UDFFeildsColl, function (udf) {
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
                    ActualQty: itemDet.ActualQty + (itemDet.FreeQty ? itemDet.FreeQty : 0),
                    BilledQty: itemDet.BilledQty,
                    //UnitId: (itemDet.TranUnitId > 0 ? itemDet.TranUnitId : itemDet.UnitId),
                    UnitId: itemDet.UnitId,
                    Rate: itemDet.Rate,
                    Amount: itemDet.Amount,
                    DiscountAmt: itemDet.DiscountAmt,
                    DiscountPer: itemDet.DiscountPer,
                    SchameAmt: itemDet.SchameAmt,
                    SchamePer: itemDet.SchamePer,
                    ALUnitId1: itemDet.ALUnitId1 > 0 && itemDet.ALValue1 > 0 ? itemDet.ALUnitId1 : 0,
                    ALUnitId2: itemDet.ALUnitId2 > 0 && itemDet.ALValue2 > 0 ? itemDet.ALUnitId2 : 0,
                    ALUnitId3: itemDet.ALUnitId3 > 0 && itemDet.ALValue3 > 0 ? itemDet.ALUnitId3 : 0,
                    ALValue1: itemDet.ALValue1 > 0 ? itemDet.ALValue1 : 0,
                    ALValue2: itemDet.ALValue2 > 0 ? itemDet.ALValue2 : 0,
                    ALValue3: itemDet.ALValue3 > 0 ? itemDet.ALValue3 : 0,
                    Narration: itemDet.Narration,
                    InvoiceItemAllocationId: itemDet.InvoiceItemAllocationId ? itemDet.InvoiceItemAllocationId : 0,
                    DeliveryNoteItemAllocationId: itemDet.DeliveryNoteItemAllocationId ? itemDet.DeliveryNoteItemAllocationId : 0,
                    OrderItemAllocationId: itemDet.OrderItemAllocationId ? itemDet.OrderItemAllocationId : 0,
                    DispatchSectionItemAllocationId: itemDet.DispatchSectionItemAllocationId ? itemDet.DispatchSectionItemAllocationId : 0,
                    ReceivedNoteItemAllocationId: itemDet.ReceivedNoteItemAllocationId ? itemDet.ReceivedNoteItemAllocationId : 0,
                    QuotationItemAllocationId: itemDet.QuotationItemAllocationId ? itemDet.QuotationItemAllocationId : 0,
                    BundleId: 0,
                    BundleQty: 0,
                    Description: itemDet.Description ? itemDet.Description : '',
                    LedgerId: (itemDet.LedgerId > 0 ? itemDet.LedgerId : (itemDet.ProductLedgerId ? itemDet.ProductLedgerId : tmpSales.TranLedgerId)),
                    ItemDetailsColl: [],
                    GodownId: (itemDet.GodownId > 0 ? itemDet.GodownId : (tmpSales.GodownId > 0 ? tmpSales.GodownId : 0)),
                    VatRate: itemDet.VatRate,
                    VatAmount: itemDet.VatAmount,
                    VatAbleAmt: itemDet.VatAbleAmt,
                    ExDutyRate: itemDet.ExDutyRate,
                    ExDutyAmount: itemDet.ExDutyAmount,
                    //IsTaxable: (itemDet.ProductWiseTaxable == true ? true : (itemDet.productDetail ? (itemDet.productDetail.IsTaxable ? itemDet.productDetail.IsTaxable : itemDet.VatAmount > 0) : itemDet.VatAmount > 0)),
                    IsTaxable: (itemDet.ProductWiseTaxable == null || itemDet.ProductWiseTaxable == undefined ? (itemDet.productDetail ? (itemDet.productDetail.IsTaxable ? itemDet.productDetail.IsTaxable : itemDet.VatAmount > 0) : itemDet.VatAmount > 0) : itemDet.ProductWiseTaxable),
                    ProductWiseTaxable: ($scope.SelectedVoucher.Product.ProductWiseTaxable == false ? null : itemDet.ProductWiseTaxable),
                    MRP: (itemDet.MRP ? itemDet.MRP : 0),
                    PurchaseRate: (itemDet.PurchaseRate ? itemDet.PurchaseRate : 0),
                    TradeRate: (itemDet.TradeRate ? itemDet.TradeRate : 0),
                    SalesRate: (itemDet.SalesRate ? itemDet.SalesRate : 0),
                    RegdNo: itemDet.RegdNo ? itemDet.RegdNo : '',
                    EngineNo: itemDet.EngineNo ? itemDet.EngineNo : '',
                    ChassisNo: itemDet.ChassisNo ? itemDet.ChassisNo : '',
                    Model: itemDet.Model ? itemDet.Model : '',
                    CodeNo: itemDet.CodeNo ? itemDet.CodeNo : '',
                    Color: itemDet.Color ? itemDet.Color : '',
                    KeyNo: itemDet.KeyNo ? itemDet.KeyNo : '',
                    MFGYear: itemDet.MFGYear ? itemDet.MFGYear : 0,
                    Type: itemDet.Type ? itemDet.Type : '',
                    SSFAmount: ($scope.comDet.Maintain == 3 ? itemDet.Amount * ssfPer / 100 : 0),
                    TranUnitId: itemDet.TranUnitId,
                    TranUnitQty: itemDet.TranUnitQty,
                    NotEffectQty: (!itemDet.NotEffectQty || itemDet.NotEffectQty == false ? false : true),
                    IsScrap: (!itemDet.NotEffectQty || itemDet.NotEffectQty == false ? false : true),
                    ProductCompanyId: $scope.beData.ProductCompanyId,
                    RefQty: itemDet.RefQty > 0 ? itemDet.RefQty : 0,
                    RackId: itemDet.RackId,
                    MultipleFixedProduct: $scope.SelectedVoucher.MultipleFixedProduct,
                    WeightUnitId: itemDet.WeightUnitId,
                    Weight: itemDet.Weight,
                    VolumUnitId: itemDet.VolumUnitId,
                    Volum: itemDet.Volum,
                    RatePer: isEmptyAmt(itemDet.RatePer),
                    RateUnitId: itemDet.RateUnitId,
                    SerialDetailColl: itemDet.SerialDetailColl,
                };

                if (itemDet.FixedProductColl && itemDet.FixedProductColl.length > 0 && ($scope.SelectedVoucher.MultipleFixedProduct == true))
                {

                    var rate = itemAllocation.Rate;
                    angular.forEach(itemDet.FixedProductColl, function (fp) {
                        if (fp.EngineNo) {
                            itemAllocation.ItemDetailsColl.push(
                                {
                                    ProductId: itemAllocation.ProductId,
                                    ActualQty: 1,
                                    BilledQty: 1,
                                    UnitId: itemAllocation.UnitId,
                                    Rate: (fp.Amount > 0 ? fp.Amount : rate),
                                    Amount: (fp.Amount > 0 ? fp.Amount : rate),
                                    Batch: itemDet.Batch,
                                    EXPDate: (itemDet.EXPDate && itemDet.EXPDateDet ? $filter('date')(new Date(itemDet.EXPDateDet), 'yyyy-MM-dd') : null),
                                    MFGDate: (itemDet.MFGDate && itemDet.MFGDateDet ? $filter('date')(new Date(itemDet.MFGDateDet), 'yyyy-MM-dd') : null),
                                    GodownId: itemAllocation.GodownId,
                                    DiscountAmt: 0,
                                    DiscountPer: 0,
                                    SchameAmt: 0,
                                    SchamePer: 0,
                                    ALUnitId1: 0,
                                    ALUnitId2: 0,
                                    ALUnitId3: 0,
                                    ALValue1: 0,
                                    ALValue2: 0,
                                    ALValue3: 0,
                                    Narration: itemAllocation.Narration,
                                    VatRate: itemAllocation.VatRate,
                                    VatAmount: itemAllocation.VatAmount,
                                    VatAbleAmt: itemAllocation.VatAbleAmt,
                                    ExDutyRate: itemAllocation.ExDutyRate,
                                    ExDutyAmount: itemAllocation.ExDutyAmount,
                                    BundleId: 0,
                                    BundleQty: 0,
                                    RegdNo: fp.RegdNo,
                                    EngineNo: fp.EngineNo,
                                    ChassisNo: fp.ChassisNo,
                                    Model: fp.Model,
                                    CodeNo: fp.CodeNo,
                                    Color: fp.Color,
                                    KeyNo: fp.KeyNo,
                                    MFGYear: fp.MFGYear,
                                    Type: fp.Type,
                                    Description: itemAllocation.Description,
                                    AbbRate: itemAllocation.AbbRate,
                                    AbbAmount: itemAllocation.AbbAmount,
                                    IsTaxable: itemAllocation.IsTaxable,
                                    RateOf: itemAllocation.RateOf,
                                    NetWeight: itemAllocation.NetWeight,
                                    LossWeight: itemAllocation.LossWeight,
                                    LossRate: itemAllocation.LossRate,

                                    FineWeight: itemAllocation.FineWeight,
                                    FineRate: itemAllocation.FineRate,
                                    ProcessingWeight: itemAllocation.ProcessingWeight,
                                    ProcessingRate: itemAllocation.ProcessingRate,

                                    Makeing: itemAllocation.Makeing,
                                    Stone: itemAllocation.Stone,
                                    MRP: itemAllocation.MRP,
                                    TradeRate: itemAllocation.TradeRate,
                                    PurchaseRate: itemAllocation.PurchaseRate,
                                    SSFAmount: itemAllocation.SSFAmount,
                                    TranUnitId: itemAllocation.TranUnitId,
                                    TranUnitQty: itemAllocation.TranUnitQty,
                                    NotEffectQty: itemAllocation.NotEffectQty,
                                    RefQty: itemAllocation.RefQty,

                                    TolaRate:isEmptyAmt(itemDet.TolaRate),
                                    PerGramRate: isEmptyAmt(itemDet.PerGramRate),
                                    Quality: isEmptyAmt(itemDet.Quality),
                                    QualityRate: isEmptyAmt(itemDet.QualityRate),
                                    Given: isEmptyAmt(itemDet.Given),
                                    Added: isEmptyAmt(itemDet.Added),
                                    WeightUnitId: itemAllocation.WeightUnitId,
                                    Weight: itemAllocation.Weight,
                                    VolumUnitId: itemAllocation.VolumUnitId,
                                    Volum: itemAllocation.Volum,
                                    RatePer: isEmptyAmt(itemAllocation.RatePer),
                                    RateUnitId: itemAllocation.RateUnitId,
                                });
                        }

                    });

                }
                else if (itemDet.productDetail.BatchWiseColl && itemDet.productDetail.BatchWiseColl.length > 0 && itemDet.productDetail.MultipleBatch == true)
                {
                    //var rate = itemAllocation.Rate;
                    var itemAmt = itemAllocation.Amount;
                    var rate = itemAllocation.Amount / itemAllocation.BilledQty;

                    angular.forEach(itemDet.productDetail.BatchWiseColl, function (fp) {

                        if (fp.IsSelected == true && fp.SalesQty > 0) {
                            var sQty = ($filter('number')(fp.SalesQty, itemDet.QtyDecimal)).parseDBL();
                            var amt = ($filter('number')((sQty * rate), itemDet.AmountDecimal)).parseDBL();

                            itemAllocation.ItemDetailsColl.push(
                                {
                                    ProductId: itemAllocation.ProductId,
                                    ActualQty: sQty,
                                    BilledQty: sQty,
                                    UnitId: itemAllocation.UnitId,
                                    Rate: rate,
                                    Amount: amt,
                                    Batch: fp.BatchNo,
                                    EXPDate: (fp.EXPDate ? $filter('date')(new Date(fp.EXPDate), 'yyyy-MM-dd') : null),
                                    MFGDate: (fp.MFGDate ? $filter('date')(new Date(fp.MFGDate), 'yyyy-MM-dd') : null),
                                    GodownId: itemAllocation.GodownId,
                                    DiscountAmt: 0,
                                    DiscountPer: 0,
                                    SchameAmt: 0,
                                    SchamePer: 0,
                                    ALUnitId1: itemAllocation.ALUnitId1,
                                    ALUnitId2: itemAllocation.ALUnitId2,
                                    ALUnitId3: 0,
                                    ALValue1: 0,
                                    ALValue2: 0,
                                    ALValue3: 0,
                                    Narration: itemAllocation.Narration,
                                    VatRate: itemAllocation.VatRate,
                                    VatAmount: itemAllocation.VatAmount,
                                    VatAbleAmt: itemAllocation.VatAbleAmt,
                                    ExDutyRate: itemAllocation.ExDutyRate,
                                    ExDutyAmount: itemAllocation.ExDutyAmount,
                                    BundleId: 0,
                                    BundleQty: 0,
                                    RegdNo: fp.RegdNo,
                                    EngineNo: fp.EngineNo,
                                    ChassisNo: fp.ChassisNo,
                                    Model: fp.Model,
                                    CodeNo: fp.CodeNo,
                                    Color: fp.Color,
                                    KeyNo: fp.KeyNo,
                                    MFGYear: fp.MFGYear,
                                    Type: fp.Type,
                                    Description: itemAllocation.Description,
                                    AbbRate: itemAllocation.AbbRate,
                                    AbbAmount: itemAllocation.AbbAmount,
                                    IsTaxable: itemAllocation.IsTaxable,
                                    RateOf: itemAllocation.RateOf,
                                    NetWeight: itemAllocation.NetWeight,
                                    LossWeight: itemAllocation.LossWeight,
                                    LossRate: itemAllocation.LossRate,
                                    Makeing: itemAllocation.Makeing,
                                    Stone: itemAllocation.Stone,
                                    MRP: itemAllocation.MRP,
                                    TradeRate: itemAllocation.TradeRate,
                                    SalesRate: itemAllocation.SalesRate,
                                    TranUnitId: itemAllocation.TranUnitId,
                                    TranUnitQty: itemAllocation.TranUnitQty,
                                    NotEffectQty: itemAllocation.NotEffectQty,
                                    RefQty: itemAllocation.RefQty,
                                    RackId: itemAllocation.RackId,
                                    WeightUnitId: itemAllocation.WeightUnitId,
                                    Weight: itemAllocation.Weight,
                                    VolumUnitId: itemAllocation.VolumUnitId,
                                    Volum: itemAllocation.Volum,
                                    RatePer: isEmptyAmt(itemAllocation.RatePer),
                                    RateUnitId: itemAllocation.RateUnitId,
                                    
                                });
                        }
                    });

                    var sumAmt = mx(itemAllocation.ItemDetailsColl).sum(p1 => p1.Amount);
                    var diffAmt = itemAmt - sumAmt;
                    if (itemAllocation.ItemDetailsColl.length > 0) {
                        itemAllocation.ItemDetailsColl[0].Amount = itemAllocation.ItemDetailsColl[0].Amount + isEmptyAmt(diffAmt);
                    }
                }
                else {
                    itemAllocation.ItemDetailsColl.push(
                        {
                            ProductId: itemAllocation.ProductId,
                            ActualQty: itemAllocation.ActualQty,
                            BilledQty: itemAllocation.BilledQty,
                            UnitId: itemAllocation.UnitId,
                            Rate: itemAllocation.Rate,
                            Amount: itemAllocation.Amount,
                            Batch: itemDet.Batch,
                            EXPDate: (itemDet.EXPDate && itemDet.EXPDateDet ? $filter('date')(new Date(itemDet.EXPDateDet), 'yyyy-MM-dd') : null),
                            MFGDate: (itemDet.MFGDate && itemDet.MFGDateDet ? $filter('date')(new Date(itemDet.MFGDateDet), 'yyyy-MM-dd') : null),
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
                            Description: itemAllocation.Description,
                            MRP: itemAllocation.MRP,
                            TradeRate: itemAllocation.TradeRate,
                            PurchaseRate: itemAllocation.PurchaseRate,
                            SSFAmount: itemAllocation.SSFAmount,
                            TranUnitId: itemAllocation.TranUnitId,
                            TranUnitQty: itemAllocation.TranUnitQty,
                            NotEffectQty: itemAllocation.NotEffectQty,
                            IsScrap: itemAllocation.IsScrap,
                            ProductCompanyId: itemAllocation.ProductCompanyId,
                            RefQty: itemAllocation.RefQty,

                            TolaRate: itemAllocation.TolaRate,
                            PerGramRate: itemAllocation.PerGramRate,
                            Quality: itemAllocation.Quality,
                            QualityRate: itemAllocation.QualityRate,
                            Given: itemAllocation.Given,
                            Added: itemAllocation.Added,
                            RackId: itemAllocation.RackId,
                            WeightUnitId: itemAllocation.WeightUnitId,
                            Weight: itemAllocation.Weight,
                            VolumUnitId: itemAllocation.VolumUnitId,
                            Volum: itemAllocation.Volum,
                            RatePer: isEmptyAmt(itemAllocation.RatePer),
                            RateUnitId: itemAllocation.RateUnitId,
                        });
                }

             
                tmpSales.ItemAllocationColl.push(itemAllocation);
            }
            else if (itemDet.LedgerId && itemDet.LedgerId > 0 && itemDet.RowType == 'L') {
                tmpSales.AditionalCostColl.push({
                    LedgerId: itemDet.LedgerId,
                    AccessableValue: (itemDet.AccessableValue ? itemDet.AccessableValue : 0),
                    Rate: (itemDet.Rate ? itemDet.Rate : 0),
                    Amount: (itemDet.Amount ? itemDet.Amount : 0),
                    DrCrLedgerId: itemDet.DrCrLedgerId,
                    DrCrCostCenterId: itemDet.DrCrCostCenterId,
					AditionalCostOnTheBasis: itemDet.AditionalCostOnTheBasis,
                });
            }
        });


        return tmpSales;
    };

    $scope.SetData = function (tran) {

        $scope.loadingstatus = 'stop';
        hidePleaseWait();

		var aditionColl = angular.copy($scope.SelectedVoucher.AditionalChargeColl);
        $scope.SelectedVoucher.AditionalChargeColl = [];
        $scope.beData.ItemDetailsColl = [];

        $scope.beData.VoucherDateDet = null;
        $scope.beData.VoucherDate = new Date(tran.VoucherDate);
        $scope.beData.VoucherDate_TMP = new Date(tran.VoucherDate);
        $scope.beData.VoucherDateAD_TMP = new Date(tran.VoucherDate);
        $scope.beData.VoucherDateDet = GlobalServices.getDateDet(tran.VoucherDate);
        setTimeout(1000);
		
		 $timeout(function () {
            if ($scope.SelectedVoucher.DateStyle == 3 || $scope.SelectedVoucher.DateStyle == 4) {
                if ($scope.beData.VoucherDateDet) {
                    $scope.beData.VoucherDateAD_TMP = new Date($scope.beData.VoucherDateDet.dateAD);
                }
                else if ($scope.beData.VoucherDate_TMP) {
                    $scope.beData.VoucherDateAD_TMP = new Date($scope.beData.VoucherDate_TMP);
                }
            }
        });
		

        $scope.lastPartyLedgerId = tran.PartyLedgerId;
         
        if ($scope.GodownColl.length > 0 && (!$scope.beData.GodownId || $scope.beData.GodownId == 0)) {
            $scope.beData.GodownId = $scope.GodownColl[0].GodownId;
        }
        tran.GodownId = $scope.beData.GodownId; 

        $scope.beData.ProjectId = tran.ProjectId;
        $scope.beData.CoPayment = tran.CoPayment;
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
        $scope.beData.PartyLedgerId = tran.PartyLedgerId;
        $scope.beData.SalesLedgerId = (tran.SalesLedgerId ? tran.SalesLedgerId : 0);
        $scope.beData.TotalAmount = tran.TotalAmount;
        $scope.beData.AgentId = tran.AgentId ? tran.AgentId : 0;
        $scope.beData.PartyCostCenter = tran.PartyCostCenter ? tran.PartyCostCenter : 0;
        $scope.beData.TranCostCenter = tran.TranCostCenter ? tran.TranCostCenter : 0;
        $scope.beData.EntryDate = new Date(tran.EntryDate);
        $scope.beData.BranchId = (tran.BranchId ? tran.BranchId : 0);
        $scope.beData.IsAbbInvoice = tran.IsAbbInvoice;
        $scope.beData.ItemAllocationColl = tran.ItemAllocationColl;
        $scope.beData.AditionalCostColl = [];
        $scope.beData.SalesReturnDetail = tran.SalesReturnDetail;
        $scope.beData.DocumentColl = tran.DocumentColl;


        //$scope.beData.GodownId = tran.GodownId
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
                    NameId: udf.Name,
                    Source: udf.Source,
                    Formula: udf.Formula,
					RefTable: udf.RefTable,
                    RefColumn: udf.RefColumn,
                    TextColumn: udf.TextColumn,
                };
                voucherUdfColl.push(ud);
            });
        }
        $scope.beData.UDFFeildsColl = voucherUdfColl;
        if (tran.Attributes && tran.Attributes.length > 0) {
            var udfFieldsColl = mx(JSON.parse(tran.Attributes));
            angular.forEach($scope.beData.UDFFeildsColl, function (udd) {
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
					RefTable: udf.RefTable,
                    RefColumn: udf.RefColumn,
                    TextColumn: udf.TextColumn,
                    Label: udf.Label,
                };
                udfColl.push(ud);
            });
        }



        angular.forEach(tran.ItemAllocationColl, function (itemA) {

            itemA.LastProductId = itemA.ProductId;
            itemA.ActualQty = itemA.ActualQty + isEmptyAmt(itemA.FreeQty);

            if (itemA.MultipleFixedProduct == true) {


                if (itemA.ItemDetailsColl && itemA.ItemDetailsColl.length > 0)
                    itemA.GodownId = itemA.ItemDetailsColl[0].GodownId;

                itemA.ProductLedgerId = itemA.LedgerId;
                itemA.RowType = 'P';
                itemA.UDFFeildsColl = [];
                angular.forEach(udfColl, function (uc) {
                    itemA.UDFFeildsColl.push({
                        SNo: uc.SNo,
                        Name: uc.Name,
                        Value: uc.Value,
                        FieldNo: uc.SNo,
                        DisplayName: uc.DisplayName,
                        FieldType: uc.FieldType,
                        IsMandatory: uc.IsMandatory,
                        Length: 100,
                        SelectOptions: uc.SelectOptions,
                        FieldAfter: uc.FieldAfter,
                        NameId: uc.NameId,
                        Source: uc.Source,
                        Formula: uc.Formula
                    });
                });

                if (itemA.Attributes && itemA.Attributes.length > 0) {

                    var udfFieldsColl = mx(JSON.parse(itemA.Attributes));
                    angular.forEach(itemA.UDFFeildsColl, function (udd) {
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

                            if (findU.IsManual == true)
                                udd.IsManual = true;
                        }
                    });
                }


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

                itemA.TranUnitId = itemA.UnitId;
                itemA.TranUnitQty = itemA.ActualQty;

                itemA.FixedProductColl = [];
                angular.forEach(itemA.ItemDetailsColl, function (itemAD) {
                    itemAD.LastProductId = itemAD.ProductId;
                    itemAD.SerialDetailColl = itemA.SerialDetailColl;
                    //itemAD.ActualQty = itemAD.ActualQty + itemAD.FreeQty;
                    itemAD.ActualQty = itemAD.ActualQty;
                    itemAD.LastProductId = itemAD.ProductId;
                    itemA.FixedProductColl.push({
                        ItemAllocationId: itemA.ItemAllocationId,
                        RegdNo: itemAD.RegdNo ? itemAD.RegdNo : '',
                        EngineNo: itemAD.EngineNo ? itemAD.EngineNo : '',
                        ChassisNo: itemAD.ChassisNo ? itemAD.ChassisNo : '',
                        Model: itemAD.Model ? itemAD.Model : '',
                        CodeNo: itemAD.CodeNo ? itemAD.CodeNo : '',
                        Color: itemAD.Color ? itemAD.Color : '',
                        KeyNo: itemAD.KeyNo ? itemAD.KeyNo : '',
                        MFGYear: itemAD.MFGYear ? itemAD.MFGYear : 0,
                        Type: itemAD.Type ? itemAD.Type : '',
                        Batch: itemAD.Type ? itemAD.Type : '',
                        MFGDate: itemAD.MFGDate ? itemAD.MFGDate : null,
                        EXPDate: itemAD.EXPDate ? itemAD.EXPDate : null,
                        ActualQty: 1,
                        BilledQty: 1,
                        Rate: itemAD.Rate,
                        Amount: itemAD.Amount,
                        DiscountAmt: itemAD.DiscountAmt,
                        DiscountPer: itemAD.DiscountPer
                    });
                });

                $scope.beData.ItemDetailsColl.push(itemA);

            } else {
                angular.forEach(itemA.ItemDetailsColl, function (itemAD) {
                    itemAD.SerialDetailColl = itemA.SerialDetailColl;
                    itemAD.ActualQty = itemAD.ActualQty + isEmptyAmt(itemAD.FreeQty);
                    itemAD.LedgerId = itemA.LedgerId;
                    itemAD.ProductLedgerId = itemA.LedgerId;
                    itemAD.RowType = 'P';
                    itemAD.Description = itemA.Description;
                    itemAD.LastProductId = itemA.ProductId;
                    //itemAD.UDFFeildsColl = udfColl;
                    itemAD.UDFFeildsColl = [];
                    angular.forEach(udfColl, function (uc) {
                        itemAD.UDFFeildsColl.push({
                            SNo: uc.SNo,
                            Name: uc.Name,
                            Value: uc.Value,
                            FieldNo: uc.SNo,
                            DisplayName: uc.DisplayName,
                            FieldType: uc.FieldType,
                            IsMandatory: uc.IsMandatory,
                            Length: 100,
                            SelectOptions: uc.SelectOptions,
                            FieldAfter: uc.FieldAfter,
                            NameId: uc.NameId,
                            Source: uc.Source,
                            Formula: uc.Formula
                        });
                    });

                    if (itemA.Attributes && itemA.Attributes.length > 0) {

                        var udfFieldsColl = mx(JSON.parse(itemA.Attributes));
                        angular.forEach(itemAD.UDFFeildsColl, function (udd) {
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

                                if (findU.IsManual == true)
                                    udd.IsManual = true;
                            }
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
                    itemAD.Narration = itemA.Narration;
                    itemAD.SalesProjectionItemAllocationId = itemA.SalesProjectionItemAllocationId;
                    itemAD.IndentItemAllocationId = itemA.IndentItemAllocationId;
                    itemAD.QuotationItemAllocationId = itemA.QuotationItemAllocationId;
                    itemAD.OrderItemAllocationId = itemA.OrderItemAllocationId;
                    itemAD.ReceivedNoteItemAllocationId = itemA.ReceivedNoteItemAllocationId;
                    itemAD.DeliveryNoteItemAllocationId = itemA.DeliveryNoteItemAllocationId;
                    itemAD.InvoiceItemAllocationId = itemA.InvoiceItemAllocationId;
                    itemAD.ReturnItemAllocationId = itemA.ReturnItemAllocationId;
                    itemAD.DispatchOrderItemAllocationId = itemA.DispatchOrderItemAllocationId;
                    itemAD.DispatchSectionItemAllocationId = itemA.DispatchSectionItemAllocationId;


                    $scope.beData.ItemDetailsColl.push(itemAD);
                });
            }

          
        });
         
        angular.forEach(tran.AditionalCostColl, function (adc) {
			
			var findAC = mx(aditionColl).firstOrDefault(p1 => p1.LedgerId == adc.LedgerId);
            if (findAC) {
                adc.AditionCostOnBasisOf = findAC.AditionCostOnBasisOf;
                adc.CanChangeDrCrCostCenter = findAC.CanChangeDrCrCostCenter;
                adc.CanChangeDrCrLedger = findAC.CanChangeDrCrLedger;
                adc.ForType = findAC.ForType;
                adc.LedgerType = findAC.LedgerType;
                adc.Sign = findAC.Sign;
                adc.TypeOfDutyTax = findAC.TypeOfDutyTax;
				
				 if (adc.AditionalCostOnTheBasis == null || adc.AditionalCostOnTheBasis == undefined)
                    adc.AditionalCostOnTheBasis = findAC.AditionCostOnBasisOf;
            }
			
            adc.RowType = 'L';
            adc.ActualQty = 0;
            adc.BilledQty = 0;
            adc.FreeQty = 0;
            adc.Rate = adc.Rate;
            adc.DiscountPer = 0;
            adc.DiscountAmt = 0;
            adc.SchameAmt = 0;
            adc.SchamePer = 0;
            adc.QtyPoint = 0;
            adc.UnitId = null;
            adc.CanEditRate = true;
            adc.ALValue1 = 0;
            adc.ALValue2 = 0;
            adc.ALUnitId1 = null;
            adc.ALUnitId2 = null;
            adc.SchemeAmt = 0;
            adc.SchemeAmt = 0;
            adc.QtyDecimal = 2;
            adc.RateDecimal = 2;
            adc.AmountDecimal = 2;
			adc.IsManual = (adc.Rate == 0 && adc.Amount != 0 ? true : false);
            $scope.beData.ItemDetailsColl.push(adc);
        });

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
        $scope.ClearItemDetails();
        $scope.beData.SalesInvoiceDetail = {};
        $scope.beData.PartyLedgerId = null;
        $scope.beData.AditionalCostColl = [];

        if ($scope.beData.VoucherId > 0)
            $scope.SelectedVoucher = mx($scope.VoucherTypeColl).firstOrDefault(p1 => p1.VoucherId == $scope.beData.VoucherId);

        if ($scope.beData.CostClassId > 0)
            $scope.SelectedCostClass = mx($scope.CostClassColl).firstOrDefault(p1 => p1.CostClassId == $scope.beData.CostClassId);

        if ($scope.SelectedVoucher) {

            $scope.SalesLedgerColl = [];
            glSrv.getPurchaseLedger($scope.beData.VoucherId).then(function (res1) {
                $scope.SalesLedgerColl = res1.data.Data;
            }, function (reason) {
                Swal.fire('Failed' + reason);
            });

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

                                if ($scope.SelectedVoucher.LedgerId > 0)
                                    $scope.beData.SalesLedgerId = $scope.SelectedVoucher.LedgerId;

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


                                if ($scope.SelectedVoucher.CanChangeLedgerAndAgent == true)
                                    $scope.HideShow.Agent = false;
                                else
                                    $scope.HideShow.Agent = true;

                                if ($scope.SelectedVoucher.ActivePaymentUnder == true)
                                    $scope.HideShow.PaymentUnder = false;
                                else
                                    $scope.HideShow.PaymentUnder = true;

                                 

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

                                if ($scope.SelectedVoucher.Product.IsScrap == true)
                                    $scope.HideShow.IsScrap = false;
                                else
                                    $scope.HideShow.IsScrap = true;

                                if ($scope.SelectedVoucher.Product.ProductWiseTaxable == true)
                                    $scope.HideShow.ProductWiseTaxable = false;
                                else
                                    $scope.HideShow.ProductWiseTaxable = true;

                                if ($scope.SelectedVoucher.ActiveBarCode == true)
                                    $scope.HideShow.ActiveBarCode = false;
                                else
                                    $scope.HideShow.ActiveBarCode = true;

                                $scope.beData.ItemDetailsColl = $scope.beData.ItemDetailsColl.filter(function (el) { return el.AutoCharge != true; });

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
                                                UDFValue: udf.DefaultValue,
												RefTable: udf.RefTable,
                                                RefColumn: udf.RefColumn,
                                                TextColumn: udf.TextColumn,
                                                Label: udf.Label,
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
                                    var itemInd = $scope.beData.ItemDetailsColl.length;
                                    for (var lInd = 0; lInd < $scope.SelectedVoucher.AditionalChargeColl.length; lInd++) {
                                        var ac = $scope.SelectedVoucher.AditionalChargeColl[lInd];
                                        $scope.AddRowInLedgerDetails(itemInd);

                                        var mul = 1;
                                        if (ac.Sign != undefined)
                                            mul = (ac.Sign == true ? 1 : -1);

                                        var ledAllocation = $scope.beData.ItemDetailsColl[itemInd];
                                        ledAllocation.DrCrLedgerId = ac.DrCrLedgerId;
                                        ledAllocation.DrCrCostCenterId = ac.DrCrCostCenterId;
                                        ledAllocation.CanChangeDrCrLedger = ac.CanChangeDrCrLedger;
                                        ledAllocation.Formula = ac.Formula;
                                        ledAllocation.CanEditRate = ac.CanEdit;
                                        ledAllocation.LedgerId = ac.LedgerId;
                                        ledAllocation.Rate = ac.Rate * mul;
                                        ledAllocation.Amount = ac.Amount * mul;
                                        ledAllocation.AutoCharge = true;
										ledAllocation.AditionalCostOnTheBasis = (ledAllocation.AditionalCostOnTheBasis == null || ledAllocation.AditionalCostOnTheBasis == undefined) ? ac.AditionCostOnBasisOf : ledAllocation.AditionalCostOnTheBasis;
                                        $scope.loadingstatus = 'running';
                                        showPleaseWait();
                                        $http({
                                            method: 'GET',
                                            url: base_url + "Global/GetLedgerDetail?LedgerId=" + ledAllocation.LedgerId + " & VoucherType=" + $scope.SelectedVoucher.VoucherType + "&ShowClosing=false",
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

                                    if ($scope.SelectedVoucher.VoucherWiseGodownColl) {
                                        var godownIdColl = [];
                                        $scope.SelectedVoucher.VoucherWiseGodownColl.forEach(function (gd) {
                                            godownIdColl.push(gd.GodownId);
                                        });
                                        godownIdColl = godownIdColl.toString();

                                        GlobalServices.getRackList(null, godownIdColl).then(function (res) {
                                            if (res.data.IsSuccess && res.data.Data) {
                                                $scope.SelectedVoucher.RackList = res.data.Data;
                                            }
                                        }, function (reason) {
                                            Swal.fire('Unable To Get Rack List' + reason);
                                        });

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
                                }
                                else {
                                    $scope.SelectedVoucher.VoucherWiseGodownColl = $scope.GodownColl;
                                    if ($scope.beData.GodownId && $scope.beData.GodownId > 0) {
                                        if (angular.forEach($scope.beData.ItemDetailsColl, function (idet) {
                                            if (idet.RowType == 'P') {
                                                if (!idet.GodownId || idet.GodownId == 0)
                                                    idet.GodownId = $scope.beData.GodownId;
                                            }
                                        }));
                                    }
                                }
								
								
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
    //$("#txtBarcode").keyup(function (event) {
    //    if (event.keyCode === 13) {
    //        // $scope.barcodeScanned($scope.beData.ProductBarCode);
    //    }
    //});
    //$("#txtBarcode").keydown(function (event) {
    //    if (event.keyCode === 13 && event.ctrlKey == true) {
    //        $scope.barcodeScanned($scope.beData.ProductBarCode);
    //    }
    //});
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
                            AddFrom: 'barcode',
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
    $scope.ClearDataForEdit = function () {
        $scope.SetDataOfTran = false;
        $scope.lastPartyLedgerId = null;
        $scope.loadingstatus = "stop";
        $scope.IsRefPartyDet = false;
        $scope.CheckedAll = false;
        $scope.RefAditionalCostColl = [];
    }
    $scope.ClearData = function () {

        $scope.lastPartyLedgerId = null;

        var sV = $scope.SelectedVoucher;
        var sC = $scope.SelectedCostClass;

        $scope.CheckedAll = false;
        $scope.RefAditionalCostColl = [];

        $scope.SelectedVoucher = null;
        $scope.SelectedCostClass = null;
        $scope.RefItemAllocationColl = [];

        $scope.beData =
        {
            UniqueId: GlobalServices.getUniqueId(),
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
            SalesReturnDetail: {},
            RefVoucherType: 1,
            RefTranIdColl: [],
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


        if (sV) {
            $scope.SelectedVoucher = sV;
            $scope.beData.VoucherId = sV.VoucherId;
        }

        if (sC) {
            $scope.SelectedCostClass = sC;
            $scope.beData.CostClassId = sC.CostClassId;
        }

        try {

            if ($scope.EPDet) {
                for (key in $scope.EPDet) {
                    if (key.startsWith("ItemAllocationColl") == true) {
                        var proName = key.replace("ItemAllocationColl.", "");

                        var findEP = $scope.EPDet[key];
                        if (findEP && findEP.Formula && findEP.Formula.length > 0)
                            $scope.ItemFormula[proName] = findEP.Formula;

                        if (findEP) {
                            if (findEP.OnChange && findEP.OnChange.length > 0) {
                                $scope.OnChangeEPItemColl.push(findEP);
                            }
                        }
                    }
                    else if (key.startsWith("SalesReturnDetail") == true) {
                        var proName = key.replace("SalesReturnDetail.", "");

                        var findEP = $scope.EPDet[key];
                        if (findEP && findEP.DefaultValue) {
                            $scope.beData.SalesReturnDetail[proName] = findEP.DefaultValue;
                        }
                    }
                    else if (key.indexOf('.') == -1) {
                        var findEP = $scope.EPDet[key];
                        if (findEP && findEP.DefaultValue) {
                            $scope.beData[key] = findEP.DefaultValue;
                        }
                    }
                }
            }

        } catch { }
         
        $scope.getVoucherNo();

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
    }
    $scope.ClearItemDetails = function () {

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
                    Label: udf.Label,
                };
                udfColl.push(ud);
            });
        }

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
                AmountDecimal: 2,
                UDFFeildsColl: udfColl,
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
                ledAllocation.DrCrLedgerId = ac.DrCrLedgerId;
                ledAllocation.DrCrCostCenterId = ac.DrCrCostCenterId;
                ledAllocation.CanChangeDrCrLedger = ac.CanChangeDrCrLedger;
                ledAllocation.Formula = ac.Formula;
                ledAllocation.CanEditRate = ac.CanEdit;
                ledAllocation.LedgerId = ac.LedgerId;
                ledAllocation.Rate = ac.Rate * mul;
                ledAllocation.Amount = ac.Amount * mul;
                ledAllocation.AutoCharge = true;
				ledAllocation.AditionalCostOnTheBasis = (ledAllocation.AditionalCostOnTheBasis == null || ledAllocation.AditionalCostOnTheBasis == undefined) ? ac.AditionCostOnBasisOf : ledAllocation.AditionalCostOnTheBasis;
                $scope.loadingstatus = 'running';
                showPleaseWait();
                $http({
                    method: 'GET',
                    url: base_url + "Global/GetLedgerDetail?LedgerId=" + ac.LedgerId + " & VoucherType=" + $scope.SelectedVoucher.VoucherType + "&ShowClosing=false",
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
                                                document.getElementById("frmRpt").src = base_url + "web/ReportViewer.aspx?rpttranid=" + rptTranId + "&istransaction=true&entityid=" + EntityId + "&voucherid=" + vId + "&tranid=" + TranId + "&vouchertype=" + VoucherType + '&FileName=' + selectedRpt.PDFFileName;
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
                            document.getElementById("frmRpt").src = base_url + "web/ReportViewer.aspx?rpttranid=" + rptTranId + "&istransaction=true&entityid=" + EntityId + "&voucherid=" + vId + "&tranid=" + TranId + "&vouchertype=" + VoucherType + '&FileName=' + selectedRpt.PDFFileName;
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

    $scope.ShowSSFDetails = function () {
 
        if ($scope.beData.RefNo && $scope.beData.RefNo.length > 0 && $scope.beData.SalesReturnDetail.SSFCode && $scope.beData.SalesReturnDetail.SSFCode.length > 0) {
            if ($scope.beData.SalesReturnDetail.SSF)
                $('#frmSSFDetails').modal('show');
        }
    };
    $scope.SSFCodeLostFocus = function () {
        if ($scope.beData.SalesReturnDetail.SSFCode && $scope.beData.SalesReturnDetail.SSFCode.length > 0) {

        }
        else {
            $scope.beData.SalesReturnDetail.SSF = null;
        }
    }

    $scope.CurPatient = {};
    $scope.GetPatientById = function () {
        $scope.CurPatient = {};
        $scope.beData.SalesReturnDetail.SSF = null;

        if ($scope.comDet.Maintain != 3)
            return;

        var pno = $scope.beData.SalesReturnDetail.PatientNo;
        //$scope.beData.SalesReturnDetail.PatientId = null;
        if (pno && pno.toString().length > 0 && pno!='0') {

            $scope.loadingstatus = 'running';
            showPleaseWait();

            $http({
                method: 'GET',
                url: base_url + "Global/GetPatientDetails?patientId=" + $scope.beData.SalesReturnDetail.PatientNo + '&voucherId=' + $scope.SelectedVoucher.VoucherId,
                dataType: "json"
            }).then(function (res1) {

                $scope.loadingstatus = 'stop';
                hidePleaseWait();

                var patient = res1.data.Data;
                $scope.CurPatient = patient;
                if (patient.IsSuccess == true) {


                    if (!$scope.beData.TicketTypeId) {
                        $scope.beData.TicketTypeId = patient.TicketTypeId;
                        $scope.beData.ServiceTypeId = patient.ServiceTypeId;
                        $scope.beData.ClaimId = patient.ClaimId;
                    }
                    
                    $scope.beData.SalesReturnDetail.Buyes = patient.PatientName;
                    $scope.beData.SalesReturnDetail.Address = patient.Address;
                    $scope.beData.SalesReturnDetail.PhoneNo = patient.MobileNo;
                    $scope.beData.SalesReturnDetail.OtherRefereces = patient.ClaimCode;
                    $scope.beData.SalesReturnDetail.SSFCode = patient.ClaimCode;
                    $scope.beData.SalesReturnDetail.SSF = patient.SSF;
                    $scope.beData.SalesReturnDetail.PatientId = patient.PatientId;

                    if ($scope.beData.SalesReturnDetail.SSF) {
                        $scope.beData.SalesReturnDetail.SSF.SchemePer = patient.SchemePer;
                        $scope.beData.SalesReturnDetail.SSF.SchemeTypeId = patient.SchemeTypeId;
                    }


                    $scope.CalculateTotalAndSubTotal();


                }
                else {

                    $scope.beData.TicketTypeId = null;
                    $scope.beData.ServiceTypeId = null;
                    $scope.beData.ClaimId = null;
                    $scope.beData.SalesReturnDetail.SSF = null;
                    $scope.beData.SalesReturnDetail.Buyes = '';
                    $scope.beData.SalesReturnDetail.Address = '';
                    $scope.beData.SalesReturnDetail.PhoneNo = '';
                    $scope.beData.SalesReturnDetail.OtherRefereces = '';
                    $scope.beData.SalesReturnDetail.SSFCode = '';
                    Swal.fire('Invalid Patient Id');
                }


            }, function (reason) {
                Swal.fire('Failed' + reason);
            });

        }
        else {
            //$scope.beData.SalesReturnDetail.Buyes = '';
            //$scope.beData.SalesReturnDetail.Address = '';
            //$scope.beData.SalesReturnDetail.PhoneNo = '';
            //$scope.beData.SalesReturnDetail.OtherRefereces = '';
        }
    };

    $scope.RemoveAttachment = function (fId, ind) {

        if (fId == 1) {
            $scope.beData.DocumentColl.splice(ind, 1);
        }
        else if (fId == 2) {
            $scope.beData.AttechFiles.splice(ind, 1);
        }

    }

    $scope.delRowInBatch = function (itemDet, ind) {
        if (itemDet.BatchColl) {
            if (itemDet.BatchColl.length > 1) {
                itemDet.BatchColl.splice(ind, 1);
            }
        }
    }

    $scope.AddRowInBatch = function (itemDet, ind) {

        if (!itemDet.BatchColl || itemDet.BatchColl.length == 0)
            itemDet.BatchColl.push({});

        if (itemDet.BatchColl) {
            if (itemDet.BatchColl.length > ind + 1) {
                itemDet.BatchColl.splice(ind + 1, 0, {

                })
            } else {
                itemDet.BatchColl.push({
                })
            }
        }
    }

    $scope.delRowInFixedProduct = function (ind) {

        if ($scope.CurItemAllocation) {
            if ($scope.CurItemAllocation.FixedProductColl) {
                if ($scope.CurItemAllocation.FixedProductColl.length > 1) {
                    $scope.CurItemAllocation.FixedProductColl.splice(ind, 1);
                }
            }
        }

    }

    $scope.addRowInFixedProduct = function (ind) {

        if ($scope.CurItemAllocation) {
            if (!$scope.CurItemAllocation.FixedProductColl || $scope.CurItemAllocation.FixedProductColl.length == 0)
                $scope.CurItemAllocation.FixedProductColl.push({});

            if ($scope.CurItemAllocation.FixedProductColl) {
                if ($scope.CurItemAllocation.FixedProductColl.length > ind + 1) {
                    $scope.CurItemAllocation.FixedProductColl.splice(ind + 1, 0, {

                    })
                } else {
                    $scope.CurItemAllocation.FixedProductColl.push({
                    })
                }
            }
        }

    }
    $scope.ChangeFixedProductAmount = function (curFP, ind) {

        var totalQty = 0;
        var totalAmount = 0;
        var disAmt = 0;
        if ($scope.CurItemAllocation) {

            angular.forEach($scope.CurItemAllocation.FixedProductColl, function (fp) {
                if (fp.EngineNo && fp.EngineNo.length > 0) {
                    totalQty++;

                    if (fp.Amount > 0)
                        totalAmount += fp.Amount;

                    disAmt += isEmptyAmt(fp.DiscountAmt);
                }
            });
        }

        $scope.CurItemAllocation.ActualQty = totalQty;
        $scope.CurItemAllocation.BilledQty = totalQty;
        $scope.CurItemAllocation.Amount = totalAmount;
        $scope.CurItemAllocation.Rate = (totalAmount + disAmt) / totalQty;

        $scope.RecalculateAdditioncalCost();
        $scope.CalculateTotalAndSubTotal();
    };

    $(document).ready(function () {
        $('input.disablecopypaste').bind('paste', function (e) {
            e.preventDefault();
        });
    });
    $scope.PasteData = function (colName, ind) {
        var clipText = event.clipboardData.getData('text/plain');

        if (clipText) {

            if (colName == 'engineno') {
                var startInd = ind;
                clipText.split("\n").forEach(function (line) {
                    if (line && line.length > 0) {

                        if ($scope.CurItemAllocation.FixedProductColl.length < (startInd + 1)) {
                            $scope.addRowInFixedProduct(startInd);
                        }

                        $scope.CurItemAllocation.FixedProductColl[startInd].EngineNo = line;
                        startInd++;
                    }
                });
            }
            else if (colName == 'serialno') {
                var startInd = ind;
                $scope.loadingstatus = 'running';
                showPleaseWait();

                clipText.split("\n").forEach(function (line) {
                    if (line && line.length > 0) {
                        if ($scope.CurItemAllocation.SerialDetailColl.length < (startInd + 1)) {
                            $scope.addRowInSerialNo(startInd);
                        }
                        $scope.CurItemAllocation.SerialDetailColl[startInd].SerialNo = line.trim();

                        startInd++;
                    }
                });

                hidePleaseWait();
                $scope.loadingstatus = "stop";
            }
            else if (colName == 'chassisno') {
                var startInd = ind;
                clipText.split("\n").forEach(function (line) {
                    if (line && line.length > 0) {

                        if ($scope.CurItemAllocation.FixedProductColl.length < (startInd + 1)) {
                            $scope.addRowInFixedProduct(startInd);
                        }

                        $scope.CurItemAllocation.FixedProductColl[startInd].ChassisNo = line;
                        startInd++;
                    }
                });
            }
            else if (colName == 'regdno') {
                var startInd = ind;
                clipText.split("\n").forEach(function (line) {
                    if (line && line.length > 0) {

                        if ($scope.CurItemAllocation.FixedProductColl.length < (startInd + 1)) {
                            $scope.addRowInFixedProduct(startInd);
                        }

                        $scope.CurItemAllocation.FixedProductColl[startInd].RegdNo = line;
                        startInd++;
                    }
                });
            }
            else if (colName == 'model') {
                var startInd = ind;
                clipText.split("\n").forEach(function (line) {
                    if (line && line.length > 0) {

                        if ($scope.CurItemAllocation.FixedProductColl.length < (startInd + 1)) {
                            $scope.addRowInFixedProduct(startInd);
                        }

                        $scope.CurItemAllocation.FixedProductColl[startInd].Model = line;
                        startInd++;
                    }
                });
            }

            else if (colName == 'type') {
                var startInd = ind;
                clipText.split("\n").forEach(function (line) {
                    if (line && line.length > 0) {

                        if ($scope.CurItemAllocation.FixedProductColl.length < (startInd + 1)) {
                            $scope.addRowInFixedProduct(startInd);
                        }

                        $scope.CurItemAllocation.FixedProductColl[startInd].Type = line;
                        startInd++;
                    }
                });
            }

            else if (colName == 'color') {
                var startInd = ind;
                clipText.split("\n").forEach(function (line) {
                    if (line && line.length > 0) {

                        if ($scope.CurItemAllocation.FixedProductColl.length < (startInd + 1)) {
                            $scope.addRowInFixedProduct(startInd);
                        }

                        $scope.CurItemAllocation.FixedProductColl[startInd].Color = line;
                        startInd++;
                    }
                });
            }
            else if (colName == 'keyno') {
                var startInd = ind;
                clipText.split("\n").forEach(function (line) {
                    if (line && line.length > 0) {

                        if ($scope.CurItemAllocation.FixedProductColl.length < (startInd + 1)) {
                            $scope.addRowInFixedProduct(startInd);
                        }

                        $scope.CurItemAllocation.FixedProductColl[startInd].KeyNo = line;
                        startInd++;
                    }
                });
            }
            else if (colName == 'codeno') {
                var startInd = ind;
                clipText.split("\n").forEach(function (line) {
                    if (line && line.length > 0) {

                        if ($scope.CurItemAllocation.FixedProductColl.length < (startInd + 1)) {
                            $scope.addRowInFixedProduct(startInd);
                        }

                        $scope.CurItemAllocation.FixedProductColl[startInd].CodeNo = line;
                        startInd++;
                    }
                });
            }
            else if (colName == 'mfgyear') {
                var startInd = ind;
                clipText.split("\n").forEach(function (line) {
                    if (line && line.length > 0) {

                        if ($scope.CurItemAllocation.FixedProductColl.length < (startInd + 1)) {
                            $scope.addRowInFixedProduct(startInd);
                        }

                        if (isNumeric(line))
                            $scope.CurItemAllocation.FixedProductColl[startInd].MFGYear = parseInt(line);

                        startInd++;
                    }
                });
            }
            else if (colName == 'fpamount') {
                var startInd = ind;
                clipText.split("\n").forEach(function (line) {
                    if (line && line.length > 0) {

                        if ($scope.CurItemAllocation.FixedProductColl.length < (startInd + 1)) {
                            $scope.addRowInFixedProduct(startInd);
                        }

                        if (isNumeric(line))
                            $scope.CurItemAllocation.FixedProductColl[startInd].Amount = parseFloat(line);

                        startInd++;
                    }
                });
            }
            else if (colName == 'keyno') {
                var startInd = ind;
                clipText.split("\n").forEach(function (line) {
                    if (line && line.length > 0) {

                        if ($scope.CurItemAllocation.FixedProductColl.length < (startInd + 1)) {
                            $scope.addRowInFixedProduct(startInd);
                        }

                        $scope.CurItemAllocation.FixedProductColl[startInd].ChassisNo = line;
                        startInd++;
                    }
                });
            }
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

    $scope.GodownChange = function (gid, curRow, ind) {
        if (curRow && ind > 0) {
            if ($scope.beData) {
                if ($scope.beData.ItemDetailsColl) {
                    if ($scope.beData.ItemDetailsColl.length > (ind + 1)) {
                        var itemDet = $scope.beData.ItemDetailsColl[ind + 1];
                        if (itemDet.RowType == 'P' || itemDet.RowType == 'S') {
                            if (itemDet.GodownId > 0) {

                            } else {
                                itemDet.GodownId = curRow.GodownId;
                            }
                        }
                    }
                }
            }
        }
    }

    $scope.GodownSelectionChange = function (curRow) {
        if (!curRow.RackList)
            curRow.RackList = [];

        if ($scope.SelectedVoucher.Product.ActiveRack == true) {

            if (curRow.RackList.length == 0 || curRow.LastGodownId != curRow.GodownId) {
                if (curRow.GodownId > 0) {

                } else {
                    curRow.GodownId = $scope.beData.GodownId;
                }
                if (curRow.GodownId > 0) {
                    if ($scope.SelectedVoucher.VoucherWiseGodownColl.length == 1) {
                        curRow.RackList = $scope.SelectedVoucher.RackList;
                    }
                    else if ($scope.SelectedVoucher.VoucherWiseGodownColl.length > 1) {
                        curRow.RackList = $scope.SelectedVoucher.RackList.filter(function (rack) {
                            return rack.GodownId === curRow.GodownId;
                        });
                    }

                    curRow.LastGodownId = curRow.GodownId;
                }
            }
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

    $scope.ChangeTermsOfPayment = function () {
        if ($scope.beData && $scope.beData.SalesReturnDetail) {
            if ($scope.beData.SalesReturnDetail.TermsOfPayment) {
                var findPM = $scope.PaymentModeColl_Qry.firstOrDefault(p1 => p1.Name == $scope.beData.SalesReturnDetail.TermsOfPayment);
                if (findPM) {
                    $scope.beData.SalesReturnDetail.TypeOfPayment = findPM.TypeOfPayment;
                    $scope.beData.SalesReturnDetail.PaymentTermsId = findPM.PaymentModeId;
                }
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

    $scope.CheckOnBatch = function (curItem, curRow) {
        curItem.SelectedBatchColl = [];
        $scope.SelectedBatchColl = [];
        if (curItem.productDetail) {
            if (curItem.productDetail.BatchWiseColl) {

                var totalQty = 0;
                curItem.productDetail.BatchWiseColl.forEach(function (bw) {
                    if (bw.IsSelected == true) {
                        curItem.SelectedBatchColl.push(bw);

                        var sQty = isEmptyAmt(bw.SalesQty);
                        if (sQty > 0) {
                            totalQty += sQty;
                        }
                        else {
                            var clQty = isEmptyAmt(bw.BalQty);
                            clQty = ($filter('number')(bw.BalQty, curItem.QtyDecimal)).parseDBL();
                            bw.BalQty = clQty;
                            bw.SalesQty = clQty;
                            totalQty += clQty;
                        }
                    }
                });

                curItem.ActualQty = totalQty;
                $scope.ChangeItemRowValue($scope.CurItemAllocation, 'aqty');
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
            $scope.$apply($scope.SaveSalesReturn);
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


    $scope.delRowInSerialNo = function (ind) {

        if ($scope.CurItemAllocation) {
            if ($scope.CurItemAllocation.SerialDetailColl) {
                if ($scope.CurItemAllocation.SerialDetailColl.length > 1) {
                    $scope.CurItemAllocation.SerialDetailColl.splice(ind, 1);
                }
            }
        }

    }
    $scope.addRowInSerialNo = function (ind) {

        if ($scope.CurItemAllocation) {
            if (!$scope.CurItemAllocation.SerialDetailColl || $scope.CurItemAllocation.SerialDetailColl.length == 0)
                $scope.CurItemAllocation.SerialDetailColl.push({});

            if ($scope.CurItemAllocation.SerialDetailColl) {
                if ($scope.CurItemAllocation.SerialDetailColl.length > ind + 1) {
                    $scope.CurItemAllocation.SerialDetailColl.splice(ind + 1, 0, {

                    })
                } else {
                    $scope.CurItemAllocation.SerialDetailColl.push({
                    })
                }
            }
        }
    }
    $scope.newserialscanned = function (barcode) {

        if (!barcode || barcode.length == 0)
            return;

        if ($scope.CurItemAllocation && $scope.CurItemAllocation.SerialDetailColl && $scope.CurItemAllocation.SerialDetailColl.length == 0)
            $scope.CurItemAllocation.SerialDetailColl.push({});

        if ($scope.CurItemAllocation && $scope.CurItemAllocation.SerialDetailColl.length > 0) {
            var startInd = $scope.CurItemAllocation.SerialDetailColl.length - 1;

            $scope.CurItemAllocation.SerialDetailColl[startInd].SerialNo = barcode.trim();
            $scope.addRowInSerialNo(startInd + 1);
            $scope.beData.SerialNo = '';

        }

    };
    $scope.ChangeProductSerialNo = function (curFP, ind) {

        if (!$scope.CurItemAllocation.SerialDetailColl || $scope.CurItemAllocation.SerialDetailColl.length == 0) return;

        var totalQty = 0;
        if ($scope.CurItemAllocation) {
            angular.forEach($scope.CurItemAllocation.SerialDetailColl, function (fp) {
                if (fp.SerialNo && fp.SerialNo.length > 0) {
                    totalQty++;
                }
            });
        }

        $scope.CurItemAllocation.ActualQty = totalQty;
        $scope.CurItemAllocation.BilledQty = totalQty;

        $scope.ChangeItemRowValue($scope.CurItemAllocation, 'rate');

        $timeout(function () {
            $scope.RecalculateAdditioncalCost();
            $scope.CalculateTotalAndSubTotal();
        });

    };

    $scope.ClearSerialNo = function () {

        $scope.CurItemAllocation.SerialDetailColl = [];
        $scope.CurItemAllocation.SerialDetailColl.push({});
        $scope.ChangeItemRowValue($scope.CurItemAllocation, 'rate');

        $timeout(function () {
            $scope.RecalculateAdditioncalCost();
            $scope.CalculateTotalAndSubTotal();
        });

    };

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