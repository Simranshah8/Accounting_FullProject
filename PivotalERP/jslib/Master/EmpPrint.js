app.controller('EmpPrintController', function ($scope, $http, $timeout, GlobalServices) {
    $scope.Title = 'Employee Print';

    $scope.LoadData = function () {
        $('.select2').select2();
        //$scope.confirmMSG = GlobalServices.getConfirmMSG();
        //$scope.perPageColl = GlobalServices.getPerPageList();
        $scope.newDet = {
            EmployeeId: 0,
            EmployeeCode: '',
            EnrollNumber: null,
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
            OfficeNum: '',
            PersonalNum: '',
            FatherName: '',
            MotherName: '',
            GFatherName: '',
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
            PDistrictId: null,
            P_LocalLevelId: null,
            PWard: null,
            PCity: '',
            PHouseNum: '',
            PFullAddr: '',
            TCountryId: null,
            TStateId: null,
            TDistrictId: null,
            Temp_LocalLevelId: null,
            TCity: '',
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

            Mode: 'Save'
        };


        if (EmployeeID && EmployeeID) {
            var prt = {
                EmployeeId: EmployeeID
            }
            $scope.getEmployeeById(prt);
        }


        $scope.getCompanyDetail();

    };

    

    $scope.getCompanyDetail = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();
        $scope.CompanyDetail = [];
        $http({
            method: 'get',
            url: base_url + "Payroll/Master/GetCompanyDetail",
            dataType: "json"
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.CompanyDetail = res.data.Data;
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    };



    $scope.getEmployeeById = function (refData) {
        $scope.loadingstatus = "running";
        showPleaseWait();
        var para = {
            EmployeeId: refData.EmployeeId
        };
        $http({
            method: 'POST',
            url: base_url + "Payroll/Master/getEmployeePrintbyId",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.newDet = res.data.Data;


                if ($scope.newDet.DobAD)
                    $scope.newDet.DobAD_TMP = new Date($scope.newDet.DobAD);

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

                $scope.newDet.Mode = 'PRINT';

            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    };


    $scope.Print = function () {
        $('#PrintEmpDetails').printThis();
    }


});