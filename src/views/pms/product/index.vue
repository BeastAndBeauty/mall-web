<template>
  <div class="app-container">
    <!-- 筛选搜索部分 -->
    <el-card class="filter-container" shadow="nerver">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button style="float:right" @click="handleSearchList()" type="primary" size="small">查询结果</el-button>
        <el-button
          style="float:right;margin-right:15px"
          @click="handleResetSearch()"
          size="small"
        >重置</el-button>
      </div>
      <div style="margin-top:15px">
        <!-- inline-使表单域变为行内的表单域 -->
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
          <el-form-item label="输入搜索：">
            <el-input style="width:203px" v-model="listQuery.keyword" placeholder="商品名称"></el-input>
          </el-form-item>
          <el-form-item label="商品货号：">
            <el-input style="width:203px" v-model="listQuery.productSn" placeholder="商品货号"></el-input>
          </el-form-item>
          <el-form-item label="商品分类：">
            <!-- clearable-设置输入框可清空 -->
            <!-- options-指定选项数组即可渲染出一个级联选择器 -->
            <el-cascader clearable v-model="selectProductCateValue" :options="productCateOptions"></el-cascader>
          </el-form-item>
          <el-form-item label="商品品牌：">
            <el-select v-model="listQuery.brandId" placeholder="请选择品牌" clearable>
              <el-option
                v-for="item in brandOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="上架状态：">
            <el-select v-model="listQuery.publishStatus" placeholder="全部" clearable>
              <el-option
                v-for="item in publishStatusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="审核状态：">
            <el-select v-model="listQuery.verifyStatus" placeholder="全部" clearable>
              <el-option
                v-for="item in verifyStatusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </el-card>

    <!-- 数据列表部分 -->
    <el-card class="operate-container" shadow="nerver">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-button class="btn-add" @click="handleAddProduct()" size="mini">添加</el-button>
    </el-card>

    <!-- ref="productTable" 应该可去除 -->
    <div class="table-container">
      <el-table
        ref="productTable"
        :data="list"
        style="width:100%"
        @selection-change="handleSelectionChange"
        border
      >
        <el-table-column type="selection" width="60" align="center"></el-table-column>
        <el-table-column label="编号" width="100" align="center">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column>
        <el-table-column label="商品图片" width="120" align="center">
          <template slot-scope="scope">
            <img style="height:80px" :src="scope.row.pic" />
          </template>
        </el-table-column>
        <el-table-column label="商品名称" align="center">
          <template slot-scope="scope">
            <p>{{scope.row.name}}</p>
            <p>品牌：{{scope.row.brandName}}</p>
          </template>
        </el-table-column>
        <el-table-column label="价格/货号" width="120" align="center">
          <template slot-scope="scope">
            <p>价格：￥{{scope.row.price}}</p>
            <p>货号：{{scope.row.productSn}}</p>
          </template>
        </el-table-column>
        <el-table-column label="标签" width="140" align="center">
          <template slot-scope="scope">
            <p>
              上架：
              <!-- 
                active-value--switch打开是的值 
                inactive-value--switch关闭时的值
              -->
              <el-switch
                @change="handlePublishStatusChange(scope.$index,scope.row)"
                :active-value="1"
                :inactive-value="0"
                v-model="scope.row.publishStatus"
              ></el-switch>
            </p>
            <p>
              新品：
              <el-switch
                @change="handleNewStatusChange(scope.$index,scope.row)"
                :active-value="1"
                :inactive-value="0"
                v-model="scope.row.newStatus"
              ></el-switch>
            </p>
            <p>
              推荐：
              <el-switch
                @change="handleRecommendStatusChange(scope.$index,scope.row)"
                :active-value="1"
                :inactive-value="0"
                v-model="scope.row.recommandStatus"
              ></el-switch>
            </p>
          </template>
        </el-table-column>
        <el-table-column label="排序" width="100" align="center">
          <template slot-scope="scope">{{scope.row.sort}}</template>
        </el-table-column>
        <el-table-column label="SKU库存" width="100" align="center">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              @click="handleShowSkuEditDialog(scope.$index,scope.row)"
              circle
            ></el-button>
          </template>
        </el-table-column>
        <el-table-column label="销量" width="100" align="center">
          <template slot-scope="scope">{{scope.row.sale}}</template>
        </el-table-column>
        <el-table-column label="审核状态" width="100" align="center">
          <template slot-scope="scope">
            <p>{{scope.row.verifyStatus | verifyStatusFilter}}</p>
            <p>
              <el-button type="text" @click="handleShowVerifyDetail(scope.$index,scope.row)">审核详情</el-button>
            </p>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160" align="center">
          <template slot-scope="scope">
            <p>
              <el-button size="mini" @click="handleShowProduct(scope.$index,scope.row)">查看</el-button>
              <el-button size="mini" @click="handleUpdateProduct(scope.$index,scope.row)">编辑</el-button>
            </p>
            <p>
              <el-button size="mini" @click="handleShowLog(scope.$index,scope.row)">日志</el-button>
              <el-button size="mini" type="danger" @click="handleDelete(scope.$index,scope.row)">删除</el-button>
            </p>
          </template>
        </el-table-column>
      </el-table>

      <!-- 批量操作 -->
      <div class="batch-operate-container">
        <el-select size="small" v-model="operateType" placeholder="批量操作">
          <el-option
            v-for="item in operates"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-button
          style="margin-left:20px"
          class="search-button"
          @click="handleBatchOperate()"
          type="primary"
          size="small"
        >确定</el-button>
      </div>

      <!-- pagination -->
      <div class="pagination-container">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          layout="total,sizes,prev,pager,next,jumper"
          :page-size="listQuery.pageSize"
          :page-sizes="[5,10,15]"
          :current-page.sync="listQuery.pageNum"
          :total="total"
        ></el-pagination>
      </div>

      <!-- 点击编辑，弹出的dialog -->
      <el-dialog title="编辑货品信息" :visible.sync="editSkuInfo.dialogVisible" width="40%">
        <span>商品货号：</span>
        <span>{{editSkuInfo.productSn}}</span>
        <el-input
          placeholder="按sku编号搜索"
          v-model="editSkuInfo.keyword"
          size="small"
          style="width:50%;margin-left:20px"
        >
          <el-button slot="append" icon="el-icon-search" @click="handleSearchEditSku"></el-button>
        </el-input>
        <el-table style="width:100%;margin-top:20px" :data="editSkuInfo.stockList" border>
          <el-table-column label="SKU编号" align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.skuCode"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            v-for="(item,index) in editSkuInfo.productAttr"
            :label="item.name"
            :key="item.id"
            align="center"
          >
            <template slot-scope="scope">{{getProductSkuSp(scope.row,index)}}</template>
          </el-table-column>
          <el-table-column label="销售价格" width="80" align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.price"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="商品库存" width="80" align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.stock"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="库存预警值" width="100" align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.lowStock"></el-input>
            </template>
          </el-table-column>
        </el-table>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editSkuInfo.dialogVisible=false">取消</el-button>
          <el-button type="primary" @click="handleEditSkuConfirm">确定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  fetchList,
  updateDeleteStatus,
  updateNewStatus,
  updateRecommendStatus,
  updatePublishStatus
} from "@/api/product";
import { fetchListWithChildren } from "@/api/productCate";
import { fetchList as fetchBrandList } from "@/api/brand";
import {
  fetchList as fetchSkuStockList,
  update as updateSkuStockList
} from "@/api/skuStock";
import { fetchList as fetchProductAttrList } from "@/api/productAttr";

