app.controller('NamsariController', function ($scope, $http, $timeout, $filter, $compile, GlobalServices) {
    $scope.Title = 'Namsari';
    var glSrv = GlobalServices;
    LoadData();

    $scope.sideBarData = [];
    $scope.SelectedVoucher = null;
    $scope.SelectedCostClass = null;
    function LoadData() {

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
        


        $scope.NamsariTypes = [{ id: 1, text: 'CASH' }, { id: 2, text: 'MHPPL' }, { id: 3, text: 'BANK' }];

        $scope.LocationColl = [
            //{ sno: 1, name: 'मेचि अंचल', address: 'बिर्तामोड, झापा।' },
            //{ sno: 2, name: 'कोसी अंचल', address: 'ईटहरी, सुनसरी।' },
            //{ sno: 3, name: 'सगरमाथा अंचल', address: 'लहान, सिराहा ।' },
            //{ sno: 4, name: 'जनकपुर अंचल', address: 'जनकपुर,धनुषा।' },
            //{ sno: 5, name: 'नारायाणी अंचल', address: 'बिरगंज, पर्सा ।' },
            //{ sno: 6, name: 'बागमती प्रदेश', address: 'मकवानपुर, हेटौंडा÷कठमाण्डौं।' },
            //{ sno: 7, name: 'बागमती प्रदेश', address: 'कठमाण्डौं।' },
            //{ sno: 8, name: 'लुम्बिनी अंचल', address: 'बुटवल,रुपेनदेही।' },
            //{ sno: 9, name: 'कर्णाली प्रदेश', address: 'बिरेन्द«नगर,सुर्खेत,।' },
            //{ sno: 10, name: 'कर्णाली प्रदेश', address: 'घोराही,दाङ।' },
            //{ sno: 11, name: 'भेरी अंचल', address: 'नेपालगंज, बांके।' },
            //{ sno: 12, name: 'सेती अंचल', address: 'धनगडी, कैलाली।' },
            //{ sno: 13, name: 'महाकाली अंचल', address: 'महेन्द«नगर, कंचनपुर।' }            

            //  { sno: 1, name: 'Pradesh-1', address: 'Birtamod,Jhapa' },
            //{ sno: 2, name: 'Pradesh-1', address: 'Ithari,Sunsari' },
            //{ sno: 3, name: 'Madhesh Pradesh', address: 'Lahan,Siraha' },
            //{ sno: 4, name: 'Madhesh Pradesh', address: 'Birgunj,Parsa' },
            //{ sno: 5, name: 'Madhesh Pradesh', address: 'Janakpur,Dhanusha ' },
            //{ sno: 6, name: 'Bagmati Pradesh', address: 'Hetauda,Makwanpur' },
            //{ sno: 7, name: 'Bagmati Pradesh', address: 'Kathmandu' },
            //{ sno: 8, name: 'Lumbini  Zone-Butwal', address: 'Rupandehi' },
            //{ sno: 9, name: 'Karnali Pradesh', address: 'Birendranagar,Surkhet' },
            //{ sno: 10, name: 'Rapti Zone', address: 'Ghorahi,Dang' },
            //{ sno: 11, name: 'Bheri Zone', address: 'Nepalgunj,Banke' },
            //{ sno: 12, name: 'Seti Zone', address: 'Dhangadhi,Kailali' },
            //{ sno: 13, name: 'Mahakali Zone', address: 'Mahendranagar,Kanchanpur' },

            { sno: '!', name: 'k|b]z–!', address: 'latf{df]8, emfkf' },
            { sno: '@', name: 'k|b]z–!', address: "O{6x/L, ;'g;/L" },
            { sno: '#', name: 'dw]z k|b]z', address: 'nxfg, l;/fxf' },
            { sno: '$', name: 'dw]z k|b]z', address: 'la/u+h, k;f{' },
            { sno: '%', name: 'dw]z k|b]z', address: "hgsk'/, wg'iff" },
            { sno: '^', name: 'afudtL k|b]z', address: "x]6f}8f,dsjfgk'/" },
           { sno: '&', name: 'afudtL k|b]z', address: 'sf7df08f}' },
           { sno: '*', name: "n'lDagL c~rn", address: "a'6jn,?kGb]xL" },
            { sno: '(', name: 's0f{fnL k|b]z', address: "la/]Gb|gu/,;'v]{t" },
            { sno: '!)', name: '/fKtL c~rn', address: '3f]/fxL,bfË' },
            { sno: '!!', name: 'e]/L c~rn', address: 'g]kfnu+h,afFs]' },
            { sno: '!@', name: ';]tL c~rn', address: 'wgu9L,s}nfnL' },
            { sno: '!#', name: 'dxfsfnL c~rn', address: "dx]Gb|gu/,sGrgk'/" },
            ];

        $scope.VehicleTypesColl = [

            //{ sno: 1, name: 'जोन डियर ट्रेक्टर' },
            //{ sno: 2, name: 'पीआजियो ३ वीलर' }

            { sno: '!', name: "Hff]g l8o/ 6]«S6/" },
            { sno: '@', name: "kLoflhcf] # ljn/" }
        ];

     
        $scope.VehicleTypesColl = [];
        $http({
            method: 'GET',
            url: base_url + "Service/Creation/GetAllVehicleType",
            dataType: "json"
            //data:JSON.stringify(para)
        }).then(function (res)
        {
            var sno = 1;
            if (res.data.IsSuccess && res.data.Data) {
                var dtColl = res.data.Data;

                angular.forEach(dtColl, function (dc) {
                    $scope.VehicleTypesColl.push({
                        sno: sno,
                        name:dc.NameNP
                    });

                    sno++;
                });
            }  

        }, function (reason) {
            alert('Failed' + reason);
        });


        $scope.DistricColl = GetDistrictList();

        $scope.beData = {
            TranId: 0,            
            SalesAllotmentTranId: null,
            PartyLedgerId:null,
            QuotationNo: '',
            VoucherId: null,
            CostClassId: null,
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
            DoRefNo: '',
            EngineNo: '',
            ChassisNo: '',
            Segment: '',
            RegdNo: '',
            Model: '',
            MFGYear: 0,
            NamsariType: '',
            Loanee:'',
            NamsariLocation: ''
        };

        $scope.VoucherTypeColl = [];
        $scope.CostClassColl = [];
        $scope.VehicleModuleColl = [];

        $('.select2').select2({ allowClear: true, width: '100%', placeholder: 'select..' });

        if (VoucherType) {
            $timeout(function () {
                $http({
                    method: 'GET',
                    url: base_url + "Account/Creation/GetVoucherList?voucherType=" + VoucherType,
                    dataType: "json"
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

        $scope.showHide = {
            Bank: true,
            Loanee:true
        };
        
    }

    $scope.ChangeNamsariType = function () {

        $scope.showHide.Bank = false;
        $scope.showHide.Loanee = true;
        $scope.beData.Loanee = '';

        if ($scope.beData.NamsariType == 'CASH') {
            $scope.showHide.Bank = true;
        }
        else if ($scope.beData.NamsariType == 'MHPPL') {
            $scope.beData.Loanee = 'मनोकामना हायर पर्चेज प्रा. लि. , कान्तिपथ काठमाण्डौ';
            $scope.showHide.Loanee = false;
        }
    };
    $scope.ShowSideBar = function () {
        $('#sidebarzz').toggleClass('active');
    };

    $scope.OnPartyLoad = function () {
        // $scope.loadingstatus = 'running';
    };

    $scope.OnProductLoad = function () {

        // $scope.loadingstatus = 'running';
    };

    $scope.AddBankAllotment = function () {

        $scope.loadingstatus = "running";
        showPleaseWait();

        if ($scope.beData.VoucherDateDet) {
            if (moment($scope.beData.VoucherDateDet).isValid())
                $scope.beData.VoucherDate = $filter('date')(new Date($scope.beData.VoucherDateDet), 'yyyy-MM-dd');
            else
                $scope.beData.VoucherDate = $filter('date')(new Date($scope.beData.VoucherDateDet.dateAD), 'yyyy-MM-dd');
        }

        $scope.beData.DODate = $scope.beData.VoucherDate;


        $http({
            method: 'POST',
            url: base_url + "Inventory/Transaction/SaveUpdateNamsari",
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
	
	 $scope.reloadVoucherDate = function () {

        const container = angular.element(document.getElementById('dvDTVoucher'));
        container.empty(); // Clear the container

        $timeout(function () {
            const newElement = angular.element('<label for="inputEmail3" style="min-width: 100px;">{{SelectedVoucher.VoucherDateLabel ? SelectedVoucher.VoucherDateLabel : "Invoice Date"}}<span style="color:red">*</span></label> <input type="text"  class="form-control form-control-sm" date-picker ng-model="beData.VoucherDate_TMP" date-detail="beData.VoucherDateDet" confirm-action="getVoucherNoOnly()" title ="{{(SelectedVoucher.DateStyle==1 ? beData.VoucherDateDet.dateBS : (beData.VoucherDateDet.dateAD |dateFormat))}}" date-style="SelectedVoucher.DateStyle" id ="dtVoucherDate" voucherid ="SelectedVoucher.VoucherId" >');
            //container.append($compile(newElement)($scope));

            container.append(newElement);
            $compile(newElement)($scope);
        });
    };
	
    $scope.getVoucherNo = function () {
        if ($scope.beData.VoucherId && $scope.beData.VoucherId > 0) {
            if ($scope.beData.CostClassId && $scope.beData.CostClassId > 0) {
                var para = {
                    voucherId: $scope.beData.VoucherId,
                    costClassId: $scope.beData.CostClassId,
                    voucherDate: $scope.beData.VoucherDateDet ? ($filter('date')(new Date($scope.beData.VoucherDateDet.dateAD), 'yyyy-MM-dd')) : ($filter('date')(new Date(), 'yyyy-MM-dd'))
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


                $timeout(function () {
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
 
    $scope.getVehilceDetails = function () {

        if ($scope.beData.EngineNo) {
            if ($scope.beData.EngineNo.length == 0)
                return;
        } else
            return;

        $http({
            method: 'GET',
            url: base_url + "Inventory/Transaction/getBankDOByEngNo?engineNo=" + $scope.beData.EngineNo,
            dataType: "json"
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                var vDet = res.data.Data;
                $scope.beData.ChassisNo = vDet.ChassisNo;
                $scope.beData.RegdNo = vDet.RegdNo;
                $scope.beData.Model = vDet.Model;
                $scope.beData.Color = vDet.Color;
                $scope.beData.MFGYear = vDet.MFGYear;
                $scope.beData.SalesAllotmentTranId = vDet.TranId;
                $scope.beData.PartyLedgerId = vDet.PartyLedgerId;
                $scope.beData.PartyName = vDet.PartyName;
                $scope.beData.BankName = vDet.BankName;
                $scope.beData.BankBranch = vDet.BankBranch;
                $scope.beData.BankDORefNo = vDet.BankDORefNo;
                $scope.beData.BankDOTranId = vDet.BankDOTranId;
                $scope.beData.SalesAllotmentTranId = vDet.SalesAllotmentTranId;
            } else {
                $scope.ClearVehicleDet();
                alert(res.data.ResponseMSG + ' ' + $scope.beData.EngineNo);
                $scope.beData.EngineNo = '';
                $('#txtEngineNo').focus();
            }


        }, function (reason) {
            alert('Failed' + reason);
        });
    }

    $scope.getQuotationDet = function () {

        if ($scope.beData.DoRefNo) {
            if ($scope.beData.DoRefNo.length == 0)
                return;
        } else
            return;

        $http({
            method: 'GET',
            url: base_url + "Inventory/Transaction/getBankDOByRef?doRefNo=" + $scope.beData.DoRefNo,
            dataType: "json"
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                var vDet = res.data.Data;
                $scope.beData.BankName = vDet.BankName;
                $scope.beData.BankBranch = vDet.BankBranch;
                $scope.beData.PartyName = vDet.PartyName;
                $scope.beData.PartyAddress = vDet.PartyAddress;
                $scope.beData.MobileNo = vDet.MobileNo;
                $scope.beData.Narration = vDet.Narration;
                $scope.beData.BankDOTranId = vDet.TranId;
                $scope.beData.Price = vDet.TotalAmount;
            } else {
                $scope.beData.BankName = '';
                $scope.beData.BankBranch = '';
                $scope.beData.PartyName = '';
                $scope.beData.PartyAddress = '';
                $scope.beData.MobileNo = '';
                $scope.beData.Narration = '';
                $scope.beData.BankDOTranId = null;
                $scope.beData.Price = 0;
                alert(res.data.ResponseMSG);
                $('#txtBankDORefNo').focus();
            }


        }, function (reason) {
            alert('Failed' + reason);
        });
    }

    $scope.ClearVehicleDet = function () {
        $scope.beData.ChassisNo = '';
        $scope.beData.RegdNo = '';
        $scope.beData.Model = '';
        $scope.beData.Color = '';
        $scope.beData.MFGYear = 0;
        $scope.beData.SalesAllotmentTranId = null;
        $scope.beData.PartyLedgerId = null;

        $scope.beData.BankName = '';
        $scope.beData.BankBranch = '';
        $scope.beData.BankDORefNo = '';
        $scope.beData.BankDOTranId =null;
        $scope.beData.SalesAllotmentTranId = null;
    }
    $scope.Clear = function () {

        var vid = $scope.beData.VoucherId;
        var cid = $scope.beData.CostClassId;
        $scope.beData = {
            TranId: 0,
            SalesAllotmentTranId: null,
            PartyLedgerId: null,
            QuotationNo: '',
            VoucherId: null,
            CostClassId: null,
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
            DoRefNo: '',
            EngineNo: '',
            ChassisNo: '',
            Segment: '',
            RegdNo: '',
            Model: '',
            MFGYear: 0,
            NamsariType: '',
            Loanee: '',
            NamsariLocation: ''
        };

        $timeout(function () {
            $scope.getVoucherNo();
        });
        $('#txtBankDORefNo').focus();
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