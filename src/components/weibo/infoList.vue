<template>
    <el-row class="warp">
        <el-col :span="24" class="warp-breadcrum">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
                <el-breadcrumb-item>微博设置</el-breadcrumb-item>
                <el-breadcrumb-item>微博用户信息</el-breadcrumb-item>
            </el-breadcrumb>
        </el-col>
        <el-col :span="24" class="warp-main">
            <!--工具条-->
            <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
                <el-form :inline="true" :model="filters">
                    <el-form-item>
                        <el-input v-model="filters.name" placeholder="用户昵称" style="min-width: 240px;"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="getUser">查询</el-button>
                    </el-form-item>
                    <el-form-item class="sort-btn">
                        <el-button @click="sortByFollow"
                                   :class="{active:filters.sortBy==='followsNum'?true:false}">关注数倒序
                        </el-button>
                        <el-button @click="sortByFans"
                                   :class="{active:filters.sortBy==='fansNum'?true:false}">粉丝数倒序
                        </el-button>
                        <el-button @click="sortByWeiboSum"
                                   :class="{active:filters.sortBy==='wbNum'?true:false}">微博数倒序
                        </el-button>
                    </el-form-item>
                </el-form>
            </el-col>
            <!--列表-->
            <el-col :span="24" v-loading="loading">
                <div>
                    <el-table :data="users" border highlight-current-row style="width: 100%;">
                        <el-table-column type="expand">
                            <template scope="props">
                                <el-form label-position="left" inline class="table-expand">
                                    <el-form-item label="用户昵称">
                                        <span>{{ props.row.name }}</span>
                                    </el-form-item>
                                    <el-form-item label="用户ID">
                                        <span>{{ props.row.uid }}</span>
                                    </el-form-item>
                                    <el-form-item label="性别">
                                        <span>{{ props.row.gender }}</span>
                                    </el-form-item>
                                    <el-form-item label="微博数">
                                        <span>{{ props.row.wbNum }}</span>
                                    </el-form-item>
                                    <el-form-item label="认证类型">
                                        <span>{{ props.row.verifyType }}</span>
                                    </el-form-item>
                                    <el-form-item label="关注数">
                                        <span>{{ props.row.followsNum }}</span>
                                    </el-form-item>
                                    <el-form-item label="粉丝数">
                                        <span>{{ props.row.fansNum }}</span>
                                    </el-form-item>
                                    <el-form-item label="微博等级">
                                        <span>{{ props.row.level }}</span>
                                    </el-form-item>
                                    <el-form-item label="地区">
                                        <span>{{ props.row.location }}</span>
                                    </el-form-item>
                                    <el-form-item label="星座">
                                        <span>{{ props.row.birthday }}</span>
                                    </el-form-item>
                                    <el-form-item label="注册时间">
                                        <span>{{ props.row.registerTime }}</span>
                                    </el-form-item>
                                    <el-form-item label="微博标签" class="fullrow">
                                        <span>{{ props.row.tags }}</span>
                                    </el-form-item>
                                    <el-form-item label="联系信息" class="fullrow">
                                        <span>{{ props.row.contactInfo }}</span>
                                    </el-form-item>
                                    <el-form-item label="教育信息" class="fullrow">
                                        <span>{{ props.row.educationInfo }}</span>
                                    </el-form-item>
                                    <el-form-item label="工作信息" class="fullrow">
                                        <span>{{ props.row.workInfo }}</span>
                                    </el-form-item>
                                    <el-form-item label="认证信息" class="fullrow">
                                        <span>{{ props.row.verifyInfo }}</span>
                                    </el-form-item>
                                    <el-form-item label="描述" class="fullrow">
                                        <span>{{ props.row.description }}</span>
                                    </el-form-item>
                                    <!--<el-form-item label="用户头像">-->
                                    <!--<img :src="props.row.head_img" width="60px" height="60px" alt="暂无图片">-->
                                    <!--</el-form-item>-->
                                </el-form>
                            </template>
                        </el-table-column>
                        <!--<el-table-column label="用户头像" width = "100">-->
                        <!--<template scope="scope">-->
                        <!--<img :src="scope.row.photo" width="60px" height="60px" alt="暂无图片">-->
                        <!--</template>-->
                        <!--</el-table-column>-->
                        <el-table-column prop="name" label="用户昵称" show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column prop="gender" label="性别">
                        </el-table-column>
                        <el-table-column prop="followsNum" label="关注数">
                        </el-table-column>
                        <el-table-column prop="fansNum" label="粉丝数">
                        </el-table-column>
                        <el-table-column prop="wbNum" label="微博数">
                        </el-table-column>
                        <el-table-column prop="verifyType" label="认证类型">
                        </el-table-column>
                        <el-table-column prop="level" label="微博等级">
                        </el-table-column>
                        <el-table-column prop="location" label="地区" show-overflow-tooltip>
                        </el-table-column>
                    </el-table>
                    <el-col :span="24">
                        <div align="center" class="page-box">
                            <el-pagination
                                @current-change="handleCurrentChange"
                                :current-page="pager.currentPage"
                                :page-size="pager.pageSize"
                                layout="total, prev, pager, next, jumper"
                                :total="pager.totalElements">
                            </el-pagination>
                        </div>
                    </el-col>
                </div>

            </el-col>
        </el-col>
    </el-row>
</template>

<script>
    import {reqWeiboUser} from '@/api/apiKafka';
    export default {
        data() {
            return {
                filters: {
                    name: '',
                    sortBy: 'followsNum'
                },
                pager: {
                    pageSize: 10,
                    currentPage: 1,
                    totalElements: 100
                },
                loading: false,
                users: [],
            }
        },
        methods: {
            //按关注数倒序
            sortByFollow: function () {
                var self = this;
                self.filters.sortBy = "followsNum";
                self.getUser();
            },
            //按粉丝数倒序
            sortByFans: function () {
                var self = this;
                self.filters.sortBy = "fansNum";
                self.getUser();
            },
            //按微博数量倒序
            sortByWeiboSum: function () {
                var self = this;
                self.filters.sortBy = "wbNum";
                self.getUser();
            },
            handleCurrentChange: function (pager) {
                var self = this;
                self.pager.currentPage = pager;
                self.getUser();
            },
            //性别显示转换
            formatGender: function (gender) {
                var formatGender;
                switch (gender) {
                    case 0:
                        formatGender = "未知";
                        break;
                    case 1:
                        formatGender = "男";
                        break;
                    case 2:
                        formatGender = "女";
                        break;
                }
                return formatGender
            },
            //认证信息显示转换
            formatVerify: function (verifyType) {
                var verity;
                switch (verifyType) {
                    case 0:
                        verity = "未认证";
                        break;
                    case 1:
                        verity = "个人认证";
                        break;
                    case 2:
                        verity = "企业认证";
                        break;
                }
                return verity;
            },
            //获取用户列表
            getUser: function () {
                let self = this;
                let para = {
                    name: self.filters.name,
                    page: self.pager.currentPage,
                    limit: self.pager.pageSize,
                    orderBy: self.filters.sortBy,
                    desc: true
                };
                self.loading = true;
                reqWeiboUser(para).then((res) => {
                    self.loading = false;
                    self.users = res.data.content;
                    self.users.forEach(function (item) {
                        item.gender = self.formatGender(item.gender);
                        item.verifyType = self.formatVerify(item.verifyType);
                    });
                    self.pager.totalElements = res.data.totalElements;

                });
            }
        },
        mounted() {
            this.getUser();
        }
    }
</script>
<style lang="scss" scoped>
    @import "./scss/weibo.scss";
</style>
