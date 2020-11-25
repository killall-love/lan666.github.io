/* DaTouWang URL: www.datouwang.com */
new Vue({
	el:"#app",
	data:{
	  password: '',
	  Username: '',
	  text: '登录',
	  token: "0",
	  datas:'',
	  counts: 1,
	  indexs: 0,
	  isStart: 1,	
	  score:10, //消耗积分
      list:[
	  	{img:'img/j1.png',title:'谢谢参与'},
		{img:'img/j2.png',title:'激活码一个'},
		{img:'img/j1.png',title:'谢谢参与'},
		{img:'img/j2.png',title:'一元红包'},
		{img:'img/j1.png',title:'谢谢参与'},
		{img:'img/j2.png',title:'两元红包'},
		{img:'img/j1.png',title:'谢谢参与'},
		{img:'img/j2.png',title:'五元红包'}
	  ],   //奖品1-9     
      index: -1,  // 当前转动到哪个位置，起点位置
      count: 8,  // 总共有多少个位置
      timer: 0,  // 每次转动定时器
      speed: 200,  // 初始转动速度
      times: 0,    // 转动次数
      cycle: 50,   // 转动基本次数：即至少需要转动多少次再进入抽奖环节
      prize: -1,   // 中奖位置
      click: true,
      showToast: false, //显示中奖弹窗        
	},
	
	mounted(){
		var url = window.location.href;
		var index = url.lastIndexOf("#");
		var token = url.substring(index + 1, url.length);
		this.token = token;
		axios.get('http://123.207.53.139:8888/game/init')
			.then(response => {
				if (response.data.code == 200) {
					this.isStart = response.data.time;
				} 
			})
	},
	methods:{
		startLottery(){
			if (!this.click) { return }
			axios.get('http://123.207.53.139:8888/game/start/'+this.token)
				.then(response => {
					 if (response.data.code == 200) {
						this.counts = 0;
						if(response.data.uuid == 1 || response.data.uuid == 3
							|| response.data.uuid == 5 || response.data.uuid == 7){
							this.datas = response.data.data;
						}
						this.indexs = response.data.uuid; //parseInt(Math.random() * 10, 0) || 0;  // 随机获得一个中奖位置
						this.startRoll(); 
					}else if (response.data.code == 202){
						this.counts = 0;
						mui.alert("您已参与过本次活动")
					}else if (response.data.code == 100){
						window.location.href="./index.html";
					}
				})
		},		
		// 开始转动
		startRoll () {
			this.times += 1 // 转动次数
			this.oneRoll() // 转动过程调用的每一次转动方法，这里是第一次调用初始化 
			// 如果当前转动次数达到要求 && 目前转到的位置是中奖位置
			if (this.times > this.cycle + 10 && this.prize === this.index) {
			  clearTimeout(this.timer)  // 清除转动定时器，停止转动
			  this.prize = -1
			  this.times = 0
			  this.speed = 200
			  this.click = true; 
			  var that = this;
			  setTimeout(res=>{
				that.showToast = true;
			  },500)			                  
			} else {
			  if (this.times < this.cycle) {
				this.speed -= 10  // 加快转动速度
			  } else if (this.times === this.cycle) { 
          		this.prize = this.indexs; //中奖位置,可由后台返回 
				if (this.prize > 7) { this.prize = 7 }
			  } else if (this.times > this.cycle + 10 && ((this.prize === 0 && this.index === 7) || this.prize === this.index + 1)) {
				this.speed += 110
			  } else {
				this.speed += 20
			  }      
			  if (this.speed < 40) {this.speed = 40}
			  this.timer = setTimeout(this.startRoll, this.speed)
			}
		},

		// 每一次转动
		oneRoll () {
		  let index = this.index // 当前转动到哪个位置
		  const count = this.count // 总共有多少个位置
		  index += 1
		  if (index > count - 1) { index = 0 }
		  this.index = index
		},
		close (index) {
			this.showToast=false;
			if(this.list[index].title == '五元红包'){		
				mui.alert("恭喜获得抵扣卷: "+this.datas )
			}else if(this.list[index].title == '两元红包'){
				mui.alert("恭喜获得抵扣卷: "+this.datas )
			}else if(this.list[index].title == '一元红包'){
				mui.alert("恭喜获得抵扣卷: "+this.datas )
			}else if(this.list[index].title == '激活码一个'){
				mui.alert("恭喜获得激活码: "+this.datas )
			}
		},
		login: function () {
			 if(this.password == '' || this.Username == '') return;
			 axios.get('http://123.207.53.139:8888/game/login/'+this.Username+'/'+this.password)
			 	.then(response => {
					if (response.data.code == 200) {
						this.token = response.data.token;
						window.location.href="./game.html#"+this.token;
					}else if (response.data.code == 100){
						mui.alert("您还不是蘑订用户\n加QQ群 688274898")
					}else if (response.data.code == 202){
						mui.alert("密码错误\n重新登录");
					}
			 	})
			 return false;
		   }
		
	}	
	
})