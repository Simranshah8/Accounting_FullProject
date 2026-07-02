app.controller('BankPayLetterController', function ($scope, $http, $timeout, $filter, GlobalServices) {
    $scope.Title = 'Bank Payment';
    var glSrv = GlobalServices;
    LoadData();

    $scope.sideBarData = [];
    $scope.SelectedVoucher = null;
    $scope.SelectedCostClass = null;
    function LoadData() {

	$scope.VoucherSearchOptions = [{ text: 'PartyName', value: 'ADS.Buyes', searchType: 'text' }, { text: 'PanVat', value: 'ADS.SalesTaxNo', searchType: 'text' }, { text: 'PartyLedger', value: 'Led.Name', searchType: 'text' }, { text: 'RefNo', value: 'TS.[No]', searchType: 'text' }, { text: 'Invoice No.', value: 'TS.AutoManualNo', searchType: 'text' }, { text: 'Voucher', value: 'V.VoucherName', searchType: 'text' }, { text: 'CostClass', value: 'CC.Name', searchType: 'text' }, { text: 'VoucherDate', value: 'TS.VoucherDate', searchType: 'date' }, { text: 'Amount', value: 'TS.TotalAmount', searchType: 'number' }];
        $scope.paginationOptions = {
            pageNumber: 1,
            pageSize: glSrv.getPerPageRow(),
            sort: null,
            SearchType: 'text',
            SearchCol: '',
            SearchVal: '',
            SearchColDet: $scope.VoucherSearchOptions[4],
            pagearray: [],
            pageOptions: [5, 10, 20, 30, 40, 50]
        };
        


        $scope.beData = {
            TranId: 0,
            BankQuotationTranId: null,
            QuotationNo: '',
            VoucherId: null,
            CostClassId: null,
            AutoVoucherNo: 0,
            AutoManualNo: '',
            VoucherDate: new Date(),
            VoucherDateDet: new Date(),
            BankName: '',
            BankBranch: '',
            PartyName: '',
            PartyAddress: '',
            MobileNo: '',
            Model: '',
            Narration: '',
            Price: 0,
            DiscountAmt: 0,
            TotalAmount: 0,
            DoRefNo: '',
            BankAcNo:'',
            AttechFiles: []
        };

        $scope.VoucherTypeColl = [];
        $scope.CostClassColl = [];
        $scope.VehicleModuleColl = [];

        $('.select2').select2({ allowClear: true, width: '100%', placeholder: 'select..' });

        if (VoucherType) {
            $timeout(function () {
                $http({
                    method: 'GET',
                    url: base_url + "Account/Creation/GetVoucherList?voucherType=" + VoucherType,
                    dataType: "json"
                }).then(function (res) {
                    if (res.data.IsSuccess && res.data.Data) {
                        $scope.VoucherTypeColl = res.data.Data;
                        $timeout(function () {
                            if ($scope.VoucherTypeColl.length > 0) {
                                $scope.SelectedVoucher = $scope.VoucherTypeColl[0];
                                $scope.beData.VoucherId = $scope.VoucherTypeColl[0].VoucherId;
                            }
                        });

                        $timeout(function () {
                            $scope.$apply(function () {
                                $scope.getVoucherNo();
                            });
                        });
                    }
                }, function (reason) {
                    alert('Failed' + reason);
                });
            });

            $timeout(function () {
                $http({
                    method: 'GET',
                    url: base_url + "Account/Creation/GetCostClassForEntry",
                    dataType: "json"
                }).then(function (res) {
                    if (res.data.IsSuccess && res.data.Data) {
                        $scope.CostClassColl = res.data.Data;

                        $timeout(function () {
                            if ($scope.CostClassColl.length > 0) {
                                $scope.SelectedCostClass = $scope.CostClassColl[0];
                                $scope.beData.CostClassId = $scope.CostClassColl[0].CostClassId;
                            }

                        });

                        $timeout(function () {
                            $scope.$apply(function () {
                                $scope.getVoucherNo();
                            });
                        });

                    }
                }, function (reason) {
                    alert('Failed' + reason);
                });
            });

            $http({
                method: 'GET',
                url: base_url + "Service/Creation/GetVehicleModelList",
                dataType: "json"
            }).then(function (res) {
                if (res.data.IsSuccess && res.data.Data) {
                    $scope.VehicleModuleColl = res.data.Data;
                }
            }, function (reason) {
                alert('Failed' + reason);
            });

        }


        $timeout(function () {
            $('#cboVoucherType').focus();
        })

    }
    $scope.ShowSideBar = function () {
        $('#sidebarzz').toggleClass('active');
    };

    $scope.OnPartyLoad = function () {
        // $scope.loadingstatus = 'running';
    };

    $scope.OnProductLoad = function () {

        // $scope.loadingstatus = 'running';
    };

    $scope.AddBankQuotation = function () {

        $scope.loadingstatus = "running";
        showPleaseWait();

        if ($scope.beData.VoucherDateDet) {

            if (moment($scope.beData.VoucherDateDet).isValid())
                $scope.beData.VoucherDate = $filter('date')(new Date($scope.beData.VoucherDateDet), 'yyyy-MM-dd');
            else
                $scope.beData.VoucherDate = $filter('date')(new Date($scope.beData.VoucherDateDet.dateAD), 'yyyy-MM-dd');
        }

        $scope.beData.DODate = $scope.beData.VoucherDate;

        var filesColl = $scope.beData.AttechFiles;
        $scope.beData.AttechFiles = [];


        $http({
            method: 'POST',
            url: base_url + "Inventory/Transaction/SaveUpdateBankPayLetter",
            headers: { 'Content-Type': undefined },

            transformRequest: function (data) {

                var formData = new FormData();
                formData.append("jsonData", angular.toJson(data.jsonData));

                if (data.files) {
                    for (var i = 0; i < data.files.length; i++) {
                        formData.append("file" + i, data.files[i]);
                    }
                }

                return formData;
            },
            data: { jsonData: $scope.beData, files: filesColl }
        }).then(function (res) {

            $scope.loadingstatus = "stop";
            hidePleaseWait();

            alert(res.data.ResponseMSG);

            if (res.data.IsSuccess == true) {

                $scope.lastTranId = res.data.Data.RId;

                if ($scope.SelectedVoucher.PrintVoucherAfterSaving == true)
                    $scope.Print();

                $scope.Clear();
                $('#txtQuotationNo').focus();
            }

        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";

        });

    }
    $scope.Print = function () {
        if ($scope.lastTranId && $scope.lastTranId > 0) {
            var TranId = $scope.lastTranId;

            $http({
                method: 'GET',
                url: base_url + "ReportEngine/GetReportTemplates?entityId=" + EntityId + "&voucherId=" + $scope.SelectedVoucher.VoucherId + "&isTran=true",
                dataType: "json"
            }).then(function (res) {
                if (res.data.IsSuccess && res.data.Data) {
                    var templatesColl = res.data.Data;
                    if (templatesColl && templatesColl.length > 0) {
                        var templatesName = [];
                        var sno = 1;
                        angular.forEach(templatesColl, function (tc) {
                            templatesName.push(sno + '-' + tc.ReportName);
                            sno++;
                        });

                        var printed = false;
                        var rptTranId = 0;
                        if (templatesColl.length == 1)
                            rptTranId = templatesColl[0].RptTranId;
                        else {
                            Swal.fire({
                                title: 'Report Templates For Print',
                                input: 'select',
                                inputOptions: templatesName,
                                inputPlaceholder: 'Select a template',
                                showCancelButton: true,
                                inputValidator: (value) => {
                                    return new Promise((resolve) => {
                                        if (value >= 0) {
                                            resolve()
                                            rptTranId = templatesColl[value].RptTranId;
                                            printed = true;
                                            if (rptTranId > 0) {
                                                document.body.style.cursor = 'wait';
                                                document.getElementById("frmRpt").src = '';
                                                document.getElementById("frmRpt").src = base_url + "web/ReportViewer.aspx?rpttranid=" + rptTranId + "&istransaction=true&entityid=" + EntityId + "&voucherid=" + $scope.SelectedVoucher.VoucherId + "&tranid=" + TranId + "&vouchertype=" + VoucherType;
                                                document.body.style.cursor = 'default';
                                                $('#FrmPrintReport').modal('show');
                                            }
                                        } else {
                                            resolve('You need to select:)')
                                        }
                                    })
                                }
                            })
                        }

                        if (rptTranId > 0 && printed == false) {
                            document.body.style.cursor = 'wait';
                            document.getElementById("frmRpt").src = '';
                            document.getElementById("frmRpt").src = base_url + "web/ReportViewer.aspx?rpttranid=" + rptTranId + "&istransaction=true&entityid=" + EntityId + "&voucherid=" + $scope.SelectedVoucher.VoucherId + "&tranid=" + TranId + "&vouchertype=" + VoucherType;
                            document.body.style.cursor = 'default';
                            $('#FrmPrintReport').modal('show');
                        }

                    } else
                        Swal.fire('No Templates found for print');
                }
            }, function (reason) {
                Swal.fire('Failed' + reason);
            });



        }
    };

    $scope.getVoucherNoOnly = function () {

        var isModify = ($scope.beData.TranId > 0 ? true : false);

        if ($scope.SelectedVoucher && isModify == false) {

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
    }

    $scope.getVoucherNo = function () {
        if ($scope.beData.VoucherId && $scope.beData.VoucherId > 0) {
            if ($scope.beData.CostClassId && $scope.beData.CostClassId > 0) {
                var para = {
                    voucherId: $scope.beData.VoucherId,
                    costClassId: $scope.beData.CostClassId,
                    voucherDate: $scope.beData.VoucherDateDet ? ($filter('date')(new Date($scope.beData.VoucherDateDet.dateAD), 'yyyy-MM-dd')) : ($filter('date')(new Date(), 'yyyy-MM-dd'))
                };

                $timeout(function () {
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
                            alert(res.data.ResponseMSG);
                        }
                    }, function (reason) {
                        alert('Failed' + reason);
                    });
                });


                $timeout(function () {
                    $http({
                        method: 'GET',
                        url: base_url + "Account/Creation/GetVoucherModeById?voucherId=" + $scope.beData.VoucherId,
                        dataType: "json",
                        //data: JSON.stringify(para)
                    }).then(function (res) {
                        if (res.data.IsSuccess && res.data.Data) {
                            $scope.SelectedVoucher = res.data.Data;
                        }
                    }, function (reason) {
                        alert('Failed' + reason);
                    });
                });
            }
        } else {
            $scope.beData.AutoManualNo = '';
            $scope.beData.AutoVoucherNo = 0;
        }

    }
   $scope.getQuotationDet = function () {

        if ($scope.beData.RefNo) {
            if ($scope.beData.RefNo.length == 0)
                return;
        } else
            return;

        $http({
            method: 'GET',
            url: base_url + "Inventory/Transaction/getBankDOByRef?doRefNo=" + $scope.beData.RefNo,
            dataType: "json"
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                var vDet = res.data.Data;
                $scope.beData.BankName = vDet.BankName;
                $scope.beData.BankBranch = vDet.BankBranch;
                $scope.beData.PartyName = vDet.PartyName;
                $scope.beData.PartyAddress = vDet.PartyAddress;
                $scope.beData.MobileNo = vDet.MobileNo;
                $scope.beData.Narration = vDet.Narration;
                $scope.beData.BankDOTranId = vDet.TranId;
                $scope.beData.Amount = vDet.TotalAmount;
                $scope.beData.EngineNo = vDet.EngineNo;
                $scope.beData.Segment = vDet.ProductName;
                $scope.beData.DORefNo = vDet.BankDORefNo;
                $scope.beData.DODate = new Date(vDet.BankDODate);
                $scope.beData.BankQuotationTranId = vDet.BankQuotationTranId;
                $timeout(function () {
                    $scope.getVehilceDetails();
                });
            } else {
                $scope.beData.BankName = '';
                $scope.beData.BankBranch = '';               
                $scope.beData.Narration = '';
                $scope.beData.BankDOTranId = null;
                $scope.beData.Price = 0;
                alert(res.data.ResponseMSG + ' ' + $scope.beData.RefNo);
                $scope.beData.RefNo = '';
                $('#txtBankDORefNo').focus();
            }


        }, function (reason) {
            alert('Failed' + reason);
        });
    }

    $scope.getVehilceDetails = function () {

        if ($scope.beData.EngineNo) {
            if ($scope.beData.EngineNo.length == 0)
                return;
        } else
            return;

        $http({
            method: 'GET',
            url: base_url + "Inventory/Transaction/getVehicleDetailsByEngNo?engineNo=" + $scope.beData.EngineNo,
            dataType: "json"
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                var vDet = res.data.Data;
                $scope.beData.ChassisNo = vDet.ChessisNo;
                $scope.beData.RegdNo = vDet.RegdNo;
                $scope.beData.Model = vDet.Model;
                $scope.beData.Color = vDet.Color;
                $scope.beData.MFGYear = vDet.MFGYear;
                $scope.beData.SalesAllotmentTranId = vDet.TranId;
                $scope.beData.PartyLedgerId = vDet.PartyLedgerId;
            } else {
                $scope.ClearVehicleDet();
                alert(res.data.ResponseMSG);
                $('#txtEngineNo').focus();
            }


        }, function (reason) {
            alert('Failed' + reason);
        });
    }
    $scope.Clear = function () {

        $('input[type=file]').val(null);

        var vid = $scope.beData.VoucherId;
        var cid = $scope.beData.CostClassId;
        $scope.beData = {
            TranId: 0,
            BankQuotationTranId: null,
            QuotationNo: '',
            VoucherId: vid,
            CostClassId: cid,
            AutoVoucherNo: 0,
            AutoManualNo: '',
            VoucherDate: new Date(),
            VoucherDateDet: new Date(),
            BankName: '',
            BankBranch: '',
            PartyName: '',
            PartyAddress: '',
            MobileNo: '',
            Model: '',
            Narration: '',
            Price: 0,
            DiscountAmt: 0,
            TotalAmount: 0,
            DoRefNo: '',
            BankAcNo: '',
            AttechFiles: []
        };

        $timeout(function () {
            $scope.getVoucherNo();
        });

        //$('#txtQuotationNo').focus();
        $('#cboVoucherType').focus();
    }

    $scope.SearchDataColl = [];
    $scope.SearchData = function () {

        $scope.loadingstatus = 'running';
        showPleaseWait();
        $scope.paginationOptions.TotalRows = 0;

        var sCol = $scope.paginationOptions.SearchColDet;

        var para = {
            voucherType: VoucherType,
            filter: {
                DateFrom: null,
                DateTo: null,
                PageNumber: $scope.paginationOptions.pageNumber,
                RowsOfPage: $scope.paginationOptions.pageSize,
                SearchCol: (sCol ? sCol.value : ''),
                SearchVal: $scope.paginationOptions.SearchVal,
                SearchType: (sCol ? sCol.searchType : 'text')
            }
        };

        $http({
            method: 'POST',
            url: base_url + "Inventory/Transaction/GetTransactionLst",
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

    $scope.ReSearchData = function (pageInd) {
        if (pageInd && pageInd >= 0)
            $scope.paginationOptions.pageNumber = pageInd;
        else if (pageInd == -1)
            $scope.paginationOptions.pageNumber = 1;

        $scope.loadingstatus = 'running';
        showPleaseWait();
        $scope.paginationOptions.TotalRows = 0;
        var sCol = $scope.paginationOptions.SearchColDet;

        var para = {
            voucherType: VoucherType,
            filter: {
                DateFrom: null,
                DateTo: null,
                PageNumber: $scope.paginationOptions.pageNumber,
                RowsOfPage: $scope.paginationOptions.pageSize,
                SearchCol: (sCol ? sCol.value : ''),
                SearchVal: $scope.paginationOptions.SearchVal,
                SearchType: (sCol ? sCol.searchType : 'text')
            }
        };

        $http({
            method: 'POST',
            url: base_url + "Inventory/Transaction/GetTransactionLst",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            $scope.loadingstatus = 'stop';
            hidePleaseWait();

            if (res.data.IsSuccess && res.data.Data) {
                $scope.SearchDataColl = res.data.Data;
                $scope.paginationOptions.TotalRows = res.data.TotalCount;

            } else
                alert(res.data.ResponseMSG);

        }, function (reason) {
            alert('Failed' + reason);
        });
    }

    $scope.ValidLedAllocationColl = [];
    $scope.IsValidTran = function () {
        $scope.ValidLedAllocationColl = [];
        if ($scope.IsValidData() == true) {

            $scope.loadingstatus = "running";
            showPleaseWait();

            $http({
                method: 'POST',
                url: base_url + "Global/IsValidVoucher",
                headers: { 'Content-Type': undefined },

                transformRequest: function (data) {

                    var formData = new FormData();
                    formData.append("EntityId", EntityId);
                    formData.append("jsonData", angular.toJson(data.jsonData));
                    return formData;
                },
                data: { jsonData: $scope.GetData() }
            }).then(function (res) {

                $scope.loadingstatus = "stop";
                hidePleaseWait();
                if (res.data.IsSuccess == true) {
                    if (res.data.Data && res.data.Data.length > 0) {
                        $scope.ValidLedAllocationColl = JSON.parse(res.data.Data);
                        $('#frmMDLLedAllocation').modal('show');
                    } else {
                        Swal.fire(res.data.ResponseMSG);
                    }
                } else {
                    Swal.fire(res.data.ResponseMSG);
                }
            }, function (errormessage) {
                hidePleaseWait();
                $scope.loadingstatus = "stop";
            });

        }
    }


    $scope.TranRelation = {};
    $scope.ShowTransactionRelation = function () {

        $scope.TranRelation = {};
        if ($scope.beData.TranId > 0) {

            $scope.loadingstatus = "running";
            showPleaseWait();

            var para = {
                TranId: $scope.beData.TranId,
                VoucherType: VoucherType,
            };

            $http({
                method: 'POST',
                url: base_url + "Global/GetTranRelation",
                dataType: "json",
                data: JSON.stringify(para)
            }).then(function (res1) {
                $scope.loadingstatus = "stop";
                hidePleaseWait();
                if (res1.data.IsSuccess && res1.data.Data) {
                    var tranData = res1.data.Data;
                    if (tranData.length > 0) {
                        $scope.TranRelation.Parent = res1.data.Data[0];
                        $scope.TranRelation.ChieldColl = [];
                        angular.forEach(tranData, function (td) {
                            if (td.LevelId > 1)
                                $scope.TranRelation.ChieldColl.push(td);
                        });

                        $('#frmMDLTranRelation').modal('show');
                    }

                }
            }, function (reason) {
                Swal.fire('Failed' + reason);
            });


        }
    }

    $scope.AuditLogColl = [];
    $scope.ShowAuditLog = function () {

        $scope.AuditLogColl = {};
        if ($scope.beData.TranId > 0) {

            $scope.loadingstatus = "running";
            showPleaseWait();

            GlobalServices.getAuditLog(EntityId, $scope.beData.TranId).then(function (res1) {
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
	
    $scope.CopyData = null;
    $scope.CopyTran = function () {
        $scope.CopyData = null;
        if ($scope.beData) {
            if ($scope.beData.TranId > 0)
            {
                $scope.CopyData = $scope.GetData();
                $scope.CopyData.TranId = 0;
            }
        }
    }
    $scope.PasteTran = function () {
        if ($scope.CopyData) {
            $scope.ClearData();
            $timeout(function () {
                $scope.SetData($scope.CopyData);
                $scope.CopyData = null;
                //$scope.getVoucherNo();
            });            
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
    $scope.ShowPersonalImg = function (item) {
        $scope.viewImg = {
            ContentPath: '',
            FileType: null
        };

        if (item.DocPath && item.DocPath.length > 0) {
            $scope.viewImg.ContentPath = item.DocPath;
            $scope.viewImg.FileType = 'pdf';  // Assuming DocPath is for PDFs
            document.getElementById('pdfViewer').src = item.DocPath;
            $('#PersonalImg').modal('show');
        } else if (item.PhotoPath && item.PhotoPath.length > 0) {
            $scope.viewImg.ContentPath = item.PhotoPath;
            $scope.viewImg.FileType = 'image';  // Assuming PhotoPath is for images
            $('#PersonalImg').modal('show');
        } else if (item.File) {
            var blob = new Blob([item.File], { type: item.File?.type });
            $scope.viewImg.ContentPath = URL.createObjectURL(blob);
            $scope.viewImg.FileType = item.File.type.startsWith('image/') ? 'image' : 'pdf';

            if ($scope.viewImg.FileType === 'pdf') {
                document.getElementById('pdfViewer').src = $scope.viewImg.ContentPath;
            }

            $('#PersonalImg').modal('show');
        } else {
            Swal.fire('No Image Found');
        }
    };

});