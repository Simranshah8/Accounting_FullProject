app.controller('ArrearSalaryDetailController', function ($scope, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'ArrearSalary Detail';

	$scope.LoadData = function () {
		$('.select2').select2();
		var gSrv = GlobalServices;
		$scope.confirmMSG = gSrv.getConfirmMSG();
		$scope.perPageColl = gSrv.getPerPageList();
		$scope.MonthList = gSrv.getMonthList();

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


		$scope.AcademicYearColl = [];
		$scope.AcademicYearColl = gSrv.getYearList();
		//gSrv.getAcademicYearList().then(function (res) {
		//	$scope.AcademicYearColl = res.data.Data;
		//}, function (reason) {
		//	Swal.fire('Failed' + reason);
		//});

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
				$scope.PayHeadingList1 = res.data.Data;
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
			ArrearSalaryDetail: 1,
		};

		$scope.searchData = {
			ArrearSalaryDetail: '',
		};

		$scope.perPage = {
			ArrearSalaryDetail: gSrv.getPerPageRow(),
		};

		$scope.newFilter = {
			BranchId: 0,
			DepartmentId: 0,
			CategoryId: 0,
			EffectiveDate_TMP: new Date(),
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


		/*$scope.GetPayHeadingForAllow();*/
		//$scope.GetAllAllowExpenseCategoryList();
		//$scope.GetAllExpenseCategoryList();
	}


	$scope.sortEmpData = function (keyname) {
		$scope.sortKeySS = keyname;   //set the sortKey to the param passed
		$scope.reverseSS = !$scope.reverseSS; //if true make it false and vice versa
	}

	$scope.SaveArrearSalaryDetail = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		var dtColl = [];
		$scope.EmployeeListForArrearSalaryDetail.forEach(function (emp) {

			//In case of single data pass cl i.e. cl.PaYheadcoll
			emp.PayHeadColl.forEach(function (ph) {
				if (ph.Amount > 0 || ph.Amount < 0) {
					dtColl.push({
						EmployeeId: emp.EmployeeId,
						PayHeadingId: ph.PayHeadingId,
						Amount: ph.Amount,
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
		$http({
			method: 'POST',
			url: base_url + "HR/Transaction/SaveArrearSalaryDetail",
			headers: { 'Content-Type': undefined },
			transformRequest: function (data) {
				var formData = new FormData();
				formData.append("jsonData", angular.toJson(data.jsonData));

				return formData;
			},
			data: { jsonData: dtColl }
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

	$scope.GetEmployeeForArrearSalaryDetail = function () {

		if ($scope.newFilter.YearId && $scope.newFilter.YearId > 0 && $scope.newFilter.MonthId && $scope.newFilter.MonthId > 0) {

		} else {
			return;
		}

		$scope.loadingstatus = "running";
		showPleaseWait();
		$scope.EmployeeListForArrearSalaryDetail = [];

		var para = {
			BranchId: $scope.newFilter.BranchId,
			DepartmentId: $scope.newFilter.DepartmentId,
			CategoryId: $scope.newFilter.CategoryId,
			YearId: $scope.newFilter.YearId,
			MonthId: $scope.newFilter.MonthId,
			CompanyRelationshipId: $scope.newFilter.CompanyRelationshipId,
		};
		$http({
			method: 'POST',
			url: base_url + "HR/Transaction/GetAllEmployeeForArrearSalaryDetail",
			dataType: "json",
			data: JSON.stringify(para),
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				var dataColl = mx(res.data.Data);

				var query = dataColl.groupBy(t => ({ EmployeeId: t.EmployeeId }));

				angular.forEach(query, function (q) {
					var fst = q.elements[0];
					var subQry = mx(q.elements);

					var beData = {
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
						PayHeadingId: fst.PayHeadingId,
						PayHeading: fst.PayHeading,
						MonthId: fst.MonthId,
						YearId: fst.YearId,
						TaxRuleAs: fst.TaxRuleAs,
						Resident: fst.Resident,
						Gender: fst.Gender,
						MaritalStatus: fst.MaritalStatus,
						Earning: fst.Earning,
						Deducation: fst.Deducation,
						Tax: fst.Tax,
						Netpayable: fst.Netpayable,
						//Earning: isEmptyAmt(fst.Earning),
						//Deducation: isEmptyAmt(fst.Deducation),
						//Tax: isEmptyAmt(fst.Tax),
						//Netpayable: isEmptyAmt(fst.Netpayable),
						PayHeadColl: [],
					};

					$scope.PayHeadingList.forEach(function (pa) {
						var find = subQry.firstOrDefault(p1 => p1.PayHeadingId == pa.PayHeadingId);

						var allowEdit = (pa.CalculationType == 1 || pa.CalculationType == 2) ? (find ? find.IsAllow : false) : false;

						beData.PayHeadColl.push({
							Name: pa.Name,
							Code: pa.Code,
							PayHeadingId: pa.PayHeadingId,
							Amount: find ? find.Amount : 0,
							IsAllow: find ? find.IsAllow : false,
							IsEditable: allowEdit,
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
							PayHeadingDetailsColl: pa.PayHeadingDetailsColl,
							PayHeadingTaxExemptionColl: pa.PayHeadingTaxExemptionColl,
						});

					});


					$scope.CalculateTax(beData);
					$scope.EmployeeListForArrearSalaryDetail.push(beData);

					if (beData.MonthId)
						$scope.newFilter.MonthId = beData.MonthId;

					if (beData.YearId)
						$scope.newFilter.YearId = beData.YearId;


				});

			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

	}

	//$scope.PayHeadTypeCol = [
	//	{ id: 1, text: 'Total ArrearSalary' },
	//	{ id: 2, text: 'Earning' },
	//	{ id: 3, text: 'Deduction' },
	//	{ id: 4, text: 'Income Tax' },
	//	{ id: 5, text: 'Exemption Tax' },
	//	{ id: 6, text: 'Tax' }
	//];

	$scope.ReplaceFormula = function (curEmp) {
		angular.forEach(curEmp.PayHeadColl, function (ph) {
			if (ph.Formula && ph.Formula.length > 0) {

				var formula = ph.Formula;
				curEmp.PayHeadColl.forEach(function (cph) {
					if (cph.SNo > 0) {
						var sno = 'p' + cph.SNo + '#';
						var amt = isEmptyAmt(cph.Amount);
						formula = formula.replaceAll(sno, amt);
					}
				});

				try {
					var nVal = math.evaluate(formula);
					ph.Amount = isEmptyNum(nVal);
				} catch { }

			}
			else if ((ph.CalculationOnHeading == null || ph.CalculationOnHeading == 0) && ph.PayHeadingDetailsColl && ph.PayHeadingDetailsColl.length > 0) {

			}
		});
	}
	
	$scope.ChangeRate = function (curEmp, curPH) {

		$scope.ReplaceFormula(curEmp);
		if (curPH.PayheadType == 1) {

			var curPHQry = mx(curEmp.PayHeadColl);

			angular.forEach(curEmp.PayHeadColl, function (ph) {
				if (ph.IsAllow == true && ph.PayheadType != 1) {
					$scope.ReplaceFormula(curEmp);
					if (ph.PayHeadingId != curPH.PayHeadingId) {

						if (ph.PayheadType == 2) // For Earning
						{
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
						}
					}
				}
			});
		}
		// Calculate Tax
		$scope.CalculateTax(curEmp);
	}

	$scope.CalculateTax = function (emp) {

		var totalEarning = 0;
		var totalDeduction = 0;
		var taxExemptionAmt = 0;
		var taxExeptionAmtMax = 0;

		var taxableEarning = 0;
		emp.Earning = 0;
		emp.Deduction = 0;
		emp.NetPayaable = 0;

		var taxPayableAmt = 0;

		var totalArrearSalary = 0;
		angular.forEach(emp.PayHeadColl, function (ph) {
			if (ph.PayheadType == 1 && ph.IsAllow == true)
				totalArrearSalary += ph.Amount;
		});

		angular.forEach(emp.PayHeadColl, function (ph) {
			if (ph.IsAllow == true && ph.PayheadType != 1) {
				ph.Amount = isEmptyAmt(parseFloat(parseFloat(ph.Amount).toFixed(2)));

				if (isNaN(ph.Amount))
					ph.Amount = 0;

				//Earning=2
				if (ph.PayheadType == 2) {
					totalEarning += ph.Amount;

					if (ph.IsTaxable == true)
						taxableEarning += ph.Amount;
				}
				//Deduction=3
				else if (ph.PayheadType == 3) {
					totalDeduction += ph.Amount;

					if (ph.IsTaxable == true) {

						var amt = 0, rate = 0;
						var formula = '';
						angular.forEach(ph.PayHeadingTaxExemptionColl, function (rl) {
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

						var totalTaxDAmt = ph.Amount * 12;
						var amt1 = (totalArrearSalary * 12) * rate / 100;

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

					angular.forEach(ph.PayHeadingTaxExemptionColl, function (rl) {

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

					if (ph.Rate > taxExeptionAmtMax)
						taxExemptionAmt += taxExeptionAmtMax;
					else
						taxExemptionAmt += ph.Amount;

				}
			}

		});

		emp.Earning = totalEarning;
		emp.Deduction = totalDeduction;

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
		var totalTaxableEarning = (taxableEarning * 12) - taxExemptionAmt;
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
					maxValue = tr.MaxValue - tr.MinValue;


				if (totalTaxableEarning > 0) {
					if (maxValue >= totalTaxableEarning) {
						taxCalRateColl.push({
							Amount: totalTaxableEarning,
							Rate: tr.Rate,
							PayHeadingId: tr.PayHeadingId,
						});
						totalTaxableEarning = 0;
					} else if (maxValue < totalTaxableEarning) {
						taxCalRateColl.push({
							Amount: maxValue,
							Rate: tr.Rate,
							PayHeadingId: tr.PayHeadingId,
						});

						totalTaxableEarning -= maxValue;
					}
				}
			});
		}

		if (totalTaxableEarning > 0 && taxCalRateColl && taxCalRateColl.length > 0) {
			var lastRate = taxCalRateColl[taxCalRateColl.length - 1];
			taxCalRateColl.push({
				Amount: totalTaxableEarning,
				Rate: lastRate.Rate,
				PayHeadingId: lastRate.PayHeadingId,
			});
			totalTaxableEarning = 0;
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
					ph.Amount = isEmptyAmt(findTaxColl.sum(p1 => p1.Tax));
				}
			}
		});

		emp.Tax = taxPayableAmt;
		emp.Netpayable = totalEarning - totalDeduction - taxPayableAmt;
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

	$scope.DeleteArrearSalaryDetail = function () {
		Swal.fire({
			title: 'Do you want to delete the selected data?',
			showCancelButton: true,
			confirmButtonText: 'Delete',
		}).then((result) => {
			/* Read more about isConfirmed, isDenied below */
			if (result.isConfirmed) {
				//$scope.loadingstatus = "running";
				//showPleaseWait();

				var para = {
					BranchId: $scope.newFilter.BranchId,
					DepartmentId: $scope.newFilter.DepartmentId,
					CategoryId: $scope.newFilter.CategoryId,
					YearId: $scope.newFilter.YearId,
					MonthId: $scope.newFilter.MonthId
				};

				$http({
					method: 'POST',
					url: base_url + "HR/Transaction/DeleteArrearSalaryDetail",
					dataType: "json",
					data: JSON.stringify(para)
				}).then(function (res) {
					hidePleaseWait();
					$scope.loadingstatus = "stop";

					Swal.fire(res.data.ResponseMSG);
					if (res.data.IsSuccess) {
						$scope.GetEmployeeForArrearSalaryDetail();
					} else {
						Swal.fire(res.data.ResponseMSG);
					}

				}, function (reason) {
					Swal.fire('Failed' + reason);
				});
			}
		});


	};

	$scope.DelArrearSalaryDetailData = function (refData, ind) {
		Swal.fire({
			title: 'Do you want to delete ArrearSalary Detail of ' + refData.EmployeeName + '?',
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
					url: base_url + "HR/Transaction/DelArrearSalaryDetailData",
					dataType: "json",
					data: JSON.stringify(para)
				}).then(function (res) {
					hidePleaseWait();
					$scope.loadingStatus = "stop";

					Swal.fire(res.data.ResponseMSG);
					if (res.data.IsSuccess == true) {
						$scope.GetEmployeeForArrearSalaryDetail();
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
		refData.PayHeadColl.forEach(function (ph) {
			if (ph.Amount > 0 || ph.Amount < 0) {
				dtColl.push({
					EmployeeId: refData.EmployeeId,
					PayHeadingId: ph.PayHeadingId,
					Amount: ph.Amount,
					YearId: $scope.newFilter.YearId,
					MonthId: $scope.newFilter.MonthId,
					Earning: isEmptyAmt(refData.Earning),
					Deducation: isEmptyAmt(refData.Deducation),
					Tax: isEmptyAmt(refData.Tax),
					Netpayable: isEmptyAmt(refData.Netpayable),
				});
			}
		});

		$http({
			method: 'POST',
			url: base_url + "HR/Transaction/SaveArrearSalaryDetail",
			headers: { 'Content-Type': undefined },
			transformRequest: function (data) {
				var formData = new FormData();
				formData.append("jsonData", angular.toJson(data.jsonData));

				return formData;
			},
			data: { jsonData: dtColl }
		}).then(function (res) {
			$scope.loadingstatus = "stop";
			hidePleaseWait();
			Swal.fire(res.data.ResponseMSG); 5
			if (res.data.IsSuccess == true) {
				/*    $scope.GetAllAssignCustomer();*/
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