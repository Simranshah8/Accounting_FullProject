app.controller('EmployeeProfileController', function ($scope, $http, $timeout, $filter, GlobalServices) {
    $scope.Title = 'Employee';

    OnClickDefault();

    $scope.LoadData = function () {
        $('.select2').select2();
        $scope.confirmMSG = GlobalServices.getConfirmMSG();
        $scope.perPageColl = GlobalServices.getPerPageList();
        $scope.currentPages = {
            Employee: 1,
        };

        $scope.searchData = {
            Employee: '',

        };

        $scope.perPage = {
            Employee: GlobalServices.getPerPageRow()
        };

        $scope.paginationOptions = {
            pageNumber: 1,
            pageSize: $scope.perPage.Employee,
            sort: null,
            SearchType: 'text',
            SearchCol: '',
            SearchVal: '',
            SearchColDet: null,
            pagearray: [],
            pageOptions: $scope.perPageColl,
            TotalRows: 0,
        };
        $scope.MonthList = [];
        $scope.MonthList = GlobalServices.getMonthList();

        $scope.AcademicYearColl = [];
        $scope.AcademicYearColl = GlobalServices.getYearList();


        $scope.GenderColl = [
            { id: 1, text: 'Male' },
            { id: 2, text: 'Female' },
            { id: 3, text: 'Others' },
        ]

        $scope.BloodGroupColl = [
            { id: 1, text: 'A+' },
            { id: 2, text: 'A-' },
            { id: 3, text: 'B+' },
            { id: 4, text: 'B-' },
            { id: 5, text: 'O+' },
            { id: 6, text: 'O-' },
            { id: 7, text: 'AB+' },
            { id: 8, text: 'AB-' },
        ]
        //$scope.ReligionColl = [
        //    { id: 1, text: 'Hinduism' },
        //    { id: 2, text: 'Islam' },
        //    { id: 3, text: 'Buddhisim' },
        //    { id: 4, text: 'Christianity' },
        //    { id: 5, text: 'Jainism' },
        //    { id: 6, text: 'Sikhism' },
        //    { id: 7, text: 'Judaism' },
        //]
        $scope.MaritalStatusColl = [
            { id: 1, text: 'Single' },
            { id: 2, text: 'Married' },
            { id: 3, text: 'Widowed' },
            { id: 4, text: 'Separated' },
            { id: 5, text: 'Divorced' }
        ]
        $scope.RelationshipColl = [
            { id: 1, text: 'Husband' },
            { id: 2, text: 'Wife' },
            { id: 3, text: 'Father' },
            { id: 4, text: 'Mother' },
            { id: 5, text: 'Son' },
            { id: 6, text: 'Daughter' },
            { id: 7, text: 'Brother' },
            { id: 8, text: 'Sister' },
            { id: 9, text: 'Grand-Father' },
            { id: 10, text: 'Grand-Mother' },
            { id: 11, text: 'Grand-Son' },
            { id: 12, text: 'Grand-Daughter' },
            { id: 13, text: 'Uncle' },
            { id: 14, text: 'Aunt' },
            { id: 15, text: 'Cousion' },
            { id: 16, text: 'Nephew' },
            { id: 17, text: 'Niece' },
            { id: 18, text: 'Father-in-law' },
            { id: 19, text: 'Mother-in-law' },
            { id: 20, text: 'Brother-in-law' },
            { id: 21, text: 'Sister-in-law' }
        ]
        $scope.IDTypeColl = [
            { id: 1, text: 'Citizenship' },
            { id: 2, text: 'PanId' },
            { id: 3, text: 'Driving License' },
            { id: 4, text: 'PassPort' }
        ]
        $scope.PaymentTypeColl = [
            { id: 1, text: 'Daily' },
            { id: 2, text: 'Weekely' },
            { id: 3, text: 'Monthly' },
            { id: 4, text: 'Quarterly' },
            { id: 5, text: 'Half-Yearly' },
            { id: 6, text: 'Yearly' }
       ]
       $scope.StartMonthColl = [
           { id: 1, text: 'Baisakh' },
           { id: 2, text: 'Jestha' },
           { id: 3, text: 'Ashad' },
           { id: 4, text: 'Shrawan' },
           { id: 5, text: 'Bhadra' },
           { id: 6, text: 'Ashoj' },
           { id: 7, text: 'Kartik' },
           { id: 8, text: 'Mangsir' },
           { id: 9, text: 'Poush' },
           { id: 10, text: 'Magh' },
           { id: 11, text: 'Falgun' },
           { id: 12, text: 'Chaitra' }
       ]
        $scope.InsuranceTypeColl = [
            { id: 1, text: 'GPA' },
            { id: 2, text: 'Medical Insurance' },
            { id: 3, text: 'Covid-19 Insurance' }
       ]
        $scope.CountryColl = [
            { id: 1, text: 'Nepal' },
            { id: 2, text: 'India' }
       ]
       $scope.TaxRullColl = [
        { id: 1, text: 'NORMAL' },
        { id: 2, text: 'SSF' }
        ]
        //nationality db Data
        $scope.NationalityList = [];
        $http({
            method: 'GET',
            url: base_url + "HR/Master/GetAllNationality",
            dataType: "json"
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.NationalityList = res.data.Data;
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        //designation
        $scope.DesignationList = [];
        $http({
            method: 'GET',
            url: base_url + "HR/Master/GetAllDesignation",
            dataType: "json"
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.DesignationList = res.data.Data;
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });


        //CategoryList
        $scope.CategoryList = [];
        $http({
            method: 'GET',
            url: base_url + "HR/Master/GetAllCategory",
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
        //level
        $scope.LevelList = [];
        $http({
            method: 'GET',
            url: base_url + "HR/Master/GetAllLevel",
            dataType: "json"
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.LevelList = res.data.Data;
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        //ServiceType

        $scope.ServiceTypeList = [];
        $http({
            method: 'GET',
            url: base_url + "HR/Master/GetAllServiceType",
            dataType: "json"
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.ServiceTypeList = res.data.Data;
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        $scope.DisabilitiesList = [];
        $http({
            method: 'GET',
            url: base_url + "HR/Master/GetAllDisabilities",
            dataType: "json"
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.DisabilitiesList = res.data.Data;
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        //for Supervisor
        $scope.EmployeeList = [];
        $http({
            method: 'GET',
            url: base_url + "HR/Master/GetAllEmployee",
            dataType: "json"
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.EmployeeList = res.data.Data;
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        //for document
        $scope.DocumentList = [];
        $http({
            method: 'GET',
            url: base_url + "HR/Master/GetAllDocument",
            dataType: "json"
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.DocumentList = res.data.Data;
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });


        //for department
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

        //for RemoteArea
        $scope.AreaList = [];
        $http({
            method: 'GET',
            url: base_url + "HR/Master/GetAllArea",
            dataType: "json"
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.AreaList = res.data.Data;
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });


        // for Bank
        $scope.BankList = [];
        $http({
            method: 'GET',
            url: base_url + "HR/Master/GetAllBank",
            dataType: "json"
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.BankList = res.data.Data;
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        // for Company
        $scope.CompanyList = [];
        $http({
            method: 'GET',
            url: base_url + "HR/Master/GetAllCompanyList",
            dataType: "json"
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.CompanyList = res.data.Data;
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
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

        // for CostCenter
        $scope.CostCenterList = [];
        $http({
            method: 'GET',
            url: base_url + "HR/Master/GetAllCostCenter",
            dataType: "json"
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.CostCenterList = res.data.Data;
            } else {
                Swal.fire(res.data.ResponseMSG);
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
        
        //COde from 3rd Sep
        $scope.ProductBrandList = [];
        $http({
            method: 'GET',
            url: base_url + "Inventory/Creation/GetAllProductBrand",
            dataType: "json"
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.ProductBrandList = res.data.Data;
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        $scope.SubBranchList = [];
        $http({
            method: 'GET',
            url: base_url + "Setup/Security/GetAllSubBranch",
            dataType: "json"
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.SubBranchList = res.data.Data;
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
        
        $scope.InsuranceTypeList = [];
        $http({
            method: 'GET',
            url: base_url + "HR/Master/GetAllInsuranceType",
            dataType: "json"
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.InsuranceTypeList = res.data.Data;
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        $scope.EmployeeGroupList = [];
		$http({
			method: 'Get',
			url: base_url + "HR/Master/GetAllEmployeeGroup",
			dataType: "json"
		}).then(function (res) {
			hidePleaseWait();
			$scope.loadingstatus = "stop";
			if (res.data.IsSuccess && res.data.Data) {
				$scope.EmployeeGroupList = res.data.Data;
			} else {
				Swal.fire(res.data.ResponseMSG);
			}
		}, function (reason) {
			Swal.fire('Failed' + reason);
		});



        $scope.ProjectList = [];
        $http({
            method: 'Get',
            url: base_url + "Account/Creation/GetAllProject",
            dataType: "json"
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.ProjectList = res.data.Data;
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        //Add by prashant Chaitra 13
        $scope.EmpConfig = [];
        $scope.RetirementAge = 0;
        $http({
            method: 'POST',
            url: base_url + "HR/SetUp/GetEmployeeConfiguration",
            dataType: "json"
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.EmpConfig = res.data.Data;
                if ($scope.EmpConfig.RetirementAge) {
                    $scope.RetirementAge = parseInt($scope.EmpConfig.RetirementAge);
                }
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        $scope.OTCalculationList = GlobalServices.GetOtCalculation();
      

        $scope.ProvinceColl = GetStateList();
        $scope.DistrictColl = GetDistrictList();
        $scope.VDCColl = GetVDCList();

        $scope.ProvinceColl_Qry = mx($scope.ProvinceColl);
        $scope.DistrictColl_Qry = mx($scope.DistrictColl);
        $scope.VDCColl_Qry = mx($scope.VDCColl);

        $scope.DocView = {
            Photo: '',
            CitiFrontImg: '',
            CitiBackImg: '',
            PfAtt: '',
            SsfAtt: '',
            CitAtt: '',
            GratAtt: '',
            LiAtt: '',
            HiAtt: '',
            AttachmentColl: []
        }

        $scope.newDet = {
            EmployeeId: 0,
            EmployeeCode: '',
            EnrollNumber: 0,
            FirstName: '',
            MiddleName: '',
            LastName: '',
            Photo: '',
            GenderId: null,
            BloodGroupId: null,
            ReligionId: null,
            DobBS: '',
            DobAD: '',
            MaritalStatusId: null,
            NationalityId: null,
            PanId: '',
            CitiNum: '',
            CitiIssueDate_TMP: '',
            CitiIssuePlaceId: null,
            CitiFrontImg: '',
            CitiBackImg: '',
            EmailId: '',
            OfficeNum: null,
            PersonalNum: null,
            FatherName: '',
            MotherName: '',
            GFatherName: '',
            SpouseName: '',
            AnniversaryDate_TMP: '',
            GMotherName: '',
            DrivingLicNum: '',
            LicIssuePlace: '',
            LicIssueDate_TMP: '',
            LicExpiryDate_TMP: '',
            PassportNum: '',
            PassportIssueDate_TMP: '',
            PassportExpiryDate_TMP: '',
            PassportIssuePlace: '',
            IsSameAsPermanentAddress: false,
            PCountryId: null,
            PStateId: null,
            PCity: '',
            PDistrictId: null,
            P_LocalLevelId: null,
            PWard: null,
            PHouseNum: '',
            PFullAddr: '',
            TCountryId: null,
            TStateId: null,
            TDistrictId: null,
            TCity: '',
            Temp_LocalLevelId: null,
            TWard: null,
            THouseNum: '',
            TFullAddr: '',

            ContactPer: '',
            ContactRelation: null,
            ContactAddr: '',
            ContactPhone: '',
            ContactMobile: '',
            CompanyId: null,
            BranchId: null,
            SubBranch: null,
            DepartmentId: null,
            DesignationId: null,
            CategoryId: null,
            ELevelId: null,
            JTitle: '',
            ServiceTypeId: null,
            JoinDate_TMP: '',
            ConfirmDate_TMP: '',
            RetireDate_TMP: '',
            HeadQtr: '',
            TaxRullId: null,
            RemoteAreaId: null,
            DisabilitiesId: null,
            PfAccNum: '',
            PfNominee: '',
            PfRelation: null,
            PfID: null,
            PfIDNum: '',
            PfEntryDate_TMP: '',
            PfIssueOffice: '',
            PfIssuePlace: '',
            PfAtt: '',
            AccessNum: '',
            SsfNum: '',
            CitCode: '',
            CitAccNum: '',
            CitAmt: 0,
            CitNominee: '',
            CitRelation: null,
            CitIdType: null,
            CitIdNum: '',
            CitEntryDate_TMP: '',
            GratCode: '',
            GratAccNum: '',
            GratNominee: '',
            GratRelation: null,
            GratIdType: null,
            GratIdNum: '',
            GratEntryDate_TMP: '',
            GratIssueOffice: '',
            GratIssuePlace: '',
            GratAtt: '',
            LInsuComp: '',
            LPolicyName: '',
            LPolicyNum: '',
            LPolicyAmt: 0,
            LPolicySDate_TMP: '',
            LPolicyLDate_TMP: '',
            LPremiumAmt: 0,
            LPaymentType: null,
            LStartMonth: null,
            LDedSalary: false,
            LRemarks: '',
            LInsuTypeId: null,
            LiAtt: '',
            HInsuComp: '',
            HPolicyName: '',
            HPolicyNum: '',
            HPolicyAmt: 0,
            HPolicySDate_TMP: '',
            HPolicyLDate_TMP: '',
            HPremiumAmt: 0,
            HStartMonth: null,
            HDedSalary: false,
            HRemarks: '',
            HInsuTypeId: null,
            HiAtt: '',
            AccLedger: '',
            CostCenter: null,
            OTLedger: '',
            EFirstLevel: null,
            ESecondLevel: null,
            EThirdLevel: null,
            EmployeeGroupId: null,
            SalaryApplicableYearId: null,
            SalaryApplicableMonthId: null,

            IsAllowOT: false,
            OTCalculation: 2,

            EmpBankAccColl: [],
            

            AcaQualificationColl: [],
            DegreeName: '',
            BoardUni: '',
            PassedYr: '',
            GradePer: '',

            WorkExpColl: [],
            Org: '',
            Department: null,
            JobTitle: '',
            StartDate_TMP: '',
            EndDate_TMP: '',
            Remarks: '',

            AttachmentColl: [],
            DocTypeId: null,
            DocAtt: '',
            Description: '',
            CompanyRelationshipId: null,
            LeaveApplicableDate_TMP:'',
            Mode: 'Save',            
        };
        //$scope.newDet.EmpBankAccColl.push({});
        //$scope.newDet.AcaQualificationColl.push({});
        //$scope.newDet.WorkExpColl.push({});

        $scope.UDFFeildsColl = [];
        var para11 = {
            EntityId: EntityId
        };
        $http({
            method: 'POST',
            url: base_url + "Setup/Security/getUDFByEntitId",
            dataType: "json",
            data: JSON.stringify(para11)
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


        $scope.ReligionColl = [];
        $http({
            method: 'GET',
            url: base_url + "HR/Master/GetAllReligion",
            dataType: "json"
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.ReligionColl = res.data.Data;
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

        $scope.GetAllEmployee();
        $scope.GetEmployeeWithPag();




    };
    //add by prashant chaitra 13

    $scope.updateRetirementDate = function () {
        if ($scope.newDet.DobADDet && $scope.newDet.DobADDet.dateAD && $scope.EmpConfig.RetirementAge > 0) {
            var Dbyear = $scope.newDet.DobADDet.NY;
            var DbMonth = $scope.newDet.DobADDet.NM;
            var DbDay = $scope.newDet.DobADDet.ND;
            var retireDate = (Dbyear + $scope.EmpConfig.RetirementAge + '-' + DbMonth + '-' + DbDay);
            if (retireDate) {
                $scope.newDet.RetireDate_TMP = retireDate;
            }
        }
    };


    $scope.ClearEmpProfile = function () {
     
        $scope.ClearDataOnly();
        $scope.GetAutoEmpNo();
    }

    $scope.ClearDataOnly = function () {
        $scope.ClearEmpPhoto();
        $scope.ClearCitiFront();
        $scope.ClearCitiBack();
        $scope.ClearGrat();
        $scope.ClearCIT();
        $scope.ClearPF();
        $scope.ClearSSF();


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

        $scope.newDet = {
            EmployeeId: 0,
            EmployeeCode: '',
            EnrollNumber: 0,
            FirstName: '',
            MiddleName: '',
            LastName: '',
            Photo: '',
            GenderId: null,
            BloodGroupId: null,
            ReligionId: null,
            DobBS: '',
            DobAD: '',
            MaritalStatusId: null,
            NationalityId: null,
            PanId: '',
            CitiNum: '',
            CitiIssueDate_TMP: '',
            CitiIssuePlaceId: null,
            CitiFrontImg: '',
            CitiBackImg: '',
            EmailId: '',
            OfficeNum: null,
            PersonalNum: null,
            FatherName: '',
            MotherName: '',
            GFatherName: '',
            SpouseName: '',
            AnniversaryDate_TMP: '',
            GMotherName: '',
            DrivingLicNum: '',
            LicIssuePlace: '',
            LicIssueDate_TMP: '',
            LicExpiryDate_TMP: '',
            PassportNum: '',
            PassportIssueDate_TMP: '',
            PassportExpiryDate_TMP: '',
            PassportIssuePlace: '',
            IsSameAsPermanentAddress: false,
            PCountryId: null,
            PStateId: null,
            PCity: '',
            PDistrictId: null,
            P_LocalLevelId: null,
            PWard: null,
            PHouseNum: '',
            PFullAddr: '',
            TCountryId: null,
            TStateId: null,
            TDistrictId: null,
            TCity: '',
            Temp_LocalLevelId: null,
            TWard: null,
            THouseNum: '',
            TFullAddr: '',

            ContactPer: '',
            ContactRelation: null,
            ContactAddr: '',
            ContactPhone: '',
            ContactMobile: '',
            CompanyId: null,
            BranchId: null,
            SubBranch: null,
            DepartmentId: null,
            DesignationId: null,
            CategoryId: null,
            ELevelId: null,
            JTitle: '',
            ServiceTypeId: null,
            JoinDate_TMP: '',
            ConfirmDate_TMP: '',
            RetireDate_TMP: '',
            HeadQtr: '',
            TaxRullId: null,
            RemoteAreaId: null,
            DisabilitiesId: null,
            PfAccNum: '',
            PfNominee: '',
            PfRelation: null,
            PfID: null,
            PfIDNum: '',
            PfEntryDate_TMP: '',
            PfIssueOffice: '',
            PfIssuePlace: '',
            PfAtt: '',
            AccessNum: '',
            SsfNum: '',
            CitCode: '',
            CitAccNum: '',
            CitAmt: 0,
            CitNominee: '',
            CitRelation: null,
            CitIdType: null,
            CitIdNum: '',
            CitEntryDate_TMP: '',
            GratCode: '',
            GratAccNum: '',
            GratNominee: '',
            GratRelation: null,
            GratIdType: null,
            GratIdNum: '',
            GratEntryDate_TMP: '',
            GratIssueOffice: '',
            GratIssuePlace: '',
            GratAtt: '',
            LInsuComp: '',
            LPolicyName: '',
            LPolicyNum: '',
            LPolicyAmt: 0,
            LPolicySDate_TMP: '',
            LPolicyLDate_TMP: '',
            LPremiumAmt: 0,
            LPaymentType: null,
            LStartMonth: null,
            LDedSalary: false,
            LRemarks: '',
            LInsuTypeId: null,
            LiAtt: '',
            HInsuComp: '',
            HPolicyName: '',
            HPolicyNum: '',
            HPolicyAmt: 0,
            HPolicySDate_TMP: '',
            HPolicyLDate_TMP: '',
            HPremiumAmt: 0,
            HStartMonth: null,
            HDedSalary: false,
            HRemarks: '',
            HInsuTypeId: null,
            HiAtt: '',
            AccLedger: '',
            CostCenter: null,
            OTLedger: '',
            EFirstLevel: null,
            ESecondLevel: null,
            EThirdLevel: null,
            EmployeeGroupId: null,
            SalaryApplicableYearId: null,
            SalaryApplicableMonthId: null,

            IsAllowOT: false,
            OTCalculation: 2,

            EmpBankAccColl: [],
            BankNameId: null,
            AccName: '',
            AccNum: '',
            Branch: '',
            ForPayroll: false,

            AcaQualificationColl: [],
            DegreeName: '',
            BoardUni: '',
            PassedYr: '',
            GradePer: '',

            WorkExpColl: [],
            Org: '',
            Department: null,
            JobTitle: '',
            StartDate_TMP: '',
            EndDate_TMP: '',
            Remarks: '',

            AttachmentColl: [],
            DocTypeId: null,
            DocAtt: '',
            Description: '',
            CompanyRelationshipId: null,
            LeaveApplicableDate_TMP: '',
            Mode: 'Save'
        };
        $scope.newDet.EmpBankAccColl.push({});
        $scope.newDet.AcaQualificationColl.push({});
        $scope.newDet.WorkExpColl.push({});
    }

    $scope.ClearEmpPhoto = function () {
        $timeout(function () {
            $scope.$apply(function () {
                $scope.newDet.PhotoData = null;
                $scope.newDet.Photo_TMP = [];
            });

        });
        $('#imgEmp').attr('src', '');
        $('#imgPhoto1').attr('src', '');
    };

    $scope.ClearCitiFront = function () {
        $timeout(function () {
            $scope.$apply(function () {
                $scope.newDet.CitiFrontImgData = null;
                $scope.newDet.CitiFrontImg_Tmp = [];
            });

        });
        $('#imgEmpCitF').attr('src', '');
        $('#imgPhoto2').attr('src', '');
    };

    $scope.ClearCitiBack = function () {
        $timeout(function () {
            $scope.$apply(function () {
                $scope.newDet.CitiBackImgData = null;
                $scope.newDet.CitiBackImg_tmp = [];
            });

        });
        $('#imgEmpCitB').attr('src', '');
        $('#imgPhoto3').attr('src', '');
    };

    $scope.ClearPF = function () {
        $timeout(function () {
            $scope.$apply(function () {
                $scope.newDet.PfAttData = null;
                $scope.newDet.PfAtt_TMP = [];
            });

        });
        $('#imgPhotoPF').attr('src', '');
    };
    $scope.ClearSSF = function () {
        $timeout(function () {
            $scope.$apply(function () {
                $scope.newDet.SsfAttData = null;
                $scope.newDet.SsfAtt_TMP = [];
            });

        });
        $('#imgPhotossf').attr('src', '');
    };
    $scope.ClearCIT = function () {
        $timeout(function () {
            $scope.$apply(function () {
                $scope.newDet.CitAttData = null;
                $scope.newDet.CitAtt_TMP = [];
            });

        });
        $('#imgPhotoCIT').attr('src', '');
    };

    $scope.ClearGrat = function () {
        $timeout(function () {
            $scope.$apply(function () {
                $scope.newDet.GratAttData = null;
                $scope.newDet.GratAtt_TMP = [];
            });

        });
        $('#imgPhotoGrat').attr('src', '');
    };

    //------------------------
    $scope.AddbankDet = function (ind) {
        if ($scope.newDet.EmpBankAccColl) {
            if ($scope.newDet.EmpBankAccColl.length > ind + 1) {
                $scope.newDet.EmpBankAccColl.splice(ind + 1, 0, {
                    BankNameId: null,

                })
            } else {
                $scope.newDet.EmpBankAccColl.push({
                    BankNameId: null,
                })
            }
        }
    }

    $scope.DelBankDet = function (ind) {
        if ($scope.newDet.EmpBankAccColl) {
            if ($scope.newDet.EmpBankAccColl.length > 1) {
                $scope.newDet.EmpBankAccColl.splice(ind, 1);
            }
        }
    };

    $scope.AddQualDet = function (ind) {
        if ($scope.newDet.AcaQualificationColl) {
            if ($scope.newDet.AcaQualificationColl.length > ind + 1) {
                $scope.newDet.AcaQualificationColl.splice(ind + 1, 0, {
                    DegreeName: '',

                })
            } else {
                $scope.newDet.AcaQualificationColl.push({
                    DegreeName: '',
                })
            }
        }
    }

    $scope.DelQualDet = function (ind) {
        if ($scope.newDet.AcaQualificationColl) {
            if ($scope.newDet.AcaQualificationColl.length > 1) {
                $scope.newDet.AcaQualificationColl.splice(ind, 1);
            }
        }
    };

    $scope.AddWorkDet = function (ind) {
        if ($scope.newDet.WorkExpColl) {
            if ($scope.newDet.WorkExpColl.length > ind + 1) {
                $scope.newDet.WorkExpColl.splice(ind + 1, 0, {
                    JobTitle: '',

                })
            } else {
                $scope.newDet.WorkExpColl.push({
                    JobTitle: '',
                })
            }
        }
    }

    $scope.DelWorkDet = function (ind) {
        if ($scope.newDet.WorkExpColl) {
            if ($scope.newDet.WorkExpColl.length > 1) {
                $scope.newDet.WorkExpColl.splice(ind, 1);
            }
        }
    };

    $scope.delAttachmentDoc = function (ind) {
        if ($scope.newDet.AttachmentColl) {
            if ($scope.newDet.AttachmentColl.length > 0) {
                $scope.newDet.AttachmentColl.splice(ind, 1);
            }
        }
    };

    $scope.AddMoreFilesReceived = function (files, docType, des) {
        if (files && docType) {
            if (files != null && docType != null) {
                angular.forEach(files, function (file) {
                    $scope.newDet.AttachmentColl.push({
                        DocumentTypeId: docType.DocumentTypeId,
                        DocumentTypeName: docType.Name,
                        File: file,
                        Name: file.name,
                        Type: file.type,
                        Size: file.size,
                        Description: des,
                        Path: null
                    });
                })
                $scope.docType = null;
                $scope.attachFile = null;
                $scope.docDescription = '';
                document.getElementById('flMoreFiles').value = null;
            }
        }
    };

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


    $scope.ShowEmpPhoto = function (item) {
        // Reset viewImg0 object
        $scope.viewImg0 = {
            Photo: '',
            FileType: null,
            ContentPath: ''
        };

        // Check if the item contains a Photo
        if (item.Photo && item.Photo.length > 0) {
            $scope.viewImg0.Photo = item.Photo;

            // Determine file type based on file extension or content type
            const fileExtension = item.Photo.split('.').pop().toLowerCase();
            if (fileExtension === 'pdf') {
                $scope.viewImg0.FileType = 'pdf';
                document.getElementById('pdfViewer2').src = item.Photo; // Load PDF in iframe
                $('#EmpPhoto1').modal('show'); // Show modal
            } else if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension)) {
                $scope.viewImg0.FileType = 'image';
                $scope.viewImg0.ContentPath = item.Photo; // Set image source
                $('#EmpPhoto1').modal('show'); // Show modal
            } else {
                Swal.fire('Unsupported file format');
            }
        }  else {
            Swal.fire({
                icon: 'warning',
                title: 'No Image Found',
                text: 'The selected item does not have an image or a file available.',
                confirmButtonText: 'OK'
            });
        }
    };


    $scope.ShowDocPdf = function (item) {
        $scope.viewImg1 = {
            ContentPath: '',
            FileType: null
        };

        if (item.DocPath && item.DocPath.length > 0) {
            $scope.viewImg1.ContentPath = item.DocPath;
            $scope.viewImg1.FileType = 'pdf';  // Assuming DocPath is for PDFs
            document.getElementById('pdfViewer1').src = item.DocPath;
            $('#DocView').modal('show');
        } else if (item.PhotoPath && item.PhotoPath.length > 0) {
            $scope.viewImg1.ContentPath = item.PhotoPath;
            $scope.viewImg1.FileType = 'image';  // Assuming PhotoPath is for images
            $('#DocView').modal('show');
        } else if (item.File) {
            var blob = new Blob([item.File], { type: item.File?.type });
            $scope.viewImg1.ContentPath = URL.createObjectURL(blob);
            $scope.viewImg1.FileType = item.File.type.startsWith('image/') ? 'image' : 'pdf';

            if ($scope.viewImg1.FileType === 'pdf') {
                document.getElementById('pdfViewer1').src = $scope.viewImg1.ContentPath;
            }

            $('#DocView').modal('show');
        } else {
            Swal.fire('No Image Found');
        }
    };


    $scope.updateDOB = function () {
        if ($scope.newDet.DobADDet && $scope.newDet.DobADDet.dateBS) {
            var dobAD = $filter('date')(new Date($scope.newDet.DobADDet.dateAD), 'yyyy-MM-dd');  // Convert BS to AD
            $scope.newDet.DobAD_TMP = new Date(dobAD);            
        }
        $scope.updateRetirementDate();
    };


    //Show hide jf for Employee Profile

    
    function OnClickDefault() {
        /*  show or hide Employee Profile*/

        document.getElementById('employee-profile-form').style.display = "none";
        document.getElementById('Doc-View').style.display = "none";

        document.getElementById('add-employee-details').onclick = function () {
            document.getElementById('employee-profile-section').style.display = "none";
            document.getElementById('Doc-View').style.display = "none";
            document.getElementById('employee-profile-form').style.display = "block";
            $scope.GetAutoEmpNo();
        }
        document.getElementById('back-to-employee-list').onclick = function () {
            document.getElementById('employee-profile-form').style.display = "none";
            document.getElementById('Doc-View').style.display = "none";
            document.getElementById('employee-profile-section').style.display = "block";
        }

        //document.getElementById('DocView-details').onclick = function () {
        //    document.getElementById('employee-profile-section').style.display = "none";
        //    document.getElementById('Doc-View').style.display = "block";
        //    document.getElementById('employee-profile-form').style.display = "none";
        //}


        document.getElementById('back-to-list').onclick = function () {
            document.getElementById('employee-profile-form').style.display = "none";
            document.getElementById('Doc-View').style.display = "none";
            document.getElementById('employee-profile-section').style.display = "block";
        }


    };

    $scope.SamePAddress = function () {
        if ($scope.newDet.IsSameAsPermanentAddress == true) {

            $scope.newDet.TCountryId = $scope.newDet.PCountryId;
            $scope.newDet.TStateId = $scope.newDet.PStateId;
            $scope.newDet.TDistrictId = $scope.newDet.PDistrictId;
            $scope.newDet.Temp_LocalLevelId = $scope.newDet.P_LocalLevelId;
            $scope.newDet.TStateName = $scope.newDet.PStateName;
            $scope.newDet.TDistrictName = $scope.newDet.PDistrictName;
            $scope.newDet.Temp_LocalLevelName = $scope.newDet.P_LocalLevelName;
            $scope.newDet.TCity = $scope.newDet.PCity;
            $scope.newDet.TWard = $scope.newDet.PWard;
            $scope.newDet.TStreet = $scope.newDet.PStreet;
            $scope.newDet.THouseNum = $scope.newDet.PHouseNum;
            $scope.newDet.TFullAddr = $scope.newDet.PFullAddr;
        } else {
            $scope.newDet.TCountryId = $scope.newDet.PCountryId;
            $scope.newDet.TStateId = $scope.newDet.PStateId;
            $scope.newDet.TDistrictId = $scope.newDet.PDistrictId;
            $scope.newDet.Temp_LocalLevelId = $scope.newDet.P_LocalLevelId;
            $scope.newDet.TStateName = $scope.newDet.PStateName;
            $scope.newDet.TDistrictName = $scope.newDet.PDistrictName;
            $scope.newDet.Temp_LocalLevelName = $scope.newDet.P_LocalLevelName;
            $scope.newDet.TCity = $scope.newDet.PCity;
            $scope.newDet.TWard = $scope.newDet.PWard;
            $scope.newDet.TStreet = $scope.newDet.PStreet;
            $scope.newDet.THouseNum = $scope.newDet.PHouseNum;
            $scope.newDet.TFullAddr = $scope.newDet.PFullAddr;           
        }
    }


    //save 

    $scope.clearP = function () {
        $scope.newDet.PStateId = null;
        $scope.newDet.PDistrictId = null;
        $scope.newDet.P_LocalLevelId = null;
        $scope.newDet.PCity = '';
        $scope.newDet.PStateName = '';
        $scope.newDet.PDistrictName = '';
        $scope.newDet.P_LocalLevelName = '';
        $scope.newDet.PWard = null;
        $scope.newDet.PStreet = '';
        $scope.newDet.PHouseNum = '';
        $scope.newDet.PFullAddr = '';

    }

    $scope.clearTemp = function () {
        $scope.newDet.TStateId = null;
        $scope.newDet.TDistrictId = null;
        $scope.newDet.TCity = null;
        $scope.newDet.Temp_LocalLevelId = '';
        $scope.newDet.TStateName = '';
        $scope.newDet.TDistrictName = '';
        $scope.newDet.Temp_LocalLevelName = '';
        $scope.newDet.TWard = null;
        $scope.newDet.TStreet = '';
        $scope.newDet.THouseNum = '';
        $scope.newDet.TFullAddr = '';
    }



    $scope.IsValidEEmpCode = function () {
        if (!$scope.newDet.EmployeeCode) {
            Swal.fire('Employee Code Required');
            return false;
        }
        if (!$scope.newDet.JoinDate_TMP) {
            Swal.fire("Please ! Enter Date of Joining");
            return;
        }
        return true;
    }
    $scope.SaveEmployeeProfile = function () {
        if ($scope.IsValidEEmpCode() == true) {
            if ($scope.confirmMSG.Accept == true) {
                var saveModify = $scope.newDet.Mode;
                Swal.fire({
                    title: 'Do you want to ' + saveModify + ' the current data?',
                    showCancelButton: true,
                    confirmButtonText: saveModify,
                }).then((result) => {
                    /* Read more about isConfirmed, isDenied below */
                    if (result.isConfirmed) {
                        $scope.CallSaveUpdateEmpProfile();
                    }
                });
            } else
                $scope.CallSaveUpdateEmpProfile();
        }
    };

    $scope.CallSaveUpdateEmpProfile = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();

        $scope.newDet.CompanyId = $scope.CompanyList[0].CompanyId;

        var photo = $scope.newDet.Photo_TMP;
        var citiFront = $scope.newDet.CitiFrontImg_Tmp;
        var citiBack = $scope.newDet.CitiBackImg_tmp;
        var pfAttach = $scope.newDet.PfAtt_TMP;
        var sfAttach = $scope.newDet.SsfAtt_TMP;
        var citAttach = $scope.newDet.CitAtt_TMP;
        var gratAttach = $scope.newDet.GratAtt_TMP;
        var liAttach = $scope.newDet.LiAtt_TMP;
        var hiAttach = $scope.newDet.HiAtt_TMP;
        var filesColl = $scope.newDet.AttachmentColl;

        if ($scope.newDet.DobADDet) {
            $scope.newDet.DobAD = $filter('date')(new Date($scope.newDet.DobADDet.dateAD), 'yyyy-MM-dd');
        } else
            $scope.newDet.DobAD = null;

        if ($scope.newDet.DobADDet) {
            $scope.newDet.DobBS = $filter('date')(new Date($scope.newDet.DobADDet.dateBS), 'yyyy-MM-dd');
        } else
            $scope.newDet.DobBS = null;

        if ($scope.newDet.AnniversaryDateDet) {
            $scope.newDet.AnniversaryDate = $filter('date')(new Date($scope.newDet.AnniversaryDateDet.dateAD), 'yyyy-MM-dd');
        } else
            $scope.newDet.AnniversaryDate = null;
        
        if ($scope.newDet.CitiIssueDateDet) {
            $scope.newDet.CitiIssueDate = $filter('date')(new Date($scope.newDet.CitiIssueDateDet.dateAD), 'yyyy-MM-dd');
        } else
            $scope.newDet.CitiIssueDate = null;


        if ($scope.newDet.LicIssueDateDet) {
            $scope.newDet.LicIssueDate = $filter('date')(new Date($scope.newDet.LicIssueDateDet.dateAD), 'yyyy-MM-dd');
        } else
            $scope.newDet.LicIssueDate = null;

        if ($scope.newDet.LicExpiryDateDet) {
            $scope.newDet.LicExpiryDate = $filter('date')(new Date($scope.newDet.LicExpiryDateDet.dateAD), 'yyyy-MM-dd');
        } else
            $scope.newDet.LicExpiryDate = null;

        if ($scope.newDet.PassportIssueDateDet) {
            $scope.newDet.PassportIssueDate = $filter('date')(new Date($scope.newDet.PassportIssueDateDet.dateAD), 'yyyy-MM-dd');
        } else
            $scope.newDet.PassportIssueDate = null;

        if ($scope.newDet.PassportExpiryDateDet) {
            $scope.newDet.PassportExpiryDate = $filter('date')(new Date($scope.newDet.PassportExpiryDateDet.dateAD), 'yyyy-MM-dd');
        } else
            $scope.newDet.PassportExpiryDate = null;


        if ($scope.newDet.JoinDateDet) {
            $scope.newDet.JoinDate = $filter('date')(new Date($scope.newDet.JoinDateDet.dateAD), 'yyyy-MM-dd');
        } else
            $scope.newDet.JoinDate = null;


        if ($scope.newDet.ConfirmDateDet) {
            $scope.newDet.ConfirmDate = $filter('date')(new Date($scope.newDet.ConfirmDateDet.dateAD), 'yyyy-MM-dd');
        } else
            $scope.newDet.ConfirmDate = null;

        if ($scope.newDet.PermanentDateDet) {
            $scope.newDet.PermanentDate = $filter('date')(new Date($scope.newDet.PermanentDateDet.dateAD), 'yyyy-MM-dd');
        } else
            $scope.newDet.PermanentDate = null;
            
        if ($scope.newDet.RetireDateDet) {
            $scope.newDet.RetireDate = $filter('date')(new Date($scope.newDet.RetireDateDet.dateAD), 'yyyy-MM-dd');
        } else {
            $scope.newDet.RetireDate = null;
        }

        if ($scope.newDet.IsAllowOT === false) {
            $scope.newDet.OTCalculation = 4;
        }

        if ($scope.newDet.PfEntryDateDet) {
            $scope.newDet.PfEntryDate = $filter('date')(new Date($scope.newDet.PfEntryDateDet.dateAD), 'yyyy-MM-dd');
        } else {
            $scope.newDet.PfEntryDate = null;
        }

        if ($scope.newDet.CitEntryDateDet) {
            $scope.newDet.CitEntryDate = $filter('date')(new Date($scope.newDet.CitEntryDateDet.dateAD), 'yyyy-MM-dd');
        } else {
            $scope.newDet.CitEntryDate = null;
        }

        if ($scope.newDet.GratEntryDateDet) {
            $scope.newDet.GratEntryDate = $filter('date')(new Date($scope.newDet.GratEntryDateDet.dateAD), 'yyyy-MM-dd');
        } else {
            $scope.newDet.GratEntryDate = null;
        }

        if ($scope.newDet.LPolicySDateDet) {
            $scope.newDet.LPolicySDate = $filter('date')(new Date($scope.newDet.LPolicySDateDet.dateAD), 'yyyy-MM-dd');
        } else {
            $scope.newDet.LPolicySDate = null;
        }

        if ($scope.newDet.LPolicyLDateDet) {
            $scope.newDet.LPolicyLDate = $filter('date')(new Date($scope.newDet.LPolicyLDateDet.dateAD), 'yyyy-MM-dd');
        } else {
            $scope.newDet.LPolicyLDate = null;
        }

        if ($scope.newDet.HPolicySDateDet) {
            $scope.newDet.HPolicySDate = $filter('date')(new Date($scope.newDet.HPolicySDateDet.dateAD), 'yyyy-MM-dd');
        } else {
            $scope.newDet.HPolicySDate = null;
        }
        
        if ($scope.newDet.HPolicyLDateDet) {
            $scope.newDet.HPolicyLDate = $filter('date')(new Date($scope.newDet.HPolicyLDateDet.dateAD), 'yyyy-MM-dd');
        } else {
            $scope.newDet.HPolicyLDate = null;
        }

        if ($scope.newDet.LeaveApplicableDateDet) {
            $scope.newDet.LeaveApplicableDate = $filter('date')(new Date($scope.newDet.LeaveApplicableDateDet.dateAD), 'yyyy-MM-dd');
        } else {
            $scope.newDet.LeaveApplicableDate = null;
        }

        if ($scope.newDet.WorkExpColl) {
            $scope.newDet.WorkExpColl.forEach((S) => {
                if (S.StartDateDet)
                    S.StartDate = $filter('date')(new Date(S.StartDateDet.dateAD), 'yyyy-MM-dd');
                if (S.EndDateDet)
                    S.EndDate = $filter('date')(new Date(S.EndDateDet.dateAD), 'yyyy-MM-dd');
            });
        }


        selectData1 = $('#cboDistrictCiti').select2('data');
        if (selectData1 && selectData1.length > 0)
            district1 = selectData1[0].text.trim();
        $scope.newDet.CitiIssuePlace = district1;

        selectData1 = $('#religionName').select2('data');
        if (selectData1 && selectData1.length > 0)
            religion = selectData1[0].text.trim();
        $scope.newDet.Religion = religion;


        if ($scope.newDet.PCountryId == 1) {
            //Province district for Permanent Address
            var selectData1 = $('#cboProvincePer').select2('data');
            if (selectData1 && selectData1.length > 0)
                province1 = selectData1[0].text.trim();

            selectData1 = $('#cboDistrictPer').select2('data');
            if (selectData1 && selectData1.length > 0)
                district1 = selectData1[0].text.trim();


            selectData1 = $('#cboAreaPer').select2('data');
            if (selectData1 && selectData1.length > 0)
                area1 = selectData1[0].text.trim();

            $scope.newDet.PStateName = province1;
            $scope.newDet.PDistrictName = district1;
            $scope.newDet.P_LocalLevelName = area1;
        }

        if ($scope.newDet.TCountryId == 1) {
            //Province district for Temporary Address
            var selectData2 = $('#cboProvinceTmp').select2('data');
            if (selectData2 && selectData2.length > 0)
                province2 = selectData2[0].text.trim();

            selectData2 = $('#cboDistrictTmp').select2('data');
            if (selectData2 && selectData2.length > 0)
                district2 = selectData2[0].text.trim();


            selectData2 = $('#cboAreaTmp').select2('data');
            if (selectData2 && selectData2.length > 0)
                area2 = selectData2[0].text.trim();

            $scope.newDet.TStateName = province2;
            $scope.newDet.TDistrictName = district2;
            $scope.newDet.Temp_LocalLevelName = area2;
        }


        var voucherUDFFields = [];
        var voucherKeyVal = {};
        $scope.newDet.UserDefineFieldsColl = [];
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

                $scope.newDet.UserDefineFieldsColl.push(uVal);
            }

        });
        if (voucherUDFFields.length > 0) {
            $scope.newDet.Attributes = JSON.stringify(voucherUDFFields);
            $scope.newDet.UDFKeyVal = JSON.stringify(voucherKeyVal);
        } else {
            $scope.newDet.Attributes = "";
            $scope.newDet.UDFKeyVal = "";
        }


        $http({
            method: 'POST',
            url: base_url + "HR/Master/SaveEmployee",
            headers: { 'Content-Type': undefined },

            transformRequest: function (data) {

                var formData = new FormData();
                formData.append("jsonData", angular.toJson(data.jsonData));

                if (data.emPhoto && data.emPhoto.length > 0)
                    formData.append("photo", data.emPhoto[0]);

                if (data.emCitiFront && data.emCitiFront.length > 0)
                    formData.append("citiFront", data.emCitiFront[0]);

                if (data.emCitiBack && data.emCitiBack.length > 0)
                    formData.append("citiBack", data.emCitiBack[0]);

                if (data.empfAttach && data.empfAttach.length > 0)
                    formData.append("pfAttach", data.empfAttach[0]);

                if (data.emsfAttach && data.emsfAttach.length > 0)
                    formData.append("sfAttach", data.emsfAttach[0]);

                if (data.emcitAttach && data.emcitAttach.length > 0)
                    formData.append("citAttach", data.emcitAttach[0]);

                if (data.emgratAttach && data.emgratAttach.length > 0)
                    formData.append("gratAttach", data.emgratAttach[0]);

                if (data.emliAttach && data.emliAttach.length > 0)
                    formData.append("liAttach", data.emliAttach[0]);

                if (data.emhiAttach && data.emhiAttach.length > 0)
                    formData.append("hiAttach", data.emhiAttach[0]);
                if (data.files) {
                    for (var i = 0; i < data.files.length; i++) {
                        formData.append("file" + i, data.files[i].File);
                    }
                }
                return formData;
            },
            data: {
                jsonData: $scope.newDet, emPhoto: photo, emCitiFront: citiFront, emCitiBack: citiBack, empfAttach: pfAttach, emsfAttach: sfAttach, emcitAttach: citAttach,
                emgratAttach: gratAttach, emliAttach: liAttach, emhiAttach: hiAttach, files: filesColl
            }
        }).then(function (res) {

            $scope.loadingstatus = "stop";
            	hidePleaseWait();
            Swal.fire(res.data.ResponseMSG);
            if (res.data.IsSuccess == true) {
                $scope.ClearEmpProfile();
                $scope.GetEmployeeWithPag();
                $scope.GetAllEmployee();
            }
        }, function (errormessage) {
            $scope.loadingstatus = "stop";
            Swal.fire(errormessage);
        });
    }


    $scope.GetAllEmployee = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();
        $scope.EmployeeList = [];
        $http({
            method: 'GET',
            url: base_url + "HR/Master/GetAllEmployee",
            dataType: "json"
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.EmployeeList = res.data.Data;
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    }



    $scope.getEmployeeById = function (refData) {
        $scope.loadingstatus = "running";
        showPleaseWait();
        var para = {
            EmployeeId: refData.EmployeeId
        };
        $http({
            method: 'POST',
            url: base_url + "HR/Master/getEmployeeById",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.ClearDataOnly();

                $scope.newDet = res.data.Data;


                if ($scope.newDet.DobAD)
                    $scope.newDet.DobAD_TMP = new Date($scope.newDet.DobAD);

                if ($scope.newDet.AnniversaryDate)
                    $scope.newDet.AnniversaryDate_TMP = new Date($scope.newDet.AnniversaryDate);
                if ($scope.newDet.CitiIssueDate)
                    $scope.newDet.CitiIssueDate_TMP = new Date($scope.newDet.CitiIssueDate);
                if ($scope.newDet.LicIssueDate)
                    $scope.newDet.LicIssueDate_TMP = new Date($scope.newDet.LicIssueDate);
                if ($scope.newDet.LicExpiryDate)
                    $scope.newDet.LicExpiryDate_TMP = new Date($scope.newDet.LicExpiryDate);
                if ($scope.newDet.PassportIssueDate)
                    $scope.newDet.PassportIssueDate_TMP = new Date($scope.newDet.PassportIssueDate);

                if ($scope.newDet.PassportExpiryDate)
                    $scope.newDet.PassportExpiryDate_TMP = new Date($scope.newDet.PassportExpiryDate);
                if ($scope.newDet.JoinDate)
                    $scope.newDet.JoinDate_TMP = new Date($scope.newDet.JoinDate);
                if ($scope.newDet.ConfirmDate)
                    $scope.newDet.ConfirmDate_TMP = new Date($scope.newDet.ConfirmDate);
                if ($scope.newDet.PermanentDate)
                    $scope.newDet.PermanentDate_TMP = new Date($scope.newDet.PermanentDate);
                if ($scope.newDet.RetireDate)
                    $scope.newDet.RetireDate_TMP = new Date($scope.newDet.RetireDate);
                if ($scope.newDet.PfEntryDate)
                    $scope.newDet.PfEntryDate_TMP = new Date($scope.newDet.PfEntryDate);
                if ($scope.newDet.CitEntryDate)
                    $scope.newDet.CitEntryDate_TMP = new Date($scope.newDet.CitEntryDate);
                if ($scope.newDet.GratEntryDate)
                    $scope.newDet.GratEntryDate_TMP = new Date($scope.newDet.GratEntryDate);
                if ($scope.newDet.LPolicySDate)
                    $scope.newDet.LPolicySDate_TMP = new Date($scope.newDet.LPolicySDate);
                if ($scope.newDet.LPolicyLDate)
                    $scope.newDet.LPolicyLDate_TMP = new Date($scope.newDet.LPolicyLDate);
                if ($scope.newDet.HPolicySDate)
                    $scope.newDet.HPolicySDate_TMP = new Date($scope.newDet.HPolicySDate);
                if ($scope.newDet.HPolicyLDate)
                    $scope.newDet.HPolicyLDate_TMP = new Date($scope.newDet.HPolicyLDate);
                if ($scope.newDet.LeaveApplicableDate)
                    $scope.newDet.LeaveApplicableDate_TMP = new Date($scope.newDet.LeaveApplicableDate);

                if ($scope.newDet.WorkExpColl) {
                    $scope.newDet.WorkExpColl.forEach((S) => {
                        if (S.StartDate)
                            S.StartDate_TMP = new Date(S.StartDate);
                        if (S.EndDate)
                            S.EndDate_TMP = new Date(S.EndDate);
                    });
                }

                if (!$scope.newDet.EmpBankAccColl || $scope.newDet.EmpBankAccColl.length == 0) {
                    $scope.newDet.EmpBankAccColl = [];
                    $scope.newDet.EmpBankAccColl.push({});
                }
                if (!$scope.newDet.AcaQualificationColl || $scope.newDet.AcaQualificationColl.length == 0) {
                    $scope.newDet.AcaQualificationColl = [];
                    $scope.newDet.AcaQualificationColl.push({});
                }
                if (!$scope.newDet.WorkExpColl || $scope.newDet.WorkExpColl.length == 0) {
                    $scope.newDet.WorkExpColl = [];
                    $scope.newDet.WorkExpColl.push({});
                }


                angular.forEach($scope.UDFFeildsColl, function (uf) {
                    uf.Value = '';
                    uf.AlterNetValue = '';
                });
                if ($scope.newDet.Attributes && $scope.newDet.Attributes.length > 0) {
                    var udfFieldsColl = mx(JSON.parse($scope.newDet.Attributes));
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

                $scope.newDet.Mode = 'Update';
                document.getElementById('employee-profile-section').style.display = "none";
                document.getElementById('employee-profile-form').style.display = "block";

            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    };



    $scope.DelEmployeeById = function (refData) {
        Swal.fire({
            title: 'Do you want to delete ' + refData.EmployeeCode + '?',
            showCancelButton: true,
            confirmButtonText: 'Delete',
            //message: 'Are you sure to delete selected BaliType :-' + beData.Name,
        }).then((result) => {
            if (result.isConfirmed) {
                var para = {
                    EmployeeId: refData.EmployeeId
                };
                $http({
                    method: 'POST',
                    url: base_url + "HR/Master/DeleteEmployee",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingStatus = "stop";
                    Swal.fire(res.data.ResponseMSG);
                    if (res.data.IsSuccess == true) {
                        $scope.GetEmployeeWithPag();
                        $scope.GetAllEmployee();
                    }
                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }

        });
    }


    
    $scope.getDocViewById = function (refData) {
        $scope.loadingstatus = "running";
        showPleaseWait();
        var para = {
            EmployeeId: refData.EmployeeId
        };
        $http({
            method: 'POST',
            url: base_url + "HR/Master/GetDocViewById",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.ClearEmpProfile();
                $scope.DocView = res.data.Data;

                document.getElementById('employee-profile-section').style.display = "none";
                document.getElementById('employee-profile-form').style.display = "none";
                document.getElementById('Doc-View').style.display = "block";

            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    };


    $scope.previewImage = function (imageSrc) {
        $scope.newDet.Photo = imageSrc;
        $('#imgPhoto1').modal('show');
    };

     //Prashant Code 1st Sep
     $scope.GetAutoEmpNo = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();
        $http({
            method: 'POST',
            url: base_url + "HR/Master/GetAutoEmpNo",
            dataType: "json"

        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                var vDet = res.data.Data;
                $scope.newDet.EmployeeNo = vDet.RId;
                $scope.newDet.EmployeeCode = vDet.ResponseId;
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    }


    $scope.ReSearchData = function (pageInd) {
        if (pageInd && pageInd >= 0)
            $scope.paginationOptions.pageNumber = pageInd;
        else if (pageInd == -1)
            $scope.paginationOptions.pageNumber = 1;

        $scope.GetEmployeeWithPag();

    }


    $scope.GetEmployeeWithPag = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();
        $scope.AllEmployeeList = [];
        var para = {
            PageNumber: $scope.paginationOptions.pageNumber,
            RowsOfPage: $scope.perPage.Employee,
            SearchBy: $scope.searchData.Employee
        };
        $http({
            method: 'POST',
            url: base_url + "HR/Master/GetEmployeeWithPag",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.AllEmployeeList = res.data.Data;
                $scope.paginationOptions.TotalRows = res.data.TotalCount;
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    }

});