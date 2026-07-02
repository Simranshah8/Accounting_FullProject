
app.controller('AddResult', function ($scope, $filter, $http, $timeout, $compile, GlobalServices) {
    $scope.Title = 'AddResult';
    var glSrv = GlobalServices;
    $scope.onBtExportCSV = function () {
        var params = {
            fileName: 'AddResult.csv',
            sheetName: 'AddResult'
        };
        $scope.AddResultTypeOptions.api.exportDataAsCsv(params);
    }
    $scope.onFilterTextBoxChanged = function () {
        $scope.AddResultTypeOptions.api.setQuickFilter($scope.search);
    }

    $scope.LoadData = function () {
        $('.select2').select2();
        $scope.loadingstatus = "stop";
        $scope.confirmMSG = GlobalServices.getConfirmMSG();
        $scope.perPageColl = GlobalServices.getPerPageList();
        $scope.currentPages = {
            AddResult: 1
        };
        $scope.searchData = {
            AddResult: ''
        };
        $scope.perPage = {
            AddResult: GlobalServices.getPerPageRow(),
        };
        //added 
        $scope.GetAllHeaderFooterConfig();
        $scope.config = {};
        $scope.GetCompanyDetails();
        $scope.GetReportTemplateById();
        //end
        $scope.GetAllDoctor();
        $scope.GetAlllabTechnician();
        $scope.showChooseDate = true;
        $scope.AddResultView = false;
        $scope.PrintResult = false;
        $scope.beData = {
            Value: null,
            RequestDate_TMP: new Date()
        };
        $scope.newData = {
            SelectedDoctorId: null,
            SelectedDoctorId2: null,
            SelectedDoctorId3: null
        };

        $scope.TempConfig = {
            IsUnitCol: false,
            IsMethod: false,
            IsRemark: false,
            IsAbnormalRow: false
        };

        // ==== Column Definitions ====
        $scope.AddResultTypeColumnsDefs = [
            { headerName: "Patient Id", field: "PatientId", filter: 'agTextColumnFilter', flex: 1, minWidth: 120, cellStyle: { textAlign: "left" } },
            { headerName: "Patient Name", field: "PatientName", filter: 'agTextColumnFilter', flex: 1.5, minWidth: 150, cellStyle: { textAlign: "left" } },
            {
                headerName: "Age/Sex", field: "AgeGender",
                valueGetter: function (params) {
                    return params.data.Age + "/" + params.data.Gender;
                }, filter: 'agTextColumnFilter', flex: 1, minWidth: 100, cellStyle: { textAlign: "left" }
            },
            { headerName: "Phone Number", field: "MobileNo", filter: 'agNumberColumnFilter', flex: 1, minWidth: 120, cellStyle: { textAlign: "left" } },
            { headerName: "Test Name", field: "TestName", filter: 'agTextColumnFilter', flex: 1.2, minWidth: 140, cellStyle: { textAlign: "left" } },
            { headerName: "Group", field: "TestGroupName", filter: 'agTextColumnFilter', flex: 1, minWidth: 120, cellStyle: { textAlign: "left" } },
            { headerName: "Department", field: "Department", filter: 'agTextColumnFilter', flex: 1, minWidth: 120, cellStyle: { textAlign: "left" } },
            /*    { headerName: "Order Priority", field: "OrderPriorityName", filter: 'agTextColumnFilter', flex: 1, minWidth: 120, cellStyle: { textAlign: "left" } },*/
            { headerName: "Bar Code", field: "BarCodeNumber", filter: 'agTextColumnFilter', flex: 1.2, minWidth: 120, cellStyle: { textAlign: "left" } },
            {
                headerName: "Action",
                field: "icon",
                width: 80, pinned: 'right',
                cellRenderer: function (params) {
                    let eDiv = document.createElement('div');
                    eDiv.className = "btn-group mt-1";
                    eDiv.innerHTML = `
                <button class="btn btn-info btn-sm ViewDetail-btn mr-1" title="Add Result"> Add Result </button>
               
    `;
                    let scope = angular.element(document.getElementById('ActionDiv')).scope();
                    eDiv.querySelector(".ViewDetail-btn").addEventListener("click", function () {
                        $scope.$apply(function () {
                            $scope.AddResult(params.data);
                        });
                    });
                    return eDiv;
                }
            }
        ];


        $scope.AddResultTypeOptions = {
            defaultColDef: {
                filter: true,
                resizable: true,
                sortable: true,
                width: 100
            },
            columnDefs: $scope.AddResultTypeColumnsDefs,
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
        $scope.eGridDiv = document.querySelector('#AddResultTypeData');
        new agGrid.Grid($scope.eGridDiv, $scope.AddResultTypeOptions);
        $scope.AddResultTypeOptions.onFirstDataRendered = function () {
            $timeout(function () {
                $compile(angular.element($scope.eGridDiv).contents())($scope);
            });
        };

        $scope.newFilter =
        {
            FromDate_TMP: new Date(),
            ToDate_TMP: new Date()
        }
    };


    $scope.BackToList = function () {
        $scope.AddResultView = false;
        $scope.showChooseDate = true;
        $scope.newData.SelectedDoctorId = null;
        $scope.newData.SelectedDoctorId2 = null;
        $scope.newData.SelectedDoctorId3 = null;
    };

    $scope.BackToListInPrint = function () {
        $scope.AddResultView = false;
        $scope.showChooseDate = true;
        $scope.PrintResult = false;
        $scope.newData.SelectedDoctorId = null;
        $scope.newData.SelectedDoctorId2 = null;
        $scope.newData.SelectedDoctorId3 = null;
    };

    //$scope.Print = function (BarCodeNumber) {
    //    $scope.setNepaliReportingDate();  
    //    $scope.AddResultView = false;
    //    $scope.PrintResult = true;
    //    $scope.showChooseDate = false;
    //    $scope.GenerateBarCodeimg(BarCodeNumber);
    //};

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



    $scope.GetAllAddResult = function () {
        $scope.loadingstatus = 'running';
        showPleaseWait();
        var para = {
            FromDate: $filter('date')($scope.newFilter.FromDateDet.dateAD, 'yyyy-MM-dd'),
            ToDate: $filter('date')($scope.newFilter.ToDateDet.dateAD, 'yyyy-MM-dd'),
            GroupIdColl: ($scope.newFilter.GroupId ? $scope.newFilter.GroupId.toString() : ''),
        };
        $http({
            method: 'POST',
            url: base_url + "Lab/Transaction/GetAllAddResult",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            $scope.loadingstatus = 'stop';
            hidePleaseWait();
            if (res.data.IsSuccess && res.data.Data) {
                $scope.DataColl = res.data.Data.filter(function (item) {
                    return item.IsPendingComplete === false;
                });
                /* $scope.DataColl = res.data.Data;*/
                $scope.AddResultTypeOptions.api.setRowData($scope.DataColl);
            } else
                Swal.fire(res.data.ResponseMSG);
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    }


    $scope.SaveAddResult = function (BarCodeNumber) {
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
                        AutoNumber: $scope.newData.AutoNumber,
                        DisplaySequence: item.DisplaySequence,
                        isCompleted: item.isCompleted,
                        Value: item.Value,
                        Notes: $scope.newData.Notes,
                        DoctorId: $scope.newData.SelectedDoctorId,
                        DoctorId2: $scope.newData.SelectedDoctorId2,
                        DoctorId3: $scope.newData.SelectedDoctorId3,
                        ReportingDate: new Date(),
                        ComponentGroup: item.ComponentGroup
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
            url: base_url + "Lab/Transaction/SaveAddResult",
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

                if ($scope.newData.SelectedDoctorId) {
                    $scope.GetDoctorById($scope.newData.SelectedDoctorId, 1);
                }

                if ($scope.newData.SelectedDoctorId2) {
                    $scope.GetDoctorById($scope.newData.SelectedDoctorId2, 2);
                }
                if ($scope.newData.SelectedDoctorId3) {
                    $scope.GetDoctorById($scope.newData.SelectedDoctorId3, 3);
                }
                //$scope.AddResultView = false;
                //$scope.showChooseDate = true;
                /* $scope.GetAllAddResult();*/
                $scope.GetAllAddResult();
                $scope.GenerateBarCodeimg(BarCodeNumber);
                $scope.AddResultView = false;
                $scope.PrintResult = true;
                $scope.showChooseDate = false;
            }
        }, function (err) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            Swal.fire("Error saving data: " + err.statusText);
        });
    };

    $scope.AddResult = function (params) {
        $scope.AddResultView = true;
        $scope.showChooseDate = false;
        $scope.PrintResult = false;
        $scope.loadingstatus = "running";
        showPleaseWait();
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
            BarCodeNumber: det.BarCodeNumber,
            CollectionDate: det.CollectionDate,
            DoctorName: det.DoctorName
        };
        var para = {
            Age: $scope.newData.Age,
            Gender: $scope.newData.Gender,
            BarCodeNumber: $scope.newData.AutoNumber
        };
        $scope.AddResultList = [];
        $http({
            method: 'POST',
            url: base_url + "Lab/Transaction/GetAddResult",
            data: para
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {

                if ($scope.TempConfig.IsTestNameOrComponent == true) {
                    // ===== GROUP BY TEST GROUP =====
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
                            // LOOP COMPONENT ROWS
                            angular.forEach(testNameObj.ChieldColl, function (comp) {
                                //  Only AnswerSet components
                                if (comp.TypeId === 1 && comp.Value) {
                                    comp.Value = parseFloat(comp.Value);
                                }
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


    $scope.AddResultList = [{}]
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

    $scope.GetAllDoctor = function () {
        $scope.DoctorList = [];
        $scope.loadingstatus = 'running';
        showPleaseWait();
        $http({
            method: 'POST',
            url: base_url + "Hospital/Creation/GetAllDoctor",
            dataType: "json"
        }).then(function (res) {
            $scope.loadingstatus = 'stop';
            hidePleaseWait();
            if (res.data.IsSuccess && res.data.Data) {
                $scope.DoctorList = res.data.Data;
                $scope.gridOptions.api.setRowData($scope.DoctorList);

            } else
                alert(res.data.ResponseMSG);
        }, function (reason) {
            alert('Failed' + reason);
        });
    }

    $scope.GetAlllabTechnician = function () {
        $scope.TechnicianList = [];
        $http({
            method: 'POST',
            url: base_url + "Lab/Creation/GetAllLabTechnician",
            dataType: "json"
        }).then(function (res) {
            $scope.loadingstatus = 'stop';
            hidePleaseWait();

            if (res.data.IsSuccess && res.data.Data) {
                $scope.TechnicianList = res.data.Data;
                $scope.gridOptions.api.setRowData($scope.TechnicianList);
            } else
                alert(res.data.ResponseMSG);

        }, function (reason) {
            alert('Failed' + reason);
        });
    }

    $scope.GetDoctorById = function (DoctorId, index) {
        $scope.loadingstatus = "running";
        showPleaseWait();
        var para = {
            DoctorId: DoctorId
        };
        $http({
            method: 'POST',
            url: base_url + "Hospital/Creation/GetDoctorById",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                if (index === 1) {
                    $scope.Doctor1 = res.data.Data;
                }
                else if (index === 2) {
                    $scope.Doctor2 = res.data.Data;
                }
                else if (index === 3) {
                    $scope.Doctor3 = res.data.Data;
                }
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
            $('#custom-tabs-four-profile-tab').tab('show');
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    };


    $scope.PrintAddResult = function () {
        var $original = $('#PrintResult');
        if ($original.length === 0) {
            Swal.fire("Nothing to print");
            return;
        }
        var $printContainer = $('<div id="printContainer"></div>');
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
                $scope.newCompanyDetails = res.data.Data;
                angular.copy(res.data.Data, $scope.CompanyDet);
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    };

    $scope.TestPrint = function () {
        $scope.CompanyDet = {
            Name: "Test Hospital Pvt. Ltd.",
            Address: "Kathmandu, Nepal",
            PhoneNo: "01-4444444",
            EmailId: "info@testhospital.com",
            PanVatNo: "PAN: 123456789",
            CompanyLogoPath: ""
        };
        $scope.config = {
            IsHeader: true,
            IsPatientId: true,
            IsPatientName: true,
            IsAge: true,
            IsGender: true,
            IsSampleCollectionAt: true,
            IsSampleNo: true,
            IsReferredBy: true,
            IsReportingDate: true,
            IsBarCode: true,
            IsAllSignature: true,
            IsSignature1: true,
            IsSignature2: true,
            IsFooter: true,
            HeaderHeight: 100,
            FooterHeight: 100
        };
        $scope.newData = {
            PatientId: "PID-2023",
            PatientName: "John Doe",
            Age: "45 Y",
            Gender: "Male",
            PatientAddress: "Baneshwor",
            MobileNo: "9800000000",
            CollectionDate: "2023-11-01 10:00 AM",
            AutoNumber: "SAM-001",
            DoctorName: "Dr. Smith",
            BarCode: "SAM-001",
            Notes: "Sample Clinical Note for testing."
        };
        $scope.beData = {
            CollectionMitti: "2080-07-15"
        };
        $scope.TempConfig = {
            InvestigationName: "Investigation",
            ResultName: "Result",
            UnitColName: "Unit",
            RefRangeColName: "Ref. Range",
            MethodColName: "Method",
            RemarkColName: "Remarks",
            IsUnitCol: true,
            IsReferenceRange: true,
            IsMethod: true,
            IsRemark: true,
            IsTestNameOrComponent: true,
            IsClinicalNotes: true,
            IsGroupRow: true
        };
        $scope.Doctor1 = { DoctorSignData: "", Name: "Dr. Alpha" };
        $scope.Doctor2 = { DoctorSignData: "", Name: "Dr. Beta" };
        $scope.Doctor3 = { DoctorSignData: "", Name: "Dr. Gamma" };

        $scope.AddResultList = [
            {
                TestGroupName: "BIOCHEMISTRY",
                ChieldColl: [
                    {
                        TestName: "LIVER FUNCTION TEST",
                        Description: "Sample description",
                        ChieldColl: [
                            { Component: "Bilirubin Total", Value: "1.2", Unit: "mg/dL", NormalLow: "0.2", NormalHigh: "1.2", MethodName: "Jendrassik", Remarks: "" },
                            { Component: "Bilirubin Direct", Value: "0.4", Unit: "mg/dL", NormalLow: "0.0", NormalHigh: "0.4", MethodName: "Jendrassik", Remarks: "" }
                        ]
                    }
                ]
            }
        ];

        $scope.AddResultView = false;
        $scope.PrintResult = true;
        $scope.showChooseDate = false;
    };

});


