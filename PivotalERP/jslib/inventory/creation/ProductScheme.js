app.controller('ProductSchemeCtrl', function ($scope, $filter, $http, $timeout, GlobalServices) {
    $scope.Title = 'Product Scheme';
    var glSrv = GlobalServices;

    $scope.confirmMSG = GlobalServices.getConfirmMSG();

    $scope.LoadData = function () {
        //$scope.confirmMSG = GlobalServices.getConfirmMSG();
         // For Party= 1=PartyWise,2=Party Group Wise,3=Agent Wise,4=Area Wise,5=DebtorType Wise
        // For Product= 1=Product Wise,2=Product Group Wise,3= Product Brand Wise,


        $scope.confirmMSG = GlobalServices.getConfirmMSG();
        $scope.perPageColl = GlobalServices.getPerPageList();


        $scope.currentPages = {
            ProductScheme: 1

        };

        $scope.searchData = {
            ProductScheme: ''

        };

        $scope.perPage = {
            ProductScheme: GlobalServices.getPerPageRow(),

        };

        $('.select2bs4').select2();
        $('.select2').select2();

        $scope.ForPartyColl = [{ id: 0, text: 'For All' }, { id: 1, text: 'PartyWise' }, { id: 2, text: 'GroupWise' }, { id: 3, text: 'SalesmanWise' }, { id: 4, text: 'AreaWise' }, { id: 5, text: 'DebtorTypeWise' }];
        $scope.ForProductColl = [{ id: 0, text: 'For All' },{ id: 1, text: 'ProductWise' }, { id: 2, text: 'GroupWise' }, { id: 3, text: 'BrandWise' }];

        $scope.newProductScheme = {

            Name:'',
            Notes: '',
            Description: '',
            ApplicableFrom_TMP:new Date(),
            ApplicableTo:null,
            IsActive:true,
            VoucherId:null,
            ForParty:1,
            LedgerId: null,
            LedgerGroupId: null,
            AgentId: null,
            AreaId: null,
            DebtorTypeId: null,
            ForProduct:1,
            ProductId: null,
            ProductGroupId: null,
            ProductBrandId: null,
            MinSalesAmt:0,
            DisPer: 0,
            DetailsColl: [],
            Mode: 'Save',            
        }

        $scope.newProductScheme.DetailsColl.push({
            MinAmt: 0,
            MinQty: 0,
            MaxQty:0,
            DiscountPer:0,
            DiscountAmt:0,
            SchemePer:0,
            SchemeAmt:0,
            FreeQty:0,
            AlternetProductId:null,
            Description:''
        });

        $scope.VoucherTypeColl = [];
        $http({
            method: 'GET',
            url: base_url + "Account/Creation/GetVoucherList?voucherType=14",
            dataType: "json"
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.VoucherTypeColl = res.data.Data;
            }
        },
            function (reason) {
            Swal.fire('Failed' + reason);
            });

        $scope.AreaColl = [];
        $http({
            method: 'GET',
            url: base_url + "Account/Creation/GetAllAreaMasterList",
            dataType: "json",
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.AreaColl = res.data.Data;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        $scope.SalesManList = [];
        $http({
            method: 'GET',
            url: base_url + "Account/Creation/GetAllSalesMan",
            dataType: "json"
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                var dtColl = res.data.Data;
                angular.forEach(dtColl, function (dc) {
                    if (dc.Level == 1) {
                        $scope.SalesManList.push(dc);
                    }
                });
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        $scope.LedgerGroupColl = [];
        $http({
            method: 'GET',
            url: base_url + "Account/Creation/GetAllLedgerGroup",
            dataType: "json" 
        }).then(function (res) {
 
            if (res.data.IsSuccess && res.data.Data) {
                $scope.LedgerGroupColl = res.data.Data;
            } 

        }, function (reason) {
            alert('Failed' + reason);
        });

        $scope.RouteColl = [];
        $http({
            method: 'GET',
            url: base_url + "Account/Creation/GetAllDebtorsCreditorsRoute",
            dataType: "json"
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.RouteColl = res.data.Data;
            }  

        }, function (reason) {
            alert('Failed' + reason);
        });

        $scope.ProductGroupColl = [];
        $http({
            method: 'GET',
            url: base_url + "Inventory/Creation/GetAllProductGroup",
            dataType: "json" 
        }).then(function (res) {
 
            if (res.data.IsSuccess && res.data.Data) {
                $scope.ProductGroupColl = res.data.Data;
            }  

        }, function (reason) {
            alert('Failed' + reason);
        });

        $scope.ProductBrandColl = [];
        $http({
            method: 'GET',
            url: base_url + "Inventory/Creation/GetAllProductBrand",
            dataType: "json"
            //data:JSON.stringify(para)
        }).then(function (res) {
 
            if (res.data.IsSuccess && res.data.Data) {
                $scope.ProductBrandColl = res.data.Data;
            }  

        }, function (reason) {
            alert('Failed' + reason);
        });

        $scope.DebtorTypeColl = [];
        $http({
            method: 'GET',
            url: base_url + "Account/Creation/GetAllDebtorsCreditorsType",
            dataType: "json" 
        }).then(function (res) {
 
            if (res.data.IsSuccess && res.data.Data) {
                $scope.DebtorTypeColl = res.data.Data;
            }  

        }, function (reason) {
            alert('Failed' + reason);
        });

        $scope.GetAllProductScheme();
    };

    $scope.ClearProductScheme = function () {

        $scope.newMaster = {
            TranId: 0
        };

        $timeout(function () {
            $scope.newProductScheme = {
                Name: '',
                Notes: '',
                Description: '',
                ApplicableFrom_TMP: new Date(),
                ApplicableTo: null,
                IsActive: true,
                VoucherId: null,
                ForParty: 1,
                LedgerId: null,
                LedgerGroupId: null,
                AgentId: null,
                AreaId: null,
                DebtorTypeId: null,
                ForProduct: 1,
                ProductId: null,
                ProductGroupId: null,
                ProductBrandId: null,
                MinSalesAmt: 0,
                DisPer: 0,
                DetailsColl: [],
                Mode: 'Save',

            };

            $scope.newProductScheme.DetailsColl.push({
                MinAmt: 0,
                MinQty: 0,
                MaxQty: 0,
                DiscountPer: 0,
                DiscountAmt: 0,
                SchemePer: 0,
                SchemeAmt: 0,
                FreeQty: 0,
                AlternetProductId: null,
                Description: ''
            });
        });
    }

    
    $scope.AddRow = function (curRow,ind) {
        if (curRow.MinQty > 0 || curRow.MinAmt>0)
        {
            $scope.newProductScheme.DetailsColl.push(
                {
                    MinAmt: 0,
                    MinQty: 0,
                    MaxQty: 0,
                    DiscountPer: 0,
                    DiscountAmt: 0,
                    SchemePer: 0,
                    SchemeAmt: 0,
                    FreeQty: 0,
                    AlternetProductId: null,
                    Description: ''
                }
            );
        }
    };
    
    $scope.delRow = function (ind) {
        if ($scope.newProductScheme.DetailsColl.length>1)
            $scope.newProductScheme.DetailsColl.splice(ind, 1);
    };


    $scope.IsValidProductScheme = function () {
        if ($scope.newProductScheme.Name.isEmpty()) {
            Swal.fire("Please ! Enter  Name");
            return false;
        }
        else
            return true;
    }

    $scope.GetAllProductScheme = function () {


        $scope.ProductSchemeColl = []; //declare an empty array

     
        $scope.loadingstatus = 'running';
        showPleaseWait();

        $http({
            method: 'GET',
            url: base_url + "Inventory/Creation/GetAllProductScheme",
            dataType: "json"
        }).then(function (res) {

            $scope.loadingstatus = 'stop';
            hidePleaseWait();

            if (res.data.IsSuccess && res.data.Data) {
                $timeout(function () {
                    $scope.ProductSchemeColl = res.data.Data;
                });
            } else
                alert(res.data.ResponseMSG);

        }, function (reason) {
            alert('Failed' + reason);
        });

    }
    $scope.SaveUpdateProductScheme = function () {
        if ($scope.IsValidProductScheme() == true) {
            if ($scope.confirmMSG.Accept == true) {
                var saveModify = $scope.newProductScheme.Mode;
                Swal.fire({
                    title: 'Do you want to' + saveModify + 'the current data?',
                    showCancelButton: true,
                    confirmButtonText: saveModify,
                }).then((result) => {
                    if (result.isConfirmed) {
                        $scope.CallSaveUpdateProductScheme();
                    }

                });
            }
            else
                $scope.CallSaveUpdateProductScheme();
        }
    };

    $scope.CallSaveUpdateProductScheme = function () {
      
        if ($scope.newProductScheme.ApplicableFromDet) {
            $scope.newProductScheme.ApplicableFrom = $filter('date')(new Date($scope.newProductScheme.ApplicableFromDet.dateAD), 'yyyy-MM-dd');
        }
        else {
            Swal.fire('Select Applicable From Date');
            return;
        }

        if ($scope.newProductScheme.ApplicableToDet) {
            $scope.newProductScheme.ApplicableTo = $filter('date')(new Date($scope.newProductScheme.ApplicableToDet.dateAD), 'yyyy-MM-dd');
        } else {
            Swal.fire('Select Applicable To Date');
            return;
        }

        $scope.loadingstatus = 'running';
        showPleaseWait();


        $http({
            method: 'POST',
            url: base_url + "Inventory/Creation/SaveProductScheme",
            headers: { 'content-Type': undefined },

            transformRequest: function (data) {
                var formData = new FormData();
                formData.append("jsonData", angular.toJson(data.jsonData));
                return formData;
            },
            data: { jsonData: $scope.newProductScheme }
        }).then(function (res) {

            $scope.loadingstatus = "stop";
            hidePleaseWait();

            Swal.fire(res.data.ResponseMSG);
            if (res.data.IsSuccess == true) {
                $scope.ClearProductScheme();
                $scope.GetAllProductScheme();
            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
        });
    }

    $scope.getProductSchemeById = function (beData) {

        $scope.loadingstatus = "running";
        var para = {
            TranId: beData.TranId
        };

        $scope.newMaster = {
            TranId: beData.TranId
        };
        $http({
            method: 'POST',
            url: base_url + "Inventory/Creation/getProductSchemeById",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $timeout(function () {
                    $scope.newProductScheme = res.data.Data;
                    $scope.newProductScheme.Mode = 'Modify';

                    $scope.newProductScheme.ApplicableFrom_TMP = new Date($scope.newProductScheme.ApplicableFrom);
                    $scope.newProductScheme.ApplicableTo_TMP = new Date($scope.newProductScheme.ApplicableTo);

                    if (!$scope.newProductScheme.DetailsColl || $scope.newProductScheme.DetailsColl.length == 0) {
                        $scope.newProductScheme.DetailsColl = [];
                        $scope.newProductScheme.DetailsColl.push({
                            MinAmt: 0,
                            MinQty: 0,
                            MaxQty: 0,
                            DiscountPer: 0,
                            DiscountAmt: 0,
                            SchemePer: 0,
                            SchemeAmt: 0,
                            FreeQty: 0,
                            AlternetProductId: null,
                            Description: ''
                        });
                    }

                    $('#custom-tabs-four-profile-tab').tab('show');
                });
            } else
                Swal.fire(res.data.ResponseMSG);

        }, function (reason) {
            alert('Failed' + reason);
        });
    }

    $scope.deleteProductScheme = function (refData, ind) {

        Swal.fire({
            title: 'Are you sure to delete selected Product Scheme:-' + refData.Name,
            showCancelButton: true,
            confirmButtonText: 'Delete',
        }).then((result) => {
            if (result.isConfirmed) {
                $scope.loadingstatus = "running";
                showPleaseWait();

                var para = {
                    TranId: refData.TranId
                };

                $http({
                    method: 'POST',
                    url: base_url + "Inventory/Creation/DeleteProductScheme",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingstatus = "stop";
                    Swal.fire(res.data.ResponseMSG);
                    if (res.data.IsSuccess) {
                        $scope.ProductSchemeColl.splice(ind, 1);
                    }

                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }
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
});