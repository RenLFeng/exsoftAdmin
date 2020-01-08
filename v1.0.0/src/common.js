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
    title: '昵称',
    width: '',
},
{
    fixed: '',
    prop: 'roledesc',
    title: '角色',
    width: '',
},
{
    fixed: '',
    prop: 'activetime',
    title: '最后登录时间',
    width: '',
},
]




export const schoolTableHead = [{
    fixed: '',
    prop: 'id',
    title: 'ID',
    width: '',
},
    {
        fixed: '',
        prop: 'name',
        title: '学校名',
        width: '',
    },
    {
        fixed: '',
        prop: 'useraccount',
        title: '校管理员',
        width: '',
    },

    {
        fixed: '',
        prop: 'createtime',
        title: '创建时间',
        width: '',
    },
    {
        fixed:'',
        prop:'statesdesc',
        title:'状态',
        width:'',
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
    {
        fixed: '',
        prop: 'schoolid',
        title: '学校ID',
        width: '',
    },
    {
        fixed: '',
        prop: 'states',
        title: '状态',
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
// {
//     fixed: '',
//     prop: 'userid',
//     title: '发布账户',
//     width: '',
// },
    {
        fixed:'',
        prop:'submitdesc',
        title:'提交统计',
        width:'',
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
// {
//     fixed: '',
//     prop: 'fromuserid',
//     title: '发言账户',
//     width: '',
// },
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
        role:50,
        label:'校管理员'
    },
{
    role: 100,
    label: '管理员'
}
]

export const schoolroleType = [{
    role: 5,
    label: '学生'
},
    {
        role: 10,
        label: '教师'
    }
]


export const prefix = process.env.VUE_APP_HOST || "http://192.168.0.2:81";
export const filter = (v) => {
    if (!v.length) return v;
    let key = Object.keys(v[0]);
    console.log(key);
    for (let i of key) {
        switch (i) {
            case 'state':
                for (let i of v) {
                    i.state == '100' ? i.state = '进行中' : i.state == '10' ? i.state = '已结束' : '未开始';
                }
                break;
            case 'submitnum':
                for(let li of v){
                    li.submitdesc = '';
                    li.submitdesc = li.submitnum + '/' + li.membernum
                }
                break;
            case 'score':
                for (let i of v) {
                    i.score > -1 ? i.score : (i.score = "未评分");
                }
                break;
            case 'states':
                //! 班课状态
                for(let li of v){
                    if (li[i] > 0){
                        li[i] =  '进行中';
                    }
                    else{
                        li[i] =  '已结束';
                    }
                }
                break;
            case 'accountid':
                for(let li of v){
                    if (li.accountid == 1){
                        li.account = '微信账户'
                    }
                }
                break;
            case 'schoolrole':{
                for(let li of v){
                    for(let j=0; j<roleType.length; j++){
                        // console.log(v);
                        if (li[i] == roleType[j].role){
                            li['roledesc'] = roleType[j].label;
                            break;
                        }
                    }
                }
            }
            break;
            case 'role':
                // for (let i of ) {
                //     i.role == '100' ? i.role = '管理员' : i.role == '10' ? i.role = '教师' : i.role='学生';
                // }
                for(let li of v){
                    for(let j=0; j<roleType.length; j++){
                        // console.log(v);
                        if (li[i] == roleType[j].role){
                            li['roledesc'] = roleType[j].label;
                            break;
                        }
                    }
                }
                break;
        }
    }
    return v;
}