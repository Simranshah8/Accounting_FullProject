app.controller('HMSVoucher', function ($scope, $filter, $http, $timeout, GlobalServices) {
    $scope.Title = 'HMSVoucher';
    var glSrv = GlobalServices;
    $scope.onBtExportCSV = function () {
        var params = {
            fileName: 'HMSVoucher.csv',
            sheetName: 'HMSVoucher'
        };
        $scope.gridOptions.api.exportDataAsCsv(params);
    }
    $scope.onFilterTextBoxChanged = function () {
        $scope.gridOptions.api.setQuickFilter($scope.search);
    }
    $scope.LoadData = function () {
        $('.select2').select2();
        $scope.loadingstatus = "stop";
        $scope.confirmMSG = GlobalServices.getConfirmMSG();
        $scope.perPageColl = GlobalServices.getPerPageList();
        $scope.currentPages = {
            HMSVoucher: 1
        };
        $scope.searchData = {
            HMSVoucher: ''
        };
        $scope.perPage = {
            HMSVoucher: GlobalServices.getPerPageRow(),
        };
        $scope.NumberingMethodColl = [
            { id: 1, text: 'Auto' },
            { id: 2, text: 'Manual' },
            { id: 2, text: 'None' },
        ];
        $scope.VoucherTypeColl = [
            { id: 1, text: 'OutPatient' },
            { id: 2, text: 'InPatient' },
            { id: 3, text: 'Billing' },
            { id: 4, text: 'CashDeposit' },
            { id: 5, text: 'Discharge' },
            { id: 6, text: 'ReVisitOutPatient' },
            { id: 7, text: 'Billing Return' },
            { id: 8, text: 'Cash Received' },
            { id: 9, text: 'Lab Report Generate' },
            { id: 10, text: 'Lab Test' },
            { id: 11, text: 'Cash Return' },
            { id: 13, text: 'OPD Return' },
            { id: 14, text: 'Emergency Register' },
            { id: 15, text: 'OPD Register' },
            { id: 16, text: 'BillingMemo' },
            { id: 17, text: 'BillingMemoReturn' },
            { id: 18, text: 'DischargeReturn' },
            { id: 19, text: 'InPatientReturn' },
        ];
      
        $scope.CostClassList=[];
        $http({
            method: 'Get',
            url: base_url + "Hospital/Creation/GetAllCostClass",
            dataType: "json"
        }).then(function (res) {
            $scope.loadingstatus = 'stop';
            hidePleaseWait();
            if (res.data.IsSuccess && res.data.Data) {
                $scope.CostClassList = res.data.Data;
            } else
                alert(res.data.ResponseMSG);
        }, function (reason) {
            alert('Failed' + reason);
        });

        $scope.AccountingVoucherTypeList = [];
        $http({
            method: 'Get',
            url: base_url + "Hospital/Creation/GetAllAccountingVoucherTypes",
            dataType: "json"
        }).then(function (res) {
            $scope.loadingstatus = 'stop';
            hidePleaseWait();
            if (res.data.IsSuccess && res.data.Data) {
                $scope.AccountingVoucherTypeList = res.data.Data;
            } else
                alert(res.data.ResponseMSG);
        }, function (reason) {
            alert('Failed' + reason);
        });




        $scope.newDet =
        {
            VoucherName: '',
            VoucherType: null,
            NumberingMethod: null,
            StartNumber: '',
            NumericalPartWidth: '',
            SendSMSAfterSave: false,
            PrefilZero: false,
            PrintVoucherAfterSaving: false,
            PrintVoucherAfterModify: false,
            AllowAutoPrintOnDefaultPrinter: false,
            AllowDiscount: false,
            UseCommonNarration: false,
            AllowDiscountEachRow: false,
            CanEntryDateChange: false,
            NoOfCopies: '',
            TaxRate: '',
            Doctorcompulsory: false,
            NoOfTemplates: '',
            ValidateTender: false,
            Prefix: '',
            Suffix: '',
            AllowSchame: false,
            AllowSchameEachRow: false,
            IsCashBilling: false,
            AccVoucherType: false,
            CostClassId: null,
            CashLedgerId: null,
            GHTLedgerId: null,
            AllowDoctorSelectionEachRow: false,
            CreditLedgerId: null,
            DonorLedgerId: null,
            CommissionOtherDoctor: false,
            AllowMemoBilling: false,
            Mode: 'Save'
        }

        $scope.columnDefs = [
            { headerName: "SNo.", width: 100, valueGetter: "node.rowIndex + 1", cellStyle: { textAlign: "center" }, sortable: false, filter: false },
            { field: "VoucherName", headerName: "VoucherName", minWidth: 400, filter: 'agTextColumnFilter', flex: 5, cellStyle: { 'textAlign': 'left' } },
            { field: "VoucherType", headerName: "VoucherType", minWidth: 120, filter: 'agTextColumnFilter', flex: 1, cellStyle: { 'textAlign': 'left' } },
            { field: "NumberingMethodValue", headerName: "NumberingMethod", minWidth: 300, filter: 'agTextColumnFilter', flex: 3, cellStyle: { 'textAlign': 'left' } },
            {
                headerName: "Action", pinned: 'right',
                width: 100,
                cellRenderer: function (params) {
                    let eDiv = document.createElement('div');
                    eDiv.innerHTML = `
                    <button class="btn btn-info btn-sm edit-btn" title="Edit">
                    <i class='fas fa-pencil-alt'></i>
                    </button>
                    <button class="btn btn-danger btn-sm delete-btn" title="Delete">
                    <i class='fas fa-trash'></i>
                    </button>`;

                    let scope = angular.element(document.getElementById('ActionDiv')).scope();
                    // EDIT CLICK
                    eDiv.querySelector(".edit-btn").addEventListener("click", function () {
                        scope.GetHMSVoucherById(params.data);
                        scope.$apply();
                    });
                    // DELETE CLICK
                    eDiv.querySelector(".delete-btn").addEventListener("click", function () {
                        scope.DelHMSVoucher(params.data);
                        scope.$apply();
                    });
                    return eDiv;
                }
            }
        ];

        $scope.gridOptions = {
            defaultColDef: {
                filter: true,
                resizable: true,
                sortable: true
            },
            enableSorting: true,
            multiSortKey: 'ctrl',
            enableColResize: true,
            overlayLoadingTemplate: "Loading..",
            overlayNoRowsTemplate: "No Records found",
            rowSelection: 'multiple',
            columnDefs: $scope.columnDefs,
            rowData: null,
            filter: true,
            enableFilter: true,
        };

        // Initialize grid after DOM is ready
        $timeout(function () {
            var eGridDiv = document.querySelector('#datatable');
            new agGrid.Grid(eGridDiv, $scope.gridOptions);
        });
        $timeout(function () {
            GlobalServices.getListState(EntityId, $scope.gridOptions);
        });
        //end Daily Biometric Attendance
        $scope.GetHMSVoucher();

    };

    $scope.saveRptListState = function () {
        GlobalServices.saveRptListState(EntityId, $scope.gridOptions);
    };
    $scope.ClearFields = function () {
        $scope.newDet =
        {
            VoucherName: '',
            VoucherType: null,
            NumberingMethod: null,
            StartNumber: '',
            NumericalPartWidth: '',
            SendSMSAfterSave: false,
            PrefilZero: false,
            PrintVoucherAfterSaving: false,
            PrintVoucherAfterModify: false,
            AllowAutoPrintOnDefaultPrinter: false,
            AllowDiscount: false,
            UseCommonNarration: false,
            AllowDiscountEachRow: false,
            CanEntryDateChange: false,
            NoOfCopies: '',
            TaxRate: '',
            Doctorcompulsory: false,
            NoOfTemplates: '',
            ValidateTender: false,
            Prefix: '',
            Suffix: '',
            AllowSchame: false,
            AllowSchameEachRow: false,
            IsCashBilling: false,
            AccVoucherType: false,
            CostClassId: null,
            CashLedgerId: null,
            GHTLedgerId: null,
            AllowDoctorSelectionEachRow: false,
            CreditLedgerId: null,
            DonorLedgerId: null,
            CommissionOtherDoctor: false,
            AllowMemoBilling: false,
            Mode: 'Save'
        };
    }

    $scope.GetHMSVoucher = function () {
        $scope.loadingstatus = 'running';
        showPleaseWait();
        $http({
            method: 'POST',
            url: base_url + "Hospital/Creation/GetAllHMSVoucher",
            dataType: "json"
        }).then(function (res) {
            $scope.loadingstatus = 'stop';
            hidePleaseWait();
            if (res.data.IsSuccess && res.data.Data) {
                $scope.DataColl = res.data.Data;
                $scope.gridOptions.api.setRowData($scope.DataColl);
            } else
                alert(res.data.ResponseMSG);
        }, function (reason) {
            alert('Failed' + reason);
        });

    }

    $scope.IsValidHMSVoucher = function () {
        //if ($scope.newMethods.Name.isEmpty()) {
        //    Swal.fire("Please ! Enter Product Name");
        //    return false;
        //}
        //else
        return true;
    }

    $scope.SaveUpdateHMSVoucher = function () {
        if ($scope.IsValidHMSVoucher() == true) {
            if ($scope.confirmMSG.Accept == true) {
                var saveModify = $scope.newDet.Mode;
                Swal.fire({
                    title: 'Do you want to' + saveModify + 'the current data?',
                    showCancelButton: true,
                    confirmButtonText: saveModify,
                }).then((result) => {
                    if (result.isConfirmed) {
                        $scope.CallSaveUpdateHMSVoucher();
                    }
                });
            }
            else
                $scope.CallSaveUpdateHMSVoucher();
        }
    };

    $scope.CallSaveUpdateHMSVoucher = function () {
        $scope.loadingstatus = 'running';
        showPleaseWait();
        $http({
            method: 'POST',
            url: base_url + "Hospital/Creation/SaveHMSVoucher",
            headers: { 'content-Type': undefined },
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
                $scope.ClearFields();
                $scope.GetHMSVoucher();
            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
        });
    }

    $scope.GetHMSVoucherById = function (newDet) {
        $scope.loadingstatus = "running";
        var para = {
            VoucherId: newDet.VoucherId
        };
        $http({
            method: 'POST',
            url: base_url + "Hospital/Creation/GetHMSVoucherById",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $timeout(function () {
                    $scope.newDet = res.data.Data;
                    $scope.newDet.Mode = 'Modify';
                    $('#custom-tabs-four-profile-tab').tab('show');
                });
            } else
                Swal.fire(res.data.ResponseMSG);
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    }

    $scope.DelHMSVoucher = function (refData, ind) {
        Swal.fire({
            title: 'Are you sure to delete selected HMS Voucher:-' + refData.VoucherName,
            showCancelButton: true,
            confirmButtonText: 'Delete',
        }).then((result) => {
            if (result.isConfirmed) {
                $scope.loadingstatus = "running";
                showPleaseWait();
                var para = {
                    VoucherId: refData.VoucherId
                };
                $http({
                    method: 'POST',
                    url: base_url + "Hospital/Creation/DelHMSVoucher",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingstatus = "stop";
                    Swal.fire(res.data.ResponseMSG);
                    if (res.data.IsSuccess) {
                        $scope.GetHMSVoucher();
                    }
                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }
        });
    }
});