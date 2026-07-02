
$(document).ready(function () {

    //$(document).on('keyup', '.serial', function (e) {

    //    if (e.which == 13)
    //    {
    //        var key = e.charCode ? e.charCode : e.keyCode ? e.keyCode : 0;
    //        if (key == 13) {
    //            e.preventDefault();
    //            var inputs = $(this).closest('.serial').find(':input:visible');
    //            inputs.eq(inputs.index(this) + 1).focus();
    //        } 
    //    }
    //});

    //$(document).on('keydown', '.select2-selection', function (evt) {
    //    if (evt.which === 13) {
    //        console.log('Enter key');
    //        $(".select2").select2('close');
    //    }
    //});

    $('body').on('keydown', '.serial,.select2-selection', function (e) {

        if (e.shiftKey) {
            if (e.key === "Enter") {
                var self = $(this),
                    form = self.parents('form:eq(0)'),
                    focusable, next;
                focusable = form.find('input,a,select,button,textarea').filter(':visible').filter('.serial');
                next = focusable.eq(focusable.index(this) - 1);
                if (next.length) {
                    next.focus();
                } else {
                    form.submit();
                }
                return false;
            }
        }
        if (e.key === "Enter") {
            var self = $(this),
                form = self.parents('form:eq(0)'),
                focusable, next;

            focusable = form.find('input,a,select,button,textarea').filter('.serial').filter(':visible').filter(':enabled').filter('.hideside');
            next = focusable.eq(focusable.index(this) + 1);

            var findSelect2 = next.filter('.select2');

            if (findSelect2 && findSelect2.length > 0) {
                next.focus();
                next.select2("focus");
            }
            else {
                if (next.length) {
                    next.focus();
                } else {
                    form.submit();
                }
                return false;
            }

        }
    });


});

