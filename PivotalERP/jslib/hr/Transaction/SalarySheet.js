$(document).on('keyup', '.serial', function (e) {
	if (e.which == 13) {
		var $this = $(this);
		var $td = $this.closest('td');
		var $row = $td.closest('tr');
		var $rows = $row.parent();
		var column = $td.index();


		while ($td.length) {
			$row = $row.next('tr');
			if ($row.length == 0) {
				$row = $rows.children().first();
				column++;
			}

			$td = $row.children().eq(column);
			var $input = $td.find('.serial');
			if ($input.length) {
				$input.focus();
				break;
			}
		}
	}
});

app.controller('SalarySheetController', function ($scope, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'Salary Sheet';

	$scope.LoadData = function () {
		$('.select2').select2();
		var gSrv = GlobalServices;
		$scope.confirmMSG = gSrv.getConfirmMSG();
		$scope.perPageColl = gSrv.getPerPageList();
		$scope.MonthList = gSrv.getMonthList();

		//$scope.DepartmentList = [];
		//gSrv.getDepartmentList().then(function (res) {
		//	$scope.DepartmentList = res.data.Data;
		//}, function (reason) {
		//	Swal.fire('Failed' + reason);
		//});


		//$scope.CategoryList = [];
		//gSrv.getCategoryList().then(function (res) {
		//	$scope.CategoryList = res.data.Data;
		//}, function (reason) {
		//	Swal.fire('Failed' + reason);
		//});

		$scope.AcademicYearColl = [];
		$scope.AcademicYearColl = gSrv.getYearList();
		//gSrv.getAcademicYearList().then(function (res) {
		//	$scope.AcademicYearColl = res.data.Data;
		//}, function (reason) {
		//	Swal.fire('Failed' + reason);
		//});

		$scope.CompanyRelationshipList = [];
		$http({
			method: 'POST',
			url: base_url + "HR/Master/GetAllCompanyRelationship",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.CompanyRelationshipList = res.data.Data;
			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

		$scope.PayConfig = {};
		$http({
			method: 'POST',
			url: base_url + "HR/Transaction/GetPayrollConfiguration",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.PayConfig = res.data.Data;
				$scope.noofdec = $scope.PayConfig.NoOfDecimal;
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

		$scope.CategoryList = [];
		$http({
			method: 'GET',
			url: base_url + "HR/Transaction/GetCategoryListforPayhead",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.CategoryList = res.data.Data;

			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

		$scope.DepartmentList = [];
		$http({
			method: 'GET',
			url: base_url + "HR/Master/GetAllDepartment",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.DepartmentList = res.data.Data;
			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});


		$scope.PayHeadingList = [];
		$http({
			method: 'GET',
			url: base_url + "HR/Transaction/GetAllPayHeadingForTran",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				//$scope.PayHeadingList = res.data.Data.filter;
				$scope.PayHeadingList = res.data.Data.filter(function (item) {
					return item.IsSalarySheet === true;
				});
			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});



		$scope.PayHeadGroupList = [];
		$http({
			method: 'GET',
			url: base_url + "HR/Transaction/GetAllPayHeadGroup",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.PayHeadGroupList = mx(res.data.Data);
			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

		$scope.AttendanceTypeList = [];		
		$http({
			method: 'Get',
			url: base_url + "HR/Transaction/GetAttendanceTypeForTran",
			dataType: "json"
		}).then(function (res) {
			if (res.data.IsSuccess && res.data.Data) {
				$scope.AttendanceTypeList = res.data.Data;
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});


		$scope.BranchList = [];
		$http({
			method: 'GET',
			url: base_url + "HR/Transaction/GetBranchListforPayhead",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.BranchList = res.data.Data;

			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});


		$scope.currentPages = {
			SalarySheet: 1,
		};

		$scope.searchData = {
			SalarySheet: '',
		};

		$scope.perPage = {
			SalarySheet: gSrv.getPerPageRow(),
		};

		$scope.newFilter = {
			CompanyRelationshipId: 0,
			BranchId: 0,
			DepartmentId: 0,
			CategoryId: 0,
			//YearId: null,
			//MonthId: null
		};

		$http({
			method: 'GET',
			url: base_url + "HR/Transaction/GetAllTaxRule",
			dataType: "json"
		}).then(function (res) {
			$scope.TaxRuleColl = mx(res.data.Data);
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	}
	$scope.noofdec = 3;
	//function ToRound(val) {
	//	val = isEmptyAmt(val);
	//	return ($filter('number')(val, $scope.noofdec)).parseDBL();
	//}
	function ToRound(val) {
		val = isEmptyAmt(val);
		val = Number(val);   // ensure proper numeric parsing
		return parseFloat(val.toFixed($scope.noofdec));
	}
	$scope.sortEmpData = function (keyname) {
		$scope.sortKeySS = keyname;   //set the sortKey to the param passed
		$scope.reverseSS = !$scope.reverseSS; //if true make it false and vice versa
	}

	$scope.IsValidData = function () {

		if ($scope.EmployeeListForSalarySheet) {
			for (var e = 0; e < $scope.EmployeeListForSalarySheet.length; e++) {
				var emp = $scope.EmployeeListForSalarySheet[e];

				var totalDays = emp.Days;
				var totalDays1 = 0;
				if (emp.AttendanceTypeColl) {
					emp.AttendanceTypeColl.forEach(function (att) {
						if (att.IsMonthly == true) {
							totalDays1 += isEmptyAmt(att.Value);
						}
					});
				}

				if (totalDays1 > totalDays) {
					Swal.fire("Please ! Enter Days less than equal " + totalDays + "(" + totalDays1 + ") of employee " + emp.EmployeeName + " (" + emp.EmployeeCode + ")");					
					return false;
				}
            }
        }

		return true;
	}

	$scope.SaveSalarySheet = function () {

		if ($scope.IsValidData()) {

			Swal.fire({
				title: 'Do you want to save the current data?',
				showCancelButton: true,
				confirmButtonText: 'Save',
			}).then((result) => {
				/* Read more about isConfirmed, isDenied below */
				if (result.isConfirmed) {
					$scope.loadingstatus = "running";
					showPleaseWait();
					var dtColl = [];
					var atColl = [];
					$scope.EmployeeListForSalarySheet.forEach(function (emp) {
						emp.PayHeadColl.forEach(function (ph) {
							if (ph.Amount > 0 || ph.Amount < 0) {
								dtColl.push({
									EmployeeId: emp.EmployeeId,
									PayHeadingId: ph.PayHeadingId,
									Amount: isEmptyAmt(ph.Amount),
									Rate: isEmptyAmt(ph.Rate),
									YearId: $scope.newFilter.YearId,
									MonthId: $scope.newFilter.MonthId,
									Earning: isEmptyAmt(emp.Earning),
									Deducation: isEmptyAmt(emp.Deducation),
									Tax: isEmptyAmt(emp.Tax),
									Netpayable: isEmptyAmt(emp.Netpayable),
								});
							}
						})
					});

					$scope.EmployeeListForSalarySheet.forEach(function (emp) {
						emp.AttendanceTypeColl.forEach(function (ph) {
							if (ph.Value > 0 || ph.Value < 0) {
								atColl.push({
									EmployeeId: emp.EmployeeId,
									AttendanceTypeId: ph.AttendanceTypeId,
									Value: ph.Value,
									YearId: $scope.newFilter.YearId,
									MonthId: $scope.newFilter.MonthId

								});
							}
						})
					});


					$http({
						method: 'POST',
						url: base_url + "HR/Transaction/SaveSalarySheet",
						headers: { 'Content-Type': undefined },
						transformRequest: function (data) {
							var formData = new FormData();
							formData.append("dtColl", angular.toJson(data.dtColl));
							formData.append("atColl", angular.toJson(data.atColl));

							return formData;
						},
						data: { dtColl: dtColl, atColl: atColl }
					}).then(function (res) {
						$scope.loadingstatus = "stop";
						hidePleaseWait();
						Swal.fire(res.data.ResponseMSG);
						if (res.data.IsSuccess == true) {
							$scope.GetEmployeeForSalarySheet();
						}
					}, function (errormessage) {
						hidePleaseWait();
						$scope.loadingstatus = "stop";
					});
				}
			});
        }
		 
	}

	$scope.ChangeTotalAttendance = function (curAT) {
		$scope.EmployeeListForSalarySheet.forEach(function (emp) {
			emp.AttendanceTypeColl.forEach(function (at) {
				if (curAT.AttendanceTypeId == at.AttendanceTypeId) {
					$timeout(function () {
						at.Value = curAT.Value;
						$scope.ChangeAttendance(emp, at);
					});
                }				
			});
		});
	}
	$scope.GetEmployeeForSalarySheet = function () {


		if ($scope.newFilter.YearId && $scope.newFilter.YearId > 0 && $scope.newFilter.MonthId && $scope.newFilter.MonthId > 0) {

		} else {
			return;
		}

		$scope.loadingstatus = "running";
		showPleaseWait();
		$scope.EmployeeListForSalarySheet = [];

		var para = {
			BranchId: $scope.newFilter.BranchId,
			DepartmentId: $scope.newFilter.DepartmentId,
			CategoryId: $scope.newFilter.CategoryId,
			YearId: $scope.newFilter.YearId,
			MonthId: $scope.newFilter.MonthId,
		};
		$http({
			method: 'POST',
			url: base_url + "HR/Transaction/GetAllEmployeeForSalarySheet",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data.PayColl) {
				var dataColl = mx(res.data.Data.PayColl);
				var attColl = mx(res.data.Data.AttColl);
				var query = dataColl.groupBy(t => ({ EmployeeId: t.EmployeeId }));

				angular.forEach(query, function (q) {
					var fst = q.elements[0];
					var subQry = mx(q.elements);
					var subQryAtt = attColl.where(p1 => p1.EmployeeId == fst.EmployeeId);

					var beData = {
						PendingMonths: fst.PendingMonths,
						Days:fst.TotalDays,
						LevelId: fst.LevelId,
						LevelName: fst.LevelName,
						BranchId: fst.BranchId,
						CategoryId: fst.CategoryId,
						EmployeeId: fst.EmployeeId,
						EmployeeCode: fst.EmployeeCode,
						EmployeeName: fst.EmployeeName,
						EnrollNo: fst.EnrollNo,
						Department: fst.Department,
						Designation: fst.Designation,
						PayHeading: fst.PayHeading,
						MonthId: fst.MonthId,
						YearId: fst.YearId,
						PayHeadColl: [],
						AttendanceTypeColl: [],
						TaxRuleAs: fst.TaxRuleAs,
						Resident: fst.Resident,
						GenderId: fst.GenderId,
						Gender:fst.GenderId,
						MaritalStatus: fst.MaritalStatus,
						Earning: isEmptyAmt(fst.Earning),
						Deducation: isEmptyAmt(fst.Deducation),
						Tax: isEmptyAmt(fst.Tax),
						Netpayable: isEmptyAmt(fst.Netpayable),
						TotalDays: fst.TotalDays,
						IsEditable: fst.IsEditable,
						LevelId: fst.LevelId,
						LevelName: fst.LevelName,
						PendingMonths: fst.PendingMonths,
						TotalMonth: fst.TotalMonth,
						TotalWeekEnd: fst.TotalWeekEnd,
						TotalHoliday: fst.TotalHoliday,

					};

					$scope.PayHeadingList.forEach(function (pa) {
						var find = subQry.firstOrDefault(p1 => p1.PayHeadingId == pa.PayHeadingId);
						beData.PayHeadColl.push({
							Name: pa.Name,
							Code: pa.Code,
							PayHeadingId: pa.PayHeadingId,
							Amount: find ? find.Amount : 0,
							Rate: find ? find.Rate : 0,
							TRate: find ? find.SDRate : 0,
							IsAllow: find ? find.IsAllow : false,
							IsEditable: find ? find.IsEditable : false,
							PayheadType: pa.PayheadType,
							Natures: pa.Natures,
							MonthId: pa.MonthId,
							CalculationType: pa.CalculationType,
							PayHeadGroupId: pa.PayHeadGroupId,
							PayHeadCategoryId: pa.PayHeadCategoryId,
							CalculationOnHeading: pa.CalculationOnHeading,
							SNo: pa.SNo,
							IsTaxable: pa.IsTaxable,
							Formula: pa.Formula,
							TaxRuleAs: pa.TaxRuleAs,
							AttendanceTypeId: pa.AttendanceTypeId,
							PayHeadingDetailsColl: pa.PayHeadingDetailsColl,
							PayHeadingTaxExemptionColl: pa.PayHeadingTaxExemptionColl,
							PAmount: find ? find.PAmount : 0,
							PendingMonths: fst.PendingMonths,
							TotalMonth: fst.TotalMonth,
						});

					});

					$scope.AttendanceTypeList.forEach(function (pa) {
						var find = subQryAtt.firstOrDefault(p1 => p1.AttendanceTypeId == pa.AttendanceTypeId);
						beData.AttendanceTypeColl.push({
							AttendanceTypeId: pa.AttendanceTypeId,
							Value: find ? find.Value : 0,
							Rate: find ? find.Rate : pa.CalculationValue,
							CalculationValue: pa.CalculationValue,
							PeriodType: pa.PeriodType,
							PayHeadingId: pa.PayHeadingId,
							CanEditable: pa.CanEditable,
							Description: pa.Description,
							AttendanceTypeDetailsColl: pa.AttendanceTypeDetailsColl,
							ShowInSalarySheet: pa.ShowInSalarySheet,
							Formula: pa.Formula,
							SNo: pa.SNO,
							IsMonthly:pa.IsMonthly
						});

					});

					$scope.CalculateTax(beData);
					$scope.EmployeeListForSalarySheet.push(beData);

					if (beData.MonthId)
						$scope.newFilter.MonthId = beData.MonthId;

					if (beData.YearId)
						$scope.newFilter.YearId = beData.YearId;
				});


				$scope.CalculateGrandTotal();
			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

	}


	$scope.ReplaceFormula = function (curEmp) {
		var d = curEmp.Days;

		$scope.ReplaceFormulaAtt(curEmp);

		angular.forEach(curEmp.PayHeadColl, function (ph) {
			if (ph.IsAllow == true) {
				if (ph.Formula && ph.Formula.length > 0) {

					var formula = ph.Formula.toLowerCase().replaceAll("#days#", d);
					formula = formula.replaceAll("#Days#", d);
					formula = formula.replaceAll("#DAYS#", d);
					curEmp.PayHeadColl.forEach(function (cph) {
						if (cph.SNo > 0) {
							var sno = 'p' + cph.SNo + '#';
							var sno_rate = 'p_rate' + cph.SNo + '#';
							var sno_rate1 = 'p_' + cph.SNo + '#';
							var amt = isEmptyAmt(cph.Amount);
							var rate = isEmptyAmt(cph.Rate);
							formula = formula.replaceAll(sno, amt);
							formula = formula.replaceAll(sno_rate, rate);
							formula = formula.replaceAll(sno_rate1, rate);
						}
					});

					if (curEmp.AttendanceTypeColl && curEmp.AttendanceTypeColl.length > 0) {
						angular.forEach(curEmp.AttendanceTypeColl, function (ph1) {
							var sno = 'at' + ph1.SNo + '#';
							var amt = isEmptyAmt(ph1.Value);
							formula = formula.replaceAll(sno, amt);
						});
                    }
				

					try {
						var nVal = math.evaluate(formula);

						if (ph.CalculationType == 4)
							ph.Amount = isEmptyNum(nVal);

						ph.F_Amount = isEmptyAmt(nVal);

					} catch { }

				}
				else if ((ph.CalculationOnHeading == null || ph.CalculationOnHeading == 0) && ph.PayHeadingDetailsColl && ph.PayHeadingDetailsColl.length > 0) {

				}
			}
		});
	}


	$scope.ReplaceFormulaAtt = function (curEmp) {

		if (curEmp && curEmp.AttendanceTypeColl) {
			var d = curEmp.Days;
			angular.forEach(curEmp.AttendanceTypeColl, function (ph) {
				if (ph.Formula && ph.Formula.length > 0) {

					var formula = ph.Formula.toLowerCase().replaceAll("#days#", d);
					formula = formula.replaceAll("#Days#", d);
					formula = formula.replaceAll("#DAYS#", d);

					angular.forEach(curEmp.AttendanceTypeColl, function (ph1) {
						var sno = 'at' + ph1.SNo + '#';
						var amt = isEmptyAmt(ph1.Value);
						formula = formula.replaceAll(sno, amt);
					});
					 
					try {
						var nVal = math.evaluate(formula);
						ph.Value = isEmptyAmt(nVal);

						//var findPayHead = mx(curEmp.PayHeadColl).firstOrDefault(p1 => p1.AttendanceTypeId == ph.AttendanceTypeId);
						//if (findPayHead) {
						//	$scope.ChangeRate(curEmp, findPayHead);
						//}
						
					} catch { }

				}
			});
        }
		
	}

	$scope.TotalRow = {};
	$scope.CalculateGrandTotal = function () {
		$scope.TotalRow = {
			Earning: 0,
			Deduction: 0,
			Tax: 0,
			Netpayable: 0,
		}

		$scope.PayHeadingList.forEach(function (ph) {
			ph.GTAmount = 0;
		});
		var payHeadQry = mx($scope.PayHeadingList);

		$scope.EmployeeListForSalarySheet.forEach(function (emp) {
			$scope.TotalRow.Earning += isEmptyAmt(emp.Earning);
			$scope.TotalRow.Deduction += isEmptyAmt(emp.Deduction);
			$scope.TotalRow.Tax += isEmptyAmt(emp.Tax);
			$scope.TotalRow.Netpayable += isEmptyAmt(emp.Netpayable);

			if (emp.PayHeadColl) {
				emp.PayHeadColl.forEach(function (ph) {
					var findPH = payHeadQry.firstOrDefault(p1 => p1.PayHeadingId == ph.PayHeadingId);
					if (findPH) {
						findPH.GTAmount += isEmptyAmt(ph.Amount);
					}
				});
			}

		});
		$scope.TotalRow.Earning = ToRound($scope.TotalRow.Earning);
		$scope.TotalRow.Deducation = ToRound($scope.TotalRow.Deducation);
		$scope.TotalRow.Tax = ToRound($scope.TotalRow.Tax);
		$scope.TotalRow.Netpayable = ToRound($scope.TotalRow.Netpayable);
	};
	$scope.ChangeAttendance = function (curEmp, curAT) {

		$scope.ReplaceFormula(curEmp);
		var findPayHead = mx(curEmp.PayHeadColl).firstOrDefault(p1 => p1.AttendanceTypeId == curAT.AttendanceTypeId);

		var totalDays = curEmp.Days - curEmp.TotalWeekEnd;
		var totalDays1 = 0;
		if (curEmp.AttendanceTypeColl) {
			curEmp.AttendanceTypeColl.forEach(function (att) {
				if (att.IsMonthly == true) {
					totalDays1 += isEmptyAmt(att.Value);
				}
			});
		}
  
		if (totalDays1 > totalDays) {
			Swal.fire("Please ! Enter Days less than equal " + totalDays + "(" + totalDays1 + ") of employee " + curEmp.EmployeeName + " (" + curEmp.EmployeeCode + ")");
			return false;
		}

		if (findPayHead) {
			$scope.ChangeRate(curEmp, findPayHead);
		} else {

			angular.forEach(curEmp.AttendanceTypeColl, function (ph1) {
				if (ph1.Formula && ph1.Formula.length > 0) {

					var findPayHead1 = mx(curEmp.PayHeadColl).firstOrDefault(p1 => p1.AttendanceTypeId == ph1.AttendanceTypeId);
					if (findPayHead1) {
						$scope.ChangeRate(curEmp, findPayHead1);
						}
                }				
			});

		}

		$scope.CalculateTax(curEmp);
	}
	$scope.ChangeRate = function (curEmp, curPH) {

		$scope.ReplaceFormula(curEmp);
		var curPHQry = mx(curEmp.PayHeadColl);

			angular.forEach(curEmp.PayHeadColl, function (ph) {
				$scope.ReplaceFormula(curEmp);
				if (ph.IsAllow == true)
				{
					$scope.CalculateTax(curEmp);

					curEmp.AttendanceTypeColl.forEach(function (atc) {
						if (ph.CalculationType == 1) {
							if (ph.AttendanceTypeId == atc.AttendanceTypeId) {
								if (ph.CalculationOnHeading > 0) {
									var findOnPayHead = curPHQry.firstOrDefault(p1 => p1.PayHeadingId == ph.CalculationOnHeading);
									if (findOnPayHead) {

										if (ph.PayHeadingDetailsColl) {

											var phDetCollQry = mx(ph.PayHeadingDetailsColl);
											var findPHOnCal = phDetCollQry.firstOrDefault(p1 => p1.BranchId == curEmp.BranchId && p1.CategoryId == curEmp.CategoryId && p1.LevelId == curEmp.LevelId && ((p1.MinAmount <= findOnPayHead.Amount && p1.MaxAmount >= findOnPayHead.Amount) || p1.FixedAmount > 0));
											if (!findPHOnCal) {
												findPHOnCal = phDetCollQry.firstOrDefault(p1 => p1.BranchId == curEmp.BranchId && p1.CategoryId == curEmp.CategoryId && ((p1.MinAmount <= findOnPayHead.Amount && p1.MaxAmount >= findOnPayHead.Amount) || p1.FixedAmount > 0));
											}
											if (!findPHOnCal) {
												findPHOnCal = phDetCollQry.firstOrDefault(p1 => p1.BranchId == curEmp.BranchId && p1.LevelId == curEmp.LevelId && ((p1.MinAmount <= findOnPayHead.Amount && p1.MaxAmount >= findOnPayHead.Amount) || p1.FixedAmount > 0));
											}
											if (!findPHOnCal) {
												findPHOnCal = phDetCollQry.firstOrDefault(p1 => p1.BranchId == curEmp.BranchId && ((p1.MinAmount <= findOnPayHead.Amount && p1.MaxAmount >= findOnPayHead.Amount) || p1.FixedAmount > 0));
											}
											if (!findPHOnCal) {
												findPHOnCal = phDetCollQry.firstOrDefault(p1 => p1.CategoryId == curEmp.CategoryId && ((p1.MinAmount <= findOnPayHead.Amount && p1.MaxAmount >= findOnPayHead.Amount) || p1.FixedAmount > 0));
											}
											if (!findPHOnCal) {
												findPHOnCal = phDetCollQry.firstOrDefault(p1 => p1.LevelId == curEmp.LevelId && ((p1.MinAmount <= findOnPayHead.Amount && p1.MaxAmount >= findOnPayHead.Amount) || p1.FixedAmount > 0));
											}
											if (!findPHOnCal) {
												findPHOnCal = phDetCollQry.firstOrDefault(p1 => ((p1.MinAmount <= findOnPayHead.Amount && p1.MaxAmount >= findOnPayHead.Amount) || p1.FixedAmount > 0));
											}
											if (!findPHOnCal) {
												findPHOnCal = phDetCollQry.firstOrDefault(p1 => p1.BranchId == null && p1.CategoryId == null && p1.LevelId == null && ((p1.MinAmount <= findOnPayHead.Amount && p1.MaxAmount >= findOnPayHead.Amount) || p1.FixedAmount > 0));
											}
											if (findPHOnCal) {
												if (findPHOnCal.Rate > 0) {
													ph.Amount = findOnPayHead.Amount * findPHOnCal.Rate / 100;
												} else if (findPHOnCal.FixedAmount > 0) {
													//ph.Amount = findPHOnCal.FixedAmount;
													ph.Amount = (atc.Value / curEmp.Days) * findPHOnCal.FixedAmount;
												}
											}

										}

									}
								}
								else {
									var calVal = atc.CalculationValue;
									var atcDetColl = atc.AttendanceTypeDetailsColl;
									if (atcDetColl && atcDetColl.length > 0) {
										atcDetColl = mx(atcDetColl);
										var findAT = atcDetColl.firstOrDefault(p1 => p1.BranchId == curEmp.BranchId && p1.DepartmentId == curEmp.DepartmentId && p1.EmployeeGroupId == curEmp.EmployeeGroupId && p1.EmployeeCategoryId == curEmp.CategoryId && p1.EmployeeLevelId == curEmp.LevelId && p1.CalculationValue > 0);
										if (!findAT) {
											findAT = atcDetColl.firstOrDefault(p1 => p1.BranchId == curEmp.BranchId && p1.DepartmentId == curEmp.DepartmentId && p1.EmployeeLevelId == curEmp.LevelId && p1.CalculationValue > 0);
										}
										if (!findAT) {
											findAT = atcDetColl.firstOrDefault(p1 => p1.BranchId == curEmp.BranchId && p1.DepartmentId == curEmp.DepartmentId && p1.EmployeeGroupId == curEmp.EmployeeGroupId && p1.CalculationValue > 0);
										}
										if (!findAT) {
											findAT = atcDetColl.firstOrDefault(p1 => p1.BranchId == curEmp.BranchId && p1.DepartmentId == curEmp.DepartmentId && p1.CalculationValue > 0);
										}
										if (!findAT && curEmp.LevelId > 0) {
											findAT = atcDetColl.firstOrDefault(p1 => p1.EmployeeLevelId == curEmp.LevelId && p1.CalculationValue > 0);
										}
										if (!findAT && curEmp.CategoryId > 0) {
											findAT = atcDetColl.firstOrDefault(p1 => p1.EmployeeCategoryId == curEmp.CategoryId && p1.CalculationValue > 0);
										}
										if (!findAT && curEmp.EmployeeGroupId > 0) {
											findAT = atcDetColl.firstOrDefault(p1 => p1.EmployeeGroupId == curEmp.EmployeeGroupId && p1.CalculationValue > 0);
										}
										if (!findAT && curEmp.DepartmentId > 0) {
											findAT = atcDetColl.firstOrDefault(p1 => p1.DepartmentId == curEmp.DepartmentId && p1.CalculationValue > 0);
										}
										if (!findAT && curEmp.BranchId > 0) {
											findAT = atcDetColl.firstOrDefault(p1 => p1.BranchId == curEmp.BranchId && p1.CalculationValue > 0);
										}
										 
										if (findAT) {
											calVal = findAT.CalculationValue;
										}
									}

									//if (ph.Formula && ph.Formula.length > 0) {
									//	ph.Amount = ph.F_Amount * isEmptyAmt(calVal) * isEmptyAmt(atc.Value);
									//}
									//else if (ph.Rate > 0)
									//	ph.Amount = isEmptyAmt(ph.Rate) * isEmptyAmt(atc.Value);
									//else
									//	ph.Amount = isEmptyAmt(calVal) * isEmptyAmt(atc.Value);

									
									if (ph.PayheadType != 4 && ph.PayheadType != 6)
									{			
										ph.CalValue = calVal;

										if (ph.Formula && ph.Formula.length > 0) {
											ph.Amount = ph.F_Amount * isEmptyAmt(calVal) * isEmptyAmt(atc.Value);
										}
										else if (ph.Rate > 0)
											ph.Amount = isEmptyAmt(ph.Rate) * isEmptyAmt(atc.Value);
										else
											ph.Amount = isEmptyAmt(calVal) * isEmptyAmt(atc.Value);
									}

								}

							}
						}
						else if (ph.CalculationType == 2) {
							ph.Amount = isEmptyAmt(ph.Rate);
						}
					});
					 
					ph.Amount = ToRound(ph.Amount);
				}

			});
  

		// Calculate Tax
		$scope.CalculateTax(curEmp);

		if (curEmp.Netpayable < 0) {
			var exceedAmt = curPH.Amount - (0 - curEmp.Netpayable);
			var msg = 'The amount for ' + curPH.Name+' exceeds the net payable total. It has been auto adjusted to the maximum allowable value.';			
			curPH.Amount = exceedAmt;
			$scope.CalculateTax(curEmp);
			Swal.fire(msg);
		}

		$scope.CalculateGrandTotal();
	}

	$scope.CalculateTax = function (emp) {

		var totalEarning = 0;
		var totalPEarning = 0;
		var totalDeducation = 0;
		var totalPDeducation = 0;
		var taxExemptionAmt = 0;
		var taxExeptionAmtMax = 0;

		var taxableEarning = 0;
		emp.Earning = 0;
		emp.Deduction = 0;
		emp.NetPayaable = 0;

		var taxPayableAmt = 0;

		var totalSalary = 0;
		angular.forEach(emp.PayHeadColl, function (ph) {
			if (ph.PayheadType == 1 && ph.IsAllow == true)
				totalSalary += ph.Amount;
		});

		var totalTaxableEarning = 0;
		var totalPTaxableEarning = 0;
		var pTaxAmt = 0;

		angular.forEach(emp.PayHeadColl, function (ph) {

			ph.Amount = ToRound(ph.Amount);

			if (ph.IsAllow == true && (ph.PayheadType == 4 || ph.PayheadType == 6))
				pTaxAmt += ph.PAmount;

			if (ph.IsAllow == true && ph.PayheadType != 1) {
				//ph.Amount = ToRound(ph.Amount);

				if (isNaN(ph.Amount))
					ph.Amount = 0;

				//Earning=2
				if (ph.PayheadType == 2) {
					totalEarning += ph.Amount;
					totalPEarning += ph.PAmount;

					if (ph.IsTaxable == true) {
						taxableEarning += ph.Amount;
						totalTaxableEarning += (ph.Natures == 1 ? ((isEmptyAmt(ph.TRate) * ph.PendingMonths) + ph.Amount) : ph.Amount);
						totalPTaxableEarning += ph.PAmount;
					}

				}
				//Deduction=3
				else if (ph.PayheadType == 3) {
					totalDeducation += ph.Amount;
					totalPDeducation += ph.PAmount;

					if (ph.IsTaxable == true) {

						var amt = 0, rate = 0;
						var formula = '';
						var exemptionColl = (ph.PayHeadingTaxExemptionColl && ph.PayHeadingTaxExemptionColl.length > 0 ? ph.PayHeadingTaxExemptionColl : null);

						if (exemptionColl == null) {
							var findGroup = $scope.PayHeadGroupList.firstOrDefault(p1 => p1.PayHeadGroupId == ph.PayHeadGroupId);
							if (findGroup) {
								if (findGroup.PayHeadGroupTaxExemptionColl) {
									exemptionColl = findGroup.PayHeadGroupTaxExemptionColl;
								}
							}
						}

						if (exemptionColl && exemptionColl.length > 0) {
							angular.forEach(exemptionColl, function (rl) {

								if (rl.Gender == undefined || rl.Gender == null)
									rl.Gender = 0;

								if (rl.MaritalStatus == undefined || rl.MaritalStatus == null)
									rl.MaritalStatus = 0;

								if (rl.Resident == undefined || rl.Resident == null)
									rl.Resident = 0;

								if (rl.Gender == emp.GenderId && rl.MaritalStatus == emp.MaritalStatusId && rl.Resident == emp.ResidentId) {
									amt = rl.Amount;
									rate = rl.Rate;
									formula = rl.Formula;
								}
								else if (rl.Gender == emp.GenderId && rl.MaritalStatus == emp.MaritalStatusId) {
									amt = rl.Amount;
									rate = rl.Rate;
									formula = rl.Formula;
								}
								else if (rl.Gender == emp.Gender) {
									amt = rl.Amount;
									rate = rl.Rate;
									formula = rl.Formula;
								}
								else if (rl.MaritalStatus == emp.MaritalStatus) {
									amt = rl.Amount;
									rate = rl.Rate;
									formula = rl.Formula;
								}
								else if (rl.Resident == emp.Resident) {
									amt = rl.Amount;
									rate = rl.Rate;
									formula = rl.Formula;
								} else if (rl.Gender == 0 && rl.MaritalStatus == 0 && rl.Resident == 0) {
									amt = rl.Amount;
									rate = rl.Rate;
									formula = rl.Formula;
								}

							});
						}


						//var totalTaxDAmt = ph.Amount * (ph.Natures == 1 ? ph.PendingMonths : 1);
						//var totalTaxDAmt = (ph.Natures == 1 ? ((ph.TRate * ph.PendingMonths) + ph.PAmount + ph.Amount) : (ph.Amount + ph.PAmount));
						var totalTaxDAmt = (ph.Natures == 1 ? (((ph.TRate == 0 ? ph.Amount : ph.TRate) * ph.PendingMonths) + ph.PAmount + ph.Amount) : (ph.Amount + ph.PAmount));
						//var amt1 = (totalSalary * 12) * rate / 100;
						var amt1 = ((totalEarning * (ph.Natures == 1 ? ph.PendingMonths : 1)) + totalPEarning) * rate / 100;


						var minVal = 0;
						if (rate > 0 && amt > 0) {

							if (amt1 > amt)
								minVal = amt;
							else
								minVal = amt1;
						} else if (amt > 0) {
							minVal = amt;
						}

						if (totalTaxDAmt > minVal)
							taxExemptionAmt +=isEmptyAmt(minVal);
						else
							taxExemptionAmt += isEmptyAmt(totalTaxDAmt);

					}
				}
				//ExemptionTax=5
				else if (ph.PayheadType == 5) {

					var exemptionColl = (ph.PayHeadingTaxExemptionColl && ph.PayHeadingTaxExemptionColl.length > 0 ? ph.PayHeadingTaxExemptionColl : null);

					if (exemptionColl == null) {
						var findGroup = $scope.PayHeadGroupList.firstOrDefault(p1 => p1.PayHeadGroupId == ph.PayHeadGroupId);
						if (findGroup) {
							if (findGroup.PayHeadGroupTaxExemptionColl) {
								exemptionColl = findGroup.PayHeadGroupTaxExemptionColl;
							}
						}
					}

					if (exemptionColl && exemptionColl.length > 0) {
						angular.forEach(exemptionColl, function (rl) {

							if (rl.Gender == undefined || rl.Gender == null)
								rl.Gender = 0;

							if (rl.MaritalStatus == undefined || rl.MaritalStatus == null)
								rl.MaritalStatus = 0;

							if (rl.Resident == undefined || rl.Resident == null)
								rl.Resident = 0;

							if (rl.Gender == emp.GenderId && rl.MaritalStatus == emp.MaritalStatusId && rl.Resident == emp.ResidentId) {
								if (rl.Amount > 0) {
									taxExeptionAmtMax = rl.Amount;
								} else if (rl.Formula.length > 0) {

								}
							}
							else if (rl.Gender == emp.GenderId && rl.MaritalStatus == emp.MaritalStatusId) {
								if (rl.Amount > 0) {
									taxExeptionAmtMax = rl.Amount;
								} else if (rl.Formula.length > 0) {

								}
							}
							else if (rl.Gender == emp.Gender) {
								if (rl.Amount > 0) {
									taxExeptionAmtMax = rl.Amount;
								} else if (rl.Formula.length > 0) {

								}
							}
							else if (rl.MaritalStatus == emp.MaritalStatus) {
								if (rl.Amount > 0) {
									taxExeptionAmtMax = rl.Amount;
								} else if (rl.Formula.length > 0) {

								}
							}
							else if (rl.Resident == emp.Resident) {
								if (rl.Amount > 0) {
									taxExeptionAmtMax = rl.Amount;
								} else if (rl.Formula.length > 0) {

								}
							} else if (rl.Gender == 0 && rl.MaritalStatus == 0 && rl.Resident == 0) {
								if (rl.Amount > 0) {
									taxExeptionAmtMax = rl.Amount;
								} else if (rl.Formula.length > 0) {

								}
							}

						});

					}

					//var taxEAmt = ph.Amount * (ph.Natures == 1 ? ph.PendingMonths : 1);

					//var taxEAmt = (ph.Natures == 1 ? (ph.TRate * ph.PendingMonths) + ph.PAmount + ph.Amount : (ph.Amount + ph.PAmount));

					var taxEAmt = (ph.Natures == 1 ? ((ph.TRate == 0 ? ph.Amount : ph.TRate) * ph.PendingMonths) + ph.PAmount + ph.Amount : (ph.Amount + ph.PAmount));

					if (taxEAmt > taxExeptionAmtMax) {
						taxExemptionAmt += isEmptyAmt(taxExeptionAmtMax);
					}
					else {
						taxExemptionAmt += isEmptyAmt(taxEAmt);
					}

				}
			}
			else if (ph.IsAllow == false && ph.PayheadType != 1) {

				//Earning=2
				if (ph.PayheadType == 2) {
					totalPEarning += ph.PAmount;
					if (ph.IsTaxable == true) {
						totalPTaxableEarning += ph.PAmount;
						//totalTaxableEarning += (ph.Natures == 1 ? (ph.Amount * ph.PendingMonths) + ph.PAmount : (ph.Amount + ph.PAmount));
					}
				}
				//Deducation=3
				else if (ph.PayheadType == 3) {
					totalPDeducation += ph.PAmount;

					if (ph.IsTaxable == true) {

						var amt = 0, rate = 0;
						var formula = '';

						var exemptionColl = (ph.PayHeadingTaxExemptionColl && ph.PayHeadingTaxExemptionColl.length > 0 ? ph.PayHeadingTaxExemptionColl : null);

						if (exemptionColl == null) {
							var findGroup = $scope.PayHeadGroupList.firstOrDefault(p1 => p1.PayHeadGroupId == ph.PayHeadGroupId);
							if (findGroup) {
								if (findGroup.PayHeadGroupTaxExemptionColl) {
									exemptionColl = findGroup.PayHeadGroupTaxExemptionColl;
								}
							}
						}

						if (exemptionColl && exemptionColl.length > 0) {
							angular.forEach(exemptionColl, function (rl) {
								if (rl.Gender == emp.GenderId && rl.MaritalStatus == emp.MaritalStatusId && rl.Resident == emp.ResidentId) {
									amt = rl.Amount;
									rate = rl.Rate;
									formula = rl.Formula;
								}
								else if (rl.Gender == emp.GenderId && rl.MaritalStatus == emp.MaritalStatusId) {
									amt = rl.Amount;
									rate = rl.Rate;
									formula = rl.Formula;
								}
								else if (rl.Gender == emp.Gender) {
									amt = rl.Amount;
									rate = rl.Rate;
									formula = rl.Formula;
								}
								else if (rl.MaritalStatus == emp.MaritalStatus) {
									amt = rl.Amount;
									rate = rl.Rate;
									formula = rl.Formula;
								}
								else if (rl.Resident == emp.Resident) {
									amt = rl.Amount;
									rate = rl.Rate;
									formula = rl.Formula;
								} else if (rl.Gender == 0 && rl.MaritalStatus == 0 && rl.Resident == 0) {
									amt = rl.Amount;
									rate = rl.Rate;
									formula = rl.Formula;
								}

							});
						}


						//var totalTaxDAmt = ph.Amount * (ph.Natures == 1 ? ph.PendingMonths : 1);
						var totalTaxDAmt = ph.PAmount;
						//var amt1 = (totalSalary * 12) * rate / 100;
						var amt1 = (totalPEarning) * rate / 100;

						var minVal = 0;
						if (rate > 0 && amt > 0) {

							if (amt1 > amt)
								minVal = amt;
							else
								minVal = amt1;
						} else if (amt > 0) {
							minVal = amt;
						}

						if (totalTaxDAmt > minVal)
							taxExemptionAmt += isEmptyAmt(minVal);
						else
							taxExemptionAmt += isEmptyAmt(totalTaxDAmt);

					}
				}
				//ExemptionTax=5
				else if (ph.PayheadType == 5) {

					var exemptionColl = (ph.PayHeadingTaxExemptionColl && ph.PayHeadingTaxExemptionColl.length > 0 ? ph.PayHeadingTaxExemptionColl : null);

					if (exemptionColl == null) {
						var findGroup = $scope.PayHeadGroupList.firstOrDefault(p1 => p1.PayHeadGroupId == ph.PayHeadGroupId);
						if (findGroup) {
							if (findGroup.PayHeadGroupTaxExemptionColl) {
								exemptionColl = findGroup.PayHeadGroupTaxExemptionColl;
							}
						}
					}

					if (exemptionColl && exemptionColl.length > 0) {
						angular.forEach(exemptionColl, function (rl) {

							if (rl.Gender == emp.GenderId && rl.MaritalStatus == emp.MaritalStatusId && rl.Resident == emp.ResidentId) {
								if (rl.Amount > 0) {
									taxExeptionAmtMax = rl.Amount;
								} else if (rl.Formula.length > 0) {

								}
							}
							else if (rl.Gender == emp.GenderId && rl.MaritalStatus == emp.MaritalStatusId) {
								if (rl.Amount > 0) {
									taxExeptionAmtMax = rl.Amount;
								} else if (rl.Formula.length > 0) {

								}
							}
							else if (rl.Gender == emp.Gender) {
								if (rl.Amount > 0) {
									taxExeptionAmtMax = rl.Amount;
								} else if (rl.Formula.length > 0) {

								}
							}
							else if (rl.MaritalStatus == emp.MaritalStatus) {
								if (rl.Amount > 0) {
									taxExeptionAmtMax = rl.Amount;
								} else if (rl.Formula.length > 0) {

								}
							}
							else if (rl.Resident == emp.Resident) {
								if (rl.Amount > 0) {
									taxExeptionAmtMax = rl.Amount;
								} else if (rl.Formula.length > 0) {

								}
							} else if (rl.Gender == 0 && rl.MaritalStatus == 0 && rl.Resident == 0) {
								if (rl.Amount > 0) {
									taxExeptionAmtMax = rl.Amount;
								} else if (rl.Formula.length > 0) {

								}
							}

						});

					}

					//var taxEAmt = ph.Amount * (ph.Natures == 1 ? ph.PendingMonths : 1);

					var taxEAmt = ph.PAmount;
					if (taxEAmt > taxExeptionAmtMax) {
						taxExemptionAmt += isEmptyAmt(taxExeptionAmtMax);
					}
					else {
						taxExemptionAmt += isEmptyAmt(taxEAmt);
					}

				}
			}

		});

		emp.Earning = totalEarning;
		emp.Deduction = totalDeducation;

		var taxRules = {};
		if (emp.TaxRuleAs == 1) {
			//Normal
			if (emp.MaritalStatus == 1) // For Unmarried
			{
				if (emp.Resident == 1)
					taxRules = $scope.TaxRuleColl.where(p1 => p1.TaxType == 1 && p1.TaxFor == 1 && p1.CalculationFor == 1);
				else
					taxRules = $scope.TaxRuleColl.where(p1 => p1.TaxType == 1 && p1.TaxFor == 2 && p1.CalculationFor == 1);
			}
			else {
				if (emp.Resident == true)
					taxRules = $scope.TaxRuleColl.where(p1 => p1.TaxType == 1 && p1.TaxFor == 1 && p1.CalculationFor == 2);
				else
					taxRules = $scope.TaxRuleColl.where(p1 => p1.TaxType == 1 && p1.TaxFor == 2 && p1.CalculationFor == 2);
			}


		} else {
			//SSF
			if (emp.MaritalStatus == 1) // For Unmarried
			{
				if (emp.Resident == 1)
					taxRules = $scope.TaxRuleColl.where(p1 => p1.TaxType == 2 && p1.TaxFor == 1 && p1.CalculationFor == 1);
				else
					taxRules = $scope.TaxRuleColl.where(p1 => p1.TaxType == 2 && p1.TaxFor == 2 && p1.CalculationFor == 1);
			}
			else {
				if (emp.Resident == 1)
					taxRules = $scope.TaxRuleColl.where(p1 => p1.TaxType == 2 && p1.TaxFor == 1 && p1.CalculationFor == 2);
				else
					taxRules = $scope.TaxRuleColl.where(p1 => p1.TaxType == 2 && p1.TaxFor == 2 && p1.CalculationFor == 2);
			}

		}

		$scope.TaxCal = {
			EmployeeId: 0,
			BranchId: 0,
			DepartmentId: 0,
			CategoryId: 0,
			Code: '',
			EnrollNumber: 0,
			GenderId: 1,
			ResidentId: 1,
			MaritalStatusId: 1,
			AllowPayHeadingColl: []
		};

		$scope.TaxCal.SlabColl = [];
		//totalTaxableEarning = isEmptyAmt(totalTaxableEarning) - isEmptyAmt(taxExemptionAmt);
		var forTaxEaring = isEmptyAmt(totalTaxableEarning) + (totalTaxableEarning > 0 ? totalPTaxableEarning : 0) - isEmptyAmt(taxExemptionAmt);
		totalTaxableEarning = totalTaxableEarning - taxExemptionAmt;
		 
		var taxCalRateColl = [];
		if (taxRules) {

			var maxValue = 0;
			var isFirst = true;

			angular.forEach(taxRules, function (tr) {

				if (isFirst) {
					maxValue = tr.MaxValue;
					isFirst = false;
				}
				else
					maxValue = (tr.MaxValue - tr.MinValue) + 1;


				var findTP = mx(emp.PayHeadColl).firstOrDefault(p1 => p1.PayHeadingId == tr.PayHeadingId);

				if (forTaxEaring > 0) {
					if (maxValue >= forTaxEaring) {
						taxCalRateColl.push({
							Amount: forTaxEaring,
							Rate: tr.Rate,
							PayHeadingId: tr.PayHeadingId,
							PAmount: findTP ? findTP.PAmount : 0,
						});
						forTaxEaring = 0;
					} else if (maxValue < forTaxEaring) {
						taxCalRateColl.push({
							Amount: maxValue,
							Rate: tr.Rate,
							PayHeadingId: tr.PayHeadingId,
							PAmount: findTP ? findTP.PAmount : 0,
						});

						forTaxEaring -= maxValue;
					}
				}
			});
		}

		if (forTaxEaring > 0 && taxCalRateColl && taxCalRateColl.length > 0) {
			var lastRate = taxCalRateColl[taxCalRateColl.length - 1];
			var findTP1 = mx(emp.PayHeadColl).firstOrDefault(p1 => p1.PayHeadingId == lastRate.PayHeadingId);
			taxCalRateColl.push({
				Amount: forTaxEaring,
				Rate: lastRate.Rate,
				PayHeadingId: lastRate.PayHeadingId,
				PAmount: findTP1 ? findTP1.PAmount : 0,
			});
			forTaxEaring = 0;
		}

		 
		var taxAmt = 0;
		angular.forEach(taxCalRateColl, function (cr) {
			var totalTax = ((cr.Amount * cr.Rate) / 100);

			var tAmt = ToRound((totalTax - isEmptyAmt(cr.PAmount)) / (emp.PendingMonths + 1));
			//var tAmt = totalTax / 12;
			//var tAmt = totalTax / emp.TotalMonth;
			taxAmt += tAmt;
			taxPayableAmt += tAmt;
			$scope.TaxCal.SlabColl.push({
				Amount: cr.Amount,
				Rate: cr.Rate,
				Tax: tAmt,
				TotalTax: totalTax,
				PayHeadingId: cr.PayHeadingId
			});
		});

		if (totalSalary > 0) {
			//Re Tax payable amount zero  on 2026-01-20
			taxPayableAmt = 0;

			angular.forEach(emp.PayHeadColl, function (ph) {
				if (ph.IsAllow == true && (ph.PayheadType == 4 || ph.PayheadType == 6)) {

					if (ph.CalculationType != 3) {
						var findTaxColl = mx($scope.TaxCal.SlabColl).where(p1 => p1.PayHeadingId == ph.PayHeadingId);
						ph.TaxSlabColl = findTaxColl;
						if (findTaxColl) {
							ph.Amount = ToRound(findTaxColl.sum(p1 =>isEmptyAmt(p1.Tax)));							
						}
					}
					taxPayableAmt += ph.Amount;
				}
			});

			//Tax Rebate
			var taxRebateAmt = 0;
			angular.forEach(emp.PayHeadColl, function (ph) {
				if (ph.IsAllow == true && ph.PayheadType == 7) {
					taxRebateAmt += isEmptyAmt(ph.Amount);
				}
			});

			taxPayableAmt = taxPayableAmt - taxRebateAmt;

			// For Tax Adjustment
			angular.forEach(emp.PayHeadColl, function (ph) {
				if (ph.IsAllow == true && (ph.PayheadType == 8 || ph.PayheadType == 9)) {
					taxPayableAmt += isEmptyAmt(ph.Amount);
				}
			});

			emp.Tax = ToRound(taxPayableAmt);
			emp.Netpayable = ToRound(ToRound(totalEarning) - ToRound(totalDeducation) - ToRound(taxPayableAmt));
		}
		else {
			taxPayableAmt = 0;
			angular.forEach(emp.PayHeadColl, function (ph) {
				if (ph.IsAllow == true && (ph.PayheadType == 4 || ph.PayheadType == 6) && ph.CalculationType != 3) {

					var findTaxColl = mx($scope.TaxCal.SlabColl).where(p1 => p1.PayHeadingId == ph.PayHeadingId);
					ph.TaxSlabColl = [];
					if (findTaxColl) {
						ph.Amount = 0;
					}
				}
			});

			emp.Tax = 0;
			emp.Netpayable = ToRound( ToRound(totalEarning) - ToRound(totalDeducation) - ToRound(taxPayableAmt));
		}
		 
	};

	$scope.CurTaxDetailsColl = [];
	$scope.ShowTaxDetails = function (emp, ph) {
		$scope.CurTaxDetailsColl = [];
		if (ph.TaxSlabColl) {
			ph.TaxSlabColl.forEach(function (ts) {
				$scope.CurTaxDetailsColl.push(ts);
			});
			$('#detailmodel').modal('show');
		}
	}

	$scope.CurTaxDetailsColl = [];
	$scope.ShowTaxDetails = function (emp, ph) {
		$scope.CurTaxDetailsColl = [];
		if (ph.TaxSlabColl) {
			ph.TaxSlabColl.forEach(function (ts) {
				$scope.CurTaxDetailsColl.push(ts);
			});
			$('#detailmodel').modal('show');
		}
	}
	$scope.DeleteSalarySheet = function () {
		Swal.fire({
			title: 'Do you want to delete the selected data?',
			showCancelButton: true,
			confirmButtonText: 'Delete',
		}).then((result) => {
			if (result.isConfirmed) {
				var para = {
					BranchId: $scope.newFilter.BranchId,
					DepartmentId: $scope.newFilter.DepartmentId,
					CategoryId: $scope.newFilter.CategoryId,
					YearId: $scope.newFilter.YearId,
					MonthId: $scope.newFilter.MonthId
				};
				$http({
					method: 'POST',
					url: base_url + "HR/Transaction/DeleteSalarySheet",
					dataType: "json",
					data: JSON.stringify(para)
				}).then(function (res) {
					hidePleaseWait();
					$scope.loadingstatus = "stop";

					Swal.fire(res.data.ResponseMSG);
					if (res.data.IsSuccess) {
						$scope.GetEmployeeForSalarySheet();
					} else {
						Swal.fire(res.data.ResponseMSG);
					}
				}, function (reason) {
					Swal.fire('Failed' + reason);
				});
			}
		});
	};


	$scope.DelSalarySheetData = function (refData, ind) {
		Swal.fire({
			title: 'Do you want to delete SalarySheet of ' + refData.EmployeeName + '?',
			showCancelButton: true,
			confirmButtonText: 'Delete',
			//message: 'Are you sure to delete selected Branch :-' + beData.Name,
		}).then((result) => {
			if (result.isConfirmed) {
				var para = {
					EmployeeId: refData.EmployeeId,
					YearId: $scope.newFilter.YearId,
					MonthId: $scope.newFilter.MonthId
				};
				$http({
					method: 'POST',
					url: base_url + "HR/Transaction/DelSalarySheetData",
					dataType: "json",
					data: JSON.stringify(para)
				}).then(function (res) {
					hidePleaseWait();
					$scope.loadingStatus = "stop";

					Swal.fire(res.data.ResponseMSG);
					if (res.data.IsSuccess == true) {
						$scope.GetEmployeeForSalarySheet();
					}
				}, function (reason) {
					Swal.fire('Failed' + reason);
				});
			}

		});
	}



	$scope.UpdateDetailData = function (refData, ind) {
	
		var dtColl = [];
		var atColl = [];

		if ($scope.IsValidData())
		{
			var totalDays = refData.Days;
			var totalDays1 = 0;
			if (refData.AttendanceTypeColl) {
				refData.AttendanceTypeColl.forEach(function (att) {
					if (att.IsMonthly == true) {
						totalDays1 += isEmptyAmt(att.Value);
					}
				});
			}

	 
			if (totalDays1 > totalDays) {
				Swal.fire("Please ! Enter Days less than equal " + totalDays + "("+totalDays1+") of employee " + refData.EmployeeName + " (" + refData.EmployeeCode + ")");
				return false;
			}

			$scope.loadingstatus = "running";
			showPleaseWait();

			refData.PayHeadColl.forEach(function (ph) {
				if (ph.Amount > 0 || ph.Amount < 0) {
					dtColl.push({
						EmployeeId: refData.EmployeeId,
						PayHeadingId: ph.PayHeadingId,
						Amount: isEmptyAmt(ph.Amount),
						Rate: isEmptyAmt(ph.Rate),
						YearId: $scope.newFilter.YearId,
						MonthId: $scope.newFilter.MonthId,
						Earning: isEmptyAmt(refData.Earning),
						Deducation: isEmptyAmt(refData.Deducation),
						Tax: isEmptyAmt(refData.Tax),
						Netpayable: isEmptyAmt(refData.Netpayable),
					});
				}
			});

			refData.AttendanceTypeColl.forEach(function (ph) {
				if (ph.Value > 0 || ph.Value < 0) {
					atColl.push({
						EmployeeId: refData.EmployeeId,
						AttendanceTypeId: ph.AttendanceTypeId,
						Value: isEmptyAmt(ph.Value),
						Rate: isEmptyAmt(ph.Rate),
						YearId: $scope.newFilter.YearId,
						MonthId: $scope.newFilter.MonthId
					});
				}
			})
			$http({
				method: 'POST',
				url: base_url + "HR/Transaction/SaveSalarySheet",
				headers: { 'Content-Type': undefined },
				transformRequest: function (data) {
					var formData = new FormData();

					formData.append("dtColl", angular.toJson(data.dtColl));
					formData.append("atColl", angular.toJson(data.atColl));

					return formData;
				},
				data: { dtColl: dtColl, atColl: atColl }
			}).then(function (res) {
				$scope.loadingstatus = "stop";
				hidePleaseWait();
				Swal.fire(res.data.ResponseMSG);
				if (res.data.IsSuccess == true) {
					$scope.GetEmployeeForSalarySheet();
				}
			}, function (errormessage) {
				hidePleaseWait();
				$scope.loadingstatus = "stop";
			});
		}
		
	}


	$scope.pageChangeHandler = function (num) {
		console.log('page changed to ' + num);
	};

	$scope.PasteAttData = function (att, sind) {
		var clipText = event.clipboardData.getData('text/plain');

		if (clipText)
		{ 
			$scope.loadingstatus = 'running';
			showPleaseWait();
			///var ind = sind;
			var ind = 0;
			clipText.split("\n").forEach(function (line) {
				if (line && line.length > 0) {
					if (ind < $scope.EmployeeListForSalarySheet.length) {
						var emp = $scope.EmployeeListForSalarySheet[ind];
						for (var ii = 0; ii < emp.AttendanceTypeColl.length; ii++) {
							var findAtt = emp.AttendanceTypeColl[ii];
							if (findAtt.AttendanceTypeId == att.AttendanceTypeId) {
								findAtt.Value = isEmptyAmt(line);								
								$scope.ChangeAttendance(emp, findAtt);
								break;
							}
						}
                    }					
					ind++;
				}
			});


			hidePleaseWait();
			$scope.loadingstatus = "stop";
		}
	}
	$scope.PastePayData = function (ph, sind) {
		var clipText = event.clipboardData.getData('text/plain');

		if (clipText) {
			$scope.loadingstatus = 'running';
			showPleaseWait();
			var ind = 0;
			clipText.split("\n").forEach(function (line) {
				if (line && line.length > 0) {
					if (ind < $scope.EmployeeListForSalarySheet.length) {
						var emp = $scope.EmployeeListForSalarySheet[ind];
						for (var ii = 0; ii < emp.PayHeadColl.length; ii++) {
							var findPH = emp.PayHeadColl[ii];
							if (findPH.PayHeadingId == ph.PayHeadingId) {
								findPH.Amount = isEmptyAmt(line);
								$scope.ChangeRate(emp, findPH);
								break;
							}
						}
					}
					ind++;
				}
			});

			hidePleaseWait();
			$scope.loadingstatus = "stop";
		}
	}


	$scope.GetSalaryJV = function () {
		if (!$scope.newFilter.YearId || $scope.newFilter.YearId === 0) {
			Swal.fire('Please select a valid Year.');
			return;
		}
		if (!$scope.newFilter.MonthId || $scope.newFilter.MonthId === 0) {
			Swal.fire('Please select a valid Month.');
			return;
		}
		$scope.loadingstatus = "running";
		showPleaseWait();
		$scope.SalaryJV = { LedgerSJV: [], PayHeadSJV: [] };
		$scope.ledger = { TotalDR: 0, TotalCR: 0 };
		$scope.PayHead = { TotalDR: 0, TotalCR: 0 };
		$scope.newDet = { Year: '', Month: '' };
		var para = {
			YearId: $scope.newFilter.YearId,
			MonthId: $scope.newFilter.MonthId
		};
		$http({
			method: 'POST',
			url: base_url + "HR/Transaction/GetSalaryJV",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.SalaryJV = {
					LedgerSJV: res.data.Data.LedgerSJV,
					PayHeadSJV: res.data.Data.PayHeadSJV
				};
				// Calculate totals for LedgerSJV
				$scope.ledger.TotalDR = $scope.SalaryJV.LedgerSJV.reduce(function (sum, item) {
					return sum + (item.DrAmount || 0);
				}, 0);
				$scope.ledger.TotalCR = $scope.SalaryJV.LedgerSJV.reduce(function (sum, item) {
					return sum + (item.CrAmount || 0);
				}, 0);

				// Calculate totals for PayHeadSJV
				$scope.PayHead.TotalDR = $scope.SalaryJV.PayHeadSJV.reduce(function (sum, item) {
					return sum + (item.DrAmount || 0);
				}, 0);
				$scope.PayHead.TotalCR = $scope.SalaryJV.PayHeadSJV.reduce(function (sum, item) {
					return sum + (item.CrAmount || 0);
				}, 0);
				// Set Year and Month text for modal title
				var year = $scope.AcademicYearColl.find(function (item) {
					return item.id === $scope.newFilter.YearId;
				});
				var month = $scope.MonthList.find(function (item) {
					return item.id === $scope.newFilter.MonthId;
				});
				$scope.newDet.Year = year ? year.text : 'Unknown';
				$scope.newDet.Month = month ? month.text : 'Unknown';

				$('#GenerateJVModal').modal('show');
			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			Swal.fire('Failed: ' + reason);
		});
	};


	$scope.GenerateJV = function () {
		Swal.fire({
			title: 'Are You Sure To Generate Journal Voucher ?',
			showCancelButton: true,
			confirmButtonText: 'Yes',
			//message: 'Are you sure to delete selected Branch :-' + beData.Name,
		}).then((result) => {
			if (result.isConfirmed) {
				var para = {
					YearId: $scope.newFilter.YearId,
					MonthId: $scope.newFilter.MonthId
				};
				$http({
					method: 'POST',
					url: base_url + "HR/Transaction/SaveSalaryJV",
					dataType: "json",
					data: JSON.stringify(para)
				}).then(function (res) {
					hidePleaseWait();
					$scope.loadingStatus = "stop";
					Swal.fire(res.data.ResponseMSG);
					$('#GenerateJVModal').modal('hide');
				}, function (reason) {
					Swal.fire('Failed' + reason);
				});
			}

		});
	}
});