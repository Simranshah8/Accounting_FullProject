app.controller('ReportTemplate', function ($scope, $filter, $http, $timeout, GlobalServices) {
    $scope.Title = 'ReportTemplate';
    var glSrv = GlobalServices;

    $scope.onBtExportCSV = function () {
        var params = {
            fileName: 'ReportTemplate.csv',
            sheetName: 'ReportTemplate'
        };
        $scope.gridOptions.api.exportDataAsCsv(params);
    }
    $scope.onFilterTextBoxChanged = function () {
        $scope.gridOptions.api.setQuickFilter($scope.search);
    }

    $scope.LoadData = function () {
        $scope.loadingstatus = "stop";

        $scope.confirmMSG = GlobalServices.getConfirmMSG();
        $scope.perPageColl = GlobalServices.getPerPageList();


        $scope.currentPages = {
            ReportTemplate: 1

        };

        $scope.searchData = {
            ReportTemplate: ''

        };

        $scope.perPage = {
            ReportTemplate: GlobalServices.getPerPageRow(),

        };


        $scope.TemplateTypeColl = [
            { id: 1, text: 'Normal' },
            { id: 2, text: 'Word Editor' }
        ];

        $scope.newDet = {
            TemplateTypeId: 1,
            TemplateName: '',
            IsGrouprRow: false,
            IsReferenceRange: false,
            IsUnitCol: false,
            IsRemark: false,
            FlagStyle: 1,
            IsAbnormalRow: false,
            IsClinicalNotes: false,
            IsInvestigation: true,
            IsResult: true,
            IsMethod: false,
            IsRemark: false,
            TemplateTypeId: 1,
            GroupName: 'Group Name',
            InvestigationName: 'Investigation',
            ResultName: 'Result',
            RefRangeColName: 'Reference Range',
            MethodColName: 'Method',
            RemarkColName: 'Remarks',
            UnitColName: 'Unit',
            IsTestNameOrComponent: false,
            Mode: 'Save'
        };

        $scope.newHead = {
            IsHeader: false,
            IsPatientId: false,
            IsPatientName: false,
            IsSampleNo: false,
            IsAge: false,
            IsGender: false,
            IsSampleCollectDate: false,
            IsReportingDate: false,
            IsReferredBy: false,
            IsSampleCollectionAt: false,
            IsBarCode: false,
            IsQR: false,
            IsSignature1: false,
            IsSignature2: false,
            SignatureLebel1: '',
            SignatureLebel2: '',
            Signature2: '',
            Signature1: '',
            HeaderHeight: 80,
            FooterNote: '',
            ShowNotes: false,
            IsFooter: false,
            FooterHeight: 50,
            IsAllSignature: false,
        };

        $scope.columnDefs = [
            { headerName: "SNo.", width: 70, valueGetter: "node.rowIndex + 1", cellStyle: { textAlign: "center" }, sortable: false, filter: false },
            { field: "TemplateName", headerName: "Name", filter: 'agTextColumnFilter', width: 220 },
            { field: "IsGrouprRow", headerName: "Group Row", filter: 'agTextColumnFilter', width: 220 },
            { field: "IsReferenceRange", headerName: "Reference Range", filter: 'agTextColumnFilter', width: 220 },
            { field: "IsUnitCol", headerName: "Unit", filter: 'agTextColumnFilter', width: 220 },
            { field: "IsRemark", headerName: "Remarks", filter: 'agTextColumnFilter', width: 220 },
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
                        $scope.GetReportTemplateById(params.data);
                        $scope.$apply();
                    });
                    // DELETE CLICK
                    eDiv.querySelector(".delete-btn").addEventListener("click", function () {
                        $scope.DelReportTemplate(params.data);
                        $scope.$apply();
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
            enableFilter: true
        };
        $timeout(function () {
            var eGridDiv = document.querySelector('#datatable');
            new agGrid.Grid(eGridDiv, $scope.gridOptions);
        });

        $scope.GetReportTemplateById();
    }

    $scope.ClearSignature1 = function () {
        $timeout(function () {
            $scope.$apply(function () {
                $scope.newHead.Signature1Data = null;
                $scope.newHead.Signature1_TMP = [];
            });
        });
        $('#Signature1').attr('src', '');
    };


    $scope.ClearSignature2 = function () {
        $timeout(function () {
            $scope.$apply(function () {
                $scope.newHead.Signature2Data = null;
                $scope.newHead.Signature2_TMP = [];
            });
        });
        $('#Signature2').attr('src', '');
    };

    $scope.saveRptListState = function () {
        GlobalServices.saveRptListState(EntityId, $scope.gridOptions);
    };

    $scope.ClearFields = function () {
        $scope.newDet = {
            TemplateName: '',
            IsGrouprRow: false,
            IsReferenceRange: false,
            IsUnitCol: false,
            IsRemark: false,
            FlagStyle: 1,
            IsAbnormalRow: false,
            IsClinicalNotes: false,
            IsInvestigation: true,
            IsResult: true,
            IsMethod: false,
            IsRemark: false,
            TemplateTypeId: 1,
            GroupName: 'Group Name',
            InvestigationName: 'Investigation',
            ResultName: 'Result',
            RefRangeColName: 'Reference Range',
            MethodColName: 'Method',
            RemarkColName: 'Remarks',
            UnitColName: 'Unit',
            IsTestNameOrComponent: false,
            Mode: 'Save'
        };

    };

    $scope.ClearConfigFields = function () {
        $scope.ClearSignature1();
        $scope.ClearSignature2();
        $scope.newHead = {
            IsHeader: false,
            IsPatientId: false,
            IsPatientName: false,
            IsSampleNo: false,
            IsAge: false,
            IsGender: false,
            IsSampleCollectDate: false,
            IsReportingDate: false,
            IsReferredBy: false,
            IsSampleCollectionAt: false,
            IsBarCode: false,
            IsQR: false,
            IsSignature1: false,
            IsSignature2: false,
            SignatureLebel1: '',
            SignatureLebel2: '',
            Signature2: '',
            Signature1: '',
            HeaderHeight: 80,
            FooterNote: '',
            ShowNotes: false,
            IsFooter: false,
            FooterHeight: 50,
            IsAllSignature:false,
        };

    };

    $scope.isEditingGroupName = false;
    $scope.isInvestigation = false;
    $scope.isEditingResult = false;
    $scope.isEditingRefRange = false;
    $scope.isEditingUnit = false;
    $scope.isEditingMethod = false;
    $scope.isEditingRemark = false;
    //--------------
    $scope.toggleEditGroup = function () {
        $scope.isEditingGroupName = !$scope.isEditingGroupName;
    };
    $scope.toggleEditInvestigation = function () {
        $scope.isInvestigation = !$scope.isInvestigation;
    };
    $scope.toggleResultEdit = function () {
        $scope.isEditingResult = !$scope.isEditingResult;
    };
    $scope.toggleRefRangeEdit = function () {
        $scope.isEditingRefRange = !$scope.isEditingRefRange;
    };
    $scope.toggleEditUnit = function () {
        $scope.isEditingUnit = !$scope.isEditingUnit;
    };
    $scope.toggleEditMethod = function () {
        $scope.isEditingMethod = !$scope.isEditingMethod;
    };
    $scope.toggleEditRemark = function () {
        $scope.isEditingRemark = !$scope.isEditingRemark;
    };
    //----------------
    $scope.stopEditingGroupName = function () {
        $scope.isEditingGroupName = false;
    };
    $scope.stopEditingInvestigation = function () {
        $scope.isInvestigation = false;
    };
    $scope.stopEditingResult = function () {
        $scope.isEditingResult = false;
    };
    $scope.stopEditingRefRange = function () {
        $scope.isEditingRefRange = false;
    };

    $scope.stopEditingUnit = function () {
        $scope.isEditingUnit = false;
    };

    $scope.IsValidReportTemplate = function () {
        return true;
    };
    $scope.stopEditingMethod = function () {
        $scope.isEditingMethod = false;
    };
    $scope.stopEditingRemark = function () {
        $scope.isEditingRemark = false;
    };

    $scope.SaveUpdateReportTemplate = function () {
        if ($scope.IsValidReportTemplate() === true) {
            if ($scope.confirmMSG && $scope.confirmMSG.Accept === true) {
                var saveModify = $scope.newDet.Mode;
                Swal.fire({
                    title: 'Do you want to ' + saveModify + ' the current data?',
                    showCancelButton: true,
                    confirmButtonText: saveModify,
                }).then((result) => {
                    if (result.isConfirmed) {
                        $scope.CallSaveReportTemplate();
                    }
                });
            } else {
                $scope.CallSaveReportTemplate();
            }
        }
    };

    $scope.CallSaveReportTemplate = function () {
        $scope.loadingstatus = 'running';
        showPleaseWait();
        $http({
            method: 'Post',
            url: base_url + "Lab/Transaction/SaveLabReportTemplate",
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
            if (res.data.IsSuccess === true) {
                $scope.GetReportTemplateById();
            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            Swal.fire('Save failed');
        });
    };

    $scope.GetAllReportTemplate = function () {
        debugger;
        $scope.ReportTemplateList = [];
        $scope.loadingstatus = 'running';
        showPleaseWait();

        $http({
            method: 'POST',
            url: base_url + "Lab/Transaction/GetAllLabReportTemplate",
            dataType: "json"
        }).then(function (res) {

            $scope.loadingstatus = 'stop';
            hidePleaseWait();

            if (res.data.IsSuccess && res.data.Data) {
                $scope.ReportTemplateList = res.data.Data;
                $scope.gridOptions.api.setRowData($scope.ReportTemplateList);

            } else
                alert(res.data.ResponseMSG);

        }, function (reason) {
            alert('Failed' + reason);
        });

    }


    $scope.GetReportTemplateById = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();
        //var para = {
        //    TemplateTypeId: $scope.newDet.TemplateTypeId
        //};
        $http({
            method: 'POST',
            url: base_url + "Lab/Transaction/GetLabReportTemplateById",
            dataType: "json",
        //    data: JSON.stringify(para)
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                if (res.data.Data.TranId) {
                    $scope.newDet = res.data.Data;
                    $scope.newDet.Mode = 'Modify';
                }
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    };

    $scope.DelReportTemplate = function (refData, ind) {
        Swal.fire({
            title: 'Are you sure you want to delete ' + refData.TemplateName + '?',
            showCancelButton: true,
            confirmButtonText: 'Delete',
        }).then((result) => {
            if (result.isConfirmed) {
                var para = { TranId: refData.TranId };
                $http({
                    method: 'POST',
                    url: base_url + "Lab/Transaction/DelLabReportTemplate",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingStatus = "stop";

                    Swal.fire(res.data.ResponseMSG);
                    if (res.data.IsSuccess == true) {
                        $scope.GetAllReportTemplate();
                    }
                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }

        });

    }

    $scope.IsValidHeaderFooterConfig = function () {
        return true;
    };

    $scope.IsValidHeaderFooterConfig = function () {

        return true;
    }

    $scope.SaveUpdateHeaderFooterConfig = function () {
        if ($scope.IsValidHeaderFooterConfig() == true) {
            if ($scope.confirmMSG.Accept == true) {
                var saveModify = $scope.newHead.Mode;
                Swal.fire({
                    title: 'Do you want to ' + saveModify + ' the current data?',
                    showCancelButton: true,
                    confirmButtonText: saveModify,
                }).then((result) => {
                    if (result.isConfirmed) {
                        $scope.CallSaveUpdateHeaderFooterConfig();
                    }
                });
            } else
                $scope.CallSaveUpdateHeaderFooterConfig();

        }
    };

    $scope.CallSaveUpdateHeaderFooterConfig = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();

        var Sign1 = $scope.newHead.Signature1_TMP;
        var Sign2 = $scope.newHead.Signature2_TMP;

        $http({
            method: 'POST',
            url: base_url + "Lab/Transaction/SaveHeaderFooterConfig",
            headers: { 'Content-Type': undefined },
            transformRequest: function (data) {
                var formData = new FormData();
                formData.append("jsonData", angular.toJson(data.jsonData));

                if (data.Sig1 && data.Sig1.length > 0)
                    formData.append("Sign1", data.Sig1[0]);

                if (data.sig2 && data.sig2.length > 0)
                    formData.append("Sign2", data.sig2[0]);

                return formData;
            },
            data: { jsonData: $scope.newHead, Sig1: Sign1, sig2: Sign2 }
        }).then(function (res) {

            $scope.loadingstatus = "stop";
            hidePleaseWait();

            Swal.fire(res.data.ResponseMSG);

            if (res.data.IsSuccess == true) {
                //$scope.ClearConfigFields();
                $scope.GetAllHeaderFooterConfig();
            }

        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";

        });
    }

    $scope.GetAllHeaderFooterConfig = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();
        $scope.newHead = {};
        $http({
            method: 'POST',
            url: base_url + "Lab/Transaction/GetAllHeaderFooterConfig",
            dataType: "json",
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.newHead = res.data.Data;
                $scope.newHead.originalFooterHeight = res.data.Data.FooterHeight;
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    };

    $scope.toggleFooter = function () {
        if (!$scope.newHead.IsFooter) {
            $scope.originalFooterHeight = $scope.newHead.FooterHeight;
            $scope.newHead.FooterHeight = 0;
        } else {
            // restore original height
            $scope.newHead.FooterHeight = $scope.newHead.originalFooterHeight;
        }
    };

});
