<template>
    <el-row class="warp">
        <el-col :span="24" class="warp-breadcrum">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
                <el-breadcrumb-item>微博设置</el-breadcrumb-item>
                <el-breadcrumb-item>种子采集</el-breadcrumb-item>
            </el-breadcrumb>
        </el-col>

        <el-col :span="24" class="warp-main">
            <!--工具条-->
            <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
                <el-form :inline="true" :model="filters">
                    <el-form-item>
                        <el-input v-model="filters.uid" placeholder="微博用户ID" style="min-width: 240px;"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="getUser">查询</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="showAddDialog">新增</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="danger" @click="batchDeleteRole" :disabled="this.sels.length===0">批量删除</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
            <!--列表-->
            <el-table :data="users" border highlight-current-row v-loading="loading" style="width: 100%;"  @selection-change="selsChange">
                <el-table-column type="selection" width="55">
                </el-table-column>
                <el-table-column prop="uid" label="微博用户ID">
                </el-table-column>
                <el-table-column prop="crawled" label="是否爬取" :formatter="formatIsCrawled">
                </el-table-column>
                <el-table-column prop="otherCrawled" label="是否采集用户粉丝" :formatter="formatOtherCrawled">
                </el-table-column>
                <el-table-column prop="homeCrawled" label="是否采集用户主页" :formatter="formatHomeCrawled">
                </el-table-column>
                <el-table-column label="操作">
                    <template scope="scope">
                        <el-button
                            size="small"
                            @click="handleEdit(scope.$index, scope.row)">编辑
                        </el-button>
                        <el-button
                            size="small"
                            type="danger"
                            @click="handleDelete(scope.$index, scope.row)">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-col :span = "24">
                <div align="center" class = "page-box">
                    <el-pagination
                        @current-change="handleCurrentChange"
                        :current-page="pager.currentPage"
                        :page-size="pager.pageSize"
                        layout="total, prev, pager, next, jumper"
                        :total="pager.totalElements">
                    </el-pagination>
                </div>
            </el-col>
            <!--编辑界面-->
            <el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
                <el-form :model="editForm" label-width="140px" ref="editForm">
                    <el-form-item label="微博用户ID" prop="uid">
                        <el-input v-model="editForm.uid" auto-complete="off" class="input-box"></el-input>
                    </el-form-item>
                    <el-form-item label="是否爬取" prop="is_crawled">
                        <el-radio-group v-model="editForm.crawled">
                            <el-radio :label="0">否</el-radio>
                            <el-radio :label="1">是</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="是否采集用户粉丝" prop="other_crawled">
                        <el-radio-group v-model="editForm.otherCrawled">
                            <el-radio :label="0">否</el-radio>
                            <el-radio :label="1">是</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="是否采集用户主页" prop="home_crawled">
                        <el-radio-group v-model="editForm.homeCrawled">
                            <el-radio :label="0">否</el-radio>
                            <el-radio :label="1">是</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click.native="editFormVisible = false">取消</el-button>
                    <el-button type="primary" @click.native = "editSubmit" :loading="editLoading">提交</el-button>
                </div>
            </el-dialog>
            <!--新增界面-->
            <el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
                <el-form :model="addForm" label-width="140px" ref="addForm">
                    <el-form-item label="微博用户ID" prop="uid">
                        <el-input v-model="addForm.uid" auto-complete="off" class="input-box"></el-input>
                    </el-form-item>
                    <el-form-item label="是否爬取" prop="is_crawled">
                        <!--<el-switch-->
                        <!--v-model="addForm.crawled"-->
                        <!--on-color="#13ce66"-->
                        <!--off-color="#ff4949"-->
                        <!--@change="formatSwitchCrawled">-->
                        <!--</el-switch>-->
                        <el-radio-group v-model="addForm.crawled">
                            <el-radio :label="0">否</el-radio>
                            <el-radio :label="1">是</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="是否采集用户粉丝" prop="other_crawled">
                        <!--<el-switch-->
                        <!--v-model="addForm.otherCrawled"-->
                        <!--on-color="#13ce66"-->
                        <!--off-color="#ff4949"-->
                        <!--@change="formatSwitchOtherCrawled">-->
                        <!--</el-switch>-->
                        <el-radio-group v-model="addForm.otherCrawled">
                            <el-radio :label="0">否</el-radio>
                            <el-radio :label="1">是</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="是否采集用户主页" prop="home_crawled">
                        <!--<el-switch-->
                        <!--v-model="addForm.homeCrawled"-->
                        <!--on-color="#13ce66"-->
                        <!--off-color="#ff4949"-->
                        <!--@change = "formatSwitchHomeCrawled">-->
                        <!--</el-switch>-->
                        <el-radio-group v-model="addForm.homeCrawled">
                            <el-radio :label="0">否</el-radio>
                            <el-radio :label="1">是</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click.native="addFormVisible = false">取消</el-button>
                    <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
                </div>
            </el-dialog>
        </el-col>
    </el-row>
</template>

