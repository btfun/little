'use strict';

define(function (require) {
    'use strict';

    /**
    * template: 一般从页面直接获取 节省 请求量
    *
    **/

    return {
        template: require('text!components/manager/home/homeTmpl.html'),
        data: function data() {
            return {
                msg: '测试一下咯',
                age: 20
            };
        },
        beforeCreate: function beforeCreate() {
            //在实例初始化之后，数据观测(data observer) 和 event/watcher 事件配置之前被调用。

        },
        created: function created() {},
        computed: {},
        watch: {},
        methods: {
            goo: function goo() {
                this.$router.push({ path: '/busi' });
            },
            note: function note() {
                this.$notify({
                    title: '标题名称',
                    message: '阿里里阿里里阿里里阿里里'
                });
            }
        }
    };
});