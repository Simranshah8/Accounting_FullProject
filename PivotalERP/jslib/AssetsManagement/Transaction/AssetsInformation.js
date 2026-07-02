app.controller("AssetsInformationController", function ($scope, $filter, $compile,$http, $timeout, GlobalServices) {
    $scope.Title = 'AssetsInformation';
    $scope.LoadData = function () {
        $('.select2').select2();
        var glSrv = GlobalServices;

        $scope.perPageColl = GlobalServices.getPerPageList();
        $scope.confirmMSG = GlobalServices.getConfirmMSG();
        $scope.EmployeeSearchOptions = GlobalServices.getEmployeeSearchOptions();

        $scope.currentPages = {
            AssetsInformation: 1,
        };

        $scope.searchData = {
            AssetsInformation: '',
        };

        $scope.perPage = {
            AssetsInformation: GlobalServices.getPerPageRow(),
        };

        $scope.AssetsColl = [
            { id: 1, name: "New" },
            { id: 2, name: "Follow-Up" },
            { id: 3, name: "Review" },
            { id: 4, name: "Teleconsult" }
        ]

        $scope.newDet = {
            CostClassId: null,
            VoucherDate: null,
            SelectEmployee: 'E.Name',
            IsEmployeeNeeded: false,
            UserId: null,
            DepartmentId: null,
            BranchId: null,
            AssetsNameId: null,
            IsChildNeeded: false,
            AssetMaintenanceDetailsColl: [],  //for child table
            Mode: "Save"
        }


        $scope.GenConfig = {};
        glSrv.getGenConfig().then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.GenConfig.DateStyle = res.data.Data.DateStyle;
                // NOW call reloadVoucherDate after GenConfig is loaded
                $scope.reloadVoucherDate();
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
            // Keep the default DateFormat (1) and call reloadVoucherDate
            $scope.reloadVoucherDate();
        });


        $scope.DefaultBranch = null;
        var filterObjs_VoucherId = {};
        filterObjs_VoucherId['BDId'] = 1;

        var vt_Para = {
            voucherType: VoucherType,
            filterPara: filterObjs_VoucherId,
        };

        $http({
            method: 'POST',
            url: base_url + "Account/Creation/GetVoucherList",
            dataType: "json",
            data: JSON.stringify(vt_Para)
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.VoucherTypeColl = res.data.Data;

                $http({
                    method: 'GET',
                    url: base_url + "Account/Creation/GetCostClassForEntry",
                    dataType: "json"
                }).then(function (res1) {
                    if (res1.data.IsSuccess && res1.data.Data) {
                        $scope.CostClassColl = res1.data.Data;

                        $timeout(function () {
                            $scope.$apply(function () {
                                if ($scope.VoucherTypeColl.length > 0) {
                                    $scope.SelectedVoucher = $scope.VoucherTypeColl[0];
                                    $scope.newDet.VoucherId = $scope.SelectedVoucher.VoucherId;
                                    $scope.newDet.BranchId = $scope.SelectedVoucher.BDId;
                                }

                                if ($scope.CostClassColl.length > 0) {
                                    $scope.SelectedCostClass = $scope.CostClassColl[0];
                                    $scope.newDet.CostClassId = $scope.SelectedCostClass.CostClassId;
                                }

                                if ($scope.VoucherTypeColl.length <= 1)
                                    $scope.HideShow.VoucherType = true;
                                else
                                    $scope.HideShow.VoucherType = false;

                                if ($scope.CostClassColl.length <= 1)
                                    $scope.HideShow.CostClass = true;
                                else
                                    $scope.HideShow.CostClass = false;

                                $scope.getVoucherNo();

                            });
                        });


                    }
                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });

            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });


        $scope.ParticularList = [];
        $http({
            method: 'POST',
            url: base_url + "AssetsManagement/Creation/GetAllAssetsmaster",
            dataType: "json",
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                //$scope.ParticularList = res.data.Data;
                $scope.ParticularList = res.data.Data.filter(function (item) {
                    return item.StatusId === 1;
                });

            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            Swal.fire('Failed: ' + reason);
        });


        $scope.GetAllAssetsMaintenance();
    }

    $scope.confirmAction = function (beData) {
        $scope.newDet.BranchName = beData.EmployeeDetails.BranchName;
        $scope.newDet.Department = beData.EmployeeDetails.Department;
        $scope.GetAssetsByEmp($scope.newDet);
    }

    $scope.ClearFields = function () {
        $scope.newDet = {
            SelectEmployee: $scope.EmployeeSearchOptions[0].value,
            BranchId: $scope.SelectedVoucher.BDId,
            VoucherId: $scope.SelectedVoucher.VoucherId,
            CostClassId: $scope.SelectedCostClass.CostClassId,
            VoucherDate_TMP: new Date(),
            IsEmployeeNeeded: false,
            UserId: null,
            DepartmentId: null,
            BranchId: null,
            AssetsNameId: null,
            IsChildNeeded: false,
            AssetMaintenanceDetailsColl: [],  //for child table

            Mode: "Save"
        }
        $scope.newDet.AssetMaintenanceDetailsColl.push({});
        $scope.GetAssetsByEmp($scope.newDet);
    }

    $scope.GetAssetsByEmp = function (newDet) {
        $scope.loadingstatus = "running";
        $scope.EmployeeAssetsList = [];
        if (newDet.IsEmployeeNeeded == false) {
            newDet.UserId = null;
            newDet.BranchName = '';
            newDet.Department = '';
        }
        var para = {
            UsersId: newDet.UserId,
            IsEmpNeed: newDet.IsEmployeeNeeded,
            BranchId: null
        };
        $http({
            method: 'POST',
            url: base_url + "AssetsManagement/Transaction/GetAssetsByEmp",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.EmployeeAssetsList = res.data.Data
            } else
                Swal.fire(res.data.ResponseMSG);

        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    }

    $scope.onParticularChange = function (index, R) {
        var row = $scope.newDet.AssetMaintenanceDetailsColl[index];
        if (row && row.ParticularsId) {
            var selected = $scope.ParticularList.find(function (p) {
                return p.TranId === row.ParticularsId;
            });
            if (selected) {
                $scope.getAssetClosingStock(R);
            }
        }
        if (index === $scope.newDet.AssetMaintenanceDetailsColl.length - 1) {
            $scope.newDet.AssetMaintenanceDetailsColl.push({
                ParticularsId: null,
                Qty: 0,
                Remarks: '',
            });
        }
    };

    $scope.getAssetClosingStock = function (R) {
        $scope.loadingstatus = "running";
        var TranId = R.ParticularsId;
        showPleaseWait();
        var para = {
            TranId: TranId,
            BranchId: $scope.newDet.BranchId,
            voucherDate: $scope.newDet.VoucherDateDet ? ($filter('date')(new Date($scope.newDet.VoucherDateDet.dateAD), 'yyyy-MM-dd')) : ($filter('date')(new Date(), 'yyyy-MM-dd'))
        };
        $http({
            method: 'POST',
            url: base_url + "AssetsManagement/Creation/getAssetClosingStock",
            data: JSON.stringify(para)
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                R.ClosingStock = res.data.Data.ClosingStock;
                if (R.ClosingStock < 1) {
                    R.ClosingStock = 0;
                    R.ParticularsId = null;
                    Swal.fire('No more Closing Stock');
                }
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed ' + reason);
        });
    };

    //for child table
    $scope.AddPHDDetails = function (ind) {
        if ($scope.newDet.AssetMaintenanceDetailsColl) {
            if ($scope.newDet.AssetMaintenanceDetailsColl.length > ind + 1) {
                $scope.newDet.AssetMaintenanceDetailsColl.splice(ind + 1, 0, {
                    ClassName: ''
                })
            } else {
                $scope.newDet.AssetMaintenanceDetailsColl.push({
                    ClassName: ''
                })
            }
        }
    };
    //for child table
    $scope.delPHDDetails = function (ind) {
        if ($scope.newDet.AssetMaintenanceDetailsColl) {
            if ($scope.newDet.AssetMaintenanceDetailsColl.length > 1) {
                $scope.newDet.AssetMaintenanceDetailsColl.splice(ind, 1);
            }
        }
    };

    $scope.reloadVoucherDate = function () {
        const container = angular.element(document.getElementById('dvDTVoucher'));
        container.empty(); // Clear the container

        const dateFormat = $scope.GenConfig.DateStyle || 2;
        if ($scope.newDet.VoucherDateDet && $scope.newDet.VoucherDateDet.dateAD) {

            $scope.newDet.VoucherDate_TMP = new Date($scope.newDet.VoucherDateDet.dateAD);
        } else if ($scope.newDet.VoucherDate) {
            $scope.newDet.VoucherDate_TMP = new Date($scope.newDet.VoucherDate);
        } else {
            $scope.newDet.VoucherDate_TMP = new Date();
        }

        $timeout(function () {
            let dtPicker = '';

            if (dateFormat == 2) { // BS only
                dtPicker =
                    '<input type="text" class="form-control form-control-sm" date-picker ' +
                    'ng-model="newDet.VoucherDate_TMP" date-detail="newDet.VoucherDateDet" ' +
                    'confirm-action="getVoucherNoOnly(2)" ' +
                    'title="{{newDet.VoucherDateDet.dateAD | dateFormat}}" ' +
                    'date-style="2" id="dtVoucherDateBS">';
            } else if (dateFormat == 1) { // AD only
                dtPicker =
                    '<input type="text" class="form-control form-control-sm" date-picker ' +
                    'ng-model="newDet.VoucherDate_TMP" date-detail="newDet.VoucherDateDet" ' +
                    'confirm-action="getVoucherNoOnly(1)" ' +
                    'title="{{newDet.VoucherDateDet.dateBS}}" ' +
                    'date-style="1" id="dtVoucherDateAD">';
            } else if (dateFormat == 3) { // BS & AD (BS first)
                dtPicker = `
                <div class="d-inline-block">
                    <div class="input-group input-group-sm">
                        <div class="input-group-prepend">
                            <span class="input-group-text">BS:</span>
                        </div>
                        <input type="text" class="form-control form-control-sm" date-picker
                               ng-model="newDet.VoucherDate_TMP"
                               date-detail="newDet.VoucherDateDet" 
                               confirm-action="getVoucherNoOnly(2)"
                               title="{{newDet.VoucherDateDet.dateAD | dateFormat}}"
                               date-style="2" id="dtVoucherDateBS">
                        <div class="input-group-prepend">
                            <span class="input-group-text">AD:</span>
                        </div>
                        <input type="text" class="form-control form-control-sm" date-picker
                               ng-model="newDet.VoucherDateAD_TMP"
                               date-detail="newDet.VoucherDateADDet" 
                               confirm-action="getVoucherNoOnly(1)"
                               title="{{newDet.VoucherDateADDet.dateBS}}"
                               date-style="1" id="dtVoucherDateAD">
                    </div>
                </div>`;
            } else if (dateFormat == 4) { // AD & BS (AD first)
                dtPicker = `
                <div class="d-inline-block">
                    <div class="input-group input-group-sm">
                        <div class="input-group-prepend">
                            <span class="input-group-text">AD:</span>
                        </div>
                        <input type="text" class="form-control form-control-sm" date-picker
                               ng-model="newDet.VoucherDateAD_TMP"
                               date-detail="newDet.VoucherDateADDet" 
                               confirm-action="getVoucherNoOnly(1)"
                               title="{{newDet.VoucherDateADDet.dateBS}}"
                               date-style="1" id="dtVoucherDateAD">
                        <div class="input-group-prepend">
                            <span class="input-group-text">BS:</span>
                        </div>
                        <input type="text" class="form-control form-control-sm" date-picker
                               ng-model="newDet.VoucherDate_TMP"
                               date-detail="newDet.VoucherDateDet"
                               confirm-action="getVoucherNoOnly(2)"
                               title="{{newDet.VoucherDateDet.dateAD | dateFormat}}"
                               date-style="2" id="dtVoucherDateBS">
                    </div>
                </div>`;
            } else {
                // Fallback to AD format if dateFormat has unexpected value
                dtPicker =
                    '<input type="text" class="form-control form-control-sm" date-picker ' +
                    'ng-model="newDet.VoucherDate_TMP" date-detail="newDet.VoucherDateDet" disabled' +
                    'confirm-action="getVoucherNoOnly(1)" ' +
                    'title="{{newDet.VoucherDateDet.dateBS}}" ' +
                    'date-style="1" id="dtVoucherDateAD">';
            }

            const newElement = angular.element(dtPicker);
            container.append(newElement);
            $compile(newElement)($scope);
        });
    };

    $scope.getVoucherNoOnly = function (dateStyle) {
        $timeout(function () {
            const dateFormat = $scope.GenConfig && $scope.GenConfig.DateStyle ? $scope.GenConfig.DateStyle : 1;

            if (dateFormat == 3 || dateFormat == 4) {
                if (dateStyle == 1) {
                    if ($scope.newDet.VoucherDateADDet && $scope.newDet.VoucherDateADDet.dateAD) {
                        if (!$scope.newDet.VoucherDate_TMP ||
                            $scope.newDet.VoucherDateADDet.dateAD != $scope.newDet.VoucherDate_TMP) {
                            $scope.newDet.VoucherDate_TMP = new Date($scope.newDet.VoucherDateADDet.dateAD);
                        }
                    }
                } else if (dateStyle == 2) {
                    if ($scope.newDet.VoucherDateDet && $scope.newDet.VoucherDateDet.dateAD) {
                        if (!$scope.newDet.VoucherDateAD_TMP ||
                            $scope.newDet.VoucherDateAD_TMP != $scope.newDet.VoucherDateDet.dateAD) {
                            $scope.newDet.VoucherDateAD_TMP = new Date($scope.newDet.VoucherDateDet.dateAD);
                        }
                    }
                }
            }
        });
    };

    $scope.IsValidAssetsMaintenance = function () {

        return true;
    };

    $scope.SaveUpdateAssetsMaintenance = function () {
        if ($scope.IsValidAssetsMaintenance() == true) {
            if ($scope.confirmMSG.Accept == true) {
                var saveModify = $scope.newDet.Mode;
                Swal.fire({
                    title: 'Do you want to ' + saveModify + ' the current data?',
                    showCancelButton: true,
                    confirmButtonText: saveModify,
                }).then((result) => {
                    if (result.isConfirmed) {
                        $scope.CallSaveUpdateAssetsMaintenance();
                    }
                });
            } else
                $scope.CallSaveUpdateAssetsMaintenance();
        }
    };

    $scope.CallSaveUpdateAssetsMaintenance = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();
        if ($scope.newDet.VoucherDateDet) {
            $scope.newDet.VoucherDate = $filter('date')(new Date($scope.newDet.VoucherDateDet.dateAD), 'yyyy-MM-dd');
        } else
            $scope.newDet.VoucherDate = new Date();

        $scope.newDet.AssetMaintenanceDetailsColl =
            $scope.newDet.AssetMaintenanceDetailsColl.filter(function (row) {
                return row.ParticularsId != null;
            });
        $http({
            method: 'Post',
            url: base_url + "AssetsManagement/Transaction/SaveAssetsMaintenance",
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
                $scope.GetAllAssetsMaintenance();
                $scope.ClearFields();
            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";

        });
    }

    $scope.GetAllAssetsMaintenance = function () {
        $scope.TableData = [];
        $scope.loadingstatus = "running";
        showPleaseWait();
        $http({
            method: 'POST',
            url: base_url + "AssetsManagement/Transaction/GetAllAssetsMaintenance",
            dataType: "json",
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.AssetsInformationList = res.data.Data;
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            Swal.fire('Failed: ' + reason);
        });
    }

    $scope.GetAssetsMaintenanceById = function (refData) {
        $scope.loadingstatus = "running";
        showPleaseWait();
        var para = {
            TranId: refData.TranId
        };
        $http({
            method: 'POST',
            url: base_url + "AssetsManagement/Transaction/GetAssetsMaintenanceById",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.newDet = res.data.Data;
                $scope.newDet.Mode = 'Modify';
                $scope.newDet.SelectEmployee = 'E.Name';

                if ($scope.newDet.VoucherDate) {
                    $scope.newDet.VoucherDate_TMP = new Date($scope.newDet.VoucherDate);
                }
                if (!$scope.newDet.AssetMaintenanceDetailsColl || $scope.newDet.AssetMaintenanceDetailsColl.length == 0) {
                    $scope.newDet.AssetMaintenanceDetailsColl = [];
                    $scope.newDet.AssetMaintenanceDetailsColl.push({});
                }
                $scope.GetAssetsByEmp($scope.newDet);
                $('#custom-tabs-four-profile-tab').tab('show');

            } else {
                Swal.fire(res.data.ResponseMSG);
            }

        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

    };

    $scope.DelAssetsMaintenanceById = function (refData, ind) {
        Swal.fire({
            title: 'Are you sure you want to delete ?',
            showCancelButton: true,
            confirmButtonText: 'Delete',
        }).then((result) => {
            if (result.isConfirmed) {
                var para = { TranId: refData.TranId };
                $http({
                    method: 'POST',
                    url: base_url + "AssetsManagement/Transaction/DelAssetsMaintenance",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingStatus = "stop";

                    Swal.fire(res.data.ResponseMSG);
                    if (res.data.IsSuccess == true) {
                        $scope.GetAllAssetsMaintenance();
                        $scope.getVoucherNo();
                    }
                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }

        });

    }


})