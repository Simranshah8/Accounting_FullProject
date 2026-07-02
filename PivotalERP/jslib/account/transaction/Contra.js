app.controller('ContraController', function ($scope, $http, $timeout, $filter, $compile, GlobalServices, $document) {
    $scope.Title = 'Contra';
    var glSrv = GlobalServices;
    LoadData();


    function ToRound(val) {
        val = isEmptyAmt(val);
        return ($filter('number')(val, $scope.SelectedVoucher.NoOfDecimalPlaces)).parseDBL();
    }

    $scope.sideBarData = [];
    
    $scope.lastTranId = 0;
    function LoadData() {

 $scope.DefaultKeyValues_JSON = null;
        if (DefaultKeyValues && DefaultKeyValues.length > 0) {
            $scope.DefaultKeyValues_JSON = JSON.parse(decodeURIComponent(DefaultKeyValues));           
        }
		
        $scope.ButtonED = {};
        GlobalServices.getButtonDisabled(EntityId).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.ButtonED = res.data.Data;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        $scope.ProjectColl = [];
        GlobalServices.getProject().then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.ProjectColl = res.data.Data;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

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

        $scope.HideShow = {
            VoucherType: false,
            CostClass: false,
            AutoVoucherNo: false,
            Agent: true,
            Currency: true,
            RefNo: true,
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
                LedgerId: 0,
                AgentId: 0,
                LFNO: '',
                Narration: '',
                DrAmount: 0,
                CrAmount: 0,
                Attributes: '',
                ForBranchId: null
            }
        );
        $('.hideSideBar').on('focus', function (e) {
            $('#sidebarzz').removeClass();
            $('#sidebarzz').addClass('order-last float-right active');
        })

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


                                if ($scope.SelectedVoucher.LedgerId > 0)
                                    $scope.beData.CashBankLedgerId = $scope.SelectedVoucher.LedgerId;

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
            if (!selectItem.LedgerId || selectItem.LedgerId == null || selectItem.LedgerId == 0 || selectItem.Amount == 0)
                return;

        }

        if ($scope.beData.LedgerAllocationColl) {
            if ($scope.beData.LedgerAllocationColl.length > ind + 1) {
                $scope.beData.LedgerAllocationColl.splice(ind + 1, 0, {
                    LedgerId: 0,
                    AgentId: 0,
                    LFNO: '',
                    Narration: '',
                    DrAmount: 0,
                    CrAmount: 0,
                    ForBranchId: null,
                    UDFFeildsColl: udfColl,
                })
            } else {
                $scope.beData.LedgerAllocationColl.push({
                    LedgerId: 0,
                    AgentId: 0,
                    LFNO: '',
                    Narration: '',
                    DrAmount: 0,
                    CrAmount: 0,
                    ForBranchId: null,
                    UDFFeildsColl: udfColl,
                })
            }
        }

    }

    $scope.delRowLedgerAllocation = function (ind) {
        if ($scope.beData.LedgerAllocationColl) {
            if ($scope.beData.LedgerAllocationColl.length > 1) {
                $scope.beData.LedgerAllocationColl.splice(ind, 1);
                $scope.ChangeCrAmount();
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

    $scope.ChangeCashBankLedger = function (ledDet) {
        $scope.CurLedgerAllocation = ledDet;
        $scope.sideBarData = ledDet.partySideBarData;
        ledDet.PendingChequeColl = [];
        $timeout(function () {

            if (ledDet) {
                ledDet.CurrentBal = 0;
                if (ledDet.CashBankLedgerId && ledDet.CashBankLedgerId > 0 && ledDet.LedgerDetails) {
                    ledDet.CurrentBal = ledDet.LedgerDetails.Closing;

                    if (ledDet.LedgerDetails.CostCentersAreApplied == true) {
                        if (!ledDet.CostCenterColl)
                            ledDet.CostCenterColl = [];

                        if (ledDet.CostCenterColl.length == 0) {
                            ledDet.CostCenterColl.push({
                                CostCenterId: null,
                                DrCr: 1,
                                DrAmount: 0,
                                CrAmount: 0
                            });
                        }
                        $('#frmCostCentersModel').modal('show');
                    } else
                        ledDet.CostCenterColl = [];
                }
            }
        });


        $timeout(function () {
            if (ledDet.LedgerDetails && (ledDet.LedgerDetails.IsTDS == true || ledDet.LedgerDetails.IsVat == true)) {
                if (!ledDet.TDSVatDetailColl)
                    ledDet.TDSVatDetailColl = [];

                if (ledDet.TDSVatDetailColl.length == 0) {
                    ledDet.TDSVatDetailColl.push({
                        SNO: 0,
                        BillNo: '',
                        Amount: 0,
                        Rate: 0,
                        Payment: 0,
                        BillDate_TMP: new Date(),
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
                        ChequeId: null,
                        ChequeNo: '',
                        AccountNo: '',
                        Remarks: '',
                        CheckType: 0,
                        ChequeDate_TMP: new Date()
                    };
                }

                $('#chequedetailRec').modal('show');



            } else
                ledDet.ItemDetailsCOll = [];
        });

        $timeout(function () {
            if (ledDet.LedgerDetails && ledDet.LedgerDetails.UDFColl && ledDet.LedgerDetails.UDFColl.length > 0) {
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
                        angular.forEach(ledUdfColl, function (udd) {
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
    $scope.CurLedgerAllocation = {};
    $scope.ChangeParticularLedger = function (ledDet) {
        $scope.CurLedgerAllocation = ledDet;
        $scope.sideBarData = ledDet.partySideBarData;
        ledDet.PendingChequeColl = [];

        if (ledDet) {
            ledDet.CurrentBal = 0;
            if (ledDet.LedgerId && ledDet.LedgerId > 0 && ledDet.LedgerDetails) {
                ledDet.CurrentBal = ledDet.LedgerDetails.Closing;

                $timeout(function () {
                    if (ledDet.LedgerDetails && ledDet.LedgerDetails.CostCentersAreApplied == true) {
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
                                Amount: 0,
                                Rate: 0,
                                Payment: 0
                            });
                        }
                        $('#tds').modal('show');
                    } else
                        ledDet.ItemDetailsCOll = [];
                });

                $timeout(function () {
                    if (ledDet.LedgerDetails && ledDet.LedgerDetails.ActiveChequeDetails == true) {

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

                                $('#chequedetail').modal('show');

                            } else {
                                Swal.fire(res.data.ResponseMSG);
                            }
                        }, function (reason) {
                            Swal.fire('Failed' + reason);
                        });



                    } else
                        ledDet.ItemDetailsCOll = [];
                });


                $timeout(function () {
                    if (ledDet.LedgerDetails && ledDet.LedgerDetails.UDFColl && ledDet.LedgerDetails.UDFColl.length > 0) {
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
                                angular.forEach(ledUdfColl, function (udd) {
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

        ledDet.CurrentBal = 0;
        if (ledDet.PartyLedger && ledDet.LedgerId && ledDet.LedgerId > 0)
            ledDet.CurrentBal = ledDet.PartyLedger.Closing;

        console.log(ledDet);
    }

    $scope.SaveContra = function () {

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
                            url: base_url + "Account/Transaction/SaveUpdateContra",
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
                        url: base_url + "Account/Transaction/GetContraById",
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

        if ($scope.beData.CashBankLedgerId) {
            if ($scope.beData.CashBankLedgerId == null || $scope.beData.CashBankLedgerId == 0) {
                result = false;
                Swal.fire('Please ! Select Valid Cash/Bank Name');
            }
        } else {
            result = false;
            Swal.fire('Please ! Select Valid Cash/Bank Name');
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

        var tmpContra = {
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
            tmpContra.Attributes = JSON.stringify(voucherUDFFields);
            tmpContra.UDFKeyVal = JSON.stringify(voucherKeyVal);
        } else {
            tmpContra.Attributes = "";
            tmpContra.UDFKeyVal = "";
        }

        var drLedAllocation = {
            DrCr: 1,
            LedgerId: $scope.beData.CashBankLedgerId,
            AgentId: 0,
            LFNO: '',
            Narration: '',
            DrAmount: mx($scope.beData.LedgerAllocationColl).sum(p1 => p1.CrAmount),
            CrAmount: 0,
            ForBranchId: null,
            Dimension1: null,
            Dimension2: null,
            Dimension3: null,
            Dimension4: null,
            Dimension5: null,
            CostCenterColl: [],
            ItemDetailsCOll: [],
            TDSVatDetailColl: [],
            PendingTDSColl: [],
            CheckDetails: {}
        };
        if ($scope.beData.CheckDetails && $scope.beData.CheckDetails.ChequeDateDet) {
            drLedAllocation.CheckDetails.ChequeId = $scope.beData.CheckDetails.ChequeId;
            drLedAllocation.CheckDetails.ChequeNo = $scope.beData.CheckDetails.ChequeNo;
            drLedAllocation.CheckDetails.AccountNo = $scope.beData.CheckDetails.AccountNo;
            drLedAllocation.CheckDetails.Remarks = $scope.beData.CheckDetails.Remarks;
            drLedAllocation.CheckDetails.CheckType = $scope.beData.CheckDetails.CheckType;
            drLedAllocation.CheckDetails.PartyName = $scope.beData.CheckDetails.PartyName;
            drLedAllocation.CheckDetails.ChequeDate = $filter('date')(new Date($scope.beData.CheckDetails.ChequeDateDet.dateAD), 'yyyy-MM-dd');
        }

        if ($scope.beData.CostCenterColl) {
            angular.forEach($scope.beData.CostCenterColl, function (cc) {
                if (cc.CostCenterId && cc.CostCenterId > 0 && cc.DrAmount != 0) {
                    var ccAllocation = {
                        CostCategoriesId: (cc.CostCenterDetails ? cc.CostCenterDetails.CostCategoryId : cc.CostCategoriesId),
                        CostCenterId: cc.CostCenterId,
                        DrAmount: cc.CrAmount,
                        CrAmount: cc.DrAmount,
                        Narration: '',
                        DrCr: crLedAllocation.DrCr,
                        DepartmentId: cc.DepartmentId,
                        ProductBrandId: cc.ProductBrandId,
                        AreaId: cc.AreaId
                    };
                    drLedAllocation.CostCenterColl.push(ccAllocation);
                }
            });
        }

        var itemKeyVal_LW_M = {};
        if ($scope.beData.LedgerUDFColl && $scope.beData.LedgerUDFColl.length > 0) {
            angular.forEach($scope.beData.LedgerUDFColl, function (udf) {
                if (udf.NameId) {
                    if (udf.FieldType == 2 || udf.FieldType == 22 || udf.FieldType == 23) {
                        itemKeyVal_LW_M[udf.NameId] = udf.UDFValueDet ? udf.UDFValueDet.dateBS : '';
                    }
                    else if (udf.FieldType == 3 && udf.Source && udf.Source.length > 0) {
                        itemKeyVal_LW_M[udf.NameId] = udf.UDFValueDet ? udf.UDFValueDet.text : ''
                    }
                    else {
                        itemKeyVal_LW_M[udf.NameId] = udf.UDFValue;
                    }
                }

            });
            itemKeyVal_LW_M = JSON.stringify(itemKeyVal_LW_M);
        } else {
            itemKeyVal_LW_M = '';
        }
        drLedAllocation.LedgerAttributes = itemKeyVal_LW_M;

        tmpContra.LedgerAllocationColl.push(drLedAllocation);

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
                    DrCr: 2,
                    LedgerId: ledA.LedgerId,
                    AgentId: ledA.AgentId,
                    LFNO: ledA.LFNO,
                    Narration: ledA.Narration,
                    DrAmount: 0,
                    CrAmount: ledA.CrAmount,
                    ForBranchId: null,
                    CostCenterColl: [],
                    Dimension1: ledA.Dimension1,
                    Dimension2: ledA.Dimension2,
                    Dimension3: ledA.Dimension3,
                    Dimension4: ledA.Dimension4,
                    Dimension5: ledA.Dimension5,
                    SubLedgerId: ledA.SubLedgerId,
                    ItemDetailsCOll: [],
                    TDSVatDetailColl: [],
                    CheckDetails: {},
                    PendingTDSColl: [],
                    BillRefColl: [],
                };

                if (ledA.CostCenterColl) {
                    angular.forEach(ledA.CostCenterColl, function (cc) {
                        if (cc.CostCenterId && cc.CostCenterId > 0 && cc.DrAmount != 0) {
                            var ccAllocation = {
                                CostCategoriesId: (cc.CostCenterDetails ? cc.CostCenterDetails.CostCategoryId : cc.CostCategoriesId),
                                CostCenterId: cc.CostCenterId,
                                DrAmount: cc.DrAmount,
                                CrAmount: cc.CrAmount,
                                Narration: '',
                                DrCr: 1,
                                DepartmentId: cc.DepartmentId,
                                ProductBrandId: cc.ProductBrandId,
                                AreaId: cc.AreaId
                            };
                            crLedAllocation.CostCenterColl.push(ccAllocation);
                        }
                    });
                }

                if (ledA.CheckDetails && ledA.CheckDetails.ChequeDateDet) {
                    crLedAllocation.CheckDetails.ChequeId = ledA.CheckDetails.ChequeId;
                    crLedAllocation.CheckDetails.ChequeNo = ledA.CheckDetails.ChequeNo;
                    crLedAllocation.CheckDetails.AccountNo = ledA.CheckDetails.AccountNo;
                    crLedAllocation.CheckDetails.Remarks = ledA.CheckDetails.Remarks;
                    crLedAllocation.CheckDetails.CheckType = ledA.CheckDetails.CheckType;
                    crLedAllocation.CheckDetails.PartyName = ledA.CheckDetails.PartyName;
                    crLedAllocation.CheckDetails.ChequeDate = $filter('date')(new Date(ledA.CheckDetails.ChequeDateDet.dateAD), 'yyyy-MM-dd');
                }
                tmpContra.LedgerAllocationColl.push(crLedAllocation);
            }
        });


        return tmpContra;
    };

    $scope.SetData = function (tran) {

        $scope.beData.VoucherDateDet = null;
        $scope.beData.VoucherDate = new Date(tran.VoucherDate);
        $scope.beData.VoucherDate_TMP = new Date(tran.VoucherDate);
        $scope.beData.VoucherDateAD_TMP = new Date(tran.VoucherDate);
        $scope.beData.VoucherDateDet = GlobalServices.getDateDet(tran.VoucherDate);
        setTimeout(1000);
		 
        //$timeout(function () {
        //    if ($scope.SelectedVoucher.DateStyle == 3 || $scope.SelectedVoucher.DateStyle == 4) {
        //        if ($scope.beData.VoucherDateDet) {
        //            $scope.beData.VoucherDateAD_TMP = new Date($scope.beData.VoucherDateDet.dateAD);
        //        }
        //        else if ($scope.beData.VoucherDate_TMP) {
        //            $scope.beData.VoucherDateAD_TMP = new Date($scope.beData.VoucherDate_TMP);
        //        }
        //    }
        //});

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


        var drLedAllocation = mx(tran.LedgerAllocationColl).firstOrDefault(p1 => p1.DrCr == 1);
        if (drLedAllocation) {
            $scope.beData.CashBankLedgerId = drLedAllocation.LedgerId;

            if (drLedAllocation.CheckDetails && drLedAllocation.CheckDetails.ChequeDate) {
                drLedAllocation.CheckDetails.ChequeDate_TMP = new Date(drLedAllocation.CheckDetails.ChequeDate);
                $scope.beData.CheckDetails = drLedAllocation.CheckDetails;
            }

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

            if (ledAll.DrCr == 2)
                $scope.beData.LedgerAllocationColl.push(ledAll);

            angular.forEach(ledAll.CostCenterColl, function (cc) {
                if (cc.DrAmount > 0)
                    cc.Amount = cc.DrAmount;
                else if (cc.CrAmount > 0)
                    cc.Amount = cc.CrAmount;
            });


            if (ledAll.CheckDetails && ledAll.CheckDetails.ChequeDate) {
                ledAll.CheckDetails.ChequeDate_TMP = new Date(ledAll.CheckDetails.ChequeDate);              
            }
        });

        $scope.ChangeCrAmount();
    };

    $scope.ChangeCrAmount = function (curLA) {
        var total = 0;
        angular.forEach($scope.beData.LedgerAllocationColl, function (led) {
            led.DrAmount = ToRound(led.DrAmount);
            led.CrAmount = ToRound(led.CrAmount);

            total += led.CrAmount;
        });

        $scope.beData.Amount = ToRound( total);

        GlobalServices.getLAUDFFormula(curLA, $scope.beData.LedgerAllocationColl);
    };

    $scope.ClearDataForEdit = function () {
        
        $scope.loadingstatus = "stop";
        $scope.CurLedgerAllocation = {};
        $('input[type=file]').val('');
    }

    $scope.ClearData = function () {

        $scope.ClearDataForEdit();

        var sV = $scope.SelectedVoucher;
        var sC = $scope.SelectedCostClass;

        $scope.SelectedVoucher = null;
        $scope.SelectedCostClass = null;
         
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
    $document.bind('keydown', function (event)
    {
        if (event.ctrlKey && event.key === 's') { // Ctrl + S
            event.preventDefault(); // Prevent browser save action
            $scope.$apply($scope.SaveContra);
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