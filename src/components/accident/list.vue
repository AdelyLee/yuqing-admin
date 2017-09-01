<template>
    <el-row class="warp">
        <el-col :span="24" class="warp-breadcrum">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
                <el-breadcrumb-item>事故管理</el-breadcrumb-item>
            </el-breadcrumb>
        </el-col>

        <el-col :span="24" class="warp-main">
            <!--工具条-->
            <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
                <el-form :inline="true" :model="filters">
                    <el-form-item>
                        <el-input v-model="filters.name" placeholder="搜索企业名称" style="min-width: 240px;" @change = "getSearch"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="getSearch()">查询</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="showAddDialog">新增</el-button>
                    </el-form-item>
                    <el-form-item>
                    <el-button type="danger" @click="batchDelete" :disabled="this.sels.length===0">批量删除
                    </el-button>
                    </el-form-item>
                    <!--<el-form-item class="sort-btn">-->
                    <!--<el-button @click="sortByTime"-->
                    <!--:class="{active:filters.sortBy==='adate'?true:false}">时间倒序-->
                    <!--</el-button>-->
                    <!--<el-button @click="sortByDeath"-->
                    <!--:class="{active:filters.sortBy==='deathnumber'?true:false}">死亡人数倒序-->
                    <!--</el-button>-->
                    <!--</el-form-item>-->
                </el-form>
            </el-col>
            <!--列表-->
            <el-col v-loading="loading">
                <el-table :data="users" border highlight-current-row style="width: 100%;"
                          @selection-change="selsChange">
                    <el-table-column type="selection" width="55">
                    </el-table-column>
                    <el-table-column type="expand">
                        <template scope="props">
                            <el-form label-position="left" inline class="table-expand">
                                <el-form-item label="企业名称">
                                    <span>{{ props.row.companyFullName }}</span>
                                </el-form-item>
                                <el-form-item label="数据来源">
                                    <span>{{ props.row.from }}</span>
                                </el-form-item>
                                <el-form-item label="位置信息">
                                    <span>{{ props.row.cityinfo }}</span>
                                </el-form-item>
                                <el-form-item label="事故时间">
                                    <span>{{ props.row.originaltime }}</span>
                                </el-form-item>
                                <el-form-item label="死亡人数">
                                    <span>{{ props.row.deathnumber }}</span>
                                </el-form-item>
                                <el-form-item label="事故级别">
                                    <span>{{ props.row.sgjb }}</span>
                                </el-form-item>
                                <el-form-item label="省">
                                    <span>{{ props.row.province }}</span>
                                </el-form-item>
                                <el-form-item label="市">
                                    <span>{{ props.row.city }}</span>
                                </el-form-item>
                                <el-form-item label="县">
                                    <span>{{ props.row.county }}</span>
                                </el-form-item>
                                <el-form-item label="事故类别">
                                    <span>{{ props.row.atype }}</span>
                                </el-form-item>
                                <el-form-item label="事故子类">
                                    <span>{{ props.row.atype2 }}</span>
                                </el-form-item>
                                <el-form-item label="事故内容" class="fullrow">
                                    <span>{{ props.row.content }}</span>
                                </el-form-item>
                            </el-form>
                        </template>
                    </el-table-column>
                    <el-table-column prop="companyFullName" label="企业名称" width="200"></el-table-column>
                    <el-table-column prop="originaltime" label="事故时间">
                    </el-table-column>
                    <el-table-column prop="deathnumber" label="死亡人数">
                    </el-table-column>
                    <el-table-column prop="atype" label="事故类别">
                    </el-table-column>
                    <el-table-column prop="sgjb" label="事故级别"></el-table-column>
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
            <!--编辑界面-->
            <el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
                <el-form :model="editForm" label-width="140px" ref="editForm" :rules="rules">
                    <el-form-item label="企业名称" prop="companyFullName">
                        <el-input v-model="editForm.companyFullName" auto-complete="off" class="input-box"></el-input>
                    </el-form-item>
                    <el-form-item label="死亡人数" prop="deathnumber">
                        <el-input v-model.number="editForm.deathnumber" auto-complete="off" class="input-box"></el-input>
                    </el-form-item>
                    <el-form-item label="事故时间" required>
                        <el-col :span="11">
                            <el-form-item prop="originaltime">
                                <el-date-picker type="datetime"
                                                placeholder="选择日期"
                                                v-model="editForm.originaltime"
                                                :editable=false
                                                :clearable=false
                                                @change='changeEditTime'
                                                style="width: 100%;">

                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="事故类别" prop="selectedOptions">
                        <el-cascader
                            :options="options"
                            v-model="editForm.selectedOptions"
                        ></el-cascader>
                    </el-form-item>
                    <el-form-item label="数据来源" prop="from" required>
                        <el-select v-model="editForm.from" placeholder="请选择事故类别">
                            <el-option label="安监总局" value="安监总局"></el-option>
                            <el-option label="网络爬虫" value="网络爬虫"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="位置信息" required>
                        <el-col :span="8">
                            <el-form-item prop="province">
                                <el-input v-model="editForm.province" auto-complete="off"
                                          class="input-box"></el-input>
                                省
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item prop="city">
                                <el-input v-model="editForm.city" auto-complete="off" class="input-box"></el-input>
                                市
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item prop="county">
                                <el-input v-model="editForm.county" auto-complete="off" class="input-box"></el-input>
                                县
                            </el-form-item>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="事故内容" prop="content">
                        <el-input type="textarea"
                                  v-model="editForm.content"
                                  auto-complete="off"
                                  :autosize="{ minRows: 2, maxRows: 4}"
                                  class="input-box"></el-input>
                    </el-form-item>
                    <el-form-item align="right">
                        <el-button @click.native="editFormVisible = false">取消</el-button>
                        <el-button type="primary" @click.native="editSubmit('editForm')" :loading="editLoading">提交
                        </el-button>
                    </el-form-item>
                </el-form>
            </el-dialog>
            <!--新增界面-->
            <el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false" :close-on-press-escape = "false" :before-close = "closeAddForm">
                <el-form :model="addForm" label-width="140px" ref="addForm" :rules="rules">
                    <el-form-item label="企业名称" prop="companyFullName">
                        <el-input v-model="addForm.companyFullName" class="name-input"></el-input>
                    </el-form-item>
                    <el-form-item label="死亡人数" prop="deathnumber">
                        <el-input v-model.number="addForm.deathnumber"
                                  class="name-input">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="事故时间" required>
                        <el-col :span="11">
                            <el-form-item prop="originaltime">
                                <el-date-picker type="datetime"
                                                placeholder="选择日期"
                                                v-model="addForm.originaltime"
                                                :editable=false
                                                :clearable=false
                                                @change="changeAddTime"
                                                style="width: 100%;">

                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="事故类别" prop="selectedOptions">
                        <el-cascader
                            :options="options"
                            v-model="addForm.selectedOptions"
                        ></el-cascader>
                    </el-form-item>
                    <el-form-item label="数据来源" prop="from" required>
                        <el-select v-model="addForm.from" placeholder="请选择事故类别">
                            <el-option label="安监总局" value="安监总局"></el-option>
                            <el-option label="网络爬虫" value="网络爬虫"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="位置信息" required>
                        <el-col :span="8">
                            <el-form-item prop="province">
                                <el-input v-model="addForm.province" auto-complete="off"
                                          class="input-box"></el-input>
                                省
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item prop="city">
                                <el-input v-model="addForm.city" auto-complete="off" class="input-box"></el-input>
                                市
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item prop="county">
                                <el-input v-model="addForm.county" auto-complete="off" class="input-box"></el-input>
                                县
                            </el-form-item>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="事故内容" prop="content">
                        <el-input type="textarea"
                                  v-model="addForm.content"
                                  auto-complete="off"
                                  :autosize="{ minRows: 2, maxRows: 4}"
                                  class="input-box"></el-input>
                    </el-form-item>
                    <el-form-item align="right">
                        <el-button @click.native="closeAddForm">取消</el-button>
                        <el-button type="primary" @click="addSubmit('addForm')" :loading="addLoading">提交</el-button>
                        <el-button @click="resetForm('addForm')">重置</el-button>
                    </el-form-item>
                </el-form>
            </el-dialog>
        </el-col>
    </el-row>
