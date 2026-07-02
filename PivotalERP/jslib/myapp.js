//agGrid.LicenseManager.setLicenseKey("==931880529fd1f843daf745e6af1c1637");
agGrid.initialiseAgGridWithAngular1(angular);
var app = angular.module("myApp", ['agGrid', 'angularUtils.directives.dirPagination']);
var usr_Id = '';
var customer_Code = '';

//var app = angular.module("myApp", ['agGrid', 'angularUtils.directives.dirPagination', 'cfp.hotkeys']);

app.value('companyDet',
    {
        Name: '',
        MailingName: '',
        Address: '',
        RegdNo: '',
        PanVatNo: '',
        PhoneNo: '',
        FaxNo: '',
        EmailId: '',
        WebSite: '',
        StartDateAD: '',
        EndDateAD: '',
        StartDateBS: '',
        EndDateBS: ''
    });

app.value('generalConfig',
    {
        DateStyle: 1,
        NoOfDecimal:0,
    });

app.controller('mainController', ['$scope', '$http', '$timeout', 'companyDet', 'generalConfig', function ($scope, $http, $timeout, companyDet, generalConfig) {
    

    $scope.generalConfig = generalConfig;
    $scope.companyDet = {};
    $scope.UserType = '';
    window.OneSignalDeferred = window.OneSignalDeferred || [];

    LoadData();
 
    function LoadData()
    {
        generalConfig.DateStyle = 2;
        generalConfig.NoOfDecimal = 2;
       // $('#PetrolPumpModal').modal('show');

        $scope.CustomerModuleColl = [];
        $scope.Modules = {
            Account:false,
            Inventory: false,
            Payroll: false,
            Budget: false,
            SMS: false,
            Setup: false,
            ReportEngine: false,
            Finance: false,
            Service: false,
            Help: false,
            Enquiry: false,
            QuickAccess: false,
            IRD_Audit: false,
            MIS_Reports: false,
            App_CMS:false,
            HR: false,
            ServiceCRM:false,
        };

        $timeout(function () {
            $http({
                method: 'POST',
                url: base_url + "Setup/Security/GetUserWiseModule",
                dataType: "json"
            }).then(function (res) {
                if (res.data.IsSuccess && res.data.Data) {
                    var allowModules = mx(res.data.Data);

                    angular.forEach(res.data.Data, function (md) {
                        if (md.ModuleId >= 1000) {
                            $scope.CustomerModuleColl.push(md);
                        }
                    });
                    //Account, Inventory, Payroll, Budget, SMS, Setup, ReportEngine,
                      //  

                    var f1 = allowModules.firstOrDefault(p1 => p1.ModuleId == 0);
                    if (f1)
                        $scope.Modules.Account = true;

                    var f2 = allowModules.firstOrDefault(p1 => p1.ModuleId == 1);
                    if (f2)
                        $scope.Modules.Inventory = true;

                    var f3 = allowModules.firstOrDefault(p1 => p1.ModuleId == 2);
                    if (f3)
                        $scope.Modules.Payroll = true;

                    var f4 = allowModules.firstOrDefault(p1 => p1.ModuleId == 3);
                    if (f4)
                        $scope.Modules.Budget = true;

                    var f5 = allowModules.firstOrDefault(p1 => p1.ModuleId == 4);
                    if (f5)
                        $scope.Modules.SMS = true;

                    var f6 = allowModules.firstOrDefault(p1 => p1.ModuleId == 5);
                    if (f6)
                        $scope.Modules.Setup = true;

                    var f7 = allowModules.firstOrDefault(p1 => p1.ModuleId == 6);
                    if (f7)
                        $scope.Modules.ReportEngine = true;
                    
                    var f8 = allowModules.firstOrDefault(p1 => p1.ModuleId == 7);
                    if (f8)
                        $scope.Modules.Finance = true;

                    var f9 = allowModules.firstOrDefault(p1 => p1.ModuleId == 8);
                    if (f9)
                        $scope.Modules.Service = true;

                    var f10 = allowModules.firstOrDefault(p1 => p1.ModuleId == 9);
                    if (f10)
                        $scope.Modules.Help = true;

                     
                    var f11 = allowModules.firstOrDefault(p1 => p1.ModuleId == 10);
                    if (f11)
                        $scope.Modules.Enquiry = true;

                    var f12 = allowModules.firstOrDefault(p1 => p1.ModuleId == 11);
                    if (f12)
                        $scope.Modules.QuickAccess = true;

                    var f13 = allowModules.firstOrDefault(p1 => p1.ModuleId == 12);
                    if (f13)
                        $scope.Modules.IRD_Audit = true;

                    var f14 = allowModules.firstOrDefault(p1 => p1.ModuleId == 13);
                    if (f14)
                        $scope.Modules.MIS_Reports = true;

                    var f14 = allowModules.firstOrDefault(p1 => p1.ModuleId == 14);
                    if (f14)
                        $scope.Modules.App_CMS = true;

                    var f14 = allowModules.firstOrDefault(p1 => p1.ModuleId == 15);
                    if (f14)
                        $scope.Modules.HR = true;

                    var f15 = allowModules.firstOrDefault(p1 => p1.ModuleId == 16);
                    if (f15)
                        $scope.Modules.ServiceCRM = true;
                }
            }, function (reason) {
                Swal.fire('Failed' + reason);
            });
        });


        $scope.CustomEntityColl = [];
        $timeout(function () {
            $http({
                method: 'GET',
                url: base_url + "Setup/Security/GetModuleMenu",
                dataType: "json"
            }).then(function (res) {
                if (res.data.IsSuccess && res.data.Data) {
                    angular.forEach(res.data.Data, function (ec) {
                        if (ec.PageURL.length > 0)
                            $scope.CustomEntityColl.push(ec);
                    });
                }
            }, function (reason) {
                Swal.fire('Failed' + reason);
            });
        });

       

        $scope.EntityColl = [];  
        $timeout(function () {
            $http({
                method: 'POST',
                url: base_url + "Setup/Security/GetEntityView",
                dataType: "json"
            }).then(function (res) {
                if (res.data.IsSuccess && res.data.Data) {                   
                    angular.forEach(res.data.Data, function (ec) {
                        if(ec.PageURL.length>0)
                            $scope.EntityColl.push(ec);
                    });  
                }
            }, function (reason) {
                Swal.fire('Failed' + reason);
            });
        });


        $scope.DashboardTypeColl = [];
        $timeout(function () {
            $http({
                method: 'POST',
                url: base_url + "Setup/ReportWriter/GetDashboardTypeForUser",
                dataType: "json"
            }).then(function (res) {
                if (res.data.IsSuccess && res.data.Data) {
                    $scope.DashboardTypeColl = res.data.Data;
                }
            }, function (reason) {
                Swal.fire('Failed' + reason);
            });
        });

        
        $scope.UserDefineRptColl = [];        
        $http.post(base_url + "Setup/ReportWriter/GetAllReportMenu").then(
            function (res)
            {
                if (res.data.IsSuccess == true) {
                    $scope.UserDefineRptColl = res.data.Data;
                }                
            }, function (reason) {
                alert('Failed: ' + reason);
        });


        $scope.NewEntityColl = [];
        $http.post(base_url + "Setup/ReportWriter/GetNewEntityMenu").then(
            function (res) {
                if (res.data.IsSuccess == true) {
                    $scope.NewEntityColl = res.data.Data;
                }
            }, function (reason) {
                alert('Failed: ' + reason);
        });

        $http({
            method: 'GET',
            url: base_url + "Global/GetCompanyDetail",
            dataType: "json"
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data)
            {
                var comDet = res.data.Data;
                $scope.companyDet = comDet;

                companyDet.Name = comDet.Name;
                companyDet.MailingName = comDet.MailingName;
                companyDet.Address = comDet.Address;
                companyDet.RegdNo = comDet.RegdNo;
                companyDet.PanVatNo = comDet.PanVatNo;
                companyDet.PhoneNo = comDet.PhoneNo;
                companyDet.FaxNo = comDet.FaxNo;
                companyDet.EmailId = comDet.EmailId;
                companyDet.WebSite = comDet.WebSite;
                companyDet.StartDateAD = comDet.StartDate;
                companyDet.EndDateAD = comDet.EndDate;
                companyDet.StartDateBS = comDet.StartDateBS;
                companyDet.EndDateBS = comDet.EndDateBS;                  

            } else
                alert(res.data.ResponseMSG);

        }, function (reason) {
            alert('Failed' + reason);
        });


     

        $http({
            method: 'GET',
            url: base_url + "Global/GetNotificationIdKey",
            dataType: "json"
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                var notDet = res.data.Data;

                usr_Id = notDet.UserId.toString();
                customer_Code = notDet.CustomerCode;


                OneSignalDeferred.push(function (OneSignal) {
                    OneSignal.init({
                        //allowLocalhostAsSecureOrigin: true,
                        appId: notDet.Id,
                        notifyButton: {
                            enable: true, // Display the native browser prompt to subscribe
                        }
                    });

                    function permissionChangeListener(permission) {
                        if (permission) {
                            console.log('permission accepted!');

                            OneSignal.User.addTag("user_id", usr_Id);
                            OneSignal.User.addTag("customer_code", customer_Code);
                        }
                    }
                    OneSignal.Notifications.addEventListener("permissionChange", permissionChangeListener);

                    const isSupported = OneSignal.Notifications.isPushSupported();
                    console.log(isSupported);

                    let permission = OneSignal.Notifications.permission;

                    if (permission == false)
                    {
                        OneSignal.Notifications.requestPermission();
                        OneSignal.User.PushSubscription.token;

                    }
                   }
                );
  
            } else
                alert(res.data.ResponseMSG);

        }, function (reason) {
            alert('Failed' + reason);
        });

        $scope.SupportExecutiveList = [];
        $http({
            method: 'POST',
            url: base_url + "Support/Creation/GetSuppExe",
            dataType: "json"
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.SupportExecutive = res.data.Data;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });


        $scope.PurposeofContactList = [{ id: 1, text: 'Payment Followup' }, { id: 2, text: 'Overall Feedback' }, { id: 3, text: 'Software Operator' }, { id: 4, text: 'General Information' }, { id: 5, text: 'Common' }];

        $scope.ProvinceColl = GetStateList();
        $scope.DistrictColl = GetDistrictList();
        $scope.VDCColl = GetVDCList();

        $scope.ProvinceColl_Qry = mx($scope.ProvinceColl);
        $scope.DistrictColl_Qry = mx($scope.DistrictColl);
        $scope.VDCColl_Qry = mx($scope.VDCColl);

        $('.select2').select2();

        $scope.Splash = {};
        $http({
            method: 'GET',
            url: base_url + "Support/Creation/GetSplash",
            dataType: "json"
        }).then(function (res) {
            if (res.data.IsSuccess) {
                $scope.Splash = res.data.Data;

                if ($scope.Splash.IsSuccess == true)
                    $('#AcademicModal').modal('show');
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        $scope.UserList = [];
        $http({
            method: 'POST',
            url: base_url + "Setup/Security/GetWebUser",
            dataType: "json"
        }).then(function (res) {
            $scope.UserList = res.data.Data;
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        $scope.KYC = {};
        $http({
            method: 'GET',
            url: base_url + "Support/Creation/GetKYC",
            dataType: "json"
        }).then(function (res) {
            if (res.data.IsSuccess) {
                $scope.KYC = res.data.Data;

                if (!$scope.KYC.ContactDetColl || $scope.KYC.ContactDetColl.length == 0) {
                    $scope.KYC.ContactDetColl = [];
                    $scope.KYC.ContactDetColl.push({ Name: '', ContactStatus: true, });
                }

                var findProvince = $scope.ProvinceColl_Qry.firstOrDefault(p1 => p1.text == $scope.KYC.ProvinceState);

                if (findProvince)
                    $scope.KYC.ProvinceStateId = findProvince.id;
                else
                    $scope.KYC.ProvinceStateId = null;

                var findDistrict = $scope.DistrictColl_Qry.firstOrDefault(p1 => p1.text == $scope.KYC.District);
                if (findDistrict)
                    $scope.KYC.DistrictId = findDistrict.id;
                else
                    $scope.KYC.DistrictId = null;

                var findArea = $scope.VDCColl_Qry.firstOrDefault(p1 => p1.text == $scope.KYC.LocalLevel);
                if (findArea)
                    $scope.KYC.LocalLevelId = findArea.id;
                else
                    $scope.KYC.LocalLevelId = null;

                //try {
                //    var script = document.createElement('script');
                //    script.type = 'text/javascript';
                //    script.src = 'https://maps.googleapis.com/maps/api/js?key=' + API_KEY + '&callback=initMap';
                //    document.body.appendChild(script);
                //    setTimeout(function () {

                //        $scope.initMap();
                //    }, 500);

                //} catch { }

                if ($scope.KYC.NeedToUpdate == true)
                    $('#kycformmodal').modal('show');
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    }

    $scope.CheckAllow = function (mid,ety, eid) {
        var isAllow = true;

        //if ($scope.query_Model) {
        //    var find = $scope.query_Model.where(p1 => p1.ModuleId == mid && p1.EntityType == ety);
        //    if (find) {
        //        var findE = find.elements.where(p1 => p1.EntityId == eid);
        //        if (findE)
        //            return true;
        //    }
        //}

        return isAllow;
    }
    $scope.ClickOnMenu = function (urlLink) {

        $.ajax({
            url: urlLink,
            success: function (data) {
                $("#divRenderbody").html(data);
            }
        });
    };
    $scope.ClearlogoPhoto = function () {
        $timeout(function () {
            $scope.$apply(function () {
                $scope.KYC.LogoData = null;
                $scope.KYC.Logo_TMP = [];
            });

        });

        $('#imgLogo').attr('src', '');
        $('#imgPhoto1').attr('src', '');

    };

    $scope.CleargegistrationPhoto = function () {
        $timeout(function () {
            $scope.$apply(function () {
                $scope.KYC.RegistrationData = null;
                $scope.KYC.Registration_TMP = [];
            });

        });

        $('#imgAffiliatedLogo').attr('src', '');
        $('#imgPhoto2').attr('src', '');

    };

    $scope.ClearPanPhoto = function () {
        $timeout(function () {
            $scope.$apply(function () {
                $scope.KYC.PanData = null;
                $scope.KYC.Pan_TMP = [];
            });

        });


        $('#imgPhoto').attr('src', '');
        $('#imgPhoto3').attr('src', '');


    };

    $scope.ClearTaxPhoto = function () {
        $timeout(function () {
            $scope.$apply(function () {
                $scope.KYC.TaxData = null;
                $scope.KYC.Tax_TMP = [];
            });

        });


        $('#imgBanner').attr('src', '');
        $('#imgPhoto4').attr('src', '');
    };

    $scope.AddConctactDet = function (ind) {
        if ($scope.KYC.ContactDetColl) {
            if ($scope.KYC.ContactDetColl.length > ind + 1) {
                $scope.KYC.ContactDetColl.splice(ind + 1, 0, {
                    ClassName: '',
                    ContactStatus: true,
                })
            } else {
                $scope.KYC.ContactDetColl.push({
                    ClassName: '',
                    ContactStatus: true,
                })
            }
        }
    };
    $scope.delConctactDet = function (ind) {
        if ($scope.KYC.ContactDetColl) {
            if ($scope.KYC.ContactDetColl.length > 1) {
                $scope.KYC.ContactDetColl.splice(ind, 1);
            }
        }
    };

    $scope.UpdateKyc = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();

        var logoImg = $scope.KYC.Logo_TMP;
        var regImg = $scope.KYC.Registration_TMP;
        var panImg = $scope.KYC.Pan_TMP;
        var taxImg = $scope.KYC.Tax_TMP;


        var selectData = $('#cboProvince').select2('data');
        if (selectData && selectData.length > 0)
            province = selectData[0].text.trim();

        selectData = $('#cboDistrict').select2('data');
        if (selectData && selectData.length > 0)
            district = selectData[0].text.trim();


        selectData = $('#cboArea').select2('data');
        if (selectData && selectData.length > 0)
            area = selectData[0].text.trim();

        $scope.KYC.ProvinceState = province;
        $scope.KYC.District = district;
        $scope.KYC.LocalLevel = area;

        $http({
            method: 'POST',
            url: base_url + "Support/Creation/UpdateKyc",
            headers: { 'Content-Type': undefined },
            transformRequest: function (data) {
                var formData = new FormData();
                formData.append("jsonData", angular.toJson(data.jsonData));

                if (data.dtLogoImg && data.dtLogoImg.length > 0)
                    formData.append("LogoImg", data.dtLogoImg[0]);

                if (data.dtRegImg && data.dtRegImg.length > 0)
                    formData.append("RegImg", data.dtRegImg[0]);

                if (data.dtPanImg && data.dtPanImg.length > 0)
                    formData.append("PanImg", data.dtPanImg[0]);

                if (data.dtTaxImg && data.dtTaxImg.length > 0)
                    formData.append("TaxImg", data.dtTaxImg[0]);

                return formData;
            },
            data: { jsonData: $scope.KYC, dtLogoImg: logoImg, dtRegImg: regImg, dtPanImg: panImg, dtTaxImg: taxImg }
        }).then(function (res) {
            $scope.loadingstatus = "stop";
            hidePleaseWait();
            Swal.fire(res.data.ResponseMSG);
            if (res.data.IsSuccess == true) {

            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
        });
    }
    

}]);
