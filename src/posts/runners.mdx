---
title: Gitlab-Runners 配置
---

# gitlab-runners 流程配置

项目部署的流程如下:

- 将项目打包(build)
- 启动 web 服务器（如 nginx）
- 将打包后的文件上传到 web 服务器的指定目录下
  例如：scp -r ./buildDir/\* 目标服务器名称@目标服务器 ip:目标服务器下 nginx 的 root 配置目录，在当前目录下执行
- 重启 nginx（或者其他 web 服务器）

gitlab-CICD 就是要将以上的流程自动化，推送项目代码之后就能自动执行这些流程步骤。

**使用 gitlab-runner 作为执行构建任务的执行器**

首先安装 gitlab-runner

1. bash 安装。2. docker 安装。3. 官网安装包下载

> bash 安装

```bash
# bash 安装
sudo apt-get update
sudo apt-get install gitlab-runner
```

> docker 安装

```bash
# docker 安装
# 拉取镜像
docker pull gitlab/gitlab-runner
# 启动容器
docker run -d --name gitlab-runner --restart always \
  -v /opt/gitlab-runner/config:/etc/gitlab-runner \
  -v /var/run/docker.sock:/var/run/docker.sock \
  gitlab/gitlab-runner:latest
# 进入容器
docker exec -it gitlab-runner bash
```

> 安装包安装

https://docs.gitlab.com/runner/install/linux-repository.html

```bash
# 版本较低
sudo wget -O /usr/local/bin/gitlab-runner https://gitlab-ci-multi-runner-downloads.s3.amazonaws.com/latest/binaries/gitlab-ci-multi-runner-linux-amd64

# 添加执行权限
sudo chmod +x /usr/local/bin/gitlab-runner
# 创建gitlab runner用户
sudo useradd --comment 'GitLab Runner' --create-home gitlab-runner --shell /bin/bash
```

> 注册 runner(可注册多个不同 token 的 runners)

```bash
注册gitlab runner
# 在容器内或者服务器内执行
sudo gitlab-runner register
# 注册过程需要提供一些信息
	- gitlab 实例的url
	- 注册token，可以在gitlab的runner设置页面中获取
	- runner的描述
	- runner的标签(tags)
	- 是否允许runner在没有tag的作业上运行

```

> 配置 gitlab-runner，在/etc/gitlab-runner/config.toml 文件中进行,主要配置一些并发作业数，日志级别等

> 启动 runner

```bash
sudo gitlab-runner start
sudo gitlab-runner restart
```

出现以下提示说明已经成功了

```bash
Runtime platform  arch=amd64 os=linux pid=55297 revision=656c1943 version=16.9.0
```

> 验证 runner 配置

```bash
sudo gitlab-runner verify
```

> runner 设置完成之后，进入到 gitlab，点击查看 CICD 部分，可以看到注册好的 runner，然后在项目中添加配置文件.gitlab-ci.yml

```yaml
stages: # List of stages for jobs, and their order of execution
  - install
  - build
  - deploy

variables:
  NPM_REGISTRY: https://registry.npm.taobao.org

cache:
  key: ${CI_COMMIT_REF_SLUG}
  paths:
    - node_modules/

install-job:
  stage: install
  # image: node:latest
  script:
    - echo "starting install packages"
    # - npm install
    - echo "Complete installed packages"
  only:
    - main # 仅在main分支部署

build-job: # This job runs in the build stage, which runs first.
  stage: build
  image: node:latest
  dependencies:
    - install-job # 确保在 build 之前运行 install 作业
  script:
    - echo "Start Building the code..."
    - npm install
    - npm run build
    - echo "Building Code complete."
  artifacts:
    paths:
      - out/
  only:
    - main # 仅在main分支部署

deploy-job: # This job runs in the deploy stage.
  stage: deploy # It only runs when *both* jobs in the test stage complete successfully.
  image: alpine:latest
  dependencies:
    - build-job
  before_script:
    - sed -i 's/dl-cdn.alpinelinux.org/mirrors.ustc.edu.cn/g' /etc/apk/repositories
    - apk update
    - apk add --no-cache openssh-client
    - mkdir -p ~/.ssh
    - chmod 700 ~/.ssh
    - echo "${SSH_PRIVATE_KEY}" > ~/.ssh/id_rsa
    - chmod 600 ~/.ssh/id_rsa
    - ls out/
  script:
    - echo "Deploying application..."
    - scp -r -o "StrictHostKeyChecking=no" ./out/* root@10.131.130.113:/home/wiki/
    - echo "Files copied, restarting Nginx..."
    - ssh -o "StrictHostKeyChecking=no" $SSH_ROOT@$SSH_HOST "sudo nginx -s reload"
    - echo "Application successfully deployed."
  only:
    - main # 仅在main分支部署
```

- 配置完成之后，通过 git push origin main 就会触发构建任务
  install → build → deploy

deploy 阶段有 scp 和 nginx restart 操作

scp 首先要在 alpine 镜像构建容器的时候先进行 ssh 密钥对认证

- 在容器内部新建.ssh 目录，
- 将 gitlab 的秘密变量私钥 SSH_PRIVATE_KEY 复制到.ssh/id_rsa 文件，
- 在部署服务器中的.ssh/authrization_key，添加对应的公钥，目的是为了 ssh 免密码登录

然后进行 scp 复制构建产物到服务器的对应目录

重启 web 服务器

gitlab-runner cicd 流程结束，代码部署成功

```bash
# nginx.conf示例
server {
        listen  8000;
        server_name     localhost;
        charset utf-8;
        #charset koi8-r;
        #access_log  logs/host.access.log  main;
        add_header Content-Security-Policy " object-src 'none'; script-'self' 'unsafe-inline' ";
        add_header  X-Frame-Options SAMEORIGIN;
        add_header X-Content-Type-Options nosniff;
        location / {
          root  /home/wiki; # /home/wiki 就是前端资源部署的位置
          try_files $uri $uri/ /index.html;
          index index.html index.htm;
        }
    }
```
