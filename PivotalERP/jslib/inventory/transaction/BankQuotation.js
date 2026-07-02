app.controller('BankQuotationController', function ($scope, $http, $timeout, $filter, GlobalServices, $document) {
    $scope.Title = 'Bank Quotation';
    var glSrv = GlobalServices;
    LoadData();
    getBankNameList();
    getModelDescription();
    $scope.sideBarData = [];
    $scope.SelectedVoucher = null;
    $scope.SelectedCostClass = null;
    
    function LoadData()
    {
		 $scope.DefaultKeyValues_JSON = null;
        if (DefaultKeyValues && DefaultKeyValues.length > 0) {
            $scope.DefaultKeyValues_JSON = JSON.parse(decodeURIComponent(DefaultKeyValues));           
        }
		
		$scope.VoucherSearchOptions = [{ text: 'EngineNo', value: 'TS.EngineNo', searchType: 'text' },{ text: 'PartyName', value: 'TS.PartyName', searchType: 'text' }, { text: 'MobileNo', value: 'TS.MobileNo', searchType: 'text' }, { text: 'PartyAddress', value: 'TS.PartyAddress', searchType: 'text' }, { text: 'BankName', value: 'TS.BankName', searchType: 'text' }, { text: 'Quotation No.', value: 'TS.AutoManualNo', searchType: 'text' }, { text: 'Voucher', value: 'V.VoucherName', searchType: 'text' }, { text: 'CostClass', value: 'CC.Name', searchType: 'text' }, { text: 'VoucherDate', value: 'TS.VoucherDate', searchType: 'date' }, { text: 'Amount', value: 'TS.TotalAmount', searchType: 'number' }];
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
        

        $scope.beData = {
            TranId: 0,
            VoucherId: null,
            CostClassId:null,
            AutoVoucherNo: 0,
            AutoManualNo: '',
            VoucherDate: new Date(),
            VoucherDateDet: new Date(),
            BankName: '',
            BankBranch: '',
            PartyName: '',
            PartyAddress: '',
            MobileNo: '',
            Model: '',
            Narration: '',
            Price: 0,
            DiscountAmt: 0,
            TotalAmount: 0,
            PanVat: '',
            MFGYear:0
        };

        $scope.VoucherTypeColl = [];
        $scope.CostClassColl = [];
        $scope.VehicleModuleColl = [];

        $('.select2').select2({ allowClear: true, width: '100%', placeholder: 'select..' });

        if (VoucherType)
        {
            $timeout(function () {
                  var filterObjs_VoucherId = null;
            if ($scope.DefaultKeyValues_JSON) {
                try {
                    var findVoucherFilter = $scope.DefaultKeyValues_JSON["VoucherId"];
                    if (findVoucherFilter) {
                        filterObjs_VoucherId = JSON.parse(findVoucherFilter);
                    }
                } catch { }
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
                        $timeout(function () {
                            if ($scope.VoucherTypeColl.length > 0) {
                                $scope.SelectedVoucher = $scope.VoucherTypeColl[0];
                                $scope.beData.VoucherId = $scope.VoucherTypeColl[0].VoucherId;
                            }
                        });

                        $timeout(function () {
                            $scope.$apply(function () {
                                $scope.getVoucherNo();
                            });
                        });
                    }
                }, function (reason) {
                    alert('Failed' + reason);
                });
            });

            $timeout(function () {
                $http({
                    method: 'GET',
                    url: base_url + "Account/Creation/GetCostClassForEntry",
                    dataType: "json"
                }).then(function (res) {
                    if (res.data.IsSuccess && res.data.Data) {
                        $scope.CostClassColl = res.data.Data;

                        $timeout(function () {
                            if ($scope.CostClassColl.length > 0) {
                                $scope.SelectedCostClass = $scope.CostClassColl[0];
                                $scope.beData.CostClassId = $scope.CostClassColl[0].CostClassId;
                            }
                                
                        });

                        $timeout(function () {
                            $scope.$apply(function () {                               
                                $scope.getVoucherNo();
                            });
                        });

                    }
                }, function (reason) {
                    alert('Failed' + reason);
                });
            });

           

            $http({
                method: 'GET',
                url: base_url + "Service/Creation/GetVehicleModelList",
                dataType: "json"
            }).then(function (res) {
                if (res.data.IsSuccess && res.data.Data) {
                    $scope.VehicleModuleColl = res.data.Data;                    
                }
            }, function (reason) {
                alert('Failed' + reason);
            });

        }

        $timeout(function () {
            $('#cboVoucherType').focus();
        })
        

        
    }
    $scope.ShowSideBar = function () {
        $('#sidebarzz').toggleClass('active');
    };

    $scope.OnPartyLoad = function () {
        // $scope.loadingstatus = 'running';
    };

    $scope.OnProductLoad = function () {

        // $scope.loadingstatus = 'running';
    };

    $scope.AddBankQuotation = function () {

        $scope.loadingstatus = "running";
        showPleaseWait();

        if ($scope.beData.VoucherDateDet) {

            if (moment($scope.beData.VoucherDateDet).isValid())
                $scope.beData.VoucherDate = $filter('date')(new Date($scope.beData.VoucherDateDet), 'yyyy-MM-dd');
            else
                $scope.beData.VoucherDate = $filter('date')(new Date($scope.beData.VoucherDateDet.dateAD), 'yyyy-MM-dd');
        }

        $http({
            method: 'POST',
            url: base_url + "Inventory/Transaction/SaveUpdateBankQuotation",
            headers: { 'Content-Type': undefined },

            transformRequest: function (data) {

                var formData = new FormData();
                formData.append("jsonData", angular.toJson(data.jsonData));
           
                return formData;
            },            
            data: { jsonData: $scope.beData }
        }).then(function (res) {

            $scope.loadingstatus = "stop";
            hidePleaseWait();

            alert(res.data.ResponseMSG);
      
            if (res.data.IsSuccess == true) {
                $scope.lastTranId = res.data.Data.RId;

                if ($scope.SelectedVoucher.PrintVoucherAfterSaving == true)
                    $scope.Print();

                $scope.Clear();
                $('#txtEngineNo').focus();
            }

        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";

        });

    }
    $scope.Print = function () {
        if ($scope.lastTranId && $scope.lastTranId > 0) {
            var TranId = $scope.lastTranId;

            $http({
                method: 'GET',
                url: base_url + "ReportEngine/GetReportTemplates?entityId=" + EntityId + "&voucherId=" + $scope.SelectedVoucher.VoucherId + "&isTran=true",
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

                        var printed = false;
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
                                            printed = true;
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

                        if (rptTranId > 0 && printed == false) {
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

    $scope.getVoucherNo = function ()
    {
        if ($scope.beData.VoucherId > 0)
            $scope.SelectedVoucher = mx($scope.VoucherTypeColl).firstOrDefault(p1 => p1.VoucherId == $scope.beData.VoucherId);

        if ($scope.beData.CostClassId > 0)
            $scope.SelectedCostClass = mx($scope.CostClassColl).firstOrDefault(p1 => p1.CostClassId == $scope.beData.CostClassId);

        if ($scope.beData.VoucherId && $scope.beData.VoucherId > 0) {
            if ($scope.beData.CostClassId && $scope.beData.CostClassId > 0)
            {
             
                var para = {
                    voucherId: $scope.beData.VoucherId,
                    costClassId: $scope.beData.CostClassId,
                    voucherDate: $scope.beData.VoucherDateDet ? ($scope.beData.VoucherDateDet.dateAD ? $scope.beData.VoucherDateDet.dateAD : $scope.beData.VoucherDateDet ) : new Date()  
                };

                $timeout(function () {
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
                            alert(res.data.ResponseMSG);
                        }
                    }, function (reason) {
                        alert('Failed' + reason);
                    });
                });
               

                $timeout(function ()
                {
                    $http({
                        method: 'GET',
                        url: base_url + "Account/Creation/GetVoucherModeById?voucherId=" + $scope.beData.VoucherId,
                        dataType: "json",
                        //data: JSON.stringify(para)
                    }).then(function (res) {
                        if (res.data.IsSuccess && res.data.Data) {
                            $scope.SelectedVoucher = res.data.Data;
                        }
                    }, function (reason) {
                        alert('Failed' + reason);
                    });
                });
            }
        } else {
            $scope.beData.AutoManualNo = '';
            $scope.beData.AutoVoucherNo = 0;
        }
     
    }

    $scope.calculateDisAmt = function () {
        $scope.beData.TotalAmount = $scope.beData.Price - $scope.beData.DiscountAmt;
    }

    $scope.changeModel = function (mName)
    {
        if (mName) {

            var vModel = mx($scope.VehicleModuleColl).firstOrDefault(p1 => p1.Name == mName);
            if(vModel)
                $scope.beData.Narration = vModel.Description;
        }
    }

    $scope.Clear = function () {

        var vid = $scope.beData.VoucherId;
        var cid = $scope.beData.CostClassId;
        $scope.beData = {
            TranId: 0,
            VoucherId: vid,
            CostClassId: cid,
            AutoVoucherNo: 0,
            AutoManualNo: '',
            VoucherDate: new Date(),
            VoucherDateDet: new Date(),
            BankName: '',
            BankBranch: '',
            PartyName: '',
            PartyAddress: '',
            MobileNo: '',
            Model: '',
            Narration: '',
            Price: 0,
            DiscountAmt: 0,
            TotalAmount: 0,
            PanVat: '',
            MFGYear: 0
        };

        $timeout(function () {
            $scope.getVoucherNo();
        });
        $('#txtEngineNo').focus();
    }

    $scope.ClearVehicleDet = function () {
        $scope.beData.PartyName = '';
        $scope.beData.PartyAddress = '';
        $scope.beData.MobileNo = '';
        $scope.beData.SalesAllotmentTranId = 0;
        $scope.beData.PartyLedgerId = 0;
    }

    $scope.getVehilceDetails = function () {

        if ($scope.beData.EngineNo) {
            if ($scope.beData.EngineNo.length == 0)
                return;
        } else
            return;

        $http({
            method: 'GET',
            url: base_url + "Inventory/Transaction/getVehicleDetailsByEngNo?engineNo=" + $scope.beData.EngineNo,
            dataType: "json"
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                var vDet = res.data.Data;
                $scope.beData.PartyName = vDet.PartyName;                
                $scope.beData.PartyAddress = vDet.Address;
                $scope.beData.MobileNo = vDet.MobileNo1;
                $scope.beData.SalesAllotmentTranId = vDet.TranId;
                $scope.beData.PartyLedgerId = vDet.PartyLedgerId;
                $scope.beData.MFGYear = vDet.MFGYear;
                $scope.beData.Price = vDet.Rate;
                $scope.beData.DiscountAmt = vDet.DiscountAmt;
                $scope.beData.TotalAmount = vDet.Amount;
                $scope.beData.Model = vDet.Model;
            } else {
                $scope.ClearVehicleDet();
                alert(res.data.ResponseMSG + " " + $scope.beData.EngineNo);
                $scope.beData.EngineNo = '';
                $('#txtEngineNo').focus();
            }


        }, function (reason) {
            alert('Failed' + reason);
        });
    }

    function getModelDescription() {
        $scope.ModelDescriptionList = [];
        $http({
            method: 'GET',
            url: base_url + "Service/Creation/GetVehicleModelList",
            dataType: "json"
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                var dtColl = res.data.Data;
                angular.forEach(dtColl, function (dt) {
                    $scope.ModelDescriptionList.push(dt.Name);
                });
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
        //$scope.ModelDescriptionList = [
        //    "5075E-MFWD :Dual clutch,MFWD PADDY SEALED ,Greased,Sync shutle(TSS) ,Tilt Steering,Single SCV,DUAL PTO ,JD EQRL rockshaft,Front tire 12.4x24,18.4 x 30 ,ROPS,With EQRL & Go Home Feature,Seat With Arm rest,MFD ( 5 in 1),Clutch over riding indicator ,In-Line FIP,With Heater",
        //    "5405E MFWD :Dual clutch,MFWD PADDY SEALED ,Greased,Collar shift,12X4 Speed,Tilt Steering,Single SCV,DUAL PTO , JD Standard rockshaft,Front tire 11.2x24,16.9x30,Deluxe Seat,5 in 1 Cluster (MFD),Sway Bar,,,With Air Pre-Heater",
        //    "5310 MFWD  :Dual clutch,MFWD PADDY SEALED ,Greased,Collar shift,Hydraulic Steering,Single SCV,STD.PTO , JD Standard rockshaft,Front tire 9.5x24,16.9x28,,,Std Seat,Std Display",
        //    "5310 E     :Dual clutch,2wd Fixed Track Front Axle,Greased,Collar shift,Hydraulic Steering,STD.PTO , JD Standard rockshaft,Front tire  6.5x20,16.9x28,,,Std Seat,Std Display",
        //    "5050D FWD  :Single clutch,2wd Fixed Track Front Axle,Oiled Rear Axle for Non-Special application,Collar shift,,Open Op.Stn,Hydraulic Steering, STD.PTO ,MITA Standard Rockshaft,Front tire 7.5x16 ,16.9x28,Naturally Aspirated Engine",
        //    "5050D: Single clutch,2wd Fixed Track Front Axle,Oiled Rear Axle for Non-Special application,Collar shift,,Open Op.Stn,Hydraulic Steering, STD.PTO ,MITA Standard Rockshaft,Front tire 7.5x16 ,16.9x28,Naturally Aspirated Engine",
        //    "5205D: Dual clutch,2wd Fixed Track Front Axle,Oiled - 4 Pinion,Collar shift,Hydraulic Steering ,Reverse PTO,JD MQRL Rockshaft, Front tire 7.5x16 ,Rear Tire 14.9x28 Any Make,With Air Intake Pre-Heater",
        //    "5045D: Dual clutch,2wd Fixed Track Front Axle,Oiled Rear Axle for Non-Special application,Collar shift,Hydraulic Steering,DUAL PTO ,JD MQRL Rockshaft,Front tire 6.0x16,Rear Tire 14.9x28 Any Make,,MQRL",
        //    "5045D: Single clutch,2wd Fixed Track Front Axle,Oiled Rear Axle for Non-Special application,Collar shift,Hydraulic Steering,NO SCV ,STD.PTO ,MITA Standard Rockshaft,Front tire 6.0x16,Rear Tire 14.9x28 Any Make,,No MQRL",
        //    "5105DFWD: Single clutch,2wd Fixed Track Front Axle,Oiled,Collar shift,Hydraulic Steering, NO SCV ,STD.PTO ,MITA Standard Rockshaft, Front tire 8.0x18,13.6x28",
        //    "5105D: Single clutch,2wd Fixed Track Front Axle,Oiled,Collar shift,Hydraulic Steering, NO SCV ,STD.PTO ,MITA Standard Rockshaft, Front tire 6.0x16,13.6x28",
        //    "5036D: Single clutch,2wd Fixed Track Front Axle,Oiled,Collar shift,,Open Op.Stn,Hydraulic Steering,NO SCV ,STD.PTO ,MITA Standard Rockshaft,Front tire 6.0x16,13.6x28 ,Head lights LH Traffic",
        //    "PIAGGIO APE CITY PETROL CARGO 3 WHEELER 196.9C(EXTRA Plus)",
        //    "PIAGGIO APE CITY PETROL CARGO 3 WHEELER 196.9C(LDX)",
        //    "PIAGGIO APE CITY PETROL PASSENGER 3 WHEELER 196.9C(Deluxe)",
        //    "PIAGGIO APE CITY PETROL PASSENGER 3 WHEELER 196.9C(Deluxe) NXT",
        //    "PIAGGIO APE CITY PLUS PETROL PASSENGER 3 WHEELER230 CC",

        //];

    }

    function getBankNameList() {

        $scope.BanNameList = [];
        $http({
            method: 'GET',
            url: base_url + "Account/Creation/GetAllBank",
            dataType: "json"
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                var dtColl = res.data.Data;

                angular.forEach(dtColl, function (dt) {
                    $scope.BanNameList.push(dt.Name);
                });
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        //$scope.BanNameList = [
        //    "ACE DEVELOPMENT BANK Ltd.",
        //    "AGRICULTURE DEVELOPMENT BANK Ltd.",
        //    "ALPINE DEVELOPMENT BANK Ltd.",
        //    "APEX DEVELOPMENT BANK Ltd.",
        //    "ARANIKO DEVELOPMENT BANK Ltd.",
        //    "AXIS DEVELOPMENT BANK Ltd.",
        //    "BAGMARA SAHAKARI SANSTHA Ltd.",
        //    "BALEWA SAMUDAYIK BAHUDESIYA SAHAKARI SANSTHA Ltd.",
        //    "BANK OF KATHMANDU Ltd.",
        //    "BATIKA SAVING & CREDIT CO-OPERATIVE Ltd.",
        //    "BHANJYANG BACHAT TATHA RIN SAHAKARI SANSTHA Ltd.",
        //    "BHARGAV BIKAS BANK Ltd.",
        //    "BIRATLAXMI BIKAS BANK Ltd.",
        //    "BISHWA BIKAS BANK Ltd.",
        //    "CENTRAL FINANCE Ltd.",
        //    "CENTURY COMMERCIAL BANK Ltd.",
        //    "CHARALI SAVING & CO-OPERATIVE Ltd.",
        //    "CITIZENS BANK INTERNATIONAL Ltd.",
        //    "CITY EXPRESS FINANCE Ltd.",
        //    "CIVIL BANK Ltd.",
        //    "CLEAN ENERGY DEVELOPMENT BANK Ltd.",
        //    "COSMOS DEVELOPMENT BANK Ltd.",
        //    "DAVIS FALLS SAVING & CREDIT CO-OPERATIVE Ltd.",
        //    "DEVA BIKAS BANK Ltd.",
        //    "DEVIS FALLS SAVING & CREDIT CO-OPERTIVE Ltd.",
        //    "DHARAMPUR BACHAT TATHA RIN SAHAKARI SANSTHA Ltd.",            
        //    "DURADANDA SAVING & CREDIT CO-OPERATIVE",
        //    "EKTA BIKAS BANK Ltd.",
        //    "EVEREST AGRICULTURE CO-OPERATIVE Ltd.",
        //    "EVEREST BANK Ltd.",
        //    "EVEREST CO-OPERATIVE SOCIETY Ltd.",
        //    "EXCEL DEVELOPMENT BANK Ltd.",
        //    "FEWA BIKAS BANK Ltd.",
        //    "FEWA FINANCE Ltd.",
        //    "GAHUMUKHI BIKAS BANK Ltd.",
        //    "GALKOT BAHUDESHIYA SAHKARI SANSTHA Ltd.",
        //    "GANDAKI BIKAS BANK Ltd.",
        //    "GARIMA BIKAS BANK Ltd.",
        //    "GARIMA SAVING & CREDIT CO-OPERATIVE Ltd.",
        //    "GAURISHANKAR SAVING & CREDIT CO-OPERATIVE Ltd.",
        //    "GLOBAL IME BANK Ltd.",
        //    "GOODWILL FINANCE Ltd.",
        //    "GUHESWAI MERCHANT BANKING & FINANCE Ltd.",
        //    "GURKHAS FINANCE  Ltd.",            
        //    "HAMRO BIKAS BANK Ltd.",
        //    "HIMALI SAVING & CREDIT CO-OPERATIVE Ltd.",
        //    "HIMALYAN BANK Ltd.",            
        //    "HDFC FINANCE Ltd.",
        //    "ICFC DEVELOPMENT BANK Ltd.",
        //    "ICFC FINANCE Ltd.",
        //    "JANAKI FINANCE COMPANY Ltd.",
        //    "JANATA SAVING & CREDIT CO-OPERATIVE SOCIETY Ltd.",            
        //    "JANTA BANK NEPAL Ltd.",
        //    "JYOTI BIKAS BANK Ltd.",
        //    "KABELI BIKAS BANK Ltd.",
        //    "KAILASH BIKAS BANK Ltd.",
        //    "KALINCHOWK DEVELOPEMNT BANK Ltd.",            
        //    "KAMANA SEWA BIKAS BANK Ltd.",
        //    "KANCHAN DEVELOPMENT BANK Ltd.",
        //    "KANKAI BIKAS BANK Ltd.",
        //    "KASKI FINANCE Ltd.",
        //    "KASTMANDAP DEVELOPMENT BANK Ltd.",
        //    "KHANDBARI DEVELOPMENT BANK Ltd.",
        //    "KIST BANK Ltd.",
        //    "KUMARI BANK Ltd.",
        //    "LAXMI BANK Ltd.",
        //    "LAXMI DARSHAN TATHA BACHAT SAHAKARI SANSTHA Ltd.",
        //    "LUMBINI BANK Ltd.",
        //    "LUMBINI BIKASH BANK Ltd.",            
        //    "MACHHAPUCHCHHRE BANK Ltd.",
        //    "MACHHAPUCHHRE SAHAKARI SANSTHA Ltd.",
        //    "MADI MIDIM BACHAT TATHA RIN SAHAKARI SANSTHA Ltd.",            
        //    "MAHALAXMI BIKAS BANK Ltd.",
        //    "MALIKA BIKASH BANK Ltd.",
        //    "MANAKAMANA BIKASH BANK Ltd.",
        //    "MANAKAMANA CREDIT & CO-OPERATIVE Ltd.",            
        //    "MANASLU BIKAS BANK Ltd.",
        //    "MANJU SHREE FINANCE Ltd.",
        //    "MANKAMANA MAI MULTI PURPOSE CO-OPERATIVE Ltd.",
        //    "MANOKAMANA HIRE PURCHASE PVT. Ltd.",
        //    "MATRIBHUMI BIKAS BANK Ltd.",
        //    "MEGA BANK Ltd.",
        //    "MEGA BANK NEPAL Ltd.",
        //    "METRO DEVELOPMENT BANK Ltd.",
        //    "MILAN KRISHI SAHAKARI SANSTHA Ltd.",
        //    "MITERI DEVELOPMENT BANK Ltd.",
        //    "MUKTINATH BIKAS BANK Ltd.",
        //    "NABIL BANK Ltd.",
        //    "NABODIT BACHAT TATHA RIN SAHAKARI SANSTHA Ltd.",
        //    "NARAYANI NATIONAL FINANCE Ltd.",
        //    "NATIONAL CO-OPERATIVE BANK Ltd.",
        //    "NAVODAYA MULTIPURPOSE CO-OPERATIVE SOCIETY Ltd.",
        //    "NAVODIT RURAL SAVING & CREDIT CO-OPERATIVE Ltd.",
        //    "NAWAPRATIBHA SAVING & CREDIT CO-OPERATIVE Ltd.",
        //    "NCC BANK Ltd.",
        //    "NEPAL BANGALADESH BANK Ltd.",
        //    "NEPAL BANK Ltd.",
        //    "NEPAL COMMUNITY DEVELOPMENT BANK Ltd.",
        //    "NEPAL INVESTMENT BANK Ltd.",
        //    "NEPAL MULTIPURPOSE CO-OPERATIVE SOCIETY Ltd.",
        //    "NEPAL SBI BANK Ltd.",
        //    "NIC ASIA BANK Ltd.",
        //    "NMB BANK Ltd.",
        //    "OM DEVELOPMENT BANK Ltd.",
        //    "OM FINANCE Ltd.",
        //    "PACHRATI SAVING & CREDIT CO-OPERATIVE Ltd.",
        //    "PACIFIC DEVELOPMENT BANK Ltd.",            
        //    "PALUNG MULTIPURPOSE CO-OPERATIVE SOCIETY Ltd.",
        //    "POKHARA FINANCE Ltd.",
        //    "POKHARA ROYAL CO-OPERATIVE SOCIETY Ltd.",
        //    "PRABHU BANK Ltd.",            
        //    "PRIME COMMERCIAL BANK Ltd.",
        //    "PUBLIC DEVELOPMENT BANK Ltd.",
        //    "RASTRIYA BANIJYA BANK Ltd.",
        //    "RELIABLE DEVELOPMENT BANK Ltd.",
        //    "RESUNGA DEVELOPMENT BANK Ltd.",
        //    "RISING DEVELOPMENT BANK Ltd.",
        //    "RITU SAVING & CREDIT CO-OPERATIVE Ltd.",
        //    "ROYAL CO-OPERATIVE SOCIETY Ltd.",
        //    "SABHYA SAMATA SAVING & CREDIT CO-OPERATIVE Ltd.",
        //    "SAFAL BACHAT TATHA RIN SAHKARI SANSTHA Ltd.",
        //    "SAGARMATHA FINANCE Ltd.",
        //    "SAHYOGI BIKAS BANK Ltd.",
        //    "SALPA BIKASH BANK Ltd.",
        //    "SAMABRIDHI BKASH BANK Ltd.",
        //    "SAMYUKTA BHU.PU SAINIK SAVING & CREDIT CO-OPERATIVE Ltd.",
        //    "SANA KISAN KRISHI SAHAKARI SANSTHA Ltd.",
        //    "SANGRILA DEVELOPMENT BANK Ltd.",
        //    "SANIMA BANK Ltd.",
        //    "SAPTAKOSHI CREDIT & CO-OPERATIVE Ltd.",
        //    "SAPTAKOSHI DEVELOPMENT BANK Ltd.",
        //    "SEWA BIKAS BANK Ltd.",
        //    "SHANGRILA DEVELOPMENT BANK Ltd.",
        //    "SHINE RESUNGA DEVELOPMENT BANK Ltd.",
        //    "SHREE JAN KALYAN SAVING & CREDIT CO OPERATIVE Ltd.",
        //    "SHREE JANKEKTA BAHUDESHIYA SAHAKARI SANSTHA Ltd.",
        //    "SHREE PALUWA SAVING & CREDIT CO-OPERATIVE Ltd.",
        //    "SHRI BHANDAR PASHUPALAN BAHUUDDESHIYA SAHKARI SANSTHA Ltd.",
        //    "SIDDHARTHA BANK Ltd.",
        //    "SIDDHARTHA DEVELOPMENT BANK Ltd.",
        //    "SIDHESHEWAR BACHAT TATHA RIN SAHAKARISANSTHA Ltd.",
        //    "SINDHU BIKAS BANK Ltd.",
        //    "SOCIETY DEVELOPMENT BANK Ltd.",
        //    "SRIJANA FINANCE Ltd.",
        //    "SUNAULO BHAVISHYA SAVING & CREDIT CO-OPERATIVE Ltd.",            
        //    "SUNRISE BANK Ltd.",
        //    "SUPER SAVING & CREDIT CO-OPERATIVE Ltd.",
        //    "SUPREME DEVELOPMENT BANK Ltd.",
        //    "SURKSHA PALUWA SAVING & CREDIT CO-OPERATIVE Ltd.",
        //    "TOURISM DEVELOPMENT BANK Ltd.",
        //    "TRIVENI BIKAS BANK Ltd.",
        //    "UNION FINANCE Ltd.",
        //    "UNIQUE SAVING & CREDIT CO-OPERATIVE Ltd.",
        //    "UNITED FINANCE Ltd.",
        //    "VIBOR SOCIETY DEVELOPMENT BANK Ltd.",
        //    "WELFARE SAVING & CREDIT CO-OPRETIVE PVT Ltd.",
        //    "WESTERN DEVELOPMENT BANK Ltd.",
        //    "YETI DEVELOPMENT BANK Ltd.",
        //    "ZENITH FINANCE Ltd.",
        //];
    }

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
            $scope.$apply($scope.PrintVoucherAfterSaving);
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