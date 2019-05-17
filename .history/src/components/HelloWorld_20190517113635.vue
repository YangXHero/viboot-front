<template>
  <div>
    <div class="uploadDiv1">
      <!-- <uploader
        ref="uploader"
        :options="uploadOptions1"
        :autoStart="true"
        @file-added="onFileAdded1"
        @file-success="onFileSuccess1"
        @file-progress="onFileProgress1"
        @file-error="onFileError1"
        class="uploader-app"
      >-->
      <uploader
        ref="uploader"
        :options="uploadOptions2"
        :autoStart="true"
        :files="files"
        @file-added="onFileAdded2"
        @file-success="onFileSuccess2"
        @file-progress="onFileProgress2"
        @file-error="onFileError2"
        class="uploader-app"
      >
        <uploader-unsupport></uploader-unsupport>
        <uploader-drop>
          <uploader-btn style="margin-right:20px;" :attrs="attrs">选择文件</uploader-btn>

          <uploader-btn :attrs="attrs" directory>选择文件夹</uploader-btn>
        </uploader-drop>
        <uploader-list v-show="panelShow">
                <div class="file-panel" slot-scope="props" :class="{'collapse': collapse}">
                    <div class="file-title">
                        <h2>文件列表</h2>
                        <div class="operate">
                            <el-button @click="fileListShow" type="text" :title="collapse ? '展开':'折叠' ">
                                <i class="iconfont" :class="collapse ? 'inuc-fullscreen': 'inuc-minus-round'"></i>
                            </el-button>
                            <el-button @click="close" type="text" title="关闭">
                                <i class="iconfont icon-close"></i>
                            </el-button>
                        </div>
                    </div>

                    <ul class="file-list">
                        <li v-for="file in props.fileList" :key="file.id">
                            <uploader-file :class="'file_' + file.id" ref="files" :file="file" :list="true"></uploader-file>
                        </li>
                        <div class="no-file" v-if="!props.fileList.length"><i class="iconfont icon-empty-file"></i> 暂无待上传文件</div>
                    </ul>
                </div>
            </uploader-list>
      </uploader>
    </div>
    <div class="uploadDiv2">
      <uploader
        ref="uploader"
        :options="uploadOptions2"
        :autoStart="true"
        :files="files"
        @file-added="onFileAdded2"
        @file-success="onFileSuccess2"
        @file-progress="onFileProgress2"
        @file-error="onFileError2"
        class="uploader-app"
      >
        <uploader-unsupport></uploader-unsupport>
        <uploader-drop>
          <uploader-btn :attrs="attrs">分块上传</uploader-btn>
        </uploader-drop><uploader-list v-show="panelShow">
                <div class="file-panel" slot-scope="props" :class="{'collapse': collapse}">
                    <div class="file-title">
                        <h2>文件列表</h2>
                        <div class="operate">
                            <el-button @click="fileListShow" type="text" :title="collapse ? '展开':'折叠' ">
                                <i class="iconfont" :class="collapse ? 'inuc-fullscreen': 'inuc-minus-round'"></i>
                            </el-button>
                            <el-button @click="close" type="text" title="关闭">
                                <i class="iconfont icon-close"></i>
                            </el-button>
                        </div>
                    </div>

                    <ul class="file-list">
                        <li v-for="file in props.fileList" :key="file.id">
                            <uploader-file :class="'file_' + file.id" ref="files" :file="file" :list="true"></uploader-file>
                        </li>
                        <div class="no-file" v-if="!props.fileList.length"><i class="iconfont icon-empty-file"></i> 暂无待上传文件</div>
                    </ul>
                </div>
            </uploader-list>
      </uploader>
    </div>
  </div>
</template>

<script>
import { merge, loginInterface } from "../api/upload";

import SparkMD5 from "spark-md5";

/* eslint-disable */
export default {
  name: "HelloWorld",
  data() {
    return {
      files: [],
      uploadOptions1: {
        target: "//localhost:8765/yzyjy/chunk",
        testChunks: false, //是否开启服务器分片校验
        fileParameterName: "file",
        headers: {},
        query() {},
        categaryMap: {
          image: ["gif", "jpg", "jpeg", "png", "bmp"]
        }
      },
      uploadOptions2: {
        target: "//localhost:8765/yzyjy/chunk",
        chunkSize: 2 * 1024 * 1024,
        testChunks: true,
        checkChunkUploadedByResponse: function(chunk, message) {
          let objMessage = JSON.parse(message);
          if (objMessage.data.skipUpload == 1) {
            console.log(objMessage.data.fileMap);
            return true;
          } else {
            let chunkNumbers = objMessage.data.chunkNumbers;
            console.log(objMessage);
            return (chunkNumbers || []).indexOf(chunk.offset + 1) >= 0;
          }
        },
        headers: {},
        query() {},
        categaryMap: {
          image: ["gif", "jpg", "jpeg", "png", "bmp"],
          zip: ["zip"],
          document: ["csv"]
        }
      },
      attrs: {},
      panelShow: false, //选择文件后，展示上传panel
      collapse: false
    };
  },
  created() {
    this.login();
  },
  methods: {
    login() {
      let formData = {
        username: "admin",
        password: "123456",
        rememberMe: "0",
        userType: "1"
      };
      loginInterface(formData).then(response => {
        console.log(response);
      });
    },
    onFileAdded1(file) {
      console.log(file);
    },
    onFileProgress1(rootFile, file, chunk) {},
    onFileSuccess1(rootFile, file, response, chunk) {},
    onFileError1(rootFile, file, response, chunk) {},
    onFileAdded2(file) {
      console.log(file);
      this.computeMD5(file);
    },
    onFileProgress2(rootFile, file, chunk) {},
    onFileSuccess2(rootFile, file, response, chunk) {
      let res = JSON.parse(response);
      console.log(res);
      if (res.code == 1) {
        return;
      }
      if (res.code == 205) {
        const formData = new FormData();
        formData.append("identifier", file.uniqueIdentifier);
        formData.append("filename", file.name);
        merge(formData).then(response => {
          console.log(response);
        });
      } else {
      }
    },
    onFileError2(rootFile, file, response, chunk) {
      this.$message({
        message: response,
        type: "error"
      });
    },
    /**
     * 计算md5，实现断点续传及秒传
     * @param file
     */
    computeMD5(file) {
      let fileReader = new FileReader();
      let time = new Date().getTime();
      let md5 = "";
      file.pause();
      fileReader.readAsArrayBuffer(file.file);
      fileReader.onload = e => {
        if (file.size != e.target.result.byteLength) {
          this.error(
            "Browser reported success but could not read the file until the end."
          );
          return;
        }
        md5 = SparkMD5.ArrayBuffer.hash(e.target.result);
        // 添加额外的参数
        this.uploader.opts.query = {
          ...this.params
        };
        console.log(
          `MD5计算完毕：${file.id} ${
            file.name
          } MD5：${md5} 用时：${new Date().getTime() - time} ms`
        );
        file.uniqueIdentifier = md5;
        file.resume();
      };
      fileReader.onerror = function() {
        this.error(
          "FileReader onerror was triggered, maybe the browser aborted due to high memory usage."
        );
      };
    }
  }
};
</script>