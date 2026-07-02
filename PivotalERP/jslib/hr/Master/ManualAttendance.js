app.controller('ManualAttendanceController', function ($scope, $http, $timeout, $filter, GlobalServices) {
    $scope.Title = 'ManualAttendance';

    LoadData();

    function LoadData() {
        $('.select2').select2();
        $scope.confirmMSG = GlobalServices.getConfirmMSG();
        $scope.perPageColl = GlobalServices.getPerPageList();
        $scope.currentPages = {
            ManualAttendance: 1,
        };

        $scope.searchData = {
            ManualAttendance: '',

        };

        $scope.perPage = {
            ManualAttendance: GlobalServices.getPerPageRow()
        };




        $scope.AttendanceTypeColl = [
            { id: 1, text: 'Manual Attendance' },
            { id: 2, text: 'Attendance Appeal' }
        ]
        $scope.InOutModeColl = [
            { id: 1, text: 'In' },
            { id: 2, text: 'Out' }
        ]
        $scope.ApprovedStatusColl = [
            { id: 1, text: 'Not Approved' },
            { id: 2, text: 'Approved' },
            { id: 3, text: 'Reject' },
            { id: 4, text: 'Deleted' }
        ]


        $scope.UserList = [];
        $http({
            method: 'GET',
            url: base_url + "HR/Master/GetAllManualAttendance",
            dataType: "json"
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.UserList = res.data.Data;
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });



        $scope.newDet = {
            TranId: null,
            UserId: null,
            DeviceId: null,
            ForDate: new Date(),
            InOutModeId: 1,
            InTime: '',
            OutTime: '',
            Remarks: '',
            Lat: 0.0,
            Lng: 0.0,
            NerestLocation: '',
            PhotoPath: '',
            PunchDateTime: new Date(),
            AttendanceType: null,
            ApprovedStatus: 1,
            ApprovedBy: null,
            ApprovedDateTime: new Date(),
            IsUserDefine: false,
            AttendanceUId: '',
            ManualAttDetailsColl:[],
            Mode: 'Save'
        };
        $scope.newDet.ManualAttDetailsColl.push({});


    };

    $scope.ClearManualAttendance = function () {
        $scope.newDet = {
            TranId: null,
            UserId: null,
            DeviceId: null,
            ForDate: new Date(),
            InOutModeId: 1,
            InTime: '',
            OutTime: '',
            Remarks: '',
            Lat: 0.0,
            Lng: 0.0,
            NerestLocation: '',
            PhotoPath: '',
            PunchDateTime: new Date(),
            AttendanceType: null,
            ApprovedStatus: 1,
            ApprovedBy: null,
            ApprovedDateTime: new Date(),
            IsUserDefine: false,
            AttendanceUId: '',
            ManualAttDetailsColl:[],
            Mode: 'Save'
        };
        $scope.newDet.ManualAttDetailsColl.push({});
    }



    $scope.AddAttDetails = function (ind) {
        if ($scope.newDet.ManualAttDetailsColl) {
            if ($scope.newDet.ManualAttDetailsColl.length > ind + 1) {
                $scope.newDet.ManualAttDetailsColl.splice(ind + 1, 0, {
                    Rate: ''
                })
            } else {
                $scope.newDet.ManualAttDetailsColl.push({
                    Rate: ''
                })
            }
        }
    };
    $scope.delAttDetails = function (ind) {
        if ($scope.newDet.ManualAttDetailsColl) {
            if ($scope.newDet.ManualAttDetailsColl.length > 1) {
                $scope.newDet.ManualAttDetailsColl.splice(ind, 1);
            }
        }
    };



    //************************* Department *********************************
    $scope.IsValidManualAttendance = function () {
        /*if ($scope.newBaliType.GenderName.isEmpty()) {
            Swal.fire('Please ! Enter GenderName Name');
            return false;
        }*/
        return true;
    }

    $scope.SaveManualAttendance = function () {
        if ($scope.IsValidManualAttendance() == true) {
            if ($scope.confirmMSG.Accept == true) {
                var saveModify = $scope.newDet.Mode;
                Swal.fire({
                    title: 'Do you want to ' + saveModify + ' the current data?',
                    showCancelButton: true,
                    confirmButtonText: saveModify,
                }).then((result) => {
                    /* Read more about isConfirmed, isDenied below */
                    if (result.isConfirmed) {
                        $scope.CallSaveUpdateManualAttendance();
                    }
                });
            } else
                $scope.CallSaveUpdateManualAttendance();
        }
    };

    $scope.CallSaveUpdateManualAttendance = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();

        var dataToSave = [];

        function processAttDetailsColl() {
            var AttDataArray = [];
            for (var i = 0; i < $scope.newDet.ManualAttDetailsColl.length; i++) {
                var S = $scope.newDet.ManualAttDetailsColl[i];

                if (S.ForDateDet) {
                   S.ForDate = $filter('date')(new Date(S.ForDateDet.dateAD), 'yyyy-MM-dd');
                } else
                    S.ForDate = null;

                var forDate = S.ForDate;

                if (S.InTime_TMP)
                    S.InTime = S.InTime_TMP.toLocaleString();
                else
                    S.InTime = null;
                var inTime = S.InTime;

                if (S.OutTime_TMP)
                    S.OutTime = S.OutTime_TMP.toLocaleString();
                else
                    S.OutTime = null;
                var outTime = S.OutTime;

                var inoutMode = S.InOutModeId;
                var remarks = S.Remarks;

                var dataItem = {
                    UserId: $scope.newDet.UserId,
                    DeviceId: $scope.newDet.DeviceId,
                    AttendanceType: $scope.newDet.AttendanceType,
                    InOutModeId: inoutMode,
                    ForDate: forDate,
                    InTime: inTime,
                    OutTime: outTime,
                    Remarks: remarks

                };
                AttDataArray.push(dataItem);
            }
            return AttDataArray;
        }
        var attDataArray = processAttDetailsColl();
        dataToSave = dataToSave.concat(attDataArray);

        var photo = $scope.newDet.PhotoPath_TMP;


        $http({
            method: 'POST',
            url: base_url + "HR/Master/SaveUpdateManualAttendance",
            headers: { 'Content-Type': undefined },
            transformRequest: function (data) {
                var formData = new FormData();
                formData.append("jsonData", angular.toJson(data.jsonData));
                if (data.emPhoto && data.emPhoto.length > 0)
                    formData.append("photo", data.emPhoto[0]);

                return formData;
            },
            data: { jsonData: dataToSave, emPhoto: photo}
        }).then(function (res) {
            $scope.loadingstatus = "stop";
            hidePleaseWait();
            Swal.fire(res.data.ResponseMSG);
            if (res.data.IsSuccess == true) {
                $scope.ClearManualAttendance();
                $scope.GetAllManualAttendance();
            }
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
        });
    }



    $scope.GetAllManualAttendance = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();
        $scope.ManualAttendanceList = [];
        $http({
            method: 'GET',
            url: base_url + "HR/Master/GetAllManualAttendance",
            dataType: "json"
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.ManualAttendanceList = res.data.Data;
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    }

    $scope.getManualAttendanceById = function (refData) {
        $scope.loadingstatus = "running";
        showPleaseWait();
        var para = {
            TranId: refData.TranId
        };
        $http({
            method: 'POST',
            url: base_url + "HR/Master/getManualAttendanceById",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.newDet = res.data.Data;
                $scope.newDet.Mode = 'Modify';
                $('#custom-tabs-four-profile-tab').tab('show');

            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    };



    $scope.DelManualAttendanceById = function (refData, ind) {
        Swal.fire({
            title: 'Do you want to delete ' + refData.UserId + '?',
            showCancelButton: true,
            confirmButtonText: 'Delete',
            //message: 'Are you sure to delete selected BaliType :-' + beData.Name,
        }).then((result) => {
            if (result.isConfirmed) {
                var para = {
                    TranId: refData.TranId
                };
                $http({
                    method: 'POST',
                    url: base_url + "HR/Master/DeleteManualAttendanceById",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingStatus = "stop";

                    Swal.fire(res.data.ResponseMSG);
                    if (res.data.IsSuccess == true) {
                        $scope.GetAllManualAttendance();
                    }
                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }

        });
    }




});