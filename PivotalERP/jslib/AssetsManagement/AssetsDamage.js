app.controller("AssetDamageController", function ($scope, $filter, $http, $timeout, $compile, GlobalServices) {
    $scope.Title = 'AssetDamage';
    $scope.LoadData = function () {
        $('.select2').select2();
        $scope.perPageColl = GlobalServices.getPerPageList();

        $scope.currentPages = {
            AssetDamage: 1,
        };

        $scope.searchData = {
            AssetDamage: '',
        };

        $scope.HideShow = {
            VoucherType: false,
            CostClass: false
        }

        $scope.perPage = {
            AssetDamage: GlobalServices.getPerPageRow(),
        };
       
        $scope.CategoryColl = [
            { id: 1, text: 'Internal Use' },
            { id: 2, text: 'External Activities' },
            { id: 3, text: 'Events & Training' },
        ];

        $scope.PurposeColl = [
            { id: 1, text: 'Department Work', categoryId: 1 },
            { id: 2, text: 'Administrative Tasks', categoryId: 1 },
            { id: 3, text: 'Personal Use (Authorized)', categoryId: 1 },

            { id: 4, text: 'Official Tour', categoryId: 2 },
            { id: 5, text: 'Field Visit', categoryId: 2 },
            { id: 6, text: 'Guest Use', categoryId: 2 },

            { id: 7, text: 'Training / Workshop', categoryId: 3 },
            { id: 8, text: 'Event / Seminar / Conference', categoryId: 3 }
        ];

        $scope.PurposeColl1 = [
            { id: 1, text: "Internal Use" },
            { id: 2, text: "External Activities" },
            { id: 3, text: " Event and Training" }
        ]

        $scope.StatusColl = [
            { id: 1, text: "Requires Out Side Repair" },
            { id: 2, text: "Damaged" },
            { id: 3, text: "Lost" },
           
        ]
        $scope.confirmMSG = GlobalServices.getConfirmMSG();      

        $scope.GenConfig = {};
        GlobalServices.getGenConfig().then(function (res) {
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

        $scope.newDetails = {
            TranId: null,
            VoucherId: null,
            BranchId: null,
            CostClassId: null,
            ReturnNo: null,
            VoucherDate_TMP: new Date(),
            VoucherDateAD_TMP: new Date(),
            IsOutsideRequired: false,
            OutLocation: '',
            Remark: '',
            AssetdamageDetailsColl: [],
            DocumentColl: [],
            AttechFiles: [],
            Mode: "Save"
        }
        $scope.newDetails.AssetdamageDetailsColl.push({});
        $scope.GetAllAssetdamage();


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
                        $scope.det = {};
                        $timeout(function () {
                            $scope.$apply(function () {
                                if ($scope.VoucherTypeColl.length > 0) {
                                    $scope.SelectedVoucher = $scope.VoucherTypeColl[0];
                                    $scope.newDetails.VoucherId = $scope.SelectedVoucher.VoucherId;
                                    $scope.newDetails.BranchId = $scope.SelectedVoucher.BDId;
                                }

                                if ($scope.CostClassColl.length > 0) {
                                    $scope.SelectedCostClass = $scope.CostClassColl[0];
                                    $scope.newDetails.CostClassId = $scope.SelectedCostClass.CostClassId;
                                }
                                if ($scope.VoucherTypeColl.length <= 1)
                                    $scope.HideShow.VoucherType = true;
                                else
                                    $scope.HideShow.VoucherType = false;

                                if ($scope.CostClassColl.length <= 1)
                                    $scope.HideShow.CostClass = true;
                                else
                                    $scope.HideShow.CostClass = false;

                                $scope.GetAutoDamageNo();

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
        if ($scope.newDetails.VoucherDateDet && $scope.newDetails.VoucherDateDet.dateAD) {

            $scope.newDetails.VoucherDate_TMP = new Date($scope.newDetails.VoucherDateDet.dateAD);
        } else if ($scope.newDetails.VoucherDate) {
            $scope.newDetails.VoucherDate_TMP = new Date($scope.newDetails.VoucherDate);
        } else {
            $scope.newDetails.VoucherDate_TMP = new Date();
        }

        $timeout(function () {
            let dtPicker = '';

            if (dateFormat == 2) { // BS only
                dtPicker =
                    '<input type="text" class="form-control form-control-sm" date-picker ' +
                    'ng-model="newDetails.VoucherDate_TMP" date-detail="newDetails.VoucherDateDet" ' +
                    'confirm-action="getVoucherNoOnly(2)" ' +
                    'title="{{newDetails.VoucherDateDet.dateAD | dateFormat}}" ' +
                    'date-style="2" id="dtVoucherDateBS">';
            } else if (dateFormat == 1) { // AD only
                dtPicker =
                    '<input type="text" class="form-control form-control-sm" date-picker ' +
                    'ng-model="newDetails.VoucherDate_TMP" date-detail="newDetails.VoucherDateDet" ' +
                    'confirm-action="getVoucherNoOnly(1)" ' +
                    'title="{{newDetails.VoucherDateDet.dateBS}}" ' +
                    'date-style="1" id="dtVoucherDateAD">';
            } else if (dateFormat == 3) { // BS & AD (BS first)
                dtPicker = `
                <div class="d-inline-block">
                    <div class="input-group input-group-sm">
                        <div class="input-group-prepend">
                            <span class="input-group-text">BS:</span>
                        </div>
                        <input type="text" class="form-control form-control-sm" date-picker
                               ng-model="newDetails.VoucherDate_TMP"
                               date-detail="newDetails.VoucherDateDet"
                               confirm-action="getVoucherNoOnly(2)"
                               title="{{newDetails.VoucherDateDet.dateAD | dateFormat}}"
                               date-style="2" id="dtVoucherDateBS">
                        <div class="input-group-prepend">
                            <span class="input-group-text">AD:</span>
                        </div>
                        <input type="text" class="form-control form-control-sm" date-picker
                               ng-model="newDetails.VoucherDateAD_TMP"
                               date-detail="newDetails.VoucherDateADDet"
                               confirm-action="getVoucherNoOnly(1)"
                               title="{{newDetails.VoucherDateADDet.dateBS}}"
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
                               ng-model="newDetails.VoucherDateAD_TMP"
                               date-detail="newDetails.VoucherDateADDet"
                               confirm-action="getVoucherNoOnly(1)"
                               title="{{newDetails.VoucherDateADDet.dateBS}}"
                               date-style="1" id="dtVoucherDateAD">
                        <div class="input-group-prepend">
                            <span class="input-group-text">BS:</span>
                        </div>
                        <input type="text" class="form-control form-control-sm" date-picker
                               ng-model="newDetails.VoucherDate_TMP"
                               date-detail="newDetails.VoucherDateDet"
                               confirm-action="getVoucherNoOnly(2)"
                               title="{{newDetails.VoucherDateDet.dateAD | dateFormat}}"
                               date-style="2" id="dtVoucherDateBS">
                    </div>
                </div>`;
            } else {
                // Fallback to AD format if dateFormat has unexpected value
                dtPicker =
                    '<input type="text" class="form-control form-control-sm" date-picker ' +
                    'ng-model="newDetails.VoucherDate_TMP" date-detail="newDetails.VoucherDateDet" ' +
                    'confirm-action="getVoucherNoOnly(1)" ' +
                    'title="{{newDetails.VoucherDateDet.dateBS}}" ' +
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
                    if ($scope.newDetails.VoucherDateADDet && $scope.newDetails.VoucherDateADDet.dateAD) {
                        if (!$scope.newDetails.VoucherDate_TMP ||
                            $scope.newDetails.VoucherDateADDet.dateAD != $scope.newDetails.VoucherDate_TMP) {
                            $scope.newDetails.VoucherDate_TMP = new Date($scope.newDetails.VoucherDateADDet.dateAD);
                        }
                    }
                } else if (dateStyle == 2) {
                    if ($scope.newDetails.VoucherDateDet && $scope.newDetails.VoucherDateDet.dateAD) {
                        if (!$scope.newDetails.VoucherDateAD_TMP ||
                            $scope.newDetails.VoucherDateAD_TMP != $scope.newDetails.VoucherDateDet.dateAD) {
                            $scope.newDetails.VoucherDateAD_TMP = new Date($scope.newDetails.VoucherDateDet.dateAD);
                        }
                    }
                }
            }
        });
    };

    $scope.ClearFields = function () {
        $scope.newDetails = {
            TranId: null,
            VoucherId: $scope.SelectedVoucher.VoucherId,
            BranchId: $scope.SelectedVoucher.BDId,
            CostClassId: $scope.SelectedCostClass.CostClassId,
            ReturnNo: null,
            VoucherDate_TMP: new Date(),
            VoucherDateAD_TMP: new Date(),
            IsOutsideRequired: false,
            OutLocation: '',
            Remark: '',
            AssetdamageDetailsColl: [],
            DocumentColl: [],
            AttechFiles: [],
            Mode: "Save"
        }
        $scope.newDetails.AssetdamageDetailsColl.push({});
        $scope.GetAutoDamageNo();
    }

    $scope.AddMoreFiles = function (files, des) {
        if (files) {
            if (files != null) {
                angular.forEach(files, function (file) {
                    $scope.newDetails.DocumentColl.push({
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
        if ($scope.newDetails.DocumentColl) {
            if ($scope.newDetails.DocumentColl.length > 0) {
                $scope.newDetails.DocumentColl.splice(ind, 1);
            }
        }
    }

    $scope.GetAllAssetdamage = function () {
        $scope.loadingstatus = 'running';
        showPleaseWait();

        $http({
            method: 'POST',
            url: base_url + "AssetsManagement/Creation/GetAllAssetdamage",
            dataType: "json"
        }).then(function (res) {

            $scope.loadingstatus = 'stop';
            hidePleaseWait();

            if (res.data.IsSuccess && res.data.Data) {
                $scope.AssetDamageList = res.data.Data;
            } else
                Swal.fire(res.data.ResponseMSG);

        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    }

    
   
    $scope.IsValidAssetDamage = function () {
        // take only rows where Particular is selected
        var filledRows = $scope.newDetails.AssetdamageDetailsColl.filter(function (row) {
            return row.ParticularId && row.ParticularId !== 0;
        });

        // 1️⃣ at least one valid child row required
        if (filledRows.length === 0) {
            Swal.fire("Warning", "Please add at least one asset damage detail.", "warning");
            return false;
        }

        // 2️⃣ validate only filled rows
        for (var i = 0; i < filledRows.length; i++) {
            var p = filledRows[i];
            var row = i + 1;

            if (!p.Qty || p.Qty <= 0) {
                Swal.fire("Warning","Please enter QTY at row " + row, "warning");
                return false;
            }

            if (!p.StatusId || p.StatusId === 0) {
                Swal.fire("Warning","Please select Status at row " + row, "warning");
                return false;
            }
        }

        return true;
    };

    $scope.SaveUpdateAssetDamage = function () {
        if ($scope.IsValidAssetDamage() == true) {
            if ($scope.confirmMSG.Accept == true) {
                var saveModify = $scope.newDetails.Mode;
                Swal.fire({
                    title: 'Do you want to' + saveModify + 'the current data?',
                    showCancelButton: true,
                    confirmButtonText: saveModify,
                }).then((result) => {
                    if (result.isConfirmed) {
                        $scope.CallSaveUpdateAssetDamage();
                    }
                });
            }
            else
                $scope.CallSaveUpdateAssetDamage();
        }
    };

    $scope.CallSaveUpdateAssetDamage = function () {
        $scope.loadingstatus = 'running';
        showPleaseWait();
        //$scope.newDetails.VoucherId =  $scope.det.VoucherId;
        //$scope.newDetails.BranchId =  $scope.det.BranchId;
        //$scope.newDetails.CostClassId =  $scope.det.CostClassId;
        if ($scope.newDetails.VoucherDateDet) {
            $scope.newDetails.VoucherDate = $filter('date')(new Date($scope.newDetails.VoucherDateDet.dateAD), 'yyyy-MM-dd');
        }

        $scope.newDetails.AssetdamageDetailsColl =
            $scope.newDetails.AssetdamageDetailsColl.filter(function (row) {
                return row.ParticularId != null;
            });

        var filesColl = $scope.newDetails.AttechFiles;
        $scope.newDetails.AttechFiles = [];

        $http({
            method: 'POST',
            url: base_url + "AssetsManagement/Creation/SaveAssetdamage",
            headers: { 'content-Type': undefined },

            transformRequest: function (data) {
                var formData = new FormData();
                formData.append("jsonData", angular.toJson(data.jsonData));
                var find = 0;
                angular.forEach($scope.newDetails.DocumentColl, function (dc) {
                    if (dc.File) {
                        formData.append("file" + find, dc.File);
                    }
                    find++;
                });
                return formData;
            },
            data: { jsonData: $scope.newDetails, files: filesColl }
        }).then(function (res) {

            $scope.loadingstatus = "stop";
            hidePleaseWait();
            Swal.fire(res.data.ResponseMSG);
            if (res.data.IsSuccess == true) {
                $scope.ClearFields();
                $scope.GetAllAssetdamage();
                $scope.GetAutoDamageNo();
            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
        });
    }

    $scope.GetAssetdamageById = function (beData) {
        $scope.loadingstatus = "running";
        var para = {
            TranId: beData.TranId
        };
        $http({
            method: 'POST',
            url: base_url + "AssetsManagement/Creation/GetAssetdamageById",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $timeout(function () {
                    $scope.newDetails = res.data.Data;
                    $scope.newDetails.Mode = 'Modify';
                    if ($scope.newDetails.VoucherDate) {
                        $scope.newDetails.VoucherDate_TMP = new Date($scope.newDetails.VoucherDate);
                    }
                    if (!$scope.newDetails.AssetdamageDetailsColl || $scope.newDetails.AssetdamageDetailsColl.length == 0) {
                        $scope.newDetails.AssetdamageDetailsColl = [];
                        $scope.newDetails.AssetdamageDetailsColl.push({});
                    }
                    if ($scope.newDetails.AssetdamageDetailsColl) {
                        $scope.newDetails.AssetdamageDetailsColl.forEach((S) => {
                            $scope.getAssetClosingStock(S);
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

    $scope.DelAssetdamage = function (refData, ind) {
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
                    url: base_url + "AssetsManagement/Creation/DelAssetdamage",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingstatus = "stop";
                    Swal.fire(res.data.ResponseMSG);
                    if (res.data.IsSuccess) {
                        $scope.GetAllAssetdamage();
                    }
                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }
        });

    }

    $scope.Add = function (index) {

        if (!$scope.newDetails.AssetdamageDetailsColl[index].Qty &&
            !$scope.newDetails.AssetdamageDetailsColl[index].StatusId
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


        if ($scope.newDetails.AssetdamageDetailsColl) {
            if ($scope.newDetails.AssetdamageDetailsColl.length > index + 1) {
                $scope.newDetails.AssetdamageDetailsColl.splice(index + 1, 0, {
                    ClassName: ''
                })
            }
            else {
                $scope.newDetails.AssetdamageDetailsColl.push({
                    ClassName: ''
                })
            }
        }
    }

    $scope.Delete = function (index) {
        if ($scope.newDetails.AssetdamageDetailsColl) {
            if ($scope.newDetails.AssetdamageDetailsColl.length > 1) {
                $scope.newDetails.AssetdamageDetailsColl.splice(index, 1);
            }
            else {
                $scope.newDetails.AssetdamageDetailsColl[0] = {}
            }
        }
    }


    $scope.onParticularChange = function (index,R) {
        if (index === $scope.newDetails.AssetdamageDetailsColl.length - 1) {
            $scope.newDetails.AssetdamageDetailsColl.push({
                ParticularId: null,
                Qty: null,
                StatusId: null 
            });
        }
        $scope.getAssetClosingStock(R);
    };

    $scope.GetAutoDamageNo = function () {
        if ($scope.newDetails.VoucherId && $scope.newDetails.VoucherId > 0) {
            if ($scope.newDetails.CostClassId && $scope.newDetails.CostClassId > 0) {
                var para = {
                    voucherId: $scope.newDetails.VoucherId,
                    costClassId: $scope.newDetails.CostClassId,
                    voucherDate: $scope.newDetails.VoucherDateDet ? ($filter('date')(new Date($scope.newDetails.VoucherDateDet.dateAD), 'yyyy-MM-dd')) : ($filter('date')(new Date(), 'yyyy-MM-dd'))
                };

                $http({
                    method: 'POST',
                    url: base_url + "Account/Creation/GetVoucherNo",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    if (res.data.IsSuccess && res.data.Data) {
                        var vDet = res.data.Data;
                        $scope.newDetails.AutoManualNo = vDet.AutoManualNo;
                        $scope.newDetails.AutoVoucherNo = vDet.AutoVoucherNo;

                    } else {
                        Swal.fire(res.data.ResponseMSG);
                    }
                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }
        } else {
            $scope.newDetails.AutoManualNo = '';
            $scope.newDetails.AutoVoucherNo = 0;
        }
    }


    $scope.getAssetClosingStock = function (R) {
        $scope.loadingstatus = "running";
        var TranId = R.ParticularId;
        showPleaseWait();
        var para = {
            TranId: TranId,
            BranchId: $scope.newDetails.BranchId,
            voucherDate: $scope.newDetails.VoucherDateDet ? ($filter('date')(new Date($scope.newDetails.VoucherDateDet.dateAD), 'yyyy-MM-dd')) : ($filter('date')(new Date(), 'yyyy-MM-dd'))
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

    $scope.validateQty = function (item) {
        var qty = parseFloat(item.Qty);
        if (isNaN(qty) || qty < 0) {
            qty = 0;
        }
        if (qty < 0) {
            qty = Math.abs(qty);
        }
        if (item.ClosingStock !== undefined && qty > item.ClosingStock) {
            qty = 0;
            Swal.fire({ icon: 'warning', title: 'Invalid Quantity', text: 'Quantity cannot be greater than Closing Stock(' + item.ClosingStock + ')' });
        }

        item.Qty = Math.floor(qty);
    };

    $scope.PartyForm = function () {
        $('#PartyFormData').modal('show');
    }


    $scope.GetDamageAttById = function (refData) {
        $scope.loadingstatus = "running";
        showPleaseWait();
        var para = {
            TranId: refData.TranId
        };
        $http({
            method: 'POST',
            url: base_url + "AssetsManagement/Creation/GetAssetdamageById",
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