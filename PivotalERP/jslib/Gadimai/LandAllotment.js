app.controller('LandAllotmentController', function ($scope, $http, $timeout, $filter, GlobalServices) {
    $scope.Title = 'ApplicantDetails';

    LoadData();

    function LoadData() {
        $('.select2').select2();
        $scope.confirmMSG = GlobalServices.getConfirmMSG();
        $scope.perPageColl = GlobalServices.getPerPageList();
        $scope.currentPages = {            
            AssignApplicant: 1,
            UnAssignApplicant: 1,
            Land: 1,
            Vacant:1,
        };

        $scope.searchData = {
            AssignApplicant: '',
            UnAssignApplicant:'',
            Land: '',
            Vacant:'',
        };

        $scope.perPage = {            
            AssignApplicant: GlobalServices.getPerPageRow(),
            UnAssignApplicant: GlobalServices.getPerPageRow(),
            Land: GlobalServices.getPerPageRow(),
            Vacant: GlobalServices.getPerPageRow(),
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

    $scope.SelectedLand = null;
    $scope.ChangeLandSelection = function (rowData, ind) {
        $scope.SelectedApplicant.TotalCost = 0;
        $scope.SelectedLand = null;
        var amt = 0;
        $scope.LandColl.forEach(function (l)
        {
            if (l.IsSelected == true) {
                amt = amt + isEmptyAmt(l.TotalAmount);
            }
        });

        $scope.SelectedApplicant.TotalCost = amt;

    }

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

  
    $scope.SaveLandAllotment = function () {

        var selectedLandColl = [];
        $scope.LandColl.forEach(function (vl) {
            if (vl.IsSelected == true) {
                selectedLandColl.push(vl);
            }
        });

        if (selectedLandColl.length==0 || !$scope.SelectedApplicant)
            return;
 
        var saveModify = $scope.newDet.Mode;
        Swal.fire({
            title: 'Do you want to  allot the current land to ' + $scope.SelectedApplicant.BillingName,
            showCancelButton: true,
            confirmButtonText: "Allot",
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed)
            {

                $scope.loadingstatus = "running";
                showPleaseWait();

                var tmpDataColl = [];
                selectedLandColl.forEach(function (SelectedLand) {
                    var newData = angular.copy($scope.SelectedApplicant);
                    newData.LandTypeId = SelectedLand.LandTypeId;
                    newData.LandName = SelectedLand.LandName;

                    newData.Rate = SelectedLand.Rate;
                    newData.TentRate = SelectedLand.TentRate;
                    newData.WaterRate = SelectedLand.WaterRate;
                    newData.ElectricityRate = SelectedLand.ElectricityRate;
                    newData.OthersRate = SelectedLand.OthersRate;
                    newData.OtherHeading = SelectedLand.OtherHeading;
                    tmpDataColl.push(newData);
                });

                
                
                $http({
                    method: 'POST',
                    url: base_url + "Gadhimai/Creation/SaveLandAllotment",
                    headers: { 'Content-Type': undefined },
                    transformRequest: function (data) {
                        var formData = new FormData();
                        formData.append("jsonData", angular.toJson(data.jsonData));                        
                        return formData;
                    },
                    data: { jsonData: tmpDataColl }
                }).then(function (res) {
                    $scope.loadingstatus = "stop";
                    hidePleaseWait();
                    Swal.fire(res.data.ResponseMSG);
                    if (res.data.IsSuccess == true) {
                        $scope.lastTranId = res.data.Data.RId;
                        $scope.Print();

                        $('#mdlPendingBills').modal('hide');
                        $scope.GetUnassignApplicant();                        
                    }
                }, function (errormessage) {
                    hidePleaseWait();
                    $scope.loadingstatus = "stop";
                });
            
            }
        });

       
    }

    $scope.GetUnassignApplicant = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();
        $scope.UnAssingApplicantColl = [];
        $http({
            method: 'GET',
            url: base_url + "Gadhimai/Creation/GetUnassignApplicant",
            dataType: "json"
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.UnAssingApplicantColl = res.data.Data;

            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    }


    $scope.SelectedApplicant = null;
    $scope.GetBlankLand = function (rowData, ind) {
        $scope.SelectedApplicant = rowData;
        $scope.loadingstatus = "running";
        showPleaseWait();
        $scope.LandColl = [];
        $http({
            method: 'GET',
            url: base_url + "Gadhimai/Creation/GetBlankLand",
            dataType: "json"
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.LandColl = res.data.Data;

                $('#mdlPendingBills').modal('show');
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    }

    $scope.GetVacantLand = function () {        
        $scope.loadingstatus = "running";
        showPleaseWait();
        $scope.VacantLandColl = [];
        $http({
            method: 'GET',
            url: base_url + "Gadhimai/Creation/GetBlankLand",
            dataType: "json"
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                res.data.Data.forEach(function (d) {
                    if (d.IsVacant == true) {
                        $scope.VacantLandColl.push(d);
                    }
                });
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    }

    $scope.GetAssignApplicant = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();
        $scope.AssingApplicantColl = [];
        $http({
            method: 'GET',
            url: base_url + "Gadhimai/Creation/GetAssignApplicant",
            dataType: "json"
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.AssingApplicantColl = res.data.Data;

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
                                                var newURL = base_url + "newpdfviewer.ashx?rpttranid=" + rptTranId + "&istransaction=true&entityid=" + EntityId + "&voucherid=0&tranid=" + TranId + "&vouchertype=0";
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
                            var newURL = base_url + "newpdfviewer.ashx?rpttranid=" + rptTranId + "&istransaction=true&entityid=" + EntityId + "&voucherid=0&tranid=" + TranId + "&vouchertype=0";
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