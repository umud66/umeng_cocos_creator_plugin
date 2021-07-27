Editor.Panel.extend({
    style: `
        :host { margin: 5px; }
        h2 { color: #f90; }
    `,

    template: `
            <block v-for="(index,item) in curConfigs">
                <view style="display:flex;justify-content: space-between;padding:5px;">
                <ui-text class="flex-1">{{item.disname}}</ui-text>
                <!--<ui-input  v-value="curConfigs[index].umakey" />-->
                <ui-prop name="是否启用" type="boolean" v-value="curConfigs[index].enable" tooltip="是否启用"></ui-prop>
                </view>
            </block>
            <ui-button class="green end" style="right:0px" @click="checkForm">保存</ui-button>
    `,

    $: {
        btn: '#btn',
        label: '#label',
    },
  
    ready () {
        var path = require('path');
        var fs = require('fs');
        const app = new window.Vue({
            el:this.shadowRoot,
            data:{
                curConfigs : [],
                platforms : [{
                    disname:"oppo",
                    platform:"quickgame",
                  },
                  {
                    disname:"vivo",
                    platform:"qggame",
                  },
                  {
                    disname:"xiaomi",
                    platform:"xiaomi",
                  },
                  {
                    disname:"huawei",
                    platform:"huawei"
                  }]
            },
            methods:{
                saveConfig(){

                },
                checkForm(){
                    fs.writeFileSync(path.join(Editor.Project.path,"settings","uma.json"),JSON.stringify(this.curConfigs));
                    this.readConfig();
                },
                readConfig(){
                    let saveed = this.readFileToJson("settings","uma.json",[]);
                    let lastSelection = this.platforms;
                    saveed.forEach(it => {
                        for (let i = lastSelection.length -1; i >=0 ; i--) {
                            if(!lastSelection[i].umakey)
                                lastSelection[i].umakey = ""
                            if(!lastSelection[i].enable)
                                lastSelection[i].enable = false
                            if(lastSelection[i].disname == it.disname){
                                lastSelection[i].umakey = it.umakey
                                lastSelection[i].enable = it.enable
                                continue;
                            }
                        }
                    });
                    this.curConfigs = lastSelection
                },
                readFileToJson(filepath,filename,defaultValue = {}){
                    try{
                        let str = fs.readFileSync(path.join(Editor.Project.path,filepath,filename));
                      return JSON.parse(str)
                    }catch(e){
                      return defaultValue
                    }
                }
            }
        })
        app.readConfig();
    },
  });