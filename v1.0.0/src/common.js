export const userTableHead = [{
    fixed: '',
    prop: 'id',
    title: 'ID',
    width: '',
},
{
    fixed: '',
    prop: 'account',
    title: '账户名',
    width: '',
},
{
    fixed: '',
    prop: 'name',
    title: '姓名',
    width: '',
},
// {
//     fixed: '',
//     prop: 'avatar',
//     title: '头像',
//     width: '',
// },
{
    fixed: '',
    prop: 'role',
    title: '角色',
    width: '',
},
{
    fixed: '',
    prop: 'createtime',
    title: '最后登录时间',
    width: '',
},
]

export const userTableHead2 = [{
    fixed: '',
    prop: 'id',
    title: 'ID',
    width: '',
},
{
    fixed: '',
    prop: 'account',
    title: '账户名',
    width: '',
},
{
    fixed: '',
    prop: 'name',
    title: '姓名',
    width: '',
},
{
    fixed: '',
    prop: 'avatar',
    title: '头像',
    width: '',
},
{
    fixed: '',
    prop: 'role',
    title: '角色',
    width: '',
},
{
    fixed: '',
    prop: 'createtime',
    title: '最后登录时间',
    width: '',
},
]


export const bankeTableHead = [{
    fixed: '',
    prop: 'id',
    title: 'ID',
    width: '',
},
{
    fixed: '',
    prop: 'name',
    title: '班课名',
    width: '',
},
{
    fixed: '',
    prop: 'membernum',
    title: '成员数',
    width: '',
},
{
    fixed: '',
    prop: 'teacher',
    title: '任课教师',
    width: '',
},
{
    fixed: '',
    prop: 'usercreatetime',
    title: '创建时间',
    width: '',
},
]
export const zuoyeTableHead = [{
    fixed: '',
    prop: 'id',
    title: 'ID',
    width: '',
},
{
    fixed: '',
    prop: 'name',
    title: '作业标题',
    width: '',
},
{
    fixed: '',
    prop: 'detaildesc',
    title: '详情',
    width: '',
},
// {
//     fixed: '',
//     prop: 'file',
//     title: '文件',
//     width: '',
// },
{
    fixed: '',
    prop: 'bankename',
    title: '发布班课',
    width: '',
},
{
    fixed: '',
    prop: 'createtime',
    title: '发布时间',
    width: '',
},
{
    fixed: '',
    prop: 'userid',
    title: '发布账户',
    width: '',
},
{
    fixed: '',
    prop: 'state',
    title: '状态',
    width: '',
},
{
    fixed: '',
    prop: 'answerdesc',
    title: '答案',
    width: '',
},
{
    fixed: '',
    prop: 'answerfile',
    title: '答案文件',
    width: '',
},
]
export const zuoyeSubmitTableHead = [{
    fixed: '',
    prop: 'id',
    title: 'ID',
    width: '',
},
{
    fixed: '',
    prop: 'account',
    title: '学生账户',
    width: '',
},
{
    fixed: '',
    prop: 'studentname',
    title: '学生姓名',
    width: '',
},
{
    fixed: '',
    prop: 'filetext',
    title: '提交文本',
    width: '',
},
// {
//     fixed: '',
//     prop: 'files',
//     title: '提交文件',
//     width: '',
// },
{
    fixed: '',
    prop: 'score',
    title: '评分',
    width: '',
},
{
    fixed: '',
    prop: 'commentnum',
    title: '评论数',
    width: '',
},
{
    fixed: '',
    prop: 'submitnum',
    title: '历史提交次数',
    width: '',
},
]
export const commentTableHead = [{
    fixed: '',
    prop: 'id',
    title: 'ID',
    width: '',
},
{
    fixed: '',
    prop: 'userid',
    title: '发言账户',
    width: '',
},
{
    fixed: '',
    prop: 'username',
    title: '发言姓名',
    width: '',
},
{
    fixed: '',
    prop: 'content',
    title: '发言内容',
    width: '',
},
{
    fixed: '',
    prop: 'createtime',
    title: '发言时间',
    width: '',
},
    // {
    //     fixed: '',
    //     prop: 'filepath',
    //     title: '关联的内容',
    //     width: '',
    // },
]
export const ansnwerTableHead = [{
    fixed: '',
    prop: 'id',
    title: 'ID',
    width: '',
},
{
    fixed: '',
    prop: 'fromuserid',
    title: '发言账户',
    width: '',
},
{
    fixed: '',
    prop: 'fromusername',
    title: '发言姓名',
    width: '',
},
{
    fixed: '',
    prop: 'content',
    title: '发言内容',
    width: '',
},
// {
//     fixed: '',
//     prop: 'filename',
//     title: '提交文件',
//     width: '',
// },
{
    fixed: '',
    prop: 'createtime',
    title: '发言时间',
    width: '',
},
{
    fixed: '',
    prop: 'tcommentid',
    title: '回复账户',
    width: '',
},
{
    fixed: '',
    prop: 'tousername',
    title: '回复姓名',
    width: '',
},
    // {
    //     fixed: '',
    //     prop: 'createtime',
    //     title: '相关评论',
    //     width: '',
    // },
]
export const roleType = [{
    role: 5,
    label: '学生'
},
{
    role: 10,
    label: '教师'
},
{
    role: 100,
    label: '管理员'
}
]

export const prefix = process.env.VUE_APP_HOST || "http://192.168.0.2:81";
export const filter = (v) => {
    if (!v.length) return;
    let key = Object.keys(v[0]);
    console.log(key);
    for (let i of key) {
        switch (i) {
            case 'state':
                for (let i of v) {
                    i.state == '100' ? i.state = '进行中' : i.state == '10' ? i.state = '已结束' : '未开始';
                }
            case 'score':
                for (let i of v) {
                    i.score > -1 ? i.score : (i.score = "未评分");
                }
            case 'role':
                for (let i of v) {
                    i.role == '100' ? i.role = '管理员' : i.role == '10' ? i.role = '教师' : i.role='学生';
                }
        }
    }

}