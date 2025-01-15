/**
 * 主脚本文件
 * 
 * 功能：
 * 1. 整合各个模块
 * 2. 初始化应用
 * 3. 事件监听
 */

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    initializeData();
    
    // 添加事件监听
    document.getElementById('addForm')
        .addEventListener('submit', handleFormSubmit);
}); 