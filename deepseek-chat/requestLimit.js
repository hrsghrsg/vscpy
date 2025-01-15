// 请求限制相关功能
function getRequestsHistory() {
    const now = Date.now();
    const history = JSON.parse(localStorage.getItem('requestsHistory') || '[]');
    const recentHistory = history.filter(time => now - time < 3600000);
    localStorage.setItem('requestsHistory', JSON.stringify(recentHistory));
    return recentHistory;
}

function checkRequestLimit() {
    const history = getRequestsHistory();
    return history.length < MAX_REQUESTS_PER_HOUR;
}

function recordNewRequest() {
    const history = getRequestsHistory();
    history.push(Date.now());
    localStorage.setItem('requestsHistory', JSON.stringify(history));
}

function getRemainingRequests() {
    const history = getRequestsHistory();
    return MAX_REQUESTS_PER_HOUR - history.length;
} 