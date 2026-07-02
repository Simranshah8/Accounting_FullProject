app.controller("GateEntryController", function ($scope, $http, $timeout, $filter, $compile, GlobalServices, $document) {
    $scope.Title = 'Gate Entry';
    let stream = null;
    let video = document.querySelector("#video");
    let canvas = document.querySelector('#canvas');
    $scope.takePhotoFromCamera = async function () {
        if ($scope.webCam.Start == true) {
            $scope.webCam.Start = false;
            canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
            $scope.beData.PhotoData = canvas.toDataURL('image/jpeg');
            try {
                // stop only video
                stream.getVideoTracks()[0].stop();
            } catch { }
            stream = null;
        } else {
            $scope.webCam.Start = true;
            stream = null;
            try {
                stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
            }
            catch (error) {
                alert(error.message);
                return;
            }
            try {
                video.srcObject = stream;
            } catch {
                video.src = URL.createObjectURL(stream);
            }
            //video.style.display = 'block';
        }
    }

    $scope.LoadData = function () {
        $('.select2').select2({
            allowClear: true,
            openOnEnter: true,
            placeholder: 'Select data'
        });
        var glSrv = GlobalServices;
        $scope.perPageColl = GlobalServices.getPerPageList();
        $scope.GenderColl = GlobalServices.getGenderList();

        $scope.webCam = {
            Start: false
        };

        $scope.currentPages = {
            GateEntry: 1,
        };

        $scope.searchData = {
            GateEntry: '',
        };

        $scope.perPage = {
            GateEntry: GlobalServices.getPerPageRow(),
        };
        $scope.confirmMSG = GlobalServices.getConfirmMSG();


        $scope.HideShow = {
            VoucherType: false,
            CostClass: false
        }

        $scope.newFilter = {
            PassType: ''
        }

        $scope.paginationOptions = {
            pageNumber: 1,
            pageSize: $scope.perPage.GateEntry,
            sort: null,
            SearchType: 'text',
            SearchCol: '',
            SearchVal: '',
            SearchColDet: null,
            pagearray: [],
            pageOptions: $scope.perPageColl,
            TotalRows: 0,
        };

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

        $scope.PassTypeColl = [
            { id: 1, text: "In ward" },
            { id: 2, text: "Out ward" },
        ]

        
        $scope.EntryTypeColl = [
            { id: 1, text: "Vehicles" },
            { id: 2, text: "Person" },
            { id: 3, text: "Materials" },
            { id: 4, text: "Vehicles With Goods" },
            { id: 5, text: "Vehicles Empty" },
        ]
        
        
        $scope.TransactionTypeColl = [
            { id: 1, text: "Purchase" },
            { id: 2, text: "Sales" },
            { id: 3, text: "Returnable" },
            { id: 4, text: "Non Returnable" },
            { id: 5, text: "Jobwork" },
            { id: 6, text: "Service" },
        ]

        
        //$scope.ApprovalStatusColl = [
        //    { id: 1, text: "Open" },
        //    { id: 2, text: "Pending" },
        //    { id: 3, text: "Approved" },
        //    { id: 4, text: "Rejected" },
        //    { id: 5, text: "Closed" },
        //    { id: 6, text: "Cancelled" },
        //]
         
        $scope.beData = {
            TranId: null,
            VoucherId: null,
            CostClassId: null,
            LedgerId: null,
            VehicleId: null,
            VoucherDate_TMP: new Date(),
            PassType: '',
            EntryType: '',
            TransactionType: '',
            VehicleNo: '',
            DriverName: '',
            DriverMobile: '',
            DriverLicenseNo: '',
            Purpose: '',
            InvoiceNo: '',
            InvoiceDate: '',
            DocPath_Tmp: '',
            EWayBillNo: '',
            ExpectedOutDate: '',
            InWeight: null,
            OutWeight: null,
            NetWeight: null,
            InGateId: null,
            OutGateId: null,
            ApprovalStatus: 1,
            SealNo: '',
            IsReturnable: false,
            InDateTime: new Date(),
            ItemDetailsGateEntryColl: [],
            PersonDetailsGateEntryColl: [],
            DocumentColl: [],
            AttechFiles: [],
            PhotoPath_TMP: '',
            PhotoPath: '',
            Mode: "Save"
        }
        $scope.NarrationList = [];

        $scope.UserList = [];
        $http({
            method: 'POST',
            url: base_url + "Setup/Security/GetAllUserList",
            dataType: "json",
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.UserList = res.data.Data;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });


        $scope.ProductList = [];
        $http({
            method: 'GET',
            url: base_url + "Inventory/Reporting/GetAllProduct",
            dataType: "json",
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.ProductList = res.data.Data;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });


        $scope.UnitList = [];
        $http({
            method: 'GET',
            url: base_url + "Inventory/Creation/GetAllUnit",
            dataType: "json"
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.UnitList = res.data.Data;
            }
        }, function (reason) {
            alert('Failed' + reason);
        });

        $scope.GateMasterList = [];
        $http({
            method: 'POST',
            url: base_url + "GateMaster/Creation/GetAllGateMaster",
            dataType: "json"
        }).then(function (res) {

            $scope.loadingstatus = 'stop';
            hidePleaseWait();

            if (res.data.IsSuccess && res.data.Data) {
                $scope.GateMasterList = res.data.Data;
            } else
                Swal.fire(res.data.ResponseMSG);

        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        $scope.HideShow = {
            VoucherType: false,
            CostClass: false,
            AutoVoucherNo: false,
            RefNo: true,
        }

        $scope.GetAutoGateEntryNo();


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

                                $scope.GetAutoGateEntryNo();

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

    $scope.ClearPhoto = function () {
        $timeout(function () {
            $scope.$apply(function () {
                $scope.beData.PhotoData = null;
                $scope.beData.PhotoPath_TMP = [];
            });

        });
        $('#imgPhoto1').attr('src', '');
    };

    $scope.ClearFields = function () {
        $scope.ClearPhoto();
        $scope.beData = {
            TranId: null,
            VoucherId: $scope.SelectedVoucher.VoucherId,
            BranchId: $scope.SelectedVoucher.BDId,
            CostClassId: $scope.SelectedCostClass.CostClassId,
            LedgerId: null,
            VehicleId: null,
            VoucherDate_TMP: new Date(),
            PassType: '',
            EntryType: '',
            TransactionType: '',
            VehicleNo: '',
            DriverName: '',
            DriverMobile: '',
            DriverLicenseNo: '',
            Purpose: '',
            InvoiceNo: '',
            InvoiceDate: '',
            DocPath_Tmp: '',
            EWayBillNo: '',
            ExpectedOutDate: '',
            InWeight: null,
            OutWeight: null,
            NetWeight: null,
            InGateId: null,
            OutGateId: null,
            ApprovalStatus: 1,
            SealNo: '',
            IsReturnable: false,
            InDateTime:new Date(),
            ItemDetailsGateEntryColl: [],
            PersonDetailsGateEntryColl: [],
            DocumentColl: [],
            AttechFiles: [],
            PhotoPath_TMP:'',
            PhotoPath:'',
            Mode: "Save"
        }
        $scope.GetAutoGateEntryNo();
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

    $scope.GetAutoGateEntryNo = function () {
        //if ($scope.newDet.VoucherId || $scope.newDet.CostClassId) {
        //    $scope.det.VoucherId = $scope.newDet.VoucherId;
        //    $scope.det.CostClassId = $scope.newDet.CostClassId;
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

    $scope.IsValidGateEntry = function () {
        
        return true;
    };

    $scope.SaveUpdateGateEntry = function () {
        if ($scope.IsValidGateEntry() == true) {
            if ($scope.confirmMSG.Accept == true) {
                var saveModify = $scope.beData.Mode;
                Swal.fire({
                    title: 'Do you want to ' + saveModify + ' the current data?',
                    showCancelButton: true,
                    confirmButtonText: saveModify,
                }).then((result) => {
                    if (result.isConfirmed) {
                        $scope.CallSaveUpdateGateEntry();
                    }
                });
            } else
                $scope.CallSaveUpdateGateEntry();

        }
    };

    $scope.CallSaveUpdateGateEntry = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();
        if ($scope.beData.VoucherDateDet) {
            $scope.beData.VoucherDate = $filter('date')(new Date($scope.beData.VoucherDateDet.dateAD), 'yyyy-MM-dd');
        }

        if ($scope.beData.InvoiceDateDet) {
            $scope.beData.InvoiceDate = $filter('date')(new Date($scope.beData.InvoiceDateDet.dateAD), 'yyyy-MM-dd');
        }

        if ($scope.beData.ItemDetailsGateEntryColl) {
            $scope.beData.ItemDetailsGateEntryColl.forEach((S) => {

                if (S.MFGDateDet)
                    S.MFGDate = $filter('date')(new Date(S.MFGDateDet.dateAD), 'yyyy-MM-dd');

                if (S.EXPDateDet)
                    S.EXPDate = $filter('date')(new Date(S.EXPDateDet.dateAD), 'yyyy-MM-dd');

                if (S.ReturnDueDateDet)
                    S.ReturnDueDate = $filter('date')(new Date(S.ReturnDueDateDet.dateAD), 'yyyy-MM-dd');
            });
        }

        if ($scope.beData.PersonDetailsGateEntryColl) {
            $scope.beData.PersonDetailsGateEntryColl.forEach((S) => {

                if (S.InDateTimeDet)
                    S.InDateTime = $filter('date')(new Date(S.InDateTimeDet.dateAD), 'yyyy-MM-dd');

                if (S.OutDateTimeDet)
                    S.OutDateTime = $filter('date')(new Date(S.OutDateTimeDet.dateAD), 'yyyy-MM-dd');
            });
        }

        var filesColl = $scope.beData.AttechFiles;
        $scope.beData.AttechFiles = [];
        var photo = $scope.beData.PhotoPath_TMP;
        $http({
            method: 'POST',
            url: base_url + "GateMaster/Creation/SaveTransactionGateEntry",
            headers: { 'Content-Type': undefined },
            transformRequest: function (data) {
                var formData = new FormData();
                formData.append("jsonData", angular.toJson(data.jsonData));

                if (data.emPhoto && data.emPhoto.length > 0)
                    formData.append("photo", data.emPhoto[0]);

                var find = 0;
                angular.forEach($scope.beData.DocumentColl, function (dc) {
                    if (dc.File) {
                        formData.append("file" + find, dc.File);
                    }
                    find++;
                });
                return formData;
            },
            data: { jsonData: $scope.beData, files: filesColl, emPhoto: photo }
        }).then(function (res) {

            $scope.loadingstatus = "stop";
            hidePleaseWait();
            Swal.fire(res.data.ResponseMSG);

            if (res.data.IsSuccess == true) {
                $scope.ClearFields();
                $scope.GetAutoGateEntryNo();

            }

        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";

        });
    }

    $scope.ReSearchData = function (pageInd) {
        if (pageInd && pageInd >= 0)
            $scope.paginationOptions.pageNumber = pageInd;
        else if (pageInd == -1)
            $scope.paginationOptions.pageNumber = 1;

        $scope.SearchData();

    }

    $scope.SearchData = function () {
        $scope.loadingstatus = 'running';
        showPleaseWait();
        $scope.SearchDataColl = [];
        var para = {
            PassType: $scope.newFilter.PassType || '',
            PageNumber: $scope.paginationOptions.pageNumber,
            RowsOfPage: $scope.perPage.GateEntry,
            SearchBy: $scope.searchData.GateEntry
        };

        $http({
            method: 'POST',
            url: base_url + "GateMaster/Creation/GetAllTransactionGateEntry",
            dataType: "json",
                data: JSON.stringify(para)
        }).then(function (res) {
            $scope.loadingstatus = 'stop';
            hidePleaseWait();

            if (res.data.IsSuccess && res.data.Data) {
                $scope.SearchDataColl = res.data.Data;
                $scope.paginationOptions.TotalRows = res.data.TotalCount;
                $('#searVoucherRightBtn').modal('show');

            } else
                alert(res.data.ResponseMSG);

        }, function (reason) {
            alert('Failed' + reason);
        });
    };

    $scope.GetGateEntryById = function (refData) {
        $scope.loadingstatus = "running";
        showPleaseWait();
        var para = {
            TranId: refData.TranId
        };
        $http({
            method: 'POST',
            url: base_url + "GateMaster/Creation/GetTransactionGateEntryById",
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

                if ($scope.beData.InvoiceDate) {
                    $scope.beData.InvoiceDate_TMP = new Date($scope.beData.InvoiceDate);
                }


                if ($scope.beData.EntryType === 'Person') {
                    if (!$scope.beData.PersonDetailsGateEntryColl || $scope.beData.PersonDetailsGateEntryColl.length == 0) {
                        $scope.beData.PersonDetailsGateEntryColl = [];
                        $scope.beData.PersonDetailsGateEntryColl.push({});
                    }
                }

                if ($scope.beData.EntryType === 'Vehicles With Goods') {
                    if (!$scope.beData.ItemDetailsGateEntryColl || $scope.beData.ItemDetailsGateEntryColl.length == 0) {
                        $scope.beData.ItemDetailsGateEntryColl = [];
                        $scope.beData.ItemDetailsGateEntryColl.push({});
                    }
                }
                
                if ($scope.beData.ItemDetailsGateEntryColl) {
                    $scope.beData.ItemDetailsGateEntryColl.forEach((S) => {
                        if (S.MFGDate)
                            S.MFGDate_TMP = new Date(S.MFGDate);

                        if (S.EXPDate)
                            S.EXPDate_TMP = new Date(S.EXPDate);

                        if (S.ReturnDueDate)
                            S.ReturnDueDate_TMP = new Date(S.ReturnDueDate);
                    });
                }

                if ($scope.beData.PersonDetailsGateEntryColl) {
                    $scope.beData.PersonDetailsGateEntryColl.forEach((S) => {
                        if (S.InDateTime)
                            S.InDateTime_TMP = new Date(S.InDateTime);

                        if (S.OutDateTime)
                            S.OutDateTime_TMP = new Date(S.OutDateTime);
                    });
                }
                $('#custom-tabs-four-profile-tab').tab('show');
                $('#searVoucherRightBtn').modal('hide');

            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    };

    $scope.DelGateEntryById = function (refData, ind) {
        Swal.fire({
            title: 'Are you sure you want to delete  Gate Entry Number ' + refData.AutoManualNo + '?',
            showCancelButton: true,
            confirmButtonText: 'Delete',
        }).then((result) => {
            if (result.isConfirmed) {
                var para = { TranId: refData.TranId };
                $http({
                    method: 'POST',
                    url: base_url + "GateMaster/Creation/DelTransactionGateEntry",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingStatus = "stop";
                    Swal.fire(res.data.ResponseMSG);
                    if (res.data.IsSuccess == true) {
                        $scope.ReSearchData();
                    }
                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }
        });
    }

    $scope.AddPHDDetails = function (ind) {
        if ($scope.beData.ItemDetailsGateEntryColl) {
            if ($scope.beData.ItemDetailsGateEntryColl.length > ind + 1) {
                $scope.beData.ItemDetailsGateEntryColl.splice(ind + 1, 0, {
                    SortOrder: 1
                })
            } else {
                $scope.beData.ItemDetailsGateEntryColl.push({
                    SortOrder: 1
                })
            }
        }
    };

    $scope.delPHDDetails = function (ind) {
        if ($scope.beData.ItemDetailsGateEntryColl) {
            if ($scope.beData.ItemDetailsGateEntryColl.length > 1) {
                $scope.beData.ItemDetailsGateEntryColl.splice(ind, 1);
            }
        }
    };

    $scope.AddPersonDet = function (ind) {
        if ($scope.beData.PersonDetailsGateEntryColl) {
            if ($scope.beData.PersonDetailsGateEntryColl.length > ind + 1) {
                $scope.beData.PersonDetailsGateEntryColl.splice(ind + 1, 0, {
                    SortOrder: 1
                })
            } else {
                $scope.beData.PersonDetailsGateEntryColl.push({
                    SortOrder: 1
                })
            }
        }
    };

    $scope.delPersonDet = function (ind) {
        if ($scope.beData.PersonDetailsGateEntryColl) {
            if ($scope.beData.PersonDetailsGateEntryColl.length > 1) {
                $scope.beData.PersonDetailsGateEntryColl.splice(ind, 1);
            }
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

    $scope.ChangeArray = function () {
        if ($scope.beData.EntryType === 'Person') {
            $scope.beData.PersonDetailsGateEntryColl.push({});
            $scope.beData.ItemDetailsGateEntryColl = [];
        }
        else if ($scope.beData.EntryType === 'Vehicles With Goods') {
            $scope.beData.ItemDetailsGateEntryColl.push({});
            $scope.beData.PersonDetailsGateEntryColl = [];
        }
        else {
            $scope.beData.ItemDetailsGateEntryColl = [];
            $scope.beData.PersonDetailsGateEntryColl = [];
        }
    }

    $scope.GetVehiclesForOutWard = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();
        var para = {
            PassType: $scope.beData.PassType
        };
        $http({
            method: 'POST',
            url: base_url + "GateMaster/Creation/GetVehiclesForOutWard",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.VehicleList  = res.data.Data;

            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    };

    $scope.onVehicleChange = function () {
        var selectedVehicle = $scope.VehicleList.find(function (v) {
            return v.VehicleId == $scope.beData.VehicleId;
        });

        if (selectedVehicle) {
            $scope.beData.VehicleNo = selectedVehicle.VehicleNo || '';
            $scope.beData.DriverName = selectedVehicle.DriverName || '';
            $scope.beData.DriverMobile = selectedVehicle.DriverMobile || '';
            $scope.beData.DriverLicenseNo = selectedVehicle.DriverLicenseNo || '';
        } else {
            $scope.beData.VehicleNo = '';
            $scope.beData.DriverName = '';
            $scope.beData.DriverMobile = '';
            $scope.beData.DriverLicenseNo = '';
        }
    }
})