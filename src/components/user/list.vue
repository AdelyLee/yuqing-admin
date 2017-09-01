<template>
    <el-row class="warp">
        <el-col :span="24" class="warp-breadcrum">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
                <el-breadcrumb-item>用户列表</el-breadcrumb-item>
            </el-breadcrumb>
        </el-col>

        <el-col :span="24" class="warp-main">
            <!--工具条-->
            <el-col :span="24" class="toolbar" style="padding-bottom: 0;">
                <el-form :inline="true" :model="filters">
                    <el-form-item>
                        <el-input v-model="filters.fullName" placeholder="用户名称" style="min-width: 240px;"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="getUser">查询</el-button>
                        <el-button type="primary" @click="addUser">添加</el-button>
                    </el-form-item>
                </el-form>
            </el-col>

            <!--列表-->
            <el-table :data="users" highlight-current-row v-loading="loading" style="width: 100%;">
                <el-table-column type="index" width="60">
                </el-table-column>
                <el-table-column prop="username" label="用户名" width="120" sortable>
                </el-table-column>
                <el-table-column prop="fullName" label="用户名称" width="200">
                </el-table-column>
                <el-table-column prop="gender" label="性别" width="100" :formatter="formatGender" sortable>
                </el-table-column>
                <el-table-column prop="groupNames" label="用户组" width="180" :formatter="formatGroup">
                </el-table-column>
                <el-table-column prop="roleNames" label="角色" :formatter="formatRole">
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

            <!--分页工具条-->
            <el-col :span="24" class="toolbar">
                <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="10"
                               :total="total" style="float:right;">
                </el-pagination>
            </el-col>

            <!-- start: 编辑或添加界面-->
            <el-dialog title="用户管理" v-model="userFormVisible" :before-close="handleClose">
                <el-form :model="userForm" label-width="100px" ref="userForm">
                    <el-form-item label="用户名" prop="username">
                        <el-input v-model="userForm.username" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="用户名称" prop="fullName">
                        <el-input v-model="userForm.fullName"></el-input>
                    </el-form-item>
                    <el-form-item label="性别" prop="gender">
                        <el-select v-model="userForm.gender" placeholder="请选择">
                            <el-option
                                v-for="item in genderData"
                                :key="item.key"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="用户组" prop="group">
                        <el-select v-model="userForm.groupNames" multiple placeholder="请选择">
                            <el-option
                                v-for="item in groupData"
                                :key="item.key"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="角色" prop="role">
                        <el-select v-model="userForm.roleNames" multiple placeholder="请选择">
                            <el-option
                                v-for="item in roleData"
                                :key="item.key"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="handleClose">取消</el-button>
                    <el-button type="primary" @click="submitUserForm">提交</el-button>
                </div>
            </el-dialog>
            <!-- end: 编辑或添加界面-->
        </el-col>
    </el-row>
</template>