<script>
    import {reqSeedsSearch,reqSeedsAdd,reqSeedsDelete,reqSeedsEdit} from '@/api/apiKafka';
    export default {
        data() {
            return {
                pager: {
                    pageSize: 10,
                    currentPage: 1,
                    totalElements: 20
                },
                filters: {
                    uid: ''
                },
                loading: false,
                users: [],
                sels: [], //列表选中列
                editFormVisible: false,//编辑界面是否展示
                addFormVisible: false,//新增界面是否显示
                editForm: {},
                addLoading: false,
                editLoading:false,
                addForm: {}
            }
        },
        methods: {
            //更改是否采集
            formatSwitchCrawled: function (status) {
                this.addForm.crawled = status == true ? 1 : 0
            },
            //更改是否采集粉丝
            formatSwitchOtherCrawled: function (status) {
                this.addForm.otherCrawled = status == true ? 1 : 0
            },
            //更改是否采集用户主页
            formatSwitchHomeCrawled: function (status) {
                this.addForm.homeCrawled = status == true ? 1 : 0
            },
            handleCurrentChange: function (pager) {
                this.pager.currentPage = pager;
                this.getUser();
            },
            //批量删除
            batchDeleteRole: function () {
//                let array = new Array();
//                this.sels.map(item => array.push({id: item.uid}));
//                this.$confirm('确认删除选中记录吗？', '提示', {
//                    type: 'warning'
//                }).then(() => {
//                    this.loading = true;
//                    let para = array;
//                    reqBatchDeleteRole(para).then((res) => {
//                        this.loading = false;
//                        this.$message({
//                            message: '删除成功',
//                            type: 'success'
//                        });
//                        this.getUser();
//                    });
//                }).catch(() => {
//
//                });
            },
            //点击复选框
            selsChange: function (sels) {
                this.sels = sels;
            },
            //是否采集  显示转换
            formatIsCrawled: function (row, column) {
                let crawled;
                switch (row.crawled) {
                    case 0:
                        crawled = "否";
                        break;
                    case 1:
                        crawled = "是";
                        break;
                    case 2:
                        crawled = "爬取出错";
                        break;
                }
                return crawled
            },
            //是否采集其他  显示转换
            formatOtherCrawled: function (row, column) {
                let crawled;
                switch (row.otherCrawled) {
                    case 0:
                        crawled = "否";
                        break;
                    case 1:
                        crawled = "是";
                        break;
                    case 2:
                        crawled = "爬取出错";
                        break;
                }
                return crawled
            },
            //是否采集过主页   显示转换
            formatHomeCrawled: function (row, column) {
                let crawled;
                switch (row.homeCrawled) {
                    case 0:
                        crawled = "否";
                        break;
                    case 1:
                        crawled = "是";
                        break;
                    case 2:
                        crawled = "爬取出错";
                        break;
                }
                return crawled
            },
            //获取用户列表
            getUser: function () {
                let para = {
                    uid: this.filters.uid,
                    page: this.pager.currentPage,
                    limit: this.pager.pageSize,
                    orderBy: "crawled",
                    desc: true
                };
                this.loading = true;
                reqSeedsSearch(para).then((res) => {
                    this.loading = false;
                    this.users = res.data.content;
                    this.pager.totalElements = res.data.totalElements;
                });
            },
            //显示新增页面,并初始化
            showAddDialog: function () {
                this.addFormVisible = true;
                this.addForm = {
                    uid: '',
                    crawled: 0,
                    otherCrawled: 0,
                    homeCrawled: 0
                }
            },
            //提交新增
            addSubmit: function () {
                let para = this.addForm;
                this.addLoading = true;
                reqSeedsAdd(para).then((res) => {
                    this.addLoading = false;
                    this.addFormVisible = false;
                    this.$message({
                        message: '添加成功',
                        type: 'success'
                    });
                    this.filters.uid = '';
                    this.getUser();
                }).catch((error)=>{
                    this.addLoading = false;
                    this.addFormVisible = false;
                    this.$message.error('添加失败');
                    this.filters.uid = '';
                    this.getUser();
                });
            },
            //显示编辑
            handleEdit(index,row) {
                this.editFormVisible = true;
                this.editForm = Object.assign({}, row);
            },
            //提交编辑
            editSubmit:function(){
                this.$refs.editForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.editLoading = true;
                            let para = Object.assign({}, this.editForm);
                            reqSeedsEdit(para).then((res) => {
                                this.editLoading = false;
                                this.$message({
                                    message: '提交成功',
                                    type: 'success'
                                });
                                this.$refs['editForm'].resetFields();
                                this.editFormVisible = false;
                                this.getUser();
                            }).catch(function(){
                                this.$message.error('提交失败');
                                this.getUser();
                            });
                        });
                    }
                });
            },
            //删除
            handleDelete(index, row) {
                this.$confirm('确认删除选中记录吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    let para = row.id;
                    reqSeedsDelete(para).then((res) => {
                        debugger
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getUser();
                    }).catch(()=> {
                        debugger
                        this.$message.error('删除失败');
                        this.getUser();
                    });
                });
            }
        },
        mounted() {
            this.getUser();
//            this.getRole();
//            this.getGroup();
        }
    }
</script>
<style>
@import "./scss/weibo.scss";
</style>
