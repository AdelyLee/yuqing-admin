<template>
    <el-row id="role" class="warp">
        <el-col :span="24" class="warp-breadcrum">
            <el-breadcrumb separamstor="/">
                <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
                <el-breadcrumb-item>角色列表</el-breadcrumb-item>
            </el-breadcrumb>
        </el-col>

        <el-col :span="24" class="warp-main">
            <!--工具条-->
            <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
                <el-form :inline="true" :model="filters">
                    <el-form-item>
                        <el-input v-model="filters.name" placeholder="角色名" style="min-width: 240px;"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="getRole">查询</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="showAddDialog">添加</el-button>
                    </el-form-item>
                </el-form>
            </el-col>

            <!--列表-->
            <el-table :data="roles" highlight-current-row v-loading="listLoading" style="width: 100%;">
                <el-table-column type="index" width="60">
                </el-table-column>
                <el-table-column prop="name" label="角色名" width="180" sortable>
                </el-table-column>
                <el-table-column prop="description" label="描述">
                </el-table-column>
                <el-table-column label="操作" width="150">
                    <template scope="scope">
                        <el-button size="small" @click="showEditDialog(scope.$index,scope.row)">编辑</el-button>
                        <el-button type="danger" @click="deleteRole(scope.$index,scope.row)" size="small">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!-- start: 分页工具条-->
            <el-col :span="24" class="toolbar">
                <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="10"
                               :total="total" style="float:right;">
                </el-pagination>
            </el-col>
            <!-- end: 分页工具条-->

            <!-- start: 添加编辑界面-->
            <el-dialog title="角色管理" v-model="roleFormVisible" :close-on-click-modal="false">
                <el-form :model="roleForm" label-width="100px" :rules="roleFormRules" ref="roleForm">
                    <el-form-item label="角色名" prop="name">
                        <el-input v-model="roleForm.name" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="状态" prop="available">
                        <el-switch on-text="是" off-text="否" v-model="roleForm.available"></el-switch>
                    </el-form-item>
                    <el-form-item label="描述" prop="description">
                        <el-input type="textarea" v-model="roleForm.description" :rows="2"></el-input>
                    </el-form-item>
                    <el-form-item label="菜单">
                        <el-tree
                            :data="menuTree"
                            show-checkbox
                            :props="defaultProps"
                            :expand-on-click-node="false">
                        </el-tree>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click.native="roleFormVisible = false">取消</el-button>
                    <el-button type="primary" @click.native="roleFormSubmit" :loading="submitLoading">提交</el-button>
                </div>
            </el-dialog>
            <!-- end: 添加编辑界面-->
        </el-col>
    </el-row>
</template>

<script>
    import {reqGetRoleList, reqAddRole, reqEditRole, reqDeleteRole} from '../../api/api';
    import {getMenuTree, getMenuItem} from '../../api/menu';
    import {handlerError} from '../../utils/handlerError';
    import util from '../../common/util';
    export default {
        data() {
            return {
                filters: {
                    name: ''
                },
                listLoading: false,
                roles: [],
                total: 0,
                page: 1,
                roleFormVisible: false,//编辑界面是否显示
                submitLoading: false,
                roleFormRules: {
                    name: [
                        {required: true, message: '请输入角色名', trigger: 'blur'}
                    ],
                    description: [
                        {required: false, message: '请输入描述', trigger: 'blur'}
                    ]
                },
                roleForm: {
                    id: '',
                    name: '',
                    available: true,
                    description: ''
                },
                menuTree: [],
                defaultProps: {
                    children: 'children',
                    label: 'name'
                },
            }
        },
        methods: {
            //获取列表
            getRole: function () {
                let params = {
                    name: this.filters.name
                };
                this.listLoading = true;
                reqGetRoleList(params).then((res) => {
                    this.roles = res.data.content;
                    this.listLoading = false;
                });
            },
            getMenuTree () {
                let self = this;
                let params = {id: ''};
                getMenuTree(params).then(data => {
                    self.menuTree = data;
                }).catch(error => {
                    if (!error) {
                        error = {response: {data: {code:'error', message: '获取菜单树失败'}}}
                    }
                    handlerError(error, self);
                });
            },
            showAddDialog: function () {
                this.roleFormVisible = true;
                this.roleForm = {
                    name: '',
                    description: ''
                };
            },
            roleFormSubmit () {
                let self = this;
                self.$refs.roleForm.validate((valid) => {
                    if (valid) {
                        let params = Object.assign({}, self.roleForm);
                        delete params.permissionNames;
                        delete params.permissions;
                        delete params.resources;
                        this.submitLoading = true;
                        if (params.id && params.id !== '') {
                            // 编辑用户角色
                            reqEditRole(params).then((res) => {
                                this.submitLoading = false;
                                this.$message({
                                    message: '编辑用户角色成功',
                                    type: 'success'
                                });
                                this.$refs['roleForm'].resetFields();
                                this.roleFormVisible = false;
                                this.getRole();
                            }).catch(() => {
                                this.submitLoading = false;
                                self.$message({
                                    message: '编辑用户角色失败!',
                                    type: 'error'
                                });
                            });
                        } else {
                            // 添加用户角色
                            reqAddRole(params).then((res) => {
                                this.submitLoading = false;
                                self.$message({
                                    message: '添加用户角色成功',
                                    type: 'success'
                                });
                                self.$refs['roleForm'].resetFields();
                                self.roleFormVisible = false;
                                self.getRole();
                            }).catch(() => {
                                this.submitLoading = false;
                                self.$message({
                                    message: '添加用户角色失败!',
                                    type: 'error'
                                });
                            });
                        }

                    }
                });
            },
            //显示编辑界面
            showEditDialog: function (index, row) {
                this.roleFormVisible = true;
                this.roleForm = Object.assign({}, row);
            },
            //删除
            deleteRole: function (index, row) {
                this.$confirm('确认删除该记录吗?', '提示', {type: 'warning'}).then(() => {
                    let params = {id: row.id};
                    reqDeleteRole(params).then((res) => {
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getRole();
                    });
                }).catch(() => {
                    this.$message({
                        message: '用户取消删除',
                        type: 'info'
                    });
                });
            },
            handleCurrentChange(val) {
                this.page = val;
                this.getRole();
            },
        },
        mounted() {
            this.getRole();
            this.getMenuTree();
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss">
    #role {
        .el-tree {
            height: 300px;
            overflow-y: auto;
        }
    }
</style>
