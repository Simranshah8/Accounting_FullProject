app.controller('ApplicantDetailsController', function ($scope, $http, $timeout, $filter, GlobalServices) {
    $scope.Title = 'ApplicantDetails';

    LoadData();

    function LoadData() {
        $('.select2').select2();
        $scope.confirmMSG = GlobalServices.getConfirmMSG();
        $scope.perPageColl = GlobalServices.getPerPageList();
        $scope.currentPages = {
            ApplicantDetails: 1,
        };

        $scope.searchData = {
            ApplicantDetails: '',

        };

        $scope.perPage = {
            ApplicantDetails: GlobalServices.getPerPageRow()
        };


        $scope.ApplicantTypeColl = [
            { id: 1, text: 'Personal' },
            { id: 2, text: 'Company' }
        ]

        $scope.LandTypeList = [];
        $http({
            method: 'GET',
            url: base_url + "Gadhimai/Creation/GetAllLandType",
            dataType: "json"
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.LandTypeList = res.data.Data;
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        $scope.DocumentList = [];
        $http({
            method: 'GET',
            url: base_url + "HR/Master/GetAllDocument",
            dataType: "json"
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.DocumentList = res.data.Data;
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        $scope.newDet = {
            ApplicantDetailsId: null,
            ApplicantTypeId: 1,
            Company: '',
            FirstName: '',
            MiddleName: '',
            LastName: '',
            Photo: '',
            Address: '',
            ShopType: '',
            LandArea: 0,
            Amount: 0,
            ContactNo: '',
            LandTypeId: null,
            AttachmentColl: [],
            Mode: 'Save'
        };

        //$scope.GetAllApplicantDetails();

    };

    $scope.ClearApplicantDetails = function () {
        $scope.ClearPhoto();
        $scope.newDet = {
            ApplicantDetailsId: null,
            ApplicantTypeId: 1,
            Company: '',
            FirstName: '',
            MiddleName: '',
            LastName: '',
            Photo: '',
            Address: '',
            ShopType: '',
            LandArea: 0,
            Amount: 0,
            ContactNo: '',
            LandTypeId: null,
            AttachmentColl: [],
            Mode: 'Save'
        };
    }


    $scope.ClearPhoto = function () {
        $timeout(function () {
            $scope.$apply(function () {
                $scope.newDet.PhotoData = null;
                $scope.newDet.Photo_TMP = [];
            });

        });
        $('#imgEmp').attr('src', '');
        $('#imgPhoto1').attr('src', '');
    };

    $scope.calculateAmount = function () {
        if ($scope.newDet.LandTypeId && $scope.newDet.LandArea) {
            // Find the selected land type based on LandTypeId
            const selectedLandType = $scope.LandTypeList.find(landType => landType.LandTypeId === $scope.newDet.LandTypeId);
            if (selectedLandType) {
                const rate = selectedLandType.Rate || 0; // Assuming 'Rate' is a property in each land type
                $scope.newDet.Amount = rate * $scope.newDet.LandArea;
            } else {
                Swal.fire("Selected land type not found.");
            }
        }
    };





    $scope.delAttachmentDoc = function (ind) {
        if ($scope.newDet.AttachmentColl) {
            if ($scope.newDet.AttachmentColl.length > 0) {
                $scope.newDet.AttachmentColl.splice(ind, 1);
            }
        }
    };

    $scope.AddMoreFilesReceived = function (files, docType, des) {

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
        }
    };


    $scope.ShowPersonalImg = function (item) {
        $scope.viewImg = {
            ContentPath: '',
            FileType: null
        };

        if (item.DocPath && item.DocPath.length > 0) {
            $scope.viewImg.ContentPath = item.DocPath;
            $scope.viewImg.FileType = 'pdf';  // Assuming DocPath is for PDFs
            document.getElementById('pdfViewer').src = item.DocPath;
            $('#ImgDocView').modal('show');
        } else if (item.PhotoPath && item.PhotoPath.length > 0) {
            $scope.viewImg.ContentPath = item.PhotoPath;
            $scope.viewImg.FileType = 'image';  // Assuming PhotoPath is for images
            $('#ImgDocView').modal('show');
        } else if (item.File) {
            var blob = new Blob([item.File], { type: item.File?.type });
            $scope.viewImg.ContentPath = URL.createObjectURL(blob);
            $scope.viewImg.FileType = item.File.type.startsWith('image/') ? 'image' : 'pdf';

            if ($scope.viewImg.FileType === 'pdf') {
                document.getElementById('pdfViewer').src = $scope.viewImg.ContentPath;
            }
            $('#ImgDocView').modal('show');
        } else {
            Swal.fire('No Image Found');
        }
    };


    //************************* Employee Left Type *********************************
    $scope.IsValidApplicantDetails = function () {
        //if ($scope.newDet.ApplicantTypeId == 1) {
        //    if ($scope.newDet.FirstName.isEmpty()) {
        //        Swal.fire('Please ! Enter First Name');
        //        return false;
        //    }
        //    if ($scope.newDet.LastName.isEmpty()) {
        //        Swal.fire('Please ! Enter Last Name');
        //        return false;
        //    }
        //}
        //if ($scope.newDet.ApplicantTypeId == 2) {
        //    if ($scope.newDet.Company.isEmpty()) {
        //        Swal.fire('Please ! Enter Company Name');
        //        return false;
        //    }
        //}
        return true;
    }

    $scope.SaveApplicantDetails = function () {
        if ($scope.IsValidApplicantDetails() == true) {
            if ($scope.confirmMSG.Accept == true) {
                var saveModify = $scope.newDet.Mode;
                Swal.fire({
                    title: 'Do you want to ' + saveModify + ' the current data?',
                    showCancelButton: true,
                    confirmButtonText: saveModify,
                }).then((result) => {
                    /* Read more about isConfirmed, isDenied below */
                    if (result.isConfirmed) {
                        $scope.CallSaveUpdateApplicantDetails();
                    }
                });
            } else
                $scope.CallSaveUpdateApplicantDetails();
        }
    };

    $scope.CallSaveUpdateApplicantDetails = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();
        var photo = $scope.newDet.Photo_TMP;
        var filesColl = $scope.newDet.AttachmentColl;
        $http({
            method: 'POST',
            url: base_url + "Gadhimai/Creation/SaveApplicantDetails",
            headers: { 'Content-Type': undefined },
            transformRequest: function (data) {
                var formData = new FormData();
                formData.append("jsonData", angular.toJson(data.jsonData));
                if (data.appPhoto && data.appPhoto.length > 0)
                    formData.append("photo", data.appPhoto[0]);

                if (data.files) {
                    for (var i = 0; i < data.files.length; i++) {
                        formData.append("file" + i, data.files[i].File);
                    }
                }
                return formData;
            },
            data: { jsonData: $scope.newDet, appPhoto: photo, files: filesColl }
        }).then(function (res) {
            $scope.loadingstatus = "stop";
            hidePleaseWait();
            Swal.fire(res.data.ResponseMSG);
            if (res.data.IsSuccess == true) {
                $scope.ClearApplicantDetails();
                $scope.GetAllApplicantDetails();
            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
        });
    }

    $scope.GetAllApplicantDetails = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();
        $scope.ApplicantDetailsList = [];
        $http({
            method: 'GET',
            url: base_url + "Gadhimai/Creation/GetAllApplicantDetails",
            dataType: "json"
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.ApplicantDetailsList = res.data.Data;

            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    }

    $scope.getApplicantDetailsById = function (refData) {
        $scope.loadingstatus = "running";
        showPleaseWait();
        var para = {
            ApplicantDetailsId: refData.ApplicantDetailsId
        };
        $http({
            method: 'POST',
            url: base_url + "Gadhimai/Creation/getApplicantDetailsId",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.newDet = res.data.Data;
                if ($scope.newDet.LeftDate)
                    $scope.newDet.LeftDate_TMP = new Date($scope.newDet.LeftDate);
                if ($scope.newDet.EffectiveDate)
                    $scope.newDet.EffectiveDate_TMP = new Date($scope.newDet.EffectiveDate);
                $scope.newDet.Mode = 'Update';
                $('#custom-tabs-four-profile-tab').tab('show');


            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    };

    $scope.DelApplicantDetailsById = function (refData, ind) {
        Swal.fire({
            title: 'Do you want to delete ' + refData.Name + '?',
            showCancelButton: true,
            confirmButtonText: 'Delete',
            //message: 'Are you sure to delete selected BaliType :-' + beData.Name,
        }).then((result) => {
            if (result.isConfirmed) {
                var para = {
                    ApplicantDetailsId: refData.ApplicantDetailsId
                };
                $http({
                    method: 'POST',
                    url: base_url + "Gadhimai/Creation/DeleteApplicantDetails",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingStatus = "stop";

                    Swal.fire(res.data.ResponseMSG);
                    if (res.data.IsSuccess == true) {
                        $scope.GetAllApplicantDetails();
                    }
                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }

        });
    }



    $scope.PrintVoucher = function (tranId) {
        $scope.lastTranId = tranId;
        $scope.Print();
    }
    $scope.Print = function () {
        if ($scope.lastTranId) {
            var TranId = $scope.lastTranId;


            $http({
                method: 'GET',
                url: base_url + "ReportEngine/GetReportTemplates?entityId=" + EntityId + "&voucherId=0&isTran=true",
                dataType: "json"
            }).then(function (res) {
                if (res.data.IsSuccess && res.data.Data) {
                    var templatesColl = res.data.Data;
                    if (templatesColl && templatesColl.length > 0) {
                        var templatesName = [];
                        var sno = 1;
                        angular.forEach(templatesColl, function (tc) {
                            templatesName.push(sno + '-' + tc.ReportName);
                            sno++;
                        });
                        var printDone = false;
                        var rptTranId = 0;
                        if (templatesColl.length == 1)
                            rptTranId = templatesColl[0].RptTranId;
                        else {
                            Swal.fire({
                                title: 'Report Templates For Print',
                                input: 'select',
                                inputOptions: templatesName,
                                inputPlaceholder: 'Select a template',
                                showCancelButton: true,
                                inputValidator: (value) => {
                                    return new Promise((resolve) => {
                                        if (value >= 0) {
                                            resolve()
                                            rptTranId = templatesColl[value].RptTranId;
                                            printDone = true;

                                            if (rptTranId > 0) {
                                                var newURL = base_url + "newpdfviewer.ashx?rpttranid=" + rptTranId + "&istransaction=true&entityid=" + EntityId + "&voucherid=0&tranid=" + TranId + "&vouchertype=0&ApplicantDetailsId="+TranId;
                                                window.open(newURL);
                                            }
                                        } else {
                                            resolve('You need to select:)')
                                        }
                                    })
                                }
                            })
                        }

                        if (rptTranId > 0) {
                            var newURL = base_url + "newpdfviewer.ashx?rpttranid=" + rptTranId + "&istransaction=true&entityid=" + EntityId + "&voucherid=0&tranid=" + TranId + "&vouchertype=0&ApplicantDetailsId=" + TranId;
                            window.open(newURL);
                        }

                    } else
                        Swal.fire('No Templates found for print');
                }
            }, function (reason) {
                Swal.fire('Failed' + reason);
            });
        }

    };


});