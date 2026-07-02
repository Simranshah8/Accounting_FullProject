app.controller("PatientRegistration", function ($scope, $filter, $http, $timeout, GlobalServices) {
    $scope.Title = 'PatientRegistration';

    $scope.LoadData = function () {
        $('.select2').select2();

        $scope.perPageColl = GlobalServices.getPerPageList();

        $scope.currentPages = {
            PatientRegistration: 1,
        };

        $scope.searchData = {
            PatientRegistration: '',
        };

        $scope.perPage = {
            PatientRegistration: GlobalServices.getPerPageRow(),
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
        $scope.DocumentTypeList = [
            { DocumentTypeId: 1, Name: "CITIZENSHIP" },
            { DocumentTypeId: 2, Name: "DRIVING LICENCE" },
            { DocumentTypeId: 3, Name: "PASSWORD" },
            { DocumentTypeId: 4, Name: "PAN NUMBER" },
            { DocumentTypeId: 5, Name: "NID" },
            { DocumentTypeId: 6, Name: "OTHER" }
        ]
        //$scope.EthinicityList = [];
        //$http({
        //    method: 'POST',
        //    url: base_url + "Hospital/Creation/GetAllEthinicity",
        //    dataType: "json"
        //}).then(function (res) {
        //    if (res.data.IsSuccess && res.data.Data) {
        //        $scope.EthinicityList = res.data.Data;
        //    }
        //}, function (reason) {
        //    Swal.fire('Failed' + reason);
        //});

        $scope.ProvinceColl = GetStateList();
        $scope.DistrictColl = GetDistrictList();
        $scope.VDCColl = GetVDCList();

        $scope.ProvinceColl_Qry = mx($scope.ProvinceColl);
        $scope.DistrictColl_Qry = mx($scope.DistrictColl);
        $scope.VDCColl_Qry = mx($scope.VDCColl);

        $scope.NewPatientRegistration = {
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
            PhotoData: "",
            Document: null,
            Mode: "Save"
        }

        $scope.confirmMSG = GlobalServices.getConfirmMSG();
        //$scope.DocumentList = GlobalServices.getDocumentTypeList();
        $scope.BloodGroupList = GlobalServices.getBloodGroupList();
        /*$scope.GetAllPatientList();*/
    }
    $scope.ClearDetails = function () {
        $scope.NewPatientRegistration = {
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
                $scope.NewPatientRegistration.PhotoPathData = null;
                $scope.NewPatientRegistration.PhotoPath_TMP = [];
            });
        });
        $('#Photo').attr('src', '');
        document.getElementById('flMoreFiles').value = null;
    };

    $scope.$watch('NewPatientRegistration.DOBDet.dateAD', function (newVal, oldVal) {
        $scope.NewPatientRegistration.AgeYear = 0;
        $scope.NewPatientRegistration.AgeMonth = 0;
        $scope.NewPatientRegistration.AgeDay = 0;
        if (newVal && newVal !== oldVal) {
            var det = $scope.NewPatientRegistration && $scope.NewPatientRegistration.DOBDet;
            var dob = det && det.dateAD;
            var Age = getDOBAge(dob);
            var AgeData = parseAgeString(Age);
            $scope.NewPatientRegistration.AgeYear = AgeData.years;
            $scope.NewPatientRegistration.AgeMonth = AgeData.months;
            $scope.NewPatientRegistration.AgeDay = AgeData.days;
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
                $scope.NewPatientRegistration.Document = {
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


    //$scope.IsValidPatientReg = function () {
    //    return true;
    //}

    //$scope.SaveUpdatePatient = function () {
    //    if ($scope.IsValidPatientReg() == true) {
    //        if ($scope.confirmMSG.Accept == true) {
    //            var saveModify = $scope.NewPatientRegistration.Mode;
    //            Swal.fire({
    //                title: 'Do you want to ' + saveModify + ' the current data?',
    //                showCancelButton: true,
    //                confirmButtonText: saveModify,
    //            }).then((result) => {
    //                if (result.isConfirmed) {
    //                    $scope.CallSaveUpdatePatient();
    //                }
    //            });
    //        } else
    //            $scope.CallSaveUpdatePatient();
    //    }
    //};

    //$scope.CallSaveUpdatePatient = function () {
    //    $scope.loadingstatus = "running";
    //    showPleaseWait();

    //    var photo = $scope.NewPatientRegistration.Photo_TMP;     // could be array or single
    //    var files = $scope.NewPatientRegistration.DocumentColl;     // single file
    //    if ($scope.NewPatientRegistration.RegistrationDateDet) {
    //        $scope.NewPatientRegistration.RegistrationDate = $filter('date')(new Date($scope.NewPatientRegistration.RegistrationDateDet.dateAD), 'yyyy-MM-dd');
    //    }
    //    if ($scope.NewPatientRegistration.DOBDet) {
    //        $scope.NewPatientRegistration.DOB = $filter('date')(new Date($scope.NewPatientRegistration.DOBDet.dateAD), 'yyyy-MM-dd');
    //    }


    //    $http({
    //        method: 'POST',
    //        url: base_url + "Appointment/Transaction/SavePatientRegistration",
    //        headers: { 'Content-Type': undefined },
    //        transformRequest: function (data) {
    //            var formData = new FormData();
    //            formData.append("jsonData", angular.toJson(data.jsonData));

    //            if (data.emPhoto && data.emPhoto.length > 0)
    //                formData.append("photo", data.emPhoto[0]);

    //            if (data.files) {
    //                for (var i = 0; i < data.files.length; i++) {
    //                    formData.append("file" + i, data.files[i].File);
    //                }
    //            }

    //            return formData;
    //        },
    //        data: {
    //            jsonData: $scope.NewPatientRegistration,
    //            emPhoto: photo,
    //            files: files
    //        }
    //    }).then(function (res) {
    //        $scope.loadingstatus = "stop";
    //        hidePleaseWait();
    //        Swal.fire(res.data.ResponseMSG);

    //        if (res.data.IsSuccess === true) {
    //            $scope.ClearFields();
    //            $scope.GetAllPatientList();
    //        }
    //    }, function () {
    //        hidePleaseWait();
    //        $scope.loadingstatus = "stop";
    //    });
    //};


    //$scope.GetPatientById = function (beData) {

    //    $scope.loadingstatus = "running";
    //    var para = {
    //        PatientRegId: beData.PatientRegId
    //    };
    //    $http({
    //        method: 'POST',
    //        url: base_url + "Appointment/Transaction/GetPatientRegistrationById",
    //        dataType: "json",
    //        data: JSON.stringify(para)
    //    }).then(function (res) {
    //        $scope.loadingstatus = "stop";
    //        if (res.data.IsSuccess && res.data.Data) {
    //            $timeout(function () {
    //                $scope.NewPatientRegistration = res.data.Data;
    //                if ($scope.NewPatientRegistration.RegistrationDate) {
    //                    $scope.NewPatientRegistration.RegistrationDate_TMP = $scope.NewPatientRegistration.RegistrationDate;
    //                }
    //                if ($scope.NewPatientRegistration.DOB) {
    //                    $scope.NewPatientRegistration.DOB_TMP = $scope.NewPatientRegistration.DOB;
    //                }
    //                if ($scope.NewPatientRegistration.PhotoUrl) {
    //                    $scope.NewPatientRegistration.Photo = $scope.NewPatientRegistration.PhotoUrl;
    //                }
    //                $scope.NewPatientRegistration.Mode = 'Modify';
    //                $('#custom-tabs-four-profile-tab').tab('show');
    //            });
    //        } else
    //            Swal.fire(res.data.ResponseMSG);

    //    }, function (reason) {
    //        Swal.fire('Failed' + reason);
    //    });
    //}

    //$scope.deletePatient = function (refData, ind) {

    //    Swal.fire({
    //        title: 'Are you sure to delete Patient:-' + refData.FirstName + refData.LastName,
    //        showCancelButton: true,
    //        confirmButtonText: 'Delete',
    //    }).then((result) => {
    //        if (result.isConfirmed) {
    //            $scope.loadingstatus = "running";
    //            showPleaseWait();

    //            var para = {
    //                PatientRegId: refData.PatientRegId
    //            };

    //            $http({
    //                method: 'POST',
    //                url: base_url + "Appointment/Transaction/DelPatientRegistration",
    //                dataType: "json",
    //                data: JSON.stringify(para)
    //            }).then(function (res) {
    //                hidePleaseWait();
    //                $scope.loadingstatus = "stop";
    //                Swal.fire(res.data.ResponseMSG);
    //                if (res.data.IsSuccess) {
    //                    $scope.GetAllPatientList();
    //                }

    //            }, function (reason) {
    //                Swal.fire('Failed' + reason);
    //            });
    //        }
    //    });
    //}
    //$scope.GetAllPatientList = function () {
    //    $scope.loadingstatus = 'running';
    //    showPleaseWait();

    //    $http({
    //        method: 'POST',
    //        url: base_url + "Appointment/Transaction/GetAllPatientRegistration",
    //        dataType: "json"
    //    }).then(function (res) {

    //        $scope.loadingstatus = 'stop';
    //        hidePleaseWait();

    //        if (res.data.IsSuccess && res.data.Data) {
    //            $scope.PatientList = res.data.Data;
    //        } else
    //            Swal.fire(res.data.ResponseMSG);

    //    }, function (reason) {
    //        Swal.fire('Failed' + reason);
    //    });
    //}
})