const defaultListQuery = {
  ketword: null,
  pageNum: 1,
  pageSize: 5,
  publishStatus: null,
  verifyStatus: null,
  productSn: null,
  productCategoryId: null,
  brandId: null
};

const publishStatusOptions = [
  {
    value: 1,
    label: "上架"
  },
  {
    value: 0,
    label: "下架"
  }
];

const verifyStatusOptions = [
  {
    value: 1,
    label: "审核通过"
  },
  {
    value: 0,
    label: "未审核"
  }
];

const editSkuInfo = {
  dialogVisible: false,
  productId: null,
  productSn: "",
  productAttributeCategoryId: null,
  stockList: [],
  productAttr: [],
  keyword: null
};

const operates = [
  {
    label: "商品上架",
    value: "publishOn"
  },
  {
    label: "商品下架",
    value: "publishOff"
  },
  {
    label: "设为推荐",
    value: "recommendOn"
  },
  {
    label: "取消推荐",
    value: "recommentOff"
  },
  {
    label: "设为新品",
    value: "newOn"
  },
  {
    label: "转移到分类",
    value: "transferCategory"
  },
  {
    label: "移入回收站",
    value: "recycle"
  }
];

export default {
  name: "pms",
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      listLoading: true,
      list: null,
      total: null,
      selectProductCateValue: null,
      productCateOptions: [],
      brandOptions: [],
      publishStatusOptions,
      verifyStatusOptions,
      editSkuInfo,
      multipleSelection: [],
      operateType: null,
      operates
    };
  },
  created() {
    this.getList();
    this.getProductCateList();
    this.getBrandList();
  },
  filters: {
    verifyStatusFilter(value) {
      if (value === 1) {
        return "审核通过";
      } else {
        return "未审核";
      }
    }
  },
  methods: {
    handleSearchList() {
      this.listQuery.pageNum = 1;
      this.getList();
    },
    handleResetSearch() {
      this.selectProductCateValue = [];
      //Object.assign方法用于对象的合并，将源对象的所有可枚举属性，复制到目标对象
      this.listQuery = Object.assign({}, defaultListQuery);
    },
    //获取商品列表
    getList() {
      this.listLoading = true;
      fetchList(this.listQuery).then(response => {
        // console.log(response);
        this.listLoading = false;
        this.list = response.data.list;
        this.total = response.data.total;
      });
    },
    //获取商品分类列表
    getProductCateList() {
      fetchListWithChildren().then(response => {
        // console.log(response);
        let list = response.data;
        this.productDateOptions = [];
        for (let i = 0; i < list.length; i++) {
          let children = [];
          if (list[i].children != null && list[i].children.length > 0) {
            for (let j = 0; j < list[i].children.length; j++) {
              children.push({
                label: list[i].children[j].name,
                value: list[i].children[j].id
              });
            }
          }
          this.productCateOptions.push({
            label: list[i].name,
            value: list[i].id,
            children: children
          });
        }
      });
    },
    //获取商品品牌列表
    getBrandList() {
      fetchBrandList({ pageNum: 1, pageSize: 100 }).then(response => {
        // console.log(response);
        this.brandOptions = [];
        let brandList = response.data.list;
        for (let i = 0; i < brandList.length; i++) {
          this.brandOptions.push({
            label: brandList[i].name,
            value: brandList[i].id
          });
        }
      });
    },
    //添加商品
    handleAddProduct() {
      this.$router.push({ path: "/pms/addProduct" });
    },
    //当选择项发生变化
    handleSelectionChange(val) {
      this.multipleSelection = val;
      // console.log(val)
    },
    //上架switch
    handlePublishStatusChange(index, row) {
      let ids = [];
      ids.push(row.id);
      this.updatePublishStatus(row.publishStatus, ids);
    },
    updatePublishStatus(publishStatus, ids) {
      let params = new URLSearchParams();
      params.append("ids", ids);
      params.append("publishStatus", publishStatus);
      updatePublishStatus(params).then(response => {
        this.$message({
          message: "修改成功",
          type: "success",
          duration: 1000
        });
      });
    },
    //新品switch
    handleNewStatusChange(index, row) {
      let ids = [];
      ids.push(row.id);
      this.updatePublishStatus(row.publishStatus, ids);
    },
    updateNewStatus(newStatus, ids) {
      let params = new URLSearchParams();
      params.append("ids", ids);
      params.append("newStatus", newStatus);
      updateNewStatus(params).then(response => {
        this.$message({
          message: "修改成功",
          type: "success",
          duration: 1000
        });
      });
    },
    //推荐switch
    handleRecommendStatusChange(index, row) {
      let ids = [];
      ids.push(row.id);
      this.updateRecommendStatus(row.recommandStatus, ids);
    },
    updateRecommendStatus(recommendStatus, ids) {
      let params = new URLSearchParams();
      params.append("ids", ids);
      params.append("recommendStatus", recommendStatus);
      updateRecommendStatus(params).then(response => {
        this.$message({
          message: "修改成功",
          type: "success",
          duration: 1000
        });
      });
    },
    //查看详情
    handleShowVerifyDetail(index, row) {
      this.$message({
        message: "该功能待开发",
        type: "warning",
        duration: 1000
      });
    },
    //查看button
    handleShowProduct(index, row) {
      this.$message({
        message: "该功能待开发",
        type: "warning",
        duration: 1000
      });
    },
    //编辑button
    handleUpdateProduct(index, row) {
      this.$router.push({ path: "/pms/updateProduct", query: { id: row.id } });
    },
    //日志button
    handleShowLog(index, row) {
      this.$message({
        message: "该功能待开发",
        type: "warning",
        duration: 1000
      });
    },
    //删除button
    handleDelete(index, row) {
      this.$confirm("是否要进行删除操作？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        let ids = [];
        ids.push(row.id);
        this.updateDeleteStatus(1, ids);
      });
    },
    updateDeleteStatus(deleteStatus, ids) {
      let params = new URLSearchParams();
      params.append("ids", ids);
      params.append("deleteStatus", deleteStatus);
      updateDeleteStatus(params).then(response => {
        this.$message({
          message: "删除成功",
          type: "success",
          duration: 1000
        });
      });
    },
    //批量操作
    handleBatchOperate() {
      if (this.operateType == null) {
        this.$message({
          message: "请选择操作类型",
          type: "warning",
          duration: 1000
        });
        return;
      }
      if (this.multipleSelection == null || this.multipleSelection.length < 1) {
        this.$message({
          message: "请选择要操作的商品",
          type: "warning",
          duration: 1000
        });
        return;
      }
      this.$confirm("是否要进行该批量操作？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        let ids = [];
        for (let i = 0; i < this.multipleSelection.length; i++) {
          ids.push(this.multipleSelection[i].id);
        }
        switch (this.operateType) {
          case this.operates[0].value:
            this.updatePublishStatus(1, ids);
            break;
          case this.operates[1].value:
            this.updatePublishStatus(0, ids);
            break;
          case this.operates[2].value:
            this.updateRecommendStatus(1, ids);
            break;
          case this.operates[3].value:
            this.updateRecommendStatus(0, ids);
            break;
          case this.operates[4].value:
            this.updateNewStatus(1, ids);
            break;
          case this.operates[5].value:
            this.updateNewStatus(0, ids);
            break;
          case this.operates[6].value:
            break;
          case this.operates[7].value:
            this.updateDeleteStatus(1, ids);
            break;
          default:
            break;
        }
      });
    },
    handleSizeChange(val) {
      this.listQuery.pageNum = 1;
      this.listQuery.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val;
      this.getList();
    },
    //显示库存编辑dialog
    handleShowSkuEditDialog(index, row) {
      this.editSkuInfo.dialogVisible = true;
      this.editSkuInfo.productId = row.id;
      this.editSkuInfo.productSn = row.productSn;
      this.editSkuInfo.productAttributeCategoryId =
        row.productAttributeCategoryId;
      this.editSkuInfo.keyword = null;
      fetchSkuStockList(row.id, { ketword: this.editSkuInfo.keyword }).then(
        response => {
          this.editSkuInfo.stockList = response.data;
        }
      );
      fetchProductAttrList(row.productAttributeCategoryId, { type: 0 }).then(
        response => {
          this.editSkuInfo.productAttr = response.data.list;
        }
      );
    },
    handleSearchEditSku() {
      fetchSkuStockList(this.editSkuInfo.productId, {
        keyword: this.editSkuInfo.keyword
      }).then(response => {
        this.editSkuInfo.stockList = response.data;
      });
    },
    getProductSkuSp(row, index) {
      if (index === 0) {
        return row.sp1;
      } else if (index === 1) {
        return row.sp2;
      } else {
        return row.sp3;
      }
    },
    handleEditSkuConfirm() {
      if (
        this.editSkuInfo.stockList == null ||
        this.editSkuInfo.stockList.length <= 0
      ) {
        this.$message({
          message: "暂无shu消息",
          type: "warning",
          duration: 1000
        });
        return;
      }
      this.$confirm("是否要进行修改", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        updateSkuStockList(
          this.editSkuInfo.productId,
          this.editSkuInfo.stockList
        ).then(response => {
          this.$message({
            message: "修改成功",
            type: "success",
            duration: 1000
          });
          this.editSkuInfo.dialogVisible = false;
        });
      });
    }
  }
};
</script>

<style scope>
</style>