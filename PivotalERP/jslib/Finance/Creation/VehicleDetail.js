app.controller('VehicleDetailController', function ($scope, GlobalServices, $http, $filter, $timeout) {
    $scope.Title = 'VehicleDetail';

    var glSrv = GlobalServices;

    $scope.LoadData = function () {
        $('.select2').select2();

        $(document).ready(function () {
            $('#cboProvince').select2();
            $('#cboDistrict').select2();
            $('#cboZone').select2();
          

        });

        $scope.confirmMSG = GlobalServices.getConfirmMSG();
        $scope.perPageColl = GlobalServices.getPerPageList();
        $scope.currentPages = {
            VehicleDetails: 1,
        };

        $scope.searchData = {
            VehicleDetails: '',

        };

        $scope.perPage = {
            VehicleDetails: GlobalServices.getPerPageRow()
        };


        $scope.ZoneColl = GetZoneList();
        $scope.ProvinceColl = GetStateList();
        $scope.DistrictColl = GetDistrictList();
      
        $scope.ZoneColl_Qry = mx($scope.ZoneColl);
        $scope.ProvinceColl_Qry = mx($scope.ProvinceColl);
        $scope.DistrictColl_Qry = mx($scope.DistrictColl);
      
        $scope.CostClassColl = [];
        $http({
            method: 'GET',
            url: base_url + "Account/Creation/GetAllCostClasss",
            dataType: "json"
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.CostClassColl = res.data.Data;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        $scope.VoucherTypeColl = []; //declare an empty array

        $http({
            method: 'GET',
            url: base_url + "Account/Creation/GetVoucherList?voucherType=3",
            dataType: "json"
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.VoucherTypeColl = res.data.Data;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });



        $scope.AgentList = [];
        $http({
            method: 'GET',
            url: base_url + "Account/Creation/GetAllSalesMan",
            dataType: "json",
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.AgentList = res.data.Data;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });



        $scope.beData = {
            VehicleDetailId: 0,
            PartyLedgerId: null,
            VoucherNo: 0,
            RegdNo: '',
            EngineNo: '',
            ChechisNo: '',
            Model: '',
            Color: '',
            Type: null,
            KeyNo: '',
            CodeNo: '',
            MFGYear: '',
            BookingDate_TMP: '',
            BookingMemoNo: '',
            SalesBillNo: '',
            SalesDate_TMP: '',
            SalesPrice: '',
            DiscountAmt: '',
            AgentId: null,
            CommissionAmt: '',
            FinanceCode: '',
            InsuranceName: '',
            InsuranceValidUpto_TMP: '',
            BluebookValidUpto_TMP: '',
            RoutePermitValidUpto_TMP: '',
            CheckupValidUpto_TMP: '',
            Zone: null,
            District: null,
            RecoveryName: '',
            CitizenshipNo: '',
            Fathername: '',
            Mothername: '',
            GFatherName: '',
            GMotherName: '',
            Culty: false,
            Note: '',
            Mode: 'Save'
        }; 
    }
  
    $scope.ClearVehicleDetail = function () {
        $scope.beData = {
            VehicleDetailId: 0,
            PartyLedgerId: null,
            VoucherNo: 0,
            RegdNo: '',
            EngineNo: '',
            ChechisNo: '',
            Model: '',
            Color: '',
            Type: null,
            KeyNo: '',
            CodeNo: '',
            MFGYear: '',
            BookingDate_TMP: '',
            BookingMemoNo: '',
            SalesBillNo: '',
            SalesDate_TMP: '',
            SalesPrice: '',
            DiscountAmt: '',
            AgentId: null,
            CommissionAmt: '',
            FinanceCode: '',
            InsuranceName: '',
            InsuranceValidUpto_TMP: '',
            BluebookValidUpto_TMP: '',
            RoutePermitValidUpto_TMP: '',
            CheckupValidUpto_TMP: '',
            Zone: null,
            District: null,
            RecoveryName: '',
            CitizenshipNo: '',
            Fathername: '',
            Mothername: '',
            GFatherName: '',
            GMotherName: '',
            Culty: false,
            Note: '',
            Mode: 'Save'
        };
      
    }


    //*********************************CRUDE Start For Dealer


    $scope.IsValidVehicleDetail = function () {
        if ($scope.beData.RegdNo.isEmpty()) {
            Swal.fire('Please ! Enter Regd No');
            return false;
        }
        return true;
    }

    $scope.SaveUpdateVehicleDetail = function () {
        if ($scope.IsValidVehicleDetail() == true) {
            if ($scope.confirmMSG.Accept == true) {
                var saveModify = $scope.beData.Mode;
                Swal.fire({
                    title: 'Do you want to ' + saveModify + ' the current data?',
                    showCancelButton: true,
                    confirmButtonText: saveModify,
                }).then((result) => {
                    if (result.isConfirmed) {
                        $scope.CallSaveUpdateVehicleDetail();
                    }
                });
            } else
                $scope.CallSaveUpdateVehicleDetail();
        }
    };

    $scope.CallSaveUpdateVehicleDetail = function () {
        $scope.loadingstatus = "running";
        showPleaseWait(); 

        var selectData = $('#cboProvince').select2('data');
        if (selectData && selectData.length > 0)
            province = selectData[0].text.trim();

        selectData = $('#cboDistrict').select2('data');
        if (selectData && selectData.length > 0)
            district = selectData[0].text.trim();
              

        $scope.beData.Province = province;
        $scope.beData.District = district;


        if ($scope.beData.BookingDateDet) {
            $scope.beData.BookingDate = $filter('date')(new Date($scope.beData.BookingDateDet.dateAD), 'yyyy-MM-dd');
        } else
            $scope.beData.BookingDate = new Date();

        if ($scope.beData.SalesDateDet) {
            $scope.beData.SalesDate = $filter('date')(new Date($scope.beData.SalesDateDet.dateAD), 'yyyy-MM-dd');
        } else
            $scope.beData.SalesDate = new Date();

        if ($scope.beData.InsuraceValidUptoDet) {
            $scope.beData.InsuraceValidUpto = $filter('date')(new Date($scope.beData.InsuraceValidUptoDet.dateAD), 'yyyy-MM-dd');
        } else
            $scope.beData.InsuraceValidUpto = new Date();

        if ($scope.beData.BlueBookValidUptoDet) {
            $scope.beData.BlueBookValidUpto = $filter('date')(new Date($scope.beData.BlueBookValidUptoDet.dateAD), 'yyyy-MM-dd');
        } else
            $scope.beData.BlueBookValidUpto = new Date();

        if ($scope.beData.RoutePermitValidUptoDet) {
            $scope.beData.RoutePermitValidUpto = $filter('date')(new Date($scope.beData.RoutePermitValidUptoDet.dateAD), 'yyyy-MM-dd');
        } else
            $scope.beData.RoutePermitValidUpto = new Date();


        if ($scope.beData.CheckupValidUptoDet) {
            $scope.beData.CheckupValidUpto = $filter('date')(new Date($scope.beData.CheckupValidUptoDet.dateAD), 'yyyy-MM-dd');
        } else
            $scope.beData.CheckupValidUpto = new Date();

        $http({
            method: 'POST',
            url: base_url + "Finance/Creation/SaveVehicleDetail",
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
            Swal.fire(res.data.ResponseMSG);
            if (res.data.IsSuccess == true) {
                $scope.ClearVehicleDetail();
                
            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
        });
    }


    $scope.GetAllLoanVehicleById = function (beData) {
        $scope.loadingstatus = "running";     
        $http({
            method: 'POST',
            url: base_url + "Finance/Creation/GetAllLoanVehicle",
            dataType: "json"
        }).then(function (res) {
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $timeout(function () {
                    $scope.SearchDataColl = res.data.Data;
                });
                $('#searchmodal').modal('show');
            } else
                Swal.fire(res.data.ResponseMSG);


        }, function (reason) {
            alert('Failed' + reason);
        });
    }
    

    $scope.GetLoanVehicleById = function (refdata) {
        $scope.loadingstatus = "running";
        var para = {
            TranId: refdata.TranId
        };
        $http({
            method: 'POST',
            url: base_url + "Finance/Creation/GetLoanVehicleById",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            $scope.loadingstatus = "stop";
            if (res.data.Data) {
                $scope.beData = res.data.Data;

                if ($scope.beData.BookingDate)
                    $scope.beData.BookingDate_TMP = $scope.beData.BookingDate;

                if ($scope.beData.SalesDate)
                    $scope.beData.SalesDate_TMP = $scope.beData.SalesDate;

                if ($scope.beData.InsuraceValidUpto)
                    $scope.beData.InsuraceValidUpto_TMP = $scope.beData.InsuraceValidUpto;

                if ($scope.beData.BlueBookValidUpto)
                    $scope.beData.BlueBookValidUpto_TMP = $scope.beData.BlueBookValidUpto;

                if ($scope.beData.RoutePermitValidUpto)
                    $scope.beData.RoutePermitValidUpto_TMP = $scope.beData.RoutePermitValidUpto;
                if ($scope.beData.CheckupValidUpto)
                    $scope.beData.CheckupValidUpto_TMP = $scope.beData.CheckupValidUpto;

                var findProvince = $scope.ProvinceColl_Qry.firstOrDefault(p1 => p1.text == res.data.Data.Province);

                if (findProvince)
                    $scope.beData.ProvinceId = findProvince.id;
                else
                    $scope.beData.ProvinceId = null;

                var findDistrict = $scope.DistrictColl_Qry.firstOrDefault(p1 => p1.text == res.data.Data.District);
                if (findDistrict)
                    $scope.beData.DistrictId = findDistrict.id;
                else
                    $scope.beData.DistrictId = null;


                $scope.beData.Mode = 'Modify';
                $('#searchmodal').modal('hide');
            } else
                Swal.fire(res.data.ResponseMSG);


        }, function (reason) {
            alert('Failed' + reason);
        });
    }

    $scope.DelVehicleDetails = function (refData, ind) {
        Swal.fire({
            title: 'Are you sure you want to delete ' + refData.TranId + '?',
            showCancelButton: true,
            confirmButtonText: 'Delete',
        }).then((result) => {
            if (result.isConfirmed) {
                var para = { TranId: refData.TranId };
                $http({
                    method: 'POST',
                    url: base_url + "Finance/Creation/DelLoanVehicleDetails",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingStatus = "stop";
                    $scope.GetAllLoanVehicleById(refData);
                    Swal.fire(res.data.ResponseMSG);
                    if (res.data.IsSuccess == true) {
                        $scope.VehicleDetailList.splice(ind, 1);
                    }
                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }
        });
    }

   
   

    //$scope.GetVehicleDetailById = function (beData) {
    //    $scope.loadingstatus = "running";
    //    var para = {
    //        VehicleDetailId: beData.VehicleDetailId
    //    };
    //    $http({
    //        method: 'POST',
    //        url: base_url + "Finance/Creation/getVehicleDetailById",
    //        dataType: "json",
    //        data: JSON.stringify(para)
    //    }).then(function (res) {
    //        $scope.loadingstatus = "stop";
    //        if (res.data.IsSuccess && res.data.Data) {
    //            $timeout(function () {
    //                $scope.beData = res.data.Data;

    //                if (!$scope.beData.ContactDetColl || $scope.beData.ContactDetColl.length == 0) {
    //                    $scope.beData.ContactDetColl = [];
    //                    $scope.beData.ContactDetColl.push({});
    //                }

    //                $scope.beData.Mode = 'Modify';

    //                var findZone = $scope.ZoneColl_Qry.firstOrDefault(p1 => p1.text == res.data.Data.Zone);

    //                if (findZone)
    //                    $scope.beData.ZoneId = findZone.id;
    //                else
    //                    $scope.beData.ZoneId = null;

    //                var findDistrict = $scope.DistrictColl_Qry.firstOrDefault(p1 => p1.text == res.data.Data.District);
    //                if (findDistrict)
    //                    $scope.beData.DistrictId = findDistrict.id;
    //                else
    //                    $scope.beData.DistrictId = null;

                   
    //            });


    //        } else
    //            Swal.fire(res.data.ResponseMSG);


    //    }, function (reason) {
    //        alert('Failed' + reason);
    //    });
    //}

    
});