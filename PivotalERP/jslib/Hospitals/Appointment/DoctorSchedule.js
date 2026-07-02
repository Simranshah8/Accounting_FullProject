app.controller("DoctorScheduleController", function ($scope, $filter, $http, $timeout, GlobalServices) {
    $scope.Title = 'Doctor Schedule';

    $scope.LoadData = function () {
        $('.select2').select2();

        $scope.perPageColl = GlobalServices.getPerPageList();

        $scope.currentPages = {
            DoctorSchedule: 1,
        };

        $scope.searchData = {
            DoctorSchedule: '',
        };

        $scope.perPage = {
            DoctorSchedule: GlobalServices.getPerPageRow(),
        };


        $scope.DepartmentList = [];
        $http({
            method: 'POST',
            url: base_url + "Lab/Creation/GetAllLabDepartment",
            dataType: "json"
        }).then(function (res) {

            $scope.loadingstatus = 'stop';
            hidePleaseWait();
            if (res.data.IsSuccess && res.data.Data) {
                $scope.DepartmentList = res.data.Data;
            } else
                Swal.fire(res.data.ResponseMSG);

        }, function (reason) {
            Swal.fire('Failed' + reason);
        });


        $scope.DoctorList = [];
        $http({
            method: 'POST',
            url: base_url + "Hospital/Creation/GetAllDoctor",
            dataType: "json"
        }).then(function (res) {

            $scope.loadingstatus = 'stop';
            hidePleaseWait();
            if (res.data.IsSuccess && res.data.Data) {
                $scope.DoctorList = res.data.Data.filter(function (item) {
                    return item.IsAppointmentApplicable === true;
                });
            } else
                Swal.fire(res.data.ResponseMSG);

        }, function (reason) {
            Swal.fire('Failed' + reason);
        });


        $scope.OPD = {
            Morning: {},
            Afternoon: {},
            Evening: {},
            FullDay: {}
        };

        $scope.usedDays = {
            Sun: false,
            Mon: false,
            Tue: false,
            Wed: false,
            Thu: false,
            Fri: false,
            Sat: false
        };


        $scope.newDoctorSchedule = {
            DepartmentTypeId: null,
            ScheduleTypeId: 1,
            DaywiseColl: [],
            DatewiseColl: [],
            EffictiveFrom: null,
            EffictiveTo: null,
            IsActive: false
        }
        $scope.loadingstatus = "stop";
        $scope.newDoctorSchedule.DaywiseColl.push({
            OPD: {
                Morning: {},
                AfterNoon: {},
                Evening: {},
                FullDay: {}
            }
        });
      
        $scope.newDoctorSchedule.DatewiseColl.push({});
        $scope.confirmMSG = GlobalServices.getConfirmMSG();
    }

    $scope.AddDaywiseTable = function (index) {
        var newRow = {
            OPD: {
                Morning: {},
                AfterNoon: {},
                Evening: {},
                FullDay: {}
            }
        };
        if ($scope.newDoctorSchedule.DaywiseColl.length > index + 1) {
            $scope.newDoctorSchedule.DaywiseColl.splice(index + 1, 0, newRow);
        } else {
            $scope.newDoctorSchedule.DaywiseColl.push(newRow);
        }
    };

    $scope.DeleteDaywiseTable = function (index) {
        if (!$scope.newDoctorSchedule ||
            !$scope.newDoctorSchedule.DaywiseColl ||
            $scope.newDoctorSchedule.DaywiseColl.length === 0) {
            return;
        }
        if ($scope.newDoctorSchedule.DaywiseColl.length === 1) {
            return;
        }
        $scope.newDoctorSchedule.DaywiseColl.splice(index, 1);
        $scope.updateUsedDays();
    };



    $scope.AddDatewiseTable = function (index) {
        if ($scope.newDoctorSchedule.DatewiseColl) {
            if ($scope.newDoctorSchedule.DatewiseColl.length > index + 1) {
                $scope.newDoctorSchedule.DatewiseColl.splice(index + 1, 0, {})
            }
            else {
                $scope.newDoctorSchedule.DatewiseColl.push({});
            }
        }
    }

    $scope.DeleteDatewiseTable = function (index) {
        if (!$scope.newDoctorSchedule ||
            !$scope.newDoctorSchedule.DatewiseColl ||
            $scope.newDoctorSchedule.DatewiseColl.length === 0) {
            return;
        }
        if ($scope.newDoctorSchedule.DatewiseColl.length === 1) {
            return;
        }
        $scope.newDoctorSchedule.DatewiseColl.splice(index, 1);
    };

    $scope.ClearFields = function () {
        $scope.newDoctorSchedule = {
            DepartmentTypeId: null,
            ScheduleTypeId: 1,
            DaywiseColl: [],
            DatewiseColl: [],
            EffictiveFrom: null,
            EffictiveTo: null,
            IsActive: false,
            Mode: "Save"
        }
        $scope.newDoctorSchedule.DatewiseColl.push({});
        $scope.newDoctorSchedule.DaywiseColl.push({});
    }

  


    $scope.updateUsedDays = function () {
        angular.forEach($scope.usedDays, function (v, k) {
            $scope.usedDays[k] = false;
        });
        angular.forEach($scope.newDoctorSchedule.DaywiseColl, function (row) {
            if (row.IsSunday) $scope.usedDays.Sun = true;
            if (row.IsMonday) $scope.usedDays.Mon = true;
            if (row.IsTue) $scope.usedDays.Tue = true;
            if (row.IsWed) $scope.usedDays.Wed = true;
            if (row.IsThus) $scope.usedDays.Thu = true;
            if (row.IsFri) $scope.usedDays.Fri = true;
            if (row.IsSat) $scope.usedDays.Sat = true;
        });
    };




})