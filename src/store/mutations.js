const mutations = {
    //保存token
    COMMIT_TOKEN(state, token) {
        state.token = token;
    },
    //保存标签
    TAGES_LIST(state, arr) {
        state.tagsList = arr;
    },
    IS_COLLAPSE(state, bool) {
        state.isCollapse = bool;
    },
    SETLOGINUSER(state, user){
        state.loginUser = user;
    }
}
export default mutations