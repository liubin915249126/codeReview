var labelType, useGradients, nativeTextSupport, animate, st,subtree;

(function () {
    var ua = navigator.userAgent,
        iStuff = ua.match(/iPhone/i) || ua.match(/iPad/i),
        typeOfCanvas = typeof HTMLCanvasElement,
        nativeCanvasSupport = (typeOfCanvas == 'object' || typeOfCanvas == 'function'),
        textSupport = nativeCanvasSupport
          && (typeof document.createElement('canvas').getContext('2d').fillText == 'function');
    //I'm setting this based on the fact that ExCanvas provides text support for IE
    //and that as of today iPhone/iPad current text support is lame
    labelType = (!nativeCanvasSupport || (textSupport && !iStuff)) ? 'Native' : 'HTML';
    nativeTextSupport = labelType == 'Native';
    useGradients = nativeCanvasSupport;
    animate = !(iStuff || !nativeCanvasSupport);
})();

var Log = {
    elem: false,
    write: function (text) {
        if (!this.elem)
            this.elem = document.getElementById('log');
        this.elem.innerHTML = text;
        this.elem.style.left = (500 - this.elem.offsetWidth / 2) + 'px';
    }
};


function init(json) {
    //init data

   
    var removing = false;
    //init Spacetree
    //Create a new ST instance
    st = new $jit.ST({
        'injectInto': 'infovis',
        //add styles/shapes/colors
        //to nodes and edges
        orientation: "top",
        levelsToShow: 1,
        //set overridable=true if you want
        //to set styles for nodes individually 
        Node: {
            overridable: true,
            height: 377,
            width: 140,
            color: '#fff'
        },
        Edge: {
            type: 'bezier',
            animate: 'true',
            overridable: true
        },
        Navigation: {
            enable: true,
            panning: true
        },
        //change the animation/transition effect
        transition: $jit.Trans.Quart.easeOut,



        //This method is triggered on label
        //creation. This means that for each node
        //this method is triggered only once.
        //This method is useful for adding event
        //handlers to each node label.
        onCreateLabel: function (label, node) {
            //add some styles to the node label
            var style = label.style;
            label.id = node.id;
            style.color = '#333';
            style.fontSize = '0.8em';
            style.textAlign = 'center';
            style.width = "60px";
            style.height = "20px";
        
          
            //label.innerHTML = node.name;
            var str1 = '<div class="firstLevel" data-level=""><span class="name">&nbsp;</span><span class="img"><img src="" ondragstart="return false;"></span></div>'
            var $template1 = $(str1);
           
           
            if (node && node.data.staff.name) {
            	var staffName = node.data.staff.name;
            	if (node.data.coreTalent) {
            		staffName = staffName + "*";
            	} 
            	$template1.find('.name').text(staffName)
			}

            $template1.attr('data-level', node.data.level + '');
            
            $template1.find('.img img').attr('src', urlConnection(node));
            var str2 = '<div class="len3-wrap animated fadeIn" ondragstart="return false;" data-level=""><div class="main">' +
                '<span class="name">&nbsp;</span>' +
                '<span class="img"><span><img src="" ondragstart="return false;"></span></span>' +
                '<span class="positionName ellipsis" data-toggle="tooltip" data-placement="right" title="" data-deptCode="">岗位名称</span>' +
                '<span class="deptName ellipsis" data-toggle="tooltip" data-placement="right" title="" data-deptCode="">部门名称</span>' +
                '<span class="successor">马上可继任者<br/><span class="successor0 ellipsis" data-toggle="tooltip" data-placement="right" title="">&nbsp;</span></span>' +
                '<span class="successor">半年内可继任者<br/><span class="successor1 ellipsis" data-toggle="tooltip" data-placement="right" title="">&nbsp;</span></span>' +
                '<span class="successor">一年内可继任者<br/><span class="successor2 ellipsis" data-toggle="tooltip" data-placement="right" title="">&nbsp;</span></span>' +
                '<span class="successor">一年半可继任者<br/><span class="successor3 ellipsis" data-toggle="tooltip" data-placement="right" title="">&nbsp;</span></span></div>' +
                '<span class="arrow" id="addNode" data-click=true><i class="fa fa-sort-down">&nbsp;</i></span>'+
                '<span class="deleteKeyPosition"><i class="fa fa-close">&nbsp;</i></span>'+
                '</div>';

            var $str2 = $(str2);
            var num0, num1, num2, num3;

            function setSucessorLayout(successorObj) {
                if (successorObj && successorObj.num) {
                    if (successorObj.num == '0') {
                        return '暂无人选'
                    } else if (successorObj.num == '1') {
                        return successorObj.name + '1人'
                    }
                    return successorObj.name + '等' + successorObj.num + '人'
                } else {
                    return '无信息'
                }
               
            }
           //马上可继任者判别
            num0 = setSucessorLayout(node.data.successor);
            /*半年内可继任者判别*/
            num1 = setSucessorLayout(node.data.successor1);
            /*一年内继任者判别*/
            num2 = setSucessorLayout(node.data.successor2);
            /*一年半内继任者判别*/
            num3 = setSucessorLayout(node.data.successor3);
            /*拼接图像URl*/
            function urlConnection(obj) {
                var imgNum = obj.data.staff.pic;
                var url =imgNum;
                return url;
            }
          
            var $template2 = $(str2);
            var staffName = node.data.staff.name;
            if (node.data.coreTalent) {
            	staffName = staffName + "*";
            }
           
         
            if (node.data.keyPosition) {
            	
            	$template2.find('.main .name').text(staffName);
            }
           
            $template2.find('.deptName').text(node.data.staff.deptName);
            $template2.find('.deptName').attr('title', node.data.staff.deptName);
            $template2.find('.positionName').text(node.data.staff.positionName);
            $template2.find('.positionName').attr('title', node.data.staff.positionName);
            
            $template2.find('.successor0').text(num0);
            $template2.find('.successor1').text(num1);
            $template2.find('.successor2').text(num2);
            $template2.find('.successor3').text(num3);
            //tooltip
            $template2.find('.successor0').attr('title', num0);
            $template2.find('.successor1').attr('title', num1);
            $template2.find('.successor2').attr('title', num2);
            $template2.find('.successor3').attr('title', num3);

            $template2.find('.deptName').attr('data-deptCode', node.data.staff.code);
            if (node.data.keyPosition) {//关键岗位头像
                $template2.find('.img img').attr('src', urlConnection(node));
            } else {//非关键岗位默认头像
                $template2.find('.img img').attr('src', '/Content/TalentTwo/img/a2.jpg');
            }
            $template2.attr('data-level', node._depth + '');
            //非关键岗位
            if (!node.data.keyPosition) {
                $template2.addClass('normalPosition');
                $template2.find('.successor').each(function () {
                    $(this).css('visibility', 'hidden');
                });
                $template2.find('.deleteKeyPosition').css({'display':'none'})
            }
            //无子节点
            if (node.data.childrenCount <= 0) {
                $template2.find('.arrow').addClass('arroNone');
            }
            
            var str3 = '<div class="len3-wrap animated fadeIn" data-level=""><div class="main">' +
                '<span class="name">&nbsp;</span>' +
                '<span class="img"><span><img src=""></span></span>' +
                '<span class="deptName">岗位名称</span>' +
                '<span class="successor">半年内可继任者<br/><span class="successor1">&nbsp;</span></span>' +
                '<span class="successor">一年内可继任者<br/><span class="successor2">&nbsp;</span></span>' +
                '<span class="successor">一年半可继任者<br/><span class="successor3">&nbsp;</span></span></div>' +
                '<span class="arrow arroNone" id="addNode"><i class="fa fa-sort-down">&nbsp;</i></span></div>'
            var $template3 = $(str3);
            $template3.attr('data-level', node.data.level + '');

            //if (node.data.level!= '1') {
               
            //} else {
            //    $(label).append($template1)
            //
            $(label).attr('data-childCount', node.data.childrenCount)
            $(label).append($template2)
            //Delete the specified subtree  
            //when clicking on a label.
            //Only apply this method for nodes
            //in the first level of the tree.(node._depth == 1)

            style.cursor = 'pointer';
           
          
        },
        //This method is triggered right before plotting a node.
        //This method is useful for adding style 
        //to a node before it's being rendered.
        onBeforePlotNode: function (node) {
            if (node._depth == 1) {
                node.data.$color = '#fff';
            }
        }
    });
    //load json data
    st.loadJSON(json);
    //compute node positions and layout
    st.compute();
    //optional: make a translation of the tree
    st.geom.translate(new $jit.Complex(-200, 0), "current");
    //Emulate a click on the root node.
    st.onClick(st.root);
    //end

    //init handler
    //Add an event handler to the add button for
    //adding a subtree.


    

}
