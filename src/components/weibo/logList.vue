<template>
    <el-row class="warp">
        <el-col :span="24" class="warp-breadcrum">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
                <el-breadcrumb-item>微博设置</el-breadcrumb-item>
                <el-breadcrumb-item>日志展示</el-breadcrumb-item>
            </el-breadcrumb>
        </el-col>
        <el-col :span="24" class="warp-main">
            <!--工具条-->
            <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
                <el-form :inline="true" :model="filters">
                    <el-form-item>
                        <el-input v-model="filters.type" placeholder="类型" style="min-width: 240px;"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="findType">查询</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="danger" @click="batchDeleteLog" :disabled="this.sels.length===0">批量删除
                        </el-button>
                    </el-form-item>
                    <el-form-item class="sort-btn">
                        <el-button @click.native="sortById"
                                   :class="{active:filters.sortBy==='uid'?true:false}">按照id
                        </el-button>
                    </el-form-item>
                </el-form>
            </el-col>
            <!--列表-->
            <el-table :data="logs" border highlight-current-row v-loading="loading" style="width: 100%;"
                      @selection-change="selsChange">
                <el-table-column type="selection" width="55"></el-table-column>
                <!--<el-table-column type="index" width="60">-->
                <!--</el-table-column>-->
                <el-table-column prop="createTime" label="创建时间" sortable>
                </el-table-column>
                <el-table-column prop="spiderTime" label="采集时间">
                </el-table-column>
                <el-table-column prop="uid" label="用户ID">
                </el-table-column>
                <el-table-column prop="type" label="类型">
                </el-table-column>
                <el-table-column prop="lastId" label="结束条数">
                </el-table-column>
                <el-table-column label="操作">
                    <template scope="scope">
                        <el-button size="small" @click="showEditDialog(scope.$index,scope.row)">编辑</el-button>
                        <el-button type="danger" @click="delLog(scope.$index,scope.row)" size="small">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!--分页工具条-->
            <el-col :span="24" class="toolbar">
                <el-pagination @current-change="handleCurrentChange"
                               :current-page="pager.page"
                               :page-size="pager.limit"
                               layout="total, prev, pager, next, jumper"
                               :total="total"
                               style="float:right;">
                </el-pagination>
            </el-col>

            <!--编辑界面-->
            <el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
                <el-form :model="editForm" label-width="100px" :rules="editFormRules" ref="editForm">
                    <el-form-item label="创建时间" prop="createTime">
                        <el-input v-model="editForm.createTime" auto-complete="off" :formatter="formatDate"></el-input>
                    </el-form-item>
                    <el-form-item label="采集时间" prop="spiderTime">
                        <el-input v-model="editForm.spiderTime" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="用户ID" prop="uid">
                        <el-input v-model="editForm.uid" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="类型" prop="type">
                        <el-input v-model="editForm.type" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="结束条数" prop="lastId">
                        <el-input v-model="editForm.lastId" auto-complete="off"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click.native="editFormVisible = false">取消</el-button>
                    <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
                </div>
            </el-dialog>
        </el-col>
    </el-row>
