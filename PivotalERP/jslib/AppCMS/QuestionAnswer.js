app.controller("QAController", function ($scope, $http, GlobalServices, $timeout) {
    $scope.Title = 'Question Answer';

    $scope.LoadData = function () {
        $scope.loadingstatus = "stop";

        $scope.confirmMSG = GlobalServices.getConfirmMSG();
        $scope.perPageColl = GlobalServices.getPerPageList();

        $scope.currentPages = {
            QuestionAnswer: 1
        };

        $scope.searchData = {
            QuestionAnswer: ''
        };

        $scope.perPage = {
            QuestionAnswer: GlobalServices.getPerPageRow()
        };

        $scope.beData =
        {
            TranId: 0,
            Answer: '',
            Mode: 'Save',
        };
        $scope.GetAllProductQA();

    };

    $scope.ClearFields = function () {
        $scope.beData =
        {
            TranId: 0,
            Answer: '',
            Mode: 'Save',
        };
    }

    $scope.GetQuestionAnswerById = function (refData) {
        $scope.loadingstatus = "running";
        showPleaseWait();
        $scope.beData = refData;
        $scope.beData.Mode = 'Modify';
        $('#custom-tabs-four-profile-tab').tab('show');
        hidePleaseWait();
        $scope.loadingstatus = "stop";
    };

    $scope.GetAllProductQA = function () {
        $scope.loadingstatus = "running";
        showPleaseWait();
        $scope.QuestionAnswerList = [];
        $http({
            method: 'POST',
            url: base_url + "AppCMS/Creation/GetProductReviewQA",
            dataType: "json"
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingstatus = "stop";
            if (res.data.IsSuccess && res.data.Data) {
                $scope.QuestionAnswerList = res.data.Data;
            } else {
                Swal.fire(res.data.ResponseMSG);
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    }

    $scope.DelQAnswer = function (refData, ind) {
        Swal.fire({
            title: 'Are you sure you want to delete ' + refData.Question + '?',
            showCancelButton: true,
            confirmButtonText: 'Delete',
        }).then((result) => {
            if (result.isConfirmed) {
                var para = { TranId: refData.TranId };
                $http({
                    method: 'POST',
                    url: base_url + "AppCMS/Creation/DelQAnswer",
                    dataType: "json",
                    data: JSON.stringify(para)
                }).then(function (res) {
                    hidePleaseWait();
                    $scope.loadingStatus = "stop";
                    Swal.fire(res.data.ResponseMSG);
                    if (res.data.IsSuccess == true) {
                        $scope.GetAllProductQA();
                    }
                }, function (reason) {
                    Swal.fire('Failed' + reason);
                });
            }
        });
    }

    $scope.UpdateQAnswer = function (refData) {
        if ($scope.beData.TranId > 0 && $scope.beData.Answer.isEmpty()) {
            Swal.fire("Please ! Enter Answer.");
            return false;
        }
        var para = {
            TranId: refData.TranId,
            Answer: refData.Answer,
        };
        $http({
            method: 'POST',
            url: base_url + "AppCMS/Creation/UpdateQAnswer",
            dataType: "json",
            data: JSON.stringify(para)
        }).then(function (res) {
            hidePleaseWait();
            $scope.loadingStatus = "stop";
            Swal.fire(res.data.ResponseMSG);
            if (res.data.IsSuccess == true) {
                $scope.GetAllProductQA();
                $scope.ClearFields();
                $('#custom-tabs-four-home-tab').tab('show');
            }
        }, function (reason) {
            Swal.fire('Failed' + reason);
        });
    }

});