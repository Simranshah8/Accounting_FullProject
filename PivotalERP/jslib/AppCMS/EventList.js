app.controller('npCalenderController', function ($scope, $http, $timeout, $filter, $rootScope, GlobalServices, /*$translate*/) {
	$scope.Title = 'About Us';


	var gSrv = GlobalServices;

	$rootScope.ConfigFunction = function () {
		$scope.LoadData();
	};
/*	$rootScope.ChangeLanguage();*/

	$scope.LoadData = function () {

		$scope.confirmMSG = gSrv.getConfirmMSG();
		$scope.YearColl = gSrv.getYearList();


		$scope.AcademicCalendar = {
			YearId: 0,
			MonthColl: []
		};

		$scope.CurDate = {};
		$http({
			method: 'POST',
			url: base_url + "Global/GetDate",
			dataType: "json"
		}).then(function (res) {
			$scope.CurDate = res.data.Data;

			if ($rootScope.LANG == 'in') {
				$scope.AcademicCalendar.YearId = new Date($scope.CurDate.Date_AD).getFullYear();
			} else {
				$scope.AcademicCalendar.YearId = $scope.CurDate.NY;
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});




	

		$scope.EventTypeList = [];
		$http({
			method: 'POST',
			url: base_url + "AppCMS/Creation/GetAllEventTypeList",
			dataType: "json"
		}).then(function (res) {
			$scope.EventTypeList = res.data.Data;
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

		$scope.AcademicYearColl = [];
		$http({
			method: 'POST',
			url: base_url + "Academic/Creation/GetAllAcademicYearList",
			dataType: "json"
		}).then(function (res) {
			$scope.AcademicYearColl = res.data.Data;

			$http({
				method: 'GET',
				url: base_url + "Global/GetRunningAcademicYearId",
				dataType: "json"
			}).then(function (res) {
				var aId = res.data.Data.RId;

				//var findA = mx($scope.AcademicYearColl).firstOrDefault(p1 => p1.AcademicYearId == aId);
				//if (findA)
				//	$scope.AcademicCalendar.YearId =parseInt(findA.Name);

				$scope.getNepaliCalendar();


			}, function (reason) {
				Swal.fire('Failed' + reason);
			});


		}, function (reason) {
			Swal.fire('Failed' + reason);
		});



	}

	$scope.getNepaliCalendar = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();

		var para = {
			YearId: $scope.AcademicCalendar.YearId
		};

		$http({
			method: 'POST',
			url: base_url + "AppCMS/Creation/GetNepaliCalendar",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.AcademicCalendar.MonthColl = res.data.Data;

			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

	}

	$scope.currentEvent = {
		ApplicableForClass: ''
	};
	$scope.ClickOnDay = function (dayDet) {
		$scope.currentEvent = dayDet;
		$scope.currentEvent.ApplicableForClass = '';

		if (dayDet.AD_Date) {
			$scope.currentEvent.FromDate_TMP = new Date(dayDet.AD_Date);
			$scope.currentEvent.ToDate_TMP = new Date(dayDet.AD_Date);
		}
		if (dayDet.EventColl && dayDet.EventColl.length > 0) {

			var templatesName = [];
			var sno = 1;
			angular.forEach(dayDet.EventColl, function (tc) {
				templatesName.push(sno + '-' + tc.Name);
				sno++;
			});

			Swal.fire({
				title: 'Event/Holiday Add/Edit',
				input: 'select',
				inputOptions: templatesName,
				inputPlaceholder: 'Select for edit',
				showCancelButton: true,
				inputValidator: (value) => {
					return new Promise((resolve) => {
						if (value >= 0 && Number.isInteger(parseInt(value)) == true) {
							resolve()

							var para = {
								EventHolidayId: dayDet.EventColl[value].EventHolidayId
							};
							$http({
								method: 'POST',
								url: base_url + "AppCMS/Creation/GetEventHolidayById",
								dataType: "json",
								data: JSON.stringify(para)
							}).then(function (res) {
								hidePleaseWait();
								$scope.loadingstatus = "stop";
								if (res.data.IsSuccess && res.data.Data) {
									var rdata = res.data.Data;
									$scope.currentEvent.EventHolidayId = rdata.EventHolidayId;
									$scope.currentEvent.EventTypeId = rdata.EventTypeId;
									$scope.currentEvent.Name = rdata.Name;
									$scope.currentEvent.Description = rdata.Description;
									$scope.currentEvent.Name = rdata.Name;

									if (rdata.FromDate)
										$scope.currentEvent.FromDate_TMP = new Date(rdata.FromDate);

									if (rdata.ToDate)
										$scope.currentEvent.ToDate_TMP = new Date(rdata.ToDate);

									if (rdata.AtTime)
										$scope.currentEvent.AtTime_TMP = new Date(rdata.AtTime);

									$('#modal-xl').modal('show');
								} else {
									Swal.fire(res.data.ResponseMSG);
								}
							}, function (reason) {
								Swal.fire('Failed' + reason);
							});


						} else {
							resolve()
							$('#modal-xl').modal('show');
						}
					})
				}
			})




		} else {
			$('#modal-xl').modal('show');
		}


	};

	$scope.DelEvent = function (dayDet) {

		Swal.fire({
			title: 'Do you want to delete the selected data?',
			showCancelButton: true,
			confirmButtonText: 'Delete',
		}).then((result) => {
			/* Read more about isConfirmed, isDenied below */
			if (result.isConfirmed) {
				$scope.loadingstatus = "running";
				showPleaseWait();

				var para = {
					EventHolidayId: $scope.currentEvent.EventHolidayId
				};

				$http({
					method: 'POST',
					url: base_url + "AppCMS/Creation/DelEventHoliday",
					dataType: "json",
					data: JSON.stringify(para)
				}).then(function (res) {
					hidePleaseWait();
					$scope.loadingstatus = "stop";
					Swal.fire(res.data.ResponseMSG);

					$scope.getNepaliCalendar();

				}, function (reason) {
					Swal.fire('Failed' + reason);
				});
			}
		});


	};

	$scope.ShowAtTime = true;
	$scope.ChangeEventType = function () {
		var et = mx($scope.EventTypeList).firstOrDefault(p1 => p1.EventTypeId == $scope.currentEvent.EventTypeId);
		if (et && et.EType == 1)
			$scope.ShowAtTime = false;
		else
			$scope.ShowAtTime = true;
	};
	$scope.SaveUpdateEvent = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();

		if ($scope.currentEvent.FromDateDet) {
			$scope.currentEvent.FromDate = $filter('date')(new Date($scope.currentEvent.FromDateDet.dateAD), 'yyyy-MM-dd');
		} else
			$scope.currentEvent.FromDate = null;

		if ($scope.currentEvent.ToDateDet) {
			$scope.currentEvent.ToDate = $filter('date')(new Date($scope.currentEvent.ToDateDet.dateAD), 'yyyy-MM-dd');
		} else
			$scope.currentEvent.ToDate = null;

		if ($scope.currentEvent.ApplicableForClassColl)
			$scope.currentEvent.ApplicableForClass = $scope.currentEvent.ApplicableForClassColl.toString();
		else
			$scope.currentEvent.ApplicableForClass = '';

		if ($scope.currentEvent.AtTime_TMP)
			$scope.currentEvent.AtTime = $filter('date')(new Date($scope.currentEvent.AtTime_TMP), 'yyyy-MM-dd HH:mm:ss');
		else
			$scope.currentEvent.AtTime = null;

		var et = mx($scope.EventTypeList).firstOrDefault(p1 => p1.EventTypeId == $scope.currentEvent.EventTypeId);
		if (et && et.EType == 1)
			$scope.currentEvent.AtTime = null;

		$http({
			method: 'POST',
			url: base_url + "AppCMS/Creation/SaveEventHoliday",
			headers: { 'Content-Type': undefined },

			transformRequest: function (data) {

				var formData = new FormData();
				formData.append("jsonData", angular.toJson(data.jsonData));

				return formData;
			},
			data: { jsonData: $scope.currentEvent }
		}).then(function (res) {

			$scope.loadingstatus = "stop";
			hidePleaseWait();
			Swal.fire(res.data.ResponseMSG);
			$scope.getNepaliCalendar();
			$('#modal-xl').modal('hide');

		}, function (errormessage) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";

		});


	}


});


app.controller('npEventListController', function ($scope, $http, $timeout, $filter, $rootScope, GlobalServices/*, $translate*/) {
	$scope.Title = 'Event List';

	var gSrv = GlobalServices;

	$rootScope.ConfigFunction = function () {
		$scope.LoadData();
	};
	/*$rootScope.ChangeLanguage();*/

	$scope.LoadData = function () {

		$scope.confirmMSG = gSrv.getConfirmMSG();

		$scope.YearColl = gSrv.getYearList();

		$scope.AcademicCalendar = {
			YearId: 0,
			MonthColl: []
		};

		$scope.CurDate = {};
		$http({
			method: 'POST',
			url: base_url + "Global/GetDate",
			dataType: "json"
		}).then(function (res) {
			$scope.CurDate = res.data.Data;

			if ($rootScope.LANG == 'in') {
				$scope.AcademicCalendar.YearId = new Date($scope.CurDate.Date_AD).getFullYear();
			} else {
				$scope.AcademicCalendar.YearId = $scope.CurDate.NY;
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

		


		$scope.EventTypeList = [];
		$http({
			method: 'POST',
			url: base_url + "AppCMS/Creation/GetAllEventTypeList",
			dataType: "json"
		}).then(function (res) {
			$scope.EventTypeList = res.data.Data;
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

		$scope.getCurrentDate();

	}

	$scope.getCurrentDate = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();

		var para = {
			forDate: null
		};

		$http({
			method: 'POST',
			url: base_url + "Global/GetDate",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.Data) {
				$scope.CurrentDate = res.data.Data;

				if ($rootScope.LANG == 'in') {
					var dt = new Date($scope.CurrentDate.Date_AD);
					$scope.AcademicCalendar.YearId = dt.getFullYear();
					$scope.AcademicCalendar.MonthId = dt.getMonth() + 1;
					$scope.AcademicCalendar.DayId = dt.getDay();
				} else {
					$scope.AcademicCalendar.YearId = $scope.CurrentDate.NY;
					$scope.AcademicCalendar.MonthId = $scope.CurrentDate.NM;
					$scope.AcademicCalendar.DayId = $scope.CurrentDate.ND;
				}


				$timeout(function () {
					$scope.getNepaliCalendar();
				});

			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

	}

	$scope.getNepaliCalendar = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();

		var para = {
			YearId: $scope.AcademicCalendar.YearId
		};

		$scope.AllEventList = [];
		$http({
			method: 'POST',
			url: base_url + "AppCMS/Creation/GetNepaliCalendar",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {

				$timeout(function () {
					$scope.AcademicCalendar.MonthColl = res.data.Data;

					$scope.nextPreviusMonth(0);

					angular.forEach($scope.AcademicCalendar.MonthColl, function (mn) {
						angular.forEach(mn.EventColl, function (ec) {
							$scope.AllEventList.push(ec);
						});
					});

				});



			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

	}

	$scope.nextPreviusMonth = function (val) {

		if (val == 0) {

		} else if (val == 1) {

			if ($scope.AcademicCalendar.MonthId == 12)
				return;
			else
				$scope.AcademicCalendar.MonthId = $scope.AcademicCalendar.MonthId + 1;

		} else if (val == -1) {
			if ($scope.AcademicCalendar.MonthId == 1)
				return;
			else
				$scope.AcademicCalendar.MonthId = $scope.AcademicCalendar.MonthId - 1;
		}

		$scope.AcademicCalendar.CurMonth = mx($scope.AcademicCalendar.MonthColl).firstOrDefault(p1 => p1.MonthId == $scope.AcademicCalendar.MonthId);

		var trRow = [];
		trRow.push({ ColColl: [] });
		trRow.push({ ColColl: [] });
		trRow.push({ ColColl: [] });
		trRow.push({ ColColl: [] });
		trRow.push({ ColColl: [] });
		trRow.push({ ColColl: [] });

		var col = 0, row = 0;

		if ($scope.AcademicCalendar.CurMonth && $scope.AcademicCalendar.CurMonth.BlankDaysColl) {
			angular.forEach($scope.AcademicCalendar.CurMonth.BlankDaysColl, function (bd) {
				if (col == 7) {
					row++;
					col = 0;
				}
				trRow[row].ColColl.push({});
				col++;
			});
		}


		if ($scope.AcademicCalendar.CurMonth && $scope.AcademicCalendar.CurMonth.DataColl) {
			angular.forEach($scope.AcademicCalendar.CurMonth.DataColl, function (dc) {

				if (col == 7) {
					row++;
					col = 0;
				}
				trRow[row].ColColl.push(dc);
				col++;
			});
		}


		$timeout(function () {
			$scope.$apply(function () {
				if ($scope.AcademicCalendar.CurMonth)
					$scope.AcademicCalendar.CurMonth.RowColl = trRow;
			});
		});


	}

	$scope.currentEvent = {
		ApplicableForClass: ''
	};
	$scope.ClickOnDay = function (dayDet) {
		$scope.currentEvent = dayDet;
		$scope.currentEvent.ApplicableForClass = '';

		if (dayDet.AD_Date) {
			$scope.currentEvent.FromDate_TMP = new Date(dayDet.AD_Date);
			$scope.currentEvent.ToDate_TMP = new Date(dayDet.AD_Date);
		}

		if (dayDet.EventColl && dayDet.EventColl.length > 0) {

			var para = {
				EventHolidayId: dayDet.EventColl[0].EventHolidayId
			};
			$http({
				method: 'POST',
				url: base_url + "AppCMS/Creation/GetEventHolidayById",
				dataType: "json",
				data: JSON.stringify(para)
			}).then(function (res) {
				hidePleaseWait();
				$scope.loadingstatus = "stop";
				if (res.data.IsSuccess && res.data.Data) {
					var rdata = res.data.Data;
					$scope.currentEvent.EventHolidayId = rdata.EventHolidayId;
					$scope.currentEvent.EventTypeId = rdata.EventTypeId;
					$scope.currentEvent.Name = rdata.Name;
					$scope.currentEvent.Description = rdata.Description;
					$scope.currentEvent.Name = rdata.Name;

					if (rdata.FromDate)
						$scope.currentEvent.FromDate_TMP = new Date(rdata.FromDate);

					if (rdata.ToDate)
						$scope.currentEvent.ToDate_TMP = new Date(rdata.ToDate);

					$('#modal-xl').modal('show');
				} else {
					Swal.fire(res.data.ResponseMSG);
				}
			}, function (reason) {
				Swal.fire('Failed' + reason);
			});


		} else {
			$('#modal-xl').modal('show');
		}


	};

	$scope.DelEvent = function (dayDet) {

		Swal.fire({
			title: 'Do you want to delete the selected data?',
			showCancelButton: true,
			confirmButtonText: 'Delete',
		}).then((result) => {
			/* Read more about isConfirmed, isDenied below */
			if (result.isConfirmed) {
				$scope.loadingstatus = "running";
				showPleaseWait();

				var para = {
					EventHolidayId: $scope.currentEvent.EventHolidayId
				};

				$http({
					method: 'POST',
					url: base_url + "AppCMS/Creation/DelEventHoliday",
					dataType: "json",
					data: JSON.stringify(para)
				}).then(function (res) {
					hidePleaseWait();
					$scope.loadingstatus = "stop";
					Swal.fire(res.data.ResponseMSG);

					$scope.getNepaliCalendar();

				}, function (reason) {
					Swal.fire('Failed' + reason);
				});
			}
		});


	};

	$scope.SaveUpdateEvent = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();

		if ($scope.currentEvent.FromDateDet) {
			$scope.currentEvent.FromDate = $filter('date')(new Date($scope.currentEvent.FromDateDet.dateAD), 'yyyy-MM-dd');
		} else
			$scope.currentEvent.FromDate = null;

		if ($scope.currentEvent.ToDateDet) {
			$scope.currentEvent.ToDate = $filter('date')(new Date($scope.currentEvent.ToDateDet.dateAD), 'yyyy-MM-dd');
		} else
			$scope.currentEvent.ToDate = null;

		if ($scope.currentEvent.ApplicableForClassColl)
			$scope.currentEvent.ApplicableForClass = $scope.currentEvent.ApplicableForClassColl.toString();
		else
			$scope.currentEvent.ApplicableForClass = '';

		$http({
			method: 'POST',
			url: base_url + "AppCMS/Creation/SaveEventHoliday",
			headers: { 'Content-Type': undefined },

			transformRequest: function (data) {

				var formData = new FormData();
				formData.append("jsonData", angular.toJson(data.jsonData));

				return formData;
			},
			data: { jsonData: $scope.currentEvent }
		}).then(function (res) {

			$scope.loadingstatus = "stop";
			hidePleaseWait();
			Swal.fire(res.data.ResponseMSG);
			$scope.getNepaliCalendar();
			$('#modal-xl').modal('hide');

		}, function (errormessage) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";

		});


	}

	$scope.ShowPersonalImg = function (item) {
		$scope.viewImg = {
			ContentPath: ''
		};
		if (item.ImagePath && item.ImagePath.length > 0) {
			$scope.viewImg.ContentPath = item.ImagePath;
			$('#PersonalImg').modal('show');
		} else
			Swal.fire('No Image Found');

	};
});