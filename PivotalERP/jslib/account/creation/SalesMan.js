app.controller("SalesMan", function ($scope, $http ,$filter,$timeout,GlobalServices) {
    $scope.Title = 'SalesMan';

    var glSrv = GlobalServices;
    LoadData();
     
    function LoadData() {
        //$('.select2').select2();

        $('.select2').select2({
            allowClear: true,
            // openOnEnter: true
        });

      

        $scope.loadingstatus = "stop";

        $scope.confirmMSG = glSrv.getConfirmMSG();
        $scope.perPageColl = glSrv.getPerPageList();

        $scope.DrCrList = glSrv.getDrCr();

        $scope.perPage = {
            Salesman: glSrv.getPerPageRow(),

        };
        $scope.searchData = {
            Salesman: ''
        };
        $scope.currentPages = {
            Salesman: 1

        };

        $scope.newFilter = {
            Status:null
        };
        
        $scope.beData =
        {
            AgentId: 0,
            Name: '',
            NameNP: '',
            Level:1,
            Alias: '',
            Code: '',
            ParentAgent: '',
            ParentAgentId: 0,
            Address: '',
            Mobile: '',
            PhoneNo: '',
            Email: '',
            Fax:'',
            CitizenshipNo: '',
            PanNo: '',
            AreaId: 0, 
            Opening: 0,
            DrCr: 1,
            UserId: 0,            
            AutoNumber: 0,
            IsActive:true,
            CommissionRate: 0,
            BranchId: 0,
            Radius: 0,
            PanVatNo: '',
            ActiveSelfi: true,
            ActiveSelfiRemarks: true,
            AllowOffRoute: true,
            AllowOfflineOrder: false,
            ShowTodayRoute:true,
            PeriodOPT: 2,
            PrintOrderAfterSave: false,
            AllowGpsTrack:true,
        };


        $scope.PeriodOptColl = GlobalServices.getPeriodOptions();
        $scope.RptCostClassColl = [];
        GlobalServices.getCostClassForRpt().then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.RptCostClassColl = res.data.Data;
                if ($scope.RptCostClassColl && $scope.RptCostClassColl.length > 0) {
                    $scope.beData.RptCostClassId = $scope.RptCostClassColl[0].CostClassId;
                    $scope.GetPeriodMonths($scope.RptCostClassColl[0].CostClassId);
                }
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        $scope.UDFFeildsColl = [];
        var para11 = {
            EntityId: EntityId
        };
        $http({
            method: 'POST',
            url: base_url + "Setup/Security/getUDFByEntitId",
            dataType: "json",
            data: JSON.stringify(para11)
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.UDFFeildsColl = res.data.Data;
                angular.forEach($scope.UDFFeildsColl, function (uff) {
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

        $scope.ProductBrandColl = [];
        $http({
            method: 'GET',
            url: base_url + "Inventory/Creation/GetAllProductBrand",
            dataType: "json"            
        }).then(function (res) {             
            if (res.data.IsSuccess && res.data.Data) {
                $scope.ProductBrandColl = res.data.Data;
            } 
        }, function (reason) {
            alert('Failed' + reason);
        });


        $scope.BranchList = [];
        $http({
            method: 'GET',
            url: base_url + "Setup/Security/GetAllBranchList",
            dataType: "json"
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.BranchList = res.data.Data;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        $scope.UDFFeildsColl = [];
        var para11 = {
            EntityId: SalesmanEntity
        };
        $http({
            method: 'POST',
            url: base_url + "Setup/Security/getUDFByEntitId",
            dataType: "json",
            data: JSON.stringify(para11)
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.UDFFeildsColl = res.data.Data;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });


        $scope.LevelList = [];
        $http({
            method: 'GET',
            url: base_url + "Account/Creation/GetSalesmanLevel",
            dataType: "json",
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.LevelList = res.data.Data;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
         

        $scope.AreaMasterList = [];
        $http({
            method: 'GET',
            url: base_url + "Account/Creation/GetAllAreaMasterList",
            dataType: "json",
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.AreaMasterList = res.data.Data;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
        $scope.UserList = [];
        $http({
            method: 'POST',
            url: base_url + "Setup/Security/GetAllUserList",
            dataType: "json",
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.UserList = res.data.Data;                
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });


    };
    $scope.ClearFields = function () {


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


        $scope.newMaster = {
            TranId: 0
        };

        $scope.loadingstatus = "stop";
        $scope.beData =
        {
            AgentId: 0,
            Name: '',
            NameNP: '',
            Level: 1,
            Alias: '',
            Code: '',
            ParentAgent: '',
            ParentAgentId: 0,
            Address: '',
            Mobile: '',
            PhoneNo: '',
            Email: '',
            Fax: '',
            CitizenshipNo: '',
            PanNo: '',
            AreaId: 0,
             
            Opening: 0,
            DrCr: 1,
            UserId: 0,
            AutoNumber: 0,
            IsActive: true,
            CommissionRate: 0,
            BranchId: 0,
            Radius: 0,
            PanVatNo: '',
            ActiveSelfi: true,
            ActiveSelfiRemarks: true,
            AllowOffRoute: true,
            AllowOfflineOrder: false,
            ShowTodayRoute: true,
            PeriodOPT: 2,
            RptCostClassId: $scope.beData.RptCostClassId,
            PrintOrderAfterSave: false,
            AllowGpsTrack:true,
        };

        angular.forEach($scope.UDFFeildsColl, function (uf) {
            uf.Value = '';
            uf.AlterNetValue = '';
        });

        $timeout(function () {
            $("#cboBrand").val([]).change();
        });


    }
    $scope.greaterThan = function (prop, val) {
        return function (item) {
            if (item[prop] > val) return true;
        }
    }
    
    $scope.GetAllSalesMan = function () {

        $scope.loadingstatus = 'running';
        showPleaseWait();

        $scope.AgentList = [];
        $http({
            method: 'GET',
            url: base_url + "Account/Creation/GetAllSalesMan?status="+$scope.newFilter.Status,
            dataType: "json",
        }).then(function (res) {

            $scope.loadingstatus = 'stop';
            hidePleaseWait();
            if (res.data.IsSuccess && res.data.Data) {
                $scope.AgentList = res.data.Data;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

    }
     
    $scope.IsValidAgentMode = function () {
        if ($scope.beData.Name.isEmpty()) {
            Swal.fire('Please ! Enter Name');
            return false;
        }
        if ($scope.beData.Address.isEmpty()) {
            Swal.fire('Please ! Enter Address');
            return false;
        }
        if ($scope.beData.Mobile.isEmpty()) {
        Swal.fire('Please ! Enter MobileNo');
        return false;
    }
    return true;
    }

    $scope.SaveAgentMode = function () {
        if ($scope.IsValidAgentMode() == true) {
            if ($scope.confirmMSG.Accept == true) {
                var saveModify = $scope.beData.Mode;
                Swal.fire({
                    title: 'Do you want to' + saveModify + 'the current data?',
                    showCancelButton: true,
                    confirmButtonText: saveModify,
                }).then((result) => {
                    if (result.isConfirmed) {
                        $scope.CallSaveUpdateAgentMode();
                    }
                });
            } else
                $scope.CallSaveUpdateAgentMode();
        }
    };


    $scope.CallSaveUpdateAgentMode = function ()
    {
        $scope.loadingstatus = 'running';
        showPleaseWait();

        $scope.beData.BrandIdColl = [];
        
        if ($scope.beData.TmpBrandIdColl) {
            if ($scope.beData.TmpBrandIdColl.length > 0) {
                $scope.beData.BrandIdColl = $scope.beData.TmpBrandIdColl;
            }
        }
         
        var voucherUDFFields = [];
        var voucherKeyVal = {};
        $scope.beData.UserDefineFieldsColl = [];
        angular.forEach($scope.UDFFeildsColl, function (udf) {

            if (udf.NameId && udf.NameId.length > 0) {
                var uVal = {
                    UDFId: udf.Id,
                    Value: udf.UDFValue,
                    AlterNetValue: '',
                };
                if (udf.FieldType == 2) {
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

                $scope.beData.UserDefineFieldsColl.push(uVal);
            }

        });
        if (voucherUDFFields.length > 0) {
            $scope.beData.Attributes = JSON.stringify(voucherUDFFields);
            $scope.beData.UDFKeyVal = JSON.stringify(voucherKeyVal);
        } else {
            $scope.beData.Attributes = "";
            $scope.beData.UDFKeyVal = "";
        }


        $http({
            method: 'POST',
            url: base_url + "Account/Creation/SaveSalesMan",
            headers: { 'content-Type': undefined },

            transformRequest: function (data) {
                var formData = new FormData();
                formData.append("jsonData", angular.toJson(data.jsonData));
                return formData;
            },
            data: { jsonData: $scope.beData }
        }).then(function (res) {

            $scope.loadingstatus = "stop";
            hidePleaseWait();

            Swal.fire(res.data.ResponseMSG);
            if (res.data.IsSuccess == true) {
                $scope.ClearFields();
                $scope.GetAllSalesMan();
            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
        });
         
       
    }


    $scope.getSalesmanById = function (beData) {

        $scope.loadingstatus = "running";

        $scope.ClearFields();

        var para = {
            AgentId: beData.AgentId
        };


        $scope.newMaster = {
            TranId: beData.AgentId
        };
        $http({
            method: 'POST',
            url: base_url + "Account/Creation/getSalesmanById",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                var resData = res.data.Data;
                $timeout(function () {
                    $scope.beData = res.data.Data;
                    $scope.beData.Mode = 'Modify';

                    angular.forEach($scope.UDFFeildsColl, function (uf) {
                        uf.Value = '';
                        uf.AlterNetValue = '';
                    });

                    if ($scope.beData.Attributes && $scope.beData.Attributes.length > 0) {
                        var udfFieldsColl = mx(JSON.parse($scope.beData.Attributes));
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

                    $timeout(function () {
                        if ($scope.beData.BrandIdColl && $scope.beData.BrandIdColl.length > 0) {
                            $scope.beData.TmpBrandIdColl = $scope.beData.BrandIdColl;
                            $("#cboBrand").val($scope.beData.BrandIdColl).change();
                        }
                    });



                    $('#custom-tabs-four-profile-tab').tab('show');
                });
            } else
                Swal.fire(res.data.ResponseMSG);


        }, function (reason) {
            alert('Failed' + reason);
        });
    };

    $scope.deleteSalesman = function (refData, ind) {

        Swal.fire({
            title: 'Are you sure you want to delete selected Salesman ' + refData.Name + '?',
            showCancelButton: true,
            confirmButtonText: 'Delete',
            //message: 'Are you sure to delete selected Branch :-' + beData.Name,
        }).then((result) => {
            if (result.isConfirmed) {
                $scope.loadingstatus = "running";
                showPleaseWait();
                var para = { AgentId: refData.AgentId };
                $http({
                    method: 'POST',
                    url: base_url + "Account/Creation/deleteSalesmanById",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingstatus = "stop";
                    Swal.fire(res.data.ResponseMSG);
                    if (res.data.IsSuccess == true) {
                        $scope.AgentList.splice(ind, 1);
                    }
                }, function (reason) {
                    Swal.fire('Failed' + reason);

                });
            }

        });
    }

    $scope.ClearRouteStartEnd = function (refData, ind) {

        Swal.fire({
            title: 'Are you sure you want to clear route start/end log of Salesman ' + refData.Name + '?',
            showCancelButton: true,
            confirmButtonText: 'Clear',
            //message: 'Are you sure to delete selected Branch :-' + beData.Name,
        }).then((result) => {
            if (result.isConfirmed) {
                $scope.loadingstatus = "running";
                showPleaseWait();
                var para = { AgentId: refData.AgentId };
                $http({
                    method: 'POST',
                    url: base_url + "Account/Creation/ClearRouteStartEnd",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingstatus = "stop";
                    Swal.fire(res.data.ResponseMSG);
                   
                }, function (reason) {
                    Swal.fire('Failed' + reason);

                });
            }

        });
    }

    $scope.ClearAppLogin = function (refData, ind) {

        Swal.fire({
            title: 'Are you sure you want to clear app login log of Salesman ' + refData.Name + '?',
            showCancelButton: true,
            confirmButtonText: 'Clear',
            //message: 'Are you sure to delete selected Branch :-' + beData.Name,
        }).then((result) => {
            if (result.isConfirmed) {
                $scope.loadingstatus = "running";
                showPleaseWait();
                var para = { AgentId: refData.AgentId };
                $http({
                    method: 'POST',
                    url: base_url + "Account/Creation/ClearAppLogin",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingstatus = "stop";
                    Swal.fire(res.data.ResponseMSG);

                }, function (reason) {
                    Swal.fire('Failed' + reason);

                });
            }

        });
    }

    $scope.CurAgent = {};
    $scope.CurPlanColl = [];
    $scope.CurRouteColl = [];

    $scope.ShowRoutePlan = function (rowData) {

        $scope.CurAgent = {};
        $scope.CurPlanColl = [];
        $scope.CurRouteColl = [];

        $scope.CurAgent = rowData;
        $scope.loadingstatus = "running";
        showPleaseWait();
        var para = {
            procName: 'GetRouteForPlan',
            qry: '',
            tblNames: 'PlanData:Array,RouteColl:Array',
            paraColl: {},
        };
        para.paraColl.AgentId = rowData.AgentId;
        $http({
            method: 'POST',
            url: base_url + "Global/GetMRSCustomData",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";          
            if (res.data.IsSuccess == true)
            {
                var retVal = res.data.Data;
                $scope.CurPlanColl = retVal.PlanData;
                angular.forEach($scope.CurPlanColl, function (cp) {
                    cp.AgentId = rowData.AgentId;
                    cp.DayId = parseInt(cp.DayId);
                    if (cp.RouteId) {
                        cp.RouteId = parseInt(cp.RouteId);
                    }
                });

                $scope.CurRouteColl = retVal.RouteColl;
                $('#frmRoutePlan').modal('show');
                
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);

        });
    }

    $scope.SaveRoutePlan = function () {
        $scope.loadingstatus = 'running';
        showPleaseWait();
  
        $http({
            method: 'POST',
            url: base_url + "Account/Creation/SaveRoutePlan",
            headers: { 'content-Type': undefined },

            transformRequest: function (data) {
                var formData = new FormData();
                formData.append("jsonData", angular.toJson(data.jsonData));
                return formData;
            },
            data: { jsonData: $scope.CurPlanColl }
        }).then(function (res) {

            $scope.loadingstatus = "stop";
            hidePleaseWait();

            Swal.fire(res.data.ResponseMSG);
            if (res.data.IsSuccess == true) {
                $('#frmRoutePlan').modal('hide');
            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
        });

    };

    $scope.delRoutePlan = function (refData, ind) {

        Swal.fire({
            title: 'Are you sure you want to delete selected Plan at row ' + (ind+1) + '?',
            showCancelButton: true,
            confirmButtonText: 'Delete',
            //message: 'Are you sure to delete selected Branch :-' + beData.Name,
        }).then((result) => {
            if (result.isConfirmed==true) {

                $scope.$apply(function () {
                    $scope.CurPlanColl.splice(ind, 1);
                });
                
            }

        });
    }

    $scope.CurAgentUser = {};
    $scope.ShowPwdReset = function (rowData) {
        $scope.CurAgentUser = rowData;
        $('#frmPwdReset').modal('show');
    };

    $scope.IsValidResetPassword = function () {
        if ($scope.CurAgentUser.NewPassword.isEmpty()) {
            Swal.fire('Please ! Enter New Password');
            return false;
        }
        if ($scope.CurAgentUser.ConfirmPassword.isEmpty()) {
            Swal.fire('Please !  Confirm Password');
            return false;
        }

        if ($scope.CurAgentUser.NewPassword != $scope.CurAgentUser.ConfirmPassword) {
            Swal.fire('New Password and Confirm Password Does Not Match');
            return false;
        }

        return true;
    };
     
    $scope.SaveUpdateResetPassword = function () {

        if ($scope.IsValidResetPassword() == true) {

            Swal.fire({
                title: 'Do you want to update password of selected User?',
                showCancelButton: true,
                confirmButtonText: 'Update',
            }).then((result) => {
                /* Read more about isConfirmed, isDenied below */
                if (result.isConfirmed) {
                    $scope.loadingstatus = "running";
                    showPleaseWait();

                    var para = {
                        uId: $scope.CurAgentUser.UserId,
                        newPwd: $scope.CurAgentUser.NewPassword
                    };
                    $http({
                        method: 'POST',
                        url: base_url + "Setup/Security/UpdateUserPwd",
                        dataType: "json",
                        data: JSON.stringify(para)
                    }).then(function (res) {
                        hidePleaseWait();
                        $scope.loadingstatus = "stop";
                        Swal.fire(res.data.ResponseMSG);

                        if (res.data.IsSuccess == true)
                            $('#frmPwdReset').modal('hide');

                    }, function (reason) {
                        Swal.fire('Failed' + reason);
                    });
                }
            });

        }
    
    };



    $scope.CurAgentForReplace = {};
    $scope.ShowAgentForReplace = function (rowData) {
        $scope.CurAgentForReplace = rowData;
        $('#frmReplaceAgent').modal('show');
    };
    $scope.ReplaceAgent = function () {
        Swal.fire({
            title: 'Do you want to replace agent of selected agent (After Replace will not roll back) ?  ',
            showCancelButton: true,
            confirmButtonText: 'Update',
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                $scope.loadingstatus = "running";
                showPleaseWait();

                var para = {
                    FromAgentId: $scope.CurAgentForReplace.AgentId,
                    ToAgentId:$scope.CurAgentForReplace.ToAgentId,
                };
                $http({
                    method: 'POST',
                    url: base_url + "Account/Creation/ReplaceAgent",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingstatus = "stop";
                    Swal.fire(res.data.ResponseMSG);

                    if (res.data.IsSuccess == true)
                        $('#frmReplaceAgent').modal('hide');

                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }
        });
    };

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

                    if (res1.data.IsSuccess==true && res1.data.Data) {
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

    $scope.GenerateUser = function () {

        $scope.loadingstatus = 'running';
        showPleaseWait();

        var para = {
            Prefix: '',
            Suffix: '',
            GroupId: 3,
            AsPer: 1,
        };
        $http({
            method: 'POST',
            url: base_url + "Setup/Security/GenAgentUser",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            $scope.loadingstatus = "stop";
            hidePleaseWait();
            Swal.fire(res.data.ResponseMSG);
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

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

    $scope.GetPeriodMonths = function (costClassId) {
        if (costClassId > 0) {
            GlobalServices.getCompanyPeriodMonth(costClassId).then(function (res) {
                if (res.data.IsSuccess && res.data.Data) {
                    $scope.PeriodMonthColl = res.data.Data;

                    if ($scope.PeriodMonthColl) {
                        $scope.PeriodMonthColl.forEach(function (pm) {
                            if (pm.IsRunning == true) {
                                $scope.CurAgent.SelectedMonth = pm;
                                $scope.CurAgent.RptMonthSNo = pm.SNo;

                                $scope.CurAgent.DateFrom_TMP = new Date(pm.FromDate);
                                $scope.CurAgent.DateTo_TMP = new Date(pm.ToDate);
                            }
                        });
                    }
                }
            }, function (reason) {
                Swal.fire('Failed' + reason);
            });
        }
    }
    $scope.ChangePeriodMonth = function (sm) {
        if (sm) {
            $scope.CurAgent.DateFrom_TMP = new Date(sm.FromDate);
            $scope.CurAgent.DateTo_TMP = new Date(sm.ToDate);

        }
    }
    $scope.ChangePeriodOption = function () {
        if ($scope.CurAgent.PeriodOPT == 2) {
            $scope.ChangePeriodMonth($scope.CurAgent.SelectedMonth);
        }
    }
    $scope.ShowDateWiseRoutePlan = function (rowData) {
         
      //  $('#frmDateWiseRoutePlan').modal('hide');

        rowData.PeriodOPT = 1;
        rowData.RptCostClassId = $scope.beData.RptCostClassId;
        $scope.CurAgent = {};
        $scope.CurPlanColl = [];
        $scope.CurRouteColl = [];

        $scope.CurAgent = rowData;
        $scope.loadingstatus = "running";
        showPleaseWait();
        var para = {
            procName: 'GetDWRouteForPlan',
            qry: '',
            tblNames: 'PlanData:Array,RouteColl:Array',
            paraColl: {},
        };
        para.paraColl.AgentId = rowData.AgentId;

        if ($scope.CurAgent.DateFromDet)
            para.paraColl.DateFrom = ($filter('date')($scope.CurAgent.DateFromDet.dateAD, 'yyyy-MM-dd'));

        if ($scope.CurAgent.DateToDet)
            para.paraColl.DateTo = ($filter('date')($scope.CurAgent.DateToDet.dateAD, 'yyyy-MM-dd'));

        $http({
            method: 'POST',
            url: base_url + "Global/GetMRSCustomData",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess == true) {
                var retVal = res.data.Data;
                $scope.CurPlanColl = retVal.PlanData;
                angular.forEach($scope.CurPlanColl, function (cp) {
                    cp.AgentId = rowData.AgentId;
                    cp.ForDate = new Date(cp.ForDate);
                    cp.ForMiti = cp.ForMiti;
                    cp.DayId = parseInt(cp.DayId);
                    if (cp.RouteId) {
                        cp.RouteId = parseInt(cp.RouteId);
                    }
                });

                $scope.CurRouteColl = retVal.RouteColl;
                $('#frmDateWiseRoutePlan').modal('show');

            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);

        });
    }

    $scope.SaveDWRoutePlan = function () {
        $scope.loadingstatus = 'running';
        showPleaseWait();

        var tmpData = [];
        $scope.CurPlanColl.forEach(function (cp) {
            cp.ForDate = ($filter('date')(cp.ForDate, 'yyyy-MM-dd'));
            tmpData.push(cp);
        });
        $http({
            method: 'POST',
            url: base_url + "Account/Creation/SaveDWRoutePlan",
            headers: { 'content-Type': undefined },

            transformRequest: function (data) {
                var formData = new FormData();
                formData.append("jsonData", angular.toJson(data.jsonData));
                return formData;
            },
            data: { jsonData: tmpData }
        }).then(function (res) {

            $scope.loadingstatus = "stop";
            hidePleaseWait();

            Swal.fire(res.data.ResponseMSG);
            if (res.data.IsSuccess == true) {
                $('#frmDateWiseRoutePlan').modal('hide');
            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
        });

    };
});