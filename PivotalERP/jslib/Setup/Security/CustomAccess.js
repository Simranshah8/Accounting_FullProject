app.controller('CustomAccess', function ($scope, $filter, $http, $timeout, GlobalServices) {
    $scope.Title = 'CustomAccess';
    $scope.LoadData = function () {
        $('.select2').select2();
        $scope.loadingstatus = "stop";
        $scope.confirmMSG = GlobalServices.getConfirmMSG();
        $scope.perPageColl = GlobalServices.getPerPageList();
        $scope.currentPages = {
            CustomAccess: 1
        };
        $scope.searchData = {
            CustomAccess: ''
        };
        $scope.perPage = {
            CustomAccess: GlobalServices.getPerPageRow(),
        };

        $scope.GetAllCustomAccess();
        $scope.ModuleList = [];
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
                    $scope.ModuleList = res.data.Data;
                });
            } else
                alert(res.data.ResponseMSG);
        }, function (reason) {
            alert('Failed' + reason);
        });

        $scope.UserList = [];
        $http({
            method: 'POST',
            url: base_url + "Setup/Security/GetAllUserList",
            dataType: "json"
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.UserList = res.data.Data;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        $scope.UserGroupList = [];
        $http({
            method: 'POST',
            url: base_url + "Setup/Security/GetAllUserGroupList",
            dataType: "json"
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.UserGroupList = res.data.Data;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });


        $scope.beData = {
            AccessName: '',
            ModuleId: null,
            EntityIds: null,
            IsEdit: true,
            CustomAccessColl: [],
        }
        $scope.beData.CustomAccessColl.push({ IsNew: true});
    };

    $scope.ClearFields = function () {
        $scope.beData = {
            AccessName: '',
            ModuleId: null,
            EntityIds: null,
            IsEdit: true,
            CustomAccessColl: [],
            Mode: 'Save',
        }
        $scope.beData.CustomAccessColl.push({ IsNew: true });
        $scope.EntityList = [];
    }


    $scope.IsValidCustomAccessName = function () {
        for (var i = 0; i < $scope.beData.CustomAccessColl.length; i++) {
            var row = $scope.beData.CustomAccessColl[i];
            if (!row.AccessName || row.AccessName.trim() === "") {
                let el = document.getElementById("accessName_" + i);
                swal.fire({
                    title: 'Access Name is required !',
                    confirmButtonText: 'OK'
                }).then(() => {
                    if (!el) return;
                    el.focus();
                    el.select();
                    let lock = function () {
                        if (!el.value.trim()) {
                            el.focus(); 
                        } else {
                            el.removeEventListener('blur', lock);
                        }
                    };
                    el.addEventListener('blur', lock);
                });
                return false; 
            }
        }
        return true;
    };


    $scope.IsValidCustomAccess = function () {
        if (!$scope.beData.ModuleId) {    
            swal.fire({
                title: 'Please select Module !',
            }).then(() => {
                $('#moduleId').select2('open');
            });
            return false
        }
        if (!$scope.beData.EntityIds) {
            swal.fire({
                title: 'Please select Entity!',
            }).then(() => {
                $('#EntityIds').select2('open');
            });
            return false
        }
        if (!$scope.IsValidCustomAccessName()) {
            return;
        }
        return true;
    }


    $scope.SaveCustomAccess = function () {
        if ($scope.IsValidCustomAccess() == true) {
            if ($scope.confirmMSG.Accept == true) {
                var saveModify = $scope.beData.Mode;
                Swal.fire({
                    title: 'Do you want to' + saveModify + 'the current data?',
                    showCancelButton: true,
                    confirmButtonText: saveModify,
                }).then((result) => {
                    if (result.isConfirmed) {
                        $scope.CallSaveUpdateCustomAccess();
                    }
                });
            }
            else
                $scope.CallSaveUpdateCustomAccess();
        }
        };


    $scope.CallSaveUpdateCustomAccess = function () {
        if (!$scope.beData.CustomAccessColl || $scope.beData.CustomAccessColl.length === 0) {
            Swal.fire("No data to save.");
            return;
        }
        var dataToSave = [];
        angular.forEach($scope.beData.CustomAccessColl, function (item) {
            dataToSave.push({
                AccessName: item.AccessName,
                UserId: item.UserId ? item.UserId.join(',') : "",
                GroupId: item.GroupId ? item.GroupId.join(',') : "",
                ModuleId: $scope.beData.ModuleId,
                EntityIds: $scope.beData.EntityIds,
                AutoNumber: item.AutoNumber
            });
        });
        showPleaseWait();
        $http({
            method: 'POST',
            url: base_url + "Setup/Security/SaveCustomAccess",
            headers: { 'Content-Type': undefined },
            transformRequest: function (data) {
                var formData = new FormData();
                formData.append("jsonData", angular.toJson(data.jsonData));
                return formData;
            },
            data: { jsonData: dataToSave }
        }).then(function (res) {
            hidePleaseWait();
            Swal.fire(res.data.ResponseMSG);
            if (res.data.IsSuccess) {
                $scope.ClearFields();
                $scope.GetAllCustomAccess();
            }
        }, function () {
            hidePleaseWait();ssssss
        });
    };

    $scope.GetAllCustomAccess = function () {
        $scope.CustomAccessList = [];
        $scope.loadingstatus = 'running';
        showPleaseWait();
        $http({
            method: 'POST',
            url: base_url + "Setup/Security/GetAllCustomAccess",
            dataType: "json"
        }).then(function (res) {
            $scope.loadingstatus = 'stop';
            hidePleaseWait();
            if (res.data.IsSuccess && res.data.Data) {
                $scope.CustomAccessList = res.data.Data;
            } else
                Swal.fire(res.data.ResponseMSG);
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    }


    $scope.GetCustomAccessById = function (refData) {
        $scope.loadingstatus = "running";
        $scope.beData.IsEdit = false;
        $scope.beData.ModuleId = refData.ModuleId;
        $scope.GetEntityList();
        var para = {
            ModuleId: refData.ModuleId,
            EntityIds: refData.EntityIds, 
        };
        $http({
            method: 'POST',
            url: base_url + "Setup/Security/GetCustomAccessById",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $timeout(function () {
                    $scope.beData = res.data.Data;
                    $scope.beData.Mode = 'Modify';
                    angular.forEach($scope.beData.CustomAccessColl, function (item) {
                        item.IsNew = false;
                        if (item.UserId && typeof item.UserId === 'string') {
                            item.UserId = item.UserId.split(',').map(Number);
                        } else if (!item.UserId) {
                            item.UserId = [];
                        }
                        if (item.GroupId && typeof item.GroupId === 'string') {
                            item.GroupId = item.GroupId.split(',').map(Number);
                        } else if (!item.GroupId) {
                            item.GroupId = [];
                        }
                    });
                    //for child table
                    if (!$scope.beData.CustomAccessColl || $scope.beData.CustomAccessColl.length == 0) {
                        $scope.beData.CustomAccessColl = [];
                        $scope.beData.CustomAccessColl.push({});
                    }
                    //end
                    $('#custom-tabs-four-profile-tab').tab('show');
                });
            } else
                Swal.fire(res.data.ResponseMSG);
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    }

    $scope.DeleteCustomAccess = function (refData, ind) {
        Swal.fire({
            title: 'Are you sure to delete ?',
            showCancelButton: true,
            confirmButtonText: 'Delete',
        }).then((result) => {
            if (result.isConfirmed) {
                $scope.loadingstatus = "running";
                showPleaseWait();
                var para = {
                    ModuleId: refData.ModuleId,
                    EntityIds: refData.EntityIds,
                };
                $http({
                    method: 'POST',
                    url: base_url + "Setup/Security/DelCustomAccess",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingstatus = "stop";
                    Swal.fire(res.data.ResponseMSG);
                    if (res.data.IsSuccess) {
                        $scope.GetAllCustomAccess();
                    }
                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }
        });
    }

    //for child table
    $scope.AddPHDDetails = function (ind) {
        if ($scope.beData.CustomAccessColl) {
            if ($scope.beData.CustomAccessColl.length > ind + 1) {
                $scope.beData.CustomAccessColl.splice(ind + 1, 0, {
                    ReferenceRangeColl: [],
                    IsNew: true
                })
            } else {
                $scope.beData.CustomAccessColl.push({
                    ReferenceRangeColl: [],
                    IsNew: true
                })
            }
        }
    };
    $scope.delPHDDetails = function (ind) {
        if ($scope.beData.CustomAccessColl) {
            if ($scope.beData.CustomAccessColl.length > 1) {
                $scope.beData.CustomAccessColl.splice(ind, 1);
            }
        }
    };


    $scope.GetEntityList = function () {
        $scope.EntityList = [];
        $scope.AllEntityList = [];
        if ($scope.beData.ModuleId == null) return;
        var para = {
            ModuleId: $scope.beData.ModuleId,
            EntityType: null
        };

        $http({
            method: 'POST',
            url: base_url + "Setup/Security/GetEntityForProperties",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.AllEntityList = res.data.Data;
                const usedEntityIds = $scope.CustomAccessList
                    .filter(ca => ca.ModuleId === $scope.beData.ModuleId)
                    .map(ca => ca.EntityIds);
                $scope.EntityList = $scope.AllEntityList.filter(e =>
                    usedEntityIds.indexOf(e.EntityId) === -1 ||
                    ($scope.isEditMode && e.EntityId === $scope.beData.EntityIds)
                );
            }

        }, function (reason) {
            Swal.fire('Failed ' + reason);
        });
    };


    $scope.ChangeModule = function () {
        if (!$scope.beData.ModuleId) return;

        $scope.beData.EntityIds = null;
        $scope.GetEntityList();
    };
});