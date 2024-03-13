<template>
<div>
  <div class="container">
    <div
    v-for="(video, id) in videoList"
    :key="id"
    class="vid-con">
    <NuxtLink :to="`/player/${video.id}`">
    <div class="vid"></div>
    <div class="movie-info">
      <div class="details">
      <h2>{{video.id}}.mp4</h2>
      </div>
    </div>
  </NuxtLink>
  </div>
  </div>
</div>
</template>

<script>
export default {
    props:['videoList'],
}
</script>
<style scoped>
.container{
  /* display: flex;
  justify-content: left;
  align-items: left;  */
  position: relative;
  margin: 0 auto;
}
.vid-con{
  width:50%;
  max-width: 16rem;
  margin: auto 2em;
  
}
.vid{
  /* height:15rem; */
  width:100%;
}
.movie-info{
  background: black;
  color:white;
  width:100%;
}
.details{
  padding: 5px 15px;
}

.container, .vid-con {
	cursor: url("../imgs/cursor2.png") 10 10, auto;
}
.container {
  background-image: url("../imgs/nigga.jpg");
  background-size: contain;
}
</style>