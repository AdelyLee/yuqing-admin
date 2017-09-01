<template>
    <el-row class="warp">
        <el-col :span="24" class="warp-breadcrum">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
                <el-breadcrumb-item>菜单管理</el-breadcrumb-item>
            </el-breadcrumb>
        </el-col>

        <el-col :span="24" class="warp-main">
            <el-input
                placeholder="输入关键字进行过滤"
                v-model="filterText">
            </el-input>

            <el-tree
                :data="menuTree"
                class="filter-tree"
                :props="defaultProps"
                show-checkbox
                node-key="id"
                default-expand-all
                :expand-on-click-node="false"
                :render-content="renderContent"
                :filter-node-method="filterNode"
                ref="menuTree">
            </el-tree>
        </el-col>

        <!-- start: 编辑或添加界面-->
        <el-dialog title="菜单管理" v-model="menuFormVisible" :before-close="handleClose">
            <el-form :model="menuForm" label-width="150px" ref="menuForm">
                <el-form-item label="菜单类型" prop="type">
                    <el-radio-group v-model="menuForm.type">
                        <el-radio label="DIRECTORY">目录</el-radio>
                        <el-radio label="MENU">菜单</el-radio>
                        <el-radio label="BUTTON">按钮</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="叶子节点" prop="leaf">
                    <el-switch on-text="是" off-text="否" v-model="menuForm.leaf"></el-switch>
                </el-form-item>
                <el-form-item label="父节点" prop="parentName">
                    <el-input v-model="menuForm.parentName" :readonly="true" icon="edit"
                              :on-icon-click="showParentMenu"></el-input>
                </el-form-item>
                <el-form-item label="菜单名称" prop="name">
                    <el-input v-model="menuForm.name"></el-input>
                </el-form-item>
                <el-form-item label="菜单图标" prop="icon">
                    <el-input v-model="menuForm.icon"></el-input>
                </el-form-item>
                <el-form-item label="菜单路径" prop="url">
                    <el-input v-model="menuForm.url"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="handleClose">取消</el-button>
                <el-button type="primary" @click="submitMenuForm">保存</el-button>
            </div>
        </el-dialog>
        <!-- end: 编辑或添加界面-->
        <!-- start: 编辑或添加界面-->
        <el-dialog title="选择父菜单" v-model="parentMenuVisible" :before-close="handleParentMenuClose">
            <el-tree
                :data="menuTree"
                :props="defaultProps"
                :expand-on-click-node="false"
                @node-click="selectParentMenu">
            </el-tree>
        </el-dialog>
        <!-- end: 编辑或添加界面-->
    </el-row>
</template>

<script>
    import $ from 'jquery';
    import {getMenuTree, getMenuItem, addMenu, editMenu, deleteMenu} from '../../api/menu';
    export default {
        data() {
            return {
                filterText: '',
                menuTree: [],
                defaultProps: {
                    children: 'children',
                    label: 'name'
                },
                menuFormVisible: false,
                menuForm: {
                    type: '', // 菜单类型 directory, menu, button
                    leaf: true, // 是否为叶子几点
                    icon: '',
                    name: '',
                    parentName: '', // 父节点名称
                    parentId: '',
                    url:''
                },
                parentMenuVisible: false,
            };
        },
        mounted () {
            this.getMenuTree();
        },
        methods: {
            filterNode(value, data) {
                if (!value) return true;
                return data.name.indexOf(value) !== -1;
            },
            getMenuTree () {
                let self = this;
                let params = {id: ''};
                getMenuTree(params).then(data => {
                    self.menuTree = data;
                }).catch(() => {
                    self.$confirm('获取菜单树失败!', '错误', {type: 'error'});
                });
            },
            showParentMenu () {
                let self = this;
                self.parentMenuVisible = true;
            },
            selectParentMenu (data, node, item) {
                let self = this;
                self.menuForm.parentId = data.id;
                self.menuForm.parentName = data.name;
            },
            add(store, data) {
                let self = this;
                self.menuFormVisible = true;
                self.menuForm.parentName = data.name;
                self.menuForm.parentId = data.id;
            },
            edit(store, data) {
                let self = this;
                self.menuForm = Object.assign({}, data);
                // 通过parentId 获取父节点信息
                if (data.parentId) {
                    let params = {id: data.parentId}
                    getMenuItem(params).then(item => {
                        self.menuForm.parentId = item.id;
                        self.menuForm.parentName = item.name;
                        self.menuFormVisible = true;
                    }).catch(() => {
                        self.$message({
                            showClose: true,
                            message: '获取父菜单节点失败！',
                            type: 'error'
                        });
                    })
                } else {
                    self.menuFormVisible = true;
                }
            },
            submitMenuForm () {
                let self = this;
                let params = Object.assign({}, self.menuForm);
                params.parent = {id: self.menuForm.parentId};
                delete params.parentName;
                delete params.parentId;
                if (self.menuForm.id && self.menuForm.id !== '') {
                    editMenu(params).then(data => {
                        self.$message({
                            showClose: true,
                            message: '编辑菜单节点成功！',
                            type: 'success'
                        });
                        self.handleClose();
                        self.getMenuTree();
                    }).catch(() => {
                        self.$message({
                            showClose: true,
                            message: '编辑菜单节点失败！',
                            type: 'error'
                        });
                    })
                } else {
                    debugger
                    addMenu(params).then(data => {
                        self.$message({
                            showClose: true,
                            message: '添加菜单节点成功！',
                            type: 'success'
                        });
                        self.menuFormVisible = false;
                        self.getMenuTree();
                    }).catch(() => {
                        self.$message({
                            showClose: true,
                            message: '添加菜单节点失败！',
                            type: 'error'
                        });
                    })
                }
            },
            handleClose () {
                let self = this;
                self.menuForm.id = '';
                self.menuForm.type = '';
                self.menuForm.leaf = true ;
                self.menuForm.icon = '' ;
                self.menuForm.name = '' ;
                self.menuForm.parentName = '' ;
                self.menuForm.parentId = '' ;
                self.menuForm.url ='';
                self.menuFormVisible = false;
            },
            handleParentMenuClose () {
                let self = this;
                self.parentMenuVisible = false;
            },
            remove(store, data) {
                let self = this;
                if (!data.leaf) {
                    self.$confirm('该节点不是叶子节点,不能删除!', '错误', {type: 'error'});
                } else {
                    self.$confirm('确定删除该节点?', '警告', {type: 'warning'}).then(() => {
                        let params = {id: data.id};
                        deleteMenu(params).then(data =>{
                            self.$message({
                                showClose: true,
                                message: '删除菜单节点成功！',
                                type: 'success'
                            });
                            self.getMenuTree();
                        }).catch(() => {
                            self.$message({
                                showClose: true,
                                message: '删除菜单节点失败！',
                                type: 'error'
                            });
                        });
                    }).catch(() =>{
                        self.$message({
                            showClose: true,
                            message: '删除已取消！',
                            type: 'info'
                        });
                    });
                }
            },

            renderContent(h, { node, data, store }) {
                return (
                    <span>
                        <span>
                            <span>{node.label}</span>
                        </span>
                        <span style="margin-left: 10px">
                            <el-button size="mini" on-click={ () => this.add(store, data) }>添加</el-button>
                            <el-button size="mini" on-click={ () => this.edit(store, data) }>编辑</el-button>
                            <el-button size="mini" on-click={ () => this.remove(store, data) }>删除</el-button>
                        </span>
                    </span>);
            }
        },
        watch: {
            filterText(val) {
                this.$refs.menuTree.filter(val);
            }
        },

    }
</script>
