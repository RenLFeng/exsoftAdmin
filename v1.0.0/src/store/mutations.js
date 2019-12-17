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
    },
    SET_CLASS_ID(state, id){
        state.ClassID = id;
    },
    SET_CLASS_TITLE_INFO(state,obj){
        state.ClassTitleInfo = obj;
    },
    SET_CLOUD(state,v){
        state.isCloud = v;
    },
}
export default mutations