app.controller("CostCenter", function ($scope, $http, GlobalServices, $timeout, $filter, GlobalServices) {
    $scope.Title = 'Cost Center';

    var glSrv = GlobalServices;

    $scope.loadingstatus = "stop";

    LoadData();

    function LoadData() {
        $('.select2').select2();

        $scope.LandedCostForColl = [{ id: 1, text: 'Common & ItemWise' }, { id: 2, text: 'Common Only' }, { id: 3, text: 'ItemWise' }];

        $scope.VoucherSearchOptions = [{ text: 'Name', value: 'C.Name', searchType: 'text' }, { text: 'Alias', value: 'C.Alias', searchType: 'text' }, { text: 'Code', value: 'C.Code', searchType: 'text' }];
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


        $scope.loadingstatus = "stop";

        $scope.VDCColl = GetVDCList();
        $scope.confirmMSG = glSrv.getConfirmMSG();
        $scope.DrCrList = glSrv.getDrCr();

        $scope.perPageColl = GlobalServices.getPerPageList();
 
        $scope.perPage = {
            CostCenter: GlobalServices.getPerPageRow(),

        };
        $scope.currentPages = {
            CostCenter: 1

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

        $scope.beData =
        {
            UniqueId: GlobalServices.getUniqueId(),
            CostCenterId: 0,
            Name: '',
            Alias: '',
            Code: '',
            Address: '',
            PanVatNo: '',
            PhoneNo: '',
            Email: '',
            Status:true,
            ActiveInterestCalculation: false,
            CostCategoryName: '',
            CostCategoryId: 0,
            LedgerId: null,
            Opening: 0,
            DrCr: 1,
            InterestRate: 0,
            InterestPer: 0,
            InterestOn: 1,
            AfterDaysInterestActive: 0,
            OpeningForBranchId: 1,
            AditionalCostOnTheBasis: 1,
            OrderNo: 0,
            UDFColl: [],
            DefaultValue: null,
            CreditLedgerId: null,
            IsTaxable: true,
            LandedCostFor:1,
        };
        $scope.beData.UDFColl.push({ ColWidth: 3 });

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

        $scope.CostCategoryList = [];
        $http({
            method: 'GET',
            url: base_url + "Account/Creation/GetAllCostCategoryLisst",
            dataType: "json",
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.CostCategoryList = res.data.Data;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

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

        $scope.DimensionColl = [];
        $http({
            method: 'GET',
            url: base_url + "Account/Creation/GetAllDimension",
            dataType: "json"
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.DimensionColl = res.data.Data;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

    };
    $scope.GenerateCode = function () {

        if ($scope.beData.CostCenterId > 0 && $scope.beData.Code && $scope.beData.Code.length > 0)
            return;

        $scope.beData.Code = '';
        var para = {
            name: $scope.beData.Name,
            CostCategoryId: $scope.beData.CostCategoryId
        };
        $http({
            method: 'POST',
            url: base_url + "Account/Creation/GetCostCenterCode",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            $timeout(function () {
                if (res.data.IsSuccess && res.data.Data) {
                    $scope.beData.Code = res.data.Data.ResponseId;
                }
            });
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    };
    $scope.ClearFields = function () {
        $scope.loadingstatus = "stop";

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

        $scope.beData =
        {
            UniqueId: GlobalServices.getUniqueId(),
            CostCenterId: 0,
            Name: '',
            Alias: '',
            Code: '',
            Address: '',
            PanVatNo: '',
            PhoneNo: '',
            Email: '',
            Status: true,
            ActiveInterestCalculation: false,
            CostCategoryName: '',
            CostCategoryId: 0,
            LedgerId: null,
            Opening: 0,
            DrCr: 1,
            InterestRate: 0,
            InterestPer: 0,
            InterestOn: 1,
            AfterDaysInterestActive: 0,
            OpeningForBranchId: 1,
            AditionalCostOnTheBasis: 1,
            OrderNo: 0,
            UDFColl: [],
            DefaultValue: null,
            CreditLedgerId: null,
            IsTaxable: true,
            LandedCostFor: 1,
        };
        $scope.beData.UDFColl.push({ ColWidth: 3 });
        $('#txtName').focus();
    }

    $scope.IsValidCostCenter = function () {
        if ($scope.beData.Name.isEmpty()) {
            Swal.fire("Please ! Enter Cost Center Name");
            return false;
        }
        else
            return true;
    }

    $scope.AddNewCostCenter = function () {
        if ($scope.IsValidCostCenter() == true) {
            if ($scope.confirmMSG.Accept == true) {
                var saveModify = $scope.beData.Mode;
                Swal.fire({
                    title: 'Do you want to' + saveModify + 'the current data?',
                    showCancelButton: true,
                    confirmButtonText: saveModify,
                }).then((result) => {
                    if (result.isConfirmed) {
                        $scope.CallSaveUpdateCostCenter();
                    }

                });
            }
            else
                $scope.CallSaveUpdateCostCenter();
        }
    };

    $scope.CallSaveUpdateCostCenter = function () {
        $scope.loadingstatus = 'running';
        showPleaseWait();
        $scope.beData.DebitCredit = $scope.beData.DrCr;

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

        $scope.beData.UniqueId = $scope.beData.UniqueId;

        $http({
            method: 'POST',
            url: base_url + "Account/Creation/SaveUpdateCostCenter",
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
                $scope.SearchData();
            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
        });
    }
    $scope.getCostCenterById = function (beData) {

            $scope.loadingstatus = "running";
            showPleaseWait();

            var para = {
                CostCenterId: beData.CostCenterId
        };

        $scope.newMaster = {
            TranId: beData.CostCategoryId
        };

            $http({
                method: 'POST',
                url: base_url + "Account/Creation/getCostCenterById",
                dataType: "json",
                data: JSON.stringify(para)
            }).then(function (res) {
                hidePleaseWait();
                $scope.loadingstatus = "stop";
                if (res.data.IsSuccess && res.data.Data) {
                    $timeout(function () {
                        $scope.beData = res.data.Data;
                        $scope.beData.Mode = 'Modify';
                        if ($scope.beData.UDFColl.length == 0)
                            $scope.beData.UDFColl.push({ ColWidth: 3 });

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

                        $('#custom-tabs-four-profile-tab').tab('show');
                    });
                    
                } else 
                    Swal.fire(res.data.ResponseMSG);
                

            }, function (reason) {
                alert('Failed' + reason);
            });
        };

    $scope.deleteCostCenter = function (refData, ind) {

            Swal.fire({
                title: 'Are you sure you want to delete ' + refData.Name + '?',
                showCancelButton: true,
                confirmButtonText: 'Delete',
            }).then((result) => {
                if (result.isConfirmed) {
                    $scope.loadingstatus = "running";
                    showPleaseWait();
                    var para = { CostCenterId: refData.CostCenterId };
                    $http({
                        method: 'POST',
                        url: base_url + "Account/Creation/deleteCostCenter",
                        dataType: "json",
                        data: JSON.stringify(para)
                    }).then(function (res) {
                        hidePleaseWait();
                        $scope.loadingstatus = "stop";

                        Swal.fire(res.data.ResponseMSG);
                        if (res.data.IsSuccess == true) {
                            $scope.SearchData();
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
            url: base_url + "Account/Creation/GetCostCenterLst",
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
            url: base_url + "Account/Creation/GetCostCenterLst",
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
        if ($scope.beData.UDFColl[ind].Label && $scope.beData.UDFColl[ind].Label.length > 0) {
            if ($scope.beData.UDFColl.length > ind + 1) {
                $scope.beData.UDFColl.splice(ind + 1, 0, {
                    ApplicableFromDet: null,
                    PrefixCharacters: '',
                    ColWidth: 3,
                })
            } else {
                $scope.beData.UDFColl.push({
                    ApplicableFromDet: null,
                    PrefixCharacters: '',
                    ColWidth: 3,
                });
            }
        }

    };
    $scope.delItemUdf = function (ind) {
        if ($scope.beData.UDFColl) {
            if ($scope.beData.UDFColl.length > 1) {
                $scope.beData.UDFColl.splice(ind, 1);
            }
        }
    };
});