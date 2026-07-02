app.controller("RatingPointController", function ($scope, $filter, $http, $timeout, GlobalServices) {
    $scope.Title = 'Rating Point';

    $scope.LoadData = function () {
        $('.select2').select2();
        $scope.perPageColl = GlobalServices.getPerPageList();
        $scope.confirmMSG = GlobalServices.getConfirmMSG();

        $scope.currentPages = {
            RatingPoint: 1,
        };

        $scope.searchData = {
            RatingPoint: '',
        };

        $scope.perPage = {
            RatingPoint: GlobalServices.getPerPageRow(),
        };
      /*  getting dropdown from objectiveqoestion*/
        $http({
            method: 'POST',
            url: base_url + "EmployeePerformance/Creation/GetAllObjectiveQuestion",
            dataType: "json"
        }).then(function (res) {

            $scope.loadingstatus = 'stop';
            hidePleaseWait();

            if (res.data.IsSuccess && res.data.Data) {
                $scope.ObjectiveQuestionList = res.data.Data;
            } else
                Swal.fire(res.data.ResponseMSG);

        }, function (reason) {
            Swal.fire('Failed' + reason);
        });


        $scope.newFilter = {}
        $scope.GetAssignedGoalSubmited();
    }

    $scope.openRatingModal = function (beData) {
        var Details = beData;
        $scope.RatingFieldList = Details.ChildColl;
        $scope.SupervisorList = Details.SupervisorColl;
        angular.forEach($scope.SupervisorList, function (sv) {
            if (!sv.Rating) {
                sv.Rating = 0;
            }
        });
        $('#ratingModal').modal('show');
    };

    $scope.setRating = function (value, SV) {
        if (SV.Rating === value && value === 1) {
            SV.Rating = 0;
        } else {
            SV.Rating = value;
        }
    };

    $scope.openFeedbackModal = function (beData) {
        $scope.FeedFieldList = beData.ChildColl || [];
        $scope.SupervisorForFBList = beData.SupervisorColl || [];

        // Initialize ratings
        angular.forEach($scope.SupervisorForFBList, function (sv) {
            if (!sv.Rating) sv.Rating = 0;
            if (!sv.HRRating) sv.HRRating = 0;
        });

        $scope.fedrating3 = beData.HRRating || 0;
        $scope.beData = beData; // Bind feedback type and remarks
        $('#feedbackModal').modal('show');
    };

    $scope.setHRRating = function (value) {
        if ($scope.fedrating3 === value) {
            $scope.fedrating3 = 0;
        } else {
            $scope.fedrating3 = value;
        }
    };


    $scope.GetAssignedGoalSubmited = function () {
        $scope.loadingstatus = 'running';
        showPleaseWait();
        $http({
            method: 'POST',
            url: base_url + "EmployeePerformance/Creation/GetAssignedGoalSubmited",
            dataType: "json"
        }).then(function (res) {
            $scope.loadingstatus = 'stop';
            hidePleaseWait();

            if (res.data.IsSuccess && res.data.Data) {
                var rawList = res.data.Data;
                var grouped = [];
                var sno = 0
                rawList.forEach(function (item) {
                    sno++;
                    var userGroup = grouped.find(u => u.UserId === item.UserId);
                    if (!userGroup) {
                        userGroup = {
                            Sno: sno,
                            UserId: item.UserId,
                            EmployeeName: item.EmployeeName,
                            EmployeeCode: item.EmployeeCode,
                            Department: item.Department,
                            BranchName: item.BranchName,
                            CompanyRelationship: item.CompanyRelationship,
                            FeedBackTypeId: item.FeedBackTypeId,
                            FeedbackType: item.FeedbackType,
                            Remarks: item.Remarks,
                            SupUserId: item.SupUserId,
                            SuperVisorName: item.SuperVisorName,
                            Rating: item.Rating,
                            HRRating: item.HRRating,
                            ChildColl: [],
                            SupervisorColl: [],
                            Supervisor1Rating: null,
                            Supervisor2Rating: null,
                            Supervisor3Rating: null
                        };
                        grouped.push(userGroup);
                    }
                    var childGroup = userGroup.ChildColl.find(c => c.GoalSetupId === item.GoalSetupId);
                    if (!childGroup) {
                        childGroup = {
                            UserId: userGroup.UserId,
                            GoalSetupReleaseId: item.GoalSetupReleaseId,
                            GoalSetupId: item.GoalSetupId,
                            GoalType: item.GoalType,
                            Description: item.Description,
                            FromDateBS: item.FromDateBS,
                            ToDateBS: item.ToDateBS,
                            FromDate: item.FromDate,
                            ToDate: item.ToDate,
                            TargetValue: item.TargetValue,
                            GoalMeasurement: item.GoalMeasurement,
                            WeightedId: item.WeightedId,
                            ParentSetupId: item.GoalSetupId,
                            GoalTypeId: item.GoalTypeId,
                            GoalTargetType: item.GoalTargetType,
                            CostClassId: item.CostClassId,
                            GoalTargetTypeId: item.GoalTargetTypeId,
                            TotalTargetAchivement: item.TotalTargetAchievement
                        };
                        userGroup.ChildColl.push(childGroup);
                    }
                    var supervisorGroup = userGroup.SupervisorColl.find(c => c.UserId === item.UserId && c.SupUserId === item.SupUserId);
                    if (!supervisorGroup) {
                        supervisorGroup = {
                            Sno: userGroup.SupervisorColl.length + 1,
                            UserId: userGroup.UserId,
                            TranId: item.TranId,
                            FeedBackTypeId: item.FeedBackTypeId,
                            Remarks: item.Remarks,
                            SupUserId: item.SupUserId,
                            SuperVisorName: item.SuperVisorName,
                            Rating: item.Rating,
                            HRRating: item.HRRating,
                        };
                        userGroup.SupervisorColl.push(supervisorGroup);
                    }
                });

                angular.forEach(grouped, function (item) {
                    item.SupervisorColl.sort(function (a, b) {
                        return a.Sno - b.Sno; // 👈 sort by Sno
                    });

                    item.Supervisor1Rating = item.SupervisorColl[0] ? item.SupervisorColl[0].Rating : null;
                    item.Supervisor2Rating = item.SupervisorColl[1] ? item.SupervisorColl[1].Rating : null;
                    item.Supervisor3Rating = item.SupervisorColl[2] ? item.SupervisorColl[2].Rating : null;
                });
                $scope.EmployeeList = grouped;
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (error) {
            $scope.loadingstatus = 'stop';
            hidePleaseWait();
            Swal.fire('Failed: ' + error);
        });
    };

    $scope.SavesubmitRating = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();
        var ratingCollection = [];
        var missingSupervisors = [];
        angular.forEach($scope.SupervisorList, function (sv) {
            if (!sv.UserId || sv.UserId === 0 || !sv.SupUserId || sv.SupUserId === 0) {
                missingSupervisors.push(sv.SuperVisorName);
                return;
            }
            ratingCollection.push({
                TranId: sv.TranId || null,
                UserId: sv.UserId,
                SupervisorId: sv.SupUserId,
                Rating: sv.Rating,
                IsHR: false
            });
        });
        if (missingSupervisors.length > 0) {
            var nameList = missingSupervisors.join(", ");
            Swal.fire("Note", "Skipped saving for these supervisors due to missing UserId/SupUserId: " + nameList, "warning");
        }
        $http({
            method: 'POST',
            url: base_url + "EmployeePerformance/Creation/SaveRatingPoint",
            headers: { 'Content-Type': undefined },
            transformRequest: function (data) {
                var formData = new FormData();
                formData.append("jsonData", angular.toJson(data.jsonData));
                return formData;
            },
            data: { jsonData: ratingCollection }
        }).then(function (res) {
            $scope.loadingstatus = "stop";
            hidePleaseWait();
            Swal.fire(res.data.ResponseMSG);
            $('#ratingModal').modal('hide');
            $scope.GetAssignedGoalSubmited();
        }, function (errormessage) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            Swal.fire("Error", "Failed: " + errormessage, "error");
        });
    };

    // Save function
    $scope.SaveFeedback = function () {
        if (!$scope.SupervisorForFBList || $scope.SupervisorForFBList.length === 0) {
            Swal.fire("No supervisor ratings to save!");
            return;
        }

        $scope.loadingstatus = "running";
        showPleaseWait();

        var feedbackCollection = [];
        var missingSupervisors = [];
        angular.forEach($scope.SupervisorForFBList, function (sv) {
            if (!sv.UserId || sv.UserId === 0 || !sv.SupUserId || sv.SupUserId === 0) {
                missingSupervisors.push(sv.SuperVisorName);
                return;
            }
            feedbackCollection.push({
                TranId: sv.TranId || null,
                UserId: sv.UserId,
                SupervisorId: sv.SupUserId,
                Rating: sv.Rating,
                FeedBackTypeId: $scope.beData.FeedBackTypeId || null,
                Remarks: $scope.beData.Remarks || null,
                HRRating: $scope.fedrating3 || null,
                IsHR: true
            });
        });

        if (missingSupervisors.length > 0) {
            Swal.fire("Note", "Skipped saving for these supervisors due to missing UserId/SupUserId: " + missingSupervisors.join(", "), "warning");
        }
        $http({
            method: 'POST',
            url: base_url + "EmployeePerformance/Creation/SaveRatingPoint",
            headers: { 'Content-Type': undefined },
            transformRequest: function (data) {
                var formData = new FormData();
                formData.append("jsonData", angular.toJson(data.jsonData));
                return formData;
            },
            data: { jsonData: feedbackCollection }
        }).then(function (res) {
            $scope.loadingstatus = "stop";
            hidePleaseWait();
            Swal.fire(res.data.ResponseMSG);
            $('#feedbackModal').modal('hide');
            $scope.GetAssignedGoalSubmited();
        }, function (err) {
            $scope.loadingstatus = "stop";
            hidePleaseWait();
            Swal.fire("Error", "Failed: " + err.statusText, "error");
        });
    };

})