</template>
<script>
    import {reqGetLogList, reqEditLog, reqFindTypeList, reqDeleteLog, reqGetIdLogList} from '../../api/apiKafka';
    import util from '../../common/util';
    export default {
        data() {
            return {
                filters: {
                    type: '',
                    sortBy: '',
                },
                pager: {
                    limit: 10,
                    page: 1,
                },
                loading: false,
                logs: [],
                total: 0,
                sels: [], //列表选中列
                //编辑相关数据
                editFormVisible: false,//编辑界面是否显示
                editLoading: false,
                editFormRules: {
                    createTime: [
                        {required: true, message: '请输入创建时间', trigger: 'blur'}
                    ],
                    spiderTime: [
                        {required: true, message: '请输入采集时间', trigger: 'blur'}
                    ],
                    uid: [
                        {required: true, message: '请输入用户Id', trigger: 'blur'}
                    ],
                    type: [
                        {required: true, message: '请输入类型', trigger: 'blur'}
                    ],
                    lastId: [
                        {required: true, message: '请输入结束条数', trigger: 'blur'}
                    ],
                },
                editForm: {
                    id: 0,
                    createTime: '',
                    spiderTime: '',
                    uid: '',
                    type: '',
                    lastId: '',
                    author: '',
                    publishAt: '',
                    description: ''
                },
            }
        },
        methods: {
//          按照type 查询
            findType: function () {
                let self = this
                if (self.filters.type) {
                    let para = {
                        type: self.filters.type
                    };
                    self.loading = true;
                    //NProgress.start();
                    reqFindTypeList(para).then((res) => {
                        var self = this;
                        if (res.data) {
                            let content = [];
                            content.push(res.data)
                            this.logs = content;
                            self.total = 1;
                        } else {
                            this.logs = [];
                            self.total = 0;
                        }
                        self.loading = false;
                        //NProgress.done();
                    });
                } else {
                    this.getLog()
                }
            },
//            按照id排序
            sortById: function () {
                var self = this;
                if (self.filters.sortBy == '') {
                    self.filters.sortBy = "uid";
                    var self = this;
                    let para = {
                        limit: self.pager.limit,
                        page: self.pager.page,
                        type: 1,
                    };
                    this.loading = true;
                    //NProgress.start();
                    reqGetIdLogList(para).then((res) => {
                        debugger;
                        var self = this;
                        this.logs = res.data.content;
                        self.total = res.data.totalElements;
                        self.loading = false;
                        //NProgress.done();
                    });
                } else {
                    self.filters.sortBy = "";
                    self.getLog();
                }

            },
            formatDate: function (row, column) {
                return (util.formatDate.format(new Date(row.createTime), 'yyyy-MM-dd'));
            },
            //获取列表
            getLog: function () {
                var self = this;
                let para = {
                    limit: self.pager.limit,
                    page: self.pager.page,
                    type: 1,
                };
                this.loading = true;
                //NProgress.start();
                reqGetLogList(para).then((res) => {
                    debugger;
                    var self = this;
                    this.logs = res.data.content;
                    self.total = res.data.totalElements;
                    self.loading = false;
                    //NProgress.done();
                });
            },
            showEditDialog: function (index, row) {
                this.editFormVisible = true;
                this.editForm = Object.assign({}, row);
            },
            //编辑
            editSubmit: function () {
                this.$refs.editForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.editLoading = true;
                            //NProgress.start();
                            let para = Object.assign({}, this.editForm);
                            delete para.permissionNames;
                            delete para.permissions;
                            delete para.resources;
                            reqEditLog(para).then((res) => {
                                this.editLoading = false;
                                //NProgress.done();
                                this.$message({
                                    message: '提交成功',
                                    type: 'success'
                                });
                                this.$refs['editForm'].resetFields();
                                this.editFormVisible = false;
                                this.getLog();
                            });
                        });
                    }
                });
            },
            selsChange: function (sels) {
                this.sels = sels;
            },
            //删除
            delLog: function (index, row) {
                this.$confirm('确认删除该记录吗?', '提示', {type: 'warning'}).then(() => {
                    this.loading = true;
                    //NProgress.start();
                    let para = {id: row.id};
                    reqDeleteLog(para).then((res) => {
                        this.loading = false;
                        //NProgress.done();
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getLog();
                    });
                }).catch(() => {
                });
            },
            handleCurrentChange(val) {
                var self = this;
                self.pager.page = val;
                this.getLog();
            },
            //批量删除
            batchDeleteLog: function () {
                debugger;
                let array = new Array();
                var ids = this.sels.map(item => array.push({id: item.id}));
                this.$confirm('确认删除选中记录吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.loading = true;
                    //NProgress.start();
                    let para = array;
                    reqBatchDeleteLog(para).then((res) => {
                        this.loading = false;
                        //NProgress.done();
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getLog();
                    });
                }).catch(() => {

                });
            }
        },
        mounted() {
            this.getLog();
        },
    }
</script>

<style lang="scss" scoped>
    @import "./scss/weibo.scss";
</style>
