
app.controller('PurchaseLandedCostController', function ($scope, $http, $timeout, $filter, $compile, GlobalServices, $document) {
    var glSrv = GlobalServices;
    var TranId = 0;
    LoadData();

    $scope.sideBarData = [];

    $scope.lastTranId = 0;
    function LoadData() {

 $scope.DefaultKeyValues_JSON = null;
        if (DefaultKeyValues && DefaultKeyValues.length > 0) {
            $scope.DefaultKeyValues_JSON = JSON.parse(decodeURIComponent(DefaultKeyValues));           
        }
		
        $scope.ExpensesLedgerColl = [];
        GlobalServices.getExpensesLedger().then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.ExpensesLedgerColl = res.data.Data;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        $scope.perPageColl = GlobalServices.getPerPageList();

        $scope.perPage = {
            ReceiptNote: GlobalServices.getPerPageRow(),
        };
        $scope.currentPages = {
            ReceiptNote: 1
        };
        $scope.searchData = {
            ReceiptNote: ''
        };

        $scope.TaxTypeColl = [{ id: 1, text: 'IMPORT' }, { id: 2, text: 'LOCAL' }, { id: 3, text: 'NONE' }];
         
        $scope.CostAsColl = [{ id: 1, text: 'Common' }, { id: 2, text: 'ProductWise' }, { id: 3, text: 'GroupWise' }, { id: 4, text: 'ModelWise' }];
        $scope.searchFields = {
            Purchase: ''
        };

        $scope.VoucherSearchOptions = [{ text: 'VoucherNo', value: 'TS.AutoVoucherNo', searchType: 'Number' }, { text: 'RefNo', value: 'TS.[RefNo]', searchType: 'text' }, { text: 'VoucherDate', value: 'TS.VoucherDate', searchType: 'date' }, { text: 'Voucher Name', value: 'V.VoucherName', searchType: 'text' }, { text: 'CostClass', value: 'CC.Name', searchType: 'text' }, { text: 'P.P.No.', value: 'LC.PPNo', searchType: 'text' }, { text: 'L.C.No.', value: 'LC.LCNo', searchType: 'text' }, { text: 'Builty No.', value: 'LC.BuilyNo', searchType: 'text' },];
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
        //$scope.VoucherSearchOptions = [{ text: 'VoucherNo', value: 'TS.AutoVoucherNo', searchType: 'Number' }, { text: 'RefNo', value: 'TS.[No]', searchType: 'text' }, { text: 'VoucherDate', value: 'TS.VoucherDate', searchType: 'date' }, { text: 'Voucher Name', value: 'V.VoucherName', searchType: 'text' }, { text: 'CostClass', value: 'CC.Name', searchType: 'text' },];

        $scope.DrCrList = GlobalServices.getDrCr();

        $scope.confirmMSG = {
            Accept: false,
            Decline: false,
            Delete: false,
            Modify: false,
            Print: false,
            Reset: false
        };
        $scope.mandetoryFields = {};
        $scope.VoucherTypeColl = [];
        $scope.CostClassColl = [];
        $scope.NarrationList = [];
        $scope.SelectedVoucher = null;
        $scope.SelectedCostClass = null;
        $scope.Config = {};
        $scope.GodownColl = [];

        $scope.InOutColl = [{ id: 1, text: 'IN' }, { id: 2, text: 'OUT' }];

        $scope.AditionalCostTypeList = [];
        $http({
            method: 'POST',
            url: base_url + "Account/Creation/GetAditionalCostTypes",
            dataType: "json"
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.AditionalCostTypeList = res.data.Data;
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
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        $scope.VatTypeColl = [];
        $http({
            method: 'GET',
            url: base_url + "Global/GetVatTypes",
            dataType: "json"
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.VatTypeColl = res.data.Data;
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
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

        $scope.ChequeTypeColl = [];
        $http({
            method: 'GET',
            url: base_url + "Global/GetChequeTypes",
            dataType: "json"
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.ChequeTypeColl = res.data.Data;
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        $scope.HideShow = {
            VoucherType: false,
            CostClass: false,
            AutoVoucherNo: false,
            Agent: true,
            Currency: true,
            RefNo: true,
            ProfitCenter1: true,
            ProfitCenter2: true,
            ProfitCenter3: true,
            ProfitCenter4: true,
            ProfitCenter5: true,
        }

        $scope.beData =
        {
            VoucherId: null,
            CostClassId: null,
            TranId: 0,
            AutoManualNo: '',
            AutoVoucherNo: 0,
            CurRate: 1,
            AttechFiles: [],
            SubTotal: 0,
            Total: 0,
            Narration: '',
            VoucherDate: new Date(),
            VoucherDate_TMP: new Date(),
            LedgerAllocationColl: [],
            LCDetail: {},
            Attributes: '',
            UDFFeildsColl: [],
            Mode: 'Save'
        };

        $scope.beData.LedgerAllocationColl.push(
            {
                DrCr: 1,
                LedgerId: 0,
                AgentId: 0,
                LFNO: '',
                Narration: '',
                DrAmount: 0,
                CrAmount: 0,
                ForBranchId: null,
                Dimension1: null,
                Dimension2: null,
                Dimension3: null,
                Dimension4: null,
                Dimension5: null,
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
                url: base_url + "Setup/Security/GetAccountConfig",
                dataType: "json"
            }).then(function (res1) {
                if (res1.data.IsSuccess && res1.data.Data) {
                    $scope.Config = res1.data.Data;

                    $timeout(function () {
                        $scope.$apply(function () {

                            //if ($scope.Config.AllowSchamePer == true)
                            //    $scope.HideShow.SchemePer = false;
                            //else
                            //    $scope.HideShow.SchemePer = true;


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

        $scope.TableIdColl = [{ id: 'main-table', text: 'Common Cost', visible: false }, { id: 'item-table', text: 'Item Wise Cost', visible: false }, { id: 'others-table', text: 'Other Cost', visible: false }];
        //$scope.TableIdColl.forEach(function (tbl)
        //{
        //    const table = document.getElementById(tbl.id);
        //    table.addEventListener("contextmenu", (e) => {
        //        e.preventDefault();
        //        tbl.visible = true;
        //    });
        //});
        
    }

    $scope.CopyTableData = function (id) {
        GlobalServices.copyTableData(id);
    }

    $scope.GetLabel = function (ep) {
        if ($scope.EPDet && $scope.EPDet[ep])
            return $scope.EPDet[ep].Label;
        else
            return "***Label***";
    }

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

        $scope.LandedCostColl = [];
        $scope.AllLandedCostColl = [];
        $scope.ProductLandedCostColl = [];

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
					
                    var paraLC = {
                        VoucherId: $scope.SelectedVoucher.VoucherId
                    };
                    $http({
                        method: 'POST',
                        url: base_url + "Inventory/Transaction/GetLandedCostForTran",
                        dataType: "json",
                        data: JSON.stringify(paraLC)
                    }).then(function (resLC) {

                        if (resLC.data.IsSuccess && resLC.data.Data) {
                            $scope.AllLandedCostColl = resLC.data.Data;
                            resLC.data.Data.forEach(function (lc1)
                            {
                                var lc = angular.copy(lc1);

                                if (lc.CreditLedgerId > 0)
                                    lc.BrokerLedgerId = lc.CreditLedgerId;

                                if (lc.LandedCostFor == 1 || lc.LandedCostFor == 2) {
                                    $scope.LandedCostColl.push(lc);
                                }

                                if (lc.LandedCostFor == 1 || lc.LandedCostFor == 3) {
                                    $scope.ProductLandedCostColl.push(lc);
                                }
                            });

                            $scope.SetDefaultValue();
                        }
                    }, function (reason) {
                        alert('Failed' + reason);
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
                                            UDFValue: udf.DefaultValue,
                                            RefTable: udf.RefTable,
                                            RefColumn: udf.RefColumn,
                                            TextColumn: udf.TextColumn,
                                        };
                                        $scope.beData.UDFFeildsColl.push(ud);
                                    });
                                }

                                if ($scope.SelectedVoucher.VoucherProductUDFColl && $scope.SelectedVoucher.VoucherProductUDFColl.length > 0) {
                                    angular.forEach($scope.beData.LedgerAllocationColl, function (det) {
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
                                            };

                                            det.UDFFeildsColl.push(ud);
                                        });
                                    });
                                }

                                if ($scope.SelectedVoucher.NumberingMethod == 1)
                                    $scope.HideShow.AutoVoucherNo = false;
                                else
                                    $scope.HideShow.AutoVoucherNo = true;

                                if ($scope.SelectedVoucher.UseRefNo == true)
                                    $scope.HideShow.RefNo = false;
                                else
                                    $scope.HideShow.RefNo = true;

                                if ($scope.SelectedVoucher.ProfitCenter1 == true)
                                    $scope.HideShow.ProfitCenter1 = false;
                                else
                                    $scope.HideShow.ProfitCenter1 = true;

                                if ($scope.SelectedVoucher.ProfitCenter2 == true)
                                    $scope.HideShow.ProfitCenter2 = false;
                                else
                                    $scope.HideShow.ProfitCenter2 = true;

                                if ($scope.SelectedVoucher.ProfitCenter3 == true)
                                    $scope.HideShow.ProfitCenter3 = false;
                                else
                                    $scope.HideShow.ProfitCenter3 = true;

                                if ($scope.SelectedVoucher.ProfitCenter4 == true)
                                    $scope.HideShow.ProfitCenter4 = false;
                                else
                                    $scope.HideShow.ProfitCenter4 = true;

                                if ($scope.SelectedVoucher.ProfitCenter5 == true)
                                    $scope.HideShow.ProfitCenter5 = false;
                                else
                                    $scope.HideShow.ProfitCenter5 = true;


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


                        $timeout(function () {
                            GlobalServices.getCurrentDateTime().then(function (res) {
                                var curDate = res.data.Data;
                                if (curDate) {
                                    $scope.beData.VoucherDate_TMP = new Date(curDate);

                                    if ($scope.SelectedVoucher) {
                                        if ($scope.SelectedVoucher.VoucherDateAs == 2) {
                                            GlobalServices.getLastEntryDate($scope.SelectedVoucher.VoucherId).then(function (res) {
                                                var curDate = res.data.Data;
                                                if (curDate) {
                                                    $scope.beData.VoucherDate_TMP = new Date(curDate);
                                                }
                                            }, function (errormessage) {
                                                alert('Unable to Delete data. pls try again.' + errormessage.responseText);
                                            });
                                        }
                                    }

                                }
                            }, function (errormessage) {
                                alert('Unable to Delete data. pls try again.' + errormessage.responseText);
                            });
                        });

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

    $scope.GetPurchaseList = function (ismodify) {
        $scope.PurchaseColl = [];

        if (!$scope.SelectedVoucher || !$scope.SelectedCostClass)
            return;

        $scope.loadingstatus = 'running';
        showPleaseWait();
        var para = {
            voucherDate: $filter('date')(new Date($scope.beData.VoucherDateDet.dateAD), 'yyyy-MM-dd'),
            VoucherId: $scope.SelectedVoucher.VoucherId,
            CostClassId: $scope.SelectedCostClass.CostClassId,
            JournalTranId:ismodify==true ? $scope.beData.TranId: 0,
        };
        $http({
            method: 'POST',
            url: base_url + "Inventory/Transaction/GetPurchaseListForAditionalInvoice",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            $scope.loadingstatus = 'stop';
            hidePleaseWait();

            if (res.data.IsSuccess && res.data.Data) {
                $scope.PurchaseColl = res.data.Data;

                var query = mx(res.data.Data);
                angular.forEach($scope.RefTranIdColl, function (rt) {
                    var findTran = query.firstOrDefault(p1 => p1.TranId == rt);
                    if (findTran) {
                        findTran.IsSelected = true;
                    }
                });

                if (ismodify == true)
                    $scope.clickOnPurchaseAccept(true);
                else
                    $('#PurchaseList').modal('show');

            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    };

    $scope.clickOnPurchaseAccept = function (ismodify) {

        ismodify == (ismodify == undefined ? ($scope.beData.TranId > 0 ? true : false) :false);

        var tmpSelectedVoucherColl = [];
        $scope.RefTranIdColl = [];
        var tranIdColl = [];
        $scope.AllProductColl = [];
        $scope.CostProductColl = [];
        $scope.CostProductGroupColl = [];
        $scope.CostModuleColl = [];
        $scope.RefVoucherNoColl = [];
        $scope.ProductWiseCostColl = [];
        $scope.ProductWiseCreditLedgerColl = [];

        angular.forEach($scope.PurchaseColl, function (pc) {
            if (pc.IsSelected == true) {
                $scope.RefTranIdColl.push(pc.TranId);
                tmpSelectedVoucherColl.push(pc);
                tranIdColl.push(pc.TranId);
                $scope.RefVoucherNoColl.push(pc.VoucherNo);

                if (!$scope.beData.LCDetail.PPNo || $scope.beData.LCDetail.PPNo.length == 0) {
                    $scope.beData.LCDetail.LCNo = pc.LCNo;
                    $scope.beData.LCDetail.PPNo = pc.PPNo;

                    if (pc.PPDate) {
                        $scope.beData.LCDetail.PPDate_TMP = new Date(pc.PPDate);
                    }
                }
                    
            }
        });

        $scope.beData.PurchaseJournalColl = tmpSelectedVoucherColl;
        $scope.beData.RefNo = $scope.RefVoucherNoColl.toString();

        if ($scope.beData.LCDetail) {
            $scope.beData.LCDetail.BillDateNo = tmpSelectedVoucherColl[0].RefNo;
            $scope.beData.LCDetail.GateInWardDate_TMP = new Date(tmpSelectedVoucherColl[0].VoucherDate);
        }
        

        if (tranIdColl.length > 0) {
            var para = {
                tranIdColl: tranIdColl.toString()
            };
            $http({
                method: 'POST',
                url: base_url + "Inventory/Transaction/GetProductProductGroupForJV",
                dataType: "json",
                data: JSON.stringify(para)
            }).then(function (res) {
                $timeout(function () {
                    if (res.data.IsSuccess && res.data.Data) {
                        var tran = res.data.Data;
                        $scope.AllProductColl = tran.DataColl;
                        //var productIdTextColl = [];
                        //tran.DataColl.forEach(function (dc) {
                        //    productIdTextColl.push({
                        //        id: dc.ProductId,
                        //        text:dc.ProductName
                        //    });
                        //});
                        //$scope.CostProductColl = productIdTextColl;
                        $scope.CostProductColl = tran.ProductColl;
                        $scope.CostProductGroupColl = tran.ProductGroupColl;
                        $scope.CostModuleColl = tran.ModelColl;

                        $scope.ProductWiseCreditLedgerColl = angular.copy($scope.ProductLandedCostColl);
 

                        var qry = null;
                        var taxBaseQry = null;
                        if ((ismodify == true || $scope.beData.TranId > 0) && $scope.beData.ModifyLanedCostColl) {
                            qry = mx($scope.beData.ModifyLanedCostColl).where(p1 => p1.SourceFrom == 2);

                            taxBaseQry = mx($scope.beData.LandedCostProductColl);

                            $scope.ProductWiseCreditLedgerColl.forEach(function (pcr) {
                                if (qry != null) {
                                    var findCR = qry.firstOrDefault(p1 => p1.CostCenterId == pcr.CostCenterId);
                                    if (findCR) {
                                        pcr.CreditLedgerId = findCR.BrokerLedgerId;
                                        pcr.BrokerLedgerId = findCR.BrokerLedgerId;
                                    }
                                }                                                                    
                            });
                        }
                        $scope.AllProductColl.forEach(function (item) {

                            var findColl = (qry ? qry.where(p1 => p1.CostAsId == item.ProductId && (p1.ProductSNo == item.SNO || p1.ProductSNo == null)) : null);

                            var findTax = (taxBaseQry ? taxBaseQry.firstOrDefault(p1 => p1.ProductId == item.ProductId && (p1.ProductSNo == item.SNO || p1.ProductSNo == null)) : null);

                            var newRow = {
                                ProductId: item.ProductId,
                                ProductName: item.ProductName,
                                Code: item.Code,
                                HSCode: item.HSCode,
                                Qty: item.Qty,
                                Amount: item.Amount,
                                Unit: item.Unit,
                                Weight: item.Weight,
                                Volume: item.Volume,
                                LandedCostColl: [],
                                TaxBaseAmt: findTax ? findTax.TaxBaseAmt : 0,
                                IsTaxable: item.IsTaxable,
                                VatRate: item.VatRate,
                                ProductSNo:item.SNO,
                            };
                            $scope.ProductLandedCostColl.forEach(function (lc) {

                                var findLC = (findColl ? findColl.where(p1 => p1.CostCenterId == lc.CostCenterId) : null);
                                var findLC_FST = (findLC ? findLC.firstOrDefault() : null);

                                newRow.LandedCostColl.push({
                                    CostAs: 2,
                                    CostAsId: item.ProductId,
                                    ProductSNo:item.SNO,
                                    DrCr: 1,
                                    CostCenterId: lc.CostCenterId,
                                    CostCategoriesId: lc.CostCategoriesId,
                                    LedgerId: (lc.LedgerId > 0 ? lc.LedgerId : item.PurchaseLedgerId),
                                    CostCenterName: lc.CostCenterName,
                                    CostCenterCode: lc.CostCenterCode,
                                    LedgerName: lc.LedgerName,
                                    LedgerCode: lc.LedgerCode,
                                    AditionalCostOnTheBasis: lc.AditionalCostOnTheBasis,
                                    DefaultValue: lc.DefaultValue,
                                    CreditLedgerId: lc.CreditLedgerId,
                                    BrokerLedgerId: lc.CreditLedgerId,
                                    DrAmount: findLC ? findLC.sum(p1=>p1.DrAmount) : isEmptyAmt(lc.DefaultValue),
                                    CrAmount: 0,
                                    Formula: lc.Formula,
                                    SNo: lc.SNO,
                                    OrderNo: lc.SNO,
                                    TaxType: 1,
                                    IsTaxable: lc.IsTaxable,
                                    LedgerType: lc.LedgerType,
                                });
                              
                            });

                            $scope.ProductWiseCostColl.push(newRow);
                            $scope.CalculateFormula(newRow, -1);
                            $scope.ChangeProductWiseCost(null, null);
                            
                        });
                         
                        $('#PurchaseList').modal('hide');
                    } else
                        Swal.fire(res.data.ResponseMSG);
                });
            }, function (reason) {
                Swal.fire('Failed' + reason);
            });
        }

    };

    $scope.ChangeProductWiseCost = function (curProduct, curCost) {

        $scope.CalculateFormula(curProduct, -1);

        if (curProduct) {
            //curProduct.TotalAmount = curProduct.Amount;
            curProduct.TotalAmount = 0;
            curProduct.LandedCostColl.forEach(function (lc) {
                curProduct.TotalAmount += isEmptyAmt(lc.DrAmount);
            });
        } else {
            $scope.ProductWiseCostColl.forEach(function (curP) {

                //curP.TotalAmount = curP.Amount;
                curP.TotalAmount = 0;
                curP.LandedCostColl.forEach(function (lc) {
                    curP.TotalAmount += isEmptyAmt(lc.DrAmount);
                });

            });
        }
        
        
        $scope.ProductWiseCreditLedgerColl.forEach(function (pc)
        {
            pc.TotalAmount = 0;
            $scope.ProductWiseCostColl.forEach(function (item) {
                for (var c = 0; c < item.LandedCostColl.length; c++) {
                    var findCost = item.LandedCostColl[c];
                    if (findCost.CostCenterId == pc.CostCenterId) {
                        pc.TotalAmount += isEmptyAmt(findCost.DrAmount);
                        break;
                    }
                }
            });
            
        });

        $scope.CalculateFormula(curProduct, -1);

        $scope.ChangeDrCrAmount();
    }
    $scope.CalculateFormula = function (curRow,colName) {

        if (curRow) {

            var t_aq = 0, t_amt = 0, t_weight = 0, t_volum = 0;
            angular.forEach($scope.AllProductColl, function (dc) {
                if (dc.RowType == 'P') {
                    t_aq += isEmptyNum(dc.Qty);
                    t_amt += isEmptyNum(dc.Amount);                    
                    t_weight += isEmptyNum(dc.Weight);
                    t_volum += isEmptyNum(dc.Volume);
                }
            });

            if (curRow.LandedCostColl && curRow.LandedCostColl.length > 0) {
                angular.forEach(curRow.LandedCostColl, function (udf) {
                    if (udf.Formula && udf.Formula.length > 0 && colName != udf.OrderNo) {
                        var formula = udf.Formula;

                        formula = formula.replaceAll('t_aq', isEmptyNum(t_aq));
                        formula = formula.replaceAll('t_amt', isEmptyNum(t_amt));
                        formula = formula.replaceAll('t_weight', isEmptyNum(t_weight));
                        formula = formula.replaceAll('t_volum', isEmptyNum(t_volum));
                        
                        formula = formula.replaceAll('aq', isEmptyNum(curRow.Qty));
                        formula = formula.replaceAll('amt', isEmptyNum(curRow.Amount));
                        formula = formula.replaceAll('weight', isEmptyNum(curRow.Weight));
                        formula = formula.replaceAll('volum', isEmptyNum(curRow.Volume));                         

                        angular.forEach(curRow.LandedCostColl, function (udf1) {
                            var uname = 'lc' + udf1.OrderNo + '#';
                            formula = formula.replaceAll(uname, isEmptyNum(udf1.DrAmount));
                        });

                        try {
                            if (udf.IsManual == true) {

                            } else {
                                var nVal = math.evaluate(formula);
                                udf.DrAmount = isEmptyNum(nVal);
                            }
                        } catch { }

                    }
                    else if (udf.OrderNo == colName)
                    {
                        udf.IsManual = true;
                    }
                });
            }
        }
    };

    //$scope.LoadProductGroup = function (tranIdColl) {
    //    if (tranIdColl.length > 0) {
    //        var para = {
    //            tranIdColl: tranIdColl.toString()
    //        };
    //        $http({
    //            method: 'POST',
    //            url: base_url + "Inventory/Transaction/GetProductProductGroupForJV",
    //            dataType: "json",
    //            data: JSON.stringify(para)
    //        }).then(function (res) {
    //            $timeout(function () {
    //                if (res.data.IsSuccess && res.data.Data) {
    //                    var tran = res.data.Data;
    //                    $scope.CostProductColl = tran.ProductColl;
    //                    $scope.CostProductGroupColl = tran.ProductGroupColl;
    //                    $scope.CostModuleColl = tran.ModelColl;
    //                } else
    //                    Swal.fire(res.data.ResponseMSG);
    //            });
    //        }, function (reason) {
    //            Swal.fire('Failed' + reason);
    //        });
    //    }
    //}

    $scope.AddRowInLedgerAllocation = function (ind, boolAuto) {

        if (boolAuto == true) {
            var len = $scope.beData.LedgerAllocationColl.length;
            if ((ind + 1) != len)
                return;

            var selectItem = $scope.beData.LedgerAllocationColl[ind];
            if (!selectItem.LedgerId || selectItem.LedgerId == null || selectItem.LedgerId == 0 || (selectItem.DrAmount == 0 && selectItem.CrAmount == 0))
                return;

        }

        var allocationQuery = mx($scope.beData.LedgerAllocationColl);
        var drAmt = allocationQuery.sum(p1 => p1.DrAmount);
        var crAmt = allocationQuery.sum(p1 => p1.CrAmount);
        var clAmt = drAmt - crAmt;

        if ($scope.beData.LedgerAllocationColl) {
            if ($scope.beData.LedgerAllocationColl.length > ind + 1) {

                var selectItem = $scope.beData.LedgerAllocationColl[ind + 1];
                if (!selectItem.LedgerId || selectItem.LedgerId == null || selectItem.LedgerId == 0 || (selectItem.DrAmount == 0 && selectItem.CrAmount == 0))
                    return;

                $scope.beData.LedgerAllocationColl.splice(ind + 1, 0, {
                    DrCr: (clAmt > 0 ? 2 : 1),
                    LedgerId: 0,
                    AgentId: 0,
                    LFNO: '',
                    Narration: '',
                    DrAmount: (clAmt > 0 ? 0 : Math.abs(clAmt)),
                    CrAmount: (clAmt > 0 ? clAmt : 0),
                    ForBranchId: null,
                    Dimension1: null,
                    Dimension2: null,
                    Dimension3: null,
                    Dimension4: null,
                    Dimension5: null,
                })
            }
            else if ($scope.beData.LedgerAllocationColl.length == (ind + 1)) {
                var selectItem = $scope.beData.LedgerAllocationColl[ind];
                if (!selectItem.LedgerId || selectItem.LedgerId == null || selectItem.LedgerId == 0 || (selectItem.DrAmount == 0 && selectItem.CrAmount == 0))
                    return;

                $scope.beData.LedgerAllocationColl.push({
                    DrCr: (clAmt > 0 ? 2 : 1),
                    LedgerId: 0,
                    AgentId: 0,
                    LFNO: '',
                    Narration: '',
                    DrAmount: (clAmt > 0 ? 0 : Math.abs(clAmt)),
                    CrAmount: (clAmt > 0 ? clAmt : 0),
                    ForBranchId: null,
                    Dimension1: null,
                    Dimension2: null,
                    Dimension3: null,
                    Dimension4: null,
                    Dimension5: null,
                });
            }
            else {
                $scope.beData.LedgerAllocationColl.push({
                    DrCr: (clAmt > 0 ? 2 : 1),
                    LedgerId: 0,
                    AgentId: 0,
                    LFNO: '',
                    Narration: '',
                    DrAmount: (clAmt > 0 ? 0 : Math.abs(clAmt)),
                    CrAmount: (clAmt > 0 ? clAmt : 0),
                    ForBranchId: null,
                    Dimension1: null,
                    Dimension2: null,
                    Dimension3: null,
                    Dimension4: null,
                    Dimension5: null,
                });
            }
        }
        $scope.ChangeDrCrAmount();

    }
    $scope.delRowLedgerAllocation = function (ind) {
        if ($scope.beData.LedgerAllocationColl) {
            if ($scope.beData.LedgerAllocationColl.length > 1) {
                $scope.beData.LedgerAllocationColl.splice(ind, 1);
                $scope.ChangeDrCrAmount();
            }
        }
    }


    $scope.CurLedgerAllocation = {};
    $scope.ChangeParticularLedger = function (ledDet,ind) {
        $scope.sideBarData = ledDet.partySideBarData;
        $timeout(function () {
            $scope.CurLedgerAllocation = ledDet;
            if (ledDet) {
                ledDet.CurrentBal = 0;
                if (ledDet.LedgerId && ledDet.LedgerId > 0 && ledDet.LedgerDetails) {
                    ledDet.CurrentBal = ledDet.LedgerDetails.Closing;

                    var taxable = 0;
                    if (ledDet.LedgerDetails.LedgerType == 1)
                    {
                        if ($scope.beData.TranId > 0) { }
                        else {
                            if (ledDet.DrCr == 1) {
                                for (var laStart = 0; laStart < ind; laStart++) {
                                    var findLA = $scope.beData.LedgerAllocationColl[laStart];
                                    if (findLA && findLA.LedgerDetails) {
                                        if (findLA.LedgerDetails.IsTaxable == true && findLA.LedgerDetails.LedgerType != 1) {
                                            taxable += isEmptyAmt(findLA.DrAmount);
                                        }
                                    }
                                }
                                var rate = isEmptyAmt(ledDet.LedgerDetails.Rate);
                                if (rate != 0) {
                                    ledDet.DrAmount = taxable * rate / 100;
                                }
                                ledDet.AccessableValue = taxable;
                            }
                        }                       
                    }
                 

                    $timeout(function () {
                        if (ledDet.LedgerDetails.CostCentersAreApplied == true) {
                            if (!ledDet.CostCenterColl)
                                ledDet.CostCenterColl = [];

                            if (ledDet.CostCenterColl.length == 0) {
                                ledDet.CostCenterColl.push({
                                    CostCenterId: null,
                                    DrCr: 1,
                                    Amount: 0
                                });
                            }
                            $('#frmCostCentersModel').modal('show');
                        } else
                            ledDet.CostCenterColl = [];
                    });

                    $timeout(function () {
                        if (ledDet.LedgerDetails && ledDet.LedgerDetails.InventoryValuesAreAffected == true) {
                            if (!ledDet.ItemDetailsCOll)
                                ledDet.ItemDetailsCOll = [];

                            if (ledDet.ItemDetailsCOll.length == 0) {
                                ledDet.InOut = 1;
                                ledDet.ItemDetailsCOll.push({
                                    ProductId: null,
                                    Qty: 0,
                                });
                            }
                            $('#itemdetail').modal('show');
                        } else
                            ledDet.ItemDetailsCOll = [];
                    });


                    $timeout(function () {
                        if (ledDet.LedgerDetails && (ledDet.LedgerDetails.IsTDS == true || ledDet.LedgerDetails.IsVat == true)) {
                            if (!ledDet.TDSVatDetailColl)
                                ledDet.TDSVatDetailColl = [];

                            if (ledDet.TDSVatDetailColl.length == 0) {

                              
                                

                                ledDet.TDSVatDetailColl.push({
                                    SNO: 0,
                                    BillNo: '',
                                    AccessableValue:taxable,
                                    Amount: ledDet.DrAmount,
                                    Rate: ledDet.LedgerDetails.Rate,
                                    Payment: 0
                                });
                            }
                            $('#tds').modal('show');
                        } else
                            ledDet.ItemDetailsCOll = [];
                    });

                    $timeout(function () {
                        if (ledDet.LedgerDetails && ledDet.LedgerDetails.ActiveChequeDetails == true) {
                            if (!ledDet.CheckDetails) {
                                ledDet.CheckDetails = {
                                    ChequeNo: '',
                                    AccountNo: '',
                                    Remarks: '',
                                    CheckType: 0,
                                    ChequeDate_TMP: new Date()
                                };
                            }


                            $('#chequedetail').modal('show');
                        } else
                            ledDet.ItemDetailsCOll = [];
                    });
                }
            }
        });

    }
    $scope.ChangeParticularCostCenter = function (costAllocation) {
        $timeout(function () {
            costAllocation.CurrentBal = 0;

            if (costAllocation.CostCenterId && costAllocation.CostCenterId > 0 && costAllocation.CostCenterDetails) {
                costAllocation.CurrentBal = costAllocation.CostCenterDetails.Closing;
            }
        });
    };
    $scope.AddRowInCostCenterAllocation = function (ind, boolAuto) {

        if (boolAuto == true) {
            var len = $scope.CurLedgerAllocation.CostCenterColl.length;
            if ((ind + 1) != len)
                return;

            var selectItem = $scope.CurLedgerAllocation.CostCenterColl[ind];
            if (!selectItem.CostCenterId || selectItem.CostCenterId == null || selectItem.CostCenterId == 0 || selectItem.Amount == 0)
                return;

        }

        if ($scope.CurLedgerAllocation.CostCenterColl) {
            if ($scope.CurLedgerAllocation.CostCenterColl.length > ind + 1) {
                $scope.CurLedgerAllocation.CostCenterColl.splice(ind + 1, 0, {
                    CostCenterId: 0,
                    AgentId: 0,
                    LFNO: '',
                    Narration: '',
                    Amount: 0
                })
            } else {
                $scope.CurLedgerAllocation.CostCenterColl.push({
                    CostCenterId: 0,
                    AgentId: 0,
                    LFNO: '',
                    Narration: '',
                    Amount: 0
                })
            }
        }

    }

    $scope.delRowCostCenterAllocation = function (ind) {
        if ($scope.CurLedgerAllocation.CostCenterColl) {
            if ($scope.CurLedgerAllocation.CostCenterColl.length > 1) {
                $scope.CurLedgerAllocation.CostCenterColl.splice(ind, 1);
                $scope.ChangeCostCenterAmount();
                $scope.ChangeDrCrAmount();
            }
        }
    }
    $scope.ChangeCostCenterAmount = function () {
        $timeout(function () {
            if ($scope.CurLedgerAllocation.DrCr == 2)
                $scope.CurLedgerAllocation.CrAmount = mx($scope.CurLedgerAllocation.CostCenterColl).sum(p1 => p1.Amount);
            else if ($scope.CurLedgerAllocation.DrCr == 1)
                $scope.CurLedgerAllocation.DrAmount = mx($scope.CurLedgerAllocation.CostCenterColl).sum(p1 => p1.Amount);
        });
    };
    $scope.ResetCostCenter = function () {

        if ($scope.CurLedgerAllocation) {
            $scope.CurLedgerAllocation.CostCenterColl = [];

            $scope.CurLedgerAllocation.CostCenterColl.push({
                CostCenterId: null,
                DrCr: 1,
                Amount: 0
            });
        }               
    }
    $scope.OkCostCenterModal = function () {
        $timeout(function () {
            if ($scope.CurLedgerAllocation.DrCr == 2)
                $scope.CurLedgerAllocation.CrAmount = mx($scope.CurLedgerAllocation.CostCenterColl).sum(p1 => p1.Amount);
            else if ($scope.CurLedgerAllocation.DrCr == 1)
                $scope.CurLedgerAllocation.DrAmount = mx($scope.CurLedgerAllocation.CostCenterColl).sum(p1 => p1.Amount);

            $('#frmCostCentersModel').modal('hide');
        });
    };


    $scope.CalculateTDS = function (tds, col) {
        if (col == 'access' || col == 'rate') {
            if (tds.Rate > 0 && tds.AccessableValue > 0) {
                tds.Amount = tds.AccessableValue * tds.Rate / 100;
            }
        }

        var totalAmt = mx($scope.CurLedgerAllocation.TDSVatDetailColl).sum(p1 => isEmptyAmt(p1.Amount) +isEmptyAmt(p1.Payment));
        if ($scope.CurLedgerAllocation.DrCr == 1)
            $scope.CurLedgerAllocation.DrAmount = totalAmt;
        else
            $scope.CurLedgerAllocation.CrAmount = totalAmt;
    }
    $scope.AddRowInTDSDetails = function (ind) {


        if ($scope.CurLedgerAllocation.TDSVatDetailColl) {
            if ($scope.CurLedgerAllocation.TDSVatDetailColl.length > ind + 1) {
                $scope.CurLedgerAllocation.TDSVatDetailColl.splice(ind + 1, 0, {
                    SNO: 0,
                    Amount: 0,
                    Rate: 0,
                    Payment: 0
                })
            } else {
                $scope.CurLedgerAllocation.TDSVatDetailColl.push({
                    SNO: 0,
                    Amount: 0,
                    Rate: 0,
                    Payment: 0
                })
            }
        }

    }

    $scope.delRowFromTDSDetails = function (ind) {
        if ($scope.CurLedgerAllocation.TDSVatDetailColl) {
            if ($scope.CurLedgerAllocation.TDSVatDetailColl.length > 1) {
                $scope.CurLedgerAllocation.TDSVatDetailColl.splice(ind, 1);
            }
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
    };

    $scope.ChangeDrCr = function (ledAll) {
        if (ledAll.DrCr == 1) {
            ledAll.DrAmount = ledAll.CrAmount;
            ledAll.CrAmount = 0;
        } else if (ledAll.DrCr == 2) {
            ledAll.CrAmount = ledAll.DrAmount;
            ledAll.DrAmount = 0;
        }

        $scope.ChangeDrCrAmount();
    };



    $scope.SaveJournal = function () {

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
                        url: base_url + "Account/Transaction/SaveUpdatePurchaseAditional",
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

                            if ($scope.SelectedVoucher.PrintVoucherAfterSaving == true)
                                $scope.Print();

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

    $scope.GetTransactionById = function (tran) {
        $scope.ClearData();

        $timeout(function () {
            if (tran.TranId && tran.TranId > 0) {

                var para = {
                    tranId: tran.TranId
                };
                $http({
                    method: 'POST',
                    url: base_url + "Account/Transaction/GetJournalById",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    $timeout(function () {
                        if (res.data.IsSuccess && res.data.Data) {
                            var tran = res.data.Data;
                            $scope.SetData(tran);

                            var tidColl = '';
                            angular.forEach(tran.PurchaseJournalColl, function (pj) {
                                if (tidColl.length > 0)
                                    tidColl = tidColl + ',';

                                tidColl = tidColl + pj.PurchaseTranId;
                            });

                            $scope.GetPurchaseList(true);
                            //$scope.LoadProductGroup(tidColl);
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
        }, 100);

       
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

        //if ($scope.beData.CashBankLedgerId) {
        //    if ($scope.beData.CashBankLedgerId == null || $scope.beData.CashBankLedgerId == 0) {
        //        result = false;
        //        Swal.fire('Please ! Select Valid Cash/Bank Name');
        //    }
        //} else {
        //    result = false;
        //    Swal.fire('Please ! Select Valid Cash/Bank Name');
        //}

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

        var tmpJournal = {
            TranId: $scope.beData.TranId,
            VoucherId: $scope.beData.VoucherId,
            CostClassId: $scope.beData.CostClassId,
            AutoVoucherNo: $scope.beData.AutoVoucherNo,
            CurRate: $scope.beData.CurRate,
            CurrencyId: $scope.beData.CurrencyId,
            ManualVoucherNO: $scope.beData.ManualVoucherNO,
            Narration: $scope.beData.Narration,
            VoucherDate: vDate,
            EntryDate: eDate,
            RefNo: $scope.beData.RefNo,
            AutoManualNo: $scope.beData.AutoManualNo,
            EntryDate: vDate,
            BranchId: ($scope.beData.BranchId ? $scope.beData.BranchId : 0),
            LedgerAllocationColl: [],
            PurchaseJournalColl: [],
            LandedCostColl: [],
            LCDetail: {},
            Attributes: '',
            LandedCostProductColl:[],
        };

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
            tmpJournal.Attributes = JSON.stringify(voucherUDFFields);
            tmpJournal.UDFKeyVal = JSON.stringify(voucherKeyVal);
        } else {
            tmpJournal.Attributes = "";
            tmpJournal.UDFKeyVal = "";
        }

        if ($scope.beData.PurchaseJournalColl) {
            angular.forEach($scope.beData.PurchaseJournalColl, function (pj) {
                tmpJournal.PurchaseJournalColl.push({
                    PurchaseTranId: pj.TranId
                });
            });
        }

        tmpJournal.LCDetail = $scope.beData.LCDetail;

        if ($scope.beData.LCDetail) {

            if ($scope.beData.LCDetail.GateInWardDateDet && $scope.beData.LCDetail.GateInWardDateDet.dateAD) {
                var dt = $scope.beData.LCDetail.GateInWardDateDet;
                $scope.beData.LCDetail.GateInWardDate = $filter('date')(new Date(dt.dateAD), 'yyyy-MM-dd');
                $scope.beData.LCDetail.GateInWardDateBS = dt.NY + '-' + dt.NM + '-' + dt.ND;
            }


            if ($scope.beData.LCDetail.BillDateDet && $scope.beData.LCDetail.BillDateDet.dateAD) {
                var dt = $scope.beData.LCDetail.BillDateDet;
                $scope.beData.LCDetail.BillDate = $filter('date')(new Date(dt.dateAD), 'yyyy-MM-dd');
                $scope.beData.LCDetail.BillDateBS = dt.NY + '-' + dt.NM + '-' + dt.ND;
            }


            if ($scope.beData.LCDetail.PPDateDet && $scope.beData.LCDetail.PPDateDet.dateAD) {
                var dt = $scope.beData.LCDetail.PPDateDet;
                $scope.beData.LCDetail.PPDate = $filter('date')(new Date(dt.dateAD), 'yyyy-MM-dd');
                $scope.beData.LCDetail.PPDateBS = dt.NY + '-' + dt.NM + '-' + dt.ND;
            }


            if ($scope.beData.LCDetail.LCDateDet && $scope.beData.LCDetail.LCDateDet.dateAD) {
                var dt = $scope.beData.LCDetail.LCDateDet;
                $scope.beData.LCDetail.LCDate = $filter('date')(new Date(dt.dateAD), 'yyyy-MM-dd');
                $scope.beData.LCDetail.LCDateBS = dt.NY + '-' + dt.NM + '-' + dt.ND;
            }


            if ($scope.beData.LCDetail.BuiltyDateDet && $scope.beData.LCDetail.BuiltyDateDet.dateAD) {
                var dt = $scope.beData.LCDetail.BuiltyDateDet;
                $scope.beData.LCDetail.BuiltyDate = $filter('date')(new Date(dt.dateAD), 'yyyy-MM-dd');
                $scope.beData.LCDetail.BuiltyDateBS = dt.NY + '-' + dt.NM + '-' + dt.ND;
            }

        }

        tmpJournal.LandedCostColl = angular.copy($scope.LandedCostColl);

        if (tmpJournal.LandedCostColl) {

            var taxableAmt = 0;
            tmpJournal.LandedCostColl.forEach(function (lc) {
                lc.SourceFrom = 1;
                if (lc.TaxType == 1)
                    lc.TaxBaseAmt = isEmptyAmt(lc.DrAmount);

                if (lc.IsTaxable == true && lc.LedgerType != 1) {
                    taxableAmt += isEmptyAmt(lc.DrAmount);
                }

                if (lc.LedgerType == 1) {
                    lc.AccessableValue = taxableAmt;
                }
                    
            });
        }

        var qry = mx($scope.ProductWiseCreditLedgerColl);

        if ($scope.ProductWiseCostColl) {
            $scope.ProductWiseCostColl.forEach(function (pw)
            {
                tmpJournal.LandedCostProductColl.push({
                    ProductId: pw.ProductId,
                    Qty: pw.Qty,
                    Amount: pw.Amount,
                    Weight: pw.Weight,
                    Volume: pw.Volume,
                    TaxBaseAmt: pw.TaxBaseAmt,
                    ProductSNo:pw.ProductSNo,
                });

                if (pw.LandedCostColl) {

                    var taxableAmt =(pw.IsTaxable==true ? pw.Amount : 0);
                    pw.LandedCostColl.forEach(function (lc) {
                        var find = qry.firstOrDefault(p1 => p1.CostCenterId == lc.CostCenterId);
                        lc.BrokerLedgerId = find.BrokerLedgerId;
                        lc.SourceFrom = 2;

                        if (lc.LedgerType==1)
                            lc.TaxType = 3;
                        else if(lc.IsTaxable==true)
                            lc.TaxType = 1;
                        else
                            lc.TaxType = 3;

                        if (lc.IsTaxable == true && lc.LedgerType != 1) {
                            taxableAmt += isEmptyAmt(lc.DrAmount);
                        }

                        if (lc.LedgerType == 1) {
                            lc.AccessableValue = taxableAmt;
                        }
                         
                        tmpJournal.LandedCostColl.push(lc);
                    });
                }
            });
        }


        angular.forEach($scope.beData.LedgerAllocationColl, function (ledA) {
            if (ledA.LedgerId && ledA.LedgerId > 0) {

                ledA.SourceFrom = 3;

                var udfValues = '';
                var udfFields = [];
                var itemKeyVal = {};
                angular.forEach(ledA.UDFFeildsColl, function (udf) {

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

                var crLedAllocation = {
                    UDFKeyVal: itemKeyVal,
                    Attributes: udfValues,
                    DrCr: ledA.DrCr,
                    LedgerId: ledA.LedgerId,
                    AgentId: ledA.AgentId,
                    LFNO: ledA.LFNO,
                    Narration: ledA.Narration,
                    DrAmount: ledA.DrAmount,
                    CrAmount: ledA.CrAmount,
                    ForBranchId: null,
                    Dimension1: ledA.Dimension1,
                    Dimension2: ledA.Dimension2,
                    Dimension3: ledA.Dimension3,
                    Dimension4: ledA.Dimension4,
                    Dimension5: ledA.Dimension5,
                    CostCenterColl: [],
                    ItemDetailsCOll: [],
                    TDSVatDetailColl: [],
                    CheckDetails: {},
                    TaxType: ledA.DrCr == 1 ? 2 : null,
                    SourceFrom:3,
                };

                if (ledA.CheckDetails && ledA.CheckDetails.ChequeDateDet) {
                    crLedAllocation.CheckDetails.ChequeNo = ledA.CheckDetails.ChequeNo;
                    crLedAllocation.CheckDetails.AccountNo = ledA.CheckDetails.AccountNo;
                    crLedAllocation.CheckDetails.Remarks = ledA.CheckDetails.Remarks;
                    crLedAllocation.CheckDetails.CheckType = ledA.CheckDetails.CheckType;
                    crLedAllocation.CheckDetails.ChequeDate = $filter('date')(new Date(ledA.CheckDetails.ChequeDateDet.dateAD), 'yyyy-MM-dd');
                }

                if (ledA.CostCenterColl) {
                    angular.forEach(ledA.CostCenterColl, function (cc) {
                        if (cc.CostCenterId && cc.CostCenterId > 0 && cc.Amount != 0) {
                            var ccAllocation = {
                                CostCategoriesId: (cc.CostCenterDetails ? cc.CostCenterDetails.CostCategoryId : cc.CostCategoriesId),
                                CostCenterId: cc.CostCenterId,
                                DrAmount: (crLedAllocation.DrCr == 1 ? cc.Amount : 0),
                                CrAmount: (crLedAllocation.DrCr == 2 ? cc.Amount : 0),
                                Narration: '',
                                DrCr: crLedAllocation.DrCr,
                                CostAs: cc.CostAs,
                                CostAsId: cc.CostAsId,
                                CostAsName: cc.CostAsName,
                                SourceFrom: crLedAllocation.SourceFrom,
                                TaxType:crLedAllocation.TaxType,
                            };
                            crLedAllocation.CostCenterColl.push(ccAllocation);
                        }
                    });
                }
              
                if (ledA.TDSVatDetailColl) {
                    angular.forEach(ledA.TDSVatDetailColl, function (cc) {
                        if ( (cc.BillDateDet || cc.BillDate) && (cc.Amount != 0 || cc.Payment != 0)) {
                            var tdsVat = {
                                BillNo: cc.BillNo,
                                BillDate: (cc.BillDateDet ? $filter('date')(new Date(cc.BillDateDet.dateAD), 'yyyy-MM-dd') : $filter('date')(new Date(cc.BillDate), 'yyyy-MM-dd')),
                                PartyLedgerId: cc.PartyLedgerId,
                                PartyName: cc.PartyName,
                                OtherHeading: cc.OtherHeading,
                                PANVat: cc.PANVat,
                                Payment: cc.Payment,
                                AccessableValue: cc.AccessableValue,
                                Rate: cc.Rate,
                                Amount: cc.Amount,
                                TdsVatType: cc.TdsVatType
                            };
                            crLedAllocation.TDSVatDetailColl.push(tdsVat);
                        }
                    });
                }

                tmpJournal.LedgerAllocationColl.push(crLedAllocation);
            }
        });

        return tmpJournal;
    };

    $scope.SetData = function (tran) {

        $scope.loadingstatus = 'stop';
        hidePleaseWait();

        $scope.RefTranIdColl = []; 
        angular.forEach(tran.PurchaseJournalColl, function (pj) {
            pj.TranId = pj.PurchaseTranId;
            $scope.RefTranIdColl.push(pj.PurchaseTranId);
        });
        $scope.beData.PurchaseJournalColl = tran.PurchaseJournalColl;

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
        $scope.beData.RefNo = tran.RefNo;
        $scope.beData.AutoManualNo = tran.AutoManualNo;
        $scope.beData.EntryDate = new Date(tran.VoucherDate);
        $scope.beData.BranchId = tran.BranchId;
        $scope.beData.LedgerAllocationColl = [];
        $scope.beData.LandedCostProductColl = tran.LandedCostProductColl;
        $scope.beData.LCDetail = tran.LCDetail;

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
                };
                udfColl.push(ud);
            });
        }

        $scope.beData.ModifyLanedCostColl = tran.LandedCostColl;
        var lcQry = mx(tran.LandedCostColl);

        angular.forEach($scope.LandedCostColl, function (lc) {
            var findLC = lcQry.firstOrDefault(p1 => p1.CostCenterId == lc.CostCenterId && p1.SourceFrom==1);
            if (findLC) {
                lc.DrAmount = findLC.DrAmount;
                lc.LedgerId = findLC.LedgerId;
                lc.BrokerLedgerId = findLC.BrokerLedgerId;
                lc.Narration = findLC.Narration;
                lc.AditionalCostOnTheBasis = findLC.AditionalCostOnTheBasis;
                lc.CostAs = findLC.CostAs;
                lc.CostAsId = findLC.CostAsId;
                lc.CostAsName = findLC.CostAsName;
                lc.TaxType = findLC.TaxType;
                lc.TaxBaseAmt = findLC.TaxBaseAmt;
            }
        });

        var tmpLedAColl =angular.copy(tran.LedgerAllocationColl);
        angular.forEach(tmpLedAColl, function (ledAll) {

            if (ledAll.SourceFrom == 3) {
                ledAll.UDFFeildsColl = [];
                angular.forEach(udfColl, function (uc) {
                    ledAll.UDFFeildsColl.push({
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
                if (ledAll.Attributes && ledAll.Attributes.length > 0) {
                    var udfFieldsColl = mx(JSON.parse(ledAll.Attributes));
                    angular.forEach(ledAll.UDFFeildsColl, function (udd) {
                        var findU = udfFieldsColl.firstOrDefault(p1 => p1.SNo == udd.SNo);
                        if (findU) {
                            if (udd.FieldType == 2) {
                                if (findU.Value) {
                                    udd.UDFValue_TMP = new Date(findU.Value);
                                }
                            } else if (udd.FieldType == 4) {
                                if (findU.Value) {
                                    udd.UDFValue_TMP = parseInt(findU.Value);
                                }
                            }
                            else
                                udd.UDFValue = findU.Value;
                        }
                    });
                }


                if (ledAll.TDSVatDetailColl) {
                    angular.forEach(ledAll.TDSVatDetailColl, function (tds) {
                        if (tds.BillDate)
                            tds.BillDate_TMP = new Date(tds.BillDate);
                    });

                    angular.forEach(ledAll.CostCenterColl, function (cc) {
                        if (cc.DrAmount > 0)
                            cc.Amount = cc.DrAmount;
                        else if (cc.CrAmount > 0)
                            cc.Amount = cc.CrAmount;
                    });
                }

                if (ledAll.CheckDetails && ledAll.CheckDetails.ChequeDate) {
                    ledAll.CheckDetails.ChequeDate_TMP = new Date(ledAll.CheckDetails.ChequeDate);
                }

                if (ledAll.ItemDetailsCOll && ledAll.ItemDetailsCOll.length > 0) {
                    angular.forEach(ledAll.ItemDetailsCOll, function (idet) {
                        if (idet.IsInQty == true) {
                            idet.InOut = 1;
                        }
                        else
                            idet.InOut = 0;
                    });
                }

                $scope.beData.LedgerAllocationColl.push(ledAll);
            }

           
        });


        if ($scope.beData.LedgerAllocationColl.length == 0) {
            $scope.AddRowInLedgerAllocation(0);
        }



        $scope.ChangeDrCrAmount();

        if ($scope.beData.LCDetail) {

            if ($scope.beData.LCDetail.GateInWardDate) {
                var dt = $scope.beData.LCDetail.GateInWardDate;
                $scope.beData.LCDetail.GateInWardDate_TMP = new Date(dt);
            }


            if ($scope.beData.LCDetail.BillDate) {
                var dt = $scope.beData.LCDetail.BillDate;
                $scope.beData.LCDetail.BillDate_TMP = new Date(dt);
            }


            if ($scope.beData.LCDetail.PPDate) {
                var dt = $scope.beData.LCDetail.PPDate;
                $scope.beData.LCDetail.PPDate_TMP = new Date(dt);
            }


            if ($scope.beData.LCDetail.LCDate) {
                var dt = $scope.beData.LCDetail.LCDate;
                $scope.beData.LCDetail.LCDate_TMP = new Date(dt);
            }


            if ($scope.beData.LCDetail.BuiltyDate) {
                var dt = $scope.beData.LCDetail.BuiltyDate;
                $scope.beData.LCDetail.BuiltyDate_TMP = new Date(dt);
            }

        }

    };

    $scope.ChangeVatTDSParty = function (led) {
        if (led.VTLedgerDetails) {
            led.PartyName = led.VTLedgerDetails.Name;
            led.PANVat = led.VTLedgerDetails.PanVat;
        }
    }

    $scope.ChangeDrCrAmount = function () {
        var totalDr = 0, totalCr = 0;
        angular.forEach($scope.beData.LedgerAllocationColl, function (led) {
            totalCr += isEmptyAmt(led.CrAmount);
            totalDr += isEmptyAmt(led.DrAmount);
        });

        angular.forEach($scope.LandedCostColl, function (led) {            
            totalDr += isEmptyAmt(led.DrAmount);
        });

        angular.forEach($scope.ProductWiseCostColl, function (led) {            
            totalDr += isEmptyAmt(led.TotalAmount);
        });

        $scope.beData.DrAmount = totalDr;
        $scope.beData.CrAmount = totalCr;
    };

    $scope.ClearData = function () {

        var sV = $scope.SelectedVoucher;
        var sC = $scope.SelectedCostClass;

        $scope.SelectedVoucher = null;
        $scope.SelectedCostClass = null;

        $scope.CurLedgerAllocation = {};

        $scope.AllProductColl = [];
        $scope.CostProductColl = [];
        $scope.CostProductGroupColl = [];
        $scope.CostModuleColl = [];
        $scope.RefVoucherNoColl = [];
        $scope.ProductWiseCostColl = [];
        $scope.ProductWiseCreditLedgerColl = [];

        $scope.beData =
        {
            VoucherId: null,
            CostClassId: null,
            TranId: 0,
            AutoManualNo: '',
            AutoVoucherNo: 0,
            CurRate: 1,
            AttechFiles: [],
            SubTotal: 0,
            Total: 0,
            Narration: '',
            VoucherDate: new Date(),
            VoucherDate_TMP: new Date(),
            LedgerAllocationColl: [],
            LCDetail: {},
            Attributes: '',
            UDFFeildsColl: [],
            DocumentColl: [],
            Mode: 'Save'
        };

        $scope.beData.LedgerAllocationColl.push(
            {
                DrCr: 1,
                LedgerId: 0,
                AgentId: 0,
                LFNO: '',
                Narration: '',
                DrAmount: 0,
                CrAmount: 0,
                ForBranchId: null
            }
        );

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

        $('input[type=file]').val('');

        $scope.RefTranIdColl = [];
        $scope.CostProductColl = [];
        $scope.CostProductGroupColl = [];
        $scope.CostModuleColl = [];
        $scope.RefVoucherNoColl = [];

        angular.forEach($scope.PurchaseColl, function (pc) {
            pc.IsSelected = false;
        });

   

        $timeout(function () {
            $scope.getVoucherNo();
        })

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

         
    

    };

    $scope.SetDefaultValue = function () {
        try {

            if ($scope.EPDet) {
                $timeout(function () {
                    $scope.$apply(function () {
                        for (key in $scope.EPDet) {
                            if (key.startsWith("LandedCostColl") == true) {
                                var proName = key.replace("LandedCostColl.", "");

                                var findEP = $scope.EPDet[key];
                                if (findEP && findEP.DefaultValue) {
                                    $scope.LandedCostColl.forEach(function (lc) {
                                        lc[proName] = findEP.DefaultValue;
                                    })
                                }
                            }
                            else if (key.indexOf('.') == -1) {
                                var findEP = $scope.EPDet[key];
                                if (findEP && findEP.DefaultValue) {
                                    $scope.beData[key] = findEP.DefaultValue;
                                }
                            }
                        }
                    });
                });               
            }

        } catch { }
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
                $scope.ClearData();
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

    $scope.ChangeCostAs = function (ind, curRow, curLedger) {
        if (ind == 0 && curRow.CostAs == 2) {

            var totalProduct = $scope.CostProductColl.length;
            if (totalProduct > 0) {
                for (var s = 1; s < totalProduct; s++) {

                    if(s==1)
                        curRow.CostAsId = $scope.CostProductColl[0].id;

                    if (totalProduct > s) {
                        $scope.CurLedgerAllocation.CostCenterColl.push({
                            CostCenterId: curRow.CostCenterId,
                            CostAs: curRow.CostAs,
                            CostAsId: $scope.CostProductColl[s].id
                        });
                    }

                }
            }

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

    $(document).ready(function () {
        $('input.disablecopypaste').bind('paste', function (e) {
            e.preventDefault();
        });
    });

    $scope.PasteData = function (colInd) {
        var clipText = event.clipboardData.getData('text/plain');
        if (clipText) {
            var startInd = 0;
            clipText.split("\n").forEach(function (line) {
                if (line && line.length > 0 && $scope.ProductWiseCostColl.length>startInd) {
                    $scope.ProductWiseCostColl[startInd].LandedCostColl[colInd].DrAmount = isEmptyAmt(line.trim());
                    startInd++;
                }
            });
            $scope.ChangeProductWiseCost(null, null);
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
            $scope.$apply($scope.SaveJournal);
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

});