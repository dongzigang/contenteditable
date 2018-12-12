/**
 * 处理div模拟输入框光标问题
 * */
function handle(id) {
    let target = document.getElementById(id);
    // 定义最后光标对象
    let lastEditRange = null;
    // 编辑框点击事件
    target.onclick = function() {
        // 获取选定对象
        let selection = getSelection()
        // 设置最后光标对象
        lastEditRange = selection.getRangeAt(0)
    }
    // 编辑框按键弹起事件
    target.onkeyup = function() {
        // 获取选定对象
        let selection = getSelection()
        // 设置最后光标对象
        lastEditRange = selection.getRangeAt(0)
    }
}
export default handle