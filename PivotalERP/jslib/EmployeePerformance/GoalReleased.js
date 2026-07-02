app.controller('GoalReleasedController', function ($scope, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'Goal Released';

	$scope.LoadData = function () {
		$('.select2').select2();
		$scope.confirmMSG = GlobalServices.getConfirmMSG();
		$scope.perPageColl = GlobalServices.getPerPageList();

		$scope.currentPages = {
			GoalReleased: 1,
			TeamMember: 1,
		};
		$scope.searchData = {
			GoalReleased: '',
			TeamMember: '',
		};
		$scope.perPage = {
			GoalReleased: GlobalServices.getPerPageRow(),
			TeamMember: GlobalServices.getPerPageRow(),
		};

		$scope.ForColl = [
			{ id: 1, value: "Employee Wise" },
			{ id: 2, value: "Superviser Wise" }
		];

		$scope.beData = {
			CostClassId: null,
			GoalSetupId: null,
			ForId: null,
		}

		$scope.newDet = {
			CostClassId: null,
			GoalSetupId: null,
		}

		$scope.SupervisorList = [];
		$http({
			method: 'GET',
			url: base_url + "EmployeePerformance/Creation/GetAllSupervisors",
			dataType: "json"
		}).then(function (res) {
			$scope.loadingstatus = 'stop';
			hidePleaseWait();
			if (res.data.IsSuccess && res.data.Data) {
				$scope.SupervisorList = res.data.Data;
			} else
				Swal.fire(res.data.ResponseMSG);
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

		$scope.GoalSetupList = [];
		$http({
			method: 'POST',
			url: base_url + "EmployeePerformance/Creation/GetAllGoalSetup",
			dataType: "json"
		}).then(function (res) {
			$scope.loadingstatus = 'stop';
			hidePleaseWait();
			if (res.data.IsSuccess && res.data.Data) {
				$scope.GoalSetupList = res.data.Data.filter(x => x.IsActive == true && x.ParentSetupId == null);
			} else
				Swal.fire(res.data.ResponseMSG);
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

		$scope.HideShow = {}
		$scope.CostClassColl = [];
		$http({
			method: 'GET',
			url: base_url + "Account/Creation/GetCostClassForEntry",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.CostClassColl = res.data.Data;

				$timeout(function () {
					$scope.$apply(function () {
						if ($scope.CostClassColl.length > 0) {
							$scope.CostClassDefault = $scope.CostClassColl.filter(x => x.IsDefault == true);
							$scope.SelectedCostClass = $scope.CostClassDefault[0];
							$scope.beData.CostClassId = $scope.SelectedCostClass.CostClassId;
							$scope.newDet.CostClassId = $scope.SelectedCostClass.CostClassId;
						}
						if ($scope.CostClassColl.length <= 1) {
							$scope.HideShow.CostClass = true;
						} else {
							$scope.HideShow.CostClass = false;
						}
					});
				});
			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

	}

    $scope.GetEmployeeGoalRelease = function () {
		if ($scope.beData.CostClassId && $scope.beData.GoalSetupId && $scope.beData.ForId) {
            $scope.loadingstatus = 'running';
            showPleaseWait();
            var para = {
                CostClassId: $scope.beData.CostClassId,
                GoalSetupId: $scope.beData.GoalSetupId,
                ForId: $scope.beData.ForId
            }
            $http({
                method: 'POST',
                url: base_url + "EmployeePerformance/Creation/GetEmployeeGoalRelease",
                dataType: "json",
                data: JSON.stringify(para)
            }).then(function (res) {
                $scope.loadingstatus = 'stop';
                hidePleaseWait();
                if (res.data.IsSuccess && res.data.Data) {
                    $scope.GoalReleasedList = res.data.Data;
                    angular.forEach($scope.GoalReleasedList, function (cl) {
                        $scope.ChangeStatus(cl);
                    });
                } else
                    Swal.fire(res.data.ResponseMSG);
            }, function (reason) {
                Swal.fire('Failed' + reason);
            });
        }
    }
	$scope.ChangeStatus = function (cl) {
		if (cl.Status == true) {
			cl.StatusName = 'Release';
		} else {
			cl.StatusName = 'Not Release';
		}
	};
	$scope.SelectAllStatus = function (beData) {
		angular.forEach($scope.GoalReleasedList, function (cl) {
			cl.Status = beData
			$scope.ChangeStatus(cl);
		});
	};
	$scope.SelectAllStatusTM = function (beData) {
		angular.forEach($scope.TeamMemberList, function (cl) {
			cl.Status = beData
			$scope.ChangeStatus(cl);
		});
	};

	$scope.SaveGoalReleasedColl = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		var GoalReleasedCollection = [];
		var missingUserNames = [];
		angular.forEach($scope.GoalReleasedList, function (emp) {
			if (!emp.UserId || emp.UserId === 0) {
				missingUserNames.push(emp.EmployeeName);
				return;
			}
			var GoalReleased = {
				CostClassId: $scope.beData.CostClassId,
				GoalSetupId: $scope.beData.GoalSetupId,
				ForId: $scope.beData.ForId,
				UserId: emp.UserId,
				Status: emp.Status ?? false
			};
			GoalReleasedCollection.push(GoalReleased);
		});
		if (missingUserNames.length > 0) {
			var nameList = missingUserNames.join(", ");
			Swal.fire("Note", "Skipped saving for these employees due to missing UserId: " + nameList, "warning");
		}
		$http({
			method: 'POST',
			url: base_url + "EmployeePerformance/Creation/SaveGoalRelease",
			headers: { 'Content-Type': undefined },
			transformRequest: function (data) {
				var formData = new FormData();
				formData.append("jsonData", angular.toJson(data.jsonData));
				return formData;
			},
			data: { jsonData: GoalReleasedCollection }
		}).then(function (res) {
			$scope.loadingstatus = "stop";
			hidePleaseWait();
			Swal.fire(res.data.ResponseMSG);
		}, function (errormessage) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			Swal.fire("Error", "Failed " + errormessage, "error");
		});
	};

	//***************** Team Members ***************/
	$scope.prevSupUserId = null;
	$scope.GetEmpGoalSetupBySupId = function () {
		if ($scope.newDet.CostClassId && $scope.newDet.SupUserId) {
			if ($scope.prevSupUserId !== $scope.newDet.SupUserId) {
				$scope.prevSupUserId = $scope.newDet.SupUserId;
				$scope.newDet.GoalSetupId = null;
			}
			$scope.loadingstatus = 'running';
			showPleaseWait();
			var para = {
				SupUserId: $scope.newDet.SupUserId,
				CostClassId: $scope.newDet.CostClassId,
				GoalSetupId: $scope.newDet.GoalSetupId,
			}
			$http({
				method: 'POST',
				url: base_url + "EmployeePerformance/Creation/GetEmpGoalSetupBySupId",
				dataType: "json",
				data: JSON.stringify(para)
			}).then(function (res) {
				$scope.loadingstatus = 'stop';
				hidePleaseWait();
				if (res.data.IsSuccess && res.data.Data) {
					if (!$scope.newDet.GoalSetupId) {
						$scope.SupGoalSetupList = [];
						$scope.TeamMemberList = [];
						$scope.SupGoalSetupList = res.data.Data.GoalSetupColl;
					} else {
						$scope.TeamMemberList = [];
						$scope.TeamMemberList = res.data.Data.EmployeeList;
						angular.forEach($scope.TeamMemberList, function (cl) {
							$scope.ChangeStatus(cl);
						});
					}
				} else
					Swal.fire(res.data.ResponseMSG);
			}, function (reason) {
				Swal.fire('Failed' + reason);
			});
		}
	}


	$scope.SaveTeamMemberColl = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		var TeamMemberCollection = [];
		var missingUserNames = [];
		angular.forEach($scope.TeamMemberList, function (emp) {
			if (!emp.UserId || emp.UserId === 0) {
				missingUserNames.push(emp.EmployeeName);
				return;
			}
			var GoalReleased = {
				CostClassId: $scope.newDet.CostClassId,
				GoalSetupId: $scope.newDet.GoalSetupId,
				ForId: 1,
				UserId: emp.UserId,
				Status: emp.Status ?? false
			};
			TeamMemberCollection.push(GoalReleased);
		});
		if (missingUserNames.length > 0) {
			var nameList = missingUserNames.join(", ");
			Swal.fire("Note", "Skipped saving for these employees due to missing UserId: " + nameList, "warning");
		}
		$http({
			method: 'POST',
			url: base_url + "EmployeePerformance/Creation/SaveGoalRelease",
			headers: { 'Content-Type': undefined },
			transformRequest: function (data) {
				var formData = new FormData();
				formData.append("jsonData", angular.toJson(data.jsonData));
				return formData;
			},
			data: { jsonData: TeamMemberCollection }
		}).then(function (res) {
			$scope.loadingstatus = "stop";
			hidePleaseWait();
			Swal.fire(res.data.ResponseMSG);
		}, function (errormessage) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			Swal.fire("Error", "Failed " + errormessage, "error");
		});
	};


});