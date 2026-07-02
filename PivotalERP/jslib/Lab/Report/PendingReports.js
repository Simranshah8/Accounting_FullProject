
app.controller('PendingReport', function ($scope, $filter, $http, $timeout, $compile, GlobalServices) {
    $scope.Title = 'PendingReport';
    var glSrv = GlobalServices;
    $scope.onBtExportCSV = function () {
        var params = {
            fileName: 'PendingReport.csv',
            sheetName: 'PendingReport'
        };
        $scope.PendingReportTypeOptions.api.exportDataAsCsv(params);
    }
    $scope.onFilterTextBoxChanged = function () {
        $scope.PendingReportTypeOptions.api.setQuickFilter($scope.search);
    }
    $scope.onBtExportCSVs = function () {
        var params = {
            fileName: 'PendingReport.csv',
            sheetName: 'PendingReport'
        };
        $scope.PendingReportTypeOptions.api.exportDataAsCsv(params);
    }
    $scope.onFilterTextBoxChange = function () {
        $scope.PendingReportTypeOptions.api.setQuickFilter($scope.searchs);
    }

    $scope.LoadData = function () {
        $('.select2').select2();
        $scope.loadingstatus = "stop";
        $scope.confirmMSG = GlobalServices.getConfirmMSG();
        $scope.perPageColl = GlobalServices.getPerPageList();
        $scope.currentPages = {
            PendingReport: 1
        };
        $scope.searchData = {
            PendingReport: ''
        };
        $scope.perPage = {
            PendingReport: GlobalServices.getPerPageRow(),
        };
        //added 
        $scope.config = {};
        $scope.GetAllHeaderFooterConfig();
        $scope.GetCompanyDetails();
        $scope.GetReportTemplateById();
        //end
        $scope.showChooseDate = true;
        $scope.ViewDetail = false;
        $scope.PrintResult = false;
        $scope.beData = {
            Value: 0,
            VerificationRemarks: ''
        };

        $scope.TempConfig = {
            IsUnitCol: false,
            IsMethod: false,
            IsRemark: false,
            IsAbnormalRow: false
        };

        $scope.newData = {
            SelectedDoctorId: null
        };

        // ==== Column Definitions ====
        $scope.PendingReportColumnsDefs = [
            { headerName: "Patient Id", field: "PatientId", filter: 'agTextColumnFilter', flex: 1, minWidth: 120, cellStyle: { textAlign: "left" } },
            { headerName: "Patient Name", field: "PatientName", filter: 'agTextColumnFilter', flex: 1.5, minWidth: 150, cellStyle: { textAlign: "left" } },
            {
                headerName: "Age/Sex", field: "AgeGender",
                valueGetter: function (params) {
                    return params.data.Age + "/" + params.data.Gender;
                }, filter: 'agTextColumnFilter', flex: 1, minWidth: 100, cellStyle: { textAlign: "left" }
            },
            { headerName: "Phone Number", field: "MobileNo", filter: 'agTextColumnFilter', flex: 1, minWidth: 120, cellStyle: { textAlign: "left" } },
            { headerName: "Test Name", field: "TestName", filter: 'agTextColumnFilter', flex: 1.2, minWidth: 140, cellStyle: { textAlign: "left" } },
            { headerName: "Group", field: "TestGroupName", filter: 'agTextColumnFilter', flex: 1, minWidth: 120, cellStyle: { textAlign: "left" } },
            { headerName: "Department", field: "Department", filter: 'agTextColumnFilter', flex: 1, minWidth: 120, cellStyle: { textAlign: "left" } },
            /*    { headerName: "Order Priority", field: "OrderPriorityName", filter: 'agTextColumnFilter', flex: 1, minWidth: 120, cellStyle: { textAlign: "left" } },*/
            { headerName: "Bar Code", field: "BarCode", filter: 'agTextColumnFilter', flex: 1.2, minWidth: 120, cellStyle: { textAlign: "left" } },
            { headerName: "Verification Remarks", field: "VerificationRemarks", colId: "verificationReCol", filter: 'agTextColumnFilter', flex: 1.2, minWidth: 120, cellStyle: { textAlign: "left" } },

            {
                headerName: "Status", field: "IsVerified", colId: "statusCol", filter: 'agBooleanColumnFilter', flex: 1.2, minWidth: 120, cellStyle: { textAlign: "left" }, valueFormatter: params => params.value ? "Verified" : "Pending"
            },
            {
                headerName: "Action",
                field: "icon",
                width: 80, pinned: 'right',
                cellRenderer: function (params) {
                    let eDiv = document.createElement('div');
                    eDiv.className = "btn-group mt-1";
                    eDiv.innerHTML = `
                <button class="btn btn-info btn-sm ViewDetail-btn mr-1" title="Add Result"> View Detail </button> `;
                    let scope = angular.element(document.getElementById('ActionDiv')).scope();
                    eDiv.querySelector(".ViewDetail-btn").addEventListener("click", function () {
                        $scope.$apply(function () {
                            $scope.ShowViewDetail(params.data);
                        });

                    });
                    return eDiv;
                }
            }
        ];


        $scope.PendingReportTypeOptions = {
            defaultColDef: {
                filter: true,
                resizable: true,
                sortable: true,
                width: 100
            },
            onGridReady: function (params) {
                $scope.gridApi = params.api;
                $scope.gridColumnApi = params.columnApi;
                params.columnApi.setColumnVisible('statusCol', false);
                params.columnApi.setColumnVisible('verificationReCol', false);

            },
            columnDefs: $scope.PendingReportColumnsDefs,
            rowSelection: 'multiple',
            suppressHorizontalScroll: false,
            enableColResize: true,
            rowData: null,
            filter: true,
            enableFilter: true,
            enableSorting: true,
            overlayLoadingTemplate: "Please Click the Load Bottom to display the data",
            rowSelection: 'multiple',
            suppressHorizontalScroll: false,
            alignedGrids: [],
            enableFilter: true
        };
        $scope.eGridDiv = document.querySelector('#PendingReportTypeData');
        new agGrid.Grid($scope.eGridDiv, $scope.PendingReportTypeOptions);
        $scope.PendingReportTypeOptions.onFirstDataRendered = function () {
            $timeout(function () {
                $compile(angular.element($scope.eGridDiv).contents())($scope);
            });
        };
        $scope.newFilter =
        {
            FromDate_TMP: new Date(),
            ToDate_TMP: new Date(),
            StatusId: 1
        }
    };


    $scope.ClearFields = function () {
        $scope.loadingstatus = "stop";
        $scope.beData =
        {
            Mode: 'Save',
        };
        $('#txtName').focus();
    }

    $scope.BackToListInPrint = function () {
        $scope.ViewDetail = false;
        $scope.showChooseDate = true;
        $scope.PrintResult = false;
        $scope.beData.VerificationRemarks = '';
        $scope.GetAllPendingReport();
    };

    $scope.$watch('newFilter.StatusId', function (val) {
        if ($scope.gridColumnApi) {
            $scope.gridColumnApi.setColumnVisible('statusCol', val === 0);
        }
    });

    $scope.$watch('newFilter.StatusId', function (val) {
        if ($scope.gridColumnApi) {
            $scope.gridColumnApi.setColumnVisible('verificationReCol', val === 2);
        }
    });

    $scope.GenerateBarCodeimg = function (code) {
        var para = {
            code: code,
            //label: code,
        };
        return $http({
            method: 'POST',
            url: base_url + "Lab/Transaction/GenerateBarCodeImg",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.BarCodeImg = res.data.Data;
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed: ' + reason);
        });
    }

    $scope.GetAllPendingReport = function () {
        $scope.loadingstatus = 'running';
        showPleaseWait();
        var para = {
            FromDate: $filter('date')($scope.newFilter.FromDateDet.dateAD, 'yyyy-MM-dd'),
            ToDate: $filter('date')($scope.newFilter.ToDateDet.dateAD, 'yyyy-MM-dd'),
            GroupIdColl: ($scope.newFilter.GroupId ? $scope.newFilter.GroupId.toString() : ''),
            Status: $scope.newFilter.StatusId
        };
        $http({
            method: 'POST',
            url: base_url + "Lab/Transaction/GetAllPendingReport",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            $scope.loadingstatus = 'stop';
            hidePleaseWait();
            if (res.data.IsSuccess && res.data.Data) {
                $scope.DataColl = res.data.Data.filter(function (item) {
                    return item.IsPendingComplete === true;
                });
                /* $scope.DataColl = res.data.Data;*/
                $scope.PendingReportTypeOptions.api.setRowData($scope.DataColl);
            } else
                Swal.fire(res.data.ResponseMSG);
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    }


    $scope.ShowViewDetail = function (params) {
        if ($scope.newFilter.StatusId == 2 || params.IsVerified) {
            $scope.PrintResult = false;
            $scope.ViewDetail = true;
            $scope.showChooseDate = false;
        } else {
            $scope.PrintResult = true;
            $scope.ViewDetail = false;
            $scope.showChooseDate = false;
        }
        $scope.loadingstatus = "running";
        showPleaseWait();
        $scope.Doctor = {}
        var det = params;
        $scope.newData = {
            BillingNumber: det.BillingNumber || det.BillingNo,
            PatientId: det.PatientId,
            BillingId: det.BillingId,
            PatientName: det.PatientName,
            PatientAddress: det.PatientAddress,
            Age: det.Age,
            Gender: det.Gender,
            MobileNo: det.MobileNo,
            TestNameId: det.TestNameId,
            DisplaySequence: det.DisplaySequence,
            ReportTemplateId: 1,
            AutoNumber: det.AutoNumber,
            BarCode: det.BarCode,
            //BarCodeNumber: det.BarCodeNumber,
            CollectionDate: det.CollectionDate,
            DoctorName: det.DoctorName
        };
        if ($scope.newData.AutoNumber) {
            $scope.GenerateBarCodeimg($scope.newData.AutoNumber);
        }
        var para = {
            BarCodeNumber: $scope.newData.AutoNumber
        };
        $scope.AddResultList = [];
        $http({
            method: 'POST',
            url: base_url + "Lab/Transaction/GetPendingReportById",
            data: para
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.Doctor = res.data.Data[0];
                $scope.beData.VerificationRemarks = res.data.Data[0].Notes;
                var signatures = res.data.Data.map(x => x.DoctorSignature);
                $scope.beData.DoctorSignature = [...new Set(signatures)][0];

                var CollectionsMittis = res.data.Data.map(x => x.CollectionMitti);
                $scope.beData.CollectionMitti = [...new Set(CollectionsMittis)][0];
                // ===== GROUP BY TEST GROUP =====
                if ($scope.TempConfig.IsTestNameOrComponent == true) {

                    var testGroups = mx(res.data.Data).groupBy(x => ({ TestGroupName: x.TestGroupName }));
                    angular.forEach(testGroups, function (tg) {
                        var testGroupObj = {
                            TestGroupName: tg.key.TestGroupName,
                            ChieldColl: []
                        };
                        // ===== GROUP BY TEST NAME =====
                        var testNames = mx(tg.elements).groupBy(x => ({ TestName: x.TestName }));

                        angular.forEach(testNames, function (tn) {
                            var testNameObj = {
                                TestName: tn.key.TestName,
                                Description: tn.elements.length > 0 ? tn.elements[0].Description : null,
                                ChieldColl: tn.elements
                            };
                            angular.forEach(testNameObj.ChieldColl, function (comp) {
                                if (comp.TypeId === 3 && comp.AnswerSetId) {
                                    comp.ValuesNameList = [];
                                    $scope.GetLookupById(comp.AnswerSetId).then(function (values) { comp.ValuesNameList = values; });
                                }
                            });
                            testGroupObj.ChieldColl.push(testNameObj);
                        });
                        $scope.AddResultList.push(testGroupObj);
                    });
                } else {

                    // ===== GROUP BY TEST GROUP =====
                    var testGroups = mx(res.data.Data).groupBy(x => ({ TestGroupName: x.TestGroupName }));
                    angular.forEach(testGroups, function (tg) {
                        var testGroupObj = {
                            TestGroupName: tg.key.TestGroupName,
                            ChieldColl: []
                        };
                        // ===== GROUP BY COMPONENT GROUP =====
                        var componentGroups = mx(tg.elements).groupBy(x => ({ ComponentGroup: x.ComponentGroup }));
                        angular.forEach(componentGroups, function (cg) {
                            var componentGroupObj = {
                                ComponentGroup: cg.key.ComponentGroup,
                                ChieldColl: cg.elements
                            };
                            // LOOP COMPONENT ROWS
                            angular.forEach(componentGroupObj.ChieldColl, function (comp) {
                                if (comp.TypeId === 1 && comp.Value) {
                                    comp.Value = parseFloat(comp.Value);
                                }
                                if (comp.TypeId === 3 && comp.AnswerSetId) {
                                    comp.ValuesNameList = [];
                                    $scope.GetLookupById(comp.AnswerSetId)
                                        .then(function (values) { comp.ValuesNameList = values; });
                                }
                            });

                            testGroupObj.ChieldColl.push(componentGroupObj);
                        });
                        $scope.AddResultList.push(testGroupObj);
                    });

                }
                $scope.GetReportTemplateById();
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (err) {
            hidePleaseWait();
            Swal.fire('Failed : ' + err);
        });
    };


    $scope.GetLookupById = function (AnswerSetId) {
        return $http({
            method: 'POST',
            url: base_url + "Lab/Creation/GetLabAnswerSetValueById",
            data: { LookupId: AnswerSetId }
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data && res.data.Data.LookUpsColl) {
                return res.data.Data.LookUpsColl.map(x => x.ValuesName);
            }
            return [];
        });
    };


    $scope.GetReportTemplateById = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();
        var para = {
            TemplateTypeId: 1
        };
        $http({
            method: 'POST',
            url: base_url + "Lab/Transaction/GetLabReportTemplateById",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.TempConfig = res.data.Data;
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
            $('#custom-tabs-four-profile-tab').tab('show');
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    };



    $scope.VerifyPendingReport = function (BarCodeNumber) {
        var dataToSave = [];
        angular.forEach($scope.AddResultList, function (grp) {
            angular.forEach(grp.ChieldColl, function (test) {
                angular.forEach(test.ChieldColl, function (item) {
                    dataToSave.push({
                        TestGroupId: item.TestGroupId,
                        TestNameId: item.TestNameId,
                        PatientId: $scope.newData.PatientId,
                        BillingId: $scope.newData.BillingId,
                        UnitId: item.UnitId || null,
                        MethodId: item.MethodId || null,
                        Component: item.Component,
                        UnitName: item.Unit || null,
                        MethodName: item.MethodName || null,
                        Remarks: item.Remarks,
                        NormalLow: item.NormalLow,
                        NormalHigh: item.NormalHigh,
                        BarCodeNumber: $scope.newData.AutoNumber,
                        DisplaySequence: item.DisplaySequence,
                        isCompleted: item.isCompleted,
                        Value: item.Value,
                        Notes: $scope.newData.Notes,
                        DoctorId: $scope.newData.DoctorId,
                        DoctorId2: $scope.newData.DoctorId2,
                        DoctorId3: $scope.newData.DoctorId3,
                        ReportingDate: new Date(),
                        IsVerified: 1,
                        VerificationRemarks: $scope.beData.VerificationRemarks
                    });
                });
            });
        });

        if (dataToSave.length === 0) {
            Swal.fire("No data to save.");
            return;
        }
        showPleaseWait();
        $scope.loadingstatus = "running";
        $http({
            method: 'POST',
            url: base_url + "Lab/Transaction/VerifyPendingReport",
            headers: { 'Content-Type': undefined },
            transformRequest: function (data) {
                var formData = new FormData();
                formData.append("jsonData", angular.toJson(data.jsonData));
                return formData;
            },
            data: { jsonData: dataToSave }
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            Swal.fire(res.data.ResponseMSG);

            if (res.data.IsSuccess == true) {
                $scope.ViewDetail = true;
                $scope.PrintResult = false;
                $scope.GenerateBarCodeimg(BarCodeNumber);
                $scope.ViewDetail = true;
                $scope.PrintResult = false;
                $scope.showChooseDate = false;
            }
        }, function (err) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            Swal.fire("Error saving data: " + err.statusText);
        });
    };


    $scope.PrintPendingReport = function () {
        var $original = $('#ViewDetail');
        if ($original.length === 0) {
            Swal.fire("Nothing to print");
            return;
        }
        var $printContainer = $('<div id="ViewDetail"></div>');
        var $clone = $original.clone();
        $clone.removeAttr('id');
        $printContainer.append($clone);
        $printContainer.printThis({
            importCSS: true,
            importStyle: true,
            printDelay: 500,
            pageTitle: "Lab Result Report",
            removeInline: false, // CRITICAL: Keep inline styles
            removeInlineSelector: "*", // Don't remove any inline styles
            afterPrint: function () {
                $printContainer.remove();
            }
        });
    };


    $scope.DateChange = function (timeline, be) {
        const today = new Date();

        if (timeline == 1) {
            $scope.newFilter.FromDate_TMP = today;
            $scope.newFilter.ToDate_TMP = today;
        }
        else if (timeline == 2) {
            const lastWeek = new Date();
            lastWeek.setDate(today.getDate() - 7);
            $scope.newFilter.FromDate_TMP = lastWeek;
            $scope.newFilter.ToDate_TMP = today;
        }
        else if (timeline == 3) {
            const lastMonth = new Date();
            lastMonth.setMonth(today.getMonth() - 1);

            $scope.newFilter.FromDate_TMP = lastMonth;
            $scope.newFilter.ToDate_TMP = today;
        }
        else if (timeline == 4) {
            const last3Months = new Date();
            last3Months.setMonth(today.getMonth() - 3);

            $scope.newFilter.FromDate_TMP = last3Months;
            $scope.newFilter.ToDate_TMP = today;
        }
    }

    $scope.isOutOfRange = function (row) {
        if (row.Value === null || row.Value === '' ||
            row.NormalLow === null || row.NormalHigh === null) {
            return false;
        }
        var value = parseFloat(row.Value);
        var low = parseFloat(row.NormalLow);
        var high = parseFloat(row.NormalHigh);
        if (isNaN(value) || isNaN(low) || isNaN(high)) {
            return false;
        }
        return value < low || value > high;
    };

    $scope.getColSpan = function () {
        let cols = 3; // Component, Value, Range (always visible)
        if ($scope.TempConfig.IsUnitCol) cols++;
        if ($scope.TempConfig.IsMethod) cols++;
        if ($scope.TempConfig.IsRemark) cols++;
        return cols;
    };

    //added 
    $scope.GetAllHeaderFooterConfig = function () {
        $scope.HeaderFooterConfigList = [];
        $scope.loadingstatus = 'running';
        showPleaseWait();
        $http({
            method: 'POST',
            url: base_url + "Lab/Transaction/GetAllHeaderFooterConfig",
            dataType: "json"
        }).then(function (res) {
            $scope.loadingstatus = 'stop';
            hidePleaseWait();
            if (res.data.IsSuccess && res.data.Data) {
                console.log(res.data.Data);
                angular.copy(res.data.Data, $scope.config);
            } else
                Swal.fire(res.data.ResponseMSG);
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    }


    $scope.GetCompanyDetails = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();
        $scope.CompanyDet = {};
        $http({
            method: 'POST',
            url: base_url + "Setup/Security/GetCompanyDet",
            dataType: "json"
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                //$scope.newCompanyDetails = res.data.Data;
                angular.copy(res.data.Data, $scope.CompanyDet);
                if (!$scope.CompanyDet.CompanyLogoPath) {
                    $scope.CompanyDet.CompanyLogoPath = base_url +"Attachments/Hospital/fall-back-logo.png"
                }
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    };

});


