var labelType, useGradients, nativeTextSupport, animate;
var orientation;
var clickFlag = true;//检测鼠标移动
var st
if (orientation == "") {
    orientation = "top";
}
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


function init(data) {
    //init data
    var json = data.Data;
    var currentStaffNo = data.staff;

     st = new $jit.ST({
        //id of viz container element
        injectInto: 'infovis',
        //set duration for the animation
        duration: 600,
        constrained: true,
        levelsToShow: 10,
        //set animation transition type
        transition: $jit.Trans.Quart.easeInOut,
        //set distance between node and its children
        levelDistance: 50,
        //enable panning拖拽
        Navigation: {
            enable: true,
            panning: true
        },
        orientation: 'top',
        //set node and edge styles
        //set overridable=true for styling individual
        //nodes or edges
        Node: {
            height: 290,
            width: 155,
            type: 'rectangle',
            color: '#fff',
            background: 'fff',
            overridable: true
        },

        Edge: {
            type: 'bezier',
            color: 'rgba(0,0,0,0.8)',
            overridable: true
        },

        //This method is called on DOM label creation.
        //Use this method to add event handlers and styles to
        //your node.

        onCreateLabel: function (label, node) {

            label.id = node.id;
            var color1, color2, color3, key1, key2;

            switch (node.data.lossRisk) {
                case '高': color1 = 'height'; break;
                case '中': color1 = 'middle'; break;
                case '低': color1 = 'low'; break;
                case '/': color1 = 'grey'
            }
            switch (node.data.lossEffect) {
                case '高': color2 = 'height'; break;
                case '中': color2 = 'middle'; break;
                case '低': color2 = 'low'; break;
                case '/': color2 = 'grey'
            }
            switch (node.data.satisfactionDegree) {
                case '高': color3 = 'low'; break;
                case '中': color3 = 'middle'; break;
                case '低': color3 = 'height'; break;
                case '/': color3 = 'grey'
            }
            switch (node.data.keyPosition) {
                case true: key1 = '是'; break;
                case false: key1 = '否';
            }
            switch (node.data.successor) {
                case true: key2 = '有'; break;
                case false: key2 = '无';

            }
            var str1 = '<div class="len-box animated fadeIn keyPosition" data-staffno="" data-level="" data-dept="" data-deptDesc=""><div class="boxInner"><div class="top">' +
                '<div style="text-align:center;"><span style="display:none;">姓名：</span><span class="staffName"></span></div>' +
                '<div style="text-align:center;" class="imgWrap"><a class="J_menuItem" href="" name="个人详情"><span class="circle"><img class="img" src="" ondragstart="return false;" data-url="/TalentManagement/Demeanour/UserInfo?StaffNo=" data-name="个人详情"></a></div>'
                + '<div class="ellipsis"><span>职位：</span><span class="positionDescr " title=""></span></div>'
                + '<div class="ellipsis"><span>入职时间：</span><span class="dateJoin" title=""></span></span></div></div>'
                + '<div class="content">'

                 + '<div class="firstLeveldiv"><span class="color"><span></span></span><span>离职风险：</span><span class="lossRisk"></span></div>'
                 + '<div class="secondLevel"><span>人才类型：</span><span class="type"></span></div>'
                 + '<div class="thirdLevel"><span class="color"><span></span></span><span>对组织满意度：</span><span class="satisfactionDegree"></span></div>'
                 + '<div class=fouthLevel><span>继任者：</span><span class="successor"></span></div>'

                +'</div>'
            + '<div class="len-tip">'
                + '<a class="J_menuItem suggest" href="" name="意见征询" title="意见征询"><span class="fa fa-reorder ">&nbsp;</span><span class="jump jump1"></span></a>'
                + '<a class="personnaledit J_menuItem" href=""  name="人才盘点" title="人才盘点"><span class="fa fa-edit ">&nbsp;</span><span class="jump jump2"></span></a>'
           + '</div><div id="addNode" data-nodeClick="true"><span><i class="fa fa-sort-down">&nbsp;</i></span></div></div></div>';

            var $template1 = $(str1);
            //$template1.find(".staffNameShort").text(node.data.staffNameShort);


            $template1.find(".staffName").text(node.data.staffName);
            $template1.find(".positionDescr").text(node.data.positionDescr);
            $template1.find(".positionDescr").attr('title',node.data.positionDescr);
            $template1.find(".dateJoin").text(node.data.dateJoin);
            $template1.find(".dateJoin").attr('title',node.data.dateJoin);
            $template1.find(".lossRisk").text(node.data.lossRisk);
            $template1.find(".type").text("核心人才");
            $template1.find(".lossEffect").text(node.data.lossEffect);
            $template1.find(".keyPosition").text(key1);
            $template1.find(".satisfactionDegree").text(node.data.satisfactionDegree);
            $template1.find(".successor").text(key2);
            $template1.attr('data-staffno', node.data.staffNo);
            $template1.attr('data-dept', node.data.department);
            $template1.attr('data-deptDesc', node.data.departmentDescr);

            $template1.find(".firstLeveldiv .color span").removeClass().addClass(color1);
            $template1.find(".secondLevel .color span").removeClass().addClass(color2);
            $template1.find(".thirdLevel .color span").removeClass().addClass(color3);
            var imgUrl = '/TalentManagement/EmpInfo/GetPortrait?staffNo=';
            $template1.find('.top .img').attr('src', imgUrl + node.data.staffNo);
            $template1.attr('data-level', node._depth);
            if (node.data.childrenCount <= 0) {
                
                $template1.find('#addNode').addClass('arrownone')
            }
            //当前登录人
            if (node.data.staffNo == currentStaffNo) {
                $template1.addClass('currentStaff');
            }
            var str2 = '<div class=" len-box normal animated fadeIn" data-level="">'
                      + '<div class="content"><i class="fa fa-question-sign">？</i><span class="normalPosition">普通岗位名称</span></div>'
                      + '<div id="addNode" data-nodeClick="true"><i class="fa fa-sort-down">&nbsp;</i></div></div>';

            var $template2 = $(str2);
            $template2.find(".normalPosition").text(node.data.positionDescr);
            if (node.data.childrenCount == '0') {
                $template2.find('#addNode').addClass('arrownone')
            }
            $template2.attr('data-level', node._depth);
            var str3 = '<div class="len-box noneTop ">'
                     + '  <span >空</span>' + '</div>';
            var $template3 = $(str3);

            var firstBoxStr = '<div class="len-box firstLevelBox" data-staffNo="">'
                + '<div class="name"><span>&nbsp;&nbsp;</span></div>'
                + '<div class="imgWrap"><img class="img" data-url="/TalentManagement/Demeanour/UserInfo?StaffNo=" data-name="个人详情" src="" ondragstart="return false;" /></div>'

                + '</div>'
            var $firstBoxStr = $(firstBoxStr);
            $firstBoxStr.find('.name span').text(node.data.staffName)
            $firstBoxStr.find('.imgWrap img').attr('src', imgUrl + node.data.staffNo)
            $firstBoxStr.attr('data-staffNo', node.data.staffNo)

            if (node._depth == 0) {
                $(label).append($firstBoxStr);
            }else if (!node.data.coreMember) {
                $(label).append($template2);
            } else if (!node.data) {
                $(label).append($template3);
            } else {
                $(label).append($template1);
            }
          
            //检测拖动事件禁止点击
           
            var personalUrl = "/TalentManagement/Demeanour/UserInfo?StaffNo="; //个人详情url;
            var editUrl = "/TalentManagement/TalentReview?StaffNo="//人才盘点页面;
            var SuggestionUrl = 'TalentManagement/DynamicAdmin/SuggestionIndex?staffNo='//意见征询页面;
           

             //拖动时变为false,
            checkMove('.len-box');
            function checkMove(select) {
                var obj = $(select);
                var x1, y1, x2, y2, _x, _y;

                $(document).on('mousedown', obj, function (e) {
                    x1 = e.pageX;
                    y1 = e.pageY;
                    clickFlag = true;
                })

                $(document).on('mouseup', obj, function (e) {
                    x2 = e.pageX;
                    y2 = e.pageY;
                    _x = Math.abs(x1 - x2);
                    _y = Math.abs(y1 - y2);
                    if (_x < 7 && _y < 7) {
                        clickFlag = true;
                    } else {
                        clickFlag = false;
                    }
                })
            }

            $('.len-box').on('click', '.img', function () {
                if (clickFlag) {
                    //var url = $(".img").attr("data-url");
                    var url = $(this).attr('data-url');
                    //var name = $(".img").attr("data-name");
                    var name = $(this).attr('data-name');
                    var staffNoDiv = $(this).closest('.len-box');
                    var staffNo = staffNoDiv.attr('data-staffno');
                    $('.triggerClick').find('a').attr('href', url + staffNo);
                    $('.triggerClick').find('a').attr('name', name);
                    $('.triggerClick').find('a')[0].click();
                }
              


            })

            $(document).on('mousedown', '.len-box', function () {
               
                var staffno = $(this).attr('data-staffno');
                var dept = $(this).attr('data-dept');
                var deptDesc = $(this).attr('data-deptDesc');
                var staffName = $(this).find('.staffName').text();

                $(this).find('.top .J_menuItem').attr('href', personalUrl + staffno);
                $(this).find('.personnaledit').attr('href', editUrl + staffno + '&dept=' + dept + '&deptDesc=' + deptDesc + '&name=' + staffName);
                $(this).find('.suggest').attr('href', SuggestionUrl + staffno);
                
            });

            $(document).on('mousemove', '.len-box', function () {
                $(this).find('.top .J_menuItem').attr('href', '');
                $(this).find('.personnaledit').attr('href', '');
                $(this).find('.suggest').attr('href','');
                
            });
            var labelFlag = false;
           
            //set label styles
            var style = label.style;
            style.width = 365 + 'px';
            style.height = 141 + 'px';
            style.cursor = 'pointer';
            style.color = '#333';
            /*   style.fontSize = '0.8em';*/
            style.textAlign = 'center';
            style.paddingTop = '3px';
            /*node.class = "div_shadow";*/
        },

        //This method is called right before plotting
        //a node. It's useful for changing an individual node
        //style properties before plotting it.
        //The data properties prefixed with a dollar
        //sign will override the global node style properties.
        /*节点绘制之前*/

        

        onBeforePlotNode: function (node) {
            //add some color to the nodes in the path between the
            //root node and the selected node.
          
            if (node.selected) {
                /* node.data.$color = "#ff7";*/
            }
            else {
                delete node.data.$color;
                //if the node belongs to the last plotted level
                if (!node.anySubnode("exist")) {
                    //count children number
                    var count = 0;
                    node.eachSubnode(function (n) { count++; });
                  
                    //assign a node color based on
                    //how many children it has
                    /* node.data.$color = ['#aaa', '#baa', '#caa', '#daa', '#eaa', '#faa'][count];  */
                }
            }
        },

        //This method is called right before plotting
        //an edge. It's useful for changing an individual edge
        //style properties before plotting it.
        //Edge data proprties prefixed with a dollar sign will
        //override the Edge global style properties.
        /*画线前*/
        onAfterPlotNode: function () {
            var style1 = Node.style;

        },
        onBeforePlotLine: function (adj) {
            if (adj.nodeFrom.selected && adj.nodeTo.selected) {
                adj.data.$color = " #31c182";
                adj.data.$lineWidth = 3;
            }
            else {
                delete adj.data.$color;
                delete adj.data.$lineWidth;
            }
        }
    });
    //load json data
    st.loadJSON(json);
    //compute node positions and layout
    st.compute();
    //optional: make a translation of the tree
    st.geom.translate(new $jit.Complex(-200, 0), "current");
    //emulate仿真 a click on the root node.
    st.onClick(st.root);

    //end
    //Add event handlers to switch spacetree orientation./*方向*/
    var top = $jit.id('r-top'),
        left = $jit.id('r-left'),
        bottom = $jit.id('r-bottom'),
        right = $jit.id('r-right'),
        normal = $jit.id('s-normal');
    /*树状方向*/
    function changeHandler() {
        var _id = this.id.slice(2);
        top.style.cursor = left.style.cursor = bottom.style.cursor = right.style.cursor = "wait";
        st.switchPosition(_id, "animate", {
            onComplete: function () {
                top.style.cursor = left.style.cursor = bottom.style.cursor = right.style.cursor = "pointer";
            }
        });
    }
    //top.onclick = left.onclick = bottom.onclick = right.onclick = changeHandler;
    //end

}
