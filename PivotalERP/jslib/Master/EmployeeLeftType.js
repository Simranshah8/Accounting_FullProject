app.controller('EmployeeLeftTypeController', function ($scope, $http, $timeout, $filter, GlobalServices) {
    $scope.Title = 'EmployeeLeftType';

    LoadData();

   function LoadData() {
        $('.select2').select2();
        $scope.confirmMSG = GlobalServices.getConfirmMSG();
        $scope.perPageColl = GlobalServices.getPerPageList();
		$scope.EmployeeSearchOptions = GlobalServices.getEmployeeSearchOptions();
       $scope.currentPages = {
            EmployeeLeftType: 1,
        };

        $scope.searchData = {
            EmployeeLeftType: '',

        };

        $scope.perPage = {
            EmployeeLeftType: GlobalServices.getPerPageRow()
        };



        //for document
        $scope.DocumentList = [];
        $http({
            method: 'GET',
            url: base_url + "Payroll/Master/GetAllDocument",
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

        $scope.LeftList = [];
        $http({
            method: 'GET',
            url: base_url + "Payroll/Master/GetAllLeftType",
            dataType: "json"
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.LeftList = res.data.Data;
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        $scope.newDet = {
            EmpLeftTypeId: null,
            EmployeeId: '',
            LeftDate_TMP: '',
            EffectiveDate_TMP: '',
            LeftTypeId: null,
            Reason: '',
            ApprovedBy: null,
            ApprovedRemarks: null,
            VerifiedBy: null,
            VerifiedRemarks: null,
			SelectEmployee: $scope.EmployeeSearchOptions[0].value,
            AttachmentColl: [],

            Mode: 'Save'
        };

        //$scope.GetAllEmployeeLeftType();

    };

    $scope.ClearEmployeeLeftType = function () {
        $scope.newDet = {
            EmpLeftTypeId: null,
            EmployeeId: '',
            LeftDate_TMP: '',
            EffectiveDate_TMP: '',
            LeftTypeId: null,
            Reason: '',
            ApprovedBy: null,
            ApprovedRemarks: null,
            VerifiedBy: null,
            VerifiedRemarks: null,
			SelectEmployee: $scope.EmployeeSearchOptions[0].value,
            AttachmentColl: [],

            Mode: 'Save'
        };
    }





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
    $scope.IsValidEmployeeLeftType = function () {
        /*if ($scope.newBaliType.GenderName.isEmpty()) {
            Swal.fire('Please ! Enter GenderName Name');
            return false;
        }*/
        return true;
    }

    $scope.SaveEmployeeLeftType = function () {
        if ($scope.IsValidEmployeeLeftType() == true) {
            if ($scope.confirmMSG.Accept == true) {
                var saveModify = $scope.newDet.Mode;
                Swal.fire({
                    title: 'Do you want to ' + saveModify + ' the current data?',
                    showCancelButton: true,
                    confirmButtonText: saveModify,
                }).then((result) => {
                    /* Read more about isConfirmed, isDenied below */
                    if (result.isConfirmed) {
                        $scope.CallSaveUpdateEmployeeLeftType();
                    }
                });
            } else
                $scope.CallSaveUpdateEmployeeLeftType();
        }
    };

    $scope.CallSaveUpdateEmployeeLeftType = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();
        var filesColl = $scope.newDet.AttachmentColl;
        if ($scope.newDet.LeftDateDet) {
            $scope.newDet.LeftDate = $filter('date')(new Date($scope.newDet.LeftDateDet.dateAD), 'yyyy-MM-dd');
        } else
            $scope.newDet.LeftDate = null;

        if ($scope.newDet.EffectiveDateDet) {
            $scope.newDet.EffectiveDate = $filter('date')(new Date($scope.newDet.EffectiveDateDet.dateAD), 'yyyy-MM-dd');
        } else
            $scope.newDet.EffectiveDate = null;

        $http({
            method: 'POST',
            url: base_url + "Payroll/Master/SaveEmployeeLeftType",
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
                $scope.ClearEmployeeLeftType();
                $scope.GetAllEmployeeLeftType();
                $('#approved').modal('hide');

            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
        });
    }



    $scope.GetAllEmployeeLeftType = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();
        $scope.EmployeeLeftTypeList = [];
        $http({
            method: 'GET',
            url: base_url + "Payroll/Master/GetAllEmployeeLeftType",
            dataType: "json"
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.EmployeeLeftTypeList = res.data.Data;

            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    }

    $scope.getEmployeeLeftTypeById = function (refData) {
        $scope.loadingstatus = "running";
        showPleaseWait();
        var para = {
            EmpLeftTypeId: refData.EmpLeftTypeId
        };
        $http({
            method: 'POST',
            url: base_url + "Payroll/Master/getEmployeeLeftTypeId",
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

    $scope.getAppById = function (refData) {
        $scope.loadingstatus = "running";
        showPleaseWait();
        var para = {
            EmpLeftTypeId: refData.EmpLeftTypeId
        };
        $http({
            method: 'POST',
            url: base_url + "Payroll/Master/getEmployeeLeftTypeId",
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
                $('#approved').modal('show');

            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    };



    $scope.DelEmployeeLeftTypeById = function (refData, ind) {
        Swal.fire({
            title: 'Do you want to delete ' + refData.Name + '?',
            showCancelButton: true,
            confirmButtonText: 'Delete',
            //message: 'Are you sure to delete selected BaliType :-' + beData.Name,
        }).then((result) => {
            if (result.isConfirmed) {
                var para = {
                    EmpLeftTypeId: refData.EmpLeftTypeId
                };
                $http({
                    method: 'POST',
                    url: base_url + "Payroll/Master/DeleteEmployeeLeftType",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingStatus = "stop";

                    Swal.fire(res.data.ResponseMSG);
                    if (res.data.IsSuccess == true) {
                        $scope.GetAllEmployeeLeftType();
                    }
                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }

        });
    }





});