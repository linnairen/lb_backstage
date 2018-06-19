export const drawLine = {
    cv: null,
    ctx: null,
    drawMap: function (idname,one,textArr){
        this.cv = document.getElementById(idname)
        this.ctx = this.cv.getContext('2d')
        this.ctx.fillStyle = "#fff"
        this.ctx.fillRect(0,0,560,420)
        
        this.ctx.strokeStyle = "#eee"
        this.ctx.beginPath()
        for(var b = 1; b <= 4; b ++){
            this.ctx.moveTo(0,100*b)
            this.ctx.lineTo(560,100*b)
            if(b <= 4){
                this.ctx.fillStyle = "#999"
                this.ctx.font = "16px 微软雅黑"
                this.ctx.fillText(one*(4 - b),0,100*b - 10,100)
            }
        }
        this.ctx.stroke()
        this.ctx.beginPath()
        for (var a = 1; a <= 7; a ++) {
            this.ctx.moveTo(70*a,400);
            this.ctx.arc(70*a,400,5,0,Math.PI*2,true)
            this.ctx.fillStyle = "#aaa"
            this.ctx.fill()
            this.ctx.fillStyle = "#000"
            this.ctx.font = "12px 微软雅黑"
            this.ctx.fillText(textArr[a - 1],70*a - 12,417,100)
        }
        this.ctx.closePath()
    },
    draw: function (arr) {
        this.ctx.strokeStyle = "#f29e48"
        this.ctx.fillStyle = "#f29e48"
        this.ctx.beginPath()
        var that = this
        arr.forEach(function(item,index){
            if(index == 0){
                that.ctx.moveTo(70*(index + 1),(4 - arr[index])*100)
            }
            else{
                that.ctx.lineTo(70*(index + 1),(4 - arr[index])*100)
            }
        })
        this.ctx.stroke()
        this.ctx.closePath()
        this.ctx.beginPath()
        arr.forEach(function(item,index){
            that.ctx.moveTo(70*(index + 1),(4 - arr[index])*100)
            that.ctx.arc(70*(index + 1),(4 - arr[index])*100,5,0,Math.PI*2,true)
            that.ctx.fill()
        })
    }
}