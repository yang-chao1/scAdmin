const tabs = {
    namespaced:true,
    state:{
        openTab:[] ,//所有打开的路由
        activeIndex:'/home' //激活状态
    },

    mutations:{
        // 添加tabs
        add_tabs (state, data) {
            console.log(111)
            state.openTab.push(data);
            let s=JSON.stringify( state.openTab)
            sessionStorage.setItem('tabs',s)
        },
        // 删除tabs
        delete_tabs (state, route) {
            let index = 0;
            for (let option of state.openTab) {
                if (option.route === route) {
                    break;
                }
                index++;
            }
            state.openTab.splice(index, 1);
            let s=JSON.stringify( state.openTab)
            sessionStorage.setItem('tabs',s)
        },
        // 设置当前激活的tab
        set_active_index (state, index) {
            state.activeIndex = index;
        },


        //关闭其他标签
        closeOther(state,data) {
            //如果只有首页，那么就不用加自己
            let arr=JSON.parse(sessionStorage.getItem('tabs'))
            if(arr.length===1){
                state.openTab=[],
                state.openTab.push(data);
                let s = JSON.stringify(state.openTab)
                sessionStorage.setItem('tabs', s)
                return
            }
            state.openTab=[],
            state.openTab.push({route: '/home', name: 'home',meta:{title:'首页',icon:'home'}});
            state.openTab.push(data);
            let s = JSON.stringify(state.openTab)
            sessionStorage.setItem('tabs', s)
        },
        //   //关闭所有
        closeAll(state,data){
            state.openTab=[data];
            let s = JSON.stringify(state.openTab)
            sessionStorage.setItem('tabs', s)
        },
    },


    active:{

    },

}

export default tabs
