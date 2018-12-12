<!-- 聊天 -->
<template>
    <div id="chat" class="chat">
        <!--头部信息区-->
        <div class="chat-title">
            <i class="el-icon-service chat-title-icon"></i>
            <div class="chat-title-main">
                <p>
                    <span class="color-theme">未知用户</span>&nbsp;&nbsp;&nbsp;&nbsp;
                    正在浏览页面 <span class="color-theme">无</span>
                </p>
                <p>
                    访问：<span class="color-theme">0</span>次&nbsp;&nbsp;&nbsp;&nbsp;
                    对话：<span class="color-theme">0</span>次&nbsp;&nbsp;&nbsp;&nbsp;
                    IP：<span class="color-theme">未知</span>&nbsp;&nbsp;&nbsp;&nbsp;
                    来源：<span class="color-theme">未知</span>
                </p>
            </div>
        </div>
        <!-- 聊天框 -->
        <div class="chat-content">
            <div v-for="item in chatRecord">
                <!-- 客服文字 -->
                <div v-if="item.type==1" class='iSay cha-content'>
                    <span class='myContent' v-html="item.content"></span>
                    <div class="userHeader">
                        <img src="../../assets/images/head.jpg" alt="" class="my-head">
                    </div>
                </div>
                <!-- 客服图片 -->
                <div v-else-if="item.type==2" class='iSay iSayImage  cha-content'>
                    <div class='image-ctn'>
                        <img class='chat-image' :src='item.content'  @click='showBig'>
                    </div>
                    <div class="userHeader">
                        <img src="../../assets/images/head.jpg" alt="" class="my-head">
                    </div>
                </div>
                <!-- 客服推送门店 -->
                <div v-else-if="item.type==7" class='iSay otherPushShop cha-content'>
                    <div class="userHeader">
                        <img src="../../assets/images/head.jpg" alt="" class="my-head">
                    </div>
                    <div class='pushShopCtn'>
                        <div class='shop-name border-bottom'>王思聪汽修店</div>
                        <div class='cover-ctn'>
                            <img src='/static/images/cover.jpg' class='cover' mode='widthFix'>
                        </div>
                        <div class='mdxq'>
                            门店详情
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!--输入操作区-->
        <div class="chat-input">
            <div class="chat-options">
                <img src="../../assets/images/zhuanj.png" alt="" title="转接客服" @click="transfer">
                <img src="../../assets/images/pingb.png" alt="" title="屏蔽访客">
                <img src="../../assets/images/biaoq.png" alt="" title="表情" @click.stop="showEmotion">
                <img src="../../assets/images/pic.png" alt="" title="发送图片" @click="chooseImg">
                <input type="file"  accept="image/*" style="display: none" id="chooseImgBtn" @change="uploadImg">
            </div>
            <div>
                <!--div 模拟的输入框 -->
                <pre class="input-box" contenteditable id="input-box" @keyup.enter="send" @input="inputContent"></pre>
            </div>
            <div class="send-ctn">
                <el-button size="mini" plain @click="getPush">模拟接受消息推送</el-button>
                <el-button size="mini">结束对话</el-button>
                <el-button size="mini" type="primary" @click="send">发送</el-button>
            </div>
        </div>
        <!--客服转接弹出窗-->
        <el-dialog
                title="客服转接"
                :visible.sync="showTransfer"
                width="66%"
        >
            <div class="transfer-content">
                <div class="transfer-search">
                    <el-input placeholder="搜索客服" class="search-input"></el-input>
                </div>
                <div class="main-ctn">
                    <div class="kf-list-ctn">
                        <div class="main-ctn-title">客服列表</div>
                        <div class="kf-list">
                            <div class="kf-item" v-for="item in kfList" :key="item">
                                <img src="../../assets/images/header.png" alt="">
                                <span class="kf-name">张三</span>
                                <span class="kf-remark">cfo</span>
                            </div>
                        </div>
                    </div>
                    <div class="trans-reason-ctn">
                        <div class="main-ctn-title">事由</div>
                        <div class="trans-reason">
                            <textarea>

                            </textarea>
                        </div>
                    </div>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="medium" @click="transferHandle(0)">取 消</el-button>
                <el-button size="medium" type="primary" @click="transferHandle(1)">确 定</el-button>
            </span>
        </el-dialog>
        <!--表情包-->
        <div class="emoji" id="emoji" v-show="isEmotionShow">
            <span v-for="item in emotions" :key="item.url">
                <img :src="item.url" class="img emoji-item" @click="change(item)">
            </span>
        </div>
    </div>
