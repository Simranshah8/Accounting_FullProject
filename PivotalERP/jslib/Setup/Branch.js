app.controller("Branch", function ($scope, $http, GlobalServices, $timeout) {
    $scope.Title = 'Branch';

    LoadData();


    function LoadData() {

        $('.select2').select2({
            allowClear: true,
            openOnEnter: true
        });

        $scope.loadingstatus = "stop";
        $scope.confirmMSG = GlobalServices.getConfirmMSG();
        $scope.perPageColl = GlobalServices.getPerPageList();

        $scope.currentPages = {
            Branch: 1

        };

        $scope.searchData = {
            Branch: ''

        };

        $scope.perPage = {
            Branch: GlobalServices.getPerPageRow(),

        }
        $scope.beData =
        {
            BranchId: 0,
            Name: '',
            Address: '',
            Code: '',
            ContactPerson: '',
            ContactNo: '',
            FaxNo: '',
            PanNo: '',
            EmailId: '',
            BlockTransaction: false,
           
        };
        $scope.loadingstatus = "running";
        showPleaseWait();

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

        $scope.GodownList = [];
        $http({
            method: 'GET',
            url: base_url + "Inventory/Reporting/GetAllGodownList",
            dataType: "json",
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.GodownList = res.data.Data;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
         
        $scope.VoucherList = [];
        $http({
            method: 'GET',
            url: base_url + "Account/Creation/GetAllVoucherList",
            dataType: "json",
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.VoucherList = res.data.Data;
                hidePleaseWait();
                $scope.loadingstatus = "stop";
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    };

    $scope.ClearFields = function () {
        $scope.loadingstatus = "stop";

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
            BranchId: 0,
            Name: '',
            Address: '',
            Code: '',
            ContactPerson: '',
            ContactNo: '',
            FaxNo: '',
            PanNo: '',
            EmailId: '',
            BlockTransaction: false,
        };
        $('#txtName').focus();
    }




    $scope.IsValidBranch = function () {
        if ($scope.beData.Name.isEmpty()) {
            Swal.fire("Please ! Enter the Name of Branch");
            return false;
        }
        if ($scope.beData.Code.isEmpty()) {
            Swal.fire("Please ! Enter the Valid Code");
            return false;
        }
        else
            return true;
    }

    $scope.AddNewBranch = function () {
        if ($scope.IsValidBranch() == true) {
            if ($scope.confirmMSG.Accept == true) {
                var saveModify = $scope.beData.Mode;
                Swal.fire({
                    title: 'Do you want to' + saveModify + 'the current data?',
                    showCancelButton: true,
                    confirmButtonText: saveModify,
                }).then((result) => {
                    if (result.isConfirmed) {
                        $scope.CallSaveBranch();
                    }

                });
            }
            else
                $scope.CallSaveBranch();
        }
    };

    $scope.CallSaveBranch = function () {
        $scope.loadingstatus = 'running';
        showPleaseWait();

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
            url: base_url + "Setup/Security/SaveBranch",
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
                $scope.GetAllBranch();
            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
        });
    }
    $scope.GetAllBranch = function () {


        $scope.BranchColl = []; //declare an empty array

        //if ($scope.loadingstatus != 'stop') {
        //    alert('Already Running Process')
        //    return;
        //}

        $scope.loadingstatus = 'running';
        showPleaseWait();

        $http({
            method: 'GET',
            url: base_url + "Setup/Security/GetAllBranchList",
            dataType: "json"
            //data:JSON.stringify(para)
        }).then(function (res) {

            $scope.loadingstatus = 'stop';
            hidePleaseWait();

            if (res.data.IsSuccess && res.data.Data) {
                $timeout(function () {
                    $scope.BranchColl = res.data.Data;
                });
            } else
                alert(res.data.ResponseMSG);

        }, function (reason) {
            alert('Failed' + reason);
        });

    }

    $scope.getBranchById = function (beData) {

        $scope.loadingstatus = "running";
        var para = {
            BranchId: beData.BranchId
        };
        $http({
            method: 'POST',
            url: base_url + "Setup/Security/GetBranchById",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $timeout(function () {
                    $scope.beData = res.data.Data;

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

                    $scope.beData.Mode = 'Modify';
                    $('#custom-tabs-four-profile-tab').tab('show');
                });
            } else
                Swal.fire(res.data.ResponseMSG);

        }, function (reason) {
            alert('Failed' + reason);
        });
    }

    $scope.deleteBranch = function (refData, ind) {

        Swal.fire({
            title: 'Are you sure to delete selected Branch :-' + refData.Name,
            showCancelButton: true,
            confirmButtonText: 'Delete',
        }).then((result) => {
            if (result.isConfirmed) {
                $scope.loadingstatus = "running";
                showPleaseWait();

                var para = {
                    BranchId: refData.BranchId
                };

                $http({
                    method: 'POST',
                    url: base_url + "Setup/Security/DelBranch",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingstatus = "stop";
                    Swal.fire(res.data.ResponseMSG);
                    if (res.data.IsSuccess) {
                        $scope.BranchColl.splice(ind, 1);
                    }

                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }
        });

    }


    $scope.CreateMaster = function (refData, ind) {

        Swal.fire({
            title: 'Are you sure to create master selected branch :-' + refData.Name,
            showCancelButton: true,
            confirmButtonText: 'Delete',
        }).then((result) => {
            if (result.isConfirmed) {
                $scope.loadingstatus = "running";
                showPleaseWait();

                var para = {
                    BranchId: refData.BranchId
                };

                $http({
                    method: 'POST',
                    url: base_url + "Setup/Security/CreateBranchMaster",
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
});