<template lang="pug">
dt#about {{ $t('setting__about') }}
dd
  .p.small
    strong YM Music
    |  是基于开源项目
    span.hover.underline(:aria-label="$t('setting__click_open')" @click="openUrl('https://github.com/lyswhut/lx-music-desktop#readme')")  LX Music
    |  fork 后继续调整的分支项目，主要目标是美化桌面端 UI、优化播放详情页、歌单、搜索、设置等界面体验。
  .p.small
    | 本分支更新与发布地址：
    span.hover.underline(:aria-label="$t('setting__click_open')" @click="openUrl('https://github.com/YM040923/lx-music-desktop/releases')") GitHub Releases
  .p.small
    | 项目源码地址：
    span.hover.underline(:aria-label="$t('setting__click_open')" @click="openUrl('https://github.com/YM040923/lx-music-desktop#readme')") https://github.com/YM040923/lx-music-desktop
  .p.small
    | 若遇到上游功能相关问题，可参考 LX Music 桌面版常见问题：
    span.hover.underline(:aria-label="$t('setting__click_open')" @click="openUrl('https://lyswhut.github.io/lx-music-doc/desktop/faq')") 桌面版常见问题
  .p.small
    | 与本分支 UI、美化、打包、更新相关的问题可到&nbsp;GitHub&nbsp;
    span.hover.underline(:aria-label="$t('setting__click_open')" @click="openUrl('https://github.com/YM040923/lx-music-desktop/issues?q=is%3Aissue+')") 提交&nbsp;Issue
    | 。
  br
  .p.small 本项目保持免费、开源，并遵循原项目的 Apache-2.0 许可证；内置音乐源、同步、下载等核心能力主要继承自 LX Music。
  .p.small
    | 目前 YM Music 分支的发布地址
    strong 只有&nbsp;GitHub
    | ，其他渠道均为第三方转载发布，可信度请自行鉴别。
  .p.small
    | 感谢 LX Music 原作者
    strong  落雪无痕
    |  及社区贡献者，本分支仅作为个人 fork 版本继续做界面方向的优化。

  .p.small
    | 你已签署本软件的
    base-btn(min @click="handleShowPact") 许可协议
    | ，原项目协议说明在
    strong.hover.underline(:aria-label="$t('setting__click_open')" @click="openUrl('https://github.com/lyswhut/lx-music-desktop#%E9%A1%B9%E7%9B%AE%E5%8D%8F%E8%AE%AE')") 这里
    | 。
  br

  .p.small
    | Fork UI branch by:&nbsp;
    strong YM040923
    |  / Original LX Music by:&nbsp;
    strong 落雪无痕
</template>

<script>
// import { ref, onBeforeUnmount } from '@common/utils/vueTools'
import { isShowPact } from '@renderer/store'
import { openUrl, clipboardWriteText } from '@common/utils/electron'

export default {
  name: 'SettingAbout',
  setup() {
    const handleShowPact = () => {
      isShowPact.value = true
    }
    return {
      openUrl,
      clipboardWriteText,
      handleShowPact,
    }
  },
}
</script>
