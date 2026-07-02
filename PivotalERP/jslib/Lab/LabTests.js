app.controller('LabTests', function ($scope, $filter, $http, $timeout, GlobalServices) {
    $scope.Title = 'Lab Test';
    $scope.onBtExportCSV = function () {
        var params = {
            fileName: 'LabTest.csv',
            sheetName: 'LabTest'
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
            LabTest: 1
        };
        $scope.searchData = {
            LabTest: ''
        };
        $scope.perPage = {
            LabTest: GlobalServices.getPerPageRow(),
        };

        $scope.ReportTemplateList = [];
        $http({
            method: 'POST',
            url: base_url + "Lab/Transaction/GetAllLabReportTemplate",
            dataType: "json"
        }).then(function (res) {

            $scope.loadingstatus = 'stop';
            hidePleaseWait();

            if (res.data.IsSuccess && res.data.Data) {
                $scope.ReportTemplateList = res.data.Data;
            } else
                alert(res.data.ResponseMSG);

        }, function (reason) {
            alert('Failed' + reason);
        });

        $scope.LabCategoryList = [];
        $http({
            method: 'POST',
            url: base_url + "Lab/Creation/GetAllLabCategory",
            dataType: "json"
            //data:JSON.stringify(para)
        }).then(function (res) {
            $scope.loadingstatus = 'stop';
            hidePleaseWait();
            if (res.data.IsSuccess && res.data.Data) {
                $scope.LabCategoryList = res.data.Data;
            } else
                alert(res.data.ResponseMSG);
        }, function (reason) {
            alert('Failed' + reason);
        });

        $scope.newDet =
        {
            TestCode: '',
            TestName: '',
            Alias: '',
            Mode: 'Save',
            ReportingName: '',
            DepartmentId: null,
            LabCategoryId: null,
            OrderPriorityId: null,
            ResultTypeId: null,
            ReportTemplateId: null,
            DefaultSpecimenId: null,
            DefaultMethodId: null,
            DefaultContainerId: null,
            DefaultUnitId: null,
            StatusId: null,
            TAT: '',
            BasePrice: '',
            DisplaySequence: '',
            LONIC: '',
            Interpretation: '',
            IsProfileTest: false,
            IsActive: false,
            IsOutSources: false,
            LabComponentsColl: [],
            ReferenceRulesColl: [],
        }
        $scope.GetAllLabTests();
        $scope.newDet.LabComponentsColl.push({ });
        $scope.columnDefs = [
            { headerName: "SNo.", width: 80, valueGetter: "node.rowIndex + 1", cellStyle: { textAlign: "center" }, sortable: false, filter: false },
            { field: "TestCode", headerName: "Code", filter: 'agTextColumnFilter', width: 100, cellStyle: { 'textAlign': 'left' } },
            { field: "TestName", headerName: "Name", filter: 'agTextColumnFilter', flex: 2, cellStyle: { 'textAlign': 'left' } },
            { field: "Alias", headerName: "Alias", filter: 'agTextColumnFilter', flex: 1.2, cellStyle: { 'textAlign': 'left' } },
            { field: "ReportPrintName", headerName: "Reporting Name", filter: 'agTextColumnFilter', flex: 2, cellStyle: { 'textAlign': 'left' } },
            { field: "Charge", headerName: "Charge", filter: 'agnumberColumnFilter', flex: 1.2, cellStyle: { 'textAlign': 'Right' } },
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
                        scope.GetLabTestById(params.data);
                        scope.$apply();
                    });
                    // DELETE CLICK
                    eDiv.querySelector(".delete-btn").addEventListener("click", function () {
                        scope.DeleteLabTest(params.data);
                        scope.$apply();
                    });
                    return eDiv;
                }
            }
        ];

        // ag-Grid options
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
            //pagination: true,
            //paginationPageSize: 2,//$scope.perPage,
            //paginationPageSizeSelector: $scope.perPageColl
        };
        // Initialize grid after DOM is ready
        $timeout(function () {
            var eGridDiv = document.querySelector('#datatable');
            new agGrid.Grid(eGridDiv, $scope.gridOptions);
        });
        //end Daily Biometric Attendance


        $scope.DepartmentList = [];
        $http({
            method: 'POST',
            url: base_url + "Lab/Creation/GetAllLabDepartment",
            dataType: "json"
        }).then(function (res) {

            $scope.loadingstatus = 'stop';
            hidePleaseWait();
            if (res.data.IsSuccess && res.data.Data) {
                $scope.DepartmentList = res.data.Data;
            } else
                Swal.fire(res.data.ResponseMSG);

        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
        $scope.GenderColl = [
            { id: 1, text: 'Male' },
            { id: 2, text: 'Female' },
            { id: 3, text: 'Both' },

        ];
        $scope.OrderPriorityColl = [
            { id: 1, text: 'Normal (Routine Priority)' },
            { id: 2, text: 'Urgent (High Priority)' },
            { id: 3, text: 'Stat (Immediate Priority)' },

        ];
        $scope.OrderPriorityColl = [
            { id: 1, text: 'Normal (Routine Priority)' },
            { id: 2, text: 'Urgent (High Priority)' },
            { id: 3, text: 'Stat (Immediate Priority)' },

        ];
        $scope.ResultTypeColl = [
            { id: 1, text: 'Numeric' },
            { id: 2, text: 'Text' },
            { id: 3, text: 'Categorical' },
            { id: 4, text: 'Boolean' },
            { id: 5, text: 'Image' }
        ];
        //$scope.ReportTemplateColl = [
        //    { id: 1, text: 'numeric_panel' },
        //    { id: 2, text: 'urine_rm' },
        //    { id: 3, text: 'qualitative_with_notes' },
        //    { id: 4, text: 'time_series' }
        //];
        $scope.TypeListColl = [
            { id: 1, text: 'Numeric' },
            { id: 2, text: 'Text' },
            { id: 3, text: 'Categorical' },
            //{ id: 4, text: 'Boolean' },
            //{ id: 5, text: 'image' }
        ];
        $scope.ModeColl = [
            { id: 1, text: 'TestWise' },
            { id: 2, text: 'Component Wise' },
        ];


        $scope.AnswerSetList = [];
        $http({
            method: 'POST',
            url: base_url + "Lab/Creation/GetAllLabAnswerSetValue",
            dataType: "json"
        }).then(function (res) {
            $scope.loadingstatus = 'stop';
            hidePleaseWait();
            if (res.data.IsSuccess && res.data.Data) {
                $scope.AnswerSetList = res.data.Data;
            } else
                Swal.fire(res.data.ResponseMSG);
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        $scope.SpecimenColl = [];
        $http({
            method: 'Post',
            url: base_url + "Lab/Creation/GetAllSpecimenType",
            dataType: "json"
        }).then(function (res) {
            $scope.loadingstatus = 'stop';
            hidePleaseWait();
            if (res.data.IsSuccess && res.data.Data) {
                $scope.SpecimenColl = res.data.Data;
            } else
                Swal.fire(res.data.ResponseMSG);
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });


        $scope.ContainerColl = [];
        $http({
            method: 'POST',
            url: base_url + "Lab/Creation/GetAlllab_ContainerType",
            dataType: "json",
        }).then(function (res) {
            $scope.loadingstatus = 'stop';
            hidePleaseWait();
            if (res.data.IsSuccess && res.data.Data) {
                $scope.ContainerColl = res.data.Data;
            } else
                Swal.fire(res.data.ResponseMSG);
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });


        $scope.MethodColl = [];
        $http({
            method: 'POST',
            url: base_url + "Lab/Creation/GetAlllab_Method",
            dataType: "json"
        }).then(function (res) {
            $scope.loadingstatus = 'stop';
            hidePleaseWait();
            if (res.data.IsSuccess && res.data.Data) {
                $scope.MethodColl = res.data.Data;
            } else
                Swal.fire(res.data.ResponseMSG);
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        $scope.UnitColl = [];
        $http({
            method: 'POST',
            url: base_url + "Lab/Creation/GetAlllab_Unit",
            dataType: "json"
        }).then(function (res) {
            $scope.loadingstatus = 'stop';
            hidePleaseWait();
            if (res.data.IsSuccess && res.data.Data) {
                $scope.UnitColl = res.data.Data;
            } else
                Swal.fire(res.data.ResponseMSG);
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
        $scope.StatusColl = [
            { id: 1, text: 'Active' },
            { id: 2, text: 'Retired' }
        ];
        /* $scope.GetAllLabTests();*/
    };


    $scope.ClearFields = function () {
        $scope.newDet =
        {
            TestCode: '',
            TestName: '',
            Alias: '',
            ReportPrintName: '',
            LabCategoryId: null,
            DepartmentId: null,
            OrderPriorityId: null,
            ResultTypeId: null,
            ReportTemplateId: null,
            DefaultSpecimenId: null,
            DefaultMethodId: null,
            DefaultContainerId: null,
            DefaultUnitId: null,
            ProfileMemberTestId: null,
            TAT: '',
            BasePrice: '',
            DisplaySequence: '',
            LONIC: '',
            Interpretation: '',
            IsProfileTest: false,
            IsActive: false,
            IsOutSources: false,
            LabComponentsColl: [],
            ReferenceRulesColl: [],
            DefaultSpecimenColl: [],
            DefaultSpecimen: [],
            Mode: 'Save',
        }
        setTimeout(function () {
            $('.select2').val(null).trigger('change');
        }, 50);
        $scope.GetAutoTestCode();
        $scope.newDet.LabComponentsColl.push({ });
    }

    $scope.ProductSelectionChange = function (itemDet) {
        var det = itemDet.productDetail;
        $scope.newDet.ProductId = det.ProductId;
    }

    $scope.SaveLabTest = function () {
        if ($scope.confirmMSG.Accept == true) {
            var saveModify = $scope.beData.Mode;
            Swal.fire({
                title: 'Do you want to' + saveModify + 'the current data?',
                showCancelButton: true,
                confirmButtonText: saveModify,
            }).then((result) => {
                if (result.isConfirmed) {
                    $scope.CallSaveUpdateLabTest();
                }
            });
        }
        else
            $scope.CallSaveUpdateLabTest();
    };

    $scope.CallSaveUpdateLabTest = function () {
        $scope.loadingstatus = 'running';
        showPleaseWait();
        if ($scope.newDet.DefaultSpecimenColl) {
            $scope.newDet.DefaultSpecimen = $scope.newDet.DefaultSpecimenColl.toString();
        } else {
            $scope.newDet.DefaultSpecimen = "";
        }
        if ($scope.newDet.ProfileMemberTestIdColl) {
            $scope.newDet.ProfileMemberTestId = $scope.newDet.ProfileMemberTestIdColl.toString();
        } else
            $scope.newDet.ProfileMemberTestId = "";

        $http({
            method: 'POST',
            url: base_url + "Lab/Creation/SavelabTest",
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
                $scope.GetAllLabTests();
                $scope.GetAutoTestCode();
            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
        });
    }

    $scope.GetAllLabTests = function () {
        $scope.LabTestList = [];
        $scope.loadingstatus = 'running';
        showPleaseWait();
        $http({
            method: 'POST',
            url: base_url + "Lab/Creation/GetAllLabTest",
            dataType: "json"
        }).then(function (res) {
            $scope.loadingstatus = 'stop';
            hidePleaseWait();
            if (res.data.IsSuccess && res.data.Data) {
                $scope.LabTestList = res.data.Data;
                $scope.DataColl = res.data.Data;
                $scope.gridOptions.api.setRowData($scope.DataColl);
            } else
                Swal.fire(res.data.ResponseMSG);
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    }
    $scope.GetLabTestById = function (refData) {
        $scope.loadingstatus = "running";
        var para = {
            LabTestId: refData.LabTestId
        };
        $http({
            method: 'POST',
            url: base_url + "Lab/Creation/GetLabTestById",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $timeout(function () {
                    $scope.newDet = res.data.Data;
                    $scope.newDet.ProductId = res.data.Data.ProductId;
                    $scope.newDet.Mode = 'Modify';
                    if ($scope.newDet.DefaultSpecimen) {
                        $scope.newDet.DefaultSpecimenColl = $scope.newDet.DefaultSpecimen.split(',').map(Number);
                    }
                        if ($scope.newDet.ProfileMemberTestId) {
                            $scope.newDet.ProfileMemberTestIdColl = $scope.newDet.ProfileMemberTestId.split(',').map(Number);
                        setTimeout(function () {
                            $('.select2').trigger('change');
                        }, 100);
                    }
                    //for child table
                    if (!$scope.newDet.LabComponentsColl || $scope.newDet.LabComponentsColl.length == 0) {
                        $scope.newDet.LabComponentsColl = [];
                        $scope.newDet.LabComponentsColl.push({});
                    }
                    //end
                    $('#custom-tabs-four-profile-tab').tab('show');
                });
                $timeout(function () {
                    $('.select2').each(function () {
                        if ($(this).hasClass('select2-hidden-accessible')) {
                            $(this).select2('destroy');
                        }
                        $(this).select2({ width: '100%' });
                    });
                }, 0);
            } else
                Swal.fire(res.data.ResponseMSG);
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    }
    $scope.DeleteLabTest = function (refData, ind) {
        Swal.fire({
            title: 'Are you sure to delete selected Test:-' + refData.TestName,
            showCancelButton: true,
            confirmButtonText: 'Delete',
        }).then((result) => {
            if (result.isConfirmed) {
                $scope.loadingstatus = "running";
                showPleaseWait();
                var para = {
                    LabTestId: refData.LabTestId
                };
                $http({
                    method: 'POST',
                    url: base_url + "Lab/Creation/DelLabTest",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingstatus = "stop";
                    Swal.fire(res.data.ResponseMSG);
                    if (res.data.IsSuccess) {
                        $scope.GetAllLabTests();
                    }
                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }
        });
    }
    $scope.GetAutoTestCode = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();
        $http({
            method: 'POST',
            url: base_url + "Lab/Creation/GetAutoTestCode",
            dataType: "json"

        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                var vDet = res.data.Data;
                $scope.newDet.TestCode = vDet.RId;
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    }
  
    //for child table
    $scope.AddPHDDetails = function (ind) {
        if ($scope.newDet.LabComponentsColl) {
            if ($scope.newDet.LabComponentsColl.length > ind + 1) {
                $scope.newDet.LabComponentsColl.splice(ind + 1, 0, {
                    ReferenceRangeColl: []
                })
            } else {
                $scope.newDet.LabComponentsColl.push({
                    ReferenceRangeColl: []
                })
            }
        }
    };
    $scope.delPHDDetails = function (ind) {
        if ($scope.newDet.LabComponentsColl) {
            if ($scope.newDet.LabComponentsColl.length > 1) {
                $scope.newDet.LabComponentsColl.splice(ind, 1);
            }
        }
    };
    $scope.RefRules = function (pDet) {
        if (!pDet.DisplaySequence || pDet.DisplaySequence === '' || pDet.DisplaySequence === null) {
            return; 
        }
        $scope.activeIndex = $scope.newDet.LabComponentsColl.indexOf(pDet);
        $scope.currentComponent = pDet;
        $scope.currentDisplaySequence = pDet.DisplaySequence;
        var existingRefRules = null;
        if (pDet.ReferenceRangeColl && pDet.ReferenceRangeColl.length > 0) {
            existingRefRules = pDet.ReferenceRangeColl;
        } else {
            existingRefRules = angular.copy($scope.defaultRefRules);
        }
        $scope.newDet.LabComponentsColl[$scope.activeIndex].ReferenceRangeColl = existingRefRules;
        $('#RefRules').modal('show');
    };

  
    $scope.SaveRefRules = function () {
        if (!$scope.currentDisplaySequence) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Display Sequence is missing!'
            });
            return;
        }
        var refRulesData = $scope.newDet.LabComponentsColl[$scope.activeIndex].ReferenceRangeColl;
        // Filter out empty rows (optional - remove if you want to keep all rows)
        var validRefRules = refRulesData.filter(function (rule) {
            //return rule.NormalLow || rule.NormalHigh || rule.CriticalLow ||
            //    rule.CriticalHigh || rule.TextualReference || rule.ReferenceRangeDescription ||
            //    rule.AgeMin || rule.AgeMax;
            return true;
        });

        if (validRefRules.length === 0) {
            validRefRules = angular.copy($scope.defaultRefRules);
        }
        $scope.newDet.LabComponentsColl[$scope.activeIndex].ReferenceRangeColl = validRefRules;
        angular.forEach(validRefRules, function (rule) {
            rule.DisplaySequence = $scope.currentDisplaySequence;
            rule.LabTestComponentId = $scope.currentComponent.LabTestComponentId || null; 
        });
        $('#RefRules').modal('hide');
    };
    $scope.defaultRefRules  = [
        {id:1, Gender: 'General(M/F)', GenderDescription: '-', AgeMin: '', AgeMax: '', NormalLow: '', NormalHigh: '', CriticalLow: '', CriticalHigh: '', TextualReference: '', ReferenceRangeDescription: '' },
        {id:2, Gender: 'Male', GenderDescription: 'Adult', AgeMin: '', AgeMax: '', NormalLow: '', NormalHigh: '', CriticalLow: '', CriticalHigh: '', TextualReference: '', ReferenceRangeDescription: '' },
        {id:3, Gender: 'Female', GenderDescription: 'Adult', AgeMin: '', AgeMax: '', NormalLow: '', NormalHigh: '', CriticalLow: '', CriticalHigh: '', TextualReference: '', ReferenceRangeDescription: '' },
        {id:4, Gender: 'Male', GenderDescription: 'Child', AgeMin: '', AgeMax: '', NormalLow: '', NormalHigh: '', CriticalLow: '', CriticalHigh: '', TextualReference: '', ReferenceRangeDescription: '' },
        {id:5, Gender: 'Female', GenderDescription: 'Child', AgeMin: '', AgeMax: '', NormalLow: '', NormalHigh: '', CriticalLow: '', CriticalHigh: '', TextualReference: '', ReferenceRangeDescription: '' },
        {id:6, Gender: 'Female', GenderDescription: 'Pregnant', AgeMin: '', AgeMax: '', NormalLow: '', NormalHigh: '', CriticalLow: '', CriticalHigh: '', TextualReference: '', ReferenceRangeDescription: '' }
    ];

});