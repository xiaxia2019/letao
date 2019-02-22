$(function(){

    // 左边柱状图

    // 基于准备好的dom，初始化echarts实例
    var echarts_left = echarts.init(document.querySelector('.echarts_left'));

    // 指定图表的配置项和数据
    var option_left = {
        // 大标题
        title: {
            // 标题文本
            text: '2019年注册人数'
        },
        tooltip: {},
        // 图例
        legend: {
            data:['销量', '人数']
        },
        // x轴刻度
        xAxis: {
            data: ["1月","2月","3月","4月","5月","6月"]
        },
        // y轴的刻度: 根据数据动态生成
        yAxis: {},
        // 数据项列表
        series: [{
            name: '销量',
            type: 'bar',  // bar : 柱状图;  line : 折线图
            data: [1000, 200, 360, 200, 180, 400]
        },
        {
            name: '人数',
            type: 'bar',
            data: [500, 800, 460, 180, 880, 1200]
        }]
    };

    // 使用刚指定的配置项和数据显示图表。
    echarts_left.setOption(option_left);



    // 右边饼图
    var echarts_right = echarts.init(document.querySelector('.echarts_right'));
    var option_right = {
        // 大标题
        title : {
            // 标题文本
            text: '某站点用户访问来源',
            // 副标题文本
            subtext: '纯属虚构',
            // 水平方向位置
            x:'center',
            // 控制主标题文本样式
            textStyle: {
                color: "red",
                fontSize: 25
            }
        },
        // 提示框组件
        tooltip : {
            trigger: 'item',
            // 配置提示框组件内容
            // {a}（系列名称），{b}（数据项名称），{c}（数值）, {d}（百分比）
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        // 图例
        legend: {
            // 图例对齐方式 (vertical:垂直排列; horizontal:水平排列)
            orient: 'vertical',
            left: 'left',
            data: ['耐克','阿迪','特步','回力','新百伦']
        },
        series : [
            {
                name: '品牌热销',
                type: 'pie',  // pie : 饼图
                radius : '55%', // 圆的大小
                center: ['50%', '60%'],  // 圆心坐标
                data:[
                    {value:335, name:'耐克'},  // 数据项名称
                    {value:310, name:'阿迪'},
                    {value:234, name:'特步'},
                    {value:135, name:'回力'},
                    {value:1548, name:'新百伦'}
                ],
                // 其他效果
                itemStyle: {
                    // 阴影效果
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };
    echarts_right.setOption(option_right);
});