<template>
    <div class="player">
        <video id="video" @play="videoPlayed" @pause="videoPaused" controls crossOrigin="anonymous" muted>
            <source :src="`http://localhost:5000/videos/video/${vidName}`" type="video/mp4">
            <!-- <track label="English" kind="captions" srcLang="en" :src="`http://localhost:5000/videos/video/${vidName}/caption`" default> -->
        </video>
    </div>
</template>

<script>
import socket from '~/plugins/socket.io.js'

const STATE_PLAYING = 1
const STATE_PAUSED = 2

export default {
    data() {
        return { vidName: '', hostname: 'http://localhost', player: null }
    },
    mounted() {
        // this.hostname = window.location.hostname
        this.vidName = this.$route.params.name
        this.player = document.getElementById('video')

        socket.on('requested_seek', (to) => {
            console.log(to + " requested to seek", this.player.currentTime, this.player.paused)
            socket.emit('seek_other', {
                other: to,
                time: this.player.currentTime,
                state: this.player.paused ? STATE_PAUSED : STATE_PLAYING
            })
        });
        socket.on('seek', data => {
            this.player.currentTime = data.time;
            if (data.state == STATE_PAUSED) {
                this.player.pause();
            } else if (data.state == STATE_PLAYING) {
                //this.player.currentTime = (data.time + 0.2); // offset for network latency
                this.player.play();
            }
        });

        socket.emit("join-room")
        console.log("joined room")
    },
    methods: {
        videoPlayed() {
            socket.emit("broadcast_state_changed", {time: this.player.currentTime, state: STATE_PLAYING});
        },
        videoPaused() {
            socket.emit("broadcast_state_changed", {time: this.player.currentTime, state: STATE_PAUSED});
        },
    }
}
</script>
<style>
html, body {
    padding: 0!important;
    margin: 0!important;
    background-color: rgb(26, 25, 25);
}
</style>
<style scoped>
.player {
    display: flex;
    justify-content: center;
    align-items: center;
}
#video {
    height: 100vh;
    width: auto;
    margin: 0 auto;
}
</style>