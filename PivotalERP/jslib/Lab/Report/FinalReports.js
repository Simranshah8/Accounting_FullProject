"use strict";

agGrid.initialiseAgGridWithAngular1(angular);
app.controller('FinalReport', function ($scope, $filter, $http, $timeout, $compile, GlobalServices) {
    $scope.Title = 'FinalReport';
    var glSrv = GlobalServices;
    OnClickDefault();

    LoadData();

    function LoadData() {
        $('.select2').select2();

        $scope.loadingstatus = "stop";

        $scope.confirmMSG = GlobalServices.getConfirmMSG();
        $scope.perPageColl = GlobalServices.getPerPageList();


        $scope.currentPages = {
            FinalReport: 1

        };

        $scope.searchData = {
            FinalReport: ''

        };

        $scope.perPage = {
            FinalReport: GlobalServices.getPerPageRow(),

        };

        $scope.CategoryColl = [
            { id: 1, text: 'Biochemistry' },
            { id: 2, text: 'Hematology' },
            { id: 3, text: 'Microbiology' },
            { id: 4, text: 'Parasitology' },
            { id: 5, text: 'Nasirudin' }
        ];

        $scope.newDet =
        {
            RequisitionDate: '',
            HospitalNumber: '',
            PatientName: '',
            AgeSex: '',
            PhoneNumber: '',
            RequestingDept: '',
            VisitType: '',
            RunNumberType: '',
            FromDate: null,
            ToDate: null,
            FromDate_TMP: '',
            ToDate_TMP: ''

        }

        $scope.SpecimenColl = [
            { id: 1, text: 'Serum' },
            { id: 2, text: 'Plasma(EDTA)' },
            { id: 3, text: 'Urine(spot)' }
        ];

        // ==== Column Definitions ====
        $scope.FinalReportColumnsDefs = [
            { headerName: "Patient Id", field: "PatientId", filter: 'agTextColumnFilter', flex: 1, minWidth: 120, cellStyle: { textAlign: "left" } },

            { headerName: "Patient Name", field: "PatientName", filter: 'agTextColumnFilter', flex: 1.5, minWidth: 150, cellStyle: { textAlign: "left" } },

            { headerName: "Age/Sex", field: "AgeSex", filter: 'agTextColumnFilter', flex: 1, minWidth: 120, cellStyle: { textAlign: "left" } },

            { headerName: "Phone Number", field: "PhoneNumber", filter: 'agNumberColumnFilter', flex: 1, minWidth: 120, cellStyle: { textAlign: "left" } },

            { headerName: "Test Name", field: "TestName", filter: 'agTextColumnFilter', flex: 1.2, minWidth: 140, cellStyle: { textAlign: "left" } },

            { headerName: "Category", field: "Category", filter: 'agTextColumnFilter', flex: 1, minWidth: 120, cellStyle: { textAlign: "left" } },

            { headerName: "Department", field: "Department", filter: 'agTextColumnFilter', flex: 1, minWidth: 120, cellStyle: { textAlign: "left" } },

            { headerName: "Order Priority", field: "OrderPriority", filter: 'agTextColumnFilter', flex: 1, minWidth: 120, cellStyle: { textAlign: "left" } },

            { headerName: "Bar Code", field: "BarCode", filter: 'agTextColumnFilter', flex: 1.2, minWidth: 120, cellStyle: { textAlign: "left" } },

            { headerName: "IsPrinted", field: "isPrinted", filter: 'agTextColumnFilter', flex: 1.2, minWidth: 120, cellStyle: { textAlign: "left" } },


            {
                headerName: "Action",
                field: "icon",
                width: 180, pinned: 'right',
                //id: this.PartyMstId,
                cellRenderer: function (params) {

                    // Main wrapper
                    var eDiv = document.createElement('div');
                    eDiv.className = 'd-flex align-items-center';

                    // Add Result Button
                    var addResultBtn = document.createElement('button');
                    addResultBtn.className = "btn btn-info btn-sm";
                    addResultBtn.style.borderRadius = "6px";
                    addResultBtn.textContent = "View Details";

                    addResultBtn.addEventListener('click', function () {
                        $scope.$apply(function () {
                            $scope.AddResult();
                        });
                    });

                    eDiv.appendChild(addResultBtn);

                    // View Detail Button
                    var viewDetailBtn = document.createElement('button');
                    //viewDetailBtn.className = "btn btn-info btn-sm ml-1";
                    //viewDetailBtn.style.borderRadius = "6px";
                    //viewDetailBtn.innerHTML = `Sticker <i class="fas fa-print ml-1"></i>`;

                    viewDetailBtn.addEventListener('click', function () {
                        $scope.$apply(function () {
                            $scope.ShowSample(params.data);
                        });
                    });

                 /*   eDiv.appendChild(viewDetailBtn);*/
                    // Dropdown Button
                    var dropdownBtn = document.createElement("button");
                    dropdownBtn.className = "btn btn-info btn-sm ml-1 dropdown-toggle";
                    dropdownBtn.style.borderRadius = "6px";
                    dropdownBtn.innerHTML = "...";

                    eDiv.appendChild(dropdownBtn);
                    // Dropdown Menu (Rendered in BODY)

                    var menu = document.createElement("ul");
                    menu.className = "dropdown-menu p-2";
                    menu.style.position = "absolute";
                    menu.style.display = "none";
                    menu.style.zIndex = "999999"; // prevent clipping

                    menu.innerHTML = `
        <li><a class="undo-action" href="javascript:void(0);">
             Undo
        </a></li>
    `;

                    // add to document BODY
                    document.body.appendChild(menu);
                    // Dropdown Toggle Handling

                    dropdownBtn.addEventListener("click", function (e) {

                        e.stopPropagation();

                        const rect = dropdownBtn.getBoundingClientRect();
                        menu.style.top = rect.bottom + "px";
                        menu.style.left = rect.left + "px";

                        menu.style.display = (menu.style.display === "none") ? "block" : "none";
                    });


                    // Hide dropdown when clicking outside
                    document.addEventListener("click", function (e) {
                        if (!menu.contains(e.target) && e.target !== dropdownBtn) {
                            menu.style.display = "none";
                        }
                    });



                    // Dropdown Actions

                    menu.querySelector('.undo-action').addEventListener('click', function () {
                        menu.style.display = "none";
                        $scope.$apply(function () {
                            $scope.ShowReset(params.data);
                        });
                    });

                    return eDiv;
                }
            }
        ];


        $scope.ExamTypeOptions = {
            defaultColDef: {
                filter: true,
                resizable: true,
                sortable: true,
                width: 100
            },
            //headerHeight: 31,
            //rowHeight: 30,
            columnDefs: $scope.FinalReportColumnsDefs,

            rowData: [
                { UserName: "admin", Name: "Admin User" },
                { UserName: "ram", Name: "Ram Bahadur" },
                { UserName: "sita", Name: "Sita Kumari" }
            ],

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
        $scope.eGridDiv = document.querySelector('#FinalReportTypeData');

        // create the grid passing in the div to use together with the columns & data we want to use
        new agGrid.Grid($scope.eGridDiv, $scope.ExamTypeOptions);

        $scope.ExamTypeOptions.onFirstDataRendered = function () {
            $timeout(function () {
                $compile(angular.element($scope.eGridDiv).contents())($scope);
            });


        };
        $scope.loadDummy = function () {
            $scope.ExamTypeOptions.api.setRowData([
                { PatientId: "user1", PatientName: "Demo User 1", AgeSex: "user1", PhoneNumber: "user1", TestName: "user1", Category: "user1", Department: "user1", OrderPriority: "user1", BarCode: "user1", },

            ]);
        };
    };

    $scope.ClearFields = function () {
        $scope.loadingstatus = "stop";



        $scope.beData =
        {

            Mode: 'Save',

        };

        $('#txtName').focus();
    }


    $scope.SamplelCollectionList = [
        {
            RequestedOn: '2028-09-01',
            PrescribedBy: 'Dr. A. Sharma',
            TestName: 'APF strain',
            isSelected: false,
            IsOutsourced: 'Yes',
            Department: 2,
            Specimen: 'Blood',
            Type: 'Normal'
        }]


    $scope.selectAll = false;

    $scope.toggleAll = function () {
        angular.forEach($scope.SamplelCollectionList, function (item) {
            item.isSelected = $scope.selectAll;
        });
    };


    function OnClickDefault() {
        document.getElementById('View_Detail_Table').style.display = "none";
        document.getElementById('BackToList').onclick = function () {
            document.getElementById('datatable').style.display = "block";
            document.getElementById('View_Detail_Table').style.display = "none";
            document.getElementById('ChooseDate').style.display = "block";
            document.getElementById('SearchFunction').style.display = "flex";

        }

    }


    $scope.AddResult = function () {

        // Your original code here
        document.getElementById('datatable').style.display = "none";
        document.getElementById('View_Detail_Table').style.display = "block";
        document.getElementById('ChooseDate').style.display = "none";
        document.getElementById('SearchFunction').style.display = "none";

    };

    $scope.ShowSample = function () {
        // Prepare patient data dynamically
        $scope.patient = {
            name: "Sanjay Chaurasiya",
            age: 65,
            sex: "M",
            tests: [
                { name: "HBA1C", runNumber: "14/7", barcode: "1000070" }
            ]
        };
        $scope.printCopies = 1;

        // Show Bootstrap modal
        $('#sampleModal').modal('show');
    };


    $scope.EditResult = function () {
       
        $('#EditResult').modal('show');
    };


    $scope.pageChangeHandler = function (num) {
        console.log('page changed to ' + num);
    };


    $scope.ShowReset = function () {
        $('#resetRunNumberModal').modal('show');
    };



    $scope.ShowToday = function () {
        const today = new Date();
        $scope.newDet.FromDate_TMP = today;
        $scope.newDet.ToDate_TMP = today;
        console.log("Today");
    };

    $scope.ShowWeek = function () {
        const today = new Date();
        const lastWeek = new Date();
        lastWeek.setDate(today.getDate() - 7);

        $scope.newDet.FromDate = lastWeek;
        $scope.newDet.ToDate = today;

        $scope.newDet.FromDate_TMP = lastWeek;
        $scope.newDet.ToDate_TMP = today;
    };

    $scope.ShowMonth = function () {
        const today = new Date();
        const lastMonth = new Date();
        lastMonth.setMonth(today.getMonth() - 1);

        $scope.newDet.FromDate = lastMonth;
        $scope.newDet.ToDate = today;

        $scope.newDet.FromDate_TMP = lastMonth;
        $scope.newDet.ToDate_TMP = today;
    };

    $scope.Show3Months = function () {
        const today = new Date();
        const last3Months = new Date();
        last3Months.setMonth(today.getMonth() - 3);

        $scope.newDet.FromDate = last3Months;
        $scope.newDet.ToDate = today;

        $scope.newDet.FromDate_TMP = last3Months;
        $scope.newDet.ToDate_TMP = today;
    };

});