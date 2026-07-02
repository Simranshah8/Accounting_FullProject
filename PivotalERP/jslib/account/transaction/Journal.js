app.controller('JournalController', function ($scope, $http, $timeout, $filter, $compile, GlobalServices, $document) {
    $scope.Title = 'JournalController';
    
    var glSrv = GlobalServices;
    LoadData();

    $scope.sideBarData = [];
   
    $scope.lastTranId = 0;

    function ToRound(val) {
        val = isEmptyAmt(val);
        return ($filter('number')(val, $scope.SelectedVoucher.NoOfDecimalPlaces)).parseDBL();
    }

    function LoadData() {

 $scope.DefaultKeyValues_JSON = null;
        if (DefaultKeyValues && DefaultKeyValues.length > 0) {
            $scope.DefaultKeyValues_JSON = JSON.parse(decodeURIComponent(DefaultKeyValues));           
        }
		
        $('.select2').select2({
            allowClear: true,
            openOnEnter: true
        });

        $scope.ButtonED = {};
        GlobalServices.getButtonDisabled(EntityId).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.ButtonED = res.data.Data;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });


        //$scope.ProjectColl = [];
        //GlobalServices.getProject().then(function (res) {
        //    if (res.data.IsSuccess && res.data.Data) {
        //        $scope.ProjectColl = res.data.Data;
        //    }
        //}, function (reason) {
        //    Swal.fire('Failed' + reason);
        //});

        $scope.ExpensesLedgerColl = [];
        GlobalServices.getExpensesLedger().then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.ExpensesLedgerColl = res.data.Data;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        $scope.FundTransferTypeColl = [];
        $http({
            method: 'GET',
            url: base_url + "Account/Creation/GetAllFundTransferType",
            dataType: "json"
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.FundTransferTypeColl = res.data.Data;
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

        $scope.CashPartyColl = [];
        $scope.CashPartyColl_Qry = [];
        $http({
            method: 'GET',
            url: base_url + "Inventory/Transaction/getCastPartyListForTxn",
            dataType: "json"
            //data:JSON.stringify(para)
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.CashPartyColl = res.data.Data;
                $scope.CashPartyColl_Qry = mx(res.data.Data);
            }
        }, function (reason) {
            alert('Failed' + reason);
        });

        $scope.CostDepartmentColl = [];        
        $http({
            method: 'GET',
            url: base_url + "Account/Creation/GetAllCostCenterDepartment",
            dataType: "json"
            //data:JSON.stringify(para)
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
               $scope.CostDepartmentColl = res.data.Data; 
            }
        }, function (reason) {
            alert('Failed' + reason);
        });


        $scope.BrandColl = [];
        $http({
            method: 'GET',
            url: base_url + "Inventory/Creation/GetAllProductBrand",
            dataType: "json"
            //data:JSON.stringify(para)
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.BrandColl = res.data.Data;
            }
        }, function (reason) {
            alert('Failed' + reason);
        });


        $scope.perPageColl = GlobalServices.getPerPageList();
        $scope.currentPages = {
            PendingBill: 1,
            PendingTDS: 1,
        };

        $scope.searchData = {
            PendingBill: '',
            PendingTDS: '',
        };

        $scope.perPage = {
            PendingBill: GlobalServices.getPerPageRow(),
            PendingTDS: GlobalServices.getPerPageRow(),
        };

        $scope.PendingTDSSearchBy = [{ text: 'Invoice No.', value: 'VoucherNo' }, { text: 'Miti', value: 'VoucherMiti' }, { text: 'Dues Amt.', value: 'ClosingAmt' }, { text: 'Paid Amt.', value: 'DrAmount' }, { text: 'Party', value: 'PartyName' }, { text: 'PAN', value: 'PanNo' }, { text: 'Branch', value: 'Branch' }];
        $scope.tdsSearchOptions = {
            pageNumber: 1,
            pageSize: glSrv.getPerPageRow(),
            sort: null,
            SearchType: 'text',
            SearchCol: '',
            SearchVal: '',
            SearchColDet: null,
            pagearray: [],
            pageOptions: [5, 10, 20, 30, 40, 50],
            SearchColDet: $scope.PendingTDSSearchBy[0],
        };

        $scope.VoucherSearchOptions = [{ text: 'AutoVoucherNo', value: 'TS.AutoVoucherNo', searchType: 'Number' }, { text: 'VoucherNo', value: 'TS.AutoManualNo', searchType: 'text' }, { text: 'RefNo', value: 'TS.[RefNo]', searchType: 'text' }, { text: 'VoucherDate', value: 'TS.VoucherDate', searchType: 'date' }, { text: 'Voucher Name', value: 'V.VoucherName', searchType: 'text' }, { text: 'CostClass', value: 'CC.Name', searchType: 'text' }, { text: 'Party', value: 'PLed.Name', searchType: 'text' },];
        $scope.paginationOptions = {
            pageNumber: 1,
            pageSize: glSrv.getPerPageRow(),
            sort: null,
            SearchType: 'text',
            SearchCol: '',
            SearchVal: '',
            SearchColDet: null,
            pagearray: [],
            pageOptions: [5, 10, 20, 30, 40, 50],
            SearchColDet: $scope.VoucherSearchOptions[1],
        };
        
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

        $scope.InOutColl = [{ id: 1, text: 'IN' }, { id: 0, text: 'OUT' }];

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

        $scope.BranchColl = [];
        $http({
            method: 'POST',
            url: base_url + "Setup/Security/GetAllBranchListForEntry",
            dataType: "json"
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.BranchColl = res.data.Data;
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
            UniqueId: GlobalServices.getUniqueId(),
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


        if (VoucherType) {

            $scope.AllDimensionColl = [];
            $http({
                method: 'GET',
                url: base_url + "Account/Creation/GetAllDimension",
                dataType: "json"
            }).then(function (res1) {
                if (res1.data.IsSuccess && res1.data.Data) {
                    $scope.AllDimensionColl = res1.data.Data;
                }
            }, function (reason) {
                Swal.fire('Failed' + reason);
            });

            $scope.AllCostCenterColl = [];
            $http({
                method: 'GET',
                url: base_url + "Account/Creation/GetAllCostCenter",
                dataType: "json"
            }).then(function (res1) {
                if (res1.data.IsSuccess && res1.data.Data) {
                    $scope.AllCostCenterColl = res1.data.Data;
                }
            }, function (reason) {
                Swal.fire('Failed' + reason);
            });

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
            //GlobalServices.getDefaultBranch().then(function (dbres) {
            //    if (dbres.data.IsSuccess && dbres.data.Data) {
            //        $scope.DefaultBranch = dbres.data.Data;
            //    }

            //    if ($scope.DefaultBranch) {
            //        if (filterObjs_VoucherId == null) {
            //            filterObjs_VoucherId = {};
            //        }

            //        filterObjs_VoucherId['BDId'] = $scope.DefaultBranch.BranchId;
            //    }

            //    var vt_Para = {
            //        voucherType: VoucherType,
            //        filterPara: filterObjs_VoucherId,
            //    };

            //    $http({
            //        method: 'POST',
            //        url: base_url + "Account/Creation/GetVoucherList",
            //        dataType: "json",
            //        data: JSON.stringify(vt_Para)
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


            //}, function (reason) {
            //    Swal.fire('Failed to get default branch' + reason);
            //});

        }

        $scope.TableIdColl = [{ id: 'main-table', text: 'Table', visible: false }];
    }
    $scope.CopyTableData = function (id) {
        GlobalServices.copyTableData(id);
    }
    $scope.ChangeCurrency = function () {
        if ($scope.beData.CurrencyDet) {
            $scope.beData.CurRate = $scope.beData.CurrencyDet.SellingRate;
        }
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

    $scope.GetPendingReceiptNo = function () {
        if ($scope.SelectedVoucher.ActiveReceiptNo == true) {
            var paraPR = {
                VoucherId: $scope.SelectedVoucher.VoucherId
            }
            $http({
                method: 'POST',
                url: base_url + "Account/Creation/GetPendingReceipt",
                dataType: "json",
                data: JSON.stringify(paraPR)
            }).then(function (res) {
                if (res.data.IsSuccess && res.data.Data) {
                    $scope.PendingReceiptColl = res.data.Data;
                } else {
                    Swal.fire(res.data.ResponseMSG);
                }
            }, function (reason) {
                Swal.fire('Failed' + reason);
            });
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
            var dtPicker = '<input type="text"  class="form-control form-control-sm" date-picker ng-model="beData.VoucherDate_TMP" date-detail="beData.VoucherDateDet" confirm-action="getVoucherNoOnly(2)" title ="{{(SelectedVoucher.DateStyle==1 ? beData.VoucherDateDet.dateBS : (beData.VoucherDateDet.dateAD |dateFormat))}}" date-style="SelectedVoucher.DateStyle" id ="dtVoucherDate" voucherid ="SelectedVoucher.VoucherId" >';
            if ($scope.SelectedVoucher.DateStyle == 2) //BS
            {
                dtPicker = '<input type="text"  class="form-control form-control-sm" date-picker ng-model="beData.VoucherDate_TMP" date-detail="beData.VoucherDateDet" confirm-action="getVoucherNoOnly(2)" title ="{{beData.VoucherDateDet.dateAD |dateFormat}}" date-style="2" id ="dtVoucherDateBS" voucherid ="SelectedVoucher.VoucherId" >';
            }
            else if ($scope.SelectedVoucher.DateStyle == 1) //AD
            {
                dtPicker = '<input type="text"  class="form-control form-control-sm" date-picker ng-model="beData.VoucherDate_TMP" date-detail="beData.VoucherDateDet" confirm-action="getVoucherNoOnly(1)" title ="{{ beData.VoucherDateDet.dateBS }}" date-style="1" id ="dtVoucherDateAD" voucherid ="SelectedVoucher.VoucherId" >';
            }
            else if ($scope.SelectedVoucher.DateStyle == 3) //BS & AD
            {

                dtPicker = `<div class="d-inline-block">
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
                dtPicker = `<div class="d-inline-block">
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
                dtPicker = '<input type="text"  class="form-control form-control-sm" date-picker ng-model="beData.VoucherDate_TMP" date-detail="beData.VoucherDateDet" confirm-action="getVoucherNoOnly(2)" title ="{{beData.VoucherDateDet.dateAD |dateFormat}}" date-style="2" id ="dtVoucherDateBS" voucherid ="SelectedVoucher.VoucherId" >';
            }
            const newElement = angular.element(dtPicker);
            //container.append($compile(newElement)($scope));

            container.append(newElement);
            $compile(newElement)($scope);
        });
    };
	
    $scope.getVoucherNo = function () {

        if ($scope.beData.VoucherId > 0)
            $scope.SelectedVoucher = mx($scope.VoucherTypeColl).firstOrDefault(p1 => p1.VoucherId == $scope.beData.VoucherId);

        if ($scope.beData.CostClassId > 0)
            $scope.SelectedCostClass = mx($scope.CostClassColl).firstOrDefault(p1 => p1.CostClassId == $scope.beData.CostClassId);

        if ($scope.SelectedVoucher) {

            $scope.loadingstatus = "running";
            showPleaseWait();

            $timeout(function () {
                $scope.$apply(function () {
                    $scope.SelectedVoucher.VoucherId = $scope.SelectedVoucher.VoucherId;
                });
            });

            $http({
                method: 'GET',
                url: base_url + "Account/Creation/GetVoucherModeById?voucherId=" + $scope.SelectedVoucher.VoucherId,
                dataType: "json"
            }).then(function (res) {

                $scope.loadingstatus = "stop";
                hidePleaseWait();

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
					
                    $scope.GetPendingReceiptNo();

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

                        if ($scope.beData.TranId > 0) {

                        } else {
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
                        }
                        
                         
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
    $scope.AddRowInLedgerAllocation = function (ind, boolAuto) {


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
                    UDFFeildsColl: udfColl,
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
                    UDFFeildsColl: udfColl,
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
                    UDFFeildsColl: udfColl,
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

        ledAll.BillRefColl = [];

        $scope.ChangeDrCrAmount();
    };

     
    $scope.ChangeBuyerSelection = function () {
 
    }

    $scope.ProductSelectionChange = function (itemDet, ind) {
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

            $scope.ChangeItemRowValue(itemDet, 'product');
        } else if (itemDet.productDetail) {
             

            itemDet.ClosingQty = $filter('formatNumber')(itemDet.productDetail.ClosingQty) + ' ' + itemDet.productDetail.BaseUnit;
            itemDet.UnitId = itemDet.productDetail.BaseUnitId;
            itemDet.UnitName = itemDet.productDetail.BaseUnit;
           

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
                itemDet.AmountDecimal = 2 
        }

    }

    $scope.ChequeNoSelect = function (ledAllocation) {
        if (ledAllocation.CheckDetails) {
            ledAllocation.CheckDetails.ChequeNo = '';
            ledAllocation.CheckDetails.AccountNo = '';

            if (ledAllocation.CheckDetails.ChequeId || ledAllocation.CheckDetails.ChequeId > 0) {
                var findCh = ledAllocation.PendingChequeColl_Qry.firstOrDefault(p1 => p1.ChequeId == ledAllocation.CheckDetails.ChequeId);
                if (findCh) {
                    ledAllocation.CheckDetails.ChequeNo = findCh.DisplayChequeNo;
                    ledAllocation.CheckDetails.AccountNo = findCh.AccountNo;
                }
            }
        }
    }


    $scope.CurLedgerAllocation = {};
    $scope.ChangeParticularLedger = function (ledDet,ind) {
        $scope.CurLedgerAllocation = ledDet;
        $scope.sideBarData = ledDet.partySideBarData;
        $timeout(function () {
            
            if (ledDet) {
                ledDet.CurrentBal = 0;
                if (ledDet.LedgerId && ledDet.LedgerId > 0 && ledDet.LedgerDetails) {
                    ledDet.CurrentBal = ledDet.LedgerDetails.Closing;

                    var taxable = 0;
                    if (ledDet.LedgerDetails.LedgerType == 1) {
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
                                $scope.CurLedgerAllocation.InOut = 1;
                                ledDet.ItemDetailsCOll.push({
                                    ProductId: null,
                                    Qty: 0,
                                });
                            }
                            else {
                                $scope.CurLedgerAllocation.InOut = ledDet.InOut;
                            }
                            $('#itemdetail').modal('show');
                        } else
                            ledDet.ItemDetailsCOll = [];
                    });


                    $timeout(function () {
                       
                         if (ledDet.DrCr == 1 && ledDet.LedgerDetails && ledDet.LedgerDetails.LedgerType == 5)
                        {
                            if (!ledDet.PendingTDSColl || ledDet.PendingTDSColl.length == 0) {
                                $http({
                                    method: 'POST',
                                    url: base_url + "Account/Transaction/GetPendingTDSForDebit?ledgerId=" + ledDet.LedgerId,
                                    dataType: "json"
                                }).then(function (res) {
                                    if (res.data.IsSuccess && res.data.Data) {
                                        ledDet.PendingTDSColl = res.data.Data;
                                        $('#mdlPendingTDS').modal('show');
                                    }
                                }, function (reason) {
                                    Swal.fire('Failed' + reason);
                                });
                            } else {
                                $('#mdlPendingTDS').modal('show');
                            }
                         }
                        else if (ledDet.LedgerDetails && (ledDet.LedgerDetails.IsTDS == true || ledDet.LedgerDetails.IsVat == true)) {
                            if (!ledDet.TDSVatDetailColl)
                                ledDet.TDSVatDetailColl = [];


                             if (ledDet.TDSVatDetailColl.length == 0) {

                                 if (ledDet.DrCr == 1) {

                                     ledDet.TDSVatDetailColl.push({
                                         SNO: 0,
                                         BillNo: '',
                                         AccessableValue: taxable,
                                         Amount: ledDet.DrAmount,
                                         Rate: ledDet.LedgerDetails.Rate,
                                         Payment: 0,
                                         BillDate_TMP: new Date(),
                                     });

                                 } else {

                                     ledDet.TDSVatDetailColl.push({
                                         SNO: 0,
                                         BillNo: '',
                                         Amount: 0,
                                         Rate: ledDet.LedgerDetails.Rate,
                                         Payment: 0,
                                         BillDate_TMP: new Date(),
                                     });
                                 }
                                
                            }
                            $('#tds').modal('show');
                        }
                        else
                            ledDet.TDSVatDetailColl = [];
                    });

                    $timeout(function () {
                        if (ledDet.LedgerDetails && ledDet.LedgerDetails.ActiveChequeDetails == true) {

                            if (ledDet.DrCr == 1) {
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
                            } else {


                                var para = {
                                    LedgerId: ledDet.LedgerDetails.LedgerId
                                }
                                $http({
                                    method: 'POST',
                                    url: base_url + "Account/Creation/GetPendingCheque",
                                    dataType: "json",
                                    data: JSON.stringify(para)
                                }).then(function (res) {
                                    if (res.data.IsSuccess && res.data.Data) {
                                        ledDet.PendingChequeColl = res.data.Data;
                                        ledDet.PendingChequeColl_Qry = mx(res.data.Data);

                                        if (!ledDet.CheckDetails) {
                                            ledDet.CheckDetails = {
                                                ChequeId: null,
                                                ChequeNo: '',
                                                AccountNo: '',
                                                Remarks: '',
                                                CheckType: 0,
                                                ChequeDate_TMP: new Date()
                                            };
                                        } else {
                                            if ($scope.beData.TranId > 0) {

                                                var findCQ = mx(ledDet.PendingChequeColl).firstOrDefault(p1 => p1.ChequeId == ledDet.CheckDetails.ChequeId);
                                                if (!findCQ) {
                                                    ledDet.PendingChequeColl.push({
                                                        DisplayChequeNo: ledDet.CheckDetails.ChequeNo,
                                                        ChequeId: ledDet.CheckDetails.ChequeId,
                                                        AccountNo: ledDet.CheckDetails.AccountNo,
                                                        BranchName: ledDet.CheckDetails.BankBranchName,
                                                    });
                                                }

                                            }
                                        }

                                        $('#chequedetailCR').modal('show');

                                    } else {
                                        Swal.fire(res.data.ResponseMSG);
                                    }
                                }, function (reason) {
                                    Swal.fire('Failed' + reason);
                                });

                            }
                            
                        } else
                            ledDet.CheckDetails = {};
                    });


                    $timeout(function () {
                        if (ledDet.LedgerDetails && ledDet.LedgerDetails.IsFundtransfer == true) {
                            if (!ledDet.FundDetails) {
                                ledDet.FundDetails = {
                                    FundTransferTypeId:null,
                                    TransactionRefNo: '',
                                    ToAccount: '',
                                    Amount: 0,
                                    BeneficiaryBankName: '',
                                    BeneficiaryName: '',
                                };
                            }

                            $('#fundtransferdetail').modal('show');
                        } else
                            ledDet.FundDetails = {};
                    });

                    $timeout(function () {

                        if (ledDet.LedgerDetails.BillWiseAdjustment == true) {
                            if (!ledDet.BillRefColl)
                                ledDet.BillRefColl = [];

                            if (ledDet.DrCr == 1 &&  ledDet.BillRefColl.length == 0)
                            {
                                $http({
                                    method: 'GET',
                                    url: base_url + "Inventory/Transaction/getPurchaseDuesBillList?ledgerId=" + ledDet.LedgerId + '&branchId=' + $scope.SelectedVoucher.BDId + "&billwise=false",
                                    dataType: "json"
                                }).then(function (res) {
                                    if (res.data.IsSuccess && res.data.Data) {
                                        ledDet.BillRefColl = res.data.Data;
                                    }
                                }, function (reason) {
                                    Swal.fire('Failed' + reason);
                                });
                            }
                            else if (ledDet.DrCr == 2 &&  ledDet.BillRefColl.length == 0) {
                                $http({
                                    method: 'GET',
                                    url: base_url + "Inventory/Transaction/getDuesBillList?ledgerId=" + ledDet.LedgerId + '&branchId=' + $scope.SelectedVoucher.BDId + "&billwise=false",
                                    dataType: "json"
                                }).then(function (res) {
                                    if (res.data.IsSuccess && res.data.Data) {
                                        ledDet.BillRefColl = res.data.Data;
                                    }
                                }, function (reason) {
                                    Swal.fire('Failed' + reason);
                                });
                            }


                            $('#mdlPendingBills').modal('show');
                        } else
                            ledDet.BillRefColl = [];

                    });


                    $timeout(function () {
                        if (ledDet.LedgerDetails && ledDet.LedgerDetails.UDFColl && ledDet.LedgerDetails.UDFColl.length>0) 
                        {
                            if (!ledDet.LedgerUDFColl)
                                ledDet.LedgerUDFColl = [];

                            if (ledDet.LedgerUDFColl.length == 0) {                                 

                                var ledUdfColl = [];
                                angular.forEach(ledDet.LedgerDetails.UDFColl, function (udf) {
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
                                    ledUdfColl.push(ud);
                                });


                                if (ledDet.LedgerAttributes && ledDet.LedgerAttributes.length > 0) {
                                    var tmpLedUDF = JSON.parse(ledDet.LedgerAttributes);
                                    angular.forEach(ledUdfColl, function (udd)
                                    {
                                        var findU = tmpLedUDF[udd.NameId];
                                        if (findU) {
                                            if (udd.FieldType == 2) {
                                                if (findU.Value) {
                                                    udd.UDFValue_TMP = new Date(findU);
                                                }
                                            } else if (udd.FieldType == 4) {
                                                if (findU.Value) {
                                                    udd.UDFValue = parseInt(findU);
                                                }
                                            }
                                            else
                                                udd.UDFValue = findU;
                                        }
                                    });
                                }

                                ledDet.LedgerUDFColl = ledUdfColl;
                            }
                            
                            $('#ledgerUDF').modal('show');
                        } 
                    });
                }
            }
        });

    }

    $scope.getDuesBillForRec = function (ledDet) {
        ledDet.BillRefColl = [];
        $scope.loadingstatus = "running";
        showPleaseWait();
      
        if (ledDet.DrCr == 1) {
            $http({
                method: 'GET',
                url: base_url + "Inventory/Transaction/getPurchaseDuesBillList?ledgerId=" + ledDet.LedgerId + '&branchId=' + $scope.SelectedVoucher.BDId + "&billwise=" + ledDet.LedgerDetails.BillWiseDues,
                dataType: "json"
            }).then(function (res) {
                hidePleaseWait();
                $scope.loadingstatus = "stop";
                if (res.data.IsSuccess && res.data.Data) {
                    ledDet.BillRefColl = res.data.Data;
                }
            }, function (reason) {
                hidePleaseWait();
                $scope.loadingstatus = "stop";
                Swal.fire('Failed' + reason);
            });
        }
        else if (ledDet.DrCr == 2) {
            $http({
                method: 'GET',
                url: base_url + "Inventory/Transaction/getDuesBillList?ledgerId=" + ledDet.LedgerId + '&branchId=' + $scope.SelectedVoucher.BDId + "&billwise=" + ledDet.LedgerDetails.BillWiseDues,
                dataType: "json"
            }).then(function (res) {
                hidePleaseWait();
                $scope.loadingstatus = "stop";
                if (res.data.IsSuccess && res.data.Data) {
                    ledDet.BillRefColl = res.data.Data;
                }
            }, function (reason) {
                hidePleaseWait();
                $scope.loadingstatus = "stop";
                Swal.fire('Failed' + reason);
            });
        }
    }

    $scope.ChangeBillWiseAmt = function (colName) {
        if (colName == 'totalPaidAmt') {
            var totalAmt = $scope.CurLedgerAllocation.TotalPaidAmt;
            $scope.CurLedgerAllocation.BillRefColl.forEach(function (br) {

                if (totalAmt >= br.Amount) {
                    br.PaidAmt = br.Amount;
                    totalAmt -= br.Amount;
                } else if (totalAmt < br.Amount) {
                    br.PaidAmt = totalAmt;
                    totalAmt = 0;
                }

            });

            //if ($scope.CurLedgerAllocation.DrCr == 1)
            //    $scope.CurLedgerAllocation.DrAmount = $scope.CurLedgerAllocation.TotalPaidAmt;
            //else
            $scope.CurLedgerAllocation.CrAmount = $scope.CurLedgerAllocation.TotalPaidAmt;
        }
        else if (colName == 'paidAmt') {
            $scope.CurLedgerAllocation.TotalPaidAmt = 0;
            var amt = 0;
            angular.forEach($scope.CurLedgerAllocation.BillRefColl, function (br) {
                if (br.PaidAmt > 0) {
                    amt += br.PaidAmt;
                }
            });

            $scope.CurLedgerAllocation.TotalPaidAmt = amt;

            //if ($scope.CurLedgerAllocation.DrCr == 1)
            //    $scope.CurLedgerAllocation.DrAmount = amt;
            //else
            $scope.CurLedgerAllocation.CrAmount = amt;

        }

        $scope.ChangeCrAmount();

    }
    $scope.ChangeParticularCostCenter = function (costAllocation) {
        $timeout(function () {
            costAllocation.CurrentBal = 0;

            if (costAllocation.CostCenterId && costAllocation.CostCenterId > 0 && costAllocation.CostCenterDetails) {
                costAllocation.CurrentBal = costAllocation.CostCenterDetails.Closing;
                costAllocation.ProductBrandId = costAllocation.CostCenterDetails.ProductBrandId;
                costAllocation.DepartmentId = costAllocation.CostCenterDetails.DepartmentId;
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

            $scope.ChangeDrCrAmount();
        });
    };
    $scope.OkCostCenterModal = function () {
        $timeout(function () {
            if ($scope.CurLedgerAllocation.DrCr == 2)
                $scope.CurLedgerAllocation.CrAmount = mx($scope.CurLedgerAllocation.CostCenterColl).sum(p1 => p1.Amount);
            else if ($scope.CurLedgerAllocation.DrCr == 1)
                $scope.CurLedgerAllocation.DrAmount = mx($scope.CurLedgerAllocation.CostCenterColl).sum(p1 => p1.Amount);

            $('#frmCostCentersModel').modal('hide');
        });
    };

    $scope.AddRowInItemDetails = function (ind) {


        if ($scope.CurLedgerAllocation.ItemDetailsCOll) {
            if ($scope.CurLedgerAllocation.ItemDetailsCOll.length > ind + 1) {
                $scope.CurLedgerAllocation.ItemDetailsCOll.splice(ind + 1, 0, {
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
                $scope.CurLedgerAllocation.ItemDetailsCOll.push({
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
        if ($scope.CurLedgerAllocation.ItemDetailsCOll) {
            if ($scope.CurLedgerAllocation.ItemDetailsCOll.length > 1) {
                $scope.CurLedgerAllocation.ItemDetailsCOll.splice(ind, 1);
            }
        }
    }
    
    $scope.CalculateTDS = function (tds, col) {
        if (col == 'access' || col == 'rate') {
            if (tds.Rate > 0 && tds.AccessableValue > 0) {
                tds.Amount = ToRound(tds.AccessableValue * tds.Rate / 100);
            }
        }

        var totalAmt = ToRound(mx($scope.CurLedgerAllocation.TDSVatDetailColl).sum(p1 => p1.Amount + p1.Payment));
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
                    Payment: 0,
                    BillDate_TMP:new Date(),
                })
            } else {
                $scope.CurLedgerAllocation.TDSVatDetailColl.push({
                    SNO: 0,
                    Amount: 0,
                    Rate: 0,
                    Payment: 0,
                    BillDate_TMP: new Date(),
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
    $scope.ChangeItemRowValue = function (itemDet, col) {

        var amt = 0, qty = 0, rate = 0, disAmt = 0, disPer = 0, schAmt = 0, schPer = 0;

        var aQty = 0;
        if (itemDet.ActualQty || itemDet.ActualQty >= 0)
            aQty = itemDet.ActualQty;

        qty = aQty;

        if (itemDet.Rate || itemDet.Rate >= 0)
            rate = itemDet.Rate;

        if (itemDet.productDetail) {
            if (itemDet.productDetail.ClosingQty < qty)
                itemDet.IsNegativeQty = true;
            else if (itemDet.RefQty && itemDet.RefQty < qty)
                itemDet.IsNegativeQty = true;
            else
                itemDet.IsNegativeQty = false;
        }
        if ((itemDet.Amount || itemDet.Amount != 0) && col == "amt") {

        }

        amt = qty * rate;

        if (itemDet.DiscountAmt || itemDet.DiscountAmt >= 0)
            disAmt = itemDet.DiscountAmt;

        if (itemDet.DiscountPer || itemDet.DiscountPer >= 0)
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

        itemDet.BilledQty = aQty;

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

        var totalAmt = mx($scope.CurLedgerAllocation.ItemDetailsCOll).sum(p1 => p1.Amount);
        if ($scope.CurLedgerAllocation.DrCr == 1)
            $scope.CurLedgerAllocation.DrAmount = parseFloat(totalAmt);
        else
            $scope.CurLedgerAllocation.CrAmount = parseFloat(totalAmt);
    }

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
                    
                    $timeout(function () {
                        var filesColl = $scope.beData.AttechFiles;
                        $scope.beData.AttechFiles = [];

                        $http({
                            method: 'POST',
                            url: base_url + "Account/Transaction/SaveUpdateJournal",
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
                             
                //$scope.ClearData();
                $scope.ClearDataForEdit();
                $scope.beData.TranId = tran.TranId;

                $timeout(function () {
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
                                $('#searVoucherRightBtn').modal('hide');
                            } else {
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
            UniqueId: $scope.beData.UniqueId,
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
            EntryDate: eDate,
            BranchId: ($scope.beData.BranchId ? $scope.beData.BranchId : 0),
            LedgerAllocationColl: [],
            DocumentColl: $scope.beData.DocumentColl,
            ReceiptId: $scope.beData.ReceiptId,
            ProjectId: $scope.beData.ProjectId,
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

        angular.forEach($scope.beData.LedgerAllocationColl, function (ledA) {
            if (ledA.LedgerId && ledA.LedgerId > 0) {

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
                 

                var itemKeyVal_LW = {};
                if (ledA.LedgerUDFColl && ledA.LedgerUDFColl.length > 0) {
                    angular.forEach(ledA.LedgerUDFColl, function (udf) {
                        if (udf.NameId) {
                            if (udf.FieldType == 2 || udf.FieldType == 22 || udf.FieldType == 23) {
                                itemKeyVal_LW[udf.NameId] = udf.UDFValueDet ? udf.UDFValueDet.dateBS : '';
                            }
                            else if (udf.FieldType == 3 && udf.Source && udf.Source.length > 0) {
                                itemKeyVal_LW[udf.NameId] = udf.UDFValueDet ? udf.UDFValueDet.text : ''
                            }
                            else {
                                itemKeyVal_LW[udf.NameId] = udf.UDFValue;
                            }
                        }

                    });
                    itemKeyVal_LW = JSON.stringify(itemKeyVal_LW);
                } else {
                    itemKeyVal_LW = '';
                }
            
                var crLedAllocation = {
                    LedgerAttributes: itemKeyVal_LW,
                    UDFKeyVal: itemKeyVal,
                    Attributes: udfValues,
                    DrCr: ledA.DrCr,
                    LedgerId: ledA.LedgerId,
                    AgentId: ledA.AgentId,
                    LFNO: ledA.LFNO,
                    Narration: ledA.Narration,
                    DrAmount: ledA.DrAmount,
                    CrAmount: ledA.CrAmount,
                    ForBranchId: ledA.ForBranchId,
                    Dimension1: ledA.Dimension1,
                    Dimension2: ledA.Dimension2,
                    Dimension3: ledA.Dimension3,
                    Dimension4: ledA.Dimension4,
                    Dimension5: ledA.Dimension5,
                    SubLedgerId: ledA.SubLedgerId,
                    CostCenterColl: [],
                    ItemDetailsCOll: [],
                    TDSVatDetailColl: [],
                    CheckDetails: {},
                    BillRefColl: [],
                    PendingTDSColl: [],
                    FundDetails: {},
                    ReceiptId: ledA.ReceiptId,

                };

                if (ledA.CheckDetails && ledA.CheckDetails.ChequeDateDet) {                    
                    crLedAllocation.CheckDetails.ChequeId = ledA.CheckDetails.ChequeId;
                    crLedAllocation.CheckDetails.ChequeNo = ledA.CheckDetails.ChequeNo;
                    crLedAllocation.CheckDetails.AccountNo = ledA.CheckDetails.AccountNo;
                    crLedAllocation.CheckDetails.Remarks = ledA.CheckDetails.Remarks;
                    crLedAllocation.CheckDetails.CheckType = ledA.CheckDetails.CheckType;
                    crLedAllocation.CheckDetails.PartyName = ledA.CheckDetails.PartyName;
                    crLedAllocation.CheckDetails.ChequeDate = $filter('date')(new Date(ledA.CheckDetails.ChequeDateDet.dateAD), 'yyyy-MM-dd');
                }

                if (ledA.FundDetails && ledA.FundDetails.TransactionRefNo && ledA.FundDetails.TransactionRefNo.length>0) {
                    crLedAllocation.FundDetails.FundTransferTypeId = ledA.FundDetails.FundTransferTypeId;
                    crLedAllocation.FundDetails.TransactionRefNo = ledA.FundDetails.TransactionRefNo;
                    crLedAllocation.FundDetails.ToAccount = ledA.FundDetails.ToAccount;
                    crLedAllocation.FundDetails.BeneficiaryName = ledA.FundDetails.BeneficiaryName;
                    crLedAllocation.FundDetails.BeneficiaryBankName = ledA.FundDetails.BeneficiaryBankName;
                    crLedAllocation.FundDetails.Amount = ledA.DrCr == 1 ? ledA.DrAmount : ledA.CrAmount;
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
                                DepartmentId: cc.DepartmentId,
                                ProductBrandId: cc.ProductBrandId,
                                AreaId: cc.AreaId
                            };
                            crLedAllocation.CostCenterColl.push(ccAllocation);
                        }
                    });
                }

                if (ledA.ItemDetailsCOll) {
                    angular.forEach(ledA.ItemDetailsCOll, function (cc) {
                        if (cc.ProductId > 0 && (cc.Amount != 0 || cc.ActualQty != 0)) {
                            var itemAllocation = {
                                ProductId: cc.ProductId,
                                GodownId: cc.GodownId,
                                IsInQty: (ledA.InOut==1 ? true : false),
                                ActualQty: cc.ActualQty,
                                BilledQty: cc.ActualQty,
                                UnitId: (cc.productDetail ? cc.productDetail.BaseUnitId : 1),
                                Amount: cc.Amount,
                                Rate: cc.Rate
                            };
                            crLedAllocation.ItemDetailsCOll.push(itemAllocation);
                        }
                    });
                }

                if (ledA.TDSVatDetailColl) {
                    angular.forEach(ledA.TDSVatDetailColl, function (cc) {
                        if ((cc.BillDateDet || cc.BillDate) && (cc.Amount != 0 || cc.Payment != 0)) {
                            var tdsVat = {
                                BillNo: cc.BillNo,
                                BillDate: (cc.BillDateDet ? $filter('date')(new Date(cc.BillDateDet.dateAD), 'yyyy-MM-dd') : $filter('date')(new Date(cc.BillDate), 'yyyy-MM-dd')),
                                PartyLedgerId:cc.PartyLedgerId,
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

                if (ledA.PendingTDSColl) {
                    angular.forEach(ledA.PendingTDSColl, function (br) {
                        if (br.DrAmount > 0) {
                            var tdsRef = {
                                TranId: br.TranId,
                                DrAmount: br.DrAmount,
                                CrAmount: br.CrAmount,
                            };
                            crLedAllocation.PendingTDSColl.push(tdsRef);
                        };
                    });
                }

                if (ledA.BillRefColl) {
                    angular.forEach(ledA.BillRefColl, function (br) {
                        if (br.PaidAmt > 0) {
                            var billRef = {
                                Amount: br.PaidAmt,
                                BillRefType: 2,
                                BillRefId: br.TranId,
                                CreditDays: 0,
                                DrCr: crLedAllocation.DrCr,
                                DueDate: $filter('date')(new Date(br.VoucherDate), 'yyyy-MM-dd'),
                                RefName: br.VoucherName,
                                RefVoucherType: br.VoucherType,
                                RefTranId: br.TranId,
                                RefVNo: br.InvoiceNo,
                                DuesAmount: br.Amount,
                            };
                            crLedAllocation.BillRefColl.push(billRef);
                        };
                    });
                }

                tmpJournal.LedgerAllocationColl.push(crLedAllocation);
            }
        });


        return tmpJournal;
    };

    $scope.SetData = function (tran) {

        $scope.beData.VoucherDateDet = null;
        $scope.beData.VoucherDate = new Date(tran.VoucherDate);
        $scope.beData.VoucherDate_TMP = new Date(tran.VoucherDate);
        $scope.beData.VoucherDateAD_TMP = new Date(tran.VoucherDate);
        $scope.beData.VoucherDateDet = GlobalServices.getDateDet(tran.VoucherDate);
        setTimeout(1000);
          
		   //$timeout(function () {
     //       if ($scope.SelectedVoucher.DateStyle == 3 || $scope.SelectedVoucher.DateStyle == 4) {
     //           if ($scope.beData.VoucherDateDet) {
     //               $scope.beData.VoucherDateAD_TMP = new Date($scope.beData.VoucherDateDet.dateAD);
     //           }
     //           else if ($scope.beData.VoucherDate_TMP) {
     //               $scope.beData.VoucherDateAD_TMP = new Date($scope.beData.VoucherDate_TMP);
     //           }
     //       }
     //   });

        $timeout(function () {

            $scope.beData.ProjectId = tran.ProjectId;
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
            $scope.beData.DocumentColl = tran.DocumentColl;

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


            angular.forEach(tran.LedgerAllocationColl, function (ledAll) {

                //ledAll.UDFFeildsColl = udfColl;
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
                            ledAll.InOut = 1;
                        }
                        else {
                            idet.InOut = 0;
                            ledAll.InOut = 0;
                        }
                            
                    });
                }

                if (ledAll.BillRefColl && ledAll.BillRefColl.length > 0) {
                    ledAll.BillRefColl.forEach(function (br) {
                        br.InvoiceNo = br.RefVNo;
                        br.VoucherDateBS = br.DueMiti;
                        br.PaidAmt = br.Amount;
                        br.VoucherDate = br.DueDate;
                        br.VoucherType = br.RefVoucherType;
                        br.TranId = br.RefTranId;
                    });
                }

                $scope.beData.LedgerAllocationColl.push(ledAll);
            });

            $scope.ChangeDrCrAmount();

        }, 100);
        
        
    };

    $scope.ChangeDrCrAmount = function (curLA) {
        var totalDr = 0, totalCr = 0;
        angular.forEach($scope.beData.LedgerAllocationColl, function (led) {
            led.DrAmount = ToRound(led.DrAmount);
            led.CrAmount = ToRound(led.CrAmount);

            totalCr += led.CrAmount;
            totalDr += led.DrAmount;

            if (led.LedgerDetails) {
                if (led.LedgerDetails.BudgetAmt > 0) {
                    if (led.DrAmount > 0) {
                        var clAmt = led.DrAmount + led.LedgerDetails.Closing;
                        if (clAmt > led.LedgerDetails.BudgetAmt)
                            led.IsNegativeBudget = true;
                        else
                            led.IsNegativeBudget = false;
                    }
                }                
            }
        });

        $scope.beData.DrAmount = ToRound(totalDr);
        $scope.beData.CrAmount = ToRound(totalCr);

        GlobalServices.getLAUDFFormula(curLA, $scope.beData.LedgerAllocationColl);
    };

    $scope.ClearDataForEdit = function () {
        $scope.PendingReceiptColl = [];
        $scope.loadingstatus = "stop";
        $scope.CurLedgerAllocation = {};
        $('input[type=file]').val('');
    }

    $scope.ClearData = function () {
        var sV = $scope.SelectedVoucher;
        var sC = $scope.SelectedCostClass;

        
        $scope.SelectedVoucher = null;
        $scope.SelectedCostClass = null;

        
        $scope.ClearDataForEdit();

        $scope.beData =
        {
            UniqueId: GlobalServices.getUniqueId(),
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

        $timeout(function () {
            $scope.getVoucherNo();
        })

     
    };

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
                
                $timeout(function () {
                    $scope.SearchDataColl = res.data.Data;
                    $scope.paginationOptions.TotalRows = res.data.TotalCount;
                    $('#searVoucherRightBtn').modal('show');
                });
                

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

    $scope.RemoveAttachment = function (fId, ind) {

        if (fId == 1) {
            $scope.beData.DocumentColl.splice(ind, 1);
        }
        else if (fId == 2) {
            $scope.beData.AttechFiles.splice(ind, 1);
        }

    }

    $scope.ChangeVatTDSParty = function (led) {
        if (led.VTLedgerDetails) {
            led.PartyName = led.VTLedgerDetails.Name;
            led.PANVat = led.VTLedgerDetails.PanVat;
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

    $scope.ChangeTDSWiseAmt = function (colName) {
        if (colName == 'totalPaidAmt') {
            var totalAmt = $scope.CurLedgerAllocation.TotalTDSAmt;
            $scope.CurLedgerAllocation.PendingTDSColl.forEach(function (br) {

                if (totalAmt >= br.ClosingAmt) {
                    br.DrAmount = br.ClosingAmt;
                    totalAmt -= br.ClosingAmt;
                } else if (totalAmt < br.ClosingAmt) {
                    br.DrAmount = totalAmt;
                    totalAmt = 0;
                }

            });

            $scope.CurLedgerAllocation.DrAmount = $scope.CurLedgerAllocation.TotalTDSAmt;
        }
        else if (colName == 'paidAmt') {
            $scope.CurLedgerAllocation.TotalTDSAmt = 0;
            var amt = 0;
            angular.forEach($scope.CurLedgerAllocation.PendingTDSColl, function (br) {
                if (br.DrAmount > 0) {
                    amt += br.DrAmount;
                }
            });

            $scope.CurLedgerAllocation.TotalTDSAmt = amt;

            $scope.CurLedgerAllocation.DrAmount = amt;

        }

        $scope.ChangeCrAmount();

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

    $scope.ImportItemDataExcel = function () {

        if (!$scope.ItemFilePath || !$scope.SelectedSheet)
            return;

        if (!$scope.PropertiesColl || $scope.PropertiesColl.length == 0)
            return;

        var para = {
            path: $scope.ItemFilePath,
            table: $scope.SelectedSheet
        };

        $scope.loadingstatus = "running";
        showPleaseWait();

        $http({
            method: "post",
            url: base_url + "Setup/Security/FinalImportItemData?path=" + para.path + "&table=" + para.table,
            data: JSON.stringify($scope.PropertiesColl),
            dataType: "json"
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";

            if (res.data.ResponseId && res.data.ResponseId.length > 0) {
                Swal.fire("Product Missing " + res.data.ResponseId);
            }


            if (res.data.IsSuccess) {
                $('#AddNewExcel').modal('hide');

                $scope.beData.ItemDetailsColl = [];
                angular.forEach(res.data.DataColl, function (fd) {

                    var refItem = {
                        IsImport: true,
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
                        GodownId: (fd.GodownId && fd.GodownId > 0 ? fd.GodownId : $scope.beData.GodownId),
                        Narration: fd.Narration,
                        RefQty: fd.ActualQty,
                        ReceivedNoteItemAllocationId: null,
                        OrderItemAllocationId: null,
                        RegdNo: fd.RegdNo ? fd.RegdNo : '',
                        EngineNo: fd.EngineNo ? fd.EngineNo : '',
                        ChassisNo: fd.ChassisNo ? fd.ChassisNo : '',
                        Model: fd.Model ? fd.Model : '',
                        CodeNo: fd.CodeNo ? fd.CodeNo : '',
                        Color: fd.Color ? fd.Color : '',
                        KeyNo: fd.KeyNo ? fd.KeyNo : '',
                        MFGYear: fd.MFGYear ? fd.MFGYear : 0,
                        Type: fd.Type ? fd.Type : '',
                        ProductLedgerId: fd.ProductLedgerId,
                        LedgerId: fd.ProductLedgerId,
                    };
                    $scope.beData.ItemDetailsColl.push(refItem);
                });

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
                        ledAllocation.CanEditRate = ac.CanEdit;
                        ledAllocation.LedgerId = ac.LedgerId;
                        ledAllocation.Rate = ac.Rate * mul;
                        ledAllocation.Amount = ac.Amount * mul;
                        ledAllocation.AutoCharge = true;
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

            } else {
                Swal.fire(res.data.ResponseMSG);
            }


        }, function (errormessage) {
            $scope.loadingstatus = 'stop';
            alert('Unable to Store data. pls try again.' + errormessage.responseText);
        });

    };


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
                    $scope.MulData.Title = 'Journal';
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

    $scope.PasteMData = function (colName, ind) {
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
                            $scope.beData.LedgerAllocationColl = [];
                            dataColl.forEach(function (dc) {
                                $scope.beData.LedgerAllocationColl.push(
                                    {
                                        DrCr: dc.DrCr,
                                        LedgerId: dc.LedgerId,
                                        AgentId: 0,
                                        LFNO: '',
                                        Narration: dc.Narration,
                                        DrAmount: dc.DrAmount,
                                        CrAmount: dc.CrAmount,
                                        ForBranchId: null
                                    }
                                );

                                $scope.ChangeDrCrAmount($scope.beData.LedgerAllocationColl[$scope.beData.LedgerAllocationColl.length - 1]);
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


    $scope.CopyData = null;
    $scope.CopyTran = function () {
        $scope.CopyData = null;
        if ($scope.beData) {
            if ($scope.beData.TranId > 0) {
                $scope.CopyData = $scope.GetData();
                $scope.CopyData.TranId = 0;
            }
        }
    }
    $scope.PasteTran = function () {
        if ($scope.CopyData) {
            $scope.ClearData();
            $timeout(function () {

                if ($scope.SelectedVoucher) {

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
                                    $scope.CopyData.AutoManualNo = vDet.AutoManualNo;
                                    $scope.CopyData.AutoVoucherNo = vDet.AutoVoucherNo;

                                    $scope.SetData($scope.CopyData);
                                    $scope.CopyData = null;

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

});