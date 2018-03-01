HTTP/1.1 200 OK
Server: nginx
Date: Wed, 07 Feb 2018 09:44:12 GMT
Content-Type: application/javascript
Content-Length: 48941
Connection: keep-alive
Last-Modified: Wed, 11 Oct 2017 09:27:19 GMT
ETag: "59dde3f7-ae12"
Expires: Wed, 07 Feb 2018 09:44:11 GMT
Cache-Control: no-cache
Accept-Ranges: bytes
Leeco: 0.004-SLBMTIzLjEyNS4zNi4zMwo=-ID200185.30.134:8280-200

var overViewEntity = (function () {
    function overViewEntity() { }
    overViewEntity.eCharEntity = {};
    overViewEntity.eCharIAPIDocument = (function () {
        var eCharIAPIDocument = new leCommonAjax.IAPIDocument();
        eCharIAPIDocument.apiUrl = adminBase.reuqestUrl.overview;
        return eCharIAPIDocument;
    })();
    overViewEntity.dataObj = {
        startTime: "",
        endTime:""
    }
    overViewEntity.spaceListPageObj = {
        pageNo: 1,
        pageSize: 10
    };
    overViewEntity.videoSourceTypeDict = {
        '101': '点播',
        '100': '直播',
        '102': '商业发行平台',
        '103': '互动课堂',
        '104': '移动直播',
        '105': '公海系统',
        '106': '体育资料托管',
        '107': '云记者',
        '108': '云导播',
        '109': '直播营销',
        '110': '直播cdn',
        '111': 'cdn文件加速',
        '112': '小文件',
        '113': '内容分发网络',
        '120': '云媒体',
        '130': '存储',
        '140': '点播paas',
        '141': '云转码',
    };
    return overViewEntity;
})()
;var overViewDal = (function () {
    function overViewDal(){ }
    //基本信息
    overViewDal.getData = function (fun) {
        leCommonAjax.ajax(overViewEntity.eCharIAPIDocument, function (data) {
            fun(data);
        }, function () {
        })
    }
    //获取大客户CV
    overViewDal.overviewCv = function (fun) {
        var eCharIAPIDocument = new leCommonAjax.IAPIDocument();
        eCharIAPIDocument.apiUrl = adminBase.reuqestUrl.overviewCv;
        leCommonAjax.ajax(eCharIAPIDocument, function (data) {
            fun(data);
        }, function () {
        })
    }
    //获取流量图表数据
    overViewDal.overviewFlowData = function (fun) {
        var eCharIAPIDocument = new leCommonAjax.IAPIDocument();
        eCharIAPIDocument.apiUrl = adminBase.reuqestUrl.traffic;
        leCommonAjax.ajax(eCharIAPIDocument, function (data) {
            fun(data);
        }, function () {
        }, { data: overViewEntity.dataObj })
    }
    //获取空间图表数据
    overViewDal.overviewSpaceData = function (fun) {
        var eCharIAPIDocument = new leCommonAjax.IAPIDocument();
        eCharIAPIDocument.apiUrl = adminBase.reuqestUrl.spaceData;
        leCommonAjax.ajax(eCharIAPIDocument, function (data) {
            fun(data);
        }, function () {
        },{data:overViewEntity.dataObj})
    }
    //获取转码时长图表数据
    overViewDal.overviewTransData = function (fun) {
        var eCharIAPIDocument = new leCommonAjax.IAPIDocument();
        eCharIAPIDocument.apiUrl = adminBase.reuqestUrl.transcoding;
        leCommonAjax.ajax(eCharIAPIDocument, function (data) {
            fun(data);
        }, function () {
        }, { data: overViewEntity.spaceListPageObj })
    }
    //空间列表
    overViewDal.overviewSpaceListData = function (fun) {
        var eCharIAPIDocument = new leCommonAjax.IAPIDocument();
        eCharIAPIDocument.apiUrl = adminBase.reuqestUrl.videoList;
        leCommonAjax.ajax(eCharIAPIDocument, function (data) {
            fun(data);
        }, function () {
        }, { data: overViewEntity.spaceListPageObj })
    }
    return overViewDal;
})();
;var overViewUi = (function () {
    function overViewUi() {
    }
    var loadingId = leLoading.create("waitLoading");
    overViewUi.init = function () {
        //获取流量图表数据
        overViewUi.flowGetData = function () {
            if (overViewEntity.dataObj.startTime == "" || overViewEntity.dataObj.endTime == "") {
                return;
            }
            overViewDal.overviewFlowData(function (data) {
                data = data.data;
                if (data.value.traffic.length == 0) {
                    $("#flowNodata").removeClass("hide");
                    $("#overview-chart-01").children().hide();
                    return;
                }
                $("#overview-chart-01").children().show();
                $("#flowNodata").addClass("hide");
                //初始化图表
                var chart_overView = echarts.init(document.getElementById('overview-chart-01'));
                var option_overView = {
                    title: {
                        show: false
                    },
                    color: ['#208ac3'],
                    tooltip: {
                        trigger: 'axis'
                    },
                    toolbox: {
                        show: false,
                        feature: {
                            mark: { show: true },
                            dataView: { show: true, readOnly: false },
                            magicType: { show: true, type: ['line', 'bar', 'stack', 'tiled'] },
                            restore: { show: true },
                            saveAsImage: { show: true }
                        }
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '0%',
                        x: 65,
                        y: 20,
                        x2: 30,
                        y2: 80,
                        height: '100px',
                        containLabel: false,
                        borderWidth: 0,
                        show: false
                    },
                    calculable: true,
                    xAxis: [
                        {
                            type: 'category',
                            boundaryGap: false,
                            data: data.date,
                            splitLine: {
                                show: true,
                                lineStyle: { type: 'dashed', color: '#f0eff4' }
                            }
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value',
                            axisLabel: {
                                formatter: '{value} MB'
                            },
                            splitLine: {
                                show: true,
                                lineStyle: { type: 'dashed', color: '#f0eff4' }
                            }
                        }
                    ],
                    series: [
                        {
                            name: '流量',
                            type: 'line',
                            stack: '总量',
                            smooth: true,
                            //symbol: 'none',  //这句就是去掉点的
                            calculable: false,  //点禁止拖动
                            itemStyle: {
                                normal: {
                                    areaStyle: { color: '#e8f3f9' },
                                    lineStyle: { color: '#208ac3' }
                                }
                            },
                            data: data.value.traffic
                        }
                    ]
                };
                chart_overView.setOption(option_overView);
            })
        }
        //获取空间图表数据
        overViewUi.spaceGetData = function () {
            if (overViewEntity.dataObj.startTime == "" || overViewEntity.dataObj.endTime == "") {
                return;
            }
            overViewDal.overviewSpaceData(function (data) {
                data = data.data;
                if (data.value.space.length == 0) {
                    $("#spaceNodata").removeClass("hide");
                    $("#overview-chart-02").children().hide();
                    return;
                }
                $("#spaceNodata").addClass("hide");
                $("#overview-chart-02").children().show();
                var option_overView = {
                    title: {
                        show: false
                    },
                    color: ['#208ac3'],
                    tooltip: {
                        trigger: 'axis'
                    },
                    toolbox: {
                        show: false,
                        feature: {
                            mark: { show: true },
                            dataView: { show: true, readOnly: false },
                            magicType: { show: true, type: ['line', 'bar', 'stack', 'tiled'] },
                            restore: { show: true },
                            saveAsImage: { show: true }
                        }
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '0%',
                        x: 65,
                        y: 20,
                        x2: 30,
                        y2: 80,
                        height: '100px',
                        containLabel: false,
                        borderWidth: 0,
                        show: false
                    },
                    calculable: true,
                    xAxis: [
                        {
                            type: 'category',
                            boundaryGap: false,
                            data: data.date,
                            splitLine: {
                                show: true,
                                lineStyle: { type: 'dashed', color: '#f0eff4' }
                            }
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value',
                            axisLabel: {
                                formatter: '{value} MB'
                            },
                            splitLine: {
                                show: true,
                                lineStyle: { type: 'dashed', color: '#f0eff4' }
                            }
                        }
                    ],
                    series: [
                        {
                            name: '空间',
                            type: 'line',
                            stack: '总量',
                            smooth: true,
                            // symbol: 'none',  //这句就是去掉点的
                            calculable: false,  //点禁止拖动
                            itemStyle: {
                                normal: {
                                    areaStyle: { color: '#e8f3f9' },
                                    lineStyle: { color: '#208ac3' }
                                }
                            },
                            data: data.value.space
                        }
                    ]
                };
                var chart_overView_space = echarts.init(document.getElementById('overview-chart-02'));
                chart_overView_space.setOption(option_overView);
            })
        }
        //获取空间列表数据
        overViewUi.spaceListGetData = function () {
            if (overViewEntity.dataObj.startTime == "" || overViewEntity.dataObj.endTime == "") {
                return;
            }
            overViewDal.overviewSpaceListData(function (data) {
                data = data.data;
                if (data.list.length == 0) {
                    $("#divSpaceList .noData").removeClass("hide");
                    $("#videoSpaceList").hide();
                    return;
                }
                $("#divSpaceList .noData").addClass("hide");
                $("#videoSpaceList").show();
                var html = '';
                for (var i = 0, leng = data.list.length; i < leng; i++) {
                    var sourceType = overViewEntity.videoSourceTypeDict[data.list[i].sourceType] || '未知';
                    html += '<tr>'+
                                '<td>'+
                                    '<div>{0}</div>'.replace('{0}',data.list[i].videoName)+
                                    '<div>视频ID：{0}</div>'.replace('{0}',data.list[i].videoId)+
                                    '<div>视频VU：{0}</div>'.replace('{0}',data.list[i].videoUnique)+
                                '</td>'+
                                '<td>{0}</td>'.replace('{0}',data.list[i].hInitialSize)+
                                '<td>{0}</td>'.replace('{0}',data.list[i].addTime)+
                                '<td>{0}</td>'.replace('{0}',sourceType)+
                            '</tr>';
                }
                $("#videoSpaceList").html(html);

                lePage.structurePage({
                    parentId: "spaceListLePage",
                    currentPage: overViewEntity.spaceListPageObj.pageNo,//当前显示的页数
                    countRowNum: data.count,//数据总条数
                    pageRowNum: overViewEntity.spaceListPageObj.pageSize,//每页显示多少行
                    callback: function (currentPage) {
                        overViewEntity.spaceListPageObj.pageNo = currentPage;
                        overViewUi.spaceListGetData();
                    }
                });
            })
        }
        //获取转码时长图表数据
        overViewUi.transGetData = function () {
            if (overViewEntity.dataObj.startTime == "" || overViewEntity.dataObj.endTime == "") {
                return;
            }
            overViewDal.overviewTransData(function (data) {
                data = data.data;
                var P720 = [];
                var P1080 = [];
                var high = [];
                var smooth = [];
                var superData = [];
                if (!$.isEmptyObject(data.value)) {
                    if (data.value["720P"])
                    {
                        P720 = data.value["720P"];
                    }
                    if (data.value["1080P"]) {
                        P1080 = data.value["1080P"];
                    }
                    if (data.value.high) {
                        high = data.value.high;
                    }
                    if (data.value.smooth) {
                        smooth = data.value.smooth;
                    }
                    if (data.value.super) {
                        superData = data.value.super;
                    }
                } else {
                    $("#transNodata").removeClass("hide");
                    $("#overview-chart-03").children().hide();
                    return;
                }
                $("#transNodata").addClass("hide");
                $("#overview-chart-03").children().show();
                var option = {
                    title: {
                        text: '堆叠区域图',
                        show: false
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    color: ['#2089c3', '#a1c53d', '#e0dbf6', '#f1912b', '#46b8c2'],
                    legend: {
                        data: ['1080P', '720P', '超清', '高清', '流畅'],
                        padding: [
                            320,  // 上
                            0, // 右
                            0,  // 下
                            0, // 左
                        ],
                    },
                    toolbox: {
                        feature: {
                            saveAsImage: {}
                        }
                    },
                    grid: {
                        containLabel: false,
                        borderWidth: 0,
                        show: false,
                        x: 65,
                        y: 20,
                        x2: 30,
                        y2: 80,
                        height: '100px'
                    },
                    xAxis: [
                        {
                            type: 'category',
                            boundaryGap: false,
                            data: data.date,
                            splitLine: {
                                show: true,
                                lineStyle: { type: 'dashed', color: '#f0eff4' }
                            }
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value',
                            axisLabel: {
                                formatter: '{value} Min'
                            },
                            splitLine: {
                                show: true,
                                lineStyle: { type: 'dashed', color: '#f0eff4' }
                            }
                        }
                    ],
                    series: [
                        {
                            name: '1080P',
                            type: 'line',
                            stack: '总量',
                            areaStyle: { normal: {} },
                            data: P1080,
                            itemStyle: {
                                normal: {
                                    areaStyle: { color: '#e8f3f9' },
                                    lineStyle: { color: '#2089c3' }
                                }
                            },
                            symbol: "circle",
                            // symbol: 'none',  //这句就是去掉点的
                            calculable: false,  //点禁止拖动
                            smooth: true,  //这句就是让曲线变平滑的
                        },
                        {
                            name: '720P',
                            type: 'line',
                            stack: '总量',
                            areaStyle: { normal: {} },
                            data: P720,
                            itemStyle: {
                                normal: {
                                    areaStyle: { color: '#d8e8cd' },
                                    lineStyle: { color: '#a1c53d' }
                                }
                            },
                            symbol: "circle",
                            // symbol: 'none',  //这句就是去掉点的
                            calculable: false,  //点禁止拖动
                            smooth: true,  //这句就是让曲线变平滑的
                        },
                        {
                            name: '超清',
                            type: 'line',
                            stack: '总量',
                            areaStyle: { normal: {} },
                            data: superData,
                            itemStyle: {
                                normal: {
                                    areaStyle: { color: '#e0dbf6' },
                                    lineStyle: { color: '#9689ce' }
                                }
                            },
                            symbol: "circle",
                            // symbol: 'none',  //这句就是去掉点的
                            calculable: false,  //点禁止拖动
                            smooth: true,  //这句就是让曲线变平滑的
                        },
                        {
                            name: '高清',
                            type: 'line',
                            stack: '总量',
                            areaStyle: { normal: {} },
                            data:high,
                            itemStyle: {
                                normal: {
                                    areaStyle: { color: '#e0dbf6' },
                                    lineStyle: { color: '#9689ce' }
                                }
                            },
                            symbol: "circle",
                            // symbol: 'none',  //这句就是去掉点的
                            calculable: false,  //点禁止拖动
                            smooth: true,  //这句就是让曲线变平滑的
                        },
                        {
                            name: '流畅',
                            type: 'line',
                            stack: '总量',
                            areaStyle: { normal: {} },
                            data: smooth,
                            itemStyle: {
                                normal: {
                                    areaStyle: { color: '#e0dbf6' },
                                    lineStyle: { color: '#9689ce' }
                                }
                            },
                            symbol: "circle",
                            // symbol: 'none',  //这句就是去掉点的
                            calculable: false,  //点禁止拖动
                            smooth: true,  //这句就是让曲线变平滑的
                        }
                    ]
                };
                var chart_overView_transcoding = echarts.init(document.getElementById('overview-chart-03'));
                chart_overView_transcoding.setOption(option);
            })
        }
        //切换时间
        $(".time-charge a").on("click", function () {
            var thisObj = $(this);
            $(thisObj).siblings().removeClass("active");
            $(thisObj).addClass("active");
            var type = $(thisObj).parents(".time-charge").attr("dataType");
            var index = $(thisObj).index();
            if (index == 0) {
                overViewEntity.dataObj.startTime = leToolFunction.getBeforeDate(6);
                overViewEntity.dataObj.endTime = leToolFunction.getNowTime();
                if (type == "flow") {
                    $("#dateFlowBegin,#dateFlowEnd").removeClass("error");
                    $("#flowDateError").hide();
                    overViewUi.flowGetData();
                } else if (type == "space") {
                    $("#dataSpaceBegin,#dateSpaceEnd").removeClass("error");
                    $("#spaceDateError").hide();
                    overViewUi.spaceGetData();
                } else if (type == "trans") {
                    $("#dateTranscodingBegin,#dateTranscodingEnd").removeClass("error");
                    $("#transDateError").hide();
                    overViewUi.transGetData();
                }
            } else if (index == 1) {
                overViewEntity.dataObj.startTime = leToolFunction.getBeforeDate(29);
                overViewEntity.dataObj.endTime = leToolFunction.getNowTime();
                if (type == "flow") {
                    $("#dateFlowBegin,#dateFlowEnd").removeClass("error");
                    $("#flowDateError").hide();
                    overViewUi.flowGetData();
                } else if (type == "space") {
                    $("#dataSpaceBegin,#dateSpaceEnd").removeClass("error");
                    $("#spaceDateError").hide();
                    overViewUi.spaceGetData();
                } else if (type == "trans") {
                    $("#dateTranscodingBegin,#dateTranscodingEnd").removeClass("error");
                    $("#transDateError").hide();
                    overViewUi.transGetData();
                }
            }
        });
        $('#linkSpaceChart').on('click',function(e){
          $('#overview-chart-02').show();
          $('#divSpaceList').hide();
        });
        $('#linkSpaceTable').on('click',function(e){
          $('#overview-chart-02').hide();
          $('#divSpaceList').show();
          overViewUi.spaceListGetData();
        });
        //获取页面信息
        overViewDal.getData(function (dataObj) {
            dataObj = dataObj.data;
            var userType = dataObj.userType;
            //1:大客户 2:自主化客户
            if (userType == 1) {
                $("#dkhContent").show();
                var enable = dataObj.vipOverview.enable;
                var useSpace = dataObj.vipOverview.useSpace;
                var uu = dataObj.vipOverview.uu;
                var userKey = dataObj.vipOverview.userKey;
                var videoCount = dataObj.vipOverview.videoCount;
                var publishedVideoCount = dataObj.vipOverview.publishedVideoCount;
                var checkWaitVideoCount = dataObj.vipOverview.checkWaitVideoCount;
                if (enable) {
                    enable = "正常";
                } else {
                    enable = "停用";
                }
                $("#dkhServiceState").text(enable);
                $("#dkhSpaceAlready").text(useSpace);
                $("#dkhUu").text(uu);
                $("#dkhKey").text(userKey);
                $("#dkhVideoCount").text(videoCount);
                $("#dkhReleaseVideo").text(publishedVideoCount);
                $("#dkhPendingVideo").text(checkWaitVideoCount);
                overViewDal.overviewCv(function (data) {
                    data = data.data;
                    var chart_overView = echarts.init(document.getElementById('overview-chart-dkh'));
                    var option_overView = {
                        title: {
                            show: false
                        },
                        color: ['#208ac3'],
                        tooltip: {
                            trigger: 'axis'
                        },
                        toolbox: {
                            show: false,
                            feature: {
                                mark: { show: true },
                                dataView: { show: true, readOnly: false },
                                magicType: { show: true, type: ['line', 'bar', 'stack', 'tiled'] },
                                restore: { show: true },
                                saveAsImage: { show: true }
                            }
                        },
                        grid: {
                            left: '3%',
                            right: '4%',
                            bottom: '0%',
                            x: 65,
                            y: 20,
                            x2: 30,
                            y2: 80,
                            height: '100px',
                            containLabel: false,
                            borderWidth: 0,
                            show: false
                        },
                        calculable: true,
                        xAxis: [
                            {
                                type: 'category',
                                boundaryGap: false,
                                data: data.category,
                                splitLine: {
                                    show: true,
                                    lineStyle: { type: 'dashed', color: '#f0eff4' }
                                }
                            }
                        ],
                        yAxis: [
                            {
                                type: 'value',
                                axisLabel: {
                                    formatter: '{value} CV'
                                },
                                splitLine: {
                                    show: true,
                                    lineStyle: { type: 'dashed', color: '#f0eff4' }
                                }
                            }
                        ],
                        series: [
                            {
                                name: '流量',
                                type: 'line',
                                stack: '总量',
                                smooth: true,
                                //symbol: 'none',  //这句就是去掉点的
                                itemStyle: {
                                    normal: {
                                        areaStyle: { color: '#e8f3f9' },
                                        lineStyle: { color: '#208ac3' }
                                    }
                                },
                                data: data.series[0].data
                            }
                        ]
                    };
                    chart_overView.setOption(option_overView);
                })
            } else if (userType == 2) {
                $("#zzhContent").show();
                //初始化tab
                $("#flow-label").myTab({ parent: "#flow-con", method: 0 });
                //初始化日历控件
                //流量
                var dateFlowBegin = {
                    elem: '#dateFlowBegin',
                    format: 'YYYY-MM-DD',
                    istime: true,
                    istoday: false,
                    max: laydate.now(0),
                    choose: function (datas) {
                        dateFlowEnd.min = datas; //开始日选好后，重置结束日的最小日期
                        dateFlowEnd.start = datas; //将结束日的初始值设定为开始日
                        overViewEntity.dataObj.startTime = datas;
                        var otherTime = $("#dateFlowEnd").val();
                        if (otherTime != "")
                        {
                            var startDate= new Date(datas);
                            var endDate = new Date(otherTime);
                            var diffDate = parseInt(Math.abs(startDate - endDate) / 1000 / 60 / 60 / 24)+1;
                            if (diffDate > 31)
                            {
                                $("#dateFlowBegin,#dateFlowEnd").addClass("error");
                                $("#flowDateError").show();
                                return;
                            }
                            $("#dateFlowBegin,#dateFlowEnd").removeClass("error");
                            $("#flowDateError").hide();
                            $("div[datatype='flow']").find(".active").removeClass("active");
                            overViewUi.flowGetData(); //查询图表数据
                        }
                    }
                };
                var dateFlowEnd = {
                    elem: '#dateFlowEnd',
                    format: 'YYYY-MM-DD',
                    istime: true,
                    istoday: false,
                    max: laydate.now(0),
                    choose: function (datas) {
                        dateFlowBegin.max = datas; //结束日选好后，重置开始日的最大日期
                        overViewEntity.dataObj.endTime = datas;
                        var otherTime=$("#dateFlowBegin").val();
                        if (otherTime != "") {
                            var startDate = new Date(datas);
                            var endDate = new Date(otherTime);
                            var diffDate = parseInt(Math.abs(startDate - endDate) / 1000 / 60 / 60 / 24) + 1;
                            if (diffDate > 31) {
                                $("#dateFlowBegin,#dateFlowEnd").addClass("error");
                                $("#flowDateError").show();
                                return;
                            }
                            $("#dateFlowBegin,#dateFlowEnd").removeClass("error");
                            $("#flowDateError").hide();
                            $("div[datatype='flow']").find(".active").removeClass("active");
                            overViewUi.flowGetData(); //查询图表数据
                        }
                    }
                };
                //空间
                var dataSpaceBegin = {
                    elem: '#dataSpaceBegin',
                    format: 'YYYY-MM-DD',
                    istime: true,
                    istoday: false,
                    max: laydate.now(0),
                    choose: function (datas) {
                        dataSpaceEnd.min = datas; //开始日选好后，重置结束日的最小日期
                        dataSpaceEnd.start = datas //将结束日的初始值设定为开始日
                        overViewEntity.dataObj.startTime = datas;
                        var otherTime = $("#dateSpaceEnd").val();
                        if (otherTime != "") {
                            var startDate = new Date(datas);
                            var endDate = new Date(otherTime);
                            var diffDate = parseInt(Math.abs(startDate - endDate) / 1000 / 60 / 60 / 24) + 1;
                            if (diffDate > 31) {
                                $("#dataSpaceBegin,#dateSpaceEnd").addClass("error");
                                $("#spaceDateError").show();
                                return;
                            }
                            $("#dataSpaceBegin,#dateSpaceEnd").removeClass("error");
                            $("#spaceDateError").hide();
                            $("div[datatype='space']").find(".active").removeClass("active");
                            overViewUi.spaceGetData(); //查询图表数据
                        }
                    }
                };
                var dataSpaceEnd = {
                    elem: '#dateSpaceEnd',
                    format: 'YYYY-MM-DD',
                    istime: true,
                    istoday: false,
                    max: laydate.now(0),
                    choose: function (datas) {
                        dataSpaceBegin.max = datas; //结束日选好后，重置开始日的最大日期
                        overViewEntity.dataObj.endTime = datas;
                        var otherTime = $("#dataSpaceBegin").val();
                        if (otherTime != "") {
                            var startDate = new Date(datas);
                            var endDate = new Date(otherTime);
                            var diffDate = parseInt(Math.abs(startDate - endDate) / 1000 / 60 / 60 / 24) + 1;
                            if (diffDate > 31) {
                                $("#dataSpaceBegin,#dateSpaceEnd").addClass("error");
                                $("#spaceDateError").show();
                                return;
                            }
                            $("#dataSpaceBegin,#dateSpaceEnd").removeClass("error");
                            $("#spaceDateError").hide();
                            $("div[datatype='space']").find(".active").removeClass("active");
                            overViewUi.spaceGetData(); //查询图表数据
                        }
                    }
                };
                //转码时长
                var dateTranscodingBegin = {
                    elem: '#dateTranscodingBegin',
                    format: 'YYYY-MM-DD',
                    istime: true,
                    istoday: false,
                    max: laydate.now(0),
                    choose: function (datas) {
                        dateTranscodingEnd.min = datas; //开始日选好后，重置结束日的最小日期
                        dateTranscodingEnd.start = datas; //将结束日的初始值设定为开始日
                        overViewEntity.dataObj.startTime = datas;
                        var otherTime=$("#dateTranscodingEnd").val();
                        if (otherTime != "") {
                            var startDate = new Date(datas);
                            var endDate = new Date(otherTime);
                            var diffDate = parseInt(Math.abs(startDate - endDate) / 1000 / 60 / 60 / 24) + 1;
                            if (diffDate > 31) {
                                $("#dateTranscodingBegin,#dateTranscodingEnd").addClass("error");
                                $("#transDateError").show();
                                return;
                            }
                            $("#dateTranscodingBegin,#dateTranscodingEnd").removeClass("error");
                            $("#transDateError").hide();
                            $("div[datatype='trans']").find(".active").removeClass("active");
                            overViewUi.transGetData(); //查询图表数据
                        }
                    }
                };
                var dateTranscodingEnd = {
                    elem: '#dateTranscodingEnd',
                    format: 'YYYY-MM-DD',
                    istime: true,
                    istoday: false,
                    max: laydate.now(0),
                    choose: function (datas) {
                        dateTranscodingBegin.max = datas; //结束日选好后，重置开始日的最大日期
                        overViewEntity.dataObj.endTime = datas;
                        var otherTime=$("#dateTranscodingBegin").val();
                        if (otherTime != "") {
                            var startDate = new Date(datas);
                            var endDate = new Date(otherTime);
                            var diffDate = parseInt(Math.abs(startDate - endDate) / 1000 / 60 / 60 / 24) + 1;
                            if (diffDate > 31) {
                                $("#dateTranscodingBegin,#dateTranscodingEnd").addClass("error");
                                $("#transDateError").show();
                                return;
                            }
                            $("#dateTranscodingBegin,#dateTranscodingEnd").removeClass("error");
                            $("#transDateError").hide();
                            $("div[datatype='trans']").find(".active").removeClass("active");
                            overViewUi.transGetData(); //查询图表数据
                        }
                    }
                };
                laydate(dateFlowBegin);
                laydate(dateFlowEnd);
                laydate(dataSpaceBegin);
                laydate(dataSpaceEnd);
                laydate(dateTranscodingBegin);
                laydate(dateTranscodingEnd);
                //服务状态
                var status = dataObj.selfServiceOverview.enabled;
                var statusText = "正常";
                if (!status) {
                    statusText = "停用";
                    $("#serviceStop").show();
                    $("#linkCz").hide();
                }
                $("#serviceState").text(statusText);
                //套餐类型
                var moduleName = dataObj.selfServiceOverview.moduleName;
                $("#package").text(moduleName);
                //是否允许升级套餐
                var isUpPackge = dataObj.selfServiceOverview.upgradeStatus;
                if (isUpPackge) {
                    $("#upPackgeContent").html('<a target="_blank" href="http://uc.lecloud.com/Determination/upGradeVodPricePackageView.do" class="color-208ac3">升级套餐 &gt;&gt;</a>');
                } else {
                    $("#upPackgeContent").html("<span style='color:#d3d3d8 !important'>升级套餐 &gt;&gt;</span>");
                    $(".upLevelPackge").addClass('btnDisabled');
                }
                var activeTimeBegin = dataObj.selfServiceOverview.startTime;
                var activeTimeEnd = dataObj.selfServiceOverview.endTime;
                $("#activeTimeBegin").text(activeTimeBegin);
                $("#activeTimeEnd").text(activeTimeEnd);
                var nearingDue = dataObj.selfServiceOverview.nearingDue;
                if (nearingDue)
                {
                    $("#packageType").text(moduleName);
                    $('#package-modal').modal('show');
                }
                var balance = dataObj.selfServiceOverview.availableAmount;
                if (balance < 0)
                {
                    var balanceText = "￥" + balance;
                    $("#moneyVal").text(balanceText);
                    $('#arrearage-modal').modal('show');
                }
                //流量
                var flowSum = dataObj.selfServiceOverview.traffic.totalAmount;
                var flowSumDw = dataObj.selfServiceOverview.traffic.totalAmountUnit;
                var flowAlready = dataObj.selfServiceOverview.traffic.usedAmount;
                var flowAlreadyDw = dataObj.selfServiceOverview.traffic.usedAmountUnit;
                $("#flowAlready").text(flowAlready + flowAlreadyDw);
                $("#flowSum").text(flowSum + flowSumDw);
                var flowPercentVal = dataObj.selfServiceOverview.traffic.percent;
                var flowPercent = flowPercentVal + '%';
                var flowProgressObj = $("#flowProgress");
                $(flowProgressObj).css("width", flowPercent);
                if (flowPercentVal >85 && flowPercentVal < 100) {
                    $(flowProgressObj).addClass("soon");
                    $('#package-inform1-modal').modal('show');
                } else if (flowPercentVal >= 100) {
                    $(flowProgressObj).addClass("over");
                    $("#flowText").text("流量已超出,请及时充值");
                }
                overViewEntity.dataObj.startTime = leToolFunction.getBeforeDate(6);
                overViewEntity.dataObj.endTime = leToolFunction.getNowTime();
                overViewUi.flowGetData();
                //空间基本数据
                var spaceSum = dataObj.selfServiceOverview.space.totalAmount;
                var spaceSumDw = dataObj.selfServiceOverview.space.totalAmountUnit;
                var spaceAlready = dataObj.selfServiceOverview.space.usedAmount;
                var spaceAlreadyDw = dataObj.selfServiceOverview.space.usedAmountUnit;
                $("#spaceAlready").text(spaceAlready + spaceAlreadyDw);
                $("#spaceSum").text(spaceSum + spaceSumDw);
                var spacePercentVal = dataObj.selfServiceOverview.space.percent;
                var spacePercent = spacePercentVal+ '%';
                var spaceProgress = $("#spaceProgress");
                $(spaceProgress).css("width", spacePercent);
                if (spacePercentVal > 85 && spacePercentVal < 100) {
                    $(spaceProgress).addClass("soon");
                    //$('#package-inform3-modal').modal('show');
                } else if (spacePercentVal >= 100) {
                    $(spaceProgress).addClass("over");
                    $("#spaceText").text("空间已超出,请及时充值");
                }
                if (moduleName == "体验版") {
                    $("#transContent").hide();
                } else {
                    //转码时长基本数据
                    //720P
                    if(dataObj.selfServiceOverview.hiresTime720){
                        var transC720Sum = dataObj.selfServiceOverview.hiresTime720.totalAmount;
                        var transC720SumDw = dataObj.selfServiceOverview.hiresTime720.totalAmountUnit;
                        var transC720Already = dataObj.selfServiceOverview.hiresTime720.usedAmount;
                        var transC720AlreadyDw = dataObj.selfServiceOverview.hiresTime720.usedAmountUnit;
                        $("#transC720Already").text(transC720Already + transC720AlreadyDw);
                        $("#transC720Sum").text(transC720Sum + transC720SumDw);
                        var t720PercentVal = dataObj.selfServiceOverview.hiresTime720.percent;
                        var t720Percent = t720PercentVal + '%';
                        var transC720Progress = $("#transC720Progress");
                        $(transC720Progress).css("width", t720Percent);
                        if (t720PercentVal > 85 && t720PercentVal < 100) {
                            $(transC720Progress).addClass("soon");
                            $('#package-inform2-modal').modal('show');
                        } else if (t720PercentVal >= 100) {
                            $(transC720Progress).addClass("over");
                            $("#transC720Text").text("720P已超出,请及时充值");
                        }
                    } else {
                        $("#transC720Already").text("NaN");
                        $("#transC720Sum").text("NaN");
                    }

                    //1080P
                    if(dataObj.selfServiceOverview.hiresTime1080){
                        var transC1080Sum = dataObj.selfServiceOverview.hiresTime1080.totalAmount;
                        var transC1080SumDw = dataObj.selfServiceOverview.hiresTime1080.totalAmountUnit;
                        var transC1080Already = dataObj.selfServiceOverview.hiresTime1080.usedAmount;
                        var transC1080AlreadyDw = dataObj.selfServiceOverview.hiresTime1080.usedAmountUnit;
                        $("#transC1080Already").text(transC1080Already + transC1080AlreadyDw);
                        $("#transC1080Sum").text(transC1080Sum + transC1080SumDw);
                        var t1080PercentVal = dataObj.selfServiceOverview.hiresTime1080.percent;
                        var t1080Percent = t1080PercentVal + '%';
                        var transC1080Progress = $("#transC1080Progress");
                        $(transC1080Progress).css("width", t1080Percent);
                        if (t1080PercentVal > 85 && t1080PercentVal < 100) {
                            $(transC1080Progress).addClass("soon");
                            $('#package-inform2-modal').modal('show');
                        } else if (t1080PercentVal >= 100) {
                            $(transC1080Progress).addClass("over");
                            $("#transC1080Text").text("1080P已超出,请及时充值");
                        }
                    } else {
                        $("#transC1080Already").text("NaN");
                        $("#transC1080Sum").text("NaN");
                    }
                }
                overViewEntity.dataObj.startTime = leToolFunction.getBeforeDate(6);
                overViewEntity.dataObj.endTime = leToolFunction.getNowTime();
                var spaceActive = true;
                var transActive = true;
                $("#flow-label li").on("click", function () {
                    var selIndex = $(this).index();
                    if (selIndex == 1) {
                        //空间
                        if (spaceActive)
                        {
                            overViewUi.spaceGetData();
                            spaceActive = false;
                        }
                    }else if(selIndex == 2)
                    {
                        //转码时长
                        if (transActive)
                        {
                            overViewUi.transGetData();
                            transActive = false;
                        }
                    }
                })
            }
            leLoading.destroy(loadingId);  // 销毁loading
        });
    }();
    //return overViewUi;
    //tab切换
    $("#flow-label").myTab({ parent: "#flow-con", method: 0 });
    //日历图标点击触发日历
    $(".icon-rili").on("click", function () {
        $(this).prev().click();
    })
    //升级套餐按钮点击
    $(".upLevelPackge").on("click", function () {
        if (!$(this).hasClass("btnDisabled"))
        {
            window.open("http://uc.lecloud.com/Determination/upGradeVodPricePackageView.do");
        }
    })
})();
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 