</template>

<script>
    import {
        reqAccidentList,
        reqAccidentAdd,
        reqAccidentDelete,
        reqAccidentEdit,
        reqAccidentDeleteMultiple
    } from '@/api/api';

    export default {
        data() {
            return {
                rules: {
                    companyFullName: [
                        {required: true, message: '请输入企业名称'}
                    ],
                    deathnumber: [
                        {required: true, message: '死亡人数不能为空'},
                        { type: 'number', message: '死亡人数必须为数字值'}
                    ],
                    selectedOptions: [
                        {required: true, message: '请选择事故类别'}
                    ],
//                    originaltime: [
//                        { type: 'date', required: true, message: '请选择日期' }
//                    ],
                    province: [
                        {required: true, message: '请输入省'}
                    ],
                    city: [
                        {required: true, message: '请输入市'}
                    ],
                    county: [
                        {required: true, message: '请输入县'}
                    ],
                    content: [
                        {required: true, message: '请输入事故内容'}
                    ],
                },
                filters: {
                    name: '',
                    sortBy: 'adate'
                },
                pager: {
                    pageSize: 10,
                    currentPage: 1,
                    totalElements: 10
                },
                loading: true,//列表加载
                users: [],
                sels: [], //列表选中列
                editFormVisible: false,//编辑界面是否展示
                addFormVisible: false,//新增界面是否显示
                editForm: {},
                addLoading: false,
                editLoading: false,
                addForm: {
                    companyFullName: '',
                    deathnumber: '',
                    originaltime: '',
                    province: '',
                    city: '',
                    county: '',
                    atype: '',
                    atype2: '',
                    from: '网络爬虫',
                    content: '',
                    selectedOptions: []
                },
                options: [{
                    value: '煤矿',
                    label: '煤矿',
                    children: [{
                        value: '顶板',
                        label: '顶板',
                    }, {
                        value: '瓦斯',
                        label: '瓦斯',
                    }, {
                        value: '机电',
                        label: '机电',
                    }, {
                        value: '运输',
                        label: '运输',
                    }, {
                        value: '爆破',
                        label: '爆破',
                    }, {
                        value: '水害',
                        label: '水害',
                    }, {
                        value: '火灾',
                        label: '火灾',
                    }, {
                        value: '其他',
                        label: '其他',
                    }]
                }, {
                    value: '生产经营性火灾',
                    label: '生产经营性火灾',
                    children: [{
                        value: '生产经营性火灾',
                        label: '生产经营性火灾',
                    }]
                }, {
                    value: '建筑施工',
                    label: '建筑施工',
                    children: [{
                        value: '建筑施工',
                        label: '建筑施工',
                    }]
                }, {
                    value: '道路运输',
                    label: '道路运输',
                    children: [{
                        value: '道路运输',
                        label: '道路运输',
                    }, {
                        value: '水上交通',
                        label: '水上交通',
                    }, {
                        value: '铁路交通',
                        label: '铁路交通',
                    }, {
                        value: '民航飞行',
                        label: '民航飞行',
                    }]
                }, {
                    value: '金属非金属矿',
                    label: '金属非金属矿',
                    children: [{
                        value: '金属非金属矿',
                        label: '金属非金属矿',
                    }, {
                        value: '石油天然气',
                        label: '石油天然气',
                    }]
                }, {
                    value: '工商贸其他',
                    label: '工商贸其他',
                    children: [{
                        value: '工商贸其他',
                        label: '工商贸其他',
                    }, {
                        value: '轻工',
                        label: '轻工',
                    }, {
                        value: '冶金',
                        label: '冶金',
                    }, {
                        value: '机械',
                        label: '机械',
                    }, {
                        value: '有色',
                        label: '有色',
                    }, {
                        value: '建材',
                        label: '建材',
                    }, {
                        value: '纺织',
                        label: '纺织',
                    }, {
                        value: '烟草',
                        label: '烟草',
                    }, {
                        value: '贸易',
                        label: '贸易',
                    }]
                }, {
                    value: '渔业船舶',
                    label: '渔业船舶',
                    children: [{
                        value: '渔业船舶',
                        label: '渔业船舶',
                    }]
                }, {
                    value: '危险化学品',
                    label: '危险化学品',
                    children: [{
                        value: '化工',
                        label: '化工',
                    }, {
                        value: '危险化学品',
                        label: '危险化学品',
                    }]
                }, {
                    value: '特种设备',
                    label: '特种设备',
                    children: [{
                        value: '特种设备',
                        label: '特种设备',
                    }]
                }, {
                    value: '烟花爆竹',
                    label: '烟花爆竹',
                    children: [{
                        value: '烟花爆竹',
                        label: '烟花爆竹',
                    }]
                }, {
                    value: '农业机械',
                    label: '农业机械',
                    children: [{
                        value: '农业机械',
                        label: '农业机械',
                    }]
                }, {
                    value: '其他',
                    label: '其他',
                    children: [{
                        value: '其他',
                        label: '其他',
                    }]
                }],
            }
        },
        methods: {
            //关闭新增按钮
            closeAddForm: function () {

                this.addFormVisible = false;
                this.resetForm('addForm')
            },
            //更改新增时间
            changeAddTime: function (time) {
                this.addForm.originaltime = time
            },
            //更改编辑时间
            changeEditTime: function (time) {
                this.editForm.originaltime = time
            },
            //按死亡人数倒序
            sortByDeath: function () {
                var self = this;
                self.filters.sortBy = "deathnumber";
                self.getList();
            },
            //按时间倒序
            sortByTime: function () {
                var self = this;
                self.filters.sortBy = "adate";
                self.getList();
            },
            //点击页码
            handleCurrentChange: function (pager) {
                this.pager.currentPage = pager;
                this.getList();
            },
            //批量删除
            batchDelete: function () {
                let self = this;
                let array = new Array();
                self.sels.map(item => array.push(item));
                self.$confirm('确认删除选中记录吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    let para = array;
                    debugger
                    reqAccidentDeleteMultiple(para).then((res) => {
                        self.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        self.getList();
                    }).catch(function () {
                        self.$message.error('删除失败');
                        self.getList();
                    });
                })
            },
            //点击复选框
            selsChange: function (selection) {
                this.sels = selection;
            },
            //查询
            getSearch: function () {
                this.pager.currentPage = 1;
                this.getList();
            },
            //获取列表
            getList: function () {
                let self = this;
                let name = self.filters.name;
                let para = {
                    "limit": this.pager.pageSize,
                    "orders": [
                        {
                            "direction": "DESC",
                            "orderBy": "adate"
                        }
                    ],
                    "page": this.pager.currentPage
                }
                self.loading = true;
                reqAccidentList(para, name).then((res) => {
                    self.loading = false;
                    self.users = res.data.content;
                    self.pager.totalElements = res.data.totalElements;
                });
            },
            //显示新增页面
            showAddDialog: function () {
                let self = this;
                self.addFormVisible = true;
            },
            //提交新增
            addSubmit: function (formName) {
                let self = this;
                self.$refs[formName].validate((valid) => {
                    if (valid) {
                        let para = Object.assign({}, self.addForm);
                        para.companyName = para.companyFullName;
                        para.selectedOptions.forEach(function (item, index) {
                            switch (index) {
                                case 0:
                                    para.atype = item;
                                    break;
                                case 1:
                                    para.atype2 = item;
                                    break;
                            }
                        })
                        self.addLoading = true;
                        reqAccidentAdd(para).then((res) => {
                            self.addLoading = false;
                            self.closeAddForm();
                            self.filters.name = '';
                            self.$message({
                                message: '添加成功',
                                type: 'success'
                            });
                            self.getList();

                        }).catch((error) => {
                            self.addLoading = false;
                            self.closeAddForm();
                            self.filters.name = '';
                            self.$message.error('添加失败');
                            self.getList();

                        });
                    } else {
                        return false;
                    }
                });

            },
            //重置页面
            resetForm: function (formName) {
                this.$refs[formName].resetFields();
            },
            //显示编辑
            handleEdit(index, row) {
                this.editFormVisible = true;
                this.editForm = Object.assign({}, row);
                this.editForm.selectedOptions = [];
                this.editForm.selectedOptions.push(this.editForm.atype)
                this.editForm.selectedOptions.push(this.editForm.atype2)
            },
            //提交编辑
            editSubmit: function (formName) {
                let self = this;
                self.$refs[formName].validate((valid) => {
                    if (valid) {
                        self.editLoading = true;
                        let para = {};
                        para.companyFullName = self.editForm.companyFullName;
                        para.companyName = self.editForm.companyFullName;
                        para.deathnumber = self.editForm.deathnumber;
                        para.originaltime = self.editForm.originaltime;
                        para.province = self.editForm.province;
                        para.city = self.editForm.city;
                        para.from = self.editForm.from;
                        para.content = self.editForm.content;
                        para.county = self.editForm.county;
                        para.atype = self.editForm.selectedOptions[0];
                        para.atype2 = self.editForm.selectedOptions[1];
                        let listId = self.editForm.id;
                        reqAccidentEdit(para, listId).then((res) => {
                            self.editLoading = false;
                            self.editFormVisible = false;
                            self.$message({
                                message: '提交成功',
                                type: 'success'
                            });
                            self.getList();
                        }).catch(function () {
                            self.editLoading = false;
                            self.editFormVisible = false;
                            self.$message.error('提交失败');
                            self.getList();
                        });
                    } else {
                    }
                })
            },
            //删除
            handleDelete(index, row) {
                this.$confirm('确认删除选中记录吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    let para = row.id;
                    reqAccidentDelete(para).then((res) => {
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getList();
                    }).catch(() => {
                        this.$message.error('删除失败');
                        this.getList();
                    });
                });
            }
        },
        mounted() {
            this.getList();
        }
    }
</script>
<style lang="scss" scoped>
    @import "../weibo/scss/weibo.scss";
</style>
