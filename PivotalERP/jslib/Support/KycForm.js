app.controller('KycController', function ($scope, GlobalServices, $http, $timeout) {
    $scope.Title = 'KYCForm';

    OnClickDefault();

    $scope.LoadData = function () {
        $('.select2').select2();
        $scope.confirmMSG = GlobalServices.getConfirmMSG();
        $scope.perPageColl = GlobalServices.getPerPageList();
        $scope.ProvinceColl = GetStateList();
        $scope.DistrictColl = GetDistrictList();
        $scope.ProvinceColl_Qry = mx($scope.ProvinceColl);
        $scope.DistrictColl_Qry = mx($scope.DistrictColl);

        $scope.DocumentTypeList = [
            { id: 1, text: 'PAN' },
            { id: 2, text: 'Company Registration' },
            { id: 3, text: 'Tax Clearance' },
            { id: 4, text: 'Logo' },
            { id: 5, text: 'Others' },
        ];

        $scope.statusColl = [{ id: 1, text: 'Active' }, { id: 2, text: 'Deactive' }];


        $scope.DocumentTypeList = [];
        $http({
            method: 'GET',
            url: base_url + "Master/Creation/GetAllDocumentType",
            dataType: "json"
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.DocumentTypeList = res.data.Data;
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        $scope.DesignationList = [];
        $http({
            method: 'GET',
            url: base_url + "Master/Creation/GetAllDesignation",
            dataType: "json"
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.DesignationList = res.data.Data;
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

      
        $scope.newDet = {
            CompanyCode: null,
            CompanyName: '',
            BillingName: '',
            CompanyRegdNo: null,
            CompanyPanNo: null,
            CompanyContactNo: '',
            CompanyEmailId: '',
            ProvinceState: '',
            District: '',
            LocalLevel: '',
            status: '',
            FullAddress: '',           
            CountryId: 1,
            Latitude: '',
            Longitude: '',
            AssociateOrganization: '',
            Website: '',
            RemarksIfAny: '',
            AttachmentColl: [],
            ContactDetColl: [], 
            Mode: 'Save'
        };
        $scope.newDet.ContactDetColl.push({});

        $scope.newDetFilter = {};
    }


    $scope.ClearPhoto = function () {
        $timeout(function () {
            $scope.$apply(function () {
                $scope.newDet.LogoData = null;
                $scope.newDet.Logo_TMP = [];
                $scope.newDet.Logopath = '';
            });

        });

        $('#imgPhoto1').attr('src', '');

    };

    //***********Add Delete function for child Table

    $scope.AddConctactDet = function (ind) {
        if ($scope.newDet.ContactDetColl) {
            if ($scope.newDet.ContactDetColl.length > ind + 1) {
                $scope.newDet.ContactDetColl.splice(ind + 1, 0, {
                    ClassName: ''
                })
            } else {
                $scope.newDet.ContactDetColl.push({
                    ClassName: ''
                })
            }
        }
    };
    $scope.delConctactDet = function (ind) {
        if ($scope.newDet.ContactDetColl) {
            if ($scope.newDet.ContactDetColl.length > 1) {
                $scope.newDet.ContactDetColl.splice(ind, 1);
            }
        }
    };




    //***********Add Delete function for child Table



    $scope.ClearAddressBook = function () {
        $scope.newDet = {
            CompanyCode: null,
            CompanyName: '',
            BillingName: '',
            CompanyRegdNo: null,
            CompanyPanNo: null,
            CompanyContactNo: '',
            CompanyEmailId: '',
            ProvinceState: '',
            District: '',
            LocalLevel: '',
            status: '',
            FullAddress: '',
            CountryId: 1,
            Latitude: '',
            Longitude: '',
            AssociateOrganization: '',
            Website: '',
            RemarksIfAny: '',
            AttachmentColl: [],
            ContactDetColl: [],
            Mode: 'Save'
        };
        $scope.newDet.ContactDetColl.push({});

    }


    //*********************************CRUDE Start For Dealer

    $scope.delDocunemtDet = function (ind) {
        if ($scope.newDet.AttachmentColl) {
            if ($scope.newDet.AttachmentColl.length > 0) {
                $scope.newDet.AttachmentColl.splice(ind, 1);
            }
        }
    };

    $scope.AddMoreFiles = function (files, docType, des) {
        if (files && docType) {
            if (files != null && docType != null) {
                angular.forEach(files, function (file) {
                    $scope.newDet.AttachmentColl.push({
                        DocumentTypeId: docType.DocumentTypeId,
                        DocumentTypeName: docType.Name,
                        File: file,
                        Name: file.name,
                        Type: file.type,
                        Size: file.size,
                        Description: des,
                        Path: null
                    });
                })
                $scope.docType = null;
                $scope.attachFile = null;
                $scope.docDescription = '';

                $('#flMoreFiles').val('');
            }
            else {
                alert('Document Type or Document in missing ')
            }
        }
    };

    $scope.IsValidAddressBook = function () {
        if ($scope.newDet.CompanyName.isEmpty()) {
            Swal.fire('Please ! Enter Company Name');
            return false;
        }
        return true;
    }

    $scope.SaveUpdateAddressBook = function () {
        if ($scope.IsValidAddressBook() == true) {
            if ($scope.confirmMSG.Accept == true) {
                var saveModify = $scope.newDet.Mode;
                Swal.fire({
                    title: 'Do you want to ' + saveModify + ' the current data?',
                    showCancelButton: true,
                    confirmButtonText: saveModify,
                }).then((result) => {
                    if (result.isConfirmed) {
                        $scope.CallSaveUpdateAddressBook();
                    }
                });
            } else
                //$scope.CallSaveUpdateAddressBook();
        }
    };

    $scope.CallSaveUpdateAddressBook = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();

        var filesColl = $scope.newDet.AttachmentColl;

        $http({
            method: 'POST',
            url: base_url + "Marketing/Creation/SaveAddressBook",
            headers: { 'Content-Type': undefined },
            transformRequest: function (data) {
                var formData = new FormData();
                formData.append("jsonData", angular.toJson(data.jsonData));

                if (data.files) {
                    for (var i = 0; i < data.files.length; i++) {
                        formData.append("file" + i, data.files[i].File);
                    }
                }

                return formData;
            },
            data: { jsonData: $scope.newDet, files: filesColl }
        }).then(function (res) {
            $scope.loadingstatus = "stop";
            hidePleaseWait();
            Swal.fire(res.data.ResponseMSG);
            if (res.data.IsSuccess == true) {
                $scope.ClearAddressBook();
                $scope.GetAllAddressBook();
            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
        });
    }
      
});