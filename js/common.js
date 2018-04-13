window.onload=function(){
    //JS简单绑定
    var $$=function(num){
        if(num.substring(0,1) == "."){
            return document.getElementsByClassName(num.substring(1,num.length));
        }else if(num.substring(0,1) == "#"){
            return document.getElementById(num.substring(1,num.length));
        }else{
            return document.getElementsByTagName(num);
        }
    }
    //兼容性
    var eventuntil={
        addhandler:function(element,type,handler){
            if(element.addEventListener){
                element.addEventListener(type,handler,false);
            }else if(element.attachEvent){
                element.attachEvent("on"+type,handler);
            }else{
                element["on"+type]=handler;
            }
        },
        getevent:function(event){
            return window.event || event;
        }
    }
//全屏滚动
    var screenScroll = function(){
        var container=$(".container")[0];//绑定大盒子
        var w_height=window.innerHeight//浏览器的高度
        w_width=window.innerWidth;//浏览器的宽度

        var i= 0,Animated=false,j=0;
        for(i=0;i<$$(".box").length;i++){
            $$(".box")[i].style.width=w_width+"px";
            $$(".box")[i].style.height=w_height+"px";
            //$$(".box")[i].style.lineHeight=w_height+"px";
        }
        function run(event){//滚动运行
            if(Animated){//监测是否运行
                return;
            }
            var event=eventuntil.getevent(event);
            var delta=event.wheelDelta || event.detail;//获取滚动值
            var absdelta=Math.abs(delta);//获取滚动值的绝对值
            console.log(delta);
            if(delta == absdelta){//兼容火狐滚动事件
                j ? (event.wheelDelta ? j--:j++) : (event.detail ? j++:j--);
                //event.wheelDelta ?  j--:j++;
            }else if(delta != absdelta){
                j ? (event.wheelDelta ? j++:j--) : (event.detail ? j--:j++);
                //event.wheelDelta ?  j++:j--;
            }
            if(j<=0){
                j=0;
            }else if(j>=$$(".box").length-1){
                j=$$(".box").length-1;
            }
            Animated=true;
            $("body").animate({"top":-w_height*j},1000,function(){
                Animated=false;
            });
        }
        eventuntil.addhandler(window,"mousewheel",run);
        eventuntil.addhandler(window,"DOMMouseScroll",run);
    }
//JS无缝轮播
    var JSbanner = function(){
        var banner_imgs=$$(".banner-imgs1")[0].children;//绑定图片集
        var banner_main1=$$(".banner-main1")[0];//绑定大盒子
        var main_left=$$(".main-left")[0];//绑定左按钮
        var main_right=$$(".main-right")[0];//绑定右按钮
        var main_li=banner_main1.getElementsByTagName("ul")[0].children;//绑定小圆点集
        var banner_w=parseFloat(banner_main1.clientWidth);//大盒子宽度
        var banner_h=parseFloat(banner_main1.clientHeight)-50;//大盒子高度
        var animated=false,index= 0,isplay=false,//监测轮播动画运行
            time=1000,//运行时间 offset是运行的距离，是一个距离参数(可修改数值来改变轮播速度！)
            interval=10;//间隔时间
        console.log(banner_main1.clientWidth);
        for(var i=0;i<banner_imgs.length;i++){//设置图片的大小和显示框大小一样；
            banner_imgs[i].style.width=banner_w+"px";
            banner_imgs[i].style.height=banner_h+"px";
        }
    //运行轮播动画函数
        function animate(offset){
            animated=true;
            var left=parseFloat($$(".banner-imgs1")[0].style.marginLeft)+offset;
            var move_w=offset/(time/interval);//每次移动的距离
            function run(){
                mainLeft=parseFloat($$(".banner-imgs1")[0].style.marginLeft);//大盒子宽度
                if(move_w<0 && mainLeft>left || move_w>0 && mainLeft<left){
                    $$(".banner-imgs1")[0].style.marginLeft=mainLeft+move_w+"px";
                    setTimeout(arguments.callee,interval);
                }else{
                    if(mainLeft>=0){
                        $$(".banner-imgs1")[0].style.marginLeft=-banner_w*(banner_imgs.length-2)+"px";
                    }else if(mainLeft<=-banner_w*(banner_imgs.length-1)){
                        $$(".banner-imgs1")[0].style.marginLeft=-banner_w+"px";
                    }
                    animated=false;}}run();
        }
        function btn(){//圆点变化函数
            for(var j=0;j<main_li.length;j++){
                if(main_li[j].className == "active"){
                    main_li[j].className = "";
                }
                main_li[index].className="active";}}
        main_right.onclick=function(){//右键点击，向左移动
            clearInterval(handtime);
            if(animated){return;}
            index++;
            if(index>=main_li.length){index=0;}
            btn();
            animate(-banner_w);
            handtime = setInterval(atuoplay,1000);
        }
        main_left.onclick=function(){//左键点击，向右移动
            clearInterval(handtime);
            if(animated){return;}
            index--;
            if(index<0){index=main_li.length-1;}
            btn();
            animate(banner_w);
            handtime = setInterval(atuoplay,1000);
        }
        for(var j=0;j<main_li.length;j++){//圆点点击运行轮播函数
            main_li[j].setAttribute("index",j);//添加序列号
            main_li[j].onclick=function(){
                clearInterval(handtime);
                if(animated){return;}
                var currentindex=parseInt(this.getAttribute("index"));//获取序列号的值
                var offset = -banner_w*(currentindex-index),len=Math.abs(currentindex-index);
                //time=time*len;
                animate(offset);
                //time=time/len;
                index = currentindex;
                btn();}}
        //自动轮播
        function atuoplay(){
                if(animated){return;}
                index++;
                if(index>=main_li.length){index=0;}
                btn();
                animate(-banner_w);
        }
        var handtime = setInterval(atuoplay,1000);
    }
//Jquery无缝轮播
    var Jquerybanner = function(){
        var banner_imgs=$(".banner-imgs2 img");//图片集
        var main_left=$(".banner-main2 .main-left");//左按钮
        var main_right=$(".banner-main2 .main-right");//右按钮
        var main_btns=$(".banner-main2>a");//按钮集合
        var main_li=$(".banner-main2 ul li");//圆点集
        var banner_w=$(".banner").width();//大盒子宽度
        var banner_h=$(".banner").height()-50;//大盒子高度
        var marginleft=parseFloat($(".banner-imgs2").css("margin-left"));//获取当前的margin-left的值
        for(var i=0;i<banner_imgs.length;i++){
            banner_imgs.eq(i).css({"width":banner_w,"height":banner_h});
        }
        var j= 0,k=0,isclick=false,animated=false,time=1000;
        function init(){main_btns.eq(1).trigger("click");}
        var handtime=setInterval(init,1000);
        for(var btnl=0;btnl<$(".banner-main2>a").length;btnl++){
            main_btns.eq(btnl).click(function(){
                clearInterval(handtime);
                if(animated){return};
                if($(this).attr("name") == "next"){//右>
                    var currentleft=parseFloat($(".banner-imgs2").css("margin-left"))-banner_w;//获取即将要移动的值
                    k++;
                }else if($(this).attr("name") == "prev"){//左<
                    var currentleft=parseFloat($(".banner-imgs2").css("margin-left"))+banner_w;//获取即将要移动的值
                    k--;
                }
                if(k>=main_li.length){k=0;}else if(k<0){k=main_li.length-1;}
                main_li.eq(k).addClass("active").siblings().removeClass("active");
                animate(currentleft);
            })
        }
        function animate(offset){//轮播运行函数
            animated=true;
            $(".banner-imgs2").animate({"margin-left":offset},time,function(){
                animated=false;
                if(parseFloat($(".banner-imgs2").css("margin-left"))>-banner_w){
                    $(".banner-imgs2").css("margin-left",-banner_w*(banner_imgs.length-2));
                }else if(parseFloat($(".banner-imgs2").css("margin-left"))<-banner_w*(banner_imgs.length-2)){
                    $(".banner-imgs2").css("margin-left",-banner_w);
                }
                handtime=setInterval(init,1000);
            });
        }
        main_li.click(function(){
            clearInterval(handtime);
            if(animated){return};
            var index=$(this).index();//获取当前的序列号
            if(index == k){
                var currentleft=parseFloat($(".banner-imgs2").css("margin-left"))+0;//获取即将要移动的值
            }else if(index > k){
                var currentleft=parseFloat($(".banner-imgs2").css("margin-left"))-banner_w*Math.abs(index-k);//获取即将要移动的值
            }else if(index < k){
                var currentleft=parseFloat($(".banner-imgs2").css("margin-left"))+banner_w*Math.abs(index-k);//获取即将要移动的值
            }
            $(this).addClass("active").siblings().removeClass("active");
            k=index;
            animate(currentleft);
        })
    }
//层叠式轮播1
    var carbanner1 = function() {
        //绑定事件#carbanner
        var carbanner = document.getElementsByClassName("carbanner1")[0];
        var prev = carbanner.getElementsByClassName("prev")[0];//绑定左按钮
        var next = carbanner.getElementsByClassName("next")[0];//绑定右按钮
        var btn = carbanner.getElementsByClassName("btn");
        var imgs = carbanner.getElementsByTagName("img");//绑定图片集合
        var imglen = imgs.length;//获取图片集的长度
        var imgshow = parseInt(imglen / 2);//当前显示图片的序列号
        var animated = false;//检测动画的状态 暂时不需要
        var i = 1, left = true, right = true, time1;
        //添加序列号
        for (var i = 0; i < imglen; i++) {
            imgs[i].setAttribute("index", i, "style");
        }
        //层叠替换效果运行
        for (var j = 0; j < btn.length; j++) {//for循环得到按钮点击事件
            btn[j].onclick = function () {
                clearInterval(time1);//清除计时器
                if (animated) {
                    return;
                }
                if (this.innerHTML == "右") {//右键点击
                    newrun("右");
                } else if (this.innerHTML == "左") {//左键点击
                    newrun("左");
                }
                time1 = setInterval(auto, 1500);
            }
        }
            //自动运行轮播
            function auto() {
                if (animated) {
                    return;
                } else {
                    newrun("右");
                }
            }
            var time1 = setInterval(auto, 1500);
            //运行轮播
            function newrun(word) {
                for (var i = 0; i < imglen; i++) {
                    animated = true;
                    setTimeout(function () {
                        animated = false;
                    }, 500);//做一个延时调整数值 防止点击运行出现混乱
                    var currentindex = parseInt(imgs[i].getAttribute("index"));
                    switch (currentindex) {
                        case 0:
                    }
                    if (word == "左") {
                        switch (currentindex) {
                            case 0:
                                imgs[i].setAttribute("style", "right:0px;left:null;z-index:1;width: 200px;height: 300px;top:70px;transition:all 2s;");
                                imgs[i].setAttribute("index", 4);
                                break;
                            case 1:
                                imgs[i].setAttribute("style", "left:0px;right:null;z-index:1;width: 200px;height: 300px;top:70px;transition:all 2s;");
                                imgs[i].setAttribute("index", 0);
                                break;
                            case 2:
                                imgs[i].setAttribute("style", "left:50px;right:null;z-index:5;width: 240px;height: 360px;top:40px;transition:all 2s;");
                                imgs[i].setAttribute("index", 1);
                                break;
                            case 3:
                                imgs[i].setAttribute("style", "right:100px;left:null;z-index:9;width: 300px;height: 440px;top:0px;transition:all 2s;");
                                imgs[i].setAttribute("index", 2);
                                break;
                            case 4:
                                imgs[i].setAttribute("style", "right:50px;left:null;z-index:5;width: 240px;height: 360px;top:40px;transition:all 2s;");
                                imgs[i].setAttribute("index", 3);
                                break;
                        }
                    } else if (word == "右") {
                        switch (currentindex) {
                            case 0:
                                imgs[i].setAttribute("style", "left:50px;right:null;z-index:5;width: 240px;height: 360px;top:40px;transition:all 2s;");
                                imgs[i].setAttribute("index", 1);
                                break;
                            case 1:
                                imgs[i].setAttribute("style", "left:100px;right:null;z-index:9;width: 300px;height: 440px;top:0px;transition:all 2s;");
                                imgs[i].setAttribute("index", 2);
                                break;
                            case 2:
                                imgs[i].setAttribute("style", "right:50px;left:null;z-index:5;width: 240px;height: 360px;top:40px;transition:all 2s;");
                                imgs[i].setAttribute("index", 3);
                                break;
                            case 3:
                                imgs[i].setAttribute("style", "right:0px;left:null;z-index:1;width: 200px;height: 300px;top:70px;transition:all 2s;");
                                imgs[i].setAttribute("index", 4);
                                break;
                            case 4:
                                imgs[i].setAttribute("style", "left:0px;right:null;z-index:1;width: 200px;height: 300px;top:70px;transition:all 2s;");
                                imgs[i].setAttribute("index", 0);
                                break;
                        }
                    }
                }
            }
        }
//层叠式轮播2
    var carbanner2 = function(){
        var box=$(".carbanner2 .img");//获取列表
        var pagesize=$(".carbanner2 .pagesize li")//获取序列号
        var box_w=box.width();
        var box_l=box.length;
        var index= box_l-1,pre= index,handtime,isclick=false;
        $(".carbanner2 ul li").eq(index).css({"color":"white"});
        function autoplay(){
            index++;
            if(index==box_l){
                index=0;
                console.log("运行下一组");
            }
            if(pre==box_l){
                pre=0;
            }
            pagesize.eq(index).css({"color":"white"});
            pagesize.eq(index).siblings().css({"color":""});
            for(var i= 0;i<=box_l;i++){
                if(i==index){
                    box.eq(index).css({"left":box_w,"z-index":box_l+10});
                }else if(i==pre){
                    box.eq(pre).css({"z-index":box_l+9});
                }else{
                    box.eq(i).css({"z-index":box_l+8});
                }
            }
            box.eq(index).animate({"left":0},1000,function(){
                if(isclick==true){
                    handtime=setInterval(autoplay,2000);
                    isclick=false;
                }
            });
            pre++;
        }
        function autoplay2(){
            index--;
            if(index==-1){
                index=box_l-1;
                console.log("运行下一组");
            }
            if(pre==-1){
                pre=box_l-1;
            }
            pagesize.eq(index).css({"color":"white"});
            pagesize.eq(index).siblings().css({"color":""});
            console.log("index是"+index);
            console.log("pre是"+pre);
            for(var i= 0;i<=box_l;i++){
                if(i==index){
                    box.eq(index).css({"left":-box_w,"z-index":box_l+10});
                }else if(i==pre){
                    box.eq(pre).css({"z-index":box_l+9});
                }else{
                    box.eq(i).css({"z-index":box_l+8});
                }
            }
            box.eq(index).animate({"left":0},1000,function(){
                if(isclick==true){
                    handtime=setInterval(autoplay,2000);
                    isclick=false;
                }
            });
            pre--;
        }
        handtime=setInterval(autoplay,2000);
//        function move(){//鼠标移动停止/恢复事件
//            box.mouseover(function(){
//                clearInterval(handtime);
//            })
//            box.mouseleave(function(){
//                handtime=setInterval(autoplay,2000);
//            })
//        }
//       var newnove=new move();
//        轮播点击事件
        pagesize.click(function(){
            isclick=true;
            clearInterval(handtime);
//            clearInterval(newnove);
            var j=$(this).index();
            if(j==0){
                index=box_l-1;
                pre=index;
            }else{
                index=j-1;
                pre=index;
            }
            autoplay();
        })
//左右切换点击事件
        $(".container .lb").click(function(){
            clearInterval(handtime);
//        clearInterval(newnove);
            isclick=true;
            var o=parseInt(index);
            if(o==index){
                index=o;
                pre=index;
                autoplay2();
            }
        })
        $(".container .rb").click(function(){
            clearInterval(handtime);
//        clearInterval(newnove);
            isclick=true;
            var o=parseInt(index);
            if(o==index){
                index=o;
                autoplay();
            }
        })

    }
//计算器
    var calculator = function(){
        var box = document.getElementsByClassName("cal_box")[0];//绑定大盒子
        var inputs=box.getElementsByTagName("input");//绑定所有文本框
        var show = document.getElementById("show");//绑定显示器
        var clear=document.getElementById("clear");//清零按钮
        //定义全局变量
        var j=0;k=0,sum="",flag=true,result=0,sum1=0,sum2=0,newsign=0,oldsign=0,blurvalue=0;
        for(var i=-0;i<inputs.length;i++){
                if(Number(inputs[i].value) ||Number(inputs[i].value)==0){
                    inputs[i].className="number";
                }else{
                    inputs[i].className="btn";
                }
        };
        function $(value){//绑定事件
            if(value.substring(0,1) == "."){
                    return document.getElementsByClassName(value.substring(1,value.length));//classname集合
            }else if(value.substring(0,1) == "#"){
                    return document.getElementById(value.substring(1,value.length));//idname
            }else{
                    return document.getElementsByName(value);//tagname
            }
        };
        var nums=box.getElementsByClassName("number");//绑定所有数字
        var btns=box.getElementsByClassName("btn");//绑定所有按钮
        //获取数字信息并添加
        for(var j=0;j<nums.length;j++){
            nums[j].onclick=function click(){
                numshow=true;
                k++;signclick=0;
                eventuntil.addhandler(clear,"click",function(){//清零
                    sum = show.value= "";
                    k=0;
                });
                if(k>=11){
                    nums[j].onclick=null;
                }else{
                    sum+=Number(this.value);
                    show.value = sum;
                }
                if(oldsign == "="){
                    k=0;
                    oldsign=null;
                    sum = show.value = this.value;
                }
            }
        };
        //输入数值时
//        show.onblur=function(){
//            blurvalue=this.value;//获取输入后的数值
//        }
            //计算运行
        function run(num1,num2,sign){
            switch (sign){
                case "+":  return num1 + num2;break;
                case "-":  return num1 - num2;break;
                case "*":  return num1 * num2;break;
                case "/":  return num1 / num2;break;
            }
        }
        //符号运算 signl 是指符号计入的个数
        var sums = 1,signclick= 0,numshow=false,signshow=false;
        var signs = $("sign");// 符号 =
        for(var signl=0;signl < signs.length;signl++){
            signs[signl].onclick=function(){
                signshow=true;
                console.log(sum);
                signclick++;
                k=0;
                newsign=this.value;
                sum1 = (signclick==1) ? sum1=parseFloat(sum) : sum1=sum1;
                sum = show.value= "";
            }
        }
        $("#equal").onclick=function(){//显示结果
            signclick=0;
            sum2=parseFloat(sum);
            oldsign=this.value;
            result= run(sum1,sum2,newsign);
               if(result.toFixed().length>=12){
                   result="NAN";
                   alert("数字太大，超出计算范围！");
               }
            sum = show.value=result;
        }
    }
//地鼠游戏
    var mousegame = function(){
        var game=document.getElementById("game");
        var num=game.childNodes[1];
        var num_child=num.children;
        var Img = num.getElementsByTagName("img");
        var overtime,handtime;
        var num1,num2,i= 0,k=0;
        var time=1200,isclick=false;
        console.log(num_child[0].children[0])
        //每隔一秒显示一个地鼠图片
        function show(){
            var num1=Math.floor(Math.random()*9);
            for(j=0;j<=8;j++){
                if(j==num1){
                    num_child[num1].children[0].style.display="block";
                    num2=num1;
                    setTimeout(function(){
                        num_child[num2].children[0].style.display="block";
                        num_child[num1].children[0].style.display="none";
                    },2*time);
                }
                //点击事件
                num_child[j].onclick=function(){
                    i++;
                    var judge=this.children[0].style.display;
                    console.log(judge);
                    if(judge=="block"){
                        this.children[0].style.display="none";
                    }
                }
            }
        }
//结束 游戏，弹出点击次数
        function over(){
            k++;
            if(k==60){
                clearInterval(overtime);
                clearInterval(handtime);
                //alert("一共点击："+i+"次");
            }
        }
//暂停
        var pause=document.getElementById("pause");
        pause.onclick=function(){
            if(pause.value=="暂停"){
                pause.value="运行";
                clearInterval(overtime);
                clearInterval(handtime);
            }else if(pause.value=="运行"){
                pause.value="暂停";
                overtime= setInterval(over,1000);
                handtime=setInterval(show,time);
            }
        }
//重新开始
        var reset=document.getElementById("reset");
        reset.onclick=function(){
            init=null;
            i=0;
            k=0;
        }
//增加速度
        var speed=document.getElementById("speed");
        speed.onchange=function getvalue(){
            var currentvalue=speed.value;
            clearInterval(overtime);
            clearInterval(handtime);
            console.log(currentvalue);
            if(currentvalue==1){
                time=1200;
            }else if(currentvalue==2){
                time=600;
            }else if(currentvalue==3){
                time=300;
            }else if(currentvalue==4){
                time=100;
            }
            init();
        }
        console.log(speed.value);
        function init(){
            overtime= setInterval(over,1000);
            handtime=setInterval(show,time);
        }
        init();
    }
//放大镜
    var magnifer = function(){
        var pic = document.getElementsByClassName("pic")[0];//放大镜大盒子
        var pic_show = pic.getElementsByClassName("show")[0];//放大后的大盒子
        var pic_w = pic.clientWidth;//大盒子宽度
        var pic_h = pic.clientHeight;//大盒子高度
        var pic_span = pic.getElementsByTagName("span")[0];//放大镜小盒子
        var span_w = pic_span.clientWidth;//小盒子宽度
        var span_h = pic_span.clientHeight;//小盒子高度
        var img_big = pic_show.children[0];//放大后的图片
        var img_w = img_big.clientWidth;//放大图片宽度
        var img_h = img_big.clientHeight;//放大图片高度
        pic.onmousemove = function(event){
            var event = window.event || event;
            var x = event.clientX - pic.offsetLeft-span_w/2;
            var y =event.clientY - pic.offsetTop+window.innerHeight*3-span_h/2;
            if(x<=0){x=0;}else if(x>=pic_w-span_w){x=pic_w-span_w;}
            if(y<=0){y=0;}else if(y>=pic_h-span_h){y=pic_h-span_h;}
            pic_span.style.top = y+"px";
            pic_span.style.left = x+"px";
            var percentx=x/(pic_w-span_w);//x轴百分比
            var percenty=y/(pic_h-span_h);//y轴百分比
            var newX=-percentx*(img_w-pic_w);//
            var newY=-percenty*(img_h-pic_h);//
            img_big.style.left=newX + "px";
            img_big.style.top=newY + "px";
        }
    }
//QQ列表
    var qqshow = function(){
        var qqlist=document.getElementsByClassName("qqlist")[0];
        var list_h2=qqlist.getElementsByTagName("h2");//绑定所有的h2
        var list_ul=qqlist.getElementsByTagName("ul");//绑定所有的ul
        var list_li=qqlist.getElementsByTagName("li");//绑定所有的Li

        for(var i=0;i<list_h2.length;i++){
            list_h2[i].setAttribute("ggg", i);
            list_h2[i].setAttribute("show",0);
            list_h2[i].onclick=function(){
                for(var l=0;l<list_li.length;l++){
                    list_li[l].className = "";
                }
                var index=this.getAttribute("ggg");
                if(list_h2[index].getAttribute("show") ==  0){
                    list_ul[index].style.display="block"
                    list_h2[index].style.backgroundColor="orange";
                    list_h2[index].setAttribute("show", 1);
                    for(var j=0;j<list_h2.length;j++){
                        if(index==j){
                            list_h2[index].setAttribute("show", 1);
                        }else if(index != j){
                            list_ul[j].style.display = "none"
                            list_h2[j].style.backgroundColor = "";
                            list_h2[j].setAttribute("show", 0);
                        }
                    }
                }else if(list_h2[index].getAttribute("show") ==  1) {
                    list_ul[index].style.display = "none"
                    list_h2[index].style.backgroundColor = "";
                    list_h2[index].setAttribute("show", 0);
                }
            }
        }
        for(var k=0;k<list_li.length;k++){
            list_li[k].index=k;
            list_li[k].onclick=function(){
                if(this.className != "active"){
                    this.className = "active";
                    for(var l=0;l<list_li.length;l++){
                        if(list_li[l].index != this.index){
                            list_li[l].className = "";
                        }
                    }
                }
            }
        }
    }


    //执行函数
    $(document).ready(function(){
        screenScroll();//全屏滚动
        JSbanner();//JS无缝轮播
        Jquerybanner();//Jquery无缝轮播
        carbanner1();//层叠式轮播1
        carbanner2();//层叠式轮播2
        calculator();//计算器
        //mousegame();//地鼠游戏
        magnifer();//放大镜
        qqshow();//QQ列表
    });
}
