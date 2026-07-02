app.controller('AssignedGoalController', function ($scope, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'Assigned Goal';

	$scope.LoadData = function () {

		$scope.confirmMSG = GlobalServices.getConfirmMSG();
		$scope.perPageColl = GlobalServices.getPerPageList();

		$scope.currentPages = {
			AssignedGoal: 1,

		};
		$scope.searchData = {
			AssignedGoal: '',

		};
		$scope.perPage = {
			AssignedGoal: GlobalServices.getPerPageRow(),
		};
		$scope.ForColl = [
			{ id: 1, value: "Employee Wise" },
			{ id: 2, value: "Superviser Wise" }
		];

		$scope.WeightedColl = [
			{ id: 1, text: 'Sum' },
			{ id: 2, text: 'Average' },
			{ id: 3, text: 'Percentage' }
		];

		$scope.newFilter = {
			CostClassId: null,
			ForId: null,
		}

		$scope.beData = {
			CostClassId: null,
			ForId: null,
		}

		$scope.newDet = {
			TargetAchievement: null,
			AchiveedDescription: null,
		}

		$scope.GoalSetupList = [];
		$http({
			method: 'POST',
			url: base_url + "EmployeePerformance/Creation/GetAllGoalSetup",
			dataType: "json"
		}).then(function (res) {
			$scope.loadingstatus = 'stop';
			hidePleaseWait();
			if (res.data.IsSuccess && res.data.Data) {
				$scope.GoalSetupList = res.data.Data.filter(x => x.IsActive == true);
			} else
				Swal.fire(res.data.ResponseMSG);
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

		$scope.GoalTypeList = [];
		$http({
			method: 'POST',
			url: base_url + "EmployeePerformance/Creation/GetAllGoalType",
			dataType: "json"
		}).then(function (res) {
			$scope.loadingstatus = 'stop';
			hidePleaseWait();
			if (res.data.IsSuccess && res.data.Data) {
				$scope.GoalTypeList = res.data.Data.filter(x => x.IsActive == true);
			} else
				Swal.fire(res.data.ResponseMSG);
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

		$scope.GoalTargetTypeList = [];
		$http({
			method: 'POST',
			url: base_url + "EmployeePerformance/Creation/GetAllGoalTargetType",
			dataType: "json"
		}).then(function (res) {
			$scope.loadingstatus = 'stop';
			hidePleaseWait();
			if (res.data.IsSuccess && res.data.Data) {
				$scope.GoalTargetTypeList = res.data.Data.filter(x => x.IsActive == true);
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
							$scope.newFilter.CostClassId = $scope.SelectedCostClass.CostClassId;
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

	$scope.openGoalSetupModal = function (beData) {
		$scope.goalSetup = {};
		$scope.goalSetup = beData;
		if (beData.FromDate) {
			$scope.goalSetup.FromDate_TMP = new Date(beData.FromDate);
		}
		if (beData.ToDate) {
			$scope.goalSetup.ToDate_TMP = new Date(beData.ToDate);
		}
		$scope.goalSetup.GoalSetupId = null;
		$('#goalSetupModal').modal('show');
	};

	$scope.clearGoalSetup = function () {
		$scope.goalSetup = {};
	};

	$scope.saveGoalSetup = function () {
		$scope.loadingstatus = 'running';
		showPleaseWait();

		if ($scope.goalSetup.FromDateDet) {
			$scope.goalSetup.FromDate = $filter('date')(new Date($scope.goalSetup.FromDateDet.dateAD), 'yyyy-MM-dd');
		} else
			$scope.goalSetup.FromDate = null;

		if ($scope.goalSetup.ToDateDet) {
			$scope.goalSetup.ToDate = $filter('date')(new Date($scope.goalSetup.ToDateDet.dateAD), 'yyyy-MM-dd');
		} else
			$scope.goalSetup.ToDate = null;


		$http({
			method: 'POST',
			url: base_url + "EmployeePerformance/Creation/SaveGoalSetup",
			headers: { 'content-Type': undefined },

			transformRequest: function (data) {
				var formData = new FormData();
				formData.append("jsonData", angular.toJson(data.jsonData));
				return formData;
			},
			data: { jsonData: $scope.goalSetup }
		}).then(function (res) {

			$scope.loadingstatus = "stop";
			hidePleaseWait();

			Swal.fire(res.data.ResponseMSG);
			if (res.data.IsSuccess == true) {
				$('#goalSetupModal').modal('hide');
				$scope.clearGoalSetup();
				$scope.GetEmployeeAssignedGoal();
			}
		}, function (errormessage) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
		});
	}

	$scope.GetGoalSetupById = function (beData) {
		$scope.loadingstatus = "running";
		var para = {
			GoalSetupId: beData.GoalSetupId
		};
		$http({
			method: 'POST',
			url: base_url + "EmployeePerformance/Creation/GetGoalSetupById",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$timeout(function () {
					$scope.goalSetup = res.data.Data;
					if ($scope.goalSetup.FromDate)
						$scope.goalSetup.FromDate_TMP = new Date($scope.goalSetup.FromDate);
					if ($scope.goalSetup.ToDate)
						$scope.goalSetup.ToDate_TMP = new Date($scope.goalSetup.ToDate);
					$('#goalSetupModal').modal('show');
				});
			} else
				Swal.fire(res.data.ResponseMSG);
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	}

	$scope.deleteGoalSetup = function (refData, ind) {
		Swal.fire({
			title: 'Are you sure to deleteGoalSetup:-' + refData.Name,
			showCancelButton: true,
			confirmButtonText: 'Delete',
		}).then((result) => {
			if (result.isConfirmed) {
				$scope.loadingstatus = "running";
				showPleaseWait();
				var para = {
					GoalSetupId: refData.GoalSetupId
				};
				$http({
					method: 'POST',
					url: base_url + "EmployeePerformance/Creation/DelGoalSetup",
					dataType: "json",
					data: JSON.stringify(para)
				}).then(function (res) {
					hidePleaseWait();
					$scope.loadingstatus = "stop";
					Swal.fire(res.data.ResponseMSG);
					if (res.data.IsSuccess) {
						$scope.GetAllGoalSetup();
					}
				}, function (reason) {
					Swal.fire('Failed' + reason);
				});
			}
		});

	}


	$scope.GetEmployeeAssignedGoal = function () {
		if (!$scope.newFilter.CostClassId || !$scope.newFilter.ForId) return;

		$scope.loadingstatus = 'running';
		showPleaseWait();

		var para = {
			CostClassId: $scope.newFilter.CostClassId,
			ForId: $scope.newFilter.ForId
		};

		$http({
			method: 'POST',
			url: base_url + "EmployeePerformance/Creation/GetEmployeeAssignedGoal",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			$scope.loadingstatus = 'stop';
			hidePleaseWait();

			if (res.data.IsSuccess && res.data.Data) {
				var rawList = res.data.Data;
				var grouped = [];

				rawList.forEach(function (item) {
					var userGroup = grouped.find(u => u.UserId === item.UserId);
					if (!userGroup) {
						userGroup = {
							UserId: item.UserId,
							EmployeeName: item.EmployeeName,
							EmployeeCode: item.EmployeeCode,
							Department: item.Department,
							BranchName: item.BranchName,
							CompanyRelationship: item.CompanyRelationship,
							ChildColl: []
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
							IsMeasurement: item.IsMeasurement,
							CostClassId: item.CostClassId,
							GoalTargetTypeId: item.GoalTargetTypeId,
							IsActive: item.IsActive,
							IsSubmit: item.IsSubmit,
							KPIColl: item.KPIColl ||[],
							GoalSetupAssignedGoalColl: item.GoalSetupAssignedGoalColl || []
						};
						userGroup.ChildColl.push(childGroup);
					}
					$scope.CalculateAchievedTarget(childGroup);
				});
				$scope.AssignedGoalList = grouped;

			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (error) {
			$scope.loadingstatus = 'stop';
			hidePleaseWait();
			Swal.fire('Failed: ' + error);
		});
	};

	$scope.CalculateAchievedTarget = function (goalData) {
		if (!goalData) return 0;

		if (!goalData.KPIColl) {
			goalData.KPIColl = [];
		}

		var totalAchievement = goalData.KPIColl.reduce(function (sum, item) {
			return sum + (parseFloat(item.TargetAchievement) || 0);
		}, 0);

		var totalTargetValue = parseFloat(goalData.TargetValue) || 0;
		var totalAchievedTarget = 0;

		if (goalData.WeightedId == 1) {
			totalAchievedTarget = totalAchievement;
		}
		else if (goalData.WeightedId == 2) {
			totalAchievedTarget = goalData.KPIColl.length > 0
				? totalAchievement / goalData.KPIColl.length
				: 0;
		}
		else if (goalData.WeightedId == 3) {
			totalAchievedTarget = totalTargetValue > 0
				? (totalAchievement / totalTargetValue) * 100
				: 0;
		}

		goalData.TotalAchievedTarget = parseFloat(totalAchievedTarget.toFixed(2));
		return goalData.TotalAchievedTarget;
	};

	$scope.openKPIModal = function (AG) {
		$scope.clearKPI();
		$scope.newDet.UserId = AG.UserId;
		$scope.newDet.GoalReleaseId = AG.GoalSetupReleaseId;
		$scope.newDet.ForId = $scope.newFilter.ForId;
		$('#kpiModal').modal('show');
	};

	$scope.clearKPI = function () {
		$scope.newDet = {};
		$('#kpiModal').modal('hide');
	};

	$scope.SaveUpdateAssignedGoal = function () {
		$scope.loadingstatus = 'running';
		showPleaseWait();

		$http({
			method: 'POST',
			url: base_url + "EmployeePerformance/Creation/SaveAssignedGoal",
			headers: { 'content-Type': undefined },

			transformRequest: function (data) {
				var formData = new FormData();
				formData.append("jsonData", angular.toJson(data.jsonData));
				return formData;
			},
			data: { jsonData: $scope.newDet }
		}).then(function (res) {

			$scope.loadingstatus = "stop";
			hidePleaseWait();

			Swal.fire(res.data.ResponseMSG);
			if (res.data.IsSuccess == true) {
				$('#kpiModal').modal('hide');
				$scope.clearKPI();
				$scope.GetEmployeeAssignedGoal();
			}
		}, function (errormessage) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
		});
	}

	$scope.GetAssignedGoalById = function (beData) {
		$scope.loadingstatus = "running";
		var para = {
			TranId: beData.TranId
		};
		$http({
			method: 'POST',
			url: base_url + "EmployeePerformance/Creation/GetAssignedGoalById",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.newDet = res.data.Data;
				$('#kpiModal').modal('show');
			} else
				Swal.fire(res.data.ResponseMSG);
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	}

	$scope.DelAssignedGoal = function (refData, ind) {
		Swal.fire({
			title: 'Are you sure to delete Target Achievement:-' + refData.TargetAchievement,
			showCancelButton: true,
			confirmButtonText: 'Delete',
		}).then((result) => {
			if (result.isConfirmed) {
				$scope.loadingstatus = "running";
				showPleaseWait();

				var para = {
					TranId: refData.TranId
				};

				$http({
					method: 'POST',
					url: base_url + "EmployeePerformance/Creation/DelAssignedGoal",
					dataType: "json",
					data: JSON.stringify(para)
				}).then(function (res) {
					hidePleaseWait();
					$scope.loadingstatus = "stop";
					Swal.fire(res.data.ResponseMSG);
					if (res.data.IsSuccess) {
						$scope.GetEmployeeAssignedGoal();
					}

				}, function (reason) {
					Swal.fire('Failed' + reason);
				});
			}
		});
	}

	$scope.SubmitAssigneGoal = function (refData, ind) {
		Swal.fire({
			text: 'Do you want to submit the gol type "' + refData.GoalType + '"?',
			showCancelButton: true,
			confirmButtonText: 'Submit',
		}).then((result) => {
			if (result.isConfirmed) {
				$scope.loadingstatus = "running";
				showPleaseWait();
				var para = {
					UsersId: refData.UserId,
					GoalReleasedId: refData.GoalSetupReleaseId,
				};
				$http({
					method: 'POST',
					url: base_url + "EmployeePerformance/Creation/SubmitAssigneGoal",
					dataType: "json",
					data: JSON.stringify(para)
				}).then(function (res) {
					hidePleaseWait();
					$scope.loadingstatus = "stop";
					Swal.fire(res.data.ResponseMSG);
					if (res.data.IsSuccess) {
						$scope.GetEmployeeAssignedGoal();
					}

				}, function (reason) {
					Swal.fire('Failed' + reason);
				});
			}
		});
	}

});