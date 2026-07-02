
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

app.controller('ArrearSalarySheetController', function ($scope, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'Salary Detail';

	$scope.LoadData = function () {
		$('.select2').select2();
		$scope.confirmMSG = GlobalServices.getConfirmMSG();
		$scope.perPageColl = GlobalServices.getPerPageList();
		$scope.MonthList = GlobalServices.getMonthList();
		$scope.YearList = GlobalServices.getYearList();


		// for CompanyRelationshipList
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
			method: 'Get',
			url: base_url + "HR/Transaction/GetAllPaySlipsReport",
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

		$scope.PayHeadingList = [];
		$http({
			method: 'GET',
			url: base_url + "HR/Transaction/GetAllPayHeadingForTran",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.PayHeadingList = res.data.Data;
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
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});



		$scope.AttendanceTypeList = [];
		$http({
			method: 'Get',
			url: base_url + "HR/Master/GetAllAttendanceType",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.AttendanceTypeList = res.data.Data;
			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});


		//for department
		$scope.DepartmentList = [];
		$scope.DepartmentList_QRY = [];
		$http({
			method: 'GET',
			url: base_url + "HR/Master/GetAllDepartment",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.DepartmentList = res.data.Data;
				$scope.DepartmentList_QRY = mx(res.data.Data);
			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

		//CategoryList
		$scope.CategoryList = [];
		$scope.CategoryList_QRY = [];
		$http({
			method: 'GET',
			url: base_url + "HR/Master/GetAllCategory",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.CategoryList = res.data.Data;
				$scope.CategoryList_QRY = mx(res.data.Data);
			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

		//for branch
		$scope.BranchList = [];
		$http({
			method: 'GET',
			url: base_url + "Setup/Security/GetAllBranchList",
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
			ArrearSalarySheet: 1,
		};

		$scope.searchData = {
			ArrearSalarySheet: '',
		};

		$scope.perPage = {
			ArrearSalarySheet: GlobalServices.getPerPageRow(),
		};

		$scope.newFilter = {
			BranchId: 0,
			DepartmentId: 0,
			CategoryId: 0,
			YearId: 0,
			MonthId: 0
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

	$scope.sortEmpData = function (keyname) {
		$scope.sortKeySS = keyname;   //set the sortKey to the param passed
		$scope.reverseSS = !$scope.reverseSS; //if true make it false and vice versa
	}

	$scope.SaveArrearSalarySheet = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		var dtColl = [];
		var atColl = [];
		$scope.EmployeeListForArrearSalarySheet.forEach(function (emp) {
			// Process AttendanceTypeColl
			emp.AttendanceTypeColl.forEach(function (at) {
				if (at.Value > 0 || at.Value < 0) {
					atColl.push({
						EmployeeId: emp.EmployeeId,
						AttendanceTypeId: at.AttendanceTypeId, // Ensure you have this ID in your model
						Value: at.Value,
						YearId: $scope.newFilter.YearId,
						MonthId: $scope.newFilter.MonthId
					});
				}
			});
			// Process PayHeadColl
			emp.PayHeadColl.forEach(function (ph) {
				if (ph.Amount > 0 || ph.Amount < 0) {
					dtColl.push({
						EmployeeId: emp.EmployeeId,
						PayHeadingId: ph.PayHeadingId,
						Amount: ph.Amount ?? 0,
						Rate: isEmptyAmt(ph.Rate),
						YearId: $scope.newFilter.YearId,
						MonthId: $scope.newFilter.MonthId,
						Earning: isEmptyAmt(emp.Earning),
						Deducation: isEmptyAmt(emp.Deducation),
						Tax: isEmptyAmt(emp.Tax),
						Netpayable: isEmptyAmt(emp.Netpayable),
					});
				}
			});
		});
		$http({
			method: 'POST',
			url: base_url + "HR/Transaction/SaveArrearSalarySheet",
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
				/*    $scope.GetAllAssignCustomer();*/
			}
		}, function (errormessage) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
		});
	}


	$scope.GetEmployeeForArrearSalarySheet = function () {


		if ($scope.newFilter.YearId && $scope.newFilter.YearId > 0 && $scope.newFilter.MonthId && $scope.newFilter.MonthId > 0) {

		} else {
			return;
		}

		$scope.loadingstatus = "running";
		showPleaseWait();
		$scope.EmployeeListForArrearSalarySheet = [];

		var para = {
			BranchId: $scope.newFilter.BranchId,
			DepartmentId: $scope.newFilter.DepartmentId,
			CategoryId: $scope.newFilter.CategoryId,
			YearId: $scope.newFilter.YearId,
			MonthId: $scope.newFilter.MonthId,
		};
		$http({
			method: 'POST',
			url: base_url + "HR/Transaction/GetAllEmployeeForArrearSalarySheet",
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
						});

					});

					$scope.CalculateTax(beData);
					$scope.EmployeeListForArrearSalarySheet.push(beData);

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
							var amt = isEmptyAmt(cph.Amount);
							var rate = isEmptyAmt(cph.Rate);
							formula = formula.replaceAll(sno, amt);
							formula = formula.replaceAll(sno_rate, rate);
						}
					});

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
			Deducation: 0,
			Tax: 0,
			Netpayable: 0,
		}

		$scope.PayHeadingList.forEach(function (ph) {
			ph.GTAmount = 0;
		});
		var payHeadQry = mx($scope.PayHeadingList);

		$scope.EmployeeListForArrearSalarySheet.forEach(function (emp) {
			$scope.TotalRow.Earning += isEmptyAmt(emp.Earning);
			$scope.TotalRow.Deducation += isEmptyAmt(emp.Deducation);
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

	$scope.noofdec = 3;
	function ToRound(val) {
		val = isEmptyAmt(val);
		return ($filter('number')(val, $scope.noofdec)).parseDBL();
	}

	$scope.ChangeTotalAttendance = function (curAT) {
		$scope.EmployeeListForArrearSalarySheet.forEach(function (emp) {
			emp.AttendanceTypeColl.forEach(function (at) {
				$timeout(function () {
					at.Value = curAT.Value;
					$scope.ChangeAttendance(emp, at);
				});
			});
		});
	}

	$scope.ChangeAttendance = function (curEmp, curAT) {

		$scope.ReplaceFormula(curEmp);
		var findPayHead = mx(curEmp.PayHeadColl).firstOrDefault(p1 => p1.AttendanceTypeId == curAT.AttendanceTypeId);
		if (findPayHead) {
			$scope.ChangeRate(curEmp, findPayHead);
		}
	}

	$scope.ChangeRate = function (curEmp, curPH) {

		$scope.ReplaceFormula(curEmp);
		var curPHQry = mx(curEmp.PayHeadColl);

		angular.forEach(curEmp.AttendanceTypeColl, function (atc) {
			angular.forEach(curEmp.PayHeadColl, function (ph) {
				$scope.ReplaceFormula(curEmp);
				if (ph.IsAllow == true) {
					$scope.CalculateTax(curEmp);

					if (ph.CalculationType == 1) {
						if (ph.AttendanceTypeId == atc.AttendanceTypeId) {
							if (ph.CalculationOnHeading > 0) {
								var findOnPayHead = curPHQry.firstOrDefault(p1 => p1.PayHeadingId == ph.CalculationOnHeading);
								if (findOnPayHead) {

									if (ph.PayHeadingDetailsColl) {

										var phDetCollQry = mx(ph.PayHeadingDetailsColl);
										var findPHOnCal = phDetCollQry.firstOrDefault(p1 => p1.BranchId == curEmp.BranchId && p1.CategoryId == curEmp.CategoryId && p1.MinAmount <= findOnPayHead.Amount && p1.MaxAmount >= findOnPayHead.Amount);
										if (!findPHOnCal) {
											findPHOnCal = phDetCollQry.firstOrDefault(p1 => p1.BranchId == curEmp.BranchId && p1.MinAmount <= findOnPayHead.Amount && p1.MaxAmount >= findOnPayHead.Amount);
										}
										if (!findPHOnCal) {
											findPHOnCal = phDetCollQry.firstOrDefault(p1 => p1.CategoryId == curEmp.CategoryId && p1.MinAmount <= findOnPayHead.Amount && p1.MaxAmount >= findOnPayHead.Amount);
										}
										if (!findPHOnCal) {
											findPHOnCal = phDetCollQry.firstOrDefault(p1 => p1.MinAmount <= findOnPayHead.Amount && p1.MaxAmount >= findOnPayHead.Amount);
										}

										if (findPHOnCal) {
											if (findPHOnCal.Rate > 0) {
												ph.Amount = findOnPayHead.Amount * findPHOnCal.Rate / 100;
											} else if (findPHOnCal.FixedAmount > 0) {
												ph.Amount = findPHOnCal.FixedAmount;
											}
										}

									}

								}
							}
							else {
								//ph.Amount = isEmptyAmt(ph.Rate) * isEmptyAmt(atc.Value);

								var calVal = atc.CalculationValue;
								var atcDetColl = atc.AttendanceTypeDetailsColl;
								if (atcDetColl && atcDetColl.length > 0) {
									atcDetColl = mx(atcDetColl);
									var findAT = atcDetColl.firstOrDefault(p1 => p1.BranchId == curEmp.BranchId && p1.DepartmentId == curEmp.DepartmentId && p1.EmployeeGroupId == curEmp.EmployeeGroupId && p1.EmployeeCategoryId == curEmp.CategoryId && p1.CalculationValue > 0);
									if (!findAT) {
										findAT = atcDetColl.firstOrDefault(p1 => p1.BranchId == curEmp.BranchId && p1.DepartmentId == curEmp.DepartmentId && p1.EmployeeGroupId == curEmp.EmployeeGroupId && p1.CalculationValue > 0);
									}
									if (!findAT) {
										findAT = atcDetColl.firstOrDefault(p1 => p1.BranchId == curEmp.BranchId && p1.DepartmentId == curEmp.DepartmentId && p1.CalculationValue > 0);
									}
									if (!findAT && curEmp.BranchId > 0) {
										findAT = atcDetColl.firstOrDefault(p1 => p1.BranchId == curEmp.BranchId && p1.CalculationValue > 0);
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
									if (findAT) {
										calVal = findAT.CalculationValue;
									}
								}
								if (ph.PayheadType != 4 && ph.PayheadType != 6) {
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

				}

				ph.Amount = ToRound(ph.Amount);
			});

		});


		// Calculate Tax
		$scope.CalculateTax(curEmp);

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
		emp.Deducation = 0;
		emp.NetPayaable = 0;

		var taxPayableAmt = 0;

		var totalSalary = 0;
		angular.forEach(emp.PayHeadColl, function (ph) {
			if (ph.PayheadType == 1 && ph.IsAllow == true)
				totalSalary += ph.Amount;
		});

		var totalTaxableEarning = 0;
		var totalPTaxableEarning = 0;

		angular.forEach(emp.PayHeadColl, function (ph) {
			ph.Amount = ToRound(ph.Amount);
			if (ph.IsAllow == true && ph.PayheadType != 1) {
				//ph.Amount = isEmptyAmt(parseFloat(parseFloat(ph.Amount).toFixed(2)));

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
				//Deducation=3
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
						var totalTaxDAmt = (ph.Natures == 1 ? ((ph.TRate * ph.PendingMonths) + ph.PAmount + ph.Amount) : (ph.Amount + ph.PAmount));
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
							taxExemptionAmt += minVal;
						else
							taxExemptionAmt += totalTaxDAmt;

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

					var taxEAmt = (ph.Natures == 1 ? (ph.TRate * ph.PendingMonths) + ph.PAmount + ph.Amount : (ph.Amount + ph.PAmount));

					if (taxEAmt > taxExeptionAmtMax) {
						taxExemptionAmt += taxExeptionAmtMax;
					}
					else {
						taxExemptionAmt += taxEAmt;
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
							taxExemptionAmt += minVal;
						else
							taxExemptionAmt += totalTaxDAmt;

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
						taxExemptionAmt += taxExeptionAmtMax;
					}
					else {
						taxExemptionAmt += taxEAmt;
					}

				}
			}

		});

		emp.Earning = totalEarning;
		emp.Deducation = totalDeducation;

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
		//var totalTaxableEarning = (taxableEarning * 12) - taxExemptionAmt;
		var forTaxEaring = totalTaxableEarning + (totalTaxableEarning > 0 ? totalPTaxableEarning : 0) - taxExemptionAmt;
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


				if (forTaxEaring > 0) {
					if (maxValue >= forTaxEaring) {
						taxCalRateColl.push({
							Amount: forTaxEaring,
							Rate: tr.Rate,
							PayHeadingId: tr.PayHeadingId,
						});
						forTaxEaring = 0;
					} else if (maxValue < forTaxEaring) {
						taxCalRateColl.push({
							Amount: maxValue,
							Rate: tr.Rate,
							PayHeadingId: tr.PayHeadingId,
						});

						forTaxEaring -= maxValue;
					}
				}
			});
		}

		if (forTaxEaring > 0 && taxCalRateColl && taxCalRateColl.length > 0) {
			var lastRate = taxCalRateColl[taxCalRateColl.length - 1];
			taxCalRateColl.push({
				Amount: forTaxEaring,
				Rate: lastRate.Rate,
				PayHeadingId: lastRate.PayHeadingId,
			});
			forTaxEaring = 0;
		}

		var taxAmt = 0;
		angular.forEach(taxCalRateColl, function (cr) {
			var tAmt = ((cr.Amount * cr.Rate) / 100) / 12;
			taxAmt += tAmt;
			taxPayableAmt += tAmt;
			$scope.TaxCal.SlabColl.push({
				Amount: cr.Amount,
				Rate: cr.Rate,
				Tax: tAmt,
				PayHeadingId: cr.PayHeadingId
			});
		});

		angular.forEach(emp.PayHeadColl, function (ph) {
			if (ph.IsAllow == true && (ph.PayheadType == 4 || ph.PayheadType == 6)) {

				var findTaxColl = mx($scope.TaxCal.SlabColl).where(p1 => p1.PayHeadingId == ph.PayHeadingId);
				ph.TaxSlabColl = findTaxColl;
				if (findTaxColl) {
					ph.Amount = ToRound(findTaxColl.sum(p1 => p1.Tax));
				}
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

		emp.Tax = ToRound(taxPayableAmt);
		emp.Netpayable = ToRound(totalEarning) - ToRound(totalDeducation) - ToRound(taxPayableAmt);
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

	$scope.DeleteArrearSalarySheet = function () {
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
					url: base_url + "HR/Transaction/DeleteArrearSalarySheet",
					dataType: "json",
					data: JSON.stringify(para)
				}).then(function (res) {
					hidePleaseWait();
					$scope.loadingstatus = "stop";

					Swal.fire(res.data.ResponseMSG);
					if (res.data.IsSuccess) {
						$scope.GetEmployeeForArrearSalarySheet();
					} else {
						Swal.fire(res.data.ResponseMSG);
					}
				}, function (reason) {
					Swal.fire('Failed' + reason);
				});
			}
		});
	};

	$scope.DelArrearSalarySheetData = function (refData, ind) {
		Swal.fire({
			title: 'Do you want to delete Arrear SalarySheet of ' + refData.EmployeeName + '?',
			showCancelButton: true,
			confirmButtonText: 'Delete',
		}).then((result) => {
			if (result.isConfirmed) {
				var para = {
					EmployeeId: refData.EmployeeId,
					YearId: $scope.newFilter.YearId,
					MonthId: $scope.newFilter.MonthId
				};
				$http({
					method: 'POST',
					url: base_url + "HR/Transaction/DelArrearSalarySheetData",
					dataType: "json",
					data: JSON.stringify(para)
				}).then(function (res) {
					hidePleaseWait();
					$scope.loadingStatus = "stop";

					Swal.fire(res.data.ResponseMSG);
					if (res.data.IsSuccess == true) {
						$scope.GetEmployeeForArrearSalarySheet();
					}
				}, function (reason) {
					Swal.fire('Failed' + reason);
				});
			}

		});
	}

	$scope.UpdateDetailData = function (refData, ind) {
		$scope.loadingstatus = "running";
		showPleaseWait();
		var dtColl = [];
		var atColl = [];
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
			url: base_url + "HR/Transaction/SaveArrearSalarySheet",
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
			Swal.fire(res.data.ResponseMSG); 5
			if (res.data.IsSuccess == true) {
				$scope.GetEmployeeForArrearSalarySheet();
			}
		}, function (errormessage) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
		});
	}


	$scope.pageChangeHandler = function (num) {
		console.log('page changed to ' + num);
	};

});