app.controller('UpdateEmployeeController', function ($scope, $http, $timeout, $filter, GlobalServices) {
    $scope.Title = 'Update Employee';

    $scope.LoadData = function () {
        $('.select2').select2();
        $scope.confirmMSG = GlobalServices.getConfirmMSG();
        $scope.perPageColl = GlobalServices.getPerPageList();
        $scope.GenderColl = GlobalServices.getGenderList();

        $scope.currentPages = {
            UpdateEmployee: 1,
        };

        $scope.searchData = {
            UpdateEmployee: '',

        };

        $scope.perPage = {
            UpdateEmployee: GlobalServices.getPerPageRow()
        };

        $scope.paginationOptions = {
            pageNumber: 1,
            pageSize: $scope.perPage.UpdateEmployee,
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


        $scope.newDet = {
            EmployeeCode: '',
            DepartmentId: '',
            DesignationId: '',
            CategoryId: '',
            FirstName: '',
            LastName: '',
            MiddleName: '',
            Gender: '',
            CardNo: 0,
            EnrollNumber: '',
            DOB: '',
            DateOfJoining: '',
            DOBBS_Str: '',
            CompanyRelationshipId: '',
            EMSId: '',
            OfficeContactNo: '',
            OfficeEmailId: '',
            TA_FullAddress: '',
            Nationality: '',
            PanId: '',
            MaritalStatus: '',
            LevelId: '',
            EmployeeGroupId: '',
            TaxRuleAs: '',
            LeaveApplicableDate: '',
            SalaryApplicableYearId: '',
            SalaryApplicableMonthId: '',
            IsAllowOT: '',
            S_FirstLevelId: '',
            S_SecondLevelId: '',
            Mode: 'Save'
        };

        $scope.GetEmployeeForUpdate();

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

        $scope.NationalityList = [];
        $http({
            method: 'Get',
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


            $scope.EmployeeListForUpdate = [];
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
       

        $scope.TaxRuleAsList = [{ id: 1, text: 'NORMAL' }, { id: 2, text: 'SSF' }];
        $scope.MaritalStatusList = [
            { id: 1, text: 'Married' },
            { id: 2, text: 'Unmarried' },
            { id: 3, text: 'Divorced' },
            { id: 4, text: 'Widow' },
        ];
    };


    $scope.ReSearchData = function (pageInd) {
        if (pageInd && pageInd >= 0)
            $scope.paginationOptions.pageNumber = pageInd;
        else if (pageInd == -1)
            $scope.paginationOptions.pageNumber = 1;

        $scope.GetEmployeeForUpdate();

    }

    $scope.GetEmployeeForUpdate = function () {
        $scope.UpdateEmployeeList = [];
        var para = {
            BranchId: $scope.newDet.BranchId || null,
            CompanyRelationshipId: $scope.newDet.CompanyRelationshipId || null,
            PageNumber: $scope.paginationOptions.pageNumber,
            RowsOfPage: $scope.paginationOptions.pageSize,
            SearchBy: $scope.searchData.UpdateEmployee
        };

        $scope.loadingstatus = "running";
        //showPleaseWait();
        $http({
            method: 'POST',
            url: base_url + "HR/Master/GetEmployeeForUpdate",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.UpdateEmployeeList = res.data.Data;
                $scope.paginationOptions.TotalRows = res.data.TotalCount;
                $timeout(function () {
                    angular.forEach($scope.UpdateEmployeeList, function (st) {
                        if (st.DateOfJoining)
                            st.DateOfJoining_TMP = new Date(st.DateOfJoining);
                        if (st.DOB_AD)
                            st.DOB_AD_TMP = new Date(st.DOB_AD);
                        if (st.LeaveApplicableDate)
                            st.LeaveApplicableDate_TMP = new Date(st.LeaveApplicableDate);
                    });
                });
            } else {
                Swal.fire(res.data.ResponseMSG);
            }

        }, function (reason) {
            Swal.fire('Failed' + reason);
        });

    }
   
    $scope.SaveUpdateEmployeeWise = function (employee) {
        if (!employee) {
            Swal.fire('No Employee data provided for update.');
            return;
        }
        Swal.fire({
            title: 'Do you want to update ' + employee.FirstName + ' ' + employee.MiddleName + ' ' + employee.LastName + '\'s record ?',
            showCancelButton: true,
            confirmButtonText: 'Update',
        }).then((result) => {
            if (result.isConfirmed) {
                $scope.loadingstatus = "running";
                showPleaseWait();
              ///*  //*/ Format the Employee Joining Date
                if (employee.DateOfJoiningDet?.dateAD) {
                    employee.DateOfJoining = $filter('date')(new Date(employee.DateOfJoiningDet.dateAD), 'yyyy-MM-dd');
                } else if (employee.DateOfJoining_TMP) {
                    employee.DateOfJoining = $filter('date')(new Date(employee.DateOfJoining_TMP), 'yyyy-MM-dd');
                } else if (employee.DateOfJoining) {
                    employee.DateOfJoining = $filter('date')(new Date(employee.DateOfJoining), 'yyyy-MM-dd');
                } else {
                    employee.DateOfJoining = null;
                }
                if (employee.LeaveApplicableDateDet?.dateAD) {
                    employee.LeaveApplicableDate = $filter('date')(new Date(employee.LeaveApplicableDateDet.dateAD), 'yyyy-MM-dd');
                } else if (employee.LeaveApplicableDateAD_TMP) {
                    employee.LeaveApplicableDate = $filter('date')(new Date(employee.LeaveApplicableDate_TMP), 'yyyy-MM-dd');
                } else if (employee.LeaveApplicableDate) {
                    employee.LeaveApplicableDate = $filter('date')(new Date(employee.LeaveApplicableDate), 'yyyy-MM-dd');
                } else {
                    employee.LeaveApplicableDate = null;
                }
                
                if (employee.DOB_ADDet?.dateAD) {
                    employee.DOB_AD = $filter('date')(new Date(employee.DOB_ADDet.dateAD), 'yyyy-MM-dd');
                } else if (employee.DOB_AD_TMP) {
                    employee.DOB_AD = $filter('date')(new Date(employee.DOB_AD_TMP), 'yyyy-MM-dd');
                } else if (employee.DOB_AD) {
                    employee.DOB_AD = $filter('date')(new Date(employee.DOB_AD), 'yyyy-MM-dd');
                } else {
                    employee.DOB_AD = null;
                }

                //if (employee.DOBBS_StrDet?.dateAD) {
                //    employee.DOBBS_Str = $filter('date')(new Date(employee.DOBBS_StrDet.dateAD), 'yyyy-MM-dd');
                //} else if (employee.DOBAD_TMP) {
                //    employee.DOBBS_Str = $filter('date')(new Date(employee.DOBBS_Str_TMP), 'yyyy-MM-dd');
                //} else if (employee.DOBBS_Str) {
                //    employee.DOBBS_Str = $filter('date')(new Date(employee.DOBBS_Str), 'yyyy-MM-dd');
                //} else {
                //    employee.DOBBS_Str = null;
                //}



                var para = {
                    employeeColl: [employee] // Wrapping the single employee in an array
                };
                $http({
                    method: 'POST',
                    url: base_url + "HR/Master/UpdateEmployeeData",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingstatus = "stop";
                    Swal.fire(res.data.ResponseMSG);
                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }
        });
    };

    $scope.SaveUpdateEmployeeData= function () {
        Swal.fire({
            title: 'Do you want to update selected Employees record?',
            showCancelButton: true,
            confirmButtonText: 'Update',
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                $scope.loadingstatus = "running";
                showPleaseWait();
                angular.forEach($scope.UpdateEmployeeList, function (employee) {
                    if (employee.DateOfJoiningDet)
                        employee.DateOfJoining = $filter('date')(new Date(employee.DateOfJoiningDet.dateAD), 'yyyy-MM-dd');
                    else if (employee.DateOfJoining_TMP)
                        employee.DateOfJoining = $filter('date')(new Date(employee.DateOfJoining_TMP), 'yyyy-MM-dd');
                    else
                        employee.DateOfJoining = null;

                    if (employee.LeaveApplicableDateDet)
                        employee.LeaveApplicableDate = $filter('date')(new Date(employee.LeaveApplicableDateDet.dateAD), 'yyyy-MM-dd');
                    else if (employee.LeaveApplicableDate_TMP)
                        employee.LeaveApplicableDate = $filter('date')(new Date(employee.LeaveApplicableDate_TMP), 'yyyy-MM-dd');
                    else
                        employee.LeaveApplicableDate = null;

                    if (employee.DOB_ADDet)
                        employee.DOB_AD = $filter('date')(new Date(employee.DOB_ADDet.dateAD), 'yyyy-MM-dd');
                    else if (employee.DOB_AD_TMP)
                        employee.DOB_AD = $filter('date')(new Date(employee.DOB_AD_TMP), 'yyyy-MM-dd');
                    else
                        employee.DOB_AD = null;
                });

                var para = {
                    employeeColl: $scope.UpdateEmployeeList
                };
                $http({
                    method: 'POST',
                    url: base_url + "HR/Master/UpdateEmployeeData",
                    dataType: "json",
                    data: angular.toJson(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingstatus = "stop";
                    if (res.data.IsSuccess)
                        Swal.fire('Success', res.data.ResponseMSG, 'success');
                    else
                        Swal.fire('Failed', res.data.ResponseMSG, 'error');
                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }
        });
    };

});




