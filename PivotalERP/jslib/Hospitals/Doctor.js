app.controller('Doctor', function ($scope, $filter, $http, $timeout, GlobalServices) {
    $scope.Title = 'Doctor';
    var glSrv = GlobalServices;

    $scope.onBtExportCSV = function () {
        var params = {
            fileName: 'Doctor.csv',
            sheetName: 'Doctor'
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
            Doctor: 1

        };

        $scope.searchData = {
            Doctor: ''

        };

        $scope.perPage = {
            Doctor: GlobalServices.getPerPageRow(),

        };

        $scope.CountryColl = [
            { id: 1, text: 'Nepal' },
            { id: 2, text: 'India' }
        ]
        $scope.GenderColl = [
            { id: 1, text: 'Male' },
            { id: 2, text: 'Female' },
            { id: 3, text: 'Others' },
        ]

        $scope.ReligionColl = [
            { id: 1, text: 'Hinduism' },
            { id: 2, text: 'Islam' },
            { id: 3, text: 'Buddhisim' },
            { id: 4, text: 'Christianity' },
            { id: 5, text: 'Jainism' },
            { id: 6, text: 'Sikhism' },
            { id: 7, text: 'Judaism' },
        ]

        $scope.BloodGroupColl = [
            { id: 1, text: 'A+' },
            { id: 2, text: 'A-' },
            { id: 3, text: 'B+' },
            { id: 4, text: 'B-' },
            { id: 5, text: 'O+' },
            { id: 6, text: 'O-' },
            { id: 7, text: 'AB+' },
            { id: 8, text: 'AB-' },
        ]
        $scope.NationalityColl = [
            { id: 1, text: 'Nepali' },
            { id: 2, text: 'Indian' },

        ]
        $scope.EthnicityColl = []
        $http({
            method: 'POST',
            url: base_url + "Hospital/Creation/GetAllEthinicity",
            dataType: "json"
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.EthnicityColl = res.data.Data;
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
        $scope.DepartmentList = []
        $http({
            method: 'POST',
            url: base_url + "Lab/Creation/GetAllLabDepartment",
            dataType: "json"
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.DepartmentList = res.data.Data;
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        $scope.MaritalStatusColl = [
            { id: 1, text: 'Single' },
            { id: 2, text: 'Married' },
            { id: 3, text: 'Widowed' },
            { id: 4, text: 'Separated' },
            { id: 5, text: 'Divorced' }
        ]

        //$scope.EthnicityColl = [
        //    { id: 1, text: 'Brahmin' },
        //    { id: 2, text: 'Chhetri' },
        //    { id: 3, text: 'Newar' },
        //    { id: 4, text: 'Magar' },
        //    { id: 5, text: 'Tharu' },
        //    { id: 6, text: 'Tamang' },
        //    { id: 7, text: 'Gurung' },
        //    { id: 8, text: 'Rai' },
        //    { id: 9, text: 'Limbu' },
        //    { id: 10, text: 'Sherpa' },
        //    { id: 11, text: 'Madhesi' },
        //    { id: 12, text: 'Thakuri' },
        //    { id: 13, text: 'Punjabi' },
        //    { id: 14, text: 'Gujarati' },
        //    { id: 15, text: 'Tamil' },
        //    { id: 16, text: 'Bengali' },
        //    { id: 17, text: 'Marathi' },
        //    { id: 18, text: 'Kannada' },
        //    { id: 18, text: 'Telugu' },
        //    { id: 20, text: 'Rajasthani' },
        //    { id: 21, text: 'Assamese' },
        //    { id: 22, text: 'Kashmiri' },
        //    { id: 23, text: 'Konkani' }
        //];

        $scope.ProvinceColl = GetStateList();
        $scope.DistrictColl = GetDistrictList();

        $scope.newDet = {
            Country: '',
            District: '',
            ProvinceState: '',
            Address: '',
            AddressNP: '',
            TmpCountry: '',
            TmpProvinceState: '',
            TmpDistrict: '',
            TmpAddress: '',
            TmpAddressNP: '',
            DoctorCode: '',
            EntryDate_TMP: new Date(),
            FirstName: '',
            MiddleName: '',
            LastName: '',
            NameNP: '',
            Gender: null,
            Ethinicity: '',
            EthinicityInd: '',
            BloodGroup: '',
            Religion: '',
            DOBND: '',
            MaritalStatus: '',
            Nationality: '',
            CitizenshipNo: '',
            PanId: '',
            EmailId: '',
            Contact: '',
            FatherName: '',
            MotherName: '',
            GrandFather: '',
            FatherNameNP: '',
            MotherNameNP: '',
            GrandFatherNP: '',
            PhotoPath: '',
            Designation:'',
            JoinDate:'',
            Grade:'',
            DepartmentId:null,
            PreeOfficeName:'',
            PreeOfficePost:'',
            PreeOfficeContact: '',
            PreeOfficeAddress: '',
            PreeOfficeRemarks: '',
            DOBNY: null,
            DOBNM: null,
            DOBND: null,
            IsSameAsCurrentAddress: false,
            DoctorSign_Tmp:'',
            NMCNo: null,
            NNCNo: null,
            NHPNo: null,
            IsIncentiveApplicable: false,
            IsAppointmentApplicable: false,
            IsActive: false,
            Mode: 'Save'
        };

        $scope.columnDefs = [
            { headerName: "SNo.", width: 80, valueGetter: "node.rowIndex + 1", cellStyle: { textAlign: "center" }, sortable: false, filter: false },
            { field: "AutoNumber", headerName: "AutoNumber", filter: 'agTextColumnFilter', cellStyle: { 'textAlign': 'left' }, width: 130 },
            { field: "DoctorCode", headerName: "Code", filter: 'agTextColumnFilter', cellStyle: { 'textAlign': 'left' }, width: 100 },
            { field: "FullName", headerName: "Name", filter: 'agTextColumnFilter', cellStyle: { 'textAlign': 'left' }, width: 150 },
            { field: "GenderName", headerName: "Gender", filter: 'agTextColumnFilter', cellStyle: { 'textAlign': 'left' }, width: 100 },
            { field: "CitizenshipNo", headerName: "Citizenship No.", filter: 'agTextColumnFilter', cellStyle: { 'textAlign': 'left' }, width: 120 },
            { field: "Contact", headerName: "Contact No.", filter: 'agTextColumnFilter', cellStyle: { 'textAlign': 'left' }, width: 120 },
            { field: "EmailId", headerName: "Email", filter: 'agTextColumnFilter', cellStyle: { 'textAlign': 'left' }, width: 150 },
            { field: "PanId", headerName: "Pan", filter: 'agTextColumnFilter', cellStyle: { 'textAlign': 'left' }, width: 120 },
            { field: "Department", headerName: "Department", filter: 'agTextColumnFilter', cellStyle: { 'textAlign': 'left' }, width: 150 },
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
                        $scope.GetDoctorById(params.data);
                        $scope.$apply();
                    });
                    // DELETE CLICK
                    eDiv.querySelector(".delete-btn").addEventListener("click", function () {
                        $scope.DelDoctor(params.data);
                        $scope.$apply();
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
        $scope.GetAllDoctor();
    }


    $scope.AutoNumberForDoctor = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();
        $http({
            method: 'POST',
            url: base_url + "Hospital/Creation/AutoNumberForDoctor",
            dataType: "json"

        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                var vDet = res.data.Data;
                $scope.newDet.AutoNumber = vDet.RId;
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

    }
    $scope.ClearPhoto = function () {
        $timeout(function () {
            $scope.$apply(function () {
                $scope.newDet.PhotoPathData = null;
                $scope.newDet.PhotoPath_TMP = [];
            });
        });
        $('#Photo').attr('src', '');
    };

    $scope.ClearSignature = function () {
        $timeout(function () {
            $scope.$apply(function () {
                $scope.newDet.DoctorSignData = null;
                $scope.newDet.DoctorSign_Tmp = [];
            });
        });
        $('#Sign').attr('src', '');
    };

    $scope.clearP = function () {
        $scope.newDet.ProvinceState = '';
        $scope.newDet.District = '';
        $scope.newDet.Address = '';
        $scope.newDet.AddressNP = '';
        $scope.newDet.Zone = '';
    }
    $scope.clearTemp = function () {
        $scope.newDet.TmpProvinceState = '';
        $scope.newDet.TmpDistrict = '';
        $scope.newDet.TmpAddress = '';
        $scope.newDet.TmpAddressNP = '';
        $scope.newDet.TmpZone = '';
    }

    $scope.SameCurrentAddress = function () {

        if ($scope.newDet.IsSameAsCurrentAddress == true) {
            $scope.newDet.Country = $scope.newDet.TmpCountry;
            $scope.newDet.ProvinceState = $scope.newDet.TmpProvinceState;
            $scope.newDet.District = $scope.newDet.TmpDistrict;
            $scope.newDet.Zone = $scope.newDet.TmpZone;
            $scope.newDet.Address = $scope.newDet.TmpAddress;
            $scope.newDet.AddressNP = $scope.newDet.TmpAddressNP;

        //} else {
        //    $scope.newDet.Country = $scope.newDet.TmpCountry;
        //    $scope.newDet.ProvinceState = $scope.newDet.TmpProvinceState;
        //    $scope.newDet.District = $scope.newDet.TmpDistrict;
        //    $scope.newDet.Zone = $scope.newDet.TmpZone;
        //    $scope.newDet.Address = $scope.newDet.TmpAddress;
        //    $scope.newDet.AddressNP = $scope.newDet.TmpAddressNP;
        }
    };

    $scope.ClearFields = function () {
        $scope.ClearPhoto();
        $scope.ClearSignature();
        $scope.newDet = {
            Country: '',
            District: '',
            ProvinceState: '',
            Address: '',
            AddressNP: '',
            TmpCountry: '',
            TmpProvinceState: '',
            TmpDistrict: '',
            TmpAddress: '',
            TmpAddressNP: '',
            DoctorCode: '',
            EntryDate_TMP: new Date(),
            EntryDate: '',
            FirstName: '',
            MiddleName: '',
            LastName: '',
            NameNP: '',
            Gender: null,
            Ethinicity: '',
            EthinicityInd: '',
            BloodGroup: '',
            Religion: '',
            DOBND: '',
            MaritalStatus: '',
            Nationality: '',
            CitizenshipNo: '',
            PanId: '',
            EmailId: '',
            Contact: '',
            FatherName: '',
            MotherName: '',
            GrandFather: '',
            FatherNameNP: '',
            MotherNameNP: '',
            GrandFatherNP: '',
            PhotoPath: '',
            Designation: '',
            JoinDate: '',
            Grade: '',
            DepartmentId: null,
            PreeOfficeName: '',
            PreeOfficePost: '',
            PreeOfficeContact: '',
            PreeOfficeAddress: '',
            PreeOfficeRemarks: '',
            DOBNY: null,
            DOBNM: null,
            DOBND: null,
            IsSameAsCurrentAddress: false,
            DoctorSign_Tmp: '',
            NMCNo: null,
            NNCNo: null,
            NHPNo: null,
            IsIncentiveApplicable: false,
            IsAppointmentApplicable: false,
            IsActive: false,
            Mode: 'Save'
        };
        $scope.AutoNumberForDoctor();
    };

    $scope.IsValidDoctor = function () {
        return true;
    }

    $scope.SaveUpdateDoctor = function () {
        if ($scope.IsValidDoctor() == true) {
            if ($scope.confirmMSG.Accept == true) {
                var saveModify = $scope.newDet.Mode;
                Swal.fire({
                    title: 'Do you want to ' + saveModify + ' the current data?',
                    showCancelButton: true,
                    confirmButtonText: saveModify,
                }).then((result) => {
                    if (result.isConfirmed) {
                        $scope.CallSaveUpdateDoctor();
                    }
                });
            } else
                $scope.CallSaveUpdateDoctor();

        }
    };

    $scope.CallSaveUpdateDoctor = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();

        var DoctorImg = $scope.newDet.PhotoPath_Tmp;
        var DoctorSign = $scope.newDet.DoctorSign_Tmp;

        if ($scope.newDet.DateOfBirthADDet) {
            $scope.newDet.DateOfBirthAD = $filter('date')(new Date($scope.newDet.DateOfBirthADDet.dateAD), 'yyyy-MM-dd');
            $scope.newDet.DOBNY = $scope.newDet.DateOfBirthADDet.NY;
            $scope.newDet.DOBNM = $scope.newDet.DateOfBirthADDet.NM;
            $scope.newDet.DOBND = $scope.newDet.DateOfBirthADDet.ND;
        }
        if ($scope.newDet.EntryDateDet) {
            $scope.newDet.EntryDate = $filter('date')(new Date($scope.newDet.EntryDateDet.dateAD), 'yyyy-MM-dd');
        }
        if ($scope.newDet.JoinDateDet) {
            $scope.newDet.JoinDate = $filter('date')(new Date($scope.newDet.JoinDateDet.dateAD), 'yyyy-MM-dd');
        }
        
        $http({
            method: 'POST',
            url: base_url + "Hospital/Creation/SaveDoctor",
            headers: { 'Content-Type': undefined },
            transformRequest: function (data) {
                var formData = new FormData();
                formData.append("jsonData", angular.toJson(data.jsonData));

                if (data.Img && data.Img.length > 0)
                    formData.append("DoctorImg", data.Img[0]);

                if (data.sign && data.sign.length > 0)
                    formData.append("DoctorSign", data.sign[0]);


                return formData;
            },
            data: { jsonData: $scope.newDet, Img: DoctorImg, sign: DoctorSign }
        }).then(function (res) {

            $scope.loadingstatus = "stop";
            hidePleaseWait();

            Swal.fire(res.data.ResponseMSG);

            if (res.data.IsSuccess == true) {
                $scope.ClearFields();
                $scope.GetAllDoctor();
            }

        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";

        });
    }
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


    $scope.GetDoctorById = function (resData) {
        $scope.loadingstatus = "running";
        showPleaseWait();
        var para = {
            DoctorId: resData.DoctorId
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
                $scope.newDet = res.data.Data;
                $scope.newDet.Mode = 'Modify';

                if ($scope.newDet.DateOfBirthAD)
                    $scope.newDet.DateOfBirthAD_TMP = new Date($scope.newDet.DateOfBirthAD);

                if ($scope.newDet.EntryDate)
                    $scope.newDet.EntryDate_TMP = new Date($scope.newDet.EntryDate);

                if ($scope.newDet.JoinDate)
                    $scope.newDet.JoinDate_TMP = new Date($scope.newDet.JoinDate);

               

            } else {
                Swal.fire(res.data.ResponseMSG);
            }
            $('#custom-tabs-four-profile-tab').tab('show');
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    };

    $scope.DelDoctor = function (refData, ind) {
        Swal.fire({
            title: 'Are you sure you want to delete ' + refData.FirstName + '?',
            showCancelButton: true,
            confirmButtonText: 'Delete',
        }).then((result) => {
            if (result.isConfirmed) {
                var para = { DoctorId: refData.DoctorId };
                $http({
                    method: 'POST',
                    url: base_url + "Hospital/Creation/DelDoctor",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingStatus = "stop";

                    Swal.fire(res.data.ResponseMSG);
                    if (res.data.IsSuccess == true) {
                        $scope.GetAllDoctor();
                    }
                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }

        });

    }
});
