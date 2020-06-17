<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-calendar"></i> 表单
                </el-breadcrumb-item>
                <el-breadcrumb-item>基本表单</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="form-box">
                <el-form ref="form" :model="form" label-width="80px">
                    <el-form-item label="表单名称">
                        <el-input v-model="form.name"></el-input>
                    </el-form-item>
                    <el-form-item label="选择器">
                        <el-select v-model="form.region" placeholder="请选择">
                            <el-option key="bbk" label="步步高" value="bbk"></el-option>
                            <el-option key="xtc" label="小天才" value="xtc"></el-option>
                            <el-option key="imoo" label="imoo" value="imoo"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="日期时间">
                        <el-col :span="11">
                            <el-date-picker
                                    type="date"
                                    placeholder="选择日期"
                                    v-model="form.date1"
                                    value-format="yyyy-MM-dd"
                                    style="width: 100%;"
                            ></el-date-picker>
                        </el-col>
                        <el-col class="line" :span="2">-</el-col>
                        <el-col :span="11">
                            <el-time-picker
                                    placeholder="选择时间"
                                    v-model="form.date2"
                                    style="width: 100%;"
                            ></el-time-picker>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="城市级联">
                        <el-cascader :options="districtList"
                                     v-model="form.options"
                                     :props="districtProps"
                                     placeholder="请选择省市县"
                                     @expand-change="handleItemChange"
                                     filterable
                                     clearable
                        ></el-cascader>
                    </el-form-item>
                    <el-form-item label="选择开关">
                        <el-switch v-model="form.delivery"></el-switch>
                    </el-form-item>
                    <el-form-item label="多选框">
                        <el-checkbox-group v-model="form.type">
                            <el-checkbox label="步步高" name="type"></el-checkbox>
                            <el-checkbox label="小天才" name="type"></el-checkbox>
                            <el-checkbox label="imoo" name="type"></el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                    <el-form-item label="单选框">
                        <el-radio-group v-model="form.resource">
                            <el-radio label="步步高"></el-radio>
                            <el-radio label="小天才"></el-radio>
                            <el-radio label="imoo"></el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="文本框">
                        <el-input type="textarea" rows="5" v-model="form.desc"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit">表单提交</el-button>
                        <el-button>取消</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>

    import { getDistrictByDistrictLevel, getDistrictByParentDistrictId } from '../../api';

    export default {
        name: 'baseform',
        data() {
            return {
                query: {
                    'districtLevel': 1
                },
                districtList: [],
                form: {
                    name: '',
                    region: '',
                    date1: '',
                    date2: '',
                    delivery: true,
                    type: ['步步高'],
                    resource: '小天才',
                    desc: '',
                    options: []
                },
                districtProps: {
                    value: 'districtId',
                    label: 'districtName',
                    children: 'children',
                    expandTrigger: 'click'
                }
            };
        },

        created() {
            this.getFirstDistrict(this.query);
        },

        methods: {

            getFirstDistrict(districtLevel) {

                getDistrictByDistrictLevel(districtLevel).then(response => {

                    this.districtList = response.result;

                    this.districtList.map((item, index, array) => {
                        // 因为数组和对象更新后不会更新视图，这里必须用$set方法
                        this.$set(array[index], 'children', []);
                    });
                });
            },

            onSubmit() {
                this.$message.success('提交成功！');
            },

            handleItemChange(districtInfo) {

                if (districtInfo.length === 1) {
                    //如果点击一级菜单
                    let parentDistrictId = districtInfo[0];

                    this.districtList.map((item, index) => {

                        if (item.districtId === parentDistrictId && item.children.length === 0) {
                            //当上一级分类的的child为空时才请求数据
                            let params = { parentDistrictId: parentDistrictId };

                            getDistrictByParentDistrictId(params).then(response => {

                                this.$set(this.districtList[index], 'children', response.result);

                                item.children.map((innerItem, innerIndex) => {
                                    //二级分类下必须要设置一个空的child数组，不然点击@active-item-change没反应
                                    this.$set(item.children[innerIndex], 'children', []);
                                });
                            });
                        }
                    });

                } else if (districtInfo.length === 2) {
                    //如果点击二级菜单
                    let parentDistrictId = districtInfo[1];

                    this.districtList.map((item) => {

                        item.children.map((innerItem, innerIndex) => {

                            if (innerItem.districtId === parentDistrictId && innerItem.children.length === 0) {
                                //当上一级分类的的child为空时才请求数据
                                let params = { parentDistrictId: parentDistrictId };

                                getDistrictByParentDistrictId(params).then(response => {

                                    this.$set(item.children[innerIndex], 'children', response.result);
                                });
                            }
                        });
                    });

                } else {
                    console.log('暂时不支持此级别区域查询');
                }
            }
        }
    };

</script>