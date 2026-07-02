app.controller("AssetOpeningController", function ($scope, $http, $timeout, $filter, $compile, GlobalServices, $document) {
    $scope.Title = 'AssetOpening';

    $scope.LoadData = function () {
        $('.select2').select2();

        $scope.perPageColl = GlobalServices.getPerPageList();

        $scope.currentPages = {
            AssetOpening: 1,
        };

        $scope.searchData = {
            AssetOpening: '',
        };

        $scope.HideShow = {
            VoucherType: false,
            CostClass: false
        }

        $scope.perPage = {
            AssetOpening: GlobalServices.getPerPageRow(),
        };

        $scope.GenConfig = {};
        GlobalServices.getGenConfig().then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.GenConfig.DateFormat = res.data.Data.DateFormat;
                $scope.reloadVoucherDate();
            }
        }, function (reason) {
            alert('Failed' + reason);
            $scope.reloadVoucherDate();
        });
        $scope.confirmMSG = GlobalServices.getConfirmMSG();

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
                        $scope.det = {}
                        $timeout(function () {
                            $scope.$apply(function () {
                                if ($scope.VoucherTypeColl.length > 0) {
                                    $scope.SelectedVoucher = $scope.VoucherTypeColl[0];
                                    $scope.det.VoucherId = $scope.SelectedVoucher.VoucherId;
                                //    $scope.det.BranchId = $scope.SelectedVoucher.BDId;
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

        $scope.newDet = {
            OpeningNo: null,
            BranchId: null,
            FYearId:null,
            VoucherDate_TMP: new Date(),
            Remark: '',
            AssetOpeningDetailsColl: [],
            DocumentColl: [],
            AttechFiles: [],
            Mode: "Save"
        }
        $scope.newDet.AssetOpeningDetailsColl.push({});
        $scope.GetAllAssetOpening();

        $scope.BranchList = [];
        $http({
            method: 'POST',
            url: base_url + "Setup/Security/GetAllBranchList",
            dataType: "json"
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.BranchList = res.data.Data;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        $scope.CostClassColl = [];
        $timeout(function () {
            $http({
                method: "GET",
                url: base_url + "Account/Creation/GetCostClassForEntry",
                dataType: "json"
            }).then(function (res) {
                $scope.CostClassColl = res.data.Data;
            }, function (errormessage) {
                alert('Unable to Delete data. pls try again.' + errormessage.responseText);
            });
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
    }



    $scope.ClearFields = function () {
        $scope.newDet = {
            OpeningNo: null,
            BranchId: null,
            FYearId: null,
            CostClassId: $scope.SelectedCostClass.CostClassId,
            VoucherDate_TMP: new Date(),
            Remark: '',
            AssetOpeningDetailsColl: [],
            DocumentColl: [],
            AttechFiles: [],
            Mode: "Save"
        }
        $scope.newDet.AssetOpeningDetailsColl.push({});
    }


 
    $scope.GetAllAssetOpening = function () {
        $scope.loadingstatus = 'running';
        showPleaseWait();
        $http({
            method: 'POST',
            url: base_url + "AssetsManagement/Creation/GetAllAssetOpening",
            dataType: "json"
        }).then(function (res) {
            $scope.loadingstatus = 'stop';
            hidePleaseWait();
            if (res.data.IsSuccess && res.data.Data) {
                $scope.AssetOpeningList = res.data.Data;
            } else
                Swal.fire(res.data.ResponseMSG);
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    }



    $scope.IsValidAssetOpening = function () {
        var filledRows = $scope.newDet.AssetOpeningDetailsColl.filter(function (row) {
            return row.ParticularId && row.ParticularId !== 0;
        });
        if (filledRows.length === 0) {
            Swal.fire("Warning", "Please add at least one Asset Opening detail.", "warning");
            return false;
        }
        for (var i = 0; i < filledRows.length; i++) {
            var p = filledRows[i];
            var row = i + 1;
            if (p.Qty < 0) {
                Swal.fire("Warning", "Please enter QTY at row " + row, "warning");
                return false;
            }
        }
        return true;
    };



    $scope.SaveUpdateAssetOpening = function () {
        if ($scope.IsValidAssetOpening() == true) {
            if ($scope.confirmMSG.Accept == true) {
                var saveModify = $scope.newDet.Mode;
                Swal.fire({
                    title: 'Do you want to' + saveModify + 'the current data?',
                    showCancelButton: true,
                    confirmButtonText: saveModify,
                }).then((result) => {
                    if (result.isConfirmed) {
                        $scope.CallSaveUpdateAssetOpening();
                    }
                });
            }
            else
                $scope.CallSaveUpdateAssetOpening();
        }
    };


    $scope.CallSaveUpdateAssetOpening = function () {
        $scope.loadingstatus = 'running';
        showPleaseWait();
        $scope.newDet.VoucherId = $scope.det.VoucherId;
        //$scope.newDet.BranchId = $scope.det.BranchId;
        //$scope.newDet.CostClassId = $scope.det.CostClassId;

        if ($scope.newDet.VoucherDateDet) {
            $scope.newDet.VoucherDate = $filter('date')(new Date($scope.newDet.VoucherDateDet.dateAD), 'yyyy-MM-dd');
        }

        $scope.newDet.AssetOpeningDetailsColl =
            $scope.newDet.AssetOpeningDetailsColl.filter(function (row) {
                return row.ParticularId != null;
            });

        var filesColl = $scope.newDet.AttechFiles;
        $scope.newDet.AttechFiles = [];

        $http({
            method: 'POST',
            url: base_url + "AssetsManagement/Creation/SaveAssetOpening",
            headers: { 'content-Type': undefined },
            transformRequest: function (data) {
                var formData = new FormData();
                formData.append("jsonData", angular.toJson(data.jsonData));
                var find = 0;
                angular.forEach($scope.newDet.DocumentColl, function (dc) {
                    if (dc.File) {
                        formData.append("file" + find, dc.File);
                    }
                    find++;
                });
                return formData;
            },
            /* data: { jsonData: $scope.newDet }*/
            data: { jsonData: $scope.newDet, files: filesColl }
        }).then(function (res) {

            $scope.loadingstatus = "stop";
            hidePleaseWait();
            Swal.fire(res.data.ResponseMSG);
            if (res.data.IsSuccess == true) {
                $scope.ClearFields();
                $scope.GetAllAssetOpening();
            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
        });
    }

    $scope.GetAssetOpeningById = function (beData) {
        $scope.loadingstatus = "running";
        var para = {
            TranId: beData.TranId
        };
        $http({
            method: 'POST',
            url: base_url + "AssetsManagement/Creation/GetAssetOpeningById",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $timeout(function () {
                    $scope.newDet = res.data.Data;
                    $scope.newDet.Mode = 'Modify';
                    if ($scope.newDet.VoucherDate) {
                        $scope.newDet.VoucherDate_TMP = new Date($scope.newDet.VoucherDate);
                    }

                    if (!$scope.newDet.AssetOpeningDetailsColl || $scope.newDet.AssetOpeningDetailsColl.length == 0) {
                        $scope.newDet.AssetOpeningDetailsColl = [];
                        $scope.newDet.AssetOpeningDetailsColl.push({});
                    }
                    $('#custom-tabs-four-profile-tab').tab('show');
                });
            } else
                Swal.fire(res.data.ResponseMSG);
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    }


    $scope.DelAssetOpening = function (refData, ind) {
        Swal.fire({
            title: 'Are you sure to delete Asset Opening ?',
            showCancelButton: true,
            confirmButtonText: 'Delete',
        }).then((result) => {
            if (result.isConfirmed) {
                $scope.loadingstatus = "running";
                showPleaseWait();
                var para = {
                    TranId: refData.TranId
                };
                $http({
                    method: 'POST',
                    url: base_url + "AssetsManagement/Creation/DelAssetOpening",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingstatus = "stop";
                    Swal.fire(res.data.ResponseMSG);
                    if (res.data.IsSuccess) {
                        $scope.GetAllAssetOpening();
                    }
                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }
        });
    }


    $scope.Add = function (index) {
        if (!$scope.newDet.AssetOpeningDetailsColl[index].Qty &&
            !$scope.newDet.AssetOpeningDetailsColl[index].StatusId
        ) {
            Swal.fire({
                title: 'Warning!',
                text: 'Please fill the current row details before adding a new row.',
                icon: 'warning',
                confirmButtonText: 'OK',
                allowOutsideClick: false,
            });
            return;
        }


        if ($scope.newDet.AssetOpeningDetailsColl) {
            if ($scope.newDet.AssetOpeningDetailsColl.length > index + 1) {
                $scope.newDet.AssetOpeningDetailsColl.splice(index + 1, 0, {
                    ClassName: ''
                })
            }
            else {
                $scope.newDet.AssetOpeningDetailsColl.push({
                    ClassName: ''
                })
            }
        }
    }

    $scope.Delete = function (index) {
        if ($scope.newDet.AssetOpeningDetailsColl) {
            if ($scope.newDet.AssetOpeningDetailsColl.length > 1) {
                $scope.newDet.AssetOpeningDetailsColl.splice(index, 1);
            }
            else {
                $scope.newDet.AssetOpeningDetailsColl[0] = {}
            }
        }
    }



    $scope.onParticularChange = function (index, PDet) {
        var row = $scope.newDet.AssetOpeningDetailsColl[index];
        if (row && row.ParticularId) {
            var selected = $scope.ParticularList.find(function (p) {
                return p.TranId === row.ParticularId;
            });

            if (selected) {
                if (selected.PurchaseRate != null) {
                    row.Rate = selected.PurchaseRate;
                }
            }
          
        }
        $scope.GetAssetOpeningByBranch(PDet);
        if (index === $scope.newDet.AssetOpeningDetailsColl.length - 1) {
            $scope.newDet.AssetOpeningDetailsColl.push({
                ParticularId: null,
                Qty: null,
                Rate: null,
                Amt: null,
            });
        }
    };



    $scope.CalculateAmount = function (R) {
        var qty =parseFloat(R.Qty) || 0;
        if (qty < 0) {
            qty = Math.abs(qty);
        }
        var rate =Math.abs( parseFloat(R.Rate) || 0);
        R.Amt = (qty * rate);
    }


    $scope.CalculateRate = function (R) {
        var Amount =Math.abs( parseFloat(R.Amt) || 0);
        var Qty =Math.abs( parseFloat(R.Qty) || 0);
        R.Rate = (Amount / Qty);
    }

    $scope.reloadVoucherDate = function () {
        const container = angular.element(document.getElementById('dvDTVoucher'));
        container.empty(); 

        const dateFormat = $scope.GenConfig.DateFormat || 2;
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
                    'ng-model="newDet.VoucherDate_TMP" date-detail="newDet.VoucherDateDet" ' +
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
            const dateFormat = $scope.GenConfig && $scope.GenConfig.DateFormat ? $scope.GenConfig.DateFormat : 1;

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

    $scope.getTotalQty = function () {
        var total = 0;
        angular.forEach($scope.newDet.AssetOpeningDetailsColl, function (item) {
            total += Number(item.Qty || 0);
        });
        return total;
    };

    $scope.getTotalAmount = function () {
        var total = 0;
        angular.forEach($scope.newDet.AssetOpeningDetailsColl, function (item) {
            total += Number(item.Amt || 0);
        });
        return total;
    };


    $scope.GetAssetOpeningByBranch = function (R) {
        $scope.loadingstatus = "running";
        var TranId = R.ParticularId;
        var BranchId = $scope.newDet.BranchId;
        if (!$scope.ValidateBranch(BranchId)) {
            return; 
        }
        if (!$scope.ValidateParticular(TranId)) {
            return;
        }
        showPleaseWait();
        var para = { TranId: TranId, BranchId: BranchId};
        $http({
            method: 'POST',
            url: base_url + "AssetsManagement/Creation/GetAssetOpeningByBranch",
            data: JSON.stringify(para)
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                if (res.data.Data.Rate) {
                    R.Qty = res.data.Data.QTY;
                    R.Amt = res.data.Data.Amt;
                    R.Rate = res.data.Data.Rate;
                } else {
                    $scope.onParticularChange(R);
                }

            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed ' + reason);
        });
    };

    $scope.ValidateBranch = function (BranchId) {
        if (!BranchId || BranchId === 0) {
            Swal.fire("Please select a Branch!");
            return false;
        }
        return true;
    };


    $scope.ValidateParticular = function (TranId) {
        if (!TranId || TranId === 0) {
            return false;
        }
        return true;
    };


    $scope.getFilteredParticularList = function (currentIndex) {
        return $scope.ParticularList.filter(function (item) {
            return !$scope.newDet.AssetOpeningDetailsColl.some(function (row, index) {
                return index !== currentIndex &&
                    row.ParticularId === item.TranId;
            });
        });
    };

})