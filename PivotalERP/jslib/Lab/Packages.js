app.controller('Packages', function ($scope, $filter, $http, $timeout, GlobalServices) {
    $scope.Title = 'Packages';
    var glSrv = GlobalServices;

    $scope.LoadData = function () {

        $scope.loadingstatus = "stop";

        $scope.confirmMSG = GlobalServices.getConfirmMSG();
        $scope.perPageColl = GlobalServices.getPerPageList();


        $scope.currentPages = {
            Packages: 1
        };

        $scope.searchData = {
            Packages: ''

        };

        $scope.perPage = {
            Packages: GlobalServices.getPerPageRow(),

        };

        $scope.newDet =
        {
            Code: '',
            Name: '',
            OrganizationId: null,
            CategoryId: null,
            PricingId: 1,
            Discount: '',
            FdAmount: 0,
            IsProfileTest: false,
            Mode: 'Save',
            LabPackageItemsColl: [],
        }

        $scope.newDet.LabPackageItemsColl.push({});
        //$scope.GetAllPackages();

        $scope.PricingColl = [
            { id: 1, text: 'Sum of items(auto)' },
            { id: 2, text: 'Bundle price(fixed)' },

        ];

        $scope.OrganizationColl = [
            { id: 1, text: 'Head Office-Main Lab' },
            { id: 2, text: 'Branch City Clinic' },

        ];

        $scope.CategoryColl = [
            { id: 1, text: 'Health Checkup' },
            { id: 2, text: 'ANC/ Pregancy' },
            { id: 3, text: 'Corporate' },
            { id: 4, text: 'Promotional' },
        ];

        $scope.TestPackagesColl = [];
        $http({
            method: 'POST',
            url: base_url + "Lab/Creation/GetAllLabTest",
            dataType: "json"
        }).then(function (res) {
            $scope.loadingstatus = 'stop';
            hidePleaseWait();
            if (res.data.IsSuccess && res.data.Data) {
                $scope.TestPackagesColl = res.data.Data;
            } else
                alert(res.data.ResponseMSG);
        }, function (reason) {
            alert('Failed' + reason);
        });
    };

    $scope.ClearFields = function () {
        $scope.newDet =
        {
            Code: '',
            Name: '',
            OrganizationId: null,
            CategoryId: null,
            PricingId: 1,
            Discount: '',
            FdAmount: 0,
            IsProfileTest: false,
            Mode: 'Save',
            LabPackageItemsColl: [],
        }
        $scope.newDet.LabPackageItemsColl.push({});
    }

    $scope.IsValidPackages = function () {
        return true;
    }

    $scope.SaveUpdatePackages = function () {
        if ($scope.IsValidPackages() == true) {
            if ($scope.confirmMSG.Accept == true) {
                var saveModify = $scope.newDet.Mode;
                Swal.fire({
                    title: 'Do you want to ' + saveModify + ' the current data?',
                    showCancelButton: true,
                    confirmButtonText: saveModify,
                }).then((result) => {
                    if (result.isConfirmed) {
                        $scope.CallSaveUpdatePackages();
                    }
                });
            } else
                $scope.CallSaveUpdatePackages();
        }
    };

    $scope.CallSaveUpdatePackages = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();
        $http({
            method: 'Post',
            url: base_url + "Lab/Creation/SaveLabPackage",
            headers: { 'Content-Type': undefined },
            transformRequest: function (data) {
                var formData = new FormData();
                formData.append("jsonData", angular.toJson(data.jsonData));
                return formData;
            },
            data: { jsonData: $scope.newDet }
        }).then(function (res) {
            $scope.loadingstatus = "stop";
            hidePleaseWait();
            Swal.fire(res.data.ResponseMSG);
            if (res.data.IsSuccess == true) {
                $scope.ClearFields();
            //$scope.GetAllPackages();
            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
        });
    };

    //$scope.ShowApprovemodal = function () {
    //    $('#ApproveModal').modal('show');
    //}

    $scope.GetAllPackages = function () {
        $scope.PackageData = [];
        $scope.loadingstatus = "running";
        showPleaseWait();
        $http({
            method: 'POST',
            url: base_url + "Lab/Creation/GetAllLabPackage",
            dataType: "json",
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.PackageData = res.data.Data;
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
            $('#ApproveModal').modal('show');
        }, function (reason) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            Swal.fire('Failed: ' + reason);
        });
    }

    $scope.GetPackagesById = function (refData) {
        $scope.loadingstatus = "running";
        showPleaseWait();
        var para = {
            PackageId: refData.PackageId
        };
        $http({
            method: 'POST',
            url: base_url + "Lab/Creation/GetLabPackageById",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.newDet = res.data.Data;
                $scope.newDet.Mode = 'Modify';
                //for child table
                if (!$scope.newDet.LabPackageItemsColl || $scope.newDet.LabPackageItemsColl.length == 0) {
                    $scope.newDet.LabPackageItemsColl = [];
                    $scope.newDet.LabPackageItemsColl.push({});
                } else
                    $scope.UpdateTotals();
                //end
                $('#ApproveModal').modal('hide');
            } else {
                Swal.fire(res.data.ResponseMSG);
            }

        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    };


    $scope.DelPackage = function (refData, ind) {
        Swal.fire({
            title: 'Are you sure you want to delete ' + refData.Name + '?',
            showCancelButton: true,
            confirmButtonText: 'Delete',
        }).then((result) => {
            if (result.isConfirmed) {
                var para = { PackageId: refData.PackageId };
                $http({
                    method: 'POST',
                    url: base_url + "Lab/Creation/DelLabPackage",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingStatus = "stop";

                    Swal.fire(res.data.ResponseMSG);
                    if (res.data.IsSuccess == true) {
                        //    $scope.GetAllPackages();
                    }
                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }
        });
    }
    //for child table
    $scope.AddPHDDetails = function (ind) {
        if ($scope.newDet.LabPackageItemsColl) {
            if ($scope.newDet.LabPackageItemsColl.length > ind + 1) {
                $scope.newDet.LabPackageItemsColl.splice(ind + 1, 0, {
                    Qty: 1
                })
            } else {
                $scope.newDet.LabPackageItemsColl.push({
                    Qty: 1
                })
            }
        }
    };

    //for child table
    $scope.delPHDDetails = function (ind) {
        if ($scope.newDet.LabPackageItemsColl) {
            if ($scope.newDet.LabPackageItemsColl.length > 1) {
                $scope.newDet.LabPackageItemsColl.splice(ind, 1);
            }
        }
    };      

    $scope.LabTestDetails = function (V) {
        var selectLabTest = $scope.TestPackagesColl.find(x => x.LabTestId === V.TestPackageId);
        if (selectLabTest) {
            V.TestName = selectLabTest.TestName;
            V.Code = selectLabTest.TestCode;
            V.UnitPrice = selectLabTest.BasePrice;
            if (!V.Qty || V.Qty == 0) {
                V.Qty = 1;
            }
        }
        $scope.CalQtyPrice(V);
    };

    $scope.CalQtyPrice = function (pDet) {
        var qty = parseFloat(pDet.Qty) || 0;
        var price = parseFloat(pDet.UnitPrice) || 0;
        pDet.LineTotal = qty * price;
        $scope.UpdateTotals();
    };

    $scope.UpdateTotals = function () {
        var total = 0;
        angular.forEach($scope.newDet.LabPackageItemsColl, function (item) {
            total += parseFloat(item.LineTotal) || 0;
        });
        $scope.newDet.GrandTotal = total;
        var discount = parseFloat($scope.newDet.Discount) || 0;
        $scope.newDet.DiscountAmount = (total * discount) / 100;
        if ($scope.newDet.PricingId == 1) {
            $scope.newDet.NetTotal = total - $scope.newDet.DiscountAmount;
        } else
            $scope.newDet.NetTotal = $scope.newDet.FdAmount;
    };

});