
app.controller('Ledger', function ($scope, $http, $timeout, $filter, GlobalServices) {
	$scope.Title = 'Ledger';

	var glSrv = GlobalServices;
	$scope.LoadData = function () {

		$scope.ProvinceColl = GetStateList();
		$scope.DistrictColl = GetDistrictList();
		$scope.VDCColl = GetVDCList();

		$scope.ProvinceColl_Qry = mx($scope.ProvinceColl);
		$scope.DistrictColl_Qry = mx($scope.DistrictColl);
		$scope.VDCColl_Qry = mx($scope.VDCColl);

		$('.select2').select2({
			allowClear: true,
			openOnEnter: true
		});

		$scope.InterestPersColl = [{ id: 1, text: 'Calendar Month' }, { id: 2, text: 'Calendar Year' }, { id: 3, text: 'Per Month (30days)' }, { id: 4, text: 'Per Year (365days)' }];
		$scope.InterestOnsColl = [{ id: 1, text: 'DebitBalance' }, { id: 1, text: 'CreditBalance' }];


		//0=All,1=Debtor,2=Creditor,3=General Ledger,4=Debtor Creditor,5=Cash and Bank
		$scope.LedgerForColl = [{ id: 0, text: 'All' }, { id: 1, text: 'Debtor' }, { id: 2, text: 'Creditor' }, { id: 3, text: 'General Ledger' }, { id: 4, text: 'DebtorCreditor' }, { id: 5, text: 'CashBank' }];

		$scope.CostCenterInColl = [{ id: 1, text: 'DEBIT' }, { id: 2, text: 'CREDIT' }, { id: 3, text: 'DrCr' }];

		$scope.VoucherSearchOptions = [{ text: 'Name', value: 'Led.Name', searchType: 'text' }, { text: 'Alias', value: 'Led.Alias', searchType: 'text' }, { text: 'Code', value: 'Led.Code', searchType: 'text' }, { text: 'PanVat', value: 'LS.PanVatNo', searchType: 'text' }, { text: 'MobileNo', value: 'Led.CompanyContactNo', searchType: 'text' }];
		$scope.paginationOptions = {
			pageNumber: 1,
			pageSize: glSrv.getPerPageRow(),
			sort: null,
			SearchType: 'text',
			SearchCol: '',
			SearchVal: '',
			SearchColDet: $scope.VoucherSearchOptions[0],
			pagearray: [],
			pageOptions: [5, 10, 20, 30, 40, 50],
			For:0,
		};
		 

		$scope.confirmMSG = glSrv.getConfirmMSG();
		$scope.DrCrList = glSrv.getDrCr();
		//$scope.DocumentTypeList = GlobalServices.getDocumentTypeList();

		
		$scope.ChannelList = []; //declare an empty array		 
		$http({
			method: 'POST',
			url: base_url + "Account/Creation/GetAllLedgerChannel",
			dataType: "json"
		}).then(function (res) {
			if (res.data.IsSuccess && res.data.Data) {
				$scope.ChannelList = res.data.Data;
			}
		}, function (reason) {
			alert('Failed' + reason);
		});

		$scope.LedgerCategoryColl = []; //declare an empty array		 
		$http({
			method: 'POST',
			url: base_url + "Account/Creation/GetAllLedgerCategory",
			dataType: "json"
			//data:JSON.stringify(para)
		}).then(function (res) {
			if (res.data.IsSuccess && res.data.Data) {
				$scope.LedgerCategoryColl = res.data.Data;
			}

		}, function (reason) {
			alert('Failed' + reason);
		});

		$scope.DataTypeColl = [];
		$http({
			method: 'GET',
			url: base_url + "Global/GetDataType",
			dataType: "json",
		}).then(function (res) {
			if (res.data.IsSuccess && res.data.Data) {
				$scope.DataTypeColl = res.data.Data;
			}
			else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});


		$scope.CountryColl = [];
		$scope.CountryColl_Qry = [];
		GlobalServices.getCountry().then(function (res) {
			if (res.data.IsSuccess==true && res.data.Data) {
				$scope.CountryColl = res.data.Data;
				$scope.CountryColl_Qry = mx(res.data.Data);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});


		$scope.PriceColl = [];
		$http({
			method: 'GET',
			url: base_url + "Account/Creation/GetPriceForTag",
			dataType: "json",
		}).then(function (res) {
			if (res.data.IsSuccess && res.data.Data) {
				$scope.PriceColl = res.data.Data;
			} 
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

		$scope.newLedger = {
			UniqueId: GlobalServices.getUniqueId(),
			LedgerId: 0,
			DrCr: 1,
			NameNP: '',
			Name: '',
			Alias: '',
			Code: '',
			LedgerGroupId: 0,
			PanVatNo: '',
			Address: '',
			OpeningAmount: 0,
			DuesFrom: null,
			DuesFrom_TMP: null,
			CreditLimitAmount: 0,
			CreditLimitDays: 0,
			CurrencyId: 0,
			DebtorTypeId: null,
			DebtorRouteId: null,
			LedgerGroupId: 0,
			DocumentId: null,
			AreaId: 0,
			AgentId: 0,
			OpeningForBranchId: 1,
			Status: true,
			BillWiseAdjustment: false,
			InventoryValuesAreAffected: false,
			CostCentersAreApplied: false,
			ActiveInterestCalculation: false,
			ActiveChequeDetails: false,
			ActiveRemitDetails: false,
			IsTDS: false,
			IsVat: false,
			IsImportExportLedger: false,
			CreditLimitDaysType: 1,
			AccountNo: '',
			BankName: '',
			SlabWiseInterestRate: false,
			AfterDaysInterestActive: 0,
			InterestRate: 0,
			InterestPer: 0,
			InterestOn: 1,
			AditionalCostOnTheBasis: 1,
			TypeOfIncomeExp: 3,
			TypeOfDutyTax: 0,
			LedgerWiseCostCenter: false,
			CostCenterIn: 3,
			IsLC: false,
			LCPartyId: null,
			DocumentColl: [],
			ContactPersons: [],
			Rate: 0,
			BlockCreditTransaction: false,
			BlockDebitTransaction: false,
			Province: '',
			District: '',
			Palika: '',
			Tole: '',
			WardNo: 0,
			Lat: 0,
			Lon: 0,
			ProvinceId1: null,
			DistrictId1: null,
			CityId1: null,
			NotVisible: false,
			CreditLimitAs: 1,
			ActiveSMS: false,
			ActiveEmail: false,
			ActiveNotification: false,
			StatutoryDetail: {
				PanVatNo: ''
			},
			UDFColl: [],
			IsTaxable: true,
			InterestEffectAfterDate:null,
		};
		$scope.newLedger.UDFColl.push({ ColWidth: 3 });
		$scope.ClearContactDetails();

		$scope.EPDet = {};
		$scope.EPColl = [];
		GlobalServices.getEntityProperties(EntityId).then(function (res) {
			if (res.data.IsSuccess && res.data.Data) {
				$scope.EPColl = res.data.Data;
				angular.forEach($scope.EPColl, function (ep) {
					$scope.EPDet[ep.Name] = ep;
					$scope.newLedger[ep.Name] = ep.DefaultValue;
				});
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});


		$scope.CreditRuleTypeList = [];
		$http({
			method: 'GET',
			url: base_url + "Global/GetCreditRules",
			dataType: "json"
		}).then(function (res) {
			if (res.data.IsSuccess && res.data.Data) {
				$scope.CreditRuleTypeList = res.data.Data;
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});


		
		$scope.UDFFeildsColl = [];
		var para11 = {
			EntityId:LedgerEntity
		};
		$http({
			method: 'POST',
			url: base_url + "Setup/Security/getUDFByEntitId",
			dataType: "json",
			data:JSON.stringify(para11)
		}).then(function (res) {
			if (res.data.IsSuccess && res.data.Data) {
				$scope.UDFFeildsColl = res.data.Data;

				angular.forEach($scope.UDFFeildsColl, function (uff) {
					 
					if (uff.DataType == 9) {
						if (uff.DefaultValue == "true")
							uff.Value = true;
						else
							uff.Value = false;
					}

				});
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});


		$scope.BranchList = [];
		$http({
			method: 'GET',
			url: base_url + "Setup/Security/GetAllBranchList",
			dataType: "json"
		}).then(function (res) {
			if (res.data.IsSuccess && res.data.Data) {
				$scope.BranchList = res.data.Data;
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});


		$timeout(function () {
			$scope.SalesManList = [];
			$http({
				method: 'GET',
				url: base_url + "Account/Creation/GetAllSalesMan",
				dataType: "json"
			}).then(function (res) {
				if (res.data.IsSuccess && res.data.Data) {
					var dtColl = res.data.Data;
					angular.forEach(dtColl, function (dc) {
						//if (dc.LevelId == 1) {
							$scope.SalesManList.push(dc);
						//}
					});
				}
			}, function (reason) {
				Swal.fire('Failed' + reason);
			});
		});

		$timeout(function () {
			$scope.DocumentTypeList = [];
			$scope.DocumentTypeList_Qry = [];
			$http({
				method: 'GET',
				url: base_url + "Global/GetDocumentTypes",
				dataType: "json"
			}).then(function (res) {
				if (res.data.IsSuccess && res.data.Data) {
					$scope.DocumentTypeList = res.data.Data;
					$scope.DocumentTypeList_Qry = mx(res.data.Data);
				}
			}, function (reason) {
				Swal.fire('Failed' + reason);
			});
		});



		$timeout(function () {
			$scope.CurrencyList = [];
			$http({
				method: 'GET',
				url: base_url + "Account/Creation/GetAllCurrencyList",
				dataType: "json"
			}).then(function (res) {
				if (res.data.IsSuccess && res.data.Data) {
					$scope.CurrencyList = res.data.Data;
				}
			}, function (reason) {
				Swal.fire('Failed' + reason);
			});
		});


		$timeout(function () {

			$scope.AreaList = [];
			$http({
				method: 'GET',
				url: base_url + "Account/Creation/GetAreaMasteForTran",
				dataType: "json"
			}).then(function (res) {
				hidePleaseWait();
				$scope.loadingstatus = "stop";
				if (res.data.IsSuccess && res.data.Data) {
					$scope.AreaList = res.data.Data;
				}
			}, function (reason) {
				Swal.fire('Failed' + reason);
			});

			$scope.RouteList = [];
			$http({
				method: 'GET',
				url: base_url + "Account/Creation/GetAllDebtorRouteList",
				dataType: "json"
			}).then(function (res) {
				hidePleaseWait();
				$scope.loadingstatus = "stop";
				if (res.data.IsSuccess && res.data.Data) {
					$scope.RouteList = res.data.Data;
				}
			}, function (reason) {
				Swal.fire('Failed' + reason);
			});
		});


		$timeout(function () {
			$scope.DebtorTypeList = [];
			$http({
				method: 'GET',
				url: base_url + "Account/Creation/GetAllDebtorTypeList",
				dataType: "json"
			}).then(function (res) {
				hidePleaseWait();
				$scope.loadingstatus = "stop";
				if (res.data.IsSuccess && res.data.Data) {
					$scope.DebtorTypeList = res.data.Data;
				}
			}, function (reason) {
				Swal.fire('Failed' + reason);
			});

			$scope.AditionalCostTypeList = [];
			GlobalServices.getAditionalCostTypes().then(function (res)
			{				
				if (res.data.IsSuccess && res.data.Data) {
					$scope.AditionalCostTypeList = res.data.Data;
				}
			}, function (reason) {
				Swal.fire('Failed' + reason);
			});

			$scope.AllLedgerGroupList = [];
			$scope.LedgerGroupList = [];
			$http({
				method: 'GET',
				url: base_url + "Account/Creation/GetAllLedgerGroupList",
				dataType: "json"
			}).then(function (res) {
				hidePleaseWait();
				$scope.loadingstatus = "stop";
				if (res.data.IsSuccess && res.data.Data) {					
					var tmpDataCC = res.data.Data;
					$scope.AllLedgerGroupList = [];

					$scope.AccConfig = {};
					GlobalServices.getAccConfig().then(function (res1) {
						if (res1.data.IsSuccess && res1.data.Data) {
							$scope.AccConfig = res1.data.Data;

							$scope.LedgerGroupList = [];
							angular.forEach(tmpDataCC, function (d) {
								if (d.ShowInLedgerMaster == true) {

									$scope.AllLedgerGroupList.push(d);

									if ($scope.AccConfig.AllowSubGroupSequence == true) {
										if (d.LedgerGroupId < 45) {
											$scope.LedgerGroupList.push(d);
										}
									} else {
										$scope.LedgerGroupList.push(d);
									}
								}
							});

						}
					}, function (reason) {
						Swal.fire('Failed' + reason);
					});
					 
				}
			}, function (reason) {
				Swal.fire('Failed' + reason);
			});

			$scope.DutyTaxTypeList = [];
			$http({
				method: 'POST',
				url: base_url + "Account/Creation/GetTypeOfDutyTaxs",
				dataType: "json"
			}).then(function (res) {
				hidePleaseWait();
				$scope.loadingstatus = "stop";
				if (res.data.IsSuccess && res.data.Data) {
					$scope.DutyTaxTypeList = res.data.Data;
				}
			}, function (reason) {
				Swal.fire('Failed' + reason);
			});

			$scope.IncomeExpensesTypeList = [];
			$http({
				method: 'POST',
				url: base_url + "Account/Creation/GetTypeOfIncomeExpenses",
				dataType: "json"
			}).then(function (res) {
				hidePleaseWait();
				$scope.loadingstatus = "stop";
				if (res.data.IsSuccess && res.data.Data) {
					$scope.IncomeExpensesTypeList = res.data.Data;
				}
			}, function (reason) {
				Swal.fire('Failed' + reason);
			});

			$scope.DocumentTypeList = [];
			//GlobalServices.getDocumentTypeList().then(function (res) {
			//	$scope.DocumentTypeList = res.data.Data;
			//}, function (reason) {
			//	Swal.fire('Failed' + reason);
			//});
			 

		});


		$timeout(function () {
			if (TranId && TranId > 0) {
				var newEdit = {
					LedgerId: TranId,
				};
				$scope.GetLedgerById(newEdit);
			}
		});
		 
	}

	$scope.GetLabel = function (ep) {
		if ($scope.EPDet && $scope.EPDet[ep])
			return $scope.EPDet[ep].Label;
		else
			return "***Label***";
    }

	$scope.ChangeDebtorType = function () {

		if (!$scope.newLedger.DebtorTypeId || $scope.newLedger.DebtorTypeId == 0) {
			if ($scope.newLedger.TypeOfDutyTax == 30) {
				$scope.newLedger.TypeOfDutyTax == 0
            }			
        }

		if ($scope.newLedger.DebtorTypeId > 0) {
			var findDT = mx($scope.DebtorTypeList).firstOrDefault(p1 => p1.DebtorTypeId == $scope.newLedger.DebtorTypeId);
			if (findDT) {
				if (findDT.DType == 5) {
					$scope.newLedger.TypeOfDutyTax = 30;
				}
			}
		}
	}
	$scope.GenerateCode = function () {

		if ($scope.newLedger.LedgerId > 0 && $scope.newLedger.Code && $scope.newLedger.Code.length > 0)
			return;

		$scope.newLedger.Code = '';
		var para = {
			name: $scope.newLedger.Name,
			ledgerGroupId: $scope.newLedger.LedgerGroupId,
			debtorTypeId:$scope.newLedger.DebtorTypeId
		};
		$http({
			method: 'POST',
			url: base_url + "Account/Creation/GetLedgerCode",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			$timeout(function () {
				if (res.data.IsSuccess && res.data.Data) {
					$scope.newLedger.Code = res.data.Data.ResponseId;
				}
			});
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

		//$scope.ChangeGroup(1, $scope.newLedger.LedgerGroupId);
	};

	$scope.ChangeGroup = function (ind,gid,isModify)
	{
		if (ind == 1) {
			$scope.SubGroupColl1 = [];

			if (isModify==true) {

			} else {
				$scope.newLedger.SubGroup1 = null;
				$scope.newLedger.SubGroup2 = null;
				$scope.newLedger.SubGroup3 = null;
				$scope.newLedger.SubGroup4 = null;
				$scope.newLedger.SubGroup5 = null;
			}
			
			angular.forEach($scope.AllLedgerGroupList, function (d) {
				if (d.ShowInLedgerMaster == true) {
					if (d.ParentGroupId == gid) {
						$scope.SubGroupColl1.push(d);
					}
				}
			});

			if (isModify == true) {
				$scope.ChangeGroup(2, $scope.newLedger.SubGroup1, isModify);
			}
			

		}
		else if (ind == 2) {
			$scope.SubGroupColl2 = [];		
			if (isModify == true) {

			} else {
				$scope.newLedger.SubGroup2 = null;
				$scope.newLedger.SubGroup3 = null;
				$scope.newLedger.SubGroup4 = null;
				$scope.newLedger.SubGroup5 = null;
			}
			
			angular.forEach($scope.AllLedgerGroupList, function (d) {
				if (d.ShowInLedgerMaster == true) {
					if (d.ParentGroupId == gid) {
						$scope.SubGroupColl2.push(d);
					}
				}
			});

			if (isModify == true) {
				$scope.ChangeGroup(3, $scope.newLedger.SubGroup2, isModify);
			}
		}
		else if (ind == 3) {
			$scope.SubGroupColl3 = [];
			if (isModify == true) {

			} else {
				$scope.newLedger.SubGroup3 = null;
				$scope.newLedger.SubGroup4 = null;
				$scope.newLedger.SubGroup5 = null;
			}
			
			angular.forEach($scope.AllLedgerGroupList, function (d) {
				if (d.ShowInLedgerMaster == true) {
					if (d.ParentGroupId == gid) {
						$scope.SubGroupColl3.push(d);
					}
				}
			});

			if (isModify == true) {
				$scope.ChangeGroup(4, $scope.newLedger.SubGroup3, isModify);
			}
		}
		else if (ind == 4) {
			$scope.SubGroupColl4 = [];	
			if (isModify == true) {

			} else {
				$scope.newLedger.SubGroup4 = null;
				$scope.newLedger.SubGroup5 = null;
			}
			
			angular.forEach($scope.AllLedgerGroupList, function (d) {
				if (d.ShowInLedgerMaster == true) {
					if (d.ParentGroupId == gid) {
						$scope.SubGroupColl4.push(d);
					}
				}
			});

			if (isModify == true) {
				$scope.ChangeGroup(5, $scope.newLedger.SubGroup4, isModify);
			}
		}
		else if (ind == 5) {
			$scope.SubGroupColl5 = [];
			if (isModify == true) {

			} else {
				$scope.newLedger.SubGroup5 = null;
			}
			
			angular.forEach($scope.AllLedgerGroupList, function (d) {
				if (d.ShowInLedgerMaster == true) {
					if (d.ParentGroupId == gid) {
						$scope.SubGroupColl5.push(d);
					}
				}
			});
		}
		
	}
	$scope.newContactDetails = {};
	$scope.AddNewContactPerson = function ()
	{
		if (!$scope.newContactDetails.Name.isEmpty())
		{
			$scope.newLedger.ContactPersons.push($scope.newContactDetails);
			$scope.ClearContactDetails();
		} 
	};
	$scope.EditContactPerson = function (ind) {
		$scope.newContactDetails = $scope.newLedger.ContactPersons[ind];
		$scope.newLedger.ContactPersons.splice(ind, 1);
	};
	$scope.DelContactPerson = function (ind) {
		$scope.newLedger.ContactPersons.splice(ind, 1);
	};

	$scope.CurDocument = {};
	$scope.AddMoreFiles = function () {

		if ($scope.CurDocument.DocumentTypeId > 0 && $scope.CurDocument.Document_TMP)
		{
			var findDocType = $scope.DocumentTypeList_Qry.firstOrDefault(p1 => p1.DocumentTypeId == $scope.CurDocument.DocumentTypeId);
			var file = $scope.CurDocument.Document_TMP[0];
			if (findDocType) {
				$scope.newLedger.DocumentColl.push({
					DocumentTypeId: findDocType.DocumentTypeId,
					DocumentTypeName: findDocType.Name,
					File: file,
					Name: file.name,
					Type: file.type,
					Size: file.size,
					Description: '',
					DocumentData: $scope.CurDocument.DocumentData,
					DocPath: null
				});

				$scope.CurDocument = {};

				$('#flMoreFiles').val('');
			}
		}
	};
	$scope.delAttachmentFiles = function (ind) {
		if ($scope.newLedger.DocumentColl) {
			if ($scope.newLedger.DocumentColl.length > 0) {
				$scope.newLedger.DocumentColl.splice(ind, 1);
			}
		}
	}
	$scope.ClearLedger = function () {


		$scope.newMaster = {
			TranId: 0
		};

		$('#cboAgentId').select2({
			allowClear: true,
			openOnEnter: true
		});


		angular.forEach($scope.UDFFeildsColl, function (uf) {
			uf.Value = '';
			uf.AlterNetValue = '';
			uf.UDFValue = '';

			if (uf.DataType == 9 || uf.Type == 9) {
				if (uf.DefaultValue == "true")
					uf.Value = true;
				else
					uf.Value = false;
			}
			else if (uf.DataType == 2 || uf.Type == 2) {
				uf.Value = null;
				uf.Value_TMP = null;
				uf.UDFValue_TMP = null;
			}
		});

		$timeout(function () {
			$scope.newLedger = {
				UniqueId: GlobalServices.getUniqueId(),
				LedgerId: 0,
				DrCr: 1,
				NameNP: '',
				Name: '',
				Alias: '',
				Code: '',
				LedgerGroupId: 0,
				PanVatNo: '',
				Address: '',
				OpeningAmount: 0,
				DuesFrom: null,
				DuesFrom_TMP: null,
				CreditLimitAmount: 0,
				CreditLimitDays: 0,
				CurrencyId: 0,
				DebtorTypeId: null,
				DebtorRouteId: null,
				LedgerGroupId: 0,
				DocumentId: null,
				AreaId: 0,
				AgentId: 0,
				OpeningForBranchId: 1,
				Status: true,
				BillWiseAdjustment: false,
				InventoryValuesAreAffected: false,
				CostCentersAreApplied: false,
				ActiveInterestCalculation: false,
				ActiveChequeDetails: false,
				ActiveRemitDetails: false,
				IsTDS: false,
				IsVat: false,
				IsImportExportLedger: false,
				CreditLimitDaysType: 1,
				AccountNo: '',
				BankName: '',
				SlabWiseInterestRate: false,
				AfterDaysInterestActive: 0,
				InterestRate: 0,
				InterestPer: 0,
				InterestOn: 1,
				AditionalCostOnTheBasis: 1,
				TypeOfIncomeExp: 3,
				TypeOfDutyTax: 0,
				LedgerWiseCostCenter: false,
				CostCenterIn: 3,
				IsLC: false,
				LCPartyId: null,
				DocumentColl: [],
				ContactPersons: [],
				Rate: 0,
				BlockCreditTransaction: false,
				BlockDebitTransaction: false,
				Province: '',
				District: '',
				Palika: '',
				Tole: '',
				WardNo: null,
				Lat: 0,
				Lon: 0,
				ProvinceId1: null,
				DistrictId1: null,
				CityId1: null,
				NotVisible: false,
				CreditLimitAs: 1,
				ActiveSMS: false,
				ActiveEmail: false,
				ActiveNotification: false,
				StatutoryDetail: {
					PanVatNo: ''
				},
				UDFColl: [],
				IsTaxable: true,
				InterestEffectAfterDate: null,
				InterestEffectAfterDate_TMP:null,
			};

			$scope.newLedger.UDFColl.push({ ColWidth: 3 });

			$scope.ClearContactDetails();

			$scope.SubGroupColl1 = [];
			$scope.SubGroupColl2 = [];
			$scope.SubGroupColl3 = [];
			$scope.SubGroupColl4 = [];

			angular.forEach($scope.EPColl, function (ep) {
				$scope.newLedger[ep.Name] = ep.DefaultValue;
			});
			
		});

	}

	$scope.ClearContactDetails = function () {
		$scope.newContactDetails = {
			Name: '',
			Post: '',
			Address: '',
			EmailId: '',
			CitizenShipNo: '',
			MobileNo1: '',
			MobileNo2: '',
			TelNo1: '',
			TelNo2: '', 
		};
	}


	$scope.ClearDocumentAttach = function () {
		$scope.newDocumentAttach = {
			DocumentAttachId: null,
			TypeOfDocument: '',
			AttachDoc: null,

		};
	}


	//ContactDetails Clear photo
	$scope.ClearContactDetailsPhoto = function () {
		$timeout(function () {
			$scope.$apply(function () {
				$scope.newContactDetails.PhotoData = null;
				$scope.newContactDetails.Photo_TMP = [];
			});

		});

		$('#imgPhoto').attr('src', '');
		$('#imgPhoto1').attr('src', '');

	};

	//************************* Ledger *********************************

	$scope.IsValidLedger = function () {
		if ($scope.newLedger.Name.isEmpty()) {
			Swal.fire('Please ! Enter Name');
			return false;
		}

		return true;
	}

	$scope.SaveUpdateLedger = function () {
		if ($scope.IsValidLedger() == true) {
			if ($scope.confirmMSG.Accept == true) {
				var saveModify = $scope.newLedger.Mode;
				Swal.fire({
					title: 'Do you want to ' + saveModify + ' the current data?',
					showCancelButton: true,
					confirmButtonText: saveModify,
				}).then((result) => {
					/* Read more about isConfirmed, isDenied below */
					if (result.isConfirmed) {
						$scope.CallSaveUpdateLedger();
					}
				});
			} else
				$scope.CallSaveUpdateLedger();

		}
	};

	$scope.CallSaveUpdateLedger = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();

		$scope.AddNewContactPerson();

		$scope.newLedger.AgentIdColl = [];
		$scope.newLedger.AgentId = 0;
		if ($scope.newLedger.TmpAgentIdColl) {
			if ($scope.newLedger.TmpAgentIdColl.length > 0) {
				$scope.newLedger.AgentIdColl = $scope.newLedger.TmpAgentIdColl;
			}
		}


		if ($scope.newLedger.DuesFromDet) {
			$scope.newLedger.DuesFrom = $filter('date')(new Date($scope.newLedger.DuesFromDet.dateAD), 'yyyy-MM-dd');
		}
		else
			$scope.newLedger.DuesFrom = null;

		if ($scope.newLedger.InterestEffectAfterDateDet) {
			$scope.newLedger.InterestEffectAfterDate = $filter('date')(new Date($scope.newLedger.InterestEffectAfterDateDet.dateAD), 'yyyy-MM-dd');
		}
		else
			$scope.newLedger.InterestEffectAfterDate = null;

		if (!$scope.newLedger.AreaId)
			$scope.newLedger.AreaId = 0;

		var selectData = $('#cboProvince').select2('data');
		if (selectData && selectData.length > 0)
			province = selectData[0].text.trim();

		selectData = $('#cboDistrict').select2('data');
		if (selectData && selectData.length > 0)
			district = selectData[0].text.trim();


		selectData = $('#cboArea').select2('data');
		if (selectData && selectData.length > 0)
			area = selectData[0].text.trim();

		$scope.newLedger.Province = province;
		$scope.newLedger.District = district;
		$scope.newLedger.Palika = area;

		var filesColl = $scope.newLedger.DocumentColl;

		var voucherUDFFields = [];
		var voucherKeyVal = {};
		$scope.newLedger.UserDefineFieldsColl = [];
		angular.forEach($scope.UDFFeildsColl, function (udf) {

			if (udf.NameId && udf.NameId.length > 0) {
				var uVal = {
					UDFId: udf.Id,
					Value: udf.UDFValue,
					AlterNetValue: '',
				};
				if (udf.FieldType == 2 || udf.FieldType == 22 || udf.FieldType == 23) {
					var ud = {
						SNo: (udf.FieldNo ? udf.FieldNo : udf.SNo),
						Name: udf.Name,
						Value: udf.UDFValueDet ? $filter('date')(udf.UDFValueDet.dateAD, 'yyyy-MM-dd') : '',
						AlValue: udf.UDFValueDet ? udf.UDFValueDet.dateBS : '',
					};
					uVal.AlterNetValue = ud.AlValue;
					voucherUDFFields.push(ud);
					voucherKeyVal[udf.NameId] = udf.UDFValueDet ? udf.UDFValueDet.dateBS : '';
				} else if (udf.FieldType == 3 && udf.Source && udf.Source.length > 0) {
					var ud = {
						SNo: (udf.FieldNo ? udf.FieldNo : udf.SNo),
						Name: udf.Name,
						Value: udf.UDFValue,
						AlValue: udf.UDFValueDet ? udf.UDFValueDet.text : '',
					};
					uVal.AlterNetValue = ud.AlValue;
					voucherUDFFields.push(ud);
					voucherKeyVal[udf.NameId] = udf.UDFValueDet ? udf.UDFValueDet.text : ''
				}
				else {
					var ud = {
						SNo: (udf.FieldNo ? udf.FieldNo : udf.SNo),
						Name: udf.Name,
						Value: udf.UDFValue
					};
					uVal.AlterNetValue = ud.Value;
					voucherUDFFields.push(ud);
					voucherKeyVal[udf.NameId] = udf.UDFValue;
				}

				$scope.newLedger.UserDefineFieldsColl.push(uVal);
			}

		});
		if (voucherUDFFields.length > 0) {
			$scope.newLedger.Attributes = JSON.stringify(voucherUDFFields);
			$scope.newLedger.UDFKeyVal = JSON.stringify(voucherKeyVal);
		} else {
			$scope.newLedger.Attributes = "";
			$scope.newLedger.UDFKeyVal = "";
		}

		if (!$scope.newLedger.BDId)
			$scope.newLedger.BDId = 0;

		$scope.newLedger.UniqueId = $scope.newLedger.UniqueId;

		$http({
			method: 'POST',
			url: base_url + "Account/Creation/SaveLedger",
			headers: { 'Content-Type': undefined },

			transformRequest: function (data) {

				var formData = new FormData();
				formData.append("jsonData", angular.toJson(data.jsonData));


				if (data.files) {
					for (var i = 0; i < data.files.length; i++) {
						formData.append("file" + i, data.files[i].File);
					}
				}

				return formData;
			},
			data: { jsonData: $scope.newLedger, files: filesColl }
		}).then(function (res) {

			$scope.loadingstatus = "stop";
			hidePleaseWait();

			Swal.fire(res.data.ResponseMSG);

			if (res.data.IsSuccess == true) {
				$scope.ClearLedger();
			}

		}, function (errormessage) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";

		}); 
	}

	$scope.GetAllLedgerList = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		$scope.LedgerList = [];

		$http({
			method: 'POST',
			url: base_url + "Account/Creation/GetAllLedgerList",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.LedgerList = res.data.Data;

			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

	};

	$scope.GetLedgerById = function (refData) {

		$scope.loadingstatus = "running";
		showPleaseWait();

		$scope.ClearLedger();
		$timeout(function () {
			var para = {
				LedgerId: refData.LedgerId
			};

			$http({
				method: 'POST',
				url: base_url + "Account/Creation/GetLedgerById",
				dataType: "json",
				data: JSON.stringify(para)
			}).then(function (res) {
				hidePleaseWait();
				$scope.loadingstatus = "stop";
				if (res.data.IsSuccess && res.data.Data) {
					var resData = res.data.Data;

					$scope.newMaster = {
						TranId:resData.LedgerId
					};

					$scope.newLedger = resData;
					$scope.newLedger.Mode = 'Modify';

					//$scope.newLedger.AgentIdColl = [];
					if ($scope.newLedger.DuesFrom)
						$scope.newLedger.DuesFrom_TMP = new Date($scope.newLedger.DuesFrom);

					if ($scope.newLedger.InterestEffectAfterDate)
						$scope.newLedger.InterestEffectAfterDate_TMP = new Date($scope.newLedger.InterestEffectAfterDate);

					if (resData.Province) {
						var findProvince = $scope.ProvinceColl_Qry.firstOrDefault(p1 => p1.text.toUpperCase() == resData.Province.toUpperCase());

						if (findProvince)
							$scope.newLedger.ProvinceId1 = findProvince.id;
						else
							$scope.newLedger.ProvinceId1 = null;
					}
					else {
						$scope.newLedger.ProvinceId1 = null;
                    }
					
					if (resData.District) {
						var findDistrict = $scope.DistrictColl_Qry.firstOrDefault(p1 => p1.text.toUpperCase() == resData.District.toUpperCase());
						if (findDistrict)
							$scope.newLedger.DistrictId1 = findDistrict.id;
						else
							$scope.newLedger.DistrictId1 = null;
                    }
					else {
						$scope.newLedger.DistrictId1 = null;
					}

					if (resData.Palika) {
						var findArea = $scope.VDCColl_Qry.firstOrDefault(p1 => p1.text.toUpperCase() == resData.Palika.toUpperCase());
						if (findArea)
							$scope.newLedger.CityId1 = findArea.id;
						else
							$scope.newLedger.CityId1 = null;
                    }
					else {
						$scope.newLedger.CityId1 = null;
					}

					angular.forEach($scope.UDFFeildsColl, function (uf) {
						uf.Value = '';
						uf.AlterNetValue = '';
					});

					if ($scope.newLedger.Attributes && $scope.newLedger.Attributes.length > 0) {
						var udfFieldsColl = mx(JSON.parse($scope.newLedger.Attributes));
						angular.forEach($scope.UDFFeildsColl, function (udd) {
							var findU = udfFieldsColl.firstOrDefault(p1 => p1.SNo == udd.SNo);
							if (findU) {
								if (udd.FieldType == 2) {
									if (findU.Value) {
										udd.UDFValue_TMP = new Date(findU.Value);
									}
								} else if (udd.FieldType == 4) {
									if (findU.Value) {
										udd.UDFValue = parseInt(findU.Value);
									}
								}
								else
									udd.UDFValue = findU.Value;
							}
						});
					}

					if ($scope.newLedger.UDFColl.length == 0)
						$scope.newLedger.UDFColl.push({ ColWidth: 3 });


					$timeout(function () {
						if ($scope.newLedger.AgentIdColl && $scope.newLedger.AgentIdColl.length > 0) {
							$scope.newLedger.TmpAgentIdColl = $scope.newLedger.AgentIdColl;
							$("#cboAgent").val($scope.newLedger.AgentIdColl).change();
						}
					});

					if ($scope.newLedger.DebtorTypeId > 0) {
						var findDT = mx($scope.DebtorTypeList).firstOrDefault(p1 => p1.DebtorTypeId == $scope.newLedger.DebtorTypeId);
						if (findDT) {
							if (findDT.DType == 5) {
								$scope.newLedger.TypeOfDutyTax = 30;
							}
						}
					}

					if ($scope.AccConfig.AllowSubGroupSequence == true)
						$scope.ChangeGroup(1, $scope.newLedger.LedgerGroupId,true);

					$('#searVoucherRightBtn').modal('hide');

				} else {
					Swal.fire(res.data.ResponseMSG);
				}

			}, function (reason) {
				Swal.fire('Failed' + reason);
			});
		});
	
	};

	$scope.DelLedgerById = function (refData) {

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
					LedgerId: refData.LedgerId
				};

				$http({
					method: 'POST',
					url: base_url + "Account/Creation/DelLedger",
					dataType: "json",
					data: JSON.stringify(para)
				}).then(function (res) {
					hidePleaseWait();
					$scope.loadingstatus = "stop";
					if (res.data.IsSuccess) {
						$scope.SearchData();
					} else {
						Swal.fire(res.data.ResponseMSG);
					}

				}, function (reason) {
					Swal.fire('Failed' + reason);
				});
			}
		});


	};


	//************************* ContactDetails *********************************

	$scope.IsValidContactDetails = function () {
		if ($scope.newContactDetails.Name.isEmpty()) {
			Swal.fire('Please ! Enter Name');
			return false;
		}

		return true;
	}

	$scope.SaveUpdateContactDetails = function () {
		if ($scope.IsValidContactDetails() == true) {
			if ($scope.confirmMSG.Accept == true) {
				var saveModify = $scope.newContactDetails.Mode;
				Swal.fire({
					title: 'Do you want to ' + saveModify + ' the current data?',
					showCancelButton: true,
					confirmButtonText: saveModify,
				}).then((result) => {
					/* Read more about isConfirmed, isDenied below */
					if (result.isConfirmed) {
						$scope.CallSaveUpdateContactDetails();
					}
				});
			} else
				$scope.CallSaveUpdateContactDetails();

		}
	};

	$scope.CallSaveUpdateContactDetails = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();

		$http({
			method: 'POST',
			url: base_url + "Account/Creation/SaveContactDetails",
			headers: { 'Content-Type': undefined },

			transformRequest: function (data) {

				var formData = new FormData();
				formData.append("jsonData", angular.toJson(data.jsonData));

				return formData;
			},
			data: { jsonData: $scope.newContactDetails }
		}).then(function (res) {

			$scope.loadingstatus = "stop";
			hidePleaseWait();

			Swal.fire(res.data.ResponseMSG);

			if (res.data.IsSuccess == true) {
				$scope.ClearContactDetails();
				$scope.GetAllContactDetailsList();
			}

		}, function (errormessage) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";

		});



	}

	$scope.GetAllContactDetailsList = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		$scope.ContactDetailsList = [];

		$http({
			method: 'POST',
			url: base_url + "Account/Creation/GetAllContactDetailsList",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.ContactDetailsList = res.data.Data;

			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

	};

	$scope.GetContactDetailsById = function (refData) {

		$scope.loadingstatus = "running";
		showPleaseWait();

		var para = {
			ContactDetailsId: refData.ContactDetailsId
		};

		$http({
			method: 'POST',
			url: base_url + "Account/Creation/GetContactDetailsById",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.newContactDetails = res.data.Data;
				$scope.newContactDetails.Mode = 'Modify';

				//document.getElementById('author-section').style.display = "none";
				//document.getElementById('author-form').style.display = "block";

			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	};

	$scope.DelContactDetailsById = function (refData) {

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
					ContactDetailsId: refData.ContactDetailsId
				};

				$http({
					method: 'POST',
					url: base_url + "Account/Creation/DelContactDetails",
					dataType: "json",
					data: JSON.stringify(para)
				}).then(function (res) {
					hidePleaseWait();
					$scope.loadingstatus = "stop";
					if (res.data.IsSuccess) {
						$scope.GetAllContactDetailsList();
					} else {
						Swal.fire(res.data.ResponseMSG);
					}

				}, function (reason) {
					Swal.fire('Failed' + reason);
				});
			}
		});


	};

	//************************* StatutoryDetails *********************************

	$scope.IsValidStatutoryDetails = function () {
		if ($scope.newStatutoryDetails.BankName.isEmpty()) {
			Swal.fire('Please ! Enter Bank Name');
			return false;
		}

		return true;
	}

	$scope.SaveUpdateStatutoryDetails = function () {
		if ($scope.IsValidStatutoryDetails() == true) {
			if ($scope.confirmMSG.Accept == true) {
				var saveModify = $scope.newStatutoryDetails.Mode;
				Swal.fire({
					title: 'Do you want to ' + saveModify + ' the current data?',
					showCancelButton: true,
					confirmButtonText: saveModify,
				}).then((result) => {
					/* Read more about isConfirmed, isDenied below */
					if (result.isConfirmed) {
						$scope.CallSaveUpdateStatutoryDetails();
					}
				});
			} else
				$scope.CallSaveUpdateStatutoryDetails();

		}
	};

	$scope.CallSaveUpdateStatutoryDetails = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();

		$http({
			method: 'POST',
			url: base_url + "Account/Creation/SaveStatutoryDetails",
			headers: { 'Content-Type': undefined },

			transformRequest: function (data) {

				var formData = new FormData();
				formData.append("jsonData", angular.toJson(data.jsonData));

				return formData;
			},
			data: { jsonData: $scope.newStatutoryDetails }
		}).then(function (res) {

			$scope.loadingstatus = "stop";
			hidePleaseWait();

			Swal.fire(res.data.ResponseMSG);

			if (res.data.IsSuccess == true) {
				$scope.ClearStatutoryDetails();
				$scope.GetAllStatutoryDetailsList();
			}

		}, function (errormessage) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";

		});



	}

	$scope.GetAllStatutoryDetailsList = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		$scope.StatutoryDetailsList = [];

		$http({
			method: 'POST',
			url: base_url + "Account/Creation/GetAllStatutoryDetailsList",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.StatutoryDetailsList = res.data.Data;

			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

	};

	$scope.GetStatutoryDetailsById = function (refData) {

		$scope.loadingstatus = "running";
		showPleaseWait();

		var para = {
			StatutoryDetailsId: refData.StatutoryDetailsId
		};

		$http({
			method: 'POST',
			url: base_url + "Account/Creation/GetStatutoryDetailsById",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.newStatutoryDetails = res.data.Data;
				$scope.newStatutoryDetails.Mode = 'Modify';

				//document.getElementById('author-section').style.display = "none";
				//document.getElementById('author-form').style.display = "block";

			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	};

	$scope.DelStatutoryDetailsById = function (refData) {

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
					StatutoryDetailsId: refData.StatutoryDetailsId
				};

				$http({
					method: 'POST',
					url: base_url + "Account/Creation/DelStatutoryDetails",
					dataType: "json",
					data: JSON.stringify(para)
				}).then(function (res) {
					hidePleaseWait();
					$scope.loadingstatus = "stop";
					if (res.data.IsSuccess) {
						$scope.GetAllStatutoryDetailsList();
					} else {
						Swal.fire(res.data.ResponseMSG);
					}

				}, function (reason) {
					Swal.fire('Failed' + reason);
				});
			}
		});


	};

	//************************* DocumentAttach *********************************

	$scope.IsValidDocumentAttach = function () {
		if ($scope.newDocumentAttach.TypeOfDocument.isEmpty()) {
			Swal.fire('Please ! Enter Document Type');
			return false;
		}

		return true;
	}

	$scope.SaveUpdateDocumentAttach = function () {
		if ($scope.IsValidDocumentAttach() == true) {
			if ($scope.confirmMSG.Accept == true) {
				var saveModify = $scope.newDocumentAttach.Mode;
				Swal.fire({
					title: 'Do you want to ' + saveModify + ' the current data?',
					showCancelButton: true,
					confirmButtonText: saveModify,
				}).then((result) => {
					/* Read more about isConfirmed, isDenied below */
					if (result.isConfirmed) {
						$scope.CallSaveUpdateDocumentAttach();
					}
				});
			} else
				$scope.CallSaveUpdateDocumentAttach();

		}
	};

	$scope.CallSaveUpdateDocumentAttach = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();

		$http({
			method: 'POST',
			url: base_url + "Account/Creation/SaveDocumentAttach",
			headers: { 'Content-Type': undefined },

			transformRequest: function (data) {

				var formData = new FormData();
				formData.append("jsonData", angular.toJson(data.jsonData));

				return formData;
			},
			data: { jsonData: $scope.newDocumentAttach }
		}).then(function (res) {

			$scope.loadingstatus = "stop";
			hidePleaseWait();

			Swal.fire(res.data.ResponseMSG);

			if (res.data.IsSuccess == true) {
				$scope.ClearDocumentAttach();
				$scope.GetAllDocumentAttachList();
			}

		}, function (errormessage) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";

		});



	}

	$scope.GetAllDocumentAttachList = function () {
		$scope.loadingstatus = "running";
		showPleaseWait();
		$scope.DocumentAttachList = [];

		$http({
			method: 'POST',
			url: base_url + "Account/Creation/GetAllDocumentAttachList",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.DocumentAttachList = res.data.Data;

			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});

	};

	$scope.GetDocumentAttachById = function (refData) {

		$scope.loadingstatus = "running";
		showPleaseWait();

		var para = {
			DocumentAttachId: refData.DocumentAttachId
		};

		$http({
			method: 'POST',
			url: base_url + "Account/Creation/GetDocumentAttachById",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.newDocumentAttach = res.data.Data;
				$scope.newDocumentAttach.Mode = 'Modify';

				//document.getElementById('author-section').style.display = "none";
				//document.getElementById('author-form').style.display = "block";

			} else {
				Swal.fire(res.data.ResponseMSG);
			}

		}, function (reason) {
			Swal.fire('Failed' + reason);
		});
	};

	$scope.DelDocumentAttachById = function (refData) {

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
					DocumentAttachId: refData.DocumentAttachId
				};

				$http({
					method: 'POST',
					url: base_url + "Account/Creation/DelDocumentAttach",
					dataType: "json",
					data: JSON.stringify(para)
				}).then(function (res) {
					hidePleaseWait();
					$scope.loadingstatus = "stop";
					if (res.data.IsSuccess) {
						$scope.GetAllDocumentAttachList();
					} else {
						Swal.fire(res.data.ResponseMSG);
					}

				}, function (reason) {
					Swal.fire('Failed' + reason);
				});
			}
		});


	};

	$scope.pageChangeHandler = function (num) {
		console.log('page changed to ' + num);
	};

	$scope.SearchDataColl = [];
	$scope.SearchData = function () {

		$scope.loadingstatus = 'running';
		showPleaseWait();
		$scope.paginationOptions.TotalRows = 0;

		var sCol = $scope.paginationOptions.SearchColDet;

		var para = { 
			filter: {
				DateFrom: null,
				DateTo: null,
				PageNumber: $scope.paginationOptions.pageNumber,
				RowsOfPage: $scope.paginationOptions.pageSize,
				SearchCol: (sCol ? sCol.value : ''),
				SearchVal: $scope.paginationOptions.SearchVal,
				SearchType: (sCol ? sCol.searchType : 'text'),
				For: $scope.paginationOptions.For,
			}
		};

		$http({
			method: 'POST',
			url: base_url + "Account/Creation/GetLedgerLst",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			$scope.loadingstatus = 'stop';
			hidePleaseWait();

			if (res.data.IsSuccess && res.data.Data) {
				$scope.SearchDataColl = res.data.Data;
				$scope.paginationOptions.TotalRows = res.data.TotalCount;
				$('#searVoucherRightBtn').modal('show');

			} else
				alert(res.data.ResponseMSG);

		}, function (reason) {
			alert('Failed' + reason);
		});


	};

	$scope.ReSearchData = function (pageInd) {

		$timeout(function () {
			if (pageInd && pageInd >= 0)
				$scope.paginationOptions.pageNumber = pageInd;
			else if (pageInd == -1)
				$scope.paginationOptions.pageNumber = 1;

			$scope.loadingstatus = 'running';
			showPleaseWait();
			$scope.paginationOptions.TotalRows = 0;
			var sCol = $scope.paginationOptions.SearchColDet;

			var para = {
				filter: {
					DateFrom: null,
					DateTo: null,
					PageNumber: $scope.paginationOptions.pageNumber,
					RowsOfPage: $scope.paginationOptions.pageSize,
					SearchCol: (sCol ? sCol.value : ''),
					SearchVal: $scope.paginationOptions.SearchVal,
					SearchType: (sCol ? sCol.searchType : 'text'),
					For:$scope.paginationOptions.For,
				}
			};

			$http({
				method: 'POST',
				url: base_url + "Account/Creation/GetLedgerLst",
				dataType: "json",
				data: JSON.stringify(para)
			}).then(function (res) {
				$scope.loadingstatus = 'stop';
				hidePleaseWait();

				if (res.data.IsSuccess && res.data.Data) {
					$scope.SearchDataColl = res.data.Data;
					$scope.paginationOptions.TotalRows = res.data.TotalCount;

				} else
					alert(res.data.ResponseMSG);

			}, function (reason) {
				alert('Failed' + reason);
			});
		});
		

	}
	$scope.ShowPersonalImg = function (item) {
		$scope.viewImg = {
			ContentPath: '',
			FileType: null
		};

		if (item.DocPath && item.DocPath.length > 0) {
			$scope.viewImg.ContentPath = item.DocPath;
			$scope.viewImg.FileType = 'pdf';  // Assuming DocPath is for PDFs
			document.getElementById('pdfViewer').src = item.DocPath;
			$('#PersonalImg').modal('show');
		} else if (item.PhotoPath && item.PhotoPath.length > 0) {
			$scope.viewImg.ContentPath = item.PhotoPath;
			$scope.viewImg.FileType = 'image';  // Assuming PhotoPath is for images
			$('#PersonalImg').modal('show');
		} else if (item.File) {
			var blob = new Blob([item.File], { type: item.File?.type });
			$scope.viewImg.ContentPath = URL.createObjectURL(blob);
			$scope.viewImg.FileType = item.File.type.startsWith('image/') ? 'image' : 'pdf';

			if ($scope.viewImg.FileType === 'pdf') {
				document.getElementById('pdfViewer').src = $scope.viewImg.ContentPath;
			}

			$('#PersonalImg').modal('show');
		} else {
			Swal.fire('No Image Found');
		}
	};
	//$scope.ShowPersonalImg = function (docDet) {
	//	$scope.viewImg = {
	//		ContentPath: '',
	//		File: null,
	//		FileData:null
	//	};
	//	if (docDet.DocPath || docDet.File)
	//	{
	//		$scope.viewImg.ContentPath = docDet.DocPath;
	//		$scope.viewImg.File = docDet.File;
	//		$scope.viewImg.FileData = docDet.DocumentData;
	//		$('#PersonalImg').modal('show');
	//	} else
	//		Swal.fire('No Image Found');

	//};

	$scope.ChangeAreaSelection = function (areaId) {
		if ($scope.AreaList_Qry) {
			var findArea = $scope.AreaList_Qry.firstOrDefault(p1 => p1.AreaId == areaId);
			if (findArea) {

				var findProvince = $scope.ProvinceColl_Qry.firstOrDefault(p1 => p1.text == findArea.State);

				if (findProvince)
					$scope.newLedger.ProvinceId1 = findProvince.id;
				else
					$scope.newLedger.ProvinceId1 = null;

				var findDistrict = $scope.DistrictColl_Qry.firstOrDefault(p1 => p1.text == findArea.District);
				if (findDistrict)
					$scope.newLedger.DistrictId1 = findDistrict.id;
				else
					$scope.newLedger.DistrictId1 = null;

				var findArea1 = $scope.VDCColl_Qry.firstOrDefault(p1 => p1.text == findArea.City);
				if (findArea1)
					$scope.newLedger.CityId1 = findArea1.id;
				else
					$scope.newLedger.CityId1 = null;

				$scope.newLedger.Tole = findArea.Name;

			}
		}
	}

	$scope.ChangePanrentFields = function (col) {
		if (col == 1) // Name
		{
			$scope.newContactDetails.Name = $scope.newLedger.Name;
		}
		else if (col == 2) // Address
		{
			$scope.newContactDetails.Address = $scope.newLedger.Address;
		}
	}

	$scope.MulData = null;
	$scope.MulObj = {};
	$scope.ShowMultipleModal = function () {

		if ($scope.MulData == null) {

			$http({
				method: 'GET',
				url: base_url + "Setup/Security/GetEntityProp?EntityId=" + EntityId,
				dataType: "json"
			}).then(function (res1) {
				$scope.loadingstatus = "stop";
				hidePleaseWait();
				if (res1.data.IsSuccess && res1.data.PropertiesColl) {
					$scope.MulData = {};
					$scope.MulData.ColColl = [];
					$scope.MulData.DataColl = [];
					$scope.MulObj = res1.data.Obj;
					angular.forEach(res1.data.PropertiesColl, function (pc) {
						$scope.MulData.ColColl.push({
							id: pc.Id,
							label: pc.Name,
							name: pc.PropertyName,
							dataType: pc.DataType,
						}); 
					});
					var newObj = angular.copy($scope.MulObj);
					$scope.MulData.DataColl.push(newObj);

					$scope.MulData.Title = 'Create Multiple Ledger';
					$('#frmImportMultipleCopy').modal('show');
				}
				else {
					Swal.fire(res1.data.ResponseMSG);
				}

			}, function (reason) {
				Swal.fire('Failed' + reason);
			});
		}
		else {
			$scope.MulData.DataColl = [];
			$scope.MulData.Title = 'Create Multiple Ledger';
			//$scope.MulData.ColColl = [{ id: 1, label: 'Name', name: 'Name' }, { id: 2, label: 'Alias', name: 'Alias' }, { id: 3, label: 'Code', name: 'Code' }, { id: 4, label: 'Salesman Code', name: 'AgentCode' }];
			$scope.MulData.DataColl.push({});
			$('#frmImportMultipleCopy').modal('show');
		}

	}

	$(document).ready(function () {
		$('input.disablecopypaste').bind('paste', function (e) {
			e.preventDefault();
		});
	});

	$scope.PasteData = function (colName, ind) {
		var clipText = event.clipboardData.getData('text/plain');

		if (clipText) {
			var startInd = ind;
			clipText.split("\n").forEach(function (line) {
				if (line && line.length > 0) {

					if ($scope.MulData.DataColl.length < (startInd + 1)) {
						var newObj = angular.copy($scope.MulObj);
						$scope.MulData.DataColl.push(newObj);
					}

					$scope.MulData.DataColl[startInd][colName] = line.trim();
					startInd++;
				}
			});
		}

	}

	$scope.addRowInMD = function (ind) {
		var newObj = angular.copy($scope.MulObj);
		$scope.MulData.DataColl.splice(ind + 1, 0, newObj);
	};
	$scope.delRowInMD = function (ind) {
		$scope.MulData.DataColl.splice(ind, 1);
	};
	$scope.SaveMultipleData = function () {
		if ($scope.MulData) {
			if ($scope.MulData.DataColl) {

				$scope.loadingstatus = "running";
				showPleaseWait();

				$http({
					method: 'POST',
					url: base_url + "Setup/Security/SaveCopyPaste",
					headers: { 'content-Type': undefined },

					transformRequest: function (data) {
						var formData = new FormData();
						formData.append("entityId", EntityId);
						formData.append("jsonData", angular.toJson(data.jsonData));
						return formData;
					},
					data: { jsonData: $scope.MulData.DataColl }
				}).then(function (res1) {

					$scope.loadingstatus = "stop";
					hidePleaseWait();

					if (res1.data.IsSuccess == true && res1.data.Data) {
						$('#frmImportMultipleCopy').modal('hide');
					}
					else {
						Swal.fire(res1.data.ResponseMSG);
					}

				}, function (errormessage) {
					hidePleaseWait();
					$scope.loadingstatus = "stop";
				});


			}
		}
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


	var lastPanVat = '';
	$scope.ValidatePanVat = function (ledgerId, panVatNo) {
		$scope.GenerateCode();

		$scope.loadingstatus = "running";
		showPleaseWait();

		var para = {
			ledgerId: ledgerId,
			panVatNo: panVatNo,
		}
		$http({
			method: 'POST',
			url: base_url + "Account/Creation/IsValidPanVatNo",
			dataType: "json",
			data: JSON.stringify(para)
		}).then(function (res) {
			$scope.loadingstatus = 'stop';
			hidePleaseWait();
			if (res.data.IsSuccess == false) {
				if (res.data.IsSuccess == false) {
					var msg = res.data.ResponseMSG;
					Swal.fire({
						title: msg,
						showCancelButton: true,
						confirmButtonText: 'Yes',
						cancelButtonText: 'No'
					}).then((result) => {
						/* Read more about isConfirmed, isDenied below */
						if (result.isConfirmed == true) {

						} else {
							$timeout(function () {
								$scope.newLedger.StatutoryDetail.PanVatNo = '';
							});
						}
					});
				}
			}
		}, function (reason) {
			alert('Failed' + reason);
		});
	}
	$scope.IsValidPANVat = function (ledgerId, panVatNo) {

		var diffPan = false;
		if (lastPanVat != panVatNo)
			diffPan = true;

		if (((!$scope.newLedger.Name || $scope.newLedger.Name.length == 0) || lastPanVat != panVatNo) && panVatNo.toString().length > 2) {
			lastPanVat = panVatNo;
			$scope.loadingstatus = "running";
			showPleaseWait();

			var para = {
				panNo: panVatNo,
			}
			$http({
				method: 'POST',
				url: base_url + "Global/GetPanDetails",
				dataType: "json",
				data: JSON.stringify(para)
			}).then(function (res) {
				$scope.loadingstatus = 'stop';
				hidePleaseWait();
				var data = res.data.Data;
				if (data && data.panDetails && data.panDetails.length > 0) {
					var panDet = data.panDetails[0];
					$scope.newLedger.Name = panDet.trade_Name_Eng;
					var address = '';
					address = (panDet.vdc_Town ? panDet.vdc_Town : '') + ' ' + (panDet.street_Name ? panDet.street_Name : '') + ' ' + (panDet.ward_No ? ' - ' + panDet.ward_No : '');

					if(panDet.trade_Name_Eng && panDet.trade_Name_Eng.length>0)
						$scope.newLedger.Name = panDet.trade_Name_Eng;
					else
						$scope.newLedger.Name = panDet.trade_Name_Nep;

					$scope.newLedger.Address = address;
					$scope.ValidatePanVat(ledgerId, panVatNo);
				} else {
					$scope.newLedger.Name = '';
					$scope.newLedger.Address = '';
					Swal.fire('Invalid Pan');
				}

			}, function (reason) {
				$scope.loadingstatus = 'stop';
				hidePleaseWait();		
				alert('Failed' + reason);
			});

		} else {
			$scope.ValidatePanVat(ledgerId, panVatNo);
		}
	}

	$scope.AddItemUdf = function (ind) {
		if ($scope.newLedger.UDFColl[ind].Label && $scope.newLedger.UDFColl[ind].Label.length > 0) {
			if ($scope.newLedger.UDFColl.length > ind + 1) {
				$scope.newLedger.UDFColl.splice(ind + 1, 0, {
					ApplicableFromDet: null,
					PrefixCharacters: '',
					ColWidth: 3,
				})
			} else {
				$scope.newLedger.UDFColl.push({
					ApplicableFromDet: null,
					PrefixCharacters: '',
					ColWidth: 3,
				});
			}
		}

	};
	$scope.delItemUdf = function (ind) {
		if ($scope.newLedger.UDFColl) {
			if ($scope.newLedger.UDFColl.length > 1) {
				$scope.newLedger.UDFColl.splice(ind, 1);
			}
		}
	};

	$scope.UpdateAsGlobal = function (refData) {

		Swal.fire({
			title: 'Do you want to update  the selected data ('+refData.Name+') for global use?',
			showCancelButton: true,
			confirmButtonText: 'yes',
		}).then((result) => {
			/* Read more about isConfirmed, isDenied below */
			if (result.isConfirmed) {
				$scope.loadingstatus = "running";
				showPleaseWait();

				var para = {
					LedgerId: refData.LedgerId
				};

				$http({
					method: 'POST',
					url: base_url + "Account/Creation/UpdateAsGlobal",
					dataType: "json",
					data: JSON.stringify(para)
				}).then(function (res) {
					hidePleaseWait();
					$scope.loadingstatus = "stop";
					if (res.data.IsSuccess) {
						$scope.SearchData();
						Swal.fire(res.data.ResponseMSG);
					} else {
						Swal.fire(res.data.ResponseMSG);
					}

				}, function (reason) {
					Swal.fire('Failed' + reason);
				});
			}
		});


	};


	$scope.ChangeCountry = function (contactDet) {

		if (contactDet.Country && contactDet.Country.length > 0) {

			var findC = $scope.CountryColl_Qry.firstOrDefault(p1 => p1.Name == contactDet.Country);
			if (findC) {
				contactDet.CountryId = findC.CountryId;
				contactDet.CountryCode = findC.Code;
			}
		}
		else {
			contactDet.CountryId = null;
			contactDet.CountryCode = '';
		}
	}

});