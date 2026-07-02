app.controller('GrievanceTypeController', function ($scope, $http, $timeout, $filter, GlobalServices) {
    $scope.Title = 'GrievanceType';
    $scope.LoadData= function() {
        $('.select2').select2();
        $scope.confirmMSG = GlobalServices.getConfirmMSG();
        $scope.perPageColl = GlobalServices.getPerPageList();
        $scope.currentPages = {
            GrievanceType: 1,
        };
        $scope.searchData = {
            GrievanceType: '',

        };
        $scope.perPage = {
            GrievanceType: GlobalServices.getPerPageRow()
        };

        $scope.DataTypeColl = [];
        $http({
            method: 'GET',
            url: base_url + "Setup/ReportWriter/GetDataTypeList",
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

        $scope.PkTablesColl = [];
        $scope.PkTablesColl_Qry = [];
        $http.get(base_url + "Setup/ReportWriter/GetPKTables").then(function (res) {
            $scope.PkTablesColl = res.data.Data;
            $scope.PkTablesColl_Qry = mx(res.data.Data);
        }, function (reason) { Swal.fire('Failed: ' + reason); });


        $scope.newDet = {
            TranId: null,
            Name: '',
            Code:'',
            OrderNo: 0,
            IsActive: true,
            Description: '',
            VoucherUDFCol: [],
            Mode: 'Save'
        };
        $scope.GetAllGrievanceType();
        $scope.newDet.VoucherUDFCol.push({ DefaultValue: '', ColWidth: 3 });
        $scope.TypeParentList = [];
    };

    $scope.ClearGrievanceType = function () {
        $scope.newDet = {
            TranId: null,
            Name: '',
            Code: '',
            OrderNo: 0,
            IsActive: true,
            Description: '',
            VoucherUDFCol: [],
            Mode: 'Save'
        };
        $scope.newDet.VoucherUDFCol.push({ DefaultValue: '', ColWidth: 3 });


    }
    //************************* GrievanceTypel *********************************
    $scope.IsValidGrievanceType = function () {
        if ($scope.newDet.Name.isEmpty()) {
            GlobalServices.validateAndFocus('GrievanceTypeName', 'Please ! Enter  Name');
            GlobalServices.validateAndFocus()
            return false;
        }
        return true;
    }

    $scope.SaveGrievanceType = function () {
        if ($scope.IsValidGrievanceType() == true) {
            if ($scope.confirmMSG.Accept == true) {
                var saveModify = $scope.newDet.Mode;
                Swal.fire({
                    title: 'Do you want to ' + saveModify + ' the current data?',
                    showCancelButton: true,
                    confirmButtonText: saveModify,
                }).then((result) => {
                    if (result.isConfirmed) {
                        $scope.CallSaveUpdateGrievanceType();
                    }
                });
            } else
                $scope.CallSaveUpdateGrievanceType();
        }
    };

    $scope.CallSaveUpdateGrievanceType = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();
        if ($scope.newDet.VoucherUDFCol && $scope.newDet.VoucherUDFCol.length > 0) {
            $scope.newDet.VoucherUDFCol.forEach(function (f) {
                if (f.SelectedRefTable) {
                    f.RefTable = f.SelectedRefTable.Table;
                    f.RefColumn = f.SelectedRefTable.ColumnName;
                } else {
                    f.RefColumn = '';
                    f.RefTable = '';
                }
            });
        }
        $http({
            method: 'POST',
            url: base_url + "HR/Master/SaveGrievanceType",
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
                $scope.ClearGrievanceType();
                $scope.GetAllGrievanceType();
            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
        });
    }


    $scope.GetAllGrievanceType = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();
        $scope.GrievanceTypeList = [];
        $http({
            method: 'POST',
            url: base_url + "HR/Master/GetAllGrievanceType",
            dataType: "json"
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.GrievanceTypeList = res.data.Data;
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    }

    $scope.getGrievanceTypeById = function (refData) {
        $scope.loadingstatus = "running";
        showPleaseWait();
        var para = {
            TranId: refData.TranId
        };
        $http({
            method: 'POST',
            url: base_url + "HR/Master/GetGrievanceTypeById",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.newDet = res.data.Data;
                if (!$scope.newDet.VoucherUDFCol || $scope.newDet.VoucherUDFCol.length == 0) {
                    $scope.newDet.VoucherUDFCol = [];
                    $scope.newDet.VoucherUDFCol.push({ DefaultValue: '', ColWidth: 3 });
                }
                if ($scope.newDet.VoucherUDFCol && $scope.newDet.VoucherUDFCol.length > 0) {
                    $scope.newDet.VoucherUDFCol.forEach(function (fl) {
                        if (fl.RefTable && fl.RefTable.length > 0) {
                            var findTbl = $scope.PkTablesColl_Qry.firstOrDefault(p1 => p1.Table == fl.RefTable);
                            if (findTbl)
                                fl.SelectedRefTable = findTbl;
                        }
                    });
                }
                $scope.newDet.Mode = 'Modify';
                $('#custom-tabs-four-profile-tab').tab('show');
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    };

    $scope.DelGrievanceTypeById = function (refData) {
        Swal.fire({
            title: 'Do you want to delete ' + refData.Name + '?',
            showCancelButton: true,
            confirmButtonText: 'Delete',
        }).then((result) => {
            if (result.isConfirmed) {
                var para = {
                    TranId: refData.TranId
                };
                $http({
                    method: 'POST',
                    url: base_url + "HR/Master/DelGrievanceType",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingStatus = "stop";

                    Swal.fire(res.data.ResponseMSG);
                    if (res.data.IsSuccess == true) {
                        $scope.GetAllGrievanceType();
                    }
                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }
        });
    }


     //for child table
    $scope.AddCurItemUdf = function (ind) {
        //if ($scope.newDet.VoucherUDFCol[ind].Label && $scope.newDet.VoucherUDFCol[ind].Label.length > 0) {
            if ($scope.newDet.VoucherUDFCol.length > ind + 1) {
                $scope.newDet.VoucherUDFCol.splice(ind + 1, 0, {
                    ApplicableFromDet: null,
                    DefaultValue: '',
                    ColWidth: 3,
                })
            } else {
                $scope.newDet.VoucherUDFCol.push({
                    ApplicableFromDet: null,
                    DefaultValue: '',
                    ColWidth: 3,
                });
            }
        /*}*/
    };


    $scope.delCurItemUdf = function (ind) {
        if ($scope.newDet.VoucherUDFCol) {
            if ($scope.newDet.VoucherUDFCol.length > 1) {
                $scope.newDet.VoucherUDFCol.splice(ind, 1);
            }
        }
    };

});




