app.controller("LCDetails", function ($scope, $http, GlobalServices, $timeout, $filter) {
    $scope.Title = 'LCDetails';

    $scope.loadingstatus = "stop";

    LoadData();

    $scope.IsValidLCDetails = function () {
        if ($scope.newDet.LedgerId > 0) {
        } else {
            Swal.fire("Please ! Enter Party Name");
            return false;
        }

        if (!$scope.newDet.IssuesDateDet) {
            Swal.fire("Please ! Enter Issue Date");
            return false;
        }

        if (!$scope.newDet.ExpiredDateDet) {
            Swal.fire("Please ! Enter Expire Date");
            return false;
        }

        return true;
    }



    function LoadData() {
        $('.select2').select2();
        $scope.loadingstatus = "stop";

        $scope.FromToColl = [{ id: 1, text: 'From' }, { id: 2, text: 'To' }];

        $scope.confirmMSG = GlobalServices.getConfirmMSG();
        $scope.perPageColl = GlobalServices.getPerPageList();


        $scope.perPage = {
            LCDetails: GlobalServices.getPerPageRow(),

        };
        $scope.searchData = {
            LCDetails: ''
        };
        $scope.currentPages = {
            LCDetails: 1

        };
         
        $timeout(function () {
            $scope.DocumentTypeList = [];
            $http({
                method: 'GET',
                url: base_url + "Global/GetDocumentTypes",
                dataType: "json"
            }).then(function (res) {
                if (res.data.IsSuccess && res.data.Data) {
                    $scope.DocumentTypeList = res.data.Data;
                }
            }, function (reason) {
                Swal.fire('Failed' + reason);
            });
        });

        $scope.newDet = {
            TranId: null,
            FromTo: 1,
            LedgerId: null,
            BankName: '',
            BranchName: '',
            LCNo: '',
            Amount: 0,
            Tolerance: 0,
            TAmount: 0,
            IssuesDate_Tmp: new Date(),
            ExpiredDate_Tmp: new Date(),
            LastDateOfShipment_Tmp: new Date(),
            PaymentTermsInDays: 0,
            Remarks: '',
            Status: true,            
            DeActiveBy: null,
            Reason: '',
            DeActiveDateTime: null,
            MarginHoldAmt: 0,
            BranchId: null,
            TotalDr: 0,
            TotalCr: 0,
            Mode: 'Save',
            DocumentColl: []
        };

    };
    $scope.ClearFields = function () {
        $scope.loadingstatus = "stop";
        $scope.newDet = {
            TranId: null,
            FromTo: 1,
            LedgerId: null,
            BankName: '',
            BranchName: '',
            LCNo: '',
            Amount: 0,
            Tolerance: 0,
            TAmount: 0,
            IssuesDate_Tmp: new Date(),
            ExpiredDate_Tmp: new Date(),
            LastDateOfShipment_Tmp: new Date(),
            PaymentTermsInDays: 0,
            Remarks: '',
            Status: true,            
            DeActiveBy: null,
            Reason: '',
            DeActiveDateTime: null,
            MarginHoldAmt: 0,
            BranchId: null,
            TotalDr: 0,
            TotalCr: 0,
            Mode: 'Save',
            DocumentColl: []
        };

    }

    $scope.CurDocument = {};


    $scope.AddMoreFiles = function (files, docType, des) {
        if (files && docType) {
            if (files != null && docType != null) {
                angular.forEach(files, function (file) {
                    $scope.newDet.DocumentColl.push({
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
                document.getElementById('flMoreFiles').value = null;
            }
        }
    };

    $scope.delAttachmentFiles = function (ind) {
        if ($scope.newDet.DocumentColl) {
            if ($scope.newDet.DocumentColl.length > 0) {
                $scope.newDet.DocumentColl.splice(ind, 1);
            }
        }
    }

    $scope.AddLCDetails = function () {
        if ($scope.IsValidLCDetails() == true) {
            if ($scope.confirmMSG.Accept == true) {
                var saveModify = $scope.newDet.Mode;
                Swal.fire({
                    title: 'Do you want to' + saveModify + 'the current data?',
                    showCancelButton: true,
                    confirmButtonText: saveModify,
                }).then((result) => {
                    if (result.isConfirmed) {
                        $scope.CallSaveUpdateLCDetails();
                    }

                });
            }
            else
                $scope.CallSaveUpdateLCDetails();
        }
    };

    $scope.CallSaveUpdateLCDetails = function () {
        $scope.loadingstatus = 'running';
        showPleaseWait();

        if ($scope.newDet.IssuesDateDet) {
            var dDet = $scope.newDet.IssuesDateDet;
            $scope.newDet.IssuesDate = $filter('date')(new Date(dDet.dateAD), 'yyyy-MM-dd');
        }


        if ($scope.newDet.ExpiredDateDet) {
            var dDet = $scope.newDet.ExpiredDateDet;
            $scope.newDet.ExpiredDate = $filter('date')(new Date(dDet.dateAD), 'yyyy-MM-dd');
        }

        if ($scope.newDet.LastDateOfShipmentDet) {
            var dDet = $scope.newDet.LastDateOfShipmentDet;
            $scope.newDet.LastDateOfShipment = $filter('date')(new Date(dDet.dateAD), 'yyyy-MM-dd');
        }

        var filesColl = $scope.newDet.DocumentColl;

        $http({
            method: 'POST',
            url: base_url + "Account/Creation/SaveLCDetails",
            headers: { 'content-Type': undefined },

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
                $scope.ClearFields();
                $scope.GetAllLCDetails();
            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
        });
    }

    $scope.GetAllLCDetails = function () {

        $scope.LCDetailsColl = []; //declare an empty array

        if ($scope.loadingstatus != 'stop') {
            alert('Already Running Process')
            return;
        }

        $scope.loadingstatus = 'running';
        showPleaseWait();

        $http({
            method: 'Post',
            url: base_url + "Account/Creation/GetAllLCDetails",
            dataType: "json"
            //data:JSON.stringify(para)
        }).then(function (res) {

            $scope.loadingstatus = 'stop';
            hidePleaseWait();

            if (res.data.IsSuccess && res.data.Data) {
                $timeout(function () {
                    $scope.LCDetailsColl = res.data.Data;
                });
            } else
                Swal.fire(res.data.ResponseMSG);

        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

    }
    $scope.getLCDetailsById = function (newDet) {
        $scope.loadingstatus = "running";
        var para = {
            TranId: newDet.TranId
        };
        $http({
            method: 'POST',
            url: base_url + "Account/Creation/GetLCDetailsById",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $timeout(function () {
                    $scope.newDet = res.data.Data;

                    if ($scope.newDet.IssuesDate) {
                        $scope.newDet.IssuesDate_TMP = new Date($scope.newDet.IssuesDate);
                        $scope.newDet.IssuesDateAD_TMP = new Date($scope.newDet.IssuesDate);
                    }

                    if ($scope.newDet.ExpiredDate) {
                        $scope.newDet.ExpiredDate_TMP = new Date($scope.newDet.ExpiredDate);
                        $scope.newDet.ExpiredDateAD_TMP = new Date($scope.newDet.ExpiredDate);
                    }
                    if ($scope.newDet.LastDateOfShipment) {
                        $scope.newDet.LastDateOfShipment_TMP = new Date($scope.newDet.LastDateOfShipment);
                        $scope.newDet.LastDateOfShipmentAD_TMP = new Date($scope.newDet.LastDateOfShipment);
                    }
                    $scope.newDet.Mode = 'Modify';
                    $('#custom-tabs-four-profile-tab').tab('show');
                });
            } else
                Swal.fire(res.data.ResponseMSG);


        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    };

    $scope.deleteLCDetails = function (refData, ind) {

        Swal.fire({
            title: 'Are you sure you want to delete selected LCDetails ' + refData.BankName + '?',
            showCancelButton: true,
            confirmButtonText: 'Delete',
            //message: 'Are you sure to delete selected Branch :-' + newDet.Name,
        }).then((result) => {
            if (result.isConfirmed) {
                $scope.loadingstatus = "running";
                showPleaseWait();
                var para = { TranId: refData.TranId };
                $http({
                    method: 'POST',
                    url: base_url + "Account/Creation/DelLCDetails",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingstatus = "stop";
                    Swal.fire(res.data.ResponseMSG);
                    if (res.data.IsSuccess == true) {
                        $scope.LCDetailsColl.splice(ind, 1);
                    }
                }, function (reason) {
                    Swal.fire('Failed' + reason);

                });
            }

        });
    }

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
    $scope.ChangeDate = function (field, dateStyle) {
        $timeout(function () {

            if (field == 'IssuesDate') {
                if (dateStyle == 1) //AD
                {
                    if ($scope.newDet.IssuesDateADDet) {
                        $scope.newDet.IssuesDate_TMP = new Date($scope.newDet.IssuesDateADDet.dateAD);
                    }
                }
                else if (dateStyle == 2) //BS
                {
                    if ($scope.newDet.IssuesDateDet) {
                        $scope.newDet.IssuesDateAD_TMP = new Date($scope.newDet.IssuesDateDet.dateAD);
                    }
                }
            }
            else if (field == 'ExpiredDate') {
                if (dateStyle == 1) //AD
                {
                    if ($scope.newDet.ExpiredDateADDet) {
                        $scope.newDet.ExpiredDate_TMP = new Date($scope.newDet.ExpiredDateADDet.dateAD);
                    }
                }
                else if (dateStyle == 2) //BS
                {
                    if ($scope.newDet.ExpiredDateDet) {
                        $scope.newDet.ExpiredDateAD_TMP = new Date($scope.newDet.ExpiredDateDet.dateAD);
                    }
                }
            }
            else if (field == 'LastDateOfShipment') {
                if (dateStyle == 1) //AD
                {
                    if ($scope.newDet.LastDateOfShipmentADDet) {
                        $scope.newDet.LastDateOfShipment_TMP = new Date($scope.newDet.LastDateOfShipmentADDet.dateAD);
                    }
                }
                else if (dateStyle == 2) //BS
                {
                    if ($scope.newDet.LastDateOfShipmentDet) {
                        $scope.newDet.LastDateOfShipmentAD_TMP = new Date($scope.newDet.LastDateOfShipmentDet.dateAD);
                    }
                }
            }
        });
    }
});