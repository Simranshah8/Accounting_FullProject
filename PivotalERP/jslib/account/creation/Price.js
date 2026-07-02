app.controller('PriceController', function ($scope, $http, $timeout, $filter, GlobalServices) {
    $scope.Title = 'Price';
   
    //LoadData();

    $scope.LoadData = function () {

        $('.select2').select2();
        $scope.loadingstatus = "stop";
        $scope.confirmMSG = GlobalServices.getConfirmMSG();
        $scope.perPageColl = GlobalServices.getPerPageList();

        $scope.perPage = {
            Price: GlobalServices.getPerPageRow(),

        };

        $scope.currentPages = {
            Price: 1

        };
        $scope.searchData = {
            Price: ''
        };

        $scope.newPrice =
        {
            PriceId: null,
            Name: '',
            Factor: 1,
            DefaultBasePriceList: 1,
            RoundingMethod: 1,
            Active: true,
            ValidFrom_TMP: null,
            ValidTo_TMP: null,
            ForDebtorTypeIdColl: '',
            ForLedgerGroupIdColl: '',
            ForAreaIdColl: '',
            ForProvinceColl: '',
            ForDistrictColl: '',
            Mode:'Save'
        };
        $scope.DefaultBasePriceColl = [
            { id: 1, text: "Standard Selling Price" },
            { id: 2, text: "Standard Cost Rate" },
            { id: 3, text: "Standard Trade Rate" },
            { id: 4, text: "Standard MRP" }
        ];
        $scope.RoundingMethodList = [
            { id: 1, text: "None" },
            { id: 2, text: "Nearest " },
            { id: 3, text: "Truncate" },
            { id: 4, text: "Down " }
        ];
        $scope.ForDebtorTypeIdCollList = [
            { id: 1, text: "debtor 1 " },
            { id: 2, text: "debtor 2 " },
            { id: 3, text: "debtor 3 " },
        ];
    
 

        $scope.LedgerGroupList = [];
        $http({
            method: 'GET',
            url: base_url + "Account/Creation/GetDebtorGroup",
            dataType: "json",
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.LedgerGroupList = res.data.Data;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        $scope.AreaList = [];
        $http({
            method: 'GET',
            url: base_url + "Account/Creation/GetAreaMasteForTran",
            dataType: "json"
        }).then(function (res) {             
            if (res.data.IsSuccess && res.data.Data) {
                $scope.AreaList = res.data.Data;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        $scope.DebtorTypeList = [];
        $http({
            method: 'GET',
            url: base_url + "Account/Creation/GetAllDebtorTypeList",
            dataType: "json"
        }).then(function (res) {           
            if (res.data.IsSuccess && res.data.Data) {
                $scope.DebtorTypeList = res.data.Data;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        $scope.ProvinceColl = GetStateList();
        $scope.DistrictColl = GetDistrictList();
        $scope.ProvinceColl_Qry = mx($scope.ProvinceColl);
        $scope.DistrictColl_Qry = mx($scope.DistrictColl);


        $scope.GetAllPriceList();

    };

    $scope.ClearDetails = function () {
        $scope.newPrice = {
            PriceId: null,
            Name: '',
            Factor: 1,
            DefaultBasePriceList: 1,
            RoundingMethod: 1,
            Active: true,
            ValidFrom_TMP: null,
            ValidTo_TMP: null,
            ForDebtorTypeIdColl: '',
            ForLedgerGroupIdColl: '',
            ForAreaIdColl: '',
            ForProvinceColl: '',
            ForDistrictColl: '',
            ForDebtorTypeId: null,
            ForLedgerGroupId: null,
            ForAreaId: null,
            Mode: 'Save'
        };
        $timeout(function () {
            $('.select2').val(null).trigger('change');
        }, 0);
    }

  
    
    $scope.IsValidAddPrice = function () {
        if ($scope.newPrice.Name.isEmpty()) {
            Swal.fire('Please ! Enter Name');
            return false;
        }
        return true;
    }

    $scope.SaveUpdatePrice = function () {
        if ($scope.IsValidAddPrice() == true) {
            if ($scope.confirmMSG.Accept == true) {
                var saveModify = $scope.newPrice.Mode;
                Swal.fire({
                    title: 'Do you want to ' + saveModify + ' the current data?',
                    showCancelButton: true,
                    confirmButtonText: saveModify,
                }).then((result) => {
                    if (result.isConfirmed) {
                        $scope.CallSaveUpdatePrice();
                    }
                });
            } else
                $scope.CallSaveUpdatePrice();
        }
    };

    $scope.CallSaveUpdatePrice = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();

        if ($scope.newPrice.ValidFromDet)
            $scope.newPrice.ValidFrom = $filter('date')(new Date($scope.newPrice.ValidFromDet.dateAD), 'yyyy-MM-dd');
        else
            $scope.newPrice.ValidFrom = null;


        if ($scope.newPrice.ValidToDet)
            $scope.newPrice.ValidTo = $filter('date')(new Date($scope.newPrice.ValidToDet.dateAD), 'yyyy-MM-dd');
        else
            $scope.newPrice.ValidTo = null;

        $scope.newPrice.ForDebtorTypeIdColl = $scope.newPrice.ForDebtorTypeId ? $scope.newPrice.ForDebtorTypeId.toString() : '';
        $scope.newPrice.ForLedgerGroupIdColl = $scope.newPrice.ForLedgerGroupId ? $scope.newPrice.ForLedgerGroupId.toString() : '';
        $scope.newPrice.ForAreaIdColl = $scope.newPrice.ForAreaId ? $scope.newPrice.ForAreaId.toString() : '';

        $scope.newPrice.ForProvinceColl = $scope.newPrice.ForProvinceColl ? $scope.newPrice.ForProvinceColl.join(',') : '';
        $scope.newPrice.ForDistrictColl = $scope.newPrice.ForDistrictColl ? $scope.newPrice.ForDistrictColl.join(',') : '';


        $http({
            method: 'POST',
            url: base_url + "Account/Creation/SavePrice",
            headers: { 'Content-Type': undefined },
            transformRequest: function (data) {
                var formData = new FormData();
                formData.append("jsonData", angular.toJson(data.jsonData));
                return formData;
            },
            data: { jsonData: $scope.newPrice }
        }).then(function (res) {
            $scope.loadingstatus = "stop";
            hidePleaseWait();
            Swal.fire(res.data.ResponseMSG);
            if (res.data.IsSuccess == true) {
                $scope.ClearDetails();
                $scope.GetAllPriceList();
            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
        });
    }

    $scope.GetAllPriceList = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();
        $scope.PriceList = [];
        $http({
            method: 'POST',
            url: base_url + "Account/Creation/GetAllPrice",
            dataType: "json"
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.PriceList = res.data.Data;
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    };

    $scope.GetPriceById = function (refData) {
        $scope.loadingstatus = "running";
        showPleaseWait();
        var para = {
            PriceId: refData.PriceId
        };
        $http({
            method: 'POST',
            url: base_url + "Account/Creation/GetPriceById",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.newPrice = res.data.Data;

                if ($scope.newPrice.ValidFrom)
                    $scope.newPrice.ValidFrom_TMP = new Date($scope.newPrice.ValidFrom);
               
                if ($scope.newPrice.ValidTo)
                    $scope.newPrice.ValidTo_TMP = new Date($scope.newPrice.ValidTo);

                $scope.newPrice.ForDebtorTypeId = ($scope.newPrice.ForDebtorTypeIdColl ? $scope.newPrice.ForDebtorTypeIdColl.toString() : '');
                $scope.newPrice.ForLedgerGroupId = ($scope.newPrice.ForLedgerGroupIdColl ? $scope.newPrice.ForLedgerGroupIdColl.toString(): '');
                $scope.newPrice.ForAreaId = ($scope.newPrice.ForAreaIdColl ? $scope.newPrice.ForAreaIdColl.toString() : '');

                $('#custom-tabs-four-profile-tab').tab('show');
                $scope.newPrice.Mode = 'Modify';



            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    };

    $scope.DelPriceById = function (refData) {
        Swal.fire({
            title: 'Do you want to delete the selected data?',
            showCancelButton: true,
            confirmButtonText: 'Delete',
        }).then((result) => {
            if (result.isConfirmed) {
                $scope.loadingstatus = "running";
                showPleaseWait();
                var para = {
                    PriceId: refData.PriceId
                };
                $http({
                    method: 'POST',
                    url: base_url + "Account/Creation/DelPrice",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingstatus = "stop";
                    if (res.data.IsSuccess) {
                        $scope.ClearDetails();
                        $scope.GetAllPriceList();
                    } else {
                        Swal.fire(res.data.ResponseMSG);
                    }
                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }
        });
    };

    $scope.pageChangeHandler = function (num) {
        console.log('page changed to ' + num);
    };

});