app.controller('CtrlJobEntity', function ($scope, $filter, $http, $timeout, GlobalServices) {
    $scope.Title = 'JobEntity';

    LoadData();

    function LoadData() {

         
        $scope.cronOptions = {
            formInputClass: 'form-control cron-gen-input', // Form input class override
            formSelectClass: 'form-control cron-gen-select', // Select class override
            formRadioClass: 'cron-gen-radio', // Radio class override
            formCheckboxClass: 'cron-gen-checkbox', // Radio class override
            hideMinutesTab: false, // Whether to hide the minutes tab
            hideHourlyTab: false, // Whether to hide the hourly tab
            hideDailyTab: false, // Whether to hide the daily tab
            hideWeeklyTab: false, // Whether to hide the weekly tab
            hideMonthlyTab: false, // Whether to hide the monthly tab
            hideYearlyTab: false, // Whether to hide the yearly tab
            hideAdvancedTab: true, // Whether to hide the advanced tab
            use24HourTime: false, // Whether to show AM/PM on the time selectors
            hideSeconds: true // Whether to show/hide the seconds time picker
        };

        $('.select2').select2();
        $scope.loadingstatus = "stop";
        $scope.confirmMSG = GlobalServices.getConfirmMSG();
        $scope.perPageColl = GlobalServices.getPerPageList();

        $scope.NumberingMethodList = GlobalServices.getNumberingMethod();
        $scope.perPage = {
            JobEntity: GlobalServices.getPerPageRow(),

        };

        $scope.currentPages = {
            JobEntity: 1

        };
        $scope.searchData = {
            JobEntity: ''
        };

        $scope.newJobEntity =
        {
            JobName:'',
            CronExpression:'',
            Status:true,
            TranId: 0,
            HostName: '',
            DBName:'',
        }

        $scope.JobTypeColl = [];
        $http({
            method: 'GET',
            url: base_url + "Jobs/Transaction/GetJobType",
            dataType: "json"
        }).then(function (res) {
            $scope.JobTypeColl = res.data.Data;            
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    };

    $scope.ClearJobEntity = function () {
        $scope.loadingstatus = "stop";

        $scope.newMaster = {
            TranId: 0
        };
            $scope.newJobEntity = {
               
                Name: '',
                Alias: '',
                Code: '',
                TranId: 0,
                ParentGroupId: 0,
                ParentGroupName: '',
                Mode: 'Save',
                ShowInProductMaster: true,
                HostName: '',
                DBName: '',

        };
    }

     
    $scope.IsValidJobEntity = function () {
        if ($scope.newJobEntity.JobName.isEmpty()) {
            Swal.fire("Please ! Enter Name");
            return false;
        }
       
        else
            return true;
    }

    $scope.SaveUpdateJobEntity = function () {
        if ($scope.IsValidJobEntity() == true) {
            if ($scope.confirmMSG.Accept == true) {
                var saveModify = $scope.newJobEntity.Mode;
                Swal.fire({
                    title: 'Do you want to' + saveModify + 'the current data?',
                    showCancelButton: true,
                    confirmButtonText: saveModify,
                }).then((result) => {
                    if (result.isConfirmed) {
                        $scope.CallSaveUpdateJobEntity();
                    }

                });
            }
            else
                $scope.CallSaveUpdateJobEntity();
        }
    };
   
    $scope.CallSaveUpdateJobEntity = function () {
        $scope.loadingstatus = 'running';
        showPleaseWait();

        $http({
            method: 'POST',
            url: base_url + "Jobs/Transaction/SaveJobEntity",
            headers: { 'content-Type': undefined },

            transformRequest: function (data) {
                var formData = new FormData();
                formData.append("jsonData", angular.toJson(data.jsonData));
                return formData;
            },
            data: { jsonData: $scope.newJobEntity }
        }).then(function (res) {

            $scope.loadingstatus = "stop";
            hidePleaseWait();

            Swal.fire(res.data.ResponseMSG);
            if (res.data.IsSuccess == true) {
                $scope.ClearJobEntity();
                $scope.GetAllJobEntity();
            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
        });
    }

    $scope.GetAllJobEntity = function () {
        $scope.JobEntityColl = []; //declare an empty array

        if ($scope.loadingstatus != 'stop') {
            alert('Already Running Process')
            return;
        }

        $scope.loadingstatus = 'running';
        showPleaseWait();

        $http({
            method: 'POST',
            url: base_url + "Jobs/Transaction/GetAllJobEntity",
            dataType: "json"
            //data:JSON.stringify(para)
        }).then(function (res) {

            $scope.loadingstatus = 'stop';
            hidePleaseWait();

            if (res.data.IsSuccess && res.data.Data) {
                $timeout(function () {
                    $scope.JobEntityColl = res.data.Data;
                });
            } else
                alert(res.data.ResponseMSG);

        }, function (reason) {
            alert('Failed' + reason);
        });

    }
    $scope.getJobEntityByIdd = function (newJobEntity) {

        $scope.loadingstatus = "running";

        var para = {
            TranId: newJobEntity.TranId
        };
 

        $http({
            method: 'POST',
            url: base_url + "Jobs/Transaction/getJobEntityById",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $timeout(function () {
                    $scope.newJobEntity = res.data.Data;
                     
                    $scope.newJobEntity.Mode = 'Modify';
                    $('#custom-tabs-four-profile-tab').tab('show');
                });


            } else
                Swal.fire(res.data.ResponseMSG);


        }, function (reason) {
            alert('Failed' + reason);
        });
    };
    $scope.deleteJobEntity = function (newJobEntity, ind) {

        Swal.fire({
            title: 'Are you sure you want to delete ' + newJobEntity.JobName + '?',
            showCancelButton: true,
            confirmButtonText: 'Delete',
        }).then((result) => {
            if (result.isConfirmed) {
                var para = { TranId: newJobEntity.TranId };
                $http({
                    method: 'POST',
                    url: base_url + "Jobs/Transaction/DelJobEntity",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingStatus = "stop";

                    Swal.fire(res.data.ResponseMSG);
                    if (res.data.IsSuccess == true) {
                        $scope.JobEntityColl.splice(ind, 1);
                    }
                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }

        });
    }

    $scope.TestJobEntity = function (newJobEntity, ind) {

        Swal.fire({
            title: 'Are you sure you want to Test(Run) ' + newJobEntity.JobName + '?',
            showCancelButton: true,
            confirmButtonText: 'Yes',
        }).then((result) => {
            if (result.isConfirmed)
            {
                var para = { TranId: newJobEntity.TranId };
                $http({
                    method: 'POST',
                    url: base_url + "Jobs/Transaction/TestJobEntity",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingStatus = "stop";
                    Swal.fire(res.data.ResponseMSG);
                     
                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }

        });
    }

    $scope.AuditLogColl = [];
    $scope.ShowAuditLog = function () {

        $scope.AuditLogColl = {};
        if ($scope.newMaster.TranId > 0) {

            $scope.loadingstatus = "running";
            showPleaseWait();

            GlobalServices.getAuditLog(EntityId, $scope.newMaster.TranId).then(function (res1) {
                $scope.loadingstatus = "stop";
                hidePleaseWait();
                if (res1.data.IsSuccess && res1.data.Data) {
                    $scope.AuditLogColl = res1.data.Data;
                    $('#frmAuditHis').modal('show');
                }
            }, function (reason) {
                Swal.fire('Failed' + reason);
            });

        }
    }
  
});