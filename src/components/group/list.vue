<template>
    <el-row class="warp">
        <el-col :span="24" class="warp-breadcrum">
            <el-breadcrumb separamstor="/">
                <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
                <el-breadcrumb-item>用户组列表</el-breadcrumb-item>
            </el-breadcrumb>
        </el-col>

        <el-col :span="24" class="warp-main">
            <!--工具条-->
            <el-col :span="24" class="toolbar" style="padding-bottom: 0;">
                <el-form :inline="true" :model="filters">
                    <el-form-item>
                        <el-input v-model="filters.name" placeholder="用户组名" style="min-width: 240px;"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="getGroup">查询</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="showAddDialog">添加</el-button>
                    </el-form-item>
                </el-form>
            </el-col>

            <!--列表-->
            <el-table :data="groups" highlight-current-row v-loading="groupLoading" style="width: 100%;">
                <el-table-column type="index" width="60">
                </el-table-column>
                <el-table-column prop="name" label="用户组名" width="160" sortable>
                </el-table-column>
                <el-table-column prop="roles" label="角色" :formatter="formatRole">
                </el-table-column>
                <el-table-column label="操作" width="150">
                    <template scope="scope">
                        <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除
                        </el-button>
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

            <!-- begin: 添加编辑用户组界面-->
            <el-dialog title="用户组管理" v-model="groupFormVisible" :close-on-click-modal="false">
                <el-form :model="groupForm" label-width="100px" ref="groupForm">
                    <el-form-item label="用户组名" prop="name" required>
                        <el-input v-model="groupForm.name" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="用户组角色">
                        <el-transfer
                            filterable
                            :filter-method="filterMethod"
                            filter-placeholder="请输入角色名"
                            v-model="groupForm.roleNames"
                            :data="roleData">
                        </el-transfer>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click.native="groupFormVisible = false">取消</el-button>
                    <el-button type="primary" @click.native="groupFormSubmit">提交</el-button>
                </div>
            </el-dialog>
            <!-- end: 添加编辑用户组界面-->
        </el-col>
    </el-row>
</template>

<script>
    import $ from 'jquery';
    import {
        reqGetRoleList,
        reqGetGroupList,
        addGroup,
        editGroup,
        deleteGroup
    } from '../../api/api';
    export default {
        data() {
            return {
                filters: {
                    name: ''
                },
                filterMethod(query, item) {
                    return item.label.indexOf(query) > -1;
                },
                groups: [],
                roles: [],
                roleData: [],
                groupFormVisible: false,
                groupLoading: false,
                groupForm: {
                    id: '',
                    name: '',
                    roles: [],
                    roleNames: [],
                },
                total: 0
            }
        },
        methods: {
            //获取用户组列表
            getGroup: function () {
                let self = this;
                self.groupLoading = true;
                reqGetGroupList().then((res) => {
                    self.groupLoading = false;
                    this.groups = res.data.content;
                });
            },
            //获取用户角色列表
            getRole: function () {
                let self = this;
                reqGetRoleList().then((res) => {
                    self.roles = res.data.content;
                    // 对角色值回填
                    self.roles.forEach((role, index) => {
                        self.roleData.push({
                            label: role.name,
                            key: role.name
                        });
                    });
                });
            },
            formatRole: function (row, column) {
                let roleNames = [];
                $.each(row.roles, function (i, role) {
                    roleNames.push(role.name);
                })
                return roleNames.join(',');
            },
            showAddDialog: function () {
                let self = this;
                self.groupFormVisible = true;
            },
            // 添加用户提交用户信息
            groupFormSubmit: function () {
                let self = this;
                self.$refs.groupForm.validate((valid) => {
                    if (valid) {
                        debugger
                        let params = Object.assign({}, self.groupForm);
                        $.each(self.groupForm.roleNames, function (i, roleName) {
                            $.each(self.roles, function (i, role) {
                                if (role.name === roleName) {
                                    self.groupForm.roles.push(role);
                                }
                            });
                        });
                        if (params.id && params.id !== '') {
                            // 编辑用户组
                            debugger
                            editGroup(params).then((res) => {
                                self.$message({
                                    message: '添加用户组成功',
                                    type: 'success'
                                });
                                self.$refs['groupForm'].resetFields();
                                self.groupFormVisible = false;
                                self.getGroup();
                            }).catch(() => {
                                self.$message({
                                    message: '添加用户组失败!',
                                    type: 'error'
                                });
                            });
                        } else {
                            // 添加用户组
                            addGroup(params).then((res) => {
                                self.$message({
                                    message: '添加用户组成功',
                                    type: 'success'
                                });
                                self.$refs['groupForm'].resetFields();
                                self.groupFormVisible = false;
                                self.getGroup();
                            }).catch(() => {
                                self.$message({
                                    message: '添加用户组失败!',
                                    type: 'error'
                                });
                            });
                        }

                    }
                });
            },
            handleEdit(index, row) {
                this.groupFormVisible = true;
                this.groupForm = Object.assign({}, row);
            },
            handleDelete(index, row) {
                this.$confirm('确认删除该记录吗?', '提示', {type: 'warning'}).then(() => {
                    let params = {id: row.id};
                    deleteGroup(params).then((res) => {
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getGroup();
                    }).catch(() => {
                        this.$message({
                            message: '删除失败',
                            type: 'error'
                        });
                    });
                }).catch(() => {
                    this.$message({
                        message: '取消删除',
                        type: 'info'
                    });
                });
            },
            handleCurrentChange () {
            }
        },
        mounted() {
            this.getGroup();
            this.getRole();
        }
    }
</script>
