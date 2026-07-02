app.controller("AssetsInward", function ($scope, $http, $timeout, $filter, $compile, GlobalServices, $document) {
    $scope.Title = 'AssetsInward';
    $scope.LoadData = function () {
        $('.select2').select2();
        var glSrv = GlobalServices;
        $scope.perPageColl = GlobalServices.getPerPageList();

        $scope.currentPages = {
            AssetsInward: 1,
        };

        $scope.searchData = {
            AssetsInward: '',
        };

        $scope.perPage = {
            AssetsInward: GlobalServices.getPerPageRow(),
        };
        $scope.confirmMSG = GlobalServices.getConfirmMSG();

        $scope.HideShow = {
            VoucherType: false,
            CostClass: false           
        }

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

        $scope.GenConfig = {};
        glSrv.getGenConfig().then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.GenConfig.DateStyle = res.data.Data.DateStyle;
                // NOW call reloadVoucherDate after GenConfig is loaded
                $scope.reloadVoucherDate();
            }
        }, function (reason) {
            alert('Failed' + reason);
            // Keep the default DateFormat (1) and call reloadVoucherDate
            $scope.reloadVoucherDate();
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




        $scope.StatusColl = [
            { id: 1, text: "New" },
            { id: 2, text: "Used" },
            { id: 3, text: "Refurbished" },
            { id: 4, text: "Repaired" },
        ]


        $scope.newDet = {
            TranId: null,
            InwardNo: null,
            InVoiceNo: null,
            VoucherDate_TMP: new Date(),
            VendorId: null,
            //BranchId: null,
            DocPath_Tmp: '',
            Remarks: '',
            AssetInwardDetailsColl: [],
            DocumentColl: [],
            AttechFiles: [],
            Mode: "Save"
        }
        $scope.newDet.AssetInwardDetailsColl.push({
            DateOfWarranty_TMP: new Date()
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
                        $scope.det = {}
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

                                $scope.GetAutoInWardNo();

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

        $scope.GetAllAssetInward();
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
        $scope.ClearPhoto();
        $scope.GetAutoInWardNo();
        $scope.newDet = {
            TranId: null,
            InwardNo: null,
            InVoiceNo: null,
            VoucherDate_TMP: new Date(),
            VendorId: null,
            VoucherId :$scope.SelectedVoucher.VoucherId,
            BranchId: $scope.SelectedVoucher.BDId,
            CostClassId: $scope.SelectedCostClass.CostClassId,
            DocPath_Tmp: '',
            Remarks: '',
            AssetInwardDetailsColl: [],
            DocumentColl: [],
            AttechFiles: [],
            Mode: "Save"
        }
        $scope.newDet.AssetInwardDetailsColl.push({
            DateOfWarranty_TMP: new Date()
        });
    }

    $scope.ChangeParticularLedger = function (de) {
        if (!de)
            return false;
        LedgerDetails = de.LedgerDetails;
        $scope.newDet.VendorId = LedgerDetails.LedgerId;
    }

    $scope.RemoveAttachment = function (fId, ind) {
        if (fId == 1) {
            $scope.newDet.DocumentColl.splice(ind, 1);
        }
        else if (fId == 2) {
            $scope.newDet.AttechFiles.splice(ind, 1);
        }
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



    $scope.IsValidAssetInWard = function () {
        if (!$scope.newDet.InVoiceNo) {
            Swal.fire("Please! Enter Invoice Number");
            return false;
        }

       

        var filledRows = $scope.newDet.AssetInwardDetailsColl.filter(function (row) {
            return row.ParticularId && row.ParticularId !== 0;
        });

        if (filledRows.length === 0) {
            Swal.fire("Warning", "Please add at least one asset inward detail.", "warning");
            return false;
        }

        for (var i = 0; i < filledRows.length; i++) {
            var p = filledRows[i];
            var row = i + 1;

            if (!p.ParticularId || p.ParticularId === 0) {
                Swal.fire("warning", "Please select Particular at row " + row, "warning");
                return false;
            }

            if (!p.Qty || p.Qty <= 0) {
                Swal.fire("warning", "Please Enter Quantity at row " + row, "warning");
                return false;
            }
            if (!p.Status || p.Status === 0) {
                Swal.fire("warning", "Please Enter Status at row " + row, "warning");
                return false;
            }
        }
        return true;
    };

    $scope.SaveUpdateAssetInWard = function () {
        if ($scope.IsValidAssetInWard() == true) {
            if ($scope.confirmMSG.Accept == true) {
                var saveModify = $scope.newDet.Mode;
                Swal.fire({
                    title: 'Do you want to ' + saveModify + ' the current data?',
                    showCancelButton: true,
                    confirmButtonText: saveModify,
                }).then((result) => {
                    if (result.isConfirmed) {
                        $scope.CallSaveUpdateAssetInWard();
                    }
                });
            } else
                $scope.CallSaveUpdateAssetInWard();

        }
    };

    $scope.CallSaveUpdateAssetInWard = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();
        var DoctAttach = $scope.newDet.PhotoPath_TMP;
        if ($scope.newDet.VoucherDateDet) {
            $scope.newDet.VoucherDate = $filter('date')(new Date($scope.newDet.VoucherDateDet.dateAD), 'yyyy-MM-dd');
        }

        if ($scope.newDet.DateOfWarrantyDet) {
            $scope.newDet.VoucherDate = $filter('date')(new Date($scope.newDet.DateOfWarrantyDet.dateAD), 'yyyy-MM-dd');

        }

        if ($scope.newDet.AssetInwardDetailsColl) {
            $scope.newDet.AssetInwardDetailsColl.forEach((S) => {

                if (S.DateOfWarrantyDet)
                    S.WarrantyDate = $filter('date')(new Date(S.DateOfWarrantyDet.dateAD), 'yyyy-MM-dd');

            });
        }
       

        $scope.newDet.AssetInwardDetailsColl =
            $scope.newDet.AssetInwardDetailsColl.filter(function (row) {
                return row.ParticularId != null;
            });

        var filesColl = $scope.newDet.AttechFiles;
        $scope.newDet.AttechFiles = [];
        //$scope.newDet.VoucherId;
        //$scope.newDet.BranchId;
        $http({
            method: 'POST',
            url: base_url + "AssetsManagement/Creation/SaveAssetInward",
            headers: { 'Content-Type': undefined },
            transformRequest: function (data) {
                var formData = new FormData();
                formData.append("jsonData", angular.toJson(data.jsonData));

                if (data.doctAttach && data.doctAttach.length > 0)
                    formData.append("DoctAttach", data.doctAttach[0]);

                //if (data.Img && data.Img.length > 0)
                //    formData.append("DoctAttach", data.Img[0]);
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
                $scope.GetAllAssetInward();
                $scope.ClearFields();
                $scope.GetAutoInwardNo();
            }
           

        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";

        });
    }

    $scope.ClearPhoto = function () {
        $timeout(function () {
            $scope.$apply(function () {
                $scope.newDet.PhotoPathData = null;
                $scope.newDet.PhotoPath_TMP = [];
            });
        });
        $('#Photo').attr('src', '');
    };

    $scope.GetAssetInwardById = function (refData) {
        $scope.loadingstatus = "running";
        showPleaseWait();
        var para = {
            TranId: refData.TranId
        };
        $http({
            method: 'POST',
            url: base_url + "AssetsManagement/Creation/GetAssetInwardById",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.newDet = res.data.Data;
                $scope.newDet.Mode = 'Modify';
                if ($scope.newDet.VoucherDate) {
                    $scope.newDet.VoucherDate_TMP = new Date($scope.newDet.VoucherDate);
                }
                //for child table
                if (!$scope.newDet.AssetInwardDetailsColl || $scope.newDet.AssetInwardDetailsColl.length == 0) {
                    $scope.newDet.AssetInwardDetailsColl = [];
                    $scope.newDet.AssetInwardDetailsColl.push({});
                }

                if ($scope.newDet.AssetInwardDetailsColl) {
                    $scope.newDet.AssetInwardDetailsColl.forEach((S) => {
                        if (S.WarrantyDate)
                            S.DateOfWarranty_TMP = new Date(S.WarrantyDate);
                        $scope.getAssetClosingStock(S);
                    });
                }
                $('#custom-tabs-four-profile-tab').tab('show');
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    };

    $scope.GetAllAssetInward = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();
        $http({
            method: 'POST',
            url: base_url + "AssetsManagement/Creation/GetAllAssetInward",
            dataType: "json",
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.AssetsInwardList = res.data.Data;
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            Swal.fire('Failed: ' + reason);
        });
    }

    $scope.DelAssetInward = function (refData, ind) {
        Swal.fire({
            title: 'Are you sure you want to delete  Asset Inward Number ' + refData.AutoManualNo + '?',
            showCancelButton: true,
            confirmButtonText: 'Delete',
        }).then((result) => {
            if (result.isConfirmed) {
                var para = { TranId: refData.TranId };
                $http({
                    method: 'POST',
                    url: base_url + "AssetsManagement/Creation/DelAssetInward",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingStatus = "stop";
                    Swal.fire(res.data.ResponseMSG);
                    if (res.data.IsSuccess == true) {
                        $scope.GetAllAssetInward();
                    }
                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }
        });
    }

    $scope.AddPHDDetails = function (ind) {
        if (!$scope.newDet.AssetInwardDetailsColl[ind].DateOfWarranty_TMP &&
            !$scope.newDet.AssetInwardDetailsColl[ind].QtyRate &&
            !$scope.newDet.AssetInwardDetailsColl[ind].QtyDisAmt &&
            !$scope.newDet.AssetInwardDetailsColl[ind].PRate &&
            !$scope.newDet.AssetInwardDetailsColl[ind].DisAmt &&
            !$scope.newDet.AssetInwardDetailsColl[ind].Amt &&
            !$scope.newDet.AssetInwardDetailsColl[ind].Status) {
            Swal.fire({
                title: 'Warning!',
                text: 'Please fill the current row details before adding a new row.',
                icon: 'warning',
                confirmButtonText: 'OK',
                allowOutsideClick: false,
            });

            return;
        }
        if ($scope.newDet.AssetInwardDetailsColl) {
            if ($scope.newDet.AssetInwardDetailsColl.length > ind + 1) {
                $scope.newDet.AssetInwardDetailsColl.splice(ind + 1, 0, {
                    SortOrder: 1
                })
            } else {
                $scope.newDet.AssetInwardDetailsColl.push({
                    SortOrder: 1
                })
            }
        }
    };

    //for child table
    $scope.delPHDDetails = function (ind) {
        if ($scope.newDet.AssetInwardDetailsColl) {
            if ($scope.newDet.AssetInwardDetailsColl.length > 1) {
                $scope.newDet.AssetInwardDetailsColl.splice(ind, 1);
            }
        }
    };

    $scope.GetAutoInWardNo = function () {
        //if ($scope.newDet.VoucherId || $scope.newDet.CostClassId) {
        //    $scope.det.VoucherId = $scope.newDet.VoucherId;
        //    $scope.det.CostClassId = $scope.newDet.CostClassId;
        //}
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

    $scope.onParticularChange = function (index, R) {
        var row = $scope.newDet.AssetInwardDetailsColl[index];
        if (row && row.ParticularId) {
            var selected = $scope.ParticularList.find(function (p) {
                return p.TranId === row.ParticularId;
            });

            if (selected) {
                if (selected.PurchaseRate != null) {
                    row.PRate = selected.PurchaseRate;
                }
                //    $scope.getAssetClosingStock(selected.TranId, row);
                $scope.getAssetClosingStock(R);
            }
        }

        if (index === $scope.newDet.AssetInwardDetailsColl.length - 1) {
            $scope.newDet.AssetInwardDetailsColl.push({
                ParticularId: null,
                DateOfWarranty_TMP: null,
                Qty: null,
                QtyRate: null,
                QtyDisAmt: null,
                PRate: null,
                DisAmt: null,
                Amt: null,
                Status: null
            });
        }
    };

    $scope.CalculateAmount = function (R) {
        $scope.validateQty(R);
        var qty = parseFloat(R.Qty) || 0;
        var rate = parseFloat(R.PRate) || 0;
        var baseAmount = qty * rate;
        var discountAmount = parseFloat(R.DisAmt) || 0;
        R.Amt = +(baseAmount - discountAmount).toFixed(2);
    }

    $scope.validateQty = function (item) {
        var qty = parseFloat(item.Qty);

        if (isNaN(qty) || qty < 0) {
            qty = 0;
        }

        if (qty < 0) {
            qty = Math.abs(qty);
        }

        //if (item.ClosingStock !== undefined && qty > item.ClosingStock) {
        //    qty = item.ClosingStock;
        //    Swal.fire({ icon: 'warning', title: 'Invalid Quantity', text: 'Quantity cannot be greater than Closing Stock.' });
        //}

        item.Qty = Math.floor(qty);
    };

    $scope.CalculateQty = function (pDet) {
        if (!pDet.Qty || pDet.Qty <= 0) {
            pDet.Qty = 1;
        }
        pDet.PRate = parseFloat(((pDet.Amt + (pDet.DisAmt || 0)) / pDet.Qty).toFixed(2));
    };

    $scope.getTotalQty = function () {
        var total = 0;
        angular.forEach($scope.newDet.AssetInwardDetailsColl, function (item) {
            total += Number(item.Qty || 0);
        });
        return total;
    };

    $scope.getTotalAmount = function () {
        var total = 0;
        angular.forEach($scope.newDet.AssetInwardDetailsColl, function (item) {
            total += Number(item.Amt || 0);
        });
        return total;
    };

    $scope.getAssetClosingStock = function (R) {
        $scope.loadingstatus = "running";
        var TranId = R.ParticularId;
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
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed ' + reason);
        });
    };

    $scope.GetInwardAttById = function (refData) {
        $scope.loadingstatus = "running";
        showPleaseWait();
        var para = {
            TranId: refData.TranId
        };
        $http({
            method: 'POST',
            url: base_url + "AssetsManagement/Creation/GetAssetInwardById",
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

})