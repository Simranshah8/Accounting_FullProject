app.controller("JobWorkOrder", function ($scope, $http, $timeout, $filter, $compile, GlobalServices, $document) {
    $scope.Title = 'JobWorkOrder';
    $scope.LoadData = function () {
        $('.select2').select2();
        var glSrv = GlobalServices;
        $scope.perPageColl = GlobalServices.getPerPageList();

        $scope.currentPages = {
            JobWorkOrder: 1,
        };

        $scope.searchData = {
            JobWorkOrder: '',
        };

        $scope.perPage = {
            JobWorkOrder: GlobalServices.getPerPageRow(),
        };
        $scope.confirmMSG = GlobalServices.getConfirmMSG();

        $scope.HideShow = {
            VoucherType: false,
            CostClass: false
        }

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


        $scope.beData = {
            TranId: null,
            FromDate_TMP: new Date(),
            ToDate_TMP: new Date(),
            VendorId: null,
            //BranchId: null,
            DocPath_Tmp: '',
            Remarks: '',
            DocumentColl: [],
            AttechFiles: [],
            PartyName: '',
            Address: '',
            ContactNo: '',
            Remarks: '',
            JobCardId: null,
            Mode: "Save"
        }
     
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
                                    $scope.beData.VoucherId = $scope.SelectedVoucher.VoucherId;
                                    $scope.beData.BranchId = $scope.SelectedVoucher.BDId;
                                }

                                if ($scope.CostClassColl.length > 0) {
                                    $scope.SelectedCostClass = $scope.CostClassColl[0];
                                    $scope.beData.CostClassId = $scope.SelectedCostClass.CostClassId;
                                }
                                if ($scope.VoucherTypeColl.length <= 1)
                                    $scope.HideShow.VoucherType = true;
                                else
                                    $scope.HideShow.VoucherType = false;

                                if ($scope.CostClassColl.length <= 1)
                                    $scope.HideShow.CostClass = true;
                                else
                                    $scope.HideShow.CostClass = false;

                                $scope.GetAutoJobWorkOrderNo();

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

    //    $scope.GetAllJobWorkOrder();
    }

    $scope.reloadVoucherDate = function () {
        const container = angular.element(document.getElementById('dvDTVoucher'));
        container.empty(); // Clear the container

        const dateFormat = $scope.GenConfig.DateStyle || 2;
        if ($scope.beData.VoucherDateDet && $scope.beData.VoucherDateDet.dateAD) {

            $scope.beData.VoucherDate_TMP = new Date($scope.beData.VoucherDateDet.dateAD);
        } else if ($scope.beData.VoucherDate) {
            $scope.beData.VoucherDate_TMP = new Date($scope.beData.VoucherDate);
        } else {
            $scope.beData.VoucherDate_TMP = new Date();
        }

        $timeout(function () {
            let dtPicker = '';

            if (dateFormat == 2) { // BS only
                dtPicker =
                    '<input type="text" class="form-control form-control-sm" date-picker ' +
                    'ng-model="beData.VoucherDate_TMP" date-detail="beData.VoucherDateDet" ' +
                    'confirm-action="getVoucherNoOnly(2)" ' +
                    'title="{{beData.VoucherDateDet.dateAD | dateFormat}}" ' +
                    'date-style="2" id="dtVoucherDateBS">';
            } else if (dateFormat == 1) { // AD only
                dtPicker =
                    '<input type="text" class="form-control form-control-sm" date-picker ' +
                    'ng-model="beData.VoucherDate_TMP" date-detail="beData.VoucherDateDet" ' +
                    'confirm-action="getVoucherNoOnly(1)" ' +
                    'title="{{beData.VoucherDateDet.dateBS}}" ' +
                    'date-style="1" id="dtVoucherDateAD">';
            } else if (dateFormat == 3) { // BS & AD (BS first)
                dtPicker = `
                <div class="d-inline-block">
                    <div class="input-group input-group-sm">
                        <div class="input-group-prepend">
                            <span class="input-group-text">BS:</span>
                        </div>
                        <input type="text" class="form-control form-control-sm" date-picker
                               ng-model="beData.VoucherDate_TMP"
                               date-detail="beData.VoucherDateDet"
                               confirm-action="getVoucherNoOnly(2)"
                               title="{{beData.VoucherDateDet.dateAD | dateFormat}}"
                               date-style="2" id="dtVoucherDateBS">
                        <div class="input-group-prepend">
                            <span class="input-group-text">AD:</span>
                        </div>
                        <input type="text" class="form-control form-control-sm" date-picker
                               ng-model="beData.VoucherDateAD_TMP"
                               date-detail="beData.VoucherDateADDet"
                               confirm-action="getVoucherNoOnly(1)"
                               title="{{beData.VoucherDateADDet.dateBS}}"
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
                               ng-model="beData.VoucherDateAD_TMP"
                               date-detail="beData.VoucherDateADDet"
                               confirm-action="getVoucherNoOnly(1)"
                               title="{{beData.VoucherDateADDet.dateBS}}"
                               date-style="1" id="dtVoucherDateAD">
                        <div class="input-group-prepend">
                            <span class="input-group-text">BS:</span>
                        </div>
                        <input type="text" class="form-control form-control-sm" date-picker
                               ng-model="beData.VoucherDate_TMP"
                               date-detail="beData.VoucherDateDet"
                               confirm-action="getVoucherNoOnly(2)"
                               title="{{beData.VoucherDateDet.dateAD | dateFormat}}"
                               date-style="2" id="dtVoucherDateBS">
                    </div>
                </div>`;
            } else {
                // Fallback to AD format if dateFormat has unexpected value
                dtPicker =
                    '<input type="text" class="form-control form-control-sm" date-picker ' +
                    'ng-model="beData.VoucherDate_TMP" date-detail="beData.VoucherDateDet" ' +
                    'confirm-action="getVoucherNoOnly(1)" ' +
                    'title="{{beData.VoucherDateDet.dateBS}}" ' +
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
                    if ($scope.beData.VoucherDateADDet && $scope.beData.VoucherDateADDet.dateAD) {
                        if (!$scope.beData.VoucherDate_TMP ||
                            $scope.beData.VoucherDateADDet.dateAD != $scope.beData.VoucherDate_TMP) {
                            $scope.beData.VoucherDate_TMP = new Date($scope.beData.VoucherDateADDet.dateAD);
                        }
                    }
                } else if (dateStyle == 2) {
                    if ($scope.beData.VoucherDateDet && $scope.beData.VoucherDateDet.dateAD) {
                        if (!$scope.beData.VoucherDateAD_TMP ||
                            $scope.beData.VoucherDateAD_TMP != $scope.beData.VoucherDateDet.dateAD) {
                            $scope.beData.VoucherDateAD_TMP = new Date($scope.beData.VoucherDateDet.dateAD);
                        }
                    }
                }
            }
        });
    };

    $scope.ClearFields = function () {
        $scope.ClearPhoto();
        $scope.GetAutoJobWorkOrderNo();
        $scope.beData = {
            TranId: null,
            VoucherDate_TMP: new Date(),
            FromDate_TMP: new Date(),
            ToDate_TMP: new Date(),
            VendorId: null,
            VoucherId: $scope.SelectedVoucher.VoucherId,
            BranchId: $scope.SelectedVoucher.BDId,
            CostClassId: $scope.SelectedCostClass.CostClassId,
            DocPath_Tmp: '',
            PartyName: '',
            Address: '',
            ContactNo: '',
            Remarks: '',
            DocumentColl: [],
            AttechFiles: [],
            Mode: "Save"
        }
       
    }

    $scope.ChangeParticularLedger = function (de) {
        if (!de)
            return false;
        LedgerDetails = de.LedgerDetails;
        $scope.beData.PartyName = LedgerDetails.Name;
        $scope.beData.Address = LedgerDetails.Address;
        $scope.beData.ContactNo = LedgerDetails.MobileNo1?.trim() ? LedgerDetails.MobileNo1 : LedgerDetails.MobileNo2;

    }

    $scope.RemoveAttachment = function (fId, ind) {
        if (fId == 1) {
            $scope.beData.DocumentColl.splice(ind, 1);
        }
        else if (fId == 2) {
            $scope.beData.AttechFiles.splice(ind, 1);
        }
    }

    $scope.AddMoreFiles = function (files, des) {
        if (files) {
            if (files != null) {
                angular.forEach(files, function (file) {
                    $scope.beData.DocumentColl.push({
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
        if ($scope.beData.DocumentColl) {
            if ($scope.beData.DocumentColl.length > 0) {
                $scope.beData.DocumentColl.splice(ind, 1);
            }
        }
    }



    $scope.IsValidJobWorkOrder = function () {
        return true;
    };

    $scope.SaveUpdateJobWorkOrder = function () {
        if ($scope.IsValidJobWorkOrder() == true) {
            if ($scope.confirmMSG.Accept == true) {
                var saveModify = $scope.beData.Mode;
                Swal.fire({
                    title: 'Do you want to ' + saveModify + ' the current data?',
                    showCancelButton: true,
                    confirmButtonText: saveModify,
                }).then((result) => {
                    if (result.isConfirmed) {
                        $scope.CallSaveUpdateJobWorkOrder();
                    }
                });
            } else
                $scope.CallSaveUpdateJobWorkOrder();

        }
    };

    $scope.CallSaveUpdateJobWorkOrder = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();
        var DoctAttach = $scope.beData.PhotoPath_TMP;
        if ($scope.beData.VoucherDateDet) {
            $scope.beData.VoucherDate = $filter('date')(new Date($scope.beData.VoucherDateDet.dateAD), 'yyyy-MM-dd');
        }

        if ($scope.beData.FromDateDet) {
            $scope.beData.FromDate = $filter('date')(new Date($scope.beData.FromDateDet.dateAD), 'yyyy-MM-dd');
        }

        if ($scope.beData.ToDateDet) {
            $scope.beData.ToDate = $filter('date')(new Date($scope.beData.ToDateDet.dateAD), 'yyyy-MM-dd');
        }

        var filesColl = $scope.beData.AttechFiles;
        $scope.beData.AttechFiles = [];
        //$scope.beData.VoucherId;
        //$scope.beData.BranchId;
        $http({
            method: 'POST',
            url: base_url + "Service/Transaction/SaveJobWorksOrder",
            headers: { 'Content-Type': undefined },
            transformRequest: function (data) {
                var formData = new FormData();
                formData.append("jsonData", angular.toJson(data.jsonData));

                if (data.doctAttach && data.doctAttach.length > 0)
                    formData.append("DoctAttach", data.doctAttach[0]);

                //if (data.Img && data.Img.length > 0)
                //    formData.append("DoctAttach", data.Img[0]);
                var find = 0;
                angular.forEach($scope.beData.DocumentColl, function (dc) {
                    if (dc.File) {
                        formData.append("file" + find, dc.File);
                    }
                    find++;
                });
                return formData;
            },
            data: { jsonData: $scope.beData, files: filesColl }
        }).then(function (res) {
            $scope.loadingstatus = "stop";
            hidePleaseWait();
            Swal.fire(res.data.ResponseMSG);
            if (res.data.IsSuccess == true) {
                //$scope.GetAllJobWorkOrder();
                $scope.ClearFields();
                $scope.GetAutoJobWorkOrderNo();
            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";

        });
    }

    $scope.ClearPhoto = function () {
        $timeout(function () {
            $scope.$apply(function () {
                $scope.beData.PhotoPathData = null;
                $scope.beData.PhotoPath_TMP = [];
            });
        });
        $('#Photo').attr('src', '');
    };

    $scope.GetJobWorkOrderById = function (refData) {
        $scope.loadingstatus = "running";
        showPleaseWait();
        var para = {
            TranId: refData.TranId
        };
        $http({
            method: 'POST',
            url: base_url + "Service/Transaction/GetJobWorksOrderById",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.beData = res.data.Data;
                $scope.beData.Mode = 'Modify';
                if ($scope.beData.VoucherDate) {
                    $scope.beData.VoucherDate_TMP = new Date($scope.beData.VoucherDate);
                }
                if ($scope.beData.FromDate) {
                    $scope.beData.FromDate_TMP = new Date($scope.beData.FromDate);
                }
                if ($scope.beData.ToDate) {
                    $scope.beData.ToDate_TMP = new Date($scope.beData.ToDate);
                }
                $('#ApproveModal').modal('hide');
                $('#custom-tabs-four-profile-tab').tab('show');
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    };

    $scope.GetAllJobWorkOrder = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();
        $http({
            method: 'POST',
            url: base_url + "Service/Transaction/GetAllJobWorksOrder",
            dataType: "json",
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.JobWorkOrderList = res.data.Data;
                $('#ApproveModal').modal('show');

            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            Swal.fire('Failed: ' + reason);
        });
    }

    $scope.DelJobWorkOrder = function (refData, ind) {
        Swal.fire({
            title: 'Are you sure you want to delete ?',
            showCancelButton: true,
            confirmButtonText: 'Delete',
        }).then((result) => {
            if (result.isConfirmed) {
                var para = { TranId: refData.TranId };
                $http({
                    method: 'POST',
                    url: base_url + "Service/Transaction/DelJobWorksOrder",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingStatus = "stop";
                    Swal.fire(res.data.ResponseMSG);
                    if (res.data.IsSuccess == true) {
                        $scope.GetAllJobWorkOrder();
                    }
                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }
        });
    }



    $scope.GetAutoJobWorkOrderNo = function () {
        //if ($scope.beData.VoucherId || $scope.beData.CostClassId) {
        //    $scope.det.VoucherId = $scope.beData.VoucherId;
        //    $scope.det.CostClassId = $scope.beData.CostClassId;
        //}
        if ($scope.beData.VoucherId && $scope.beData.VoucherId > 0) {
            if ($scope.beData.CostClassId && $scope.beData.CostClassId > 0) {
                var para = {
                    voucherId: $scope.beData.VoucherId,
                    costClassId: $scope.beData.CostClassId,
                    voucherDate: $scope.beData.VoucherDateDet ? ($filter('date')(new Date($scope.beData.VoucherDateDet.dateAD), 'yyyy-MM-dd')) : ($filter('date')(new Date(), 'yyyy-MM-dd'))
                };
                $http({
                    method: 'POST',
                    url: base_url + "Account/Creation/GetVoucherNo",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    if (res.data.IsSuccess && res.data.Data) {
                        var vDet = res.data.Data;
                        $scope.beData.AutoManualNo = vDet.AutoManualNo;
                        $scope.beData.AutoVoucherNo = vDet.AutoVoucherNo;

                    } else {
                        Swal.fire(res.data.ResponseMSG);
                    }
                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }
        } else {
            $scope.beData.AutoManualNo = '';
            $scope.beData.AutoVoucherNo = 0;
        }
    }









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