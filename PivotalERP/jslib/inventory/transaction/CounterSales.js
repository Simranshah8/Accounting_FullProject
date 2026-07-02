
app.controller('CounterSalesController', function ($scope, $http, $timeout, $filter, $compile, GlobalServices, $document) {
    $scope.Title = 'Sales Invoice';
    var glSrv = GlobalServices;
    LoadData();
     
    $scope.IsTouchSupport = false;


    window.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
            $('#frmSalesInvoiceDetailsModel').modal('hide');
        }
    })

    // https://stackoverflow.com/a/38326762/466693
    //document.addEventListener('paste', function (event) {
    //    window.clipText = event.clipboardData.getData('text/plain');
    //    render_table(clipText);
    //});

    //function render_table(cb) {        
    //    cb.split("\n").forEach(function (line) {
    //        if (line) {

    //        }
    //    });        
    //}

    $scope.sideBarData = [];

    $scope.lastTranId = 0;

    //hotkeys.add({
    //    combo: 'alt+s',
    //    description: 'This one goes to 11',
    //    callback: function () {
    //        $scope.SaveSalesInvoice();
    //    }
    //});

    var ws;

    function connectPrintServer() {
        // create a new websocket and connect     

        var websocket = new WebSocketEx('ws://127.0.0.1:12321', '', function () {
            //messageBoard.append('* Connection open<br/>');
            ws = websocket;
            // ws.binaryType = "arraybuffer";
            // ws.send('{ "MSG":"Test Server" }');
        }, function (evt) {
            //messageBoard.append('* Connection closed<br/>');
            console.log('Unable To Connect With Print Server. Connection closed.');
            //alert('Unable To Connect With Print Server. Connection closed.');
        }, function (evt) {
            // On MSG Received
            console.log(evt);

        }, function (evt) {
            //On Error
            console.log(evt);

        });
    }
    $scope.PrintFile = function (filePath, fileData) {
        if (ws) {

            var beData = {
                passKey: "PrintDirect2020",
                FilePath: filePath,
                FileData: fileData
            };
            var str = JSON.stringify(beData);
            ws.send(str);
        }
    }

    function LoadData() {
        //connectPrintServer();
 //$scope.DefaultKeyValues_JSON = null;
 //       if (DefaultKeyValues && DefaultKeyValues.length > 0) {
 //           $scope.DefaultKeyValues_JSON = JSON.parse(decodeURIComponent(DefaultKeyValues));           
 //       }
		
        
        $scope.isToggled = true;
      
        $scope.QualtityColl = [99.99, 99.50, 91.60, 75.00, 58.30];
        $('.select2bs4').select2();
        $('.select2').select2();

        $scope.RefVoucherTypeColl = [{ id: 2, text: 'SalesOrder' }, { id: 1, text: 'DeliveryNote' }, { id: 3, text: 'SalesQuotation' }, { id: 4, text: 'SalesAllotment' }];
        //$("#txtPatientId").keyup(function (event) {
        //    if (event.keyCode === 13) {
        //        $scope.GetPatientById();
        //    }
        //});

        //Buttone Enabled Disabled

        $scope.confirmMSG = GlobalServices.getConfirmMSG();
        $scope.perPageColl = GlobalServices.getPerPageList();
        $scope.currentPages = {
            FixedProduct: 1,
            PendingOrder: 1,
        };

        $scope.searchData = {
            FixedProduct: '',
            PendingOrder: '',
        };

        $scope.perPage = {
            FixedProduct: GlobalServices.getPerPageRow(),
            PendingOrder: GlobalServices.getPerPageRow(),
        };

        //Addde by suresh on 26 Kartik starts
        $scope.SelectionColl = [{ id: 1, text: 'Product' }, { id: 2, text: 'BarCode' }];
        $scope.SelectOtion = 2;
        //Ends

        $scope.PaymentTermColl = [];
        $scope.PaymentTermColl_Bank = [];
        $scope.PaymentTermColl_Qry = [];
        GlobalServices.getPaymentTerms().then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                var PaymentTermColl = res.data.Data;
                if (PaymentTermColl) {
                    angular.forEach(PaymentTermColl, function (pt) {
                        if (pt.IsCash == true && pt.LedgerId > 0) {

                            if (pt.PayType == 6) {
                                $scope.PaymentTermColl_Bank.push({
                                    Name: pt.Name,
                                    PaymentTermsId: pt.PaymentTermsId,
                                    LedgerId: pt.LedgerId,
                                    Amount: 0,
                                    Remarks: '',
                                    BranchId: pt.BranchId,
                                    BdId: pt.BDId,
                                    id: pt.id,
                                    text: pt.text,
                                });

                            } else {
                                $scope.PaymentTermColl.push({
                                    Name: pt.Name,
                                    PaymentTermsId: pt.PaymentTermsId,
                                    LedgerId: pt.LedgerId,
                                    Amount: 0,
                                    Remarks: '',
                                    BranchId: pt.BranchId,
                                    BdId: pt.BDId,
                                    id: pt.id,
                                    text: pt.text,
                                });
                            }

                        }
                    });

                    $scope.PaymentTermColl_Qry = mx(PaymentTermColl);
                }
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        $scope.RateTypeColl = [];
        $http({
            method: 'GET',
            url: base_url + "Inventory/Creation/GetAllSalesRateTypes",
            dataType: "json"
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                var dtColl = res.data.Data;
                angular.forEach(dtColl, function (dt) {
                    if (dt.IsActive == true)
                        $scope.RateTypeColl.push(dt);
                });
            }
        }, function (reason) {
            alert('Failed' + reason);
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

        $scope.searchData = {
            RefProduct: ''
        };

        //$scope.ButtonED = {};
        //GlobalServices.getButtonDisabled(EntityId).then(function (res) {
        //    if (res.data.IsSuccess && res.data.Data) {
        //        $scope.ButtonED = res.data.Data;
        //    }
        //}, function (reason) {
        //    Swal.fire('Failed' + reason);
        //});

        $scope.BOMColl = [];

        $scope.comDet = {};
        GlobalServices.getCompanyDet().then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.comDet = res.data.Data;
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
        $scope.RecVoucherTypeColl = [];
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
            ProductDescription: true,
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
            ActiveSummaryEntry: true,
            ActiveTender: true,
            ProductCompany: true
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
            ReceivedAmount: 0,
            ChangeAmt: 0,
            RefVoucherType: 1,
            ProductCompanyId: null,
            Attributes: '',
            UDFFeildsColl: [],
            PaymentTermColl: [],
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
                AmountDecimal: 2,
                UDFFeildsColl: []
            });
        $('.hideSideBar').on('focus', function (e) {
            $('#sidebarzz').removeClass();
            $('#sidebarzz').addClass('order-last float-right active');
        })

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


 //$scope.EPDet = {};
 //       $scope.EPColl = [];
 //       $scope.ItemFormula = {};
 //       GlobalServices.getEntityProperties(EntityId).then(function (res) {
 //           if (res.data.IsSuccess && res.data.Data) {
 //               $scope.EPColl = res.data.Data;
 //               angular.forEach($scope.EPColl, function (ep) {
 //                   $scope.EPDet[ep.Name] = ep;
 //                   //$scope.newProduct[ep.Name] = ep.DefaultValue;
 //               });

 //               if ($scope.EPDet) {
 //                   for (key in $scope.EPDet) {
 //                       if (key.startsWith("ItemAllocationColl") == true) {
 //                           var proName = key.replace("ItemAllocationColl.", "");

 //                           if ($scope.EPDet[key].Formula && $scope.EPDet[key].Formula.length>0)
 //                               $scope.ItemFormula[proName] = $scope.EPDet[key].Formula;
 //                       }
 //                   }
 //               }
 //           }
 //       }, function (reason) {
 //           Swal.fire('Failed' + reason);
 //       });
		
		
 //       if (VoucherType) {

 //           $http({
 //               method: 'GET',
 //               url: base_url + "Setup/Security/GetConfirmationMSG",
 //               dataType: "json"
 //           }).then(function (res) {
 //               if (res.data.IsSuccess && res.data.Data) {
 //                   $scope.confirmMSG = res.data.Data;
 //               } else {
 //                   Swal.fire(res.data.ResponseMSG);
 //               }

 //           }, function (reason) {
 //               Swal.fire('Failed' + reason);
 //           });


 //           $http({
 //               method: 'GET',
 //               url: base_url + "Inventory/Creation/GetUserWiseGodown",
 //               dataType: "json"
 //           }).then(function (res) {
 //               if (res.data.IsSuccess && res.data.Data) {
 //                   $scope.GodownColl = res.data.Data;
 //                   if ($scope.GodownColl.length == 1) {
 //                       $scope.beData.GodownId = $scope.GodownColl[0].GodownId;
 //                       $scope.HideShow.Godown = true;
 //                   } else {
 //                       $scope.HideShow.Godown = false;
 //                       $scope.beData.GodownId = null;
 //                   }
 //               } else {
 //                   Swal.fire(res.data.ResponseMSG);
 //               }

 //           }, function (reason) {
 //               Swal.fire('Failed' + reason);
 //           });

 //           $http({
 //               method: 'GET',
 //               url: base_url + "Account/Creation/GetVoucherMandetoryFields?voucherType=" + VoucherType,
 //               dataType: "json"
 //           }).then(function (res) {
 //               if (res.data.IsSuccess && res.data.Data) {
 //                   $scope.mandetoryFields = res.data.Data;
 //               } else
 //                   Swal.fire(res.data.ResponseMSG);
 //           }, function (reason) {
 //               Swal.fire('Failed' + reason);
 //           });

 //           $http({
 //               method: 'GET',
 //               url: base_url + "Account/Creation/GetVoucherWiseNarration?voucherType=" + VoucherType,
 //               dataType: "json"
 //           }).then(function (res) {
 //               if (res.data.IsSuccess && res.data.Data) {
 //                   $scope.NarrationList = res.data.Data;
 //               } else
 //                   Swal.fire(res.data.ResponseMSG);
 //           }, function (reason) {
 //               Swal.fire('Failed' + reason);
 //           });

 //           $http({
 //               method: 'GET',
 //               url: base_url + "Setup/Security/GetSalesFeatures",
 //               dataType: "json"
 //           }).then(function (res1) {
 //               if (res1.data.IsSuccess && res1.data.Data) {
 //                   $scope.SalesFeatures = res1.data.Data;

 //                   $timeout(function () {
 //                       $scope.$apply(function () {
 //                           if ($scope.SalesFeatures.ProductWiseSalesLedger == true)
 //                               $scope.HideShow.SalesLedger = true;
 //                           else
 //                               $scope.HideShow.SalesLedger = false;
 //                       });
 //                   });
 //               }
 //           }, function (reason) {
 //               Swal.fire('Failed' + reason);
 //           });


 //          var filterObjs_VoucherId = null;
 //           if ($scope.DefaultKeyValues_JSON) {
 //               try {
 //                   var findVoucherFilter = $scope.DefaultKeyValues_JSON["VoucherId"];
 //                   if (findVoucherFilter) {
 //                       filterObjs_VoucherId = JSON.parse(findVoucherFilter);
 //                   }
 //               } catch { }
 //           }

 //           $scope.DefaultBranch = null;
 //           GlobalServices.getDefaultBranch().then(function (dbres) {
 //               if (dbres.data.IsSuccess && dbres.data.Data) {
 //                   $scope.DefaultBranch = dbres.data.Data;
 //               }

 //               if ($scope.DefaultBranch) {
 //                   if (filterObjs_VoucherId == null) {
 //                       filterObjs_VoucherId = {};
 //                   }

 //                   filterObjs_VoucherId['BDId'] = $scope.DefaultBranch.BranchId;
 //               }

 //               var vt_Para = {
 //                   voucherType: VoucherType,
 //                   filterPara: filterObjs_VoucherId,
 //               };

 //               $http({
 //                   method: 'POST',
 //                   url: base_url + "Account/Creation/GetVoucherList",
 //                   dataType: "json",
 //                   data: JSON.stringify(vt_Para)
 //               }).then(function (res) {
 //                   if (res.data.IsSuccess && res.data.Data) {
 //                       $scope.VoucherTypeColl = res.data.Data;

 //                       $http({
 //                           method: 'GET',
 //                           url: base_url + "Account/Creation/GetCostClassForEntry",
 //                           dataType: "json"
 //                       }).then(function (res1) {
 //                           if (res1.data.IsSuccess && res1.data.Data) {
 //                               $scope.CostClassColl = res1.data.Data;

 //                               $timeout(function () {
 //                                   $scope.$apply(function () {
 //                                       if ($scope.VoucherTypeColl.length > 0) {
 //                                           $scope.SelectedVoucher = $scope.VoucherTypeColl[0];
 //                                           $scope.beData.VoucherId = $scope.SelectedVoucher.VoucherId;
 //                                       }

 //                                       if ($scope.CostClassColl.length > 0) {
 //                                           $scope.SelectedCostClass = $scope.CostClassColl[0];
 //                                           $scope.beData.CostClassId = $scope.SelectedCostClass.CostClassId;
 //                                       }

 //                                       if ($scope.VoucherTypeColl.length <= 1)
 //                                           $scope.HideShow.VoucherType = true;
 //                                       else
 //                                           $scope.HideShow.VoucherType = false;

 //                                       if ($scope.CostClassColl.length <= 1)
 //                                           $scope.HideShow.CostClass = true;
 //                                       else
 //                                           $scope.HideShow.CostClass = false;

 //                                       $scope.getVoucherNo();

 //                                   });
 //                               });


 //                           }
 //                       }, function (reason) {
 //                           Swal.fire('Failed' + reason);
 //                       });

 //                   }
 //               }, function (reason) {
 //                   Swal.fire('Failed' + reason);
 //               });


 //           }, function (reason) {
 //               Swal.fire('Failed to get default branch' + reason);
 //           });


 //           if (RecVoucherType) {
 //               $http({
 //                   method: 'GET',
 //                   url: base_url + "Account/Creation/GetVoucherList?voucherType=" + RecVoucherType,
 //                   dataType: "json"
 //               }).then(function (res) {
 //                   if (res.data.IsSuccess && res.data.Data) {
 //                       $scope.RecVoucherTypeColl = res.data.Data;
 //                   }
 //               }, function (reason) {
 //                   Swal.fire('Failed' + reason);
 //               });
 //           }

 //       }

        $scope.RefVoucherNoColl = [];
        $('#cboRefVoucherNo').select2();
        $('#cboRefVoucherNo').on("change", function (e) {
            var selectedData = $('#cboRefVoucherNo').select2('data');
            if (selectedData && selectedData.length > 0) {
                $scope.beData.RefTranIdColl = [];
                $scope.beData.RefAllotationIdColl = [];

                angular.forEach(selectedData, function (sd) {
                    $scope.beData.RefTranIdColl.push(parseInt(sd.id));
                });
                var refTranIdColl = mx($scope.beData.RefTranIdColl);
                var lstSelectedItem = null;
                angular.forEach($scope.RefItemAllocationColl, function (ri) {
                    if (refTranIdColl.contains(ri.TranId)) {
                        ri.IsSelected = true;
                        lstSelectedItem = ri;
                        $scope.beData.RefAllotationIdColl.push(ri.ItemAllocationId);
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


        try {

            $scope.IsTouchSupport = is_touch_enabled();
            console.log($scope.IsTouchSupport);
        } catch { }
    }

    $scope.ChangePaymentType = function (id) {
        var findCB = $scope.PaymentTermColl_Qry.firstOrDefault(p1 => p1.id == id);
        if (findCB) {
            if (findCB.LedgerId || findCB.LedgerId > 0) {
                $scope.beData.PartyLedgerId = findCB.LedgerId;
            }
        }
    }
    $scope.ChangeBuyerSelection = function () {

        if ($scope.beData.SalesInvoiceDetail.Buyes && $scope.beData.SalesInvoiceDetail.Buyes.length > 2) {
            var findP = $scope.CashPartyColl_Qry.firstOrDefault(p1 => p1.Buyes == $scope.beData.SalesInvoiceDetail.Buyes);
            if (findP) {
                $scope.beData.SalesInvoiceDetail.SalesTaxNo = findP.SalesTaxNo;
                $scope.beData.SalesInvoiceDetail.Address = findP.Address;
                $scope.beData.SalesInvoiceDetail.PhoneNo = findP.PhoneNo;
            }
        }
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
                    QtyDecimal: 2,
                    RateDecimal: 2,
                    AmountDecimal: 2,
                    AccessableValue: 0,
                    GodownId: $scope.beData.GodownId,
                    RateOf: 1,
                    LossRate: 0,
                    NetWeight: 0,
                    LossWeight: 0,
                    Makeing: 0,
                    Stone: 0,
                    FineRate: 0,
                    FineWeight: 0,
                    ProcessingRate: 0,
                    ProcessingWeight: 0,
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
                    AccessableValue: 0,
                    GodownId: $scope.beData.GodownId,
                    RateOf: 1,
                    LossRate: 0,
                    NetWeight: 0,
                    LossWeight: 0,
                    Makeing: 0,
                    Stone: 0,
                    FineRate: 0,
                    FineWeight: 0,
                    ProcessingRate: 0,
                    ProcessingWeight: 0,
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

        if ($scope.SelectedVoucher.IsAbbInvoice == true || $scope.SelectedVoucher.ActiveAdditionalCost == false)
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
                    AmountDecimal: 2,
                    AccessableValue: 0,
                    RateOf: 1,
                    LossRate: 0,
                    NetWeight: 0,
                    LossWeight: 0,
                    Makeing: 0,
                    Stone: 0,
                    FineRate: 0,
                    FineWeight: 0,
                    ProcessingRate: 0,
                    ProcessingWeight: 0,
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
                    AmountDecimal: 2,
                    AccessableValue: 0,
                    RateOf: 1,
                    LossRate: 0,
                    NetWeight: 0,
                    LossWeight: 0,
                    Makeing: 0,
                    Stone: 0,
                    FineRate: 0,
                    FineWeight: 0,
                    ProcessingRate: 0,
                    ProcessingWeight: 0,
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

        if (itemDet.ProductId == null || itemDet.ProductId == 0) {
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
            itemDet.LossRate = 0;
            itemDet.Makeing = 0;
            itemDet.Stone = 0;
            itemDet.NetWeight = 0;
            itemDet.LossWeight = 0;
            itemDet.BatchBalQty = 0;
            itemDet.TranUnitId = null;

            itemDet.FineRate = 0;
            itemDet.FineWeight = 0;
            itemDet.ProcessingRate = 0;
            itemDet.ProcessingWeight = 0;

            $scope.ChangeItemRowValue(itemDet, 'product');
        } else if (itemDet.productDetail) {

            itemDet.TranUnitId = itemDet.productDetail.SalesUnitId;
            itemDet.CanEditRate = itemDet.productDetail.CanEditRate;

            var refStockItem = false;
            if (itemDet.DeliveryNoteItemAllocationId > 0 || itemDet.OrderItemAllocationId > 0 || itemDet.DispatchSectionItemAllocationId > 0
                || itemDet.ReceivedNoteItemAllocationId > 0 || itemDet.ItemAllocationId > 0 || itemDet.DispatchSectionItemAllocationId > 0 || itemDet.ReceivedNoteItemAllocationId > 0 || itemDet.QuotationItemAllocationId > 0) {
                refStockItem = true;
            }

            if (refStockItem == false && itemDet.IsRefItem == true) {
                refStockItem = true;
            }

            if (isModify == false && refStockItem == false && itemDet.RowType != 'S') {
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

            if (itemDet.RowType == 'S')
                return;


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
            itemDet.BalanceQty = itemDet.productDetail.ClosingQty;

            if (itemDet.productDetail.IsFixedProduct == true) {
                if (!itemDet.FixedProductColl || itemDet.FixedProductColl.length == 0 || !itemDet.productDetail.FixedProductColl) {
                    $http({
                        method: 'GET',
                        url: base_url + "Inventory/Transaction/getDueFixedProductList?productId=" + itemDet.productDetail.ProductId,
                        dataType: "json"
                    }).then(function (res) {
                        if (res.data.IsSuccess && res.data.Data) {
                            itemDet.productDetail.FixedProductColl = res.data.Data;
                            itemDet.FixedProductColl = res.data.Data;

                            //if (itemDet.RefQty > 0) {
                            //    itemDet.FixedProductColl.push({
                            //        EngineNo: itemDet.EngineNo,
                            //        ChassissNo: itemDet.ChassissNo,
                            //        RegdNo: itemDet.RegdNo,
                            //        Model: itemDet.Model,
                            //        Type: itemDet.Type,
                            //        Color: itemDet.Color,
                            //        KeyNo: itemDet.KeyNo,
                            //        CodeNo: itemDet.CodeNo,
                            //        MFGYear: itemDet.MFGYear,
                            //        IsSelected:true,
                            //    });
                            //}
                            if (isModify || itemDet.RefQty > 0) {
                                itemDet.productDetail.FixedProductColl.push({
                                    EngineNo: itemDet.EngineNo,
                                    ChassissNo: itemDet.ChassissNo,
                                    RegdNo: itemDet.RegdNo,
                                    Model: itemDet.Model,
                                    Type: itemDet.Type,
                                    Color: itemDet.Color,
                                    KeyNo: itemDet.KeyNo,
                                    CodeNo: itemDet.CodeNo,
                                    MFGYear: itemDet.MFGYear,
                                    IsSelected: true,
                                });
                            }

                            angular.forEach(itemDet.FixedProductColl, function (fp) {
                                fp.Amount = itemDet.Rate;
                            });

                            if ($scope.SelectedVoucher.MultipleFixedProduct == true)
                                $('#mdlFixedProduct').modal('show');
                        }
                    }, function (reason) {
                        Swal.fire('Failed' + reason);
                    });
                } else {

                    if ($scope.SelectedVoucher.MultipleFixedProduct == true)
                        $('#mdlFixedProduct').modal('show');
                }
            }


            $scope.ChangeItemRowValue(itemDet, 'product');

            $timeout(function () {

                if ($scope.SelectedVoucher.Product.BatchNo == true) {

                    if (itemDet.Batch && itemDet.Batch.length > 0) {
                        var findB = mx(itemDet.productDetail.BatchWiseColl).firstOrDefault(p1 => p1.BatchNo == itemDet.Batch && p1.EngineNo == itemDet.EngineNo);
                        if (findB) {
                            findB.BalQty = findB.BalQty + itemDet.ActualQty;
                        } else {
                            var newBatch = {
                                BSNo: itemDet.SNo,
                                Batch: itemDet.Batch,
                                BatchNo: itemDet.Batch,
                                EXPDate: itemDet.EXPDate,
                                MFGDate: itemDet.MFGDate,
                                BatchBalQty: itemDet.ActualQty,
                                EngineNo: itemDet.EngineNo,
                                SalesRate: itemDet.SalesRate,
                                TradeRate: itemDet.TradeRate,
                                MRP: itemDet.MRP,
                            };
                            itemDet.productDetail.BatchWiseColl.push(newBatch);
                        }
                    }

                }

                if (itemDet.productDetail.BatchWiseColl && itemDet.productDetail.BatchWiseColl.length > 0) {

                    if (isModify == true) {
                        var findB = mx(itemDet.productDetail.BatchWiseColl).firstOrDefault(p1 => p1.BatchNo == itemDet.Batch && p1.EngineNo == itemDet.EngineNo);
                        if (findB) {
                            itemDet.SelectedBatch = findB;
                            $scope.ChangeBatch(itemDet, findB, (itemDet.SNo - 1));
                        }


                    } else {
                        $scope.ChangeBatch(itemDet, itemDet.productDetail.BatchWiseColl[0], 0);
                    }

                }
            });

            var itemC = mx($scope.beData.ItemDetailsColl).where(p1 => p1.RowType == 'P').count();
            if (ind == (itemC - 1))
                $scope.AddRowInTable(ind);

        }

    }

    $scope.ChangeEngineNo = function (itemDet) {
        if (itemDet.EngineNo && itemDet.EngineNo.length > 0 && itemDet.productDetail) {

            var findB = mx(itemDet.productDetail.FixedProductColl).firstOrDefault(p1 => p1.EngineNo == itemDet.EngineNo);
            if (findB) {
                itemDet.ChassisNo = findB.ChassisNo;
                itemDet.RegdNo = findB.RegdNo;
                itemDet.Model = findB.Model;
                itemDet.Color = findB.Color;
                itemDet.KeyNo = findB.KeyNo;
                itemDet.CodeNo = findB.CodeNo;
                itemDet.MFGYear = findB.MFGYear;
                itemDet.Type = findB.Type;
                itemDet.ActualQty = 1;
                itemDet.BilledQty = 1;
                if (findB.Rate || findB.Rate > 0)
                    itemDet.Rate = findB.Rate;
            }

        } else {
            itemDet.ChassisNo = '';
            itemDet.RegdNo = '';
            itemDet.Model = '';
            itemDet.Color = '';
            itemDet.KeyNo = '';
            itemDet.CodeNo = '';
            itemDet.MFGYear = 0;
            itemDet.Type = '';
            itemDet.ActualQty = 0;
            itemDet.BilledQty = 0;
        }

        $scope.RecalculateAdditioncalCost();
        $scope.CalculateTotalAndSubTotal();
    }

    $scope.ChangeBatch = function (itemDet, batDet, ind) {
        if (itemDet && batDet) {

            itemDet.BSNo = batDet.BSNo;
            itemDet.Batch = batDet.BatchNo;
            itemDet.EXPDate = batDet.EXPDate;
            itemDet.MFGDate = batDet.MFGDate;
            itemDet.BatchBalQty = batDet.BalQty;
            itemDet.EngineNo = batDet.EngineNo;

            itemDet.SalesRate = batDet.SalesRate;
            itemDet.TradeRate = batDet.TradeRate;
            itemDet.MRP = batDet.MRP;

            if (batDet.SalesRate > 0)
                itemDet.Rate = batDet.SalesRate;

            if (batDet.Attributes && batDet.Attributes.length > 0) {
                var uValColl = JSON.parse(batDet.Attributes);
                angular.forEach(itemDet.UDFFeildsColl, function (iuc) {
                    var uVal = uValColl[iuc.NameId];
                    iuc.UDFValue = (uVal ? uVal : iuc.UDFValue);
                });
            }

            if (itemDet.ItemAllocationId > 0) {

            } else {
                $timeout(function () {
                    var cboName = 'cboBatch' + ind;
                    $('#' + cboName).select2({
                        allowClear: true,
                        openOnEnter: true,
                        placeholder: '*select batch*',
                        width: '100%',
                    });
                }, 100);
            }



        } else {
            itemDet.EXPDate = null;
            itemDet.MFGDate = null;
            itemDet.BatchBalQty = 0;
            itemDet.EngineNo = '';
            itemDet.BSNo = 0;

            itemDet.SalesRate = 0;
            itemDet.TradeRate = 0;
            itemDet.MRP = 0;
        }

        $scope.RecalculateAdditioncalCost();
        $scope.CalculateTotalAndSubTotal();
    }

    $scope.AditionalCostSelectionChange = function (itemDet, ind) {

        $timeout(function () {
            $scope.sideBarData = itemDet.costSideBarData;

            if (itemDet.LedgerId == null || itemDet.LedgerId == 0) {
                itemDet.Rate = 0;
                itemDet.Amount = 0;
                itemDet.AccessableValue = 0;
            }
            else if (itemDet.LedgerId > 0 && (itemDet.costLedgerDetail == null || itemDet.costLedgerDetail === undefined)) {
                $scope.RefreshRowData(itemDet, ind);
            }
            else if (itemDet.costLedgerDetail) {
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

    $scope.PartySelectionChangeDet = function (partyDet) {
        if (partyDet.BuyesId > 0) {
            if (partyDet.PartyLedger) {
                partyDet.Buyes = partyDet.PartyLedger.Name;
                partyDet.Address = partyDet.PartyLedger.Address;
                partyDet.SalesTaxNo = partyDet.PartyLedger.PanVat;
                partyDet.PhoneNo = partyDet.PartyLedger.MobileNo1;
            }
        }
        console.log(partyDet);
    }
    $scope.lastPartyLedgerId = null;

    $scope.PartySelectionChange = function (partyDet) {
        var isModify = $scope.beData.TranId > 0 ? true : false;
        $scope.sideBarData = partyDet.partySideBarData;

        if (partyDet.PartyLedgerId && partyDet.PartyLedgerId > 0) {
            if (partyDet.PartyLedger) {
                if ($scope.lastPartyLedgerId != partyDet.PartyLedgerId && isModify == false) {

                    var haveRefItem = false;
                    angular.forEach($scope.beData.ItemDetailsColl, function (idd) {
                        if (idd.RowType == 'P') {
                            if (idd.OrderItemAllocationId > 0 || idd.DeliveryNoteItemAllocationId > 0 || idd.QuotationItemAllocationId > 0 || idd.DispatchOrderItemAllocationId > 0 || idd.DispatchSectionItemAllocationId > 0) {
                                haveRefItem = true;
                            }
                        }
                    });

                    if (haveRefItem == true)
                        $scope.ClearItemDetails();


                    $scope.beData.RefAllotationIdColl = [];
                    $scope.RefItemAllocationColl = [];
                    $scope.RefAditionalCostColl = [];

                    if ($scope.comDet.Maintain != 3) {

                        partyDet.SalesInvoiceDetail = {};

                        if (isModify == false && $scope.lastPartyLedgerId != partyDet.PartyLedgerId)
                            partyDet.SalesInvoiceDetail.TermsOfPayment = partyDet.PartyLedger.PaymentType;
                    }

                    if (partyDet.PartyLedger.BillToColl && partyDet.PartyLedger.BillToColl.length > 0)
                        partyDet.SalesInvoiceDetail.BillToId = partyDet.PartyLedger.BillToColl[0].Id;

                    if (partyDet.PartyLedger.ShipToColl && partyDet.PartyLedger.ShipToColl.length > 0)
                        partyDet.SalesInvoiceDetail.ShipToId = partyDet.PartyLedger.ShipToColl[0].Id;

                    $scope.ChangeBillAddress();
                    $scope.ChangeShipAddress();

                    if (isModify == false)
                        partyDet.SalesInvoiceDetail.CreditDays = partyDet.PartyLedger.CreditLimitDays;

                    if ($scope.comDet.Maintain == 3) {

                        var isCash = false;
                        var pt = mx($scope.PaymentTermColl_Qry).firstOrDefault(p1 => p1.id == $scope.beData.SalesInvoiceDetail.PaymentTermsId);
                        if (pt)
                            isCash = pt.IsCash;

                        if (isCash == false) {
                            partyDet.SalesInvoiceDetail.Buyes = partyDet.PartyLedger.Name;
                            partyDet.SalesInvoiceDetail.Address = partyDet.PartyLedger.Address;
                            partyDet.SalesInvoiceDetail.SalesTaxNo = partyDet.PartyLedger.PanVat;
                            partyDet.SalesInvoiceDetail.PhoneNo = partyDet.PartyLedger.MobileNo1;
                        } else {
                            if (!partyDet.SalesInvoiceDetail.Buyes)
                                partyDet.SalesInvoiceDetail.Buyes = partyDet.PartyLedger.Name;

                            if (!partyDet.SalesInvoiceDetail.Address)
                                partyDet.SalesInvoiceDetail.Address = partyDet.PartyLedger.Address;

                            if (!partyDet.SalesInvoiceDetail.SalesTaxNo)
                                partyDet.SalesInvoiceDetail.SalesTaxNo = partyDet.PartyLedger.PanVat;

                            if (!partyDet.SalesInvoiceDetail.PhoneNo)
                                partyDet.SalesInvoiceDetail.PhoneNo = partyDet.PartyLedger.MobileNo1;
                        }



                    } else {
                        partyDet.SalesInvoiceDetail.Buyes = partyDet.PartyLedger.Name;
                        partyDet.SalesInvoiceDetail.Address = partyDet.PartyLedger.Address;
                        partyDet.SalesInvoiceDetail.SalesTaxNo = partyDet.PartyLedger.PanVat;
                        partyDet.SalesInvoiceDetail.PhoneNo = partyDet.PartyLedger.MobileNo1;
                    }


                    partyDet.SalesInvoiceDetail.BuyesId = null;

                    if ($scope.SelectedVoucher.CanChangeLedgerAndAgent == true) {
                        $scope.beData.AgentId = partyDet.PartyLedger.AgentId;
                    }

                    $scope.lastPartyLedgerId = partyDet.PartyLedgerId;
                }

            }


            if ($scope.SelectedVoucher.ActivePartyDetails == true && $scope.comDet.Maintain != 3) {
                $scope.RefVoucherChange($scope.beData.RefVoucherType);
                $('#frmSalesInvoiceDetailsModel').modal('show');
            }


        } else {

            $scope.lastPartyLedgerId = null;
            $scope.search = "";
            $scope.RefVoucherNoColl = [];
            $scope.RefItemAllocationColl = [];

            if ($scope.comDet.Maintain != 3)
                partyDet.SalesInvoiceDetail = {};

            //partyDet.ItemDetailsColl = [];
            //$scope.AddRowInItemDetails(0);
            $scope.RecalculateAdditioncalCost();
            $scope.CalculateTotalAndSubTotal();
            $('#frmSalesInvoiceDetailsModel').modal('hide');
        }
    };
    $scope.ChangeBillAddress = function () {

        if ($scope.beData.PartyLedger.BillToColl) {
            var find = mx($scope.beData.PartyLedger.BillToColl).firstOrDefault(p1 => p1.Id == $scope.beData.SalesInvoiceDetail.BillToId);
            if (find) {
                $scope.beData.SalesInvoiceDetail.BillToAddress = find.ConcatAddress;
            }
        }
    }
    $scope.ChangeShipAddress = function () {
        if ($scope.beData.PartyLedger.ShipToColl) {
            var find = mx($scope.beData.PartyLedger.ShipToColl).firstOrDefault(p1 => p1.Id == $scope.beData.SalesInvoiceDetail.ShipToId);
            if (find) {
                $scope.beData.SalesInvoiceDetail.ShipToAddress = find.ConcatAddress;
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

    $scope.IsRefPartyDet = false;
    $scope.getRefVoucherPartyDetails = function (refItem) {

        if ($scope.beData.RefVoucherType && refItem && refItem.IsSelected == true) {

            $scope.loadingstatus = "running";
            showPleaseWait();

            $scope.RefAditionalCostColl = [];

            //$scope.RefVoucherTypeColl = [{ id: 2, text: 'SalesOrder' }, { id: 1, text: 'DeliveryNote' }, { id: 3, text: 'SalesQuotation' },];
            var vType = 12;

            if ($scope.beData.RefVoucherType == 1)
                vType = 12;
            else if ($scope.beData.RefVoucherType == 2)
                vType = 13;
            else if ($scope.beData.RefVoucherType == 3)
                vType = 11;

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

                    if (tranDet && tranDet.UDFKeyVal && tranDet.UDFKeyVal.length > 0) {
                        tranDet.UDFKeyVal = JSON.parse(tranDet.UDFKeyVal);
                        angular.forEach($scope.beData.UDFFeildsColl, function (uf) {
                            var fUVal = tranDet.UDFKeyVal[uf.NameId];
                            if (fUVal)
                                uf.UDFValue = fUVal;
                        });
                    }

                    $timeout(function () {

                        $scope.IsRefPartyDet = true;


                        $scope.lastPartyLedgerId = $scope.beData.PartyLedgerId;

                        $scope.beData.PartyCostCenter = tranData.PartyCostCenter;
                        $scope.beData.TranCostCenter = tranData.TranCostCenter;
                        $scope.beData.AgentId = tranData.AgentId;

                        $scope.beData.SalesInvoiceDetail.TermsOfPayment = tranDet.TermsOfPayment;
                        $scope.beData.SalesInvoiceDetail.OtherRefereces = tranDet.OtherRefereces;
                        $scope.beData.SalesInvoiceDetail.TermsOfDelivery = tranDet.TermsOfDelivery;
                        $scope.beData.SalesInvoiceDetail.DeliveryThrough = tranDet.DeliveryThrough;
                        $scope.beData.SalesInvoiceDetail.DeliveryDocNo = tranDet.DeliveryDocNo;
                        $scope.beData.SalesInvoiceDetail.Destination = tranDet.Destination;
                        $scope.beData.SalesInvoiceDetail.SalesQuotationTermsOfPayment = tranDet.SalesQuotationTermsOfPayment;
                        $scope.beData.SalesInvoiceDetail.SalesQuotationOtherRefereces = tranDet.SalesQuotationOtherRefereces;
                        $scope.beData.SalesInvoiceDetail.SalesQuotationTermsOfDelivery = tranDet.SalesQuotationTermsOfDelivery;
                        $scope.beData.SalesInvoiceDetail.Buyes = tranDet.Buyes;
                        $scope.beData.SalesInvoiceDetail.Address = tranDet.Address;
                        $scope.beData.SalesInvoiceDetail.SalesTaxNo = tranDet.SalesTaxNo;
                        $scope.beData.SalesInvoiceDetail.CSTNumber = tranDet.CSTNumber;
                        $scope.beData.SalesInvoiceDetail.Notes = tranDet.Notes;
                        $scope.beData.SalesInvoiceDetail.PhoneNo = tranDet.PhoneNo;
                        $scope.beData.SalesInvoiceDetail.Description = tranDet.Description;
                        $scope.beData.SalesInvoiceDetail.OwnerName = tranDet.OwnerName;
                        $scope.beData.SalesInvoiceDetail.OwnerContactNo = tranDet.OwnerContactNo;
                        $scope.beData.SalesInvoiceDetail.DriverAddress = tranDet.DriverAddress;
                        $scope.beData.SalesInvoiceDetail.DriverName = tranDet.DriverName;
                        $scope.beData.SalesInvoiceDetail.DriverContactNo = tranDet.DriverContactNo;
                        $scope.beData.SalesInvoiceDetail.LicenseNo = tranDet.LicenseNo;
                        $scope.beData.SalesInvoiceDetail.Goods = tranDet.Goods;
                        $scope.beData.SalesInvoiceDetail.Quantity = tranDet.Quantity;
                        $scope.beData.SalesInvoiceDetail.FreightRate = tranDet.FreightRate;
                        $scope.beData.SalesInvoiceDetail.AdvancePayment = tranDet.AdvancePayment;
                        $scope.beData.SalesInvoiceDetail.TotalWT = tranDet.TotalWT;
                        $scope.beData.SalesInvoiceDetail.ContactNo = tranDet.ContactNo;
                        $scope.beData.SalesInvoiceDetail.RegdNo = tranDet.RegdNo;
                        $scope.beData.SalesInvoiceDetail.EngineNo = tranDet.EngineNo;
                        $scope.beData.SalesInvoiceDetail.ChassisNo = tranDet.ChassisNo;
                        $scope.beData.SalesInvoiceDetail.Model = tranDet.Model;
                        $scope.beData.SalesInvoiceDetail.VinNo = tranDet.VinNo;

                        if (tranDet.CreditDays > 0)
                            $scope.beData.SalesInvoiceDetail.CreditDays = tranDet.CreditDays;

                        $scope.beData.SalesInvoiceDetail.ExportCountry = tranDet.ExportCountry;
                        $scope.beData.SalesInvoiceDetail.PPNo = tranDet.PPNo;
                        $scope.beData.SalesInvoiceDetail.PPDate = tranDet.PPDate;
                        $scope.beData.SalesInvoiceDetail.OtherRefereces1 = tranDet.OtherRefereces1;
                        $scope.beData.SalesInvoiceDetail.PaymentTermsId = tranDet.PaymentTermsId;
                        $scope.beData.SalesInvoiceDetail.FreightTypeId = tranDet.FreightTypeId;
                        $scope.beData.Narration = tranData.Narration;
                        $scope.beData.No = tranData.RefNo;
                        $scope.beData.RefNo = tranData.RefNo;

                        $scope.beData.SalesInvoiceDetail.BillToId = tranDet.BillToId;
                        $scope.beData.SalesInvoiceDetail.ShipToId = tranDet.ShipToId;
                        $scope.beData.SalesInvoiceDetail.BillToAddress = tranDet.BillToAddress;
                        $scope.beData.SalesInvoiceDetail.ShipToAddress = tranDet.ShipToAddress;

                        $scope.RefAditionalCostColl = tranData.AditionalCostColl;

                    });


                }
            }, function (reason) {
                Swal.fire('Failed' + reason);
            });

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
                };
                udfColl.push(ud);
            });
        }

        var filterData = [];

        $scope.beData.RefAllotationIdColl = [];
        var filterData = [];
        angular.forEach($scope.RefItemAllocationColl, function (node) {
            if (node.IsSelected == true) {
                $scope.beData.RefAllotationIdColl.push(node.ItemAllocationId);
                filterData.push(node);
            }
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
                    GodownId: (fd.GodownId && fd.GodownId > 0 ? fd.GodownId : ($scope.beData.GodownId > 0 ? $scope.beData.GodownId : 0)),
                    Narration: fd.Narration,
                    RefQty: fd.ActualQty,
                    DeliveryNoteItemAllocationId: refVType == 1 ? fd.ItemAllocationId : null,
                    OrderItemAllocationId: refVType == 2 ? fd.ItemAllocationId : null,
                    RefVType: refVType
                };
                tmpItemAllocationColl.push(refItem);
            });

            $timeout(function () {

                $scope.loadingstatus = 'running';
                showPleaseWait();

                var newSales = {
                    ItemAllocationColl: tmpItemAllocationColl
                };

                var fnName = 'GetSalesOrderDetailsByItemAllocationId';

                if (refVType == 1)
                    fnName = 'GetDeliveryNoteDetailsByItemAllocationId';
                else if (refVType == 2)
                    fnName = 'GetSalesOrderDetailsByItemAllocationId';
                else if (refVType == 3)
                    fnName = 'GetSalesQuotaionDetailsByItemAllocationId';



                $http({
                    method: 'POST',
                    url: base_url + "Inventory/Transaction/" + fnName,
                    headers: { 'Content-Type': undefined },

                    transformRequest: function (data) {
                        var formData = new FormData();
                        formData.append("jsonData", angular.toJson(data.jsonData));
                        return formData;
                    },
                    data: { jsonData: newSales }
                }).then(function (res1) {

                    $scope.loadingstatus = "stop";
                    hidePleaseWait();
                    if (res1.data.IsSuccess == true) {

                        angular.forEach(res1.data.Data.ItemAllocationColl, function (ias) {
                            var uValColl = ias.Attributes ? JSON.parse(ias.Attributes) : null;
                            ias.UDFFeildsColl = [];
                            angular.forEach(udfColl, function (uc) {
                                ias.UDFFeildsColl.push({
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
                            ias.RowType = 'P';
                            ias.Narration = ias.Narration;
                            ias.RefQty = ias.ActualQty;
                            ias.ReadOnlyQty = $scope.SelectedVoucher.Product.RefQtyAs == 2 ? true : false;

                            if (ias.ItemDetailsColl && ias.ItemDetailsColl.length > 0) {
                                angular.forEach(ias.ItemDetailsColl, function (iad) {
                                    iad.DeliveryNoteItemAllocationId = ias.DeliveryNoteItemAllocationId;
                                    iad.OrderItemAllocationId = ias.OrderItemAllocationId;
                                    iad.RowType = 'P';
                                    iad.Narration = ias.Narration;
                                    iad.ReadOnlyQty = $scope.SelectedVoucher.Product.RefQtyAs == 2 ? true : false;
                                    iad.ProductLedgerId = ias.LedgerId;
                                    iad.LedgerId = ias.LedgerId;
                                    iad.UDFFeildsColl = ias.UDFFeildsColl;
                                    iad.RefQty = iad.ActualQty;
                                    $scope.beData.ItemDetailsColl.push(iad);
                                });
                            } else
                                $scope.beData.ItemDetailsColl.push(ias);

                            //$scope.beData.ItemDetailsColl.push(ias);
                        });

                        var adCostColl = $scope.SelectedVoucher.AditionalCostAs == 1 ? $scope.RefAditionalCostColl : $scope.SelectedVoucher.AditionalChargeColl;
                        angular.forEach(adCostColl, function (ads) {
                            $scope.beData.ItemDetailsColl.push({
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
                                CanEditRate: $scope.SelectedVoucher.Product.RefQtyAs == 2 ? false : true,
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
                            });
                        })
                        //$timeout(function () {
                        //   // angular.forEach(res1.Data.)
                        //});

                        $scope.RecalculateAdditioncalCost();
                        $scope.CalculateTotalAndSubTotal();
                    }

                }, function (errormessage) {
                    hidePleaseWait();
                    //$scope.loadingstatus = "stop";
                    Swal.fire(errormessage);
                });


                //refVType == 2 ? 'GetSalesOrderDetailsByItemAllocationId' : 'GetDeliveryNoteDetailsByItemAllocationId';
                //$http({
                //    method: 'POST',
                //    url: base_url + "Inventory/Transaction/" + fnName,
                //    dataType: "json",
                //    data: JSON.stringify(newSales)
                //}).then(function (res1) {

                //    $scope.loadingstatus = 'stop';
                //    hidePleaseWait();


                //}, function (reason) {
                //    Swal.fire('Failed' + reason);
                //});

            });
        }

        $('#frmSalesInvoiceDetailsModel').modal('hide');
    };
    $scope.RefVoucherChange = function (refVType) {

        $scope.CheckedAll = false;
        $scope.RefAditionalCostColl = [];

        $scope.RefVoucherNoColl = [];
        $scope.RefItemAllocationColl = [];

        var funName = "getPendingDeliveryNote";

        if (refVType == 1)
            funName = "getPendingDeliveryNote";
        else if (refVType == 2)
            funName = "getPendinSalesOrder";
        else if (refVType == 3)
            funName = "getPendinSalesQuotation";
        else if (refVType == 4)
            funName = "getPendinSalesAllotment";

        var agentId = 0;
        if ($scope.beData.AgentId)
            agentId = $scope.beData.AgentId;

        var vDate = null;

        if ($scope.beData.VoucherDateDet) {
            vDate = $filter('date')(new Date($scope.beData.VoucherDateDet.dateAD), 'yyyy-MM-dd');
        } else
            vDate = $filter('date')(new Date(), 'yyyy-MM-dd');

        var para = "ledgerId=" + $scope.beData.PartyLedgerId + "&agentId=" + agentId + "&voucherDate=" + vDate + "&orderTranId=0";
        $http({
            method: 'GET',
            url: base_url + "Inventory/Transaction/" + funName + "?" + para,
            dataType: "json"
        }).then(function (res1) {
            if (res1.data.IsSuccess && res1.data.Data) {
                $scope.RefItemAllocationColl = res1.data.Data;

                var refTranIdColl = mx($scope.beData.RefTranIdColl);
                var refAllocationIdCol = mx($scope.beData.RefAllotationIdColl);

                angular.forEach($scope.RefItemAllocationColl, function (ri) {
                    if (refTranIdColl.contains(ri.TranId)) {
                        ri.IsSelected = true;
                    } else {

                        ri.IsSelected = false;

                        if (refAllocationIdCol.contains(ri.ItemAllocationId)) {
                            ri.IsSelected = true;
                        } else
                            ri.IsSelected = false;
                    }

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

                $('#frmSalesInvoiceDetailsModel').modal('show');

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
            var itemSubTotal = 0;
            angular.forEach($scope.beData.ItemDetailsColl, function (item) {

                if (item) {
                    subTotal += item.Amount ? item.Amount : 0;
                    totalQty += item.ActualQty ? item.ActualQty : 0;

                    if (item.RowType == 'P')
                        itemSubTotal += item.Amount;
                }
                
            });

            $scope.beData.ItemSubTotal = ($filter('number')(itemSubTotal, $scope.SelectedVoucher.NoOfDecimalPlaces)).parseDBL();
            $scope.beData.SubTotal = ($filter('number')(subTotal, $scope.SelectedVoucher.NoOfDecimalPlaces)).parseDBL();
            $scope.beData.TotalAmount = ($filter('number')(subTotal, $scope.SelectedVoucher.NoOfDecimalPlaces)).parseDBL();

            $scope.DisplayOnScreen($scope.beData.TotalAmount);
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

    $scope.ChangeItemRowValue = function (itemDet, col) {

        if (col == 'rate' || col == 'amt') {
            if (mx(itemDet.Rate).contains('=') == true || mx(itemDet.Amount).contains('=') == true) {
                return;
            }
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

            if (itemDet.productDetail) {
                if (col == "netWeight") {
                    if (itemDet.NetWeight && itemDet.NetWeight > 0)
                        itemDet.LossWeight = itemDet.NetWeight * itemDet.LossRate / 100;
                }
                else if (col == "lossRate") {
                    if (itemDet.NetWeight && itemDet.NetWeight > 0)
                        itemDet.LossWeight = itemDet.NetWeight * itemDet.LossRate / 100;
                }
                else if (col == "fineRate") {
                    if (itemDet.NetWeight && itemDet.NetWeight > 0)
                        itemDet.FineWeight = itemDet.NetWeight * itemDet.FineRate / 100;
                }
                else if (col == "processingRate") {
                    if (itemDet.NetWeight && itemDet.NetWeight > 0)
                        itemDet.ProcessingWeight = itemDet.NetWeight * itemDet.ProcessingRate / 100;
                }
            }

            if ($scope.SelectedVoucher.Jewellery.Loss == true)
                itemDet.ActualQty = itemDet.NetWeight + itemDet.LossWeight;
            else
                itemDet.ActualQty = itemDet.FineWeight + itemDet.ProcessingWeight;
        }

        if (col == 'aQty') {
            itemDet.BilledQty = itemDet.ActualQty;

            if ($scope.beData.TranId > 0) {

            }
            else {
                if (itemDet.productDetail) {
                    if (itemDet.productDetail.SalesPriceList) {
                        itemDet.productDetail.SalesPriceList.forEach(function (sp) {
                            if (sp.FromQty <= itemDet.ActualQty && sp.LessThanQty >= itemDet.ActualQty) {
                                itemDet.Rate = sp.Rate;
                                itemDet.DiscountPer = sp.DisPer;
                                itemDet.DiscountAmt = sp.DisAmt;
                            }
                        });
                    }
                }
            }


        } else if (col == 'bQty') {
            if (itemDet.ActualQty == 0 || itemDet.ActualQty < itemDet.BilledQty)
                itemDet.ActualQty = itemDet.BilledQty;
        }

        if (itemDet.productDetail) {
            if (itemDet.Batch && itemDet.Batch.length > 0) {
                var bBal = (itemDet.BatchBalQty || itemDet.BatchBalQty > 0 ? itemDet.BatchBalQty : 0) + (itemDet.RefQty > 0 ? itemDet.RefQty : 0);

                if (itemDet.QtyDecimal == undefined || itemDet.QtyDecimal == null)
                    itemDet.QtyDecimal = 2;

                bBal = ($filter('number')(bBal, itemDet.QtyDecimal)).parseDBL();

                var outQty = mx($scope.beData.ItemDetailsColl).where(p1 => p1.ProductId == itemDet.ProductId && p1.Batch == itemDet.Batch && p1.EngineNo == itemDet.EngineNo).sum(p1 => p1.ActualQty);

                if (isEmptyNum(outQty) == 0)
                    outQty = itemDet.ActualQty;

                if (outQty > bBal) {

                    if (itemDet.productDetail.IgnoreNegativeBalance == false) {
                        itemDet.ActualQty = 0;
                        itemDet.BilledQty = 0;
                        Swal.fire('Please ! Enter Qty Less Then Equal ' + bBal);
                    }
                }
            }
            else {

                var bBal = (itemDet.productDetail.ClosingQty + (itemDet.RefQty > 0 ? itemDet.RefQty : 0));
                if (itemDet.QtyDecimal == undefined || itemDet.QtyDecimal == null)
                    itemDet.QtyDecimal = 2;

                bBal = ($filter('number')(bBal, itemDet.QtyDecimal)).parseDBL();

                if (bBal < itemDet.ActualQty) {

                    if (itemDet.productDetail.IgnoreNegativeBalance == false) {
                        itemDet.ActualQty = 0;
                        itemDet.BilledQty = 0;
                        Swal.fire('Please ! Enter Qty Less Then Equal ' + itemDet.productDetail.ClosingQty);
                    }

                }
            }
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


        //if(!itemDet.AmountFormula || itemDet.AmountFormula.length==0)
        itemDet.Amount = ($filter('number')((amt - disAmt), itemDet.AmountDecimal)).parseDBL();

        if (col == "disAmt")
            itemDet.DiscountPer = disPer;
        else if (col == "disPer" || col == "product")
            itemDet.DiscountAmt = disAmt;
        else {
            itemDet.DiscountPer = disPer;
            itemDet.DiscountAmt = disAmt;
        }

        itemDet.TotalAmount = itemDet.Amount + itemDet.Makeing + itemDet.Stone;

        if ($scope.HideShow.BilledQty == true) {
            itemDet.BilledQty = aQty;
        }

        if (itemDet.productDetail) {
            if (itemDet.productDetail.AlternetUnitColl) {
                if (col == 'aQty' || col == 'bQty' || col == 'product') {
                    var alterUnit_Qry = mx(itemDet.productDetail.AlternetUnitColl);

                    var alternetUnit1 = null, alternetUnit2 = null;

                    if (itemDet.productDetail.AlternetUnitColl.length > 0) {

                        alternetUnit1 = alterUnit_Qry.firstOrDefault(p1 => p1.SNo == 1);
                        if (alternetUnit1) {
                            itemDet.ALValue1 = parseFloat(parseFloat((alternetUnit1.AlternetUnitValue * aQty) / alternetUnit1.BaseUnitValue).toFixed(alternetUnit1.NoOfDecimalPlaces));
                            itemDet.ALUnitId1 = alternetUnit1.UnitId;
                            itemDet.UnitName1 = alternetUnit1.UnitName;
                        }
                    }

                    if (itemDet.productDetail.AlternetUnitColl.length > 1) {
                        alternetUnit2 = alterUnit_Qry.firstOrDefault(p1 => p1.SNo == 2);
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

        itemDet.TotalAmount = itemDet.Amount + itemDet.Makeing + itemDet.Stone;

        GlobalServices.getItemUDFFormula(itemDet, $scope.beData.ItemDetailsColl, $scope.beData, col);


        if (col == 'rate' || col == 'amt') {
            if (itemDet.FixedProductColl && itemDet.FixedProductColl.length > 0) {
                for (var ind = 0; ind < itemDet.FixedProductColl.length; ind++) {
                    var fp = $scope.CurItemAllocation.FixedProductColl[ind];
                    fp.Rate = itemDet.Rate;
                    fp.Amount = itemDet.Rate;
                }
            }
        }

        if (col == 'disPer' || col == 'disAmt') {

        }
        else {
            $scope.CalculateScheme();
        }


		itemDet.Formula = ($scope.ItemFormula ? angular.copy($scope.ItemFormula) : null);
          
        GlobalServices.getItemUDFFormula(itemDet, $scope.beData.ItemDetailsColl, $scope.beData,col);
        GlobalServices.getItemUDFFormulaQry(itemDet, $scope.beData.ItemDetailsColl, $scope.beData, col);
		
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

                alternetUnit1 = alterUnit_Qry.firstOrDefault(p1 => p1.SNo == 1);
                alternetUnit2 = alterUnit_Qry.firstOrDefault(p1 => p1.SNo == 2);
                var baseQty = 0;
                var findUnit = $scope.UnitColl.firstOrDefault(p1 => p1.UnitId == itemDet.productDetail.BaseUnitId);
                if (alternetUnit1 && col == 'unit1') {

                    if (findUnit) {
                        baseQty = parseFloat(parseFloat(itemDet.ALValue1 / alternetUnit1.AlternetUnitValue).toFixed(findUnit.NoOfDecimalPlaces));

                        if ($scope.SelectedVoucher.Product.NotEffectInBaseUnit == false)
                            itemDet.ActualQty = baseQty;

                        if (alternetUnit2)
                            itemDet.ALValue2 = parseFloat(parseFloat((alternetUnit2.AlternetUnitValue * baseQty) / alternetUnit2.BaseUnitValue).toFixed(alternetUnit2.NoOfDecimalPlaces));
                    }

                } else if (alternetUnit2 && col == "unit2") {

                    if (findUnit) {
                        baseQty = parseFloat(parseFloat(itemDet.ALValue2 * alternetUnit2.AlternetUnitValue).toFixed(findUnit.NoOfDecimalPlaces));

                        if ($scope.SelectedVoucher.Product.NotEffectInBaseUnit == false)
                            itemDet.ActualQty = baseQty;

                        if (alternetUnit1)
                            itemDet.ALValue1 = parseFloat(parseFloat((alternetUnit1.AlternetUnitValue * baseQty) / alternetUnit1.BaseUnitValue).toFixed(alternetUnit1.NoOfDecimalPlaces));
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
        var makingAmt = 0;
        var stoneAmt = 0;
        angular.forEach($scope.beData.ItemDetailsColl, function (idet) {

            if (idet.RowType == 'P') {
                totalQty1 += idet.ActualQty;

                productAmt += idet.Amount;

                schemeAmt += idet.SchameAmt;

                productVatAmt += (idet.VatAmount ? idet.VatAmount : 0);
                productVatAbleAmt += (idet.VatAbleAmt ? idet.VatAbleAmt : 0);

                productExciduteAmt += (idet.ExDutyAmount ? idet.ExDutyAmount : 0);
                productExciduteAbleAmt += (idet.ExciseAbtAmt ? idet.ExciseAbtAmt : 0);
                productExciduteAbleQty += (idet.ExciseAbleQty ? idet.ExciseAbleQty : 0);

                makingAmt += idet.Makeing;
                stoneAmt += idet.Stone;
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

                            $scope.RecalculateAdditioncalCost();
                        }
                    }, function (reason) {
                        alert('Failed' + reason);
                    });
                }


                if (idet.costLedgerDetail) {
                    if (idet.costLedgerDetail.LedgerType == 9) // Auto Rounde off
                    {
                        amt1 = Number((Math.round(totalAmt1) - totalAmt1).toFixed(3));
                    }
                    else if (idet.costLedgerDetail.LedgerType == 6)  // Scheme
                    {
                        amt1 = schemeAmt;
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
                } else
                    amt1 = idet.Amount;


                if (idet.Rate != 0) {

                    if (idet.costLedgerDetail) {
                        if (idet.costLedgerDetail.AditionCostOnBasisOf == 0) {


                            if (idet.costLedgerDetail.LedgerType == 3) {

                                if ($scope.SelectedVoucher.Product.ProductWiseExciseDuty == true) {
                                    idet.Rate = 0;
                                    amt1 = productExciduteAmt;
                                    idet.AccessableValue = productExciduteAbleAmt;
                                } else {
                                    amt1 = productExciduteAbleQty * idet.Rate;
                                    idet.AccessableValue = productExciduteAbleAmt;
                                }

                            }
                            else {
                                amt1 = totalQty1 * idet.Rate / 100;
                                idet.AccessableValue = totalQty1;
                            }

                        }
                        else {
                            if (idet.costLedgerDetail.LedgerType == 3) // Excise Duty
                            {
                                if ($scope.SelectedVoucher.Product.ProductWiseExciseDuty == true) {
                                    idet.Rate = 0;
                                    amt1 = productExciduteAmt;
                                    idet.AccessableValue = productExciduteAbleAmt;
                                } else {
                                    amt1 = productExciduteAbleAmt * idet.Rate / 100;
                                    idet.AccessableValue = productExciduteAbleAmt;
                                }

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
        $scope.ChangeTenderAmt();
    };


    $scope.SaveSalesInvoice = function () {

        if ($scope.loadingstatus == "running")
            return;

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

            $timeout(function () {

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

            }, 300);

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
            if (!$scope.beData.SalesInvoiceDetail.PaymentTermsId || $scope.beData.SalesInvoiceDetail.PaymentTermsId == 0) {
                result = false;
                Swal.fire('Please ! Select Billing Type');
            }
        }

        if ($scope.SelectedVoucher.MandatoryCreditDays == true) {
            if (!$scope.beData.SalesInvoiceDetail || !$scope.beData.SalesInvoiceDetail.CreditDays || $scope.beData.SalesInvoiceDetail.CreditDays.length == 0) {
                if ($scope.beData.SalesInvoiceDetail.Buyes != 'CASH SALES PARTY') {
                    result = false;
                    Swal.fire('Please ! Enter Credit Days');
                }
            }
        }


        if ($scope.HideShow.ActiveTender == false) {
            if ($scope.beData.TotalAmount > $scope.beData.ReceivedAmount) {
                result = false;
                Swal.fire('Please ! Enter Tender Amount Greater and Equal Invoice Amount');
            }
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

        if ($scope.SelectedVoucher.AllowCashPurchaseSale == true && $scope.beData.SalesInvoiceDetail.TermsOfPayment == 'CASH') {
            if (!$scope.beData.PaymentTermColl || $scope.beData.PaymentTermColl.length == 0) {
                Swal.fire('Please ! Enter Receipt Amount');
                return false;
            }

            var pc = mx($scope.beData.PaymentTermColl);

            if (pc.sum(p1 => p1.Amount) == 0) {
                Swal.fire('Please ! Enter Receipt Amount');
                return false;
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

    $scope.ChangeReceiptAmt = function () {
        var recAmt = 0;
        angular.forEach($scope.beData.PaymentTermColl, function (pt) {
            if (pt.Amount > 0) {                
                recAmt += pt.Amount;
            }
        });

        $scope.beData.ReceivedAmount = recAmt;
    }
    $scope.GetData = function () {


        var vRate = $scope.SelectedVoucher.VatRate;

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
            TotalAmount: ($scope.beData.TotalAmount ? $scope.beData.TotalAmount : 0),
            AgentId: $scope.beData.AgentId ? $scope.beData.AgentId : 0,
            PartyCostCenter: $scope.beData.PartyCostCenter ? $scope.beData.PartyCostCenter : 0,
            TranCostCenter: $scope.beData.TranCostCenter ? $scope.beData.TranCostCenter : 0,
            EntryDate: eDate,
            BranchId: ($scope.beData.BranchId ? $scope.beData.BranchId : 0),
            IsAbbInvoice: $scope.SelectedVoucher.IsAbbInvoice,
            ItemAllocationColl: [],
            // AditionalCostColl: $scope.beData.AditionalCostColl,
            AditionalCostColl: [],
            SalesInvoiceDetail: $scope.beData.SalesInvoiceDetail,
            GodownId: $scope.beData.GodownId,
            Attributes: '',
            PaymentTermColl: [],
            ReceiptTranId: $scope.beData.ReceiptTranId,
            ReceivedAmount: $scope.beData.ReceivedAmount,
            BOMTranId: $scope.beData.BOMTranId,
            RateTypeId: $scope.beData.RateTypeId,
            UniqueId: $scope.beData.UniqueId,
            PaymentResponse:$scope.beData.PaymentResponse
        };

        var recAmt = 0;
        angular.forEach($scope.beData.PaymentTermColl, function (pt) {
            if (pt.Amount > 0) {
                tmpSales.PaymentTermColl.push(pt);
                recAmt += pt.Amount;
            }
        });

        if ($scope.beData.PaymentTermColl.length > 0) {
            tmpSales.SalesInvoiceDetail.TermsOfPayment = 'CASH';
            tmpSales.ReceivedAmount = recAmt;
        }

        if (tmpSales.SalesInvoiceDetail) {
            if (tmpSales.SalesInvoiceDetail.FreightRate == undefined || tmpSales.SalesInvoiceDetail.FreightRate == null || tmpSales.SalesInvoiceDetail.FreightRate === undefined)
                tmpSales.SalesInvoiceDetail.FreightRate = 0;

            if (tmpSales.SalesInvoiceDetail.AdvancePayment == undefined || tmpSales.SalesInvoiceDetail.AdvancePayment == null || tmpSales.SalesInvoiceDetail.AdvancePayment === undefined)
                tmpSales.SalesInvoiceDetail.AdvancePayment = 0;

            if (tmpSales.SalesInvoiceDetail.CreditDays == undefined || tmpSales.SalesInvoiceDetail.CreditDays == null || tmpSales.SalesInvoiceDetail.CreditDays === undefined)
                tmpSales.SalesInvoiceDetail.CreditDays = 0;
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

        var ssfPer = 0;
        if ($scope.beData.SalesInvoiceDetail.SSF) {
            if ($scope.beData.SalesInvoiceDetail.SSF.SchamePer > 0) {
                ssfPer = $scope.beData.SalesInvoiceDetail.SSF.SchamePer;
            }
        }

        if (tmpSales.PaymentTermColl) {
            var vid = $scope.beData.SalesInvoiceDetail.ReceiptVoucherId;
            if (!vid) {
                if ($scope.RecVoucherTypeColl && $scope.RecVoucherTypeColl.length > 0)
                    vid = $scope.RecVoucherTypeColl[0].VoucherId;
            }
            angular.forEach(tmpSales.PaymentTermColl, function (pt) {
                pt.VoucherId = vid;
            });
        };

        angular.forEach($scope.beData.ItemDetailsColl, function (itemDet) {
            if (itemDet.ProductId && itemDet.ProductId > 0 && (itemDet.RowType == 'P' || itemDet.RowType == 'S')) {

                var udfValues = '';
                var udfFields = [];
                var itemKeyVal = {};
                angular.forEach(itemDet.UDFFeildsColl, function (udf) {

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

                var itemAllocation = {
                    UDFKeyVal: itemKeyVal,
                    Attributes: udfValues,
                    ProductId: itemDet.ProductId,
                    ActualQty: itemDet.ActualQty + (itemDet.FreeQty ? itemDet.FreeQty : 0),
                    BilledQty: itemDet.BilledQty,
                    UnitId: (itemDet.TranUnitId > 0 ? itemDet.TranUnitId : itemDet.UnitId),
                    Rate: itemDet.Rate,
                    Amount: itemDet.Amount,
                    //Rate: ($scope.SelectedVoucher.IsAbbInvoice == true ? itemDet.Rate / ((vRate + 100) / 100) : itemDet.Rate),
                    //Amount: ($scope.SelectedVoucher.IsAbbInvoice == true ? itemDet.Amount / ((vRate + 100) / 100) : itemDet.Amount),
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
                    GodownId: (itemDet.GodownId > 0 ? itemDet.GodownId : (tmpSales.GodownId > 0 ? tmpSales.GodownId : 0)),
                    VatRate: itemDet.VatRate,
                    VatAmount: itemDet.VatAmount,
                    VatAbleAmt: itemDet.VatAbleAmt,
                    ExDutyRate: itemDet.ExDutyRate,
                    ExDutyAmount: itemDet.ExDutyAmount,
                    Description: itemDet.Description,
                    AbbRate: itemDet.Rate,
                    AbbAmount: itemDet.Amount,
                    IsTaxable: (itemDet.productDetail ? itemDet.productDetail.IsTaxable : true),
                    RateOf: (itemDet.RateOf ? itemDet.RateOf : 1),
                    NetWeight: (itemDet.NetWeight ? itemDet.NetWeight : 0),
                    LossWeight: (itemDet.LossWeight ? itemDet.LossWeight : 0),
                    LossRate: (itemDet.LossRate ? itemDet.LossRate : 0),
                    FineWeight: (itemDet.FineWeight > 0 ? itemDet.FineWeight : 0),
                    FineRate: (itemDet.FineRate > 0 ? itemDet.FineRate : 0),
                    ProcessingWeight: (itemDet.ProcessingWeight > 0 ? itemDet.ProcessingWeight : 0),
                    ProcessingRate: (itemDet.ProcessingRate > 0 ? itemDet.ProcessingRate : 0),

                    Makeing: (itemDet.Makeing ? itemDet.Makeing : 0),
                    Stone: (itemDet.Stone ? itemDet.Stone : 0),
                    MRP: (itemDet.MRP ? itemDet.MRP : 0),
                    PurchaseRate: (itemDet.PurchaseRate ? itemDet.PurchaseRate : 0),
                    TradeRate: (itemDet.TradeRate ? itemDet.TradeRate : 0),
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
                    RefQty: (itemDet.RefQty > 0 ? itemDet.RefQty : 0),
                };
                if (itemDet.FixedProductColl && itemDet.FixedProductColl.length > 0 && $scope.SelectedVoucher.MultipleFixedProduct == true) {
                    var rate = itemAllocation.Rate;
                    angular.forEach(itemDet.FixedProductColl, function (fp) {
                        if (fp.IsSelected == true) {
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
                                });
                        }

                    });

                    itemAllocation.Amount = mx(itemAllocation.ItemDetailsColl).sum(p1 => p1.Amount);
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
                });
            }
        });


        //if ($scope.SelectedVoucher.IsAbbInvoice == true)
        //{
        //    tmpSales.AditionalCostColl = [];
        //    var taxAbleAmt = 0;
        //    var productAmt = 0;
        //    angular.forEach(tmpSales.ItemAllocationColl, function (item)
        //    {
        //            if(item.IsTaxable==true)
        //            taxAbleAmt += item.Amount;

        //            productAmt += item.Amount;
        //    });

        //    var ledAmt = 0;
        //    for (var lInd = 0; lInd < $scope.SelectedVoucher.AditionalChargeColl.length; lInd++) {
        //        var ac = $scope.SelectedVoucher.AditionalChargeColl[lInd];
        //        var mul = ac.Sign == true ? 1 : -1;
        //        var costAC = {
        //            LedgerId: ac.LedgerId,
        //            AccessableValue: 0,
        //            Rate: ac.Rate*mul,
        //            Amount: 0,
        //        }

        //        if (ac.Amount != 0) {
        //            costAC.Amount = ac.Amount;
        //            costAC.AccessableValue = ac.Amount;                    
        //        } else {
        //            if (ac.TypeOfDutyTax == 1)
        //            {
        //                costAC.AccessableValue = (taxAbleAmt+ledAmt);
        //                costAC.Amount = ((taxAbleAmt + ledAmt) * ac.Rate / 100) * mul;
        //            }
        //            else {
        //                costAC.AccessableValue = (productAmt + ledAmt);
        //                costAC.Amount = ((productAmt + ledAmt) * ac.Rate / 100) * mul;
        //            }
        //        }

        //        ledAmt += costAC.Amount;
        //        tmpSales.AditionalCostColl.push(costAC);
        //    }
        //}


        return tmpSales;


    };
    $scope.SetData = function (tran) {

        $scope.loadingstatus = 'stop';
        hidePleaseWait();

        $scope.beData.VoucherDateDet = null;
        $scope.beData.VoucherDate = new Date(tran.VoucherDate);
        $scope.beData.VoucherDate_TMP = new Date(tran.VoucherDate);
        $scope.beData.VoucherDateAD_TMP = new Date(tran.VoucherDate);
        $scope.beData.VoucherDateDet = GlobalServices.getDateDet(tran.VoucherDate);
        setTimeout(1000);

        $scope.lastPartyLedgerId = tran.PartyLedgerId;

        if ($scope.GodownColl.length > 0 && (!$scope.beData.GodownId || $scope.beData.GodownId == 0)) {
            $scope.beData.GodownId = $scope.GodownColl[0].GodownId;
        }
        tran.GodownId = $scope.beData.GodownId;

        var ptColl = mx(tran.PaymentTermColl);
        angular.forEach($scope.beData.PaymentTermColl, function (pt) {
            var fn = ptColl.firstOrDefault(p1 => p1.PaymentTermsId == pt.PaymentTermsId);
            if (fn) {
                pt.Amount = fn.Amount;
                pt.Remarks = fn.Remarks;
            }
        });
        $scope.beData.ReceiptTranId = tran.ReceiptTranId;

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
        $scope.beData.SalesInvoiceDetail = tran.SalesInvoiceDetail;

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
                };
                udfColl.push(ud);
            });
        }

        angular.forEach(tran.ItemAllocationColl, function (itemA) {

            itemA.ActualQty = itemA.ActualQty + isEmptyAmt(itemA.FreeQty);

            angular.forEach(itemA.ItemDetailsColl, function (itemAD) {

                itemAD.ActualQty = itemAD.ActualQty + isEmptyAmt(itemAD.FreeQty);
                itemAD.LedgerId = itemA.LedgerId;
                itemAD.ProductLedgerId = itemA.LedgerId;
                itemAD.RowType = 'P';
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
                //itemAD.UDFFeildsColl = udfColl;

                itemAD.RefQty = itemAD.ActualQty;
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
                                    udd.UDFValue_TMP = parseInt(findU.Value);
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
                itemAD.CanEditRow = itemA.CanEditRow;
                $scope.beData.ItemDetailsColl.push(itemAD);
            });
        });

        $scope.AddRowInItemDetails($scope.beData.ItemDetailsColl.length);

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

        $scope.ClearItemDetails();
        $scope.beData.SalesInvoiceDetail = {};
        $scope.beData.PartyLedgerId = null;
        $scope.beData.AditionalCostColl = [];

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

                $scope.loadingstatus = "stop";
                hidePleaseWait();

                if (res.data.IsSuccess && res.data.Data) {
                    $scope.SelectedVoucher = res.data.Data;

                    var copyPTColl = angular.copy($scope.PaymentTermColl);
                    $scope.beData.PaymentTermColl = [];
                    copyPTColl.forEach(function (pt) {
                        if (pt.BranchId == 0 || pt.BranchId == null || pt.BDId == $scope.SelectedVoucher.BDId || pt.BranchId == $scope.SelectedVoucher.BDId) {
                            $scope.beData.PaymentTermColl.push(pt);
                        }
                    });

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

                                if ($scope.RateTypeColl && $scope.RateTypeColl.length > 0) {
                                    $scope.beData.RateTypeId = $scope.RateTypeColl[0].Id;
                                }

                                if ($scope.SelectedVoucher.PrintPreviewAs == 3 && (!ws || ws == null))
                                    connectPrintServer();

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
                                            ColWidth: udf.ColWidth,
                                            UDFValue: udf.DefaultValue,
											RefTable: udf.RefTable,
                    RefColumn: udf.RefColumn,
                    TextColumn: udf.TextColumn,
                                        };
                                        $scope.beData.UDFFeildsColl.push(ud);
                                    });
                                }


                                if ($scope.SelectedVoucher.DefaultRefVoucher > 0)
                                    $scope.beData.RefVoucherType = $scope.SelectedVoucher.DefaultRefVoucher;

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

                                if ($scope.SelectedVoucher.ActiveCompanyWiseProduct == true)
                                    $scope.HideShow.ProductCompany = false;
                                else
                                    $scope.HideShow.ProductCompany = true;


                                if ($scope.SelectedVoucher.Product.ShowProductQuantityPoint == true)
                                    $scope.HideShow.ProductPoint = false;
                                else
                                    $scope.HideShow.ProductPoint = true;

                                //if ($scope.SelectedVoucher.Product.ProductWiseLedger == true) {
                                //    $scope.HideShow.ProductLedger = false;

                                //    if ($scope.SelectedVoucher.Product.ShowProductWiseLedger == true)
                                //        $scope.HideShow.ShowProductWiseLedger = false;
                                //    else
                                //        $scope.HideShow.ShowProductWiseLedger = true;
                                //}
                                //else {
                                //    $scope.HideShow.ProductLedger = true;
                                //    $scope.HideShow.ShowProductWiseLedger = true;
                                //}

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

                                if ($scope.SelectedVoucher.ActiveTender == true)
                                    $scope.HideShow.ActiveTender = false;
                                else
                                    $scope.HideShow.ActiveTender = true;

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


                                if ($scope.SelectedVoucher.AditionalChargeColl && $scope.SelectedVoucher.IsAbbInvoice == false) {
                                    var itemInd = $scope.beData.ItemDetailsColl.length;
                                    for (var lInd = 0; lInd < $scope.SelectedVoucher.AditionalChargeColl.length; lInd++) {
                                        var ac = $scope.SelectedVoucher.AditionalChargeColl[lInd];
                                        $scope.AddRowInLedgerDetails(itemInd);
                                        var mul = 1;
                                        if (ac.Sign != undefined)
                                            mul = (ac.Sign == true ? 1 : -1);

                                        var ledAllocation = $scope.beData.ItemDetailsColl[itemInd];
                                        ledAllocation.Formula = ac.Formula;
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
                                }
                                else
                                    $scope.SelectedVoucher.VoucherWiseGodownColl = $scope.GodownColl;


                                if ($scope.SelectedVoucher.LedgerId > 0)
                                    $scope.beData.PartyLedgerId = $scope.SelectedVoucher.LedgerId;

                                $scope.loadingstatus = 'running';
                                showPleaseWait();
                                var schemePara = {
                                    VoucherId: $scope.SelectedVoucher.VoucherId,
                                    VoucherDate: $filter('date')(new Date(), 'yyyy-MM-dd')
                                };
                                $http({
                                    method: 'POST',
                                    url: base_url + "Inventory/Transaction/getSchemeForSales",
                                    dataType: "json",
                                    data: JSON.stringify(schemePara)
                                }).then(function (resLD) {

                                    $scope.loadingstatus = 'stop';
                                    hidePleaseWait();
                                    if (resLD.data.IsSuccess && resLD.data.Data) {
                                        $scope.SelectedVoucherSchemeColl = resLD.data.Data;
                                    }
                                }, function (reason) {
                                    alert('Failed' + reason);
                                });


                                $scope.loadingstatus = 'running';
                                showPleaseWait();

                                $http({
                                    method: 'POST',
                                    url: base_url + "Inventory/Transaction/getBOMForSales",
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

                $scope.loadingstatus = "running";
                showPleaseWait();

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

                    $scope.loadingstatus = "stop";
                    hidePleaseWait();

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
            Operator: "=",
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
    $scope.ShowBillImg = function () {

        var findI = $scope.PaymentTermColl_Qry.firstOrDefault(p1 => p1.id == $scope.beData.SalesInvoiceDetail.PaymentTermsId);
        if (findI) {
            $scope.viewImg = {
                ContentPath: findI.ImagePath
            };
            if (findI.ImagePath && findI.ImagePath.length > 0) {
                $scope.viewImg.ContentPath = findI.ImagePath;
                $('#PersonalImg').modal('show');
            } else
                Swal.fire('No Image Found');
        }
    };

    $scope.BOMChange = function () {

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
                        var bomDataColl = res.data.Data.ItemDetailsColl;

                        if (bomDataColl && bomDataColl.length > 0) {

                            var ind = -1;
                            var len = $scope.beData.ItemDetailsColl.length;
                            do {
                                ind = -1;
                                for (var i = 0; i < len; i++) {
                                    var itemDet = $scope.beData.ItemDetailsColl[i];
                                    if (itemDet) {
                                        if (itemDet.RowType == 'S' || itemDet.RowType == 'P') {
                                            ind = i;
                                            break;
                                        }
                                    }
                                }

                                if (ind >= 0) {
                                    $scope.beData.ItemDetailsColl.splice(ind, 1);
                                }

                            } while (ind >= 0);

                            var lastItemInd = -1;
                            bomDataColl.forEach(function (bom) {
                                if (bom.RowType == 1) {
                                    $scope.beData.ItemDetailsColl.splice(lastItemInd + 1, 0, {
                                        RowType: 'P',
                                        IsRefItem: true,
                                        ProductId: bom.ProductId,
                                        productDetail: null,
                                        ActualQty: bom.Qty,
                                        BilledQty: bom.Qty,
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
                    } else
                        Swal.fire(res.data.ResponseMSG);
                });
            }, function (reason) {
                Swal.fire('Failed' + reason);
            });
        }
    };
    $scope.CalculateScheme = function () {
        if ($scope.SelectedVoucherSchemeColl && $scope.SelectedVoucherSchemeColl.length > 0) {

            var itemWiseSchemeColl = [];
            angular.forEach($scope.beData.ItemDetailsColl, function (itemDet) {
                if (itemDet && itemDet.RowType == 'P') {
                    itemDet.DiscountPer = 0;
                    itemDet.DiscountAmt = 0;
                    itemDet.SchamePer = 0;
                    itemDet.SchameAmt = 0;

                    if (itemDet.productDetail) {
                        if (itemDet.productDetail.SchemeList && itemDet.productDetail.SchemeList.length > 0) {

                            for (var iss = 0; iss < itemDet.productDetail.SchemeList.length; iss++) {
                                var itemSS = itemDet.productDetail.SchemeList[iss];
                                if (itemSS) {
                                    if (itemSS.MinAmt > 0) {
                                        if (itemSS.MinAmt <= itemDet.Amount) {

                                            if (itemSS.FreeQty > 0)
                                                itemDet.FreeQty = itemSS.FreeQty;

                                            if (itemSS.DiscountPer > 0)
                                                itemDet.DiscountPer = itemSS.DiscountPer;

                                            if (itemSS.DiscountAmt > 0)
                                                itemDet.DiscountAmt = itemSS.DiscountAmt;

                                            itemWiseSchemeColl.push(itemSS);
                                            break;
                                        }
                                    } else if (itemSS.MinQty > 0) {
                                        if (itemSS.MinQty <= itemDet.ActualQty) {

                                            if (itemSS.FreeQty > 0)
                                                itemDet.FreeQty = itemSS.FreeQty;

                                            if (itemSS.DiscountPer > 0)
                                                itemDet.DiscountPer = itemSS.DiscountPer;

                                            if (itemSS.DiscountAmt > 0)
                                                itemDet.DiscountAmt = itemSS.DiscountAmt;

                                            itemWiseSchemeColl.push(itemSS);
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                    }


                    $scope.ChangeItemRowValue(itemDet, 'disPer');

                }
            });

            var ind = -1;
            var len = $scope.beData.ItemDetailsColl.length;
            do {
                ind = -1;
                for (var i = 0; i < len; i++) {
                    var itemDet = $scope.beData.ItemDetailsColl[i];
                    if (itemDet) {
                        if (itemDet.RowType == 'S') {
                            ind = i;
                            break;
                        }
                    }
                }

                if (ind >= 0) {
                    $scope.beData.ItemDetailsColl.splice(ind, 1);
                }

            } while (ind >= 0);

            var itemColl = mx($scope.beData.ItemDetailsColl).where(p1 => p1.RowType == 'P');
            var totalItemAmt = itemColl.sum(p1 => p1.Amount);
            var totalItemQty = itemColl.sum(p1 => p1.ActualQty);

            var applicableSchemeCOll = [];

            for (var s = 0; s < $scope.SelectedVoucherSchemeColl.length; s++) {
                var sch = $scope.SelectedVoucherSchemeColl[s];
                if (sch.MinAmt > 0) {
                    if (sch.MinAmt <= totalItemAmt) {
                        applicableSchemeCOll.push(sch);
                        break;
                    }
                } else if (sch.MinQty > 0) {
                    if (sch.MinQty <= totalItemQty) {
                        applicableSchemeCOll.push(sch);
                        break;
                    }
                }
            }

            var lastItemInd = -1;
            $scope.beData.ItemDetailsColl.forEach(function (itemDet) {
                if (itemDet) {
                    if (itemDet.RowType == 'P') {
                        lastItemInd++;
                    }
                }
            });

            if (lastItemInd > 0) {
                applicableSchemeCOll.forEach(function (sch) {
                    if (sch.AlternetProductId > 0) {
                        $scope.beData.ItemDetailsColl.splice(lastItemInd + 1, 0, {
                            RowType: 'S',
                            IsRefItem: true,
                            ProductId: sch.AlternetProductId,
                            productDetail: null,
                            ActualQty: sch.FreeQty,
                            BilledQty: 0,
                            FreeQty: sch.FreeQty,
                            Rate: 0,
                            DiscountPer: 0,
                            DiscountAmt: 0,
                            SchameAmt: 0,
                            SchamePer: 0,
                            Amount: 0,
                            Description: sch.Description,
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

                itemWiseSchemeColl.forEach(function (sch) {
                    if (sch.AlternetProductId > 0) {
                        $scope.beData.ItemDetailsColl.splice(lastItemInd + 1, 0, {
                            RowType: 'S',
                            IsRefItem: true,
                            ProductId: sch.AlternetProductId,
                            productDetail: null,
                            ActualQty: sch.FreeQty,
                            BilledQty: 0,
                            FreeQty: sch.FreeQty,
                            Rate: 0,
                            DiscountPer: 0,
                            DiscountAmt: 0,
                            SchameAmt: 0,
                            SchamePer: 0,
                            Amount: 0,
                            Description: sch.Description,
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

                applicableSchemeCOll.forEach(function (sch) {
                    angular.forEach($scope.beData.ItemDetailsColl, function (itemDet) {

                        if (itemDet && itemDet.RowType == 'P') {
                            itemDet.DiscountPer = sch.DiscountPer;
                            itemDet.DiscountAmt = sch.DiscountAmt;
                            if (sch.DiscountPer > 0)
                                $scope.ChangeItemRowValue(itemDet, 'disPer');
                            else if (sch.DiscountAmt > 0)
                                $scope.ChangeItemRowValue(itemDet, 'disAmt');
                        }
                    });
                });

            }

        }
    }
    $scope.ClearData = function () {

        $scope.lastPartyLedgerId = null;
        $scope.loadingstatus = "stop";
        hidePleaseWait();
        $scope.IsRefPartyDet = false;
        $scope.CheckedAll = false;
        $scope.RefAditionalCostColl = [];

        $scope.beData.QRDetails = null;
        $scope.beData.PaymentResponse = null;
        $scope.beData.UniqueId = null;

        $timeout(function () {

            var sV = $scope.SelectedVoucher;
            var sC = $scope.SelectedCostClass;

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
                ReceivedAmount: 0,
                ChangeAmt: 0,
                RefVoucherType: 1,
                ProductCompanyId: null,
                Attributes: '',
                UDFFeildsColl: [],
				DocumentColl: [],
                PaymentTermColl: [],                
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
             
            if (sV) {
                $scope.SelectedVoucher = sV;
                $scope.beData.VoucherId = sV.VoucherId;
            }
            else {
                if ($scope.VoucherTypeColl.length > 0) {
                    $scope.SelectedVoucher = $scope.VoucherTypeColl[0];
                    $scope.beData.VoucherId = $scope.SelectedVoucher.VoucherId;
                }
            }

            if (sC) {
                $scope.SelectedCostClass = sC;
                $scope.beData.CostClassId = sC.CostClassId;
            } else {
                if ($scope.CostClassColl.length > 0) {
                    $scope.SelectedCostClass = $scope.CostClassColl[0];
                    $scope.beData.CostClassId = $scope.SelectedCostClass.CostClassId;
                }
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

            if ($scope.PaymentTermColl) {
                angular.forEach($scope.PaymentTermColl, function (pt) {
                    if (pt.IsCash == true && pt.LedgerId > 0) {
                        $scope.beData.PaymentTermColl.push({
                            Name: pt.Name,
                            PaymentTermsId: pt.PaymentTermsId,
                            LedgerId: pt.LedgerId,
                            Amount: 0,
                            Remarks: ''
                        });
                    }
                });
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

        $scope.loadingstatus = "stop";
        hidePleaseWait();
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
                ledAllocation.Formula = ac.Formula;
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

    function getRandomFileName() {
        var timestamp = new Date().toISOString().replace(/[-:.]/g, "");
        var random = ("" + Math.random()).substring(2, 8);
        var random_number = timestamp + random;
        return random_number;
    }
    function arrayBufferToBase64(buffer) {
        var binary = '';
        var bytes = new Uint8Array(buffer);
        var len = bytes.byteLength;
        for (var i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    }
    $scope.Print = function () {


        if ($scope.lastTranId || $scope.lastVoucherId > 0) {
            var TranId = $scope.lastTranId;

            var vId = $scope.lastVoucherId;

            var PrintPreviewAs = $scope.SelectedVoucher.PrintPreviewAs;

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
                        var selectedRpt = null;
                        if (templatesColl.length == 1) {
                            selectedRpt = templatesColl[0];
                            rptTranId = templatesColl[0].RptTranId;
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

                                                if (PrintPreviewAs == 2) {
                                                    var newURL = base_url + "newpdfviewer.ashx?rpttranid=" + rptTranId + "&istransaction=true&entityid=" + EntityId + "&voucherid=" + vId + "&tranid=" + TranId + "&vouchertype=" + VoucherType;
                                                    window.open(newURL);
                                                } else if (PrintPreviewAs == 3) {
                                                    var printPara = {
                                                        rpttranid: rptTranId,
                                                        istransaction: true,
                                                        entityid: EntityId,
                                                        voucherid: vId,
                                                        tranid: TranId,
                                                        vouchertype: VoucherType,
                                                    };
                                                    $http({
                                                        method: 'POST',
                                                        url: base_url + "Global/PrintVoucher",
                                                        headers: { 'Content-Type': undefined },

                                                        transformRequest: function (data) {

                                                            var formData = new FormData();
                                                            formData.append("jsonData", angular.toJson(data.jsonData));

                                                            return formData;
                                                        },
                                                        data: { jsonData: printPara }
                                                    }).then(function (res) {

                                                        $scope.loadingstatus = "stop";
                                                        hidePleaseWait();

                                                        if (res.data.IsSuccess == true) {
                                                            var filePath = res.data.ResponseMSG;
                                                            $scope.PrintFile(filePath, '');
                                                        }

                                                    }, function (errormessage) {
                                                        hidePleaseWait();
                                                        $scope.loadingstatus = "stop";

                                                    });

                                                }
                                                else {
                                                    document.body.style.cursor = 'wait';
                                                    document.getElementById("frmRpt").src = '';
                                                    document.getElementById("frmRpt").src = base_url + "web/ReportViewer.aspx?rpttranid=" + rptTranId + "&istransaction=true&entityid=" + EntityId + "&voucherid=" + vId + "&tranid=" + TranId + "&vouchertype=" + VoucherType;
                                                    document.body.style.cursor = 'default';
                                                    $('#FrmPrintReport').modal('show');
                                                }



                                            }
                                        } else {
                                            resolve('You need to select:)')
                                        }
                                    })
                                }
                            })
                        }

                        if (rptTranId > 0) {


                            if (PrintPreviewAs == 2) {
                                var newURL = base_url + "newpdfviewer.ashx?rpttranid=" + rptTranId + "&istransaction=true&entityid=" + EntityId + "&voucherid=" + vId + "&tranid=" + TranId + "&vouchertype=" + VoucherType;
                                window.open(newURL);
                            } else if (PrintPreviewAs == 3) {
                                var printPara = {
                                    rpttranid: rptTranId,
                                    istransaction: true,
                                    entityid: EntityId,
                                    voucherid: vId,
                                    tranid: TranId,
                                    vouchertype: VoucherType,
                                };
                                $http({
                                    method: 'POST',
                                    url: base_url + "Global/PrintVoucher",
                                    headers: { 'Content-Type': undefined },

                                    transformRequest: function (data) {

                                        var formData = new FormData();
                                        formData.append("jsonData", angular.toJson(data.jsonData));

                                        return formData;
                                    },
                                    data: { jsonData: printPara }
                                }).then(function (res) {

                                    $scope.loadingstatus = "stop";
                                    hidePleaseWait();

                                    if (res.data.IsSuccess == true) {
                                        var filePath = res.data.ResponseMSG;
                                        $scope.PrintFile(filePath, '');
                                    }

                                }, function (errormessage) {
                                    hidePleaseWait();
                                    $scope.loadingstatus = "stop";

                                });

                            }
                            else {
                                document.body.style.cursor = 'wait';
                                document.getElementById("frmRpt").src = '';
                                document.getElementById("frmRpt").src = base_url + "web/ReportViewer.aspx?rpttranid=" + rptTranId + "&istransaction=true&entityid=" + EntityId + "&voucherid=" + vId + "&tranid=" + TranId + "&vouchertype=" + VoucherType;
                                document.body.style.cursor = 'default';
                                $('#FrmPrintReport').modal('show');
                            }

                        }

                    } else
                        Swal.fire('No Templates found for print');
                }
            }, function (reason) {
                Swal.fire('Failed' + reason);
            });



        }
    };

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
                    url: base_url + "Inventory/Transaction/GetSalesInvoiceById",
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
            }, 100);

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
        if ($scope.beData.RefNo && $scope.beData.RefNo.length > 0 && $scope.beData.SalesInvoiceDetail.OtherRefereces && $scope.beData.SalesInvoiceDetail.OtherRefereces.length > 0) {
            if ($scope.beData.SalesInvoiceDetail.SSF)
                $('#frmSSFDetails').modal('show');
        }
    };
    $scope.SSFCodeLostFocus = function () {
        if ($scope.beData.SalesInvoiceDetail.OtherRefereces && $scope.beData.SalesInvoiceDetail.OtherRefereces.length > 0) {

        }
        else {
            $scope.beData.SalesInvoiceDetail.SSF = null;
        }
    }
    $scope.GetPatientById = function () {
        $scope.beData.SalesInvoiceDetail.SSF = null;
        $scope.beData.SalesInvoiceDetail.PatientId = null;
        if ($scope.beData.RefNo && $scope.beData.RefNo.length > 0) {

            $scope.loadingstatus = 'running';
            showPleaseWait();

            $http({
                method: 'GET',
                url: base_url + "Global/GetPatientDetails?patientId=" + $scope.beData.RefNo + '&voucherId=' + $scope.SelectedVoucher.VoucherId,
                dataType: "json"
            }).then(function (res1) {

                $scope.loadingstatus = 'stop';
                hidePleaseWait();

                var patient = res1.data.Data;
                if (patient.IsSuccess == true) {
                    $scope.beData.SalesInvoiceDetail.Buyes = patient.PatientName;
                    $scope.beData.SalesInvoiceDetail.Address = patient.Address;
                    $scope.beData.SalesInvoiceDetail.PhoneNo = patient.MobileNo;
                    $scope.beData.SalesInvoiceDetail.OtherRefereces = patient.ClaimCode;
                    $scope.beData.SalesInvoiceDetail.SSF = patient.SSF;
                    $scope.beData.SalesInvoiceDetail.PatientId = patient.PatientId;

                    if ($scope.beData.SalesInvoiceDetail.SSF) {
                        $scope.beData.SalesInvoiceDetail.SSF.SchemePer = patient.SchemePer;
                        $scope.beData.SalesInvoiceDetail.SSF.SchemeTypeId = patient.SchemeTypeId;
                    }


                } else {
                    $scope.beData.SalesInvoiceDetail.SSF = null;
                    $scope.beData.SalesInvoiceDetail.Buyes = '';
                    $scope.beData.SalesInvoiceDetail.Address = '';
                    $scope.beData.SalesInvoiceDetail.PhoneNo = '';
                    $scope.beData.SalesInvoiceDetail.OtherRefereces = '';
                    Swal.fire('Invalid Patient Id');
                }


            }, function (reason) {
                Swal.fire('Failed' + reason);
            });

        }
        else {
            $scope.beData.SalesInvoiceDetail.Buyes = '';
            $scope.beData.SalesInvoiceDetail.Address = '';
            $scope.beData.SalesInvoiceDetail.PhoneNo = '';
            $scope.beData.SalesInvoiceDetail.OtherRefereces = '';
        }
    };

    $scope.ChangeTenderAmt = function () {
        $scope.beData.ChangeAmt = $scope.beData.ReceivedAmount - $scope.beData.TotalAmount;
    }

    $scope.PendingVoucherColl = [];
    $scope.ShowPendingVoucherList = function () {

        $scope.PendingVoucherColl = [];
        if ($scope.beData.RefVoucherType == 2) {
            $scope.loadingstatus = 'running';
            showPleaseWait();
            var dateFrom = $filter('date')($scope.comDet.StartDate, 'yyyy-MM-dd');
            var dateTo = $filter('date')(new Date(), 'yyyy-MM-dd');
            var beData = {
                DateFrom: dateFrom,
                DateTo: dateTo,
                isPost: true,
                isPendingOnly: true,
                isClearOnly: false,
                branchId: $scope.SelectedVoucher.BDId,
            };
            $http({
                method: "POST",
                url: base_url + "Inventory/Reporting/GetPendingSalesOrder",
                data: JSON.stringify(beData),
                dataType: "json"
            }).then(function (res) {

                $scope.loadingstatus = 'stop';
                hidePleaseWait();
                if (res.data.IsSuccess && res.data.Data) {
                    var dataColl = mx(res.data.Data);

                    var query = dataColl.groupBy(t => ({ TranId: t.TranId, VoucherId: t.VoucherId }));

                    angular.forEach(query, function (q) {

                        var fst = q.elements[0];

                        var newBeData = {
                            TranId: q.key.TranId,
                            VoucherId: q.key.VoucherId,
                            VoucherDate: fst.VoucherDateBS,
                            VoucherMiti: fst.VoucherDateBS,
                            Party: fst.Party,
                            Address: fst.Address,
                            DI_Name: fst.DI_Name,
                            Amount: mx(q.elements).sum(p1 => p1.OrderAmt),
                            VoucherNo: fst.VoucherNo,
                            ItemColl: q.elements
                        };
                        $scope.PendingVoucherColl.push(newBeData);
                    });
                    $('#newfrmSalesInvoiceDetailsModel').modal('show');

                } else
                    alert(res.data.ResponseMSG);

            }, function (reason) {
                $scope.loadingstatus = "stop";
                alert('Failed' + reason);
            });

        }
        else if ($scope.beData.RefVoucherType == 1) {
            $('#newfrmSalesInvoiceDetailsModel').modal('show');
        }



    }

    $scope.ChangeRefTranSelected = function (ind, tran) {
        var i = 0;
        angular.forEach($scope.PendingVoucherColl, function (ra) {

            if (ra.TranId != tran.TranId)
                ra.IsSelected = false;

            //if (ind != i) {
            //    ra.IsSelected = false;
            //}
            i++;
        });
    }
    $scope.MakeSalesInvice = function () {

        var refVType = $scope.beData.RefVoucherType;

        var selectedItem = null;
        angular.forEach($scope.PendingVoucherColl, function (pv) {
            if (pv.IsSelected == true && !selectedItem) {
                selectedItem = pv;
            }
        });

        if (selectedItem && selectedItem.ItemColl && selectedItem.ItemColl.length > 0) {

            var funName = "getPendingDeliveryNote";

            if (refVType == 1)
                funName = "getPendingDeliveryNote";
            else if (refVType == 2)
                funName = "getPendinSalesOrder";
            else if (refVType == 4)
                funName = "getPendinSalesAllotment";

            var vDate = null;

            if ($scope.beData.VoucherDateDet) {
                vDate = $filter('date')(new Date($scope.beData.VoucherDateDet.dateAD), 'yyyy-MM-dd');
            } else
                vDate = $filter('date')(new Date(), 'yyyy-MM-dd');

            var para = "ledgerId=0&agentId=0&voucherDate=" + vDate + "&orderTranId=" + selectedItem.TranId;
            $http({
                method: 'GET',
                url: base_url + "Inventory/Transaction/" + funName + "?" + para,
                dataType: "json"
            }).then(function (res1) {
                if (res1.data.IsSuccess && res1.data.Data) {
                    var RefItemAllocationColl = res1.data.Data;

                    if (RefItemAllocationColl && RefItemAllocationColl.length > 0) {
                        $scope.beData.PartyLedger = null;
                        $scope.beData.RefNo = selectedItem.VoucherNo;
                        $scope.beData.PartyLedgerId = RefItemAllocationColl[0].PartyLedgerId;

                        if (selectedItem && selectedItem.ItemColl && selectedItem.ItemColl.length > 0) {
                            if (selectedItem.ItemColl[0].DI_Id > 0)
                                $scope.beData.AgentId = selectedItem.ItemColl[0].DI_Id;
                        }

                        $scope.beData.ItemDetailsColl = [];
                        var tmpItemAllocationColl = [];
                        angular.forEach(RefItemAllocationColl, function (fd) {
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
                                DeliveryNoteItemAllocationId: refVType == 1 ? fd.ItemAllocationId : null,
                                OrderItemAllocationId: refVType == 2 ? fd.ItemAllocationId : null,
                            };
                            tmpItemAllocationColl.push(refItem);
                        });

                        $timeout(function () {

                            $scope.loadingstatus = 'running';
                            showPleaseWait();

                            var newSales = {
                                ItemAllocationColl: tmpItemAllocationColl
                            };

                            //var fnName = refVType == 2 ? 'GetSalesOrderDetailsByItemAllocationId' : 'GetDeliveryNoteDetailsByItemAllocationId';
                            if (refVType == 1)
                                fnName = 'GetDeliveryNoteDetailsByItemAllocationId';
                            else if (refVType == 2)
                                fnName = 'GetSalesOrderDetailsByItemAllocationId';
                            else if (refVType == 3)
                                fnName = 'GetSalesQuotaionDetailsByItemAllocationId';
                            else if (refVType == 4)
                                fnName = 'GetSalesAllotmentDetailsByItemAllocationId';

                            $http({
                                method: 'POST',
                                url: base_url + "Inventory/Transaction/" + fnName,
                                headers: { 'Content-Type': undefined },

                                transformRequest: function (data) {
                                    var formData = new FormData();
                                    formData.append("jsonData", angular.toJson(data.jsonData));
                                    return formData;
                                },
                                data: { jsonData: newSales }
                            }).then(function (res1) {

                                $scope.loadingstatus = "stop";
                                hidePleaseWait();
                                if (res1.data.IsSuccess == true) {

                                    angular.forEach(res1.data.Data.ItemAllocationColl, function (ias) {
                                        ias.RowType = 'P';
                                        ias.Narration = ias.Narration;
                                        ias.ReadOnlyQty = $scope.SelectedVoucher.Product.RefQtyAs == 2 ? true : false;
                                        $scope.beData.ItemDetailsColl.push(ias);
                                    });

                                    angular.forEach(res1.data.Data.AditionalCostColl, function (ads) {
                                        $scope.beData.ItemDetailsColl.push({
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
                                            CanEditRate: true,
                                            ALValue1: 0,
                                            ALValue2: 0,
                                            ALUnitId1: null,
                                            ALUnitId2: null,
                                            SchemeAmt: 0,
                                            SchemeAmt: 0,
                                            QtyDecimal: 2,
                                            RateDecimal: 2,
                                            AmountDecimal: 2,
                                            Narration: ads.Narration
                                        });
                                    })
                                    //$timeout(function () {
                                    //   // angular.forEach(res1.Data.)
                                    //});

                                    $scope.RecalculateAdditioncalCost();
                                    $scope.CalculateTotalAndSubTotal();
                                    $scope.beData.SalesInvoiceDetail = {};

                                    if ($scope.beData.PartyLedger) {
                                        $scope.beData.SalesInvoiceDetail.Buyes = $scope.beData.PartyLedger.Name;
                                        $scope.beData.SalesInvoiceDetail.Address = $scope.beData.PartyLedger.Address;
                                        $scope.beData.SalesInvoiceDetail.SalesTaxNo = $scope.beData.PartyLedger.PanVat;
                                        $scope.beData.SalesInvoiceDetail.PhoneNo = $scope.beData.PartyLedger.MobileNo1;

                                        if ($scope.SelectedVoucher.CanChangeLedgerAndAgent == true) {
                                            $scope.beData.AgentId = $scope.beData.PartyLedger.AgentId;
                                        }
                                    }


                                    if ($scope.SelectedVoucher.AditionalChargeColl && $scope.SelectedVoucher.IsAbbInvoice == false) {
                                        var itemInd = $scope.beData.ItemDetailsColl.length;
                                        for (var lInd = 0; lInd < $scope.SelectedVoucher.AditionalChargeColl.length; lInd++) {
                                            var ac = $scope.SelectedVoucher.AditionalChargeColl[lInd];
                                            $scope.AddRowInLedgerDetails(itemInd);

                                            var mul = 1;
                                            if (ac.Sign != undefined)
                                                mul = (ac.Sign == true ? 1 : -1);

                                            var ledAllocation = $scope.beData.ItemDetailsColl[itemInd];
                                            ledAllocation.Formula = ac.Formula;
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

                                                    $scope.RecalculateAdditioncalCost();
                                                    $scope.CalculateTotalAndSubTotal();
                                                }
                                            }, function (reason) {
                                                alert('Failed' + reason);
                                            });

                                            itemInd++;
                                        }

                                    }


                                    $('#newfrmSalesInvoiceDetailsModel').modal('hide');
                                }

                            }, function (errormessage) {
                                hidePleaseWait();
                                //$scope.loadingstatus = "stop";
                                Swal.fire(errormessage);
                            });

                            //$http({
                            //    method: 'POST',
                            //    url: base_url + "Inventory/Transaction/" + fnName,
                            //    dataType: "json",
                            //    data: JSON.stringify(newSales)
                            //}).then(function (res1) {

                            //    $scope.loadingstatus = 'stop';
                            //    hidePleaseWait();




                            //}, function (reason) {
                            //    Swal.fire('Failed' + reason);
                            //});

                        });

                    }


                }
            }, function (reason) {
                Swal.fire('Failed' + reason);
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

    $scope.RefNoChanged = function () {
        if ($scope.comDet && $scope.comDet.Maintain == 5) {
            if (isEmptyObj($scope.beData.RefNo) == false)
                $scope.getJobCardDetails($scope.beData.RefNo);
        }
    }
    $scope.getJobCardDetails = function (jobNo) { }

    //$scope.getJobCardDetails = function (jobNo) {

    //    if (jobNo && jobNo.length > 0) {

    //        $scope.loadingstatus = "running";
    //        showPleaseWait();

    //        var para = {
    //            jobNo: jobNo,
    //            costClassId: $scope.SelectedCostClass.CostClassId,
    //            branchId: $scope.SelectedVoucher.BDId,
    //            ignoreClosed: true
    //        }

    //        $http({
    //            method: 'POST',
    //            url: base_url + "Service/Transaction/GetJobCardDetailsByJobNo",
    //            dataType: "json",
    //            data: JSON.stringify(para)
    //        }).then(function (resLD) {

    //            $scope.loadingstatus = 'stop';
    //            hidePleaseWait();

    //            if (resLD.data.Data && resLD.data.IsSuccess == true) {
    //                var dt = resLD.data.Data;

    //                $scope.beData.PartyLedgerId = dt.PartyId;
    //                $scope.beData.SalesInvoiceDetail.VinNo = dt.VinNo;
    //                $scope.beData.SalesInvoiceDetail.ChassisNo = dt.ChassisNo;
    //                $scope.beData.SalesInvoiceDetail.EngineNo = dt.EngineNo;
    //                $scope.beData.SalesInvoiceDetail.RegdNo = dt.RegdNo;
    //                $scope.beData.SalesInvoiceDetail.Buyes = dt.Party;
    //                $scope.beData.SalesInvoiceDetail.JobCardTranId = dt.TranId;

    //                var para1 = {
    //                    BranchId: para.branchId,
    //                    CostClassId: para.costClassId,
    //                    JobCardId: dt.TranId,
    //                    IgnoreBalanceQty: true,
    //                }
    //                $http({
    //                    method: 'POST',
    //                    url: base_url + "Service/Transaction/getPartsDemandByJobCardId",
    //                    dataType: "json",
    //                    data: JSON.stringify(para1)
    //                }).then(function (resDC) {

    //                    $scope.loadingstatus = 'stop';
    //                    hidePleaseWait();

    //                    if (resDC.data.Data && resDC.data.IsSuccess == true) {
    //                        var partsColl = resDC.data.Data;

    //                        $scope.beData.ItemDetailsColl = [];
    //                        var tmpItemAllocationColl = [];
    //                        angular.forEach(partsColl, function (pc) {
    //                            pc.TotalIssueQty = pc.IssueQty1 + pc.IssueQty2 + pc.IssueQty3 - pc.ReturnQty;

    //                            if (pc.TotalIssueQty > 0) {
    //                                var refItem = {
    //                                    RowType: 'P',
    //                                    ProductId: pc.ProductId,
    //                                    productDetail: null,
    //                                    ActualQty: pc.TotalIssueQty,
    //                                    BilledQty: pc.TotalIssueQty,
    //                                    FreeQty: 0,
    //                                    Rate: pc.Rate,
    //                                    DiscountPer: 0,
    //                                    DiscountAmt: 0,
    //                                    SchameAmt: 0,
    //                                    SchamePer: 0,
    //                                    Amount: (pc.Rate * pc.TotalIssueQty),
    //                                    Description: pc.Remarks,
    //                                    QtyPoint: 0,
    //                                    UnitId: pc.UnitId,
    //                                    CanEditRate: false,
    //                                    ALValue1: 0,
    //                                    ALValue2: 0,
    //                                    ALUnitId1: 0,
    //                                    ALUnitId2: 0,
    //                                    SchemeAmt: 0,
    //                                    SchemeRate: 0,
    //                                    ExciseAbleQty: 0,
    //                                    ExciseAbtAmt: 0,
    //                                    VatAbleAmt: 0,
    //                                    VatRate: 0,
    //                                    VatAmount: 0,
    //                                    ExDutyRate: 0,
    //                                    ExDutyAmount: 0,
    //                                    QtyDecimal: 2,
    //                                    RateDecimal: 2,
    //                                    AmountDecimal: 2,
    //                                    GodownId: (pc.GodownId && pc.GodownId > 0 ? pc.GodownId : $scope.beData.GodownId),
    //                                    Narration: '',
    //                                    RefQty: pc.TotalIssueQty,
    //                                    DeliveryNoteItemAllocationId: null,
    //                                    OrderItemAllocationId: null,
    //                                };
    //                                tmpItemAllocationColl.push(refItem);
    //                            }

    //                        });


    //                        angular.forEach(tmpItemAllocationColl, function (ias) {
    //                            $scope.beData.ItemDetailsColl.push(ias);
    //                        });

    //                        if ($scope.SelectedVoucher.AditionalChargeColl && $scope.SelectedVoucher.IsAbbInvoice == false) {
    //                            var itemInd = $scope.beData.ItemDetailsColl.length;
    //                            for (var lInd = 0; lInd < $scope.SelectedVoucher.AditionalChargeColl.length; lInd++) {
    //                                var ac = $scope.SelectedVoucher.AditionalChargeColl[lInd];
    //                                $scope.AddRowInLedgerDetails(itemInd);

    //                                var mul = 1;
    //                                if (ac.Sign != undefined)
    //                                    mul = (ac.Sign == true ? 1 : -1);

    //                                var ledAllocation = $scope.beData.ItemDetailsColl[itemInd];
    //                                ledAllocation.CanEditRate = ac.CanEdit;
    //                                ledAllocation.LedgerId = ac.LedgerId;
    //                                ledAllocation.Rate = ac.Rate * mul;
    //                                ledAllocation.Amount = ac.Amount * mul;
    //                                ledAllocation.AutoCharge = true;
    //                                $scope.loadingstatus = 'running';
    //                                showPleaseWait();
    //                                $http({
    //                                    method: 'GET',
    //                                    url: base_url + "Global/GetLedgerDetail?LedgerId=" + ac.LedgerId + " & VoucherType=" + $scope.SelectedVoucher.VoucherType,
    //                                    dataType: "json"
    //                                }).then(function (resLD) {


    //                                    $scope.loadingstatus = 'stop';
    //                                    hidePleaseWait();

    //                                    if (resLD.data.IsSuccess && resLD.data.Data) {

    //                                        var llId = resLD.data.Data.LedgerId;
    //                                        angular.forEach($scope.beData.ItemDetailsColl, function (idLed) {
    //                                            if (idLed.RowType == 'L') {
    //                                                if (llId == idLed.LedgerId) {
    //                                                    idLed.costLedgerDetail = resLD.data.Data;
    //                                                }
    //                                            }
    //                                        });

    //                                        //ledAllocation.costLedgerDetail = resLD.data.Data
    //                                    }
    //                                }, function (reason) {
    //                                    alert('Failed' + reason);
    //                                });

    //                                itemInd++;
    //                            }

    //                        }


    //                        $scope.RecalculateAdditioncalCost();
    //                        $scope.CalculateTotalAndSubTotal();

    //                    } else {

    //                        Swal.fire('No Demand Found');
    //                    }

    //                }, function (reason) {
    //                    alert('Failed' + reason);
    //                });


    //            } else {
    //                Swal.fire(resLD.data.ResponseMSG);
    //            }

    //        }, function (reason) {
    //            alert('Failed' + reason);
    //        });

    //    }
    //}

    $scope.LoadProperties = function () {

        $scope.PropertiesColl = [];
        $scope.ColumnColl = [];

        var para = {
            path: $scope.ItemFilePath,
            table: $scope.SelectedSheet
        };

        $http.get(base_url + "Setup/Security/LoadAllColumnsFromSheetIA?path=" + para.path + "&table=" + para.table).then(
            function (res) {
                hidePleaseWait();
                $scope.loadingstatus = "stop";

                if (res.data.IsSuccess) {
                    angular.forEach(res.data.PropertiesColl, function (pr) {

                        if (pr != "ResponseMSG" && pr != "IsSuccess" && pr != "CUserId") {

                            var properDet =
                            {
                                PropertyName: pr.datatype,
                                Name: '',
                                DefaultValue: '',
                                Id: -1
                            };

                            $scope.PropertiesColl.push(properDet);
                        }
                    })

                    $scope.ColumnColl = res.data.ColumnColl;

                } else {
                    alert(res.data.ResponseMSG);
                }

                $scope.loadingstatus = 'stop';
            }
            , function (reason) {
                $scope.loadingstatus = 'stop';
                alert('Failed: ' + reason);
            }
        );

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

    $scope.ChangeFixedProductAmount = function (curFP, ind) {

        var totalQty = 0;
        var totalAmount = 0;
        if ($scope.CurItemAllocation) {

            angular.forEach($scope.CurItemAllocation.FixedProductColl, function (fp) {
                if (fp.EngineNo && fp.EngineNo.length > 0 && fp.IsSelected == true) {
                    totalQty++;

                    if (fp.Amount > 0)
                        totalAmount += fp.Amount;
                }
            });
        }

        $scope.CurItemAllocation.ActualQty = totalQty;
        $scope.CurItemAllocation.BilledQty = totalQty;
        $scope.CurItemAllocation.Amount = totalAmount;
        $scope.CurItemAllocation.Rate = totalAmount / totalQty;

        $scope.RecalculateAdditioncalCost();
        $scope.CalculateTotalAndSubTotal();
    };


    //$("#txtSerialBarcode").keyup(function (event) {
    //    if (event.keyCode === 13) {
    //        // $scope.barcodeScanned($scope.beData.ProductBarCode);
    //    }
    //});
    //$("#txtSerialBarcode").keydown(function (event) {
    //    if (event.keyCode === 13 && event.ctrlKey == true) {
    //        $scope.enginenoScanned($scope.beData.EngineNo);
    //    }
    //});
    $scope.enginenoScanned = function (barcode) {

        if (!barcode || barcode.length == 0)
            return;

        $scope.loadingstatus = 'running';
        showPleaseWait();

        angular.forEach($scope.CurItemAllocation.FixedProductColl, function (fp) {
            $timeout(function () {

                $scope.$apply(function () {
                    if (fp.EngineNo.trim() == barcode)
                        fp.IsSelected = true;
                });
            });

        });

        hidePleaseWait();
        $scope.loadingstatus = "stop";

    };

    $scope.PasteData = function (colName, ind) {
        var clipText = event.clipboardData.getData('text/plain');

        if (clipText) {

            if (colName == 'engineno') {
                var startInd = ind;
                $scope.loadingstatus = 'running';
                showPleaseWait();

                clipText.split("\n").forEach(function (line) {
                    if (line && line.length > 0) {

                        for (var ind = 0; ind < $scope.CurItemAllocation.FixedProductColl.length; ind++) {
                            var fp = $scope.CurItemAllocation.FixedProductColl[ind];
                            if (fp.EngineNo.trim() == line.trim()) {
                                fp.IsSelected = true;
                                break;
                            }
                        }
                        startInd++;
                    }
                });


                hidePleaseWait();
                $scope.loadingstatus = "stop";
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

    $scope.GenerateFonepayQR = function () {


        $scope.beData.QRDetails = null;
        $scope.beData.PaymentResponse = null;
        $scope.beData.UniqueId = null;

        if ($scope.IsValidData() == false)
            return;

        $scope.loadingstatus = "running";
        showPleaseWait();

        var fonepayWS = null;
        const uniqueId = `${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;

        $scope.beData.UniqueId = uniqueId;

        var reqData = {
            amount: $scope.beData.TotalAmount,
            uniqueId: uniqueId,
            customerName: ($scope.beData.SalesInvoiceDetail.Buyes ?  $scope.beData.SalesInvoiceDetail.Buyes : 'CASH'),
            mobileNo: ($scope.beData.SalesInvoiceDetail.ContactNo ? $scope.beData.SalesInvoiceDetail.ContactNo : 'CASH'),
        };

        $http({
            method: 'POST',
            url: base_url + "Inventory/Transaction/GenFonepayQR",
            headers: { 'Content-Type': undefined },

            transformRequest: function (data) {

                var formData = new FormData();
                formData.append("amount", data.jsonData.amount );
                formData.append("uniqueId", data.jsonData.uniqueId);
                formData.append("customerName", data.jsonData.customerName);
                formData.append("mobileNo", data.jsonData.mobileNo);

                return formData;
            },
            data: { jsonData: reqData }
        }).then(function (res) {

            $scope.loadingstatus = "stop";
            hidePleaseWait();

            if (res.data.IsSuccess == true)
            {
                var qrDet = res.data.Data;
                if (qrDet.QRImage && qrDet.QRImage.length > 0)
                {
                    $scope.beData.QRImage = qrDet.QRImage;
                    $scope.beData.QRDetails = qrDet;
                    $('#frmFonePayQry').modal('show');
                    $scope.connectFonepay(qrDet);
                }
                else
                {
                    Swal.fire(res.data.ResponseMSG);
                }
                
            }
            else {
                Swal.fire(res.data.ResponseMSG);
            }

        }, function (errormessage) {
            hidePleaseWait();
            //$scope.loadingstatus = "stop";
            Swal.fire(errormessage);
        });
    }

    var fonepayWS = null;
    $scope.connectFonepay=function(reqData)
    {
        // create a new websocket and connect     

        var websocket = new WebSocketEx(reqData.thirdpartyQrWebSocketUrl, '', function () {
            //messageBoard.append('* Connection open<br/>');
            fonepayWS = websocket;
            // ws.binaryType = "arraybuffer";
            // ws.send('{ "MSG":"Test Server" }');
        }, function (evt) {
            //messageBoard.append('* Connection closed<br/>');
            console.log('Unable To Connect With Print Server. Connection closed.');
            //alert('Unable To Connect With Print Server. Connection closed.');
        }, function (evt) {
            // On MSG Received
            console.log(evt);

            if (evt.data) {
                var res1 = JSON.parse(evt.data);
                if (res1.transactionStatus && res1.transactionStatus.length > 0) {
                    var res2 = JSON.parse(res1.transactionStatus);
                    if (res2.paymentSuccess && res2.paymentSuccess == true) {

                        if (res2.productNumber == $scope.beData.UniqueId)
                        {
                            $('#frmFonePayQry').modal('hide');
                            $scope.beData.ReceivedAmount = res2.amount;
                            $scope.beData.RefNo = res2.traceId;
                            $scope.beData.PaymentResponse = evt.data;
                            $scope.SaveSalesInvoice();
                        }
                        
                    }
                }
                
            }

        }, function (evt) {
            //On Error
            console.log(evt);

        });
    }

    $scope.FonepayQRStatus = function () {

        if (!$scope.beData.UniqueId || $scope.beData.UniqueId.length == 0)
            return;


        if (!$scope.beData.QRDetails)
            return;

        if (!$scope.beData.QRImage || $scope.beData.QRImage.length == 0)
            return;

        $scope.loadingstatus = "running";
        showPleaseWait();

        var reqData = {            
            uniqueId: $scope.beData.UniqueId,            
        };

        $http({
            method: 'POST',
            url: base_url + "Inventory/Transaction/FonepayQRStatus",
            headers: { 'Content-Type': undefined },

            transformRequest: function (data) {

                var formData = new FormData();                
                formData.append("uniqueId", data.jsonData.uniqueId);
                
                return formData;
            },
            data: { jsonData: reqData }
        }).then(function (res) {

            $scope.loadingstatus = "stop";
            hidePleaseWait();

            if (res.data.IsSuccess == true) {
                var qrDet = res.data.Data;
                if (qrDet.paymentStatus == true) {
                    $('#frmFonePayQry').modal('hide');
                    $scope.beData.ReceivedAmount = res2.requestedAmount;
                    $scope.beData.RefNo = res2.fonepayTraceId;
                    $scope.SaveSalesInvoice();
                } else {
                    var msg = qrDet.paymentStatus + ' of ' + qrDet.prn;
                    Swal.fire(msg);
                }
            }
            else {
                Swal.fire(res.data.ResponseMSG);
            }

        }, function (errormessage) {
            hidePleaseWait();
            //$scope.loadingstatus = "stop";
            Swal.fire(errormessage);
        });
    }
	
		$scope.ShowVoucher = function (voucherType, tranId) {
        GlobalServices.ShowVoucher(voucherType, tranId);       
    }

    $scope.DisplayOnScreen = function (amt) {

        //try {
        //    const port = await navigator.serial.requestPort(); // Request access to COM port
        //    await port.open({ baudRate: 9600 }); // Open the port with correct settings

        //    const writer = port.writable.getWriter();
        //    const data = new TextEncoder().encode(amt.toString());
        //    await writer.write(data);

        //    writer.releaseLock();
        //    await port.close();
        //    alert("Message sent to COM2 successfully!");
        //} catch (error) {
        //    console.error("Error:", error);
        //    alert("Failed to send data. Check console for errors.");
        //}

        //$http({
        //    method: 'GET',
        //    url: base_url + "Inventory/Transaction/ProcessPayment?totalAmount="+amt,
        //    dataType: "json",
        //}).then(function (res) {
        //    if (res.data.IsSuccess) {
               
        //    } else {
        //        Swal.fire(res.data.ResponseMSG);
        //    }
        //}, function (reason) {
        //    Swal.fire('Failed' + reason);
        //});
    }

    function is_touch_enabled() {
        return ('ontouchstart' in window) ||
            (navigator.maxTouchPoints > 0) ||
            (navigator.msMaxTouchPoints > 0);
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