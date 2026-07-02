app.controller("RepairedInwardController", function ($scope, $filter, $http, $timeout, $compile, GlobalServices) {
    $scope.Title = 'Repaired Inward';

    $scope.LoadData = function () {
        $('.select2').select2();

        $scope.perPageColl = GlobalServices.getPerPageList();
        $scope.confirmMSG = GlobalServices.getConfirmMSG();


        $scope.currentPages = {
            RepairedInward: 1,
        };

        $scope.searchData = {
            RepairedInward: '',
            RepairedInwardDetails: '',
        };

        $scope.perPage = {
            RepairedInward: GlobalServices.getPerPageRow(),
        };

        $scope.StatusColl = [
            { id: 1, text: "Damaged / Sent For Repair" },
            { id: 2, text: "Repaired (Done)" }
        ]

        $scope.ParticularList = [];
        $http({
            method: 'POST',
            url: base_url + "AssetsManagement/Creation/GetAllAssetsmaster",
            dataType: "json"
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.ParticularList = res.data.Data.filter(function (item) {
                    return item.StatusId === 1;
                });
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        $scope.newDet = {
            TranId: null,
            VoucherId: null,
            BranchId: null,
            CostClassId: null,
            VoucherDate_TMP: new Date(),
            VoucherDateAD_TMP: new Date(),
            RepairedNo: null,
            RefNo: null,
            VendorId: null,
            OutsideLocation: '',
            Remark: '',
            RepairedInwardDetailsColl: [],
            DocumentColl: [],
            AttechFiles: [],
            Mode: "Save"
        }
        $scope.GetAllRepairedInward();

        $scope.HideShow = {
            VoucherType: false,
            CostClass: false
        }

        $scope.GenConfig = {};
        GlobalServices.getGenConfig().then(function (res) {
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

                                $scope.GetAutoRepairedNo();
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


    }
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

    $scope.ClearFields = function () {
        $scope.newDet = {
            TranId: null,
            VoucherId: $scope.SelectedVoucher.VoucherId,
            BranchId: $scope.SelectedVoucher.BDId,
            CostClassId: $scope.SelectedCostClass.CostClassId,
            VoucherDate_TMP: new Date(),
            VoucherDateAD_TMP: new Date(),
            RepairedNo: null,
            RefNo: null,
            VendorId: null,
            OutsideLocation: '',
            Remark: '',
            RepairedInwardDetailsColl: [],
            DocumentColl: [],
            AttechFiles: [],
            Mode: "Save"
        }
        $scope.GetAutoRepairedNo();
    }

    $scope.ChangeStatus = function (PDet) {
        if (PDet.StatusId == 1) {
            PDet.RequiredInDate_TMP = '';
            PDet.Amount = 0;
        }
    };

    $scope.IsValidRepairedInward = function () {

        return true;
    };

    $scope.SaveUpdateRepairedInward = function () {
        if ($scope.IsValidRepairedInward() == true) {
            if ($scope.confirmMSG.Accept == true) {
                var saveModify = $scope.newDet.Mode;
                Swal.fire({
                    title: 'Do you want to' + saveModify + 'the current data?',
                    showCancelButton: true,
                    confirmButtonText: saveModify,
                }).then((result) => {
                    if (result.isConfirmed) {
                        $scope.CallSaveUpdateRepairedInward();
                    }
                });
            }
            else
                $scope.CallSaveUpdateRepairedInward();
        }
    };

    $scope.CallSaveUpdateRepairedInward = function () {
        $scope.loadingstatus = 'running';
        showPleaseWait();
        if ($scope.newDet.VoucherDateDet) {
            $scope.newDet.VoucherDate = $filter('date')(new Date($scope.newDet.VoucherDateDet.dateAD), 'yyyy-MM-dd');
        }
        if ($scope.newDet.RepairedInwardDetailsColl) {
            $scope.newDet.RepairedInwardDetailsColl.forEach((S) => {
                if (S.RequiredInDateDet)
                    S.RequiredInDate = $filter('date')(new Date(S.RequiredInDateDet.dateAD), 'yyyy-MM-dd');
                if (S.StatusId != 2) {
                    S.RequiredInDate = null;
                    S.Amount = null;
                }
            });
        }

        $scope.newDet.RepairedInwardDetailsColl =
            $scope.newDet.RepairedInwardDetailsColl.filter(function (row) {
                return row.ParticularId != null;
            });

        var filesColl = $scope.newDet.AttechFiles;
        $scope.newDet.AttechFiles = [];

        $http({
            method: 'POST',
            url: base_url + "AssetsManagement/Creation/SaveRepairedInward",
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
            data: { jsonData: $scope.newDet, files: filesColl }
        }).then(function (res) {

            $scope.loadingstatus = "stop";
            hidePleaseWait();
            Swal.fire(res.data.ResponseMSG);
            if (res.data.IsSuccess == true) {
                $scope.ClearFields();
                $scope.GetAllRepairedInward();
                $scope.GetAutoRepairedNo();
            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
        });
    }

    $scope.GetAllRepairedInward = function () {
        $scope.loadingstatus = 'running';
        showPleaseWait();
        $scope.RepairedInwardList = [];
        $http({
            method: 'POST',
            url: base_url + "AssetsManagement/Creation/GetAllRepairedInward",
            dataType: "json"
        }).then(function (res) {

            $scope.loadingstatus = 'stop';
            hidePleaseWait();

            if (res.data.IsSuccess && res.data.Data) {
                $scope.RepairedInwardList = res.data.Data;
            } else
                Swal.fire(res.data.ResponseMSG);

        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    }

    $scope.GetRepairedInwardById = function (beData) {
        $scope.loadingstatus = "running";
        var para = {
            TranId: beData.TranId
        };
        $http({
            method: 'POST',
            url: base_url + "AssetsManagement/Creation/GetRepairedInwardById",
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
                    if (!$scope.newDet.RepairedInwardDetailsColl || $scope.newDet.RepairedInwardDetailsColl.length == 0) {
                        $scope.newDet.RepairedInwardDetailsColl = [];
                        $scope.newDet.RepairedInwardDetailsColl.push({});
                    }
                    if ($scope.newDet.RepairedInwardDetailsColl) {
                        $scope.newDet.RepairedInwardDetailsColl.forEach((S) => {
                            $scope.getAssetClosingStock(S).then(function (CS) {
                                S.ClosingStock = CS;
                            });
                            if (S.RequiredInDate)
                                S.RequiredInDate_TMP = new Date(S.RequiredInDate);
                        });
                    }
                    $('#custom-tabs-four-profile-tab').tab('show');
                });
            } else
                Swal.fire(res.data.ResponseMSG);
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    }

    $scope.DelRepairedInward = function (refData, ind) {
        Swal.fire({
            title: 'Are you sure to delete Damaged Asset?',
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
                    url: base_url + "AssetsManagement/Creation/DelRepairedInward",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingstatus = "stop";
                    Swal.fire(res.data.ResponseMSG);
                    if (res.data.IsSuccess) {
                        $scope.GetAllRepairedInward();
                    }
                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }
        });

    }

    $scope.AddMoreFiles = function (files, des) {
        if (files) {
            if (files != null) {
                angular.forEach(files, function (file) {
                    $scope.newDet.DocumentColl.push({
                        File: file,
                        Name: file.name,
                        Type: file.type,
                        Size: file.size,
                        Description: des,
                        Path: null
                    });
                })
                $scope.attachFile = null;
                $scope.docDescription = '';
                $('#flMoreFiles').val('');
            }
        }
    };

    $scope.delAttachmentFiles = function (ind) {
        if ($scope.newDet.DocumentColl) {
            if ($scope.newDet.DocumentColl.length > 0) {
                $scope.newDet.DocumentColl.splice(ind, 1);
            }
        }
    }


    $scope.Add = function (index) {
        if (!$scope.newDet.RepairedInwardDetailsColl[index].Qty &&
            !$scope.newDet.RepairedInwardDetailsColl[index].StatusId
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


        if ($scope.newDet.RepairedInwardDetailsColl) {
            if ($scope.newDet.RepairedInwardDetailsColl.length > index + 1) {
                $scope.newDet.RepairedInwardDetailsColl.splice(index + 1, 0, {
                    ClassName: ''
                })
            }
            else {
                $scope.newDet.RepairedInwardDetailsColl.push({
                    ClassName: ''
                })
            }
        }
    }

    $scope.Delete = function (index) {
        if ($scope.newDet.RepairedInwardDetailsColl) {
            if ($scope.newDet.RepairedInwardDetailsColl.length > 1) {
                $scope.newDet.RepairedInwardDetailsColl.splice(index, 1);
            }
            else {
                $scope.newDet.RepairedInwardDetailsColl[0] = {}
            }
        }
    }

    $scope.GetAutoRepairedNo = function () {
        if ($scope.newDet.VoucherId && $scope.newDet.VoucherId > 0) {
            if ($scope.newDet.CostClassId && $scope.newDet.CostClassId > 0) {
                var para = {
                    voucherId: $scope.newDet.VoucherId,
                    costClassId: $scope.newDet.CostClassId,
                    voucherDate: $scope.newDet.VoucherDateDet ? ($filter('date')(new Date($scope.newDet.VoucherDateDet.dateAD), 'yyyy-MM-dd')) : ($filter('date')(new Date(), 'yyyy-MM-dd'))
                };

                $http({
                    method: 'POST',
                    url: base_url + "Account/Creation/GetVoucherNo",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    if (res.data.IsSuccess && res.data.Data) {
                        var vDet = res.data.Data;
                        $scope.newDet.AutoManualNo = vDet.AutoManualNo;
                        $scope.newDet.AutoVoucherNo = vDet.AutoVoucherNo;

                    } else {
                        Swal.fire(res.data.ResponseMSG);
                    }
                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }
        } else {
            $scope.newDet.AutoManualNo = '';
            $scope.newDet.AutoVoucherNo = 0;
        }
    }

    $scope.onParticularChange = function (index) {
        if (index === $scope.newDet.RepairedInwardDetailsColl.length - 1) {
            $scope.newDet.RepairedInwardDetailsColl.push({
                ParticularId: null,
                Qty: null,
                StatusId: null
            });
        }
    };

    $scope.validateQty = function (item) {
        var qty = parseFloat(item.QTY);
        if (isNaN(qty) || qty < 0) {
            qty = 0;
        }
        if (qty < 0) {
            qty = Math.abs(qty);
        }
        if (item.ClosingStock !== undefined && qty > item.ClosingStock) {
            qty = item.ClosingStock;
            Swal.fire({ icon: 'warning', title: 'Invalid Quantity', text: 'Quantity cannot be greater than Closing Stock(' + item.ClosingStock + ')' });
        }

        item.QTY = Math.floor(qty);
    };

    $scope.isAllChecked = false;
    $scope.toggleAll = function () {
        angular.forEach($scope.RepairedInwardDetailsList, function (ri) {
            ri.IsSelected = $scope.isAllChecked;

            if (ri.IsSelected) {
                lstSelected = ri;
            }
        });
    };

    $scope.ShowRIDetailsModal = function () {
        $scope.newDet.RepairedInwardDetailsColl = [];
        $scope.RepairedInwardDetailsList = [];
        if ($scope.newDet.VendorId) {
            var para = {
                VendorId: $scope.newDet.VendorId,
            };
            $http({
                method: 'POST',
                url: base_url + "AssetsManagement/Reporting/GetPendingDamageDetails",
                dataType: "json",
                data: JSON.stringify(para)
            }).then(function (res) {
                if (res.data.IsSuccess && res.data.Data) {
                    //$scope.RepairedInwardDetailsList = res.data.Data.filter(x => x.StatusId == 2);
                    $scope.RepairedInwardDetailsList = res.data.Data;
                    if ($scope.RepairedInwardDetailsList.length > 0) {
                        $('#AssetDetails').modal('show');
                    } else {
                        Swal.fire({ icon: 'warning', title: 'Issue Not Found', text: 'Asset Damage Details does not exist.' });
                    }
                } else { Swal.fire(res.data.ResponseMSG); }
            }, function (reason) {
                Swal.fire('Failed' + reason);
            });
        }
    };

    $scope.LoadAssetIssueDetails = function () {
        if (!$scope.newDet.RepairedInwardDetailsColl) {
            $scope.newDet.RepairedInwardDetailsColl = [];
        }
        var selectedItems = $scope.RepairedInwardDetailsList.filter(function (item) {
            return item.IsSelected === true;
        });
        if (selectedItems.length === 0) {
            Swal.fire('No item selected!');
            return;
        }
        angular.forEach(selectedItems, function (item) {
            $scope.getAssetClosingStock(item).then(function (closingStock) {
                $scope.newDet.RepairedInwardDetailsColl.push({
                    ParticularId: item.ParticularId,
                    Particular: item.Particular,
                    QTY: item.Qty || 0,
                    ClosingStock: closingStock || 0,
                    DamageDetId: item.DamageDetId,
                });
            });
        });
        $('#AssetDetails').modal('hide');
    };

    $scope.getAssetClosingStock = function (R) {
        var TranId = R.ParticularId;
        showPleaseWait();
        var para = {
            TranId: TranId,
            BranchId: $scope.newDet.BranchId,
            voucherDate: $scope.newDet.VoucherDateDet ? ($filter('date')(new Date($scope.newDet.VoucherDateDet.dateAD), 'yyyy-MM-dd')) : ($filter('date')(new Date(), 'yyyy-MM-dd'))
        };
        return $http({
            method: 'POST',
            url: base_url + "AssetsManagement/Creation/getAssetClosingStock",
            data: JSON.stringify(para)
        }).then(function (res) {
            hidePleaseWait();
            if (res.data.IsSuccess && res.data.Data) {
                return res.data.Data.ClosingStock;
            } else {
                Swal.fire(res.data.ResponseMSG);
                return 0;
            }
        }, function (reason) {
            hidePleaseWait();
            Swal.fire('Failed ' + reason);
            return 0;
        });
    };



    $scope.GetRepairedInwardAttById = function (refData) {
        $scope.loadingstatus = "running";
        showPleaseWait();
        var para = {
            TranId: refData.TranId
        };
        $http({
            method: 'POST',
            url: base_url + "AssetsManagement/Creation/GetRepairedInwardById",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.DocView = res.data.Data;
                $('#Doc-View').modal('show');
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    };

    $scope.ShowDocPdf = function (item) {
        $scope.viewImg = {
            ContentPath: '',
            FileType: null
        };

        if (item.DocPath && item.DocPath.length > 0) {
            $scope.viewImg.ContentPath = item.DocPath;
            $scope.viewImg.FileType = 'pdf';  // Assuming DocPath is for PDFs
            document.getElementById('pdfViewer').src = item.DocPath;
            $('#DocView').modal('show');
        } else if (item.PhotoPath && item.PhotoPath.length > 0) {
            $scope.viewImg.ContentPath = item.PhotoPath;
            $scope.viewImg.FileType = 'image';  // Assuming PhotoPath is for images
            $('#DocView').modal('show');
        } else if (item.File) {
            var blob = new Blob([item.File], { type: item.File?.type });
            $scope.viewImg.ContentPath = URL.createObjectURL(blob);
            $scope.viewImg.FileType = item.File.type.startsWith('image/') ? 'image' : 'pdf';

            if ($scope.viewImg.FileType === 'pdf') {
                document.getElementById('pdfViewer').src = $scope.viewImg.ContentPath;
            }

            $('#DocView').modal('show');
        } else {
            Swal.fire('No Image Found');
        }
    };

    $scope.ShowPersonalImg = function (item) {
        $scope.viewImg1 = {
            ContentPath: '',
            FileType: null
        };
        if (item.DocPath && item.DocPath.length > 0) {
            $scope.viewImg1.ContentPath = item.DocPath;
            $scope.viewImg1.FileType = 'pdf';  // Assuming DocPath is for PDFs
            document.getElementById('pdfViewer1').src = item.DocPath;
            $('#PersonalImg').modal('show');
        } else if (item.PhotoPath && item.PhotoPath.length > 0) {
            $scope.viewImg1.ContentPath = item.PhotoPath;
            $scope.viewImg1.FileType = 'image';  // Assuming PhotoPath is for images
            $('#PersonalImg').modal('show');
        } else if (item.File) {
            var blob = new Blob([item.File], { type: item.File?.type });
            $scope.viewImg1.ContentPath = URL.createObjectURL(blob);
            $scope.viewImg1.FileType = item.File.type.startsWith('image/') ? 'image' : 'pdf';

            if ($scope.viewImg1.FileType === 'pdf') {
                document.getElementById('pdfViewer1').src = $scope.viewImg1.ContentPath;
            }

            $('#PersonalImg').modal('show');
        } else {
            Swal.fire('No Image Found');
        }
    };

})