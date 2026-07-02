app.controller('SampleCollection', function ($scope, $filter, $http, $timeout, $compile, GlobalServices) {
    $scope.Title = 'SampleCollection';
    $scope.onBtExportCSV = function () {
        var params = {
            fileName: 'SampleCollection.csv',
            sheetName: 'SampleCollection'
        };
        $scope.PendingSampleTypeOptions.api.exportDataAsCsv(params);
    }
    $scope.onFilterTextBoxChanged = function () {
        $scope.PendingSampleTypeOptions.api.setQuickFilter($scope.search);
    }
    $scope.onBtExportCSVs = function () {
        var params = {
            fileName: 'CollectedSample.csv',
            sheetName: 'CollectedSample'
        };
        $scope.CollectedSampleOptions.api.exportDataAsCsv(params);
    }
    $scope.onFilterTextBoxChange = function () {
        $scope.CollectedSampleOptions.api.setQuickFilter($scope.searchs);
    }
    $scope.LoadData = function () {
        $scope.loadingstatus = "stop";
        $scope.confirmMSG = GlobalServices.getConfirmMSG();
        $scope.perPageColl = GlobalServices.getPerPageList();
        $scope.currentPages = {
            SampleCollection: 1
        };
        $scope.searchData = {
            SampleCollection: ''
        };
        $scope.perPage = {
            SampleCollection: GlobalServices.getPerPageRow(),
        };

        $scope.showChooseDate = true;
        $scope.showViewDetail = false;
        $scope.showColledtedSample = true;
        $scope.showColledtedViewDetail = false;

        $scope.GetAllHeaderFooterConfig();

        $scope.CollectionAtList = [
            { id: 1, text: 'LAB' },
            { id: 2, text: 'Home Collection' },
            { id: 3, text: 'Sample Collection Room' },
            { id: 4, text: 'OPD' },
            { id: 5, text: 'IPD' },
            { id: 6, text: 'Emergency' },
            { id: 7, text: 'ICU' },

        ];
        $scope.SampleTypeColumnsDefs = [
            { headerName: "Voucher Date", field: "VoucherMitti", filter: 'agTextColumnFilter', minWidth: 100, cellStyle: { textAlign: "left" } },
            { headerName: "Bill No", field: "BillingNumber", filter: 'agNumberColumnFilter', minWidth: 90, cellStyle: { textAlign: "left" } },
            { headerName: "Patient Id", field: "PatientId", filter: 'agNumberColumnFilter', minWidth: 90, cellStyle: { textAlign: "left" } },
            { headerName: "Patient Name", field: "PatientName", filter: 'agTextColumnFilter', flex: 1.8, minWidth: 150, cellStyle: { textAlign: "left" } },
            { headerName: "Address", field: "PatientAddress", filter: 'agTextColumnFilter', flex: 1.2, minWidth: 120, width: 150, cellStyle: { textAlign: "left" } },
            {
                headerName: "Age/Sex", field: "AgeGender",
                valueGetter: function (params) {
                    return params.data.Age + "/" + params.data.Gender;
                }, filter: 'agTextColumnFilter', flex: 1, minWidth: 100, cellStyle: { textAlign: "left" }
            },
            { headerName: "Phone Number", field: "MobileNo", filter: 'agNumberColumnFilter', flex: 1.2, minWidth: 120, cellStyle: { textAlign: "left" } },
            { headerName: "Department", field: "Department", filter: 'agTextColumnFilter', flex: 1.4, minWidth: 130, cellStyle: { textAlign: "left" } },
            { headerName: "Doctor", field: "DoctorName", filter: 'agTextColumnFilter', flex: 1, minWidth: 110, cellStyle: { textAlign: "left" } },
            {
                headerName: "Action",
                field: "icon",
                width: 90, pinned: 'right',
                cellRenderer: function (params) {
                    var eDiv = document.createElement('div');
                    eDiv.className = 'd-flex align-items-center';
                    var addResultBtn = document.createElement('button');
                    addResultBtn.className = "btn btn-info btn-sm";
                    addResultBtn.style.borderRadius = "6px";
                    addResultBtn.textContent = "View Details";
                    addResultBtn.addEventListener('click', function () {
                        $scope.$apply(function () {
                            $scope.AddResult(params.data);
                        });
                    });
                    eDiv.appendChild(addResultBtn);
                    return eDiv;
                }
            }
        ];
        $scope.PendingSampleTypeOptions = {
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
            columnDefs: $scope.SampleTypeColumnsDefs,
            rowData: null,
            filter: true,
            enableFilter: true,
        };
        $scope.eGridDiv = document.querySelector('#SampleTypeData');
        new agGrid.Grid($scope.eGridDiv, $scope.PendingSampleTypeOptions);
        $scope.PendingSampleTypeOptions.onFirstDataRendered = function () {
            $timeout(function () {
                $compile(angular.element($scope.eGridDiv).contents())($scope);
            });
        };

        // CollectedSample
        $scope.CollectedSampleColumnsDefs = [
            { headerName: "Voucher Date", field: "VoucherMitti", filter: 'agTextColumnFilter', Width: 200, cellStyle: { textAlign: "left" } },
            //{
            //    headerName: "Voucher Date", field: "VoucherMittiVoucherDate",
            //    cellRenderer: function (params) {
            //        if (!params.data) return '';
            //        return `<div> ${params.data.VoucherMitti} <span>(BS)</span><br/>  ${params.data.VoucherDate} <span>(AD)</span> </div>`;
            //    },
            //    filter: 'agTextColumnFilter',
            //    flex: 1,
            //    Width: 100,
            //    cellStyle: { textAlign: "left" }
            //},
            { headerName: "Bill No", field: "BillingNumber", filter: 'agNumberColumnFilter', Width: 80, cellStyle: { textAlign: "left" } },
            { headerName: "Patient Id", field: "PatientId", filter: 'agNumberColumnFilter', Width: 90, cellStyle: { textAlign: "left" } },

            { headerName: "Patient Name", field: "PatientName", filter: 'agTextColumnFilter', Width: 200, cellStyle: { textAlign: "left" } },
            { headerName: "Address", field: "PatientAddress", filter: 'agTextColumnFilter', Width: 120, width: 150, cellStyle: { textAlign: "left" } },
            {
                headerName: "Age/Sex", field: "AgeGender",
                valueGetter: function (params) {
                    return params.data.Age + "/" + params.data.Gender;
                }, filter: 'agTextColumnFilter', minWidth: 100, cellStyle: { textAlign: "left" }
            },
            { headerName: "Phone Number", field: "MobileNo", filter: 'agNumberColumnFilter', Width: 130, cellStyle: { textAlign: "left" } },
            { headerName: "Department", field: "Department", filter: 'agTextColumnFilter', Width: 150, cellStyle: { textAlign: "left" } },
            { headerName: "Doctor", field: "DoctorName", filter: 'agTextColumnFilter', Width: 150, cellStyle: { textAlign: "left" } },
            {
                headerName: "Action", pinned: 'right',
                width: 90,
                cellRenderer: function (params) {
                    let eDiv = document.createElement('div');
                    eDiv.innerHTML = `
                        <button class="btn btn-info btn-sm edit-btn" title="View Details">
                            <i class='fas fa-eye'></i>
                        </button>`;

                    let scope = angular.element(document.getElementById('ActionDiv')).scope();
                    // EDIT CLICK
                    eDiv.querySelector(".edit-btn").addEventListener("click", function () {
                        $scope.ViewDetails(params.data);
                        $scope.$apply();
                    });
                    return eDiv;
                }
            },


        ];
        $scope.CollectedSampleOptions = {
            defaultColDef: {
                filter: true,
                resizable: true,
                sortable: true,
              /*  width: 100*/
            },
            columnDefs: $scope.CollectedSampleColumnsDefs,
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
        // lookup the container we want the Grid to use
        $scope.eGridDiv = document.querySelector('#SampleCollectedData');
        // create the grid passing in the div to use together with the columns & data we want to use
        new agGrid.Grid($scope.eGridDiv, $scope.CollectedSampleOptions);

        $scope.CollectedSampleOptions.onFirstDataRendered = function () {
            $timeout(function () {
                $compile(angular.element($scope.eGridDiv).contents())($scope);
            });
        };

        $scope.filter =
        {
            FromDate_TMP: new Date(),
            ToDate_TMP: new Date()
        }
        $scope.newFilter =
        {
            FromDate_TMP: new Date(),
            ToDate_TMP: new Date()
        }
        $scope.GetPendingSampleCollection();
    };

    $scope.ClearFields = function () {
        $scope.loadingstatus = "stop";
        $scope.newDet =
        {
            Mode: 'Save',
        };
        $('#txtName').focus();
    }

    $scope.GetPendingSampleCollection = function () {
        $scope.loadingstatus = 'running';
        showPleaseWait();
        var dateFrom = new Date(($filter('date')(new Date(), 'yyyy-MM-dd')));
        var dateTo = new Date(($filter('date')(new Date(), 'yyyy-MM-dd')));

        if ($scope.filter.FromDateDet)
            dateFrom = new Date(($filter('date')($scope.filter.FromDateDet.dateAD, 'yyyy-MM-dd')));

        if ($scope.filter.ToDateDet)
            dateTo = new Date(($filter('date')($scope.filter.ToDateDet.dateAD, 'yyyy-MM-dd')));

        var para = {
            FromDate: dateFrom,
            ToDate: dateTo
        };
        $http({
            method: 'POST',
            url: base_url + "Lab/Transaction/GetAllSampleCollection",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            $scope.loadingstatus = 'stop';
            hidePleaseWait();
            if (res.data.IsSuccess && res.data.Data) {
                $scope.DataColl = res.data.Data.filter(function (item) {
                    return item.IsPendingComplete === false;
                });
                $scope.PendingSampleTypeOptions.api.setRowData($scope.DataColl);
            } else
                Swal.fire(res.data.ResponseMSG);
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    }

    $scope.GetCollectedSample = function () {
        $scope.loadingstatus = 'running';
        showPleaseWait();
        var para = {
            FromDate: $filter('date')($scope.newFilter.FromDateDet.dateAD, 'yyyy-MM-dd'),
            ToDate: $filter('date')($scope.newFilter.ToDateDet.dateAD, 'yyyy-MM-dd')
        };
        $http({
            method: 'POST',
            url: base_url + "Lab/Transaction/GetAllSampleCollection",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            $scope.loadingstatus = 'stop';
            hidePleaseWait();
            if (res.data.IsSuccess && res.data.Data) {
                $scope.DataColl = res.data.Data.filter(function (item) {
                    return item.IsCollected === true;
                });
                $scope.CollectedSampleOptions.api.setRowData($scope.DataColl);
            } else
                Swal.fire(res.data.ResponseMSG);
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    }

    $scope.SamplelCollectionList = [{}]
    $scope.selectAll = false;
    $scope.toggleAll = function () {
        angular.forEach($scope.SamplelCollectionList, function (item) {
            item.isSelected = $scope.selectAll;
        });
    };


    $scope.updateSelectAll = function () {
        $scope.selectAll = $scope.SamplelCollectionList.every(function (item) {
            return item.isSelected;
        });
    };

    $scope.BackToList = function () {
        $scope.showViewDetail = false;
        $scope.showChooseDate = true;
    };
    $scope.Back_Btn = function () {
        $scope.showColledtedSample = true;
        $scope.showColledtedViewDetail = false;
    };

    $scope.AddResult = function (params) {
        var det = params;
        $scope.newData = {};
        $scope.newData.BillingNumber = det.BillingNumber || det.BillingNo;
        $scope.newData.PatientId = det.PatientId;
        $scope.newData.PatientName = det.PatientName;
        $scope.newData.PatientAddress = det.PatientAddress;
        $scope.newData.Age = det.Age;
        $scope.newData.Gender = det.Gender;
        $scope.newData.MobileNo = det.MobileNo;

        var para = {
            BillingId: $scope.newData.BillingNumber,
            IsSampleCollected: false
        };

        $http({
            method: 'POST',
            url: base_url + "Lab/Transaction/GetBillingDetails",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            $scope.loadingstatus = 'stop';
            hidePleaseWait();

            if (res.data.IsSuccess && res.data.Data) {
                $scope.SamplelCollectionList = res.data.Data;

                $scope.selectAll = true; // header checkbox
                $scope.SamplelCollectionList.forEach((S) => {
                    S.isSelected = true;  // row checkbox
                    if (S.SpecimenTypeColl && S.SpecimenTypeColl.length === 1) {
                        // Ensure type matches your ng-model (number/string)
                        S.SpecimenId = S.SpecimenTypeColl[0].id;
                    }
                });

                setTimeout(() => {
                    angular.element('select[active-select2]').trigger('change');
                }, 0);
                // Generate barcode and wait for it
                $scope.GenerateCode().then(function () {
                    if ($scope.SamplelCollectionList) {
                        $scope.SamplelCollectionList.forEach((S) => {
                            S.CollectionDate_TMP = new Date();
                            S.CollectionTime_TMP = new Date();
                            S.BarCodeNumber = $scope.Code;
                            S.SampleCollectedAt = 'LAB';
                            S.AutoNumber = $scope.AutoNumber;
                        });
                    }
                });

                $scope.showViewDetail = true;
                $scope.showChooseDate = false;
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed: ' + reason);
        });
    };

    $scope.GenerateCode = function () {
        var para = {
            EntityId: BarCodeEntityId
        };
        return $http({
            method: 'POST',
            url: base_url + "Lab/Transaction/GenerateSampleBarCode",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.Code = res.data.Data.ResponseId;
                $scope.AutoNumber = res.data.Data.RId;
            } else {
                Swal.fire(res.data.ResponseMSG || "Failed to generate barcode");
            }
        }, function (reason) {
            Swal.fire('Failed: ' + reason);
        });
    };

    $scope.ShowSample = function (v) {
        var now = new Date();
        var TodayDate = DateTimeFormatAD(now);

        var selectedTests = $scope.SamplelCollectionList
            .filter(x => x.isSelected)
            .map(x => ({
                name: x.TestName,
                RequestDate_TMP: now,
                BarCodeNumber: x.BarCodeNumber
            }));

        if (selectedTests.length === 0) {
            Swal.fire("Please select at least one test to show.");
            return;
        }
        Swal.fire({
            title: 'Confirm',
            text: 'Do you want to generate and show sample barcode?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No'
        }).then(function (result) {

            if (!result.isConfirmed) {
                return;
            }

            $scope.SaveSelectedSamples(v);

            $scope.patient = {
                BillingNumber: v.BillingNumber,
                PatientId: v.PatientId,
                PatientName: v.PatientName,
                Age: v.Age,
                Gender: v.Gender,
                MobileNo: v.MobileNo,
                PatientAddress: v.PatientAddress,
                Today: TodayDate,
                tests: selectedTests
            };

            $scope.printCopies = 1;
            $scope.selectTest(selectedTests[0]);
            //$scope.showViewDetail = false;
            //$scope.showChooseDate = true;

         /*   $('#sampleModal').modal('show');*/

            $scope.$applyAsync();
        });
    };

    $scope.SaveSelectedSamples = function (S) {
        $scope.loadingstatus = "running";
        showPleaseWait();
        var dataToSave = [];
        for (var i = 0; i < $scope.SamplelCollectionList.length; i++) {
            var S = $scope.SamplelCollectionList[i];
            if (!S.isSelected) continue;
            var collectionDate = $filter('date')(new Date(S.CollectionDateDet.dateAD), 'yyyy-MM-dd');
            var requestDate = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
            var collectionTime = $filter('date')(new Date(S.CollectionTime_TMP), 'yyyy-MM-dd HH:mm:ss');
            var dataItem = {
                BillingId: S.BillingNo,
                TestNameId: S.TestNameId,
                CollectionDate: collectionDate,
                CollectionTime: collectionTime,
                SpecimenId: S.SpecimenId,
                SampleCollectedAt: S.SampleCollectedAt,
                RequestDate: requestDate,
                BarCodeNumber: S.BarCodeNumber,
                AutoNumber: S.AutoNumber
            };
            dataToSave.push(dataItem);
        }
        $http({
            method: 'POST',
            url: base_url + "Lab/Transaction/SaveSampleCollection",
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
            if (res.data.IsSuccess) {
                  $scope.showViewDetail = false;
            $scope.showChooseDate = true;
                $('#sampleModal').modal('show');
                $scope.GetPendingSampleCollection();
            }
        }, function (err) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            Swal.fire("Error saving samples: " + err.statusText);
        });
    };

    $scope.selectedTest = null;
    $scope.selectTest = function (test) {
        $scope.selectedTest = test;
        $scope.GenerateBarCodeimg(test.BarCodeNumber)
    };

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

    $scope.DateChange = function (timeline, be) {
        const today = new Date();
        if (be == 1) {
            if (timeline == 1) {
                $scope.filter.FromDate_TMP = today;
                $scope.filter.ToDate_TMP = today;
            }
            else if (timeline == 2) {
                const lastWeek = new Date();
                lastWeek.setDate(today.getDate() - 7);
                $scope.filter.FromDate = lastWeek;
                $scope.filter.ToDate = today;
            }
            else if (timeline == 3) {
                const lastMonth = new Date();
                lastMonth.setMonth(today.getMonth() - 1);

                $scope.filter.FromDate_TMP = lastMonth;
                $scope.filter.ToDate_TMP = today;
            }
            else if (timeline == 4) {
                const last3Months = new Date();
                last3Months.setMonth(today.getMonth() - 3);

                $scope.filter.FromDate_TMP = last3Months;
                $scope.filter.ToDate_TMP = today;
            }
        }
        if (be == 2) {
            if (timeline == 1) {
                $scope.newFilter.FromDate_TMP = today;
                $scope.newFilter.ToDate_TMP = today;
            }
            else if (timeline == 2) {
                const lastWeek = new Date();
                lastWeek.setDate(today.getDate() - 7);
                $scope.newFilter.FromDate = lastWeek;
                $scope.newFilter.ToDate = today;
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
    }
    $scope.ViewDetails = function (params) {
        var det = params;
        $scope.newData = {};
        $scope.newData.BillingNumber = det.BillingNumber || det.BillingNo;
        $scope.newData.PatientId = det.PatientId;
        $scope.newData.PatientName = det.PatientName;
        $scope.newData.PatientAddress = det.PatientAddress;
        $scope.newData.Age = det.Age;
        $scope.newData.Gender = det.Gender;
        $scope.newData.MobileNo = det.MobileNo;


        var para = {
            BillingId: $scope.newData.BillingNumber,
            IsSampleCollected: true
        };
        $http({
            method: 'POST',
            url: base_url + "Lab/Transaction/GetBillingDetails",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            $scope.loadingstatus = 'stop';
            hidePleaseWait();
            if (res.data.IsSuccess && res.data.Data) {
                $scope.CollectedSamplelList = res.data.Data;
                $scope.showColledtedSample = false;
                $scope.showColledtedViewDetail = true;
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed: ' + reason);
        });
    };
    $scope.ViewBarCode = function (sample) {
        if (!sample) return;            
        let testsForBilling = $scope.CollectedSamplelList.filter(x => x.AutoNumber === sample.AutoNumber);
        if (testsForBilling.length === 0) return;
        let first = testsForBilling[0];
        $scope.patient = {
            BillingNumber: $scope.newData.BillingNumber,
            PatientId: $scope.newData.PatientId,
            PatientName: $scope.newData.PatientName,
            Age: $scope.newData.Age,
            Gender: $scope.newData.Gender,
            MobileNo: $scope.newData.MobileNo,
            PatientAddress: $scope.newData.PatientAddress,
            RequestDate: first.RequestDate,
            RequestMitti: first.RequestMitti,
          
            tests: testsForBilling.map(t => ({
                name: t.TestName,
                RequestMitti: t.RequestMitti,
                BarCodeNumber: t.BarCodeNumber
            }))
        };

        $scope.selectedTest = $scope.patient.tests[0];

        $scope.GenerateBarCodeimg($scope.selectedTest.BarCodeNumber);

        $('#sampleModalDetail').modal('show');

        $scope.$applyAsync();
    };

    $scope.PrintSample = function () {

        var copies = parseInt($scope.patient.NoOfCopies || 1);

        if (copies <= 0) {
            Swal.fire("Please enter valid number of copies");
            return;
        }

        $('#sampleModal').modal('hide');

        // Original barcode div
        var $original = $('#printBarCode');

        // Temporary print container
        var $printContainer = $('<div id="printContainer"></div>');

        for (var i = 0; i < copies; i++) {
            var $clone = $original.clone();

            // Remove duplicate ID (VERY IMPORTANT)
            $clone.removeAttr('id');

            // Page break after each copy (optional)
            $clone.css({
               /* 'page-break-after': 'always',*/
                'margin-bottom': '50px'
            });

            $printContainer.append($clone);
        }

        // Append to body temporarily
        $('body').append($printContainer);

        // Print
        $printContainer.printThis({
            importCSS: true,
            loadCSS: "",
            afterPrint: function () {
                // Cleanup after print
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
                $scope.HeaderFooterConfigList = res.data.Data;
            } else
                Swal.fire(res.data.ResponseMSG);
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    }


});