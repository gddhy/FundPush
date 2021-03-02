# 基金查询

利用Github Actions每天自动查询关注的基金并推送到微信

### Github Actions运行

Fork 仓库

在Settings-Secrets中添加 SECRET CORPID AGENTID ID 并填入对应值

启用 Actions

SECRET CORPID AGENTID在企业微信中申请，ID为基金id，可以添加多个，用英文逗号“,”隔开

登录企业微信，在企业微信里点击我的企业，最下面就是企业ID(CORPID)，secret 和 agentid 在 应用管理 - 创建应用就能看到

https://work.weixin.qq.com/wework_admin/frame#profile

若要修改定时触发时间，修改main.yml中的 cron 表达式


### 本地运行

安装NodeJs，执行
```
npm install --save request
```
创建Config目录

创建 SECRET CORPID AGENTID ID 四个文件，分别填入对应值
```
node main.js
```


### 新加的Webhook触发方式，参考

https://p3terx.com/archives/github-actions-manual-trigger.html
```
curl -X POST https://api.github.com/repos/:owner/:repo/dispatches \
    -H "Accept: application/vnd.github.everest-preview+json" \
    -H "Authorization: token ACTIONS_TRIGGER_TOKEN" \
    --data '{"event_type": "TRIGGER_KEYWORDS"}'
```

:owner - 用户名  
:repo - 需要触发的 Github Action 所在的仓库名称  
ACTIONS_TRIGGER_TOKEN - 带有 repo 权限的 Personal access token  
TRIGGER_KEYWORDS - 自定义 Webhook 事件名称，可以为任意值，Actions 列表中会显示此名称  