<template>
<div>
  <Video :videoList="videos"/>
  <span v-once>URL: {{debug}}</span>
</div>
</template>

<script>
import Video from "@/components/Video.vue"

export default {
  components: {
    Video
  },
  head: {
    title: "Home"
  },
  data() {
    return {
      videos: []
    }
  },
  async fetch() {
    var baseUrl = process.browser ? window.location.hostname : "192.168.1.13"
    this.debug = baseUrl
    this.videos = await fetch(
      `http://localhost/videos`
    ).then(res => res.json())
  }
}
</script>