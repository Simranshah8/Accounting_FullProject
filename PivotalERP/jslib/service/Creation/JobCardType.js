app.controller("ControllJobCardType", function ($scope, $http, GlobalServices, $timeout) {
    $scope.Title = 'DebtorType';

    LoadData();


    function LoadData() {
        $scope.loadingstatus = "stop";

        $scope.confirmMSG = GlobalServices.getConfirmMSG();
        $scope.perPageColl = GlobalServices.getPerPageList();
         
        $scope.currentPages = {
            JobCardType: 1

        };

        $scope.searchData = {
            JobCardType: ''

        };

        $scope.perPage = {
            JobCardType: GlobalServices.getPerPageRow(),

        };

        $scope.JobTypeList = [];
        $http({
            method: 'GET',
            url: base_url + "Service/Creation/GetAllJobType",
            dataType: "json"
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.JobTypeList = res.data.Data;
                $scope.JobTypeList_Qry = mx(res.data.Data);
            }  
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        $scope.beData =
        {
            JobCardTypeId: 0,
            Name: '',
            Alias: '',
            JobType: '',
            JobTypeId:null,
            IsActive: true,
            JobCategory: '',
            SNo: 0,
            IsAmc:false,
            Mode: 'Save',
            IsWarranty: false,
            IsFreeService: false,
            WarrantyLedgerId: null,
            FreeServiceLedgerId:null,
        };

    };

    $scope.ClearFields = function () {
        $scope.loadingstatus = "stop";
        $scope.beData =
        {

            JobCardTypeId: 0,
            Name: '',
            Alias: '',
            JobType: '',
            IsActive: true,
            JobCategory: '',
            SNo: 0,
            IsAmc: false,
            Mode: 'Save',
            IsWarranty: false,
            IsFreeService: false,
            WarrantyLedgerId: null,
            FreeServiceLedgerId: null,
        };

        $scope.ClearSliderPhoto();

        $('#txtName').focus();
    }

    $scope.GetAllJobCardType = function () {


        $scope.JobCardTypeColl = []; //declare an empty array

        $scope.loadingstatus = 'running';
        showPleaseWait();

        $http({
            method: 'GET',
            url: base_url + "Service/Creation/GetAllJobCardType",
            dataType: "json"
            //data:JSON.stringify(para)
        }).then(function (res) {

            $scope.loadingstatus = 'stop';
            hidePleaseWait();

            if (res.data.IsSuccess && res.data.Data) {
                $timeout(function () {
                    $scope.JobCardTypeColl = res.data.Data;
                });
            } else
                alert(res.data.ResponseMSG);

        }, function (reason) {
            alert('Failed' + reason);
        });

    }
    $scope.ClearSliderPhoto = function () {
        $timeout(function () {
            $scope.$apply(function () {
                $scope.beData.PhotoData = null;
                $scope.beData.Photo_TMP = [];
                $scope.beData.ImagePath = '';
            });
        });
        $('input[type=file]').val('');
        $('#imgPhoto1').attr('src', '');

    };

    $scope.IsValidDebtorCreditorType = function () {
        if ($scope.beData.Name.isEmpty()) {
            Swal.fire("Please ! Enter Valid Debtor Creditor Name");
            return false;
        }
        else
            return true;
    }

    $scope.AddNewJobCardType = function () {
        if ($scope.IsValidDebtorCreditorType() == true) {
            if ($scope.confirmMSG.Accept == true) {
                var saveModify = $scope.beData.Mode;
                Swal.fire({
                    title: 'Do you want to' + saveModify + 'the current data?',
                    showCancelButton: true,
                    confirmButtonText: saveModify,
                }).then((result) => {
                    if (result.isConfirmed) {
                        $scope.CallSaveUpdateDebtorCreditorsType();
                    }

                });
            }
            else
                $scope.CallSaveUpdateDebtorCreditorsType();
        }
    };

    $scope.CallSaveUpdateDebtorCreditorsType = function () {
        $scope.loadingstatus = 'running';
        showPleaseWait();

        if ($scope.beData.JobTypeId > 0) {
            var findJT = $scope.JobTypeList_Qry.firstOrDefault(p1 => p1.JobTypeId == $scope.beData.JobTypeId);
            if (findJT) {
                $scope.beData.JobType = findJT.JobTypeName;
            }
        }

        if (!$scope.beData.ProductId)
            $scope.beData.ProductId = 0;

        $http({
            method: 'POST',
            url: base_url + "Service/Creation/SaveUpdateJobCardType",
            headers: { 'content-Type': undefined },

            transformRequest: function (data) {
                var formData = new FormData();
                formData.append("jsonData", angular.toJson(data.jsonData));
 
                return formData;
            },
            data: { jsonData: $scope.beData }
        }).then(function (res) {

            $scope.loadingstatus = "stop";
            hidePleaseWait();

            Swal.fire(res.data.ResponseMSG);
            if (res.data.IsSuccess == true) {
                $scope.ClearFields();
                $scope.GetAllJobCardType();
            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
        });
    }

    $scope.getJobCardTypeById = function (beData) {

        $scope.loadingstatus = "running";
        var para = {
            JobCardTypeId: beData.JobCardTypeId
        };
        $http({
            method: 'POST',
            url: base_url + "Service/Creation/getJobCardTypeById",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $timeout(function () {
                    $scope.beData = res.data.Data;
                    $scope.beData.Mode = 'Modify';
                    $('#custom-tabs-four-profile-tab').tab('show');
                });
            } else
                Swal.fire(res.data.ResponseMSG);

        }, function (reason) {
            alert('Failed' + reason);
        });
    }

    $scope.deleteJobCardType = function (refData, ind) {

        Swal.fire({
            title: 'Are you sure to delete selected DebtorCreditor Type :-' + refData.Name,
            showCancelButton: true,
            confirmButtonText: 'Delete',
        }).then((result) => {
            if (result.isConfirmed) {
                $scope.loadingstatus = "running";
                showPleaseWait();

                var para = {
                    JobCardTypeId: refData.JobCardTypeId
                };

                $http({
                    method: 'POST',
                    url: base_url + "Service/Creation/DeleteJobCardType",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingstatus = "stop";
                    Swal.fire(res.data.ResponseMSG);
                    if (res.data.IsSuccess) {
                        $scope.JobCardTypeColl.splice(ind, 1);
                    }

                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }
        });

    }
    


});