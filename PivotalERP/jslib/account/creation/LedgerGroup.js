app.controller("LedgerGroup", function ($scope, $http, GlobalServices, $timeout) {
    $scope.Title = 'Ledger Group';
   

    LoadData();

    function LoadData() {
        $('#cboBaseGroup').select2(
            {
                placeholder: '**Please ! Select Base Group Name **',
                allowClear: true,
                openOnEnter: true,
            });
        $scope.loadingstatus = "stop";

        $scope.confirmMSG = GlobalServices.getConfirmMSG();
        $scope.perPageColl = GlobalServices.getPerPageList(); 
      
        $scope.currentPages = {
            LedgerGroup: 1
        };

        $scope.searchData = {
            LedgerGroup: ''
        };

        $scope.perPage = {
            LedgerGroup: GlobalServices.getPerPageRow(),
        };

        $scope.beData =
        {
            LedgerGroupId: 0,
            Name: '',
            IsActive: true,
            AutoNumber: 0,
            Mode: 'Save',
            ParentGroupId: 0,
            NatureOfGroup: 0,
            BDId: 0,
            InBuilt: false,
            TypeOfGroup: 1,
            ShowInLedgerMaster: true,
            SNo: 0,
            CreditLimitAmount:0,
        };

        $scope.NatureOfGroupColl = [];
        $http({
            method: 'GET',
            url: base_url + "V1/StaticValues/GetNatureOfLG",
            dataType: "json"
        }).then(function (res) {
            if (res.data) {
                $scope.NatureOfGroupColl = res.data;
            }
        }, function (reason) {
            alert('Failed' + reason);
        });

        $scope.TypeOfLedgerGroupColl = [];
        $http({
            method: 'GET',
            url: base_url + "V1/StaticValues/GetTypeOfLedgerGroup",
            dataType: "json"
        }).then(function (res) {
            if (res.data) {
                $scope.TypeOfLedgerGroupColl = res.data;
            }
        }, function (reason) {
            alert('Failed' + reason);
        });
    };
    $scope.ClearFields = function () {

        $scope.newMaster = {
            TranId: 0
        };
        $scope.loadingstatus = "stop";
        $timeout(function () {
            $scope.beData =
            {
                LedgerGroupId: 0,
                Name: '',
                IsActive: true,
                AutoNumber: 0,
                Mode: 'Save',
                ParentGroupId: 0,
                NatureOfGroup: 0,
                BDId: 0,
                InBuilt: false,
                TypeOfGroup: 1,
                ShowInLedgerMaster: true,
                SNo: 0,
                CreditLimitAmount: 0,
            };
            $('#cboBaseGroup').val(null).trigger("change");
            $('#txtName').focus();
        });
       
    }
     

    $scope.GetAllLedgerGroup= function () {
         
        $scope.LedgerGroupColl = []; //declare an empty array

        if ($scope.loadingstatus != 'stop') {
            alert('Already Running Process')
            return;
        }

        $scope.loadingstatus = 'running';
        showPleaseWait();

        $http({
            method: 'GET',
            url: base_url + "Account/Creation/GetAllLedgerGroup",
            dataType: "json"
            //data:JSON.stringify(para)
        }).then(function (res) {

            $scope.loadingstatus = 'stop';
            hidePleaseWait();

            if (res.data.IsSuccess && res.data.Data) {
                $timeout(function () {
                    $scope.LedgerGroupColl = res.data.Data;
                });
            } else
                alert(res.data.ResponseMSG);

        }, function (reason) {
            alert('Failed' + reason);
        });

    }

    $scope.IsValidLedgerGroup = function () {
         if ($scope.beData.Name.isEmpty()) {
         Swal.fire("Please ! Enter Valid Ledger Group Name");
         return false;
         }

         if ($scope.beData.ParentGroupId <= 0) {
            Swal.fire("Please ! Select Parent Base Group");
            return false;
        }

        if ($scope.beData.ParentGroupId == 1 && $scope.beData.NatureOfGroup == 0) {
            Swal.fire("Please ! Select Nature Of Group");
            return false;
        }

        return true;
    }

    $scope.AddNewLedgerGroup = function () {
        if ($scope.IsValidLedgerGroup() == true) {
            if ($scope.confirmMSG.Accept == true) {
                var saveModify = $scope.beData.Mode;
                Swal.fire({
                    title: 'Do you want to' + saveModify + 'the current data?',
                    showCancelButton: true,
                    confirmButtonText: saveModify,
                }).then((result) => {
                    if (result.isConfirmed) {
                        $scope.CallSaveUpdateLedgerGroup();
                    }

                });
            }
            else
                $scope.CallSaveUpdateLedgerGroup();
        }
    };

    $scope.CallSaveUpdateLedgerGroup = function () {
        $scope.loadingstatus = 'running';
        showPleaseWait();
        if ($scope.beData.ParentGroupId > 1) {
            var baseGroup = mx($scope.LedgerGroupColl).firstOrDefault(p1 => p1.LedgerGroupId == $scope.beData.ParentGroupId);
            $scope.beData.NatureOfGroup = baseGroup.NatureOfGroup;
        }
        

        $http({
            method: 'POST',
            url: base_url + "Account/Creation/SaveUpdateLedgerGroup",
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

            if (res.data.IsSuccess == true) {
                $scope.ClearFields();
                $scope.GetAllLedgerGroup();
            } else
                Swal.fire(res.data.ResponseMSG);

        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
        });
    }

    $scope.GetLedgerGroupById = function (beData) {

        $scope.loadingstatus = "running";
        var para = {
            LedgerGroupId: beData.LedgerGroupId
        };


        $scope.newMaster = {
            TranId: beData.LedgerGroupId
        };

        $http({
            method: 'POST',
            url: base_url + "Account/Creation/GetLedgerGroupById",
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
                alert(res.data.ResponseMSG);

        }, function (reason) {
            alert('Failed' + reason);
        });

    }


    $scope.DeleteLedgerGroup = function (beData, ind) {


        Swal.fire({
            //scope: $scope,
            title: 'Are you sure you want to delete ' + beData.Name + '?',
            showCancelButton: true,
            confirmButtonText: 'Delete',
            //message: 'Are you sure to delete selected Branch :-' + beData.Name,
        }).then((result) => {
            if (result.isConfirmed) {
                $scope.loadingstatus = "running";
                showPleaseWait();

                var para = { LedgerGroupId: beData.LedgerGroupId };

                $http({
                    method: 'POST',
                    url: base_url + "Account/Creation/DeleteLedgerGroup",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingstatus = "stop";
                    Swal.fire(res.data.ResponseMSG);
                    if (res.data.IsSuccess) {
                            $scope.LedgerGroupColl.splice(ind, 1);
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