<script>
    import {
        reqGetUserList,
        reqGetRoleList,
        reqGetGroupList,
        addUser,
        editUser,
        deleteUser
    } from '../../api/api';
    import {handlerError} from '../../utils/handlerError';
    import $ from 'jquery'
    export default {
        data() {
            return {
                filters: {
                    fullName: ''
                },
                loading: false,
                users: [],
                groups: [],
                roles: [],
                userFormVisible: false,
                userForm: {
                    id: '',
                    username: '',
                    fullName: '',
                    password: '',
                    gender: '',
                    groupNames: [],
                    roleNames: []
                },
                groupData: [],
                roleData: [],
                genderData: [{
                    key: '0',
                    label: '女性',
                    value: 'Female'
                }, {
                    key: '1',
                    label: '男性',
                    value: 'Male'
                }, {
                    key: '2',
                    label: '未知',
                    value: 'unknown'
                }],
                total: 0
            }
        },
        methods: {
            //性别显示转换
            formatGender: function (row, column) {
                return row.gender == 'Male' ? '男' : row.gender == 'FeMale' ? '女' : '未知';
            },
            formatGroup: function (row, column) {
                return row.groupNames.join(',');
            },
            formatRole: function (row, column) {
                return row.roleNames.join(',');
            },
            //获取用户列表
            getUser: function () {
                let self = this;
                let param = {
                    fullName: this.filters.fullName
                };
                this.loading = true;
                reqGetUserList(param).then((res) => {
                    this.loading = false;
                    this.users = res.data.content;
                    this.total = res.data.totalElements;
                }).catch(error => {
                    if (!error) {
                        error = {response: {data: {code:'error', message: '获取用户列表错误!'}}}
                    }
                    handlerError(error, self);
                });
            },
            /**
             * 添加用户
             */
            addUser: function () {
                let self = this;
                self.userFormVisible = true;
            },
            //获取用户组列表
            getGroup: function () {
                let self = this;
                reqGetGroupList().then((res) => {
                    self.groups = res.data.content;

                    // 对用户组回填
                    self.groupData = [];
                    for (let group of self.groups) {
                        let node = {};
                        node.key = group.id;
                        node.label = group.name;
                        node.value = group.name;

                        self.groupData.push(node);
                    }
                });
            },
            //获取用户角色列表
            getRole: function () {
                let self = this;
                reqGetRoleList().then((res) => {
                    self.roles = res.data.content;
                    // 对角色值回填
                    self.roleData = [];
                    for (let role of self.roles) {
                        let node = {};
                        node.key = role.id;
                        node.label = role.name;
                        node.value = role.name;

                        self.roleData.push(node);
                    }
                });
            },
            handleEdit(index, row) {
                var self = this;
                self.userFormVisible = true;
                self.userForm = Object.assign({}, row);
            },
            handleDelete(index, row) {
                let self = this;
                let params = row;
                self.$confirm('确定删除该记录?', '提示', {type: 'warning'}).then(() => {
                    deleteUser(params).then(data => {
                        self.$message({
                            showClose: true,
                            message: '删除用户成功！',
                            type: 'success'
                        });
                        self.getUser();
                    }).catch(() => {
                        self.$message({
                            showClose: true,
                            message: '删除用户失败！',
                            type: 'error'
                        });
                    })
                }).catch(() => {
                    self.$message({
                        showClose: true,
                        message: '删除已取消！',
                        type: 'info'
                    });
                })

            },
            /**
             * 当添加用户或编辑用户的对话框关闭时,清空对话框的值
             */
            handleClose () {
                let self = this;
                self.userForm.id = '';
                self.userForm.username = '';
                self.userForm.fullName = '';
                self.userForm.password = '';
                self.userForm.gender = '';
                self.userForm.groupNames = [];
                self.userForm.roleNames = [];
                self.userFormVisible = false;
            },
            /**
             * 当点击提交按钮时
             */
            submitUserForm () {
                let self = this;
                let params = self.userForm;
                let {roles = [], groups = []} = {};
                $.each(self.userForm.roleNames, function (i, roleName) {
                    $.each(self.roles, function (i, role) {
                        if (role.name === roleName) {
                            roles.push(role);
                        }
                    });
                });
                $.each(self.userForm.groupNames, function (i, groupName) {
                    $.each(self.groups, function (i, group) {
                        if (group.name === groupName) {
                            groups.push(group);
                        }
                    });
                });
                params.groups = groups;
                params.roles = roles;
                if (params.id && params.id !== '') {
                    // 编辑用户
                    editUser(params).then(data => {
                        self.$message({
                            showClose: true,
                            message: '编辑用户成功！',
                            type: 'success'
                        });
                        self.getUser();
                    }).catch(() => {
                        self.$message({
                            showClose: true,
                            message: '编辑用户失败！',
                            type: 'error'
                        });
                    })
                } else {
                    // 创建用户,
                    params.password = '123456';
                    addUser(params).then(data => {
                        self.userFormVisible = false;
                        self.$message({
                            showClose: true,
                            message: '添加用户成功！',
                            type: 'success'
                        });
                        self.getUser();
                    }).catch(() => {
                        self.$message({
                            showClose: true,
                            message: '添加用户失败！',
                            type: 'error'
                        });
                    })
                }
            },
            handleCurrentChange () {

            }
        },
        mounted() {
            this.getUser();
            this.getRole();
            this.getGroup();
        }
    }
</script>
