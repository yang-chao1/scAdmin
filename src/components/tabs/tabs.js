import {mapState,mapGetters,mapMutations} from 'vuex'
export default {
    computed: {
        ...mapState("tabs",['openTab']),
        // openTab(){
        //     return this.$store.state.tabs.openTab
        // },
        activeIndex:{
            get () {
                console.log(this.$store.state.tabs.activeIndex)
                return this.$store.state.tabs.activeIndex;
            },
            set (val) {
                console.log(val)
                this.set_active_index(val)
                // this.$store.commit('tabs/set_active_index', val);
            }
        }
    },
    mounted () {

        // 刷新时以当前路由做为tab加入tabs
        // 当前路由不是首页时，添加首页以及另一页到store里，并设置激活状态
        // 当当前路由是首页时，添加首页到store，并设置激活状态
        if(sessionStorage.getItem('tabs')) {
            const sessionTabs = JSON.parse(sessionStorage.getItem("tabs"))

            for (let i = 0; i < sessionTabs.length; i++) {
                this.add_tabs(sessionTabs[i])
                // this.$store.commit('add_tabs',sessionTabs[i]);
            }

        }else{

            this.add_tabs({route: this.$route.path , name: this.$route.name,meta:this.$route.meta });
            // this.$store.commit('add_tabs', {route: this.$route.path , name: this.$route.name,meta:this.$route.meta });
        }
        this.set_active_index(this.$route.path);

    },

    watch: {
        '$route'(to, from){
            // 判断路由是否已经打开
            // 已经打开的 ，将其置为active
            // 未打开的，将其放入队列里
            let flag = false;
            for(let item of this.openTab){
                if(item.name === to.name){
                    console.log('to.path', to.path);
                    // this.$store.commit('set_active_index', to.path)
                    this.set_active_index(to.path)
                    flag = true;
                    break;
                }
            }

            if(!flag) {
                console.log('11'+to.path)
                this.add_tabs( {route: to.path, name: to.name, meta:to.meta})
                this.set_active_index(to.path)
                // this.$store.commit('add_tabs', {route: to.path, name: to.name, meta:to.meta});
                // this.$store.commit('set_active_index', to.path);
            }
        }
    },

    methods: {
        ...mapMutations("tabs",['add_tabs','set_active_index']),
        //tab 的更多
        handleCommand(command) {
            // console.log(this.$refs.tabb0[0].$parent)
            if(command === 'cloneOther'){
                this.$store.commit('tabs/closeOther',{route: this.$route.path , name: this.$route.name,meta:this.$route.meta })
                // this.$router.push({path: this.activeIndex});
            }else {
                this.$store.commit('tabs/closeAll',{route: '/home', name: 'home', meta:{title:'首页',icon:'home'}})
                this.$router.push({path: '/home'});
            }
        },

        // tab标签点击时，切换相应的路由
        tabClick(tab) {
            console.log(this.activeIndex)
            this.$router.push({path: this.activeIndex});
        },

        // 移除tab标签
        tabRemove(targetName) {
            // 首页不删
            if(targetName == '/' || targetName == '/welcome'){
                return
            }

            this.$store.commit('tabs/delete_tabs', targetName);

            if (this.activeIndex === targetName) {
                // 设置当前激活的路由
                if (this.openTab && this.openTab.length >= 1) {
                    console.log('=============',this.openTab[this.openTab.length-1].route)
                    this.set_active_index( this.openTab[this.openTab.length-1].route)

                    this.$router.push({path: this.activeIndex});
                } else {
                    this.$router.push({path: '/'});
                }
            }
        }
    },
}
