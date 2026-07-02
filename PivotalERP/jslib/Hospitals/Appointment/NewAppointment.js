app.controller("NewAppointment", function ($scope, $filter, $http, $timeout, GlobalServices) {
    $scope.Title = 'NewAppointment';

    $scope.LoadData = function () {
        $('.select2').select2();

        $scope.perPageColl = GlobalServices.getPerPageList();

        $scope.currentPages = {
            NewAppointment: 1,
        };

        $scope.searchData = {
            NewAppointment: '',
        };

        $scope.perPage = {
            NewAppointment: GlobalServices.getPerPageRow(),
        };

        $scope.GenderColl = GlobalServices.getGenderList();
        $scope.MaritalStatusColl = [
            { id: 1, text: "Married" },
            { id: 2, text: "UnMarried" }
        ]
        $scope.EthnicityList = [
            { EthnicityId: 1, Name: "Brahmin" },
            { EthnicityId: 2, Name: "Chhetri" }
        ]

        $scope.EthinicityList = [];
        $http({
            method: 'POST',
            url: base_url + "Hospital/Creation/GetAllEthinicity",
            dataType: "json"
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.EthinicityList = res.data.Data;
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        $scope.DepartmentList = [];
        $http({
            method: 'GET',
            url: base_url + "HR/Master/GetAllDepartment",
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
        $scope.DocumentTypeList = [
            { DocumentTypeId: 1, Name: "CITIZENSHIP" },
            { DocumentTypeId: 2, Name: "DRIVING LICENCE" },
            { DocumentTypeId: 3, Name: "PASSWORD" },
            { DocumentTypeId: 4, Name: "PAN NUMBER" },
            { DocumentTypeId: 5, Name: "NID" },
            { DocumentTypeId: 6, Name: "OTHER" }
        ]

        $scope.confirmMSG = GlobalServices.getConfirmMSG();

        $scope.NewAppointmentForm = true;

        $scope.ProvinceColl = GetStateList();
        $scope.DistrictColl = GetDistrictList();
        $scope.VDCColl = GetVDCList();

        $scope.ProvinceColl_Qry = mx($scope.ProvinceColl);
        $scope.DistrictColl_Qry = mx($scope.DistrictColl);
        $scope.VDCColl_Qry = mx($scope.VDCColl);

        $scope.newDet = {
            PatientRegId: null,
            FirstName: "",
            LastName: "",
            GenderId: null,
            DOB: null,
            AgeYear: 0,
            AgeMonth: 0,
            AgeDay: 0,
            BloodGroupId: null,
            EthnicityId: null,
            MaritalStatusId: null,
            SpouseName: "",
            Occupation: "",
            Nationality: "",
            Contact: "",
            Email: "",
            IdType: "",
            IDNumber: "",
            ProvinceId: null,
            DistrictId: null,
            LocalLevel: "",
            Address: "",
            Photo: "",
            Document: null,
            Mode: "Save"
        }

        $scope.confirmMSG = GlobalServices.getConfirmMSG();
        $scope.BloodGroupList = GlobalServices.getBloodGroupList();
        /*$scope.GetAllPatientList();*/
    }

    $scope.ClearDetails = function () {
        $scope.newDet = {
            PatientRegId: null,
            FirstName: "",
            LastName: "",
            GenderId: null,
            DOB: null,
            AgeYear: 0,
            AgeMonth: 0,
            AgeDay: 0,
            BloodGroupId: null,
            EthnicityId: null,
            MaritalStatusId: null,
            SpouseName: "",
            Occupation: "",
            Nationality: "",
            Contact: "",
            Email: "",
            IdType: "",
            IDNumber: "",
            ProvinceId: null,
            DistrictId: null,
            LocalLevel: "",
            PatientAddress: "",
            Photo: "",
            Document: null,
            Mode: "Save"
        }
        $scope.ClearEmpPhoto();
        $scope.attachFile = null;
    }

    $scope.ClearEmpPhoto = function () {

        $timeout(function () {

            $scope.$apply(function () {

                $scope.newDet.PhotoPathData = null;

                $scope.newDet.PhotoPath_TMP = [];

            });

        });
        $('#Photo').attr('src', '');
        document.getElementById('flMoreFiles').value = null;

    };

    $scope.$watch('newDet.DOBDet.dateAD', function (newVal, oldVal) {
        $scope.newDet.AgeYear = 0;
        $scope.newDet.AgeMonth = 0;
        $scope.newDet.AgeDay = 0;
        if (newVal && newVal !== oldVal) {
            var det = $scope.newDet && $scope.newDet.DOBDet;
            var dob = det && det.dateAD;
            var Age = getDOBAge(dob);
            var AgeData = parseAgeString(Age);
            $scope.newDet.AgeYear = AgeData.years;
            $scope.newDet.AgeMonth = AgeData.months;
            $scope.newDet.AgeDay = AgeData.days;
        }
    });


    function parseAgeString(ageStr) {
        var result = {
            years: 0,
            months: 0,
            days: 0
        };

        if (!ageStr || typeof ageStr !== "string") return result;

        var parts = ageStr
            .toLowerCase()
            .replace(/[,]+/g, '')
            .trim()
            .split(/\s+/);

        for (var i = 0; i < parts.length - 1; i += 2) {
            var value = parseInt(parts[i], 10);
            var unit = parts[i + 1];

            if (isNaN(value)) continue;

            if (unit.startsWith("year")) result.years = value;
            else if (unit.startsWith("month")) result.months = value;
            else if (unit.startsWith("day")) result.days = value;
        }

        return result;
    }


    $scope.$watch('attachFile', function (newVal, oldVal) {
        if (!newVal || newVal === oldVal) return;

        // This will fire on every change
        console.log('Files changed:', newVal);

        // Call your function
        $scope.AddMoreFiles(newVal);
    });

    $scope.AddMoreFiles = function (files) {
        if (files) {
            if (files != null) {
                $scope.newDet.Document = {
                    File: files[0],
                    Name: files[0].name,
                    Type: files[0].type,
                    Size: files[0].size,
                    Path: null
                };
                $('#flMoreFiles').val('');
            }
        }
    };

    $scope.ShowPersonalImg = function (item) {
        $scope.viewImg = {
            ContentPath: '',
            FileType: Image
        };

        if (item.DocPath && item.DocPath.length > 0) {
            $scope.viewImg.ContentPath = item.DocPath;
            $scope.viewImg.FileType = 'pdf';  // Assuming DocPath is for PDFs
            document.getElementById('pdfViewer').src = item.DocPath;
            $('#PersonalImg').modal('show');
        }
        else if (item.PhotoPath && item.PhotoPath.length > 0) {
            $scope.viewImg.ContentPath = item.PhotoPath;
            $scope.viewImg.FileType = 'image';  // Assuming PhotoPath is for images
            $('#PersonalImg').modal('show');
        }
        else if (item.File) {
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
    $scope.AddSingleFile = function (file, desc) {
        if (!file) return;

        $scope.newEmployeePromotion.Document = {
            File: file,
            Name: file.name,
            Type: file.type,
            Size: file.size,
            Description: desc || '',
            Path: null
        };

        $scope.attachFile = null;
        $scope.docDescription = '';
        document.getElementById('flMoreFiles').value = '';
    };



    $scope.AddNewAppointment = function () {
        $scope.NewAppointmentForm = false;
        $scope.ShowPatient = true;
    };

    $scope.BackToList = function () {
        $scope.NewAppointmentForm = true;
        $scope.ShowPatient = false;
    };


})