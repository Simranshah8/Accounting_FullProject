app.controller("ControllPaymentTerms", function ($scope, $http, GlobalServices, $timeout) {
    $scope.Title = 'DebtorType';

    LoadData();


    function LoadData() {
        $scope.loadingstatus = "stop";

        $scope.confirmMSG = GlobalServices.getConfirmMSG();
        $scope.perPageColl = GlobalServices.getPerPageList();

        $scope.PayTypeList = [];
        $http({
            method: 'GET',
            url: base_url + "V1/StaticValues/GetPayTypes",
            dataType: "json"
        }).then(function (res) {
            if (res.data) {
                $scope.PayTypeList = res.data;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
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

        $scope.currentPages = {
            PaymentTerms: 1

        };

        $scope.searchData = {
            PaymentTerms: ''

        };

        $scope.perPage = {
            PaymentTerms: GlobalServices.getPerPageRow(),

        };
        $scope.beData =
        {
            PaymentTermsId: 0,
            Name: '',
            Alias: '',
            Code: '',
            IsActive: true,
            ImagePath: '',
            PayType:1,
            Mode: 'Save',
        };

    };

    $scope.ClearFields = function () {
        $scope.loadingstatus = "stop";
        $scope.newMaster = {
            TranId: 0
        };

        $scope.beData =
        {
            PaymentTermsId: 0,
            Name: '',
            Alias: '',
            Code: '',
            ImagePath: '',
            PayType: 1,
            Mode: 'Save'
        };

        $scope.ClearSliderPhoto();

        $('#txtName').focus();
    }

    $scope.GetAllPaymentTerms = function () {


        $scope.PaymentTermsColl = []; //declare an empty array

        if ($scope.loadingstatus != 'stop') {
            alert('Already Running Process')
            return;
        }

        $scope.loadingstatus = 'running';
        showPleaseWait();

        $http({
            method: 'GET',
            url: base_url + "Account/Creation/GetAllPaymentTerms",
            dataType: "json"
            //data:JSON.stringify(para)
        }).then(function (res) {

            $scope.loadingstatus = 'stop';
            hidePleaseWait();

            if (res.data.IsSuccess && res.data.Data) {
                $timeout(function () {
                    $scope.PaymentTermsColl = res.data.Data;
                });
            } else
                alert(res.data.ResponseMSG);

        }, function (reason) {
            alert('Failed' + reason);
        });

    }
    $scope.ClearSliderPhoto = function () {
        $timeout(function () {
            $scope.$apply(function () {
                $scope.beData.PhotoData = null;
                $scope.beData.Photo_TMP = [];
                $scope.beData.ImagePath = '';
            });
        });
        $('input[type=file]').val('');
        $('#imgPhoto1').attr('src', '');

    };

    $scope.IsValidDebtorCreditorType = function () {
        if ($scope.beData.Name.isEmpty()) {
            Swal.fire("Please ! Enter Valid Debtor Creditor Name");
            return false;
        }
        else
            return true;
    }

    $scope.AddNewPaymentTerms = function () {
        if ($scope.IsValidDebtorCreditorType() == true) {
            if ($scope.confirmMSG.Accept == true) {
                var saveModify = $scope.beData.Mode;
                Swal.fire({
                    title: 'Do you want to' + saveModify + 'the current data?',
                    showCancelButton: true,
                    confirmButtonText: saveModify,
                }).then((result) => {
                    if (result.isConfirmed) {
                        $scope.CallSaveUpdateDebtorCreditorsType();
                    }

                });
            }
            else
                $scope.CallSaveUpdateDebtorCreditorsType();
        }
    };

    $scope.CallSaveUpdateDebtorCreditorsType = function () {
        $scope.loadingstatus = 'running';
        showPleaseWait();

        var filesColl = [];
        //if ($scope.beData.PhotoData && $scope.beData.PhotoData.length > 0)
        //    filesColl.push($scope.beData.PhotoData[0]);

        if ($scope.beData.Photo_TMP && $scope.beData.Photo_TMP.length > 0)
            filesColl.push($scope.beData.Photo_TMP[0]);

        $http({
            method: 'POST',
            url: base_url + "Account/Creation/SaveUpdatePaymentTerms",
            headers: { 'content-Type': undefined },

            transformRequest: function (data) {
                var formData = new FormData();
                formData.append("jsonData", angular.toJson(data.jsonData));

                if (data.files) {
                    for (var i = 0; i < data.files.length; i++) {
                        if (data.files[i].File)
                            formData.append("file" + i, data.files[i].File);
                        else
                            formData.append("file" + i, data.files[i]);
                    }
                }
                 
                return formData;
            },
            data: { jsonData: $scope.beData, files: filesColl }
        }).then(function (res) {

            $scope.loadingstatus = "stop";
            hidePleaseWait();

            Swal.fire(res.data.ResponseMSG);
            if (res.data.IsSuccess == true) {
                $scope.ClearFields();
                $scope.GetAllPaymentTerms();
            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
        });
    }

    $scope.getPaymentTermsById = function (beData) {

        $scope.loadingstatus = "running";
        var para = {
            PaymentTermsId: beData.PaymentTermsId
        };

        $scope.newMaster = {
            TranId: beData.PaymentTermsId
        };
        $http({
            method: 'POST',
            url: base_url + "Account/Creation/getPaymentTermsById",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $timeout(function () {
                    $scope.beData = res.data.Data;
                    $scope.beData.Mode = 'Modify';
                    $('#custom-tabs-four-profile-tab').tab('show');
                });
            } else
                Swal.fire(res.data.ResponseMSG);

        }, function (reason) {
            alert('Failed' + reason);
        });
    }

    $scope.deletePaymentTerms = function (refData, ind) {

        Swal.fire({
            title: 'Are you sure to delete selected Payment Term :-' + refData.Name,
            showCancelButton: true,
            confirmButtonText: 'Delete',
        }).then((result) => {
            if (result.isConfirmed) {
                $scope.loadingstatus = "running";
                showPleaseWait();

                var para = {
                    PaymentTermsId: refData.PaymentTermsId
                };

                $http({
                    method: 'POST',
                    url: base_url + "Account/Creation/DeletePaymentTerms",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingstatus = "stop";
                    Swal.fire(res.data.ResponseMSG);
                    if (res.data.IsSuccess) {
                        $scope.PaymentTermsColl.splice(ind, 1);
                    }

                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }
        });

    }
    $scope.ShowPersonalImg = function (item) {
        $scope.viewImg = {
            ContentPath: ''
        };
        if (item.ImagePath && item.ImagePath.length > 0) {
            $scope.viewImg.ContentPath = item.ImagePath;
            $('#PersonalImg').modal('show');
        } else
            Swal.fire('No Image Found');

    };

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