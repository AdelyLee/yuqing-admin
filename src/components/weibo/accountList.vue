<template>
    <el-row class="warp">
        <el-col :span="24" class="warp-breadcrum">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
                <el-breadcrumb-item>微博设置</el-breadcrumb-item>
                <el-breadcrumb-item>账户列表</el-breadcrumb-item>
            </el-breadcrumb>
        </el-col>
        <el-col :span="24" class="warp-main">
            <!--工具条-->
            <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
                <el-form :inline="true" :model="filters">
                    <el-form-item>
                        <el-input v-model="filters.name" placeholder="账号" style="min-width: 240px;"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="getAccountQuery">查询</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="showAddDialog">新增</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="danger" @click="batchDeleteAccountList" :disabled="this.sels.length===0">批量删除
                        </el-button>
                    </el-form-item>
                </el-form>
            </el-col>
            <!--列表-->
            <el-table :data="account" border highlight-current-row v-loading="loading" style="width: 100%;"
                      @selection-change="selsChange">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop="name" label="账户" width="180" sortable>
                </el-table-column>
                <el-table-column prop="password" label="密码" width="180" sortable>
                </el-table-column>
                <el-table-column prop="enable" label="状态" :formatter="formatState" min-width="180" sortable>
                </el-table-column>
                <el-table-column label="操作" width="180">
                    <template scope="scope">
                        <el-button size="small" @click="showEditDialog(scope.$index,scope.row)">编辑</el-button>
                        <el-button type="danger" @click="delAccount(scope.$index,scope.row)" size="small">删除</el-button>
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
                    <el-form-item label="账户名" prop="name">
                        <el-input v-model="editForm.name" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input v-model="editForm.password" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="是否启用" class="m_r form_item">
                        <el-radio-group v-model="editForm.enable" class="displayIn">
                            <el-radio :label="1">是</el-radio>
                            <el-radio :label="0">否</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click.native="editFormVisible = false">取消</el-button>
                    <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
                </div>
            </el-dialog>
            <!--新增界面-->
            <el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
                <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
                    <el-form-item label="账户" prop="name">
                        <el-input v-model="addForm.name" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input v-model="addForm.password" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="是否启用" class="m_r form_item">
                        <el-radio-group v-model="addForm.enable" class="displayIn">
                            <el-radio :label="1">是</el-radio>
                            <el-radio :label="0">否</el-radio>
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
    import {
        reqGetAccountList,
        reqAddAccount,
        reqEditAccount,
        reqDeleteAccount,
        reqGetAccountQueryList,
        reqBatchDeleteAccount
    } from '../../api/apiKafka';
    import util from '../../common/util';
    export default {
        data() {
            return {
                filters: {
                    name: ''
                },
                pager: {
                    page: 1,
                    limit: 10,
                },
                loading: false,
                account: [],
                total: 0,
                sels: [], //列表选中列
                //编辑相关数据
                editFormVisible: false,//编辑界面是否显示
                editLoading: false,
                editFormRules: {
                    name: [
                        {required: true, message: '请输入账户名', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '请输入密码', trigger: 'blur'}
                    ],
//
                },
                editForm: {
                    id: 0,
                    name: '',
                    password: '',
                    enable: 0,
                    author: '',
                    publishAt: '',
                    description: ''
                },
                //新增相关数据
                addFormVisible: false,//新增界面是否显示
                addLoading: false,
                addFormRules: {
                    name: [
                        {required: true, message: '请输入角色名', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '请输入密码', trigger: 'blur'}
                    ],
                },
                addForm: {
                    name: '',
                    password: '',
                    enable: 0,
                }
            }
        },
        methods: {
            //性别显示转换
            formatState: function (row, column) {
                return (row.enable == true ? '可用' : '已禁用');
            },
            formatDate: function (row, column) {
                return (util.formatDate.format(new Date(row.dateCreated), 'yyyy-MM-dd'));
            },
            //获取列表
            getAccountList: function () {
                this.loading = true;
                //NProgress.start();
                reqGetAccountList().then((res) => {
                    var self = this;
                    self.account = res.data.content;
                    self.total = res.data.totalElements;
                    self.loading = false;
                    //NProgress.done();
                });
            },
//          查询账户
            getAccountQuery: function () {
                var self = this;
                let para = {
                    name: self.filters.name,
                    limit: self.pager.limit,
                    page: self.pager.page,
                    orderBy: "id",
                    desc: true
                };
                this.loading = true;
                //NProgress.start();
                reqGetAccountQueryList(para).then((res) => {
                    var self = this;
                    self.account = res.data.content;
                    self.total = res.data.totalElements;
                    self.loading = false;
                    //NProgress.done();
                });
            },
            showAddDialog: function () {
                this.addFormVisible = true;
                this.addForm = {
                    name: '',
                    password: '',
                    enable: 0
                };
            },
            //新增
            addSubmit: function () {
                this.$refs.addForm.validate((valid) => {
                    if (valid) {
                        this.addLoading = true;
                        //NProgress.start();
                        let para = Object.assign({}, this.addForm);
                        reqAddAccount(para).then((res) => {
                            this.addLoading = false;
                            //NProgress.done();
                            this.$message({
                                message: '提交成功',
                                type: 'success'
                            });
                            this.$refs['addForm'].resetFields();
                            this.addFormVisible = false;
                            this.getAccountList();
                        });
                    }
                });
            },
            //显示编辑界面
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
                            reqEditAccount(para).then((res) => {
                                this.editLoading = false;
                                //NProgress.done();
                                this.$message({
                                    message: '提交成功',
                                    type: 'success'
                                });
                                this.$refs['editForm'].resetFields();
                                this.editFormVisible = false;
                                this.getAccountList();
                            });
                        });
                    }
                });
            },
            selsChange: function (sels) {
                this.sels = sels;
            },
            //删除
            delAccount: function (index, row) {
                this.$confirm('确认删除该记录吗?', '提示', {type: 'warning'}).then(() => {
                    this.loading = true;
                    //NProgress.start();
                    let para = {id: row.id};
                    reqDeleteAccount(para).then((res) => {
                        this.loading = false;
                        //NProgress.done();
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getAccountList();
                    });
                }).catch(() => {
                });
            },
            handleCurrentChange(val) {
                var self = this;
                self.pager.page = val;
                self.getAccountQuery();
            },
            //批量删除
            batchDeleteAccountList: function () {
                debugger;
                let array = new Array();
                var ids = this.sels.map(item => array.push({id: item.id}));
                this.$confirm('确认删除选中记录吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.loading = true;
                    //NProgress.start();
                    let para = array;
                    reqBatchDeleteAccount(para).then((res) => {
                        this.loading = false;
                        //NProgress.done();
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getAccountList();
                    });
                }).catch(() => {

                });
            }
        },
        mounted() {
            this.getAccountList();
        }
    }
</script>
<style scoped>

</style>
