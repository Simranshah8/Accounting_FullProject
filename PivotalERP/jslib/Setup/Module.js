app.controller("moduleController", function ($scope, $http, GlobalServices, $timeout) {
    $scope.Title = 'Modules';

    LoadData(); 
    function LoadData() {
        $scope.loadingstatus = "stop";

        $scope.TemplatesTypes = [
            { id: 1, text: 'Transaction' },
            { id: 2, text: 'Reporting' }
        ];

        $scope.ModuleLocationColl = [{ id: 1, text: 'Left Side' }, { id: 2, text: 'Top' }];

        $scope.confirmMSG = GlobalServices.getConfirmMSG();

        $scope.perPageColl = GlobalServices.getPerPageList();

        $('.select2').select2({
            allowClear: true,
            openOnEnter: true
        });

        //$scope.FontIconColl = getFontIcons();
        $scope.currentPages = {
            Module: 1

        };

        $scope.searchData = {
            Module: ''

        };

        $scope.perPage = {
            Module: GlobalServices.getPerPageRow(),

        }
        $scope.beData =
        {
            ModuleId: 0,
            AutoNumber: 0,
            Name: '',
            IsActive: true,
            InBuiltModule: false,
            Location:1,
        };

        $scope.TransactionEntityColl = [];
        $scope.ReportEntityColl = [];
        $http({
            method: 'POST',
            url: base_url + "Global/GetFormEntity",
            dataType: "json"
        }).then(function (res)
        {
            $scope.TransactionEntityColl = res.data.Data;
        }, function (reason) {
            alert('Failed' + reason);
        });

        $http({
            method: 'POST',
            url: base_url + "Global/GetRptFormEntity",
            dataType: "json"
        }).then(function (res) {
            $scope.ReportEntityColl = res.data.Data;
        }, function (reason) {
            alert('Failed' + reason);
        });

    };

    $scope.ClearFields = function () {
        $scope.loadingstatus = "stop";
        $scope.beData =
        {
            ModuleId: 0,
            AutoNumber: 0,
            Name: '',
            IsActive: true,
            InBuiltModule: false,
            Location:1,
        };
        $('#txtName').focus();
    }

    $scope.GetAllModule = function () {


        $scope.ModuleColl = []; //declare an empty array

        if ($scope.loadingstatus != 'stop') {
            alert('Already Running Process')
            return;
        }

        $scope.loadingstatus = 'running';
        showPleaseWait();

        $http({
            method: 'POST',
            url: base_url + "Setup/Security/GetAllModule",
            dataType: "json"
            //data:JSON.stringify(para)
        }).then(function (res) {

            $scope.loadingstatus = 'stop';
            hidePleaseWait();

            if (res.data.IsSuccess && res.data.Data) {
                $timeout(function () {
                    $scope.ModuleColl = res.data.Data;
                });
            } else
                alert(res.data.ResponseMSG);

        }, function (reason) {
            alert('Failed' + reason);
        });

    }


    $scope.IsValidModule = function () {
        if ($scope.beData.Name.isEmpty()) {
            Swal.fire("Please ! Enter Valid Module Name");
            return false;
        }
        else
            return true;
    }

    $scope.AddNewModule = function () {
        if ($scope.IsValidModule() == true) {
            if ($scope.confirmMSG.Accept == true) {
                var saveModify = $scope.beData.Mode;
                Swal.fire({
                    title: 'Do you want to' + saveModify + 'the current data?',
                    showCancelButton: true,
                    confirmButtonText: saveModify,
                }).then((result) => {
                    if (result.isConfirmed) {
                        $scope.CallSaveUserGroup();
                    }

                });
            }
            else
                $scope.CallSaveModule();
        }
    };

    $scope.CallSaveModule = function () {
        $scope.loadingstatus = 'running';
        showPleaseWait();

        $http({
            method: 'POST',
            url: base_url + "Setup/Security/SaveModule",
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
                $scope.GetAllModule();
            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
        });
    }
    $scope.getModuleById = function (beData) {

        if (beData.AutoNumber < 1000 || beData.InBuiltModule==true) {
            Swal.fire('Can not edit default module');
            return;
        }

        $scope.loadingstatus = "running";
        var para = {
            ModuleId: beData.ModuleId
        };
        $http({
            method: 'POST',
            url: base_url + "Setup/Security/GetModuleById",
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

    $scope.deleteModule = function (refData, ind) {

        if (refData.AutoNumber < 1000 || refData.InBuiltModule == true) {
            Swal.fire('Can not delete default module');
            return;
        }


        Swal.fire({
            title: 'Are you sure to delete selected Module :-' + refData.Name,
            showCancelButton: true,
            confirmButtonText: 'Delete',
        }).then((result) => {
            if (result.isConfirmed) {
                $scope.loadingstatus = "running";
                showPleaseWait();

                var para = {
                    ModuleId: refData.ModuleId
                };

                $http({
                    method: 'POST',
                    url: base_url + "Setup/Security/DelModule",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingstatus = "stop";
                    Swal.fire(res.data.ResponseMSG);
                    if (res.data.IsSuccess) {
                        $scope.ModuleColl.splice(ind, 1);
                    }

                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }
        });

    }


    $scope.SelectedModule = {};
    $scope.ShowModuleMenu = function (md) {
        $scope.SelectedModule = md;


        $scope.loadingstatus = "running";
        var para = {
            ModuleId: md.AutoNumber
        };
        $http({
            method: 'POST',
            url: base_url + "Setup/Security/GetModuleMenuById",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.SelectedModule.EntityColl = res.data.Data;

                if (!$scope.SelectedModule.EntityColl || $scope.SelectedModule.EntityColl.length == 0) {
                    $scope.SelectedModule.EntityColl = [];
                    $scope.SelectedModule.EntityColl.push({ SNo: 1, RptType:1 });
                }

                angular.forEach($scope.SelectedModule.EntityColl, function (ec) {
                    if (ec.IsReport)
                        ec.RptType = 2;
                    else
                        ec.RptType = 1;
                });

                $('#mdlModuleMenu').modal('show');
            } else
                Swal.fire(res.data.ResponseMSG);

        }, function (reason) {
            alert('Failed' + reason);
        });

    };

    $scope.delRowInModuleMenu = function (ind) {

        if ($scope.SelectedModule) {
            if ($scope.SelectedModule.EntityColl) {
                if ($scope.SelectedModule.EntityColl.length > 1) {
                    $scope.SelectedModule.EntityColl.splice(ind, 1);
                }
            }
        }

    }

    $scope.addRowModeuleMenu = function (ind) {

        if ($scope.SelectedModule) {
            if (!$scope.SelectedModule.EntityColl || $scope.SelectedModule.EntityColl.length == 0)
                $scope.SelectedModule.EntityColl.push({});

            if ($scope.SelectedModule.EntityColl) {
                if ($scope.SelectedModule.EntityColl.length > ind + 1) {
                    $scope.SelectedModule.EntityColl.splice(ind + 1, 0, {

                    })
                } else {
                    $scope.SelectedModule.EntityColl.push({
                    })
                }
            }
        }

    }


    $scope.SaveModuleMenu = function () {

        if (!$scope.SelectedModule)
            return;

        $scope.loadingstatus = 'running';
        showPleaseWait();

        var dataColl = [];
        angular.forEach($scope.SelectedModule.EntityColl, function (ent) {
            dataColl.push({
                ModuleId: $scope.SelectedModule.AutoNumber,
                EntityId: ent.EntityId,
                IsReport: ent.RptType == 1 ? false : true,
                Name: ent.Name,
                SNo: ent.SNo,
                FilterPara: ent.FilterPara,
                ShortCutKeys: ent.ShortCutKeys,
                UrlPath:ent.UrlPath,
            });
        });

        $http({
            method: 'POST',
            url: base_url + "Setup/Security/SaveModuleMenu",
            headers: { 'content-Type': undefined },

            transformRequest: function (data) {
                var formData = new FormData();
                formData.append("jsonData", angular.toJson(data.jsonData));
                return formData;
            },
            data: { jsonData: dataColl }
        }).then(function (res) {

            $scope.loadingstatus = "stop";
            hidePleaseWait();

            Swal.fire(res.data.ResponseMSG);
            if (res.data.IsSuccess == true) {
                $('#mdlModuleMenu').modal('hide');
            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
        });
    }

});