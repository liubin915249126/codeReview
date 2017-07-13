var labelType, useGradients, nativeTextSupport, animate;
var moving =false;
(function() {
    var ua = navigator.userAgent,
        iStuff = ua.match(/iPhone/i) || ua.match(/iPad/i),
        typeOfCanvas = typeof HTMLCanvasElement,
        nativeCanvasSupport = (typeOfCanvas == 'object' || typeOfCanvas == 'function'),
        textSupport = nativeCanvasSupport
            && (typeof document.createElement('canvas').getContext('2d').fillText == 'function');
   
    labelType = (!nativeCanvasSupport || (textSupport && !iStuff))? 'Native' : 'HTML';
    nativeTextSupport = labelType == 'Native';
    useGradients = nativeCanvasSupport;
    animate = !(iStuff || !nativeCanvasSupport);
})();

var Log = {
    elem: false,
    write: function(text){
        if (!this.elem)
            this.elem = document.getElementById('log');
        this.elem.innerHTML = text;
        this.elem.style.left = (500 - this.elem.offsetWidth / 2) + 'px';
    }
};
 
function taffPortrait(staffNo) {
	return '/TalentManagement/EmpInfo/GetPortrait?staffNo=' + staffNo;
}

function init(data){ 
    var json=data;  
    var st = new $jit.ST({
       
        injectInto: 'infovis', 
        duration: 800,
     
        transition: $jit.Trans.Quart.easeInOut,
        levelsToShow:5, 
        levelDistance:40, 
        orientation:"top",
        Navigation: {
            enable:true,
            panning:true
        }, 
        Node: {
            height:205,
            width: 140,
            type: 'rectangle',
            color: '#fff',
            overridable: true
        },

        Edge: {
            type: 'bezier',
            overridable: true
        }, 
        onCreateLabel: function (label, node) {
            //循环数据，没有子节点的添加.normal
           
            loopJson(data);


            label.id = node.id;
           // console.log(node.data);
            var str1='<div class="firstLevel"><span class="name"></span><span class="img"><img src=""></span></div>'
            var $template1=$(str1);

                $template1.find('.name').text(node.data.staffName?node.data.staffName:'姓名不存在');

            var str2=' <div class="len4-wrap animated fadeIn" data-staffNo=""> <div class="main-wrap">'+

                '<div class="main1"><span class="name">&nbsp;&nbsp;</span>'+
                '<span class="img"><img src="" ondragstart="return false;"></span></div>' +
                '<div class="main2"><span class="ellipsis"><span>职级:</span><span class="degree" data-toggle="tooltip" data-placement="right" title="">p2</span> </span>'+
                '<span class="ellipsis">部门:<span class="deptName" data-toggle="tooltip" data-placement="right" title="">&nbsp;&nbsp;</span> </span>'+
                '<span class="ellipsis">岗位:<span class="PositionName" data-toggle="tooltip" data-placement="right" title="">&nbsp;&nbsp;</span> </span>'+              
                '</div>'+
                '<span class="arrow" id="addNode" data-click="true"><i class="fa fa-sort-down">&nbsp;</i></span></div>'+'</div>';

            var $template2=$(str2);
            $template2.attr('data-staffNo',node.data.staffNo)
            $template2.find('.name').text(node.data.staffName);
            $template2.find('.positionName').text(node.data.positionName);
            $template2.find('.positionName').attr('title',node.data.positionName);

            $template2.find('.deptName').text(node.data.deptName);
            $template2.find('.deptName').attr('title',node.data.deptName);
        	
            $template2.find('.degree').text(node.data.grade);
            $template2.find('.degree').attr('title', node.data.grade);
            $template2.find('.img img').attr('src', taffPortrait(node.data.staffNo));
            if (node.data.current) {
                $template2.addClass('current');
            }
            if (node.data.childrenCount <= 0) {
                $template2.find('#addNode').addClass('arroNone');
            }
            //没有权限不能点击进入个人详情
            if (node.data.isVerify) {
                $template2.find('.main1').addClass('verify');
            }
            $(label).append($template2)
            
            //set label styles
            var style = label.style;
            style.width = 90 + 'px';
            style.height = 40 + 'px';
            style.cursor = 'pointer';
            style.color = '#333';
            style.fontSize = '0.8em';
            style.textAlign= 'center';
            style.paddingTop = '3px';
        }, 
        onBeforePlotLine: function(adj){
            if (adj.nodeFrom.selected && adj.nodeTo.selected) {
                adj.data.$color = " #376e3d";
                adj.data.$lineWidth = 3;
            }
            else {
                delete adj.data.$color;
                delete adj.data.$lineWidth;
            }
        }
    });
    
    st.loadJSON(json);
   st.compute();
   
    st.geom.translate(new $jit.Complex(-200, 0), "current");
   
    st.onClick(st.root);
 


        var addFlag=true;
        $(document).on('click','#addNode',function(){
            if(addFlag){
                addFlag=false;
                //$(document).find('i.toggle').toggleClass('toggle');
                //$(this).find('i.fa').toggleClass('toggle');
                var _id=$(this).parents('.node').attr('id');
                st.onClick(_id,{
                    onComplete: function() {
                        addFlag=true;
                    }
                });
            }

        });
        findCurrent(json);
}
var idarr = [];//存放子节点不为空节点的ID；
function findCurrent(json) {
    if (json.children.length != 0) {
        idarr.push(json.id);
        $.each(json.children, function (key, value) {
            findCurrent(value);
        })
    }
    return idarr;
}

var lastId;
//循环data找出没有子节点的节点的id
function loopJson(json) {
   
    if (json.children.length == 0) {
        $('#' + json.id).find('.len4-wrap #addNode').css('visibility', 'hidden');
    } else {
        lastId = json.children[json.children.length - 1].id;
        console.log(lastId);
        if ($.inArray(lastId, idarr) == -1) {
            $('#' + lastId).find('.len4-wrap #addNode').css('visibility', 'hidden');
        }
        $.each(json.children, function (key, value) {
            loopJson(value);
        })
    }

}