</template>
<script>
    import {emojidbs} from '../../../public/libs/vue-emoji/emojidb'
    import uploadFile from '../../assets/js/uploadFile'
    import contenteditableHandle from '../../assets/js/contenteditableHandle'
    export default {
        name: 'chat',
        components: {

        },
        data() {
            return {
                voiceList: {}, // 聊天语音列表
                chatType: 1, // 1为文字  2为语音
                inputValue: "", // 发送内容
                chatRecord: [], // 聊天信息
                isEmotionShow:false,
                emotions: emojidbs,
                emotion: '',
                emotionsrc: "",
                showTransfer: false,  // 是否显示dialog
                kfList: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]           //转接客服列表
            }
        },
        mounted() {
            let that = this
            window.onclick = function () {
                that.isEmotionShow = false
            }
            contenteditableHandle('input-box')
        },
        methods: {
            // 监听input事件获取输入值
            inputContent (){
                this.inputValue = document.getElementById('input-box').innerHTML
            },
            // 选择表情包
            change(item) {
                console.log(item)
                // 选完表情后手工实现一次双向绑定
                document.getElementById('input-box').innerHTML=`${this.inputValue}`+`<img src="${item.url}">`
                this.inputValue +=`<img src="${item.url}">`
            },
            //点击选择图片按钮
            chooseImg(){
                let btn = document.getElementById('chooseImgBtn')
                btn.click()
            },
            // 点击发送按钮
            send: function() {
                let content = document.getElementById('input-box').innerHTML
                let _chatRecord = this.chatRecord
                let _data = {
                    content: content,
                    type: 1
                }
                _chatRecord.push(_data)
                // 发送后清空
                this.inputValue = ''
                document.getElementById('input-box').innerHTML= ''
            },
            // 发送图片
            uploadImg(){
                uploadFile({
                    id: 'chooseImgBtn',  // 上传按钮id
                    url: '',
                    type: 'jpg,png,jpeg,gif',  // 上传文件的后缀名,用英文逗号隔开
                    maxSzie: 20 * 1024,       // 文件最大大小，单位KB
                    progressCtn:'',  // 显示进度条的容器id，样式自己写
                    nameMaxLen:80,    //名字最长字符数
                    data: {   // 要带过去的参数

                    },
                    // 上传成功后执行
                    success: function () {

                    }
                })
            },
            // 显示表情包
            showEmotion(){
                this.isEmotionShow = true
            },
            // 客服转接
            transfer() {
                this.showTransfer = true
            },

            transferHandle(type) {
                if (type == 0) {
                    this.showTransfer = false
                }
                else {
                    this.$message({
                        showClose: true,
                        message: '转接客服成功',
                        type: 'success'
                    });
                    setTimeout(() => {
                        this.showTransfer = false
                    }, 1000)
                }
            },
            // 获取推送消息
            getPush() {
                this.$notify({
                    title: '提示',
                    message: '这是一条不会自动关闭的消息',
                    duration: 0
                });
            }
        }
    }
</script>
<style lang="less" scoped>
    .emoji {
        position: absolute;
        top: 108px;
        left: 20px;
        width: 600px;
        z-index: 999;
        background: @border2Color;
        padding: 10px;
        border: 1px;
        border-radius:10px ;
    }
    .chat {
        position: relative;
        height: 100%;
    }

    .chat-title {
        display: flex;
        align-items: center;
        padding: 10px 20px;
        background: @border4Color;
    }

    .chat-title-icon {
        font-size: @font-lg;
        margin-right: 20px;
    }

    .chat-title-main {
        line-height: 1.5em;
    }

    .chat-content {
        position: absolute;
        width: 100%;
        height: calc(100% - 220px);
        top: 62px;
        left: 0;
        right: 0;
        bottom: 30px;
        padding: 20px 20px 0;
        overflow: auto;
    }

    .chat-input {
        position: absolute;
        width: 100%;
        height: 156px;
        left: 0;
        bottom: 0;
        border-top: 1px solid @border1Color;
    }

    .chat-options {
        display: flex;
        align-items: center;
        height: 30px;
        padding: 0 20px;
        background: @border4Color;
        img {
            width: 16px;
            height: 16px;
            margin-right: 20px;
            cursor: pointer;
        }
    }

    .input-box {
        position: absolute;
        width: 100%;
        height: calc(100% - 70px);
        top: 30px;
        left: 0;
        right: 0;
        bottom: 30px;
        overflow: auto;
        box-sizing: border-box;
        resize: none;
        border: none;
    }

    .send-ctn {
        position: absolute;
        width: 100%;
        height: 39px;
        left: 0;
        bottom: 0;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        padding-right: 10px;
        border-top: 1px solid @border2Color;
    }

    .transfer-search {

    }

    .search-input {
        width: 50%;
    }

    .transfer-content {
        .main-ctn {
            display: flex;
            justify-content: space-between;
            > div {
                width: 49%;
                border-radius: 5px;
            }
        }
    }

    .kf-list, .trans-reason {
        border: 1px solid @border4Color;
        height: 350px;
        overflow: auto;
    }

    .main-ctn-title {
        font-size: @font-sm;
        padding: 10px 0;
    }

    .kf-item {
        display: flex;
        height: 56px;
        padding-left: 20px;
        align-items: center;
        cursor: pointer;
        &:hover {
            background: @border4Color;
        }
        img {
            width: 20px;
            height: 20px;
            margin-right: 10px;
        }
        .kf-name {
            display: inline-block;
            width: 80px;
        }
        .kf-remark {

        }
    }

    .trans-reason {
        textarea {
            width: 100%;
            height: 100%;
            resize: none;
            border: none;
            padding: 10px;
        }
    }
    .emoji-item {
        cursor: pointer;
        background:@border1Color;
    }



    /***************************/
    .iSay {
        display: flex;
        justify-content: flex-end;
        align-items: center;
    }
    .cha-content {
        margin-bottom: 15px;
        position: relative;
    }
    .my-head {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        border: 2px solid @border4Color;
    }
    .myContent {
        margin-right: 10px;
        background: @theme;
        color: white;
        border-radius: 5px;
        padding: 12px 10px;
        position:relative;
        max-width: 300px;

        &:after {
            display:block;
            content:'';
            border-width:8px 8px 8px 8px;
            border-style:solid;
            border-color:transparent transparent  transparent @theme;

            /* 定位 */
            position:absolute;
            right:-16px;
            top:50%;
            transform: translate(0,-50%);
        }
    }
</style>