app.controller('ssfClaimController', function ($scope, $http, $timeout, $filter, GlobalServices) {
    $scope.Title = 'SSF Claim';
    var glSrv = GlobalServices;
    LoadData();

   
    function LoadData() {

        $scope.SearchPatientId = 0; 
        $scope.ESSIDColl = [];
        $scope.SchemeTypeColl = [{ id: 1, text: 'Accidental', value: 'Accidental' }, { id: 2, text: 'Medical', value: 'Medical' }];
        $scope.SubProductCol = [{ id: 1, text: 'Medical expenses(IP)' }, { id: 2, text: 'Medical expenses(OP)' }, { id: 3, text: 'Maternity expenses(IP)' }, { id: 4, text: 'Merernity expenses(OP)' },
            { id: 5, text: 'Medical expenses(Newly born child IP)' }, { id: 6, text: ' Medical expenses(Newly born child OP)' }, { id:10, text: 'Occupational Diseases(Medical Expenses)' },
            { id: 11, text: 'Occupational Diseases(Temporary total disability)' }, { id: 12, text: ' Occupational Diseases(Permanent disability)' }, { id: 13, text: 'Occupational Diseases(Total Permanent disability)' },
            { id: 14, text: ' Employment related accident(Medical expenses)' }, { id: 15, text: 'Employment related accident(Temporary total disability)' }, { id: 16, text: 'Employment related accident(Permanent disability)' }, { id: 17, text: 'Employment related accident(Total Permanent disability)' },
            { id: 18, text: 'Other accident(Except employment related)' }  ];
         
        $scope.DischargeTypeColl = [{ id: 1, text: 'Normal' }];

        $scope.beData = {
            TranId: 0,
            schemeType: 2,
            AttechFiles: [],
        };

        $scope.DiagnosisColl = [];

        $http({
            method: 'GET',
            url: base_url + "Inventory/Transaction/GetSSFDiagnosis",
            dataType: "json",
            //data: JSON.stringify(para)
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {             
                $scope.DiagnosisColl = res.data.Data
                $scope.DiagnosisColl_Qry = mx(res.data.Data);
            } else {
                alert(res.data.ResponseMSG);
            }
        }, function (reason) {
            alert('Failed' + reason);
        });

        $scope.DocumentTypeList = [];
        $http({
            method: 'GET',
            url: base_url + "Global/GetDocumentTypes",
            dataType: "json", 
        }).then(function (res) {
            if (res.data.IsSuccess && res.data.Data) {
                $scope.DocumentTypeList = res.data.Data
            } else {
                alert(res.data.ResponseMSG);
            }
        }, function (reason) {
            alert('Failed' + reason);
        });
    }
   
    $scope.filterSubProduct = function () {
        return function (item) {

            if ($scope.beData.schemeType == 1)
                return item.id >= 10;
            else
                return item.id < 9;
        }
    }

    $scope.PendingClaimIdColl = [];
    $scope.getPendingClaimId = function () {

        $scope.PendingClaimIdColl = [];

        if ($scope.SearchPatientId == 0)
            return;

        $timeout(function () {
            var para = {
                PatientNo: $scope.SearchPatientId
            };
            $scope.loadingstatus = "running";
            showPleaseWait();

            $http({
                method: 'POST',
                url: base_url + "Inventory/Transaction/getPendingSSFClaimId",
                dataType: "json",
                data: JSON.stringify(para)
            }).then(function (res) {
                $scope.loadingstatus = "stop";
                hidePleaseWait();
                if (res.data.IsSuccess && res.data.Data) {
                    $scope.PendingClaimIdColl = res.data.Data;                     
                } else {
                    alert(res.data.ResponseMSG);
                }
            }, function (reason) {
                alert('Failed' + reason);
            });
        });

    }
    $scope.getPatientDet = function () {
      
        if ($scope.SearchPatientId == 0 || !$scope.SelectedClaimId)
            return;

        $scope.beData.schemeType = $scope.SelectedClaimId.ServiceId;
        $scope.beData.subProduct = $scope.SelectedClaimId.ServiceTypeId;
        

        $timeout(function ()
        {
            var para = {
                PatientId: $scope.SelectedClaimId.PatientId,
                PatientNo: $scope.SelectedClaimId.PatientNo,
                ClaimId:$scope.SelectedClaimId.ClaimId
            };
            $scope.loadingstatus = "running";
            showPleaseWait();

            $http({
                method: 'POST',
                url: base_url + "Inventory/Transaction/getPatientDetailsForClaim",
                dataType: "json",
                data: JSON.stringify(para)
            }).then(function (res) {
                $scope.loadingstatus = "stop";
                hidePleaseWait();

                if (res.data.IsSuccess && res.data.Data) {
                    $scope.ESSIDColl = [];
                    $scope.beData = res.data.Data.ClaimData;
                    $scope.beData.AttachmentList = angular.copy($scope.DocumentTypeList);
                    $scope.beData.schemeType = $scope.SelectedClaimId.ServiceId;
                    $scope.beData.subProduct = $scope.SelectedClaimId.ServiceTypeId;

                    $scope.LedgerVoucher = res.data.Data.LedgerVoucher;

                    if (!$scope.beData.DiagnosisList || $scope.beData.DiagnosisList.length == 0) {
                        $scope.beData.DiagnosisList = [];
                        $scope.beData.DiagnosisList.push({});
                    }

                    if ($scope.beData.ESSId1) {
                        $scope.ESSIDColl.push({ value: $scope.beData.ESSId1,text:$scope.beData.ComName1 });
                    }
                    if ($scope.beData.ESSId2) {
                        $scope.ESSIDColl.push({ value: $scope.beData.ESSId2, text: $scope.beData.ComName2 });
                    }
                    
                    $scope.beData.S_Qty = 0;
                    $scope.beData.S_Amount = 0;
                    $scope.beData.S_SSFAmount = 0;

                    $scope.beData.M_Qty = 0;
                    $scope.beData.M_Amount = 0;
                    $scope.beData.M_SSFAmount = 0;

                    angular.forEach($scope.beData.ServiceList, function (sl) {
                        $scope.beData.S_Qty = $scope.beData.S_Qty + sl.Qty;
                        $scope.beData.S_Amount = $scope.beData.S_Amount + sl.Amount;
                        $scope.beData.S_SSFAmount = $scope.beData.S_SSFAmount + sl.SSFAmount;
                    });
                    angular.forEach($scope.beData.MedicineList, function (sl) {
                        $scope.beData.M_Qty = $scope.beData.M_Qty + sl.Qty;
                        $scope.beData.M_Amount = $scope.beData.M_Amount + sl.Amount;
                        $scope.beData.M_SSFAmount = $scope.beData.M_SSFAmount + sl.SSFAmount;
                    });
                  
                } else {
                    alert(res.data.ResponseMSG);
                }
            }, function (reason) {
                alert('Failed' + reason);
            });
        });

    }

    $scope.PrintClaim = function () {

        if ($scope.SearchPatientId == 0 || !$scope.SelectedClaimId)
            return;

        $timeout(function () {
            var para = {
                PatientId: $scope.SelectedClaimId.PatientId,
                PatientNo: $scope.SelectedClaimId.PatientNo,
                ClaimId: $scope.SelectedClaimId.ClaimId,
            };
            $scope.loadingstatus = "running";
            showPleaseWait();

            $http({
                method: 'POST',
                url: base_url + "Inventory/Transaction/PrintSSFClaim",
                dataType: "json",
                data: JSON.stringify(para)
            }).then(function (res) {
                $scope.loadingstatus = "stop";
                hidePleaseWait();

                if (res.data.IsSuccess && res.data.Data) {
                   var printData = res.data.Data;
                    var newURL = base_url + printData.ResponseMSG;
                    window.open(newURL);
                } else {
                    alert(res.data.ResponseMSG);
                }
            }, function (reason) {
                alert('Failed' + reason);
            });
        });

    }

    $scope.AddDisgnosis = function (ind) {
        if ($scope.beData.DiagnosisList) {
            if ($scope.beData.DiagnosisList.length > ind + 1) {
                $scope.beData.DiagnosisList.splice(ind + 1, 0, {
                   
                })
            } else {
                $scope.beData.DiagnosisList.push({
                   
                })
            }
        }
    };
    $scope.delDisgnosis = function (ind) {
        if ($scope.beData.DiagnosisList) {
            if ($scope.beData.DiagnosisList.length > 1) {
                $scope.beData.DiagnosisList.splice(ind, 1);
            }
        }
    };

    $scope.ChangeDiagnosis = function (dg) {
        if (dg) {
            dg.DiagnosisCode = '';
            if (dg.DiagnosisId > 0) {
                var findDG = $scope.DiagnosisColl_Qry.firstOrDefault(p1 => p1.DiagnosisId == dg.DiagnosisId);
                if (findDG) {
                    dg.DiagnosisCode = findDG.Alias;
                    dg.Name = findDG.Name;
                    dg.Alias = findDG.Alias;
                }
            }
        }
    }
    $scope.IsValidData = function () {
        var result = true;
        if ($scope.beData.schemeType==0)
        {
            Swal.fire('Please ! Select Scheme Type');
            result = false;
            return result;
        }

        if ($scope.beData.subProduct == 0) {
            Swal.fire('Please ! Select Sub Product ');
            result = false;
            return result;
        }

        if ($scope.beData.ESSId == null || $scope.beData.ESSId == undefined || $scope.beData.ESSId.isEmpty())
        {
            Swal.fire('Please ! Select Company Name ');
            result = false;
            return result;
        }

        //if (!$scope.beData.AttechFiles || $scope.beData.AttechFiles.length == 0) {
        //    Swal.fire('Please ! Attach Doctor Prescription Document and Discharge Summary Document ');
        //    result = false;
        //    return result;
        //}
        //if ($scope.beData.PartyLedgerId) {
        //    if ($scope.beData.PartyLedgerId == null || $scope.beData.PartyLedgerId == 0) {
        //        result = false;
        //        Swal.fire('Please ! Select Valid Party Name');
        //    }
        //} else {
        //    result = false;
        //    Swal.fire('Please ! Select Valid Party Name');
        //}

  

        return result;
    }
    $scope.ClearFields = function () {

        $scope.PendingClaimIdColl = [];
        $scope.SelectedClaimId = null;
        $scope.SelectedClaimId = null;
        $scope.SearchPatientId = null;

        $scope.beData = {
            TranId: 0,
            AttechFiles: [],
        }; 

    }
    $scope.SaveSSFClaim = function () {

        if ($scope.IsValidData() == true) {

            $scope.beData.OPDSSFAmount = $scope.beData.Amount;
            $scope.beData.ClientClaimId = $scope.SelectedClaimId.ClaimId;
            $timeout(function () {
                var saveModify = $scope.beData.TranId > 0 ? 'Modify' : 'Save';
                Swal.fire({
                    title: 'Do you want to ' + saveModify + ' the current data?',
                    showCancelButton: true,
                    confirmButtonText: saveModify,
                }).then((result) => {
                    /* Read more about isConfirmed, isDenied below */
                    if (result.isConfirmed) {
                        $scope.loadingstatus = "running";
                        showPleaseWait();

                        $http({
                            method: 'POST',
                            url: base_url + "Inventory/Transaction/SaveSSFClaim",
                            headers: { 'Content-Type': undefined },

                            transformRequest: function (data) {

                                var formData = new FormData();
                                formData.append("jsonData", angular.toJson(data.jsonData));


                                angular.forEach($scope.beData.AttachmentList, function (Doc)
                                {
                                    if (Doc.File_TMP && Doc.File_TMP.length > 0) {                                        
                                        formData.append("file"+Doc.DocumentTypeId, Doc.File_TMP[0]);
                                    }
                                    
                                });
                                

                                return formData;
                            },
                            data: { jsonData: $scope.beData  }
                        }).then(function (res) {

                            $scope.loadingstatus = "stop";
                            hidePleaseWait();
                            Swal.fire(res.data.ResponseMSG);

                            if (res.data.IsSuccess == true) {
                                $scope.ClearFields();
                                $scope.SearchPatientId = '';
                            }


                        }, function (errormessage) {
                            hidePleaseWait();
                            $scope.loadingstatus = "stop";

                        });
                    }
                });
            });
             
        }


    }

    $scope.ChangeSchemeType = function () {
        var ssfPer = 80;
        if ($scope.beData.schemeType == 1)
            ssfPer = 100;
        else if ($scope.beData.schemeType == 2)
            ssfPer = 80;

        $scope.beData.S_Qty = 0;
        $scope.beData.S_Amount = 0;
        $scope.beData.S_SSFAmount = 0;

        $scope.beData.M_Qty = 0;
        $scope.beData.M_Amount = 0;
        $scope.beData.M_SSFAmount = 0;

        $scope.beData.OPDSSFAmount = $scope.beData.Amount * ssfPer / 100;

        angular.forEach($scope.beData.ServiceList, function (sl) {
            sl.SSFAmount = sl.Amount * ssfPer / 100;

            $scope.beData.S_Qty = $scope.beData.S_Qty + sl.Qty;
            $scope.beData.S_Amount = $scope.beData.S_Amount + sl.Amount;
            $scope.beData.S_SSFAmount = $scope.beData.S_SSFAmount + sl.SSFAmount;
        });
        angular.forEach($scope.beData.MedicineList, function (sl) {
            sl.SSFAmount = sl.Amount * ssfPer / 100;

            $scope.beData.M_Qty = $scope.beData.M_Qty + sl.Qty;
            $scope.beData.M_Amount = $scope.beData.M_Amount + sl.Amount;
            $scope.beData.M_SSFAmount = $scope.beData.M_SSFAmount + sl.SSFAmount;
        });
         
    }


    var BASE64_MARKER = ';base64,';

    // Does the given URL (string) look like a base64-encoded URL?
    function isDataURI(url) {
        return url.split(BASE64_MARKER).length === 2;
    };
    function dataURItoFile(dataURI) {
        if (!isDataURI(dataURI)) { return false; }

        // Format of a base64-encoded URL:
        // data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAYAAAAEOCAIAAAAPH1dAAAAK
        var mime = dataURI.split(BASE64_MARKER)[0].split(':')[1];
        var filename = 'dataURI-file-' + (new Date()).getTime() + '.' + mime.split('/')[1];
        //var filename = 'dataURI-file-' + (new Date()).getTime() + '.jpeg';
        var bytes = atob(dataURI.split(BASE64_MARKER)[1]);
        var writer = new Uint8Array(new ArrayBuffer(bytes.length));

        for (var i = 0; i < bytes.length; i++) {
            writer[i] = bytes.charCodeAt(i);
        }

        return new File([writer.buffer], filename, { type: mime });
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
            $('#PersonalImg').modal('show');
        } else if (item.PhotoPath && item.PhotoPath.length > 0) {
            $scope.viewImg.ContentPath = item.PhotoPath;
            $scope.viewImg.FileType = 'image';  // Assuming PhotoPath is for images
            $('#PersonalImg').modal('show');
        } else if (item.File_TMP && item.File_TMP.length>0) {
            var blob = new Blob([item.File_TMP[0]], { type: item.File_TMP[0].type });
            $scope.viewImg.ContentPath = URL.createObjectURL(blob);
            $scope.viewImg.FileType = item.File_TMP[0].type.startsWith('image/') ? 'image' : 'pdf';

            if ($scope.viewImg.FileType === 'pdf') {
                document.getElementById('pdfViewer').src = $scope.viewImg.ContentPath;
            }

            $('#PersonalImg').modal('show');
        } else {
            Swal.fire('No Image Found');
        }
    };

});